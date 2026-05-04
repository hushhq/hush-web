import * as React from "react"
import {
  MicIcon,
  MicOffIcon,
  VideoIcon,
  VideoOffIcon,
  ScreenShareIcon,
  ScreenShareOffIcon,
  PhoneOffIcon,
} from "lucide-react"
import {
  useLocalParticipant,
  useRoomContext,
} from "@livekit/components-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface ControlsBarProps {
  onLeave?: () => void
  className?: string
  showScreenShare?: boolean
  initialMicEnabled?: boolean
  initialCameraEnabled?: boolean
}

export function ControlsBar({
  onLeave,
  className,
  showScreenShare = true,
  initialMicEnabled = true,
  initialCameraEnabled = false,
}: ControlsBarProps) {
  const room = useRoomContext()
  const { localParticipant } = useLocalParticipant()

  const [micEnabled, setMicEnabled] = React.useState(initialMicEnabled)
  const [cameraEnabled, setCameraEnabled] = React.useState(initialCameraEnabled)
  const [screenEnabled, setScreenEnabled] = React.useState(false)

  async function toggleMic() {
    const next = !micEnabled
    setMicEnabled(next)
    try {
      await localParticipant.setMicrophoneEnabled(next)
    } catch {
      // offline / not connected — local state only
    }
  }

  async function toggleCamera() {
    const next = !cameraEnabled
    setCameraEnabled(next)
    try {
      await localParticipant.setCameraEnabled(next)
    } catch {
      // offline / not connected — local state only
    }
  }

  async function toggleScreen() {
    const next = !screenEnabled
    setScreenEnabled(next)
    try {
      await localParticipant.setScreenShareEnabled(next)
    } catch {
      // offline / not connected — local state only
    }
  }

  function handleLeave() {
    try {
      room.disconnect()
    } catch {
      // not connected
    }
    onLeave?.()
  }

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-x-0 bottom-2 z-20 flex justify-center",
        className
      )}
    >
      <Card className="pointer-events-auto h-14 flex-row items-center gap-2 rounded-lg border px-3 py-0 ring-0 dark:shadow-sm">
        <ControlButton
          active={micEnabled}
          activeVariant="secondary"
          inactiveVariant="destructive"
          onClick={toggleMic}
          ariaLabel={micEnabled ? "Mute" : "Unmute"}
        >
          {micEnabled ? <MicIcon /> : <MicOffIcon />}
        </ControlButton>
        <ControlButton
          active={cameraEnabled}
          activeVariant="default"
          inactiveVariant="secondary"
          onClick={toggleCamera}
          ariaLabel={cameraEnabled ? "Stop video" : "Start video"}
        >
          {cameraEnabled ? <VideoIcon /> : <VideoOffIcon />}
        </ControlButton>
        {showScreenShare ? (
          <ControlButton
            active={screenEnabled}
            activeVariant="default"
            inactiveVariant="secondary"
            onClick={toggleScreen}
            ariaLabel={screenEnabled ? "Stop sharing" : "Share screen"}
          >
            {screenEnabled ? <ScreenShareOffIcon /> : <ScreenShareIcon />}
          </ControlButton>
        ) : null}
        <Button
          variant="destructive"
          size="icon"
          className="size-10 [&_svg:not([class*='size-'])]:size-5"
          onClick={handleLeave}
          aria-label="Leave call"
        >
          <PhoneOffIcon />
        </Button>
      </Card>
    </div>
  )
}

interface ControlButtonProps {
  active: boolean
  activeVariant: "default" | "secondary"
  inactiveVariant: "secondary" | "destructive"
  onClick: () => void
  ariaLabel: string
  children: React.ReactNode
}

function ControlButton({
  active,
  activeVariant,
  inactiveVariant,
  onClick,
  ariaLabel,
  children,
}: ControlButtonProps) {
  const variant = active ? activeVariant : inactiveVariant
  return (
    <Button
      variant={variant}
      size="icon"
      className={cn(
        "size-10 [&_svg:not([class*='size-'])]:size-5",
        variant === "secondary" && "hover:bg-foreground/10 hover:text-foreground",
        variant === "default" && "hover:bg-foreground/80"
      )}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {children}
    </Button>
  )
}
