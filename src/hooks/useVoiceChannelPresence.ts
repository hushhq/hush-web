import * as React from "react"

import type { VoiceParticipantInfo } from "@/adapters/types"

/**
 * Backend `voice_state_update` payload (see
 * `internal/api/webhook.go#LiveKitWebhookHandler`). Broadcast on every
 * LiveKit participant join / leave webhook.
 */
interface VoiceStateUpdate {
  type: "voice_state_update"
  channel_id: string
  participants: Array<{ userId: string; displayName: string }>
}

interface VoiceGroupDestroyed {
  type: "voice_group_destroyed"
  channel_id: string
}

interface WsClientLike {
  on: (event: string, handler: (msg: unknown) => void) => void
  off?: (event: string, handler: (msg: unknown) => void) => void
}

/**
 * Per-channel voice roster, keyed by channel id. Built up incrementally
 * from `voice_state_update` WS messages — when a peer joins or leaves a
 * voice channel, the backend rebroadcasts the full participant list for
 * that channel and this hook updates the corresponding map entry.
 *
 * Bootstrap caveat: a tab that connects after others are already in a
 * voice channel does not see them until the next join / leave fires.
 * A future enhancement would be to ship the snapshot on the WS hello
 * frame; the shape returned here is forwards-compatible with that.
 */
export function useVoiceChannelPresence(
  wsClient: WsClientLike | null | undefined,
  currentUserId: string
): Map<string, VoiceParticipantInfo[]> {
  const [presence, setPresence] = React.useState<
    Map<string, VoiceParticipantInfo[]>
  >(new Map())

  React.useEffect(() => {
    if (!wsClient) return

    const onUpdate = (raw: unknown) => {
      const msg = raw as VoiceStateUpdate
      if (msg?.type !== "voice_state_update") return
      if (!msg.channel_id) return
      const tiles: VoiceParticipantInfo[] = (msg.participants ?? []).map(
        (p) => ({
          id: p.userId,
          name:
            p.userId === currentUserId
              ? "You"
              : (p.displayName || p.userId || "Anonymous"),
          initials: deriveInitials(p.displayName || p.userId),
        })
      )
      setPresence((prev) => {
        const next = new Map(prev)
        if (tiles.length === 0) {
          next.delete(msg.channel_id)
        } else {
          next.set(msg.channel_id, tiles)
        }
        return next
      })
    }

    const onDestroyed = (raw: unknown) => {
      const msg = raw as VoiceGroupDestroyed
      if (msg?.type !== "voice_group_destroyed") return
      if (!msg.channel_id) return
      setPresence((prev) => {
        if (!prev.has(msg.channel_id)) return prev
        const next = new Map(prev)
        next.delete(msg.channel_id)
        return next
      })
    }

    wsClient.on("voice_state_update", onUpdate)
    wsClient.on("voice_group_destroyed", onDestroyed)
    return () => {
      wsClient.off?.("voice_state_update", onUpdate)
      wsClient.off?.("voice_group_destroyed", onDestroyed)
    }
  }, [wsClient, currentUserId])

  return presence
}

function deriveInitials(name: string): string {
  if (!name) return "?"
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return parts[0]?.[0]?.toUpperCase() ?? "?"
}
