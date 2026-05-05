import * as React from "react"
import {
  ChevronDownIcon,
  HeadphoneOffIcon,
  HeadphonesIcon,
  MicIcon,
  MicOffIcon,
  PhoneOffIcon,
  ScreenShareIcon,
  ScreenShareOffIcon,
  SwitchCameraIcon,
  VideoIcon,
  VideoOffIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { IS_SCREEN_SHARE_SUPPORTED, QUALITY_PRESETS } from "@/utils/constants"
import { cn } from "@/lib/utils"

interface VoiceControlsBarProps {
  isReady: boolean
  isMicOn: boolean
  isDeafened: boolean
  isWebcamOn: boolean
  isScreenSharing: boolean
  qualityKey: keyof typeof QUALITY_PRESETS
  onToggleMic: () => void
  onToggleDeafen: () => void
  onToggleWebcam: () => void
  onToggleScreen: () => void
  onSwitchScreenSource: () => void
  onPickMicDevice: () => void
  onPickWebcamDevice: () => void
  onLeave: () => void
}

/**
 * Floating controls bar for the voice channel. Mounted absolutely
 * above the participant grid (Card + 5 primary buttons + chevron
 * device pickers + leave). Mirrors the legacy Controls.jsx feature set
 * (mic / deafen / camera / screen / leave + chevron-attached device
 * switch + screen-share quality tag) under a single shadcn surface.
 */
export function VoiceControlsBar({
  isReady,
  isMicOn,
  isDeafened,
  isWebcamOn,
  isScreenSharing,
  qualityKey,
  onToggleMic,
  onToggleDeafen,
  onToggleWebcam,
  onToggleScreen,
  onSwitchScreenSource,
  onPickMicDevice,
  onPickWebcamDevice,
  onLeave,
}: VoiceControlsBarProps) {
  const screenSupported = IS_SCREEN_SHARE_SUPPORTED
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-3 z-20 flex justify-center px-3">
      <Card className="pointer-events-auto flex h-14 flex-row items-center gap-1.5 rounded-full border bg-background/95 px-3 py-0 backdrop-blur ring-0">
        <SplitButton
          active={isMicOn}
          activeVariant="default"
          inactiveVariant="destructive"
          disabled={!isReady}
          ariaLabel={isMicOn ? "Mute microphone" : "Unmute microphone"}
          onClick={onToggleMic}
          onChevron={onPickMicDevice}
          chevronAriaLabel="Change microphone"
        >
          {isMicOn ? <MicIcon /> : <MicOffIcon />}
        </SplitButton>

        <ToggleButton
          active={isDeafened}
          activeVariant="destructive"
          inactiveVariant="secondary"
          ariaLabel={isDeafened ? "Undeafen" : "Deafen"}
          onClick={onToggleDeafen}
        >
          {isDeafened ? <HeadphoneOffIcon /> : <HeadphonesIcon />}
        </ToggleButton>

        <SplitButton
          active={isWebcamOn}
          activeVariant="default"
          inactiveVariant="secondary"
          disabled={!isReady}
          ariaLabel={isWebcamOn ? "Stop video" : "Start video"}
          onClick={onToggleWebcam}
          onChevron={onPickWebcamDevice}
          chevronAriaLabel="Change camera"
        >
          {isWebcamOn ? <VideoIcon /> : <VideoOffIcon />}
        </SplitButton>

        {screenSupported ? (
          <ToggleButton
            active={isScreenSharing}
            activeVariant="default"
            inactiveVariant="secondary"
            disabled={!isReady}
            ariaLabel={isScreenSharing ? "Stop sharing" : "Share screen"}
            onClick={onToggleScreen}
          >
            {isScreenSharing ? <ScreenShareOffIcon /> : <ScreenShareIcon />}
          </ToggleButton>
        ) : null}

        {isScreenSharing ? (
          <Button
            type="button"
            size="icon"
            variant="secondary"
            aria-label="Switch shared window"
            title={`Sharing · ${QUALITY_PRESETS[qualityKey]?.label ?? qualityKey}`}
            className="size-10 rounded-full"
            onClick={onSwitchScreenSource}
          >
            <SwitchCameraIcon />
          </Button>
        ) : null}

        <div className="mx-1 h-6 w-px bg-border" />

        <Button
          type="button"
          size="icon"
          variant="destructive"
          aria-label="Leave call"
          className="size-10 rounded-full"
          onClick={onLeave}
        >
          <PhoneOffIcon />
        </Button>
      </Card>
    </div>
  )
}

interface ToggleButtonProps {
  active: boolean
  activeVariant: "default" | "destructive"
  inactiveVariant: "secondary" | "destructive"
  disabled?: boolean
  ariaLabel: string
  onClick: () => void
  children: React.ReactNode
}

function ToggleButton({
  active,
  activeVariant,
  inactiveVariant,
  disabled,
  ariaLabel,
  onClick,
  children,
}: ToggleButtonProps) {
  return (
    <Button
      type="button"
      size="icon"
      variant={active ? activeVariant : inactiveVariant}
      disabled={disabled}
      aria-label={ariaLabel}
      title={ariaLabel}
      className={cn("size-10 rounded-full")}
      onClick={onClick}
    >
      {children}
    </Button>
  )
}

interface SplitButtonProps extends ToggleButtonProps {
  onChevron: () => void
  chevronAriaLabel: string
}

function SplitButton({
  active,
  activeVariant,
  inactiveVariant,
  disabled,
  ariaLabel,
  onClick,
  onChevron,
  chevronAriaLabel,
  children,
}: SplitButtonProps) {
  return (
    <div
      className={cn(
        "flex items-center overflow-hidden rounded-full",
        active
          ? "bg-primary text-primary-foreground"
          : inactiveVariant === "destructive"
            ? "bg-destructive text-destructive-foreground"
            : "bg-secondary text-secondary-foreground"
      )}
    >
      <button
        type="button"
        disabled={disabled}
        aria-label={ariaLabel}
        title={ariaLabel}
        onClick={onClick}
        className={cn(
          "flex size-10 items-center justify-center transition-colors",
          "hover:bg-foreground/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          disabled && "cursor-not-allowed opacity-60"
        )}
      >
        <span className="grid size-5 place-content-center [&_svg]:size-5">
          {children}
        </span>
      </button>
      <button
        type="button"
        disabled={disabled}
        aria-label={chevronAriaLabel}
        title={chevronAriaLabel}
        onClick={(event) => {
          event.stopPropagation()
          onChevron()
        }}
        className={cn(
          "flex h-10 items-center px-2 transition-colors",
          "hover:bg-foreground/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          disabled && "cursor-not-allowed opacity-60"
        )}
      >
        <ChevronDownIcon className="size-3.5" />
      </button>
    </div>
  )
}
