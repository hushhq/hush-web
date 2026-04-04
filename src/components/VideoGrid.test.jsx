import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';

vi.mock('livekit-client', () => ({
  Track: { Source: { ScreenShare: 'screen_share', ScreenShareAudio: 'screen_share_audio' }, Kind: { Video: 'video' } },
}));
vi.mock('./StreamView', () => ({
  default: function MockStreamView({ isSpeaking, label }) {
    return <div data-testid={`stream-${label}`} data-speaking={isSpeaking} />;
  },
}));
vi.mock('./ScreenShareCard', () => ({
  default: function MockScreenShareCard() {
    return <div data-testid="screen-share-card" />;
  },
}));

import VideoGrid from './VideoGrid';

function localTrack(sid = 'local-mic') {
  return {
    track: { sid, kind: 'audio', mediaStreamTrack: {} },
    source: 'mic',
  };
}

describe('VideoGrid local speaking handoff', () => {
  const baseProps = {
    localTracks: new Map([['local-mic', localTrack()]]),
    remoteTracks: new Map(),
    availableScreens: new Map(),
    watchedScreens: new Set(),
    loadingScreens: new Set(),
    isScreenSharing: false,
    localScreenWatched: false,
    isMobile: false,
    breakpoint: 'desktop',
    onWatchScreen: vi.fn(),
    onUnwatchScreen: vi.fn(),
    onWatchLocalScreen: vi.fn(),
    onUnwatchLocalScreen: vi.fn(),
    participants: [{ userId: 'me', displayName: 'Me' }],
    currentUserId: 'me',
    currentDisplayName: 'Me',
    activeSpeakerIds: [],
    isMicOn: true,
    isDeafened: false,
  };

  it('local tile uses localSpeaking=true, ignoring activeSpeakerIds', () => {
    const { container } = render(
      <VideoGrid
        {...baseProps}
        activeSpeakerIds={[]} // LiveKit says not speaking
        localSpeaking={true}  // Observer says speaking
      />,
    );

    // The local placeholder tile should have the speaking class
    const speakingTile = container.querySelector('.vg-speaking');
    expect(speakingTile).not.toBeNull();
  });

  it('local tile uses localSpeaking=false even when activeSpeakerIds includes self', () => {
    const { container } = render(
      <VideoGrid
        {...baseProps}
        activeSpeakerIds={['me']} // LiveKit says speaking
        localSpeaking={false}     // Observer says not speaking
      />,
    );

    // The local placeholder tile should NOT have the speaking class
    const speakingTile = container.querySelector('.vg-speaking');
    expect(speakingTile).toBeNull();
  });

  it('local stream tile (with webcam) uses localSpeaking for speaking indicator', () => {
    const localTracksWithWebcam = new Map([
      ['local-webcam', {
        track: { sid: 'local-webcam', kind: 'video', mediaStreamTrack: {} },
        source: 'webcam',
      }],
      ['local-mic', localTrack()],
    ]);

    const { container } = render(
      <VideoGrid
        {...baseProps}
        localTracks={localTracksWithWebcam}
        activeSpeakerIds={[]}
        localSpeaking={true}
      />,
    );

    // The stream tile wrapper should have the speaking class
    const speakingTile = container.querySelector('.vg-tile-speaking');
    expect(speakingTile).not.toBeNull();
  });

  it('remote tile still uses activeSpeakerIds', () => {
    const remoteTracks = new Map([
      ['remote-audio', {
        track: { sid: 'remote-audio', kind: 'audio', mediaStreamTrack: {} },
        participant: { identity: 'alice', name: 'Alice' },
        source: 'mic',
      }],
    ]);

    const { container } = render(
      <VideoGrid
        {...baseProps}
        remoteTracks={remoteTracks}
        participants={[
          { userId: 'me', displayName: 'Me' },
          { userId: 'alice', displayName: 'Alice' },
        ]}
        activeSpeakerIds={['alice']}
        localSpeaking={false}
      />,
    );

    // Alice's placeholder tile should have speaking class
    const speakingTiles = container.querySelectorAll('.vg-speaking');
    expect(speakingTiles.length).toBe(1);
  });
});
