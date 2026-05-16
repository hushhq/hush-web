/**
 * Server-action target resolution for `AuthenticatedApp`.
 *
 * Federated clients can connect to two instances that both expose a
 * guild with the same id. Any destructive or settings action that
 * resolves only by `serverId` risks acting on the wrong instance with
 * the wrong token and base URL. Every rail-triggered action must
 * therefore carry the full `{ id, instanceUrl }` identity, and the
 * receiver must match on BOTH fields.
 *
 * Pure helper module so unit tests can pin the resolution logic
 * without mounting the AuthenticatedApp tree.
 *
 * CORE-INVARIANTS - "Instance boundaries must never leak credentials"
 * + "Users must be able to communicate" + "Build, release, and deploy
 * discipline".
 */

export interface ServerActionTarget {
  id: string
  instanceUrl: string | null
}

interface ServerLike {
  id: string
  raw: { instanceUrl: string | null }
}

/**
 * Equality on the `{ id, instanceUrl }` pair. `null` instanceUrls
 * never match anything (including each other) so an unidentified
 * target cannot collide with another unidentified one by accident.
 */
export function serverTargetsMatch(
  a: ServerActionTarget | null | undefined,
  b: ServerActionTarget | null | undefined
): boolean {
  if (!a || !b) return false
  if (!a.instanceUrl || !b.instanceUrl) return false
  return a.id === b.id && a.instanceUrl === b.instanceUrl
}

/**
 * Find the server entry that matches BOTH `target.id` and
 * `target.instanceUrl`. Returns `null` when no exact match exists —
 * callers must NOT fall back to a bare-id match because that is
 * exactly the cross-instance ambiguity this module exists to block.
 */
export function resolveServerForAction<T extends ServerLike>(
  servers: readonly T[],
  target: ServerActionTarget | null | undefined
): T | null {
  if (!target || !target.instanceUrl) return null
  return (
    servers.find(
      (s) => s.id === target.id && s.raw.instanceUrl === target.instanceUrl
    ) ?? null
  )
}
