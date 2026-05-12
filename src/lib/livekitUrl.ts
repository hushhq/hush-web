/**
 * Resolves the WebSocket URL the LiveKit client should connect to.
 *
 * Inputs come from three places, in priority order:
 *
 *   1. `VITE_LIVEKIT_URL` build-time override (when set, it wins —
 *      mirrors the long-standing escape hatch for self-hosters that
 *      run LiveKit on a separate origin from the API).
 *   2. Server-provided `/api/livekit/token.livekitUrl` (when set, it
 *      is accepted only when same-host as the selected instance/page
 *      origin and with appropriate ws/wss transport for that origin).
 *   3. The caller's normalized instance origin (https://chat.example.com)
 *      → ws+s://chat.example.com/livekit/
 *   4. The current page origin's `/livekit/` path (browser-only fallback;
 *      packaged Electron builds always have an instance origin).
 *
 * Whatever the source, the resolved URL must end up on `ws:` or `wss:`
 * pointing at a real host. Any other shape — javascript:, data:,
 * relative paths, malformed URLs — is rejected here so a misconfigured
 * env var or a tampered instance store cannot drive the LiveKit client
 * (and the local SFU credential) at an attacker-controlled origin.
 */

const ALLOWED_LIVEKIT_PROTOCOLS = new Set(["ws:", "wss:"])

export interface BuildLiveKitWsUrlInput {
  /**
   * Per-instance public signaling URL returned by `/api/livekit/token`.
   * This lets the hosted client connect to arbitrary self-hosted instances
   * whose RTC hostname differs from their app/API hostname.
   */
  serverUrl?: string | null
  /**
   * Normalized instance origin from `normalizeInstanceUrl`, or '' /
   * null when the page-origin fallback should be used.
   */
  instanceOrigin?: string | null
  /**
   * `import.meta.env.VITE_LIVEKIT_URL` — undefined / empty when no
   * override is set. Trusted only when it parses as ws:/wss:.
   */
  envOverride?: string | null
  /**
   * Current page origin (e.g. `window.location.origin`). Optional;
   * when omitted (server-side render, headless test) the fallback path
   * is unavailable and the function throws if no instance origin is
   * provided either.
   */
  pageOrigin?: string | null
}

/**
 * Returns a validated `ws:` / `wss:` URL pointing at a LiveKit reverse
 * proxy under `/livekit/`. Throws on any input that cannot be coerced
 * into one — callers must either supply a usable input or surface the
 * error to the user instead of falling back to a silently-wrong URL.
 */
export function buildLiveKitWsUrl(input: BuildLiveKitWsUrlInput): string {
  const { serverUrl, instanceOrigin, envOverride, pageOrigin } = input

  if (envOverride) {
    const validated = validateAsLiveKitWsUrl(envOverride)
    if (validated) return validated
    throw new Error(
      `livekitUrl: VITE_LIVEKIT_URL must be ws:// or wss://; got ${envOverride}`,
    )
  }

  if (serverUrl) {
    const trustedOrigin = instanceOrigin || pageOrigin
    const validated = validateServerLiveKitWsUrl(serverUrl, trustedOrigin)
    if (validated) return validated
    throw new Error(
      `livekitUrl: server livekitUrl must be same-host ws(s) URL for selected instance; got ${serverUrl}`,
    )
  }

  if (instanceOrigin) {
    const wsFromInstance = swapHttpToWs(instanceOrigin)
    if (wsFromInstance) return wsFromInstance
    throw new Error(
      `livekitUrl: instance origin is not http/https: ${instanceOrigin}`,
    )
  }

  if (pageOrigin) {
    const wsFromPage = swapHttpToWs(pageOrigin)
    if (wsFromPage) return wsFromPage
    throw new Error(
      `livekitUrl: page origin is not http/https: ${pageOrigin}`,
    )
  }

  throw new Error(
    "livekitUrl: no instance origin, env override, or page origin available",
  )
}

function swapHttpToWs(origin: string): string | null {
  let parsed: URL
  try {
    parsed = new URL(origin)
  } catch {
    return null
  }
  if (parsed.protocol === "https:") parsed.protocol = "wss:"
  else if (parsed.protocol === "http:") parsed.protocol = "ws:"
  else return null
  parsed.pathname = "/livekit/"
  parsed.search = ""
  parsed.hash = ""
  return parsed.toString()
}

function validateAsLiveKitWsUrl(candidate: string): string | null {
  let parsed: URL
  try {
    parsed = new URL(candidate)
  } catch {
    return null
  }
  if (!ALLOWED_LIVEKIT_PROTOCOLS.has(parsed.protocol)) return null
  if (!parsed.host) return null
  return parsed.toString()
}

function validateServerLiveKitWsUrl(
  candidate: string,
  trustedOrigin?: string | null,
): string | null {
  const validated = validateAsLiveKitWsUrl(candidate)
  if (!validated) return null

  if (!trustedOrigin) return null

  let trusted: URL
  let server: URL
  try {
    trusted = new URL(trustedOrigin)
    server = new URL(validated)
  } catch {
    return null
  }

  if (!trusted.host || trusted.host !== server.host) return null

  if (trusted.protocol === "https:" && server.protocol !== "wss:") return null
  if (trusted.protocol === "http:" && !ALLOWED_LIVEKIT_PROTOCOLS.has(server.protocol)) return null
  if (trusted.protocol !== "https:" && trusted.protocol !== "http:") return null

  return server.toString()
}
