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
