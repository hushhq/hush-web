import { DesktopTopBar } from './DesktopTopBar.jsx';

/**
 * Reads the desktop bridge synchronously. Returns `null` in the browser so
 * the wrapper degrades to a render-children fragment.
 */
function readDesktopApi() {
  if (typeof window === 'undefined') return null;
  const api = window.hushDesktop;
  if (!api || api.isDesktop !== true) return null;
  return api;
}

/**
 * Wraps the existing app shell so the Electron renderer gets a real, visible
 * compact topbar (`--desktop-topbar-h`) above the content area. In browser builds (no preload bridge)
 * this is a transparent pass-through: zero DOM impact.
 *
 * Layout (desktop only):
 *   <div class="hush-desktop-shell">          // fixed inset, flex column
 *     <DesktopTopBar />                        // compact draggable bar
 *     <div class="hush-desktop-shell__content">// flex-1, min-h-0, overflow hidden
 *       {children}                             // existing app shell
 *     </div>
 *   </div>
 *
 * The content wrapper creates a new containing block for `position: fixed`
 * descendants so internal rails/sidebars do not bleed over the topbar.
 */
export function DesktopShell({ children }) {
  const api = readDesktopApi();
  if (!api) return children;
  if (api.platform === 'linux') return children;

  return (
    <div className="hush-desktop-shell" data-platform={api.platform}>
      <DesktopTopBar />
      <div className="hush-desktop-shell__content">{children}</div>
    </div>
  );
}
