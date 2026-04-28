/**
 * Reads the desktop bridge exposed by the Electron preload (window.hushDesktop).
 * Returns null in browser context, where the bridge is not present.
 *
 * @returns {{ isDesktop: boolean, platform: string } | null}
 */
function readDesktopApi() {
  if (typeof window === 'undefined') return null;
  const api = window.hushDesktop;
  if (!api || api.isDesktop !== true) return null;
  return api;
}

/**
 * Window drag affordance for the Electron renderer.
 *
 * Architecture:
 *   The previous implementation rendered a full-width invisible bar
 *   across the top 32 px of the window with `-webkit-app-region: drag`.
 *   Because `app-region: drag` competes with normal pointer hit-testing
 *   (Electron consumes mousedown for window-drag before the page sees
 *   it), the overlay broke any interactive control that visually fell
 *   under the top 32 px — including buttons, copy actions, and the auth
 *   card surfaces when the window was sized close to the minimum.
 *
 *   This implementation applies `app-region: drag` only to the empty
 *   safe area above the server strip (top-left corner of the renderer)
 *   on macOS. Everything else in the renderer is implicitly `no-drag`,
 *   so all interactive controls remain hit-testable without each
 *   having to opt out individually.
 *
 * Per-platform behaviour:
 *   - Browser: returns null (no bridge → not Electron).
 *   - macOS (`hiddenInset`): renders a small drag gutter beside the
 *     traffic-light area, co-located with the empty safe area above the
 *     channel sidebar. Width and height are sized in `global.css`.
 *     Native traffic lights sit above the renderer and remain unaffected.
 *   - Windows (`hidden` + `titleBarOverlay`): the OS-drawn overlay area
 *     above the renderer already provides full-width drag (and the
 *     min/max/close buttons). A renderer-side overlay would only
 *     duplicate behaviour and re-introduce the hit-test problem, so
 *     this component renders nothing.
 *   - Linux: native frame above the renderer provides drag — nothing
 *     to render.
 *
 * The preload script runs before any renderer JavaScript, so the bridge
 * is synchronously readable from the very first render — no `useEffect`
 * / `useState` indirection needed.
 */
export function ElectronDragRegion() {
  const api = readDesktopApi();
  if (!api) return null;
  if (api.platform !== 'darwin') return null;

  return (
    <div
      className="electron-drag-region"
      data-platform={api.platform}
      aria-hidden="true"
    />
  );
}
