/**
 * Focused unit cover for the trusted home-instance resolver used by
 * AuthenticatedApp. The resolver guards device API calls (DevicesPanel
 * sends Bearer-token requests against the returned URL), so it must
 * fail closed when a stored `HOME_INSTANCE_KEY` does not match any
 * authenticated/connected instance.
 *
 * The full AuthenticatedApp tree is too heavy to mount here; the
 * helper is exported so we can pin behavior directly.
 */
import { describe, it, expect } from "vitest"

import { resolveTrustedHomeInstance } from "./authenticated-app-home-instance"

const HOME = "https://app.gethush.live"
const PEER = "https://peer.example.com"
const ATTACKER = "https://evil.example.com"

function makeConnected(
  instances: Array<{ instanceUrl: string; logPublicKey?: string | null }>
) {
  return instances.map((inst) => ({
    instanceUrl: inst.instanceUrl,
    handshakeData:
      inst.logPublicKey === undefined
        ? null
        : { log_public_key: inst.logPublicKey ?? undefined },
  }))
}

describe("resolveTrustedHomeInstance", () => {
  it("returns the matched instance URL and log key when stored origin is connected", () => {
    const result = resolveTrustedHomeInstance(
      HOME,
      "https://other.example.com",
      makeConnected([{ instanceUrl: HOME, logPublicKey: "lp-key" }])
    )
    expect(result.url).toBe(HOME)
    expect(result.logPublicKey).toBe("lp-key")
  })

  it("falls back to page origin when no stored origin is set, if connected", () => {
    const result = resolveTrustedHomeInstance(
      null,
      HOME,
      makeConnected([{ instanceUrl: HOME, logPublicKey: "lp-key" }])
    )
    expect(result.url).toBe(HOME)
    expect(result.logPublicKey).toBe("lp-key")
  })

  it("matches by normalized origin so trailing-slash differences don't drop the match", () => {
    const result = resolveTrustedHomeInstance(
      `${HOME}/`,
      null,
      makeConnected([{ instanceUrl: `${HOME}/api`, logPublicKey: "k" }])
    )
    expect(result.url).toBe(HOME)
    expect(result.logPublicKey).toBe("k")
  })

  it("fails closed when the stored origin does not match any connected instance", () => {
    // Attacker-controlled HOME_INSTANCE_KEY value with no live session
    // for that origin must not become the device API base URL.
    const result = resolveTrustedHomeInstance(
      ATTACKER,
      HOME,
      makeConnected([{ instanceUrl: HOME, logPublicKey: "k" }])
    )
    expect(result.url).toBeNull()
    expect(result.logPublicKey).toBeNull()
  })

  it("fails closed when the stored origin is set but no instances are connected", () => {
    const result = resolveTrustedHomeInstance(HOME, HOME, makeConnected([]))
    expect(result.url).toBeNull()
    expect(result.logPublicKey).toBeNull()
  })

  it("fails closed when both stored origin and page origin are absent", () => {
    const result = resolveTrustedHomeInstance(
      null,
      null,
      makeConnected([{ instanceUrl: HOME, logPublicKey: "k" }])
    )
    expect(result.url).toBeNull()
    expect(result.logPublicKey).toBeNull()
  })

  it("fails closed when stored origin is malformed (cannot be normalized)", () => {
    const result = resolveTrustedHomeInstance(
      "not-a-url",
      null,
      makeConnected([{ instanceUrl: HOME, logPublicKey: "k" }])
    )
    expect(result.url).toBeNull()
    expect(result.logPublicKey).toBeNull()
  })

  it("ignores other connected peers and only matches the preferred origin", () => {
    const result = resolveTrustedHomeInstance(
      HOME,
      null,
      makeConnected([
        { instanceUrl: PEER, logPublicKey: "peer-key" },
        { instanceUrl: HOME, logPublicKey: "home-key" },
      ])
    )
    expect(result.url).toBe(HOME)
    expect(result.logPublicKey).toBe("home-key")
  })

  it("returns null logPublicKey when matched instance has no handshake data", () => {
    const result = resolveTrustedHomeInstance(
      HOME,
      null,
      makeConnected([{ instanceUrl: HOME }])
    )
    expect(result.url).toBe(HOME)
    expect(result.logPublicKey).toBeNull()
  })
})
