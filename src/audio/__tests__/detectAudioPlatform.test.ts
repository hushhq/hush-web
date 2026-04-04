import { describe, it, expect } from 'vitest';
import { isMobileWebAudio } from '../core/detectAudioPlatform';

describe('isMobileWebAudio', () => {
  it('returns true for iPhone Safari', () => {
    expect(isMobileWebAudio(
      'Mozilla/5.0 (iPhone; CPU iPhone OS 18_3 like Mac OS X) AppleWebKit/605.1.15',
    )).toBe(true);
  });

  it('returns true for iPad Safari', () => {
    expect(isMobileWebAudio(
      'Mozilla/5.0 (iPad; CPU OS 18_3 like Mac OS X) AppleWebKit/605.1.15',
    )).toBe(true);
  });

  it('returns true for iPadOS desktop-mode (Macintosh + Mobile)', () => {
    expect(isMobileWebAudio(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.3 Mobile/15E148 Safari/604.1',
    )).toBe(true);
  });

  it('returns true for Android Chrome', () => {
    expect(isMobileWebAudio(
      'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 Chrome/131.0',
    )).toBe(true);
  });

  it('returns false for macOS Chrome', () => {
    expect(isMobileWebAudio(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/131.0',
    )).toBe(false);
  });

  it('returns false for Windows Firefox', () => {
    expect(isMobileWebAudio(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0',
    )).toBe(false);
  });

  it('returns false for Linux Chrome', () => {
    expect(isMobileWebAudio(
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/131.0',
    )).toBe(false);
  });

  it('defaults to navigator.userAgent when no override provided', () => {
    expect(isMobileWebAudio()).toBe(false);
  });
});
