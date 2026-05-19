import { describe, expect, it, vi, beforeEach } from "vitest"
import { act, renderHook, waitFor } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import type { ReactNode } from "react"

vi.mock("@/lib/api", () => ({
  listDeviceKeys: vi.fn(),
  revokeDeviceKey: vi.fn(),
}))

import { listDeviceKeys, revokeDeviceKey } from "@/lib/api"
import {
  deviceKeysQueryKey,
  useDeviceKeys,
  useRevokeDeviceKey,
} from "./useDeviceKeys"

const listDeviceKeysMock = vi.mocked(listDeviceKeys)
const revokeDeviceKeyMock = vi.mocked(revokeDeviceKey)

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })
}

function createWrapper(queryClient: QueryClient) {
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe("useDeviceKeys", () => {
  beforeEach(() => {
    listDeviceKeysMock.mockReset()
    revokeDeviceKeyMock.mockReset()
  })

  it("uses the exported device query key shape", () => {
    expect(deviceKeysQueryKey("https://home.example.com", "user-1")).toEqual([
      "auth",
      "devices",
      "https://home.example.com",
      "user-1",
    ])
    expect(deviceKeysQueryKey(null, null)).toEqual([
      "auth",
      "devices",
      "local",
      "anonymous",
    ])
  })

  it("does not fetch when the home-instance token is absent", () => {
    const queryClient = createQueryClient()
    const { result } = renderHook(
      () =>
        useDeviceKeys({
          homeInstanceToken: null,
          homeInstanceUrl: "https://home.example.com",
          userId: "user-1",
        }),
      { wrapper: createWrapper(queryClient) }
    )

    expect(result.current.isLoading).toBe(false)
    expect(result.current.devices).toEqual([])
    expect(listDeviceKeysMock).not.toHaveBeenCalled()
  })

  it("refreshDevices invalidates the matching query when authenticated", async () => {
    listDeviceKeysMock.mockResolvedValue([])
    const queryClient = createQueryClient()
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries")

    const { result } = renderHook(
      () =>
        useDeviceKeys({
          homeInstanceToken: "tok",
          homeInstanceUrl: "https://home.example.com",
          userId: "user-1",
        }),
      { wrapper: createWrapper(queryClient) }
    )

    await waitFor(() =>
      expect(listDeviceKeysMock).toHaveBeenCalledWith(
        "tok",
        "https://home.example.com"
      )
    )

    await act(async () => {
      await result.current.refreshDevices()
    })

    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: deviceKeysQueryKey("https://home.example.com", "user-1"),
    })
  })

  it("refreshDevices is a no-op when the query is disabled", async () => {
    const queryClient = createQueryClient()
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries")

    const { result } = renderHook(
      () =>
        useDeviceKeys({
          homeInstanceToken: null,
          homeInstanceUrl: "https://home.example.com",
          userId: "user-1",
        }),
      { wrapper: createWrapper(queryClient) }
    )

    await act(async () => {
      await result.current.refreshDevices()
    })

    expect(invalidateSpy).not.toHaveBeenCalled()
    expect(listDeviceKeysMock).not.toHaveBeenCalled()
  })

  it("successful revoke invalidates the matching query without awaiting refetch", async () => {
    revokeDeviceKeyMock.mockResolvedValue(undefined)
    const queryClient = createQueryClient()
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries")

    const { result } = renderHook(
      () =>
        useRevokeDeviceKey({
          homeInstanceToken: "tok",
          homeInstanceUrl: "https://home.example.com",
          userId: "user-1",
        }),
      { wrapper: createWrapper(queryClient) }
    )

    await act(async () => {
      await result.current.mutateAsync({ deviceId: "device-1" })
    })

    expect(revokeDeviceKeyMock).toHaveBeenCalledWith(
      "tok",
      "device-1",
      "https://home.example.com"
    )
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: deviceKeysQueryKey("https://home.example.com", "user-1"),
    })
  })
})
