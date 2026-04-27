/**
 * Resume-orchestration tests. The export store is exercised in
 * linkArchiveExportStore.test.js; here we verify that
 * `resumeUploadArchiveSession` reconciles persisted state with
 * server-side progress and only retransmits the chunks the server
 * actually missed.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';

const transportMock = vi.hoisted(() => ({
  initArchive: vi.fn(),
  uploadChunk: vi.fn(async () => {}),
  uploadChunkViaPresign: vi.fn(async () => {}),
  requestUploadWindow: vi.fn(),
  requestDownloadWindow: vi.fn(),
  confirmChunk: vi.fn(async () => {}),
  finalizeArchive: vi.fn(),
  fetchManifest: vi.fn(),
  downloadChunkViaWindow: vi.fn(),
  LinkArchiveError: class LinkArchiveError extends Error {
    constructor(msg, opts = {}) { super(msg); this.status = opts.status; this.body = opts.body; }
  },
}));

vi.mock('./linkArchiveTransport', () => transportMock);

const { resumeUploadArchiveSession } = await import('./linkArchiveSession');
const {
  initExport, loadExport, _clearAll, EXPORT_STATUS_TERMINAL,
} = await import('./linkArchiveExportStore');

const ROOT_KEY = new Uint8Array(32).fill(7);

function fakeChunks(n, byteLen = 16) {
  return Array.from({ length: n }, (_, i) => new Uint8Array(byteLen).fill(i + 1));
}
function fakeHashes(n) {
  return Array.from({ length: n }, (_, i) => new Uint8Array(32).fill(i + 100));
}

async function persistRecord(overrides = {}) {
  return initExport({
    rootPrivateKey: ROOT_KEY,
    archiveId: overrides.archiveId ?? 'arch-r',
    uploadToken: 'upload-bearer',
    downloadToken: 'download-bearer',
    baseUrl: 'https://api.example.com',
    backendKind: overrides.backendKind ?? 's3',
    totalChunks: overrides.totalChunks ?? 4,
    totalBytes: 64,
    chunkSize: 16,
    manifestHash: new Uint8Array(32).fill(1),
    archiveSha256: new Uint8Array(32).fill(2),
    chunkSha256s: fakeHashes(overrides.totalChunks ?? 4),
    ciphertextChunks: fakeChunks(overrides.totalChunks ?? 4),
    ephPub: new Uint8Array(65).fill(3),
    nonceBase: new Uint8Array(16).fill(4),
    chunkPlaintextHashes: fakeHashes(overrides.totalChunks ?? 4),
  });
}

beforeEach(async () => {
  await _clearAll();
  transportMock.initArchive.mockReset();
  transportMock.uploadChunk.mockReset();
  transportMock.uploadChunkViaPresign.mockReset();
  transportMock.requestUploadWindow.mockReset();
  transportMock.confirmChunk.mockReset();
  transportMock.finalizeArchive.mockReset();
  transportMock.uploadChunk.mockResolvedValue(undefined);
  transportMock.uploadChunkViaPresign.mockResolvedValue(undefined);
  transportMock.confirmChunk.mockResolvedValue(undefined);
});

describe('resumeUploadArchiveSession', () => {
  it('finalizes immediately when the server already has every chunk (status=ok)', async () => {
    const record = await persistRecord({ totalChunks: 3 });
    transportMock.finalizeArchive.mockResolvedValueOnce({ status: 'ok' });

    const descriptor = await resumeUploadArchiveSession({
      token: 'jwt',
      baseUrl: 'https://api.example.com',
      rootPrivateKey: ROOT_KEY,
      exportRecord: record,
    });

    expect(descriptor.id).toBe(record.archiveId);
    expect(descriptor.totalChunks).toBe(3);
    expect(descriptor.uploadToken).toBe('upload-bearer');
    expect(descriptor.downloadToken).toBe('download-bearer');
    // No retransmit happened.
    expect(transportMock.uploadChunkViaPresign).not.toHaveBeenCalled();
    expect(transportMock.uploadChunk).not.toHaveBeenCalled();
    expect(transportMock.confirmChunk).not.toHaveBeenCalled();
    // Local export record removed on success.
    expect(await loadExport(record.archiveId)).toBeNull();
  });

  it('retransmits only the missing chunks and finalizes', async () => {
    const record = await persistRecord({ totalChunks: 4 });
    // Server reports chunks 1 and 3 are missing.
    transportMock.finalizeArchive
      .mockResolvedValueOnce({ status: 'missing', missing: [1, 3] })
      .mockResolvedValueOnce({ status: 'ok' });

    transportMock.requestUploadWindow.mockResolvedValueOnce({
      from: 1, to: 4, ttlSeconds: 900,
      urls: [
        { idx: 1, url: 'https://s3.example/1', method: 'PUT', headers: {} },
        { idx: 2, url: 'https://s3.example/2', method: 'PUT', headers: {} },
        { idx: 3, url: 'https://s3.example/3', method: 'PUT', headers: {} },
      ],
    });

    await resumeUploadArchiveSession({
      token: 'jwt',
      baseUrl: 'https://api.example.com',
      rootPrivateKey: ROOT_KEY,
      exportRecord: record,
    });

    // s3 backend → uploadChunkViaPresign was used.
    expect(transportMock.uploadChunkViaPresign).toHaveBeenCalledTimes(2);
    const uploadedIdxs = transportMock.uploadChunkViaPresign.mock.calls
      .map((c) => c[0].idx).sort();
    expect(uploadedIdxs).toEqual([1, 3]);

    expect(transportMock.confirmChunk).toHaveBeenCalledTimes(2);
    const confirmedIdxs = transportMock.confirmChunk.mock.calls.map((c) => c[2]).sort();
    expect(confirmedIdxs).toEqual([1, 3]);

    // Finalize called twice (probe + after retransmit).
    expect(transportMock.finalizeArchive).toHaveBeenCalledTimes(2);

    // Export record cleaned up after successful resume.
    expect(await loadExport(record.archiveId)).toBeNull();
  });

  it('uses the postgres_bytea path when the persisted backendKind says so', async () => {
    const record = await persistRecord({ totalChunks: 2, backendKind: 'postgres_bytea' });
    transportMock.finalizeArchive
      .mockResolvedValueOnce({ status: 'missing', missing: [0] })
      .mockResolvedValueOnce({ status: 'ok' });
    transportMock.requestUploadWindow.mockResolvedValueOnce({
      from: 0, to: 1, ttlSeconds: 900,
      urls: [{ idx: 0, url: '', method: 'PUT', headers: {} }],
    });

    await resumeUploadArchiveSession({
      token: 'jwt',
      baseUrl: 'https://api.example.com',
      rootPrivateKey: ROOT_KEY,
      exportRecord: record,
    });

    // Bytea backend → uploadChunk (in-API) was used, not uploadChunkViaPresign.
    expect(transportMock.uploadChunk).toHaveBeenCalledTimes(1);
    expect(transportMock.uploadChunkViaPresign).not.toHaveBeenCalled();
  });

  it('marks the export terminal and rethrows when the server says the archive is gone', async () => {
    const record = await persistRecord({ totalChunks: 2 });
    const goneErr = new transportMock.LinkArchiveError('gone', { status: 404 });
    transportMock.finalizeArchive.mockRejectedValueOnce(goneErr);

    await expect(resumeUploadArchiveSession({
      token: 'jwt',
      baseUrl: 'https://api.example.com',
      rootPrivateKey: ROOT_KEY,
      exportRecord: record,
    })).rejects.toThrow('gone');

    // Local record removed (markExportTerminal then deleteExport).
    expect(await loadExport(record.archiveId)).toBeNull();
  });

  it('marks terminal when post-retransmit finalize still fails', async () => {
    const record = await persistRecord({ totalChunks: 2 });
    transportMock.finalizeArchive
      .mockResolvedValueOnce({ status: 'missing', missing: [0] })
      .mockResolvedValueOnce({ status: 'missing', missing: [0] }); // never converges
    transportMock.requestUploadWindow.mockResolvedValueOnce({
      from: 0, to: 1, ttlSeconds: 900,
      urls: [{ idx: 0, url: 'https://s3.example/0', method: 'PUT', headers: {} }],
    });

    await expect(resumeUploadArchiveSession({
      token: 'jwt',
      baseUrl: 'https://api.example.com',
      rootPrivateKey: ROOT_KEY,
      exportRecord: record,
    })).rejects.toThrow();

    const persistedAfter = await loadExport(record.archiveId);
    expect(persistedAfter).toBeTruthy();
    expect(persistedAfter.status).toBe(EXPORT_STATUS_TERMINAL);
  });
});
