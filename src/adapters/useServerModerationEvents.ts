import * as React from "react"

import * as mlsGroup from "@/lib/mlsGroup"
import * as mlsStore from "@/lib/mlsStore"
import { getDeviceId } from "@/hooks/useAuth"

interface WsClientLike {
  on: (event: string, handler: (data: unknown) => void) => void
  off: (event: string, handler: (data: unknown) => void) => void
}

interface ModerationFrame {
  type?: string
  server_id?: string
  user_id?: string
  permission_level?: number
  reason?: string
}

interface UseServerModerationEventsArgs {
  wsClient: WsClientLike | null | undefined
  serverId: string | null
  currentUserId: string | null
  /** Refetch the active server's member list. Called for any
   *  moderation event regardless of whether the target is self,
   *  so observers see the new roster + role/mute metadata. */
  refetchMembers: () => Promise<void> | void
  /** Text-channel ids of the active server, used for self-kick /
   *  self-ban MLS cleanup. Captured at event time via a ref so the
   *  cleanup uses the snapshot the user was working with. */
  textChannelIds: readonly string[]
  /** Fired when the current user is the target of a kick or ban.
   *  Receives `{ event, reason }` so the caller can route the user
   *  away from the affected server with the correct toast copy. */
  onSelfRemoved?: (info: { event: "kick" | "ban"; reason?: string }) => void
}

const SELF_REMOVAL_EVENTS: ReadonlySet<string> = new Set([
  "member_kicked",
  "member_banned",
])

/**
 * Subscribes to per-server moderation events emitted by the backend
 * (`hush-server/internal/api/moderation.go` +
 * `internal/api/servers.go`):
 *   - `member_kicked`
 *   - `member_banned`
 *   - `member_muted`
 *   - `member_role_changed`
 *
 * Filters by `server_id === serverId` so a multi-server tab only
 * reacts to events for the active server. Every event triggers a
 * member refetch — cheaper than reconciling the delta inline and
 * avoids racing with our own optimistic UI on the actor's tab.
 *
 * When the current user is the target of `member_kicked` or
 * `member_banned`, the hook additionally cleans up local MLS state
 * for the affected server's text channels via
 * `mlsGroup.leaveAllChannelGroups` and invokes `onSelfRemoved` so
 * the caller can route the user away with the appropriate toast.
 *
 * `member_muted` and `member_role_changed` always refetch — there
 * is no metadata-merge fast path because the server snapshot is
 * the source of truth for both flags.
 */
export function useServerModerationEvents({
  wsClient,
  serverId,
  currentUserId,
  refetchMembers,
  textChannelIds,
  onSelfRemoved,
}: UseServerModerationEventsArgs): void {
  // Latest channel-id list captured in a ref so the event handler
  // closures always see the current value without re-binding the
  // subscription on every channel change.
  const channelIdsRef = React.useRef<readonly string[]>(textChannelIds)
  channelIdsRef.current = textChannelIds

  const refetchRef = React.useRef(refetchMembers)
  refetchRef.current = refetchMembers
  const onSelfRef = React.useRef(onSelfRemoved)
  onSelfRef.current = onSelfRemoved
  const userIdRef = React.useRef(currentUserId)
  userIdRef.current = currentUserId

  React.useEffect(() => {
    if (!wsClient || !serverId) return

    async function cleanupSelfMls() {
      const userId = userIdRef.current
      if (!userId) return
      const ids = channelIdsRef.current
      if (!ids.length) return
      try {
        const db = await mlsStore.openStore(userId, getDeviceId())
        if (!db) return
        await mlsGroup.leaveAllChannelGroups(
          { db, mlsStore } as Parameters<
            typeof mlsGroup.leaveAllChannelGroups
          >[0],
          [...ids],
        )
      } catch (err) {
        console.warn("[moderation] self-removal MLS cleanup failed", {
          serverId,
          err: err instanceof Error ? err.message : err,
        })
      }
    }

    const handler = async (raw: unknown) => {
      const data = raw as ModerationFrame
      const eventType = data?.type
      if (!eventType) return
      if (data.server_id && data.server_id !== serverId) return

      const userId = userIdRef.current
      const isSelf = userId != null && data.user_id === userId

      if (isSelf && SELF_REMOVAL_EVENTS.has(eventType)) {
        await cleanupSelfMls()
        onSelfRef.current?.({
          event: eventType === "member_kicked" ? "kick" : "ban",
          reason: data.reason,
        })
        // Members refetch is a courtesy — the caller is already
        // routing the user away from this server view.
      }

      try {
        await refetchRef.current()
      } catch (err) {
        console.warn("[moderation] refetchMembers failed after event", {
          eventType,
          err: err instanceof Error ? err.message : err,
        })
      }
    }

    wsClient.on("member_kicked", handler)
    wsClient.on("member_banned", handler)
    wsClient.on("member_muted", handler)
    wsClient.on("member_role_changed", handler)
    return () => {
      wsClient.off("member_kicked", handler)
      wsClient.off("member_banned", handler)
      wsClient.off("member_muted", handler)
      wsClient.off("member_role_changed", handler)
    }
  }, [wsClient, serverId])
}
