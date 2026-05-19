import * as React from "react"
import { useQuery } from "@tanstack/react-query"

import { getGuildChannels } from "@/lib/api"

interface RawChannel {
  id?: string
  type?: "category" | "system" | "text" | "voice" | string
}

interface UseGuildChannelIdsArgs {
  serverId: string | null
  token: string | null
  baseUrl: string
  currentUserId: string | null
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

export function guildChannelIdsQueryKey({
  serverId,
  baseUrl,
  currentUserId,
}: Pick<UseGuildChannelIdsArgs, "serverId" | "baseUrl" | "currentUserId">) {
  return [
    "servers",
    baseUrl || "local",
    serverId ?? "none",
    "text-channel-ids",
    currentUserId ?? "anonymous",
  ] as const
}

function extractTextChannelIds(data: unknown): string[] {
  const payload = data as RawChannel[] | { items?: RawChannel[] }
  const list = Array.isArray(payload) ? payload : payload.items ?? []
  return list
    .filter((channel) => channel.type === "text" && channel.id)
    .map((channel) => channel.id as string)
}

/**
 * Lightweight per-guild channel-id resolver. The full
 * `useChannelsForServer` hook fetches + maps + diffs ordering and
 * is overkill when all we need is the id list to drive
 * cross-server MLS subscriptions or self-removal MLS cleanup.
 *
 * Fetches once per `(serverId, currentUserId, token, baseUrl)` tuple via
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
  currentUserId,
}: UseGuildChannelIdsArgs): UseGuildChannelIdsResult {
  const isQueryEnabled = Boolean(serverId && token)
  const query = useQuery<string[], Error>({
    queryKey: guildChannelIdsQueryKey({ serverId, baseUrl, currentUserId }),
    enabled: isQueryEnabled,
    queryFn: async () => {
      if (!serverId || !token) return []
      return extractTextChannelIds(await getGuildChannels(token, serverId, baseUrl))
    },
    retry: BACKOFF_SCHEDULE_MS.length,
    retryDelay: (failureCount) =>
      BACKOFF_SCHEDULE_MS[failureCount] ??
      BACKOFF_SCHEDULE_MS[BACKOFF_SCHEDULE_MS.length - 1],
  })

  return {
    textChannelIds: isQueryEnabled ? query.data ?? [] : [],
    loaded: isQueryEnabled && query.isSuccess,
  }
}
