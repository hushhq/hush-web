import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useVoiceAudioEngine } from '../adapters/useVoiceAudioEngine';

describe('useVoiceAudioEngine', () => {
  it('defaults to desktop-standard on desktop', () => {
    const { result } = renderHook(() => useVoiceAudioEngine());
    expect(result.current.mode).toBe('desktop-standard');
    expect(result.current.platform).toBe('desktop');
    expect(result.current.engine).toBeDefined();
    expect(result.current.engine.isDisposed).toBe(false);
  });

  it('mobile gets mobile-web-standard capture + mobile playback', () => {
    const { result } = renderHook(() =>
      useVoiceAudioEngine({ isMobileWebAudio: true }),
    );
    expect(result.current.mode).toBe('mobile-web-standard');
    expect(result.current.platform).toBe('mobile-web');
    expect(result.current.state.captureProfile.useRawTrack).toBe(true);
    expect(result.current.state.captureProfile.browserDsp).toBe(true);
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
      useVoiceAudioEngine(),
    );
    expect(result.current.publishOptions.disableAudioFilters).toBe(false);
    expect(result.current.publishOptions.useRawTrack).toBe(false);
  });

  it('state updates when engine operations are called', () => {
    const { result } = renderHook(() =>
      useVoiceAudioEngine(),
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
    let isMobileWebAudio = false;
    const { result, rerender } = renderHook(() =>
      useVoiceAudioEngine({ isMobileWebAudio }),
    );

    const firstEngine = result.current.engine;
    expect(result.current.mode).toBe('desktop-standard');

    isMobileWebAudio = true;
    rerender();

    expect(result.current.mode).toBe('mobile-web-standard');
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
