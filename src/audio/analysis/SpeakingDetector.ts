/**
 * SpeakingDetector — threshold + hold-time local speaking state machine.
 *
 * Consumes RMS dBFS samples from LevelAnalyser and emits isSpeaking
 * state changes. Uses dBFS (not normalized 0-100) as the input signal
 * for speaking decisions.
 *
 * Algorithm:
 *   - When rmsDbfs crosses above threshold → isSpeaking = true
 *   - When rmsDbfs drops below threshold → start hold timer
 *   - After hold time expires without recovery → isSpeaking = false
 *   - If rmsDbfs rises above threshold during hold → cancel timer,
 *     stay speaking
 *
 * This prevents flutter during natural speech pauses.
 */

export type SpeakingListener = (isSpeaking: boolean) => void;

export interface SpeakingDetectorOptions {
  /** Threshold in dBFS. Signal above this = speaking. Defaults to -40. */
  thresholdDbfs?: number;
  /** Hold time in ms after signal drops below threshold. Defaults to 200. */
  holdMs?: number;
}

export class SpeakingDetector {
  private _isSpeaking = false;
  private _holdRemaining = 0;
  private _lastSampleTime = 0;
  private _listeners: Set<SpeakingListener> = new Set();
  private _disposed = false;
  private _thresholdDbfs: number;
  private _holdMs: number;

  constructor(options: SpeakingDetectorOptions = {}) {
    this._thresholdDbfs = options.thresholdDbfs ?? -40;
    this._holdMs = options.holdMs ?? 200;
  }

  get isSpeaking(): boolean { return this._isSpeaking; }
  get isDisposed(): boolean { return this._disposed; }

  /**
   * Feed a level sample. Call this from the LevelAnalyser callback.
   * The detector updates its internal state and notifies listeners
   * on transitions.
   */
  pushSample(rmsDbfs: number, timestampMs?: number): void {
    if (this._disposed) return;

    const now = timestampMs ?? performance.now();
    const elapsed = this._lastSampleTime > 0 ? now - this._lastSampleTime : 0;
    this._lastSampleTime = now;

    const aboveThreshold = rmsDbfs > this._thresholdDbfs;

    if (aboveThreshold) {
      // Signal is above threshold — speaking.
      this._holdRemaining = this._holdMs;
      if (!this._isSpeaking) {
        this._isSpeaking = true;
        this._notify();
      }
    } else if (this._isSpeaking) {
      // Signal below threshold but still in hold period.
      this._holdRemaining -= elapsed;
      if (this._holdRemaining <= 0) {
        this._isSpeaking = false;
        this._holdRemaining = 0;
        this._notify();
      }
    }
  }

  subscribe(listener: SpeakingListener): () => void {
    this._listeners.add(listener);
    return () => { this._listeners.delete(listener); };
  }

  dispose(): void {
    if (this._disposed) return;
    this._disposed = true;
    this._listeners.clear();
  }

  private _notify(): void {
    for (const listener of this._listeners) {
      listener(this._isSpeaking);
    }
  }
}
