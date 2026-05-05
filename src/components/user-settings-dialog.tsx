import { LogOutIcon, UserIcon } from "lucide-react"

import { Separator } from "@/components/ui/separator.tsx"
import { ConfirmAction } from "@/components/confirm-action"
import {
  SettingsDialog,
  type SettingsGroup,
  type SettingsSection,
} from "@/components/settings-dialog"

interface UserAccountInfo {
  displayName: string
  username: string
}

interface UserSettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  account?: UserAccountInfo
  onSignOut?: () => void | Promise<void>
}

export function UserSettingsDialog({
  open,
  onOpenChange,
  account,
  onSignOut,
}: UserSettingsDialogProps) {
  // Only sections backed by real handlers ship today. Anything blocked on
  // backend support (notifications, integrations, profile editing, 2FA,
  // language, AI, advanced…) is hidden until that endpoint lands; the user
  // is never offered an action that has no effect.
  const groups: SettingsGroup[] = [
    { id: "account", label: "Account" },
    { id: "session", label: "Session" },
  ]

  const sections: SettingsSection[] = [
    {
      id: "account",
      groupId: "account",
      label: "My account",
      icon: <UserIcon />,
      content: <AccountPanel account={account} />,
    },
    {
      id: "logout",
      groupId: "session",
      label: "Log out",
      icon: <LogOutIcon />,
      destructive: true,
      content: <LogoutPanel onSignOut={onSignOut} />,
    },
  ]

  return (
    <SettingsDialog
      open={open}
      onOpenChange={onOpenChange}
      title="User settings"
      description="Manage your account and app preferences"
      sections={sections}
      groups={groups}
      defaultSectionId="account"
    />
  )
}

function LogoutPanel({
  onSignOut,
}: {
  onSignOut?: () => void | Promise<void>
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold">Log out</h2>
        <p className="text-sm text-muted-foreground">
          End your session on this device. Active voice calls will disconnect.
        </p>
      </div>
      <Separator />
      <div className="flex items-start justify-between gap-4 rounded-lg border bg-card p-4">
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium">Sign out</span>
          <span className="text-xs text-muted-foreground">
            You can sign back in any time with your recovery phrase.
          </span>
        </div>
        <ConfirmAction
          title="Log out?"
          description="You will be signed out on this device. Active voice calls will disconnect."
          confirmLabel="Log out"
          onConfirm={() => {
            void onSignOut?.()
          }}
          trigger={
            <button
              type="button"
              disabled={!onSignOut}
              className="shrink-0 rounded-md bg-destructive px-3 py-1.5 text-xs font-medium text-destructive-foreground transition-colors hover:bg-destructive/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Log out
            </button>
          }
        />
      </div>
    </div>
  )
}

function AccountPanel({ account }: { account?: UserAccountInfo }) {
  const displayName = account?.displayName ?? "—"
  const username = account?.username ?? "—"
  // TODO(yarin, 2026-05-04): backend lacks email/phone/password endpoints
  // — identity is currently mnemonic-derived. Edit actions deferred until
  // profile-update API lands.
  const fields: { label: string; value: string }[] = [
    { label: "Display name", value: displayName },
    { label: "Username", value: username },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold">My account</h2>
        <p className="text-sm text-muted-foreground">
          Identity is derived from your recovery phrase. Profile editing
          requires backend support — coming soon.
        </p>
      </div>

      <Separator />

      <section className="flex flex-col gap-3">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Identity
        </h3>
        <div className="rounded-lg border bg-card">
          {fields.map((field, idx) => (
            <div
              key={field.label}
              className={
                "flex items-center justify-between gap-4 px-4 py-3 " +
                (idx < fields.length - 1 ? "border-b" : "")
              }
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {field.label}
                </span>
                <span className="text-sm">{field.value}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

