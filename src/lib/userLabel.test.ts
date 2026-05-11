import { describe, expect, it } from "vitest"

import {
  formatHandle,
  formatUserLabel,
  getUserDisplayName,
  sanitizeDisplayName,
} from "@/lib/userLabel"

describe("user label helpers", () => {
  it("formats usernames as a single @-handle", () => {
    expect(formatHandle("alice")).toBe("@alice")
    expect(formatHandle("@alice")).toBe("@alice")
    expect(formatHandle("@@alice")).toBe("@alice")
  })

  it("treats legacy handle-like display names as missing", () => {
    expect(sanitizeDisplayName("@alice", "alice")).toBe("")
    expect(sanitizeDisplayName("alice", "@alice")).toBe("")
    expect(sanitizeDisplayName("@Alice", "alice")).toBe("")
    expect(sanitizeDisplayName("Alice", "alice")).toBe("Alice")
    expect(sanitizeDisplayName("Alice Cooper", "alice")).toBe("Alice Cooper")
  })

  it("falls back to the handle for single-label surfaces", () => {
    expect(formatUserLabel({ displayName: "@alice", username: "alice" }))
      .toBe("@alice")
  })

  it("reads display names from camelCase and snake_case auth payloads", () => {
    expect(getUserDisplayName({ displayName: "Yarin" })).toBe("Yarin")
    expect(getUserDisplayName({ display_name: "Yarin" })).toBe("Yarin")
    expect(
      getUserDisplayName({ displayName: "", display_name: "Yarin" })
    ).toBe("Yarin")
  })
})
