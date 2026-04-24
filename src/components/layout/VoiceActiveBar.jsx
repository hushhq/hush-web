import { Text } from '@radix-ui/themes';
import { SpeakerLoudIcon } from '@radix-ui/react-icons';

/**
 * Mobile voice-in-progress indicator bar.
 *
 * Shown at the top of the mobile content area when the user is connected
 * to a voice channel but viewing another screen. Tap returns to the voice channel.
 */
export default function VoiceActiveBar({ activeVoiceChannel, onClick }) {
  return (
    <button type="button" className="voice-active-bar" onClick={onClick}>
      <SpeakerLoudIcon width="12" height="12" aria-hidden="true" />
      <Text as="span" size="1" weight="medium">
        In Voice: {activeVoiceChannel._displayName ?? activeVoiceChannel.name} - Tap to return
      </Text>
    </button>
  );
}
