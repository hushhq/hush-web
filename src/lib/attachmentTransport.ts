export interface ResolvedAttachmentBlobUrl {
  url: string
  isInApiFallback: boolean
}

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

export function buildAttachmentFetchInit(
  resolved: ResolvedAttachmentBlobUrl,
  token: string | null | undefined
): RequestInit {
  if (!resolved.isInApiFallback || !token) return {}
  return { headers: { Authorization: `Bearer ${token}` } }
}
