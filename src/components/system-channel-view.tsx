/**
 * Read-only viewer for the server-log and moderation system channels.
 * Renders a chronological list of system events fetched from the
 * server-side audit feed. No composer, no replies — these channels are
 * generated server-side and immutable from the client.
 */
import * as React from "react"
import { ScrollTextIcon, ShieldAlertIcon } from "lucide-react"

import { ScrollArea } from "@/components/ui/scroll-area.tsx"
import { Skeleton } from "@/components/ui/skeleton"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  useSystemEvents,
  type SystemEvent,
  type SystemEventSource,
} from "@/adapters/useSystemEvents"

interface SystemChannelViewProps {
  serverId: string
  source: SystemEventSource
  token: string | null
  baseUrl: string
}

const HEADERS: Record<SystemEventSource, { title: string; icon: React.ReactNode; topic: string }> = {
  "server-log": {
    title: "System log",
    icon: <ScrollTextIcon className="size-5 text-muted-foreground" />,
    topic: "Automatic record of server-wide events",
  },
  moderation: {
    title: "Moderation",
    icon: <ShieldAlertIcon className="size-5 text-muted-foreground" />,
    topic: "Audit log of moderator actions",
  },
}

export function SystemChannelView({
  serverId,
  source,
  token,
  baseUrl,
}: SystemChannelViewProps) {
  const { events, loading, error } = useSystemEvents({
    serverId,
    token,
    baseUrl,
    source,
  })
  const header = HEADERS[source]

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col">
      <div className="flex h-14 shrink-0 items-center gap-3 border-b px-4">
        {/* Channel-list sidebar trigger; visible only at viewport
            widths where the sidebar is collapsed off-canvas. Without
            this the user has no way back to the channel list from a
            system channel on a narrow window. */}
        <SidebarTrigger className="md:hidden" />
        {header.icon}
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-semibold">{header.title}</span>
          <span className="text-xs text-muted-foreground">{header.topic}</span>
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-2 p-4">
          {loading && events.length === 0 ? <SystemSkeleton /> : null}
          {error ? (
            <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
              Failed to load events: {error.message}
            </div>
          ) : null}
          {!loading && !error && events.length === 0 ? (
            <div className="rounded-md border bg-muted/30 p-6 text-center text-sm text-muted-foreground">
              No events yet.
            </div>
          ) : null}
          {events.map((event) => (
            <SystemEventRow key={event.id} event={event} />
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

function SystemSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  )
}

function SystemEventRow({ event }: { event: SystemEvent }) {
  const ts = formatTimestamp(event.createdAt)
  return (
    <div className="flex flex-col gap-1 rounded-md border bg-card px-3 py-2">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-sm font-medium">{humanizeEventType(event.eventType)}</span>
        <span className="text-xs text-muted-foreground tabular-nums">{ts}</span>
      </div>
      <div className="text-xs text-muted-foreground">
        Actor: <span className="font-mono">{shortId(event.actorId)}</span>
        {event.targetId ? (
          <>
            {" · Target: "}
            <span className="font-mono">{shortId(event.targetId)}</span>
          </>
        ) : null}
      </div>
      {event.reason ? (
        <div className="text-xs text-foreground/80">Reason: {event.reason}</div>
      ) : null}
    </div>
  )
}

function humanizeEventType(t: string): string {
  return t.replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
}

function shortId(id: string): string {
  if (id.length <= 8) return id
  return `${id.slice(0, 4)}…${id.slice(-4)}`
}

function formatTimestamp(iso: string): string {
  try {
    const d = new Date(iso)
    return d.toLocaleString(undefined, {
      year: "2-digit",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  } catch {
    return iso
  }
}
