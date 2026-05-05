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
import { getGuildChannels, moveChannel } from "@/lib/api"

import type {
  AdapterSystemChannel,
  Channel,
  ChannelCategory,
  ChannelKind,
  SystemChannelType,
} from "./types"

interface RawChannel {
  id: string
  name?: string
  encryptedMetadata?: string | null
  type: "category" | "system" | ChannelKind
  parentId: string | null
  position: number
  unreadCount?: number
  mentionCount?: number
  systemChannelType?: string | null
}

interface UseChannelsArgs {
  serverId: string | null
  token: string | null
  baseUrl: string
}

interface UseChannelsResult {
  categories: ChannelCategory[]
  channels: Channel[]
  systemChannels: AdapterSystemChannel[]
  loading: boolean
  error: Error | null
  refetch: () => Promise<void>
  onCategoriesChange: (next: ChannelCategory[]) => void
  onChannelsChange: (next: Channel[]) => void
}

const CATEGORY = "category"
const SYSTEM = "system"

function parseMetadataName(json: string): string | null {
  try {
    const parsed = JSON.parse(json) as { n?: unknown; name?: unknown }
    const name = typeof parsed.n === "string" ? parsed.n : parsed.name
    return typeof name === "string" && name.trim() ? name : null
  } catch {
    return null
  }
}

function decodeMetadataName(metadata?: string | null): string | null {
  if (!metadata) return null
  const directName = parseMetadataName(metadata)
  if (directName) return directName

  try {
    const bytes = Uint8Array.from(atob(metadata), (c) => c.charCodeAt(0))
    return parseMetadataName(new TextDecoder().decode(bytes))
  } catch {
    return null
  }
}

function channelDisplayName(channel: RawChannel): string {
  return channel.name?.trim() || decodeMetadataName(channel.encryptedMetadata) || ""
}

function isRawMessageChannel(
  channel: RawChannel
): channel is RawChannel & { type: ChannelKind } {
  return channel.type === "text" || channel.type === "voice"
}

/**
 * Resolve a system channel's discriminator. Backends that ship the
 * `systemChannelType` field win; otherwise we fall back to a name match
 * so legacy payloads still route correctly.
 */
function deriveSystemChannelType(channel: RawChannel): SystemChannelType {
  const explicit = channel.systemChannelType?.toLowerCase().trim()
  if (explicit === "moderation") return "moderation"
  if (explicit === "server-log" || explicit === "audit") return "server-log"
  const name = (channel.name ?? "").toLowerCase()
  if (name.includes("mod")) return "moderation"
  return "server-log"
}

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
        .map((c) => ({ id: c.id, name: channelDisplayName(c) })),
    [raw]
  )

  const channels = React.useMemo<Channel[]>(
    () =>
      raw
        .filter(isRawMessageChannel)
        .sort((a, b) => a.position - b.position)
        .map((c) => ({
          id: c.id,
          name: channelDisplayName(c),
          kind: c.type,
          categoryId: c.parentId,
          unreadCount: c.unreadCount,
          mentionCount: c.mentionCount,
        })),
    [raw]
  )

  const systemChannels = React.useMemo<AdapterSystemChannel[]>(
    () =>
      raw
        .filter((c) => c.type === SYSTEM)
        .sort((a, b) => a.position - b.position)
        .map((c) => {
          const kind = deriveSystemChannelType(c)
          // Fallback display name when the backend ships no explicit
          // channel name. server-log → "System log" (the user-facing
          // canonical label across the chat surfaces), moderation →
          // "Moderation".
          const fallback = kind === "moderation" ? "Moderation" : "System log"
          return {
            id: c.id,
            name: channelDisplayName(c) || fallback,
            systemChannelType: kind,
          }
        }),
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
        // System channels (server-log, moderation) are server-managed,
        // not draggable, and not in `next` — preserve them across the
        // optimistic rebuild or the System section disappears until
        // the next refetch lands.
        const systems = prev.filter((c) => c.type === SYSTEM)
        return [...cats, ...systems, ...reordered]
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
    systemChannels,
    loading,
    error,
    refetch,
    onCategoriesChange,
    onChannelsChange,
  }
}
