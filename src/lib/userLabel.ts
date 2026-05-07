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
  return trimmed.startsWith("@") ? trimmed : `@${trimmed}`
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
  const display = args.displayName?.trim()
  if (display) return display
  const handle = formatHandle(args.username)
  if (handle) return handle
  return args.fallback ?? "user"
}
