import { render, screen, waitFor } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { VoicePrejoinDialog } from "./voice-prejoin-dialog"

const audioTrack = { stop: vi.fn() }

beforeEach(() => {
  audioTrack.stop.mockClear()
  Object.defineProperty(navigator, "mediaDevices", {
    configurable: true,
    value: {
      getUserMedia: vi.fn().mockResolvedValue({
        getTracks: () => [audioTrack],
      }),
      enumerateDevices: vi.fn().mockResolvedValue([
        { kind: "audioinput", deviceId: "mic-a", label: "Mic A" },
        { kind: "audioinput", deviceId: "mic-b", label: "Mic B" },
        { kind: "videoinput", deviceId: "cam-a", label: "Cam A" },
        { kind: "videoinput", deviceId: "cam-b", label: "Cam B" },
      ]),
    },
  })
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe("VoicePrejoinDialog", () => {
  it("updates selected devices when saved prefs arrive after opening", async () => {
    const { rerender } = render(
      <VoicePrejoinDialog
        channelName="general"
        open
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
        initial={undefined}
      />
    )

    await waitFor(() => {
      expect(screen.getByText("Mic A")).toBeInTheDocument()
    })

    rerender(
      <VoicePrejoinDialog
        channelName="general"
        open
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
        initial={{
          audioDeviceId: "mic-b",
          videoDeviceId: "cam-b",
          audioEnabled: true,
          videoEnabled: false,
          dontAskAgain: false,
        }}
      />
    )

    await waitFor(() => {
      expect(screen.getByText("Mic B")).toBeInTheDocument()
    })
  })
})
