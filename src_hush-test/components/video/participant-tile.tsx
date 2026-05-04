import * as React from "react"
import { MicOffIcon } from "lucide-react"
import type { TrackReferenceOrPlaceholder } from "@livekit/components-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface ParticipantTileProps {
  trackRef: TrackReferenceOrPlaceholder
  className?: string
  selfLabel?: string
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export function ParticipantTile({
  trackRef,
  className,
  selfLabel,
}: ParticipantTileProps) {
  const videoRef = React.useRef<HTMLVideoElement>(null)
  const participant = trackRef.participant
  const publication = trackRef.publication
  const track = publication?.track
  const isSpeaking = participant.isSpeaking
  const isMuted = participant.isMicrophoneEnabled === false
  const isLocal = participant.isLocal
  const displayName = participant.name ?? participant.identity ?? "Guest"
  const hasVideo = Boolean(track) && publication?.isMuted === false

  React.useEffect(() => {
    const node = videoRef.current
    if (!node || !track) return
    track.attach(node)
    return () => {
      track.detach(node)
    }
  }, [track])

  return (
    <div
      data-lk-speaking={isSpeaking ? "true" : undefined}
      data-lk-local-participant={isLocal ? "true" : undefined}
      data-lk-audio-muted={isMuted ? "true" : undefined}
      className={cn(
        "relative flex aspect-video items-center justify-center overflow-hidden rounded-lg border bg-card transition-all",
        isSpeaking
          ? "border-primary/50 animate-[voice-pulse_1.6s_ease-in-out_infinite]"
          : "border-border",
        className
      )}
    >
      {hasVideo ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={isLocal}
          className="absolute inset-0 size-full object-cover"
        />
      ) : (
        <div className="flex flex-col items-center gap-2">
          <Avatar className="size-14 rounded-full">
            <AvatarFallback className="rounded-full text-sm font-semibold">
              {getInitials(displayName)}
            </AvatarFallback>
          </Avatar>
          <span className="lk-participant-name truncate text-sm font-medium">
            {displayName}
          </span>
        </div>
      )}

      {hasVideo ? (
        <div className="absolute inset-x-0 bottom-0 flex items-center gap-2 bg-gradient-to-t from-black/70 to-transparent px-3 py-2">
          {isSpeaking ? (
            <span className="size-2 shrink-0 rounded-full bg-success" />
          ) : null}
          <span className="truncate text-xs font-medium text-white">
            {displayName}
          </span>
        </div>
      ) : null}

      {isMuted ? (
        <span className="absolute top-2 right-2 flex size-6 items-center justify-center rounded-full bg-destructive/15 text-destructive">
          <MicOffIcon className="size-3.5" />
        </span>
      ) : null}

      {isLocal ? (
        <span className="absolute top-2 left-2 rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
          {selfLabel ?? "you"}
        </span>
      ) : null}
    </div>
  )
}
