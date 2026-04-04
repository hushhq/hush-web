import { describe, it, expect, vi } from 'vitest';

// ─── Hoisted mocks ─────────────────────────────────────

const { MockLocalAudioTrack } = vi.hoisted(() => {
  let sidCounter = 0;
  class MockLocalAudioTrack {
    sid: string;
    _track: unknown;
    constructor(track: unknown) {
      this._track = track;
      this.sid = `mock-sid-${++sidCounter}`;
    }
    mute = vi.fn().mockResolvedValue(undefined);
    unmute = vi.fn().mockResolvedValue(undefined);
    stop = vi.fn();
  }
  return { MockLocalAudioTrack };
});

vi.mock('livekit-client', () => ({
  LocalAudioTrack: MockLocalAudioTrack,
  Track: { Source: { Microphone: 'microphone' } },
}));

import { LiveKitRoomAdapter } from '../adapters/LiveKitRoomAdapter';
import type { LocalParticipantPort, LocalTracksRef } from '../adapters/LiveKitRoomAdapter';

// ─── Mocks ──────────────────────────────────────────────

function mockTrack(): MediaStreamTrack {
  return {
    kind: 'audio',
    readyState: 'live',
    id: `raw-track-${Math.random().toString(36).slice(2)}`,
  } as unknown as MediaStreamTrack;
}

function mockLocalParticipant(): LocalParticipantPort {
  return {
    publishTrack: vi.fn().mockResolvedValue(undefined),
    unpublishTrack: vi.fn().mockResolvedValue(undefined),
  };
}

function mockTracksRef(): LocalTracksRef {
  return { current: new Map() };
}

// ─── Publish ────────────────────────────────────────────

describe('LiveKitRoomAdapter: publishTrack', () => {
  it('calls localParticipant.publishTrack with a LocalAudioTrack', async () => {
    const participant = mockLocalParticipant();
    const tracksRef = mockTracksRef();
    const scheduleUpdate = vi.fn();
    const adapter = new LiveKitRoomAdapter(participant, tracksRef, scheduleUpdate);

    const rawTrack = mockTrack();
    await adapter.publishTrack(rawTrack, { source: 'microphone' });

    expect(participant.publishTrack).toHaveBeenCalledTimes(1);
    const publishedTrack = (participant.publishTrack as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(publishedTrack).toBeInstanceOf(MockLocalAudioTrack);
  });

  it('updates localTracksRef after publish', async () => {
    const participant = mockLocalParticipant();
    const tracksRef = mockTracksRef();
    const scheduleUpdate = vi.fn();
    const adapter = new LiveKitRoomAdapter(participant, tracksRef, scheduleUpdate);

    await adapter.publishTrack(mockTrack(), { source: 'microphone' });

    expect(tracksRef.current.size).toBe(1);
    const entry = Array.from(tracksRef.current.values())[0];
    expect(entry.source).toBe('mic');
  });

  it('calls scheduleUpdate after publish', async () => {
    const participant = mockLocalParticipant();
    const scheduleUpdate = vi.fn();
    const adapter = new LiveKitRoomAdapter(participant, mockTracksRef(), scheduleUpdate);

    await adapter.publishTrack(mockTrack(), { source: 'microphone' });

    expect(scheduleUpdate).toHaveBeenCalledTimes(1);
  });

  it('returns a handle with mute, unmute, and stop', async () => {
    const participant = mockLocalParticipant();
    const adapter = new LiveKitRoomAdapter(participant, mockTracksRef(), vi.fn());

    const handle = await adapter.publishTrack(mockTrack(), { source: 'microphone' });

    expect(typeof handle.mute).toBe('function');
    expect(typeof handle.unmute).toBe('function');
    expect(typeof handle.stop).toBe('function');
  });
});

// ─── Unpublish ──────────────────────────────────────────

describe('LiveKitRoomAdapter: unpublishTrack', () => {
  it('calls localParticipant.unpublishTrack with the LocalAudioTrack', async () => {
    const participant = mockLocalParticipant();
    const tracksRef = mockTracksRef();
    const scheduleUpdate = vi.fn();
    const adapter = new LiveKitRoomAdapter(participant, tracksRef, scheduleUpdate);

    const handle = await adapter.publishTrack(mockTrack(), { source: 'microphone' });
    await adapter.unpublishTrack(handle);

    expect(participant.unpublishTrack).toHaveBeenCalledTimes(1);
    const unpublishedTrack = (participant.unpublishTrack as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(unpublishedTrack).toBeInstanceOf(MockLocalAudioTrack);
  });

  it('removes track from localTracksRef', async () => {
    const participant = mockLocalParticipant();
    const tracksRef = mockTracksRef();
    const adapter = new LiveKitRoomAdapter(participant, tracksRef, vi.fn());

    const handle = await adapter.publishTrack(mockTrack(), { source: 'microphone' });
    expect(tracksRef.current.size).toBe(1);

    await adapter.unpublishTrack(handle);
    expect(tracksRef.current.size).toBe(0);
  });

  it('calls scheduleUpdate after unpublish', async () => {
    const participant = mockLocalParticipant();
    const scheduleUpdate = vi.fn();
    const adapter = new LiveKitRoomAdapter(participant, mockTracksRef(), scheduleUpdate);

    const handle = await adapter.publishTrack(mockTrack(), { source: 'microphone' });
    scheduleUpdate.mockClear();

    await adapter.unpublishTrack(handle);
    expect(scheduleUpdate).toHaveBeenCalledTimes(1);
  });
});

// ─── Handle Delegation ──────────────────────────────────

describe('LiveKitRoomAdapter: handle delegation', () => {
  it('handle.mute delegates to LocalAudioTrack.mute', async () => {
    const participant = mockLocalParticipant();
    const adapter = new LiveKitRoomAdapter(participant, mockTracksRef(), vi.fn());
    const handle = await adapter.publishTrack(mockTrack(), { source: 'microphone' });

    await handle.mute();

    // Access the underlying MockLocalAudioTrack to verify mute was called
    const publishedTrack = (participant.publishTrack as ReturnType<typeof vi.fn>).mock.calls[0][0] as InstanceType<typeof MockLocalAudioTrack>;
    expect(publishedTrack.mute).toHaveBeenCalledTimes(1);
  });

  it('handle.unmute delegates to LocalAudioTrack.unmute', async () => {
    const participant = mockLocalParticipant();
    const adapter = new LiveKitRoomAdapter(participant, mockTracksRef(), vi.fn());
    const handle = await adapter.publishTrack(mockTrack(), { source: 'microphone' });

    await handle.unmute();

    const publishedTrack = (participant.publishTrack as ReturnType<typeof vi.fn>).mock.calls[0][0] as InstanceType<typeof MockLocalAudioTrack>;
    expect(publishedTrack.unmute).toHaveBeenCalledTimes(1);
  });

  it('handle.stop delegates to LocalAudioTrack.stop', async () => {
    const participant = mockLocalParticipant();
    const adapter = new LiveKitRoomAdapter(participant, mockTracksRef(), vi.fn());
    const handle = await adapter.publishTrack(mockTrack(), { source: 'microphone' });

    handle.stop();

    const publishedTrack = (participant.publishTrack as ReturnType<typeof vi.fn>).mock.calls[0][0] as InstanceType<typeof MockLocalAudioTrack>;
    expect(publishedTrack.stop).toHaveBeenCalledTimes(1);
  });
});
