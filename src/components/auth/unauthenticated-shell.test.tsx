/**
 * Verifies UnauthenticatedShell routes the active boot state to the
 * right surface: needs_pin → PinUnlockPanel, pin_setup → PinSetupPanel,
 * needs_login → AuthFlow. Force-recovery override forces AuthFlow even
 * when bootState is needs_pin.
 */
import { describe, it, expect, vi, afterEach, beforeAll } from "vitest"
import { render, screen, cleanup } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from "react-router-dom"

beforeAll(() => {
  if (!window.matchMedia) {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: () => ({
        matches: false,
        addEventListener: () => {},
        removeEventListener: () => {},
      }),
    })
  }
})

const useBootController = vi.fn()
const useAuth = vi.fn()
const useAuthInstanceSelection = vi.fn()

vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => useAuth(),
}))
vi.mock("@/hooks/useBootController", () => ({
  useBootController: () => useBootController(),
}))
vi.mock("@/hooks/useAuthInstanceSelection", () => ({
  useAuthInstanceSelection: () => useAuthInstanceSelection(),
}))
vi.mock("@/lib/authInstanceStore", () => ({
  getInstanceDisplayName: (url: string) => url,
}))
vi.mock("@/utils/constants", () => ({ APP_VERSION: "0.0.0-test" }))

import { UnauthenticatedShell } from "./unauthenticated-shell"

const DEFAULT_INSTANCE_STATE = {
  selectedInstanceUrl: "https://a.example.com",
  knownInstances: [{ url: "https://a.example.com" }],
  chooseInstance: vi.fn().mockResolvedValue("https://a.example.com"),
  rememberSelectedInstance: vi.fn().mockResolvedValue("https://a.example.com"),
}

const DEFAULT_AUTH = {
  performRegister: vi.fn(),
  performRecovery: vi.fn(),
  user: null,
  hasSession: false,
  needsPinSetup: false,
  needsUnlock: false,
  hasVault: false,
}

describe("UnauthenticatedShell", () => {
  afterEach(() => {
    cleanup()
    useBootController.mockReset()
    useAuth.mockReset()
    useAuthInstanceSelection.mockReset()
  })

  function setup(bootState: string) {
    useBootController.mockReturnValue({ bootState })
    useAuth.mockReturnValue({
      ...DEFAULT_AUTH,
      unlockVault: vi.fn(),
      setPIN: vi.fn(),
      skipPinSetup: vi.fn(),
    })
    useAuthInstanceSelection.mockReturnValue(DEFAULT_INSTANCE_STATE)
    return render(
      <MemoryRouter>
        <UnauthenticatedShell />
      </MemoryRouter>
    )
  }

  it("renders the PinUnlockPanel when bootState is needs_pin", () => {
    setup("needs_pin")
    expect(screen.getByText(/unlock hush/i)).toBeInTheDocument()
  })

  it("renders the PinSetupPanel when bootState is pin_setup", () => {
    setup("pin_setup")
    expect(screen.getByText(/lock your vault/i)).toBeInTheDocument()
  })

  it("renders the AuthFlow when bootState is needs_login", () => {
    setup("needs_login")
    expect(
      screen.getByRole("button", { name: /^sign in$/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: /^sign up$/i })
    ).toBeInTheDocument()
  })

  it("forces AuthFlow when the user clicks Not you on the unlock panel", async () => {
    setup("needs_pin")

    await userEvent.click(screen.getByRole("button", { name: /not you/i }))

    expect(
      screen.getByRole("button", { name: /^sign in$/i })
    ).toBeInTheDocument()
  })
})
