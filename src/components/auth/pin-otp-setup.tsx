import * as React from "react"
import { OTPInputContext } from "input-otp"

import { cn } from "@/lib/utils"
import {
  InputOTP,
  InputOTPGroup,
} from "@/components/ui/input-otp"
import { PIN_LENGTH } from "@/components/auth/pin-otp"

interface PinOtpSetupProps {
  id?: string
  value: string
  onChange: (next: string) => void
  disabled?: boolean
  autoFocus?: boolean
  ariaLabel?: string
  ariaInvalid?: boolean
  autoComplete?: string
}

/**
 * Joined-cell PIN entry used during PIN creation. Visually distinct
 * from the spaced 4-dot {@link PinOtp} used at unlock so the user reads
 * "I am setting up something new" instead of "I am repeating my
 * unlock". Cells share borders to look segmented; characters are
 * masked with a centered dot so PIN digits never render plainly.
 */
export function PinOtpSetup({
  id,
  value,
  onChange,
  disabled,
  autoFocus,
  ariaLabel,
  ariaInvalid,
  autoComplete = "new-password",
}: PinOtpSetupProps) {
  return (
    <InputOTP
      id={id}
      maxLength={PIN_LENGTH}
      value={value}
      onChange={onChange}
      disabled={disabled}
      autoFocus={autoFocus}
      autoComplete={autoComplete}
      aria-label={ariaLabel}
      aria-invalid={ariaInvalid || undefined}
      inputMode="numeric"
      pattern="[0-9]*"
    >
      <InputOTPGroup>
        {Array.from({ length: PIN_LENGTH }).map((_, idx) => (
          <MaskedSlot key={idx} index={idx} />
        ))}
      </InputOTPGroup>
    </InputOTP>
  )
}

function MaskedSlot({ index }: { index: number }) {
  const ctx = React.useContext(OTPInputContext)
  const slot = ctx?.slots[index]
  const filled = Boolean(slot?.char)
  const isActive = Boolean(slot?.isActive)
  const hasFakeCaret = Boolean(slot?.hasFakeCaret)

  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive}
      className={cn(
        "relative flex size-12 items-center justify-center border-y border-r border-input bg-input/20 text-base transition-all outline-none first:rounded-l-md first:border-l last:rounded-r-md aria-invalid:border-destructive data-[active=true]:z-10 data-[active=true]:border-ring data-[active=true]:ring-2 data-[active=true]:ring-ring/30 dark:bg-input/30"
      )}
    >
      {filled ? (
        <span className="size-2.5 rounded-full bg-foreground" aria-hidden />
      ) : null}
      {hasFakeCaret ? (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-5 w-px animate-caret-blink bg-foreground duration-1000" />
        </div>
      ) : null}
    </div>
  )
}
