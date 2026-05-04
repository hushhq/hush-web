import * as React from "react"
import { SmilePlusIcon, SendHorizonalIcon } from "lucide-react"

import {
  ChatToolbar,
  ChatToolbarAddon,
  ChatToolbarButton,
  ChatToolbarAttachmentButton,
} from "@/components/chat"
import {
  NovelComposer,
  type NovelComposerHandle,
} from "@/components/novel-composer"

interface MessageComposerProps {
  channelName: string
  placeholder?: string
  onSend: (text: string) => void
}

export function MessageComposer({
  channelName,
  placeholder,
  onSend,
}: MessageComposerProps) {
  const composerRef = React.useRef<NovelComposerHandle>(null)
  const [isEmpty, setIsEmpty] = React.useState(true)

  return (
    <ChatToolbar>
      <ChatToolbarAddon align="inline-start">
        <ChatToolbarAttachmentButton />
      </ChatToolbarAddon>
      <div className="order-2 flex min-w-0 flex-1 items-center self-center">
        <NovelComposer
          ref={composerRef}
          channelName={channelName}
          placeholder={placeholder}
          onSend={onSend}
          onEmptyChange={setIsEmpty}
        />
      </div>
      <ChatToolbarAddon align="inline-end">
        <ChatToolbarButton aria-label="Add emoji">
          <SmilePlusIcon />
        </ChatToolbarButton>
        <ChatToolbarButton
          aria-label="Send"
          disabled={isEmpty}
          onClick={() => composerRef.current?.send()}
        >
          <SendHorizonalIcon />
        </ChatToolbarButton>
      </ChatToolbarAddon>
    </ChatToolbar>
  )
}
