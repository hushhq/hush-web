import * as React from "react"

import { getInstanceToken } from "./useAuth"

interface UseHomeInstanceSessionArgs {
  homeInstanceUrl?: string | null
  fallbackToken: string | null
}

export interface HomeInstanceSession {
  token: string | null
  isExplicitHomeInstance: boolean
  isMissingExplicitHomeInstanceToken: boolean
}

export function resolveHomeInstanceToken(
  homeInstanceUrl: string | null | undefined,
  fallbackToken: string | null
): string | null {
  if (homeInstanceUrl) return getInstanceToken(homeInstanceUrl)
  return fallbackToken
}

export function useHomeInstanceSession({
  homeInstanceUrl,
  fallbackToken,
}: UseHomeInstanceSessionArgs): HomeInstanceSession {
  const token = React.useMemo(
    () => resolveHomeInstanceToken(homeInstanceUrl, fallbackToken),
    [homeInstanceUrl, fallbackToken]
  )
  const isExplicitHomeInstance = Boolean(homeInstanceUrl)

  return {
    token,
    isExplicitHomeInstance,
    isMissingExplicitHomeInstanceToken: isExplicitHomeInstance && !token,
  }
}
