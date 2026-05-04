import type { ReactNode } from "react"
import { LiveKitRoom, RoomAudioRenderer } from "@livekit/components-react"

interface VideoRoomProviderProps {
  /** LiveKit access token. When omitted the room renders in offline preview mode. */
  token?: string
  /** LiveKit server URL (e.g. wss://your.livekit.cloud). */
  serverUrl?: string
  /** Connect to LiveKit. Defaults to true when token+serverUrl provided, otherwise false. */
  connect?: boolean
  audio?: boolean
  video?: boolean
  className?: string
  children: ReactNode
  onConnected?: () => void
  onDisconnected?: () => void
  onError?: (error: Error) => void
}

export function VideoRoomProvider({
  token,
  serverUrl,
  connect,
  audio = false,
  video = false,
  className,
  children,
  onConnected,
  onDisconnected,
  onError,
}: VideoRoomProviderProps) {
  const hasCredentials = Boolean(token && serverUrl)
  const shouldConnect = connect ?? hasCredentials

  return (
    <LiveKitRoom
      token={token ?? ""}
      serverUrl={serverUrl ?? "wss://placeholder.livekit.cloud"}
      connect={shouldConnect}
      audio={audio}
      video={video}
      className={className}
      onConnected={onConnected}
      onDisconnected={onDisconnected}
      onError={(err) => onError?.(err)}
    >
      <RoomAudioRenderer />
      {children}
    </LiveKitRoom>
  )
}
