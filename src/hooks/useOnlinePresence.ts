import * as React from "react"

interface WsClientLike {
  on: (event: string, handler: (msg: unknown) => void) => void
  off?: (event: string, handler: (msg: unknown) => void) => void
}

interface PresenceUpdateFrame {
  type?: string
  user_ids?: string[]
}

export interface OnlinePresenceState {
  onlineUserIds: Set<string>
  /** True once at least one `presence.update` frame has arrived.
   *  Consumers MUST gate offline derivation on this flag — without
   *  it, the empty initial set would render every member offline
   *  until the first frame lands. */
  hasSnapshot: boolean
}

/**
 * Returns the current set of online user ids derived from the
 * backend `presence.update` broadcast (see
 * `hush-server/internal/ws/hub.go`). The server emits the full set
 * whenever a connection register / unregister event flips the
 * roster, so we replace the set on every frame instead of
 * incrementally diffing.
 *
 * Consumers (member rows in `useMembersForServer`, DM rows in the
 * authenticated app root) MUST gate offline derivation on
 * `hasSnapshot` — for example: `hasSnapshot ? (set.has(id) ?
 * "online" : "offline") : "online"`. Without that gate the initial
 * empty set would render every user offline until the first frame
 * arrives.
 *
 * Idle / DND states are intentionally not synthesised — the
 * backend currently exposes only connected / not-connected;
 * richer states need a server-side change.
 */
export function useOnlinePresence(
  wsClient: WsClientLike | null | undefined,
): OnlinePresenceState {
  const [state, setState] = React.useState<OnlinePresenceState>({
    onlineUserIds: new Set(),
    hasSnapshot: false,
  })

  React.useEffect(() => {
    if (!wsClient) return
    const handler = (raw: unknown) => {
      const msg = raw as PresenceUpdateFrame
      if (msg?.type !== "presence.update") return
      const ids = Array.isArray(msg.user_ids) ? msg.user_ids : []
      setState({ onlineUserIds: new Set(ids), hasSnapshot: true })
    }
    wsClient.on("presence.update", handler)
    return () => {
      wsClient.off?.("presence.update", handler)
    }
  }, [wsClient])

  // Reset snapshot state when the wsClient identity changes (e.g.
  // active instance switch). The next `presence.update` from the
  // new client will repopulate the set.
  React.useEffect(() => {
    setState({ onlineUserIds: new Set(), hasSnapshot: false })
  }, [wsClient])

  return state
}
