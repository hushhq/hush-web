import * as React from "react"

interface WsClientLike {
  on: (event: string, handler: (msg: unknown) => void) => void
  off?: (event: string, handler: (msg: unknown) => void) => void
}

interface PresenceUpdateFrame {
  type?: string
  user_ids?: string[]
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
 * authenticated app root) should derive presence as `set.has(userId)
 * ? "online" : "offline"`. Idle / DND states are intentionally not
 * synthesised — the backend currently exposes only connected /
 * not-connected; richer states need a server-side change.
 */
export function useOnlinePresence(
  wsClient: WsClientLike | null | undefined,
): Set<string> {
  const [onlineIds, setOnlineIds] = React.useState<Set<string>>(new Set())

  React.useEffect(() => {
    if (!wsClient) return
    const handler = (raw: unknown) => {
      const msg = raw as PresenceUpdateFrame
      if (msg?.type !== "presence.update") return
      const ids = Array.isArray(msg.user_ids) ? msg.user_ids : []
      setOnlineIds(new Set(ids))
    }
    wsClient.on("presence.update", handler)
    return () => {
      wsClient.off?.("presence.update", handler)
    }
  }, [wsClient])

  return onlineIds
}
