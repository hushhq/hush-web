import * as React from "react"
import { useTracks } from "@livekit/components-react"
import "@livekit/components-styles"
import { Track } from "livekit-client"

import { cn } from "@/lib/utils"
import { VoiceParticipantTile } from "./voice-participant-tile"
import { VoiceLonelyTile } from "./voice-lonely-tile"

interface VoiceParticipantGridProps {
  className?: string
  /** Local user's deafen state. LiveKit has no track for "audio out
   *  off" — it's a client-only flag — so the grid receives it from
   *  the parent and forwards it to the local participant tile so a
   *  deafened user gets the headphone-off badge on their own tile. */
  localDeafened?: boolean
  /** Stable identifier of the currently expanded tile. When non-null,
   *  the grid renders only that tile, sized to the full container.
   *  Independent from browser fullscreen — the floating fullscreen
   *  button on the channel surface works whether a tile is expanded
   *  or the full grid is visible. */
  expandedKey?: string | null
  /** Setter the parent owns so this state can survive React re-renders
   *  triggered by track-list churn. */
  onExpandChange?: (key: string | null) => void
}

const TILE_GAP_PX = 8
const TILE_ASPECT = 16 / 9

/**
 * Returns row buckets for `count` tiles. The last incomplete row is
 * always centred via flex `justify-center` at render time; the layout
 * itself is row-major, picking modest column counts so individual
 * tiles stay close to a 16:9 webcam shape.
 *
 *   1   → [[0]]
 *   2   → [[0, 1]]                          (side by side)
 *   3   → [[0, 1], [2]]                     (third tile centred under)
 *   4   → [[0, 1], [2, 3]]
 *   5   → [[0, 1, 2], [3, 4]]               (last row centred)
 *   6   → [[0, 1, 2], [3, 4, 5]]
 *   7   → [[0, 1, 2], [3, 4, 5], [6]]
 *   8   → [[0, 1, 2, 3], [4, 5, 6, 7]]
 *   9   → [[0, 1, 2], [3, 4, 5], [6, 7, 8]]
 *  10+  → 4-col grid (excess: last row centred)
 */
function computeRows(count: number): number[][] {
  if (count <= 1) return [[0]]
  if (count === 2) return [[0, 1]]
  if (count === 3) return [[0, 1], [2]]
  if (count === 4) return [[0, 1], [2, 3]]
  if (count === 5) return [[0, 1, 2], [3, 4]]
  if (count === 6) return [[0, 1, 2], [3, 4, 5]]
  if (count === 7) return [[0, 1, 2], [3, 4, 5], [6]]
  if (count === 8) return [[0, 1, 2, 3], [4, 5, 6, 7]]
  if (count === 9) return [[0, 1, 2], [3, 4, 5], [6, 7, 8]]
  const rows: number[][] = []
  for (let i = 0; i < count; i += 4) {
    rows.push(
      Array.from({ length: Math.min(4, count - i) }, (_, j) => i + j)
    )
  }
  return rows
}

interface TileSize {
  width: number
  height: number
}

/**
 * Picks the largest tile size such that:
 *   - Every tile keeps a 16:9 aspect ratio.
 *   - The widest row fits within the container width (with gaps).
 *   - All rows fit within the container height (with gaps).
 *
 * The grid is then a stack of flex rows, each `justify-center`'d, so
 * partial rows naturally centre — solving the "third participant
 * stuck on the left" layout bug without a custom column-spanning grid.
 */
function pickTileSize(
  box: TileSize,
  rows: number[][]
): TileSize {
  if (box.width <= 0 || box.height <= 0) return { width: 0, height: 0 }
  const maxCols = rows.reduce((m, r) => Math.max(m, r.length), 1)
  const rowCount = rows.length
  const widthBoundW =
    (box.width - (maxCols - 1) * TILE_GAP_PX) / maxCols
  const heightBoundH =
    (box.height - (rowCount - 1) * TILE_GAP_PX) / rowCount
  const heightBoundW = heightBoundH * TILE_ASPECT
  const tileW = Math.max(0, Math.min(widthBoundW, heightBoundW))
  return { width: tileW, height: tileW / TILE_ASPECT }
}

/**
 * Picks a single-tile size constrained to 16:9 inside the container
 * (used in the expanded-tile view).
 */
function pickExpandedSize(box: TileSize): TileSize {
  if (box.width <= 0 || box.height <= 0) return { width: 0, height: 0 }
  const widthBoundW = box.width
  const heightBoundW = box.height * TILE_ASPECT
  const w = Math.max(0, Math.min(widthBoundW, heightBoundW))
  return { width: w, height: w / TILE_ASPECT }
}

function tileKey(participantIdentity: string, source: Track.Source): string {
  return `${participantIdentity}:${source}`
}

/**
 * Voice channel participant grid.
 *
 * `useTracks` against the shared `RoomContext` (set by the voice
 * orchestrator over our MLS-aware `useRoom` Room) drives the tile
 * list. Layout is row-major flex with the last row centred — keeps
 * three participants laid out as `[A B] / [   C   ]` instead of the
 * legacy 2×2 grid that left a hole on the right. Each row sizes its
 * tiles to a strict 16:9 box so webcam content doesn't squash.
 *
 * When the user is alone (`tracks.length <= 1`), we sub in a "lonely"
 * tile beneath the user's own so the grid still shows two cells and
 * there is a visible cue that nobody else has joined yet. The lonely
 * tile is intentionally non-expandable (placeholder, no real stream).
 */
export function VoiceParticipantGrid({
  className,
  localDeafened = false,
  expandedKey = null,
  onExpandChange,
}: VoiceParticipantGridProps) {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false }
  )

  const isLonely = tracks.length <= 1
  const rows = React.useMemo(() => {
    const visibleCount = isLonely ? 2 : tracks.length
    return computeRows(visibleCount)
  }, [isLonely, tracks.length])

  // Compute the largest tile size that fits the container while every
  // tile stays at 16:9. CSS `aspect-ratio` + `max-h-full max-w-full`
  // would only set upper bounds: with no explicit width/height the
  // grid sizes to its intrinsic content (which for a flexible 1fr ×
  // 1fr grid is the children's min-content), far smaller than the
  // container. We therefore measure the parent and set explicit pixel
  // dimensions so the grid always claims the full available real
  // estate.
  const wrapperRef = React.useRef<HTMLDivElement>(null)
  const [box, setBox] = React.useState<TileSize>({ width: 0, height: 0 })
  React.useEffect(() => {
    const node = wrapperRef.current
    if (!node || typeof ResizeObserver === "undefined") return
    let raf = 0
    const observer = new ResizeObserver((entries) => {
      const rect = entries[0]?.contentRect
      if (!rect) return
      // Coalesce notifications into a single frame: a naive setBox per
      // entry caused ResizeObserver loops on slow renders, freezing the
      // shell while the browser kept retrying. We also no-op when the
      // dimensions are unchanged so we never schedule a state update
      // that would not affect output.
      if (raf) cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        setBox((prev) => {
          const w = Math.round(rect.width)
          const h = Math.round(rect.height)
          if (prev.width === w && prev.height === h) return prev
          return { width: w, height: h }
        })
      })
    })
    observer.observe(node)
    return () => {
      if (raf) cancelAnimationFrame(raf)
      observer.disconnect()
    }
  }, [])

  // Lookup expanded track. If the expanded participant disappears
  // (left the call, screen share stopped) we collapse silently so
  // the grid never renders against a stale key.
  const expandedTrack = React.useMemo(() => {
    if (!expandedKey) return null
    return (
      tracks.find(
        (t) => tileKey(t.participant.identity, t.source) === expandedKey
      ) ?? null
    )
  }, [tracks, expandedKey])
  React.useEffect(() => {
    if (expandedKey && !expandedTrack) onExpandChange?.(null)
  }, [expandedKey, expandedTrack, onExpandChange])

  const tileSize = pickTileSize(box, rows)
  const expandedSize = pickExpandedSize(box)

  return (
    <div
      ref={wrapperRef}
      className={cn(
        "flex size-full items-center justify-center overflow-hidden",
        className
      )}
    >
      {expandedTrack && expandedSize.width > 0 ? (
        <div
          style={{
            width: `${expandedSize.width}px`,
            height: `${expandedSize.height}px`,
          }}
        >
          <VoiceParticipantTile
            trackRef={expandedTrack}
            isDeafened={
              expandedTrack.participant.isLocal ? localDeafened : false
            }
            isExpanded
            onCollapse={() => onExpandChange?.(null)}
          />
        </div>
      ) : tileSize.width > 0 ? (
        <div className="flex flex-col items-center justify-center gap-2">
          {rows.map((row, rowIdx) => (
            <div
              key={rowIdx}
              className="flex justify-center gap-2"
              style={{ height: `${tileSize.height}px` }}
            >
              {row.map((idx) => {
                if (idx < tracks.length) {
                  const trackRef = tracks[idx]
                  const key = tileKey(
                    trackRef.participant.identity,
                    trackRef.source
                  )
                  return (
                    <div
                      key={key}
                      style={{
                        width: `${tileSize.width}px`,
                        height: `${tileSize.height}px`,
                      }}
                    >
                      <VoiceParticipantTile
                        trackRef={trackRef}
                        isDeafened={
                          trackRef.participant.isLocal ? localDeafened : false
                        }
                        onExpand={
                          onExpandChange
                            ? () => onExpandChange(key)
                            : undefined
                        }
                      />
                    </div>
                  )
                }
                // Lonely placeholder slot. Not expandable.
                return (
                  <div
                    key="lonely"
                    style={{
                      width: `${tileSize.width}px`,
                      height: `${tileSize.height}px`,
                    }}
                  >
                    <VoiceLonelyTile />
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}
