import { Flex, Box, Text } from '@radix-ui/themes';
import SystemChannel from '../../pages/SystemChannel';
import TextChannel from '../../pages/TextChannel';
import VoiceChannel from '../../pages/VoiceChannel';
import ChannelAreaHeader from './ChannelAreaHeader';

/**
 * Shared channel content surface used by both desktop and mobile layouts.
 * Renders the active voice channel, text channel, system channel, or empty
 * placeholder depending on navigation state.
 */
export default function ChannelContent({
  loading,
  isViewingVoice,
  activeVoiceChannel,
  serverId,
  getToken,
  wsClient,
  members,
  memberIds,
  onlineUserIds,
  myRole,
  showToast,
  handleMemberUpdate,
  showMembers,
  showChatPanel,
  showParticipantsPanel,
  togglePanel,
  toggleMemberDrawer,
  handleVoiceLeave,
  handleOrbPhaseChange,
  voiceParticipants,
  voiceMuteStates,
  voiceControlsRef,
  handleVoiceStateChange,
  instanceUrl,
  isMobile,
  isDmView,
  currentChannel,
  dmPeerName,
  handleMarkRead,
  handleMobileBack,
  orbPhase,
  toggleDrawer,
  desktopMembersSidebar,
}) {
  const hasOrbTopHeader = isViewingVoice || !currentChannel;
  // Back-to-channels affordance is mobile-only: on desktop the channel sidebar
  // stays visible, so the button has no semantic role and creates a header
  // control with nothing to navigate back to.
  const onMobileBack = isMobile ? handleMobileBack : undefined;

  return (
    <>
      {activeVoiceChannel && (
        <Flex
          style={{ display: isViewingVoice ? 'flex' : 'none' }}
          direction="column"
          flexGrow="1"
          minHeight="0"
          overflow="hidden"
          position="relative"
        >
          <VoiceChannel
            key={activeVoiceChannel.id}
            channel={activeVoiceChannel}
            serverId={serverId}
            getToken={getToken}
            wsClient={wsClient}
            recipientUserIds={memberIds}
            members={members}
            onlineUserIds={onlineUserIds}
            myRole={myRole}
            showToast={showToast}
            onMemberUpdate={handleMemberUpdate}
            showMembers={isMobile ? false : showMembers}
            showChatPanel={showChatPanel}
            showParticipantsPanel={showParticipantsPanel}
            onTogglePanel={
              isMobile
                ? (name) => (name === 'members' ? toggleMemberDrawer() : togglePanel(name))
                : togglePanel
            }
            onLeave={handleVoiceLeave}
            onOrbPhaseChange={handleOrbPhaseChange}
            serverParticipants={voiceParticipants.get(activeVoiceChannel.id) ?? []}
            voiceMuteStates={voiceMuteStates}
            onMobileBack={onMobileBack}
            voiceControlsRef={voiceControlsRef}
            onVoiceStateChange={handleVoiceStateChange}
            baseUrl={instanceUrl ?? ''}
          />
        </Flex>
      )}

      {!isViewingVoice &&
        (loading ? (
          <Flex className="lay-placeholder" align="center" justify="center">
            Loading…
          </Flex>
        ) : currentChannel?.type === 'system' ? (
          <SystemChannel
            channel={currentChannel}
            serverId={serverId}
            getToken={getToken}
            wsClient={wsClient}
            members={members}
            onToggleDrawer={undefined}
            onMobileBack={onMobileBack}
          />
        ) : currentChannel?.type === 'text' ? (
          <TextChannel
            channel={currentChannel}
            serverId={serverId}
            getToken={getToken}
            wsClient={wsClient}
            members={members}
            showMembers={isMobile ? false : isDmView ? false : showMembers}
            onToggleMembers={
              isDmView ? undefined : isMobile ? toggleMemberDrawer : () => togglePanel('members')
            }
            onToggleDrawer={undefined}
            onMobileBack={onMobileBack}
            markReadEnabled={isDmView}
            onMarkRead={handleMarkRead}
            sidebarSlot={isMobile ? null : desktopMembersSidebar}
            baseUrl={instanceUrl ?? ''}
            headerTitle={dmPeerName}
          />
        ) : currentChannel && currentChannel.type !== 'voice' ? (
          <Flex className="lay-placeholder" align="center" justify="center">
            Unknown channel type
          </Flex>
        ) : (
          <>
            {!currentChannel && (
              <ChannelAreaHeader
                isMobile={isMobile}
                onToggleDrawer={toggleDrawer}
                onToggleMembers={() => togglePanel('members')}
                showMembers={showMembers}
              />
            )}
            <Flex flexGrow="1" overflow="hidden">
              <Box flexGrow="1" />
              {!isMobile && desktopMembersSidebar}
            </Flex>
          </>
        ))}

      {!loading &&
        (((!currentChannel && !isViewingVoice) ||
          (isViewingVoice && orbPhase === 'idle')) && (
          <Flex
            position="absolute"
            inset="0"
            align="center"
            justify="center"
            className="lay-empty-overlay"
            style={{
              paddingTop: hasOrbTopHeader ? 48 : 0,
              paddingRight: !isMobile && showMembers ? 260 : 0,
            }}
          >
            <Flex direction="column" align="center" gap="3" style={{ pointerEvents: 'auto' }}>
              <Text as="span" size="1" className="lay-empty-label">
                {isViewingVoice ? 'connecting...' : 'select channel'}
              </Text>
              <Box
                className={isViewingVoice ? '' : 'empty-state-dot'}
                style={{ background: isViewingVoice ? 'var(--hush-text-muted)' : undefined }}
              />
            </Flex>
          </Flex>
        ))}
    </>
  );
}
