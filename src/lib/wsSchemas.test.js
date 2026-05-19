import { readdirSync, readFileSync, statSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

import { describe, expect, it } from "vitest"

import { isKnownWsMessageType, parseWsMessage } from "./wsSchemas"

const TRANSPORT_EVENT_TYPES = new Set([
  "auth_invalid",
  "close",
  "open",
  "reconnected",
  "reconnecting",
  "rtt",
])

const SOURCE_EXTENSIONS = new Set([".js", ".jsx", ".ts", ".tsx"])
const TEST_FILE_PATTERN = /\.(test|spec)\.[jt]sx?$/
const WS_CLIENT_ON_PATTERN = /\bwsClient\.on\(\s*["']([^"']+)["']/g

function sourceRoot() {
  return join(dirname(fileURLToPath(import.meta.url)), "..")
}

function extensionOf(path) {
  const match = path.match(/\.[^.]+$/)
  return match ? match[0] : ""
}

function listSourceFiles(dir, acc = []) {
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry)
    const stats = statSync(fullPath)
    if (stats.isDirectory()) {
      listSourceFiles(fullPath, acc)
      continue
    }
    if (!SOURCE_EXTENSIONS.has(extensionOf(fullPath))) continue
    if (TEST_FILE_PATTERN.test(fullPath)) continue
    acc.push(fullPath)
  }
  return acc
}

function subscribedWsEventTypes() {
  const types = new Set()
  for (const file of listSourceFiles(sourceRoot())) {
    const source = readFileSync(file, "utf8")
    for (const match of source.matchAll(WS_CLIENT_ON_PATTERN)) {
      types.add(match[1])
    }
  }
  return [...types].sort()
}

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

  it("rejects transparency key-change frames without the server contract fields", () => {
    const parsed = parseWsMessage({
      type: "transparency.key_change",
    })

    expect(parsed).toEqual({
      ok: false,
      type: "transparency.key_change",
      reason: "schema",
      issues: expect.arrayContaining([
        expect.objectContaining({ path: "operation" }),
        expect.objectContaining({ path: "leafIndex" }),
        expect.objectContaining({ path: "treeRoot" }),
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

  it("has a schema for every server-sourced wsClient subscription", () => {
    const missing = subscribedWsEventTypes().filter(
      (type) => !TRANSPORT_EVENT_TYPES.has(type) && !isKnownWsMessageType(type)
    )

    expect(missing).toEqual([])
  })
})
