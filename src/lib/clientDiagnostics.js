const DIAGNOSTIC_EVENT_NAME = "hush:diagnostic"
const PREVIEW_LIMIT = 160
const PRE_REDACTION_LIMIT = 400
const REDACTION_MARKER = "[redacted]"
const SENSITIVE_FIELD_TOKENS = new Set([
  "authorization",
  "bearer",
  "cookie",
  "credential",
  "credentials",
  "key",
  "keys",
  "mac",
  "nonce",
  "otp",
  "password",
  "pin",
  "pwd",
  "secret",
  "session",
  "signature",
  "token",
])
const JSON_FIELD_PATTERN =
  /((["']?)([A-Za-z0-9_-]+)\2\s*:\s*)(?:"((?:\\.|[^"\\])*)"|'((?:\\.|[^'\\])*)'|([^,}\]\s]+))/g
const ASSIGNMENT_PATTERN = /(\b([A-Za-z0-9_-]+)\s*=\s*)[^\s&;,}]+/g

function fieldNameTokens(key) {
  return String(key)
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .split(/[^A-Za-z0-9]+/)
    .map((part) => part.toLowerCase())
    .filter(Boolean)
}

function redactString(value) {
  return trimPartialRedactionMarker(
    value
      .slice(0, PRE_REDACTION_LIMIT)
      .replace(JSON_FIELD_PATTERN, (match, prefix, _quotedKey, key, doubleValue, singleValue) => {
        if (!isSensitiveFieldName(key)) return match
        if (doubleValue != null) return `${prefix}"${REDACTION_MARKER}"`
        if (singleValue != null) return `${prefix}'${REDACTION_MARKER}'`
        return `${prefix}${REDACTION_MARKER}`
      })
      .replace(ASSIGNMENT_PATTERN, (match, prefix, key) =>
        isSensitiveFieldName(key) ? `${prefix}${REDACTION_MARKER}` : match
      )
      .replace(/\bBearer\s+[A-Za-z0-9._~+/=-]+/gi, `Bearer ${REDACTION_MARKER}`)
      .replace(/\b[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\b/g, "[jwt]")
      .slice(0, PREVIEW_LIMIT)
  )
}

function isSensitiveFieldName(key) {
  return fieldNameTokens(key).some(
    (token) => SENSITIVE_FIELD_TOKENS.has(token) || token.startsWith("cipher")
  )
}

function isPlainObject(value) {
  const prototype = Object.getPrototypeOf(value)
  return prototype === Object.prototype || prototype === null
}

function trimPartialRedactionMarker(value) {
  for (let length = REDACTION_MARKER.length - 1; length > 0; length -= 1) {
    if (value.endsWith(REDACTION_MARKER.slice(0, length))) {
      return value.slice(0, -length)
    }
  }
  return value
}

function sanitizeValue(value, seen = new WeakSet()) {
  if (typeof value === "string") return redactString(value)
  if (typeof value === "number" || typeof value === "boolean" || value == null) {
    return value
  }
  if (Array.isArray(value)) return value.map((entry) => sanitizeValue(entry, seen))
  if (typeof value === "object") {
    if (!isPlainObject(value)) return "[unsupported]"
    if (seen.has(value)) return "[circular]"
    seen.add(value)
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [
        key,
        isSensitiveFieldName(key) ? REDACTION_MARKER : sanitizeValue(entry, seen),
      ])
    )
  }
  return String(value)
}

function canDispatchDiagnostic() {
  return (
    typeof globalThis !== "undefined" &&
    typeof globalThis.dispatchEvent === "function" &&
    typeof globalThis.CustomEvent === "function"
  )
}

export function sanitizeDiagnosticDetails(details = {}) {
  return sanitizeValue(details)
}

export function recordClientDiagnostic({
  category,
  event,
  severity = "info",
  details = {},
}) {
  try {
    if (!category || !event || !canDispatchDiagnostic()) return
    globalThis.dispatchEvent(
      new CustomEvent(DIAGNOSTIC_EVENT_NAME, {
        detail: {
          ts: new Date().toISOString(),
          category,
          event,
          severity,
          details: sanitizeDiagnosticDetails(details),
        },
      })
    )
  } catch {
    // Diagnostics are observational only and must never affect app behavior.
  }
}

export { DIAGNOSTIC_EVENT_NAME }
