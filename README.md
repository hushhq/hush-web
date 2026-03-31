![License](https://img.shields.io/badge/license-AGPL--3.0-blue)
![Node](https://img.shields.io/badge/node-22+-339933)
![React](https://img.shields.io/badge/react-18-61DAFB)

# hush-web

React web client for [Hush](https://gethush.live) — an end-to-end encrypted communication platform. The client runs OpenMLS compiled to WASM (`@gethush/hush-crypto`) directly in the browser. All encryption happens here, before any data reaches the server.

---

## Prerequisites

- [Node.js](https://nodejs.org/) 22 or later

The `@gethush/hush-crypto` WASM package is published on [npmjs.com](https://www.npmjs.com/package/@gethush/hush-crypto). No extra authentication is needed.

---

## Setup

**1. Clone and install:**

```bash
git clone https://github.com/hushhq/hush-web
cd hush-web
npm ci
```

**3. Configure environment variables:**

```bash
cp .env.example .env.local
# Edit .env.local
```

See [Environment Variables](#environment-variables) below for required vars.

---

## Development

```bash
npm run dev
```

Starts Vite on `http://localhost:5173`. Vite proxies `/api`, `/ws`, and `/livekit` to the Go API (expected at `http://localhost:8080` by default, behind Caddy).

You need a running `hush-server` instance for the client to function. See the [hush-server](https://github.com/hushhq/hush-server) repository.

### Rebuilding the WASM crate

The WASM binary is shipped as part of the `@gethush/hush-crypto` npm package. You do not need to rebuild it for normal development. If you are working on `hush-crypto` locally:

```bash
# Force rebuild from local source
npm run build:wasm:force
```

---

## Testing

```bash
# Run all tests (Vitest, single run)
npm run test:run

# Run in watch mode
npm run test

# Run a specific test file
npx vitest run src/lib/mlsGroup
```

Tests cover MLS group operations, the vault (PIN-based key storage), authentication flows, and WebSocket reconnect behavior. All tests run in Vitest with a simulated WASM environment.

---

## Building for Production

```bash
npm run build
```

Output is in `dist/`. The build includes the WASM binary bundled via Vite's WASM plugin. Serve `dist/` as a static site behind the Go API / Caddy reverse proxy.

To build the Docker image:

```bash
docker build -t hush-web .
```

---

## Admin Dashboard

The standalone admin dashboard is in `admin/`. It authenticates via API key (not as a Hush user) and has read-only access to UUIDs, member counts, and metrics — no plaintext content.

```bash
cd admin
npm ci
npm run dev    # development server on :5174
npm run build  # production build in admin/dist/
```

---

## Environment Variables

Variables prefixed with `VITE_` are embedded in the client bundle at build time.

| Variable | Required | Description |
|-|-|-|
| `VITE_API_BASE_URL` | Yes | Go API base URL (e.g., `https://chat.example.com`) |
| `VITE_WS_URL` | Yes | WebSocket URL (e.g., `wss://chat.example.com/ws`) |
| `VITE_LIVEKIT_URL` | Yes | LiveKit WebSocket URL (e.g., `wss://chat.example.com/livekit`) |
| `VITE_INSTANCE_NAME` | No | Display name shown in the client title |

**Never put private keys, admin API keys, or any server-side secrets in `.env.local`** — Vite embeds these values in the JavaScript bundle.

---

## Project Structure

```
hush-web/
├── src/
│   ├── App.jsx              # Router (guild/channel layout)
│   ├── hooks/               # useAuth, useMLS, useRoom, useKeyPackageMaintenance
│   ├── lib/                 # API client, BIP39 identity, MLS group ops, vault, WebSocket client
│   ├── pages/               # TextChannel, VoiceChannel, ServerLayout, Home
│   └── components/          # Chat, ChannelList, MemberList, ServerList, Controls
├── admin/                   # Standalone admin dashboard (separate Vite app)
│   └── src/
│       ├── lib/adminApi.js  # Admin API client (X-Admin-Key header)
│       └── pages/           # GuildListPage, UserListPage, HealthPage, ConfigPage
├── public/                  # Static assets
├── vite.config.js           # Vite config (WASM plugin, API proxy)
└── vitest.config.js         # Vitest config
```

---

## Browser Support

| Browser | Chat E2EE | Media E2EE |
|-|-|-|
| Chromium (Chrome, Edge, Brave, Arc) | Full | Full |
| Firefox | Full | Partial |
| Safari | Full | Limited |

Full media E2EE requires Insertable Streams. See [SECURITY.md](https://github.com/hushhq/hush-server/blob/main/SECURITY.md) for details.

**WebCrypto is required.** The app will not load in environments where `window.crypto.subtle` is unavailable (non-HTTPS origins, some enterprise configurations). There is no fallback to unencrypted operation.

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

---

## License

[AGPL-3.0](LICENSE). If you modify and deploy this client, you must publish your changes under the same license.
