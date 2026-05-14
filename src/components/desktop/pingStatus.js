/**
 * Pure helpers for classifying instance ping latency.
 *
 * Kept free of React and DOM so it can be unit-tested in isolation. The
 * caller decides how to map a status to a colour token; this module only
 * tells you *which* bucket the measurement lands in.
 */

/** @type {const} */
export const PING_STATUS = Object.freeze({
  LOW: 'low',
  MID: 'mid',
  HIGH: 'high',
  DOWN: 'down',
  UNKNOWN: 'unknown',
});

/**
 * Latency bands (milliseconds). Anything <= MID_MAX is considered "mid" so a
 * single classifier covers the full domain without gaps.
 */
export const PING_LOW_MAX_MS = 120;
export const PING_MID_MAX_MS = 300;

/**
 * Classify a round-trip measurement into a coarse status bucket.
 *
 * Inputs:
 *   - finite positive number → bucket by latency band.
 *   - null / undefined / NaN → 'unknown' (measurement not available yet).
 *   - Infinity / negative → 'down' (request failed or timed out).
 *
 * @param {number | null | undefined} ms
 * @returns {'low' | 'mid' | 'high' | 'down' | 'unknown'}
 */
export function classifyPing(ms) {
  if (ms === null || ms === undefined) return PING_STATUS.UNKNOWN;
  if (Number.isNaN(ms)) return PING_STATUS.UNKNOWN;
  if (!Number.isFinite(ms) || ms < 0) return PING_STATUS.DOWN;
  if (ms <= PING_LOW_MAX_MS) return PING_STATUS.LOW;
  if (ms <= PING_MID_MAX_MS) return PING_STATUS.MID;
  return PING_STATUS.HIGH;
}

/**
 * Render-ready label for a ping measurement. Returns `"-- ms"` when the
 * status is `'unknown'` (no measurement yet) or `'down'` (unreachable),
 * so the UI never displays fake values.
 *
 * @param {number | null | undefined} ms
 * @param {ReturnType<typeof classifyPing>} [statusOverride]
 * @returns {string}
 */
export function formatPingLabel(ms, statusOverride) {
  const status = statusOverride ?? classifyPing(ms);
  if (status === PING_STATUS.UNKNOWN || status === PING_STATUS.DOWN) {
    return '-- ms';
  }
  return `${Math.round(/** @type {number} */ (ms))} ms`;
}
