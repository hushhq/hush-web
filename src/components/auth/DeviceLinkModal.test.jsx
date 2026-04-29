/**
 * DeviceLinkModal.test.jsx
 *
 * Smoke coverage for the shadcn Dialog migration:
 *   - Dialog title renders
 *   - QR / Text-code tabs switch
 *   - Built-in close calls onClose
 *   - Copy button is accessible in code mode
 *
 * Crypto/QR/network internals are mocked to keep this surface-only.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DeviceLinkModal from './DeviceLinkModal.jsx';

vi.mock('@noble/ed25519', () => ({
  utils: { randomPrivateKey: () => new Uint8Array(32) },
  getPublicKeyAsync: vi.fn(async () => new Uint8Array(32)),
}));

vi.mock('qrcode', () => ({
  default: { toCanvas: vi.fn(async () => undefined) },
}));

vi.mock('../../lib/deviceLinking.js', () => ({
  encodeQRPayload: vi.fn(() => 'mock-payload'),
  generateLinkingCode: vi.fn(() => 'AB12CD34'),
}));

vi.mock('../../lib/api.js', () => ({
  listDeviceKeys: vi.fn(async () => []),
}));

describe('DeviceLinkModal', () => {
  beforeEach(() => {
    cleanup();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders the dialog title', async () => {
    render(<DeviceLinkModal onClose={vi.fn()} onLinked={vi.fn()} token="t" />);
    expect(await screen.findByRole('heading', { name: /link a new device/i })).toBeInTheDocument();
  });

  it('switches between QR and Text-code tabs', async () => {
    const user = userEvent.setup();
    render(<DeviceLinkModal onClose={vi.fn()} onLinked={vi.fn()} token="t" />);
    const codeTab = await screen.findByRole('tab', { name: /text code/i });
    await user.click(codeTab);
    await waitFor(() => {
      expect(screen.getByText('AB12CD34')).toBeInTheDocument();
    });
  });

  it('built-in close button calls onClose', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<DeviceLinkModal onClose={onClose} onLinked={vi.fn()} token="t" />);
    const closeBtn = await screen.findByRole('button', { name: /close/i });
    await user.click(closeBtn);
    await waitFor(() => expect(onClose).toHaveBeenCalled());
  });

  it('copy button is accessible in code-mode tab', async () => {
    const user = userEvent.setup();
    render(<DeviceLinkModal onClose={vi.fn()} onLinked={vi.fn()} token="t" />);
    await user.click(await screen.findByRole('tab', { name: /text code/i }));
    expect(await screen.findByRole('button', { name: /copy code/i })).toBeInTheDocument();
  });
});
