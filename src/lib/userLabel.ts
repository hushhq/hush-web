/**
 * Display helpers for user identities.
 *
 * Two distinct concepts surface in the UI:
 *
 * - `displayName`: the human-friendly label the user picks. Shown
 *   without any prefix.
 * - `username`: the stable account handle. Stored and passed around
 *   without decoration.
 *
 * Components that need to render a single label per user typically
 * fall back from displayName → username when displayName is missing,
 * but they still render a human label, not a prefixed handle.
 */

/**
 * Formats a username as an "@handle". Returns an empty string when
 * `username` is falsy / blank so callers can render a fallback.
 */
export function formatHandle(username: string | null | undefined): string {
  const trimmed = formatUsername(username)
  if (!trimmed) return ""
  return `@${trimmed}`
}

/**
 * Normalizes a username for display and comparison. Usernames are data,
 * not preformatted handles, so any legacy leading "@" is stripped at
 * the boundary.
 */
export function formatUsername(username: string | null | undefined): string {
  if (!username) return ""
  return username.trim().replace(/^@+/, "")
}

/**
 * Returns a normalized display name.
 *
 * Older clients could persist handle-shaped values such as "@alice" into
 * `display_name`. Strip the presentation marker, but keep the label: if
 * a user intentionally leaves display name equal to username, that is still
 * the primary name the app should show.
 */
export function sanitizeDisplayName(
  displayName: string | null | undefined,
  _username?: string | null
): string {
  const display = displayName?.trim() ?? ""
  if (!display) return ""
  return display.replace(/^@+/, "")
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
 *   - else `username` if non-blank (without "@")
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
  const username = formatUsername(args.username)
  if (username) return username
  return args.fallback ?? "user"
}
