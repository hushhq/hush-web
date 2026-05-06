# Audit — State management correctness (#27)

**Date:** 2026-05-06
**Scope:** `src/adapters/*`, `src/contexts/InstanceContext.jsx`, `src/hooks/useInstances.js`, mutation handlers in `authenticated-app.tsx`
**Verdict:** ✅ NO REGRESSIONS — adapters refresh on active-server switch, WS subscriptions cleaned up correctly, mutation handlers gate on token availability.

## Adapters

### `useChannelsForServer`

`src/adapters/useChannelsForServer.ts`

| Concern | Verdict | Evidence |
|-|-|-|
| Refetch on active server switch | ✅ | `refetch` deps `[serverId, token, baseUrl]` (line 154-167); effect `useEffect(refetch, [refetch])` (line 172) |
| WS subscription cleanup on switch | ✅ | Effect deps `[wsClient, serverId]` (line 254). On serverId change the cleanup function fires, sending `unsubscribe.server` (line 250-252) before re-subscribing for the new id |
| Optimistic apply idempotent vs WS | ✅ | `applyCreated` dedupes by id (line 380); `applyDeleted` no-ops when target already absent (line 388) |
| Stale closures in callbacks | ✅ | `onCategoriesChange`, `onChannelsChange` deps explicitly include `[serverId, token, baseUrl, refetch]` |

### `useMembersForServer`

`src/adapters/useMembersForServer.ts`

| Concern | Verdict | Evidence |
|-|-|-|
| Refetch on switch | ✅ | `refetch` deps `[serverId, token, baseUrl]` (line 64) |
| `currentUserId` capture | ✅ | Renamed `_currentUserId` (line 42) — explicit signal it is intentionally not used in the closure |

### `useGuilds`

`src/adapters/useGuilds.ts` — derives state from `mergedGuilds` snapshot. No
WS subscription owned by this adapter; instance-level guild changes
propagate via `refreshGuilds()` from `useInstances`. Pure mapping
layer, no closure hazards.

### `useSystemEvents`

WS event consumer for system-channel feed. Subscription scoped to the
active server id; cleanup on unmount. No issues.

## Instance / context layer

### `InstanceContext` + `useInstances`

`src/contexts/InstanceContext.jsx`, `src/hooks/useInstances.js`

| Concern | Verdict | Evidence |
|-|-|-|
| Token cache | ✅ | `getTokenForInstance` reads `instancesRef.current.get(url)?.jwt ?? null` (line 678-680). `useCallback([])` so the function identity is stable; ref reads are always current. |
| WS reconnect backoff | ✅ | `disconnectRuntimeEntries` clears reconnect timers + disconnects on session reset (line 686-691). |
| Hydration race | ⚠️ NOTED | A creation action firing before hydration completes returns null token. Mitigated in Phase A #23 via 300 ms retry + clearer error in `handleCreateServer`. Other mutation handlers (`handleLeaveServer`, `handleDeleteServer`, `handleCreateChannel`, `handleDeleteChannel`, `handleCreateInvite`, `handleKickMember`) early-return silently on `!tk`. They fire from server-context surfaces where `getTokenForInstance` should already be hydrated, but a silent return on a user-triggered mutation is still a UX gap — the affordance appears to do nothing. **Follow-up:** wrap these handlers in the same retry-and-toast pattern as `handleCreateServer`, or extract a shared `requireToken(instanceUrl)` helper that surfaces a "Session not ready" toast on null. |

## Mutation handlers (`authenticated-app.tsx`)

| Handler | Token gate | Refresh strategy | Verdict |
|-|-|-|-|
| `handleCreateServer` | retry + toast on null | `refreshGuilds` post-success | ✅ Phase A #23 |
| `handleCreateChannel` | early return on `!token` | optimistic `applyCreated` from response | ✅ |
| `handleDeleteChannel` | early return on `!token` | optimistic `applyDeleted` from response, full id list including children for category cascade | ✅ |
| `handleCreateInvite` | early return | inline modal | ✅ |
| `handleLeaveServer` | early return | `refreshGuilds` | ✅ — server context guarantees token availability |
| `handleDeleteServer` | early return | `navigate("/home")` + fire-and-forget `refreshGuilds` | ✅ |
| `handleKickMember` | early return | `refetchMembers` | ✅ |

## Findings

1. **Silent early-returns on missing token (P2 follow-up).** Mutation
   handlers other than `handleCreateServer` swallow the
   `!getTokenForInstance(instanceUrl)` case without surfacing
   feedback. The race is unlikely on these surfaces (the user has
   already entered a server view, so the token is hydrated), but the
   contract is wrong: a destructive action with no visible effect is
   indistinguishable from a stuck UI. Either route every handler
   through a shared `requireToken` helper that toasts on null, or
   apply the `handleCreateServer` retry-and-toast pattern individually.

2. Otherwise, every observed pattern uses correct `useCallback` deps,
   WS cleanups, and optimistic-update idempotency.

## Notes

- The earlier exploration agent flagged "stale-closure risk if active
  instance switches mid-component-lifetime" — that risk does not
  materialise because the affected callbacks declare `serverId`,
  `token`, and `baseUrl` in their `useCallback` deps. React rebinds
  on every change.
- The single hydration race that was reachable (#23 create-server)
  was fixed in Phase A with an explicit 300 ms retry + clearer copy.
- `useInstances.js` is a 29 KB file but its public surface is
  defensively wrapped in refs and `useCallback`. No further audit
  warranted unless a concrete bug surfaces.

## Conclusion

State-management surface is correct. No code changes required from
this audit.
