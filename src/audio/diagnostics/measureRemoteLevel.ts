/**
 * Diagnostic utility: measures RMS and peak amplitude on remote
 * subscribed audio tracks.
 *
 * ── Measurement point ──────────────────────────────────────
 *
 * This measures the decoded audio signal AFTER:
 *   - sender capture + publish
 *   - network transport
 *   - codec decode (Opus)
 *   - LiveKit client track delivery
 *
 * This measures BEFORE:
 *   - HTML <audio> element attachment
 *   - DOM volume / muted state
 *   - output device routing (setSinkId)
 *   - system / OS volume
 *
 * So the measurement isolates the end-to-end audio path up to
 * the point where the browser hands the decoded PCM to the app.
 * Any difference in level between quality and performance channels
 * at this point is caused by the capture/publish/transport chain,
 * not by playback routing or DOM volume.
 *
 * ── Usage from browser console ─────────────────────────────
 *
 *   // window.__measureRemote is exposed in dev mode by useRoom
 *   window.__measureRemote()
 *   // Logs: [remote-diag] participant=Alice t=200ms rms=-30.1dBFS peak=-19.5dBFS
 *
 *   // With options:
 *   window.__measureRemote({ durationMs: 10000, intervalMs: 500 })
 *
 *   // Returns a Promise<stopFn> — call stopFn() to tear down early
 *   const stop = await window.__measureRemote()
 *   stop()
 *
 * ───────────────────────────────────────────────────────────
 */

import { measureCaptureLevel } from './measureCaptureLevel';
import type { LevelSample } from './measureCaptureLevel';

export interface RemoteLevelOptions {
  /** How long to measure in ms. Defaults to 5000. */
  durationMs?: number;
  /** Sample interval in ms. Defaults to 200. */
  intervalMs?: number;
  /** Custom handler per sample. If omitted, logs to console. */
  onSample?: (participantId: string, sample: LevelSample) => void;
}

/**
 * Measures level on all remote audio tracks in the provided Map.
 *
 * The Map shape matches useRoom's remoteTracksRef.current:
 *   Map<string, { track: { mediaStreamTrack }, participant: { identity, name? }, kind }>
 *
 * Returns a stop function that tears down all measurement taps.
 */
export function measureRemoteLevel(
  remoteTracks: Map<string, {
    track: { mediaStreamTrack?: MediaStreamTrack };
    participant: { identity: string; name?: string };
    kind: string;
  }>,
  options: RemoteLevelOptions = {},
): () => void {
  const {
    durationMs = 5000,
    intervalMs = 200,
    onSample,
  } = options;

  const stopFunctions: Array<() => void> = [];

  for (const [sid, info] of remoteTracks) {
    if (info.kind !== 'audio') continue;

    const mediaTrack = info.track.mediaStreamTrack;
    if (!mediaTrack || mediaTrack.readyState !== 'live') continue;

    const label = info.participant.name || info.participant.identity;

    const stop = measureCaptureLevel(mediaTrack, {
      durationMs,
      intervalMs,
      onSample: (sample) => {
        if (onSample) {
          onSample(info.participant.identity, sample);
        } else {
          console.log(
            `[remote-diag] participant=${label} sid=${sid} t=${sample.timestampMs}ms rms=${sample.rmsDbfs.toFixed(1)}dBFS peak=${sample.peakDbfs.toFixed(1)}dBFS`,
          );
        }
      },
    });

    stopFunctions.push(stop);
  }

  if (stopFunctions.length === 0) {
    console.warn('[remote-diag] No live remote audio tracks found.');
  } else {
    console.log(`[remote-diag] Measuring ${stopFunctions.length} remote audio track(s) for ${durationMs}ms`);
  }

  return () => {
    for (const stop of stopFunctions) {
      stop();
    }
  };
}
