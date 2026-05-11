/**
 * Identity vault module.
 *
 * Provides AES-256-GCM encryption of the identity private key (IK_priv),
 * keyed by a PIN-derived PBKDF2-SHA256 key. The encrypted blob is persisted
 * in IndexedDB per user. Salt is stored in both localStorage and IndexedDB
 * for resilience against iOS storage eviction on non-Safari browsers.
 *
 * Blob formats:
 * - v1 legacy: [12-byte nonce][ciphertext][16-byte GCM tag], PBKDF2 200k.
 * - v2 current: ["H","V","2",1][12-byte nonce][ciphertext][16-byte GCM tag],
 *   PBKDF2 600k.
 *
 * Key derivation: PBKDF2-SHA256, 256-bit output.
 * Salt: 16 bytes, generated once and dual-stored in localStorage + IDB.
 */

/** Legacy PBKDF2 iteration count used by pre-v2 vault blobs. */
const LEGACY_PBKDF2_ITERATIONS = 200_000;

/** PBKDF2 iteration count - OWASP recommendation for PBKDF2-SHA256. */
const PBKDF2_ITERATIONS = 600_000;

/** Current vault blob header: ASCII "HV2" + version byte 1. */
const VAULT_BLOB_V2_HEADER = new Uint8Array([0x48, 0x56, 0x32, 0x01]);

/** localStorage key for the PBKDF2 salt. */
const SALT_KEY = 'hush_vault_salt';

/** AES-GCM nonce length in bytes. */
const NONCE_LENGTH = 12;

/** IndexedDB object store name. */
const OBJECT_STORE_NAME = 'vault';

/** IDB record key under which the encrypted private key is stored. */
const ENCRYPTED_KEY_RECORD = 'ik_priv_encrypted';

/** IDB record key under which the PBKDF2 salt backup is stored. */
const SALT_IDB_RECORD = 'pbkdf2_salt';

/** IDB record key for the vault marker (public key hex) backup. */
const VAULT_MARKER_IDB_RECORD = 'vault_marker';

/** IDB record key for local PIN/passphrase failure accounting. */
const PIN_ATTEMPTS_IDB_RECORD = 'pin_attempts';

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/**
 * Returns the persisted PBKDF2 salt from localStorage, generating and storing
 * a new 16-byte random salt if none exists yet.
 *
 * @returns {Uint8Array} 16-byte salt.
 */
function generateAndStoreSalt() {
  const existing = localStorage.getItem(SALT_KEY);
  if (existing) {
    return hexToBytes(existing);
  }
  const salt = crypto.getRandomValues(new Uint8Array(16));
  localStorage.setItem(SALT_KEY, bytesToHex(salt));
  return salt;
}

/**
 * Converts a hex string to a Uint8Array.
 *
 * @param {string} hex - Hexadecimal string (even length, lowercase or uppercase).
 * @returns {Uint8Array}
 */
export function hexToBytes(hex) {
  const result = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    result[i / 2] = parseInt(hex.slice(i, i + 2), 16);
  }
  return result;
}

/**
 * Converts a Uint8Array to a lowercase hex string.
 *
 * @param {Uint8Array} bytes
 * @returns {string}
 */
export function bytesToHex(bytes) {
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Derives an AES-256-GCM key from a PIN using PBKDF2-SHA256.
 *
 * The salt is read from localStorage (generating one if absent), ensuring
 * that the same PIN on the same device always produces the same derived key.
 *
 * @param {string} pin - User-supplied PIN or passphrase.
 * @returns {Promise<CryptoKey>} AES-256-GCM CryptoKey for encrypt/decrypt.
 */
async function deriveKeyFromPin(pin, iterations = PBKDF2_ITERATIONS, extractable = false) {
  const salt = generateAndStoreSalt();
  const pinBytes = new TextEncoder().encode(pin);

  const rawKey = await crypto.subtle.importKey('raw', pinBytes, 'PBKDF2', false, [
    'deriveKey',
  ]);

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations,
      hash: 'SHA-256',
    },
    rawKey,
    { name: 'AES-GCM', length: 256 },
    extractable,
    ['encrypt', 'decrypt'],
  );
}

function hasV2Header(blob) {
  if (!blob || blob.length < VAULT_BLOB_V2_HEADER.length + NONCE_LENGTH) return false;
  return VAULT_BLOB_V2_HEADER.every((byte, index) => blob[index] === byte);
}

function parseVaultBlob(blob) {
  if (hasV2Header(blob)) {
    const offset = VAULT_BLOB_V2_HEADER.length;
    return {
      nonce: blob.slice(offset, offset + NONCE_LENGTH),
      ciphertext: blob.slice(offset + NONCE_LENGTH),
      iterations: PBKDF2_ITERATIONS,
    };
  }
  return {
    nonce: blob.slice(0, NONCE_LENGTH),
    ciphertext: blob.slice(NONCE_LENGTH),
    iterations: LEGACY_PBKDF2_ITERATIONS,
  };
}

function encodeVaultBlob(nonce, ciphertext) {
  const blob = new Uint8Array(VAULT_BLOB_V2_HEADER.length + nonce.length + ciphertext.length);
  blob.set(VAULT_BLOB_V2_HEADER, 0);
  blob.set(nonce, VAULT_BLOB_V2_HEADER.length);
  blob.set(ciphertext, VAULT_BLOB_V2_HEADER.length + nonce.length);
  return blob;
}

/**
 * Returns true when a vault blob still uses the legacy PBKDF2-200k format.
 *
 * @param {Uint8Array} blob
 * @returns {boolean}
 */
export function isLegacyVaultBlob(blob) {
  return !hasV2Header(blob);
}

// ---------------------------------------------------------------------------
// Public API - Encryption / Decryption
// ---------------------------------------------------------------------------

/**
 * Encrypts a 32-byte private key with a user PIN.
 *
 * A 12-byte random nonce is generated per call, so two encryptions of the
 * same key with the same PIN produce different blobs (nonce differs).
 *
 * Blob format: ["H","V","2",1][12-byte nonce][ciphertext + 16-byte GCM tag]
 *
 * @param {Uint8Array} privateKey - 32-byte Ed25519 private key seed.
 * @param {string} pin - User PIN or passphrase.
 * @returns {Promise<Uint8Array>} Encrypted blob.
 */
export async function encryptVault(privateKey, pin) {
  const key = await deriveKeyFromPin(pin);
  const nonce = crypto.getRandomValues(new Uint8Array(NONCE_LENGTH));

  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: nonce },
    key,
    privateKey,
  );

  return encodeVaultBlob(nonce, new Uint8Array(ciphertext));
}

/**
 * Decrypts an encrypted vault blob with a user PIN.
 *
 * Throws a DOMException (OperationError) if the PIN is wrong (GCM tag
 * mismatch), preventing silent key recovery with an incorrect PIN.
 *
 * @param {Uint8Array} blob - Encrypted blob produced by encryptVault.
 * @param {string} pin - User PIN or passphrase.
 * @returns {Promise<Uint8Array>} Decrypted 32-byte private key.
 * @throws {DOMException} If PIN is incorrect (GCM authentication failure).
 */
export async function decryptVault(blob, pin) {
  const parsed = parseVaultBlob(blob);
  const key = await deriveKeyFromPin(pin, parsed.iterations);

  const plaintext = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: parsed.nonce },
    key,
    parsed.ciphertext,
  );

  return new Uint8Array(plaintext);
}

/**
 * Decrypts an encrypted vault blob AND exports the raw AES-256 key bytes.
 *
 * Performs a single PBKDF2 derivation (extractable=true) so the caller can
 * persist the raw key in sessionStorage for auto-unlock on page refresh
 * without re-entering the PIN.
 *
 * @param {Uint8Array} blob - Encrypted blob produced by encryptVault.
 * @param {string} pin - User PIN or passphrase.
 * @returns {Promise<{ privateKey: Uint8Array, rawKeyHex: string }>}
 * @throws {DOMException} If PIN is incorrect (GCM authentication failure).
 */
export async function decryptVaultAndExportKey(blob, pin) {
  const parsed = parseVaultBlob(blob);
  const key = await deriveKeyFromPin(pin, parsed.iterations, true);

  const plaintext = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: parsed.nonce },
    key,
    parsed.ciphertext,
  );

  const exported = await crypto.subtle.exportKey('raw', key);
  const rawKeyHex = bytesToHex(new Uint8Array(exported));

  return { privateKey: new Uint8Array(plaintext), rawKeyHex };
}

/**
 * Decrypts an encrypted vault blob using a previously exported raw AES key.
 *
 * Used on page refresh to auto-unlock the vault without re-entering the PIN.
 * The rawKeyHex was obtained from a prior decryptVaultAndExportKey call and
 * stored in sessionStorage.
 *
 * @param {Uint8Array} blob - Encrypted blob produced by encryptVault.
 * @param {string} rawKeyHex - Hex-encoded 32-byte AES-256 key.
 * @returns {Promise<Uint8Array>} Decrypted 32-byte private key.
 * @throws {DOMException} If the key is incorrect (GCM authentication failure).
 */
export async function decryptVaultWithRawKey(blob, rawKeyHex) {
  const keyBytes = hexToBytes(rawKeyHex);
  const key = await crypto.subtle.importKey(
    'raw',
    keyBytes,
    { name: 'AES-GCM', length: 256 },
    false,
    ['decrypt'],
  );

  const parsed = parseVaultBlob(blob);

  const plaintext = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: parsed.nonce },
    key,
    parsed.ciphertext,
  );

  return new Uint8Array(plaintext);
}

// ---------------------------------------------------------------------------
// Public API - IndexedDB persistence
// ---------------------------------------------------------------------------

/**
 * Opens (or creates) the vault IndexedDB database for a specific user.
 *
 * Database name: `hush-vault-{userId}`
 * Object store: `vault` (key-value)
 *
 * @param {string} userId - User identifier string.
 * @returns {Promise<IDBDatabase>} Open IDB database handle.
 */
export function openVaultStore(userId) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(`hush-vault-${userId}`, 1);

    request.onupgradeneeded = event => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(OBJECT_STORE_NAME)) {
        db.createObjectStore(OBJECT_STORE_NAME);
      }
    };

    request.onsuccess = event => resolve(event.target.result);
    request.onerror = event => reject(event.target.error);
  });
}

/**
 * Persists an encrypted vault blob in IndexedDB under the canonical record key.
 *
 * @param {IDBDatabase} db - Open vault IDB handle (from openVaultStore).
 * @param {Uint8Array} blob - Encrypted blob to persist.
 * @returns {Promise<void>}
 */
export function saveEncryptedKey(db, blob) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(OBJECT_STORE_NAME, 'readwrite');
    const store = tx.objectStore(OBJECT_STORE_NAME);
    const request = store.put(blob, ENCRYPTED_KEY_RECORD);
    request.onsuccess = () => resolve();
    request.onerror = event => reject(event.target.error);
  });
}

/**
 * Persists the PBKDF2 salt to IndexedDB as a backup.
 * Called alongside saveEncryptedKey so the salt survives localStorage eviction
 * on iOS non-Safari browsers (Chrome iOS, Google in-app, etc.).
 *
 * @param {IDBDatabase} db - Open vault IDB handle.
 * @param {Uint8Array} salt - 16-byte PBKDF2 salt.
 * @returns {Promise<void>}
 */
export function saveSaltToIDB(db, salt) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(OBJECT_STORE_NAME, 'readwrite');
    const store = tx.objectStore(OBJECT_STORE_NAME);
    const request = store.put(salt, SALT_IDB_RECORD);
    request.onsuccess = () => resolve();
    request.onerror = event => reject(event.target.error);
  });
}

/**
 * Loads the PBKDF2 salt backup from IndexedDB.
 *
 * @param {IDBDatabase} db - Open vault IDB handle.
 * @returns {Promise<Uint8Array|null>} Salt bytes or null.
 */
export function loadSaltFromIDB(db) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(OBJECT_STORE_NAME, 'readonly');
    const store = tx.objectStore(OBJECT_STORE_NAME);
    const request = store.get(SALT_IDB_RECORD);
    request.onsuccess = event => {
      const value = event.target.result ?? null;
      if (value === null) resolve(null);
      else if (value instanceof Uint8Array) resolve(value);
      else resolve(new Uint8Array(value));
    };
    request.onerror = event => reject(event.target.error);
  });
}

/**
 * Persists the vault marker (public key hex) to IndexedDB as a backup.
 * Used during boot to detect vault existence when localStorage is evicted.
 *
 * @param {IDBDatabase} db - Open vault IDB handle.
 * @param {string} publicKeyHex - Hex-encoded public key.
 * @returns {Promise<void>}
 */
export function saveVaultMarkerToIDB(db, publicKeyHex) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(OBJECT_STORE_NAME, 'readwrite');
    const store = tx.objectStore(OBJECT_STORE_NAME);
    const request = store.put(publicKeyHex, VAULT_MARKER_IDB_RECORD);
    request.onsuccess = () => resolve();
    request.onerror = event => reject(event.target.error);
  });
}

/**
 * Loads the vault marker (public key hex) from IndexedDB.
 *
 * @param {IDBDatabase} db - Open vault IDB handle.
 * @returns {Promise<string|null>} Public key hex or null.
 */
export function loadVaultMarkerFromIDB(db) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(OBJECT_STORE_NAME, 'readonly');
    const store = tx.objectStore(OBJECT_STORE_NAME);
    const request = store.get(VAULT_MARKER_IDB_RECORD);
    request.onsuccess = event => resolve(event.target.result ?? null);
    request.onerror = event => reject(event.target.error);
  });
}

/**
 * Loads the persisted PIN/passphrase failure counter from the user's vault DB.
 *
 * @param {IDBDatabase} db - Open vault IDB handle.
 * @returns {Promise<{ count: number, lastAttemptAt: string|null }>}
 */
export function loadPinAttemptsFromIDB(db) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(OBJECT_STORE_NAME, 'readonly');
    const store = tx.objectStore(OBJECT_STORE_NAME);
    const request = store.get(PIN_ATTEMPTS_IDB_RECORD);
    request.onsuccess = event => resolve(normalizePinAttempts(event.target.result));
    request.onerror = event => reject(event.target.error);
  });
}

/**
 * Persists the PIN/passphrase failure counter in the user's vault DB.
 *
 * @param {IDBDatabase} db - Open vault IDB handle.
 * @param {{ count: number, lastAttemptAt: string|null }} record
 * @returns {Promise<void>}
 */
export function savePinAttemptsToIDB(db, record) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(OBJECT_STORE_NAME, 'readwrite');
    const store = tx.objectStore(OBJECT_STORE_NAME);
    const request = store.put(normalizePinAttempts(record), PIN_ATTEMPTS_IDB_RECORD);
    request.onsuccess = () => resolve();
    request.onerror = event => reject(event.target.error);
  });
}

/**
 * Clears the PIN/passphrase failure counter after a successful unlock.
 *
 * @param {IDBDatabase} db - Open vault IDB handle.
 * @returns {Promise<void>}
 */
export function clearPinAttemptsFromIDB(db) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(OBJECT_STORE_NAME, 'readwrite');
    const store = tx.objectStore(OBJECT_STORE_NAME);
    const request = store.delete(PIN_ATTEMPTS_IDB_RECORD);
    request.onsuccess = () => resolve();
    request.onerror = event => reject(event.target.error);
  });
}

function normalizePinAttempts(value) {
  if (!value || typeof value !== 'object') {
    return { count: 0, lastAttemptAt: null };
  }
  const count = Number.isFinite(value.count)
    ? Math.max(0, Math.floor(value.count))
    : 0;
  const lastAttemptAt = typeof value.lastAttemptAt === 'string'
    ? value.lastAttemptAt
    : null;
  return { count, lastAttemptAt };
}

/**
 * Checks whether a vault IDB database exists for the given user and contains
 * an encrypted key. Used at boot time to detect vaults when localStorage
 * markers have been evicted by iOS.
 *
 * @param {string} userId
 * @returns {Promise<{ exists: boolean, publicKeyHex: string|null }>}
 */
export async function checkVaultExistsInIDB(userId) {
  try {
    const db = await openVaultStore(userId);
    const blob = await loadEncryptedKey(db);
    if (!blob) {
      db.close();
      return { exists: false, publicKeyHex: null };
    }
    // Vault has encrypted data - try to load the marker too.
    const marker = await loadVaultMarkerFromIDB(db);

    // If localStorage lost the salt, try to restore it from IDB.
    if (!localStorage.getItem(SALT_KEY)) {
      const saltBackup = await loadSaltFromIDB(db);
      if (saltBackup) {
        localStorage.setItem(SALT_KEY, bytesToHex(saltBackup));
      }
    }

    db.close();
    return { exists: true, publicKeyHex: typeof marker === 'string' ? marker : null };
  } catch {
    return { exists: false, publicKeyHex: null };
  }
}

/**
 * Loads the encrypted vault blob from IndexedDB.
 *
 * @param {IDBDatabase} db - Open vault IDB handle (from openVaultStore).
 * @returns {Promise<Uint8Array|null>} Encrypted blob or null if none stored.
 */
export function loadEncryptedKey(db) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(OBJECT_STORE_NAME, 'readonly');
    const store = tx.objectStore(OBJECT_STORE_NAME);
    const request = store.get(ENCRYPTED_KEY_RECORD);
    request.onsuccess = event => {
      const value = event.target.result ?? null;
      if (value === null) {
        resolve(null);
      } else if (value instanceof Uint8Array) {
        resolve(value);
      } else {
        // fake-indexeddb and some environments return ArrayBuffer or similar;
        // coerce to Uint8Array for a consistent return type.
        resolve(new Uint8Array(value));
      }
    };
    request.onerror = event => reject(event.target.error);
  });
}

/**
 * Deletes the vault IndexedDB database for a specific user.
 *
 * Used on account removal or factory reset. Resolves (does not throw) when
 * the database does not exist.
 *
 * @param {string} userId - User identifier string.
 * @returns {Promise<void>}
 */
export function deleteVaultDatabase(userId) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.deleteDatabase(`hush-vault-${userId}`);
    request.onsuccess = () => resolve();
    request.onerror = event => reject(event.target.error);
    // onblocked fires when the DB is open in another tab; still resolves
    request.onblocked = () => resolve();
  });
}

// ---------------------------------------------------------------------------
// Public API - Vault configuration
// ---------------------------------------------------------------------------

/**
 * Retrieves vault configuration from localStorage.
 *
 * Config shape: { timeout: 'browser_close' | 'refresh' | number | 'never', pinType: 'pin' | 'passphrase' }
 *
 * @param {string} userId - User identifier string.
 * @returns {{ timeout: string|number, pinType: string }|null} Config or null if not set.
 */
export function getVaultConfig(userId) {
  const raw = localStorage.getItem(`hush_vault_config_${userId}`);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Persists vault configuration in localStorage.
 *
 * @param {string} userId - User identifier string.
 * @param {{ timeout: string|number, pinType: string }} config - Vault config object.
 */
export function setVaultConfig(userId, config) {
  localStorage.setItem(`hush_vault_config_${userId}`, JSON.stringify(config));
}
