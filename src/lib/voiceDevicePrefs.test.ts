/**
 * Behavioural cover for `voiceDevicePrefs`. `fake-indexeddb/auto` is
 * loaded in `src/test/setup.js`, so each test starts with a clean store.
 */
import { describe, it, expect, beforeEach } from "vitest"

import {
  readVoiceDevicePrefs,
  saveVoiceDevicePrefs,
  clearVoiceDevicePrefs,
  shouldSkipPrejoin,
} from "./voiceDevicePrefs"

const USER = "user-vdp-1"

beforeEach(async () => {
  await clearVoiceDevicePrefs(USER).catch(() => {})
})

describe("voiceDevicePrefs — round-trip", () => {
  it("returns null when no prefs have been saved", async () => {
    expect(await readVoiceDevicePrefs(USER)).toBeNull()
  })

  it("persists a confirmed selection", async () => {
    await saveVoiceDevicePrefs(USER, {
      audioDeviceId: "mic-a",
      videoDeviceId: "cam-b",
      audioEnabled: true,
      videoEnabled: false,
      dontAskAgain: true,
    })
    const loaded = await readVoiceDevicePrefs(USER)
    expect(loaded).not.toBeNull()
    expect(loaded!.audioDeviceId).toBe("mic-a")
    expect(loaded!.videoDeviceId).toBe("cam-b")
    expect(loaded!.audioEnabled).toBe(true)
    expect(loaded!.videoEnabled).toBe(false)
    expect(loaded!.dontAskAgain).toBe(true)
    expect(loaded!.updatedAt).toBeGreaterThan(0)
  })

  it("overwrites previous selection on resave", async () => {
    await saveVoiceDevicePrefs(USER, {
      audioDeviceId: "mic-a",
      videoDeviceId: null,
      audioEnabled: true,
      videoEnabled: false,
      dontAskAgain: false,
    })
    await saveVoiceDevicePrefs(USER, {
      audioDeviceId: "mic-b",
      videoDeviceId: "cam-x",
      audioEnabled: false,
      videoEnabled: true,
      dontAskAgain: true,
    })
    const loaded = await readVoiceDevicePrefs(USER)
    expect(loaded!.audioDeviceId).toBe("mic-b")
    expect(loaded!.videoDeviceId).toBe("cam-x")
    expect(loaded!.dontAskAgain).toBe(true)
  })

  it("preserves null device ids when input is opted-out", async () => {
    await saveVoiceDevicePrefs(USER, {
      audioDeviceId: null,
      videoDeviceId: null,
      audioEnabled: false,
      videoEnabled: false,
      dontAskAgain: true,
    })
    const loaded = await readVoiceDevicePrefs(USER)
    expect(loaded!.audioDeviceId).toBeNull()
    expect(loaded!.videoDeviceId).toBeNull()
    expect(loaded!.audioEnabled).toBe(false)
    expect(loaded!.videoEnabled).toBe(false)
  })
})

describe("voiceDevicePrefs — clear", () => {
  it("wipes the record", async () => {
    await saveVoiceDevicePrefs(USER, {
      audioDeviceId: "mic-a",
      videoDeviceId: "cam-b",
      audioEnabled: true,
      videoEnabled: true,
      dontAskAgain: true,
    })
    await clearVoiceDevicePrefs(USER)
    expect(await readVoiceDevicePrefs(USER)).toBeNull()
  })

  it("is a noop when no record exists", async () => {
    await expect(clearVoiceDevicePrefs(USER)).resolves.toBeUndefined()
  })

  it("isolates per-userId", async () => {
    await saveVoiceDevicePrefs(USER, {
      audioDeviceId: "mic-a",
      videoDeviceId: null,
      audioEnabled: true,
      videoEnabled: false,
      dontAskAgain: true,
    })
    expect(await readVoiceDevicePrefs("user-vdp-other")).toBeNull()
    await clearVoiceDevicePrefs("user-vdp-other")
    expect(await readVoiceDevicePrefs(USER)).not.toBeNull()
  })
})

describe("voiceDevicePrefs — input validation", () => {
  it("rejects an empty userId on read", async () => {
    await expect(readVoiceDevicePrefs("")).rejects.toThrow(/userId/i)
  })

  it("rejects an empty userId on save", async () => {
    await expect(
      saveVoiceDevicePrefs("", {
        audioDeviceId: null,
        videoDeviceId: null,
        audioEnabled: false,
        videoEnabled: false,
        dontAskAgain: false,
      })
    ).rejects.toThrow(/userId/i)
  })

  it("rejects an empty userId on clear", async () => {
    await expect(clearVoiceDevicePrefs("")).rejects.toThrow(/userId/i)
  })
})

describe("voiceDevicePrefs — shouldSkipPrejoin", () => {
  it("returns false when no record is present", async () => {
    expect(await shouldSkipPrejoin(USER)).toBe(false)
  })

  it("returns true only when dontAskAgain is set", async () => {
    await saveVoiceDevicePrefs(USER, {
      audioDeviceId: "mic-a",
      videoDeviceId: null,
      audioEnabled: true,
      videoEnabled: false,
      dontAskAgain: false,
    })
    expect(await shouldSkipPrejoin(USER)).toBe(false)

    await saveVoiceDevicePrefs(USER, {
      audioDeviceId: "mic-a",
      videoDeviceId: null,
      audioEnabled: true,
      videoEnabled: false,
      dontAskAgain: true,
    })
    expect(await shouldSkipPrejoin(USER)).toBe(true)
  })
})
