import * as React from "react"

interface WsClientLike {
  subscribeChannel: (channelId: string) => void
  unsubscribeChannel: (channelId: string) => void
}

/**
 * Owns the WS channel-room subscription set for text-channel MLS
 * control delivery (`mls.commit`, `mls.add_request`).
 *
 * The backend broadcasts these frames on the channel room, so the
 * client must be subscribed to that room to receive them. The active
 * chat already subscribes the channel currently in view via
 * `useChannelMessages`, but commits arrive for inactive channels too
 * (a peer adding/removing members in any channel the user is in).
 * Without a sibling subscriber, those frames never reach the wire and
 * the local MLS state for the inactive channel falls behind.
 *
 * Transport refcounting in `lib/ws.js` lets this hook share channel
 * subscriptions with `useChannelMessages` safely — only one
 * `subscribe` frame goes on the wire per channel even when both
 * owners ask for it, and the `unsubscribe` frame fires only after
 * the last owner drops the channel.
 *
 * Scoping: the input is the active server's text-channel id list.
 * Cross-server fan-out is deliberately deferred — current root state
 * does not surface a flat "every text channel I'm a member of" list,
 * and the dominant case for state desync is the active server's
 * background channels, which this hook covers.
 */
export function useTextChannelMLSSubscriptions(
  wsClient: WsClientLike | null | undefined,
  channelIds: readonly string[],
): void {
  // Track the channel ids THIS hook is currently subscribed to, so
  // unmount + diff cleanups call exactly the right counter
  // decrements without leaking into the active chat's count.
  const ownedRef = React.useRef<Set<string>>(new Set())

  React.useEffect(() => {
    if (!wsClient) return
    const next = new Set(channelIds.filter(Boolean))
    const owned = ownedRef.current

    for (const id of next) {
      if (!owned.has(id)) {
        wsClient.subscribeChannel(id)
        owned.add(id)
      }
    }
    for (const id of owned) {
      if (!next.has(id)) {
        wsClient.unsubscribeChannel(id)
        owned.delete(id)
      }
    }
  }, [wsClient, channelIds])

  React.useEffect(() => {
    return () => {
      const owned = ownedRef.current
      if (!wsClient) {
        owned.clear()
        return
      }
      for (const id of owned) {
        wsClient.unsubscribeChannel(id)
      }
      owned.clear()
    }
  }, [wsClient])
}
