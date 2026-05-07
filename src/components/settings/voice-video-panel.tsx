/**
 * Voice & video preferences panel for the user settings dialog.
 *
 * Behavioural parity with hush-legacy-stable's AudioVideoTab:
 *  - Microphone + camera device pickers (user-scoped, persisted in IDB
 *    via `voiceDevicePrefs` so the prejoin dialog and the active call
 *    pull from the same record).
 *  - Audio-filter card: noise-gate switch + sensitivity threshold slider
 *    (persisted in localStorage via `lib/micProcessing`).
 *  - Mic-test card: local loopback meter driven by `useMicMonitor`.
 *  - Live filter pushdown: while in voice, threshold + gate toggle
 *    changes apply to the published capture graph immediately
 *    (`voiceRuntime.onMicFilterSettingsChange`).
 *  - Mic-test isolation: while in voice, starting the test deafens the
 *    room (or mutes the mic if already deafened) so the local monitor
 *    is the only audible path. Stopping or unmounting (or a failure
 *    during a mid-test mic switch) restores the pre-test state.
 *
 * Permission posture: opening the panel does NOT request mic/camera
 * permission. We only enumerate devices (no labels until permission is
 * granted) and surface explicit "Grant access" buttons. Permission is
 * triggered by user intent — clicking the grant button, or starting
 * the mic test.
 */

import * as React from "react"
import { MicIcon, VideoIcon } from "lucide-react"

import { Button } from "@/components/ui/button.tsx"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator.tsx"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { useAuth } from "@/contexts/AuthContext"
import { useMicMonitor } from "@/hooks/useMicMonitor"
import {
  DEFAULT_MIC_FILTER_SETTINGS,
  MIC_GATE_THRESHOLD_MAX_DB,
  MIC_GATE_THRESHOLD_MIN_DB,
  MIC_GATE_THRESHOLD_STEP_DB,
  getMicFilterSettings,
  setMicFilterSettings,
} from "@/lib/micProcessing"
import {
  readVoiceDevicePrefs,
  saveVoiceDevicePrefs,
  type VoiceDevicePrefs,
} from "@/lib/voiceDevicePrefs"

interface RawDevice {
  deviceId: string
  /** Empty string when permission has not been granted yet. */
  rawLabel: string
}

interface MicFilterSettings {
  noiseGateEnabled: boolean
  noiseGateThresholdDb: number
}

export interface VoiceRuntime {
  isInVoice: boolean
  isMuted: boolean
  isDeafened: boolean
  onMute: () => void | Promise<void>
  onDeafen: () => void | Promise<void>
  onMicFilterSettingsChange: (settings: Partial<MicFilterSettings>) => void
}

interface VoiceVideoPanelProps {
  voiceRuntime?: VoiceRuntime | null
}

interface IsolationSnapshot {
  appliedDeafen: boolean
  appliedMute: boolean
}

interface DeviceList {
  audio: RawDevice[]
  video: RawDevice[]
}

const DEFAULT_OPTION_VALUE = "__default__"
const EMPTY_DEVICE_LIST: DeviceList = { audio: [], video: [] }

/**
 * Enumerate input devices WITHOUT triggering a permission prompt.
 * Labels remain empty strings until permission has been granted for
 * that kind, which the UI uses to decide whether to show the picker
 * or a "Grant access" button.
 */
async function enumerateDevicesRaw(): Promise<DeviceList> {
  if (!navigator?.mediaDevices?.enumerateDevices) return EMPTY_DEVICE_LIST
  const devices = await navigator.mediaDevices.enumerateDevices()
  const toRaw = (d: MediaDeviceInfo): RawDevice => ({
    deviceId: d.deviceId,
    rawLabel: d.label,
  })
  return {
    audio: devices
      .filter((d) => d.kind === "audioinput" && d.deviceId)
      .map(toRaw),
    video: devices
      .filter((d) => d.kind === "videoinput" && d.deviceId)
      .map(toRaw),
  }
}

async function requestMediaPermission(
  kind: "audio" | "video"
): Promise<void> {
  if (!navigator?.mediaDevices?.getUserMedia) {
    throw new Error("Media capture is not supported on this device.")
  }
  const constraints: MediaStreamConstraints =
    kind === "audio" ? { audio: true } : { video: true }
  const stream = await navigator.mediaDevices.getUserMedia(constraints)
  stream.getTracks().forEach((track) => track.stop())
}

/**
 * `true` when at least one device of this kind has a non-empty label —
 * which means the browser has surfaced labels for this kind, which only
 * happens after permission has been granted.
 */
function hasPermissionFor(devices: RawDevice[]): boolean {
  return devices.some((d) => d.rawLabel.length > 0)
}

function formatDeviceLabel(
  device: RawDevice,
  fallback: string,
  index: number
): string {
  return device.rawLabel || `${fallback} ${index + 1}`
}

function getMicMonitorErrorMessage(error: unknown): string {
  const name = (error as { name?: string })?.name
  if (name === "NotAllowedError" || name === "SecurityError") {
    return "Microphone access is required to test your mic."
  }
  if (name === "NotFoundError" || name === "OverconstrainedError") {
    return "No microphone input is available on this device."
  }
  const message = (error as { message?: string })?.message
  return message || "Unable to start mic test."
}

export function VoiceVideoPanel({ voiceRuntime }: VoiceVideoPanelProps) {
  const { user } = useAuth() as { user: { id?: string } | null }
  const userId = user?.id ?? null

  // Snapshot of which mute/deafen toggles the panel applied to isolate
  // the mic test, so stopping the test can restore the pre-test state
  // even if voiceRuntime props churn while the test is running.
  const isolationRef = React.useRef<IsolationSnapshot | null>(null)
  // Always read the latest voiceRuntime in async callbacks so we don't
  // capture stale values across the await of `startMicMonitor`.
  const voiceRuntimeRef = React.useRef<VoiceRuntime | null>(
    voiceRuntime ?? null
  )
  React.useEffect(() => {
    voiceRuntimeRef.current = voiceRuntime ?? null
  }, [voiceRuntime])

  const [deviceList, setDeviceList] =
    React.useState<DeviceList>(EMPTY_DEVICE_LIST)
  const [permissionError, setPermissionError] = React.useState<string | null>(
    null
  )
  const [prefs, setPrefs] = React.useState<VoiceDevicePrefs | null>(null)
  const [filterSettings, setFilterSettingsState] =
    React.useState<MicFilterSettings>(() => getMicFilterSettings())

  const {
    isTesting: isMicTesting,
    level: micLevel,
    gateOpen: isGateOpen,
    error: micTestError,
    setError: setMicTestError,
    start: startMicMonitor,
    stop: stopMicMonitor,
    updateSettings: updateMicMonitorSettings,
  } = useMicMonitor() as {
    isTesting: boolean
    level: number
    gateOpen: boolean
    error: Error | null
    setError: (error: Error | null) => void
    start: (options: {
      deviceId: string | null
      settings: MicFilterSettings
    }) => Promise<void>
    stop: () => Promise<void>
    updateSettings: (settings: MicFilterSettings) => void
  }

  React.useEffect(() => {
    if (!userId) return
    let cancelled = false
    void readVoiceDevicePrefs(userId).then((stored) => {
      if (!cancelled) setPrefs(stored)
    })
    return () => {
      cancelled = true
    }
  }, [userId])

  const refreshDevices = React.useCallback(async () => {
    try {
      const result = await enumerateDevicesRaw()
      setDeviceList(result)
      return result
    } catch (error) {
      setPermissionError(
        error instanceof Error
          ? error.message
          : "Failed to enumerate media devices."
      )
      return null
    }
  }, [])

  React.useEffect(() => {
    void refreshDevices()
  }, [refreshDevices])

  const restoreVoiceAfterMicTest = React.useCallback(async () => {
    const snapshot = isolationRef.current
    isolationRef.current = null
    if (!snapshot) return
    const runtime = voiceRuntimeRef.current
    if (!runtime?.isInVoice) return
    if (snapshot.appliedDeafen) {
      await Promise.resolve(runtime.onDeafen())
      return
    }
    if (snapshot.appliedMute) {
      await Promise.resolve(runtime.onMute())
    }
  }, [])

  const isolateVoiceForMicTest = React.useCallback(async () => {
    const runtime = voiceRuntimeRef.current
    if (!runtime?.isInVoice) return
    const snapshot: IsolationSnapshot = {
      appliedDeafen: false,
      appliedMute: false,
    }
    isolationRef.current = snapshot
    if (!runtime.isDeafened) {
      snapshot.appliedDeafen = true
      await Promise.resolve(runtime.onDeafen())
      return
    }
    if (!runtime.isMuted) {
      snapshot.appliedMute = true
      await Promise.resolve(runtime.onMute())
    }
  }, [])

  React.useEffect(() => {
    return () => {
      void stopMicMonitor().then(() => restoreVoiceAfterMicTest())
    }
  }, [stopMicMonitor, restoreVoiceAfterMicTest])

  const persistPrefs = React.useCallback(
    async (next: Partial<VoiceDevicePrefs>) => {
      if (!userId) return
      const merged: Omit<VoiceDevicePrefs, "updatedAt"> = {
        audioDeviceId: prefs?.audioDeviceId ?? null,
        videoDeviceId: prefs?.videoDeviceId ?? null,
        outputDeviceId: prefs?.outputDeviceId ?? null,
        audioEnabled: prefs?.audioEnabled ?? true,
        videoEnabled: prefs?.videoEnabled ?? false,
        dontAskAgain: prefs?.dontAskAgain ?? false,
        ...next,
      }
      setPrefs({ ...merged, updatedAt: Date.now() })
      await saveVoiceDevicePrefs(userId, merged)
    },
    [prefs, userId]
  )

  const handleAudioDeviceChange = React.useCallback(
    async (value: string) => {
      const nextId = value === DEFAULT_OPTION_VALUE ? null : value
      await persistPrefs({ audioDeviceId: nextId })
      if (!isMicTesting) return
      try {
        await stopMicMonitor()
        await startMicMonitor({
          deviceId: nextId,
          settings: filterSettings,
        })
      } catch (error) {
        // Mid-test mic switch failed — restore the room to its
        // pre-test state instead of leaving the user silently
        // deafened/muted.
        await stopMicMonitor()
        await restoreVoiceAfterMicTest()
        setMicTestError(new Error(getMicMonitorErrorMessage(error)))
      }
    },
    [
      filterSettings,
      isMicTesting,
      persistPrefs,
      restoreVoiceAfterMicTest,
      setMicTestError,
      startMicMonitor,
      stopMicMonitor,
    ]
  )

  const handleVideoDeviceChange = React.useCallback(
    async (value: string) => {
      const nextId = value === DEFAULT_OPTION_VALUE ? null : value
      await persistPrefs({ videoDeviceId: nextId })
    },
    [persistPrefs]
  )

  const applyFilters = React.useCallback(
    (next: Partial<MicFilterSettings>) => {
      const normalized = setMicFilterSettings(next)
      setFilterSettingsState(normalized)
      updateMicMonitorSettings(normalized)
      voiceRuntimeRef.current?.onMicFilterSettingsChange(normalized)
      return normalized
    },
    [updateMicMonitorSettings]
  )

  const handleGrantPermission = React.useCallback(
    async (kind: "audio" | "video") => {
      try {
        await requestMediaPermission(kind)
        setPermissionError(null)
        await refreshDevices()
      } catch (error) {
        setPermissionError(
          error instanceof Error
            ? error.message
            : "Permission denied."
        )
      }
    },
    [refreshDevices]
  )

  const handleMicTestToggle = React.useCallback(async () => {
    if (isMicTesting) {
      await stopMicMonitor()
      await restoreVoiceAfterMicTest()
      return
    }
    try {
      await isolateVoiceForMicTest()
      await startMicMonitor({
        deviceId: prefs?.audioDeviceId ?? null,
        settings: filterSettings,
      })
      // Refresh labels (post-permission they become populated).
      await refreshDevices()
    } catch (error) {
      await restoreVoiceAfterMicTest()
      setMicTestError(new Error(getMicMonitorErrorMessage(error)))
    }
  }, [
    filterSettings,
    isMicTesting,
    isolateVoiceForMicTest,
    prefs?.audioDeviceId,
    refreshDevices,
    restoreVoiceAfterMicTest,
    setMicTestError,
    startMicMonitor,
    stopMicMonitor,
  ])

  const audioGranted = hasPermissionFor(deviceList.audio)
  const videoGranted = hasPermissionFor(deviceList.video)
  const audioValue = prefs?.audioDeviceId ?? DEFAULT_OPTION_VALUE
  const videoValue = prefs?.videoDeviceId ?? DEFAULT_OPTION_VALUE
  const meterPercent = Math.max(0, Math.min(100, micLevel))

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold">Voice & video</h2>
        <p className="text-sm text-muted-foreground">
          Pick the input devices, tune your mic processing, and verify
          everything before you join a call.
        </p>
      </div>

      <Separator />

      <DeviceCard
        title="Devices"
        description="Apply to every voice channel you join from this browser."
      >
        <DeviceRow
          icon={<MicIcon className="size-4" />}
          label="Microphone"
          control={
            audioGranted ? (
              <Select
                value={audioValue}
                onValueChange={handleAudioDeviceChange}
                disabled={!userId}
              >
                <SelectTrigger
                  aria-label="Microphone"
                  className="w-full sm:w-72"
                >
                  <SelectValue placeholder="Default" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={DEFAULT_OPTION_VALUE}>Default</SelectItem>
                  {deviceList.audio.map((d, index) => (
                    <SelectItem key={d.deviceId} value={d.deviceId}>
                      {formatDeviceLabel(d, "Microphone", index)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Button
                type="button"
                variant="outline"
                onClick={() => handleGrantPermission("audio")}
              >
                Grant microphone access
              </Button>
            )
          }
        />
        <Separator />
        <DeviceRow
          icon={<VideoIcon className="size-4" />}
          label="Camera"
          control={
            videoGranted ? (
              <Select
                value={videoValue}
                onValueChange={handleVideoDeviceChange}
                disabled={!userId}
              >
                <SelectTrigger
                  aria-label="Camera"
                  className="w-full sm:w-72"
                >
                  <SelectValue placeholder="Default" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={DEFAULT_OPTION_VALUE}>Default</SelectItem>
                  {deviceList.video.map((d, index) => (
                    <SelectItem key={d.deviceId} value={d.deviceId}>
                      {formatDeviceLabel(d, "Camera", index)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Button
                type="button"
                variant="outline"
                onClick={() => handleGrantPermission("video")}
              >
                Grant camera access
              </Button>
            )
          }
        />
        {permissionError ? (
          <p role="alert" className="text-xs text-destructive">
            {permissionError}
          </p>
        ) : null}
      </DeviceCard>

      <DeviceCard
        title="Audio filters"
        description="Filters the published mic stream before it goes to the room."
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-medium">Noise gate</span>
            <span className="text-xs text-muted-foreground">
              Suppress background hiss when you are not speaking.
            </span>
          </div>
          <Switch
            checked={filterSettings.noiseGateEnabled}
            onCheckedChange={(checked) =>
              applyFilters({ noiseGateEnabled: checked })
            }
            aria-label="Noise gate"
          />
        </div>
        <Separator />
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="noise-gate-threshold" className="text-sm">
              Sensitivity threshold
            </Label>
            <span className="font-mono text-xs text-muted-foreground">
              {filterSettings.noiseGateThresholdDb} dB
            </span>
          </div>
          <Slider
            id="noise-gate-threshold"
            min={MIC_GATE_THRESHOLD_MIN_DB}
            max={MIC_GATE_THRESHOLD_MAX_DB}
            step={MIC_GATE_THRESHOLD_STEP_DB}
            value={[filterSettings.noiseGateThresholdDb]}
            disabled={!filterSettings.noiseGateEnabled}
            onValueChange={(values) =>
              applyFilters({
                noiseGateThresholdDb:
                  values[0] ?? DEFAULT_MIC_FILTER_SETTINGS.noiseGateThresholdDb,
              })
            }
            aria-label="Sensitivity threshold"
          />
          <div className="flex justify-between text-[10px] uppercase tracking-wide text-muted-foreground">
            <span>More open</span>
            <span>More aggressive</span>
          </div>
        </div>
      </DeviceCard>

      <DeviceCard
        title="Mic test"
        description="Hear your mic locally while you tune the filters."
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-medium">Local monitor</span>
            <span className="text-xs text-muted-foreground">
              {voiceRuntime?.isInVoice
                ? "While active, Hush deafens the room and the local loopback is the only audible path."
                : "Plays only on this device. Does not publish to any room."}
            </span>
          </div>
          <Button
            type="button"
            variant={isMicTesting ? "secondary" : "default"}
            onClick={handleMicTestToggle}
          >
            {isMicTesting ? "Stop test" : "Start test"}
          </Button>
        </div>
        <div
          className="relative h-2 overflow-hidden rounded-full bg-muted"
          aria-label="Microphone input level"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={meterPercent}
        >
          <div
            className={
              "h-full rounded-full will-change-transform " +
              (isMicTesting && isGateOpen
                ? "bg-primary"
                : "bg-muted-foreground/40")
            }
            style={{ width: `${meterPercent}%` }}
          />
        </div>
        <span className="text-xs text-muted-foreground">
          {isMicTesting
            ? `Monitoring locally · ${
                filterSettings.noiseGateEnabled
                  ? isGateOpen
                    ? "gate open"
                    : "gate closed"
                  : "gate disabled"
              }`
            : "Start the test to hear your mic locally while you adjust the filter."}
        </span>
        {micTestError ? (
          <p role="alert" className="text-xs text-destructive">
            {micTestError.message}
          </p>
        ) : null}
      </DeviceCard>
    </div>
  )
}

interface DeviceCardProps {
  title: string
  description: string
  children: React.ReactNode
}

function DeviceCard({ title, description, children }: DeviceCardProps) {
  return (
    <section className="flex flex-col gap-3">
      <header className="flex flex-col gap-0.5">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {title}
        </h3>
        <p className="text-xs text-muted-foreground">{description}</p>
      </header>
      <div className="flex flex-col gap-3 rounded-lg border bg-card p-4">
        {children}
      </div>
    </section>
  )
}

interface DeviceRowProps {
  icon: React.ReactNode
  label: string
  control: React.ReactNode
}

function DeviceRow({ icon, label, control }: DeviceRowProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground">{icon}</span>
        <span className="text-sm font-medium">{label}</span>
      </div>
      {control}
    </div>
  )
}
