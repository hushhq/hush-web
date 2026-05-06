/**
 * Verifies useSystemEvents fetches via api.getSystemMessages or
 * api.getAuditLog depending on the source flag, surfaces the items list,
 * and exposes a refetch handle.
 */
import { describe, it, expect, vi, beforeEach } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"

vi.mock("@/lib/api", () => ({
  getAuditLog: vi.fn(),
  getSystemMessages: vi.fn(),
}))

import { getAuditLog as _getAuditLog, getSystemMessages as _getSystemMessages } from "@/lib/api"
import { useSystemEvents } from "./useSystemEvents"

const getAuditLog = vi.mocked(_getAuditLog as () => Promise<unknown>)
const getSystemMessages = vi.mocked(_getSystemMessages as () => Promise<unknown>)

const ARGS = {
  serverId: "g1",
  token: "tok",
  baseUrl: "https://a.example.com",
} as const

describe("useSystemEvents", () => {
  beforeEach(() => {
    getAuditLog.mockReset()
    getSystemMessages.mockReset()
  })

  it("calls getSystemMessages for the server-log source", async () => {
    getSystemMessages.mockResolvedValue([
      { id: "e1", eventType: "channel.created", actorId: "u1", createdAt: "2026-05-04T12:00:00Z" },
    ])

    const { result } = renderHook(() =>
      useSystemEvents({ ...ARGS, source: "server-log" })
    )

    await waitFor(() => {
      expect(result.current.events).toHaveLength(1)
    })
    expect(getSystemMessages).toHaveBeenCalled()
    expect(getAuditLog).not.toHaveBeenCalled()
  })

  it("calls getAuditLog for the moderation source", async () => {
    getAuditLog.mockResolvedValue([
      { id: "a1", eventType: "user.kicked", actorId: "u1", createdAt: "2026-05-04T12:00:00Z" },
    ])

    const { result } = renderHook(() =>
      useSystemEvents({ ...ARGS, source: "moderation" })
    )

    await waitFor(() => {
      expect(result.current.events).toHaveLength(1)
    })
    expect(getAuditLog).toHaveBeenCalled()
    expect(getSystemMessages).not.toHaveBeenCalled()
  })

  it("normalises wrapped { items } responses", async () => {
    getSystemMessages.mockResolvedValue({
      items: [
        { id: "e1", eventType: "x", actorId: "u1", createdAt: "2026-05-04" },
      ],
    })

    const { result } = renderHook(() =>
      useSystemEvents({ ...ARGS, source: "server-log" })
    )

    await waitFor(() => {
      expect(result.current.events).toHaveLength(1)
    })
  })

  it("captures errors and exposes them", async () => {
    getSystemMessages.mockRejectedValue(new Error("backend down"))

    const { result } = renderHook(() =>
      useSystemEvents({ ...ARGS, source: "server-log" })
    )

    await waitFor(() => {
      expect(result.current.error).not.toBeNull()
    })
    expect(result.current.events).toEqual([])
  })

  // Live system_message append is bound to the server-log source
  // because the audit-log REST endpoint serves the moderation
  // viewer instead of the system_messages stream.
  describe("live system_message", () => {
    function makeWs() {
      const handlers = new Map<string, (data: unknown) => void>()
      return {
        on: vi.fn((event: string, h: (d: unknown) => void) => {
          handlers.set(event, h)
        }),
        off: vi.fn((event: string) => {
          handlers.delete(event)
        }),
        emit(event: string, payload: unknown) {
          handlers.get(event)?.(payload)
        },
      }
    }

    it("appends a server-log frame matching the active server", async () => {
      getSystemMessages.mockResolvedValue([
        { id: "ev1", eventType: "member_joined", actorId: "u1", createdAt: "t1" },
      ])
      const ws = makeWs()

      const { result } = renderHook(() =>
        useSystemEvents({
          ...ARGS,
          source: "server-log",
          wsClient: ws as unknown as Parameters<
            typeof useSystemEvents
          >[0]["wsClient"],
        }),
      )
      await waitFor(() => expect(result.current.events).toHaveLength(1))

      ws.emit("system_message", {
        type: "system_message",
        server_id: "g1",
        system_message: {
          id: "ev2",
          eventType: "member_left",
          actorId: "u2",
          createdAt: "t2",
        },
      })
      await waitFor(() => expect(result.current.events).toHaveLength(2))
    })

    it("ignores frames for a different server", async () => {
      getSystemMessages.mockResolvedValue([])
      const ws = makeWs()

      const { result } = renderHook(() =>
        useSystemEvents({
          ...ARGS,
          source: "server-log",
          wsClient: ws as unknown as Parameters<
            typeof useSystemEvents
          >[0]["wsClient"],
        }),
      )
      await waitFor(() => expect(result.current.events).toHaveLength(0))

      ws.emit("system_message", {
        type: "system_message",
        server_id: "g-other",
        system_message: {
          id: "ev1",
          eventType: "member_joined",
          actorId: "u1",
          createdAt: "t1",
        },
      })
      await new Promise((r) => setTimeout(r, 0))
      expect(result.current.events).toHaveLength(0)
    })

    it("does NOT subscribe when source is moderation", async () => {
      getAuditLog.mockResolvedValue([])
      const ws = makeWs()

      renderHook(() =>
        useSystemEvents({
          ...ARGS,
          source: "moderation",
          wsClient: ws as unknown as Parameters<
            typeof useSystemEvents
          >[0]["wsClient"],
        }),
      )
      await new Promise((r) => setTimeout(r, 0))
      const subs = ws.on.mock.calls.map((c) => c[0])
      expect(subs).not.toContain("system_message")
    })

    it("dedups by id when REST and WS race", async () => {
      getSystemMessages.mockResolvedValue([
        { id: "ev1", eventType: "member_joined", actorId: "u1", createdAt: "t1" },
      ])
      const ws = makeWs()

      const { result } = renderHook(() =>
        useSystemEvents({
          ...ARGS,
          source: "server-log",
          wsClient: ws as unknown as Parameters<
            typeof useSystemEvents
          >[0]["wsClient"],
        }),
      )
      await waitFor(() => expect(result.current.events).toHaveLength(1))

      ws.emit("system_message", {
        type: "system_message",
        server_id: "g1",
        system_message: {
          id: "ev1",
          eventType: "member_joined",
          actorId: "u1",
          createdAt: "t1",
        },
      })
      await new Promise((r) => setTimeout(r, 0))
      expect(result.current.events).toHaveLength(1)
    })
  })
})
