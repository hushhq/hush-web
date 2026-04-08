import { describe, it, expect } from 'vitest';

/**
 * measureCaptureLevel uses real AudioContext + AnalyserNode which are
 * not available in jsdom. These tests verify the math utilities only.
 * Real capture-level measurement is a manual diagnostic, not an
 * automated test target.
 */

// Extract the dBFS conversion logic for unit testing.
function linearToDbfs(linear: number): number {
  if (linear <= 0) return -Infinity;
  return 20 * Math.log10(linear);
}

describe('linearToDbfs', () => {
  it('returns 0 dBFS for full-scale signal (1.0)', () => {
    expect(linearToDbfs(1.0)).toBeCloseTo(0, 5);
  });

  it('returns -6 dBFS for half amplitude (0.5)', () => {
    expect(linearToDbfs(0.5)).toBeCloseTo(-6.02, 1);
  });

  it('returns -20 dBFS for 0.1 amplitude', () => {
    expect(linearToDbfs(0.1)).toBeCloseTo(-20, 1);
  });

  it('returns -40 dBFS for 0.01 amplitude', () => {
    expect(linearToDbfs(0.01)).toBeCloseTo(-40, 1);
  });

  it('returns -Infinity for zero amplitude', () => {
    expect(linearToDbfs(0)).toBe(-Infinity);
  });

  it('returns -Infinity for negative amplitude', () => {
    expect(linearToDbfs(-1)).toBe(-Infinity);
  });
});
