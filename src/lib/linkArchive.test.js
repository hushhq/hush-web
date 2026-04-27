/**
 * Pure-crypto tests for the chunked device-link archive helpers.
 */
import { describe, it, expect } from 'vitest';
import {
  LINK_ARCHIVE_CHUNK_SIZE,
  LINK_ARCHIVE_NONCE_BASE_LEN,
  buildArchivePlaintext,
  parseArchivePlaintext,
  splitArchive,
  assembleArchive,
  computeManifestHash,
  deriveArchiveKey,
  deriveArchiveKeyForImport,
  encryptArchiveSlices,
  decryptArchiveChunk,
  chunkNonce,
  constantTimeEqual,
  sha256,
} from './linkArchive';
import { bytesToBase64 } from './deviceLinking';

function makePlaintext(bytes) {
  const out = new Uint8Array(bytes);
  for (let i = 0; i < bytes; i++) out[i] = (i * 31 + 7) & 0xff;
  return out;
}

describe('linkArchive — splitArchive', () => {
  it('splits a 0-leftover archive into exactly the right number of chunks', () => {
    const total = LINK_ARCHIVE_CHUNK_SIZE * 3;
    const slices = splitArchive(makePlaintext(total));
    expect(slices.length).toBe(3);
    for (const s of slices) {
      expect(s.byteLength).toBe(LINK_ARCHIVE_CHUNK_SIZE);
    }
  });

  it('makes the last slice short when the archive does not divide evenly', () => {
    const total = LINK_ARCHIVE_CHUNK_SIZE * 2 + 1234;
    const slices = splitArchive(makePlaintext(total));
    expect(slices.length).toBe(3);
    expect(slices[0].byteLength).toBe(LINK_ARCHIVE_CHUNK_SIZE);
    expect(slices[1].byteLength).toBe(LINK_ARCHIVE_CHUNK_SIZE);
    expect(slices[2].byteLength).toBe(1234);
  });

  it('rejects empty plaintext', () => {
    expect(() => splitArchive(new Uint8Array(0))).toThrow();
  });
});

describe('linkArchive — manifest hash binding', () => {
  it('produces a stable sha256 over the concatenation of chunk hashes', async () => {
    const chunkHashes = [
      new Uint8Array(32).fill(1),
      new Uint8Array(32).fill(2),
      new Uint8Array(32).fill(3),
    ];
    const manifest = await computeManifestHash(chunkHashes);
    expect(manifest.byteLength).toBe(32);
    // Recompute manually to confirm contract.
    const combined = new Uint8Array(96);
    combined.set(chunkHashes[0], 0);
    combined.set(chunkHashes[1], 32);
    combined.set(chunkHashes[2], 64);
    const direct = await sha256(combined);
    expect(constantTimeEqual(manifest, direct)).toBe(true);
  });

  it('rejects non-32-byte chunk hashes', async () => {
    const bad = [new Uint8Array(31)];
    await expect(computeManifestHash(bad)).rejects.toThrow();
  });
});

describe('linkArchive — chunkNonce', () => {
  it('encodes idx as big-endian uint32 in the trailing 4 bytes', () => {
    const base = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]);
    const n = chunkNonce(base, 0x01020304);
    expect(Array.from(n.subarray(0, 8))).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
    expect(Array.from(n.subarray(8))).toEqual([0x01, 0x02, 0x03, 0x04]);
  });

  it('rejects nonceBase that is not 8 bytes', () => {
    expect(() => chunkNonce(new Uint8Array(7), 0)).toThrow();
  });
});

describe('linkArchive — encrypt / decrypt round-trip', () => {
  async function makeKeyPair() {
    return crypto.subtle.generateKey(
      { name: 'ECDH', namedCurve: 'P-256' },
      true,
      ['deriveBits'],
    );
  }

  it('survives encrypt + decrypt + assemble + plaintext sha256 binding', async () => {
    const newDeviceKeyPair = await makeKeyPair();
    const newDeviceSessionPubBytes = new Uint8Array(await crypto.subtle.exportKey('raw', newDeviceKeyPair.publicKey));
    const newDeviceSessionPubBase64 = bytesToBase64(newDeviceSessionPubBytes);

    const plaintext = await buildArchivePlaintext({
      historySnapshot: { version: 1, stores: { mlsGroups: [], mlsCredentials: [] } },
      guildMetadataKeySnapshot: { version: 1, keys: [] },
      transcriptBlob: new Uint8Array([9, 9, 9, 9, 9]),
    });
    const archiveSha = await sha256(plaintext);
    const slices = splitArchive(plaintext);
    const { key, ephPublicKeyBytes } = await deriveArchiveKey(newDeviceSessionPubBase64);
    const nonceBase = crypto.getRandomValues(new Uint8Array(LINK_ARCHIVE_NONCE_BASE_LEN));

    const { ciphertexts, chunkHashes } = await encryptArchiveSlices(slices, key, nonceBase);
    expect(ciphertexts.length).toBe(slices.length);

    const importKey = await deriveArchiveKeyForImport(ephPublicKeyBytes, newDeviceKeyPair.privateKey);
    const recovered = [];
    for (let i = 0; i < ciphertexts.length; i++) {
      recovered.push(await decryptArchiveChunk(ciphertexts[i], chunkHashes[i], importKey, nonceBase, i));
    }
    const reassembled = await assembleArchive(recovered, archiveSha);
    expect(reassembled.byteLength).toBe(plaintext.byteLength);

    const parsed = await parseArchivePlaintext(reassembled);
    expect(parsed.historySnapshot.version).toBe(1);
    expect(parsed.transcriptBlob).toEqual(new Uint8Array([9, 9, 9, 9, 9]));
  });

  it('fails decrypt when chunk ciphertext has been tampered', async () => {
    const newDeviceKeyPair = await makeKeyPair();
    const newDeviceSessionPubBytes = new Uint8Array(await crypto.subtle.exportKey('raw', newDeviceKeyPair.publicKey));
    const plaintext = makePlaintext(8192);
    const slices = [plaintext];
    const { key, ephPublicKeyBytes } = await deriveArchiveKey(bytesToBase64(newDeviceSessionPubBytes));
    const nonceBase = new Uint8Array(LINK_ARCHIVE_NONCE_BASE_LEN);

    const { ciphertexts, chunkHashes } = await encryptArchiveSlices(slices, key, nonceBase);
    const tampered = new Uint8Array(ciphertexts[0]);
    tampered[0] ^= 1;

    const importKey = await deriveArchiveKeyForImport(ephPublicKeyBytes, newDeviceKeyPair.privateKey);
    await expect(decryptArchiveChunk(tampered, chunkHashes[0], importKey, nonceBase, 0)).rejects.toThrow();
  });

  it('fails reassembly when the plaintext sha256 binding does not match', async () => {
    const plaintext = makePlaintext(2048);
    const wrongHash = new Uint8Array(32).fill(0xff);
    await expect(assembleArchive([plaintext], wrongHash)).rejects.toThrow();
  });
});

describe('linkArchive — degraded archive shape', () => {
  it('round-trips a transcript-blob-omitted archive', async () => {
    const plaintext = await buildArchivePlaintext({
      historySnapshot: { version: 1 },
      guildMetadataKeySnapshot: null,
      transcriptBlob: null,
    });
    const parsed = await parseArchivePlaintext(plaintext);
    expect(parsed.transcriptBlob).toBeNull();
  });
});
