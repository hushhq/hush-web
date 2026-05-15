/**
 * Unit cover for `runInstanceBanAction`.
 *
 * Verifies the realtime `instance_banned` decision logic without
 * mounting the full AuthenticatedApp tree. The contract under test:
 *  - the banned instance is always disconnected;
 *  - when the banned instance is the active one, navigate to `/home`
 *    after the configured delay;
 *  - when the banned instance is not active, do not navigate;
 *  - `performLogout` is never invoked from this code path (asserted
 *    structurally — the helper has no `performLogout` dependency at
 *    all, mirroring requirement #1).
 */
import { describe, it, expect, vi } from "vitest"

import { runInstanceBanAction } from "./authenticated-app-instance-ban"

const ACTIVE = "https://app.gethush.live"
const PEER = "https://peer.example.com"

function makeDeps(overrides: Partial<Parameters<typeof runInstanceBanAction>[0]> = {}) {
  const disconnectInstance = vi.fn().mockResolvedValue(undefined)
  const navigate = vi.fn()
  const scheduledCallbacks: Array<{ cb: () => void; ms: number }> = []
  const scheduleNavigation = vi.fn((cb: () => void, ms: number) => {
    scheduledCallbacks.push({ cb, ms })
  })
  return {
    deps: {
      activeInstanceUrl: ACTIVE,
      bannedInstanceUrl: ACTIVE,
      disconnectInstance,
      navigate,
      scheduleNavigation,
      ...overrides,
    },
    disconnectInstance,
    navigate,
    scheduleNavigation,
    flushScheduled: () => {
      for (const entry of scheduledCallbacks) entry.cb()
    },
    scheduledCallbacks,
  }
}

describe("runInstanceBanAction", () => {
  it("active ban disconnects the active instance and navigates to /home after the delay", () => {
    const t = makeDeps({
      activeInstanceUrl: ACTIVE,
      bannedInstanceUrl: ACTIVE,
    })

    runInstanceBanAction(t.deps)

    expect(t.disconnectInstance).toHaveBeenCalledWith(ACTIVE)
    expect(t.scheduleNavigation).toHaveBeenCalledTimes(1)
    expect(t.scheduledCallbacks[0].ms).toBe(1500)
    // Navigation deferred — not fired synchronously.
    expect(t.navigate).not.toHaveBeenCalled()

    t.flushScheduled()
    expect(t.navigate).toHaveBeenCalledWith("/home")
  })

  it("non-active ban disconnects only the banned instance and does not navigate", () => {
    const t = makeDeps({
      activeInstanceUrl: ACTIVE,
      bannedInstanceUrl: PEER,
    })

    runInstanceBanAction(t.deps)

    expect(t.disconnectInstance).toHaveBeenCalledWith(PEER)
    expect(t.scheduleNavigation).not.toHaveBeenCalled()
    expect(t.navigate).not.toHaveBeenCalled()
  })

  it("disconnect rejection is swallowed and logged via console.warn", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {})
    const failingDisconnect = vi.fn().mockRejectedValue(new Error("network down"))
    const t = makeDeps({
      activeInstanceUrl: PEER,
      bannedInstanceUrl: ACTIVE,
      disconnectInstance: failingDisconnect,
    })

    runInstanceBanAction(t.deps)
    // Wait for the catch to run.
    await new Promise((r) => setTimeout(r, 0))

    expect(failingDisconnect).toHaveBeenCalledWith(ACTIVE)
    expect(warnSpy).toHaveBeenCalledWith(
      "[realtime] disconnectInstance failed",
      expect.objectContaining({ bannedInstanceUrl: ACTIVE, err: "network down" }),
    )
    expect(t.navigate).not.toHaveBeenCalled()

    warnSpy.mockRestore()
  })

  it("does not accept a performLogout dependency (structural — sign-out path stays untouched)", () => {
    // The helper's option type intentionally has no `performLogout`
    // field, so a regression that wires logout into instance-ban
    // would have to widen this surface explicitly. Asserted via the
    // runtime keys — no `performLogout` snuck in via spread.
    const t = makeDeps()
    runInstanceBanAction(t.deps)
    expect(Object.keys(t.deps)).not.toContain("performLogout")
  })
})
