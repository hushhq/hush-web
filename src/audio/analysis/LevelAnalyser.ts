/**
 * LevelAnalyser — side-chain AnalyserNode for audio level observation.
 *
 * Attaches a read-only AudioContext + AnalyserNode to a MediaStreamTrack.
 * Reports RMS level in dBFS and normalized 0-100 at a configurable
 * interval. Does NOT modify the observed track's audio graph.
 *
 * Always taps the published track (post-pipeline for desktop-standard,
 * raw track for low-latency). The observation model is uniform across
 * all capture profiles.
 */

export interface LevelSample {
  /** RMS amplitude in dBFS (-Infinity to 0). Used for speaking detection. */
  rmsDbfs: number;
  /** Peak amplitude in dBFS (-Infinity to 0). */
  peakDbfs: number;
  /** RMS normalized to 0-100 range. For UI meter display only. */
  rmsNormalized: number;
}

export type LevelListener = (sample: LevelSample) => void;

export interface LevelAnalyserOptions {
  /** Sample interval in ms. Defaults to 60 (~16Hz). */
  intervalMs?: number;
  /** FFT size for the AnalyserNode. Defaults to 2048. */
  fftSize?: number;
  /** Floor dBFS for normalization (maps to 0). Defaults to -60. */
  floorDbfs?: number;
}

function linearToDbfs(linear: number): number {
  if (linear <= 0) return -Infinity;
  return 20 * Math.log10(linear);
}

function normalizeDbfs(dbfs: number, floor: number): number {
  if (dbfs <= floor) return 0;
  if (dbfs >= 0) return 100;
  return ((dbfs - floor) / -floor) * 100;
}

export class LevelAnalyser {
  private _ctx: AudioContext | null = null;
  private _source: MediaStreamAudioSourceNode | null = null;
  private _analyser: AnalyserNode | null = null;
  private _interval: ReturnType<typeof setInterval> | null = null;
  private _timeDomainData: Float32Array<ArrayBuffer> | null = null;
  private _listeners: Set<LevelListener> = new Set();
  private _stopped = false;
  private _floorDbfs: number;

  constructor(private _options: LevelAnalyserOptions = {}) {
    this._floorDbfs = _options.floorDbfs ?? -60;
  }

  get isStopped(): boolean { return this._stopped; }

  /**
   * Start observing a track. Creates a side-chain AudioContext.
   * Safe to call only once — throws if already started.
   */
  start(track: MediaStreamTrack): void {
    if (this._ctx) throw new Error('LevelAnalyser: already started');
    if (this._stopped) throw new Error('LevelAnalyser: already stopped');

    const fftSize = this._options.fftSize ?? 2048;
    const intervalMs = this._options.intervalMs ?? 60;

    this._ctx = new AudioContext({ sampleRate: 48_000 });
    const stream = new MediaStream([track]);
    this._source = this._ctx.createMediaStreamSource(stream);
    this._analyser = this._ctx.createAnalyser();
    this._analyser.fftSize = fftSize;
    this._analyser.smoothingTimeConstant = 0;

    // Side-chain: source → analyser only (no destination).
    this._source.connect(this._analyser);

    this._timeDomainData = new Float32Array(fftSize);

    this._interval = setInterval(() => this._sample(), intervalMs);
  }

  subscribe(listener: LevelListener): () => void {
    this._listeners.add(listener);
    return () => { this._listeners.delete(listener); };
  }

  /**
   * Stop observing. Disconnects nodes, closes AudioContext.
   * Idempotent — safe to call multiple times.
   */
  stop(): void {
    if (this._stopped) return;
    this._stopped = true;

    if (this._interval) {
      clearInterval(this._interval);
      this._interval = null;
    }
    if (this._source) {
      try { this._source.disconnect(); } catch { /* teardown */ }
      this._source = null;
    }
    if (this._analyser) {
      this._analyser = null;
    }
    if (this._ctx && this._ctx.state !== 'closed') {
      this._ctx.close().catch(() => {});
      this._ctx = null;
    }
    this._listeners.clear();
  }

  private _sample(): void {
    if (!this._analyser || !this._timeDomainData) return;

    this._analyser.getFloatTimeDomainData(this._timeDomainData);

    let sumSquares = 0;
    let peak = 0;
    for (let i = 0; i < this._timeDomainData.length; i++) {
      const s = this._timeDomainData[i];
      sumSquares += s * s;
      const abs = Math.abs(s);
      if (abs > peak) peak = abs;
    }
    const rmsLinear = Math.sqrt(sumSquares / this._timeDomainData.length);

    const sample: LevelSample = {
      rmsDbfs: linearToDbfs(rmsLinear),
      peakDbfs: linearToDbfs(peak),
      rmsNormalized: Math.round(normalizeDbfs(linearToDbfs(rmsLinear), this._floorDbfs)),
    };

    for (const listener of this._listeners) {
      listener(sample);
    }
  }
}
