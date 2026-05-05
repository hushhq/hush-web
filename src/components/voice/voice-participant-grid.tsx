import * as React from "react"
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

  // Compute the largest 16:9-cell grid that fits inside the container.
  // CSS `aspect-ratio` + `max-h-full max-w-full` only sets upper
  // bounds: with no explicit width/height the grid sizes to its
  // intrinsic content (which for a flexible 1fr × 1fr grid is the
  // children's min-content), far smaller than the container. We
  // therefore measure the parent and set explicit pixel dimensions
  // so the grid always claims the full available real estate.
  const wrapperRef = React.useRef<HTMLDivElement>(null)
  const [box, setBox] = React.useState({ width: 0, height: 0 })
  React.useEffect(() => {
    const node = wrapperRef.current
    if (!node || typeof ResizeObserver === "undefined") return
    const observer = new ResizeObserver((entries) => {
      const rect = entries[0]?.contentRect
      if (rect) setBox({ width: rect.width, height: rect.height })
    })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const targetAspect = (cols * 16) / (rows * 9)
  let gridW = 0
  let gridH = 0
  if (box.width > 0 && box.height > 0) {
    const containerAspect = box.width / box.height
    if (containerAspect > targetAspect) {
      gridH = box.height
      gridW = box.height * targetAspect
    } else {
      gridW = box.width
      gridH = box.width / targetAspect
    }
  }

  return (
    <div
      ref={wrapperRef}
      className={cn(
        "flex size-full items-center justify-center",
        className
      )}
    >
      {gridW > 0 && gridH > 0 ? (
        <div
          className="grid gap-2"
          style={{
            width: `${gridW}px`,
            height: `${gridH}px`,
            gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
          }}
        >
          {tracks.map((trackRef, idx) => (
            <div
              key={`${trackRef.participant.identity}-${trackRef.source}-${idx}`}
              className="size-full min-h-0 min-w-0"
            >
              <VoiceParticipantTile trackRef={trackRef} />
            </div>
          ))}
          {isLonely ? (
            <div className="size-full min-h-0 min-w-0">
              <VoiceLonelyTile />
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
