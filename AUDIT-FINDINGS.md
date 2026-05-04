# Audit Findings — UI port (`feature/ui-port-from-prototype`)

Two audits ran against the UI port before and after the legacy delete
phase. Each finding is paired with its fix commit.

## Phase 20 — pre-cleanup audit

Goal: catch refactor bugs before deleting legacy components, since
post-delete regressions are harder to bisect.

### Findings

#### F-20-1 (MEDIUM) — `activeChannel` falls back to mock SYSTEM_CHANNEL

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

#### F-20-2 (MEDIUM, batch) — Unwired right-click + dropdown menu items

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

### Other categories scanned (no findings)

- Wrong source-hook vs context import (`useAuth` from
  `@/contexts/AuthContext`, not `@/hooks/useAuth`)
- Duplicate context consumer (single `useAuth`, single
  `useInstanceContext` per shell)
- Stale closure in async post-mutation handlers
- Effect cleanup (listeners + setInterval pair return cleanup)
- forwardRef gaps in custom components
- Case-collision import paths (already patched with explicit `.tsx`)
- Function imports inesistenti (tsc clean)
- Hardcoded mock leftover in TSX (placeholders intentional + commented)
- Suspense / lazy default exports
- Adapter call signature mismatch (`moveChannel`,
  `getGuildChannels` shapes verified)

## Phase 21 — post-cleanup audit

Goal: catch any HIGH-class regression introduced by the Phase A
wiring + the legacy presentation delete.

### Findings

#### F-21-1 (HIGH) — Voice connection diverges from joined-voice instance

When the user joined voice on server A (instance-1), then navigated to
server B (instance-2), the persistent `<VoiceChannel />` mount kept
running. But it was receiving `wsClient`, `getToken`, `members`, and
`currentUserRole` from the active-channel scope — i.e. instance-2's
WebSocket client and instance-2's token.

Voice was effectively talking to instance-1's MLS voice group through
instance-2's WebSocket. WebSocket would either fail handshakes against
the MLS group it does not own or dispatch events to the wrong group
state machine. Encrypted voice could break silently.

Fix (`8f218a3`):

- `voiceToken = getTokenForInstance(joinedVoice.instanceUrl)` —
  resolved from the joined-voice instance.
- `voiceWsClient = getWsClient(joinedVoice.instanceUrl)` — same.
- `voiceGetToken` stable callback wrapped over the resolved token.
- `members` and `currentUserRole` are passed only when the active
  server matches the joined voice server; otherwise the voice mount
  receives empty members and a `member` role default. The shell hides
  the in-voice members panel anyway, so no UX impact.

#### F-21-2 (MEDIUM) — `paletteChannels` cartesian product

The command-palette channel list flat-mapped every server in the rail
across the active server's channels:

```ts
servers.flatMap((server) => channels.map((c) => ({ ..., serverId: server.id })))
```

`channels` was only ever the active server's channel list (
`useChannelsForServer` keys on `activeServer.id`), so the result tagged
the active server's channels with every other server's id and name.
Searching a channel and pressing enter would navigate to a non-existent
channel of the wrong server.

Fix (`<this-commit>`):

- Restrict palette channels to the active server only. Until a
  per-server pre-fetch lands, only the open server contributes
  searchable channels.

#### F-21-4 (HIGH) — Member role mapping ignored backend `role` strings

`useMembersForServer` mapped each row through `permissionLevelToRole(m.permissionLevel)`.
The hush-web backend's `getGuildMembers` endpoint returns either
`permissionLevel` (int 0-3) **or** `role` string (`owner`, `admin`,
`moderator`, `member`, `bot`) — the legacy `MemberList` accepted both.
When the backend returned `role` strings (the documented response shape
in `lib/api.js`), `m.permissionLevel` was `undefined`, the helper
defaulted to `"member"`, and every member — including the current user
— was treated as a `member`.

User-visible effect: `currentUserRole` always resolved to `member`
even for the server owner. `canAdministrate` was always `false`, so
the entire admin context menu (Invite people, New text channel, New
voice channel, Server settings, Delete server) and members-sidebar Kick
appeared disabled. From the user's perspective, "buttons don't work"
and "right-click menus aren't there."

Fix (`<this-commit>`):

- `adapters/types.ts` adds `memberRoleFromRaw({ permissionLevel, role })`
  that prefers `permissionLevel` when present and falls back to a
  string-table lookup over `role`. Mirrors the legacy `getMemberLevel`
  fallback.
- `useMembersForServer` passes the raw `{ permissionLevel, role }` pair
  through the new helper, so backend rows with either shape resolve
  correctly.

### Quick win bundled with this audit (LOW)

#### F-21-3 (LOW) — HomeSidebar DM section empty

`useInstanceContext().dmGuilds` already separates DM guilds from
regular guilds. The shell discovered the field in Phase A but never
threaded it into HomeSidebar — `directMessages` was a static empty
array.

Fix (`a32fc54`):

- Map `dmGuilds → { id: channelId, name, initials, presence }` and pass
  to HomeSidebar.
- Selecting a DM in Home navigates to the standard
  `/:instance/:guildSlug/:channelSlug?` route via the DM's
  `instanceUrl` + `buildGuildRouteRef`.

### Other categories scanned (no findings)

- Phase 20 categories #1–#11 re-checked against new wire changes
- Lazy imports: all named-export wrappers correct (`UnauthenticatedShell`,
  `RoadmapPage`, `AuthenticatedApp`); default-export pages
  (`Invite`, `LinkDevice`, `Room`, `ExplorePage`) match
- useEffect dependency arrays + cleanup checked on the new
  `keydown` listener and the auto-redirect effects
- Adapter call signatures rechecked for `getAuditLog`,
  `getSystemMessages`, `createOrFindDM`, `kickUser`,
  `createGuildChannel`, `deleteGuildChannel`, `leaveGuild`,
  `deleteGuild`, `createGuildInvite`

## Verification

After every fix:

```
bunx tsc --noEmit       # 0 errors
bun run build           # success
bun run test:run        # 906 passed
```

Manual smoke (Phase B / #19) is owned by the user — exercise sign-up,
recovery, PIN unlock, send message, voice join + cross-instance
navigation, channel CRUD, kick, invite, DM, sign-out.
