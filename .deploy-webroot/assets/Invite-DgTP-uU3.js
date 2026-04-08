import { u as O, d as D, e as q, f as H, o as Q, h as V, s as W, k as X, l as G, j as e } from "./index-BefR8mbE.js";
import { f as Z, u as ee, b as ne, r as t } from "./vendor-react-2AhYlJPv.js";
const K = "Membership is active, but local setup failed on this device. Retry to finish opening the server.";
function R(i) {
  const r = (i == null ? void 0 : i.message) || "";
  return /not found|expired|no longer valid/i.test(r) ? "Invite not found or expired." : /already.*member|409/i.test(r) ? "You are already a member." : /banned/i.test(r) ? "You are banned from this guild." : /invalid|expired|400/i.test(r) ? "Invite is invalid or expired." : r || "Something went wrong.";
}
function te(i) {
  const r = `${i.pathname}${i.search}${i.hash}`;
  return `/?returnTo=${encodeURIComponent(r)}`;
}
function ae() {
  const { code: i, instance: r } = Z(), m = ee(), S = ne(), { hasSession: f, needsUnlock: u, user: w } = O(), { bootInstance: y, getTokenForInstance: x, refreshGuilds: U } = D(), I = !!r, o = t.useMemo(() => r ? `https://${r}` : null, [r]), [d, M] = t.useState(null), [Y, E] = t.useState(true), [l, c] = t.useState(null), [j, h] = t.useState(false), [P, _] = t.useState(false), [v, b] = t.useState(null), F = t.useMemo(() => te(S), [S]), T = t.useMemo(() => {
    const n = window.location.hash.slice(1), s = new URLSearchParams(n).get("name");
    return s ? q(s) : null;
  }, []), k = t.useMemo(() => {
    const n = window.location.hash.slice(1), s = new URLSearchParams(n).get("mk");
    return s ? H(s) : null;
  }, []), C = T ?? "a server", J = t.useCallback(async (n) => {
    if (!n || !(w == null ? void 0 : w.id) || !(k instanceof Uint8Array)) return;
    const a = await Q(w.id, V());
    try {
      await W(a, n, k);
    } finally {
      a.close();
    }
  }, [k, w == null ? void 0 : w.id]), p = t.useCallback(async (n, a) => {
    if (await J(n), await U(a), !n) {
      m("/home", { replace: true });
      return;
    }
    m(`/servers/${n}/channels`, { replace: true });
  }, [m, U, J]), N = t.useCallback((n, a) => {
    b({ serverId: n, instanceUrl: a }), c(K);
  }, []), L = t.useCallback(async () => {
    if (v) {
      c(null), h(true);
      try {
        await p(v.serverId, v.instanceUrl), b(null);
      } catch {
        c(K);
      } finally {
        h(false);
      }
    }
  }, [v, p]);
  t.useEffect(() => {
    if (!i) {
      E(false), c("Invalid invite link.");
      return;
    }
    let n = false;
    return X(i, o ?? void 0).then((s) => {
      n || (M(s), c(null));
    }).catch((s) => {
      n || (M(null), c(R(s)));
    }).finally(() => {
      n || E(false);
    }), () => {
      n = true;
    };
  }, [i, o]), t.useEffect(() => {
    u && m(F, { replace: true });
  }, [m, u, F]), t.useEffect(() => {
    !f && !u && sessionStorage.setItem("hush_pending_invite", window.location.href);
  }, [f, u]), t.useEffect(() => {
    if (I || !f || u || !d || !i) return;
    let n = false;
    async function a() {
      const s = window.location.origin;
      h(true), c(null), b(null);
      try {
        let g = x(s);
        if (!g) {
          if (await y(s), n) return;
          g = x(s);
        }
        if (!g) throw new Error("Authentication failed for instance.");
        const z = await G(g, i, s);
        if (n) return;
        const A = (z == null ? void 0 : z.serverId) ?? (d == null ? void 0 : d.serverId);
        try {
          await p(A, s);
        } catch {
          n || (N(A, s), h(false));
        }
      } catch (g) {
        n || (c(R(g)), h(false));
      }
    }
    return a(), () => {
      n = true;
    };
  }, [f, u, d, i, I, y, x, p, N]);
  const B = t.useCallback(async () => {
    var _a;
    if (!(!o || !i)) {
      c(null), b(null), _(true);
      try {
        await y(o);
        const n = x(o);
        if (!n) throw new Error("Authentication failed for instance.");
        h(true);
        const s = ((_a = await G(n, i, o)) == null ? void 0 : _a.serverId) ?? (d == null ? void 0 : d.serverId);
        try {
          await p(s, o);
        } catch {
          N(s, o);
        }
      } catch (n) {
        c(R(n));
      } finally {
        _(false), h(false);
      }
    }
  }, [o, i, y, x, d, p, N]), $ = t.useCallback(() => {
    sessionStorage.setItem("hush_pending_invite", window.location.href), m("/", { replace: true });
  }, [m]);
  if (Y) return e.jsx("div", { className: "invite-page", children: e.jsx("div", { className: "glass invite-card", children: e.jsx("p", { style: { color: "var(--hush-text-muted)", fontSize: "0.9rem" }, children: "Loading invite\u2026" }) }) });
  if (l && !d) return e.jsx("div", { className: "invite-page", children: e.jsxs("div", { className: "glass invite-card", children: [e.jsx("p", { className: "invite-error", children: l }), e.jsx("a", { href: "/", className: "invite-link", children: "Return to home" })] }) });
  if (!d) return null;
  if (I) {
    const n = d.memberCount ?? d.member_count ?? null, a = P || j;
    return e.jsx("div", { className: "invite-page", children: e.jsxs("div", { className: "glass invite-card", children: [e.jsx("p", { className: "invite-title", children: "You're invited to join" }), e.jsx("p", { className: "invite-guild-name", children: C }), e.jsxs("p", { className: "invite-instance-host", children: ["hosted on ", r] }), n != null && e.jsxs("p", { className: "invite-member-count", children: [n, " member", n !== 1 ? "s" : ""] }), l && e.jsx("p", { className: "invite-error", children: l }), !f || u ? e.jsxs("div", { className: "invite-actions", children: [e.jsx("button", { type: "button", className: "btn btn-primary", onClick: $, style: { padding: "12px" }, children: "Sign in to join" }), e.jsx("a", { href: "/", className: "invite-link", children: "Return to home" })] }) : e.jsxs("div", { className: "invite-actions", children: [e.jsx("button", { type: "button", className: "btn btn-primary", onClick: v ? L : B, disabled: a, style: { padding: "12px" }, children: P ? "Connecting to instance\u2026" : j ? "Joining\u2026" : v ? "Retry setup" : "Join" }), e.jsx("a", { href: "/", className: "invite-link", children: "Return to home" })] })] }) });
  }
  return f && !u ? e.jsx("div", { className: "invite-page", children: e.jsxs("div", { className: "glass invite-card", children: [e.jsx("p", { className: "invite-title", children: "You're invited to join" }), e.jsx("p", { className: "invite-guild-name", children: C }), l && e.jsx("p", { className: "invite-error", children: l }), !l && e.jsx("p", { style: { color: "var(--hush-text-muted)", fontSize: "0.9rem" }, children: "Joining\u2026" }), l && e.jsxs("div", { className: "invite-actions", children: [v && e.jsx("button", { type: "button", className: "btn btn-primary", onClick: L, disabled: j, style: { padding: "12px" }, children: j ? "Retrying\u2026" : "Retry setup" }), e.jsx("a", { href: "/", className: "invite-link", children: "Return to home" })] })] }) }) : e.jsx("div", { className: "invite-page", children: e.jsxs("div", { className: "glass invite-card", children: [e.jsx("p", { className: "invite-title", children: "You're invited to join" }), e.jsx("p", { className: "invite-guild-name", children: C }), l && e.jsx("p", { className: "invite-error", children: l }), e.jsxs("div", { className: "invite-actions", children: [e.jsx("button", { type: "button", className: "btn btn-primary", onClick: $, style: { padding: "12px" }, children: "Sign in to join" }), e.jsx("a", { href: "/", className: "invite-link", children: "Return to home" })] })] }) });
}
export {
  ae as default
};
