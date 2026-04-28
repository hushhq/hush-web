import { describe, it, expect, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { ElectronDragRegion } from './ElectronDragRegion.jsx';

describe('ElectronDragRegion', () => {
  afterEach(() => {
    cleanup();
    delete window.hushDesktop;
  });

  it('renders nothing in browser context (no window.hushDesktop bridge)', () => {
    const { container } = render(<ElectronDragRegion />);
    expect(container.querySelector('.electron-drag-region')).toBeNull();
  });

  it('renders nothing when window.hushDesktop is present but isDesktop is false', () => {
    window.hushDesktop = { isDesktop: false, platform: 'darwin' };
    const { container } = render(<ElectronDragRegion />);
    expect(container.querySelector('.electron-drag-region')).toBeNull();
  });

  it('renders the invisible drag region on macOS desktop context', () => {
    window.hushDesktop = { isDesktop: true, platform: 'darwin' };
    const { container } = render(<ElectronDragRegion />);
    const region = container.querySelector('.electron-drag-region');
    expect(region).not.toBeNull();
    // Must be aria-hidden — purely a window-drag affordance, not content.
    expect(region.getAttribute('aria-hidden')).toBe('true');
    // Carries platform marker for any platform-specific styling later.
    expect(region.dataset.platform).toBe('darwin');
  });

  it('renders the invisible drag region on Windows desktop context', () => {
    window.hushDesktop = { isDesktop: true, platform: 'win32' };
    const { container } = render(<ElectronDragRegion />);
    const region = container.querySelector('.electron-drag-region');
    expect(region).not.toBeNull();
    expect(region.dataset.platform).toBe('win32');
  });

  it('skips rendering on Linux (native frame already provides a drag handle)', () => {
    window.hushDesktop = { isDesktop: true, platform: 'linux' };
    const { container } = render(<ElectronDragRegion />);
    expect(container.querySelector('.electron-drag-region')).toBeNull();
  });
});
