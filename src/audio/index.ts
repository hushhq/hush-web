/**
 * Hush Voice Audio Subsystem — public API surface.
 *
 * This is the typed foundation for audio runtime contracts.
 * The JS modules (trackManager, useMicMonitor, micProcessing)
 * remain as the sole runtime implementation.
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
