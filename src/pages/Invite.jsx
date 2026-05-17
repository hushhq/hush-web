import { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { LogInIcon, ServerIcon } from 'lucide-react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';

import { getInviteInfo, claimInvite } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { useInstanceContext } from '../contexts/InstanceContext';
import {
  decodeGuildMetadataKeyFromInvite,
  decodeGuildNameFromInvite,
} from '../lib/guildMetadata';
import {
  openGuildMetadataKeyStore,
  setGuildMetadataKeyBytes,
} from '../lib/guildMetadataKeyStore';
import { CROSS_INSTANCE_INVITES_UNSUPPORTED_MESSAGE } from '../lib/inviteLinks';
import { getDeviceId, HOME_INSTANCE_KEY } from '../hooks/useAuth';
import { buildGuildRouteRef } from '../lib/slugify';

const POST_CLAIM_SETUP_ERROR =
  'Membership is active, but local setup failed on this device. Retry to finish opening the server.';

function InvitePage({ children }) {
  return (
    <main className="flex min-h-svh w-full items-center justify-center bg-background px-4 py-8 text-foreground">
      {children}
    </main>
  );
}

function ReturnHomeButton() {
  return (
    <Button asChild variant="outline">
      <a href="/">Return to home</a>
    </Button>
  );
}

function InviteCard({
  title = "You're invited to join",
  guildName,
  description,
  memberCount,
  error,
  children,
}) {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="gap-3 text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-lg bg-muted text-muted-foreground">
          <ServerIcon />
        </div>
        <div className="flex flex-col gap-1">
          <CardDescription>{title}</CardDescription>
          {guildName ? (
            <CardTitle className="break-words text-xl">{guildName}</CardTitle>
          ) : null}
          {description ? (
            <CardDescription>{description}</CardDescription>
          ) : null}
        </div>
        {memberCount != null ? (
          <div>
            <Badge variant="secondary">
              {memberCount} member{memberCount !== 1 ? 's' : ''}
            </Badge>
          </div>
        ) : null}
      </CardHeader>
      {error ? (
        <CardContent>
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      ) : null}
      {children ? <CardFooter className="flex gap-2">{children}</CardFooter> : null}
    </Card>
  );
}

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

function normalizeOrigin(value) {
  if (!value) return null;
  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

function getStoredHomeInstanceUrl() {
  try {
    return localStorage.getItem(HOME_INSTANCE_KEY);
  } catch {
    return null;
  }
}

/**
 * Invite page - handles two URL patterns:
 *
 * 1. /invite/:code                   - same-instance invite (legacy)
 * 2. /join/:instance/:code           - cross-instance invite (blocked for MVP)
 *
 * Cross-instance flow:
 *   - Show a clear MVP unsupported message
 *   - Do not fetch invite info, boot a remote instance, or claim the invite
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
  const { hasSession, needsUnlock, user } = useAuth();
  const { bootInstance, getTokenForInstance, refreshGuilds } = useInstanceContext();

  /** Whether the route carries an explicit invite instance host. */
  const hasInstanceParam = Boolean(instanceParam);

  /** Canonical base URL for the invite instance. */
  const instanceUrl = useMemo(() => {
    if (!instanceParam) return null;
    return `https://${instanceParam}`;
  }, [instanceParam]);

  const isInviteForHomeInstance = useMemo(() => {
    if (!instanceUrl) return false;
    const inviteOrigin = normalizeOrigin(instanceUrl);
    const homeOrigin =
      normalizeOrigin(getStoredHomeInstanceUrl()) ??
      normalizeOrigin(window.location.origin);
    return Boolean(inviteOrigin && homeOrigin && inviteOrigin === homeOrigin);
  }, [instanceUrl]);

  /** Cross-instance invites are blocked for MVP. */
  const crossInstanceBlocked = hasInstanceParam && !isInviteForHomeInstance;

  const [invite, setInvite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [joining, setJoining] = useState(false);
  const [booting, setBooting] = useState(false);
  const [claimRecovery, setClaimRecovery] = useState(null);
  const unlockResumePath = useMemo(() => buildUnlockResumePath(location), [location]);

  // Guild name from URL fragment (#name=...) - server never receives it.
  const guildNameFromFragment = useMemo(() => {
    const hash = window.location.hash.slice(1);
    const params = new URLSearchParams(hash);
    const encoded = params.get('name');
    return encoded ? decodeGuildNameFromInvite(encoded) : null;
  }, []);

  const guildMetadataKeyFromFragment = useMemo(() => {
    const hash = window.location.hash.slice(1);
    const params = new URLSearchParams(hash);
    const encoded = params.get('mk');
    return encoded ? decodeGuildMetadataKeyFromInvite(encoded) : null;
  }, []);

  const guildName = guildNameFromFragment ?? 'a server';

  const storeInviteMetadataKey = useCallback(async (serverId) => {
    if (!serverId || !user?.id || !(guildMetadataKeyFromFragment instanceof Uint8Array)) {
      return;
    }
    const db = await openGuildMetadataKeyStore(user.id, getDeviceId());
    try {
      await setGuildMetadataKeyBytes(db, serverId, guildMetadataKeyFromFragment);
    } finally {
      db.close();
    }
  }, [guildMetadataKeyFromFragment, user?.id]);

  const completeJoinedMembership = useCallback(async (serverId, targetInstanceUrl) => {
    await storeInviteMetadataKey(serverId);
    await refreshGuilds(targetInstanceUrl);
    if (!serverId) {
      navigate('/home', { replace: true });
      return;
    }
    // Instance-aware route: /:instanceHost/:guildRouteRef. The legacy
    // /servers/:id/channels path now redirects to /home (App.jsx), which
    // would land the user on the empty home view instead of the joined
    // server. Build the host + ref ourselves; the guild name comes from
    // the invite fragment when present, otherwise the ref falls back to
    // the guild ID.
    let instanceHost;
    try {
      instanceHost = targetInstanceUrl ? new URL(targetInstanceUrl).host : null;
    } catch {
      instanceHost = null;
    }
    if (!instanceHost) {
      navigate('/home', { replace: true });
      return;
    }
    const ref = buildGuildRouteRef(guildNameFromFragment ?? serverId, serverId);
    navigate(`/${instanceHost}/${ref}`, { replace: true });
  }, [navigate, refreshGuilds, storeInviteMetadataKey, guildNameFromFragment]);

  const startClaimRecovery = useCallback((serverId, targetInstanceUrl) => {
    setClaimRecovery({ serverId, instanceUrl: targetInstanceUrl });
    setError(POST_CLAIM_SETUP_ERROR);
  }, []);

  const retryClaimRecovery = useCallback(async () => {
    if (!claimRecovery) {
      return;
    }
    setError(null);
    setJoining(true);
    try {
      await completeJoinedMembership(claimRecovery.serverId, claimRecovery.instanceUrl);
      setClaimRecovery(null);
    } catch {
      setError(POST_CLAIM_SETUP_ERROR);
    } finally {
      setJoining(false);
    }
  }, [claimRecovery, completeJoinedMembership]);

  // Cross-instance invite block (MVP).

  useEffect(() => {
    if (!crossInstanceBlocked) return;
    setLoading(false);
    setError(CROSS_INSTANCE_INVITES_UNSUPPORTED_MESSAGE);
  }, [crossInstanceBlocked]);

  // ── Invite info fetch ──────────────────────────────────────────────────

  useEffect(() => {
    if (crossInstanceBlocked) return;
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
  }, [code, crossInstanceBlocked, instanceUrl]);

  // ── Locked known-browser flow: redirect to canonical unlock/resume ───────

  useEffect(() => {
    if (!needsUnlock) return;
    navigate(unlockResumePath, { replace: true });
  }, [navigate, needsUnlock, unlockResumePath]);

  // ── Queue invite URL only for true no-session/no-vault auth flows ─────

  useEffect(() => {
    if (!hasSession && !needsUnlock && !crossInstanceBlocked) {
      // Store invite URL so Home.jsx can redirect back after authentication.
      sessionStorage.setItem('hush_pending_invite', window.location.href);
    }
  }, [crossInstanceBlocked, hasSession, needsUnlock]);

  // ── Same-instance authenticated flow: auto-claim ──────────────────────

  useEffect(() => {
    if (crossInstanceBlocked) return;
    if (!hasSession || needsUnlock || !invite || !code) return;
    let cancelled = false;

    async function claimSameInstanceInvite() {
      const sameInstanceUrl = instanceUrl ?? window.location.origin;
      setJoining(true);
      setError(null);
      setClaimRecovery(null);

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
        try {
          await completeJoinedMembership(serverId, sameInstanceUrl);
        } catch {
          if (!cancelled) {
            startClaimRecovery(serverId, sameInstanceUrl);
            setJoining(false);
          }
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
  }, [hasSession, needsUnlock, invite, code, instanceUrl, crossInstanceBlocked, bootInstance, getTokenForInstance, completeJoinedMembership, startClaimRecovery]);

  // ── Cross-instance: user pressed "Join" ──────────────────────────────

  const handleCrossInstanceJoin = useCallback(async () => {
    if (!instanceUrl || !code) return;
    if (crossInstanceBlocked) return;
    setError(null);
    setClaimRecovery(null);
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
      try {
        await completeJoinedMembership(serverId, instanceUrl);
      } catch {
        startClaimRecovery(serverId, instanceUrl);
      }
    } catch (err) {
      setError(inviteErrorMessage(err));
    } finally {
      setBooting(false);
      setJoining(false);
    }
  }, [instanceUrl, code, crossInstanceBlocked, bootInstance, getTokenForInstance, invite, completeJoinedMembership, startClaimRecovery]);

  // ── Unauthenticated flow: redirect to / with pending invite queued ────

  const handleUnauthenticated = useCallback(() => {
    sessionStorage.setItem('hush_pending_invite', window.location.href);
    navigate('/', { replace: true });
  }, [navigate]);

  // ── Render ─────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <InvitePage>
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground">
            <Spinner />
            <span>Loading invite...</span>
          </CardContent>
        </Card>
      </InvitePage>
    );
  }

  if (error && !invite) {
    return (
      <InvitePage>
        <InviteCard title="Invite unavailable" error={error}>
          <ReturnHomeButton />
        </InviteCard>
      </InvitePage>
    );
  }

  if (!invite) return null;

  // ── Cross-instance invite UI ──────────────────────────────────────────

  if (hasInstanceParam && !isInviteForHomeInstance) {
    const memberCount = invite.memberCount ?? invite.member_count ?? null;
    const isConnecting = booting || joining;

    return (
      <InvitePage>
        <InviteCard
          guildName={guildName}
          description={`Hosted on ${instanceParam}`}
          memberCount={memberCount}
          error={error}
        >
          {!hasSession || needsUnlock ? (
            <Button className="flex-1" onClick={handleUnauthenticated}>
              <LogInIcon data-icon="inline-start" />
              Log in to join
            </Button>
          ) : (
            <Button
              className="flex-1"
              onClick={claimRecovery ? retryClaimRecovery : handleCrossInstanceJoin}
              disabled={isConnecting}
            >
              {isConnecting ? <Spinner data-icon="inline-start" /> : null}
              {booting ? 'Connecting to instance...' : joining ? 'Joining...' : claimRecovery ? 'Retry setup' : 'Join'}
            </Button>
          )}
          <ReturnHomeButton />
        </InviteCard>
      </InvitePage>
    );
  }

  // ── Same-instance invite UI ───────────────────────────────────────────

  if (hasSession && !needsUnlock) {
    return (
      <InvitePage>
        <InviteCard guildName={guildName} error={error}>
          {error ? (
            <>
              {claimRecovery ? (
                <Button
                  className="flex-1"
                  onClick={retryClaimRecovery}
                  disabled={joining}
                >
                  {joining ? <Spinner data-icon="inline-start" /> : null}
                  {joining ? 'Retrying...' : 'Retry setup'}
                </Button>
              ) : null}
              <ReturnHomeButton />
            </>
          ) : (
            <div className="flex w-full items-center justify-center gap-2 text-sm text-muted-foreground">
              <Spinner />
              <span>Joining...</span>
            </div>
          )}
        </InviteCard>
      </InvitePage>
    );
  }

  // Unauthenticated same-instance: redirect to home with invite queued.
  return (
    <InvitePage>
      <InviteCard guildName={guildName} error={error}>
        <Button className="flex-1" onClick={handleUnauthenticated}>
          <LogInIcon data-icon="inline-start" />
          Log in to join
        </Button>
        <ReturnHomeButton />
      </InviteCard>
    </InvitePage>
  );
}
