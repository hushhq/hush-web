import { describe, expect, it, vi } from "vitest"

import { DIAGNOSTIC_EVENT_NAME } from "./clientDiagnostics"
import { ApiJsonError, readJsonResponse } from "./apiJson"

function makeResponse({
  body,
  contentType = "application/json",
  status = 200,
  textError,
}) {
  return {
    status,
    headers: {
      get: (key) => (key.toLowerCase() === "content-type" ? contentType : null),
    },
    text: vi.fn(async () => {
      if (textError) throw textError
      return body
    }),
  }
}

async function captureDiagnostic(callback) {
  const listener = vi.fn()
  globalThis.addEventListener(DIAGNOSTIC_EVENT_NAME, listener)
  try {
    await callback()
  } finally {
    globalThis.removeEventListener(DIAGNOSTIC_EVENT_NAME, listener)
  }
  return listener
}

describe("apiJson", () => {
  it("reads valid JSON", async () => {
    await expect(
      readJsonResponse(makeResponse({ body: '{"ok":true}' }), "operation")
    ).resolves.toEqual({ ok: true })
  })

  it("reports non-JSON responses through diagnostics", async () => {
    const listener = await captureDiagnostic(async () => {
      await expect(
        readJsonResponse(
          makeResponse({
            body: "<!DOCTYPE html>",
            contentType: "text/html",
            status: 502,
          }),
          "resolveDeviceLinkRequest"
        )
      ).rejects.toBeInstanceOf(ApiJsonError)
    })

    expect(listener).toHaveBeenCalledTimes(1)
    expect(listener.mock.calls[0][0].detail).toMatchObject({
      category: "api",
      event: "non-json-response",
      severity: "error",
      details: {
        operation: "resolveDeviceLinkRequest",
        status: 502,
        contentType: "text/html",
        bodyPreview: "<!DOCTYPE html>",
      },
    })
  })

  it("reports invalid JSON through diagnostics", async () => {
    const listener = await captureDiagnostic(async () => {
      await expect(
        readJsonResponse(
          makeResponse({
            body: '{"token":"Bearer abc.def.ghi"',
            status: 200,
          }),
          "verifyDeviceLinkRequest"
        )
      ).rejects.toBeInstanceOf(ApiJsonError)
    })

    expect(listener).toHaveBeenCalledTimes(1)
    expect(listener.mock.calls[0][0].detail).toMatchObject({
      category: "api",
      event: "invalid-json-response",
      severity: "error",
      details: {
        operation: "verifyDeviceLinkRequest",
        status: 200,
        bodyPreview: '{"token":"[redacted]"',
      },
    })
  })

  it("reports unreadable response bodies through diagnostics", async () => {
    const listener = await captureDiagnostic(async () => {
      await expect(
        readJsonResponse(
          makeResponse({
            body: "",
            textError: new Error("stream locked"),
          }),
          "consumeDeviceLinkResult"
        )
      ).rejects.toBeInstanceOf(ApiJsonError)
    })

    expect(listener).toHaveBeenCalledTimes(1)
    expect(listener.mock.calls[0][0].detail).toMatchObject({
      category: "api",
      event: "response-body-unreadable",
      severity: "error",
      details: {
        operation: "consumeDeviceLinkResult",
        status: 200,
      },
    })
  })
})
