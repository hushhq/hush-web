import * as React from "react"

import { cn } from "@/lib/utils"
import { formatUsername } from "@/lib/userLabel"

interface UsernameHandleProps {
  username: string | null | undefined
  className?: string
  atClassName?: string
  fallback?: React.ReactNode
}

/**
 * Presentation-only username handle.
 *
 * The persisted username stays undecorated (`alice`). This component
 * adds the visual `@` marker only where the UI intentionally displays
 * a username rather than a display name.
 */
export function UsernameHandle({
  username,
  className,
  atClassName,
  fallback = null,
}: UsernameHandleProps) {
  const cleanUsername = formatUsername(username)
  if (!cleanUsername) return <>{fallback}</>
  return (
    <span
      className={cn("inline-flex min-w-0 items-baseline", className)}
      aria-label={`@${cleanUsername}`}
    >
      <span
        aria-hidden="true"
        className={cn("select-none text-muted-foreground", atClassName)}
      >
        @
      </span>
      <span className="min-w-0 truncate">{cleanUsername}</span>
    </span>
  )
}
