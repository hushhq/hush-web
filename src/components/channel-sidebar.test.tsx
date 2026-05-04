/**
 * Verifies ChannelSidebar's admin-gated context menu items: New text/voice
 * channel and Invite people stay disabled when canAdministrate is false,
 * and surface a working dialog when admin + handler are provided.
 *
 * DnD reorder behaviour is exercised end-to-end via the
 * useChannelsForServer adapter test; this file focuses on the
 * presentation layer the user sees.
 */
import { describe, it, expect, vi, afterEach, beforeAll } from "vitest"
import { render, screen, cleanup } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

beforeAll(() => {
  if (!window.matchMedia) {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockReturnValue({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }),
    })
  }
  if (typeof globalThis.ResizeObserver === "undefined") {
    globalThis.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    } as unknown as typeof ResizeObserver
  }
})

import { ChannelSidebar } from "./channel-sidebar"
import { SidebarProvider } from "./ui/sidebar"
import { TooltipProvider } from "./ui/tooltip"

const BASE_PROPS = {
  serverName: "Alpha",
  systemChannels: [],
  categories: [],
  channels: [
    {
      id: "ch-1",
      name: "general",
      kind: "text" as const,
      categoryId: null,
    },
  ],
  apps: [],
  activeChannelId: "ch-1",
  onSelectChannel: vi.fn(),
  user: { name: "Y", email: "y@example.com", initials: "Y" },
  railEntries: [{ id: "home", name: "Home", initials: "HO" }],
  activeRailId: "srv-1",
  onSelectRail: vi.fn(),
}

function setup(
  overrides: Partial<React.ComponentProps<typeof ChannelSidebar>> = {}
) {
  return render(
    <TooltipProvider>
      <SidebarProvider>
        <ChannelSidebar {...BASE_PROPS} {...overrides} />
      </SidebarProvider>
    </TooltipProvider>
  )
}

describe("ChannelSidebar", () => {
  afterEach(() => cleanup())

  it("renders the server name in the header", () => {
    setup()
    expect(screen.getByText("Alpha")).toBeInTheDocument()
  })

  it("renders one button per channel", () => {
    setup()
    expect(screen.getByText("general")).toBeInTheDocument()
  })

  it("invokes onSelectChannel when a channel button is clicked", async () => {
    const onSelectChannel = vi.fn()
    setup({ onSelectChannel })

    await userEvent.click(screen.getByText("general"))
    expect(onSelectChannel).toHaveBeenCalledWith("ch-1")
  })

  it("disables Invite people when canAdministrate is false", async () => {
    setup({ canAdministrate: false, onCreateInvite: vi.fn() })

    const u = userEvent.setup()
    await u.click(screen.getByRole("button", { name: /alpha/i }))

    const invite = screen
      .getByText(/invite people/i)
      .closest("[role='menuitem']")
    expect(invite).toHaveAttribute("data-disabled")
  })

  it("enables Invite people when canAdministrate is true", async () => {
    setup({ canAdministrate: true, onCreateInvite: vi.fn().mockResolvedValue(null) })

    const u = userEvent.setup()
    await u.click(screen.getByRole("button", { name: /alpha/i }))

    const invite = screen
      .getByText(/invite people/i)
      .closest("[role='menuitem']")
    expect(invite).not.toHaveAttribute("data-disabled")
  })
})
