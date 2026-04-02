import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import QRCode from 'qrcode';
import { useAuth } from '../contexts/AuthContext';
import { AuthInstanceSelector } from '../components/auth/AuthInstanceSelector.jsx';
import { BODY_SCROLL_MODE, useBodyScrollMode } from '../hooks/useBodyScrollMode';
import { getDeviceId } from '../hooks/useAuth';
import { useAuthInstanceSelection } from '../hooks/useAuthInstanceSelection.js';
import * as mlsStore from '../lib/mlsStore';
import {
  exportGuildMetadataKeySnapshot,
  openGuildMetadataKeyStore,
} from '../lib/guildMetadataKeyStore';
import {
  consumeDeviceLinkResult,
  createDeviceLinkRequest,
  resolveDeviceLinkRequest,
  verifyDeviceLinkRequest,
} from '../lib/api';
import {
  buildLinkApprovalUrl,
  bytesToBase64,
  certifyDevice,
  createDeviceIdentity,
  createSessionKeyPair,
  decodeQRPayload,
  decodeTransferBundle,
  decryptRelayPayload,
  encodeTransferBundle,
  encryptRelayPayload,
  base64ToBytes,
} from '../lib/deviceLinking';

const POLL_INITIAL_MS = 2000;
const POLL_BACKOFF_MULTIPLIER = 1.5;
const POLL_MAX_MS = 15000;

function formatCountdown(expiresAt, now = Date.now()) {
  const remaining = Math.max(0, Math.floor((new Date(expiresAt).getTime() - now) / 1000));
  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

function buildUnlockResumePath(location) {
  const current = `${location.pathname}${location.search}`;
  return `/?returnTo=${encodeURIComponent(current)}`;
}

function NewDeviceLinkView({ onLinked, selectedInstanceUrl, knownInstances, onSelectInstance }) {
  const { completeDeviceLink, loading: authLoading } = useAuth();
  const [requestState, setRequestState] = useState(null);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [now, setNow] = useState(() => Date.now());
  const [connectionLost, setConnectionLost] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function createRequest() {
      setError('');
      setStatus('');
      setRequestState(null);

      try {
        const instanceUrl = selectedInstanceUrl;
        const deviceIdentity = await createDeviceIdentity();
        const session = await createSessionKeyPair();
        const response = await createDeviceLinkRequest({
          devicePublicKey: deviceIdentity.publicKeyBase64,
          sessionPublicKey: session.publicKeyBase64,
          deviceId: getDeviceId(),
          instanceUrl,
        }, instanceUrl);
        let qrDataUrl = '';
        try {
          qrDataUrl = await QRCode.toDataURL(buildLinkApprovalUrl(window.location.origin, {
            requestId: response.requestId,
            secret: response.secret,
            expiresAt: response.expiresAt,
          }), {
            width: 240,
            margin: 2,
            errorCorrectionLevel: 'M',
          });
        } catch {}

        if (cancelled) return;
        setRequestState({
          ...response,
          instanceUrl,
          qrDataUrl,
          sessionPrivateKey: session.privateKey,
        });
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Failed to create a device link request.');
        }
      }
    }

    createRequest();
    return () => {
      cancelled = true;
    };
  }, [refreshKey, selectedInstanceUrl]);

  useEffect(() => {
    if (!requestState?.requestId || !requestState?.secret || !requestState?.sessionPrivateKey) return undefined;

    let cancelled = false;
    const expiresAtMs = new Date(requestState.expiresAt).getTime();
    let currentInterval = POLL_INITIAL_MS;
    let timerId = null;

    const scheduleNext = () => {
      if (cancelled) return;
      timerId = setTimeout(poll, currentInterval);
    };

    const poll = async () => {
      if (cancelled || Date.now() >= expiresAtMs) return;
      try {
        const result = await consumeDeviceLinkResult({
          requestId: requestState.requestId,
          secret: requestState.secret,
        }, requestState.instanceUrl);

        if (cancelled) return;

        // Successful HTTP response — clear connection-lost state and apply backoff.
        setConnectionLost(false);
        currentInterval = Math.min(currentInterval * POLL_BACKOFF_MULTIPLIER, POLL_MAX_MS);

        if (result?.status === 'pending') {
          scheduleNext();
          return;
        }

        setStatus('Finalizing linked device…');
        const relayBytes = await decryptRelayPayload(result, requestState.sessionPrivateKey);
        const bundle = decodeTransferBundle(relayBytes);
        await completeDeviceLink(bundle);
        onLinked();
      } catch (err) {
        if (cancelled) return;
        // Network-level errors (fetch rejected) trigger connection-loss banner.
        // Keep the same interval and retry.
        if (err instanceof TypeError || (err.name && err.name === 'AbortError')) {
          setConnectionLost(true);
          scheduleNext();
          return;
        }
        setError(err.message || 'Failed to finalize the device link.');
      }
    };

    poll();
    return () => {
      cancelled = true;
      if (timerId !== null) clearTimeout(timerId);
    };
  }, [completeDeviceLink, onLinked, requestState]);

  const isExpired = requestState
    ? new Date(requestState.expiresAt).getTime() <= now
    : false;

  return (
    <div className="glass home-form-card ld-card">
      <div className="home-section-title">Link this device</div>
      <p className="ld-subtitle">
        Scan this QR code from a device that is already signed in to the same account.
      </p>

      <AuthInstanceSelector
        value={selectedInstanceUrl}
        instances={knownInstances}
        onSelect={onSelectInstance}
        disabled={authLoading}
        compact
      />

      {connectionLost && (
        <div className="ld-connection-lost">Connection lost. Retrying...</div>
      )}

      {requestState && !isExpired ? (
        <>
          {requestState.qrDataUrl ? (
            <img className="ld-qr-image" src={requestState.qrDataUrl} alt="Device link QR code" />
          ) : (
            <div className="ld-empty-box">QR unavailable. Use the fallback code below.</div>
          )}
          <div className="ld-code-label">Desktop fallback code</div>
          <div className="ld-code-value">{requestState.code}</div>
          <div className="ld-timer">Expires in {formatCountdown(requestState.expiresAt, now)}</div>
          <div className="ld-waiting">
            <span className="ld-pulse">Waiting for approval<span className="ld-dots" /></span>
          </div>
        </>
      ) : (
        <div className="ld-empty-box">
          {error
            ? 'Could not create link request.'
            : authLoading
            ? 'Finalizing device link…'
            : isExpired
            ? 'Link request expired.'
            : 'Generating link request…'}
        </div>
      )}

      {status && <div className="ld-status">{status}</div>}
      {error && <div className="ld-error">{error}</div>}

      <div className="ld-actions">
        <button type="button" className="btn btn-secondary" onClick={() => setRefreshKey((value) => value + 1)}>
          Regenerate
        </button>
        <Link className="btn btn-secondary" to="/">
          Back
        </Link>
      </div>
    </div>
  );
}

function ApproveLinkView({ initialPayload, unlockResumePath }) {
  const navigate = useNavigate();
  const {
    user,
    token,
    loading,
    hasSession,
    hasVault,
    isVaultUnlocked,
    needsUnlock,
    identityKeyRef,
  } = useAuth();
  const [code, setCode] = useState('');
  const [claim, setClaim] = useState(null);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [isResolving, setIsResolving] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  const hasUnlockedIdentity = hasSession
    && isVaultUnlocked
    && !!identityKeyRef.current?.privateKey
    && !!identityKeyRef.current?.publicKey
    && !!token;
  const needsVaultUnlock = needsUnlock;

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const resolveRequest = useCallback(async (body) => {
    if (!token) return;
    setError('');
    setStatus('');
    setIsResolving(true);
    try {
      const resolved = await resolveDeviceLinkRequest(token, body);
      setClaim(resolved);
    } catch (err) {
      const rawMessage = err.message || '';
      if (rawMessage.includes('expired or already claimed')) {
        setError('Code expired or already used. Please generate a new link on the other device.');
      } else {
        setError(rawMessage || 'Failed to resolve the link request.');
      }
    } finally {
      setIsResolving(false);
    }
  }, [token]);

  useEffect(() => {
    if (!initialPayload?.requestId || !initialPayload?.secret || !hasUnlockedIdentity) return;
    resolveRequest({
      requestId: initialPayload.requestId,
      secret: initialPayload.secret,
    });
  }, [hasUnlockedIdentity, initialPayload, resolveRequest]);

  const handleResolveCode = useCallback(async (event) => {
    event.preventDefault();
    if (!code.trim()) {
      setError('Enter the code shown on the new device.');
      return;
    }
    await resolveRequest({ code: code.trim().toUpperCase() });
  }, [code, resolveRequest]);

  const handleApprove = useCallback(async () => {
    if (!claim || !token || !user?.id || !identityKeyRef.current?.privateKey || !identityKeyRef.current?.publicKey) {
      return;
    }

    setError('');
    setStatus('');
    setIsApproving(true);
    let historyDb = null;
    let metadataDb = null;
    try {
      historyDb = await mlsStore.openStore(user.id, getDeviceId());
      const historySnapshot = await mlsStore.exportHistorySnapshot(historyDb);
      metadataDb = await openGuildMetadataKeyStore(user.id, getDeviceId());
      const guildMetadataKeySnapshot = await exportGuildMetadataKeySnapshot(metadataDb);
      const transferBundle = encodeTransferBundle({
        userId: user.id,
        username: user.username,
        displayName: user.displayName,
        instanceUrl: claim.instanceUrl || window.location.origin,
        rootPrivateKey: identityKeyRef.current.privateKey,
        rootPublicKey: identityKeyRef.current.publicKey,
        historySnapshot,
        guildMetadataKeySnapshot,
      });
      const certificate = await certifyDevice(
        base64ToBytes(claim.devicePublicKey),
        identityKeyRef.current.privateKey,
      );
      const relayEnvelope = await encryptRelayPayload(transferBundle, claim.sessionPublicKey);

      await verifyDeviceLinkRequest(token, {
        claimToken: claim.claimToken,
        certificate: bytesToBase64(certificate),
        signingDeviceId: getDeviceId(),
        ...relayEnvelope,
      });

      setStatus('Device linked. Return to the new device to finish setup.');
    } catch (err) {
      const rawMessage = err.message || '';
      if (rawMessage.includes('Linking failed')) {
        setError('Linking failed. Please try again.');
      } else {
        setError(rawMessage || 'Failed to approve the device link.');
      }
    } finally {
      try {
        historyDb?.close();
      } catch {
        // Ignore close errors.
      }
      try {
        metadataDb?.close();
      } catch {
        // Ignore close errors.
      }
      setIsApproving(false);
    }
  }, [claim, identityKeyRef, token, user?.displayName, user?.id, user?.username]);

  if (loading) {
    return (
      <div className="glass home-form-card ld-card">
        <div className="ld-empty-box">Loading…</div>
      </div>
    );
  }

  if (needsVaultUnlock) {
    return (
      <div className="glass home-form-card ld-card">
        <div className="home-section-title">Approve device link</div>
        <p className="ld-subtitle">
          This browser is recognized for your Hush account, but the vault is locked in this tab.
          Unlock Hush, then return to approve the new device.
        </p>
        {initialPayload && (
          <div className="ld-status">
            QR request detected. Unlock this browser to resume approval automatically.
          </div>
        )}
        <div className="ld-actions">
          <button type="button" className="btn btn-primary" onClick={() => navigate(unlockResumePath)}>
            Unlock to approve
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/')}>
            Back
          </button>
        </div>
      </div>
    );
  }

  if (!hasUnlockedIdentity) {
    return (
      <div className="glass home-form-card ld-card">
        <div className="home-section-title">Approve device link</div>
        <p className="ld-subtitle">
          Open this page in a browser profile that is already signed in to the account you want to link.
        </p>
        {initialPayload && !hasVault && (
          <div className="ld-status">
            QR request detected. This browser does not have a local Hush vault for that account.
          </div>
        )}
        <div className="ld-actions">
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/')}>
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="glass home-form-card ld-card">
      <div className="home-section-title">Approve device link</div>
      <p className="ld-subtitle">
        Scan the QR from your phone camera or enter the fallback code shown on the new device.
      </p>

      {!claim && (
        <form className="ld-code-form" onSubmit={handleResolveCode}>
          <label htmlFor="device-link-code" className="ld-code-label">Link code</label>
          <input
            id="device-link-code"
            className="ld-code-input"
            value={code}
            onChange={(event) => setCode(event.target.value.toUpperCase())}
            placeholder="ABCD1234"
            autoCapitalize="characters"
            autoCorrect="off"
            spellCheck="false"
          />
          <button type="submit" className="btn btn-secondary" disabled={isResolving}>
            {isResolving ? 'Checking…' : 'Resolve code'}
          </button>
        </form>
      )}

      {claim && (
        <div className="ld-claim-summary">
          <div className="ld-summary-row">
            <span>Device ID</span>
            <strong>{claim.deviceId}</strong>
          </div>
          <div className="ld-summary-row">
            <span>Expires</span>
            <strong>{formatCountdown(claim.expiresAt, now)}</strong>
          </div>
          <div className="ld-summary-row">
            <span>Instance</span>
            <strong>{claim.instanceUrl || window.location.origin}</strong>
          </div>
        </div>
      )}

      {status && <div className="ld-status">{status}</div>}
      {error && <div className="ld-error">{error}</div>}

      <div className="ld-actions">
        {claim && (
          <button type="button" className="btn btn-primary" onClick={handleApprove} disabled={isApproving}>
            {isApproving ? 'Approving…' : 'Approve link'}
          </button>
        )}
        <button type="button" className="btn btn-secondary" onClick={() => navigate('/')}>
          Close
        </button>
      </div>
    </div>
  );
}

export default function LinkDevice() {
  useBodyScrollMode(BODY_SCROLL_MODE.SCROLL);

  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const {
    selectedInstanceUrl,
    knownInstances,
    chooseInstance,
  } = useAuthInstanceSelection();

  const isNewDeviceMode = searchParams.get('mode') === 'new';
  const qrPayload = useMemo(() => {
    const encoded = searchParams.get('payload');
    if (!encoded) return null;
    try {
      return decodeQRPayload(encoded);
    } catch {
      return null;
    }
  }, [searchParams]);
  const unlockResumePath = useMemo(() => buildUnlockResumePath(location), [location]);

  return (
    <div className="home-page ld-page">
      <div className="home-container ld-container">
        {isNewDeviceMode ? (
          <NewDeviceLinkView
            onLinked={() => navigate('/', { replace: true })}
            selectedInstanceUrl={selectedInstanceUrl}
            knownInstances={knownInstances}
            onSelectInstance={chooseInstance}
          />
        ) : (
          <ApproveLinkView initialPayload={qrPayload} unlockResumePath={unlockResumePath} />
        )}

        <div className="ld-footer-link">
          <Link to="/">Return to Hush</Link>
        </div>
      </div>
    </div>
  );
}
