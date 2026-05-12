/**
 * Verifies useTextChannelMLSCommitListener subscribes to mls.commit
 * + mls.add_request, filters voice commits and self-device echoes,
 * and routes inbound frames through processCommit /
 * removeMemberFromChannel under the channel MLS mutex.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"

// IMPORTANT: vi.mock factories must be self-contained — top-level
// `vi.fn()` declarations are hoisted *after* the mock factory runs,
// which produces "Cannot access 'X' before initialization" if the
// factory closes over them. We therefore create the spies inside
// each factory and re-import them as the typed module.

vi.mock("@/lib/mlsGroup", () => ({
  processCommit: vi.fn().mockResolvedValue(undefined),
  catchupCommits: vi.fn().mockResolvedValue(undefined),
  removeMemberFromChannel: vi.fn().mockResolvedValue(undefined),
}))

vi.mock("@/lib/mlsStore", () => ({
  openStore: vi.fn().mockResolvedValue({ fake: "db" }),
  getCredential: vi.fn().mockResolvedValue({ fake: "credential" }),
}))

vi.mock("@/lib/hushCrypto", () => ({}))
vi.mock("@/lib/api", () => ({}))

vi.mock("@/lib/channelMLSMutex", () => ({
  withChannelMLSMutex: (_key: string, fn: () => Promise<unknown>) => fn(),
  textChannelKey: (id: string) => `text:${id}`,
}))

vi.mock("@/hooks/useAuth", () => ({
  getDeviceId: () => "device-self",
}))

import * as mlsGroupMod from "@/lib/mlsGroup"
import { useTextChannelMLSCommitListener } from "./useTextChannelMLSCommitListener"

const processCommit = vi.mocked(mlsGroupMod.processCommit)
const catchupCommits = vi.mocked(mlsGroupMod.catchupCommits)
const removeMemberFromChannel = vi.mocked(
  mlsGroupMod.removeMemberFromChannel,
)

interface FakeWs {
  on: ReturnType<typeof vi.fn>
  off: ReturnType<typeof vi.fn>
  emit: (event: string, payload: unknown) => void
}

function makeWs(): FakeWs {
  const handlers = new Map<string, (data: unknown) => void>()
  return {
    on: vi.fn((event: string, h: (d: unknown) => void) => {
      handlers.set(event, h)
    }),
    off: vi.fn((event: string) => {
      handlers.delete(event)
    }),
    emit(event, payload) {
      handlers.get(event)?.(payload)
    },
  }
}

const VALID_COMMIT_BYTES = btoa("commit-bytes")

describe("useTextChannelMLSCommitListener", () => {
  beforeEach(() => {
    processCommit.mockReset().mockResolvedValue(undefined)
    catchupCommits.mockReset().mockResolvedValue(undefined)
    removeMemberFromChannel.mockReset().mockResolvedValue(undefined)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it("processes a peer mls.commit on a text channel", async () => {
    const ws = makeWs()
    renderHook(() =>
      useTextChannelMLSCommitListener({
        wsClient: ws as Parameters<
          typeof useTextChannelMLSCommitListener
        >[0]["wsClient"],
        currentUserId: "user-self",
        getToken: () => "tok",
      }),
    )

    ws.emit("mls.commit", {
      type: "mls.commit",
      channel_id: "ch-1",
      commit_bytes: VALID_COMMIT_BYTES,
      sender_id: "user-other",
      sender_device_id: "device-other",
      group_type: "text",
    })

    await waitFor(() => {
      expect(processCommit).toHaveBeenCalledTimes(1)
    })
    expect(processCommit.mock.calls[0][1]).toBe("ch-1")
    expect(catchupCommits).not.toHaveBeenCalled()
  })

  it("falls back to catchupCommits when processCommit throws", async () => {
    processCommit.mockRejectedValueOnce(new Error("epoch mismatch"))
    const ws = makeWs()
    renderHook(() =>
      useTextChannelMLSCommitListener({
        wsClient: ws as Parameters<
          typeof useTextChannelMLSCommitListener
        >[0]["wsClient"],
        currentUserId: "user-self",
        getToken: () => "tok",
      }),
    )

    ws.emit("mls.commit", {
      type: "mls.commit",
      channel_id: "ch-1",
      commit_bytes: VALID_COMMIT_BYTES,
      sender_id: "user-other",
      sender_device_id: "device-other",
      group_type: "text",
    })

    await waitFor(() => {
      expect(catchupCommits).toHaveBeenCalledTimes(1)
    })
  })

  it("threads baseUrl into the fallback catchup deps (PR #13 JWT leak regression)", async () => {
    // Regression: the commit listener fallback runs
    // mlsGroup.catchupCommits which fetches commits from
    // api.getMLSCommitsSinceEpoch carrying the per-instance JWT.
    // Without the owning instance baseUrl threaded through deps, the
    // request would target window.location.origin and leak the token.
    // The PerInstanceListeners host now passes instance.instanceUrl
    // as baseUrl; assert it actually reaches catchupCommits.
    processCommit.mockRejectedValueOnce(new Error("epoch mismatch"))
    const ws = makeWs()
    renderHook(() =>
      useTextChannelMLSCommitListener({
        wsClient: ws as Parameters<
          typeof useTextChannelMLSCommitListener
        >[0]["wsClient"],
        currentUserId: "user-self",
        getToken: () => "tok",
        baseUrl: "https://chat.example.com",
      }),
    )

    ws.emit("mls.commit", {
      type: "mls.commit",
      channel_id: "ch-1",
      commit_bytes: VALID_COMMIT_BYTES,
      sender_id: "user-other",
      sender_device_id: "device-other",
      group_type: "text",
    })

    await waitFor(() => {
      expect(catchupCommits).toHaveBeenCalledTimes(1)
    })
    expect(catchupCommits).toHaveBeenCalledWith(
      expect.objectContaining({ baseUrl: "https://chat.example.com" }),
      "ch-1",
    )
  })

  it("ignores voice-group mls.commit frames", async () => {
    const ws = makeWs()
    renderHook(() =>
      useTextChannelMLSCommitListener({
        wsClient: ws as Parameters<
          typeof useTextChannelMLSCommitListener
        >[0]["wsClient"],
        currentUserId: "user-self",
        getToken: () => "tok",
      }),
    )

    ws.emit("mls.commit", {
      type: "mls.commit",
      channel_id: "ch-voice",
      commit_bytes: VALID_COMMIT_BYTES,
      sender_id: "user-other",
      sender_device_id: "device-other",
      group_type: "voice",
    })

    // Allow a tick so any async work would have started.
    await new Promise((r) => setTimeout(r, 0))
    expect(processCommit).not.toHaveBeenCalled()
  })

  it("skips self-device commits", async () => {
    const ws = makeWs()
    renderHook(() =>
      useTextChannelMLSCommitListener({
        wsClient: ws as Parameters<
          typeof useTextChannelMLSCommitListener
        >[0]["wsClient"],
        currentUserId: "user-self",
        getToken: () => "tok",
      }),
    )

    ws.emit("mls.commit", {
      type: "mls.commit",
      channel_id: "ch-1",
      commit_bytes: VALID_COMMIT_BYTES,
      sender_id: "user-self",
      sender_device_id: "device-self",
      group_type: "text",
    })

    await new Promise((r) => setTimeout(r, 0))
    expect(processCommit).not.toHaveBeenCalled()
  })

  it("processes commits from the same user on a different device", async () => {
    const ws = makeWs()
    renderHook(() =>
      useTextChannelMLSCommitListener({
        wsClient: ws as Parameters<
          typeof useTextChannelMLSCommitListener
        >[0]["wsClient"],
        currentUserId: "user-self",
        getToken: () => "tok",
      }),
    )

    ws.emit("mls.commit", {
      type: "mls.commit",
      channel_id: "ch-1",
      commit_bytes: VALID_COMMIT_BYTES,
      sender_id: "user-self",
      sender_device_id: "device-other",
      group_type: "text",
    })

    await waitFor(() => {
      expect(processCommit).toHaveBeenCalledTimes(1)
    })
  })

  it("commits a remove on mls.add_request action=remove from a peer", async () => {
    const ws = makeWs()
    renderHook(() =>
      useTextChannelMLSCommitListener({
        wsClient: ws as Parameters<
          typeof useTextChannelMLSCommitListener
        >[0]["wsClient"],
        currentUserId: "user-self",
        getToken: () => "tok",
      }),
    )

    ws.emit("mls.add_request", {
      type: "mls.add_request",
      channel_id: "ch-1",
      action: "remove",
      requester_id: "user-leaver",
    })

    await waitFor(() => {
      expect(removeMemberFromChannel).toHaveBeenCalledTimes(1)
    })
    expect(removeMemberFromChannel.mock.calls[0][1]).toBe("ch-1")
    expect(removeMemberFromChannel.mock.calls[0][2]).toBe("user-leaver")
  })

  it("skips own mls.add_request remove", async () => {
    const ws = makeWs()
    renderHook(() =>
      useTextChannelMLSCommitListener({
        wsClient: ws as Parameters<
          typeof useTextChannelMLSCommitListener
        >[0]["wsClient"],
        currentUserId: "user-self",
        getToken: () => "tok",
      }),
    )

    ws.emit("mls.add_request", {
      type: "mls.add_request",
      channel_id: "ch-1",
      action: "remove",
      requester_id: "user-self",
    })

    await new Promise((r) => setTimeout(r, 0))
    expect(removeMemberFromChannel).not.toHaveBeenCalled()
  })

  it("treats 'already removed' as a benign idempotent skip", async () => {
    removeMemberFromChannel.mockRejectedValueOnce(
      new Error("Member already removed from group"),
    )
    const ws = makeWs()
    renderHook(() =>
      useTextChannelMLSCommitListener({
        wsClient: ws as Parameters<
          typeof useTextChannelMLSCommitListener
        >[0]["wsClient"],
        currentUserId: "user-self",
        getToken: () => "tok",
      }),
    )

    ws.emit("mls.add_request", {
      type: "mls.add_request",
      channel_id: "ch-1",
      action: "remove",
      requester_id: "user-leaver",
    })

    await waitFor(() => {
      expect(removeMemberFromChannel).toHaveBeenCalledTimes(1)
    })
    // Listener swallows the benign race; no rethrow.
  })

  it("ignores mls.add_request with action other than remove", async () => {
    const ws = makeWs()
    renderHook(() =>
      useTextChannelMLSCommitListener({
        wsClient: ws as Parameters<
          typeof useTextChannelMLSCommitListener
        >[0]["wsClient"],
        currentUserId: "user-self",
        getToken: () => "tok",
      }),
    )

    ws.emit("mls.add_request", {
      type: "mls.add_request",
      channel_id: "ch-1",
      action: "add",
      requester_id: "user-other",
    })

    await new Promise((r) => setTimeout(r, 0))
    expect(removeMemberFromChannel).not.toHaveBeenCalled()
  })
})
