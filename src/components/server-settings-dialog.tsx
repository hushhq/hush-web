import {
  ActivityIcon,
  BanIcon,
  BellIcon,
  HashIcon,
  LinkIcon,
  PlugIcon,
  ScrollTextIcon,
  SettingsIcon,
  ShieldIcon,
  TrashIcon,
  UsersIcon,
} from "lucide-react"

import { Separator } from "@/components/ui/separator.tsx"
import { ConfirmAction } from "@/components/confirm-action"
import {
  SettingsDialog,
  type SettingsGroup,
  type SettingsSection,
} from "@/components/settings-dialog"

interface ServerSettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  serverName: string
  /** Owner-only delete handler. When omitted the danger zone is hidden. */
  onDeleteServer?: () => void | Promise<void>
}

export function ServerSettingsDialog({
  open,
  onOpenChange,
  serverName,
  onDeleteServer,
}: ServerSettingsDialogProps) {
  const groups: SettingsGroup[] = [
    { id: "general", label: "General" },
    { id: "community", label: "Community" },
    { id: "safety", label: "Safety" },
    { id: "danger", label: "Danger zone" },
  ]

  const sections: SettingsSection[] = [
    {
      id: "overview",
      groupId: "general",
      label: "Overview",
      icon: <SettingsIcon />,
      content: <PlaceholderPanel title="Overview" />,
    },
    {
      id: "channels",
      groupId: "general",
      label: "Channels",
      icon: <HashIcon />,
      content: <PlaceholderPanel title="Channels" />,
    },
    {
      id: "roles",
      groupId: "community",
      label: "Roles",
      icon: <ShieldIcon />,
      content: <PlaceholderPanel title="Roles" />,
    },
    {
      id: "members",
      groupId: "community",
      label: "Members",
      icon: <UsersIcon />,
      content: <PlaceholderPanel title="Members" />,
    },
    {
      id: "invites",
      groupId: "community",
      label: "Invites",
      icon: <LinkIcon />,
      content: <PlaceholderPanel title="Invites" />,
    },
    {
      id: "moderation",
      groupId: "safety",
      label: "Moderation",
      icon: <BanIcon />,
      content: <PlaceholderPanel title="Moderation" />,
    },
    {
      id: "audit",
      groupId: "safety",
      label: "Audit log",
      icon: <ScrollTextIcon />,
      content: <PlaceholderPanel title="Audit log" />,
    },
    {
      id: "notifications",
      groupId: "safety",
      label: "Notifications",
      icon: <BellIcon />,
      content: <PlaceholderPanel title="Notifications" />,
    },
    {
      id: "integrations",
      groupId: "safety",
      label: "Integrations",
      icon: <PlugIcon />,
      content: <PlaceholderPanel title="Integrations" />,
    },
    {
      id: "activity",
      groupId: "safety",
      label: "Activity",
      icon: <ActivityIcon />,
      content: <PlaceholderPanel title="Activity" />,
    },
  ]
  if (onDeleteServer) {
    sections.push({
      id: "delete",
      groupId: "danger",
      label: "Delete server",
      icon: <TrashIcon />,
      destructive: true,
      content: (
        <DeleteServerPanel
          serverName={serverName}
          onConfirm={onDeleteServer}
        />
      ),
    })
  }

  return (
    <SettingsDialog
      open={open}
      onOpenChange={onOpenChange}
      title={`${serverName} settings`}
      description={`Manage settings for ${serverName}`}
      sections={sections}
      groups={groups}
      defaultSectionId="overview"
    />
  )
}

function DeleteServerPanel({
  serverName,
  onConfirm,
}: {
  serverName: string
  onConfirm: () => void | Promise<void>
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold">Delete server</h2>
        <p className="text-sm text-muted-foreground">
          Permanent deletion. All channels, messages, roles, and member data will be lost.
        </p>
      </div>
      <Separator />
      <div className="flex items-start justify-between gap-4 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium">Delete this server</span>
          <span className="text-xs text-muted-foreground">
            Only the owner can perform this action. Cannot be undone.
          </span>
        </div>
        <ConfirmAction
          title={`Delete ${serverName}?`}
          description={`This permanently deletes ${serverName}, all channels, messages, and member data. This action cannot be undone.`}
          confirmLabel="Delete server"
          onConfirm={() => {
            void onConfirm()
          }}
          trigger={
            <button
              type="button"
              className="shrink-0 rounded-md bg-destructive px-3 py-1.5 text-xs font-medium text-destructive-foreground transition-colors hover:bg-destructive/90"
            >
              Delete server
            </button>
          }
        />
      </div>
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
