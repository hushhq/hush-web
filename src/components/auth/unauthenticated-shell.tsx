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
import { useAuth } from "@/contexts/AuthContext"
import { useBootController } from "@/hooks/useBootController"
import { useAuthInstanceSelection } from "@/hooks/useAuthInstanceSelection"
import { getInstanceDisplayName } from "@/lib/authInstanceStore"
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
    resetLocalAuthState: () => Promise<void>
  }
  const { performRegister, performRecovery, resetLocalAuthState } = auth
  const {
    selectedInstanceUrl,
    knownInstances,
    chooseInstance,
    rememberSelectedInstance,
  } = useAuthInstanceSelection() as AuthInstanceState

  // "Not you?" means this browser profile should forget the locked local
  // vault before showing login. This is required after an instance reset:
  // the server-side account may be gone while the browser still has a stale
  // vault marker that would otherwise route every refresh back to PIN unlock.
  const [forceRecovery, setForceRecovery] = React.useState(false)
  const switchAccountFromPin = React.useCallback(async () => {
    await resetLocalAuthState()
    setForceRecovery(true)
  }, [resetLocalAuthState])

  if (bootState === "needs_pin" && !forceRecovery) {
    return <PinUnlockPanel onSwitchAccount={switchAccountFromPin} />
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
      // Only forward the PIN return path when the user came here by
      // clicking "Not you? Sign in" on the unlock screen. Without an
      // existing session there is no PIN to go back to.
      onBackToPin={
        forceRecovery ? () => setForceRecovery(false) : undefined
      }
      versionLabel={`v${APP_VERSION}`}
    />
  )
}
