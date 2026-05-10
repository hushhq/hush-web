/**
 * Validates URLs that arrive over the wire inside encrypted message
 * envelopes (GIF picks today; image attachments served directly by
 * URL would land here too in the future).
 *
 * Threat model: a malicious group member crafts a `GifRef.url` with a
 * `javascript:`, `data:text/html`, `blob:`, or `file:` scheme so a
 * recipient's renderer (currently `<img src={...}>`, but could change)
 * triggers script execution or local-file disclosure. The renderer
 * itself runs in img secure-mode for now, but defence-in-depth at the
 * envelope-decode boundary keeps the surface narrow even if a future
 * renderer (`<video>`, lightbox `<iframe>`, "open in new tab") loosens
 * the trust.
 *
 * Policy: accept only `https:` URLs that parse cleanly via the URL
 * constructor. The scheme check is on the parsed `url.protocol` rather
 * than a substring match so percent-encoded or whitespace-padded
 * schemes (`%6Aavascript:` / `\tjavascript:`) cannot bypass it. Reject
 * everything else, including:
 *   - `http:` (downgrade attack on a recipient on a TLS network),
 *   - `javascript:` / `vbscript:` (script execution),
 *   - `data:` / `blob:` (renderer-controlled active payload),
 *   - `file:` / `chrome:` / custom schemes (local-file / chrome-internals
 *     disclosure on packaged Electron clients).
 */

const ALLOWED_PROTOCOLS = new Set(['https:']);

/**
 * @param {unknown} candidate the URL to validate
 * @returns {boolean} true when the candidate is a parseable https URL
 */
export function isSafeMediaUrl(candidate: unknown): boolean {
  if (typeof candidate !== 'string' || candidate.length === 0) return false;
  let parsed: URL;
  try {
    parsed = new URL(candidate);
  } catch {
    return false;
  }
  return ALLOWED_PROTOCOLS.has(parsed.protocol);
}
