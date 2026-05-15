/**
 * Pure label resolver for `SystemChannelView`'s actor + target columns.
 *
 * Returns the render-ready string the row should display:
 *
 *   - `displayName` (without the `@` prefix) when one is set;
 *   - else `@username` (with exactly one `@`) when the handle is known;
 *   - else `null` so the row falls back to a short-id.
 *
 * Pinning the formatting here — instead of letting `ActorTag` prepend `@`
 * blindly — prevents `@@alice` (double-`@`) and `@Mario Rossi` (handle
 * prefix on a display name) rendering bugs.
 */

interface ActorCandidate {
  id: string
  displayName?: string | null
  username?: string | null
}

export function resolveActorLabel(
  members: ReadonlyArray<ActorCandidate>,
  id: string,
): string | null {
  const match = members.find((m) => m.id === id)
  if (!match) return null
  const displayName = match.displayName?.trim()
  if (displayName) return displayName
  const username = match.username?.trim().replace(/^@+/, "")
  if (username) return `@${username}`
  return null
}
