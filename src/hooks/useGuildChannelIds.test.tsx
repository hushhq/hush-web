import { describe, it, expect, vi, afterEach } from "vitest"
import { renderHook, waitFor, act } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import type { ReactNode } from "react"

vi.mock("@/lib/api", () => ({
  getGuildChannels: vi.fn(),
}))

import { getGuildChannels as _getGuildChannels } from "@/lib/api"
import {
  guildChannelIdsQueryKey,
  useGuildChannelIds,
} from "./useGuildChannelIds"

const getGuildChannels = vi.mocked(_getGuildChannels as () => Promise<unknown>)

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

describe("useGuildChannelIds", () => {
  afterEach(() => {
    getGuildChannels.mockReset()
    vi.useRealTimers()
  })

  it("returns the text channel ids and flips loaded=true on success", async () => {
    getGuildChannels.mockResolvedValueOnce([
      { id: "ch-1", type: "text" },
      { id: "ch-2", type: "voice" },
      { id: "ch-3", type: "text" },
    ])

    const { result } = renderHook(
      () =>
        useGuildChannelIds({
          serverId: "srv-1",
          token: "tok",
          baseUrl: "https://i.example.com",
          currentUserId: "user-1",
        }),
      { wrapper: createWrapper() },
    )

    await waitFor(() => expect(result.current.loaded).toBe(true))
    expect(result.current.textChannelIds).toEqual(["ch-1", "ch-3"])
  })

  // Robustness gap from the second review pass: a transient fetch
  // failure for a background guild used to leave the channel-id
  // list permanently empty, silently disabling MLS room
  // subscriptions for that server until a remount.
  it("retries with exponential backoff on a transient fetch failure", async () => {
    vi.useFakeTimers()
    getGuildChannels
      .mockRejectedValueOnce(new Error("network blip"))
      .mockResolvedValueOnce([{ id: "ch-1", type: "text" }])

    const { result } = renderHook(
      () =>
        useGuildChannelIds({
          serverId: "srv-1",
          token: "tok",
          baseUrl: "https://i.example.com",
          currentUserId: "user-1",
        }),
      { wrapper: createWrapper() },
    )

    // First attempt has failed; loaded is still false.
    await act(async () => {
      await vi.advanceTimersByTimeAsync(0)
    })
    expect(getGuildChannels).toHaveBeenCalledTimes(1)
    expect(result.current.loaded).toBe(false)

    // Advance the first backoff slot (1s) — second attempt fires.
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1_000)
    })

    await vi.waitFor(() =>
      expect(getGuildChannels).toHaveBeenCalledTimes(2),
    )
    await vi.waitFor(() => expect(result.current.loaded).toBe(true))
    expect(result.current.textChannelIds).toEqual(["ch-1"])
  })

  it("stops scheduling retries after the backoff schedule is exhausted", async () => {
    vi.useFakeTimers()
    getGuildChannels.mockRejectedValue(new Error("persistent"))

    renderHook(
      () =>
        useGuildChannelIds({
          serverId: "srv-1",
          token: "tok",
          baseUrl: "https://i.example.com",
          currentUserId: "user-1",
        }),
      { wrapper: createWrapper() },
    )

    // Schedule has 6 slots — initial call + 6 retries = 7 attempts.
    await vi.waitFor(() => expect(getGuildChannels).toHaveBeenCalledTimes(1))
    // Advance well past the cumulative schedule (1+2+4+8+16+30 = 61s).
    await act(async () => {
      await vi.advanceTimersByTimeAsync(120_000)
    })
    expect(getGuildChannels).toHaveBeenCalledTimes(7)

    // Further advances must NOT schedule another attempt.
    await act(async () => {
      await vi.advanceTimersByTimeAsync(120_000)
    })
    expect(getGuildChannels).toHaveBeenCalledTimes(7)
  })

  it("uses the documented retry schedule in order", async () => {
    vi.useFakeTimers()
    vi.setSystemTime(0)
    const callTimes: number[] = []
    getGuildChannels.mockImplementation(async () => {
      callTimes.push(Date.now())
      throw new Error("persistent")
    })

    renderHook(
      () =>
        useGuildChannelIds({
          serverId: "srv-1",
          token: "tok",
          baseUrl: "https://i.example.com",
          currentUserId: "user-1",
        }),
      { wrapper: createWrapper() },
    )

    await vi.waitFor(() => expect(getGuildChannels).toHaveBeenCalledTimes(1))

    await act(async () => {
      await vi.advanceTimersByTimeAsync(61_000)
    })

    expect(getGuildChannels).toHaveBeenCalledTimes(7)
    const retryDeltas = callTimes.slice(1).map((time, index) => time - callTimes[index])
    expect(retryDeltas[0]).toBeGreaterThanOrEqual(1_000)
    expect(retryDeltas[0]).toBeLessThanOrEqual(1_050)
    expect(retryDeltas.slice(1)).toEqual([2_000, 4_000, 8_000, 16_000, 30_000])
  })

  it("clears state and stops fetching when serverId or token go null", async () => {
    getGuildChannels.mockResolvedValue([{ id: "ch-1", type: "text" }])

    type Args = Parameters<typeof useGuildChannelIds>[0]
    const { result, rerender } = renderHook(
      (args: Args) => useGuildChannelIds(args),
      {
        initialProps: {
          serverId: "srv-1" as string | null,
          token: "tok" as string | null,
          baseUrl: "https://i.example.com",
          currentUserId: "user-1",
        } satisfies Args,
        wrapper: createWrapper(),
      },
    )

    await waitFor(() => expect(result.current.loaded).toBe(true))

    rerender({
      serverId: null,
      token: "tok",
      baseUrl: "https://i.example.com",
      currentUserId: "user-1",
    } satisfies Args)
    expect(result.current.textChannelIds).toEqual([])
    expect(result.current.loaded).toBe(false)
  })

  it("exposes a stable query key for text channel id cache invalidation", () => {
    expect(
      guildChannelIdsQueryKey({
        serverId: "srv-1",
        baseUrl: "https://i.example.com",
        currentUserId: "user-1",
      })
    ).toEqual([
      "servers",
      "https://i.example.com",
      "srv-1",
      "text-channel-ids",
      "user-1",
    ])
  })

  it("keeps text channel id caches separated by user", () => {
    expect(
      guildChannelIdsQueryKey({
        serverId: "srv-1",
        baseUrl: "https://i.example.com",
        currentUserId: "user-1",
      })
    ).not.toEqual(
      guildChannelIdsQueryKey({
        serverId: "srv-1",
        baseUrl: "https://i.example.com",
        currentUserId: "user-2",
      })
    )
  })
})
