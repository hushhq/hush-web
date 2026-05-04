import * as React from "react"

import { getGuildMembers } from "@/lib/api.js"
import { deriveInitials, permissionLevelToRole } from "./types"
import type { ServerMember } from "./types"

interface RawMember {
  id?: string
  userId?: string
  displayName?: string
  username?: string
  permissionLevel?: number
}

interface MembersForServerResult {
  members: ServerMember[]
  isLoading: boolean
  /** Permission level of the current user on this server (0-3). Null when unknown. */
  myPermissionLevel: number | null
}

interface MembersForServerProps {
  serverId: string | null
  token: string | null
  baseUrl?: string
  /** Current user id, used to derive `myPermissionLevel`. */
  currentUserId?: string | null
}

/**
 * Maps hush-web `getGuildMembers()` roster to hush-test's `ServerMember[]`.
 */
export function useMembersForServer({
  serverId,
  token,
  baseUrl = "",
  currentUserId,
}: MembersForServerProps): MembersForServerResult {
  const [members, setMembers] = React.useState<ServerMember[]>([])
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [myPermissionLevel, setMyPermissionLevel] = React.useState<
    number | null
  >(null)

  React.useEffect(() => {
    if (!serverId || !token) {
      setMembers([])
      setMyPermissionLevel(null)
      return
    }
    let cancelled = false
    setIsLoading(true)
    getGuildMembers(token, serverId, baseUrl)
      .then((raw: RawMember[]) => {
        if (cancelled) return
        const mapped: ServerMember[] = raw.map((m) => {
          const id = m.id ?? m.userId ?? ""
          const name = m.displayName ?? m.username ?? id
          return {
            id,
            name,
            initials: deriveInitials(name),
            role: permissionLevelToRole(m.permissionLevel ?? 0),
          }
        })
        setMembers(mapped)
        const me = raw.find((m) => (m.id ?? m.userId) === currentUserId)
        setMyPermissionLevel(me?.permissionLevel ?? 0)
      })
      .catch(() => {
        if (cancelled) return
        setMembers([])
        setMyPermissionLevel(null)
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [serverId, token, baseUrl, currentUserId])

  return { members, isLoading, myPermissionLevel }
}
