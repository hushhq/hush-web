import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import MemberContextMenu from './MemberContextMenu';

// ── Helpers ───────────────────────────────────────────────────────────────────

function member(role = 'member') {
  return { id: 'u1', name: 'Target', role };
}

function renderMenu(props = {}) {
  const defaults = {
    x: 100,
    y: 200,
    member: member('member'),
    myRole: 'mod',
    onAction: vi.fn(),
    onClose: vi.fn(),
  };
  return render(<MemberContextMenu {...defaults} {...props} />);
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('MemberContextMenu - role-gated visibility', () => {
  beforeEach(() => {
    cleanup();
  });

  it('renders null when actor has no rank advantage over target', () => {
    const { container } = renderMenu({ myRole: 'member', member: member('member') });
    expect(container.firstChild).toBeNull();
  });

  it('renders null when actor role is equal to target role', () => {
    const { container } = renderMenu({ myRole: 'mod', member: member('mod') });
    expect(container.firstChild).toBeNull();
  });

  it('renders null when actor has lower rank than target', () => {
    const { container } = renderMenu({ myRole: 'mod', member: member('admin') });
    expect(container.firstChild).toBeNull();
  });

  it('mod sees Kick and Mute against a member', () => {
    renderMenu({ myRole: 'mod', member: member('member') });
    expect(screen.getByRole('menuitem', { name: /kick/i })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: /mute/i })).toBeInTheDocument();
    expect(screen.queryByRole('menuitem', { name: /ban/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('menuitem', { name: /change role/i })).not.toBeInTheDocument();
  });

  it('admin also sees Ban and Change Role against a member', () => {
    renderMenu({ myRole: 'admin', member: member('member') });
    expect(screen.getByRole('menuitem', { name: /kick/i })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: /mute/i })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: /ban/i })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: /change role/i })).toBeInTheDocument();
  });

  it('owner sees the same set as admin against a mod', () => {
    renderMenu({ myRole: 'owner', member: member('mod') });
    expect(screen.getByRole('menuitem', { name: /kick/i })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: /ban/i })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: /change role/i })).toBeInTheDocument();
  });
});

describe('MemberContextMenu - action selection', () => {
  beforeEach(() => {
    cleanup();
  });

  it('clicking Kick calls onAction("kick") and closes exactly once', () => {
    const onAction = vi.fn();
    const onClose = vi.fn();
    renderMenu({ myRole: 'mod', onAction, onClose });

    fireEvent.click(screen.getByRole('menuitem', { name: /kick/i }));

    expect(onAction).toHaveBeenCalledWith('kick');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('clicking Mute calls onAction("mute") and closes exactly once', () => {
    const onAction = vi.fn();
    const onClose = vi.fn();
    renderMenu({ myRole: 'mod', onAction, onClose });

    fireEvent.click(screen.getByRole('menuitem', { name: /mute/i }));

    expect(onAction).toHaveBeenCalledWith('mute');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('clicking Ban calls onAction("ban") and closes exactly once', () => {
    const onAction = vi.fn();
    const onClose = vi.fn();
    renderMenu({ myRole: 'admin', onAction, onClose });

    fireEvent.click(screen.getByRole('menuitem', { name: /ban/i }));

    expect(onAction).toHaveBeenCalledWith('ban');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('clicking Change Role calls onAction("changeRole") and closes exactly once', () => {
    const onAction = vi.fn();
    const onClose = vi.fn();
    renderMenu({ myRole: 'admin', onAction, onClose });

    fireEvent.click(screen.getByRole('menuitem', { name: /change role/i }));

    expect(onAction).toHaveBeenCalledWith('changeRole');
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

describe('MemberContextMenu - danger styling', () => {
  beforeEach(() => {
    cleanup();
  });

  it('Kick has danger class', () => {
    renderMenu({ myRole: 'mod' });
    expect(screen.getByRole('menuitem', { name: /kick/i })).toHaveClass('ui-menu-item--danger');
  });

  it('Ban has danger class', () => {
    renderMenu({ myRole: 'admin' });
    expect(screen.getByRole('menuitem', { name: /ban/i })).toHaveClass('ui-menu-item--danger');
  });

  it('Mute does not have danger class', () => {
    renderMenu({ myRole: 'mod' });
    expect(screen.getByRole('menuitem', { name: /mute/i })).not.toHaveClass('ui-menu-item--danger');
  });

  it('Change Role does not have danger class', () => {
    renderMenu({ myRole: 'admin' });
    expect(screen.getByRole('menuitem', { name: /change role/i })).not.toHaveClass('ui-menu-item--danger');
  });
});
