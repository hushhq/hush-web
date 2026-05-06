import * as React from "react"

import { getGuildChannels } from "@/lib/api"

interface RawChannel {
  id?: string
  type?: "category" | "system" | "text" | "voice" | string
}

interface UseGuildChannelIdsArgs {
  serverId: string | null
  token: string | null
  baseUrl: string
}

interface UseGuildChannelIdsResult {
  textChannelIds: string[]
  loaded: boolean
}

// Exponential backoff: 1s, 2s, 4s, 8s, 16s, 30s cap. Each attempt
// runs only once, scheduled via setTimeout so a fast-resolving
// success on the first try costs nothing extra. Stops after the
// cap so we don't reschedule indefinitely on a backend outage —
// the next remount or input change re-arms the cycle.
const BACKOFF_SCHEDULE_MS = [1_000, 2_000, 4_000, 8_000, 16_000, 30_000]

/**
 * Lightweight per-guild channel-id resolver. The full
 * `useChannelsForServer` hook fetches + maps + diffs ordering and
 * is overkill when all we need is the id list to drive
 * cross-server MLS subscriptions or self-removal MLS cleanup.
 *
 * Fetches once per `(serverId, token, baseUrl)` triplet via
 * `api.getGuildChannels`. A transient fetch failure (network
 * blip, 5xx) is retried with exponential backoff so a background
 * guild's MLS room subscriptions are not silently absent for the
 * rest of the session. Once `BACKOFF_SCHEDULE_MS` is exhausted,
 * the hook stops retrying — a future remount or
 * (serverId / token / baseUrl) change re-arms the cycle.
 */
export function useGuildChannelIds({
  serverId,
  token,
  baseUrl,
}: UseGuildChannelIdsArgs): UseGuildChannelIdsResult {
  const [textChannelIds, setTextChannelIds] = React.useState<string[]>([])
  const [loaded, setLoaded] = React.useState(false)

  React.useEffect(() => {
    if (!serverId || !token) {
      setTextChannelIds([])
      setLoaded(false)
      return
    }
    let cancelled = false
    let attempt = 0
    let timer: ReturnType<typeof setTimeout> | null = null
    setLoaded(false)

    const run = async () => {
      try {
        const data = (await getGuildChannels(token, serverId, baseUrl)) as
          | RawChannel[]
          | { items?: RawChannel[] }
        const list: RawChannel[] = Array.isArray(data) ? data : data.items ?? []
        if (cancelled) return
        const ids = list
          .filter((c) => c.type === "text" && c.id)
          .map((c) => c.id as string)
        setTextChannelIds(ids)
        setLoaded(true)
      } catch (err) {
        if (cancelled) return
        console.warn("[useGuildChannelIds] fetch failed", {
          serverId,
          attempt,
          err: err instanceof Error ? err.message : err,
        })
        setTextChannelIds([])
        setLoaded(false)
        if (attempt >= BACKOFF_SCHEDULE_MS.length) return
        const delay = BACKOFF_SCHEDULE_MS[attempt]
        attempt += 1
        timer = setTimeout(() => {
          if (cancelled) return
          void run()
        }, delay)
      }
    }

    void run()
    return () => {
      cancelled = true
      if (timer) clearTimeout(timer)
    }
  }, [serverId, token, baseUrl])

  return { textChannelIds, loaded }
}
