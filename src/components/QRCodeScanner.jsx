import { useEffect, useRef, useState } from 'react';
import { Button } from './ui';

/**
 * Live camera-based QR scanner.
 *
 * Uses the browser's built-in `BarcodeDetector` API (Chromium-family +
 * Safari 16+). When unavailable, the component renders nothing and
 * notifies the caller via `onUnavailable` so the host UI can show a
 * fallback message and keep the manual code-entry path.
 *
 * Lifecycle:
 *   - on mount: requests environment-facing camera, attaches stream to a
 *     `<video>` element, polls frames with `requestAnimationFrame` and
 *     decodes any QR code found
 *   - on a successful decode: calls `onResult(rawText)` and stops
 *   - on unmount or `Cancel`: stops all media tracks and the rAF loop
 *
 * @param {{
 *   onResult: (rawText: string) => void,
 *   onCancel: () => void,
 *   onError?: (msg: string) => void,
 *   onUnavailable?: () => void,
 * }} props
 */
export default function QRCodeScanner({ onResult, onCancel, onError, onUnavailable }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const rafRef = useRef(null);
  const [hasCamera, setHasCamera] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined' || !('BarcodeDetector' in window)) {
      setHasCamera(false);
      onUnavailable?.();
      return undefined;
    }

    let cancelled = false;
    let detector;
    try {
      detector = new window.BarcodeDetector({ formats: ['qr_code'] });
    } catch (err) {
      setHasCamera(false);
      onUnavailable?.();
      return undefined;
    }

    const start = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        const tick = async () => {
          if (cancelled || !videoRef.current) return;
          try {
            const codes = await detector.detect(videoRef.current);
            if (codes && codes.length > 0 && codes[0]?.rawValue) {
              onResult(codes[0].rawValue);
              return;
            }
          } catch {
            // Per-frame decode errors are non-fatal; keep polling.
          }
          rafRef.current = requestAnimationFrame(tick);
        };
        rafRef.current = requestAnimationFrame(tick);
      } catch (err) {
        const msg = err?.name === 'NotAllowedError'
          ? 'Camera permission denied.'
          : 'Could not start camera.';
        onError?.(msg);
      }
    };
    start();

    return () => {
      cancelled = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    };
    // onResult/onCancel/onError/onUnavailable are stable refs from the
    // parent (it should pass useCallbacks). Re-running on identity change
    // would tear down the camera unnecessarily.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!hasCamera) return null;

  return (
    <div className="ld-scanner">
      <video
        ref={videoRef}
        className="ld-scanner-video"
        muted
        playsInline
        aria-label="Camera viewfinder for QR code scanning"
      />
      <Button variant="secondary" onClick={onCancel}>
        Cancel
      </Button>
    </div>
  );
}
