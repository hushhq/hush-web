/**
 * Unit tests for the sorted-append fast-path introduced in the catch-up
 * merge (HUSHHQ-115). These tests verify the merge semantics directly,
 * without spinning up the full hook.
 */
import { describe, it, expect } from "vitest"

interface FakeMessage {
  id: string
  timestamp: number
}

/**
 * Replicates the exact merge logic applied in useChannelMessages after the
 * HUSHHQ-115 fast-path change. Keep in sync with useChannelMessages.ts.
 */
function mergeMessages(
  prev: FakeMessage[],
  appended: FakeMessage[]
): FakeMessage[] {
  // Normalise any within-batch disorder first (mirrors appended.sort in hook).
  const sorted = [...appended].sort((a, b) => a.timestamp - b.timestamp)
  if (
    prev.length === 0 ||
    sorted[0].timestamp >= prev[prev.length - 1].timestamp
  ) {
    return [...prev, ...sorted]
  }
  const merged = [...prev, ...sorted]
  merged.sort((a, b) => a.timestamp - b.timestamp)
  return merged
}

describe("mergeMessages — catch-up fast path (HUSHHQ-115)", () => {
  it("appended-all-newer: returns concat without sort (fast path)", () => {
    const prev: FakeMessage[] = [
      { id: "a", timestamp: 1000 },
      { id: "b", timestamp: 2000 },
    ]
    const appended: FakeMessage[] = [
      { id: "c", timestamp: 3000 },
      { id: "d", timestamp: 4000 },
    ]
    const result = mergeMessages(prev, appended)
    expect(result.map((m) => m.id)).toEqual(["a", "b", "c", "d"])
  })

  it("appended with same-timestamp as last prev: uses fast path (>=)", () => {
    const prev: FakeMessage[] = [
      { id: "a", timestamp: 1000 },
      { id: "b", timestamp: 2000 },
    ]
    const appended: FakeMessage[] = [{ id: "c", timestamp: 2000 }]
    const result = mergeMessages(prev, appended)
    expect(result.map((m) => m.id)).toEqual(["a", "b", "c"])
  })

  it("appended-overlapping: falls back to full sort, order is correct", () => {
    const prev: FakeMessage[] = [
      { id: "a", timestamp: 1000 },
      { id: "b", timestamp: 3000 },
    ]
    // appended has an item older than the last prev item
    const appended: FakeMessage[] = [
      { id: "c", timestamp: 2000 },
      { id: "d", timestamp: 4000 },
    ]
    const result = mergeMessages(prev, appended)
    expect(result.map((m) => m.id)).toEqual(["a", "c", "b", "d"])
  })

  it("appended into empty prev: returns appended sorted", () => {
    const appended: FakeMessage[] = [
      { id: "b", timestamp: 2000 },
      { id: "a", timestamp: 1000 },
    ]
    const result = mergeMessages([], appended)
    expect(result.map((m) => m.id)).toEqual(["a", "b"])
  })

  it("out-of-order appended batch: normalised before fast-path check", () => {
    const prev: FakeMessage[] = [{ id: "a", timestamp: 1000 }]
    // appended is unordered but all newer than prev
    const appended: FakeMessage[] = [
      { id: "d", timestamp: 4000 },
      { id: "b", timestamp: 2000 },
      { id: "c", timestamp: 3000 },
    ]
    const result = mergeMessages(prev, appended)
    expect(result.map((m) => m.id)).toEqual(["a", "b", "c", "d"])
  })
})
