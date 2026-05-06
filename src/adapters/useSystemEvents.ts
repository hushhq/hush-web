/**
 * Fetches the read-only system event streams for a guild — server-log
 * (getSystemMessages) and moderation (getAuditLog). Both endpoints return
 * normalised event objects; this hook unifies them for the system-channel
 * viewer.
 */
import * as React from "react"
import { getAuditLog, getSystemMessages } from "@/lib/api"

export type SystemEventSource = "server-log" | "moderation"

export interface SystemEvent {
  id: string
  eventType: string
  actorId: string
  targetId?: string
  reason?: string
  metadata?: Record<string, unknown>
  createdAt: string
}

interface WsClientLike {
  on: (event: string, handler: (msg: unknown) => void) => void
  off?: (event: string, handler: (msg: unknown) => void) => void
}

interface SystemMessageFrame {
  type?: string
  server_id?: string
  system_message?: SystemEvent
}

interface UseSystemEventsArgs {
  serverId: string | null
  token: string | null
  baseUrl: string
  source: SystemEventSource
  limit?: number
  /** Optional WS client. When provided AND the source is
   *  `server-log`, the hook subscribes to `system_message` and
   *  appends new events as they arrive. The moderation source is
   *  served by the audit-log REST endpoint, which has no live
   *  broadcast; live `system_message` frames are NOT appended to
   *  the moderation viewer. */
  wsClient?: WsClientLike | null
}

interface UseSystemEventsResult {
  events: SystemEvent[]
  loading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

export function useSystemEvents({
  serverId,
  token,
  baseUrl,
  source,
  limit = 100,
  wsClient,
}: UseSystemEventsArgs): UseSystemEventsResult {
  const [events, setEvents] = React.useState<SystemEvent[]>([])
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<Error | null>(null)

  const refetch = React.useCallback(async () => {
    if (!serverId || !token) {
      setEvents([])
      return
    }
    setLoading(true)
    setError(null)
    try {
      const fetcher = source === "moderation" ? getAuditLog : getSystemMessages
      const data = (await fetcher(token, serverId, { limit }, baseUrl)) as
        | SystemEvent[]
        | { items?: SystemEvent[] }
      const list = Array.isArray(data) ? data : (data.items ?? [])
      setEvents(list)
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)))
      setEvents([])
    } finally {
      setLoading(false)
    }
  }, [serverId, token, baseUrl, source, limit])

  React.useEffect(() => {
    void refetch()
  }, [refetch])

  React.useEffect(() => {
    if (!wsClient || !serverId) return
    // The `system_message` broadcast feeds the server-log view,
    // not the moderation audit log. Subscribing it for the
    // moderation source would inject server-log rows into a
    // viewer that REST-fetches a different stream entirely.
    if (source !== "server-log") return
    const handler = (raw: unknown) => {
      const data = raw as SystemMessageFrame
      if (data?.type !== "system_message") return
      if (!data.system_message) return
      if (data.server_id && data.server_id !== serverId) return
      setEvents((prev) => {
        // Dedup against the REST snapshot — the same event may
        // arrive twice if the catch-up fetch races the live frame.
        const incoming = data.system_message as SystemEvent
        if (prev.some((e) => e.id === incoming.id)) return prev
        return [...prev, incoming]
      })
    }
    wsClient.on("system_message", handler)
    return () => {
      wsClient.off?.("system_message", handler)
    }
  }, [wsClient, serverId, source])

  return { events, loading, error, refetch }
}
