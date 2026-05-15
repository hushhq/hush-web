/**
 * Subscribes to per-server `member_joined` WS events and refetches the active
 * roster when a new member arrives. Mounted alongside `useServerModerationEvents`
 * inside `PerServerListeners` so kick/ban/mute/role events still own their own
 * refetch path.
 *
 * Why a dedicated hook:
 *   `useInstances.js` already listens for `member_joined` to refresh the guild
 *   subscription list, but the active member roster (`useMembersForServer`) is
 *   a separate query and was never invalidated on join. That race produced
 *   the "Actor: 8012…2e6a" system-log fallback (member arrived but was not yet
 *   in the roster the system event renderer consulted).
 *
 * Why debounce/coalesce:
 *   The server emits BOTH a `member_joined` WS frame AND a system message of
 *   type `member_joined` immediately after each join. Without coalescing both
 *   would trigger back-to-back refetches.
 */
import * as React from "react"

interface WsClientLike {
  on: (event: string, handler: (data: unknown) => void) => void
  off: (event: string, handler: (data: unknown) => void) => void
}

interface MemberJoinedFrame {
  type?: string
  server_id?: string
}

interface UseServerJoinEventsArgs {
  wsClient: WsClientLike | null | undefined
  serverId: string | null
  refetchMembers: () => Promise<void> | void
  /** Coalescing window in milliseconds. Overridable for tests. */
  debounceMs?: number
}

const DEFAULT_DEBOUNCE_MS = 150

export function useServerJoinEvents({
  wsClient,
  serverId,
  refetchMembers,
  debounceMs = DEFAULT_DEBOUNCE_MS,
}: UseServerJoinEventsArgs): void {
  const refetchRef = React.useRef(refetchMembers)
  refetchRef.current = refetchMembers

  React.useEffect(() => {
    if (!wsClient || !serverId) return

    let timer: ReturnType<typeof setTimeout> | null = null
    let cancelled = false

    const trigger = () => {
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        timer = null
        if (cancelled) return
        try {
          const result = refetchRef.current()
          if (result instanceof Promise) {
            result.catch((err) => {
              console.warn("[join] refetchMembers failed after member_joined", {
                err: err instanceof Error ? err.message : err,
              })
            })
          }
        } catch (err) {
          console.warn("[join] refetchMembers threw after member_joined", {
            err: err instanceof Error ? err.message : err,
          })
        }
      }, debounceMs)
    }

    const handler = (raw: unknown) => {
      const data = raw as MemberJoinedFrame
      if (data?.type !== "member_joined") return
      if (data.server_id && data.server_id !== serverId) return
      trigger()
    }

    wsClient.on("member_joined", handler)
    return () => {
      cancelled = true
      if (timer) clearTimeout(timer)
      wsClient.off("member_joined", handler)
    }
  }, [wsClient, serverId, debounceMs])
}
