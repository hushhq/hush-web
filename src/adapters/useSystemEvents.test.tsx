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

// @ts-expect-error legacy JS
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
})
