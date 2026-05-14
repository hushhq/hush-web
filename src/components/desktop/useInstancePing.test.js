import { describe, it, expect, afterEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useInstancePing, PING_INTERVAL_MS } from './useInstancePing.js';
import { PING_STATUS } from './pingStatus.js';

describe('useInstancePing', () => {
  afterEach(() => {
    delete window.hushDesktop;
    vi.restoreAllMocks();
  });

  it('starts in the unknown state and never fetches without an instance URL', () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response('', { status: 200 }),
    );
    const { result } = renderHook(() => useInstancePing(null));
    expect(result.current).toEqual({ ms: null, status: PING_STATUS.UNKNOWN });
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('issues a real fetch against /api/health on the active instance', async () => {
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
    expect(init?.mode).toBeUndefined();
  });

  it('uses an opaque desktop fetch so Electron is not blocked by browser CORS', async () => {
    window.hushDesktop = { isDesktop: true, platform: 'darwin' };
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response('', { status: 200 }),
    );
    const { result } = renderHook(() => useInstancePing('https://hush.example.com'));
    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalled();
    });
    const [, init] = fetchSpy.mock.calls[0];
    expect(init?.method).toBe('GET');
    expect(init?.mode).toBe('no-cors');
    await waitFor(() => {
      expect(result.current.status).not.toBe(PING_STATUS.UNKNOWN);
    });
  });

  it('trims trailing slashes on the instance URL before building the health path', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response('', { status: 200 }),
    );
    renderHook(() => useInstancePing('https://hush.example.com/'));
    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalled();
    });
    expect(fetchSpy.mock.calls[0][0]).toBe('https://hush.example.com/api/health');
  });

  it('classifies the latency once the fetch resolves', async () => {
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
    expect(typeof result.current.ms).toBe('number');
  });

  it('flags `down` when the health endpoint returns a non-OK status', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response('boom', { status: 503 }),
    );
    const { result } = renderHook(() => useInstancePing('https://hush.example.com'));
    await waitFor(() => {
      expect(result.current.status).toBe(PING_STATUS.DOWN);
    });
  });

  it('flags `down` when the fetch rejects (offline / DNS failure)', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('network down'));
    const { result } = renderHook(() => useInstancePing('https://hush.example.com'));
    await waitFor(() => {
      expect(result.current.status).toBe(PING_STATUS.DOWN);
    });
  });

  it('exposes a polling interval that is conservative enough to avoid API spam', () => {
    // Anything shorter than ~10s starts to look like background load on
    // the server's request log. Guard against accidentally tightening it.
    expect(PING_INTERVAL_MS).toBeGreaterThanOrEqual(10_000);
  });
});
