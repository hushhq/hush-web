import { InfoCircledIcon } from '@radix-ui/react-icons';
import TransparencyBlock from './TransparencyBlock';
import EmptyServerShell from './EmptyServerShell';
import AuthenticatedAppShell from './AuthenticatedAppShell';
import MobileShell from './MobileShell';

/**
 * Top-level authenticated shell.
 * Routes between the transparency error view, the empty (no server) shell,
 * the new desktop `AuthenticatedAppShell`, and the mobile shell.
 */
export default function ServerShell({
  transparencyError,
  onTransparencySignOut,
  serverId,
  isInstanceOffline,
  instanceUrl,
  serverListEl,
  emptyStateEl,
  guildCreateModal,
  hasNoTransparencyLog,
  authToken,
  toastEl,
  isMobile,
  sidebarWidth,
  onSidebarResize,
  channelSidebarEl,
  mobileStack,
  activeVoiceChannel,
  isViewingVoice,
  onVoiceBarClick,
  memberDrawerOpen,
  closeMemberDrawer,
  memberDrawerEl,
  pendingVoiceSwitchModal,
  children,
}) {
  if (transparencyError) {
    return <TransparencyBlock error={transparencyError} onSignOut={onTransparencySignOut} />;
  }

  if (!serverId) {
    return (
      <EmptyServerShell
        serverListEl={serverListEl}
        emptyStateEl={emptyStateEl}
        guildCreateModal={guildCreateModal}
        hasNoTransparencyLog={hasNoTransparencyLog}
        authToken={authToken}
        toastEl={toastEl}
      />
    );
  }

  if (!isMobile) {
    return (
      <AuthenticatedAppShell
        serverListEl={serverListEl}
        channelSidebarEl={channelSidebarEl}
        sidebarWidth={sidebarWidth}
        onSidebarResize={onSidebarResize}
        isInstanceOffline={isInstanceOffline}
        instanceUrl={instanceUrl}
        hasNoTransparencyLog={hasNoTransparencyLog}
        authToken={authToken}
        toastEl={toastEl}
        pendingVoiceSwitchModal={pendingVoiceSwitchModal}
        guildCreateModal={guildCreateModal}
      >
        {children}
      </AuthenticatedAppShell>
    );
  }

  return (
    <div
      className="app-shell app-shell--mobile lay-container"
      data-slot="app-shell"
      data-state="mobile"
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

      <MobileShell
        serverListEl={serverListEl}
        channelSidebarEl={channelSidebarEl}
        mobileStack={mobileStack}
        activeVoiceChannel={activeVoiceChannel}
        isViewingVoice={isViewingVoice}
        onVoiceBarClick={onVoiceBarClick}
        memberDrawerOpen={memberDrawerOpen}
        closeMemberDrawer={closeMemberDrawer}
        memberDrawerEl={memberDrawerEl}
      >
        {children}
      </MobileShell>

      {pendingVoiceSwitchModal}

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
