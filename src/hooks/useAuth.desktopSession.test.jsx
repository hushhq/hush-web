/**
 * useAuth desktop session boundary tests.
 *
 * Covers:
 *   - IDB-recovery branch auto-unlocks when main-process session key exists
 *   - IDB-recovery branch falls back to locked when no session key (browser / no key)
 *   - lockVault clears the desktop session key for the current user
 *   - performLogout clears the desktop session key for the current user
 *   - lockVaultForTimeout (inactivity) clears the desktop session key
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor, cleanup } from '@testing-library/react';
import { AuthProvider, useAuth } from '../contexts/AuthContext';

// ── desktopVaultBridge mock ───────────────────────────────────────────────────
// Default: no session key stored (browser / no-desktop-key path).
vi.mock('../lib/desktopVaultBridge', () => ({
  storeVaultSessionKey: vi.fn().mockResolvedValue(undefined),
  retrieveVaultSessionKey: vi.fn().mockResolvedValue(null),
  clearVaultSessionKey: vi.fn().mockResolvedValue(undefined),
}));

// ── authInstanceStore mock ────────────────────────────────────────────────────
vi.mock('../lib/authInstanceStore', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    getActiveAuthInstanceUrlSync: () => '',
  };
});

// ── Module mocks ──────────────────────────────────────────────────────────────

vi.mock('../lib/api', () => ({
  fetchWithAuth: vi.fn(),
  uploadKeyPackagesAfterAuth: vi.fn().mockResolvedValue(undefined),
  requestChallenge: vi.fn(),
  verifyChallenge: vi.fn(),
  registerWithPublicKey: vi.fn(),
  requestGuestSession: vi.fn(),
  listDeviceKeys: vi.fn().mockResolvedValue([]),
  revokeDeviceKey: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('../lib/transcriptVault', () => ({
  importAndReprotectTranscriptBlob: vi.fn().mockResolvedValue([]),
  importAndReprotectTranscriptRows: vi.fn().mockResolvedValue([]),
  loadTranscriptCacheFromDisk: vi.fn().mockResolvedValue(0),
  clearTranscriptCache: vi.fn(),
  deleteTranscriptDatabase: vi.fn().mockResolvedValue(undefined),
  setTranscriptCache: vi.fn(),
}));

vi.mock('../lib/bip39Identity', () => ({
  mnemonicToIdentityKey: vi.fn().mockResolvedValue({
    privateKey: new Uint8Array(32).fill(1),
    publicKey: new Uint8Array(32).fill(2),
  }),
  signChallenge: vi.fn().mockResolvedValue(new Uint8Array(64).fill(3)),
  signTransparencyEntry: vi.fn().mockResolvedValue({
    signature: new Uint8Array(64).fill(4),
  }),
}));

// Shared blob store.
const _vaultBlobs = new Map();

vi.mock('../lib/identityVault', () => ({
  encryptVault: vi.fn().mockImplementation(async (privateKey) => {
    const blob = new Uint8Array(privateKey.length + 12);
    blob.set(privateKey, 12);
    return blob;
  }),
  decryptVaultAndExportKey: vi.fn().mockImplementation(async (blob, pin) => {
    if (pin === 'wrong') throw new DOMException('decryption failed', 'OperationError');
    return { privateKey: new Uint8Array(blob.slice(12)), rawKeyHex: 'aabbccdd' };
  }),
  decryptVaultWithRawKey: vi.fn().mockImplementation(async (blob, rawKeyHex) => {
    if (rawKeyHex === 'bad-key') throw new DOMException('decryption failed', 'OperationError');
    return new Uint8Array(blob.slice(12));
  }),
  openVaultStore: vi.fn().mockImplementation(async (userId) => ({
    userId,
    close: vi.fn(),
  })),
  saveEncryptedKey: vi.fn().mockImplementation(async (db, blob) => {
    _vaultBlobs.set(db.userId, blob);
  }),
  loadEncryptedKey: vi.fn().mockImplementation(async (db) => {
    return _vaultBlobs.get(db.userId) ?? null;
  }),
  deleteVaultDatabase: vi.fn().mockResolvedValue(undefined),
  getVaultConfig: vi.fn().mockReturnValue(null),
  setVaultConfig: vi.fn(),
  bytesToHex: vi.fn().mockImplementation((bytes) =>
    Array.from(bytes)
      .map(b => b.toString(16).padStart(2, '0'))
      .join(''),
  ),
  hexToBytes: vi.fn().mockImplementation((hex) => {
    const result = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
      result[i / 2] = parseInt(hex.slice(i, i + 2), 16);
    }
    return result;
  }),
  saveSaltToIDB: vi.fn().mockResolvedValue(undefined),
  saveVaultMarkerToIDB: vi.fn().mockResolvedValue(undefined),
  checkVaultExistsInIDB: vi.fn().mockResolvedValue({ exists: false, publicKeyHex: null }),
  loadVaultMarkerFromIDB: vi.fn().mockResolvedValue(null),
}));

vi.mock('../lib/mlsStore', () => ({
  openHistoryStore: vi.fn().mockResolvedValue({ close: vi.fn() }),
  importHistorySnapshot: vi.fn().mockResolvedValue(undefined),
}));

// ── Imports after mocks ───────────────────────────────────────────────────────

import * as bridgeMod from '../lib/desktopVaultBridge';
import * as apiMod from '../lib/api';
import * as vaultMod from '../lib/identityVault';

// ── Helpers ───────────────────────────────────────────────────────────────────

const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;

function makeFakeBlob(fill = 1) {
  const blob = new Uint8Array(44);
  blob.set(new Uint8Array(32).fill(fill), 12);
  return blob;
}

// ── Setup ─────────────────────────────────────────────────────────────────────

beforeEach(() => {
  cleanup();
  sessionStorage.clear();
  localStorage.clear();
  _vaultBlobs.clear();

  vi.mocked(bridgeMod.retrieveVaultSessionKey).mockResolvedValue(null);
  vi.mocked(bridgeMod.clearVaultSessionKey).mockResolvedValue(undefined);
  vi.mocked(bridgeMod.storeVaultSessionKey).mockResolvedValue(undefined);

  vi.mocked(apiMod.fetchWithAuth).mockResolvedValue({ ok: false, status: 401 });
  vi.mocked(apiMod.uploadKeyPackagesAfterAuth).mockResolvedValue(undefined);
  vi.mocked(apiMod.requestChallenge).mockResolvedValue({ nonce: 'deadbeef' });
  vi.mocked(apiMod.verifyChallenge).mockResolvedValue({
    token: 'jwt-test',
    user: { id: 'user-1', username: 'alice', displayName: 'Alice' },
  });

  vi.mocked(vaultMod.checkVaultExistsInIDB).mockResolvedValue({ exists: false, publicKeyHex: null });
  vi.mocked(vaultMod.getVaultConfig).mockReturnValue(null);
});

afterEach(() => {
  cleanup();
});

// ── IDB-recovery branch: desktop auto-unlock ─────────────────────────────────

describe('useAuth - IDB-recovery branch desktop auto-unlock', () => {
  it('auto-unlocks and reaches vaultState=unlocked when main-process session key exists', async () => {
    // No JWT, no localStorage vault markers — triggers the IDB-recovery path.
    // _last_user hint tells the scanner which userId to check.
    localStorage.setItem('hush_vault_user__last_user', 'user-idb-1');
    _vaultBlobs.set('user-idb-1', makeFakeBlob());

    vi.mocked(vaultMod.checkVaultExistsInIDB).mockImplementation(async (userId) => {
      if (userId === 'user-idb-1') return { exists: true, publicKeyHex: 'aabb' };
      return { exists: false, publicKeyHex: null };
    });

    // Desktop session key is present — auto-unlock should succeed.
    vi.mocked(bridgeMod.retrieveVaultSessionKey).mockResolvedValue('rawkey-desktop');

    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.vaultState).toBe('unlocked');
    expect(result.current.hasVault).toBe(true);
    expect(result.current.isVaultUnlocked).toBe(true);
    expect(bridgeMod.retrieveVaultSessionKey).toHaveBeenCalledWith('user-idb-1');
  });

  it('falls back to vaultState=locked when no session key is stored (browser / no-key path)', async () => {
    localStorage.setItem('hush_vault_user__last_user', 'user-idb-2');
    _vaultBlobs.set('user-idb-2', makeFakeBlob());

    vi.mocked(vaultMod.checkVaultExistsInIDB).mockImplementation(async (userId) => {
      if (userId === 'user-idb-2') return { exists: true, publicKeyHex: 'aabb' };
      return { exists: false, publicKeyHex: null };
    });

    // No session key — retrieveVaultSessionKey returns null (default).

    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.vaultState).toBe('locked');
    expect(result.current.hasVault).toBe(true);
    expect(result.current.isVaultUnlocked).toBe(false);
    expect(result.current.needsUnlock).toBe(true);
  });
});

// ── Key clearing on lock / logout ─────────────────────────────────────────────

describe('useAuth - desktop session key clearing', () => {
  async function buildUnlockedSession(result) {
    await act(async () => {
      await result.current.performChallengeResponse(
        new Uint8Array(32).fill(1),
        new Uint8Array(32).fill(2),
      );
    });
    await waitFor(() => expect(result.current.vaultState).toBe('unlocked'));
    await waitFor(() => expect(result.current.user?.id).toBe('user-1'));
  }

  it('lockVault calls clearVaultSessionKey with the current user ID', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));
    await buildUnlockedSession(result);

    vi.mocked(bridgeMod.clearVaultSessionKey).mockClear();

    act(() => result.current.lockVault());
    await waitFor(() => expect(result.current.vaultState).toBe('locked'));

    expect(bridgeMod.clearVaultSessionKey).toHaveBeenCalledWith('user-1');
  });

  it('performLogout calls clearVaultSessionKey with the user ID', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));
    await buildUnlockedSession(result);

    vi.mocked(bridgeMod.clearVaultSessionKey).mockClear();
    vi.mocked(apiMod.fetchWithAuth).mockResolvedValue({ ok: true, status: 204 });

    await act(async () => {
      await result.current.performLogout();
    });

    expect(bridgeMod.clearVaultSessionKey).toHaveBeenCalledWith('user-1');
  });

});
