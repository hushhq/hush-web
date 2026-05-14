import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, cleanup, act } from '@testing-library/react';
import { DesktopUpdateGate } from './DesktopUpdateGate.tsx';

function installDesktopBridge(initial = null) {
  const listeners = new Set();
  const bridge = {
    isDesktop: true,
    platform: 'darwin',
    getDesktopUpdateState: vi.fn().mockResolvedValue(initial),
    onDesktopUpdateState: vi.fn((listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    }),
  };
  window.hushDesktop = bridge;
  return {
    bridge,
    emit(state) {
      for (const listener of listeners) listener(state);
    },
  };
}

async function flushHookEffects() {
  // Two microtask hops to let `getDesktopUpdateState().then(...)` resolve and
  // React commit the resulting `setState` inside `act`.
  await act(async () => {
    await Promise.resolve();
    await Promise.resolve();
  });
}

describe('DesktopUpdateGate', () => {
  afterEach(() => {
    cleanup();
    delete window.hushDesktop;
  });

  it('Gate_NoDesktopBridge_RendersNothing', () => {
    const { container } = render(<DesktopUpdateGate />);
    expect(container.firstChild).toBeNull();
  });

  it('Gate_IdlePhase_RendersNothing', async () => {
    installDesktopBridge({
      phase: 'idle',
      currentVersion: '0.1.0-mvp',
      targetVersion: null,
      progress: null,
      error: null,
    });
    const { container } = render(<DesktopUpdateGate />);
    await flushHookEffects();
    expect(container.firstChild).toBeNull();
  });

  it('Gate_SkippedPhase_RendersNothing', async () => {
    installDesktopBridge({
      phase: 'skipped',
      currentVersion: '0.1.0-mvp',
      targetVersion: null,
      progress: null,
      error: 'timeout',
    });
    const { container } = render(<DesktopUpdateGate />);
    await flushHookEffects();
    expect(container.firstChild).toBeNull();
  });

  it('Gate_ErrorPhase_RendersNothing', async () => {
    installDesktopBridge({
      phase: 'error',
      currentVersion: '0.1.0-mvp',
      targetVersion: '0.1.1-mvp',
      progress: null,
      error: 'connection reset',
    });
    const { container } = render(<DesktopUpdateGate />);
    await flushHookEffects();
    expect(container.firstChild).toBeNull();
  });

  it('Gate_CheckingPhase_VisibleWithChecksCopy', async () => {
    installDesktopBridge({
      phase: 'checking',
      currentVersion: '0.1.0-mvp',
      targetVersion: '0.1.1-mvp',
      progress: null,
      error: null,
    });
    const { findByTestId } = render(<DesktopUpdateGate />);
    const gate = await findByTestId('desktop-update-gate');
    expect(gate.getAttribute('data-phase')).toBe('checking');
    expect(gate.textContent).toContain('Checking for desktop update');
  });

  it('Gate_DownloadingPhase_ForwardsPercentToProgress', async () => {
    const harness = installDesktopBridge({
      phase: 'checking',
      currentVersion: '0.1.0-mvp',
      targetVersion: '0.1.1-mvp',
      progress: null,
      error: null,
    });
    const { findByTestId } = render(<DesktopUpdateGate />);
    await findByTestId('desktop-update-gate');
    act(() => {
      harness.emit({
        phase: 'downloading',
        currentVersion: '0.1.0-mvp',
        targetVersion: '0.1.1-mvp',
        progress: { percent: 42, transferred: 1048576, total: 2097152, bytesPerSecond: 1024 },
        error: null,
      });
    });
    const progress = await findByTestId('desktop-update-progress');
    const indicator = progress.querySelector('[data-slot="progress-indicator"]');
    expect(indicator?.getAttribute('style')).toContain('translateX(-58%)');
    const label = await findByTestId('desktop-update-progress-label');
    expect(label.textContent).toContain('42%');
    expect(label.textContent).toContain('1.0 MB');
    expect(label.textContent).toContain('2.0 MB');
  });

  it('Gate_VersionLabel_RendersCurrentArrowTarget', async () => {
    installDesktopBridge({
      phase: 'downloading',
      currentVersion: '0.1.0-mvp',
      targetVersion: '0.1.1-mvp',
      progress: { percent: 10, transferred: 0, total: 0, bytesPerSecond: 0 },
      error: null,
    });
    const { findByTestId } = render(<DesktopUpdateGate />);
    const label = await findByTestId('desktop-update-version-label');
    expect(label.textContent).toBe('0.1.0-mvp -> 0.1.1-mvp');
  });

  it('Gate_DownloadedPhase_ShowsRestartingCopy', async () => {
    installDesktopBridge({
      phase: 'downloaded',
      currentVersion: '0.1.0-mvp',
      targetVersion: '0.1.1-mvp',
      progress: { percent: 100, transferred: 2097152, total: 2097152, bytesPerSecond: 0 },
      error: null,
    });
    const { findByTestId } = render(<DesktopUpdateGate />);
    const gate = await findByTestId('desktop-update-gate');
    expect(gate.getAttribute('data-phase')).toBe('downloaded');
    expect(gate.textContent).toContain('Restarting to finish update');
  });

  it('Gate_HasNoCloseButton_AndIsModal', async () => {
    installDesktopBridge({
      phase: 'downloading',
      currentVersion: '0.1.0-mvp',
      targetVersion: '0.1.1-mvp',
      progress: { percent: 25, transferred: 0, total: 0, bytesPerSecond: 0 },
      error: null,
    });
    const { findByTestId } = render(<DesktopUpdateGate />);
    const gate = await findByTestId('desktop-update-gate');
    expect(gate.getAttribute('aria-modal')).toBe('true');
    expect(gate.querySelector('button')).toBeNull();
    expect(gate.querySelector('[aria-label="Close"]')).toBeNull();
  });

  it('Gate_PushedState_ReplacesInitialSnapshot', async () => {
    const harness = installDesktopBridge({
      phase: 'idle',
      currentVersion: '0.1.0-mvp',
      targetVersion: null,
      progress: null,
      error: null,
    });
    const { container, findByTestId } = render(<DesktopUpdateGate />);
    await flushHookEffects();
    expect(container.firstChild).toBeNull();
    act(() => {
      harness.emit({
        phase: 'checking',
        currentVersion: '0.1.0-mvp',
        targetVersion: '0.1.2-mvp',
        progress: null,
        error: null,
      });
    });
    const gate = await findByTestId('desktop-update-gate');
    expect(gate.getAttribute('data-phase')).toBe('checking');
  });

  it('Gate_Unmount_RemovesIpcListener', async () => {
    const unsubscribe = vi.fn();
    window.hushDesktop = {
      isDesktop: true,
      platform: 'darwin',
      getDesktopUpdateState: vi.fn().mockResolvedValue(null),
      onDesktopUpdateState: vi.fn(() => unsubscribe),
    };
    const { unmount } = render(<DesktopUpdateGate />);
    await flushHookEffects();
    unmount();
    expect(unsubscribe).toHaveBeenCalledTimes(1);
  });
});
