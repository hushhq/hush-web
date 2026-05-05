/**
 * Emoji picker wrapped in a shadcn Popover. Trigger is the existing
 * `SmilePlusIcon` button in the composer toolbar — previously
 * decorative, now wired to insert the chosen unicode codepoint at the
 * editor cursor via the parent's `onSelect` callback.
 *
 * `@emoji-mart/data` is large; it is dynamically imported on first
 * open so the cold composer mount stays fast.
 */
import * as React from "react"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface EmojiPickerPopoverProps {
  trigger: React.ReactNode
  onSelect: (native: string) => void
  align?: "start" | "center" | "end"
  side?: "top" | "right" | "bottom" | "left"
}

interface EmojiMartSelection {
  native?: string
  shortcodes?: string
}

export function EmojiPickerPopover({
  trigger,
  onSelect,
  align = "end",
  side = "top",
}: EmojiPickerPopoverProps) {
  const [open, setOpen] = React.useState(false)
  const [PickerComponent, setPickerComponent] =
    React.useState<React.ComponentType<Record<string, unknown>> | null>(null)
  const [data, setData] = React.useState<unknown>(null)

  React.useEffect(() => {
    if (!open || PickerComponent) return
    let cancelled = false
    Promise.all([
      import("@emoji-mart/react"),
      import("@emoji-mart/data"),
    ]).then(([mod, dataMod]) => {
      if (cancelled) return
      const Comp = (mod.default ?? (mod as unknown)) as React.ComponentType<
        Record<string, unknown>
      >
      setPickerComponent(() => Comp)
      setData(dataMod.default ?? dataMod)
    })
    return () => {
      cancelled = true
    }
  }, [open, PickerComponent])

  const handleSelect = React.useCallback(
    (selection: EmojiMartSelection) => {
      const native = selection?.native
      if (typeof native === "string" && native.length > 0) {
        onSelect(native)
        setOpen(false)
      }
    },
    [onSelect]
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent
        align={align}
        side={side}
        className="w-auto border-0 bg-transparent p-0 shadow-none"
      >
        {PickerComponent && data ? (
          <PickerComponent
            data={data}
            onEmojiSelect={handleSelect}
            theme="auto"
            previewPosition="none"
            skinTonePosition="search"
            navPosition="bottom"
          />
        ) : (
          <div className="rounded-md bg-popover p-4 text-xs text-muted-foreground shadow-md">
            Loading…
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
