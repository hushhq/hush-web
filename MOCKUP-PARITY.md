# Mockup parity — hush-test → hush-web

Source of truth: `hush-test/src/components/` (mockup, no backend).
Target: `hush-web/src/components/` (production, MLS+LiveKit+multi-instance).

Status legend:

- **PORT** — file copied. Says nothing about mount.
- **MOUNT** — actually rendered in the production code path (logged-in shell, real route). `legacy` = replaced by a `.jsx` legacy component mounted as a slot.
- **WIRE** — handlers connected to real backend. `mock` = local React state only. `partial` = some actions wired, others disabled placeholder. `n/a` = nothing to wire (presentational).

## Top-level components

| Component | PORT | MOUNT | WIRE | Notes |
|-|-|-|-|-|
| `auth/auth-flow.tsx` | yes | yes | yes | sign-up/sign-in via `useAuth`; instance selector wired |
| `auth/instance-selector.tsx` | yes | yes | yes | reuses `useAuthInstanceSelection` |
| `bottom-dock.tsx` | yes | yes | partial | UserMenu wired (settings + logout); voice pip data fed from `voiceState` mock |
| `channel-sidebar.tsx` | yes | yes | partial | DnD wired (`moveChannel`), CRUD wired (text/voice/category), Invite wired, Mute/Notifications/MarkRead disabled (no backend) |
| `channel-view.tsx` | yes | yes | partial | accepts `messageBody`/`voiceBody` slots from production; otherwise renders mock fallbacks |
| `chat-real.tsx` | yes | yes | yes | new TSX `<Chat />` mounted for text channels; consumes `useChannelMessages` hook |
| `chat/chat.tsx` | yes | yes | n/a | shell mounted by `chat-real.tsx` |
| `chat/chat-event.tsx` | yes | yes | n/a | message rows in `chat-real.tsx` |
| `chat/chat-header.tsx` | yes | **orphan** | n/a | header is in `channel-view.tsx`; this file unused |
| `chat/chat-messages.tsx` | yes | yes | n/a | scroll container in `chat-real.tsx` |
| `chat/chat-toolbar.tsx` | yes | yes | n/a | composer toolbar via `MessageComposer` |
| `chat/attachment-tile.tsx` | yes | yes | yes | image/audio/video preview + file-card download (E2EE decrypt) |
| `chat/gif-picker-dialog.tsx` | yes | yes | yes | Tenor v2 search via `/api/gif/search` proxy |
| `chat/emoji-picker-popover.tsx` | yes | yes | yes | `@emoji-mart/react` lazy-loaded; inserts unicode at cursor |
| `cheat-sheet.tsx` | yes | yes | n/a | static keymap |
| `command-palette.tsx` | yes | yes | partial | nav + theme + Discover wired; create-server wired; Invite-user / Ban-user disabled (no backend) — **no create-channel/category from palette yet** |
| `confirm-action.tsx` | yes | yes | n/a | shadcn AlertDialog wrapper |
| `custom-slash-commands.tsx` | yes | yes | partial | `/gif` wired to picker; `/poll` disabled (out of scope); formatting actions wired |
| `favorites-view.tsx` | yes | yes | mock | favorites kept in local state, no backend persistence |
| `home-view.tsx` | yes | yes | n/a | static empty state |
| `members-sidebar.tsx` | yes | yes | partial | kick wired with reason; DM (Send message) wired; Mention/Add-friend disabled (no composer ref / no friend graph) |
| `message-composer.tsx` (Novel + slash + emoji + attach) | yes | yes | yes | mounted by `chat-real.tsx`; emoji picker, attachment dock, GIF preview, send button all wired |
| `message-content.tsx` (markdown render) | yes | yes | yes | renders `envelope.text` via Streamdown for every received message |
| `novel-composer.tsx` | yes | yes | yes | inside `message-composer.tsx`; exposes `insertText` for emoji insertion + `allowEmpty` for attachments-only sends |
| `pinned-messages-popover.tsx` | yes | yes | mock | pinned data from `data/messages.ts`, no backend |
| `roadmap-page.tsx` | yes | yes | n/a | static `/roadmap` route |
| `server-rail.tsx` | yes | yes | partial | Add server / Discover wired; Settings/Leave/Delete wired with role; Mute submenu / Notifications / Mark-as-read / Privacy disabled (no backend) |
| `server-settings-dialog.tsx` | yes | yes | partial | Delete server wired (owner only); other panels collapsed — **needs prototype-1:1 restore** |
| `settings-dialog.tsx` (shared shell) | yes | yes | n/a | shared by both server- and user-settings dialogs |
| `speaker-waveform.tsx` | yes | **orphan** | n/a | never imported in production |
| `text-channel-view.tsx` | yes | **orphan** | n/a | mock fallback never reached now that `chat-real.tsx` is mounted |
| `theme-provider.tsx` | yes | **orphan** | n/a | hush-web uses `src/lib/theme.js` instead |
| `thread-panel.tsx` | yes | yes | mock | thread state local; no backend thread API |
| `timeline-demo.tsx` | yes | **orphan** | n/a | demo only |
| `user-menu.tsx` | yes | yes | partial | Preferences wired, Logout wired, Notifications disabled |
| `user-settings-dialog.tsx` | yes | yes | partial | Account + Logout shipped; many panels collapsed — **needs prototype-1:1 restore** |
| `voice-channel-view.tsx` | yes | yes | partial | accepts `voiceBody` slot from production; legacy `<VoiceChannel />` mounts there |
| `voice-pip.tsx` | yes | yes | mock | mute/deafen/video/screen state mocked locally — **does not reflect real LiveKit room state** |
| `video/controls-bar.tsx` | yes | **orphan** | n/a | mock voice fallback only; production uses legacy controls |
| `video/participant-grid.tsx` | yes | **orphan** | n/a | mock voice fallback only |
| `video/participant-tile.tsx` | yes | **orphan** | n/a | mock voice fallback only |
| `video/prejoin-screen.tsx` | yes | **orphan** | n/a | mock voice fallback only |
| `video/speaker-view.tsx` | yes | **orphan** | n/a | mock voice fallback only |
| `video/video-room-provider.tsx` | yes | **orphan** | n/a | mock voice fallback only |

---

## Plaintext envelope (v1)

Every new send is JSON-encoded `{ v: 1, text, attachments?, gif?, replyTo?, editedAt? }`
before MLS encryption. The wire is opaque ciphertext; receivers strict-decode the
envelope and treat any non-v1 payload as a corrupt message (recovery placeholder).
See `src/lib/messageEnvelope.ts` for the validator and 15-test coverage in
`messageEnvelope.test.ts`. Legacy plaintext rows in the local transcript vault
fall back to `{ v: 1, text: <stored string> }` on render so pre-cutover history
still appears as text.

The voice-channel chat sidebar still mounts the legacy `Chat.jsx` (because
`pages/VoiceChannel.jsx` and `pages/Room.jsx` both import it). Chat.jsx is
envelope-aware on the wire — same JSON v1 going in and out — so strict cutover
holds across both surfaces. Wholesale Chat.jsx delete is deferred to the
eventual VoiceChannel.jsx port.

## Attachments

E2EE: client mints a fresh AES-GCM-256 key + 96-bit IV per file, ciphertext is
PUT directly to the storage backend through a presigned URL, and key/IV travel
inside the MLS envelope's `AttachmentRef`. The server never sees plaintext bytes
or the key.

- Client-side limits: 25 MiB ciphertext, 4 attachments per message, mime
  allowlist (image/* | audio/* | video/mp4 | video/webm | text/* |
  application/pdf). Mirrored on the backend (`internal/api/attachments.go`).
- Endpoints (server, requires auth + channel membership):
  - `POST /api/servers/{sid}/channels/{cid}/attachments/presign`
  - `GET  /api/attachments/{id}/download`
  - `DELETE /api/attachments/{id}` (owner-only soft-delete)
- Storage backend reuses `internal/storage/s3.go`. Returns 503 when
  `STORAGE_BACKEND` is the default `postgres_bytea` since attachments require
  native presigning.

## GIFs (Tenor)

The `/gif` slash command opens a backend-proxied picker. The client never
talks to Google directly — the API key stays server-side, and the user's
search query is hidden behind `GET /api/gif/search?q=...&limit=N`. A 60s
in-memory cache absorbs picker re-opens. Returns 503 when `TENOR_API_KEY`
is unset; the rest of the chat surface keeps working.

`gif` and `attachments` are mutually exclusive in one envelope so the
renderer never has to compose a tile-and-gif bubble.

## Polls

Out of scope. `/poll` slash item is rendered but disabled with a TODO.

---

## What this means in user-visible terms

### Already 1:1 with the mockup

- Right-click menus on rail server, channel list, members.
- Channel CRUD (text / voice / category).
- Server rail icon + Add server / Discover.
- Settings dialogs: account, logout, delete server.
- Command palette navigation, theme toggle.
- Sign-up / sign-in / PIN / device-link auth flow.
- DM creation from member context menu.
- **Message composer**: Novel editor + slash commands + emoji picker +
  attachments dock + GIF picker + send icon + real placeholder copy.
- **Message render**: Streamdown markdown, code-block syntax highlight,
  attachment tiles (image/audio/video/file-card), GIF tiles.
- **Wire format**: JSON v1 envelope with strict cutover + recovery
  placeholder for malformed payloads.

### Visible but not wired (disabled / placeholder, by design until backend)

- Mute server submenu and per-server notifications.
- Mark server as read / privacy settings.
- Mention in channel, Add friend.
- Invite user / Ban user from command palette.
- Most settings panels (profile editing, 2FA, integrations, etc.).
- Pinned messages, favorites, threads (local state only — no backend).
- `/poll` slash command (placeholder, out of scope).

### Ported but never rendered in production

- `chat/chat-header.tsx` — header lives in `channel-view.tsx`.
- `text-channel-view.tsx` — mock fallback, never reached now that
  `chat-real.tsx` mounts for text channels.
- `theme-provider.tsx`, `speaker-waveform.tsx`, `timeline-demo.tsx`.
- The whole `components/video/*` subtree — replaced by
  `pages/VoiceChannel.jsx` + `Room.jsx` legacy.

### Not yet replicated 1:1 (work owed)

- **Voice pip + voice channel**: real LiveKit room state, not local mocks.
  Closing this means swapping the legacy `VoiceChannel.jsx` + `Room.jsx`
  for `voice-channel-view` + `video/*` over a real `useRoom` hook. This
  port also unlocks deletion of `Chat.jsx` (currently mounted as the
  voice-sidebar chat surface).
- **Server settings & user settings dialogs**: every panel section that
  the mockup shows must render (disabled where backend is missing) —
  current code collapses to handler-backed sections only.
- **Command palette**: prototype shows `Create category` and
  `Create channel` actions inside the palette; hush-web only has them in
  the channel-list right-click. Add the palette entries scoped by
  `canAdministrate`.
- **Pinned messages, favorites, threads**: backend persistence missing.
- **@mentions inside the composer**: prototype slash menu does not ship
  mentions either; lands when the member-graph is wired through the
  composer.

---

## How to extend this matrix when a row changes

1. Re-run mount evidence with `grep -rln "from.*@/components/<name>" src --include="*.tsx" --include="*.jsx"`.
2. Verify the import sites land in a code path actually reached at runtime
   (not behind an unused fallback branch like `messageBody == null`).
3. If a prototype component is now mounted in production, flip MOUNT to
   `yes` and write the WIRE column based on what the handlers do (`yes` /
   `partial` / `mock`).
4. Keep this doc updated together with the commit that changes parity.
