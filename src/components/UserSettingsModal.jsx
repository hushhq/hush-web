import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useDevices } from '../hooks/useDevices';
import { useMicMonitor } from '../hooks/useMicMonitor';
import { getDeviceId } from '../hooks/useAuth.js';
import { getVaultConfig } from '../lib/identityVault';
import {
  getMicFilterSettings,
  setMicFilterSettings,
  MIC_GATE_THRESHOLD_MIN_DB,
  MIC_GATE_THRESHOLD_MAX_DB,
  MIC_GATE_THRESHOLD_STEP_DB,
} from '../lib/micProcessing';
import DeviceManagement from './DeviceManagement.jsx';
import InstancesSettingsTab from './InstancesSettingsTab.jsx';
import { Switch, Separator } from './ui/index.js';
import { Button } from './ui/button.tsx';
import { NativeSelect } from './ui/native-select.tsx';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs.tsx';
import ConfirmModal from './ConfirmModal.jsx';
import SettingsDialogShell from './layout/SettingsDialogShell';

const TAB_ACCOUNT = 'account';
const TAB_APPEARANCE = 'appearance';
const TAB_AUDIO_VIDEO = 'audio-video';
const TAB_DEVICES = 'devices';
const TAB_INSTANCES = 'instances';

const LEGACY_VAULT_TIMEOUT_KEY = 'hush_vault_timeout';

const VAULT_TIMEOUT_OPTIONS = [
  { value: 'browser_close', label: 'On browser close' },
  { value: 'refresh', label: 'On refresh' },
  { value: '1m', label: '1 minute' },
  { value: '15m', label: '15 minutes' },
  { value: '30m', label: '30 minutes' },
  { value: '1h', label: '1 hour' },
  { value: '4h', label: '4 hours' },
  { value: 'never', label: 'Never' },
];

const THEME_MODE_KEY = 'hush_theme_mode';
const DARK_THEME_KEY = 'hush_dark_theme';
const LIGHT_THEME_KEY = 'hush_light_theme';

const DARK_THEMES = [
  { key: 'og-dark', label: 'Dark', css: 'dark' },
];

const LIGHT_THEMES = [
  { key: 'og-light', label: 'Light', css: 'light' },
];

function formatVaultTimeoutValue(timeout) {
  if (typeof timeout === 'number') {
    switch (timeout) {
      case 60:
        return '1h';
      case 240:
        return '4h';
      default:
        return `${timeout}m`;
    }
  }
  return timeout || 'browser_close';
}

function parseVaultTimeoutValue(value) {
  switch (value) {
    case 'browser_close':
    case 'refresh':
    case 'never':
      return value;
    case '1m':
      return 1;
    case '15m':
      return 15;
    case '30m':
      return 30;
    case '1h':
      return 60;
    case '4h':
      return 240;
    default:
      return 'browser_close';
  }
}

function getStoredVaultTimeoutValue(userId) {
  const configuredTimeout = userId ? getVaultConfig(userId)?.timeout : null;
  if (configuredTimeout !== undefined && configuredTimeout !== null) {
    return formatVaultTimeoutValue(configuredTimeout);
  }
  return localStorage.getItem(LEGACY_VAULT_TIMEOUT_KEY) || 'browser_close';
}

function getStoredThemeMode() {
  return localStorage.getItem(THEME_MODE_KEY) || 'system';
}

function getStoredDarkTheme() {
  return localStorage.getItem(DARK_THEME_KEY) || 'og-dark';
}

function getStoredLightTheme() {
  return localStorage.getItem(LIGHT_THEME_KEY) || 'og-light';
}

function findThemeCss(key, themes, fallback) {
  const found = themes.find((t) => t.key === key);
  return found ? found.css : fallback;
}

function resolveActiveThemeCss(mode) {
  if (mode === 'light') {
    return findThemeCss(getStoredLightTheme(), LIGHT_THEMES, 'light');
  }
  if (mode === 'dark') {
    return findThemeCss(getStoredDarkTheme(), DARK_THEMES, 'dark');
  }
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return prefersDark
    ? findThemeCss(getStoredDarkTheme(), DARK_THEMES, 'dark')
    : findThemeCss(getStoredLightTheme(), LIGHT_THEMES, 'light');
}

function applyThemeMode(mode) {
  localStorage.setItem(THEME_MODE_KEY, mode);
  document.documentElement.dataset.theme = resolveActiveThemeCss(mode);
}

function getMicMonitorErrorMessage(error) {
  if (!error) return null;
  if (error?.name === 'NotAllowedError') {
    return 'Microphone access is required to test your mic.';
  }
  if (error?.name === 'NotFoundError') {
    return 'No microphone input is available on this device.';
  }
  return error?.message || 'Unable to start mic test.';
}

// Re-apply when OS preference changes while mode is 'system'
if (typeof window !== 'undefined') {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (getStoredThemeMode() === 'system') {
      document.documentElement.dataset.theme = resolveActiveThemeCss('system');
    }
  });
}


// ─── Account Tab ──────────────────────────────────────────

function AccountTab() {
  const { user, performLogout, logout, updateVaultTimeout } = useAuth();
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [vaultTimeout, setVaultTimeout] = useState(
    () => getStoredVaultTimeoutValue(user?.id),
  );

  useEffect(() => {
    setVaultTimeout(getStoredVaultTimeoutValue(user?.id));
  }, [user?.id]);

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleLogoutConfirm = async () => {
    setLoggingOut(true);
    try {
      // Use scorched-earth wipe if available (BIP39 auth), else standard logout.
      const wipe = performLogout || logout;
      await wipe();
    } finally {
      navigate('/');
    }
  };

  const handleVaultTimeoutChange = (value) => {
    setVaultTimeout(value);
    if (typeof updateVaultTimeout === 'function') {
      updateVaultTimeout(parseVaultTimeoutValue(value));
      return;
    }
    localStorage.setItem(LEGACY_VAULT_TIMEOUT_KEY, value);
  };

  const displayName = user?.displayName || 'Anonymous';
  const initials = displayName.charAt(0).toUpperCase();

  return (
    <>
      <div className="settings-section-title">Account</div>

      {/* Profile card */}
      <div className="settings-profile-card">
        <div className="settings-profile-banner" />
        <div className="settings-profile-body">
          <div className="settings-profile-avatar">{initials}</div>
          <div className="settings-profile-meta">
            <span className="settings-profile-display-name">{displayName}</span>
            <span className="settings-profile-username">@{user?.username || '\u2014'}</span>
          </div>
        </div>
      </div>

      {/* Settings card */}
      <div className="settings-card">
        <div className="settings-card-row">
          <div>
            <div className="settings-field-label">Display name</div>
            <div className="settings-card-value">{displayName}</div>
          </div>
        </div>
        <Separator />
        <div className="settings-card-row">
          <div>
            <div className="settings-field-label">Username</div>
            <div className="settings-card-value">{user?.username || '\u2014'}</div>
          </div>
        </div>
        <Separator />
        <div className="settings-card-row">
          <div style={{ flex: 1 }}>
            <div className="settings-field-label">Vault timeout</div>
            <NativeSelect
              className="w-full"
              value={vaultTimeout}
              onChange={(e) => handleVaultTimeoutChange(e.target.value)}
              aria-label="Vault timeout"
            >
              {VAULT_TIMEOUT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </NativeSelect>
            {vaultTimeout === 'never' && (
              <div className="settings-field-note settings-field-note--danger">
                Your key will remain decrypted in memory.
              </div>
            )}
            <div className="settings-field-note">
              How long before your vault locks and requires PIN re-entry.
            </div>
          </div>
        </div>
      </div>

      {/* Danger zone */}
      <div className="settings-danger-zone">
        <div className="settings-danger-title">Session</div>
        <div className="settings-danger-action">
          <span className="settings-danger-action-text">
            Sign out and permanently wipe all local data.
          </span>
          <Button
            type="button"
            variant="destructive"
            size="lg"
            onClick={handleLogoutClick}
            disabled={loggingOut}
          >
            {loggingOut ? 'Signing out\u2026' : 'Sign out'}
          </Button>
        </div>
      </div>

      {showLogoutConfirm && (
        <ConfirmModal
          title="Sign out and wipe data?"
          message={
            <>
              {'This will permanently delete all local data on this device, including your message history, encryption keys, and session. Messages will become unreadable after signing out. '}
              <span style={{ color: 'var(--hush-danger)' }}>
                You will need your 12-word recovery phrase to sign back in. This action cannot be undone.
              </span>
            </>
          }
          confirmLabel="Sign out and wipe data"
          confirmLoadingLabel="Signing out\u2026"
          cancelLabel="Stay signed in"
          loading={loggingOut}
          onConfirm={handleLogoutConfirm}
          onCancel={() => setShowLogoutConfirm(false)}
        />
      )}
    </>
  );
}

// ─── Appearance Tab ───────────────────────────────────────

function AppearanceTab() {
  const [mode, setMode] = useState(getStoredThemeMode);

  const handleModeChange = (newMode) => {
    setMode(newMode);
    applyThemeMode(newMode);
  };

  return (
    <>
      <div className="settings-section-title">Appearance</div>

      <div className="settings-field-row">
        <label className="settings-field-label" id="theme-mode-label">Theme mode</label>
        <Tabs value={mode} onValueChange={handleModeChange} aria-labelledby="theme-mode-label">
          <TabsList>
            <TabsTrigger value="system">System</TabsTrigger>
            <TabsTrigger value="dark">Dark</TabsTrigger>
            <TabsTrigger value="light">Light</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="settings-field-note">
          {mode === 'system'
            ? 'Follows your operating system preference.'
            : mode === 'dark'
              ? 'Always use the dark theme.'
              : 'Always use the light theme.'}
        </div>
      </div>

      {/* Per-mode theme variant pickers were dropped in slice 16: each
          variant list shipped with a single option, so the picker was
          a UI no-op that read as a real choice. They will return once
          additional themes exist. See ans16.md. */}
    </>
  );
}

// ─── Audio & Video Tab ────────────────────────────────────

function AudioVideoTab({ voiceRuntime = null }) {
  const {
    audioDevices,
    videoDevices,
    selectedMicId,
    selectedWebcamId,
    selectMic,
    selectWebcam,
    requestPermission,
    refreshDevices,
  } = useDevices();
  const {
    isTesting: isMicTesting,
    level: micTestLevel,
    gateOpen: isMicGateOpen,
    error: micTestError,
    setError: setMicTestError,
    start: startMicMonitor,
    stop: stopMicMonitor,
    updateSettings: updateMicMonitorSettings,
  } = useMicMonitor();
  const isolationSnapshotRef = useRef(null);
  const [micFilterSettings, setMicFilterSettingsState] = useState(() => getMicFilterSettings());

  const hasAudioLabels = audioDevices.some((d) => d.label);
  const hasVideoLabels = videoDevices.some((d) => d.label);

  const applyMicFilters = useCallback((nextSettings) => {
    const normalized = setMicFilterSettings(nextSettings);
    setMicFilterSettingsState(normalized);
    voiceRuntime?.onMicFilterSettingsChange?.(normalized);
    updateMicMonitorSettings(normalized);
    return normalized;
  }, [voiceRuntime, updateMicMonitorSettings]);

  const isolateVoiceForMicTest = useCallback(async () => {
    if (!voiceRuntime?.isInVoice) return;

    const snapshot = {
      isInVoice: true,
      isMuted: Boolean(voiceRuntime.isMuted),
      isDeafened: Boolean(voiceRuntime.isDeafened),
      appliedDeafen: false,
      appliedMute: false,
    };
    isolationSnapshotRef.current = snapshot;

    if (!snapshot.isDeafened) {
      snapshot.appliedDeafen = true;
      await Promise.resolve(voiceRuntime?.onDeafen?.());
      return;
    }

    if (!snapshot.isMuted) {
      snapshot.appliedMute = true;
      await Promise.resolve(voiceRuntime?.onMute?.());
    }
  }, [
    voiceRuntime?.isInVoice,
    voiceRuntime?.isMuted,
    voiceRuntime?.isDeafened,
    voiceRuntime?.onMute,
    voiceRuntime?.onDeafen,
  ]);

  const restoreVoiceAfterMicTest = useCallback(async () => {
    const snapshot = isolationSnapshotRef.current;
    isolationSnapshotRef.current = null;

    if (!snapshot?.isInVoice) return;

    if (snapshot.appliedDeafen) {
      await Promise.resolve(voiceRuntime?.onDeafen?.());
      return;
    }

    if (snapshot.appliedMute) {
      await Promise.resolve(voiceRuntime?.onMute?.());
    }
  }, [
    voiceRuntime?.onMute,
    voiceRuntime?.onDeafen,
  ]);

  const startMicTest = useCallback(async (deviceId = selectedMicId) => {
    setMicTestError(null);

    try {
      await isolateVoiceForMicTest();
      await startMicMonitor({
        deviceId: deviceId || null,
        settings: micFilterSettings,
      });
      await refreshDevices().catch(() => {});
    } catch (error) {
      await restoreVoiceAfterMicTest();
      setMicTestError(getMicMonitorErrorMessage(error));
    }
  }, [
    selectedMicId,
    micFilterSettings,
    setMicTestError,
    isolateVoiceForMicTest,
    startMicMonitor,
    refreshDevices,
    restoreVoiceAfterMicTest,
  ]);

  const stopMicTest = useCallback(async () => {
    await stopMicMonitor();
    await restoreVoiceAfterMicTest();
    setMicTestError(null);
  }, [restoreVoiceAfterMicTest, setMicTestError, stopMicMonitor]);

  const cleanupMicTest = useCallback(async () => {
    await stopMicMonitor();
    await restoreVoiceAfterMicTest();
  }, [restoreVoiceAfterMicTest, stopMicMonitor]);

  const handleMicSelectionChange = useCallback(async (event) => {
    const nextDeviceId = event.target.value;
    selectMic(nextDeviceId);

    if (!isMicTesting) return;

    setMicTestError(null);
    try {
      await stopMicMonitor();
      await startMicMonitor({
        deviceId: nextDeviceId || null,
        settings: micFilterSettings,
      });
    } catch (error) {
      await restoreVoiceAfterMicTest();
      setMicTestError(getMicMonitorErrorMessage(error));
    }
  }, [
    selectMic,
    isMicTesting,
    setMicTestError,
    stopMicMonitor,
    startMicMonitor,
    micFilterSettings,
    restoreVoiceAfterMicTest,
  ]);

  const handleMicTestToggle = useCallback(async () => {
    if (isMicTesting) {
      await stopMicTest();
      return;
    }
    await startMicTest();
  }, [isMicTesting, startMicTest, stopMicTest]);

  useEffect(() => {
    return () => {
      void cleanupMicTest();
    };
  }, [cleanupMicTest]);

  return (
    <>
      <div className="settings-section-title">Audio & Video</div>

      <div className="settings-card">
        <div className="settings-card-row">
          <div style={{ flex: 1 }}>
            <div className="settings-field-label">Microphone</div>
            {audioDevices.length === 0 || !hasAudioLabels ? (
              <Button
                type="button"
                variant="secondary"
                size="lg"
                onClick={() => requestPermission('audio')}
              >
                Grant microphone access
              </Button>
            ) : (
              <NativeSelect
                className="w-full"
                value={selectedMicId || ''}
                onChange={handleMicSelectionChange}
                aria-label="Microphone"
              >
                <option value="">Default</option>
                {audioDevices.map((d) => (
                  <option key={d.deviceId} value={d.deviceId}>
                    {d.label || d.deviceId}
                  </option>
                ))}
              </NativeSelect>
            )}
          </div>
        </div>
        <Separator />
        <div className="settings-card-row">
          <div style={{ flex: 1 }}>
            <div className="settings-field-label">Webcam</div>
            {videoDevices.length === 0 || !hasVideoLabels ? (
              <Button
                type="button"
                variant="secondary"
                size="lg"
                onClick={() => requestPermission('video')}
              >
                Grant webcam access
              </Button>
            ) : (
              <NativeSelect
                className="w-full"
                value={selectedWebcamId || ''}
                onChange={(e) => selectWebcam(e.target.value)}
                aria-label="Webcam"
              >
                <option value="">Default</option>
                {videoDevices.map((d) => (
                  <option key={d.deviceId} value={d.deviceId}>
                    {d.label || d.deviceId}
                  </option>
                ))}
              </NativeSelect>
            )}
          </div>
        </div>
      </div>

      <div className="settings-card">
        <div className="settings-card-row settings-card-row--stacked">
          <div className="settings-mic-section-header">
            <div>
              <div className="settings-field-label">Audio Filters</div>
              <div className="settings-card-value">Input processing</div>
            </div>
            <Switch
              checked={micFilterSettings.noiseGateEnabled}
              onCheckedChange={(checked) => applyMicFilters({ noiseGateEnabled: checked })}
              aria-label="Enable audio filters"
            />
          </div>
          <div className="settings-field-note">
            Filters the published mic stream before it goes to the room.
          </div>
          <div className="settings-slider-row">
            <label className="settings-slider-label" htmlFor="noise-gate-threshold">
              Sensitivity threshold
            </label>
            <span className="settings-slider-value">
              {micFilterSettings.noiseGateThresholdDb} dB
            </span>
          </div>
          <input
            id="noise-gate-threshold"
            type="range"
            className="settings-range"
            min={MIC_GATE_THRESHOLD_MIN_DB}
            max={MIC_GATE_THRESHOLD_MAX_DB}
            step={MIC_GATE_THRESHOLD_STEP_DB}
            value={micFilterSettings.noiseGateThresholdDb}
            disabled={!micFilterSettings.noiseGateEnabled}
            onChange={(event) => applyMicFilters({
              noiseGateThresholdDb: Number(event.target.value),
            })}
          />
          <div className="settings-range-scale">
            <span>More open</span>
            <span>More aggressive</span>
          </div>
        </div>
        <Separator />
        <div className="settings-card-row settings-card-row--stacked">
          <div className="settings-mic-section-header">
            <div>
              <div className="settings-field-label">Mic Test</div>
              <div className="settings-card-value">Monitor your mic locally while adjusting input processing</div>
            </div>
            <Button
              type="button"
              variant={isMicTesting ? 'default' : 'secondary'}
              size="lg"
              onClick={handleMicTestToggle}
            >
              {isMicTesting ? 'Stop test' : 'Start test'}
            </Button>
          </div>
          <div className="settings-field-note">
            {voiceRuntime?.isInVoice
              ? 'While active, Hush temporarily deafens you from the room and mutes your room mic so you can tune filters safely.'
              : 'Hear your mic locally through Hush monitoring while you tune the filter.'}
          </div>
          <div
            className="settings-mic-meter"
            aria-label="Microphone input level"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={micTestLevel}
          >
            <div
              className={`settings-mic-meter-fill${isMicTesting && isMicGateOpen ? ' settings-mic-meter-fill--open' : ''}`}
              style={{ width: `${micTestLevel}%` }}
            />
          </div>
          <div className="settings-mic-test-status">
            {isMicTesting
              ? `Monitoring locally${micFilterSettings.noiseGateEnabled ? ` · ${isMicGateOpen ? 'processing' : 'bypassed'}` : ' · processing disabled'}`
              : 'Start the test to hear your mic locally while you adjust the filter.'}
          </div>
          {micTestError && (
            <div className="settings-mic-test-error">
              {micTestError}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ─── Devices Tab ──────────────────────────────────────────

function DevicesTab() {
  const { token, identityKeyRef, handshakeData, setTransparencyError } = useAuth();
  const currentDeviceId = getDeviceId();
  return (
    <DeviceManagement
      token={token}
      currentDeviceId={currentDeviceId}
      identityKeyRef={identityKeyRef}
      handshakeData={handshakeData}
      setTransparencyError={setTransparencyError}
    />
  );
}

// ─── Sidebar icon components ─────────────────────────────

function IconAccount() {
  return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>);
}
function IconAppearance() {
  return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 2a7 7 0 0 0 0 20z" fill="currentColor" /></svg>);
}
function IconAudioVideo() {
  return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" /></svg>);
}
function IconDevices() {
  return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>);
}
function IconInstances() {
  return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="8" rx="2" /><rect x="2" y="14" width="20" height="8" rx="2" /><line x1="6" y1="6" x2="6.01" y2="6" /><line x1="6" y1="18" x2="6.01" y2="18" /></svg>);
}
function IconChangelog() {
  return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>);
}

const SIDEBAR_ICONS = {
  [TAB_ACCOUNT]: IconAccount,
  [TAB_APPEARANCE]: IconAppearance,
  [TAB_AUDIO_VIDEO]: IconAudioVideo,
  [TAB_DEVICES]: IconDevices,
  [TAB_INSTANCES]: IconInstances,
};

// ─── Main Modal ───────────────────────────────────────────

export default function UserSettingsModal({ onClose, voiceRuntime = null }) {
  const [tab, setTab] = useState(TAB_ACCOUNT);
  const { user } = useAuth();

  const userTabs = [
    { key: TAB_ACCOUNT, label: 'Account' },
    { key: TAB_APPEARANCE, label: 'Appearance' },
    { key: TAB_AUDIO_VIDEO, label: 'Audio & Video' },
    { key: TAB_DEVICES, label: 'Devices' },
    { key: TAB_INSTANCES, label: 'My Instances' },
  ];

  const displayName = user?.displayName || user?.username || 'User';
  const initials = displayName.charAt(0).toUpperCase();

  const nav = (
    <>
      <div className="settings-sidebar-profile">
        <div className="settings-sidebar-avatar">{initials}</div>
        <div className="settings-sidebar-profile-info">
          <span className="settings-sidebar-profile-name">{displayName}</span>
          <span className="settings-sidebar-profile-sub">{user?.username || ''}</span>
        </div>
      </div>

      <div className="settings-sidebar-group">
        <div className="settings-sidebar-group-label">User Settings</div>
        {userTabs.map((t) => {
          const Icon = SIDEBAR_ICONS[t.key];
          return (
            <button
              key={t.key}
              type="button"
              className={`settings-sidebar-item${tab === t.key ? ' settings-sidebar-item--active' : ''}`}
              aria-current={tab === t.key ? 'page' : undefined}
              onClick={() => setTab(t.key)}
            >
              {Icon && <Icon />}
              {t.label}
            </button>
          );
        })}
      </div>

      <div className="settings-sidebar-divider" />

      <div className="settings-sidebar-group">
        <button
          type="button"
          className="settings-sidebar-item"
          onClick={() => window.open('https://github.com/hushhq/hush-web/blob/main/CHANGELOG.md', '_blank')}
        >
          <IconChangelog />
          Changelog
          <svg className="settings-external-icon" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" focusable="false">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        </button>
      </div>
    </>
  );

  return (
    <SettingsDialogShell
      open
      onOpenChange={(next) => { if (!next) onClose(); }}
      title="User settings"
      description="Manage account, appearance, audio/video, devices, and instances."
      nav={nav}
    >
      {tab === TAB_ACCOUNT && <AccountTab />}
      {tab === TAB_APPEARANCE && <AppearanceTab />}
      {tab === TAB_AUDIO_VIDEO && <AudioVideoTab voiceRuntime={voiceRuntime} />}
      {tab === TAB_DEVICES && <DevicesTab />}
      {tab === TAB_INSTANCES && <InstancesSettingsTab />}
    </SettingsDialogShell>
  );
}

export { applyThemeMode, getStoredThemeMode, DARK_THEMES, LIGHT_THEMES };
