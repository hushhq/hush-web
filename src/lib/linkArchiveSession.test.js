import { beforeEach, describe, expect, it, vi } from 'vitest';

const linkArchiveMock = vi.hoisted(() => ({
  LINK_ARCHIVE_CHUNK_SIZE: 4 * 1024 * 1024,
  LINK_ARCHIVE_NONCE_BASE_LEN: 8,
  computeManifestHash: vi.fn(async () => new Uint8Array(32).fill(7)),
  deriveArchiveKey: vi.fn(async () => ({
    key: { mocked: true },
    ephPublicKeyBytes: new Uint8Array(65).fill(9),
  })),
  encryptArchiveSlices: vi.fn(async () => ({
    ciphertexts: [new Uint8Array([5, 4, 3])],
    chunkHashes: [new Uint8Array(32).fill(8)],
  })),
}));

const chunkAtomicMock = vi.hoisted(() => ({
  CHUNK_ATOMIC_FORMAT: 'chunk-atomic-v3',
  buildChunkAtomicArchive: vi.fn(async () => ({
    chunks: [new Uint8Array([1, 2, 3])],
    archiveSha256: new Uint8Array(32).fill(6),
    chunkPlaintextHashes: [new Uint8Array(32).fill(4)],
  })),
}));

const transportMock = vi.hoisted(() => ({
  initArchive: vi.fn(),
  uploadChunk: vi.fn(),
  uploadChunkViaPresign: vi.fn(),
  downloadChunkViaWindow: vi.fn(),
  requestUploadWindow: vi.fn(),
  requestDownloadWindow: vi.fn(),
  confirmChunk: vi.fn(),
  fetchManifest: vi.fn(),
  finalizeArchive: vi.fn(),
  deleteArchive: vi.fn(),
}));

const exportStoreMock = vi.hoisted(() => ({
  initExport: vi.fn(),
  markChunkConfirmed: vi.fn(),
  setExportProgress: vi.fn(),
  markExportTerminal: vi.fn(),
  deleteExport: vi.fn(),
  unwrapUploadToken: vi.fn(),
  unwrapDownloadToken: vi.fn(),
  listMissingChunks: vi.fn(),
}));

vi.mock('./linkArchive', async () => {
  const actual = await vi.importActual('./linkArchive');
  return { ...actual, ...linkArchiveMock };
});
vi.mock('./linkArchiveChunkAtomic', async () => {
  const actual = await vi.importActual('./linkArchiveChunkAtomic');
  return { ...actual, ...chunkAtomicMock };
});
vi.mock('./linkArchiveTransport', () => transportMock);
vi.mock('./linkArchiveExportStore', () => exportStoreMock);

const { uploadArchiveSession } = await import('./linkArchiveSession');

describe('uploadArchiveSession', () => {
  beforeEach(() => {
    transportMock.initArchive.mockReset();
    transportMock.uploadChunk.mockReset();
    transportMock.deleteArchive.mockReset();
    transportMock.confirmChunk.mockReset();
    transportMock.finalizeArchive.mockReset();

    transportMock.initArchive.mockResolvedValue({
      archiveId: 'arch-1',
      uploadToken: 'upload-token',
      downloadToken: 'download-token',
      backendKind: 'postgres_bytea',
      uploadWindow: {
        from: 0,
        to: 1,
        urls: [{ idx: 0, url: '', method: 'PUT', headers: {} }],
      },
    });
    transportMock.uploadChunk.mockRejectedValue(new Error('upload boom'));
    transportMock.deleteArchive.mockResolvedValue(undefined);
  });

  it('best-effort deletes the server archive when upload fails after init', async () => {
    await expect(uploadArchiveSession({
      token: 'jwt',
      sessionPublicKeyBase64: 'session-pub',
      baseUrl: 'https://api.example.com',
      historySnapshot: { version: 1 },
      guildMetadataKeySnapshot: null,
      transcriptBlob: null,
    })).rejects.toThrow('upload boom');

    expect(transportMock.deleteArchive).toHaveBeenCalledWith(
      'arch-1',
      { uploadToken: 'upload-token', downloadToken: 'download-token' },
      'https://api.example.com',
    );
  });
});
