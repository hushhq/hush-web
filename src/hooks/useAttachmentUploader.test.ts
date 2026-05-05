/**
 * Behavioural cover for useAttachmentUploader. The encrypt path uses
 * the real WebCrypto, the network path is stubbed via XHR + fetch
 * mocks, and presign goes through the api shim.
 */
import { describe, it, expect, vi, beforeEach } from "vitest"
import { renderHook, act, waitFor } from "@testing-library/react"

import { useAttachmentUploader } from "./useAttachmentUploader"
import { MAX_ATTACHMENT_BYTES } from "@/lib/attachmentLimits"

const mockPresignAttachment = vi.fn()

vi.mock("@/lib/api", () => ({
  presignAttachment: (...args: unknown[]) => mockPresignAttachment(...args),
}))

class MockUploadXHR {
  static instances: MockUploadXHR[] = []
  status = 0
  readyState = 0
  upload = { onprogress: null as ((e: ProgressEvent) => void) | null }
  onload: (() => void) | null = null
  onerror: (() => void) | null = null
  onabort: (() => void) | null = null
  body: unknown = null
  aborted = false

  constructor() {
    MockUploadXHR.instances.push(this)
  }

  open() {}
  setRequestHeader() {}
  send(body: unknown) {
    this.body = body
    queueMicrotask(() => {
      this.status = 200
      this.onload?.()
    })
  }
  abort() {
    this.aborted = true
    this.onabort?.()
  }
}

beforeEach(() => {
  vi.clearAllMocks()
  MockUploadXHR.instances = []
  // @ts-expect-error — jsdom doesn't ship XMLHttpRequest; fake it.
  globalThis.XMLHttpRequest = MockUploadXHR
  mockPresignAttachment.mockResolvedValue({
    id: "att-server-1",
    uploadUrl: "https://example.test/upload/x",
    method: "PUT",
    headers: {},
    expiresAt: new Date(Date.now() + 60_000).toISOString(),
  })
})

function makeFile(name: string, size: number, type = "image/png"): File {
  const buf = new Uint8Array(size)
  return new File([buf], name, { type })
}

describe("useAttachmentUploader", () => {
  it("encrypts, presigns, and PUTs a file end-to-end", async () => {
    const { result } = renderHook(() =>
      useAttachmentUploader({
        serverId: "srv-1",
        channelId: "ch-1",
        getToken: () => "token",
      })
    )

    await act(async () => {
      result.current.add([makeFile("a.png", 1024)])
    })

    await waitFor(() => {
      expect(result.current.uploads[0]?.status).toBe("ready")
    })
    expect(mockPresignAttachment).toHaveBeenCalledTimes(1)
    expect(MockUploadXHR.instances).toHaveLength(1)
    const [refs] = [result.current.collectRefs()]
    expect(refs[0].id).toBe("att-server-1")
    expect(refs[0].mimeType).toBe("image/png")
    expect(refs[0].key).toMatch(/^[A-Za-z0-9+/=]+$/)
  })

  it("rejects an oversize file before encrypt or presign", async () => {
    const { result } = renderHook(() =>
      useAttachmentUploader({
        serverId: "srv-1",
        channelId: "ch-1",
        getToken: () => "token",
      })
    )

    await act(async () => {
      result.current.add([makeFile("big.png", MAX_ATTACHMENT_BYTES + 1)])
    })

    await waitFor(() => {
      expect(result.current.uploads[0]?.status).toBe("failed")
    })
    expect(mockPresignAttachment).not.toHaveBeenCalled()
    expect(MockUploadXHR.instances).toHaveLength(0)
  })

  it("propagates a presign 4xx as failed status", async () => {
    mockPresignAttachment.mockRejectedValueOnce(new Error("presign 413"))
    const { result } = renderHook(() =>
      useAttachmentUploader({
        serverId: "srv-1",
        channelId: "ch-1",
        getToken: () => "token",
      })
    )

    await act(async () => {
      result.current.add([makeFile("ok.png", 64)])
    })

    await waitFor(() => {
      expect(result.current.uploads[0]?.status).toBe("failed")
    })
    expect(result.current.uploads[0]?.errorMessage).toMatch(/presign 413/)
  })

  it("rejects a non-allowlisted mime type without hitting the network", async () => {
    const { result } = renderHook(() =>
      useAttachmentUploader({
        serverId: "srv-1",
        channelId: "ch-1",
        getToken: () => "token",
      })
    )

    await act(async () => {
      result.current.add([makeFile("evil.bin", 16, "application/x-evil")])
    })

    await waitFor(() => {
      expect(result.current.uploads[0]?.status).toBe("failed")
    })
    expect(mockPresignAttachment).not.toHaveBeenCalled()
  })
})
