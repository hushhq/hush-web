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
| `chat/chat.tsx` | yes | **orphan** | n/a | replaced in production by `Chat.jsx` legacy slot |
| `chat/chat-event.tsx` | yes | **orphan** | n/a | only mounted by mock TextChannelView |
| `chat/chat-header.tsx` | yes | **orphan** | n/a | header is in `channel-view.tsx`; this file unused |
| `chat/chat-messages.tsx` | yes | **orphan** | n/a | mock fallback only |
| `chat/chat-toolbar.tsx` | yes | **orphan** | n/a | mock fallback only |
| `cheat-sheet.tsx` | yes | yes | n/a | static keymap |
| `command-palette.tsx` | yes | yes | partial | nav + theme + Discover wired; create-server wired; Invite-user / Ban-user disabled (no backend) — **no create-channel/category from palette yet** |
| `confirm-action.tsx` | yes | yes | n/a | shadcn AlertDialog wrapper |
| `custom-slash-commands.tsx` | yes | **orphan** | n/a | only consumed by `message-composer.tsx`, which itself is orphan in production |
| `favorites-view.tsx` | yes | yes | mock | favorites kept in local state, no backend persistence |
| `home-view.tsx` | yes | yes | n/a | static empty state |
| `members-sidebar.tsx` | yes | yes | partial | kick wired with reason; DM (Send message) wired; Mention/Add-friend disabled (no composer ref / no friend graph) |
| `message-composer.tsx` (Novel + slash + emoji + attach) | yes | **orphan** | n/a | replaced in production by the legacy `Chat.jsx` composer (plain `Textarea`). User report: missing Novel, slash menu, emoji picker, attachments, send icon — **all gated on porting Chat.jsx away from legacy** |
| `message-content.tsx` (markdown render) | yes | partial | n/a | used by message-composer (orphan) and the mock TextChannelView; production Chat.jsx uses its own renderer |
| `novel-composer.tsx` | yes | **orphan** | n/a | inside `message-composer.tsx`, also orphan |
| `pinned-messages-popover.tsx` | yes | yes | mock | pinned data from `data/messages.ts`, no backend |
| `roadmap-page.tsx` | yes | yes | n/a | static `/roadmap` route |
| `server-rail.tsx` | yes | yes | partial | Add server / Discover wired; Settings/Leave/Delete wired with role; Mute submenu / Notifications / Mark-as-read / Privacy disabled (no backend) |
| `server-settings-dialog.tsx` | yes | yes | partial | Delete server wired (owner only); other panels (Overview, Channels, Roles, Members, Invites, Moderation, Audit log, Notifications, Integrations, Activity) collapsed — **needs prototype-1:1 restore** |
| `settings-dialog.tsx` (shared shell) | yes | yes | n/a | shared by both server- and user-settings dialogs |
| `speaker-waveform.tsx` | yes | **orphan** | n/a | never imported in production |
| `text-channel-view.tsx` | yes | yes | mock | fallback when `messageBody` is null; never reached in production happy path |
| `theme-provider.tsx` | yes | **orphan** | n/a | hush-web uses `src/lib/theme.js` instead |
| `thread-panel.tsx` | yes | yes | mock | thread state local; no backend thread API |
| `timeline-demo.tsx` | yes | **orphan** | n/a | demo only |
| `user-menu.tsx` | yes | yes | partial | Preferences wired, Logout wired, Notifications disabled |
| `user-settings-dialog.tsx` | yes | yes | partial | Account + Logout shipped; Profile, Privacy, Security, Appearance, Voice/Video, Notifications, Keybinds, Language, Integrations, AI assistant, Advanced — **needs prototype-1:1 restore** |
| `voice-channel-view.tsx` | yes | yes | partial | accepts `voiceBody` slot from production; legacy `<VoiceChannel />` mounts there |
| `voice-pip.tsx` | yes | yes | mock | mute/deafen/video/screen state mocked locally — **does not reflect real LiveKit room state** |
| `video/controls-bar.tsx` | yes | **orphan** | n/a | mock voice fallback only; production uses legacy controls |
| `video/participant-grid.tsx` | yes | **orphan** | n/a | mock voice fallback only |
| `video/participant-tile.tsx` | yes | **orphan** | n/a | mock voice fallback only |
| `video/prejoin-screen.tsx` | yes | **orphan** | n/a | mock voice fallback only |
| `video/speaker-view.tsx` | yes | **orphan** | n/a | mock voice fallback only |
| `video/video-room-provider.tsx` | yes | **orphan** | n/a | mock voice fallback only |

---

## What this means in user-visible terms

### Already 1:1 with the mockup

- Right-click menus on rail server, channel list (after the fixes pushed in `63ee7ae`/`3041109`), members.
- Channel CRUD (text / voice / category).
- Server rail icon + Add server / Discover.
- Settings dialogs: account, logout, delete server.
- Command palette navigation, theme toggle.
- Sign-up / sign-in / PIN / device-link auth flow.
- DM creation from member context menu.

### Visible but not wired (disabled / placeholder, by design until backend)

- Mute server submenu and per-server notifications.
- Mark server as read / privacy settings.
- Mention in channel, Add friend.
- Invite user / Ban user from command palette.
- Most settings panels (profile editing, 2FA, integrations, etc.).
- Pinned messages, favorites, threads (local state only — no backend).

### Ported but **never rendered** in production

These files exist in the tree but the live shell mounts a legacy alternative
through `messageBody`/`voiceBody` slots, so the prototype version is dead
weight:

- The whole `components/chat/*` subtree (Chat, ChatEvent, ChatHeader,
  ChatMessages, ChatToolbar) — replaced by `Chat.jsx` legacy.
- `message-composer.tsx`, `novel-composer.tsx`, `custom-slash-commands.tsx`,
  most of `message-content.tsx` — Chat.jsx ships its own minimal composer.
- The whole `components/video/*` subtree — replaced by `pages/VoiceChannel.jsx`
  + `Room.jsx` legacy.
- `theme-provider.tsx`, `speaker-waveform.tsx`, `timeline-demo.tsx`.

### Not yet replicated 1:1 (work owed)

These are concrete behaviors visible in the mockup that the production
shell does not yet match:

- **Message composer**: Novel editor with slash commands, emoji picker,
  attachments dock, correct send-button icon, real placeholder copy,
  inline @mention. Currently a plain Textarea ships from Chat.jsx legacy.
  Closing this means porting the data layer of `Chat.jsx` (MLS subscribe,
  history paging, optimistic send, retry) into a hook consumed by a new
  TSX `<Chat />` that renders `chat/*` + `message-composer`.
- **Voice pip + voice channel**: real LiveKit room state, not local mocks.
  Closing this means swapping the legacy `VoiceChannel.jsx` + `Room.jsx`
  for `voice-channel-view` + `video/*` over a real `useRoom` hook.
- **Server settings & user settings dialogs**: every panel section that
  the mockup shows must render (disabled where backend is missing) —
  current code collapses to handler-backed sections only, which the user
  flagged as a divergence from the 1:1 rule.
- **Command palette**: prototype shows `Create category` and
  `Create channel` actions inside the palette; hush-web only has them in
  the channel-list right-click. Add the palette entries scoped by
  `canAdministrate`.
- **Pinned messages, favorites, threads**: backend persistence missing.

---

## How to extend this matrix when a row changes

1. Re-run mount evidence with `grep -rln "from.*@/components/<name>" src --include="*.tsx" --include="*.jsx"`.
2. Verify the import sites land in a code path actually reached at runtime
   (not behind an unused fallback branch like `messageBody == null`).
3. If a prototype component is now mounted in production, flip MOUNT to
   `yes` and write the WIRE column based on what the handlers do (`yes` /
   `partial` / `mock`).
4. Keep this doc updated together with the commit that changes parity.
