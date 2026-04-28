import { describe, it, expect, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { useDesktopShell } from './useDesktopShell.js';

function HookHarness() {
  useDesktopShell();
  return null;
}

describe('useDesktopShell', () => {
  afterEach(() => {
    cleanup();
    delete window.hushDesktop;
    delete document.documentElement.dataset.desktop;
  });

  it('is a no-op in browser context (no window.hushDesktop bridge)', () => {
    render(<HookHarness />);
    expect(document.documentElement.dataset.desktop).toBeUndefined();
  });

  it('is a no-op when the bridge is present but isDesktop is false', () => {
    window.hushDesktop = { isDesktop: false, platform: 'darwin' };
    render(<HookHarness />);
    expect(document.documentElement.dataset.desktop).toBeUndefined();
  });

  it('sets data-desktop="<platform>" on the document root in macOS desktop context', () => {
    window.hushDesktop = { isDesktop: true, platform: 'darwin' };
    render(<HookHarness />);
    expect(document.documentElement.dataset.desktop).toBe('darwin');
  });

  it('sets data-desktop="win32" on Windows desktop context', () => {
    window.hushDesktop = { isDesktop: true, platform: 'win32' };
    render(<HookHarness />);
    expect(document.documentElement.dataset.desktop).toBe('win32');
  });

  it('sets data-desktop="linux" on Linux (the marker is set; CSS decides what to apply per platform)', () => {
    window.hushDesktop = { isDesktop: true, platform: 'linux' };
    render(<HookHarness />);
    expect(document.documentElement.dataset.desktop).toBe('linux');
  });

  it('removes the marker on unmount', () => {
    window.hushDesktop = { isDesktop: true, platform: 'darwin' };
    const { unmount } = render(<HookHarness />);
    expect(document.documentElement.dataset.desktop).toBe('darwin');
    unmount();
    expect(document.documentElement.dataset.desktop).toBeUndefined();
  });

  it('falls back to "true" when platform is missing or empty', () => {
    window.hushDesktop = { isDesktop: true };
    render(<HookHarness />);
    expect(document.documentElement.dataset.desktop).toBe('true');
  });
});
