import { useEffect, useRef } from 'react';
import { useBootController } from '../../hooks/useBootController.jsx';

/**
 * Boot states that mean the user has cleared the auth gate. Once any of these
 * fire, the BrowserWindow can shrink to the compact post-login floor.
 */
const AUTHENTICATED_BOOT_STATES = new Set(['ready', 'booted']);

function resolveProfile(bootState) {
  return AUTHENTICATED_BOOT_STATES.has(bootState) ? 'app' : 'auth';
}

/**
 * Mirrors the renderer's boot state onto the desktop window's resize floor.
 *
 * - Pre-login states (`loading`, `needs_login`, `needs_pin`, `pin_setup`)
 *   keep the tall auth floor (900 x 860) so the `LinkDevice` card stack
 *   remains fully reachable.
 * - Authenticated states (`ready`, `booted`) drop the floor to the compact
 *   operative-app floor (940 x 500).
 *
 * Renders nothing — pure side effect. In browser builds (no preload bridge
 * or missing `setMinWindowFloor` method on older desktop builds) the effect
 * is a silent no-op so we never block the auth flow on an Electron upgrade.
 */
export function DesktopWindowFloorSync() {
  const { bootState } = useBootController();
  const lastProfileRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const api = window.hushDesktop;
    if (!api || api.isDesktop !== true) return;
    if (typeof api.setMinWindowFloor !== 'function') return;

    const profile = resolveProfile(bootState);
    if (profile === lastProfileRef.current) return;
    lastProfileRef.current = profile;

    api.setMinWindowFloor(profile).catch(() => {
      // Best-effort. A failed floor switch only affects the OS resize
      // handle; renderer behaviour is unaffected.
    });
  }, [bootState]);

  return null;
}
