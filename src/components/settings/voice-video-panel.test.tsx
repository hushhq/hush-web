/**
 * VoiceVideoPanel coverage:
 *  - opening the panel does NOT call getUserMedia (no permission prompt)
 *  - "Grant access" buttons appear when device labels are empty,
 *    and clicking them triggers `getUserMedia({audio:true})` /
 *    `({video:true})` only
 *  - selecting a microphone persists to voiceDevicePrefs (IDB)
 *  - filter changes pushdown to voiceRuntime.onMicFilterSettingsChange
 *    while in voice
 *  - mic-test toggle isolates the room (deafens) and restores on stop
 *  - mid-test mic switch failure restores the pre-test state
 */
import {
  describe,
  it,
  expect,
  vi,
  afterEach,
  beforeAll,
  beforeEach,
} from "vitest"
import { render, screen, cleanup, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

beforeAll(() => {
  if (!window.matchMedia) {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockReturnValue({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }),
    })
  }
  // Radix Select uses scrollIntoView + pointer-capture polyfills
  // jsdom does not implement.
  window.HTMLElement.prototype.scrollIntoView = vi.fn()
  window.HTMLElement.prototype.hasPointerCapture = vi.fn(() => false)
  window.HTMLElement.prototype.releasePointerCapture = vi.fn()
})

vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({ user: { id: "user-1" } }),
}))

const startMicMonitor = vi.fn().mockResolvedValue(undefined)
const stopMicMonitor = vi.fn().mockResolvedValue(undefined)
const updateMicMonitorSettings = vi.fn()
const micMonitorState: {
  isTesting: boolean
  level: number
  gateOpen: boolean
  error: Error | null
} = { isTesting: false, level: 0, gateOpen: false, error: null }
const micLevelRef = { current: 0 }
const micGateOpenRef = { current: false }
vi.mock("@/hooks/useMicMonitor", () => ({
  useMicMonitor: () => ({
    isTesting: micMonitorState.isTesting,
    level: micMonitorState.level,
    gateOpen: micMonitorState.gateOpen,
    error: micMonitorState.error,
    setError: (e: Error | null) => {
      micMonitorState.error = e
    },
    levelRef: micLevelRef,
    gateOpenRef: micGateOpenRef,
    start: startMicMonitor,
    stop: stopMicMonitor,
    updateSettings: updateMicMonitorSettings,
  }),
}))

const readVoiceDevicePrefs = vi.fn().mockResolvedValue(null)
const saveVoiceDevicePrefs = vi.fn().mockResolvedValue(undefined)
vi.mock("@/lib/voiceDevicePrefs", () => ({
  readVoiceDevicePrefs: (...args: unknown[]) => readVoiceDevicePrefs(...args),
  saveVoiceDevicePrefs: (...args: unknown[]) => saveVoiceDevicePrefs(...args),
}))

import { VoiceVideoPanel, type VoiceRuntime } from "./voice-video-panel"

interface DeviceFixture {
  deviceId: string
  kind: MediaDeviceKind
  label: string
}

function installMediaDevices(opts: {
  devices: DeviceFixture[]
  getUserMedia?: (
    constraints: MediaStreamConstraints
  ) => Promise<MediaStream>
}): {
  enumerateDevicesMock: ReturnType<typeof vi.fn>
  getUserMediaMock: ReturnType<typeof vi.fn>
  setDevices: (next: DeviceFixture[]) => void
} {
  let current = opts.devices
  const enumerateDevicesMock = vi.fn(async () =>
    current.map((d) => ({
      deviceId: d.deviceId,
      kind: d.kind,
      label: d.label,
      groupId: "g",
      toJSON: () => ({}),
    }))
  )
  const stopTrack = vi.fn()
  const fakeStream = {
    getTracks: () => [{ stop: stopTrack } as unknown as MediaStreamTrack],
  } as unknown as MediaStream
  const getUserMediaMock = vi.fn(async (constraints: MediaStreamConstraints) =>
    opts.getUserMedia ? opts.getUserMedia(constraints) : fakeStream
  )
  Object.defineProperty(navigator, "mediaDevices", {
    configurable: true,
    value: {
      enumerateDevices: enumerateDevicesMock,
      getUserMedia: getUserMediaMock,
    },
  })
  return {
    enumerateDevicesMock,
    getUserMediaMock,
    setDevices: (next) => {
      current = next
    },
  }
}

afterEach(() => {
  cleanup()
  startMicMonitor.mockClear()
  stopMicMonitor.mockClear()
  updateMicMonitorSettings.mockClear()
  readVoiceDevicePrefs.mockClear()
  saveVoiceDevicePrefs.mockClear()
  micMonitorState.isTesting = false
  micMonitorState.level = 0
  micMonitorState.gateOpen = false
  micMonitorState.error = null
  localStorage.clear()
})

beforeEach(() => {
  readVoiceDevicePrefs.mockResolvedValue(null)
})

describe("VoiceVideoPanel — permission posture", () => {
  it("does NOT call getUserMedia on mount", async () => {
    const { enumerateDevicesMock, getUserMediaMock } = installMediaDevices({
      devices: [
        { deviceId: "mic-a", kind: "audioinput", label: "" },
        { deviceId: "cam-a", kind: "videoinput", label: "" },
      ],
    })

    render(<VoiceVideoPanel voiceRuntime={null} />)

    await waitFor(() => expect(enumerateDevicesMock).toHaveBeenCalledTimes(1))
    expect(getUserMediaMock).not.toHaveBeenCalled()
  })

  it("renders Grant buttons when device labels are empty", async () => {
    installMediaDevices({
      devices: [
        { deviceId: "mic-a", kind: "audioinput", label: "" },
        { deviceId: "cam-a", kind: "videoinput", label: "" },
      ],
    })

    render(<VoiceVideoPanel voiceRuntime={null} />)

    expect(
      await screen.findByRole("button", { name: /grant microphone access/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: /grant camera access/i })
    ).toBeInTheDocument()
  })

  it("Grant camera access requests video-only permission", async () => {
    const { getUserMediaMock, setDevices, enumerateDevicesMock } =
      installMediaDevices({
        devices: [
          { deviceId: "cam-a", kind: "videoinput", label: "" },
        ],
      })

    render(<VoiceVideoPanel voiceRuntime={null} />)

    const grantBtn = await screen.findByRole("button", {
      name: /grant camera access/i,
    })

    setDevices([
      { deviceId: "cam-a", kind: "videoinput", label: "FaceTime HD" },
    ])

    await userEvent.click(grantBtn)

    expect(getUserMediaMock).toHaveBeenCalledTimes(1)
    expect(getUserMediaMock).toHaveBeenCalledWith({ video: true })
    expect(enumerateDevicesMock).toHaveBeenCalledTimes(2)
  })

  it("Grant microphone access requests audio-only permission", async () => {
    const { getUserMediaMock } = installMediaDevices({
      devices: [{ deviceId: "mic-a", kind: "audioinput", label: "" }],
    })

    render(<VoiceVideoPanel voiceRuntime={null} />)

    const grantBtn = await screen.findByRole("button", {
      name: /grant microphone access/i,
    })
    await userEvent.click(grantBtn)

    expect(getUserMediaMock).toHaveBeenCalledTimes(1)
    expect(getUserMediaMock).toHaveBeenCalledWith({ audio: true })
  })
})

describe("VoiceVideoPanel — filter pushdown", () => {
  it("pushes filter changes to voiceRuntime.onMicFilterSettingsChange", async () => {
    installMediaDevices({
      devices: [{ deviceId: "mic-a", kind: "audioinput", label: "Mic A" }],
    })
    const onMicFilterSettingsChange = vi.fn()
    const runtime: VoiceRuntime = {
      isInVoice: true,
      isMuted: false,
      isDeafened: false,
      onMute: vi.fn(),
      onDeafen: vi.fn().mockResolvedValue(undefined),
      onMicFilterSettingsChange,
    }

    render(<VoiceVideoPanel voiceRuntime={runtime} />)

    const noiseGateSwitch = await screen.findByRole("switch", {
      name: /noise gate/i,
    })
    await userEvent.click(noiseGateSwitch)

    expect(onMicFilterSettingsChange).toHaveBeenCalledTimes(1)
    expect(onMicFilterSettingsChange.mock.calls[0][0]).toMatchObject({
      noiseGateEnabled: false,
    })
    expect(updateMicMonitorSettings).toHaveBeenCalledTimes(1)
  })
})

describe("VoiceVideoPanel — mic test isolation", () => {
  it("deafens the room on Start test and restores on Stop test", async () => {
    installMediaDevices({
      devices: [{ deviceId: "mic-a", kind: "audioinput", label: "Mic A" }],
    })
    const onDeafen = vi.fn().mockResolvedValue(undefined)
    const runtime: VoiceRuntime = {
      isInVoice: true,
      isMuted: false,
      isDeafened: false,
      onMute: vi.fn(),
      onDeafen,
      onMicFilterSettingsChange: vi.fn(),
    }

    const { rerender } = render(<VoiceVideoPanel voiceRuntime={runtime} />)

    const startBtn = await screen.findByRole("button", { name: /start test/i })
    await userEvent.click(startBtn)

    expect(onDeafen).toHaveBeenCalledTimes(1)
    expect(startMicMonitor).toHaveBeenCalledTimes(1)

    micMonitorState.isTesting = true
    rerender(<VoiceVideoPanel voiceRuntime={runtime} />)

    const stopBtn = await screen.findByRole("button", { name: /stop test/i })
    await userEvent.click(stopBtn)

    expect(stopMicMonitor).toHaveBeenCalled()
    // Restore: deafen was applied → second call un-deafens.
    expect(onDeafen).toHaveBeenCalledTimes(2)
  })

  it("restores the pre-test state when a mid-test mic switch fails", async () => {
    installMediaDevices({
      devices: [
        { deviceId: "mic-a", kind: "audioinput", label: "Mic A" },
        { deviceId: "mic-b", kind: "audioinput", label: "Mic B" },
      ],
    })
    const onDeafen = vi.fn().mockResolvedValue(undefined)
    const runtime: VoiceRuntime = {
      isInVoice: true,
      isMuted: false,
      isDeafened: false,
      onMute: vi.fn(),
      onDeafen,
      onMicFilterSettingsChange: vi.fn(),
    }

    const { rerender } = render(<VoiceVideoPanel voiceRuntime={runtime} />)

    const startBtn = await screen.findByRole("button", { name: /start test/i })
    await userEvent.click(startBtn)
    expect(onDeafen).toHaveBeenCalledTimes(1)

    // Now we are testing — mid-test mic switch will fail.
    micMonitorState.isTesting = true
    rerender(<VoiceVideoPanel voiceRuntime={runtime} />)

    const overconstrained = Object.assign(new Error("OverconstrainedError"), {
      name: "OverconstrainedError",
    })
    startMicMonitor.mockRejectedValueOnce(overconstrained)

    const trigger = await screen.findByRole("combobox", { name: /microphone/i })
    await userEvent.click(trigger)
    const option = await screen.findByRole("option", { name: /mic b/i })
    await userEvent.click(option)

    await waitFor(() => {
      // Failure path: the panel must restore (call onDeafen again so
      // the user is no longer stuck in the deafened-by-test state).
      expect(onDeafen).toHaveBeenCalledTimes(2)
    })
  })
})

describe("VoiceVideoPanel — output device", () => {
  // jsdom does not implement HTMLMediaElement.setSinkId so the
  // `isOutputDeviceSelectionSupported` predicate returns false out
  // of the box. Polyfill it as a no-op for the duration of these
  // tests so the picker renders and the live pushdown path can be
  // exercised. We also stub `useIsMobile` to return false.
  beforeAll(() => {
    if (
      typeof HTMLMediaElement !== "undefined" &&
      typeof HTMLMediaElement.prototype.setSinkId !== "function"
    ) {
      // @ts-expect-error jsdom polyfill
      HTMLMediaElement.prototype.setSinkId = function setSinkId() {
        return Promise.resolve()
      }
    }
  })

  it("persists the chosen output device + pushes it to voiceRuntime", async () => {
    installMediaDevices({
      devices: [
        { deviceId: "mic-a", kind: "audioinput", label: "Mic A" },
        { deviceId: "out-a", kind: "audiooutput", label: "Built-in Speakers" },
        { deviceId: "out-b", kind: "audiooutput", label: "External Headphones" },
      ],
    })
    const onOutputDeviceChange = vi.fn().mockResolvedValue(undefined)
    const runtime: VoiceRuntime = {
      isInVoice: true,
      isMuted: false,
      isDeafened: false,
      onMute: vi.fn(),
      onDeafen: vi.fn().mockResolvedValue(undefined),
      onMicFilterSettingsChange: vi.fn(),
      onOutputDeviceChange,
    }

    render(<VoiceVideoPanel voiceRuntime={runtime} />)

    const trigger = await screen.findByRole("combobox", { name: /output/i })
    await userEvent.click(trigger)
    const option = await screen.findByRole("option", {
      name: /external headphones/i,
    })
    await userEvent.click(option)

    await waitFor(() => {
      expect(saveVoiceDevicePrefs).toHaveBeenCalled()
    })
    const lastCallArgs = saveVoiceDevicePrefs.mock.calls.at(-1) ?? []
    expect(lastCallArgs[1]).toMatchObject({ outputDeviceId: "out-b" })
    expect(onOutputDeviceChange).toHaveBeenCalledWith("out-b")
  })
})

describe("VoiceVideoPanel — device persistence", () => {
  it("persists microphone selection through voiceDevicePrefs", async () => {
    installMediaDevices({
      devices: [
        { deviceId: "mic-a", kind: "audioinput", label: "Mic A" },
        { deviceId: "mic-b", kind: "audioinput", label: "Mic B" },
      ],
    })

    render(<VoiceVideoPanel voiceRuntime={null} />)

    const trigger = await screen.findByRole("combobox", { name: /microphone/i })
    await userEvent.click(trigger)
    const option = await screen.findByRole("option", { name: /mic b/i })
    await userEvent.click(option)

    await waitFor(() => {
      expect(saveVoiceDevicePrefs).toHaveBeenCalledTimes(1)
    })
    expect(saveVoiceDevicePrefs.mock.calls[0][0]).toBe("user-1")
    expect(saveVoiceDevicePrefs.mock.calls[0][1]).toMatchObject({
      audioDeviceId: "mic-b",
    })
  })
})
