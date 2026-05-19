/**
 * Behavioural cover for useAttachmentUploader. The encrypt path uses
 * the real WebCrypto, the network path is stubbed via XHR + fetch
 * mocks, and presign goes through the api shim.
 */
import * as React from "react"
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
  static nextStatus = 200
  static nextResponseText = ""
  status = 0
  readyState = 0
  responseText = ""
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
      this.status = MockUploadXHR.nextStatus
      this.responseText = MockUploadXHR.nextResponseText
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
  MockUploadXHR.nextStatus = 200
  MockUploadXHR.nextResponseText = ""
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

  it("uses the instance max attachment size when provided", async () => {
    const onRejected = vi.fn()
    const { result } = renderHook(() =>
      useAttachmentUploader({
        serverId: "srv-1",
        channelId: "ch-1",
        getToken: () => "token",
        maxAttachmentBytes: 128,
        onRejected,
      })
    )

    await act(async () => {
      result.current.add([makeFile("too-big.png", 129)])
    })

    await waitFor(() => {
      expect(result.current.uploads[0]?.status).toBe("failed")
    })
    expect(result.current.uploads[0]?.errorMessage).toMatch(/128 B/)
    expect(onRejected).toHaveBeenCalledWith(
      expect.objectContaining({
        reason: "too_large",
        message: expect.stringMatching(/128 B/),
      })
    )
    expect(mockPresignAttachment).not.toHaveBeenCalled()
  })

  it("propagates a presign 4xx as failed status", async () => {
    const onRejected = vi.fn()
    mockPresignAttachment.mockRejectedValueOnce(new Error("presign 413"))
    const { result } = renderHook(() =>
      useAttachmentUploader({
        serverId: "srv-1",
        channelId: "ch-1",
        getToken: () => "token",
        onRejected,
      })
    )

    await act(async () => {
      result.current.add([makeFile("ok.png", 64)])
    })

    await waitFor(() => {
      expect(result.current.uploads[0]?.status).toBe("failed")
    })
    expect(result.current.uploads[0]?.errorMessage).toMatch(/presign 413/)
    expect(onRejected).toHaveBeenCalledWith(
      expect.objectContaining({
        reason: "presign_failed",
        message: expect.stringMatching(/presign 413/),
      })
    )
  })

  it("emits a too_many rejection when a batch exceeds the message slot limit", async () => {
    const onRejected = vi.fn()
    const { result } = renderHook(() =>
      useAttachmentUploader({
        serverId: "srv-1",
        channelId: "ch-1",
        getToken: () => "token",
        onRejected,
      })
    )

    await act(async () => {
      result.current.add([
        makeFile("1.png", 64),
        makeFile("2.png", 64),
        makeFile("3.png", 64),
        makeFile("4.png", 64),
        makeFile("5.png", 64),
      ])
    })

    expect(result.current.uploads).toHaveLength(4)
    expect(onRejected).toHaveBeenCalledWith(
      expect.objectContaining({
        reason: "too_many",
        message: "Cannot attach more than 4 files.",
      })
    )
  })

  it("emits an upload_failed rejection when the presigned PUT fails", async () => {
    const onRejected = vi.fn()
    MockUploadXHR.nextStatus = 503
    MockUploadXHR.nextResponseText = "storage unavailable"
    const { result } = renderHook(() =>
      useAttachmentUploader({
        serverId: "srv-1",
        channelId: "ch-1",
        getToken: () => "token",
        onRejected,
      })
    )

    await act(async () => {
      result.current.add([makeFile("ok.png", 64)])
    })

    await waitFor(() => {
      expect(result.current.uploads[0]?.status).toBe("failed")
    })
    expect(result.current.uploads[0]?.errorMessage).toMatch(/HTTP 503/)
    expect(onRejected).toHaveBeenCalledWith(
      expect.objectContaining({
        reason: "upload_failed",
        message: expect.stringMatching(/HTTP 503/),
      })
    )
  })

  it("does not double-fire presign + upload under React StrictMode (P1.1 regression)", async () => {
    // Strict Mode invokes state updaters twice in development. The
    // hook used to start uploads from inside `setUploads(prev => ...)`,
    // so each `add()` call triggered presign+encrypt+PUT twice and
    // produced an orphaned ciphertext blob. This regression test
    // wraps the hook in `<React.StrictMode>` and asserts the side
    // effects fire exactly once per file.
    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(React.StrictMode, null, children)
    const { result } = renderHook(
      () =>
        useAttachmentUploader({
          serverId: "srv-1",
          channelId: "ch-1",
          getToken: () => "token",
        }),
      { wrapper }
    )

    await act(async () => {
      result.current.add([makeFile("once.png", 1024)])
    })

    await waitFor(() => {
      expect(result.current.uploads[0]?.status).toBe("ready")
    })
    expect(mockPresignAttachment).toHaveBeenCalledTimes(1)
    expect(MockUploadXHR.instances).toHaveLength(1)
  })

  it("rejects a non-allowlisted mime type without hitting the network", async () => {
    const onRejected = vi.fn()
    const { result } = renderHook(() =>
      useAttachmentUploader({
        serverId: "srv-1",
        channelId: "ch-1",
        getToken: () => "token",
        onRejected,
      })
    )

    await act(async () => {
      result.current.add([makeFile("evil.bin", 16, "application/x-evil")])
    })

    await waitFor(() => {
      expect(result.current.uploads[0]?.status).toBe("failed")
    })
    expect(onRejected).toHaveBeenCalledWith(
      expect.objectContaining({
        reason: "unsupported_type",
        message: "evil.bin is not a supported attachment type.",
      })
    )
    expect(mockPresignAttachment).not.toHaveBeenCalled()
  })

  it("rejects SVG before encrypting or presigning", async () => {
    const { result } = renderHook(() =>
      useAttachmentUploader({
        serverId: "srv-1",
        channelId: "ch-1",
        getToken: () => "token",
      })
    )

    await act(async () => {
      result.current.add([makeFile("logo.svg", 64, "image/svg+xml")])
    })

    await waitFor(() => {
      expect(result.current.uploads[0]?.status).toBe("failed")
    })
    expect(result.current.uploads[0]?.errorMessage).toBe(
      "logo.svg is not a supported attachment type."
    )
    expect(mockPresignAttachment).not.toHaveBeenCalled()
    expect(MockUploadXHR.instances).toHaveLength(0)
  })
})
