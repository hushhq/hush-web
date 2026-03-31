# Contributing to hush-web

Thank you for your interest in contributing to the Hush web client. This guide covers the development setup, testing approach, code style, and pull request process.

---

## Prerequisites

- [Node.js](https://nodejs.org/) 22 or later
- A running [hush-server](https://github.com/hushhq/hush-server) instance (for end-to-end dev)

---

## Development Setup

**1. Clone and install:**

```bash
git clone https://github.com/hushhq/hush-web
cd hush-web
npm ci
```

**3. Set up environment variables:**

```bash
cp .env.example .env.local
# Edit .env.local — at minimum set VITE_API_BASE_URL and VITE_WS_URL
```

**4. Start the dev server:**

```bash
npm run dev
```

Vite starts on `http://localhost:5173` and proxies API and WebSocket requests to the backend.

---

## Running Tests

```bash
# Run all tests (single pass)
npm run test:run

# Watch mode
npm run test

# Run a specific file
npx vitest run src/lib/mlsGroup

# Run with coverage
npx vitest run --coverage
```

Tests use Vitest and cover MLS group operations, vault PIN handling, auth flows, and reconnect logic. All tests must pass before submitting a pull request.

---

## Code Style

This project follows React/JavaScript conventions plus the guidelines in the root `CLAUDE.md`:

- **No business logic in components:** Components handle display and user interaction only. Crypto, API calls, and state management belong in hooks and `lib/`.
- **Hooks for side effects:** Use custom hooks (`useAuth`, `useMLS`, `useRoom`) rather than mixing effects and state in page components.
- **No plaintext fallback paths:** If encryption fails, the operation must fail. Never add a code path that sends or displays unencrypted content.
- **Function length:** Keep functions under 30 lines. Extract helpers.
- **Naming:** React components use PascalCase. Functions and variables use camelCase. Boolean state uses `is`, `has`, `can` prefixes.
- **No magic numbers:** Define named constants for permission levels, timeouts, and similar values.

Run the linter before committing:

```bash
npm run lint
```

---

## Key Modules

Before making changes to these files, read the relevant documentation:

- `src/lib/hushCrypto.js`, `src/hooks/useMLS.js` — MLS group operations; read `signal-theory-context.md` and the OpenMLS book first
- `src/lib/bip39Identity.js`, `src/lib/vault.js` — BIP39 identity and vault PIN; read `SECURITY.md` first
- `src/lib/wsClient.js` — WebSocket reconnect logic; changes affect all real-time features

---

## Pull Request Process

1. **Open an issue first** for non-trivial changes to discuss the approach before writing code.
2. **Branch from `main`:** `git checkout -b feature/my-feature` or `fix/my-fix`.
3. **Write tests** for new functionality. Bug fixes should include a regression test.
4. **Run `npm run test:run`** and confirm all tests pass.
5. **Run `npm run lint`** and fix any warnings.
6. **Open a pull request** against `main` with a description of what changed and why.
7. A maintainer will review and respond within a few days.

### Commit message format

```
type(scope): short description

- change detail 1
- change detail 2
```

Types: `feat`, `fix`, `test`, `refactor`, `chore`, `docs`.

---

## Admin Dashboard

The admin dashboard is in `admin/`. It is a standalone Vite app. Run and test it separately:

```bash
cd admin
npm ci
npm run dev
npm run test:run
```

---

## Security Issues

Do not open public issues for security vulnerabilities. Email `security@gethush.live` with details. See the main security policy for the full responsible disclosure process.
