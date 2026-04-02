export function shouldUseVideoElementForAudioOutput(userAgentOverride = null) {
  const userAgent = resolveUserAgent(userAgentOverride);
  return /iPhone|iPad|iPod/.test(userAgent) || /Macintosh/.test(userAgent) && /Mobile/.test(userAgent);
}

function resolveUserAgent(userAgentOverride) {
  if (typeof userAgentOverride === 'string' && userAgentOverride.trim() !== '') {
    return userAgentOverride;
  }
  if (typeof navigator !== 'undefined' && typeof navigator.userAgent === 'string') {
    return navigator.userAgent;
  }
  return '';
}
