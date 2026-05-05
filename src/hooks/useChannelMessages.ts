/**
 * MLS message subscription + send/receive hook for a single channel.
 *
 * Owns the data plane that the legacy `Chat.jsx` component used to mix
 * with its render logic: history paging, optimistic outbox, decrypt, MLS
 * realtime subscription, mark_read acknowledgements, reconnect catch-up,
 * and retry of failed sends.
 *
 * Plaintext is now the v1 envelope (`MessageEnvelopeV1`) instead of a raw
 * UTF-8 string — every send goes `envelope → JSON → bytes → MLS encrypt`
 * and every receive goes `MLS decrypt → bytes → JSON → envelope`. Legacy
 * cache rows that pre-date the cutover decode-failure into a synthetic
 * `{ v: 1, text: <stored string> }` so the chat surface still renders
 * them as plain text.
 *
 * The hook is render-agnostic: it returns the message list and a small
 * imperative API. The chat shell composes this with `MessageContent`
 * (Streamdown markdown render) and `MessageComposer` (Novel editor).
 */
import * as React from "react"

import * as api from "@/lib/api"
import { getDeviceId } from "@/hooks/useAuth"
import { useMLS } from "@/hooks/useMLS"
import {
  MAX_ENVELOPE_BYTES,
  decodeEnvelopeV1FromString,
  encodeEnvelopeV1,
  envelopeFromText,
  type MessageEnvelopeV1,
} from "@/lib/messageEnvelope"

const CHANNEL_MESSAGES_PAGE_LIMIT = 50
const PENDING_SEND_TTL = 60_000

/**
 * One row in the channel message list. `envelope` is `null` only when
 * decryption failed; the chat surface renders the recovery placeholder
 * in that case. Otherwise the envelope is a fully validated v1 shape and
 * its `text` field is safe to feed into the markdown renderer.
 */
export interface ChatMessage {
  id: string
  sender: string
  envelope: MessageEnvelopeV1 | null
  decryptionFailed: boolean
  timestamp: number
  pending?: boolean
  failed?: boolean
}

interface PendingSendEntry {
  envelope: MessageEnvelopeV1
  senderId: string
  timestamp: number
}

interface MarkReadOptions {
  enabled: boolean
  onMarkRead?: ((channelId: string) => void) | null
}

export interface UseChannelMessagesOptions {
  channelId: string | null
  serverId: string | null
  currentUserId: string
  getToken: () => string | null
  getStore: () => Promise<unknown> | unknown
  getHistoryStore?: () => Promise<unknown> | unknown
  wsClient: WsClient | null
  baseUrl?: string
  markRead?: MarkReadOptions
  onNewMessage?: () => void
}

export interface UseChannelMessagesResult {
  messages: ChatMessage[]
  isInitialLoading: boolean
  isChannelTransitioning: boolean
  hasMoreOlder: boolean
  loadMoreLoading: boolean
  isSending: boolean
  loadOlder: () => Promise<void>
  send: (envelope: MessageEnvelopeV1) => Promise<{ id: string }>
  retry: (localId: string) => Promise<void>
  /** Surface raw scroll restore data so the renderer can preserve scrollTop after prepend. */
  consumeScrollRestore: () => { oldScrollHeight: number; oldScrollTop: number } | null
  recordScrollState: (el: HTMLElement | null) => void
}

interface WsClient {
  send: (type: string, payload: Record<string, unknown>) => void
  on: (event: string, handler: (data: WsMessage) => void) => void
  off: (event: string, handler: (data: WsMessage) => void) => void
  isConnected: () => boolean
}

interface WsMessage {
  channel_id?: string
  id?: string
  ciphertext?: string
  sender_id?: string
  sender_device_id?: string
  timestamp?: string
  code?: string
}

interface DecryptDeps {
  decryptFromChannel: (bytes: Uint8Array) => Promise<string>
  getCachedMessage?: (id: string) => Promise<CachedMessage | null>
  setCachedMessage?: (id: string, payload: CachedMessage) => Promise<void> | void
}

interface CachedMessage {
  content: string
  senderId: string
  timestamp: number
}

interface ApiMessageRow {
  id: string
  channelId: string
  senderId: string
  ciphertext: string
  timestamp: string | number
}

/**
 * Pending-send registry kept at module scope so plaintext envelopes
 * survive component remount. The user can navigate away and back to a
 * channel before the self-echo arrives; without this the optimistic
 * row would render as decryption-failed because the local plaintext is
 * gone.
 */
const _pendingSends = new Map<string, PendingSendEntry[]>()

function rememberPendingSend(channelId: string, entry: PendingSendEntry): void {
  const list = _pendingSends.get(channelId) ?? []
  list.push(entry)
  _pendingSends.set(channelId, list)
}

function consumePendingSend(
  channelId: string,
  senderId: string,
  serverTimestamp: number
): MessageEnvelopeV1 | null {
  const list = _pendingSends.get(channelId)
  if (!list?.length) return null
  const now = Date.now()
  const fresh = list.filter((p) => now - p.timestamp < PENDING_SEND_TTL)
  if (!fresh.length) {
    _pendingSends.delete(channelId)
    return null
  }
  _pendingSends.set(channelId, fresh)
  const idx = fresh.findIndex(
    (p) => p.senderId === senderId && Math.abs(p.timestamp - serverTimestamp) < 10_000
  )
  if (idx < 0) return null
  const [match] = fresh.splice(idx, 1)
  if (!fresh.length) _pendingSends.delete(channelId)
  return match.envelope
}

function base64ToUint8Array(base64: string): Uint8Array {
  const bin = atob(base64)
  const arr = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i)
  return arr
}

function uint8ArrayToBase64(u8: Uint8Array): string {
  let bin = ""
  for (let i = 0; i < u8.length; i++) bin += String.fromCharCode(u8[i])
  return btoa(bin)
}

/**
 * Decode a UTF-8 plaintext into a v1 envelope. Wire receives MUST be
 * strict v1 — but the local transcript cache from before the cutover
 * stores bare strings, so we fall back to wrapping legacy plaintext as
 * `{ v: 1, text }` only on `cacheLegacyFallback === true`.
 */
function decodePlaintext(
  plaintext: string,
  cacheLegacyFallback: boolean
): MessageEnvelopeV1 | null {
  const result = decodeEnvelopeV1FromString(plaintext)
  if (result.ok) return result.envelope
  if (cacheLegacyFallback) return envelopeFromText(plaintext)
  return null
}

async function decryptMessageRow(
  row: ApiMessageRow,
  currentUserId: string,
  deps: DecryptDeps
): Promise<ChatMessage> {
  const ts =
    typeof row.timestamp === "number"
      ? row.timestamp
      : new Date(row.timestamp).getTime()

  const cached = await deps.getCachedMessage?.(row.id)
  if (cached) {
    return {
      id: row.id,
      sender: cached.senderId ?? row.senderId,
      envelope: decodePlaintext(cached.content, true),
      decryptionFailed: false,
      timestamp: cached.timestamp,
    }
  }

  if (row.senderId === currentUserId) {
    const pending = consumePendingSend(row.channelId, row.senderId, ts)
    if (pending !== null) {
      const json = JSON.stringify(pending)
      await deps.setCachedMessage?.(row.id, {
        content: json,
        senderId: row.senderId,
        timestamp: ts,
      })
      return {
        id: row.id,
        sender: row.senderId,
        envelope: pending,
        decryptionFailed: false,
        timestamp: ts,
      }
    }
  }

  try {
    const ct = base64ToUint8Array(row.ciphertext)
    const plaintext = await deps.decryptFromChannel(ct)
    // Strict v1 cutover on the wire — anything else is a corrupt
    // payload and renders the recovery placeholder.
    const envelope = decodePlaintext(plaintext, false)
    if (envelope !== null) {
      await deps.setCachedMessage?.(row.id, {
        content: plaintext,
        senderId: row.senderId,
        timestamp: ts,
      })
    }
    return {
      id: row.id,
      sender: row.senderId,
      envelope,
      decryptionFailed: envelope === null,
      timestamp: ts,
    }
  } catch (err) {
    console.warn(
      "[useChannelMessages] decrypt failed",
      row.id,
      "from",
      row.senderId,
      err
    )
    return {
      id: row.id,
      sender: row.senderId,
      envelope: null,
      decryptionFailed: true,
      timestamp: ts,
    }
  }
}

async function encryptAndSendEnvelope(
  wsClient: WsClient | null,
  channelId: string,
  envelope: MessageEnvelopeV1,
  encryptForChannel: (plaintext: string) => Promise<{ ciphertext: Uint8Array }>
): Promise<void> {
  if (!wsClient?.isConnected?.()) {
    throw new Error("Connection lost. Reconnect and retry.")
  }
  const bytes = encodeEnvelopeV1(envelope)
  if (bytes.byteLength > MAX_ENVELOPE_BYTES) {
    throw new Error(
      `Envelope too large: ${bytes.byteLength}/${MAX_ENVELOPE_BYTES} bytes`
    )
  }
  const plaintext = new TextDecoder("utf-8").decode(bytes)
  const { ciphertext } = await encryptForChannel(plaintext)
  if (!wsClient?.isConnected?.()) {
    throw new Error("Connection lost. Reconnect and retry.")
  }
  wsClient.send("message.send", {
    channel_id: channelId,
    ciphertext: uint8ArrayToBase64(ciphertext),
  })
}

export function useChannelMessages(
  opts: UseChannelMessagesOptions
): UseChannelMessagesResult {
  const {
    channelId,
    serverId,
    currentUserId,
    getToken,
    getStore,
    getHistoryStore,
    wsClient,
    baseUrl = "",
    markRead,
    onNewMessage,
  } = opts

  const [messages, setMessages] = React.useState<ChatMessage[]>([])
  const [isSending, setIsSending] = React.useState(false)
  const [loadMoreLoading, setLoadMoreLoading] = React.useState(false)
  const [hasMoreOlder, setHasMoreOlder] = React.useState(true)
  const [isInitialLoading, setIsInitialLoading] = React.useState(true)

  const knownMessageIdsRef = React.useRef<Set<string>>(new Set())
  const loadedChannelRef = React.useRef<string | null>(channelId)
  const lastAckedIdRef = React.useRef<string | null>(null)
  const latestBackendTsRef = React.useRef<number | null>(null)
  const scrollRestoreRef = React.useRef<{
    oldScrollHeight: number
    oldScrollTop: number
  } | null>(null)
  const wsClientRef = React.useRef<WsClient | null>(wsClient)
  wsClientRef.current = wsClient
  const markReadEnabledRef = React.useRef<boolean>(markRead?.enabled ?? false)
  const onMarkReadRef = React.useRef(markRead?.onMarkRead ?? null)
  markReadEnabledRef.current = markRead?.enabled ?? false
  onMarkReadRef.current = markRead?.onMarkRead ?? null
  const onNewMessageRef = React.useRef(onNewMessage)
  onNewMessageRef.current = onNewMessage
  const getTokenRef = React.useRef(getToken)
  getTokenRef.current = getToken

  type IdbStoreFactory = () => Promise<IDBDatabase | null>
  const mls = useMLS({
    getStore: (getStore ?? (() => Promise.resolve(null))) as unknown as IdbStoreFactory,
    getHistoryStore: (getHistoryStore ?? (() => Promise.resolve(null))) as unknown as IdbStoreFactory,
    getToken: getToken ?? (() => null),
    channelId: channelId ?? undefined,
  }) as {
    encryptForChannel: (plaintext: string) => Promise<{ ciphertext: Uint8Array }>
    decryptFromChannel: (bytes: Uint8Array) => Promise<string>
    getCachedMessage?: (id: string) => Promise<CachedMessage | null>
    setCachedMessage?: (id: string, payload: CachedMessage) => Promise<void> | void
  }

  const decryptDepsRef = React.useRef<DecryptDeps>({
    decryptFromChannel: mls.decryptFromChannel,
    getCachedMessage: mls.getCachedMessage,
    setCachedMessage: mls.setCachedMessage,
  })
  decryptDepsRef.current = {
    decryptFromChannel: mls.decryptFromChannel,
    getCachedMessage: mls.getCachedMessage,
    setCachedMessage: mls.setCachedMessage,
  }
  const encryptForChannelRef = React.useRef(mls.encryptForChannel)
  encryptForChannelRef.current = mls.encryptForChannel

  React.useEffect(() => {
    if (!channelId || !serverId) return
    const token = getTokenRef.current?.()
    if (!token) return

    knownMessageIdsRef.current = new Set()
    scrollRestoreRef.current = null
    lastAckedIdRef.current = null
    latestBackendTsRef.current = null

    let cancelled = false
    const loadHistory = async () => {
      try {
        const list: ApiMessageRow[] = await api.getChannelMessages(
          token,
          serverId,
          channelId,
          { limit: CHANNEL_MESSAGES_PAGE_LIMIT },
          baseUrl
        )
        const decrypted: ChatMessage[] = []
        for (let i = list.length - 1; i >= 0; i--) {
          const row = list[i]
          decrypted.push(
            await decryptMessageRow(row, currentUserId, decryptDepsRef.current)
          )
          knownMessageIdsRef.current.add(row.id)
        }
        if (cancelled) return
        loadedChannelRef.current = channelId
        setMessages(decrypted)
        setHasMoreOlder(list.length >= CHANNEL_MESSAGES_PAGE_LIMIT)
        if (decrypted.length > 0) {
          latestBackendTsRef.current = decrypted[decrypted.length - 1].timestamp
        }
        if (markReadEnabledRef.current && wsClientRef.current?.isConnected()) {
          for (let i = decrypted.length - 1; i >= 0; i--) {
            const m = decrypted[i]
            if (m.sender !== currentUserId && m.id && !m.pending) {
              if (lastAckedIdRef.current !== m.id) {
                lastAckedIdRef.current = m.id
                wsClientRef.current.send("message.mark_read", {
                  channel_id: channelId,
                  message_id: m.id,
                })
                onMarkReadRef.current?.(channelId)
              }
              break
            }
          }
        }
      } catch (err) {
        if (cancelled) return
        console.error("[useChannelMessages] history load failed", err)
        loadedChannelRef.current = channelId
        setMessages([])
      } finally {
        if (!cancelled) setIsInitialLoading(false)
      }
    }
    setIsInitialLoading(true)
    loadHistory()
    return () => {
      cancelled = true
    }
  }, [channelId, serverId, currentUserId, baseUrl])

  const loadOlder = React.useCallback(async () => {
    if (
      !channelId ||
      !serverId ||
      loadMoreLoading ||
      !hasMoreOlder ||
      messages.length === 0
    ) {
      return
    }
    const token = getTokenRef.current?.()
    if (!token) return
    const oldestTs = messages[0]?.timestamp
    if (!oldestTs) return

    setLoadMoreLoading(true)
    try {
      const before = new Date(oldestTs).toISOString()
      const list: ApiMessageRow[] = await api.getChannelMessages(
        token,
        serverId,
        channelId,
        { before, limit: CHANNEL_MESSAGES_PAGE_LIMIT },
        baseUrl
      )
      if (list.length === 0) {
        setHasMoreOlder(false)
        return
      }
      if (list.length < CHANNEL_MESSAGES_PAGE_LIMIT) setHasMoreOlder(false)
      const older: ChatMessage[] = []
      for (let i = list.length - 1; i >= 0; i--) {
        const row = list[i]
        if (knownMessageIdsRef.current.has(row.id)) continue
        knownMessageIdsRef.current.add(row.id)
        older.push(
          await decryptMessageRow(row, currentUserId, decryptDepsRef.current)
        )
      }
      setMessages((prev) => [...older, ...prev])
    } catch (err) {
      console.error("[useChannelMessages] load older failed", err)
    } finally {
      setLoadMoreLoading(false)
    }
  }, [
    channelId,
    serverId,
    loadMoreLoading,
    hasMoreOlder,
    messages,
    currentUserId,
    baseUrl,
  ])

  React.useEffect(() => {
    if (!wsClient || !channelId) return

    function doSubscribe() {
      if (wsClient!.isConnected()) {
        wsClient!.send("subscribe", { channel_id: channelId })
      }
    }
    doSubscribe()
    wsClient.on("open", doSubscribe)

    const onMessageNew = async (data: WsMessage) => {
      if (data.channel_id !== channelId) return
      const id = data.id || `msg-${Date.now()}`
      if (knownMessageIdsRef.current.has(id)) return
      knownMessageIdsRef.current.add(id)
      const senderId = data.sender_id ?? ""
      const ts = data.timestamp ? new Date(data.timestamp).getTime() : Date.now()

      if (data.id && ts > (latestBackendTsRef.current ?? 0)) {
        latestBackendTsRef.current = ts
      }

      const isOwnEcho =
        senderId === currentUserId && data.sender_device_id === getDeviceId()
      if (isOwnEcho) {
        const pending = consumePendingSend(channelId, currentUserId, ts)
        setMessages((prev) => {
          const idx = prev.findIndex(
            (m) => m.pending && m.sender === currentUserId
          )
          if (idx < 0) return prev
          return prev.map((m, i) =>
            i === idx
              ? { ...m, id, pending: false, failed: false, timestamp: ts }
              : m
          )
        })
        if (pending !== null) {
          await decryptDepsRef.current.setCachedMessage?.(id, {
            content: JSON.stringify(pending),
            senderId: currentUserId,
            timestamp: ts,
          })
        }
        return
      }

      let envelope: MessageEnvelopeV1 | null = null
      let decryptionFailed = false
      const ciphertext = data.ciphertext
      if (ciphertext) {
        try {
          const ct = base64ToUint8Array(ciphertext)
          const plaintext = await decryptDepsRef.current.decryptFromChannel(ct)
          envelope = decodePlaintext(plaintext, false)
          decryptionFailed = envelope === null
          if (envelope !== null) {
            await decryptDepsRef.current.setCachedMessage?.(id, {
              content: plaintext,
              senderId,
              timestamp: ts,
            })
          }
        } catch (err) {
          console.warn(
            "[useChannelMessages] realtime decrypt failed",
            { channelId, messageId: id, senderId },
            err
          )
          decryptionFailed = true
        }
      }
      const msg: ChatMessage = {
        id,
        sender: senderId,
        envelope,
        decryptionFailed,
        timestamp: ts,
      }
      onNewMessageRef.current?.()
      setMessages((prev) => [...prev, msg])
      if (
        markReadEnabledRef.current &&
        data.id &&
        senderId !== currentUserId &&
        wsClientRef.current?.isConnected() &&
        lastAckedIdRef.current !== id
      ) {
        lastAckedIdRef.current = id
        wsClientRef.current.send("message.mark_read", {
          channel_id: channelId,
          message_id: id,
        })
        onMarkReadRef.current?.(channelId)
      }
    }

    const onError = (data: WsMessage) => {
      if (data.code === "forbidden" || data.code === "internal") {
        setMessages((prev) =>
          prev.map((m) =>
            m.pending ? { ...m, pending: false, failed: true } : m
          )
        )
      }
    }

    wsClient.on("message.new", onMessageNew)
    wsClient.on("error", onError)
    return () => {
      wsClient.off("open", doSubscribe)
      wsClient.off("message.new", onMessageNew)
      wsClient.off("error", onError)
      if (wsClient.isConnected())
        wsClient.send("unsubscribe", { channel_id: channelId })
    }
  }, [wsClient, channelId, currentUserId])

  React.useEffect(() => {
    if (!wsClient || !channelId || !serverId) return

    const onReconnected = async () => {
      const latestTs = latestBackendTsRef.current
      if (latestTs == null) return
      const token = getTokenRef.current?.()
      if (!token) return
      try {
        let newestNonOwnId: string | null = null
        let newestNonOwnTs = 0
        const appended: ChatMessage[] = []
        let cursorTs = latestTs

        for (;;) {
          const after = new Date(cursorTs).toISOString()
          const list: ApiMessageRow[] = await api.getChannelMessages(
            token,
            serverId,
            channelId,
            { after, limit: CHANNEL_MESSAGES_PAGE_LIMIT },
            baseUrl
          )
          if (list.length === 0) break

          let nextCursorTs = cursorTs
          for (const row of list) {
            const ts =
              typeof row.timestamp === "number"
                ? row.timestamp
                : new Date(row.timestamp).getTime()
            if (ts > nextCursorTs) nextCursorTs = ts
            if (knownMessageIdsRef.current.has(row.id)) continue
            knownMessageIdsRef.current.add(row.id)
            const decrypted = await decryptMessageRow(
              row,
              currentUserId,
              decryptDepsRef.current
            )
            appended.push(decrypted)
            if (row.senderId !== currentUserId && row.id && ts > newestNonOwnTs) {
              newestNonOwnId = row.id
              newestNonOwnTs = ts
            }
          }

          if (
            nextCursorTs <= cursorTs ||
            list.length < CHANNEL_MESSAGES_PAGE_LIMIT
          ) {
            break
          }
          cursorTs = nextCursorTs
        }
        if (appended.length === 0) return
        setMessages((prev) => {
          const merged = [...prev, ...appended]
          merged.sort((a, b) => a.timestamp - b.timestamp)
          return merged
        })
        const lastTs = appended[appended.length - 1].timestamp
        if (lastTs > latestTs) latestBackendTsRef.current = lastTs
        if (
          markReadEnabledRef.current &&
          newestNonOwnId &&
          wsClientRef.current?.isConnected() &&
          lastAckedIdRef.current !== newestNonOwnId
        ) {
          lastAckedIdRef.current = newestNonOwnId
          wsClientRef.current.send("message.mark_read", {
            channel_id: channelId,
            message_id: newestNonOwnId,
          })
          onMarkReadRef.current?.(channelId)
        }
      } catch (err) {
        console.error("[useChannelMessages] reconnect catch-up failed", err)
      }
    }

    wsClient.on("reconnected", onReconnected)
    return () => {
      wsClient.off("reconnected", onReconnected)
    }
  }, [wsClient, channelId, serverId, currentUserId, baseUrl])

  const send = React.useCallback(
    async (envelope: MessageEnvelopeV1): Promise<{ id: string }> => {
      if (!channelId || !wsClient) {
        throw new Error("Channel not ready")
      }
      const token = getTokenRef.current?.()
      if (!token) throw new Error("No auth token")

      const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
      const optimistic: ChatMessage = {
        id: tempId,
        sender: currentUserId,
        envelope,
        decryptionFailed: false,
        timestamp: Date.now(),
        pending: true,
        failed: false,
      }
      setMessages((prev) => [...prev, optimistic])
      setIsSending(true)
      rememberPendingSend(channelId, {
        envelope,
        senderId: currentUserId,
        timestamp: Date.now(),
      })
      try {
        await encryptAndSendEnvelope(
          wsClient,
          channelId,
          envelope,
          encryptForChannelRef.current
        )
        return { id: tempId }
      } catch (err) {
        console.error(
          "[useChannelMessages] send failed",
          err instanceof Error ? err.message : err
        )
        setMessages((prev) =>
          prev.map((m) =>
            m.id === tempId ? { ...m, pending: false, failed: true } : m
          )
        )
        throw err
      } finally {
        setIsSending(false)
      }
    },
    [channelId, wsClient, currentUserId]
  )

  const retry = React.useCallback(
    async (localId: string): Promise<void> => {
      if (!channelId || !wsClient) return
      const target = messages.find((m) => m.id === localId)
      if (!target?.failed || !target.envelope) return
      setMessages((prev) =>
        prev.map((m) =>
          m.id === localId ? { ...m, failed: false, pending: true } : m
        )
      )
      // Mirror the dedup contract from `send`: a retried envelope
      // re-enters the wire as a fresh own-send, so the inbound echo
      // matcher needs the pending entry recorded the same way.
      // Without this the retry's self-echo cannot be matched and the
      // optimistic row sticks around as a duplicate.
      rememberPendingSend(channelId, {
        envelope: target.envelope,
        senderId: currentUserId,
        timestamp: Date.now(),
      })
      try {
        await encryptAndSendEnvelope(
          wsClient,
          channelId,
          target.envelope,
          encryptForChannelRef.current
        )
      } catch (err) {
        console.error(
          "[useChannelMessages] retry send failed",
          err instanceof Error ? err.message : err
        )
        setMessages((prev) =>
          prev.map((m) =>
            m.id === localId ? { ...m, pending: false, failed: true } : m
          )
        )
      }
    },
    [channelId, wsClient, messages, currentUserId]
  )

  const consumeScrollRestore = React.useCallback(() => {
    const v = scrollRestoreRef.current
    scrollRestoreRef.current = null
    return v
  }, [])

  const recordScrollState = React.useCallback((el: HTMLElement | null) => {
    if (!el) {
      scrollRestoreRef.current = null
      return
    }
    scrollRestoreRef.current = {
      oldScrollHeight: el.scrollHeight,
      oldScrollTop: el.scrollTop,
    }
  }, [])

  const isChannelTransitioning = loadedChannelRef.current !== channelId

  return {
    messages: isChannelTransitioning ? [] : messages,
    isInitialLoading,
    isChannelTransitioning,
    hasMoreOlder,
    loadMoreLoading,
    isSending,
    loadOlder,
    send,
    retry,
    consumeScrollRestore,
    recordScrollState,
  }
}
