# Review Report - Last Five Commits

Date: 2026-05-06

Scope: the latest five committed revisions in `hush-web`, reviewed from committed `HEAD` blobs so later uncommitted edits do not pollute the result.

Reviewed commits:

| Commit | Date | Subject |
|-|-|-|
| `db41455` | 2026-05-06 07:33:49 +0200 | `docs(audits): server limits, single-tab, invite, device-linking, state-mgmt` |
| `a3193f6` | 2026-05-06 07:33:35 +0200 | `feat(ui): palette create-channel, 12-words checkbox, mobile sidebar close, back-to-PIN, Home -> Early Bird modal` |
| `d5d48f5` | 2026-05-06 07:33:14 +0200 | `style(ui): visual polish sweep - theme lock, blocked-tab page, OTP cells, destructive contrast, empty states, avatar ring` |
| `8be5b2a` | 2026-05-06 07:32:53 +0200 | `fix(ui): disable orphan affordances across rail, sidebar, palette and channel header` |
| `189ab47` | 2026-05-06 07:32:33 +0200 | `fix(critical): logout dialog freeze + dead Logout button + create-server token race` |

## Findings

### P1 - Invite acceptance still routes to a dead legacy path

`docs/audits/invite-flow.md:81-91` claims post-join navigation has functional parity and navigates successfully after `refreshGuilds()`. The code at `src/pages/Invite.jsx:109-117` still navigates to `/servers/${serverId}/channels`, while the app router redirects `/servers/:serverId/*` to `/home` at `src/App.jsx:175-180`.

Result: a successfully claimed invite does not land on the joined server in the current instance-aware route model. The audit commit did not achieve its stated "7/7 parity" verdict for post-join navigation.

Required fix: build the instance-aware guild route after claim, using the target instance host plus `buildGuildRouteRef(...)`, then navigate to `/:instance/:guildSlug` or its system channel. The audit document should be corrected after the code is fixed.

### P1 - New servers can still open the first normal channel instead of the system channel

`src/components/authenticated-app.tsx:509-528` correctly prefers the first backend system channel as the fallback active channel. That is immediately undermined by `src/components/authenticated-app.tsx:671-676`, which redirects every server root with no `channelSlug` to `channels[0]`.

Result: when the instance default template creates normal channels, a newly created server is forwarded into the first text or voice channel. This bypasses the system-channel-first behavior and can reintroduce the blank or wrong chat surface the prior fixes were meant to eliminate.

Required fix: remove or rewrite the auto-redirect effect so the server root stays on the resolved system channel. If a URL slug is required, navigate to the first system channel id, not `channels[0]`.

### P2 - Create-server UI is not limit-aware

The create-server dialog only gates on a non-empty name at `src/components/authenticated-app.tsx:1349-1353`. The mutation posts directly to `createGuild(...)` at `src/components/authenticated-app.tsx:467-474` and surfaces whatever server error comes back.

This preserves server-side authority, but it does not reflect the admin-configured instance limit in the UI. If the configured guild quota is exhausted, the `+` affordance remains enabled and the user discovers the policy only after submission.

Required fix: expose the relevant instance policy/usage through the instance context or a small dedicated capability endpoint, then disable or explain the create affordance before submit. Backend enforcement must remain the source of truth.

### P2 - Logout is no longer dead, but failure handling is incomplete

`189ab47` correctly wires `onSignOut` through the bottom dock/user menu and closes the Radix dialog before awaiting logout. However, `src/components/user-menu.tsx:125-138` runs `Promise.resolve(onSignOut()).finally(...)` without a `catch`.

Result: if `performLogout()` rejects, the rejection is unhandled and the user gets no actionable error. This is not the original freeze/dead-button failure, but the destructive action still lacks a complete failure path.

Required fix: await in an async handler or append `.catch(...)`, show a small error state, and keep the menu usable.

### P2 - Palette create-channel/category is wired but under-tested

`src/components/command-palette.tsx:166-179` exposes create-channel/category items, `src/components/authenticated-app.tsx:1293-1301` dispatches `hush:open-create-channel`, and `src/components/channel-sidebar.tsx:778-819` receives the event and submits through the existing dialog.

This likely works for an active admin server, but there is no unit or integration test that clicks the palette item and verifies the channel dialog opens. `src/components/command-palette.test.tsx:47-67` does not pass `onCreateChannel` into the component under test.

Required fix: add a test for enabled palette create-channel/category actions and the disabled non-admin/no-active-server state.

## Outcome By Commit

### `189ab47`

Mostly achieved.

- Logout button is wired through `BottomDock` and `UserMenu`.
- The dialog-freeze mitigation is credible: the alert dialog is opened on the next tick and closed before awaiting logout.
- The create-server token race now retries once after 300 ms and gives a clearer "Session not ready" error.
- Gaps: logout rejection is unhandled; create-server still redirects through logic that can bypass the system channel; create-server UI is not limit-aware.

### `8be5b2a`

Achieved, with one documentation cleanup.

- Unsupported rail/palette/header affordances are disabled or hidden: Discover, theme toggle, pinned messages, and non-shipping settings sections.
- Member context actions for DM, kick, and copy ID are intentionally disabled at `src/components/members-sidebar.tsx:239-270`.
- Cleanup needed: `src/components/members-sidebar.test.tsx:1-5` still describes the old contract where send-message could be enabled and copy ID was always available. The assertions match the new behavior, but the file header is stale.

### `d5d48f5`

Mostly achieved.

- Forced dark prepaint is applied in `src/App.jsx:14-17`.
- `ThemeProvider` force-locks the resolved theme to dark at `src/components/theme-provider.tsx:52-94`.
- Blocked-tab, OTP setup cells, destructive button contrast, and empty-state polish are present.
- Note: the commit text says "No behavioural changes", but forced dark mode and disabled theme switching are behavioral changes. They may be intended, but the commit description is inaccurate.

### `a3193f6`

Partially achieved.

- Recovery phrase progression is now gated by an explicit saved-phrase checkbox at `src/components/auth/auth-flow.tsx:567-678` and `src/components/auth/auth-flow.tsx:893-911`.
- Back-to-PIN is wired from `UnauthenticatedShell` to `AuthFlow` at `src/components/auth/unauthenticated-shell.tsx:62-121` and rendered at `src/components/auth/auth-flow.tsx:253-267`.
- Mobile channel selection closes the mobile sheet via `setOpenMobile(false)` in `src/components/channel-sidebar.tsx:274-280`.
- Home no longer exposes server settings/invite actions and instead shows the Early Bird info menu at `src/components/channel-sidebar.tsx:540-599`.
- Palette create-channel/category is wired but lacks coverage.

### `db41455`

Mixed.

- `device-linking.md` correctly identifies that the visible `LinkDevicePanel` is UI-only despite API helpers existing.
- `single-tab.md` matches the current `useSingleTab` implementation at a code-inspection level.
- `server-limits.md` correctly reinforces that guild/server limits belong on the server tier, not the client.
- `invite-flow.md` is materially wrong for post-join navigation, as described in P1.
- `state-mgmt.md` is too optimistic: it treats silent early returns on missing tokens as acceptable. For user-triggered mutations, missing token paths should produce explicit UI feedback unless the path is provably unreachable.

## Verification

Commands run:

```bash
npm run typecheck
npm run test:run -- src/components/command-palette.test.tsx src/components/channel-sidebar.test.tsx src/components/members-sidebar.test.tsx src/components/auth/unauthenticated-shell.test.tsx src/components/auth/auth-flow.test.tsx src/components/auth/pin-unlock-panel.test.tsx src/components/auth/pin-setup-panel.test.tsx
npx -y react-doctor@latest . --verbose --diff
```

Results:

- Typecheck passed.
- Targeted Vitest run passed: 7 files, 35 tests.
- React Doctor reported 76/100 with 1 error at `src/components/chat-real.tsx:588`: conditional `useContext`. That file was not modified by these five commits, so I am not treating it as a direct finding for this review, but it should be fixed separately.

## Working Tree Note

The local worktree had uncommitted edits in these files before this report was written:

- `src/App.jsx`
- `src/components/settings-dialog.tsx`
- `src/components/voice/voice-participant-grid.tsx`
- `src/hooks/useInstances.js`
- `src/main.jsx`

This report reviewed committed content via `git show HEAD:...` to avoid attributing those later edits to the five commits above.
