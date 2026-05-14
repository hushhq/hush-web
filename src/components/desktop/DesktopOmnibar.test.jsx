import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, cleanup, fireEvent } from '@testing-library/react';
import { DesktopOmnibar, OPEN_COMMAND_PALETTE_EVENT } from './DesktopOmnibar.jsx';

describe('DesktopOmnibar', () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('renders the macOS shortcut label on darwin', () => {
    const { container } = render(<DesktopOmnibar platform="darwin" />);
    const shortcut = container.querySelector('.hush-desktop-omnibar__shortcut');
    expect(shortcut).not.toBeNull();
    expect(shortcut?.textContent).toBe('⌘K');
    expect(shortcut?.getAttribute('data-shortcut')).toBe('mac');
  });

  it('renders the Ctrl K shortcut label on non-darwin platforms', () => {
    const { container } = render(<DesktopOmnibar platform="win32" />);
    const shortcut = container.querySelector('.hush-desktop-omnibar__shortcut');
    expect(shortcut?.textContent).toBe('Ctrl K');
    expect(shortcut?.getAttribute('data-shortcut')).toBe('pc');
  });

  it('renders the Ctrl K shortcut label on linux too', () => {
    const { container } = render(<DesktopOmnibar platform="linux" />);
    const shortcut = container.querySelector('.hush-desktop-omnibar__shortcut');
    expect(shortcut?.textContent).toBe('Ctrl K');
  });

  it('shows the canonical placeholder copy', () => {
    const { container } = render(<DesktopOmnibar platform="darwin" />);
    const placeholder = container.querySelector('.hush-desktop-omnibar__placeholder');
    expect(placeholder?.textContent).toBe('Search or jump to…');
  });

  it('is no-drag so the user can actually click it through the drag region', () => {
    const { container } = render(<DesktopOmnibar platform="darwin" />);
    const button = container.querySelector('.hush-desktop-omnibar');
    expect(button instanceof HTMLButtonElement).toBe(true);
    expect(button.style.WebkitAppRegion).toBe('no-drag');
  });

  it('dispatches the open-command-palette event on click', () => {
    const listener = vi.fn();
    window.addEventListener(OPEN_COMMAND_PALETTE_EVENT, listener);
    const { container } = render(<DesktopOmnibar platform="darwin" />);
    const button = container.querySelector('.hush-desktop-omnibar');
    fireEvent.click(button);
    expect(listener).toHaveBeenCalledTimes(1);
    window.removeEventListener(OPEN_COMMAND_PALETTE_EVENT, listener);
  });
});
