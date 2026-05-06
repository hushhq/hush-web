import { HashIcon, StarIcon, Volume2Icon, XIcon } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button.tsx"
import { MessageContent } from "@/components/message-content"

interface FavoriteEntry {
  id: string
  messageId: string
  body: string
  author: string
  authorInitials: string
  channelId: string
  channelName: string
  channelKind: "text" | "voice"
  serverId: string
  serverName: string
  savedAt: number
}

interface FavoritesViewProps {
  favorites: FavoriteEntry[]
  onJump: (entry: FavoriteEntry) => void
  onRemove: (messageId: string) => void
}

export function FavoritesView({
  favorites,
  onJump,
  onRemove,
}: FavoritesViewProps) {
  // Header is owned by ChannelView when this surface is mounted via
  // the shared channel shell (current production routing). Render
  // body-only here so the SidebarTrigger + truncation handling stays
  // consistent across every channel kind.
  return (
    <div className="flex h-full min-h-0 flex-col">
      {favorites.length === 0 ? (
        <div className="flex flex-1 items-center justify-center p-6">
          <div className="flex w-full max-w-sm flex-col items-center gap-3 text-center">
            <StarIcon
              className="size-10 text-muted-foreground/60"
              aria-hidden
            />
            <h2 className="text-base font-semibold">No favorites yet</h2>
            <p className="text-sm text-muted-foreground">
              Use the &ldquo;…&rdquo; menu on a message to save it here.
            </p>
            <span className="rounded-full bg-muted px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              Shipping soon
            </span>
          </div>
        </div>
      ) : (
        <ul className="flex flex-1 flex-col gap-2 overflow-auto overscroll-contain p-4">
          {favorites.map((entry) => (
            <li key={entry.id}>
              <FavoriteCard
                entry={entry}
                onJump={() => onJump(entry)}
                onRemove={() => onRemove(entry.messageId)}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function FavoriteCard({
  entry,
  onJump,
  onRemove,
}: {
  entry: FavoriteEntry
  onJump: () => void
  onRemove: () => void
}) {
  return (
    <div className="group/fav relative rounded-lg border bg-card p-3 transition-colors hover:bg-muted/40">
      <button
        type="button"
        onClick={onJump}
        className="flex w-full flex-col gap-2 text-left"
      >
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {entry.channelKind === "voice" ? (
            <Volume2Icon className="size-3.5" />
          ) : (
            <HashIcon className="size-3.5" />
          )}
          <span className="font-medium text-foreground">
            {entry.channelName}
          </span>
          <span>·</span>
          <span>{entry.serverName}</span>
        </div>
        <div className="flex items-start gap-2.5">
          <Avatar className="size-7 rounded-md">
            <AvatarFallback className="rounded-md text-[10px]">
              {entry.authorInitials}
            </AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <span className="text-xs font-medium">{entry.author}</span>
            <MessageContent body={entry.body} />
          </div>
        </div>
      </button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 size-7 opacity-0 transition-opacity group-hover/fav:opacity-100"
        onClick={(event) => {
          event.stopPropagation()
          onRemove()
        }}
        aria-label="Remove favorite"
      >
        <XIcon className="size-3.5" />
      </Button>
    </div>
  )
}

export type { FavoriteEntry }
