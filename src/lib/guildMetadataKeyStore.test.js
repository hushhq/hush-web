import { beforeEach, describe, expect, it } from 'vitest';
import {
  createPendingGuildMetadataKey,
  exportGuildMetadataKeySnapshot,
  getGuildMetadataKeyBytes,
  importGuildMetadataKeySnapshot,
  openGuildMetadataKeyStore,
  promotePendingGuildMetadataKey,
  setGuildMetadataKeyBytes,
} from './guildMetadataKeyStore';

function buildKey(seed) {
  return new Uint8Array(32).fill(seed);
}

describe('guildMetadataKeyStore', () => {
  beforeEach(async () => {
    await new Promise((resolve, reject) => {
      const request = indexedDB.deleteDatabase('hush-guild-metadata-user-1-device-1');
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
      request.onblocked = () => resolve();
    });
  });

  it('stores and loads one guild metadata key', async () => {
    const db = await openGuildMetadataKeyStore('user-1', 'device-1');
    try {
      const keyBytes = buildKey(1);
      await setGuildMetadataKeyBytes(db, 'guild-1', keyBytes);
      const loaded = await getGuildMetadataKeyBytes(db, 'guild-1');
      expect(loaded).toEqual(keyBytes);
    } finally {
      db.close();
    }
  });

  it('promotes a pending key to the created guild id', async () => {
    const db = await openGuildMetadataKeyStore('user-1', 'device-1');
    try {
      const pendingGuildId = await createPendingGuildMetadataKey(db, buildKey(2));
      await promotePendingGuildMetadataKey(db, pendingGuildId, 'guild-1');

      expect(await getGuildMetadataKeyBytes(db, pendingGuildId)).toBeNull();
      expect(await getGuildMetadataKeyBytes(db, 'guild-1')).toEqual(buildKey(2));
    } finally {
      db.close();
    }
  });

  it('excludes pending and invalid rows from the device-link snapshot', async () => {
    const db = await openGuildMetadataKeyStore('user-1', 'device-1');
    try {
      await setGuildMetadataKeyBytes(db, 'guild-1', buildKey(3));
      await createPendingGuildMetadataKey(db, buildKey(4));

      const tx = db.transaction('guild_keys', 'readwrite');
      tx.objectStore('guild_keys').put({
        guildId: 'guild-corrupt',
        keyBytes: [1, 2, 3],
        updatedAt: Date.now(),
      });
      await new Promise((resolve, reject) => {
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
        tx.onabort = () => reject(tx.error);
      });

      const snapshot = await exportGuildMetadataKeySnapshot(db);
      expect(snapshot).toEqual({
        version: 1,
        keys: [{ guildId: 'guild-1', keyBytes: Array.from(buildKey(3)) }],
      });
    } finally {
      db.close();
    }
  });

  it('drops corrupt stored keys on read so callers can fall back', async () => {
    const db = await openGuildMetadataKeyStore('user-1', 'device-1');
    try {
      const tx = db.transaction('guild_keys', 'readwrite');
      tx.objectStore('guild_keys').put({
        guildId: 'guild-corrupt',
        keyBytes: [1, 2, 3],
        updatedAt: Date.now(),
      });
      await new Promise((resolve, reject) => {
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
        tx.onabort = () => reject(tx.error);
      });

      expect(await getGuildMetadataKeyBytes(db, 'guild-corrupt')).toBeNull();

      const verifyTx = db.transaction('guild_keys', 'readonly');
      const row = await new Promise((resolve, reject) => {
        const request = verifyTx.objectStore('guild_keys').get('guild-corrupt');
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
      await new Promise((resolve, reject) => {
        verifyTx.oncomplete = () => resolve();
        verifyTx.onerror = () => reject(verifyTx.error);
        verifyTx.onabort = () => reject(verifyTx.error);
      });
      expect(row).toBeUndefined();
    } finally {
      db.close();
    }
  });

  it('round-trips a device-link snapshot', async () => {
    const db = await openGuildMetadataKeyStore('user-1', 'device-1');
    try {
      await setGuildMetadataKeyBytes(db, 'guild-1', buildKey(5));
      await setGuildMetadataKeyBytes(db, 'guild-2', buildKey(6));
      const snapshot = await exportGuildMetadataKeySnapshot(db);
      expect(snapshot).toEqual({
        version: 1,
        keys: [
          { guildId: 'guild-1', keyBytes: Array.from(buildKey(5)) },
          { guildId: 'guild-2', keyBytes: Array.from(buildKey(6)) },
        ],
      });

      await importGuildMetadataKeySnapshot(db, {
        version: 1,
        keys: [
          { guildId: 'guild-3', keyBytes: Array.from(buildKey(7)) },
          { guildId: 'guild-ignored', keyBytes: [9, 9, 9] },
        ],
      });

      expect(await getGuildMetadataKeyBytes(db, 'guild-1')).toBeNull();
      expect(await getGuildMetadataKeyBytes(db, 'guild-3')).toEqual(buildKey(7));
      expect(await getGuildMetadataKeyBytes(db, 'guild-ignored')).toBeNull();
    } finally {
      db.close();
    }
  });
});
