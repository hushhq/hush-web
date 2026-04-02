import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';

vi.mock('livekit-client', () => ({
  Track: {},
}));

vi.mock('../contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

vi.mock('../hooks/useAuth', () => ({
  getDeviceId: vi.fn(() => 'device-1'),
}));

vi.mock('../lib/ws', () => ({
  createWsClient: vi.fn(() => ({
    connect: vi.fn(),
    disconnect: vi.fn(),
  })),
}));

vi.mock('../lib/mlsStore', () => ({
  openStore: vi.fn(() => ({})),
}));

vi.mock('../hooks/useRoom', () => ({
  useRoom: vi.fn(() => ({
    isReady: false,
    error: null,
    localTracks: new Map(),
    remoteTracks: new Map(),
    participants: [],
    connectRoom: vi.fn().mockResolvedValue(undefined),
    disconnectRoom: vi.fn(),
    publishScreen: vi.fn(),
    unpublishScreen: vi.fn(),
    changeQuality: vi.fn(),
    publishWebcam: vi.fn(),
    unpublishWebcam: vi.fn(),
    publishMic: vi.fn(),
    unpublishMic: vi.fn(),
    availableScreens: [],
    watchedScreens: [],
    loadingScreens: false,
    watchScreen: vi.fn(),
    unwatchScreen: vi.fn(),
  })),
}));

vi.mock('../hooks/useBreakpoint', () => ({
  useBreakpoint: vi.fn(() => 'desktop'),
}));

vi.mock('../hooks/useDevices', () => ({
  useDevices: vi.fn(() => ({
    audioDevices: [],
    videoDevices: [],
    audioOutputOptions: [{ deviceId: '', label: 'System default' }],
    selectedMicId: null,
    selectedWebcamId: null,
    selectedAudioOutputId: '',
    selectMic: vi.fn(),
    selectWebcam: vi.fn(),
    selectAudioOutput: vi.fn(),
    hasSavedMic: false,
    hasSavedWebcam: false,
    requestPermission: vi.fn(),
  })),
}));
vi.mock('../components/Chat', () => ({
  default: function MockChat() {
    return <div data-testid="chat">Chat</div>;
  },
}));

let ControlsProps = null;
vi.mock('../components/Controls', () => ({
  default: function MockControls(props) {
    ControlsProps = props;
    return <div data-testid="controls">Controls</div>;
  },
}));

import { useAuth } from '../contexts/AuthContext';
import { useBreakpoint } from '../hooks/useBreakpoint';
import Room from './Room';

function makeAuthState(overrides = {}) {
  return {
    user: null,
    hasSession: false,
    needsUnlock: false,
    rehydrationAttempted: true,
    ...overrides,
  };
}

function LocationProbe() {
  const location = useLocation();
  return <div>{`${location.pathname}${location.search}`}</div>;
}

function renderRoom(path = '/room/test-room') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/room/:roomName" element={<Room />} />
        <Route path="/" element={<LocationProbe />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('Room', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
    ControlsProps = null;
  });

  it('redirects locked known-browser users through returnTo', async () => {
    useAuth.mockReturnValue(makeAuthState({ needsUnlock: true }));

    renderRoom('/room/private-room?foo=1');

    await waitFor(() => {
      expect(screen.getByText('/?returnTo=%2Froom%2Fprivate-room%3Ffoo%3D1')).toBeInTheDocument();
    });
  });

  it('redirects no-session direct room visitors to the join flow', async () => {
    useAuth.mockReturnValue(makeAuthState());

    renderRoom('/room/private-room');

    await waitFor(() => {
      expect(screen.getByText('/?join=private-room')).toBeInTheDocument();
    });
  });

  it('does not expose audio output switching in mobile web controls', async () => {
    useAuth.mockReturnValue(makeAuthState({
      user: { id: 'user-1' },
      hasSession: true,
    }));
    vi.mocked(useBreakpoint).mockReturnValue('mobile');
    sessionStorage.setItem('hush_channelId', 'channel-1');
    sessionStorage.setItem('hush_roomName', 'test-room');

    renderRoom('/room/test-room');

    await waitFor(() => {
      expect(ControlsProps).not.toBeNull();
    });

    expect(ControlsProps.onAudioOutputSwitch).toBeUndefined();
  });
});
