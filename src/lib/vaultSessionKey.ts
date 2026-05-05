/**
 * Per-user session-bound wrapping key for the identity vault.
 *
 * The wrapping key derived from a user's PIN (in `useAuth`) lives in
 * JS heap only; without further machinery, every full-page reload
 * re-locks the vault by construction (see `docs/security/
 * vault-session-key.md` and the comment block at
 * `src/hooks/useAuth.js:663`). This module restores meaningful
 * cross-reload semantics for the four vault-timeout policies
 * (`browser_close`, `refresh`, numeric, `never`) by holding a
 * **non-extractable** AES-GCM wrapping key in IndexedDB:
 *
 * 1. The CryptoKey is generated with `extractable: false`. Its
 *    raw bytes never enter JS — only the WebCrypto API can use it,
 *    even when called from a same-origin XSS payload, and it cannot
 *    be exfiltrated cross-device.
 * 2. The CryptoKey is persisted via IDB structured clone. The W3C
 *    spec preserves the non-extractable property across persistence,
 *    so reloading the tab and re-reading the entry yields a key that
 *    is still locked behind the WebCrypto boundary.
 * 3. Lifecycle is gated by:
 *    - The vault timeout policy (`never` / `browser_close` / `refresh`
 *      / numeric).
 *    - A per-tab `sessionStorage` alive marker
 *      (`hush_vault_session_alive_${userId}`). The marker tells a
 *      booting tab "you are reloading inside an open browser session"
 *      vs "you are a fresh tab".
 *    - For `browser_close`, a future BroadcastChannel-based refcount
 *      (wired in a later phase step) decides whether the closing tab
 *      is the last one. This module ships the IDB / marker / clear
 *      primitives only — refcount lifecycle wiring belongs in
 *      `useAuth`.
 *
 * Crucially, this module never reintroduces the ans23/F3 anti-pattern
 * of storing raw key bytes in browser storage. The marker carries no
 * key material; the IDB record carries a CryptoKey whose bytes are
 * unreachable from JS.
 */

/** Vault timeout policy, mirrored from `useAuth.applyVaultTimeout`. */
export type VaultTimeoutPolicy =
  | "never"
  | "browser_close"
  | "refresh"
  | number

/** AES-GCM ciphertext bundle produced by `wrapIdentity`. */
export interface WrappedIdentity {
  iv: Uint8Array
  ciphertext: Uint8Array
}

/** IDB record shape stored under the session DB. */
interface SessionRecord {
  cryptoKey: CryptoKey
  wrapped?: WrappedIdentity | null
  createdAt: number
}

const DB_NAME_PREFIX = "hush-vault-session-"
const STORE_NAME = "session"
const RECORD_KEY = "current"
const MARKER_KEY_PREFIX = "hush_vault_session_alive_"
const KEY_USAGE: KeyUsage[] = ["encrypt", "decrypt"]
const KEY_ALGORITHM = { name: "AES-GCM", length: 256 } as const
const IV_BYTES = 12

// ─── Public API ────────────────────────────────────────────────────────────

/**
 * Returns the persisted session CryptoKey for the user, generating one
 * lazily if no record exists. Idempotent: repeated calls inside the
 * same tab return the same key reference (modulo IDB round-trip
 * identity, which is structurally equivalent for cipher purposes).
 *
 * Caller is expected to invoke `markAlive(userId)` after a successful
 * unlock; this function does **not** touch the alive marker.
 */
export async function ensureSessionKey(userId: string): Promise<CryptoKey> {
  if (!userId) throw new Error("userId required")
  const db = await openSessionDb(userId)
  try {
    const existing = await readRecord(db)
    if (existing?.cryptoKey) return existing.cryptoKey
    const fresh = await crypto.subtle.generateKey(
      KEY_ALGORITHM,
      false,
      KEY_USAGE
    )
    await writeRecord(db, {
      cryptoKey: fresh,
      wrapped: null,
      createdAt: Date.now(),
    })
    return fresh
  } finally {
    db.close()
  }
}

/**
 * Returns the persisted session CryptoKey only when the policy permits
 * resuming an unlocked vault on this boot. Returns `null` when:
 *
 * - No IDB record exists.
 * - Policy is `refresh` (always wipes on reload).
 * - Policy is `browser_close` and the alive marker is missing AND the
 *   caller has determined no other tab of this user is alive (the
 *   refcount check lives in `useAuth`; this function does not own
 *   BroadcastChannel state).
 *
 * Callers in `useAuth` will:
 *
 * - For `never`: always pass `aliveTabExists: true` (or omit) — the
 *   record is reused regardless of marker.
 * - For `browser_close`: pass `aliveTabExists` reflecting the
 *   refcount probe.
 * - For `refresh`: do not call this function (or honour the `null`
 *   response and call `clearSessionKey`).
 * - For numeric: gate on the inactivity deadline outside this module.
 */
export async function getSessionKeyIfAlive(
  userId: string,
  policy: VaultTimeoutPolicy,
  options?: { aliveTabExists?: boolean }
): Promise<CryptoKey | null> {
  if (!userId) return null
  if (policy === "refresh") return null

  const db = await openSessionDb(userId)
  try {
    const existing = await readRecord(db)
    if (!existing?.cryptoKey) return null

    if (policy === "never") {
      return existing.cryptoKey
    }
    if (policy === "browser_close") {
      const markerAlive = isMarkerAlive(userId)
      const otherTabAlive = options?.aliveTabExists === true
      if (!markerAlive && !otherTabAlive) {
        return null
      }
      return existing.cryptoKey
    }
    if (typeof policy === "number") {
      // The inactivity deadline is owned by useAuth — defer to caller.
      return existing.cryptoKey
    }
    return null
  } finally {
    db.close()
  }
}

/**
 * Persists the wrapped identity bundle alongside the session CryptoKey.
 * The plaintext identity material never leaves the calling tab — the
 * caller passes `wrapIdentity` output here.
 */
export async function persistWrappedIdentity(
  userId: string,
  wrapped: WrappedIdentity
): Promise<void> {
  if (!userId) throw new Error("userId required")
  const db = await openSessionDb(userId)
  try {
    const existing = await readRecord(db)
    if (!existing?.cryptoKey) {
      throw new Error("session key missing — call ensureSessionKey first")
    }
    await writeRecord(db, {
      cryptoKey: existing.cryptoKey,
      wrapped: { iv: wrapped.iv, ciphertext: wrapped.ciphertext },
      createdAt: existing.createdAt,
    })
  } finally {
    db.close()
  }
}

/**
 * Returns the wrapped identity bundle previously persisted via
 * `persistWrappedIdentity`, or `null` when none has been written yet.
 * The caller is responsible for unwrapping via `unwrapIdentity` and
 * for honouring the policy (use `getSessionKeyIfAlive` first).
 */
export async function readWrappedIdentity(
  userId: string
): Promise<WrappedIdentity | null> {
  if (!userId) return null
  const db = await openSessionDb(userId)
  try {
    const existing = await readRecord(db)
    if (!existing?.wrapped) return null
    return {
      iv: existing.wrapped.iv,
      ciphertext: existing.wrapped.ciphertext,
    }
  } finally {
    db.close()
  }
}

/**
 * Wipes the IDB record and the per-tab alive marker. Called by:
 *
 * - `lockVault` / `lockVaultForTimeout`.
 * - Scorched-earth logout.
 * - PIN change flow.
 * - Last-tab-out under `browser_close`.
 * - Boot under `refresh`.
 */
export async function clearSessionKey(userId: string): Promise<void> {
  if (!userId) return
  clearMarker(userId)
  await new Promise<void>((resolve, reject) => {
    const req = indexedDB.deleteDatabase(`${DB_NAME_PREFIX}${userId}`)
    req.onsuccess = () => resolve()
    req.onerror = () => reject(req.error ?? new Error("deleteDatabase failed"))
    req.onblocked = () => resolve() // best effort — caller will retry on next boot
  })
}

/**
 * Encrypts the in-memory identity material under the session CryptoKey.
 * Each call uses a fresh random IV; the resulting bundle is suitable
 * for passing to `persistWrappedIdentity`.
 */
export async function wrapIdentity(
  key: CryptoKey,
  identity: Uint8Array
): Promise<WrappedIdentity> {
  const iv = crypto.getRandomValues(new Uint8Array(IV_BYTES))
  const ciphertext = new Uint8Array(
    await crypto.subtle.encrypt(
      { name: "AES-GCM", iv: iv as BufferSource },
      key,
      identity as BufferSource
    )
  )
  return { iv, ciphertext }
}

/**
 * Reverses `wrapIdentity`. Throws when the AES-GCM auth tag fails to
 * verify (tampered ciphertext or mismatched key).
 */
export async function unwrapIdentity(
  key: CryptoKey,
  bundle: WrappedIdentity
): Promise<Uint8Array> {
  const plaintext = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: bundle.iv as BufferSource },
    key,
    bundle.ciphertext as BufferSource
  )
  return new Uint8Array(plaintext)
}

// ─── Per-tab alive marker ──────────────────────────────────────────────────

/**
 * Sets the per-tab `sessionStorage` alive marker. Should be called
 * after a successful unlock so subsequent soft refreshes of the same
 * tab can resume without prompting for PIN under `browser_close`.
 */
export function markAlive(userId: string): void {
  if (!userId) return
  if (typeof sessionStorage === "undefined") return
  try {
    sessionStorage.setItem(`${MARKER_KEY_PREFIX}${userId}`, "1")
  } catch {
    // Storage quota / private mode — degrade silently. Caller is
    // ultimately gated on the IDB record, not the marker, for `never`.
  }
}

/**
 * Removes the per-tab alive marker. Called from `clearSessionKey` and
 * from the `pagehide` lifecycle hook in `useAuth`.
 */
export function clearMarker(userId: string): void {
  if (!userId) return
  if (typeof sessionStorage === "undefined") return
  try {
    sessionStorage.removeItem(`${MARKER_KEY_PREFIX}${userId}`)
  } catch {
    // ignore
  }
}

/** True when the per-tab alive marker is set for the given user. */
export function isMarkerAlive(userId: string): boolean {
  if (!userId) return false
  if (typeof sessionStorage === "undefined") return false
  try {
    return sessionStorage.getItem(`${MARKER_KEY_PREFIX}${userId}`) === "1"
  } catch {
    return false
  }
}

// ─── IndexedDB helpers ─────────────────────────────────────────────────────

function openSessionDb(userId: string): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(`${DB_NAME_PREFIX}${userId}`, 1)
    req.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME)
      }
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error ?? new Error("openSessionDb failed"))
  })
}

function readRecord(db: IDBDatabase): Promise<SessionRecord | null> {
  return new Promise((resolve, reject) => {
    let tx: IDBTransaction
    try {
      tx = db.transaction(STORE_NAME, "readonly")
    } catch (err) {
      reject(err instanceof Error ? err : new Error(String(err)))
      return
    }
    const req = tx.objectStore(STORE_NAME).get(RECORD_KEY)
    req.onsuccess = () => resolve((req.result as SessionRecord | undefined) ?? null)
    req.onerror = () => reject(req.error ?? new Error("readRecord failed"))
  })
}

function writeRecord(db: IDBDatabase, record: SessionRecord): Promise<void> {
  return new Promise((resolve, reject) => {
    let tx: IDBTransaction
    try {
      tx = db.transaction(STORE_NAME, "readwrite")
    } catch (err) {
      reject(err instanceof Error ? err : new Error(String(err)))
      return
    }
    const req = tx.objectStore(STORE_NAME).put(record, RECORD_KEY)
    req.onsuccess = () => resolve()
    req.onerror = () => reject(req.error ?? new Error("writeRecord failed"))
  })
}
