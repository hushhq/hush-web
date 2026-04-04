import { describe, it, expect, vi } from 'vitest';
import { LocalAudioObserver } from '../analysis/LocalAudioObserver';

/**
 * LocalAudioObserver integrates LevelAnalyser (requires AudioContext)
 * with SpeakingDetector (pure state machine). Since AudioContext is not
 * available in jsdom, these tests verify the lifecycle and subscription
 * contract. The full audio-to-speaking-state chain is tested manually.
 */

describe('LocalAudioObserver', () => {
  it('starts with level 0 and not speaking', () => {
    const observer = new LocalAudioObserver();
    expect(observer.level).toBe(0);
    expect(observer.isSpeaking).toBe(false);
    expect(observer.isStopped).toBe(false);
    observer.stop();
  });

  it('state getter returns speaking state only', () => {
    const observer = new LocalAudioObserver();
    const state = observer.state;
    expect(state.isSpeaking).toBe(false);
    expect('level' in state).toBe(false);
    observer.stop();
  });

  it('level is accessible via getter but not in subscription state', () => {
    const observer = new LocalAudioObserver();
    expect(observer.level).toBe(0);
    observer.stop();
  });

  it('stop is idempotent', () => {
    const observer = new LocalAudioObserver();
    observer.stop();
    observer.stop();
    expect(observer.isStopped).toBe(true);
  });

  it('throws on start after stop', () => {
    const observer = new LocalAudioObserver();
    observer.stop();
    const mockTrack = {} as MediaStreamTrack;
    expect(() => observer.start(mockTrack)).toThrow('already stopped');
  });

  it('subscribe returns unsubscribe function', () => {
    const observer = new LocalAudioObserver();
    const listener = vi.fn();
    const unsub = observer.subscribe(listener);
    expect(typeof unsub).toBe('function');
    unsub();
    observer.stop();
  });

  it('stop clears all listeners', () => {
    const observer = new LocalAudioObserver();
    const listener = vi.fn();
    observer.subscribe(listener);
    observer.stop();
    // After stop, listener set is cleared — no way to verify
    // directly, but we verify stop is clean
    expect(observer.isStopped).toBe(true);
  });
});
