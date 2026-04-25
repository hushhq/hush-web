/**
 * Tests for transcriptVault.js — encrypted transcript-cache transfer + at-rest store.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import 'fake-indexeddb/auto';
import {
  deriveTranscriptKey,
  encryptTranscriptBlob,
  decryptTranscriptBlob,
  openTranscriptStore,
  saveTranscriptBlob,
  loadTranscriptBlob,
  deleteTranscriptDatabase,
  setTranscriptCache,
  getTranscriptEntry,
  clearTranscriptCache,
  getTranscriptCacheStatus,
  buildTranscriptBlobForExport,
  importAndReprotectTranscriptBlob,
  loadTranscriptCacheFromDisk,
} from './transcriptVault';

let userCounter = 0;
function nextUserId() {
  userCounter += 1;
  return `user-${userCounter}-${Date.now()}`;
}

const ROOT_KEY_A = new Uint8Array(32).fill(0xa5);
const ROOT_KEY_B = new Uint8Array(32).fill(0x42);

const SAMPLE_ROWS = [
  { messageId: 'm1', plaintext: 'hello', senderId: 'alice', timestamp: 1000 },
  { messageId: 'm2', plaintext: 'goodbye', senderId: 'bob', timestamp: 2000 },
  { messageId: 'm3', plaintext: 'self note', timestamp: 3000 },
];

describe('transcriptVault — key derivation', () => {
  it('derives the same key for the same root identity', async () => {
    const k1 = await deriveTranscriptKey(ROOT_KEY_A);
    const k2 = await deriveTranscriptKey(ROOT_KEY_A);
    const blob = await encryptTranscriptBlob(k1, SAMPLE_ROWS);
    const rows = await decryptTranscriptBlob(k2, blob);
    expect(rows).toEqual(SAMPLE_ROWS);
  });

  it('derives a different key for a different root identity', async () => {
    const ka = await deriveTranscriptKey(ROOT_KEY_A);
    const kb = await deriveTranscriptKey(ROOT_KEY_B);
    const blob = await encryptTranscriptBlob(ka, SAMPLE_ROWS);
    await expect(decryptTranscriptBlob(kb, blob)).rejects.toBeDefined();
  });

  it('rejects an empty private key', async () => {
    await expect(deriveTranscriptKey(new Uint8Array(0))).rejects.toThrow(/non-empty/);
  });
});

describe('transcriptVault — encrypt/decrypt round-trip', () => {
  it('round-trips an array of rows including optional senderId', async () => {
    const key = await deriveTranscriptKey(ROOT_KEY_A);
    const blob = await encryptTranscriptBlob(key, SAMPLE_ROWS);
    expect(blob.byteLength).toBeGreaterThan(12);
    const rows = await decryptTranscriptBlob(key, blob);
    expect(rows).toEqual(SAMPLE_ROWS);
  });

  it('round-trips an empty rows array', async () => {
    const key = await deriveTranscriptKey(ROOT_KEY_A);
    const blob = await encryptTranscriptBlob(key, []);
    const rows = await decryptTranscriptBlob(key, blob);
    expect(rows).toEqual([]);
  });

  it('produces a different ciphertext on each call (fresh nonce)', async () => {
    const key = await deriveTranscriptKey(ROOT_KEY_A);
    const a = await encryptTranscriptBlob(key, SAMPLE_ROWS);
    const b = await encryptTranscriptBlob(key, SAMPLE_ROWS);
    expect(Array.from(a)).not.toEqual(Array.from(b));
  });

  it('rejects a tampered blob', async () => {
    const key = await deriveTranscriptKey(ROOT_KEY_A);
    const blob = await encryptTranscriptBlob(key, SAMPLE_ROWS);
    blob[blob.length - 1] ^= 0xff;
    await expect(decryptTranscriptBlob(key, blob)).rejects.toBeDefined();
  });

  it('rejects a blob shorter than the nonce', async () => {
    const key = await deriveTranscriptKey(ROOT_KEY_A);
    await expect(decryptTranscriptBlob(key, new Uint8Array(5))).rejects.toThrow(/invalid/);
  });
});

describe('transcriptVault — IDB persistence', () => {
  let userId;
  beforeEach(() => {
    userId = nextUserId();
  });

  it('save then load round-trips the blob bytes', async () => {
    const key = await deriveTranscriptKey(ROOT_KEY_A);
    const blob = await encryptTranscriptBlob(key, SAMPLE_ROWS);
    const db = await openTranscriptStore(userId);
    try {
      await saveTranscriptBlob(db, blob);
      const loaded = await loadTranscriptBlob(db);
      expect(loaded).not.toBeNull();
      expect(Array.from(loaded)).toEqual(Array.from(blob));
    } finally {
      db.close();
    }
  });

  it('load returns null when no blob has been saved yet', async () => {
    const db = await openTranscriptStore(userId);
    try {
      const loaded = await loadTranscriptBlob(db);
      expect(loaded).toBeNull();
    } finally {
      db.close();
    }
  });

  it('deleteTranscriptDatabase removes the per-user IDB', async () => {
    const key = await deriveTranscriptKey(ROOT_KEY_A);
    const blob = await encryptTranscriptBlob(key, SAMPLE_ROWS);
    const db = await openTranscriptStore(userId);
    await saveTranscriptBlob(db, blob);
    db.close();

    await deleteTranscriptDatabase(userId);

    const db2 = await openTranscriptStore(userId);
    try {
      const loaded = await loadTranscriptBlob(db2);
      expect(loaded).toBeNull();
    } finally {
      db2.close();
    }
  });
});

describe('transcriptVault — in-memory cache', () => {
  beforeEach(() => clearTranscriptCache());

  it('starts empty and reports unloaded', () => {
    const status = getTranscriptCacheStatus();
    expect(status.loaded).toBe(false);
    expect(status.size).toBe(0);
  });

  it('setTranscriptCache populates entries by messageId', () => {
    setTranscriptCache('user-x', SAMPLE_ROWS);
    expect(getTranscriptCacheStatus().loaded).toBe(true);
    expect(getTranscriptCacheStatus().size).toBe(3);
    expect(getTranscriptEntry('m1')).toEqual(SAMPLE_ROWS[0]);
    expect(getTranscriptEntry('does-not-exist')).toBeNull();
  });

  it('clearTranscriptCache empties the cache and resets the loaded flag', () => {
    setTranscriptCache('user-x', SAMPLE_ROWS);
    clearTranscriptCache();
    expect(getTranscriptEntry('m1')).toBeNull();
    expect(getTranscriptCacheStatus().loaded).toBe(false);
  });

  it('setTranscriptCache replaces previous entries (not merges)', () => {
    setTranscriptCache('user-x', SAMPLE_ROWS);
    setTranscriptCache('user-x', [SAMPLE_ROWS[0]]);
    expect(getTranscriptCacheStatus().size).toBe(1);
    expect(getTranscriptEntry('m2')).toBeNull();
  });
});

describe('transcriptVault — link export + import flow', () => {
  let userId;
  beforeEach(() => {
    userId = nextUserId();
    clearTranscriptCache();
  });

  it('buildTranscriptBlobForExport produces a blob the same root can decrypt', async () => {
    const blob = await buildTranscriptBlobForExport(ROOT_KEY_A, SAMPLE_ROWS);
    const key = await deriveTranscriptKey(ROOT_KEY_A);
    const rows = await decryptTranscriptBlob(key, blob);
    expect(rows).toEqual(SAMPLE_ROWS);
  });

  it('importAndReprotectTranscriptBlob decrypts inbound, re-encrypts under fresh nonce, persists locally', async () => {
    const inbound = await buildTranscriptBlobForExport(ROOT_KEY_A, SAMPLE_ROWS);
    const rows = await importAndReprotectTranscriptBlob({
      userId,
      rootPrivateKey: ROOT_KEY_A,
      inboundBlob: inbound,
    });
    expect(rows).toEqual(SAMPLE_ROWS);

    const db = await openTranscriptStore(userId);
    let stored;
    try {
      stored = await loadTranscriptBlob(db);
    } finally {
      db.close();
    }
    expect(stored).not.toBeNull();
    // Re-protected: must NOT be byte-identical to the inbound blob.
    expect(Array.from(stored)).not.toEqual(Array.from(inbound));
    // But still decryptable with the same root-derived key.
    const key = await deriveTranscriptKey(ROOT_KEY_A);
    const reRows = await decryptTranscriptBlob(key, stored);
    expect(reRows).toEqual(SAMPLE_ROWS);
  });

  it('importAndReprotectTranscriptBlob rejects when the root key cannot decrypt the inbound blob', async () => {
    const inbound = await buildTranscriptBlobForExport(ROOT_KEY_A, SAMPLE_ROWS);
    await expect(importAndReprotectTranscriptBlob({
      userId,
      rootPrivateKey: ROOT_KEY_B,
      inboundBlob: inbound,
    })).rejects.toBeDefined();
  });

  it('loadTranscriptCacheFromDisk returns 0 and seeds an empty cache when no blob is stored', async () => {
    const n = await loadTranscriptCacheFromDisk({
      userId,
      rootPrivateKey: ROOT_KEY_A,
    });
    expect(n).toBe(0);
    expect(getTranscriptCacheStatus().loaded).toBe(true);
    expect(getTranscriptCacheStatus().size).toBe(0);
  });

  it('loadTranscriptCacheFromDisk decrypts the stored blob and seeds the in-memory cache', async () => {
    const inbound = await buildTranscriptBlobForExport(ROOT_KEY_A, SAMPLE_ROWS);
    await importAndReprotectTranscriptBlob({
      userId,
      rootPrivateKey: ROOT_KEY_A,
      inboundBlob: inbound,
    });

    const n = await loadTranscriptCacheFromDisk({
      userId,
      rootPrivateKey: ROOT_KEY_A,
    });
    expect(n).toBe(SAMPLE_ROWS.length);
    expect(getTranscriptEntry('m2')).toEqual(SAMPLE_ROWS[1]);
  });
});

describe('transcriptVault — generation guard against stale hydrates', () => {
  let userId;
  beforeEach(() => {
    userId = nextUserId();
    clearTranscriptCache();
  });

  it('clearTranscriptCache mid-load prevents stale loadTranscriptCacheFromDisk from re-populating', async () => {
    // Seed the disk so loadTranscriptCacheFromDisk would normally repopulate.
    const inbound = await buildTranscriptBlobForExport(ROOT_KEY_A, SAMPLE_ROWS);
    await importAndReprotectTranscriptBlob({
      userId,
      rootPrivateKey: ROOT_KEY_A,
      inboundBlob: inbound,
    });
    // The import path itself eagerly seeded the cache. Drop it explicitly to
    // simulate "vault was unlocked, started a hydrate, then locked".
    clearTranscriptCache();
    expect(getTranscriptCacheStatus().loaded).toBe(false);

    // Start a hydrate and, before its inner awaits resolve, simulate a vault
    // lock by clearing the cache. The hydrate must NOT repopulate after.
    const hydratePromise = loadTranscriptCacheFromDisk({
      userId,
      rootPrivateKey: ROOT_KEY_A,
    });
    clearTranscriptCache();

    const n = await hydratePromise;
    expect(n).toBe(0);
    expect(getTranscriptCacheStatus().loaded).toBe(false);
    expect(getTranscriptEntry('m1')).toBeNull();
  });

  it('setTranscriptCache mid-load prevents stale hydrate from overwriting the freshly seeded rows', async () => {
    const inboundFromOldDevice = await buildTranscriptBlobForExport(ROOT_KEY_A, SAMPLE_ROWS);
    await importAndReprotectTranscriptBlob({
      userId,
      rootPrivateKey: ROOT_KEY_A,
      inboundBlob: inboundFromOldDevice,
    });

    // Pretend a fresh-seeded cache from completeDeviceLink — different rows.
    const freshRows = [
      { messageId: 'mFresh', plaintext: 'fresh row from link', senderId: 'alice', timestamp: 9999 },
    ];
    setTranscriptCache(userId, freshRows);
    expect(getTranscriptEntry('mFresh').plaintext).toBe('fresh row from link');

    // A simultaneously-running hydrate (e.g. from a still-pending unlock fire-
    // and-forget) must NOT clobber the freshly seeded cache.
    const hydratePromise = loadTranscriptCacheFromDisk({
      userId,
      rootPrivateKey: ROOT_KEY_A,
    });
    // No clear in between — the eager seed already bumped the generation,
    // so the hydrate that snapshotted before the seed is now stale.
    setTranscriptCache(userId, freshRows); // re-seed (also bumps gen) to be sure
    const n = await hydratePromise;
    expect(n).toBe(0);
    expect(getTranscriptEntry('mFresh').plaintext).toBe('fresh row from link');
    expect(getTranscriptEntry('m1')).toBeNull();
  });
});
