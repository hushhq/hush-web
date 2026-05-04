/**
 * Verifies useChannelsForServer splits the backend payload into
 * { categories, channels } by `type === 'category'`, sorts by position,
 * and emits api.moveChannel for reorder via onChannelsChange.
 */
import { describe, it, expect, vi, beforeEach } from "vitest"
import { act, renderHook, waitFor } from "@testing-library/react"

vi.mock("@/lib/api", () => ({
  getGuildChannels: vi.fn(),
  moveChannel: vi.fn(),
}))

// @ts-expect-error legacy JS
import { getGuildChannels as _getGuildChannels, moveChannel as _moveChannel } from "@/lib/api"
import { useChannelsForServer } from "./useChannelsForServer"

const getGuildChannels = vi.mocked(_getGuildChannels as () => Promise<unknown>)
const moveChannel = vi.mocked(_moveChannel as () => Promise<unknown>)

const ARGS = {
  serverId: "g1",
  token: "tok",
  baseUrl: "https://a.example.com",
}

describe("useChannelsForServer", () => {
  beforeEach(() => {
    getGuildChannels.mockReset()
    moveChannel.mockReset()
  })

  it("splits categories and channels and sorts by position", async () => {
    getGuildChannels.mockResolvedValue([
      { id: "cat-2", name: "Voice cat", type: "category", parentId: null, position: 1 },
      { id: "cat-1", name: "Text cat", type: "category", parentId: null, position: 0 },
      { id: "ch-2", name: "general", type: "text", parentId: "cat-1", position: 0 },
      { id: "ch-3", name: "audio", type: "voice", parentId: "cat-2", position: 0 },
      { id: "ch-1", name: "random", type: "text", parentId: "cat-1", position: 1 },
    ])

    const { result } = renderHook(() => useChannelsForServer(ARGS))

    await waitFor(() => {
      expect(result.current.categories).toHaveLength(2)
    })
    expect(result.current.categories.map((c) => c.id)).toEqual(["cat-1", "cat-2"])
    expect(result.current.channels.map((c) => c.id)).toEqual(["ch-2", "ch-3", "ch-1"])
    expect(result.current.channels[0]).toMatchObject({
      kind: "text",
      categoryId: "cat-1",
    })
  })

  it("emits api.moveChannel for each entry on onChannelsChange", async () => {
    getGuildChannels.mockResolvedValue([
      { id: "ch-1", name: "a", type: "text", parentId: null, position: 0 },
      { id: "ch-2", name: "b", type: "text", parentId: null, position: 1 },
    ])
    moveChannel.mockResolvedValue(undefined)

    const { result } = renderHook(() => useChannelsForServer(ARGS))

    await waitFor(() => {
      expect(result.current.channels).toHaveLength(2)
    })

    act(() => {
      result.current.onChannelsChange([
        { id: "ch-2", name: "b", kind: "text", categoryId: null },
        { id: "ch-1", name: "a", kind: "text", categoryId: null },
      ])
    })

    await waitFor(() => {
      expect(moveChannel).toHaveBeenCalledTimes(2)
    })
    expect(moveChannel).toHaveBeenNthCalledWith(
      1,
      "tok",
      "g1",
      "ch-2",
      { parentId: null, position: 0 },
      "https://a.example.com"
    )
  })

  it("returns an empty list when serverId is null", async () => {
    const { result } = renderHook(() =>
      useChannelsForServer({ ...ARGS, serverId: null })
    )

    await waitFor(() => {
      expect(result.current.channels).toEqual([])
    })
    expect(getGuildChannels).not.toHaveBeenCalled()
  })

  it("captures fetch errors", async () => {
    getGuildChannels.mockRejectedValue(new Error("boom"))

    const { result } = renderHook(() => useChannelsForServer(ARGS))

    await waitFor(() => {
      expect(result.current.error).not.toBeNull()
    })
  })
})
