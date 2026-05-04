import {
  BellIcon,
  CircleUserIcon,
  KeyboardIcon,
  LanguagesIcon,
  LockIcon,
  LogOutIcon,
  MicIcon,
  PaletteIcon,
  PlugZapIcon,
  ShieldIcon,
  SparklesIcon,
  UserIcon,
  WrenchIcon,
} from "lucide-react"

import { Separator } from "@/components/ui/separator"
import { ConfirmAction } from "@/components/confirm-action"
import {
  SettingsDialog,
  type SettingsGroup,
  type SettingsSection,
} from "@/components/settings-dialog"

interface UserSettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UserSettingsDialog({
  open,
  onOpenChange,
}: UserSettingsDialogProps) {
  const groups: SettingsGroup[] = [
    { id: "account", label: "Account" },
    { id: "app", label: "App settings" },
    { id: "session", label: "Session" },
  ]

  const sections: SettingsSection[] = [
    {
      id: "account",
      groupId: "account",
      label: "My account",
      icon: <UserIcon />,
      content: <AccountPanel />,
    },
    {
      id: "profile",
      groupId: "account",
      label: "Profile",
      icon: <CircleUserIcon />,
      content: <PlaceholderPanel title="Profile" />,
    },
    {
      id: "privacy",
      groupId: "account",
      label: "Privacy & safety",
      icon: <ShieldIcon />,
      content: <PlaceholderPanel title="Privacy & safety" />,
    },
    {
      id: "security",
      groupId: "account",
      label: "Security",
      icon: <LockIcon />,
      content: <PlaceholderPanel title="Security" />,
    },
    {
      id: "appearance",
      groupId: "app",
      label: "Appearance",
      icon: <PaletteIcon />,
      content: <PlaceholderPanel title="Appearance" />,
    },
    {
      id: "voice",
      groupId: "app",
      label: "Voice & video",
      icon: <MicIcon />,
      content: <PlaceholderPanel title="Voice & video" />,
    },
    {
      id: "notifications",
      groupId: "app",
      label: "Notifications",
      icon: <BellIcon />,
      content: <PlaceholderPanel title="Notifications" />,
    },
    {
      id: "keybinds",
      groupId: "app",
      label: "Keybinds",
      icon: <KeyboardIcon />,
      content: <PlaceholderPanel title="Keybinds" />,
    },
    {
      id: "language",
      groupId: "app",
      label: "Language",
      icon: <LanguagesIcon />,
      content: <PlaceholderPanel title="Language" />,
    },
    {
      id: "integrations",
      groupId: "app",
      label: "Integrations",
      icon: <PlugZapIcon />,
      content: <PlaceholderPanel title="Integrations" />,
    },
    {
      id: "ai",
      groupId: "app",
      label: "AI assistant",
      icon: <SparklesIcon />,
      content: <PlaceholderPanel title="AI assistant" />,
    },
    {
      id: "advanced",
      groupId: "app",
      label: "Advanced",
      icon: <WrenchIcon />,
      content: <PlaceholderPanel title="Advanced" />,
    },
    {
      id: "logout",
      groupId: "session",
      label: "Log out",
      icon: <LogOutIcon />,
      destructive: true,
      content: <LogoutPanel />,
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

function LogoutPanel() {
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
            You can sign back in any time with your credentials.
          </span>
        </div>
        <ConfirmAction
          title="Log out?"
          description="You will be signed out on this device. Active voice calls will disconnect."
          confirmLabel="Log out"
          trigger={
            <button
              type="button"
              className="shrink-0 rounded-md bg-destructive px-3 py-1.5 text-xs font-medium text-destructive-foreground transition-colors hover:bg-destructive/90"
            >
              Log out
            </button>
          }
        />
      </div>
    </div>
  )
}

function AccountPanel() {
  const fields: { label: string; value: string; action?: string }[] = [
    { label: "Display name", value: "yarin", action: "Edit" },
    { label: "Username", value: "yarin#0001", action: "Edit" },
    { label: "Email", value: "yarin.cardillo@gmail.com", action: "Edit" },
    { label: "Phone", value: "Not added", action: "Add" },
    { label: "Password", value: "•••••••••••", action: "Change" },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold">My account</h2>
        <p className="text-sm text-muted-foreground">
          Account credentials, identity, and security.
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
              <button
                type="button"
                className="rounded-md border px-3 py-1 text-xs font-medium transition-colors hover:bg-muted"
              >
                {field.action}
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Two-factor authentication
        </h3>
        <div className="flex items-start justify-between gap-4 rounded-lg border bg-card p-4">
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium">2FA disabled</span>
            <span className="text-xs text-muted-foreground">
              Add an authenticator app for an extra layer of security on your account.
            </span>
          </div>
          <button
            type="button"
            className="shrink-0 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Enable
          </button>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Account removal
        </h3>
        <div className="flex items-start justify-between gap-4 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium">Disable or delete account</span>
            <span className="text-xs text-muted-foreground">
              Disabling lets you come back later. Deleting is permanent.
            </span>
          </div>
          <div className="flex shrink-0 gap-2">
            <ConfirmAction
              title="Disable account?"
              description="Your account will be disabled. You can re-enable it any time by signing back in."
              confirmLabel="Disable account"
              variant="default"
              trigger={
                <button
                  type="button"
                  className="rounded-md border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted"
                >
                  Disable
                </button>
              }
            />
            <ConfirmAction
              title="Delete account?"
              description="This will permanently delete your account, messages, and uploads. This action cannot be undone."
              confirmLabel="Delete forever"
              trigger={
                <button
                  type="button"
                  className="rounded-md bg-destructive px-3 py-1.5 text-xs font-medium text-destructive-foreground transition-colors hover:bg-destructive/90"
                >
                  Delete
                </button>
              }
            />
          </div>
        </div>
      </section>
    </div>
  )
}

function PlaceholderPanel({
  title,
  destructive,
}: {
  title: string
  destructive?: boolean
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-sm text-muted-foreground">
          Prototype placeholder — wire up real controls when backend lands.
        </p>
      </div>
      <Separator />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className={
              "aspect-video rounded-lg " +
              (destructive ? "bg-destructive/10" : "bg-muted/50")
            }
          />
        ))}
      </div>
    </div>
  )
}
