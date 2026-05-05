/**
 * Contract regressions for adapter role mapping. Specifically guards the
 * fallback path the audit ledger calls out as P1-6: when the backend
 * returns `role: "moderator"` instead of `permissionLevel: 1`, the UI must
 * grant moderator-level (not admin-level) affordances.
 */
import { describe, it, expect } from "vitest"

import {
  memberRoleFromRaw,
  permissionLevelToRole,
} from "./types"

describe("permissionLevelToRole", () => {
  it("maps numeric levels onto MemberRole", () => {
    expect(permissionLevelToRole(0)).toBe("member")
    expect(permissionLevelToRole(1)).toBe("moderator")
    expect(permissionLevelToRole(2)).toBe("admin")
    expect(permissionLevelToRole(3)).toBe("owner")
    expect(permissionLevelToRole(undefined)).toBe("member")
    expect(permissionLevelToRole(99)).toBe("owner")
  })
})

describe("memberRoleFromRaw", () => {
  it("prefers the integer permissionLevel when present", () => {
    expect(memberRoleFromRaw({ permissionLevel: 0 })).toBe("member")
    expect(memberRoleFromRaw({ permissionLevel: 1, role: "owner" })).toBe(
      "moderator"
    )
    expect(memberRoleFromRaw({ permissionLevel: 3 })).toBe("owner")
  })

  it("falls back to the role string when permissionLevel is absent", () => {
    expect(memberRoleFromRaw({ role: "owner" })).toBe("owner")
    expect(memberRoleFromRaw({ role: "admin" })).toBe("admin")
    expect(memberRoleFromRaw({ role: "moderator" })).toBe("moderator")
    expect(memberRoleFromRaw({ role: "mod" })).toBe("moderator")
    expect(memberRoleFromRaw({ role: "member" })).toBe("member")
    expect(memberRoleFromRaw({ role: "bot" })).toBe("bot")
  })

  it("normalises case on string roles", () => {
    expect(memberRoleFromRaw({ role: "MODERATOR" })).toBe("moderator")
    expect(memberRoleFromRaw({ role: "Owner" })).toBe("owner")
  })

  it("returns 'member' for an unknown shape", () => {
    expect(memberRoleFromRaw({})).toBe("member")
    expect(memberRoleFromRaw({ role: "bogus" })).toBe("member")
  })
})
