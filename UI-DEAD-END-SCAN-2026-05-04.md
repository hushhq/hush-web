# UI Dead-End Scan - 2026-05-04

Scope: scan of `hush-web/src`, with cross-checks against `hush-server` admin
configuration and server creation policy. Focus is on UI controls that look
actionable but either do nothing, route to the wrong product surface, or bypass
server-side policy.

## Fixed In This Pass

- `ServerRail` Add server button was visual-only. It now opens a create-server
  dialog wired to `createGuild`, refreshes guilds, and navigates to the created
  server.
- `ServerRail` Discover button was visual-only. It now routes to `/explore`.
- `HomeSidebar` reused server header actions. It now renders Home as a
  non-server surface and does not expose Server settings / Invite people.
- Command palette `Create server` was disabled. It now opens the same
  create-server dialog.
- Member profile card `Send message` was visual-only. It now invokes the real
  DM handler when available and is disabled when unavailable.
- Category-row `+` was visual-only. It now opens the create text-channel dialog
  with the category as parent.
- User menu `Notifications` looked actionable but had no handler. It is now
  explicitly disabled.

## Server Creation Policy

Do not implement client-side policy for guild creation beyond basic form
validation. `hush-server` owns this policy:

- `server_creation_policy`: `open`, `paid`, `disabled`
- `max_servers_per_user`: per-user owned-server cap

The admin panel at `localhost:8080/admin` configures those values. The web app
should call `POST /api/servers` and surface backend errors such as:

- `server creation is disabled on this instance`
- `This instance requires a subscription to create servers.`
- `you have reached the maximum number of servers you can create`

## Remaining Dead Ends / Intentional Disabled Surfaces

P1 - Settings dialogs are mostly placeholder UI:

- `src/components/server-settings-dialog.tsx`
- `src/components/user-settings-dialog.tsx`

They expose full settings navigation but most panels are skeleton placeholders.
Either hide unavailable sections or wire real controls before treating this as
release-ready.

P1 - Server rail context menu has disabled actions that look like real
server-level operations:

- Mute server
- Notification settings
- Mark server as read
- Privacy settings

Location: `src/components/server-rail.tsx`. These should either be removed until
backend support exists or wired to concrete APIs.

P1 - Command palette still exposes disabled actions:

- Invite user
- Ban user

Location: `src/components/command-palette.tsx`. These are explicit dead ends in
the global action surface.

P1 - Channel sidebar still exposes unavailable server/channel management:

- Manage integrations
- New category
- Channel settings

Location: `src/components/channel-sidebar.tsx`. New category is blocked by
missing backend category CRUD. Channel settings should stay hidden/disabled
until there is an editable channel-settings flow.

P2 - Members context menu still has deliberately disabled social/composer
actions:

- Mention in channel
- Add friend

Location: `src/components/members-sidebar.tsx`. These are acceptable only if
they remain clearly disabled and do not look like broken clickable controls.

P2 - `VideoRoomProvider` uses a placeholder LiveKit URL when credentials are
absent:

- `src/components/video/video-room-provider.tsx`

It currently avoids connecting when credentials are missing, but the placeholder
URL should be audited before production to make sure no caller can force
`connect={true}` without a real `serverUrl`.

