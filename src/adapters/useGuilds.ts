/**
 * Maps `useInstanceContext().mergedGuilds` → prototype `Server[]` shape.
 * Filters out guilds with no instance URL (they cannot be routed).
 */
import * as React from "react"
import { useInstanceContext } from "@/contexts/InstanceContext"
import { useAuth } from "@/contexts/AuthContext"

import {
  type MemberRole,
  type RawGuild,
  type Server,
  deriveInitials,
  instanceHostFromUrl,
  permissionLevelToRole,
} from "./types"

interface UseGuildsResult {
  servers: Server[]
  guildsLoaded: boolean
  /** Lookup a guild by its UUID. */
  findById: (id: string) => Server | null
}

function deriveServerRole(
  guild: RawGuild,
  currentUserId: string | null
): MemberRole | undefined {
  if (typeof guild.permissionLevel === "number") {
    return permissionLevelToRole(guild.permissionLevel)
  }
  if (currentUserId && guild.ownerId === currentUserId) return "owner"
  return undefined
}

export function useGuilds(): UseGuildsResult {
  const { mergedGuilds, guildsLoaded } = useInstanceContext() as {
    mergedGuilds: RawGuild[]
    guildsLoaded: boolean
  }
  const { user } = useAuth() as { user: { id?: string } | null }
  const currentUserId = user?.id ?? null

  const servers = React.useMemo<Server[]>(
    () =>
      mergedGuilds
        .filter((g) => g.instanceUrl)
        .map((g) => {
          const name = g._localName ?? g.name ?? g.id
          return {
            id: g.id,
            name,
            initials: deriveInitials(name),
            instanceHost: instanceHostFromUrl(g.instanceUrl),
            role: deriveServerRole(g, currentUserId),
            raw: g,
          }
        }),
    [mergedGuilds, currentUserId]
  )

  const findById = React.useCallback(
    (id: string) => servers.find((s) => s.id === id) ?? null,
    [servers]
  )

  return { servers, guildsLoaded, findById }
}
