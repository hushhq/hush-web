/**
 * Behaviour port from src/components/auth/PinSetupModal.test.jsx —
 * verifies tab switch (PIN ↔ passphrase), submit calls setPIN with the
 * confirmed value, mismatch error blocks submission, and the skip path
 * invokes useAuth().skipPinSetup.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { render, screen, cleanup } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

const setPIN = vi.fn<(pin: string) => Promise<void>>()
const skipPinSetup = vi.fn()

vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({ setPIN, skipPinSetup }),
}))

import { PinSetupPanel } from "./pin-setup-panel"

describe("PinSetupPanel", () => {
  beforeEach(() => {
    setPIN.mockReset()
    skipPinSetup.mockReset()
  })

  afterEach(() => {
    cleanup()
  })

  it("submits the PIN when both fields match", async () => {
    setPIN.mockResolvedValue(undefined)
    const u = userEvent.setup()
    render(<PinSetupPanel />)

    await u.type(screen.getByPlaceholderText("Enter a PIN"), "1234")
    await u.type(screen.getByPlaceholderText("Repeat your PIN"), "1234")
    await u.click(screen.getByRole("button", { name: /^set pin$/i }))

    expect(setPIN).toHaveBeenCalledWith("1234")
  })

  it("blocks submit when the confirm field does not match", async () => {
    const u = userEvent.setup()
    render(<PinSetupPanel />)

    await u.type(screen.getByPlaceholderText("Enter a PIN"), "1234")
    await u.type(screen.getByPlaceholderText("Repeat your PIN"), "9999")

    expect(screen.getByText(/pins do not match/i)).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: /^set pin$/i })
    ).toBeDisabled()
  })

  it("switches to passphrase mode when the tab is clicked", async () => {
    const u = userEvent.setup()
    render(<PinSetupPanel />)

    await u.click(screen.getByRole("tab", { name: /use a passphrase/i }))

    expect(screen.getByPlaceholderText("Enter a passphrase")).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: /^set passphrase$/i })
    ).toBeInTheDocument()
  })

  it("calls skipPinSetup when the skip button is clicked", async () => {
    const u = userEvent.setup()
    render(<PinSetupPanel />)

    await u.click(screen.getByRole("button", { name: /skip for now/i }))

    expect(skipPinSetup).toHaveBeenCalledTimes(1)
  })

  it("shows the strength bar once the passphrase has at least 2 characters", async () => {
    const u = userEvent.setup()
    render(<PinSetupPanel />)

    await u.click(screen.getByRole("tab", { name: /use a passphrase/i }))
    await u.type(screen.getByPlaceholderText("Enter a passphrase"), "shortpw")

    expect(screen.getByText(/weak/i)).toBeInTheDocument()
  })
})
