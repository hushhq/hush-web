/**
 * MLS plaintext envelope (v1).
 *
 * Every message we send through the MLS group is JSON-encoded into this
 * shape and then handed to the encryptor as bytes. Every message we
 * receive is decrypted to bytes, decoded as UTF-8, and parsed back into
 * this shape. The wire ciphertext stays opaque to the server; the server
 * still enforces the same `MAX_ENVELOPE_BYTES` budget that the legacy
 * raw-string sends used (the underlying MLS application-message budget
 * is roughly 8 KiB; we cap our envelope well under that to leave room
 * for the MLS framing).
 *
 * STRICT CUTOVER: there is no fallback path for non-JSON plaintext over
 * the wire. Anything that fails JSON parse or that lacks `v: 1` is
 * treated as a corrupt payload and surfaces the same recovery
 * placeholder as a real decryption failure. Legacy rows previously
 * stored as bare strings live in the local transcript vault and are
 * keyed by `vaultVersion: 0` so they bypass the JSON parse on render.
 *
 * All numeric / size / shape validation lives here so the rest of the
 * app never sees a half-validated envelope. Adding fields in the future
 * (reactions, edits, poll votes, …) means bumping `v` and adding a
 * decoder branch — never adding optional fields silently to the v1
 * decoder.
 */

/**
 * Conservative byte budget for the JSON envelope. Backend caps
 * ciphertext at 8 KiB (handlers.go); MLS framing eats some of that, so
 * we hold the plaintext under 4 KiB the same way legacy
 * `MAX_PLAINTEXT_BYTES` did. Counted in UTF-8 bytes, not characters.
 */
export const MAX_ENVELOPE_BYTES = 4000

/**
 * Threshold (fraction of `MAX_ENVELOPE_BYTES`) at which the composer
 * shows a visible byte counter. Mirrors the legacy `COUNTER_SHOW_THRESHOLD`.
 */
export const ENVELOPE_COUNTER_THRESHOLD = 0.8

/** Reference to a Tenor (or future GIF provider) result the user picked. */
export interface GifRef {
  /** Provider-side result id; opaque, used for analytics / dedupe. */
  id: string
  /** Direct-play URL (.gif or .mp4) — what the renderer plays. */
  url: string
  /** Smaller poster URL used inside the picker grid. */
  previewUrl: string
  width: number
  height: number
}

/**
 * Reference to an attachment that has already been encrypted and uploaded
 * to the instance's storage backend (MinIO / S3). The symmetric key and
 * IV stay inside the MLS-encrypted plaintext — the server never sees them
 * and therefore can never decrypt the blob.
 */
export interface AttachmentRef {
  /** Attachment row id minted by the backend at presign time. */
  id: string
  /** Original filename, sanitized client-side. Stays for display only. */
  name: string
  /** Ciphertext byte size as uploaded to storage. */
  size: number
  /** Original mime type, advisory only — backend cannot verify it. */
  mimeType: string
  /** base64(AES-GCM 256-bit key). Never leaves the MLS group. */
  key: string
  /** base64(12-byte AES-GCM nonce). */
  iv: string
  /** For image/* mimes: source dimensions (avoid layout shift on render). */
  width?: number
  height?: number
}

/** v1 envelope shape. The only shape we encode for new sends today. */
export interface MessageEnvelopeV1 {
  v: 1
  /** Markdown body. May be empty when the message is "attachments only". */
  text: string
  attachments?: AttachmentRef[]
  /** A single inline GIF; the composer rejects gif + attachments together. */
  gif?: GifRef
  /** Reserved: id of a message this one replies to. UI lands later. */
  replyTo?: string
  /** Reserved: unix ms when the author last edited. UI lands later. */
  editedAt?: number
}

/** Discriminated union of every envelope version we know how to read. */
export type MessageEnvelope = MessageEnvelopeV1

/** Internal: TextEncoder reused across calls — Node + browsers both have it. */
const textEncoder = new TextEncoder()
const textDecoder = new TextDecoder("utf-8", { fatal: false })

/**
 * Encode an envelope as UTF-8 bytes ready to hand to the MLS encryptor.
 *
 * Throws when the encoded payload would exceed `MAX_ENVELOPE_BYTES`. The
 * composer calls this synchronously when computing the byte counter and
 * again right before sending; both calls must agree on the limit so the
 * counter UX never lies.
 */
export function encodeEnvelopeV1(envelope: MessageEnvelopeV1): Uint8Array {
  if (envelope.v !== 1) {
    throw new Error(`encodeEnvelopeV1: unsupported version ${envelope.v}`)
  }
  // Drop optional keys with `undefined` values rather than serialising
  // `"editedAt":undefined` (which JSON.stringify would emit as the key
  // missing anyway, but being explicit avoids future drift).
  const stripped: MessageEnvelopeV1 = {
    v: 1,
    text: envelope.text,
    ...(envelope.attachments && envelope.attachments.length > 0
      ? { attachments: envelope.attachments }
      : {}),
    ...(envelope.gif ? { gif: envelope.gif } : {}),
    ...(envelope.replyTo ? { replyTo: envelope.replyTo } : {}),
    ...(typeof envelope.editedAt === "number" ? { editedAt: envelope.editedAt } : {}),
  }
  const json = JSON.stringify(stripped)
  const bytes = textEncoder.encode(json)
  if (bytes.byteLength > MAX_ENVELOPE_BYTES) {
    const err = new Error(
      `Message too large: ${bytes.byteLength} bytes, max ${MAX_ENVELOPE_BYTES}`
    )
    ;(err as Error & { code?: string }).code = "ENVELOPE_TOO_LARGE"
    throw err
  }
  return bytes
}

/** Result of decoding an arbitrary plaintext we got off the wire. */
export type DecodeResult =
  | { ok: true; envelope: MessageEnvelopeV1 }
  | { ok: false; reason: DecodeFailure }

export type DecodeFailure =
  | "empty"
  | "non-utf8"
  | "non-json"
  | "not-object"
  | "missing-version"
  | "unsupported-version"
  | "invalid-shape"

/**
 * Decode bytes back into an envelope. Always returns a tagged result;
 * never throws. Callers that want fail-loud behaviour can branch on
 * `ok === false` and surface the recovery placeholder.
 *
 * Strict cutover: any non-JSON, version-less, or shape-invalid payload
 * lands as `{ ok: false }` and the caller treats it as an undecryptable
 * message — there is no path for a legacy raw string to produce
 * `{ ok: true }` here.
 */
export function decodeEnvelopeV1(bytes: Uint8Array): DecodeResult {
  if (!bytes || bytes.byteLength === 0) {
    return { ok: false, reason: "empty" }
  }
  let text: string
  try {
    text = textDecoder.decode(bytes)
  } catch {
    return { ok: false, reason: "non-utf8" }
  }
  return decodeEnvelopeV1FromString(text)
}

/**
 * Same as `decodeEnvelopeV1` but starts from an already-decoded UTF-8
 * string. Used by the transcript vault path, which stores plaintext as
 * a string today and never retains the original bytes.
 */
export function decodeEnvelopeV1FromString(text: string): DecodeResult {
  if (text.length === 0) {
    return { ok: false, reason: "empty" }
  }
  let parsed: unknown
  try {
    parsed = JSON.parse(text)
  } catch {
    return { ok: false, reason: "non-json" }
  }
  if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
    return { ok: false, reason: "not-object" }
  }
  const candidate = parsed as Partial<MessageEnvelopeV1> & { v?: unknown }
  if (typeof candidate.v !== "number") {
    return { ok: false, reason: "missing-version" }
  }
  if (candidate.v !== 1) {
    return { ok: false, reason: "unsupported-version" }
  }
  if (!isV1Shape(candidate)) {
    return { ok: false, reason: "invalid-shape" }
  }
  return { ok: true, envelope: candidate }
}

/**
 * Convenience: round-trip a plain text body through `encode → decode` to
 * mint the canonical envelope a "send only text" composer call would
 * produce. Useful in tests and in legacy-vault rehydration of older
 * plaintext rows once their `vaultVersion` is bumped to 1.
 */
export function envelopeFromText(text: string): MessageEnvelopeV1 {
  return { v: 1, text }
}

function isV1Shape(value: Partial<MessageEnvelopeV1>): value is MessageEnvelopeV1 {
  if (typeof value.text !== "string") return false
  if (value.attachments !== undefined) {
    if (!Array.isArray(value.attachments)) return false
    if (!value.attachments.every(isAttachmentRef)) return false
  }
  if (value.gif !== undefined && !isGifRef(value.gif)) return false
  if (value.replyTo !== undefined && typeof value.replyTo !== "string") return false
  if (value.editedAt !== undefined && typeof value.editedAt !== "number") return false
  return true
}

function isAttachmentRef(value: unknown): value is AttachmentRef {
  if (value === null || typeof value !== "object") return false
  const v = value as Partial<AttachmentRef>
  return (
    typeof v.id === "string" &&
    typeof v.name === "string" &&
    typeof v.size === "number" &&
    typeof v.mimeType === "string" &&
    typeof v.key === "string" &&
    typeof v.iv === "string" &&
    (v.width === undefined || typeof v.width === "number") &&
    (v.height === undefined || typeof v.height === "number")
  )
}

function isGifRef(value: unknown): value is GifRef {
  if (value === null || typeof value !== "object") return false
  const v = value as Partial<GifRef>
  return (
    typeof v.id === "string" &&
    typeof v.url === "string" &&
    typeof v.previewUrl === "string" &&
    typeof v.width === "number" &&
    typeof v.height === "number"
  )
}
