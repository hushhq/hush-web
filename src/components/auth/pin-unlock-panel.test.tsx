/**
 * Behaviour port from src/components/auth/PinUnlockScreen.test.jsx —
 * verifies the new PinUnlockPanel preserves the same contract:
 * unlock submit, attempt counter / progressive delay, switch-account
 * footer, and VAULT_WIPED error path.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { render, screen, cleanup } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

const unlockVault = vi.fn<(pin: string) => Promise<void>>()
const user = { username: "alice", display_name: "Alice" }

vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({ unlockVault, user }),
}))

import { PinUnlockPanel } from "./pin-unlock-panel"

describe("PinUnlockPanel", () => {
  beforeEach(() => {
    unlockVault.mockReset()
  })

  afterEach(() => {
    cleanup()
  })

  it("calls unlockVault with the entered pin on submit", async () => {
    unlockVault.mockResolvedValue(undefined)
    const u = userEvent.setup()
    render(<PinUnlockPanel />)

    // PIN entry is the 4-slot OTP input; focus the labelled control and
    // type via the keyboard model.
    await u.click(screen.getByLabelText(/vault pin/i))
    await u.keyboard("1234")
    await u.click(screen.getByRole("button", { name: /^unlock$/i }))

    expect(unlockVault).toHaveBeenCalledWith("1234")
  })

  it("renders the username header", () => {
    render(<PinUnlockPanel />)
    // Username appears in heading + avatar tooltip area; either is fine.
    expect(screen.getAllByText("Alice").length).toBeGreaterThan(0)
  })

  it("triggers onSwitchAccount when the footer button is clicked", async () => {
    const onSwitchAccount = vi.fn()
    render(<PinUnlockPanel onSwitchAccount={onSwitchAccount} />)
    await userEvent.click(screen.getByRole("button", { name: /not you/i }))
    expect(onSwitchAccount).toHaveBeenCalledTimes(1)
  })

  it("shows the VAULT_WIPED recovery message after a wipe error", async () => {
    unlockVault.mockRejectedValue(Object.assign(new Error("wiped"), { code: "VAULT_WIPED" }))
    const u = userEvent.setup()
    render(<PinUnlockPanel />)

    await u.click(screen.getByLabelText(/vault pin/i))
    await u.keyboard("9999")
    await u.click(screen.getByRole("button", { name: /^unlock$/i }))

    expect(
      await screen.findByText(/vault has been wiped/i)
    ).toBeInTheDocument()
  })

  it("starts a countdown delay after the third failed attempt", async () => {
    unlockVault.mockRejectedValue(new Error("bad pin"))
    const u = userEvent.setup()
    render(<PinUnlockPanel />)

    const submit = screen.getByRole("button", { name: /^unlock$/i })
    const input = screen.getByLabelText(/vault pin/i)

    for (let i = 0; i < 3; i++) {
      await u.click(input)
      // OTP component clears itself after a failed unlock attempt; just
      // re-type the four digits each pass.
      await u.keyboard("0000")
      await u.click(submit)
    }

    expect(await screen.findByText(/wait 1s/i)).toBeInTheDocument()
  })
})
