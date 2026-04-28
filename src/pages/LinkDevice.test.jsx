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
  mockDecodeTransferBundle,
  mockDecryptRelayPayload,
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
  mockResumeUploadArchiveSession,
  mockSweepStaleExports,
  mockFindResumableExport,
  mockDeleteExport,
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
  mockDecodeTransferBundle: vi.fn(),
  mockDecryptRelayPayload: vi.fn(),
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
  mockResumeUploadArchiveSession: vi.fn(),
  mockSweepStaleExports: vi.fn(),
  mockFindResumableExport: vi.fn(),
  mockDeleteExport: vi.fn(),
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
  decodeTransferBundle: (...args) => mockDecodeTransferBundle(...args),
  decryptRelayPayload: (...args) => mockDecryptRelayPayload(...args),
  encodeTransferBundle: (...args) => mockEncodeTransferBundle(...args),
  encryptRelayPayload: (...args) => mockEncryptRelayPayload(...args),
  base64ToBytes: (...args) => mockBase64ToBytes(...args),
  importSessionPublicKey: vi.fn(),
}));

vi.mock('../lib/linkArchiveSession', () => ({
  uploadArchiveSession: (...args) => mockUploadArchiveSession(...args),
  downloadArchiveSession: (...args) => mockDownloadArchiveSession(...args),
  resumeUploadArchiveSession: (...args) => mockResumeUploadArchiveSession(...args),
}));

vi.mock('../lib/linkArchiveTransport', () => ({
  deleteArchive: (...args) => mockDeleteArchive(...args),
}));

vi.mock('../lib/linkArchiveExportStore', () => ({
  sweepStaleExports: (...args) => mockSweepStaleExports(...args),
  findResumableExport: (...args) => mockFindResumableExport(...args),
  deleteExport: (...args) => mockDeleteExport(...args),
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
      format: 'chunk-atomic-v1',
      chunkPlaintextHashes: ['Y2h1bmstaGFzaA=='],
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
    mockResumeUploadArchiveSession.mockResolvedValue({
      id: 'arch-resume',
      uploadToken: 'utok-resume',
      downloadToken: 'dtok-resume',
      totalChunks: 1,
      totalBytes: 16,
      chunkSize: 4 * 1024 * 1024,
      manifestHash: 'bWFuaWZlc3Q=',
      archiveSha256: 'YXJjaGl2ZQ==',
      format: 'chunk-atomic-v1',
      chunkPlaintextHashes: ['Y2h1bmstaGFzaA=='],
      ephPub: 'ZXBocHViYnl0ZXM=',
      nonceBase: 'bm9uY2ViYXNl',
      transcriptBlobOmitted: false,
    });
    mockSweepStaleExports.mockResolvedValue(0);
    mockFindResumableExport.mockResolvedValue(null);
    mockDeleteExport.mockResolvedValue(undefined);
    mockDecryptRelayPayload.mockResolvedValue(new Uint8Array([1, 2, 3]));
    mockDecodeTransferBundle.mockResolvedValue({
      version: 3,
      userId: 'user-1',
      username: 'alice',
      displayName: 'Alice',
      instanceUrl: 'https://app.gethush.live',
      exportedAt: new Date().toISOString(),
      rootPrivateKey: new Uint8Array([1, 2, 3]),
      rootPublicKey: new Uint8Array([4, 5, 6]),
      archive: null,
      historySnapshot: null,
      guildMetadataKeySnapshot: null,
      transcriptBlob: null,
    });
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

  it('renders all seven stable regions in the steady QR-active state', async () => {
    mockCreateDeviceIdentity.mockResolvedValue({ publicKeyBase64: 'device-public-key' });
    mockCreateSessionKeyPair.mockResolvedValue({
      privateKey: { type: 'private-key' },
      publicKeyBase64: 'session-public-key',
    });
    mockCreateDeviceLinkRequest.mockResolvedValue({
      requestId: 'req-1',
      secret: 'secret-1',
      code: 'XW8GYSE3',
      expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
    });
    mockBuildLinkApprovalUrl.mockReturnValue('https://app.gethush.live/link-device?payload=abc');
    mockQrToDataUrl.mockResolvedValue('data:image/png;base64,qr-code');
    mockConsumeDeviceLinkResult.mockResolvedValue({ status: 'pending' });

    renderLinkDevice('/link-device?mode=new');

    const qrImage = await screen.findByAltText(/device link qr code/i);
    const card = qrImage.closest('.ld-card');
    expect(card).not.toBeNull();

    // 1. title
    expect(card.querySelector('.home-section-title')?.textContent).toMatch(/Link this device/i);
    // 2. subtitle
    expect(card.querySelector('.ld-subtitle')).not.toBeNull();
    // 3. QR block: frame (with image), status (active pulse dot + label), timer (countdown)
    const qrBlock = card.querySelector('.ld-qr-block');
    expect(qrBlock).not.toBeNull();
    expect(qrBlock.dataset.state).toBe('active');
    expect(qrBlock.querySelector('.ld-qr-frame')?.contains(qrImage)).toBe(true);
    const status = qrBlock.querySelector('.ld-qr-status');
    expect(status).not.toBeNull();
    expect(status.querySelector('.ld-pulse-dot.is-active')).not.toBeNull();
    expect(status.textContent).toMatch(/Waiting for approval/i);
    expect(qrBlock.querySelector('.ld-qr-timer')?.textContent).toMatch(/Expires in /);
    // 4. divider with "or use fallback code"
    const divider = card.querySelector('.ld-divider');
    expect(divider).not.toBeNull();
    expect(divider.textContent).toMatch(/or use fallback code/i);
    // 5. code block: real code present, copy enabled
    const codeBlock = card.querySelector('.ld-code-block');
    expect(codeBlock).not.toBeNull();
    const codeValue = codeBlock.querySelector('.ld-code-value');
    expect(codeValue?.dataset.state).toBe('ready');
    expect(codeValue?.textContent).toBe('XW8GYSE3');
    const copyBtn = codeBlock.querySelector('.ld-code-copy');
    expect(copyBtn).not.toBeNull();
    expect(copyBtn?.disabled).toBe(false);
    // 6. instance row holds AuthInstanceSelector
    const instanceRow = card.querySelector('.ld-instance-row');
    expect(instanceRow).not.toBeNull();
    expect(instanceRow.querySelector('.ais')).not.toBeNull();
    // 7. footer: Regenerate + Back link, side-by-side
    const footer = card.querySelector('.ld-footer');
    expect(footer).not.toBeNull();
    expect(footer.contains(screen.getByRole('button', { name: /regenerate/i }))).toBe(true);
    expect(footer.querySelector('.ld-back-link')).not.toBeNull();
  });

  it('keeps all seven regions in place during the generating/loading state (no collapse)', async () => {
    mockCreateDeviceIdentity.mockResolvedValue({ publicKeyBase64: 'device-public-key' });
    mockCreateSessionKeyPair.mockResolvedValue({
      privateKey: { type: 'private-key' },
      publicKeyBase64: 'session-public-key',
    });
    // Hold the request pending so requestState stays null and the loading UI sticks.
    mockCreateDeviceLinkRequest.mockImplementation(() => new Promise(() => {}));

    renderLinkDevice('/link-device?mode=new');

    // Wait until the placeholder for the loading state is mounted.
    const placeholder = await screen.findByText(/Generating link request/i);
    const card = placeholder.closest('.ld-card');
    expect(card).not.toBeNull();

    // All seven regions must still be present in the loading state.
    expect(card.querySelector('.home-section-title')).not.toBeNull();
    expect(card.querySelector('.ld-subtitle')).not.toBeNull();
    const qrBlock = card.querySelector('.ld-qr-block');
    expect(qrBlock).not.toBeNull();
    expect(qrBlock.dataset.state).toBe('pending');
    expect(qrBlock.querySelector('.ld-qr-frame')).not.toBeNull();
    expect(qrBlock.querySelector('.ld-qr-placeholder')).not.toBeNull();
    expect(qrBlock.querySelector('.ld-qr-status')).not.toBeNull();
    // Pulse dot is NOT active in loading state — geometry slot still occupied.
    expect(qrBlock.querySelector('.ld-pulse-dot')).not.toBeNull();
    expect(qrBlock.querySelector('.ld-pulse-dot.is-active')).toBeNull();
    expect(qrBlock.querySelector('.ld-qr-timer')).not.toBeNull();
    expect(card.querySelector('.ld-divider')).not.toBeNull();
    // Code block exists with placeholder; copy button disabled (no code yet).
    const codeBlock = card.querySelector('.ld-code-block');
    expect(codeBlock).not.toBeNull();
    expect(codeBlock.querySelector('.ld-code-value')?.dataset.state).toBe('placeholder');
    const copyBtn = codeBlock.querySelector('.ld-code-copy');
    expect(copyBtn?.disabled).toBe(true);
    expect(card.querySelector('.ld-instance-row')).not.toBeNull();
    const footer = card.querySelector('.ld-footer');
    expect(footer).not.toBeNull();
    expect(footer.querySelector('.ld-back-link')).not.toBeNull();
    expect(footer.contains(screen.getByRole('button', { name: /regenerate/i }))).toBe(true);
  });

  it('keeps the layout intact across a regenerate transition (active → loading → active)', async () => {
    mockCreateDeviceIdentity.mockResolvedValue({ publicKeyBase64: 'device-public-key' });
    mockCreateSessionKeyPair.mockResolvedValue({
      privateKey: { type: 'private-key' },
      publicKeyBase64: 'session-public-key',
    });
    let resolveSecond;
    mockCreateDeviceLinkRequest
      .mockResolvedValueOnce({
        requestId: 'req-1',
        secret: 'secret-1',
        code: 'AAAA1111',
        expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
      })
      .mockImplementationOnce(
        () => new Promise((resolve) => { resolveSecond = resolve; }),
      );
    mockBuildLinkApprovalUrl.mockReturnValue('https://app.gethush.live/link-device?payload=abc');
    mockQrToDataUrl.mockResolvedValue('data:image/png;base64,qr-code');
    mockConsumeDeviceLinkResult.mockResolvedValue({ status: 'pending' });

    renderLinkDevice('/link-device?mode=new');

    // Active state reached.
    const firstQr = await screen.findByAltText(/device link qr code/i);
    const card = firstQr.closest('.ld-card');
    expect(card.querySelector('.ld-qr-block')?.dataset.state).toBe('active');
    expect(card.querySelector('.ld-code-value')?.textContent).toBe('AAAA1111');

    // Click Regenerate → triggers a fresh createDeviceLinkRequest (held pending).
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /regenerate/i }));

    // While regenerating, QR slot reverts to placeholder, code reverts to placeholder,
    // but every region remains in place.
    await waitFor(() => {
      expect(card.querySelector('.ld-qr-block')?.dataset.state).toBe('pending');
    });
    expect(card.querySelector('.ld-qr-frame')).not.toBeNull();
    expect(card.querySelector('.ld-qr-placeholder')).not.toBeNull();
    expect(card.querySelector('.ld-qr-status')).not.toBeNull();
    expect(card.querySelector('.ld-qr-timer')).not.toBeNull();
    expect(card.querySelector('.ld-divider')).not.toBeNull();
    expect(card.querySelector('.ld-code-block')).not.toBeNull();
    expect(card.querySelector('.ld-code-value')?.dataset.state).toBe('placeholder');
    expect(card.querySelector('.ld-instance-row')).not.toBeNull();
    expect(card.querySelector('.ld-footer')).not.toBeNull();

    // Resolve second request → state returns to active, regions still in place.
    resolveSecond({
      requestId: 'req-2',
      secret: 'secret-2',
      code: 'BBBB2222',
      expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
    });

    await waitFor(() => {
      expect(card.querySelector('.ld-qr-block')?.dataset.state).toBe('active');
    });
    expect(card.querySelector('.ld-code-value')?.textContent).toBe('BBBB2222');
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

  it('keeps polling when the API layer wraps a poll network failure', async () => {
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
    mockConsumeDeviceLinkResult
      .mockRejectedValueOnce(
        new Error('consume device link result failed. Could not reach https://app.gethush.live/api/auth/link-result.'),
      )
      .mockResolvedValue({ status: 'pending' });

    renderLinkDevice('/link-device?mode=new');

    expect(await screen.findByAltText(/device link qr code/i)).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText(/connection lost\. retrying/i)).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(mockConsumeDeviceLinkResult).toHaveBeenCalledTimes(2);
    }, { timeout: 3000 });
  });

  it('cleans up the archive when new-device import fails', async () => {
    const completeDeviceLink = vi.fn();
    authState.current = {
      ...authState.current,
      completeDeviceLink,
    };
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
    mockConsumeDeviceLinkResult.mockResolvedValue({
      relayCiphertext: 'ciphertext',
      relayIv: 'relay-iv',
      relayPublicKey: 'relay-public-key',
      deviceId: 'device-2',
      instanceUrl: 'https://app.gethush.live',
    });
    mockDecodeTransferBundle.mockResolvedValue({
      version: 3,
      userId: 'user-1',
      username: 'alice',
      displayName: 'Alice',
      instanceUrl: 'https://app.gethush.live',
      exportedAt: new Date().toISOString(),
      rootPrivateKey: new Uint8Array([1, 2, 3]),
      rootPublicKey: new Uint8Array([4, 5, 6]),
      archive: {
        id: 'arch-import-fail',
        downloadToken: 'dtok-import-fail',
        totalChunks: 1,
        totalBytes: 16,
        chunkSize: 4 * 1024 * 1024,
        manifestHash: 'bWFuaWZlc3Q=',
        archiveSha256: 'YXJjaGl2ZQ==',
        format: 'chunk-atomic-v1',
        chunkPlaintextHashes: ['Y2h1bmstaGFzaA=='],
        ephPub: 'ZXBocHViYnl0ZXM=',
        nonceBase: 'bm9uY2ViYXNl',
        transcriptBlobOmitted: false,
      },
      historySnapshot: null,
      guildMetadataKeySnapshot: null,
      transcriptBlob: null,
    });
    mockDownloadArchiveSession.mockRejectedValueOnce(new Error('boom'));

    renderLinkDevice('/link-device?mode=new');

    expect(await screen.findByAltText(/device link qr code/i)).toBeInTheDocument();
    await waitFor(() => {
      expect(mockDeleteArchive).toHaveBeenCalledWith(
        'arch-import-fail',
        { downloadToken: 'dtok-import-fail' },
        'https://app.gethush.live',
      );
    });
    expect(completeDeviceLink).not.toHaveBeenCalled();
    expect(await screen.findByText(/boom/i)).toBeInTheDocument();
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
      archive: expect.objectContaining({
        id: 'arch-test',
        downloadToken: 'dtok-test',
        format: 'chunk-atomic-v1',
        chunkPlaintextHashes: ['Y2h1bmstaGFzaA=='],
      }),
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
    // Icons-only button: success state surfaces via data-state, not text.
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /copy device link code/i }))
        .toHaveAttribute('data-state', 'copied');
    });
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

  // ── Resume / discard UX (durable OLD-device upload resume) ────────────
  describe('resumable export UX', () => {
    function unlockedAuth() {
      return {
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
    }
    function lockedAuth() {
      return {
        completeDeviceLink: vi.fn(),
        loading: false,
        isAuthenticated: true,
        hasSession: true,
        hasVault: true,
        isVaultUnlocked: false,
        needsUnlock: true,
        vaultState: 'locked',
        token: null,
        user: null,
        identityKeyRef: { current: null },
      };
    }
    function setupClaimResolution() {
      mockResolveDeviceLinkRequest.mockResolvedValue({
        claimToken: 'claim-1',
        deviceId: 'device-2',
        devicePublicKey: 'device-public-key',
        sessionPublicKey: 'session-public-key',
        instanceUrl: 'https://app.gethush.live',
        expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
      });
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
    }

    const sampleResumable = {
      archiveId: 'arch-prior',
      baseUrl: 'https://app.gethush.live',
      backendKind: 's3',
      totalChunks: 1,
      status: 'in_progress',
    };

    it('detects a resumable export and shows the resume/discard banner', async () => {
      authState.current = unlockedAuth();
      setupClaimResolution();
      mockFindResumableExport.mockResolvedValue(sampleResumable);

      const user = userEvent.setup();
      renderLinkDevice('/link-device');
      await user.type(screen.getByLabelText(/link code/i), 'abcd1234');
      await user.click(screen.getByRole('button', { name: /resolve code/i }));

      // Resume banner appears with both choices, no auto-resume.
      expect(await screen.findByTestId('ld-resume-banner')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /resume upload/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /discard and start fresh/i })).toBeInTheDocument();
      // Approve-link button is hidden until the user makes a choice.
      expect(screen.queryByRole('button', { name: /approve link/i })).not.toBeInTheDocument();
      // Resume must NOT have been called automatically.
      expect(mockResumeUploadArchiveSession).not.toHaveBeenCalled();
    });

    it('resume button calls resumeUploadArchiveSession and continues the link flow', async () => {
      authState.current = unlockedAuth();
      setupClaimResolution();
      mockFindResumableExport.mockResolvedValue(sampleResumable);

      const user = userEvent.setup();
      renderLinkDevice('/link-device');
      await user.type(screen.getByLabelText(/link code/i), 'abcd1234');
      await user.click(screen.getByRole('button', { name: /resolve code/i }));
      await screen.findByTestId('ld-resume-banner');

      await user.click(screen.getByRole('button', { name: /resume upload/i }));

      await waitFor(() => {
        expect(mockResumeUploadArchiveSession).toHaveBeenCalledTimes(1);
      });
      const args = mockResumeUploadArchiveSession.mock.calls[0][0];
      expect(args.exportRecord).toEqual(sampleResumable);
      expect(args.token).toBe('jwt-token');
      expect(args.baseUrl).toBe('https://app.gethush.live');
      // Fresh upload path is NOT taken when resume is chosen.
      expect(mockUploadArchiveSession).not.toHaveBeenCalled();
      // Link verification happens with the resumed descriptor.
      await waitFor(() => {
        expect(mockVerifyDeviceLinkRequest).toHaveBeenCalledWith('jwt-token', expect.objectContaining({
          claimToken: 'claim-1',
        }));
      });
    });

    it('discard button removes the local export record and reveals the fresh-upload approve button', async () => {
      authState.current = unlockedAuth();
      setupClaimResolution();
      mockFindResumableExport.mockResolvedValue(sampleResumable);

      const user = userEvent.setup();
      renderLinkDevice('/link-device');
      await user.type(screen.getByLabelText(/link code/i), 'abcd1234');
      await user.click(screen.getByRole('button', { name: /resolve code/i }));
      await screen.findByTestId('ld-resume-banner');

      await user.click(screen.getByRole('button', { name: /discard and start fresh/i }));

      await waitFor(() => {
        expect(mockDeleteExport).toHaveBeenCalledWith('arch-prior');
      });
      // Banner gone; normal approve-link button reappears.
      await waitFor(() => {
        expect(screen.queryByTestId('ld-resume-banner')).not.toBeInTheDocument();
      });
      expect(screen.getByRole('button', { name: /approve link/i })).toBeInTheDocument();
      // Resume mechanic was NOT triggered.
      expect(mockResumeUploadArchiveSession).not.toHaveBeenCalled();
    });

    it('locked vault: resume detection is skipped and the unlock prompt is shown', async () => {
      authState.current = lockedAuth();
      mockFindResumableExport.mockResolvedValue(sampleResumable);

      renderLinkDevice('/link-device');

      // Locked-vault view should appear, no resume detection should fire.
      expect(await screen.findByRole('button', { name: /unlock to approve/i })).toBeInTheDocument();
      expect(mockFindResumableExport).not.toHaveBeenCalled();
      expect(mockResumeUploadArchiveSession).not.toHaveBeenCalled();
    });

    it('preserves the fresh-upload flow when no resumable export exists', async () => {
      authState.current = unlockedAuth();
      setupClaimResolution();
      mockOpenStore.mockResolvedValue({ close: vi.fn() });
      mockExportHistorySnapshot.mockResolvedValue({ version: 1, stores: {} });
      mockFindResumableExport.mockResolvedValue(null);

      const user = userEvent.setup();
      renderLinkDevice('/link-device');
      await user.type(screen.getByLabelText(/link code/i), 'abcd1234');
      await user.click(screen.getByRole('button', { name: /resolve code/i }));

      // Banner not shown; normal approve button is.
      expect(await screen.findByRole('button', { name: /approve link/i })).toBeInTheDocument();
      expect(screen.queryByTestId('ld-resume-banner')).not.toBeInTheDocument();

      await user.click(screen.getByRole('button', { name: /approve link/i }));

      await waitFor(() => {
        expect(mockUploadArchiveSession).toHaveBeenCalledTimes(1);
      });
      expect(mockResumeUploadArchiveSession).not.toHaveBeenCalled();
    });
  });

  // ── Connection-lost banner phase isolation (slice-12 P2 fix) ──────────
  describe('connection-lost banner', () => {
    it('does not appear during a successful finalize phase even if the flow is in progress', async () => {
      mockCreateDeviceIdentity.mockResolvedValue({ publicKeyBase64: 'device-public-key' });
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
      // Polling succeeds with a non-pending result (the OLD device approved).
      mockConsumeDeviceLinkResult.mockResolvedValue({
        relayCiphertext: 'c', relayIv: 'iv', relayPublicKey: 'pk',
      });
      // Finalize phase succeeds.
      mockDecryptRelayPayload.mockResolvedValue(new Uint8Array([1, 2, 3]));
      mockDecodeTransferBundle.mockResolvedValue({
        version: 3,
        userId: 'user-1', username: 'alice', displayName: 'Alice',
        instanceUrl: 'https://app.gethush.live',
        rootPrivateKey: new Uint8Array([1, 2, 3]),
        rootPublicKey: new Uint8Array([4, 5, 6]),
        archive: null,
        historySnapshot: null, guildMetadataKeySnapshot: null, transcriptBlob: null,
      });

      renderLinkDevice('/link-device?mode=new');
      await screen.findByText('ABCD1234');
      // The successful flow must NEVER surface the "Connection lost" banner.
      // Wait long enough for the poll loop + finalize to run.
      await new Promise((r) => setTimeout(r, 50));
      expect(screen.queryByText(/connection lost\. retrying/i)).not.toBeInTheDocument();
    });

  });

  // ── Human-readable device label in approval (slice-12 P3) ─────────────
  describe('approval UI device labelling', () => {
    function unlockedAuth() {
      return {
        completeDeviceLink: vi.fn(), loading: false, isAuthenticated: true,
        hasSession: true, hasVault: true, isVaultUnlocked: true, needsUnlock: false,
        vaultState: 'unlocked', token: 'jwt-token',
        user: { id: 'user-1', username: 'alice', displayName: 'Alice' },
        identityKeyRef: { current: { privateKey: new Uint8Array([1]), publicKey: new Uint8Array([2]) } },
      };
    }

    it('shows the human-readable label from the resolved claim, not the raw deviceId', async () => {
      authState.current = unlockedAuth();
      mockResolveDeviceLinkRequest.mockResolvedValue({
        claimToken: 'claim-1',
        deviceId: '11111111-2222-3333-4444-555555555555',
        devicePublicKey: 'device-public-key',
        sessionPublicKey: 'session-public-key',
        instanceUrl: 'https://app.gethush.live',
        expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
        label: 'Chrome on iOS',
      });
      const user = userEvent.setup();
      renderLinkDevice('/link-device');
      await user.type(screen.getByLabelText(/link code/i), 'abcd1234');
      await user.click(screen.getByRole('button', { name: /resolve code/i }));
      // Readable label visible.
      expect(await screen.findByText('Chrome on iOS')).toBeInTheDocument();
      // Raw deviceId NOT visible.
      expect(screen.queryByText('11111111-2222-3333-4444-555555555555')).not.toBeInTheDocument();
    });

    it('falls back to the deviceId when the claim has no label', async () => {
      authState.current = unlockedAuth();
      mockResolveDeviceLinkRequest.mockResolvedValue({
        claimToken: 'claim-1',
        deviceId: 'device-2',
        devicePublicKey: 'device-public-key',
        sessionPublicKey: 'session-public-key',
        instanceUrl: 'https://app.gethush.live',
        expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
      });
      const user = userEvent.setup();
      renderLinkDevice('/link-device');
      await user.type(screen.getByLabelText(/link code/i), 'abcd1234');
      await user.click(screen.getByRole('button', { name: /resolve code/i }));
      expect(await screen.findByText('device-2')).toBeInTheDocument();
    });
  });

  // ── Copy button success state (slice-12 P4) ───────────────────────────
  describe('copy code button', () => {
    it('exposes idle/copied data-state for the copy button (icon + success state)', async () => {
      mockCreateDeviceIdentity.mockResolvedValue({ publicKeyBase64: 'device-public-key' });
      mockCreateSessionKeyPair.mockResolvedValue({
        privateKey: { type: 'private-key' },
        publicKeyBase64: 'session-public-key',
      });
      mockCreateDeviceLinkRequest.mockResolvedValue({
        requestId: 'req-1', secret: 'secret-1', code: 'ABCD1234',
        expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
      });
      mockBuildLinkApprovalUrl.mockReturnValue('https://app.gethush.live/link-device?payload=abc');
      mockQrToDataUrl.mockResolvedValue('data:image/png;base64,qr-code');
      mockConsumeDeviceLinkResult.mockResolvedValue({ status: 'pending' });

      const writeText = vi.fn().mockResolvedValue(undefined);
      Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });

      const user = userEvent.setup();
      renderLinkDevice('/link-device?mode=new');
      await screen.findByText('ABCD1234');

      const btn = await screen.findByRole('button', { name: /copy device link code/i });
      expect(btn).toHaveAttribute('data-state', 'idle');
      await user.click(btn);
      await waitFor(() => {
        expect(btn).toHaveAttribute('data-state', 'copied');
      });
    });
  });
});
