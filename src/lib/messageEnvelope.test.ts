/**
 * Round-trip + rejection cases for the v1 plaintext envelope. The
 * encode/decode boundary is the only place the rest of the app trusts
 * to validate MLS plaintext, so the decoder must reject every shape
 * that isn't a strict v1 object — silent acceptance of a malformed
 * payload would surface as a render bug deep in the chat tree.
 */
import { describe, it, expect } from "vitest"

import {
  ENVELOPE_COUNTER_THRESHOLD,
  MAX_ENVELOPE_BYTES,
  decodeEnvelopeV1,
  decodeEnvelopeV1FromString,
  encodeEnvelopeV1,
  envelopeFromText,
  type AttachmentRef,
  type GifRef,
  type MessageEnvelopeV1,
} from "./messageEnvelope"

const fixtureAttachment: AttachmentRef = {
  id: "att_1",
  name: "diagram.png",
  size: 1234,
  mimeType: "image/png",
  key: "AAA=",
  iv: "BBB=",
  width: 800,
  height: 600,
}

const fixtureGif: GifRef = {
  id: "tenor_1",
  url: "https://example.test/x.gif",
  previewUrl: "https://example.test/x-small.gif",
  width: 320,
  height: 240,
}

describe("envelope constants", () => {
  it("counter threshold is below 1.0 so it triggers before the cap", () => {
    expect(ENVELOPE_COUNTER_THRESHOLD).toBeGreaterThan(0)
    expect(ENVELOPE_COUNTER_THRESHOLD).toBeLessThan(1)
  })

  it("max envelope bytes leaves room under the 8 KiB MLS budget", () => {
    expect(MAX_ENVELOPE_BYTES).toBeLessThanOrEqual(8 * 1024 - 512)
  })
})

describe("encodeEnvelopeV1", () => {
  it("round-trips a text-only envelope through encode + decode", () => {
    const env = envelopeFromText("hello **world**")
    const bytes = encodeEnvelopeV1(env)
    const result = decodeEnvelopeV1(bytes)
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.envelope).toEqual(env)
  })

  it("strips empty attachments arrays so they never round-trip back", () => {
    const env: MessageEnvelopeV1 = { v: 1, text: "x", attachments: [] }
    const bytes = encodeEnvelopeV1(env)
    const result = decodeEnvelopeV1(bytes)
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.envelope.attachments).toBeUndefined()
  })

  it("preserves attachments and gif when present", () => {
    const env: MessageEnvelopeV1 = {
      v: 1,
      text: "see attached",
      attachments: [fixtureAttachment],
      gif: fixtureGif,
      replyTo: "msg_42",
      editedAt: 1700000000000,
    }
    const result = decodeEnvelopeV1(encodeEnvelopeV1(env))
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.envelope).toEqual(env)
  })

  it("rejects oversize envelopes with code ENVELOPE_TOO_LARGE", () => {
    const env: MessageEnvelopeV1 = { v: 1, text: "x".repeat(MAX_ENVELOPE_BYTES) }
    let caught: unknown = null
    try {
      encodeEnvelopeV1(env)
    } catch (err) {
      caught = err
    }
    expect(caught).toBeInstanceOf(Error)
    const err = caught as Error & { code?: string }
    expect(err.code).toBe("ENVELOPE_TOO_LARGE")
  })

  it("refuses to encode a non-1 version", () => {
    const env = { v: 2, text: "x" } as unknown as MessageEnvelopeV1
    expect(() => encodeEnvelopeV1(env)).toThrow(/unsupported version/)
  })
})

describe("decodeEnvelopeV1 — strict cutover", () => {
  it("returns empty for zero-byte input", () => {
    const result = decodeEnvelopeV1(new Uint8Array())
    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.reason).toBe("empty")
  })

  it("returns non-json for legacy plain text", () => {
    const result = decodeEnvelopeV1FromString("hello world")
    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.reason).toBe("non-json")
  })

  it("returns not-object for a JSON array payload", () => {
    const result = decodeEnvelopeV1FromString(JSON.stringify(["arr"]))
    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.reason).toBe("not-object")
  })

  it("returns missing-version when `v` is absent", () => {
    const result = decodeEnvelopeV1FromString(JSON.stringify({ text: "hi" }))
    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.reason).toBe("missing-version")
  })

  it("returns unsupported-version when `v` is not 1", () => {
    const result = decodeEnvelopeV1FromString(JSON.stringify({ v: 2, text: "hi" }))
    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.reason).toBe("unsupported-version")
  })

  it("returns invalid-shape when text is missing", () => {
    const result = decodeEnvelopeV1FromString(JSON.stringify({ v: 1 }))
    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.reason).toBe("invalid-shape")
  })

  it("returns invalid-shape when attachments contains a malformed entry", () => {
    const result = decodeEnvelopeV1FromString(
      JSON.stringify({ v: 1, text: "x", attachments: [{ id: "a" }] })
    )
    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.reason).toBe("invalid-shape")
  })

  it("returns invalid-shape when gif is missing dimensions", () => {
    const result = decodeEnvelopeV1FromString(
      JSON.stringify({
        v: 1,
        text: "x",
        gif: { id: "g", url: "u", previewUrl: "p" },
      })
    )
    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.reason).toBe("invalid-shape")
  })
})
