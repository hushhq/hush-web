import type { VoiceParticipantInfo } from "./types"

interface VoiceParticipantsResult {
  participants: VoiceParticipantInfo[]
  /** True when a real LiveKit room is connected for this channel. */
  isLive: boolean
}

interface VoiceParticipantsProps {
  serverId: string | null
  channelId: string | null
}

/**
 * Bridges `useRoom()` LiveKit state to a flat `VoiceParticipantInfo[]` shape
 * used by the ported `<ChannelSidebar />` avatar group + tooltip.
 *
 * Inside an active call the ported `<VoiceChannelView />` continues to
 * mount LiveKit's real `<ParticipantGrid />`. This hook is for the SIDEBAR
 * preview only — what hush-test calls the "spatial sidebar" pattern.
 *
 * Phase 3 stub returns empty. Phase 5 wires `useRoom().participants`.
 *
 * TODO(yarin, 2026-05-04): if `useRoom()` exposes a participants Map for a
 * given channel even when the local user hasn't joined, surface it here.
 * Otherwise this hook returns empty for non-joined channels and the avatar
 * group simply doesn't render — preserving privacy guarantee that we never
 * leak presence the protocol won't deliver.
 */
export function useVoiceParticipantsForChannel(
  _props: VoiceParticipantsProps
): VoiceParticipantsResult {
  return {
    participants: [],
    isLive: false,
  }
}
