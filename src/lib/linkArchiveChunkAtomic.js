/**
 * Chunk-atomic device-link archive format (`format='chunk-atomic-v1'`).
 *
 * Each chunk's plaintext is a self-contained sequence of complete
 * records, gzipped independently. AEAD encryption then wraps each
 * chunk's gzip output. The NEW device decrypts + gunzips + parses one
 * chunk at a time, dispatching each record to its target consumer
 * before moving on. No "concat all chunks then gunzip the whole thing"
 * step.
 *
 * Records (binary framing):
 *
 *     [type:u8][len:u32 LE][payload:len]
 *
 *   type 0x01  META          payload = JSON.stringify({ transcriptBlobBytes: int,
 *                                                          historyBytes?: int,
 *                                                          metadataBytes?: int })
 *   type 0x02  HISTORY       payload = JSON.stringify(historySnapshot)             — used when the snapshot fits in one record
 *   type 0x03  METADATA_KEYS payload = JSON.stringify(guildMetadataKeySnapshot)    — used when the snapshot fits in one record
 *   type 0x04  TRANS_PART    payload = contiguous slice of transcriptBlob bytes
 *   type 0x05  HIST_PART     payload = contiguous slice of JSON.stringify(historySnapshot) bytes — used when the snapshot needs subdivision
 *   type 0x06  METADATA_PART payload = contiguous slice of JSON.stringify(guildMetadataKeySnapshot) bytes — used when the snapshot needs subdivision
 *   type 0xFF  END           payload = empty
 *
 * The OLD device picks single-record vs subdivided emission per
 * snapshot independently. When subdivision is used, META declares the
 * total byte length of the JSON-encoded snapshot (`historyBytes` /
 * `metadataBytes`); the NEW device concatenates all *_PART records in
 * arrival order and JSON.parses the result. Receivers must accept
 * either form for forward compatibility.
 *
 * OLD device packs records left-to-right; a new chunk is started when
 * the next record would exceed `chunkSize`. Records cannot straddle a
 * chunk boundary; large transcript blobs are subdivided into
 * `TRANS_PART` records. The `META` record always lives in chunk 0;
 * `END` is the last record of the last chunk.
 *
 * archiveSha256 (under format='chunk-atomic-v1' semantics) is
 * `sha256(concat(per-chunk plaintext sha256))`. Both sides compute
 * incrementally so neither side ever holds the full archive plaintext
 * to hash.
 */
import { gunzipBytes, gzipBytes } from './compression';
import { sha256, constantTimeEqual } from './linkArchive';
import { base64ToBytes, bytesToBase64 } from './deviceLinking';

export const CHUNK_ATOMIC_FORMAT = 'chunk-atomic-v1';

const RECORD_META = 0x01;
const RECORD_HISTORY = 0x02;
const RECORD_METADATA_KEYS = 0x03;
const RECORD_TRANS_PART = 0x04;
const RECORD_HIST_PART = 0x05;
const RECORD_METADATA_PART = 0x06;
const RECORD_END = 0xff;

const RECORD_HEADER_LEN = 5; // u8 type + u32 len

// ---------------------------------------------------------------------------
// Encoding helpers
// ---------------------------------------------------------------------------

function encodeRecord(type, payload) {
  const header = new Uint8Array(RECORD_HEADER_LEN);
  header[0] = type;
  const len = payload.byteLength;
  header[1] = len & 0xff;
  header[2] = (len >>> 8) & 0xff;
  header[3] = (len >>> 16) & 0xff;
  header[4] = (len >>> 24) & 0xff;
  const out = new Uint8Array(RECORD_HEADER_LEN + len);
  out.set(header, 0);
  out.set(payload, RECORD_HEADER_LEN);
  return out;
}

function readU32LE(view, offset) {
  return view[offset]
    | (view[offset + 1] << 8)
    | (view[offset + 2] << 16)
    | (view[offset + 3] << 24);
}

// ---------------------------------------------------------------------------
// OLD-device build pipeline
// ---------------------------------------------------------------------------

/**
 * Build the chunk-atomic archive. Returns an array of pre-gzipped per-
 * chunk plaintexts plus the precomputed archiveSha256 (per-format
 * semantics) and per-chunk pre-gzip-plaintext SHA-256 list.
 *
 * @param {{
 *   historySnapshot: object|null,
 *   guildMetadataKeySnapshot: object|null,
 *   transcriptBlob: Uint8Array|null,
 *   chunkSize: number,
 * }} params
 * @returns {Promise<{
 *   chunks: Uint8Array[],
 *   archiveSha256: Uint8Array,
 *   chunkPlaintextHashes: Uint8Array[],
 *   transcriptByteLen: number,
 * }>}
 */
export async function buildChunkAtomicArchive({
  historySnapshot,
  guildMetadataKeySnapshot,
  transcriptBlob,
  chunkSize,
}) {
  if (!Number.isInteger(chunkSize) || chunkSize <= RECORD_HEADER_LEN + 16) {
    throw new Error('[linkArchiveChunkAtomic] chunkSize too small');
  }

  const encoder = new TextEncoder();
  const transcriptBytes = transcriptBlob ?? new Uint8Array(0);
  const partMax = chunkSize - RECORD_HEADER_LEN;

  const historyPayload = encoder.encode(JSON.stringify(historySnapshot ?? null));
  const metadataPayload = encoder.encode(JSON.stringify(guildMetadataKeySnapshot ?? null));

  const historyFitsInOne = historyPayload.byteLength + RECORD_HEADER_LEN <= chunkSize;
  const metadataFitsInOne = metadataPayload.byteLength + RECORD_HEADER_LEN <= chunkSize;

  // META declares total JSON-encoded byte counts only when the
  // corresponding snapshot needed subdivision; legacy single-record
  // emissions omit those fields so older parsers stay compatible.
  const metaShape = { transcriptBlobBytes: transcriptBytes.byteLength };
  if (!historyFitsInOne) metaShape.historyBytes = historyPayload.byteLength;
  if (!metadataFitsInOne) metaShape.metadataBytes = metadataPayload.byteLength;
  const metaPayload = encoder.encode(JSON.stringify(metaShape));

  const records = [];
  records.push({ type: RECORD_META, payload: metaPayload });

  if (historyFitsInOne) {
    records.push({ type: RECORD_HISTORY, payload: historyPayload });
  } else {
    appendPartRecords(records, RECORD_HIST_PART, historyPayload, partMax);
  }

  if (metadataFitsInOne) {
    records.push({ type: RECORD_METADATA_KEYS, payload: metadataPayload });
  } else {
    appendPartRecords(records, RECORD_METADATA_PART, metadataPayload, partMax);
  }

  // Subdivide transcriptBlob into TRANS_PART records. Each part fits
  // alone in a chunk so it can be packed together with other small
  // records or stand on its own.
  appendPartRecords(records, RECORD_TRANS_PART, transcriptBytes, partMax);
  records.push({ type: RECORD_END, payload: new Uint8Array(0) });

  // Pack records into chunks. Greedy: open chunk, append records
  // until next record won't fit, close chunk.
  const plainChunks = []; // pre-gzip per-chunk concatenations
  let cur = [];
  let curLen = 0;
  for (const r of records) {
    const recordLen = RECORD_HEADER_LEN + r.payload.byteLength;
    if (curLen > 0 && curLen + recordLen > chunkSize) {
      plainChunks.push(concatRecords(cur));
      cur = [];
      curLen = 0;
    }
    cur.push(encodeRecord(r.type, r.payload));
    curLen += recordLen;
  }
  if (cur.length > 0) plainChunks.push(concatRecords(cur));

  // Per-chunk plaintext SHA-256 (used by archiveSha256 and by
  // bounded-memory verification on the NEW side).
  const chunkPlaintextHashes = await Promise.all(plainChunks.map((b) => sha256(b)));

  // archiveSha256 = sha256(concat(per-chunk-plaintext-sha256))
  const concatHashes = new Uint8Array(chunkPlaintextHashes.length * 32);
  for (let i = 0; i < chunkPlaintextHashes.length; i++) {
    concatHashes.set(chunkPlaintextHashes[i], i * 32);
  }
  const archiveSha256 = await sha256(concatHashes);

  // gzip each chunk's plaintext independently — the chunk-atomic
  // property: each chunk is one complete gzip member.
  const chunks = await Promise.all(plainChunks.map((b) => gzipBytes(b)));

  return {
    chunks,
    archiveSha256,
    chunkPlaintextHashes,
    transcriptByteLen: transcriptBytes.byteLength,
  };
}

// assembleJsonFromParts concatenates HIST_PART / METADATA_PART payloads
// into a single byte buffer, verifies the total length against the
// META-declared byte count, and JSON.parses the UTF-8 decoding.
// `label` is included in error messages so the caller can tell history
// from metadata.
function assembleJsonFromParts(parts, declaredBytes, label) {
  let total = 0;
  for (const p of parts) total += p.byteLength;
  if (total !== declaredBytes) {
    throw new Error(`[linkArchiveChunkAtomic] ${label} byte mismatch: declared ${declaredBytes}, parts sum ${total}`);
  }
  if (declaredBytes === 0) return null;
  const buf = new Uint8Array(total);
  let off = 0;
  for (const p of parts) {
    buf.set(p, off);
    off += p.byteLength;
  }
  return JSON.parse(new TextDecoder().decode(buf));
}

// appendPartRecords subdivides `payload` into pieces no larger than
// `partMax` bytes each and appends one record per piece using `type`
// as the record header. Empty payloads yield zero records, which is
// what the receiver expects (e.g. transcripts of length 0).
function appendPartRecords(records, type, payload, partMax) {
  for (let off = 0; off < payload.byteLength; off += partMax) {
    const end = Math.min(off + partMax, payload.byteLength);
    records.push({ type, payload: payload.subarray(off, end) });
  }
}

function concatRecords(parts) {
  let total = 0;
  for (const p of parts) total += p.byteLength;
  const out = new Uint8Array(total);
  let off = 0;
  for (const p of parts) {
    out.set(p, off);
    off += p.byteLength;
  }
  return out;
}

// ---------------------------------------------------------------------------
// NEW-device parse pipeline
// ---------------------------------------------------------------------------

/**
 * Mutable accumulator threaded through every chunk parse. The caller
 * starts with `createParseAccumulator()`, feeds chunks one at a time
 * via `consumeChunk`, and reads `finalize()` after the END record.
 */
export function createParseAccumulator() {
  return {
    historySnapshot: null,
    guildMetadataKeySnapshot: null,
    transcriptParts: /** @type {Uint8Array[]} */ ([]),
    historyParts: /** @type {Uint8Array[]} */ ([]),
    metadataParts: /** @type {Uint8Array[]} */ ([]),
    transcriptByteLen: -1,
    historyByteLen: -1,    // -1 = META did not declare; expect single HISTORY record
    metadataByteLen: -1,   // -1 = META did not declare; expect single METADATA_KEYS record
    sawMeta: false,
    sawHistory: false,
    sawMetadata: false,
    sawEnd: false,
    runningPlaintextHashes: /** @type {Uint8Array[]} */ ([]),
  };
}

/**
 * Decrypt + gunzip + parse a single chunk. The acc is mutated.
 * Verifies the per-chunk plaintext SHA-256 against
 * `expectedPlaintextSha256` if non-null (the NEW device receives this
 * list inside the small relay envelope; if it is omitted, the chunk
 * still parses but the layered archiveSha256 check is weaker).
 *
 * @param {Uint8Array} gzippedPlaintext - already-AEAD-decrypted bytes
 * @param {object} acc
 * @param {Uint8Array|null} expectedPlaintextSha256
 */
export async function consumeChunk(gzippedPlaintext, acc, expectedPlaintextSha256 = null) {
  const plaintext = await gunzipBytes(gzippedPlaintext);
  if (expectedPlaintextSha256 != null) {
    const actual = await sha256(plaintext);
    if (!constantTimeEqual(actual, expectedPlaintextSha256)) {
      throw new Error('[linkArchiveChunkAtomic] chunk plaintext sha256 mismatch');
    }
    acc.runningPlaintextHashes.push(actual);
  }

  let off = 0;
  const decoder = new TextDecoder();
  while (off < plaintext.byteLength) {
    if (off + RECORD_HEADER_LEN > plaintext.byteLength) {
      throw new Error('[linkArchiveChunkAtomic] truncated record header');
    }
    const type = plaintext[off];
    const len = readU32LE(plaintext, off + 1);
    const payloadStart = off + RECORD_HEADER_LEN;
    const payloadEnd = payloadStart + len;
    if (payloadEnd > plaintext.byteLength) {
      throw new Error('[linkArchiveChunkAtomic] record payload extends beyond chunk plaintext');
    }
    const payload = plaintext.subarray(payloadStart, payloadEnd);
    switch (type) {
      case RECORD_META: {
        if (acc.sawMeta) throw new Error('[linkArchiveChunkAtomic] duplicate META record');
        const meta = JSON.parse(decoder.decode(payload));
        if (!Number.isInteger(meta.transcriptBlobBytes) || meta.transcriptBlobBytes < 0) {
          throw new Error('[linkArchiveChunkAtomic] META.transcriptBlobBytes invalid');
        }
        acc.transcriptByteLen = meta.transcriptBlobBytes;
        if (meta.historyBytes != null) {
          if (!Number.isInteger(meta.historyBytes) || meta.historyBytes < 0) {
            throw new Error('[linkArchiveChunkAtomic] META.historyBytes invalid');
          }
          acc.historyByteLen = meta.historyBytes;
        }
        if (meta.metadataBytes != null) {
          if (!Number.isInteger(meta.metadataBytes) || meta.metadataBytes < 0) {
            throw new Error('[linkArchiveChunkAtomic] META.metadataBytes invalid');
          }
          acc.metadataByteLen = meta.metadataBytes;
        }
        acc.sawMeta = true;
        break;
      }
      case RECORD_HISTORY: {
        if (acc.sawHistory) throw new Error('[linkArchiveChunkAtomic] duplicate HISTORY record');
        acc.historySnapshot = JSON.parse(decoder.decode(payload));
        acc.sawHistory = true;
        break;
      }
      case RECORD_METADATA_KEYS: {
        if (acc.sawMetadata) throw new Error('[linkArchiveChunkAtomic] duplicate METADATA_KEYS record');
        acc.guildMetadataKeySnapshot = JSON.parse(decoder.decode(payload));
        acc.sawMetadata = true;
        break;
      }
      case RECORD_TRANS_PART: {
        // Copy the slice — the underlying chunk buffer goes out of
        // scope after this function returns.
        acc.transcriptParts.push(new Uint8Array(payload));
        break;
      }
      case RECORD_HIST_PART: {
        if (acc.sawHistory) {
          throw new Error('[linkArchiveChunkAtomic] HIST_PART after HISTORY record');
        }
        acc.historyParts.push(new Uint8Array(payload));
        break;
      }
      case RECORD_METADATA_PART: {
        if (acc.sawMetadata) {
          throw new Error('[linkArchiveChunkAtomic] METADATA_PART after METADATA_KEYS record');
        }
        acc.metadataParts.push(new Uint8Array(payload));
        break;
      }
      case RECORD_END: {
        if (off + RECORD_HEADER_LEN !== plaintext.byteLength) {
          throw new Error('[linkArchiveChunkAtomic] data after END record in chunk');
        }
        acc.sawEnd = true;
        break;
      }
      default:
        throw new Error(`[linkArchiveChunkAtomic] unknown record type 0x${type.toString(16)}`);
    }
    off = payloadEnd;
  }
}

/**
 * Finalise the accumulator into the high-level archive triple. Must be
 * called only after the chunk that carries the END record has been
 * consumed.
 *
 * @param {object} acc
 * @param {Uint8Array|null} expectedArchiveSha256
 * @returns {Promise<{ historySnapshot: object|null, guildMetadataKeySnapshot: object|null, transcriptBlob: Uint8Array|null }>}
 */
export async function finalizeAccumulator(acc, expectedArchiveSha256 = null) {
  if (!acc.sawEnd) throw new Error('[linkArchiveChunkAtomic] END record never seen');
  if (!acc.sawMeta) throw new Error('[linkArchiveChunkAtomic] META record never seen');

  // History: either single HISTORY record (legacy) or HIST_PART parts
  // declared by META.historyBytes. Receivers accept both.
  if (!acc.sawHistory) {
    if (acc.historyByteLen < 0) {
      throw new Error('[linkArchiveChunkAtomic] HISTORY record never seen and META.historyBytes not declared');
    }
    acc.historySnapshot = assembleJsonFromParts(
      acc.historyParts, acc.historyByteLen, 'historySnapshot',
    );
  } else if (acc.historyParts.length > 0) {
    throw new Error('[linkArchiveChunkAtomic] mixed HISTORY and HIST_PART records');
  }

  if (!acc.sawMetadata) {
    if (acc.metadataByteLen < 0) {
      throw new Error('[linkArchiveChunkAtomic] METADATA_KEYS record never seen and META.metadataBytes not declared');
    }
    acc.guildMetadataKeySnapshot = assembleJsonFromParts(
      acc.metadataParts, acc.metadataByteLen, 'guildMetadataKeySnapshot',
    );
  } else if (acc.metadataParts.length > 0) {
    throw new Error('[linkArchiveChunkAtomic] mixed METADATA_KEYS and METADATA_PART records');
  }

  let transcriptBlob = null;
  if (acc.transcriptByteLen > 0) {
    let total = 0;
    for (const p of acc.transcriptParts) total += p.byteLength;
    if (total !== acc.transcriptByteLen) {
      throw new Error(`[linkArchiveChunkAtomic] transcript byte mismatch: declared ${acc.transcriptByteLen}, parts sum ${total}`);
    }
    transcriptBlob = new Uint8Array(total);
    let off = 0;
    for (const p of acc.transcriptParts) {
      transcriptBlob.set(p, off);
      off += p.byteLength;
    }
  } else if (acc.transcriptParts.length > 0) {
    throw new Error('[linkArchiveChunkAtomic] META said zero transcript bytes but TRANS_PART records arrived');
  }

  if (expectedArchiveSha256 != null) {
    if (acc.runningPlaintextHashes.length === 0) {
      throw new Error('[linkArchiveChunkAtomic] expectedArchiveSha256 supplied but per-chunk hashes were not verified');
    }
    const concat = new Uint8Array(acc.runningPlaintextHashes.length * 32);
    for (let i = 0; i < acc.runningPlaintextHashes.length; i++) {
      concat.set(acc.runningPlaintextHashes[i], i * 32);
    }
    const computed = await sha256(concat);
    if (!constantTimeEqual(computed, expectedArchiveSha256)) {
      throw new Error('[linkArchiveChunkAtomic] archiveSha256 (chunk-atomic) mismatch');
    }
  }

  return {
    historySnapshot: acc.historySnapshot,
    guildMetadataKeySnapshot: acc.guildMetadataKeySnapshot,
    transcriptBlob,
  };
}

// Re-exports kept narrow on purpose; callers reach for these helpers
// from linkArchiveSession.js.
export const _internals = {
  RECORD_META,
  RECORD_HISTORY,
  RECORD_METADATA_KEYS,
  RECORD_TRANS_PART,
  RECORD_HIST_PART,
  RECORD_METADATA_PART,
  RECORD_END,
  encodeRecord,
  readU32LE,
};
export { bytesToBase64, base64ToBytes };
