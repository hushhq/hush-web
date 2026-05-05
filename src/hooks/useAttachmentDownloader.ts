/**
 * Lazy attachment download + decrypt for the chat surface.
 *
 * Given an `AttachmentRef` (which carries `id`, AES-GCM `key`, and
 * `iv`), the hook fetches the presigned download URL, pulls the
 * ciphertext, decrypts to a Blob, and exposes a stable ObjectURL the
 * caller renders. ObjectURLs are revoked on unmount and on ref change
 * to keep memory bounded.
 *
 * Decryption failure (tampered ciphertext, key mismatch) surfaces as
 * `error` so the chat tile can render a "decryption failed" state
 * instead of a broken image. The download is fired only after the
 * caller indicates the tile entered the viewport — bulk decrypt of a
 * scrollback chunk would otherwise pin too much memory.
 */
import * as React from "react"

import * as api from "@/lib/api"
import { decryptBlob } from "@/lib/attachmentCrypto"
import type { AttachmentRef } from "@/lib/messageEnvelope"

export type DownloadState = "idle" | "loading" | "ready" | "failed"

export interface UseAttachmentDownloaderOptions {
  ref: AttachmentRef
  getToken: () => string | null
  baseUrl?: string
  /** When false the hook stays idle — wire to an IntersectionObserver. */
  enabled?: boolean
}

export interface UseAttachmentDownloaderResult {
  state: DownloadState
  /** ObjectURL for the decrypted Blob; null until `state === "ready"`. */
  objectUrl: string | null
  errorMessage: string | null
  /** Force a fresh attempt after a failure. */
  retry: () => void
}

export function useAttachmentDownloader(
  opts: UseAttachmentDownloaderOptions
): UseAttachmentDownloaderResult {
  const { ref, getToken, baseUrl = "", enabled = true } = opts
  const [state, setState] = React.useState<DownloadState>("idle")
  const [objectUrl, setObjectUrl] = React.useState<string | null>(null)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)
  const [attempt, setAttempt] = React.useState(0)
  const objectUrlRef = React.useRef<string | null>(null)

  const cleanup = React.useCallback(() => {
    if (objectUrlRef.current) {
      try {
        URL.revokeObjectURL(objectUrlRef.current)
      } catch {
        // Some test environments (jsdom) lack URL.revokeObjectURL.
      }
      objectUrlRef.current = null
    }
  }, [])

  React.useEffect(() => () => cleanup(), [cleanup])

  React.useEffect(() => {
    if (!enabled) return
    let cancelled = false

    const run = async () => {
      const token = getToken()
      if (!token) {
        setState("failed")
        setErrorMessage("no auth token")
        return
      }
      setState("loading")
      setErrorMessage(null)
      try {
        const { url } = await api.getAttachmentDownloadUrl(token, ref.id, baseUrl)
        const res = await fetch(url)
        if (!res.ok) throw new Error(`download ${res.status}`)
        const ciphertext = await res.arrayBuffer()
        const blob = await decryptBlob({
          ciphertext,
          key: ref.key,
          iv: ref.iv,
        })
        if (cancelled) return
        cleanup()
        const next = URL.createObjectURL(blob)
        objectUrlRef.current = next
        setObjectUrl(next)
        setState("ready")
      } catch (err) {
        if (cancelled) return
        setState("failed")
        setErrorMessage(err instanceof Error ? err.message : "download failed")
      }
    }
    void run()
    return () => {
      cancelled = true
    }
  }, [enabled, ref.id, ref.key, ref.iv, baseUrl, getToken, cleanup, attempt])

  const retry = React.useCallback(() => {
    setAttempt((n) => n + 1)
  }, [])

  return { state, objectUrl, errorMessage, retry }
}
