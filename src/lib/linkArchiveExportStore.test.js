import { describe, it, expect, beforeEach } from 'vitest';
import {
  initExport,
  loadExport,
  markChunkConfirmed,
  setExportProgress,
  markExportTerminal,
  deleteExport,
  findResumableExport,
  sweepStaleExports,
  unwrapUploadToken,
  unwrapDownloadToken,
  isChunkConfirmed,
  listMissingChunks,
  EXPORT_STATUS_IN_PROGRESS,
  EXPORT_STATUS_TERMINAL,
  _clearAll,
} from './linkArchiveExportStore';

const ROOT_KEY = new Uint8Array(32).fill(7);
const OTHER_ROOT_KEY = new Uint8Array(32).fill(9);

function fakeChunks(n, byteLen = 16) {
  return Array.from({ length: n }, (_, i) => new Uint8Array(byteLen).fill(i + 1));
}

function fakeHashes(n) {
  return Array.from({ length: n }, (_, i) => new Uint8Array(32).fill(i + 100));
}

async function makeBaseRecord(overrides = {}) {
  return initExport({
    rootPrivateKey: ROOT_KEY,
    archiveId: overrides.archiveId ?? 'arch-1',
    uploadToken: overrides.uploadToken ?? 'upload-bearer',
    downloadToken: overrides.downloadToken ?? 'download-bearer',
    baseUrl: overrides.baseUrl ?? 'https://api.example.com',
    backendKind: overrides.backendKind ?? 's3',
    totalChunks: overrides.totalChunks ?? 4,
    totalBytes: overrides.totalBytes ?? 64,
    chunkSize: overrides.chunkSize ?? 16,
    manifestHash: new Uint8Array(32).fill(1),
    archiveSha256: new Uint8Array(32).fill(2),
    chunkSha256s: fakeHashes(overrides.totalChunks ?? 4),
    ciphertextChunks: fakeChunks(overrides.totalChunks ?? 4),
    ephPub: new Uint8Array(65).fill(3),
    nonceBase: new Uint8Array(16).fill(4),
    chunkPlaintextHashes: fakeHashes(overrides.totalChunks ?? 4),
  });
}

describe('linkArchiveExportStore', () => {
  beforeEach(async () => { await _clearAll(); });

  it('persists an export record and round-trips it through load', async () => {
    const created = await makeBaseRecord();
    expect(created.status).toBe(EXPORT_STATUS_IN_PROGRESS);
    const loaded = await loadExport('arch-1');
    expect(loaded.archiveId).toBe('arch-1');
    expect(loaded.totalChunks).toBe(4);
    expect(loaded.ciphertextChunks).toHaveLength(4);
    expect(loaded.chunkSha256s).toHaveLength(4);
    expect(loaded.chunkProgress.byteLength).toBe(1);
    expect(loaded.uploadTokenWrapped).toBeTruthy();
    expect(loaded.downloadTokenWrapped).toBeTruthy();
  });

  it('wraps the upload + download tokens under a key derived from rootPrivateKey', async () => {
    await makeBaseRecord();
    const loaded = await loadExport('arch-1');
    const upload = await unwrapUploadToken(ROOT_KEY, loaded.uploadTokenWrapped);
    const download = await unwrapDownloadToken(ROOT_KEY, loaded.downloadTokenWrapped);
    expect(upload).toBe('upload-bearer');
    expect(download).toBe('download-bearer');
  });

  it('rejects unwrap with the wrong root key', async () => {
    await makeBaseRecord();
    const loaded = await loadExport('arch-1');
    await expect(unwrapUploadToken(OTHER_ROOT_KEY, loaded.uploadTokenWrapped)).rejects.toThrow();
  });

  it('marks chunks confirmed and reports missing indices', async () => {
    await makeBaseRecord({ totalChunks: 5 });
    await markChunkConfirmed('arch-1', 0);
    await markChunkConfirmed('arch-1', 2);
    const loaded = await loadExport('arch-1');
    expect(isChunkConfirmed(loaded.chunkProgress, 0)).toBe(true);
    expect(isChunkConfirmed(loaded.chunkProgress, 1)).toBe(false);
    expect(isChunkConfirmed(loaded.chunkProgress, 2)).toBe(true);
    expect(listMissingChunks(loaded.chunkProgress, 5)).toEqual([1, 3, 4]);
  });

  it('replaces the progress bitmap on setExportProgress', async () => {
    await makeBaseRecord({ totalChunks: 4 });
    const fresh = new Uint8Array([0b00001111]);
    await setExportProgress('arch-1', fresh);
    const loaded = await loadExport('arch-1');
    expect(listMissingChunks(loaded.chunkProgress, 4)).toEqual([]);
  });

  it('findResumableExport returns the most recent in_progress record for the baseUrl', async () => {
    await makeBaseRecord({ archiveId: 'a', baseUrl: 'https://x' });
    await new Promise((r) => setTimeout(r, 5));
    await makeBaseRecord({ archiveId: 'b', baseUrl: 'https://y' });
    await new Promise((r) => setTimeout(r, 5));
    await makeBaseRecord({ archiveId: 'c', baseUrl: 'https://x' });

    const found = await findResumableExport('https://x');
    expect(found?.archiveId).toBe('c');

    const noneForZ = await findResumableExport('https://z');
    expect(noneForZ).toBeNull();
  });

  it('findResumableExport ignores terminal records', async () => {
    await makeBaseRecord({ archiveId: 'a' });
    await markExportTerminal('a', 'boom');
    const found = await findResumableExport('https://api.example.com');
    expect(found).toBeNull();
  });

  it('sweepStaleExports removes terminal and past-deadline rows', async () => {
    await makeBaseRecord({ archiveId: 'live' });
    await makeBaseRecord({ archiveId: 'dead' });
    await markExportTerminal('dead', 'boom');

    // Forge a row whose hardDeadlineAt is in the past.
    await makeBaseRecord({ archiveId: 'expired' });
    const expired = await loadExport('expired');
    expired.hardDeadlineAt = new Date(Date.now() - 60_000).toISOString();
    // Re-put it under the same key.
    const dbReq = indexedDB.open('hush-link-archive-exports');
    await new Promise((resolve, reject) => {
      dbReq.onsuccess = () => {
        const tx = dbReq.result.transaction('exports', 'readwrite');
        tx.objectStore('exports').put(expired);
        tx.oncomplete = () => { dbReq.result.close(); resolve(); };
        tx.onerror = () => reject(tx.error);
      };
      dbReq.onerror = () => reject(dbReq.error);
    });

    const removed = await sweepStaleExports();
    expect(removed).toBeGreaterThanOrEqual(2);
    expect(await loadExport('live')).toBeTruthy();
    expect(await loadExport('dead')).toBeNull();
    expect(await loadExport('expired')).toBeNull();
  });

  it('deleteExport removes a record idempotently', async () => {
    await makeBaseRecord();
    await deleteExport('arch-1');
    expect(await loadExport('arch-1')).toBeNull();
    // second delete tolerates missing row
    await deleteExport('arch-1');
  });

  it('markChunkConfirmed tolerates a removed record without throwing', async () => {
    await makeBaseRecord();
    await deleteExport('arch-1');
    await markChunkConfirmed('arch-1', 0); // no throw
  });
});
