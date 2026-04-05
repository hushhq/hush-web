/**
 * ObservationTap — shared factory for side-chain analyser graphs.
 *
 * Creates a read-only AudioContext + AnalyserNode tapping a
 * MediaStreamTrack. No destination — purely observation.
 *
 * Used by LevelAnalyser to measure RMS/peak on the published track.
 */

export interface ObservationTapResult {
  audioContext: AudioContext;
  sourceNode: MediaStreamAudioSourceNode;
  analyserNode: AnalyserNode;
}

export interface ObservationTapOptions {
  fftSize?: number;
}

/**
 * Builds a side-chain observation tap on a track.
 * The analyser reads time-domain data without producing audio output.
 */
export function buildObservationTap(
  track: MediaStreamTrack,
  options: ObservationTapOptions = {},
): ObservationTapResult {
  const fftSize = options.fftSize ?? 2048;

  const audioContext = new AudioContext({ sampleRate: 48_000 });
  const stream = new MediaStream([track]);
  const sourceNode = audioContext.createMediaStreamSource(stream);
  const analyserNode = audioContext.createAnalyser();
  analyserNode.fftSize = fftSize;
  analyserNode.smoothingTimeConstant = 0;

  // Side-chain: source → analyser only (no destination).
  sourceNode.connect(analyserNode);

  return { audioContext, sourceNode, analyserNode };
}
