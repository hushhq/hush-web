import { isValidMetadataKeyBytes } from './guildMetadata';

const DB_VERSION = 1;
const STORE_NAME = 'guild_keys';
const PENDING_GUILD_ID_PREFIX = 'pending:';

function getDatabaseName(userId, deviceId) {
  return `hush-guild-metadata-${userId}-${deviceId}`;
}

function openDatabase(userId, deviceId) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(getDatabaseName(userId, deviceId), DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'guildId' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('failed to open guild metadata key store'));
  });
}

function transactionDone(tx) {
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error('guild metadata key transaction failed'));
    tx.onabort = () => reject(tx.error ?? new Error('guild metadata key transaction aborted'));
  });
}

function requestResult(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('guild metadata key request failed'));
  });
}

function buildPendingGuildId() {
  return `${PENDING_GUILD_ID_PREFIX}${globalThis.crypto.randomUUID()}`;
}

function isPendingGuildId(guildId) {
  return typeof guildId === 'string' && guildId.startsWith(PENDING_GUILD_ID_PREFIX);
}

function assertGuildId(guildId) {
  if (!guildId || typeof guildId !== 'string') {
    throw new Error('guildId is required');
  }
}

function assertMetadataKeyBytes(keyBytes) {
  if (!isValidMetadataKeyBytes(keyBytes)) {
    throw new Error('invalid guild metadata key');
  }
}

function toStoredKeyBytes(keyBytes) {
  return Array.from(keyBytes);
}

function toLoadedKeyBytes(row) {
  const keyBytes = Array.isArray(row?.keyBytes) ? new Uint8Array(row.keyBytes) : null;
  return isValidMetadataKeyBytes(keyBytes) ? keyBytes : null;
}

/**
 * Open the guild metadata key store for the current user/device.
 *
 * @param {string} userId
 * @param {string} deviceId
 * @returns {Promise<IDBDatabase>}
 */
export async function openGuildMetadataKeyStore(userId, deviceId) {
  if (!userId) {
    throw new Error('userId is required');
  }
  if (!deviceId) {
    throw new Error('deviceId is required');
  }
  return openDatabase(userId, deviceId);
}

/**
 * Load one guild metadata key from IndexedDB.
 *
 * Invalid rows are treated as corruption and deleted.
 *
 * @param {IDBDatabase} db
 * @param {string} guildId
 * @returns {Promise<Uint8Array|null>}
 */
export async function getGuildMetadataKeyBytes(db, guildId) {
  assertGuildId(guildId);

  const tx = db.transaction(STORE_NAME, 'readonly');
  const store = tx.objectStore(STORE_NAME);
  const row = await requestResult(store.get(guildId));
  await transactionDone(tx);

  const keyBytes = toLoadedKeyBytes(row);
  if (keyBytes || !row) {
    return keyBytes;
  }

  const cleanupTx = db.transaction(STORE_NAME, 'readwrite');
  cleanupTx.objectStore(STORE_NAME).delete(guildId);
  await transactionDone(cleanupTx);
  return null;
}

/**
 * Delete one guild metadata key.
 *
 * @param {IDBDatabase} db
 * @param {string} guildId
 * @returns {Promise<void>}
 */
export async function deleteGuildMetadataKeyBytes(db, guildId) {
  assertGuildId(guildId);
  const tx = db.transaction(STORE_NAME, 'readwrite');
  tx.objectStore(STORE_NAME).delete(guildId);
  await transactionDone(tx);
}

/**
 * Persist one guild metadata key.
 *
 * @param {IDBDatabase} db
 * @param {string} guildId
 * @param {Uint8Array} keyBytes
 * @returns {Promise<void>}
 */
export async function setGuildMetadataKeyBytes(db, guildId, keyBytes) {
  assertGuildId(guildId);
  assertMetadataKeyBytes(keyBytes);
  const tx = db.transaction(STORE_NAME, 'readwrite');
  tx.objectStore(STORE_NAME).put({
    guildId,
    keyBytes: toStoredKeyBytes(keyBytes),
    updatedAt: Date.now(),
  });
  await transactionDone(tx);
}

/**
 * Persist one guild metadata key under a temporary pending identifier.
 *
 * @param {IDBDatabase} db
 * @param {Uint8Array} keyBytes
 * @returns {Promise<string>}
 */
export async function createPendingGuildMetadataKey(db, keyBytes) {
  assertMetadataKeyBytes(keyBytes);
  const pendingGuildId = buildPendingGuildId();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  tx.objectStore(STORE_NAME).put({
    guildId: pendingGuildId,
    keyBytes: toStoredKeyBytes(keyBytes),
    updatedAt: Date.now(),
  });
  await transactionDone(tx);
  return pendingGuildId;
}

/**
 * Promote a pending guild metadata key to the real guild ID after creation.
 *
 * @param {IDBDatabase} db
 * @param {string} pendingGuildId
 * @param {string} guildId
 * @returns {Promise<void>}
 */
export async function promotePendingGuildMetadataKey(db, pendingGuildId, guildId) {
  assertGuildId(pendingGuildId);
  assertGuildId(guildId);
  if (!isPendingGuildId(pendingGuildId)) {
    throw new Error('pendingGuildId is invalid');
  }

  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);
  const row = await requestResult(store.get(pendingGuildId));
  const keyBytes = toLoadedKeyBytes(row);
  if (!keyBytes) {
    tx.abort();
    throw new Error('pending guild metadata key is missing');
  }

  store.put({
    guildId,
    keyBytes: toStoredKeyBytes(keyBytes),
    updatedAt: Date.now(),
  });
  store.delete(pendingGuildId);
  await transactionDone(tx);
}

/**
 * Export all stored guild metadata keys for device-link transfer.
 *
 * Pending rows and invalid rows are excluded.
 *
 * @param {IDBDatabase} db
 * @returns {Promise<{ version: number, keys: Array<{ guildId: string, keyBytes: number[] }> }>}
 */
export async function exportGuildMetadataKeySnapshot(db) {
  const tx = db.transaction(STORE_NAME, 'readonly');
  const rows = await requestResult(tx.objectStore(STORE_NAME).getAll());
  await transactionDone(tx);

  return {
    version: 1,
    keys: (rows ?? [])
      .filter((row) => row?.guildId && !isPendingGuildId(row.guildId))
      .map((row) => {
        const keyBytes = toLoadedKeyBytes(row);
        if (!keyBytes) {
          return null;
        }
        return {
          guildId: row.guildId,
          keyBytes: toStoredKeyBytes(keyBytes),
        };
      })
      .filter(Boolean),
  };
}

/**
 * Replace the local guild metadata key set from a device-link snapshot.
 *
 * Pending rows and invalid rows are ignored.
 *
 * @param {IDBDatabase} db
 * @param {{ keys?: Array<{ guildId: string, keyBytes: number[] }> }|null} snapshot
 * @returns {Promise<void>}
 */
export async function importGuildMetadataKeySnapshot(db, snapshot) {
  const rows = Array.isArray(snapshot?.keys) ? snapshot.keys : [];
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);
  store.clear();
  for (const row of rows) {
    const keyBytes = Array.isArray(row?.keyBytes) ? new Uint8Array(row.keyBytes) : null;
    if (!row?.guildId || isPendingGuildId(row.guildId) || !isValidMetadataKeyBytes(keyBytes)) {
      continue;
    }
    store.put({
      guildId: row.guildId,
      keyBytes: toStoredKeyBytes(keyBytes),
      updatedAt: Date.now(),
    });
  }
  await transactionDone(tx);
}
