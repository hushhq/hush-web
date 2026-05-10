import {
  getActiveAuthInstanceUrlIfSet,
  normalizeInstanceUrl,
} from './authInstanceStore';

/**
 * localStorage key holding the user's "home" instance — the one the
 * vault was registered against. Mirrored in `useAuth.HOME_INSTANCE_KEY`
 * for backwards-compatible imports; both names refer to the same
 * underlying record.
 */
export const HOME_INSTANCE_KEY = 'hush_home_instance';

/**
 * Picks the instance origin to use when re-authenticating after a vault
 * unlock that lost the JWT (tab close, sessionStorage wipe, mobile
 * killpath). The user's active instance wins so they re-auth against
 * the host they are currently looking at; the home instance is used
 * only when no active instance has been written this tab.
 *
 * Returns `''` (relative-fetch sentinel) when neither is known so the
 * caller can fall through to the legacy "use the page origin" path
 * inside `performChallengeResponse`.
 *
 * @returns {string} normalized instance origin, or '' when unknown
 */
export function resolveReauthInstanceUrl() {
  const active = getActiveAuthInstanceUrlIfSet();
  if (active) return active;
  if (typeof localStorage !== 'undefined') {
    const home = normalizeInstanceUrl(localStorage.getItem(HOME_INSTANCE_KEY));
    if (home) return home;
  }
  return '';
}
