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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { TextChannelView } from "@/components/text-channel-view"
import { ThreadPanel } from "@/components/thread-panel"
import { VoiceChannelView } from "@/components/voice-channel-view"
import { HomeView } from "@/components/home-view"

type ChannelKind = "text" | "voice" | "home"

const EMPTY_MEMBERS: ServerMember[] = []
const EMPTY_VOICE_PARTICIPANTS: VoiceParticipantInfo[] = []

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
  onKickMember?: (member: ServerMember, reason: string) => void | Promise<void>
  onDirectMessage?: (member: ServerMember) => void | Promise<void>
  /** Slot — production hush-web mounts the legacy Chat for text channels. */
  messageBody?: React.ReactNode
  /** Slot — production hush-web mounts the legacy VoiceChannel for voice channels. */
  voiceBody?: React.ReactNode
  /** Override the header icon (default routes by `channelKind`). Used
   *  when the channel is a system feed (server-log / moderation) or a
   *  home aggregate (favorites) so the surface gets its bespoke icon
   *  while still living inside the shared header shell. */
  headerIcon?: React.ReactNode
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
  members = EMPTY_MEMBERS,
  voiceParticipants = EMPTY_VOICE_PARTICIPANTS,
  currentUserRole,
  onKickMember,
  onDirectMessage,
  messageBody,
  voiceBody,
  headerIcon,
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
        <SidebarTrigger className="md:hidden shrink-0" />
        <span className="shrink-0">
          {headerIcon ?? <ChannelHeaderIcon kind={channelKind} />}
        </span>
        {/* Title + optional topic, both bound to the same min-w-0
            container so they share the header's flexible width and
            collapse with ellipsis instead of wrapping under the
            sidebar/members icons. The right-side icon cluster keeps a
            stable position because this region absorbs every overflow.
            On <md viewports the inline topic is hidden — instead, the
            title becomes a popover trigger so a tap reveals the topic
            without the description ever fighting for header width. */}
        <div className="flex min-w-0 flex-1 items-center gap-2">
          {channelTopic ? (
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="min-w-0 truncate text-left font-semibold md:cursor-default md:pointer-events-none"
                  // The trigger only acts as a popover on small screens
                  // so desktop users keep a normal-feeling label while
                  // still seeing the inline topic next to it. The
                  // `md:pointer-events-none` disables the popover
                  // trigger entirely once the inline topic is visible.
                >
                  {channelName}
                </button>
              </PopoverTrigger>
              <PopoverContent
                side="bottom"
                align="start"
                sideOffset={6}
                className="w-72 md:hidden"
              >
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-semibold">{channelName}</span>
                  <span className="text-sm text-muted-foreground">
                    {channelTopic}
                  </span>
                </div>
              </PopoverContent>
            </Popover>
          ) : (
            <span className="truncate font-semibold">{channelName}</span>
          )}
          {channelTopic ? (
            <>
              <Separator
                orientation="vertical"
                className="mx-1 hidden shrink-0 md:block data-[orientation=vertical]:h-4"
              />
              <span className="hidden truncate text-sm text-muted-foreground md:inline">
                {channelTopic}
              </span>
            </>
          ) : null}
        </div>
        {channelKind !== "home" ? (
          <div className="ml-auto flex shrink-0 items-center gap-1 text-muted-foreground">
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
            voiceBody={voiceBody}
            mockParticipants={voiceParticipants}
          />
        ) : channelKind === "home" ? (
          // messageBody slot wins for home surfaces (favorites,
          // catch-up) so the parent supplies its own scroll body
          // while still using the shared header chrome.
          messageBody ?? <HomeView />
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
              {messageBody ?? (
                <TextChannelView
                  channelId={channelId}
                  channelName={channelName}
                  onOpenThread={toggleThread}
                  channelContext={channelContext}
                  channelKind="text"
                  favoriteIds={favoriteIds}
                  onAddFavorite={onAddFavorite}
                  onRemoveFavorite={onRemoveFavorite}
                />
              )}
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
          messageBody ?? (
            <TextChannelView
              channelId={channelId}
              channelName={channelName}
              onOpenThread={setThread}
              channelContext={channelContext}
              channelKind="text"
              favoriteIds={favoriteIds}
              onAddFavorite={onAddFavorite}
              onRemoveFavorite={onRemoveFavorite}
            />
          )
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
