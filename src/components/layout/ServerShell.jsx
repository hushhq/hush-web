import { InfoCircledIcon } from '@radix-ui/react-icons';
import TransparencyBlock from './TransparencyBlock';
import BlockAppShell from './BlockAppShell';
import MobileShell from './MobileShell';

/**
 * Top-level authenticated shell.
 *
 * Routes between the transparency hard-fail view, the desktop block-led
 * shell (`BlockAppShell`), and the mobile shell. Desktop empty state is
 * handled inside `BlockAppShell` via the `emptyStateEl` slot.
 *
 * Channel sidebar slots are split:
 *   - `channelSidebarBody`: channel list / DM list (scrolls).
 *   - `channelSidebarFooter`: voice + user panel (anchored).
 *   - `mobileChannelSidebarEl`: pre-composed combined element kept for
 *     `MobileShell`, which still renders the channel sidebar as a
 *     single column without a `Sidebar` primitive.
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
  channelSidebarBody,
  channelSidebarFooter,
  mobileChannelSidebarEl,
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
        channelSidebarBody={serverId ? channelSidebarBody : null}
        channelSidebarFooter={serverId ? channelSidebarFooter : null}
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
        channelSidebarEl={mobileChannelSidebarEl}
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
