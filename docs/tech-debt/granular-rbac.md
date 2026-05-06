# Tech debt — granular role-based permissions

| | |
|-|-|
| Status | Open — flagged 2026-05-06 |
| Surface | All creative / destructive actions across the app shell |
| Risk if left | Trust model is binary: a single "admin" flag gates everything from "create channel" to "ban member". No room for moderators with limited scope. As soon as a real community grows past one or two trusted operators, owners must hand out full admin to any contributor and trust them with destructive surface area they have no business reaching. |
| Risk of fixing | Medium-high. RBAC bleeds across UI gating, backend enforcement, schema, migrations, and a settings dialog for role management. Any partial implementation that surfaces UI without backend enforcement is a security regression. |

## Why this is real debt

`canAdministrate` is currently derived as:

```ts
const canAdministrate =
  currentUserRole === "owner" || currentUserRole === "admin"
```

Every gate downstream — create channel, delete channel, delete
category, create invite, kick / ban member, server settings — checks
this single boolean. The backend largely follows the same model:
either the caller is owner/admin or the request is rejected.

This collapses several distinct operations into one trust bucket:

- **Channel CRUD** (create, delete, rename, move) is a moderation
  primitive that some communities want on a moderator role.
- **Member moderation** (kick, ban, mute, redact message) belongs to
  a moderator scope but should not imply server-settings access.
- **Server settings** (display name, icon, encrypted metadata,
  invites, integrations) is the riskiest surface and should be more
  restricted than channel CRUD.
- **Role management** must be its own gate — anyone who can edit
  roles can grant themselves anything else.
- **Message-level actions** (delete other people's messages, pin)
  should be its own moderator-scoped permission.

## Where the binary check leaks

Search for usages: `canAdministrate`, `currentUserRole === "owner"`,
`currentUserRole === "admin"`, `myRole`. Surfaces include but are
not limited to:

- `src/components/authenticated-app.tsx` (canAdministrate,
  handleKickMember, handleBanMember, handleCreateChannel,
  handleDeleteChannel, handleCreateInvite, handleOpenServerSettings).
- `src/components/channel-sidebar.tsx` (delete channel, delete
  category, create channel, create category, create invite, server
  settings).
- `src/components/members-sidebar.tsx` (kick / ban affordances).
- `src/components/server-settings-dialog.tsx` (entire surface).
- Server-rail context menu (leave / delete / open settings).

## Recommended split

1. **Schema**: add a `role_permissions` table or a permission-flags
   bitmask column on `roles`. Flags worth carving out at minimum:
   `manage_channels`, `manage_messages`, `manage_members`,
   `manage_server`, `manage_roles`, `manage_invites`, `kick_members`,
   `ban_members`. Owner role implicitly carries every flag and is
   not editable.
2. **Backend**: every mutation handler resolves caller role +
   intersects against required flag. Owner short-circuits. Reject
   with a structured 403 carrying `missing_permission`.
3. **Frontend**: replace the single `canAdministrate` gate with a
   `permissions` object derived from the current role. UI hides /
   disables affordances per missing flag.
4. **Settings dialog**: a Roles panel where owners (and members
   with `manage_roles`) can list, create, edit, and delete roles,
   tick permission boxes, and assign roles to members.
5. **Migrations**: existing servers get a synthetic `admin` role
   with all flags set, and an `everyone` role with read-only flags.
   Owner remains a server-level field, untouchable.

## Done-when

- Backend rejects every protected mutation when the caller's role
  lacks the required flag, with a structured error.
- Frontend gates each affordance on the matching flag, not on
  `canAdministrate`.
- `canAdministrate` is removed; in its place a `usePermissions()`
  hook returns the resolved flag set.
- Settings → Roles surface lets owners manage roles end-to-end.
- A migration backfills existing servers without breaking running
  clients.
- Test suite covers per-flag enforcement on a representative subset
  of handlers.

## Out of scope

- Channel-level permission overrides (Discord-style category /
  channel permission cascades). Worthwhile but a phase of its own;
  the global role flags above need to land first.
- Audit log of permission changes. Nice to have, not load-bearing.
- Custom permission presets / templates. Punt until owners tell us
  the flag set is the wrong granularity.
