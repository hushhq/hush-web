import * as React from "react"
import {
  SmilePlusIcon,
  ReplyIcon,
  PinIcon,
  MoreHorizontalIcon,
  MessageSquareIcon,
  MessagesSquareIcon,
  ChevronRightIcon,
  CopyIcon,
  XIcon,
  StarIcon,
  StarOffIcon,
} from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  Chat,
  ChatMessages,
  ChatEvent,
  ChatEventAddon,
  ChatEventBody,
  ChatEventTitle,
  ChatEventTime,
  ChatEventAvatar,
  ChatEventContent,
  ChatEventHoverActions,
  ChatEventHoverActionsButton,
} from "@/components/chat"
import { MessageContent } from "@/components/message-content"
import { MessageComposer } from "@/components/message-composer"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

import { getMessagesForChannel } from "@/data/messages"
import type { SampleMessage as Message } from "@/data/messages"

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

interface TextChannelViewProps {
  channelId: string
  channelName: string
  channelKind?: "text" | "voice"
  channelContext?: { serverId: string; serverName: string }
  favoriteIds?: Set<string>
  /** Optional real-data messages from an adapter. When omitted, falls back
   * to mock prototype data so the component stays usable in isolation. */
  messages?: Message[]
  onOpenThread?: (message: { author: string; initials: string; timestamp: string; body: string }) => void
  onAddFavorite?: (entry: FavoritePayload) => void
  onRemoveFavorite?: (messageId: string) => void
}

export function TextChannelView({
  channelId,
  channelName,
  channelKind = "text",
  channelContext,
  favoriteIds,
  messages,
  onOpenThread,
  onAddFavorite,
  onRemoveFavorite,
}: TextChannelViewProps) {
  const baseMessages = React.useMemo(
    () => messages ?? getMessagesForChannel(channelId),
    [messages, channelId]
  )
  const [localMessages, setLocalMessages] = React.useState<Message[]>([])
  const [replyTo, setReplyTo] = React.useState<{
    author: string
    body: string
  } | null>(null)
  React.useEffect(() => {
    setLocalMessages([])
    setReplyTo(null)
  }, [channelId])
  const allMessages = React.useMemo(
    () => [...baseMessages, ...localMessages],
    [baseMessages, localMessages]
  )
  const groups = groupConsecutive(allMessages)

  function handleSend(text: string) {
    const now = new Date()
    const hh = now.getHours().toString().padStart(2, "0")
    const mm = now.getMinutes().toString().padStart(2, "0")
    const body = replyTo
      ? `> **@${replyTo.author}** — ${truncate(replyTo.body, 120)}\n\n${text}`
      : text
    setLocalMessages((prev) => [
      ...prev,
      {
        id: `local-${now.getTime()}`,
        author: "yarin",
        initials: "YC",
        timestamp: `${hh}:${mm}`,
        body,
        date: "Today",
      },
    ])
    setReplyTo(null)
  }

  function handleReply(message: Message) {
    setReplyTo({ author: message.author, body: message.body })
  }

  function handleToggleFavorite(message: Message) {
    if (favoriteIds?.has(message.id)) {
      onRemoveFavorite?.(message.id)
      return
    }
    if (!channelContext) return
    onAddFavorite?.({
      messageId: message.id,
      body: message.body,
      author: message.author,
      authorInitials: message.initials,
      channelId,
      channelName,
      channelKind,
      serverId: channelContext.serverId,
      serverName: channelContext.serverName,
    })
  }

  return (
    <Chat>
      <ChatMessages>
        {groups
          .slice()
          .reverse()
          .map((group, revIdx, reversed) => (
            <React.Fragment key={group.head.id}>
              {/* in reverse iteration, followups are above head visually */}
              {group.followups
                .slice()
                .reverse()
                .map((message) => (
                  <FollowupMessage
                    key={message.id}
                    message={message}
                    onOpenThread={onOpenThread}
                    onReply={handleReply}
                    onToggleFavorite={handleToggleFavorite}
                    isFavorite={favoriteIds?.has(message.id) ?? false}
                  />
                ))}
              <PrimaryMessage
                message={group.head}
                onOpenThread={onOpenThread}
                onReply={handleReply}
                onToggleFavorite={handleToggleFavorite}
                isFavorite={favoriteIds?.has(group.head.id) ?? false}
              />
              {/* date separator appears at top of each date block (renders below chronologically older group) */}
              {revIdx === reversed.length - 1 ||
              reversed[revIdx + 1].date !== group.date ? (
                <DateSeparator label={group.date} />
              ) : null}
            </React.Fragment>
          ))}
      </ChatMessages>
      {replyTo ? (
        <ReplyPreview reply={replyTo} onCancel={() => setReplyTo(null)} />
      ) : null}
      <MessageComposer
        key={channelId}
        channelName={channelName}
        onSend={handleSend}
      />
    </Chat>
  )
}

function ReplyPreview({
  reply,
  onCancel,
}: {
  reply: { author: string; body: string }
  onCancel: () => void
}) {
  return (
    <div className="mx-2 mb-1 flex items-center gap-2 rounded-md border bg-muted/50 px-3 py-1.5 text-xs">
      <span className="text-muted-foreground">Replying to</span>
      <span className="font-medium">@{reply.author}</span>
      <span className="truncate text-muted-foreground">
        {truncate(reply.body, 80)}
      </span>
      <button
        type="button"
        onClick={onCancel}
        className="ml-auto rounded-sm p-0.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        aria-label="Cancel reply"
      >
        <XIcon className="size-3.5" />
      </button>
    </div>
  )
}

function truncate(value: string, max: number): string {
  if (value.length <= max) return value
  return `${value.slice(0, max - 1)}…`
}

type MessageGroupData = {
  date: string
  head: Message
  followups: Message[]
}

function groupConsecutive(messages: Message[]): MessageGroupData[] {
  const groups: MessageGroupData[] = []
  for (const message of messages) {
    const last = groups.at(-1)
    if (
      last &&
      last.head.author === message.author &&
      last.date === message.date
    ) {
      last.followups.push(message)
    } else {
      groups.push({ date: message.date, head: message, followups: [] })
    }
  }
  return groups
}

function DateSeparator({ label }: { label: string }) {
  return (
    <ChatEvent className="my-1 items-center gap-3">
      <Separator className="flex-1" />
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <Separator className="flex-1" />
    </ChatEvent>
  )
}

function PrimaryMessage({
  message,
  onOpenThread,
  onReply,
  onToggleFavorite,
  isFavorite,
}: {
  message: Message
  onOpenThread?: (message: { author: string; initials: string; timestamp: string; body: string }) => void
  onReply?: (message: Message) => void
  onToggleFavorite?: (message: Message) => void
  isFavorite?: boolean
}) {
  return (
    <ChatEvent
      data-message-id={message.id}
      className={cn(
        "group/event relative rounded-md py-1 transition-colors hover:bg-muted/60",
        message.isMention && "bg-primary/5 hover:bg-primary/10"
      )}
    >
      <ChatEventAddon>
        <ChatEventAvatar
          fallback={message.initials}
          fallbackProps={{ className: "text-xs" }}
        />
      </ChatEventAddon>
      <ChatEventBody>
        <ChatEventTitle>
          <span className="text-sm font-medium">{message.author}</span>
          <ChatEventTime
            timestamp={fakeTimestamp(message.timestamp)}
            format="time"
            className="text-xs text-muted-foreground"
          />
        </ChatEventTitle>
        <ChatEventContent>
          <MessageContent body={message.body} />
          {message.thread ? (
            <ThreadIndicator
              thread={message.thread}
              onClick={() =>
                onOpenThread?.({
                  author: message.author,
                  initials: message.initials,
                  timestamp: message.timestamp,
                  body: message.body,
                })
              }
            />
          ) : null}
        </ChatEventContent>
      </ChatEventBody>
      <HoverActions
        message={message}
        onOpenThread={onOpenThread}
        onReply={onReply}
        onToggleFavorite={onToggleFavorite}
        isFavorite={isFavorite}
      />
    </ChatEvent>
  )
}

function FollowupMessage({
  message,
  onOpenThread,
  onReply,
  onToggleFavorite,
  isFavorite,
}: {
  message: Message
  onOpenThread?: (message: { author: string; initials: string; timestamp: string; body: string }) => void
  onReply?: (message: Message) => void
  onToggleFavorite?: (message: Message) => void
  isFavorite?: boolean
}) {
  return (
    <ChatEvent
      data-message-id={message.id}
      className={cn(
        "group/event relative rounded-md py-1 transition-colors hover:bg-muted/60",
        message.isMention && "bg-primary/5 hover:bg-primary/10"
      )}
    >
      <ChatEventAddon>
        <ChatEventTime
          timestamp={fakeTimestamp(message.timestamp)}
          format="time"
          className="opacity-0 text-[10px] text-muted-foreground group-hover/event:opacity-100 transition-opacity"
        />
      </ChatEventAddon>
      <ChatEventBody>
        <ChatEventContent>
          <MessageContent body={message.body} />
          {message.thread ? (
            <ThreadIndicator
              thread={message.thread}
              onClick={() =>
                onOpenThread?.({
                  author: message.author,
                  initials: message.initials,
                  timestamp: message.timestamp,
                  body: message.body,
                })
              }
            />
          ) : null}
        </ChatEventContent>
      </ChatEventBody>
      <HoverActions
        message={message}
        onOpenThread={onOpenThread}
        onReply={onReply}
        onToggleFavorite={onToggleFavorite}
        isFavorite={isFavorite}
      />
    </ChatEvent>
  )
}

function HoverActions({
  message,
  onOpenThread,
  onReply,
  onToggleFavorite,
  isFavorite,
}: {
  message: Message
  onOpenThread?: (message: { author: string; initials: string; timestamp: string; body: string }) => void
  onReply?: (message: Message) => void
  onToggleFavorite?: (message: Message) => void
  isFavorite?: boolean
}) {
  return (
    <ChatEventHoverActions>
      <ChatEventHoverActionsButton aria-label="React">
        <SmilePlusIcon />
      </ChatEventHoverActionsButton>
      <ChatEventHoverActionsButton
        aria-label="Reply"
        onClick={() => onReply?.(message)}
      >
        <ReplyIcon />
      </ChatEventHoverActionsButton>
      <ChatEventHoverActionsButton
        aria-label="Open thread"
        onClick={() =>
          onOpenThread?.({
            author: message.author,
            initials: message.initials,
            timestamp: message.timestamp,
            body: message.body,
          })
        }
      >
        <MessagesSquareIcon />
      </ChatEventHoverActionsButton>
      <ChatEventHoverActionsButton aria-label="Pin">
        <PinIcon />
      </ChatEventHoverActionsButton>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <ChatEventHoverActionsButton aria-label="More">
            <MoreHorizontalIcon />
          </ChatEventHoverActionsButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onSelect={() => onToggleFavorite?.(message)}>
            {isFavorite ? (
              <StarOffIcon className="size-4" />
            ) : (
              <StarIcon className="size-4" />
            )}
            {isFavorite ? "Remove from favorites" : "Add to favorites"}
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => {
              navigator.clipboard?.writeText(message.body)
            }}
          >
            <CopyIcon className="size-4" />
            Copia
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </ChatEventHoverActions>
  )
}

function ThreadIndicator({
  thread,
  onClick,
}: {
  thread: NonNullable<Message["thread"]>
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group/thread mt-1 inline-flex w-fit items-center gap-2 rounded-md border border-transparent bg-muted/40 px-2 py-1 text-xs transition-colors hover:border-border hover:bg-muted"
    >
      <span className="flex -space-x-1">
        {thread.participants.slice(0, 3).map((p, idx) => (
          <Avatar
            key={`${p.initials}-${idx}`}
            className="size-5 rounded-full ring-2 ring-background"
          >
            <AvatarFallback className="rounded-full text-[9px]">
              {p.initials}
            </AvatarFallback>
          </Avatar>
        ))}
      </span>
      <span className="font-medium text-primary">
        {thread.count} {thread.count === 1 ? "reply" : "replies"}
      </span>
      <span className="text-muted-foreground">· last reply {thread.lastReply}</span>
      <MessageSquareIcon className="size-3 text-muted-foreground" />
      <ChevronRightIcon className="size-3 -ml-1 text-muted-foreground opacity-0 transition-opacity group-hover/thread:opacity-100" />
    </button>
  )
}

function fakeTimestamp(label: string): Date {
  const today = new Date()
  const parts = label.match(/^(\d{1,2}):(\d{2})$/)
  if (parts) {
    today.setHours(Number(parts[1]), Number(parts[2]), 0, 0)
    return today
  }
  return today
}
