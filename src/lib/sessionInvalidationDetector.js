/**
 * Decides whether a 401 response from `fetchWithAuth` should fire the
 * global `hush_auth_invalid` event. The event tears down the active
 * session and forces the UI back to PIN unlock without wiping the
 * encrypted local vault.
 *
 * Two-tier detection so a 401 from a non-auth endpoint cannot trip
 * the global signal just because its error string happens to mention
 * "user not found":
 *
 *   1. Structured `error_code` on the response body wins. Backends
 *      may declare a session-revocation classification explicitly,
 *      independent of human-readable copy. Preferred wire format
 *      going forward.
 *   2. Otherwise, fall back to narrow string matching, but only on
 *      paths that legitimately emit session-revocation 401s (auth /
 *      session / livekit-token). Plain 401s from product endpoints
 *      surface to the caller without firing the global event.
 */

/** error_code values that mean "this device's session is gone". */
const STRUCTURED_DEVICE_REVOKED_CODES = new Set(['DEVICE_REVOKED']);

/**
 * error_code values that mean "the server no longer accepts this
 * local vault as a valid identity" (account removed, key invalidated,
 * registration rejected, …).
 */
const STRUCTURED_SESSION_INVALID_CODES = new Set([
  'USER_NOT_FOUND',
  'UNKNOWN_PUBLIC_KEY',
  'SESSION_INVALID',
  'SERVER_SESSION_INVALID',
  'ACCOUNT_BANNED',
  'REGISTRATION_BLOCKED',
]);

/**
 * Path prefixes whose 401s may legitimately classify as session
 * revocation via error-string matching. Paths outside this list
 * surface 401 to the caller as-is.
 */
const SESSION_AWARE_PATH_PREFIXES = [
  '/api/auth/',
  '/api/session/',
  '/api/me',
  '/api/livekit/token',
];

const DEVICE_REVOKED_RX = /device\s*revoked/i;
const SESSION_INVALID_RX = /user\s*not\s*found|unknown\s*public\s*key|session\s*invalid/i;

function isSessionAwarePath(path) {
  if (typeof path !== 'string') return false;
  return SESSION_AWARE_PATH_PREFIXES.some((prefix) => path.startsWith(prefix));
}

/**
 * @param {{ path: string, body: unknown }} input
 * @returns {{ reason: 'device_revoked' | 'server_session_invalid' } | null}
 */
export function detectSessionInvalidation({ path, body }) {
  if (typeof path !== 'string' || path.length === 0) return null;

  const code =
    body && typeof body === 'object' && typeof body.error_code === 'string'
      ? body.error_code.toUpperCase()
      : '';
  if (STRUCTURED_DEVICE_REVOKED_CODES.has(code)) {
    return { reason: 'device_revoked' };
  }
  if (STRUCTURED_SESSION_INVALID_CODES.has(code)) {
    return { reason: 'server_session_invalid' };
  }

  if (!isSessionAwarePath(path)) return null;

  const errStr =
    body && typeof body === 'object' && typeof body.error === 'string'
      ? body.error
      : '';
  if (DEVICE_REVOKED_RX.test(errStr)) return { reason: 'device_revoked' };
  if (SESSION_INVALID_RX.test(errStr)) return { reason: 'server_session_invalid' };
  return null;
}
