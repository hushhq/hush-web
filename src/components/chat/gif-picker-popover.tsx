/**
 * GIF picker popover backed by Giphy + `@giphy/react-components` Grid.
 *
 * The Grid component handles masonry layout, infinite scroll, and lazy
 * thumbnail loading at 60fps internally — we just supply a `fetchGifs`
 * function that talks to our backend proxy at `/api/gif/search`. The
 * proxy hides the API key and the user's IP from Giphy.
 *
 * Empty query → trending; non-empty → search (debounced 300 ms via
 * `use-debounce` so a fast typist does not flood the rate-limited beta
 * key). The Grid's `key` is bound to the debounced query so a new
 * search resets the infinite-scroll offset cleanly.
 *
 * Storage contract: the picked GIF lives in the MLS message envelope
 * as a `GifRef` (id, url, previewUrl, width, height) — *not* as a
 * markdown image and *not* as an attachment ref. The server never
 * stores GIF bytes; the receiver renders directly from Giphy's CDN
 * via the public `images.original.url`.
 */
import * as React from "react"
import type { IGif } from "@giphy/js-types"
import { Grid } from "@giphy/react-components"
import { Loader2Icon, SearchIcon } from "lucide-react"
import { useDebounce } from "use-debounce"

import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import * as api from "@/lib/api"
import type { GifRef } from "@/lib/messageEnvelope"

interface GifPickerPopoverProps {
  open: boolean
  onOpenChange: (next: boolean) => void
  /** Caret rect captured by the /gif slash command. Required — the
   *  popover has no other entry point (no toolbar button), so the
   *  caller must supply a position. When null while `open` is true,
   *  the popover falls back to the document body's top-left, which is
   *  effectively a no-op for the user. */
  anchorRect: { left: number; top: number; right: number; bottom: number } | null
  getToken: () => string | null
  baseUrl?: string
  onPick: (gif: GifRef) => void
}

const POPOVER_WIDTH = 320
const SEARCH_DEBOUNCE_MS = 300

export function GifPickerPopover({
  open,
  onOpenChange,
  anchorRect,
  getToken,
  baseUrl,
  onPick,
}: GifPickerPopoverProps) {
  const [query, setQuery] = React.useState("")
  const [debouncedQuery] = useDebounce(query.trim(), SEARCH_DEBOUNCE_MS)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (!open) {
      setQuery("")
      setErrorMessage(null)
    }
  }, [open])

  const fetchGifs = React.useCallback(
    async (offset: number) => {
      const token = getToken()
      if (!token) throw new Error("not authenticated")
      try {
        const result = await api.searchGifs(token, {
          q: debouncedQuery,
          offset,
          limit: 25,
          baseUrl,
        })
        setErrorMessage(null)
        return result
      } catch (err) {
        const msg = err instanceof Error ? err.message : "search failed"
        setErrorMessage(msg)
        throw err
      }
    },
    [debouncedQuery, getToken, baseUrl]
  )

  const handleGifClick = React.useCallback(
    (gif: IGif, e: React.SyntheticEvent<HTMLElement, Event>) => {
      e.preventDefault()
      const original = gif.images.original
      const preview =
        gif.images.fixed_height_small ?? gif.images.fixed_width_small ?? original
      onPick({
        id: String(gif.id),
        url: original.url,
        previewUrl: preview.url,
        width: Number(original.width) || 0,
        height: Number(original.height) || 0,
      })
      onOpenChange(false)
    },
    [onPick, onOpenChange]
  )

  // Virtual anchor pinned to the caret rect provided by the slash
  // command. position:fixed so Radix's PopperAnchor measures viewport
  // coords regardless of editor scroll. pointerEvents:none so the
  // invisible anchor never intercepts clicks.
  const virtualAnchorStyle: React.CSSProperties = anchorRect
    ? {
        position: "fixed",
        left: anchorRect.left,
        top: anchorRect.top,
        width: Math.max(1, anchorRect.right - anchorRect.left),
        height: Math.max(1, anchorRect.bottom - anchorRect.top),
        pointerEvents: "none",
      }
    : { position: "fixed", left: 0, top: 0, width: 1, height: 1, pointerEvents: "none" }

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverAnchor asChild>
        <span aria-hidden="true" style={virtualAnchorStyle} />
      </PopoverAnchor>
      <PopoverContent
        align="start"
        side="top"
        sideOffset={8}
        className="w-[336px] p-2"
      >
        <div className="relative mb-2">
          <SearchIcon className="absolute left-2 top-2.5 size-4 text-muted-foreground" />
          <Input
            autoFocus
            placeholder="Search GIPHY"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-8"
            aria-label="Search GIPHY"
          />
        </div>
        {errorMessage ? (
          <p role="alert" className="px-1 text-xs text-destructive">
            {errorMessage}
          </p>
        ) : null}
        <div className="max-h-80 overflow-y-auto rounded-md">
          <Grid
            key={debouncedQuery || "trending"}
            width={POPOVER_WIDTH}
            columns={3}
            gutter={6}
            fetchGifs={fetchGifs}
            onGifClick={handleGifClick}
            noLink
            hideAttribution
            noResultsMessage={
              <div className="p-6 text-center text-xs text-muted-foreground">
                no results
              </div>
            }
            initialGifs={[]}
            loader={() => (
              <div className="flex items-center justify-center p-4 text-muted-foreground">
                <Loader2Icon className="size-4 animate-spin" />
              </div>
            )}
          />
        </div>
      </PopoverContent>
    </Popover>
  )
}
