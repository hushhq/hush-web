import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest';
import { render, cleanup } from '@testing-library/react';

vi.mock('../../hooks/useBootController.jsx', () => ({
  useBootController: vi.fn(() => ({
    bootState: 'needs_login',
    user: null,
    mergedGuilds: [],
    guildsLoaded: false,
  })),
}));

vi.mock('../../contexts/InstanceContext.jsx', () => ({
  useInstanceContext: vi.fn(() => ({ mergedGuilds: [] })),
}));

vi.mock('./useInstancePing.js', () => ({
  useInstancePing: vi.fn(() => ({ ms: null, status: 'unknown' })),
  PING_INTERVAL_MS: 15_000,
  PING_TIMEOUT_MS: 4_000,
}));

import { DesktopShell } from './DesktopShell.jsx';

function Child() {
  return <div data-testid="app-shell-content">app</div>;
}

describe('DesktopShell', () => {
  afterEach(() => {
    cleanup();
    delete window.hushDesktop;
  });

  it('passes children through unchanged in a browser context', () => {
    const { container } = render(
      <DesktopShell>
        <Child />
      </DesktopShell>,
    );
    expect(container.querySelector('.hush-desktop-shell')).toBeNull();
    expect(container.querySelector('[data-testid="app-shell-content"]')).not.toBeNull();
  });

  it('passes children through unchanged on Linux desktop (native frame retained)', () => {
    window.hushDesktop = {
      isDesktop: true,
      platform: 'linux',
      getAppVersion: () => Promise.resolve('1.0.0'),
    };
    const { container } = render(
      <DesktopShell>
        <Child />
      </DesktopShell>,
    );
    expect(container.querySelector('.hush-desktop-shell')).toBeNull();
    expect(container.querySelector('[data-testid="app-shell-content"]')).not.toBeNull();
  });

  it('wraps children in a flex-column shell with topbar above the content on macOS', () => {
    window.hushDesktop = {
      isDesktop: true,
      platform: 'darwin',
      getAppVersion: () => Promise.resolve('1.2.3'),
    };
    const { container } = render(
      <DesktopShell>
        <Child />
      </DesktopShell>,
    );
    const shell = container.querySelector('.hush-desktop-shell');
    expect(shell).not.toBeNull();
    expect(shell.dataset.platform).toBe('darwin');

    const children = Array.from(shell.children);
    expect(children).toHaveLength(2);
    expect(children[0].classList.contains('hush-desktop-topbar')).toBe(true);
    expect(children[1].classList.contains('hush-desktop-shell__content')).toBe(true);
    expect(
      children[1].querySelector('[data-testid="app-shell-content"]'),
    ).not.toBeNull();
  });

  it('wraps children with the same shell on Windows desktop', () => {
    window.hushDesktop = {
      isDesktop: true,
      platform: 'win32',
      getAppVersion: () => Promise.resolve('1.2.3'),
    };
    const { container } = render(
      <DesktopShell>
        <Child />
      </DesktopShell>,
    );
    const shell = container.querySelector('.hush-desktop-shell');
    expect(shell).not.toBeNull();
    expect(shell.dataset.platform).toBe('win32');
    expect(
      shell.querySelector('.hush-desktop-topbar[data-platform="win32"]'),
    ).not.toBeNull();
  });
});
