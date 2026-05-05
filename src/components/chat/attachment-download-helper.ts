/**
 * One-shot decrypt + browser-download trigger for the file-card path.
 *
 * Pulls the presigned URL, fetches ciphertext, decrypts via WebCrypto,
 * and surfaces the plaintext as a saved file. Returns when the
 * download has been initiated (the actual file write is the browser's
 * job and cannot be awaited cross-platform).
 */
import * as api from "@/lib/api"
import { decryptBlob } from "@/lib/attachmentCrypto"
import type { AttachmentRef } from "@/lib/messageEnvelope"

interface Options {
  ref: AttachmentRef
  token: string
  baseUrl?: string
}

export default async function download({ ref, token, baseUrl = "" }: Options): Promise<void> {
  const { url } = await api.getAttachmentDownloadUrl(token, ref.id, baseUrl)
  const res = await fetch(url)
  if (!res.ok) throw new Error(`download ${res.status}`)
  const ciphertext = await res.arrayBuffer()
  const blob = await decryptBlob({ ciphertext, key: ref.key, iv: ref.iv })
  const objectUrl = URL.createObjectURL(blob)
  try {
    const a = document.createElement("a")
    a.href = objectUrl
    a.download = ref.name
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  } finally {
    // Revoke after a tick so the browser has time to read the blob.
    setTimeout(() => URL.revokeObjectURL(objectUrl), 1000)
  }
}
