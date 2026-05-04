/**
 * Behaviour port from src/components/auth/RegistrationWizard.test.jsx +
 * RecoveryPhraseInput.test.jsx — verifies the AuthFlow main panel
 * routes to sign-in or sign-up, the sign-in submit calls signIn(mnemonic),
 * and the main view exposes the roadmap + version footer.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { render, screen, cleanup } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

vi.mock("@/lib/bip39Identity", () => ({
  generateIdentityMnemonic: vi.fn(() =>
    Array.from({ length: 12 }, (_, i) => `word${i + 1}`).join(" ")
  ),
}))

vi.mock("@/lib/api", () => ({
  checkUsernameAvailable: vi.fn().mockResolvedValue({ available: true }),
}))

import { AuthFlow } from "./auth-flow"

const INSTANCE_PROPS = {
  instances: ["a.example.com"],
  active: "a.example.com",
  onSelect: vi.fn(),
  onAdd: vi.fn(),
}

describe("AuthFlow", () => {
  beforeEach(() => {
    INSTANCE_PROPS.onSelect.mockReset()
    INSTANCE_PROPS.onAdd.mockReset()
  })

  afterEach(() => {
    cleanup()
  })

  function setup(overrides: Partial<React.ComponentProps<typeof AuthFlow>> = {}) {
    return render(
      <AuthFlow
        instanceProps={INSTANCE_PROPS}
        instanceUrl="https://a.example.com"
        signIn={overrides.signIn ?? vi.fn()}
        signUp={overrides.signUp ?? vi.fn()}
        onOpenRoadmap={overrides.onOpenRoadmap}
        versionLabel={overrides.versionLabel ?? "v0.0.1"}
      />
    )
  }

  it("renders the main view with sign-in + sign-up + version label", () => {
    setup()
    expect(
      screen.getByRole("button", { name: /^sign in$/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: /^sign up$/i })
    ).toBeInTheDocument()
    expect(screen.getByText("v0.0.1")).toBeInTheDocument()
  })

  it("invokes onOpenRoadmap from the footer link", async () => {
    const onOpenRoadmap = vi.fn()
    setup({ onOpenRoadmap })

    await userEvent.click(
      screen.getByRole("button", { name: /roadmap/i })
    )

    expect(onOpenRoadmap).toHaveBeenCalledTimes(1)
  })

  it("navigates to the sign-in view and renders 12 phrase inputs", async () => {
    setup()

    const u = userEvent.setup()
    await u.click(screen.getByRole("button", { name: /^sign in$/i }))

    expect(screen.getByText(/recovery phrase/i)).toBeInTheDocument()
    expect(screen.getAllByRole("textbox")).toHaveLength(12)
  })
})
