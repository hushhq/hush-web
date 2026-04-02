export const DEFAULT_AUDIO_OUTPUT_ID = '';

export function isMobileAudioExperience(userAgentOverride = null) {
  const userAgent = resolveUserAgent(userAgentOverride);
  return /iPhone|iPad|iPod/.test(userAgent) || (/Macintosh/.test(userAgent) && /Mobile/.test(userAgent));
}

export function buildAudioOutputOptions({ audioOutputDevices = [] }) {
  return [
    { deviceId: DEFAULT_AUDIO_OUTPUT_ID, label: 'System default', routeKind: 'system' },
    ...audioOutputDevices.map((device) => ({
      deviceId: device.deviceId,
      label: device.label || 'Audio output',
      routeKind: 'device',
    })),
  ];
}

export function getDefaultAudioOutputSelection({
  userAgentOverride = null,
} = {}) {
  return DEFAULT_AUDIO_OUTPUT_ID;
}

export function shouldAttachAudioToVideoElement({
  selectedAudioOutputId,
  userAgentOverride = null,
}) {
  if (!isMobileAudioExperience(userAgentOverride)) {
    return false;
  }

  return selectedAudioOutputId === DEFAULT_AUDIO_OUTPUT_ID;
}

export async function applyAudioOutputSelection(mediaElement, selectedAudioOutputId, audioOutputOptions = []) {
  if (!mediaElement || typeof mediaElement.setSinkId !== 'function') {
    return;
  }

  try {
    await mediaElement.setSinkId(selectedAudioOutputId);
  } catch (error) {
    console.warn('[audio] Failed to apply selected audio output:', error);
  }
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
