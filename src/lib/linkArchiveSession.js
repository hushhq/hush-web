/**
 * Orchestrators that wire the chunked-archive crypto helpers in
 * `linkArchive.js` to the HTTP transport in `linkArchiveTransport.js`.
 *
 * `uploadArchiveSession` runs on the OLD device after `/link-resolve` and
 * before `/link-verify`; it returns the archive descriptor that rides in
 * the small relay envelope.
 *
 * `downloadArchiveSession` runs on the NEW device after the small relay
 * envelope has been decrypted; it reassembles the archive plaintext and
 * returns the original `{ historySnapshot, guildMetadataKeySnapshot,
 * transcriptBlob }` triple.
 */
import {
  LINK_ARCHIVE_CHUNK_SIZE,
  LINK_ARCHIVE_NONCE_BASE_LEN,
  buildArchivePlaintext,
  computeManifestHash,
  deriveArchiveKey,
  deriveArchiveKeyForImport,
  decryptArchiveChunk,
  encryptArchiveSlices,
  parseArchivePlaintext,
  sha256,
  splitArchive,
  constantTimeEqual,
} from './linkArchive';
import {
  finalizeArchive,
  initArchive,
  uploadChunk,
  uploadChunkViaPresign,
  downloadChunkViaWindow,
  requestUploadWindow,
  requestDownloadWindow,
  confirmChunk,
  fetchManifest,
} from './linkArchiveTransport';
import { base64ToBytes, bytesToBase64 } from './deviceLinking';

const UPLOAD_CONCURRENCY = 4;
const DOWNLOAD_CONCURRENCY = 4;

/**
 * Bounded-concurrency map. Preserves index order of `tasks`.
 *
 * @template T
 * @param {Array<() => Promise<T>>} tasks
 * @param {number} limit
 * @returns {Promise<T[]>}
 */
async function runWithConcurrency(tasks, limit) {
  const results = new Array(tasks.length);
  let cursor = 0;
  async function worker() {
    while (true) {
      const idx = cursor;
      cursor += 1;
      if (idx >= tasks.length) return;
      results[idx] = await tasks[idx]();
    }
  }
  const workers = Array.from({ length: Math.min(limit, tasks.length) }, () => worker());
  await Promise.all(workers);
  return results;
}

/**
 * Runs the full OLD-device upload pipeline and returns the descriptor that
 * the caller should embed in the small relay envelope.
 *
 * @param {{
 *   token: string,
 *   sessionPublicKeyBase64: string,
 *   baseUrl: string,
 *   historySnapshot: object|null,
 *   guildMetadataKeySnapshot: object|null,
 *   transcriptBlob: Uint8Array|null,
 * }} args
 * @returns {Promise<{
 *   id: string,
 *   downloadToken: string,
 *   uploadToken: string,
 *   totalChunks: number,
 *   totalBytes: number,
 *   chunkSize: number,
 *   manifestHash: string,
 *   archiveSha256: string,
 *   ephPub: string,
 *   nonceBase: string,
 *   transcriptBlobOmitted: boolean,
 * }>}
 */
export async function uploadArchiveSession({
  token,
  sessionPublicKeyBase64,
  baseUrl,
  historySnapshot,
  guildMetadataKeySnapshot,
  transcriptBlob,
}) {
  // 1. Plaintext archive (gzipped JSON).
  let plaintext = await buildArchivePlaintext({
    historySnapshot,
    guildMetadataKeySnapshot,
    transcriptBlob,
  });
  let transcriptBlobOmitted = false;
  if (plaintext.byteLength > LINK_ARCHIVE_CHUNK_SIZE * 64) {
    // Degraded path: keep small parts, drop the transcript blob.
    transcriptBlobOmitted = true;
    plaintext = await buildArchivePlaintext({
      historySnapshot,
      guildMetadataKeySnapshot,
      transcriptBlob: null,
    });
    if (plaintext.byteLength > LINK_ARCHIVE_CHUNK_SIZE * 64) {
      throw new Error('[linkArchive] archive exceeds MVP cap even without transcript');
    }
  }

  const archiveSha256 = await sha256(plaintext);

  // 2. Split + encrypt.
  const slices = splitArchive(plaintext, LINK_ARCHIVE_CHUNK_SIZE);
  const { key, ephPublicKeyBytes } = await deriveArchiveKey(sessionPublicKeyBase64);
  const nonceBase = crypto.getRandomValues(new Uint8Array(LINK_ARCHIVE_NONCE_BASE_LEN));
  const { ciphertexts, chunkHashes } = await encryptArchiveSlices(slices, key, nonceBase);
  const manifestHash = await computeManifestHash(chunkHashes);

  const totalBytes = ciphertexts.reduce((sum, c) => sum + c.byteLength, 0);

  // 3. Init: server returns archive id, capability tokens, backend
  // kind, and the first presigned-URL upload window.
  const init = await initArchive(token, {
    totalChunks: ciphertexts.length,
    totalBytes,
    chunkSize: LINK_ARCHIVE_CHUNK_SIZE,
    manifestHash,
    archiveSha256,
  }, baseUrl);

  const backendKind = init.backendKind || 'postgres_bytea';
  const totalChunks = ciphertexts.length;

  // putViaWindow uploads one ciphertext via the URL provided by the
  // server's window response. Branches on backendKind: postgres_bytea
  // talks to the in-API endpoint with X-Upload-Token + X-Chunk-Sha256
  // headers; s3 PUTs to a real presigned URL with the
  // x-amz-checksum-sha256 header set.
  async function putViaWindow(entry, idx) {
    if (backendKind === 'postgres_bytea') {
      await uploadChunk(init.archiveId, init.uploadToken, idx, ciphertexts[idx], chunkHashes[idx], baseUrl);
    } else {
      await uploadChunkViaPresign(entry, ciphertexts[idx], chunkHashes[idx]);
    }
    await confirmChunk(init.archiveId, init.uploadToken, idx, chunkHashes[idx], ciphertexts[idx].byteLength, token, baseUrl);
  }

  try {
    // 4. Upload via sliding windows.
    let window = init.uploadWindow;
    while (window && window.from < totalChunks) {
      const tasks = window.urls.map((entry, i) => async () => {
        await putViaWindow(entry, window.from + i);
      });
      await runWithConcurrency(tasks, UPLOAD_CONCURRENCY);
      if (window.to >= totalChunks) break;
      const nextFrom = window.to;
      const nextTo = Math.min(nextFrom + window.urls.length, totalChunks);
      window = await requestUploadWindow(init.archiveId, init.uploadToken, nextFrom, nextTo, token, baseUrl);
    }

    // 5. Finalize, retransmit any missing chunks once.
    let finalizeResult = await finalizeArchive(init.archiveId, init.uploadToken, token, baseUrl);
    if (finalizeResult.status === 'missing') {
      const missing = finalizeResult.missing;
      // Mint a window covering exactly the missing indices (capped to
      // server window size). For larger gaps we loop.
      let cursor = 0;
      while (cursor < missing.length) {
        const slice = missing.slice(cursor, cursor + (init.uploadWindow?.urls?.length || 8));
        const from = slice[0];
        const to = slice[slice.length - 1] + 1;
        const retryWindow = await requestUploadWindow(init.archiveId, init.uploadToken, from, to, token, baseUrl);
        const tasks = retryWindow.urls.map((entry) => async () => {
          await putViaWindow(entry, entry.idx);
        });
        await runWithConcurrency(tasks, UPLOAD_CONCURRENCY);
        cursor += slice.length;
      }
      finalizeResult = await finalizeArchive(init.archiveId, init.uploadToken, token, baseUrl);
      if (finalizeResult.status !== 'ok') {
        throw new Error('[linkArchive] finalize failed after retransmit');
      }
    }
  } catch (err) {
    // Caller is expected to fire deleteArchive on failure; surface the error.
    throw err;
  }

  return {
    id: init.archiveId,
    downloadToken: init.downloadToken,
    uploadToken: init.uploadToken,
    totalChunks: ciphertexts.length,
    totalBytes,
    chunkSize: LINK_ARCHIVE_CHUNK_SIZE,
    manifestHash: bytesToBase64(manifestHash),
    archiveSha256: bytesToBase64(archiveSha256),
    ephPub: bytesToBase64(ephPublicKeyBytes),
    nonceBase: bytesToBase64(nonceBase),
    transcriptBlobOmitted,
  };
}

/**
 * Runs the full NEW-device download pipeline. Returns the original
 * `{ historySnapshot, guildMetadataKeySnapshot, transcriptBlob }` triple.
 *
 * @param {{
 *   archive: {
 *     id: string,
 *     downloadToken: string,
 *     totalChunks: number,
 *     chunkSize: number,
 *     manifestHash: string,
 *     archiveSha256: string,
 *     ephPub: string,
 *     nonceBase: string,
 *   },
 *   sessionPrivateKey: CryptoKey,
 *   baseUrl: string,
 * }} args
 * @returns {Promise<{ historySnapshot: object|null, guildMetadataKeySnapshot: object|null, transcriptBlob: Uint8Array|null }>}
 */
export async function downloadArchiveSession({ archive, sessionPrivateKey, baseUrl }) {
  const manifest = await fetchManifest(archive.id, archive.downloadToken, baseUrl);

  // Re-verify manifest hash binding to the descriptor that came over the
  // relay envelope; the server must agree with what the OLD device sealed.
  const declaredManifestHash = base64ToBytes(archive.manifestHash);
  const manifestServerHash = base64ToBytes(manifest.manifestHash);
  if (!constantTimeEqual(declaredManifestHash, manifestServerHash)) {
    throw new Error('[linkArchive] server manifest hash differs from descriptor');
  }
  if (manifest.totalChunks !== archive.totalChunks) {
    throw new Error('[linkArchive] server totalChunks differs from descriptor');
  }
  const expectedHashes = manifest.chunkHashes.map((h) => base64ToBytes(h));

  const ephPubBytes = base64ToBytes(archive.ephPub);
  const nonceBase = base64ToBytes(archive.nonceBase);
  const key = await deriveArchiveKeyForImport(ephPubBytes, sessionPrivateKey);

  const slices = new Array(archive.totalChunks);
  // Walk download windows. The server caps each window at its
  // window-size constant; the client makes as many round trips as
  // necessary. For every chunk in a window the URL is presigned (s3)
  // or in-API (postgres_bytea); both resolve to a GET that returns
  // octet-stream bytes, so the same downloadChunkViaWindow helper
  // works for both.
  const windowSize = 8;
  for (let from = 0; from < archive.totalChunks; from += windowSize) {
    const to = Math.min(from + windowSize, archive.totalChunks);
    const window = await requestDownloadWindow(archive.id, archive.downloadToken, from, to, baseUrl);
    const tasks = window.urls.map((entry) => async () => {
      const ciphertext = await downloadChunkViaWindow(entry);
      slices[entry.idx] = await decryptArchiveChunk(ciphertext, expectedHashes[entry.idx], key, nonceBase, entry.idx);
    });
    await runWithConcurrency(tasks, DOWNLOAD_CONCURRENCY);
  }

  const expectedArchiveSha256 = base64ToBytes(archive.archiveSha256);
  let totalLen = 0;
  for (const slice of slices) totalLen += slice.byteLength;
  const plaintext = new Uint8Array(totalLen);
  let offset = 0;
  for (const slice of slices) {
    plaintext.set(slice, offset);
    offset += slice.byteLength;
  }
  const actualHash = await sha256(plaintext);
  if (!constantTimeEqual(actualHash, expectedArchiveSha256)) {
    throw new Error('[linkArchive] reassembled plaintext sha256 mismatch');
  }
  return parseArchivePlaintext(plaintext);
}
