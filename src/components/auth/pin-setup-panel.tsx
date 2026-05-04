/**
 * PIN setup panel — shown post-register/post-recovery when the vault has
 * not yet been encrypted with a PIN. Replaces legacy `PinSetupModal.jsx`.
 * Wires to `useAuth().setPIN(pin)` + `skipPinSetup()`.
 */
import * as React from "react"
import { CheckIcon, ArrowRightIcon } from "lucide-react"

import { Button } from "@/components/ui/button.tsx"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { HushLogo } from "@/components/brand/HushLogo"
// @ts-expect-error legacy JS
import { useAuth } from "@/hooks/useAuth"

const MIN_PIN = 4

export function PinSetupPanel() {
  const { setPIN, skipPinSetup } = useAuth() as {
    setPIN: (pin: string) => Promise<void>
    skipPinSetup: () => void
  }
  const [pin, setPin] = React.useState("")
  const [confirm, setConfirm] = React.useState("")
  const [submitting, setSubmitting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const valid = pin.length >= MIN_PIN && pin === confirm
  const mismatch = confirm.length > 0 && pin !== confirm

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!valid || submitting) return
    setSubmitting(true)
    setError(null)
    try {
      await setPIN(pin)
    } catch (err) {
      setError(err instanceof Error ? err.message : "PIN setup failed")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-background p-6">
      <div className="flex w-full max-w-md flex-col items-center gap-8">
        <HushLogo className="h-10 w-10" />
        <h1 className="text-2xl font-semibold tracking-tight">Lock your vault</h1>
        <Card className="w-full p-6">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-1">
              <h2 className="text-base font-semibold">Set a PIN</h2>
              <p className="text-sm text-muted-foreground">
                Your PIN encrypts your identity key on this device. You will
                need it to unlock Hush after closing the app.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="pin-set">PIN (min {MIN_PIN} digits)</Label>
              <Input
                id="pin-set"
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Enter a PIN"
                autoComplete="new-password"
                disabled={submitting}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="pin-confirm">Confirm PIN</Label>
              <Input
                id="pin-confirm"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Repeat your PIN"
                autoComplete="new-password"
                disabled={submitting}
                aria-invalid={mismatch}
              />
              {mismatch ? (
                <p role="alert" className="text-xs text-destructive">
                  PINs do not match
                </p>
              ) : null}
            </div>
            {error ? (
              <p role="alert" className="text-xs text-destructive">
                {error}
              </p>
            ) : null}
            <p className="text-xs text-muted-foreground">
              Without a PIN you would need your 12-word recovery phrase every
              time you open Hush.
            </p>
            <div className="flex items-center justify-between gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={skipPinSetup}
                disabled={submitting}
              >
                Skip for now
              </Button>
              <Button type="submit" disabled={!valid || submitting}>
                {submitting ? (
                  <>
                    <ArrowRightIcon />
                    Saving…
                  </>
                ) : (
                  <>
                    <CheckIcon />
                    Set PIN
                  </>
                )}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}
