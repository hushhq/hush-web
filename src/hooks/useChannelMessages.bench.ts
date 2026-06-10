/**
 * Micro-benchmark: catch-up merge strategies for useChannelMessages.
 *
 * Compares (a) current unconditional sort on [...prev, ...appended]
 * against (b) fast-path append when appended is already newer than prev.
 *
 * Run with:
 *   npx vitest bench --run src/hooks/useChannelMessages.bench.ts
 */
import { bench, describe } from "vitest"

interface FakeMessage {
  id: string
  timestamp: number
}

function makeMessages(count: number, startTs: number = 1000): FakeMessage[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `msg-${startTs + i}`,
    timestamp: startTs + i * 1000,
  }))
}

/** Strategy A: unconditional sort (current implementation). */
function mergeWithSort(
  prev: FakeMessage[],
  appended: FakeMessage[]
): FakeMessage[] {
  const merged = [...prev, ...appended]
  merged.sort((a, b) => a.timestamp - b.timestamp)
  return merged
}

/**
 * Strategy B: fast-path when appended is entirely newer.
 * Falls back to full sort for out-of-order batches.
 */
function mergeWithFastPath(
  prev: FakeMessage[],
  appended: FakeMessage[]
): FakeMessage[] {
  if (
    prev.length === 0 ||
    appended[0].timestamp >= prev[prev.length - 1].timestamp
  ) {
    return [...prev, ...appended]
  }
  const merged = [...prev, ...appended]
  merged.sort((a, b) => a.timestamp - b.timestamp)
  return merged
}

// Fixture sets: prev arrays of various sizes, appended = 1 or 50 new messages.
const PREV_100 = makeMessages(100, 1000)
const PREV_500 = makeMessages(500, 1000)
const PREV_2000 = makeMessages(2000, 1000)

// appended is strictly newer (the common catch-up case)
const APPENDED_1_NEW = makeMessages(1, 200_000)
const APPENDED_50_NEW = makeMessages(50, 200_000)

describe("merge: prev=100 appended=1 (all newer)", () => {
  bench("A: unconditional sort", () => {
    mergeWithSort(PREV_100, APPENDED_1_NEW)
  })
  bench("B: fast-path", () => {
    mergeWithFastPath(PREV_100, APPENDED_1_NEW)
  })
})

describe("merge: prev=500 appended=1 (all newer)", () => {
  bench("A: unconditional sort", () => {
    mergeWithSort(PREV_500, APPENDED_1_NEW)
  })
  bench("B: fast-path", () => {
    mergeWithFastPath(PREV_500, APPENDED_1_NEW)
  })
})

describe("merge: prev=2000 appended=1 (all newer)", () => {
  bench("A: unconditional sort", () => {
    mergeWithSort(PREV_2000, APPENDED_1_NEW)
  })
  bench("B: fast-path", () => {
    mergeWithFastPath(PREV_2000, APPENDED_1_NEW)
  })
})

describe("merge: prev=100 appended=50 (all newer)", () => {
  bench("A: unconditional sort", () => {
    mergeWithSort(PREV_100, APPENDED_50_NEW)
  })
  bench("B: fast-path", () => {
    mergeWithFastPath(PREV_100, APPENDED_50_NEW)
  })
})

describe("merge: prev=500 appended=50 (all newer)", () => {
  bench("A: unconditional sort", () => {
    mergeWithSort(PREV_500, APPENDED_50_NEW)
  })
  bench("B: fast-path", () => {
    mergeWithFastPath(PREV_500, APPENDED_50_NEW)
  })
})

describe("merge: prev=2000 appended=50 (all newer)", () => {
  bench("A: unconditional sort", () => {
    mergeWithSort(PREV_2000, APPENDED_50_NEW)
  })
  bench("B: fast-path", () => {
    mergeWithFastPath(PREV_2000, APPENDED_50_NEW)
  })
})
