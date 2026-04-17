/**
 * Tests for Chat.jsx - byte-based message length enforcement (LNCH-05).
 *
 * Focuses on the MAX_PLAINTEXT_BYTES constant (4000 bytes) which enforces
 * the effective plaintext limit before MLS encryption. The server limit is
 * 8 KiB ciphertext; the client conservatively limits to 4000 plaintext bytes
 * to account for UTF-8 multi-byte chars and MLS framing overhead.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act, cleanup } from '@testing-library/react';
import Chat from './Chat.jsx';

// Minimal mock for useMLS - we only test UI behavior, not crypto.
vi.mock('../hooks/useMLS', () => ({
  useMLS: () => ({
    encryptForChannel: vi.fn().mockResolvedValue({ ciphertext: new Uint8Array(32) }),
    decryptFromChannel: vi.fn().mockResolvedValue('decrypted text'),
    getCachedMessage: vi.fn().mockResolvedValue(null),
    setCachedMessage: vi.fn(),
  }),
}));

vi.mock('../lib/api', () => ({
  getChannelMessages: vi.fn().mockResolvedValue([]),
}));

const defaultProps = {
  channelId: 'ch-1',
  serverId: 'srv-1',
  currentUserId: 'user-1',
  getToken: () => 'test-token',
  getStore: () => Promise.resolve(null),
  wsClient: {
    send: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
    isConnected: () => true,
  },
  members: [],
};

describe('Chat byte limit enforcement (LNCH-05)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('send button is enabled for a short ASCII message', async () => {
    await act(async () => {
      render(<Chat {...defaultProps} />);
    });

    const input = screen.getByPlaceholderText('Message...');
    await act(async () => {
      fireEvent.change(input, { target: { value: 'Hello world' } });
    });

    const sendBtn = screen.getByRole('button', { name: 'Send message' });
    expect(sendBtn).not.toBeDisabled();
  });

  it('send button is disabled when byte length exceeds MAX_PLAINTEXT_BYTES (4000)', async () => {
    await act(async () => {
      render(<Chat {...defaultProps} />);
    });

    const input = screen.getByPlaceholderText('Message...');
    // Create a string that is exactly 4001 ASCII bytes (1 byte per char)
    const oversizedText = 'a'.repeat(4001);

    await act(async () => {
      fireEvent.change(input, { target: { value: oversizedText } });
    });

    const sendBtn = screen.getByRole('button', { name: 'Send message' });
    expect(sendBtn).toBeDisabled();
  });

  it('send button is NOT disabled at exactly MAX_PLAINTEXT_BYTES (4000)', async () => {
    await act(async () => {
      render(<Chat {...defaultProps} />);
    });

    const input = screen.getByPlaceholderText('Message...');
    // Exactly 4000 ASCII bytes - should be allowed
    const exactText = 'a'.repeat(4000);

    await act(async () => {
      fireEvent.change(input, { target: { value: exactText } });
    });

    const sendBtn = screen.getByRole('button', { name: 'Send message' });
    expect(sendBtn).not.toBeDisabled();
  });

  it('byte counter appears when message exceeds 80% of MAX_PLAINTEXT_BYTES', async () => {
    await act(async () => {
      render(<Chat {...defaultProps} />);
    });

    const input = screen.getByPlaceholderText('Message...');
    // 3201 bytes > 80% of 4000 (3200 threshold)
    const nearLimitText = 'a'.repeat(3201);

    await act(async () => {
      fireEvent.change(input, { target: { value: nearLimitText } });
    });

    // Counter shows bytes remaining: 4000 - 3201 = 799
    const counter = screen.getByText('799');
    expect(counter).toBeInTheDocument();
  });

  it('byte counter is not shown for short messages (below 80% threshold)', async () => {
    await act(async () => {
      render(<Chat {...defaultProps} />);
    });

    const input = screen.getByPlaceholderText('Message...');
    await act(async () => {
      fireEvent.change(input, { target: { value: 'short message' } });
    });

    // No counter element should exist for short messages
    const counter = document.querySelector('.chat-byte-counter');
    expect(counter).not.toBeInTheDocument();
  });
});

// mark_read tests.

import * as api from '../lib/api';

function makeMsg(id, senderId, timestamp = '2026-04-01T00:00:00.000Z') {
  return { id, senderId, channelId: 'ch-1', ciphertext: 'YWJj', timestamp };
}

describe('Chat mark_read behavior', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
  });

  afterEach(() => {
    cleanup();
  });

  it('sends mark_read for newest non-own message after history load', async () => {
    // API returns newest-first: msg-3 (other), msg-2 (own), msg-1 (other)
    vi.mocked(api.getChannelMessages).mockResolvedValueOnce([
      makeMsg('msg-3', 'user-other', '2026-04-01T00:00:03Z'),
      makeMsg('msg-2', 'user-1',    '2026-04-01T00:00:02Z'),
      makeMsg('msg-1', 'user-other', '2026-04-01T00:00:01Z'),
    ]);
    const onMarkRead = vi.fn();
    const wsClient = { send: vi.fn(), on: vi.fn(), off: vi.fn(), isConnected: () => true };

    await act(async () => {
      render(<Chat {...defaultProps} wsClient={wsClient} markReadEnabled onMarkRead={onMarkRead} />);
    });

    expect(wsClient.send).toHaveBeenCalledWith('message.mark_read', {
      channel_id: 'ch-1',
      message_id: 'msg-3',
    });
    expect(onMarkRead).toHaveBeenCalledWith('ch-1');
  });

  it('does not send mark_read when all loaded messages are own', async () => {
    vi.mocked(api.getChannelMessages).mockResolvedValueOnce([
      makeMsg('msg-1', 'user-1', '2026-04-01T00:00:01Z'),
      makeMsg('msg-2', 'user-1', '2026-04-01T00:00:02Z'),
    ]);
    const send = vi.fn();
    const wsClient = { send, on: vi.fn(), off: vi.fn(), isConnected: () => true };

    await act(async () => {
      render(<Chat {...defaultProps} wsClient={wsClient} markReadEnabled />);
    });

    const markReadCalls = send.mock.calls.filter(([type]) => type === 'message.mark_read');
    expect(markReadCalls).toHaveLength(0);
  });

  it('does not send mark_read when read acknowledgements are disabled', async () => {
    vi.mocked(api.getChannelMessages).mockResolvedValueOnce([
      makeMsg('msg-1', 'user-other', '2026-04-01T00:00:01Z'),
    ]);
    const send = vi.fn();
    const wsClient = { send, on: vi.fn(), off: vi.fn(), isConnected: () => true };

    await act(async () => {
      render(<Chat {...defaultProps} wsClient={wsClient} markReadEnabled={false} />);
    });

    const markReadCalls = send.mock.calls.filter(([type]) => type === 'message.mark_read');
    expect(markReadCalls).toHaveLength(0);
  });
});
