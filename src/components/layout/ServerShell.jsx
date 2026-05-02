import { InfoCircledIcon } from '@radix-ui/react-icons';
import TransparencyBlock from './TransparencyBlock';
import BlockAppShell from './BlockAppShell';
import MobileShell from './MobileShell';

/**
 * Top-level authenticated shell.
 *
 * Routes between the transparency hard-fail view, the desktop block-led
 * shell (`BlockAppShell`, used for both empty and active states), and
 * the mobile shell. The legacy `AuthenticatedAppShell` /
 * `EmptyServerShell` chrome was removed in pt2 in favor of the
 * shadcn-block-native `BlockAppShell` composition.
 *
 * Mobile remains on `MobileShell` for this slice; pt3 will migrate the
 * mobile path onto shadcn `Sheet`-driven primitives.
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

  if (!isMobile) {
    return (
      <BlockAppShell
        serverListEl={serverListEl}
        channelSidebarEl={serverId ? channelSidebarEl : null}
        emptyStateEl={!serverId ? emptyStateEl : null}
        isInstanceOffline={isInstanceOffline}
        instanceUrl={instanceUrl}
        hasNoTransparencyLog={hasNoTransparencyLog}
        authToken={authToken}
        toastEl={toastEl}
        guildCreateModal={guildCreateModal}
        pendingVoiceSwitchModal={pendingVoiceSwitchModal}
      >
        {serverId ? children : null}
      </BlockAppShell>
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
