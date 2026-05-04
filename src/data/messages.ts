/**
 * Type definitions consumed by the prototype TextChannelView fallback path.
 * In production hush-web mounts Chat.jsx as the message body slot, so these
 * sample maps stay empty — the real messages come from MLS via Chat.jsx.
 */

export interface ThreadSummary {
  count: number
  lastReply: string
  participants: { initials: string }[]
}

export type SampleMessage = {
  id: string
  author: string
  initials: string
  timestamp: string
  body: string
  isMention?: boolean
  date: string
  thread?: ThreadSummary
}

export const MESSAGES_BY_CHANNEL: Record<string, SampleMessage[]> = {}

/** Pinned messages — backend support pending. */
export function getPinnedForChannel(_channelId: string): SampleMessage[] {
  return []
}

/**
 * Fallback only — production text channels render Chat.jsx instead. Returns
 * an empty array so the prototype `TextChannelView` does not display fake
 * sample messages when the messageBody slot is missing.
 */
export function getMessagesForChannel(_channelId: string): SampleMessage[] {
  return []
}
