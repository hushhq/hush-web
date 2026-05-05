/**
 * Modal GIF picker backed by the server-side Tenor proxy.
 *
 * The dialog opens when the composer's `/gif` slash command fires.
 * User types a query → debounced fetch → result grid → click picks
 * one → returns a `GifRef` to the parent for envelope inclusion.
 *
 * The proxy hides the user's search query and IP from Google, and
 * keeps the API key server-side. A 503 from the proxy means the
 * instance has not configured `TENOR_API_KEY`; we surface that as a
 * disabled-state hint instead of a crash.
 */
import * as React from "react"
import { Loader2Icon, SearchIcon } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import * as api from "@/lib/api"
import type { GifRef } from "@/lib/messageEnvelope"

interface GifPickerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  getToken: () => string | null
  baseUrl?: string
  onPick: (gif: GifRef) => void
}

interface FetchedGif {
  id: string
  url: string
  previewUrl: string
  width: number
  height: number
}

const SEARCH_DEBOUNCE_MS = 300
const DEFAULT_QUERY = "trending"

export function GifPickerDialog({
  open,
  onOpenChange,
  getToken,
  baseUrl,
  onPick,
}: GifPickerDialogProps) {
  const [query, setQuery] = React.useState("")
  const [results, setResults] = React.useState<FetchedGif[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (!open) {
      setQuery("")
      setResults([])
      setErrorMessage(null)
      return
    }
  }, [open])

  React.useEffect(() => {
    if (!open) return
    const term = query.trim() || DEFAULT_QUERY
    const timer = setTimeout(() => {
      const token = getToken()
      if (!token) {
        setErrorMessage("not authenticated")
        return
      }
      setIsLoading(true)
      setErrorMessage(null)
      api
        .searchGifs(token, term, 24, baseUrl)
        .then((res: { results: FetchedGif[] }) => {
          setResults(res.results)
        })
        .catch((err: Error) => {
          setResults([])
          setErrorMessage(err.message || "search failed")
        })
        .finally(() => setIsLoading(false))
    }, SEARCH_DEBOUNCE_MS)
    return () => clearTimeout(timer)
  }, [open, query, baseUrl, getToken])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Pick a GIF</DialogTitle>
          <DialogDescription className="sr-only">
            Search Tenor for a GIF to send in this channel.
          </DialogDescription>
        </DialogHeader>
        <div className="relative">
          <SearchIcon className="absolute left-2 top-2.5 size-4 text-muted-foreground" />
          <Input
            autoFocus
            placeholder="Search GIFs"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-8"
            aria-label="GIF search query"
          />
        </div>
        {errorMessage ? (
          <p role="alert" className="text-xs text-destructive">
            {errorMessage}
          </p>
        ) : null}
        <ScrollArea className="h-80 rounded-md border">
          {isLoading && results.length === 0 ? (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <Loader2Icon className="size-5 animate-spin" />
            </div>
          ) : results.length === 0 ? (
            <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
              {errorMessage ? "no results" : "type to search"}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-1 p-2">
              {results.map((gif) => (
                <button
                  key={gif.id}
                  type="button"
                  onClick={() =>
                    onPick({
                      id: gif.id,
                      url: gif.url,
                      previewUrl: gif.previewUrl,
                      width: gif.width,
                      height: gif.height,
                    })
                  }
                  className="overflow-hidden rounded-md border bg-muted transition hover:ring-2 hover:ring-ring"
                >
                  <img
                    src={gif.previewUrl}
                    alt=""
                    className="h-24 w-full object-cover"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
