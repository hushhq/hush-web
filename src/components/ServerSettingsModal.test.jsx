import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';

const {
  mockGetGuildMembers,
} = vi.hoisted(() => ({
  mockGetGuildMembers: vi.fn(),
}));

vi.mock('../lib/api', () => ({
  getGuildMembers: mockGetGuildMembers,
  listBans: vi.fn().mockResolvedValue([]),
  listMutes: vi.fn().mockResolvedValue([]),
  unbanUser: vi.fn().mockResolvedValue(undefined),
  unmuteUser: vi.fn().mockResolvedValue(undefined),
  getAuditLog: vi.fn().mockResolvedValue([]),
  leaveGuild: vi.fn().mockResolvedValue(undefined),
  deleteGuild: vi.fn().mockResolvedValue(undefined),
}));

import ServerSettingsModal from './ServerSettingsModal.jsx';

function renderServerSettings(overrides = {}) {
  return render(
    <ServerSettingsModal
      onClose={vi.fn()}
      getToken={() => 'token'}
      serverId="guild-1"
      instanceName="Project Alpha"
      isAdmin
      myRole="owner"
      showToast={vi.fn()}
      members={[]}
      {...overrides}
    />,
  );
}

describe('ServerSettingsModal', () => {
  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
    mockGetGuildMembers.mockResolvedValue([
      { id: 'user-1', username: 'alice', role: 'member' },
    ]);
  });

  afterEach(() => {
    cleanup();
  });

  it('renders server settings inside the shared dialog shell', () => {
    renderServerSettings();

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: /settings navigation/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /overview/i })).toBeInTheDocument();
    expect(screen.getByText('Project Alpha settings')).toBeInTheDocument();
  });

  it('shows moderation tabs for admins', () => {
    renderServerSettings({ isAdmin: true, myRole: 'admin' });

    expect(screen.getByRole('button', { name: /audit log/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /bans & mutes/i })).toBeInTheDocument();
  });

  it('hides admin-only tabs for non-admins and defaults to members', async () => {
    renderServerSettings({ isAdmin: false, myRole: 'member' });

    expect(screen.queryByRole('button', { name: /overview/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /audit log/i })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /members/i })).toBeInTheDocument();

    await waitFor(() => {
      expect(mockGetGuildMembers).toHaveBeenCalledWith('token', 'guild-1');
    });
  });

  it('delegates close behavior to the dialog shell', () => {
    const onClose = vi.fn();
    renderServerSettings({ onClose });

    fireEvent.click(screen.getByRole('button', { name: /close/i }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
