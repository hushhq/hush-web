/**
 * ApproveDeviceLinkFlow — embedded-mode coverage. The page-mode
 * behaviour is exercised end-to-end by src/pages/LinkDevice.test.jsx
 * (32 tests) which renders the page through the same flow component.
 *
 * This file pins the embedded-mode contract:
 *   - layout shell is bare (no home-page / home-form-card classes)
 *   - onCancel is fired by the Close/Back actions
 *   - locked vault surfaces an Unlock button that calls
 *     onVaultUnlockNeeded (caller-owned navigation)
 */
import { describe, it, expect, vi, afterEach, beforeAll } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

beforeAll(() => {
  if (!window.matchMedia) {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockReturnValue({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }),
    });
  }
});

const authState = {
  user: { id: 'u1', username: 'me', displayName: 'Me' },
  token: 'tok',
  loading: false,
  hasSession: true,
  hasVault: true,
  isVaultUnlocked: true,
  needsUnlock: false,
  identityKeyRef: {
    current: { privateKey: new Uint8Array(32), publicKey: new Uint8Array(32) },
  },
};

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => authState,
}));

vi.mock('../../hooks/useAuth', () => ({
  getDeviceId: () => 'device-current',
}));

const resolveDeviceLinkRequest = vi.fn();
const verifyDeviceLinkRequest = vi.fn();
vi.mock('../../lib/api', () => ({
  resolveDeviceLinkRequest: (...args) => resolveDeviceLinkRequest(...args),
  verifyDeviceLinkRequest: (...args) => verifyDeviceLinkRequest(...args),
}));

vi.mock('../../lib/deviceLinking', () => ({
  bytesToBase64: () => '',
  certifyDevice: vi.fn(),
  decodeQRPayload: () => ({ requestId: 'r', secret: 's' }),
  encodeTransferBundle: vi.fn(),
  encryptRelayPayload: vi.fn(),
  base64ToBytes: () => new Uint8Array(),
  // Real impl: see src/lib/deviceLinking.js. Mocked inline so we
  // don't pull in the whole module's crypto deps for the rendered
  // component but still get fail-closed behavior on mismatch.
  claimMatchesPayloadKeys: (payload, claim) => {
    if (!payload || !claim) return false;
    if (payload.devicePublicKey
      && payload.devicePublicKey !== claim.devicePublicKey) return false;
    if (payload.sessionPublicKey
      && payload.sessionPublicKey !== claim.sessionPublicKey) return false;
    return true;
  },
}));

vi.mock('../../lib/mlsStore', () => ({
  openStore: vi.fn(),
  listAllLocalPlaintexts: vi.fn().mockResolvedValue([]),
  exportHistorySnapshot: vi.fn().mockResolvedValue({}),
}));

vi.mock('../../lib/preDecryptForLinkExport', () => ({
  preDecryptForLinkExport: vi.fn().mockResolvedValue({}),
}));

vi.mock('../../lib/transcriptVault', () => ({
  buildTranscriptBlobForExport: vi.fn(),
  listTranscriptCacheEntries: () => [],
}));

vi.mock('../../lib/guildMetadataKeyStore', () => ({
  exportGuildMetadataKeySnapshot: vi.fn().mockResolvedValue({}),
  openGuildMetadataKeyStore: vi.fn(),
}));

vi.mock('../../lib/linkArchiveSession', () => ({
  uploadArchiveSession: vi.fn(),
  resumeUploadArchiveSession: vi.fn(),
}));

vi.mock('../../lib/linkArchiveExportStore', () => ({
  sweepStaleExports: vi.fn().mockResolvedValue(),
  findResumableExport: vi.fn().mockResolvedValue(null),
  deleteExport: vi.fn(),
}));

vi.mock('../../lib/linkArchiveTransport', () => ({
  deleteArchive: vi.fn(),
}));

vi.mock('../QRCodeScanner', () => ({
  default: () => null,
}));

import ApproveDeviceLinkFlow from './ApproveDeviceLinkFlow.jsx';

describe('ApproveDeviceLinkFlow (embedded mode)', () => {
  afterEach(() => {
    cleanup();
    resolveDeviceLinkRequest.mockReset();
    verifyDeviceLinkRequest.mockReset();
    authState.hasSession = true;
    authState.hasVault = true;
    authState.isVaultUnlocked = true;
    authState.needsUnlock = false;
    authState.identityKeyRef = {
      current: {
        privateKey: new Uint8Array(32),
        publicKey: new Uint8Array(32),
      },
    };
  });

  it('uses a bare flex shell, not the legacy ld-card / home-form-card layout', () => {
    const { container } = render(
      <ApproveDeviceLinkFlow
        mode="embedded"
        initialPayload={null}
        onCancel={vi.fn()}
        onVaultUnlockNeeded={vi.fn()}
      />
    );

    // Embedded shell is a plain flex column. The page-mode classes
    // (.glass, .home-form-card, .ld-card) must not leak into the
    // embedded surface — they ship full-bleed styling that breaks
    // the settings dialog.
    expect(container.querySelector('.home-form-card')).toBeNull();
    expect(container.querySelector('.ld-card')).toBeNull();
    expect(container.querySelector('.flex.flex-col.gap-4')).not.toBeNull();
  });

  it('fires onCancel when the Close button is pressed', async () => {
    const onCancel = vi.fn();
    render(
      <ApproveDeviceLinkFlow
        mode="embedded"
        initialPayload={null}
        onCancel={onCancel}
        onVaultUnlockNeeded={vi.fn()}
      />
    );

    const u = userEvent.setup();
    await u.click(screen.getByRole('button', { name: /^close$/i }));

    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('routes resolveDeviceLinkRequest through homeInstanceUrl in embedded mode', async () => {
    resolveDeviceLinkRequest.mockResolvedValueOnce({
      claimToken: 'ct',
      sessionPublicKey: 'sk',
      devicePublicKey: 'dk',
      label: 'New phone',
      deviceId: 'dev-new',
      expiresAt: new Date(Date.now() + 60_000).toISOString(),
      instanceUrl: '',
    });

    render(
      <ApproveDeviceLinkFlow
        mode="embedded"
        initialPayload={{ requestId: 'req', secret: 'sec' }}
        homeInstanceUrl="https://home.example.com"
        onCancel={vi.fn()}
        onVaultUnlockNeeded={vi.fn()}
      />
    );

    // initialPayload auto-fires resolveRequest. Embedded mode must
    // route the call to the auth (home) instance, not the current
    // origin — the bug GPT review caught.
    await screen.findByText(/new phone/i);
    expect(resolveDeviceLinkRequest).toHaveBeenCalledTimes(1);
    expect(resolveDeviceLinkRequest).toHaveBeenCalledWith(
      'tok',
      { requestId: 'req', secret: 'sec' },
      'https://home.example.com',
    );
  });

  it('falls back to "" when no homeInstanceUrl is provided (page mode)', async () => {
    resolveDeviceLinkRequest.mockResolvedValueOnce({
      claimToken: 'ct',
      sessionPublicKey: 'sk',
      devicePublicKey: 'dk',
      label: 'New phone',
      deviceId: 'dev-new',
      expiresAt: new Date(Date.now() + 60_000).toISOString(),
      instanceUrl: '',
    });

    render(
      <ApproveDeviceLinkFlow
        mode="page"
        initialPayload={{ requestId: 'req', secret: 'sec' }}
        onCancel={vi.fn()}
        onVaultUnlockNeeded={vi.fn()}
      />
    );

    await screen.findByText(/new phone/i);
    expect(resolveDeviceLinkRequest).toHaveBeenCalledWith(
      'tok',
      { requestId: 'req', secret: 'sec' },
      '',
    );
  });

  it('shows the locked-vault gate and routes Unlock through onVaultUnlockNeeded', async () => {
    authState.needsUnlock = true;
    authState.isVaultUnlocked = false;
    authState.identityKeyRef = { current: null };

    const onVaultUnlockNeeded = vi.fn();
    render(
      <ApproveDeviceLinkFlow
        mode="embedded"
        initialPayload={null}
        onCancel={vi.fn()}
        onVaultUnlockNeeded={onVaultUnlockNeeded}
      />
    );

    expect(
      screen.getByText(/this browser is recognized for your hush account/i)
    ).toBeInTheDocument();

    const u = userEvent.setup();
    await u.click(
      screen.getByRole('button', { name: /unlock to approve/i })
    );

    expect(onVaultUnlockNeeded).toHaveBeenCalledTimes(1);
  });

  it('accepts the claim when QR-committed device + session keys match the resolved claim', async () => {
    resolveDeviceLinkRequest.mockResolvedValueOnce({
      claimToken: 'ct',
      sessionPublicKey: 'sk-good',
      devicePublicKey: 'dk-good',
      label: 'New phone',
      deviceId: 'dev-new',
      expiresAt: new Date(Date.now() + 60_000).toISOString(),
      instanceUrl: '',
    });

    render(
      <ApproveDeviceLinkFlow
        mode="embedded"
        initialPayload={{
          requestId: 'req',
          secret: 'sec',
          devicePublicKey: 'dk-good',
          sessionPublicKey: 'sk-good',
        }}
        homeInstanceUrl="https://home.example.com"
        onCancel={vi.fn()}
        onVaultUnlockNeeded={vi.fn()}
      />
    );

    await screen.findByText(/new phone/i);
    expect(resolveDeviceLinkRequest).toHaveBeenCalledTimes(1);
  });

  it('rejects the claim and does not show approval UI when committed devicePublicKey differs', async () => {
    resolveDeviceLinkRequest.mockResolvedValueOnce({
      claimToken: 'ct',
      sessionPublicKey: 'sk-good',
      // Server-substituted device key.
      devicePublicKey: 'dk-evil',
      label: 'New phone',
      deviceId: 'dev-new',
      expiresAt: new Date(Date.now() + 60_000).toISOString(),
      instanceUrl: '',
    });

    render(
      <ApproveDeviceLinkFlow
        mode="embedded"
        initialPayload={{
          requestId: 'req',
          secret: 'sec',
          devicePublicKey: 'dk-good',
          sessionPublicKey: 'sk-good',
        }}
        homeInstanceUrl="https://home.example.com"
        onCancel={vi.fn()}
        onVaultUnlockNeeded={vi.fn()}
      />
    );

    await screen.findByText(/device link verification failed/i);
    // No claim label rendered.
    expect(screen.queryByText(/new phone/i)).toBeNull();
    // No verify call kicked off.
    expect(verifyDeviceLinkRequest).not.toHaveBeenCalled();
  });

  it('rejects the claim when committed sessionPublicKey differs', async () => {
    resolveDeviceLinkRequest.mockResolvedValueOnce({
      claimToken: 'ct',
      // Server-substituted session key.
      sessionPublicKey: 'sk-evil',
      devicePublicKey: 'dk-good',
      label: 'New phone',
      deviceId: 'dev-new',
      expiresAt: new Date(Date.now() + 60_000).toISOString(),
      instanceUrl: '',
    });

    render(
      <ApproveDeviceLinkFlow
        mode="embedded"
        initialPayload={{
          requestId: 'req',
          secret: 'sec',
          devicePublicKey: 'dk-good',
          sessionPublicKey: 'sk-good',
        }}
        homeInstanceUrl="https://home.example.com"
        onCancel={vi.fn()}
        onVaultUnlockNeeded={vi.fn()}
      />
    );

    await screen.findByText(/device link verification failed/i);
    expect(screen.queryByText(/new phone/i)).toBeNull();
    expect(verifyDeviceLinkRequest).not.toHaveBeenCalled();
  });

  it('fallback-code flow (no committed keys) still resolves and shows the claim', async () => {
    resolveDeviceLinkRequest.mockResolvedValueOnce({
      claimToken: 'ct',
      sessionPublicKey: 'sk-any',
      devicePublicKey: 'dk-any',
      label: 'Phone via code',
      deviceId: 'dev-new',
      expiresAt: new Date(Date.now() + 60_000).toISOString(),
      instanceUrl: '',
    });

    render(
      <ApproveDeviceLinkFlow
        mode="embedded"
        initialPayload={null}
        homeInstanceUrl="https://home.example.com"
        onCancel={vi.fn()}
        onVaultUnlockNeeded={vi.fn()}
      />
    );

    const u = userEvent.setup();
    await u.type(screen.getByPlaceholderText(/abcd1234/i), 'ABCDEFGH');
    await u.click(screen.getByRole('button', { name: /resolve code/i }));

    await screen.findByText(/phone via code/i);
    expect(resolveDeviceLinkRequest).toHaveBeenCalledWith(
      'tok',
      { code: 'ABCDEFGH' },
      'https://home.example.com',
    );
  });
});
