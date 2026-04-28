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
 * Invisible top-edge drag region that lets Electron windows be dragged from
 * the empty space above the application content while keeping any visible
 * controls clickable.
 *
 * Behaviour:
 * - In a browser, returns null (the `-webkit-app-region` CSS property is a no-op
 *   in non-Electron Chromium, but skipping the DOM node entirely is cleaner).
 * - On macOS (`hiddenInset`) and Windows (`hidden` + `titleBarOverlay`), renders
 *   a 32 px tall, full-width, fully transparent fixed bar at the top of the
 *   viewport with `-webkit-app-region: drag`. Native window controls
 *   (traffic lights / caption buttons) sit above the BrowserWindow's web
 *   content and remain unaffected.
 * - On Linux (native frame), the OS already provides a drag handle in the
 *   native titlebar above the renderer surface, so we skip the overlay to
 *   avoid creating a redundant invisible drag zone inside the content area.
 *
 * The preload script runs before any renderer JavaScript, so the bridge is
 * synchronously readable from the very first render — no `useEffect` /
 * `useState` indirection needed.
 *
 * Interactive elements that visually fall under the top 32 px (uncommon in
 * this app — the auth card is vertically centred and chat surfaces start
 * below the gutter) can opt out of the drag handle by carrying
 * `-webkit-app-region: no-drag` themselves.
 */
export function ElectronDragRegion() {
  const api = readDesktopApi();
  if (!api) return null;
  if (api.platform === 'linux') return null;

  return (
    <div
      className="electron-drag-region"
      data-platform={api.platform}
      aria-hidden="true"
    />
  );
}
