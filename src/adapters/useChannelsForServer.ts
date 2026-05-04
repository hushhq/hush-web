import * as React from "react"

import { getGuildChannels, moveChannel } from "@/lib/api.js"
import type { Channel, ChannelCategory, ChannelKind } from "./types"

interface RawChannel {
  id: string
  name: string
  type: "text" | "voice" | "category" | "system"
  parentId: string | null
  position: number
  unreadCount?: number
  _displayName?: string
}

interface ChannelsForServerResult {
  categories: ChannelCategory[]
  channels: Channel[]
  onCategoriesChange: (next: ChannelCategory[]) => void
  onChannelsChange: (next: Channel[]) => void
  /**
   * False when the user lacks permission or the WebSocket isn't connected.
   * Ported `<ChannelSidebar />` uses this to gate drag-reorder.
   */
  canReorder: boolean
  /** True until the initial server fetch resolves. */
  isLoading: boolean
}

interface ChannelsForServerProps {
  serverId: string | null
  /** Per-instance JWT for the active guild's instance. */
  token: string | null
  /** Base URL of the active instance (passes through to api.js for federation). */
  baseUrl?: string
  /** Permission level of current user on this server. canReorder = >= 2 (admin). */
  myPermissionLevel?: number | null
}

/**
 * Bridges hush-web's `getGuildChannels()` API to the prop shape the ported
 * `<ChannelSidebar />` expects.
 *
 * - Categories are channels with `type === "category"` mapped to `{ id, name }`.
 * - Channels with `type === "text" | "voice"` get `categoryId = parentId ?? null`.
 * - Channels with `type === "system"` are filtered out (rendered separately
 *   by the consumer if needed).
 *
 * Optimistic local state lets DnD react instantly; real `moveChannel()` call
 * fires afterward and a re-fetch reconciles. Phase 7 hooks the WebSocket
 * channel-update message into the same setter to avoid stale views.
 */
export function useChannelsForServer({
  serverId,
  token,
  baseUrl = "",
  myPermissionLevel,
}: ChannelsForServerProps): ChannelsForServerResult {
  const [categories, setCategories] = React.useState<ChannelCategory[]>([])
  const [channels, setChannels] = React.useState<Channel[]>([])
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  const refresh = React.useCallback(async () => {
    if (!serverId || !token) {
      setCategories([])
      setChannels([])
      return
    }
    setIsLoading(true)
    try {
      const raw: RawChannel[] = await getGuildChannels(token, serverId, baseUrl)
      const cats: ChannelCategory[] = []
      const chans: Channel[] = []
      for (const c of raw) {
        if (c.type === "category") {
          cats.push({ id: c.id, name: c._displayName ?? c.name })
        } else if (c.type === "text" || c.type === "voice") {
          chans.push({
            id: c.id,
            name: c._displayName ?? c.name,
            kind: c.type,
            categoryId: c.parentId ?? null,
            unreadCount: c.unreadCount,
          })
        }
      }
      setCategories(cats)
      setChannels(chans)
    } finally {
      setIsLoading(false)
    }
  }, [serverId, token, baseUrl])

  React.useEffect(() => {
    void refresh()
  }, [refresh])

  const onChannelsChange = React.useCallback(
    (next: Channel[]) => {
      setChannels(next)
      if (!serverId || !token) return
      // Fire-and-forget persistence. Errors restore via re-fetch.
      const lastMoved = next.find((c, i) => {
        const prev = channels[i]
        return (
          prev &&
          (prev.id !== c.id || prev.categoryId !== c.categoryId)
        )
      })
      if (!lastMoved) return
      const position = next.filter((x) => x.categoryId === lastMoved.categoryId).indexOf(lastMoved)
      moveChannel(
        token,
        serverId,
        lastMoved.id,
        { parentId: lastMoved.categoryId, position },
        baseUrl
      ).catch(() => void refresh())
    },
    [serverId, token, baseUrl, channels, refresh]
  )

  const canReorder = (myPermissionLevel ?? 0) >= 2

  return {
    categories,
    channels,
    onCategoriesChange: setCategories,
    onChannelsChange,
    canReorder,
    isLoading,
  }
}

export type { Channel, ChannelCategory, ChannelKind }
