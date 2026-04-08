import { j as e, c as Pe, g as Te, i as _e, a as De, u as Oe, b as Ae } from "./index-BefR8mbE.js";
import { r as t, L as ye } from "./vendor-react-2AhYlJPv.js";
import { A as Ue } from "./constants-AlQXj8D-.js";
import { u as Le, A as We } from "./useAuthInstanceSelection-Ca_fYGiR.js";
import { u as Fe, B as Be } from "./useBodyScrollMode-D02fsC65.js";
import { m as z, A as $e } from "./proxy-BXOaFASF.js";
import "./vendor-motion-ws7o_Bh2.js";
const ze = 6e4, Ve = () => typeof window < "u" && /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
function Ye({ words: n, onCopyDone: s }) {
  const [r, a] = t.useState(false), [d, u] = t.useState(() => typeof window < "u" && window.innerWidth < 380), S = t.useRef(null), N = typeof navigator < "u" && typeof navigator.share == "function";
  t.useState(() => {
    if (typeof window > "u") return;
    const i = () => u(window.innerWidth < 380);
    return window.addEventListener("resize", i), () => window.removeEventListener("resize", i);
  });
  const l = n.join(" "), p = async () => {
    S.current && clearTimeout(S.current);
    try {
      await navigator.clipboard.writeText(l), a(true), S.current = setTimeout(async () => {
        try {
          await navigator.clipboard.writeText("");
        } catch {
        }
        a(false), s == null ? void 0 : s();
      }, ze);
    } catch {
    }
  }, c = async () => {
    try {
      await navigator.share({ text: l });
    } catch {
    }
  };
  return e.jsxs("div", { className: "mg-wrapper", children: [e.jsx("div", { className: `mg-grid${d ? " mg-grid--narrow" : ""}`, role: "list", "aria-label": "Recovery phrase words", children: n.map((i, g) => e.jsxs("div", { className: "mg-cell", role: "listitem", children: [e.jsx("span", { className: "mg-cell-number", "aria-hidden": "true", children: g + 1 }), e.jsx("span", { className: "mg-cell-word", children: i })] }, g)) }), e.jsxs("div", { className: "mg-button-row", children: [e.jsx("button", { type: "button", className: `mg-action-btn${r ? " mg-action-btn--active" : ""}`, onClick: p, "aria-label": "Copy all 12 words to clipboard", children: r ? "Copied" : "Copy" }), N && Ve() && e.jsx("button", { type: "button", className: "mg-action-btn", onClick: c, "aria-label": "Share recovery phrase", children: "Save to..." })] })] });
}
function Ge(n) {
  return { fontSize: "0.9rem", flexShrink: 0, color: n === "correct" ? "var(--hush-live)" : "var(--hush-danger)", visibility: n === "idle" ? "hidden" : "visible" };
}
function He(n, s) {
  const r = Array.from({ length: n }, (a, d) => d);
  for (let a = r.length - 1; a > 0; a--) {
    const d = Math.floor(Math.random() * (a + 1));
    [r[a], r[d]] = [r[d], r[a]];
  }
  return r.slice(0, s).sort((a, d) => a - d);
}
function Ke({ words: n, onConfirm: s, onStartOver: r, challengePositions: a, onPositionsSelected: d }) {
  const [u] = t.useState(() => (a == null ? void 0 : a.length) === 3 ? a : He(n.length, 3));
  t.useEffect(() => {
    (a == null ? void 0 : a.length) || (d == null ? void 0 : d(u));
  }, []);
  const [S, N] = t.useState(["", "", ""]), l = t.useCallback((g, m) => {
    if (!m.trim()) return "idle";
    const h = u[g];
    return m.trim().toLowerCase() === n[h].toLowerCase() ? "correct" : "wrong";
  }, [u, n]), p = S.every((g, m) => l(m, g) === "correct"), c = (g, m) => {
    N((h) => {
      const v = [...h];
      return v[g] = m, v;
    });
  }, i = (g, m) => {
    g.key === "Enter" && p && s();
  };
  return e.jsxs("div", { className: "mc-container", children: [e.jsx("p", { className: "mc-heading", children: "Enter the following words to confirm you have saved your recovery phrase." }), e.jsx("div", { className: "mc-challenge-group", children: u.map((g, m) => {
    const h = l(m, S[m]);
    return e.jsxs("div", { className: "mc-field-row", children: [e.jsxs("label", { htmlFor: `confirm-word-${m}`, className: "mc-label", "aria-label": `Word number ${g + 1}`, children: ["Word #", g + 1] }), e.jsxs("div", { className: "mc-input-wrapper", children: [e.jsx("input", { id: `confirm-word-${m}`, className: "input", type: "text", value: S[m], onChange: (v) => c(m, v.target.value), onKeyDown: (v) => i(v), autoCorrect: "off", autoCapitalize: "off", spellCheck: "false", autoComplete: "off", placeholder: "Type the word...", "aria-label": `Word ${g + 1} confirmation`, "aria-invalid": h === "wrong", style: { flex: 1, fontFamily: "var(--font-mono)" } }), e.jsx("span", { style: Ge(h), "aria-hidden": "true", role: "img", children: h === "correct" ? "\u2713" : "\u2717" })] })] }, g);
  }) }), e.jsxs("div", { className: "mc-actions", children: [e.jsx("button", { type: "button", className: "back-link", onClick: r, children: "Start over" }), e.jsx("button", { type: "button", className: "btn btn-primary", disabled: !p, onClick: s, style: { flex: 1, padding: "10px" }, children: "Continue" })] })] });
}
const _ = { INVITE_CODE: "INVITE_CODE", USERNAME: "USERNAME", MNEMONIC_DISPLAY: "MNEMONIC_DISPLAY", MNEMONIC_CONFIRM: "MNEMONIC_CONFIRM", SUBMITTING: "SUBMITTING" }, ge = /^[a-zA-Z0-9_]{3,20}$/, qe = 500;
function Ze(n) {
  return { fontSize: "0.72rem", marginTop: "4px", color: n === "ok" ? "var(--hush-live)" : n === "taken" || n === "invalid" ? "var(--hush-danger)" : "var(--hush-text-muted)", fontFamily: "var(--font-mono)" };
}
function Xe(n, s) {
  return { width: "8px", height: "8px", borderRadius: "50%", background: n ? "var(--hush-amber)" : s ? "var(--hush-text-muted)" : "var(--hush-border)", transition: "background var(--duration-normal)" };
}
function Je(n) {
  const s = [];
  return n === "invite_only" && s.push(_.INVITE_CODE), s.push(_.USERNAME, _.MNEMONIC_DISPLAY, _.MNEMONIC_CONFIRM), s;
}
function ve(n, s) {
  const r = s.indexOf(_.USERNAME), a = s.indexOf(n);
  return r !== -1 && a > r;
}
const ae = "hush_reg_wizard", Qe = "hush-reg-wizard", Z = "state", Se = 10 * 6e4;
function xe() {
  const n = Te();
  return { mnemonic: n, mnemonicWords: n.split(" ") };
}
function be(n, s, r, a) {
  return a || n === _.SUBMITTING ? _.MNEMONIC_CONFIRM : s.includes(n) ? n : r;
}
function pe() {
  return new Promise((n, s) => {
    const r = indexedDB.open(Qe, 1);
    r.onupgradeneeded = () => r.result.createObjectStore(Z), r.onsuccess = () => n(r.result), r.onerror = () => s(r.error);
  });
}
async function et(n) {
  try {
    const s = await pe(), r = s.transaction(Z, "readwrite");
    r.objectStore(Z).put({ ...n, savedAt: Date.now() }, "wizard"), await new Promise((a, d) => {
      r.oncomplete = a, r.onerror = () => d(r.error);
    }), s.close();
  } catch {
  }
}
async function je() {
  try {
    const n = await pe(), r = n.transaction(Z, "readonly").objectStore(Z).get("wizard"), a = await new Promise((d, u) => {
      r.onsuccess = () => d(r.result), r.onerror = () => u(r.error);
    });
    return n.close(), a ? a.savedAt && Date.now() - a.savedAt > Se ? (await ke(), null) : a : null;
  } catch {
    return null;
  }
}
async function ke() {
  try {
    const n = await pe(), s = n.transaction(Z, "readwrite");
    s.objectStore(Z).delete("wizard"), await new Promise((r, a) => {
      s.oncomplete = r, s.onerror = () => a(s.error);
    }), n.close();
  } catch {
  }
}
async function tt() {
  return await je() !== null;
}
function nt() {
  try {
    const n = sessionStorage.getItem(ae);
    if (!n) return null;
    const s = JSON.parse(n);
    return (s == null ? void 0 : s.savedAt) && Date.now() - s.savedAt > Se ? (sessionStorage.removeItem(ae), null) : s;
  } catch {
    return null;
  }
}
function st(n) {
  try {
    sessionStorage.setItem(ae, JSON.stringify({ ...n, savedAt: Date.now() }));
  } catch {
  }
  et(n);
}
function he() {
  try {
    sessionStorage.removeItem(ae);
  } catch {
  }
  ke();
}
function rt({ onComplete: n, onCancel: s, registrationMode: r = "open", instanceUrl: a = "", instanceName: d, onInstanceLockedChange: u, isLoading: S = false, error: N }) {
  const l = Je(r), p = l[0], c = t.useRef(nt()).current, i = !!(c == null ? void 0 : c.pastDisplayStep), g = !!((c == null ? void 0 : c.pastUsernameStep) || ve(c == null ? void 0 : c.step, l)), m = t.useRef((c == null ? void 0 : c.mnemonic) ? { mnemonic: c.mnemonic, mnemonicWords: c.mnemonic.split(" ") } : xe()).current, [h, v] = t.useState(be(c == null ? void 0 : c.step, l, p, i)), [I, D] = t.useState((c == null ? void 0 : c.inviteCode) ?? ""), [j, C] = t.useState((c == null ? void 0 : c.username) ?? ""), [M, A] = t.useState((c == null ? void 0 : c.displayName) ?? ""), [k, U] = t.useState(m.mnemonic), [F, L] = t.useState(m.mnemonicWords), [O, G] = t.useState((c == null ? void 0 : c.challengePositions) ?? null), [B, f] = t.useState(g), [x, b] = t.useState(i), [P, W] = t.useState(false), [X, R] = t.useState(""), [ie, ee] = t.useState(false), H = t.useRef(false), te = t.useRef(false);
  t.useEffect(() => {
    c || H.current || (H.current = true, je().then((o) => {
      var _a;
      if (!o) return;
      const T = !!o.pastDisplayStep, q = !!(o.pastUsernameStep || ve(o.step, l));
      v(be(o.step, l, p, T)), f(q), b(T), D(o.inviteCode ?? ""), C(o.username ?? ""), A(o.displayName ?? ""), o.mnemonic && (U(o.mnemonic), L(o.mnemonic.split(" "))), G(((_a = o.challengePositions) == null ? void 0 : _a.length) === 3 ? o.challengePositions : null);
    }));
  }, [p, c, l]), t.useEffect(() => {
    st({ step: h, inviteCode: I, username: j, displayName: M, mnemonic: k, challengePositions: O, pastUsernameStep: B, pastDisplayStep: x });
  }, [h, I, j, M, k, O, B, x]), t.useEffect(() => {
    ee(false);
  }, [N]), t.useEffect(() => {
    u == null ? void 0 : u(B);
  }, [u, B]), t.useEffect(() => () => {
    u == null ? void 0 : u(false);
  }, [u]);
  const [$, V] = t.useState("idle"), [oe, ne] = t.useState(0), K = t.useRef(null), Y = l.indexOf(h);
  l.length;
  const se = t.useCallback(() => {
    const o = xe();
    he(), D(""), C(""), A(""), U(o.mnemonic), L(o.mnemonicWords), G(null), f(false), b(false), W(false), ee(true), R(""), v(p);
  }, [p]);
  t.useEffect(() => {
    if (!j) {
      V("idle");
      return;
    }
    if (!ge.test(j)) {
      V("invalid");
      return;
    }
    V("checking"), K.current && clearTimeout(K.current);
    const o = new AbortController();
    return K.current = setTimeout(async () => {
      try {
        const T = await Pe(j.trim(), a, o.signal);
        o.signal.aborted || V(T ? "ok" : "taken");
      } catch {
        o.signal.aborted || V("error");
      }
    }, qe), () => {
      o.abort(), K.current && clearTimeout(K.current);
    };
  }, [a, j, oe]);
  const le = t.useCallback(() => {
    $ === "error" && ne((o) => o + 1);
  }, [$]), re = t.useCallback(() => {
    const o = Y - 1;
    if (o < 0) {
      he(), s();
      return;
    }
    v(l[o]), R("");
  }, [Y, l, s]), J = t.useCallback(() => {
    const o = Y + 1;
    o < l.length && (v(l[o]), R(""));
  }, [Y, l]), ce = t.useCallback(() => {
    if (!I.trim()) {
      R("Please enter an invite code.");
      return;
    }
    R(""), J();
  }, [I, J]), ue = t.useCallback(() => {
    const o = j.trim(), T = d || "this instance";
    if (!o) {
      R("Please enter a username.");
      return;
    }
    if (!ge.test(o)) {
      R("Username must be 3-20 characters: letters, numbers, and underscores only.");
      return;
    }
    if ($ === "checking") {
      R(`Checking username availability on ${T}.`);
      return;
    }
    if ($ === "taken") {
      R(`Username already taken on ${T}.`);
      return;
    }
    if ($ === "error") {
      R(`Could not check username availability on ${T}. Verify the instance and try again.`);
      return;
    }
    if ($ !== "ok") {
      R("Choose a valid username to continue.");
      return;
    }
    f(true), R(""), J();
  }, [J, d, j, $]), de = t.useCallback(() => {
    P && (b(true), v(_.MNEMONIC_CONFIRM), R(""));
  }, [P]), y = t.useCallback(async () => {
    R(""), v(_.SUBMITTING);
    try {
      await n({ username: j.trim(), displayName: M.trim() || j.trim(), mnemonic: k, inviteCode: I.trim() || void 0 }), he();
    } catch (o) {
      v(_.MNEMONIC_CONFIRM), R((o == null ? void 0 : o.message) || "Failed to create account. Please try again.");
    }
  }, [j, M, k, I, n]);
  t.useEffect(() => {
    if (h !== _.MNEMONIC_CONFIRM) {
      te.current = false;
      return;
    }
    te.current || (window.history.pushState({ hushRegConfirmGuard: Date.now() }, "", window.location.href), te.current = true);
    const o = () => {
      se();
    };
    return window.addEventListener("popstate", o), () => {
      window.removeEventListener("popstate", o);
    };
  }, [se, h]);
  const w = (ie ? "" : N == null ? void 0 : N.message) || X;
  return e.jsxs("div", { className: "rw-container", children: [e.jsx("div", { className: "rw-step-indicator", "aria-hidden": "true", children: l.map((o, T) => e.jsx("div", { style: Xe(T === Y, T < Y) }, o)) }), w && h !== _.SUBMITTING && e.jsx("div", { className: "rw-error", role: "alert", children: w }), h === _.INVITE_CODE && e.jsx(at, { value: I, onChange: D, onNext: ce, onCancel: s }), h === _.USERNAME && e.jsx(it, { username: j, displayName: M, instanceName: d, usernameState: $, onUsernameChange: C, onDisplayNameChange: A, onRetry: le, onNext: ue, onBack: re }), h === _.MNEMONIC_DISPLAY && e.jsx(ot, { words: F, savedConfirmed: P, onSavedConfirmedChange: W, onNext: de, onBack: re }), h === _.MNEMONIC_CONFIRM && e.jsx(Ke, { words: F, onConfirm: y, onStartOver: se, challengePositions: O, onPositionsSelected: G }), h === _.SUBMITTING && e.jsxs("div", { className: "rw-loading", children: [e.jsx("div", { "aria-label": "Creating account", role: "status", children: "Creating your account..." }), w && e.jsx("div", { className: "rw-error", role: "alert", children: w })] })] });
}
function at({ value: n, onChange: s, onNext: r, onCancel: a }) {
  const d = (u) => {
    u.key === "Enter" && r();
  };
  return e.jsxs("div", { className: "rw-inner", children: [e.jsxs("div", { children: [e.jsx("p", { className: "rw-heading", children: "Enter invite code" }), e.jsx("p", { className: "rw-subheading", children: "This server requires an invite to register." })] }), e.jsxs("div", { children: [e.jsx("label", { htmlFor: "invite-code", className: "rw-field-label", children: "Invite code" }), e.jsx("input", { id: "invite-code", className: "input", type: "text", value: n, onChange: (u) => s(u.target.value), onKeyDown: d, placeholder: "Enter your invite code", autoComplete: "off", autoFocus: true })] }), e.jsxs("div", { className: "rw-actions", children: [e.jsx("button", { type: "button", className: "back-link", onClick: a, children: "\u2190 Cancel" }), e.jsx("button", { type: "button", className: "btn btn-primary", disabled: !n.trim(), onClick: r, style: { flex: 1, padding: "10px" }, children: "Continue" })] })] });
}
function it({ username: n, displayName: s, instanceName: r, usernameState: a, onUsernameChange: d, onDisplayNameChange: u, onRetry: S, onNext: N, onBack: l }) {
  const p = (m) => {
    m.key === "Enter" && N();
  }, c = r || "this instance", i = a === "error", g = a === "invalid" ? "3\u201320 characters: letters, numbers, underscores only" : a === "checking" ? `Checking availability on ${c}...` : a === "taken" ? `Username already taken on ${c}` : a === "ok" ? `Available on ${c}` : i ? `Could not reach ${c}. Tap to retry.` : null;
  return e.jsxs("div", { className: "rw-inner", children: [e.jsxs("div", { children: [e.jsx("p", { className: "rw-heading", children: "Choose a username" }), e.jsx("p", { className: "rw-subheading", children: "Your username is your identity on this server." })] }), e.jsxs("div", { children: [e.jsx("label", { htmlFor: "reg-username", className: "rw-field-label", children: "Username" }), e.jsx("input", { id: "reg-username", className: "input", type: "text", value: n, onChange: (m) => d(m.target.value), onKeyDown: p, placeholder: "e.g. alice", autoComplete: "username", autoFocus: true }), g && e.jsx("div", { role: i ? "button" : void 0, tabIndex: i ? 0 : void 0, onClick: i ? S : void 0, onKeyDown: i ? (m) => {
    m.key === "Enter" && S();
  } : void 0, style: { ...Ze(a), ...i ? { cursor: "pointer", textDecoration: "underline" } : {} }, "aria-live": "polite", children: g })] }), e.jsxs("div", { children: [e.jsxs("label", { htmlFor: "reg-display-name", className: "rw-field-label", children: ["Display name", " ", e.jsx("span", { style: { color: "var(--hush-text-ghost)", fontWeight: 400 }, children: "(optional)" })] }), e.jsx("input", { id: "reg-display-name", className: "input", type: "text", value: s, onChange: (m) => u(m.target.value), onKeyDown: p, placeholder: "How others see you", maxLength: 30, autoComplete: "off" })] }), e.jsxs("div", { className: "rw-actions", children: [e.jsx("button", { type: "button", className: "back-link", onClick: l, children: "\u2190 Back" }), e.jsx("button", { type: "button", className: "btn btn-primary", disabled: !n.trim() || a !== "ok", onClick: N, style: { flex: 1, padding: "10px" }, children: "Continue" })] })] });
}
function ot({ words: n, savedConfirmed: s, onSavedConfirmedChange: r, onNext: a, onBack: d }) {
  return e.jsxs("div", { className: "rw-inner", children: [e.jsxs("div", { children: [e.jsx("p", { className: "rw-heading", children: "Your recovery phrase" }), e.jsx("p", { className: "rw-subheading", children: "Write these 12 words down and keep them safe." })] }), e.jsxs("div", { className: "rw-warning-box", children: [e.jsxs("div", { className: "rw-warning-title", children: [e.jsx("span", { "aria-hidden": "true", children: "\u26A0" }), "Important: save this before continuing"] }), e.jsx("p", { style: { margin: 0, fontSize: "0.78rem" }, children: "This is your recovery phrase. Write it down and store it in a safe place. If you lose this phrase and all your devices, your account is permanently irrecoverable. Hush cannot help you recover it." })] }), e.jsx(Ye, { words: n }), e.jsxs("label", { className: "rw-checkbox-row", children: [e.jsx("input", { type: "checkbox", checked: s, onChange: (u) => r(u.target.checked) }), "I have saved my recovery phrase"] }), e.jsxs("div", { className: "rw-actions", children: [e.jsx("button", { type: "button", className: "back-link", onClick: d, children: "\u2190 Back" }), e.jsx("button", { type: "button", className: "btn btn-primary", disabled: !s, onClick: a, style: { flex: 1, padding: "10px" }, children: "Continue" })] })] });
}
const lt = 5, ct = 2;
function ut({ onSubmit: n, onCancel: s, isRecoveryMode: r = true, isLoading: a = false }) {
  const [d, u] = t.useState(() => Array(12).fill("")), [S, N] = t.useState(null), [l, p] = t.useState([]), [c, i] = t.useState(-1), [g, m] = t.useState(false), h = t.useRef(Array(12).fill(null)), v = t.useRef(null), I = d.join(" ").trim(), D = d.every((f) => f.trim().length > 0), j = D && _e(I), C = D, M = t.useCallback((f) => {
    if (f.length < ct) return [];
    const x = f.toLowerCase(), b = De(), P = [];
    for (const W of b) if (W.startsWith(x) && (P.push(W), P.length >= lt)) break;
    return P;
  }, []), A = t.useCallback((f, x) => {
    u((b) => {
      const P = [...b];
      return P[f] = x, P;
    });
  }, []), k = t.useCallback((f, x) => {
    A(f, x), p([]), i(-1);
    const b = f + 1;
    b < 12 && setTimeout(() => {
      var _a;
      return (_a = h.current[b]) == null ? void 0 : _a.focus();
    }, 0);
  }, [A]), U = t.useCallback((f, x) => {
    A(f, x);
    const b = M(x);
    p(b), i(-1), N(f);
  }, [A, M]), F = t.useCallback((f) => {
    N(f);
    const x = d[f];
    p(M(x)), i(-1);
  }, [d, M]), L = t.useCallback((f) => {
    setTimeout(() => {
      var _a;
      ((_a = v.current) == null ? void 0 : _a.contains(document.activeElement)) || (p([]), N(null), i(-1));
    }, 150);
  }, []), O = t.useCallback((f, x) => {
    if (l.length === 0) {
      if (f.key === " " && d[x].trim().length > 0) {
        f.preventDefault();
        const b = x + 1;
        b < 12 && setTimeout(() => {
          var _a;
          return (_a = h.current[b]) == null ? void 0 : _a.focus();
        }, 0);
      }
      return;
    }
    if (f.key === "ArrowDown") f.preventDefault(), i((b) => Math.min(b + 1, l.length - 1));
    else if (f.key === "ArrowUp") f.preventDefault(), i((b) => Math.max(b - 1, -1));
    else if (f.key === "Enter" || f.key === "Tab") c >= 0 && l[c] && (f.preventDefault(), k(x, l[c]));
    else if (f.key === "Escape") p([]), i(-1);
    else if (f.key === " ") {
      f.preventDefault();
      const b = l[0];
      b && k(x, b);
    }
  }, [l, c, d, k]), G = t.useCallback((f, x) => {
    if (x !== 0) return;
    const P = f.clipboardData.getData("text").trim().split(/\s+/);
    P.length === 12 && (f.preventDefault(), u(P.slice(0, 12)), p([]), setTimeout(() => {
      var _a;
      return (_a = h.current[11]) == null ? void 0 : _a.focus();
    }, 0));
  }, []), B = t.useCallback(() => {
    j && (r ? m(true) : n(I, false));
  }, [j, r, I, n]);
  return g ? e.jsx("div", { className: "rpi-container", children: e.jsxs("div", { className: "rpi-revoke-step", children: [e.jsx("h3", { className: "rpi-revoke-heading", children: "Revoke other devices?" }), e.jsx("p", { className: "rpi-revoke-desc", children: "This will sign out all other devices. They will need to re-link to access your account." }), e.jsxs("div", { className: "rpi-revoke-actions", children: [e.jsx("button", { type: "button", className: "btn btn-primary", disabled: a, onClick: () => n(I, true), style: { flex: 1, padding: "10px" }, children: a ? "Signing in..." : "Revoke other devices" }), e.jsx("button", { type: "button", className: "btn btn-secondary", disabled: a, onClick: () => n(I, false), style: { flex: 1, padding: "10px" }, children: "Keep other devices" })] }), e.jsx("button", { type: "button", className: "back-link", onClick: () => m(false), style: { marginTop: "8px" }, children: "\u2190 Back" })] }) }) : e.jsxs("div", { className: "rpi-container", children: [e.jsx("div", { className: "rpi-grid", children: d.map((f, x) => e.jsxs("div", { className: "rpi-field-group", children: [e.jsx("label", { htmlFor: `recovery-word-${x}`, className: "rpi-field-label", children: x + 1 }), e.jsxs("div", { className: "rpi-input-wrap", children: [e.jsx("input", { ref: (b) => {
    h.current[x] = b;
  }, id: `recovery-word-${x}`, className: "input", type: "text", value: f, onChange: (b) => U(x, b.target.value), onFocus: () => F(x), onBlur: L, onKeyDown: (b) => O(b, x), onPaste: (b) => G(b, x), autoCorrect: "off", autoCapitalize: "off", spellCheck: "false", autoComplete: "off", style: { fontFamily: "var(--font-mono)", fontSize: "0.82rem" }, "aria-label": `Word ${x + 1} of 12`, "aria-autocomplete": "list", "aria-expanded": S === x && l.length > 0 }), S === x && l.length > 0 && e.jsx("div", { ref: v, className: "rpi-dropdown", role: "listbox", children: l.map((b, P) => e.jsx("div", { className: `rpi-dropdown-item${P === c ? " rpi-dropdown-item--active" : ""}`, role: "option", "aria-selected": P === c, onMouseDown: (W) => {
    W.preventDefault(), k(x, b);
  }, children: b }, b)) })] })] }, x)) }), C && e.jsx("div", { className: j ? "rpi-validity-banner--valid" : "rpi-validity-banner--invalid", role: "status", "aria-live": "polite", children: j ? "Valid phrase" : "Invalid phrase - check all 12 words" }), e.jsxs("div", { className: "rpi-actions", children: [e.jsx("button", { type: "button", className: "back-link", onClick: s, children: "\u2190 Back" }), e.jsx("button", { type: "button", className: "btn btn-primary", disabled: !j || a, onClick: B, style: { flex: 1, padding: "10px" }, children: a ? "Signing in..." : "Sign in" })] })] });
}
const Q = 10, dt = [{ threshold: 9, delayMs: 6e4 }, { threshold: 7, delayMs: 3e4 }, { threshold: 5, delayMs: 5e3 }, { threshold: 3, delayMs: 1e3 }];
function ht(n) {
  for (const { threshold: s, delayMs: r } of dt) if (n >= s) return r;
  return 0;
}
function mt({ username: n, avatarUrl: s, onUnlock: r, onSwitchAccount: a, attemptCount: d = 0 }) {
  const [u, S] = t.useState(""), [N, l] = t.useState(false), [p, c] = t.useState(""), [i, g] = t.useState(d), [m, h] = t.useState(0), [v, I] = t.useState(false), D = t.useRef(null), j = t.useRef(null), C = d || i;
  t.useEffect(() => {
    var _a;
    (_a = D.current) == null ? void 0 : _a.focus();
  }, []);
  const M = t.useCallback((U) => {
    U <= 0 || (I(true), h(Math.ceil(U / 1e3)), j.current = setInterval(() => {
      h((F) => F <= 1 ? (clearInterval(j.current), I(false), 0) : F - 1);
    }, 1e3));
  }, []);
  t.useEffect(() => () => {
    j.current && clearInterval(j.current);
  }, []);
  const A = t.useCallback(async (U) => {
    if (U.preventDefault(), !(!u || N || v)) {
      l(true), c("");
      try {
        await r(u);
      } catch (F) {
        const L = i + 1;
        if (g(L), (F == null ? void 0 : F.code) === "VAULT_WIPED") {
          c("Too many failed attempts. Vault has been wiped. Please sign in with your recovery phrase.");
          return;
        }
        const O = ht(L);
        O > 0 ? (M(O), c(`Incorrect PIN - wait ${Math.ceil(O / 1e3)}s before trying again (${Q - L} attempt${Q - L !== 1 ? "s" : ""} remaining)`)) : c(`Incorrect PIN (${Q - L} attempt${Q - L !== 1 ? "s" : ""} remaining)`), S("");
      } finally {
        l(false);
      }
    }
  }, [u, N, v, r, i, M]), k = s ? e.jsx("img", { src: s, alt: "", style: { width: "100%", height: "100%", objectFit: "cover" } }) : (n == null ? void 0 : n.charAt(0).toUpperCase()) ?? "?";
  return e.jsxs("div", { className: "pin-unlock-container", children: [e.jsxs("div", { className: "pin-unlock-identity", children: [e.jsx("div", { className: "pin-unlock-avatar", "aria-hidden": "true", children: k }), e.jsx("span", { className: "pin-unlock-username", children: n })] }), p && e.jsx("div", { className: "pin-unlock-error", role: "alert", children: p }), C >= 5 && !p && e.jsxs("div", { className: "pin-unlock-warning", role: "status", children: [Q - C, " attempt", Q - C !== 1 ? "s" : "", " remaining"] }), e.jsxs("form", { className: "pin-unlock-form", onSubmit: A, children: [e.jsxs("div", { children: [e.jsx("label", { htmlFor: "pin-input", className: "pin-unlock-field-label", children: "PIN" }), e.jsx("input", { ref: D, id: "pin-input", className: "input", type: "password", inputMode: "numeric", pattern: "[0-9]*", value: u, onChange: (U) => S(U.target.value), placeholder: "Enter your PIN", minLength: 4, autoComplete: "off", disabled: N || v, "aria-label": "Vault PIN" })] }), v && e.jsxs("div", { className: "pin-unlock-countdown", "aria-live": "polite", "aria-atomic": "true", children: ["Wait ", m, "s before retrying"] }), e.jsx("button", { className: "btn btn-primary", type: "submit", disabled: !u || u.length < 4 || N || v, style: { width: "100%", padding: "12px" }, children: N ? "Unlocking..." : "Unlock" })] }), e.jsx("button", { type: "button", className: "pin-unlock-switch", onClick: a, children: "Not you? Sign in" })] });
}
function Ne(n) {
  return { flex: 1, padding: "8px", fontSize: "0.8rem", fontFamily: "var(--font-sans)", border: "none", borderRadius: "var(--radius-sm)", cursor: "pointer", background: n ? "var(--hush-elevated)" : "transparent", color: n ? "var(--hush-text)" : "var(--hush-text-muted)", transition: "background var(--duration-fast), color var(--duration-fast)" };
}
function pt(n) {
  return { height: "100%", width: `${n / 4 * 100}%`, background: n < 2 ? "var(--hush-danger)" : n < 3 ? "var(--hush-amber)" : "var(--hush-live)", transition: "width var(--duration-normal)" };
}
function ft(n) {
  return { fontSize: "0.68rem", marginTop: "3px", color: n < 2 ? "var(--hush-danger)" : n < 3 ? "var(--hush-amber)" : "var(--hush-live)", fontFamily: "var(--font-mono)" };
}
function yt(n) {
  return n.length < 6 ? 0 : n.length < 9 ? 1 : n.length < 12 ? 2 : n.length < 16 ? 3 : 4;
}
const gt = ["", "Weak", "Fair", "Good", "Strong"];
function vt({ onSetPin: n, onSkip: s, isLoading: r = false }) {
  const [a, d] = t.useState("pin"), [u, S] = t.useState(""), [N, l] = t.useState(""), [p, c] = t.useState(""), i = a === "pin", g = i ? 4 : 6, m = i ? null : yt(u), h = u.length >= g, v = u === N && h, I = N.length > 0 && u !== N, D = t.useCallback((C) => {
    d(C), S(""), l(""), c("");
  }, []), j = t.useCallback(async (C) => {
    if (C.preventDefault(), !!v) {
      c("");
      try {
        await n(u);
      } catch (M) {
        c((M == null ? void 0 : M.message) || "Failed to set PIN. Please try again.");
      }
    }
  }, [v, n, u]);
  return e.jsxs("div", { className: "pin-setup-container", children: [e.jsxs("p", { className: "pin-setup-description", children: ["Your ", i ? "PIN" : "passphrase", " encrypts your identity key on this device. You will need it to unlock Hush after closing your browser."] }), e.jsxs("div", { className: "pin-setup-mode-toggle", children: [e.jsx("button", { type: "button", style: Ne(i), onClick: () => D("pin"), children: "Use a PIN" }), e.jsx("button", { type: "button", style: Ne(!i), onClick: () => D("passphrase"), children: "Use a passphrase" })] }), e.jsxs("form", { onSubmit: j, className: "pin-setup-form", children: [e.jsxs("div", { children: [e.jsx("label", { htmlFor: "pin-setup-value", className: "pin-setup-field-label", children: i ? "PIN (min 4 digits)" : "Passphrase (min 6 characters)" }), e.jsx("input", { id: "pin-setup-value", className: "input", type: "password", value: u, onChange: (C) => S(C.target.value), placeholder: i ? "Enter a PIN" : "Enter a passphrase", minLength: g, inputMode: i ? "numeric" : void 0, autoComplete: "new-password" }), !i && u.length >= 2 && e.jsxs(e.Fragment, { children: [e.jsx("div", { className: "pin-setup-strength-bar", children: e.jsx("div", { style: pt(m) }) }), m > 0 && e.jsx("div", { style: ft(m), children: gt[m] })] })] }), e.jsxs("div", { children: [e.jsxs("label", { htmlFor: "pin-setup-confirm", className: "pin-setup-field-label", children: ["Confirm ", i ? "PIN" : "passphrase"] }), e.jsx("input", { id: "pin-setup-confirm", className: "input", type: "password", inputMode: i ? "numeric" : void 0, value: N, onChange: (C) => l(C.target.value), placeholder: `Repeat your ${i ? "PIN" : "passphrase"}`, minLength: g, autoComplete: "new-password" }), I && e.jsx("div", { className: "pin-setup-mismatch", role: "alert", children: i ? "PINs do not match" : "Passphrases do not match" })] }), p && e.jsx("div", { className: "pin-setup-error", role: "alert", children: p }), e.jsxs("div", { className: "pin-setup-actions", children: [s && e.jsx("button", { type: "button", className: "back-link", onClick: s, style: { flexShrink: 0 }, children: "Skip for now" }), e.jsx("button", { className: "btn btn-primary", type: "submit", disabled: !v || r, style: { flex: 1, padding: "10px" }, children: r ? "Saving..." : `Set ${i ? "PIN" : "passphrase"}` })] })] }), s && e.jsx("div", { className: "pin-setup-skip-warning", children: "Without a PIN, you will need your 12-word recovery phrase every time you open Hush." })] });
}
const we = ["share", "your", "screen.", "keep", "your"], xt = ["secrets", "aliases", "data", "silence", "whispers", "scrolls", "cookies", "DMs", "chats", "burners", "typing", "thoughts", "flings", "villain arc", "binges"];
function Ce() {
  const n = [...xt];
  for (let s = n.length - 1; s > 0; s--) {
    const r = Math.floor(Math.random() * (s + 1));
    [n[s], n[r]] = [n[r], n[s]];
  }
  return ["privacy", ...n];
}
const bt = Ce(), me = "privacy.", Nt = { height: "100%", minHeight: "100dvh", overflowY: "auto", overflowX: "hidden", WebkitOverflowScrolling: "touch" }, wt = 65, St = 40, jt = 1400, kt = 200, Ee = { hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } } };
function Ct() {
  const n = t.useRef(bt), s = t.useRef(null), [r, a] = t.useState(null), [d, u] = t.useState(0), [S, N] = t.useState(""), [l, p] = t.useState("typing");
  return t.useEffect(() => {
    var _a;
    if (!s.current) return;
    const c = () => {
      if (s.current) {
        const i = s.current.getBoundingClientRect().width;
        a(i);
      }
    };
    ((_a = document.fonts) == null ? void 0 : _a.ready) ? document.fonts.ready.then(c) : c();
  }, []), t.useEffect(() => {
    const i = n.current[d] + ".";
    if (l === "typing") {
      if (S.length < i.length) {
        const g = setTimeout(() => N(i.slice(0, S.length + 1)), wt);
        return () => clearTimeout(g);
      }
      p("pausing");
      return;
    }
    if (l === "pausing") {
      const g = setTimeout(() => p("deleting"), jt);
      return () => clearTimeout(g);
    }
    if (l === "deleting") {
      if (S.length > 0) {
        const g = setTimeout(() => N((m) => m.slice(0, -1)), St);
        return () => clearTimeout(g);
      }
      p("waiting");
      return;
    }
    if (l === "waiting") {
      const g = setTimeout(() => {
        u((m) => {
          const h = m + 1;
          return h >= n.current.length ? (n.current = Ce(), 0) : h;
        }), p("typing");
      }, kt);
      return () => clearTimeout(g);
    }
  }, [l, S, d]), e.jsxs("span", { style: { position: "relative", display: "inline-block", marginRight: "0.25em", whiteSpace: "nowrap", minWidth: r ?? `${me.length}ch`, textAlign: "left" }, children: [e.jsx("span", { ref: s, style: { position: "absolute", left: 0, top: 0, visibility: "hidden", whiteSpace: "nowrap", pointerEvents: "none" }, "aria-hidden": "true", children: me }), e.jsxs(z.span, { style: { display: "inline-block", whiteSpace: "nowrap" }, variants: Ee, children: [S, e.jsx("span", { className: "typewriter-cursor", "aria-hidden": "true" })] })] });
}
const E = { CHOOSE: "choose", RECOVERY: "recovery", REGISTER_WIZARD: "register_wizard", PIN_UNLOCK: "pin_unlock", PIN_SETUP: "pin_setup" };
function Et(n) {
  try {
    return new URL(n).host;
  } catch {
    return String(n || "this instance");
  }
}
function Ie(n) {
  return `Could not reach ${Et(n)}. Check the instance URL and that the server is online.`;
}
function It(n) {
  const s = (n == null ? void 0 : n.message) || String(n);
  return /could not reach|load failed|failed to fetch|networkerror/i.test(s);
}
function Rt(n, s = "") {
  if (!n) return "";
  const r = (n == null ? void 0 : n.message) || String(n);
  return It(n) ? Ie(s) : /session not found|session.*expired/i.test(r) ? "Your session has ended. Please sign in again to continue." : /not found|404/i.test(r) ? "Not found. Please try again." : /forbidden|403/i.test(r) ? "Access denied." : /conflict|409|already/i.test(r) ? "Username already taken. Please choose another." : /unauthorized|401/i.test(r) ? "Invalid credentials." : /no account found|key not found|unknown key/i.test(r) ? "No account found for this recovery phrase. If you have lost all your devices, you will need to create a new account." : r || "Something went wrong. Please try again.";
}
function Ut() {
  Fe(Be.SCROLL);
  const { vaultState: n, user: s, performRegister: r, performRecovery: a, unlockVault: d, setPIN: u, hasVault: S, hasSession: N, needsUnlock: l, loading: p, error: c, clearError: i, needsPinSetup: g, skipPinSetup: m } = Oe(), [h, v] = t.useState(E.CHOOSE), [I, D] = t.useState(false), [j, C] = t.useState(false), [M, A] = t.useState(null), { selectedInstanceUrl: k, selectedInstanceLabel: U, knownInstances: F, chooseInstance: L, rememberSelectedInstance: O } = Le(), [G, B] = t.useState(null), [f, x] = t.useState(null);
  t.useEffect(() => {
    let y = false;
    return B(null), x(null), Ae(k).then((w) => {
      y || (B(w), x(null));
    }).catch((w) => {
      y || (B(null), x(w));
    }), () => {
      y = true;
    };
  }, [k]), t.useEffect(() => {
    h !== E.REGISTER_WIZARD && C(false);
  }, [h]);
  const b = (G == null ? void 0 : G.registration_mode) ?? "open", P = f ? Ie(k) : "", W = t.useRef(null), X = t.useRef(null), R = t.useRef({ x: -1e3, y: -1e3 }), ie = t.useRef({ x: -1e3, y: -1e3 }), ee = t.useRef(null), H = t.useRef(null), [te, $] = t.useState(null), [V, oe] = t.useState(null), [ne, K] = t.useState(() => typeof window < "u" ? !window.matchMedia("(pointer: coarse)").matches : false);
  t.useEffect(() => {
    p || S || N || tt().then((y) => {
      y && v(E.REGISTER_WIZARD);
    });
  }, [p, N, S]), t.useEffect(() => {
    if (!p) {
      if (g && N) {
        v(E.PIN_SETUP);
        return;
      }
      if (l) {
        v(E.PIN_UNLOCK);
        return;
      }
      !S && !N && (h === E.PIN_UNLOCK || h === E.PIN_SETUP) && v(E.CHOOSE);
    }
  }, [p, N, S, g, l]), t.useEffect(() => {
    const y = c ? Rt(c, k) : null;
    if (A(y), !y) return;
    const w = setTimeout(() => {
      A(null), i == null ? void 0 : i();
    }, 5e3);
    return () => clearTimeout(w);
  }, [c, i, k]), t.useEffect(() => {
    const y = window.matchMedia("(pointer: coarse)"), w = () => K(!y.matches);
    return w(), y.addEventListener("change", w), () => y.removeEventListener("change", w);
  }, []), t.useEffect(() => {
    if (!ne) return;
    const y = () => {
      const w = R.current, o = ie.current;
      o.x += (w.x - o.x) * 0.08, o.y += (w.y - o.y) * 0.08, W.current && (W.current.style.setProperty("--sx", `${o.x}px`), W.current.style.setProperty("--sy", `${o.y}px`)), X.current = requestAnimationFrame(y);
    };
    return X.current = requestAnimationFrame(y), () => {
      X.current && cancelAnimationFrame(X.current);
    };
  }, [ne]), t.useEffect(() => {
    const y = ee.current;
    if (!y) return;
    const w = () => {
      const T = y.firstChild;
      if (!T || T.nodeType !== Node.TEXT_NODE) return;
      const q = document.createRange();
      q.setStart(T, 1), q.setEnd(T, 2);
      const fe = q.getBoundingClientRect(), Re = y.getBoundingClientRect(), Me = fe.left + fe.width / 2 - Re.left;
      oe(Me - 5);
    };
    document.fonts.ready.then(w);
    const o = new ResizeObserver(w);
    return o.observe(y), () => o.disconnect();
  }, []), t.useEffect(() => {
    var _a;
    if (!H.current) return;
    const y = () => {
      if (H.current) {
        const w = H.current.getBoundingClientRect().width;
        $(w);
      }
    };
    ((_a = document.fonts) == null ? void 0 : _a.ready) ? document.fonts.ready.then(y) : y();
  }, []);
  const Y = t.useCallback((y) => {
    R.current.x = y.clientX, R.current.y = y.clientY;
  }, []), se = t.useCallback(async ({ username: y, displayName: w, mnemonic: o, inviteCode: T }) => {
    const q = await O(k);
    await r(y, w, o, T, q);
  }, [r, O, k]), le = t.useCallback(async (y, w) => {
    const o = await O(k);
    await a(y, w, o);
  }, [a, O, k]), re = t.useCallback(async (y) => {
    await d(y);
  }, [d]), J = t.useCallback(() => {
    v(E.RECOVERY);
  }, []), ce = t.useCallback(async (y) => {
    D(true);
    try {
      await u(y);
    } catch (w) {
      throw w;
    } finally {
      D(false);
    }
  }, [u]), ue = t.useCallback(() => {
    m();
  }, [m]), de = () => p ? e.jsx("div", { className: "home-loading", children: "Loading..." }) : h === E.PIN_UNLOCK ? e.jsx(mt, { username: (s == null ? void 0 : s.username) || (s == null ? void 0 : s.display_name) || "Your account", avatarUrl: null, onUnlock: re, onSwitchAccount: J }) : h === E.PIN_SETUP ? e.jsxs(e.Fragment, { children: [e.jsx("div", { className: "home-pin-setup-header", children: e.jsx("div", { className: "home-section-title", children: "Secure your identity" }) }), e.jsx(vt, { onSetPin: ce, onSkip: ue, isLoading: I })] }) : h === E.REGISTER_WIZARD ? e.jsx(rt, { onComplete: se, onCancel: () => {
    C(false), v(E.CHOOSE), i == null ? void 0 : i();
  }, registrationMode: b, instanceUrl: k, instanceName: U, onInstanceLockedChange: C, isLoading: p, error: c }) : h === E.RECOVERY ? e.jsxs(e.Fragment, { children: [e.jsx("div", { className: "home-recovery-header", children: e.jsx("div", { className: "home-section-title", children: "Sign in" }) }), e.jsx(ut, { onSubmit: le, onCancel: () => {
    i == null ? void 0 : i(), v(l ? E.PIN_UNLOCK : E.CHOOSE);
  }, isRecoveryMode: true, isLoading: p })] }) : e.jsxs(e.Fragment, { children: [e.jsxs("div", { className: "home-auth-choices", children: [e.jsx("button", { type: "button", className: "home-auth-choice-btn", onClick: () => v(E.RECOVERY), children: "Sign in" }), e.jsx(ye, { className: "home-auth-choice-btn", to: "/link-device?mode=new", children: "Link to existing device" })] }), b !== "closed" && e.jsxs("p", { className: "home-register-hint", children: ["New here?", " ", e.jsx("button", { type: "button", className: "home-register-link", onClick: () => v(E.REGISTER_WIZARD), children: "Create an account" })] }), e.jsx("p", { className: "home-register-hint", style: { marginTop: "4px" }, children: e.jsx("button", { type: "button", className: "home-lost-device-link", onClick: () => v(E.RECOVERY), children: "Lost a device?" }) })] });
  return e.jsxs("div", { className: "home-page", onMouseMove: Y, style: Nt, children: [ne && e.jsx("div", { ref: W, className: "home-spotlight-wrapper", children: e.jsx("div", { className: "home-spotlight" }) }), e.jsxs("div", { className: "home-container", children: [e.jsxs(z.div, { className: "home-logo", initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.4 }, children: [e.jsxs("div", { className: "home-logo-inner", children: [e.jsxs("div", { className: "home-logo-title", ref: ee, children: ["hush", e.jsx(z.div, { style: { position: "absolute", top: "20px", left: V != null ? `${V}px` : "38%", width: "14px", height: "14px", borderRadius: "50%", background: "var(--hush-amber)", boxShadow: "0 0 12px var(--hush-amber), 0 0 28px rgba(213, 79, 18, 0.3)" }, initial: { scale: 0, opacity: 0 }, animate: { scale: 1, opacity: 1 }, transition: { duration: 0.4, delay: 0.3, ease: [0.16, 1, 0.3, 1] } })] }), e.jsx(z.div, { className: "home-logo-glow", initial: { opacity: 0, scale: 0.8 }, animate: { opacity: [0, 0.7, 0.15], scale: [0.8, 1.2, 1] }, transition: { duration: 1.2, delay: 0.2, ease: "easeOut" } })] }), e.jsxs(z.div, { className: "home-logo-sub", style: { display: "inline-block", width: te ?? "auto", textAlign: "left", overflow: "visible", position: "relative", whiteSpace: "nowrap", marginLeft: "-6px" }, initial: "hidden", animate: "visible", variants: { hidden: {}, visible: { transition: { staggerChildren: 0.08, delayChildren: 0.3 } } }, children: [e.jsxs("span", { ref: H, style: { position: "absolute", left: 0, top: 0, visibility: "hidden", whiteSpace: "nowrap", pointerEvents: "none" }, "aria-hidden": "true", children: [we.map((y, w) => e.jsx("span", { style: { display: "inline-block", marginRight: "0.25em" }, children: y }, w)), e.jsx("span", { style: { display: "inline-block" }, children: me })] }), we.map((y, w) => e.jsx(z.span, { style: { display: "inline-block", marginRight: "0.25em" }, variants: Ee, children: y }, w)), e.jsx(Ct, {})] })] }), e.jsx(z.div, { className: "home-e2ee-badge-wrap", initial: { opacity: 0, y: 4 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1], delay: 0.6 }, children: e.jsxs("span", { className: "home-e2ee-badge home-e2ee-badge--active", children: [e.jsxs("svg", { width: "10", height: "10", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: [e.jsx("rect", { x: "3", y: "11", width: "18", height: "11", rx: "2", ry: "2" }), e.jsx("path", { d: "M7 11V7a5 5 0 0 1 10 0v4" })] }), "end-to-end encrypted"] }) }), e.jsxs(z.div, { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.15 }, className: "glass home-form-card", children: [de(), h !== E.PIN_SETUP && !l && e.jsxs(e.Fragment, { children: [e.jsx(We, { value: k, instances: F, onSelect: L, disabled: p || h === E.REGISTER_WIZARD && j, compact: true }), f && e.jsx("div", { role: "alert", style: { marginTop: "10px", fontSize: "0.82rem", lineHeight: 1.45, color: "var(--hush-danger)" }, children: P })] }), e.jsxs("div", { className: "home-footer", children: [e.jsxs("div", { children: [e.jsx("span", { style: { display: "inline-block" }, children: "hush is open source and self-hostable." }), " ", e.jsxs("span", { style: { display: "inline-block" }, children: [e.jsx("a", { href: "https://github.com/YarinCardillo/hush-app", className: "home-footer-link", children: "github" }), " \xB7 ", e.jsx(ye, { to: "/roadmap", className: "home-footer-link", children: "roadmap" })] })] }), e.jsx("div", { className: "home-footer-meta", children: e.jsxs("span", { style: { display: "inline-block" }, children: ["v", Ue] }) })] })] })] }), e.jsx($e, { children: M && e.jsx(z.div, { className: "home-error-toast", role: "alert", initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.25 }, children: M }, "toast") })] });
}
export {
  Ut as default
};
