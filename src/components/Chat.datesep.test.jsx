/**
 * Tests for date separator rendering after the HUSHHQ-115 precompute
 * refactor. Asserts that exactly one separator appears between messages on
 * different calendar days and that "Today" is shown for the current day.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act, cleanup } from '@testing-library/react';
import Chat from './Chat.jsx';
import * as api from '../lib/api';

vi.mock('../hooks/useMLS', () => ({
  useMLS: () => ({
    encryptForChannel: vi.fn().mockResolvedValue({ ciphertext: new Uint8Array(32) }),
    decryptFromChannel: vi.fn().mockResolvedValue('msg text'),
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
  getToken: () => 'token',
  getStore: () => Promise.resolve(null),
  wsClient: {
    send: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
    isConnected: () => true,
  },
  members: [],
};

function makeMsg(id, timestamp) {
  return { id, senderId: 'user-other', channelId: 'ch-1', ciphertext: 'YWJj', timestamp };
}

describe('Chat date separators (HUSHHQ-115)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders exactly two separators for messages spanning two calendar days', async () => {
    vi.mocked(api.getChannelMessages).mockResolvedValueOnce([
      makeMsg('msg-day1', '2026-01-01T10:00:00.000Z'),
      makeMsg('msg-day2', '2026-01-02T10:00:00.000Z'),
    ]);

    await act(async () => {
      render(<Chat {...defaultProps} />);
    });

    // First message always gets a separator; second message on a different day gets one too.
    const dateSeps = document.querySelectorAll('.date-separator');
    expect(dateSeps).toHaveLength(2);
    const labels = Array.from(document.querySelectorAll('.date-separator-label')).map(
      (el) => el.textContent
    );
    expect(labels).toContain('Jan 1, 2026');
    expect(labels).toContain('Jan 2, 2026');
  });

  it('shows "Today" label for messages with a timestamp on the current calendar day', async () => {
    const todayTs = new Date().toISOString();
    vi.mocked(api.getChannelMessages).mockResolvedValueOnce([
      makeMsg('msg-today', todayTs),
    ]);

    await act(async () => {
      render(<Chat {...defaultProps} />);
    });

    expect(screen.getByText('Today')).toBeInTheDocument();
  });

  it('shows no extra separators when all messages are on the same day', async () => {
    vi.mocked(api.getChannelMessages).mockResolvedValueOnce([
      makeMsg('msg-a', '2026-03-15T08:00:00.000Z'),
      makeMsg('msg-b', '2026-03-15T09:00:00.000Z'),
      makeMsg('msg-c', '2026-03-15T10:00:00.000Z'),
    ]);

    await act(async () => {
      render(<Chat {...defaultProps} />);
    });

    const dateSeps = document.querySelectorAll('.date-separator');
    expect(dateSeps).toHaveLength(1);
  });
});
