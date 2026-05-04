/**
 * PIN unlock panel — re-skin of hush-web's PinUnlockScreen.
 *
 * Behavioural contract preserved 1:1:
 *  - Avatar (initial letter or image) + username heading
 *  - Numeric PIN input (type=password + inputMode=numeric)
 *  - Progressive delay (3 fails → 1s, 5 → 5s, 7 → 30s, 9 → 60s)
 *  - MAX_ATTEMPTS = 10. VAULT_WIPED error → recovery prompt
 *  - "Not you? Sign in" footer triggers onSwitchAccount
 *
 * Wires to `useAuth().unlockVault(pin)`. The parent (UnauthenticatedShell)
 * passes onSwitchAccount which forces the AuthFlow recovery view even
 * though bootState is still 'needs_pin'.
 */
import * as React from "react"
import { LockIcon } from "lucide-react"

import { Button } from "@/components/ui/button.tsx"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { HushLogo } from "@/components/brand/HushLogo"
import { useAuth } from "@/contexts/AuthContext"

const MAX_ATTEMPTS = 10

const PIN_DELAY_TABLE: Array<{ threshold: number; delayMs: number }> = [
  { threshold: 9, delayMs: 60_000 },
  { threshold: 7, delayMs: 30_000 },
  { threshold: 5, delayMs: 5_000 },
  { threshold: 3, delayMs: 1_000 },
]

function getDelayMs(failureCount: number): number {
  for (const { threshold, delayMs } of PIN_DELAY_TABLE) {
    if (failureCount >= threshold) return delayMs
  }
  return 0
}

interface PinUnlockPanelProps {
  /** Force AuthFlow recovery view even though vault is locked. */
  onSwitchAccount?: () => void
}

export function PinUnlockPanel({ onSwitchAccount }: PinUnlockPanelProps) {
  const { unlockVault, user } = useAuth() as {
    unlockVault: (pin: string) => Promise<void>
    user: { username?: string; display_name?: string } | null
  }
  const [pin, setPin] = React.useState("")
  const [submitting, setSubmitting] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState("")
  const [attemptCount, setAttemptCount] = React.useState(0)
  const [delayRemaining, setDelayRemaining] = React.useState(0)
  const [isDelayed, setIsDelayed] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const countdownRef = React.useRef<number | null>(null)

  const username = user?.display_name ?? user?.username ?? "your account"
  const initial = (username.charAt(0) ?? "?").toUpperCase()

  React.useEffect(() => {
    inputRef.current?.focus()
  }, [])

  React.useEffect(
    () => () => {
      if (countdownRef.current != null) window.clearInterval(countdownRef.current)
    },
    []
  )

  const startDelay = React.useCallback((delayMs: number) => {
    if (delayMs <= 0) return
    setIsDelayed(true)
    setDelayRemaining(Math.ceil(delayMs / 1000))
    if (countdownRef.current != null) window.clearInterval(countdownRef.current)
    countdownRef.current = window.setInterval(() => {
      setDelayRemaining((prev) => {
        if (prev <= 1) {
          if (countdownRef.current != null) {
            window.clearInterval(countdownRef.current)
            countdownRef.current = null
          }
          setIsDelayed(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }, [])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!pin || submitting || isDelayed) return
    setSubmitting(true)
    setErrorMessage("")
    try {
      await unlockVault(pin)
      // Parent transitions on success.
    } catch (err) {
      const newCount = attemptCount + 1
      setAttemptCount(newCount)

      const code = (err as { code?: string })?.code
      if (code === "VAULT_WIPED") {
        setErrorMessage(
          "Too many failed attempts. Vault has been wiped. Please sign in with your recovery phrase."
        )
        return
      }

      const delayMs = getDelayMs(newCount)
      const remaining = MAX_ATTEMPTS - newCount
      const attemptStr = `${remaining} attempt${remaining !== 1 ? "s" : ""} remaining`
      if (delayMs > 0) {
        startDelay(delayMs)
        setErrorMessage(
          `Incorrect PIN — wait ${Math.ceil(delayMs / 1000)}s before trying again (${attemptStr})`
        )
      } else {
        setErrorMessage(`Incorrect PIN (${attemptStr})`)
      }
      setPin("")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-background p-6">
      <div className="flex w-full max-w-md flex-col items-center gap-8">
        <HushLogo className="h-10 w-10" />
        <h1 className="text-2xl font-semibold tracking-tight">Unlock Hush</h1>
        <Card className="w-full p-6">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col items-center gap-3">
              <div
                aria-hidden="true"
                className="flex size-14 items-center justify-center rounded-full bg-muted text-xl font-semibold text-muted-foreground"
              >
                {initial}
              </div>
              <span className="text-base font-semibold">{username}</span>
            </div>

            {errorMessage ? (
              <p role="alert" className="text-center text-xs text-destructive">
                {errorMessage}
              </p>
            ) : null}

            {attemptCount >= 5 && !errorMessage ? (
              <p role="status" className="text-center text-xs text-amber-500">
                {MAX_ATTEMPTS - attemptCount} attempt
                {MAX_ATTEMPTS - attemptCount !== 1 ? "s" : ""} remaining
              </p>
            ) : null}

            <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-2">
                <Label htmlFor="pin-input">PIN</Label>
                <Input
                  ref={inputRef}
                  id="pin-input"
                  type="password"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="Enter your PIN"
                  minLength={4}
                  autoComplete="off"
                  disabled={submitting || isDelayed}
                  aria-label="Vault PIN"
                />
              </div>

              {isDelayed ? (
                <p
                  role="status"
                  aria-live="polite"
                  aria-atomic="true"
                  className="text-xs text-amber-500"
                >
                  Wait {delayRemaining}s before retrying
                </p>
              ) : null}

              <Button
                type="submit"
                className="w-full"
                disabled={!pin || pin.length < 4 || submitting || isDelayed}
              >
                <LockIcon />
                {submitting ? "Unlocking…" : "Unlock"}
              </Button>
            </form>

            {onSwitchAccount ? (
              <Button
                type="button"
                variant="ghost"
                onClick={onSwitchAccount}
                className="w-full"
              >
                Not you? Sign in
              </Button>
            ) : null}
          </div>
        </Card>
      </div>
    </div>
  )
}
