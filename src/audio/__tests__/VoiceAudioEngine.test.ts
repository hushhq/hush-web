import { describe, it, expect, vi } from 'vitest';
import {
  VoiceAudioEngine,
  resolveMode,
  resolvePlatform,
  resolvePlaybackContext,
  derivePublishOptions,
} from '../core/VoiceAudioEngine';
import { CAPTURE_PROFILES } from '../core/VoiceAudioTypes';
import type { AudioRuntimeMode } from '../core/VoiceAudioTypes';

// ─── Mode Resolution ────────────────────────────────────

describe('resolveMode', () => {
  it('returns local-monitor when isLocalMonitor is true', () => {
    expect(resolveMode({ isLocalMonitor: true })).toBe('local-monitor');
  });

  it('returns mobile-web-standard when isMobileWebAudio is true', () => {
    expect(resolveMode({ isMobileWebAudio: true })).toBe('mobile-web-standard');
  });

  it('returns desktop-standard by default', () => {
    expect(resolveMode({})).toBe('desktop-standard');
  });

  it('local-monitor takes priority over mobile-web-standard', () => {
    expect(resolveMode({ isLocalMonitor: true, isMobileWebAudio: true })).toBe('local-monitor');
  });
});

// ─── Platform Resolution ────────────────────────────────

describe('resolvePlatform', () => {
  it('returns mobile-web when isMobileWebAudio is true', () => {
    expect(resolvePlatform({ isMobileWebAudio: true })).toBe('mobile-web');
  });

  it('returns desktop by default', () => {
    expect(resolvePlatform({})).toBe('desktop');
  });
});

// ─── Playback Context Resolution ────────────────────────

describe('resolvePlaybackContext', () => {
  it('local-monitor mode gets its own playback context', () => {
    expect(resolvePlaybackContext('local-monitor', 'desktop')).toBe('local-monitor');
  });

  it('desktop-standard gets desktop playback', () => {
    expect(resolvePlaybackContext('desktop-standard', 'desktop')).toBe('desktop');
  });

  it('mobile-web-standard gets mobile-web playback', () => {
    expect(resolvePlaybackContext('mobile-web-standard', 'mobile-web')).toBe('mobile-web');
  });
});

// ─── derivePublishOptions ───────────────────────────────

describe('derivePublishOptions', () => {
  it('desktop-standard: processed track, no browser DSP, filters enabled', () => {
    const opts = derivePublishOptions(CAPTURE_PROFILES['desktop-standard']);
    expect(opts.disableAudioFilters).toBe(false);
    expect(opts.useRawTrack).toBe(false);
    expect(opts.useBrowserDsp).toBe(false);
  });

  it('mobile-web-standard: raw track + browser DSP, filters enabled', () => {
    const opts = derivePublishOptions(CAPTURE_PROFILES['mobile-web-standard']);
    expect(opts.disableAudioFilters).toBe(false);
    expect(opts.useRawTrack).toBe(true);
    expect(opts.useBrowserDsp).toBe(true);
  });

  it('consistency: useRawTrack and hushProcessing are never both true', () => {
    const modes: AudioRuntimeMode[] = [
      'desktop-standard', 'mobile-web-standard', 'local-monitor',
    ];
    for (const mode of modes) {
      const profile = CAPTURE_PROFILES[mode];
      const opts = derivePublishOptions(profile);
      if (profile.hushProcessing) {
        expect(opts.useRawTrack).toBe(false);
      }
    }
  });
});

// ─── Engine ─────────────────────────────────────────────

describe('VoiceAudioEngine', () => {
  it('initializes with correct capture profile for mode', () => {
    const engine = new VoiceAudioEngine({ mode: 'desktop-standard', platform: 'desktop' });
    expect(engine.mode).toBe('desktop-standard');
    expect(engine.captureProfile.hushProcessing).toBe(true);
    expect(engine.captureProfile.browserDsp).toBe(false);
    engine.dispose();
  });

  it('initializes with platform-driven playback profile', () => {
    const engine = new VoiceAudioEngine({ mode: 'mobile-web-standard', platform: 'mobile-web' });
    expect(engine.mode).toBe('mobile-web-standard');
    expect(engine.platform).toBe('mobile-web');
    expect(engine.playbackProfile.useVideoElement).toBe(true);
    expect(engine.playbackProfile.outputSelection).toBe(false);
    engine.dispose();
  });

  it('publishOptions match derivePublishOptions', () => {
    const engine = new VoiceAudioEngine({ mode: 'mobile-web-standard', platform: 'mobile-web' });
    expect(engine.publishOptions.useBrowserDsp).toBe(true);
    expect(engine.publishOptions.useRawTrack).toBe(true);
    engine.dispose();
  });

  it('notifies listeners on mic state changes', () => {
    const engine = new VoiceAudioEngine({ mode: 'desktop-standard', platform: 'desktop' });
    const listener = vi.fn();
    engine.subscribe(listener);

    engine.setMicPending();
    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener.mock.calls[0][0].micOperation.state).toBe('pending');

    engine.setMicApplied(true);
    expect(listener).toHaveBeenCalledTimes(2);
    expect(listener.mock.calls[1][0].isCapturing).toBe(true);
    engine.dispose();
  });

  it('mic applied resets operation state to idle', () => {
    const engine = new VoiceAudioEngine({ mode: 'desktop-standard', platform: 'desktop' });
    engine.setMicPending();
    engine.setMicApplied(true);
    expect(engine.state.micOperation.state).toBe('idle');
    expect(engine.state.isCapturing).toBe(true);
    engine.dispose();
  });

  it('tracks deafen state', () => {
    const engine = new VoiceAudioEngine({ mode: 'desktop-standard', platform: 'desktop' });
    const listener = vi.fn();
    engine.subscribe(listener);

    engine.setDeafenPending();
    engine.setDeafenApplied(true);
    expect(listener.mock.calls[1][0].isDeafened).toBe(true);
    engine.dispose();
  });

  it('deafen applied resets operation state to idle', () => {
    const engine = new VoiceAudioEngine({ mode: 'desktop-standard', platform: 'desktop' });
    engine.setDeafenPending();
    engine.setDeafenApplied(true);
    expect(engine.state.deafenOperation.state).toBe('idle');
    expect(engine.state.isDeafened).toBe(true);
    engine.dispose();
  });

  it('tracks mic failure with error message', () => {
    const engine = new VoiceAudioEngine({ mode: 'desktop-standard', platform: 'desktop' });
    const listener = vi.fn();
    engine.subscribe(listener);

    engine.setMicFailed('Permission denied', false);
    const last = listener.mock.calls[listener.mock.calls.length - 1][0];
    expect(last.micOperation.state).toBe('failed');
    expect(last.micOperation.error).toBe('Permission denied');
    engine.dispose();
  });

  it('tracks deafen failure with error message', () => {
    const engine = new VoiceAudioEngine({ mode: 'desktop-standard', platform: 'desktop' });
    engine.setDeafenFailed('Playback error');
    expect(engine.state.deafenOperation.state).toBe('failed');
    expect(engine.state.deafenOperation.error).toBe('Playback error');
    engine.dispose();
  });

  it('unsubscribe stops notifications', () => {
    const engine = new VoiceAudioEngine({ mode: 'desktop-standard', platform: 'desktop' });
    const listener = vi.fn();
    const unsub = engine.subscribe(listener);

    engine.setMicPending();
    expect(listener).toHaveBeenCalledTimes(1);

    unsub();
    engine.setMicApplied(true);
    expect(listener).toHaveBeenCalledTimes(1);
    engine.dispose();
  });

  it('does not notify after dispose', () => {
    const engine = new VoiceAudioEngine({ mode: 'desktop-standard', platform: 'desktop' });
    const listener = vi.fn();
    engine.subscribe(listener);
    engine.dispose();
    engine.setMicPending();
    expect(listener).not.toHaveBeenCalled();
  });

  it('dispose is idempotent', () => {
    const engine = new VoiceAudioEngine({ mode: 'desktop-standard', platform: 'desktop' });
    engine.dispose();
    engine.dispose();
    expect(engine.isDisposed).toBe(true);
  });

  it('output capability derived from playback profile', () => {
    const desktop = new VoiceAudioEngine({ mode: 'desktop-standard', platform: 'desktop' });
    expect(desktop.state.outputCapability).toBe('supported');
    desktop.dispose();

    const mobile = new VoiceAudioEngine({ mode: 'mobile-web-standard', platform: 'mobile-web' });
    expect(mobile.state.outputCapability).toBe('unsupported');
    mobile.dispose();
  });

  it('state snapshot includes platform', () => {
    const engine = new VoiceAudioEngine({ mode: 'mobile-web-standard', platform: 'mobile-web' });
    expect(engine.state.platform).toBe('mobile-web');
    expect(engine.state.mode).toBe('mobile-web-standard');
    engine.dispose();
  });
});
