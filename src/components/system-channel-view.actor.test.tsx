/**
 * `ActorTag` renders the label produced by `resolveActorLabel` as-is and
 * never prepends `@`. Pre-fix it always rendered `@{label}`, which produced
 * `@@alice` when the resolver already added `@`, and `@Mario Rossi` when the
 * resolver returned a display name. Both regressions are pinned here.
 */
import { describe, it, expect } from "vitest"
import { render, cleanup } from "@testing-library/react"
import { afterEach } from "vitest"

import { ActorTag } from "./system-channel-view"
import { resolveActorLabel } from "@/lib/systemActorLabel"

describe("ActorTag rendering", () => {
  afterEach(() => cleanup())

  it("DisplayNameLabel_RendersAsIs_WithoutHandlePrefix", () => {
    const { container } = render(
      <ActorTag id="u1" resolveActorLabel={() => "Mario Rossi"} />,
    )
    expect(container.textContent).toBe("Mario Rossi")
    expect(container.textContent).not.toContain("@")
  })

  it("HandleLabel_RendersExactlyOneAtSign", () => {
    const { container } = render(
      <ActorTag id="u1" resolveActorLabel={() => "@alice"} />,
    )
    expect(container.textContent).toBe("@alice")
    expect(container.textContent).not.toContain("@@")
  })

  it("NullLabel_FallsBackToShortId", () => {
    const id = "abcdef1234567890fedcba0987654321"
    const { container } = render(
      <ActorTag id={id} resolveActorLabel={() => null} />,
    )
    expect(container.textContent).toBe("abcd…4321")
  })

  it("EmptyLabel_IsTreatedLikeNull", () => {
    const id = "abcdef1234567890fedcba0987654321"
    const { container } = render(
      <ActorTag id={id} resolveActorLabel={() => "   "} />,
    )
    expect(container.textContent).toBe("abcd…4321")
  })
})

describe("resolveActorLabel — fallback chain", () => {
  it("PrefersDisplayName_WithoutHandlePrefix", () => {
    const label = resolveActorLabel(
      [{ id: "u1", displayName: "Mario Rossi", username: "mario" }],
      "u1",
    )
    expect(label).toBe("Mario Rossi")
  })

  it("FallsBackToAtUsername_WhenDisplayNameBlank", () => {
    const label = resolveActorLabel(
      [{ id: "u1", displayName: "  ", username: "alice" }],
      "u1",
    )
    expect(label).toBe("@alice")
  })

  it("UsernameAlreadyStartsWithAt_DoesNotProduceDoubleAt", () => {
    const label = resolveActorLabel(
      [{ id: "u1", username: "@alice" }],
      "u1",
    )
    expect(label).toBe("@alice")
  })

  it("UnknownId_ReturnsNull_SoCallerCanFallBackToShortId", () => {
    expect(resolveActorLabel([{ id: "u1", username: "alice" }], "unknown")).toBeNull()
  })

  it("MemberWithoutAnyLabelFields_ReturnsNull", () => {
    expect(resolveActorLabel([{ id: "u1" }], "u1")).toBeNull()
  })
})
