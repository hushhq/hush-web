/**
 * Adapter types
 *
 * Mirrors the prop shapes consumed by ported hush-test components. Adapters
 * in this directory are the only place allowed to import both these UI shapes
 * and hush-web's context/hook shapes — they are the seam between the legacy
 * data layer and the new presentation layer.
 */

export type ChannelKind = "text" | "voice"

export interface VoiceParticipantInfo {
  id: string
  name: string
  initials: string
  isMuted?: boolean
  isDeafened?: boolean
  isSpeaking?: boolean
}

export interface Channel {
  id: string
  name: string
  kind: ChannelKind
  categoryId: string | null
  unreadCount?: number
  mentionCount?: number
  participants?: VoiceParticipantInfo[]
}

export interface ChannelCategory {
  id: string
  name: string
}

export type MemberPresence = "online" | "idle" | "dnd" | "offline"
export type MemberRole = "owner" | "admin" | "moderator" | "member" | "bot"

export interface ServerMember {
  id: string
  name: string
  initials: string
  presence?: MemberPresence
  role: MemberRole
}

export interface SampleMessage {
  id: string
  author: string
  initials: string
  timestamp: string
  body: string
  isMention?: boolean
  date: string
}

/**
 * Maps hush-web `permissionLevel` (0-3) to hush-test `MemberRole` string.
 * 0 = member, 1 = moderator, 2 = admin, 3 = owner.
 */
export function permissionLevelToRole(level: number): MemberRole {
  if (level >= 3) return "owner"
  if (level >= 2) return "admin"
  if (level >= 1) return "moderator"
  return "member"
}

/**
 * Two-letter initials from a display/user name. Empty string returns "?".
 */
export function deriveInitials(name: string): string {
  const trimmed = (name ?? "").trim()
  if (!trimmed) return "?"
  const parts = trimmed.split(/\s+/).slice(0, 2)
  return parts.map((p) => p[0]?.toUpperCase() ?? "").join("") || "?"
}
