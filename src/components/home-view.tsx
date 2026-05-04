import { InboxIcon } from "lucide-react"

import { ScrollArea } from "@/components/ui/scroll-area.tsx"

/**
 * Catch-up surface — backend support for mentions / replies / threads / DMs
 * is pending. Renders a neutral empty state so the layout matches the
 * prototype without showing fake feed items.
 */
export function HomeView() {
  return (
    <ScrollArea className="flex-1">
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center justify-center gap-3 p-12 text-center">
        <InboxIcon className="size-10 text-muted-foreground/60" aria-hidden />
        <h2 className="text-base font-semibold">Nothing to catch up on</h2>
        <p className="max-w-sm text-sm text-muted-foreground">
          Mentions, replies, threads and direct messages will show up here as
          you start using your servers.
        </p>
      </div>
    </ScrollArea>
  )
}
