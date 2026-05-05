import * as React from "react"

import { Spinner } from "@/components/ui/spinner"

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
   * LiveKit + presence + reconnect) here. The legacy component auto-joins the
   * room on mount — no prejoin step — matching the user expectation that
   * opening a voice channel connects immediately.
   */
  voiceBody?: React.ReactNode
  /** Unused — kept for back-compat with old call sites. */
  token?: string
  serverUrl?: string
  /** Unused — kept for back-compat with old call sites. */
  mockParticipants?: VoiceParticipantMock[]
}

/**
 * Voice surface for a channel. Renders the production `voiceBody` (legacy
 * `<VoiceChannel />`) when supplied. The previous prototype fallback —
 * PrejoinScreen + ParticipantGrid + mock tiles — has been removed because it
 * shadowed the legacy mount when the URL pointed at a voice channel before
 * `joinedVoice` was set (deep links, refreshes), violating the
 * "open voice channel = join LiveKit immediately" UX. When no `voiceBody` is
 * supplied we render a transient connecting state; AuthenticatedApp's
 * auto-join effect will set `joinedVoice` and the legacy mount will replace
 * this view on the next render.
 */
export function VoiceChannelView({
  channelName,
  voiceBody,
}: VoiceChannelViewProps) {
  if (voiceBody) {
    return (
      <div className="relative flex h-full w-full flex-col bg-background">
        {voiceBody}
      </div>
    )
  }
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-background text-muted-foreground">
      <Spinner className="size-6" />
      <span className="text-sm">Connecting to {channelName}…</span>
    </div>
  )
}
