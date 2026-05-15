/**
 * ProfileCard renders real profile fields from the expanded ServerMember
 * shape. Pre-fix it hardcoded "Apr 2025" for every row regardless of the
 * joined/created date the API returned. These tests pin the new behaviour:
 *   - real join/created date formatted from the payload;
 *   - "Unknown" fallback when both are absent or unparseable;
 *   - handle line (@username) appears only when distinct from display name.
 */
import { afterEach, describe, expect, it } from "vitest"
import { cleanup, render, screen } from "@testing-library/react"

import { formatMemberSince } from "./members-sidebar"
import { MembersSidebar, type ServerMember } from "./members-sidebar"
import userEvent from "@testing-library/user-event"

describe("formatMemberSince", () => {
  it("FormatsValidIso_AsMonthYear", () => {
    const result = formatMemberSince("2026-05-14T22:53:00Z")
    // Date formatting depends on locale; only require that the year is
    // present and the literal placeholder string is gone.
    expect(result).toMatch(/\b2026\b/)
    expect(result).not.toMatch(/Apr 2025/i)
  })

  it("ReturnsUnknown_WhenInputIsNullishOrBlank", () => {
    expect(formatMemberSince(null)).toBe("Unknown")
    expect(formatMemberSince(undefined)).toBe("Unknown")
    expect(formatMemberSince("")).toBe("Unknown")
  })

  it("ReturnsUnknown_WhenInputUnparseable", () => {
    expect(formatMemberSince("not-a-date")).toBe("Unknown")
  })
})

const ALICE: ServerMember = {
  id: "alice-id",
  name: "Alice",
  initials: "AL",
  presence: "online",
  role: "member",
  username: "alice",
  displayName: "Alice",
  createdAt: "2025-04-12T10:00:00Z",
  joinedAt: "2026-05-14T22:53:00Z",
  homeInstance: null,
}

async function openProfileCard(member: ServerMember) {
  render(
    <MembersSidebar
      open
      onOpenChange={() => {}}
      serverName="Test Guild"
      members={[member]}
      isMobile={false}
      currentUserRole="owner"
    />,
  )
  const trigger = screen.getByText(member.name)
  await userEvent.click(trigger)
}

describe("ProfileCard", () => {
  afterEach(() => cleanup())

  it("DoesNotRenderHardcodedApr2025_AnywhereInTheDom", async () => {
    await openProfileCard(ALICE)
    const tree = document.body.textContent ?? ""
    expect(tree).not.toMatch(/Apr 2025/i)
  })

  it("RendersHandleLine_WhenUsernameDiffersFromDisplayName", async () => {
    await openProfileCard(ALICE)
    expect(screen.getAllByText("@alice").length).toBeGreaterThan(0)
  })

  it("RendersUnknown_WhenJoinedAtAndCreatedAtBothMissing", async () => {
    await openProfileCard({
      ...ALICE,
      joinedAt: null,
      createdAt: null,
    })
    expect(screen.getByText("Unknown")).toBeInTheDocument()
  })
})
