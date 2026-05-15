/**
 * Instance-ban action helper for `AuthenticatedApp`.
 *
 * Lives in its own file so unit tests can pin the decision logic
 * without mounting the full AuthenticatedApp tree.
 *
 * A realtime `instance_banned` event MUST NOT call `performLogout` —
 * `performLogout` is scorched-earth (auth, vault, transcript, MLS,
 * caches), and a server-side ban from one instance has no business
 * wiping local profile state or unrelated authenticated instances.
 *
 * Behavior:
 * - Always disconnect the banned instance (drop only that session).
 * - If the banned instance is the active one, schedule a navigation
 *   away from the now-invalid active route to `/home` after a short
 *   delay so the suspension toast remains visible.
 * - If the banned instance is not active, do not navigate.
 *
 * CORE-INVARIANTS - Authentication, Vault, and Device Identity +
 * "Instance boundaries must never leak credentials" +
 * "E2EE state must not be lost or silently invalidated".
 */

export interface InstanceBanActionDeps {
  activeInstanceUrl: string | null
  bannedInstanceUrl: string
  disconnectInstance: (instanceUrl: string) => Promise<void>
  navigate: (path: string) => void
  /** Optional injection for tests. Defaults to `setTimeout`. */
  scheduleNavigation?: (cb: () => void, delayMs: number) => void
  /** Defaults to 1500ms (matches the existing toast dwell). */
  navigateDelayMs?: number
  /** Path to navigate to when the active instance is banned. */
  navigateTarget?: string
}

const DEFAULT_NAVIGATE_DELAY_MS = 1500
const DEFAULT_NAVIGATE_TARGET = "/home"

/**
 * Run the side effects for an `instance_banned` event. Disconnects the
 * banned instance unconditionally; if it was the active instance,
 * schedules a deferred navigation to `/home`. Disconnect failures are
 * caught and logged via `console.warn`, matching the previous handler.
 */
export function runInstanceBanAction(deps: InstanceBanActionDeps): void {
  const {
    activeInstanceUrl,
    bannedInstanceUrl,
    disconnectInstance,
    navigate,
    scheduleNavigation = (cb, ms) => {
      setTimeout(cb, ms)
    },
    navigateDelayMs = DEFAULT_NAVIGATE_DELAY_MS,
    navigateTarget = DEFAULT_NAVIGATE_TARGET,
  } = deps

  void disconnectInstance(bannedInstanceUrl).catch((err: unknown) => {
    console.warn("[realtime] disconnectInstance failed", {
      bannedInstanceUrl,
      err: err instanceof Error ? err.message : err,
    })
  })

  if (activeInstanceUrl === bannedInstanceUrl) {
    scheduleNavigation(() => {
      navigate(navigateTarget)
    }, navigateDelayMs)
  }
}
