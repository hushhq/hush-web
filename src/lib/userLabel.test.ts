import { describe, expect, it } from "vitest"

import {
  formatHandle,
  formatUsername,
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

  it("formats raw usernames without presentation prefixes", () => {
    expect(formatUsername("alice")).toBe("alice")
    expect(formatUsername("@alice")).toBe("alice")
    expect(formatUsername("@@alice")).toBe("alice")
  })

  it("normalizes display names without discarding username-shaped values", () => {
    expect(sanitizeDisplayName("@alice", "alice")).toBe("alice")
    expect(sanitizeDisplayName("alice", "@alice")).toBe("alice")
    expect(sanitizeDisplayName("@Alice", "alice")).toBe("Alice")
    expect(sanitizeDisplayName("Alice", "alice")).toBe("Alice")
    expect(sanitizeDisplayName("Alice Cooper", "alice")).toBe("Alice Cooper")
  })

  it("falls back to the raw username for single-label surfaces", () => {
    expect(formatUserLabel({ displayName: "@alice", username: "alice" }))
      .toBe("alice")
    expect(formatUserLabel({ displayName: "", username: "@alice" }))
      .toBe("alice")
  })

  it("reads display names from camelCase and snake_case auth payloads", () => {
    expect(getUserDisplayName({ displayName: "Yarin" })).toBe("Yarin")
    expect(getUserDisplayName({ display_name: "Yarin" })).toBe("Yarin")
    expect(
      getUserDisplayName({ displayName: "", display_name: "Yarin" })
    ).toBe("Yarin")
  })
})
