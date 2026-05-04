import * as React from "react"
import { ArrowDownToDotIcon, PinIcon, PinOffIcon } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area.tsx"
import type { SampleMessage } from "@/data/messages"

interface PinnedMessagesPopoverProps {
  channelName: string
  messages: SampleMessage[]
  onJump: (messageId: string) => void
}

export function PinnedMessagesPopover({
  channelName,
  messages,
  onJump,
}: PinnedMessagesPopoverProps) {
  const [open, setOpen] = React.useState(false)

  const handleJump = (id: string) => {
    setOpen(false)
    requestAnimationFrame(() => onJump(id))
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex size-6 items-center justify-center rounded-md transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Pinned messages"
        >
          <PinIcon className="size-4" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-[26rem] p-0"
      >
        <div className="border-b px-3 py-2">
          <div className="text-sm font-semibold">Pinned</div>
          <div className="text-xs text-muted-foreground">
            #{channelName} · {messages.length}
          </div>
        </div>
        {messages.length === 0 ? (
          <EmptyState />
        ) : (
          <ScrollArea className="max-h-80">
            <ul className="flex flex-col gap-1 p-2">
              {messages.map((message) => (
                <li key={message.id}>
                  <PinnedItem
                    message={message}
                    onJump={() => handleJump(message.id)}
                  />
                </li>
              ))}
            </ul>
          </ScrollArea>
        )}
      </PopoverContent>
    </Popover>
  )
}

function PinnedItem({
  message,
  onJump,
}: {
  message: SampleMessage
  onJump: () => void
}) {
  return (
    <div className="group/pin flex gap-2 rounded-md p-2 hover:bg-muted/60">
      <Avatar className="size-7 rounded-full">
        <AvatarFallback className="rounded-full text-[10px]">
          {message.initials}
        </AvatarFallback>
      </Avatar>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{message.author}</span>
          <span className="text-[10px] text-muted-foreground">
            {message.timestamp} · {message.date}
          </span>
          <button
            type="button"
            onClick={onJump}
            className="ml-auto flex h-6 shrink-0 items-center gap-1 rounded-md border bg-background px-2 text-xs font-medium opacity-0 shadow-sm transition-colors hover:bg-muted group-hover/pin:opacity-100"
            aria-label="Jump to message"
          >
            <ArrowDownToDotIcon className="size-3.5" />
            Jump
          </button>
        </div>
        <p className="line-clamp-2 text-xs text-muted-foreground">
          {message.body}
        </p>
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-2 px-4 py-8 text-center">
      <PinOffIcon className="size-5 text-muted-foreground" />
      <div className="text-sm font-medium">No pinned messages</div>
      <div className="text-xs text-muted-foreground">
        Pin a message via the message actions menu.
      </div>
    </div>
  )
}
