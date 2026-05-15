/**
 * Pins the resolver wiring on the download path. The hook decrypts via
 * WebCrypto in real code; here we mock the API + fetch so we can assert
 * which URL is fetched, with what headers, when the server returns each
 * shape of attachment-blob URL.
 */
import { describe, it, expect, vi, beforeEach } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"

import { useAttachmentDownloader } from "./useAttachmentDownloader"

const mockGetAttachmentDownloadUrl = vi.fn()
const mockDecryptBlob = vi.fn()

vi.mock("@/lib/api", () => ({
  getAttachmentDownloadUrl: (...args: unknown[]) =>
    mockGetAttachmentDownloadUrl(...args),
}))

vi.mock("@/lib/attachmentCrypto", () => ({
  decryptBlob: (...args: unknown[]) => mockDecryptBlob(...args),
}))

const REF = {
  id: "att-1",
  name: "x.png",
  size: 16,
  mimeType: "image/png",
  key: "k",
  iv: "iv",
} as const

beforeEach(() => {
  vi.clearAllMocks()
  // jsdom URL helpers may not exist; stub object URL creation.
  globalThis.URL.createObjectURL = vi.fn(() => "blob:test")
  globalThis.URL.revokeObjectURL = vi.fn()
  mockDecryptBlob.mockResolvedValue(new Blob(["ok"]))
})

function stubFetch() {
  const fetchMock = vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    arrayBuffer: async () => new ArrayBuffer(8),
  })
  globalThis.fetch = fetchMock as unknown as typeof fetch
  return fetchMock
}

describe("useAttachmentDownloader", () => {
  it("RelativeDownloadUrl_IsResolvedAgainstBaseUrl_AndCarriesBearer", async () => {
    mockGetAttachmentDownloadUrl.mockResolvedValue({
      url: "/api/attachments/att-1/blob",
      expiresAt: new Date(Date.now() + 60_000).toISOString(),
    })
    const fetchMock = stubFetch()
    const { result } = renderHook(() =>
      useAttachmentDownloader({
        ref: REF,
        getToken: () => "tok",
        baseUrl: "https://chat.example.com",
        enabled: true,
      }),
    )
    await waitFor(() => expect(result.current.state).toBe("ready"))
    expect(fetchMock).toHaveBeenCalled()
    const [calledUrl, init] = fetchMock.mock.calls[0]
    expect(calledUrl).toBe("https://chat.example.com/api/attachments/att-1/blob")
    expect((init as RequestInit | undefined)?.headers).toEqual({
      Authorization: "Bearer tok",
    })
  })

  it("AbsoluteDownloadUrl_PassesThroughWithoutBearer", async () => {
    mockGetAttachmentDownloadUrl.mockResolvedValue({
      url: "https://s3.example/attachments/x?sig=…",
      expiresAt: new Date(Date.now() + 60_000).toISOString(),
    })
    const fetchMock = stubFetch()
    const { result } = renderHook(() =>
      useAttachmentDownloader({
        ref: REF,
        getToken: () => "tok",
        baseUrl: "https://chat.example.com",
        enabled: true,
      }),
    )
    await waitFor(() => expect(result.current.state).toBe("ready"))
    const [calledUrl, init] = fetchMock.mock.calls[0]
    expect(calledUrl).toBe("https://s3.example/attachments/x?sig=…")
    expect(init).toEqual({})
  })

  it("InvalidRelativeUrl_FailsWithDiagnosticInsteadOfFetching", async () => {
    mockGetAttachmentDownloadUrl.mockResolvedValue({
      url: "/uploads/raw",
      expiresAt: new Date(Date.now() + 60_000).toISOString(),
    })
    const fetchMock = stubFetch()
    const { result } = renderHook(() =>
      useAttachmentDownloader({
        ref: REF,
        getToken: () => "tok",
        baseUrl: "https://chat.example.com",
        enabled: true,
      }),
    )
    await waitFor(() => expect(result.current.state).toBe("failed"))
    expect(fetchMock).not.toHaveBeenCalled()
    expect(result.current.errorMessage).toMatch(/invalid download URL/)
  })
})
