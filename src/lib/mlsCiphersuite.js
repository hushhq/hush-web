// MLS ciphersuite constants and helpers shared by every API/WS payload
// builder that writes MLS state to the server.
//
// The active ciphersuite must match what `@gethush/hush-crypto@0.2.2` produces
// and what the Go server stamps via `version.CurrentMLSCiphersuite`. Any drift
// here is a protocol break, so the constant lives in one place and every
// caller imports it.

/**
 * Current OpenMLS ciphersuite the client uses to produce KeyPackages,
 * GroupInfo, Commits, and Welcomes.
 *
 * Value: 0x004D / 77 — `MLS_256_XWING_CHACHA20POLY1305_SHA256_Ed25519`.
 * Registered in IANA's MLS ciphersuites registry (post-quantum hybrid KEM);
 * NOT one of the base RFC 9420 ciphersuites.
 *
 * @type {number}
 */
export const CURRENT_MLS_CIPHERSUITE = 77;

/**
 * Error thrown when the server's advertised MLS ciphersuite (via
 * `/api/handshake`) does not match `CURRENT_MLS_CIPHERSUITE`. Throwing this
 * before any MLS state is uploaded prevents a stale client from poisoning the
 * server's current-suite tables with bytes generated under a different suite.
 */
export class MLSCiphersuiteMismatchError extends Error {
  /**
   * @param {number|null|undefined} serverCiphersuite
   */
  constructor(serverCiphersuite) {
    super(
      `Server MLS ciphersuite (${serverCiphersuite ?? "unknown"}) does not match this client (${CURRENT_MLS_CIPHERSUITE}). ` +
        "Update the client before uploading MLS state.",
    );
    this.name = "MLSCiphersuiteMismatchError";
    /** @type {number|null|undefined} */
    this.serverCiphersuite = serverCiphersuite;
    /** @type {number} */
    this.clientCiphersuite = CURRENT_MLS_CIPHERSUITE;
  }
}

/**
 * Throw `MLSCiphersuiteMismatchError` when the handshake response advertises a
 * ciphersuite different from `CURRENT_MLS_CIPHERSUITE`. A missing or null
 * `current_mls_ciphersuite` field is treated as a pre-X-Wing server and
 * tolerated: older servers do not advertise the field at all and rejecting
 * them outright would lock self-hosters out of upgrade paths.
 *
 * Callers should invoke this on the same handshake response they already use
 * for version negotiation, before any MLS write goes out.
 *
 * @param {{ current_mls_ciphersuite?: number|null }} handshake
 */
export function assertHandshakeMLSCiphersuiteMatches(handshake) {
  if (!handshake) return;
  const declared = handshake.current_mls_ciphersuite;
  if (declared === undefined || declared === null) {
    return;
  }
  if (declared !== CURRENT_MLS_CIPHERSUITE) {
    throw new MLSCiphersuiteMismatchError(declared);
  }
}
