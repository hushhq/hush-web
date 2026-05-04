import { useId } from "react"
import { useTracks } from "@livekit/components-react"
import { Track } from "livekit-client"

import { ParticipantTile } from "@/components/video/participant-tile"
import { cn } from "@/lib/utils"

interface SpeakerViewProps {
  className?: string
  emptyLabel?: string
}

export function SpeakerView({
  className,
  emptyLabel = "Waiting for participants...",
}: SpeakerViewProps) {
  const speakerId = useId()
  const trackRefs = useTracks(
    [{ source: Track.Source.Camera, withPlaceholder: true }],
    { onlySubscribed: false }
  )

  if (trackRefs.length === 0) {
    return (
      <div
        className={cn(
          "flex h-full items-center justify-center text-muted-foreground",
          className
        )}
      >
        <p className="text-sm">{emptyLabel}</p>
      </div>
    )
  }

  const sorted = [...trackRefs].sort((a, b) => {
    if (a.participant.isSpeaking && !b.participant.isSpeaking) return -1
    if (!a.participant.isSpeaking && b.participant.isSpeaking) return 1
    return 0
  })

  const [active, ...others] = sorted

  return (
    <div className={cn("flex h-full flex-col gap-2", className)}>
      <div className="min-h-0 flex-1">
        <ParticipantTile
          key={`${speakerId}-spotlight-${active.participant.sid}`}
          trackRef={active}
          className="h-full w-full"
        />
      </div>
      {others.length > 0 ? (
        <div className="flex h-28 shrink-0 gap-2 overflow-x-auto">
          {others.map((trackRef) => (
            <ParticipantTile
              key={`${speakerId}-thumb-${trackRef.participant.sid}`}
              trackRef={trackRef}
              className="aspect-video h-full w-auto shrink-0"
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}
