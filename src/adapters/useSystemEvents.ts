/**
 * Fetches the read-only system event streams for a guild — server-log
 * (getSystemMessages) and moderation (getAuditLog). Both endpoints return
 * normalised event objects; this hook unifies them for the system-channel
 * viewer.
 */
import * as React from "react"
// @ts-expect-error legacy JS
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

interface UseSystemEventsArgs {
  serverId: string | null
  token: string | null
  baseUrl: string
  source: SystemEventSource
  limit?: number
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

  return { events, loading, error, refetch }
}
