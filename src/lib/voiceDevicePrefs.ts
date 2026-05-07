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

function dbName(userId: string): string {
  if (!userId) throw new Error("voiceDevicePrefs: userId is required")
  return `${DB_NAME_PREFIX}${userId}`
}

function openDb(userId: string): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("voiceDevicePrefs: indexedDB unavailable"))
      return
    }
    const req = indexedDB.open(dbName(userId), DB_VERSION)
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
 * Read the saved voice device prefs for `userId`, or `null` when no
 * prejoin has ever been confirmed on this device.
 */
export async function readVoiceDevicePrefs(
  userId: string
): Promise<VoiceDevicePrefs | null> {
  const db = await openDb(userId)
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
 * after the IDB write succeeds so the active voice channel + the
 * settings panel stay in lockstep without each having to mount the
 * other or roll their own broadcast channel.
 */
export async function saveVoiceDevicePrefs(
  userId: string,
  prefs: Omit<VoiceDevicePrefs, "updatedAt">
): Promise<void> {
  const stamped: VoiceDevicePrefs = { ...prefs, updatedAt: Date.now() }
  const db = await openDb(userId)
  try {
    await writeRecord(db, stamped)
  } finally {
    db.close()
  }
  notifyVoiceDevicePrefs(userId, stamped)
}

/**
 * Wipe the device prefs record for `userId`. Used on logout and from
 * the device-switch popover when the user explicitly clears the
 * "don't ask again" choice.
 */
export async function clearVoiceDevicePrefs(userId: string): Promise<void> {
  const db = await openDb(userId)
  try {
    await deleteRecord(db)
  } finally {
    db.close()
  }
  notifyVoiceDevicePrefs(userId, null)
}

// ─── Pub/sub for in-process prefs changes ──────────────────

type VoiceDevicePrefsListener = (prefs: VoiceDevicePrefs | null) => void

const _voiceDevicePrefsListeners: Map<
  string,
  Set<VoiceDevicePrefsListener>
> = new Map()

function notifyVoiceDevicePrefs(
  userId: string,
  prefs: VoiceDevicePrefs | null
): void {
  const listeners = _voiceDevicePrefsListeners.get(userId)
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
 * Subscribe to in-process prefs changes for `userId`. Fires whenever
 * `saveVoiceDevicePrefs` or `clearVoiceDevicePrefs` succeeds, with
 * the new record (or `null` after a clear). Returns an unsubscribe
 * function.
 *
 * Used by `voice-channel-view` to live-apply device picks made in the
 * settings panel, and by the panel itself when changes originate from
 * the prejoin dialog or the in-call device popovers.
 */
export function subscribeVoiceDevicePrefs(
  userId: string,
  listener: VoiceDevicePrefsListener
): () => void {
  let bucket = _voiceDevicePrefsListeners.get(userId)
  if (!bucket) {
    bucket = new Set()
    _voiceDevicePrefsListeners.set(userId, bucket)
  }
  bucket.add(listener)
  return () => {
    bucket?.delete(listener)
    if (bucket && bucket.size === 0) {
      _voiceDevicePrefsListeners.delete(userId)
    }
  }
}

/**
 * `true` when prejoin should be skipped on the next join. Convenience
 * helper for components that only need the gating boolean.
 */
export async function shouldSkipPrejoin(userId: string): Promise<boolean> {
  const prefs = await readVoiceDevicePrefs(userId)
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
