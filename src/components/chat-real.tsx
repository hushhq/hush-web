/**
 * Real-data chat surface for an active text channel.
 *
 * Replaces the legacy `Chat.jsx` mount: the data plane lives in
 * `useChannelMessages` (MLS subscribe + history paging + send/retry +
 * reconnect catch-up) and the rendering reuses the prototype's
 * `chat/*` primitives + `MessageContent` (Streamdown markdown) +
 * `MessageComposer` (Novel editor with /slash commands and attachment
 * dock).
 *
 * Plaintext on the wire is now a v1 envelope: send wraps the
 * composer's markdown output as `{ v: 1, text: <markdown> }`, and
 * receive renders `envelope.text` through the same markdown pipeline
 * the prototype showed against mock data. Decryption failures (and v1
 * parse failures on the wire) render the recovery placeholder.
 */
import * as React from "react"
import { Loader2Icon } from "lucide-react"

import {
  Chat,
  ChatEvent,
  ChatEventAddon,
  ChatEventAvatar,
  ChatEventBody,
  ChatEventContent,
  ChatEventTime,
  ChatEventTitle,
  ChatMessages,
} from "@/components/chat/index"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
} from "@/components/ui/empty"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { MessageContent } from "@/components/message-content"
import { MessageComposer } from "@/components/message-composer"
import { cn } from "@/lib/utils"
import { useChannelMessages, type ChatMessage } from "@/hooks/useChannelMessages"
import type { MessageEnvelopeV1 } from "@/lib/messageEnvelope"

const RECOVERY_PLACEHOLDER =
  "Message encrypted - decryption key no longer available"

interface ServerMember {
  id: string
  userId?: string
  displayName?: string
}

interface RealChatProps {
  channelId: string
  channelName: string
  serverId: string
  currentUserId: string
  getToken: () => string | null
  getStore: () => Promise<unknown> | unknown
  getHistoryStore?: () => Promise<unknown> | unknown
  wsClient: unknown
  members?: ServerMember[]
  baseUrl?: string
  markReadEnabled?: boolean
  onMarkRead?: ((channelId: string) => void) | null
  onNewMessage?: () => void
}

export function RealChat({
  channelId,
  channelName,
  serverId,
  currentUserId,
  getToken,
  getStore,
  getHistoryStore,
  wsClient,
  members = [],
  baseUrl = "",
  markReadEnabled = false,
  onMarkRead = null,
  onNewMessage,
}: RealChatProps) {
  const displayNameMap = React.useMemo(() => {
    const map = new Map<string, string>()
    for (const m of members) {
      const uid = m.userId ?? m.id
      if (uid && m.displayName) map.set(uid, m.displayName)
    }
    return map
  }, [members])

  const {
    messages,
    isInitialLoading,
    isChannelTransitioning,
    hasMoreOlder,
    loadMoreLoading,
    loadOlder,
    send,
    retry,
    consumeScrollRestore,
    recordScrollState,
  } = useChannelMessages({
    channelId,
    serverId,
    currentUserId,
    getToken,
    getStore,
    getHistoryStore,
    wsClient: wsClient as Parameters<typeof useChannelMessages>[0]["wsClient"],
    baseUrl,
    markRead: { enabled: markReadEnabled, onMarkRead },
    onNewMessage,
  })

  const scrollRef = React.useRef<HTMLDivElement | null>(null)

  const handleScroll = React.useCallback(() => {
    const el = scrollRef.current
    if (!el || loadMoreLoading || !hasMoreOlder) return
    // ChatMessages is flex-col-reverse, so the visual top corresponds
    // to scrollTop close to the negative of (scrollHeight - clientHeight).
    const distanceFromTop =
      el.scrollHeight - el.clientHeight - Math.abs(el.scrollTop)
    if (distanceFromTop < 80) {
      recordScrollState(el)
      void loadOlder()
    }
  }, [loadOlder, loadMoreLoading, hasMoreOlder, recordScrollState])

  React.useLayoutEffect(() => {
    const restore = consumeScrollRestore()
    const el = scrollRef.current
    if (!restore || !el) return
    if (restore.oldScrollHeight > 0) {
      el.scrollTop =
        el.scrollHeight - restore.oldScrollHeight + restore.oldScrollTop
    }
  }, [messages, consumeScrollRestore])

  const handleSend = React.useCallback(
    async (markdown: string) => {
      const envelope: MessageEnvelopeV1 = { v: 1, text: markdown }
      try {
        await send(envelope)
      } catch (err) {
        // useChannelMessages already marked the optimistic row failed.
        console.error("[chat-real] send failed", err)
      }
    },
    [send]
  )

  const groups = React.useMemo(() => groupConsecutive(messages), [messages])

  return (
    <Chat className="h-full">
      <ChatMessages
        ref={scrollRef as unknown as React.Ref<HTMLDivElement>}
        onScroll={handleScroll}
        aria-busy={isChannelTransitioning || isInitialLoading}
      >
        {isChannelTransitioning || isInitialLoading ? (
          <div className="flex flex-1 items-center justify-center py-10">
            <Loader2Icon className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : messages.length === 0 ? (
          <Empty className="flex-1">
            <EmptyHeader>
              <EmptyMedia className="text-muted-foreground" aria-hidden="true">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  focusable="false"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </EmptyMedia>
              <EmptyDescription>
                no messages yet, start the conversation
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <>
            {groups
              .slice()
              .reverse()
              .map((group, revIdx, reversed) => {
                const showDateSep =
                  revIdx === reversed.length - 1 ||
                  reversed[revIdx + 1].dateKey !== group.dateKey
                return (
                  <React.Fragment key={group.head.id}>
                    {group.followups
                      .slice()
                      .reverse()
                      .map((m) => (
                        <FollowupMessage
                          key={m.id}
                          message={m}
                          onRetry={retry}
                        />
                      ))}
                    <PrimaryMessage
                      message={group.head}
                      currentUserId={currentUserId}
                      displayNameMap={displayNameMap}
                      onRetry={retry}
                    />
                    {showDateSep ? (
                      <DateSeparator label={formatDateLabel(group.head.timestamp)} />
                    ) : null}
                  </React.Fragment>
                )
              })}
            {hasMoreOlder ? (
              <div className="flex items-center justify-center py-2 text-xs text-muted-foreground">
                {loadMoreLoading ? (
                  <Loader2Icon className="size-4 animate-spin" />
                ) : (
                  "Scroll up for older messages"
                )}
              </div>
            ) : null}
          </>
        )}
      </ChatMessages>
      <MessageComposer
        key={channelId}
        channelName={channelName}
        onSend={handleSend}
      />
    </Chat>
  )
}

interface MessageGroup {
  dateKey: string
  head: ChatMessage
  followups: ChatMessage[]
}

const FIVE_MIN_MS = 5 * 60 * 1000

function groupConsecutive(messages: ChatMessage[]): MessageGroup[] {
  const groups: MessageGroup[] = []
  for (const m of messages) {
    const last = groups.at(-1)
    const sameDay =
      last && toDateKey(last.head.timestamp) === toDateKey(m.timestamp)
    const sameSender = last && last.head.sender === m.sender
    const inWindow =
      last && Math.abs(m.timestamp - last.head.timestamp) < FIVE_MIN_MS
    const noPending = last && !last.head.pending && !m.pending
    if (last && sameDay && sameSender && inWindow && noPending) {
      last.followups.push(m)
    } else {
      groups.push({ dateKey: toDateKey(m.timestamp), head: m, followups: [] })
    }
  }
  return groups
}

function toDateKey(ts: number): string {
  const d = new Date(ts)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

function formatDateLabel(ts: number): string {
  const d = new Date(ts)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)
  if (toDateKey(ts) === toDateKey(today.getTime())) return "Today"
  if (toDateKey(ts) === toDateKey(yesterday.getTime())) return "Yesterday"
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function truncateUserId(userId: string): string {
  if (!userId) return "User"
  return `${userId.slice(0, 8)}…`
}

function deriveInitials(name: string): string {
  return name
    .split(" ")
    .map((p) => p.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

function PrimaryMessage({
  message,
  currentUserId,
  displayNameMap,
  onRetry,
}: {
  message: ChatMessage
  currentUserId: string
  displayNameMap: Map<string, string>
  onRetry: (id: string) => Promise<void>
}) {
  const isOwn = message.sender === currentUserId
  const displayName = isOwn
    ? "You"
    : displayNameMap.get(message.sender) ?? truncateUserId(message.sender)
  return (
    <ChatEvent
      data-message-id={message.id}
      className={cn(
        "group/event relative rounded-md py-1 transition-colors hover:bg-muted/60",
        message.pending && "opacity-60",
        message.failed && "border border-destructive/40"
      )}
    >
      <ChatEventAddon>
        <ChatEventAvatar
          fallback={deriveInitials(displayName)}
          fallbackProps={{ className: "text-xs" }}
        />
      </ChatEventAddon>
      <ChatEventBody>
        <ChatEventTitle>
          <span className="text-sm font-medium">{displayName}</span>
          <ChatEventTime
            timestamp={new Date(message.timestamp)}
            format="time"
            className="text-xs text-muted-foreground"
          />
          {message.pending ? (
            <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
              sending…
            </span>
          ) : null}
          {message.failed ? (
            <span className="text-[10px] uppercase tracking-wide text-destructive">
              failed
            </span>
          ) : null}
        </ChatEventTitle>
        <ChatEventContent>
          <MessageBody message={message} />
          {message.failed ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="mt-1 h-7 text-xs"
              onClick={() => void onRetry(message.id)}
            >
              Retry
            </Button>
          ) : null}
        </ChatEventContent>
      </ChatEventBody>
    </ChatEvent>
  )
}

function FollowupMessage({
  message,
  onRetry,
}: {
  message: ChatMessage
  onRetry: (id: string) => Promise<void>
}) {
  return (
    <ChatEvent
      data-message-id={message.id}
      className={cn(
        "group/event relative rounded-md py-0.5 transition-colors hover:bg-muted/60",
        message.pending && "opacity-60",
        message.failed && "border border-destructive/40"
      )}
    >
      <ChatEventAddon>
        <ChatEventTime
          timestamp={new Date(message.timestamp)}
          format="time"
          className="opacity-0 text-[10px] text-muted-foreground group-hover/event:opacity-100 transition-opacity"
        />
      </ChatEventAddon>
      <ChatEventBody>
        <ChatEventContent>
          <MessageBody message={message} />
          {message.failed ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="mt-1 h-7 text-xs"
              onClick={() => void onRetry(message.id)}
            >
              Retry
            </Button>
          ) : null}
        </ChatEventContent>
      </ChatEventBody>
    </ChatEvent>
  )
}

function MessageBody({ message }: { message: ChatMessage }) {
  if (message.decryptionFailed || !message.envelope) {
    return (
      <span className="text-sm italic text-muted-foreground">
        {RECOVERY_PLACEHOLDER}
      </span>
    )
  }
  const { envelope } = message
  const hasText = envelope.text.length > 0
  return (
    <>
      {hasText ? <MessageContent body={envelope.text} /> : null}
      {/* attachments + gif rendering lands in Phase D / E */}
    </>
  )
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
