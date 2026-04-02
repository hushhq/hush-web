import { beforeEach, describe, expect, it } from 'vitest';
import {
  exportGuildMetadataKeySnapshot,
  getGuildMetadataKeyBytes,
  importGuildMetadataKeySnapshot,
  openGuildMetadataKeyStore,
  setGuildMetadataKeyBytes,
} from './guildMetadataKeyStore';

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
      const keyBytes = new Uint8Array([1, 2, 3, 4]);
      await setGuildMetadataKeyBytes(db, 'guild-1', keyBytes);
      const loaded = await getGuildMetadataKeyBytes(db, 'guild-1');
      expect(loaded).toEqual(keyBytes);
    } finally {
      db.close();
    }
  });

  it('round-trips a device-link snapshot', async () => {
    const db = await openGuildMetadataKeyStore('user-1', 'device-1');
    try {
      await setGuildMetadataKeyBytes(db, 'guild-1', new Uint8Array([1, 2, 3]));
      await setGuildMetadataKeyBytes(db, 'guild-2', new Uint8Array([4, 5, 6]));
      const snapshot = await exportGuildMetadataKeySnapshot(db);
      expect(snapshot).toEqual({
        version: 1,
        keys: [
          { guildId: 'guild-1', keyBytes: [1, 2, 3] },
          { guildId: 'guild-2', keyBytes: [4, 5, 6] },
        ],
      });

      await importGuildMetadataKeySnapshot(db, {
        version: 1,
        keys: [{ guildId: 'guild-3', keyBytes: [9, 9, 9] }],
      });

      expect(await getGuildMetadataKeyBytes(db, 'guild-1')).toBeNull();
      expect(await getGuildMetadataKeyBytes(db, 'guild-3')).toEqual(new Uint8Array([9, 9, 9]));
    } finally {
      db.close();
    }
  });
});
