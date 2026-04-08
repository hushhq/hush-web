# Mode-Aware Capture Profile Selection

## Problem

useRoom hardcodes `CAPTURE_PROFILES['desktop-standard']` for every mic publish. Low-latency rooms get the full Hush pipeline (AudioContext + noise gate) when they should get a raw-track bypass. Mobile web gets desktop-owned DSP when it should rely on browser-native processing.

## Goal

Make useRoom select the correct CaptureProfile at runtime based on channel latency mode and audio platform. Desktop-standard behavior stays identical. Low-latency and mobile-web paths activate for the first time.

## Design

### Audio platform detection

New file: `src/audio/core/detectAudioPlatform.ts`

Exports `isMobileWebAudio(): boolean` — a **platform heuristic for runtime profile selection**, not a capability proof. It uses UA string patterns to detect iPhone, iPad (including iPadOS desktop-mode), and Android. Reuses the same patterns already in `src/lib/deviceLabel.js` (lines 42-45) but as a boolean predicate rather than a label string.

This is a best-effort heuristic: it identifies platforms where AudioContext pipelines are unreliable and browser-native DSP is the safer path. It does not probe actual browser audio capabilities.

Injectable for testing: accepts optional `userAgent` parameter, defaults to `navigator.userAgent`.

This file does NOT live in VoiceAudioEngine.ts. The engine owns mode/state/profile logic; platform detection is a separate concern.

### useRoom changes

**New parameter:** `isLowLatency` (boolean, optional, defaults false).

**No `isMobileWebAudio` parameter.** useRoom calls `isMobileWebAudio()` internally from the TS audio layer. No UI-derived breakpoint state.

**Profile resolution in publishMic:**
```js
const mode = resolveMode({
  isLowLatency,
  isMobileWebAudio: isMobileWebAudio(),
});
const profile = CAPTURE_PROFILES[mode];
```

Everything downstream (orchestrator.acquire, adapter, unpublish, mute, unmute, teardown) is already profile-agnostic and works unchanged.

### Caller changes

**VoiceChannel.jsx** — one line added to useRoom call:
```js
isLowLatency,
```
Already computed on line 83 as `channel.voiceMode === 'low-latency'`.

**Room.jsx** — no change. `isLowLatency` defaults to `undefined` (falsy) → desktop-standard.

### Behavioral changes vs ac561b9

| Mode | ac561b9 | After this branch |
|-|-|-|
| Desktop standard | Full Hush pipeline (AudioContext + noise gate) | Same |
| Low-latency room | Full Hush pipeline | Raw track, all DSP off |
| Mobile web | Full Hush pipeline | Raw track, browser DSP on (NS+AGC+EC) |
| Mobile low-latency | Full Hush pipeline | Raw track, all DSP off |

Low-latency and mobile-web are intentional behavioral changes matching the typed profile contracts from Phase 2.

### local-monitor

Not activated. `useMicMonitor` is a separate hook not routed through useRoom. `local-monitor` profile remains defined in TS but has no runtime caller in this branch.

### Files changed

| File | Change |
|-|-|
| `src/audio/core/detectAudioPlatform.ts` | New — UA-based `isMobileWebAudio()` |
| `src/audio/core/VoiceAudioEngine.ts` | No change |
| `src/audio/index.ts` | Export `isMobileWebAudio` |
| `src/hooks/useRoom.js` | Add `isLowLatency` param, resolve profile via `resolveMode` |
| `src/pages/VoiceChannel.jsx` | Pass `isLowLatency` to useRoom (one line) |
| `src/pages/Room.jsx` | No change |
| `src/audio/__tests__/detectAudioPlatform.test.ts` | New — platform heuristic tests |
| `src/hooks/useRoom.voice.test.jsx` | Add mode-aware selection tests |
| `src/pages/VoiceChannel.test.jsx` | Add test verifying isLowLatency is passed to useRoom |

### Tests

**detectAudioPlatform (platform heuristic):**
- Returns true for iPhone, iPad, iPadOS desktop-mode, Android UAs
- Returns false for macOS Chrome, Windows Firefox, Linux
- Returns false when navigator is undefined (SSR safety)

**useRoom mode selection:**
- Default (no flags): acquires desktop-standard profile
- `isLowLatency=true`: acquires low-latency profile
- Mobile UA detected: acquires mobile-web-standard profile
- `isLowLatency=true` + mobile UA: acquires low-latency (priority over mobile)
- publishMic/unpublishMic/mute/unmute contract unchanged across all modes
- Disconnect/unmount cleanup works for all modes

**VoiceChannel caller wiring:**
- Verify that VoiceChannel passes `isLowLatency` derived from `channel.voiceMode` to useRoom
- Ensures the integration is tested end-to-end, not just the internal resolution

### Risks before deploy

1. **Mobile-web behavioral change is untested on real devices.** Browser DSP (NS+AGC) behavior varies by browser/OS. This branch changes what getUserMedia constraints are passed on mobile — manual testing on iOS Safari and Android Chrome is required before any deploy.

2. **Low-latency rooms lose noise gate.** Users in low-latency rooms will hear raw, unprocessed audio. This is the intended design but should be communicated if low-latency rooms are user-visible.

3. **No rollback flag.** If mobile-web or low-latency capture is broken in production, the fix requires a code change. Consider adding a feature flag in a future branch if gradual rollout is desired.
