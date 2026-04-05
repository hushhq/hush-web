import { renderHook, act, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// jsdom does not provide AudioContext. Polyfill so useMicMonitor's
// typeof AudioContext guard passes and the buildCaptureGraph path runs.
if (typeof globalThis.AudioContext === 'undefined') {
  globalThis.AudioContext = class MockAudioContext {};
}

const { mockBuildCaptureGraph } = vi.hoisted(() => ({
  mockBuildCaptureGraph: vi.fn(),
}));

vi.mock('../audio/graph/CaptureGraphFactory', () => ({
  buildCaptureGraph: mockBuildCaptureGraph,
}));

vi.mock('../lib/micProcessing', () => ({
  normalizeMicFilterSettings: vi.fn((s) => ({
    noiseGateEnabled: s?.noiseGateEnabled ?? true,
    noiseGateThresholdDb: s?.noiseGateThresholdDb ?? -50,
  })),
  NOISE_GATE_WORKLET_URL: 'mock://noise-gate-worklet.js',
}));

import { buildMicMonitorAudioConstraints, useMicMonitor } from './useMicMonitor';

function createFakeAudioTrack() {
  const track = new EventTarget();
  track.stop = vi.fn();
  return track;
}

function createFakeAudioContext() {
  const context = new EventTarget();
  context.state = 'running';
  context.close = vi.fn().mockResolvedValue(undefined);
  return context;
}

function mockGraphResult(overrides = {}) {
  const track = createFakeAudioTrack();
  const audioContext = createFakeAudioContext();
  return {
    audioContext,
    sourceNode: { disconnect: vi.fn() },
    destinationNode: { disconnect: vi.fn() },
    noiseGateNode: null,
    processedTrack: track,
    monitorGainNode: null,
    applyFilterSettings: vi.fn(),
    ...overrides,
  };
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
    const stream = {
      getAudioTracks: () => [track],
      getTracks: () => [track],
    };

    navigator.mediaDevices.getUserMedia.mockResolvedValue(stream);
    mockBuildCaptureGraph.mockResolvedValue(mockGraphResult());

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
    expect(mockBuildCaptureGraph).toHaveBeenCalledWith(
      expect.objectContaining({ monitorOutput: true }),
    );
    expect(result.current.isTesting).toBe(true);
  });

  it('stops and surfaces an error when the browser ends the mic track', async () => {
    const track = createFakeAudioTrack();
    const stream = {
      getAudioTracks: () => [track],
      getTracks: () => [track],
    };

    navigator.mediaDevices.getUserMedia.mockResolvedValue(stream);
    mockBuildCaptureGraph.mockResolvedValue(mockGraphResult());

    const { result } = renderHook(() => useMicMonitor());

    await act(async () => {
      await result.current.start({ deviceId: null, settings: {} });
    });

    act(() => {
      track.dispatchEvent(new Event('ended'));
    });

    await waitFor(() => {
      expect(result.current.error).not.toBeNull();
    });
    expect(result.current.isTesting).toBe(false);
  });

  it('falls back to raw-stream session when AudioContext is unavailable', async () => {
    // Temporarily remove AudioContext to exercise the fallback path.
    const savedAudioContext = globalThis.AudioContext;
    delete globalThis.AudioContext;

    const track = createFakeAudioTrack();
    const stream = {
      getAudioTracks: () => [track],
      getTracks: () => [track],
    };
    navigator.mediaDevices.getUserMedia.mockResolvedValue(stream);

    try {
      const { result } = renderHook(() => useMicMonitor());

      await act(async () => {
        await result.current.start({ deviceId: null, settings: {} });
      });

      // Should start testing without calling buildCaptureGraph.
      expect(result.current.isTesting).toBe(true);
      expect(mockBuildCaptureGraph).not.toHaveBeenCalled();

      // Stop should clean up without error.
      await act(async () => {
        await result.current.stop();
      });
      expect(result.current.isTesting).toBe(false);
    } finally {
      globalThis.AudioContext = savedAudioContext;
    }
  });
});
