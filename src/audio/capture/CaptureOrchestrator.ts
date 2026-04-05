/**
 * CaptureOrchestrator — TypeScript owner of mic capture lifecycle.
 *
 * This orchestrator implements profile-driven capture path selection:
 *
 *   Pipeline path (desktop-standard, local-monitor):
 *     getUserMedia (browser DSP off) → AudioContext → noise gate worklet
 *     → MediaStreamDestination → processed track → LiveKit publish.
 *     Hush owns all DSP. Noise gate threshold is configurable.
 *
 *   Raw path (mobile-web-standard):
 *     getUserMedia (constraints per profile) → raw track → LiveKit publish.
 *     No AudioContext. Shortest, most predictable path.
 *     mobile-web enables browser DSP via constraints.
 *
 * The orchestrator reports operation state (pending/applied/failed) to
 * a VoiceAudioEngine instance when provided. It does not hold React
 * refs — all audio resources are owned by CaptureSession.
 *
 * Wired into useRoom as the active capture runtime. useRoom creates
 * the orchestrator on publishMic and delegates all mic lifecycle to it.
 */

import type { CaptureProfile, MicFilterSettings } from '../core/VoiceAudioTypes';
import type { VoiceAudioEngine } from '../core/VoiceAudioEngine';
import { CaptureSession } from './CaptureSession';
import type { CaptureSessionResources } from './CaptureSession';
import { buildConstraints } from './buildConstraints';
import { buildCaptureGraph } from '../graph/CaptureGraphFactory';
import { LocalAudioObserver } from '../analysis/LocalAudioObserver';
import type { LocalAudioObserverOptions, ObserverState } from '../analysis/LocalAudioObserver';

// ─── Types ──────────────────────────────────────────────

export type CaptureState = 'idle' | 'acquiring' | 'publishing' | 'live' | 'tearing-down';

/** Abstraction over navigator.mediaDevices for testability. */
export interface MediaDevicesPort {
  getUserMedia(constraints: MediaStreamConstraints): Promise<MediaStream>;
}

/** Abstraction over AudioContext construction for testability. */
export interface AudioContextFactory {
  create(options: AudioContextOptions): AudioContext;
}

/**
 * Opaque handle for a published track, returned by RoomPublishPort.
 *
 * Models the real LiveKit contract where the same object used to
 * publish is later passed back to unpublish, mute, and unmute.
 */
export interface PublishedTrackHandle {
  mute(): Promise<void>;
  unmute(): Promise<void>;
  stop(): void;
}

/**
 * Abstraction over LiveKit room publishing for testability.
 *
 * Models the real integration boundary:
 *   publish returns an opaque handle;
 *   unpublish consumes that same handle.
 *
 * The real adapter will wrap: new LocalAudioTrack(track) →
 * room.localParticipant.publishTrack(localTrack) and map
 * unpublish to room.localParticipant.unpublishTrack(localTrack).
 */
export interface RoomPublishPort {
  publishTrack(
    track: MediaStreamTrack,
    options: { source: string },
  ): Promise<PublishedTrackHandle>;
  unpublishTrack(handle: PublishedTrackHandle): Promise<void>;
}

export interface CaptureOrchestratorOptions {
  /** Engine to report operation state to. Optional for standalone testing. */
  engine?: VoiceAudioEngine;
  /** Injectable media devices (defaults to navigator.mediaDevices). */
  mediaDevices?: MediaDevicesPort;
  /** Injectable AudioContext factory. */
  audioContextFactory?: AudioContextFactory;
  /** Noise gate worklet URL. */
  noiseGateWorkletUrl?: URL | string;
  /** Initial mic filter settings. If not provided, uses defaults. */
  initialFilterSettings?: MicFilterSettings;
  /** Options for the local audio observer (level + speaking detection). */
  observerOptions?: LocalAudioObserverOptions;
}

// ─── Default implementations ────────────────────────────

const DEFAULT_FILTER_SETTINGS: MicFilterSettings = {
  noiseGateEnabled: true,
  noiseGateThresholdDb: -50,
  echoCancellation: false,
};

function defaultAudioContextFactory(): AudioContextFactory {
  return {
    create: (options: AudioContextOptions) => new AudioContext(options),
  };
}

// ─── Orchestrator ───────────────────────────────────────

export class CaptureOrchestrator {
  private _state: CaptureState = 'idle';
  private _session: CaptureSession | null = null;
  private _publishedHandle: PublishedTrackHandle | null = null;
  private _observer: LocalAudioObserver | null = null;
  private _engine: VoiceAudioEngine | undefined;
  private _mediaDevices: MediaDevicesPort;
  private _audioContextFactory: AudioContextFactory;
  private _noiseGateWorkletUrl: URL | string | undefined;
  private _filterSettings: MicFilterSettings;
  private _observerOptions: LocalAudioObserverOptions;
  private _applyFilterSettings: ((settings: Partial<MicFilterSettings>) => void) | null = null;

  constructor(options: CaptureOrchestratorOptions = {}) {
    this._engine = options.engine;
    this._mediaDevices = options.mediaDevices ?? navigator.mediaDevices;
    this._audioContextFactory = options.audioContextFactory ?? defaultAudioContextFactory();
    this._noiseGateWorkletUrl = options.noiseGateWorkletUrl;
    this._filterSettings = options.initialFilterSettings ?? { ...DEFAULT_FILTER_SETTINGS };
    this._observerOptions = options.observerOptions ?? {};
  }

  get state(): CaptureState { return this._state; }
  get session(): CaptureSession | null { return this._session; }
  get isLive(): boolean { return this._state === 'live'; }
  /** The local audio observer. Non-null only while published (live). */
  get observer(): LocalAudioObserver | null { return this._observer; }

  // ─── Acquire ────────────────────────────────────────

  /**
   * Acquire mic stream and build the capture graph for the given profile.
   *
   * For pipeline profiles (hushProcessing=true):
   *   Creates AudioContext → noise gate worklet → MediaStreamDestination.
   *
   * For raw-track profiles (useRawTrack=true):
   *   Returns the getUserMedia track directly.
   *
   * On failure, cleans up any partially created resources.
   */
  async acquire(
    profile: CaptureProfile,
    deviceId?: string | null,
  ): Promise<CaptureSession> {
    if (this._session) {
      throw new Error('CaptureOrchestrator: session already active. Call teardown() first.');
    }

    this._state = 'acquiring';
    this._engine?.setMicPending();

    let stream: MediaStream | null = null;

    try {
      const constraints = buildConstraints(profile, deviceId);
      stream = await this._mediaDevices.getUserMedia({ audio: constraints });

      let session: CaptureSession;

      if (profile.useRawTrack) {
        session = this._buildRawSession(profile, stream);
      } else {
        session = await this._buildPipelineSession(profile, stream);
      }

      this._session = session;
      return session;
    } catch (err) {
      // Clean up partially acquired resources.
      if (stream) {
        for (const track of stream.getTracks()) {
          track.stop();
        }
      }
      this._state = 'idle';
      this._engine?.setMicFailed(
        err instanceof Error ? err.message : 'Capture acquisition failed',
        false,
      );
      throw err;
    }
  }

  // ─── Publish ────────────────────────────────────────

  /**
   * Publish the acquired session's track to a LiveKit room.
   */
  async publishTo(room: RoomPublishPort): Promise<void> {
    if (!this._session) {
      throw new Error('CaptureOrchestrator: no session to publish. Call acquire() first.');
    }
    if (this._state === 'live') {
      throw new Error('CaptureOrchestrator: already published.');
    }

    this._state = 'publishing';

    try {
      const handle = await room.publishTrack(
        this._session.processedTrack,
        { source: 'microphone' },
      );
      this._publishedHandle = handle;
      this._state = 'live';

      // Start local audio observation ONLY after publish succeeds.
      // The observer taps the published track (processedTrack).
      // Non-critical: if AudioContext is unavailable (e.g. test env),
      // the orchestrator continues without observation.
      try {
        const obs = new LocalAudioObserver(this._observerOptions);
        obs.start(this._session!.processedTrack);
        this._observer = obs;
      } catch {
        // Observer failed to start — continue without local metering.
      }

      this._engine?.setMicApplied(true);
    } catch (err) {
      this._state = 'acquiring'; // Session still valid, just not published.
      this._engine?.setMicFailed(
        err instanceof Error ? err.message : 'Publish failed',
        false,
      );
      throw err;
    }
  }

  // ─── Mute / Unmute ─────────────────────────────────

  async mute(): Promise<void> {
    if (!this._publishedHandle) {
      throw new Error('CaptureOrchestrator: no published track to mute.');
    }
    await this._publishedHandle.mute();
  }

  async unmute(): Promise<void> {
    if (!this._publishedHandle) {
      throw new Error('CaptureOrchestrator: no published track to unmute.');
    }
    await this._publishedHandle.unmute();
  }

  // ─── Unpublish ──────────────────────────────────────

  /**
   * Unpublish the track and tear down all capture resources.
   * After this call, the orchestrator is back in 'idle' state.
   */
  async unpublish(room: RoomPublishPort): Promise<void> {
    this._state = 'tearing-down';

    try {
      if (this._publishedHandle) {
        this._publishedHandle.stop();
        await room.unpublishTrack(this._publishedHandle);
      }
    } catch {
      // Best-effort unpublish. Teardown continues regardless.
    }

    await this._teardownSession();
    this._engine?.setMicApplied(false);
  }

  // ─── Teardown ───────────────────────────────────────

  /**
   * Tear down capture resources without unpublishing.
   * Use when the room is already disconnected.
   */
  async teardown(): Promise<void> {
    this._state = 'tearing-down';
    await this._teardownSession();
  }

  // ─── Filter Settings ───────────────────────────────

  /**
   * Update noise gate settings on the active session.
   * Only has effect when hushProcessing is active.
   */
  updateFilterSettings(settings: Partial<MicFilterSettings>): void {
    this._filterSettings = { ...this._filterSettings, ...settings };
    this._applyFilterSettings?.(this._filterSettings);
  }

  // ─── Private: Session Builders ──────────────────────

  /**
   * Raw-track path: getUserMedia stream → raw track.
   * Used by mobile-web-standard profiles.
   */
  private _buildRawSession(
    profile: CaptureProfile,
    stream: MediaStream,
  ): CaptureSession {
    const rawTrack = stream.getAudioTracks()[0];

    return new CaptureSession({
      profile,
      rawStream: stream,
      processedTrack: rawTrack,
      audioContext: null,
      noiseGateNode: null,
      sourceNode: null,
      destinationNode: null,
    });
  }

  /**
   * Pipeline path: delegates to buildCaptureGraph for shared assembly.
   * Used by desktop-standard and local-monitor profiles.
   */
  private async _buildPipelineSession(
    profile: CaptureProfile,
    stream: MediaStream,
  ): Promise<CaptureSession> {
    const graph = await buildCaptureGraph({
      stream,
      workletUrl: this._noiseGateWorkletUrl,
      filterSettings: this._filterSettings,
      audioContextFactory: this._audioContextFactory,
    });

    this._applyFilterSettings = graph.applyFilterSettings;

    return new CaptureSession({
      profile,
      rawStream: stream,
      processedTrack: graph.processedTrack,
      audioContext: graph.audioContext,
      noiseGateNode: graph.noiseGateNode,
      sourceNode: graph.sourceNode,
      destinationNode: graph.destinationNode,
    });
  }

  // ─── Private: Teardown ──────────────────────────────

  private async _teardownSession(): Promise<void> {
    if (this._observer) {
      this._observer.stop();
      this._observer = null;
    }
    if (this._session) {
      await this._session.teardown();
      this._session = null;
    }
    this._publishedHandle = null;
    this._applyFilterSettings = null;
    this._state = 'idle';
  }
}
