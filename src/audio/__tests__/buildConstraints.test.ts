import { describe, it, expect } from 'vitest';
import { buildConstraints } from '../capture/buildConstraints';
import { CAPTURE_PROFILES } from '../core/VoiceAudioTypes';

describe('buildConstraints', () => {
  it('desktop-standard: all browser DSP off (Hush owns processing)', () => {
    const c = buildConstraints(CAPTURE_PROFILES['desktop-standard']);
    expect(c.echoCancellation).toBe(false);
    expect(c.noiseSuppression).toBe(false);
    expect(c.autoGainControl).toBe(false);
    expect(c.channelCount).toBe(1);
  });

  it('mobile-web-standard: browser DSP on (NS + AGC + EC)', () => {
    const c = buildConstraints(CAPTURE_PROFILES['mobile-web-standard']);
    expect(c.echoCancellation).toBe(true);
    expect(c.noiseSuppression).toBe(true);
    expect(c.autoGainControl).toBe(true);
  });

  it('local-monitor: browser DSP off (same as desktop)', () => {
    const c = buildConstraints(CAPTURE_PROFILES['local-monitor']);
    expect(c.echoCancellation).toBe(false);
    expect(c.noiseSuppression).toBe(false);
    expect(c.autoGainControl).toBe(false);
  });

  it('includes deviceId when provided', () => {
    const c = buildConstraints(CAPTURE_PROFILES['desktop-standard'], 'mic-123');
    expect(c.deviceId).toEqual({ exact: 'mic-123' });
  });

  it('omits deviceId when null', () => {
    const c = buildConstraints(CAPTURE_PROFILES['desktop-standard'], null);
    expect(c.deviceId).toBeUndefined();
  });

  it('omits deviceId when undefined', () => {
    const c = buildConstraints(CAPTURE_PROFILES['desktop-standard']);
    expect(c.deviceId).toBeUndefined();
  });

  it('channelCount is always 1', () => {
    for (const profile of Object.values(CAPTURE_PROFILES)) {
      expect(buildConstraints(profile).channelCount).toBe(1);
    }
  });
});
