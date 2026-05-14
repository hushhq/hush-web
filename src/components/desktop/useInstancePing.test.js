import { describe, it, expect, afterEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useInstancePing, PING_INTERVAL_MS } from './useInstancePing.js';
import { PING_STATUS } from './pingStatus.js';

describe('useInstancePing', () => {
  afterEach(() => {
    delete window.hushDesktop;
    vi.restoreAllMocks();
  });

  // ── Idle ────────────────────────────────────────────────────────────────

  it('starts in the unknown state and never fetches without an instance URL', () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response('', { status: 200 }),
    );
    const { result } = renderHook(() => useInstancePing(null));
    expect(result.current).toEqual({ ms: null, status: PING_STATUS.UNKNOWN });
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  // ── Browser path ────────────────────────────────────────────────────────

  it('issues a renderer fetch against /api/health when no desktop bridge is present', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response('', { status: 200 }),
    );
    renderHook(() => useInstancePing('https://hush.example.com'));
    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalled();
    });
    const [url, init] = fetchSpy.mock.calls[0];
    expect(url).toBe('https://hush.example.com/api/health');
    expect(init?.method).toBe('GET');
    // Browser path is plain CORS — no opaque `no-cors` workaround.
    expect(init?.mode).toBeUndefined();
  });

  it('classifies a successful browser fetch as a real ping bucket', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response('', { status: 200 }),
    );
    const { result } = renderHook(() => useInstancePing('https://hush.example.com'));
    await waitFor(() => {
      expect(result.current.status).not.toBe(PING_STATUS.UNKNOWN);
    });
    expect([
      PING_STATUS.LOW,
      PING_STATUS.MID,
      PING_STATUS.HIGH,
    ]).toContain(result.current.status);
  });

  it('flags `down` when the browser fetch returns a non-OK response', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response('boom', { status: 503 }),
    );
    const { result } = renderHook(() => useInstancePing('https://hush.example.com'));
    await waitFor(() => {
      expect(result.current.status).toBe(PING_STATUS.DOWN);
    });
  });

  it('flags `down` when the browser fetch rejects (offline / DNS failure)', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('network down'));
    const { result } = renderHook(() => useInstancePing('https://hush.example.com'));
    await waitFor(() => {
      expect(result.current.status).toBe(PING_STATUS.DOWN);
    });
  });

  // ── Desktop path ────────────────────────────────────────────────────────

  it('routes through the main-process bridge on desktop and never calls global fetch', async () => {
    const measureInstanceHealth = vi.fn().mockResolvedValue({
      ok: true,
      ms: 42,
      statusCode: 200,
    });
    window.hushDesktop = {
      isDesktop: true,
      platform: 'darwin',
      measureInstanceHealth,
    };
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    const { result } = renderHook(() => useInstancePing('https://hush.example.com'));
    await waitFor(() => {
      expect(measureInstanceHealth).toHaveBeenCalledWith('https://hush.example.com');
    });
    expect(fetchSpy).not.toHaveBeenCalled();
    await waitFor(() => {
      expect(result.current.status).toBe(PING_STATUS.LOW);
    });
    expect(result.current.ms).toBe(42);
  });

  it('flags `down` on desktop when the bridge reports ok:false', async () => {
    window.hushDesktop = {
      isDesktop: true,
      platform: 'darwin',
      measureInstanceHealth: vi.fn().mockResolvedValue({
        ok: false,
        ms: null,
        error: 'non-2xx',
        statusCode: 503,
      }),
    };
    const { result } = renderHook(() => useInstancePing('https://hush.example.com'));
    await waitFor(() => {
      expect(result.current.status).toBe(PING_STATUS.DOWN);
    });
  });

  it('fails closed to `down` when the desktop bridge is missing measureInstanceHealth', async () => {
    window.hushDesktop = { isDesktop: true, platform: 'darwin' };
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    const { result } = renderHook(() => useInstancePing('https://hush.example.com'));
    await waitFor(() => {
      expect(result.current.status).toBe(PING_STATUS.DOWN);
    });
    // Critical: must not fall back to a renderer fetch — that is exactly
    // the COEP-blocked path the bridge replaces.
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('flags `down` when the desktop bridge throws (programmer-level IPC failure)', async () => {
    window.hushDesktop = {
      isDesktop: true,
      platform: 'darwin',
      measureInstanceHealth: vi.fn().mockRejectedValue(new Error('ipc broken')),
    };
    const { result } = renderHook(() => useInstancePing('https://hush.example.com'));
    await waitFor(() => {
      expect(result.current.status).toBe(PING_STATUS.DOWN);
    });
  });

  // ── Invariants ──────────────────────────────────────────────────────────

  it('exposes a polling interval that is conservative enough to avoid API spam', () => {
    // Anything shorter than ~10s starts to look like background load on
    // the server's request log. Guard against accidentally tightening it.
    expect(PING_INTERVAL_MS).toBeGreaterThanOrEqual(10_000);
  });
});
