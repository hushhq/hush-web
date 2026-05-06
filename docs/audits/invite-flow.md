# Audit — Invite flow vs legacy (#29)

**Date:** 2026-05-06
**Comparison:** `hush-web` HEAD vs `hush-legacy-stable/hush-web`
**Verdict:** ✅ FUNCTIONAL PARITY — 7/7 steps match

## Walkthrough

### 1. Create-invite UI

| Tree | Location |
|-|-|
| Current | `src/components/channel-sidebar.tsx:517-525` |
| Legacy | `src/components/ChannelList.jsx:1091` |

Both expose "Invite people" in the server-header dropdown, gated by
`canAdministrate` / `isAdmin`. Current uses shadcn
`DropdownMenuTrigger` + `Dialog`; legacy uses a portal modal. UI
markup differs, behaviour matches.

**Verdict:** MATCHES (with UI refactor only).

### 2. Create-invite API call

```js
// Both:
createGuildInvite(token, serverId, opts = {}, baseUrl = '')
//   → POST /api/servers/{serverId}/invites
//   → res.json() unchanged
```

Both throw on `!res.ok`. Response shape parses identically.

**Verdict:** MATCHES exactly.

### 3. Display invite

| Tree | Location |
|-|-|
| Current | `src/components/channel-sidebar.tsx:558-593` |
| Legacy | `src/components/ChannelList.jsx:311-429` |

Both render the URL in a read-only field plus a Copy button (1.5s
feedback in current, 2s in legacy). Both surface "Generating invite…"
while pending, both render expiry text.

**Notable copy difference:** legacy hardcodes "expires in 7 days, can
be used 50 times"; current uses generic "Single-use unless server
policy allows reuse." Acceptable since the limit metadata is now
server-side and the client should not assume.

**Verdict:** MATCHES (acceptable UX text divergence).

### 4. Open invite link

| Concern | Current | Legacy |
|-|-|-|
| `?join=<code>` deeplink | `App.jsx` ~line 105 | `App.jsx` ~line 105 |
| Same-instance route | `/invite/:code` → `pages/Invite.jsx:54-116` | identical |
| Cross-instance route | `/join/:instance/:code` (blocked, MVP guard) | identical |
| Locked-browser redirect | `/?returnTo=...` + sessionStorage queue | identical |

**Verdict:** MATCHES.

### 5. Accept-invite endpoint + error mapping

Both call `POST /api/invites/claim` with `{ code }`. Error→message
mapping is byte-identical:

```js
- /not found|expired|no longer valid/i → "Invite not found or expired"
- /already.*member|409/i              → "You are already a member"
- /banned/i                            → "You are banned from this guild"
- /invalid|expired|400/i               → "Invite is invalid or expired"
```

Status codes (401 / 403 / 409 / 410 / 200) preserved on both ends.

**Verdict:** MATCHES exactly.

### 6. Post-join navigation

`pages/Invite.jsx:109-117` (current) and the legacy equivalent both:
1. Store invite-metadata key for MLS decryption.
2. Call `refreshGuilds(targetInstanceUrl)`.
3. Navigate to `/servers/{serverId}/channels`.

Guild list refreshes before navigation, so the new server appears in
the sidebar without waiting for the next WS broadcast.

**Verdict:** MATCHES.

### 7. Error UX

Both surfaces share the `inviteErrorMessage()` helper output:

- Loading: "Loading invite…" / "Generating invite…"
- Unauthenticated: "Sign in to join" button
- Error: human-readable message + "Return to home"
- Recovery: "Retry setup" for post-claim MLS failures

Markup differs (shadcn Dialog vs portal modal); copy + branching
identical.

**Verdict:** MATCHES.

## Findings

| Severity | Item |
|-|-|
| (none) | No DRIFT or MISSING items detected |

## Notes

- Current `fetchWithAuth` adds a device-revocation surface (`lib/api.js:122-133`)
  that is defensive instrumentation, not invite-specific. It does not
  change the invite contract.
- Cross-instance invites remain blocked with MVP messaging in both
  trees; that is a known scope cap, not a regression.
- The MLS metadata key encoding survives the rewrite: invite-encoded
  channel keys decode the same way on both sides.

## Conclusion

Invite flow is at production-stable parity with the legacy baseline.
No code changes required.
