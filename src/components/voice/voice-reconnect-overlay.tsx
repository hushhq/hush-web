import { Button } from "@/components/ui/button"

interface VoiceReconnectOverlayProps {
  isReconnecting: boolean
  hasFailed: boolean
  onRejoin: () => void
}

/**
 * Absolute overlay shown over the voice grid during a reconnect cycle.
 * Mirrors the legacy semantics: pulsing dot + "Reconnecting…" while the
 * MLS-aware retry loop is running, "Voice connection lost." + Rejoin
 * button when the loop has exhausted its attempts.
 */
export function VoiceReconnectOverlay({
  isReconnecting,
  hasFailed,
  onRejoin,
}: VoiceReconnectOverlayProps) {
  if (!isReconnecting && !hasFailed) return null

  return (
    <div
      role="status"
      aria-live="polite"
      className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-black/70 backdrop-blur-sm"
    >
      {isReconnecting && !hasFailed ? (
        <>
          <span
            aria-hidden="true"
            className="size-2.5 animate-pulse rounded-full bg-primary"
          />
          <p className="text-sm text-foreground">Reconnecting to voice…</p>
        </>
      ) : null}

      {hasFailed ? (
        <>
          <p className="text-sm text-foreground">Voice connection lost.</p>
          <Button onClick={onRejoin}>Rejoin</Button>
        </>
      ) : null}
    </div>
  )
}
