import { memo } from "react"
import { Streamdown } from "streamdown"
import { code } from "@streamdown/code"

import { cn } from "@/lib/utils"

const STREAMDOWN_PLUGINS = { code }

interface MessageContentProps {
  body: string
}

export const MessageContent = memo(function MessageContent({
  body,
}: MessageContentProps) {
  return (
    <Streamdown
      plugins={STREAMDOWN_PLUGINS}
      className={cn(
        "prose prose-sm max-w-none text-foreground/90 break-words",
        "prose-p:my-0 prose-p:leading-relaxed",
        "prose-pre:m-0 prose-pre:bg-transparent prose-pre:p-0 prose-pre:text-foreground prose-pre:[&_code]:text-foreground prose-pre:[&_pre]:text-foreground",
        "prose-code:rounded prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:font-mono prose-code:text-[0.85em] prose-code:before:content-none prose-code:after:content-none",
        "prose-a:text-primary",
        "prose-strong:text-foreground",
        "dark:prose-invert"
      )}
    >
      {body}
    </Streamdown>
  )
})
