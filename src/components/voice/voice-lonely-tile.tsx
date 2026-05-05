import { cn } from "@/lib/utils"

/**
 * Empty-state tile rendered alongside the local user's own tile when
 * they are the only participant in the room. Keeps the grid balanced
 * (two cells instead of a lone giant tile) and gives the user a
 * lighthearted nudge that nobody else has joined yet.
 */
export function VoiceLonelyTile({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex size-full items-center justify-center overflow-hidden rounded-md border border-dashed bg-muted/30 p-6 text-center",
        className
      )}
    >
      <p className="max-w-[18rem] text-sm italic text-muted-foreground">
        Nobody here yet. Let&apos;s go touch some grass?
      </p>
    </div>
  )
}
