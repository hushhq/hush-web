import * as React from "react"
import { XIcon } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button.tsx"
import { ScrollArea } from "@/components/ui/scroll-area.tsx"
import { Separator } from "@/components/ui/separator.tsx"
import { MessageComposer } from "@/components/message-composer"
import { MessageContent } from "@/components/message-content"

interface ThreadParent {
  author: string
  initials: string
  timestamp: string
  body: string
}

interface ThreadReply extends ThreadParent {
  id: string
}

interface ThreadPanelProps {
  channelName: string
  parent: ThreadParent
  onClose: () => void
}

const SAMPLE_REPLIES: ThreadReply[] = [
  {
    id: "r1",
    author: "yarin",
    initials: "YC",
    timestamp: "9:23",
    body: "leaving notes here so we don't pollute the main channel — flows looked clean overall",
  },
  {
    id: "r2",
    author: "alex",
    initials: "AL",
    timestamp: "9:25",
    body: "thx — will incorporate in the followup PR",
  },
]

export function ThreadPanel({
  channelName,
  parent,
  onClose,
}: ThreadPanelProps) {
  const [replies, setReplies] = React.useState<ThreadReply[]>(SAMPLE_REPLIES)

  function handleSend(text: string) {
    const now = new Date()
    const hh = now.getHours().toString().padStart(2, "0")
    const mm = now.getMinutes().toString().padStart(2, "0")
    setReplies((prev) => [
      ...prev,
      {
        id: `local-${now.getTime()}`,
        author: "yarin",
        initials: "YC",
        timestamp: `${hh}:${mm}`,
        body: text,
      },
    ])
  }

  return (
    <div className="flex h-full min-w-0 flex-col border-l bg-background">
      <header className="flex h-14 shrink-0 items-center justify-between gap-2 border-b px-4">
        <div className="flex flex-col">
          <span className="text-sm font-semibold">Thread</span>
          <span className="text-xs text-muted-foreground">
            #{channelName}
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="size-8"
          onClick={onClose}
          aria-label="Close thread"
        >
          <XIcon />
        </Button>
      </header>
      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-3 p-4">
          <ThreadMessage message={parent} pinned />
          <Separator />
          <ul className="flex flex-col gap-2">
            {replies.map((reply) => (
              <li key={reply.id}>
                <ThreadMessage message={reply} />
              </li>
            ))}
          </ul>
        </div>
      </ScrollArea>
      <MessageComposer
        channelName={channelName}
        placeholder={`Reply in thread`}
        onSend={handleSend}
      />
    </div>
  )
}

function ThreadMessage({
  message,
  pinned,
}: {
  message: ThreadParent
  pinned?: boolean
}) {
  return (
    <div className="flex items-start gap-2.5">
      <Avatar className="size-7 rounded-md">
        <AvatarFallback className="rounded-md text-[10px]">
          {message.initials}
        </AvatarFallback>
      </Avatar>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <div className="flex items-baseline gap-2">
          <span className="text-xs font-medium">{message.author}</span>
          <span className="text-[10px] text-muted-foreground">
            {message.timestamp}
          </span>
          {pinned ? (
            <span className="rounded-md bg-muted px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wide text-muted-foreground">
              parent
            </span>
          ) : null}
        </div>
        <MessageContent body={message.body} />
      </div>
    </div>
  )
}
