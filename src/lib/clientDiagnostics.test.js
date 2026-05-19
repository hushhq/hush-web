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
      authorization: "[redacted]",
      body: "token [jwt]",
    })
  })

  it("redacts sensitive diagnostic field names in objects and body previews", () => {
    const sanitized = sanitizeDiagnosticDetails({
      bodyPreview:
        '{"claimToken":"abc","relayCiphertext":"dead","publicKey":"pk","password":"pw","authorization":"Basic abc","nonce":"n","signature":"sig","mac":"mac","cookie":"c","pin":"1234","otp":"000","sessionId":"sid","sessionCounter":123,"safe":"ok"}',
      nested: {
        claimToken: "abc",
        relayCiphertext: "dead",
        publicKey: "pk",
        password: "pw",
        authorization: "Basic abc",
        nonce: "n",
        signature: "sig",
        mac: "mac",
        cookie: "c",
        pin: "1234",
        otp: "000",
        safe: "ok",
      },
      query: "sessionId=sid&safe=ok",
    })

    expect(sanitized.bodyPreview).toContain('"claimToken":"[redacted]"')
    expect(sanitized.bodyPreview).toContain('"relayCiphertext":"[redacted]"')
    expect(sanitized.bodyPreview).toContain('"publicKey":"[redacted]"')
    expect(sanitized.bodyPreview).toContain('"password":"[redacted]"')
    expect(sanitized.bodyPreview).toContain('"authorization":"[redacted]"')
    expect(sanitized).toMatchObject({
      nested: {
        claimToken: "[redacted]",
        relayCiphertext: "[redacted]",
        publicKey: "[redacted]",
        password: "[redacted]",
        authorization: "[redacted]",
        nonce: "[redacted]",
        signature: "[redacted]",
        mac: "[redacted]",
        cookie: "[redacted]",
        pin: "[redacted]",
        otp: "[redacted]",
        safe: "ok",
      },
      query: "sessionId=[redacted]&safe=ok",
    })
  })

  it("does not redact benign field names that only contain sensitive substrings", () => {
    expect(
      sanitizeDiagnosticDetails({
        monkey: "banana",
        keyboard: "mechanical",
        keyword: "search",
        keystroke: "enter",
      })
    ).toEqual({
      monkey: "banana",
      keyboard: "mechanical",
      keyword: "search",
      keystroke: "enter",
    })
  })

  it("does not expose unsupported object payloads", () => {
    expect(
      sanitizeDiagnosticDetails({
        createdAt: new Date("2026-05-19T00:00:00.000Z"),
        bytes: new Uint8Array([1, 2, 3]),
      })
    ).toEqual({
      createdAt: "[unsupported]",
      bytes: "[unsupported]",
    })
  })

  it("does not return a partial redaction marker when truncating", () => {
    const prefix = "x".repeat(151)
    const sanitized = sanitizeDiagnosticDetails({
      bodyPreview: `${prefix} token=abc`,
    })

    expect(sanitized.bodyPreview).not.toMatch(/\[redact?e?d?$/)
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
