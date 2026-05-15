/**
 * Behavioural cover for the vault session-key module. The IDB layer is
 * served by `fake-indexeddb/auto` (loaded in `src/test/setup.js`) so
 * each test starts with a clean store. WebCrypto is jsdom's real
 * implementation, so AES-GCM and `generateKey({ extractable: false })`
 * round-trip just like in a browser.
 */
import { describe, it, expect, beforeEach, vi } from "vitest"

import {
  ensureSessionKey,
  getSessionKeyIfAlive,
  clearSessionKey,
  wrapIdentity,
  unwrapIdentity,
  persistWrappedIdentity,
  readWrappedIdentity,
  markAlive,
  clearMarker,
  isMarkerAlive,
  createVaultSessionPresence,
} from "./vaultSessionKey"

const USER = "user-vsk-1"

beforeEach(async () => {
  // fake-indexeddb resets between test files, but `clearSessionKey`
  // on the well-known userId guarantees a clean slate per case here
  // and exercises the delete path as a side benefit.
  await clearSessionKey(USER)
  if (typeof sessionStorage !== "undefined") sessionStorage.clear()
})

describe("vaultSessionKey — key generation", () => {
  it("generates a non-extractable AES-GCM CryptoKey", async () => {
    const key = await ensureSessionKey(USER)
    expect(key).toBeDefined()
    expect((key as CryptoKey).type).toBe("secret")
    expect((key as CryptoKey).extractable).toBe(false)
    expect((key as CryptoKey).algorithm.name).toBe("AES-GCM")
  })

  it("returns the same persisted key on repeated calls", async () => {
    const k1 = await ensureSessionKey(USER)
    const k2 = await ensureSessionKey(USER)
    // Round-tripping through structured clone may yield a different
    // CryptoKey instance, so identity comparison is unsafe. We assert
    // round-trip equivalence via a wrap+unwrap on each key reference.
    const plaintext = new TextEncoder().encode("hello")
    const sealed = await wrapIdentity(k1, plaintext)
    const opened = await unwrapIdentity(k2, sealed)
    expect(new TextDecoder().decode(opened)).toBe("hello")
  })

  it("rejects an empty userId", async () => {
    await expect(ensureSessionKey("")).rejects.toThrow(/userId/i)
  })
})

describe("vaultSessionKey — wrap / unwrap", () => {
  it("round-trips an identity buffer", async () => {
    const key = await ensureSessionKey(USER)
    const plaintext = crypto.getRandomValues(new Uint8Array(64))
    const sealed = await wrapIdentity(key, plaintext)
    expect(sealed.iv.byteLength).toBe(12)
    expect(sealed.ciphertext.byteLength).toBe(plaintext.byteLength + 16) // GCM tag
    const opened = await unwrapIdentity(key, sealed)
    expect(opened).toEqual(plaintext)
  })

  it("rejects tampered ciphertext via the AES-GCM auth tag", async () => {
    const key = await ensureSessionKey(USER)
    const plaintext = new TextEncoder().encode("secret-payload")
    const sealed = await wrapIdentity(key, plaintext)
    sealed.ciphertext[0] ^= 0xff
    await expect(unwrapIdentity(key, sealed)).rejects.toBeDefined()
  })

  it("rejects an IV that does not match the one used to seal", async () => {
    const key = await ensureSessionKey(USER)
    const plaintext = new TextEncoder().encode("payload")
    const sealed = await wrapIdentity(key, plaintext)
    const tampered = {
      iv: crypto.getRandomValues(new Uint8Array(12)),
      ciphertext: sealed.ciphertext,
    }
    await expect(unwrapIdentity(key, tampered)).rejects.toBeDefined()
  })
})

describe("vaultSessionKey — wrapped identity persistence", () => {
  it("round-trips a wrapped identity through IDB", async () => {
    const key = await ensureSessionKey(USER)
    const identity = crypto.getRandomValues(new Uint8Array(32))
    const sealed = await wrapIdentity(key, identity)
    await persistWrappedIdentity(USER, sealed)

    const loaded = await readWrappedIdentity(USER)
    expect(loaded).not.toBeNull()
    expect(Array.from(loaded!.iv)).toEqual(Array.from(sealed.iv))
    expect(Array.from(loaded!.ciphertext)).toEqual(
      Array.from(sealed.ciphertext)
    )

    // The persisted CryptoKey on the next call must still decrypt the
    // bundle — this exercises the structured-clone preservation of
    // the non-extractable AES-GCM key across IDB.
    const sameKey = await ensureSessionKey(USER)
    const opened = await unwrapIdentity(sameKey, loaded!)
    expect(opened).toEqual(identity)
  })

  it("returns null when no wrapped identity has been persisted yet", async () => {
    await ensureSessionKey(USER)
    const loaded = await readWrappedIdentity(USER)
    expect(loaded).toBeNull()
  })

  it("throws when persisting before a key has been generated", async () => {
    const stray = {
      iv: crypto.getRandomValues(new Uint8Array(12)),
      ciphertext: new Uint8Array(16),
    }
    await expect(persistWrappedIdentity(USER, stray)).rejects.toThrow(
      /session key/i
    )
  })
})

describe("vaultSessionKey — policy gating", () => {
  it("returns null under the refresh policy regardless of marker state", async () => {
    await ensureSessionKey(USER)
    markAlive(USER)
    const out = await getSessionKeyIfAlive(USER, "refresh")
    expect(out).toBeNull()
  })

  it("returns the key under never even with no alive marker", async () => {
    await ensureSessionKey(USER)
    expect(isMarkerAlive(USER)).toBe(false)
    const out = await getSessionKeyIfAlive(USER, "never")
    expect(out).not.toBeNull()
  })

  it("returns null under browser_close when no marker and no live tab", async () => {
    await ensureSessionKey(USER)
    expect(isMarkerAlive(USER)).toBe(false)
    const out = await getSessionKeyIfAlive(USER, "browser_close")
    expect(out).toBeNull()
  })

  it("returns the key under browser_close when the per-tab marker is alive", async () => {
    await ensureSessionKey(USER)
    markAlive(USER)
    const out = await getSessionKeyIfAlive(USER, "browser_close")
    expect(out).not.toBeNull()
  })

  it("returns the key under browser_close when a sibling tab is alive", async () => {
    await ensureSessionKey(USER)
    expect(isMarkerAlive(USER)).toBe(false)
    const out = await getSessionKeyIfAlive(USER, "browser_close", {
      aliveTabExists: true,
    })
    expect(out).not.toBeNull()
  })

  it("returns the key under numeric policy (deadline gating handled by caller)", async () => {
    await ensureSessionKey(USER)
    const out = await getSessionKeyIfAlive(USER, 15)
    expect(out).not.toBeNull()
  })

  it("returns null when no IDB record exists", async () => {
    expect(await getSessionKeyIfAlive(USER, "never")).toBeNull()
  })
})

describe("vaultSessionKey — clearSessionKey", () => {
  it("wipes both the IDB record and the alive marker", async () => {
    await ensureSessionKey(USER)
    markAlive(USER)
    expect(isMarkerAlive(USER)).toBe(true)

    await clearSessionKey(USER)

    expect(isMarkerAlive(USER)).toBe(false)
    expect(await getSessionKeyIfAlive(USER, "never")).toBeNull()
  })

  it("regenerates a fresh key after clear (rotation contract)", async () => {
    const k1 = await ensureSessionKey(USER)
    const plaintext = new TextEncoder().encode("first")
    const sealed = await wrapIdentity(k1, plaintext)

    await clearSessionKey(USER)

    const k2 = await ensureSessionKey(USER)
    // The new key must NOT be able to unwrap the old bundle — that is
    // the rotation contract that PIN change relies on.
    await expect(unwrapIdentity(k2, sealed)).rejects.toBeDefined()
  })

  it("is a noop when there is no record to wipe", async () => {
    await expect(clearSessionKey(USER)).resolves.toBeUndefined()
  })

  // Stub `deleteDatabase` to fire either `onblocked` or `onerror` so
  // we can prove the sensitive store is still cleared even when final
  // database deletion cannot complete.
  const stubDeleteWith = (event: "blocked" | "error") =>
    vi.spyOn(indexedDB, "deleteDatabase").mockImplementation(() => {
      const req = {
        onsuccess: null as ((ev: Event) => void) | null,
        onerror: null as ((ev: Event) => void) | null,
        onblocked: null as ((ev: Event) => void) | null,
      }
      queueMicrotask(() =>
        event === "blocked"
          ? req.onblocked?.(new Event("blocked"))
          : req.onerror?.(new Event("error")),
      )
      return req as unknown as IDBOpenDBRequest
    })

  it.each(["blocked", "error"] as const)(
    "clears the store before best-effort deleteDatabase emits %s",
    async (event) => {
      const key = await ensureSessionKey(USER)
      await persistWrappedIdentity(
        USER,
        await wrapIdentity(key, new TextEncoder().encode("identity")),
      )
      const spy = stubDeleteWith(event)
      try {
        await clearSessionKey(USER)
        expect(await getSessionKeyIfAlive(USER, "never")).toBeNull()
        expect(await readWrappedIdentity(USER)).toBeNull()
      } finally {
        spy.mockRestore()
      }
    },
  )
})

describe("vaultSessionKey — multi-tab presence (P21 step 5)", () => {
  it("returns false from a probe-only presence when no other presence is open", async () => {
    // Models a startup probe: no real responder anywhere on the channel.
    const probe = createVaultSessionPresence(USER, { respondToJoining: false })
    try {
      const aliveSibling = await probe.joinAndCheckSiblings(40)
      expect(aliveSibling).toBe(false)
    } finally {
      probe.close()
    }
  })

  it("returns true when a default-mode sibling responder is alive on the same channel", async () => {
    if (typeof BroadcastChannel === "undefined") return
    const sibling = createVaultSessionPresence(USER) // default: responds to joining
    try {
      const probe = createVaultSessionPresence(USER, { respondToJoining: false })
      try {
        const aliveSibling = await probe.joinAndCheckSiblings(120)
        expect(aliveSibling).toBe(true)
      } finally {
        probe.close()
      }
    } finally {
      sibling.close()
    }
  })

  it("isolates presence per-userId", async () => {
    if (typeof BroadcastChannel === "undefined") return
    const sibling = createVaultSessionPresence(USER) // default responder
    try {
      const probe = createVaultSessionPresence("user-vsk-different", {
        respondToJoining: false,
      })
      try {
        const aliveSibling = await probe.joinAndCheckSiblings(40)
        expect(aliveSibling).toBe(false)
      } finally {
        probe.close()
      }
    } finally {
      sibling.close()
    }
  })

  it("close is idempotent and stops responding to subsequent probes", async () => {
    if (typeof BroadcastChannel === "undefined") return
    const sibling = createVaultSessionPresence(USER)
    sibling.close()
    sibling.close()

    const probe = createVaultSessionPresence(USER, { respondToJoining: false })
    try {
      const aliveSibling = await probe.joinAndCheckSiblings(40)
      expect(aliveSibling).toBe(false)
    } finally {
      probe.close()
    }
  })

  it("two concurrent probe-only presences cannot satisfy each other (no spoofed liveness)", async () => {
    // Regression for PR #27: two fresh-locked tabs starting concurrently
    // must NOT each see the other as alive — neither should be acting
    // as a responder. Without the probe-only mode, the previous
    // implementation answered every `joining` with `alive`, so both
    // probes resolved true and `browser_close` would resume the vault
    // with no genuinely-unlocked sibling anywhere.
    if (typeof BroadcastChannel === "undefined") return
    const probeA = createVaultSessionPresence(USER, { respondToJoining: false })
    const probeB = createVaultSessionPresence(USER, { respondToJoining: false })
    try {
      const [a, b] = await Promise.all([
        probeA.joinAndCheckSiblings(80),
        probeB.joinAndCheckSiblings(80),
      ])
      expect(a).toBe(false)
      expect(b).toBe(false)
    } finally {
      probeA.close()
      probeB.close()
    }
  })

  it("a probe-only presence does not answer another checker's joining probe", async () => {
    // Symmetric guarantee: a probe-only presence must never advertise
    // itself as alive even if some other tab posts a `joining` message.
    if (typeof BroadcastChannel === "undefined") return
    const probeOnly = createVaultSessionPresence(USER, {
      respondToJoining: false,
    })
    try {
      const otherChecker = createVaultSessionPresence(USER, {
        respondToJoining: false,
      })
      try {
        const aliveSibling = await otherChecker.joinAndCheckSiblings(40)
        expect(aliveSibling).toBe(false)
      } finally {
        otherChecker.close()
      }
    } finally {
      probeOnly.close()
    }
  })
})

describe("vaultSessionKey — alive marker primitives", () => {
  it("markAlive + isMarkerAlive + clearMarker round-trip", () => {
    expect(isMarkerAlive(USER)).toBe(false)
    markAlive(USER)
    expect(isMarkerAlive(USER)).toBe(true)
    clearMarker(USER)
    expect(isMarkerAlive(USER)).toBe(false)
  })

  it("isolates the marker per userId", () => {
    markAlive(USER)
    expect(isMarkerAlive("user-vsk-other")).toBe(false)
    clearMarker(USER)
  })
})
