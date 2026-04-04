/**
 * Platform heuristic for audio runtime profile selection.
 *
 * Identifies mobile web platforms where AudioContext pipelines are
 * unreliable and browser-native DSP (NS + AGC + EC) is the safer
 * capture path. This is a best-effort heuristic based on UA string
 * patterns — it does not probe actual browser audio capabilities.
 *
 * Reuses the same detection patterns as src/lib/deviceLabel.js
 * (detectPlatformName, lines 42-45).
 */

export function isMobileWebAudio(userAgent?: string): boolean {
  const ua = userAgent ?? (typeof navigator !== 'undefined' ? navigator.userAgent : '');
  if (!ua) return false;
  return /iPhone|iPad|iPod/i.test(ua)
    || (/Macintosh/i.test(ua) && /Mobile/i.test(ua))
    || /Android/i.test(ua);
}
