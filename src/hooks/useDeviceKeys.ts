import * as React from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { listDeviceKeys, revokeDeviceKey } from "@/lib/api"
import { queryClient } from "@/lib/queryClient"

export interface DeviceRow {
  id: string
  deviceId: string
  label?: string | null
  certifiedAt: string
  lastSeen?: string | null
}

interface UseDeviceKeysArgs {
  homeInstanceToken: string | null
  homeInstanceUrl?: string | null
  userId?: string | null
}

interface RevokeDeviceKeyVariables {
  deviceId: string
}

export function deviceKeysQueryKey(
  homeInstanceUrl: string | null | undefined,
  userId?: string | null
) {
  return ["auth", "devices", homeInstanceUrl ?? "local", userId ?? "anonymous"] as const
}

/**
 * Invalidate every cached device-key query across instances and identities.
 *
 * Use from non-React auth-lifecycle code that mutates `/api/auth/devices`
 * outside the component-bound hooks (e.g. recovery's bulk revoke). React
 * components should keep using `useDeviceKeys().refreshDevices` or
 * `useRevokeDeviceKey().mutateAsync`, both of which target the specific key.
 *
 * Matches by prefix `["auth", "devices"]` so per-(instance,user) variants
 * are all marked stale even when the caller does not know which key applies.
 */
export function invalidateDeviceKeysQueries() {
  return queryClient.invalidateQueries({ queryKey: ["auth", "devices"] })
}

function normalizeDeviceRows(data: unknown): DeviceRow[] {
  return Array.isArray(data) ? (data as DeviceRow[]) : []
}

export function useDeviceKeys({
  homeInstanceToken,
  homeInstanceUrl,
  userId,
}: UseDeviceKeysArgs) {
  const queryClient = useQueryClient()
  const queryKey = React.useMemo(
    () => deviceKeysQueryKey(homeInstanceUrl, userId),
    [homeInstanceUrl, userId]
  )
  const isQueryEnabled = Boolean(homeInstanceToken)

  const query = useQuery<DeviceRow[], Error>({
    queryKey,
    enabled: isQueryEnabled,
    queryFn: async () => {
      if (!homeInstanceToken) {
        throw new Error("Sign in to the home instance to manage devices.")
      }
      return normalizeDeviceRows(
        await listDeviceKeys(homeInstanceToken, homeInstanceUrl ?? "")
      )
    },
  })

  const refreshDevices = React.useCallback(async () => {
    // Disabled queries have no authenticated server state to refresh.
    // Resolve as a no-op so UI callers can await this unconditionally.
    if (!homeInstanceToken) return
    await queryClient.invalidateQueries({ queryKey })
  }, [homeInstanceToken, queryClient, queryKey])

  return {
    devices: query.data ?? [],
    error: query.error,
    isLoading: query.isLoading && isQueryEnabled,
    queryKey,
    refreshDevices,
  }
}

export function useRevokeDeviceKey({
  homeInstanceToken,
  homeInstanceUrl,
  userId,
}: UseDeviceKeysArgs) {
  const queryClient = useQueryClient()
  const queryKey = React.useMemo(
    () => deviceKeysQueryKey(homeInstanceUrl, userId),
    [homeInstanceUrl, userId]
  )

  return useMutation<void, Error, RevokeDeviceKeyVariables>({
    mutationFn: async ({ deviceId }) => {
      if (!homeInstanceToken) {
        throw new Error("Sign in to the home instance to revoke devices.")
      }
      await revokeDeviceKey(homeInstanceToken, deviceId, homeInstanceUrl ?? "")
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey })
    },
  })
}
