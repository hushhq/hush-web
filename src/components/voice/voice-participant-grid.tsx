import { useTracks } from "@livekit/components-react"
import "@livekit/components-styles"
import { Track } from "livekit-client"

import { cn } from "@/lib/utils"
import { VoiceParticipantTile } from "./voice-participant-tile"
import { VoiceLonelyTile } from "./voice-lonely-tile"

interface VoiceParticipantGridProps {
  className?: string
}

/**
 * Layout pick: row count given a tile count, optimised for landscape
 * 16:9 webcam content. Stays vertical at 1–2 tiles so cells are wider
 * than they are tall, then expands to a 2-col grid for 3–4, 3-col for
 * 5–9, 4-col beyond. Keeps tiles roughly the same shape across counts.
 */
function pickGridShape(count: number): { cols: number; rows: number } {
  if (count <= 1) return { cols: 1, rows: 1 }
  if (count === 2) return { cols: 1, rows: 2 }
  if (count <= 4) return { cols: 2, rows: 2 }
  if (count <= 9) return { cols: 3, rows: 3 }
  return { cols: 4, rows: 4 }
}

/**
 * Voice channel participant grid.
 *
 * `useTracks` against the shared `RoomContext` (set by the voice
 * orchestrator over our MLS-aware `useRoom` Room) drives the tile
 * list. The default `GridLayout` from @livekit/components-react picks
 * a 2×1 layout for two participants on landscape screens — that shape
 * is fine for 4×3 webcams but reads poorly for 16:9 laptop / desktop
 * cameras stacked side-by-side. We render a custom CSS grid here
 * instead so every tile keeps a 16:9 aspect ratio and 2 tiles stack
 * vertically.
 *
 * When the user is alone (`tracks.length <= 1`), we sub in a "lonely"
 * tile beneath the user's own so the grid still shows two cells and
 * there is a visible cue that nobody else has joined yet.
 */
export function VoiceParticipantGrid({ className }: VoiceParticipantGridProps) {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false }
  )

  const isLonely = tracks.length <= 1
  const tileCount = isLonely ? 2 : tracks.length
  const { cols, rows } = pickGridShape(tileCount)

  // Tiles are locked to 16:9 via the grid container's aspect ratio:
  // every 1fr × 1fr cell resolves to a 16:9 box no matter how the
  // grid is scaled. `max-h-full max-w-full` clamps to the smaller
  // container dimension so we never overflow into a scroll. The
  // outer flex centres the grid in whatever room is left over.
  // Padding kept minimal so tiles claim as much real estate as the
  // channel view allows; the only gap that survives is the inter-tile
  // separation.
  const aspectRatio = `${cols * 16} / ${rows * 9}`
  return (
    <div
      className={cn(
        "flex size-full items-center justify-center",
        className
      )}
    >
      <div
        className="grid max-h-full max-w-full gap-2"
        style={{
          aspectRatio,
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
        }}
      >
        {tracks.map((trackRef, idx) => (
          <div
            key={`${trackRef.participant.identity}-${trackRef.source}-${idx}`}
            className="min-h-0 min-w-0"
          >
            <VoiceParticipantTile trackRef={trackRef} />
          </div>
        ))}
        {isLonely ? (
          <div className="min-h-0 min-w-0">
            <VoiceLonelyTile />
          </div>
        ) : null}
      </div>
    </div>
  )
}
