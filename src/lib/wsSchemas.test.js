import { describe, expect, it } from "vitest"

import { isKnownWsMessageType, parseWsMessage } from "./wsSchemas"

describe("wsSchemas", () => {
  it("accepts valid known websocket frames", () => {
    const parsed = parseWsMessage({
      type: "voice_state_update",
      channel_id: "voice-1",
      participants: [{ userId: "user-1", displayName: "Yaro" }],
    })

    expect(parsed).toEqual({
      ok: true,
      known: true,
      data: expect.objectContaining({
        type: "voice_state_update",
        channel_id: "voice-1",
      }),
    })
  })

  it("rejects malformed known websocket frames", () => {
    const parsed = parseWsMessage({
      type: "channel_moved",
      channel_id: "channel-1",
      position: "top",
    })

    expect(parsed).toEqual({
      ok: false,
      type: "channel_moved",
      reason: "schema",
      issues: expect.arrayContaining([
        expect.objectContaining({ path: "parent_id" }),
        expect.objectContaining({ path: "position" }),
      ]),
    })
  })

  it("allows unknown typed websocket frames", () => {
    const parsed = parseWsMessage({
      type: "future.event",
      payload: { value: 1 },
    })

    expect(parsed).toEqual({
      ok: true,
      known: false,
      data: expect.objectContaining({ type: "future.event" }),
    })
  })

  it("exposes known message type checks for tests and diagnostics", () => {
    expect(isKnownWsMessageType("mls.commit")).toBe(true)
    expect(isKnownWsMessageType("future.event")).toBe(false)
  })
})
