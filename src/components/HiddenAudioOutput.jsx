import { useEffect, useMemo, useRef } from 'react';
import { shouldUseVideoElementForAudioOutput } from '../lib/mediaOutputRouting';

const OFFSCREEN_MEDIA_STYLE = {
  position: 'fixed',
  width: '1px',
  height: '1px',
  opacity: 0,
  pointerEvents: 'none',
  left: '-9999px',
  top: '0',
};

export default function HiddenAudioOutput({ track }) {
  const mediaRef = useRef(null);
  const useVideoElement = useMemo(() => shouldUseVideoElementForAudioOutput(), []);

  useEffect(() => {
    if (!mediaRef.current || !track) return;

    const media = mediaRef.current;
    media.srcObject = new MediaStream([track]);

    const tryPlay = async () => {
      try {
        await media.play();
      } catch {
        const resume = () => {
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
  }, [track]);

  if (useVideoElement) {
    return <video ref={mediaRef} autoPlay playsInline style={OFFSCREEN_MEDIA_STYLE} />;
  }
  return <audio ref={mediaRef} autoPlay playsInline style={OFFSCREEN_MEDIA_STYLE} />;
}
