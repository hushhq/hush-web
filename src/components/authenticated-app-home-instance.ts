/**
 * Trusted home-instance resolver for `AuthenticatedApp`.
 *
 * Lives in its own file so unit tests can import the pure helper
 * without dragging the full AuthenticatedApp module graph (which pulls
 * in CSS-modules from third-party deps and is too heavy for jsdom).
 *
 * The resolver guards device API calls — `DevicesPanel` issues
 * Bearer-token requests against the URL it returns, so a stored
 * `HOME_INSTANCE_KEY` value that does not correspond to an
 * authenticated/connected instance must NEVER become the request base
 * URL. Fail-closed: return `{ url: null, logPublicKey: null }` and let
 * downstream UI degrade gracefully.
 *
 * CORE-INVARIANTS - Authentication, Vault, and Device Identity +
 * "Instance boundaries must never leak credentials".
 */

export interface TrustedHomeInstance {
  url: string | null
  logPublicKey: string | null
}

interface ConnectedInstanceLike {
  instanceUrl: string
  handshakeData: { log_public_key?: string } | null
}

/**
 * Normalize a URL to its origin. Returns `null` when the input is
 * empty or cannot be parsed.
 */
export function normalizeOrigin(
  url: string | null | undefined
): string | null {
  if (!url) return null
  try {
    return new URL(url).origin
  } catch {
    return null
  }
}

/**
 * Resolve the trusted home-instance URL + transparency log key.
 *
 * `storedHomeOrigin` is the persisted `HOME_INSTANCE_KEY` value (writable
 * client state). `pageOrigin` is the document origin used as a fallback.
 * The resolver normalizes the preferred origin, looks for a matching
 * connected-instance entry, and returns the matched instance's URL +
 * handshake log key. Any mismatch returns `{ url: null, logPublicKey: null }`.
 */
export function resolveTrustedHomeInstance(
  storedHomeOrigin: string | null,
  pageOrigin: string | null,
  connectedInstances: ConnectedInstanceLike[]
): TrustedHomeInstance {
  const preferred =
    normalizeOrigin(storedHomeOrigin) ?? normalizeOrigin(pageOrigin)
  if (!preferred) return { url: null, logPublicKey: null }
  const match = connectedInstances.find(
    (inst) => normalizeOrigin(inst.instanceUrl) === preferred
  )
  if (!match) return { url: null, logPublicKey: null }
  return {
    url: normalizeOrigin(match.instanceUrl) ?? match.instanceUrl,
    logPublicKey: match.handshakeData?.log_public_key ?? null,
  }
}
