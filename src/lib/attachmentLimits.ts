/**
 * Shared client-side attachment limits. The server enforces an identical
 * set in `internal/api/attachments.go` (`MaxAttachmentBytes` plus the
 * `allowedAttachmentContentTypes` allowlist). Both sides must agree;
 * keep these constants in lockstep when changing one.
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
 * Mime allowlist. Each entry is matched as a literal exact string OR a
 * `prefix/` (trailing slash → wildcard subtype). The same shape lives
 * in the Go handler.
 */
export const ALLOWED_ATTACHMENT_CONTENT_TYPES: ReadonlyArray<string> = [
  "image/",
  "audio/",
  "video/mp4",
  "video/webm",
  "text/",
  "application/pdf",
]

/**
 * Returns true when the candidate type matches one of the allowlist
 * entries. Empty / whitespace-only strings are rejected.
 */
export function isAttachmentContentTypeAllowed(candidate: string): boolean {
  const ct = candidate.trim().toLowerCase()
  if (!ct) return false
  return ALLOWED_ATTACHMENT_CONTENT_TYPES.some((entry) =>
    entry.endsWith("/") ? ct.startsWith(entry) : ct === entry
  )
}
