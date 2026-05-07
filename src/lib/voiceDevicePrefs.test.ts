/**
 * Behavioural cover for `voiceDevicePrefs`. `fake-indexeddb/auto` is
 * loaded in `src/test/setup.js`, so each test starts with a clean store.
 */
import { describe, it, expect, beforeEach, vi } from "vitest"

import {
  readVoiceDevicePrefs,
  saveVoiceDevicePrefs,
  clearVoiceDevicePrefs,
  shouldSkipPrejoin,
  mergeVoiceDevicePrefs,
  subscribeVoiceDevicePrefs,
  computeDeviceApplyPlan,
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

describe("mergeVoiceDevicePrefs", () => {
  it("preserves every existing field when patching a single one", () => {
    const prev = {
      audioDeviceId: "mic-a",
      videoDeviceId: "cam-a",
      outputDeviceId: "out-a",
      audioEnabled: true,
      videoEnabled: true,
      dontAskAgain: true,
      updatedAt: 1,
    }
    const next = mergeVoiceDevicePrefs(prev, { audioDeviceId: "mic-b" })
    expect(next).toMatchObject({
      audioDeviceId: "mic-b",
      videoDeviceId: "cam-a",
      outputDeviceId: "out-a",
      audioEnabled: true,
      videoEnabled: true,
      dontAskAgain: true,
    })
    expect(next.updatedAt).not.toBe(1)
  })

  it("does not drop outputDeviceId when patching audio/video/dontAskAgain", () => {
    const prev = {
      audioDeviceId: "mic-a",
      videoDeviceId: "cam-a",
      outputDeviceId: "out-headset",
      audioEnabled: true,
      videoEnabled: false,
      dontAskAgain: false,
      updatedAt: 1,
    }
    const a = mergeVoiceDevicePrefs(prev, { audioDeviceId: "mic-b" })
    const v = mergeVoiceDevicePrefs(prev, { videoDeviceId: "cam-b" })
    const d = mergeVoiceDevicePrefs(prev, { dontAskAgain: true })
    expect(a.outputDeviceId).toBe("out-headset")
    expect(v.outputDeviceId).toBe("out-headset")
    expect(d.outputDeviceId).toBe("out-headset")
  })

  it("falls back to defaults when prev is null", () => {
    const next = mergeVoiceDevicePrefs(null, { audioDeviceId: "mic-a" })
    expect(next).toMatchObject({
      audioDeviceId: "mic-a",
      videoDeviceId: null,
      outputDeviceId: null,
      audioEnabled: true,
      videoEnabled: false,
      dontAskAgain: false,
    })
  })
})

describe("subscribeVoiceDevicePrefs", () => {
  it("notifies listeners after a save", async () => {
    const listener = vi.fn()
    const unsub = subscribeVoiceDevicePrefs(USER, listener)
    await saveVoiceDevicePrefs(USER, {
      audioDeviceId: "mic-x",
      videoDeviceId: null,
      outputDeviceId: null,
      audioEnabled: true,
      videoEnabled: false,
      dontAskAgain: false,
    })
    expect(listener).toHaveBeenCalledTimes(1)
    expect(listener.mock.calls[0][0]).toMatchObject({
      audioDeviceId: "mic-x",
    })
    unsub()
  })

  it("notifies with null after a clear", async () => {
    const listener = vi.fn()
    const unsub = subscribeVoiceDevicePrefs(USER, listener)
    await saveVoiceDevicePrefs(USER, {
      audioDeviceId: "mic-x",
      videoDeviceId: null,
      outputDeviceId: null,
      audioEnabled: true,
      videoEnabled: false,
      dontAskAgain: false,
    })
    await clearVoiceDevicePrefs(USER)
    expect(listener.mock.calls.at(-1)?.[0]).toBeNull()
    unsub()
  })

  it("scopes listeners by userId", async () => {
    const listenerA = vi.fn()
    const listenerB = vi.fn()
    const unsubA = subscribeVoiceDevicePrefs("user-a", listenerA)
    const unsubB = subscribeVoiceDevicePrefs("user-b", listenerB)
    await saveVoiceDevicePrefs("user-a", {
      audioDeviceId: "mic-a",
      videoDeviceId: null,
      outputDeviceId: null,
      audioEnabled: true,
      videoEnabled: false,
      dontAskAgain: false,
    })
    expect(listenerA).toHaveBeenCalledTimes(1)
    expect(listenerB).not.toHaveBeenCalled()
    unsubA()
    unsubB()
  })

  it("stops firing after unsubscribe", async () => {
    const listener = vi.fn()
    const unsub = subscribeVoiceDevicePrefs(USER, listener)
    unsub()
    await saveVoiceDevicePrefs(USER, {
      audioDeviceId: "mic-x",
      videoDeviceId: null,
      outputDeviceId: null,
      audioEnabled: true,
      videoEnabled: false,
      dontAskAgain: false,
    })
    expect(listener).not.toHaveBeenCalled()
  })
})

describe("computeDeviceApplyPlan", () => {
  const NEXT = {
    audioDeviceId: "mic-b",
    videoDeviceId: "cam-b",
    outputDeviceId: "out-b",
    audioEnabled: true,
    videoEnabled: true,
    dontAskAgain: false,
    updatedAt: 1,
  }

  it("flags every changed device against a different baseline", () => {
    const plan = computeDeviceApplyPlan(
      { audio: "mic-a", video: "cam-a", output: "out-a" },
      NEXT
    )
    expect(plan.audio).toEqual({ changed: true, nextDeviceId: "mic-b" })
    expect(plan.video).toEqual({ changed: true, nextDeviceId: "cam-b" })
    expect(plan.output).toEqual({ changed: true, nextDeviceId: "out-b" })
  })

  it("flags nothing when baseline matches next exactly", () => {
    const plan = computeDeviceApplyPlan(
      { audio: "mic-b", video: "cam-b", output: "out-b" },
      NEXT
    )
    expect(plan.audio.changed).toBe(false)
    expect(plan.video.changed).toBe(false)
    expect(plan.output.changed).toBe(false)
  })

  it("normalizes undefined deviceIds to null on the next side", () => {
    const plan = computeDeviceApplyPlan(
      { audio: null, video: null, output: null },
      {
        audioDeviceId: null,
        videoDeviceId: null,
        outputDeviceId: null,
        audioEnabled: true,
        videoEnabled: false,
        dontAskAgain: false,
        updatedAt: 1,
      }
    )
    expect(plan.audio.changed).toBe(false)
    expect(plan.audio.nextDeviceId).toBeNull()
  })

  it("treats null → 'mic-a' as a change (no double-skip on first stamp)", () => {
    const plan = computeDeviceApplyPlan(
      { audio: null, video: null, output: null },
      NEXT
    )
    expect(plan.audio).toEqual({ changed: true, nextDeviceId: "mic-b" })
  })
})
