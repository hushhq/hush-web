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
  PuzzleIcon,
  InboxIcon,
  StarIcon,
} from "lucide-react"

import { ChannelSidebar } from "@/components/channel-sidebar"
import type {
  AppEntry,
  SystemChannel,
} from "@/components/channel-sidebar"
import { ChannelView } from "@/components/channel-view"
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
// @ts-expect-error legacy JS
import Chat from "@/components/Chat"
// @ts-expect-error legacy JS
import { useAuth } from "@/contexts/AuthContext"
// @ts-expect-error legacy JS
import { getDeviceId } from "@/hooks/useAuth"
// @ts-expect-error legacy JS
import { useInstanceContext } from "@/contexts/InstanceContext"
// @ts-expect-error legacy JS
import * as mlsStore from "@/lib/mlsStore"
// @ts-expect-error legacy JS
import { buildGuildRouteRef, parseGuildRouteRef } from "@/lib/slugify"
// @ts-expect-error legacy JS
import {
  kickUser,
  createGuildChannel,
  deleteGuildChannel,
  createGuildInvite,
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
}

const APPS: AppEntry[] = [
  // Backend support pending — kept as visual placeholder per design spec.
  { id: "linear", name: "Linear", icon: <PuzzleIcon /> },
  { id: "github", name: "GitHub", icon: <PuzzleIcon /> },
]

const SYSTEM_CHANNELS: SystemChannel[] = [
  // Backend support pending — kept as visual placeholder per design spec.
  { id: "server-log", name: "Server log", icon: <ScrollTextIcon /> },
  { id: "moderation", name: "Moderation", icon: <ShieldAlertIcon /> },
]

const HOME_SYSTEM_CHANNELS: SystemChannel[] = [
  { id: "catch-up", name: "Catch up", icon: <InboxIcon /> },
  { id: "favorites", name: "Favorites", icon: <StarIcon /> },
]

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
  const { getTokenForInstance, getWsClient, refreshGuilds } = useInstanceContext() as {
    getTokenForInstance: (url: string) => string | null
    getWsClient: (url: string) => unknown | null
    refreshGuilds: (instanceUrl: string) => Promise<void>
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
    onCategoriesChange,
    onChannelsChange,
    refetch: refetchChannels,
  } = useChannelsForServer({
    serverId: activeServer?.id ?? null,
    token,
    baseUrl,
  })
  const { members, refetch: refetchMembers } = useMembersForServer({
    serverId: activeServer?.id ?? null,
    token,
    baseUrl,
    currentUserId,
  })

  const currentUserRole = React.useMemo(
    () => members.find((m) => m.id === currentUserId)?.role,
    [members, currentUserId]
  )

  const handleKickMember = React.useCallback(
    async (member: ServerMember) => {
      if (!activeServer || !token) return
      try {
        await kickUser(token, activeServer.id, member.id, "", baseUrl)
        await refetchMembers()
      } catch (err) {
        console.error("kickUser failed", err)
      }
    },
    [activeServer, token, baseUrl, refetchMembers]
  )

  const canAdministrate =
    currentUserRole === "owner" || currentUserRole === "admin"

  const handleCreateChannel = React.useCallback(
    async (kind: "text" | "voice", name: string) => {
      if (!activeServer || !token) return
      await createGuildChannel(token, activeServer.id, { name, type: kind }, baseUrl)
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

  const getServerRole = React.useCallback(
    (serverId: string): MemberRole | undefined => {
      if (serverId !== activeServer?.id) return undefined
      return currentUserRole
    },
    [activeServer, currentUserRole]
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

  const allChannels = React.useMemo(
    () => [
      ...SYSTEM_CHANNELS.map((c) => ({
        id: c.id,
        name: c.name,
        kind: "text" as const,
      })),
      ...channels.map((c) => ({ id: c.id, name: c.name, kind: c.kind })),
    ],
    [channels]
  )

  // Fallback chain: exact slug match → first real text channel (skip placeholder
  // SYSTEM_CHANNELS which have no backend) → empty stub. Avoids mounting Chat.jsx
  // on a fake channel id like "server-log" when channelSlug is missing/invalid.
  const activeChannel = React.useMemo(
    () =>
      allChannels.find((c) => c.id === params.channelSlug) ??
      channels.find((c) => c.kind === "text") ??
      { id: "", name: "Channel", kind: "text" as const },
    [allChannels, channels, params.channelSlug]
  )

  // Mock voice / favorites state (UI only until backend lands).
  const [joinedVoice, setJoinedVoice] = React.useState<JoinedVoice | null>(null)
  const [isMuted, setIsMuted] = React.useState(false)
  const [isDeafened, setIsDeafened] = React.useState(false)
  const [mutedByDeafen, setMutedByDeafen] = React.useState(false)
  const [isVideoOn, setIsVideoOn] = React.useState(false)
  const [isScreenSharing, setIsScreenSharing] = React.useState(false)
  const [isCommandOpen, setIsCommandOpen] = React.useState(false)
  const [isCheatSheetOpen, setIsCheatSheetOpen] = React.useState(false)
  const [isServerSettingsOpen, setIsServerSettingsOpen] = React.useState(false)
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
      if (channel?.kind === "voice") {
        setJoinedVoice({
          channelId: id,
          channelName: channel.name,
          serverId: activeServer.id,
          serverName: activeServer.name,
        })
      }
      navigateToServer(activeServer, id)
    },
    [activeServer, allChannels, navigateToServer]
  )

  // Auto-redirect to first text channel when no channel selected (server view)
  React.useEffect(() => {
    if (!activeServer || params.channelSlug) return
    const first = channels[0]
    if (first) navigateToServer(activeServer, first.id)
  }, [activeServer, params.channelSlug, channels, navigateToServer])

  // Default to Catch-up surface when on /home with no channel slug
  React.useEffect(() => {
    if (activeServer || params.channelSlug) return
    if (params.instance || params.guildSlug) return
    navigate("/home/catch-up", { replace: true })
  }, [activeServer, params.channelSlug, params.instance, params.guildSlug, navigate])

  const handleToggleMute = React.useCallback(() => {
    if (isDeafened) {
      setIsDeafened(false)
      setIsMuted(false)
      setMutedByDeafen(false)
    } else {
      setIsMuted((p) => !p)
      setMutedByDeafen(false)
    }
  }, [isDeafened])

  const handleToggleDeafen = React.useCallback(() => {
    if (isDeafened) {
      setIsDeafened(false)
      if (mutedByDeafen) {
        setIsMuted(false)
        setMutedByDeafen(false)
      }
    } else {
      setIsDeafened(true)
      if (!isMuted) {
        setIsMuted(true)
        setMutedByDeafen(true)
      }
    }
  }, [isDeafened, isMuted, mutedByDeafen])

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

  const paletteChannels = React.useMemo(
    () =>
      servers.flatMap((server) =>
        channels.map((c) => ({
          id: c.id,
          name: c.name,
          kind: c.kind,
          serverId: server.id,
          serverName: server.name,
        }))
      ),
    [servers, channels]
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
        onToggleVideo: () => setIsVideoOn((prev) => !prev),
        onToggleScreen: () => setIsScreenSharing((prev) => !prev),
        onDisconnect: () => setJoinedVoice(null),
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

  // Guard against SYSTEM_CHANNELS (server-log/moderation placeholders) — those
  // ids have no backend channel and would crash MLS group lookup in Chat.jsx.
  const isSystemChannel = SYSTEM_CHANNELS.some((s) => s.id === activeChannel.id)
  const chatBody =
    activeServer &&
    activeChannel.kind === "text" &&
    activeChannel.id &&
    !isSystemChannel ? (
      <Chat
        channelId={activeChannel.id}
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
    <FavoritesView
      favorites={favorites}
      onJump={handleJumpToFavorite}
      onRemove={handleRemoveFavorite}
    />
  ) : isCatchUp ? (
    <ChannelView
      channelId="catch-up"
      channelName="Catch up"
      channelKind="home"
      channelTopic="Mentions, replies, threads, DMs"
    />
  ) : activeServer ? (
    <ChannelView
      channelId={activeChannel.id}
      channelName={activeChannel.name}
      channelKind={activeChannel.kind}
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
      voiceParticipants={[]}
      features={{
        threads: false,
        pinnedMessages: false,
        favorites: false,
        reactions: false,
      }}
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
        onOpenServerSettings={() => setIsServerSettingsOpen(true)}
      />
      <SidebarProvider className="h-svh min-h-0! overflow-hidden bg-sidebar md:pl-(--rail-width)">
        {isMobile
          ? activeServer
            ? <ChannelSidebar
                serverName={activeServer.name}
                serverPlan="Server"
                systemChannels={SYSTEM_CHANNELS}
                categories={categories}
                channels={channels}
                onCategoriesChange={onCategoriesChange}
                onChannelsChange={onChannelsChange}
                apps={APPS}
                activeChannelId={activeChannel.id}
                onSelectChannel={handleSelectChannel}
                user={sidebarUser}
                railEntries={railEntries}
                activeRailId={activeServer.id}
                onSelectRail={handleSelectRail}
                voice={voiceProps}
                onOpenServerSettings={() => setIsServerSettingsOpen(true)}
                onOpenUserSettings={() => setIsUserSettingsOpen(true)}
                onCreateChannel={handleCreateChannel}
                onDeleteChannel={handleDeleteChannel}
                onCreateInvite={handleCreateInvite}
                canAdministrate={canAdministrate}
              />
            : <HomeSidebar
                user={sidebarUser}
                railEntries={railEntries}
                activeRailId="home"
                onSelectRail={handleSelectRail}
                activeChannelId={params.channelSlug ?? "catch-up"}
                onSelectChannel={(id) => navigate(`/home/${id}`)}
                voice={voiceProps}
                onOpenUserSettings={() => setIsUserSettingsOpen(true)}
              />
          : null}
        <ResizablePanelGroup
          direction="horizontal"
          autoSaveId="hush-shell-v3"
          className="h-full w-full"
        >
          {!isMobile ? (
            <ResizablePanel
              id="shell-sidebar"
              order={1}
              defaultSize="18rem"
              minSize="14rem"
              maxSize="22rem"
            >
              {activeServer ? (
                <ChannelSidebar
                  serverName={activeServer.name}
                  serverPlan="Server"
                  systemChannels={SYSTEM_CHANNELS}
                  categories={categories}
                  channels={channels}
                  onCategoriesChange={onCategoriesChange}
                  onChannelsChange={onChannelsChange}
                  apps={APPS}
                  activeChannelId={activeChannel.id}
                  onSelectChannel={handleSelectChannel}
                  user={sidebarUser}
                  railEntries={railEntries}
                  activeRailId={activeServer.id}
                  onSelectRail={handleSelectRail}
                  voice={voiceProps}
                  onOpenServerSettings={() => setIsServerSettingsOpen(true)}
                  onOpenUserSettings={() => setIsUserSettingsOpen(true)}
                  onCreateChannel={handleCreateChannel}
                  onDeleteChannel={handleDeleteChannel}
                  onCreateInvite={handleCreateInvite}
                  canAdministrate={canAdministrate}
                />
              ) : (
                <HomeSidebar
                  user={sidebarUser}
                  railEntries={railEntries}
                  activeRailId="home"
                  onSelectRail={handleSelectRail}
                  activeChannelId={params.channelSlug ?? "catch-up"}
                  onSelectChannel={(id) => navigate(`/home/${id}`)}
                  voice={voiceProps}
                  onOpenUserSettings={() => setIsUserSettingsOpen(true)}
                />
              )}
            </ResizablePanel>
          ) : null}
          {!isMobile ? (
            <ResizableHandle className="bg-transparent! focus:outline-none focus-visible:ring-0 data-[resize-handle-active]:bg-transparent! data-[resize-handle-state=hover]:bg-transparent! data-[resize-handle-state=drag]:bg-transparent!" />
          ) : null}
          <ResizablePanel
            id="shell-main"
            order={2}
            minSize="20rem"
            className="flex"
          >
            <SidebarInset className="md:m-2 md:ml-0 md:rounded-xl md:overflow-hidden md:shadow-sm md:mb-0! md:rounded-b-none!">
              {channelContent}
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
      />
      <CheatSheet open={isCheatSheetOpen} onOpenChange={setIsCheatSheetOpen} />
      <ServerSettingsDialog
        open={isServerSettingsOpen}
        onOpenChange={setIsServerSettingsOpen}
        serverName={activeServer?.name ?? "Server"}
        onDeleteServer={
          activeServer && currentUserRole === "owner"
            ? async () => {
                await handleDeleteServer(activeServer.id)
                setIsServerSettingsOpen(false)
              }
            : undefined
        }
      />
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

// Direct messages — backend support pending. Empty until DM channel
// CRUD lands; HomeSidebar still renders the section so layout matches.
const HOME_DMS: { id: string; name: string; initials: string; presence: "online" | "idle" | "dnd" | "offline" }[] = []

function HomeSidebar({
  user,
  railEntries,
  activeRailId,
  onSelectRail,
  activeChannelId,
  onSelectChannel,
  voice,
  onOpenUserSettings,
}: {
  user: { name: string; email: string; initials: string }
  railEntries: { id: string; name: string; initials: string }[]
  activeRailId: string
  onSelectRail: (id: string) => void
  activeChannelId: string
  onSelectChannel: (id: string) => void
  voice?: React.ComponentProps<typeof ChannelSidebar>["voice"]
  onOpenUserSettings?: () => void
}) {
  return (
    <ChannelSidebar
      serverName="Home"
      serverPlan="Sweet Home"
      systemChannels={HOME_SYSTEM_CHANNELS}
      directMessages={HOME_DMS}
      categories={[] as ChannelCategory[]}
      channels={[] as Channel[]}
      apps={[]}
      activeChannelId={activeChannelId}
      onSelectChannel={onSelectChannel}
      user={user}
      railEntries={railEntries}
      activeRailId={activeRailId}
      onSelectRail={onSelectRail}
      voice={voice}
      onOpenUserSettings={onOpenUserSettings}
    />
  )
}

export default AuthenticatedApp
