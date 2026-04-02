const DB_VERSION = 1;
const STORE_NAME = 'guild_keys';

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
 * @param {IDBDatabase} db
 * @param {string} guildId
 * @returns {Promise<Uint8Array|null>}
 */
export async function getGuildMetadataKeyBytes(db, guildId) {
  const tx = db.transaction(STORE_NAME, 'readonly');
  const store = tx.objectStore(STORE_NAME);
  const row = await requestResult(store.get(guildId));
  await transactionDone(tx);
  if (!row?.keyBytes) {
    return null;
  }
  return new Uint8Array(row.keyBytes);
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
  const tx = db.transaction(STORE_NAME, 'readwrite');
  tx.objectStore(STORE_NAME).put({
    guildId,
    keyBytes: Array.from(keyBytes),
    updatedAt: Date.now(),
  });
  await transactionDone(tx);
}

/**
 * Export all stored guild metadata keys for device-link transfer.
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
    keys: (rows ?? []).map((row) => ({
      guildId: row.guildId,
      keyBytes: Array.isArray(row.keyBytes) ? row.keyBytes : [],
    })),
  };
}

/**
 * Replace the local guild metadata key set from a device-link snapshot.
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
    if (!row?.guildId || !Array.isArray(row.keyBytes)) {
      continue;
    }
    store.put({
      guildId: row.guildId,
      keyBytes: row.keyBytes,
      updatedAt: Date.now(),
    });
  }
  await transactionDone(tx);
}
