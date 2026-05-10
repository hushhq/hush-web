/**
 * Desktop vault bridge.
 *
 * Thin adapter between hush-web auth code and the window.hushDesktop preload
 * API when running inside hush-desktop. All exports are no-ops when
 * window.hushDesktop is absent (normal browser path).
 *
 * What it does:
 * - storeVaultSessionKey hands the AES-256 wrapping key (hex string) to the
 *   main process so a page reload can restore an unlocked vault without
 *   prompting for the PIN again — desktop-session continuity only.
 * - retrieveVaultSessionKey fetches the key back on the next page load.
 * - clearVaultSessionKey is called on lockVault, performLogout, and
 *   inactivity timeout to drop the key from main-process memory.
 *
 * Threat model — read carefully:
 * - This bridge is reachable from any same-origin script in the renderer.
 *   That includes a hypothetical XSS payload: it can call
 *   `window.hushDesktop.getVaultSessionKey(userId)` and exfiltrate the
 *   wrapping key just like any other window method. Phrasing such as
 *   "inaccessible to renderer scripts" only applies to passive storage
 *   scrape (an attacker that can read sessionStorage / localStorage but
 *   cannot execute JS in the renderer); it does NOT mean an active
 *   attacker who has achieved arbitrary code execution in the renderer
 *   loses the key. Treat the bridge as protecting against passive
 *   exfiltration only, not against active XSS.
 * - The wrapping key crosses the IPC boundary as a hex string. Once in
 *   the main process it sits in Node.js heap; quitting the app drops
 *   it. There is no OS-keychain persistence yet — keychain integration
 *   remains deferred.
 * - The defender's priority for this surface is preventing renderer XSS
 *   in the first place (strict CSP with nonce/strict-dynamic, no
 *   unsanitized HTML injection, secure-context APIs only) rather than
 *   trying to make the bridge itself safe against arbitrary JS. A
 *   future refactor that returns the unwrapped private key directly
 *   from main (without exposing the wrapping key to the renderer) is
 *   tracked as a follow-up but requires coordinated changes in the
 *   desktop preload and is out of scope here.
 */

function isDesktopApp() {
  return typeof window !== 'undefined' && window.hushDesktop?.isDesktop === true;
}

/**
 * Stores the AES-256 wrapping key hex in the main process after PIN unlock.
 * No-op in browser context.
 *
 * Security: see the file-level threat model — this method is callable
 * from any same-origin script. Treat XSS in the renderer as equivalent
 * to leaking the key.
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
 * Security: returns the wrapping key directly to the renderer. An XSS
 * payload that reaches this method can read the user's wrapping key.
 * See file-level threat model.
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
