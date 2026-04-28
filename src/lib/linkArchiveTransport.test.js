/**
 * Tests for the chunked device-link transport client.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  initArchive,
  uploadChunk,
  finalizeArchive,
  fetchManifest,
  downloadChunk,
  downloadChunkViaWindow,
  deleteArchive,
  LinkArchiveError,
} from './linkArchiveTransport';
import { bytesToBase64 } from './deviceLinking';
import { sha256 } from './linkArchive';

function fakeResponse({ status = 200, json = null, body = null, headers = {} } = {}) {
  return {
    ok: status >= 200 && status < 300,
    status,
    headers: new Headers(headers),
    json: async () => json ?? {},
    arrayBuffer: async () => (body ? body.buffer.slice(0) : new ArrayBuffer(0)),
  };
}

describe('linkArchiveTransport — initArchive', () => {
  let fetchSpy;
  beforeEach(() => {
    fetchSpy = vi.fn();
    vi.stubGlobal('fetch', fetchSpy);
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('POSTs base64 hashes and returns server descriptor', async () => {
    fetchSpy.mockResolvedValueOnce(fakeResponse({
      status: 200,
      json: {
        archiveId: 'arch-1',
        uploadToken: 'utok',
        downloadToken: 'dtok',
        expiresAt: '2026-04-26T00:00:00Z',
        hardDeadlineAt: '2026-04-26T04:00:00Z',
      },
    }));
    const out = await initArchive('jwt', {
      totalChunks: 2,
      totalBytes: 2048,
      chunkSize: 1024,
      manifestHash: new Uint8Array(32).fill(7),
      archiveSha256: new Uint8Array(32).fill(8),
    }, 'https://api.example.com');
    expect(out.archiveId).toBe('arch-1');
    const [url, init] = fetchSpy.mock.calls[0];
    expect(url).toBe('https://api.example.com/api/auth/link-archive-init');
    expect(init.method).toBe('POST');
    const body = JSON.parse(init.body);
    expect(body.manifestHash).toBe(bytesToBase64(new Uint8Array(32).fill(7)));
    expect(body.archiveSha256).toBe(bytesToBase64(new Uint8Array(32).fill(8)));
    expect(init.headers.Authorization).toBe('Bearer jwt');
  });

  it('throws LinkArchiveError on non-2xx', async () => {
    fetchSpy.mockResolvedValueOnce(fakeResponse({
      status: 400,
      json: { error: 'totalChunks out of range' },
    }));
    await expect(initArchive('jwt', {
      totalChunks: 200, totalBytes: 1, chunkSize: 1,
      manifestHash: new Uint8Array(32),
      archiveSha256: new Uint8Array(32),
    }, '')).rejects.toBeInstanceOf(LinkArchiveError);
  });
});

describe('linkArchiveTransport — uploadChunk', () => {
  let fetchSpy;
  beforeEach(() => {
    fetchSpy = vi.fn();
    vi.stubGlobal('fetch', fetchSpy);
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('sends chunk bytes with Authorization + X-Upload-Token + X-Chunk-Sha256 headers', async () => {
    const ciphertext = new Uint8Array([1, 2, 3, 4]);
    const hash = await sha256(ciphertext);
    fetchSpy.mockResolvedValueOnce(fakeResponse({ status: 204 }));
    await uploadChunk('arch-1', 'utok', 0, ciphertext, hash, 'jwt-bearer', '');
    const [url, init] = fetchSpy.mock.calls[0];
    expect(url).toBe('/api/auth/link-archive-chunk/arch-1/0');
    expect(init.method).toBe('PUT');
    // The chunk endpoint sits inside the JWT-gated upload plane on the
    // server, so the bearer must be present alongside the upload-token.
    expect(init.headers.Authorization).toBe('Bearer jwt-bearer');
    expect(init.headers['X-Upload-Token']).toBe('utok');
    expect(init.headers['X-Chunk-Sha256']).toBe(bytesToBase64(hash));
    expect(init.body).toBe(ciphertext);
  });

  it('throws hard on 409 hash conflict (no retry)', async () => {
    const ciphertext = new Uint8Array([5]);
    const hash = await sha256(ciphertext);
    fetchSpy.mockResolvedValueOnce(fakeResponse({ status: 409, json: { error: 'chunk hash conflict for index' } }));
    await expect(uploadChunk('a', 'u', 0, ciphertext, hash, 'jwt', '')).rejects.toBeInstanceOf(LinkArchiveError);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  it('retries on 5xx then succeeds', async () => {
    const ciphertext = new Uint8Array([7, 7]);
    const hash = await sha256(ciphertext);
    fetchSpy
      .mockResolvedValueOnce(fakeResponse({ status: 503, json: { error: 'try later' } }))
      .mockResolvedValueOnce(fakeResponse({ status: 204 }));
    await uploadChunk('a', 'u', 1, ciphertext, hash, 'jwt', '');
    expect(fetchSpy).toHaveBeenCalledTimes(2);
  });
});

describe('linkArchiveTransport — finalize', () => {
  let fetchSpy;
  beforeEach(() => {
    fetchSpy = vi.fn();
    vi.stubGlobal('fetch', fetchSpy);
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns ok on 200', async () => {
    fetchSpy.mockResolvedValueOnce(fakeResponse({ status: 200, json: { status: 'ok' } }));
    const r = await finalizeArchive('a', 'u', 'jwt', '');
    expect(r).toEqual({ status: 'ok' });
    const [, init] = fetchSpy.mock.calls[0];
    expect(init.headers.Authorization).toBe('Bearer jwt');
    expect(init.headers['X-Upload-Token']).toBe('u');
  });

  it('returns missing list on 409', async () => {
    fetchSpy.mockResolvedValueOnce(fakeResponse({ status: 409, json: { error: 'archive incomplete', missing: [2, 5] } }));
    const r = await finalizeArchive('a', 'u', 'jwt', '');
    expect(r).toEqual({ status: 'missing', missing: [2, 5] });
  });
});

describe('linkArchiveTransport — fetchManifest + downloadChunk', () => {
  let fetchSpy;
  beforeEach(() => {
    fetchSpy = vi.fn();
    vi.stubGlobal('fetch', fetchSpy);
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns the manifest payload as-is when 200', async () => {
    fetchSpy.mockResolvedValueOnce(fakeResponse({
      status: 200,
      json: {
        totalChunks: 2,
        chunkSize: 1024,
        totalBytes: 2048,
        manifestHash: 'aGVsbG8=',
        archiveSha256: 'd29ybGQ=',
        chunkHashes: ['x', 'y'],
        expiresAt: '2026-04-26T00:00:00Z',
      },
    }));
    const m = await fetchManifest('a', 'd', '');
    expect(m.totalChunks).toBe(2);
  });

  it('downloads chunk bytes', async () => {
    const bytes = new Uint8Array([4, 4, 4, 4]);
    fetchSpy.mockResolvedValueOnce(fakeResponse({ status: 200, body: bytes }));
    const out = await downloadChunk('a', 'd', 0, '');
    expect(out).toEqual(bytes);
  });

  it('downloadChunkViaWindow prepends baseUrl and download token for path-only API URLs', async () => {
    // Regression: in an Electron renderer hosted under app://localhost, a
    // path-only fetch resolves against the renderer's own protocol handler
    // and surfaces as `Failed to fetch` for /api/auth/... requests. The
    // helper must origin-anchor the URL with the caller's baseUrl and carry
    // the download token because the in-API endpoint is not object-store
    // presigned.
    const bytes = new Uint8Array([7, 7, 7]);
    fetchSpy.mockResolvedValueOnce(fakeResponse({ status: 200, body: bytes }));
    const entry = { url: '/api/auth/link-archive-chunk/abc/0', method: 'GET' };
    const out = await downloadChunkViaWindow(entry, 'https://app.gethush.live', 'download-token');
    const [url, init] = fetchSpy.mock.calls[0];
    expect(url).toBe('https://app.gethush.live/api/auth/link-archive-chunk/abc/0');
    expect(init.headers['X-Download-Token']).toBe('download-token');
    expect(out).toEqual(bytes);
  });

  it('downloadChunkViaWindow leaves absolute URLs (s3 presigned) untouched', async () => {
    fetchSpy.mockResolvedValueOnce(fakeResponse({ status: 200, body: new Uint8Array([1]) }));
    const entry = { url: 'https://bucket.s3.example.com/key?X-Amz-Signature=…', method: 'GET' };
    await downloadChunkViaWindow(entry, 'https://app.gethush.live', 'download-token');
    const [url, init] = fetchSpy.mock.calls[0];
    expect(url).toBe('https://bucket.s3.example.com/key?X-Amz-Signature=…');
    expect(init.headers['X-Download-Token']).toBeUndefined();
  });
});

describe('linkArchiveTransport — deleteArchive', () => {
  let fetchSpy;
  beforeEach(() => {
    fetchSpy = vi.fn();
    vi.stubGlobal('fetch', fetchSpy);
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('sends one of the tokens in the right header and never throws', async () => {
    fetchSpy.mockRejectedValueOnce(new TypeError('network down'));
    await deleteArchive('a', { downloadToken: 'd' }, '');
    const [, init] = fetchSpy.mock.calls[0];
    expect(init.method).toBe('DELETE');
    expect(init.headers['X-Download-Token']).toBe('d');
  });
});
