import { InfoCircledIcon } from '@radix-ui/react-icons';
import { SidebarProvider } from '@/components/ui/sidebar';
import ServerRail from './ServerRail';
import ChannelSidebar from './ChannelSidebar';
import WorkspaceSurface from './WorkspaceSurface';

/**
 * BlockAppShell — block-led desktop shell for the authenticated app.
 *
 *   - `ServerRail` is a persistent narrow column OUTSIDE the inset frame.
 *   - The inset workspace frame (rounded, hairline-bordered, m-2 ml-0)
 *     contains the channel `Sidebar` and the `SidebarInset` workspace
 *     surface as a single contour.
 *   - Channel sidebar is a real shadcn `Sidebar` with separate body and
 *     footer slots (anchored voice + user panel), and is
 *     non-collapsible per pt2.
 *
 * `emptyStateEl` is rendered in the workspace surface when no server is
 * selected; otherwise the channel sidebar (`channelSidebarBody` +
 * `channelSidebarFooter`) and `children` (channel content) render.
 * Routing between empty and selected modes lives in `ServerShell`.
 *
 * @param {object} props
 * @param {React.ReactNode} props.serverListEl - Slot for the guild list (server rail body).
 * @param {React.ReactNode} [props.channelSidebarBody] - Channel-list / DM-list slot inside `SidebarContent`.
 * @param {React.ReactNode} [props.channelSidebarFooter] - Voice + user panel slot inside `SidebarFooter`.
 * @param {React.ReactNode} [props.children] - Active channel content (omit for empty mode).
 * @param {React.ReactNode} [props.emptyStateEl] - Empty-state element when no server is selected.
 * @param {boolean} [props.isInstanceOffline] - Show offline banner.
 * @param {string} [props.instanceUrl] - Instance URL for the offline banner host display.
 * @param {boolean} [props.hasNoTransparencyLog] - Show transparency badge.
 * @param {string} [props.authToken] - Auth token (badge gating).
 * @param {React.ReactNode} [props.toastEl] - Toast slot.
 * @param {React.ReactNode} [props.guildCreateModal] - Guild create modal slot.
 * @param {React.ReactNode} [props.pendingVoiceSwitchModal] - Voice switch confirm modal slot.
 */
export default function BlockAppShell({
  serverListEl,
  channelSidebarBody,
  channelSidebarFooter,
  children,
  emptyStateEl,
  isInstanceOffline,
  instanceUrl,
  hasNoTransparencyLog,
  authToken,
  toastEl,
  guildCreateModal,
  pendingVoiceSwitchModal,
}) {
  const isEmpty = !channelSidebarBody;

  return (
    <div
      data-slot="block-app-shell"
      data-state={isEmpty ? 'empty' : 'active'}
      className="lay-container relative flex h-svh w-full overflow-hidden bg-background text-foreground"
      style={{ overflow: 'hidden' }}
    >
      {isInstanceOffline && (
        <div
          data-slot="block-app-shell-offline-banner"
          role="status"
          className="absolute inset-x-0 top-0 z-30 border-b border-border bg-card px-4 py-1 text-xs text-muted-foreground"
        >
          {instanceUrl ? new URL(instanceUrl).host : 'Instance'} is offline - read-only mode
        </div>
      )}

      <ServerRail>{serverListEl}</ServerRail>

      <SidebarProvider
        defaultOpen
        data-slot="workspace-frame"
        className="m-2 ml-0 min-h-0 flex-1 overflow-hidden rounded-xl border border-border bg-card shadow-sm"
        style={{ '--sidebar-width': '15rem' }}
      >
        {isEmpty ? (
          <WorkspaceSurface>{emptyStateEl}</WorkspaceSurface>
        ) : (
          <>
            <ChannelSidebar footer={channelSidebarFooter}>
              {channelSidebarBody}
            </ChannelSidebar>
            <WorkspaceSurface>{children}</WorkspaceSurface>
          </>
        )}
      </SidebarProvider>

      {pendingVoiceSwitchModal}
      {guildCreateModal}

      {hasNoTransparencyLog && authToken && (
        <div
          className="transp-no-log-badge"
          title="Transparency log not configured - key operations cannot be independently verified"
          aria-label="Transparency log not configured"
        >
          <InfoCircledIcon width="16" height="16" aria-hidden="true" />
        </div>
      )}

      {toastEl}
    </div>
  );
}
