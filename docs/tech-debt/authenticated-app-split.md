# Tech debt — split `authenticated-app.tsx`

| | |
|-|-|
| Status | Open — deferred from Codex review (P3.1) |
| Surface | `src/components/authenticated-app.tsx` (1286 lines as of 2026-05-05) |
| Risk if left | Velocity drag for any feature touching the shell. New behaviour gets bolted onto an already-overloaded component, compounding the problem. |
| Risk of fixing | Medium-high. The component owns most of the shell wiring (routing, server CRUD, DM, voice state, settings dialogs, favorites, keyboard). A naive split risks subtle regressions across surfaces with no single canonical test. |

## Why this is real debt

`AuthenticatedApp` mixes concerns that a principal-engineer review would
flag immediately:

- Routing (URL ↔ active server / channel resolution).
- Server CRUD (`handleCreateServer`, `handleLeaveServer`,
  `handleDeleteServer`, `handleCreateInvite`,
  `handleOpenServerSettings`, `openCreateServerDialog`).
- DM navigation (`handleSelectHomeDM`, `handleDirectMessage`).
- Voice UI state (`joinedVoice`, `voiceState`,
  `handleVoiceStateChange`).
- Settings dialog plumbing (server settings, user settings).
- Favorites store (`favorites`, `favoriteIds`,
  `handleAddFavorite`, `handleRemoveFavorite`).
- Keyboard shortcuts (Cmd+K command palette, `?` cheat sheet).

Each cluster has its own state, callbacks, and side-effect surface.
Today they all live in the same function body and share closure scope,
which makes targeted unit testing impossible — the only test surface
is full-shell integration.

## Why this is *not* fixed in P21 / Codex review

The Codex review tagged P3.1 as P3 (cleanup, not a correctness or
security issue). The current commit cycle is delivering a security
phase (P21 — vault session key) plus the P1/P2 findings; mixing in a
shell refactor of this size would either:

1. Bloat the security phase past safe-review boundaries, or
2. Force a rushed split with high regression risk for surfaces that
   have no dedicated tests today (DM nav, server CRUD round-trips).

## Recommended split

Each bullet maps to a candidate hook in `src/hooks/`:

| Concern | Hook |
|-|-|
| Server CRUD + invite | `useServerCRUD(servers, instanceCtx)` |
| Voice shell state | `useVoiceShellState()` |
| Favorites store | `useFavoritesStore()` |
| Keyboard shortcuts | `useShellShortcuts({ onOpenCommand, onOpenCheatSheet })` |
| DM navigation | `useDirectMessageNavigation(dmGuilds, navigate)` |
| Channel selection | `useChannelSelection(servers, params)` |

Each hook owns its state + memoised handlers and returns a small
interface. `AuthenticatedApp` becomes a composition site that wires
hooks to dialog props.

After the split, `authenticated-app.tsx` should drop from 1286 lines
to roughly 350–450 — comparable to other shell-level components in
this tree.

## Done-when

- `wc -l src/components/authenticated-app.tsx` ≤ 500.
- Each extracted hook has a focused unit test in `src/hooks/*.test.tsx`.
- Existing integration tests (server CRUD, DM nav, voice state,
  command palette, cheat sheet) stay green.
- `bun run typecheck` clean.
- Manual smoke (two browsers) of the user-visible regressions Codex
  warned about: server create / leave / delete, DM open, voice
  controls, command palette, settings dialogs.

## Out of scope

- Renaming the component file.
- Re-routing the React Router tree.
- Touching the data adapters (`useGuilds`, `useInstanceContext`).
