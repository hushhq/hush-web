import { describe, it, expect, vi } from 'vitest';
import { SpeakingDetector } from '../analysis/SpeakingDetector';

describe('SpeakingDetector', () => {
  it('starts not speaking', () => {
    const detector = new SpeakingDetector();
    expect(detector.isSpeaking).toBe(false);
  });

  it('transitions to speaking when signal crosses above threshold', () => {
    const detector = new SpeakingDetector({ thresholdDbfs: -40 });
    const listener = vi.fn();
    detector.subscribe(listener);

    detector.pushSample(-30, 100); // above -40
    expect(detector.isSpeaking).toBe(true);
    expect(listener).toHaveBeenCalledWith(true);
  });

  it('stays speaking during hold period after signal drops', () => {
    const detector = new SpeakingDetector({ thresholdDbfs: -40, holdMs: 200 });

    detector.pushSample(-30, 100); // start speaking
    expect(detector.isSpeaking).toBe(true);

    detector.pushSample(-50, 200); // below threshold, 100ms elapsed
    expect(detector.isSpeaking).toBe(true); // still in hold
  });

  it('transitions to not speaking after hold expires', () => {
    const detector = new SpeakingDetector({ thresholdDbfs: -40, holdMs: 200 });
    const listener = vi.fn();
    detector.subscribe(listener);

    detector.pushSample(-30, 100); // start speaking
    detector.pushSample(-50, 200); // below, 100ms elapsed → 100ms hold left
    detector.pushSample(-50, 400); // below, 200ms elapsed → hold expired

    expect(detector.isSpeaking).toBe(false);
    expect(listener).toHaveBeenCalledWith(false);
  });

  it('cancels hold when signal recovers above threshold', () => {
    const detector = new SpeakingDetector({ thresholdDbfs: -40, holdMs: 200 });

    detector.pushSample(-30, 100); // speaking
    detector.pushSample(-50, 200); // below, hold starts
    detector.pushSample(-30, 250); // recovered above threshold

    expect(detector.isSpeaking).toBe(true); // hold cancelled

    // Now let hold expire from this new point
    detector.pushSample(-50, 350); // below, 100ms → hold = 100ms left
    detector.pushSample(-50, 600); // 250ms elapsed → hold expired

    expect(detector.isSpeaking).toBe(false);
  });

  it('does not notify when state does not change', () => {
    const detector = new SpeakingDetector({ thresholdDbfs: -40 });
    const listener = vi.fn();
    detector.subscribe(listener);

    // Multiple samples above threshold — only one notification
    detector.pushSample(-30, 100);
    detector.pushSample(-20, 200);
    detector.pushSample(-25, 300);

    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith(true);
  });

  it('handles silence (-Infinity) correctly', () => {
    const detector = new SpeakingDetector({ thresholdDbfs: -40, holdMs: 100 });

    detector.pushSample(-30, 100); // speaking
    detector.pushSample(-Infinity, 200); // silence
    detector.pushSample(-Infinity, 400); // hold expired

    expect(detector.isSpeaking).toBe(false);
  });

  it('handles signal exactly at threshold', () => {
    const detector = new SpeakingDetector({ thresholdDbfs: -40 });

    // At threshold = not above threshold → not speaking
    detector.pushSample(-40, 100);
    expect(detector.isSpeaking).toBe(false);

    // Just above threshold → speaking
    detector.pushSample(-39.9, 200);
    expect(detector.isSpeaking).toBe(true);
  });

  it('unsubscribe stops notifications', () => {
    const detector = new SpeakingDetector({ thresholdDbfs: -40 });
    const listener = vi.fn();
    const unsub = detector.subscribe(listener);

    detector.pushSample(-30, 100);
    expect(listener).toHaveBeenCalledTimes(1);

    unsub();
    detector.pushSample(-50, 500); // would transition to not-speaking
    expect(listener).toHaveBeenCalledTimes(1); // not called again
  });

  it('dispose prevents further state changes', () => {
    const detector = new SpeakingDetector({ thresholdDbfs: -40 });
    detector.pushSample(-30, 100);
    expect(detector.isSpeaking).toBe(true);

    detector.dispose();
    detector.pushSample(-50, 500); // would normally transition
    expect(detector.isSpeaking).toBe(true); // frozen at last state
    expect(detector.isDisposed).toBe(true);
  });

  it('dispose is idempotent', () => {
    const detector = new SpeakingDetector();
    detector.dispose();
    detector.dispose();
    expect(detector.isDisposed).toBe(true);
  });
});
