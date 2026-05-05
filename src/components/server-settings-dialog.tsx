import { TrashIcon } from "lucide-react"

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

/**
 * Server settings — only the danger zone has a real backend handler today
 * (delete server). Overview / channels / roles / members / invites / audit
 * are deferred until each backend endpoint is wired through; presenting
 * inert sections here would mislead the user, so we hide them entirely.
 */
export function ServerSettingsDialog({
  open,
  onOpenChange,
  serverName,
  onDeleteServer,
}: ServerSettingsDialogProps) {
  const groups: SettingsGroup[] = onDeleteServer
    ? [{ id: "danger", label: "Danger zone" }]
    : []

  const sections: SettingsSection[] = []
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
      defaultSectionId={onDeleteServer ? "delete" : undefined}
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
