import { useEffect, useState } from 'react';

const FAIL_OPEN_STATE = Object.freeze({
  phase: 'error',
  currentVersion: '',
  targetVersion: null,
  progress: null,
  error: 'desktop-update-ipc-error',
});

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
    let failedOpen = false;

    api
      .getDesktopUpdateState()
      .then((snapshot) => {
        if (cancelled || failedOpen) return;
        setState(snapshot ?? null);
      })
      .catch(() => {
        if (cancelled) return;
        failedOpen = true;
        setState(FAIL_OPEN_STATE);
      });

    let unsubscribe;
    try {
      unsubscribe = api.onDesktopUpdateState((next) => {
        if (cancelled) return;
        setState(next ?? null);
      });
    } catch {
      failedOpen = true;
      setState(FAIL_OPEN_STATE);
    }

    return () => {
      cancelled = true;
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  return state;
}
