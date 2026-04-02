import { useState, useEffect, useCallback } from 'react';
import {
  buildAudioOutputOptions,
  isMobileAudioExperience,
  DEFAULT_AUDIO_OUTPUT_ID,
} from '../lib/mediaOutputRouting';

const STORAGE_KEY_MIC = 'hush_selectedMic';
const STORAGE_KEY_WEBCAM = 'hush_selectedWebcam';
const STORAGE_KEY_AUDIO_OUTPUT = 'hush_selectedAudioOutput';

/**
 * Manages audio/video device enumeration and selection.
 * Persists choices in localStorage.
 */
export function useDevices() {
  const [audioDevices, setAudioDevices] = useState([]);
  const [videoDevices, setVideoDevices] = useState([]);
  const [audioOutputDevices, setAudioOutputDevices] = useState([]);
  const [selectedMicId, setSelectedMicId] = useState(
    () => localStorage.getItem(STORAGE_KEY_MIC) || null,
  );
  const [selectedWebcamId, setSelectedWebcamId] = useState(
    () => localStorage.getItem(STORAGE_KEY_WEBCAM) || null,
  );
  const [selectedAudioOutputId, setSelectedAudioOutputId] = useState(
    () => localStorage.getItem(STORAGE_KEY_AUDIO_OUTPUT) ?? DEFAULT_AUDIO_OUTPUT_ID,
  );

  const enumerate = useCallback(async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      setAudioDevices(devices.filter((d) => d.kind === 'audioinput'));
      setVideoDevices(devices.filter((d) => d.kind === 'videoinput'));
      setAudioOutputDevices(devices.filter((d) => d.kind === 'audiooutput'));
    } catch (err) {
      console.error('[devices] Enumeration failed:', err);
    }
  }, []);

  useEffect(() => {
    enumerate();
    navigator.mediaDevices.addEventListener('devicechange', enumerate);
    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', enumerate);
    };
  }, [enumerate]);

  const selectMic = useCallback((deviceId) => {
    setSelectedMicId(deviceId);
    localStorage.setItem(STORAGE_KEY_MIC, deviceId);
  }, []);

  const selectWebcam = useCallback((deviceId) => {
    setSelectedWebcamId(deviceId);
    localStorage.setItem(STORAGE_KEY_WEBCAM, deviceId);
  }, []);

  const selectAudioOutput = useCallback((deviceId) => {
    const nextDeviceId = deviceId ?? DEFAULT_AUDIO_OUTPUT_ID;
    setSelectedAudioOutputId(nextDeviceId);
    localStorage.setItem(STORAGE_KEY_AUDIO_OUTPUT, nextDeviceId);
  }, []);

  /**
   * Request temporary permission so enumerateDevices returns labels.
   * Immediately stops the returned tracks.
   */
  const requestPermission = useCallback(async (kind) => {
    try {
      const constraints = kind === 'audio' ? { audio: true } : { video: true };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      stream.getTracks().forEach((t) => t.stop());
      await enumerate();
    } catch (err) {
      console.error(`[devices] Permission request failed (${kind}):`, err);
    }
  }, [enumerate]);

  return {
    audioDevices,
    videoDevices,
    audioOutputDevices,
    selectedMicId,
    selectedWebcamId,
    selectedAudioOutputId,
    selectMic,
    selectWebcam,
    selectAudioOutput,
    hasSavedMic: selectedMicId !== null,
    hasSavedWebcam: selectedWebcamId !== null,
    isMobileAudio: isMobileAudioExperience(),
    audioOutputOptions: buildAudioOutputOptions({ audioOutputDevices }),
    requestPermission,
    refreshDevices: enumerate,
  };
}
