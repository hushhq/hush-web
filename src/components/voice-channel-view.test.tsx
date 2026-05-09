/**
 * Integration tests for the VoiceChannelView active-room device wiring.
 *
 * Targets the auto-publish + live-republish behaviour that pairs the
 * settings panel and the in-call device pickers with the published
 * tracks. Uses heavy mocks for `useRoom`, `useVoiceBandwidth`, the
 * MLS store, and every voice sub-component so the test can drive
 * device prefs through the real `voiceDevicePrefs` emitter without
 * pulling in livekit-client / WASM.
 *
 * Coverage:
 *  - Auto-publish on first mount uses default device when prefs say
 *    so + dontAskAgain skips the prejoin dialog.
 *  - Mic device change made via the panel (writes IDB +
 *    notifyVoiceDevicePrefs) re-publishes the active mic in-room.
 *  - Output device change via the panel pushes setSinkId to the
 *    playback manager.
 *  - In-call mic picker handler (which imperatively re-publishes
 *    BEFORE saving prefs) does not double-publish when the prefs
 *    subscriber re-fires the diff effect.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { act, render, cleanup, waitFor } from "@testing-library/react"

beforeEach(() => {
  if (typeof globalThis.MediaStream === "undefined") {
    // @ts-expect-error jsdom polyfill
    globalThis.MediaStream = class MockMediaStream {
      _tracks = []
    }
  }
})

const roomMock = vi.hoisted(() => {
  const handlers: Record<string, (deviceId: string | null) => unknown> = {}
  const playbackManager = {
    bindContainer: vi.fn(),
    unbindContainer: vi.fn(),
    setRemoteAudioMuted: vi.fn(),
    setSinkId: vi.fn().mockResolvedValue(undefined),
  }
  const api = {
    isReady: false,
    error: null as string | null,
    localTracks: new Map(),
    remoteTracks: new Map(),
    participants: [],
    isVoiceReconnecting: false,
    voiceReconnectFailed: false,
    activeSpeakerIds: [],
    localSpeaking: false,
    availableScreens: new Map(),
    watchedScreens: new Set(),
    loadingScreens: new Set(),
    connectRoom: vi.fn().mockResolvedValue(undefined),
    disconnectRoom: vi.fn().mockResolvedValue(undefined),
    publishScreen: vi.fn().mockResolvedValue(null),
    unpublishScreen: vi.fn().mockResolvedValue(undefined),
    switchScreenSource: vi.fn().mockResolvedValue(null),
    changeQuality: vi.fn().mockResolvedValue(undefined),
    publishWebcam: vi.fn().mockResolvedValue(undefined),
    unpublishWebcam: vi.fn().mockResolvedValue(undefined),
    publishMic: vi.fn().mockResolvedValue(undefined),
    unpublishMic: vi.fn().mockResolvedValue(undefined),
    muteMic: vi.fn().mockResolvedValue(undefined),
    unmuteMic: vi.fn().mockResolvedValue(undefined),
    updateMicFilterSettings: vi.fn(),
    watchScreen: vi.fn(),
    unwatchScreen: vi.fn(),
    playbackManager,
    room: null,
  }
  return { api, handlers, playbackManager }
})

vi.mock("@/hooks/useRoom", () => ({
  useRoom: () => roomMock.api,
}))

vi.mock("@/hooks/useVoiceBandwidth", () => ({
  useVoiceBandwidth: () => ({
    qualityKey: "balanced",
    setQualityKey: vi.fn(),
  }),
}))

vi.mock("@/hooks/use-mobile", () => ({
  useIsMobile: () => false,
}))

vi.mock("@/audio", () => ({
  isOutputDeviceSelectionSupported: () => true,
}))

vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({ user: { id: "user-1" }, token: "tok" }),
}))

vi.mock("@/hooks/useAuth", () => ({
  getDeviceId: () => "device-1",
  useAuth: () => ({ user: { id: "user-1" }, token: "tok" }),
}))

vi.mock("@/lib/mlsStore", () => ({
  open: vi.fn(),
  loadCredential: vi.fn(),
}))

vi.mock("@livekit/components-react", () => ({
  RoomContext: { Provider: ({ children }: { children: unknown }) => children },
}))

vi.mock("@livekit/components-styles", () => ({}))

// Lightweight stubs for sub-components — none of the device wiring
// flows through them so we only need a non-throwing render.
vi.mock("@/components/voice/voice-controls-bar", () => ({
  VoiceControlsBar: () => null,
}))
// Capture each picker's onSelect by title so tests can drive
// in-call mic / webcam / output handlers without rendering real
// dialog DOM.
const pickerHandlers: {
  mic: ((id: string) => void) | null
  camera: ((id: string) => void) | null
  output: ((id: string) => void) | null
} = { mic: null, camera: null, output: null }

vi.mock("@/components/voice/voice-device-picker-dialog", () => ({
  VoiceDevicePickerDialog: (props: {
    title?: string
    onSelect?: (id: string) => void
  }) => {
    if (typeof props.onSelect === "function") {
      if (props.title === "Choose microphone") pickerHandlers.mic = props.onSelect
      else if (props.title === "Choose camera") pickerHandlers.camera = props.onSelect
      else if (props.title === "Choose audio output") pickerHandlers.output = props.onSelect
    }
    return null
  },
}))
vi.mock("@/components/voice/voice-participant-grid", () => ({
  VoiceParticipantGrid: () => null,
}))
vi.mock("@/components/voice/voice-quality-picker-dialog", () => ({
  VoiceQualityPickerDialog: () => null,
}))
vi.mock("@/components/voice/voice-reconnect-overlay", () => ({
  VoiceReconnectOverlay: () => null,
}))

vi.mock("@/components/voice/voice-prejoin-dialog", () => ({
  VoicePrejoinDialog: () => null,
}))

import {
  clearVoiceDevicePrefs,
  saveVoiceDevicePrefs,
} from "@/lib/voiceDevicePrefs"
import { VoiceChannelView } from "./voice-channel-view"

const CHANNEL = { id: "ch-1", name: "general", type: "voice" as const }
const WS_CLIENT = {
  send: vi.fn(),
  isConnected: () => true,
}

function setRoomReady(ready: boolean) {
  roomMock.api.isReady = ready
}

function resetRoomMock() {
  roomMock.api.isReady = false
  roomMock.api.connectRoom.mockClear().mockResolvedValue(undefined)
  roomMock.api.disconnectRoom.mockClear().mockResolvedValue(undefined)
  roomMock.api.publishMic.mockClear().mockResolvedValue(undefined)
  roomMock.api.unpublishMic.mockClear().mockResolvedValue(undefined)
  roomMock.api.publishWebcam.mockClear().mockResolvedValue(undefined)
  roomMock.api.unpublishWebcam.mockClear().mockResolvedValue(undefined)
  roomMock.playbackManager.setSinkId.mockClear().mockResolvedValue(undefined)
  WS_CLIENT.send.mockClear()
}

beforeEach(async () => {
  resetRoomMock()
  pickerHandlers.mic = null
  pickerHandlers.camera = null
  pickerHandlers.output = null
  await clearVoiceDevicePrefs("user-1").catch(() => {})
})

afterEach(() => {
  cleanup()
})

async function mount() {
  let result!: ReturnType<typeof render>
  await act(async () => {
    result = render(
      <VoiceChannelView
        channel={CHANNEL}
        serverId="srv-1"
        getToken={() => "tok"}
        wsClient={null}
        onLeave={vi.fn()}
      />
    )
    // Let the prefs-load effect resolve.
    await Promise.resolve()
  })
  await act(async () => {
    setRoomReady(true)
    // Force a re-render so effects depending on room.isReady fire.
    result.rerender(
      <VoiceChannelView
        channel={CHANNEL}
        serverId="srv-1"
        getToken={() => "tok"}
        wsClient={null}
        onLeave={vi.fn()}
      />
    )
    await Promise.resolve()
  })
  return result
}

describe("VoiceChannelView — auto-join lifecycle", () => {
  it("does not abort an in-flight auto-join when callback props change", async () => {
    await saveVoiceDevicePrefs("user-1", {
      audioDeviceId: null,
      videoDeviceId: null,
      outputDeviceId: null,
      audioEnabled: false,
      videoEnabled: false,
      dontAskAgain: true,
    })
    roomMock.api.connectRoom.mockImplementationOnce(
      () => new Promise(() => {})
    )

    let result!: ReturnType<typeof render>
    await act(async () => {
      result = render(
        <VoiceChannelView
          channel={CHANNEL}
          serverId="srv-1"
          getToken={() => "tok-a"}
          wsClient={WS_CLIENT}
          onLeave={vi.fn()}
        />
      )
      await Promise.resolve()
    })

    await waitFor(() => {
      expect(roomMock.api.connectRoom).toHaveBeenCalledTimes(1)
    })

    await act(async () => {
      result.rerender(
        <VoiceChannelView
          channel={CHANNEL}
          serverId="srv-1"
          getToken={() => "tok-b"}
          wsClient={WS_CLIENT}
          onLeave={vi.fn()}
        />
      )
      await Promise.resolve()
    })

    expect(roomMock.api.disconnectRoom).not.toHaveBeenCalled()
    expect(roomMock.api.connectRoom).toHaveBeenCalledTimes(1)
  })
})

describe("VoiceChannelView — auto-publish with skip prejoin + default device", () => {
  it("publishes the system default mic when audioDeviceId is null", async () => {
    await saveVoiceDevicePrefs("user-1", {
      audioDeviceId: null,
      videoDeviceId: null,
      outputDeviceId: null,
      audioEnabled: true,
      videoEnabled: false,
      dontAskAgain: true,
    })

    await mount()

    await waitFor(() => {
      expect(roomMock.api.publishMic).toHaveBeenCalledWith(null)
    })
  })

  it("publishes the system default webcam when videoDeviceId is null + videoEnabled is true", async () => {
    await saveVoiceDevicePrefs("user-1", {
      audioDeviceId: null,
      videoDeviceId: null,
      outputDeviceId: null,
      audioEnabled: false,
      videoEnabled: true,
      dontAskAgain: true,
    })

    await mount()

    await waitFor(() => {
      expect(roomMock.api.publishWebcam).toHaveBeenCalledWith(null)
    })
  })

  it("publishes a saved mic id when one is persisted", async () => {
    await saveVoiceDevicePrefs("user-1", {
      audioDeviceId: "mic-saved",
      videoDeviceId: null,
      outputDeviceId: null,
      audioEnabled: true,
      videoEnabled: false,
      dontAskAgain: true,
    })

    await mount()

    await waitFor(() => {
      expect(roomMock.api.publishMic).toHaveBeenCalledWith("mic-saved")
    })
  })
})

describe("VoiceChannelView — live re-publish on prefs change", () => {
  it("re-publishes the mic when audioDeviceId changes via prefs save", async () => {
    await saveVoiceDevicePrefs("user-1", {
      audioDeviceId: "mic-a",
      videoDeviceId: null,
      outputDeviceId: null,
      audioEnabled: true,
      videoEnabled: false,
      dontAskAgain: true,
    })

    await mount()

    await waitFor(() => {
      expect(roomMock.api.publishMic).toHaveBeenCalledWith("mic-a")
    })

    roomMock.api.publishMic.mockClear()
    roomMock.api.unpublishMic.mockClear()

    // Simulate the settings panel writing a new mic.
    await act(async () => {
      await saveVoiceDevicePrefs("user-1", {
        audioDeviceId: "mic-b",
        videoDeviceId: null,
        outputDeviceId: null,
        audioEnabled: true,
        videoEnabled: false,
        dontAskAgain: true,
      })
    })

    await waitFor(() => {
      expect(roomMock.api.unpublishMic).toHaveBeenCalledTimes(1)
      expect(roomMock.api.publishMic).toHaveBeenCalledWith("mic-b")
    })
  })

  it("pushes setSinkId when outputDeviceId changes via prefs save", async () => {
    await saveVoiceDevicePrefs("user-1", {
      audioDeviceId: null,
      videoDeviceId: null,
      outputDeviceId: "out-a",
      audioEnabled: true,
      videoEnabled: false,
      dontAskAgain: true,
    })

    await mount()

    // The first setSinkId comes from the existing prefs-loaded
    // playback effect; clear it before driving the change.
    await waitFor(() => {
      expect(roomMock.playbackManager.setSinkId).toHaveBeenCalled()
    })
    roomMock.playbackManager.setSinkId.mockClear()

    await act(async () => {
      await saveVoiceDevicePrefs("user-1", {
        audioDeviceId: null,
        videoDeviceId: null,
        outputDeviceId: "out-b",
        audioEnabled: true,
        videoEnabled: false,
        dontAskAgain: true,
      })
    })

    await waitFor(() => {
      expect(roomMock.playbackManager.setSinkId).toHaveBeenCalledWith("out-b")
    })
  })

  it("in-call mic picker handler republishes exactly once (no double-publish)", async () => {
    await saveVoiceDevicePrefs("user-1", {
      audioDeviceId: "mic-a",
      videoDeviceId: null,
      outputDeviceId: null,
      audioEnabled: true,
      videoEnabled: false,
      dontAskAgain: true,
    })

    await mount()

    await waitFor(() => {
      expect(roomMock.api.publishMic).toHaveBeenCalledWith("mic-a")
      expect(pickerHandlers.mic).toBeTypeOf("function")
    })
    roomMock.api.publishMic.mockClear()
    roomMock.api.unpublishMic.mockClear()

    // Simulate the user picking a different mic from the in-call
    // picker. The handler imperatively re-publishes AND saves prefs;
    // the prefs subscriber re-fires the diff effect, which must
    // see lastApplied === incoming and no-op.
    await act(async () => {
      pickerHandlers.mic!("mic-b")
      await new Promise((resolve) => setTimeout(resolve, 0))
    })

    await waitFor(() => {
      expect(roomMock.api.publishMic).toHaveBeenCalledWith("mic-b")
    })
    expect(roomMock.api.unpublishMic).toHaveBeenCalledTimes(1)
    expect(roomMock.api.publishMic).toHaveBeenCalledTimes(1)
  })

  it("does not republish when the panel saves a no-op prefs update", async () => {
    await saveVoiceDevicePrefs("user-1", {
      audioDeviceId: "mic-a",
      videoDeviceId: null,
      outputDeviceId: null,
      audioEnabled: true,
      videoEnabled: false,
      dontAskAgain: true,
    })

    await mount()

    await waitFor(() => {
      expect(roomMock.api.publishMic).toHaveBeenCalledWith("mic-a")
    })
    roomMock.api.publishMic.mockClear()
    roomMock.api.unpublishMic.mockClear()

    // Only the dontAskAgain flag flips — same audio device id.
    await act(async () => {
      await saveVoiceDevicePrefs("user-1", {
        audioDeviceId: "mic-a",
        videoDeviceId: null,
        outputDeviceId: null,
        audioEnabled: true,
        videoEnabled: false,
        dontAskAgain: false,
      })
    })

    // Give the effect a tick to NOT fire.
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0))
    })

    expect(roomMock.api.unpublishMic).not.toHaveBeenCalled()
    expect(roomMock.api.publishMic).not.toHaveBeenCalled()
  })
})
