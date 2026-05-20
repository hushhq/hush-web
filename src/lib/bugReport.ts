/**
 * Client-side payload builder, validator, and submitter for the
 * anonymous bug-report flow. The server side lives in `hush-landing`
 * and is reachable at `BUG_REPORT_ENDPOINT`.
 *
 * Hard contract: every field in the wire payload comes from
 * compile-time-fixed sources or from text the user typed into the
 * dialog. We do not pull identifiers, public keys, routes with IDs,
 * tokens, message contents, channel IDs, server IDs, or local paths.
 */
import { CLIENT_VERSION } from "./clientVersion"

export const BUG_REPORT_ENDPOINT = (() => {
  // Vite injects `import.meta.env.VITE_*` at build time. Typed loosely
  // so the file compiles in repos that have not extended ImportMeta.
  const meta = import.meta as unknown as {
    env?: Record<string, string | undefined>
  }
  const fromEnv = meta?.env?.VITE_BUG_REPORT_ENDPOINT
  if (typeof fromEnv === "string" && fromEnv.length > 0) return fromEnv
  return "https://gethush.live/api/bug-reports"
})()

export const BUG_REPORT_TYPES = [
  "bug",
  "crash",
  "ui",
  "performance",
  "voice",
  "device-linking",
  "other",
] as const

export const BUG_REPORT_CLIENT_KINDS = [
  "desktop",
  "web",
  "mobile",
  "unknown",
] as const

export const BUG_REPORT_PLATFORMS = [
  "darwin",
  "win32",
  "linux",
  "ios",
  "android",
  "web",
  "unknown",
] as const

export const BUG_REPORT_ARCHES = [
  "arm64",
  "x64",
  "ia32",
  "universal",
  "unknown",
] as const

export const BUG_REPORT_LIFECYCLE_STATES = [
  "anonymous",
  "locked",
  "authorized",
  "linking",
  "syncing",
  "revoked",
  "unknown",
] as const

export type BugReportType = (typeof BUG_REPORT_TYPES)[number]
export type BugReportClientKind = (typeof BUG_REPORT_CLIENT_KINDS)[number]
export type BugReportPlatform = (typeof BUG_REPORT_PLATFORMS)[number]
export type BugReportArch = (typeof BUG_REPORT_ARCHES)[number]
export type BugReportLifecycleState =
  (typeof BUG_REPORT_LIFECYCLE_STATES)[number]

export interface BugReportTelemetry {
  appVersion: string
  clientKind: BugReportClientKind
  platform: BugReportPlatform
  arch: BugReportArch
  lifecycleState: BugReportLifecycleState
  osRelease: string
  appSurface: string
}

export interface BugReportInput {
  type: BugReportType
  title?: string
  description: string
  steps?: string
  telemetry: BugReportTelemetry
}

const TYPE_SET = new Set<BugReportType>(BUG_REPORT_TYPES)
const CLIENT_KIND_SET = new Set<BugReportClientKind>(BUG_REPORT_CLIENT_KINDS)
const PLATFORM_SET = new Set<BugReportPlatform>(BUG_REPORT_PLATFORMS)
const ARCH_SET = new Set<BugReportArch>(BUG_REPORT_ARCHES)
const LIFECYCLE_SET = new Set<BugReportLifecycleState>(
  BUG_REPORT_LIFECYCLE_STATES
)

/**
 * Surface name the dialog stamps on every report when no caller-provided
 * surface is available. The dialog is opened from the settings → help
 * section, so this is the truthful default. Callers may pass a more
 * specific value (e.g. `"settings.devices"`) when they open the dialog
 * from another context.
 */
export const DEFAULT_BUG_REPORT_APP_SURFACE = "settings.help"

const TITLE_MAX_LEN = 120
const DESCRIPTION_MAX_LEN = 4000
const STEPS_MAX_LEN = 2000

/**
 * Narrow shape `buildTelemetry` reads from the desktop preload bridge.
 * Matches the `DesktopApi` surface declared in `hush-desktop` but only
 * the parts we actually need. Browser builds never receive this and the
 * builder falls back to the `"web"` defaults.
 */
export interface BugReportDesktopBridge {
  readonly isDesktop?: boolean
  readonly platform?: string
  readonly arch?: string
  readonly osRelease?: string
}

/**
 * Inputs from React state that map onto the wire telemetry. Everything
 * is optional because every field has a safe fallback; the goal is to
 * make the builder usable from contexts where some of the data is not
 * available yet (vault still locked, no desktop bridge, etc.).
 */
export interface BugReportTelemetryContext {
  /** Optional override for the running client version. */
  appVersion?: string | null
  /** Auth lifecycle hint from `useAuth().vaultState` etc. */
  lifecycleState?: BugReportLifecycleState | null
  /** Caller-provided surface name (e.g. `"settings.help"`). */
  appSurface?: string | null
  /** Desktop preload bridge if the renderer is in Electron. */
  desktopBridge?: BugReportDesktopBridge | null
}

function normalizePlatform(value: unknown): BugReportPlatform {
  if (typeof value !== "string") return "unknown"
  if (PLATFORM_SET.has(value as BugReportPlatform)) {
    return value as BugReportPlatform
  }
  return "unknown"
}

function normalizeArch(value: unknown): BugReportArch {
  if (typeof value !== "string") return "unknown"
  if (ARCH_SET.has(value as BugReportArch)) {
    return value as BugReportArch
  }
  return "unknown"
}

function detectBrowserPlatform(): BugReportPlatform {
  if (typeof navigator === "undefined") return "unknown"
  const ua = navigator.userAgent ?? ""
  if (/Mac/i.test(ua)) return "darwin"
  if (/Win/i.test(ua)) return "win32"
  if (/Android/i.test(ua)) return "android"
  if (/(iPhone|iPad|iPod)/i.test(ua)) return "ios"
  if (/Linux/i.test(ua)) return "linux"
  return "web"
}

function detectBrowserArch(): BugReportArch {
  if (typeof navigator === "undefined") return "unknown"
  const ua = navigator.userAgent ?? ""
  if (/arm64|aarch64/i.test(ua)) return "arm64"
  if (/x86_64|Win64|x64/i.test(ua)) return "x64"
  return "unknown"
}

/**
 * Builds the telemetry block exactly as the proxy expects. Every field
 * is normalized into the allowed value set so the proxy never rejects a
 * report because the client invented a label.
 */
export function buildBugReportTelemetry(
  context: BugReportTelemetryContext = {}
): BugReportTelemetry {
  const bridge = context.desktopBridge ?? null
  const isDesktop = Boolean(bridge?.isDesktop)
  const clientKind: BugReportClientKind = isDesktop ? "desktop" : "web"

  const platform: BugReportPlatform = isDesktop
    ? normalizePlatform(bridge?.platform)
    : detectBrowserPlatform()

  const arch: BugReportArch = isDesktop
    ? normalizeArch(bridge?.arch)
    : detectBrowserArch()

  const osRelease =
    typeof bridge?.osRelease === "string" && bridge.osRelease.length > 0
      ? bridge.osRelease
      : "unknown"

  const lifecycleState: BugReportLifecycleState =
    context.lifecycleState && LIFECYCLE_SET.has(context.lifecycleState)
      ? context.lifecycleState
      : "unknown"

  const appVersion =
    typeof context.appVersion === "string" && context.appVersion.length > 0
      ? context.appVersion
      : CLIENT_VERSION || "unknown"

  const appSurface =
    typeof context.appSurface === "string" && context.appSurface.length > 0
      ? context.appSurface
      : DEFAULT_BUG_REPORT_APP_SURFACE

  return {
    appVersion,
    clientKind,
    platform,
    arch,
    lifecycleState,
    osRelease,
    appSurface,
  }
}

export interface BugReportValidationError {
  field:
    | "type"
    | "description"
    | "title"
    | "steps"
    | "telemetry.appVersion"
    | "telemetry.clientKind"
    | "telemetry.platform"
    | "telemetry.arch"
    | "telemetry.lifecycleState"
    | "telemetry.osRelease"
    | "telemetry.appSurface"
  message: string
}

/**
 * Validates a fully-built input against the proxy contract. Returns the
 * first error so the dialog can show one actionable message rather than
 * a list. Keeps validation logic in one place so the submitter and the
 * tests cannot disagree.
 */
export function validateBugReportInput(
  input: BugReportInput
): BugReportValidationError | null {
  if (!TYPE_SET.has(input.type)) {
    return { field: "type", message: "Pick a report type." }
  }
  if (
    typeof input.description !== "string" ||
    input.description.trim().length === 0
  ) {
    return {
      field: "description",
      message: "Describe what happened before sending.",
    }
  }
  if (input.description.length > DESCRIPTION_MAX_LEN) {
    return {
      field: "description",
      message: `Description must be ${DESCRIPTION_MAX_LEN} characters or less.`,
    }
  }
  if (typeof input.title === "string" && input.title.length > TITLE_MAX_LEN) {
    return {
      field: "title",
      message: `Title must be ${TITLE_MAX_LEN} characters or less.`,
    }
  }
  if (typeof input.steps === "string" && input.steps.length > STEPS_MAX_LEN) {
    return {
      field: "steps",
      message: `Steps must be ${STEPS_MAX_LEN} characters or less.`,
    }
  }
  const t = input.telemetry
  if (typeof t?.appVersion !== "string" || t.appVersion.length === 0) {
    return { field: "telemetry.appVersion", message: "Missing app version." }
  }
  if (!CLIENT_KIND_SET.has(t.clientKind)) {
    return { field: "telemetry.clientKind", message: "Invalid client kind." }
  }
  if (!PLATFORM_SET.has(t.platform)) {
    return { field: "telemetry.platform", message: "Invalid platform." }
  }
  if (!ARCH_SET.has(t.arch)) {
    return { field: "telemetry.arch", message: "Invalid architecture." }
  }
  if (!LIFECYCLE_SET.has(t.lifecycleState)) {
    return {
      field: "telemetry.lifecycleState",
      message: "Invalid lifecycle state.",
    }
  }
  if (typeof t.osRelease !== "string" || t.osRelease.length === 0) {
    return { field: "telemetry.osRelease", message: "Missing OS release." }
  }
  if (typeof t.appSurface !== "string" || t.appSurface.length === 0) {
    return { field: "telemetry.appSurface", message: "Missing app surface." }
  }
  return null
}

/**
 * Builds the exact JSON payload posted to the proxy. Omits optional
 * fields when they are blank instead of sending empty strings (the
 * proxy treats empty title/steps as absent already, but the wire is
 * cleaner without them).
 */
export function buildBugReportPayload(input: BugReportInput): Record<string, unknown> {
  const payload: Record<string, unknown> = {
    type: input.type,
    description: input.description.trim(),
    telemetry: input.telemetry,
  }
  if (typeof input.title === "string" && input.title.trim().length > 0) {
    payload.title = input.title.trim()
  }
  if (typeof input.steps === "string" && input.steps.trim().length > 0) {
    payload.steps = input.steps.trim()
  }
  return payload
}

export type BugReportSubmitOutcome =
  | { status: "ok" }
  | { status: "validation_error"; error: BugReportValidationError }
  | { status: "not_configured" }
  | { status: "rejected"; httpStatus: number; body: string }
  | { status: "network_error"; message: string }

interface SubmitDeps {
  fetcher?: typeof fetch
  endpoint?: string
}

/**
 * Submits the report. Never retries — explicit recoverable outcomes are
 * returned to the caller so the dialog can decide what to render.
 *
 * - `validation_error`: the dialog highlights the bad field; nothing
 *   was sent.
 * - `not_configured`: the proxy returned 503 (Linear not wired yet).
 *   We surface a dedicated UI string rather than dumping the body.
 * - `rejected`: every other non-2xx; the dialog shows a generic
 *   "could not submit" message plus an opportunity to copy the
 *   telemetry preview.
 * - `network_error`: fetch threw (offline, DNS, etc.).
 */
export async function submitBugReport(
  input: BugReportInput,
  deps: SubmitDeps = {}
): Promise<BugReportSubmitOutcome> {
  const validation = validateBugReportInput(input)
  if (validation) {
    return { status: "validation_error", error: validation }
  }
  const fetcher = deps.fetcher ?? fetch
  const endpoint = deps.endpoint ?? BUG_REPORT_ENDPOINT
  let response: Response
  try {
    response = await fetcher(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildBugReportPayload(input)),
    })
  } catch (err) {
    return {
      status: "network_error",
      message: err instanceof Error ? err.message : String(err),
    }
  }
  if (response.ok) {
    return { status: "ok" }
  }
  if (response.status === 503) {
    return { status: "not_configured" }
  }
  let body = ""
  try {
    body = await response.text()
  } catch {
    // Some runtimes throw on text() after the request stream closes.
    // The status code alone is enough for the dialog copy.
  }
  return { status: "rejected", httpStatus: response.status, body }
}
