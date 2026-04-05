import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../lib/bandwidthEstimator', () => ({
  estimateUploadSpeed: vi.fn(() => Promise.resolve({ uploadMbps: 10 })),
  getRecommendedQuality: vi.fn(() => ({ key: 'source', uploadMbps: 10 })),
  measureLiveUploadMbps: vi.fn(() => Promise.resolve({ mbps: 10, bytesSent: 0, timestamp: 0 })),
}));
vi.mock('../components/Chat', () => ({
  default: function MockChat() {
    return <div data-testid="chat">Chat</div>;
  },
}));

import VoiceChannel from './VoiceChannel';

const mockConnectRoom = vi.fn(() => Promise.resolve());
const mockDisconnectRoom = vi.fn(() => Promise.resolve());

vi.mock('../contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));
vi.mock('../hooks/useRoom', () => ({
  useRoom: vi.fn(),
}));
vi.mock('../hooks/useBreakpoint', () => ({
  useBreakpoint: vi.fn(() => 'desktop'),
}));
vi.mock('../hooks/useDevices', () => ({
  useDevices: vi.fn(() => ({
    audioDevices: [],
    videoDevices: [],
    selectedMicId: 'mic-1',
    selectedWebcamId: null,
    selectMic: vi.fn(),
    selectWebcam: vi.fn(),
    hasSavedMic: true,
    hasSavedWebcam: false,
    requestPermission: vi.fn(),
  })),
}));
vi.mock('../lib/mlsStore', () => ({
  openStore: vi.fn(() => Promise.resolve(null)),
}));

let ControlsProps = null;
vi.mock('../components/Controls', () => ({
  default: function MockControls(props) {
    ControlsProps = props;
    return <div data-testid="controls">Controls</div>;
  },
}));

import { useAuth } from '../contexts/AuthContext';
import { useRoom } from '../hooks/useRoom';
import { useBreakpoint } from '../hooks/useBreakpoint';
import { useDevices } from '../hooks/useDevices';

function renderVoiceChannel(channel, serverId = 's1') {
  return render(
    <MemoryRouter>
      <VoiceChannel
        channel={channel}
        serverId={serverId}
        getToken={() => 'token'}
        wsClient={{}}
      />
    </MemoryRouter>,
  );
}

describe('VoiceChannel', () => {
  beforeEach(() => {
    const publishMic = vi.fn();
    const muteMic = vi.fn();
    const unmuteMic = vi.fn();

    vi.mocked(useBreakpoint).mockReturnValue('desktop');
    vi.mocked(useAuth).mockReturnValue({
      user: { id: 'user-1', displayName: 'Test User' },
    });
    vi.mocked(useDevices).mockReturnValue({
      audioDevices: [],
      videoDevices: [],
      selectedMicId: 'mic-1',
      selectedWebcamId: null,
      selectMic: vi.fn(),
      selectWebcam: vi.fn(),
      hasSavedMic: true,
      hasSavedWebcam: false,
      requestPermission: vi.fn(),
    });
    vi.mocked(useRoom).mockReturnValue({
      isReady: true,
      error: null,
      localTracks: new Map(),
      remoteTracks: new Map(),
      participants: [],
      connectRoom: mockConnectRoom,
      disconnectRoom: mockDisconnectRoom,
      publishScreen: vi.fn(),
      unpublishScreen: vi.fn(),
      changeQuality: vi.fn(),
      publishWebcam: vi.fn(),
      unpublishWebcam: vi.fn(),
      publishMic,
      unpublishMic: vi.fn(),
      muteMic,
      unmuteMic,
      availableScreens: new Map(),
      watchedScreens: new Set(),
      loadingScreens: new Set(),
      watchScreen: vi.fn(),
      unwatchScreen: vi.fn(),
      isE2EEEnabled: false,
      voiceEpoch: null,
      isVoiceReconnecting: false,
    });
    ControlsProps = null;
    mockConnectRoom.mockClear();
  });

  it('renders channel name and Live badge', () => {
    const channel = { id: 'ch1', name: 'voice-1', serverId: 's1', type: 'voice' };
    renderVoiceChannel(channel);
    expect(screen.getByText('#voice-1')).toBeInTheDocument();
    expect(screen.getByText('Live')).toBeInTheDocument();
  });

  it('calls connectRoom with derived room name and displayName', async () => {
    const channel = { id: 'ch1', name: 'voice-1', serverId: 's1', type: 'voice' };
    renderVoiceChannel(channel, 's1');
    await waitFor(() => {
      expect(mockConnectRoom).toHaveBeenCalledWith(
        'channel-ch1',
        'Test User',
        'ch1',
      );
    });
  });

  it('always shows video controls', () => {
    vi.mocked(useBreakpoint).mockReturnValue('mobile');
    const channel = {
      id: 'ch1',
      name: 'voice-1',
      serverId: 's1',
      type: 'voice',
    };
    renderVoiceChannel(channel);
    expect(ControlsProps).not.toBeNull();
    expect(ControlsProps.showScreenShare).toBe(true);
    expect(ControlsProps.showWebcam).toBe(true);
    expect(ControlsProps.showQualityPicker).toBe(true);
  });

  it('deafens by muting the active mic and restores it on undeafen', async () => {
    vi.mocked(useBreakpoint).mockReturnValue('mobile');

    const publishMic = vi.fn();
    const muteMic = vi.fn(() => Promise.resolve());
    const unmuteMic = vi.fn(() => Promise.resolve());

    vi.mocked(useRoom).mockReturnValue({
      isReady: true,
      error: null,
      localTracks: new Map(),
      remoteTracks: new Map(),
      participants: [],
      connectRoom: mockConnectRoom,
      disconnectRoom: mockDisconnectRoom,
      publishScreen: vi.fn(),
      unpublishScreen: vi.fn(),
      changeQuality: vi.fn(),
      publishWebcam: vi.fn(),
      unpublishWebcam: vi.fn(),
      publishMic,
      unpublishMic: vi.fn(),
      muteMic,
      unmuteMic,
      availableScreens: new Map(),
      watchedScreens: new Set(),
      loadingScreens: new Set(),
      watchScreen: vi.fn(),
      unwatchScreen: vi.fn(),
      isE2EEEnabled: false,
      voiceEpoch: null,
      isVoiceReconnecting: false,
    });

    const channel = {
      id: 'ch1',
      name: 'voice-1',
      serverId: 's1',
      type: 'voice',
    };

    renderVoiceChannel(channel);

    await waitFor(() => {
      expect(ControlsProps).not.toBeNull();
    });

    await ControlsProps.onMic();

    expect(publishMic).toHaveBeenCalledWith('mic-1');

    await ControlsProps.onDeafen();

    await waitFor(() => {
      expect(muteMic).toHaveBeenCalledTimes(1);
    });

    await ControlsProps.onDeafen();

    await waitFor(() => {
      expect(unmuteMic).toHaveBeenCalledTimes(1);
    });
  });

  it('does not pass isLowLatency to useRoom', () => {
    const channel = {
      id: 'ch1',
      name: 'voice-1',
      serverId: 's1',
      type: 'voice',
    };
    renderVoiceChannel(channel);

    const calls = vi.mocked(useRoom).mock.calls;
    const lastCall = calls[calls.length - 1][0];
    expect(lastCall).not.toHaveProperty('isLowLatency');
  });
});
