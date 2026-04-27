/**
 * Durable per-archive checkpoint store for in-flight device-link
 * archive imports/exports. Survives reload, browser restart, and
 * laptop sleep so a NEW-device download or OLD-device upload can
 * resume from the last committed chunk.
 *
 * Schema (single store, version 1):
 *   - keyPath: 'archiveId'
 *   - records:
 *       {
 *         archiveId,
 *         role: 'import' | 'export',
 *         instanceUrl,
 *         totalChunks,
 *         chunkProgress: Uint8Array bitmap (bit i set => chunk i committed),
 *         highestContiguous,
 *         lastTransitionAt,
 *         status,
 *         lastError?,
 *       }
 *
 * The checkpoint is intentionally per-archive; once a device link
 * completes (or aborts), the row is deleted. This store lives in its
 * own IDB database to keep schema migrations decoupled from
 * mlsStore / transcriptVault.
 */

const DB_NAME = 'hush-link-archive-checkpoints';
const DB_VERSION = 1;
const STORE_NAME = 'archives';

function openDb() {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('[linkArchiveCheckpointStore] IndexedDB is not available'));
      return;
    }
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'archiveId' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error || new Error('[linkArchiveCheckpointStore] open failed'));
  });
}

async function withStore(mode, fn) {
  const db = await openDb();
  try {
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, mode);
      const store = tx.objectStore(STORE_NAME);
      const result = fn(store);
      tx.oncomplete = () => resolve(result);
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error || new Error('[linkArchiveCheckpointStore] tx aborted'));
    });
  } finally {
    db.close();
  }
}

function emptyBitmap(totalChunks) {
  return new Uint8Array(Math.ceil(Math.max(totalChunks, 0) / 8));
}

function setBit(bitmap, idx) {
  const byte = idx >>> 3;
  const bit = idx & 7;
  if (byte >= bitmap.byteLength) {
    const grown = new Uint8Array(byte + 1);
    grown.set(bitmap);
    bitmap = grown;
  }
  bitmap[byte] |= 1 << bit;
  return bitmap;
}

function isBitSet(bitmap, idx) {
  const byte = idx >>> 3;
  if (byte >= bitmap.byteLength) return false;
  return (bitmap[byte] & (1 << (idx & 7))) !== 0;
}

function highestContiguousFromBitmap(bitmap, totalChunks) {
  for (let i = 0; i < totalChunks; i++) {
    if (!isBitSet(bitmap, i)) return i;
  }
  return totalChunks;
}

/**
 * Initialise (or refresh) the checkpoint for an archive.
 *
 * @param {{ archiveId: string, role: 'import'|'export', instanceUrl: string, totalChunks: number, status?: string }} init
 * @returns {Promise<object>} the persisted record
 */
export async function initCheckpoint(init) {
  if (!init?.archiveId) throw new Error('[linkArchiveCheckpointStore] archiveId required');
  if (!Number.isInteger(init.totalChunks) || init.totalChunks <= 0) {
    throw new Error('[linkArchiveCheckpointStore] totalChunks must be a positive integer');
  }
  const record = {
    archiveId: init.archiveId,
    role: init.role,
    instanceUrl: init.instanceUrl ?? '',
    totalChunks: init.totalChunks,
    chunkProgress: emptyBitmap(init.totalChunks),
    highestContiguous: 0,
    lastTransitionAt: new Date().toISOString(),
    status: init.status ?? 'in_progress',
  };
  await withStore('readwrite', (store) => {
    store.put(record);
  });
  return record;
}

/**
 * Load the checkpoint for an archive, or null if there is none.
 *
 * @param {string} archiveId
 * @returns {Promise<object|null>}
 */
export async function loadCheckpoint(archiveId) {
  if (!archiveId) return null;
  return withStore('readonly', (store) => new Promise((resolve, reject) => {
    const req = store.get(archiveId);
    req.onsuccess = () => resolve(req.result ?? null);
    req.onerror = () => reject(req.error);
  }));
}

/**
 * Mark a chunk as committed, recompute highestContiguous, persist.
 *
 * @param {string} archiveId
 * @param {number} idx
 * @returns {Promise<{ highestContiguous: number, totalChunks: number }>}
 */
export async function markChunkCommitted(archiveId, idx) {
  return withStore('readwrite', (store) => new Promise((resolve, reject) => {
    const req = store.get(archiveId);
    req.onsuccess = () => {
      const row = req.result;
      if (!row) {
        reject(new Error(`[linkArchiveCheckpointStore] no checkpoint for ${archiveId}`));
        return;
      }
      let bitmap = row.chunkProgress instanceof Uint8Array
        ? new Uint8Array(row.chunkProgress)
        : new Uint8Array(row.chunkProgress?.buffer || row.chunkProgress || 0);
      bitmap = setBit(bitmap, idx);
      row.chunkProgress = bitmap;
      row.highestContiguous = highestContiguousFromBitmap(bitmap, row.totalChunks);
      row.lastTransitionAt = new Date().toISOString();
      const putReq = store.put(row);
      putReq.onsuccess = () => resolve({
        highestContiguous: row.highestContiguous,
        totalChunks: row.totalChunks,
      });
      putReq.onerror = () => reject(putReq.error);
    };
    req.onerror = () => reject(req.error);
  }));
}

/**
 * Mark the archive checkpoint as completed (`status='completed'`).
 * Caller decides whether to keep the row for diagnostics or delete
 * it via `deleteCheckpoint`.
 *
 * @param {string} archiveId
 * @returns {Promise<void>}
 */
export async function markCheckpointComplete(archiveId) {
  await withStore('readwrite', (store) => new Promise((resolve, reject) => {
    const req = store.get(archiveId);
    req.onsuccess = () => {
      const row = req.result;
      if (!row) { resolve(); return; }
      row.status = 'completed';
      row.lastTransitionAt = new Date().toISOString();
      const putReq = store.put(row);
      putReq.onsuccess = () => resolve();
      putReq.onerror = () => reject(putReq.error);
    };
    req.onerror = () => reject(req.error);
  }));
}

/**
 * Remove a checkpoint. Called after a successful import + ack, or
 * after an explicit abort.
 *
 * @param {string} archiveId
 * @returns {Promise<void>}
 */
export async function deleteCheckpoint(archiveId) {
  if (!archiveId) return;
  await withStore('readwrite', (store) => store.delete(archiveId));
}

/**
 * Test helper: clear the entire store. Not exported in production
 * paths; only used by unit tests.
 */
export async function _clearAll() {
  await withStore('readwrite', (store) => store.clear());
}

export const _internals = { isBitSet, setBit, emptyBitmap, highestContiguousFromBitmap };
