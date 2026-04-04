/**
 * CaptureSession — immutable resource bundle for one active mic capture.
 *
 * Created by CaptureOrchestrator.acquire(), holds all resources needed
 * for a capture lifecycle. Teardown is deterministic: disconnect nodes,
 * stop tracks, close context.
 *
 * Sessions are not reusable. After teardown(), all resources are released
 * and the session should be discarded.
 */

import type { CaptureProfile } from '../core/VoiceAudioTypes';

export interface CaptureSessionResources {
  /** The capture profile that created this session. */
  profile: CaptureProfile;
  /** Raw getUserMedia stream (always present). */
  rawStream: MediaStream;
  /** The track to publish — processed (from AudioContext) or raw. */
  processedTrack: MediaStreamTrack;
  /** AudioContext for the processing pipeline (null for raw-track profiles). */
  audioContext: AudioContext | null;
  /** Noise gate worklet node (null if no hushProcessing or worklet failed). */
  noiseGateNode: AudioWorkletNode | null;
  /** MediaStreamSource node (null for raw-track profiles). */
  sourceNode: MediaStreamAudioSourceNode | null;
  /** MediaStreamDestination node (null for raw-track profiles). */
  destinationNode: MediaStreamAudioDestinationNode | null;
}

export class CaptureSession {
  readonly profile: CaptureProfile;
  readonly rawStream: MediaStream;
  readonly processedTrack: MediaStreamTrack;
  readonly audioContext: AudioContext | null;
  readonly noiseGateNode: AudioWorkletNode | null;
  private _sourceNode: MediaStreamAudioSourceNode | null;
  private _destinationNode: MediaStreamAudioDestinationNode | null;
  private _tornDown = false;

  constructor(resources: CaptureSessionResources) {
    this.profile = resources.profile;
    this.rawStream = resources.rawStream;
    this.processedTrack = resources.processedTrack;
    this.audioContext = resources.audioContext;
    this.noiseGateNode = resources.noiseGateNode;
    this._sourceNode = resources.sourceNode;
    this._destinationNode = resources.destinationNode;
  }

  get isTornDown(): boolean {
    return this._tornDown;
  }

  /** Whether this session uses the Hush AudioContext pipeline. */
  get usesProcessingPipeline(): boolean {
    return this.audioContext !== null;
  }

  /**
   * Deterministic teardown: disconnect all nodes, stop all tracks,
   * close AudioContext. Safe to call multiple times (idempotent).
   */
  async teardown(): Promise<void> {
    if (this._tornDown) return;
    this._tornDown = true;

    // Disconnect nodes in reverse graph order.
    // Swallow errors — nodes may already be disconnected.
    if (this.noiseGateNode) {
      try { this.noiseGateNode.disconnect(); } catch { /* teardown */ }
    }
    if (this._sourceNode) {
      try { this._sourceNode.disconnect(); } catch { /* teardown */ }
    }
    if (this._destinationNode) {
      try { this._destinationNode.disconnect(); } catch { /* teardown */ }
    }

    // Stop all raw stream tracks.
    for (const track of this.rawStream.getTracks()) {
      track.stop();
    }

    // Explicitly stop the processed track when it differs from the raw
    // stream (pipeline sessions produce a distinct track from
    // MediaStreamDestination). Don't rely on context closure alone.
    if (this.processedTrack !== this.rawStream.getAudioTracks()[0]) {
      this.processedTrack.stop();
    }

    // Close AudioContext if present and not already closed.
    if (this.audioContext && this.audioContext.state !== 'closed') {
      try { await this.audioContext.close(); } catch { /* teardown */ }
    }
  }
}
