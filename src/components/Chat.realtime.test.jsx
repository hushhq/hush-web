import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import Chat from './Chat.jsx';

const mockDecryptFromChannel = vi.fn();

vi.mock('../hooks/useAuth', () => ({
  getDeviceId: () => 'device-1',
}));

vi.mock('../hooks/useMLS', () => ({
  useMLS: () => ({
    encryptForChannel: vi.fn().mockResolvedValue({ ciphertext: new Uint8Array(32) }),
    decryptFromChannel: mockDecryptFromChannel,
    getCachedMessage: vi.fn().mockResolvedValue(null),
    setCachedMessage: vi.fn(),
  }),
}));

vi.mock('../lib/api', () => ({
  getChannelMessages: vi.fn().mockResolvedValue([]),
}));

function makeWsClient() {
  const handlers = new Map();
  return {
    send: vi.fn(),
    on: vi.fn((event, handler) => {
      handlers.set(event, handler);
    }),
    off: vi.fn((event) => {
      handlers.delete(event);
    }),
    isConnected: () => true,
    emit(event, payload) {
      handlers.get(event)?.(payload);
    },
  };
}

describe('Chat realtime cross-device behavior', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockDecryptFromChannel.mockResolvedValue('hello from device A');
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
  });

  it('decrypts realtime messages from another device of the same account', async () => {
    const wsClient = makeWsClient();

    render(
      <Chat
        channelId="ch-1"
        serverId="srv-1"
        currentUserId="user-1"
        getToken={() => 'token'}
        getStore={() => Promise.resolve(null)}
        wsClient={wsClient}
        members={[]}
      />,
    );

    await act(async () => {
      wsClient.emit('message.new', {
        id: 'msg-1',
        channel_id: 'ch-1',
        sender_id: 'user-1',
        sender_device_id: 'device-2',
        ciphertext: 'YWJj',
        timestamp: '2026-04-01T23:16:31.998122Z',
      });
    });

    expect(mockDecryptFromChannel).toHaveBeenCalledTimes(1);
    expect(await screen.findByText('hello from device A')).toBeInTheDocument();
  });
});

describe('Chat mark_read realtime behavior', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockDecryptFromChannel.mockResolvedValue('hello');
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
  });

  it('sends mark_read for realtime non-own message.new', async () => {
    const wsClient = makeWsClient();
    const onMarkRead = vi.fn();

    render(
      <Chat
        channelId="ch-1"
        serverId="srv-1"
        currentUserId="user-1"
        getToken={() => 'token'}
        getStore={() => Promise.resolve(null)}
        wsClient={wsClient}
        members={[]}
        markReadEnabled
        onMarkRead={onMarkRead}
      />,
    );

    await act(async () => {
      wsClient.emit('message.new', {
        id: 'rt-msg-1',
        channel_id: 'ch-1',
        sender_id: 'user-other',
        sender_device_id: 'device-other',
        ciphertext: 'YWJj',
        timestamp: '2026-04-01T01:00:00Z',
      });
    });

    expect(wsClient.send).toHaveBeenCalledWith('message.mark_read', {
      channel_id: 'ch-1',
      message_id: 'rt-msg-1',
    });
    expect(onMarkRead).toHaveBeenCalledWith('ch-1');
  });

  it('does not send mark_read for duplicate message id', async () => {
    const wsClient = makeWsClient();

    render(
      <Chat
        channelId="ch-1"
        serverId="srv-1"
        currentUserId="user-1"
        getToken={() => 'token'}
        getStore={() => Promise.resolve(null)}
        wsClient={wsClient}
        members={[]}
        markReadEnabled
      />,
    );

    const payload = {
      id: 'dup-msg',
      channel_id: 'ch-1',
      sender_id: 'user-other',
      sender_device_id: 'device-other',
      ciphertext: 'YWJj',
      timestamp: '2026-04-01T01:00:00Z',
    };

    await act(async () => { wsClient.emit('message.new', payload); });
    // Second emit with same id is blocked by knownMessageIdsRef; only one mark_read.
    await act(async () => { wsClient.emit('message.new', payload); });

    const markReadCalls = wsClient.send.mock.calls.filter(
      ([type]) => type === 'message.mark_read',
    );
    expect(markReadCalls).toHaveLength(1);
  });
});
