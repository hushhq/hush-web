/**
 * Pins the voice participant-name fallback chain. The previous
 * `displayName ?? display_name ?? "Anonymous"` let an empty string through,
 * which the backend then rewrote to `Participant`. Both users saw each
 * other (and themselves) as `Participant` instead of their real handles.
 */
import { describe, expect, it } from "vitest"

import { pickVoiceDisplayName } from "./voice-channel-view"

describe("pickVoiceDisplayName", () => {
  it("PrefersDisplayName_WhenPresent", () => {
    expect(
      pickVoiceDisplayName({ displayName: "Alice", username: "alice" }),
    ).toBe("Alice")
  })

  it("FallsBackToDisplayName_SnakeCaseVariant", () => {
    expect(pickVoiceDisplayName({ display_name: "Alice" })).toBe("Alice")
  })

  it("TrimsWhitespace_BeforeFallingBack", () => {
    expect(
      pickVoiceDisplayName({ displayName: "   ", username: "alice" }),
    ).toBe("alice")
  })

  it("FallsBackToUsername_WhenDisplayNameIsEmpty", () => {
    expect(pickVoiceDisplayName({ displayName: "", username: "alice" })).toBe(
      "alice",
    )
  })

  it("FallsBackToAnonymous_WhenAllFieldsBlank", () => {
    expect(
      pickVoiceDisplayName({ displayName: "", username: "", display_name: "" }),
    ).toBe("Anonymous")
    expect(pickVoiceDisplayName(null)).toBe("Anonymous")
    expect(pickVoiceDisplayName(undefined)).toBe("Anonymous")
  })

  it("NeverReturnsEmptyString_SoServerDoesNotDefaultToParticipant", () => {
    const cases = [
      { displayName: "", display_name: "", username: "" },
      { displayName: "   ", display_name: " " },
      null,
      undefined,
    ] as const
    for (const c of cases) {
      const name = pickVoiceDisplayName(c)
      expect(name).not.toBe("")
      expect(name).not.toMatch(/^\s+$/)
    }
  })
})
