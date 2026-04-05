/**
 * CaptureGraphFactory — shared capture graph assembly.
 *
 * Single source of truth for building the noise-gate capture pipeline:
 *   AudioContext (48kHz) → MediaStreamSource → [NoiseGateWorklet]
 *   → MediaStreamDestination → processedTrack
 *
 * Used by:
 *   - CaptureOrchestrator._buildPipelineSession (TS capture path)
 *   - micProcessing.createMicProcessingPipeline (JS mic test path)
 *
 * The factory does NOT absorb caller-specific logging, error handling,
 * or return-shape adaptation. Callers wrap the result into their own
 * structures (CaptureSession, micProcessing return object, etc.).
 */

import type { MicFilterSettings } from '../core/VoiceAudioTypes';
import type { AudioContextFactory } from '../capture/CaptureOrchestrator';

// ─── Types ──────────────────────────────────────────────

export interface CaptureGraphResult {
  audioContext: AudioContext;
  sourceNode: MediaStreamAudioSourceNode;
  destinationNode: MediaStreamAudioDestinationNode;
  noiseGateNode: AudioWorkletNode | null;
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

  processingTail.connect(destinationNode);

  // Optional monitor loopback for local mic test.
  let monitorGainNode: GainNode | null = null;
  if (options.monitorOutput) {
    monitorGainNode = audioContext.createGain();
    monitorGainNode.gain.value = 1;
    processingTail.connect(monitorGainNode);
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
    processedTrack,
    monitorGainNode,
    applyFilterSettings: (settings) => applySettingsToNode(noiseGateNode, settings),
  };
}
