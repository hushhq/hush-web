/**
 * Behaviour port from src/components/MemberList.test.jsx — verifies
 * permission-gated kick action: actor must outrank target. Send-message
 * is enabled only when onDirectMessage is provided. Copy user ID is
 * always available.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { render, screen, cleanup } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import {
  MembersSidebar,
  type ServerMember,
} from "./members-sidebar"

const ALICE: ServerMember = {
  id: "alice-id",
  name: "Alice",
  initials: "AL",
  presence: "online",
  role: "member",
}
const MOD: ServerMember = {
  id: "mod-id",
  name: "Mod",
  initials: "MO",
  presence: "online",
  role: "moderator",
}
const OWNER: ServerMember = {
  id: "owner-id",
  name: "Owner",
  initials: "OW",
  presence: "online",
  role: "owner",
}

describe("MembersSidebar", () => {
  afterEach(() => {
    cleanup()
  })

  function setup(opts: {
    members?: ServerMember[]
    currentUserRole?: ServerMember["role"]
    onKickMember?: ReturnType<typeof vi.fn>
    onDirectMessage?: ReturnType<typeof vi.fn>
  } = {}) {
    return render(
      <MembersSidebar
        open
        onOpenChange={() => {}}
        serverName="My server"
        members={opts.members ?? [ALICE, MOD, OWNER]}
        isMobile={false}
        currentUserRole={opts.currentUserRole}
        onKickMember={opts.onKickMember}
        onDirectMessage={opts.onDirectMessage}
      />
    )
  }

  it("renders all members with their names", () => {
    setup()
    expect(screen.getByText("Alice")).toBeInTheDocument()
    expect(screen.getByText("Mod")).toBeInTheDocument()
    expect(screen.getByText("Owner")).toBeInTheDocument()
  })

  it("hides kick item when actor cannot moderate", async () => {
    const onKickMember = vi.fn()
    setup({ currentUserRole: "member", onKickMember })

    const u = userEvent.setup()
    await u.pointer({
      keys: "[MouseRight]",
      target: screen.getByText("Mod"),
    })

    expect(screen.queryByText(/kick from server/i)).not.toBeInTheDocument()
  })

  it("shows kick item when actor outranks target", async () => {
    const onKickMember = vi.fn()
    setup({ currentUserRole: "owner", onKickMember })

    const u = userEvent.setup()
    await u.pointer({
      keys: "[MouseRight]",
      target: screen.getByText("Mod"),
    })

    expect(screen.getByText(/kick from server/i)).toBeInTheDocument()
  })

  it("hides kick on the owner row regardless of actor", async () => {
    setup({ currentUserRole: "owner", onKickMember: vi.fn() })

    const u = userEvent.setup()
    await u.pointer({
      keys: "[MouseRight]",
      target: screen.getByText("Owner"),
    })

    expect(screen.queryByText(/kick from server/i)).not.toBeInTheDocument()
  })

  it("disables Send message when no onDirectMessage handler is provided", async () => {
    setup({ currentUserRole: "member" })

    const u = userEvent.setup()
    await u.pointer({
      keys: "[MouseRight]",
      target: screen.getByText("Alice"),
    })

    const item = screen.getByText(/send message/i).closest("[role='menuitem']")
    expect(item).toHaveAttribute("data-disabled")
  })
})
