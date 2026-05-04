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
import { useAuth } from "@/contexts/AuthContext"
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
    user: { id: string } | null
    hasSession: boolean
    needsPinSetup: boolean
    needsUnlock: boolean
    hasVault: boolean
  }
  const { performRegister, performRecovery } = auth
  const {
    selectedInstanceUrl,
    knownInstances,
    chooseInstance,
    rememberSelectedInstance,
  } = useAuthInstanceSelection() as AuthInstanceState

  // When user clicks "Not you? Sign in" on the PIN unlock screen, force the
  // AuthFlow recovery view even though bootState would otherwise route to
  // PinUnlockPanel. Submitting a different mnemonic creates a new session.
  const [forceRecovery, setForceRecovery] = React.useState(false)

  if (bootState === "needs_pin" && !forceRecovery) {
    return <PinUnlockPanel onSwitchAccount={() => setForceRecovery(true)} />
  }
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
  }: {
    username: string
    displayName: string
    mnemonic: string
  }) => {
    const instanceUrl = await rememberSelectedInstance(selectedInstanceUrl)
    // Legacy hush-web behaviour: empty display name falls back to the username.
    const finalDisplayName = displayName.trim() || username.trim()
    await performRegister(username, finalDisplayName, mnemonic, undefined, instanceUrl)
    // performRegister flips bootState to 'pin_setup'; PinSetupPanel mounts
    // on next render and owns the PIN commit through useAuth().setPIN.
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
