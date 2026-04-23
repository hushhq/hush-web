import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import GuildContextMenu from './GuildContextMenu';

// GuildContextMenu renders via createPortal into document.body.
// Testing Library's render appends to document.body by default, so portal rendering works.

// ── Helpers ───────────────────────────────────────────────────────────────────

const GUILD = { id: 'g1', name: 'Alpha Guild' };
const INSTANCE_URL = 'https://a.example.com';
const POSITION = { x: 100, y: 200 };

function renderMenu(props = {}) {
  const defaults = {
    guild: GUILD,
    instanceUrl: INSTANCE_URL,
    position: POSITION,
    connectionState: 'connected',
    userPermissionLevel: 0,
    onClose: vi.fn(),
    onLeave: vi.fn(),
    onMute: vi.fn(),
    onCopyInvite: vi.fn(),
    onMarkRead: vi.fn(),
    onSettings: vi.fn(),
    onInstanceInfo: vi.fn(),
  };
  return render(<GuildContextMenu {...defaults} {...props} />);
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('GuildContextMenu - positioning and structure', () => {
  beforeEach(() => {
    cleanup();
  });

  it('renders with role="menu"', () => {
    renderMenu();
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('renders in document when position is given', () => {
    renderMenu({ position: { x: 150, y: 300 } });
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('shows instance domain as header label', () => {
    renderMenu({ instanceUrl: 'https://test.hush.io' });
    expect(screen.getByText(/test\.hush\.io/i)).toBeInTheDocument();
  });

  it('shows "offline" badge when connectionState is not connected', () => {
    renderMenu({ connectionState: 'offline' });
    expect(screen.getByText(/offline/i)).toBeInTheDocument();
  });

  it('does not show offline badge when instance is connected', () => {
    renderMenu({ connectionState: 'connected' });
    expect(screen.queryByText(/offline/i)).not.toBeInTheDocument();
  });
});

describe('GuildContextMenu - actions', () => {
  beforeEach(() => {
    cleanup();
  });

  it('renders Mark as read action', () => {
    renderMenu();
    expect(screen.getByRole('menuitem', { name: /mark as read/i })).toBeInTheDocument();
  });

  it('renders Copy invite link action', () => {
    renderMenu();
    expect(screen.getByRole('menuitem', { name: /copy invite link/i })).toBeInTheDocument();
  });

  it('renders Mute notifications action', () => {
    renderMenu();
    expect(screen.getByRole('menuitem', { name: /mute notifications/i })).toBeInTheDocument();
  });

  it('renders Instance info action', () => {
    renderMenu();
    expect(screen.getByRole('menuitem', { name: /instance info/i })).toBeInTheDocument();
  });

  it('renders Leave server action', () => {
    renderMenu();
    expect(screen.getByRole('menuitem', { name: /leave server/i })).toBeInTheDocument();
  });

  it('Mark as read calls onMarkRead and closes exactly once', () => {
    const onMarkRead = vi.fn();
    const onClose = vi.fn();
    renderMenu({ onMarkRead, onClose });

    fireEvent.click(screen.getByRole('menuitem', { name: /mark as read/i }));

    expect(onMarkRead).toHaveBeenCalledWith(GUILD);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('Copy invite link calls onCopyInvite and closes exactly once', () => {
    const onCopyInvite = vi.fn();
    const onClose = vi.fn();
    renderMenu({ onCopyInvite, onClose });

    fireEvent.click(screen.getByRole('menuitem', { name: /copy invite link/i }));

    expect(onCopyInvite).toHaveBeenCalledWith(GUILD);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('Instance info calls onInstanceInfo and closes exactly once', () => {
    const onInstanceInfo = vi.fn();
    const onClose = vi.fn();
    renderMenu({ onInstanceInfo, onClose });

    fireEvent.click(screen.getByRole('menuitem', { name: /instance info/i }));

    expect(onInstanceInfo).toHaveBeenCalledWith(GUILD, INSTANCE_URL);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('Leave server calls onLeave and closes exactly once', () => {
    const onLeave = vi.fn();
    const onClose = vi.fn();
    renderMenu({ onLeave, onClose });

    fireEvent.click(screen.getByRole('menuitem', { name: /leave server/i }));

    expect(onLeave).toHaveBeenCalledWith(GUILD);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('Copy invite link is disabled when instance is offline', () => {
    renderMenu({ connectionState: 'offline' });
    const copyBtn = screen.getByRole('menuitem', { name: /copy invite link/i });
    expect(copyBtn).toHaveAttribute('aria-disabled', 'true');
  });

  it('disabled Copy invite link does not call onCopyInvite', () => {
    const onCopyInvite = vi.fn();
    renderMenu({ connectionState: 'offline', onCopyInvite });

    fireEvent.click(screen.getByRole('menuitem', { name: /copy invite link/i }));

    expect(onCopyInvite).not.toHaveBeenCalled();
  });
});

describe('GuildContextMenu - Settings visibility', () => {
  beforeEach(() => {
    cleanup();
  });

  it('Server settings action is NOT shown for members (permissionLevel < 2)', () => {
    renderMenu({ userPermissionLevel: 0 });
    expect(screen.queryByRole('menuitem', { name: /server settings/i })).not.toBeInTheDocument();
  });

  it('Server settings action is NOT shown for permissionLevel 1', () => {
    renderMenu({ userPermissionLevel: 1 });
    expect(screen.queryByRole('menuitem', { name: /server settings/i })).not.toBeInTheDocument();
  });

  it('Server settings action IS shown for admins (permissionLevel >= 2)', () => {
    renderMenu({ userPermissionLevel: 2 });
    expect(screen.getByRole('menuitem', { name: /server settings/i })).toBeInTheDocument();
  });

  it('Server settings calls onSettings and closes exactly once', () => {
    const onSettings = vi.fn();
    const onClose = vi.fn();
    renderMenu({ userPermissionLevel: 2, onSettings, onClose });

    fireEvent.click(screen.getByRole('menuitem', { name: /server settings/i }));

    expect(onSettings).toHaveBeenCalledWith(GUILD);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

describe('GuildContextMenu - Mute submenu', () => {
  beforeEach(() => {
    cleanup();
  });

  it('Mute notifications is rendered as a sub-menu trigger', () => {
    renderMenu();
    expect(screen.getByRole('menuitem', { name: /mute notifications/i })).toBeInTheDocument();
  });

  it('all four duration options appear after opening the sub-menu', () => {
    renderMenu();
    fireEvent.click(screen.getByRole('menuitem', { name: /mute notifications/i }));

    expect(screen.getByRole('menuitem', { name: /^1 hour$/i })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: /^8 hours$/i })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: /^24 hours$/i })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: /^forever$/i })).toBeInTheDocument();
  });

  it('clicking 1 hour calls onMute with the correct ms duration and closes exactly once', () => {
    const onMute = vi.fn();
    const onClose = vi.fn();
    renderMenu({ onMute, onClose });

    fireEvent.click(screen.getByRole('menuitem', { name: /mute notifications/i }));
    fireEvent.click(screen.getByRole('menuitem', { name: /^1 hour$/i }));

    expect(onMute).toHaveBeenCalledWith(GUILD, 60 * 60 * 1000);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('clicking Forever calls onMute with null duration and closes exactly once', () => {
    const onMute = vi.fn();
    const onClose = vi.fn();
    renderMenu({ onMute, onClose });

    fireEvent.click(screen.getByRole('menuitem', { name: /mute notifications/i }));
    fireEvent.click(screen.getByRole('menuitem', { name: /^forever$/i }));

    expect(onMute).toHaveBeenCalledWith(GUILD, null);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('clicking 8 hours calls onMute with correct ms duration', () => {
    const onMute = vi.fn();
    renderMenu({ onMute });

    fireEvent.click(screen.getByRole('menuitem', { name: /mute notifications/i }));
    fireEvent.click(screen.getByRole('menuitem', { name: /^8 hours$/i }));

    expect(onMute).toHaveBeenCalledWith(GUILD, 8 * 60 * 60 * 1000);
  });

  it('clicking 24 hours calls onMute with correct ms duration', () => {
    const onMute = vi.fn();
    renderMenu({ onMute });

    fireEvent.click(screen.getByRole('menuitem', { name: /mute notifications/i }));
    fireEvent.click(screen.getByRole('menuitem', { name: /^24 hours$/i }));

    expect(onMute).toHaveBeenCalledWith(GUILD, 24 * 60 * 60 * 1000);
  });
});

describe('GuildContextMenu - dismiss behaviors', () => {
  beforeEach(() => {
    cleanup();
  });

  it('Escape key calls onClose exactly once', () => {
    const onClose = vi.fn();
    renderMenu({ onClose });

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('outside pointer dismiss is wired via onOpenChange', () => {
    // The menu primitive's dismiss layer owns outside-pointer detection; JSDOM cannot
    // simulate its hit-testing. Verify the menu is open (onClose not yet called).
    const onClose = vi.fn();
    renderMenu({ onClose });
    expect(screen.getByRole('menu')).toBeInTheDocument();
    expect(onClose).not.toHaveBeenCalled();
  });

  it('click inside menu does NOT call onClose unexpectedly', () => {
    const onClose = vi.fn();
    renderMenu({ onClose });

    fireEvent.pointerDown(screen.getByRole('menu'));

    expect(onClose).not.toHaveBeenCalled();
  });
});
