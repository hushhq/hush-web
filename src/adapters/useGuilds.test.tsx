/**
 * Verifies useGuilds maps useInstanceContext().mergedGuilds to the
 * prototype Server[] shape: drops guilds without instanceUrl, derives
 * initials, prefers _localName over name, exposes findById.
 */
import { describe, it, expect, vi } from "vitest"
import { renderHook } from "@testing-library/react"

const mockContext = vi.fn()
const mockAuth = vi.fn(() => ({ user: { id: "current-user" } }))

vi.mock("@/contexts/InstanceContext", () => ({
  useInstanceContext: () => mockContext(),
}))

vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => mockAuth(),
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

  it("derives role from permissionLevel when present", () => {
    mockContext.mockReturnValue({
      mergedGuilds: [
        {
          id: "g1",
          name: "Alpha",
          instanceUrl: "https://a.example.com",
          permissionLevel: 3,
        },
        {
          id: "g2",
          name: "Beta",
          instanceUrl: "https://b.example.com",
          permissionLevel: 1,
        },
      ],
      guildsLoaded: true,
    })

    const { result } = renderHook(() => useGuilds())
    expect(result.current.servers[0].role).toBe("owner")
    expect(result.current.servers[1].role).toBe("moderator")
  })

  it("derives role from ownerId when permissionLevel is absent", () => {
    mockContext.mockReturnValue({
      mergedGuilds: [
        {
          id: "g1",
          name: "Alpha",
          instanceUrl: "https://a.example.com",
          ownerId: "current-user",
        },
        {
          id: "g2",
          name: "Beta",
          instanceUrl: "https://b.example.com",
          ownerId: "someone-else",
        },
      ],
      guildsLoaded: true,
    })

    const { result } = renderHook(() => useGuilds())
    expect(result.current.servers[0].role).toBe("owner")
    expect(result.current.servers[1].role).toBeUndefined()
  })
})
