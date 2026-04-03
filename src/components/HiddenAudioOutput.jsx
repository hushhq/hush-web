import { useEffect, useMemo, useRef } from 'react';
import {
  applyAudioOutputSelection,
  shouldAttachAudioToVideoElement,
} from '../lib/mediaOutputRouting';

const OFFSCREEN_MEDIA_STYLE = {
  position: 'fixed',
  width: '1px',
  height: '1px',
  opacity: 0,
  pointerEvents: 'none',
  left: '-9999px',
  top: '0',
};

export default function HiddenAudioOutput({
  track,
  selectedAudioOutputId = '',
  audioOutputOptions = [],
}) {
  const mediaRef = useRef(null);
  const useVideoElement = useMemo(
    () => shouldAttachAudioToVideoElement({ selectedAudioOutputId }),
    [selectedAudioOutputId],
  );

  useEffect(() => {
    if (!mediaRef.current || !track) return;

    const media = mediaRef.current;
    media.srcObject = new MediaStream([track]);

    const tryPlay = async () => {
      try {
        await applyAudioOutputSelection(media, selectedAudioOutputId, audioOutputOptions);
        await media.play();
      } catch {
        const resume = () => {
          void applyAudioOutputSelection(media, selectedAudioOutputId, audioOutputOptions);
          media.play().catch(() => {});
          document.removeEventListener('touchstart', resume);
          document.removeEventListener('click', resume);
        };
        document.addEventListener('touchstart', resume, { once: true });
        document.addEventListener('click', resume, { once: true });
      }
    };

    tryPlay();

    return () => {
      media.srcObject = null;
    };
  }, [track, selectedAudioOutputId, audioOutputOptions]);

  if (useVideoElement) {
    return <video ref={mediaRef} autoPlay playsInline data-voice-playback="true" style={OFFSCREEN_MEDIA_STYLE} />;
  }
  return <audio ref={mediaRef} autoPlay playsInline data-voice-playback="true" style={OFFSCREEN_MEDIA_STYLE} />;
}
