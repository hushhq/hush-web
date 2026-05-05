import {
  GridLayout,
  ParticipantTile,
  useTracks,
} from "@livekit/components-react"
import "@livekit/components-styles"
import { Track } from "livekit-client"

import { cn } from "@/lib/utils"

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

  return (
    <GridLayout
      tracks={tracks}
      className={cn("size-full", className)}
      style={{ ["--lk-grid-gap" as string]: "0.75rem" }}
    >
      <ParticipantTile />
    </GridLayout>
  )
}
