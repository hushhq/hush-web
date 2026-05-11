// Tests for the shared MLS ciphersuite constant and handshake validator.

import { describe, it, expect } from "vitest";
import {
  CURRENT_MLS_CIPHERSUITE,
  MLSCiphersuiteMismatchError,
  assertHandshakeMLSCiphersuiteMatches,
} from "./mlsCiphersuite";

describe("CURRENT_MLS_CIPHERSUITE", () => {
  it("is the X-Wing OpenMLS codepoint (0x004D / 77)", () => {
    // The migration plan was committed to suite 77. The Go server stamps the
    // same value via internal/version.CurrentMLSCiphersuite. Any drift here is
    // a protocol break, so this acts as a tripwire.
    expect(CURRENT_MLS_CIPHERSUITE).toBe(77);
  });
});

describe("assertHandshakeMLSCiphersuiteMatches", () => {
  it("does nothing when current_mls_ciphersuite matches", () => {
    expect(() =>
      assertHandshakeMLSCiphersuiteMatches({ current_mls_ciphersuite: 77 }),
    ).not.toThrow();
  });

  it("throws MLSCiphersuiteMismatchError on a mismatched suite", () => {
    expect(() =>
      assertHandshakeMLSCiphersuiteMatches({ current_mls_ciphersuite: 1 }),
    ).toThrowError(MLSCiphersuiteMismatchError);
  });

  it("attaches the server and client values to the error", () => {
    try {
      assertHandshakeMLSCiphersuiteMatches({ current_mls_ciphersuite: 1 });
      throw new Error("expected throw");
    } catch (err) {
      expect(err).toBeInstanceOf(MLSCiphersuiteMismatchError);
      expect(err.serverCiphersuite).toBe(1);
      expect(err.clientCiphersuite).toBe(77);
    }
  });

  it("tolerates a missing current_mls_ciphersuite (pre-X-Wing server)", () => {
    expect(() =>
      assertHandshakeMLSCiphersuiteMatches({ server_version: "0.9.0" }),
    ).not.toThrow();
  });

  it("tolerates an explicit null", () => {
    expect(() =>
      assertHandshakeMLSCiphersuiteMatches({ current_mls_ciphersuite: null }),
    ).not.toThrow();
  });

  it("tolerates an undefined/null handshake (no-op)", () => {
    expect(() => assertHandshakeMLSCiphersuiteMatches(undefined)).not.toThrow();
    expect(() => assertHandshakeMLSCiphersuiteMatches(null)).not.toThrow();
  });
});
