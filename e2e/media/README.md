# E2E media delivery suite (HUSHHQ-107)

Symmetric two-client audio smoke test for the hush voice channel. Proves that
two real Chromium contexts joined to the same voice channel through the real
hush-server and real LiveKit actually exchange audio and that FrameCryptor E2EE
decryption succeeds.

Covers CORE-INVARIANTS: **voice**, **MLS**.

Screen-share (HUSHHQ-110) is the deferred sibling and reuses this harness.

## Prerequisites

- Docker (for postgres + livekit via docker-compose)
- Go toolchain (builds the e2e-tagged hush-server binary)
- Node.js / npm
- Playwright browsers installed: `npx playwright install chromium`

The suite uses the `docker-compose.yml` in `../hush-server/`. The hush-server
repo must be checked out alongside hush-web (default: `../hush-server`).
Override with `HUSH_SERVER_DIR=/path/to/hush-server npm run e2e:media`.

## Running

```
npm run e2e:media
```

`globalSetup` handles the full stack:
1. Starts postgres + livekit via docker-compose
2. Builds and starts the e2e-tagged server binary (`go build -tags e2e_test`)
3. `webServer` runs `vite build` (with `VITE_E2E_DIAG=1`) then `vite preview`

`globalTeardown` stops the server process and runs `docker compose down`.

## What is tested

`media-delivery.spec.ts` runs a single test with two isolated Chromium
contexts (no shared storage):

1. Provisions two ephemeral Ed25519 identities via `/api/test/session`
2. Seeds a voice channel with both users via `/api/test/seed`
3. Injects auth + voice prefs into each context so the app boots authenticated
   and auto-joins the channel without the prejoin dialog
4. Calls `window.__hushProvisionMls` on each page to run
   `uploadKeyPackagesAfterAuth` (generates MLS credential + uploads key
   packages); this is needed because the no-vault boot path skips it
5. Navigates both pages to the voice channel URL
6. Waits for each client to see the other as a remote LiveKit participant
7. Asserts positive delta on inbound-rtp audio `bytesReceived` over an 800ms
   window (both directions)
8. Asserts `window.__hushE2eeStats`: `decryptFailures === 0`,
   `mediaKeyEpoch >= 0`, `keyIndex === mediaKeyEpoch % 256`, and both clients
   converged on the same epoch

## Key components

| File | Role |
|------|------|
| `playwright.config.ts` | Chromium project, fake media flags, webServer, globalSetup/teardown |
| `global-setup.ts` | Starts docker-compose services + native e2e-tagged server binary |
| `global-teardown.ts` | Stops server process + docker compose down |
| `constants.ts` | `SERVER_URL` (8080), `PREVIEW_URL` (4173) |
| `fixtures/session.ts` | `createEphemeralSession`, `seedVoiceChannel`, `injectSession`, `injectVoicePrefs` |
| `media-delivery.spec.ts` | The test |

## Diagnostic surface

Built with `VITE_E2E_DIAG=1`. Exposes on `window`:

- `__hushE2eeStats`: `{ decryptFailures, mediaKeyEpoch, keyIndex, lastError }`
- `__hushRoom`: the LiveKit `Room` instance
- `__hushProvisionMls()`: calls `uploadKeyPackagesAfterAuth` for the current
  session (needed for fixture sessions that skip the normal auth flow)

These are never present in production builds.

## Manual smoke gaps

- No macOS / Windows matrix (Linux + Chromium only this milestone)
- No CI gate (deferred to HUSHHQ-107 follow-up alongside HUSHHQ-110)
- Camera / video track delivery not asserted (camera is not auto-published;
  that assertion can be added once we have a clean way to trigger it)
- Network partition / reconnect path not exercised
