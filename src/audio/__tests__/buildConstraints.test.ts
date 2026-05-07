import { describe, it, expect } from 'vitest';
import { buildConstraints } from '../capture/buildConstraints';
import { CAPTURE_PROFILES } from '../core/VoiceAudioTypes';

describe('buildConstraints', () => {
  it('desktop-standard: browser DSP on (temporary, until v2 DSP ships)', () => {
    const c = buildConstraints(CAPTURE_PROFILES['desktop-standard']);
    expect(c.echoCancellation).toBe(true);
    expect(c.noiseSuppression).toBe(true);
    expect(c.autoGainControl).toBe(true);
    expect(c.channelCount).toEqual({ exact: 1 });
  });

  it('mobile-web-standard: browser DSP on (NS + AGC + EC)', () => {
    const c = buildConstraints(CAPTURE_PROFILES['mobile-web-standard']);
    expect(c.echoCancellation).toBe(true);
    expect(c.noiseSuppression).toBe(true);
    expect(c.autoGainControl).toBe(true);
  });

  it('local-monitor: keeps NS + AGC off, but EC stays on', () => {
    // When advanced filters return, the local-monitor profile turns
    // browser NS + AGC off so the user can hear the raw / Hush-
    // processed signal. EC stays on regardless to prevent feedback.
    const c = buildConstraints(CAPTURE_PROFILES['local-monitor']);
    expect(c.echoCancellation).toBe(true);
    expect(c.noiseSuppression).toBe(false);
    expect(c.autoGainControl).toBe(false);
  });

  it('echoCancellation is always on regardless of profile', () => {
    for (const profile of Object.values(CAPTURE_PROFILES)) {
      expect(buildConstraints(profile).echoCancellation).toBe(true);
    }
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

  it('channelCount is always forced mono ({ exact: 1 })', () => {
    for (const profile of Object.values(CAPTURE_PROFILES)) {
      expect(buildConstraints(profile).channelCount).toEqual({ exact: 1 });
    }
  });
});
