import * as React from "react"

import { TransparencyVerifier } from "@/lib/transparencyVerifier"
import { bytesToHex } from "@/lib/identityVault"

interface WsClientLike {
  on: (event: string, handler: (msg: unknown) => void) => void
  off?: (event: string, handler: (msg: unknown) => void) => void
}

interface VerifyResult {
  ok: boolean
  error?: string
  warning?: string
}

interface UseTransparencyVerificationArgs {
  wsClient: WsClientLike | null | undefined
  instanceUrl: string | null
  /** JWT for authenticated transparency endpoint calls. Null when
   *  the user is not signed in to this instance yet. */
  token: string | null
  /** Local identity public key. Provided as bytes — the hook hex
   *  encodes for the verifier on demand so the caller doesn't have
   *  to manage the conversion. */
  identityPublicKey: Uint8Array | null
  /** Transparency log public key (hex) from the instance handshake.
   *  Verification is skipped when missing because the instance does
   *  not run a transparency log. */
  logPublicKeyHex: string | null
  /** Surface a verification failure. The caller decides how to
   *  display the warning (the existing AuthContext exposes
   *  `setTransparencyError` for this exact purpose). */
  onVerificationFailure: (message: string) => void
}

const PERIODIC_INTERVAL_MS = 5 * 60 * 1000

/**
 * Verifies the local user's identity key inclusion in the
 * transparency log.
 *
 * Triggers:
 *   - mount / inputs change (initial check once everything is
 *     non-null)
 *   - WS `open` reconnect — server-side state may have moved
 *     while we were offline
 *   - `transparency.key_change` broadcast — log mutation
 *     potentially involving our key
 *   - low-frequency periodic fallback (5 minutes) so a long-lived
 *     session that misses a broadcast still verifies eventually
 *
 * `onVerificationFailure` is invoked with a sticky human-readable
 * message; the caller is responsible for rendering it as a
 * top-level alert. We never silently swallow a failure — this is a
 * security signal.
 */
export function useTransparencyVerification({
  wsClient,
  instanceUrl,
  token,
  identityPublicKey,
  logPublicKeyHex,
  onVerificationFailure,
}: UseTransparencyVerificationArgs): void {
  const onFailureRef = React.useRef(onVerificationFailure)
  onFailureRef.current = onVerificationFailure

  const verifierRef = React.useRef<TransparencyVerifier | null>(null)
  React.useEffect(() => {
    if (!instanceUrl || !logPublicKeyHex) {
      verifierRef.current = null
      return
    }
    verifierRef.current = new TransparencyVerifier(
      instanceUrl,
      logPublicKeyHex,
    )
  }, [instanceUrl, logPublicKeyHex])

  const runVerification = React.useCallback(async () => {
    const verifier = verifierRef.current
    if (!verifier) return
    if (!token || !identityPublicKey) return
    const pubKeyHex = bytesToHex(identityPublicKey)
    try {
      const result = (await verifier.verifyOwnKey(
        pubKeyHex,
        token,
      )) as VerifyResult
      if (!result.ok) {
        const message =
          result.error ||
          "Transparency log mismatch detected. Your account may be compromised."
        onFailureRef.current?.(message)
      }
    } catch (err) {
      console.warn("[transparency] reverify threw", err)
      // Network error — do not panic the user, but log so the next
      // event-driven check can confirm or deny.
    }
  }, [token, identityPublicKey])

  // Fire once when inputs become available.
  React.useEffect(() => {
    if (!verifierRef.current) return
    if (!token || !identityPublicKey) return
    void runVerification()
  }, [runVerification, token, identityPublicKey])

  // Re-verify on reconnect and on key-change broadcast.
  React.useEffect(() => {
    if (!wsClient) return
    const onOpen = () => {
      void runVerification()
    }
    const onKeyChange = (raw: unknown) => {
      const data = raw as { type?: string }
      if (data?.type !== "transparency.key_change") return
      void runVerification()
    }
    wsClient.on("open", onOpen)
    wsClient.on("transparency.key_change", onKeyChange)
    return () => {
      wsClient.off?.("open", onOpen)
      wsClient.off?.("transparency.key_change", onKeyChange)
    }
  }, [wsClient, runVerification])

  // Periodic fallback so a session that missed a broadcast (offline
  // window, listener gap, rare push drop) still re-verifies.
  React.useEffect(() => {
    if (!verifierRef.current) return
    if (!token || !identityPublicKey) return
    const id = setInterval(() => {
      void runVerification()
    }, PERIODIC_INTERVAL_MS)
    return () => clearInterval(id)
  }, [runVerification, token, identityPublicKey])
}
