/**
 * Fetches a guild's roster via the instance HTTP API and maps it to the
 * prototype's `ServerMember[]` shape. Presence comes from server-pushed
 * events later (placeholder "online" for now).
 */
import * as React from "react"
// @ts-expect-error legacy JS
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
        return {
          id,
          name,
          initials: deriveInitials(name),
          presence: "online",
          role: memberRoleFromRaw({
            permissionLevel: m.permissionLevel,
            role: m.role,
          }),
        }
      }),
    [raw]
  )

  return { members, loading, error, refetch }
}
