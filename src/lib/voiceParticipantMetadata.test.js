/**
 * Tests for parseVoiceParticipantMlsIdentity.
 *
 * The function is the only place that converts a LiveKit
 * participant snapshot into an MLS leaf identity, so every
 * "should reject" branch closes a potential cross-identity leak
 * in the voice-MLS eviction path.
 */
import { describe, it, expect } from "vitest";
import {
  parseVoiceParticipantMlsIdentity,
  isElectedVoiceMlsRemover,
} from "./voiceParticipantMetadata.js";

function withMetadata(metadata, identity = "u-1") {
  return { identity, metadata };
}

describe("parseVoiceParticipantMlsIdentity", () => {
  it("returns `${userId}:${deviceId}` for valid metadata", () => {
    const p = withMetadata(
      JSON.stringify({ userId: "u-1", deviceId: "d-1", mlsIdentity: "u-1:d-1" }),
      "u-1",
    );
    expect(parseVoiceParticipantMlsIdentity(p)).toBe("u-1:d-1");
  });

  it("rejects null / non-object participant inputs", () => {
    expect(parseVoiceParticipantMlsIdentity(null)).toBeNull();
    expect(parseVoiceParticipantMlsIdentity(undefined)).toBeNull();
    expect(parseVoiceParticipantMlsIdentity("not-a-participant")).toBeNull();
  });

  it("rejects missing or empty metadata", () => {
    expect(parseVoiceParticipantMlsIdentity({ identity: "u-1" })).toBeNull();
    expect(parseVoiceParticipantMlsIdentity({ identity: "u-1", metadata: "" })).toBeNull();
    expect(parseVoiceParticipantMlsIdentity({ identity: "u-1", metadata: null })).toBeNull();
  });

  it("rejects malformed JSON metadata", () => {
    expect(
      parseVoiceParticipantMlsIdentity({ identity: "u-1", metadata: "{notjson" }),
    ).toBeNull();
  });

  it("rejects metadata whose mlsIdentity does not equal userId:deviceId", () => {
    // An attacker swaps the device suffix to evict a different leaf.
    const p = withMetadata(
      JSON.stringify({ userId: "u-1", deviceId: "d-1", mlsIdentity: "u-1:d-OTHER" }),
      "u-1",
    );
    expect(parseVoiceParticipantMlsIdentity(p)).toBeNull();
  });

  it("rejects metadata whose userId disagrees with participant.identity", () => {
    // LiveKit identity is the user id; mismatch means the metadata
    // was forged or attached to the wrong participant snapshot.
    const p = withMetadata(
      JSON.stringify({ userId: "u-2", deviceId: "d-1", mlsIdentity: "u-2:d-1" }),
      "u-1",
    );
    expect(parseVoiceParticipantMlsIdentity(p)).toBeNull();
  });

  it("rejects metadata that is missing any of the three required fields", () => {
    const missingUser = withMetadata(
      JSON.stringify({ deviceId: "d-1", mlsIdentity: "u-1:d-1" }),
      "u-1",
    );
    const missingDevice = withMetadata(
      JSON.stringify({ userId: "u-1", mlsIdentity: "u-1:d-1" }),
      "u-1",
    );
    const missingIdentity = withMetadata(
      JSON.stringify({ userId: "u-1", deviceId: "d-1" }),
      "u-1",
    );
    expect(parseVoiceParticipantMlsIdentity(missingUser)).toBeNull();
    expect(parseVoiceParticipantMlsIdentity(missingDevice)).toBeNull();
    expect(parseVoiceParticipantMlsIdentity(missingIdentity)).toBeNull();
  });

  it("rejects empty-string userId / deviceId / mlsIdentity", () => {
    const empties = [
      { userId: "", deviceId: "d-1", mlsIdentity: ":d-1" },
      { userId: "u-1", deviceId: "", mlsIdentity: "u-1:" },
      { userId: "u-1", deviceId: "d-1", mlsIdentity: "" },
    ];
    for (const md of empties) {
      expect(
        parseVoiceParticipantMlsIdentity({ identity: "u-1", metadata: JSON.stringify(md) }),
      ).toBeNull();
    }
  });

  it("does NOT fall back to a bare user id when metadata is missing", () => {
    // Regression: previous PR #40 used participant.identity directly,
    // which is the bare user id, not the device-scoped MLS leaf
    // identity. The parser must never produce a value derived solely
    // from `participant.identity`.
    const p = { identity: "u-1" }; // no metadata
    expect(parseVoiceParticipantMlsIdentity(p)).toBeNull();
  });

  it("accepts metadata when participant.identity is absent", () => {
    // Some LiveKit snapshots strip identity from disconnected
    // participants. As long as the metadata claim is internally
    // consistent we still accept it.
    const p = {
      metadata: JSON.stringify({
        userId: "u-1",
        deviceId: "d-1",
        mlsIdentity: "u-1:d-1",
      }),
    };
    expect(parseVoiceParticipantMlsIdentity(p)).toBe("u-1:d-1");
  });
});

// ----------------------------------------------------------------------------
// isElectedVoiceMlsRemover — deterministic single-remover election
// ----------------------------------------------------------------------------

function participantWith(userId, deviceId) {
  return {
    identity: userId,
    metadata: JSON.stringify({
      userId,
      deviceId,
      mlsIdentity: `${userId}:${deviceId}`,
    }),
  };
}

describe("isElectedVoiceMlsRemover", () => {
  it("elects the lexicographic-smallest candidate when local is that identity", () => {
    // Candidates: { local 'u-a:d-1', remote 'u-b:d-1' }. 'u-a:d-1'
    // sorts first, so local is the elected remover.
    const elected = isElectedVoiceMlsRemover(
      "u-a:d-1",
      "u-leaver:d-leaver",
      [participantWith("u-b", "d-1")],
    );
    expect(elected).toBe(true);
  });

  it("returns false when another remaining identity is smaller", () => {
    // Candidates: { local 'u-z:d-1', remote 'u-a:d-1' }. 'u-a:d-1'
    // sorts first, so this client must skip and let u-a do the
    // removal.
    const elected = isElectedVoiceMlsRemover(
      "u-z:d-1",
      "u-leaver:d-leaver",
      [participantWith("u-a", "d-1")],
    );
    expect(elected).toBe(false);
  });

  it("excludes the departed identity from the candidate set", () => {
    // 'u-a:d-1' is the departed identity, so it must NOT be in
    // candidates. With it removed, the smallest is local
    // 'u-b:d-1', so local is elected.
    const elected = isElectedVoiceMlsRemover(
      "u-b:d-1",
      "u-a:d-1",
      [participantWith("u-a", "d-1"), participantWith("u-c", "d-1")],
    );
    expect(elected).toBe(true);
  });

  it("ignores remote participants whose metadata is missing or malformed", () => {
    // Two remote participants: one valid, one malformed. The valid
    // one is 'u-c:d-1'. Local is 'u-a:d-1', which is smaller, so
    // local is elected — the malformed entry must not skew the
    // election (e.g. by being treated as identity '' or as the
    // bare LiveKit identity).
    const elected = isElectedVoiceMlsRemover(
      "u-a:d-1",
      "u-leaver:d-leaver",
      [
        { identity: "u-malformed", metadata: "{not-json" },
        participantWith("u-c", "d-1"),
      ],
    );
    expect(elected).toBe(true);
  });

  it("returns false when local identity is missing or empty", () => {
    expect(isElectedVoiceMlsRemover(null, "u-leaver:d-leaver", [])).toBe(false);
    expect(isElectedVoiceMlsRemover("", "u-leaver:d-leaver", [])).toBe(false);
  });

  it("returns false when departed identity is missing or empty", () => {
    expect(isElectedVoiceMlsRemover("u-a:d-1", null, [])).toBe(false);
    expect(isElectedVoiceMlsRemover("u-a:d-1", "", [])).toBe(false);
  });

  it("returns false when local identity equals the departed identity", () => {
    // If local was the departed leaf the local teardown path runs;
    // no removal is owed to the rest of the room.
    expect(
      isElectedVoiceMlsRemover("u-a:d-1", "u-a:d-1", [participantWith("u-b", "d-1")]),
    ).toBe(false);
  });

  it("with only the local identity as a candidate, local is elected", () => {
    // Two-participant room where the other one just left: no
    // remote remains. Local must take the removal so the departed
    // leaf is actually evicted.
    expect(
      isElectedVoiceMlsRemover("u-a:d-1", "u-leaver:d-leaver", []),
    ).toBe(true);
    expect(
      isElectedVoiceMlsRemover("u-a:d-1", "u-leaver:d-leaver", null),
    ).toBe(true);
  });

  it("deduplicates candidates so repeated remote entries do not shift the election", () => {
    // The candidate set is a Set; repeating a remote identity must
    // not change the elected identity.
    const elected = isElectedVoiceMlsRemover(
      "u-a:d-1",
      "u-leaver:d-leaver",
      [
        participantWith("u-b", "d-1"),
        participantWith("u-b", "d-1"),
        participantWith("u-b", "d-1"),
      ],
    );
    expect(elected).toBe(true);
  });

  it("returns false when remaining participant enumeration fails", () => {
    const brokenParticipants = {
      [Symbol.iterator]() {
        throw new Error("remote participants unavailable");
      },
    };

    expect(
      isElectedVoiceMlsRemover(
        "u-a:d-1",
        "u-leaver:d-leaver",
        brokenParticipants,
      ),
    ).toBe(false);
  });
});
