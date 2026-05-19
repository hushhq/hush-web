const DIAGNOSTIC_EVENT_NAME = "hush:diagnostic"
const PREVIEW_LIMIT = 160
const SENSITIVE_FIELD_NAME_PATTERN = /(?:token|secret|cipher\w*|key|session\w*)/i
const SENSITIVE_JSON_FIELD_PATTERN =
  /((["']?)[A-Za-z0-9_-]*(?:token|secret|cipher\w*|key|session\w*)[A-Za-z0-9_-]*(\2)\s*:\s*)(["'])(?:\\.|(?!\4).)*\4/gi
const SENSITIVE_JSON_BARE_FIELD_PATTERN =
  /((["']?)[A-Za-z0-9_-]*(?:token|secret|cipher\w*|key|session\w*)[A-Za-z0-9_-]*(\2)\s*:\s*)(?!["'])[^,}\]\s]+/gi
const SENSITIVE_ASSIGNMENT_PATTERN =
  /(\b[A-Za-z0-9_-]*(?:token|secret|cipher\w*|key|session\w*)[A-Za-z0-9_-]*\s*=\s*)[^\s&;,}]+/gi

function redactString(value) {
  return value
    .replace(SENSITIVE_JSON_FIELD_PATTERN, "$1$4[redacted]$4")
    .replace(SENSITIVE_JSON_BARE_FIELD_PATTERN, "$1[redacted]")
    .replace(SENSITIVE_ASSIGNMENT_PATTERN, "$1[redacted]")
    .replace(/\bBearer\s+[A-Za-z0-9._~+/=-]+/gi, "Bearer [redacted]")
    .replace(/\b[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\b/g, "[jwt]")
}

function isSensitiveFieldName(key) {
  return SENSITIVE_FIELD_NAME_PATTERN.test(key)
}

function sanitizeValue(value, seen = new WeakSet()) {
  if (typeof value === "string") return redactString(value).slice(0, PREVIEW_LIMIT)
  if (typeof value === "number" || typeof value === "boolean" || value == null) {
    return value
  }
  if (Array.isArray(value)) return value.map((entry) => sanitizeValue(entry, seen))
  if (typeof value === "object") {
    if (seen.has(value)) return "[circular]"
    seen.add(value)
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [
        key,
        isSensitiveFieldName(key) ? "[redacted]" : sanitizeValue(entry, seen),
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
