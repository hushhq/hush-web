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

/**
 * Lightweight per-guild channel-id resolver. The full
 * `useChannelsForServer` hook fetches + maps + diffs ordering and
 * is overkill when all we need is the id list to drive
 * cross-server MLS subscriptions or self-removal MLS cleanup.
 *
 * Fetches once per `(serverId, token, baseUrl)` triplet via
 * `api.getGuildChannels`. Errors are swallowed (with a warn log)
 * because a transient fetch failure for a background guild should
 * not block the rest of the realtime fanout.
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
    setLoaded(false)
    ;(async () => {
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
          err: err instanceof Error ? err.message : err,
        })
        setTextChannelIds([])
        setLoaded(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [serverId, token, baseUrl])

  return { textChannelIds, loaded }
}
