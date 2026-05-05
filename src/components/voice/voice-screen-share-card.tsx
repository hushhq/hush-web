import { MonitorIcon } from "lucide-react"

import { Card } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

interface VoiceScreenShareCardProps {
  /** Display name of the peer producing the share. Ignored when `isSelf`. */
  peerName?: string
  /** Marks the local user's own un-watched screen card. */
  isSelf?: boolean
  /** True while subscribing to the remote screen track. */
  isLoading?: boolean
  onWatch?: () => void
}

/**
 * Placeholder tile for an available screen share that the local user is
 * not yet subscribed to. Click to subscribe (`onWatch`); the orchestrator
 * resolves the subscription via `useRoom.watchScreen`.
 */
export function VoiceScreenShareCard({
  peerName,
  isSelf = false,
  isLoading = false,
  onWatch,
}: VoiceScreenShareCardProps) {
  const title = isSelf ? "You're sharing" : (peerName ?? "Unknown peer")
  const hint = isLoading
    ? "Loading stream…"
    : isSelf
      ? "Tap to watch your share"
      : "Click to watch"

  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={onWatch}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onWatch?.()
        }
      }}
      className={cn(
        "flex aspect-video cursor-pointer flex-col items-center justify-center gap-3 border bg-muted/30 p-6 text-center transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        isLoading && "cursor-wait opacity-80"
      )}
    >
      {isLoading ? (
        <Spinner className="size-8 text-muted-foreground" />
      ) : (
        <MonitorIcon className="size-10 text-muted-foreground" />
      )}
      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium">{title}</span>
        <span className="text-xs text-muted-foreground">{hint}</span>
      </div>
    </Card>
  )
}
