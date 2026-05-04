/**
 * PIN unlock panel — shown when the user has a PIN-encrypted vault and is
 * returning to the app. Replaces legacy `PinUnlockScreen.jsx` visually.
 * Wires to `useAuth().unlockVault(pin)`.
 */
import * as React from "react"
import { LockIcon } from "lucide-react"

import { Button } from "@/components/ui/button.tsx"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { HushLogo } from "@/components/brand/HushLogo"
// @ts-expect-error legacy JS
import { useAuth } from "@/hooks/useAuth"

export function PinUnlockPanel() {
  const { unlockVault, user, error, clearError } = useAuth() as {
    unlockVault: (pin: string) => Promise<void>
    user: { username?: string; display_name?: string } | null
    error: Error | null
    clearError: () => void
  }
  const [pin, setPin] = React.useState("")
  const [submitting, setSubmitting] = React.useState(false)
  const [localError, setLocalError] = React.useState<string | null>(null)

  const username = user?.username ?? user?.display_name ?? "your account"

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (submitting || pin.length === 0) return
    setSubmitting(true)
    setLocalError(null)
    clearError?.()
    try {
      await unlockVault(pin)
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : "Unlock failed")
    } finally {
      setSubmitting(false)
    }
  }

  const errorMessage = localError ?? error?.message ?? null

  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-background p-6">
      <div className="flex w-full max-w-md flex-col items-center gap-8">
        <HushLogo className="h-10 w-10" />
        <h1 className="text-2xl font-semibold tracking-tight">Unlock Hush</h1>
        <Card className="w-full p-6">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-1">
              <h2 className="text-base font-semibold">Welcome back, {username}</h2>
              <p className="text-sm text-muted-foreground">
                Enter your PIN or passphrase to decrypt your identity key on
                this device.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="pin-unlock">PIN or passphrase</Label>
              <Input
                id="pin-unlock"
                type="password"
                inputMode="text"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Enter your PIN"
                autoComplete="current-password"
                autoFocus
                disabled={submitting}
              />
            </div>
            {errorMessage ? (
              <p role="alert" className="text-xs text-destructive">
                {errorMessage}
              </p>
            ) : null}
            <Button
              type="submit"
              disabled={submitting || pin.length === 0}
              className="w-full"
            >
              <LockIcon />
              {submitting ? "Unlocking…" : "Unlock"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  )
}
