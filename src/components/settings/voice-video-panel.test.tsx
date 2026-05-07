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

const isMobileState = { value: false }
vi.mock("@/hooks/use-mobile", () => ({
  useIsMobile: () => isMobileState.value,
}))

const outputSelectionSupportedState = { value: true }
vi.mock("@/audio", () => ({
  isOutputDeviceSelectionSupported: () => outputSelectionSupportedState.value,
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
  // No-op subscriber: the panel-level tests don't drive prefs from
  // the outside, they exercise the local persistPrefs path. The
  // emitter integration is covered in voiceDevicePrefs.test.ts.
  subscribeVoiceDevicePrefs: vi.fn(() => () => {}),
  mergeVoiceDevicePrefs: (
    prev: Record<string, unknown> | null,
    patch: Record<string, unknown>
  ) => ({
    audioDeviceId: null,
    videoDeviceId: null,
    outputDeviceId: null,
    audioEnabled: true,
    videoEnabled: false,
    dontAskAgain: false,
    ...(prev ?? {}),
    ...patch,
    updatedAt: Date.now(),
  }),
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
  isMobileState.value = false
  outputSelectionSupportedState.value = true
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

describe("VoiceVideoPanel — audio filters card", () => {
  it("renders the Shipping soon placeholder and no noise-gate switch", async () => {
    installMediaDevices({
      devices: [{ deviceId: "mic-a", kind: "audioinput", label: "Mic A" }],
    })

    render(<VoiceVideoPanel voiceRuntime={null} />)

    expect(
      await screen.findByText(/hush audio filters/i)
    ).toBeInTheDocument()
    expect(screen.getByText(/shipping soon/i)).toBeInTheDocument()
    expect(screen.queryByRole("switch", { name: /noise gate/i })).toBeNull()
    expect(
      screen.queryByRole("slider", { name: /sensitivity threshold/i })
    ).toBeNull()
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

  it("disables the picker on mobile and shows the OS-routing copy", async () => {
    isMobileState.value = true
    installMediaDevices({
      devices: [
        { deviceId: "mic-a", kind: "audioinput", label: "Mic A" },
        { deviceId: "out-a", kind: "audiooutput", label: "Built-in Speakers" },
      ],
    })

    render(<VoiceVideoPanel voiceRuntime={null} />)

    const trigger = await screen.findByRole("combobox", { name: /output/i })
    expect(trigger).toBeDisabled()
    expect(
      screen.getByText(/output routing is managed by the os on mobile/i)
    ).toBeInTheDocument()
  })

  it("disables the picker when the browser lacks setSinkId support", async () => {
    outputSelectionSupportedState.value = false
    installMediaDevices({
      devices: [
        { deviceId: "mic-a", kind: "audioinput", label: "Mic A" },
        { deviceId: "out-a", kind: "audiooutput", label: "Built-in Speakers" },
      ],
    })

    render(<VoiceVideoPanel voiceRuntime={null} />)

    const trigger = await screen.findByRole("combobox", { name: /output/i })
    expect(trigger).toBeDisabled()
    expect(
      screen.getByText(/your browser does not expose output device selection/i)
    ).toBeInTheDocument()
  })

  it("does NOT persist the choice when the live reroute fails", async () => {
    installMediaDevices({
      devices: [
        { deviceId: "mic-a", kind: "audioinput", label: "Mic A" },
        { deviceId: "out-a", kind: "audiooutput", label: "Built-in Speakers" },
        { deviceId: "out-b", kind: "audiooutput", label: "External Headphones" },
      ],
    })
    const onOutputDeviceChange = vi
      .fn()
      .mockRejectedValue(new Error("device disconnected"))
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
      expect(onOutputDeviceChange).toHaveBeenCalled()
    })
    expect(saveVoiceDevicePrefs).not.toHaveBeenCalled()
    expect(
      await screen.findByText(/could not switch output device/i)
    ).toBeInTheDocument()
  })
})

describe("VoiceVideoPanel — ask before joining", () => {
  it("renders the checkbox unchecked when prefs.dontAskAgain is true", async () => {
    installMediaDevices({
      devices: [{ deviceId: "mic-a", kind: "audioinput", label: "Mic A" }],
    })
    readVoiceDevicePrefs.mockResolvedValueOnce({
      audioDeviceId: "mic-a",
      videoDeviceId: null,
      outputDeviceId: null,
      audioEnabled: true,
      videoEnabled: false,
      dontAskAgain: true,
      updatedAt: 1,
    })

    render(<VoiceVideoPanel voiceRuntime={null} />)

    const checkbox = await screen.findByRole("checkbox", {
      name: /ask before joining a voice channel/i,
    })
    await waitFor(() => {
      expect(checkbox).not.toBeChecked()
    })
  })

  it("toggling the checkbox flips dontAskAgain through persistPrefs", async () => {
    installMediaDevices({
      devices: [{ deviceId: "mic-a", kind: "audioinput", label: "Mic A" }],
    })
    readVoiceDevicePrefs.mockResolvedValueOnce({
      audioDeviceId: "mic-a",
      videoDeviceId: null,
      outputDeviceId: null,
      audioEnabled: true,
      videoEnabled: false,
      dontAskAgain: true,
      updatedAt: 1,
    })

    render(<VoiceVideoPanel voiceRuntime={null} />)

    const checkbox = await screen.findByRole("checkbox", {
      name: /ask before joining a voice channel/i,
    })
    await waitFor(() => {
      expect(checkbox).not.toBeChecked()
    })

    await userEvent.click(checkbox)

    await waitFor(() => {
      expect(saveVoiceDevicePrefs).toHaveBeenCalled()
    })
    const lastCall = saveVoiceDevicePrefs.mock.calls.at(-1) ?? []
    expect(lastCall[1]).toMatchObject({ dontAskAgain: false })
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
