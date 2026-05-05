import * as React from "react"
import { MicIcon, MicOffIcon, VideoIcon, VideoOffIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

/**
 * User-confirmed selection emitted by the prejoin dialog. The
 * orchestrator persists this through `saveVoiceDevicePrefs` and feeds
 * the chosen ids to `connectRoom` / `publishMic` / `publishWebcam`.
 */
export interface VoicePrejoinChoice {
  audioDeviceId: string | null
  videoDeviceId: string | null
  audioEnabled: boolean
  videoEnabled: boolean
  dontAskAgain: boolean
}

interface VoicePrejoinDialogProps {
  channelName: string
  open: boolean
  onConfirm: (choice: VoicePrejoinChoice) => void
  onCancel: () => void
  /** Initial selection seeded from `voiceDevicePrefs`, when present. */
  initial?: Partial<VoicePrejoinChoice>
}

interface MediaDeviceOption {
  deviceId: string
  label: string
}

async function enumerate(): Promise<{
  audio: MediaDeviceOption[]
  video: MediaDeviceOption[]
}> {
  const probe = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true,
  })
  const devices = await navigator.mediaDevices.enumerateDevices()
  probe.getTracks().forEach((t) => t.stop())
  const toOption = (label: string) => (d: MediaDeviceInfo) => ({
    deviceId: d.deviceId,
    label: d.label || label,
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

export function VoicePrejoinDialog({
  channelName,
  open,
  onConfirm,
  onCancel,
  initial,
}: VoicePrejoinDialogProps) {
  const audioId = React.useId()
  const videoId = React.useId()
  const videoRef = React.useRef<HTMLVideoElement>(null)
  const previewStreamRef = React.useRef<MediaStream | null>(null)

  const [audioDevices, setAudioDevices] = React.useState<MediaDeviceOption[]>([])
  const [videoDevices, setVideoDevices] = React.useState<MediaDeviceOption[]>([])
  const [audioDeviceId, setAudioDeviceId] = React.useState<string | undefined>(
    initial?.audioDeviceId ?? undefined
  )
  const [videoDeviceId, setVideoDeviceId] = React.useState<string | undefined>(
    initial?.videoDeviceId ?? undefined
  )
  const [audioEnabled, setAudioEnabled] = React.useState(
    initial?.audioEnabled ?? true
  )
  const [videoEnabled, setVideoEnabled] = React.useState(
    initial?.videoEnabled ?? false
  )
  const [dontAskAgain, setDontAskAgain] = React.useState(
    initial?.dontAskAgain ?? false
  )
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (!open) return
    let cancelled = false
    setIsLoading(true)
    setError(null)
    enumerate()
      .then((result) => {
        if (cancelled) return
        setAudioDevices(result.audio)
        setVideoDevices(result.video)
        setAudioDeviceId((prev) => prev ?? result.audio[0]?.deviceId)
        setVideoDeviceId((prev) => prev ?? result.video[0]?.deviceId)
      })
      .catch((err) => {
        if (cancelled) return
        setError(
          err instanceof Error
            ? err.message
            : "Microphone or camera permission was denied."
        )
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [open])

  React.useEffect(() => {
    if (!open || !videoEnabled || !videoDeviceId) {
      stopPreview(previewStreamRef)
      return
    }
    let cancelled = false
    void startPreview(videoDeviceId, previewStreamRef, videoRef, () => cancelled)
    return () => {
      cancelled = true
      stopPreview(previewStreamRef)
    }
  }, [open, videoEnabled, videoDeviceId])

  function handleConfirm() {
    stopPreview(previewStreamRef)
    onConfirm({
      audioDeviceId: audioEnabled ? (audioDeviceId ?? null) : null,
      videoDeviceId: videoEnabled ? (videoDeviceId ?? null) : null,
      audioEnabled,
      videoEnabled,
      dontAskAgain,
    })
  }

  function handleOpenChange(next: boolean) {
    if (!next) {
      stopPreview(previewStreamRef)
      onCancel()
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Join voice channel</DialogTitle>
          <DialogDescription>
            Confirm your microphone and camera before joining {channelName}.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-5">
          <div className="relative aspect-video overflow-hidden rounded-lg border bg-muted">
            {videoEnabled ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="h-full w-full object-cover"
                style={{ transform: "scaleX(-1)" }}
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                Camera off
              </div>
            )}
          </div>

          {error ? (
            <p className="text-sm text-destructive">{error}</p>
          ) : isLoading ? (
            <p className="text-sm text-muted-foreground">Loading devices…</p>
          ) : (
            <>
              <DeviceRow
                id={audioId}
                label="Microphone"
                devices={audioDevices}
                value={audioDeviceId}
                onChange={setAudioDeviceId}
                enabled={audioEnabled}
                onToggle={() => setAudioEnabled((v) => !v)}
                onIcon={<MicIcon />}
                offIcon={<MicOffIcon />}
                placeholder="Select microphone"
              />
              <DeviceRow
                id={videoId}
                label="Camera"
                devices={videoDevices}
                value={videoDeviceId}
                onChange={setVideoDeviceId}
                enabled={videoEnabled}
                onToggle={() => setVideoEnabled((v) => !v)}
                onIcon={<VideoIcon />}
                offIcon={<VideoOffIcon />}
                placeholder="Select camera"
              />
            </>
          )}

          <label
            className="flex items-center gap-2 text-sm text-muted-foreground"
            htmlFor="prejoin-dont-ask"
          >
            <Checkbox
              id="prejoin-dont-ask"
              checked={dontAskAgain}
              onCheckedChange={(v) => setDontAskAgain(v === true)}
            />
            <span>Don't ask again on this device</span>
          </label>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={isLoading || error != null}>
            Join call
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface DeviceRowProps {
  id: string
  label: string
  devices: MediaDeviceOption[]
  value: string | undefined
  onChange: (value: string) => void
  enabled: boolean
  onToggle: () => void
  onIcon: React.ReactNode
  offIcon: React.ReactNode
  placeholder: string
}

function DeviceRow({
  id,
  label,
  devices,
  value,
  onChange,
  enabled,
  onToggle,
  onIcon,
  offIcon,
  placeholder,
}: DeviceRowProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <Select value={value} onValueChange={onChange} disabled={!enabled}>
          <SelectTrigger id={id} className={cn("flex-1", !enabled && "opacity-60")}>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {devices.map((device) => (
              <SelectItem key={device.deviceId} value={device.deviceId}>
                {device.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          type="button"
          variant={enabled ? "secondary" : "destructive"}
          size="icon"
          onClick={onToggle}
          aria-label={`${enabled ? "Disable" : "Enable"} ${label.toLowerCase()}`}
        >
          {enabled ? onIcon : offIcon}
        </Button>
      </div>
    </div>
  )
}

async function startPreview(
  deviceId: string,
  streamRef: React.MutableRefObject<MediaStream | null>,
  videoRef: React.RefObject<HTMLVideoElement | null>,
  cancelled: () => boolean
) {
  try {
    stopPreview(streamRef)
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { deviceId: { exact: deviceId } },
    })
    if (cancelled()) {
      stream.getTracks().forEach((t) => t.stop())
      return
    }
    streamRef.current = stream
    if (videoRef.current) videoRef.current.srcObject = stream
  } catch {
    // camera unavailable; preview stays blank, user can still join
  }
}

function stopPreview(streamRef: React.MutableRefObject<MediaStream | null>) {
  if (!streamRef.current) return
  streamRef.current.getTracks().forEach((t) => t.stop())
  streamRef.current = null
}
