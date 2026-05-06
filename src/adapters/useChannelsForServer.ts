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

interface WsClientLike {
  on: (event: string, handler: (msg: unknown) => void) => void
  off?: (event: string, handler: (msg: unknown) => void) => void
  send?: (type: string, payload?: Record<string, unknown>) => void
  isConnected?: () => boolean
}

interface UseChannelsArgs {
  serverId: string | null
  token: string | null
  baseUrl: string
  wsClient?: WsClientLike | null
}

interface ChannelCreatedEvent {
  type: "channel_created"
  channel: RawChannel
}

interface ChannelDeletedEvent {
  type: "channel_deleted"
  channel_id: string
}

interface ChannelMovedEvent {
  type: "channel_moved"
  channel_id: string
  parent_id: string | null
  position: number
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
  /**
   * Apply an optimistic local insert from a mutation HTTP response.
   * Idempotent — when the matching `channel_created` WS event lands,
   * the WS handler dedupes by id. Use to keep the UI responsive even
   * when the WS broadcast is delayed or the connection is flapping.
   */
  applyCreated: (channel: RawChannel) => void
  /**
   * Apply an optimistic local delete after a successful DELETE call.
   * Idempotent — the matching `channel_deleted` WS event becomes a no-op
   * because the row is already gone. Recursive deletes (category +
   * descendants) accept multiple ids.
   */
  applyDeleted: (channelIds: string[]) => void
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
  wsClient,
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

  // Apply backend-broadcast channel mutations as local state diffs so the
  // mutation handlers (create/delete/move) do not need to trigger a full
  // HTTP refetch. Refetching toggles `loading`, which forces the
  // surrounding monolithic shell to re-render every chat / voice / sidebar
  // subtree and produces a visible UI freeze on every creative or
  // destructive action. The backend already broadcasts the authoritative
  // payload (`internal/api/channels.go`), so a localized setRaw on each
  // event is both cheaper and consistent with what other peers see.
  React.useEffect(() => {
    if (!wsClient || !serverId) return

    // Server-room subscription ownership lives in `useInstances`,
    // which subscribes every guild on WS open and after guild
    // refresh. The backend hub has no per-room refcount, so a
    // `subscribe.server` / `unsubscribe.server` from this adapter
    // would race with the instance-level owner: this adapter's
    // cleanup on server switch would unsubscribe a room the
    // instance hook still considers active, silently dropping all
    // background-server broadcasts. Sole-ownership keeps the
    // contract simple.

    const onCreated = (raw: unknown) => {
      const msg = raw as ChannelCreatedEvent
      if (msg?.type !== "channel_created" || !msg.channel?.id) return
      setRaw((prev) => {
        if (prev.some((c) => c.id === msg.channel.id)) return prev
        return [...prev, msg.channel]
      })
    }

    const onDeleted = (raw: unknown) => {
      const msg = raw as ChannelDeletedEvent
      if (msg?.type !== "channel_deleted" || !msg.channel_id) return
      setRaw((prev) => {
        if (!prev.some((c) => c.id === msg.channel_id)) return prev
        return prev.filter((c) => c.id !== msg.channel_id)
      })
    }

    const onMoved = (raw: unknown) => {
      const msg = raw as ChannelMovedEvent
      if (msg?.type !== "channel_moved" || !msg.channel_id) return
      setRaw((prev) => {
        const target = prev.find((c) => c.id === msg.channel_id)
        if (!target) return prev
        if (
          target.parentId === msg.parent_id &&
          target.position === msg.position
        ) {
          return prev
        }
        return prev.map((c) =>
          c.id === msg.channel_id
            ? { ...c, parentId: msg.parent_id, position: msg.position }
            : c
        )
      })
    }

    wsClient.on("channel_created", onCreated)
    wsClient.on("channel_deleted", onDeleted)
    wsClient.on("channel_moved", onMoved)
    return () => {
      wsClient.off?.("channel_created", onCreated)
      wsClient.off?.("channel_deleted", onDeleted)
      wsClient.off?.("channel_moved", onMoved)
    }
  }, [wsClient, serverId])

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

  const applyCreated = React.useCallback((channel: RawChannel) => {
    if (!channel?.id) return
    setRaw((prev) =>
      prev.some((c) => c.id === channel.id) ? prev : [...prev, channel]
    )
  }, [])

  const applyDeleted = React.useCallback((channelIds: string[]) => {
    if (!Array.isArray(channelIds) || channelIds.length === 0) return
    const ids = new Set(channelIds)
    setRaw((prev) => {
      if (!prev.some((c) => ids.has(c.id))) return prev
      return prev.filter((c) => !ids.has(c.id))
    })
  }, [])

  return {
    categories,
    channels,
    systemChannels,
    loading,
    error,
    refetch,
    onCategoriesChange,
    onChannelsChange,
    applyCreated,
    applyDeleted,
  }
}
