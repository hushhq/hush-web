import * as React from "react"
import { Track } from "livekit-client"

import { MEDIA_SOURCES, STANDBY_AFTER_MS, isScreenShareSource } from "@/utils/constants"
import { cn } from "@/lib/utils"
import { VoiceParticipantTile } from "./voice-participant-tile"
import { VoiceScreenShareCard } from "./voice-screen-share-card"
import { VoiceStreamView } from "./voice-stream-view"

interface ServerParticipant {
  userId: string
  displayName: string
}

interface MuteState {
  isMuted: boolean
  isDeafened: boolean
}

interface LocalTrackInfo {
  track: { kind: string; mediaStreamTrack: MediaStreamTrack }
  source: string
}

interface RemoteTrackInfo {
  kind: string
  source: Track.Source | string
  track: { mediaStreamTrack: MediaStreamTrack }
  participant: { identity: string; name?: string }
}

interface AvailableScreenInfo {
  source: Track.Source | string
  participantId: string
  participantName: string
}

interface VoiceParticipantGridProps {
  localTracks: Map<string, LocalTrackInfo>
  remoteTracks: Map<string, RemoteTrackInfo>
  availableScreens: Map<string, AvailableScreenInfo>
  watchedScreens: Set<string>
  loadingScreens: Set<string>
  isScreenSharing: boolean
  localScreenWatched: boolean
  participants: ServerParticipant[]
  currentUserId: string
  currentDisplayName: string
  activeSpeakerIds: string[]
  localSpeaking: boolean
  isMicOn: boolean
  isDeafened: boolean
  voiceMuteStates?: Map<string, MuteState>
  onWatchScreen: (producerId: string) => void
  onUnwatchScreen: (producerId: string) => void
  onWatchLocalScreen: () => void
  onUnwatchLocalScreen: () => void
}

interface BuiltStream {
  id: string
  type: "local" | "remote"
  track: MediaStreamTrack
  audioTrack: MediaStreamTrack | null
  label: string
  source: string
  participantId?: string
}

interface UnwatchedScreen {
  producerId: string
  peerName: string
}

function buildLocalStreams(
  localTracks: Map<string, LocalTrackInfo>,
  localScreenWatched: boolean
): BuiltStream[] {
  const out: BuiltStream[] = []
  let pairedAudio: MediaStreamTrack | null = null
  for (const info of localTracks.values()) {
    if (info.source === MEDIA_SOURCES.SCREEN_AUDIO) {
      pairedAudio = info.track.mediaStreamTrack
      break
    }
  }
  for (const [sid, info] of localTracks.entries()) {
    if (info.track.kind !== "video") continue
    if (info.source === MEDIA_SOURCES.SCREEN && !localScreenWatched) continue
    out.push({
      id: sid,
      type: "local",
      track: info.track.mediaStreamTrack,
      audioTrack: info.source === MEDIA_SOURCES.SCREEN ? pairedAudio : null,
      label: info.source === MEDIA_SOURCES.SCREEN ? "Your screen" : "Your camera",
      source: info.source,
    })
  }
  return out
}

function buildRemoteStreams(
  remoteTracks: Map<string, RemoteTrackInfo>
): BuiltStream[] {
  const out: BuiltStream[] = []
  for (const [sid, info] of remoteTracks.entries()) {
    if (info.kind !== "video") continue
    out.push({
      id: sid,
      type: "remote",
      track: info.track.mediaStreamTrack,
      audioTrack: null,
      label: info.participant.name || info.participant.identity,
      participantId: info.participant.identity,
      source:
        info.source === Track.Source.ScreenShare
          ? MEDIA_SOURCES.SCREEN
          : MEDIA_SOURCES.WEBCAM,
    })
  }
  return out
}

function buildUnwatchedScreens(
  availableScreens: Map<string, AvailableScreenInfo>,
  watchedScreens: Set<string>
): UnwatchedScreen[] {
  const out: UnwatchedScreen[] = []
  for (const [sid, info] of availableScreens.entries()) {
    if (info.source !== Track.Source.ScreenShare) continue
    if (watchedScreens.has(sid)) continue
    out.push({ producerId: sid, peerName: info.participantName })
  }
  return out
}

function getGridCols(count: number): string {
  if (count <= 1) return "grid-cols-1"
  if (count <= 4) return "grid-cols-2"
  if (count <= 9) return "grid-cols-3"
  return "grid-cols-4"
}

/**
 * Voice grid renderer. Composes:
 * - live `VoiceStreamView` tiles (one per local/remote video track),
 * - `VoiceParticipantTile` placeholders for audio-only members,
 * - `VoiceScreenShareCard` placeholders for un-subscribed remote
 *   shares and for the local user's own un-watched screen capture.
 *
 * Stream subscription state lives in `useRoom`; this component only
 * shapes the data into tiles and forwards subscribe / unsubscribe
 * callbacks (`onWatchScreen` / `onUnwatchScreen`) to the orchestrator.
 */
export function VoiceParticipantGrid({
  localTracks,
  remoteTracks,
  availableScreens,
  watchedScreens,
  loadingScreens,
  isScreenSharing,
  localScreenWatched,
  participants,
  currentUserId,
  activeSpeakerIds,
  localSpeaking,
  isMicOn,
  isDeafened,
  voiceMuteStates,
  onWatchScreen,
  onUnwatchScreen,
  onWatchLocalScreen,
  onUnwatchLocalScreen,
}: VoiceParticipantGridProps) {
  const localStreams = React.useMemo(
    () => buildLocalStreams(localTracks, localScreenWatched),
    [localTracks, localScreenWatched]
  )
  const remoteStreams = React.useMemo(
    () => buildRemoteStreams(remoteTracks),
    [remoteTracks]
  )
  const unwatchedScreens = React.useMemo(
    () => buildUnwatchedScreens(availableScreens, watchedScreens),
    [availableScreens, watchedScreens]
  )

  const allStreams = [...localStreams, ...remoteStreams]
  const speakerSet = new Set(activeSpeakerIds)

  const identitiesWithVideo = new Set<string>()
  for (const stream of allStreams) {
    identitiesWithVideo.add(
      stream.type === "local" ? currentUserId : stream.participantId ?? ""
    )
  }

  const audioOnly = participants.filter(
    (p) => !identitiesWithVideo.has(p.userId)
  )
  const showLocalScreenCard = isScreenSharing && !localScreenWatched
  const totalTiles =
    allStreams.length +
    audioOnly.length +
    unwatchedScreens.length +
    (showLocalScreenCard ? 1 : 0)

  if (totalTiles === 0) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        Connecting…
      </div>
    )
  }

  return (
    <div
      className={cn(
        "grid h-full auto-rows-fr gap-3 p-4",
        getGridCols(totalTiles)
      )}
    >
      {allStreams.map((stream) => {
        const ownerId =
          stream.type === "local" ? currentUserId : stream.participantId ?? ""
        const isSpeaking =
          stream.type === "local"
            ? isMicOn && localSpeaking
            : speakerSet.has(ownerId)
        const handleUnwatch = pickStreamUnwatch(
          stream,
          onUnwatchScreen,
          onUnwatchLocalScreen
        )
        return (
          <VoiceStreamView
            key={stream.id}
            track={stream.track}
            audioTrack={stream.audioTrack}
            label={stream.label}
            source={stream.source}
            isLocal={stream.type === "local"}
            isSpeaking={isSpeaking}
            objectFit={isScreenShareSource(stream.source) ? "contain" : "cover"}
            onUnwatch={handleUnwatch}
            standByAfterMs={
              stream.source === MEDIA_SOURCES.SCREEN ? STANDBY_AFTER_MS : undefined
            }
          />
        )
      })}

      {audioOnly.map((p) => {
        const isSelf = p.userId === currentUserId
        const remote = !isSelf ? voiceMuteStates?.get(p.userId) : null
        const muted = isSelf ? !isMicOn : (remote?.isMuted ?? false)
        const deaf = isSelf ? isDeafened : (remote?.isDeafened ?? false)
        const speaking = muted
          ? false
          : isSelf
            ? localSpeaking
            : speakerSet.has(p.userId)
        return (
          <VoiceParticipantTile
            key={`placeholder-${p.userId}`}
            displayName={p.displayName}
            isSelf={isSelf}
            isMuted={muted}
            isDeafened={deaf}
            isSpeaking={speaking}
          />
        )
      })}

      {showLocalScreenCard ? (
        <VoiceScreenShareCard
          isSelf
          onWatch={onWatchLocalScreen}
        />
      ) : null}

      {unwatchedScreens.map((screen) => (
        <VoiceScreenShareCard
          key={screen.producerId}
          peerName={screen.peerName}
          isLoading={loadingScreens.has(screen.producerId)}
          onWatch={() => onWatchScreen(screen.producerId)}
        />
      ))}
    </div>
  )
}

function pickStreamUnwatch(
  stream: BuiltStream,
  onUnwatchScreen: (producerId: string) => void,
  onUnwatchLocalScreen: () => void
): (() => void) | undefined {
  if (stream.type === "remote" && stream.source === MEDIA_SOURCES.SCREEN) {
    return () => onUnwatchScreen(stream.id)
  }
  if (stream.type === "local" && stream.source === MEDIA_SOURCES.SCREEN) {
    return onUnwatchLocalScreen
  }
  return undefined
}
