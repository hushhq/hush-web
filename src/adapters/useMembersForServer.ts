/**
 * Fetches a guild's roster via the instance HTTP API and maps it to the
 * prototype's `ServerMember[]` shape. Presence comes from server-pushed
 * events later (placeholder "online" for now).
 */
import * as React from "react"
import { getGuildMembers } from "@/lib/api"
import { formatUserLabel } from "@/lib/userLabel"

import {
  type ServerMember,
  deriveInitials,
  memberRoleFromRaw,
} from "./types"

interface RawMember {
  id?: string
  userId?: string
  username?: string | null
  displayName?: string | null
  permissionLevel?: number
  role?: string
  createdAt?: string | null
  joinedAt?: string | null
  homeInstance?: string | null
}

interface UseMembersArgs {
  serverId: string | null
  token: string | null
  baseUrl: string
  currentUserId: string | null
  /** Optional set of currently-online user ids. When provided AND
   *  `hasOnlineSnapshot` is true, the returned `members[].presence`
   *  reflects WS-driven presence state. Without a snapshot, falls
   *  back to "online" for every row so the initial render does not
   *  flip every member to offline before the first
   *  `presence.update` lands. */
  onlineUserIds?: ReadonlySet<string>
  /** True once at least one `presence.update` frame has arrived.
   *  Required to interpret `onlineUserIds` correctly — see comment
   *  on the field above. */
  hasOnlineSnapshot?: boolean
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
  hasOnlineSnapshot,
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
    () => raw.map((m) => mapRawMember(m, onlineUserIds, hasOnlineSnapshot)),
    [raw, onlineUserIds, hasOnlineSnapshot]
  )

  return { members, loading, error, refetch }
}

/**
 * Exported for unit testing. Pure projection of the wire payload into the UI
 * row shape. Preserves the raw profile fields so the profile card and system
 * log can render real values instead of collapsing into the summary label.
 */
export function mapRawMember(
  m: RawMember,
  onlineUserIds: ReadonlySet<string> | undefined,
  hasOnlineSnapshot: boolean | undefined
): ServerMember {
  const id = m.id ?? m.userId ?? ""
  const username = nonBlankOrNull(m.username)
  const displayName = nonBlankOrNull(m.displayName)
  const name = formatUserLabel({
    displayName: displayName ?? undefined,
    username: username ?? undefined,
    fallback: "user",
  })
  return {
    id,
    name,
    initials: deriveInitials(name),
    presence:
      onlineUserIds && hasOnlineSnapshot
        ? onlineUserIds.has(id)
          ? "online"
          : "offline"
        : "online",
    role: memberRoleFromRaw({
      permissionLevel: m.permissionLevel,
      role: m.role,
    }),
    username,
    displayName,
    createdAt: nonBlankOrNull(m.createdAt),
    joinedAt: nonBlankOrNull(m.joinedAt),
    homeInstance: nonBlankOrNull(m.homeInstance),
  }
}

function nonBlankOrNull(value: string | null | undefined): string | null {
  if (typeof value !== "string") return null
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}
