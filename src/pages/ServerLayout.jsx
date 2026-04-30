import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ServerList from '../components/ServerList';
import ChannelList from '../components/ChannelList';
import WorkspaceSidebarShell from '../components/layout/WorkspaceSidebarShell';
import MemberList from '../components/MemberList';
import SystemChannel from './SystemChannel';
import TextChannel from './TextChannel';
import VoiceChannel from './VoiceChannel';
import { getInstance, getGuildChannels, getGuildMembers, getHandshake } from '../lib/api';
import * as api from '../lib/api';
import { importMetadataKey, fromBase64, decryptGuildMetadata } from '../lib/guildMetadata';
import {
  getGuildMetadataKeyBytes,
  openGuildMetadataKeyStore,
  setGuildMetadataKeyBytes,
} from '../lib/guildMetadataKeyStore';
import { useAuth } from '../contexts/AuthContext';
import { useInstanceContext } from '../contexts/InstanceContext';
import { HOME_INSTANCE_KEY, JWT_KEY, getDeviceId } from '../hooks/useAuth';
import { bytesToHex } from '../lib/identityVault';
import { TransparencyVerifier } from '../lib/transparencyVerifier';
import { createInstanceApi } from '../lib/instanceApi';
import { useKeyPackageMaintenance } from '../hooks/useKeyPackageMaintenance';
import { useBreakpoint } from '../hooks/useBreakpoint';
import { useSidebarResize } from '../hooks/useSidebarResize';
import * as mlsStoreLib from '../lib/mlsStore';
import * as hushCryptoLib from '../lib/hushCrypto';
import * as mlsGroup from '../lib/mlsGroup';
import { withChannelMLSMutex, textChannelKey } from '../lib/channelMLSMutex';
import { buildGuildRouteRef, parseGuildRouteRef, slugify } from '../lib/slugify';
import ConfirmModal from '../components/ConfirmModal';
import DmListView from '../components/DmListView';
import EmptyState from '../components/EmptyState';
import GuildCreateModal from '../components/GuildCreateModal';
import { useToast } from '../hooks/useToast';
import Toast from '../components/Toast';
import { VoiceConnectedPanel } from '../components/Controls';
import UserPanel from '../components/UserPanel';
import { useConnectionQuality } from '../hooks/useConnectionQuality';
import { BODY_SCROLL_MODE, useBodyScrollMode } from '../hooks/useBodyScrollMode';
import ServerShell from '../components/layout/ServerShell';
import ChannelContent from '../components/layout/ChannelContent';

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Decode a base64 string to Uint8Array.
 * @param {string} b64
 * @returns {Uint8Array}
 */
function base64ToUint8ArraySL(b64) {
  const bin = atob(b64);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  return arr;
}

/**
 * Returns the local instance's fallback token from sessionStorage.
 * Used only when a guild has no instanceUrl (legacy single-instance guilds).
 * @returns {string|null}
 */
function getLocalToken() {
  return typeof window !== 'undefined'
    ? (sessionStorage.getItem(JWT_KEY) ?? sessionStorage.getItem('hush_token'))
    : null;
}

/**
 * Build the canonical instance-aware path for a guild.
 *
 * Guild IDs are embedded in the route reference so refreshes do not depend on
 * metadata decryption having already restored the human-readable name.
 *
 * @param {object} guild
 * @param {string|null} [channelId]
 * @returns {string|null}
 */
function buildGuildPath(guild, channelId = null) {
  if (!guild?.instanceUrl || !guild?.id) {
    return null;
  }

  try {
    const host = new URL(guild.instanceUrl).host;
    const routeRef = buildGuildRouteRef(guild._localName ?? guild.name ?? guild.id, guild.id);
    return channelId ? `/${host}/${routeRef}/${channelId}` : `/${host}/${routeRef}`;
  } catch {
    return null;
  }
}

/**
 * Attempt a one-time legacy migration from the old guild-metadata MLS group.
 *
 * This is compatibility-only. New guild metadata must come from the dedicated
 * guild metadata key store, not from a separate MLS metadata group.
 *
 * @param {IDBDatabase|null} db
 * @param {string} guildId
 * @returns {Promise<Uint8Array|null>}
 */
async function exportLegacyMetadataKeyFromStore(db, guildId) {
  if (!db) return null;
  try {
    const credential = await mlsStoreLib.getCredential(db);
    if (!credential) return null;
    const deps = {
      db,
      credential,
      mlsStore: mlsStoreLib,
      hushCrypto: hushCryptoLib,
    };
    const { metadataKeyBytes } = await mlsGroup.exportGuildMetadataKey(deps, guildId);
    return metadataKeyBytes;
  } catch {
    return null;
  }
}

/**
 * Try decrypting guild metadata with multiple candidate keys.
 *
 * @param {Uint8Array[]} keyCandidates
 * @param {string} encryptedMetadata
 * @returns {Promise<{ decrypted: { name?: string, icon?: string|null }, keyBytes: Uint8Array }|null>}
 */
async function decryptGuildMetadataWithCandidates(keyCandidates, encryptedMetadata) {
  const blob = fromBase64(encryptedMetadata);
  for (const keyBytes of keyCandidates) {
    try {
      const cryptoKey = await importMetadataKey(keyBytes);
      const decrypted = await decryptGuildMetadata(cryptoKey, blob);
      return { decrypted, keyBytes };
    } catch {
      // Try the next candidate key.
    }
  }
  return null;
}

/**
 * Returns the authenticated user's home instance URL when known.
 * Own-key transparency verification is only authoritative on the home instance
 * in T.1 because federated sessions do not create remote transparency entries.
 *
 * @returns {string|null}
 */
function getHomeInstanceUrl() {
  if (typeof window === 'undefined') {
    return null;
  }
  return localStorage.getItem(HOME_INSTANCE_KEY) || window.location.origin;
}

// ── Layout styles removed - see lay-* classes in global.css ──────────────────

// ── Main component ────────────────────────────────────────────────────────────

/**
 * ServerLayout - instance-aware guild layout.
 *
 * Supports two URL patterns:
 *   - /:instance/:guildSlug/:channelSlug? - new multi-instance routes
 *   - /servers/:serverId/*               - legacy single-instance routes
 *   - /home                              - no-guild empty state
 *
 * All API calls and WS subscriptions are routed through the active guild's
 * instanceUrl. When the active guild changes instance, the WS subscription
 * switches to that instance's WS client automatically.
 */
export default function ServerLayout() {
  useBodyScrollMode(BODY_SCROLL_MODE.LOCKED);

  const params = useParams();
  const navigate = useNavigate();
  // Stable ref for navigate - useNavigate() returns a new identity on every
  // navigation in React Router v6, which would cause useEffects that list it
  // as a dependency to re-fire on every route change.
  const navigateRef = useRef(navigate);
  navigateRef.current = navigate;

  // ── Instance context ────────────────────────────────────────────────────

  const {
    instanceStates,
    mergedGuilds,
    dmGuilds,
    getWsClient,
    getTokenForInstance,
    refreshGuilds,
    setChannelUnreadCount,
  } = useInstanceContext();

  // ── Auth ────────────────────────────────────────────────────────────────

  const { token: authToken, user, identityKeyRef, transparencyError, setTransparencyError } = useAuth();
  const currentUserId = user?.id ?? '';

  // ── URL param resolution ────────────────────────────────────────────────

  /**
   * Determine the active guild and channel from URL params.
   *
   * Supports two param shapes:
   *   - New: { instance, guildSlug, channelSlug }
   *   - Legacy: { serverId, '*' = 'channels/{channelId}' }
   */
  const { instance: instanceParam, guildSlug, channelSlug, serverId: legacyServerId } = params;
  const legacySplat = params['*'] ?? '';
  const legacyChannelId = legacySplat.startsWith('channels/')
    ? legacySplat.slice('channels/'.length)
    : undefined;

  /**
   * Find the active guild from mergedGuilds.
   *
   * For new-style routes: match by instance host + slug.
   * For legacy routes: match by serverId.
   */
  const activeGuild = useMemo(() => {
    const allGuilds = [...mergedGuilds, ...(dmGuilds ?? [])];
    if (legacyServerId) {
      return allGuilds.find((g) => g.id === legacyServerId) ?? null;
    }
    if (instanceParam && guildSlug) {
      const { guildId: guildIdFromRoute, slug: legacySlug } = parseGuildRouteRef(guildSlug);
      return allGuilds.find((g) => {
        if (!g.instanceUrl) return false;
        try {
          const host = new URL(g.instanceUrl).host;
          if (host !== instanceParam) return false;
        } catch {
          return false;
        }
        if (guildIdFromRoute) {
          return g.id === guildIdFromRoute;
        }
        const slug = slugify(g._localName ?? g.name ?? g.id ?? '');
        return slug === legacySlug;
      }) ?? null;
    }
    return null;
  }, [mergedGuilds, dmGuilds, legacyServerId, instanceParam, guildSlug]);

  /** The guild's server UUID (used in API calls). */
  const serverId = activeGuild?.id ?? legacyServerId ?? null;

  /** The instance URL for routing API and WS calls. */
  const instanceUrl = activeGuild?.instanceUrl ?? null;

  // Instance URL for DM operations when no guild is active (DM list mode).
  // Falls back to the first known instance so refreshGuilds is always callable.
  const dmInstanceUrl = instanceUrl ?? ([...instanceStates.keys()][0] ?? null);

  /** Per-instance JWT - falls back to local sessionStorage token for legacy paths. */
  const token = instanceUrl
    ? (getTokenForInstance(instanceUrl) ?? getLocalToken())
    : getLocalToken();

  /**
   * Derive the active channel ID from either URL pattern.
   * New-style: channelSlug is a channel UUID (channels use UUIDs as slugs for now).
   * Legacy-style: parsed from /* splat.
   */
  const channelId = channelSlug ?? legacyChannelId;
  const homeInstanceUrl = getHomeInstanceUrl();

  useEffect(() => {
    if (!activeGuild || !instanceParam || !guildSlug) {
      return;
    }
    if (parseGuildRouteRef(guildSlug).guildId) {
      return;
    }
    const canonicalPath = buildGuildPath(activeGuild, channelId ?? null);
    if (!canonicalPath) {
      return;
    }
    navigateRef.current(canonicalPath, { replace: true });
  }, [activeGuild, channelId, guildSlug, instanceParam]);

  /** Per-instance WS client, or null if not connected / no instance. */
  const wsClient = instanceUrl ? getWsClient(instanceUrl) : null;

  /**
   * Bound API client for the active guild's instance.
   * Re-created when instanceUrl changes. Pass to MLS deps instead of raw api module.
   */
  const instanceApi = useMemo(() => {
    if (!instanceUrl) return null;
    return createInstanceApi(instanceUrl, () => getTokenForInstance(instanceUrl));
  }, [instanceUrl, getTokenForInstance]);

  /** Real-time connection quality from WS ping/pong. */
  const connQuality = useConnectionQuality(wsClient);

  /** Whether the active instance is offline. */
  const isInstanceOffline = instanceUrl
    ? instanceStates.get(instanceUrl)?.connectionState === 'offline'
    : false;

  // ── UI state ────────────────────────────────────────────────────────────

  const breakpoint = useBreakpoint();
  const [instanceData, setInstanceData] = useState(null);
  const [handshakeData, setHandshakeData] = useState(null);
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [onlineUserIds, setOnlineUserIds] = useState(() => new Set());
  const [members, setMembers] = useState([]);
  const [openPanel, setOpenPanel] = useState(null); // 'members' | 'chat' | 'participants' | null
  const togglePanel = useCallback((name) => setOpenPanel((prev) => prev === name ? null : name), []);
  const showMembers = openPanel === 'members';
  const showChatPanel = openPanel === 'chat';
  const showParticipantsPanel = openPanel === 'participants';

  // Persistent voice session - survives channel navigation until Leave is clicked.
  const [activeVoiceChannel, setActiveVoiceChannel] = useState(null);
  const [pendingVoiceSwitch, setPendingVoiceSwitch] = useState(null);
  const activeVoiceMemberIdsRef = useRef([]);
  const voiceControlsRef = useRef(null);
  const [voiceMicOn, setVoiceMicOn] = useState(false);
  const [voiceDeafened, setVoiceDeafened] = useState(false);
  const [voiceScreenSharing, setVoiceScreenSharing] = useState(false);
  const [voiceWebcamOn, setVoiceWebcamOn] = useState(false);
  const handleVoiceStateChange = useCallback(({ isMicOn: mic, isDeafened: deaf, isScreenSharing: screen, isWebcamOn: cam }) => {
    setVoiceMicOn(mic);
    setVoiceDeafened(deaf);
    if (screen !== undefined) setVoiceScreenSharing(screen);
    if (cam !== undefined) setVoiceWebcamOn(cam);
  }, []);
  const leavingVoiceRef = useRef(false);

  const [orbPhase, setOrbPhase] = useState('idle');

  // Voice participants per channel (server-authoritative via LiveKit webhooks).
  const [voiceParticipants, setVoiceParticipants] = useState(() => new Map());

  // Remote participants' mute/deafen state: Map<userId, { isMuted, isDeafened }>
  const [voiceMuteStates, setVoiceMuteStates] = useState(() => new Map());

  const { width: sidebarWidth, handleMouseDown: handleSidebarResize } = useSidebarResize();
  const [requestOpenSettings, setRequestOpenSettings] = useState(false);

  const isMobile = breakpoint === 'mobile';
  const [showDrawer, setShowDrawer] = useState(false);
  const closeDrawer = useCallback(() => setShowDrawer(false), []);
  const toggleDrawer = useCallback(() => setShowDrawer(p => !p), []);

  // Mobile stack navigation: 1 = server+channel list, 2 = channel content
  const [mobileStack, setMobileStack] = useState(1);
  const [memberDrawerOpen, setMemberDrawerOpen] = useState(false);
  const [dmMode, setDmMode] = useState(false);
  const [showGuildCreateModal, setShowGuildCreateModal] = useState(false);
  const closeMemberDrawer = useCallback(() => setMemberDrawerOpen(false), []);
  const toggleMemberDrawer = useCallback(() => setMemberDrawerOpen((p) => !p), []);

  // Pop back to stack 1 (channels list) on mobile
  const handleMobileBack = useCallback(() => {
    setMobileStack(1);
    setMemberDrawerOpen(false);
    // If viewing a DM, go back to DM list
    if (activeGuild?.isDm) setDmMode(true);
  }, [activeGuild]);

  const handleDmOpen = useCallback(() => {
    setDmMode(true);
  }, []);

  const handleMarkRead = useCallback((markedChannelId) => {
    if (!instanceUrl || !setChannelUnreadCount) return;
    setChannelUnreadCount(instanceUrl, markedChannelId, 0);
  }, [instanceUrl, setChannelUnreadCount]);

  const { toasts, show: showToast } = useToast();

  const isViewingVoice = activeVoiceChannel != null && channelId === activeVoiceChannel.id;

  const handleOrbPhaseChange = useCallback((phase) => {
    setOrbPhase((prev) => {
      if (!isViewingVoice) return 'idle';
      if (leavingVoiceRef.current) return 'idle';
      const guard = phase === 'idle' && (prev === 'waiting' || prev === 'activating');
      if (guard) return prev;
      if (phase === 'idle') leavingVoiceRef.current = false;
      return phase;
    });
  }, [isViewingVoice]);

  useEffect(() => {
    if (!isViewingVoice) setOrbPhase('idle');
  }, [isViewingVoice]);

  // Close mobile drawer and push to stack 2 when navigating to a channel
  useEffect(() => {
    if (isMobile) {
      setShowDrawer(false);
      if (channelId) {
        setMobileStack(2);
      }
    }
  }, [channelId, isMobile]);

  useEffect(() => {
    leavingVoiceRef.current = false;
  }, [channelId]);

  const memberIds = members.map((m) => m.id ?? m.userId);

  // ── Resolved guild name ────────────────────────────────────────────────

  /**
   * @param {string} guildId
   * @param {Uint8Array} keyBytes
   * @returns {Promise<void>}
   */
  const rememberMetadataKey = useCallback(async (guildId, keyBytes) => {
    if (!currentUserId || !guildId || !(keyBytes instanceof Uint8Array)) {
      return;
    }
    const db = await openGuildMetadataKeyStore(currentUserId, getDeviceId());
    try {
      await setGuildMetadataKeyBytes(db, guildId, keyBytes);
    } finally {
      db.close();
    }
  }, [currentUserId]);

  /**
   * Returns candidate guild metadata keys, preferring the dedicated key store
   * and falling back to a one-time legacy MLS migration path when needed.
   *
   * @param {string} guildId
   * @returns {Promise<Uint8Array[]|null>}
   */
  const getMetadataKeys = useCallback(async (guildId) => {
    if (!currentUserId || !guildId) return null;
    const keyDb = await openGuildMetadataKeyStore(currentUserId, getDeviceId());
    try {
      const storedKey = await getGuildMetadataKeyBytes(keyDb, guildId);
      if (storedKey) {
        return [storedKey];
      }
    } finally {
      keyDb.close();
    }

    const candidates = [];
    const activeDb = await mlsStoreLib.openStore(currentUserId, getDeviceId());
    let activeKey = null;
    try {
      activeKey = await exportLegacyMetadataKeyFromStore(activeDb, guildId);
    } finally {
      activeDb.close();
    }
    if (activeKey) {
      candidates.push(activeKey);
    }

    // History key must be exported in an isolated cache scope. Without this,
    // preloadGroupState(historyDb) skips keys already present from the active
    // store, so the WASM export reads active-store state instead of history.
    const historyDb = await mlsStoreLib.openHistoryStore(currentUserId, getDeviceId());
    let historyKey = null;
    try {
      historyKey = await mlsStoreLib.withReadOnlyHistoryScope(historyDb, (db) => {
        return exportLegacyMetadataKeyFromStore(db, guildId);
      });
    } finally {
      historyDb.close();
    }
    if (historyKey) {
      const historyHex = bytesToHex(historyKey);
      if (!candidates.some((candidate) => bytesToHex(candidate) === historyHex)) {
        candidates.push(historyKey);
      }
    }
    return candidates;
  }, [currentUserId]);

  const getMetadataKey = useCallback(async (guildId) => {
    const candidates = await getMetadataKeys(guildId);
    return candidates?.[0] ?? null;
  }, [getMetadataKeys]);

  const [activeGuildName, setActiveGuildName] = useState(null);
  const [activeGuildKeyBytes, setActiveGuildKeyBytes] = useState(null);

  const getActiveGuildMetadataKey = useCallback(async () => {
    if (activeGuildKeyBytes instanceof Uint8Array) {
      return activeGuildKeyBytes;
    }
    if (!activeGuild?.id) {
      return null;
    }
    return getMetadataKey(activeGuild.id);
  }, [activeGuild?.id, activeGuildKeyBytes, getMetadataKey]);

  useEffect(() => {
    const { guildId: guildIdFromRoute, slug: legacySlug } = parseGuildRouteRef(guildSlug ?? '');
    if (activeGuild || !instanceParam || !guildSlug || guildIdFromRoute) {
      return;
    }

    let cancelled = false;

    const resolveLegacyGuildRoute = async () => {
      const instanceGuilds = mergedGuilds.filter((guild) => {
        try {
          return guild.instanceUrl && new URL(guild.instanceUrl).host === instanceParam;
        } catch {
          return false;
        }
      });

      for (const guild of instanceGuilds) {
        const localSlug = slugify(guild._localName ?? guild.name ?? guild.id ?? '');
        if (localSlug === legacySlug) {
          const canonicalPath = buildGuildPath(guild, channelId ?? null);
          if (!cancelled && canonicalPath) {
            navigateRef.current(canonicalPath, { replace: true });
          }
          return;
        }
        if (!guild.encryptedMetadata) {
          continue;
        }
        const keyCandidates = await getMetadataKeys(guild.id);
        const decrypted = keyCandidates?.length
          ? await decryptGuildMetadataWithCandidates(keyCandidates, guild.encryptedMetadata)
          : null;
        if (slugify(decrypted?.decrypted?.name ?? '') !== legacySlug) {
          continue;
        }
        await rememberMetadataKey(guild.id, decrypted.keyBytes);
        guild._localName = decrypted.decrypted.name;
        const canonicalPath = buildGuildPath(guild, channelId ?? null);
        if (!cancelled && canonicalPath) {
          navigateRef.current(canonicalPath, { replace: true });
        }
        return;
      }
    };

    resolveLegacyGuildRoute().catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [activeGuild, channelId, getMetadataKeys, guildSlug, instanceParam, mergedGuilds, rememberMetadataKey]);

  useEffect(() => {
    if (!activeGuild) {
      setActiveGuildName(null);
      setActiveGuildKeyBytes(null);
      return;
    }
    if (!activeGuild.encryptedMetadata) {
      setActiveGuildName(activeGuild._localName ?? activeGuild.name ?? null);
      setActiveGuildKeyBytes(null);
      return;
    }
    // Try plaintext JSON decode first (fallback when MLS not bootstrapped).
    const nameFallback = activeGuild._localName ?? activeGuild.name ?? null;
    try {
      const decoded = new TextDecoder().decode(
        Uint8Array.from(atob(activeGuild.encryptedMetadata), c => c.charCodeAt(0))
      );
      const parsed = JSON.parse(decoded);
      if (parsed.n || parsed.name) {
        setActiveGuildName(parsed.n || parsed.name);
        setActiveGuildKeyBytes(null);
        return;
      }
    } catch { /* Not plaintext JSON - try MLS decryption below */ }

    getMetadataKeys(activeGuild.id).then(async (keyCandidates) => {
      if (!keyCandidates?.length) {
        setActiveGuildName(nameFallback);
        setActiveGuildKeyBytes(null);
        return;
      }
      const decrypted = await decryptGuildMetadataWithCandidates(keyCandidates, activeGuild.encryptedMetadata);
      if (decrypted?.decrypted?.name) {
        await rememberMetadataKey(activeGuild.id, decrypted.keyBytes);
        activeGuild._localName = decrypted.decrypted.name;
        setActiveGuildName(decrypted.decrypted.name);
        setActiveGuildKeyBytes(decrypted.keyBytes);
        return;
      }
      setActiveGuildName(nameFallback);
      setActiveGuildKeyBytes(null);
    }).catch(() => {
      setActiveGuildName(nameFallback);
      setActiveGuildKeyBytes(null);
    });
  }, [activeGuild, getMetadataKeys, rememberMetadataKey]);

  useEffect(() => {
    if (!activeGuild?.id || channels.length === 0) return;

    let cancelled = false;
    const refreshChannelNames = async () => {
      const keyCandidates = await getMetadataKeys(activeGuild.id);
      if (!keyCandidates?.length || cancelled) return;

      const nextChannels = await Promise.all(channels.map(async (channel) => {
        if (channel.name || !channel.encryptedMetadata) return channel;
        try {
          const decrypted = await decryptGuildMetadataWithCandidates(keyCandidates, channel.encryptedMetadata);
          const name = decrypted?.decrypted?.name;
          if (!name) return channel;
          await rememberMetadataKey(activeGuild.id, decrypted.keyBytes);
          return { ...channel, name };
        } catch {
          return channel;
        }
      }));

      if (cancelled) return;
      const changed = nextChannels.some((channel, index) => channel !== channels[index]);
      if (changed) {
        setChannels(nextChannels);
      }
    };

    refreshChannelNames().catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [activeGuild?.id, channels, getMetadataKeys, rememberMetadataKey]);

  // ── MLS KeyPackage maintenance ─────────────────────────────────────────

  useKeyPackageMaintenance({
    token,
    userId: currentUserId,
    deviceId: getDeviceId(),
    threshold: handshakeData?.key_package_low_threshold ?? null,
    wsClient,
    baseUrl: instanceUrl ?? '',
  });

  // ── WS event handlers ─────────────────────────────────────────────────

  // Track the last subscribed serverId so we can unsubscribe on guild switch.
  const prevServerIdRef = useRef(null);

  useEffect(() => {
    if (!wsClient || !serverId) return;
    const subscribe = () => {
      const prev = prevServerIdRef.current;
      if (prev && prev !== serverId) {
        wsClient.send('unsubscribe.server', { server_id: prev });
      }
      wsClient.send('subscribe.server', { server_id: serverId });
      prevServerIdRef.current = serverId;
    };
    subscribe();
    wsClient.on('open', subscribe);
    return () => wsClient.off('open', subscribe);
  }, [wsClient, serverId]);

  useEffect(() => {
    if (!wsClient) return;
    const handler = (data) => setOnlineUserIds(new Set(data.user_ids ?? []));
    wsClient.on('presence.update', handler);
    return () => wsClient.off('presence.update', handler);
  }, [wsClient]);

  // Voice state updates from LiveKit webhooks
  useEffect(() => {
    if (!wsClient) return;
    const handler = (data) => {
      const { channel_id, participants } = data;
      if (!channel_id) return;
      setVoiceParticipants((prev) => {
        const next = new Map(prev);
        if (!participants || participants.length === 0) {
          next.delete(channel_id);
        } else {
          next.set(channel_id, participants);
        }
        return next;
      });
    };
    wsClient.on('voice_state_update', handler);
    return () => wsClient.off('voice_state_update', handler);
  }, [wsClient]);

  // voice.mute_state: track remote participants' mute/deafen overlays
  useEffect(() => {
    if (!wsClient) return;
    const handler = (data) => {
      if (!data.user_id) return;
      setVoiceMuteStates((prev) => {
        const next = new Map(prev);
        next.set(data.user_id, { isMuted: !!data.is_muted, isDeafened: !!data.is_deafened });
        return next;
      });
    };
    wsClient.on('voice.mute_state', handler);
    return () => wsClient.off('voice.mute_state', handler);
  }, [wsClient]);

  // channel_created: append to local channel list (guild-scoped)
  useEffect(() => {
    if (!wsClient) return;
    const handler = (data) => {
      if (!data.channel) return;
      if (data.server_id && data.server_id !== serverId) return;
      // Extract name from base64 metadata (same as initial fetch processing).
      const ch = { ...data.channel };
      if (!ch.name && ch.encryptedMetadata) {
        try {
          const decoded = new TextDecoder().decode(
            Uint8Array.from(atob(ch.encryptedMetadata), c => c.charCodeAt(0))
          );
          const parsed = JSON.parse(decoded);
          ch.name = parsed.n || parsed.name || '';
        } catch { /* encrypted blob */ }
      }
      setChannels((prev) => {
        if (prev.some((c) => c.id === ch.id)) return prev;
        return [...prev, ch];
      });
    };
    wsClient.on('channel_created', handler);
    return () => wsClient.off('channel_created', handler);
  }, [wsClient, serverId]);

  // channel_deleted: remove from local list, tear down voice, redirect if viewing (guild-scoped)
  useEffect(() => {
    if (!wsClient) return;
    const handler = (data) => {
      if (!data.channel_id) return;
      if (data.server_id && data.server_id !== serverId) return;
      setChannels((prev) => prev.filter((ch) => ch.id !== data.channel_id));
      setActiveVoiceChannel((prev) => {
        if (prev?.id === data.channel_id) {
          activeVoiceMemberIdsRef.current = [];
          return null;
        }
        return prev;
      });
      if (channelId === data.channel_id) {
        navigateToGuild(serverId);
      }
    };
    wsClient.on('channel_deleted', handler);
    return () => wsClient.off('channel_deleted', handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wsClient, channelId, serverId]);

  // channel_moved: refetch channel list for correct ordering (guild-scoped)
  useEffect(() => {
    if (!wsClient) return;
    const handler = (data) => {
      if (data.server_id && data.server_id !== serverId) return;
      if (token && serverId && instanceUrl) {
        getGuildChannels(token, serverId, instanceUrl).then(c => setChannels(parseChannelNames(c))).catch(() => {});
      }
    };
    wsClient.on('channel_moved', handler);
    return () => wsClient.off('channel_moved', handler);
  }, [wsClient, serverId, token, instanceUrl]);

  // instance_updated: refresh instance metadata
  useEffect(() => {
    if (!wsClient) return;
    const handler = (data) => {
      setInstanceData((prev) => {
        if (!prev) return prev;
        const updated = { ...prev };
        if (data.name !== undefined) updated.name = data.name;
        if (data.icon_url !== undefined) updated.iconUrl = data.icon_url;
        if (data.registration_mode !== undefined) updated.registrationMode = data.registration_mode;
        return updated;
      });
    };
    wsClient.on('instance_updated', handler);
    return () => wsClient.off('instance_updated', handler);
  }, [wsClient]);

  // ── Navigation helpers ────────────────────────────────────────────────

  /**
   * Navigate to a guild using the new instance-aware URL, or legacy URL as fallback.
   * @param {string|null} guildId
   * @param {string|null} [chId]
   */
  const navigateToGuild = useCallback((guildId, chId) => {
    if (!guildId) {
      navigateRef.current('/home', { replace: true });
      return;
    }
    const guild = mergedGuilds.find((g) => g.id === guildId) ?? (dmGuilds ?? []).find((g) => g.id === guildId);
    const path = buildGuildPath(guild, chId ?? null);
    if (path) {
      navigateRef.current(path, { replace: true });
      return;
    }
    // Legacy fallback.
    const legacyPath = chId
      ? `/servers/${guildId}/channels/${chId}`
      : `/servers/${guildId}/channels`;
    navigateRef.current(legacyPath, { replace: true });
  }, [mergedGuilds, dmGuilds]);

  const handleVoiceLeave = useCallback(() => {
    leavingVoiceRef.current = true;
    setOrbPhase('idle');
    setActiveVoiceChannel(null);
    activeVoiceMemberIdsRef.current = [];
    setVoiceScreenSharing(false);
    setVoiceWebcamOn(false);
    setVoiceMuteStates(new Map());
    setMobileStack(1);
    setMemberDrawerOpen(false);
    navigateToGuild(serverId);
  }, [serverId, navigateToGuild]);

  // ── Guild-level WS events ─────────────────────────────────────────────

  // member_kicked: remove from list; toast + navigate self if kicked (guild-scoped)
  useEffect(() => {
    if (!wsClient) return;
    const handler = async (data) => {
      if (!data.user_id) return;
      if (data.server_id && data.server_id !== serverId) return;
      if (data.user_id === currentUserId) {
        try {
          const textChannelIds = channels.filter((c) => c.type === 'text').map((c) => c.id);
          const db = await mlsStoreLib.openStore(currentUserId, getDeviceId());
          const deps = { db, mlsStore: mlsStoreLib };
          if (textChannelIds.length) await mlsGroup.leaveAllChannelGroups(deps, textChannelIds);
        } catch (err) {
          console.warn('[mls] Failed to clean up MLS groups on kick:', err);
        }
        const serverName = activeGuildName ?? activeGuild?.name ?? 'the server';
        showToast({ message: `You were removed from ${serverName}`, variant: 'error' });
        setTimeout(() => {
          const nextGuild = mergedGuilds.find((g) => g.id !== serverId);
          if (nextGuild) {
            navigateToGuild(nextGuild.id);
          } else {
            navigateRef.current('/home');
          }
        }, 2500);
        return;
      }
      setMembers((prev) => prev.filter((m) => (m.id ?? m.userId) !== data.user_id));
    };
    wsClient.on('member_kicked', handler);
    return () => wsClient.off('member_kicked', handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wsClient, currentUserId, serverId, mergedGuilds, activeGuild, channels, showToast]);

  // member_banned: remove from list; toast + navigate self if banned (guild-scoped)
  useEffect(() => {
    if (!wsClient) return;
    const handler = async (data) => {
      if (!data.user_id) return;
      if (data.server_id && data.server_id !== serverId) return;
      if (data.user_id === currentUserId) {
        try {
          const textChannelIds = channels.filter((c) => c.type === 'text').map((c) => c.id);
          const db = await mlsStoreLib.openStore(currentUserId, getDeviceId());
          const deps = { db, mlsStore: mlsStoreLib };
          if (textChannelIds.length) await mlsGroup.leaveAllChannelGroups(deps, textChannelIds);
        } catch (err) {
          console.warn('[mls] Failed to clean up MLS groups on ban:', err);
        }
        const serverName = activeGuildName ?? activeGuild?.name ?? 'the server';
        showToast({ message: `You were banned from ${serverName}`, variant: 'error' });
        setTimeout(() => {
          const nextGuild = mergedGuilds.find((g) => g.id !== serverId);
          if (nextGuild) {
            navigateToGuild(nextGuild.id);
          } else {
            navigateRef.current('/home');
          }
        }, 2500);
        return;
      }
      setMembers((prev) => prev.filter((m) => (m.id ?? m.userId) !== data.user_id));
    };
    wsClient.on('member_banned', handler);
    return () => wsClient.off('member_banned', handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wsClient, currentUserId, serverId, mergedGuilds, activeGuild, channels, showToast]);

  // instance_banned: clear session + hard reload to login
  useEffect(() => {
    if (!wsClient) return;
    const handler = (data) => {
      const reason = data.reason || 'You have been banned';
      showToast({ message: `Account suspended: ${reason}`, variant: 'error' });
      setTimeout(() => {
        sessionStorage.removeItem(JWT_KEY);
        window.location.href = '/';
      }, 2000);
    };
    wsClient.on('instance_banned', handler);
    return () => wsClient.off('instance_banned', handler);
  }, [wsClient, showToast]);

  // server_deleted: navigate away and notify when the current server is deleted
  useEffect(() => {
    if (!wsClient) return;
    const handler = (data) => {
      if (data.server_id && data.server_id !== serverId) return;
      const serverName = activeGuildName ?? activeGuild?.name ?? 'the server';
      showToast({ message: `"${serverName}" has been deleted`, variant: 'error' });
      setTimeout(() => {
        const nextGuild = mergedGuilds.find((g) => g.id !== serverId);
        if (nextGuild) {
          navigateToGuild(nextGuild.id);
        } else {
          navigateRef.current('/home', { replace: true });
        }
      }, 1500);
    };
    wsClient.on('server_deleted', handler);
    return () => wsClient.off('server_deleted', handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wsClient, serverId, mergedGuilds, activeGuild, activeGuildName, showToast]);

  // device_revoked_reconnect_attempt: a previously revoked device tried to reconnect.
  // The event is emitted by the server when device_id binding is added to JWT (future phase).
  // The listener is wired now so the UI is ready when the server-side detection ships.
  useEffect(() => {
    if (!wsClient) return;
    const handler = (data) => {
      showToast({
        message: data.message || 'A previously revoked device attempted to reconnect to your account.',
        variant: 'warning',
        duration: 10000,
      });
    };
    wsClient.on('device_revoked_reconnect_attempt', handler);
    return () => wsClient.off('device_revoked_reconnect_attempt', handler);
  }, [wsClient, showToast]);

  // member_muted: disconnect from voice if in a call; show toast to muted user (guild-scoped)
  useEffect(() => {
    if (!wsClient) return;
    const handler = (data) => {
      if (data.server_id !== serverId) return;
      if (data.user_id === currentUserId) {
        if (activeVoiceChannel) {
          handleVoiceLeave();
        }
        showToast({ message: 'You are muted in this server and cannot join voice channels.', variant: 'error' });
      }
    };
    wsClient.on('member_muted', handler);
    return () => wsClient.off('member_muted', handler);
  }, [wsClient, serverId, currentUserId, activeVoiceChannel, handleVoiceLeave, showToast]);

  // member_joined: append new member to the list.
  useEffect(() => {
    if (!wsClient) return;
    const handler = (data) => {
      if (!data.member) return;
      if (data.server_id && data.server_id !== serverId) return;
      const joinedId = data.member.id ?? data.member.userId;
      setMembers((prev) => {
        if (prev.some((m) => (m.id ?? m.userId) === joinedId)) return prev;
        return [...prev, data.member];
      });
    };
    wsClient.on('member_joined', handler);
    return () => wsClient.off('member_joined', handler);
  }, [wsClient, serverId]);

  // member_left: remove from list; navigate self if voluntarily left (guild-scoped)
  useEffect(() => {
    if (!wsClient) return;
    const handler = async (data) => {
      if (!data.user_id) return;
      if (data.server_id && data.server_id !== serverId) return;
      if (data.user_id === currentUserId) {
        try {
          const textChannelIds = channels.filter((c) => c.type === 'text').map((c) => c.id);
          if (currentUserId) {
            const db = await mlsStoreLib.openStore(currentUserId, getDeviceId());
            const deps = { db, mlsStore: mlsStoreLib };
            if (textChannelIds.length) await mlsGroup.leaveAllChannelGroups(deps, textChannelIds);
          }
        } catch (err) {
          console.warn('[mls] Failed to clean up MLS groups on leave:', err);
        }
        const nextGuild = mergedGuilds.find((g) => g.id !== serverId);
        if (nextGuild) {
          navigateToGuild(nextGuild.id);
        } else {
          navigateRef.current('/home', { replace: true });
        }
        return;
      }
      setMembers((prev) => prev.filter((m) => (m.id ?? m.userId) !== data.user_id));
    };
    wsClient.on('member_left', handler);
    return () => wsClient.off('member_left', handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wsClient, serverId, currentUserId, mergedGuilds, channels]);

  // ── MLS group lifecycle - mls.commit and mls.add_request WS events ───────

  useEffect(() => {
    if (!wsClient || !currentUserId) return;

    const handler = async (data) => {
      if (data.sender_id === currentUserId && data.sender_device_id === getDeviceId()) return;
      if (!data.channel_id || !data.commit_bytes) return;

      if (!token) return;
      if (!instanceApi) return;

      // Serialise per-channel: multiple `mls.commit` events for the same
      // channel can fire back-to-back. Without this, two handlers can both
      // read epoch=N, both call processCommit, and the second one runs
      // against state the first one already advanced — producing
      // WrongEpoch / InvalidSignature / AeadError on subsequent app
      // messages.
      await withChannelMLSMutex(textChannelKey(data.channel_id), async () => {
        try {
          const db = await mlsStoreLib.openStore(currentUserId, getDeviceId());
          const localEpochBefore = await mlsStoreLib.getGroupEpoch(db, data.channel_id);
          console.info('[mls] commit event', {
            channelId: data.channel_id,
            senderId: data.sender_id,
            senderDeviceId: data.sender_device_id ?? null,
            incomingEpoch: data.epoch ?? null,
            localEpochBefore: localEpochBefore ?? null,
          });
          const credential = await mlsStoreLib.getCredential(db);
          const deps = { db, token, credential, mlsStore: mlsStoreLib, hushCrypto: hushCryptoLib, api: instanceApi };
          const commitBytes = base64ToUint8ArraySL(data.commit_bytes);
          await mlsGroup.processCommit(deps, data.channel_id, commitBytes);
          const localEpochAfter = await mlsStoreLib.getGroupEpoch(db, data.channel_id);
          console.info('[mls] commit applied', {
            channelId: data.channel_id,
            incomingEpoch: data.epoch ?? null,
            localEpochAfter: localEpochAfter ?? null,
          });
        } catch (err) {
          console.warn('[mls] Failed to process commit for channel', data.channel_id, err);
          try {
            const db2 = await mlsStoreLib.openStore(currentUserId, getDeviceId());
            const localEpochBeforeCatchup = await mlsStoreLib.getGroupEpoch(db2, data.channel_id);
            console.info('[mls] starting catchup', {
              channelId: data.channel_id,
              localEpochBeforeCatchup: localEpochBeforeCatchup ?? null,
            });
            const credential2 = await mlsStoreLib.getCredential(db2);
            const deps2 = { db: db2, token, credential: credential2, mlsStore: mlsStoreLib, hushCrypto: hushCryptoLib, api: instanceApi };
            await mlsGroup.catchupCommits(deps2, data.channel_id);
            const localEpochAfterCatchup = await mlsStoreLib.getGroupEpoch(db2, data.channel_id);
            console.info('[mls] catchup finished', {
              channelId: data.channel_id,
              localEpochAfterCatchup: localEpochAfterCatchup ?? null,
            });
          } catch (catchupErr) {
            console.warn('[mls] Catchup also failed for channel', data.channel_id, catchupErr);
          }
        }
      });
    };

    wsClient.on('mls.commit', handler);
    return () => wsClient.off('mls.commit', handler);
  }, [wsClient, currentUserId, token]);

  useEffect(() => {
    if (!wsClient || !currentUserId) return;

    const handler = async (data) => {
      if (data.action !== 'remove') return;
      if (data.requester_id === currentUserId) return;
      if (!data.channel_id || !data.requester_id) return;

      if (!token) return;
      if (!instanceApi) return;

      await withChannelMLSMutex(textChannelKey(data.channel_id), async () => {
        try {
          const db = await mlsStoreLib.openStore(currentUserId, getDeviceId());
          const credential = await mlsStoreLib.getCredential(db);
          const deps = { db, token, credential, mlsStore: mlsStoreLib, hushCrypto: hushCryptoLib, api: instanceApi };
          await mlsGroup.removeMemberFromChannel(deps, data.channel_id, data.requester_id);
        } catch (err) {
          console.warn('[mls] Failed to commit remove for', data.requester_id, 'in channel', data.channel_id, err);
        }
      });
    };

    wsClient.on('mls.add_request', handler);
    return () => wsClient.off('mls.add_request', handler);
  }, [wsClient, currentUserId, token]);

  // ── MLS group joins when entering a guild ─────────────────────────────

  // Track groups that failed to join - prevents infinite retry loops.
  // Map<groupKey, failCount>. Reset when serverId changes.
  const mlsJoinFailuresRef = useRef(new Map());
  const mlsJoinRunningRef = useRef(false);
  const prevMlsServerIdRef = useRef(null);

  useEffect(() => {
    if (!channels.length || !currentUserId || !authToken || !serverId) return;
    if (!token) return;

    // Track guild switch - no failure map reset. Failures persist across
    // guild switches so a 404'd group doesn't get re-polled endlessly.
    prevMlsServerIdRef.current = serverId;

    // Prevent concurrent runs (effect can re-fire while async work is in-flight).
    if (mlsJoinRunningRef.current) return;

    const MAX_JOIN_RETRIES = 3;
    // Text AND voice channels need text MLS groups (voice channels have built-in chat).
    const chatChannelIds = channels
      .filter((c) => c.type === 'text' || c.type === 'voice')
      .map((c) => c.id);

    if (!instanceApi) return;
    const joinMissingGroups = async () => {
      mlsJoinRunningRef.current = true;
      try {
        const db = await mlsStoreLib.openStore(currentUserId, getDeviceId());
        const credential = await mlsStoreLib.getCredential(db);
        const deps = { db, token, credential, mlsStore: mlsStoreLib, hushCrypto: hushCryptoLib, api: instanceApi };
        const failures = mlsJoinFailuresRef.current;

        // Text channel groups (includes voice channels - they have built-in chat)
        for (const chId of chatChannelIds) {
          if ((failures.get(chId) ?? 0) >= MAX_JOIN_RETRIES) continue;
          // Per-channel mutex: serialise with WS commit handlers and any
          // user-driven encrypt/decrypt that may run concurrently.
          await withChannelMLSMutex(textChannelKey(chId), async () => {
            const epoch = await mlsStoreLib.getGroupEpoch(db, chId);
            if (epoch == null) {
              try {
                await mlsGroup.joinOrCreateChannelGroup(deps, chId);
              } catch (err) {
                failures.set(chId, (failures.get(chId) ?? 0) + 1);
                console.warn('[mls] Failed to join/create group for channel', chId,
                  `(attempt ${failures.get(chId)}/${MAX_JOIN_RETRIES})`, err);
              }
            } else {
              try {
                await mlsGroup.catchupCommits(deps, chId);
              } catch (err) {
                console.warn('[mls] Commit catchup failed for channel', chId, err);
              }
            }
          });
        }
      } catch (err) {
        console.warn('[mls] joinMissingGroups failed:', err);
      } finally {
        mlsJoinRunningRef.current = false;
      }
    };

    joinMissingGroups();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channels, currentUserId, authToken, serverId, token]);

  // ── MLS self-update timer: rotate leaf node key material every 24h ────

  useEffect(() => {
    if (!currentUserId || !authToken || !token) return;
    if (!instanceApi) return;

    const runSelfUpdates = async () => {
      try {
        const db = await mlsStoreLib.openStore(currentUserId, getDeviceId());
        const credential = await mlsStoreLib.getCredential(db);
        if (!credential) return;
        const deps = { db, token, credential, mlsStore: mlsStoreLib, hushCrypto: hushCryptoLib, api: instanceApi };
        const allEpochs = await mlsStoreLib.listAllGroupEpochs(db);
        for (const { key: channelId } of allEpochs) {
          // performSelfUpdate is a stateful MLS mutation (creates+merges a
          // commit, advances epoch). Must serialise per channel against WS
          // commit handlers, catchup, encrypt and decrypt-retry on the same
          // channel, otherwise it reintroduces the same race class on a
          // slower timer path.
          await withChannelMLSMutex(textChannelKey(channelId), async () => {
            try {
              await mlsGroup.performSelfUpdate(deps, channelId);
            } catch (err) {
              console.warn('[mls] Self-update failed for channel', channelId, err);
            }
          });
        }
      } catch (err) {
        console.warn('[mls] Self-update timer failed:', err);
      }
    };

    const interval = setInterval(runSelfUpdates, 24 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [currentUserId, authToken, token]);

  // ── role_changed / member_role_changed ────────────────────────────────

  useEffect(() => {
    if (!wsClient) return;
    const handler = (data) => {
      if (!data.user_id || !data.new_role) return;
      if (data.server_id && data.server_id !== serverId) return;
      setMembers((prev) =>
        prev.map((m) =>
          (m.id ?? m.userId) === data.user_id ? { ...m, role: data.new_role } : m
        )
      );
    };
    wsClient.on('role_changed', handler);
    wsClient.on('member_role_changed', handler);
    return () => {
      wsClient.off('role_changed', handler);
      wsClient.off('member_role_changed', handler);
    };
  }, [wsClient, serverId]);

  // ── Fetch instance data and handshake when activeGuild/instanceUrl changes ─

  useEffect(() => {
    if (!token || !instanceUrl) return;
    Promise.all([getInstance(token, instanceUrl), getHandshake(instanceUrl)])
      .then(([inst, shake]) => {
        setInstanceData(inst);
        setHandshakeData(shake);
      })
      .catch(() => {
        setInstanceData(null);
        setHandshakeData(null);
      });
  }, [token, instanceUrl]);

  // ── Transparency log: own-key verification on handshake load ──────────

  /**
   * Run own-key verification immediately after handshakeData is loaded
   * (post-login and post-instance-switch). This is the primary detection
   * point for server-side key manipulation.
   *
   * HARD FAIL: sets transparencyError which blocks the app UI.
   * Network errors are non-fatal - transparency is optional infrastructure.
   */
  useEffect(() => {
    if (!handshakeData?.transparency_url || !handshakeData?.log_public_key) return;
    if (!token || !identityKeyRef?.current?.publicKey) return;
    if (!instanceUrl) return;
    if (!homeInstanceUrl || instanceUrl !== homeInstanceUrl) return;

    const pubKeyHex = bytesToHex(identityKeyRef.current.publicKey);
    const verifier = new TransparencyVerifier(
      instanceUrl,
      handshakeData.log_public_key,
    );

    verifier.verifyOwnKey(pubKeyHex, token)
      .then(result => {
        if (!result.ok) {
          setTransparencyError(result.error);
        } else if (result.warning) {
          console.warn('[transparency]', result.warning);
        }
      })
      .catch(err => {
        console.warn('[transparency] login verification failed:', err);
      });
  // Run once per handshakeData load - intentionally not re-running on token change.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handshakeData]);

  // ── Transparency log: periodic 24h background check ───────────────────

  useEffect(() => {
    if (!handshakeData?.transparency_url || !handshakeData?.log_public_key) return;
    if (!token || !identityKeyRef?.current?.publicKey) return;
    if (!instanceUrl) return;
    if (!homeInstanceUrl || instanceUrl !== homeInstanceUrl) return;

    const check = async () => {
      try {
        const pubKeyHex = bytesToHex(identityKeyRef.current.publicKey);
        const verifier = new TransparencyVerifier(
          instanceUrl,
          handshakeData.log_public_key,
        );
        const result = await verifier.verifyOwnKey(pubKeyHex, token);
        if (!result.ok) {
          setTransparencyError(result.error);
        } else if (result.warning) {
          console.warn('[transparency]', result.warning);
        }
      } catch (err) {
        console.warn('[transparency] periodic check failed:', err);
      }
    };

    // Don't run immediately - login verification already ran in the effect above.
    const id = setInterval(check, 24 * 60 * 60 * 1000);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handshakeData?.transparency_url, token]);

  // ── Transparency log: WS transparency.key_change handler ─────────────

  useEffect(() => {
    if (!wsClient) return;

    const handler = (data) => {
      console.warn('[transparency] key change detected:', data.operation, 'leafIndex:', data.leafIndex);

      if (!handshakeData?.transparency_url || !handshakeData?.log_public_key) return;
      if (!token || !identityKeyRef?.current?.publicKey) return;
      if (!instanceUrl) return;
      if (!homeInstanceUrl || instanceUrl !== homeInstanceUrl) return;

      const pubKeyHex = bytesToHex(identityKeyRef.current.publicKey);
      const verifier = new TransparencyVerifier(
        instanceUrl,
        handshakeData.log_public_key,
      );
      verifier.verifyOwnKey(pubKeyHex, token)
        .then(result => {
          if (!result.ok) setTransparencyError(result.error);
        })
        .catch(err => console.warn('[transparency] key change verification failed:', err));
    };

    wsClient.on('transparency.key_change', handler);
    return () => wsClient.off('transparency.key_change', handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wsClient, handshakeData, token]);

  // ── Fetch channels + members when serverId changes (guild switch) ──────

  useEffect(() => {
    if (!authToken || !serverId) return;
    if (!token) return;

    // Clear stale state immediately to prevent channel lookup across guilds.
    // Voice connection is NEVER torn down by navigation - only by explicit Leave
    // or voice channel switch (Discord model).
    setChannels([]);
    setMembers([]);
    setLoading(true);

    Promise.all([
      getGuildChannels(token, serverId, instanceUrl ?? undefined),
      getGuildMembers(token, serverId, instanceUrl ?? undefined),
    ])
      .then(([chans, mems]) => {
        // Extract channel names from encryptedMetadata (plaintext JSON fallback
        // when MLS is not bootstrapped, or decrypt with metadata key if available).
        const processed = (Array.isArray(chans) ? chans : []).map(ch => {
          if (ch.name) return ch; // Already has a name
          if (!ch.encryptedMetadata) return ch;
          try {
            // Go serializes []byte as base64. Decode to UTF-8, then parse JSON.
            const decoded = new TextDecoder().decode(
              Uint8Array.from(atob(ch.encryptedMetadata), c => c.charCodeAt(0))
            );
            const parsed = JSON.parse(decoded);
            return { ...ch, name: parsed.n || parsed.name || '' };
          } catch {
            return ch; // Encrypted blob - needs MLS key
          }
        });
        setChannels(processed);
        setMembers(Array.isArray(mems) ? mems : []);
      })
      .catch((err) => {
        if (err?.status === 403) {
          showToast({ message: 'You no longer have access to this server', variant: 'error' });
          navigateRef.current('/home', { replace: true });
          return;
        }
        setChannels([]);
        setMembers([]);
      })
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authToken, serverId, token, instanceUrl, showToast]);

  // ── Callbacks ─────────────────────────────────────────────────────────

  const handleMemberUpdate = useCallback(() => {
    if (token && serverId) {
      getGuildMembers(token, serverId, instanceUrl ?? undefined).then(setMembers).catch(() => {});
    }
  }, [serverId, token, instanceUrl]);

  /**
   * Called by ServerList when user selects a different guild.
   * Uses instance-aware routing for the new-style URL.
   */
  const handleGuildSelect = useCallback((guild) => {
    setShowDrawer(false);
    setDmMode(false);
    navigateToGuild(guild.id);
  }, [navigateToGuild]);

  const handleDmSelect = useCallback(async (dmGuild) => {
    setDmMode(false);
    setShowDrawer(false);
    setMobileStack(2);

    // Refresh before navigating when the guild is brand-new (not yet in local state).
    // Without this, activeGuild stays null after the route change → wsClient is null
    // → chat send is blocked. Existing DMs are already in dmGuilds so skip the refresh.
    const isKnown = (dmGuilds ?? []).some((g) => g.id === dmGuild.id);
    if (!isKnown) {
      const targetInstanceUrl = dmGuild.instanceUrl ?? dmInstanceUrl;
      if (targetInstanceUrl) {
        await refreshGuilds(targetInstanceUrl).catch(() => {});
      }
    }

    navigateToGuild(dmGuild.id, dmGuild.channelId ?? dmGuild.channels?.[0]?.id);
  }, [navigateToGuild, dmGuilds, refreshGuilds, dmInstanceUrl]);

  /** Called by GuildCreateModal on success - refresh guilds and navigate to new guild. */
  const handleGuildCreated = useCallback(async (newGuild) => {
    // Await refreshGuilds so mergedGuilds includes the new guild BEFORE navigating.
    // Without this, activeGuild=null during the transition → wsClient=null → voice drops.
    if (instanceUrl) {
      await refreshGuilds(instanceUrl).catch(() => {});
    }
    if (newGuild?.id) {
      navigateToGuild(newGuild.id);
    }
  }, [instanceUrl, refreshGuilds, navigateToGuild]);

  const handleOpenGuildCreateModal = useCallback(() => {
    setShowGuildCreateModal(true);
  }, []);

  const handleCloseGuildCreateModal = useCallback(() => {
    setShowGuildCreateModal(false);
  }, []);

  const handleEmptyStateGuildCreated = useCallback(async (newGuild) => {
    setShowGuildCreateModal(false);
    await handleGuildCreated(newGuild);
  }, [handleGuildCreated]);

  /**
   * Handles "Send Message" from MemberProfileCard - creates or finds a DM guild
   * with the clicked member, then navigates to it.
   *
   * @param {object} member - Member object from MemberList
   */
  const handleSendMessage = useCallback(async (member) => {
    const memberId = member.id ?? member.userId;
    if (!memberId || !token) return;
    try {
      const resp = await api.createOrFindDM(token, memberId, instanceUrl ?? '');
      // Server returns { server, otherUser, channelId } — unwrap before use.
      const guildId = resp?.server?.id;
      const dmChannelId = resp?.channelId;
      if (guildId) {
        // Refresh guilds so the new DM appears in the sidebar.
        if (instanceUrl) {
          await refreshGuilds(instanceUrl).catch(() => {});
        }
        navigateToGuild(guildId, dmChannelId);
      }
    } catch (err) {
      console.error('[ServerLayout] handleSendMessage failed:', err);
      showToast({ message: 'Could not open direct message', variant: 'error' });
    }
  }, [token, instanceUrl, refreshGuilds, navigateToGuild, showToast]);

  /**
   * getToken accessor passed to child components that still use the prop-based API.
   * Returns the per-instance token for the active guild's instance.
   */
  const getToken = useCallback(() => token, [token]);

  const currentChannel = channels.find((c) => c.id === channelId);

  const hasOrbTopHeader = isViewingVoice || (!isViewingVoice && !currentChannel);

  // Auto-join when navigating directly to a voice channel URL.
  if (currentChannel?.type === 'voice' && currentChannel.id !== activeVoiceChannel?.id && !leavingVoiceRef.current) {
    activeVoiceMemberIdsRef.current = memberIds;
    setActiveVoiceChannel(currentChannel);
  }

  const handleChannelSelect = (channel) => {
    if (!channel?.id) return;
    if (channel.type === 'voice' && activeVoiceChannel && channel.id !== activeVoiceChannel.id) {
      setPendingVoiceSwitch(channel);
      return;
    }
    if (isMobile) {
      setShowDrawer(false);
      setMobileStack(2);
      setMemberDrawerOpen(false);
    }
    // Navigate to the channel using instance-aware URL pattern.
    const path = buildGuildPath(activeGuild, channel.id);
    navigateRef.current(path ?? `/servers/${serverId}/channels/${channel.id}`);
    if (channel.type === 'voice') {
      activeVoiceMemberIdsRef.current = memberIds;
      setActiveVoiceChannel(channel);
    }
  };

  const handleVoiceSwitchConfirmed = useCallback(() => {
    const channel = pendingVoiceSwitch;
    setPendingVoiceSwitch(null);
    if (!channel) return;
    const path = buildGuildPath(activeGuild, channel.id);
    navigateRef.current(path ?? `/servers/${serverId}/channels/${channel.id}`);
    activeVoiceMemberIdsRef.current = memberIds;
    setActiveVoiceChannel(channel);
  }, [pendingVoiceSwitch, memberIds, serverId, activeGuild]);

  /** Parse channel names from base64 metadata before setting state. */
  const parseChannelNames = useCallback((chans) =>
    (Array.isArray(chans) ? chans : []).map(ch => {
      if (ch.name) return ch;
      if (!ch.encryptedMetadata) return ch;
      try {
        const decoded = new TextDecoder().decode(
          Uint8Array.from(atob(ch.encryptedMetadata), c => c.charCodeAt(0))
        );
        const parsed = JSON.parse(decoded);
        return { ...ch, name: parsed.n || parsed.name || '' };
      } catch { return ch; }
    }), []);

  const handleChannelsUpdated = useCallback((updatedChannels) => {
    setChannels(parseChannelNames(updatedChannels));
  }, [parseChannelNames]);

  // Derive myRole from guild membership.
  const myMember = members.find((m) => (m.id ?? m.userId) === currentUserId);
  const myRole = activeGuild?.myRole ?? myMember?.role ?? 'member';
  const myPermissionLevel = myMember?.permissionLevel
    ?? activeGuild?.permissionLevel
    ?? ({ owner: 3, admin: 2, mod: 1, member: 0 }[myRole] ?? 0);

  // Whether the current instance has no transparency log configured.
  // Used to show the non-blocking warning badge in the sidebar.
  const hasNoTransparencyLog = handshakeData !== null && !handshakeData?.transparency_url;

  const handleTransparencySignOut = useCallback(() => {
    sessionStorage.clear();
    window.location.href = '/';
  }, []);

  // ── Render ────────────────────────────────────────────────────────────

  // Transparency hard-fail: key mismatch detected - block the app.
  if (transparencyError) {
    return (
      <div className="transp-hard-fail-overlay">
        <div className="transp-hard-fail-card">
          <div className="transp-hard-fail-icon">&#9888;</div>
          <h2 className="transp-hard-fail-heading">
            Key Verification Failed
          </h2>
          <p className="transp-hard-fail-body">
            {transparencyError}
          </p>
          <p className="transp-hard-fail-note">
            Your account may be compromised. Do not continue using this session.
            Contact your instance administrator.
          </p>
          <button
            type="button"
            className="transp-hard-fail-btn"
            onClick={() => {
              // Sign out - leave local vault intact for recovery.
              import('../contexts/AuthContext').then(({ useAuth: _ }) => {
                sessionStorage.clear();
                window.location.href = '/';
              });
            }}
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  // No guild selected - show empty state with guild strip and welcome message.
  if (!serverId) {
    return (
      <ServerShell
        transparencyError={null}
        onTransparencySignOut={handleTransparencySignOut}
        serverId={null}
        serverListEl={(
          <ServerList
            getToken={getToken}
            guilds={mergedGuilds}
            activeGuild={null}
            onGuildSelect={handleGuildSelect}
            onGuildSettings={() => { setRequestOpenSettings(true); setTimeout(() => setRequestOpenSettings(false), 0); }}
            onGuildCreated={handleGuildCreated}
            getMetadataKey={getMetadataKey}
            getMetadataKeys={getMetadataKeys}
            rememberMetadataKey={rememberMetadataKey}
            instanceData={instanceData}
            userRole={myRole}
            userPermissionLevel={myPermissionLevel}
          />
        )}
        emptyStateEl={(
          <EmptyState
            instanceStates={instanceStates}
            onCreateServer={handleOpenGuildCreateModal}
            onBrowseServers={() => navigate('/explore')}
          />
        )}
        guildCreateModal={showGuildCreateModal ? (
          <GuildCreateModal
            getToken={getToken}
            onClose={handleCloseGuildCreateModal}
            onCreated={handleEmptyStateGuildCreated}
            activeInstanceUrl={null}
          />
        ) : null}
        hasNoTransparencyLog={hasNoTransparencyLog}
        authToken={authToken}
        toastEl={<Toast toasts={toasts} />}
      />
    );
  }

  const serverListEl = (
    <ServerList
      getToken={getToken}
      guilds={mergedGuilds}
      activeGuild={dmMode ? null : activeGuild}
      onGuildSelect={handleGuildSelect}
      onGuildSettings={() => { setRequestOpenSettings(true); setTimeout(() => setRequestOpenSettings(false), 0); }}
      onGuildCreated={handleGuildCreated}
      onDmOpen={handleDmOpen}
      isDmActive={dmMode || activeGuild?.isDm}
      getMetadataKey={getMetadataKey}
      getMetadataKeys={getMetadataKeys}
      rememberMetadataKey={rememberMetadataKey}
      instanceData={instanceData}
      userRole={myRole}
      userPermissionLevel={myPermissionLevel}
      compact={isMobile}
    />
  );

  // DM list element - shown in sidebar when dmMode is active or viewing a DM guild
  const dmListEl = (
    <DmListView
      dmGuilds={dmGuilds}
      onSelectDm={handleDmSelect}
      getToken={getToken}
      instanceUrl={dmInstanceUrl}
    />
  );

  const isDmView = dmMode || activeGuild?.isDm;

  // Displayed in the TextChannel header instead of #channel-name for DM conversations.
  const dmPeerName = activeGuild?.isDm
    ? (activeGuild?.otherUser?.displayName ?? activeGuild?.otherUser?.username ?? null)
    : null;

  const channelListEl = (
    <ChannelList
      getToken={getToken}
      serverId={serverId}
      guildName={activeGuildName ?? activeGuild?.name}
      instanceUrl={activeGuild?.instanceUrl ?? null}
      getGuildMetadataKey={getActiveGuildMetadataKey}
      instanceData={instanceData}
      channels={channels}
      myRole={myRole}
      myPermissionLevel={myPermissionLevel}
      activeChannelId={channelId}
      onChannelSelect={handleChannelSelect}
      onChannelsUpdated={handleChannelsUpdated}
      voiceParticipants={voiceParticipants}
      showToast={showToast}
      members={members}
      currentUserId={currentUserId}
      openSettings={requestOpenSettings}
    />
  );

  /** Channel list column with voice panel + persistent user panel at bottom. */
  const channelSidebarEl = (
    <WorkspaceSidebarShell
      content={isDmView ? dmListEl : channelListEl}
      footer={
        <>
          {activeVoiceChannel && (
            <VoiceConnectedPanel
              channelName={activeVoiceChannel._displayName ?? activeVoiceChannel.name}
              isScreenSharing={voiceScreenSharing}
              isWebcamOn={voiceWebcamOn}
              signalBars={connQuality.bars}
              signalColor={connQuality.color}
              signalReconnecting={connQuality.isReconnecting}
              rtt={connQuality.rtt}
              onScreenShare={() => voiceControlsRef.current?.toggleScreenShare()}
              onSwitchScreen={() => voiceControlsRef.current?.switchScreenSource()}
              onWebcam={() => voiceControlsRef.current?.toggleWebcam()}
              onDisconnect={handleVoiceLeave}
            />
          )}
          <UserPanel
            user={user}
            isMuted={!!activeVoiceChannel && !voiceMicOn}
            isDeafened={!!activeVoiceChannel && voiceDeafened}
            isInVoice={!!activeVoiceChannel}
            onMute={() => voiceControlsRef.current?.toggleMic()}
            onDeafen={() => voiceControlsRef.current?.toggleDeafen()}
            onMicFilterSettingsChange={(settings) => voiceControlsRef.current?.updateMicFilterSettings?.(settings)}
          />
        </>
      }
    />
  );

  const memberListEl = (
    <MemberList
      members={members}
      onlineUserIds={onlineUserIds}
      currentUserId={currentUserId}
      myRole={myRole}
      myPermissionLevel={myPermissionLevel}
      showToast={showToast}
      onMemberUpdate={handleMemberUpdate}
      serverId={serverId}
      onSendMessage={handleSendMessage}
    />
  );

  const desktopMembersSidebar = !isMobile ? (
    <div className={`sidebar-desktop ${showMembers ? 'sidebar-desktop-open' : ''}`}>
      <div className="sidebar-desktop-inner">
        {memberListEl}
      </div>
    </div>
  ) : null;

  const contentEl = (
    <ChannelContent
      loading={loading}
      isViewingVoice={isViewingVoice}
      activeVoiceChannel={activeVoiceChannel}
      serverId={serverId}
      getToken={getToken}
      wsClient={wsClient}
      members={members}
      memberIds={memberIds}
      onlineUserIds={onlineUserIds}
      myRole={myRole}
      showToast={showToast}
      handleMemberUpdate={handleMemberUpdate}
      showMembers={showMembers}
      showChatPanel={showChatPanel}
      showParticipantsPanel={showParticipantsPanel}
      togglePanel={togglePanel}
      toggleMemberDrawer={toggleMemberDrawer}
      handleVoiceLeave={handleVoiceLeave}
      handleOrbPhaseChange={handleOrbPhaseChange}
      voiceParticipants={voiceParticipants}
      voiceMuteStates={voiceMuteStates}
      voiceControlsRef={voiceControlsRef}
      handleVoiceStateChange={handleVoiceStateChange}
      instanceUrl={instanceUrl}
      isMobile={isMobile}
      isDmView={isDmView}
      currentChannel={currentChannel}
      dmPeerName={dmPeerName}
      handleMarkRead={handleMarkRead}
      handleMobileBack={handleMobileBack}
      orbPhase={orbPhase}
      toggleDrawer={toggleDrawer}
      desktopMembersSidebar={desktopMembersSidebar}
    />
  );

  return (
    <ServerShell
      transparencyError={transparencyError}
      onTransparencySignOut={handleTransparencySignOut}
      serverId={serverId}
      isInstanceOffline={isInstanceOffline}
      instanceUrl={instanceUrl}
      serverListEl={serverListEl}
      emptyStateEl={
        <EmptyState
          instanceStates={instanceStates}
          onCreateServer={handleOpenGuildCreateModal}
          onBrowseServers={() => navigate('/explore')}
        />
      }
      guildCreateModal={
        showGuildCreateModal ? (
          <GuildCreateModal
            getToken={getToken}
            onClose={handleCloseGuildCreateModal}
            onCreated={handleEmptyStateGuildCreated}
            activeInstanceUrl={null}
          />
        ) : null
      }
      hasNoTransparencyLog={hasNoTransparencyLog}
      authToken={authToken}
      toastEl={<Toast toasts={toasts} />}
      isMobile={isMobile}
      sidebarWidth={sidebarWidth}
      onSidebarResize={handleSidebarResize}
      channelSidebarEl={channelSidebarEl}
      mobileStack={mobileStack}
      activeVoiceChannel={activeVoiceChannel}
      isViewingVoice={isViewingVoice}
      onVoiceBarClick={() => handleChannelSelect(activeVoiceChannel)}
      memberDrawerOpen={memberDrawerOpen}
      closeMemberDrawer={closeMemberDrawer}
      memberDrawerEl={
        <MemberList
          members={members}
          onlineUserIds={onlineUserIds}
          currentUserId={currentUserId}
          myRole={myRole}
          myPermissionLevel={myPermissionLevel}
          showToast={showToast}
          onMemberUpdate={handleMemberUpdate}
          serverId={serverId}
          onSendMessage={handleSendMessage}
          onCloseDrawer={closeMemberDrawer}
        />
      }
      pendingVoiceSwitchModal={
        pendingVoiceSwitch ? (
          <ConfirmModal
            title="Switch voice channel"
            message={`You are currently connected to "${activeVoiceChannel?.name}". Switch to "${pendingVoiceSwitch.name}"?`}
            confirmLabel="Switch"
            onConfirm={handleVoiceSwitchConfirmed}
            onCancel={() => setPendingVoiceSwitch(null)}
          />
        ) : null
      }
    >
      {contentEl}
    </ServerShell>
  );
}
