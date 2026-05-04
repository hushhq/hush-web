import * as React from "react"
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
  Channel,
  ChannelCategory,
  SystemChannel,
} from "@/components/channel-sidebar"
import { ChannelView } from "@/components/channel-view"
import { ServerRail } from "@/components/server-rail"
import type { Server } from "@/components/server-rail"
import { AuthFlow } from "@/components/auth/auth-flow"
import { CheatSheet } from "@/components/cheat-sheet"
import { ServerSettingsDialog } from "@/components/server-settings-dialog"
import { UserSettingsDialog } from "@/components/user-settings-dialog"
import { FavoritesView } from "@/components/favorites-view"
import type { ServerMember } from "@/components/members-sidebar"
import { CommandPalette } from "@/components/command-palette"
import { useIsMobile } from "@/hooks/use-mobile"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { BottomDock } from "@/components/bottom-dock"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"

const SERVERS: Server[] = [
  { id: "hush", name: "Hush HQ", initials: "H" },
  { id: "design", name: "Design Studio", initials: "DS" },
  { id: "research", name: "Research Lab", initials: "RL" },
  ...Array.from({ length: 16 }, (_, i) => ({
    id: `placeholder-${i + 1}`,
    name: `Placeholder Server ${i + 1}`,
    initials: `P${i + 1}`,
  })),
]

const SYSTEM_CHANNELS: SystemChannel[] = [
  {
    id: "server-log",
    name: "Server log",
    icon: <ScrollTextIcon />,
  },
  {
    id: "moderation",
    name: "Moderation",
    icon: <ShieldAlertIcon />,
  },
]

const HUSH_CATEGORIES: ChannelCategory[] = [
  { id: "talks", name: "Talks" },
  { id: "engineering", name: "Engineering" },
  { id: "meetings", name: "Meetings" },
  { id: "hangout", name: "Hangout" },
]

const HUSH_CHANNELS: Channel[] = [
  // Root (orphan) channels — appear above first category
  { id: "welcome", name: "welcome", kind: "text", categoryId: null },
  { id: "rules", name: "rules", kind: "text", categoryId: null },
  // Talks
  { id: "general", name: "general", kind: "text", categoryId: "talks", unreadCount: 3, mentionCount: 1 },
  { id: "random", name: "random", kind: "text", categoryId: "talks", unreadCount: 12 },
  { id: "announcements", name: "announcements", kind: "text", categoryId: "talks" },
  { id: "intros", name: "intros", kind: "text", categoryId: "talks" },
  // Engineering
  { id: "eng-backend", name: "backend", kind: "text", categoryId: "engineering", unreadCount: 8, mentionCount: 2 },
  { id: "eng-frontend", name: "frontend", kind: "text", categoryId: "engineering", unreadCount: 5 },
  { id: "eng-infra", name: "infra", kind: "text", categoryId: "engineering" },
  { id: "eng-mobile", name: "mobile", kind: "text", categoryId: "engineering", unreadCount: 1 },
  { id: "eng-releases", name: "releases", kind: "text", categoryId: "engineering" },
  { id: "eng-incidents", name: "incidents", kind: "text", categoryId: "engineering", mentionCount: 1 },
  { id: "eng-reviews", name: "code-reviews", kind: "text", categoryId: "engineering", unreadCount: 4 },
  // Meetings
  { id: "room-1", name: "Room 1", kind: "voice", categoryId: "meetings" },
  { id: "room-2", name: "Room 2", kind: "voice", categoryId: "meetings" },
  { id: "standup", name: "Daily standup", kind: "voice", categoryId: "meetings" },
  // Hangout
  {
    id: "chill",
    name: "Chill lounge",
    kind: "voice",
    categoryId: "hangout",
    participants: [
      { id: "vp-yarin", name: "yarin", initials: "YC", isSpeaking: true },
      { id: "vp-alex", name: "alex", initials: "AL" },
      { id: "vp-jamie", name: "jamie", initials: "JM", isMuted: true },
      { id: "vp-sasha", name: "sasha", initials: "SK", isDeafened: true, isMuted: true },
    ],
  },
  { id: "music-room", name: "Music room", kind: "voice", categoryId: "hangout" },
  { id: "gaming", name: "Gaming", kind: "voice", categoryId: "hangout" },
  { id: "watch-party", name: "Watch party", kind: "voice", categoryId: "hangout" },
  { id: "after-hours", name: "After hours", kind: "voice", categoryId: "hangout" },
]

const DESIGN_CATEGORIES: ChannelCategory[] = [
  { id: "ds-text", name: "Conversations" },
  { id: "ds-voice", name: "Studios" },
]

const DESIGN_CHANNELS: Channel[] = [
  { id: "ds-bulletin", name: "bulletin", kind: "text", categoryId: null },
  { id: "design-general", name: "general", kind: "text", categoryId: "ds-text", unreadCount: 5 },
  { id: "feedback", name: "feedback", kind: "text", categoryId: "ds-text", unreadCount: 2, mentionCount: 0 },
  { id: "ds-pairing", name: "Pairing room", kind: "voice", categoryId: "ds-voice" },
  { id: "ds-critique", name: "Critique", kind: "voice", categoryId: "ds-voice" },
]

const RESEARCH_CATEGORIES: ChannelCategory[] = [
  { id: "rl-text", name: "Discussion" },
  { id: "rl-voice", name: "Sync" },
]

const RESEARCH_CHANNELS: Channel[] = [
  { id: "papers", name: "papers", kind: "text", categoryId: "rl-text", unreadCount: 4 },
  { id: "experiments", name: "experiments", kind: "text", categoryId: "rl-text", unreadCount: 1, mentionCount: 1 },
  { id: "rl-reading", name: "Reading group", kind: "voice", categoryId: "rl-voice" },
]

const INITIAL_CATEGORIES_BY_SERVER: Record<string, ChannelCategory[]> = {
  hush: HUSH_CATEGORIES,
  design: DESIGN_CATEGORIES,
  research: RESEARCH_CATEGORIES,
}

const INITIAL_CHANNELS_BY_SERVER: Record<string, Channel[]> = {
  hush: HUSH_CHANNELS,
  design: DESIGN_CHANNELS,
  research: RESEARCH_CHANNELS,
}

const SYSTEM_CHANNELS_BY_SERVER: Record<string, SystemChannel[]> = {
  hush: SYSTEM_CHANNELS,
  design: [
    { id: "ds-log", name: "Server log", icon: <ScrollTextIcon /> },
  ],
  research: [
    { id: "rl-log", name: "Server log", icon: <ScrollTextIcon /> },
  ],
}

const MEMBERS_BY_SERVER: Record<string, ServerMember[]> = {
  hush: [
    { id: "m-yarin", name: "yarin", initials: "YC", presence: "online", role: "owner" },
    { id: "m-alex", name: "alex", initials: "AL", presence: "online", role: "admin" },
    { id: "m-priya", name: "priya", initials: "PS", presence: "online", role: "admin" },
    { id: "m-jamie", name: "jamie", initials: "JM", presence: "idle", role: "moderator" },
    { id: "m-noah", name: "noah", initials: "NK", presence: "online", role: "moderator" },
    { id: "m-mira", name: "mira", initials: "MI", presence: "dnd", role: "moderator" },
    { id: "m-sasha", name: "sasha", initials: "SK", presence: "online", role: "member" },
    { id: "m-marco", name: "marco", initials: "MR", presence: "dnd", role: "member" },
    { id: "m-elena", name: "elena", initials: "EM", presence: "offline", role: "member" },
    { id: "m-lia", name: "lia", initials: "LV", presence: "online", role: "member" },
    { id: "m-ravi", name: "ravi", initials: "RP", presence: "online", role: "member" },
    { id: "m-noor", name: "noor", initials: "NA", presence: "idle", role: "member" },
    { id: "m-finn", name: "finn", initials: "FO", presence: "online", role: "member" },
    { id: "m-yuki", name: "yuki", initials: "YT", presence: "dnd", role: "member" },
    { id: "m-leo", name: "leo", initials: "LB", presence: "offline", role: "member" },
    { id: "m-zara", name: "zara", initials: "ZH", presence: "online", role: "member" },
    { id: "m-tomas", name: "tomas", initials: "TS", presence: "online", role: "member" },
    { id: "m-ida", name: "ida", initials: "IL", presence: "idle", role: "member" },
    { id: "m-rico", name: "rico", initials: "RM", presence: "online", role: "member" },
    { id: "m-anna", name: "anna", initials: "AC", presence: "offline", role: "member" },
    { id: "m-leon", name: "leon", initials: "LE", presence: "online", role: "member" },
    { id: "m-mei", name: "mei", initials: "ML", presence: "dnd", role: "member" },
    { id: "m-omar", name: "omar", initials: "OQ", presence: "online", role: "member" },
    { id: "m-sara", name: "sara", initials: "SF", presence: "idle", role: "member" },
    { id: "m-paul", name: "paul", initials: "PG", presence: "online", role: "member" },
    { id: "m-nina", name: "nina", initials: "NB", presence: "offline", role: "member" },
    { id: "m-kai", name: "kai", initials: "KA", presence: "online", role: "member" },
    { id: "m-vera", name: "vera", initials: "VR", presence: "online", role: "member" },
    { id: "m-bo", name: "bo", initials: "BC", presence: "dnd", role: "member" },
    { id: "m-iris", name: "iris", initials: "IZ", presence: "online", role: "member" },
    { id: "m-niko", name: "niko", initials: "NV", presence: "idle", role: "member" },
    { id: "m-eva", name: "eva", initials: "EJ", presence: "online", role: "member" },
    { id: "m-luca", name: "luca", initials: "LD", presence: "offline", role: "member" },
    { id: "m-amir", name: "amir", initials: "AK", presence: "online", role: "member" },
    { id: "m-ines", name: "ines", initials: "IN", presence: "online", role: "member" },
    { id: "m-jon", name: "jon", initials: "JR", presence: "dnd", role: "member" },
    { id: "m-kira", name: "kira", initials: "KP", presence: "online", role: "member" },
    { id: "m-tom", name: "tom", initials: "TW", presence: "idle", role: "member" },
    { id: "m-lia2", name: "lia2", initials: "L2", presence: "online", role: "member" },
    { id: "m-rae", name: "rae", initials: "RH", presence: "online", role: "member" },
  ],
  design: [
    { id: "d-marco", name: "marco", initials: "MR", presence: "online", role: "owner" },
    { id: "d-lia", name: "lia", initials: "LV", presence: "online", role: "admin" },
    { id: "d-yarin", name: "yarin", initials: "YC", presence: "online", role: "member" },
    { id: "d-elena", name: "elena", initials: "EM", presence: "idle", role: "member" },
  ],
  research: [
    { id: "r-elena", name: "elena", initials: "EM", presence: "online", role: "owner" },
    { id: "r-yarin", name: "yarin", initials: "YC", presence: "online", role: "member" },
    { id: "r-sasha", name: "sasha", initials: "SK", presence: "offline", role: "member" },
  ],
}

const APPS: AppEntry[] = [
  { id: "linear", name: "Linear", icon: <PuzzleIcon /> },
  { id: "github", name: "GitHub", icon: <PuzzleIcon /> },
]

const USER = {
  name: "yarin",
  email: "yarin.cardillo@gmail.com",
  initials: "YC",
}

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

export function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false)

  if (!isAuthenticated) {
    return <AuthFlow onSignedIn={() => setIsAuthenticated(true)} />
  }

  return <AuthenticatedApp />
}

function AuthenticatedApp() {
  const [activeRailId, setActiveRailIdRaw] =
    React.useState<string>(SERVERS[0].id)
  const [activeChannelId, setActiveChannelId] = React.useState("general")
  const [categoriesByServer, setCategoriesByServer] = React.useState(
    INITIAL_CATEGORIES_BY_SERVER
  )
  const [channelsByServer, setChannelsByServer] = React.useState(
    INITIAL_CHANNELS_BY_SERVER
  )

  const firstTextChannelOf = React.useCallback(
    (serverId: string): string | null => {
      const cats = categoriesByServer[serverId] ?? []
      const chans = channelsByServer[serverId] ?? []
      // Prefer first root text channel, then in-category text, then anything
      const rootText = chans.find(
        (c) => c.categoryId === null && c.kind === "text"
      )
      if (rootText) return rootText.id
      for (const cat of cats) {
        const text = chans.find(
          (c) => c.categoryId === cat.id && c.kind === "text"
        )
        if (text) return text.id
      }
      return chans[0]?.id ?? null
    },
    [categoriesByServer, channelsByServer]
  )

  const setActiveRailId = React.useCallback(
    (id: string) => {
      setActiveRailIdRaw(id)
      if (id === "home") {
        setActiveChannelId("catch-up")
      } else {
        const first = firstTextChannelOf(id)
        if (first) setActiveChannelId(first)
      }
    },
    [firstTextChannelOf]
  )
  const [joinedVoice, setJoinedVoice] = React.useState<JoinedVoice | null>(null)
  const [isMuted, setIsMuted] = React.useState(false)
  const [isDeafened, setIsDeafened] = React.useState(false)
  const [mutedByDeafen, setMutedByDeafen] = React.useState(false)
  const [isVideoOn, setIsVideoOn] = React.useState(false)
  const [isScreenSharing, setIsScreenSharing] = React.useState(false)

  function handleToggleMute() {
    if (isDeafened) {
      setIsDeafened(false)
      setIsMuted(false)
      setMutedByDeafen(false)
    } else {
      setIsMuted((p) => !p)
      setMutedByDeafen(false)
    }
  }

  function handleToggleDeafen() {
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
  }
  const [isCommandOpen, setIsCommandOpen] = React.useState(false)
  const [isCheatSheetOpen, setIsCheatSheetOpen] = React.useState(false)
  const [isServerSettingsOpen, setIsServerSettingsOpen] = React.useState(false)
  const [isUserSettingsOpen, setIsUserSettingsOpen] = React.useState(false)
  const isMobile = useIsMobile()
  const [favorites, setFavorites] = React.useState<FavoriteEntry[]>([])
  const favoriteIds = React.useMemo(
    () => new Set(favorites.map((f) => f.messageId)),
    [favorites]
  )
  const [isDark, setIsDark] = React.useState(false)
  const channelHistoryRef = React.useRef<string[]>([])
  const historyIndexRef = React.useRef<number>(-1)
  const isNavigatingHistoryRef = React.useRef<boolean>(false)

  const activeServer = SERVERS.find((s) => s.id === activeRailId) ?? null
  const railEntries = [
    { id: "home", name: "Home", initials: "HO" },
    ...SERVERS,
  ]
  const activeServerSystemChannels = activeServer
    ? SYSTEM_CHANNELS_BY_SERVER[activeServer.id] ?? []
    : []
  const activeServerCategories = activeServer
    ? categoriesByServer[activeServer.id] ?? []
    : []
  const activeServerChannels = activeServer
    ? channelsByServer[activeServer.id] ?? []
    : []
  const allChannels: { id: string; name: string; kind: "text" | "voice" }[] = [
    ...activeServerSystemChannels.map((c) => ({
      id: c.id,
      name: c.name,
      kind: "text" as const,
    })),
    ...activeServerChannels.map((c) => ({
      id: c.id,
      name: c.name,
      kind: c.kind,
    })),
  ]

  const handleCategoriesChange = React.useCallback(
    (next: ChannelCategory[]) => {
      if (!activeServer) return
      setCategoriesByServer((prev) => ({
        ...prev,
        [activeServer.id]: next,
      }))
    },
    [activeServer]
  )

  const handleChannelsChange = React.useCallback(
    (next: Channel[]) => {
      if (!activeServer) return
      setChannelsByServer((prev) => ({
        ...prev,
        [activeServer.id]: next,
      }))
    },
    [activeServer]
  )
  const activeChannel =
    allChannels.find((c) => c.id === activeChannelId) ??
    allChannels[0] ?? { id: "", name: "Channel", kind: "text" as const }

  function handleSelectChannel(id: string) {
    setActiveChannelId(id)
    const channel = allChannels.find((c) => c.id === id)
    if (channel?.kind === "voice" && activeServer) {
      setJoinedVoice({
        channelId: id,
        channelName: channel.name,
        serverId: activeServer.id,
        serverName: activeServer.name,
      })
    }
  }

  function handleJumpToVoice() {
    if (!joinedVoice) return
    setActiveRailId(joinedVoice.serverId)
    setActiveChannelId(joinedVoice.channelId)
  }

  const handleAddFavorite = React.useCallback(
    (entry: Omit<FavoriteEntry, "id" | "savedAt">) => {
      setFavorites((prev) => {
        if (prev.some((f) => f.messageId === entry.messageId)) return prev
        return [
          {
            ...entry,
            id: `fav-${entry.messageId}`,
            savedAt: Date.now(),
          },
          ...prev,
        ]
      })
    },
    []
  )

  const handleRemoveFavorite = React.useCallback((messageId: string) => {
    setFavorites((prev) => prev.filter((f) => f.messageId !== messageId))
  }, [])

  const handleJumpToFavorite = React.useCallback((entry: FavoriteEntry) => {
    setActiveRailIdRaw(entry.serverId)
    setActiveChannelId(entry.channelId)
  }, [])

  function handleToggleTheme() {
    setIsDark((prev) => {
      const next = !prev
      document.documentElement.classList.toggle("dark", next)
      return next
    })
  }

  React.useEffect(() => {
    if (isNavigatingHistoryRef.current) {
      isNavigatingHistoryRef.current = false
      return
    }
    const history = channelHistoryRef.current
    const truncated = history.slice(0, historyIndexRef.current + 1)
    if (truncated[truncated.length - 1] !== activeChannelId) {
      truncated.push(activeChannelId)
    }
    channelHistoryRef.current = truncated
    historyIndexRef.current = truncated.length - 1
  }, [activeChannelId])

  const navigateHistory = React.useCallback((direction: 1 | -1) => {
    const history = channelHistoryRef.current
    const next = historyIndexRef.current + direction
    if (next < 0 || next >= history.length) return
    historyIndexRef.current = next
    isNavigatingHistoryRef.current = true
    setActiveChannelId(history[next])
  }, [])

  const navigateChannel = React.useCallback(
    (direction: 1 | -1) => {
      if (allChannels.length === 0) return
      const idx = allChannels.findIndex((c) => c.id === activeChannelId)
      const nextIdx =
        idx === -1
          ? 0
          : (idx + direction + allChannels.length) % allChannels.length
      handleSelectChannel(allChannels[nextIdx].id)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeChannelId, allChannels.length]
  )

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
      if (mod && key === "[") {
        event.preventDefault()
        navigateHistory(-1)
        return
      }
      if (mod && key === "]") {
        event.preventDefault()
        navigateHistory(1)
        return
      }
      if (mod && /^[1-9]$/.test(key)) {
        event.preventDefault()
        const idx = Number(key) - 1
        const target = railEntries[idx]
        if (target) setActiveRailId(target.id)
        return
      }
      if (event.altKey && (key === "ArrowUp" || key === "ArrowDown")) {
        event.preventDefault()
        navigateChannel(key === "ArrowDown" ? 1 : -1)
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
        // mark-as-read placeholder; without backend it's a no-op
        return
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [joinedVoice, navigateChannel, navigateHistory, railEntries.length])

  const paletteChannels = SERVERS.flatMap((server) =>
    (channelsByServer[server.id] ?? []).map((c) => ({
      id: c.id,
      name: c.name,
      kind: c.kind,
      serverId: server.id,
      serverName: server.name,
    }))
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

  return (
    <TooltipProvider>
      <ServerRail
        servers={SERVERS}
        activeRailId={activeRailId}
        onSelect={setActiveRailId}
      />
      <SidebarProvider className="h-svh min-h-0! overflow-hidden bg-sidebar md:pl-(--rail-width)">
        {isMobile
          ? activeServer
            ? <ChannelSidebar
                serverName={activeServer.name}
                serverPlan="Server"
                systemChannels={activeServerSystemChannels}
                categories={activeServerCategories}
                channels={activeServerChannels}
                onCategoriesChange={handleCategoriesChange}
                onChannelsChange={handleChannelsChange}
                apps={APPS}
                activeChannelId={activeChannelId}
                onSelectChannel={handleSelectChannel}
                user={USER}
                railEntries={railEntries}
                activeRailId={activeRailId}
                onSelectRail={setActiveRailId}
                voice={voiceProps}
                onOpenServerSettings={() => setIsServerSettingsOpen(true)}
                onOpenUserSettings={() => setIsUserSettingsOpen(true)}
              />
            : <HomeSidebar
                user={USER}
                railEntries={railEntries}
                activeRailId={activeRailId}
                onSelectRail={setActiveRailId}
                activeChannelId={activeChannelId}
                onSelectChannel={setActiveChannelId}
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
                systemChannels={activeServerSystemChannels}
                categories={activeServerCategories}
                channels={activeServerChannels}
                onCategoriesChange={handleCategoriesChange}
                onChannelsChange={handleChannelsChange}
                apps={APPS}
                activeChannelId={activeChannelId}
                onSelectChannel={handleSelectChannel}
                user={USER}
                railEntries={railEntries}
                activeRailId={activeRailId}
                onSelectRail={setActiveRailId}
                voice={voiceProps}
                onOpenServerSettings={() => setIsServerSettingsOpen(true)}
                onOpenUserSettings={() => setIsUserSettingsOpen(true)}
              />
            ) : (
              <HomeSidebar
                user={USER}
                railEntries={railEntries}
                activeRailId={activeRailId}
                onSelectRail={setActiveRailId}
                activeChannelId={activeChannelId}
                onSelectChannel={setActiveChannelId}
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
          {activeServer ? (
            <ChannelView
              channelId={activeChannel.id}
              channelName={activeChannel.name}
              channelKind={activeChannel.kind}
              channelTopic={`${activeChannel.kind === "voice" ? "Voice channel" : "Text channel"} — prototype placeholder`}
              channelContext={{
                serverId: activeServer.id,
                serverName: activeServer.name,
              }}
              favoriteIds={favoriteIds}
              onAddFavorite={handleAddFavorite}
              onRemoveFavorite={handleRemoveFavorite}
              members={MEMBERS_BY_SERVER[activeServer.id] ?? []}
              voiceParticipants={
                activeServerChannels.find((c) => c.id === activeChannel.id)
                  ?.participants ?? []
              }
            />
          ) : activeChannelId === "catch-up" ? (
            <ChannelView
              channelId="catch-up"
              channelName="Catch up"
              channelKind="home"
              channelTopic="Mentions, replies, threads, DMs"
            />
          ) : activeChannelId === "favorites" ? (
            <FavoritesView
              favorites={favorites}
              onJump={handleJumpToFavorite}
              onRemove={handleRemoveFavorite}
            />
          ) : (
            <ChannelView
              channelId={activeChannelId}
              channelName={
                HOME_DMS.find((d) => d.id === activeChannelId)?.name ?? "DM"
              }
              channelKind="text"
              channelTopic="Direct message"
            />
          )}
        </SidebarInset>
          </ResizablePanel>
        </ResizablePanelGroup>
      </SidebarProvider>
      <CommandPalette
        open={isCommandOpen}
        onOpenChange={setIsCommandOpen}
        channels={paletteChannels}
        servers={SERVERS}
        onJumpServer={(id) => setActiveRailId(id)}
        onJumpChannel={(channel) => {
          setActiveRailId(channel.serverId)
          handleSelectChannel(channel.id)
        }}
        onToggleTheme={handleToggleTheme}
        onToggleMute={handleToggleMute}
        onGoHome={() => setActiveRailId("home")}
        onOpenCheatSheet={() => setIsCheatSheetOpen(true)}
        isDark={isDark}
      />
      <CheatSheet open={isCheatSheetOpen} onOpenChange={setIsCheatSheetOpen} />
      <ServerSettingsDialog
        open={isServerSettingsOpen}
        onOpenChange={setIsServerSettingsOpen}
        serverName={activeServer?.name ?? "Server"}
      />
      <UserSettingsDialog
        open={isUserSettingsOpen}
        onOpenChange={setIsUserSettingsOpen}
      />
    </TooltipProvider>
  )
}

const HOME_SYSTEM_CHANNELS: SystemChannel[] = [
  { id: "catch-up", name: "Catch up", icon: <InboxIcon /> },
  { id: "favorites", name: "Favorites", icon: <StarIcon /> },
]

const HOME_DMS = [
  { id: "dm-alex", name: "alex", initials: "AL", presence: "online" as const },
  { id: "dm-jamie", name: "jamie", initials: "JM", presence: "idle" as const },
  { id: "dm-sasha", name: "sasha", initials: "SK", presence: "online" as const },
  { id: "dm-marco", name: "marco", initials: "MR", presence: "dnd" as const },
  { id: "dm-elena", name: "elena", initials: "EM", presence: "offline" as const },
]

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
      categories={[]}
      channels={[]}
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

export default App
