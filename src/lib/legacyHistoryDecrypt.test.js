/**
 * Tests for the link-time legacy pre-decrypt orchestrator.
 *
 * The orchestrator is exercised purely through dependency injection so the
 * tests don't need a real WASM module or IndexedDB — both are stubbed.
 */

import { describe, it, expect, vi } from 'vitest';
import { preDecryptLegacyHistory } from './legacyHistoryDecrypt';

function bytesToBase64(bytes) {
  let bin = '';
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}

function makeFakeMessage(id, senderId, plaintext, isoTs) {
  // The ciphertext payload is opaque here — the stub hushCrypto resolves it
  // through an in-memory map keyed by the base64 string.
  return {
    id,
    senderId,
    timestamp: isoTs,
    ciphertext: bytesToBase64(new TextEncoder().encode(`ct:${id}`)),
    _plaintext: plaintext,
  };
}

function makeStubs({
  guilds = [],
  channelsByGuild = {},
  messagesByChannel = {},
  failOnChannel = null,
  failOnGuildList = false,
  decryptOverride = null,
} = {}) {
  const localPlaintextStore = new Map();
  const activeDb = { id: 'active', close: vi.fn() };

  const mlsStore = {
    openStore: vi.fn().mockResolvedValue(activeDb),
    getCredential: vi.fn().mockResolvedValue({
      signingPrivateKey: new Uint8Array([1]),
      signingPublicKey: new Uint8Array([2]),
      credentialBytes: new Uint8Array([3]),
    }),
    getLocalPlaintext: vi.fn(async (_db, id) => {
      return localPlaintextStore.get(id) ?? null;
    }),
    setLocalPlaintext: vi.fn(async (_db, id, payload) => {
      localPlaintextStore.set(id, { ...payload });
    }),
    withReadWriteHistoryScope: vi.fn(async (_db, fn) => fn(_db)),
  };

  const api = {
    getMyGuilds: vi.fn(async () => {
      if (failOnGuildList) throw new Error('network down');
      return guilds;
    }),
    getGuildChannels: vi.fn(async (_token, guildId) => {
      return channelsByGuild[guildId] ?? [];
    }),
    getChannelMessages: vi.fn(async (_token, _serverId, channelId) => {
      if (failOnChannel === channelId) throw new Error('channel fetch fail');
      return messagesByChannel[channelId] ?? [];
    }),
  };

  const hushCrypto = {
    processMessage: vi.fn(async (_groupIdBytes, _sigPriv, _sigPub, _credBytes, ct) => {
      if (decryptOverride) return decryptOverride(ct);
      const ctText = new TextDecoder().decode(ct);
      const id = ctText.startsWith('ct:') ? ctText.slice(3) : null;
      const msg = id
        ? Object.values(messagesByChannel).flat().find((m) => m.id === id)
        : null;
      if (!msg) throw new Error('Group not found');
      return {
        type: 'application',
        plaintext: new TextEncoder().encode(msg._plaintext),
        epoch: 1,
      };
    }),
  };

  return { mlsStore, api, hushCrypto, localPlaintextStore, activeDb };
}

describe('preDecryptLegacyHistory', () => {
  it('returns an empty summary when required arguments are missing', async () => {
    const stubs = makeStubs();
    const summary = await preDecryptLegacyHistory({
      historyDb: null,
      activeUserId: 'u',
      deviceId: 'd',
      token: 't',
      _deps: stubs,
    });
    expect(summary).toEqual({ channels: 0, processed: 0, decrypted: 0, failed: 0 });
    expect(stubs.api.getMyGuilds).not.toHaveBeenCalled();
  });

  it('returns an empty summary when the history DB has no credential', async () => {
    const stubs = makeStubs();
    stubs.mlsStore.getCredential = vi.fn().mockResolvedValue(null);
    const summary = await preDecryptLegacyHistory({
      historyDb: { id: 'history' },
      activeUserId: 'u',
      deviceId: 'd',
      token: 't',
      _deps: stubs,
    });
    expect(summary).toEqual({ channels: 0, processed: 0, decrypted: 0, failed: 0 });
    expect(stubs.api.getMyGuilds).not.toHaveBeenCalled();
  });

  it('decrypts every text-channel message and writes plaintext + senderId to the active cache', async () => {
    const messages = [
      makeFakeMessage('m1', 'alice', 'hi alice', '2026-04-01T10:00:00Z'),
      makeFakeMessage('m2', 'bob',   'hi bob',   '2026-04-01T11:00:00Z'),
    ];
    const stubs = makeStubs({
      guilds: [{ id: 'guild-1' }],
      channelsByGuild: {
        'guild-1': [
          { id: 'chan-text', type: 'text' },
          { id: 'chan-voice', type: 'voice' },
        ],
      },
      messagesByChannel: { 'chan-text': messages },
    });

    const summary = await preDecryptLegacyHistory({
      historyDb: { id: 'history' },
      activeUserId: 'u',
      deviceId: 'd',
      token: 't',
      _deps: stubs,
    });

    expect(summary.channels).toBe(1);
    expect(summary.processed).toBe(2);
    expect(summary.decrypted).toBe(2);
    expect(summary.failed).toBe(0);

    expect(stubs.localPlaintextStore.get('m1')).toEqual({
      plaintext: 'hi alice',
      senderId: 'alice',
      timestamp: new Date('2026-04-01T10:00:00Z').getTime(),
    });
    expect(stubs.localPlaintextStore.get('m2')).toEqual({
      plaintext: 'hi bob',
      senderId: 'bob',
      timestamp: new Date('2026-04-01T11:00:00Z').getTime(),
    });
    // Voice channel must not be enumerated.
    expect(stubs.api.getChannelMessages).toHaveBeenCalledTimes(1);
    expect(stubs.api.getChannelMessages.mock.calls[0][2]).toBe('chan-text');
  });

  it('feeds messages to the WASM in chronological order regardless of API order', async () => {
    const newer = makeFakeMessage('newer', 'alice', 'newer', '2026-04-02T00:00:00Z');
    const older = makeFakeMessage('older', 'alice', 'older', '2026-04-01T00:00:00Z');
    const stubs = makeStubs({
      guilds: [{ id: 'g' }],
      channelsByGuild: { g: [{ id: 'c', type: 'text' }] },
      // API returns newest-first, the path under test must reverse it.
      messagesByChannel: { c: [newer, older] },
    });

    await preDecryptLegacyHistory({
      historyDb: { id: 'history' },
      activeUserId: 'u',
      deviceId: 'd',
      token: 't',
      _deps: stubs,
    });

    const ctOrder = stubs.hushCrypto.processMessage.mock.calls.map((args) => {
      const ct = args[4];
      return new TextDecoder().decode(ct);
    });
    expect(ctOrder).toEqual(['ct:older', 'ct:newer']);
  });

  it('uses the oldest message timestamp as the pagination cursor for subsequent pages', async () => {
    const firstPage = Array.from({ length: 100 }, (_, index) => (
      makeFakeMessage(
        `m${index}`,
        'alice',
        `msg-${index}`,
        new Date(Date.UTC(2026, 3, 1, 0, 0, 99 - index)).toISOString(),
      )
    ));
    const secondPage = [
      makeFakeMessage('older-page-2', 'alice', 'older-page-2', '2026-03-31T23:59:00Z'),
    ];

    const stubs = makeStubs({
      guilds: [{ id: 'g' }],
      channelsByGuild: { g: [{ id: 'c', type: 'text' }] },
      messagesByChannel: {},
    });

    stubs.api.getChannelMessages = vi.fn()
      .mockResolvedValueOnce(firstPage)
      .mockResolvedValueOnce(secondPage);

    await preDecryptLegacyHistory({
      historyDb: { id: 'history' },
      activeUserId: 'u',
      deviceId: 'd',
      token: 't',
      _deps: stubs,
    });

    expect(stubs.api.getChannelMessages).toHaveBeenNthCalledWith(
      2,
      't',
      'g',
      'c',
      { limit: 100, before: '2026-04-01T00:00:00.000Z' },
      '',
    );
  });

  it('skips messages that already have a plaintext cached', async () => {
    const stubs = makeStubs({
      guilds: [{ id: 'g' }],
      channelsByGuild: { g: [{ id: 'c', type: 'text' }] },
      messagesByChannel: {
        c: [makeFakeMessage('mPre', 'alice', 'first', '2026-04-01T00:00:00Z')],
      },
    });
    stubs.localPlaintextStore.set('mPre', {
      plaintext: 'cached already',
      timestamp: 1,
    });

    const summary = await preDecryptLegacyHistory({
      historyDb: { id: 'history' },
      activeUserId: 'u',
      deviceId: 'd',
      token: 't',
      _deps: stubs,
    });

    expect(summary.processed).toBe(1);
    expect(summary.decrypted).toBe(0);
    expect(summary.failed).toBe(0);
    // Existing cached value is left untouched.
    expect(stubs.localPlaintextStore.get('mPre').plaintext).toBe('cached already');
    expect(stubs.hushCrypto.processMessage).not.toHaveBeenCalled();
  });

  it('keeps going when an individual message decryption fails', async () => {
    const messages = [
      makeFakeMessage('mGood', 'alice', 'good', '2026-04-01T00:00:00Z'),
      makeFakeMessage('mBad',  'alice', 'bad',  '2026-04-02T00:00:00Z'),
    ];
    const stubs = makeStubs({
      guilds: [{ id: 'g' }],
      channelsByGuild: { g: [{ id: 'c', type: 'text' }] },
      messagesByChannel: { c: messages },
      decryptOverride: (ct) => {
        const text = new TextDecoder().decode(ct);
        if (text === 'ct:mBad') throw new Error('WrongEpoch');
        return {
          type: 'application',
          plaintext: new TextEncoder().encode('good'),
          epoch: 1,
        };
      },
    });

    const summary = await preDecryptLegacyHistory({
      historyDb: { id: 'history' },
      activeUserId: 'u',
      deviceId: 'd',
      token: 't',
      _deps: stubs,
    });

    expect(summary.processed).toBe(2);
    expect(summary.decrypted).toBe(1);
    expect(summary.failed).toBe(1);
    expect(stubs.localPlaintextStore.get('mGood')).toBeDefined();
    expect(stubs.localPlaintextStore.get('mBad')).toBeUndefined();
  });

  it('keeps going when a channel-level fetch fails', async () => {
    const stubs = makeStubs({
      guilds: [{ id: 'g' }],
      channelsByGuild: {
        g: [
          { id: 'broken', type: 'text' },
          { id: 'ok', type: 'text' },
        ],
      },
      messagesByChannel: {
        ok: [makeFakeMessage('m1', 'alice', 'hello', '2026-04-01T00:00:00Z')],
      },
      failOnChannel: 'broken',
    });

    const summary = await preDecryptLegacyHistory({
      historyDb: { id: 'history' },
      activeUserId: 'u',
      deviceId: 'd',
      token: 't',
      _deps: stubs,
    });

    expect(summary.channels).toBe(2);
    expect(summary.processed).toBe(1);
    expect(summary.decrypted).toBe(1);
    expect(summary.failed).toBe(0);
    expect(stubs.localPlaintextStore.get('m1')).toBeDefined();
  });

  it('returns an empty summary when guild listing fails', async () => {
    const stubs = makeStubs({ failOnGuildList: true });
    const summary = await preDecryptLegacyHistory({
      historyDb: { id: 'history' },
      activeUserId: 'u',
      deviceId: 'd',
      token: 't',
      _deps: stubs,
    });
    expect(summary).toEqual({ channels: 0, processed: 0, decrypted: 0, failed: 0 });
    expect(stubs.api.getGuildChannels).not.toHaveBeenCalled();
    expect(stubs.hushCrypto.processMessage).not.toHaveBeenCalled();
  });

  it('does not throw when the history scope itself rejects (link must still complete)', async () => {
    const stubs = makeStubs({
      guilds: [{ id: 'g' }],
      channelsByGuild: { g: [{ id: 'c', type: 'text' }] },
      messagesByChannel: {
        c: [makeFakeMessage('m1', 'alice', 'hi', '2026-04-01T00:00:00Z')],
      },
    });
    stubs.mlsStore.withReadWriteHistoryScope = vi.fn(async () => {
      throw new Error('scope rejected');
    });

    await expect(preDecryptLegacyHistory({
      historyDb: { id: 'history' },
      activeUserId: 'u',
      deviceId: 'd',
      token: 't',
      _deps: stubs,
    })).resolves.toBeDefined();
  });
});
