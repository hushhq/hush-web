import * as React from "react"

import { getLiveKitVoiceState } from "@/lib/api"
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

/**
 * Backend `voice.mute_state` re-broadcast (see
 * `internal/ws/client.go`). Originator-supplied flags carrying the
 * sending user's mute/deafen state so peers can paint badges on the
 * corresponding compact roster avatar + active-call participant tile.
 *
 * Deafen has no LiveKit track equivalent — it's a client-only flag —
 * so it only reaches remote peers through this WS frame.
 */
interface VoiceMuteState {
  type: "voice.mute_state"
  server_id?: string
  channel_id: string
  user_id: string
  is_muted: boolean
  is_deafened: boolean
}

interface WsClientLike {
  on: (event: string, handler: (msg: unknown) => void) => void
  off?: (event: string, handler: (msg: unknown) => void) => void
}

interface VoiceStateSnapshot {
  participantsByChannel?: Record<
    string,
    Array<{ userId: string; displayName: string }>
  >
}

/**
 * Per-channel voice roster, keyed by channel id. Built up incrementally
 * from `voice_state_update` WS messages — when a peer joins or leaves a
 * voice channel, the backend rebroadcasts the full participant list for
 * that channel and this hook updates the corresponding map entry.
 *
 * Mute/deafen flags fold in from `voice.mute_state` re-broadcasts so
 * each row in the returned roster carries the live remote state. The
 * mute map is scoped per channel so the same user can be muted in one
 * channel and unmuted in another. State for a channel is dropped when
 * the roster goes empty, so a leaver does not leave a stale mute
 * badge on a future re-join.
 *
 * A bootstrap HTTP snapshot covers the initial server load, then WS
 * updates keep the map current. Without that snapshot, a tab opened
 * after people had already joined voice would stay empty until the
 * next join / leave webhook.
 */
export function useVoiceChannelPresence(
  wsClient: WsClientLike | null | undefined,
  currentUserId: string,
  token: string | null | undefined,
  serverId: string | null | undefined,
  baseUrl = ""
): Map<string, VoiceParticipantInfo[]> {
  const [presence, setPresence] = React.useState<
    Map<string, VoiceParticipantInfo[]>
  >(new Map())
  // Per-channel mute state keyed by user id. Stored separately from
  // the roster so a `voice.mute_state` arriving before the
  // `voice_state_update` for the same user doesn't get dropped.
  const [muteState, setMuteState] = React.useState<
    Map<string, Map<string, { isMuted: boolean; isDeafened: boolean }>>
  >(new Map())

  React.useEffect(() => {
    if (!token || !serverId) {
      setPresence(new Map())
      setMuteState(new Map())
      return
    }
    let cancelled = false
    void getLiveKitVoiceState(token, serverId, baseUrl)
      .then((snapshot: VoiceStateSnapshot) => {
        if (cancelled) return
        setPresence(snapshotToPresence(snapshot, currentUserId))
      })
      .catch((err: unknown) => {
        if (cancelled) return
        console.warn("[useVoiceChannelPresence] snapshot failed", err)
        setPresence(new Map())
      })
    return () => {
      cancelled = true
    }
  }, [token, serverId, baseUrl, currentUserId])

  React.useEffect(() => {
    if (!wsClient) return

    const onUpdate = (raw: unknown) => {
      const msg = raw as VoiceStateUpdate
      if (msg?.type !== "voice_state_update") return
      if (!msg.channel_id) return
      const tiles = participantsToPresence(msg.participants ?? [], currentUserId)
      setPresence((prev) => {
        const next = new Map(prev)
        if (tiles.length === 0) {
          next.delete(msg.channel_id)
        } else {
          next.set(msg.channel_id, tiles)
        }
        return next
      })
      if (tiles.length === 0) {
        // Channel emptied: drop the per-channel mute map so a
        // re-joiner with toggled state does not inherit a stale
        // badge.
        setMuteState((prev) => {
          if (!prev.has(msg.channel_id)) return prev
          const next = new Map(prev)
          next.delete(msg.channel_id)
          return next
        })
      }
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
      setMuteState((prev) => {
        if (!prev.has(msg.channel_id)) return prev
        const next = new Map(prev)
        next.delete(msg.channel_id)
        return next
      })
    }

    const onMuteState = (raw: unknown) => {
      const msg = raw as VoiceMuteState
      if (msg?.type !== "voice.mute_state") return
      if (!msg.channel_id || !msg.user_id) return
      setMuteState((prev) => {
        const channelMap = new Map(prev.get(msg.channel_id) ?? [])
        channelMap.set(msg.user_id, {
          isMuted: !!msg.is_muted,
          isDeafened: !!msg.is_deafened,
        })
        const next = new Map(prev)
        next.set(msg.channel_id, channelMap)
        return next
      })
    }

    wsClient.on("voice_state_update", onUpdate)
    wsClient.on("voice_group_destroyed", onDestroyed)
    wsClient.on("voice.mute_state", onMuteState)
    return () => {
      wsClient.off?.("voice_state_update", onUpdate)
      wsClient.off?.("voice_group_destroyed", onDestroyed)
      wsClient.off?.("voice.mute_state", onMuteState)
    }
  }, [wsClient, currentUserId])

  // Fold mute/deafen flags into the roster rows so consumers see a
  // single source of truth per row.
  return React.useMemo(() => {
    if (muteState.size === 0) return presence
    const merged = new Map<string, VoiceParticipantInfo[]>()
    for (const [channelId, rows] of presence) {
      const channelMute = muteState.get(channelId)
      if (!channelMute || channelMute.size === 0) {
        merged.set(channelId, rows)
        continue
      }
      merged.set(
        channelId,
        rows.map((row) => {
          const flags = channelMute.get(row.id)
          if (!flags) return row
          return {
            ...row,
            isMuted: flags.isMuted,
            isDeafened: flags.isDeafened,
          }
        }),
      )
    }
    return merged
  }, [presence, muteState])
}

function snapshotToPresence(
  snapshot: VoiceStateSnapshot,
  currentUserId: string
): Map<string, VoiceParticipantInfo[]> {
  const next = new Map<string, VoiceParticipantInfo[]>()
  for (const [channelId, participants] of Object.entries(
    snapshot.participantsByChannel ?? {}
  )) {
    const rows = participantsToPresence(participants, currentUserId)
    if (rows.length > 0) {
      next.set(channelId, rows)
    }
  }
  return next
}

function participantsToPresence(
  participants: Array<{ userId: string; displayName: string }>,
  currentUserId: string
): VoiceParticipantInfo[] {
  return participants.map((p) => ({
    id: p.userId,
    name:
      p.userId === currentUserId
        ? "You"
        : (p.displayName || p.userId || "Anonymous"),
    initials: deriveInitials(p.displayName || p.userId),
  }))
}

function deriveInitials(name: string): string {
  if (!name) return "?"
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return parts[0]?.[0]?.toUpperCase() ?? "?"
}
