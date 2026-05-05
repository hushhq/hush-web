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

export interface UseAttachmentUploaderOptions {
  serverId: string | null
  channelId: string | null
  getToken: () => string | null
  baseUrl?: string
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
  const { serverId, channelId, getToken, baseUrl = "" } = opts
  const [uploads, setUploads] = React.useState<UploadEntry[]>([])
  const inflightRef = React.useRef<Map<string, InflightController>>(new Map())

  const updateEntry = React.useCallback(
    (localId: string, patch: Partial<UploadEntry>) => {
      setUploads((prev) =>
        prev.map((u) => (u.localId === localId ? { ...u, ...patch } : u))
      )
    },
    []
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
      if (ciphertextSize > MAX_ATTACHMENT_BYTES) {
        updateEntry(entry.localId, {
          status: "failed",
          errorMessage: `file exceeds ${MAX_ATTACHMENT_BYTES} bytes`,
        })
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
        updateEntry(entry.localId, {
          status: "failed",
          errorMessage: errorMessage(err) || "presign failed",
        })
        return
      }

      const controller: InflightController = { xhr: null, cancelled: false }
      inflightRef.current.set(entry.localId, controller)
      updateEntry(entry.localId, { status: "uploading", progress: 0 })

      try {
        await uploadToPresigned(presigned, encrypted.ciphertext, controller, (p) =>
          updateEntry(entry.localId, { progress: p })
        )
      } catch (err) {
        if (controller.cancelled) {
          updateEntry(entry.localId, { status: "cancelled" })
          return
        }
        updateEntry(entry.localId, {
          status: "failed",
          errorMessage: errorMessage(err) || "upload failed",
        })
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
    [serverId, channelId, getToken, baseUrl, updateEntry]
  )

  const add = React.useCallback(
    (files: File[]) => {
      if (!files.length) return
      setUploads((prev) => {
        const remainingSlots = MAX_ATTACHMENTS_PER_MESSAGE - prev.length
        if (remainingSlots <= 0) return prev
        const accepted: UploadEntry[] = []
        for (const file of files.slice(0, remainingSlots)) {
          const localId = nextLocalId()
          if (file.size > MAX_ATTACHMENT_BYTES) {
            accepted.push({
              localId,
              file,
              status: "failed",
              progress: 0,
              errorMessage: `file exceeds ${MAX_ATTACHMENT_BYTES} bytes`,
            })
            continue
          }
          if (!isAttachmentContentTypeAllowed(file.type || "")) {
            accepted.push({
              localId,
              file,
              status: "failed",
              progress: 0,
              errorMessage: "content type not allowed",
            })
            continue
          }
          accepted.push({
            localId,
            file,
            status: "queued",
            progress: 0,
          })
        }
        const next = [...prev, ...accepted]
        // Kick off uploads for the freshly-queued entries.
        accepted
          .filter((e) => e.status === "queued")
          .forEach((e) => void startUpload(e))
        return next
      })
    },
    [startUpload]
  )

  const remove = React.useCallback((localId: string) => {
    const ctrl = inflightRef.current.get(localId)
    if (ctrl) {
      ctrl.cancelled = true
      ctrl.xhr?.abort()
      inflightRef.current.delete(localId)
    }
    setUploads((prev) => prev.filter((u) => u.localId !== localId))
  }, [])

  const retry = React.useCallback(
    (localId: string) => {
      setUploads((prev) => {
        const target = prev.find((u) => u.localId === localId)
        if (!target || (target.status !== "failed" && target.status !== "cancelled")) {
          return prev
        }
        const reset: UploadEntry = {
          ...target,
          status: "queued",
          progress: 0,
          errorMessage: undefined,
          ref: undefined,
        }
        void startUpload(reset)
        return prev.map((u) => (u.localId === localId ? reset : u))
      })
    },
    [startUpload]
  )

  const reset = React.useCallback(() => {
    inflightRef.current.forEach((ctrl) => {
      ctrl.cancelled = true
      ctrl.xhr?.abort()
    })
    inflightRef.current.clear()
    setUploads([])
  }, [])

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

interface PresignedResponse {
  id: string
  uploadUrl: string
  method: string
  headers?: Record<string, string>
  expiresAt: string
}

function uploadToPresigned(
  presigned: PresignedResponse,
  ciphertext: ArrayBuffer,
  controller: InflightController,
  onProgress: (fraction: number) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    controller.xhr = xhr
    xhr.open(presigned.method || "PUT", presigned.uploadUrl, true)
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
        reject(new Error(`upload failed: ${xhr.status}`))
      }
    }
    xhr.onerror = () => reject(new Error("network error"))
    xhr.onabort = () => reject(new Error("aborted"))
    xhr.send(ciphertext)
  })
}
