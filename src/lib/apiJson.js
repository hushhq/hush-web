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

async function readBodyPreview(res) {
  if (!res || typeof res.text !== "function") return ""
  try {
    const text = await res.text()
    return text.slice(0, 160)
  } catch {
    return ""
  }
}

export async function readJsonResponse(res, operation, { allowEmpty = false } = {}) {
  const contentType = getContentType(res)
  if (contentType && !contentType.toLowerCase().includes("json")) {
    const bodyPreview = await readBodyPreview(res)
    throw new ApiJsonError(
      `${operation} returned ${contentType || "a non-JSON response"} instead of JSON`,
      { operation, status: res?.status ?? 0, contentType, bodyPreview },
    )
  }

  try {
    return await res.json()
  } catch (err) {
    if (allowEmpty) return null
    const bodyPreview = await readBodyPreview(res)
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
