/**
 * LiveKitRoomAdapter — bridges CaptureOrchestrator to the real LiveKit API.
 *
 * Implements RoomPublishPort so the orchestrator can publish/unpublish
 * without importing livekit-client directly. Keeps localTracksRef in
 * sync for UI compatibility.
 */

import { LocalAudioTrack, Track } from 'livekit-client';
import type { PublishedTrackHandle, RoomPublishPort } from '../capture/CaptureOrchestrator';
import { MEDIA_SOURCES } from '../../utils/constants';

// ─── Types for LiveKit room subset ──────────────────────

/** Minimal interface for LiveKit LocalParticipant. */
export interface LocalParticipantPort {
  publishTrack(
    track: LocalAudioTrack,
    options: { source: typeof Track.Source.Microphone },
  ): Promise<void>;
  unpublishTrack(track: LocalAudioTrack): Promise<void>;
}

export type LocalTracksRef = {
  current: Map<string, { track: LocalAudioTrack; source: string }>;
};

// ─── Handle ─────────────────────────────────────────────

class LiveKitTrackHandle implements PublishedTrackHandle {
  /** Exposed for unpublishTrack to access the underlying LocalAudioTrack. */
  readonly _localTrack: LocalAudioTrack;

  constructor(localTrack: LocalAudioTrack) {
    this._localTrack = localTrack;
  }

  async mute(): Promise<void> {
    await this._localTrack.mute();
  }

  async unmute(): Promise<void> {
    await this._localTrack.unmute();
  }

  stop(): void {
    this._localTrack.stop();
  }
}

// ─── Adapter ────────────────────────────────────────────

export class LiveKitRoomAdapter implements RoomPublishPort {
  private _participant: LocalParticipantPort;
  private _tracksRef: LocalTracksRef;
  private _scheduleUpdate: () => void;

  constructor(
    participant: LocalParticipantPort,
    tracksRef: LocalTracksRef,
    scheduleUpdate: () => void,
  ) {
    this._participant = participant;
    this._tracksRef = tracksRef;
    this._scheduleUpdate = scheduleUpdate;
  }

  async publishTrack(
    track: MediaStreamTrack,
    _options: { source: string },
  ): Promise<PublishedTrackHandle> {
    const localTrack = new LocalAudioTrack(track);

    await this._participant.publishTrack(localTrack, {
      source: Track.Source.Microphone,
    });

    // Keep localTracksRef in sync — the rest of the app reads this.
    // sid is guaranteed non-null after publishTrack resolves.
    const sid = localTrack.sid!;
    this._tracksRef.current.set(sid, {
      track: localTrack,
      source: MEDIA_SOURCES.MIC,
    });
    this._scheduleUpdate();

    return new LiveKitTrackHandle(localTrack);
  }

  async unpublishTrack(handle: PublishedTrackHandle): Promise<void> {
    const lkHandle = handle as LiveKitTrackHandle;
    const localTrack = lkHandle._localTrack;

    await this._participant.unpublishTrack(localTrack);

    // Remove from localTracksRef by sid.
    if (localTrack.sid) {
      this._tracksRef.current.delete(localTrack.sid);
    }
    this._scheduleUpdate();
  }
}
