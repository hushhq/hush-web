/**
 * Verifies UserSettingsDialog surfaces the account info props on the
 * default tab and routes Log out → onSignOut after the confirm dialog.
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

import { UserSettingsDialog } from "./user-settings-dialog"

describe("UserSettingsDialog", () => {
  afterEach(() => cleanup())

  it("renders username + display name from the account prop", () => {
    render(
      <UserSettingsDialog
        open
        onOpenChange={() => {}}
        account={{ displayName: "Yarin", username: "yarin" }}
      />
    )

    expect(screen.getByText("Yarin")).toBeInTheDocument()
    expect(screen.getByText("yarin")).toBeInTheDocument()
  })

  it("invokes onSignOut after the destructive confirm", async () => {
    const onSignOut = vi.fn()
    render(
      <UserSettingsDialog
        open
        onOpenChange={() => {}}
        account={{ displayName: "Yarin", username: "yarin" }}
        onSignOut={onSignOut}
      />
    )

    const u = userEvent.setup()
    await u.click(screen.getAllByText(/log out/i)[0])
    const triggerBtn = screen
      .getAllByRole("button", { name: /log out/i })
      .find((b) => b.classList.contains("bg-destructive"))
    if (!triggerBtn) throw new Error("Log out trigger not found")
    await u.click(triggerBtn)

    const confirm = await screen.findByRole("button", { name: /^log out$/i })
    await u.click(confirm)

    expect(onSignOut).toHaveBeenCalledTimes(1)
  })

  it("disables the Log out button when no handler is provided", async () => {
    render(
      <UserSettingsDialog
        open
        onOpenChange={() => {}}
        account={{ displayName: "Yarin", username: "yarin" }}
      />
    )

    const u = userEvent.setup()
    await u.click(screen.getAllByText(/log out/i)[0])

    const triggerBtn = screen
      .getAllByRole("button", { name: /log out/i })
      .find((b) => b.classList.contains("bg-destructive"))
    expect(triggerBtn).toBeDefined()
    expect(triggerBtn).toBeDisabled()
  })
})
