/**
 * React adapter for VoiceAudioEngine.
 *
 * Creates and manages a VoiceAudioEngine instance, exposing typed state
 * to React via useSyncExternalStore. Not wired into any production
 * component in this branch — available for future gradual adoption.
 *
 * Engine disposal runs exclusively in effect cleanup (not during
 * render) so the render phase stays side-effect free.
 */

import { useEffect, useMemo, useSyncExternalStore } from 'react';
import { VoiceAudioEngine, resolveMode, resolvePlatform } from '../core/VoiceAudioEngine';
import type { VoiceAudioState, PublishMicOptions, AudioRuntimeMode, AudioPlatform } from '../core/VoiceAudioTypes';

export interface UseVoiceAudioEngineOptions {
  isLowLatency?: boolean;
  isLocalMonitor?: boolean;
  isMobileWebAudio?: boolean;
}

export function useVoiceAudioEngine(
  options: UseVoiceAudioEngineOptions = {},
): {
  engine: VoiceAudioEngine;
  state: VoiceAudioState;
  mode: AudioRuntimeMode;
  platform: AudioPlatform;
  publishOptions: PublishMicOptions;
} {
  const mode = resolveMode(options);
  const platform = resolvePlatform(options);

  // Pure creation — no side effects, no disposal of previous instance.
  const engine = useMemo(
    () => new VoiceAudioEngine({ mode, platform }),
    [mode, platform],
  );

  // Dispose this engine instance when it is replaced (mode/platform
  // change) or when the consuming component unmounts.
  useEffect(() => {
    return () => { engine.dispose(); };
  }, [engine]);

  const state = useSyncExternalStore(
    (callback) => engine.subscribe(callback),
    () => engine.state,
    () => engine.state,
  );

  return { engine, state, mode, platform, publishOptions: engine.publishOptions };
}
