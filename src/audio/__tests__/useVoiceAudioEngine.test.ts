import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useVoiceAudioEngine } from '../adapters/useVoiceAudioEngine';

describe('useVoiceAudioEngine', () => {
  it('creates engine with resolved mode and platform from flags', () => {
    const { result } = renderHook(() =>
      useVoiceAudioEngine({ isLowLatency: true }),
    );
    expect(result.current.mode).toBe('low-latency');
    expect(result.current.platform).toBe('desktop');
    expect(result.current.engine).toBeDefined();
    expect(result.current.engine.isDisposed).toBe(false);
  });

  it('defaults to desktop-standard on desktop', () => {
    const { result } = renderHook(() => useVoiceAudioEngine());
    expect(result.current.mode).toBe('desktop-standard');
    expect(result.current.platform).toBe('desktop');
  });

  it('mobile low-latency gets low-latency capture + mobile playback', () => {
    const { result } = renderHook(() =>
      useVoiceAudioEngine({ isLowLatency: true, isMobileWebAudio: true }),
    );
    expect(result.current.mode).toBe('low-latency');
    expect(result.current.platform).toBe('mobile-web');
    expect(result.current.state.captureProfile.useRawTrack).toBe(true);
    expect(result.current.state.captureProfile.browserDsp).toBe(false);
    expect(result.current.state.playbackProfile.useVideoElement).toBe(true);
    expect(result.current.state.playbackProfile.outputSelection).toBe(false);
  });

  it('exposes typed state snapshot', () => {
    const { result } = renderHook(() =>
      useVoiceAudioEngine({ isMobileWebAudio: true }),
    );
    const { state } = result.current;
    expect(state.mode).toBe('mobile-web-standard');
    expect(state.platform).toBe('mobile-web');
    expect(state.captureProfile.browserDsp).toBe(true);
    expect(state.playbackProfile.useVideoElement).toBe(true);
    expect(state.micOperation.state).toBe('idle');
  });

  it('exposes publishOptions derived from capture profile', () => {
    const { result } = renderHook(() =>
      useVoiceAudioEngine({ isLowLatency: true }),
    );
    expect(result.current.publishOptions.disableAudioFilters).toBe(true);
    expect(result.current.publishOptions.useRawTrack).toBe(true);
  });

  it('state updates when engine operations are called', () => {
    const { result } = renderHook(() =>
      useVoiceAudioEngine({ isLowLatency: false }),
    );

    act(() => {
      result.current.engine.setMicPending();
    });

    expect(result.current.state.micOperation.state).toBe('pending');

    act(() => {
      result.current.engine.setMicApplied(true);
    });

    expect(result.current.state.micOperation.state).toBe('idle');
    expect(result.current.state.isCapturing).toBe(true);
  });

  it('disposes engine on unmount', () => {
    const { result, unmount } = renderHook(() =>
      useVoiceAudioEngine(),
    );
    const engine = result.current.engine;
    expect(engine.isDisposed).toBe(false);

    unmount();
    expect(engine.isDisposed).toBe(true);
  });

  it('creates new engine when mode changes', () => {
    let isLowLatency = false;
    const { result, rerender } = renderHook(() =>
      useVoiceAudioEngine({ isLowLatency }),
    );

    const firstEngine = result.current.engine;
    expect(result.current.mode).toBe('desktop-standard');

    isLowLatency = true;
    rerender();

    expect(result.current.mode).toBe('low-latency');
    expect(result.current.engine).not.toBe(firstEngine);
  });

  it('creates new engine when platform changes', () => {
    let isMobileWebAudio = false;
    const { result, rerender } = renderHook(() =>
      useVoiceAudioEngine({ isMobileWebAudio }),
    );

    const firstEngine = result.current.engine;
    expect(result.current.platform).toBe('desktop');

    isMobileWebAudio = true;
    rerender();

    expect(result.current.platform).toBe('mobile-web');
    expect(result.current.engine).not.toBe(firstEngine);
  });
});
