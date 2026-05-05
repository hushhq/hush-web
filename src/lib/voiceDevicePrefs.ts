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
 */
export async function saveVoiceDevicePrefs(
  userId: string,
  prefs: Omit<VoiceDevicePrefs, "updatedAt">
): Promise<void> {
  const db = await openDb(userId)
  try {
    await writeRecord(db, { ...prefs, updatedAt: Date.now() })
  } finally {
    db.close()
  }
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
}

/**
 * `true` when prejoin should be skipped on the next join. Convenience
 * helper for components that only need the gating boolean.
 */
export async function shouldSkipPrejoin(userId: string): Promise<boolean> {
  const prefs = await readVoiceDevicePrefs(userId)
  return prefs?.dontAskAgain === true
}
