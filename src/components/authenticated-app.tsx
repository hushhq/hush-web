/**
 * AuthenticatedApp — post-login application shell.
 *
 * Composes ServerRail (servers), ChannelSidebar (channel list with DnD),
 * ChannelView (header + content) and the surrounding dialogs (settings,
 * cheat sheet, command palette). Mounts the legacy Chat.jsx as the message
 * body slot of ChannelView for text channels — that file owns Signal/MLS
 * encryption, WebSocket subscription, and optimistic sends; this shell
 * never recreates that logic.
 *
 * URL-driven: `/:instance/:guildSlug/:channelSlug?` is parsed via
 * react-router, mapped to `Server` + `Channel` through adapters. Voice
 * mute/deafen state is local UI mock for this commit; real LiveKit wiring
 * lands in a follow-up.
 */
import * as React from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
  ScrollTextIcon,
  ShieldAlertIcon,
  InboxIcon,
  StarIcon,
} from "lucide-react"
import type { AdapterSystemChannel, SystemChannelType } from "@/adapters"

import { ChannelSidebar } from "@/components/channel-sidebar"
import type { SystemChannel } from "@/components/channel-sidebar"
import { ChannelView } from "@/components/channel-view"
import {
  SystemChannelView,
  SYSTEM_CHANNEL_HEADERS,
} from "@/components/system-channel-view"
import { ServerRail } from "@/components/server-rail"
import { CheatSheet } from "@/components/cheat-sheet"
import { ServerSettingsDialog } from "@/components/server-settings-dialog"
import { UserSettingsDialog } from "@/components/user-settings-dialog"
import { FavoritesView } from "@/components/favorites-view"
import { CommandPalette } from "@/components/command-palette"
import { useIsMobile } from "@/hooks/use-mobile"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip.tsx"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RealChat } from "@/components/chat-real"
import { VoiceChannelView } from "@/components/voice-channel-view"
import { VoicePlaceholderView } from "@/components/voice/voice-placeholder-view"
import { useAuth } from "@/contexts/AuthContext"
import { getDeviceId } from "@/hooks/useAuth"
import { useInstanceContext } from "@/contexts/InstanceContext"
import * as mlsStore from "@/lib/mlsStore"
import { buildGuildRouteRef, parseGuildRouteRef } from "@/lib/slugify"
import { getActiveAuthInstanceUrlSync } from "@/lib/authInstanceStore"
import {
  kickUser,
  createGuildChannel,
  deleteGuildChannel,
  createGuildInvite,
  createGuild,
  leaveGuild,
  deleteGuild,
  createOrFindDM,
} from "@/lib/api"
import type {
  MemberRole,
  ServerMember,
} from "@/components/members-sidebar"

import {
  useGuilds,
  useChannelsForServer,
  useMembersForServer,
  deriveInitials,
} from "@/adapters"
import type { Server, Channel, ChannelCategory } from "@/adapters"
import { useVoiceChannelPresence } from "@/hooks/useVoiceChannelPresence"

interface FavoriteEntry {
  id: string
  messageId: string
  body: string
  author: string
  authorInitials: string
  channelId: string
  channelName: string
  channelKind: "text" | "voice"
  serverId: string
  serverName: string
  savedAt: number
}

interface JoinedVoice {
  channelId: string
  channelName: string
  serverId: string
  serverName: string
  instanceUrl: string
}

interface VoiceControls {
  toggleMic?: () => void
  toggleDeafen?: () => void
  toggleScreenShare?: () => void
  switchScreenSource?: () => void
  toggleWebcam?: () => void
  isScreenSharing?: boolean
  isWebcamOn?: boolean
}

interface VoiceState {
  isMicOn: boolean
  isDeafened: boolean
  isScreenSharing: boolean
  isWebcamOn: boolean
}

function systemIconFor(type: SystemChannelType): React.ReactNode {
  return type === "moderation" ? <ShieldAlertIcon /> : <ScrollTextIcon />
}

function adaptSystemChannelsForSidebar(
  rows: AdapterSystemChannel[]
): SystemChannel[] {
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    icon: systemIconFor(row.systemChannelType),
  }))
}

const HOME_SYSTEM_CHANNELS: SystemChannel[] = [
  { id: "catch-up", name: "Catch up", icon: <InboxIcon /> },
  { id: "favorites", name: "Favorites", icon: <StarIcon /> },
]

type ShellChannelKind = Channel["kind"] | "system"

interface ShellChannel {
  id: string
  name: string
  kind: ShellChannelKind
}

export function AuthenticatedApp() {
  const params = useParams<{
    instance?: string
    guildSlug?: string
    channelSlug?: string
  }>()
  const navigate = useNavigate()
  const { user, performLogout } = useAuth() as {
    user: { id: string; username?: string; display_name?: string } | null
    performLogout: () => Promise<void>
  }
  const { getTokenForInstance, getWsClient, refreshGuilds, dmGuilds } = useInstanceContext() as unknown as {
    getTokenForInstance: (url: string) => string | null
    getWsClient: (url: string) => unknown | null
    refreshGuilds: (instanceUrl: string) => Promise<void>
    dmGuilds: Array<{
      id: string
      otherUser?: { id: string; username?: string; displayName?: string }
      channelId?: string
      instanceUrl?: string
    }>
  }
  const isMobile = useIsMobile()

  const { servers } = useGuilds()

  const parsedGuild = React.useMemo(
    () => (params.guildSlug ? parseGuildRouteRef(params.guildSlug) : { guildId: null }),
    [params.guildSlug]
  )

  const activeServer = React.useMemo<Server | null>(() => {
    if (!params.instance || !parsedGuild.guildId) return null
    return (
      servers.find(
        (s) => s.instanceHost === params.instance && s.id === parsedGuild.guildId
      ) ?? null
    )
  }, [servers, params.instance, parsedGuild.guildId])

  const instanceUrl = activeServer?.raw.instanceUrl ?? null
  const token = instanceUrl ? getTokenForInstance(instanceUrl) : null
  const baseUrl = instanceUrl ?? ""
  const wsClient = instanceUrl ? getWsClient(instanceUrl) : null
  const currentUserId = user?.id ?? ""

  const {
    categories,
    channels,
    systemChannels: systemChannelRows,
    onCategoriesChange,
    onChannelsChange,
    refetch: refetchChannels,
  } = useChannelsForServer({
    serverId: activeServer?.id ?? null,
    token,
    baseUrl,
  })

  const sidebarSystemChannels = React.useMemo<SystemChannel[]>(
    () => adaptSystemChannelsForSidebar(systemChannelRows),
    [systemChannelRows]
  )
  const { members, refetch: refetchMembers } = useMembersForServer({
    serverId: activeServer?.id ?? null,
    token,
    baseUrl,
    currentUserId,
  })

  const voicePresence = useVoiceChannelPresence(
    (instanceUrl ? getWsClient(instanceUrl) : null) as Parameters<
      typeof useVoiceChannelPresence
    >[0],
    currentUserId
  )

  // Augment voice-channel rows with their live participant rosters so
  // the sidebar surfaces the same Discord-style presence the mockup
  // demonstrates. Pure derivation — no extra state machine.
  const channelsWithVoicePresence = React.useMemo<Channel[]>(() => {
    if (voicePresence.size === 0) return channels
    return channels.map((c) =>
      c.kind === "voice" && voicePresence.has(c.id)
        ? { ...c, participants: voicePresence.get(c.id) }
        : c
    )
  }, [channels, voicePresence])

  const currentUserRole = React.useMemo(
    () => members.find((m) => m.id === currentUserId)?.role,
    [members, currentUserId]
  )

  const handleKickMember = React.useCallback(
    async (member: ServerMember, reason: string) => {
      if (!activeServer || !token) return
      try {
        await kickUser(token, activeServer.id, member.id, reason, baseUrl)
        await refetchMembers()
      } catch (err) {
        console.error("kickUser failed", err)
        throw err
      }
    },
    [activeServer, token, baseUrl, refetchMembers]
  )

  const canAdministrate =
    currentUserRole === "owner" || currentUserRole === "admin"

  // Backend mints text/voice/category through the same endpoint with `type`
  // discriminator. Categories never carry a parentId; channels can be nested
  // under a category by passing it.
  const handleCreateChannel = React.useCallback(
    async (
      kind: "text" | "voice" | "category",
      name: string,
      parentId?: string | null
    ) => {
      if (!activeServer || !token) return
      const body =
        kind === "category" || parentId == null
          ? { name, type: kind }
          : { name, type: kind, parentId }
      await createGuildChannel(token, activeServer.id, body, baseUrl)
      await refetchChannels()
    },
    [activeServer, token, baseUrl, refetchChannels]
  )

  const handleDeleteChannel = React.useCallback(
    async (channelId: string) => {
      if (!activeServer || !token) return
      await deleteGuildChannel(token, activeServer.id, channelId, baseUrl)
      await refetchChannels()
    },
    [activeServer, token, baseUrl, refetchChannels]
  )

  const handleLeaveServer = React.useCallback(
    async (serverId: string) => {
      const target = servers.find((s) => s.id === serverId)
      if (!target?.raw.instanceUrl) return
      const tk = getTokenForInstance(target.raw.instanceUrl)
      if (!tk) return
      try {
        await leaveGuild(tk, serverId, target.raw.instanceUrl)
        await refreshGuilds(target.raw.instanceUrl)
        if (activeServer?.id === serverId) navigate("/home")
      } catch (err) {
        console.error("leaveGuild failed", err)
      }
    },
    [servers, getTokenForInstance, refreshGuilds, activeServer, navigate]
  )

  const handleDeleteServer = React.useCallback(
    async (serverId: string) => {
      const target = servers.find((s) => s.id === serverId)
      if (!target?.raw.instanceUrl) return
      const tk = getTokenForInstance(target.raw.instanceUrl)
      if (!tk) return
      try {
        await deleteGuild(tk, serverId, target.raw.instanceUrl)
        await refreshGuilds(target.raw.instanceUrl)
        if (activeServer?.id === serverId) navigate("/home")
      } catch (err) {
        console.error("deleteGuild failed", err)
      }
    },
    [servers, getTokenForInstance, refreshGuilds, activeServer, navigate]
  )

  // Role resolution per server: prefer the active server's full member list
  // (richest data), then the role propagated on the guild-list payload
  // (`permissionLevel` int or `ownerId === currentUserId`). Servers we have
  // no signal for return undefined; callers must treat that as "unknown",
  // not "member".
  const getServerRole = React.useCallback(
    (serverId: string): MemberRole | undefined => {
      if (serverId === activeServer?.id && currentUserRole) {
        return currentUserRole
      }
      return servers.find((s) => s.id === serverId)?.role
    },
    [activeServer, currentUserRole, servers]
  )

  const handleDirectMessage = React.useCallback(
    async (member: ServerMember) => {
      if (!activeServer || !token || !instanceUrl) return
      try {
        const dm = (await createOrFindDM(token, member.id, baseUrl)) as {
          id: string
          channelId: string
        }
        await refreshGuilds(instanceUrl)
        const host = activeServer.instanceHost ?? new URL(instanceUrl).host
        const guildRouteRef = buildGuildRouteRef(member.name, dm.id)
        navigate(`/${host}/${guildRouteRef}/${dm.channelId}`)
      } catch (err) {
        console.error("createOrFindDM failed", err)
      }
    },
    [activeServer, token, baseUrl, instanceUrl, refreshGuilds, navigate]
  )

  const handleCreateInvite = React.useCallback(async (): Promise<string | null> => {
    if (!activeServer || !token || !instanceUrl) return null
    const result = (await createGuildInvite(token, activeServer.id, {}, baseUrl)) as {
      code?: string
      inviteCode?: string
    }
    const code = result.code ?? result.inviteCode
    if (!code) return null
    const host = new URL(instanceUrl).host
    return `${window.location.origin}/join/${encodeURIComponent(host)}/${encodeURIComponent(code)}`
  }, [activeServer, token, baseUrl, instanceUrl])

  const [isCreateServerOpen, setIsCreateServerOpen] = React.useState(false)
  const [createServerName, setCreateServerName] = React.useState("")
  const [createServerBusy, setCreateServerBusy] = React.useState(false)
  const [createServerError, setCreateServerError] =
    React.useState<string | null>(null)

  const handleOpenServerSettings = React.useCallback((serverId: string) => {
    setSettingsTargetServerId(serverId)
    setIsServerSettingsOpen(true)
  }, [])

  const openCreateServerDialog = React.useCallback(() => {
    setCreateServerName("")
    setCreateServerError(null)
    setIsCreateServerOpen(true)
  }, [])

  const handleCreateServer = React.useCallback(async () => {
    const name = createServerName.trim()
    if (!name) {
      setCreateServerError("Server name required")
      return
    }

    const targetInstanceUrl =
      activeServer?.raw.instanceUrl ?? getActiveAuthInstanceUrlSync()
    if (!targetInstanceUrl) {
      setCreateServerError("No active instance available")
      return
    }
    const tk = getTokenForInstance(targetInstanceUrl)
    if (!tk) {
      setCreateServerError("No session for the active instance")
      return
    }

    setCreateServerBusy(true)
    setCreateServerError(null)
    try {
      const server = (await createGuild(
        tk,
        undefined,
        undefined,
        targetInstanceUrl,
        name
      )) as { id: string }
      await refreshGuilds(targetInstanceUrl)
      const host = new URL(targetInstanceUrl).host
      // Land on the new server root; AuthenticatedApp's effect below will
      // forward to its first text channel once the channel list resolves.
      navigate(`/${host}/${buildGuildRouteRef(name, server.id)}`)
      setCreateServerName("")
      setIsCreateServerOpen(false)
    } catch (err) {
      setCreateServerError(
        err instanceof Error ? err.message : "Failed to create server"
      )
    } finally {
      setCreateServerBusy(false)
    }
  }, [
    activeServer,
    createServerName,
    getTokenForInstance,
    refreshGuilds,
    navigate,
  ])

  const allChannels = React.useMemo(
    (): ShellChannel[] => [
      ...systemChannelRows.map((c) => ({
        id: c.id,
        name: c.name,
        kind: "system" as const,
      })),
      ...channels.map((c) => ({ id: c.id, name: c.name, kind: c.kind })),
    ],
    [systemChannelRows, channels]
  )

  // Fallback chain: exact slug match → first read-only system channel
  // (real backend id) → first text/voice → blank stub. A newly opened
  // server must never mount Chat on an unknown placeholder.
  const activeChannel = React.useMemo<ShellChannel>(() => {
    const match = allChannels.find((c) => c.id === params.channelSlug)
    if (match) return match
    const firstSystem = systemChannelRows[0]
    if (firstSystem) {
      return { id: firstSystem.id, name: firstSystem.name, kind: "system" }
    }
    const firstChannel = channels[0]
    if (firstChannel) {
      return {
        id: firstChannel.id,
        name: firstChannel.name,
        kind: firstChannel.kind,
      }
    }
    return { id: "", name: "Channel", kind: "text" }
  }, [allChannels, channels, params.channelSlug, systemChannelRows])

  const activeSystemChannelType = React.useMemo<SystemChannelType | null>(
    () =>
      activeChannel.kind === "system"
        ? systemChannelRows.find((c) => c.id === activeChannel.id)
            ?.systemChannelType ?? "server-log"
        : null,
    [activeChannel, systemChannelRows]
  )

  // Voice state — populated by <VoiceChannelView /> via onVoiceStateChange.
  // joinedVoice holds the active voice channel descriptor; mount/unmount of
  // <VoiceChannelView /> drives connect/disconnect.
  const [joinedVoice, setJoinedVoice] = React.useState<JoinedVoice | null>(null)
  // Channel id the user just hung up on. Suppresses the auto-rejoin
  // effect so leaving lands on the placeholder lobby rather than
  // immediately reconnecting. Cleared when the user navigates away
  // from voice routes or clicks "Join call" in the placeholder.
  const [voluntarilyLeftChannelId, setVoluntarilyLeftChannelId] =
    React.useState<string | null>(null)
  const [voiceState, setVoiceState] = React.useState({
    isMicOn: false,
    isDeafened: false,
    isScreenSharing: false,
    isWebcamOn: false,
  })
  const isMuted = !voiceState.isMicOn
  const isDeafened = voiceState.isDeafened
  const isVideoOn = voiceState.isWebcamOn
  const isScreenSharing = voiceState.isScreenSharing
  const voiceControlsRef = React.useRef<VoiceControls>({})
  const handleVoiceStateChange = React.useCallback(
    (next: VoiceState) => {
      setVoiceState(next)
    },
    []
  )
  const [isCommandOpen, setIsCommandOpen] = React.useState(false)
  const [isCheatSheetOpen, setIsCheatSheetOpen] = React.useState(false)
  const [isServerSettingsOpen, setIsServerSettingsOpen] = React.useState(false)
  const [settingsTargetServerId, setSettingsTargetServerId] =
    React.useState<string | null>(null)
  const [isUserSettingsOpen, setIsUserSettingsOpen] = React.useState(false)
  const [favorites, setFavorites] = React.useState<FavoriteEntry[]>([])
  const favoriteIds = React.useMemo(
    () => new Set(favorites.map((f) => f.messageId)),
    [favorites]
  )
  const [isDark, setIsDark] = React.useState(false)

  const railEntries = React.useMemo(
    () => [{ id: "home", name: "Home", initials: "HO" }, ...servers],
    [servers]
  )

  // DMs (isDm guilds) surfaced separately from regular servers in HomeSidebar.
  // Click navigates to the DM guild's text channel via the standard route.
  const homeDMs = React.useMemo(
    () =>
      dmGuilds
        .filter((g) => g.channelId)
        .map((g) => {
          const name =
            g.otherUser?.displayName ?? g.otherUser?.username ?? "user"
          return {
            id: g.channelId as string,
            name,
            initials: deriveInitials(name),
            presence: "online" as const,
          }
        }),
    [dmGuilds]
  )

  const handleSelectHomeDM = React.useCallback(
    (channelId: string) => {
      const dm = dmGuilds.find((g) => g.channelId === channelId)
      if (!dm?.instanceUrl) {
        navigate(`/home/${channelId}`)
        return
      }
      const host = new URL(dm.instanceUrl).host
      const name =
        dm.otherUser?.displayName ?? dm.otherUser?.username ?? "user"
      const ref = buildGuildRouteRef(name, dm.id)
      navigate(`/${host}/${ref}/${channelId}`)
    },
    [dmGuilds, navigate]
  )

  const navigateToServer = React.useCallback(
    (server: Server, channelId?: string) => {
      if (!server.instanceHost) return
      const ref = buildGuildRouteRef(
        server.raw._localName ?? server.raw.name ?? server.id,
        server.id
      )
      navigate(channelId ? `/${server.instanceHost}/${ref}/${channelId}` : `/${server.instanceHost}/${ref}`)
    },
    [navigate]
  )

  const handleSelectRail = React.useCallback(
    (id: string) => {
      if (id === "home") {
        navigate("/home")
        return
      }
      const server = servers.find((s) => s.id === id)
      if (server) navigateToServer(server)
    },
    [navigate, navigateToServer, servers]
  )

  const handleSelectChannel = React.useCallback(
    (id: string) => {
      if (!activeServer) return
      const channel = allChannels.find((c) => c.id === id)
      if (channel?.kind === "voice" && instanceUrl) {
        setJoinedVoice({
          channelId: id,
          channelName: channel.name,
          serverId: activeServer.id,
          serverName: activeServer.name,
          instanceUrl,
        })
      }
      navigateToServer(activeServer, id)
    },
    [activeServer, allChannels, navigateToServer, instanceUrl]
  )

  // Auto-redirect to first text channel when no channel selected (server view)
  React.useEffect(() => {
    if (!activeServer || params.channelSlug) return
    const first = channels[0]
    if (first) navigateToServer(activeServer, first.id)
  }, [activeServer, params.channelSlug, channels, navigateToServer])

  // Auto-join LiveKit when the URL points at a voice channel. The user
  // expectation is that opening a voice channel — by sidebar click, deep
  // link, refresh, or rail navigation — joins the room immediately, the
  // same way legacy hush-web behaved. No prejoin step. handleSelectChannel
  // already sets joinedVoice on click; this effect covers the deep-link /
  // refresh path where the sidebar handler never fired.
  React.useEffect(() => {
    if (!activeServer || !instanceUrl) return
    if (activeChannel.kind !== "voice") return
    if (joinedVoice && joinedVoice.channelId === activeChannel.id) return
    if (voluntarilyLeftChannelId === activeChannel.id) return
    setJoinedVoice({
      channelId: activeChannel.id,
      channelName: activeChannel.name,
      serverId: activeServer.id,
      serverName: activeServer.name,
      instanceUrl,
    })
  }, [activeServer, activeChannel, instanceUrl, joinedVoice, voluntarilyLeftChannelId])

  // Clear the voluntary-leave guard whenever the user moves off the
  // voice channel route — next time they come back it should auto-join.
  React.useEffect(() => {
    if (activeChannel.kind !== "voice") {
      if (voluntarilyLeftChannelId) setVoluntarilyLeftChannelId(null)
      return
    }
    if (
      voluntarilyLeftChannelId != null &&
      voluntarilyLeftChannelId !== activeChannel.id
    ) {
      setVoluntarilyLeftChannelId(null)
    }
  }, [activeChannel.kind, activeChannel.id, voluntarilyLeftChannelId])

  // Default to Catch-up surface when on /home with no channel slug
  React.useEffect(() => {
    if (activeServer || params.channelSlug) return
    if (params.instance || params.guildSlug) return
    navigate("/home/catch-up", { replace: true })
  }, [activeServer, params.channelSlug, params.instance, params.guildSlug, navigate])

  const handleToggleMute = React.useCallback(() => {
    voiceControlsRef.current.toggleMic?.()
  }, [])

  const handleToggleDeafen = React.useCallback(() => {
    voiceControlsRef.current.toggleDeafen?.()
  }, [])

  const handleToggleVideo = React.useCallback(() => {
    voiceControlsRef.current.toggleWebcam?.()
  }, [])

  const handleToggleScreen = React.useCallback(() => {
    voiceControlsRef.current.toggleScreenShare?.()
  }, [])

  const handleVoiceLeave = React.useCallback(() => {
    setVoluntarilyLeftChannelId(joinedVoice?.channelId ?? null)
    setJoinedVoice(null)
    setVoiceState({
      isMicOn: false,
      isDeafened: false,
      isScreenSharing: false,
      isWebcamOn: false,
    })
  }, [joinedVoice?.channelId])

  const handleJoinFromPlaceholder = React.useCallback(() => {
    if (!activeServer || !instanceUrl) return
    if (activeChannel.kind !== "voice") return
    setVoluntarilyLeftChannelId(null)
    setJoinedVoice({
      channelId: activeChannel.id,
      channelName: activeChannel.name,
      serverId: activeServer.id,
      serverName: activeServer.name,
      instanceUrl,
    })
  }, [activeServer, activeChannel, instanceUrl])

  const isViewingVoice =
    joinedVoice != null && activeChannel.id === joinedVoice.channelId
  const isVoiceChannelActive = activeChannel.kind === "voice"
  const showVoicePlaceholder = isVoiceChannelActive && !isViewingVoice
  const joinedVoiceInstanceUrl = joinedVoice?.instanceUrl ?? null
  // Voice connection lives on the joined-voice instance, not the
  // currently-navigated channel's instance. When the user navigates to
  // another instance while in voice, the VoiceChannel mount must keep
  // talking to the original instance's wsClient + token. Otherwise the
  // MLS voice group / WebSocket diverges from the active session.
  const voiceToken = joinedVoiceInstanceUrl
    ? getTokenForInstance(joinedVoiceInstanceUrl)
    : null
  const voiceWsClient = joinedVoiceInstanceUrl
    ? getWsClient(joinedVoiceInstanceUrl)
    : null
  const voiceGetToken = React.useCallback(
    () => voiceToken,
    [voiceToken]
  )

  const handleJumpToVoice = React.useCallback(() => {
    if (!joinedVoice) return
    const server = servers.find((s) => s.id === joinedVoice.serverId)
    if (server) navigateToServer(server, joinedVoice.channelId)
  }, [joinedVoice, navigateToServer, servers])

  const handleAddFavorite = React.useCallback(
    (entry: Omit<FavoriteEntry, "id" | "savedAt">) => {
      setFavorites((prev) => {
        if (prev.some((f) => f.messageId === entry.messageId)) return prev
        return [
          { ...entry, id: `fav-${entry.messageId}`, savedAt: Date.now() },
          ...prev,
        ]
      })
    },
    []
  )

  const handleRemoveFavorite = React.useCallback((messageId: string) => {
    setFavorites((prev) => prev.filter((f) => f.messageId !== messageId))
  }, [])

  const handleJumpToFavorite = React.useCallback(
    (entry: FavoriteEntry) => {
      const server = servers.find((s) => s.id === entry.serverId)
      if (server) navigateToServer(server, entry.channelId)
    },
    [navigateToServer, servers]
  )

  const handleToggleTheme = React.useCallback(() => {
    setIsDark((prev) => {
      const next = !prev
      document.documentElement.classList.toggle("dark", next)
      return next
    })
  }, [])

  // Keyboard shortcuts
  React.useEffect(() => {
    function isEditableTarget(target: EventTarget | null): boolean {
      if (!(target instanceof HTMLElement)) return false
      const tag = target.tagName
      if (tag === "INPUT" || tag === "TEXTAREA") return true
      if (target.isContentEditable) return true
      return false
    }

    function handleKeyDown(event: KeyboardEvent) {
      const mod = event.metaKey || event.ctrlKey
      const key = event.key
      const editable = isEditableTarget(event.target)

      if (mod && key.toLowerCase() === "k") {
        event.preventDefault()
        setIsCommandOpen((prev) => !prev)
        return
      }
      if (mod && (key === "/" || (event.shiftKey && key === "?"))) {
        event.preventDefault()
        setIsCheatSheetOpen((prev) => !prev)
        return
      }
      if (mod && /^[1-9]$/.test(key)) {
        event.preventDefault()
        const idx = Number(key) - 1
        const target = railEntries[idx]
        if (target) handleSelectRail(target.id)
        return
      }
      if (mod && event.shiftKey && key.toLowerCase() === "m") {
        if (!joinedVoice) return
        event.preventDefault()
        handleToggleMute()
        return
      }
      if (mod && event.shiftKey && key.toLowerCase() === "d") {
        if (!joinedVoice) return
        event.preventDefault()
        handleToggleDeafen()
        return
      }
      if (key === "Escape" && !editable && !mod && !event.altKey) {
        return
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [
    joinedVoice,
    railEntries,
    handleSelectRail,
    handleToggleMute,
    handleToggleDeafen,
  ])

  // Channel palette: only the active server has its channel list fetched
  // (useChannelsForServer keys on activeServer.id). Earlier this code
  // flat-mapped every server across the same active-server channel list,
  // producing a cartesian product where each server appeared with channels
  // it does not own. Restrict to active server's channels until per-server
  // pre-fetch lands.
  const paletteChannels = React.useMemo(
    () =>
      activeServer
        ? channels.map((c) => ({
            id: c.id,
            name: c.name,
            kind: c.kind,
            serverId: activeServer.id,
            serverName: activeServer.name,
          }))
        : [],
    [activeServer, channels]
  )

  const voiceProps = joinedVoice
    ? {
        channelName: joinedVoice.channelName,
        serverName: joinedVoice.serverName,
        isMuted,
        isDeafened,
        isVideoOn,
        isScreenSharing,
        onToggleMute: handleToggleMute,
        onToggleDeafen: handleToggleDeafen,
        onToggleVideo: handleToggleVideo,
        onToggleScreen: handleToggleScreen,
        onDisconnect: handleVoiceLeave,
        onJump: handleJumpToVoice,
      }
    : undefined

  // Sidebar user prop (prototype shape).
  const sidebarUser = React.useMemo(
    () => ({
      name: user?.display_name ?? user?.username ?? "you",
      email: user?.username ?? "",
      initials: deriveInitials(user?.display_name ?? user?.username ?? "you"),
    }),
    [user?.display_name, user?.username]
  )

  // Stable Chat.jsx prop callbacks
  const getStore = React.useCallback(
    () => mlsStore.openStore(currentUserId, getDeviceId()),
    [currentUserId]
  )
  const getHistoryStore = React.useCallback(
    () => mlsStore.openHistoryStore(currentUserId, getDeviceId()),
    [currentUserId]
  )
  const getToken = React.useCallback(
    () => (instanceUrl ? getTokenForInstance(instanceUrl) : null),
    [instanceUrl, getTokenForInstance]
  )

  // Build message body for current channel.
  const isHomeSurface = !activeServer
  const isCatchUp = isHomeSurface && params.channelSlug === "catch-up"
  const isFavoritesSurface = isHomeSurface && params.channelSlug === "favorites"

  // System channels are server-side audit/log feeds — never mount the MLS
  // chat over them. SystemChannelView handles their dedicated render.
  const isSystemChannel = activeChannel.kind === "system"
  const chatBody =
    activeServer &&
    activeChannel.kind === "text" &&
    activeChannel.id &&
    !isSystemChannel ? (
      <RealChat
        channelId={activeChannel.id}
        channelName={activeChannel.name}
        serverId={activeServer.id}
        currentUserId={currentUserId}
        getToken={getToken}
        getStore={getStore}
        getHistoryStore={getHistoryStore}
        wsClient={wsClient}
        members={members}
        baseUrl={baseUrl}
      />
    ) : null

  const channelContent = isFavoritesSurface ? (
    <ChannelView
      channelId="favorites"
      channelName="Favorites"
      channelKind="home"
      channelTopic="Messages you saved across servers"
      headerIcon={<StarIcon className="size-5 text-muted-foreground" />}
      messageBody={
        <FavoritesView
          favorites={favorites}
          onJump={handleJumpToFavorite}
          onRemove={handleRemoveFavorite}
        />
      }
    />
  ) : isCatchUp ? (
    <ChannelView
      channelId="catch-up"
      channelName="Catch up"
      channelKind="home"
      channelTopic="Mentions, replies, threads, DMs"
    />
  ) : activeServer && isSystemChannel ? (
    (() => {
      const sysSource = activeSystemChannelType ?? "server-log"
      const sysHeader = SYSTEM_CHANNEL_HEADERS[sysSource]
      return (
        <ChannelView
          channelId={activeChannel.id}
          channelName={sysHeader.title}
          channelKind="text"
          channelTopic={sysHeader.topic}
          channelContext={{
            serverId: activeServer.id,
            serverName: activeServer.name,
          }}
          headerIcon={sysHeader.icon}
          members={members}
          currentUserRole={currentUserRole}
          onKickMember={handleKickMember}
          onDirectMessage={handleDirectMessage}
          messageBody={
            <SystemChannelView
              serverId={activeServer.id}
              source={sysSource}
              token={token}
              baseUrl={baseUrl}
            />
          }
        />
      )
    })()
  ) : activeServer ? (
    <ChannelView
      channelId={activeChannel.id}
      channelName={activeChannel.name}
      channelKind={activeChannel.kind === "voice" ? "voice" : "text"}
      channelContext={{
        serverId: activeServer.id,
        serverName: activeServer.name,
      }}
      members={members}
      currentUserRole={currentUserRole}
      onKickMember={handleKickMember}
      onDirectMessage={handleDirectMessage}
      messageBody={chatBody}
      favoriteIds={favoriteIds}
      onAddFavorite={handleAddFavorite}
      onRemoveFavorite={handleRemoveFavorite}
    />
  ) : (
    <ChannelView
      channelId={params.channelSlug ?? ""}
      channelName="DM"
      channelKind="text"
      channelTopic="Direct message"
    />
  )

  return (
    <TooltipProvider>
      <ServerRail
        servers={servers}
        activeRailId={activeServer?.id ?? "home"}
        onSelect={handleSelectRail}
        getServerRole={getServerRole}
        onLeaveServer={handleLeaveServer}
        onDeleteServer={handleDeleteServer}
        onOpenServerSettings={handleOpenServerSettings}
        onCreateServer={openCreateServerDialog}
        onDiscoverServers={() => navigate("/explore")}
      />
      <SidebarProvider className="h-svh min-h-0! overflow-hidden bg-sidebar md:pl-(--rail-width)">
        {isMobile
          ? activeServer
            ? <ChannelSidebar
                serverName={activeServer.name}
                serverPlan="Server"
                systemChannels={sidebarSystemChannels}
                categories={categories}
                channels={channelsWithVoicePresence}
                onCategoriesChange={onCategoriesChange}
                onChannelsChange={onChannelsChange}
                activeChannelId={activeChannel.id}
                onSelectChannel={handleSelectChannel}
                user={sidebarUser}
                railEntries={railEntries}
                activeRailId={activeServer.id}
                onSelectRail={handleSelectRail}
                voice={voiceProps}
                onOpenServerSettings={() => {
                  if (activeServer) handleOpenServerSettings(activeServer.id)
                }}
                onOpenUserSettings={() => setIsUserSettingsOpen(true)}
                onCreateChannel={handleCreateChannel}
                onDeleteChannel={handleDeleteChannel}
                onCreateInvite={handleCreateInvite}
                canAdministrate={canAdministrate}
                onCreateServer={openCreateServerDialog}
                onDiscoverServers={() => navigate("/explore")}
              />
            : <HomeSidebar
                user={sidebarUser}
                railEntries={railEntries}
                activeRailId="home"
                onSelectRail={handleSelectRail}
                activeChannelId={params.channelSlug ?? "catch-up"}
                onSelectChannel={(id) => {
                  if (homeDMs.some((d) => d.id === id)) {
                    handleSelectHomeDM(id)
                    return
                  }
                  navigate(`/home/${id}`)
                }}
                voice={voiceProps}
                onOpenUserSettings={() => setIsUserSettingsOpen(true)}
                directMessages={homeDMs}
                onCreateServer={openCreateServerDialog}
                onDiscoverServers={() => navigate("/explore")}
              />
          : null}
        <ResizablePanelGroup
          orientation="horizontal"
          className="h-full w-full"
        >
          {!isMobile ? (
            <ResizablePanel
              id="shell-sidebar"
              defaultSize="18rem"
              minSize="14rem"
              maxSize="22rem"
            >
              {activeServer ? (
                <ChannelSidebar
                  serverName={activeServer.name}
                  serverPlan="Server"
                  systemChannels={sidebarSystemChannels}
                  categories={categories}
                  channels={channelsWithVoicePresence}
                  onCategoriesChange={onCategoriesChange}
                  onChannelsChange={onChannelsChange}
                  activeChannelId={activeChannel.id}
                  onSelectChannel={handleSelectChannel}
                  user={sidebarUser}
                  railEntries={railEntries}
                  activeRailId={activeServer.id}
                  onSelectRail={handleSelectRail}
                  voice={voiceProps}
                  onOpenServerSettings={() => {
                    if (activeServer) handleOpenServerSettings(activeServer.id)
                  }}
                  onOpenUserSettings={() => setIsUserSettingsOpen(true)}
                  onCreateChannel={handleCreateChannel}
                  onDeleteChannel={handleDeleteChannel}
                  onCreateInvite={handleCreateInvite}
                  canAdministrate={canAdministrate}
                  onCreateServer={openCreateServerDialog}
                  onDiscoverServers={() => navigate("/explore")}
                />
              ) : (
                <HomeSidebar
                  user={sidebarUser}
                  railEntries={railEntries}
                  activeRailId="home"
                  onSelectRail={handleSelectRail}
                  activeChannelId={params.channelSlug ?? "catch-up"}
                  onSelectChannel={(id) => {
                    if (homeDMs.some((d) => d.id === id)) {
                      handleSelectHomeDM(id)
                      return
                    }
                    navigate(`/home/${id}`)
                  }}
                  voice={voiceProps}
                  onOpenUserSettings={() => setIsUserSettingsOpen(true)}
                  directMessages={homeDMs}
                />
              )}
            </ResizablePanel>
          ) : null}
          {!isMobile ? (
            <ResizableHandle className="bg-transparent! focus:outline-none focus-visible:ring-0 data-[resize-handle-active]:bg-transparent! data-[resize-handle-state=hover]:bg-transparent! data-[resize-handle-state=drag]:bg-transparent!" />
          ) : null}
          <ResizablePanel
            id="shell-main"
            minSize="20rem"
            className="flex"
          >
            <SidebarInset className="md:m-2 md:ml-0 md:rounded-xl md:overflow-hidden md:shadow-sm md:mb-0! md:rounded-b-none!">
              {joinedVoice && joinedVoiceInstanceUrl ? (
                <div
                  style={{
                    display: isViewingVoice ? "flex" : "none",
                    height: "100%",
                    flexDirection: "column",
                  }}
                >
                  <VoiceChannelView
                    key={joinedVoice.channelId}
                    channel={{
                      id: joinedVoice.channelId,
                      name: joinedVoice.channelName,
                      type: "voice",
                    }}
                    serverId={joinedVoice.serverId}
                    getToken={voiceGetToken}
                    wsClient={voiceWsClient}
                    members={
                      activeServer?.id === joinedVoice.serverId ? members : []
                    }
                    myRole={
                      activeServer?.id === joinedVoice.serverId
                        ? currentUserRole ?? "member"
                        : "member"
                    }
                    onLeave={handleVoiceLeave}
                    voiceControlsRef={voiceControlsRef}
                    onVoiceStateChange={handleVoiceStateChange}
                    baseUrl={joinedVoiceInstanceUrl}
                  />
                </div>
              ) : null}
              {showVoicePlaceholder ? (
                <VoicePlaceholderView
                  channelName={activeChannel.name}
                  onJoinCall={handleJoinFromPlaceholder}
                />
              ) : null}
              {!isViewingVoice && !showVoicePlaceholder ? channelContent : null}
            </SidebarInset>
          </ResizablePanel>
        </ResizablePanelGroup>
      </SidebarProvider>
      <CommandPalette
        open={isCommandOpen}
        onOpenChange={setIsCommandOpen}
        channels={paletteChannels}
        servers={servers}
        onJumpServer={(id) => {
          const server = servers.find((s) => s.id === id)
          if (server) navigateToServer(server)
        }}
        onJumpChannel={(channel) => {
          const server = servers.find((s) => s.id === channel.serverId)
          if (server) navigateToServer(server, channel.id)
        }}
        onToggleTheme={handleToggleTheme}
        onToggleMute={handleToggleMute}
        onGoHome={() => navigate("/home")}
        onOpenCheatSheet={() => setIsCheatSheetOpen(true)}
        isDark={isDark}
        onDiscoverServers={() => navigate("/explore")}
        onCreateServer={openCreateServerDialog}
        onOpenSettings={() => setIsUserSettingsOpen(true)}
        onSignOut={async () => {
          await performLogout()
        }}
      />
      <CheatSheet open={isCheatSheetOpen} onOpenChange={setIsCheatSheetOpen} />
      <Dialog open={isCreateServerOpen} onOpenChange={setIsCreateServerOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create server</DialogTitle>
            <DialogDescription>
              Create a server on your active Hush instance.
            </DialogDescription>
          </DialogHeader>
          <form
            className="flex flex-col gap-3 py-2"
            onSubmit={(event) => {
              event.preventDefault()
              void handleCreateServer()
            }}
          >
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="create-server-name">Server name</Label>
              <Input
                id="create-server-name"
                value={createServerName}
                onChange={(event) => {
                  setCreateServerName(event.target.value)
                  setCreateServerError(null)
                }}
                disabled={createServerBusy}
                placeholder="My server"
              />
            </div>
            {createServerError ? (
              <div className="text-sm text-destructive">
                {createServerError}
              </div>
            ) : null}
            <DialogFooter>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsCreateServerOpen(false)}
                disabled={createServerBusy}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createServerBusy || !createServerName.trim()}
              >
                {createServerBusy ? "Creating..." : "Create server"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      {(() => {
        const targetServerId = settingsTargetServerId
        const targetServer = targetServerId
          ? servers.find((s) => s.id === targetServerId)
          : null
        const targetRole = targetServerId
          ? getServerRole(targetServerId)
          : undefined
        return (
          <ServerSettingsDialog
            open={isServerSettingsOpen}
            onOpenChange={setIsServerSettingsOpen}
            serverName={targetServer?.name ?? activeServer?.name ?? "Server"}
            onDeleteServer={
              targetServerId && targetRole === "owner"
                ? async () => {
                    await handleDeleteServer(targetServerId)
                    setIsServerSettingsOpen(false)
                  }
                : undefined
            }
          />
        )
      })()}
      <UserSettingsDialog
        open={isUserSettingsOpen}
        onOpenChange={setIsUserSettingsOpen}
        account={
          user
            ? {
                displayName: user.display_name ?? user.username ?? "you",
                username: user.username ?? "",
              }
            : undefined
        }
        onSignOut={async () => {
          await performLogout()
          setIsUserSettingsOpen(false)
        }}
      />
    </TooltipProvider>
  )
}

interface HomeDM {
  id: string
  name: string
  initials: string
  presence: "online" | "idle" | "dnd" | "offline"
}

function HomeSidebar({
  user,
  railEntries,
  activeRailId,
  onSelectRail,
  activeChannelId,
  onSelectChannel,
  voice,
  onOpenUserSettings,
  directMessages,
  onCreateServer,
  onDiscoverServers,
}: {
  user: { name: string; email: string; initials: string }
  railEntries: { id: string; name: string; initials: string }[]
  activeRailId: string
  onSelectRail: (id: string) => void
  activeChannelId: string
  onSelectChannel: (id: string) => void
  voice?: React.ComponentProps<typeof ChannelSidebar>["voice"]
  onOpenUserSettings?: () => void
  directMessages: HomeDM[]
  onCreateServer?: () => void
  onDiscoverServers?: () => void
}) {
  return (
    <ChannelSidebar
      serverName="Home"
      serverPlan="Sweet Home"
      systemChannels={HOME_SYSTEM_CHANNELS}
      directMessages={directMessages}
      categories={[] as ChannelCategory[]}
      channels={[] as Channel[]}
      activeChannelId={activeChannelId}
      onSelectChannel={onSelectChannel}
      user={user}
      railEntries={railEntries}
      activeRailId={activeRailId}
      onSelectRail={onSelectRail}
      voice={voice}
      onOpenUserSettings={onOpenUserSettings}
      serverMenuEnabled={false}
      onCreateServer={onCreateServer}
      onDiscoverServers={onDiscoverServers}
    />
  )
}

export default AuthenticatedApp
