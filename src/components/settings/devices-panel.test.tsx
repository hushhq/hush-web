/**
 * DevicesPanel coverage:
 *  - empty + populated list rendering
 *  - "This device" badge resolves via getDeviceId()
 *  - CTA navigates to /link-device (NOT /link-device?mode=new — this
 *    panel runs on an already-authenticated device approving a peer)
 *  - revoke confirm dialog triggers revokeDeviceKey + post-op
 *    transparency reverify when home log public key is provided
 *  - revoke without home log key still succeeds; transparency verify
 *    is skipped (logged) rather than throwing
 */
import { describe, it, expect, vi, afterEach, beforeAll } from "vitest"
import {
  render,
  screen,
  cleanup,
  waitFor,
  within,
} from "@testing-library/react"
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

const navigateMock = vi.fn()
vi.mock("react-router-dom", () => ({
  useNavigate: () => navigateMock,
}))

const listDeviceKeys = vi.fn()
const revokeDeviceKey = vi.fn()
vi.mock("@/lib/api", () => ({
  listDeviceKeys: (...args: unknown[]) => listDeviceKeys(...args),
  revokeDeviceKey: (...args: unknown[]) => revokeDeviceKey(...args),
}))

const getDeviceId = vi.fn(() => "device-current")
vi.mock("@/hooks/useAuth", () => ({
  getDeviceId: () => getDeviceId(),
}))

const setTransparencyError = vi.fn()
const identityKeyRef = { current: { publicKey: new Uint8Array([1, 2, 3]) } }
const authState: { token: string | null } = { token: "tok" }
vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({
    token: authState.token,
    identityKeyRef,
    setTransparencyError,
  }),
}))

vi.mock("@/lib/deviceLabel", () => ({
  getReadableDeviceLabel: () => "Chrome on macOS",
}))

vi.mock("@/lib/identityVault", () => ({
  bytesToHex: () => "deadbeef",
}))

const verifyOwnKey = vi.fn().mockResolvedValue({ ok: true })
vi.mock("@/lib/transparencyVerifier", () => ({
  TransparencyVerifier: function MockVerifier() {
    return { verifyOwnKey }
  },
}))

import { DevicesPanel } from "./devices-panel"

describe("DevicesPanel", () => {
  afterEach(() => {
    cleanup()
    navigateMock.mockReset()
    listDeviceKeys.mockReset()
    revokeDeviceKey.mockReset()
    setTransparencyError.mockReset()
    verifyOwnKey.mockClear()
    verifyOwnKey.mockResolvedValue({ ok: true })
    getDeviceId.mockReturnValue("device-current")
    authState.token = "tok"
  })

  it("renders the legacy description copy verbatim", () => {
    listDeviceKeys.mockResolvedValueOnce([])

    render(<DevicesPanel />)

    expect(
      screen.getByText(/On the new device, open/i)
    ).toBeInTheDocument()
    expect(
      screen.getByText("Link to existing device")
    ).toBeInTheDocument()
  })

  it("shows an empty state when the API returns no devices", async () => {
    listDeviceKeys.mockResolvedValueOnce([])

    render(<DevicesPanel />)

    await waitFor(() =>
      expect(screen.getByText(/no devices registered/i)).toBeInTheDocument()
    )
  })

  it("lists devices and tags the current one with This device", async () => {
    listDeviceKeys.mockResolvedValueOnce([
      {
        id: "row-1",
        deviceId: "device-current",
        label: null,
        certifiedAt: "2026-01-01T00:00:00Z",
        lastSeen: new Date().toISOString(),
      },
      {
        id: "row-2",
        deviceId: "device-other",
        label: "iPhone",
        certifiedAt: "2026-02-01T00:00:00Z",
        lastSeen: new Date().toISOString(),
      },
    ])

    render(<DevicesPanel />)

    await waitFor(() =>
      expect(screen.getByText(/this device/i)).toBeInTheDocument()
    )
    expect(screen.getByText("Chrome on macOS")).toBeInTheDocument()
    expect(screen.getByText("iPhone")).toBeInTheDocument()
  })

  it("shows a short readable fallback for unlabeled non-current devices", async () => {
    listDeviceKeys.mockResolvedValueOnce([
      {
        id: "row-2",
        deviceId: "abcdef0123456789ffffffffffffffff",
        label: null,
        certifiedAt: "2026-02-01T00:00:00Z",
        lastSeen: new Date().toISOString(),
      },
    ])

    render(<DevicesPanel />)

    await waitFor(() =>
      expect(
        screen.getByText("Unknown device (abcdef01)")
      ).toBeInTheDocument()
    )
    // Full hash must not be on screen — that was the readability bug.
    expect(
      screen.queryByText("abcdef0123456789ffffffffffffffff")
    ).not.toBeInTheDocument()
  })

  it("CTA navigates to /link-device without the mode=new query", async () => {
    listDeviceKeys.mockResolvedValueOnce([])

    render(<DevicesPanel />)

    const u = userEvent.setup()
    await u.click(
      await screen.findByRole("button", { name: /link a new device/i })
    )

    expect(navigateMock).toHaveBeenCalledTimes(1)
    expect(navigateMock).toHaveBeenCalledWith("/link-device")
  })

  it("revoke flow calls revokeDeviceKey + transparency verify", async () => {
    listDeviceKeys.mockResolvedValueOnce([
      {
        id: "row-1",
        deviceId: "device-other",
        label: "iPhone",
        certifiedAt: "2026-02-01T00:00:00Z",
        lastSeen: new Date().toISOString(),
      },
    ])
    listDeviceKeys.mockResolvedValueOnce([])
    revokeDeviceKey.mockResolvedValue(undefined)

    render(
      <DevicesPanel
        homeInstanceUrl="https://i.example.com"
        homeLogPublicKey="abcd"
      />
    )

    const u = userEvent.setup()
    const revokeBtn = await screen.findByRole("button", { name: /^revoke$/i })
    await u.click(revokeBtn)

    const dialog = await screen.findByRole("alertdialog")
    await u.click(
      within(dialog).getByRole("button", { name: /revoke device/i })
    )

    await waitFor(() =>
      expect(revokeDeviceKey).toHaveBeenCalledWith(
        "tok",
        "device-other",
        "https://i.example.com"
      )
    )
    expect(listDeviceKeys).toHaveBeenNthCalledWith(
      1,
      "tok",
      "https://i.example.com"
    )
    expect(verifyOwnKey).toHaveBeenCalledTimes(1)
    expect(setTransparencyError).not.toHaveBeenCalled()
    await waitFor(() =>
      expect(listDeviceKeys).toHaveBeenCalledTimes(2)
    )
  })

  it("skips transparency verify silently when no home log key is provided", async () => {
    listDeviceKeys.mockResolvedValueOnce([
      {
        id: "row-1",
        deviceId: "device-other",
        label: "iPhone",
        certifiedAt: "2026-02-01T00:00:00Z",
        lastSeen: new Date().toISOString(),
      },
    ])
    listDeviceKeys.mockResolvedValueOnce([])
    revokeDeviceKey.mockResolvedValue(undefined)

    render(<DevicesPanel />)

    const u = userEvent.setup()
    await u.click(await screen.findByRole("button", { name: /^revoke$/i }))

    const dialog = await screen.findByRole("alertdialog")
    await u.click(
      within(dialog).getByRole("button", { name: /revoke device/i })
    )

    await waitFor(() =>
      expect(revokeDeviceKey).toHaveBeenCalledTimes(1)
    )
    expect(revokeDeviceKey).toHaveBeenCalledWith(
      "tok",
      "device-other",
      ""
    )
    expect(verifyOwnKey).not.toHaveBeenCalled()
  })

  it("clears the loading state when token is unavailable", async () => {
    authState.token = null

    render(<DevicesPanel />)

    await waitFor(() =>
      expect(
        screen.queryByText(/loading devices/i)
      ).not.toBeInTheDocument()
    )
    expect(listDeviceKeys).not.toHaveBeenCalled()
  })
})
