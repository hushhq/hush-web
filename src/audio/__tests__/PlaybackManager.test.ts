import { describe, it, expect, vi, beforeEach } from 'vitest';

// jsdom does not provide MediaStream. Polyfill for tests.
if (typeof globalThis.MediaStream === 'undefined') {
  globalThis.MediaStream = class MockMediaStream {
    private _tracks: MediaStreamTrack[];
    constructor(tracks?: MediaStreamTrack[]) { this._tracks = tracks ?? []; }
    getTracks() { return this._tracks; }
    getAudioTracks() { return this._tracks.filter((t) => t.kind === 'audio'); }
  } as unknown as typeof MediaStream;
}

import { PlaybackManager } from '../playback/PlaybackManager';

function mockMediaStreamTrack(): MediaStreamTrack {
  return {
    kind: 'audio',
    readyState: 'live',
    id: `track-${Math.random().toString(36).slice(2)}`,
  } as unknown as MediaStreamTrack;
}

describe('PlaybackManager', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  // ─── Lifecycle ──────────────────────────────────────

  it('starts with zero tracks and not muted', () => {
    const manager = new PlaybackManager();
    expect(manager.trackCount).toBe(0);
    expect(manager.isMuted).toBe(false);
    expect(manager.isDisposed).toBe(false);
    manager.dispose();
  });

  it('bindContainer attaches pending tracks to the DOM', () => {
    const manager = new PlaybackManager();
    manager.addRemoteAudioTrack('t1', mockMediaStreamTrack());
    expect(container.childElementCount).toBe(0);

    manager.bindContainer(container);
    expect(container.childElementCount).toBe(1);
    expect(container.children[0].tagName).toBe('AUDIO');

    manager.dispose();
  });

  it('unbindContainer removes elements from DOM but keeps them in memory', () => {
    const manager = new PlaybackManager();
    manager.bindContainer(container);
    manager.addRemoteAudioTrack('t1', mockMediaStreamTrack());
    expect(container.childElementCount).toBe(1);

    manager.unbindContainer();
    expect(container.childElementCount).toBe(0);
    expect(manager.trackCount).toBe(1); // still tracked

    // Re-bind: elements re-attach
    manager.bindContainer(container);
    expect(container.childElementCount).toBe(1);

    manager.dispose();
  });

  // ─── Add / Remove ─────────────────────────────────

  it('addRemoteAudioTrack creates an audio element in the container', () => {
    const manager = new PlaybackManager();
    manager.bindContainer(container);

    manager.addRemoteAudioTrack('t1', mockMediaStreamTrack());
    expect(manager.trackCount).toBe(1);

    const audio = container.querySelector('audio');
    expect(audio).not.toBeNull();
    expect(audio!.style.display).toBe('none');
    expect(audio!.autoplay).toBe(true);

    manager.dispose();
  });

  it('addRemoteAudioTrack sets srcObject with the track', () => {
    const manager = new PlaybackManager();
    manager.bindContainer(container);
    const track = mockMediaStreamTrack();

    manager.addRemoteAudioTrack('t1', track);

    const audio = container.querySelector('audio')!;
    expect(audio.srcObject).toBeInstanceOf(MediaStream);

    manager.dispose();
  });

  it('addRemoteAudioTrack is idempotent for same sid', () => {
    const manager = new PlaybackManager();
    manager.bindContainer(container);

    manager.addRemoteAudioTrack('t1', mockMediaStreamTrack());
    manager.addRemoteAudioTrack('t1', mockMediaStreamTrack());
    expect(manager.trackCount).toBe(1);
    expect(container.childElementCount).toBe(1);

    manager.dispose();
  });

  it('removeRemoteAudioTrack removes the element from DOM', () => {
    const manager = new PlaybackManager();
    manager.bindContainer(container);

    manager.addRemoteAudioTrack('t1', mockMediaStreamTrack());
    expect(container.childElementCount).toBe(1);

    manager.removeRemoteAudioTrack('t1');
    expect(container.childElementCount).toBe(0);
    expect(manager.trackCount).toBe(0);

    manager.dispose();
  });

  it('removeRemoteAudioTrack clears srcObject', () => {
    const manager = new PlaybackManager();
    manager.bindContainer(container);

    manager.addRemoteAudioTrack('t1', mockMediaStreamTrack());
    const audio = container.querySelector('audio')!;
    expect(audio.srcObject).not.toBeNull();

    manager.removeRemoteAudioTrack('t1');
    expect(audio.srcObject).toBeNull();

    manager.dispose();
  });

  it('removeRemoteAudioTrack is safe for unknown sid', () => {
    const manager = new PlaybackManager();
    manager.removeRemoteAudioTrack('nonexistent'); // should not throw
    manager.dispose();
  });

  // ─── Mute ─────────────────────────────────────────

  it('setRemoteAudioMuted mutes all managed elements', () => {
    const manager = new PlaybackManager();
    manager.bindContainer(container);

    manager.addRemoteAudioTrack('t1', mockMediaStreamTrack());
    manager.addRemoteAudioTrack('t2', mockMediaStreamTrack());

    manager.setRemoteAudioMuted(true);
    expect(manager.isMuted).toBe(true);

    const audios = container.querySelectorAll('audio');
    expect(audios[0].muted).toBe(true);
    expect(audios[1].muted).toBe(true);

    manager.setRemoteAudioMuted(false);
    expect(audios[0].muted).toBe(false);
    expect(audios[1].muted).toBe(false);

    manager.dispose();
  });

  it('new tracks inherit current muted state', () => {
    const manager = new PlaybackManager();
    manager.bindContainer(container);

    manager.setRemoteAudioMuted(true);
    manager.addRemoteAudioTrack('t1', mockMediaStreamTrack());

    const audio = container.querySelector('audio')!;
    expect(audio.muted).toBe(true);

    manager.dispose();
  });

  // ─── Dispose ──────────────────────────────────────

  it('dispose removes all elements and prevents further operations', () => {
    const manager = new PlaybackManager();
    manager.bindContainer(container);

    manager.addRemoteAudioTrack('t1', mockMediaStreamTrack());
    manager.addRemoteAudioTrack('t2', mockMediaStreamTrack());
    expect(container.childElementCount).toBe(2);

    manager.dispose();
    expect(container.childElementCount).toBe(0);
    expect(manager.trackCount).toBe(0);
    expect(manager.isDisposed).toBe(true);

    // Further adds are no-ops
    manager.addRemoteAudioTrack('t3', mockMediaStreamTrack());
    expect(manager.trackCount).toBe(0);
  });

  it('dispose is idempotent', () => {
    const manager = new PlaybackManager();
    manager.dispose();
    manager.dispose();
    expect(manager.isDisposed).toBe(true);
  });

  // ─── Autoplay Retry ───────────────────────────────

  it('addRemoteAudioTrack calls play() on the element', () => {
    const manager = new PlaybackManager();
    manager.bindContainer(container);

    // Mock HTMLAudioElement.play at prototype level for this test
    const playSpy = vi.spyOn(HTMLAudioElement.prototype, 'play')
      .mockResolvedValue(undefined);

    manager.addRemoteAudioTrack('t1', mockMediaStreamTrack());
    expect(playSpy).toHaveBeenCalled();

    playSpy.mockRestore();
    manager.dispose();
  });
});
