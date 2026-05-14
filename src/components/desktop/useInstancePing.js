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

function isDesktopRenderer() {
  if (typeof window === 'undefined') return false;
  return window.hushDesktop?.isDesktop === true;
}

function buildHealthUrl(instanceUrl) {
  return new URL('/api/health', instanceUrl).toString();
}

function buildPingRequestInit(signal) {
  if (!isDesktopRenderer()) {
    return {
      method: 'GET',
      cache: 'no-store',
      signal,
    };
  }

  return {
    method: 'GET',
    cache: 'no-store',
    mode: 'no-cors',
    signal,
  };
}

/**
 * Measures round-trip latency to `${instanceUrl}/api/health` on a fixed
 * cadence. Returns a `{ ms, status }` snapshot the UI can render directly.
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
    if (typeof fetch !== 'function') return undefined;
    if (!instanceUrl) {
      setSnapshot({ ms: null, status: PING_STATUS.UNKNOWN });
      return undefined;
    }

    let cancelled = false;

    async function measureOnce() {
      if (cancelled) return;
      const controller = new AbortController();
      activeAbortRef.current = controller;
      const timeoutId = setTimeout(() => controller.abort(), PING_TIMEOUT_MS);
      const start = performance.now();
      try {
        const response = await fetch(
          buildHealthUrl(instanceUrl),
          buildPingRequestInit(controller.signal),
        );
        const elapsed = performance.now() - start;
        if (cancelled) return;
        if (!isDesktopRenderer() && !response.ok) {
          setSnapshot({ ms: Number.POSITIVE_INFINITY, status: PING_STATUS.DOWN });
          return;
        }
        setSnapshot({ ms: elapsed, status: classifyPing(elapsed) });
      } catch {
        if (cancelled) return;
        setSnapshot({ ms: Number.POSITIVE_INFINITY, status: PING_STATUS.DOWN });
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
