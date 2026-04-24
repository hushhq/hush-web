import { useState, useContext } from 'react';
import { InstanceContext } from '../contexts/InstanceContext.jsx';
import ConfirmModal from './ConfirmModal.jsx';

// ── Connection status indicator ──────────────────────────────────────────────

/**
 * Returns the dot color and label for a given connectionState.
 * @param {string} state - 'connected'|'reconnecting'|'connecting'|'offline'
 * @returns {{ color: string, label: string }}
 */
function statusIndicator(state) {
  switch (state) {
    case 'connected':
      return { color: 'var(--hush-live)', label: 'connected' };
    case 'reconnecting':
    case 'connecting':
      return { color: '#f59e0b', label: state };
    default:
      return { color: 'var(--hush-danger)', label: 'offline' };
  }
}

// ── Instance row ─────────────────────────────────────────────────────────────

/**
 * A single row in the instance list.
 *
 * @param {{ instanceUrl: string, state: object, onDisconnect: Function }} props
 */
function InstanceRow({ instanceUrl, state, onDisconnect }) {
  const [confirming, setConfirming] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);

  let domain = instanceUrl;
  try {
    domain = new URL(instanceUrl).hostname;
  } catch {
    // fallback to raw URL if parse fails
  }

  const serverCount = state?.guilds?.length ?? 0;
  const serverLabel = serverCount === 1 ? '1 server' : `${serverCount} servers`;
  const indicator = statusIndicator(state?.connectionState ?? 'offline');

  const handleDisconnectClick = () => setConfirming(true);
  const handleCancel = () => setConfirming(false);

  const handleConfirm = async () => {
    setDisconnecting(true);
    try {
      await onDisconnect(instanceUrl);
    } finally {
      setDisconnecting(false);
      setConfirming(false);
    }
  };

  return (
    <div className="ist-row">
      <div className="ist-row-inner">
        {/* Status dot - color is dynamic per connection state */}
        <div
          className="ist-status-dot"
          style={{ background: indicator.color }}
          title={indicator.label}
        />

        {/* Domain + server count */}
        <div className="ist-row-info">
          <div className="ist-domain">{domain}</div>
          <div className="ist-sub">
            {serverCount === 0
              ? 'No servers'
              : serverCount === 1
                ? '1 server'
                : `${serverCount} servers`}
            {' · '}
            <span style={{ color: indicator.color }}>{indicator.label}</span>
          </div>
        </div>

        {/* Disconnect button - only shown when not already confirming */}
        {!confirming && (
          <button
            type="button"
            className="ist-disconnect-btn"
            onClick={handleDisconnectClick}
          >
            Disconnect
          </button>
        )}
      </div>

      {confirming && (
        <ConfirmModal
          title={`Disconnect from ${domain}?`}
          message={`This will leave all ${serverLabel} on this instance.`}
          confirmLabel="Disconnect"
          confirmLoadingLabel="Disconnecting…"
          loading={disconnecting}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}

// ── Main tab component ────────────────────────────────────────────────────────

/**
 * Settings tab for managing connected instances.
 * Renders in UserSettingsModal alongside Account, Appearance, Audio & Video, and Devices.
 *
 * Uses InstanceContext directly (does not throw if missing - graceful degradation for
 * environments where InstanceProvider has not been mounted yet).
 */
export default function InstancesSettingsTab() {
  const ctx = useContext(InstanceContext);

  const instanceStates = ctx?.instanceStates ?? new Map();
  const disconnectInstance = ctx?.disconnectInstance ?? null;

  const entries = Array.from(instanceStates.entries());

  return (
    <>
      <div className="ist-header">
        My Instances
      </div>

      {entries.length === 0 ? (
        <div className="ist-empty">
          <div className="ist-empty-title">No instances connected</div>
          <div className="ist-empty-hint">
            Join a server via invite link or create one to connect to an instance.
          </div>
        </div>
      ) : (
        <div>
          {entries.map(([instanceUrl, state]) => (
            <InstanceRow
              key={instanceUrl}
              instanceUrl={instanceUrl}
              state={state}
              onDisconnect={disconnectInstance ?? (() => Promise.resolve())}
            />
          ))}
        </div>
      )}

      <div className="ist-footer-note">
        Disconnecting from an instance leaves all servers on that instance and
        stops the connection. You can reconnect by joining a server via invite link.
      </div>
    </>
  );
}
