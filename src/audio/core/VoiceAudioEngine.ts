/**
 * VoiceAudioEngine — central owner of Hush voice audio runtime state.
 *
 * The engine owns mode selection, profile resolution, and operation state.
 * It does NOT own the audio graph or media pipeline — those remain in
 * trackManager.js, useMicMonitor.js, and useRoom.js.
 *
 * React components consume engine state via useVoiceAudioEngine().
 */

import type {
  AudioRuntimeMode,
  AudioPlatform,
  PlaybackContext,
  CaptureProfile,
  PlaybackProfile,
  AudioOperationStatus,
  OutputSelectionCapability,
  VoiceAudioState,
  PublishMicOptions,
} from './VoiceAudioTypes';
import { CAPTURE_PROFILES, PLAYBACK_PROFILES } from './VoiceAudioTypes';

export type StateListener = (state: VoiceAudioState) => void;

export interface VoiceAudioEngineOptions {
  mode: AudioRuntimeMode;
  platform: AudioPlatform;
}

// ─── Resolution ─────────────────────────────────────────

/**
 * Resolves the capture mode from context flags.
 *
 * Priority: local-monitor > low-latency > platform-standard.
 *
 * Platform detection (isMobileWebAudio) affects the standard-mode
 * capture path but does NOT override low-latency. A mobile user in
 * a low-latency room gets low-latency capture + mobile playback.
 */
export function resolveMode(context: {
  isLowLatency?: boolean;
  isLocalMonitor?: boolean;
  isMobileWebAudio?: boolean;
}): AudioRuntimeMode {
  if (context.isLocalMonitor) return 'local-monitor';
  if (context.isLowLatency) return 'low-latency';
  if (context.isMobileWebAudio) return 'mobile-web-standard';
  return 'desktop-standard';
}

/**
 * Resolves the platform independently from capture mode.
 * Platform drives playback constraints (output routing, element type).
 */
export function resolvePlatform(context: {
  isMobileWebAudio?: boolean;
}): AudioPlatform {
  return context.isMobileWebAudio ? 'mobile-web' : 'desktop';
}

/**
 * Resolves the playback context from mode and platform.
 * local-monitor has its own playback rules; everything else
 * defers to the platform.
 */
export function resolvePlaybackContext(
  mode: AudioRuntimeMode,
  platform: AudioPlatform,
): PlaybackContext {
  if (mode === 'local-monitor') return 'local-monitor';
  return platform;
}

/**
 * Derives publishMic options from a capture profile.
 *
 * This centralizes the mapping so future call sites don't
 * construct these options manually.
 */
export function derivePublishOptions(profile: CaptureProfile): PublishMicOptions {
  return {
    disableAudioFilters: !profile.hushProcessing && !profile.browserDsp,
    useRawTrack: profile.useRawTrack,
    useBrowserDsp: profile.browserDsp,
  };
}

// ─── Engine ─────────────────────────────────────────────

export class VoiceAudioEngine {
  private _mode: AudioRuntimeMode;
  private _platform: AudioPlatform;
  private _captureProfile: CaptureProfile;
  private _playbackProfile: PlaybackProfile;
  private _micOp: AudioOperationStatus = { state: 'idle' };
  private _deafenOp: AudioOperationStatus = { state: 'idle' };
  private _outputCapability: OutputSelectionCapability;
  private _isCapturing = false;
  private _isDeafened = false;
  private _disposed = false;
  private _listeners: Set<StateListener> = new Set();
  /** Cached snapshot for useSyncExternalStore referential stability. */
  private _cachedState: VoiceAudioState | null = null;

  constructor(options: VoiceAudioEngineOptions) {
    this._mode = options.mode;
    this._platform = options.platform;
    this._captureProfile = CAPTURE_PROFILES[options.mode];
    const playbackCtx = resolvePlaybackContext(options.mode, options.platform);
    this._playbackProfile = PLAYBACK_PROFILES[playbackCtx];
    this._outputCapability = this._playbackProfile.outputSelection ? 'supported' : 'unsupported';
  }

  get state(): VoiceAudioState {
    if (!this._cachedState) {
      this._cachedState = {
        mode: this._mode,
        platform: this._platform,
        captureProfile: this._captureProfile,
        playbackProfile: this._playbackProfile,
        micOperation: this._micOp,
        deafenOperation: this._deafenOp,
        outputCapability: this._outputCapability,
        isCapturing: this._isCapturing,
        isDeafened: this._isDeafened,
      };
    }
    return this._cachedState;
  }

  get mode(): AudioRuntimeMode { return this._mode; }
  get platform(): AudioPlatform { return this._platform; }
  get captureProfile(): CaptureProfile { return this._captureProfile; }
  get playbackProfile(): PlaybackProfile { return this._playbackProfile; }
  get publishOptions(): PublishMicOptions { return derivePublishOptions(this._captureProfile); }
  get isDisposed(): boolean { return this._disposed; }

  subscribe(listener: StateListener): () => void {
    this._listeners.add(listener);
    return () => { this._listeners.delete(listener); };
  }

  private _notify(): void {
    if (this._disposed) return;
    this._cachedState = null;
    const snapshot = this.state;
    for (const listener of this._listeners) {
      listener(snapshot);
    }
  }

  setMicPending(): AudioOperationStatus {
    const prev = this._micOp;
    this._micOp = { state: 'pending' };
    this._notify();
    return prev;
  }

  setMicApplied(capturing: boolean): void {
    this._micOp = { state: 'applied' };
    this._isCapturing = capturing;
    this._notify();
    this._micOp = { state: 'idle' };
    this._cachedState = null;
  }

  setMicFailed(error: string, capturing: boolean): void {
    this._micOp = { state: 'failed', error };
    this._isCapturing = capturing;
    this._notify();
  }

  setDeafenPending(): void {
    this._deafenOp = { state: 'pending' };
    this._notify();
  }

  setDeafenApplied(deafened: boolean): void {
    this._deafenOp = { state: 'applied' };
    this._isDeafened = deafened;
    this._notify();
    this._deafenOp = { state: 'idle' };
    this._cachedState = null;
  }

  setDeafenFailed(error: string): void {
    this._deafenOp = { state: 'failed', error };
    this._notify();
  }

  dispose(): void {
    if (this._disposed) return;
    this._disposed = true;
    this._listeners.clear();
  }
}
