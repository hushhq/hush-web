/**
 * Core type definitions for the Hush voice audio subsystem.
 *
 * These types define the intended typed runtime model for future gradual
 * adoption. They do not replace or reinterpret the JS runtime behavior.
 * The JS modules (trackManager, useMicMonitor, micProcessing) remain
 * as the sole runtime implementation.
 *
 * The model separates two independent axes:
 *
 *   AudioRuntimeMode — determines capture behavior (DSP pipeline).
 *     Depends on both platform and latency preference.
 *
 *   AudioPlatform — determines playback constraints (output routing).
 *     Depends only on the device/browser. A mobile user in a
 *     low-latency room is still on a mobile platform.
 */

// ─── Platform ───────────────────────────────────────────

/** Hardware/browser platform. Drives playback constraints. */
export type AudioPlatform = 'desktop' | 'mobile-web';

// ─── Runtime Modes ──────────────────────────────────────

/**
 * Capture mode. Determines the DSP pipeline strategy.
 *
 * 'low-latency' capture behavior is the same on both platforms
 * (raw track, all DSP off). Platform differences surface only
 * in playback, which is resolved separately via AudioPlatform.
 */
export type AudioRuntimeMode =
  | 'desktop-standard'
  | 'mobile-web-standard'
  | 'low-latency'
  | 'local-monitor';

// ─── Capture Profiles ───────────────────────────────────

/**
 * Declares the capture strategy for each runtime mode.
 *
 * Each profile is immutable per mode. Future phases will use these
 * to drive runtime graph construction; this branch only defines
 * the typed contract.
 */
export interface CaptureProfile {
  readonly mode: AudioRuntimeMode;
  /** Whether browser DSP (NS + AGC) is enabled in getUserMedia constraints. */
  readonly browserDsp: boolean;
  /** Whether Hush processing (AudioContext + noise gate worklet) is applied. */
  readonly hushProcessing: boolean;
  /** Whether getUserMedia returns a raw track published directly (no AudioContext). */
  readonly useRawTrack: boolean;
  /** Whether local loopback monitoring is supported. */
  readonly localMonitoring: boolean;
  /** Whether echo cancellation is user-configurable. */
  readonly echoCanConfigurable: boolean;
}

/**
 * Immutable capture profile definitions.
 *
 * These describe the intended per-mode capture architecture:
 * - desktop-standard: full Hush pipeline (AudioContext + noise gate)
 * - mobile-web-standard: raw track with browser DSP (NS+AGC on, no AudioContext)
 * - low-latency: raw track, all DSP disabled (same on desktop and mobile)
 * - local-monitor: Hush pipeline with loopback monitoring
 */
export const CAPTURE_PROFILES: Readonly<Record<AudioRuntimeMode, CaptureProfile>> = {
  'desktop-standard': {
    mode: 'desktop-standard',
    browserDsp: false,
    hushProcessing: true,
    useRawTrack: false,
    localMonitoring: true,
    echoCanConfigurable: true,
  },
  'mobile-web-standard': {
    mode: 'mobile-web-standard',
    browserDsp: true,
    hushProcessing: false,
    useRawTrack: true,
    localMonitoring: false,
    echoCanConfigurable: false,
  },
  'low-latency': {
    mode: 'low-latency',
    browserDsp: false,
    hushProcessing: false,
    useRawTrack: true,
    localMonitoring: false,
    echoCanConfigurable: false,
  },
  'local-monitor': {
    mode: 'local-monitor',
    browserDsp: false,
    hushProcessing: true,
    useRawTrack: false,
    localMonitoring: true,
    echoCanConfigurable: true,
  },
};

// ─── Playback Profiles ──────────────────────────────────

/**
 * The key used to look up a playback profile.
 *
 * Playback constraints are driven by platform, not latency mode.
 * A mobile user in a low-latency room still needs iOS video element
 * routing and cannot use setSinkId(). 'local-monitor' is a special
 * case with its own playback rules (no autoplay retry, no output
 * selection).
 */
export type PlaybackContext = AudioPlatform | 'local-monitor';

export interface PlaybackProfile {
  readonly context: PlaybackContext;
  /** Whether setSinkId() output selection is supported and meaningful. */
  readonly outputSelection: boolean;
  /** Whether playback uses video element (mobile iOS) or audio element. */
  readonly useVideoElement: boolean;
  /** Whether autoplay retry should be attempted on blocked playback. */
  readonly autoplayRetry: boolean;
}

export const PLAYBACK_PROFILES: Readonly<Record<PlaybackContext, PlaybackProfile>> = {
  'desktop': {
    context: 'desktop',
    outputSelection: true,
    useVideoElement: false,
    autoplayRetry: true,
  },
  'mobile-web': {
    context: 'mobile-web',
    outputSelection: false,
    useVideoElement: true,
    autoplayRetry: true,
  },
  'local-monitor': {
    context: 'local-monitor',
    outputSelection: false,
    useVideoElement: false,
    autoplayRetry: false,
  },
};

// ─── Operation State ────────────────────────────────────

export type AudioOperationState = 'idle' | 'pending' | 'applied' | 'failed';

export interface AudioOperationStatus {
  readonly state: AudioOperationState;
  readonly error?: string;
}

// ─── Output Selection ───────────────────────────────────

export type OutputSelectionCapability = 'supported' | 'unsupported' | 'unknown';

// ─── Engine State Snapshot ──────────────────────────────

export interface VoiceAudioState {
  readonly mode: AudioRuntimeMode;
  readonly platform: AudioPlatform;
  readonly captureProfile: CaptureProfile;
  readonly playbackProfile: PlaybackProfile;
  readonly micOperation: AudioOperationStatus;
  readonly deafenOperation: AudioOperationStatus;
  readonly outputCapability: OutputSelectionCapability;
  readonly isCapturing: boolean;
  readonly isDeafened: boolean;
}

// ─── Publish Options ────────────────────────────────────

/**
 * Options derived from a capture profile for mic publishing.
 * Future phases will pass these to trackManager.publishMic().
 */
export interface PublishMicOptions {
  readonly disableAudioFilters: boolean;
  readonly useRawTrack: boolean;
  readonly useBrowserDsp: boolean;
}

// ─── Mic Filter Settings ────────────────────────────────

export interface MicFilterSettings {
  noiseGateEnabled: boolean;
  noiseGateThresholdDb: number;
  echoCancellation: boolean;
}
