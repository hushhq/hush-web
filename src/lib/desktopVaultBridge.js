/**
 * Desktop vault bridge.
 *
 * Thin adapter between hush-web auth code and the window.hushDesktop preload
 * API when running inside hush-desktop. All exports are no-ops when
 * window.hushDesktop is absent (normal browser path).
 *
 * Security contract:
 * - storeVaultSessionKey sends the AES-256 wrapping key to the main process,
 *   where it lives in Node.js memory inaccessible to renderer scripts.
 * - retrieveVaultSessionKey fetches it back on page reload so the vault can
 *   auto-unlock without a PIN re-entry (desktop-session continuity only).
 * - clearVaultSessionKey must be called on lockVault, performLogout, and
 *   inactivity timeout to prevent stale key reuse.
 *
 * What this does NOT provide: OS-keychain-backed persistence across app
 * restarts. The key is only in main-process memory; quitting the app loses it.
 * Keychain integration remains deferred.
 */

function isDesktopApp() {
  return typeof window !== 'undefined' && window.hushDesktop?.isDesktop === true;
}

/**
 * Stores the AES-256 wrapping key hex in the main process after PIN unlock.
 * No-op in browser context.
 *
 * @param {string} userId
 * @param {string} rawKeyHex
 * @returns {Promise<void>}
 */
export async function storeVaultSessionKey(userId, rawKeyHex) {
  if (!isDesktopApp()) return;
  await window.hushDesktop.setVaultSessionKey(userId, rawKeyHex);
}

/**
 * Retrieves the AES-256 wrapping key hex from the main process.
 * Returns null in browser context or when no key is stored for this user.
 *
 * @param {string} userId
 * @returns {Promise<string|null>}
 */
export async function retrieveVaultSessionKey(userId) {
  if (!isDesktopApp()) return null;
  return window.hushDesktop.getVaultSessionKey(userId);
}

/**
 * Clears the session key from the main process.
 * No-op in browser context.
 *
 * @param {string} userId
 * @returns {Promise<void>}
 */
export async function clearVaultSessionKey(userId) {
  if (!isDesktopApp()) return;
  await window.hushDesktop.clearVaultSessionKey(userId);
}
