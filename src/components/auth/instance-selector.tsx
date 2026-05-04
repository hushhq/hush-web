import * as React from "react"
import { CheckIcon, PencilIcon, PlusIcon } from "lucide-react"

import { Button } from "@/components/ui/button.tsx"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover.tsx"
import { Separator } from "@/components/ui/separator.tsx"
import { cn } from "@/lib/utils"

interface InstanceSelectorProps {
  instances: string[]
  active: string
  onSelect: (value: string) => void
  onAdd: (value: string) => void
}

export function InstanceSelector({
  instances,
  active,
  onSelect,
  onAdd,
}: InstanceSelectorProps) {
  const [open, setOpen] = React.useState(false)
  const [draft, setDraft] = React.useState("")

  const handleAdd = () => {
    const value = draft.trim().toLowerCase()
    if (!value) return
    onAdd(value)
    onSelect(value)
    setDraft("")
    setOpen(false)
  }

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
        Instance
      </span>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="flex h-10 w-full items-center justify-between rounded-md border bg-card px-3 text-sm transition-colors hover:bg-muted/40"
          >
            <span className="truncate">{active}</span>
            <PencilIcon className="size-3.5 text-muted-foreground" />
          </button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          sideOffset={6}
          className="w-(--radix-popover-trigger-width) p-1"
        >
          <div className="flex flex-col">
            {instances.map((instance) => (
              <button
                key={instance}
                type="button"
                onClick={() => {
                  onSelect(instance)
                  setOpen(false)
                }}
                className={cn(
                  "flex items-center justify-between gap-2 rounded-sm px-2 py-1.5 text-sm transition-colors hover:bg-muted",
                  instance === active && "bg-muted/60"
                )}
              >
                <span className="truncate">{instance}</span>
                {instance === active ? (
                  <CheckIcon className="size-3.5 text-muted-foreground" />
                ) : null}
              </button>
            ))}
          </div>
          <Separator className="my-1" />
          <form
            className="flex items-center gap-1 p-1"
            onSubmit={(event) => {
              event.preventDefault()
              handleAdd()
            }}
          >
            <Input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="custom.instance.org"
              className="h-8 text-xs"
            />
            <Button
              type="submit"
              size="icon-sm"
              variant="secondary"
              disabled={!draft.trim()}
              aria-label="Add instance"
            >
              <PlusIcon />
            </Button>
          </form>
        </PopoverContent>
      </Popover>
    </div>
  )
}
