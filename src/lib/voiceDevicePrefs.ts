/**
 * Per-user voice device preferences.
 *
 * Voice channels in hush historically auto-joined and prompted for the
 * mic / webcam through a list-only modal on first publish. The new shell
 * adopts a Zoom/Meet-style prejoin dialog (camera preview + device
 * selects + toggles) for the *first* entry into a voice channel; after
 * the user confirms, their selection plus a "don't ask again" flag is
 * persisted here so subsequent joins skip the prejoin and connect
 * immediately with the saved devices.
 *
 * Storage:
 * - IndexedDB scoped per `userId` (`hush-voice-device-prefs-{userId}`).
 *   Survives reload / browser close. Cleared on logout via
 *   `clearVoiceDevicePrefs(userId)`.
 *
 * Desktop note: Electron's chromium IDB satisfies this contract today.
 * If a future native bridge wants to migrate the record into the
 * desktop keychain it can call `readVoiceDevicePrefs` once and persist
 * the result on its side; the module is intentionally pure data so a
 * bridge swap is a one-line change.
 */

const DB_NAME_PREFIX = "hush-voice-device-prefs-"
const DB_VERSION = 1
const STORE_NAME = "prefs"
const RECORD_KEY = "current"

/**
 * User-confirmed device selection for voice channels.
 *
 * `audioDeviceId` / `videoDeviceId` may be `null` when the user opted
 * the input out at prejoin time (e.g. joined with camera off). The
 * matching `*Enabled` flag is the source of truth for whether the
 * track should be published on join.
 *
 * `dontAskAgain` is a one-way switch flipped by the prejoin checkbox.
 * Once `true`, the prejoin dialog is suppressed for the same user on
 * the same device; the user can flip it back via the device-switch
 * popover (chevron next to mic / webcam in the controls bar).
 */
export interface VoiceDevicePrefs {
  audioDeviceId: string | null
  videoDeviceId: string | null
  /** Optional output sink id (HTMLMediaElement.setSinkId). Only meaningful
   *  on Chromium-based desktop browsers + Electron; ignored elsewhere. */
  outputDeviceId?: string | null
  audioEnabled: boolean
  videoEnabled: boolean
  dontAskAgain: boolean
  updatedAt: number
}

/**
 * Normalize an instance scope to its origin so prefs persisted under
 * a path/trailing-slash form land in the same scope bucket. Returns
 * `null` when the scope is empty/invalid; the caller then falls back
 * to legacy unscoped storage.
 */
function normalizeScope(scope?: string | null): string | null {
  if (!scope) return null
  try {
    return new URL(scope).origin
  } catch {
    return null
  }
}

/**
 * Encode an origin into an IDB-database-name-safe segment. The IDB
 * spec accepts any DOMString, but `://` and other URL punctuation
 * make admin tooling and Electron's chromium devtools harder to read.
 * `encodeURIComponent` is reversible and stable, which is enough.
 */
function encodeScopeForDbName(origin: string): string {
  return encodeURIComponent(origin)
}

function dbName(userId: string, scope?: string | null): string {
  if (!userId) throw new Error("voiceDevicePrefs: userId is required")
  const normalized = normalizeScope(scope)
  if (!normalized) return `${DB_NAME_PREFIX}${userId}`
  return `${DB_NAME_PREFIX}${userId}__${encodeScopeForDbName(normalized)}`
}

/** Listener bucket key. Mirrors `dbName` so listeners and storage stay aligned. */
function listenerKey(userId: string, scope?: string | null): string {
  const normalized = normalizeScope(scope)
  return normalized ? `${userId}__${normalized}` : userId
}

function openDb(userId: string, scope?: string | null): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("voiceDevicePrefs: indexedDB unavailable"))
      return
    }
    const req = indexedDB.open(dbName(userId, scope), DB_VERSION)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME)
      }
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

function readRecord(db: IDBDatabase): Promise<VoiceDevicePrefs | null> {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly")
    const store = tx.objectStore(STORE_NAME)
    const req = store.get(RECORD_KEY)
    let value: VoiceDevicePrefs | null = null
    req.onsuccess = () => {
      value = (req.result as VoiceDevicePrefs | undefined) ?? null
    }
    tx.oncomplete = () => resolve(value)
    tx.onerror = () => reject(tx.error)
    tx.onabort = () => reject(tx.error)
  })
}

function writeRecord(
  db: IDBDatabase,
  prefs: VoiceDevicePrefs
): Promise<void> {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite")
    const store = tx.objectStore(STORE_NAME)
    store.put(prefs, RECORD_KEY)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
    tx.onabort = () => reject(tx.error)
  })
}

function deleteRecord(db: IDBDatabase): Promise<void> {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite")
    tx.objectStore(STORE_NAME).delete(RECORD_KEY)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
    tx.onabort = () => reject(tx.error)
  })
}

/**
 * Read the saved voice device prefs for `userId`, optionally scoped
 * to an instance origin (`scope`). Returns `null` when no prejoin has
 * ever been confirmed for that user/scope.
 *
 * CORE-INVARIANTS - "Voice Rooms and LiveKit" + "Instance boundaries
 * must never leak credentials": prejoin choices like `dontAskAgain`
 * and auto-publish are per-origin and must not bleed across
 * instances even when the same `userId` exists on both.
 */
export async function readVoiceDevicePrefs(
  userId: string,
  scope?: string | null
): Promise<VoiceDevicePrefs | null> {
  const db = await openDb(userId, scope)
  try {
    return await readRecord(db)
  } finally {
    db.close()
  }
}

/**
 * Persist the user's prejoin selection. Always stamps `updatedAt` to
 * `Date.now()` so callers do not need to fill it in.
 *
 * Notifies in-process subscribers (see `subscribeVoiceDevicePrefs`)
 * after the IDB write succeeds. Subscribers are keyed by
 * `userId + normalized scope`, so a save for one instance does not
 * wake listeners attached to another instance.
 */
export async function saveVoiceDevicePrefs(
  userId: string,
  prefs: Omit<VoiceDevicePrefs, "updatedAt">,
  scope?: string | null
): Promise<void> {
  const stamped: VoiceDevicePrefs = { ...prefs, updatedAt: Date.now() }
  const db = await openDb(userId, scope)
  try {
    await writeRecord(db, stamped)
  } finally {
    db.close()
  }
  notifyVoiceDevicePrefs(userId, stamped, scope)
}

/**
 * Wipe the device prefs record for `userId`+`scope`. Used on logout
 * and from the device-switch popover when the user explicitly clears
 * the "don't ask again" choice.
 */
export async function clearVoiceDevicePrefs(
  userId: string,
  scope?: string | null
): Promise<void> {
  const db = await openDb(userId, scope)
  try {
    await deleteRecord(db)
  } finally {
    db.close()
  }
  notifyVoiceDevicePrefs(userId, null, scope)
}

// ─── Pub/sub for in-process prefs changes ──────────────────

type VoiceDevicePrefsListener = (prefs: VoiceDevicePrefs | null) => void

const _voiceDevicePrefsListeners: Map<
  string,
  Set<VoiceDevicePrefsListener>
> = new Map()

function notifyVoiceDevicePrefs(
  userId: string,
  prefs: VoiceDevicePrefs | null,
  scope?: string | null
): void {
  const key = listenerKey(userId, scope)
  const listeners = _voiceDevicePrefsListeners.get(key)
  if (!listeners) return
  for (const listener of listeners) {
    try {
      listener(prefs)
    } catch (err) {
      // Listener errors must not break the persistence pipeline.
      console.warn("[voiceDevicePrefs] listener threw:", err)
    }
  }
}

/**
 * Subscribe to in-process prefs changes for `userId`+`scope`. Fires
 * whenever `saveVoiceDevicePrefs` or `clearVoiceDevicePrefs` succeeds
 * for the same scope, with the new record (or `null` after a clear).
 * Returns an unsubscribe function.
 *
 * Used by `voice-channel-view` to live-apply device picks made in the
 * settings panel, and by the panel itself when changes originate from
 * the prejoin dialog or the in-call device popovers.
 */
export function subscribeVoiceDevicePrefs(
  userId: string,
  listener: VoiceDevicePrefsListener,
  scope?: string | null
): () => void {
  const key = listenerKey(userId, scope)
  let bucket = _voiceDevicePrefsListeners.get(key)
  if (!bucket) {
    bucket = new Set()
    _voiceDevicePrefsListeners.set(key, bucket)
  }
  bucket.add(listener)
  return () => {
    bucket?.delete(listener)
    if (bucket && bucket.size === 0) {
      _voiceDevicePrefsListeners.delete(key)
    }
  }
}

/**
 * `true` when prejoin should be skipped on the next join, scoped to
 * the optional instance origin. Convenience helper for components
 * that only need the gating boolean.
 */
export async function shouldSkipPrejoin(
  userId: string,
  scope?: string | null
): Promise<boolean> {
  const prefs = await readVoiceDevicePrefs(userId, scope)
  return prefs?.dontAskAgain === true
}

/**
 * Plan computed from a prefs delta so the active voice room knows
 * which mic / cam / output to re-apply when prefs change while the
 * user is already in a channel. Pure function so it is unit-testable
 * without mounting the voice channel view.
 *
 * Returns flags for each device whose pref no longer matches the
 * last-applied baseline. `null` = system default; "skip" means the
 * caller already applied this device imperatively (e.g. via the
 * in-call picker handlers) and stamped the baseline before persist.
 */
export interface DeviceApplyPlan {
  audio: { changed: boolean; nextDeviceId: string | null }
  video: { changed: boolean; nextDeviceId: string | null }
  output: { changed: boolean; nextDeviceId: string | null }
}

export function computeDeviceApplyPlan(
  baseline: {
    audio: string | null
    video: string | null
    output: string | null
  },
  next: VoiceDevicePrefs
): DeviceApplyPlan {
  const nextAudio = next.audioDeviceId ?? null
  const nextVideo = next.videoDeviceId ?? null
  const nextOutput = next.outputDeviceId ?? null
  return {
    audio: {
      changed: baseline.audio !== nextAudio,
      nextDeviceId: nextAudio,
    },
    video: {
      changed: baseline.video !== nextVideo,
      nextDeviceId: nextVideo,
    },
    output: {
      changed: baseline.output !== nextOutput,
      nextDeviceId: nextOutput,
    },
  }
}

/**
 * Default values applied to every VoiceDevicePrefs field that the
 * caller did not explicitly carry forward. Single source of truth so
 * a new field added to the schema cannot be silently dropped by an
 * existing writer.
 */
const PREFS_DEFAULTS: Omit<VoiceDevicePrefs, "updatedAt"> = {
  audioDeviceId: null,
  videoDeviceId: null,
  outputDeviceId: null,
  audioEnabled: true,
  videoEnabled: false,
  dontAskAgain: false,
}

/**
 * Merge a partial patch onto an existing prefs record (or the
 * defaults if `prev` is null) and stamp `updatedAt`. Use this in
 * every writer instead of constructing a fresh literal — adding a
 * field to `VoiceDevicePrefs` then only requires updating
 * `PREFS_DEFAULTS`, and existing writers automatically preserve it.
 */
export function mergeVoiceDevicePrefs(
  prev: VoiceDevicePrefs | null,
  patch: Partial<Omit<VoiceDevicePrefs, "updatedAt">>
): VoiceDevicePrefs {
  return {
    ...PREFS_DEFAULTS,
    ...prev,
    ...patch,
    updatedAt: Date.now(),
  }
}
