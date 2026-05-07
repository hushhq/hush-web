/**
 * CaptureGraphFactory — shared capture graph assembly.
 *
 * Single source of truth for building the noise-gate capture pipeline:
 *   AudioContext (48kHz) → MediaStreamSource → [NoiseGateWorklet]
 *   → MediaStreamDestination → processedTrack
 *
 * Used by:
 *   - CaptureOrchestrator._buildPipelineSession (capture publish path)
 *   - useMicMonitor (settings mic test with monitorOutput)
 *
 * The factory does NOT absorb caller-specific logging, error handling,
 * or return-shape adaptation. Callers wrap the result into their own
 * structures (CaptureSession for publish, cleanup closures for mic test).
 */

import type { MicFilterSettings } from '../core/VoiceAudioTypes';
import type { AudioContextFactory } from '../capture/CaptureOrchestrator';

// ─── Types ──────────────────────────────────────────────

export interface CaptureGraphResult {
  audioContext: AudioContext;
  sourceNode: MediaStreamAudioSourceNode;
  destinationNode: MediaStreamAudioDestinationNode;
  noiseGateNode: AudioWorkletNode | null;
  /** Shared mono downmix stage. Both publish + monitor branches
   *  read from this node so they hear identical audio. Exposed so
   *  callers can attach extra taps (e.g. an AnalyserNode for the
   *  mic-test level meter when the noise-gate worklet is absent). */
  monoDownmixNode: GainNode;
  processedTrack: MediaStreamTrack;
  /** Optional monitor gain node (only if monitorOutput was true). */
  monitorGainNode: GainNode | null;
  /** Apply filter settings to the noise gate. Single source of truth
   *  for the worklet message protocol. No-op if gate is null. */
  applyFilterSettings: (settings: Partial<MicFilterSettings>) => void;
}

export interface CaptureGraphOptions {
  stream: MediaStream;
  /** Noise gate worklet URL. If omitted, no gate is created. */
  workletUrl?: URL | string;
  /** Initial filter settings to apply to the noise gate. */
  filterSettings?: Partial<MicFilterSettings>;
  /** If true, creates a GainNode routing to audioContext.destination
   *  for local loopback monitoring (used by useMicMonitor). */
  monitorOutput?: boolean;
  /** Injectable AudioContext factory for testability. */
  audioContextFactory?: AudioContextFactory;
}

// ─── Filter Settings ────────────────────────────────────

/**
 * Applies filter settings to a noise gate worklet node.
 * Single source of truth for the updateParams message protocol.
 */
function applySettingsToNode(
  node: AudioWorkletNode | null,
  settings: Partial<MicFilterSettings>,
): void {
  if (!node?.port) return;
  node.port.postMessage({
    type: 'updateParams',
    enabled: settings.noiseGateEnabled,
    threshold: settings.noiseGateThresholdDb,
  });
}

// ─── Factory ────────────────────────────────────────────

function defaultFactory(): AudioContextFactory {
  return { create: (opts: AudioContextOptions) => new AudioContext(opts) };
}

/**
 * Builds the capture graph. Returns all nodes for the caller to own.
 *
 * Does NOT handle:
 *   - Error logging (caller decides)
 *   - Return-shape adaptation (caller wraps result)
 *   - Lifecycle/teardown (caller owns via CaptureSession or cleanup fn)
 *
 * Throws if AudioContext creation or stream source setup fails.
 * Worklet loading failure is NOT thrown — noiseGateNode is null on failure.
 */
export async function buildCaptureGraph(
  options: CaptureGraphOptions,
): Promise<CaptureGraphResult> {
  const factory = options.audioContextFactory ?? defaultFactory();
  const audioContext = factory.create({ sampleRate: 48_000 });
  const sourceNode = audioContext.createMediaStreamSource(options.stream);
  const destinationNode = audioContext.createMediaStreamDestination();
  destinationNode.channelCount = 1;

  let noiseGateNode: AudioWorkletNode | null = null;
  let processingTail: AudioNode = sourceNode;

  // Attempt worklet load. Failure is non-fatal — graph continues without gate.
  if (options.workletUrl && typeof audioContext.audioWorklet !== 'undefined') {
    try {
      await audioContext.audioWorklet.addModule(options.workletUrl);
      noiseGateNode = new AudioWorkletNode(audioContext, 'noise-gate-processor');
      sourceNode.connect(noiseGateNode);
      processingTail = noiseGateNode;

      if (options.filterSettings) {
        applySettingsToNode(noiseGateNode, options.filterSettings);
      }
    } catch {
      // Worklet failed — caller decides how to log this.
      processingTail = sourceNode;
    }
  }

  // Shared mono downmix stage. Both endpoints (publish destination
  // + local monitor loopback) read from this single node so they
  // hear identical processed-and-mono audio. Without this, the
  // monitor branch would tap `processingTail` directly and a
  // stereo mic would surface only the L channel locally while the
  // publish branch (which the destinationNode downmixes to mono)
  // sounded different.
  //
  // GainNode with channelCount=1 + 'explicit' mode + 'speakers'
  // interpretation tells the Web Audio engine to apply the
  // standard stereo→mono downmix (L+R)/2 at this node, not a
  // channel-pick.
  const monoDownmixNode = audioContext.createGain();
  monoDownmixNode.channelCount = 1;
  monoDownmixNode.channelCountMode = 'explicit';
  monoDownmixNode.channelInterpretation = 'speakers';
  processingTail.connect(monoDownmixNode);

  monoDownmixNode.connect(destinationNode);

  // Optional monitor loopback for local mic test. Reads from the
  // shared mono stage so the user hears the same signal peers do.
  let monitorGainNode: GainNode | null = null;
  if (options.monitorOutput) {
    monitorGainNode = audioContext.createGain();
    monitorGainNode.gain.value = 1;
    monoDownmixNode.connect(monitorGainNode);
    monitorGainNode.connect(audioContext.destination);
  }

  // Resume if suspended (common on mobile).
  if (audioContext.state === 'suspended') {
    await audioContext.resume();
  }

  const processedTrack = destinationNode.stream.getAudioTracks()[0];

  return {
    audioContext,
    sourceNode,
    destinationNode,
    noiseGateNode,
    monoDownmixNode,
    processedTrack,
    monitorGainNode,
    applyFilterSettings: (settings) => applySettingsToNode(noiseGateNode, settings),
  };
}
