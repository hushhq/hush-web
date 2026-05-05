import * as React from "react"
import { SmilePlusIcon, SendHorizonalIcon } from "lucide-react"

import {
  ChatToolbar,
  ChatToolbarAddon,
  ChatToolbarButton,
  ChatToolbarAttachmentButton,
} from "@/components/chat/index"
import {
  NovelComposer,
  type NovelComposerHandle,
} from "@/components/novel-composer"

interface MessageComposerProps {
  channelName: string
  placeholder?: string
  onSend: (text: string) => void
  /** Files dropped from the attachment button. The parent owns upload
   *  state + AttachmentRef collection; the composer only forwards. */
  onFilesSelected?: (files: File[]) => void
  /** Block send while attachments are still uploading. Empty-text +
   *  attachments-ready is a valid send (envelope.text is allowed empty). */
  sendDisabled?: boolean
  attachmentDock?: React.ReactNode
  /** Opens the GIF picker; wired to `/gif` slash command and the
   *  toolbar GIF button when present. */
  onOpenGif?: () => void
}

export function MessageComposer({
  channelName,
  placeholder,
  onSend,
  onFilesSelected,
  sendDisabled,
  attachmentDock,
  onOpenGif,
}: MessageComposerProps) {
  const composerRef = React.useRef<NovelComposerHandle>(null)
  const [isEmpty, setIsEmpty] = React.useState(true)

  return (
    <ChatToolbar>
      {attachmentDock ? (
        <ChatToolbarAddon align="block-start" className="w-full">
          {attachmentDock}
        </ChatToolbarAddon>
      ) : null}
      <ChatToolbarAddon align="inline-start">
        <ChatToolbarAttachmentButton onFilesSelected={onFilesSelected} />
      </ChatToolbarAddon>
      <div className="order-2 flex min-w-0 flex-1 items-center self-center">
        <NovelComposer
          ref={composerRef}
          channelName={channelName}
          placeholder={placeholder}
          onSend={onSend}
          onEmptyChange={setIsEmpty}
          allowEmpty={Boolean(attachmentDock)}
          onOpenGif={onOpenGif}
        />
      </div>
      <ChatToolbarAddon align="inline-end">
        <ChatToolbarButton aria-label="Add emoji">
          <SmilePlusIcon />
        </ChatToolbarButton>
        <ChatToolbarButton
          aria-label="Send"
          disabled={(isEmpty && !attachmentDock) || sendDisabled}
          onClick={() => composerRef.current?.send()}
        >
          <SendHorizonalIcon />
        </ChatToolbarButton>
      </ChatToolbarAddon>
    </ChatToolbar>
  )
}
