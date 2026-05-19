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
import { describe, it, expect, vi, afterEach, beforeAll, beforeEach } from 'vitest';
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

const getInstanceToken = vi.fn(() => null);
vi.mock('../../hooks/useAuth', () => ({
  getDeviceId: () => 'device-current',
  getInstanceToken: (url) => getInstanceToken(url),
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
import * as mlsStore from '../../lib/mlsStore';
import {
  certifyDevice,
  encodeTransferBundle,
  encryptRelayPayload,
} from '../../lib/deviceLinking';
import { preDecryptForLinkExport } from '../../lib/preDecryptForLinkExport';
import { uploadArchiveSession } from '../../lib/linkArchiveSession';

describe('ApproveDeviceLinkFlow (embedded mode)', () => {
  beforeEach(() => {
    // Default: explicit homeInstanceUrl resolves to the same active
    // token so existing assertions stay valid. Per-test overrides
    // exercise the cross-instance security branches.
    getInstanceToken.mockReset();
    getInstanceToken.mockImplementation(() => 'tok');
    resolveDeviceLinkRequest.mockReset();
    verifyDeviceLinkRequest.mockReset();
    preDecryptForLinkExport.mockClear();
    uploadArchiveSession.mockReset();
    uploadArchiveSession.mockResolvedValue({
      id: 'archive-1',
      downloadToken: 'download-token',
      uploadToken: 'upload-token',
      totalChunks: 1,
      totalBytes: 128,
      chunkSize: 128,
      manifestHash: 'manifest-hash',
      archiveSha256: 'archive-sha256',
      format: 'hush-link-archive/v1',
      chunkPlaintextHashes: ['plain-hash'],
      ephPub: 'eph-pub',
      nonceBase: 'nonce-base',
      transcriptBlobOmitted: true,
    });
    mlsStore.openStore.mockResolvedValue({ close: vi.fn() });
    encodeTransferBundle.mockReturnValue(new Uint8Array([1, 2, 3]));
    certifyDevice.mockResolvedValue(new Uint8Array([4, 5, 6]));
    encryptRelayPayload.mockResolvedValue({
      relayPayload: 'relay-payload',
      relayIv: 'relay-iv',
      relayPublicKey: 'relay-public-key',
    });
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

  afterEach(() => {
    cleanup();
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

  it('falls back to the current HTTP origin when no homeInstanceUrl is provided', async () => {
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
      'http://localhost:3000',
    );
  });

  it('normalizes desktop app origins to the hosted instance', async () => {
    resolveDeviceLinkRequest.mockResolvedValueOnce({
      claimToken: 'ct',
      sessionPublicKey: 'sk',
      devicePublicKey: 'dk',
      label: 'New phone',
      deviceId: 'dev-new',
      expiresAt: new Date(Date.now() + 60_000).toISOString(),
      instanceUrl: 'app://localhost',
    });

    render(
      <ApproveDeviceLinkFlow
        mode="embedded"
        initialPayload={{ requestId: 'req', secret: 'sec' }}
        homeInstanceUrl="app://localhost"
        onCancel={vi.fn()}
        onVaultUnlockNeeded={vi.fn()}
      />
    );

    await screen.findByText(/new phone/i);
    expect(screen.getByText('https://app.gethush.live')).toBeInTheDocument();
    expect(resolveDeviceLinkRequest).toHaveBeenCalledWith(
      'tok',
      { requestId: 'req', secret: 'sec' },
      'https://app.gethush.live',
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

  it('resolveDeviceLinkRequest uses the home-instance namespaced token, not the active token', async () => {
    // Active token belongs to a different instance; home instance has
    // its own namespaced token. Resolve MUST use the home token.
    authState.token = 'active-tok-foreign';
    getInstanceToken.mockImplementation((url) =>
      url === 'https://home.example.com' ? 'home-tok' : null,
    );
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

    await screen.findByText(/new phone/i);
    expect(resolveDeviceLinkRequest).toHaveBeenCalledWith(
      'home-tok',
      { requestId: 'req', secret: 'sec' },
      'https://home.example.com',
    );
    expect(resolveDeviceLinkRequest).not.toHaveBeenCalledWith(
      'active-tok-foreign',
      expect.anything(),
      expect.anything(),
    );
  });

  it('approve flow uses the home-instance namespaced token for predecrypt, upload, and verify', async () => {
    authState.token = 'active-tok-foreign';
    getInstanceToken.mockImplementation((url) =>
      url === 'https://home.example.com' ? 'home-tok' : null,
    );
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

    const u = userEvent.setup();
    await u.click(await screen.findByRole('button', { name: /approve link/i }));

    expect(preDecryptForLinkExport).toHaveBeenCalledWith(
      expect.objectContaining({
        token: 'home-tok',
        baseUrl: 'https://home.example.com',
      }),
    );
    expect(uploadArchiveSession).toHaveBeenCalledWith(
      expect.objectContaining({
        token: 'home-tok',
        baseUrl: 'https://home.example.com',
      }),
    );
    expect(verifyDeviceLinkRequest).toHaveBeenCalledWith(
      'home-tok',
      expect.objectContaining({ claimToken: 'ct' }),
      'https://home.example.com',
    );
    expect(verifyDeviceLinkRequest).not.toHaveBeenCalledWith(
      'active-tok-foreign',
      expect.anything(),
      expect.anything(),
    );
  });

  it('does NOT call resolveDeviceLinkRequest when explicit homeInstanceUrl has no namespaced token', async () => {
    authState.token = 'active-tok';
    getInstanceToken.mockImplementation(() => null);

    render(
      <ApproveDeviceLinkFlow
        mode="embedded"
        initialPayload={{ requestId: 'req', secret: 'sec' }}
        homeInstanceUrl="https://home.example.com"
        onCancel={vi.fn()}
        onVaultUnlockNeeded={vi.fn()}
      />
    );

    expect(
      await screen.findByText(/sign in to the home instance/i),
    ).toBeInTheDocument();
    expect(resolveDeviceLinkRequest).not.toHaveBeenCalled();
  });
});
