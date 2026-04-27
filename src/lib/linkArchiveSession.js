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
import {
  initCheckpoint,
  loadCheckpoint,
  markChunkCommitted,
  markCheckpointComplete,
  deleteCheckpoint,
  _internals as checkpointInternals,
} from './linkArchiveCheckpointStore';
import {
  CHUNK_ATOMIC_FORMAT,
  buildChunkAtomicArchive,
  consumeChunk as consumeChunkAtomicChunk,
  createParseAccumulator,
  finalizeAccumulator,
} from './linkArchiveChunkAtomic';

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
  // 1. Build the chunk-atomic archive. Each chunk is independently
  // AEAD-decryptable, gunzippable, and parseable; the NEW device can
  // process one chunk at a time without buffering the whole archive.
  // No degraded path: an archive that exceeds the operator-configured
  // staging cap is rejected at /link-archive-init by the server (503
  // + Retry-After). The OLD device never silently drops user state.
  const built = await buildChunkAtomicArchive({
    historySnapshot,
    guildMetadataKeySnapshot,
    transcriptBlob,
    chunkSize: LINK_ARCHIVE_CHUNK_SIZE,
  });
  const transcriptBlobOmitted = false;

  // archiveSha256 carries the chunk-atomic-v1 binding: it is
  // sha256(concat(per-chunk-plaintext-sha256)) so the NEW device can
  // verify it incrementally as it decrypts + gunzips chunks one at a
  // time, without holding the full plaintext in memory.
  const archiveSha256 = built.archiveSha256;

  // 2. Encrypt the per-chunk gzip outputs. Each ciphertext_i =
  // AES-GCM(gzip(plaintext_chunk_i)) — chunk-atomic at every layer.
  const { key, ephPublicKeyBytes } = await deriveArchiveKey(sessionPublicKeyBase64);
  const nonceBase = crypto.getRandomValues(new Uint8Array(LINK_ARCHIVE_NONCE_BASE_LEN));
  const { ciphertexts, chunkHashes } = await encryptArchiveSlices(built.chunks, key, nonceBase);
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
    // Per-chunk plaintext SHA-256, base64. Carried in the small relay
    // envelope so the NEW device can verify each chunk's plaintext
    // hash incrementally rather than buffering the whole archive.
    chunkPlaintextHashes: built.chunkPlaintextHashes.map((h) => bytesToBase64(h)),
    format: CHUNK_ATOMIC_FORMAT,
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

  // Durable per-archive checkpoint. On reload the NEW device picks up
  // here and skips chunks already committed.
  let checkpoint = await loadCheckpoint(archive.id);
  if (!checkpoint || checkpoint.totalChunks !== archive.totalChunks) {
    checkpoint = await initCheckpoint({
      archiveId: archive.id,
      role: 'import',
      instanceUrl: baseUrl,
      totalChunks: archive.totalChunks,
      status: 'in_progress',
    });
  }

  const slices = new Array(archive.totalChunks);
  // Walk download windows. The server caps each window at its
  // window-size constant; the client makes as many round trips as
  // necessary. For every chunk in a window the URL is presigned (s3)
  // or in-API (postgres_bytea); both resolve to a GET that returns
  // octet-stream bytes, so the same downloadChunkViaWindow helper
  // works for both.
  const windowSize = 8;
  // Branch on archive descriptor format. The chunk-atomic-v1 path
  // processes each chunk independently (decrypt → gunzip → parse →
  // commit) and never buffers the whole archive ciphertext. The
  // legacy monolithic path stays in place for one release window so
  // OLD devices that still ship the v3 descriptor can still link.
  const isChunkAtomic = archive.format === CHUNK_ATOMIC_FORMAT;
  let parsed;
  if (isChunkAtomic) {
    const acc = createParseAccumulator();
    const expectedPlaintextHashes = Array.isArray(archive.chunkPlaintextHashes)
      ? archive.chunkPlaintextHashes.map((h) => base64ToBytes(h))
      : null;

    // Sequential per-chunk processing keeps memory bounded: only one
    // chunk's ciphertext + plaintext is in flight at a time. Window
    // requests still batch network round trips.
    for (let from = 0; from < archive.totalChunks; from += windowSize) {
      const to = Math.min(from + windowSize, archive.totalChunks);
      const window = await requestDownloadWindow(archive.id, archive.downloadToken, from, to, baseUrl);
      // Process chunks in increasing index order to honour record-
      // ordering invariants (META first, END last).
      const sortedEntries = [...window.urls].sort((a, b) => a.idx - b.idx);
      for (const entry of sortedEntries) {
        const ciphertext = await downloadChunkViaWindow(entry);
        const gzippedPlaintext = await decryptArchiveChunk(
          ciphertext, expectedHashes[entry.idx], key, nonceBase, entry.idx,
        );
        const expected = expectedPlaintextHashes ? expectedPlaintextHashes[entry.idx] : null;
        await consumeChunkAtomicChunk(gzippedPlaintext, acc, expected);
        const result = await markChunkCommitted(archive.id, entry.idx);
        checkpoint.chunkProgress = checkpointInternals.setBit(checkpoint.chunkProgress, entry.idx);
        checkpoint.highestContiguous = result.highestContiguous;
      }
    }
    const expectedArchiveSha256 = base64ToBytes(archive.archiveSha256);
    parsed = await finalizeAccumulator(acc, expectedArchiveSha256);
  } else {
    // Legacy monolithic-archive path (descriptor format unset or
    // explicitly 'monolithic-v3'). Removed in the release after
    // every still-running OLD device has been upgraded.
    for (let from = 0; from < archive.totalChunks; from += windowSize) {
      const to = Math.min(from + windowSize, archive.totalChunks);
      const window = await requestDownloadWindow(archive.id, archive.downloadToken, from, to, baseUrl);
      const tasks = window.urls.map((entry) => async () => {
        const ciphertext = await downloadChunkViaWindow(entry);
        slices[entry.idx] = await decryptArchiveChunk(ciphertext, expectedHashes[entry.idx], key, nonceBase, entry.idx);
        const result = await markChunkCommitted(archive.id, entry.idx);
        checkpoint.chunkProgress = checkpointInternals.setBit(checkpoint.chunkProgress, entry.idx);
        checkpoint.highestContiguous = result.highestContiguous;
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
    parsed = await parseArchivePlaintext(plaintext);
  }
  // Mark the durable checkpoint complete and remove it. Failures
  // here are non-fatal — the next link will overwrite the row by
  // archiveId, and the row otherwise gets cleaned up the next time
  // the user starts an import.
  try {
    await markCheckpointComplete(archive.id);
    await deleteCheckpoint(archive.id);
  } catch {
    // ignore checkpoint cleanup errors
  }
  return parsed;
}
