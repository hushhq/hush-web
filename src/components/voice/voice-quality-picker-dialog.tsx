import { ChevronRightIcon } from "lucide-react"

import { QUALITY_PRESETS } from "@/utils/constants"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type QualityKey = keyof typeof QUALITY_PRESETS

interface VoiceQualityPickerDialogProps {
  open: boolean
  /** Quality key recommended by the bandwidth probe, or null when unknown. */
  recommendedQualityKey: QualityKey | null
  recommendedUploadMbps: number | null
  onSelect: (key: QualityKey) => void
  onCancel: () => void
}

function formatRecommendedLabel(uploadMbps: number | null): string | null {
  if (uploadMbps == null) return null
  if (uploadMbps >= 99) return "Recommended: localhost"
  return `Recommended: ${uploadMbps.toFixed(0)} Mbps`
}

/**
 * Restyled screen-share quality picker. Matches the legacy flow: the
 * dialog opens *before* the browser's window picker so the chosen
 * preset is locked in by the time `getDisplayMedia` runs. Closing the
 * dialog without a pick aborts the share.
 */
export function VoiceQualityPickerDialog({
  open,
  recommendedQualityKey,
  recommendedUploadMbps,
  onSelect,
  onCancel,
}: VoiceQualityPickerDialogProps) {
  const recommendedLabel = formatRecommendedLabel(recommendedUploadMbps)

  function handleOpenChange(next: boolean) {
    if (!next) onCancel()
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Choose stream quality</DialogTitle>
          <DialogDescription>
            Pick the resolution before selecting the window or screen.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2">
          {(Object.entries(QUALITY_PRESETS) as [QualityKey, typeof QUALITY_PRESETS[QualityKey]][]).map(
            ([key, preset]) => (
              <button
                key={key}
                type="button"
                onClick={() => onSelect(key)}
                className="group flex w-full items-center justify-between rounded-md border border-border bg-card px-4 py-3 text-left transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span className="flex flex-col">
                  <span className="text-sm font-medium">
                    {preset.label}
                    {recommendedQualityKey === key && recommendedLabel ? (
                      <span className="ml-2 text-xs text-muted-foreground">
                        ({recommendedLabel})
                      </span>
                    ) : null}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {preset.description}
                  </span>
                </span>
                <ChevronRightIcon className="size-4 text-muted-foreground" />
              </button>
            )
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
