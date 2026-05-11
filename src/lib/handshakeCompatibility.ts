// Post-handshake compatibility check.
//
// Called after every `getHandshake` (boot + per-instance reconnect). Inspects
// the handshake payload for two breaking conditions:
//
//   1. The server's `min_client_version` is newer than this client's
//      semantic version. The client should not attempt any further protocol
//      work; an Update Required dialog is raised.
//
//   2. The server advertises a `current_mls_ciphersuite` that does not match
//      the client's `CURRENT_MLS_CIPHERSUITE`. Continuing would risk MLS
//      state corruption on either side, so we raise Update Required.
//
// This helper is intentionally synchronous and side-effect-only: it dispatches
// the global `hush:update-required` event. It does not throw — callers are
// boot paths that must keep running long enough for the dialog to surface.

import { CLIENT_VERSION, isClientBelowMinimum } from "./clientVersion";
import { CURRENT_MLS_CIPHERSUITE } from "./mlsCiphersuite";
import { requestUpdate } from "./updateRequired";

interface HandshakeShape {
  min_client_version?: string | null;
  current_mls_ciphersuite?: number | null;
}

/**
 * Inspect a handshake response and dispatch `hush:update-required` when any
 * compatibility constraint fails.
 *
 * Returns the dispatched reason (or null) so callers can chain telemetry.
 *
 * Tolerant of:
 *   - Missing fields (pre-X-Wing server, older deployment) — no event.
 *   - Unparseable `min_client_version` — no event.
 * Failing closed on these would lock users out of older instances during
 * staged rollouts.
 */
export function evaluateHandshakeCompatibility(
  handshake: HandshakeShape | null | undefined,
): "min-client-version" | "ciphersuite-mismatch" | null {
  if (!handshake) return null;

  if (isClientBelowMinimum(handshake.min_client_version)) {
    requestUpdate({
      reason: "min-client-version",
      context: {
        required: handshake.min_client_version,
        running: CLIENT_VERSION,
      },
    });
    return "min-client-version";
  }

  const declared = handshake.current_mls_ciphersuite;
  if (
    declared !== undefined &&
    declared !== null &&
    declared !== CURRENT_MLS_CIPHERSUITE
  ) {
    requestUpdate({
      reason: "ciphersuite-mismatch",
      context: {
        server: declared,
        client: CURRENT_MLS_CIPHERSUITE,
      },
    });
    return "ciphersuite-mismatch";
  }

  return null;
}
