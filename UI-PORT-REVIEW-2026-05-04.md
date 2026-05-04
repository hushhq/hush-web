# Hush Web UI Port Review - 2026-05-04

Scope reviewed:

- `hush-web` branch `feature/ui-port-from-prototype`, including the last 20 commits.
- `hush-web/AUDIT-FINDINGS.md`.
- `hush-test` as the prototype source.
- `hush-server` API contracts relevant to guilds, channels, members, invites, moderation, and system channels.

Verification run:

- `bunx tsc --noEmit` in `hush-web`: passed, but see P0-2.
- `bun run test:run` in `hush-web`: 87 files, 957 tests passed.
- `bun run build` in `hush-web`: passed with major chunk-size warnings.
- `go test ./...` in `hush-server`: passed.
- `npx -y react-doctor@latest . --verbose`: score 72/100, 1 error, 395 warnings.
- `npx -y impeccable --json --fast ...`: one pure-black finding in `auth-flow.tsx`.
- Follow-up user console log on app open reviewed after initial report.

## Executive Summary

The port is not ready to trust. The ledger overstates the verification quality because the TypeScript gate currently excludes the UI port, and the most important runtime integration appears broken: `AuthenticatedApp` constructs the production `Chat.jsx` node, but `ChannelView` does not accept or render that prop. That means normal text channels render the prototype/mock `TextChannelView`, not the MLS/WebSocket-backed chat.

The test suite is broad but not aligned with the riskiest integration points. It verifies many leaf components and adapter happy paths, but it misses the end-to-end composition bugs: wrong/unknown roles on non-active rail servers, kick requests that the backend rejects, actual backend system channels treated as normal text channels, and DnD persistence firing during hover.

## Findings

### P0-1 - Production text chat is not mounted

Location:

- `src/components/authenticated-app.tsx:666-681`
- `src/components/authenticated-app.tsx:705-718`
- `src/components/channel-view.tsx:64-80`
- `src/components/channel-view.tsx:177-233`

`AuthenticatedApp` builds `chatBody` with legacy `Chat.jsx`, which is the component that owns MLS, WebSocket subscription, history stores, optimistic sends, and real message sending. It then passes `messageBody={chatBody}` into `ChannelView`.

`ChannelViewProps` does not declare `messageBody`, and `ChannelView` never renders it. For non-voice/non-home channels it always renders `TextChannelView`, which uses local mock data from `src/data/messages.ts` and `setLocalMessages`.

Impact:

- Sending a message from the new shell does not use the real encrypted chat path.
- Manual smoke item "Send a message" in `AUDIT-FINDINGS.md` is expected to fail or only update local mock UI.
- Existing tests do not catch this because the UI TSX is not typechecked and there is no composition test asserting that `Chat.jsx` mounts for a real text channel.

Required fix:

- Add an explicit `messageBody?: React.ReactNode` prop to `ChannelViewProps`.
- Render `messageBody` for text channels before falling back to `TextChannelView`.
- Add a test that renders `AuthenticatedApp` with a text channel and asserts the legacy `Chat` mock receives `channelId`, `serverId`, `baseUrl`, `wsClient`, and store callbacks.

### P0-2 - The TypeScript gate does not typecheck the UI port

Location:

- `tsconfig.json:17`

`tsconfig.json` includes only `src/audio/**/*.ts`. Running `bunx tsc --noEmit --listFilesOnly` lists audio files only; it does not include `src/components/**/*.tsx`, `src/adapters/**/*.ts`, `src/App.jsx`, or `src/main.jsx`.

Impact:

- `bunx tsc --noEmit` passing is not evidence that the port is type-safe.
- The `messageBody` bug above would have been caught by normal TSX checking.
- The many `@ts-expect-error legacy JS` imports in `authenticated-app.tsx` are hiding exactly the contracts that matter most.

Required fix:

- Introduce a real app tsconfig that includes `src/**/*.ts`, `src/**/*.tsx`, and either intentionally excludes JS or runs `allowJs` with gradual boundaries.
- Make CI run this app typecheck.
- Do not list typecheck as a completed gate until it covers the ported UI.

### P0-3 - Backend system channels are handled incorrectly

Location:

- `hush-server/internal/api/servers.go:29-34`
- `hush-server/internal/api/servers.go:171-182`
- `hush-server/internal/api/channels.go:107-118`
- `src/adapters/useChannelsForServer.ts:21-29`
- `src/adapters/useChannelsForServer.ts:89-101`
- `src/components/authenticated-app.tsx:112-116`

The backend always ensures a real channel with `type: "system"` exists and `GET /api/servers/{serverId}/channels` returns all channels. The frontend adapter declares `RawChannel.type` as only `"category" | "text" | "voice"` and maps every non-category to `ChannelKind` via `kind: c.type as ChannelKind`.

At runtime, a backend `type: "system"` channel becomes a malformed `Channel` with `kind: "system"`, while the shell also injects hardcoded fake system channels with ids `server-log` and `moderation`.

Impact:

- The real backend system channel can appear in the normal channel list with a text icon.
- DnD can attempt to move a system channel, which the backend explicitly rejects.
- Clicking the real system channel does not route to `SystemChannelView`; only the fake ids do.
- The UI now has two concepts called system channel: one real data row and two fake UI rows.

Required fix:

- Model `system` explicitly in the adapter.
- Exclude real system channels from draggable normal channels or map them into the system section.
- Stop inventing fake backend channel ids for system surfaces; use a display-level system view keyed separately from backend channel ids if needed.

### P0-4 - Radix trigger refs are broken by local wrapper components

Evidence from user console log:

- `Function components cannot be given refs`, render path `Primitive.button.SlotClone -> Button -> TooltipTrigger -> RailIcon`.
- Same warning through `DropdownMenuTrigger -> SidebarMenuButton`, both in `ServerHeader` and `UserMenu`.

Location:

- `src/components/ui/button.tsx:44-64`
- `src/components/ui/sidebar.tsx:488-512`
- `src/components/server-rail.tsx:220-242`
- `src/components/server-rail.tsx:379-394`
- `src/components/channel-sidebar.tsx:369`
- `src/components/user-menu.tsx:50`

`Button` and `SidebarMenuButton` are plain function components. They are used as children of Radix `asChild` triggers (`TooltipTrigger`, `DropdownMenuTrigger`, `ContextMenuTrigger`). Radix Slot clones the child and attaches trigger props plus refs. React then warns that the function component cannot receive that ref.

Impact:

- This is a real-browser explanation for tooltips, dropdowns, and context menus behaving inconsistently even while jsdom tests pass.
- Radix uses refs for trigger measurement, focus restoration, popper anchoring, and composed event plumbing. Losing the ref can break menu placement and interaction behavior.
- The nested `ContextMenuTrigger asChild` + `TooltipTrigger asChild` stack in `RailServer` is especially fragile because two Slot layers target the same `Button`.

Required fix:

- Make primitive wrappers used under Radix `asChild` ref-compatible (`Button`, `SidebarMenuButton`, and similar `asChild` components).
- Prefer a single Slot owner per trigger surface; avoid nesting `ContextMenuTrigger asChild` around `TooltipTrigger asChild` around the same custom component unless the child forwards refs correctly.
- Add a browser-level regression test or Playwright smoke for right-click and dropdown opening; jsdom did not catch this.

### P1-0 - PIN unlock auto-focus ref is broken

Evidence from user console log:

- `Function components cannot be given refs`, render path `PinUnlockPanel -> Input`.

Location:

- `src/components/auth/pin-unlock-panel.tsx:58-66`
- `src/components/auth/pin-unlock-panel.tsx:165-178`
- `src/components/ui/input.tsx:5-17`

`PinUnlockPanel` passes `ref={inputRef}` to `Input`, but `Input` is a plain function component. The ref never reaches the underlying `<input>`, so `inputRef.current?.focus()` is ineffective.

Impact:

- PIN unlock loses the intended initial focus.
- Any future code relying on `Input` refs will silently fail in the same way.

Required fix:

- Make `Input` ref-compatible.
- Add a test asserting the PIN input is focused on mount, preferably with the warning promoted to a test failure.

### P1-1 - Server rail permissions are wrong for every non-active server

Location:

- `src/components/server-rail.tsx:139-148`
- `src/components/server-rail.tsx:212-215`
- `src/components/authenticated-app.tsx:260-266`
- `src/components/authenticated-app.tsx:747`
- `src/components/authenticated-app.tsx:823`

`ServerRail` asks `getServerRole(server.id)` for each server. `AuthenticatedApp.getServerRole` returns a role only when `serverId === activeServer?.id`; all non-active servers get `undefined`.

This creates incorrect menu behavior:

- Non-active owned servers show "Leave server" instead of "Delete server".
- Non-active admin/owner servers have "Server settings" disabled.
- `onOpenServerSettings` receives a server id from the rail, but `AuthenticatedApp` ignores it and opens settings for `activeServer`.

Impact:

- This directly explains part of the reported "right-click menus aren't there / buttons don't work" symptom.
- It also allows destructive UI affordances to be shown for the wrong role and then fail at the backend.

Required fix:

- Role must be part of the server/guild adapter result or fetched per server.
- Settings dialog state must track the target server id, not implicitly use `activeServer`.
- Add tests for right-clicking a non-active owned/admin/member server.

### P1-1b - Resizable panel persistence uses a stale prop

Evidence from user console log:

- `React does not recognize the autoSaveId prop on a DOM element`.

Location:

- `src/components/authenticated-app.tsx:793-797`
- `src/components/ui/resizable.tsx:7-19`
- Installed package: `react-resizable-panels@4.10.0`.

The wrapper passes `autoSaveId="hush-shell-v3"` to `ResizablePrimitive.Group`. In the installed `react-resizable-panels` API, `GroupProps` does not define `autoSaveId`; it supports `id`, `defaultLayout`, `onLayoutChange`, `onLayoutChanged`, and `useDefaultLayout`. Unknown props are forwarded to the DOM, producing the warning.

Impact:

- The sidebar layout is probably not being persisted despite the code implying it is.
- The warning is another signal that UI dependency APIs were copied from a prototype or older package without contract verification.

Required fix:

- Replace `autoSaveId` with the v4 persistence API (`id` plus `useDefaultLayout`/`onLayoutChanged`, or explicit localStorage handling).
- Add a test for saved layout restore if persistence is required.

### P1-2 - Kick member is wired to a backend-invalid request

Location:

- `src/components/authenticated-app.tsx:192-201`
- `src/lib/api.js:1033-1041`
- `hush-server/internal/api/moderation.go:103-110`
- `src/components/members-sidebar.tsx:266-285`

The UI calls `kickUser(token, activeServer.id, member.id, "", baseUrl)`. The backend requires `reason` to be non-empty and returns `400` for an empty reason.

Impact:

- The kick confirmation UI looks wired but always fails against the real server.
- The user receives no inline error; the shell only logs `console.error("kickUser failed", err)`.

Required fix:

- Add a required reason field to the kick dialog, or supply a deliberate default reason accepted by product policy.
- Surface API failure inside the dialog.
- Add a test that asserts `kickUser` is called with a non-empty reason, plus an API-contract test against a 400 response.

### P1-3 - Channel DnD persists during hover, not only on drop

Location:

- `src/components/channel-sidebar.tsx:671-704`
- `src/components/channel-sidebar.tsx:706-755`
- `src/adapters/useChannelsForServer.ts:137-173`

`handleDragOver` calls `onChannelsChange` whenever the dragged channel crosses a category. `useChannelsForServer.onChannelsChange` immediately does optimistic state and starts sequential `moveChannel` API calls for every item. `handleDragEnd` then calls it again.

Impact:

- A user can persist partial category moves before releasing the drag.
- Dragging across categories can emit many backend writes in one interaction.
- Failed mid-hover writes trigger refetch rollback while the user is still dragging.
- The test named as DnD coverage only calls `onChannelsChange` directly; it does not exercise DnD events or hover behavior.

Required fix:

- Keep drag-over state local to the DnD component.
- Persist exactly once in `handleDragEnd`.
- Debounce or batch move operations server-side/client-side.
- Add a component-level DnD test or integration test that asserts no API move happens before drop.

### P1-4 - `onDeleteChannel` exists but is not reachable

Location:

- `src/components/authenticated-app.tsx:217-224`
- `src/components/channel-sidebar.tsx:198`
- `src/components/channel-sidebar.tsx:227`
- `src/components/channel-sidebar.tsx:583-595`
- `src/components/channel-sidebar.tsx:1043-1081`

`AuthenticatedApp` defines `handleDeleteChannel` and passes it into `ChannelSidebar`. `ChannelSidebar` accepts and forwards `onDeleteChannel`. No channel row renders a context menu or delete action using it.

Impact:

- The prop makes the code look more complete than the UI is.
- Channel deletion is not actually user-accessible from the ported sidebar.

Required fix:

- Either implement a per-channel context menu with an `AlertDialog`, or remove the prop and document deletion as not wired.
- Add a test covering actual delete affordance, confirmation, and API call.

### P1-5 - Several visible controls are still inert

Location:

- `src/components/server-rail.tsx:178-187`
- `src/components/server-rail.tsx:381-384`
- `src/components/channel-sidebar.tsx:1003-1010`
- `src/components/members-sidebar.tsx:318-324`

The rail "Add server" and "Discover" buttons render real buttons with no handlers. The category plus button renders with no handler. The profile card "Send message" button has no handler even though the context-menu "Send message" path is wired.

Impact:

- This is another direct explanation for "buttons don't work".
- These controls are keyboard-focusable and announced as actions but perform no action.

Required fix:

- Wire them, disable them with clear affordance, or remove them until implemented.
- For "Discover", use the existing `/explore` route.
- For profile "Send message", reuse `onDirectMessage`.

### P1-6 - Role-string fallback can overgrant `moderator`

Location:

- `src/adapters/types.ts:73-80`

`ROLE_STRING_TO_LEVEL` maps `"moderator"` to `2`, which then becomes `"admin"`. The integer model is `0=member, 1=moderator, 2=admin, 3=owner`.

Impact:

- If any backend/mock/federated path emits `role: "moderator"` instead of `permissionLevel: 1`, the UI grants admin affordances.
- The current Go member-list endpoint returns `permissionLevel`, but the fallback exists specifically for alternate response shapes, so it must be correct.

Required fix:

- Map `"moderator"` to `1`.
- Add test coverage for `memberRoleFromRaw({ role: "moderator" })`.

### P1-7 - `AUDIT-FINDINGS.md` contains local private paths

Location:

- `AUDIT-FINDINGS.md:221-223`

The document committed to `hush-web` includes absolute local paths under `/Users/yarin/development/...`.

Impact:

- This violates the repository's public/private boundary rule.
- The branch is already tracking `origin/feature/ui-port-from-prototype`, so if this repo is public or shared externally, the leak is in pushed history.

Required fix:

- Replace local absolute paths with repo-relative commands.
- If the branch is public, rewrite the pushed branch history rather than leaving the leak behind a follow-up commit.

### P2-1 - Debug toolbar and Eruda are always enabled in Vite dev

Location:

- `src/main.jsx:9-176`

Any Vite dev session imports Eruda and injects a high-z-index debug toolbar. `AUDIT-FINDINGS.md` already suspects Eruda may interfere with context menus. The toolbar also registers pointer handlers and sits at `zIndex: 99999`.

Impact:

- It can distort manual smoke results for exactly the click/context-menu bugs currently under investigation.
- It is not behind an explicit opt-in flag; `import.meta.env.DEV` is enough.

Required fix:

- Gate Eruda and toolbar behind explicit `VITE_DEBUG_TOOLBAR === "true"`.
- Run manual click/menu smoke both with and without the toolbar disabled.

### P2-2 - Architecture is concentrated in god components

Location:

- `src/components/authenticated-app.tsx`: 1006 lines.
- `src/components/channel-sidebar.tsx`: 1201 lines.

`AuthenticatedApp` owns route parsing, API mutations, authorization decisions, DM routing, voice lifecycle, keyboard shortcuts, favorites, theme toggling, settings, and rendering. `channel-sidebar.tsx` owns layout, DnD, dialogs, invite creation UI, context menus, and bottom dock composition.

Impact:

- This directly enabled the `messageBody` prop loss and rail-role bugs.
- It violates the local AGENTS/CLAUDE limits and makes future review brittle.

Required fix:

- Extract route selection, server actions, voice session state, and channel DnD persistence into focused hooks/services.
- Keep UI components mostly presentational.

### P2-3 - Build output confirms serious bundle pressure

Location:

- Build output from `bun run build`.
- `src/lib/api.js` warning emitted by Vite.

Build succeeded, but produced large chunks:

- `mermaid-*.js`: 3,345.10 kB minified.
- `Chat-*.js`: 677.03 kB.
- `index-*.js`: 637.91 kB.
- `hush_crypto_bg-*.wasm`: 1,623.96 kB.

Vite also warns that `src/lib/api.js` is dynamically imported by `useAuth.js` but statically imported by many port files, so dynamic import cannot split it.

Impact:

- Slow first load and poor cache behavior.
- Ported TSX imports may have accidentally pulled heavier routes/components into the main shell.

Required fix:

- Split legacy pages and heavy markdown/code/mermaid paths from authenticated shell.
- Review `react-syntax-highlighter`/`streamdown`/Mermaid loading.
- Avoid static imports that defeat intended dynamic chunks.

### P2-4 - Accessibility and motion gaps remain

Locations:

- `package.json` / global scan: motion library with no reduced-motion handling.
- `src/components/auth/auth-flow.tsx:135`
- `src/components/auth/auth-flow.tsx:940`
- `src/components/channel-sidebar.tsx:871`
- Legacy clickable non-interactive elements reported by `react-doctor`.

Findings:

- No project-level `prefers-reduced-motion` handling despite `motion`, `tw-animate-css`, pulse/spin animations, and Radix entrance animations.
- `href="#"` for the GitHub link.
- QR placeholder uses `bg-black`/`bg-white` raw colors.
- `autoFocus` in the create-channel dialog.
- Legacy `Room`, `VoiceChannel`, `ExplorePage`, and `ScreenShareCard` still have clickable static elements without keyboard handlers/roles.

Impact:

- WCAG and keyboard-accessibility gaps remain after the UI port.
- Some are inherited legacy issues, but the port now presents them inside the new shell.

Required fix:

- Add reduced-motion CSS and use `useReducedMotion` for JS motion.
- Replace `href="#"` with a real URL or a button.
- Use design tokens for QR colors.
- Remove or justify `autoFocus`.
- Fix legacy clickable static elements as part of the legacy residual port.

### P2-5 - Tests cover leaves but not integration contracts

Evidence:

- `src/components/server-rail.test.tsx` stubs `getServerRole` as a constant function and never tests non-active server role resolution.
- `src/components/channel-sidebar.test.tsx` says DnD is covered elsewhere, but adapter tests only call `onChannelsChange` directly.
- No test asserts `Chat.jsx` is rendered by `AuthenticatedApp`.
- No test asserts kick sends a backend-valid reason.
- No test covers actual backend `type: "system"` channel rows.

Impact:

- The suite can stay green while the app fails core manual smoke paths.

Required fix:

- Add composition tests around `AuthenticatedApp`.
- Add adapter tests with real backend-shaped payloads, including `type: "system"`.
- Add negative tests for backend contract mismatches.

## Positive Findings

- The branch removed a large amount of legacy presentation code and added focused tests for many new leaf components.
- Backend contracts for channels, moderation, invites, and system messages are explicit and well-tested on the Go side.
- `useInstances` already separates `dmGuilds` from `mergedGuilds`, so the DM-vs-server separation is conceptually sound.
- The branch did fix a real role-mapping issue for numeric `permissionLevel`, but the string fallback still needs correction.

## Recommended Repair Order

1. Fix `ChannelView` to render the real `Chat.jsx` slot, and add the missing composition test.
2. Fix `tsconfig.json`/CI so TSX is actually typechecked.
3. Make primitive wrappers ref-compatible for Radix Slot (`Input`, `Button`, `SidebarMenuButton`, and similar `asChild` wrappers), then retest right-click/dropdown behavior in a real browser.
4. Model backend `system` channels explicitly and remove fake/duplicate system-channel handling.
5. Fix rail role lookup for non-active servers and target-server settings state.
6. Fix kick reason/error UX, inert buttons, and the stale `autoSaveId` resizable-panels API use.
7. Refactor DnD persistence so backend writes happen once on drop.
8. Remove private absolute paths from `AUDIT-FINDINGS.md`; rewrite branch history if this was pushed to a public/shared remote.
9. Run manual browser smoke against real backend only after the above, with debug toolbar/Eruda disabled unless explicitly needed.
