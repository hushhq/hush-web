import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { renderHook, act } from "@testing-library/react"

import { useServerJoinEvents } from "./useServerJoinEvents"

function buildWs() {
  const handlers = new Map<string, Set<(d: unknown) => void>>()
  return {
    on: vi.fn((event: string, handler: (d: unknown) => void) => {
      if (!handlers.has(event)) handlers.set(event, new Set())
      handlers.get(event)!.add(handler)
    }),
    off: vi.fn((event: string, handler: (d: unknown) => void) => {
      handlers.get(event)?.delete(handler)
    }),
    emit(event: string, payload: unknown) {
      handlers.get(event)?.forEach((fn) => fn(payload))
    },
  }
}

describe("useServerJoinEvents", () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it("MemberJoinedForActiveServer_TriggersRefetchOnce", async () => {
    const ws = buildWs()
    const refetch = vi.fn().mockResolvedValue(undefined)
    renderHook(() =>
      useServerJoinEvents({
        wsClient: ws,
        serverId: "g1",
        refetchMembers: refetch,
        debounceMs: 50,
      }),
    )
    act(() => {
      ws.emit("member_joined", { type: "member_joined", server_id: "g1" })
    })
    expect(refetch).not.toHaveBeenCalled()
    await act(async () => {
      vi.advanceTimersByTime(60)
      await Promise.resolve()
    })
    expect(refetch).toHaveBeenCalledTimes(1)
  })

  it("CoalescesBurstsWithinDebounceWindow", async () => {
    const ws = buildWs()
    const refetch = vi.fn().mockResolvedValue(undefined)
    renderHook(() =>
      useServerJoinEvents({
        wsClient: ws,
        serverId: "g1",
        refetchMembers: refetch,
        debounceMs: 50,
      }),
    )
    act(() => {
      ws.emit("member_joined", { type: "member_joined", server_id: "g1" })
      ws.emit("member_joined", { type: "member_joined", server_id: "g1" })
      ws.emit("member_joined", { type: "member_joined", server_id: "g1" })
    })
    await act(async () => {
      vi.advanceTimersByTime(60)
      await Promise.resolve()
    })
    expect(refetch).toHaveBeenCalledTimes(1)
  })

  it("IgnoresJoinEventsForOtherServers", async () => {
    const ws = buildWs()
    const refetch = vi.fn().mockResolvedValue(undefined)
    renderHook(() =>
      useServerJoinEvents({
        wsClient: ws,
        serverId: "g1",
        refetchMembers: refetch,
        debounceMs: 10,
      }),
    )
    act(() => {
      ws.emit("member_joined", { type: "member_joined", server_id: "OTHER" })
    })
    await act(async () => {
      vi.advanceTimersByTime(20)
      await Promise.resolve()
    })
    expect(refetch).not.toHaveBeenCalled()
  })

  it("IgnoresWrongTypeOnMemberJoinedChannel", async () => {
    const ws = buildWs()
    const refetch = vi.fn().mockResolvedValue(undefined)
    renderHook(() =>
      useServerJoinEvents({
        wsClient: ws,
        serverId: "g1",
        refetchMembers: refetch,
        debounceMs: 10,
      }),
    )
    act(() => {
      ws.emit("member_joined", { type: "noise", server_id: "g1" })
    })
    await act(async () => {
      vi.advanceTimersByTime(20)
      await Promise.resolve()
    })
    expect(refetch).not.toHaveBeenCalled()
  })

  it("UnmountClearsPendingTimerAndRemovesListener", async () => {
    const ws = buildWs()
    const refetch = vi.fn().mockResolvedValue(undefined)
    const { unmount } = renderHook(() =>
      useServerJoinEvents({
        wsClient: ws,
        serverId: "g1",
        refetchMembers: refetch,
        debounceMs: 50,
      }),
    )
    act(() => {
      ws.emit("member_joined", { type: "member_joined", server_id: "g1" })
    })
    unmount()
    await act(async () => {
      vi.advanceTimersByTime(100)
      await Promise.resolve()
    })
    expect(refetch).not.toHaveBeenCalled()
    expect(ws.off).toHaveBeenCalledWith("member_joined", expect.any(Function))
  })
})
