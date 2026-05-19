/**
 * Encrypts and uploads selected files to the configured storage
 * backend, then returns one `AttachmentRef` per file ready to be
 * dropped into the outgoing MLS message envelope.
 *
 * The hook is purely client-side except for `presignAttachment` and
 * the direct PUT to the presigned URL — the server never sees plaintext
 * bytes or the AES-GCM key. Per-file progress is reported via XHR so
 * the composer dock can render meaningful upload bars; cancel and
 * retry are exposed for failed entries.
 */
import * as React from "react"

import * as api from "@/lib/api"
import { encryptBlob } from "@/lib/attachmentCrypto"
import {
  MAX_ATTACHMENT_BYTES,
  MAX_ATTACHMENTS_PER_MESSAGE,
  isAttachmentContentTypeAllowed,
} from "@/lib/attachmentLimits"
import { resolveAttachmentBlobUrl } from "@/lib/attachmentTransport"
import type { AttachmentRef } from "@/lib/messageEnvelope"

export type UploadStatus =
  | "queued"
  | "encrypting"
  | "uploading"
  | "ready"
  | "failed"
  | "cancelled"

export interface UploadEntry {
  /** Local-only id; differs from the backend attachment id. */
  localId: string
  file: File
  status: UploadStatus
  /** 0..1, only meaningful while `status === "uploading"`. */
  progress: number
  errorMessage?: string
  /** Populated when `status === "ready"`. */
  ref?: AttachmentRef
}

export type AttachmentUploadRejectionReason =
  | "too_large"
  | "unsupported_type"
  | "too_many"
  | "presign_failed"
  | "upload_failed"

export interface AttachmentUploadRejection {
  file: File
  reason: AttachmentUploadRejectionReason
  message: string
}

export interface UseAttachmentUploaderOptions {
  serverId: string | null
  channelId: string | null
  getToken: () => string | null
  baseUrl?: string
  maxAttachmentBytes?: number
  onRejected?: (rejection: AttachmentUploadRejection) => void
}

export interface UseAttachmentUploaderResult {
  uploads: UploadEntry[]
  add: (files: File[]) => void
  remove: (localId: string) => void
  retry: (localId: string) => void
  reset: () => void
  /** True when at least one entry is still encrypting / uploading. */
  isUploading: boolean
  /** Returns the AttachmentRefs for entries currently `ready`. */
  collectRefs: () => AttachmentRef[]
}

interface InflightController {
  xhr: XMLHttpRequest | null
  cancelled: boolean
}

let _localIdCounter = 0

function nextLocalId(): string {
  _localIdCounter += 1
  return `att-local-${Date.now()}-${_localIdCounter}`
}

export function useAttachmentUploader(
  opts: UseAttachmentUploaderOptions
): UseAttachmentUploaderResult {
  const {
    serverId,
    channelId,
    getToken,
    baseUrl = "",
    maxAttachmentBytes = MAX_ATTACHMENT_BYTES,
    onRejected,
  } = opts
  const [uploads, setUploads] = React.useState<UploadEntry[]>([])
  // Mirror of `uploads` that updates synchronously alongside every
  // `setUploads` call so callbacks can read the latest list outside a
  // React state updater. Required because state updaters must stay
  // pure under Strict Mode / concurrent rendering — kicking off
  // presign+encrypt+upload from inside the updater would duplicate
  // every side effect when React invokes the function twice.
  const uploadsRef = React.useRef<UploadEntry[]>([])
  const inflightRef = React.useRef<Map<string, InflightController>>(new Map())

  const commitUploads = React.useCallback(
    (updater: (prev: UploadEntry[]) => UploadEntry[]) => {
      const next = updater(uploadsRef.current)
      uploadsRef.current = next
      setUploads(next)
    },
    []
  )

  const updateEntry = React.useCallback(
    (localId: string, patch: Partial<UploadEntry>) => {
      commitUploads((prev) =>
        prev.map((u) => (u.localId === localId ? { ...u, ...patch } : u))
      )
    },
    [commitUploads]
  )

  const startUpload = React.useCallback(
    async (entry: UploadEntry) => {
      if (!serverId || !channelId) {
        updateEntry(entry.localId, {
          status: "failed",
          errorMessage: "channel not selected",
        })
        return
      }
      const token = getToken()
      if (!token) {
        updateEntry(entry.localId, {
          status: "failed",
          errorMessage: "no auth token",
        })
        return
      }

      // Encrypt first so the size we hand the presign endpoint matches
      // the bytes we PUT (AES-GCM appends a 16-byte auth tag, so the
      // ciphertext is plaintext + 16; the presign happens on the
      // ciphertext size that the server actually receives).
      updateEntry(entry.localId, { status: "encrypting", progress: 0 })
      let encrypted
      try {
        encrypted = await encryptBlob(entry.file)
      } catch (err) {
        updateEntry(entry.localId, {
          status: "failed",
          errorMessage: errorMessage(err) || "encryption failed",
        })
        return
      }
      const ciphertextSize = encrypted.ciphertext.byteLength
      if (ciphertextSize > maxAttachmentBytes) {
        const message = tooLargeMessage(entry.file.name, maxAttachmentBytes)
        updateEntry(entry.localId, {
          status: "failed",
          errorMessage: message,
        })
        onRejected?.({ file: entry.file, reason: "too_large", message })
        return
      }

      let presigned: Awaited<ReturnType<typeof api.presignAttachment>>
      try {
        presigned = await api.presignAttachment(
          token,
          serverId,
          channelId,
          { size: ciphertextSize, contentType: entry.file.type || "application/octet-stream" },
          baseUrl
        )
      } catch (err) {
        const message = prefixError("presign failed", err)
        updateEntry(entry.localId, {
          status: "failed",
          errorMessage: message,
        })
        onRejected?.({ file: entry.file, reason: "presign_failed", message })
        return
      }

      const controller: InflightController = { xhr: null, cancelled: false }
      inflightRef.current.set(entry.localId, controller)
      updateEntry(entry.localId, { status: "uploading", progress: 0 })

      try {
        await uploadToPresigned(
          presigned,
          encrypted.ciphertext,
          { baseUrl, token },
          controller,
          (p) => updateEntry(entry.localId, { progress: p })
        )
      } catch (err) {
        if (controller.cancelled) {
          updateEntry(entry.localId, { status: "cancelled" })
          return
        }
        const message = prefixError("upload failed", err)
        updateEntry(entry.localId, {
          status: "failed",
          errorMessage: message,
        })
        onRejected?.({ file: entry.file, reason: "upload_failed", message })
        return
      } finally {
        inflightRef.current.delete(entry.localId)
      }

      const ref: AttachmentRef = {
        id: presigned.id,
        name: entry.file.name,
        size: ciphertextSize,
        mimeType: entry.file.type || "application/octet-stream",
        key: encrypted.key,
        iv: encrypted.iv,
        ...(typeof entry.file.size === "number" ? {} : {}),
      }
      updateEntry(entry.localId, {
        status: "ready",
        progress: 1,
        ref,
      })
    },
    [
      serverId,
      channelId,
      getToken,
      baseUrl,
      maxAttachmentBytes,
      updateEntry,
      onRejected,
    ]
  )

  const add = React.useCallback(
    (files: File[]) => {
      if (!files.length) return
      const remainingSlots =
        MAX_ATTACHMENTS_PER_MESSAGE - uploadsRef.current.length
      if (remainingSlots <= 0) {
        for (const file of files) {
          onRejected?.({
            file,
            reason: "too_many",
            message: `Cannot attach more than ${MAX_ATTACHMENTS_PER_MESSAGE} files.`,
          })
        }
        return
      }
      const accepted: UploadEntry[] = []
      const rejectedOverflow = files.slice(remainingSlots)
      for (const file of rejectedOverflow) {
        onRejected?.({
          file,
          reason: "too_many",
          message: `Cannot attach more than ${MAX_ATTACHMENTS_PER_MESSAGE} files.`,
        })
      }
      for (const file of files.slice(0, remainingSlots)) {
        const localId = nextLocalId()
        if (file.size > maxAttachmentBytes) {
          const message = tooLargeMessage(file.name, maxAttachmentBytes)
          accepted.push({
            localId,
            file,
            status: "failed",
            progress: 0,
            errorMessage: message,
          })
          onRejected?.({ file, reason: "too_large", message })
          continue
        }
        if (!isAttachmentContentTypeAllowed(file.type || "")) {
          const message = `${file.name} is not a supported attachment type.`
          accepted.push({
            localId,
            file,
            status: "failed",
            progress: 0,
            errorMessage: message,
          })
          onRejected?.({ file, reason: "unsupported_type", message })
          continue
        }
        accepted.push({
          localId,
          file,
          status: "queued",
          progress: 0,
        })
      }
      commitUploads((prev) => [...prev, ...accepted])
      accepted
        .filter((e) => e.status === "queued")
        .forEach((e) => void startUpload(e))
    },
    [commitUploads, maxAttachmentBytes, onRejected, startUpload]
  )

  const remove = React.useCallback(
    (localId: string) => {
      const ctrl = inflightRef.current.get(localId)
      if (ctrl) {
        ctrl.cancelled = true
        ctrl.xhr?.abort()
        inflightRef.current.delete(localId)
      }
      commitUploads((prev) => prev.filter((u) => u.localId !== localId))
    },
    [commitUploads]
  )

  const retry = React.useCallback(
    (localId: string) => {
      const target = uploadsRef.current.find((u) => u.localId === localId)
      if (
        !target ||
        (target.status !== "failed" && target.status !== "cancelled")
      ) {
        return
      }
      const reset: UploadEntry = {
        ...target,
        status: "queued",
        progress: 0,
        errorMessage: undefined,
        ref: undefined,
      }
      commitUploads((prev) =>
        prev.map((u) => (u.localId === localId ? reset : u))
      )
      void startUpload(reset)
    },
    [commitUploads, startUpload]
  )

  const reset = React.useCallback(() => {
    inflightRef.current.forEach((ctrl) => {
      ctrl.cancelled = true
      ctrl.xhr?.abort()
    })
    inflightRef.current.clear()
    commitUploads(() => [])
  }, [commitUploads])

  const isUploading = uploads.some(
    (u) => u.status === "encrypting" || u.status === "uploading" || u.status === "queued"
  )

  const collectRefs = React.useCallback(
    () =>
      uploads
        .filter((u): u is UploadEntry & { ref: AttachmentRef } =>
          Boolean(u.ref && u.status === "ready")
        )
        .map((u) => u.ref),
    [uploads]
  )

  return { uploads, add, remove, retry, reset, isUploading, collectRefs }
}

function errorMessage(err: unknown): string {
  if (err instanceof Error) return err.message
  if (typeof err === "string") return err
  return ""
}

function prefixError(prefix: string, err: unknown): string {
  const msg = errorMessage(err)
  return msg ? `${prefix}: ${msg}` : prefix
}

function tooLargeMessage(fileName: string, maxAttachmentBytes: number): string {
  return `${fileName} exceeds the ${humanSize(maxAttachmentBytes)} attachment limit.`
}

function humanSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

interface PresignedResponse {
  id: string
  uploadUrl: string
  method: string
  headers?: Record<string, string>
  expiresAt: string
}

interface UploadContext {
  baseUrl: string
  token: string
}

export function uploadToPresigned(
  presigned: PresignedResponse,
  ciphertext: ArrayBuffer,
  ctx: UploadContext,
  controller: InflightController,
  onProgress: (fraction: number) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    controller.xhr = xhr
    const resolved = resolveAttachmentBlobUrl(presigned.uploadUrl, ctx.baseUrl)
    if (!resolved) {
      reject(new Error(`invalid upload URL: ${presigned.uploadUrl}`))
      return
    }
    xhr.open(presigned.method || "PUT", resolved.url, true)
    if (resolved.isInApiFallback && ctx.token) {
      try {
        xhr.setRequestHeader("Authorization", `Bearer ${ctx.token}`)
      } catch {
        // Surfaced as a network/upload error below.
      }
    }
    if (presigned.headers) {
      for (const [k, v] of Object.entries(presigned.headers)) {
        try {
          xhr.setRequestHeader(k, v)
        } catch {
          // Some headers cannot be set from JS (host, content-length, …).
          // The presigned URL already encodes them; ignore.
        }
      }
    }
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(e.loaded / e.total)
    }
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve()
      } else {
        const body = xhr.responseText
        const detail = body ? `: ${truncate(body, 200)}` : ""
        reject(new Error(`HTTP ${xhr.status}${detail}`))
      }
    }
    xhr.onerror = () => reject(new Error("network error"))
    xhr.onabort = () => reject(new Error("aborted"))
    xhr.send(ciphertext)
  })
}

function truncate(value: string, max: number): string {
  if (value.length <= max) return value
  return `${value.slice(0, max)}...`
}
