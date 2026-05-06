/**
 * Verifies useTransparencyVerification triggers verifyOwnKey on
 * mount, on key-change broadcast, and when log_public_key arrives
 * after the initial render.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"

const verifyOwnKey = vi.fn()

vi.mock("@/lib/transparencyVerifier", () => ({
  TransparencyVerifier: function MockTransparencyVerifier() {
    return { verifyOwnKey }
  },
}))

vi.mock("@/lib/identityVault", () => ({
  bytesToHex: (bytes: Uint8Array) =>
    Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join(""),
}))

import { useTransparencyVerification } from "./useTransparencyVerification"

interface FakeWs {
  on: ReturnType<typeof vi.fn>
  off: ReturnType<typeof vi.fn>
  emit: (event: string, payload: unknown) => void
}

function makeWs(): FakeWs {
  const handlers = new Map<string, (data: unknown) => void>()
  return {
    on: vi.fn((event: string, h: (d: unknown) => void) => {
      handlers.set(event, h)
    }),
    off: vi.fn((event: string) => {
      handlers.delete(event)
    }),
    emit(event, payload) {
      handlers.get(event)?.(payload)
    },
  }
}

const PUB_KEY = new Uint8Array([1, 2, 3, 4])

describe("useTransparencyVerification", () => {
  beforeEach(() => {
    verifyOwnKey.mockReset().mockResolvedValue({ ok: true })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it("verifies on initial mount when all inputs are present", async () => {
    const ws = makeWs()
    renderHook(() =>
      useTransparencyVerification({
        wsClient: ws as unknown as Parameters<
          typeof useTransparencyVerification
        >[0]["wsClient"],
        instanceUrl: "https://i.example.com",
        token: "tok",
        identityPublicKey: PUB_KEY,
        logPublicKeyHex: "abcdef",
        onVerificationFailure: vi.fn(),
      }),
    )
    await waitFor(() => {
      expect(verifyOwnKey).toHaveBeenCalledTimes(1)
    })
  })

  // Regression test for review finding H3 — log_public_key arriving
  // after the first render must still trigger verification.
  it("verifies once log_public_key arrives after initial render", async () => {
    const ws = makeWs()
    type Args = Parameters<typeof useTransparencyVerification>[0]
    const { rerender } = renderHook(
      (args: Args) => useTransparencyVerification(args),
      {
        initialProps: {
          wsClient: ws as unknown as Args["wsClient"],
          instanceUrl: "https://i.example.com",
          token: "tok",
          identityPublicKey: PUB_KEY,
          logPublicKeyHex: null as string | null,
          onVerificationFailure: vi.fn(),
        } satisfies Args,
      },
    )

    expect(verifyOwnKey).not.toHaveBeenCalled()

    rerender({
      wsClient: ws as unknown as Args["wsClient"],
      instanceUrl: "https://i.example.com",
      token: "tok",
      identityPublicKey: PUB_KEY,
      logPublicKeyHex: "abcdef",
      onVerificationFailure: vi.fn(),
    } satisfies Args)

    await waitFor(() => {
      expect(verifyOwnKey).toHaveBeenCalledTimes(1)
    })
  })

  it("does not verify when log_public_key is null", async () => {
    const ws = makeWs()
    renderHook(() =>
      useTransparencyVerification({
        wsClient: ws as unknown as Parameters<
          typeof useTransparencyVerification
        >[0]["wsClient"],
        instanceUrl: "https://i.example.com",
        token: "tok",
        identityPublicKey: PUB_KEY,
        logPublicKeyHex: null,
        onVerificationFailure: vi.fn(),
      }),
    )
    await new Promise((r) => setTimeout(r, 0))
    expect(verifyOwnKey).not.toHaveBeenCalled()
  })

  it("re-verifies on transparency.key_change", async () => {
    const ws = makeWs()
    renderHook(() =>
      useTransparencyVerification({
        wsClient: ws as unknown as Parameters<
          typeof useTransparencyVerification
        >[0]["wsClient"],
        instanceUrl: "https://i.example.com",
        token: "tok",
        identityPublicKey: PUB_KEY,
        logPublicKeyHex: "abcdef",
        onVerificationFailure: vi.fn(),
      }),
    )

    await waitFor(() => expect(verifyOwnKey).toHaveBeenCalledTimes(1))
    ws.emit("transparency.key_change", {
      type: "transparency.key_change",
      operation: "change",
    })
    await waitFor(() => expect(verifyOwnKey).toHaveBeenCalledTimes(2))
  })

  it("surfaces failure via onVerificationFailure when verifyOwnKey returns ok=false", async () => {
    verifyOwnKey.mockResolvedValueOnce({
      ok: false,
      error: "Mismatch detected",
    })
    const onFailure = vi.fn()
    const ws = makeWs()
    renderHook(() =>
      useTransparencyVerification({
        wsClient: ws as unknown as Parameters<
          typeof useTransparencyVerification
        >[0]["wsClient"],
        instanceUrl: "https://i.example.com",
        token: "tok",
        identityPublicKey: PUB_KEY,
        logPublicKeyHex: "abcdef",
        onVerificationFailure: onFailure,
      }),
    )
    await waitFor(() => {
      expect(onFailure).toHaveBeenCalledWith("Mismatch detected")
    })
  })
})
