const MIN_DB = -60;
const MAX_DB = 0;
const DEFAULT_ACTIVITY_THRESHOLD = 14;
const DEFAULT_RELEASE_MS = 140;
const DEFAULT_FFT_SIZE = 512;
const DEFAULT_SMOOTHING = 0.15;

function clampPercent(value) {
  return Math.max(0, Math.min(100, value));
}

function normalizeRmsToPercent(rms) {
  const rmsDb = rms > 0 ? 20 * Math.log10(rms) : -Infinity;
  if (!Number.isFinite(rmsDb)) {
    return 0;
  }
  return clampPercent(((rmsDb - MIN_DB) / (MAX_DB - MIN_DB)) * 100);
}

function measureRms(samples) {
  let sumSquares = 0;
  for (let i = 0; i < samples.length; i += 1) {
    sumSquares += samples[i] * samples[i];
  }
  return Math.sqrt(sumSquares / samples.length);
}

/**
 * Monitors a MediaStream's input level without routing it to output.
 *
 * @param {MediaStream|null} stream
 * @param {{
 *   activityThreshold?: number,
 *   releaseMs?: number,
 *   onLevelChange?: (level: number) => void,
 *   onActiveChange?: (isActive: boolean) => void,
 * }} [options]
 * @returns {Promise<{ cleanup: () => Promise<void> }>}
 */
export async function createAudioLevelMonitor(stream, options = {}) {
  if (!stream || typeof AudioContext === 'undefined') {
    return { cleanup: async () => {} };
  }

  const audioContext = new AudioContext({
    sampleRate: 48_000,
    latencyHint: 'interactive',
  });
  const analyserNode = audioContext.createAnalyser();
  analyserNode.fftSize = DEFAULT_FFT_SIZE;
  analyserNode.smoothingTimeConstant = DEFAULT_SMOOTHING;

  const sourceNode = audioContext.createMediaStreamSource(stream);
  sourceNode.connect(analyserNode);

  const samples = new Float32Array(analyserNode.fftSize);
  const activityThreshold = options.activityThreshold ?? DEFAULT_ACTIVITY_THRESHOLD;
  const releaseMs = options.releaseMs ?? DEFAULT_RELEASE_MS;
  let rafId = 0;
  let isActive = false;
  let holdUntil = 0;

  const tick = () => {
    analyserNode.getFloatTimeDomainData(samples);
    const level = Math.round(normalizeRmsToPercent(measureRms(samples)));
    options.onLevelChange?.(level);

    const now = performance.now();
    if (level >= activityThreshold) {
      holdUntil = now + releaseMs;
    }
    const nextActive = level >= activityThreshold || holdUntil > now;
    if (nextActive !== isActive) {
      isActive = nextActive;
      options.onActiveChange?.(isActive);
    }

    rafId = window.requestAnimationFrame(tick);
  };

  if (audioContext.state === 'suspended') {
    await audioContext.resume();
  }
  rafId = window.requestAnimationFrame(tick);

  return {
    cleanup: async () => {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
      try {
        sourceNode.disconnect();
      } catch {
        // Ignore disconnect failures during teardown.
      }
      try {
        analyserNode.disconnect();
      } catch {
        // Ignore disconnect failures during teardown.
      }
      if (audioContext.state !== 'closed') {
        try {
          await audioContext.close();
        } catch {
          // Ignore close failures during teardown.
        }
      }
    },
  };
}
