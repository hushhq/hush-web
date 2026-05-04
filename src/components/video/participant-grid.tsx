import { useId } from "react"
import { useTracks } from "@livekit/components-react"
import { Track } from "livekit-client"

import { ParticipantTile } from "@/components/video/participant-tile"
import { cn } from "@/lib/utils"

interface ParticipantGridProps {
  className?: string
  emptyLabel?: string
}

function getGridCols(count: number): string {
  if (count <= 1) return "grid-cols-1"
  if (count <= 4) return "grid-cols-2"
  if (count <= 9) return "grid-cols-3"
  return "grid-cols-4"
}

export function ParticipantGrid({
  className,
  emptyLabel = "Waiting for participants...",
}: ParticipantGridProps) {
  const gridId = useId()
  const trackRefs = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
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

  const gridCols = getGridCols(trackRefs.length)

  return (
    <div
      className={cn(
        "grid auto-rows-fr gap-3",
        gridCols,
        className
      )}
    >
      {trackRefs.map((trackRef) => (
        <ParticipantTile
          key={`${gridId}-${trackRef.participant.sid}-${trackRef.source}`}
          trackRef={trackRef}
        />
      ))}
    </div>
  )
}
