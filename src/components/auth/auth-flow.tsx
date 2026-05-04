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

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

import { InstanceSelector } from "@/components/auth/instance-selector"
import { RoadmapPage } from "@/components/roadmap-page"

type AuthView = "main" | "sign-in" | "link" | "sign-up" | "roadmap"

interface AuthFlowProps {
  onSignedIn: () => void
}

const DEFAULT_INSTANCES = ["app.gethush.live"]
const VERSION_LABEL = "v0.7.0-alpha"

export function AuthFlow({ onSignedIn }: AuthFlowProps) {
  const [view, setView] = React.useState<AuthView>("main")
  const [instances, setInstances] = React.useState<string[]>(DEFAULT_INSTANCES)
  const [activeInstance, setActiveInstance] = React.useState(
    DEFAULT_INSTANCES[0]
  )

  const handleAddInstance = (value: string) => {
    setInstances((prev) => (prev.includes(value) ? prev : [...prev, value]))
  }

  const instanceProps = {
    instances,
    active: activeInstance,
    onSelect: setActiveInstance,
    onAdd: handleAddInstance,
  }

  if (view === "roadmap") {
    return <RoadmapPage onBack={() => setView("main")} />
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-background p-6">
      <div className="flex w-full max-w-md flex-col items-center gap-8">
        <HushMark />
        <h1 className="text-2xl font-semibold tracking-tight">
          {titleFor(view)}
        </h1>
        <Card className="w-full p-6">
          {view === "main" ? (
            <MainPanel
              onSignIn={() => setView("sign-in")}
              onLink={() => setView("link")}
              onSignUp={() => setView("sign-up")}
              onOpenRoadmap={() => setView("roadmap")}
              instanceProps={instanceProps}
            />
          ) : view === "sign-in" ? (
            <SignInPanel
              onBack={() => setView("main")}
              onContinue={onSignedIn}
              onOpenRoadmap={() => setView("roadmap")}
              instanceProps={instanceProps}
            />
          ) : view === "link" ? (
            <LinkDevicePanel
              onBack={() => setView("main")}
              onOpenRoadmap={() => setView("roadmap")}
              instanceProps={instanceProps}
            />
          ) : (
            <SignUpPanel
              onBack={() => setView("main")}
              onComplete={onSignedIn}
              onOpenRoadmap={() => setView("roadmap")}
              instanceProps={instanceProps}
            />
          )}
        </Card>
      </div>
    </div>
  )
}

function titleFor(view: AuthView): string {
  switch (view) {
    case "main":
    case "sign-in":
    case "link":
      return "Log in to Hush"
    case "sign-up":
      return "Welcome to Hush"
    case "roadmap":
      return "Roadmap"
  }
}

function HushMark() {
  return (
    <div className="flex size-10 items-center justify-center rounded-md text-2xl font-black leading-none tracking-tight">
      h.
    </div>
  )
}

interface InstanceProps {
  instances: string[]
  active: string
  onSelect: (value: string) => void
  onAdd: (value: string) => void
}

function PanelFooter({
  instanceProps,
  onOpenRoadmap,
}: {
  instanceProps: InstanceProps
  onOpenRoadmap?: () => void
}) {
  return (
    <div className="flex flex-col gap-3">
      <InstanceSelector {...instanceProps} />
      <Separator />
      <p className="text-center text-xs text-muted-foreground">
        Hush is open source and self-hostable.{" "}
        <a className="font-medium underline-offset-4 hover:underline" href="#">
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
        {VERSION_LABEL}
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
}: {
  onSignIn: () => void
  onLink: () => void
  onSignUp: () => void
  onOpenRoadmap?: () => void
  instanceProps: InstanceProps
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
      />
    </div>
  )
}

function SignInPanel({
  onBack,
  onContinue,
  onOpenRoadmap,
  instanceProps,
}: {
  onBack: () => void
  onContinue: () => void
  onOpenRoadmap?: () => void
  instanceProps: InstanceProps
}) {
  const [words, setWords] = React.useState<string[]>(() =>
    Array.from({ length: 12 }, () => "")
  )
  const filled = words.filter((w) => w.trim().length > 0).length
  const valid = filled === 12

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
      <Separator />
      <div className="flex items-center justify-between gap-3">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeftIcon />
          Back
        </Button>
        <Button onClick={onContinue} disabled={!valid}>
          <ArrowRightIcon />
          Continue
        </Button>
      </div>
      <PanelFooter
        instanceProps={instanceProps}
        onOpenRoadmap={onOpenRoadmap}
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
}: {
  onBack: () => void
  onOpenRoadmap?: () => void
  instanceProps: InstanceProps
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
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch {
      // ignore
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
      />
    </div>
  )
}

function SignUpPanel({
  onBack,
  onComplete,
  onOpenRoadmap,
  instanceProps,
}: {
  onBack: () => void
  onComplete: () => void
  onOpenRoadmap?: () => void
  instanceProps: InstanceProps
}) {
  const [step, setStep] = React.useState(0)
  const [username, setUsername] = React.useState("")
  const [displayName, setDisplayName] = React.useState("")
  const [pinValid, setPinValid] = React.useState(false)
  const totalSteps = 4

  const next = () => {
    if (step < totalSteps - 1) {
      setStep((s) => s + 1)
    } else {
      onComplete()
    }
  }

  const prev = () => {
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
        />
      ) : step === 1 ? (
        <PassphraseStep />
      ) : step === 2 ? (
        <ConfirmStep />
      ) : (
        <PinSetupStep onValidChange={setPinValid} />
      )}

      <Separator />

      <div className="flex items-center justify-between gap-3">
        <Button variant="ghost" onClick={prev}>
          <ArrowLeftIcon />
          Back
        </Button>
        <Button
          onClick={next}
          disabled={
            (step === 0 && !username.trim()) ||
            (step === totalSteps - 1 && !pinValid)
          }
        >
          {step === totalSteps - 1 ? (
            <>
              <CheckIcon />
              Finish
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
      />
    </div>
  )
}

function UsernameStep({
  username,
  displayName,
  onUsername,
  onDisplayName,
}: {
  username: string
  displayName: string
  onUsername: (value: string) => void
  onDisplayName: (value: string) => void
}) {
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
        />
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

function PassphraseStep() {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(SAMPLE_BIP39.join(" "))
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch {
      // ignore
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
        <div className="grid grid-cols-3 gap-2 p-3">
          {SAMPLE_BIP39.map((word, idx) => (
            <div
              key={`${word}-${idx}`}
              className="flex items-center gap-2 rounded-sm bg-background px-2 py-1.5 text-sm"
            >
              <span className="font-mono text-[10px] text-muted-foreground/70">
                {String(idx + 1).padStart(2, "0")}
              </span>
              <span className="font-mono">{word}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const STRENGTH_LABELS = ["", "Weak", "Fair", "Good", "Strong"] as const

function passphraseStrength(value: string): number {
  if (value.length < 6) return 0
  if (value.length < 9) return 1
  if (value.length < 12) return 2
  if (value.length < 16) return 3
  return 4
}

function strengthBarClass(level: number): string {
  if (level < 2) return "bg-destructive"
  if (level < 3) return "bg-amber-500"
  return "bg-success"
}

function PinSetupStep({
  onValidChange,
}: {
  onValidChange: (valid: boolean) => void
}) {
  const [mode, setMode] = React.useState<"pin" | "passphrase">("pin")
  const [value, setValue] = React.useState("")
  const [confirm, setConfirm] = React.useState("")

  const isPin = mode === "pin"
  const minLength = isPin ? 4 : 6
  const valueOk = value.length >= minLength
  const confirmOk = value === confirm && valueOk
  const mismatch = confirm.length > 0 && value !== confirm
  const strength = !isPin ? passphraseStrength(value) : 0

  React.useEffect(() => {
    onValidChange(confirmOk)
  }, [confirmOk, onValidChange])

  const switchMode = (next: string) => {
    setMode(next as "pin" | "passphrase")
    setValue("")
    setConfirm("")
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-base font-semibold">Lock your vault</h2>
        <p className="text-sm text-muted-foreground">
          Your {isPin ? "PIN" : "passphrase"} encrypts your identity key on
          this device. You will need it to unlock Hush after closing the app.
        </p>
      </div>

      <Tabs value={mode} onValueChange={switchMode}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pin">Use a PIN</TabsTrigger>
          <TabsTrigger value="passphrase">Use a passphrase</TabsTrigger>
        </TabsList>

        <TabsContent value="pin" className="flex flex-col gap-2 pt-3">
          <Label htmlFor="pin-value">PIN (min 4 digits)</Label>
          <Input
            id="pin-value"
            type="password"
            inputMode="numeric"
            pattern="[0-9]*"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder="Enter a PIN"
            autoComplete="new-password"
          />
        </TabsContent>

        <TabsContent value="passphrase" className="flex flex-col gap-2 pt-3">
          <Label htmlFor="phrase-value">Passphrase (min 6 characters)</Label>
          <Input
            id="phrase-value"
            type="password"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder="Enter a passphrase"
            autoComplete="new-password"
          />
          {value.length >= 2 ? (
            <div className="flex items-center gap-2">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                <div
                  className={cn(
                    "h-full transition-all duration-200",
                    strengthBarClass(strength)
                  )}
                  style={{ width: `${(strength / 4) * 100}%` }}
                />
              </div>
              <span className="w-12 text-right text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                {STRENGTH_LABELS[strength] || "—"}
              </span>
            </div>
          ) : null}
        </TabsContent>
      </Tabs>

      <div className="flex flex-col gap-2">
        <Label htmlFor="pin-confirm">
          Confirm {isPin ? "PIN" : "passphrase"}
        </Label>
        <Input
          id="pin-confirm"
          type="password"
          inputMode={isPin ? "numeric" : undefined}
          value={confirm}
          onChange={(event) => setConfirm(event.target.value)}
          placeholder={`Repeat your ${isPin ? "PIN" : "passphrase"}`}
          autoComplete="new-password"
          aria-invalid={mismatch}
        />
        {mismatch ? (
          <p role="alert" className="text-xs text-destructive">
            {isPin ? "PINs do not match" : "Passphrases do not match"}
          </p>
        ) : null}
      </div>

      <p className="text-xs text-muted-foreground">
        Without a {isPin ? "PIN" : "passphrase"}, you would need your 12-word
        recovery phrase every time you open Hush.
      </p>
    </div>
  )
}

function ConfirmStep() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-base font-semibold">Confirm your phrase</h2>
        <p className="text-sm text-muted-foreground">
          Re-enter your 12 words to make sure you saved them correctly.
        </p>
      </div>
      <Textarea
        rows={4}
        placeholder="word1 word2 word3 …"
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck={false}
        className="font-mono text-sm"
      />
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
      className="grid bg-white p-3"
      style={{
        gridTemplateColumns: `repeat(${QR_GRID_SIZE}, 1fr)`,
        width: 200,
        height: 200,
      }}
    >
      {cells.map((on, i) => (
        <div key={i} className={on ? "bg-black" : "bg-white"} />
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

const SAMPLE_BIP39 = [
  "river",
  "harbor",
  "mango",
  "candle",
  "violin",
  "purple",
  "stable",
  "future",
  "thunder",
  "olive",
  "wisdom",
  "marble",
]
