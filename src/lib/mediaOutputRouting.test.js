import { describe, expect, it } from 'vitest';
import { shouldUseVideoElementForAudioOutput } from './mediaOutputRouting';

describe('mediaOutputRouting', () => {
  it('prefers video elements for audio output on iPhone', () => {
    expect(
      shouldUseVideoElementForAudioOutput(
        'Mozilla/5.0 (iPhone; CPU iPhone OS 18_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.3 Mobile/15E148 Safari/604.1',
      ),
    ).toBe(true);
  });

  it('prefers video elements for audio output on iPad desktop-class safari', () => {
    expect(
      shouldUseVideoElementForAudioOutput(
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.3 Mobile/15E148 Safari/604.1',
      ),
    ).toBe(true);
  });

  it('keeps audio elements on non-iOS browsers', () => {
    expect(
      shouldUseVideoElementForAudioOutput(
        'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Mobile Safari/537.36',
      ),
    ).toBe(false);
  });
});
