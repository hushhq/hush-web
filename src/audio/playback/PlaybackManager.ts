/**
 * PlaybackManager — TypeScript owner of remote audio playback elements.
 *
 * Owns all HTMLAudioElement instances for remote participant audio.
 * React provides a container via bindContainer(); the manager creates,
 * attaches, and removes audio elements inside it.
 *
 * Lifecycle:
 *   new PlaybackManager()
 *   bindContainer(element)       — mount point ready
 *   addRemoteAudioTrack(...)     — remote track arrives
 *   removeRemoteAudioTrack(sid)  — remote track leaves
 *   setRemoteAudioMuted(true)    — deafen
 *   unbindContainer()            — component unmounting
 *   dispose()                    — full cleanup
 *
 * Video elements are NOT managed here — React keeps video ownership.
 */

export interface ManagedAudioTrack {
  sid: string;
  element: HTMLAudioElement;
  /** Cleanup for autoplay retry listeners, if any. */
  cleanupRetry: (() => void) | null;
}

export class PlaybackManager {
  private _container: HTMLElement | null = null;
  private _tracks: Map<string, ManagedAudioTrack> = new Map();
  private _muted = false;
  private _disposed = false;

  get isDisposed(): boolean { return this._disposed; }
  get isMuted(): boolean { return this._muted; }
  get trackCount(): number { return this._tracks.size; }

  /**
   * Bind the DOM container where audio elements will be mounted.
   * Call after the React ref is available.
   */
  bindContainer(element: HTMLElement): void {
    if (this._disposed) return;
    this._container = element;

    // Attach any tracks that arrived before the container was ready.
    for (const managed of this._tracks.values()) {
      if (!managed.element.parentNode) {
        this._container.appendChild(managed.element);
      }
    }
  }

  /**
   * Unbind the container. Audio elements are removed from the DOM
   * but kept in memory so they can be re-attached if a new container
   * is bound (e.g. React re-mount).
   */
  unbindContainer(): void {
    for (const managed of this._tracks.values()) {
      if (managed.element.parentNode) {
        managed.element.parentNode.removeChild(managed.element);
      }
    }
    this._container = null;
  }

  /**
   * Add a remote audio track. Creates an <audio> element, attaches
   * the track, attempts playback with autoplay retry.
   */
  addRemoteAudioTrack(sid: string, track: MediaStreamTrack): void {
    if (this._disposed) return;
    if (this._tracks.has(sid)) return; // already managed

    const audio = document.createElement('audio');
    audio.autoplay = true;
    audio.setAttribute('playsinline', '');
    audio.style.display = 'none';
    audio.muted = this._muted;
    audio.srcObject = new MediaStream([track]);

    const managed: ManagedAudioTrack = { sid, element: audio, cleanupRetry: null };

    // Attempt play with autoplay retry on user interaction.
    try {
      const playPromise = audio.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {
          this._attachAutoplayRetry(managed);
        });
      }
    } catch {
      this._attachAutoplayRetry(managed);
    }
    this._tracks.set(sid, managed);

    if (this._container) {
      this._container.appendChild(audio);
    }
  }

  /**
   * Remove a remote audio track. Pauses, clears srcObject, removes
   * element from DOM.
   */
  removeRemoteAudioTrack(sid: string): void {
    const managed = this._tracks.get(sid);
    if (!managed) return;

    this._teardownElement(managed);
    this._tracks.delete(sid);
  }

  /**
   * Mute or unmute all managed remote audio elements.
   * This is the playback-level mute — VoiceChannel's deafen handler
   * calls this instead of querySelectorAll.
   */
  setRemoteAudioMuted(muted: boolean): void {
    this._muted = muted;
    for (const managed of this._tracks.values()) {
      managed.element.muted = muted;
    }
  }

  /**
   * Full cleanup. Removes all elements, clears state.
   * Idempotent.
   */
  dispose(): void {
    if (this._disposed) return;
    this._disposed = true;

    for (const managed of this._tracks.values()) {
      this._teardownElement(managed);
    }
    this._tracks.clear();
    this._container = null;
  }

  private _attachAutoplayRetry(managed: ManagedAudioTrack): void {
    const resume = () => {
      try {
        const p = managed.element.play();
        if (p && typeof p.catch === 'function') p.catch(() => {});
      } catch { /* best effort */ }
      document.removeEventListener('touchstart', resume);
      document.removeEventListener('click', resume);
    };
    document.addEventListener('touchstart', resume, { once: true });
    document.addEventListener('click', resume, { once: true });
    managed.cleanupRetry = () => {
      document.removeEventListener('touchstart', resume);
      document.removeEventListener('click', resume);
    };
  }

  private _teardownElement(managed: ManagedAudioTrack): void {
    managed.cleanupRetry?.();
    managed.element.pause();
    managed.element.srcObject = null;
    if (managed.element.parentNode) {
      managed.element.parentNode.removeChild(managed.element);
    }
  }
}
