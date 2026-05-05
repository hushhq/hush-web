/**
 * 4-digit PIN entry rendered as iPhone-lock-style dots: empty rings that
 * fill with a solid dot as the user types. Never displays the digit
 * characters themselves — visual feedback is presence-only.
 *
 * Wraps the shadcn `InputOTP` primitive so the underlying control still
 * gives us hardware keypad on mobile, paste handling, secure-context
 * autofill, etc. Sanitizes the value to digits-only and clamps length so
 * paste / IME cannot smuggle non-numeric characters or extra digits.
 */
import * as React from "react"
import { OTPInputContext } from "input-otp"

import {
  InputOTP,
  InputOTPGroup,
} from "@/components/ui/input-otp"
import { cn } from "@/lib/utils"

export const PIN_LENGTH = 4

/** Strip everything that isn't 0-9 and clamp to PIN_LENGTH. */
export function sanitizePinDigits(raw: string): string {
  return raw.replace(/\D/g, "").slice(0, PIN_LENGTH)
}

interface PinOtpProps {
  id?: string
  value: string
  onChange: (next: string) => void
  disabled?: boolean
  autoComplete?: string
  autoFocus?: boolean
  ariaLabel: string
  ariaInvalid?: boolean
}

export function PinOtp({
  id,
  value,
  onChange,
  disabled,
  autoComplete = "one-time-code",
  autoFocus,
  ariaLabel,
  ariaInvalid,
}: PinOtpProps) {
  return (
    <InputOTP
      id={id}
      maxLength={PIN_LENGTH}
      // iOS Safari opens the numeric keypad only when `pattern="[0-9]*"`
      // (no anchors) AND `inputMode="numeric"` are both present. Anchored
      // patterns silently fall back to the alphanumeric keyboard on iOS.
      pattern="[0-9]*"
      inputMode="numeric"
      value={value}
      onChange={(next) => onChange(sanitizePinDigits(next))}
      disabled={disabled}
      autoComplete={autoComplete}
      autoFocus={autoFocus}
      textAlign="center"
      data-private="true"
      aria-label={ariaLabel}
      aria-invalid={ariaInvalid || undefined}
      // No visible borders or backgrounds on the outer container — the
      // dots themselves are the affordance.
      containerClassName="gap-3"
    >
      <InputOTPGroup className="gap-3 border-0">
        {Array.from({ length: PIN_LENGTH }, (_, i) => (
          <PinDot key={i} index={i} />
        ))}
      </InputOTPGroup>
    </InputOTP>
  )
}

function PinDot({ index }: { index: number }) {
  const ctx = React.useContext(OTPInputContext)
  const slot = ctx?.slots[index]
  const filled = Boolean(slot?.char)
  const isActive = Boolean(slot?.isActive)

  return (
    <span
      data-slot="pin-dot"
      data-active={isActive}
      data-filled={filled}
      className="relative flex size-10 items-center justify-center"
      aria-hidden="true"
    >
      <span
        className={cn(
          "block size-3 rounded-full transition-all duration-150",
          filled
            ? "scale-100 bg-foreground"
            : "scale-90 border-2 border-muted-foreground/40 bg-transparent",
          isActive && !filled && "border-ring scale-100"
        )}
      />
    </span>
  )
}
