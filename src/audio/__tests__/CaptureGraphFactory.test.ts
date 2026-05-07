import { describe, it, expect, vi } from 'vitest';
import { buildCaptureGraph } from '../graph/CaptureGraphFactory';
import type { CaptureGraphOptions } from '../graph/CaptureGraphFactory';
import type { AudioContextFactory } from '../capture/CaptureOrchestrator';

// ─── Mocks ──────────────────────────────────────────────

function mockStream(): MediaStream {
  const track = { kind: 'audio', readyState: 'live' } as unknown as MediaStreamTrack;
  return {
    getTracks: () => [track],
    getAudioTracks: () => [track],
  } as unknown as MediaStream;
}

function mockAudioContext(): AudioContext {
  const destTrack = { kind: 'audio', readyState: 'live' } as unknown as MediaStreamTrack;
  const destStream = {
    getAudioTracks: () => [destTrack],
  } as unknown as MediaStream;
  const destination = {
    stream: destStream,
    channelCount: 2,
    connect: vi.fn(),
    disconnect: vi.fn(),
  } as unknown as MediaStreamAudioDestinationNode;

  return {
    state: 'running',
    sampleRate: 48000,
    close: vi.fn().mockResolvedValue(undefined),
    resume: vi.fn().mockResolvedValue(undefined),
    destination: {} as AudioDestinationNode,
    createMediaStreamSource: vi.fn().mockReturnValue({
      connect: vi.fn(),
      disconnect: vi.fn(),
    }),
    createMediaStreamDestination: vi.fn().mockReturnValue(destination),
    // Fresh node per call so per-node connect spies stay
    // independent. Tests use `mock.results` to walk individual gain
    // node instances.
    createGain: vi.fn(() => ({
      gain: { value: 1 },
      channelCount: 2,
      channelCountMode: 'max',
      channelInterpretation: 'speakers',
      connect: vi.fn(),
      disconnect: vi.fn(),
    })),
    audioWorklet: undefined, // No worklet in test env
  } as unknown as AudioContext;
}

function mockFactory(): AudioContextFactory & { lastContext: AudioContext | null } {
  const f = {
    lastContext: null as AudioContext | null,
    create: vi.fn((opts: AudioContextOptions) => {
      const ctx = mockAudioContext();
      f.lastContext = ctx;
      return ctx;
    }),
  };
  return f;
}

// ─── Tests ──────────────────────────────────────────────

describe('buildCaptureGraph', () => {
  it('creates AudioContext at 48kHz', async () => {
    const factory = mockFactory();
    await buildCaptureGraph({ stream: mockStream(), audioContextFactory: factory });
    expect(factory.create).toHaveBeenCalledWith({ sampleRate: 48_000 });
  });

  it('returns all expected nodes', async () => {
    const result = await buildCaptureGraph({
      stream: mockStream(),
      audioContextFactory: mockFactory(),
    });

    expect(result.audioContext).toBeDefined();
    expect(result.sourceNode).toBeDefined();
    expect(result.destinationNode).toBeDefined();
    expect(result.processedTrack).toBeDefined();
    expect(typeof result.applyFilterSettings).toBe('function');
  });

  it('sets destination channelCount to 1 (mono)', async () => {
    const result = await buildCaptureGraph({
      stream: mockStream(),
      audioContextFactory: mockFactory(),
    });

    expect(result.destinationNode.channelCount).toBe(1);
  });

  it('returns null noiseGateNode when no workletUrl provided', async () => {
    const result = await buildCaptureGraph({
      stream: mockStream(),
      audioContextFactory: mockFactory(),
    });

    expect(result.noiseGateNode).toBeNull();
  });

  it('returns null monitorGainNode when monitorOutput not requested', async () => {
    const result = await buildCaptureGraph({
      stream: mockStream(),
      audioContextFactory: mockFactory(),
    });

    expect(result.monitorGainNode).toBeNull();
  });

  it('creates monitorGainNode when monitorOutput is true', async () => {
    const factory = mockFactory();
    const result = await buildCaptureGraph({
      stream: mockStream(),
      audioContextFactory: factory,
      monitorOutput: true,
    });

    expect(result.monitorGainNode).not.toBeNull();
    expect(factory.lastContext!.createGain).toHaveBeenCalled();
  });

  it('connects sourceNode to destinationNode when no worklet', async () => {
    const factory = mockFactory();
    await buildCaptureGraph({
      stream: mockStream(),
      audioContextFactory: factory,
    });

    const source = (factory.lastContext!.createMediaStreamSource as ReturnType<typeof vi.fn>).mock.results[0].value;
    expect(source.connect).toHaveBeenCalled();
  });

  it('applyFilterSettings is a no-op when noiseGateNode is null', async () => {
    const result = await buildCaptureGraph({
      stream: mockStream(),
      audioContextFactory: mockFactory(),
    });

    // Should not throw
    result.applyFilterSettings({ noiseGateEnabled: false, noiseGateThresholdDb: -30 });
  });

  it('resumes suspended AudioContext', async () => {
    const factory = mockFactory();
    const ctx = mockAudioContext();
    Object.defineProperty(ctx, 'state', { value: 'suspended', writable: true });
    factory.create = vi.fn(() => ctx);
    factory.lastContext = ctx;

    await buildCaptureGraph({
      stream: mockStream(),
      audioContextFactory: factory,
    });

    expect(ctx.resume).toHaveBeenCalled();
  });

  it('does not resume running AudioContext', async () => {
    const factory = mockFactory();

    await buildCaptureGraph({
      stream: mockStream(),
      audioContextFactory: factory,
    });

    expect(factory.lastContext!.resume).not.toHaveBeenCalled();
  });

  it('loads worklet and creates noise gate when audioWorklet is available', async () => {
    const mockPostMessage = vi.fn();
    const mockWorkletNode = {
      port: { postMessage: mockPostMessage },
      connect: vi.fn(),
      disconnect: vi.fn(),
    };

    // Set up global AudioWorkletNode mock before the factory runs.
    // Must use a class (not vi.fn().mockReturnValue) for constructor semantics.
    const origCtor = globalThis.AudioWorkletNode;
    globalThis.AudioWorkletNode = class MockAudioWorkletNode {
      port = mockWorkletNode.port;
      connect = mockWorkletNode.connect;
      disconnect = mockWorkletNode.disconnect;
      constructor() { /* noop */ }
    } as unknown as typeof AudioWorkletNode;

    const factory = mockFactory();
    const originalCreate = factory.create;
    factory.create = vi.fn((opts: AudioContextOptions) => {
      const ctx = originalCreate(opts);
      Object.defineProperty(ctx, 'audioWorklet', {
        value: { addModule: vi.fn().mockResolvedValue(undefined) },
      });
      return ctx;
    });

    try {
      const result = await buildCaptureGraph({
        stream: mockStream(),
        audioContextFactory: factory,
        workletUrl: 'mock://worklet.js',
        filterSettings: { noiseGateEnabled: true, noiseGateThresholdDb: -45 },
      });

      expect(result.noiseGateNode).not.toBeNull();
      expect(mockPostMessage).toHaveBeenCalledWith({
        type: 'updateParams',
        enabled: true,
        threshold: -45,
      });
    } finally {
      globalThis.AudioWorkletNode = origCtor;
    }
  });

  it('routes monoDownmix → publish destinationNode + monitor gain (shared mono stage)', async () => {
    const factory = mockFactory();
    const result = await buildCaptureGraph({
      stream: mockStream(),
      audioContextFactory: factory,
      monitorOutput: true,
    });

    // The graph creates exactly two GainNodes when monitorOutput=true:
    //   call 0 = monoDownmixNode (shared stage)
    //   call 1 = monitorGainNode (loopback to speakers)
    const ctx = factory.lastContext as unknown as {
      createGain: ReturnType<typeof vi.fn>;
    };
    expect(ctx.createGain).toHaveBeenCalledTimes(2);
    const monoDownmixNode = ctx.createGain.mock.results[0].value;
    const monitorGainNode = ctx.createGain.mock.results[1].value;

    // monoDownmix is configured for downmix (channelCount=1, explicit, speakers)
    expect(monoDownmixNode.channelCount).toBe(1);
    expect(monoDownmixNode.channelCountMode).toBe('explicit');
    expect(monoDownmixNode.channelInterpretation).toBe('speakers');

    // The exported monoDownmixNode is the same node as call 0.
    expect(result.monoDownmixNode).toBe(monoDownmixNode);

    // monoDownmix → destinationNode (publish) AND monoDownmix → monitorGain.
    const calls = monoDownmixNode.connect.mock.calls;
    const targets = calls.map((c: unknown[]) => c[0]);
    expect(targets).toContain(result.destinationNode);
    expect(targets).toContain(monitorGainNode);

    // monitorGainNode → audioContext.destination (speaker output).
    const monitorTargets = monitorGainNode.connect.mock.calls.map(
      (c: unknown[]) => c[0],
    );
    expect(monitorTargets).toContain(factory.lastContext!.destination);
  });

  it('routes monoDownmix → publish destinationNode only when monitorOutput is false', async () => {
    const factory = mockFactory();
    const result = await buildCaptureGraph({
      stream: mockStream(),
      audioContextFactory: factory,
    });

    const ctx = factory.lastContext as unknown as {
      createGain: ReturnType<typeof vi.fn>;
    };
    // No monitor branch → only the monoDownmix gain is created.
    expect(ctx.createGain).toHaveBeenCalledTimes(1);
    const monoDownmixNode = ctx.createGain.mock.results[0].value;

    const targets = monoDownmixNode.connect.mock.calls.map(
      (c: unknown[]) => c[0],
    );
    expect(targets).toEqual([result.destinationNode]);
    expect(result.monitorGainNode).toBeNull();
  });

  it('returns null noiseGateNode when worklet addModule throws', async () => {
    const factory = mockFactory();
    const originalCreate = factory.create;
    factory.create = vi.fn((opts) => {
      const ctx = originalCreate(opts);
      Object.defineProperty(ctx, 'audioWorklet', {
        value: { addModule: vi.fn().mockRejectedValue(new Error('load failed')) },
      });
      return ctx;
    });

    const result = await buildCaptureGraph({
      stream: mockStream(),
      audioContextFactory: factory,
      workletUrl: 'mock://worklet.js',
    });

    // Worklet failed — noiseGateNode is null, graph continues
    expect(result.noiseGateNode).toBeNull();
    expect(result.processedTrack).toBeDefined();
  });
});
