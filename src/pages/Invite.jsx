import { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { getInviteInfo, claimInvite } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { useInstanceContext } from '../contexts/InstanceContext';
import { decodeGuildNameFromInvite } from '../lib/guildMetadata';


function inviteErrorMessage(err) {
  const msg = err?.message || '';
  if (/not found|expired|no longer valid/i.test(msg)) return 'Invite not found or expired.';
  if (/already.*member|409/i.test(msg)) return 'You are already a member.';
  if (/banned/i.test(msg)) return 'You are banned from this guild.';
  if (/invalid|expired|400/i.test(msg)) return 'Invite is invalid or expired.';
  return msg || 'Something went wrong.';
}

function buildUnlockResumePath(location) {
  const current = `${location.pathname}${location.search}${location.hash}`;
  return `/?returnTo=${encodeURIComponent(current)}`;
}

/**
 * Invite page - handles two URL patterns:
 *
 * 1. /invite/:code                   - same-instance invite (legacy)
 * 2. /join/:instance/:code           - cross-instance invite (new)
 *
 * Cross-instance flow:
 *   - Show confirm modal with guild name + instance host
 *   - On confirm: bootInstance(instanceUrl) -> claimInvite -> navigate to guild
 *
 * Same-instance flow:
 *   - Authenticated: auto-claim invite -> navigate to guild
 *   - Unauthenticated: show auth prompt (redirect to home)
 *
 * Locked known-browser flow:
 *   - Redirect to /?returnTo=<invite path>
 *   - Unlock/re-auth happens via Home/Auth boot flow
 *   - Router resumes the invite after unlock
 */
export default function Invite() {
  const { code, instance: instanceParam } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { hasSession, needsUnlock } = useAuth();
  const { bootInstance, getTokenForInstance } = useInstanceContext();

  /** Whether this is a cross-instance invite. */
  const isCrossInstance = Boolean(instanceParam);

  /** Canonical base URL for the remote instance (cross-instance only). */
  const instanceUrl = useMemo(() => {
    if (!instanceParam) return null;
    return `https://${instanceParam}`;
  }, [instanceParam]);

  const [invite, setInvite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [joining, setJoining] = useState(false);
  const [booting, setBooting] = useState(false);
  const unlockResumePath = useMemo(() => buildUnlockResumePath(location), [location]);

  // Guild name from URL fragment (#name=...) - server never receives it.
  const guildNameFromFragment = useMemo(() => {
    const hash = window.location.hash.slice(1);
    const params = new URLSearchParams(hash);
    const encoded = params.get('name');
    return encoded ? decodeGuildNameFromInvite(encoded) : null;
  }, []);

  const guildName = guildNameFromFragment ?? 'a server';

  // ── Invite info fetch ──────────────────────────────────────────────────

  useEffect(() => {
    if (!code) {
      setLoading(false);
      setError('Invalid invite link.');
      return;
    }
    let cancelled = false;
    const baseUrl = instanceUrl ?? undefined;
    getInviteInfo(code, baseUrl)
      .then((data) => {
        if (!cancelled) {
          setInvite(data);
          setError(null);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setInvite(null);
          setError(inviteErrorMessage(err));
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [code, instanceUrl]);

  // ── Locked known-browser flow: redirect to canonical unlock/resume ───────

  useEffect(() => {
    if (!needsUnlock) return;
    navigate(unlockResumePath, { replace: true });
  }, [navigate, needsUnlock, unlockResumePath]);

  // ── Queue invite URL only for true no-session/no-vault auth flows ─────

  useEffect(() => {
    if (!hasSession && !needsUnlock) {
      // Store invite URL so Home.jsx can redirect back after authentication.
      sessionStorage.setItem('hush_pending_invite', window.location.href);
    }
  }, [hasSession, needsUnlock]);

  // ── Same-instance authenticated flow: auto-claim ──────────────────────

  useEffect(() => {
    if (isCrossInstance) return; // handled separately
    if (!hasSession || needsUnlock || !invite || !code) return;
    let cancelled = false;

    async function claimSameInstanceInvite() {
      const sameInstanceUrl = window.location.origin;
      setJoining(true);
      setError(null);

      try {
        let token = getTokenForInstance(sameInstanceUrl);
        if (!token) {
          await bootInstance(sameInstanceUrl);
          if (cancelled) return;
          token = getTokenForInstance(sameInstanceUrl);
        }
        if (!token) {
          throw new Error('Authentication failed for instance.');
        }

        const result = await claimInvite(token, code, sameInstanceUrl);
        if (cancelled) return;

        const serverId = result?.serverId ?? invite?.serverId;
        if (serverId) {
          navigate(`/servers/${serverId}/channels`, { replace: true });
        } else {
          navigate('/home', { replace: true });
        }
      } catch (err) {
        if (!cancelled) {
          setError(inviteErrorMessage(err));
          setJoining(false);
        }
      }
    }

    claimSameInstanceInvite();
    return () => {
      cancelled = true;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasSession, needsUnlock, invite, code, isCrossInstance, bootInstance, getTokenForInstance, navigate]);

  // ── Cross-instance: user pressed "Join" ──────────────────────────────

  const handleCrossInstanceJoin = useCallback(async () => {
    if (!instanceUrl || !code) return;
    setError(null);
    setBooting(true);

    try {
      // Step 1: Boot the remote instance (handshake -> auth -> WS -> guild fetch).
      await bootInstance(instanceUrl);

      // Step 2: Get the JWT for the now-connected instance.
      const jwt = getTokenForInstance(instanceUrl);
      if (!jwt) throw new Error('Authentication failed for instance.');

      // Step 3: Claim the invite on the remote instance.
      setJoining(true);
      const result = await claimInvite(jwt, code, instanceUrl);
      const serverId = result?.serverId ?? invite?.serverId;

      // Step 4: Navigate to the guild using instance-aware URL.
      if (serverId) {
        navigate(`/servers/${serverId}/channels`, { replace: true });
      } else {
        navigate(`/${instanceParam}`, { replace: true });
      }
    } catch (err) {
      setError(inviteErrorMessage(err));
    } finally {
      setBooting(false);
      setJoining(false);
    }
  }, [instanceUrl, code, bootInstance, getTokenForInstance, invite, instanceParam, navigate]);

  // ── Unauthenticated flow: redirect to / with pending invite queued ────

  const handleUnauthenticated = useCallback(() => {
    sessionStorage.setItem('hush_pending_invite', window.location.href);
    navigate('/', { replace: true });
  }, [navigate]);

  // ── Render ─────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="invite-page">
        <div className="glass invite-card">
          <p style={{ color: 'var(--hush-text-muted)', fontSize: '0.9rem' }}>Loading invite…</p>
        </div>
      </div>
    );
  }

  if (error && !invite) {
    return (
      <div className="invite-page">
        <div className="glass invite-card">
          <p className="invite-error">{error}</p>
          <a href="/" className="invite-link">Return to home</a>
        </div>
      </div>
    );
  }

  if (!invite) return null;

  // ── Cross-instance invite UI ──────────────────────────────────────────

  if (isCrossInstance) {
    const memberCount = invite.memberCount ?? invite.member_count ?? null;
    const isConnecting = booting || joining;

    return (
      <div className="invite-page">
        <div className="glass invite-card">
          <p className="invite-title">You're invited to join</p>
          <p className="invite-guild-name">{guildName}</p>
          <p className="invite-instance-host">hosted on {instanceParam}</p>
          {memberCount != null && (
            <p className="invite-member-count">{memberCount} member{memberCount !== 1 ? 's' : ''}</p>
          )}
          {error && <p className="invite-error">{error}</p>}
          {!hasSession || needsUnlock ? (
            <div className="invite-actions">
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleUnauthenticated}
                style={{ padding: '12px' }}
              >
                Sign in to join
              </button>
              <a href="/" className="invite-link">Return to home</a>
            </div>
          ) : (
            <div className="invite-actions">
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleCrossInstanceJoin}
                disabled={isConnecting}
                style={{ padding: '12px' }}
              >
                {booting ? 'Connecting to instance…' : joining ? 'Joining…' : 'Join'}
              </button>
              <a href="/" className="invite-link">Return to home</a>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Same-instance invite UI ───────────────────────────────────────────

  if (hasSession && !needsUnlock) {
    return (
      <div className="invite-page">
        <div className="glass invite-card">
          <p className="invite-title">You're invited to join</p>
          <p className="invite-guild-name">{guildName}</p>
          {error && <p className="invite-error">{error}</p>}
          {!error && (
            <p style={{ color: 'var(--hush-text-muted)', fontSize: '0.9rem' }}>Joining…</p>
          )}
          {error && (
            <div className="invite-actions">
              <a href="/" className="invite-link">Return to home</a>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Unauthenticated same-instance: redirect to home with invite queued.
  return (
    <div className="invite-page">
      <div className="glass invite-card">
        <p className="invite-title">You're invited to join</p>
        <p className="invite-guild-name">{guildName}</p>
        {error && <p className="invite-error">{error}</p>}
        <div className="invite-actions">
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleUnauthenticated}
            style={{ padding: '12px' }}
          >
            Sign in to join
          </button>
          <a href="/" className="invite-link">Return to home</a>
        </div>
      </div>
    </div>
  );
}
