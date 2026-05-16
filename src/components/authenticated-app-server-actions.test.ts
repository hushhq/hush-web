/**
 * Unit cover for `resolveServerForAction` and `serverTargetsMatch`.
 *
 * The contract these helpers enforce is the substance of PR #28:
 * destructive / settings actions in a federated multi-instance client
 * must never resolve a target by `id` alone, because two connected
 * instances can expose guilds with the same id and the wrong token /
 * base URL would otherwise be used.
 */
import { describe, it, expect } from "vitest"

import {
  resolveServerForAction,
  serverTargetsMatch,
} from "./authenticated-app-server-actions"

const HOME = "https://home.example.com"
const PEER = "https://peer.example.com"

const SERVERS = [
  {
    id: "shared",
    role: "owner" as const,
    raw: { instanceUrl: HOME },
  },
  {
    id: "shared",
    role: "member" as const,
    raw: { instanceUrl: PEER },
  },
  {
    id: "home-only",
    role: "admin" as const,
    raw: { instanceUrl: HOME },
  },
]

describe("resolveServerForAction", () => {
  it("matches by both id and instanceUrl, not by id alone", () => {
    const match = resolveServerForAction(SERVERS, {
      id: "shared",
      instanceUrl: PEER,
    })
    expect(match?.raw.instanceUrl).toBe(PEER)
    expect(match?.role).toBe("member")
  })

  it("returns null when only the id matches but the instanceUrl does not", () => {
    const match = resolveServerForAction(SERVERS, {
      id: "shared",
      instanceUrl: "https://unknown.example.com",
    })
    expect(match).toBeNull()
  })

  it("returns null when target.instanceUrl is missing (cannot disambiguate)", () => {
    const match = resolveServerForAction(SERVERS, {
      id: "shared",
      instanceUrl: null,
    })
    expect(match).toBeNull()
  })

  it("returns null when target is null/undefined", () => {
    expect(resolveServerForAction(SERVERS, null)).toBeNull()
    expect(resolveServerForAction(SERVERS, undefined)).toBeNull()
  })

  it("returns the only candidate when the id is unique across instances", () => {
    const match = resolveServerForAction(SERVERS, {
      id: "home-only",
      instanceUrl: HOME,
    })
    expect(match?.role).toBe("admin")
  })
})

describe("serverTargetsMatch", () => {
  it("matches on both id and instanceUrl", () => {
    expect(
      serverTargetsMatch(
        { id: "g", instanceUrl: HOME },
        { id: "g", instanceUrl: HOME }
      )
    ).toBe(true)
  })

  it("rejects when ids match but instances differ (same-id cross-instance)", () => {
    expect(
      serverTargetsMatch(
        { id: "shared", instanceUrl: HOME },
        { id: "shared", instanceUrl: PEER }
      )
    ).toBe(false)
  })

  it("rejects when either side has a null instanceUrl", () => {
    expect(
      serverTargetsMatch(
        { id: "g", instanceUrl: HOME },
        { id: "g", instanceUrl: null }
      )
    ).toBe(false)
    expect(
      serverTargetsMatch(
        { id: "g", instanceUrl: null },
        { id: "g", instanceUrl: null }
      )
    ).toBe(false)
  })

  it("rejects null/undefined inputs", () => {
    expect(serverTargetsMatch(null, { id: "g", instanceUrl: HOME })).toBe(false)
    expect(serverTargetsMatch({ id: "g", instanceUrl: HOME }, null)).toBe(false)
    expect(serverTargetsMatch(undefined, undefined)).toBe(false)
  })
})
