import { describe, expect, it, vi } from "vitest"

import {
  DIAGNOSTIC_EVENT_NAME,
  recordClientDiagnostic,
  sanitizeDiagnosticDetails,
} from "./clientDiagnostics"

describe("client diagnostics", () => {
  it("redacts bearer tokens and JWT-shaped values from details", () => {
    expect(
      sanitizeDiagnosticDetails({
        authorization: "Bearer secret-token",
        body: "token abc.def.ghi",
      })
    ).toEqual({
      authorization: "Bearer [redacted]",
      body: "token [jwt]",
    })
  })

  it("redacts sensitive diagnostic field names in objects and body previews", () => {
    expect(
      sanitizeDiagnosticDetails({
        bodyPreview:
          '{"claimToken":"abc","relayCiphertext":"dead","publicKey":"pk","sessionId":"sid","sessionCounter":123,"safe":"ok"}',
        nested: {
          claimToken: "abc",
          relayCiphertext: "dead",
          publicKey: "pk",
          safe: "ok",
        },
        query: "sessionId=sid&safe=ok",
      })
    ).toEqual({
      bodyPreview:
        '{"claimToken":"[redacted]","relayCiphertext":"[redacted]","publicKey":"[redacted]","sessionId":"[redacted]","sessionCounter":[redacted],"safe":"ok"}',
      nested: {
        claimToken: "[redacted]",
        relayCiphertext: "[redacted]",
        publicKey: "[redacted]",
        safe: "ok",
      },
      query: "sessionId=[redacted]&safe=ok",
    })
  })

  it("marks circular diagnostic details without throwing", () => {
    const root = { name: "root" }
    root.self = root

    expect(sanitizeDiagnosticDetails(root)).toEqual({
      name: "root",
      self: "[circular]",
    })
  })

  it("dispatches a structured diagnostic event", () => {
    const listener = vi.fn()
    globalThis.addEventListener(DIAGNOSTIC_EVENT_NAME, listener)

    try {
      recordClientDiagnostic({
        category: "api",
        event: "invalid-json-response",
        severity: "error",
        details: { operation: "verifyDeviceLinkRequest" },
      })
    } finally {
      globalThis.removeEventListener(DIAGNOSTIC_EVENT_NAME, listener)
    }

    expect(listener).toHaveBeenCalledTimes(1)
    expect(listener.mock.calls[0][0].detail).toMatchObject({
      category: "api",
      event: "invalid-json-response",
      severity: "error",
      details: { operation: "verifyDeviceLinkRequest" },
    })
  })
})
