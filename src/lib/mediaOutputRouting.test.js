import { describe, expect, it } from 'vitest';
import {
  buildAudioOutputOptions,
  DEFAULT_AUDIO_OUTPUT_ID,
  getDefaultAudioOutputSelection,
  shouldAttachAudioToVideoElement,
} from './mediaOutputRouting';

const IPHONE_USER_AGENT = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.3 Mobile/15E148 Safari/604.1';
const DESKTOP_USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36';

describe('mediaOutputRouting', () => {
  it('exposes only system default plus real output labels', () => {
    expect(buildAudioOutputOptions({
      audioOutputDevices: [{ deviceId: 'usb-1', label: 'USB DAC' }],
    })).toEqual([
      { deviceId: DEFAULT_AUDIO_OUTPUT_ID, label: 'System default', routeKind: 'system' },
      { deviceId: 'usb-1', label: 'USB DAC', routeKind: 'device' },
    ]);
  });

  it('defaults both desktop and mobile to system default', () => {
    expect(getDefaultAudioOutputSelection({ userAgentOverride: DESKTOP_USER_AGENT })).toBe(DEFAULT_AUDIO_OUTPUT_ID);
    expect(getDefaultAudioOutputSelection({ userAgentOverride: IPHONE_USER_AGENT })).toBe(DEFAULT_AUDIO_OUTPUT_ID);
  });

  it('uses video-like routing as a mobile default-path workaround only for system default', () => {
    expect(shouldAttachAudioToVideoElement({
      selectedAudioOutputId: DEFAULT_AUDIO_OUTPUT_ID,
      userAgentOverride: IPHONE_USER_AGENT,
    })).toBe(true);

    expect(shouldAttachAudioToVideoElement({
      selectedAudioOutputId: 'bt-1',
      userAgentOverride: IPHONE_USER_AGENT,
    })).toBe(false);
  });
});
