/**
 * Unit cover for `shouldLeaveVoiceAfterSelfRemoval`.
 *
 * The helper is the substance of PR #38: when the local user is
 * kicked/banned from a server, any active voice room owned by the
 * exact `{serverId, instanceUrl}` of the removal must be torn down
 * to avoid an authorization bypass. Critically, comparison must use
 * BOTH server id and normalized origin so a same-id guild on a
 * different federated instance does NOT tear down the active voice
 * room.
 */
import { describe, it, expect } from "vitest"

import { shouldLeaveVoiceAfterSelfRemoval } from "./authenticated-app-self-removal"

const HOME = "https://home.example.com"
const PEER = "https://peer.example.com"

describe("shouldLeaveVoiceAfterSelfRemoval", () => {
  it("returns true when serverId and normalized origin both match the joined voice", () => {
    expect(
      shouldLeaveVoiceAfterSelfRemoval(
        { serverId: "srv-1", instanceUrl: HOME },
        { serverId: "srv-1", instanceUrl: HOME }
      )
    ).toBe(true)
  })

  it("returns true when origins differ only by trailing slash / path", () => {
    expect(
      shouldLeaveVoiceAfterSelfRemoval(
        { serverId: "srv-1", instanceUrl: `${HOME}/` },
        { serverId: "srv-1", instanceUrl: `${HOME}/api/v2` }
      )
    ).toBe(true)
  })

  it("returns false when same serverId exists on a different instance (cross-instance safety)", () => {
    expect(
      shouldLeaveVoiceAfterSelfRemoval(
        { serverId: "srv-1", instanceUrl: HOME },
        { serverId: "srv-1", instanceUrl: PEER }
      )
    ).toBe(false)
  })

  it("returns false when a different server on the same instance is the removal target", () => {
    expect(
      shouldLeaveVoiceAfterSelfRemoval(
        { serverId: "srv-other", instanceUrl: HOME },
        { serverId: "srv-1", instanceUrl: HOME }
      )
    ).toBe(false)
  })

  it("returns false when the removal instanceUrl is malformed (fail closed)", () => {
    expect(
      shouldLeaveVoiceAfterSelfRemoval(
        { serverId: "srv-1", instanceUrl: "not-a-url" },
        { serverId: "srv-1", instanceUrl: HOME }
      )
    ).toBe(false)
  })

  it("returns false when the joined instanceUrl is malformed (fail closed)", () => {
    expect(
      shouldLeaveVoiceAfterSelfRemoval(
        { serverId: "srv-1", instanceUrl: HOME },
        { serverId: "srv-1", instanceUrl: "not-a-url" }
      )
    ).toBe(false)
  })

  it("returns false when either instanceUrl is null", () => {
    expect(
      shouldLeaveVoiceAfterSelfRemoval(
        { serverId: "srv-1", instanceUrl: null },
        { serverId: "srv-1", instanceUrl: HOME }
      )
    ).toBe(false)
    expect(
      shouldLeaveVoiceAfterSelfRemoval(
        { serverId: "srv-1", instanceUrl: HOME },
        { serverId: "srv-1", instanceUrl: null }
      )
    ).toBe(false)
  })

  it("returns false when joinedVoice is null", () => {
    expect(
      shouldLeaveVoiceAfterSelfRemoval(
        { serverId: "srv-1", instanceUrl: HOME },
        null
      )
    ).toBe(false)
  })

  it("returns false when the removal info is null/undefined", () => {
    expect(
      shouldLeaveVoiceAfterSelfRemoval(null, {
        serverId: "srv-1",
        instanceUrl: HOME,
      })
    ).toBe(false)
    expect(
      shouldLeaveVoiceAfterSelfRemoval(undefined, {
        serverId: "srv-1",
        instanceUrl: HOME,
      })
    ).toBe(false)
  })
})
