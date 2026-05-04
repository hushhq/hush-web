/**
 * Verifies ServerSettingsDialog hides the danger-zone Delete server tab
 * when no onDeleteServer handler is provided (non-owner) and exposes it
 * when supplied.
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
})

import { ServerSettingsDialog } from "./server-settings-dialog"

describe("ServerSettingsDialog", () => {
  afterEach(() => cleanup())

  it("renders the title with the server name", () => {
    render(
      <ServerSettingsDialog
        open
        onOpenChange={() => {}}
        serverName="Alpha"
      />
    )

    expect(screen.getAllByText(/alpha settings/i).length).toBeGreaterThan(0)
  })

  it("hides Delete server when no onDeleteServer handler is provided", () => {
    render(
      <ServerSettingsDialog
        open
        onOpenChange={() => {}}
        serverName="Alpha"
      />
    )

    expect(screen.queryByText(/delete server/i)).not.toBeInTheDocument()
  })

  it("shows Delete server tab when onDeleteServer is provided", () => {
    render(
      <ServerSettingsDialog
        open
        onOpenChange={() => {}}
        serverName="Alpha"
        onDeleteServer={vi.fn()}
      />
    )

    expect(screen.getAllByText(/delete server/i).length).toBeGreaterThan(0)
  })

  it("invokes onDeleteServer after the destructive confirm", async () => {
    const onDeleteServer = vi.fn()
    render(
      <ServerSettingsDialog
        open
        onOpenChange={() => {}}
        serverName="Alpha"
        onDeleteServer={onDeleteServer}
      />
    )

    const u = userEvent.setup()
    // Navigate to the danger-zone tab
    const deleteTabs = screen.getAllByText(/delete server/i)
    await u.click(deleteTabs[0])
    // Trigger the confirm dialog
    const triggerButton = screen
      .getAllByRole("button", { name: /delete server/i })
      .find((b) => b.classList.contains("bg-destructive"))
    if (!triggerButton) throw new Error("Delete trigger button not found")
    await u.click(triggerButton)
    // Confirm
    const confirm = await screen.findByRole("button", {
      name: /^delete server$/i,
    })
    await u.click(confirm)

    expect(onDeleteServer).toHaveBeenCalledTimes(1)
  })
})
