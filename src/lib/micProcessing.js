const MIC_GATE_ENABLED_KEY = 'hush_mic_noise_gate_enabled';
const MIC_GATE_THRESHOLD_DB_KEY = 'hush_mic_noise_gate_threshold_db';
export const NOISE_GATE_WORKLET_URL = new URL('./noiseGateWorklet.js', import.meta.url);

export const MIC_GATE_THRESHOLD_MIN_DB = -70;
export const MIC_GATE_THRESHOLD_MAX_DB = -20;
export const MIC_GATE_THRESHOLD_STEP_DB = 1;

export const DEFAULT_MIC_FILTER_SETTINGS = Object.freeze({
  noiseGateEnabled: true,
  noiseGateThresholdDb: -50,
});

function clampThreshold(value) {
  return Math.min(MIC_GATE_THRESHOLD_MAX_DB, Math.max(MIC_GATE_THRESHOLD_MIN_DB, value));
}

function resolveStorage(storage) {
  if (storage) return storage;
  if (typeof localStorage === 'undefined') return null;
  return localStorage;
}

/**
 * Normalizes raw mic filter settings into the persisted runtime shape.
 *
 * @param {Partial<{ noiseGateEnabled: boolean, noiseGateThresholdDb: number }>} raw
 * @returns {{ noiseGateEnabled: boolean, noiseGateThresholdDb: number }}
 */
export function normalizeMicFilterSettings(raw = {}) {
  const rawThreshold = raw.noiseGateThresholdDb;
  const threshold = rawThreshold === null || rawThreshold === ''
    ? Number.NaN
    : Number(rawThreshold);
  return {
    noiseGateEnabled: typeof raw.noiseGateEnabled === 'boolean'
      ? raw.noiseGateEnabled
      : DEFAULT_MIC_FILTER_SETTINGS.noiseGateEnabled,
    noiseGateThresholdDb: Number.isFinite(threshold)
      ? clampThreshold(Math.round(threshold))
      : DEFAULT_MIC_FILTER_SETTINGS.noiseGateThresholdDb,
  };
}

/**
 * Loads persisted mic filter settings from storage.
 *
 * @param {Storage|null} [storage]
 * @returns {{ noiseGateEnabled: boolean, noiseGateThresholdDb: number }}
 */
export function getMicFilterSettings(storage) {
  const resolvedStorage = resolveStorage(storage);
  if (!resolvedStorage) {
    return { ...DEFAULT_MIC_FILTER_SETTINGS };
  }

  try {
    return normalizeMicFilterSettings({
      noiseGateEnabled: resolvedStorage.getItem(MIC_GATE_ENABLED_KEY) !== '0',
      noiseGateThresholdDb: resolvedStorage.getItem(MIC_GATE_THRESHOLD_DB_KEY),
    });
  } catch {
    return { ...DEFAULT_MIC_FILTER_SETTINGS };
  }
}

/**
 * Persists mic filter settings to storage.
 *
 * @param {Partial<{ noiseGateEnabled: boolean, noiseGateThresholdDb: number }>} nextSettings
 * @param {Storage|null} [storage]
 * @returns {{ noiseGateEnabled: boolean, noiseGateThresholdDb: number }}
 */
export function setMicFilterSettings(nextSettings, storage) {
  const resolvedStorage = resolveStorage(storage);
  const normalized = normalizeMicFilterSettings({
    ...getMicFilterSettings(resolvedStorage),
    ...nextSettings,
  });

  if (!resolvedStorage) {
    return normalized;
  }

  try {
    resolvedStorage.setItem(MIC_GATE_ENABLED_KEY, normalized.noiseGateEnabled ? '1' : '0');
    resolvedStorage.setItem(MIC_GATE_THRESHOLD_DB_KEY, String(normalized.noiseGateThresholdDb));
  } catch {
    // Ignore storage failures and return the normalized in-memory value.
  }

  return normalized;
}

// applyMicFilterSettingsToNode removed — now handled by CaptureGraphFactory's
// applyFilterSettings closure.

/**
 * Best-effort warmup for the noise-gate worklet so the first mic publish is faster.
 */
export async function preloadNoiseGateWorklet() {
  try {
    if (typeof AudioContext === 'undefined' || !('audioWorklet' in AudioContext.prototype)) return;
    const ctx = new AudioContext();
    await ctx.audioWorklet.addModule(NOISE_GATE_WORKLET_URL);
    await ctx.close();
  } catch {
    // Best-effort preload only.
  }
}

// createMicProcessingPipeline removed — capture graphs are now built via
// buildCaptureGraph from src/audio/graph/CaptureGraphFactory.ts.
// useMicMonitor calls it directly; CaptureOrchestrator calls it for publish.
