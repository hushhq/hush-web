import { CheckIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Empty, EmptyDescription } from "@/components/ui/empty"
import { cn } from "@/lib/utils"

interface DeviceOption {
  deviceId: string
  label: string
}

interface VoiceDevicePickerDialogProps {
  open: boolean
  title: string
  description?: string
  devices: DeviceOption[]
  selectedDeviceId: string | null
  onSelect: (deviceId: string) => void
  onCancel: () => void
}

/**
 * Quick device-switch popover. Triggered from the chevron next to the
 * mic / webcam button in the controls bar, after the user has already
 * confirmed prejoin once. No camera preview — list-only — so the
 * switch is one click and the selection round-trips through
 * `voiceDevicePrefs`.
 */
export function VoiceDevicePickerDialog({
  open,
  title,
  description,
  devices,
  selectedDeviceId,
  onSelect,
  onCancel,
}: VoiceDevicePickerDialogProps) {
  function handleOpenChange(next: boolean) {
    if (!next) onCancel()
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description ? (
            <DialogDescription>{description}</DialogDescription>
          ) : null}
        </DialogHeader>

        <div className="flex flex-col gap-1">
          {devices.length === 0 ? (
            <Empty>
              <EmptyDescription>No devices found.</EmptyDescription>
            </Empty>
          ) : (
            devices.map((device) => {
              const isSelected = device.deviceId === selectedDeviceId
              return (
                <button
                  key={device.deviceId}
                  type="button"
                  onClick={() => onSelect(device.deviceId)}
                  aria-pressed={isSelected}
                  className={cn(
                    "flex items-center justify-between rounded-md border border-transparent px-3 py-2 text-left text-sm transition-colors",
                    "hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    isSelected && "border-border bg-accent/50"
                  )}
                >
                  <span className="truncate">
                    {device.label || "Unknown device"}
                  </span>
                  {isSelected ? (
                    <CheckIcon className="size-4 shrink-0 text-primary" />
                  ) : null}
                </button>
              )
            })
          )}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
