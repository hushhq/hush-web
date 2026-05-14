import React from 'react';
import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest';
import { render, cleanup, waitFor } from '@testing-library/react';

vi.mock('../../hooks/useBootController.jsx', () => ({
  useBootController: vi.fn(),
}));

import { useBootController } from '../../hooks/useBootController.jsx';
import { DesktopWindowFloorSync } from './DesktopWindowFloorSync.jsx';

function mockBoot(bootState) {
  useBootController.mockReturnValue({
    bootState,
    user: null,
    mergedGuilds: [],
    guildsLoaded: bootState === 'booted',
  });
}

function installDesktopBridge() {
  const setMinWindowFloor = vi.fn().mockResolvedValue(undefined);
  window.hushDesktop = {
    isDesktop: true,
    platform: 'darwin',
    getAppVersion: () => Promise.resolve('1.2.3'),
    setMinWindowFloor,
  };
  return setMinWindowFloor;
}

describe('DesktopWindowFloorSync', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
    delete window.hushDesktop;
    vi.restoreAllMocks();
  });

  it('is a no-op in browser builds (no preload bridge)', () => {
    mockBoot('needs_login');
    expect(() => render(<DesktopWindowFloorSync />)).not.toThrow();
  });

  it('is a no-op on older desktop builds without setMinWindowFloor', () => {
    window.hushDesktop = { isDesktop: true, platform: 'darwin' };
    mockBoot('needs_login');
    expect(() => render(<DesktopWindowFloorSync />)).not.toThrow();
  });

  it('applies the auth floor while the user is unauthenticated', async () => {
    const setMinWindowFloor = installDesktopBridge();
    mockBoot('needs_login');
    render(<DesktopWindowFloorSync />);
    await waitFor(() => expect(setMinWindowFloor).toHaveBeenCalledWith('auth'));
    expect(setMinWindowFloor).toHaveBeenCalledTimes(1);
  });

  it('keeps the auth floor across loading, needs_pin, and pin_setup boot states', async () => {
    const setMinWindowFloor = installDesktopBridge();

    for (const bootState of ['loading', 'needs_pin', 'pin_setup']) {
      mockBoot(bootState);
      const { unmount } = render(<DesktopWindowFloorSync />);
      // eslint-disable-next-line no-await-in-loop
      await waitFor(() => expect(setMinWindowFloor).toHaveBeenLastCalledWith('auth'));
      unmount();
    }
  });

  it('switches to the operative-app floor on ready and booted', async () => {
    const setMinWindowFloor = installDesktopBridge();

    mockBoot('ready');
    const { unmount } = render(<DesktopWindowFloorSync />);
    await waitFor(() => expect(setMinWindowFloor).toHaveBeenCalledWith('app'));
    unmount();

    setMinWindowFloor.mockClear();
    mockBoot('booted');
    render(<DesktopWindowFloorSync />);
    await waitFor(() => expect(setMinWindowFloor).toHaveBeenCalledWith('app'));
  });

  it('does not redundantly push the same profile twice when the boot state churns', async () => {
    const setMinWindowFloor = installDesktopBridge();
    mockBoot('needs_login');
    const { rerender } = render(<DesktopWindowFloorSync />);
    await waitFor(() => expect(setMinWindowFloor).toHaveBeenCalledTimes(1));

    // Re-render with the same boot state. The component should not re-send.
    rerender(<DesktopWindowFloorSync />);
    expect(setMinWindowFloor).toHaveBeenCalledTimes(1);
  });
});
