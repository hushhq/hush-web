/**
 * Behavioural cover for useChannelMessages — the data plane previously
 * embedded in `Chat.jsx`. Focuses on the contract that the chat surface
 * relies on: envelope-aware send, envelope-aware receive (strict v1
 * cutover), self-echo dedupe, realtime mark_read, and retry of failed
 * sends.
 */
import { describe, it, expect, vi, beforeEach } from "vitest"
import { renderHook, act, waitFor } from "@testing-library/react"

import { useChannelMessages } from "./useChannelMessages"

const mockEncryptForChannel = vi.fn()
const mockDecryptFromChannel = vi.fn()
const mockGetCachedMessage = vi.fn()
const mockSetCachedMessage = vi.fn()

const { mockGetChannelMessages } = vi.hoisted(() => ({
  mockGetChannelMessages: vi.fn().mockResolvedValue([]),
}))

vi.mock("./useAuth", () => ({
  getDeviceId: () => "device-self",
}))

vi.mock("./useMLS", () => ({
  useMLS: () => ({
    encryptForChannel: mockEncryptForChannel,
    decryptFromChannel: mockDecryptFromChannel,
    getCachedMessage: mockGetCachedMessage,
    setCachedMessage: mockSetCachedMessage,
  }),
}))

vi.mock("@/lib/api", () => ({
  getChannelMessages: mockGetChannelMessages,
}))

// Base64 fixtures for the MLS wire-format guard.
// OpenMLS serializes MLSMessage as:
//   ProtocolVersion (u16, MLS 1.0 = 0x0001)
//   WireFormat (u16, PrivateMessage = 0x0002 / PublicMessage = 0x0001)
// followed by the selected body.
const MLS_PRIVATE = "AAEAAkFiYw==" // [0x00, 0x01, 0x00, 0x02, ...]
const MLS_PUBLIC = "AAEAAUFiYw==" // [0x00, 0x01, 0x00, 0x01, ...]

interface FakeWsClient {
  send: ReturnType<typeof vi.fn>
  subscribeChannel: ReturnType<typeof vi.fn>
  unsubscribeChannel: ReturnType<typeof vi.fn>
  on: ReturnType<typeof vi.fn>
  off: ReturnType<typeof vi.fn>
  isConnected: () => boolean
  emit: (event: string, payload: unknown) => void
}

function makeWsClient(): FakeWsClient {
  const handlers = new Map<string, (data: unknown) => void>()
  return {
    send: vi.fn(),
    subscribeChannel: vi.fn(),
    unsubscribeChannel: vi.fn(),
    on: vi.fn((event: string, handler: (data: unknown) => void) => {
      handlers.set(event, handler)
    }),
    off: vi.fn((event: string) => {
      handlers.delete(event)
    }),
    isConnected: () => true,
    emit(event: string, payload: unknown) {
      handlers.get(event)?.(payload)
    },
  }
}

function defaultOpts(ws: FakeWsClient, overrides: Record<string, unknown> = {}) {
  return {
    channelId: "ch-1",
    serverId: "srv-1",
    currentUserId: "user-self",
    getToken: () => "token",
    getStore: () => Promise.resolve(null),
    wsClient: ws as unknown as Parameters<
      typeof useChannelMessages
    >[0]["wsClient"],
    baseUrl: "",
    ...overrides,
  }
}

beforeEach(() => {
  vi.clearAllMocks()
  mockEncryptForChannel.mockResolvedValue({ ciphertext: new Uint8Array(32) })
  mockDecryptFromChannel.mockReset()
  mockGetCachedMessage.mockResolvedValue(null)
  mockGetChannelMessages.mockResolvedValue([])
})

describe("useChannelMessages — send", () => {
  it("encrypts a v1 envelope (not raw text) on send", async () => {
    const ws = makeWsClient()
    const { result } = renderHook(() =>
      useChannelMessages(defaultOpts(ws))
    )

    await waitFor(() => expect(result.current.isInitialLoading).toBe(false))

    await act(async () => {
      await result.current.send({ v: 1, text: "hi" })
    })

    expect(mockEncryptForChannel).toHaveBeenCalledTimes(1)
    const wirePayload = mockEncryptForChannel.mock.calls[0][0] as string
    expect(JSON.parse(wirePayload)).toEqual({ v: 1, text: "hi" })
    expect(ws.send).toHaveBeenCalledWith(
      "message.send",
      expect.objectContaining({ channel_id: "ch-1" })
    )
  })

  it("persists the self-sent envelope under the server id when ack arrives", async () => {
    const ws = makeWsClient()
    const envelope = {
      v: 1 as const,
      text: "see attached",
      attachments: [
        {
          id: "att-1",
          name: "diagram.png",
          size: 1234,
          mimeType: "image/png",
          key: "AAA=",
          iv: "BBB=",
        },
      ],
    }
    const { result } = renderHook(() =>
      useChannelMessages(defaultOpts(ws))
    )

    await waitFor(() => expect(result.current.isInitialLoading).toBe(false))

    await act(async () => {
      await result.current.send(envelope)
    })

    const localId = ws.send.mock.calls.find(
      ([type]) => type === "message.send"
    )?.[1]?.local_id
    expect(localId).toEqual(expect.stringMatching(/^temp-/))

    await act(async () => {
      ws.emit("message.send.ack", {
        channel_id: "ch-1",
        local_id: localId,
        message_id: "msg-real-1",
        timestamp: "2026-04-01T23:16:31.998122Z",
      })
    })

    await waitFor(() => {
      expect(mockSetCachedMessage).toHaveBeenCalledWith("msg-real-1", {
        content: JSON.stringify(envelope),
        senderId: "user-self",
        timestamp: new Date("2026-04-01T23:16:31.998122Z").getTime(),
      })
    })
  })

  it("marks the optimistic row failed when the socket disconnects mid-send", async () => {
    const ws = makeWsClient()
    let connected = true
    ws.isConnected = () => connected
    const { result } = renderHook(() =>
      useChannelMessages(defaultOpts(ws))
    )
    await waitFor(() => expect(result.current.isInitialLoading).toBe(false))

    connected = false
    await act(async () => {
      try {
        await result.current.send({ v: 1, text: "ping" })
      } catch {
        // expected
      }
    })

    const failed = result.current.messages.find((m) => m.failed)
    expect(failed).toBeDefined()
    expect(failed?.envelope?.text).toBe("ping")
  })

  it("retries a failed message and clears the failed flag once it goes back through encrypt", async () => {
    const ws = makeWsClient()
    let connected = false
    ws.isConnected = () => connected
    const { result } = renderHook(() =>
      useChannelMessages(defaultOpts(ws))
    )
    await waitFor(() => expect(result.current.isInitialLoading).toBe(false))

    await act(async () => {
      try {
        await result.current.send({ v: 1, text: "one" })
      } catch {
        // expected
      }
    })
    const failed = result.current.messages.find((m) => m.failed)
    expect(failed).toBeDefined()

    connected = true
    await act(async () => {
      await result.current.retry(failed!.id)
    })

    expect(mockEncryptForChannel).toHaveBeenCalled()
    const stillFailed = result.current.messages.find((m) => m.failed)
    expect(stillFailed).toBeUndefined()
  })
})

describe("useChannelMessages — realtime receive", () => {
  it("decodes a v1 envelope from another device of the same account", async () => {
    const ws = makeWsClient()
    mockDecryptFromChannel.mockResolvedValue(
      JSON.stringify({ v: 1, text: "hi from other device" })
    )
    const { result } = renderHook(() =>
      useChannelMessages(defaultOpts(ws))
    )
    await waitFor(() => expect(result.current.isInitialLoading).toBe(false))

    await act(async () => {
      ws.emit("message.new", {
        id: "rt-1",
        channel_id: "ch-1",
        sender_id: "user-self",
        sender_device_id: "device-other",
        ciphertext: MLS_PRIVATE,
        timestamp: "2026-04-01T23:16:31.998122Z",
      })
    })

    await waitFor(() => {
      expect(result.current.messages).toHaveLength(1)
    })
    const msg = result.current.messages[0]
    expect(msg.decryptionFailed).toBe(false)
    expect(msg.envelope?.text).toBe("hi from other device")
  })

  it("flags realtime payloads that are not a v1 envelope as decryption-failed (strict cutover)", async () => {
    const ws = makeWsClient()
    mockDecryptFromChannel.mockResolvedValue("legacy raw text")
    const { result } = renderHook(() =>
      useChannelMessages(defaultOpts(ws))
    )
    await waitFor(() => expect(result.current.isInitialLoading).toBe(false))

    await act(async () => {
      ws.emit("message.new", {
        id: "rt-2",
        channel_id: "ch-1",
        sender_id: "user-other",
        ciphertext: MLS_PRIVATE,
        timestamp: "2026-04-01T23:16:31.998122Z",
      })
    })

    await waitFor(() => {
      expect(result.current.messages).toHaveLength(1)
    })
    expect(result.current.messages[0].decryptionFailed).toBe(true)
    expect(result.current.messages[0].envelope).toBeNull()
  })

  it("rejects realtime ciphertext with non-private MLS wire byte (no decrypt, no cache, flagged failed)", async () => {
    const ws = makeWsClient()
    mockDecryptFromChannel.mockResolvedValue(
      JSON.stringify({ v: 1, text: "should never run" })
    )
    const { result } = renderHook(() =>
      useChannelMessages(defaultOpts(ws))
    )
    await waitFor(() => expect(result.current.isInitialLoading).toBe(false))

    await act(async () => {
      ws.emit("message.new", {
        id: "rt-bad-wire",
        channel_id: "ch-1",
        sender_id: "user-other",
        ciphertext: MLS_PUBLIC,
        timestamp: "2026-04-01T23:16:31.998122Z",
      })
    })

    await waitFor(() => {
      expect(result.current.messages).toHaveLength(1)
    })
    const msg = result.current.messages[0]
    expect(msg.decryptionFailed).toBe(true)
    expect(msg.envelope).toBeNull()
    // Decrypt path must be skipped entirely for non-private wire bytes.
    expect(mockDecryptFromChannel).not.toHaveBeenCalled()
    // No plaintext is produced, so nothing must be cached.
    expect(mockSetCachedMessage).not.toHaveBeenCalled()
  })

  it("dedupes duplicate realtime ids", async () => {
    const ws = makeWsClient()
    mockDecryptFromChannel.mockResolvedValue(
      JSON.stringify({ v: 1, text: "once" })
    )
    const { result } = renderHook(() =>
      useChannelMessages(defaultOpts(ws))
    )
    await waitFor(() => expect(result.current.isInitialLoading).toBe(false))

    const payload = {
      id: "rt-3",
      channel_id: "ch-1",
      sender_id: "user-other",
      ciphertext: MLS_PRIVATE,
      timestamp: "2026-04-01T23:16:31.998122Z",
    }
    await act(async () => {
      ws.emit("message.new", payload)
    })
    await act(async () => {
      ws.emit("message.new", payload)
    })

    await waitFor(() => {
      expect(result.current.messages).toHaveLength(1)
    })
  })
})

describe("useChannelMessages — mark_read", () => {
  it("sends mark_read for a realtime non-own message when enabled", async () => {
    const ws = makeWsClient()
    mockDecryptFromChannel.mockResolvedValue(
      JSON.stringify({ v: 1, text: "x" })
    )
    const onMarkRead = vi.fn()
    const { result } = renderHook(() =>
      useChannelMessages(
        defaultOpts(ws, { markRead: { enabled: true, onMarkRead } })
      )
    )
    await waitFor(() => expect(result.current.isInitialLoading).toBe(false))

    await act(async () => {
      ws.emit("message.new", {
        id: "rt-mr-1",
        channel_id: "ch-1",
        sender_id: "user-other",
        ciphertext: MLS_PRIVATE,
        timestamp: "2026-04-01T23:16:31.998122Z",
      })
    })

    await waitFor(() => {
      expect(ws.send).toHaveBeenCalledWith("message.mark_read", {
        channel_id: "ch-1",
        message_id: "rt-mr-1",
      })
    })
    expect(onMarkRead).toHaveBeenCalledWith("ch-1")
  })

  it("does not send mark_read for an own-device echo", async () => {
    const ws = makeWsClient()
    const { result } = renderHook(() =>
      useChannelMessages(
        defaultOpts(ws, { markRead: { enabled: true } })
      )
    )
    await waitFor(() => expect(result.current.isInitialLoading).toBe(false))

    await act(async () => {
      ws.emit("message.new", {
        id: "rt-self-1",
        channel_id: "ch-1",
        sender_id: "user-self",
        sender_device_id: "device-self",
        ciphertext: MLS_PRIVATE,
        timestamp: "2026-04-01T23:16:31.998122Z",
      })
    })

    expect(
      ws.send.mock.calls.find(([t]) => t === "message.mark_read")
    ).toBeUndefined()
    expect(mockDecryptFromChannel).not.toHaveBeenCalled()
  })
})

describe("useChannelMessages — historical decrypt MLS wire-format guard", () => {
  it("rejects historical rows whose ciphertext is not an MLS private message", async () => {
    const ws = makeWsClient()
    mockGetChannelMessages.mockResolvedValueOnce([
      {
        id: "hist-bad",
        channelId: "ch-1",
        senderId: "user-other",
        ciphertext: MLS_PUBLIC,
        timestamp: "2026-04-01T23:16:31.998122Z",
      },
    ])
    mockDecryptFromChannel.mockResolvedValue(
      JSON.stringify({ v: 1, text: "should never run" })
    )

    const { result } = renderHook(() =>
      useChannelMessages(defaultOpts(ws))
    )
    await waitFor(() => expect(result.current.isInitialLoading).toBe(false))
    await waitFor(() => expect(result.current.messages).toHaveLength(1))

    const msg = result.current.messages[0]
    expect(msg.id).toBe("hist-bad")
    expect(msg.decryptionFailed).toBe(true)
    expect(msg.envelope).toBeNull()
    expect(mockDecryptFromChannel).not.toHaveBeenCalled()
    expect(mockSetCachedMessage).not.toHaveBeenCalled()
  })

  it("decrypts historical rows that carry the MLS private wire byte", async () => {
    const ws = makeWsClient()
    mockGetChannelMessages.mockResolvedValueOnce([
      {
        id: "hist-good",
        channelId: "ch-1",
        senderId: "user-other",
        ciphertext: MLS_PRIVATE,
        timestamp: "2026-04-01T23:16:31.998122Z",
      },
    ])
    mockDecryptFromChannel.mockResolvedValue(
      JSON.stringify({ v: 1, text: "history hi" })
    )

    const { result } = renderHook(() =>
      useChannelMessages(defaultOpts(ws))
    )
    await waitFor(() => expect(result.current.isInitialLoading).toBe(false))
    await waitFor(() => expect(result.current.messages).toHaveLength(1))

    const msg = result.current.messages[0]
    expect(msg.id).toBe("hist-good")
    expect(msg.decryptionFailed).toBe(false)
    expect(msg.envelope?.text).toBe("history hi")
    expect(mockDecryptFromChannel).toHaveBeenCalledTimes(1)
  })
})
