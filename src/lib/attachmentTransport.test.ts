/**
 * Pins the URL/auth resolver shared by the attachment uploader and
 * downloader. The desktop renderer origin (`app://localhost`) MUST NOT
 * be the place relative URLs resolve against — that was the original
 * postgres_bytea regression. Bearer auth attaches only to the in-API
 * fallback so the user's JWT never leaks into an S3/R2 query string.
 */
import { describe, expect, it } from "vitest"

import {
  buildAttachmentFetchInit,
  resolveAttachmentBlobUrl,
} from "./attachmentTransport"

describe("resolveAttachmentBlobUrl", () => {
  it("AbsoluteHttpsUrl_PassesThroughUnchanged", () => {
    const result = resolveAttachmentBlobUrl(
      "https://s3.example.com/attachments/x?sig=…",
      "https://chat.example.com",
    )
    expect(result).toEqual({
      url: "https://s3.example.com/attachments/x?sig=…",
      isInApiFallback: false,
    })
  })

  it("AbsoluteHttpUrl_AlsoPassesThrough", () => {
    const result = resolveAttachmentBlobUrl(
      "http://minio.local/bucket/key",
      "https://chat.example.com",
    )
    expect(result?.isInApiFallback).toBe(false)
    expect(result?.url).toBe("http://minio.local/bucket/key")
  })

  it("RelativeApiUrl_IsJoinedToBaseUrl_AndMarkedInApiFallback", () => {
    const result = resolveAttachmentBlobUrl(
      "/api/attachments/abc/blob",
      "https://chat.example.com",
    )
    expect(result).toEqual({
      url: "https://chat.example.com/api/attachments/abc/blob",
      isInApiFallback: true,
    })
  })

  it("BaseUrlTrailingSlash_IsTrimmed", () => {
    const result = resolveAttachmentBlobUrl(
      "/api/attachments/abc/blob",
      "https://chat.example.com/",
    )
    expect(result?.url).toBe(
      "https://chat.example.com/api/attachments/abc/blob",
    )
  })

  it("RelativeUrlWithoutBaseUrl_ReturnsNull", () => {
    expect(
      resolveAttachmentBlobUrl("/api/attachments/abc/blob", ""),
    ).toBeNull()
    expect(
      resolveAttachmentBlobUrl("/api/attachments/abc/blob", null),
    ).toBeNull()
  })

  it("NonApiRelativeUrl_ReturnsNull_SoCallerCanFailFast", () => {
    expect(
      resolveAttachmentBlobUrl("/uploads/raw", "https://chat.example.com"),
    ).toBeNull()
  })

  it("AppOrFileSchemeUrl_ReturnsNull", () => {
    expect(
      resolveAttachmentBlobUrl(
        "app://localhost/api/attachments/abc/blob",
        "https://chat.example.com",
      ),
    ).toBeNull()
    expect(
      resolveAttachmentBlobUrl(
        "file:///tmp/x",
        "https://chat.example.com",
      ),
    ).toBeNull()
  })

  it("EmptyOrNullishUrl_ReturnsNull", () => {
    expect(resolveAttachmentBlobUrl("", "https://chat.example.com")).toBeNull()
    expect(
      resolveAttachmentBlobUrl(null, "https://chat.example.com"),
    ).toBeNull()
    expect(
      resolveAttachmentBlobUrl(undefined, "https://chat.example.com"),
    ).toBeNull()
  })
})

describe("buildAttachmentFetchInit", () => {
  it("InApiFallback_AttachesBearerToken", () => {
    const init = buildAttachmentFetchInit(
      { url: "https://chat/x", isInApiFallback: true },
      "tok",
    )
    expect(init).toEqual({
      headers: { Authorization: "Bearer tok" },
    })
  })

  it("AbsolutePresigned_NeverAttachesBearerToken", () => {
    const init = buildAttachmentFetchInit(
      { url: "https://s3.example/x", isInApiFallback: false },
      "tok",
    )
    expect(init).toEqual({})
  })

  it("InApiFallbackWithoutToken_ReturnsEmptyInit", () => {
    const init = buildAttachmentFetchInit(
      { url: "https://chat/x", isInApiFallback: true },
      null,
    )
    expect(init).toEqual({})
  })
})
