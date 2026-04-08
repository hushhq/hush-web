import { d as _, aR as q, j as s, aS as I } from "./index-BefR8mbE.js";
import { u as O, r as a } from "./vendor-react-2AhYlJPv.js";
const $ = ["All", "Gaming", "Technology", "Music", "Art", "Education", "Science", "Community", "Sports", "Entertainment", "Other"], w = 20, D = 500;
function L() {
  const { instanceStates: r, refreshGuilds: l, getTokenForInstance: m } = _(), o = O(), [c, h] = a.useState([]), [G, S] = a.useState(0), [u, g] = a.useState(1), [i, R] = a.useState(""), [j, T] = a.useState(""), [A, k] = a.useState(true), [n, d] = a.useState(null), [v, C] = a.useState(false), [E, p] = a.useState(""), y = a.useRef(null), P = a.useRef(""), { token: x, baseUrl: b } = z(r, m), f = a.useCallback(async (e) => {
    if (x) {
      k(true);
      try {
        const t = await q(x, { category: e.category || void 0, search: e.search || void 0, sort: "members", page: e.page, pageSize: w }, b);
        h(t.guilds ?? []), S(t.total ?? 0);
      } catch (t) {
        console.error("[ExplorePage] discoverGuilds failed:", t), h([]), S(0);
      } finally {
        k(false);
      }
    }
  }, [x, b]);
  a.useEffect(() => {
    f({ category: i, search: P.current, page: u });
  }, [i, u, f]);
  const J = (e) => {
    const t = e.target.value;
    T(t), clearTimeout(y.current), y.current = setTimeout(() => {
      P.current = t, g(1), f({ category: i, search: t, page: 1 });
    }, D);
  };
  a.useEffect(() => () => clearTimeout(y.current), []);
  const M = (e) => {
    R(e === "All" ? "" : e), g(1);
  }, U = async (e) => {
    if (!(!x || v)) {
      C(true), p("");
      try {
        const t = await I(x, e.id, b);
        t.status === 201 || t.status === 200 ? (await l(b).catch(() => {
        }), d(null), o("/home")) : t.status === 409 ? (p("You're already a member"), setTimeout(() => {
          d(null), o("/home");
        }, 1200)) : t.status === 202 && (p("Request sent - you'll be notified when approved."), setTimeout(() => d(null), 2e3));
      } catch (t) {
        console.error("[ExplorePage] join failed:", t), p("Failed to join server");
      } finally {
        C(false);
      }
    }
  }, N = Math.max(1, Math.ceil(G / w));
  return s.jsxs("div", { className: "explore-root", children: [s.jsx("div", { className: "explore-header", children: s.jsx("h1", { className: "explore-title", children: "Explore Servers" }) }), s.jsx("div", { className: "explore-tab-row", children: $.map((e) => {
    const t = e === "All" && i === "" || e === i;
    return s.jsx("button", { type: "button", "data-testid": `category-tab-${e}`, onClick: () => M(e), className: `explore-tab${t ? " explore-tab--active" : ""}`, children: e }, e);
  }) }), s.jsx("div", { className: "explore-search-wrap", children: s.jsx("input", { type: "text", placeholder: "Search servers...", value: j, onChange: J, className: "explore-search-input" }) }), A ? s.jsx("div", { className: "explore-grid", children: [0, 1, 2].map((e) => s.jsx("div", { className: "explore-skeleton", "data-testid": "skeleton-card" }, e)) }) : c.length === 0 ? s.jsx("div", { className: "explore-empty", "data-testid": "explore-empty", children: j ? `No servers matching "${j}"` : i ? "No servers in this category." : "No servers found" }) : s.jsxs(s.Fragment, { children: [s.jsx("div", { className: "explore-grid", children: c.map((e) => s.jsxs("button", { type: "button", "data-testid": `guild-card-${e.id}`, onClick: () => {
    d(e), p("");
  }, className: "explore-card", children: [s.jsx("div", { className: "explore-card-name", children: e.publicName }), s.jsx("div", { className: "explore-card-desc", children: F(e.publicDescription, 100) }), s.jsxs("div", { className: "explore-card-meta", children: [s.jsxs("span", { children: [e.memberCount, " members"] }), e.category && s.jsx("span", { className: "explore-category-badge", children: e.category }), s.jsx("span", { className: e.accessPolicy === "open" ? "explore-open-badge" : "explore-request-badge", children: e.accessPolicy === "open" ? "Open" : "Request to join" })] })] }, e.id)) }), N > 1 && s.jsxs("div", { className: "explore-pagination", children: [s.jsx("button", { type: "button", disabled: u <= 1, onClick: () => g((e) => e - 1), className: "explore-page-btn", children: "Previous" }), s.jsxs("span", { className: "explore-page-info", children: ["Page ", u, " of ", N] }), s.jsx("button", { type: "button", disabled: u >= N, onClick: () => g((e) => e + 1), className: "explore-page-btn", children: "Next" })] })] }), n && s.jsx("div", { className: "explore-overlay", "data-testid": "guild-preview-modal", onClick: (e) => {
    e.target === e.currentTarget && d(null);
  }, children: s.jsxs("div", { className: "explore-modal", children: [s.jsx("button", { type: "button", onClick: () => d(null), className: "explore-modal-close", "aria-label": "Close", children: "X" }), s.jsx("h2", { className: "explore-modal-name", children: n.publicName }), s.jsx("p", { className: "explore-modal-desc", children: n.publicDescription }), s.jsxs("div", { className: "explore-modal-meta", children: [s.jsxs("span", { children: [n.memberCount, " members"] }), n.category && s.jsx("span", { className: "explore-category-badge", children: n.category })] }), E ? s.jsx("div", { className: "explore-join-message", children: E }) : s.jsx("button", { type: "button", "data-testid": "join-btn", onClick: () => U(n), disabled: v, className: n.accessPolicy === "open" ? "explore-join-btn-primary" : "explore-join-btn-secondary", children: v ? "Joining..." : n.accessPolicy === "open" ? "Join Server" : "Request to Join" })] }) })] });
}
function F(r, l) {
  return r ? r.length > l ? r.slice(0, l) + "..." : r : "";
}
function z(r, l) {
  for (const [o, c] of r.entries()) if (c.connectionState === "connected") return { token: (l == null ? void 0 : l(o)) ?? c.token, baseUrl: o === window.location.origin ? "" : o };
  const m = r.entries().next().value;
  if (m) {
    const [o, c] = m;
    return { token: (l == null ? void 0 : l(o)) ?? c.token, baseUrl: o === window.location.origin ? "" : o };
  }
  return { token: null, baseUrl: "" };
}
export {
  L as default
};
