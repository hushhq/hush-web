// Verifies that every MLS state-write helper in src/lib/api.js sends the active
// ciphersuite in its request body. Without this field the Go server now
// returns 400 (mls_ciphersuite_mismatch), so each helper must include it.

import { afterEach, describe, it, expect, vi } from "vitest";
import {
  putMLSGroupInfo,
  postMLSCommit,
  putMLSVoiceGroupInfo,
  postMLSVoiceCommit,
  putGuildMetadataGroupInfo,
  uploadKeyPackagesAfterAuth,
} from "./api";
import { CURRENT_MLS_CIPHERSUITE, MLSCiphersuiteMismatchError } from "./mlsCiphersuite";

const TOKEN = "jwt-token";

function okFetch() {
  return vi.fn().mockResolvedValue({ ok: true, status: 204 });
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("MLS write helpers include current ciphersuite in body", () => {
  it("putMLSGroupInfo", async () => {
    const fetchMock = okFetch();
    vi.stubGlobal("fetch", fetchMock);

    await putMLSGroupInfo(TOKEN, "ch-1", "Z3JvdXAtaW5mbw==", 3);

    const [, opts] = fetchMock.mock.calls[0];
    expect(JSON.parse(opts.body).ciphersuite).toBe(CURRENT_MLS_CIPHERSUITE);
  });

  it("postMLSCommit", async () => {
    const fetchMock = okFetch();
    vi.stubGlobal("fetch", fetchMock);

    await postMLSCommit(TOKEN, "ch-1", "Y29tbWl0", "Z2k=", 4);

    const [, opts] = fetchMock.mock.calls[0];
    expect(JSON.parse(opts.body).ciphersuite).toBe(CURRENT_MLS_CIPHERSUITE);
  });

  it("putMLSVoiceGroupInfo", async () => {
    const fetchMock = okFetch();
    vi.stubGlobal("fetch", fetchMock);

    await putMLSVoiceGroupInfo(TOKEN, "ch-v", "Z3Y=", 1);

    const [, opts] = fetchMock.mock.calls[0];
    expect(JSON.parse(opts.body).ciphersuite).toBe(CURRENT_MLS_CIPHERSUITE);
  });

  it("postMLSVoiceCommit", async () => {
    const fetchMock = okFetch();
    vi.stubGlobal("fetch", fetchMock);

    await postMLSVoiceCommit(TOKEN, "ch-v", "Y29tbWl0", 2, "Z2k=");

    const [, opts] = fetchMock.mock.calls[0];
    expect(JSON.parse(opts.body).ciphersuite).toBe(CURRENT_MLS_CIPHERSUITE);
  });

  it("putGuildMetadataGroupInfo", async () => {
    const fetchMock = okFetch();
    vi.stubGlobal("fetch", fetchMock);

    await putGuildMetadataGroupInfo(TOKEN, "guild-1", "Z3VpbGQ=", 5);

    const [, opts] = fetchMock.mock.calls[0];
    expect(JSON.parse(opts.body).ciphersuite).toBe(CURRENT_MLS_CIPHERSUITE);
  });
});

describe("uploadKeyPackagesAfterAuth handshake gate", () => {
  it("throws MLSCiphersuiteMismatchError when the server reports a different suite", async () => {
    const mismatchedHandshake = vi.fn().mockResolvedValue({
      current_mls_ciphersuite: 1, // legacy suite
    });

    const noopCrypto = {
      init: vi.fn().mockResolvedValue(undefined),
      generateCredential: vi.fn(),
      generateKeyPackage: vi.fn(),
    };
    const noopStore = {
      openStore: vi.fn().mockResolvedValue({}),
      getCredential: vi.fn().mockResolvedValue(null),
      setCredential: vi.fn(),
      setKeyPackage: vi.fn(),
      setLastResort: vi.fn(),
    };

    await expect(
      uploadKeyPackagesAfterAuth(TOKEN, "user-1", "device-1", {
        getHandshake: mismatchedHandshake,
        mlsStore: noopStore,
        crypto: noopCrypto,
        uploadCredential: vi.fn(),
        uploadKeyPackages: vi.fn(),
      }),
    ).rejects.toBeInstanceOf(MLSCiphersuiteMismatchError);

    // We must fail BEFORE generating credentials or uploading anything;
    // otherwise a stale client would still poison the server's tables.
    expect(noopCrypto.init).not.toHaveBeenCalled();
    expect(noopStore.getCredential).not.toHaveBeenCalled();
  });

  it("does not throw when the server advertises the matching suite", async () => {
    const matchingHandshake = vi
      .fn()
      .mockResolvedValue({ current_mls_ciphersuite: CURRENT_MLS_CIPHERSUITE });

    const noopCrypto = {
      init: vi.fn().mockResolvedValue(undefined),
      generateCredential: vi.fn().mockResolvedValue({
        credentialBytes: new Uint8Array([1]),
        signingPublicKey: new Uint8Array([2]),
        signingPrivateKey: new Uint8Array([3]),
      }),
      generateKeyPackage: vi.fn().mockResolvedValue({
        keyPackageBytes: new Uint8Array([4]),
        privateKeyBytes: new Uint8Array([5]),
        hashRefBytes: new Uint8Array([6]),
      }),
    };
    const noopStore = {
      openStore: vi.fn().mockResolvedValue({}),
      getCredential: vi.fn().mockResolvedValue(null),
      setCredential: vi.fn().mockResolvedValue(undefined),
      setKeyPackage: vi.fn().mockResolvedValue(undefined),
      setLastResort: vi.fn().mockResolvedValue(undefined),
    };

    await expect(
      uploadKeyPackagesAfterAuth(TOKEN, "user-1", "device-1", {
        getHandshake: matchingHandshake,
        mlsStore: noopStore,
        crypto: noopCrypto,
        uploadCredential: vi.fn().mockResolvedValue(undefined),
        uploadKeyPackages: vi.fn().mockResolvedValue(undefined),
      }),
    ).resolves.toBeUndefined();
  });

  it("does not throw when the handshake call itself fails (transient error tolerated)", async () => {
    const failingHandshake = vi.fn().mockRejectedValue(new Error("network down"));

    const noopCrypto = {
      init: vi.fn().mockResolvedValue(undefined),
      generateCredential: vi.fn().mockResolvedValue({
        credentialBytes: new Uint8Array([1]),
        signingPublicKey: new Uint8Array([2]),
        signingPrivateKey: new Uint8Array([3]),
      }),
      generateKeyPackage: vi.fn().mockResolvedValue({
        keyPackageBytes: new Uint8Array([4]),
        privateKeyBytes: new Uint8Array([5]),
        hashRefBytes: new Uint8Array([6]),
      }),
    };
    const noopStore = {
      openStore: vi.fn().mockResolvedValue({}),
      getCredential: vi.fn().mockResolvedValue(null),
      setCredential: vi.fn().mockResolvedValue(undefined),
      setKeyPackage: vi.fn().mockResolvedValue(undefined),
      setLastResort: vi.fn().mockResolvedValue(undefined),
    };

    await expect(
      uploadKeyPackagesAfterAuth(TOKEN, "user-1", "device-1", {
        getHandshake: failingHandshake,
        mlsStore: noopStore,
        crypto: noopCrypto,
        uploadCredential: vi.fn().mockResolvedValue(undefined),
        uploadKeyPackages: vi.fn().mockResolvedValue(undefined),
      }),
    ).resolves.toBeUndefined();
  });
});
