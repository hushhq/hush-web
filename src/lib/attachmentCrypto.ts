/**
 * Per-attachment AES-GCM-256 encrypt / decrypt for the chat composer.
 *
 * Each attachment generates a fresh 256-bit key and a 96-bit IV. Both
 * travel inside the MLS-encrypted message envelope as base64 strings
 * (`AttachmentRef.key`, `AttachmentRef.iv`) so the server never sees
 * either. The ciphertext itself goes to the storage backend — opaque
 * bytes, no key material.
 *
 * AES-GCM is non-streaming under WebCrypto, so we encrypt the whole
 * file at once. The 25 MiB ceiling enforced in `attachmentLimits.ts`
 * keeps memory bounded.
 *
 * The `key` returned by `encryptBlob` is base64-encoded raw key bytes;
 * `iv` is base64-encoded 12 bytes. Tampered ciphertext or a wrong key
 * fails decrypt with a thrown DOMException — callers must surface that
 * to the UI as a "decryption failed" tile rather than silently producing
 * garbage.
 */

const AES_GCM_KEY_BITS = 256
const AES_GCM_IV_BYTES = 12

export interface EncryptedBlob {
  ciphertext: ArrayBuffer
  /** base64 of the raw 32-byte AES key. Lives only inside the MLS envelope. */
  key: string
  /** base64 of the 12-byte GCM IV. */
  iv: string
}

export interface DecryptInput {
  ciphertext: ArrayBuffer | Uint8Array
  key: string
  iv: string
}

/**
 * Encrypt a File or Blob and return its ciphertext plus the freshly
 * minted symmetric key + IV. Each call mints fresh key material —
 * never reuse a key across attachments.
 */
export async function encryptBlob(blob: Blob): Promise<EncryptedBlob> {
  const subtle = requireSubtle()
  const cryptoKey = await subtle.generateKey(
    { name: "AES-GCM", length: AES_GCM_KEY_BITS },
    true,
    ["encrypt", "decrypt"]
  )
  const iv = crypto.getRandomValues(new Uint8Array(AES_GCM_IV_BYTES))
  const plaintext = await blob.arrayBuffer()
  const ciphertext = await subtle.encrypt(
    { name: "AES-GCM", iv },
    cryptoKey,
    plaintext
  )
  const rawKey = await subtle.exportKey("raw", cryptoKey)
  return {
    ciphertext,
    key: bufferToBase64(rawKey),
    iv: bufferToBase64(iv.buffer),
  }
}

/**
 * Decrypt a ciphertext blob using the key + IV from the matching
 * `AttachmentRef`. Throws if the key length is wrong, the IV is wrong,
 * or the GCM auth tag does not verify (tampered ciphertext).
 */
export async function decryptBlob(input: DecryptInput): Promise<Blob> {
  const subtle = requireSubtle()
  const rawKey = base64ToBuffer(input.key)
  if (rawKey.byteLength !== AES_GCM_KEY_BITS / 8) {
    throw new Error(
      `attachmentCrypto: key must be ${AES_GCM_KEY_BITS / 8} bytes, got ${rawKey.byteLength}`
    )
  }
  const iv = base64ToBuffer(input.iv)
  if (iv.byteLength !== AES_GCM_IV_BYTES) {
    throw new Error(
      `attachmentCrypto: iv must be ${AES_GCM_IV_BYTES} bytes, got ${iv.byteLength}`
    )
  }
  const cryptoKey = await subtle.importKey(
    "raw",
    rawKey,
    { name: "AES-GCM" },
    false,
    ["decrypt"]
  )
  const ct =
    input.ciphertext instanceof Uint8Array
      ? input.ciphertext
      : new Uint8Array(input.ciphertext)
  const plaintext = await subtle.decrypt(
    { name: "AES-GCM", iv: new Uint8Array(iv) as Uint8Array<ArrayBuffer> },
    cryptoKey,
    ct as Uint8Array<ArrayBuffer>
  )
  return new Blob([plaintext])
}

function requireSubtle(): SubtleCrypto {
  if (typeof crypto === "undefined" || !crypto.subtle) {
    throw new Error(
      "attachmentCrypto: crypto.subtle unavailable — secure context required"
    )
  }
  return crypto.subtle
}

function bufferToBase64(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf)
  let bin = ""
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i])
  return btoa(bin)
}

function base64ToBuffer(b64: string): ArrayBuffer {
  const bin = atob(b64)
  const out = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i)
  return out.buffer
}
