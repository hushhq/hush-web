import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CaptureOrchestrator } from '../capture/CaptureOrchestrator';
import type { MediaDevicesPort, AudioContextFactory, RoomPublishPort } from '../capture/CaptureOrchestrator';
import { VoiceAudioEngine } from '../core/VoiceAudioEngine';
import { CAPTURE_PROFILES } from '../core/VoiceAudioTypes';

// ─── Test Helpers ───────────────────────────────────────

function mockTrack(): MediaStreamTrack {
  return {
    stop: vi.fn(),
    kind: 'audio',
    readyState: 'live',
    id: `track-${Math.random().toString(36).slice(2)}`,
  } as unknown as MediaStreamTrack;
}

function mockStream(): MediaStream {
  const track = mockTrack();
  return {
    getTracks: () => [track],
    getAudioTracks: () => [track],
  } as unknown as MediaStream;
}

function mockMediaDevices(stream?: MediaStream): MediaDevicesPort {
  return {
    getUserMedia: vi.fn().mockResolvedValue(stream ?? mockStream()),
  };
}

function mockAudioContext(): AudioContext {
  const destination = {
    stream: mockStream(),
    channelCount: 1,
  } as unknown as MediaStreamAudioDestinationNode;

  return {
    state: 'running',
    sampleRate: 48000,
    close: vi.fn().mockResolvedValue(undefined),
    resume: vi.fn().mockResolvedValue(undefined),
    createMediaStreamSource: vi.fn().mockReturnValue({
      connect: vi.fn(),
      disconnect: vi.fn(),
    }),
    createMediaStreamDestination: vi.fn().mockReturnValue(destination),
    audioWorklet: undefined, // No worklet support in test env by default
  } as unknown as AudioContext;
}

function mockAudioContextFactory(): AudioContextFactory & { lastContext: AudioContext | null } {
  const factory = {
    lastContext: null as AudioContext | null,
    create: vi.fn((options: AudioContextOptions) => {
      const ctx = mockAudioContext();
      factory.lastContext = ctx;
      return ctx;
    }),
  };
  return factory;
}

function mockRoom(): RoomPublishPort {
  return {
    publishTrack: vi.fn().mockResolvedValue({
      mute: vi.fn().mockResolvedValue(undefined),
      unmute: vi.fn().mockResolvedValue(undefined),
      stop: vi.fn(),
    }),
    unpublishTrack: vi.fn().mockResolvedValue(undefined),
  };
}

// ─── State Transitions ──────────────────────────────────

describe('CaptureOrchestrator: state transitions', () => {
  it('starts in idle state', () => {
    const orch = new CaptureOrchestrator({
      mediaDevices: mockMediaDevices(),
    });
    expect(orch.state).toBe('idle');
    expect(orch.session).toBeNull();
    expect(orch.isLive).toBe(false);
  });

  it('acquire → publishing → live lifecycle', async () => {
    const devices = mockMediaDevices();
    const ctxFactory = mockAudioContextFactory();
    const room = mockRoom();

    const orch = new CaptureOrchestrator({
      mediaDevices: devices,
      audioContextFactory: ctxFactory,
    });

    // Acquire for a raw-track profile (simplest path)
    const session = await orch.acquire(CAPTURE_PROFILES['low-latency']);
    expect(orch.state).toBe('acquiring');
    expect(session).toBeDefined();
    expect(session.profile.mode).toBe('low-latency');

    // Publish
    await orch.publishTo(room);
    expect(orch.state).toBe('live');
    expect(orch.isLive).toBe(true);
    expect(room.publishTrack).toHaveBeenCalledWith(
      session.processedTrack,
      { source: 'microphone' },
    );

    // Unpublish — passes the handle object, not a string sid
    await orch.unpublish(room);
    expect(room.unpublishTrack).toHaveBeenCalledTimes(1);
    const unpublishArg = (room.unpublishTrack as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(typeof unpublishArg).toBe('object');
    expect(unpublishArg).toHaveProperty('mute');
    expect(unpublishArg).toHaveProperty('stop');
    expect(orch.state).toBe('idle');
    expect(orch.session).toBeNull();
    expect(orch.isLive).toBe(false);
  });

  it('teardown without publish cleans up session', async () => {
    const orch = new CaptureOrchestrator({
      mediaDevices: mockMediaDevices(),
    });

    const session = await orch.acquire(CAPTURE_PROFILES['low-latency']);
    expect(session.isTornDown).toBe(false);

    await orch.teardown();
    expect(orch.state).toBe('idle');
    expect(orch.session).toBeNull();
    expect(session.isTornDown).toBe(true);
  });

  it('rejects acquire when session already active', async () => {
    const orch = new CaptureOrchestrator({
      mediaDevices: mockMediaDevices(),
    });

    await orch.acquire(CAPTURE_PROFILES['low-latency']);

    await expect(
      orch.acquire(CAPTURE_PROFILES['low-latency']),
    ).rejects.toThrow('session already active');
  });

  it('rejects publish without acquire', async () => {
    const orch = new CaptureOrchestrator({
      mediaDevices: mockMediaDevices(),
    });

    await expect(orch.publishTo(mockRoom())).rejects.toThrow('no session to publish');
  });

  it('rejects double publish', async () => {
    const orch = new CaptureOrchestrator({
      mediaDevices: mockMediaDevices(),
    });
    const room = mockRoom();

    await orch.acquire(CAPTURE_PROFILES['low-latency']);
    await orch.publishTo(room);

    await expect(orch.publishTo(room)).rejects.toThrow('already published');
  });
});

// ─── Engine Integration ─────────────────────────────────

describe('CaptureOrchestrator: engine state reporting', () => {
  let engine: VoiceAudioEngine;

  beforeEach(() => {
    engine = new VoiceAudioEngine({ mode: 'desktop-standard', platform: 'desktop' });
  });

  it('reports pending on acquire, applied on publish', async () => {
    const listener = vi.fn();
    engine.subscribe(listener);

    const orch = new CaptureOrchestrator({
      engine,
      mediaDevices: mockMediaDevices(),
    });

    await orch.acquire(CAPTURE_PROFILES['low-latency']);

    // acquire calls setMicPending
    expect(listener.mock.calls[0][0].micOperation.state).toBe('pending');

    await orch.publishTo(mockRoom());

    // publishTo calls setMicApplied(true)
    const appliedCall = listener.mock.calls.find(
      (call: unknown[]) => (call[0] as { isCapturing: boolean }).isCapturing === true,
    );
    expect(appliedCall).toBeDefined();

    engine.dispose();
  });

  it('reports failed on getUserMedia error', async () => {
    const devices: MediaDevicesPort = {
      getUserMedia: vi.fn().mockRejectedValue(new Error('NotAllowedError')),
    };
    const listener = vi.fn();
    engine.subscribe(listener);

    const orch = new CaptureOrchestrator({ engine, mediaDevices: devices });

    await expect(
      orch.acquire(CAPTURE_PROFILES['desktop-standard']),
    ).rejects.toThrow('NotAllowedError');

    // Should have pending then failed
    const failedCall = listener.mock.calls.find(
      (call: unknown[]) => (call[0] as { micOperation: { state: string } }).micOperation.state === 'failed',
    );
    expect(failedCall).toBeDefined();
    expect((failedCall![0] as { micOperation: { error: string } }).micOperation.error).toBe('NotAllowedError');

    expect(orch.state).toBe('idle');
    engine.dispose();
  });

  it('reports applied(false) on unpublish', async () => {
    const listener = vi.fn();
    engine.subscribe(listener);

    const orch = new CaptureOrchestrator({
      engine,
      mediaDevices: mockMediaDevices(),
    });
    const room = mockRoom();

    await orch.acquire(CAPTURE_PROFILES['low-latency']);
    await orch.publishTo(room);

    listener.mockClear();
    await orch.unpublish(room);

    // unpublish calls setMicApplied(false)
    const appliedCall = listener.mock.calls.find(
      (call: unknown[]) => (call[0] as { isCapturing: boolean }).isCapturing === false,
    );
    expect(appliedCall).toBeDefined();

    engine.dispose();
  });
});

// ─── Low-Latency Invariants ─────────────────────────────

describe('CaptureOrchestrator: low-latency bypass', () => {
  it('low-latency uses raw track (no AudioContext)', async () => {
    const ctxFactory = mockAudioContextFactory();

    const orch = new CaptureOrchestrator({
      mediaDevices: mockMediaDevices(),
      audioContextFactory: ctxFactory,
    });

    const session = await orch.acquire(CAPTURE_PROFILES['low-latency']);

    expect(session.usesProcessingPipeline).toBe(false);
    expect(session.audioContext).toBeNull();
    expect(session.noiseGateNode).toBeNull();
    expect(ctxFactory.create).not.toHaveBeenCalled();

    await orch.teardown();
  });

  it('low-latency constraints have all DSP off', async () => {
    const devices = mockMediaDevices();

    const orch = new CaptureOrchestrator({
      mediaDevices: devices,
    });

    await orch.acquire(CAPTURE_PROFILES['low-latency']);

    const constraints = (devices.getUserMedia as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(constraints.audio.echoCancellation).toBe(false);
    expect(constraints.audio.noiseSuppression).toBe(false);
    expect(constraints.audio.autoGainControl).toBe(false);

    await orch.teardown();
  });
});

// ─── Mobile-Web Conservative Invariants ─────────────────

describe('CaptureOrchestrator: mobile-web conservative path', () => {
  it('mobile-web uses raw track (no AudioContext)', async () => {
    const ctxFactory = mockAudioContextFactory();

    const orch = new CaptureOrchestrator({
      mediaDevices: mockMediaDevices(),
      audioContextFactory: ctxFactory,
    });

    const session = await orch.acquire(CAPTURE_PROFILES['mobile-web-standard']);

    expect(session.usesProcessingPipeline).toBe(false);
    expect(session.audioContext).toBeNull();
    expect(ctxFactory.create).not.toHaveBeenCalled();

    await orch.teardown();
  });

  it('mobile-web constraints have browser DSP on', async () => {
    const devices = mockMediaDevices();

    const orch = new CaptureOrchestrator({
      mediaDevices: devices,
    });

    await orch.acquire(CAPTURE_PROFILES['mobile-web-standard']);

    const constraints = (devices.getUserMedia as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(constraints.audio.echoCancellation).toBe(true);
    expect(constraints.audio.noiseSuppression).toBe(true);
    expect(constraints.audio.autoGainControl).toBe(true);

    await orch.teardown();
  });
});

// ─── Desktop Pipeline ───────────────────────────────────

describe('CaptureOrchestrator: desktop-standard pipeline', () => {
  it('desktop-standard creates AudioContext with 48kHz', async () => {
    const ctxFactory = mockAudioContextFactory();

    const orch = new CaptureOrchestrator({
      mediaDevices: mockMediaDevices(),
      audioContextFactory: ctxFactory,
    });

    const session = await orch.acquire(CAPTURE_PROFILES['desktop-standard']);

    expect(session.usesProcessingPipeline).toBe(true);
    expect(session.audioContext).not.toBeNull();
    expect(ctxFactory.create).toHaveBeenCalledWith({ sampleRate: 48_000 });

    await orch.teardown();
  });

  it('desktop-standard constraints have browser DSP off', async () => {
    const devices = mockMediaDevices();

    const orch = new CaptureOrchestrator({
      mediaDevices: devices,
      audioContextFactory: mockAudioContextFactory(),
    });

    await orch.acquire(CAPTURE_PROFILES['desktop-standard']);

    const constraints = (devices.getUserMedia as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(constraints.audio.echoCancellation).toBe(false);
    expect(constraints.audio.noiseSuppression).toBe(false);

    await orch.teardown();
  });
});

// ─── Mute / Unmute ──────────────────────────────────────

describe('CaptureOrchestrator: mute/unmute', () => {
  it('mute delegates to published track handle', async () => {
    const room = mockRoom();
    const orch = new CaptureOrchestrator({
      mediaDevices: mockMediaDevices(),
    });

    await orch.acquire(CAPTURE_PROFILES['low-latency']);
    await orch.publishTo(room);
    await orch.mute();

    // The mute fn comes from the room.publishTrack return value
    const handle = await (room.publishTrack as ReturnType<typeof vi.fn>).mock.results[0].value;
    expect(handle.mute).toHaveBeenCalled();

    await orch.unpublish(room);
  });

  it('unmute delegates to published track handle', async () => {
    const room = mockRoom();
    const orch = new CaptureOrchestrator({
      mediaDevices: mockMediaDevices(),
    });

    await orch.acquire(CAPTURE_PROFILES['low-latency']);
    await orch.publishTo(room);
    await orch.unmute();

    const handle = await (room.publishTrack as ReturnType<typeof vi.fn>).mock.results[0].value;
    expect(handle.unmute).toHaveBeenCalled();

    await orch.unpublish(room);
  });

  it('mute rejects when not published', async () => {
    const orch = new CaptureOrchestrator({
      mediaDevices: mockMediaDevices(),
    });

    await expect(orch.mute()).rejects.toThrow('no published track');
  });
});

// ─── Cleanup on Failure ─────────────────────────────────

describe('CaptureOrchestrator: cleanup on failure', () => {
  it('cleans up stream on getUserMedia failure', async () => {
    const devices: MediaDevicesPort = {
      getUserMedia: vi.fn().mockRejectedValue(new Error('NotAllowedError')),
    };

    const orch = new CaptureOrchestrator({ mediaDevices: devices });

    await expect(
      orch.acquire(CAPTURE_PROFILES['desktop-standard']),
    ).rejects.toThrow();

    expect(orch.state).toBe('idle');
    expect(orch.session).toBeNull();
  });

  it('unpublish tears down session even if room.unpublishTrack fails', async () => {
    const room: RoomPublishPort = {
      publishTrack: vi.fn().mockResolvedValue({
        mute: vi.fn(),
        unmute: vi.fn(),
        stop: vi.fn(),
      }),
      unpublishTrack: vi.fn().mockRejectedValue(new Error('room disconnected')),
    };

    const orch = new CaptureOrchestrator({
      mediaDevices: mockMediaDevices(),
    });

    await orch.acquire(CAPTURE_PROFILES['low-latency']);
    await orch.publishTo(room);

    // Should not throw despite unpublishTrack error
    await orch.unpublish(room);
    expect(orch.state).toBe('idle');
    expect(orch.session).toBeNull();
  });

  it('publish failure leaves session intact for retry', async () => {
    const room: RoomPublishPort = {
      publishTrack: vi.fn().mockRejectedValue(new Error('publish failed')),
      unpublishTrack: vi.fn(),
    };

    const orch = new CaptureOrchestrator({
      mediaDevices: mockMediaDevices(),
    });

    const session = await orch.acquire(CAPTURE_PROFILES['low-latency']);

    await expect(orch.publishTo(room)).rejects.toThrow('publish failed');

    // Session should still be active (not torn down)
    expect(orch.session).toBe(session);
    expect(session.isTornDown).toBe(false);
    expect(orch.state).toBe('acquiring');

    await orch.teardown();
  });
});
