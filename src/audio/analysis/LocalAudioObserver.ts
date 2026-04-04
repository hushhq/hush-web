/**
 * LocalAudioObserver — facade for local speaking detection.
 *
 * Owns a LevelAnalyser + SpeakingDetector pair for one capture session.
 * Created by CaptureOrchestrator after publishTo() succeeds. Disposed
 * on unpublish/teardown.
 *
 * Subscribers are notified only on speaking state transitions
 * (true → false or false → true). Level data is tracked internally
 * for future opt-in consumers but is not part of the subscription
 * contract in this phase.
 *
 * Lifecycle is fully owned by the orchestrator. React consumes
 * isSpeaking as a thin subscriber.
 */

import { LevelAnalyser } from './LevelAnalyser';
import type { LevelSample, LevelAnalyserOptions } from './LevelAnalyser';
import { SpeakingDetector } from './SpeakingDetector';
import type { SpeakingDetectorOptions } from './SpeakingDetector';

export interface ObserverState {
  /** Whether the local user is currently speaking. */
  isSpeaking: boolean;
}

export type ObserverListener = (state: ObserverState) => void;

export interface LocalAudioObserverOptions {
  analyser?: LevelAnalyserOptions;
  speaking?: SpeakingDetectorOptions;
}

export class LocalAudioObserver {
  private _analyser: LevelAnalyser;
  private _detector: SpeakingDetector;
  private _level = 0;
  private _listeners: Set<ObserverListener> = new Set();
  private _unsubAnalyser: (() => void) | null = null;
  private _unsubDetector: (() => void) | null = null;
  private _stopped = false;

  constructor(options: LocalAudioObserverOptions = {}) {
    this._analyser = new LevelAnalyser(options.analyser);
    this._detector = new SpeakingDetector(options.speaking);
  }

  /** Current RMS level 0-100. Not part of subscription contract — read directly if needed. */
  get level(): number { return this._level; }
  get isSpeaking(): boolean { return this._detector.isSpeaking; }
  get isStopped(): boolean { return this._stopped; }

  get state(): ObserverState {
    return { isSpeaking: this._detector.isSpeaking };
  }

  /**
   * Start observing a track. Call after publish succeeds.
   */
  start(track: MediaStreamTrack): void {
    if (this._stopped) throw new Error('LocalAudioObserver: already stopped');

    // Wire analyser samples into the speaking detector.
    // Level is updated silently — no notification per sample.
    this._unsubAnalyser = this._analyser.subscribe((sample: LevelSample) => {
      this._level = sample.rmsNormalized;
      this._detector.pushSample(sample.rmsDbfs);
    });

    // Notify listeners only on speaking state transitions.
    this._unsubDetector = this._detector.subscribe(() => {
      this._notify();
    });

    this._analyser.start(track);
  }

  /**
   * Subscribe to speaking state transitions only.
   * Listeners are NOT called on every level sample.
   */
  subscribe(listener: ObserverListener): () => void {
    this._listeners.add(listener);
    return () => { this._listeners.delete(listener); };
  }

  /**
   * Stop observing. Disposes analyser and detector.
   * Idempotent — safe to call multiple times.
   */
  stop(): void {
    if (this._stopped) return;
    this._stopped = true;

    this._unsubAnalyser?.();
    this._unsubDetector?.();
    this._analyser.stop();
    this._detector.dispose();
    this._listeners.clear();
  }

  private _notify(): void {
    const snapshot = this.state;
    for (const listener of this._listeners) {
      listener(snapshot);
    }
  }
}
