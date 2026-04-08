import { j as t, z as f, D as U, A as z, B as R, C as _, E as N } from "./index-BefR8mbE.js";
import { r as n } from "./vendor-react-2AhYlJPv.js";
const S = { marginTop: "14px", display: "flex", flexDirection: "column", gap: "6px" }, v = { fontSize: "0.72rem", color: "var(--hush-text-muted)", display: "flex", alignItems: "center", gap: "6px" }, w = { width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px", padding: "9px 11px", borderRadius: "12px", border: "1px solid var(--hush-border)", background: "color-mix(in srgb, var(--hush-surface) 82%, transparent)", color: "var(--hush-text)", cursor: "pointer" }, j = { display: "flex", flexDirection: "column", gap: "8px", padding: "10px", borderRadius: "14px", border: "1px solid var(--hush-border)", background: "color-mix(in srgb, var(--hush-surface) 92%, transparent)", boxShadow: "0 18px 50px rgba(0, 0, 0, 0.18)" }, I = { width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px", padding: "9px 11px", borderRadius: "12px", border: "1px solid var(--hush-border)", background: "transparent", color: "var(--hush-text)", cursor: "pointer" };
function O({ value: a, instances: c, onSelect: d, disabled: i = false, compact: e = false }) {
  const p = n.useRef(null), [u, o] = n.useState(false), [r, b] = n.useState(""), [g, x] = n.useState(""), [h, y] = n.useState(false), L = n.useMemo(() => e ? { ...S, marginTop: "10px", gap: "4px" } : S, [e]), k = n.useMemo(() => e ? { ...v, fontSize: "0.68rem", letterSpacing: "0.05em", textTransform: "uppercase" } : v, [e]), E = n.useMemo(() => e ? { ...w, padding: "7px 10px", borderRadius: "10px", background: "transparent" } : w, [e]), A = n.useMemo(() => e ? { ...j, padding: "8px", borderRadius: "12px", boxShadow: "0 12px 28px rgba(0, 0, 0, 0.16)" } : j, [e]), C = n.useMemo(() => e ? { ...I, padding: "8px 10px", borderRadius: "10px" } : I, [e]);
  n.useEffect(() => {
    if (!u) return;
    const s = (l) => {
      var _a;
      ((_a = p.current) == null ? void 0 : _a.contains(l.target)) || (o(false), x(""));
    };
    return document.addEventListener("mousedown", s), () => document.removeEventListener("mousedown", s);
  }, [u]);
  const m = n.useCallback(async (s) => {
    if (!i) {
      y(true), x("");
      try {
        await d(s), b(""), o(false);
      } catch (l) {
        x((l == null ? void 0 : l.message) || "Enter a valid instance URL.");
      } finally {
        y(false);
      }
    }
  }, [i, d]), T = n.useCallback(async (s) => {
    if (s.preventDefault(), !r.trim()) {
      x("Enter an instance URL.");
      return;
    }
    await m(r);
  }, [m, r]);
  return t.jsxs("div", { ref: p, style: L, children: [t.jsx("div", { style: k, children: t.jsx("span", { children: "Instance" }) }), t.jsxs("button", { type: "button", style: E, onClick: () => o((s) => !s), disabled: i, title: a, "aria-label": `Connection instance: ${f(a)}`, children: [t.jsx("span", { style: { minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: e ? "0.84rem" : "0.92rem" }, children: f(a) }), t.jsxs("svg", { width: "15", height: "15", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", style: { color: "var(--hush-text-muted)", flexShrink: 0 }, children: [t.jsx("path", { d: "M12 20h9" }), t.jsx("path", { d: "M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" })] })] }), u && t.jsxs("div", { style: A, children: [t.jsx("div", { style: { display: "flex", flexDirection: "column", gap: "8px" }, children: c.map((s) => {
    const l = s.url === a, D = s.url === U;
    return t.jsxs("button", { type: "button", style: { ...C, borderColor: l ? "var(--hush-amber)" : "var(--hush-border)", background: l ? "color-mix(in srgb, var(--hush-amber) 10%, transparent)" : "transparent" }, onClick: () => m(s.url), disabled: h, children: [t.jsxs("span", { style: { display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "1px" }, children: [t.jsx("span", { style: { fontSize: e ? "0.84rem" : "0.92rem" }, children: f(s.url) }), t.jsx("span", { style: { fontSize: e ? "0.72rem" : "0.75rem", color: "var(--hush-text-muted)" }, children: D ? "Pinned default" : s.lastUsedAt ? `Last used ${new Date(s.lastUsedAt).toLocaleDateString()}` : "Saved instance" })] }), l && t.jsx("span", { style: { color: "var(--hush-amber)", fontSize: e ? "0.76rem" : "0.82rem" }, children: "Current" })] }, s.url);
  }) }), t.jsxs("form", { onSubmit: T, style: { display: "flex", flexDirection: "column", gap: "8px" }, children: [t.jsx("input", { className: "input", type: "text", value: r, onChange: (s) => b(s.target.value), placeholder: "Add custom instance", autoCapitalize: "off", autoCorrect: "off", spellCheck: "false", disabled: h }), t.jsx("button", { type: "submit", className: "btn btn-secondary", disabled: h, children: h ? "Saving\u2026" : "Add custom instance" })] }), g && t.jsx("div", { style: { color: "var(--hush-danger)", fontSize: "0.82rem" }, children: g })] })] });
}
function Y() {
  const [a, c] = n.useState(() => z()), [d, i] = n.useState([]), e = n.useCallback(async () => {
    const o = await R();
    i(o);
  }, []);
  n.useEffect(() => {
    e().catch(() => {
      i([]);
    });
  }, [e]);
  const p = n.useCallback(async (o) => {
    const r = await _(o);
    return c(r), await e(), r;
  }, [e]), u = n.useCallback(async (o = a) => {
    const r = await N(o);
    return c(r), await e(), r;
  }, [e, a]);
  return { selectedInstanceUrl: a, selectedInstanceLabel: f(a), knownInstances: d, chooseInstance: p, rememberSelectedInstance: u };
}
export {
  O as A,
  Y as u
};
