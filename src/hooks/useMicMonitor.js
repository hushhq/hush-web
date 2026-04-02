import { useCallback, useEffect, useRef, useState } from 'react';
import { createMicProcessingPipeline } from '../lib/micProcessing';

const MIC_MONITOR_STOPPED_ERROR = 'Microphone input stopped unexpectedly.';

export function buildMicMonitorAudioConstraints(deviceId = null) {
  const constraints = {
    // Local mic monitoring is a loopback path. Browser DSP can aggressively
    // clamp or suppress that signal, so keep the monitor profile predictable
    // and let Hush's own gate be the only active filter here.
    echoCancellation: false,
    noiseSuppression: false,
    autoGainControl: false,
    channelCount: 1,
  };
  if (deviceId) {
    constraints.deviceId = { exact: deviceId };
  }
  return constraints;
}

/**
 * Local microphone monitor used by the settings screen to let the user hear
 * the processed mic signal in isolation while tuning filters.
 */
export function useMicMonitor() {
  const isMountedRef = useRef(true);
  const sessionRef = useRef(null);
  const [isTesting, setIsTesting] = useState(false);
  const [level, setLevel] = useState(0);
  const [gateOpen, setGateOpen] = useState(false);
  const [error, setError] = useState(null);

  const stop = useCallback(async () => {
    const session = sessionRef.current;
    sessionRef.current = null;

    if (typeof session?.detachDiagnostics === 'function') {
      session.detachDiagnostics();
    }

    if (session?.noiseGateNode?.port) {
      session.noiseGateNode.port.onmessage = null;
    }

    if (isMountedRef.current) {
      setIsTesting(false);
      setLevel(0);
      setGateOpen(false);
    }

    if (session?.cleanup) {
      await session.cleanup();
    }
  }, []);

  const start = useCallback(async ({ deviceId, settings }) => {
    await stop();
    setError(null);

    const audioConstraints = buildMicMonitorAudioConstraints(deviceId);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: audioConstraints });
    const session = await createMicProcessingPipeline(stream, {
      monitorOutput: true,
      settings,
    });
    const track = stream.getAudioTracks()[0] ?? null;
    let diagnosticsAttached = true;

    const stopUnexpectedly = (message, details = null) => {
      if (!diagnosticsAttached || !isMountedRef.current) return;
      if (details) {
        console.warn('[audio] Mic monitor stopped unexpectedly:', message, details);
      } else {
        console.warn('[audio] Mic monitor stopped unexpectedly:', message);
      }
      setError(new Error(message));
      void stop();
    };

    const handleTrackEnded = () => {
      stopUnexpectedly(MIC_MONITOR_STOPPED_ERROR);
    };
    const handleTrackMute = () => {
      console.info('[audio] Mic monitor track muted by browser');
    };
    const handleTrackUnmute = () => {
      console.info('[audio] Mic monitor track unmuted by browser');
    };
    const handleAudioContextStateChange = () => {
      const nextState = session.audioContext?.state ?? 'unknown';
      if (nextState === 'closed') {
        stopUnexpectedly('Microphone test audio engine stopped unexpectedly.');
        return;
      }
      if (nextState === 'suspended') {
        console.info('[audio] Mic monitor audio context suspended');
      }
    };

    track?.addEventListener('ended', handleTrackEnded);
    track?.addEventListener('mute', handleTrackMute);
    track?.addEventListener('unmute', handleTrackUnmute);
    session.audioContext?.addEventListener?.('statechange', handleAudioContextStateChange);

    const detachDiagnostics = () => {
      if (!diagnosticsAttached) return;
      diagnosticsAttached = false;
      track?.removeEventListener('ended', handleTrackEnded);
      track?.removeEventListener('mute', handleTrackMute);
      track?.removeEventListener('unmute', handleTrackUnmute);
      session.audioContext?.removeEventListener?.('statechange', handleAudioContextStateChange);
    };

    if (session.noiseGateNode?.port) {
      session.noiseGateNode.port.onmessage = (event) => {
        if (event.data?.type !== 'level') return;
        if (!isMountedRef.current) return;
        setLevel(event.data.level ?? 0);
        setGateOpen(Boolean(event.data.gateOpen));
      };
    }

    sessionRef.current = {
      ...session,
      detachDiagnostics,
    };
    if (!isMountedRef.current) {
      detachDiagnostics();
      await session.cleanup();
      return;
    }
    setIsTesting(true);
  }, []);

  const updateSettings = useCallback((settings) => {
    if (!sessionRef.current) return;
    sessionRef.current.updateSettings(settings);
  }, []);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      const session = sessionRef.current;
      sessionRef.current = null;
      if (session?.noiseGateNode?.port) {
        session.noiseGateNode.port.onmessage = null;
      }
      if (session?.cleanup) {
        void session.cleanup();
      }
    };
  }, [stop]);

  return {
    isTesting,
    level,
    gateOpen,
    error,
    setError,
    start,
    stop,
    updateSettings,
  };
}
