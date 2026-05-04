/**
 * Behaviour port from src/components/ServerList.test.jsx + GuildContextMenu.
 * Verifies that the rail's right-click menu surfaces Leave server for
 * non-owners and Delete server for owners, with separate confirm dialogs.
 */
import { describe, it, expect, vi, afterEach, beforeAll } from "vitest"
import { render, screen, cleanup } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

beforeAll(() => {
  // ResizeObserver is required by server-rail's edge-fade scroll observer.
  // jsdom does not implement it, so provide a minimal noop.
  if (typeof globalThis.ResizeObserver === "undefined") {
    globalThis.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    } as unknown as typeof ResizeObserver
  }
})

import { ServerRail } from "./server-rail"
import { TooltipProvider } from "./ui/tooltip"

const SERVERS = [
  { id: "srv-1", name: "Alpha", initials: "AL" },
  { id: "srv-2", name: "Beta", initials: "BE" },
]

describe("ServerRail", () => {
  afterEach(() => cleanup())

  function setup(overrides: Partial<React.ComponentProps<typeof ServerRail>> = {}) {
    return render(
      <TooltipProvider>
        <ServerRail
          servers={SERVERS}
          activeRailId="srv-1"
          onSelect={() => {}}
          {...overrides}
        />
      </TooltipProvider>
    )
  }

  it("renders one button per server", () => {
    setup()
    expect(screen.getByRole("button", { name: "Alpha" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Beta" })).toBeInTheDocument()
  })

  it("calls onSelect with the server id when clicked", async () => {
    const onSelect = vi.fn()
    setup({ onSelect })

    await userEvent.click(screen.getByRole("button", { name: "Beta" }))
    expect(onSelect).toHaveBeenCalledWith("srv-2")
  })

  it("shows Leave server (not Delete) when current user is a non-owner member", async () => {
    setup({ getServerRole: () => "member", onLeaveServer: vi.fn() })

    await userEvent.pointer({
      keys: "[MouseRight]",
      target: screen.getByRole("button", { name: "Alpha" }),
    })

    expect(screen.getByText(/leave server/i)).toBeInTheDocument()
    expect(screen.queryByText(/delete server/i)).not.toBeInTheDocument()
  })

  it("shows Delete server when current user is the owner", async () => {
    setup({ getServerRole: () => "owner", onDeleteServer: vi.fn() })

    await userEvent.pointer({
      keys: "[MouseRight]",
      target: screen.getByRole("button", { name: "Alpha" }),
    })

    expect(screen.getByText(/delete server/i)).toBeInTheDocument()
    expect(screen.queryByText(/^leave server$/i)).not.toBeInTheDocument()
  })

  // Dialog-confirm flow tested via integration in App.test.jsx — Radix
  // AlertDialog uses portals which complicate user-event clicks here.
})
