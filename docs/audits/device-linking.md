# Audit — Device-linking flow (#30)

**Date:** 2026-05-06
**Scope:** `LinkDevicePanel`, `src/lib/api.js`, `hush-server/internal/api/devices.go`, legacy `DeviceLinkModal.jsx`
**Verdict:** ❌ UI-ONLY — frontend `LinkDevicePanel` makes zero backend calls. Backend + API client layer are fully implemented and at parity with legacy.

## Component-by-component

### `src/components/auth/auth-flow.tsx:440-539` (`LinkDevicePanel`)

| Concern | State |
|-|-|
| QR generation | **Fake** — `FakeQR` (line 1012) deterministic from a counter |
| Code generation | **Fake** — `generateFallbackCode()` (line 1049-1056), pure client-side random string |
| Backend calls | **Zero** |
| Copy / regen / countdown | Cosmetic only |

### `src/lib/api.js`

All four backend endpoints are **wired client-side**, ready to consume:

| Helper | Endpoint | Lines |
|-|-|-|
| `createDeviceLinkRequest(body, baseUrl)` | `POST /api/auth/link-request` | 738-758 |
| `resolveDeviceLinkRequest(token, body, baseUrl)` | `POST /api/auth/link-resolve` | 768-783 |
| `verifyDeviceLinkRequest(token, body, baseUrl)` | `POST /api/auth/link-verify` | 793-810 |
| `consumeDeviceLinkResult(body, baseUrl)` | `POST /api/auth/link-result` | 822-841 |

### `hush-server/internal/api/devices.go`

All backend handlers fully implemented and at legacy parity:

- `POST /api/auth/link-request` (line 388) — creates 5-min link request, returns QR handle + code
- `POST /api/auth/link-resolve` (line 470) — existing device claims request, returns claim token
- `POST /api/auth/link-verify` (line 557) — existing device certifies + uploads relay payload
- `POST /api/auth/link-result` (line 691) — new device polls for relay payload

ed25519 certificate verification, transparency logging, rate
monitoring all present.

### Legacy comparison: `hush-legacy-stable/hush-web/src/components/auth/DeviceLinkModal.jsx`

- ed25519 keypair generated client-side (line 58-59)
- `listDeviceKeys()` baseline call on mount (line 122)
- Polling loop watches device count (line 129-133) for linking success
- Real QR rendered via `qrcode.toCanvas()` with server-issued payload (line 84)
- Code is server-managed, ephemeral

Current panel omits all five behaviours.

## Step-by-step gap

| # | Step | Current | Legacy |
|-|-|-|-|
| 1 | Generate new device keypair | ❌ | ✅ ed25519 |
| 2 | `POST /link-request` to seed | ❌ | ✅ |
| 3 | Render real QR from response | ❌ fake pixel grid | ✅ canvas |
| 4 | Server-issued code | ❌ random string | ✅ |
| 5 | Poll for approval | ❌ | ✅ list-device-keys interval |
| 6 | Existing device → `/link-resolve` | ❌ | ✅ |
| 7 | Existing device → `/link-verify` | ❌ | ✅ |
| 8 | New device → `/link-result` | ❌ | ✅ |

## Recommendation

**(a) Wire it up.** Backend is complete and battle-tested; API client
helpers exist. The work is purely frontend: ~200 LOC of crypto +
polling. Tracking it as "Shipping soon" buries an already-shipped
backend feature.

### Implementation outline

Files to touch:
- `src/components/auth/auth-flow.tsx` — replace `LinkDevicePanel` body
- `src/lib/deviceLinking.ts` — **new**, mirror legacy `lib/deviceLinking.js`
- `package.json` — confirm `qrcode` is present (legacy uses it)

Steps:

1. **Module: `src/lib/deviceLinking.ts`**
   - ed25519 keypair generation (use `@noble/ed25519` if not already a dep, or `tweetnacl`).
   - QR payload encoding `{ requestId, secret }`.
   - Helpers for the four request shapes.

2. **`LinkDevicePanel` rewrite**
   - On mount: generate keypair → `createDeviceLinkRequest({ devicePublicKey, sessionPublicKey, deviceId, ... })`.
   - Render server-issued QR (qrcode.toCanvas) and code.
   - Start polling: every 2-3 s call `consumeDeviceLinkResult({ requestId, secret })`; bail when status flips off-pending.
   - On success: persist relay payload to local vault, redirect to PIN unlock.
   - On expiry: surface a Regenerate button that re-runs step 1.

3. **Cleanup**
   - Delete `generateFallbackCode()`.
   - Delete `FakeQR`.
   - Drop the `qrSeed` / local `code` state; both come from the server.

### Effort

4-6 hours including manual two-tab smoke test and basic unit coverage.

### Alternative: (b) Disable

If the wire is deferred, downgrade the affordance honestly:

- `MainPanel` link to "Link to existing device" → `disabled` + tooltip
  "Shipping soon".
- Hide the route or bounce to home.

Effort: 15 min. Cost: user-visible regression and duplicate work
later.

## Conclusion

Recommend (a). The backend, API client, and legacy reference are all
ready; only the frontend needs to walk the steps. This is the smallest
remaining gap with the largest user-visible payoff in the current
iteration.
