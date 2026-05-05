import { Volume2Icon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { VoiceStaticTile } from "./voice-static-tile"

export interface VoicePresentParticipant {
  userId: string
  displayName: string
  isMuted?: boolean
  isDeafened?: boolean
}

interface VoicePlaceholderViewProps {
  channelName: string
  /** Roster of participants currently in the voice channel (excluding self).
   *  Empty when nobody is present — surfaces the empty-state copy. */
  presentParticipants?: VoicePresentParticipant[]
  onJoinCall: () => void
}

/**
 * Surface shown when the user is on a voice channel route but is NOT
 * currently joined. Rather than redirecting back to the prejoin dialog,
 * we keep the user where they navigated and offer a calm "lobby" view
 * with:
 *
 * - the channel name (the parent shell already renders the header),
 * - placeholder tiles for any other participants currently in the call,
 * - a "Join call" CTA that re-enters the channel,
 * - a "*chirp chirp*" empty-state copy when nobody is around.
 */
export function VoicePlaceholderView({
  channelName,
  presentParticipants = [],
  onJoinCall,
}: VoicePlaceholderViewProps) {
  const hasOthers = presentParticipants.length > 0

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-6 bg-background p-6 text-center">
      <div className="flex flex-col items-center gap-2">
        <span className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <Volume2Icon className="size-6" />
        </span>
        <h2 className="text-lg font-semibold">{channelName}</h2>
        {hasOthers ? (
          <p className="text-sm text-muted-foreground">
            {presentParticipants.length}{" "}
            {presentParticipants.length === 1 ? "person is" : "people are"} in
            the call.
          </p>
        ) : (
          <p className="text-sm italic text-muted-foreground">
            *chirp chirp* nobody's here yet.
          </p>
        )}
      </div>

      {hasOthers ? (
        <div className="grid w-full max-w-2xl auto-rows-fr grid-cols-2 gap-3 sm:grid-cols-3">
          {presentParticipants.map((p) => (
            <VoiceStaticTile
              key={p.userId}
              displayName={p.displayName}
              isSelf={false}
              isMuted={p.isMuted ?? false}
              isDeafened={p.isDeafened ?? false}
              isSpeaking={false}
            />
          ))}
        </div>
      ) : null}

      <Button size="lg" onClick={onJoinCall}>
        Join call
      </Button>
    </div>
  )
}
