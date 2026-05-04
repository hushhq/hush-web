import * as React from "react"

import type { Channel, ChannelCategory, ChannelKind } from "./types"

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
}

/**
 * Bridges the legacy `getGuildChannels()` API to the prop shape the ported
 * `<ChannelSidebar />` expects.
 *
 * Phase 3 ships a stub that returns empty arrays so type contracts compile.
 * Phase 5 wires the real fetch + `moveChannel()` mutation through this hook
 * without changing the consumer-side API.
 *
 * TODO(yarin, 2026-05-04): wire `getGuildChannels` + `moveChannel` from
 * `src/lib/api.js`. Compute `canReorder = isAdmin && wsConnected`.
 */
export function useChannelsForServer(
  _props: ChannelsForServerProps
): ChannelsForServerResult {
  const [categories, setCategories] = React.useState<ChannelCategory[]>([])
  const [channels, setChannels] = React.useState<Channel[]>([])

  return {
    categories,
    channels,
    onCategoriesChange: setCategories,
    onChannelsChange: setChannels,
    canReorder: false,
    isLoading: false,
  }
}

export type { Channel, ChannelCategory, ChannelKind }
