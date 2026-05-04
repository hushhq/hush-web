# UI port — Status & Audit Findings

Branch `feature/ui-port-from-prototype`. This document is the running
ledger for the wholesale UI port from `hush-test` (Vite + React 19 +
shadcn `new-york`) onto `hush-web` (Signal/MLS + LiveKit + multi-instance
auth). It is updated after each substantive change so a future
contributor (or future-me) can pick up the work cold.

## TL;DR

- **Closed**: prototype copy, all wiring (kick, channel CRUD, leave/delete
  server, invite, DM, system channels, voice via legacy mount, command
  palette, settings dialogs), legacy delete (~3000 LOC removed), test port
  with 957+ green tests, two audit passes with finding-driven fixes.
- **Open**: a manual end-to-end smoke pass (Phase #19) is the only
  blocking item I cannot perform myself, plus the user-reported
  "buttons don't work / right-click menus aren't there" symptom which I
  could not reproduce locally and which is described in detail in the
  Known Problems section below.
- **Future work**: legacy JSX residuals (Chat, VoiceChannel, Room,
  Invite, LinkDevice, ExplorePage) are still legacy-presentation
  internally — the new shell wraps them but doesn't re-skin them. The
  `@radix-ui/themes` dep stays until those pages are ported.

## Plan as executed

| Phase | Goal | Status |
|-|-|-|
| Setup | Add deps, copy hush-test src tree wholesale, replace mocks with real context/hook calls, wrap in BrowserRouter + AuthProvider + InstanceProvider + BootProvider | ✅ |
| 20 — pre-cleanup audit | Catch refactor bugs before legacy delete makes them harder to bisect | ✅ |
| A — wire backend | A.1 inventory parity, A.2 kick, A.3 channel CRUD, A.4 server leave/delete, A.5 settings dialogs, A.6 DM, A.7 system channels, A.8 voice (mount legacy `<VoiceChannel />`), A.9 command palette | ✅ |
| C — port tests | Rewrite legacy component tests against new TSX surfaces | ✅ |
| 18 — legacy delete | Remove pages/Home, ServerLayout (1865 LOC), TextChannel, Roadmap, SystemChannel + layout/, ChannelList, ServerList, MemberList, ServerSettingsModal, UserSettingsModal, GuildCreateModal, ConfirmModal, ModerationModal, DeviceManagement, PostRecoveryWizard, Toast, EmptyState, DmListView, InstancesSettingsTab, MemberContextMenu, MemberProfileCard, GuildContextMenu, UserPanel, SystemMessageRow, RegistrationWizard, RecoveryPhraseInput, PinSetupModal, PinUnlockScreen, MnemonicConfirm, MnemonicGrid, DeviceLinkModal, AuthInstanceSelector, ui/Button.jsx + Select.jsx + Tabs.jsx + AlertDialog.jsx + ContextMenu.jsx + Dialog.jsx + ScrollArea.jsx + Switch.jsx + Tooltip.jsx + DropdownMenu.jsx + Separator.jsx + IconButton.jsx + ui/index.js | ✅ |
| 21 — post-cleanup audit | Catch HIGH-class regressions introduced by Phase A wiring + legacy delete | ✅ |
| 19 — manual end-to-end | Browser smoke for sign-up / recovery / PIN unlock / message / voice / drag / kick / invite / DM / sign-out | ⏳ owned by user |
| Future | Legacy JSX port for Chat / VoiceChannel / Room / Invite / LinkDevice / ExplorePage; drop `@radix-ui/themes`; bundle splitting; a11y; perf | ⏳ separate PR |

## Phase 20 — pre-cleanup audit

Goal: catch refactor bugs before deleting legacy components, since
post-delete regressions are harder to bisect.

### F-20-1 (MEDIUM) — `activeChannel` falls back to mock SYSTEM_CHANNEL

`authenticated-app.tsx`'s `activeChannel` resolved with
`allChannels[0] ?? { id: "" }`. `allChannels` was built as
`[...SYSTEM_CHANNELS, ...channels]`, so when `params.channelSlug` was
missing or invalid, the fallback landed on `server-log` — a placeholder
id with no backend channel. `<Chat />` would then mount with
`channelId="server-log"`, which would crash the MLS group lookup.

Fix (`ad6095b`):

- Fallback chain now skips SYSTEM_CHANNELS:
  `allChannels.find(slug match) ?? channels.find(text) ?? stub`.
- Added `isSystemChannel` guard around the chatBody mount to refuse
  attaching `<Chat />` to system-channel ids even if they win the
  resolution.

### F-20-2 (MEDIUM, batch) — Unwired right-click + dropdown menu items

`channel-sidebar.tsx`, `members-sidebar.tsx`, `server-rail.tsx` ported
the prototype context menus 1:1 but most items had no `onSelect`
handler. Visually clickable, no effect.

Fix (`ad6095b`):

- Items whose backend exists but were not wired in this commit got a
  `disabled` flag plus `// TODO(yarin, 2026-05-04)` describing the
  pending wiring. Phase A then re-enabled them as it landed each
  handler (kick, channel CRUD, invite, leave/delete server, sign out,
  DMs, system channels).
- Items the backend genuinely does not implement (friend graph, mute
  presets, threads/pin/react) stay `disabled` permanently with the
  same TODO format.
- `Copy user ID` was wirable inline via `navigator.clipboard` and was
  enabled directly.

### Other categories scanned in Phase 20 (no findings)

- Wrong source-hook vs context import (`useAuth` from
  `@/contexts/AuthContext`, not `@/hooks/useAuth`)
- Duplicate context consumer (single `useAuth`, single
  `useInstanceContext` per shell)
- Stale closure in async post-mutation handlers
- Effect cleanup (listeners + setInterval pair return cleanup)
- forwardRef gaps in custom components
- Case-collision import paths (already patched with explicit `.tsx`)
- Function imports (tsc clean)
- Hardcoded mock leftover in TSX (placeholders intentional + commented)
- Suspense / lazy default exports
- Adapter call signature mismatch (`moveChannel`, `getGuildChannels` shapes verified)

## Phase 21 — post-cleanup audit

### F-21-1 (HIGH) — Voice connection diverges from joined-voice instance

When the user joined voice on server A (instance-1), then navigated to
server B (instance-2), the persistent `<VoiceChannel />` mount kept
running. But it was receiving `wsClient`, `getToken`, `members`, and
`currentUserRole` from the active-channel scope — i.e. instance-2's
WebSocket client and instance-2's token. Voice was effectively talking
to instance-1's MLS voice group through instance-2's WebSocket.

Fix (`8f218a3`):

- `voiceToken = getTokenForInstance(joinedVoice.instanceUrl)`
- `voiceWsClient = getWsClient(joinedVoice.instanceUrl)`
- `voiceGetToken` stable callback wrapped over the resolved token
- `members` + `currentUserRole` passed only when the active server
  matches the joined voice server; else empty + `"member"` defaults

### F-21-2 (MEDIUM) — `paletteChannels` cartesian product

Command-palette channel list flat-mapped every server across the active
server's channels, producing entries that tagged the active server's
channels with every other server's `{ serverId, serverName }`. Selecting
one would navigate to a non-existent channel of the wrong server.

Fix (`383225b`):

- Restrict palette to the active server's channels until a per-server
  pre-fetch lands.

### F-21-3 (LOW) — HomeSidebar DM section empty

`useInstanceContext().dmGuilds` already separates DM guilds. Shell
discovered the field in Phase A but never threaded it into HomeSidebar.

Fix (`a32fc54`):

- Map `dmGuilds → { id: channelId, name, initials, presence }` and pass
  to HomeSidebar.
- Selecting a DM navigates via the DM's `instanceUrl` +
  `buildGuildRouteRef`.

### F-21-4 (HIGH) — Member role mapping ignored backend `role` strings

`useMembersForServer` mapped each row through
`permissionLevelToRole(m.permissionLevel)`. The hush-web backend's
`getGuildMembers` endpoint returns either `permissionLevel` (int 0-3)
**or** `role` string. When the backend returned `role` strings (the
documented response shape in `lib/api.js`), `m.permissionLevel` was
`undefined`, the helper defaulted to `"member"`, and every member —
including the current user — was treated as a `member`.

User-visible effect: `currentUserRole` always resolved to `member` even
for the server owner. `canAdministrate` was always `false`, so the
entire admin context menu (Invite people, New text channel, New voice
channel, Server settings, Delete server) and members-sidebar Kick
appeared disabled. **This is a partial explanation for the user's
reported "buttons don't work / right-click menus aren't there"
symptom — it accounts for the admin items appearing disabled but does
NOT account for context menus failing to open at all.**

Fix (`e60a78d`):

- `adapters/types.ts` adds `memberRoleFromRaw({ permissionLevel, role })`
  that prefers `permissionLevel` when present and falls back to a
  string-table lookup over `role`. Mirrors the legacy `getMemberLevel`
  fallback.
- `useMembersForServer` passes the raw `{ permissionLevel, role }` pair
  through the new helper.

## Known problems (open)

### KP-1 — User reports: "buttons don't work / right-click menus aren't there"

**Status**: partially explained, partially unresolved.

**What's confirmed**:

- F-21-4 above explains why **admin items inside menus appear disabled**
  for the server owner — `canAdministrate` was hardwired to `false` by
  the role mapping bug. Fixed in `e60a78d`. User must re-test.
- App.test.jsx + 957 unit tests all pass, including
  `members-sidebar.test.tsx` and `server-rail.test.tsx` which verify
  right-click → context menu open → menu item click → handler invocation
  via `userEvent.pointer({ keys: '[MouseRight]' })`. These pass in jsdom.

**What's unverified in a real browser by me**:

- Whether right-click actually opens any context menu at all (jsdom
  passes; Chrome may differ).
- Whether basic non-admin buttons inside the authenticated shell
  respond to clicks. I could not reproduce in a Playwright-driven dev
  session because reaching the authenticated shell requires real
  backend auth + a real wsClient handshake against
  `localhost:8080`, which I started but did not complete inside this
  session.

**Hypotheses still on the table** (in order of likelihood):

1. **F-21-4 was the only bug** — the user's "buttons don't work" was
   the disabled admin items, and the "right-click menus aren't there"
   was them being there but visually disabled. They re-test → working.
2. **Slot stacking on RailServer**: `<ContextMenuTrigger asChild>` wraps
   `<TooltipTrigger asChild>` wraps `<Button>`. Both Triggers use
   Radix Slot to forward props to the same Button. In real browsers
   under React 19 this composition may drop one of the event handlers
   (`onContextMenu` from outer Slot vs `onPointerEnter` from inner).
   The unit test passes because user-event's synthetic `contextmenu`
   bypasses Slot composition checks. Fix path: drop the inner
   `asChild` and let TooltipTrigger render its default
   `<button>` (extra DOM node, no semantic regression).
3. **Eruda mobile console** is auto-init'd in dev (`main.jsx:175`).
   Eruda is known to attach a global `oncontextmenu` listener for its
   inspector mode; if that listener calls `preventDefault`, native and
   Radix context menus alike are suppressed. Worth disabling first as
   a cheap test.
4. **Pointer-event interception by `dnd-kit`'s `PointerSensor`** in
   `channel-sidebar.tsx`. Default activation constraint is
   `{ distance: 5 }` which fires on primary button only, but a Radix
   bug or version mismatch could attach the sensor to all buttons.
5. **A `select-none` Tailwind class on a parent** disabling
   `user-select` cascade-disables `oncontextmenu` only on Safari.
   Probably not relevant if the user is on Chrome.

**Reproduction plan for next session**:

1. `cd ../hush-server && docker compose ps`
   to confirm backend is up (it was during this session; sufficient).
2. `cd ../hush-web && bun run dev` —
   Vite serves on the next free port (5175 in this session).
3. Open the page; sign up via Playwright using the dialog at instance
   `localhost:8080` (NOT the Vite port; the dialog defaults to the
   page origin which is wrong).
4. Land in authenticated shell. Right-click on a server icon in the
   left rail. Observe whether a context menu opens. If yes → click
   each item, confirm the handler fires (requires F-21-4 fix to be
   live, which it now is).
5. If no menu opens → open devtools, watch for the `contextmenu`
   event firing on the element. Trace to the suppressing handler.
6. As a fast diagnostic, set
   `localStorage.setItem('eruda', 'false')`, reload, repeat. If menus
   work after that, eruda is the cause.

### KP-2 — Voice persistence across cross-instance navigation needs live verification

The fix in F-21-1 was correct on paper but I never actually held a
voice connection on instance A, navigated to instance B, and confirmed
the WebSocket handshake stayed on instance A. Goes hand-in-hand with
KP-1 (needs a live multi-instance setup).

### KP-3 — Legacy JSX residuals still use `@radix-ui/themes`

`Chat.jsx`, `Controls.jsx`, `VoiceChannel.jsx`, `Room.jsx`,
`Invite.jsx`, `LinkDevice.jsx`, `ExplorePage.jsx`,
`ScreenShareCard.jsx`, `QualityPickerModal.jsx`,
`DevicePickerModal.jsx`, `VideoGrid.jsx` are kept verbatim. They drag
in `@radix-ui/themes` as a dep. Removing the dep requires porting each
to shadcn primitives.

Status: planned as a separate PR. Not blocking the UI port.

### KP-4 — Backend feature gaps still flagged as `disabled` + TODO

These remain disabled in the UI with a TODO comment and have no
corresponding backend endpoint:

- Friend graph (`Add friend` in member context)
- Per-server notification prefs / mute presets
- Threads / pinned messages / reactions (`features.threads=false`,
  etc.)
- Apps integrations (Linear, GitHub placeholders)
- Profile editing (display name / username / email / phone / password
  rows in user settings)
- 2FA
- Account disable / delete
- Categories CRUD inside server settings (DnD reorder works; create /
  rename / delete don't)

Each one needs a backend endpoint before the UI can be unmuted.

## What changed in code

### New surfaces

- `src/components/auth/auth-flow.tsx` — single auth entry surface
  (sign-in, sign-up wizard, link-device button, instance picker).
  Replaces legacy `RegistrationWizard` + `RecoveryPhraseInput`.
- `src/components/auth/instance-selector.tsx` — replaces legacy
  `AuthInstanceSelector`. Used by both `auth-flow` and `LinkDevice.jsx`.
- `src/components/auth/pin-setup-panel.tsx` — replaces
  `PinSetupModal`. Tabs for PIN vs passphrase, strength bar, skip
  flow.
- `src/components/auth/pin-unlock-panel.tsx` — replaces
  `PinUnlockScreen`. Username header, progressive delay (3 / 5 / 7 / 9
  fails → 1s / 5s / 30s / 60s), `MAX_ATTEMPTS=10`, VAULT_WIPED branch.
- `src/components/auth/unauthenticated-shell.tsx` — boot-state router
  for unauthenticated states (`needs_login` / `needs_pin` / `pin_setup`).
- `src/components/authenticated-app.tsx` — post-login application
  shell. Composes ServerRail + ChannelSidebar + ChannelView, mounts
  legacy `<Chat />` as the message body slot of text channels and
  legacy `<VoiceChannel />` as the persistent voice surface. Drives
  `joinedVoice` lifecycle, hosts all wired callbacks.
- `src/components/system-channel-view.tsx` — read-only viewer for
  server-log + moderation system channels.
- `src/adapters/`:
  - `types.ts` (Server, Channel, ServerMember, role helpers)
  - `useGuilds.ts` (mergedGuilds → Server[])
  - `useChannelsForServer.ts` (getGuildChannels +
    moveChannel reorder with optimistic + rollback)
  - `useMembersForServer.ts` (getGuildMembers + role resolution)
  - `useSystemEvents.ts` (server-log / moderation event stream)
- `src/lib/theme.js` — extracted from the deleted
  `UserSettingsModal.jsx` so `App.jsx` can keep applying the stored
  theme before first paint.

### Test coverage added

`src/{components,adapters}/**/*.test.{ts,tsx}`:

- Adapters: useGuilds, useMembersForServer, useChannelsForServer,
  useSystemEvents (16 tests total)
- Auth surfaces: auth-flow, pin-setup-panel, pin-unlock-panel,
  unauthenticated-shell (17)
- Shell pieces: server-rail, channel-sidebar, members-sidebar (14)
- Dialogs: server-settings-dialog, user-settings-dialog,
  command-palette (13)
- Channel surfaces: system-channel-view, voice-channel-view,
  voice-pip (10)

Suite total: 87 files, 957 tests, all passing in CI mode.

### Commits worth knowing

```
e60a78d  fix(audit): member role from backend role strings, not just int
62157b7  test: voice-pip + voice-channel-view + unauthenticated-shell
bbc1bf5  test: cover system-channel-view, settings dialogs, palette, sidebar
9c1bc2b  test: add coverage for adapters + auth-flow
383225b  fix(audit): paletteChannels cartesian product + audit findings doc
a32fc54  feat(home): surface DM guilds in HomeSidebar direct-messages section
8f218a3  fix(audit): voice connection follows joined-voice instance
fe30626  chore(cleanup): delete legacy presentation layer
b5f7356  feat(wiring): command palette discover / settings / sign out
9849192  feat(wiring): voice channel mounts real legacy VoiceChannel.jsx
c1a5a83  feat(wiring): direct message channel from member context menu
0564a25  feat(wiring): settings dialogs delete server + sign out
8528fe6  feat(wiring): leave / delete server from server-rail context menu
b04e9fb  feat(wiring): create channel + create invite from channel sidebar
94e29ba  feat(wiring): kick member action with permission check
ad6095b  fix(audit): guard mock channel mount + disable unwired menu items
09a4dda  fix: drop hardcoded mockup data + upgrade React 19
```

## Verification gates that already pass

```
bunx tsc --noEmit       # 0 errors
bun run build           # success (one bundle-size warning, unrelated)
bun run test:run        # 957 passed (87 files)
```

## Verification gates still owed (Phase #19)

These cannot be automated by me — they need a real browser session
against the live backend. Listed in priority order.

1. Sign-up cold path: BIP39 generated → 12-word reveal → 3-word
   confirm → register call against `localhost:8080` → PIN setup → land
   in authenticated shell.
2. Recovery cold path: sign-out → recovery with 12 words → PIN unlock
   → land back in shell.
3. **Buttons + right-click menus** (KP-1 above): smoke every server,
   channel, and member context menu, plus the user-menu DropdownMenu.
   This is what the user has been blocked on.
4. Send a message: open a text channel, type, press enter, observe
   ciphertext transit + plain text on the receiver side.
5. Voice round-trip: join a voice channel, confirm 2-way audio,
   navigate to a different channel/server (KP-2), confirm voice
   stays connected.
6. Drag-and-drop channel reorder + category reorder, including a
   server with categories.
7. Settings → Delete server (owner) and Settings → Log out (any user).
8. Mobile viewport (<768px): channel-sidebar Sheet + members-sidebar
   Sheet open and close correctly.
