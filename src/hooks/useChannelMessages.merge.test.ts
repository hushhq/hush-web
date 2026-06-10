/**
 * Unit tests for the sorted-append fast-path introduced in the catch-up
 * merge (HUSHHQ-115). These tests verify the merge semantics directly,
 * without spinning up the full hook.
 */
import { describe, it, expect } from "vitest"
import { mergeCatchupMessages } from "./useChannelMessages"
import type { ChatMessage } from "./useChannelMessages"

describe("mergeCatchupMessages - catch-up fast path (HUSHHQ-115)", () => {
  it("appended-all-newer: returns concat without sort (fast path)", () => {
    const prev = [
      { id: "a", timestamp: 1000 },
      { id: "b", timestamp: 2000 },
    ] as ChatMessage[]
    const appended = [
      { id: "c", timestamp: 3000 },
      { id: "d", timestamp: 4000 },
    ] as ChatMessage[]
    const result = mergeCatchupMessages(prev, appended)
    expect(result.map((m) => m.id)).toEqual(["a", "b", "c", "d"])
  })

  it("appended with same-timestamp as last prev: uses fast path (>=)", () => {
    const prev = [
      { id: "a", timestamp: 1000 },
      { id: "b", timestamp: 2000 },
    ] as ChatMessage[]
    const appended = [{ id: "c", timestamp: 2000 }] as ChatMessage[]
    const result = mergeCatchupMessages(prev, appended)
    expect(result.map((m) => m.id)).toEqual(["a", "b", "c"])
  })

  it("appended-overlapping: falls back to full sort, order is correct", () => {
    const prev = [
      { id: "a", timestamp: 1000 },
      { id: "b", timestamp: 3000 },
    ] as ChatMessage[]
    // appended has an item older than the last prev item
    const appended = [
      { id: "c", timestamp: 2000 },
      { id: "d", timestamp: 4000 },
    ] as ChatMessage[]
    const result = mergeCatchupMessages(prev, appended)
    expect(result.map((m) => m.id)).toEqual(["a", "c", "b", "d"])
  })

  it("appended into empty prev: returns appended sorted", () => {
    const appended = [
      { id: "b", timestamp: 2000 },
      { id: "a", timestamp: 1000 },
    ] as ChatMessage[]
    const result = mergeCatchupMessages([], appended)
    expect(result.map((m) => m.id)).toEqual(["a", "b"])
  })

  it("out-of-order appended batch: normalised before fast-path check", () => {
    const prev = [{ id: "a", timestamp: 1000 }] as ChatMessage[]
    // appended is unordered but all newer than prev
    const appended = [
      { id: "d", timestamp: 4000 },
      { id: "b", timestamp: 2000 },
      { id: "c", timestamp: 3000 },
    ] as ChatMessage[]
    const result = mergeCatchupMessages(prev, appended)
    expect(result.map((m) => m.id)).toEqual(["a", "b", "c", "d"])
  })
})
