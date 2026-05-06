import { describe, it, expect, vi, afterEach } from "vitest"
import { act, renderHook } from "@testing-library/react"

import { useOnlinePresence } from "./useOnlinePresence"

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

describe("useOnlinePresence", () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it("starts with an empty set when no presence frame has arrived", () => {
    const ws = makeWs()
    const { result } = renderHook(() =>
      useOnlinePresence(ws as unknown as Parameters<typeof useOnlinePresence>[0]),
    )
    expect(result.current.size).toBe(0)
  })

  it("replaces the set on every presence.update frame", () => {
    const ws = makeWs()
    const { result } = renderHook(() =>
      useOnlinePresence(ws as unknown as Parameters<typeof useOnlinePresence>[0]),
    )

    act(() => {
      ws.emit("presence.update", {
        type: "presence.update",
        user_ids: ["a", "b"],
      })
    })
    expect(Array.from(result.current).sort()).toEqual(["a", "b"])

    act(() => {
      ws.emit("presence.update", {
        type: "presence.update",
        user_ids: ["a"],
      })
    })
    expect(Array.from(result.current)).toEqual(["a"])
  })

  it("ignores frames whose type is not presence.update", () => {
    const ws = makeWs()
    const { result } = renderHook(() =>
      useOnlinePresence(ws as unknown as Parameters<typeof useOnlinePresence>[0]),
    )

    act(() => {
      ws.emit("presence.update", { type: "ping", user_ids: ["a"] })
    })
    expect(result.current.size).toBe(0)
  })

  it("treats a missing user_ids array as empty", () => {
    const ws = makeWs()
    const { result } = renderHook(() =>
      useOnlinePresence(ws as unknown as Parameters<typeof useOnlinePresence>[0]),
    )

    act(() => {
      ws.emit("presence.update", { type: "presence.update" })
    })
    expect(result.current.size).toBe(0)
  })

  it("unsubscribes on unmount", () => {
    const ws = makeWs()
    const { unmount } = renderHook(() =>
      useOnlinePresence(ws as unknown as Parameters<typeof useOnlinePresence>[0]),
    )
    unmount()
    expect(ws.off).toHaveBeenCalledWith("presence.update", expect.any(Function))
  })
})
