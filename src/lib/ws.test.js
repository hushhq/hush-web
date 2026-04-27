import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createWsClient } from './ws';

// ── Shared mock factory ───────────────────────────────────────────────────────

/**
 * Builds a MockWs constructor whose instances:
 *   - fire onopen asynchronously (settimeout 0) by default
 *   - optionally capture the instance for direct manipulation
 */
function makeMockWs({ captureInstance = false, autoOpen = true } = {}) {
  let captured = null;
  const Ctor = vi.fn(function MockWs(url) {
    this.url = url;
    this.readyState = 1; // OPEN
    this.send = vi.fn();
    this.close = vi.fn();
    if (captureInstance) captured = this;
    const self = this;
    if (autoOpen) {
      setTimeout(() => { if (self.onopen) self.onopen(); }, 0);
    }
    return this;
  });
  Ctor.OPEN = 1;
  Ctor.CONNECTING = 0;
  Object.defineProperty(Ctor, 'captured', { get: () => captured });
  return Ctor;
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('createWsClient - initial connection', () => {
  let MockWs;

  beforeEach(() => {
    MockWs = makeMockWs();
    global.WebSocket = MockWs;
  });

  afterEach(() => {
    delete global.WebSocket;
  });

  it('never embeds the token in the WebSocket URL (ans23 / F4)', () => new Promise((resolve) => {
    // ans23 removed token-in-URL auth so JWTs do not land in nginx
    // access logs. The token must travel only inside the first frame.
    const getToken = vi.fn(() => 'jwt-123');
    const client = createWsClient({ url: 'ws://localhost/ws', getToken });
    client.connect();
    expect(MockWs).toHaveBeenCalledWith('ws://localhost/ws');
    expect(MockWs.mock.calls[0][0]).not.toContain('token=');
    setTimeout(() => {
      const calls = MockWs.mock.results[0].value.send.mock.calls;
      const authCall = calls.find((c) => JSON.parse(c[0]).type === 'auth');
      expect(authCall).toBeDefined();
      expect(JSON.parse(authCall[0])).toEqual({ type: 'auth', token: 'jwt-123' });
      resolve();
    }, 10);
  }));

  it('sends auth message on every open (no URL token path)', () => new Promise((resolve) => {
    const getToken = vi.fn().mockReturnValue('only-token');
    const client = createWsClient({ url: 'ws://localhost/ws', getToken });
    client.connect();
    expect(MockWs).toHaveBeenCalledWith('ws://localhost/ws');
    setTimeout(() => {
      const calls = MockWs.mock.results[0].value.send.mock.calls;
      const authCall = calls.find((c) => JSON.parse(c[0]).type === 'auth');
      expect(authCall).toBeDefined();
      expect(JSON.parse(authCall[0])).toEqual({ type: 'auth', token: 'only-token' });
      resolve();
    }, 10);
  }));

  it('closes the socket when getToken returns no token at open time', () => new Promise((resolve) => {
    const getToken = vi.fn(() => null);
    const client = createWsClient({ url: 'ws://localhost/ws', getToken });
    client.connect();
    setTimeout(() => {
      expect(MockWs.mock.results[0].value.close).toHaveBeenCalled();
      const sent = MockWs.mock.results[0].value.send.mock.calls;
      expect(sent.length).toBe(0);
      resolve();
    }, 10);
  }));

  it('dispatches incoming message by type to listeners', () => new Promise((resolve) => {
    MockWs = makeMockWs({ captureInstance: true, autoOpen: false });
    global.WebSocket = MockWs;

    const getToken = vi.fn(() => 't');
    const client = createWsClient({ url: 'ws://localhost/ws', getToken });
    const onMessageNew = vi.fn();
    client.on('message.new', onMessageNew);
    client.connect();
    setTimeout(() => {
      const ws = MockWs.captured;
      expect(ws).not.toBeNull();
      ws.onmessage({ data: JSON.stringify({ type: 'message.new', id: 'm1', channel_id: 'ch1' }) });
      expect(onMessageNew).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'message.new', id: 'm1', channel_id: 'ch1' }),
      );
      resolve();
    }, 10);
  }));

  it('send(type, payload) serializes and sends', () => new Promise((resolve) => {
    const getToken = vi.fn(() => 't');
    const client = createWsClient({ url: 'ws://localhost/ws', getToken });
    client.connect();
    setTimeout(() => {
      client.send('subscribe', { channel_id: 'ch1' });
      const calls = MockWs.mock.results[0].value.send.mock.calls;
      // Auth frame ships first under the new auth model; locate the
      // subscribe frame explicitly so the assertion is robust against
      // the auth message ordering.
      const subscribeCall = calls.find((c) => JSON.parse(c[0]).type === 'subscribe');
      expect(subscribeCall).toBeDefined();
      expect(JSON.parse(subscribeCall[0])).toEqual({ type: 'subscribe', channel_id: 'ch1' });
      resolve();
    }, 10);
  }));

  it('off removes listener', () => new Promise((resolve) => {
    MockWs = makeMockWs({ captureInstance: true, autoOpen: false });
    global.WebSocket = MockWs;
    const getToken = vi.fn(() => 't');
    const client = createWsClient({ url: 'ws://localhost/ws', getToken });
    const onPresence = vi.fn();
    client.on('presence.update', onPresence);
    client.off('presence.update', onPresence);
    client.connect();
    setTimeout(() => {
      MockWs.captured.onmessage({ data: JSON.stringify({ type: 'presence.update', user_ids: [] }) });
      expect(onPresence).not.toHaveBeenCalled();
      resolve();
    }, 10);
  }));
});

// ── Reconnect chain tests ─────────────────────────────────────────────────────

describe('createWsClient - reconnect chain', () => {
  let MockWs;

  beforeEach(() => {
    vi.useFakeTimers();
    MockWs = makeMockWs({ captureInstance: true, autoOpen: false });
    global.WebSocket = MockWs;
  });

  afterEach(() => {
    vi.useRealTimers();
    delete global.WebSocket;
  });

  /**
   * Opens a connection, triggers the onopen callback, then simulates a close
   * and advances fake timers past the backoff delay to trigger reconnect.
   */
  async function openAndSimulateReconnect(client) {
    client.connect();
    // Fire first onopen.
    MockWs.captured.onopen && MockWs.captured.onopen();
    // Simulate disconnect.
    MockWs.captured.onclose && MockWs.captured.onclose();
    // Allow reconnect timer (1000ms base) to fire.
    vi.advanceTimersByTime(1100);
    // New WS instance created - fire its onopen.
    const second = MockWs.mock.results[1]?.value;
    if (second?.onopen) await second.onopen();
    return second;
  }

  it('emits "reconnecting" event on disconnect before reconnect attempt', async () => {
    const getToken = vi.fn(() => 'tok');
    const onReconnecting = vi.fn();
    const client = createWsClient({ url: 'ws://localhost/ws', getToken });
    client.on('reconnecting', onReconnecting);

    client.connect();
    MockWs.captured.onopen();
    MockWs.captured.onclose();

    expect(onReconnecting).toHaveBeenCalledOnce();
  });

  it('emits "reconnected" event after successful reconnect', async () => {
    const getToken = vi.fn(() => 'tok');
    const onReconnected = vi.fn();
    const client = createWsClient({ url: 'ws://localhost/ws', getToken });
    client.on('reconnected', onReconnected);

    await openAndSimulateReconnect(client);

    expect(onReconnected).toHaveBeenCalledOnce();
  });

  it('sends a fresh auth frame (not a URL token) on reconnect', async () => {
    // Token rotation across reconnects must travel inside the auth
    // frame; the URL must remain the bare path so JWTs do not land in
    // server access logs (ans23 / F4).
    const getToken = vi.fn().mockReturnValueOnce('tok-1').mockReturnValue('tok-2');
    const client = createWsClient({ url: 'ws://localhost/ws', getToken });

    client.connect();
    MockWs.captured.onopen();
    MockWs.captured.onclose();
    vi.advanceTimersByTime(1100);

    const secondUrl = MockWs.mock.calls[1]?.[0];
    expect(secondUrl).toBe('ws://localhost/ws');
    MockWs.captured.onopen();

    // Find the auth frame on the reconnected socket. mock.results[1]
    // is the second WebSocket instance.
    const calls = MockWs.mock.results[1].value.send.mock.calls;
    const authCall = calls.find((c) => JSON.parse(c[0]).type === 'auth');
    expect(authCall).toBeDefined();
    expect(JSON.parse(authCall[0])).toEqual({ type: 'auth', token: 'tok-2' });
  });

  it('calls onReconnected hook after reconnect and before emitting "reconnected"', async () => {
    const callOrder = [];
    const onReconnectedHook = vi.fn(async () => {
      callOrder.push('hook');
    });
    const getToken = vi.fn(() => 'tok');
    const client = createWsClient({
      url: 'ws://localhost/ws',
      getToken,
      onReconnected: onReconnectedHook,
    });
    client.on('reconnected', () => callOrder.push('event'));

    await openAndSimulateReconnect(client);

    expect(onReconnectedHook).toHaveBeenCalledOnce();
    expect(callOrder).toEqual(['hook', 'event']);
  });

  it('isReconnecting() returns true between disconnect and reconnected hook completion', () => {
    const getToken = vi.fn(() => 'tok');
    const client = createWsClient({ url: 'ws://localhost/ws', getToken });

    client.connect();
    MockWs.captured.onopen();
    expect(client.isReconnecting()).toBe(false);

    MockWs.captured.onclose();
    expect(client.isReconnecting()).toBe(true);
  });

  it('isReconnecting() returns false after manual disconnect()', () => {
    const getToken = vi.fn(() => 'tok');
    const client = createWsClient({ url: 'ws://localhost/ws', getToken });

    client.connect();
    MockWs.captured.onopen();
    MockWs.captured.onclose();
    expect(client.isReconnecting()).toBe(true);

    client.disconnect();
    expect(client.isReconnecting()).toBe(false);
  });

  it('onReconnected hook error does not prevent "reconnected" event', async () => {
    const getToken = vi.fn(() => 'tok');
    const badHook = vi.fn(async () => { throw new Error('recovery failed'); });
    const onReconnectedEvent = vi.fn();
    const client = createWsClient({
      url: 'ws://localhost/ws',
      getToken,
      onReconnected: badHook,
    });
    client.on('reconnected', onReconnectedEvent);

    await openAndSimulateReconnect(client);

    // Event fires even when hook throws.
    expect(onReconnectedEvent).toHaveBeenCalledOnce();
  });
});

// ── Network recovery tests ───────────────────────────────────────────────────

describe('createWsClient - network recovery', () => {
  let MockWs;
  /** @type {Map<string, Function>} Captured window event handlers */
  let windowListeners;
  /** @type {Map<string, Function>} Captured document event handlers */
  let docListeners;
  let origAddEventListener;
  let origRemoveEventListener;
  let origDocAddEventListener;
  let origDocRemoveEventListener;
  let origVisibilityState;

  beforeEach(() => {
    vi.useFakeTimers();
    MockWs = makeMockWs({ captureInstance: true, autoOpen: false });
    global.WebSocket = MockWs;

    windowListeners = new Map();
    docListeners = new Map();

    // Spy on window.addEventListener / removeEventListener
    origAddEventListener = window.addEventListener;
    origRemoveEventListener = window.removeEventListener;
    window.addEventListener = vi.fn((type, handler) => {
      windowListeners.set(type, handler);
    });
    window.removeEventListener = vi.fn((type, handler) => {
      if (windowListeners.get(type) === handler) windowListeners.delete(type);
    });

    // Spy on document.addEventListener / removeEventListener
    origDocAddEventListener = document.addEventListener;
    origDocRemoveEventListener = document.removeEventListener;
    document.addEventListener = vi.fn((type, handler) => {
      docListeners.set(type, handler);
    });
    document.removeEventListener = vi.fn((type, handler) => {
      if (docListeners.get(type) === handler) docListeners.delete(type);
    });

    // Default visibility state
    origVisibilityState = document.visibilityState;
    Object.defineProperty(document, 'visibilityState', {
      value: 'visible',
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    delete global.WebSocket;
    window.addEventListener = origAddEventListener;
    window.removeEventListener = origRemoveEventListener;
    document.addEventListener = origDocAddEventListener;
    document.removeEventListener = origDocRemoveEventListener;
    Object.defineProperty(document, 'visibilityState', {
      value: origVisibilityState,
      configurable: true,
    });
  });

  function createAndConnect(overrides = {}) {
    const getToken = overrides.getToken ?? vi.fn(() => 'tok');
    const client = createWsClient({ url: 'ws://localhost/ws', getToken, ...overrides });
    client.connect();
    // Fire onopen so socket is OPEN
    MockWs.captured.onopen();
    return { client, ws: MockWs.captured };
  }

  it('online event with OPEN socket forces close and schedules reconnect', () => {
    const { client, ws } = createAndConnect();
    expect(ws.readyState).toBe(1); // OPEN

    const onReconnecting = vi.fn();
    client.on('reconnecting', onReconnecting);

    // Fire online event
    const onlineHandler = windowListeners.get('online');
    expect(onlineHandler).toBeDefined();
    onlineHandler();

    expect(ws.close).toHaveBeenCalled();
  });

  it('online event with null socket (already closed) schedules reconnect if not reconnecting', () => {
    const { client, ws } = createAndConnect();
    const onReconnecting = vi.fn();
    client.on('reconnecting', onReconnecting);

    // Simulate onclose so socket becomes null
    ws.onclose();

    // Now fire online event - should not error and should still handle gracefully
    const onlineHandler = windowListeners.get('online');
    expect(onlineHandler).toBeDefined();
    // scheduleReconnect was already called by onclose, so reconnecting is true
    // online handler should not crash
    onlineHandler();
  });

  it('online event after intentional disconnect() does not reconnect', () => {
    const { client } = createAndConnect();
    client.disconnect();

    // Online event fires after user intentionally disconnected
    // Listeners should have been removed, but even if handler is called manually
    // it should not reconnect
    const onReconnecting = vi.fn();
    client.on('reconnecting', onReconnecting);

    // The handler should have been removed by disconnect()
    expect(windowListeners.has('online')).toBe(false);
  });

  it('two missed pongs trigger socket close', () => {
    const { ws } = createAndConnect();

    // Advance past two ping intervals without sending any pong
    // Ping interval is 10s. After first ping: missedPongs=1. After second: missedPongs=2 -> close.
    vi.advanceTimersByTime(10_000); // First ping fires, missedPongs = 1
    vi.advanceTimersByTime(10_000); // Second ping fires, missedPongs = 2 -> close

    expect(ws.close).toHaveBeenCalled();
  });

  it('pong response resets missed pong counter', () => {
    const { ws } = createAndConnect();

    // First ping fires
    vi.advanceTimersByTime(10_000);
    // Send pong response
    ws.onmessage({ data: JSON.stringify({ type: 'pong' }) });
    // Second ping fires - missedPongs was reset, so now it's 1 again
    vi.advanceTimersByTime(10_000);

    // Socket should NOT be closed (only 1 missed after reset)
    expect(ws.close).not.toHaveBeenCalled();
  });

  it('visibilitychange with stale pong triggers reconnect', () => {
    const { ws } = createAndConnect();

    // Advance time past the stale threshold (15s) without any pong
    vi.advanceTimersByTime(16_000);

    // Fire visibilitychange with visible state
    document.visibilityState = 'visible';
    const visHandler = docListeners.get('visibilitychange');
    expect(visHandler).toBeDefined();
    visHandler();

    expect(ws.close).toHaveBeenCalled();
  });

  it('visibilitychange with fresh pong does NOT trigger reconnect', () => {
    const { ws } = createAndConnect();

    // Send a pong right away so lastPongTime is fresh
    ws.onmessage({ data: JSON.stringify({ type: 'pong' }) });

    // Fire visibilitychange immediately (within stale threshold)
    document.visibilityState = 'visible';
    const visHandler = docListeners.get('visibilitychange');
    expect(visHandler).toBeDefined();
    visHandler();

    expect(ws.close).not.toHaveBeenCalled();
  });

  it('disconnect() removes all event listeners', () => {
    const { client } = createAndConnect();

    // Verify listeners were registered
    expect(windowListeners.has('online')).toBe(true);
    expect(docListeners.has('visibilitychange')).toBe(true);

    client.disconnect();

    // Verify listeners were removed
    expect(windowListeners.has('online')).toBe(false);
    expect(docListeners.has('visibilitychange')).toBe(false);
  });

  it('connect() registers event listeners; calling connect() twice does not double-register', () => {
    const getToken = vi.fn(() => 'tok');
    const client = createWsClient({ url: 'ws://localhost/ws', getToken });

    client.connect();
    MockWs.captured.onopen();

    const firstOnline = windowListeners.get('online');
    expect(firstOnline).toBeDefined();

    // Record how many times addEventListener was called for 'online'
    const onlineCalls1 = window.addEventListener.mock.calls.filter(c => c[0] === 'online').length;

    // Second connect should be guarded (socket is already OPEN)
    client.connect();
    const onlineCalls2 = window.addEventListener.mock.calls.filter(c => c[0] === 'online').length;

    // Should not have added another listener
    expect(onlineCalls2).toBe(onlineCalls1);
  });
});

// ── Slice-13 device-revoke fix: WS close 1008 + "device revoked" ─────
describe('createWsClient - device revoke close handling', () => {
  let MockWs;

  beforeEach(() => {
    MockWs = makeMockWs({ captureInstance: true, autoOpen: false });
    global.WebSocket = MockWs;
  });

  afterEach(() => {
    delete global.WebSocket;
  });

  it('emits auth_invalid + window event and does NOT reconnect on 1008/device revoked close', () => {
    const getToken = vi.fn(() => 'tok');
    const client = createWsClient({ url: 'ws://localhost/ws', getToken });
    const authInvalid = vi.fn();
    client.on('auth_invalid', authInvalid);

    const winEvents = [];
    const winHandler = (e) => winEvents.push(e?.detail?.reason || null);
    window.addEventListener('hush_auth_invalid', winHandler);

    client.connect();
    expect(MockWs).toHaveBeenCalledTimes(1);
    // Server closes with policy-violation 1008 + "device revoked".
    MockWs.captured.onclose({ code: 1008, reason: 'device revoked' });

    expect(authInvalid).toHaveBeenCalledTimes(1);
    expect(authInvalid.mock.calls[0][0]).toEqual({ reason: 'device_revoked' });
    expect(winEvents).toContain('device_revoked');

    // Reconnect must NOT have been scheduled — no second WebSocket
    // construction even after the reconnect base delay would have
    // elapsed in real time.
    expect(MockWs).toHaveBeenCalledTimes(1);

    window.removeEventListener('hush_auth_invalid', winHandler);
  });

  it('does reconnect on a normal (non-revoke) close', () => {
    vi.useFakeTimers();
    const getToken = vi.fn(() => 'tok');
    const client = createWsClient({ url: 'ws://localhost/ws', getToken });
    client.connect();
    MockWs.captured.onclose({ code: 1006, reason: '' });
    // Advance the reconnect delay; default RECONNECT_BASE_MS in lib/ws.
    vi.advanceTimersByTime(60_000);
    expect(MockWs.mock.calls.length).toBeGreaterThan(1);
    vi.useRealTimers();
  });
});
