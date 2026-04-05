import { describe, it, expect, vi } from 'vitest';
import { CaptureSession } from '../capture/CaptureSession';
import { CAPTURE_PROFILES } from '../core/VoiceAudioTypes';

function mockMediaStream(): MediaStream {
  const track = {
    stop: vi.fn(),
    kind: 'audio',
    readyState: 'live',
  } as unknown as MediaStreamTrack;
  return {
    getTracks: () => [track],
    getAudioTracks: () => [track],
  } as unknown as MediaStream;
}

function mockAudioContext(state = 'running'): AudioContext {
  return {
    state,
    close: vi.fn().mockResolvedValue(undefined),
  } as unknown as AudioContext;
}

function mockAudioNode(): AudioWorkletNode {
  return {
    disconnect: vi.fn(),
    port: { postMessage: vi.fn() },
  } as unknown as AudioWorkletNode;
}

function mockSourceNode(): MediaStreamAudioSourceNode {
  return { disconnect: vi.fn() } as unknown as MediaStreamAudioSourceNode;
}

function mockDestinationNode(): MediaStreamAudioDestinationNode {
  return { disconnect: vi.fn() } as unknown as MediaStreamAudioDestinationNode;
}

// ─── Raw-track session ──────────────────────────────────

describe('CaptureSession (raw-track)', () => {
  it('creates without AudioContext for raw-track profiles', () => {
    const stream = mockMediaStream();
    const session = new CaptureSession({
      profile: CAPTURE_PROFILES['mobile-web-standard'],
      rawStream: stream,
      processedTrack: stream.getAudioTracks()[0],
      audioContext: null,
      noiseGateNode: null,
      sourceNode: null,
      destinationNode: null,
    });

    expect(session.usesProcessingPipeline).toBe(false);
    expect(session.audioContext).toBeNull();
    expect(session.noiseGateNode).toBeNull();
    expect(session.isTornDown).toBe(false);
  });

  it('teardown stops raw tracks', async () => {
    const stream = mockMediaStream();
    const session = new CaptureSession({
      profile: CAPTURE_PROFILES['mobile-web-standard'],
      rawStream: stream,
      processedTrack: stream.getAudioTracks()[0],
      audioContext: null,
      noiseGateNode: null,
      sourceNode: null,
      destinationNode: null,
    });

    await session.teardown();

    expect(session.isTornDown).toBe(true);
    expect(stream.getTracks()[0].stop).toHaveBeenCalled();
  });

  it('teardown is idempotent', async () => {
    const stream = mockMediaStream();
    const session = new CaptureSession({
      profile: CAPTURE_PROFILES['mobile-web-standard'],
      rawStream: stream,
      processedTrack: stream.getAudioTracks()[0],
      audioContext: null,
      noiseGateNode: null,
      sourceNode: null,
      destinationNode: null,
    });

    await session.teardown();
    await session.teardown(); // second call should be no-op

    expect(stream.getTracks()[0].stop).toHaveBeenCalledTimes(1);
  });
});

// ─── Pipeline session ───────────────────────────────────

describe('CaptureSession (pipeline)', () => {
  it('creates with AudioContext for pipeline profiles', () => {
    const stream = mockMediaStream();
    const ctx = mockAudioContext();
    const gate = mockAudioNode();
    const session = new CaptureSession({
      profile: CAPTURE_PROFILES['desktop-standard'],
      rawStream: stream,
      processedTrack: stream.getAudioTracks()[0],
      audioContext: ctx,
      noiseGateNode: gate,
      sourceNode: mockSourceNode(),
      destinationNode: mockDestinationNode(),
    });

    expect(session.usesProcessingPipeline).toBe(true);
    expect(session.audioContext).toBe(ctx);
    expect(session.noiseGateNode).toBe(gate);
  });

  it('teardown disconnects nodes and closes context', async () => {
    const stream = mockMediaStream();
    const ctx = mockAudioContext();
    const gate = mockAudioNode();
    const source = mockSourceNode();
    const dest = mockDestinationNode();
    const session = new CaptureSession({
      profile: CAPTURE_PROFILES['desktop-standard'],
      rawStream: stream,
      processedTrack: stream.getAudioTracks()[0],
      audioContext: ctx,
      noiseGateNode: gate,
      sourceNode: source,
      destinationNode: dest,
    });

    await session.teardown();

    expect(gate.disconnect).toHaveBeenCalled();
    expect(source.disconnect).toHaveBeenCalled();
    expect(dest.disconnect).toHaveBeenCalled();
    expect(stream.getTracks()[0].stop).toHaveBeenCalled();
    expect(ctx.close).toHaveBeenCalled();
  });

  it('teardown explicitly stops processedTrack when distinct from raw', async () => {
    const rawTrack = {
      stop: vi.fn(),
      kind: 'audio',
      readyState: 'live',
    } as unknown as MediaStreamTrack;
    const rawStream = {
      getTracks: () => [rawTrack],
      getAudioTracks: () => [rawTrack],
    } as unknown as MediaStream;

    const processedTrack = {
      stop: vi.fn(),
      kind: 'audio',
      readyState: 'live',
    } as unknown as MediaStreamTrack;

    const session = new CaptureSession({
      profile: CAPTURE_PROFILES['desktop-standard'],
      rawStream,
      processedTrack,
      audioContext: mockAudioContext(),
      noiseGateNode: null,
      sourceNode: mockSourceNode(),
      destinationNode: mockDestinationNode(),
    });

    await session.teardown();

    expect(rawTrack.stop).toHaveBeenCalled();
    expect(processedTrack.stop).toHaveBeenCalled();
  });

  it('teardown does not double-stop when processedTrack is the raw track', async () => {
    const stream = mockMediaStream();
    const track = stream.getAudioTracks()[0];
    const session = new CaptureSession({
      profile: CAPTURE_PROFILES['mobile-web-standard'],
      rawStream: stream,
      processedTrack: track, // same object
      audioContext: null,
      noiseGateNode: null,
      sourceNode: null,
      destinationNode: null,
    });

    await session.teardown();

    // stop called once (from rawStream loop), not twice
    expect(track.stop).toHaveBeenCalledTimes(1);
  });

  it('teardown handles already-closed context', async () => {
    const stream = mockMediaStream();
    const ctx = mockAudioContext('closed');
    const session = new CaptureSession({
      profile: CAPTURE_PROFILES['desktop-standard'],
      rawStream: stream,
      processedTrack: stream.getAudioTracks()[0],
      audioContext: ctx,
      noiseGateNode: null,
      sourceNode: mockSourceNode(),
      destinationNode: mockDestinationNode(),
    });

    await session.teardown();

    // close() should NOT be called on an already-closed context
    expect(ctx.close).not.toHaveBeenCalled();
  });

  it('teardown swallows disconnect errors', async () => {
    const stream = mockMediaStream();
    const ctx = mockAudioContext();
    const gate = {
      disconnect: vi.fn().mockImplementation(() => { throw new Error('already disconnected'); }),
      port: { postMessage: vi.fn() },
    } as unknown as AudioWorkletNode;

    const session = new CaptureSession({
      profile: CAPTURE_PROFILES['desktop-standard'],
      rawStream: stream,
      processedTrack: stream.getAudioTracks()[0],
      audioContext: ctx,
      noiseGateNode: gate,
      sourceNode: mockSourceNode(),
      destinationNode: mockDestinationNode(),
    });

    // Should not throw despite disconnect error.
    await expect(session.teardown()).resolves.toBeUndefined();
  });
});
