import { renderHook, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { getLiveKitVoiceState } from "@/lib/api"
import { useVoiceChannelPresence } from "./useVoiceChannelPresence"

vi.mock("@/lib/api", () => ({
  getLiveKitVoiceState: vi.fn(),
}))

function makeWsClient() {
  const handlers = new Map<string, (payload: unknown) => void>()
  return {
    on: vi.fn((event: string, handler: (payload: unknown) => void) => {
      handlers.set(event, handler)
    }),
    off: vi.fn((event: string) => {
      handlers.delete(event)
    }),
    emit(event: string, payload: unknown) {
      handlers.get(event)?.(payload)
    },
  }
}

beforeEach(() => {
  vi.clearAllMocks()
  vi.mocked(getLiveKitVoiceState).mockResolvedValue({
    participantsByChannel: {},
  })
})

describe("useVoiceChannelPresence", () => {
  it("bootstraps current voice participants from the server snapshot", async () => {
    vi.mocked(getLiveKitVoiceState).mockResolvedValueOnce({
      participantsByChannel: {
        "voice-a": [
          { userId: "user-self", displayName: "Yarin" },
          { userId: "user-b", displayName: "Bea" },
        ],
      },
    })

    const { result } = renderHook(() =>
      useVoiceChannelPresence(makeWsClient(), "user-self", "token", "srv-1", "")
    )

    await waitFor(() => {
      expect(result.current.get("voice-a")).toEqual([
        { id: "user-self", name: "You", initials: "Y" },
        { id: "user-b", name: "Bea", initials: "B" },
      ])
    })
    expect(getLiveKitVoiceState).toHaveBeenCalledWith("token", "srv-1", "")
  })

  it("applies websocket voice_state_update after the bootstrap snapshot", async () => {
    const ws = makeWsClient()
    const { result } = renderHook(() =>
      useVoiceChannelPresence(ws, "user-self", "token", "srv-1", "")
    )

    await waitFor(() => {
      expect(getLiveKitVoiceState).toHaveBeenCalled()
    })
    ws.emit("voice_state_update", {
      type: "voice_state_update",
      channel_id: "voice-b",
      participants: [{ userId: "user-c", displayName: "Caro" }],
    })

    await waitFor(() => {
      expect(result.current.get("voice-b")).toEqual([
        { id: "user-c", name: "Caro", initials: "C" },
      ])
    })
  })
})
