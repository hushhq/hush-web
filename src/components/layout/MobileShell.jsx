import { Flex } from '@radix-ui/themes';
import { SpeakerLoudIcon } from '@radix-ui/react-icons';

/**
 * Mobile two-stack layout shell.
 * Keeps legacy CSS animation classes on the stack wrappers while
 * delegating interior structure to Radix Themes primitives.
 */
export default function MobileShell({
  serverListEl,
  channelSidebarEl,
  mobileStack,
  activeVoiceChannel,
  isViewingVoice,
  onVoiceBarClick,
  memberDrawerOpen,
  closeMemberDrawer,
  memberDrawerEl,
  children,
}) {
  return (
    <>
      <div className={`mobile-stack-1${mobileStack >= 2 ? ' pushed' : ''}`}>
        {serverListEl}
        <Flex flexGrow="1" overflow="hidden" minWidth="0">
          {channelSidebarEl}
        </Flex>
      </div>

      <div className={`mobile-stack-2${mobileStack >= 2 ? ' active' : ''}`}>
        {activeVoiceChannel && !isViewingVoice && (
          <button type="button" className="voice-active-bar" onClick={onVoiceBarClick}>
            <SpeakerLoudIcon width="12" height="12" aria-hidden="true" />
            In Voice: {activeVoiceChannel._displayName ?? activeVoiceChannel.name} - Tap to return
          </button>
        )}

        <Flex className="mobile-content-area" direction="column" flexGrow="1" overflow="hidden" position="relative">
          {children}
        </Flex>

        <div
          className={`mobile-member-overlay${memberDrawerOpen ? ' visible' : ''}`}
          onClick={closeMemberDrawer}
          aria-hidden={!memberDrawerOpen}
        />
        <div className={`mobile-member-drawer${memberDrawerOpen ? ' open' : ''}`}>
          {memberDrawerEl}
        </div>
      </div>
    </>
  );
}
