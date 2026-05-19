/**
 * Shared client-side attachment limits. The server must enforce a
 * compatible ceiling for upload size and content type; the client
 * repeats the checks at upload and envelope-decode boundaries so a
 * malicious sender cannot make recipients render active formats.
 */

/**
 * Ciphertext byte ceiling for a single attachment. Backend enforces
 * the same limit and returns 413 above it. The plaintext is also
 * bounded by the client-side AES-GCM payload formula
 * `plaintext + 16 (auth tag) ≤ MAX_ATTACHMENT_BYTES`, but for files
 * this small the tag delta is negligible.
 */
export const MAX_ATTACHMENT_BYTES = 25 * 1024 * 1024

/** Maximum number of attachments allowed in one composer send. */
export const MAX_ATTACHMENTS_PER_MESSAGE = 4

/**
 * MIME allowlist. Entries are exact, normalized content types. Do not
 * use broad prefixes such as `image/` or `text/`: they admit active
 * formats like SVG or HTML that are unsafe if any future renderer opens
 * them outside download-only mode.
 */
export const ALLOWED_ATTACHMENT_CONTENT_TYPES: ReadonlyArray<string> = [
  "image/gif",
  "image/heic",
  "image/jpeg",
  "image/png",
  "image/webp",
  "audio/mpeg",
  "audio/mp4",
  "audio/ogg",
  "audio/wav",
  "audio/webm",
  "video/mp4",
  "video/webm",
  "text/plain",
  "application/pdf",
]

/**
 * Native file-picker accept list derived from the same MIME allowlist
 * used by upload and decode validation. Keep this exact list in sync
 * with `ALLOWED_ATTACHMENT_CONTENT_TYPES`; do not collapse images to
 * `image/*`, because that admits SVG.
 */
export const ATTACHMENT_FILE_INPUT_ACCEPT =
  ALLOWED_ATTACHMENT_CONTENT_TYPES.join(",")

/**
 * Returns true when the candidate type matches one of the allowlist
 * entries. Empty / whitespace-only strings are rejected.
 */
export function isAttachmentContentTypeAllowed(candidate: string): boolean {
  const ct = candidate.trim().toLowerCase()
  if (!ct) return false
  return ALLOWED_ATTACHMENT_CONTENT_TYPES.includes(ct)
}
