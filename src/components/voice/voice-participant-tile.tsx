import * as React from "react"
import {
  ParticipantContextIfNeeded,
  ParticipantName,
  TrackMutedIndicator,
  TrackRefContext,
  VideoTrack,
  useEnsureTrackRef,
  useParticipantTile,
} from "@livekit/components-react"
import type { TrackReferenceOrPlaceholder } from "@livekit/components-react"
import { isTrackReference } from "@livekit/components-core"
import { Track } from "livekit-client"
import {
  HeadphoneOffIcon,
  Maximize2Icon,
  MaximizeIcon,
  MicOffIcon,
  MinimizeIcon,
  XIcon,
} from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface VoiceParticipantTileProps {
  trackRef?: TrackReferenceOrPlaceholder
  className?: string
  /** Deafen state (no remote audio). LiveKit doesn't expose this as
   *  a track — it's a client-only flag — so the parent grid passes it
   *  in for the local participant. */
  isDeafened?: boolean
  /** When set, the tile is currently the sole expanded tile (step 1
   *  of the two-step fullscreen flow). Suppresses the small expand
   *  affordance and reveals the collapse + fullscreen controls. */
  isExpanded?: boolean
  /** True while the document is in real browser fullscreen and the
   *  tile sits inside the fullscreen subtree. Toggles the maximize /
   *  minimize icon copy on the rightmost overlay button. */
  isFullscreen?: boolean
  /** Click on the tile body (or the inline expand button) lifts the
   *  tile to the expanded view in the parent grid. Omit on tiles
   *  that should not be expandable (e.g. the lonely placeholder). */
  onExpand?: () => void
  /** Collapse expanded → grid. Only meaningful when `isExpanded`. */
  onCollapse?: () => void
  /** Toggle browser fullscreen on the parent voice surface. Only
   *  meaningful when `isExpanded` (per the two-step flow contract). */
  onToggleFullscreen?: () => void
}

function getInitials(name: string): string {
  if (!name) return "?"
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return parts[0]?.[0]?.toUpperCase() ?? "?"
}

/**
 * Custom voice tile — replacement for the default
 * `<ParticipantTile />` from `@livekit/components-react`. Renders the
 * camera / screen-share track via `<VideoTrack>` when a track is
 * actually published, and falls back to a shadcn Avatar with the
 * participant's initials when not. The connection-quality indicator
 * is intentionally omitted — voice channels are short-lived and the
 * RTT pill on the toolbar already covers that signal.
 *
 * Mute state is shown in the bottom-right metadata strip *in place*
 * of the participant name when relevant, mirroring the mockup. The
 * speaking ring around the tile is driven by `data-lk-speaking`,
 * which `@livekit/components-react` toggles automatically when the
 * underlying participant becomes an active speaker.
 *
 * Hover affordances follow the YouTube pattern: a bottom-up dark
 * gradient + an inline expand button fade in on pointer-hover so the
 * idle resting state stays clean. Tap / click on the tile body is the
 * primary expand trigger; the icon button is a secondary affordance.
 */
export function VoiceParticipantTile({
  trackRef,
  className,
  isDeafened = false,
  isExpanded = false,
  isFullscreen = false,
  onExpand,
  onCollapse,
  onToggleFullscreen,
}: VoiceParticipantTileProps) {
  const ref = useEnsureTrackRef(trackRef)
  const { elementProps } = useParticipantTile<HTMLDivElement>({
    trackRef: ref,
    htmlProps: { className: "lk-participant-tile" },
  })
  const isVideo =
    isTrackReference(ref) &&
    !ref.publication?.isMuted &&
    (ref.source === Track.Source.Camera ||
      ref.source === Track.Source.ScreenShare)
  const displayName = ref.participant.name || ref.participant.identity
  const isLocal = ref.participant.isLocal
  const isScreenShare = ref.source === Track.Source.ScreenShare
  const canExpand = Boolean(onExpand) && !isExpanded

  const handleClick = React.useCallback(() => {
    if (canExpand) onExpand?.()
  }, [canExpand, onExpand])

  const stop = React.useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
  }, [])

  return (
    <ParticipantContextIfNeeded participant={ref.participant}>
      <TrackRefContext.Provider value={ref}>
        <div
          {...elementProps}
          // The lk-participant-tile class hard-codes
          // `border-radius: var(--lk-border-radius)`; without
          // overriding via inline style the lk rule wins over
          // Tailwind's `rounded-md` because the lk stylesheet ships
          // last in the cascade. Inline style is the deterministic
          // override and avoids `!important` hammering everywhere.
          style={{
            ...elementProps.style,
            borderRadius: "var(--radius-md, 0.5rem)",
          }}
          onClick={canExpand ? handleClick : elementProps.onClick}
          role={canExpand ? "button" : elementProps.role}
          tabIndex={canExpand ? 0 : elementProps.tabIndex}
          onKeyDown={(e) => {
            if (canExpand && (e.key === "Enter" || e.key === " ")) {
              e.preventDefault()
              onExpand?.()
            }
          }}
          className={cn(
            "group relative flex size-full items-center justify-center overflow-hidden border bg-card transition-all",
            "data-[lk-speaking=true]:border-primary/60 data-[lk-speaking=true]:ring-2 data-[lk-speaking=true]:ring-primary/40",
            canExpand && "cursor-pointer",
            className,
            elementProps.className
          )}
        >
          {isVideo ? (
            <VideoTrack
              trackRef={ref}
              className="absolute inset-0 size-full object-cover"
              style={
                isLocal && ref.source === Track.Source.Camera
                  ? { transform: "scaleX(-1)" }
                  : undefined
              }
            />
          ) : (
            <div className="flex flex-col items-center gap-3 px-4 text-center">
              <Avatar className="size-20">
                <AvatarFallback className="text-xl font-semibold">
                  {getInitials(displayName)}
                </AvatarFallback>
              </Avatar>
              <div className="flex items-center gap-1.5">
                <TrackMutedIndicator
                  trackRef={{
                    participant: ref.participant,
                    source: Track.Source.Microphone,
                  }}
                  show="muted"
                  className="flex size-4 items-center justify-center text-destructive [&_svg]:size-3.5"
                >
                  <MicOffIcon />
                </TrackMutedIndicator>
                {isDeafened ? (
                  <span className="flex size-4 items-center justify-center text-destructive [&_svg]:size-3.5">
                    <HeadphoneOffIcon />
                  </span>
                ) : null}
                {isScreenShare ? (
                  <span className="max-w-[14rem] truncate text-sm font-medium">
                    {displayName}'s screen
                  </span>
                ) : (
                  <ParticipantName className="max-w-[14rem] truncate text-sm font-medium" />
                )}
                {isLocal ? (
                  <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                    you
                  </span>
                ) : null}
              </div>
            </div>
          )}

          {/* Hover dim gradient — fades in only when the cursor is
              over the tile, mirroring YouTube's hover-controls
              pattern. Pointer-events disabled so the click still
              hits the underlying tile (which is the primary expand
              trigger). */}
          <div
            aria-hidden
            className={cn(
              "pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent opacity-0 transition-opacity duration-200",
              !isExpanded && "group-hover:opacity-100"
            )}
          />

          {/* Top-right hover affordance — small expand button that
              becomes visible only on hover. Stops propagation so a
              direct click here does not double-fire the tile's
              own onClick handler. */}
          {canExpand ? (
            <button
              type="button"
              aria-label="Expand"
              title="Expand"
              onClick={(e) => {
                stop(e)
                onExpand?.()
              }}
              className={cn(
                "absolute right-2 top-2 z-10 inline-flex size-8 items-center justify-center rounded-md bg-black/55 text-white opacity-0 backdrop-blur-sm transition-opacity duration-200",
                "hover:bg-black/75 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                "group-hover:opacity-100"
              )}
            >
              <Maximize2Icon className="size-4" />
            </button>
          ) : null}

          {/* Expanded-mode controls — collapse + fullscreen toggle.
              Stay always-visible so the user can step out of the
              expanded surface without hunting for them. */}
          {isExpanded ? (
            <div className="absolute right-2 top-2 z-10 flex items-center gap-1">
              {onToggleFullscreen ? (
                <button
                  type="button"
                  aria-label={
                    isFullscreen ? "Exit fullscreen" : "Enter fullscreen"
                  }
                  title={
                    isFullscreen ? "Exit fullscreen" : "Enter fullscreen"
                  }
                  onClick={(e) => {
                    stop(e)
                    onToggleFullscreen()
                  }}
                  className={cn(
                    "inline-flex size-9 items-center justify-center rounded-md bg-black/55 text-white backdrop-blur-sm transition-colors",
                    "hover:bg-black/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  )}
                >
                  {isFullscreen ? (
                    <MinimizeIcon className="size-4" />
                  ) : (
                    <MaximizeIcon className="size-4" />
                  )}
                </button>
              ) : null}
              {onCollapse ? (
                <button
                  type="button"
                  aria-label="Collapse"
                  title="Collapse"
                  onClick={(e) => {
                    stop(e)
                    onCollapse()
                  }}
                  className={cn(
                    "inline-flex size-9 items-center justify-center rounded-md bg-black/55 text-white backdrop-blur-sm transition-colors",
                    "hover:bg-black/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  )}
                >
                  <XIcon className="size-4" />
                </button>
              ) : null}
            </div>
          ) : null}

          {/* Bottom metadata strip — only on video tiles (the avatar
              variant inlines its name + mute strip below the avatar
              above). Stays visible always for at-a-glance identity. */}
          {isVideo ? (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center gap-2 bg-gradient-to-t from-black/70 to-transparent px-3 py-2 text-xs text-white">
              <TrackMutedIndicator
                trackRef={{
                  participant: ref.participant,
                  source: Track.Source.Microphone,
                }}
                show="muted"
                className="flex size-4 items-center justify-center text-destructive [&_svg]:size-3.5"
              >
                <MicOffIcon />
              </TrackMutedIndicator>
              {isDeafened ? (
                <span className="flex size-4 items-center justify-center text-destructive [&_svg]:size-3.5">
                  <HeadphoneOffIcon />
                </span>
              ) : null}
              {isScreenShare ? (
                <span className="truncate font-medium">
                  {displayName}'s screen
                </span>
              ) : (
                <ParticipantName className="truncate font-medium" />
              )}
              {isLocal ? (
                <span className="ml-auto rounded-md bg-white/15 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide">
                  you
                </span>
              ) : null}
            </div>
          ) : null}
        </div>
      </TrackRefContext.Provider>
    </ParticipantContextIfNeeded>
  )
}
