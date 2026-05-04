import { useEffect, useRef, useState } from 'react';
import jsQR from 'jsqr';
import { Button } from './ui/button';

/**
 * Live camera-based QR scanner.
 *
 * Decoding strategy (ordered, with graceful fallback):
 *
 *   1. Browser-native `BarcodeDetector` (Chromium-family, Safari 16.4+
 *      with the shape-detection flag). Fast and battery-friendly because
 *      decoding happens off the JS thread.
 *   2. Pure-JS `jsQR` over a Canvas2D `getImageData` snapshot of the
 *      `<video>` frame. Used on Firefox, Brave (anti-fingerprinting
 *      blocks the native API), Safari without the experimental flag,
 *      and any other browser that does not expose `BarcodeDetector`.
 *
 * Either path runs against the same `requestAnimationFrame` loop and
 * the same `getUserMedia({ video: { facingMode: 'environment' } })`
 * stream. On a successful decode the loop stops and `onResult(rawText)`
 * fires. On unmount or `Cancel` all media tracks are released.
 *
 * The component only reports `onUnavailable` when neither path can run
 * at all (no `mediaDevices` AND no `BarcodeDetector` AND `jsQR` cannot
 * be loaded). In practice `jsQR` is bundled, so the real failure modes
 * are: no camera stream, or `getUserMedia` permission denied — both
 * surfaced through `onError`.
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
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const rafRef = useRef(null);
  const [hasMediaDevices, setHasMediaDevices] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined' || !navigator?.mediaDevices?.getUserMedia) {
      setHasMediaDevices(false);
      onUnavailable?.();
      return undefined;
    }

    let cancelled = false;

    // Prefer the native BarcodeDetector; fall back to jsQR otherwise.
    let nativeDetector = null;
    if ('BarcodeDetector' in window) {
      try {
        nativeDetector = new window.BarcodeDetector({ formats: ['qr_code'] });
      } catch {
        nativeDetector = null;
      }
    }

    const decodeNative = async (videoEl) => {
      const codes = await nativeDetector.detect(videoEl);
      if (codes && codes.length > 0 && codes[0]?.rawValue) {
        return codes[0].rawValue;
      }
      return null;
    };

    const decodeJsQR = (videoEl) => {
      const w = videoEl.videoWidth;
      const h = videoEl.videoHeight;
      if (!w || !h) return null;
      let canvas = canvasRef.current;
      if (!canvas) {
        canvas = document.createElement('canvas');
        canvasRef.current = canvas;
      }
      if (canvas.width !== w) canvas.width = w;
      if (canvas.height !== h) canvas.height = h;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return null;
      ctx.drawImage(videoEl, 0, 0, w, h);
      const imageData = ctx.getImageData(0, 0, w, h);
      const result = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert',
      });
      return result?.data ?? null;
    };

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
            const decoded = nativeDetector
              ? await decodeNative(videoRef.current)
              : decodeJsQR(videoRef.current);
            if (decoded) {
              onResult(decoded);
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
      if (videoRef.current) {
        try { videoRef.current.srcObject = null; } catch { /* ignore */ }
      }
    };
    // onResult/onCancel/onError/onUnavailable are stable refs from the
    // parent (it should pass useCallbacks). Re-running on identity change
    // would tear down the camera unnecessarily.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!hasMediaDevices) return null;

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
