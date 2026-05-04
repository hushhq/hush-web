/**
 * Verifies useGuilds maps useInstanceContext().mergedGuilds to the
 * prototype Server[] shape: drops guilds without instanceUrl, derives
 * initials, prefers _localName over name, exposes findById.
 */
import { describe, it, expect, vi } from "vitest"
import { renderHook } from "@testing-library/react"

const mockContext = vi.fn()

vi.mock("@/contexts/InstanceContext", () => ({
  useInstanceContext: () => mockContext(),
}))

import { useGuilds } from "./useGuilds"

describe("useGuilds", () => {
  it("filters out guilds without an instanceUrl", () => {
    mockContext.mockReturnValue({
      mergedGuilds: [
        { id: "g1", name: "Alpha", instanceUrl: "https://a.example.com" },
        { id: "g2", name: "Orphan", instanceUrl: null },
      ],
      guildsLoaded: true,
    })

    const { result } = renderHook(() => useGuilds())
    expect(result.current.servers).toHaveLength(1)
    expect(result.current.servers[0].id).toBe("g1")
  })

  it("prefers _localName over name", () => {
    mockContext.mockReturnValue({
      mergedGuilds: [
        {
          id: "g1",
          name: "Backend Name",
          _localName: "Local Name",
          instanceUrl: "https://a.example.com",
        },
      ],
      guildsLoaded: true,
    })

    const { result } = renderHook(() => useGuilds())
    expect(result.current.servers[0].name).toBe("Local Name")
  })

  it("derives initials from the chosen name", () => {
    mockContext.mockReturnValue({
      mergedGuilds: [
        { id: "g1", name: "Gamma Squad", instanceUrl: "https://a.example.com" },
      ],
      guildsLoaded: true,
    })

    const { result } = renderHook(() => useGuilds())
    expect(result.current.servers[0].initials).toBe("GS")
  })

  it("exposes a findById lookup", () => {
    mockContext.mockReturnValue({
      mergedGuilds: [
        { id: "g1", name: "Alpha", instanceUrl: "https://a.example.com" },
        { id: "g2", name: "Beta", instanceUrl: "https://b.example.com" },
      ],
      guildsLoaded: true,
    })

    const { result } = renderHook(() => useGuilds())
    expect(result.current.findById("g2")?.name).toBe("Beta")
    expect(result.current.findById("missing")).toBeNull()
  })
})
