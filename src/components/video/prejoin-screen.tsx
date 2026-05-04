import * as React from "react"
import { MicIcon, MicOffIcon, VideoIcon, VideoOffIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

export interface JoinSettings {
  audioDeviceId: string | undefined
  videoDeviceId: string | undefined
  audioEnabled: boolean
  videoEnabled: boolean
}

interface PrejoinScreenProps {
  roomName: string
  onJoin: (settings: JoinSettings) => void
  className?: string
}

interface MediaDeviceOption {
  deviceId: string
  label: string
}

export function PrejoinScreen({
  roomName,
  onJoin,
  className,
}: PrejoinScreenProps) {
  const audioSelectId = React.useId()
  const videoSelectId = React.useId()
  const videoRef = React.useRef<HTMLVideoElement>(null)
  const streamRef = React.useRef<MediaStream | null>(null)

  const [audioDevices, setAudioDevices] = React.useState<MediaDeviceOption[]>([])
  const [videoDevices, setVideoDevices] = React.useState<MediaDeviceOption[]>([])
  const [selectedAudioId, setSelectedAudioId] = React.useState<string | undefined>()
  const [selectedVideoId, setSelectedVideoId] = React.useState<string | undefined>()
  const [audioEnabled, setAudioEnabled] = React.useState(true)
  const [videoEnabled, setVideoEnabled] = React.useState(true)
  const [isLoadingDevices, setIsLoadingDevices] = React.useState(true)

  const enumerateDevices = React.useCallback(async () => {
    setIsLoadingDevices(true)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      })
      const devices = await navigator.mediaDevices.enumerateDevices()

      const audioInputs = devices
        .filter((d) => d.kind === "audioinput" && d.deviceId)
        .map((d) => ({ deviceId: d.deviceId, label: d.label || "Microphone" }))
      const videoInputs = devices
        .filter((d) => d.kind === "videoinput" && d.deviceId)
        .map((d) => ({ deviceId: d.deviceId, label: d.label || "Camera" }))

      setAudioDevices(audioInputs)
      setVideoDevices(videoInputs)

      setSelectedAudioId((prev) => prev ?? audioInputs[0]?.deviceId)
      setSelectedVideoId((prev) => prev ?? videoInputs[0]?.deviceId)

      stream.getTracks().forEach((t) => t.stop())
    } catch {
      // permissions denied or no devices
    } finally {
      setIsLoadingDevices(false)
    }
  }, [])

  React.useEffect(() => {
    enumerateDevices()
  }, [enumerateDevices])

  React.useEffect(() => {
    if (!videoEnabled || !selectedVideoId) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop())
        streamRef.current = null
      }
      return
    }

    let cancelled = false

    async function startPreview() {
      try {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((t) => t.stop())
        }
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { deviceId: { exact: selectedVideoId } },
        })
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop())
          return
        }
        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      } catch {
        // camera unavailable
      }
    }

    startPreview()

    return () => {
      cancelled = true
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop())
        streamRef.current = null
      }
    }
  }, [videoEnabled, selectedVideoId])

  function handleJoin() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop())
      streamRef.current = null
    }
    onJoin({
      audioDeviceId: selectedAudioId,
      videoDeviceId: selectedVideoId,
      audioEnabled,
      videoEnabled,
    })
  }

  return (
    <div className={cn("flex h-full items-center justify-center p-4", className)}>
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Join voice channel: {roomName}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
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
              <div className="flex h-full items-center justify-center text-muted-foreground">
                <p className="text-sm">Camera off</p>
              </div>
            )}
          </div>

          {isLoadingDevices ? (
            <div className="flex items-center justify-center py-4 text-sm text-muted-foreground">
              <div className="mr-2 size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Loading devices...
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <DeviceRow
                id={audioSelectId}
                label="Microphone"
                devices={audioDevices}
                value={selectedAudioId}
                onChange={setSelectedAudioId}
                enabled={audioEnabled}
                onToggle={() => setAudioEnabled((p) => !p)}
                onIcon={<MicIcon />}
                offIcon={<MicOffIcon />}
                placeholder="Select microphone"
              />
              <DeviceRow
                id={videoSelectId}
                label="Camera"
                devices={videoDevices}
                value={selectedVideoId}
                onChange={setSelectedVideoId}
                enabled={videoEnabled}
                onToggle={() => setVideoEnabled((p) => !p)}
                onIcon={<VideoIcon />}
                offIcon={<VideoOffIcon />}
                placeholder="Select camera"
              />
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={handleJoin} className="w-full" size="lg">
            Join call
          </Button>
        </CardFooter>
      </Card>
    </div>
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
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger id={id} className="flex-1">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {devices.map((device) => (
              <SelectItem key={`${id}-${device.deviceId}`} value={device.deviceId}>
                {device.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
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
