# Audit — Server limits enforcement (#24)

**Date:** 2026-05-06
**Scope:** `hush-server` HEAD vs `hush-legacy-stable/hush-server`
**Verdict:** ⚠️ MIXED — core mutations are permission-gated and message + per-file attachment sizes are capped, but several quotas can be bypassed via alternate paths and there is no failed-login throttle.

The hush-web client is now considered untrusted for limit enforcement. Every gap below is a place where a tampered client can violate a stated policy without the server pushing back.

## A. Rate limits

| Layer | Limit | Where | Verdict |
|-|-|-|-|
| Global per-IP | 600 req/min, burst 300 | `main.go:247` (`api.IPRateLimiter`) | ENFORCED |
| Auth endpoints per-IP | 120 req/min, burst 60 | `main.go:279` | ENFORCED |
| MLS per-user | 300 req/min, burst 120 | `main.go:287` | ENFORCED |
| WebSocket per-client | 30 msg/min, burst 5; disconnect after 10 consecutive breaches | `internal/ws/ratelimit.go:6-13` | ENFORCED |

Response: `429` + `Retry-After: 60` + `{"error":"rate limit exceeded"}` (`internal/ws/ratelimit.go:41-54`). Identical to legacy.

## B. Message size

| Path | Limit | Where | Verdict |
|-|-|-|-|
| WS `message.send` | 8 KiB ciphertext | `internal/ws/handlers.go:20, 190-193` | ENFORCED — error frame "ciphertext too large" |
| Attachment presign | 25 MiB | `internal/api/attachments.go:149-153` | ENFORCED — `413` |
| Fan-out per-recipient | 8 KiB ciphertext | `internal/ws/handlers.go:225-227` | **PARTIAL** — oversize is logged but message is still inserted; should reject |

## C. Attachments

| Concern | Limit | Where | Verdict |
|-|-|-|-|
| Per-file size | 25 MiB | `attachments.go:26` | ENFORCED |
| Mime allowlist | image/* · audio/* · video/mp4 · video/webm · text/* · application/pdf | `attachments.go:37-44, 155-159` | ENFORCED — `415` |
| Presign TTL | 5 min | `attachments.go:31` | ENFORCED |
| Membership gate on download | yes | `attachments.go:251-260` | ENFORCED |
| Per-message attachment count | none | `attachments.go` | **MISSING** |
| Per-channel total quota | none | — | **MISSING** |

## D. Server / channel quotas

| Concern | Where | Verdict |
|-|-|-|
| Max servers per user | `servers.go:131-142`, `cfg.MaxServersPerUser` | ENFORCED at `POST /servers`; **MISSING** at invite-claim path |
| Max channels per server | `channels.go:createChannel` | **MISSING** |
| Max categories per server | — | **MISSING** |
| Max members per server | `effectiveMemberCap` defined `servers.go:15-25` | **PARTIAL** — defined but not checked at `joinServer` (`servers.go:508-607`) |

## E. Permission / role gating

| Endpoint | Min level | Where | Verdict |
|-|-|-|-|
| `createChannel` | Admin+ | `channels.go:70-73` | ENFORCED |
| `deleteChannel` | Admin+ | `channels.go:225-228` | ENFORCED |
| `moveChannel` | Admin+ | `channels.go:312-314` | ENFORCED |
| `deleteServer` | Owner | `servers.go:370` | ENFORCED |
| `leaveServer` | Forbid owner | `servers.go:482` | ENFORCED |
| `kickMember` | Mod+ AND actor > target | `moderation.go:116-128` | ENFORCED |
| `banMember` | Mod+ AND actor > target | `moderation.go` | ENFORCED |
| `createInvite` | Mod+ | `invites.go:113-115` | ENFORCED |

All gated via `guildLevelFromContext()` before mutations. Identical to legacy.

## F. Invite quotas

| Concern | Limit | Where | Verdict |
|-|-|-|-|
| Default max uses | 50 | `invites.go:18` | ENFORCED at claim |
| Default expiry | 7 days | `invites.go:19` | ENFORCED |
| Min expiry | 60 s | `invites.go:131-134` | ENFORCED |
| Expiry check on claim | yes | `invites.go:78, 182` | ENFORCED |
| Uses check on claim | yes | `invites.go:78` | ENFORCED |
| Server-side ceiling on `MaxUses` | none | `invites.go:122-127` | **MISSING** |
| Per-server active-invite cap | none | `invites.go:createInvite` | **MISSING** |

## G. Auth / session

| Concern | Limit | Where | Verdict |
|-|-|-|-|
| JWT TTL | 7 d (env `JWT_EXPIRY_HOURS`) | `config.go:43` | ENFORCED |
| Admin session TTL | 24 h | `config.go:49` | ENFORCED |
| Guest session TTL | 1 h default | `auth.go:38-40` | ENFORCED |
| Nonce TTL | 60 s | `auth.go:33` | ENFORCED |
| Session cleanup cron | daily | `main.go:212-224` | ENFORCED |
| Nonce purge cron | every 5 min | `auth.go:164` | ENFORCED |
| Failed-login throttle | none beyond global IP rate limit | `auth.go` challenge/verify | **MISSING** |
| Bot / automation detection | none | — | **MISSING** |

## Findings (severity-ordered)

### High — security

1. **Member cap not enforced at `joinServer`** (`servers.go:508-607`). Quota defined but unchecked when user joins via invite or open guild. **Action:** check `effectiveMemberCap` before `AddServerMember`; return `403` on overflow.
2. **Failed-login throttle missing** (`auth.go` challenge / verify handlers). Only global per-IP rate limit applies. **Action:** add per-username sliding-window counter with progressive backoff (5 / 30 / 300 s) on consecutive verify failures.
3. **Fan-out ciphertext oversized silently logged, not rejected** (`internal/ws/handlers.go:225-227`). Client can send `message.send` with 8 KiB main body but a fan-out leg over 8 KiB and the server inserts both. **Action:** return error frame, do not insert.

### Medium — correctness / quota bypass

4. **Max servers per user not enforced at invite claim** (`invites.go:claimInvite`). **Action:** add quota check before `AddServerMember`.
5. **No server-side ceiling on invite `MaxUses`** (`invites.go:122-127`). **Action:** clamp `req.MaxUses` to a server config max.
6. **No per-server active-invite cap**. **Action:** count non-expired non-exhausted invites before `CreateInvite`; reject above threshold.
7. **No max-channels per server** (`channels.go:createChannel`). **Action:** count `type IN ('text','voice','category')` rows; reject above threshold.

### Low — UX / hygiene

8. **Limiter map eviction missing** (`internal/ws/ratelimit.go:12, 58`). IP and per-user limiter stores grow unbounded. **Action:** TTL-evict idle entries.
9. **No CAPTCHA / device-binding proof** on auth + join. **Action:** consider PoW or invite-token attestation if abuse becomes observable.

## Conclusion

Permissions and message-level caps are correctly enforced. The biggest exposures are quota bypasses at alternate join paths (invite claim, open guild join) and the absence of a failed-login throttle. None of the findings are introduced by the recent rewrite — they exist in legacy too — but with the client now formally untrusted, they should be tracked and fixed at the server tier.
