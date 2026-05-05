/**
 * Hush Voice Audio Subsystem — public API surface.
 *
 * Hush voice audio subsystem. Owns capture orchestration, profile
 * resolution, local audio observation, and the typed engine state.
 * useRoom delegates mic lifecycle to CaptureOrchestrator.
 */

export type {
  AudioPlatform,
  AudioRuntimeMode,
  PlaybackContext,
  CaptureProfile,
  PlaybackProfile,
  AudioOperationState,
  AudioOperationStatus,
  OutputSelectionCapability,
  VoiceAudioState,
  PublishMicOptions,
  MicFilterSettings,
} from './core/VoiceAudioTypes';
export { CAPTURE_PROFILES, PLAYBACK_PROFILES } from './core/VoiceAudioTypes';

export {
  VoiceAudioEngine,
  resolveMode,
  resolvePlatform,
  resolvePlaybackContext,
  derivePublishOptions,
} from './core/VoiceAudioEngine';
export type { VoiceAudioEngineOptions, StateListener } from './core/VoiceAudioEngine';

export { useVoiceAudioEngine } from './adapters/useVoiceAudioEngine';
export type { UseVoiceAudioEngineOptions } from './adapters/useVoiceAudioEngine';

export { CaptureOrchestrator } from './capture/CaptureOrchestrator';
export type {
  CaptureState,
  CaptureOrchestratorOptions,
  MediaDevicesPort,
  AudioContextFactory,
  RoomPublishPort,
  PublishedTrackHandle,
} from './capture/CaptureOrchestrator';
export { CaptureSession } from './capture/CaptureSession';
export type { CaptureSessionResources } from './capture/CaptureSession';
export { buildConstraints } from './capture/buildConstraints';
export type { MicConstraints } from './capture/buildConstraints';

export { LiveKitRoomAdapter } from './adapters/LiveKitRoomAdapter';
export type { LocalParticipantPort, LocalTracksRef } from './adapters/LiveKitRoomAdapter';

export { isMobileWebAudio } from './core/detectAudioPlatform';

export { buildCaptureGraph } from './graph/CaptureGraphFactory';
export type { CaptureGraphResult, CaptureGraphOptions } from './graph/CaptureGraphFactory';
export { buildObservationTap } from './graph/ObservationTap';
export type { ObservationTapResult, ObservationTapOptions } from './graph/ObservationTap';

export {
  PlaybackManager,
  isOutputDeviceSelectionSupported,
} from './playback/PlaybackManager';
export type { ManagedAudioTrack } from './playback/PlaybackManager';

export { LevelAnalyser } from './analysis/LevelAnalyser';
export type { LevelSample, LevelListener, LevelAnalyserOptions } from './analysis/LevelAnalyser';
export { SpeakingDetector } from './analysis/SpeakingDetector';
export type { SpeakingListener, SpeakingDetectorOptions } from './analysis/SpeakingDetector';
export { LocalAudioObserver } from './analysis/LocalAudioObserver';
export type { ObserverState, ObserverListener, LocalAudioObserverOptions } from './analysis/LocalAudioObserver';
