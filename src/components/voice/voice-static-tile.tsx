import { HeadphoneOffIcon, MicOffIcon } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface VoiceStaticTileProps {
  displayName: string
  isSelf: boolean
  isMuted: boolean
  isDeafened: boolean
  isSpeaking: boolean
}

function getInitials(name: string): string {
  if (!name) return "?"
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return parts[0]?.[0]?.toUpperCase() ?? "?"
}

/**
 * Static placeholder tile for the lobby / placeholder surfaces — used
 * by `VoicePlaceholderView` when the user has not joined the room and
 * therefore has no LiveKit track context to drive a real
 * `<ParticipantTile>`. Pure presentation, no track wiring.
 */
export function VoiceStaticTile({
  displayName,
  isSelf,
  isMuted,
  isDeafened,
  isSpeaking,
}: VoiceStaticTileProps) {
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
