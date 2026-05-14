import { SearchIcon } from 'lucide-react';

/**
 * Window-level event used to ask the authenticated app shell to open its
 * existing CommandPalette. The shell already owns palette state plus the
 * navigation/server handlers, so the topbar avoids duplicating any of it —
 * it just nudges the shell.
 */
export const OPEN_COMMAND_PALETTE_EVENT = 'hush:open-command-palette';

function dispatchOpenCommandPalette() {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(OPEN_COMMAND_PALETTE_EVENT));
}

/**
 * Center omnibar trigger. Click (or `Cmd/Ctrl + K`) opens the existing
 * authenticated-app CommandPalette via a window-level event so this
 * component stays free of cross-tree state coupling.
 *
 * The shortcut label changes per OS:
 *   - darwin: `⌘K`
 *   - everything else: `Ctrl K`
 *
 * Mounted only when the desktop topbar is rendered (so already gated on
 * `window.hushDesktop?.isDesktop === true`).
 *
 * @param {{ platform: NodeJS.Platform }} props
 */
export function DesktopOmnibar({ platform }) {
  const isMac = platform === 'darwin';
  const shortcutLabel = isMac ? '⌘K' : 'Ctrl K';

  return (
    <button
      type="button"
      className="hush-desktop-omnibar"
      onClick={dispatchOpenCommandPalette}
      aria-label="Open command palette"
      title="Open command palette"
      style={{ WebkitAppRegion: 'no-drag' }}
    >
      <SearchIcon className="hush-desktop-omnibar__icon" aria-hidden />
      <span className="hush-desktop-omnibar__placeholder">
        Search or jump to…
      </span>
      <kbd
        className="hush-desktop-omnibar__shortcut"
        data-shortcut={isMac ? 'mac' : 'pc'}
      >
        {shortcutLabel}
      </kbd>
    </button>
  );
}
