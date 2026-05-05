/**
 * Render one attachment inside a chat message bubble.
 *
 * Image / audio / video tiles: lazy-decrypt the ciphertext when the
 * tile enters the viewport, then render the decrypted Blob via an
 * ObjectURL. Falls back to a generic "file card" with a download
 * button for unsupported / opaque mimes (PDF, text, etc.). Tampered
 * ciphertext or a wrong key surfaces as a visible error so the user
 * does not silently see junk.
 */
import * as React from "react"
import {
  AlertTriangleIcon,
  DownloadIcon,
  FileIcon,
  Loader2Icon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useAttachmentDownloader } from "@/hooks/useAttachmentDownloader"
import { cn } from "@/lib/utils"
import type { AttachmentRef } from "@/lib/messageEnvelope"

interface AttachmentTileProps {
  ref: AttachmentRef
  getToken: () => string | null
  baseUrl?: string
  className?: string
}

export function AttachmentTile({
  ref,
  getToken,
  baseUrl,
  className,
}: AttachmentTileProps) {
  const containerRef = React.useRef<HTMLDivElement | null>(null)
  const [inViewport, setInViewport] = React.useState(false)

  React.useEffect(() => {
    const el = containerRef.current
    if (!el || typeof IntersectionObserver === "undefined") {
      setInViewport(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInViewport(true)
          io.disconnect()
        }
      },
      { rootMargin: "200px" }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const isImage = ref.mimeType.startsWith("image/")
  const isVideo = ref.mimeType === "video/mp4" || ref.mimeType === "video/webm"
  const isAudio = ref.mimeType.startsWith("audio/")
  const isPreviewable = isImage || isVideo || isAudio

  const { state, objectUrl, errorMessage, retry } = useAttachmentDownloader({
    ref,
    getToken,
    baseUrl,
    enabled: isPreviewable && inViewport,
  })

  return (
    <div ref={containerRef} className={cn("max-w-sm", className)}>
      {isPreviewable ? (
        <PreviewTile
          mimeType={ref.mimeType}
          name={ref.name}
          state={state}
          objectUrl={objectUrl}
          errorMessage={errorMessage}
          onRetry={retry}
          width={ref.width}
          height={ref.height}
        />
      ) : (
        <FileCard ref={ref} getToken={getToken} baseUrl={baseUrl} />
      )}
    </div>
  )
}

interface PreviewTileProps {
  mimeType: string
  name: string
  state: "idle" | "loading" | "ready" | "failed"
  objectUrl: string | null
  errorMessage: string | null
  onRetry: () => void
  width?: number
  height?: number
}

function PreviewTile({
  mimeType,
  name,
  state,
  objectUrl,
  errorMessage,
  onRetry,
  width,
  height,
}: PreviewTileProps) {
  if (state === "failed") {
    return (
      <Card className="flex items-center gap-2 p-3 text-xs">
        <AlertTriangleIcon className="size-4 text-destructive" />
        <span className="flex-1 truncate text-destructive">
          {errorMessage ?? "decryption failed"}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7"
          onClick={onRetry}
        >
          Retry
        </Button>
      </Card>
    )
  }
  if (state !== "ready" || !objectUrl) {
    return (
      <Card
        className="flex items-center justify-center bg-muted text-muted-foreground"
        style={fixedAspectStyle(width, height)}
      >
        <Loader2Icon className="size-5 animate-spin" />
      </Card>
    )
  }
  if (mimeType.startsWith("image/")) {
    return (
      <img
        src={objectUrl}
        alt={name}
        className="rounded-md border bg-muted"
        loading="lazy"
        width={width}
        height={height}
      />
    )
  }
  if (mimeType.startsWith("video/")) {
    return (
      <video
        src={objectUrl}
        controls
        className="rounded-md border bg-muted"
        width={width}
        height={height}
      />
    )
  }
  // audio
  return <audio src={objectUrl} controls className="w-full" />
}

function fixedAspectStyle(width?: number, height?: number): React.CSSProperties {
  if (!width || !height) return { minHeight: "8rem" }
  const aspect = `${width} / ${height}`
  return { aspectRatio: aspect, maxWidth: "100%" }
}

interface FileCardProps {
  ref: AttachmentRef
  getToken: () => string | null
  baseUrl?: string
}

function FileCard({ ref, getToken, baseUrl }: FileCardProps) {
  const [isDownloading, setIsDownloading] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  const handleDownload = async () => {
    setIsDownloading(true)
    setErrorMessage(null)
    try {
      const token = getToken()
      if (!token) throw new Error("no auth token")
      const { default: download } = await import("./attachment-download-helper")
      await download({ ref, token, baseUrl })
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "download failed")
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <Card className="flex items-center gap-3 p-3">
      <FileIcon className="size-5 text-muted-foreground" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{ref.name}</p>
        <p className="text-xs text-muted-foreground">
          {humanSize(ref.size)} · {ref.mimeType}
        </p>
        {errorMessage ? (
          <p role="alert" className="text-xs text-destructive">
            {errorMessage}
          </p>
        ) : null}
      </div>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={handleDownload}
        disabled={isDownloading}
        aria-label="Download"
      >
        {isDownloading ? (
          <Loader2Icon className="size-4 animate-spin" />
        ) : (
          <DownloadIcon className="size-4" />
        )}
      </Button>
    </Card>
  )
}

function humanSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
