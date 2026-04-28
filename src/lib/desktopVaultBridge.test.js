import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  storeVaultSessionKey,
  retrieveVaultSessionKey,
  clearVaultSessionKey,
} from './desktopVaultBridge';

function makeMockApi(overrides = {}) {
  return {
    isDesktop: true,
    platform: 'darwin',
    getAppVersion: vi.fn().mockResolvedValue('1.0.0'),
    setVaultSessionKey: vi.fn().mockResolvedValue(undefined),
    getVaultSessionKey: vi.fn().mockResolvedValue(null),
    clearVaultSessionKey: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  };
}

describe('desktopVaultBridge', () => {
  let savedHushDesktop;

  beforeEach(() => {
    savedHushDesktop = window.hushDesktop;
  });

  afterEach(() => {
    window.hushDesktop = savedHushDesktop;
  });

  describe('browser context (no window.hushDesktop)', () => {
    beforeEach(() => {
      delete window.hushDesktop;
    });

    it('storeVaultSessionKey resolves without calling any API', async () => {
      await expect(storeVaultSessionKey('user1', 'deadbeef')).resolves.toBeUndefined();
    });

    it('retrieveVaultSessionKey returns null', async () => {
      await expect(retrieveVaultSessionKey('user1')).resolves.toBeNull();
    });

    it('clearVaultSessionKey resolves without calling any API', async () => {
      await expect(clearVaultSessionKey('user1')).resolves.toBeUndefined();
    });
  });

  describe('desktop context (window.hushDesktop present)', () => {
    let api;

    beforeEach(() => {
      api = makeMockApi();
      window.hushDesktop = api;
    });

    it('storeVaultSessionKey calls setVaultSessionKey with correct args', async () => {
      await storeVaultSessionKey('user1', 'deadbeef');
      expect(api.setVaultSessionKey).toHaveBeenCalledOnce();
      expect(api.setVaultSessionKey).toHaveBeenCalledWith('user1', 'deadbeef');
    });

    it('retrieveVaultSessionKey calls getVaultSessionKey and forwards the result', async () => {
      api.getVaultSessionKey.mockResolvedValue('cafebabe');
      const result = await retrieveVaultSessionKey('user1');
      expect(api.getVaultSessionKey).toHaveBeenCalledWith('user1');
      expect(result).toBe('cafebabe');
    });

    it('retrieveVaultSessionKey returns null when no key stored', async () => {
      api.getVaultSessionKey.mockResolvedValue(null);
      expect(await retrieveVaultSessionKey('user1')).toBeNull();
    });

    it('clearVaultSessionKey calls clearVaultSessionKey on the API', async () => {
      await clearVaultSessionKey('user1');
      expect(api.clearVaultSessionKey).toHaveBeenCalledOnce();
      expect(api.clearVaultSessionKey).toHaveBeenCalledWith('user1');
    });
  });
});
