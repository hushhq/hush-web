/**
 * BIP39 cryptographic identity module.
 *
 * Provides mnemonic generation, deterministic Ed25519 keypair derivation,
 * mnemonic validation, challenge signing, and wordlist access for autocomplete.
 *
 * Uses audited libraries:
 *   - @scure/bip39 by Paul Miller (MIT)
 *   - @noble/ed25519 by Paul Miller (MIT)
 *
 * Key design:
 *   - 12-word mnemonic (128 bits of entropy, BIP39 standard)
 *   - Seed = BIP39 seed (64 bytes); private key seed = first 32 bytes
 *   - Public key derived deterministically from private key seed via Ed25519
 *   - No passphrase extension (BIP39 passphrase = "", consistent identity recovery)
 */
import { generateMnemonic, mnemonicToSeedSync, validateMnemonic } from '@scure/bip39';
import { wordlist as englishWordlist } from '@scure/bip39/wordlists/english.js';
import * as ed from '@noble/ed25519';
import { encode as cborEncode } from 'cborg';

// BIP39 entropy for 12 words (128 bits).
const ENTROPY_BITS = 128;

/**
 * Generates a random 12-word BIP39 mnemonic from the English wordlist.
 *
 * @returns {string} Space-separated 12-word mnemonic phrase.
 */
export function generateIdentityMnemonic() {
  return generateMnemonic(englishWordlist, ENTROPY_BITS);
}

/**
 * Derives a deterministic Ed25519 keypair from a BIP39 mnemonic.
 *
 * The BIP39 seed (64 bytes, no passphrase) is sliced to 32 bytes to serve
 * as the Ed25519 private key seed. The same mnemonic always produces the
 * same keypair, enabling account recovery from the 12 words alone.
 *
 * @param {string} mnemonic - Space-separated 12-word BIP39 mnemonic.
 * @returns {Promise<{ privateKey: Uint8Array, publicKey: Uint8Array }>}
 *   privateKey: 32-byte Ed25519 seed (secret, never leaves device)
 *   publicKey: 32-byte Ed25519 public key (shared with server)
 */
export async function mnemonicToIdentityKey(mnemonic) {
  const seed = mnemonicToSeedSync(mnemonic);
  const privateKey = seed.slice(0, 32);
  const publicKey = await ed.getPublicKeyAsync(privateKey);
  return { privateKey, publicKey };
}

/**
 * Validates a BIP39 mnemonic against the English wordlist.
 *
 * @param {string} mnemonic - Mnemonic phrase to validate.
 * @returns {boolean} True if the mnemonic is a valid BIP39 phrase.
 */
export function isMnemonicValid(mnemonic) {
  return validateMnemonic(mnemonic, englishWordlist);
}

/**
 * Signs a challenge nonce with an Ed25519 private key (v1 challenge).
 *
 * Used in the legacy BIP39 challenge-response flow where the signed
 * message is the raw nonce bytes. This protocol is vulnerable to a
 * cross-instance signing oracle: a malicious instance can relay a real
 * nonce from the victim's home instance and obtain a signature it can
 * redeem there. New code MUST prefer {@link signAuthChallengeV2}, which
 * binds the signature to the API origin being authenticated to.
 *
 * Retained for backward compatibility with code paths that have not
 * been migrated yet; do not introduce new callers.
 *
 * @param {Uint8Array} nonce - Challenge nonce to sign (typically 32 bytes).
 * @param {Uint8Array} privateKey - 32-byte Ed25519 private key seed.
 * @returns {Promise<Uint8Array>} 64-byte Ed25519 signature.
 */
export async function signChallenge(nonce, privateKey) {
  return ed.signAsync(nonce, privateKey);
}

/**
 * Domain-separation tag for the v2 auth challenge signature payload.
 * Must stay byte-identical to the server's `auth.ChallengeV2Header`
 * (Go: `internal/auth/challenge.go`).
 */
export const AUTH_CHALLENGE_V2_HEADER = 'HUSH-AUTH-CHALLENGE-V2';

/**
 * Builds the canonical UTF-8 byte encoding of the v2 auth-challenge
 * signature payload:
 *
 *     HUSH-AUTH-CHALLENGE-V2\naudience=<origin>\nnonce=<hex>
 *
 * The audience is expected to already be in normalized origin form
 * (`scheme://host[:port]`, no path, no trailing slash); this helper
 * does NOT re-normalize so callers can pin the exact bytes that get
 * signed. The encoding is the contract that lets the server reproduce
 * the same bytes during verification.
 *
 * @param {string} nonceHex - Hex nonce returned by `/api/auth/challenge`.
 * @param {string} audience - Normalized canonical API origin.
 * @returns {Uint8Array} UTF-8 bytes of the v2 payload.
 * @throws {TypeError} if either argument is missing or empty.
 */
export function buildAuthChallengeV2Payload(nonceHex, audience) {
  if (typeof nonceHex !== 'string' || nonceHex.length === 0) {
    throw new TypeError('buildAuthChallengeV2Payload: nonceHex required');
  }
  if (typeof audience !== 'string' || audience.length === 0) {
    throw new TypeError('buildAuthChallengeV2Payload: audience required');
  }
  const text = `${AUTH_CHALLENGE_V2_HEADER}\naudience=${audience}\nnonce=${nonceHex}`;
  return new TextEncoder().encode(text);
}

/**
 * Signs the v2 auth-challenge payload with an Ed25519 private key.
 *
 * Use in place of {@link signChallenge} for any new login or
 * device-link verification flow. Binding the signature to the API
 * origin via {@link buildAuthChallengeV2Payload} prevents a malicious
 * instance from relaying signatures captured for one origin into
 * `/api/auth/verify` requests against another origin.
 *
 * @param {string} nonceHex - Hex nonce returned by `/api/auth/challenge`.
 * @param {string} audience - Normalized canonical API origin.
 * @param {Uint8Array} privateKey - 32-byte Ed25519 private key seed.
 * @returns {Promise<Uint8Array>} 64-byte Ed25519 signature.
 */
export async function signAuthChallengeV2(nonceHex, audience, privateKey) {
  const payload = buildAuthChallengeV2Payload(nonceHex, audience);
  return ed.signAsync(payload, privateKey);
}

/**
 * Returns the full BIP39 English wordlist (2048 words).
 *
 * Intended for use in autocomplete/word-suggestion UI during mnemonic entry.
 *
 * @returns {readonly string[]} Array of 2048 BIP39 English words.
 */
export function getEnglishWordlist() {
  return englishWordlist;
}

/**
 * Signs a transparency log entry with the Ed25519 private key.
 *
 * The payload is CBOR-encoded using integer map keys (1-4) matching the
 * server's fxamacker/cbor CoreDetEncOptions with keyasint struct tags.
 * Both sides use RFC 8949 Core Deterministic Encoding, which sorts integer
 * keys numerically - this cross-platform consistency ensures leaf hashes match.
 *
 * Field mapping:
 *   1 → operationType (text string)
 *   2 → userPubKey    (bstr, 32 bytes)
 *   3 → subjectKey    (bstr, 32 bytes, or null)
 *   4 → timestamp     (integer, Unix seconds)
 *
 * @param {Uint8Array} privateKey     - 32-byte Ed25519 private key seed.
 * @param {string}     operationType  - One of: register, key_update, device_add,
 *                                      device_revoke, recovery, key_revoke.
 * @param {Uint8Array} userPubKey     - 32-byte Ed25519 root public key.
 * @param {Uint8Array|null} subjectKey - 32-byte subject device key, or null.
 * @param {number}     timestamp      - Unix seconds (integer).
 * @returns {Promise<{ cborBytes: Uint8Array, signature: Uint8Array }>}
 */
export async function signTransparencyEntry(privateKey, operationType, userPubKey, subjectKey, timestamp) {
  // Build a Map with integer keys so cborg emits CBOR map with integer keys,
  // matching fxamacker/cbor keyasint output (RFC 8949 §4.2.1 sorted by key).
  const payload = new Map([
    [1, operationType],
    [2, userPubKey],
    [3, subjectKey ?? null],
    [4, timestamp],
  ]);
  const cborBytes = cborEncode(payload);
  const signature = await ed.signAsync(cborBytes, privateKey);
  return { cborBytes, signature };
}
