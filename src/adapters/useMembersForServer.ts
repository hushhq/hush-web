/**
 * Fetches a guild's roster via the instance HTTP API and maps it to the
 * prototype's `ServerMember[]` shape. Presence comes from server-pushed
 * events later (placeholder "online" for now).
 */
import * as React from "react"
import { getGuildMembers } from "@/lib/api"

import {
  type ServerMember,
  deriveInitials,
  memberRoleFromRaw,
} from "./types"

interface RawMember {
  id?: string
  userId?: string
  username?: string
  displayName?: string
  permissionLevel?: number
  role?: string
}

interface UseMembersArgs {
  serverId: string | null
  token: string | null
  baseUrl: string
  currentUserId: string | null
  /** Optional set of currently-online user ids. When provided,
   *  the returned `members[].presence` reflects WS-driven presence
   *  state instead of the legacy hardcoded "online" string. */
  onlineUserIds?: ReadonlySet<string>
}

interface UseMembersResult {
  members: ServerMember[]
  loading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

export function useMembersForServer({
  serverId,
  token,
  baseUrl,
  currentUserId: _currentUserId,
  onlineUserIds,
}: UseMembersArgs): UseMembersResult {
  const [raw, setRaw] = React.useState<RawMember[]>([])
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
      const data = (await getGuildMembers(token, serverId, baseUrl)) as RawMember[]
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

  const members = React.useMemo<ServerMember[]>(
    () =>
      raw.map((m) => {
        const id = m.id ?? m.userId ?? ""
        const name = m.displayName ?? m.username ?? "user"
        // Derive presence from the WS-driven online set when
        // available. Without the set we fall back to "online" so
        // tabs that never receive `presence.update` (legacy, tests)
        // do not regress to a permanently-offline UI.
        const presence: ServerMember["presence"] = onlineUserIds
          ? onlineUserIds.has(id)
            ? "online"
            : "offline"
          : "online"
        return {
          id,
          name,
          initials: deriveInitials(name),
          presence,
          role: memberRoleFromRaw({
            permissionLevel: m.permissionLevel,
            role: m.role,
          }),
        }
      }),
    [raw, onlineUserIds]
  )

  return { members, loading, error, refetch }
}
