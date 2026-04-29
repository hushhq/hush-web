import { useState } from 'react';
import { Flex, Text } from '@radix-ui/themes';
import { GearIcon, DotFilledIcon } from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button.tsx';
import { Toggle } from '@/components/ui/toggle.tsx';
import UserSettingsModal from './UserSettingsModal';

/**
 * UserPanel - persistent user info panel at the very bottom of the channel
 * sidebar. Always visible regardless of voice state.
 *
 * Shows avatar (initials), username, online status, and quick-access buttons
 * for mic toggle, deafen toggle, and user settings.
 *
 * @param {object} props
 * @param {object} props.user - Auth user object ({ id, username, displayName }).
 * @param {boolean} props.isMuted - Current mic mute state.
 * @param {boolean} props.isDeafened - Current deafen state.
 * @param {boolean} props.isInVoice - Whether user is currently in a voice channel.
 * @param {function} props.onMute - Toggle mic mute.
 * @param {function} props.onDeafen - Toggle deafen.
 * @param {(settings: Partial<{ noiseGateEnabled: boolean, noiseGateThresholdDb: number }>) => void} [props.onMicFilterSettingsChange]
 */
export default function UserPanel({
  user,
  isMuted,
  isDeafened,
  isInVoice,
  onMute,
  onDeafen,
  onMicFilterSettingsChange,
}) {
  const [showSettings, setShowSettings] = useState(false);

  if (!user) return null;

  const displayName = user.displayName || user.username || 'User';
  const initials = displayName.charAt(0).toUpperCase();
  const muteLabel = isMuted ? 'Unmute microphone' : 'Mute microphone';
  const deafenLabel = isDeafened ? 'Undeafen' : 'Deafen';

  return (
    <>
      <Flex className="user-panel" align="center" justify="between">
        <Flex className="user-panel-identity" align="center" gap="2">
          <div className="user-panel-avatar">{initials}</div>
          <Flex direction="column" className="user-panel-info">
            <Text size="2" weight="medium" className="user-panel-name">
              {displayName}
            </Text>
            <Flex align="center" gap="1" className="user-panel-status">
              <DotFilledIcon width="8" height="8" color="var(--hush-live)" aria-hidden="true" focusable="false" />
              <Text size="1" color="gray">Online</Text>
            </Flex>
          </Flex>
        </Flex>
        <Flex gap="1" className="user-panel-actions">
          {/* Mic toggle */}
          <Toggle
            pressed={!!isMuted}
            onPressedChange={() => onMute?.()}
            disabled={!isInVoice}
            className={`user-panel-btn${isMuted ? ' user-panel-btn--danger' : ''}`}
            aria-label={muteLabel}
            title={muteLabel}
          >
            {isMuted ? (
              <svg data-icon="inline-start" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" focusable="false">
                <line x1="1" y1="1" x2="23" y2="23" />
                <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" />
                <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2c0 .51-.06 1-.16 1.47" />
                <line x1="12" y1="19" x2="12" y2="23" />
                <line x1="8" y1="23" x2="16" y2="23" />
              </svg>
            ) : (
              <svg data-icon="inline-start" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" focusable="false">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="23" />
                <line x1="8" y1="23" x2="16" y2="23" />
              </svg>
            )}
          </Toggle>

          {/* Deafen toggle */}
          <Toggle
            pressed={!!isDeafened}
            onPressedChange={() => onDeafen?.()}
            disabled={!isInVoice}
            className={`user-panel-btn${isDeafened ? ' user-panel-btn--danger' : ''}`}
            aria-label={deafenLabel}
            title={deafenLabel}
          >
            {isDeafened ? (
              <svg data-icon="inline-start" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" focusable="false">
                <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
                <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            ) : (
              <svg data-icon="inline-start" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" focusable="false">
                <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
                <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
              </svg>
            )}
          </Toggle>

          {/* Settings */}
          <Button
            type="button"
            variant="ghost"
            className="user-panel-btn"
            onClick={() => setShowSettings(true)}
            aria-label="User settings"
            title="User settings"
          >
            <GearIcon data-icon="inline-start" width="16" height="16" aria-hidden="true" focusable="false" />
          </Button>
        </Flex>
      </Flex>
      {showSettings && (
        <UserSettingsModal
          onClose={() => setShowSettings(false)}
          voiceRuntime={{
            isInVoice,
            isMuted,
            isDeafened,
            onMute,
            onDeafen,
            onMicFilterSettingsChange,
          }}
        />
      )}
    </>
  );
}
