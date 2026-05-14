import { useEffect, useRef, useState } from 'react';
import { classifyPing, PING_STATUS } from './pingStatus.js';

/**
 * Conservative polling cadence. Hush instances run their health endpoint
 * cheap, but a tighter interval would still amount to API spam for a UI
 * indicator. 15s is fast enough to catch real connection trouble while
 * staying invisible in the server's request log.
 */
export const PING_INTERVAL_MS = 15_000;

/**
 * Hard ceiling for a single ping attempt. Network black-holes can stall
 * fetch() indefinitely; we abort and report `down` past this bound.
 */
export const PING_TIMEOUT_MS = 4_000;

function readDesktopBridge() {
  if (typeof window === 'undefined') return null;
  const api = window.hushDesktop;
  if (!api || api.isDesktop !== true) return null;
  return api;
}

function buildHealthUrl(instanceUrl) {
  return new URL('/api/health', instanceUrl).toString();
}

/**
 * Browser-only fetch path. The packaged renderer is served from
 * `app://localhost` under a strict COEP / COOP policy, which blocks
 * cross-origin fetches to the live Hush instance even with `mode: 'no-cors'`
 * (the response is silently turned into a network error). Desktop builds
 * therefore route through the main process — see `measureFromMainProcess`.
 *
 * @param {string} instanceUrl
 * @param {AbortSignal} signal
 * @returns {Promise<{ ms: number | null, status: ReturnType<typeof classifyPing> }>}
 */
async function measureFromRendererFetch(instanceUrl, signal) {
  const start = performance.now();
  try {
    const response = await fetch(buildHealthUrl(instanceUrl), {
      method: 'GET',
      cache: 'no-store',
      signal,
    });
    const elapsed = performance.now() - start;
    if (!response.ok) {
      return { ms: Number.POSITIVE_INFINITY, status: PING_STATUS.DOWN };
    }
    return { ms: elapsed, status: classifyPing(elapsed) };
  } catch {
    return { ms: Number.POSITIVE_INFINITY, status: PING_STATUS.DOWN };
  }
}

/**
 * Desktop path. Delegates to the main-process IPC handler which runs the
 * actual HTTP request through Electron's `net` module — that stack is not
 * subject to renderer COEP / CORS rules, so the request is never silently
 * blocked the way a renderer `fetch` would be.
 *
 * `measureInstanceHealth` is only present on desktop builds whose preload
 * exposes the bridge method. Older builds without it fail closed to
 * `DOWN` rather than silently doing nothing.
 *
 * @param {{ measureInstanceHealth?: (url: string) => Promise<{ ok: boolean, ms: number | null, statusCode?: number, error?: string }> }} api
 * @param {string} instanceUrl
 * @returns {Promise<{ ms: number | null, status: ReturnType<typeof classifyPing> }>}
 */
async function measureFromMainProcess(api, instanceUrl) {
  if (typeof api.measureInstanceHealth !== 'function') {
    return { ms: Number.POSITIVE_INFINITY, status: PING_STATUS.DOWN };
  }
  try {
    const result = await api.measureInstanceHealth(instanceUrl);
    if (result?.ok === true && typeof result.ms === 'number') {
      return { ms: result.ms, status: classifyPing(result.ms) };
    }
    return { ms: Number.POSITIVE_INFINITY, status: PING_STATUS.DOWN };
  } catch {
    return { ms: Number.POSITIVE_INFINITY, status: PING_STATUS.DOWN };
  }
}

/**
 * Measures round-trip latency against the active Hush instance and exposes
 * it as a `{ ms, status }` snapshot for the topbar telemetry pill.
 *
 * Routing:
 *   - Browser: direct `fetch('/api/health')` from the renderer.
 *   - Desktop: IPC bridge `window.hushDesktop.measureInstanceHealth()` so
 *     the request bypasses renderer COEP / CORS constraints. Missing
 *     bridge method → fail closed to `DOWN`.
 *
 * Behaviour:
 *   - `instanceUrl` is `null` / empty → no traffic. Snapshot stays at
 *     `{ ms: null, status: 'unknown' }` so the UI shows `-- ms`.
 *   - First measurement fires immediately; subsequent ones run on
 *     `PING_INTERVAL_MS`.
 *   - Each request has its own AbortController so unmount / URL change
 *     cancels in-flight work cleanly.
 *
 * @param {string | null | undefined} instanceUrl
 * @returns {{ ms: number | null, status: ReturnType<typeof classifyPing> }}
 */
export function useInstancePing(instanceUrl) {
  const [snapshot, setSnapshot] = useState(
    /** @type {{ ms: number | null, status: ReturnType<typeof classifyPing> }} */ ({
      ms: null,
      status: PING_STATUS.UNKNOWN,
    }),
  );
  const activeAbortRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    if (!instanceUrl) {
      setSnapshot({ ms: null, status: PING_STATUS.UNKNOWN });
      return undefined;
    }
    const desktopApi = readDesktopBridge();
    if (!desktopApi && typeof fetch !== 'function') return undefined;

    let cancelled = false;

    async function measureOnce() {
      if (cancelled) return;
      const controller = new AbortController();
      activeAbortRef.current = controller;
      const timeoutId = setTimeout(() => controller.abort(), PING_TIMEOUT_MS);
      try {
        const next = desktopApi
          ? await measureFromMainProcess(desktopApi, instanceUrl)
          : await measureFromRendererFetch(instanceUrl, controller.signal);
        if (cancelled) return;
        setSnapshot(next);
      } finally {
        clearTimeout(timeoutId);
      }
    }

    void measureOnce();
    const intervalId = setInterval(measureOnce, PING_INTERVAL_MS);

    return () => {
      cancelled = true;
      clearInterval(intervalId);
      activeAbortRef.current?.abort();
      activeAbortRef.current = null;
    };
  }, [instanceUrl]);

  return snapshot;
}
