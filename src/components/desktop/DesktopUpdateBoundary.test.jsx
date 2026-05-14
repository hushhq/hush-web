import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, cleanup, act } from '@testing-library/react';
import { DesktopUpdateBoundary } from './DesktopUpdateBoundary.jsx';

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
  await act(async () => {
    await Promise.resolve();
    await Promise.resolve();
  });
}

function Child() {
  return <div data-testid="protected-child">child</div>;
}

describe('DesktopUpdateBoundary', () => {
  afterEach(() => {
    cleanup();
    delete window.hushDesktop;
  });

  it('Browser_NoBridge_RendersChildren', () => {
    const { queryByTestId } = render(
      <DesktopUpdateBoundary>
        <Child />
      </DesktopUpdateBoundary>,
    );
    expect(queryByTestId('protected-child')).not.toBeNull();
    expect(queryByTestId('desktop-update-gate')).toBeNull();
  });

  it('Desktop_MissingUpdateIpcMethods_FailsOpenAndRendersChildren', () => {
    window.hushDesktop = { isDesktop: true, platform: 'darwin' };
    const { queryByTestId } = render(
      <DesktopUpdateBoundary>
        <Child />
      </DesktopUpdateBoundary>,
    );
    expect(queryByTestId('protected-child')).not.toBeNull();
    expect(queryByTestId('desktop-update-gate')).toBeNull();
  });

  it('Desktop_UpdateSnapshotRejects_FailsOpenAndRendersChildren', async () => {
    window.hushDesktop = {
      isDesktop: true,
      platform: 'darwin',
      getDesktopUpdateState: vi.fn().mockRejectedValue(new Error('ipc failed')),
      onDesktopUpdateState: vi.fn(() => () => {}),
    };
    const { queryByTestId } = render(
      <DesktopUpdateBoundary>
        <Child />
      </DesktopUpdateBoundary>,
    );
    await flushHookEffects();
    expect(queryByTestId('protected-child')).not.toBeNull();
    expect(queryByTestId('desktop-update-gate')).toBeNull();
  });

  it('Desktop_UpdateSubscriptionThrows_FailsOpenAndRendersChildren', async () => {
    window.hushDesktop = {
      isDesktop: true,
      platform: 'darwin',
      getDesktopUpdateState: vi.fn().mockResolvedValue(null),
      onDesktopUpdateState: vi.fn(() => {
        throw new Error('subscribe failed');
      }),
    };
    const { queryByTestId } = render(
      <DesktopUpdateBoundary>
        <Child />
      </DesktopUpdateBoundary>,
    );
    await flushHookEffects();
    expect(queryByTestId('protected-child')).not.toBeNull();
    expect(queryByTestId('desktop-update-gate')).toBeNull();
  });

  it('Desktop_WithIpc_PendingSnapshot_RendersCheckingGateAndBlocksChildren', async () => {
    installDesktopBridge(null);
    const { queryByTestId, findByTestId } = render(
      <DesktopUpdateBoundary>
        <Child />
      </DesktopUpdateBoundary>,
    );
    await flushHookEffects();
    const gate = await findByTestId('desktop-update-gate');
    expect(gate.getAttribute('data-phase')).toBe('checking');
    expect(queryByTestId('protected-child')).toBeNull();
  });

  it('Desktop_IdlePhase_FailsOpenAndRendersChildren', async () => {
    installDesktopBridge({
      phase: 'idle',
      currentVersion: '0.1.0-mvp',
      targetVersion: null,
      progress: null,
      error: null,
    });
    const { queryByTestId } = render(
      <DesktopUpdateBoundary>
        <Child />
      </DesktopUpdateBoundary>,
    );
    await flushHookEffects();
    expect(queryByTestId('protected-child')).not.toBeNull();
    expect(queryByTestId('desktop-update-gate')).toBeNull();
  });

  it('Desktop_SkippedPhase_RendersChildren', async () => {
    installDesktopBridge({
      phase: 'skipped',
      currentVersion: '0.1.0-mvp',
      targetVersion: null,
      progress: null,
      error: 'timeout',
    });
    const { queryByTestId } = render(
      <DesktopUpdateBoundary>
        <Child />
      </DesktopUpdateBoundary>,
    );
    await flushHookEffects();
    expect(queryByTestId('protected-child')).not.toBeNull();
    expect(queryByTestId('desktop-update-gate')).toBeNull();
  });

  it('Desktop_ErrorPhase_RendersChildren', async () => {
    installDesktopBridge({
      phase: 'error',
      currentVersion: '0.1.0-mvp',
      targetVersion: '0.1.1-mvp',
      progress: null,
      error: 'connection reset',
    });
    const { queryByTestId } = render(
      <DesktopUpdateBoundary>
        <Child />
      </DesktopUpdateBoundary>,
    );
    await flushHookEffects();
    expect(queryByTestId('protected-child')).not.toBeNull();
  });

  it('Desktop_CheckingPhase_BlocksChildren', async () => {
    installDesktopBridge({
      phase: 'checking',
      currentVersion: '0.1.0-mvp',
      targetVersion: '0.1.1-mvp',
      progress: null,
      error: null,
    });
    const { queryByTestId, findByTestId } = render(
      <DesktopUpdateBoundary>
        <Child />
      </DesktopUpdateBoundary>,
    );
    await findByTestId('desktop-update-gate');
    expect(queryByTestId('protected-child')).toBeNull();
  });

  it('Desktop_DownloadingPhase_BlocksChildren', async () => {
    installDesktopBridge({
      phase: 'downloading',
      currentVersion: '0.1.0-mvp',
      targetVersion: '0.1.1-mvp',
      progress: { percent: 50, transferred: 1024, total: 2048, bytesPerSecond: 256 },
      error: null,
    });
    const { queryByTestId, findByTestId } = render(
      <DesktopUpdateBoundary>
        <Child />
      </DesktopUpdateBoundary>,
    );
    await findByTestId('desktop-update-gate');
    expect(queryByTestId('protected-child')).toBeNull();
  });

  it('Desktop_DownloadedPhase_BlocksChildren', async () => {
    installDesktopBridge({
      phase: 'downloaded',
      currentVersion: '0.1.0-mvp',
      targetVersion: '0.1.1-mvp',
      progress: { percent: 100, transferred: 2048, total: 2048, bytesPerSecond: 0 },
      error: null,
    });
    const { queryByTestId, findByTestId } = render(
      <DesktopUpdateBoundary>
        <Child />
      </DesktopUpdateBoundary>,
    );
    await findByTestId('desktop-update-gate');
    expect(queryByTestId('protected-child')).toBeNull();
  });

  it('Desktop_PendingThenSkipped_UnblocksChildrenAfterPush', async () => {
    const harness = installDesktopBridge(null);
    const { queryByTestId, findByTestId } = render(
      <DesktopUpdateBoundary>
        <Child />
      </DesktopUpdateBoundary>,
    );
    await findByTestId('desktop-update-gate');
    expect(queryByTestId('protected-child')).toBeNull();
    act(() => {
      harness.emit({
        phase: 'skipped',
        currentVersion: '0.1.0-mvp',
        targetVersion: null,
        progress: null,
        error: 'timeout',
      });
    });
    expect(queryByTestId('desktop-update-gate')).toBeNull();
    expect(queryByTestId('protected-child')).not.toBeNull();
  });
});
