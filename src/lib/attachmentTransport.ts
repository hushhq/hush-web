/**
 * Shared URL/auth resolver for attachment blob transport.
 *
 * The server `presign` and `download` endpoints can return either:
 *
 *   - Absolute `http(s)://...` URLs — real S3/R2/MinIO presigned URLs.
 *     The browser must hit them as-is and MUST NOT forward the user's
 *     bearer token (signed querystring is the only auth).
 *   - Relative `/api/...` URLs — the in-API `postgres_bytea` fallback
 *     served from the API process itself. The client resolves them
 *     against the instance origin (`baseUrl`) and attaches
 *     `Authorization: Bearer <token>` so the route can authorise.
 *
 * Anything else is rejected by both helpers below so the renderer fails
 * fast with a diagnostic, instead of silently fetching against the
 * Electron `app://localhost` origin (which produced the original desktop
 * attachment-upload regression).
 */

export interface ResolvedAttachmentBlobUrl {
  url: string
  isInApiFallback: boolean
}

/**
 * Resolves the URL the client should hit for the attachment blob.
 *
 * - Absolute `http(s)://` URLs pass through unchanged.
 * - Relative URLs starting with `/api/` are joined to `baseUrl`. The
 *   returned `isInApiFallback` flag tells the caller it must attach
 *   the JWT.
 * - Anything else returns `null`.
 */
export function resolveAttachmentBlobUrl(
  rawUrl: string | null | undefined,
  baseUrl: string | null | undefined
): ResolvedAttachmentBlobUrl | null {
  if (!rawUrl) return null
  if (/^https?:\/\//i.test(rawUrl)) {
    return { url: rawUrl, isInApiFallback: false }
  }
  if (rawUrl.startsWith("/api/")) {
    const trimmedBase = (baseUrl ?? "").replace(/\/+$/, "")
    if (!trimmedBase) return null
    return { url: `${trimmedBase}${rawUrl}`, isInApiFallback: true }
  }
  return null
}

/**
 * Builds the `RequestInit` for a `fetch()` against a resolved blob URL.
 * Adds `Authorization: Bearer` only when the URL is the in-API fallback;
 * absolute presigned URLs MUST NOT receive the user's JWT.
 */
export function buildAttachmentFetchInit(
  resolved: ResolvedAttachmentBlobUrl,
  token: string | null | undefined
): RequestInit {
  if (!resolved.isInApiFallback) return {}
  if (!token) return {}
  return { headers: { Authorization: `Bearer ${token}` } }
}
