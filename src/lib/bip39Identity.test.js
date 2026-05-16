/**
 * Tests for bip39Identity.js - BIP39 mnemonic generation, Ed25519 keypair derivation,
 * mnemonic validation, challenge signing, and wordlist access.
 */
import { describe, it, expect } from 'vitest';
import {
  generateIdentityMnemonic,
  mnemonicToIdentityKey,
  isMnemonicValid,
  signChallenge,
  signAuthChallengeV2,
  buildAuthChallengeV2Payload,
  AUTH_CHALLENGE_V2_HEADER,
  getEnglishWordlist,
} from './bip39Identity.js';

describe('generateIdentityMnemonic', () => {
  it('returns a string of exactly 12 space-separated words', () => {
    const mnemonic = generateIdentityMnemonic();
    expect(typeof mnemonic).toBe('string');
    const words = mnemonic.split(' ');
    expect(words).toHaveLength(12);
  });

  it('each word is in the BIP39 English wordlist', () => {
    const mnemonic = generateIdentityMnemonic();
    const wordlist = getEnglishWordlist();
    const wordSet = new Set(wordlist);
    const words = mnemonic.split(' ');
    for (const word of words) {
      expect(wordSet.has(word)).toBe(true);
    }
  });

  it('generates different mnemonics on each call', () => {
    const a = generateIdentityMnemonic();
    const b = generateIdentityMnemonic();
    // Astronomically unlikely to collide
    expect(a).not.toBe(b);
  });
});

describe('mnemonicToIdentityKey', () => {
  it('returns an object with privateKey and publicKey as Uint8Array(32)', async () => {
    const mnemonic = generateIdentityMnemonic();
    const { privateKey, publicKey } = await mnemonicToIdentityKey(mnemonic);
    expect(privateKey).toBeInstanceOf(Uint8Array);
    expect(privateKey).toHaveLength(32);
    expect(publicKey).toBeInstanceOf(Uint8Array);
    expect(publicKey).toHaveLength(32);
  });

  it('is deterministic: same mnemonic produces same keypair', async () => {
    const mnemonic = generateIdentityMnemonic();
    const first = await mnemonicToIdentityKey(mnemonic);
    const second = await mnemonicToIdentityKey(mnemonic);
    expect(first.privateKey).toEqual(second.privateKey);
    expect(first.publicKey).toEqual(second.publicKey);
  });

  it('different mnemonics produce different keypairs', async () => {
    const mnemonicA = generateIdentityMnemonic();
    const mnemonicB = generateIdentityMnemonic();
    const keyA = await mnemonicToIdentityKey(mnemonicA);
    const keyB = await mnemonicToIdentityKey(mnemonicB);
    expect(keyA.publicKey).not.toEqual(keyB.publicKey);
    expect(keyA.privateKey).not.toEqual(keyB.privateKey);
  });
});

describe('isMnemonicValid', () => {
  it('returns true for a valid 12-word BIP39 mnemonic', () => {
    const mnemonic = generateIdentityMnemonic();
    expect(isMnemonicValid(mnemonic)).toBe(true);
  });

  it('returns false for garbage input', () => {
    expect(isMnemonicValid('not a valid mnemonic at all here foo bar')).toBe(false);
  });

  it('returns false for an empty string', () => {
    expect(isMnemonicValid('')).toBe(false);
  });

  it('returns false for a mnemonic with invalid words', () => {
    expect(isMnemonicValid('zzz yyy xxx www vvv uuu ttt sss rrr qqq ppp ooo')).toBe(false);
  });
});

describe('signChallenge', () => {
  it('returns a Uint8Array of length 64', async () => {
    const mnemonic = generateIdentityMnemonic();
    const { privateKey } = await mnemonicToIdentityKey(mnemonic);
    const nonce = new Uint8Array(32);
    crypto.getRandomValues(nonce);
    const sig = await signChallenge(nonce, privateKey);
    expect(sig).toBeInstanceOf(Uint8Array);
    expect(sig).toHaveLength(64);
  });

  it('produces a valid Ed25519 signature verifiable by the paired public key', async () => {
    // Import noble/ed25519 directly to verify
    const ed = await import('@noble/ed25519');
    const mnemonic = generateIdentityMnemonic();
    const { privateKey, publicKey } = await mnemonicToIdentityKey(mnemonic);
    const nonce = new Uint8Array(32).fill(42);
    const sig = await signChallenge(nonce, privateKey);
    const isValid = await ed.verifyAsync(sig, nonce, publicKey);
    expect(isValid).toBe(true);
  });

  it('different nonces produce different signatures', async () => {
    const mnemonic = generateIdentityMnemonic();
    const { privateKey } = await mnemonicToIdentityKey(mnemonic);
    const nonceA = new Uint8Array(32).fill(1);
    const nonceB = new Uint8Array(32).fill(2);
    const sigA = await signChallenge(nonceA, privateKey);
    const sigB = await signChallenge(nonceB, privateKey);
    expect(sigA).not.toEqual(sigB);
  });
});

describe('buildAuthChallengeV2Payload', () => {
  it('uses the canonical UTF-8 format pinned by the v2 spec', () => {
    const bytes = buildAuthChallengeV2Payload('deadbeef', 'https://home.example');
    const text = new TextDecoder().decode(bytes);
    expect(text).toBe(`${AUTH_CHALLENGE_V2_HEADER}\naudience=https://home.example\nnonce=deadbeef`);
  });

  it('produces different bytes for different audiences with the same nonce', () => {
    // This is the property that closes the cross-instance signing
    // oracle: a signature valid for `https://evil.example` cannot
    // satisfy verification under `https://home.example`, because the
    // signed bytes are not equal.
    const a = buildAuthChallengeV2Payload('deadbeef', 'https://home.example');
    const b = buildAuthChallengeV2Payload('deadbeef', 'https://evil.example');
    expect(a).not.toEqual(b);
  });

  it('rejects missing nonce or audience', () => {
    expect(() => buildAuthChallengeV2Payload('', 'https://x')).toThrow(TypeError);
    expect(() => buildAuthChallengeV2Payload('deadbeef', '')).toThrow(TypeError);
  });
});

describe('signAuthChallengeV2', () => {
  it('produces a valid Ed25519 signature over the v2 payload', async () => {
    const ed = await import('@noble/ed25519');
    const mnemonic = generateIdentityMnemonic();
    const { privateKey, publicKey } = await mnemonicToIdentityKey(mnemonic);
    const audience = 'https://home.example';
    const nonce = 'deadbeefcafef00d';
    const sig = await signAuthChallengeV2(nonce, audience, privateKey);
    const payload = buildAuthChallengeV2Payload(nonce, audience);
    expect(await ed.verifyAsync(sig, payload, publicKey)).toBe(true);
  });

  it('binds the signature to the audience: same nonce, different audience, different signature', async () => {
    const mnemonic = generateIdentityMnemonic();
    const { privateKey } = await mnemonicToIdentityKey(mnemonic);
    const sigHome = await signAuthChallengeV2('deadbeef', 'https://home.example', privateKey);
    const sigEvil = await signAuthChallengeV2('deadbeef', 'https://evil.example', privateKey);
    expect(sigHome).not.toEqual(sigEvil);
  });

  it('v2 signature does not validate against the raw nonce (v1) payload', async () => {
    // Catches accidental regression to the v1 (raw nonce) protocol on
    // either side: a v2 signature must be over the audience-bound
    // payload, NOT the raw nonce bytes.
    const ed = await import('@noble/ed25519');
    const mnemonic = generateIdentityMnemonic();
    const { privateKey, publicKey } = await mnemonicToIdentityKey(mnemonic);
    const nonce = 'deadbeefcafef00d';
    const sig = await signAuthChallengeV2(nonce, 'https://home.example', privateKey);
    const rawNonceBytes = new Uint8Array(
      nonce.match(/.{2}/g).map((h) => parseInt(h, 16)),
    );
    expect(await ed.verifyAsync(sig, rawNonceBytes, publicKey)).toBe(false);
  });
});

describe('getEnglishWordlist', () => {
  it('returns an array of 2048 words', () => {
    const wordlist = getEnglishWordlist();
    expect(Array.isArray(wordlist)).toBe(true);
    expect(wordlist).toHaveLength(2048);
  });

  it('contains well-known BIP39 words', () => {
    const wordlist = getEnglishWordlist();
    expect(wordlist).toContain('abandon');
    expect(wordlist).toContain('zoo');
  });
});
