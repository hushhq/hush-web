import { GridLayout, useTracks } from "@livekit/components-react"
import "@livekit/components-styles"
import { Track } from "livekit-client"

import { cn } from "@/lib/utils"
import { VoiceParticipantTile } from "./voice-participant-tile"
import { VoiceLonelyTile } from "./voice-lonely-tile"

interface VoiceParticipantGridProps {
  className?: string
}

/**
 * Voice channel participant grid.
 *
 * Built directly on `@livekit/components-react`'s `GridLayout` +
 * `ParticipantTile`, fed by `useTracks` against the shared
 * `RoomContext` provided by the voice orchestrator. The orchestrator
 * binds its existing `useRoom`-managed `Room` instance into that
 * context, so every component-react hook reads from the same Room our
 * MLS frame transformer is wired into — no separate connection, no
 * separate subscription model, no shadow state.
 *
 * Track sources requested:
 * - `Camera` with placeholder: surfaces audio-only participants as
 *   avatar tiles so a user joining without video still appears.
 * - `ScreenShare` without placeholder: only renders when somebody is
 *   actually sharing a screen.
 *
 * Rendering, speaking ring, mute / deafen badges, fullscreen toggle,
 * and Avatar fallback come from `ParticipantTile` for free.
 */
export function VoiceParticipantGrid({ className }: VoiceParticipantGridProps) {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false }
  )

  // When the user is the only participant in the room, the GridLayout
  // collapses to a single tile and the surface feels empty. Render a
  // sibling "lonely" tile so the grid still has two cells, the user's
  // own tile keeps a sane size, and there is a visible cue that we're
  // waiting for someone else to join.
  if (tracks.length <= 1) {
    return (
      <div
        className={cn(
          "grid h-full w-full grid-cols-2 gap-3 p-3",
          className
        )}
      >
        {tracks[0] ? (
          <VoiceParticipantTile trackRef={tracks[0]} />
        ) : (
          <div />
        )}
        <VoiceLonelyTile />
      </div>
    )
  }

  return (
    <GridLayout
      tracks={tracks}
      className={cn("size-full", className)}
      style={{ ["--lk-grid-gap" as string]: "0.75rem" }}
    >
      <VoiceParticipantTile />
    </GridLayout>
  )
}
