/**
 * Profile-driven MediaTrackConstraints builder for mic capture.
 *
 * Replaces the hardcoded buildPublishedMicAudioConstraints() in
 * trackManager.js with a typed, profile-aware version. The existing
 * JS function is not modified — this is a parallel implementation
 * for future adoption.
 *
 * Constraint strategy per profile (current — temporary until the
 * Hush v2 DSP pipeline returns):
 *
 *   desktop-standard / mobile-web-standard:
 *     Browser DSP ON (NS + AGC + EC). Raw mic track from
 *     getUserMedia, no AudioContext pipeline. Echo cancellation is
 *     forced on regardless of profile (see below).
 *
 *   local-monitor:
 *     NS + AGC OFF, EC ON. Used when the future Hush DSP wants to
 *     own noise suppression / gain on a loopback path while still
 *     keeping the speaker-to-mic feedback loop killed.
 *
 * EC stays on across all profiles because acoustic echo cancel
 * needs the browser's speaker reference signal; turning it off
 * produces feedback in any voice context we ship.
 */

import type { CaptureProfile } from '../core/VoiceAudioTypes';

export interface MicConstraints {
  echoCancellation: boolean;
  noiseSuppression: boolean;
  autoGainControl: boolean;
  channelCount: ConstrainULong;
  deviceId?: { exact: string };
}

/**
 * Builds getUserMedia audio constraints from a capture profile.
 *
 * @param profile - The resolved capture profile for the current mode.
 * @param deviceId - Optional mic device ID.
 *
 * Echo cancellation is always on regardless of profile. Acoustic echo
 * cancellation needs the speaker reference signal, which only the
 * browser holds; turning it off when speakers are audible produces
 * loud feedback in any voice call. Noise suppression and auto gain
 * remain profile-driven so we can hand them back to a Hush-side DSP
 * pipeline in the future without forcing EC off too.
 */
export function buildConstraints(
  profile: CaptureProfile,
  deviceId?: string | null,
): MicConstraints {
  const constraints: MicConstraints = {
    echoCancellation: true,
    noiseSuppression: profile.browserDsp,
    autoGainControl: profile.browserDsp,
    // Force mono. Voice chat is single-channel by design and stereo
    // mics double the opus bandwidth without adding intelligibility.
    // `{ exact: 1 }` makes the browser fail acquisition rather than
    // silently hand back a stereo track that we'd then need to
    // downmix.
    channelCount: { exact: 1 },
  };

  if (deviceId) {
    constraints.deviceId = { exact: deviceId };
  }

  return constraints;
}
