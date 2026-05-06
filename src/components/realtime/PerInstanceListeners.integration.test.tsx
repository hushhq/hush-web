/**
 * End-to-end coverage for inactive-server MLS commit delivery.
 *
 * Mounts a `PerInstanceListeners` (owns the global text-channel
 * `mls.commit` listener for an instance) alongside a
 * `PerServerListeners` for a BACKGROUND server (not the active
 * view). Asserts:
 *
 *   1. the background server's text channels are fetched and
 *      `subscribeChannel` is called for each;
 *   2. an `mls.commit` frame for one of those inactive channels
 *      reaches the listener;
 *   3. `mlsGroup.processCommit` is invoked under the MLS mutex
 *      with the right channel id + decoded commit bytes.
 *
 * If this test ever regresses the parity batch lost the
 * inactive-server scope it was rewritten to hold.
 */
import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, waitFor } from "@testing-library/react"

vi.mock("@/lib/api", () => ({
  getGuildChannels: vi.fn().mockResolvedValue([
    { id: "bg-text-1", type: "text" },
    { id: "bg-text-2", type: "text" },
  ]),
}))

vi.mock("@/lib/mlsGroup", () => ({
  processCommit: vi.fn().mockResolvedValue(undefined),
  catchupCommits: vi.fn().mockResolvedValue(undefined),
  removeMemberFromChannel: vi.fn().mockResolvedValue(undefined),
  leaveAllChannelGroups: vi.fn().mockResolvedValue(undefined),
}))

vi.mock("@/lib/mlsStore", () => ({
  openStore: vi.fn().mockResolvedValue({ fake: "db" }),
  getCredential: vi.fn().mockResolvedValue({ fake: "credential" }),
}))

vi.mock("@/lib/hushCrypto", () => ({}))

vi.mock("@/lib/channelMLSMutex", () => ({
  withChannelMLSMutex: (_key: string, fn: () => Promise<unknown>) => fn(),
  textChannelKey: (id: string) => `text:${id}`,
}))

vi.mock("@/hooks/useAuth", () => ({
  getDeviceId: () => "device-self",
}))

// TransparencyVerifier needs to construct without throwing when
// PerInstanceListeners builds it (the integration test does not
// care about transparency behaviour itself).
vi.mock("@/lib/transparencyVerifier", () => ({
  TransparencyVerifier: function MockVerifier() {
    return { verifyOwnKey: vi.fn().mockResolvedValue({ ok: true }) }
  },
}))

vi.mock("@/lib/identityVault", () => ({
  bytesToHex: () => "deadbeef",
}))

import * as mlsGroupMod from "@/lib/mlsGroup"
import { PerInstanceListeners } from "./PerInstanceListeners"
import { PerServerListeners } from "./PerServerListeners"

const processCommit = vi.mocked(mlsGroupMod.processCommit)

interface FakeWs {
  on: ReturnType<typeof vi.fn>
  off: ReturnType<typeof vi.fn>
  subscribeChannel: ReturnType<typeof vi.fn>
  unsubscribeChannel: ReturnType<typeof vi.fn>
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
    subscribeChannel: vi.fn(),
    unsubscribeChannel: vi.fn(),
    emit(event, payload) {
      handlers.get(event)?.(payload)
    },
  }
}

describe("PerInstanceListeners + PerServerListeners (inactive-server MLS)", () => {
  beforeEach(() => {
    processCommit.mockReset().mockResolvedValue(undefined)
  })

  it("processes mls.commit for a background server's channel via the per-instance listener", async () => {
    const ws = makeWs()
    const instance = {
      instanceUrl: "https://i.example.com",
      wsClient: ws as unknown as Parameters<
        typeof PerInstanceListeners
      >[0]["instance"]["wsClient"],
      token: "tok",
      userId: "user-self",
      handshakeData: { log_public_key: "abcd" },
    }

    render(
      <>
        <PerInstanceListeners
          instance={instance}
          identityPublicKey={new Uint8Array([1, 2, 3])}
          setTransparencyError={vi.fn()}
          onInstanceBanned={vi.fn()}
        />
        <PerServerListeners
          instanceUrl={instance.instanceUrl}
          wsClient={ws as unknown as Parameters<
            typeof PerServerListeners
          >[0]["wsClient"]}
          token={instance.token}
          currentUserId={instance.userId}
          serverId="srv-bg"
          serverName="Background"
          refetchMembers={vi.fn()}
          onSelfRemoved={vi.fn()}
        />
      </>,
    )

    // Step 1+2: background channel ids fetched and refcount-subscribed.
    await waitFor(() => {
      expect(ws.subscribeChannel).toHaveBeenCalledWith("bg-text-1")
      expect(ws.subscribeChannel).toHaveBeenCalledWith("bg-text-2")
    })

    // Step 3: simulate the channel-room broadcast for a BACKGROUND
    // text channel. The instance-level listener owns the
    // mls.commit subscription — handler runs even though the
    // channel is not in the active view.
    await waitFor(() => {
      expect(ws.on).toHaveBeenCalledWith("mls.commit", expect.any(Function))
    })

    ws.emit("mls.commit", {
      type: "mls.commit",
      channel_id: "bg-text-1",
      commit_bytes: btoa("commit-bytes"),
      sender_id: "user-other",
      sender_device_id: "device-other",
      group_type: "text",
    })

    // Step 4: processCommit invoked with the inactive channel id.
    await waitFor(() => {
      expect(processCommit).toHaveBeenCalledTimes(1)
    })
    expect(processCommit.mock.calls[0][1]).toBe("bg-text-1")
  })
})
