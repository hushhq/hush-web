/**
 * Verifies useServerModerationEvents subscribes to per-server
 * moderation events, refetches members, runs MLS cleanup on
 * self-kick/ban, and ignores cross-server frames.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"

vi.mock("@/lib/mlsGroup", () => ({
  leaveAllChannelGroups: vi.fn().mockResolvedValue(undefined),
}))

vi.mock("@/lib/mlsStore", () => ({
  openStore: vi.fn().mockResolvedValue({ fake: "db" }),
}))

vi.mock("@/hooks/useAuth", () => ({
  getDeviceId: () => "device-self",
}))

import * as mlsGroupMod from "@/lib/mlsGroup"
import { useServerModerationEvents } from "./useServerModerationEvents"

const leaveAllChannelGroups = vi.mocked(mlsGroupMod.leaveAllChannelGroups)

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

type Args = Parameters<typeof useServerModerationEvents>[0]

const BASE_ARGS = {
  serverId: "srv-1",
  currentUserId: "user-self",
  textChannelIds: ["ch-1", "ch-2"] as const,
}

function renderWith(overrides: Partial<Args>) {
  const args = { ...BASE_ARGS, refetchMembers: vi.fn(), ...overrides } as Args
  return {
    args,
    result: renderHook(() => useServerModerationEvents(args)),
  }
}

describe("useServerModerationEvents", () => {
  beforeEach(() => {
    leaveAllChannelGroups.mockReset().mockResolvedValue(undefined)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it("refetches members on member_role_changed", async () => {
    const refetch = vi.fn()
    const ws = makeWs()
    renderWith({ wsClient: ws as unknown as Args["wsClient"], refetchMembers: refetch })

    ws.emit("member_role_changed", {
      type: "member_role_changed",
      server_id: "srv-1",
      user_id: "user-other",
      permission_level: 30,
    })

    await waitFor(() => expect(refetch).toHaveBeenCalledTimes(1))
    expect(leaveAllChannelGroups).not.toHaveBeenCalled()
  })

  it("refetches members on member_muted", async () => {
    const refetch = vi.fn()
    const ws = makeWs()
    renderWith({ wsClient: ws as unknown as Args["wsClient"], refetchMembers: refetch })

    ws.emit("member_muted", {
      type: "member_muted",
      server_id: "srv-1",
      user_id: "user-other",
    })

    await waitFor(() => expect(refetch).toHaveBeenCalledTimes(1))
  })

  it("ignores frames for a different server", async () => {
    const refetch = vi.fn()
    const ws = makeWs()
    renderWith({ wsClient: ws as unknown as Args["wsClient"], refetchMembers: refetch })

    ws.emit("member_kicked", {
      type: "member_kicked",
      server_id: "srv-other",
      user_id: "user-other",
    })

    await new Promise((r) => setTimeout(r, 0))
    expect(refetch).not.toHaveBeenCalled()
    expect(leaveAllChannelGroups).not.toHaveBeenCalled()
  })

  it("on self-kick: cleans up MLS for every text channel and fires onSelfRemoved", async () => {
    const refetch = vi.fn()
    const onSelfRemoved = vi.fn()
    const ws = makeWs()
    renderWith({
      wsClient: ws as unknown as Args["wsClient"],
      refetchMembers: refetch,
      onSelfRemoved,
    })

    ws.emit("member_kicked", {
      type: "member_kicked",
      server_id: "srv-1",
      user_id: "user-self",
      reason: "Spam",
    })

    await waitFor(() => {
      expect(leaveAllChannelGroups).toHaveBeenCalledTimes(1)
    })
    expect(leaveAllChannelGroups.mock.calls[0][1]).toEqual(["ch-1", "ch-2"])
    expect(onSelfRemoved).toHaveBeenCalledWith({
      event: "kick",
      reason: "Spam",
    })
    expect(refetch).toHaveBeenCalled()
  })

  it("on self-ban: routes onSelfRemoved with event=ban", async () => {
    const refetch = vi.fn()
    const onSelfRemoved = vi.fn()
    const ws = makeWs()
    renderWith({
      wsClient: ws as unknown as Args["wsClient"],
      refetchMembers: refetch,
      onSelfRemoved,
    })

    ws.emit("member_banned", {
      type: "member_banned",
      server_id: "srv-1",
      user_id: "user-self",
    })

    await waitFor(() => {
      expect(onSelfRemoved).toHaveBeenCalledWith({
        event: "ban",
        reason: undefined,
      })
    })
    expect(leaveAllChannelGroups).toHaveBeenCalledTimes(1)
  })

  it("does not run MLS cleanup when target is another user", async () => {
    const refetch = vi.fn()
    const ws = makeWs()
    renderWith({ wsClient: ws as unknown as Args["wsClient"], refetchMembers: refetch })

    ws.emit("member_kicked", {
      type: "member_kicked",
      server_id: "srv-1",
      user_id: "user-other",
    })

    await waitFor(() => expect(refetch).toHaveBeenCalled())
    expect(leaveAllChannelGroups).not.toHaveBeenCalled()
  })

  it("unsubscribes every event on unmount", () => {
    const ws = makeWs()
    const { result } = renderWith({
      wsClient: ws as unknown as Args["wsClient"],
      refetchMembers: vi.fn(),
    })

    result.unmount()

    const offCalls = ws.off.mock.calls.map((c) => c[0])
    expect(offCalls).toEqual(
      expect.arrayContaining([
        "member_kicked",
        "member_banned",
        "member_muted",
        "member_role_changed",
      ]),
    )
  })
})
