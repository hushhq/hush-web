import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import ChannelAreaHeader from './ChannelAreaHeader';

describe('ChannelAreaHeader', () => {
  beforeEach(() => {
    cleanup();
  });

  it('renders hamburger toggle and Members button on mobile', () => {
    const onToggleDrawer = vi.fn();
    const onToggleMembers = vi.fn();

    render(
      <ChannelAreaHeader
        isMobile={true}
        onToggleDrawer={onToggleDrawer}
        onToggleMembers={onToggleMembers}
        showMembers={false}
      />,
    );

    expect(screen.getByRole('button', { name: /toggle channels/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /members/i })).toBeInTheDocument();
  });

  it('does not render hamburger toggle on desktop', () => {
    render(
      <ChannelAreaHeader
        isMobile={false}
        onToggleDrawer={vi.fn()}
        onToggleMembers={vi.fn()}
        showMembers={false}
      />,
    );

    expect(screen.queryByRole('button', { name: /toggle channels/i })).toBeNull();
    expect(screen.getByRole('button', { name: /members/i })).toBeInTheDocument();
  });

  it('calls onToggleDrawer when hamburger is clicked', () => {
    const onToggleDrawer = vi.fn();
    render(
      <ChannelAreaHeader
        isMobile={true}
        onToggleDrawer={onToggleDrawer}
        onToggleMembers={vi.fn()}
        showMembers={false}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /toggle channels/i }));
    expect(onToggleDrawer).toHaveBeenCalledOnce();
  });

  it('calls onToggleMembers when Members button is clicked', () => {
    const onToggleMembers = vi.fn();
    render(
      <ChannelAreaHeader
        isMobile={false}
        onToggleDrawer={vi.fn()}
        onToggleMembers={onToggleMembers}
        showMembers={false}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /members/i }));
    expect(onToggleMembers).toHaveBeenCalledOnce();
  });

  it('sets aria-pressed on Members button when showMembers is true', () => {
    render(
      <ChannelAreaHeader
        isMobile={false}
        onToggleDrawer={vi.fn()}
        onToggleMembers={vi.fn()}
        showMembers={true}
      />,
    );

    const btn = screen.getByRole('button', { name: /members/i });
    expect(btn.getAttribute('aria-pressed')).toBe('true');
  });
});
