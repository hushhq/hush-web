/**
 * DeviceManagement - device list with revoke + linking controls.
 *
 * Displayed inside UserSettingsModal (Devices tab).
 *
 * Props:
 *   token         - JWT for API calls
 *   currentDeviceId - device ID for this browser session (shows "This device" badge)
 */

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { listDeviceKeys, revokeDeviceKey } from '../lib/api.js';
import { getReadableDeviceLabel } from '../lib/deviceLabel.js';
import { TransparencyVerifier } from '../lib/transparencyVerifier.js';
import { bytesToHex } from '../lib/identityVault.js';
import { HOME_INSTANCE_KEY } from '../hooks/useAuth.js';
import ConfirmModal from './ConfirmModal.jsx';

function formatRelativeTime(dateStr) {
  if (!dateStr) return 'Never';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

/**
 * Returns a staleness tier based on days since lastSeen.
 *
 * @param {string|null} lastSeenStr - ISO timestamp string or null.
 * @returns {'warning' | 'critical' | null}
 */
function getDeviceStaleness(lastSeenStr) {
  if (!lastSeenStr) return null;
  const days = Math.floor((Date.now() - new Date(lastSeenStr).getTime()) / 86400000);
  if (days >= 90) return 'critical';
  if (days >= 30) return 'warning';
  return null;
}


function getDeviceDisplayLabel(device, currentDeviceId) {
  const label = typeof device?.label === 'string' ? device.label.trim() : '';
  if (label) return label;
  if (device?.deviceId === currentDeviceId) return getReadableDeviceLabel();
  // Last-resort fallback: never surface a raw UUID to the user. Show
  // a short identifying suffix so two unlabeled rows can still be
  // distinguished, but the visible string stays human-readable.
  if (device?.deviceId) {
    const suffix = device.deviceId.replace(/-/g, '').slice(0, 6);
    return `Unknown device (${suffix})`;
  }
  return 'Unknown device';
}

function getHomeInstanceUrl() {
  if (typeof window === 'undefined') {
    return null;
  }
  return localStorage.getItem(HOME_INSTANCE_KEY) || window.location.origin;
}

export default function DeviceManagement({ token, currentDeviceId, identityKeyRef, handshakeData, setTransparencyError }) {
  const navigate = useNavigate();
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmRevoke, setConfirmRevoke] = useState(null); // { deviceId, label }
  const [revoking, setRevoking] = useState(false);

  const fetchDevices = useCallback(async () => {
    if (!token) return;
    try {
      setError(null);
      const data = await listDeviceKeys(token);
      setDevices(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to load devices');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  // Verify the transparency log after a device operation. Gracefully degrades
  // when transparency props are not passed (e.g. legacy callers).
  const verifyTransparencyAfterOp = useCallback(async (opName) => {
    if (!handshakeData?.log_public_key || !identityKeyRef?.current?.publicKey) return;

    const homeInstanceUrl = getHomeInstanceUrl();
    if (!homeInstanceUrl) return;

    try {
      const pubKeyHex = bytesToHex(identityKeyRef.current.publicKey);
      const verifier = new TransparencyVerifier(
        homeInstanceUrl,
        handshakeData.log_public_key,
      );
      const result = await verifier.verifyOwnKey(pubKeyHex, token);
      if (!result.ok) {
        console.error(`[transparency] ${opName} was NOT logged correctly`);
        setTransparencyError?.(result.error);
      }
    } catch (err) {
      // Log but don't block - the operation itself succeeded.
      console.warn(`[transparency] post-${opName} verification failed:`, err);
    }
  }, [handshakeData, identityKeyRef, token, setTransparencyError]);

  const handleRevoke = useCallback(async () => {
    if (!confirmRevoke || !token) return;
    setRevoking(true);
    try {
      await revokeDeviceKey(token, confirmRevoke.deviceId);
      await verifyTransparencyAfterOp('device_revoke');
      await fetchDevices();
    } catch (err) {
      setError(err.message || 'Failed to revoke device');
    } finally {
      setRevoking(false);
      setConfirmRevoke(null);
    }
  }, [confirmRevoke, token, fetchDevices, verifyTransparencyAfterOp]);

  return (
    <>
      <div className="ist-header">
        Devices
      </div>

      <div className="dm-help">
        On the new device, open <strong>Link to existing device</strong> from the sign-in screen to
        show its QR code or fallback code.
        Use this page on your current signed-in device to scan that QR code or enter that fallback code and approve the link.
      </div>

      {error && <div className="dm-error">{error}</div>}

      {loading ? (
        <div className="dm-empty">Loading devices...</div>
      ) : devices.length === 0 ? (
        <div className="dm-empty">No devices registered.</div>
      ) : (
        <table className="dm-table">
          <thead>
            <tr>
              <th className="dm-th">Device</th>
              <th className="dm-th">Last active</th>
              <th className="dm-th">Linked</th>
              <th className="dm-th dm-th--right"></th>
            </tr>
          </thead>
          <tbody>
            {devices.map((device) => {
              const isCurrent = device.deviceId === currentDeviceId;
              const displayLabel = getDeviceDisplayLabel(device, currentDeviceId);
              const staleness = getDeviceStaleness(device.lastSeen);
              const isCriticallyStale = staleness === 'critical';
              return (
                <tr key={device.deviceId}>
                  <td className="dm-td">
                    <div className="dm-device-name">
                      <span>{displayLabel}</span>
                      {isCurrent && <span className="dm-this-badge">This device</span>}
                    </div>
                  </td>
                  <td className="dm-td">
                    <div>{formatRelativeTime(device.lastSeen)}</div>
                    {staleness === 'critical' && (
                      <div className="dm-stale-warning dm-stale-warning--critical">
                        Inactive 90+ days &mdash; consider revoking
                      </div>
                    )}
                    {staleness === 'warning' && (
                      <div className="dm-stale-warning dm-stale-warning--warning">
                        Inactive 30+ days
                      </div>
                    )}
                  </td>
                  <td className="dm-td">
                    {device.certifiedAt
                      ? new Date(device.certifiedAt).toLocaleDateString()
                      : '\u2014'}
                  </td>
                  <td className="dm-td dm-td--right">
                    {!isCurrent && (
                      <button
                        type="button"
                        className={`dm-revoke-btn${isCriticallyStale ? ' dm-revoke-btn--stale' : ''}`}
                        onClick={() => setConfirmRevoke({ deviceId: device.deviceId, label: displayLabel })}
                        title={`Revoke ${displayLabel}`}
                      >
                        Revoke
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      <div className="dm-actions">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => navigate('/link-device')}
        >
          Approve a new device
        </button>
      </div>

      {confirmRevoke && (
        <ConfirmModal
          title="Revoke device?"
          message={`Remove ${confirmRevoke.label} from your account. It will no longer be able to access your account.`}
          confirmLabel="Revoke device"
          confirmLoadingLabel="Revoking…"
          loading={revoking}
          onConfirm={handleRevoke}
          onCancel={() => setConfirmRevoke(null)}
        />
      )}
    </>
  );
}
