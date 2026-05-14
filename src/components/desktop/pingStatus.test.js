import { describe, it, expect } from 'vitest';
import {
  classifyPing,
  formatPingLabel,
  PING_LOW_MAX_MS,
  PING_MID_MAX_MS,
  PING_STATUS,
} from './pingStatus.js';

describe('classifyPing', () => {
  it('returns unknown when the measurement is null or undefined', () => {
    expect(classifyPing(null)).toBe(PING_STATUS.UNKNOWN);
    expect(classifyPing(undefined)).toBe(PING_STATUS.UNKNOWN);
    expect(classifyPing(Number.NaN)).toBe(PING_STATUS.UNKNOWN);
  });

  it('returns down for Infinity or negative latencies (request failed / timed out)', () => {
    expect(classifyPing(Number.POSITIVE_INFINITY)).toBe(PING_STATUS.DOWN);
    expect(classifyPing(-1)).toBe(PING_STATUS.DOWN);
  });

  it('returns low for fast round trips up to the LOW band ceiling', () => {
    expect(classifyPing(1)).toBe(PING_STATUS.LOW);
    expect(classifyPing(50)).toBe(PING_STATUS.LOW);
    expect(classifyPing(PING_LOW_MAX_MS)).toBe(PING_STATUS.LOW);
  });

  it('returns mid for latencies between the LOW and MID ceilings', () => {
    expect(classifyPing(PING_LOW_MAX_MS + 1)).toBe(PING_STATUS.MID);
    expect(classifyPing(200)).toBe(PING_STATUS.MID);
    expect(classifyPing(PING_MID_MAX_MS)).toBe(PING_STATUS.MID);
  });

  it('returns high for slow but reachable round trips', () => {
    expect(classifyPing(PING_MID_MAX_MS + 1)).toBe(PING_STATUS.HIGH);
    expect(classifyPing(900)).toBe(PING_STATUS.HIGH);
  });
});

describe('formatPingLabel', () => {
  it('renders a tabular label for measured latency', () => {
    expect(formatPingLabel(42)).toBe('42 ms');
    expect(formatPingLabel(123.6)).toBe('124 ms');
  });

  it('renders a neutral placeholder when status is unknown or down', () => {
    expect(formatPingLabel(null)).toBe('-- ms');
    expect(formatPingLabel(Number.POSITIVE_INFINITY)).toBe('-- ms');
    expect(formatPingLabel(undefined)).toBe('-- ms');
  });

  it('honours an explicit status override that flips a measurement to "--"', () => {
    // Useful when the hook has cached a stale ms value but the latest
    // attempt failed — caller passes the new status to force the neutral
    // label without losing the underlying number.
    expect(formatPingLabel(42, PING_STATUS.DOWN)).toBe('-- ms');
    expect(formatPingLabel(42, PING_STATUS.UNKNOWN)).toBe('-- ms');
  });
});
