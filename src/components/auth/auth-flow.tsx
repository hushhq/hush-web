import * as React from "react"
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  CopyIcon,
  Link2Icon,
  LogInIcon,
  RefreshCwIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button.tsx"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator.tsx"
import { cn } from "@/lib/utils.ts"

import { InstanceSelector } from "@/components/auth/instance-selector"
import { HushLogo } from "@/components/brand/HushLogo"
import { generateIdentityMnemonic } from "@/lib/bip39Identity"
import { checkUsernameAvailable } from "@/lib/api"

type AuthView = "main" | "sign-in" | "link" | "sign-up"

interface InstanceProps {
  instances: string[]
  active: string
  onSelect: (value: string) => void
  onAdd: (value: string) => void
}

interface SignUpPayload {
  username: string
  displayName: string
  mnemonic: string
}

interface AuthFlowProps {
  instanceProps: InstanceProps
  /** Full URL of the active instance (used for backend reachability checks). */
  instanceUrl: string
  signIn: (mnemonic: string) => Promise<void> | void
  signUp: (payload: SignUpPayload) => Promise<void> | void
  onOpenRoadmap?: () => void
  versionLabel?: string
}

export function AuthFlow({
  instanceProps,
  instanceUrl,
  signIn,
  signUp,
  onOpenRoadmap,
  versionLabel = "v0.7.0-alpha",
}: AuthFlowProps) {
  const [view, setView] = React.useState<AuthView>("main")

  return (
    <div className="flex min-h-svh w-full flex-col bg-background px-4 py-4 sm:px-6">
      {/* `my-auto` centers when content fits the viewport; collapses to
          regular block flow (top-anchored, scrollable) when content is
          taller than the viewport. Works on every screen size without a
          breakpoint switch. */}
      <div className="my-auto flex w-full max-w-md flex-col items-center gap-6 self-center sm:gap-8">
        <HushLogo className="h-10 w-10" />
        <h1 className="text-2xl font-semibold tracking-tight">
          {titleFor(view)}
        </h1>
        <Card className="w-full p-6">
          {view === "main" ? (
            <MainPanel
              onSignIn={() => setView("sign-in")}
              onLink={() => setView("link")}
              onSignUp={() => setView("sign-up")}
              onOpenRoadmap={onOpenRoadmap}
              instanceProps={instanceProps}
              versionLabel={versionLabel}
            />
          ) : view === "sign-in" ? (
            <SignInPanel
              onBack={() => setView("main")}
              onContinue={signIn}
              onOpenRoadmap={onOpenRoadmap}
              instanceProps={instanceProps}
              versionLabel={versionLabel}
            />
          ) : view === "link" ? (
            <LinkDevicePanel
              onBack={() => setView("main")}
              onOpenRoadmap={onOpenRoadmap}
              instanceProps={instanceProps}
              versionLabel={versionLabel}
            />
          ) : (
            <SignUpPanel
              onBack={() => setView("main")}
              onComplete={signUp}
              onOpenRoadmap={onOpenRoadmap}
              instanceProps={instanceProps}
              instanceUrl={instanceUrl}
              versionLabel={versionLabel}
            />
          )}
        </Card>
      </div>
    </div>
  )
}

/**
 * Clipboard write with a legacy fallback. `navigator.clipboard.writeText` only
 * works on secure contexts (HTTPS / localhost). Mobile devices hitting the dev
 * server over a LAN IP (http://192.168.x.x:5173/) hit an insecure context and
 * the API is undefined or rejects with NotAllowedError, which silently broke
 * the recovery-phrase Copy button. Fall back to a hidden `<textarea>` +
 * `document.execCommand('copy')` so the affordance keeps working off-HTTPS.
 */
async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (
      typeof navigator !== "undefined" &&
      navigator.clipboard &&
      window.isSecureContext
    ) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    // fall through to legacy path
  }
  try {
    const ta = document.createElement("textarea")
    ta.value = text
    ta.setAttribute("readonly", "")
    ta.style.position = "fixed"
    ta.style.top = "0"
    ta.style.left = "0"
    ta.style.opacity = "0"
    document.body.appendChild(ta)
    ta.focus()
    ta.select()
    const ok = document.execCommand("copy")
    document.body.removeChild(ta)
    return ok
  } catch {
    return false
  }
}

function titleFor(view: AuthView): string {
  switch (view) {
    case "main":
    case "sign-in":
    case "link":
      return "Log in to Hush"
    case "sign-up":
      return "Welcome to Hush"
  }
}

function PanelFooter({
  instanceProps,
  onOpenRoadmap,
  versionLabel,
}: {
  instanceProps: InstanceProps
  onOpenRoadmap?: () => void
  versionLabel: string
}) {
  return (
    <div className="flex flex-col gap-3">
      <InstanceSelector {...instanceProps} />
      <Separator />
      <p className="text-center text-xs text-muted-foreground">
        Hush is open source and self-hostable.{" "}
        <a
          className="font-medium underline-offset-4 hover:underline"
          href="https://github.com/gethush/hush"
          target="_blank"
          rel="noreferrer noopener"
        >
          github
        </a>{" "}
        ·{" "}
        <button
          type="button"
          onClick={onOpenRoadmap}
          className="font-medium underline-offset-4 hover:underline"
        >
          roadmap
        </button>
      </p>
      <p className="text-center font-mono text-[10px] text-muted-foreground/70">
        {versionLabel}
      </p>
    </div>
  )
}

function MainPanel({
  onSignIn,
  onLink,
  onSignUp,
  onOpenRoadmap,
  instanceProps,
  versionLabel,
}: {
  onSignIn: () => void
  onLink: () => void
  onSignUp: () => void
  onOpenRoadmap?: () => void
  instanceProps: InstanceProps
  versionLabel: string
}) {
  return (
    <div className="flex flex-col gap-4">
      <Button size="lg" className="h-12 w-full" onClick={onSignIn}>
        <LogInIcon />
        Sign in
      </Button>
      <Button
        size="lg"
        variant="secondary"
        className="h-12 w-full"
        onClick={onLink}
      >
        <Link2Icon />
        Link to existing device
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <button
          type="button"
          onClick={onSignUp}
          className="font-semibold text-foreground underline-offset-4 hover:underline"
        >
          Sign up
        </button>
      </p>
      <PanelFooter
        instanceProps={instanceProps}
        onOpenRoadmap={onOpenRoadmap}
        versionLabel={versionLabel}
      />
    </div>
  )
}

function SignInPanel({
  onBack,
  onContinue,
  onOpenRoadmap,
  instanceProps,
  versionLabel,
}: {
  onBack: () => void
  onContinue: (mnemonic: string) => Promise<void> | void
  onOpenRoadmap?: () => void
  instanceProps: InstanceProps
  versionLabel: string
}) {
  const [words, setWords] = React.useState<string[]>(() =>
    Array.from({ length: 12 }, () => "")
  )
  const [submitting, setSubmitting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const filled = words.filter((w) => w.trim().length > 0).length
  const valid = filled === 12

  const handleSubmit = async () => {
    if (!valid || submitting) return
    setSubmitting(true)
    setError(null)
    try {
      const mnemonic = words.map((w) => w.trim().toLowerCase()).join(" ")
      await onContinue(mnemonic)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-base font-semibold">Recovery phrase</h2>
        <p className="text-sm text-muted-foreground">
          Enter the 12 words from when you signed up. Paste them all at once to
          auto-fill.
        </p>
      </div>
      <SeedPhraseGrid words={words} onChange={setWords} />
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{filled} / 12 words</span>
        <span className={cn(valid && "text-success font-medium")}>
          {valid ? "Looks good" : "Fill all 12 cells"}
        </span>
      </div>
      {error ? (
        <p role="alert" className="text-xs text-destructive">
          {error}
        </p>
      ) : null}
      <Separator />
      <div className="flex items-center justify-between gap-3">
        <Button variant="ghost" onClick={onBack} disabled={submitting}>
          <ArrowLeftIcon />
          Back
        </Button>
        <Button onClick={handleSubmit} disabled={!valid || submitting}>
          <ArrowRightIcon />
          {submitting ? "Signing in…" : "Continue"}
        </Button>
      </div>
      <PanelFooter
        instanceProps={instanceProps}
        onOpenRoadmap={onOpenRoadmap}
        versionLabel={versionLabel}
      />
    </div>
  )
}

function SeedPhraseGrid({
  words,
  onChange,
}: {
  words: string[]
  onChange: (next: string[]) => void
}) {
  const inputsRef = React.useRef<Array<HTMLInputElement | null>>([])

  const handleChange = (index: number, value: string) => {
    const next = [...words]
    next[index] = value
    onChange(next)
  }

  const handlePaste = (
    index: number,
    event: React.ClipboardEvent<HTMLInputElement>
  ) => {
    const text = event.clipboardData.getData("text")
    if (!text) return
    const tokens = text
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((t) => t.toLowerCase())
    if (tokens.length < 2) return
    event.preventDefault()
    const next = [...words]
    for (let i = 0; i < tokens.length && index + i < next.length; i++) {
      next[index + i] = tokens[i]
    }
    onChange(next)
    const focusIndex = Math.min(index + tokens.length, next.length - 1)
    requestAnimationFrame(() => {
      inputsRef.current[focusIndex]?.focus()
    })
  }

  const handleKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === " " || event.key === "Tab") {
      if (words[index].trim() && index < words.length - 1) {
        event.preventDefault()
        inputsRef.current[index + 1]?.focus()
      }
    } else if (event.key === "Backspace" && !words[index] && index > 0) {
      event.preventDefault()
      inputsRef.current[index - 1]?.focus()
    }
  }

  return (
    <div className="grid grid-cols-3 gap-2 rounded-md border bg-muted/20 p-3">
      {words.map((word, idx) => (
        <div
          key={idx}
          className="flex items-center gap-1.5 rounded-sm border bg-background pl-2 focus-within:ring-2 focus-within:ring-ring/40"
        >
          <span className="font-mono text-[10px] text-muted-foreground/70">
            {String(idx + 1).padStart(2, "0")}
          </span>
          <input
            ref={(el) => {
              inputsRef.current[idx] = el
            }}
            value={word}
            onChange={(event) => handleChange(idx, event.target.value)}
            onPaste={(event) => handlePaste(idx, event)}
            onKeyDown={(event) => handleKeyDown(idx, event)}
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            className="h-7 min-w-0 flex-1 bg-transparent font-mono text-sm outline-none"
            aria-label={`Word ${idx + 1}`}
          />
        </div>
      ))}
    </div>
  )
}

const FALLBACK_CODE = generateFallbackCode()
const QR_GRID_SIZE = 21

function LinkDevicePanel({
  onBack,
  onOpenRoadmap,
  instanceProps,
  versionLabel,
}: {
  onBack: () => void
  onOpenRoadmap?: () => void
  instanceProps: InstanceProps
  versionLabel: string
}) {
  const [secondsLeft, setSecondsLeft] = React.useState(4 * 60)
  const [copied, setCopied] = React.useState(false)
  const [code, setCode] = React.useState(FALLBACK_CODE)
  const [qrSeed, setQrSeed] = React.useState(0)

  React.useEffect(() => {
    const id = window.setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0))
    }, 1000)
    return () => window.clearInterval(id)
  }, [])

  const handleCopy = async () => {
    if (await copyToClipboard(code)) {
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    }
  }

  const handleRegenerate = () => {
    setCode(generateFallbackCode())
    setQrSeed((s) => s + 1)
    setSecondsLeft(4 * 60)
  }

  const minutes = Math.floor(secondsLeft / 60)
  const seconds = String(secondsLeft % 60).padStart(2, "0")

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h2 className="text-base font-semibold">Link this device</h2>
        <p className="text-sm text-muted-foreground">
          Scan this QR code from a device that is already signed in to the same
          account.
        </p>
      </div>

      <div className="flex flex-col items-center gap-2 rounded-lg bg-muted/40 p-4">
        <FakeQR seed={qrSeed} />
        <span className="font-mono text-xs text-muted-foreground">
          Expires in {minutes}:{seconds}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
          Or use fallback code
        </span>
        <Separator className="flex-1" />
      </div>

      <div className="flex items-center rounded-md border bg-muted/30 px-3 py-3">
        <code className="min-w-0 flex-1 truncate pl-7 text-center font-mono text-xl font-normal tracking-[0.14em]">
          {code}
        </code>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={handleCopy}
          aria-label="Copy fallback code"
          className="shrink-0"
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
        </Button>
      </div>

      <Separator />

      <div className="flex items-center justify-between gap-3">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeftIcon />
          Back
        </Button>
        <Button variant="secondary" onClick={handleRegenerate}>
          <RefreshCwIcon />
          Regenerate
        </Button>
      </div>

      <PanelFooter
        instanceProps={instanceProps}
        onOpenRoadmap={onOpenRoadmap}
        versionLabel={versionLabel}
      />
    </div>
  )
}

function SignUpPanel({
  onBack,
  onComplete,
  onOpenRoadmap,
  instanceProps,
  instanceUrl,
  versionLabel,
}: {
  onBack: () => void
  onComplete: (payload: SignUpPayload) => Promise<void> | void
  onOpenRoadmap?: () => void
  instanceProps: InstanceProps
  instanceUrl: string
  versionLabel: string
}) {
  const [step, setStep] = React.useState(0)
  const [username, setUsername] = React.useState("")
  const [displayName, setDisplayName] = React.useState("")
  const [usernameAvailable, setUsernameAvailable] = React.useState<boolean | null>(null)
  const [usernameChecking, setUsernameChecking] = React.useState(false)
  const [confirmValid, setConfirmValid] = React.useState(false)
  const [submitting, setSubmitting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [mnemonic, setMnemonic] = React.useState<string>(() => generateIdentityMnemonic())
  const mnemonicWords = React.useMemo(() => mnemonic.split(" "), [mnemonic])

  const startOver = () => {
    setMnemonic(generateIdentityMnemonic())
    setConfirmValid(false)
    setStep(0)
  }
  // 3 wizard steps: username, recovery phrase reveal, confirm. PIN setup is
  // a separate post-register UI driven by bootController.
  const totalSteps = 3

  const next = async () => {
    if (step < totalSteps - 1) {
      setStep((s) => s + 1)
      return
    }
    if (submitting) return
    setSubmitting(true)
    setError(null)
    try {
      await onComplete({
        username: username.trim(),
        displayName: displayName.trim(),
        mnemonic,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-up failed")
    } finally {
      setSubmitting(false)
    }
  }

  const prev = () => {
    if (submitting) return
    if (step === 0) {
      onBack()
    } else {
      setStep((s) => s - 1)
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-center gap-1.5">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <span
            key={i}
            className={cn(
              "size-1.5 rounded-full transition-colors",
              i === step ? "bg-foreground" : "bg-muted"
            )}
          />
        ))}
      </div>

      {step === 0 ? (
        <UsernameStep
          username={username}
          displayName={displayName}
          onUsername={setUsername}
          onDisplayName={setDisplayName}
          instanceUrl={instanceUrl}
          available={usernameAvailable}
          onAvailableChange={setUsernameAvailable}
          checking={usernameChecking}
          onCheckingChange={setUsernameChecking}
        />
      ) : step === 1 ? (
        <PassphraseStep words={mnemonicWords} />
      ) : (
        <ConfirmStep
          words={mnemonicWords}
          onValidChange={setConfirmValid}
        />
      )}

      {error ? (
        <p role="alert" className="text-xs text-destructive">
          {error}
        </p>
      ) : null}

      <Separator />

      <div className="flex items-center justify-between gap-3">
        {step === totalSteps - 1 ? (
          <Button
            variant="ghost"
            onClick={startOver}
            disabled={submitting}
          >
            <RefreshCwIcon />
            Start over
          </Button>
        ) : (
          <Button variant="ghost" onClick={prev} disabled={submitting}>
            <ArrowLeftIcon />
            Back
          </Button>
        )}
        <Button
          onClick={next}
          disabled={
            submitting ||
            (step === 0 &&
              (!username.trim() || usernameChecking || usernameAvailable !== true)) ||
            (step === totalSteps - 1 && !confirmValid)
          }
        >
          {step === totalSteps - 1 ? (
            <>
              <CheckIcon />
              {submitting ? "Creating…" : "Finish"}
            </>
          ) : (
            <>
              <ArrowRightIcon />
              Continue
            </>
          )}
        </Button>
      </div>

      <PanelFooter
        instanceProps={instanceProps}
        onOpenRoadmap={onOpenRoadmap}
        versionLabel={versionLabel}
      />
    </div>
  )
}

const USERNAME_RE = /^[a-z0-9_-]{3,32}$/

function UsernameStep({
  username,
  displayName,
  onUsername,
  onDisplayName,
  instanceUrl,
  available,
  onAvailableChange,
  checking,
  onCheckingChange,
}: {
  username: string
  displayName: string
  onUsername: (value: string) => void
  onDisplayName: (value: string) => void
  instanceUrl: string
  available: boolean | null
  onAvailableChange: (value: boolean | null) => void
  checking: boolean
  onCheckingChange: (value: boolean) => void
}) {
  const trimmed = username.trim().toLowerCase()
  const isValidShape = USERNAME_RE.test(trimmed)

  // Debounced availability check.
  React.useEffect(() => {
    if (!isValidShape) {
      onAvailableChange(null)
      onCheckingChange(false)
      return
    }
    let cancelled = false
    const controller = new AbortController()
    onCheckingChange(true)
    const id = window.setTimeout(async () => {
      try {
        const ok = await checkUsernameAvailable(trimmed, instanceUrl, controller.signal)
        if (!cancelled) onAvailableChange(Boolean(ok))
      } catch {
        if (!cancelled) onAvailableChange(null)
      } finally {
        if (!cancelled) onCheckingChange(false)
      }
    }, 400)
    return () => {
      cancelled = true
      controller.abort()
      window.clearTimeout(id)
      onCheckingChange(false)
    }
  }, [trimmed, isValidShape, instanceUrl, onAvailableChange, onCheckingChange])

  let feedback: React.ReactNode = null
  if (!username) {
    feedback = null
  } else if (!isValidShape) {
    feedback = (
      <span className="text-xs text-muted-foreground">
        3–32 chars: lowercase letters, digits, dashes, underscores
      </span>
    )
  } else if (checking) {
    feedback = <span className="text-xs text-muted-foreground">Checking…</span>
  } else if (available === true) {
    feedback = (
      <span className="text-xs text-success font-medium">
        @{trimmed} is available
      </span>
    )
  } else if (available === false) {
    feedback = (
      <span className="text-xs text-destructive font-medium">
        @{trimmed} is already taken
      </span>
    )
  } else {
    feedback = (
      <span className="text-xs text-muted-foreground">
        Could not reach instance — check connection
      </span>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-base font-semibold">Choose a username</h2>
        <p className="text-sm text-muted-foreground">
          Your username is your identity on this server.
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="signup-username">Username</Label>
        <Input
          id="signup-username"
          value={username}
          onChange={(event) => onUsername(event.target.value)}
          placeholder="e.g. alice"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          aria-invalid={available === false || (Boolean(username) && !isValidShape)}
        />
        {feedback}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="signup-display">
          Display name{" "}
          <span className="font-normal text-muted-foreground">(optional)</span>
        </Label>
        <Input
          id="signup-display"
          value={displayName}
          onChange={(event) => onDisplayName(event.target.value)}
          placeholder="How others see you"
        />
      </div>
    </div>
  )
}

function PassphraseStep({ words }: { words: string[] }) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = async () => {
    if (await copyToClipboard(words.join(" "))) {
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-base font-semibold">Save your recovery phrase</h2>
        <p className="text-sm text-muted-foreground">
          Write these 12 words down and keep them safe. They are the only way to
          recover your account.
        </p>
      </div>
      <div className="overflow-hidden rounded-md border bg-muted/30">
        <div className="flex items-center justify-between border-b bg-muted/40 px-3 py-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            12-word recovery phrase
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="flex h-6 items-center gap-1 rounded-md px-2 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Copy phrase"
          >
            {copied ? (
              <>
                <CheckIcon className="size-3.5" />
                Copied
              </>
            ) : (
              <>
                <CopyIcon className="size-3.5" />
                Copy
              </>
            )}
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2 p-3 sm:grid-cols-3">
          {words.map((word, idx) => (
            <div
              key={`${word}-${idx}`}
              className="flex items-center gap-2 rounded-sm bg-background px-2 py-1.5 text-sm"
            >
              <span className="font-mono text-[10px] text-muted-foreground/70">
                {String(idx + 1).padStart(2, "0")}
              </span>
              <span className="truncate font-mono">{word}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function pickRandomPositions(max: number, count: number): number[] {
  const pool = Array.from({ length: max }, (_, i) => i)
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }
  return pool.slice(0, count).sort((a, b) => a - b)
}

/**
 * Confirms the user has saved the recovery phrase by asking for 3 random
 * positions instead of all 12 words. Mirrors hush-web's MnemonicConfirm
 * pattern; mockup originally re-typed all 12.
 */
function ConfirmStep({
  words,
  onValidChange,
}: {
  words: string[]
  onValidChange: (valid: boolean) => void
}) {
  const [positions] = React.useState<number[]>(() =>
    pickRandomPositions(words.length, 3)
  )
  const [inputs, setInputs] = React.useState<string[]>(["", "", ""])

  const fieldState = React.useCallback(
    (i: number): "idle" | "correct" | "wrong" => {
      const value = inputs[i]?.trim()
      if (!value) return "idle"
      const expected = words[positions[i]]?.toLowerCase()
      return value.toLowerCase() === expected ? "correct" : "wrong"
    },
    [inputs, positions, words]
  )

  const allCorrect = inputs.every((_, i) => fieldState(i) === "correct")

  React.useEffect(() => {
    onValidChange(allCorrect)
  }, [allCorrect, onValidChange])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-base font-semibold">Verify your phrase</h2>
        <p className="text-sm text-muted-foreground">
          Enter the requested words to confirm you saved your recovery phrase.
        </p>
      </div>
      <div className="flex flex-col gap-3">
        {positions.map((wordIndex, i) => {
          const state = fieldState(i)
          return (
            <div key={wordIndex} className="flex flex-col gap-2">
              <Label htmlFor={`confirm-word-${i}`}>
                Word #{wordIndex + 1}
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id={`confirm-word-${i}`}
                  type="text"
                  value={inputs[i]}
                  onChange={(event) => {
                    const next = [...inputs]
                    next[i] = event.target.value
                    setInputs(next)
                  }}
                  placeholder="Type the word…"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  autoComplete="off"
                  className="font-mono"
                  aria-invalid={state === "wrong"}
                />
                <span
                  aria-hidden="true"
                  className={cn(
                    "w-4 text-center text-sm font-medium",
                    state === "correct" && "text-success",
                    state === "wrong" && "text-destructive",
                    state === "idle" && "invisible"
                  )}
                >
                  {state === "correct" ? "✓" : state === "wrong" ? "✗" : ""}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function FakeQR({ seed }: { seed: number }) {
  const cells = React.useMemo(() => {
    const N = QR_GRID_SIZE
    return Array.from({ length: N * N }, (_, i) => {
      const x = i % N
      const y = Math.floor(i / N)
      const inFinder =
        (x < 7 && y < 7) ||
        (x >= N - 7 && y < 7) ||
        (x < 7 && y >= N - 7)
      if (inFinder) {
        const fx = x < 7 ? x : x - (N - 7)
        const fy = y < 7 ? y : y - (N - 7)
        const isOuter = fx === 0 || fx === 6 || fy === 0 || fy === 6
        const isInner = fx >= 2 && fx <= 4 && fy >= 2 && fy <= 4
        return isOuter || isInner
      }
      return ((x * 37 + y * 19 + seed * 7) ^ (x * y)) % 3 === 0
    })
  }, [seed])

  return (
    <div
      className="grid bg-background p-3"
      style={{
        gridTemplateColumns: `repeat(${QR_GRID_SIZE}, 1fr)`,
        width: 200,
        height: 200,
      }}
    >
      {cells.map((on, i) => (
        <div key={i} className={on ? "bg-foreground" : "bg-background"} />
      ))}
    </div>
  )
}

function generateFallbackCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let out = ""
  for (let i = 0; i < 8; i++) {
    out += chars[Math.floor(Math.random() * chars.length)]
  }
  return out
}

