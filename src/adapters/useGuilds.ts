/**
 * Maps `useInstanceContext().mergedGuilds` → prototype `Server[]` shape.
 * Filters out guilds with no instance URL (they cannot be routed).
 */
import * as React from "react"
// @ts-expect-error legacy JS
import { useInstanceContext } from "@/contexts/InstanceContext"

import {
  type RawGuild,
  type Server,
  deriveInitials,
  instanceHostFromUrl,
} from "./types"

interface UseGuildsResult {
  servers: Server[]
  guildsLoaded: boolean
  /** Lookup a guild by its UUID. */
  findById: (id: string) => Server | null
}

export function useGuilds(): UseGuildsResult {
  const { mergedGuilds, guildsLoaded } = useInstanceContext() as {
    mergedGuilds: RawGuild[]
    guildsLoaded: boolean
  }

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
            raw: g,
          }
        }),
    [mergedGuilds]
  )

  const findById = React.useCallback(
    (id: string) => servers.find((s) => s.id === id) ?? null,
    [servers]
  )

  return { servers, guildsLoaded, findById }
}
