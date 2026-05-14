/**
 * Synchronous detector for the desktop update IPC surface.
 *
 * Returns `true` only when the renderer is hosted inside the Electron preload
 * bridge AND both update IPC methods are exposed. The boundary uses this to
 * decide whether a `null` snapshot from `useDesktopUpdateState` means
 * "pending first push" (block children) or "no updater available, fail open"
 * (render children).
 *
 * Computed synchronously rather than via state because the value is stable
 * for the lifetime of the renderer: `window.hushDesktop` is wired by the
 * preload script before any React render. Re-running it inside a memo would
 * not change the result.
 */
export function hasDesktopUpdaterIpc() {
  if (typeof window === 'undefined') return false;
  const api = window.hushDesktop;
  if (!api || api.isDesktop !== true) return false;
  if (typeof api.getDesktopUpdateState !== 'function') return false;
  if (typeof api.onDesktopUpdateState !== 'function') return false;
  return true;
}
