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
      { id: "sys-1", name: "server-log", type: "system", parentId: null, position: 0 },
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
    expect(result.current.channels.some((c) => c.id === "sys-1")).toBe(false)
    expect(result.current.channels[0]).toMatchObject({
      kind: "text",
      categoryId: "cat-1",
    })
    expect(result.current.systemChannels).toEqual([
      { id: "sys-1", name: "server-log", systemChannelType: "server-log" },
    ])
  })

  it("derives the system channel type from name when not explicit", async () => {
    getGuildChannels.mockResolvedValue([
      { id: "sys-mod", name: "moderation", type: "system", parentId: null, position: 1 },
      { id: "sys-log", name: "server-log", type: "system", parentId: null, position: 0 },
    ])

    const { result } = renderHook(() => useChannelsForServer(ARGS))

    await waitFor(() => {
      expect(result.current.systemChannels).toHaveLength(2)
    })
    expect(result.current.systemChannels.map((c) => c.systemChannelType)).toEqual([
      "server-log",
      "moderation",
    ])
  })

  it("respects an explicit systemChannelType field on the payload", async () => {
    getGuildChannels.mockResolvedValue([
      {
        id: "sys-1",
        name: "Audit feed",
        type: "system",
        systemChannelType: "moderation",
        parentId: null,
        position: 0,
      },
    ])

    const { result } = renderHook(() => useChannelsForServer(ARGS))

    await waitFor(() => {
      expect(result.current.systemChannels).toHaveLength(1)
    })
    expect(result.current.systemChannels[0]).toMatchObject({
      id: "sys-1",
      name: "Audit feed",
      systemChannelType: "moderation",
    })
  })

  it("decodes plaintext metadata names when the API omits name", async () => {
    getGuildChannels.mockResolvedValue([
      {
        id: "cat-1",
        encryptedMetadata: btoa(JSON.stringify({ n: "Text cat" })),
        type: "category",
        parentId: null,
        position: 0,
      },
      {
        id: "ch-1",
        encryptedMetadata: btoa(JSON.stringify({ n: "general" })),
        type: "text",
        parentId: "cat-1",
        position: 0,
      },
    ])

    const { result } = renderHook(() => useChannelsForServer(ARGS))

    await waitFor(() => {
      expect(result.current.channels).toHaveLength(1)
    })
    expect(result.current.categories[0]?.name).toBe("Text cat")
    expect(result.current.channels[0]?.name).toBe("general")
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
