import { describe, expect, it } from "vitest"

import {
  ATTACHMENT_FILE_INPUT_ACCEPT,
  isAttachmentContentTypeAllowed,
} from "./attachmentLimits"

describe("attachmentLimits", () => {
  it("allows exact passive attachment content types", () => {
    expect(isAttachmentContentTypeAllowed("image/png")).toBe(true)
    expect(isAttachmentContentTypeAllowed("image/jpeg")).toBe(true)
    expect(isAttachmentContentTypeAllowed("audio/webm")).toBe(true)
    expect(isAttachmentContentTypeAllowed("video/mp4")).toBe(true)
    expect(isAttachmentContentTypeAllowed("text/plain")).toBe(true)
    expect(isAttachmentContentTypeAllowed("application/pdf")).toBe(true)
  })

  it("rejects active or prefix-matched content types", () => {
    expect(isAttachmentContentTypeAllowed("image/svg+xml")).toBe(false)
    expect(isAttachmentContentTypeAllowed("text/html")).toBe(false)
    expect(isAttachmentContentTypeAllowed("image/avif")).toBe(false)
    expect(isAttachmentContentTypeAllowed("audio/x-matroska")).toBe(false)
  })

  it("does not expose wildcard image accepts to the native file picker", () => {
    expect(ATTACHMENT_FILE_INPUT_ACCEPT).not.toContain("image/*")
    expect(ATTACHMENT_FILE_INPUT_ACCEPT).not.toContain("image/svg+xml")
  })
})
