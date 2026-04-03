import { useEffect, useRef, useState } from 'react';
import HiddenAudioOutput from './HiddenAudioOutput';
import {
  applyAudioOutputSelection,
  shouldAttachAudioToVideoElement,
} from '../lib/mediaOutputRouting';

export default function StreamView({
  track,
  audioTrack,
  label,
  source,
  isLocal,
  onUnwatch,
  objectFit,
  standByAfterMs,
  selectedAudioOutputId = '',
  audioOutputOptions = [],
}) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const standbyTimerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const attachAudioToVideo = !isLocal && audioTrack
    ? shouldAttachAudioToVideoElement({ selectedAudioOutputId })
    : false;

  useEffect(() => {
    if (!videoRef.current || !track) return;

    const video = videoRef.current;
    const streamTracks = !isLocal && audioTrack && attachAudioToVideo ? [track, audioTrack] : [track];
    const stream = new MediaStream(streamTracks);
    video.srcObject = stream;

    const tryPlay = async () => {
      try {
        if (!isLocal && attachAudioToVideo) {
          await applyAudioOutputSelection(video, selectedAudioOutputId, audioOutputOptions);
        }
        await video.play();
      } catch {
        video.muted = true;
        try {
          await video.play();
        } catch (retryErr) {
          console.error('[StreamView] Playback failed:', retryErr);
        }
      }
    };

    tryPlay();

    return () => {
      video.srcObject = null;
    };
  }, [track, audioTrack, isLocal, attachAudioToVideo, selectedAudioOutputId, audioOutputOptions]);

  useEffect(() => {
    if (!isFullscreen) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') setIsFullscreen(false);
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isFullscreen]);

  // Stand-by: when view is out of focus (not in viewport or tab hidden) for standByAfterMs, call onUnwatch
  useEffect(() => {
    if (!onUnwatch || !standByAfterMs || standByAfterMs <= 0 || !containerRef.current) return;

    const el = containerRef.current;
    const inViewRef = { current: false };

    const clearStandbyTimer = () => {
      if (standbyTimerRef.current) {
        clearTimeout(standbyTimerRef.current);
        standbyTimerRef.current = null;
      }
    };

    const scheduleStandby = () => {
      clearStandbyTimer();
      standbyTimerRef.current = setTimeout(() => {
        standbyTimerRef.current = null;
        onUnwatch();
      }, standByAfterMs);
    };

    const updateFocus = (inView, docVisible) => {
      inViewRef.current = inView;
      const nowInFocus = inView && docVisible;
      if (nowInFocus) {
        clearStandbyTimer();
      } else {
        scheduleStandby();
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => updateFocus(entry.isIntersecting, document.visibilityState === 'visible'),
      { threshold: 0 }
    );
    observer.observe(el);

    const onVisibility = () => updateFocus(inViewRef.current, document.visibilityState === 'visible');

    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      clearStandbyTimer();
    };
  }, [onUnwatch, standByAfterMs]);

  const toggleFullscreen = () => setIsFullscreen((prev) => !prev);

  // Container dimensions/position are fully dynamic (fullscreen vs inline).
  const containerStyle = {
    position: isFullscreen ? 'fixed' : 'relative',
    ...(isFullscreen
      ? { inset: 0, zIndex: 9999 }
      : { width: '100%', height: '100%', minHeight: 0 }),
    background: 'var(--hush-elevated)',
    borderRadius: isFullscreen ? 0 : 'var(--radius-md)',
    overflow: 'hidden',
  };

  return (
    <div
      ref={containerRef}
      style={containerStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Mirror local webcam via CSS transform */}
      <div
        className="sv-video-wrapper"
        style={{ transform: (isLocal && source === 'webcam') ? 'scaleX(-1)' : undefined }}
      >
        <video
          ref={videoRef}
          autoPlay
          playsInline
          data-voice-playback={!isLocal && attachAudioToVideo ? 'true' : undefined}
          muted={isLocal}
          className="sv-video"
          style={{ objectFit: isFullscreen ? 'contain' : (objectFit ?? 'contain') }}
        />
      </div>

      {!isLocal && audioTrack && !attachAudioToVideo && (
        <HiddenAudioOutput
          track={audioTrack}
          selectedAudioOutputId={selectedAudioOutputId}
          audioOutputOptions={audioOutputOptions}
        />
      )}

      <button
        className={`sv-overlay-btn sv-fullscreen-btn`}
        style={{ opacity: (isHovered || isFullscreen) ? 1 : 0.4 }}
        onClick={toggleFullscreen}
        title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
      >
        {isFullscreen ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="4 14 10 14 10 20" />
            <polyline points="20 10 14 10 14 4" />
            <line x1="14" y1="10" x2="21" y2="3" />
            <line x1="3" y1="21" x2="10" y2="14" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 3 21 3 21 9" />
            <polyline points="9 21 3 21 3 15" />
            <line x1="21" y1="3" x2="14" y2="10" />
            <line x1="3" y1="21" x2="10" y2="14" />
          </svg>
        )}
      </button>

      <div className="sv-label">
        {source === 'screen' ? (
          <svg className="sv-source-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="3" width="20" height="14" rx="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
          </svg>
        ) : (
          <svg className="sv-source-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M23 7l-7 5 7 5V7z" />
            <rect x="1" y="5" width="15" height="14" rx="2" />
          </svg>
        )}
        {label}
      </div>

      {isLocal && <div className="sv-local-badge">You</div>}

      {onUnwatch && (
        <button
          className="sv-overlay-btn sv-unwatch-btn"
          style={{ opacity: isHovered ? 1 : 0.4 }}
          onClick={(e) => { e.stopPropagation(); onUnwatch(); }}
          title="Stop watching"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </div>
  );
}
