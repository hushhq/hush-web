import {
  AtSignIcon,
  MessageSquareIcon,
  ReplyIcon,
  MessagesSquareIcon,
} from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

type InboxItem = {
  id: string
  kind: "mention" | "reply" | "thread" | "dm"
  serverName: string
  channelName: string
  author: string
  initials: string
  preview: string
  timestamp: string
  unread?: boolean
}

const ITEMS: InboxItem[] = [
  {
    id: "i1",
    kind: "mention",
    serverName: "Hush HQ",
    channelName: "general",
    author: "jamie",
    initials: "JM",
    preview: "@yarin can you take a look once it's up?",
    timestamp: "9:18",
    unread: true,
  },
  {
    id: "i2",
    kind: "reply",
    serverName: "Design Studio",
    channelName: "feedback",
    author: "marco",
    initials: "MR",
    preview: "+1 on the button radius change. Looks much cleaner.",
    timestamp: "8:52",
    unread: true,
  },
  {
    id: "i3",
    kind: "thread",
    serverName: "Hush HQ",
    channelName: "Daily standup",
    author: "alex",
    initials: "AL",
    preview: "thread → dropping spike notes here later",
    timestamp: "yesterday",
  },
  {
    id: "i4",
    kind: "dm",
    serverName: "Direct",
    channelName: "sasha",
    author: "sasha",
    initials: "SK",
    preview: "wanna pair on the rate-limit branch?",
    timestamp: "yesterday",
  },
]

export function HomeView() {
  return (
    <ScrollArea className="flex-1">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 p-6">
        <Section title="Mentions" items={ITEMS.filter((i) => i.kind === "mention")} />
        <Section title="Replies" items={ITEMS.filter((i) => i.kind === "reply")} />
        <Section title="Threads" items={ITEMS.filter((i) => i.kind === "thread")} />
        <Section title="Direct messages" items={ITEMS.filter((i) => i.kind === "dm")} />
      </div>
    </ScrollArea>
  )
}

function Section({ title, items }: { title: string; items: InboxItem[] }) {
  if (items.length === 0) return null
  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </h2>
      <ul className="flex flex-col divide-y rounded-lg border bg-card">
        {items.map((item) => (
          <InboxRow key={item.id} item={item} />
        ))}
      </ul>
    </section>
  )
}

function InboxRow({ item }: { item: InboxItem }) {
  const KindIcon =
    item.kind === "mention"
      ? AtSignIcon
      : item.kind === "reply"
        ? ReplyIcon
        : item.kind === "thread"
          ? MessagesSquareIcon
          : MessageSquareIcon

  return (
    <li
      className={cn(
        "flex cursor-pointer items-start gap-3 px-4 py-3 transition-colors hover:bg-muted/50",
        item.unread && "bg-primary/5"
      )}
    >
      <Avatar className="mt-0.5 size-8 rounded-md">
        <AvatarFallback className="rounded-md text-xs">
          {item.initials}
        </AvatarFallback>
      </Avatar>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <KindIcon className="size-3.5" />
          <span>{item.serverName}</span>
          <span>•</span>
          <span>#{item.channelName}</span>
          <span className="ml-auto">{item.timestamp}</span>
        </div>
        <p className="truncate text-sm">
          <span className="font-medium">{item.author}</span>{" "}
          <span className="text-foreground/80">{item.preview}</span>
        </p>
      </div>
      {item.unread ? (
        <span
          aria-hidden
          className="mt-2.5 size-1.5 shrink-0 rounded-full bg-primary"
        />
      ) : null}
    </li>
  )
}
