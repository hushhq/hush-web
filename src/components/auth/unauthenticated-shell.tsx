/**
 * UnauthenticatedShell — top-level rendering switch for non-authenticated
 * boot states. App.jsx mounts this in place of legacy `Home.jsx`.
 *
 * - `needs_pin`     → PinUnlockPanel
 * - `pin_setup`     → PinSetupPanel
 * - `needs_login`   → AuthFlow (mockup port wired to useAuth.performRecovery / performRegister)
 */
import * as React from "react"
import { useNavigate } from "react-router-dom"

import { AuthFlow } from "@/components/auth/auth-flow"
import { PinUnlockPanel } from "@/components/auth/pin-unlock-panel"
import { PinSetupPanel } from "@/components/auth/pin-setup-panel"
// @ts-expect-error legacy JS
import { useAuth } from "@/hooks/useAuth"
// @ts-expect-error legacy JS
import { useBootController } from "@/hooks/useBootController"
// @ts-expect-error legacy JS
import { useAuthInstanceSelection } from "@/hooks/useAuthInstanceSelection"
// @ts-expect-error legacy JS
import { getInstanceDisplayName } from "@/lib/authInstanceStore"
// @ts-expect-error legacy JS
import { APP_VERSION } from "@/utils/constants"

interface KnownInstance {
  url: string
}

interface AuthInstanceState {
  selectedInstanceUrl: string
  knownInstances: KnownInstance[]
  chooseInstance: (url: string) => Promise<string>
  rememberSelectedInstance: (url?: string) => Promise<string>
}

export function UnauthenticatedShell() {
  const navigate = useNavigate()
  const { bootState } = useBootController() as { bootState: string }
  const auth = useAuth() as {
    user: { id: string } | null
    performRegister: (
      username: string,
      displayName: string,
      mnemonic: string,
      inviteCode: string | undefined,
      instanceUrl: string
    ) => Promise<void>
    performRecovery: (
      mnemonic: string,
      revokeOtherDevices: boolean,
      instanceUrl: string
    ) => Promise<void>
    setPIN: (pin: string) => Promise<void>
  }
  const { performRegister, performRecovery, setPIN, user } = auth
  const {
    selectedInstanceUrl,
    knownInstances,
    chooseInstance,
    rememberSelectedInstance,
  } = useAuthInstanceSelection() as AuthInstanceState

  // After performRegister resolves, AuthContext state has not yet flushed —
  // setPIN's user-id check would still see the stale null. Defer the PIN
  // commit to an effect that fires once user.id is available.
  const [pendingPin, setPendingPin] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (!pendingPin || !user?.id) return
    let cancelled = false
    setPIN(pendingPin)
      .catch((err) => {
        console.warn("setPIN deferred failed", err)
      })
      .finally(() => {
        if (!cancelled) setPendingPin(null)
      })
    return () => {
      cancelled = true
    }
  }, [pendingPin, user?.id, setPIN])

  if (bootState === "needs_pin") return <PinUnlockPanel />
  if (bootState === "pin_setup") return <PinSetupPanel />

  const instanceProps = {
    instances: knownInstances.map((i) => getInstanceDisplayName(i.url)),
    active: getInstanceDisplayName(selectedInstanceUrl),
    onSelect: (label: string) => {
      const match = knownInstances.find(
        (i) => getInstanceDisplayName(i.url) === label
      )
      void chooseInstance(match?.url ?? label)
    },
    onAdd: (label: string) => {
      const url = label.startsWith("http") ? label : `https://${label}`
      void chooseInstance(url)
    },
  }

  const signIn = async (mnemonic: string) => {
    const instanceUrl = await rememberSelectedInstance(selectedInstanceUrl)
    await performRecovery(mnemonic, false, instanceUrl)
  }

  const signUp = async ({
    username,
    displayName,
    mnemonic,
    pin,
  }: {
    username: string
    displayName: string
    mnemonic: string
    pin: string
  }) => {
    const instanceUrl = await rememberSelectedInstance(selectedInstanceUrl)
    await performRegister(username, displayName, mnemonic, undefined, instanceUrl)
    // Defer setPIN until user.id has flushed into context state.
    if (pin) setPendingPin(pin)
  }

  return (
    <AuthFlow
      instanceProps={instanceProps}
      instanceUrl={selectedInstanceUrl}
      signIn={signIn}
      signUp={signUp}
      onOpenRoadmap={() => navigate("/roadmap")}
      versionLabel={`v${APP_VERSION}`}
    />
  )
}
