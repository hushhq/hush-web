/**
 * Chunk-atomic archive format: encode/decode round-trip.
 */
import { describe, it, expect } from 'vitest';
import {
  buildChunkAtomicArchive,
  consumeChunk,
  createParseAccumulator,
  finalizeAccumulator,
  CHUNK_ATOMIC_FORMAT,
} from './linkArchiveChunkAtomic';
import { gunzipBytes } from './compression';

describe('chunk-atomic archive — encode/decode round-trip', () => {
  it('packs small archive into one or more chunks and round-trips faithfully', async () => {
    const history = { version: 1, stores: { credential: [{ key: 'c', signingPublicKey: [1, 2, 3] }] } };
    const metadata = { version: 1, keys: [{ guildId: 'g', keyBytes: [9, 8, 7] }] };
    const transcript = new Uint8Array([10, 11, 12, 13, 14, 15, 16, 17]);

    const built = await buildChunkAtomicArchive({
      historySnapshot: history,
      guildMetadataKeySnapshot: metadata,
      transcriptBlob: transcript,
      chunkSize: 256,
    });
    expect(built.chunks.length).toBeGreaterThan(0);
    expect(built.archiveSha256).toBeInstanceOf(Uint8Array);
    expect(built.archiveSha256.byteLength).toBe(32);

    // Each chunk is independently gunzippable.
    for (const c of built.chunks) {
      const plain = await gunzipBytes(c);
      expect(plain.byteLength).toBeGreaterThan(0);
    }

    // Process per chunk via the parser.
    const acc = createParseAccumulator();
    for (let i = 0; i < built.chunks.length; i++) {
      const plain = await gunzipBytes(built.chunks[i]);
      await consumeChunk(built.chunks[i], acc, built.chunkPlaintextHashes[i]);
      // Manual verification: per-chunk plaintext hash matches.
      // gunzipBytes was just used for sanity above; consumeChunk
      // re-gunzips internally.
      void plain;
    }
    const out = await finalizeAccumulator(acc, built.archiveSha256);
    expect(out.historySnapshot).toEqual(history);
    expect(out.guildMetadataKeySnapshot).toEqual(metadata);
    expect(Array.from(out.transcriptBlob ?? [])).toEqual(Array.from(transcript));
  });

  it('accepts a transcript larger than one chunk and reassembles in order', async () => {
    const history = { version: 1, stores: {} };
    const metadata = { version: 1, keys: [] };
    const transcript = new Uint8Array(8 * 1024);
    for (let i = 0; i < transcript.byteLength; i++) transcript[i] = i & 0xff;

    const chunkSize = 1024;
    const built = await buildChunkAtomicArchive({
      historySnapshot: history,
      guildMetadataKeySnapshot: metadata,
      transcriptBlob: transcript,
      chunkSize,
    });
    expect(built.chunks.length).toBeGreaterThan(1);

    const acc = createParseAccumulator();
    for (let i = 0; i < built.chunks.length; i++) {
      await consumeChunk(built.chunks[i], acc, built.chunkPlaintextHashes[i]);
    }
    const out = await finalizeAccumulator(acc, built.archiveSha256);
    expect(out.transcriptBlob.byteLength).toBe(transcript.byteLength);
    expect(Array.from(out.transcriptBlob)).toEqual(Array.from(transcript));
  });

  it('round-trips an archive without a transcript', async () => {
    const built = await buildChunkAtomicArchive({
      historySnapshot: { version: 1 },
      guildMetadataKeySnapshot: null,
      transcriptBlob: null,
      chunkSize: 1024,
    });
    const acc = createParseAccumulator();
    for (let i = 0; i < built.chunks.length; i++) {
      await consumeChunk(built.chunks[i], acc, built.chunkPlaintextHashes[i]);
    }
    const out = await finalizeAccumulator(acc, built.archiveSha256);
    expect(out.transcriptBlob).toBeNull();
    expect(out.historySnapshot).toEqual({ version: 1 });
    expect(out.guildMetadataKeySnapshot).toBeNull();
  });

  it('rejects tampered chunk plaintext via per-chunk hash mismatch', async () => {
    const built = await buildChunkAtomicArchive({
      historySnapshot: { version: 1 },
      guildMetadataKeySnapshot: null,
      transcriptBlob: null,
      chunkSize: 1024,
    });
    const acc = createParseAccumulator();
    const wrongHash = new Uint8Array(32).fill(0xff);
    await expect(consumeChunk(built.chunks[0], acc, wrongHash)).rejects.toThrow(/chunk plaintext sha256 mismatch/);
  });

  it('rejects archive sha mismatch at finalize', async () => {
    const built = await buildChunkAtomicArchive({
      historySnapshot: { version: 1 },
      guildMetadataKeySnapshot: null,
      transcriptBlob: null,
      chunkSize: 1024,
    });
    const acc = createParseAccumulator();
    for (let i = 0; i < built.chunks.length; i++) {
      await consumeChunk(built.chunks[i], acc, built.chunkPlaintextHashes[i]);
    }
    const wrong = new Uint8Array(32).fill(0xee);
    await expect(finalizeAccumulator(acc, wrong)).rejects.toThrow(/archiveSha256.*mismatch/);
  });

  it('publishes the canonical format identifier', () => {
    expect(CHUNK_ATOMIC_FORMAT).toBe('chunk-atomic-v1');
  });

  it('subdivides a history snapshot that does not fit in a single chunk', async () => {
    // Build a history snapshot whose JSON encoding clearly exceeds
    // chunkSize - RECORD_HEADER_LEN, forcing the OLD device down the
    // HIST_PART subdivision path.
    const bigArray = new Array(2000).fill('xxxxxxxxxxxxxxxxxxxx');
    const history = { version: 1, stores: { huge: bigArray } };
    const metadata = { version: 1, keys: [] };

    const built = await buildChunkAtomicArchive({
      historySnapshot: history,
      guildMetadataKeySnapshot: metadata,
      transcriptBlob: null,
      chunkSize: 1024,
    });
    expect(built.chunks.length).toBeGreaterThan(1);

    const acc = createParseAccumulator();
    for (let i = 0; i < built.chunks.length; i++) {
      await consumeChunk(built.chunks[i], acc, built.chunkPlaintextHashes[i]);
    }
    const out = await finalizeAccumulator(acc, built.archiveSha256);
    expect(out.historySnapshot).toEqual(history);
    expect(out.guildMetadataKeySnapshot).toEqual(metadata);
    expect(out.transcriptBlob).toBeNull();
  });

  it('subdivides a guildMetadataKeySnapshot that does not fit in a single chunk', async () => {
    const history = { version: 1, stores: {} };
    const keys = [];
    for (let i = 0; i < 200; i++) {
      keys.push({
        guildId: `guild-${i}`,
        keyBytes: Array.from({ length: 64 }, (_, j) => (i + j) & 0xff),
      });
    }
    const metadata = { version: 1, keys };

    const built = await buildChunkAtomicArchive({
      historySnapshot: history,
      guildMetadataKeySnapshot: metadata,
      transcriptBlob: null,
      chunkSize: 1024,
    });
    expect(built.chunks.length).toBeGreaterThan(1);

    const acc = createParseAccumulator();
    for (let i = 0; i < built.chunks.length; i++) {
      await consumeChunk(built.chunks[i], acc, built.chunkPlaintextHashes[i]);
    }
    const out = await finalizeAccumulator(acc, built.archiveSha256);
    expect(out.guildMetadataKeySnapshot).toEqual(metadata);
  });

  it('round-trips with both history and metadata subdivided plus a multi-chunk transcript', async () => {
    const big = (n) => new Array(n).fill('y').join('');
    const history = { version: 1, payload: big(8192) };
    const metadata = { version: 1, payload: big(4096) };
    const transcript = new Uint8Array(6000);
    for (let i = 0; i < transcript.byteLength; i++) transcript[i] = i & 0xff;

    const built = await buildChunkAtomicArchive({
      historySnapshot: history,
      guildMetadataKeySnapshot: metadata,
      transcriptBlob: transcript,
      chunkSize: 1024,
    });
    expect(built.chunks.length).toBeGreaterThan(2);

    const acc = createParseAccumulator();
    for (let i = 0; i < built.chunks.length; i++) {
      await consumeChunk(built.chunks[i], acc, built.chunkPlaintextHashes[i]);
    }
    const out = await finalizeAccumulator(acc, built.archiveSha256);
    expect(out.historySnapshot).toEqual(history);
    expect(out.guildMetadataKeySnapshot).toEqual(metadata);
    expect(Array.from(out.transcriptBlob)).toEqual(Array.from(transcript));
  });
});
