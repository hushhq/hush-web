import { InfoCircledIcon } from '@radix-ui/react-icons';

/**
 * AuthenticatedAppShell — desktop selected-server outer shell.
 *
 * Discord-like two-left-column composition (server rail + channel sidebar)
 * adapted from shadcn/dashboard-01 grammar: edge-to-edge, h-dvh-bound,
 * 1px hairline separators, slot-named data attributes, no nested rounded
 * panel inside the shell.
 *
 * `.lay-container` / `.lay-main` / `.lay-content-row` / `.lay-channel-area`
 * remain as compatibility hooks for non-migrated CSS selectors and the
 * existing test contract; visual rules now live on `.app-shell*`.
 */
export default function AuthenticatedAppShell({
  serverListEl,
  channelSidebarEl,
  sidebarWidth,
  onSidebarResize,
  isInstanceOffline,
  instanceUrl,
  hasNoTransparencyLog,
  authToken,
  toastEl,
  pendingVoiceSwitchModal,
  guildCreateModal,
  children,
}) {
  return (
    <div
      className="app-shell lay-container"
      data-slot="app-shell"
      style={{ overflow: 'hidden' }}
    >
      {isInstanceOffline && (
        <div
          className="app-shell__offline-banner lay-offline-banner"
          data-slot="app-shell-offline-banner"
        >
          {instanceUrl ? new URL(instanceUrl).host : 'Instance'} is offline - read-only mode
        </div>
      )}

      <div
        className="app-shell__server-rail"
        data-slot="app-shell-server-rail"
      >
        {serverListEl}
      </div>

      <div
        className="app-shell__workspace lay-main"
        data-slot="app-shell-workspace"
      >
        <div
          className="app-shell__workspace-row lay-content-row"
          data-slot="app-shell-workspace-row"
        >
          <div
            className="app-shell__sidebar"
            data-slot="app-shell-sidebar"
            style={{ width: sidebarWidth }}
          >
            {channelSidebarEl}
            <div
              className="app-shell__resize-handle lay-resize-handle"
              data-slot="app-shell-resize"
              onMouseDown={onSidebarResize}
              role="separator"
              aria-orientation="vertical"
              aria-label="Resize channel list"
            />
          </div>
          <div
            className="app-shell__main lay-channel-area"
            data-slot="app-shell-main"
          >
            {children}
          </div>
        </div>
      </div>

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
