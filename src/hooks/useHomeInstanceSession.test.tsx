import { describe, expect, it, vi, beforeEach } from "vitest"
import { renderHook } from "@testing-library/react"

const getInstanceToken = vi.fn<(url: string) => string | null>()

vi.mock("./useAuth", () => ({
  getInstanceToken: (url: string) => getInstanceToken(url),
}))

import {
  resolveHomeInstanceToken,
  useHomeInstanceSession,
} from "./useHomeInstanceSession"

describe("useHomeInstanceSession", () => {
  beforeEach(() => {
    getInstanceToken.mockReset()
  })

  it("falls back to the active token when no explicit home instance is set", () => {
    expect(resolveHomeInstanceToken(null, "active-token")).toBe("active-token")
    expect(getInstanceToken).not.toHaveBeenCalled()

    const { result } = renderHook(() =>
      useHomeInstanceSession({
        homeInstanceUrl: null,
        fallbackToken: "active-token",
      })
    )

    expect(result.current).toEqual({
      token: "active-token",
      isExplicitHomeInstance: false,
      isMissingExplicitHomeInstanceToken: false,
    })
  })

  it("uses the namespaced token for an explicit home instance", () => {
    getInstanceToken.mockReturnValue("home-token")

    const { result } = renderHook(() =>
      useHomeInstanceSession({
        homeInstanceUrl: "https://home.example.com",
        fallbackToken: "active-token",
      })
    )

    expect(getInstanceToken).toHaveBeenCalledWith("https://home.example.com")
    expect(result.current).toEqual({
      token: "home-token",
      isExplicitHomeInstance: true,
      isMissingExplicitHomeInstanceToken: false,
    })
  })

  it("reports a missing token for an explicit home instance", () => {
    getInstanceToken.mockReturnValue(null)

    const { result } = renderHook(() =>
      useHomeInstanceSession({
        homeInstanceUrl: "https://home.example.com",
        fallbackToken: "active-token",
      })
    )

    expect(result.current).toEqual({
      token: null,
      isExplicitHomeInstance: true,
      isMissingExplicitHomeInstanceToken: true,
    })
  })
})
