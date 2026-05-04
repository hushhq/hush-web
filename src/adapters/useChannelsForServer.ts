/**
 * Fetches a guild's channels + categories via the instance HTTP API and maps
 * them to the prototype's `Channel` / `ChannelCategory` shape.
 *
 * Backend channel model:
 *   { id, name, type: 'category'|'text'|'voice', parentId: string|null, position: number }
 *
 * - `type === 'category'` → returned as `ChannelCategory` row
 * - other types → returned as `Channel` with `categoryId = parentId`
 *
 * `onChannelsChange` and `onCategoriesChange` diff against current state and
 * emit `moveChannel(id, { parentId, position })` for each delta. Optimistic
 * local update; rollback on error.
 */
import * as React from "react"
// @ts-expect-error legacy JS
import { getGuildChannels, moveChannel } from "@/lib/api"

import type { Channel, ChannelCategory, ChannelKind } from "./types"

interface RawChannel {
  id: string
  name: string
  type: "category" | "text" | "voice"
  parentId: string | null
  position: number
  unreadCount?: number
  mentionCount?: number
}

interface UseChannelsArgs {
  serverId: string | null
  token: string | null
  baseUrl: string
}

interface UseChannelsResult {
  categories: ChannelCategory[]
  channels: Channel[]
  loading: boolean
  error: Error | null
  refetch: () => Promise<void>
  onCategoriesChange: (next: ChannelCategory[]) => void
  onChannelsChange: (next: Channel[]) => void
}

const CATEGORY = "category"

export function useChannelsForServer({
  serverId,
  token,
  baseUrl,
}: UseChannelsArgs): UseChannelsResult {
  const [raw, setRaw] = React.useState<RawChannel[]>([])
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<Error | null>(null)

  const refetch = React.useCallback(async () => {
    if (!serverId || !token) {
      setRaw([])
      return
    }
    setLoading(true)
    setError(null)
    try {
      const data = (await getGuildChannels(token, serverId, baseUrl)) as RawChannel[]
      setRaw(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)))
      setRaw([])
    } finally {
      setLoading(false)
    }
  }, [serverId, token, baseUrl])

  React.useEffect(() => {
    void refetch()
  }, [refetch])

  const categories = React.useMemo<ChannelCategory[]>(
    () =>
      raw
        .filter((c) => c.type === CATEGORY)
        .sort((a, b) => a.position - b.position)
        .map((c) => ({ id: c.id, name: c.name })),
    [raw]
  )

  const channels = React.useMemo<Channel[]>(
    () =>
      raw
        .filter((c) => c.type !== CATEGORY)
        .sort((a, b) => a.position - b.position)
        .map((c) => ({
          id: c.id,
          name: c.name,
          kind: c.type as ChannelKind,
          categoryId: c.parentId,
          unreadCount: c.unreadCount,
          mentionCount: c.mentionCount,
        })),
    [raw]
  )

  const onCategoriesChange = React.useCallback(
    (next: ChannelCategory[]) => {
      if (!serverId || !token) return
      // Optimistic local reorder
      setRaw((prev) => {
        const byId = new Map(prev.map((c) => [c.id, c]))
        const reordered = next
          .map((cat, i) => {
            const existing = byId.get(cat.id)
            return existing ? { ...existing, position: i } : null
          })
          .filter((x): x is RawChannel => x !== null)
        const others = prev.filter((c) => c.type !== CATEGORY)
        return [...reordered, ...others]
      })
      // Backend emit — sequential to avoid position races
      void (async () => {
        for (let i = 0; i < next.length; i++) {
          const cat = next[i]
          try {
            await moveChannel(token, serverId, cat.id, { position: i }, baseUrl)
          } catch (err) {
            console.warn("moveChannel(category) failed", err)
            void refetch()
            return
          }
        }
      })()
    },
    [serverId, token, baseUrl, refetch]
  )

  const onChannelsChange = React.useCallback(
    (next: Channel[]) => {
      if (!serverId || !token) return
      // Optimistic local reorder
      setRaw((prev) => {
        const byId = new Map(prev.map((c) => [c.id, c]))
        const reordered = next
          .map((ch, i) => {
            const existing = byId.get(ch.id)
            return existing
              ? { ...existing, parentId: ch.categoryId, position: i }
              : null
          })
          .filter((x): x is RawChannel => x !== null)
        const cats = prev.filter((c) => c.type === CATEGORY)
        return [...cats, ...reordered]
      })
      void (async () => {
        for (let i = 0; i < next.length; i++) {
          const ch = next[i]
          try {
            await moveChannel(
              token,
              serverId,
              ch.id,
              { parentId: ch.categoryId, position: i },
              baseUrl
            )
          } catch (err) {
            console.warn("moveChannel failed", err)
            void refetch()
            return
          }
        }
      })()
    },
    [serverId, token, baseUrl, refetch]
  )

  return {
    categories,
    channels,
    loading,
    error,
    refetch,
    onCategoriesChange,
    onChannelsChange,
  }
}
