import * as React from "react"

import { RoomContext } from "@livekit/components-react"
import "@livekit/components-styles"
import type { Room } from "livekit-client"

import { isOutputDeviceSelectionSupported } from "@/audio"
import { useAuth } from "@/contexts/AuthContext"
import { getDeviceId } from "@/hooks/useAuth"
import { useIsMobile } from "@/hooks/use-mobile"
import { useRoom } from "@/hooks/useRoom"
import { useVoiceBandwidth } from "@/hooks/useVoiceBandwidth"
import * as mlsStore from "@/lib/mlsStore"
import {
  readVoiceDevicePrefs,
  saveVoiceDevicePrefs,
  type VoiceDevicePrefs,
} from "@/lib/voiceDevicePrefs"
import {
  VoiceControlsBar,
} from "@/components/voice/voice-controls-bar"
import { VoiceDevicePickerDialog } from "@/components/voice/voice-device-picker-dialog"
import { VoiceParticipantGrid } from "@/components/voice/voice-participant-grid"
import {
  VoicePrejoinDialog,
  type VoicePrejoinChoice,
} from "@/components/voice/voice-prejoin-dialog"
import { VoiceQualityPickerDialog } from "@/components/voice/voice-quality-picker-dialog"
import { VoiceReconnectOverlay } from "@/components/voice/voice-reconnect-overlay"
import { Button } from "@/components/ui/button"

type VoiceControlsApi = {
  toggleMic?: () => void
  toggleDeafen?: () => void
  toggleScreenShare?: () => void
  switchScreenSource?: () => void
  toggleWebcam?: () => void
  isScreenSharing?: boolean
  isWebcamOn?: boolean
}

type VoiceState = {
  isMicOn: boolean
  isDeafened: boolean
  isScreenSharing: boolean
  isWebcamOn: boolean
}

interface VoiceChannelViewProps {
  channel: { id: string; name: string; type: "voice" }
  serverId: string
  getToken: () => string | null
  wsClient: unknown
  members?: Array<{ id?: string; userId?: string; displayName?: string }>
  myRole?: string
  onLeave: () => void | Promise<void>
  voiceControlsRef?: React.RefObject<VoiceControlsApi | null> | null
  onVoiceStateChange?: (state: VoiceState) => void
  baseUrl?: string
}

interface DeviceOption {
  deviceId: string
  label: string
}

interface PlaybackManagerLike {
  bindContainer: (el: HTMLElement) => void
  unbindContainer: () => void
  setRemoteAudioMuted: (muted: boolean) => void
  setSinkId: (sinkId: string) => Promise<void>
}

interface RoomApi {
  isReady: boolean
  error: string | null
  // The runtime hook is `useRoom` (JS); the maps below are intentionally
  // typed as `any` so the orchestrator does not duplicate the source
  // shapes maintained inside `useRoom`. The grid component re-narrows
  // them through its own props interface.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  localTracks: Map<string, any>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  remoteTracks: Map<string, any>
  participants: Array<{ userId: string; displayName: string }>
  isVoiceReconnecting: boolean
  voiceReconnectFailed: boolean
  activeSpeakerIds: string[]
  localSpeaking: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  availableScreens: Map<string, any>
  watchedScreens: Set<string>
  loadingScreens: Set<string>
  connectRoom: (
    roomName: string,
    displayName: string,
    channelId: string
  ) => Promise<void>
  disconnectRoom: () => Promise<void>
  publishScreen: (qualityKey: string) => Promise<MediaStream | null>
  unpublishScreen: () => Promise<void>
  switchScreenSource: (qualityKey: string) => Promise<MediaStream | null>
  changeQuality: (qualityKey: string) => Promise<void>
  publishWebcam: (deviceId: string | null) => Promise<void>
  unpublishWebcam: () => Promise<void>
  publishMic: (deviceId: string | null) => Promise<void>
  unpublishMic: () => Promise<void>
  muteMic: () => Promise<void>
  unmuteMic: () => Promise<void>
  watchScreen: (producerId: string) => void
  unwatchScreen: (producerId: string) => void
  playbackManager: PlaybackManagerLike | null
  /** The underlying livekit-client `Room` instance the MLS frame
   *  transformer is attached to. Passed into `RoomContext.Provider`
   *  so `@livekit/components-react` hooks read from the same Room. */
  room: Room | null
}

async function listDevices(
  kind: "audioinput" | "videoinput" | "audiooutput"
): Promise<DeviceOption[]> {
  try {
    if (kind !== "audiooutput") {
      const probe = await navigator.mediaDevices.getUserMedia(
        kind === "audioinput" ? { audio: true } : { video: true }
      )
      probe.getTracks().forEach((t) => t.stop())
    }
    const all = await navigator.mediaDevices.enumerateDevices()
    const fallback =
      kind === "audioinput"
        ? "Microphone"
        : kind === "videoinput"
          ? "Camera"
          : "Speaker"
    return all
      .filter((d) => d.kind === kind && d.deviceId)
      .map((d) => ({
        deviceId: d.deviceId,
        label: d.label || fallback,
      }))
  } catch {
    return []
  }
}

/**
 * Voice channel orchestrator. Owns the connection lifecycle to the
 * MLS-backed LiveKit room (`useRoom`), the published track state, and
 * the prejoin / device / quality dialogs that wrap that lifecycle.
 *
 * First-time entries surface `VoicePrejoinDialog` with a camera preview
 * and a "Don't ask again" checkbox; subsequent entries skip the dialog
 * and connect immediately when the user has saved their selection.
 */
export function VoiceChannelView({
  channel,
  serverId,
  getToken,
  wsClient,
  onLeave,
  voiceControlsRef,
  onVoiceStateChange,
  baseUrl = "",
}: VoiceChannelViewProps) {
  const { user } = useAuth() as {
    user: { id?: string; displayName?: string; display_name?: string } | null
  }
  const currentUserId = user?.id ?? ""
  const displayName =
    user?.displayName ?? user?.display_name ?? "Anonymous"
  const roomName = `channel-${channel.id}`

  const getStore = React.useCallback(
    () => mlsStore.openStore(currentUserId, getDeviceId()),
    [currentUserId]
  )

  const room = useRoom({
    wsClient: wsClient as object,
    getToken,
    currentUserId,
    getStore,
    voiceKeyRotationHours: undefined,
    baseUrl,
  }) as RoomApi

  const bandwidth = useVoiceBandwidth()
  const [prefs, setPrefs] = React.useState<VoiceDevicePrefs | null>(null)
  const [prefsLoaded, setPrefsLoaded] = React.useState(false)
  const [prejoinOpen, setPrejoinOpen] = React.useState(false)
  const [hasJoined, setHasJoined] = React.useState(false)
  const [audioDevices, setAudioDevices] = React.useState<DeviceOption[]>([])
  const [videoDevices, setVideoDevices] = React.useState<DeviceOption[]>([])
  const [showMicPicker, setShowMicPicker] = React.useState(false)
  const [showWebcamPicker, setShowWebcamPicker] = React.useState(false)
  const [showOutputPicker, setShowOutputPicker] = React.useState(false)
  const [outputDevices, setOutputDevices] = React.useState<DeviceOption[]>([])
  const [showQualityPicker, setShowQualityPicker] = React.useState(false)
  const isMobile = useIsMobile()
  const outputDeviceSelectable = React.useMemo(
    () => !isMobile && isOutputDeviceSelectionSupported(),
    [isMobile]
  )
  const [isMicOn, setIsMicOn] = React.useState(false)
  const [isDeafened, setIsDeafened] = React.useState(false)
  const [isWebcamOn, setIsWebcamOn] = React.useState(false)
  const [isScreenSharing, setIsScreenSharing] = React.useState(false)
  const [localScreenWatched, setLocalScreenWatched] = React.useState(false)
  const audioContainerRef = React.useRef<HTMLDivElement>(null)
  const micPublishedRef = React.useRef(false)
  const micBeforeDeafenRef = React.useRef(false)

  React.useEffect(() => {
    if (!currentUserId) return
    let cancelled = false
    readVoiceDevicePrefs(currentUserId)
      .then((stored) => {
        if (cancelled) return
        setPrefs(stored)
        setPrefsLoaded(true)
        if (!stored?.dontAskAgain) setPrejoinOpen(true)
      })
      .catch(() => {
        if (!cancelled) {
          setPrefsLoaded(true)
          setPrejoinOpen(true)
        }
      })
    return () => {
      cancelled = true
    }
  }, [currentUserId])

  React.useEffect(() => {
    const pm = room.playbackManager
    const container = audioContainerRef.current
    if (!pm || !container) return
    pm.bindContainer(container)
    return () => {
      pm.unbindContainer()
    }
  }, [room.playbackManager])

  // Apply the saved output sink to the playback manager once prefs are
  // loaded and a manager exists. Browsers that lack setSinkId silently
  // skip; the manager swallows per-element failures inside setSinkId.
  React.useEffect(() => {
    const pm = room.playbackManager
    if (!pm || !outputDeviceSelectable) return
    const id = prefs?.outputDeviceId ?? null
    if (!id) return
    void pm.setSinkId(id).catch(() => {
      // Output device may have been unplugged; fall back to default.
    })
  }, [room.playbackManager, prefs?.outputDeviceId, outputDeviceSelectable])

  const connectRoomFn = room.connectRoom
  const disconnectRoomFn = room.disconnectRoom
  React.useEffect(() => {
    if (!wsClient || !channel.id) return
    if (!prefsLoaded) return
    if (prefs?.dontAskAgain !== true) return
    void connectRoomFn(roomName, displayName, channel.id).catch(() => {})
    setHasJoined(true)
    return () => {
      disconnectRoomFn().catch(() => {})
    }
  }, [
    wsClient,
    channel.id,
    roomName,
    displayName,
    prefs?.dontAskAgain,
    prefsLoaded,
    connectRoomFn,
    disconnectRoomFn,
  ])

  const autoPublishedRef = React.useRef(false)
  React.useEffect(() => {
    if (!room.isReady || autoPublishedRef.current) return
    if (!prefs) return
    autoPublishedRef.current = true
    void (async () => {
      try {
        if (prefs.audioEnabled && prefs.audioDeviceId) {
          await room.publishMic(prefs.audioDeviceId)
          micPublishedRef.current = true
          setIsMicOn(true)
        }
        if (prefs.videoEnabled && prefs.videoDeviceId) {
          await room.publishWebcam(prefs.videoDeviceId)
          setIsWebcamOn(true)
        }
      } catch (err) {
        console.warn("[VoiceChannel] auto-publish failed:", err)
      }
    })()
  }, [room.isReady, prefs, room.publishMic, room.publishWebcam])

  const handlePrejoinConfirm = React.useCallback(
    async (choice: VoicePrejoinChoice) => {
      setPrejoinOpen(false)
      const next: VoiceDevicePrefs = {
        audioDeviceId: choice.audioDeviceId,
        videoDeviceId: choice.videoDeviceId,
        audioEnabled: choice.audioEnabled,
        videoEnabled: choice.videoEnabled,
        dontAskAgain: choice.dontAskAgain,
        updatedAt: Date.now(),
      }
      setPrefs(next)
      if (currentUserId) {
        void saveVoiceDevicePrefs(currentUserId, next).catch(() => {})
      }
      try {
        await connectRoomFn(roomName, displayName, channel.id)
        setHasJoined(true)
      } catch (err) {
        console.error("[VoiceChannel] connect after prejoin failed:", err)
      }
    },
    [currentUserId, connectRoomFn, roomName, displayName, channel.id]
  )

  const handlePrejoinCancel = React.useCallback(() => {
    setPrejoinOpen(false)
    void Promise.resolve(onLeave())
  }, [onLeave])

  const handleToggleMic = React.useCallback(async () => {
    if (isMicOn) {
      await room.muteMic()
      setIsMicOn(false)
      return
    }
    if (!micPublishedRef.current) {
      await room.publishMic(prefs?.audioDeviceId ?? null)
      micPublishedRef.current = true
    } else {
      await room.unmuteMic()
    }
    setIsMicOn(true)
  }, [isMicOn, prefs?.audioDeviceId, room])

  const handleToggleDeafen = React.useCallback(() => {
    setIsDeafened((prev) => {
      const next = !prev
      room.playbackManager?.setRemoteAudioMuted(next)
      if (next) {
        micBeforeDeafenRef.current = isMicOn
        if (isMicOn) {
          void room.muteMic().then(() => setIsMicOn(false))
        }
      } else if (micBeforeDeafenRef.current && micPublishedRef.current) {
        void room.unmuteMic().then(() => setIsMicOn(true))
      }
      return next
    })
  }, [isMicOn, room])

  const handleToggleWebcam = React.useCallback(async () => {
    if (isWebcamOn) {
      await room.unpublishWebcam()
      setIsWebcamOn(false)
      return
    }
    await room.publishWebcam(prefs?.videoDeviceId ?? null)
    setIsWebcamOn(true)
  }, [isWebcamOn, prefs?.videoDeviceId, room])

  const handleToggleScreen = React.useCallback(async () => {
    if (isScreenSharing) {
      await room.unpublishScreen()
      setIsScreenSharing(false)
      return
    }
    setShowQualityPicker(true)
  }, [isScreenSharing, room])

  const handleQualityPick = React.useCallback(
    async (key: Parameters<typeof bandwidth.setQualityKey>[0]) => {
      setShowQualityPicker(false)
      bandwidth.setQualityKey(key)
      if (isScreenSharing) {
        try {
          await room.changeQuality(key)
        } catch (err) {
          console.error("[VoiceChannel] quality change failed:", err)
        }
        return
      }
      try {
        const stream = await room.publishScreen(key)
        if (!stream) return
        setIsScreenSharing(true)
        stream
          .getVideoTracks()[0]
          ?.addEventListener("ended", () => setIsScreenSharing(false))
      } catch (err) {
        console.error("[VoiceChannel] screen share failed:", err)
      }
    },
    [bandwidth, isScreenSharing, room]
  )

  const handleSwitchScreen = React.useCallback(async () => {
    if (!isScreenSharing) return
    try {
      const stream = await room.switchScreenSource(bandwidth.qualityKey)
      stream
        ?.getVideoTracks()[0]
        ?.addEventListener("ended", () => setIsScreenSharing(false))
    } catch (err) {
      console.error("[VoiceChannel] switch source failed:", err)
    }
  }, [bandwidth.qualityKey, isScreenSharing, room])

  const handleOpenMicPicker = React.useCallback(async () => {
    setAudioDevices(await listDevices("audioinput"))
    setShowMicPicker(true)
  }, [])

  const handleOpenWebcamPicker = React.useCallback(async () => {
    setVideoDevices(await listDevices("videoinput"))
    setShowWebcamPicker(true)
  }, [])

  const handleOpenOutputPicker = React.useCallback(async () => {
    if (!outputDeviceSelectable) return
    setOutputDevices(await listDevices("audiooutput"))
    setShowOutputPicker(true)
  }, [outputDeviceSelectable])

  const handlePickOutput = React.useCallback(
    async (deviceId: string) => {
      setShowOutputPicker(false)
      const next: VoiceDevicePrefs = {
        audioDeviceId: prefs?.audioDeviceId ?? null,
        videoDeviceId: prefs?.videoDeviceId ?? null,
        outputDeviceId: deviceId,
        audioEnabled: prefs?.audioEnabled ?? true,
        videoEnabled: prefs?.videoEnabled ?? false,
        dontAskAgain: prefs?.dontAskAgain ?? true,
        updatedAt: Date.now(),
      }
      setPrefs(next)
      if (currentUserId) {
        void saveVoiceDevicePrefs(currentUserId, next).catch(() => {})
      }
      try {
        await room.playbackManager?.setSinkId(deviceId)
      } catch (err) {
        console.error("[VoiceChannel] output device switch failed:", err)
      }
    },
    [currentUserId, prefs, room.playbackManager]
  )

  const handlePickMic = React.useCallback(
    async (deviceId: string) => {
      setShowMicPicker(false)
      const next: VoiceDevicePrefs = {
        audioDeviceId: deviceId,
        videoDeviceId: prefs?.videoDeviceId ?? null,
        audioEnabled: true,
        videoEnabled: prefs?.videoEnabled ?? false,
        dontAskAgain: prefs?.dontAskAgain ?? true,
        updatedAt: Date.now(),
      }
      setPrefs(next)
      if (currentUserId) {
        void saveVoiceDevicePrefs(currentUserId, next).catch(() => {})
      }
      if (micPublishedRef.current) await room.unpublishMic()
      await room.publishMic(deviceId)
      micPublishedRef.current = true
      setIsMicOn(true)
    },
    [currentUserId, prefs, room]
  )

  const handlePickWebcam = React.useCallback(
    async (deviceId: string) => {
      setShowWebcamPicker(false)
      const next: VoiceDevicePrefs = {
        audioDeviceId: prefs?.audioDeviceId ?? null,
        videoDeviceId: deviceId,
        audioEnabled: prefs?.audioEnabled ?? true,
        videoEnabled: true,
        dontAskAgain: prefs?.dontAskAgain ?? true,
        updatedAt: Date.now(),
      }
      setPrefs(next)
      if (currentUserId) {
        void saveVoiceDevicePrefs(currentUserId, next).catch(() => {})
      }
      if (isWebcamOn) await room.unpublishWebcam()
      await room.publishWebcam(deviceId)
      setIsWebcamOn(true)
    },
    [currentUserId, isWebcamOn, prefs, room]
  )

  const handleLeave = React.useCallback(async () => {
    try {
      await room.disconnectRoom()
    } catch {
      // already disconnected
    }
    void Promise.resolve(onLeave())
  }, [room, onLeave])

  const handleRejoin = React.useCallback(async () => {
    try {
      await room.disconnectRoom()
    } catch {
      // ignore
    }
    try {
      await room.connectRoom(roomName, displayName, channel.id)
    } catch (err) {
      console.error("[VoiceChannel] rejoin failed:", err)
    }
  }, [room, roomName, displayName, channel.id])

  // Keep the imperative voice-controls handle in sync with the latest
  // closures. Refs do not participate in render output, so this effect
  // is safe to refire — but it MUST NOT call onVoiceStateChange. Doing
  // so re-enters the parent on every render, and because `handleToggle*`
  // callbacks are rebuilt every render through the (unmemoised) `room`
  // object, that re-entry triggers an infinite update loop.
  React.useEffect(() => {
    if (!voiceControlsRef) return
    voiceControlsRef.current = {
      toggleMic: handleToggleMic,
      toggleDeafen: handleToggleDeafen,
      toggleScreenShare: handleToggleScreen,
      switchScreenSource: handleSwitchScreen,
      toggleWebcam: handleToggleWebcam,
      isScreenSharing,
      isWebcamOn,
    }
  })

  // Boolean-only state notification: refires only when one of the four
  // toggles actually flips, not on every render of this component.
  React.useEffect(() => {
    onVoiceStateChange?.({ isMicOn, isDeafened, isScreenSharing, isWebcamOn })
  }, [onVoiceStateChange, isMicOn, isDeafened, isScreenSharing, isWebcamOn])

  React.useEffect(() => {
    if (!isScreenSharing) setLocalScreenWatched(false)
  }, [isScreenSharing])

  if (room.error) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-background p-6">
        <p className="text-sm text-destructive">{String(room.error)}</p>
        <Button onClick={() => void onLeave()}>Leave</Button>
      </div>
    )
  }

  return (
    <div className="relative flex h-full w-full flex-col bg-background">
      <div ref={audioContainerRef} className="hidden" />

      <div className="relative flex-1 overflow-hidden">
        <VoiceReconnectOverlay
          isReconnecting={room.isVoiceReconnecting}
          hasFailed={room.voiceReconnectFailed}
          onRejoin={handleRejoin}
        />
        {room.room ? (
          <RoomContext.Provider value={room.room}>
            <VoiceParticipantGrid className="p-4" />
          </RoomContext.Provider>
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Connecting…
          </div>
        )}
        {hasJoined ? (
          <VoiceControlsBar
            isReady={room.isReady}
            isMicOn={isMicOn}
            isDeafened={isDeafened}
            isWebcamOn={isWebcamOn}
            isScreenSharing={isScreenSharing}
            qualityKey={bandwidth.qualityKey}
            onToggleMic={handleToggleMic}
            onToggleDeafen={handleToggleDeafen}
            onToggleWebcam={handleToggleWebcam}
            onToggleScreen={handleToggleScreen}
            onSwitchScreenSource={handleSwitchScreen}
            outputDeviceSelectable={outputDeviceSelectable}
            onPickMicDevice={handleOpenMicPicker}
            onPickWebcamDevice={handleOpenWebcamPicker}
            onPickOutputDevice={handleOpenOutputPicker}
            onLeave={handleLeave}
          />
        ) : null}
      </div>

      <VoicePrejoinDialog
        channelName={channel.name}
        open={prejoinOpen}
        onConfirm={handlePrejoinConfirm}
        onCancel={handlePrejoinCancel}
        initial={
          prefs
            ? {
                audioDeviceId: prefs.audioDeviceId,
                videoDeviceId: prefs.videoDeviceId,
                audioEnabled: prefs.audioEnabled,
                videoEnabled: prefs.videoEnabled,
                dontAskAgain: prefs.dontAskAgain,
              }
            : undefined
        }
      />

      <VoiceQualityPickerDialog
        open={showQualityPicker}
        recommendedQualityKey={bandwidth.recommendedQualityKey}
        recommendedUploadMbps={bandwidth.recommendedUploadMbps}
        onSelect={(key) => void handleQualityPick(key)}
        onCancel={() => setShowQualityPicker(false)}
      />

      <VoiceDevicePickerDialog
        open={showMicPicker}
        title="Choose microphone"
        devices={audioDevices}
        selectedDeviceId={prefs?.audioDeviceId ?? null}
        onSelect={(id) => void handlePickMic(id)}
        onCancel={() => setShowMicPicker(false)}
      />

      <VoiceDevicePickerDialog
        open={showWebcamPicker}
        title="Choose camera"
        devices={videoDevices}
        selectedDeviceId={prefs?.videoDeviceId ?? null}
        onSelect={(id) => void handlePickWebcam(id)}
        onCancel={() => setShowWebcamPicker(false)}
      />

      <VoiceDevicePickerDialog
        open={showOutputPicker}
        title="Choose audio output"
        description="Route remote voices to a specific speaker or headset."
        devices={outputDevices}
        selectedDeviceId={prefs?.outputDeviceId ?? null}
        onSelect={(id) => void handlePickOutput(id)}
        onCancel={() => setShowOutputPicker(false)}
      />
    </div>
  )
}
