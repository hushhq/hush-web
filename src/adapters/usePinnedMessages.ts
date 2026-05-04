import type { SampleMessage } from "./types"

interface PinnedMessagesResult {
  messages: SampleMessage[]
  /** Always false in hush-web today: no backend support. */
  isSupported: boolean
  jumpTo: (messageId: string) => void
}

interface PinnedMessagesProps {
  channelId: string | null
}

/**
 * Pinned messages adapter — DISABLED feature.
 *
 * hush-web has no pinned-messages backend. The ported pin icon in the
 * channel header must render but the popover should display an empty
 * state. The trigger can be left enabled (clicking opens an empty
 * popover) or gated behind `isSupported` to render disabled.
 *
 * TODO(yarin, 2026-05-04): when the pin-message API ships, wire here.
 */
export function usePinnedMessages(
  _props: PinnedMessagesProps
): PinnedMessagesResult {
  return {
    messages: [],
    isSupported: false,
    jumpTo: () => {
      // no-op until backend support lands
    },
  }
}
