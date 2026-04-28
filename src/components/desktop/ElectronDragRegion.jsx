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
 *   A desktop app needs a real full-width titlebar hit area. The renderer
 *   content is padded down by `--desktop-titlebar-safe-top`, so this fixed
 *   drag layer sits only above empty chrome, not over real controls. Global
 *   desktop CSS marks interactive controls as `no-drag` as a belt-and-braces
 *   guard for anything that visually reaches the top edge later.
 *
 * Per-platform behaviour:
 *   - Browser: returns null (no bridge → not Electron).
 *   - macOS (`hiddenInset`): renders a transparent full-width drag layer.
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
