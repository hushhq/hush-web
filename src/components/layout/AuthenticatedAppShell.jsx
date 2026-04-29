import { InfoCircledIcon } from '@radix-ui/react-icons';

/**
 * AuthenticatedAppShell - desktop selected-server outer shell.
 *
 * Owns the outer layout contract: server rail, workspace (channel sidebar +
 * main pane), and overlay slots. Replaces the scattered
 * `ServerShell`/`DesktopShell`/`lay-*` ownership chain for the desktop
 * server-selected path.
 *
 * Mobile and empty-state still go through their dedicated shells.
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
    <div className="app-shell lay-container" style={{ overflow: 'hidden' }}>
      {isInstanceOffline && (
        <div className="app-shell__offline-banner lay-offline-banner">
          {instanceUrl ? new URL(instanceUrl).host : 'Instance'} is offline - read-only mode
        </div>
      )}

      <div className="app-shell__server-rail">{serverListEl}</div>

      <div className="app-shell__workspace lay-main">
        <div className="app-shell__workspace-row lay-content-row">
          <div className="app-shell__sidebar" style={{ width: sidebarWidth }}>
            {channelSidebarEl}
            <div
              className="app-shell__resize-handle lay-resize-handle"
              onMouseDown={onSidebarResize}
              role="separator"
              aria-orientation="vertical"
              aria-label="Resize channel list"
            />
          </div>
          <div className="app-shell__main lay-channel-area">{children}</div>
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
