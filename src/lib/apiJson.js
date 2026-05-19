import { recordClientDiagnostic } from './clientDiagnostics';

export class ApiJsonError extends Error {
  constructor(message, { operation, status = 0, contentType = "", bodyPreview = "" } = {}) {
    super(message)
    this.name = "ApiJsonError"
    this.code = "invalid_json_response"
    this.operation = operation
    this.status = status
    this.contentType = contentType
    this.bodyPreview = bodyPreview
  }
}

function getContentType(res) {
  if (!res?.headers || typeof res.headers.get !== "function") return ""
  return res.headers.get("content-type") || ""
}

async function readResponseText(res) {
  if (!res) return ""
  if (typeof res.text === "function") {
    return await res.text()
  }
  if (typeof res.json === "function") {
    const data = await res.json()
    if (data == null) return ""
    return JSON.stringify(data)
  }
  return ""
}

function previewBody(text) {
  if (typeof text !== "string") return ""
  return text.slice(0, 160)
}

function parseJsonText(text) {
  if (!text.trim()) return null
  return JSON.parse(text)
}

function recordApiJsonDiagnostic(event, res, operation, contentType, bodyPreview) {
  recordClientDiagnostic({
    category: "api",
    event,
    severity: "error",
    details: {
      operation,
      status: res?.status ?? 0,
      contentType,
      bodyPreview,
    },
  })
}

export async function readJsonResponse(res, operation, { allowEmpty = false } = {}) {
  const contentType = getContentType(res)
  let text = ""
  try {
    text = await readResponseText(res)
  } catch (err) {
    recordApiJsonDiagnostic(
      "response-body-unreadable",
      res,
      operation,
      contentType,
      ""
    )
    const next = new ApiJsonError(`${operation} response body could not be read`, {
      operation,
      status: res?.status ?? 0,
      contentType,
    })
    next.cause = err
    throw next
  }

  if (contentType && !contentType.toLowerCase().includes("json")) {
    if (allowEmpty && !text.trim()) return null
    const bodyPreview = previewBody(text)
    recordApiJsonDiagnostic(
      "non-json-response",
      res,
      operation,
      contentType,
      bodyPreview
    )
    throw new ApiJsonError(
      `${operation} returned ${contentType || "a non-JSON response"} instead of JSON`,
      { operation, status: res?.status ?? 0, contentType, bodyPreview },
    )
  }

  try {
    const data = parseJsonText(text)
    if (data == null && allowEmpty) return null
    if (data == null) {
      throw new SyntaxError("empty response body")
    }
    return data
  } catch (err) {
    const bodyPreview = previewBody(text)
    recordApiJsonDiagnostic(
      "invalid-json-response",
      res,
      operation,
      contentType,
      bodyPreview
    )
    const next = new ApiJsonError(`${operation} returned invalid JSON`, {
      operation,
      status: res?.status ?? 0,
      contentType,
      bodyPreview,
    })
    next.cause = err
    throw next
  }
}

export async function readJsonResponseOrNull(res, operation) {
  try {
    return await readJsonResponse(res, operation, { allowEmpty: true })
  } catch (err) {
    if (err instanceof ApiJsonError) return null
    throw err
  }
}
