/**
 * Diagnostic utility: measures RMS and peak amplitude on a capture
 * session's output track before it reaches LiveKit.
 *
 * Attaches a side-chain AnalyserNode to the processedTrack via a
 * temporary AudioContext. Does NOT modify the publish path — the
 * measurement is read-only.
 *
 * Usage:
 *   const stop = measureCaptureLevel(session.processedTrack, {
 *     onSample: (sample) => console.log(sample),
 *     durationMs: 5000,
 *   });
 *   // later: stop() to tear down early
 */

export interface LevelSample {
  /** Milliseconds since measurement started. */
  timestampMs: number;
  /** RMS amplitude in dBFS (-Infinity to 0). */
  rmsDbfs: number;
  /** Peak amplitude in dBFS (-Infinity to 0). */
  peakDbfs: number;
  /** RMS amplitude linear (0 to 1). */
  rmsLinear: number;
  /** Peak amplitude linear (0 to 1). */
  peakLinear: number;
}

export interface MeasureOptions {
  /** Called each time a level sample is taken. */
  onSample: (sample: LevelSample) => void;
  /** How long to measure in ms. Defaults to 5000. */
  durationMs?: number;
  /** Sample interval in ms. Defaults to 100. */
  intervalMs?: number;
  /** FFT size for the AnalyserNode. Defaults to 2048. */
  fftSize?: number;
}

function linearToDbfs(linear: number): number {
  if (linear <= 0) return -Infinity;
  return 20 * Math.log10(linear);
}

/**
 * Starts level measurement on a MediaStreamTrack.
 * Returns a stop function to tear down early.
 */
export function measureCaptureLevel(
  track: MediaStreamTrack,
  options: MeasureOptions,
): () => void {
  const {
    onSample,
    durationMs = 5000,
    intervalMs = 100,
    fftSize = 2048,
  } = options;

  const ctx = new AudioContext({ sampleRate: 48_000 });
  const stream = new MediaStream([track]);
  const source = ctx.createMediaStreamSource(stream);
  const analyser = ctx.createAnalyser();
  analyser.fftSize = fftSize;
  analyser.smoothingTimeConstant = 0;

  // Connect as side-chain — source → analyser (no destination).
  // The analyser reads samples without producing audible output.
  source.connect(analyser);

  const timeDomainData = new Float32Array(analyser.fftSize);
  const startTime = performance.now();
  let stopped = false;

  const interval = setInterval(() => {
    if (stopped) return;

    const elapsed = performance.now() - startTime;
    if (elapsed >= durationMs) {
      stop();
      return;
    }

    analyser.getFloatTimeDomainData(timeDomainData);

    let sumSquares = 0;
    let peak = 0;
    for (let i = 0; i < timeDomainData.length; i++) {
      const sample = Math.abs(timeDomainData[i]);
      sumSquares += timeDomainData[i] * timeDomainData[i];
      if (sample > peak) peak = sample;
    }
    const rmsLinear = Math.sqrt(sumSquares / timeDomainData.length);

    onSample({
      timestampMs: Math.round(elapsed),
      rmsDbfs: linearToDbfs(rmsLinear),
      peakDbfs: linearToDbfs(peak),
      rmsLinear,
      peakLinear: peak,
    });
  }, intervalMs);

  function stop() {
    if (stopped) return;
    stopped = true;
    clearInterval(interval);
    source.disconnect();
    ctx.close().catch(() => {});
  }

  return stop;
}
