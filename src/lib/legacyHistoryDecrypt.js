/**
 * Link-time legacy pre-decrypt.
 *
 * When a user links a new device, the link bundle includes the OLD device's
 * MLS history snapshot (credential + StorageProvider state). The new device's
 * runtime decrypt path will never use that snapshot — it operates against the
 * active store with the new device's freshly generated MLS identity, and the
 * snapshot DB exists only as a read-only fallback for purely read-only export
 * operations (guild metadata key derivation in `ServerLayout.jsx`).
 *
 * MLS application-message decryption is stateful: `processMessage` advances
 * the per-sender ratchet and writes back through the global StorageProvider
 * bridge. Pointing that bridge at the history DB during steady-state runtime
 * would race with concurrent active-store traffic and corrupt either DB.
 *
 * To recover old messages on the linked device without taking that risk, this
 * module runs a one-shot pre-decrypt during `completeDeviceLink`, while the
 * device is still in its serialized link/auth window with no WS subscriptions
 * and no other MLS work in flight. It walks every text channel the user is
 * still a member of, decrypts the historical messages with the OLD identity
 * inside `withReadWriteHistoryScope`, and writes the recovered plaintexts
 * (with `senderId`) into the active store's `localPlaintext` table. Chat then
 * picks them up via the existing `getCachedMessage` path on first render.
 *
 * The pre-decrypt is best-effort: any per-message, per-channel, or per-guild
 * failure is logged and skipped, and the link flow itself is not aborted on
 * pre-decrypt failure.
 */

import * as mlsStoreLib from './mlsStore';
import * as hushCryptoLib from './hushCrypto';
import * as apiLib from './api';

const PAGE_LIMIT = 100;
const MAX_CHANNELS_PER_GUILD = 200;

/**
 * Convert a base64 string to a Uint8Array.
 * @param {string} b64
 * @returns {Uint8Array}
 */
function base64ToBytes(b64) {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

/**
 * Page through the channel message endpoint until exhausted.
 * Returns messages newest-first as the API delivers them; the caller is
 * responsible for sorting chronologically before feeding the WASM ratchet.
 *
 * @param {object} api
 * @param {string} token
 * @param {string} serverId
 * @param {string} channelId
 * @param {string} baseUrl
 * @returns {Promise<Array<object>>}
 */
async function fetchAllMessages(api, token, serverId, channelId, baseUrl) {
  const all = [];
  let before = null;
  // Hard cap on iterations to avoid an unexpected runaway in case the server
  // returns paged results that never shrink.
  for (let i = 0; i < 200; i++) {
    const opts = { limit: PAGE_LIMIT };
    if (before) opts.before = before;
    const page = await api.getChannelMessages(token, serverId, channelId, opts, baseUrl);
    if (!Array.isArray(page) || page.length === 0) break;
    all.push(...page);
    if (page.length < PAGE_LIMIT) break;
    const oldest = page[page.length - 1];
    if (!oldest?.timestamp) break;
    before = oldest.timestamp;
  }
  return all;
}

/**
 * Enumerate the (guildId, channelId) pairs the user is currently a member of.
 *
 * @param {object} api
 * @param {string} token
 * @param {string} baseUrl
 * @returns {Promise<Array<{ guildId: string, channelId: string }>>}
 */
async function listTextChannels(api, token, baseUrl) {
  const out = [];
  let guilds;
  try {
    guilds = await api.getMyGuilds(token, baseUrl);
  } catch (err) {
    console.warn('[legacyHistoryDecrypt] getMyGuilds failed:', err);
    return out;
  }
  if (!Array.isArray(guilds)) return out;

  for (const guild of guilds) {
    if (!guild?.id) continue;
    let channels;
    try {
      channels = await api.getGuildChannels(token, guild.id, baseUrl);
    } catch (err) {
      console.warn('[legacyHistoryDecrypt] getGuildChannels failed for guild', guild.id, err);
      continue;
    }
    if (!Array.isArray(channels)) continue;
    let count = 0;
    for (const ch of channels) {
      if (!ch?.id || ch.type !== 'text') continue;
      out.push({ guildId: guild.id, channelId: ch.id });
      if (++count >= MAX_CHANNELS_PER_GUILD) break;
    }
  }
  return out;
}

/**
 * Decrypt a single historical message against the history DB state and write
 * the resulting plaintext into the active DB's localPlaintext cache.
 *
 * @returns {Promise<'decrypted'|'skipped'|'failed'>}
 */
async function preDecryptMessage({ msg, channelId, historyCredential, activeDb, mlsStore, hushCrypto }) {
  if (!msg?.id || !msg?.ciphertext) return 'skipped';

  // Skip if a plaintext already exists in the active cache (idempotency for
  // re-linked devices and for the OLD device's own self-sent plaintexts that
  // were copied as part of the snapshot's localPlaintext rows).
  const existing = await mlsStore.getLocalPlaintext(activeDb, msg.id).catch(() => null);
  if (existing?.plaintext) return 'skipped';

  let ciphertext;
  try {
    ciphertext = base64ToBytes(msg.ciphertext);
  } catch {
    return 'failed';
  }

  const channelIdBytes = new TextEncoder().encode(channelId);
  let result;
  try {
    result = await hushCrypto.processMessage(
      channelIdBytes,
      historyCredential.signingPrivateKey,
      historyCredential.signingPublicKey,
      historyCredential.credentialBytes,
      ciphertext,
    );
  } catch (err) {
    // Most common: "Group not found" because the OLD device was not in this
    // group at snapshot time, or "WrongEpoch" because the ratchet for that
    // generation has been pruned. Both are expected; just skip.
    return 'failed';
  }

  if (result?.type !== 'application' || result.plaintext == null) return 'skipped';

  const plaintext = (typeof result.plaintext === 'string')
    ? result.plaintext
    : new TextDecoder().decode(result.plaintext);
  const ts = msg.timestamp ? new Date(msg.timestamp).getTime() : Date.now();
  try {
    await mlsStore.setLocalPlaintext(activeDb, msg.id, {
      plaintext,
      senderId: msg.senderId ?? undefined,
      timestamp: ts,
    });
    return 'decrypted';
  } catch (err) {
    console.warn('[legacyHistoryDecrypt] setLocalPlaintext failed for', msg.id, err);
    return 'failed';
  }
}

/**
 * Iterate every text channel the user belongs to and pre-decrypt all
 * historical messages using the imported history identity, then cache the
 * resulting plaintexts in the active store.
 *
 * Best-effort: per-message, per-channel, and per-guild failures are logged
 * and skipped. The function is expected to never throw upward from the link
 * flow; the link should still complete on any failure.
 *
 * @param {{
 *   historyDb: IDBDatabase,
 *   activeUserId: string,
 *   deviceId: string,
 *   token: string,
 *   baseUrl?: string,
 *   _deps?: object,
 * }} args
 * @returns {Promise<{ channels: number, processed: number, decrypted: number, failed: number }>}
 */
export async function preDecryptLegacyHistory({
  historyDb,
  activeUserId,
  deviceId,
  token,
  baseUrl = '',
  _deps,
} = {}) {
  const mlsStore = _deps?.mlsStore ?? mlsStoreLib;
  const hushCrypto = _deps?.hushCrypto ?? hushCryptoLib;
  const api = _deps?.api ?? apiLib;

  const summary = { channels: 0, processed: 0, decrypted: 0, failed: 0 };

  if (!historyDb || !activeUserId || !deviceId || !token) return summary;

  const historyCredential = await mlsStore.getCredential(historyDb).catch(() => null);
  if (!historyCredential) {
    console.warn('[legacyHistoryDecrypt] no history credential present; skipping pre-decrypt');
    return summary;
  }

  // Make sure the active store is open and the bridge is currently bound to
  // it before we save and swap. openStore is idempotent for the same DB.
  //
  // Intentionally keep this handle open after the pre-decrypt completes. The
  // saved bridge captured by withReadWriteHistoryScope closes over this DB
  // handle, so eagerly closing it here would restore a bridge that points at
  // a closed database until the next openStore() call rebinds it.
  let activeDb;
  try {
    activeDb = await mlsStore.openStore(activeUserId, deviceId);
  } catch (err) {
    console.warn('[legacyHistoryDecrypt] openStore(active) failed; aborting pre-decrypt:', err);
    return summary;
  }

  // Channel enumeration runs OUTSIDE the history scope so it doesn't interfere
  // with bridge state and so transient API errors don't leak into the scope.
  const channels = await listTextChannels(api, token, baseUrl);
  summary.channels = channels.length;
  if (channels.length === 0) {
    return summary;
  }

  // Fetch all message lists OUTSIDE the history scope as well — pure REST,
  // no MLS state involved — so the scope holds the bridge for the minimum
  // possible duration.
  const channelMessages = [];
  for (const { guildId, channelId } of channels) {
    let list;
    try {
      list = await fetchAllMessages(api, token, guildId, channelId, baseUrl);
    } catch (err) {
      console.warn('[legacyHistoryDecrypt] fetchAllMessages failed for', channelId, err);
      continue;
    }
    if (!list?.length) continue;
    // Sort chronologically (oldest first). Required so the per-sender ratchet
    // is fed in the order the WASM expects.
    list.sort((a, b) => {
      const at = a?.timestamp ? new Date(a.timestamp).getTime() : 0;
      const bt = b?.timestamp ? new Date(b.timestamp).getTime() : 0;
      return at - bt;
    });
    channelMessages.push({ channelId, messages: list });
  }

  if (channelMessages.length === 0) {
    return summary;
  }

  await mlsStore.withReadWriteHistoryScope(historyDb, async () => {
    for (const { channelId, messages } of channelMessages) {
      for (const msg of messages) {
        summary.processed++;
        const outcome = await preDecryptMessage({
          msg,
          channelId,
          historyCredential,
          activeDb,
          mlsStore,
          hushCrypto,
        });
        if (outcome === 'decrypted') summary.decrypted++;
        else if (outcome === 'failed') summary.failed++;
      }
    }
  }).catch((err) => {
    console.warn('[legacyHistoryDecrypt] pre-decrypt scope failed:', err);
  });

  return summary;
}
