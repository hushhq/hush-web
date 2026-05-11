/**
 * Display helpers for user identities.
 *
 * Two distinct concepts surface in the UI:
 *
 * - `displayName`: the human-friendly label the user picks. Shown
 *   without any prefix.
 * - `username`: the @-handle. Always shown with a leading "@" so it
 *   reads as a handle, never as a free-form name.
 *
 * Components that need to render a single label per user typically
 * fall back from displayName → username when displayName is missing.
 * In that fallback the visible string still represents the username,
 * so it MUST keep the "@" prefix.
 */

/**
 * Formats a username as an "@handle". Returns an empty string when
 * `username` is falsy / blank so callers can render a fallback.
 */
export function formatHandle(username: string | null | undefined): string {
  if (!username) return ""
  const trimmed = username.trim()
  if (!trimmed) return ""
  return `@${trimmed.replace(/^@+/, "")}`
}

/**
 * Returns a display name only when it is distinct from the user's handle.
 *
 * Older clients could persist the username/handle into `display_name` when the
 * optional display-name field was left blank. Treat that legacy value as
 * missing so two-line account surfaces do not render "@alice" twice.
 */
export function sanitizeDisplayName(
  displayName: string | null | undefined,
  username?: string | null
): string {
  const display = displayName?.trim() ?? ""
  if (!display) return ""

  const strippedDisplay = display.replace(/^@+/, "")
  const strippedUsername = username?.trim().replace(/^@+/, "") ?? ""
  const isHandleShaped = display.startsWith("@")
  const isExactUsername = strippedUsername && strippedDisplay === strippedUsername
  const isHandleForUsername =
    isHandleShaped &&
    strippedUsername &&
    strippedDisplay.toLowerCase() === strippedUsername.toLowerCase()

  if (isExactUsername || isHandleForUsername) {
    return ""
  }

  return display
}

/**
 * Reads a user display name from either API shape used by the app.
 * The Go API serializes `displayName`; some older React paths used
 * `display_name`. Account surfaces should not care which shape arrived.
 */
export function getUserDisplayName(
  user:
    | {
        displayName?: string | null
        display_name?: string | null
      }
    | null
    | undefined
): string {
  const camel = user?.displayName?.trim()
  if (camel) return camel
  return user?.display_name?.trim() ?? ""
}

/**
 * Returns the best human label for a user:
 *   - `displayName` if non-blank (rendered as-is)
 *   - else "@username" if `username` is non-blank
 *   - else `fallback` (defaults to "user")
 */
export function formatUserLabel(
  args: {
    displayName?: string | null
    username?: string | null
    fallback?: string
  } = {}
): string {
  const display = sanitizeDisplayName(args.displayName, args.username)
  if (display) return display
  const handle = formatHandle(args.username)
  if (handle) return handle
  return args.fallback ?? "user"
}
