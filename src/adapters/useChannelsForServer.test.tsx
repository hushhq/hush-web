/**
 * Verifies useChannelsForServer splits the backend payload into
 * { categories, channels } by `type === 'category'`, sorts by position,
 * and emits api.moveChannel for reorder via onChannelsChange.
 */
import { describe, it, expect, vi, beforeEach } from "vitest"
import { act, renderHook, waitFor } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import type { ReactNode } from "react"

vi.mock("@/lib/api", () => ({
  getGuildChannels: vi.fn(),
  moveChannel: vi.fn(),
}))

import { getGuildChannels as _getGuildChannels, moveChannel as _moveChannel } from "@/lib/api"
import {
  channelsForServerQueryKey,
  useChannelsForServer,
} from "./useChannelsForServer"

const getGuildChannels = vi.mocked(_getGuildChannels as () => Promise<unknown>)
const moveChannel = vi.mocked(_moveChannel as () => Promise<unknown>)

const ARGS = {
  serverId: "g1",
  token: "tok",
  baseUrl: "https://a.example.com",
  currentUserId: "u-self",
}

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

function renderChannelsHook(args: Parameters<typeof useChannelsForServer>[0]) {
  return renderHook(() => useChannelsForServer(args), {
    wrapper: createWrapper(),
  })
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

    const { result } = renderChannelsHook(ARGS)

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

    const { result } = renderChannelsHook(ARGS)

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

    const { result } = renderChannelsHook(ARGS)

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

    const { result } = renderChannelsHook(ARGS)

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

    const { result } = renderChannelsHook(ARGS)

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
    const { result } = renderChannelsHook({ ...ARGS, serverId: null })

    await waitFor(() => {
      expect(result.current.channels).toEqual([])
    })
    expect(getGuildChannels).not.toHaveBeenCalled()
  })

  it("exposes a stable query key for channel cache invalidation", () => {
    expect(
      channelsForServerQueryKey({
        serverId: "g1",
        baseUrl: "https://a.example.com",
        currentUserId: "u-self",
      })
    ).toEqual([
      "servers",
      "https://a.example.com",
      "g1",
      "channels",
      "u-self",
    ])
  })

  it("captures fetch errors", async () => {
    getGuildChannels.mockRejectedValue(new Error("boom"))

    const { result } = renderChannelsHook(ARGS)

    await waitFor(() => {
      expect(result.current.error).not.toBeNull()
    })
  })

  // Server-room subscription ownership lives in `useInstances` (P1).
  // The adapter must NOT send `subscribe.server` / `unsubscribe.server`
  // on mount, on `open`, or on cleanup. Without this contract the
  // adapter's cleanup-on-server-switch silently unsubscribes a room
  // that the instance hook still considers active, which drops every
  // background-server broadcast (channel_*, member_*) for the rest
  // of the session.
  it("never sends subscribe.server or unsubscribe.server", async () => {
    getGuildChannels.mockResolvedValue([
      { id: "ch-1", name: "general", type: "text", parentId: null, position: 0 },
    ])

    const send = vi.fn()
    const wsClient = {
      isConnected: () => true,
      send,
      on: vi.fn(),
      off: vi.fn(),
    }

    const { unmount, rerender } = renderHook(
      (args: typeof ARGS) =>
        useChannelsForServer({ ...args, wsClient } as Parameters<
          typeof useChannelsForServer
        >[0]),
      { initialProps: ARGS, wrapper: createWrapper() },
    )

    await waitFor(() => {
      expect(getGuildChannels).toHaveBeenCalled()
    })

    rerender({ ...ARGS, serverId: "g2" })
    unmount()

    const sentTypes = send.mock.calls.map((c) => c[0])
    expect(sentTypes).not.toContain("subscribe.server")
    expect(sentTypes).not.toContain("unsubscribe.server")
  })

  // ──────────────────────────────────────────────────────────────────
  // Cross-server scoping for channel_* websocket events.
  // `useInstances` may subscribe every guild on the same instance,
  // so the active server's wsClient can receive broadcasts that
  // belong to a different server. Those events must not mutate the
  // active channel list. Legacy payloads without `server_id` keep
  // the previous behavior.
  // ──────────────────────────────────────────────────────────────────
  function makeWsClient() {
    const handlers = new Map<string, (msg: unknown) => void>()
    return {
      isConnected: () => true,
      send: vi.fn(),
      on: vi.fn((event: string, handler: (msg: unknown) => void) => {
        handlers.set(event, handler)
      }),
      off: vi.fn((event: string) => {
        handlers.delete(event)
      }),
      emit: (event: string, msg: unknown) => handlers.get(event)?.(msg),
    }
  }

  it("ignores foreign channel_created (top-level server_id mismatch)", async () => {
    getGuildChannels.mockResolvedValue([
      { id: "ch-active", name: "general", type: "text", parentId: null, position: 0 },
    ])
    const ws = makeWsClient()
    const { result } = renderChannelsHook({ ...ARGS, wsClient: ws })
    await waitFor(() => expect(result.current.channels).toHaveLength(1))

    act(() => {
      ws.emit("channel_created", {
        type: "channel_created",
        server_id: "g-other",
        channel: {
          id: "ch-foreign",
          name: "alien",
          type: "text",
          parentId: null,
          position: 1,
        },
      })
    })

    expect(result.current.channels.map((c) => c.id)).toEqual(["ch-active"])
  })

  it("ignores foreign channel_created (channel.server_id mismatch)", async () => {
    getGuildChannels.mockResolvedValue([
      { id: "ch-active", name: "general", type: "text", parentId: null, position: 0 },
    ])
    const ws = makeWsClient()
    const { result } = renderChannelsHook({ ...ARGS, wsClient: ws })
    await waitFor(() => expect(result.current.channels).toHaveLength(1))

    act(() => {
      ws.emit("channel_created", {
        type: "channel_created",
        // No top-level server_id; scope on channel.server_id only.
        channel: {
          id: "ch-foreign",
          name: "alien",
          type: "text",
          parentId: null,
          position: 1,
          server_id: "g-other",
        },
      })
    })

    expect(result.current.channels.map((c) => c.id)).toEqual(["ch-active"])
  })

  it("ignores channel_created when top-level and channel server scopes disagree", async () => {
    getGuildChannels.mockResolvedValue([
      { id: "ch-active", name: "general", type: "text", parentId: null, position: 0 },
    ])
    const ws = makeWsClient()
    const { result } = renderChannelsHook({ ...ARGS, wsClient: ws })
    await waitFor(() => expect(result.current.channels).toHaveLength(1))

    act(() => {
      ws.emit("channel_created", {
        type: "channel_created",
        server_id: "g1",
        channel: {
          id: "ch-confused",
          name: "confused",
          type: "text",
          parentId: null,
          position: 1,
          server_id: "g-other",
        },
      })
    })

    expect(result.current.channels.map((c) => c.id)).toEqual(["ch-active"])
  })

  it("ignores foreign channel_deleted (server_id mismatch)", async () => {
    getGuildChannels.mockResolvedValue([
      { id: "ch-active", name: "general", type: "text", parentId: null, position: 0 },
    ])
    const ws = makeWsClient()
    const { result } = renderChannelsHook({ ...ARGS, wsClient: ws })
    await waitFor(() => expect(result.current.channels).toHaveLength(1))

    // Foreign delete that targets the same channel id by accident:
    // it must not be applied because the event is for a different server.
    act(() => {
      ws.emit("channel_deleted", {
        type: "channel_deleted",
        server_id: "g-other",
        channel_id: "ch-active",
      })
    })

    expect(result.current.channels.map((c) => c.id)).toEqual(["ch-active"])
  })

  it("ignores foreign channel_moved (server_id mismatch)", async () => {
    getGuildChannels.mockResolvedValue([
      { id: "ch-active", name: "general", type: "text", parentId: "cat-a", position: 0 },
    ])
    const ws = makeWsClient()
    const { result } = renderChannelsHook({ ...ARGS, wsClient: ws })
    await waitFor(() => expect(result.current.channels).toHaveLength(1))

    act(() => {
      ws.emit("channel_moved", {
        type: "channel_moved",
        server_id: "g-other",
        channel_id: "ch-active",
        parent_id: "cat-z",
        position: 99,
      })
    })

    expect(result.current.channels[0].categoryId).toBe("cat-a")
  })

  it("applies channel_created when server_id matches the active server", async () => {
    getGuildChannels.mockResolvedValue([
      { id: "ch-active", name: "general", type: "text", parentId: null, position: 0 },
    ])
    const ws = makeWsClient()
    const { result } = renderChannelsHook({ ...ARGS, wsClient: ws })
    await waitFor(() => expect(result.current.channels).toHaveLength(1))

    act(() => {
      ws.emit("channel_created", {
        type: "channel_created",
        server_id: "g1",
        channel: {
          id: "ch-new",
          name: "new",
          type: "text",
          parentId: null,
          position: 1,
        },
      })
    })

    await waitFor(() => {
      expect(result.current.channels.map((c) => c.id)).toEqual([
        "ch-active",
        "ch-new",
      ])
    })
  })

  it("preserves legacy channel_created without server_id (backward compatibility)", async () => {
    getGuildChannels.mockResolvedValue([
      { id: "ch-active", name: "general", type: "text", parentId: null, position: 0 },
    ])
    const ws = makeWsClient()
    const { result } = renderChannelsHook({ ...ARGS, wsClient: ws })
    await waitFor(() => expect(result.current.channels).toHaveLength(1))

    act(() => {
      ws.emit("channel_created", {
        type: "channel_created",
        // No server_id anywhere — legacy payload, must still apply.
        channel: {
          id: "ch-legacy",
          name: "legacy",
          type: "text",
          parentId: null,
          position: 2,
        },
      })
    })

    await waitFor(() => {
      expect(result.current.channels.map((c) => c.id)).toEqual([
        "ch-active",
        "ch-legacy",
      ])
    })
  })
})
