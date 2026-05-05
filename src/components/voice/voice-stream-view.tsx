import * as React from "react"
import {
  MaximizeIcon,
  MinimizeIcon,
  MonitorIcon,
  VideoIcon,
  XIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { MEDIA_SOURCES } from "@/utils/constants"
import { cn } from "@/lib/utils"

interface VoiceStreamViewProps {
  track: MediaStreamTrack
  audioTrack?: MediaStreamTrack | null
  label: string
  source: string
  isLocal: boolean
  isSpeaking?: boolean
  objectFit?: "cover" | "contain"
  /** When provided, renders a stop-watching button + applies stand-by. */
  onUnwatch?: () => void
  /** Stand-by inactivity timer (ms) for screen shares. */
  standByAfterMs?: number
}

const FULLSCREEN_KEY = "Escape"

/**
 * Single video tile inside the participant grid. Owns the `<video>`
 * lifecycle (track attach, autoplay-with-fallback-mute, mirror for
 * local webcam), the fullscreen toggle, and the stand-by timer that
 * tells the orchestrator to drop a screen subscription when the tile
 * has been off-screen / hidden for too long.
 */
export function VoiceStreamView({
  track,
  audioTrack = null,
  label,
  source,
  isLocal,
  isSpeaking = false,
  objectFit = "contain",
  onUnwatch,
  standByAfterMs,
}: VoiceStreamViewProps) {
  const videoRef = React.useRef<HTMLVideoElement>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [isFullscreen, setIsFullscreen] = React.useState(false)
  const [isHovered, setIsHovered] = React.useState(false)

  React.useEffect(() => {
    const node = videoRef.current
    if (!node || !track) return
    const tracks: MediaStreamTrack[] = audioTrack ? [track, audioTrack] : [track]
    node.srcObject = new MediaStream(tracks)
    void playWithFallback(node)
    return () => {
      node.srcObject = null
    }
  }, [track, audioTrack])

  React.useEffect(() => {
    if (!isFullscreen) return
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === FULLSCREEN_KEY) setIsFullscreen(false)
    }
    document.addEventListener("keydown", handleKey)
    return () => document.removeEventListener("keydown", handleKey)
  }, [isFullscreen])

  React.useEffect(() => {
    if (!onUnwatch || !standByAfterMs || standByAfterMs <= 0) return
    const node = containerRef.current
    if (!node) return
    return attachStandbyWatcher(node, standByAfterMs, onUnwatch)
  }, [onUnwatch, standByAfterMs])

  const isScreenShare =
    source === MEDIA_SOURCES.SCREEN || source === MEDIA_SOURCES.SCREEN_AUDIO
  const shouldMirror = isLocal && source === MEDIA_SOURCES.WEBCAM

  return (
    <div
      ref={containerRef}
      data-fullscreen={isFullscreen ? "true" : undefined}
      data-speaking={isSpeaking ? "true" : undefined}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "group relative overflow-hidden rounded-lg border bg-card transition-all",
        isFullscreen
          ? "fixed inset-0 z-[9999] rounded-none border-0"
          : "h-full w-full",
        isSpeaking && !isFullscreen && "border-primary/50 ring-2 ring-primary/40"
      )}
    >
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={isLocal}
        className={cn(
          "absolute inset-0 size-full",
          shouldMirror && "scale-x-[-1]"
        )}
        style={{ objectFit: isFullscreen ? "contain" : objectFit }}
      />

      <Button
        type="button"
        size="icon"
        variant="secondary"
        aria-label={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
        className={cn(
          "absolute top-2 right-2 size-8 opacity-60 transition-opacity",
          (isHovered || isFullscreen) && "opacity-100"
        )}
        onClick={() => setIsFullscreen((v) => !v)}
      >
        {isFullscreen ? (
          <MinimizeIcon className="size-4" />
        ) : (
          <MaximizeIcon className="size-4" />
        )}
      </Button>

      {onUnwatch ? (
        <Button
          type="button"
          size="icon"
          variant="secondary"
          aria-label="Stop watching"
          className={cn(
            "absolute top-2 right-12 size-8 opacity-60 transition-opacity",
            isHovered && "opacity-100"
          )}
          onClick={(event) => {
            event.stopPropagation()
            onUnwatch()
          }}
        >
          <XIcon className="size-4" />
        </Button>
      ) : null}

      <div className="absolute inset-x-0 bottom-0 flex items-center gap-2 bg-gradient-to-t from-black/70 to-transparent px-3 py-2 text-xs text-white">
        {isScreenShare ? (
          <MonitorIcon className="size-3.5" />
        ) : (
          <VideoIcon className="size-3.5" />
        )}
        <span className="truncate font-medium">{label}</span>
        {isLocal ? (
          <span className="ml-auto rounded-md bg-white/15 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide">
            you
          </span>
        ) : null}
      </div>
    </div>
  )
}

async function playWithFallback(node: HTMLVideoElement) {
  try {
    await node.play()
  } catch {
    node.muted = true
    try {
      await node.play()
    } catch (err) {
      console.error("[VoiceStreamView] Playback failed:", err)
    }
  }
}

function attachStandbyWatcher(
  node: HTMLDivElement,
  delayMs: number,
  callback: () => void
): () => void {
  let timer: ReturnType<typeof setTimeout> | null = null
  let inView = false

  const clear = () => {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
  }

  const schedule = () => {
    clear()
    timer = setTimeout(() => {
      timer = null
      callback()
    }, delayMs)
  }

  const update = (visible: boolean) => {
    inView = visible
    const docVisible = document.visibilityState === "visible"
    if (visible && docVisible) clear()
    else schedule()
  }

  const observer = new IntersectionObserver(
    ([entry]) => update(entry.isIntersecting),
    { threshold: 0 }
  )
  observer.observe(node)

  const onVisibility = () => update(inView)
  document.addEventListener("visibilitychange", onVisibility)

  return () => {
    observer.disconnect()
    document.removeEventListener("visibilitychange", onVisibility)
    clear()
  }
}
