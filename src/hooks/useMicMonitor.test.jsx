import { renderHook, act, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { buildMicMonitorAudioConstraints, useMicMonitor } from './useMicMonitor';
import { createMicProcessingPipeline } from '../lib/micProcessing';

vi.mock('../lib/micProcessing', () => ({
  createMicProcessingPipeline: vi.fn(),
}));

function createFakeAudioTrack() {
  const track = new EventTarget();
  track.stop = vi.fn();
  return track;
}

function createFakeAudioContext() {
  const context = new EventTarget();
  context.state = 'running';
  return context;
}

describe('useMicMonitor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'info').mockImplementation(() => {});
    navigator.mediaDevices = {
      getUserMedia: vi.fn(),
    };
  });

  it('builds stable loopback constraints for mic monitoring', () => {
    expect(buildMicMonitorAudioConstraints('mic-1')).toEqual({
      echoCancellation: false,
      noiseSuppression: false,
      autoGainControl: false,
      channelCount: 1,
      deviceId: { exact: 'mic-1' },
    });
  });

  it('requests mic monitor media without browser dsp filters', async () => {
    const track = createFakeAudioTrack();
    const audioContext = createFakeAudioContext();
    const stream = {
      getAudioTracks: () => [track],
      getTracks: () => [track],
    };

    navigator.mediaDevices.getUserMedia.mockResolvedValue(stream);
    createMicProcessingPipeline.mockResolvedValue({
      audioContext,
      noiseGateNode: null,
      rawStream: stream,
      processedStream: { getAudioTracks: () => [track] },
      updateSettings: vi.fn(),
      cleanup: vi.fn(),
    });

    const { result } = renderHook(() => useMicMonitor());

    await act(async () => {
      await result.current.start({ deviceId: 'mic-1', settings: { noiseGateEnabled: true } });
    });

    expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalledWith({
      audio: {
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false,
        channelCount: 1,
        deviceId: { exact: 'mic-1' },
      },
    });
    expect(result.current.isTesting).toBe(true);
  });

  it('stops and surfaces an error when the browser ends the mic track', async () => {
    const track = createFakeAudioTrack();
    const audioContext = createFakeAudioContext();
    const cleanup = vi.fn();
    const stream = {
      getAudioTracks: () => [track],
      getTracks: () => [track],
    };

    navigator.mediaDevices.getUserMedia.mockResolvedValue(stream);
    createMicProcessingPipeline.mockResolvedValue({
      audioContext,
      noiseGateNode: null,
      rawStream: stream,
      processedStream: { getAudioTracks: () => [track] },
      updateSettings: vi.fn(),
      cleanup,
    });

    const { result } = renderHook(() => useMicMonitor());

    await act(async () => {
      await result.current.start({ deviceId: null, settings: {} });
    });

    act(() => {
      track.dispatchEvent(new Event('ended'));
    });

    await waitFor(() => {
      expect(result.current.isTesting).toBe(false);
    });
    expect(cleanup).toHaveBeenCalledTimes(1);
    expect(result.current.error?.message).toBe('Microphone input stopped unexpectedly.');
  });
});
