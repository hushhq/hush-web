import * as React from "react"
import { BugIcon } from "lucide-react"

import { BugReportDialog } from "@/components/bug-report-dialog"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useOptionalAuth } from "@/contexts/AuthContext"
import { deriveLifecycleStateFromAuth } from "@/lib/bugReportLifecycle"

export interface GlobalBugReportButtonProps {
  /**
   * Surface name attached to the report. The button is mounted in the
   * bottom dock of the authenticated shell, so `"chrome.bottom-dock"`
   * is the truthful default; future hosts (e.g. an auth screen) can
   * override this.
   */
  appSurface?: string
  className?: string
}

/**
 * Always-visible icon button in the authenticated app chrome that opens
 * the existing `BugReportDialog`. Mounted from the bottom dock, above
 * the user menu / voice pip. Reuses the shared lifecycle helper so it
 * cannot drift from the settings entry point.
 */
export function GlobalBugReportButton({
  appSurface = "chrome.bottom-dock",
  className,
}: GlobalBugReportButtonProps) {
  const auth = useOptionalAuth()
  const lifecycleState = React.useMemo(
    () => deriveLifecycleStateFromAuth(auth),
    [auth]
  )
  const [open, setOpen] = React.useState(false)

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Report a bug"
            data-slot="bottom-dock-bug-report"
            onClick={() => setOpen(true)}
            className={className}
          >
            <BugIcon className="size-4" aria-hidden />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">Report a bug</TooltipContent>
      </Tooltip>
      <BugReportDialog
        open={open}
        onOpenChange={setOpen}
        lifecycleState={lifecycleState}
        appSurface={appSurface}
      />
    </>
  )
}
