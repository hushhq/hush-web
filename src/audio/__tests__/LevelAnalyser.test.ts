/**
 * LevelAnalyser tests.
 *
 * The analyser uses real AudioContext + AnalyserNode which are not
 * available in jsdom. These tests verify the math utilities and
 * the lifecycle state machine. Integration with real audio is
 * tested manually.
 */
import { describe, it, expect } from 'vitest';

// ─── Math utilities (extracted for testability) ─────────

function linearToDbfs(linear: number): number {
  if (linear <= 0) return -Infinity;
  return 20 * Math.log10(linear);
}

function normalizeDbfs(dbfs: number, floor: number): number {
  if (dbfs <= floor) return 0;
  if (dbfs >= 0) return 100;
  return ((dbfs - floor) / -floor) * 100;
}

describe('linearToDbfs', () => {
  it('returns 0 dBFS for full-scale (1.0)', () => {
    expect(linearToDbfs(1.0)).toBeCloseTo(0, 5);
  });

  it('returns -6 dBFS for half amplitude', () => {
    expect(linearToDbfs(0.5)).toBeCloseTo(-6.02, 1);
  });

  it('returns -20 dBFS for 0.1', () => {
    expect(linearToDbfs(0.1)).toBeCloseTo(-20, 1);
  });

  it('returns -Infinity for zero', () => {
    expect(linearToDbfs(0)).toBe(-Infinity);
  });

  it('returns -Infinity for negative', () => {
    expect(linearToDbfs(-1)).toBe(-Infinity);
  });
});

describe('normalizeDbfs', () => {
  const FLOOR = -60;

  it('returns 0 at floor', () => {
    expect(normalizeDbfs(-60, FLOOR)).toBe(0);
  });

  it('returns 0 below floor', () => {
    expect(normalizeDbfs(-80, FLOOR)).toBe(0);
  });

  it('returns 100 at 0 dBFS', () => {
    expect(normalizeDbfs(0, FLOOR)).toBe(100);
  });

  it('returns 50 at midpoint (-30 dBFS with -60 floor)', () => {
    expect(normalizeDbfs(-30, FLOOR)).toBeCloseTo(50, 1);
  });

  it('returns 100 for positive dBFS (clamp)', () => {
    expect(normalizeDbfs(3, FLOOR)).toBe(100);
  });

  it('returns -Infinity normalized to 0', () => {
    expect(normalizeDbfs(-Infinity, FLOOR)).toBe(0);
  });
});

describe('LevelAnalyser lifecycle', () => {
  it('exports from the module', async () => {
    const { LevelAnalyser } = await import('../analysis/LevelAnalyser');
    expect(LevelAnalyser).toBeDefined();
    const analyser = new LevelAnalyser();
    expect(analyser.isStopped).toBe(false);
    analyser.stop();
    expect(analyser.isStopped).toBe(true);
  });

  it('stop is idempotent', async () => {
    const { LevelAnalyser } = await import('../analysis/LevelAnalyser');
    const analyser = new LevelAnalyser();
    analyser.stop();
    analyser.stop(); // should not throw
    expect(analyser.isStopped).toBe(true);
  });
});
