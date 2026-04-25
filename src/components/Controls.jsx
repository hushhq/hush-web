import { QUALITY_PRESETS, IS_SCREEN_SHARE_SUPPORTED } from '../utils/constants';
import { Flex, Text } from '@radix-ui/themes';
import {
  DesktopIcon,
  SwitchIcon,
  ExitIcon,
  SpeakerLoudIcon,
  SpeakerOffIcon,
  ChevronDownIcon,
} from '@radix-ui/react-icons';
import { IconButton } from './ui';

/**
 * Renders a glyph with an optional diagonal strikethrough overlay so that on/off
 * states share the same base shape and only the strike indicates state change.
 * Avoids the worse UX of swapping between two visually different icons.
 */
function StrikableGlyph({ children, off, size = 16 }) {
  return (
    <span style={{ position: 'relative', display: 'inline-flex', width: size, height: size }} aria-hidden="true">
      {children}
      {off && (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
        >
          <line x1="3" y1="3" x2="21" y2="21" />
        </svg>
      )}
    </span>
  );
}

function MicGlyph({ off, size = 18 }) {
  return (
    <StrikableGlyph off={off} size={size}>
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="9" y="2" width="6" height="12" rx="3" />
        <path d="M5 11a7 7 0 0 0 14 0" />
        <line x1="12" y1="19" x2="12" y2="22" />
        <line x1="8" y1="22" x2="16" y2="22" />
      </svg>
    </StrikableGlyph>
  );
}

function WebcamGlyph({ off, size = 18 }) {
  // Camcorder-style glyph (rectangular body + lens block). Same shape on/off;
  // off state overlays a diagonal strikethrough via StrikableGlyph.
  return (
    <StrikableGlyph off={off} size={size}>
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M23 7l-7 5 7 5V7z" />
        <rect x="1" y="5" width="15" height="14" rx="2" />
      </svg>
    </StrikableGlyph>
  );
}

function DeafenGlyph({ off, size = 18 }) {
  return off ? (
    <SpeakerOffIcon width={size} height={size} aria-hidden="true" />
  ) : (
    <SpeakerLoudIcon width={size} height={size} aria-hidden="true" />
  );
}

/**
 * Signal strength icon with dynamic bar count and color based on RTT.
 * @param {{ bars: number, color: string, isReconnecting: boolean, rtt: number|null }} props
 */
function SignalIcon({ bars = 0, color = 'var(--hush-text-muted)', isReconnecting = false, rtt }) {
  const barDefs = [
    { x: 1, y: 16, h: 6 },
    { x: 7, y: 11, h: 11 },
    { x: 13, y: 6, h: 16 },
    { x: 19, y: 1, h: 21 },
  ];
  return (
    <svg
      className={`voice-panel-signal${isReconnecting ? ' voice-panel-signal--pulse' : ''}`}
      width="12"
      height="12"
      viewBox="0 0 24 24"
      aria-hidden="true"
      title={rtt != null ? `${rtt}ms` : 'Measuring...'}
    >
      {barDefs.map((bar, i) => (
        <rect
          key={i}
          x={bar.x}
          y={bar.y}
          width="4"
          height={bar.h}
          rx="1"
          fill={i < bars ? color : 'var(--hush-text-ghost)'}
        />
      ))}
    </svg>
  );
}

/**
 * VoiceConnectedPanel - voice status panel shown above the user panel
 * when the user is connected to a voice channel.
 *
 * Shows connection status, channel name, and voice-specific controls
 * (screenshare, webcam, disconnect).
 * Mic/deafen live in UserPanel - never duplicated here.
 *
 * @param {object} props
 * @param {string} props.channelName - Name of the connected voice channel.
 * @param {boolean} props.isScreenSharing - Whether screen is being shared.
 * @param {boolean} props.isWebcamOn - Whether webcam is on.
 * @param {number|null} props.signalBars - Number of signal bars to show (0-4).
 * @param {string} props.signalColor - CSS color for active signal bars.
 * @param {boolean} props.signalReconnecting - Whether WS is reconnecting.
 * @param {number|null} props.rtt - Round-trip time in ms.
 * @param {function} props.onScreenShare - Toggle screen share.
 * @param {function} props.onSwitchScreen - Switch shared window/screen without stopping.
 * @param {function} props.onWebcam - Toggle webcam (quality only).
 * @param {function} props.onDisconnect - Disconnect from voice.
 */
export function VoiceConnectedPanel({ channelName, isScreenSharing, isWebcamOn, signalBars, signalColor, signalReconnecting, rtt, onScreenShare, onSwitchScreen, onWebcam, onDisconnect }) {
  return (
    <Flex direction="column" className="voice-panel">
      <Flex justify="between" align="start" gap="2">
        <Flex direction="column" gap="1" className="voice-panel-info">
          <Flex align="center" gap="1">
            <SignalIcon bars={signalBars} color={signalColor} isReconnecting={signalReconnecting} rtt={rtt} />
            <Text size="1" color="green">
              Voice Connected{rtt != null ? ` \u00b7 ${rtt}ms` : ''}
            </Text>
          </Flex>
          <Text size="2" weight="medium" className="voice-panel-channel">
            {channelName}
          </Text>
        </Flex>
        <IconButton
          className="voice-panel-btn disconnect"
          onClick={onDisconnect}
          title="Disconnect from voice"
        >
          <ExitIcon width="16" height="16" aria-hidden="true" />
        </IconButton>
      </Flex>
      <Flex gap="1" className="voice-panel-controls">
        <IconButton
          className={`voice-panel-btn${isWebcamOn ? ' active' : ''}`}
          onClick={onWebcam}
          title={isWebcamOn ? 'Turn off camera' : 'Turn on camera'}
        >
          <WebcamGlyph off={!isWebcamOn} size={16} />
        </IconButton>

        <IconButton
          className={`voice-panel-btn${isScreenSharing ? ' active' : ''}`}
          onClick={onScreenShare}
          title={isScreenSharing ? 'Stop sharing' : 'Share screen'}
        >
          <DesktopIcon width="16" height="16" aria-hidden="true" />
        </IconButton>

        {isScreenSharing && onSwitchScreen && (
          <IconButton
            className="voice-panel-btn"
            onClick={onSwitchScreen}
            title="Switch window"
          >
            <SwitchIcon width="16" height="16" aria-hidden="true" />
          </IconButton>
        )}
      </Flex>
    </Flex>
  );
}

export default function Controls({
  isReady,
  isScreenSharing,
  isMicOn,
  isDeafened = false,
  isWebcamOn,
  quality,
  isMobile = false,
  mediaE2EEUnavailable = false,
  showScreenShare = true,
  showWebcam = true,
  showQualityPicker = true,
  onScreenShare,
  onOpenQualityOrWindow,
  onMic,
  onDeafen,
  onWebcam,
  onMicDeviceSwitch,
  onWebcamDeviceSwitch,
  onLeave,
}) {
  const btnSize = isMobile ? '52px' : '44px';
  const mediaDisabled = mediaE2EEUnavailable;
  const mediaTitle = mediaE2EEUnavailable ? 'Media encryption unavailable' : undefined;

  return (
    <div className="ctrl-bar">
      {/* Screen Share */}
      {showScreenShare && (!isMobile || IS_SCREEN_SHARE_SUPPORTED) && (
        <button
          className={`ctrl-btn${isScreenSharing ? ' ctrl-btn--active' : ''}`}
          style={{
            height: btnSize,
            ...(mediaDisabled ? { opacity: 0.6, cursor: 'not-allowed' } : {}),
          }}
          onClick={onScreenShare}
          disabled={!isReady || !IS_SCREEN_SHARE_SUPPORTED || mediaDisabled}
          title={mediaTitle || (isScreenSharing ? 'Stop sharing' : 'Share screen')}
        >
          <DesktopIcon width="18" height="18" aria-hidden="true" />
          {isScreenSharing ? 'Stop' : 'Share'}
          {isScreenSharing && (
            <span className="ctrl-quality-tag">{QUALITY_PRESETS[quality]?.label || quality}</span>
          )}
        </button>
      )}

      {/* Change quality or window (only visible when sharing and showQualityPicker) */}
      {showQualityPicker && isScreenSharing && (
        <button
          className={`ctrl-icon-btn${isScreenSharing ? ' ctrl-icon-btn--active' : ''}`}
          style={{ width: btnSize, height: btnSize }}
          onClick={onOpenQualityOrWindow}
          title="Change quality or window"
        >
          <SwitchIcon width="16" height="16" aria-hidden="true" />
        </button>
      )}

      {showScreenShare && <div className="ctrl-divider" />}

      {/* Microphone + device switch (always show chevron when device switch available) */}
      {onMicDeviceSwitch ? (
        <div
          className="ctrl-device-group"
          style={{
            height: btnSize,
            background: isMicOn ? 'var(--hush-amber)' : 'var(--hush-danger-ghost)',
            color: isMicOn ? 'var(--hush-black)' : 'var(--hush-danger)',
            ...(mediaDisabled ? { opacity: 0.6, pointerEvents: 'none' } : {}),
          }}
        >
          <button
            type="button"
            className="ctrl-device-group-main"
            style={{ width: btnSize, height: btnSize }}
            onClick={onMic}
            disabled={!isReady || mediaDisabled}
            title={mediaTitle || (isMicOn ? 'Mute mic' : 'Unmute mic')}
          >
            <MicGlyph off={!isMicOn} />
          </button>
          <button
            type="button"
            className="ctrl-device-group-chevron"
            style={{ height: btnSize }}
            onClick={(e) => {
              e.stopPropagation();
              onMicDeviceSwitch();
            }}
            disabled={mediaDisabled}
            title="Change microphone"
          >
            <ChevronDownIcon width="12" height="12" aria-hidden="true" />
          </button>
        </div>
      ) : (
        <button
          className={`ctrl-icon-btn${isMicOn ? ' ctrl-icon-btn--active' : ' ctrl-icon-btn--danger'}`}
          style={{
            width: btnSize,
            height: btnSize,
            ...(mediaDisabled ? { opacity: 0.6, cursor: 'not-allowed' } : {}),
          }}
          onClick={onMic}
          disabled={!isReady || mediaDisabled}
          title={mediaTitle || (isMicOn ? 'Mute mic' : 'Unmute mic')}
        >
          <MicGlyph off={!isMicOn} />
        </button>
      )}

      {/* Deafen (mute audio output) */}
      {onDeafen && (
        <button
          className={`ctrl-icon-btn${isDeafened ? ' ctrl-icon-btn--danger' : ''}`}
          style={{ width: btnSize, height: btnSize }}
          onClick={onDeafen}
          title={isDeafened ? 'Undeafen' : 'Deafen'}
        >
          <DeafenGlyph off={isDeafened} />
        </button>
      )}

      {showWebcam && <div className="ctrl-divider" />}
      {/* Webcam + device switch */}
      {showWebcam && onWebcamDeviceSwitch ? (
        <div
          className="ctrl-device-group"
          style={{
            height: btnSize,
            background: isWebcamOn ? 'var(--hush-amber)' : 'var(--hush-surface)',
            color: isWebcamOn ? 'var(--hush-black)' : 'var(--hush-text-secondary)',
            ...(mediaDisabled ? { opacity: 0.6, pointerEvents: 'none' } : {}),
          }}
        >
          <button
            type="button"
            className="ctrl-device-group-main"
            style={{ width: btnSize, height: btnSize }}
            onClick={onWebcam}
            disabled={!isReady || mediaDisabled}
            title={mediaTitle || (isWebcamOn ? 'Turn off camera' : 'Turn on camera')}
          >
            <WebcamGlyph off={!isWebcamOn} />
          </button>
          <button
            type="button"
            className="ctrl-device-group-chevron"
            style={{ height: btnSize }}
            onClick={(e) => {
              e.stopPropagation();
              onWebcamDeviceSwitch();
            }}
            disabled={mediaDisabled}
            title="Change webcam"
          >
            <ChevronDownIcon width="12" height="12" aria-hidden="true" />
          </button>
        </div>
      ) : showWebcam ? (
        <button
          className={`ctrl-icon-btn${isWebcamOn ? ' ctrl-icon-btn--active' : ''}`}
          style={{
            width: btnSize,
            height: btnSize,
            ...(mediaDisabled ? { opacity: 0.6, cursor: 'not-allowed' } : {}),
          }}
          onClick={onWebcam}
          disabled={!isReady || mediaDisabled}
          title={mediaTitle || (isWebcamOn ? 'Turn off camera' : 'Turn on camera')}
        >
          <WebcamGlyph off={!isWebcamOn} />
        </button>
      ) : null}

      <div className="ctrl-divider" />

      {/* Leave */}
      <button
        className="ctrl-btn ctrl-btn--danger"
        style={{ height: btnSize }}
        onClick={onLeave}
      >
        Leave
      </button>
    </div>
  );
}
