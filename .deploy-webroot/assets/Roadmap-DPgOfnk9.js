import { j as e } from "./index-BefR8mbE.js";
import { r as m, L as w } from "./vendor-react-2AhYlJPv.js";
const y = [{ id: "A", title: "Foundation", status: "done", summary: "Core prototype: auth, persistent chat, voice and video rooms." }, { id: "B", title: "End-to-End Encryption", status: "done", summary: "E2EE on everything: chat messages, voice, video, and screen sharing." }, { id: "C", title: "Signal Protocol + Go Backend", status: "done", summary: "Go backend with Signal Protocol (X3DH + Double Ratchet) via hush-crypto WASM. Matrix fully removed." }, { id: "D", title: "Servers & Channels", status: "active", summary: "Discord-like community structure. Servers, text and voice channels, categories, invites, drag-and-drop reordering." }, { id: "E", title: "Production & Launch", status: "planned", summary: "Moderation tools, rate limiting, security hardening. Self-hosting in under 10 minutes." }, { id: "F", title: "Desktop & Mobile", status: "future", summary: "Native apps with the same E2EE guarantees." }, { id: "G", title: "Key Backup & Multi-Device", status: "future", summary: "Losing a device no longer means losing chat history." }], k = [{ version: "0.7.0-alpha", date: "2026-03-03", milestone: "D", title: "core rewrite", current: true, tags: ["release", "architecture"], groups: [{ label: "architecture", items: ["Go backend replacing Node.js/Matrix for auth, API, and WebSocket presence", "Signal Protocol (X3DH + Double Ratchet) via hush-crypto Rust crate compiled to WASM", "WebSocket message routing with per-recipient fan-out encryption", "LiveKit E2EE key distribution via Signal sessions instead of Matrix", "Encrypted message store in IndexedDB with per-session crypto keys", "Matrix/Synapse fully removed from codebase"] }, { label: "features", items: ["Server and channel management with text, voice, and category types", "Invite link generation and join flow", "Drag-and-drop channel and category reordering with server-side persistence", "Member list with real-time WebSocket presence", "Server settings: rename, leave, delete with ownership transfer", "Resizable sidebar with persistent width", "Collapsible categories with persistent state per server", "Status indicators for voice channels and empty states", "Server-authoritative voice state via LiveKit webhooks"] }, { label: "infrastructure", items: ["Client Dockerfile with multi-stage WASM build pipeline", "Real-time WebSocket broadcasts for all server mutations", "libsignal-dezire security patches (panic DoS, zeroization) with 30 interop tests", "Setup script and environment configuration for self-hosting"] }, { label: "fixes", items: ["Chat shows member display names instead of truncated UUIDs", "WebSocket reconnection stability and React StrictMode compatibility", "Theme mode separated from theme variant selection", "Channel and category drag-and-drop position persistence"] }] }, { version: "0.6.2-alpha", date: "2026-02-23", milestone: "C", title: "polish & mobile", tags: ["release"], groups: [{ label: "features", items: ["Symmetric tile grid with hero layout on mobile and desktop", "Typewriter subtitle animation on home page", "Video quality auto-management based on bandwidth estimation", "End-to-end encrypted badge on home page", "Unwatch card with hero layout and unread badges"] }, { label: "fixes", items: ["iOS Safari auto-zoom on input focus", "Security headers and CORS origin restriction", "Video container letterbox contrast in light mode", "Logo dot position after late font swap", "Mono audio capture for microphone", 'False "secure channel failed" toast from expired token', "Local webcam feed now mirrored horizontally", "Orphan room cleanup for abandoned rooms", "iOS Safari stale dim artifacts after sidebar close"] }] }, { version: "0.6.1-alpha", date: "2026-02-19", milestone: "C", title: "stabilization", tags: ["fix"], groups: [{ label: "features", items: ["Auth UX overhaul: guest cleanup, SSO support, invite-only toggle", "Link-only room model with copy-link sharing", "Chat and controls UI refresh", "Dynamic favicon syncing with system theme", "Design system pass across all components"] }, { label: "fixes", items: ["E2EE critical fixes: AES-256 key length, key retry logic, chat send retry", "Connection epoch guard to prevent StrictMode double-mount race", "Track cleanup and disconnect handling in room components", "Roadmap page styling and interaction refinements"] }] }, { version: "0.6.0-alpha", date: "2026-02-14", milestone: "B", title: "matrix + livekit migration", tags: ["release", "security"], groups: [{ label: "features", items: ["Migrated to Matrix Synapse for auth and room management", "LiveKit SFU replacing mediasoup for media transport", "E2EE via Olm/Megolm with LiveKit Insertable Streams", "Key distribution and leader election for media encryption", "Docker Compose deployment with Caddy reverse proxy"] }, { label: "security", items: ["Comprehensive E2EE audit with fixes for password-derived keys and UISI handling", "Per-account crypto store prefix to avoid IndexedDB conflicts"] }] }, { version: "0.5.1", date: "2026-02-12", milestone: "A", title: "chat & stability", tags: ["fix"], groups: [{ label: "features", items: ["Ephemeral text chat within rooms", "Chat message limits and rate limiting", "Screen share card loading state with spinner"] }, { label: "fixes", items: ["Persisted chat messages for room lifetime", "Removed experimental E2EE infrastructure (unstable in mediasoup)"] }] }, { version: "0.5.0", date: "2026-02-11", milestone: "A", title: "initial prototype", tags: ["release"], groups: [{ label: "features", items: ["WebRTC rooms via mediasoup SFU, up to 4 participants", "Quality presets: best (1080p) and lite (720p)", "Noise gate AudioWorklet for mic processing", "iOS Safari compatibility fixes for remote streams", "Logo wordmark with animated orange dot", "Click-to-watch for remote screen shares", "Fullscreen support and mobile layout", "Server status indicator on home page"] }] }], j = { done: { label: "shipped", color: "var(--rm-green)", bg: "var(--rm-green-ghost)" }, active: { label: "in progress", color: "var(--rm-blue)", bg: "var(--rm-blue-ghost)" }, planned: { label: "planned", color: "var(--rm-purple)", bg: "var(--rm-purple-ghost)" }, future: { label: "future", color: "var(--hush-text-ghost)", bg: "var(--hush-elevated)" } }, S = { done: "shipped", active: "progress", planned: "planned", future: "future" }, N = { done: "badge-shipped", active: "badge-progress", planned: "badge-planned", future: "badge-future" }, E = y.filter((r) => r.status === "done" || r.status === "active"), f = y.filter((r) => r.status === "planned" || r.status === "future"), x = [...E].reverse(), b = [...f].reverse();
function C(r) {
  return k.filter((s) => s.milestone === r);
}
function z(r) {
  const s = new Date(r), d = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
  return `${s.getUTCDate()} ${d[s.getUTCMonth()]} ${s.getUTCFullYear()}`;
}
function R() {
  return e.jsx("svg", { className: "release-chevron", width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: e.jsx("polyline", { points: "9 18 15 12 9 6" }) });
}
const T = `
  /* \u2500\u2500 Roadmap-scoped status colors (match original palette) \u2500\u2500 */
  .roadmap-page {
    --rm-green:        #4ade80;
    --rm-green-ghost:  rgba(74, 222, 128, 0.08);
    --rm-green-glow:   rgba(74, 222, 128, 0.4);
    --rm-blue:         #38bdf8;
    --rm-blue-ghost:   rgba(56, 189, 248, 0.08);
    --rm-blue-glow:    rgba(56, 189, 248, 0.6);
    --rm-blue-border:  rgba(56, 189, 248, 0.33);
    --rm-purple:       #a78bfa;
    --rm-purple-ghost: rgba(167, 139, 250, 0.08);
    --rm-purple-border:rgba(167, 139, 250, 0.33);
  }

  /* \u2500\u2500 PAGE \u2500\u2500 */
  .roadmap-page {
    max-width: 700px;
    margin: 0 auto;
    padding: 72px 40px 120px;
    font-family: var(--font-sans);
    color: var(--hush-text);
    -webkit-font-smoothing: antialiased;
  }

  .roadmap-back {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    color: var(--hush-text-muted);
    text-decoration: none;
    letter-spacing: 0.05em;
    display: inline-block;
    margin-bottom: 32px;
    transition: color 200ms var(--ease-out);
  }
  .page-eyebrow {
    font-size: 0.7rem;
    font-weight: 600;
    color: var(--hush-amber);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-bottom: 12px;
  }
  .page-title {
    font-size: 2rem;
    font-weight: 300;
    letter-spacing: -0.03em;
    margin-bottom: 8px;
  }
  .page-sub {
    font-size: 0.9rem;
    color: var(--hush-text-secondary);
    line-height: 1.6;
    margin-bottom: 40px;
  }

  /* \u2500\u2500 LEGEND \u2500\u2500 */
  .rm-legend {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
    margin-bottom: 64px;
  }
  .rm-legend-item {
    display: flex;
    align-items: center;
    gap: 7px;
    font-size: 0.7rem;
    font-weight: 500;
    color: var(--hush-text-muted);
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }
  .rm-legend-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
  }
  .dot-shipped  { background: var(--rm-green); }
  .dot-progress { background: var(--rm-blue); }
  .dot-planned  { background: var(--rm-purple); }
  .dot-future   { background: transparent; border: 1px solid var(--hush-text-ghost); }

  /* \u2500\u2500 WHAT'S NEXT ACCORDION \u2500\u2500 */
  .whats-next { margin-bottom: 40px; }

  .whats-next-toggle {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    background: var(--hush-surface);
    border: 1px solid transparent;
    border-radius: 0;
    cursor: pointer;
    color: var(--hush-text);
    font-family: var(--font-sans);
    font-size: 0.85rem;
    font-weight: 500;
    transition: background 120ms var(--ease-out);
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
  }
  .whats-next-count {
    font-family: var(--font-mono);
    font-size: 0.65rem;
    font-weight: 500;
    color: var(--hush-text-muted);
    letter-spacing: 0.08em;
    padding: 1px 7px;
    background: var(--hush-elevated);
  }

  .whats-next-chevron {
    margin-left: auto;
    color: var(--hush-text-ghost);
    transition: transform 200ms var(--ease-out);
    flex-shrink: 0;
  }
  .whats-next.open .whats-next-chevron { transform: rotate(90deg); }

  .whats-next-body {
    display: none;
    padding-top: 4px;
  }
  .whats-next.open .whats-next-body { display: block; }

  /* \u2500\u2500 TIMELINE \u2500\u2500 */
  .rm-timeline {
    position: relative;
    display: flex;
    flex-direction: column;
  }
  .rm-timeline::before {
    content: '';
    position: absolute;
    left: 7px;
    top: 10px;
    bottom: 10px;
    width: 1px;
    background: var(--hush-border);
    z-index: 0;
  }

  /* \u2500\u2500 MILESTONE \u2500\u2500 */
  .rm-milestone {
    position: relative;
    padding-left: 36px;
    margin-bottom: 4px;
  }
  .rm-milestone-dot {
    position: absolute;
    left: 0;
    top: 12px;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    border: 1px solid var(--hush-border-hover);
    background: var(--hush-black);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;
  }
  .rm-milestone-dot-inner {
    width: 7px;
    height: 7px;
    border-radius: 50%;
  }
  .rm-milestone.shipped .rm-milestone-dot-inner  { background: var(--rm-green); box-shadow: 0 0 6px var(--rm-green-glow); }
  .rm-milestone.progress .rm-milestone-dot-inner { background: var(--rm-blue); box-shadow: 0 0 8px var(--rm-blue-glow); animation: roadmap-pulse 2s ease-in-out infinite; }
  .rm-milestone.planned .rm-milestone-dot-inner  { background: transparent; border-color: var(--rm-purple); }
  .rm-milestone.future .rm-milestone-dot-inner   { background: transparent; border: 1px solid var(--hush-text-ghost); }

  .rm-milestone-card {
    background: var(--hush-surface);
    padding: 20px 24px;
    margin-bottom: 2px;
    border: 1px solid transparent;
    border-radius: 0;
  }
  .rm-milestone.planned .rm-milestone-card,
  .rm-milestone.future  .rm-milestone-card { opacity: 0.55; }

  .rm-milestone-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 8px;
  }
  .rm-milestone-id {
    font-size: 0.65rem;
    font-weight: 600;
    color: var(--hush-text-muted);
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }
  .rm-milestone-badge {
    font-size: 0.65rem;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 2px 8px;
    border-radius: 0;
  }
  .badge-shipped  { color: var(--rm-green);   background: var(--rm-green-ghost); }
  .badge-progress { color: var(--rm-blue);    background: var(--rm-blue-ghost); border: 1px solid var(--rm-blue-border); }
  .badge-planned  { color: var(--rm-purple);  background: var(--rm-purple-ghost); border: 1px solid var(--rm-purple-border); }
  .badge-future   { color: var(--hush-text-ghost);  background: var(--hush-elevated); }

  .rm-milestone-title {
    font-size: 1.1rem;
    font-weight: 300;
    letter-spacing: -0.02em;
    margin-top: 8px;
    margin-bottom: 6px;
  }
  .rm-milestone-desc {
    font-size: 0.85rem;
    color: var(--hush-text-secondary);
    line-height: 1.55;
  }

  /* \u2500\u2500 RELEASES \u2500\u2500 */
  .rm-releases {
    padding-left: 36px;
    margin-bottom: 4px;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .rm-release { position: relative; }

  .rm-release-toggle {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 16px;
    background: transparent;
    border: none;
    border-radius: 0;
    cursor: pointer;
    text-align: left;
    transition: background 120ms;
    color: var(--hush-text);
    font-family: var(--font-sans);
    position: relative;
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
  }
  .rm-release-dot {
    position: absolute;
    left: -23px;
    top: 50%;
    transform: translateY(-50%);
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--hush-border-focus);
    border: 1px solid var(--hush-border-hover);
    flex-shrink: 0;
    z-index: 1;
  }
  .rm-release.current .rm-release-dot {
    background: var(--rm-blue);
    border-color: var(--rm-blue);
    box-shadow: 0 0 0 3px var(--rm-blue-ghost);
    animation: hush-pulse 2s ease-in-out infinite;
  }

  .rm-release-version {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--hush-text);
    min-width: 110px;
  }
  .rm-release.current .rm-release-version { color: var(--rm-blue); }

  .rm-release-date {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    color: var(--hush-text-muted);
    min-width: 80px;
  }

  .rm-release-title {
    font-size: 0.85rem;
    color: var(--hush-text-secondary);
    flex: 1;
    transition: color 120ms;
  }

  .release-chevron {
    color: var(--hush-text-ghost);
    transition: transform 200ms var(--ease-out), color 120ms;
    flex-shrink: 0;
  }
  .rm-release.open .release-chevron { transform: rotate(90deg); }

  /* \u2500\u2500 RELEASE BODY \u2500\u2500 */
  .rm-release-body {
    display: none;
    padding: 0 16px 12px 16px;
    background: var(--hush-surface);
    border-top: 1px solid var(--hush-border);
  }
  .rm-release.open .rm-release-body { display: block; }
  .rm-release.open .rm-release-toggle { background: var(--hush-surface); }

  .rm-change-group { margin-top: 16px; }
  .rm-change-group:first-child { margin-top: 12px; }

  .rm-change-group-label {
    font-size: 0.65rem;
    font-weight: 600;
    color: var(--hush-text-muted);
    letter-spacing: 0.09em;
    text-transform: uppercase;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .rm-change-group-label::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--hush-border);
  }

  .rm-change-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  .rm-change-item {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    font-size: 0.82rem;
    color: var(--hush-text-secondary);
    line-height: 1.5;
  }
  .rm-change-item::before {
    content: '\\2014';
    color: var(--hush-text-ghost);
    flex-shrink: 0;
    font-size: 0.75rem;
    margin-top: 1px;
  }

  /* \u2500\u2500 SPACER \u2500\u2500 */
  .rm-spacer { height: 28px; }

  /* \u2500\u2500 FOOTER \u2500\u2500 */
  .rm-footer {
    margin-top: 96px;
    padding-top: 32px;
    border-top: 1px solid var(--hush-border);
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
  }
  .rm-footer-text {
    font-size: 0.75rem;
    color: var(--hush-text-muted);
  }
  .rm-footer-links {
    display: flex;
    gap: 24px;
  }
  .rm-footer-link {
    color: var(--hush-amber);
    text-decoration: none;
    font-size: 0.75rem;
    font-weight: 500;
    transition: color 120ms;
  }
  /* \u2500\u2500 ANIMATIONS \u2500\u2500 */
  @keyframes hush-pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%      { opacity: 0.4; transform: scale(0.85); }
  }
  @keyframes roadmap-pulse {
    0%, 100% { box-shadow: 0 0 8px var(--rm-blue-glow); }
    50%      { box-shadow: 0 0 16px var(--rm-blue-glow), 0 0 32px rgba(56, 189, 248, 0.2); }
  }
  @keyframes fade-up {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .rm-milestone, .rm-releases {
    animation: fade-up 0.35s var(--ease-out) both;
  }

  /* \u2500\u2500 RESPONSIVE \u2500\u2500 */
  @media (max-width: 640px) {
    .roadmap-page { padding: 40px 16px 64px; }
    .page-title { font-size: 1.4rem; }
    .rm-legend { gap: 12px; }
    .rm-release-date { display: none; }

    /* Release toggle: wrap version+tags row, title on its own line below */
    .rm-release-toggle { flex-wrap: wrap; row-gap: 4px; }
    .rm-release-version { min-width: 0; }
    .rm-release-title { order: 10; flex: 0 0 100%; padding-left: 0; }
    .release-chevron { margin-left: auto; }
  }

  /* \u2500\u2500 HOVER (pointer devices only - fix sticky hover on touch) \u2500\u2500 */
  @media (hover: hover) {
    .roadmap-back:hover { color: var(--hush-amber); }
    .whats-next-toggle:hover { background: var(--hush-elevated); }
    .rm-release-toggle:hover { background: var(--hush-surface); }
    .rm-release-toggle:hover .release-chevron { color: var(--hush-text-secondary); }
    .rm-release-toggle:hover .rm-release-title { color: var(--hush-text); }
    .rm-footer-link:hover { color: var(--hush-amber-bright); }
  }
`;
function v({ milestone: r }) {
  const s = S[r.status], d = N[r.status], l = j[r.status];
  return e.jsxs("div", { className: `rm-milestone ${s}`, children: [e.jsx("div", { className: "rm-milestone-dot", children: e.jsx("div", { className: "rm-milestone-dot-inner" }) }), e.jsxs("div", { className: "rm-milestone-card", children: [e.jsxs("div", { className: "rm-milestone-header", children: [e.jsxs("span", { className: "rm-milestone-id", children: ["Milestone ", r.id] }), e.jsx("span", { className: `rm-milestone-badge ${d}`, children: l.label })] }), e.jsx("div", { className: "rm-milestone-title", children: r.title }), e.jsx("div", { className: "rm-milestone-desc", children: r.summary })] })] });
}
function M({ release: r, isOpen: s, onToggle: d }) {
  const l = m.useRef(null), i = m.useRef(false), c = r.current === true, h = ["rm-release", s ? "open" : "", c ? "current" : ""].filter(Boolean).join(" ");
  function p(t) {
    l.current = t.touches[0].clientY, i.current = false;
  }
  function u(t) {
    l.current !== null && (i.current = Math.abs(t.changedTouches[0].clientY - l.current) > 8, l.current = null);
  }
  function g() {
    if (i.current) {
      i.current = false;
      return;
    }
    d(r.version);
  }
  return e.jsxs("div", { className: h, children: [e.jsxs("button", { className: "rm-release-toggle", onClick: g, onTouchStart: p, onTouchEnd: u, type: "button", children: [e.jsx("span", { className: "rm-release-dot" }), e.jsxs("span", { className: "rm-release-version", children: ["v", r.version] }), e.jsx("span", { className: "rm-release-date", children: z(r.date) }), e.jsx("span", { className: "rm-release-title", children: r.title }), e.jsx(R, {})] }), e.jsx("div", { className: "rm-release-body", children: r.groups.map((t) => e.jsxs("div", { className: "rm-change-group", children: [e.jsx("div", { className: "rm-change-group-label", children: t.label }), e.jsx("ul", { className: "rm-change-list", children: t.items.map((o) => e.jsx("li", { className: "rm-change-item", children: o }, o)) })] }, t.label)) })] });
}
function O() {
  const [r, s] = m.useState(/* @__PURE__ */ new Set()), [d, l] = m.useState(false), i = m.useRef(null), c = m.useRef(false);
  m.useEffect(() => {
    const t = document.documentElement, o = document.body, a = document.getElementById("root"), n = { html: { overflow: t.style.overflow, height: t.style.height }, body: { overflow: o.style.overflow, height: o.style.height }, root: a ? { overflow: a.style.overflow, height: a.style.height } : null };
    return t.style.overflow = "auto", t.style.height = "auto", o.style.overflow = "auto", o.style.height = "auto", a && (a.style.overflow = "auto", a.style.height = "auto"), () => {
      t.style.overflow = n.html.overflow, t.style.height = n.html.height, o.style.overflow = n.body.overflow, o.style.height = n.body.height, a && (a.style.overflow = n.root.overflow, a.style.height = n.root.height);
    };
  }, []);
  function h(t) {
    i.current = t.touches[0].clientY, c.current = false;
  }
  function p(t) {
    i.current !== null && (c.current = Math.abs(t.changedTouches[0].clientY - i.current) > 8, i.current = null);
  }
  function u() {
    if (c.current) {
      c.current = false;
      return;
    }
    l((t) => !t);
  }
  function g(t) {
    s((o) => {
      const a = new Set(o);
      return a.has(t) ? a.delete(t) : a.add(t), a;
    });
  }
  return e.jsxs(e.Fragment, { children: [e.jsx("style", { children: T }), e.jsxs("div", { className: "roadmap-page", children: [e.jsx(w, { to: "/", className: "roadmap-back", children: "\u2190 hush" }), e.jsx("p", { className: "page-eyebrow", children: "gethush.live" }), e.jsx("h1", { className: "page-title", children: "product roadmap" }), e.jsxs("p", { className: "page-sub", children: ["E2EE communication built on Signal Protocol + LiveKit.", e.jsx("br", {}), "Open source, self-hostable, no tracking."] }), e.jsxs("div", { className: "rm-legend", children: [e.jsxs("div", { className: "rm-legend-item", children: [e.jsx("div", { className: "rm-legend-dot dot-shipped" }), " shipped"] }), e.jsxs("div", { className: "rm-legend-item", children: [e.jsx("div", { className: "rm-legend-dot dot-progress" }), " in progress"] }), e.jsxs("div", { className: "rm-legend-item", children: [e.jsx("div", { className: "rm-legend-dot dot-planned" }), " planned"] }), e.jsxs("div", { className: "rm-legend-item", children: [e.jsx("div", { className: "rm-legend-dot dot-future" }), " future"] })] }), f.length > 0 && e.jsxs("div", { className: `whats-next ${d ? "open" : ""}`, children: [e.jsxs("button", { className: "whats-next-toggle", onClick: u, onTouchStart: h, onTouchEnd: p, type: "button", children: [e.jsx("span", { children: "what\u2019s next" }), e.jsx("span", { className: "whats-next-count", children: f.length }), e.jsx("svg", { className: "whats-next-chevron", width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: e.jsx("polyline", { points: "9 18 15 12 9 6" }) })] }), e.jsx("div", { className: "whats-next-body", children: e.jsx("div", { className: "rm-timeline", children: b.map((t, o) => e.jsxs("div", { children: [e.jsx(v, { milestone: t }), o < b.length - 1 && e.jsx("div", { className: "rm-spacer" })] }, t.id)) }) })] }), e.jsx("div", { className: "rm-timeline", children: x.map((t, o) => {
    const a = C(t.id);
    return e.jsxs("div", { children: [e.jsx(v, { milestone: t }), a.length > 0 && e.jsx("div", { className: "rm-releases", children: a.map((n) => e.jsx(M, { release: n, isOpen: r.has(n.version), onToggle: g }, n.version)) }), o < x.length - 1 && e.jsx("div", { className: "rm-spacer" })] }, t.id);
  }) }), e.jsxs("footer", { className: "rm-footer", children: [e.jsx("span", { className: "rm-footer-text", children: "hush is open source and self-hostable." }), e.jsxs("div", { className: "rm-footer-links", children: [e.jsx("a", { className: "rm-footer-link", href: "https://github.com/YarinCardillo/hush-app", target: "_blank", rel: "noopener noreferrer", children: "github" }), e.jsx("a", { className: "rm-footer-link", href: "https://github.com/YarinCardillo/hush-app/blob/main/CHANGELOG.md", target: "_blank", rel: "noopener noreferrer", children: "changelog" })] })] })] })] });
}
export {
  O as default
};
