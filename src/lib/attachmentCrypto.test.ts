/**
 * Round-trip + tamper coverage for the per-attachment AES-GCM helper.
 * The browser ships WebCrypto, so we run these against the platform's
 * real implementation under jsdom (vitest setup polyfills `crypto`
 * when needed).
 */
import { describe, it, expect } from "vitest"

import { decryptBlob, encryptBlob } from "./attachmentCrypto"

async function blobToText(b: Blob): Promise<string> {
  const buf = await b.arrayBuffer()
  return new TextDecoder("utf-8").decode(buf)
}

describe("attachmentCrypto", () => {
  it("round-trips a small text blob", async () => {
    const blob = new Blob(["hello, attachment world"], { type: "text/plain" })
    const enc = await encryptBlob(blob)
    expect(enc.ciphertext.byteLength).toBeGreaterThan(0)
    const out = await decryptBlob(enc)
    expect(await blobToText(out)).toBe("hello, attachment world")
  })

  it("rejects a tampered ciphertext (auth tag verification fails)", async () => {
    const blob = new Blob(["hush attachment"], { type: "text/plain" })
    const enc = await encryptBlob(blob)
    const tampered = new Uint8Array(enc.ciphertext)
    // Flip the last byte of the GCM auth tag.
    tampered[tampered.length - 1] ^= 0xff
    let caught: unknown = null
    try {
      await decryptBlob({ ciphertext: tampered.buffer, key: enc.key, iv: enc.iv })
    } catch (err) {
      caught = err
    }
    expect(caught).not.toBeNull()
  })

  it("rejects a wrong-length key", async () => {
    const blob = new Blob(["x"], { type: "text/plain" })
    const enc = await encryptBlob(blob)
    let caught: unknown = null
    try {
      await decryptBlob({ ciphertext: enc.ciphertext, key: "AAA=", iv: enc.iv })
    } catch (err) {
      caught = err
    }
    expect(caught).toBeInstanceOf(Error)
    expect((caught as Error).message).toMatch(/key must be/)
  })

  it("rejects a wrong-length iv", async () => {
    const blob = new Blob(["x"], { type: "text/plain" })
    const enc = await encryptBlob(blob)
    let caught: unknown = null
    try {
      await decryptBlob({ ciphertext: enc.ciphertext, key: enc.key, iv: "AAA=" })
    } catch (err) {
      caught = err
    }
    expect(caught).toBeInstanceOf(Error)
    expect((caught as Error).message).toMatch(/iv must be/)
  })
})
