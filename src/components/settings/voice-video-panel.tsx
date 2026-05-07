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
 *
 * In-call mic-test isolation (legacy `voiceRuntime` deafen/mute on test
 * start, restore on stop) is intentionally deferred — the active voice
 * runtime is not yet exposed to the settings dialog tree. Until it is,
 * the mic test runs against a private AudioContext so it does not
 * interfere with a published mic, but the *user* still hears their own
 * voice in the room. Wire `voiceRuntime` through later.
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

interface MediaDeviceOption {
  deviceId: string
  label: string
}

interface MicFilterSettings {
  noiseGateEnabled: boolean
  noiseGateThresholdDb: number
}

interface DeviceList {
  audio: MediaDeviceOption[]
  video: MediaDeviceOption[]
}

const DEFAULT_OPTION_VALUE = "__default__"

async function enumerate(
  options: { withVideoLabels: boolean }
): Promise<DeviceList> {
  const constraints: MediaStreamConstraints = options.withVideoLabels
    ? { audio: true, video: true }
    : { audio: true }
  const probe = await navigator.mediaDevices.getUserMedia(constraints)
  probe.getTracks().forEach((track) => track.stop())
  const devices = await navigator.mediaDevices.enumerateDevices()
  const toOption =
    (fallback: string) =>
    (d: MediaDeviceInfo, index: number): MediaDeviceOption => ({
      deviceId: d.deviceId,
      label: d.label || `${fallback} ${index + 1}`,
    })
  return {
    audio: devices
      .filter((d) => d.kind === "audioinput" && d.deviceId)
      .map(toOption("Microphone")),
    video: devices
      .filter((d) => d.kind === "videoinput" && d.deviceId)
      .map(toOption("Camera")),
  }
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

export function VoiceVideoPanel() {
  const { user } = useAuth() as { user: { id?: string } | null }
  const userId = user?.id ?? null

  const [deviceList, setDeviceList] = React.useState<DeviceList>({
    audio: [],
    video: [],
  })
  const [permissionError, setPermissionError] = React.useState<string | null>(
    null
  )
  const [videoLabelsLoaded, setVideoLabelsLoaded] = React.useState(false)
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

  const ensureDevices = React.useCallback(
    async (wantsVideoLabels: boolean) => {
      try {
        const result = await enumerate({ withVideoLabels: wantsVideoLabels })
        setDeviceList(result)
        if (wantsVideoLabels) setVideoLabelsLoaded(true)
        setPermissionError(null)
        return result
      } catch (error) {
        setPermissionError(
          error instanceof Error
            ? error.message
            : "Microphone or camera permission was denied."
        )
        return null
      }
    },
    []
  )

  React.useEffect(() => {
    void ensureDevices(false)
  }, [ensureDevices])

  React.useEffect(() => {
    return () => {
      void stopMicMonitor()
    }
  }, [stopMicMonitor])

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
        setMicTestError(new Error(getMicMonitorErrorMessage(error)))
      }
    },
    [
      filterSettings,
      isMicTesting,
      persistPrefs,
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
      return normalized
    },
    [updateMicMonitorSettings]
  )

  const handleMicTestToggle = React.useCallback(async () => {
    if (isMicTesting) {
      await stopMicMonitor()
      return
    }
    try {
      await startMicMonitor({
        deviceId: prefs?.audioDeviceId ?? null,
        settings: filterSettings,
      })
      // Refresh labels (post-permission they become populated).
      await ensureDevices(false)
    } catch (error) {
      setMicTestError(new Error(getMicMonitorErrorMessage(error)))
    }
  }, [
    ensureDevices,
    filterSettings,
    isMicTesting,
    prefs?.audioDeviceId,
    setMicTestError,
    startMicMonitor,
    stopMicMonitor,
  ])

  const handleGrantCameraAccess = React.useCallback(async () => {
    if (videoLabelsLoaded) return
    await ensureDevices(true)
  }, [ensureDevices, videoLabelsLoaded])

  const audioValue = prefs?.audioDeviceId ?? DEFAULT_OPTION_VALUE
  const videoValue = prefs?.videoDeviceId ?? DEFAULT_OPTION_VALUE
  const showVideoGrant =
    deviceList.video.length === 0 ||
    (!videoLabelsLoaded && deviceList.video.every((d) => !d.label))
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
                {deviceList.audio.map((d) => (
                  <SelectItem key={d.deviceId} value={d.deviceId}>
                    {d.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          }
        />
        <Separator />
        <DeviceRow
          icon={<VideoIcon className="size-4" />}
          label="Camera"
          control={
            showVideoGrant ? (
              <Button
                type="button"
                variant="outline"
                onClick={handleGrantCameraAccess}
                disabled={!userId}
              >
                Grant camera access
              </Button>
            ) : (
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
                  {deviceList.video.map((d) => (
                    <SelectItem key={d.deviceId} value={d.deviceId}>
                      {d.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )
          }
        />
        {permissionError ? (
          <p
            role="alert"
            className="text-xs text-destructive"
          >
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
              Plays only on this device. Does not publish to any room.
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
              "h-full transition-[width] duration-75 ease-linear " +
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
