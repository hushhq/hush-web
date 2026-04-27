import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import LinkDevice from './LinkDevice.jsx';

const {
  authState,
  mockQrToDataUrl,
  mockCreateDeviceLinkRequest,
  mockConsumeDeviceLinkResult,
  mockResolveDeviceLinkRequest,
  mockVerifyDeviceLinkRequest,
  mockCreateDeviceIdentity,
  mockCreateSessionKeyPair,
  mockBuildLinkApprovalUrl,
  mockChooseInstance,
  authInstanceSelectionState,
  mockOpenStore,
  mockExportHistorySnapshot,
  mockBytesToBase64,
  mockCertifyDevice,
  mockBase64ToBytes,
  mockEncodeTransferBundle,
  mockEncryptRelayPayload,
  mockPreDecryptForLinkExport,
  mockOpenGuildMetadataKeyStore,
  mockExportGuildMetadataKeySnapshot,
  mockListAllLocalPlaintexts,
  mockBuildTranscriptBlobForExport,
  mockUploadArchiveSession,
  mockDownloadArchiveSession,
  mockDeleteArchive,
} = vi.hoisted(() => ({
  authState: { current: null },
  mockQrToDataUrl: vi.fn(),
  mockCreateDeviceLinkRequest: vi.fn(),
  mockConsumeDeviceLinkResult: vi.fn(),
  mockResolveDeviceLinkRequest: vi.fn(),
  mockVerifyDeviceLinkRequest: vi.fn(),
  mockCreateDeviceIdentity: vi.fn(),
  mockCreateSessionKeyPair: vi.fn(),
  mockBuildLinkApprovalUrl: vi.fn(),
  mockChooseInstance: vi.fn(),
  authInstanceSelectionState: { current: 'https://chat.example.com' },
  mockOpenStore: vi.fn(),
  mockExportHistorySnapshot: vi.fn(),
  mockBytesToBase64: vi.fn(),
  mockCertifyDevice: vi.fn(),
  mockBase64ToBytes: vi.fn(),
  mockEncodeTransferBundle: vi.fn(),
  mockEncryptRelayPayload: vi.fn(),
  mockPreDecryptForLinkExport: vi.fn(),
  mockOpenGuildMetadataKeyStore: vi.fn(),
  mockExportGuildMetadataKeySnapshot: vi.fn(),
  mockListAllLocalPlaintexts: vi.fn(),
  mockBuildTranscriptBlobForExport: vi.fn(),
  mockUploadArchiveSession: vi.fn(),
  mockDownloadArchiveSession: vi.fn(),
  mockDeleteArchive: vi.fn(),
}));

vi.mock('../contexts/AuthContext', () => ({
  useAuth: () => authState.current,
}));

vi.mock('../hooks/useBodyScrollMode', () => ({
  BODY_SCROLL_MODE: { SCROLL: 'scroll' },
  useBodyScrollMode: vi.fn(),
}));

vi.mock('../hooks/useAuth', () => ({
  getDeviceId: () => 'device-1',
}));

vi.mock('../hooks/useAuthInstanceSelection.js', () => ({
  useAuthInstanceSelection: () => ({
    selectedInstanceUrl: authInstanceSelectionState.current,
    knownInstances: [{ url: authInstanceSelectionState.current, lastUsedAt: Date.now() }],
    chooseInstance: (...args) => mockChooseInstance(...args),
    rememberSelectedInstance: vi.fn(),
  }),
}));

vi.mock('../lib/api', () => ({
  consumeDeviceLinkResult: (...args) => mockConsumeDeviceLinkResult(...args),
  createDeviceLinkRequest: (...args) => mockCreateDeviceLinkRequest(...args),
  resolveDeviceLinkRequest: (...args) => mockResolveDeviceLinkRequest(...args),
  verifyDeviceLinkRequest: (...args) => mockVerifyDeviceLinkRequest(...args),
}));

vi.mock('../lib/mlsStore', () => ({
  openStore: (...args) => mockOpenStore(...args),
  exportHistorySnapshot: (...args) => mockExportHistorySnapshot(...args),
  listAllLocalPlaintexts: (...args) => mockListAllLocalPlaintexts(...args),
}));

vi.mock('../lib/preDecryptForLinkExport', () => ({
  preDecryptForLinkExport: (...args) => mockPreDecryptForLinkExport(...args),
}));

vi.mock('../lib/transcriptVault', () => ({
  buildTranscriptBlobForExport: (...args) => mockBuildTranscriptBlobForExport(...args),
}));

vi.mock('../lib/guildMetadataKeyStore', () => ({
  openGuildMetadataKeyStore: (...args) => mockOpenGuildMetadataKeyStore(...args),
  exportGuildMetadataKeySnapshot: (...args) => mockExportGuildMetadataKeySnapshot(...args),
}));

vi.mock('../lib/deviceLinking', () => ({
  buildLinkApprovalUrl: (...args) => mockBuildLinkApprovalUrl(...args),
  bytesToBase64: (...args) => mockBytesToBase64(...args),
  certifyDevice: (...args) => mockCertifyDevice(...args),
  createDeviceIdentity: (...args) => mockCreateDeviceIdentity(...args),
  createSessionKeyPair: (...args) => mockCreateSessionKeyPair(...args),
  decodeQRPayload: vi.fn((encoded) => ({
    requestId: encoded === 'valid-payload' ? 'req-from-qr' : '',
    secret: encoded === 'valid-payload' ? 'secret-from-qr' : '',
    expiresAt: '2026-03-29T00:05:00.000Z',
  })),
  decodeTransferBundle: vi.fn(),
  decryptRelayPayload: vi.fn(),
  encodeTransferBundle: (...args) => mockEncodeTransferBundle(...args),
  encryptRelayPayload: (...args) => mockEncryptRelayPayload(...args),
  base64ToBytes: (...args) => mockBase64ToBytes(...args),
  importSessionPublicKey: vi.fn(),
}));

vi.mock('../lib/linkArchiveSession', () => ({
  uploadArchiveSession: (...args) => mockUploadArchiveSession(...args),
  downloadArchiveSession: (...args) => mockDownloadArchiveSession(...args),
}));

vi.mock('../lib/linkArchiveTransport', () => ({
  deleteArchive: (...args) => mockDeleteArchive(...args),
}));

vi.mock('qrcode', () => ({
  default: {
    toDataURL: (...args) => mockQrToDataUrl(...args),
  },
}));

function renderLinkDevice(entry) {
  return render(
    <MemoryRouter initialEntries={[entry]}>
      <Routes>
        <Route path="/link-device" element={<LinkDevice />} />
        <Route path="/" element={<div>Home</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('LinkDevice', () => {
  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
    authState.current = {
      completeDeviceLink: vi.fn(),
      loading: false,
      isAuthenticated: false,
      hasSession: false,
      hasVault: false,
      isVaultUnlocked: false,
      needsUnlock: false,
      vaultState: 'none',
      token: null,
      user: null,
      identityKeyRef: { current: null },
    };
    authInstanceSelectionState.current = 'https://chat.example.com';
    mockChooseInstance.mockImplementation(async (value) => {
      authInstanceSelectionState.current = value;
      return value;
    });
    mockPreDecryptForLinkExport.mockResolvedValue({
      channels: 0, processed: 0, decrypted: 0, failed: 0, skipped: 0,
    });
    mockOpenGuildMetadataKeyStore.mockResolvedValue({ close: vi.fn() });
    mockExportGuildMetadataKeySnapshot.mockResolvedValue({ stores: {} });
    mockListAllLocalPlaintexts.mockResolvedValue([]);
    mockBuildTranscriptBlobForExport.mockResolvedValue(new Uint8Array([0xde, 0xad, 0xbe, 0xef]));
    mockUploadArchiveSession.mockResolvedValue({
      id: 'arch-test',
      uploadToken: 'utok-test',
      downloadToken: 'dtok-test',
      totalChunks: 1,
      totalBytes: 16,
      chunkSize: 4 * 1024 * 1024,
      manifestHash: 'bWFuaWZlc3Q=',
      archiveSha256: 'YXJjaGl2ZQ==',
      ephPub: 'ZXBocHViYnl0ZXM=',
      nonceBase: 'bm9uY2ViYXNl',
      transcriptBlobOmitted: false,
    });
    mockDownloadArchiveSession.mockResolvedValue({
      historySnapshot: { version: 1, stores: {} },
      guildMetadataKeySnapshot: null,
      transcriptBlob: null,
    });
    mockDeleteArchive.mockResolvedValue(undefined);
  });

  afterEach(() => {
    cleanup();
  });

  it('renders a QR code and fallback code for a new-device request', async () => {
    mockCreateDeviceIdentity.mockResolvedValue({
      publicKeyBase64: 'device-public-key',
    });
    mockCreateSessionKeyPair.mockResolvedValue({
      privateKey: { type: 'private-key' },
      publicKeyBase64: 'session-public-key',
    });
    mockCreateDeviceLinkRequest.mockResolvedValue({
      requestId: 'req-1',
      secret: 'secret-1',
      code: 'ABCD1234',
      expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
    });
    mockBuildLinkApprovalUrl.mockReturnValue('https://app.gethush.live/link-device?payload=abc');
    mockQrToDataUrl.mockResolvedValue('data:image/png;base64,qr-code');
    mockConsumeDeviceLinkResult.mockResolvedValue({ status: 'pending' });

    renderLinkDevice('/link-device?mode=new');

    expect(await screen.findByAltText(/device link qr code/i)).toBeInTheDocument();
    expect(screen.getByText('ABCD1234')).toBeInTheDocument();
    // Copy-to-clipboard affordance is rendered alongside the fallback code.
    expect(screen.getByRole('button', { name: /copy device link code/i })).toBeInTheDocument();
    expect(mockCreateDeviceLinkRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        deviceId: 'device-1',
        devicePublicKey: 'device-public-key',
        sessionPublicKey: 'session-public-key',
        instanceUrl: 'https://chat.example.com',
      }),
      'https://chat.example.com',
    );
    await waitFor(() => {
      expect(mockConsumeDeviceLinkResult).toHaveBeenCalledWith({
        requestId: 'req-1',
        secret: 'secret-1',
      }, 'https://chat.example.com');
    });
  });

  it('keeps the fallback code available when QR generation fails', async () => {
    mockCreateDeviceIdentity.mockResolvedValue({
      publicKeyBase64: 'device-public-key',
    });
    mockCreateSessionKeyPair.mockResolvedValue({
      privateKey: { type: 'private-key' },
      publicKeyBase64: 'session-public-key',
    });
    mockCreateDeviceLinkRequest.mockResolvedValue({
      requestId: 'req-1',
      secret: 'secret-1',
      code: 'ABCD1234',
      expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
    });
    mockBuildLinkApprovalUrl.mockReturnValue('https://app.gethush.live/link-device?payload=abc');
    mockQrToDataUrl.mockRejectedValue(new Error('canvas unavailable'));
    mockConsumeDeviceLinkResult.mockResolvedValue({ status: 'pending' });

    renderLinkDevice('/link-device?mode=new');

    expect(await screen.findByText('ABCD1234')).toBeInTheDocument();
    expect(screen.queryByAltText(/device link qr code/i)).not.toBeInTheDocument();
    expect(screen.getByText(/qr unavailable\. use the fallback code below\./i)).toBeInTheDocument();
  });

  it('shows a request failure state when the new-device link request cannot be created', async () => {
    mockCreateDeviceIdentity.mockResolvedValue({
      publicKeyBase64: 'device-public-key',
    });
    mockCreateSessionKeyPair.mockResolvedValue({
      privateKey: { type: 'private-key' },
      publicKeyBase64: 'session-public-key',
    });
    mockCreateDeviceLinkRequest.mockRejectedValue(
      new Error('create device link request failed. Could not reach https://chat.example.com/api/auth/link-request.'),
    );

    renderLinkDevice('/link-device?mode=new');

    expect(await screen.findByText(/could not create link request\./i)).toBeInTheDocument();
    expect(screen.getByText(/could not reach https:\/\/chat\.example\.com\/api\/auth\/link-request/i)).toBeInTheDocument();
  });

  it('shows connection lost banner when poll fetch fails with a network error', async () => {
    mockCreateDeviceIdentity.mockResolvedValue({
      publicKeyBase64: 'device-public-key',
    });
    mockCreateSessionKeyPair.mockResolvedValue({
      privateKey: { type: 'private-key' },
      publicKeyBase64: 'session-public-key',
    });
    mockCreateDeviceLinkRequest.mockResolvedValue({
      requestId: 'req-1',
      secret: 'secret-1',
      code: 'ABCD1234',
      expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
    });
    mockBuildLinkApprovalUrl.mockReturnValue('https://app.gethush.live/link-device?payload=abc');
    mockQrToDataUrl.mockResolvedValue('data:image/png;base64,qr-code');
    // Simulate persistent network failures
    mockConsumeDeviceLinkResult.mockRejectedValue(new TypeError('Failed to fetch'));

    renderLinkDevice('/link-device?mode=new');

    expect(await screen.findByAltText(/device link qr code/i)).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText(/connection lost\. retrying/i)).toBeInTheDocument();
    });
  });

  it('shows friendly error when ApproveLinkView resolveRequest fails with expired/claimed message', async () => {
    const user = userEvent.setup();
    authState.current = {
      completeDeviceLink: vi.fn(),
      loading: false,
      isAuthenticated: true,
      hasSession: true,
      hasVault: true,
      isVaultUnlocked: true,
      needsUnlock: false,
      vaultState: 'unlocked',
      token: 'jwt-token',
      user: { id: 'user-1', username: 'alice', displayName: 'Alice' },
      identityKeyRef: {
        current: {
          privateKey: new Uint8Array([1, 2, 3]),
          publicKey: new Uint8Array([4, 5, 6]),
        },
      },
    };

    mockResolveDeviceLinkRequest.mockRejectedValue(
      new Error('link request expired or already claimed'),
    );

    renderLinkDevice('/link-device');

    await user.type(screen.getByLabelText(/link code/i), 'ABCD1234');
    await user.click(screen.getByRole('button', { name: /resolve code/i }));

    await waitFor(() => {
      expect(screen.getByText(/code expired or already used/i)).toBeInTheDocument();
    });
  });

  it('prompts to unlock and resume when the browser vault is locked', async () => {
    const user = userEvent.setup();
    authState.current = {
      completeDeviceLink: vi.fn(),
      loading: false,
      isAuthenticated: false,
      hasSession: false,
      hasVault: true,
      isVaultUnlocked: false,
      needsUnlock: true,
      vaultState: 'locked',
      token: null,
      user: null,
      identityKeyRef: { current: null },
    };

    renderLinkDevice('/link-device?payload=valid-payload');

    expect(screen.getByText(/browser is recognized for your hush account/i)).toBeInTheDocument();
    expect(screen.getByText(/unlock this browser to resume approval automatically/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /unlock to approve/i }));

    await screen.findByText('Home');
  });

  it('shows the no-vault message when the browser has no unlockable vault', () => {
    renderLinkDevice('/link-device?payload=valid-payload');

    expect(screen.getByText(/already signed in to the account you want to link/i)).toBeInTheDocument();
    expect(screen.getByText(/does not have a local hush vault/i)).toBeInTheDocument();
  });

  it('shows generic linking failed error when ApproveLinkView handleApprove fails with cert error', async () => {
    const user = userEvent.setup();
    const historyDb = { close: vi.fn() };

    authState.current = {
      completeDeviceLink: vi.fn(),
      loading: false,
      isAuthenticated: true,
      hasSession: true,
      hasVault: true,
      isVaultUnlocked: true,
      needsUnlock: false,
      vaultState: 'unlocked',
      token: 'jwt-token',
      user: { id: 'user-1', username: 'alice', displayName: 'Alice' },
      identityKeyRef: {
        current: {
          privateKey: new Uint8Array([1, 2, 3]),
          publicKey: new Uint8Array([4, 5, 6]),
        },
      },
    };

    mockResolveDeviceLinkRequest.mockResolvedValue({
      claimToken: 'claim-1',
      deviceId: 'device-2',
      devicePublicKey: 'device-public-key',
      sessionPublicKey: 'session-public-key',
      instanceUrl: 'https://app.gethush.live',
      expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
    });
    mockOpenStore.mockResolvedValue(historyDb);
    mockExportHistorySnapshot.mockResolvedValue({ version: 1, stores: {} });
    mockEncodeTransferBundle.mockReturnValue(new Uint8Array([1, 2, 3]));
    mockBase64ToBytes.mockReturnValue(new Uint8Array([9, 9, 9]));
    mockCertifyDevice.mockResolvedValue(new Uint8Array([7, 7, 7]));
    mockBytesToBase64.mockReturnValue('certificate-base64');
    mockEncryptRelayPayload.mockResolvedValue({
      relayCiphertext: 'ciphertext',
      relayIv: 'relay-iv',
      relayPublicKey: 'relay-public-key',
    });
    mockVerifyDeviceLinkRequest.mockRejectedValue(
      new Error('Linking failed. Please try again.'),
    );

    renderLinkDevice('/link-device');

    await user.type(screen.getByLabelText(/link code/i), 'abcd1234');
    await user.click(screen.getByRole('button', { name: /resolve code/i }));
    expect(await screen.findByText('device-2')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /approve link/i }));

    await waitFor(() => {
      expect(screen.getByText(/linking failed\. please try again\./i)).toBeInTheDocument();
    });
  });

  it('resolves a fallback code and approves the requested device', async () => {
    const user = userEvent.setup();
    const historyDb = { close: vi.fn() };

    authState.current = {
      completeDeviceLink: vi.fn(),
      loading: false,
      isAuthenticated: true,
      hasSession: true,
      hasVault: true,
      isVaultUnlocked: true,
      needsUnlock: false,
      vaultState: 'unlocked',
      token: 'jwt-token',
      user: { id: 'user-1', username: 'alice', displayName: 'Alice' },
      identityKeyRef: {
        current: {
          privateKey: new Uint8Array([1, 2, 3]),
          publicKey: new Uint8Array([4, 5, 6]),
        },
      },
    };

    mockResolveDeviceLinkRequest.mockResolvedValue({
      claimToken: 'claim-1',
      deviceId: 'device-2',
      devicePublicKey: 'device-public-key',
      sessionPublicKey: 'session-public-key',
      instanceUrl: 'https://app.gethush.live',
      expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
    });
    mockOpenStore.mockResolvedValue(historyDb);
    mockExportHistorySnapshot.mockResolvedValue({ version: 1, stores: {} });
    mockEncodeTransferBundle.mockReturnValue(new Uint8Array([1, 2, 3]));
    mockBase64ToBytes.mockReturnValue(new Uint8Array([9, 9, 9]));
    mockCertifyDevice.mockResolvedValue(new Uint8Array([7, 7, 7]));
    mockBytesToBase64.mockReturnValue('certificate-base64');
    mockEncryptRelayPayload.mockResolvedValue({
      relayCiphertext: 'ciphertext',
      relayIv: 'relay-iv',
      relayPublicKey: 'relay-public-key',
    });
    mockVerifyDeviceLinkRequest.mockResolvedValue(undefined);

    renderLinkDevice('/link-device');

    await user.type(screen.getByLabelText(/link code/i), 'abcd1234');
    await user.click(screen.getByRole('button', { name: /resolve code/i }));

    expect(await screen.findByText('device-2')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /approve link/i }));

    await waitFor(() => {
      expect(mockVerifyDeviceLinkRequest).toHaveBeenCalledWith('jwt-token', {
        claimToken: 'claim-1',
        certificate: 'certificate-base64',
        signingDeviceId: 'device-1',
        relayCiphertext: 'ciphertext',
        relayIv: 'relay-iv',
        relayPublicKey: 'relay-public-key',
      });
    });
    expect(historyDb.close).toHaveBeenCalledTimes(1);
  });

  it('runs preDecryptForLinkExport before exportHistorySnapshot during approval', async () => {
    const user = userEvent.setup();
    const historyDb = { close: vi.fn() };

    authState.current = {
      completeDeviceLink: vi.fn(),
      loading: false,
      isAuthenticated: true,
      hasSession: true,
      hasVault: true,
      isVaultUnlocked: true,
      needsUnlock: false,
      vaultState: 'unlocked',
      token: 'jwt-token',
      user: { id: 'user-1', username: 'alice', displayName: 'Alice' },
      identityKeyRef: {
        current: {
          privateKey: new Uint8Array([1, 2, 3]),
          publicKey: new Uint8Array([4, 5, 6]),
        },
      },
    };

    mockResolveDeviceLinkRequest.mockResolvedValue({
      claimToken: 'claim-1',
      deviceId: 'device-2',
      devicePublicKey: 'device-public-key',
      sessionPublicKey: 'session-public-key',
      instanceUrl: 'https://app.gethush.live',
      expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
    });
    mockOpenStore.mockResolvedValue(historyDb);
    mockExportHistorySnapshot.mockResolvedValue({ version: 1, stores: {} });
    mockEncodeTransferBundle.mockReturnValue(new Uint8Array([1, 2, 3]));
    mockBase64ToBytes.mockReturnValue(new Uint8Array([9, 9, 9]));
    mockCertifyDevice.mockResolvedValue(new Uint8Array([7, 7, 7]));
    mockBytesToBase64.mockReturnValue('certificate-base64');
    mockEncryptRelayPayload.mockResolvedValue({
      relayCiphertext: 'ciphertext',
      relayIv: 'relay-iv',
      relayPublicKey: 'relay-public-key',
    });
    mockVerifyDeviceLinkRequest.mockResolvedValue(undefined);

    renderLinkDevice('/link-device');

    await user.type(screen.getByLabelText(/link code/i), 'abcd1234');
    await user.click(screen.getByRole('button', { name: /resolve code/i }));
    expect(await screen.findByText('device-2')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /approve link/i }));

    await waitFor(() => {
      expect(mockVerifyDeviceLinkRequest).toHaveBeenCalled();
    });

    expect(mockPreDecryptForLinkExport).toHaveBeenCalledWith(expect.objectContaining({
      activeDb: historyDb,
      token: 'jwt-token',
      baseUrl: 'https://app.gethush.live',
    }));
    expect(mockExportHistorySnapshot).toHaveBeenCalled();
    const preDecryptOrder = mockPreDecryptForLinkExport.mock.invocationCallOrder[0];
    const exportOrder = mockExportHistorySnapshot.mock.invocationCallOrder[0];
    expect(preDecryptOrder).toBeLessThan(exportOrder);
  });

  it('seals harvested local plaintexts into an encrypted transcript blob and includes it in the transfer bundle', async () => {
    const user = userEvent.setup();
    const historyDb = { close: vi.fn() };
    const harvestedRows = [
      { messageId: 'm1', plaintext: 'hi', senderId: 'alice', timestamp: 1 },
      { messageId: 'm2', plaintext: 'bye', senderId: 'bob', timestamp: 2 },
    ];
    const sealedBlob = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 99, 100]);

    authState.current = {
      completeDeviceLink: vi.fn(),
      loading: false,
      isAuthenticated: true,
      hasSession: true,
      hasVault: true,
      isVaultUnlocked: true,
      needsUnlock: false,
      vaultState: 'unlocked',
      token: 'jwt-token',
      user: { id: 'user-1', username: 'alice', displayName: 'Alice' },
      identityKeyRef: {
        current: {
          privateKey: new Uint8Array(32).fill(7),
          publicKey: new Uint8Array(32).fill(8),
        },
      },
    };

    mockResolveDeviceLinkRequest.mockResolvedValue({
      claimToken: 'claim-1',
      deviceId: 'device-2',
      devicePublicKey: 'device-public-key',
      sessionPublicKey: 'session-public-key',
      instanceUrl: 'https://app.gethush.live',
      expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
    });
    mockOpenStore.mockResolvedValue(historyDb);
    mockExportHistorySnapshot.mockResolvedValue({ version: 1, stores: {} });
    mockEncodeTransferBundle.mockReturnValue(new Uint8Array([1, 2, 3]));
    mockBase64ToBytes.mockReturnValue(new Uint8Array([9, 9, 9]));
    mockCertifyDevice.mockResolvedValue(new Uint8Array([7, 7, 7]));
    mockBytesToBase64.mockReturnValue('certificate-base64');
    mockEncryptRelayPayload.mockResolvedValue({
      relayCiphertext: 'ciphertext',
      relayIv: 'relay-iv',
      relayPublicKey: 'relay-public-key',
    });
    mockVerifyDeviceLinkRequest.mockResolvedValue(undefined);
    mockListAllLocalPlaintexts.mockResolvedValue(harvestedRows);
    mockBuildTranscriptBlobForExport.mockResolvedValue(sealedBlob);

    renderLinkDevice('/link-device');

    await user.type(screen.getByLabelText(/link code/i), 'abcd1234');
    await user.click(screen.getByRole('button', { name: /resolve code/i }));
    expect(await screen.findByText('device-2')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /approve link/i }));

    await waitFor(() => {
      expect(mockVerifyDeviceLinkRequest).toHaveBeenCalled();
    });

    expect(mockListAllLocalPlaintexts).toHaveBeenCalledWith(historyDb);
    expect(mockBuildTranscriptBlobForExport).toHaveBeenCalledWith(
      authState.current.identityKeyRef.current.privateKey,
      harvestedRows,
    );
    // v3: transcriptBlob now ships through the chunked archive plane,
    // not inline in the small relay envelope.
    expect(mockUploadArchiveSession).toHaveBeenCalledWith(expect.objectContaining({
      transcriptBlob: sealedBlob,
    }));
    expect(mockEncodeTransferBundle).toHaveBeenCalledWith(expect.objectContaining({
      archive: expect.objectContaining({ id: 'arch-test', downloadToken: 'dtok-test' }),
    }));
  });

  it('falls back to a null transcriptBlob when there are no plaintext rows to seal', async () => {
    const user = userEvent.setup();
    const historyDb = { close: vi.fn() };

    authState.current = {
      completeDeviceLink: vi.fn(),
      loading: false,
      isAuthenticated: true,
      hasSession: true,
      hasVault: true,
      isVaultUnlocked: true,
      needsUnlock: false,
      vaultState: 'unlocked',
      token: 'jwt-token',
      user: { id: 'user-1', username: 'alice', displayName: 'Alice' },
      identityKeyRef: {
        current: {
          privateKey: new Uint8Array(32).fill(1),
          publicKey: new Uint8Array(32).fill(2),
        },
      },
    };

    mockResolveDeviceLinkRequest.mockResolvedValue({
      claimToken: 'claim-1',
      deviceId: 'device-2',
      devicePublicKey: 'device-public-key',
      sessionPublicKey: 'session-public-key',
      instanceUrl: 'https://app.gethush.live',
      expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
    });
    mockOpenStore.mockResolvedValue(historyDb);
    mockExportHistorySnapshot.mockResolvedValue({ version: 1, stores: {} });
    mockEncodeTransferBundle.mockReturnValue(new Uint8Array([1, 2, 3]));
    mockBase64ToBytes.mockReturnValue(new Uint8Array([9, 9, 9]));
    mockCertifyDevice.mockResolvedValue(new Uint8Array([7, 7, 7]));
    mockBytesToBase64.mockReturnValue('certificate-base64');
    mockEncryptRelayPayload.mockResolvedValue({
      relayCiphertext: 'ciphertext',
      relayIv: 'relay-iv',
      relayPublicKey: 'relay-public-key',
    });
    mockVerifyDeviceLinkRequest.mockResolvedValue(undefined);
    mockListAllLocalPlaintexts.mockResolvedValue([]); // explicit: nothing to seal

    renderLinkDevice('/link-device');

    await user.type(screen.getByLabelText(/link code/i), 'abcd1234');
    await user.click(screen.getByRole('button', { name: /resolve code/i }));
    expect(await screen.findByText('device-2')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /approve link/i }));

    await waitFor(() => {
      expect(mockVerifyDeviceLinkRequest).toHaveBeenCalled();
    });

    expect(mockBuildTranscriptBlobForExport).not.toHaveBeenCalled();
    expect(mockUploadArchiveSession).toHaveBeenCalledWith(expect.objectContaining({
      transcriptBlob: null,
    }));
  });

  it('still completes link approval if preDecryptForLinkExport throws', async () => {
    const user = userEvent.setup();
    const historyDb = { close: vi.fn() };

    authState.current = {
      completeDeviceLink: vi.fn(),
      loading: false,
      isAuthenticated: true,
      hasSession: true,
      hasVault: true,
      isVaultUnlocked: true,
      needsUnlock: false,
      vaultState: 'unlocked',
      token: 'jwt-token',
      user: { id: 'user-1', username: 'alice', displayName: 'Alice' },
      identityKeyRef: {
        current: {
          privateKey: new Uint8Array([1, 2, 3]),
          publicKey: new Uint8Array([4, 5, 6]),
        },
      },
    };

    mockResolveDeviceLinkRequest.mockResolvedValue({
      claimToken: 'claim-1',
      deviceId: 'device-2',
      devicePublicKey: 'device-public-key',
      sessionPublicKey: 'session-public-key',
      instanceUrl: 'https://app.gethush.live',
      expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
    });
    mockOpenStore.mockResolvedValue(historyDb);
    mockExportHistorySnapshot.mockResolvedValue({ version: 1, stores: {} });
    mockEncodeTransferBundle.mockReturnValue(new Uint8Array([1, 2, 3]));
    mockBase64ToBytes.mockReturnValue(new Uint8Array([9, 9, 9]));
    mockCertifyDevice.mockResolvedValue(new Uint8Array([7, 7, 7]));
    mockBytesToBase64.mockReturnValue('certificate-base64');
    mockEncryptRelayPayload.mockResolvedValue({
      relayCiphertext: 'ciphertext',
      relayIv: 'relay-iv',
      relayPublicKey: 'relay-public-key',
    });
    mockVerifyDeviceLinkRequest.mockResolvedValue(undefined);
    mockPreDecryptForLinkExport.mockRejectedValueOnce(new Error('boom'));

    renderLinkDevice('/link-device');

    await user.type(screen.getByLabelText(/link code/i), 'abcd1234');
    await user.click(screen.getByRole('button', { name: /resolve code/i }));
    expect(await screen.findByText('device-2')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /approve link/i }));

    await waitFor(() => {
      expect(mockVerifyDeviceLinkRequest).toHaveBeenCalled();
    });
    expect(mockExportHistorySnapshot).toHaveBeenCalled();
  });

  it('copies the fallback code to the clipboard when the Copy button is clicked', async () => {
    const user = userEvent.setup();
    mockCreateDeviceIdentity.mockResolvedValue({ publicKeyBase64: 'device-public-key' });
    mockCreateSessionKeyPair.mockResolvedValue({
      privateKey: { type: 'private-key' }, publicKeyBase64: 'session-public-key',
    });
    mockCreateDeviceLinkRequest.mockResolvedValue({
      requestId: 'req-1',
      secret: 'secret-1',
      code: 'ABCD1234',
      expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
    });
    mockBuildLinkApprovalUrl.mockReturnValue('https://app.gethush.live/link-device?payload=abc');
    mockQrToDataUrl.mockResolvedValue('data:image/png;base64,qr-code');
    mockConsumeDeviceLinkResult.mockResolvedValue({ status: 'pending' });

    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText }, configurable: true,
    });

    renderLinkDevice('/link-device?mode=new');
    await screen.findByText('ABCD1234');
    await user.click(screen.getByRole('button', { name: /copy device link code/i }));

    expect(writeText).toHaveBeenCalledWith('ABCD1234');
    expect(await screen.findByRole('button', { name: /copy device link code/i })).toHaveTextContent(/copied/i);
  });

  it('renders the Scan-QR button on the approve view (manual code path is preserved)', async () => {
    authState.current = {
      completeDeviceLink: vi.fn(),
      loading: false,
      isAuthenticated: true,
      hasSession: true,
      hasVault: true,
      isVaultUnlocked: true,
      needsUnlock: false,
      vaultState: 'unlocked',
      token: 'jwt-token',
      user: { id: 'user-1', username: 'alice', displayName: 'Alice' },
      identityKeyRef: {
        current: { privateKey: new Uint8Array([1]), publicKey: new Uint8Array([2]) },
      },
    };
    renderLinkDevice('/link-device');
    expect(await screen.findByRole('button', { name: /scan qr code with camera/i })).toBeInTheDocument();
    // Manual entry input still present.
    expect(screen.getByLabelText(/link code/i)).toBeInTheDocument();
  });
});
