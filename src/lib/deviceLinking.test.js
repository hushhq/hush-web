import { describe, it, expect } from 'vitest';
import {
  buildLinkApprovalUrl,
  certifyDevice,
  createDeviceIdentity,
  createSessionKeyPair,
  decodeQRPayload,
  decodeTransferBundle,
  decryptRelayPayload,
  encodeQRPayload,
  encodeTransferBundle,
  encryptRelayPayload,
  generateLinkingCode,
  verifyCertificate,
} from './deviceLinking.js';

describe('device certificates', () => {
  it('creates and verifies a valid certificate', async () => {
    const existing = await createDeviceIdentity();
    const linked = await createDeviceIdentity();

    const certificate = await certifyDevice(linked.publicKey, existing.privateKey);

    expect(certificate).toBeInstanceOf(Uint8Array);
    expect(certificate).toHaveLength(64);
    await expect(
      verifyCertificate(linked.publicKey, certificate, existing.publicKey),
    ).resolves.toBe(true);
  });

  it('rejects a certificate signed by the wrong device', async () => {
    const signer = await createDeviceIdentity();
    const impostor = await createDeviceIdentity();
    const linked = await createDeviceIdentity();

    const certificate = await certifyDevice(linked.publicKey, signer.privateKey);

    await expect(
      verifyCertificate(linked.publicKey, certificate, impostor.publicKey),
    ).resolves.toBe(false);
  });
});

describe('QR payload helpers', () => {
  it('round-trips requestId, secret, and expiresAt', () => {
    const original = {
      requestId: 'request-1',
      secret: 'secret-1',
      expiresAt: new Date(Date.now() + 300_000).toISOString(),
    };

    const encoded = encodeQRPayload(original);
    const decoded = decodeQRPayload(encoded);

    expect(decoded).toEqual(original);
  });

  it('builds an approval URL on the link-device route', () => {
    const url = buildLinkApprovalUrl('https://app.gethush.live', {
      requestId: 'request-1',
      secret: 'secret-1',
      expiresAt: '2026-03-29T00:00:00Z',
    });

    expect(url).toContain('https://app.gethush.live/link-device?payload=');
  });

  it('throws a descriptive error for truncated base64 QR payloads', () => {
    // Truncate valid base64 to produce malformed JSON after decode
    const valid = encodeQRPayload({ requestId: 'r', secret: 's', expiresAt: '2026-01-01T00:00:00Z' });
    const truncated = valid.slice(0, Math.floor(valid.length / 2));
    expect(() => decodeQRPayload(truncated)).toThrow();
  });

  it('throws for an empty QR payload string', () => {
    expect(() => decodeQRPayload('')).toThrow();
  });
});

describe('blind relay encryption', () => {
  it('decrypts a relay envelope with the matching session private key', async () => {
    const receiver = await createSessionKeyPair();
    const plaintext = new TextEncoder().encode('linked-device-transfer');

    const envelope = await encryptRelayPayload(plaintext, receiver.publicKeyBase64);
    const decrypted = await decryptRelayPayload(envelope, receiver.privateKey);

    expect(Array.from(decrypted)).toEqual(Array.from(plaintext));
  });
});

describe('transfer bundle serialisation', () => {
  it('round-trips root keys and history snapshot metadata', async () => {
    const identity = await createDeviceIdentity();
    const bytes = await encodeTransferBundle({
      userId: 'user-1',
      username: 'alice',
      displayName: 'Alice',
      instanceUrl: 'https://app.gethush.live',
      rootPrivateKey: identity.privateKey,
      rootPublicKey: identity.publicKey,
      historySnapshot: {
        version: 1,
        stores: {
          credential: [{ key: 'credential', signingPublicKey: [1, 2, 3] }],
        },
      },
      guildMetadataKeySnapshot: {
        version: 1,
        keys: [{ guildId: 'guild-1', keyBytes: [9, 8, 7] }],
      },
    });

    const decoded = await decodeTransferBundle(bytes);

    expect(decoded.userId).toBe('user-1');
    expect(decoded.username).toBe('alice');
    expect(decoded.displayName).toBe('Alice');
    expect(decoded.instanceUrl).toBe('https://app.gethush.live');
    expect(decoded.rootPrivateKey).toEqual(identity.privateKey);
    expect(decoded.rootPublicKey).toEqual(identity.publicKey);
    expect(decoded.historySnapshot).toEqual({
      version: 1,
      stores: {
        credential: [{ key: 'credential', signingPublicKey: [1, 2, 3] }],
      },
    });
    expect(decoded.guildMetadataKeySnapshot).toEqual({
      version: 1,
      keys: [{ guildId: 'guild-1', keyBytes: [9, 8, 7] }],
    });
  });

  it('decodes legacy uncompressed transfer bundle bytes', async () => {
    const identity = await createDeviceIdentity();
    const legacyBytes = new TextEncoder().encode(JSON.stringify({
      v: 2,
      userId: 'user-legacy',
      username: 'alice',
      displayName: 'Alice',
      instanceUrl: 'https://app.gethush.live',
      exportedAt: '2026-04-26T00:00:00.000Z',
      rootPrivateKey: btoa(String.fromCharCode(...identity.privateKey)),
      rootPublicKey: btoa(String.fromCharCode(...identity.publicKey)),
      historySnapshot: { version: 1, stores: {} },
      guildMetadataKeySnapshot: null,
      transcriptBlob: null,
    }));

    const decoded = await decodeTransferBundle(legacyBytes);
    expect(decoded.userId).toBe('user-legacy');
    expect(decoded.rootPrivateKey).toEqual(identity.privateKey);
  });
});

describe('linking code generation', () => {
  it('returns an 8-character uppercase alphanumeric string', () => {
    const code = generateLinkingCode();
    expect(code).toMatch(/^[A-Z0-9]{8}$/);
  });
});
