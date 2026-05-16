/**
 * Self-removal voice-disconnect decision helper.
 *
 * When the local user receives a moderation event saying they were
 * kicked/banned from a server, any active voice session that belongs
 * to that exact `{serverId, instanceUrl}` MUST be torn down
 * immediately — navigation alone is not enough, because the voice
 * room can persist across guild navigation and would keep the user
 * connected to a server they are no longer a member of (an
 * authorization bypass).
 *
 * Cross-instance safety: two federated instances can expose guilds
 * with the same id. Comparison is on BOTH `serverId` and the
 * normalized origin of `instanceUrl`, so a removal event from one
 * instance never tears down a voice session on another.
 *
 * Pure helper so unit tests can pin the comparison logic without
 * mounting the AuthenticatedApp tree.
 *
 * CORE-INVARIANTS - Voice Rooms and LiveKit (voice membership
 * follows server membership) + "Instance boundaries must never leak
 * credentials" (no cross-instance teardown by id collision).
 */

export interface SelfRemovalInfo {
  serverId: string
  instanceUrl: string | null | undefined
}

export interface JoinedVoiceLike {
  serverId: string
  instanceUrl: string | null | undefined
}

/**
 * Normalize a URL string to its origin so trailing-slash / path
 * differences do not produce false positives or negatives. Returns
 * `null` when the value is empty or unparseable.
 */
function normalizeInstanceOrigin(value: string | null | undefined): string | null {
  if (!value) return null
  try {
    return new URL(value).origin
  } catch {
    return null
  }
}

/**
 * Decide whether the active voice room should be left in response to
 * a self kick/ban moderation event.
 *
 * Returns `true` only when:
 *   - both inputs are present;
 *   - `serverId` matches exactly;
 *   - the normalized origins of both `instanceUrl`s match;
 *   - neither origin is null (malformed inputs fail closed — we do
 *     NOT want to tear down a real voice session on a malformed
 *     event).
 */
export function shouldLeaveVoiceAfterSelfRemoval(
  removal: SelfRemovalInfo | null | undefined,
  joinedVoice: JoinedVoiceLike | null | undefined
): boolean {
  if (!removal || !joinedVoice) return false
  if (removal.serverId !== joinedVoice.serverId) return false
  const removalOrigin = normalizeInstanceOrigin(removal.instanceUrl)
  const joinedOrigin = normalizeInstanceOrigin(joinedVoice.instanceUrl)
  if (!removalOrigin || !joinedOrigin) return false
  return removalOrigin === joinedOrigin
}
