/**
 * Pure helpers for the chunked device-link transfer plane.
 *
 * No network I/O lives here; everything is in-memory crypto and manifest
 * arithmetic. The transport layer (`linkArchiveTransport.js`) consumes
 * these helpers to drive uploads from the OLD device and downloads on
 * the NEW device.
 *
 * Constants must stay in lockstep with `internal/api/link_archives.go`.
 */
import { bytesToBase64, base64ToBytes, importSessionPublicKey } from './deviceLinking';
import { gzipBytes, gunzipBytes } from './compression';

export const LINK_ARCHIVE_CHUNK_SIZE = 4 * 1024 * 1024; // 4 MiB plaintext slice
export const LINK_ARCHIVE_MAX_CHUNKS = 64;
export const LINK_ARCHIVE_MAX_BYTES = LINK_ARCHIVE_MAX_CHUNKS * LINK_ARCHIVE_CHUNK_SIZE;
export const LINK_ARCHIVE_NONCE_BASE_LEN = 8;

const AES_GCM_TAG_BYTES = 16;
const ARCHIVE_VERSION = 3;

// ---------------------------------------------------------------------------
// Hash helpers
// ---------------------------------------------------------------------------

/**
 * SHA-256 of the input bytes returned as a Uint8Array (32 bytes).
 *
 * @param {Uint8Array} bytes
 * @returns {Promise<Uint8Array>}
 */
export async function sha256(bytes) {
  const buffer = await crypto.subtle.digest('SHA-256', bytes);
  return new Uint8Array(buffer);
}

/**
 * Computes the manifest hash from an ordered list of per-chunk SHA-256 digests.
 * The server computes the identical SHA-256 over the same concatenation at
 * finalize time; binding the manifest hash into the small relay envelope means
 * a single root hash anchors all chunks.
 *
 * @param {Uint8Array[]} chunkHashes
 * @returns {Promise<Uint8Array>}
 */
export async function computeManifestHash(chunkHashes) {
  let totalLen = 0;
  for (const hash of chunkHashes) {
    if (hash.byteLength !== 32) {
      throw new Error('[linkArchive] chunk hash must be 32 bytes');
    }
    totalLen += hash.byteLength;
  }
  const combined = new Uint8Array(totalLen);
  let offset = 0;
  for (const hash of chunkHashes) {
    combined.set(hash, offset);
    offset += hash.byteLength;
  }
  return sha256(combined);
}

// ---------------------------------------------------------------------------
// Plaintext archive shape
// ---------------------------------------------------------------------------

/**
 * Builds the gzipped plaintext archive that will be split, encrypted, and
 * uploaded chunk-by-chunk. The shape is decoded back identically on the new
 * device after reassembly + decryption.
 *
 * @param {{ historySnapshot: object|null, guildMetadataKeySnapshot: object|null, transcriptBlob: Uint8Array|null }} contents
 * @returns {Promise<Uint8Array>}
 */
export async function buildArchivePlaintext({ historySnapshot, guildMetadataKeySnapshot, transcriptBlob }) {
  const payload = {
    v: ARCHIVE_VERSION,
    historySnapshot: historySnapshot ?? null,
    guildMetadataKeySnapshot: guildMetadataKeySnapshot ?? null,
    transcriptBlob: transcriptBlob ? bytesToBase64(transcriptBlob) : null,
  };
  const json = new TextEncoder().encode(JSON.stringify(payload));
  return gzipBytes(json);
}

/**
 * Reverses {@link buildArchivePlaintext}.
 *
 * @param {Uint8Array} plaintext
 * @returns {Promise<{ historySnapshot: object|null, guildMetadataKeySnapshot: object|null, transcriptBlob: Uint8Array|null }>}
 */
export async function parseArchivePlaintext(plaintext) {
  const json = await gunzipBytes(plaintext);
  const text = new TextDecoder().decode(json);
  const parsed = JSON.parse(text);
  return {
    historySnapshot: parsed.historySnapshot ?? null,
    guildMetadataKeySnapshot: parsed.guildMetadataKeySnapshot ?? null,
    transcriptBlob: parsed.transcriptBlob ? base64ToBytes(parsed.transcriptBlob) : null,
  };
}

// ---------------------------------------------------------------------------
// Chunk slicing / assembly
// ---------------------------------------------------------------------------

/**
 * Splits the gzipped plaintext archive into fixed-size slices. Last slice may
 * be smaller than `chunkSize`; all other slices match it exactly. The slice
 * count is bound by {@link LINK_ARCHIVE_MAX_CHUNKS}.
 *
 * @param {Uint8Array} plaintext
 * @param {number} [chunkSize=LINK_ARCHIVE_CHUNK_SIZE]
 * @returns {Uint8Array[]}
 */
export function splitArchive(plaintext, chunkSize = LINK_ARCHIVE_CHUNK_SIZE) {
  if (!(plaintext instanceof Uint8Array) || plaintext.byteLength === 0) {
    throw new Error('[linkArchive] plaintext archive must be a non-empty Uint8Array');
  }
  if (chunkSize <= 0) {
    throw new Error('[linkArchive] chunkSize must be positive');
  }
  const totalChunks = Math.ceil(plaintext.byteLength / chunkSize);
  if (totalChunks > LINK_ARCHIVE_MAX_CHUNKS) {
    throw new Error('[linkArchive] archive exceeds MVP cap');
  }
  const slices = [];
  for (let i = 0; i < totalChunks; i++) {
    const start = i * chunkSize;
    const end = Math.min(start + chunkSize, plaintext.byteLength);
    slices.push(plaintext.subarray(start, end));
  }
  return slices;
}

/**
 * Concatenates plaintext slices back into the original archive. Verifies
 * `archiveSha256` end-to-end before returning.
 *
 * @param {Uint8Array[]} slices
 * @param {Uint8Array} expectedArchiveSha256
 * @returns {Promise<Uint8Array>}
 */
export async function assembleArchive(slices, expectedArchiveSha256) {
  let totalLen = 0;
  for (const slice of slices) totalLen += slice.byteLength;
  const out = new Uint8Array(totalLen);
  let offset = 0;
  for (const slice of slices) {
    out.set(slice, offset);
    offset += slice.byteLength;
  }
  const actual = await sha256(out);
  if (!constantTimeEqual(actual, expectedArchiveSha256)) {
    throw new Error('[linkArchive] archive sha256 mismatch after reassembly');
  }
  return out;
}

// ---------------------------------------------------------------------------
// Encryption / decryption
// ---------------------------------------------------------------------------

/**
 * Derives the per-archive AES-GCM key from an ECDH key agreement between an
 * ephemeral local keypair and the new device's session public key. The
 * ephemeral public key rides in the small relay envelope so the new device
 * can derive the same shared secret.
 *
 * @param {string} sessionPublicKeyBase64
 * @returns {Promise<{ key: CryptoKey, ephPublicKeyBytes: Uint8Array }>}
 */
export async function deriveArchiveKey(sessionPublicKeyBase64) {
  const ephKeyPair = await crypto.subtle.generateKey(
    { name: 'ECDH', namedCurve: 'P-256' },
    true,
    ['deriveBits'],
  );
  const targetPub = await importSessionPublicKey(sessionPublicKeyBase64);
  const sharedBits = await crypto.subtle.deriveBits(
    { name: 'ECDH', public: targetPub },
    ephKeyPair.privateKey,
    256,
  );
  const key = await crypto.subtle.importKey(
    'raw',
    sharedBits,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  );
  const ephPublicKeyBytes = new Uint8Array(await crypto.subtle.exportKey('raw', ephKeyPair.publicKey));
  return { key, ephPublicKeyBytes };
}

/**
 * Reverses {@link deriveArchiveKey} on the receiving (NEW-device) side.
 *
 * @param {Uint8Array} ephPublicKeyBytes
 * @param {CryptoKey} sessionPrivateKey
 * @returns {Promise<CryptoKey>}
 */
export async function deriveArchiveKeyForImport(ephPublicKeyBytes, sessionPrivateKey) {
  const ephPub = await crypto.subtle.importKey(
    'raw',
    ephPublicKeyBytes,
    { name: 'ECDH', namedCurve: 'P-256' },
    false,
    [],
  );
  const sharedBits = await crypto.subtle.deriveBits(
    { name: 'ECDH', public: ephPub },
    sessionPrivateKey,
    256,
  );
  return crypto.subtle.importKey(
    'raw',
    sharedBits,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  );
}

/**
 * Builds a 12-byte AES-GCM nonce from an 8-byte random base concatenated with
 * the big-endian uint32 chunk index.
 *
 * @param {Uint8Array} nonceBase
 * @param {number} idx
 * @returns {Uint8Array}
 */
export function chunkNonce(nonceBase, idx) {
  if (nonceBase.byteLength !== LINK_ARCHIVE_NONCE_BASE_LEN) {
    throw new Error('[linkArchive] nonceBase must be 8 bytes');
  }
  const nonce = new Uint8Array(12);
  nonce.set(nonceBase, 0);
  nonce[8] = (idx >>> 24) & 0xff;
  nonce[9] = (idx >>> 16) & 0xff;
  nonce[10] = (idx >>> 8) & 0xff;
  nonce[11] = idx & 0xff;
  return nonce;
}

/**
 * Encrypts each plaintext slice into ciphertext + per-chunk SHA-256 hash.
 * The chunk hash is computed over the ciphertext bytes — that is what the
 * server stores and what the manifest binds to.
 *
 * @param {Uint8Array[]} slices
 * @param {CryptoKey} key
 * @param {Uint8Array} nonceBase
 * @returns {Promise<{ ciphertexts: Uint8Array[], chunkHashes: Uint8Array[] }>}
 */
export async function encryptArchiveSlices(slices, key, nonceBase) {
  const ciphertexts = new Array(slices.length);
  const chunkHashes = new Array(slices.length);
  for (let i = 0; i < slices.length; i++) {
    const nonce = chunkNonce(nonceBase, i);
    const cipherBuf = await crypto.subtle.encrypt({ name: 'AES-GCM', iv: nonce }, key, slices[i]);
    const cipher = new Uint8Array(cipherBuf);
    ciphertexts[i] = cipher;
    chunkHashes[i] = await sha256(cipher);
  }
  return { ciphertexts, chunkHashes };
}

/**
 * Reverses {@link encryptArchiveSlices}, verifying the ciphertext hash before
 * decryption so a tampered chunk fails fast.
 *
 * @param {Uint8Array} ciphertext
 * @param {Uint8Array} expectedHash
 * @param {CryptoKey} key
 * @param {Uint8Array} nonceBase
 * @param {number} idx
 * @returns {Promise<Uint8Array>}
 */
export async function decryptArchiveChunk(ciphertext, expectedHash, key, nonceBase, idx) {
  const actualHash = await sha256(ciphertext);
  if (!constantTimeEqual(actualHash, expectedHash)) {
    throw new Error(`[linkArchive] chunk ${idx} hash mismatch`);
  }
  if (ciphertext.byteLength <= AES_GCM_TAG_BYTES) {
    throw new Error(`[linkArchive] chunk ${idx} ciphertext is shorter than AES-GCM tag`);
  }
  const nonce = chunkNonce(nonceBase, idx);
  const plainBuf = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: nonce }, key, ciphertext);
  return new Uint8Array(plainBuf);
}

// ---------------------------------------------------------------------------
// Misc
// ---------------------------------------------------------------------------

/**
 * Length-aware constant-time byte comparison.
 *
 * @param {Uint8Array} a
 * @param {Uint8Array} b
 * @returns {boolean}
 */
export function constantTimeEqual(a, b) {
  if (!(a instanceof Uint8Array) || !(b instanceof Uint8Array)) return false;
  if (a.byteLength !== b.byteLength) return false;
  let diff = 0;
  for (let i = 0; i < a.byteLength; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}
