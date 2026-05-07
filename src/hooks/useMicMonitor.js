import { useCallback, useEffect, useRef, useState } from 'react';
import { buildCaptureGraph } from '../audio/graph/CaptureGraphFactory';
import { normalizeMicFilterSettings, NOISE_GATE_WORKLET_URL } from '../lib/micProcessing';

const MIC_MONITOR_STOPPED_ERROR = 'Microphone input stopped unexpectedly.';

export function buildMicMonitorAudioConstraints(deviceId = null) {
  // Mirror the publish-path constraints (browser NS + AGC + EC). The
  // mic test must let the user preview exactly what peers will hear,
  // which means the same DSP pipeline. Echo cancellation in a local
  // loopback path means AEC cancels the round-trip from speakers
  // back into the mic — acceptable, and identical to what happens
  // during an active voice call when monitoring locally.
  const constraints = {
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true,
    // Force mono — same posture as the publish path (see
    // `audio/capture/buildConstraints.ts`).
    channelCount: { exact: 1 },
  };
  if (deviceId) {
    constraints.deviceId = { exact: deviceId };
  }
  return constraints;
}

/**
 * Local microphone monitor used by the settings screen to let the user hear
 * the processed mic signal in isolation while tuning filters.
 *
 * Uses buildCaptureGraph directly from the TS graph factory with
 * monitorOutput: true for local loopback.
 */
export function useMicMonitor() {
  const isMountedRef = useRef(true);
  const sessionRef = useRef(null);
  const [isTesting, setIsTesting] = useState(false);
  const [level, setLevel] = useState(0);
  const [gateOpen, setGateOpen] = useState(false);
  const [error, setError] = useState(null);
  // Real-time copies of level + gateOpen, written every worklet
  // message (~188 Hz at the current reportEveryNQuanta = 2). The
  // visual meter reads these from a requestAnimationFrame loop and
  // interpolates exponentially toward them so the bar moves
  // smoothly without flooding React with re-renders. The state
  // values above stay around for existing callers and tests; they
  // are throttled to ~30 Hz so they no longer drive jumpy paints.
  const levelRef = useRef(0);
  const gateOpenRef = useRef(false);

  const stop = useCallback(async () => {
    const session = sessionRef.current;
    sessionRef.current = null;

    if (typeof session?.detachDiagnostics === 'function') {
      session.detachDiagnostics();
    }

    if (session?.noiseGateNode?.port) {
      session.noiseGateNode.port.onmessage = null;
    }

    // Reset both the React state AND the real-time refs. Callers
    // that read `levelRef`/`gateOpenRef` (the meter's RAF smoother,
    // aria-valuenow) must see zero on stop, otherwise the visual
    // and accessible state diverge after the test ends.
    levelRef.current = 0;
    gateOpenRef.current = false;
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
    const normalizedSettings = normalizeMicFilterSettings(settings);

    // Guard: if AudioContext is unavailable, fall back to a raw-stream
    // session with no processing. Preserves previous behavior on
    // environments where Web Audio is not supported.
    if (typeof AudioContext === 'undefined') {
      const rawTrack = stream.getAudioTracks()[0] ?? null;
      sessionRef.current = {
        audioContext: null,
        noiseGateNode: null,
        cleanup: async () => { stream.getTracks().forEach((t) => t.stop()); },
        detachDiagnostics: () => {},
        updateSettings: () => {},
      };
      if (!isMountedRef.current) {
        await sessionRef.current.cleanup();
        sessionRef.current = null;
        return;
      }
      setIsTesting(true);
      return;
    }

    const graph = await buildCaptureGraph({
      stream,
      workletUrl: NOISE_GATE_WORKLET_URL,
      filterSettings: normalizedSettings,
      monitorOutput: true,
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
      const nextState = graph.audioContext?.state ?? 'unknown';
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
    graph.audioContext?.addEventListener?.('statechange', handleAudioContextStateChange);

    const detachDiagnostics = () => {
      if (!diagnosticsAttached) return;
      diagnosticsAttached = false;
      track?.removeEventListener('ended', handleTrackEnded);
      track?.removeEventListener('mute', handleTrackMute);
      track?.removeEventListener('unmute', handleTrackUnmute);
      graph.audioContext?.removeEventListener?.('statechange', handleAudioContextStateChange);
    };

    // Noise gate worklet level reports drive the mic test UI meter.
    // This is the one place where worklet→UI coupling is intentional.
    //
    // We write `levelRef`/`gateOpenRef` on every message so the panel's
    // RAF-driven smoother always sees the freshest sample; the React
    // `level`/`gateOpen` state writes are throttled to ~30 Hz (every
    // ~33 ms) to keep status text + tests responsive without re-
    // rendering the entire dialog at the worklet's posting rate.
    if (graph.noiseGateNode?.port) {
      let lastStateUpdate = 0;
      const STATE_UPDATE_INTERVAL_MS = 33;
      graph.noiseGateNode.port.onmessage = (event) => {
        if (event.data?.type !== 'level') return;
        if (!isMountedRef.current) return;
        const nextLevel = event.data.level ?? 0;
        const nextGateOpen = Boolean(event.data.gateOpen);
        levelRef.current = nextLevel;
        gateOpenRef.current = nextGateOpen;
        const now =
          typeof performance !== 'undefined' && performance.now
            ? performance.now()
            : Date.now();
        if (now - lastStateUpdate >= STATE_UPDATE_INTERVAL_MS) {
          lastStateUpdate = now;
          setLevel(nextLevel);
          setGateOpen(nextGateOpen);
        }
      };
    }

    // Cleanup mirrors CaptureSession.teardown: disconnect all nodes,
    // stop all tracks (including processedTrack if distinct), close context.
    const cleanup = async () => {
      try { graph.monitorGainNode?.disconnect(); } catch { /* teardown */ }
      try { graph.noiseGateNode?.disconnect(); } catch { /* teardown */ }
      try { graph.sourceNode?.disconnect(); } catch { /* teardown */ }
      try { graph.destinationNode?.disconnect(); } catch { /* teardown */ }
      stream.getTracks().forEach((t) => t.stop());
      if (graph.processedTrack !== stream.getAudioTracks()[0]) {
        graph.processedTrack?.stop();
      }
      if (graph.audioContext.state !== 'closed') {
        try { await graph.audioContext.close(); } catch { /* teardown */ }
      }
    };

    sessionRef.current = {
      audioContext: graph.audioContext,
      noiseGateNode: graph.noiseGateNode,
      cleanup,
      detachDiagnostics,
      updateSettings: (nextSettings) => {
        graph.applyFilterSettings(normalizeMicFilterSettings(nextSettings));
      },
    };
    if (!isMountedRef.current) {
      detachDiagnostics();
      await cleanup();
      return;
    }
    setIsTesting(true);
  }, []);

  const updateSettings = useCallback((settings) => {
    if (!sessionRef.current) return;
    sessionRef.current.updateSettings(settings);
  }, []);

  useEffect(() => {
    // Re-arm the mount flag on every (re)mount. Required under
    // React.StrictMode dev double-invoke: the first cleanup flips
    // this to false, and without re-arming on the second mount the
    // monitor session would be torn down inside `start()` before it
    // can flip `isTesting` to true (see early-out at line ~85 below).
    isMountedRef.current = true;
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
    levelRef,
    gateOpenRef,
    gateOpen,
    error,
    setError,
    start,
    stop,
    updateSettings,
  };
}
