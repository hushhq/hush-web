/**
 * Tests for the per-channel MLS mutex helper.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import {
  withChannelMLSMutex,
  textChannelKey,
  voiceChannelKey,
  guildMetadataKey,
  _hasPendingChannelMLSMutex,
  _resetChannelMLSMutexForTests,
} from './channelMLSMutex';

beforeEach(() => _resetChannelMLSMutexForTests());

function deferred() {
  let resolve, reject;
  const promise = new Promise((res, rej) => { resolve = res; reject = rej; });
  return { promise, resolve, reject };
}

describe('withChannelMLSMutex', () => {
  it('serialises operations on the same key', async () => {
    const order = [];
    const d1 = deferred();
    const d2 = deferred();

    const r1 = withChannelMLSMutex('text:c1', async () => {
      order.push('1-start');
      await d1.promise;
      order.push('1-end');
      return 'a';
    });
    const r2 = withChannelMLSMutex('text:c1', async () => {
      order.push('2-start');
      await d2.promise;
      order.push('2-end');
      return 'b';
    });

    // r2 must NOT have started yet — it's behind r1 in the queue.
    await Promise.resolve();
    await Promise.resolve();
    expect(order).toEqual(['1-start']);

    d1.resolve();
    expect(await r1).toBe('a');
    // Now r2 should run. Flush enough microtasks for the queue to advance.
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(order).toEqual(['1-start', '1-end', '2-start']);
    d2.resolve();
    expect(await r2).toBe('b');
    expect(order).toEqual(['1-start', '1-end', '2-start', '2-end']);
  });

  it('runs different keys in parallel', async () => {
    const order = [];
    const d1 = deferred();
    const d2 = deferred();

    const r1 = withChannelMLSMutex('text:a', async () => {
      order.push('a-start');
      await d1.promise;
      order.push('a-end');
    });
    const r2 = withChannelMLSMutex('text:b', async () => {
      order.push('b-start');
      await d2.promise;
      order.push('b-end');
    });

    // Both should have started.
    await Promise.resolve();
    await Promise.resolve();
    expect(order).toContain('a-start');
    expect(order).toContain('b-start');

    d1.resolve();
    d2.resolve();
    await r1;
    await r2;
  });

  it('continues the queue after a callback rejects', async () => {
    const r1 = withChannelMLSMutex('text:c1', async () => { throw new Error('boom'); });
    await expect(r1).rejects.toThrow('boom');

    const r2 = withChannelMLSMutex('text:c1', async () => 'ok');
    expect(await r2).toBe('ok');
  });

  it('removes the queue entry after the chain drains', async () => {
    expect(_hasPendingChannelMLSMutex('text:c1')).toBe(0);
    await withChannelMLSMutex('text:c1', async () => 1);
    // Allow microtasks for cleanup tail.
    await Promise.resolve();
    await Promise.resolve();
    expect(_hasPendingChannelMLSMutex('text:c1')).toBe(0);
  });

  it('key helpers produce distinct namespaces', () => {
    const id = 'abc-123';
    expect(textChannelKey(id)).toBe('text:abc-123');
    expect(voiceChannelKey(id)).toBe('voice:abc-123');
    expect(guildMetadataKey(id)).toBe('guild-meta:abc-123');
    expect(textChannelKey(id)).not.toBe(voiceChannelKey(id));
  });

  it('survives the documented decrypt-retry pattern (decrypt → catchup → decrypt) without deadlock', async () => {
    // Caller acquires mutex once and runs three sequential operations.
    const order = [];
    const result = await withChannelMLSMutex('text:c1', async () => {
      order.push('decrypt-1');
      // simulate decrypt fail then catchup then retry — all inside the same mutex
      order.push('catchup');
      order.push('decrypt-2');
      return 'recovered';
    });
    expect(result).toBe('recovered');
    expect(order).toEqual(['decrypt-1', 'catchup', 'decrypt-2']);
  });
});
