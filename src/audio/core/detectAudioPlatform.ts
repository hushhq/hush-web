/**
 * Platform heuristic for audio runtime profile selection.
 *
 * Identifies mobile web platforms where AudioContext pipelines are
 * unreliable and browser-native DSP (NS + AGC + EC) is the safer
 * capture path. This is a best-effort heuristic based on UA string
 * patterns — it does not probe actual browser audio capabilities.
 *
 * Uses detectPlatformName from src/lib/deviceLabel.js as the single
 * source of truth for platform identification. No duplicated regex.
 */

import { detectPlatformName } from '../../lib/deviceLabel';

const MOBILE_PLATFORMS = new Set(['iPhone', 'iPad', 'Android']);

function resolveUserAgent(userAgent?: string): string {
  if (userAgent) return userAgent;
  if (typeof navigator !== 'undefined') return navigator.userAgent;
  return '';
}

export function isMobileWebAudio(userAgent?: string): boolean {
  const ua = resolveUserAgent(userAgent);
  if (!ua) return false;
  return MOBILE_PLATFORMS.has(detectPlatformName(ua));
}
