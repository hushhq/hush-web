/**
 * Per-channel serialised queue for stateful MLS group operations.
 *
 * Background
 * ----------
 *
 * Several code paths in hush-web mutate a channel's MLS group state via
 * `processMessage`/`createMessage`/`mergePendingCommit`:
 *
 *   - `mls.commit` WebSocket events from the server (commit replay)
 *   - `mls.add_request` WebSocket events (member add/remove)
 *   - `mlsGroup.catchupCommits` from any caller
 *   - `Chat.encryptForChannel` (calls `catchupCommits` before send)
 *   - `Chat.decryptFromChannel`'s retry-after-catchup path on decrypt failure
 *   - `joinMissingGroups` post-mount catch-up
 *   - the self-update timer
 *
 * All of these read+write the same per-channel state through the shared
 * `window.mlsStorageBridge`. Because each of these awaits network and IDB
 * I/O, two invocations for the same channel can interleave their reads and
 * writes. The observed symptom was `WrongEpoch` / `InvalidSignature` /
 * `AeadError` on a freshly joined client when User A's commits arrive
 * back-to-back: handler N reads epoch=1, handler N+1 reads epoch=1, both
 * call `processCommit`, the second one runs against a group state that
 * the first one already advanced.
 *
 * Mitigation
 * ----------
 *
 * Every boundary call site that performs a stateful MLS group op routes
 * through `withChannelMLSMutex(key, fn)`. The helper keeps a per-key
 * tail Promise chain: each new `fn` runs after the previous one in the
 * same key resolves (success or failure). Different keys run in parallel,
 * preserving cross-channel concurrency.
 *
 * Key conventions
 * ---------------
 *
 *   text:${channelId}        - text channel MLS group
 *   voice:${channelId}       - voice channel MLS group
 *   guild-meta:${guildId}    - guild metadata MLS group
 *
 * Entry/exit invariants
 * ---------------------
 *
 *   - Internal calls within an already-held mutex MUST NOT re-enter the
 *     same mutex via this helper, or they will deadlock. The convention is
 *     that mlsGroup.js exports remain single-stateful-op functions and
 *     boundary callers (ServerLayout WS handlers, useMLS) hold the mutex
 *     across their whole logical operation.
 */

const _tails = new Map();

/**
 * Run `fn` after any previously-queued operation for the given key has
 * settled. Returns the value (or rethrows the error) produced by `fn`.
 *
 * The internal tail is updated to chain off the boxed continuation so a
 * later caller can sequence behind us. The map entry is removed when this
 * call's continuation resolves AND it is still the registered tail (so a
 * later concurrent enqueue keeps its own tail).
 *
 * @template T
 * @param {string} key
 * @param {() => Promise<T>} fn
 * @returns {Promise<T>}
 */
export function withChannelMLSMutex(key, fn) {
  const prev = _tails.get(key) ?? Promise.resolve();
  const result = prev.catch(() => undefined).then(fn);
  const tail = result.catch(() => undefined).then(() => {
    if (_tails.get(key) === tail) _tails.delete(key);
  });
  _tails.set(key, tail);
  return result;
}

/**
 * Returns the current number of queued + in-flight operations registered
 * for the given key (always 0 or 1 in practice — entries are removed
 * after the chain drains). Exposed for tests.
 *
 * @param {string} key
 * @returns {number}
 */
export function _hasPendingChannelMLSMutex(key) {
  return _tails.has(key) ? 1 : 0;
}

/**
 * Drop all queued/tail entries. Exposed for tests so they can isolate.
 * Production code should not call this.
 */
export function _resetChannelMLSMutexForTests() {
  _tails.clear();
}

/**
 * Convenience: produce the canonical mutex key for a text channel.
 * @param {string} channelId
 */
export function textChannelKey(channelId) {
  return `text:${channelId}`;
}

/**
 * Convenience: produce the canonical mutex key for a voice channel.
 * @param {string} channelId
 */
export function voiceChannelKey(channelId) {
  return `voice:${channelId}`;
}

/**
 * Convenience: produce the canonical mutex key for a guild metadata group.
 * @param {string} guildId
 */
export function guildMetadataKey(guildId) {
  return `guild-meta:${guildId}`;
}
