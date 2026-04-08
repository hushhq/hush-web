# Mode-Aware Capture Profile Selection — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make useRoom select the correct CaptureProfile at runtime (desktop-standard, mobile-web-standard, or low-latency) instead of hardcoding desktop-standard.

**Architecture:** A new `detectAudioPlatform.ts` helper provides a UA-based platform heuristic. useRoom accepts `isLowLatency` from callers and resolves the capture profile internally via `resolveMode()`. VoiceChannel passes one boolean flag; Room.jsx is unchanged.

**Tech Stack:** TypeScript, React hooks, Vitest, livekit-client

---

## File Structure

| File | Responsibility | Action |
|-|-|-|
| `src/audio/core/detectAudioPlatform.ts` | UA-based platform heuristic | Create |
| `src/audio/__tests__/detectAudioPlatform.test.ts` | Platform detection tests | Create |
| `src/audio/index.ts` | Barrel export | Modify (+1 export) |
| `src/hooks/useRoom.js` | Profile resolution in publishMic | Modify (3 lines) |
| `src/pages/VoiceChannel.jsx` | Pass isLowLatency to useRoom | Modify (1 line) |
| `src/hooks/useRoom.voice.test.jsx` | Mode-aware selection tests | Modify |
| `src/pages/VoiceChannel.test.jsx` | Caller wiring test | Modify |

---

### Task 1: Platform detection helper

**Files:**
- Create: `src/audio/core/detectAudioPlatform.ts`
- Test: `src/audio/__tests__/detectAudioPlatform.test.ts`

- [ ] **Step 1: Write the failing tests**

```typescript
// src/audio/__tests__/detectAudioPlatform.test.ts
import { describe, it, expect } from 'vitest';
import { isMobileWebAudio } from '../core/detectAudioPlatform';

describe('isMobileWebAudio', () => {
  it('returns true for iPhone Safari', () => {
    expect(isMobileWebAudio(
      'Mozilla/5.0 (iPhone; CPU iPhone OS 18_3 like Mac OS X) AppleWebKit/605.1.15',
    )).toBe(true);
  });

  it('returns true for iPad Safari', () => {
    expect(isMobileWebAudio(
      'Mozilla/5.0 (iPad; CPU OS 18_3 like Mac OS X) AppleWebKit/605.1.15',
    )).toBe(true);
  });

  it('returns true for iPadOS desktop-mode (Macintosh + Mobile)', () => {
    expect(isMobileWebAudio(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.3 Mobile/15E148 Safari/604.1',
    )).toBe(true);
  });

  it('returns true for Android Chrome', () => {
    expect(isMobileWebAudio(
      'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 Chrome/131.0',
    )).toBe(true);
  });

  it('returns false for macOS Chrome', () => {
    expect(isMobileWebAudio(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/131.0',
    )).toBe(false);
  });

  it('returns false for Windows Firefox', () => {
    expect(isMobileWebAudio(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0',
    )).toBe(false);
  });

  it('returns false for Linux Chrome', () => {
    expect(isMobileWebAudio(
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/131.0',
    )).toBe(false);
  });

  it('defaults to navigator.userAgent when no override provided', () => {
    // In jsdom, navigator.userAgent is a desktop string
    expect(isMobileWebAudio()).toBe(false);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/audio/__tests__/detectAudioPlatform.test.ts`
Expected: FAIL — module not found

- [ ] **Step 3: Write the implementation**

```typescript
// src/audio/core/detectAudioPlatform.ts
/**
 * Platform heuristic for audio runtime profile selection.
 *
 * Identifies mobile web platforms where AudioContext pipelines are
 * unreliable and browser-native DSP (NS + AGC + EC) is the safer
 * capture path. This is a best-effort heuristic based on UA string
 * patterns — it does not probe actual browser audio capabilities.
 *
 * Reuses the same detection patterns as src/lib/deviceLabel.js
 * (detectPlatformName, lines 42-45).
 */

export function isMobileWebAudio(userAgent?: string): boolean {
  const ua = userAgent ?? (typeof navigator !== 'undefined' ? navigator.userAgent : '');
  if (!ua) return false;
  return /iPhone|iPad|iPod/i.test(ua)
    || (/Macintosh/i.test(ua) && /Mobile/i.test(ua))
    || /Android/i.test(ua);
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/audio/__tests__/detectAudioPlatform.test.ts`
Expected: 8 tests PASS

- [ ] **Step 5: Export from barrel**

In `src/audio/index.ts`, add after the existing capture exports:

```typescript
export { isMobileWebAudio } from './core/detectAudioPlatform';
```

- [ ] **Step 6: Typecheck**

Run: `npx tsc --noEmit`
Expected: clean (no errors)

- [ ] **Step 7: Commit**

```bash
git add src/audio/core/detectAudioPlatform.ts src/audio/__tests__/detectAudioPlatform.test.ts src/audio/index.ts
git commit -m "Add UA-based audio platform detection heuristic"
```

---

### Task 2: Mode-aware profile resolution in useRoom

**Files:**
- Modify: `src/hooks/useRoom.js:52` (function signature)
- Modify: `src/hooks/useRoom.js:749` (publishMic profile selection)
- Modify: `src/hooks/useRoom.js:15` (imports)

- [ ] **Step 1: Add import for resolveMode and isMobileWebAudio**

In `src/hooks/useRoom.js`, change line 15:

```js
// Before:
import { CAPTURE_PROFILES } from '../audio';

// After:
import { CAPTURE_PROFILES, resolveMode, isMobileWebAudio } from '../audio';
```

- [ ] **Step 2: Add isLowLatency to useRoom parameter destructuring**

In `src/hooks/useRoom.js`, change line 52:

```js
// Before:
export function useRoom({ wsClient, getToken, currentUserId, getStore, voiceKeyRotationHours }) {

// After:
export function useRoom({ wsClient, getToken, currentUserId, getStore, voiceKeyRotationHours, isLowLatency }) {
```

- [ ] **Step 3: Replace hardcoded profile in publishMic**

In `src/hooks/useRoom.js`, change line 749:

```js
// Before:
const profile = CAPTURE_PROFILES['desktop-standard'];

// After:
const mode = resolveMode({ isLowLatency, isMobileWebAudio: isMobileWebAudio() });
const profile = CAPTURE_PROFILES[mode];
```

- [ ] **Step 4: Typecheck**

Run: `npx tsc --noEmit`
Expected: clean

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useRoom.js
git commit -m "Resolve capture profile from runtime context in useRoom"
```

---

### Task 3: Pass isLowLatency from VoiceChannel

**Files:**
- Modify: `src/pages/VoiceChannel.jsx:118-124`

- [ ] **Step 1: Add isLowLatency to the useRoom call**

In `src/pages/VoiceChannel.jsx`, change lines 118-124:

```jsx
// Before:
} = useRoom({
  wsClient,
  getToken,
  currentUserId,
  getStore,
  voiceKeyRotationHours: undefined,
});

// After:
} = useRoom({
  wsClient,
  getToken,
  currentUserId,
  getStore,
  voiceKeyRotationHours: undefined,
  isLowLatency,
});
```

`isLowLatency` is already defined on line 83 as `channel.voiceMode === 'low-latency'`.

- [ ] **Step 2: Commit**

```bash
git add src/pages/VoiceChannel.jsx
git commit -m "Pass isLowLatency from VoiceChannel to useRoom"
```

---

### Task 4: useRoom mode-aware tests

**Files:**
- Modify: `src/hooks/useRoom.voice.test.jsx`

- [ ] **Step 1: Mock isMobileWebAudio in the test file**

Add a hoisted mock for the audio barrel's `isMobileWebAudio`. In the hoisted block (near the top of the file, inside the existing `vi.hoisted`), add:

```js
mockIsMobileWebAudio: vi.fn().mockReturnValue(false),
```

Then update the existing `vi.mock('../audio', ...)` to include it:

```js
vi.mock('../audio', () => ({
  CAPTURE_PROFILES: {
    'desktop-standard': {
      mode: 'desktop-standard',
      browserDsp: false,
      hushProcessing: true,
      useRawTrack: false,
      localMonitoring: true,
      echoCanConfigurable: true,
    },
    'mobile-web-standard': {
      mode: 'mobile-web-standard',
      browserDsp: true,
      hushProcessing: false,
      useRawTrack: true,
      localMonitoring: false,
      echoCanConfigurable: false,
    },
    'low-latency': {
      mode: 'low-latency',
      browserDsp: false,
      hushProcessing: false,
      useRawTrack: true,
      localMonitoring: false,
      echoCanConfigurable: false,
    },
  },
  resolveMode: vi.fn(({ isLowLatency, isMobileWebAudio }) => {
    if (isLowLatency) return 'low-latency';
    if (isMobileWebAudio) return 'mobile-web-standard';
    return 'desktop-standard';
  }),
  isMobileWebAudio: mockIsMobileWebAudio,
}));
```

- [ ] **Step 2: Write mode selection tests**

Add these tests inside the existing `describe('useRoom MLS voice E2EE', ...)` block, after the existing publish/mute tests:

```jsx
it('publishMic resolves low-latency profile when isLowLatency is true', async () => {
  mockGetMLSVoiceGroupInfo.mockRejectedValue(new Error('404'));
  const { result } = renderHook(() =>
    useRoom({ wsClient, getToken, currentUserId: 'u1', getStore, voiceKeyRotationHours: 2, isLowLatency: true }),
  );

  await act(async () => {
    await result.current.connectRoom(ROOM_NAME, 'TestUser', CHANNEL_ID);
    await result.current.publishMic();
  });

  expect(mockOrchestratorAcquire).toHaveBeenCalledTimes(1);
  const acquireProfile = mockOrchestratorAcquire.mock.calls[0][0];
  expect(acquireProfile.mode).toBe('low-latency');
});

it('publishMic resolves mobile-web-standard when UA is mobile', async () => {
  mockGetMLSVoiceGroupInfo.mockRejectedValue(new Error('404'));
  mockIsMobileWebAudio.mockReturnValue(true);

  const { result } = renderHook(() =>
    useRoom({ wsClient, getToken, currentUserId: 'u1', getStore, voiceKeyRotationHours: 2 }),
  );

  await act(async () => {
    await result.current.connectRoom(ROOM_NAME, 'TestUser', CHANNEL_ID);
    await result.current.publishMic();
  });

  expect(mockOrchestratorAcquire).toHaveBeenCalledTimes(1);
  const acquireProfile = mockOrchestratorAcquire.mock.calls[0][0];
  expect(acquireProfile.mode).toBe('mobile-web-standard');

  mockIsMobileWebAudio.mockReturnValue(false);
});

it('low-latency takes priority over mobile UA for capture', async () => {
  mockGetMLSVoiceGroupInfo.mockRejectedValue(new Error('404'));
  mockIsMobileWebAudio.mockReturnValue(true);

  const { result } = renderHook(() =>
    useRoom({ wsClient, getToken, currentUserId: 'u1', getStore, voiceKeyRotationHours: 2, isLowLatency: true }),
  );

  await act(async () => {
    await result.current.connectRoom(ROOM_NAME, 'TestUser', CHANNEL_ID);
    await result.current.publishMic();
  });

  const acquireProfile = mockOrchestratorAcquire.mock.calls[0][0];
  expect(acquireProfile.mode).toBe('low-latency');

  mockIsMobileWebAudio.mockReturnValue(false);
});
```

- [ ] **Step 3: Run useRoom voice tests**

Run: `npx vitest run src/hooks/useRoom.voice.test.jsx`
Expected: all tests PASS (existing + 3 new)

- [ ] **Step 4: Commit**

```bash
git add src/hooks/useRoom.voice.test.jsx
git commit -m "Add mode-aware capture profile selection tests"
```

---

### Task 5: VoiceChannel caller wiring test

**Files:**
- Modify: `src/pages/VoiceChannel.test.jsx`

- [ ] **Step 1: Write the caller wiring test**

Add this test inside the existing `describe('VoiceChannel', ...)` block:

```jsx
it('passes isLowLatency to useRoom based on channel.voiceMode', () => {
  const channel = {
    id: 'ch1',
    name: 'voice-1',
    serverId: 's1',
    type: 'voice',
    voiceMode: 'low-latency',
  };
  renderVoiceChannel(channel);

  // useRoom is mocked — inspect the args it was called with
  const calls = vi.mocked(useRoom).mock.calls;
  const lastCall = calls[calls.length - 1][0];
  expect(lastCall.isLowLatency).toBe(true);
});

it('passes isLowLatency as false for quality mode channels', () => {
  const channel = {
    id: 'ch2',
    name: 'voice-2',
    serverId: 's1',
    type: 'voice',
    voiceMode: 'quality',
  };
  renderVoiceChannel(channel);

  const calls = vi.mocked(useRoom).mock.calls;
  const lastCall = calls[calls.length - 1][0];
  expect(lastCall.isLowLatency).toBe(false);
});
```

- [ ] **Step 2: Run VoiceChannel tests**

Run: `npx vitest run src/pages/VoiceChannel.test.jsx`
Expected: all tests PASS (existing + 2 new)

- [ ] **Step 3: Commit**

```bash
git add src/pages/VoiceChannel.test.jsx
git commit -m "Add VoiceChannel caller wiring tests for isLowLatency"
```

---

### Task 6: Final verification

- [ ] **Step 1: Typecheck**

Run: `npx tsc --noEmit`
Expected: clean

- [ ] **Step 2: Full audio suite**

Run: `npx vitest run src/audio/`
Expected: all pass

- [ ] **Step 3: Full test suite**

Run: `npx vitest run`
Expected: same 8 pre-existing failures, zero new failures

- [ ] **Step 4: Diff audit**

Run: `git diff e6bbb69 --stat`
Expected files:
- `src/audio/core/detectAudioPlatform.ts` (new)
- `src/audio/__tests__/detectAudioPlatform.test.ts` (new)
- `src/audio/index.ts` (modified, +1 line)
- `src/hooks/useRoom.js` (modified, ~5 lines changed)
- `src/pages/VoiceChannel.jsx` (modified, +1 line)
- `src/hooks/useRoom.voice.test.jsx` (modified)
- `src/pages/VoiceChannel.test.jsx` (modified)
