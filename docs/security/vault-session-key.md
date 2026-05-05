# Vault Session Key — cross-reload unlocked vault

| | |
|-|-|
| Status | Design draft (awaiting threat-model sign-off) |
| Phase tag | P21 |
| Suggested branch | `feature/vault-session-key` |
| Supersedes the visible-behaviour gap left by | ans23 / F3 |
| Author / date | 2026-05-05 |

## Intent

Restore meaningful semantics for the four vault-timeout policies
(`browser_close`, `refresh`, numeric idle, `never`) so they actually
differ in observable behaviour. Today, post-ans23/F3, the wrapping key
is held in plain JS heap memory only — every full-page reload re-locks
the vault by construction, regardless of policy. The Security panel
exposes the policies (`src/components/user-settings-dialog.tsx`) but
they collapse to a single behaviour at the first reload.

The user-visible problem this surfaces on:
- Mobile browsers reload backgrounded tabs aggressively. A user with
  the default `browser_close` policy gets a PIN prompt every time the
  OS reaps and reloads the page — in direct contradiction of what the
  label promises.

This phase introduces a **session-bound, non-extractable wrapping key**
held in IndexedDB so the unlocked vault can survive page reloads
without ever exposing raw key material to JS. Each policy gates
whether the IDB record is reused or wiped at boot.

## Non-goals

- Re-introduce the ans23/F3 sessionStorage `hush_vault_derived_key`
  pattern. Plain bytes in storage stay forbidden.
- Change PIN/passphrase strength or attempt counters.
- Touch the at-rest identity vault format itself
  (`src/lib/identityVault.js`). The wrapping key derived from PIN is
  the only thing this phase persists differently.
- Federated/cross-device session sync. The session key is per-tab,
  per-origin, never leaves the device.
- Multi-tab session sharing. Each tab boots its own session marker;
  signing out in one tab still has to broadcast lock to the others
  (already in place via `BroadcastChannel`).

## Read first

```bash
ans23.md   # if present — search the codebase comments for "ans23 / F3" rationale
src/hooks/useAuth.js              # vault state machine + applyVaultTimeout
src/hooks/useAuth.test.jsx        # ans23/F3 contract test (line ~854)
src/lib/identityVault.js          # vault config + at-rest blob shape
src/components/user-settings-dialog.tsx   # SecurityPanel (P-prev)
```

Re-read the comments at:

- `src/hooks/useAuth.js:663-667` (the architectural trade-off this
  phase walks back, with stronger primitives).
- `src/hooks/useAuth.js:1161` (`derived wrapping key is NOT persisted
  to browser storage`).
- `src/hooks/useAuth.js:1621` (purges leftover legacy keys).

These three call-sites must each get an updated comment in this phase.

## Threat model (must be signed off before code lands)

The decision unlocked here is: *we accept that an unlocked vault key
remains usable to same-origin code while a tab is alive, in exchange
for not asking the user for their PIN on every reload.* The key
material itself is never readable by JS — only the WebCrypto API can
use it. Compared to the pre-ans23 state (raw bytes in
sessionStorage), this is strictly stronger.

| Vector | Pre-ans23 | Today (post-ans23) | After this phase |
|-|-|-|-|
| XSS reads wrapping-key bytes | YES (sessionStorage plaintext) | No (in-memory only, dies on reload) | No (non-extractable CryptoKey, never readable) |
| XSS uses wrapping key while tab open | YES (subtle.decrypt) | YES (subtle.decrypt) | YES (subtle.decrypt) |
| Cross-origin script reads key | No | No | No |
| Key survives full reload | YES (sessionStorage) | No | YES, gated by per-tab session marker |
| Key survives tab close | YES (sessionStorage dies w/ tab) | No | No (sessionStorage marker dies) |
| Key survives browser close | No | No | No (sessionStorage dies) |
| Key survives device wipe of IDB | No | No | No (vault config gone — re-derive on next unlock anyway) |
| Stale key after PIN change | n/a | n/a | No — PIN change rotates IDB entry |

The remaining "XSS uses key while tab open" row is the same risk
window as today — the moment a vault is unlocked, the in-memory key
is usable. A non-extractable CryptoKey **cannot** be exfiltrated, so
even a successful XSS cannot steal credentials usable on another
device. This phase does not regress that property.

## Module shape

New file `src/lib/vaultSessionKey.ts`. Public API only — no internal
state escapes:

```ts
/**
 * Generates and stores a non-extractable AES-GCM wrapping key in
 * IndexedDB, returning a CryptoKey reference. Subsequent calls in the
 * same browser session (gated by sessionStorage alive marker) return
 * the same key. After tab close the marker dies and the next call
 * generates a fresh key.
 */
export async function ensureSessionKey(userId: string): Promise<CryptoKey>;

/**
 * Returns the stored CryptoKey if and only if the per-tab alive
 * marker is present. Returns null when the marker is missing
 * (fresh tab, browser close, hard refresh under "refresh" policy).
 */
export async function getSessionKeyIfAlive(userId: string): Promise<CryptoKey | null>;

/**
 * Wipes the IDB entry and the alive marker. Called on:
 * - PIN change (rotation).
 * - Sign-out / scorched-earth logout.
 * - Vault timeout fires (numeric policy).
 * - Boot when policy is "refresh" or "browser_close" + marker missing.
 */
export async function clearSessionKey(userId: string): Promise<void>;

/**
 * Wraps the in-memory identity material under the session key,
 * returns the ciphertext bundle to persist alongside the IDB entry.
 * The plaintext identity material never leaves the unlocked tab.
 */
export async function wrapIdentity(
  key: CryptoKey,
  identity: Uint8Array,
): Promise<{ iv: Uint8Array; ciphertext: Uint8Array }>;

/**
 * Reverse of wrapIdentity. Throws on tampering (AES-GCM auth tag).
 */
export async function unwrapIdentity(
  key: CryptoKey,
  bundle: { iv: Uint8Array; ciphertext: Uint8Array },
): Promise<Uint8Array>;
```

Storage layout (per-user):

| Surface | Key | Value | Lifecycle |
|-|-|-|-|
| IndexedDB store `vault_session` | `userId` | `{ cryptoKey: CryptoKey, wrapped: { iv, ciphertext }, createdAt: number, refcount: number }` | Persists until explicit `clearSessionKey` or PIN change. The `refcount` tracks live tabs and gates `browser_close` wipe — see "Multi-tab refcount" below. |
| sessionStorage | `hush_vault_session_alive_${userId}` | `"1"` | Per-tab; dies on tab close. Used as a *boot-time* discriminator (this tab is reloading vs. opening fresh). Not load-bearing for `never`. |
| BroadcastChannel | `hush_vault_session_${userId}` | `{type: "joining"\|"alive"\|"leaving"}` | Coordinates the refcount across same-origin tabs. Messages live only while subscribed. |

The non-extractable `CryptoKey` is stored directly in IDB (the spec
allows storing CryptoKey objects via structured clone — they remain
non-extractable across persistence).

## Policy semantics (corrected)

Earlier drafts of this doc treated `never` as "reuse if marker present,
else clear+regen" — that collapses to `browser_close` because
`sessionStorage` dies on tab close. That was wrong. The four policies
must observably differ; here is what each means after this phase
ships.

| Policy | Survives soft refresh? | Survives backgrounding/reap? | Survives tab close? | Survives last-tab close (browser close)? | Survives explicit logout / PIN change? |
|-|-|-|-|-|-|
| `never` | YES | YES | YES (other tabs alive or even with all tabs closed) | YES | NO |
| `browser_close` | YES | YES | YES if other tabs of this user alive; NO if last tab | NO | NO |
| `refresh` | NO (clears on every reload) | NO | NO | NO | NO |
| numeric (1m..4h) | YES if deadline > now | YES if deadline > now | YES if deadline > now | YES if deadline > now | NO |

Key consequences:

- `never` does **not** consult the alive marker. Once the IDB entry
  exists, it is reused on every boot regardless of marker state. Only
  explicit clears (logout, PIN change) wipe it.
- `browser_close` consults the **refcount**, not the marker, to decide
  whether the last tab has closed. The marker is still useful for
  detecting "this tab is rebooting from a soft refresh" (refcount bump
  vs. fresh-tab join), but it is not the gating signal for cross-tab
  liveness.
- `refresh` ignores both: every boot wipes IDB unconditionally.
- numeric continues to use the inactivity deadline as today, with the
  IDB entry only readable when `now < deadline`.

## Multi-tab refcount

The IDB record is keyed by `userId` only — there is one shared
encrypted bundle per identity, not one per tab. To answer "is this
the last tab closing?" without per-tab keys we use a
`BroadcastChannel`-based liveness count:

1. On boot, after `getSessionKeyIfAlive(userId)`:
   - Subscribe to `hush_vault_session_${userId}`.
   - Broadcast `{type: "joining"}`.
   - Listen for `{type: "alive"}` replies for ~80 ms (single setTimeout).
2. On any received `{type: "joining"}` or `{type: "alive"}` from
   another tab, reply `{type: "alive"}`.
3. When the tab is unloading (`pagehide`), broadcast `{type: "leaving"}`.
4. The IDB record's `refcount` mirrors observed liveness:
   - On join: increment.
   - On observed `leaving`: decrement.
   - When `refcount` would drop to 0 under `browser_close`: synchronously
     `clearSessionKey(userId)` from the `pagehide` handler before the
     tab dies.
   - Under `never`: refcount transitions to 0 are ignored — the IDB
     record persists.
5. New-tab cold-start with no liveness replies and `refcount > 0`
   in IDB indicates a stale count (e.g., previous tab killed by OS
   without firing `pagehide`). Reset `refcount = 1` and continue;
   under `browser_close` this tab's eventual close will then act as
   "last tab".

This gives `browser_close` real semantics ("vault stays unlocked while
**any** tab of mine is open, locks when the last tab closes")
without ever giving up the per-userId IDB record shape. Closing one
tab while another is alive does **not** wipe the IDB record because
the alive tab's `{type: "alive"}` reply is observed before `pagehide`
of the closing tab clears.

`pagehide` is preferred over `beforeunload` for the leaving broadcast
because mobile Safari fires `pagehide` on background-and-reap but not
`beforeunload`. The broadcast must be synchronous; the IDB clear under
`browser_close` is best-effort (some browsers reject async work in
`pagehide`).

## State machine

Boot, per `applyVaultTimeout(userId)`:

```
       +--- "never"          --> reuse IDB if present, ignore marker + refcount
       +--- "browser_close"  --> reuse IDB if present, on tab close decrement
       |                         refcount; if reaches 0, clearSessionKey
boot --+--- "refresh"        --> clear unconditionally (drop on every reload)
       +--- numeric (1m..4h) --> reuse IDB if present AND deadline > now
                                 else clear+regen
```

Unlock flow change (`performChallengeResponse`):
1. Derive wrapping key from PIN as today.
2. After successful unlock: `ensureSessionKey(user.id)` to get session
   CryptoKey.
3. `wrapIdentity(sessionKey, derivedKey)` and persist `{ iv, ciphertext }`
   in the IDB record.
4. Set `sessionStorage["hush_vault_session_alive_${userId}"] = "1"`.
5. Subscribe to BroadcastChannel and announce `joining`; bump
   `refcount`.

Auto-resume flow on boot when policy permits (i.e. always for `never`,
when refcount/deadline allow for the others):
1. `getSessionKeyIfAlive(userId, policy)` — returns CryptoKey or null.
2. Read `{ iv, ciphertext }` from IDB.
3. `unwrapIdentity(sessionKey, bundle)` — yields the in-memory
   wrapping key without prompting for PIN.
4. Set `vaultState = 'unlocked'`.

Lock flow (`lockVault`, `lockVaultForTimeout`, scorched-earth logout):
1. Existing in-memory key wipe.
2. `clearSessionKey(userId)` — wipes IDB entry. Other tabs receive
   `lockBroadcast` and lock too (already in place).
3. Remove sessionStorage alive marker.
4. Unsubscribe BroadcastChannel.

PIN change flow:
1. Existing PIN-change crypto path runs.
2. `clearSessionKey(userId)` so the next unlock re-wraps under a fresh
   session key. (We could rewrap in place, but the simpler "force
   re-unlock after PIN change" matches the legacy contract: PIN change
   today already triggers a re-unlock prompt.)
3. Broadcast lock to other tabs (existing path).

## Edge cases worth specifying explicitly

1. **Marker present, IDB entry missing** → treat as fresh boot for all
   policies except `never`. For `never`, this means an explicit clear
   happened mid-session (logout from another tab); honour it and
   force PIN.
2. **IDB entry present, no marker, no liveness replies** → fresh tab
   join. Under `never`: reuse IDB. Under `browser_close`: also reuse
   (last-tab-out semantics fire on this tab's eventual `pagehide`,
   not on its boot). Under `refresh`: wipe.
3. **Multiple tabs of the same user** → each tab subscribes to the
   shared BroadcastChannel and contributes to the refcount. Closing
   one tab decrements refcount but never wipes IDB while another tab
   is alive. Last tab to close under `browser_close` wipes the IDB
   record from its `pagehide` handler. Under `never` the IDB record
   simply persists; refcount is observed but its value is irrelevant
   to the wipe decision.
4. **iOS Safari / mobile memory pressure → IDB wipe**. We cannot
   prevent this. Behaviour degrades gracefully: missing IDB entry
   forces PIN. Document this in the ans21 verdict so users on iOS know
   "never" is best-effort.
5. **`navigator.storage.persist()` request**. Should this phase opt
   into persistent storage to reduce the iOS quota-eviction surface?
   Decision: yes, request it after the first successful unlock. No
   user prompt on common browsers; on Firefox the prompt is benign.
6. **CryptoKey structured-clone gotcha**. Verify in the implementation
   spike that `IDBObjectStore.put` round-trips a non-extractable
   CryptoKey across browsers we ship to (Chromium, Firefox, Safari,
   Electron). If any one fails, fall back to wrapping the raw key
   bytes under a per-tab non-extractable key derived from a fixed
   string and a per-tab `crypto.getRandomValues` salt — which gets us
   back to the same property.
7. **Logout from another tab via BroadcastChannel** must call
   `clearSessionKey` in every receiving tab.
8. **Migration**. No on-disk migration: the IDB store is new. First
   unlock after this phase ships is the first time a session key is
   written.
9. **Test isolation**. The IDB store name should be deterministic so
   `fake-indexeddb/auto` (already in `src/test/setup.js`) clears it
   between tests. No process-level singletons.

## Test plan

- `src/lib/vaultSessionKey.test.ts` — new:
  - generates a non-extractable key (`extractable === false`).
  - round-trips `wrapIdentity` / `unwrapIdentity`.
  - `getSessionKeyIfAlive` returns null when marker missing.
  - `clearSessionKey` wipes both IDB and marker.
  - tampered ciphertext throws on unwrap.
  - PIN-change-style rotation: `clearSessionKey` then
    `ensureSessionKey` produces a different `CryptoKey` instance.

- `src/hooks/useAuth.test.jsx` — extend:
  - **never**, no marker, IDB present → resumes `vaultState='unlocked'`
    without PIN. (Locks the corrected semantic vs. the earlier draft.)
  - **never**, IDB present, simulated explicit `clearSessionKey` from
    a sibling tab → forces PIN.
  - **browser_close**, with simulated alive sibling → resumes unlocked.
  - **browser_close**, no sibling and `pagehide` fired previously
    (refcount → 0) → boots locked.
  - **refresh**: IDB present at boot → still wiped, boots locked.
  - **numeric (15m)**: IDB present + deadline > now → resumes
    unlocked. Deadline < now → wipes + locks.
  - **PIN change**: clears session key → next unlock requires PIN.
  - **scorched-earth logout**: clears session key + IDB entry verified.
  - **multi-tab refcount**: simulate two-tab boot, close first;
    second tab's IDB entry must remain intact under `browser_close`.

- `src/components/user-settings-dialog.test.tsx` — already covers the
  Select wiring; no change unless the labels change.

- The existing `ans23 / F3` test (`useAuth.test.jsx:854`) must still
  pass: it asserts that **leftover sessionStorage `hush_vault_derived_key`**
  does not auto-unlock the vault. We are not reintroducing that key —
  the new alive-marker is `hush_vault_session_alive_${userId}` (no
  raw key material), and the IDB store is independent. The contract
  it enforces remains.

## Implementation order

Each step is its own commit so the phase is bisect-able.

1. `src/lib/vaultSessionKey.ts` + tests (no wiring yet). Verify on all
   target browsers that CryptoKey round-trips through IDB.
2. Wire `ensureSessionKey` + `wrapIdentity` into the unlock success
   path (`performChallengeResponse`). Wrapping happens but
   `applyVaultTimeout` is unchanged. New unlocks write the IDB entry;
   nothing reads it yet.
3. Wire `getSessionKeyIfAlive` + `unwrapIdentity` into the boot path
   (`useAuth` startup effect). Now reloads under `never` /
   `browser_close` resume unlocked. Add the test cases.
4. Wire `clearSessionKey` into `lockVault`, `lockVaultForTimeout`,
   scorched-earth logout, and PIN change.
5. Update SecurityPanel copy: the "Never" warning becomes accurate
   (key persists in IDB), and a per-policy explanation lands under the
   Select. Optionally add an info panel under the trigger explaining
   the per-policy guarantees.
6. Update `useAuth.js` comments at the three call-sites listed under
   "Read first". Cross-reference `ans21.md`.
7. ans21 verdict + manual smoke list.

## Verification

- `bunx tsc --noEmit` clean.
- `bun run test:run` green (full suite).
- Manual smoke on Chromium + Firefox + Safari + Electron — for each
  policy, walk the matrix in line with the corrected semantics table:
  - Unlock → soft refresh → assert no PIN prompt for `browser_close`,
    `never`, and numeric (within deadline); PIN prompt for `refresh`.
  - Unlock → close tab and reopen with **no other tabs of this user
    open** → assert PIN prompt for `browser_close` (last-tab-out wipe),
    no prompt for `never`, PIN prompt for `refresh`.
  - Unlock → open a second tab → close the first tab → second tab still
    unlocked. Soft-refresh the second tab → assert no PIN prompt for
    `browser_close` (refcount > 0 was observed at second-tab boot, so
    last-tab-out hasn't fired yet).
  - Mobile background → reap → reopen — the user-reported scenario.
    Expect no PIN prompt for `browser_close`/`never`. Note the iOS
    IDB-eviction caveat: under heavy memory pressure, `never` may still
    fall back to a PIN prompt; document this in the verdict.
- `git grep -n 'sessionStorage\.\\?\\[\?["'\''`]hush_vault_derived_key'` → empty.

## Out of scope

- WebAuthn-backed PIN-less unlock. Separate phase.
- Recovery-phrase-only auth path remains as today.
- ServerSettingsDialog vault changes (none — server-side has no notion
  of a vault).

## Branch + commits

Suggested commit titles:

- `feat(vault): non-extractable session-bound wrapping key (ppt21.s1)` — Phase step 1
- `feat(vault): persist + auto-resume across reloads under policy (ppt21.s2/s3)` — Phase steps 2 + 3
- `feat(vault): clear session key on lock/logout/PIN change (ppt21.s4)` — Phase step 4
- `feat(settings): per-policy guarantee copy under vault-timeout select (ppt21.s5)` — Phase step 5
- `docs(vault): refresh useAuth comments + cross-link ppt21 (ppt21.s6)` — Phase step 6
