/**
 * Profile-driven MediaTrackConstraints builder for mic capture.
 *
 * Replaces the hardcoded buildPublishedMicAudioConstraints() in
 * trackManager.js with a typed, profile-aware version. The existing
 * JS function is not modified — this is a parallel implementation
 * for future adoption.
 *
 * Constraint strategy per profile:
 *
 *   desktop-standard / local-monitor:
 *     Browser DSP OFF. Hush owns processing (AudioContext + noise gate).
 *
 *   mobile-web-standard:
 *     Browser DSP ON (NS + AGC + EC). No AudioContext pipeline.
 *     Relies on the browser's built-in processing for stability.
 */

import type { CaptureProfile } from '../core/VoiceAudioTypes';

export interface MicConstraints {
  echoCancellation: boolean;
  noiseSuppression: boolean;
  autoGainControl: boolean;
  channelCount: number;
  deviceId?: { exact: string };
}

/**
 * Builds getUserMedia audio constraints from a capture profile.
 *
 * @param profile - The resolved capture profile for the current mode.
 * @param deviceId - Optional mic device ID.
 */
export function buildConstraints(
  profile: CaptureProfile,
  deviceId?: string | null,
): MicConstraints {
  const constraints: MicConstraints = {
    echoCancellation: profile.browserDsp,
    noiseSuppression: profile.browserDsp,
    autoGainControl: profile.browserDsp,
    channelCount: 1,
  };

  if (deviceId) {
    constraints.deviceId = { exact: deviceId };
  }

  return constraints;
}
