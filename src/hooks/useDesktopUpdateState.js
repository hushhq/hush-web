import { useEffect, useState } from 'react';

/**
 * Subscribes to the desktop auto-update state machine exposed by the Electron
 * preload bridge (`window.hushDesktop.onDesktopUpdateState`). Returns `null`
 * in the browser, on missing bridge, or on older desktop builds that do not
 * yet expose the update IPC surface — that lets the caller render nothing
 * without branching on `isDesktop` first.
 *
 * The hook hydrates the initial state once via `getDesktopUpdateState`, then
 * keeps the state field in sync via the push channel. Both calls are gated
 * behind `typeof === 'function'` so a partially-updated desktop build that
 * lacks one or the other method degrades to "no update gate" instead of
 * crashing the renderer.
 */
export function useDesktopUpdateState() {
  const [state, setState] = useState(null);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const api = window.hushDesktop;
    if (!api || api.isDesktop !== true) return undefined;
    if (typeof api.getDesktopUpdateState !== 'function') return undefined;
    if (typeof api.onDesktopUpdateState !== 'function') return undefined;

    let cancelled = false;

    api
      .getDesktopUpdateState()
      .then((snapshot) => {
        if (cancelled) return;
        setState(snapshot ?? null);
      })
      .catch(() => {
        // Bridge errors are swallowed: a missing snapshot just keeps the gate
        // hidden. The push subscription below still has a chance to populate.
      });

    const unsubscribe = api.onDesktopUpdateState((next) => {
      if (cancelled) return;
      setState(next ?? null);
    });

    return () => {
      cancelled = true;
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  return state;
}
