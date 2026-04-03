import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import VideoGrid from './VideoGrid';

afterEach(() => {
  cleanup();
});

function renderGrid(props = {}) {
  return render(
    <VideoGrid
      localTracks={new Map()}
      remoteTracks={new Map()}
      availableScreens={new Map()}
      watchedScreens={new Set()}
      loadingScreens={new Set()}
      isScreenSharing={false}
      localScreenWatched={false}
      isMobile={false}
      breakpoint="desktop"
      onWatchScreen={() => {}}
      onUnwatchScreen={() => {}}
      onWatchLocalScreen={() => {}}
      onUnwatchLocalScreen={() => {}}
      participants={[
        { userId: 'user-1', displayName: 'Test User' },
      ]}
      currentUserId="user-1"
      currentDisplayName="Test User"
      activeSpeakerIds={[]}
      isMicOn
      isDeafened={false}
      voiceMuteStates={new Map()}
      selectedAudioOutputId=""
      audioOutputOptions={[]}
      {...props}
    />,
  );
}

describe('VideoGrid', () => {
  it('highlights the local placeholder when the local user is speaking', () => {
    renderGrid({ activeSpeakerIds: ['user-1'] });

    expect(screen.getByText('You').closest('.vg-placeholder-tile')).toHaveClass('vg-speaking');
  });

  it('does not highlight the local placeholder when the mic is off', () => {
    renderGrid({
      activeSpeakerIds: ['user-1'],
      isMicOn: false,
    });

    expect(screen.getByText('You').closest('.vg-placeholder-tile')).not.toHaveClass('vg-speaking');
  });
});
