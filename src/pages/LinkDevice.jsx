import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import QRCode from 'qrcode';
import { ArrowLeftIcon, CopyIcon, CheckIcon } from '@radix-ui/react-icons';
import { useAuth } from '../contexts/AuthContext';
import { InstanceSelector } from '../components/auth/instance-selector';
import { getInstanceDisplayName } from '../lib/authInstanceStore';
import { BODY_SCROLL_MODE, useBodyScrollMode } from '../hooks/useBodyScrollMode';
import { getDeviceId } from '../hooks/useAuth';
import { useAuthInstanceSelection } from '../hooks/useAuthInstanceSelection.js';
import { Button as ShadcnButton } from '../components/ui/button.tsx';
import { Card } from '../components/ui/card.tsx';
import { Alert, AlertDescription } from '../components/ui/alert.tsx';
import ApproveDeviceLinkFlow from '../components/devices/ApproveDeviceLinkFlow.jsx';
import {
  consumeDeviceLinkResult,
  createDeviceLinkRequest,
} from '../lib/api';
import {
  buildLinkApprovalUrl,
  bytesToBase64,
  createDeviceIdentity,
  createSessionKeyPair,
  decodeQRPayload,
  decodeTransferBundle,
  decryptRelayPayload,
} from '../lib/deviceLinking';
import { downloadArchiveSession } from '../lib/linkArchiveSession';
import { deleteArchive } from '../lib/linkArchiveTransport';

const POLL_INITIAL_MS = 2000;
const POLL_BACKOFF_MULTIPLIER = 1.5;
const POLL_MAX_MS = 15000;

/**
 * Pull the encoded QR payload from a scanned string. Accepts either the
 * full approval URL produced by `buildLinkApprovalUrl` (with `?payload=…`)
 * or the bare base64 payload itself.
 *
 * @param {string} raw
 * @returns {string|null}
 */
function extractQRPayload(raw) {
  if (typeof raw !== 'string' || !raw.trim()) return null;
  const trimmed = raw.trim();
  try {
    const url = new URL(trimmed);
    const param = url.searchParams.get('payload');
    if (param) return param;
  } catch {
    // Not a URL — fall through.
  }
  return trimmed;
}

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

function LinkDeviceBackLink() {
  return (
    <ShadcnButton variant="ghost" size="lg" className="ld-back-link" asChild>
      <Link to="/">
        <ArrowLeftIcon data-icon="inline-start" /> Back
      </Link>
    </ShadcnButton>
  );
}

function NewDeviceLinkView({ onLinked, selectedInstanceUrl, knownInstances, onSelectInstance }) {
  const { completeDeviceLink, loading: authLoading } = useAuth();
  const [requestState, setRequestState] = useState(null);
  const [error, setError] = useState('');
  const [codeCopied, setCodeCopied] = useState(false);
  const handleCopyCode = useCallback(async () => {
    if (!requestState?.code) return;
    try {
      await navigator.clipboard.writeText(requestState.code);
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 1500);
    } catch {
      // Clipboard may be denied (HTTP, permission); fail silently — user
      // can still copy by hand from the displayed value.
    }
  }, [requestState?.code]);
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
    let inFinalize = false;
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

        // Past the polling stage. Errors that fire during the
        // finalize phase below are NOT poll-loop network blips and
        // must NOT trigger the "Connection lost. Retrying..." banner
        // — the flow is progressing forward, just doing crypto + a
        // chunked archive download. The downloadArchiveSession
        // transport already retries transient fetch errors
        // internally; anything that surfaces here is a real error.
        inFinalize = true;
        setStatus('Finalizing linked device…');
        const relayBytes = await decryptRelayPayload(result, requestState.sessionPrivateKey);
        const bundle = await decodeTransferBundle(relayBytes);

        // v3 chunked-archive bundle: pull the bulk archive over the chunked
        // transport, decrypt + reassemble, and patch its decoded contents
        // back onto the bundle so completeDeviceLink can keep using the
        // historySnapshot / guildMetadataKeySnapshot / transcriptBlob path.
        if (bundle.archive) {
          setStatus('Importing message history…');
          const importBaseUrl = bundle.instanceUrl || requestState.instanceUrl || window.location.origin;
          try {
            const fetched = await downloadArchiveSession({
              archive: bundle.archive,
              sessionPrivateKey: requestState.sessionPrivateKey,
              baseUrl: importBaseUrl,
              // Hand the unlocked root private key + userId in so the
              // chunked archive consumer can stream wire frames
              // straight into the per-user transcriptVault at-rest IDB
              // (no whole-rows array materialises on import).
              rootPrivateKey: bundle.rootPrivateKey,
              userId: bundle.userId,
            });
            bundle.historySnapshot = fetched.historySnapshot;
            bundle.guildMetadataKeySnapshot = fetched.guildMetadataKeySnapshot;
            bundle.transcriptBlob = fetched.transcriptBlob;
            if (Array.isArray(fetched.transcriptRows)) {
              bundle.transcriptRows = fetched.transcriptRows;
            }
            if (fetched.transcriptPersistedAtRest) {
              bundle.transcriptPersistedAtRest = true;
            }
          } catch (err) {
            console.error('[LinkDevice] chunked archive download failed', err);
            throw err;
          } finally {
            // Best-effort cleanup of server-side staging on EVERY exit
            // path — success and failure alike. On failure this frees
            // the per-user concurrent-archive quota slot so the next
            // device-link retry is not blocked by a stale `available`
            // archive (the server purger only reaps after the hard
            // deadline). On success this releases bytes the NEW device
            // already imported. The DELETE is idempotent and always
            // best-effort: the link is never blocked on this call.
            try {
              await deleteArchive(bundle.archive.id, {
                downloadToken: bundle.archive.downloadToken,
              }, importBaseUrl);
            } catch {
              // Server purger reaps; never block the link on cleanup.
            }
          }
        }

        await completeDeviceLink(bundle);
        if (bundle.archive?.transcriptBlobOmitted) {
          setStatus('Linked. Local message history was too large to transfer.');
        }
        onLinked();
      } catch (err) {
        if (cancelled) return;
        const rawMessage = err?.message || '';
        const isRetryableNetworkError = err instanceof TypeError
          || (err.name && err.name === 'AbortError')
          || rawMessage.includes('Could not reach ');
        // Only the polling phase's transient network errors should
        // surface as "Connection lost. Retrying..." — once we are in
        // the finalize phase, any error is a real failure (or has
        // already been retried internally by the transport layer)
        // and the banner must NOT appear, even if the underlying
        // exception happens to be a TypeError.
        if (!inFinalize && isRetryableNetworkError) {
          setConnectionLost(true);
          scheduleNext();
          return;
        }
        // Make sure a stale poll-phase banner doesn't linger across
        // a finalize-phase failure.
        setConnectionLost(false);
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

  const hasActiveRequest = Boolean(requestState && !isExpired);
  const hasCode = Boolean(requestState?.code);

  const placeholderMessage = error
    ? 'Could not create link request.'
    : authLoading
    ? 'Finalizing device link…'
    : isExpired
    ? 'Link request expired.'
    : hasActiveRequest
    ? 'QR unavailable. Use the fallback code below.'
    : 'Generating link request…';

  return (
    <Card className="glass home-form-card ld-card ld-new-card gap-0 ring-0 py-0">
      <div className="home-section-title">Link this device</div>
      <p className="ld-subtitle">
        Scan this QR code from a device that is already signed in to the same account.
      </p>

      {connectionLost && (
        <div className="ld-connection-lost">Connection lost. Retrying…</div>
      )}

      <section
        className="ld-qr-block"
        aria-label="Device link QR area"
        data-state={hasActiveRequest ? 'active' : 'pending'}
      >
        <div className="ld-qr-frame">
          {hasActiveRequest && requestState.qrDataUrl ? (
            <img
              className="ld-qr-image"
              src={requestState.qrDataUrl}
              alt="Device link QR code"
            />
          ) : (
            <div className="ld-qr-placeholder" role="status" aria-live="polite">
              {placeholderMessage}
            </div>
          )}
        </div>
        <div className="ld-qr-timer" aria-live="polite">
          {hasActiveRequest
            ? `Expires in ${formatCountdown(requestState.expiresAt, now)}`
            : ' '}
        </div>
      </section>

      <div className="ld-divider" role="separator" aria-orientation="horizontal">
        <span className="ld-divider-line" aria-hidden="true" />
        <span className="ld-divider-label">or use fallback code</span>
        <span className="ld-divider-line" aria-hidden="true" />
      </div>

      <div className="ld-code-block">
        <div
          className="ld-code-value"
          data-state={hasCode ? 'ready' : 'placeholder'}
          aria-label="Device link code"
        >
          {hasCode ? requestState.code : '——————'}
        </div>
        <ShadcnButton
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={handleCopyCode}
          aria-label="Copy device link code"
          data-state={codeCopied ? 'copied' : 'idle'}
          disabled={!hasCode}
          className="ld-code-copy"
        >
          {codeCopied
            ? <CheckIcon aria-hidden="true" />
            : <CopyIcon aria-hidden="true" />}
        </ShadcnButton>
      </div>

      <div className="ld-instance-row">
        <InstanceSelector
          instances={knownInstances.map((i) => getInstanceDisplayName(i.url))}
          active={getInstanceDisplayName(selectedInstanceUrl)}
          onSelect={(label) => {
            const match = knownInstances.find(
              (i) => getInstanceDisplayName(i.url) === label
            );
            onSelectInstance(match?.url ?? label);
          }}
          onAdd={(label) => {
            const url = label.startsWith('http') ? label : `https://${label}`;
            onSelectInstance(url);
          }}
        />
      </div>

      {status && <div className="ld-status">{status}</div>}
      {error && (
        <Alert variant="destructive" className="ld-error">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="auth-actions ld-footer">
        <LinkDeviceBackLink />
        <ShadcnButton
          variant="secondary"
          size="lg"
          className="flex-1 ld-footer-regen"
          onClick={() => setRefreshKey((value) => value + 1)}
        >
          Regenerate
        </ShadcnButton>
      </div>
    </Card>
  );
}


function ApproveLinkView({ initialPayload, unlockResumePath }) {
  const navigate = useNavigate();
  return (
    <ApproveDeviceLinkFlow
      mode="page"
      initialPayload={initialPayload}
      onCancel={() => navigate('/')}
      onVaultUnlockNeeded={() => navigate(unlockResumePath)}
    />
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
      </div>
    </div>
  );
}
