import * as React from "react"
import { HeadphoneOffIcon, MicOffIcon } from "lucide-react"

import {
  ControlsBar,
  ParticipantGrid,
  PrejoinScreen,
  VideoRoomProvider,
  type JoinSettings,
} from "@/components/video"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export interface VoiceParticipantMock {
  id: string
  name: string
  initials: string
  isMuted?: boolean
  isDeafened?: boolean
  isSpeaking?: boolean
}

interface VoiceChannelViewProps {
  channelName: string
  /**
   * Production hush-web mounts the legacy <VoiceChannel /> (Signal/MLS-encrypted
   * LiveKit + presence + reconnect) here. When omitted the prototype's offline
   * prejoin / mock grid renders as fallback.
   */
  voiceBody?: React.ReactNode
  /** Optional LiveKit credentials for the prototype offline path. */
  token?: string
  serverUrl?: string
  mockParticipants?: VoiceParticipantMock[]
}

export function VoiceChannelView({
  channelName,
  voiceBody,
  token,
  serverUrl,
  mockParticipants = [],
}: VoiceChannelViewProps) {
  if (voiceBody) {
    return (
      <div className="relative flex h-full w-full flex-col bg-background">
        {voiceBody}
      </div>
    )
  }
  return (
    <PrototypeFallback
      channelName={channelName}
      token={token}
      serverUrl={serverUrl}
      mockParticipants={mockParticipants}
    />
  )
}

function PrototypeFallback({
  channelName,
  token,
  serverUrl,
  mockParticipants = [],
}: {
  channelName: string
  token?: string
  serverUrl?: string
  mockParticipants?: VoiceParticipantMock[]
}) {
  const [joined, setJoined] = React.useState(false)
  const [settings, setSettings] = React.useState<JoinSettings | null>(null)

  if (!joined) {
    return (
      <PrejoinScreen
        roomName={channelName}
        onJoin={(next) => {
          setSettings(next)
          setJoined(true)
        }}
      />
    )
  }

  const useMockGrid = !token && mockParticipants.length > 0

  return (
    <div className="relative flex h-full w-full flex-col bg-background">
      <VideoRoomProvider
        token={token}
        serverUrl={serverUrl}
        audio={settings?.audioEnabled ?? false}
        video={settings?.videoEnabled ?? false}
        className="flex h-full w-full flex-col"
      >
        <div className="flex flex-1 flex-col overflow-auto p-6 pb-24">
          {useMockGrid ? (
            <MockParticipantGrid participants={mockParticipants} />
          ) : (
            <ParticipantGrid className="min-h-0 flex-1" />
          )}
        </div>
        <ControlsBar
          onLeave={() => setJoined(false)}
          initialMicEnabled={settings?.audioEnabled ?? true}
          initialCameraEnabled={settings?.videoEnabled ?? false}
        />
      </VideoRoomProvider>
    </div>
  )
}

function MockParticipantGrid({
  participants,
}: {
  participants: VoiceParticipantMock[]
}) {
  const cols = gridCols(participants.length)
  return (
    <div
      className={cn(
        "grid min-h-0 flex-1 auto-rows-fr gap-3",
        cols
      )}
    >
      {participants.map((p) => (
        <MockTile key={p.id} participant={p} />
      ))}
    </div>
  )
}

function gridCols(count: number): string {
  if (count <= 1) return "grid-cols-1"
  if (count <= 4) return "grid-cols-2"
  if (count <= 9) return "grid-cols-3"
  return "grid-cols-4"
}

function MockTile({ participant }: { participant: VoiceParticipantMock }) {
  return (
    <Card
      className={cn(
        "relative flex aspect-video items-center justify-center overflow-hidden border bg-muted/30 p-0 transition-colors",
        participant.isSpeaking && "ring-2 ring-success"
      )}
    >
      <div className="flex size-20 items-center justify-center rounded-full bg-muted text-2xl font-medium text-muted-foreground">
        {participant.initials}
      </div>
      <div className="absolute inset-x-2 bottom-2 flex items-center justify-between gap-2 rounded-md bg-background/80 px-2 py-1 text-xs backdrop-blur-sm">
        <span className="flex items-center gap-1.5 truncate">
          {participant.isSpeaking ? (
            <span className="size-1.5 shrink-0 animate-pulse rounded-full bg-success" />
          ) : null}
          <span className="truncate">{participant.name}</span>
        </span>
        <span className="flex shrink-0 items-center gap-1 text-muted-foreground">
          {participant.isMuted ? <MicOffIcon className="size-3.5" /> : null}
          {participant.isDeafened ? (
            <HeadphoneOffIcon className="size-3.5" />
          ) : null}
        </span>
      </div>
    </Card>
  )
}
