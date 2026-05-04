import * as React from "react"

import type { ServerMember } from "./types"

interface MembersForServerResult {
  members: ServerMember[]
  isLoading: boolean
  /** Permission level of the current user on this server (0-3). Null when unknown. */
  myPermissionLevel: number | null
}

interface MembersForServerProps {
  serverId: string | null
}

/**
 * Maps hush-web `getGuildMembers()` roster to hush-test's `ServerMember[]`.
 *
 * Phase 3 stub. Phase 5 wires the real fetch + permissionLevelToRole mapping
 * via `permissionLevelToRole()` helper from `./types`.
 *
 * TODO(yarin, 2026-05-04): wire `getGuildMembers` from `src/lib/api.js`.
 * Map `userId` → `id`, derive initials, role from permissionLevel.
 */
export function useMembersForServer(
  _props: MembersForServerProps
): MembersForServerResult {
  return {
    members: [],
    isLoading: false,
    myPermissionLevel: null,
  }
}
