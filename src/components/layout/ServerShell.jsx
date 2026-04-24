import { Flex, Box } from '@radix-ui/themes';
import { InfoCircledIcon } from '@radix-ui/react-icons';
import TransparencyBlock from './TransparencyBlock';
import EmptyServerShell from './EmptyServerShell';
import DesktopShell from './DesktopShell';
import MobileShell from './MobileShell';

/**
 * Top-level authenticated shell.
 * Handles transparency hard-fail, empty state, offline banner, and
 * delegates to DesktopShell or MobileShell depending on breakpoint.
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

  return (
    <Flex className="lay-container" direction="row" height="100dvh" overflow="hidden" gap="2" p="3" style={{ overflow: 'hidden' }}>
      {isInstanceOffline && (
        <Box
          className="lay-offline-banner"
          position="absolute"
          top="0"
          left="0"
          right="0"
          style={{ zIndex: 20 }}
        >
          {instanceUrl ? new URL(instanceUrl).host : 'Instance'} is offline - read-only mode
        </Box>
      )}

      {!isMobile && (
        <DesktopShell
          serverListEl={serverListEl}
          channelSidebarEl={channelSidebarEl}
          sidebarWidth={sidebarWidth}
          onSidebarResize={onSidebarResize}
        >
          {children}
        </DesktopShell>
      )}

      {isMobile && (
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
      )}

      {pendingVoiceSwitchModal}

      {hasNoTransparencyLog && authToken && (
        <Box
          className="transp-no-log-badge"
          title="Transparency log not configured - key operations cannot be independently verified"
          aria-label="Transparency log not configured"
        >
          <InfoCircledIcon width="16" height="16" aria-hidden="true" />
        </Box>
      )}

      {toastEl}
    </Flex>
  );
}
