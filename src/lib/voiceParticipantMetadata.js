/**
 * Parses + validates a LiveKit participant's `metadata` claim into
 * a device-scoped MLS leaf identity (`userId:deviceId`).
 *
 * The server stamps this metadata on the LiveKit access token in
 * `internal/api/livekit.go` so remote peers can evict the exact
 * MLS leaf when a participant disconnects. LiveKit's bare
 * `participant.identity` intentionally stays as the application
 * user id (used for moderation / UI), so it is NOT a valid MLS
 * removal target on its own — using it would either miss the
 * leaf or evict the wrong device's leaf.
 *
 * Returns the canonical `userId:deviceId` string when every check
 * below passes:
 *
 *  - `metadata` is a non-empty string that parses as a JSON object;
 *  - `userId`, `deviceId`, `mlsIdentity` are all non-empty strings;
 *  - `mlsIdentity` exactly equals `${userId}:${deviceId}`;
 *  - if `participant.identity` is set, it equals `userId` (the
 *    server's contract — anything else means the metadata was
 *    forged or attached to the wrong participant).
 *
 * Returns `null` for any other input. Callers MUST NOT fall back to
 * `participant.identity` when this returns `null`; they should
 * either skip the MLS operation or run a safe catch-up path.
 */
export function parseVoiceParticipantMlsIdentity(participant) {
  if (!participant || typeof participant !== "object") return null;

  const raw = participant.metadata;
  if (typeof raw !== "string" || raw.length === 0) return null;

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }
  if (!parsed || typeof parsed !== "object") return null;

  const { userId, deviceId, mlsIdentity } = parsed;
  if (typeof userId !== "string" || userId.length === 0) return null;
  if (typeof deviceId !== "string" || deviceId.length === 0) return null;
  if (typeof mlsIdentity !== "string" || mlsIdentity.length === 0) return null;

  if (mlsIdentity !== `${userId}:${deviceId}`) return null;

  if (
    typeof participant.identity === "string" &&
    participant.identity.length > 0 &&
    participant.identity !== userId
  ) {
    return null;
  }

  return mlsIdentity;
}

/**
 * Deterministic single-remover election for voice MLS eviction.
 *
 * Background: every remaining client in a voice room observes
 * `RoomEvent.ParticipantDisconnected` and would otherwise call
 * `removeMemberFromVoiceGroup` for the departed leaf. With 3+
 * remaining clients on the same epoch, two or more devices
 * produce concurrent removal commits for the same leaf, which
 * either races into wrong-epoch errors or leaves duplicate
 * commits in the MLS log. The fix is to deterministically pick
 * exactly one remover before scheduling the rotation.
 *
 * Rules:
 *
 *  - Build the candidate set as the union of the local MLS
 *    identity and every remote participant whose metadata parses
 *    via {@link parseVoiceParticipantMlsIdentity}.
 *  - Exclude the departed identity (it has already left and
 *    cannot remove itself).
 *  - Ignore participants with missing / malformed metadata
 *    rather than throwing; they are simply not eligible to
 *    remove anyone, which keeps the election a pure function of
 *    trusted inputs.
 *  - Elect the lexicographic-smallest identity. Every client sees
 *    the same candidate set (modulo bad metadata, which is
 *    consistently ignored), so every client picks the same
 *    remover without coordination.
 *  - Return `true` iff the local identity is the elected remover.
 *
 * Returns `false` when:
 *
 *  - `localMlsIdentity` is missing or not a non-empty string;
 *  - `departedMlsIdentity` is missing or not a non-empty string;
 *  - the local identity is not in the candidate set (e.g. it
 *    matches the departed identity — local was the departed
 *    one);
 *  - some other identity is lexicographically smaller.
 *
 * @param {string} localMlsIdentity - `${currentUserId}:${getDeviceId()}`.
 * @param {string} departedMlsIdentity - resolved identity of the
 *   departed participant.
 * @param {Iterable<object> | null | undefined} remoteParticipants - iterable
 *   of LiveKit remote participant snapshots; their `metadata` is
 *   parsed with {@link parseVoiceParticipantMlsIdentity}.
 * @returns {boolean}
 */
export function isElectedVoiceMlsRemover(
  localMlsIdentity,
  departedMlsIdentity,
  remoteParticipants,
) {
  if (typeof localMlsIdentity !== "string" || localMlsIdentity.length === 0) {
    return false;
  }
  if (typeof departedMlsIdentity !== "string" || departedMlsIdentity.length === 0) {
    return false;
  }
  if (localMlsIdentity === departedMlsIdentity) {
    // Local was the departed leaf; the remaining clients run the
    // removal, not us.
    return false;
  }

  const candidates = new Set();
  candidates.add(localMlsIdentity);

  if (remoteParticipants) {
    try {
      for (const participant of remoteParticipants) {
        const id = parseVoiceParticipantMlsIdentity(participant);
        if (typeof id !== "string" || id.length === 0) continue;
        if (id === departedMlsIdentity) continue;
        candidates.add(id);
      }
    } catch {
      // If the remaining-participant set cannot be enumerated, we
      // cannot prove that this client is the unique elected remover.
      // Fail closed: a later voice MLS commit or room-empty cleanup
      // is safer than letting every client independently assume it
      // is the sole candidate and emit duplicate same-epoch commits.
      return false;
    }
  }

  // Lexicographic smallest wins. String comparison is total and
  // deterministic across V8/JSC/SM, which is the only contract we
  // need here.
  let elected = null;
  for (const id of candidates) {
    if (elected === null || id < elected) {
      elected = id;
    }
  }
  return elected === localMlsIdentity;
}
