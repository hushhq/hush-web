import { describe, it, expect } from 'vitest';
import { CAPTURE_PROFILES, PLAYBACK_PROFILES } from '../core/VoiceAudioTypes';
import type { AudioRuntimeMode, PlaybackContext } from '../core/VoiceAudioTypes';

const ALL_MODES: AudioRuntimeMode[] = [
  'desktop-standard',
  'mobile-web-standard',
  'local-monitor',
];

const ALL_PLAYBACK_CONTEXTS: PlaybackContext[] = [
  'desktop',
  'mobile-web',
  'local-monitor',
];

// ─── Capture Profiles ───────────────────────────────────

describe('CAPTURE_PROFILES', () => {
  it('has a profile for every runtime mode', () => {
    for (const mode of ALL_MODES) {
      expect(CAPTURE_PROFILES[mode]).toBeDefined();
      expect(CAPTURE_PROFILES[mode].mode).toBe(mode);
    }
  });

  it('desktop-standard: Hush processing ON, browser DSP OFF, no raw track', () => {
    const p = CAPTURE_PROFILES['desktop-standard'];
    expect(p.browserDsp).toBe(false);
    expect(p.hushProcessing).toBe(true);
    expect(p.useRawTrack).toBe(false);
    expect(p.echoCanConfigurable).toBe(true);
  });

  it('mobile-web-standard: browser DSP ON, Hush processing OFF, raw track', () => {
    const p = CAPTURE_PROFILES['mobile-web-standard'];
    expect(p.browserDsp).toBe(true);
    expect(p.hushProcessing).toBe(false);
    expect(p.useRawTrack).toBe(true);
    expect(p.localMonitoring).toBe(false);
  });

  it('local-monitor: Hush processing ON, browser DSP OFF, monitoring enabled', () => {
    const p = CAPTURE_PROFILES['local-monitor'];
    expect(p.browserDsp).toBe(false);
    expect(p.hushProcessing).toBe(true);
    expect(p.useRawTrack).toBe(false);
    expect(p.localMonitoring).toBe(true);
  });

  it('no profile enables both hushProcessing and useRawTrack', () => {
    for (const mode of ALL_MODES) {
      const p = CAPTURE_PROFILES[mode];
      if (p.hushProcessing) {
        expect(p.useRawTrack).toBe(false);
      }
    }
  });
});

// ─── Playback Profiles ──────────────────────────────────

describe('PLAYBACK_PROFILES', () => {
  it('has a profile for every playback context', () => {
    for (const ctx of ALL_PLAYBACK_CONTEXTS) {
      expect(PLAYBACK_PROFILES[ctx]).toBeDefined();
      expect(PLAYBACK_PROFILES[ctx].context).toBe(ctx);
    }
  });

  it('playback is keyed by platform, not by capture mode', () => {
    // Playback constraints are platform-driven.
    expect(Object.keys(PLAYBACK_PROFILES).sort()).toEqual(
      ['desktop', 'local-monitor', 'mobile-web'],
    );
  });

  it('mobile-web uses video element and disables output selection', () => {
    const p = PLAYBACK_PROFILES['mobile-web'];
    expect(p.outputSelection).toBe(false);
    expect(p.useVideoElement).toBe(true);
  });

  it('desktop supports output selection', () => {
    expect(PLAYBACK_PROFILES['desktop'].outputSelection).toBe(true);
  });

  it('local-monitor disables autoplay retry and output selection', () => {
    const p = PLAYBACK_PROFILES['local-monitor'];
    expect(p.autoplayRetry).toBe(false);
    expect(p.outputSelection).toBe(false);
  });
});
