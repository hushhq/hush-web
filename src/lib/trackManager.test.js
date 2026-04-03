import { beforeEach, describe, expect, it, vi } from 'vitest';

const {
  MockLocalAudioTrack,
  mockCreateMicProcessingPipeline,
} = vi.hoisted(() => {
  const mockCreateMicProcessingPipeline = vi.fn();

  class MockLocalAudioTrack {
    constructor(track) {
      this.mediaStreamTrack = track;
      this.sid = 'local-audio-track';
    }
  }

  return {
    MockLocalAudioTrack,
    mockCreateMicProcessingPipeline,
  };
});

vi.mock('livekit-client', () => ({
  RoomEvent: {},
  Track: {
    Source: {
      Microphone: 'microphone',
      ScreenShare: 'screen_share',
      ScreenShareAudio: 'screen_share_audio',
    },
    Kind: {
      Video: 'video',
    },
  },
  LocalAudioTrack: MockLocalAudioTrack,
  LocalVideoTrack: class {},
}));

vi.mock('./micProcessing', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    createMicProcessingPipeline: mockCreateMicProcessingPipeline,
  };
});

import { MEDIA_SOURCES } from '../utils/constants';
import { buildPublishedMicAudioConstraints, publishMic } from './trackManager';

describe('trackManager mic publishing', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    navigator.mediaDevices = {
      getUserMedia: vi.fn(),
    };
  });

  it('builds published mic constraints without browser dsp filters', () => {
    expect(buildPublishedMicAudioConstraints('mic-1')).toEqual({
      echoCancellation: true,
      noiseSuppression: false,
      autoGainControl: false,
      channelCount: 1,
      deviceId: { exact: 'mic-1' },
    });
  });

  it('publishes the microphone using hush-owned processing only', async () => {
    const sourceTrack = { id: 'source-track' };
    const processedTrack = { id: 'processed-track' };
    const stream = { getAudioTracks: () => [sourceTrack] };
    const processedStream = { getAudioTracks: () => [processedTrack] };
    const room = {
      localParticipant: {
        publishTrack: vi.fn().mockResolvedValue(undefined),
      },
    };
    const refs = {
      localTracksRef: { current: new Map() },
      audioContextRef: { current: null },
      noiseGateNodeRef: { current: null },
      rawMicStreamRef: { current: null },
      cleanupMicPipeline: vi.fn(),
    };

    navigator.mediaDevices.getUserMedia.mockResolvedValue(stream);
    mockCreateMicProcessingPipeline.mockResolvedValue({
      rawStream: stream,
      audioContext: { state: 'running' },
      noiseGateNode: null,
      processedStream,
    });

    await publishMic(room, refs, 'mic-1');

    expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalledWith({
      audio: {
        echoCancellation: true,
        noiseSuppression: false,
        autoGainControl: false,
        channelCount: 1,
        deviceId: { exact: 'mic-1' },
      },
    });
    expect(room.localParticipant.publishTrack).toHaveBeenCalledWith(
      expect.objectContaining({ mediaStreamTrack: processedTrack }),
      { source: 'microphone' },
    );
    expect(refs.localTracksRef.current.get('local-audio-track')).toEqual({
      track: expect.objectContaining({ mediaStreamTrack: processedTrack }),
      source: MEDIA_SOURCES.MIC,
    });
  });

  it('can publish the raw microphone track without the processing graph', async () => {
    const sourceTrack = { id: 'source-track' };
    const stream = { getAudioTracks: () => [sourceTrack] };
    const room = {
      localParticipant: {
        publishTrack: vi.fn().mockResolvedValue(undefined),
      },
    };
    const refs = {
      localTracksRef: { current: new Map() },
      audioContextRef: { current: { state: 'running' } },
      noiseGateNodeRef: { current: {} },
      rawMicStreamRef: { current: null },
      cleanupMicPipeline: vi.fn(),
    };

    navigator.mediaDevices.getUserMedia.mockResolvedValue(stream);

    await publishMic(room, refs, 'mic-1', { useRawTrack: true });

    expect(mockCreateMicProcessingPipeline).not.toHaveBeenCalled();
    expect(room.localParticipant.publishTrack).toHaveBeenCalledWith(
      expect.objectContaining({ mediaStreamTrack: sourceTrack }),
      { source: 'microphone' },
    );
    expect(refs.audioContextRef.current).toBeNull();
    expect(refs.noiseGateNodeRef.current).toBeNull();
  });
});
