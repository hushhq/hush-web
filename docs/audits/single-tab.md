# Audit — Single-tab takeover (#28)

**Date:** 2026-05-06
**Scope:** `src/hooks/useSingleTab.js`, `src/App.jsx`, `src/components/blocked-tab-view.tsx`
**Verdict:** ✅ FULLY WORKING

## Summary

The single-tab guarantee protects shared MLS / vault state from being
mutated concurrently across browser tabs. Implementation is fully
wired and matches the legacy contract (BroadcastChannel-based ping,
500 ms timeout, sessionStorage-scoped tab IDs). User-perceptible flow:
opening Hush in a second tab shows the blocked overlay; clicking "Use
this one instead" hands ownership to the new tab and the previous tab
flips to blocked on the next ping.

## Implementation

### `src/hooks/useSingleTab.js`

| Concern | Location | Notes |
|-|-|-|
| Per-tab UUID generation | `getTabId()` lines 17-24 | sessionStorage-scoped, new tab → new UUID, refresh → reuse |
| Ping protocol | lines 70-103 | Posts `session_ping` on mount, waits 500 ms |
| Same-tab refresh dedup | lines 84-93 | If `session_active` returns the same UUID, ignore (it's the pre-refresh response from the same tab) |
| Different-tab detection | lines 89-92 | Different UUID → set `isBlockedTab = true` |
| Existing-tab response | lines 78-82 | Primary tab replies to incoming pings with `session_active` |
| Takeover broadcast | lines 115-122 | `session_takeover` message; receivers yield (line 95-99) |
| Graceful degradation | lines 60-64 | BroadcastChannel unavailable → all tabs proceed normally (private-mode browsers) |

### `src/App.jsx`

- `useSingleTab()` consumed at line 268.
- `isBlockedTab` short-circuit at line 275 renders `BlockedTabView`.
- `blockedFlow` derives from path (`/link-device`, `/invite/`, `/join/`)
  to customize the message.

### `src/components/blocked-tab-view.tsx`

- Theme-synced shadcn surface (Phase C #1).
- Calls `takeOver()` from props on button click.

## Repro path (manual)

1. Open Hush in tab A. Wait for boot to complete.
2. Open Hush in tab B (Cmd+T, paste URL, Enter).
3. Tab B renders `BlockedTabView` with the prompt and the "Use this
   one instead" button.
4. Click in tab B. Tab B unblocks and proceeds to the auth flow.
5. Tab A receives `session_takeover` and flips to blocked on the next
   user action.

## Findings

None — behaviour matches the documented contract.

## Out of scope

- Multi-window detection across separate browser profiles. By design
  not addressed: each profile has its own BroadcastChannel namespace
  and its own vault state.
- Mobile browsers that aggressively suspend background tabs may
  occasionally miss `session_takeover` messages. Not a regression
  from legacy.
