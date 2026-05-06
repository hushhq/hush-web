import { InboxIcon } from "lucide-react"

/**
 * Catch-up surface. Backend support for mentions / replies / threads /
 * DMs is pending; the empty state is centered on the available surface
 * (no scroll wrapper) and carries a "Shipping soon" badge so the screen
 * reads as intentionally empty rather than broken.
 */
export function HomeView() {
  return (
    <div className="flex h-full flex-1 items-center justify-center p-6">
      <div className="flex w-full max-w-sm flex-col items-center gap-3 text-center">
        <InboxIcon className="size-10 text-muted-foreground/60" aria-hidden />
        <h2 className="text-base font-semibold">Nothing to catch up on</h2>
        <p className="text-sm text-muted-foreground">
          Mentions, replies, threads and direct messages will show up here as
          you start using your servers.
        </p>
        <span className="rounded-full bg-muted px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
          Shipping soon
        </span>
      </div>
    </div>
  )
}
