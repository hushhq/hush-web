/**
 * Verifies useMembersForServer fetches via api.getGuildMembers and maps
 * the response to ServerMember[] with permissionLevel→role conversion.
 */
import { describe, it, expect, vi, beforeEach } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"

vi.mock("@/lib/api", () => ({
  getGuildMembers: vi.fn(),
}))

import { getGuildMembers as _getGuildMembers } from "@/lib/api"
import { useMembersForServer } from "./useMembersForServer"

const getGuildMembers = vi.mocked(
  _getGuildMembers as (
    token: string,
    serverId: string,
    baseUrl?: string
  ) => Promise<unknown>
)

describe("useMembersForServer", () => {
  beforeEach(() => {
    getGuildMembers.mockReset()
  })

  it("maps backend permission levels to roles", async () => {
    getGuildMembers.mockResolvedValue([
      { id: "u1", username: "alice", permissionLevel: 0 },
      { id: "u2", username: "bob", permissionLevel: 1 },
      { id: "u3", username: "carol", permissionLevel: 2 },
      { id: "u4", username: "dan", permissionLevel: 3 },
    ])

    const { result } = renderHook(() =>
      useMembersForServer({
        serverId: "g1",
        token: "tok",
        baseUrl: "https://a.example.com",
        currentUserId: "u1",
      })
    )

    await waitFor(() => {
      expect(result.current.members).toHaveLength(4)
    })
    expect(result.current.members.map((m) => m.role)).toEqual([
      "member",
      "moderator",
      "admin",
      "owner",
    ])
  })

  it("returns an empty list when serverId is null", async () => {
    const { result } = renderHook(() =>
      useMembersForServer({
        serverId: null,
        token: "tok",
        baseUrl: "https://a.example.com",
        currentUserId: "u1",
      })
    )

    await waitFor(() => {
      expect(result.current.members).toEqual([])
    })
    expect(getGuildMembers).not.toHaveBeenCalled()
  })

  it("captures fetch errors without throwing", async () => {
    getGuildMembers.mockRejectedValue(new Error("network down"))

    const { result } = renderHook(() =>
      useMembersForServer({
        serverId: "g1",
        token: "tok",
        baseUrl: "https://a.example.com",
        currentUserId: "u1",
      })
    )

    await waitFor(() => {
      expect(result.current.error).not.toBeNull()
    })
    expect(result.current.members).toEqual([])
  })

  it("derives initials and uses displayName when present", async () => {
    getGuildMembers.mockResolvedValue([
      { id: "u1", displayName: "Yarin Cardillo", permissionLevel: 0 },
    ])

    const { result } = renderHook(() =>
      useMembersForServer({
        serverId: "g1",
        token: "tok",
        baseUrl: "https://a.example.com",
        currentUserId: "u1",
      })
    )

    await waitFor(() => {
      expect(result.current.members).toHaveLength(1)
    })
    expect(result.current.members[0].name).toBe("Yarin Cardillo")
    expect(result.current.members[0].initials).toBe("YC")
  })

  it("uses undecorated username as the visible label when displayName is absent", async () => {
    getGuildMembers.mockResolvedValue([
      { id: "u1", username: "@mike", displayName: "", permissionLevel: 0 },
    ])

    const { result } = renderHook(() =>
      useMembersForServer({
        serverId: "g1",
        token: "tok",
        baseUrl: "https://a.example.com",
        currentUserId: "u1",
      })
    )

    await waitFor(() => {
      expect(result.current.members).toHaveLength(1)
    })
    expect(result.current.members[0].name).toBe("mike")
    expect(result.current.members[0].initials).toBe("M")
  })

  // Presence readiness contract — without this gate, the initial
  // empty `onlineUserIds` set would render every member offline
  // until the first `presence.update` frame arrived.
  it("renders rows online when presence snapshot has not arrived yet", async () => {
    getGuildMembers.mockResolvedValue([
      { id: "u1", username: "alice", permissionLevel: 0 },
      { id: "u2", username: "bob", permissionLevel: 0 },
    ])

    const { result } = renderHook(() =>
      useMembersForServer({
        serverId: "g1",
        token: "tok",
        baseUrl: "https://a.example.com",
        currentUserId: "u-self",
        onlineUserIds: new Set(),
        hasOnlineSnapshot: false,
      }),
    )

    await waitFor(() => expect(result.current.members).toHaveLength(2))
    expect(result.current.members.map((m) => m.presence)).toEqual([
      "online",
      "online",
    ])
  })

  it("derives presence from onlineUserIds once a snapshot has arrived", async () => {
    getGuildMembers.mockResolvedValue([
      { id: "u1", username: "alice", permissionLevel: 0 },
      { id: "u2", username: "bob", permissionLevel: 0 },
    ])

    const { result } = renderHook(() =>
      useMembersForServer({
        serverId: "g1",
        token: "tok",
        baseUrl: "https://a.example.com",
        currentUserId: "u-self",
        onlineUserIds: new Set(["u1"]),
        hasOnlineSnapshot: true,
      }),
    )

    await waitFor(() => expect(result.current.members).toHaveLength(2))
    expect(result.current.members.find((m) => m.id === "u1")?.presence).toBe(
      "online",
    )
    expect(result.current.members.find((m) => m.id === "u2")?.presence).toBe(
      "offline",
    )
  })
})
