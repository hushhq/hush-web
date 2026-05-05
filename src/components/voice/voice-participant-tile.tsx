import { HeadphoneOffIcon, MicOffIcon } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface VoiceParticipantTileProps {
  displayName: string
  isSelf: boolean
  isMuted: boolean
  isDeafened: boolean
  isSpeaking: boolean
}

function getInitials(name: string): string {
  if (!name) return "?"
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return parts[0][0]?.toUpperCase() ?? "?"
}

/**
 * Audio-only placeholder tile shown for any participant without an
 * active video track. Renders an Avatar fallback, the display name,
 * and badges for mute / deafen state. Speaking ring matches the live
 * StreamView treatment so the grid feels uniform across video and
 * audio-only tiles.
 */
export function VoiceParticipantTile({
  displayName,
  isSelf,
  isMuted,
  isDeafened,
  isSpeaking,
}: VoiceParticipantTileProps) {
  const label = isSelf ? "You" : (displayName || "Anonymous")
  return (
    <Card
      data-speaking={isSpeaking ? "true" : undefined}
      className={cn(
        "relative flex aspect-video items-center justify-center overflow-hidden border bg-muted/30 p-0 transition-all",
        isSpeaking && "border-primary/50 ring-2 ring-primary/40"
      )}
    >
      <div className="flex flex-col items-center gap-2">
        <Avatar className="size-16">
          <AvatarFallback className="text-base font-semibold">
            {getInitials(label)}
          </AvatarFallback>
        </Avatar>
        <span className="max-w-full truncate px-3 text-sm font-medium">
          {label}
        </span>
      </div>

      {(isMuted || isDeafened) && (
        <div className="absolute top-2 right-2 flex items-center gap-1">
          {isMuted ? (
            <span
              aria-label="Muted"
              className="flex size-6 items-center justify-center rounded-full bg-destructive/15 text-destructive"
            >
              <MicOffIcon className="size-3.5" />
            </span>
          ) : null}
          {isDeafened ? (
            <span
              aria-label="Deafened"
              className="flex size-6 items-center justify-center rounded-full bg-destructive/15 text-destructive"
            >
              <HeadphoneOffIcon className="size-3.5" />
            </span>
          ) : null}
        </div>
      )}
    </Card>
  )
}
