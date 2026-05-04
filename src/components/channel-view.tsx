import * as React from "react"
import { useIsMobile } from "@/hooks/use-mobile"
import {
  MembersSidebar,
  type MemberRole,
  type ServerMember,
} from "@/components/members-sidebar"
import {
  HashIcon,
  Volume2Icon,
  UsersIcon,
  InboxIcon,
} from "lucide-react"
import { PinnedMessagesPopover } from "@/components/pinned-messages-popover"
import { getPinnedForChannel } from "@/data/messages"

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { Separator } from "@/components/ui/separator.tsx"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { TextChannelView } from "@/components/text-channel-view"
import { ThreadPanel } from "@/components/thread-panel"
import { VoiceChannelView } from "@/components/voice-channel-view"
import { HomeView } from "@/components/home-view"

type ChannelKind = "text" | "voice" | "home"

type ThreadParent = {
  author: string
  initials: string
  timestamp: string
  body: string
}

interface ChannelContext {
  serverId: string
  serverName: string
}

interface FavoritePayload {
  messageId: string
  body: string
  author: string
  authorInitials: string
  channelId: string
  channelName: string
  channelKind: "text" | "voice"
  serverId: string
  serverName: string
}

interface VoiceParticipantInfo {
  id: string
  name: string
  initials: string
  isMuted?: boolean
  isDeafened?: boolean
  isSpeaking?: boolean
}

interface ChannelViewProps {
  channelId: string
  channelName: string
  channelKind: ChannelKind
  channelTopic?: string
  channelContext?: ChannelContext
  favoriteIds?: Set<string>
  onAddFavorite?: (entry: FavoritePayload) => void
  onRemoveFavorite?: (messageId: string) => void
  members?: ServerMember[]
  voiceParticipants?: VoiceParticipantInfo[]
  currentUserRole?: MemberRole
  onKickMember?: (member: ServerMember) => void | Promise<void>
  onDirectMessage?: (member: ServerMember) => void | Promise<void>
}

export function ChannelView({
  channelId,
  channelName,
  channelKind,
  channelTopic,
  channelContext,
  favoriteIds,
  onAddFavorite,
  onRemoveFavorite,
  members = [],
  voiceParticipants = [],
  currentUserRole,
  onKickMember,
  onDirectMessage,
}: ChannelViewProps) {
  const [membersOpen, setMembersOpen] = React.useState(false)
  const [thread, setThread] = React.useState<ThreadParent | null>(null)

  React.useEffect(() => {
    setThread(null)
  }, [channelName, channelKind])

  const isMobile = useIsMobile()

  const pinnedMessages = React.useMemo(
    () => (channelKind === "text" ? getPinnedForChannel(channelId) : []),
    [channelId, channelKind]
  )

  const handleJumpToPinned = React.useCallback((messageId: string) => {
    const el = document.querySelector<HTMLElement>(
      `[data-message-id="${messageId}"]`
    )
    if (!el) return
    el.scrollIntoView({ behavior: "smooth", block: "center" })
    el.dataset.jumpFlash = "true"
    window.setTimeout(() => {
      delete el.dataset.jumpFlash
    }, 1600)
  }, [])

  const toggleThread = React.useCallback((parent: ThreadParent) => {
    setThread((prev) => {
      if (
        prev &&
        prev.timestamp === parent.timestamp &&
        prev.author === parent.author &&
        prev.body === parent.body
      ) {
        return null
      }
      return parent
    })
  }, [])

  return (
    <div className="flex h-full min-h-0 w-full">
      <div className="flex h-full min-w-0 flex-1 flex-col">
      <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="md:hidden" />
        <ChannelHeaderIcon kind={channelKind} />
        <span className="font-semibold">{channelName}</span>
        {channelTopic ? (
          <>
            <Separator
              orientation="vertical"
              className="mx-2 data-[orientation=vertical]:h-4"
            />
            <span className="truncate text-sm text-muted-foreground">
              {channelTopic}
            </span>
          </>
        ) : null}
        {channelKind !== "home" ? (
          <div className="ml-auto flex items-center gap-1 text-muted-foreground">
            {channelKind === "text" ? (
              <PinnedMessagesPopover
                channelName={channelName}
                messages={pinnedMessages}
                onJump={handleJumpToPinned}
              />
            ) : null}
            <button
              type="button"
              onClick={() => setMembersOpen((p) => !p)}
              className="flex size-6 items-center justify-center rounded-md transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Show members"
            >
              <UsersIcon className="size-4" />
            </button>
          </div>
        ) : null}
      </header>
      <div className="min-h-0 flex-1 overflow-hidden">
        {channelKind === "voice" ? (
          <VoiceChannelView
            channelName={channelName}
            mockParticipants={voiceParticipants}
          />
        ) : channelKind === "home" ? (
          <HomeView />
        ) : thread && isMobile ? (
          <ThreadPanel
            channelName={channelName}
            parent={thread}
            onClose={() => setThread(null)}
          />
        ) : thread ? (
          <ResizablePanelGroup
            key={`thread-${channelName}`}
            orientation="horizontal"
            className="h-full"
          >
            <ResizablePanel
              id="main-panel"
              defaultSize="60%"
              minSize="30%"
            >
              <TextChannelView
                channelId={channelId}
                channelName={channelName}
                onOpenThread={toggleThread}
                channelContext={channelContext}
                channelKind={channelKind === "voice" ? "voice" : "text"}
                favoriteIds={favoriteIds}
                onAddFavorite={onAddFavorite}
                onRemoveFavorite={onRemoveFavorite}
              />
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel
              id="thread-panel"
              defaultSize="40%"
              minSize="25%"
              maxSize="60%"
            >
              <ThreadPanel
                channelName={channelName}
                parent={thread}
                onClose={() => setThread(null)}
              />
            </ResizablePanel>
          </ResizablePanelGroup>
        ) : (
          <TextChannelView
            channelId={channelId}
            channelName={channelName}
            onOpenThread={setThread}
          />
        )}
      </div>
      </div>
      {channelKind !== "home" ? (
        <MembersSidebar
          open={membersOpen}
          onOpenChange={setMembersOpen}
          serverName={channelContext?.serverName ?? channelName}
          members={members}
          isMobile={isMobile}
          currentUserRole={currentUserRole}
          onKickMember={onKickMember}
          onDirectMessage={onDirectMessage}
        />
      ) : null}
    </div>
  )
}

function ChannelHeaderIcon({ kind }: { kind: ChannelKind }) {
  if (kind === "voice") {
    return <Volume2Icon className="size-5 text-muted-foreground" />
  }
  if (kind === "home") {
    return <InboxIcon className="size-5 text-muted-foreground" />
  }
  return <HashIcon className="size-5 text-muted-foreground" />
}
