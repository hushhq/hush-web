/**
 * Message types consumed by the ported chat components.
 *
 * Mock data lives only in the test prototype. In hush-web the values come
 * from the adapter layer (`useMessagesForChannel`, `usePinnedMessages`)
 * which queries `transcriptVault` + `useMLS`. The functions exported here
 * exist for API compatibility with the prototype source — they return
 * empty arrays. Consumers should pass `messages` as a prop sourced from
 * the adapter and rely on these helpers only as a fallback (no debt
 * because the fallback is never expected to fire when wired correctly).
 */

export interface ThreadSummary {
  count: number
  lastReply: string
  participants: { initials: string }[]
}

export interface SampleMessage {
  id: string
  author: string
  initials: string
  timestamp: string
  body: string
  isMention?: boolean
  date: string
  thread?: ThreadSummary
}

export function getMessagesForChannel(_channelId: string): SampleMessage[] {
  return []
}

export function getPinnedForChannel(_channelId: string): SampleMessage[] {
  return []
}
