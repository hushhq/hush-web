/**
 * Transcript vault.
 *
 * Cross-device-portable, at-rest-encrypted store for the user's recoverable
 * channel transcript cache. The OLD device snapshots its `localPlaintext` rows
 * into an AES-256-GCM blob keyed by an HKDF derivation of the user's root
 * identity private key, transfers that blob to the NEW device via the existing
 * ECDH-encrypted relay envelope, and the NEW device re-encrypts the blob
 * under its own freshly generated nonce before persisting it locally.
 *
 * Security model
 * ---------------
 *
 *  * The transcript-blob symmetric key is derived deterministically from the
 *    user's root identity private key (Ed25519 32-byte seed) via:
 *
 *        TKey = HKDF-SHA256(IKM = rootPrivateKey,
 *                            salt = empty,
 *                            info = "hush-transcript-cache-v1",
 *                            L = 32 bytes)
 *
 *    Because the same root key lives on every device the user owns, every
 *    one of those devices derives the same `TKey` and can therefore decrypt
 *    a transcript blob that any of them produced. This deliberately ties
 *    transcript-cache confidentiality to identity-key confidentiality:
 *    whoever holds the root identity already holds the message account, so
 *    binding transcript access to the same secret is the right granularity.
 *
 *  * The root key is itself protected at rest by the existing identity
 *    vault (PBKDF2-derived AES-GCM under the user's PIN). It only exists in
 *    plaintext in browser memory while the vault is unlocked. This means
 *    the transcript blob is also only readable while the vault is unlocked
 *    — when the vault relocks, the in-memory cache is cleared and the
 *    encrypted blob on disk cannot be opened until the user re-unlocks.
 *
 *  * The OLD device's PIN is NEVER required on the NEW device. Only the
 *    transferred root key + the transferred encrypted transcript blob are
 *    needed to import.
 *
 *  * On import, the NEW device re-encrypts under a freshly random nonce
 *    (12 bytes) before writing the blob to its own IDB, so the bytes
 *    persisted locally are not bit-for-bit identical to the bytes that
 *    travelled across the relay.
 *
 * Blob format
 * -----------
 *
 *   [12-byte random nonce][AES-GCM ciphertext including 16-byte tag]
 *
 * Plaintext payload format (JSON-encoded UTF-8):
 *
 *   { v: 1, rows: [{ messageId, plaintext, senderId?, timestamp }] }
 *
 * IDB layout
 * ----------
 *
 *   DB:    `hush-transcript-${userId}`
 *   store: `transcript`
 *   row:   { key: 'blob', value: number[]  // serialised Uint8Array }
 */

const TRANSCRIPT_DB_PREFIX = 'hush-transcript-';
const TRANSCRIPT_STORE = 'transcript';
const TRANSCRIPT_ROW_KEY = 'blob';
const TRANSCRIPT_DB_VERSION = 1;
const TRANSCRIPT_PAYLOAD_VERSION = 1;
const TRANSCRIPT_HKDF_INFO = new TextEncoder().encode('hush-transcript-cache-v1');
const NONCE_LENGTH = 12;

// ---------------------------------------------------------------------------
// Key derivation
// ---------------------------------------------------------------------------

/**
 * Derives the AES-256-GCM transcript-cache key from the user's root identity
 * private key. The derivation is deterministic (same root → same key) so any
 * device the user links can decrypt blobs produced by any other.
 *
 * @param {Uint8Array} rootPrivateKey - 32-byte Ed25519 seed.
 * @returns {Promise<CryptoKey>}
 */
export async function deriveTranscriptKey(rootPrivateKey) {
  if (!(rootPrivateKey instanceof Uint8Array) || rootPrivateKey.byteLength === 0) {
    throw new Error('[transcriptVault] root private key must be a non-empty Uint8Array');
  }
  const ikm = await crypto.subtle.importKey(
    'raw',
    rootPrivateKey,
    { name: 'HKDF' },
    false,
    ['deriveKey'],
  );
  return crypto.subtle.deriveKey(
    {
      name: 'HKDF',
      hash: 'SHA-256',
      salt: new Uint8Array(0),
      info: TRANSCRIPT_HKDF_INFO,
    },
    ikm,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  );
}

// ---------------------------------------------------------------------------
// Blob encrypt / decrypt
// ---------------------------------------------------------------------------

/**
 * Serialises and encrypts an array of transcript rows.
 *
 * @param {CryptoKey} key - AES-GCM key from `deriveTranscriptKey`.
 * @param {Array<{messageId: string, plaintext: string, senderId?: string, timestamp: number}>} rows
 * @returns {Promise<Uint8Array>}
 */
export async function encryptTranscriptBlob(key, rows) {
  const safeRows = Array.isArray(rows) ? rows : [];
  const payload = JSON.stringify({ v: TRANSCRIPT_PAYLOAD_VERSION, rows: safeRows });
  const plaintext = new TextEncoder().encode(payload);
  const nonce = crypto.getRandomValues(new Uint8Array(NONCE_LENGTH));
  const ciphertextBuf = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: nonce },
    key,
    plaintext,
  );
  const ciphertext = new Uint8Array(ciphertextBuf);
  const out = new Uint8Array(NONCE_LENGTH + ciphertext.byteLength);
  out.set(nonce, 0);
  out.set(ciphertext, NONCE_LENGTH);
  return out;
}

/**
 * Decrypts a transcript blob produced by `encryptTranscriptBlob`.
 *
 * @param {CryptoKey} key
 * @param {Uint8Array} blob
 * @returns {Promise<Array<{messageId: string, plaintext: string, senderId?: string, timestamp: number}>>}
 */
export async function decryptTranscriptBlob(key, blob) {
  if (!(blob instanceof Uint8Array) || blob.byteLength <= NONCE_LENGTH) {
    throw new Error('[transcriptVault] invalid transcript blob');
  }
  const nonce = blob.slice(0, NONCE_LENGTH);
  const ciphertext = blob.slice(NONCE_LENGTH);
  const plaintextBuf = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: nonce },
    key,
    ciphertext,
  );
  const text = new TextDecoder().decode(new Uint8Array(plaintextBuf));
  const parsed = JSON.parse(text);
  if (!parsed || !Array.isArray(parsed.rows)) return [];
  return parsed.rows;
}

// ---------------------------------------------------------------------------
// IndexedDB persistence
// ---------------------------------------------------------------------------

/**
 * Opens the per-user transcript IDB.
 *
 * @param {string} userId
 * @returns {Promise<IDBDatabase>}
 */
export function openTranscriptStore(userId) {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(`${TRANSCRIPT_DB_PREFIX}${userId}`, TRANSCRIPT_DB_VERSION);
    req.onerror = () => reject(req.error);
    req.onsuccess = () => resolve(req.result);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(TRANSCRIPT_STORE)) {
        db.createObjectStore(TRANSCRIPT_STORE, { keyPath: 'key' });
      }
    };
  });
}

/**
 * Persist the encrypted transcript blob into the per-user IDB.
 *
 * @param {IDBDatabase} db
 * @param {Uint8Array} blob
 * @returns {Promise<void>}
 */
export function saveTranscriptBlob(db, blob) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(TRANSCRIPT_STORE, 'readwrite');
    tx.objectStore(TRANSCRIPT_STORE).put({ key: TRANSCRIPT_ROW_KEY, value: Array.from(blob) });
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

/**
 * Load the encrypted transcript blob from the per-user IDB. Returns null if
 * no blob has been saved yet for this user.
 *
 * @param {IDBDatabase} db
 * @returns {Promise<Uint8Array|null>}
 */
export function loadTranscriptBlob(db) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(TRANSCRIPT_STORE, 'readonly');
    const req = tx.objectStore(TRANSCRIPT_STORE).get(TRANSCRIPT_ROW_KEY);
    req.onsuccess = () => {
      const row = req.result;
      if (!row?.value) return resolve(null);
      resolve(new Uint8Array(row.value));
    };
    req.onerror = () => reject(req.error);
  });
}

/**
 * Drops the per-user transcript IDB. Used by full logout / vault wipe paths.
 *
 * @param {string} userId
 * @returns {Promise<void>}
 */
export function deleteTranscriptDatabase(userId) {
  return new Promise((resolve, reject) => {
    const req = indexedDB.deleteDatabase(`${TRANSCRIPT_DB_PREFIX}${userId}`);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
    req.onblocked = () => resolve();
  });
}

// ---------------------------------------------------------------------------
// In-memory runtime cache (cleared on vault lock)
//
// Concurrency: every cache state transition (clear / set / on-disk load
// completion) bumps a monotonic `generation` counter. Async on-disk loads
// snapshot the generation at start and only commit their result if the
// generation has not moved. This prevents a fire-and-forget hydrate started
// before vault lock from re-populating the cache after the vault relocked.
// ---------------------------------------------------------------------------

const _state = {
  cache: new Map(),
  loaded: false,
  userId: null,
  generation: 0,
};

function bumpTranscriptGeneration() {
  _state.generation += 1;
  return _state.generation;
}

/**
 * Replace the in-memory transcript cache with the given rows.
 *
 * Bumps the generation counter so any in-flight async hydrate that has
 * already snapshotted the previous generation will detect that its result
 * is stale and skip its own commit.
 *
 * @param {string} userId
 * @param {Array<{messageId: string, plaintext: string, senderId?: string, timestamp: number}>} rows
 */
export function setTranscriptCache(userId, rows) {
  _state.cache.clear();
  if (Array.isArray(rows)) {
    for (const row of rows) {
      if (row?.messageId) _state.cache.set(row.messageId, row);
    }
  }
  _state.loaded = true;
  _state.userId = userId ?? null;
  bumpTranscriptGeneration();
  // Diagnostic: expose runtime status on window for live debugging. Lets us
  // confirm in the console whether the inherited transcript actually landed
  // in memory after a device link.
  if (typeof window !== 'undefined') {
    try {
      window.__hushTranscriptCacheStatus = () => getTranscriptCacheStatus();
      window.__hushTranscriptCacheHas = (messageId) => Boolean(getTranscriptEntry(messageId));
    } catch { /* ignore */ }
  }
  console.info('[transcriptVault] cache populated', {
    userId: _state.userId,
    size: _state.cache.size,
    generation: _state.generation,
  });
}

/**
 * Look up a single transcript entry by server message ID.
 *
 * @param {string} messageId
 * @returns {{messageId: string, plaintext: string, senderId?: string, timestamp: number}|null}
 */
export function getTranscriptEntry(messageId) {
  if (!messageId) return null;
  return _state.cache.get(messageId) ?? null;
}

/**
 * Clear the in-memory transcript cache. Called on vault lock or full logout.
 *
 * Bumps the generation counter so any in-flight async hydrate cannot
 * re-populate the cache after this point.
 */
export function clearTranscriptCache() {
  _state.cache.clear();
  _state.loaded = false;
  _state.userId = null;
  bumpTranscriptGeneration();
}

/**
 * @returns {{loaded: boolean, userId: string|null, size: number, generation: number}}
 */
export function getTranscriptCacheStatus() {
  return {
    loaded: _state.loaded,
    userId: _state.userId,
    size: _state.cache.size,
    generation: _state.generation,
  };
}

// ---------------------------------------------------------------------------
// High-level helpers
// ---------------------------------------------------------------------------

/**
 * Build an encrypted transcript blob from a raw rows array. Used by the OLD
 * device at link export time after `preDecryptForLinkExport` has populated
 * the active store's localPlaintext.
 *
 * @param {Uint8Array} rootPrivateKey
 * @param {Array<{messageId: string, plaintext: string, senderId?: string, timestamp: number}>} rows
 * @returns {Promise<Uint8Array>}
 */
export async function buildTranscriptBlobForExport(rootPrivateKey, rows) {
  const key = await deriveTranscriptKey(rootPrivateKey);
  return encryptTranscriptBlob(key, rows);
}

/**
 * Decrypt an inbound transcript blob (received via the relay envelope on the
 * NEW device), re-encrypt it with a freshly-random nonce, and persist the
 * re-encrypted bytes into the NEW device's transcript IDB. Returns the
 * decrypted rows so the caller can also seed the in-memory runtime cache
 * for immediate display.
 *
 * @param {{
 *   userId: string,
 *   rootPrivateKey: Uint8Array,
 *   inboundBlob: Uint8Array,
 * }} args
 * @returns {Promise<Array<{messageId: string, plaintext: string, senderId?: string, timestamp: number}>>}
 */
export async function importAndReprotectTranscriptBlob({ userId, rootPrivateKey, inboundBlob }) {
  if (!userId) throw new Error('[transcriptVault] userId is required');
  if (!(rootPrivateKey instanceof Uint8Array)) {
    throw new Error('[transcriptVault] rootPrivateKey must be a Uint8Array');
  }
  if (!(inboundBlob instanceof Uint8Array)) {
    throw new Error('[transcriptVault] inboundBlob must be a Uint8Array');
  }
  const key = await deriveTranscriptKey(rootPrivateKey);
  const rows = await decryptTranscriptBlob(key, inboundBlob);
  // Re-encrypt with a freshly-random nonce so the bytes persisted locally on
  // the new device are not bit-for-bit identical to those that travelled
  // across the relay.
  const reEncrypted = await encryptTranscriptBlob(key, rows);
  const db = await openTranscriptStore(userId);
  try {
    await saveTranscriptBlob(db, reEncrypted);
  } finally {
    try { db.close(); } catch { /* ignore */ }
  }
  return rows;
}

/**
 * Open the transcript IDB, load the persisted blob, decrypt it under the
 * provided root key, and seed the in-memory runtime cache.
 *
 * Called on vault unlock so subsequent `getTranscriptEntry` lookups can
 * serve the inherited transcript without re-decrypting per call.
 *
 * @param {{ userId: string, rootPrivateKey: Uint8Array }} args
 * @returns {Promise<number>} number of rows loaded into the cache
 */
export async function loadTranscriptCacheFromDisk({ userId, rootPrivateKey }) {
  if (!userId || !rootPrivateKey) return 0;
  // Snapshot the generation at start. If the cache is cleared (vault lock)
  // or replaced (eager seed) before we reach a write point, we MUST NOT
  // overwrite it — a stale fire-and-forget hydrate must not re-expose
  // inherited plaintexts after lock.
  const startGen = _state.generation;
  const isStale = () => _state.generation !== startGen;

  const db = await openTranscriptStore(userId);
  let blob;
  try {
    blob = await loadTranscriptBlob(db);
  } finally {
    try { db.close(); } catch { /* ignore */ }
  }
  if (isStale()) return 0;

  if (!blob) {
    setTranscriptCache(userId, []);
    return 0;
  }
  const key = await deriveTranscriptKey(rootPrivateKey);
  const rows = await decryptTranscriptBlob(key, blob);
  if (isStale()) return 0;

  setTranscriptCache(userId, rows);
  return rows.length;
}
