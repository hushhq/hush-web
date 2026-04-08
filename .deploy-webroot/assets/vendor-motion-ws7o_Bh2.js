function ye(t, e) {
  t.indexOf(e) === -1 && t.push(e);
}
function Et(t, e) {
  const s = t.indexOf(e);
  s > -1 && t.splice(s, 1);
}
const z = (t, e, s) => s > e ? e : s < t ? t : s;
let ge = () => {
};
const X = {}, Xs = (t) => /^-?(?:\d+(?:\.\d+)?|\.\d+)$/u.test(t);
function _s(t) {
  return typeof t == "object" && t !== null;
}
const Hs = (t) => /^0[^.\s]+$/u.test(t);
function Te(t) {
  let e;
  return () => (e === void 0 && (e = t()), e);
}
const G = (t) => t, mi = (t, e) => (s) => e(t(s)), ve = (...t) => t.reduce(mi), xe = (t, e, s) => {
  const n = e - t;
  return n === 0 ? 1 : (s - t) / n;
};
class be {
  constructor() {
    this.subscriptions = [];
  }
  add(e) {
    return ye(this.subscriptions, e), () => Et(this.subscriptions, e);
  }
  notify(e, s, n) {
    const i = this.subscriptions.length;
    if (i) if (i === 1) this.subscriptions[0](e, s, n);
    else for (let o = 0; o < i; o++) {
      const r = this.subscriptions[o];
      r && r(e, s, n);
    }
  }
  getSize() {
    return this.subscriptions.length;
  }
  clear() {
    this.subscriptions.length = 0;
  }
}
const W = (t) => t * 1e3, K = (t) => t / 1e3;
function Ys(t, e) {
  return e ? t * (1e3 / e) : 0;
}
const Gs = (t, e, s) => (((1 - 3 * s + 3 * e) * t + (3 * s - 6 * e)) * t + 3 * e) * t, yi = 1e-7, gi = 12;
function Ti(t, e, s, n, i) {
  let o, r, a = 0;
  do
    r = e + (s - e) / 2, o = Gs(r, n, i) - t, o > 0 ? s = r : e = r;
  while (Math.abs(o) > yi && ++a < gi);
  return r;
}
function At(t, e, s, n) {
  if (t === e && s === n) return G;
  const i = (o) => Ti(o, 0, 1, t, s);
  return (o) => o === 0 || o === 1 ? o : Gs(i(o), e, n);
}
const qs = (t) => (e) => e <= 0.5 ? t(2 * e) / 2 : (2 - t(2 * (1 - e))) / 2, Zs = (t) => (e) => 1 - t(1 - e), Js = At(0.33, 1.53, 0.69, 0.99), Ae = Zs(Js), Qs = qs(Ae), tn = (t) => (t *= 2) < 1 ? 0.5 * Ae(t) : 0.5 * (2 - Math.pow(2, -10 * (t - 1))), Se = (t) => 1 - Math.sin(Math.acos(t)), en = Zs(Se), sn = qs(Se), vi = At(0.42, 0, 1, 1), xi = At(0, 0, 0.58, 1), nn = At(0.42, 0, 0.58, 1), bi = (t) => Array.isArray(t) && typeof t[0] != "number", rn = (t) => Array.isArray(t) && typeof t[0] == "number", Ai = { linear: G, easeIn: vi, easeInOut: nn, easeOut: xi, circIn: Se, circInOut: sn, circOut: en, backIn: Ae, backInOut: Qs, backOut: Js, anticipate: tn }, Si = (t) => typeof t == "string", $e = (t) => {
  if (rn(t)) {
    ge(t.length === 4);
    const [e, s, n, i] = t;
    return At(e, s, n, i);
  } else if (Si(t)) return Ai[t];
  return t;
}, Vt = ["setup", "read", "resolveKeyframes", "preUpdate", "update", "preRender", "render", "postRender"];
function Vi(t, e) {
  let s = /* @__PURE__ */ new Set(), n = /* @__PURE__ */ new Set(), i = false, o = false;
  const r = /* @__PURE__ */ new WeakSet();
  let a = { delta: 0, timestamp: 0, isProcessing: false };
  function l(u) {
    r.has(u) && (c.schedule(u), t()), u(a);
  }
  const c = { schedule: (u, h = false, f = false) => {
    const m = f && i ? s : n;
    return h && r.add(u), m.has(u) || m.add(u), u;
  }, cancel: (u) => {
    n.delete(u), r.delete(u);
  }, process: (u) => {
    if (a = u, i) {
      o = true;
      return;
    }
    i = true, [s, n] = [n, s], s.forEach(l), s.clear(), i = false, o && (o = false, c.process(u));
  } };
  return c;
}
const wi = 40;
function on(t, e) {
  let s = false, n = true;
  const i = { delta: 0, timestamp: 0, isProcessing: false }, o = () => s = true, r = Vt.reduce((y, S) => (y[S] = Vi(o), y), {}), { setup: a, read: l, resolveKeyframes: c, preUpdate: u, update: h, preRender: f, render: d, postRender: m } = r, x = () => {
    const y = X.useManualTiming ? i.timestamp : performance.now();
    s = false, X.useManualTiming || (i.delta = n ? 1e3 / 60 : Math.max(Math.min(y - i.timestamp, wi), 1)), i.timestamp = y, i.isProcessing = true, a.process(i), l.process(i), c.process(i), u.process(i), h.process(i), f.process(i), d.process(i), m.process(i), i.isProcessing = false, s && e && (n = false, t(x));
  }, T = () => {
    s = true, n = true, i.isProcessing || t(x);
  };
  return { schedule: Vt.reduce((y, S) => {
    const v = r[S];
    return y[S] = (V, D = false, A = false) => (s || T(), v.schedule(V, D, A)), y;
  }, {}), cancel: (y) => {
    for (let S = 0; S < Vt.length; S++) r[Vt[S]].cancel(y);
  }, state: i, steps: r };
}
const { schedule: B, cancel: st, state: E, steps: jt } = on(typeof requestAnimationFrame < "u" ? requestAnimationFrame : G, true);
let Pt;
function Pi() {
  Pt = void 0;
}
const k = { now: () => (Pt === void 0 && k.set(E.isProcessing || X.useManualTiming ? E.timestamp : performance.now()), Pt), set: (t) => {
  Pt = t, queueMicrotask(Pi);
} }, an = (t) => (e) => typeof e == "string" && e.startsWith(t), ln = an("--"), Di = an("var(--"), Ve = (t) => Di(t) ? Mi.test(t.split("/*")[0].trim()) : false, Mi = /var\(--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)$/iu;
function ze(t) {
  return typeof t != "string" ? false : t.split("/*")[0].includes("var(--");
}
const ft = { test: (t) => typeof t == "number", parse: parseFloat, transform: (t) => t }, xt = { ...ft, transform: (t) => z(0, 1, t) }, wt = { ...ft, default: 1 }, gt = (t) => Math.round(t * 1e5) / 1e5, we = /-?(?:\d+(?:\.\d+)?|\.\d+)/gu;
function Ri(t) {
  return t == null;
}
const Ci = /^(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))$/iu, Pe = (t, e) => (s) => !!(typeof s == "string" && Ci.test(s) && s.startsWith(t) || e && !Ri(s) && Object.prototype.hasOwnProperty.call(s, e)), cn = (t, e, s) => (n) => {
  if (typeof n != "string") return n;
  const [i, o, r, a] = n.match(we);
  return { [t]: parseFloat(i), [e]: parseFloat(o), [s]: parseFloat(r), alpha: a !== void 0 ? parseFloat(a) : 1 };
}, Ei = (t) => z(0, 255, t), Nt = { ...ft, transform: (t) => Math.round(Ei(t)) }, Q = { test: Pe("rgb", "red"), parse: cn("red", "green", "blue"), transform: ({ red: t, green: e, blue: s, alpha: n = 1 }) => "rgba(" + Nt.transform(t) + ", " + Nt.transform(e) + ", " + Nt.transform(s) + ", " + gt(xt.transform(n)) + ")" };
function Bi(t) {
  let e = "", s = "", n = "", i = "";
  return t.length > 5 ? (e = t.substring(1, 3), s = t.substring(3, 5), n = t.substring(5, 7), i = t.substring(7, 9)) : (e = t.substring(1, 2), s = t.substring(2, 3), n = t.substring(3, 4), i = t.substring(4, 5), e += e, s += s, n += n, i += i), { red: parseInt(e, 16), green: parseInt(s, 16), blue: parseInt(n, 16), alpha: i ? parseInt(i, 16) / 255 : 1 };
}
const Zt = { test: Pe("#"), parse: Bi, transform: Q.transform }, St = (t) => ({ test: (e) => typeof e == "string" && e.endsWith(t) && e.split(" ").length === 1, parse: parseFloat, transform: (e) => `${e}${t}` }), _ = St("deg"), $ = St("%"), p = St("px"), ki = St("vh"), Li = St("vw"), Xe = { ...$, parse: (t) => $.parse(t) / 100, transform: (t) => $.transform(t * 100) }, rt = { test: Pe("hsl", "hue"), parse: cn("hue", "saturation", "lightness"), transform: ({ hue: t, saturation: e, lightness: s, alpha: n = 1 }) => "hsla(" + Math.round(t) + ", " + $.transform(gt(e)) + ", " + $.transform(gt(s)) + ", " + gt(xt.transform(n)) + ")" }, P = { test: (t) => Q.test(t) || Zt.test(t) || rt.test(t), parse: (t) => Q.test(t) ? Q.parse(t) : rt.test(t) ? rt.parse(t) : Zt.parse(t), transform: (t) => typeof t == "string" ? t : t.hasOwnProperty("red") ? Q.transform(t) : rt.transform(t), getAnimatableNone: (t) => {
  const e = P.parse(t);
  return e.alpha = 0, P.transform(e);
} }, Fi = /(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))/giu;
function Ii(t) {
  var _a2, _b;
  return isNaN(t) && typeof t == "string" && (((_a2 = t.match(we)) == null ? void 0 : _a2.length) || 0) + (((_b = t.match(Fi)) == null ? void 0 : _b.length) || 0) > 0;
}
const un = "number", hn = "color", Oi = "var", ji = "var(", _e = "${}", Ni = /var\s*\(\s*--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)|#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\)|-?(?:\d+(?:\.\d+)?|\.\d+)/giu;
function bt(t) {
  const e = t.toString(), s = [], n = { color: [], number: [], var: [] }, i = [];
  let o = 0;
  const a = e.replace(Ni, (l) => (P.test(l) ? (n.color.push(o), i.push(hn), s.push(P.parse(l))) : l.startsWith(ji) ? (n.var.push(o), i.push(Oi), s.push(l)) : (n.number.push(o), i.push(un), s.push(parseFloat(l))), ++o, _e)).split(_e);
  return { values: s, split: a, indexes: n, types: i };
}
function fn(t) {
  return bt(t).values;
}
function dn(t) {
  const { split: e, types: s } = bt(t), n = e.length;
  return (i) => {
    let o = "";
    for (let r = 0; r < n; r++) if (o += e[r], i[r] !== void 0) {
      const a = s[r];
      a === un ? o += gt(i[r]) : a === hn ? o += P.transform(i[r]) : o += i[r];
    }
    return o;
  };
}
const Ui = (t) => typeof t == "number" ? 0 : P.test(t) ? P.getAnimatableNone(t) : t;
function Ki(t) {
  const e = fn(t);
  return dn(t)(e.map(Ui));
}
const Y = { test: Ii, parse: fn, createTransformer: dn, getAnimatableNone: Ki };
function Ut(t, e, s) {
  return s < 0 && (s += 1), s > 1 && (s -= 1), s < 1 / 6 ? t + (e - t) * 6 * s : s < 1 / 2 ? e : s < 2 / 3 ? t + (e - t) * (2 / 3 - s) * 6 : t;
}
function Wi({ hue: t, saturation: e, lightness: s, alpha: n }) {
  t /= 360, e /= 100, s /= 100;
  let i = 0, o = 0, r = 0;
  if (!e) i = o = r = s;
  else {
    const a = s < 0.5 ? s * (1 + e) : s + e - s * e, l = 2 * s - a;
    i = Ut(l, a, t + 1 / 3), o = Ut(l, a, t), r = Ut(l, a, t - 1 / 3);
  }
  return { red: Math.round(i * 255), green: Math.round(o * 255), blue: Math.round(r * 255), alpha: n };
}
function Bt(t, e) {
  return (s) => s > 0 ? e : t;
}
const M = (t, e, s) => t + (e - t) * s, Kt = (t, e, s) => {
  const n = t * t, i = s * (e * e - n) + n;
  return i < 0 ? 0 : Math.sqrt(i);
}, $i = [Zt, Q, rt], zi = (t) => $i.find((e) => e.test(t));
function He(t) {
  const e = zi(t);
  if (!e) return false;
  let s = e.parse(t);
  return e === rt && (s = Wi(s)), s;
}
const Ye = (t, e) => {
  const s = He(t), n = He(e);
  if (!s || !n) return Bt(t, e);
  const i = { ...s };
  return (o) => (i.red = Kt(s.red, n.red, o), i.green = Kt(s.green, n.green, o), i.blue = Kt(s.blue, n.blue, o), i.alpha = M(s.alpha, n.alpha, o), Q.transform(i));
}, Jt = /* @__PURE__ */ new Set(["none", "hidden"]);
function Xi(t, e) {
  return Jt.has(t) ? (s) => s <= 0 ? t : e : (s) => s >= 1 ? e : t;
}
function _i(t, e) {
  return (s) => M(t, e, s);
}
function De(t) {
  return typeof t == "number" ? _i : typeof t == "string" ? Ve(t) ? Bt : P.test(t) ? Ye : Gi : Array.isArray(t) ? pn : typeof t == "object" ? P.test(t) ? Ye : Hi : Bt;
}
function pn(t, e) {
  const s = [...t], n = s.length, i = t.map((o, r) => De(o)(o, e[r]));
  return (o) => {
    for (let r = 0; r < n; r++) s[r] = i[r](o);
    return s;
  };
}
function Hi(t, e) {
  const s = { ...t, ...e }, n = {};
  for (const i in s) t[i] !== void 0 && e[i] !== void 0 && (n[i] = De(t[i])(t[i], e[i]));
  return (i) => {
    for (const o in n) s[o] = n[o](i);
    return s;
  };
}
function Yi(t, e) {
  const s = [], n = { color: 0, var: 0, number: 0 };
  for (let i = 0; i < e.values.length; i++) {
    const o = e.types[i], r = t.indexes[o][n[o]], a = t.values[r] ?? 0;
    s[i] = a, n[o]++;
  }
  return s;
}
const Gi = (t, e) => {
  const s = Y.createTransformer(e), n = bt(t), i = bt(e);
  return n.indexes.var.length === i.indexes.var.length && n.indexes.color.length === i.indexes.color.length && n.indexes.number.length >= i.indexes.number.length ? Jt.has(t) && !i.values.length || Jt.has(e) && !n.values.length ? Xi(t, e) : ve(pn(Yi(n, i), i.values), s) : Bt(t, e);
};
function mn(t, e, s) {
  return typeof t == "number" && typeof e == "number" && typeof s == "number" ? M(t, e, s) : De(t)(t, e);
}
const qi = (t) => {
  const e = ({ timestamp: s }) => t(s);
  return { start: (s = true) => B.update(e, s), stop: () => st(e), now: () => E.isProcessing ? E.timestamp : k.now() };
}, yn = (t, e, s = 10) => {
  let n = "";
  const i = Math.max(Math.round(e / s), 2);
  for (let o = 0; o < i; o++) n += Math.round(t(o / (i - 1)) * 1e4) / 1e4 + ", ";
  return `linear(${n.substring(0, n.length - 2)})`;
}, kt = 2e4;
function Me(t) {
  let e = 0;
  const s = 50;
  let n = t.next(e);
  for (; !n.done && e < kt; ) e += s, n = t.next(e);
  return e >= kt ? 1 / 0 : e;
}
function Zi(t, e = 100, s) {
  const n = s({ ...t, keyframes: [0, e] }), i = Math.min(Me(n), kt);
  return { type: "keyframes", ease: (o) => n.next(i * o).value / e, duration: K(i) };
}
const Ji = 5;
function gn(t, e, s) {
  const n = Math.max(e - Ji, 0);
  return Ys(s - t(n), e - n);
}
const w = { stiffness: 100, damping: 10, mass: 1, velocity: 0, duration: 800, bounce: 0.3, visualDuration: 0.3, restSpeed: { granular: 0.01, default: 2 }, restDelta: { granular: 5e-3, default: 0.5 }, minDuration: 0.01, maxDuration: 10, minDamping: 0.05, maxDamping: 1 }, Wt = 1e-3;
function Qi({ duration: t = w.duration, bounce: e = w.bounce, velocity: s = w.velocity, mass: n = w.mass }) {
  let i, o, r = 1 - e;
  r = z(w.minDamping, w.maxDamping, r), t = z(w.minDuration, w.maxDuration, K(t)), r < 1 ? (i = (c) => {
    const u = c * r, h = u * t, f = u - s, d = Qt(c, r), m = Math.exp(-h);
    return Wt - f / d * m;
  }, o = (c) => {
    const h = c * r * t, f = h * s + s, d = Math.pow(r, 2) * Math.pow(c, 2) * t, m = Math.exp(-h), x = Qt(Math.pow(c, 2), r);
    return (-i(c) + Wt > 0 ? -1 : 1) * ((f - d) * m) / x;
  }) : (i = (c) => {
    const u = Math.exp(-c * t), h = (c - s) * t + 1;
    return -Wt + u * h;
  }, o = (c) => {
    const u = Math.exp(-c * t), h = (s - c) * (t * t);
    return u * h;
  });
  const a = 5 / t, l = er(i, o, a);
  if (t = W(t), isNaN(l)) return { stiffness: w.stiffness, damping: w.damping, duration: t };
  {
    const c = Math.pow(l, 2) * n;
    return { stiffness: c, damping: r * 2 * Math.sqrt(n * c), duration: t };
  }
}
const tr = 12;
function er(t, e, s) {
  let n = s;
  for (let i = 1; i < tr; i++) n = n - t(n) / e(n);
  return n;
}
function Qt(t, e) {
  return t * Math.sqrt(1 - e * e);
}
const sr = ["duration", "bounce"], nr = ["stiffness", "damping", "mass"];
function Ge(t, e) {
  return e.some((s) => t[s] !== void 0);
}
function ir(t) {
  let e = { velocity: w.velocity, stiffness: w.stiffness, damping: w.damping, mass: w.mass, isResolvedFromDuration: false, ...t };
  if (!Ge(t, nr) && Ge(t, sr)) if (t.visualDuration) {
    const s = t.visualDuration, n = 2 * Math.PI / (s * 1.2), i = n * n, o = 2 * z(0.05, 1, 1 - (t.bounce || 0)) * Math.sqrt(i);
    e = { ...e, mass: w.mass, stiffness: i, damping: o };
  } else {
    const s = Qi(t);
    e = { ...e, ...s, mass: w.mass }, e.isResolvedFromDuration = true;
  }
  return e;
}
function Lt(t = w.visualDuration, e = w.bounce) {
  const s = typeof t != "object" ? { visualDuration: t, keyframes: [0, 1], bounce: e } : t;
  let { restSpeed: n, restDelta: i } = s;
  const o = s.keyframes[0], r = s.keyframes[s.keyframes.length - 1], a = { done: false, value: o }, { stiffness: l, damping: c, mass: u, duration: h, velocity: f, isResolvedFromDuration: d } = ir({ ...s, velocity: -K(s.velocity || 0) }), m = f || 0, x = c / (2 * Math.sqrt(l * u)), T = r - o, g = K(Math.sqrt(l / u)), b = Math.abs(T) < 5;
  n || (n = b ? w.restSpeed.granular : w.restSpeed.default), i || (i = b ? w.restDelta.granular : w.restDelta.default);
  let y;
  if (x < 1) {
    const v = Qt(g, x);
    y = (V) => {
      const D = Math.exp(-x * g * V);
      return r - D * ((m + x * g * T) / v * Math.sin(v * V) + T * Math.cos(v * V));
    };
  } else if (x === 1) y = (v) => r - Math.exp(-g * v) * (T + (m + g * T) * v);
  else {
    const v = g * Math.sqrt(x * x - 1);
    y = (V) => {
      const D = Math.exp(-x * g * V), A = Math.min(v * V, 300);
      return r - D * ((m + x * g * T) * Math.sinh(A) + v * T * Math.cosh(A)) / v;
    };
  }
  const S = { calculatedDuration: d && h || null, next: (v) => {
    const V = y(v);
    if (d) a.done = v >= h;
    else {
      let D = v === 0 ? m : 0;
      x < 1 && (D = v === 0 ? W(m) : gn(y, v, V));
      const A = Math.abs(D) <= n, L = Math.abs(r - V) <= i;
      a.done = A && L;
    }
    return a.value = a.done ? r : V, a;
  }, toString: () => {
    const v = Math.min(Me(S), kt), V = yn((D) => S.next(v * D).value, v, 30);
    return v + "ms " + V;
  }, toTransition: () => {
  } };
  return S;
}
Lt.applyToOptions = (t) => {
  const e = Zi(t, 100, Lt);
  return t.ease = e.ease, t.duration = W(e.duration), t.type = "keyframes", t;
};
function te({ keyframes: t, velocity: e = 0, power: s = 0.8, timeConstant: n = 325, bounceDamping: i = 10, bounceStiffness: o = 500, modifyTarget: r, min: a, max: l, restDelta: c = 0.5, restSpeed: u }) {
  const h = t[0], f = { done: false, value: h }, d = (A) => a !== void 0 && A < a || l !== void 0 && A > l, m = (A) => a === void 0 ? l : l === void 0 || Math.abs(a - A) < Math.abs(l - A) ? a : l;
  let x = s * e;
  const T = h + x, g = r === void 0 ? T : r(T);
  g !== T && (x = g - h);
  const b = (A) => -x * Math.exp(-A / n), y = (A) => g + b(A), S = (A) => {
    const L = b(A), I = y(A);
    f.done = Math.abs(L) <= c, f.value = f.done ? g : I;
  };
  let v, V;
  const D = (A) => {
    d(f.value) && (v = A, V = Lt({ keyframes: [f.value, m(f.value)], velocity: gn(y, A, f.value), damping: i, stiffness: o, restDelta: c, restSpeed: u }));
  };
  return D(0), { calculatedDuration: null, next: (A) => {
    let L = false;
    return !V && v === void 0 && (L = true, S(A), D(A)), v !== void 0 && A >= v ? V.next(A - v) : (!L && S(A), f);
  } };
}
function rr(t, e, s) {
  const n = [], i = s || X.mix || mn, o = t.length - 1;
  for (let r = 0; r < o; r++) {
    let a = i(t[r], t[r + 1]);
    if (e) {
      const l = Array.isArray(e) ? e[r] || G : e;
      a = ve(l, a);
    }
    n.push(a);
  }
  return n;
}
function or(t, e, { clamp: s = true, ease: n, mixer: i } = {}) {
  const o = t.length;
  if (ge(o === e.length), o === 1) return () => e[0];
  if (o === 2 && e[0] === e[1]) return () => e[1];
  const r = t[0] === t[1];
  t[0] > t[o - 1] && (t = [...t].reverse(), e = [...e].reverse());
  const a = rr(e, n, i), l = a.length, c = (u) => {
    if (r && u < t[0]) return e[0];
    let h = 0;
    if (l > 1) for (; h < t.length - 2 && !(u < t[h + 1]); h++) ;
    const f = xe(t[h], t[h + 1], u);
    return a[h](f);
  };
  return s ? (u) => c(z(t[0], t[o - 1], u)) : c;
}
function ar(t, e) {
  const s = t[t.length - 1];
  for (let n = 1; n <= e; n++) {
    const i = xe(0, e, n);
    t.push(M(s, 1, i));
  }
}
function lr(t) {
  const e = [0];
  return ar(e, t.length - 1), e;
}
function cr(t, e) {
  return t.map((s) => s * e);
}
function ur(t, e) {
  return t.map(() => e || nn).splice(0, t.length - 1);
}
function Tt({ duration: t = 300, keyframes: e, times: s, ease: n = "easeInOut" }) {
  const i = bi(n) ? n.map($e) : $e(n), o = { done: false, value: e[0] }, r = cr(s && s.length === e.length ? s : lr(e), t), a = or(r, e, { ease: Array.isArray(i) ? i : ur(e, i) });
  return { calculatedDuration: t, next: (l) => (o.value = a(l), o.done = l >= t, o) };
}
const hr = (t) => t !== null;
function Re(t, { repeat: e, repeatType: s = "loop" }, n, i = 1) {
  const o = t.filter(hr), a = i < 0 || e && s !== "loop" && e % 2 === 1 ? 0 : o.length - 1;
  return !a || n === void 0 ? o[a] : n;
}
const fr = { decay: te, inertia: te, tween: Tt, keyframes: Tt, spring: Lt };
function Tn(t) {
  typeof t.type == "string" && (t.type = fr[t.type]);
}
class Ce {
  constructor() {
    this.updateFinished();
  }
  get finished() {
    return this._finished;
  }
  updateFinished() {
    this._finished = new Promise((e) => {
      this.resolve = e;
    });
  }
  notifyFinished() {
    this.resolve();
  }
  then(e, s) {
    return this.finished.then(e, s);
  }
}
const dr = (t) => t / 100;
class Ee extends Ce {
  constructor(e) {
    super(), this.state = "idle", this.startTime = null, this.isStopped = false, this.currentTime = 0, this.holdTime = null, this.playbackSpeed = 1, this.stop = () => {
      var _a2, _b;
      const { motionValue: s } = this.options;
      s && s.updatedAt !== k.now() && this.tick(k.now()), this.isStopped = true, this.state !== "idle" && (this.teardown(), (_b = (_a2 = this.options).onStop) == null ? void 0 : _b.call(_a2));
    }, this.options = e, this.initAnimation(), this.play(), e.autoplay === false && this.pause();
  }
  initAnimation() {
    const { options: e } = this;
    Tn(e);
    const { type: s = Tt, repeat: n = 0, repeatDelay: i = 0, repeatType: o, velocity: r = 0 } = e;
    let { keyframes: a } = e;
    const l = s || Tt;
    l !== Tt && typeof a[0] != "number" && (this.mixKeyframes = ve(dr, mn(a[0], a[1])), a = [0, 100]);
    const c = l({ ...e, keyframes: a });
    o === "mirror" && (this.mirroredGenerator = l({ ...e, keyframes: [...a].reverse(), velocity: -r })), c.calculatedDuration === null && (c.calculatedDuration = Me(c));
    const { calculatedDuration: u } = c;
    this.calculatedDuration = u, this.resolvedDuration = u + i, this.totalDuration = this.resolvedDuration * (n + 1) - i, this.generator = c;
  }
  updateTime(e) {
    const s = Math.round(e - this.startTime) * this.playbackSpeed;
    this.holdTime !== null ? this.currentTime = this.holdTime : this.currentTime = s;
  }
  tick(e, s = false) {
    const { generator: n, totalDuration: i, mixKeyframes: o, mirroredGenerator: r, resolvedDuration: a, calculatedDuration: l } = this;
    if (this.startTime === null) return n.next(0);
    const { delay: c = 0, keyframes: u, repeat: h, repeatType: f, repeatDelay: d, type: m, onUpdate: x, finalKeyframe: T } = this.options;
    this.speed > 0 ? this.startTime = Math.min(this.startTime, e) : this.speed < 0 && (this.startTime = Math.min(e - i / this.speed, this.startTime)), s ? this.currentTime = e : this.updateTime(e);
    const g = this.currentTime - c * (this.playbackSpeed >= 0 ? 1 : -1), b = this.playbackSpeed >= 0 ? g < 0 : g > i;
    this.currentTime = Math.max(g, 0), this.state === "finished" && this.holdTime === null && (this.currentTime = i);
    let y = this.currentTime, S = n;
    if (h) {
      const A = Math.min(this.currentTime, i) / a;
      let L = Math.floor(A), I = A % 1;
      !I && A >= 1 && (I = 1), I === 1 && L--, L = Math.min(L, h + 1), !!(L % 2) && (f === "reverse" ? (I = 1 - I, d && (I -= d / a)) : f === "mirror" && (S = r)), y = z(0, 1, I) * a;
    }
    const v = b ? { done: false, value: u[0] } : S.next(y);
    o && (v.value = o(v.value));
    let { done: V } = v;
    !b && l !== null && (V = this.playbackSpeed >= 0 ? this.currentTime >= i : this.currentTime <= 0);
    const D = this.holdTime === null && (this.state === "finished" || this.state === "running" && V);
    return D && m !== te && (v.value = Re(u, this.options, T, this.speed)), x && x(v.value), D && this.finish(), v;
  }
  then(e, s) {
    return this.finished.then(e, s);
  }
  get duration() {
    return K(this.calculatedDuration);
  }
  get iterationDuration() {
    const { delay: e = 0 } = this.options || {};
    return this.duration + K(e);
  }
  get time() {
    return K(this.currentTime);
  }
  set time(e) {
    var _a2;
    e = W(e), this.currentTime = e, this.startTime === null || this.holdTime !== null || this.playbackSpeed === 0 ? this.holdTime = e : this.driver && (this.startTime = this.driver.now() - e / this.playbackSpeed), (_a2 = this.driver) == null ? void 0 : _a2.start(false);
  }
  get speed() {
    return this.playbackSpeed;
  }
  set speed(e) {
    this.updateTime(k.now());
    const s = this.playbackSpeed !== e;
    this.playbackSpeed = e, s && (this.time = K(this.currentTime));
  }
  play() {
    var _a2, _b;
    if (this.isStopped) return;
    const { driver: e = qi, startTime: s } = this.options;
    this.driver || (this.driver = e((i) => this.tick(i))), (_b = (_a2 = this.options).onPlay) == null ? void 0 : _b.call(_a2);
    const n = this.driver.now();
    this.state === "finished" ? (this.updateFinished(), this.startTime = n) : this.holdTime !== null ? this.startTime = n - this.holdTime : this.startTime || (this.startTime = s ?? n), this.state === "finished" && this.speed < 0 && (this.startTime += this.calculatedDuration), this.holdTime = null, this.state = "running", this.driver.start();
  }
  pause() {
    this.state = "paused", this.updateTime(k.now()), this.holdTime = this.currentTime;
  }
  complete() {
    this.state !== "running" && this.play(), this.state = "finished", this.holdTime = null;
  }
  finish() {
    var _a2, _b;
    this.notifyFinished(), this.teardown(), this.state = "finished", (_b = (_a2 = this.options).onComplete) == null ? void 0 : _b.call(_a2);
  }
  cancel() {
    var _a2, _b;
    this.holdTime = null, this.startTime = 0, this.tick(0), this.teardown(), (_b = (_a2 = this.options).onCancel) == null ? void 0 : _b.call(_a2);
  }
  teardown() {
    this.state = "idle", this.stopDriver(), this.startTime = this.holdTime = null;
  }
  stopDriver() {
    this.driver && (this.driver.stop(), this.driver = void 0);
  }
  sample(e) {
    return this.startTime = 0, this.tick(e, true);
  }
  attachTimeline(e) {
    var _a2;
    return this.options.allowFlatten && (this.options.type = "keyframes", this.options.ease = "linear", this.initAnimation()), (_a2 = this.driver) == null ? void 0 : _a2.stop(), e.observe(this);
  }
}
function pr(t) {
  for (let e = 1; e < t.length; e++) t[e] ?? (t[e] = t[e - 1]);
}
const tt = (t) => t * 180 / Math.PI, ee = (t) => {
  const e = tt(Math.atan2(t[1], t[0]));
  return se(e);
}, mr = { x: 4, y: 5, translateX: 4, translateY: 5, scaleX: 0, scaleY: 3, scale: (t) => (Math.abs(t[0]) + Math.abs(t[3])) / 2, rotate: ee, rotateZ: ee, skewX: (t) => tt(Math.atan(t[1])), skewY: (t) => tt(Math.atan(t[2])), skew: (t) => (Math.abs(t[1]) + Math.abs(t[2])) / 2 }, se = (t) => (t = t % 360, t < 0 && (t += 360), t), qe = ee, Ze = (t) => Math.sqrt(t[0] * t[0] + t[1] * t[1]), Je = (t) => Math.sqrt(t[4] * t[4] + t[5] * t[5]), yr = { x: 12, y: 13, z: 14, translateX: 12, translateY: 13, translateZ: 14, scaleX: Ze, scaleY: Je, scale: (t) => (Ze(t) + Je(t)) / 2, rotateX: (t) => se(tt(Math.atan2(t[6], t[5]))), rotateY: (t) => se(tt(Math.atan2(-t[2], t[0]))), rotateZ: qe, rotate: qe, skewX: (t) => tt(Math.atan(t[4])), skewY: (t) => tt(Math.atan(t[1])), skew: (t) => (Math.abs(t[1]) + Math.abs(t[4])) / 2 };
function ne(t) {
  return t.includes("scale") ? 1 : 0;
}
function ie(t, e) {
  if (!t || t === "none") return ne(e);
  const s = t.match(/^matrix3d\(([-\d.e\s,]+)\)$/u);
  let n, i;
  if (s) n = yr, i = s;
  else {
    const a = t.match(/^matrix\(([-\d.e\s,]+)\)$/u);
    n = mr, i = a;
  }
  if (!i) return ne(e);
  const o = n[e], r = i[1].split(",").map(Tr);
  return typeof o == "function" ? o(r) : r[o];
}
const gr = (t, e) => {
  const { transform: s = "none" } = getComputedStyle(t);
  return ie(s, e);
};
function Tr(t) {
  return parseFloat(t.trim());
}
const dt = ["transformPerspective", "x", "y", "z", "translateX", "translateY", "translateZ", "scale", "scaleX", "scaleY", "rotate", "rotateX", "rotateY", "rotateZ", "skew", "skewX", "skewY"], pt = new Set(dt), Qe = (t) => t === ft || t === p, vr = /* @__PURE__ */ new Set(["x", "y", "z"]), xr = dt.filter((t) => !vr.has(t));
function br(t) {
  const e = [];
  return xr.forEach((s) => {
    const n = t.getValue(s);
    n !== void 0 && (e.push([s, n.get()]), n.set(s.startsWith("scale") ? 1 : 0));
  }), e;
}
const H = { width: ({ x: t }, { paddingLeft: e = "0", paddingRight: s = "0" }) => t.max - t.min - parseFloat(e) - parseFloat(s), height: ({ y: t }, { paddingTop: e = "0", paddingBottom: s = "0" }) => t.max - t.min - parseFloat(e) - parseFloat(s), top: (t, { top: e }) => parseFloat(e), left: (t, { left: e }) => parseFloat(e), bottom: ({ y: t }, { top: e }) => parseFloat(e) + (t.max - t.min), right: ({ x: t }, { left: e }) => parseFloat(e) + (t.max - t.min), x: (t, { transform: e }) => ie(e, "x"), y: (t, { transform: e }) => ie(e, "y") };
H.translateX = H.x;
H.translateY = H.y;
const et = /* @__PURE__ */ new Set();
let re = false, oe = false, ae = false;
function vn() {
  if (oe) {
    const t = Array.from(et).filter((n) => n.needsMeasurement), e = new Set(t.map((n) => n.element)), s = /* @__PURE__ */ new Map();
    e.forEach((n) => {
      const i = br(n);
      i.length && (s.set(n, i), n.render());
    }), t.forEach((n) => n.measureInitialState()), e.forEach((n) => {
      n.render();
      const i = s.get(n);
      i && i.forEach(([o, r]) => {
        var _a2;
        (_a2 = n.getValue(o)) == null ? void 0 : _a2.set(r);
      });
    }), t.forEach((n) => n.measureEndState()), t.forEach((n) => {
      n.suspendedScrollY !== void 0 && window.scrollTo(0, n.suspendedScrollY);
    });
  }
  oe = false, re = false, et.forEach((t) => t.complete(ae)), et.clear();
}
function xn() {
  et.forEach((t) => {
    t.readKeyframes(), t.needsMeasurement && (oe = true);
  });
}
function Ar() {
  ae = true, xn(), vn(), ae = false;
}
class Be {
  constructor(e, s, n, i, o, r = false) {
    this.state = "pending", this.isAsync = false, this.needsMeasurement = false, this.unresolvedKeyframes = [...e], this.onComplete = s, this.name = n, this.motionValue = i, this.element = o, this.isAsync = r;
  }
  scheduleResolve() {
    this.state = "scheduled", this.isAsync ? (et.add(this), re || (re = true, B.read(xn), B.resolveKeyframes(vn))) : (this.readKeyframes(), this.complete());
  }
  readKeyframes() {
    const { unresolvedKeyframes: e, name: s, element: n, motionValue: i } = this;
    if (e[0] === null) {
      const o = i == null ? void 0 : i.get(), r = e[e.length - 1];
      if (o !== void 0) e[0] = o;
      else if (n && s) {
        const a = n.readValue(s, r);
        a != null && (e[0] = a);
      }
      e[0] === void 0 && (e[0] = r), i && o === void 0 && i.set(e[0]);
    }
    pr(e);
  }
  setFinalKeyframe() {
  }
  measureInitialState() {
  }
  renderEndStyles() {
  }
  measureEndState() {
  }
  complete(e = false) {
    this.state = "complete", this.onComplete(this.unresolvedKeyframes, this.finalKeyframe, e), et.delete(this);
  }
  cancel() {
    this.state === "scheduled" && (et.delete(this), this.state = "pending");
  }
  resume() {
    this.state === "pending" && this.scheduleResolve();
  }
}
const Sr = (t) => t.startsWith("--");
function Vr(t, e, s) {
  Sr(e) ? t.style.setProperty(e, s) : t.style[e] = s;
}
const wr = Te(() => window.ScrollTimeline !== void 0), Pr = {};
function Dr(t, e) {
  const s = Te(t);
  return () => Pr[e] ?? s();
}
const bn = Dr(() => {
  try {
    document.createElement("div").animate({ opacity: 0 }, { easing: "linear(0, 1)" });
  } catch {
    return false;
  }
  return true;
}, "linearEasing"), yt = ([t, e, s, n]) => `cubic-bezier(${t}, ${e}, ${s}, ${n})`, ts = { linear: "linear", ease: "ease", easeIn: "ease-in", easeOut: "ease-out", easeInOut: "ease-in-out", circIn: yt([0, 0.65, 0.55, 1]), circOut: yt([0.55, 0, 1, 0.45]), backIn: yt([0.31, 0.01, 0.66, -0.59]), backOut: yt([0.33, 1.53, 0.69, 0.99]) };
function An(t, e) {
  if (t) return typeof t == "function" ? bn() ? yn(t, e) : "ease-out" : rn(t) ? yt(t) : Array.isArray(t) ? t.map((s) => An(s, e) || ts.easeOut) : ts[t];
}
function Mr(t, e, s, { delay: n = 0, duration: i = 300, repeat: o = 0, repeatType: r = "loop", ease: a = "easeOut", times: l } = {}, c = void 0) {
  const u = { [e]: s };
  l && (u.offset = l);
  const h = An(a, i);
  Array.isArray(h) && (u.easing = h);
  const f = { delay: n, duration: i, easing: Array.isArray(h) ? "linear" : h, fill: "both", iterations: o + 1, direction: r === "reverse" ? "alternate" : "normal" };
  return c && (f.pseudoElement = c), t.animate(u, f);
}
function Sn(t) {
  return typeof t == "function" && "applyToOptions" in t;
}
function Rr({ type: t, ...e }) {
  return Sn(t) && bn() ? t.applyToOptions(e) : (e.duration ?? (e.duration = 300), e.ease ?? (e.ease = "easeOut"), e);
}
class Vn extends Ce {
  constructor(e) {
    if (super(), this.finishedTime = null, this.isStopped = false, this.manualStartTime = null, !e) return;
    const { element: s, name: n, keyframes: i, pseudoElement: o, allowFlatten: r = false, finalKeyframe: a, onComplete: l } = e;
    this.isPseudoElement = !!o, this.allowFlatten = r, this.options = e, ge(typeof e.type != "string");
    const c = Rr(e);
    this.animation = Mr(s, n, i, c, o), c.autoplay === false && this.animation.pause(), this.animation.onfinish = () => {
      if (this.finishedTime = this.time, !o) {
        const u = Re(i, this.options, a, this.speed);
        this.updateMotionValue ? this.updateMotionValue(u) : Vr(s, n, u), this.animation.cancel();
      }
      l == null ? void 0 : l(), this.notifyFinished();
    };
  }
  play() {
    this.isStopped || (this.manualStartTime = null, this.animation.play(), this.state === "finished" && this.updateFinished());
  }
  pause() {
    this.animation.pause();
  }
  complete() {
    var _a2, _b;
    (_b = (_a2 = this.animation).finish) == null ? void 0 : _b.call(_a2);
  }
  cancel() {
    try {
      this.animation.cancel();
    } catch {
    }
  }
  stop() {
    if (this.isStopped) return;
    this.isStopped = true;
    const { state: e } = this;
    e === "idle" || e === "finished" || (this.updateMotionValue ? this.updateMotionValue() : this.commitStyles(), this.isPseudoElement || this.cancel());
  }
  commitStyles() {
    var _a2, _b, _c;
    const e = (_a2 = this.options) == null ? void 0 : _a2.element;
    !this.isPseudoElement && (e == null ? void 0 : e.isConnected) && ((_c = (_b = this.animation).commitStyles) == null ? void 0 : _c.call(_b));
  }
  get duration() {
    var _a2, _b;
    const e = ((_b = (_a2 = this.animation.effect) == null ? void 0 : _a2.getComputedTiming) == null ? void 0 : _b.call(_a2).duration) || 0;
    return K(Number(e));
  }
  get iterationDuration() {
    const { delay: e = 0 } = this.options || {};
    return this.duration + K(e);
  }
  get time() {
    return K(Number(this.animation.currentTime) || 0);
  }
  set time(e) {
    this.manualStartTime = null, this.finishedTime = null, this.animation.currentTime = W(e);
  }
  get speed() {
    return this.animation.playbackRate;
  }
  set speed(e) {
    e < 0 && (this.finishedTime = null), this.animation.playbackRate = e;
  }
  get state() {
    return this.finishedTime !== null ? "finished" : this.animation.playState;
  }
  get startTime() {
    return this.manualStartTime ?? Number(this.animation.startTime);
  }
  set startTime(e) {
    this.manualStartTime = this.animation.startTime = e;
  }
  attachTimeline({ timeline: e, observe: s }) {
    var _a2;
    return this.allowFlatten && ((_a2 = this.animation.effect) == null ? void 0 : _a2.updateTiming({ easing: "linear" })), this.animation.onfinish = null, e && wr() ? (this.animation.timeline = e, G) : s(this);
  }
}
const wn = { anticipate: tn, backInOut: Qs, circInOut: sn };
function Cr(t) {
  return t in wn;
}
function Er(t) {
  typeof t.ease == "string" && Cr(t.ease) && (t.ease = wn[t.ease]);
}
const $t = 10;
class Br extends Vn {
  constructor(e) {
    Er(e), Tn(e), super(e), e.startTime !== void 0 && (this.startTime = e.startTime), this.options = e;
  }
  updateMotionValue(e) {
    const { motionValue: s, onUpdate: n, onComplete: i, element: o, ...r } = this.options;
    if (!s) return;
    if (e !== void 0) {
      s.set(e);
      return;
    }
    const a = new Ee({ ...r, autoplay: false }), l = Math.max($t, k.now() - this.startTime), c = z(0, $t, l - $t);
    s.setWithVelocity(a.sample(Math.max(0, l - c)).value, a.sample(l).value, c), a.stop();
  }
}
const es = (t, e) => e === "zIndex" ? false : !!(typeof t == "number" || Array.isArray(t) || typeof t == "string" && (Y.test(t) || t === "0") && !t.startsWith("url("));
function kr(t) {
  const e = t[0];
  if (t.length === 1) return true;
  for (let s = 0; s < t.length; s++) if (t[s] !== e) return true;
}
function Lr(t, e, s, n) {
  const i = t[0];
  if (i === null) return false;
  if (e === "display" || e === "visibility") return true;
  const o = t[t.length - 1], r = es(i, e), a = es(o, e);
  return !r || !a ? false : kr(t) || (s === "spring" || Sn(s)) && n;
}
function le(t) {
  t.duration = 0, t.type = "keyframes";
}
const Fr = /* @__PURE__ */ new Set(["opacity", "clipPath", "filter", "transform"]), Ir = Te(() => Object.hasOwnProperty.call(Element.prototype, "animate"));
function Or(t) {
  var _a2;
  const { motionValue: e, name: s, repeatDelay: n, repeatType: i, damping: o, type: r } = t;
  if (!(((_a2 = e == null ? void 0 : e.owner) == null ? void 0 : _a2.current) instanceof HTMLElement)) return false;
  const { onUpdate: l, transformTemplate: c } = e.owner.getProps();
  return Ir() && s && Fr.has(s) && (s !== "transform" || !c) && !l && !n && i !== "mirror" && o !== 0 && r !== "inertia";
}
const jr = 40;
class Nr extends Ce {
  constructor({ autoplay: e = true, delay: s = 0, type: n = "keyframes", repeat: i = 0, repeatDelay: o = 0, repeatType: r = "loop", keyframes: a, name: l, motionValue: c, element: u, ...h }) {
    var _a2;
    super(), this.stop = () => {
      var _a3, _b;
      this._animation && (this._animation.stop(), (_a3 = this.stopTimeline) == null ? void 0 : _a3.call(this)), (_b = this.keyframeResolver) == null ? void 0 : _b.cancel();
    }, this.createdAt = k.now();
    const f = { autoplay: e, delay: s, type: n, repeat: i, repeatDelay: o, repeatType: r, name: l, motionValue: c, element: u, ...h }, d = (u == null ? void 0 : u.KeyframeResolver) || Be;
    this.keyframeResolver = new d(a, (m, x, T) => this.onKeyframesResolved(m, x, f, !T), l, c, u), (_a2 = this.keyframeResolver) == null ? void 0 : _a2.scheduleResolve();
  }
  onKeyframesResolved(e, s, n, i) {
    var _a2, _b;
    this.keyframeResolver = void 0;
    const { name: o, type: r, velocity: a, delay: l, isHandoff: c, onUpdate: u } = n;
    this.resolvedAt = k.now(), Lr(e, o, r, a) || ((X.instantAnimations || !l) && (u == null ? void 0 : u(Re(e, n, s))), e[0] = e[e.length - 1], le(n), n.repeat = 0);
    const f = { startTime: i ? this.resolvedAt ? this.resolvedAt - this.createdAt > jr ? this.resolvedAt : this.createdAt : this.createdAt : void 0, finalKeyframe: s, ...n, keyframes: e }, d = !c && Or(f), m = (_b = (_a2 = f.motionValue) == null ? void 0 : _a2.owner) == null ? void 0 : _b.current, x = d ? new Br({ ...f, element: m }) : new Ee(f);
    x.finished.then(() => {
      this.notifyFinished();
    }).catch(G), this.pendingTimeline && (this.stopTimeline = x.attachTimeline(this.pendingTimeline), this.pendingTimeline = void 0), this._animation = x;
  }
  get finished() {
    return this._animation ? this.animation.finished : this._finished;
  }
  then(e, s) {
    return this.finished.finally(e).then(() => {
    });
  }
  get animation() {
    var _a2;
    return this._animation || ((_a2 = this.keyframeResolver) == null ? void 0 : _a2.resume(), Ar()), this._animation;
  }
  get duration() {
    return this.animation.duration;
  }
  get iterationDuration() {
    return this.animation.iterationDuration;
  }
  get time() {
    return this.animation.time;
  }
  set time(e) {
    this.animation.time = e;
  }
  get speed() {
    return this.animation.speed;
  }
  get state() {
    return this.animation.state;
  }
  set speed(e) {
    this.animation.speed = e;
  }
  get startTime() {
    return this.animation.startTime;
  }
  attachTimeline(e) {
    return this._animation ? this.stopTimeline = this.animation.attachTimeline(e) : this.pendingTimeline = e, () => this.stop();
  }
  play() {
    this.animation.play();
  }
  pause() {
    this.animation.pause();
  }
  complete() {
    this.animation.complete();
  }
  cancel() {
    var _a2;
    this._animation && this.animation.cancel(), (_a2 = this.keyframeResolver) == null ? void 0 : _a2.cancel();
  }
}
function Pn(t, e, s, n = 0, i = 1) {
  const o = Array.from(t).sort((c, u) => c.sortNodePosition(u)).indexOf(e), r = t.size, a = (r - 1) * n;
  return typeof s == "function" ? s(o, r) : i === 1 ? o * n : a - o * n;
}
const Ur = /^var\(--(?:([\w-]+)|([\w-]+), ?([a-zA-Z\d ()%#.,-]+))\)/u;
function Kr(t) {
  const e = Ur.exec(t);
  if (!e) return [,];
  const [, s, n, i] = e;
  return [`--${s ?? n}`, i];
}
function Dn(t, e, s = 1) {
  const [n, i] = Kr(t);
  if (!n) return;
  const o = window.getComputedStyle(e).getPropertyValue(n);
  if (o) {
    const r = o.trim();
    return Xs(r) ? parseFloat(r) : r;
  }
  return Ve(i) ? Dn(i, e, s + 1) : i;
}
const Wr = { type: "spring", stiffness: 500, damping: 25, restSpeed: 10 }, $r = (t) => ({ type: "spring", stiffness: 550, damping: t === 0 ? 2 * Math.sqrt(550) : 30, restSpeed: 10 }), zr = { type: "keyframes", duration: 0.8 }, Xr = { type: "keyframes", ease: [0.25, 0.1, 0.35, 1], duration: 0.3 }, _r = (t, { keyframes: e }) => e.length > 2 ? zr : pt.has(t) ? t.startsWith("scale") ? $r(e[1]) : Wr : Xr, Hr = (t) => t !== null;
function Yr(t, { repeat: e, repeatType: s = "loop" }, n) {
  const i = t.filter(Hr), o = e && s !== "loop" && e % 2 === 1 ? 0 : i.length - 1;
  return i[o];
}
function Mn(t, e) {
  if ((t == null ? void 0 : t.inherit) && e) {
    const { inherit: s, ...n } = t;
    return { ...e, ...n };
  }
  return t;
}
function ke(t, e) {
  const s = (t == null ? void 0 : t[e]) ?? (t == null ? void 0 : t.default) ?? t;
  return s !== t ? Mn(s, t) : s;
}
function Gr({ when: t, delay: e, delayChildren: s, staggerChildren: n, staggerDirection: i, repeat: o, repeatType: r, repeatDelay: a, from: l, elapsed: c, ...u }) {
  return !!Object.keys(u).length;
}
const Rn = (t, e, s, n = {}, i, o) => (r) => {
  const a = ke(n, t) || {}, l = a.delay || n.delay || 0;
  let { elapsed: c = 0 } = n;
  c = c - W(l);
  const u = { keyframes: Array.isArray(s) ? s : [null, s], ease: "easeOut", velocity: e.getVelocity(), ...a, delay: -c, onUpdate: (f) => {
    e.set(f), a.onUpdate && a.onUpdate(f);
  }, onComplete: () => {
    r(), a.onComplete && a.onComplete();
  }, name: t, motionValue: e, element: o ? void 0 : i };
  Gr(a) || Object.assign(u, _r(t, u)), u.duration && (u.duration = W(u.duration)), u.repeatDelay && (u.repeatDelay = W(u.repeatDelay)), u.from !== void 0 && (u.keyframes[0] = u.from);
  let h = false;
  if ((u.type === false || u.duration === 0 && !u.repeatDelay) && (le(u), u.delay === 0 && (h = true)), (X.instantAnimations || X.skipAnimations || (i == null ? void 0 : i.shouldSkipAnimations)) && (h = true, le(u), u.delay = 0), u.allowFlatten = !a.type && !a.ease, h && !o && e.get() !== void 0) {
    const f = Yr(u.keyframes, a);
    if (f !== void 0) {
      B.update(() => {
        u.onUpdate(f), u.onComplete();
      });
      return;
    }
  }
  return a.isSync ? new Ee(u) : new Nr(u);
};
function ss(t) {
  const e = [{}, {}];
  return t == null ? void 0 : t.values.forEach((s, n) => {
    e[0][n] = s.get(), e[1][n] = s.getVelocity();
  }), e;
}
function Cn(t, e, s, n) {
  if (typeof e == "function") {
    const [i, o] = ss(n);
    e = e(s !== void 0 ? s : t.custom, i, o);
  }
  if (typeof e == "string" && (e = t.variants && t.variants[e]), typeof e == "function") {
    const [i, o] = ss(n);
    e = e(s !== void 0 ? s : t.custom, i, o);
  }
  return e;
}
function ut(t, e, s) {
  const n = t.getProps();
  return Cn(n, e, s !== void 0 ? s : n.custom, t);
}
const En = /* @__PURE__ */ new Set(["width", "height", "top", "left", "right", "bottom", ...dt]), ns = 30, qr = (t) => !isNaN(parseFloat(t));
class Zr {
  constructor(e, s = {}) {
    this.canTrackVelocity = null, this.events = {}, this.updateAndNotify = (n) => {
      var _a2;
      const i = k.now();
      if (this.updatedAt !== i && this.setPrevFrameValue(), this.prev = this.current, this.setCurrent(n), this.current !== this.prev && ((_a2 = this.events.change) == null ? void 0 : _a2.notify(this.current), this.dependents)) for (const o of this.dependents) o.dirty();
    }, this.hasAnimated = false, this.setCurrent(e), this.owner = s.owner;
  }
  setCurrent(e) {
    this.current = e, this.updatedAt = k.now(), this.canTrackVelocity === null && e !== void 0 && (this.canTrackVelocity = qr(this.current));
  }
  setPrevFrameValue(e = this.current) {
    this.prevFrameValue = e, this.prevUpdatedAt = this.updatedAt;
  }
  onChange(e) {
    return this.on("change", e);
  }
  on(e, s) {
    this.events[e] || (this.events[e] = new be());
    const n = this.events[e].add(s);
    return e === "change" ? () => {
      n(), B.read(() => {
        this.events.change.getSize() || this.stop();
      });
    } : n;
  }
  clearListeners() {
    for (const e in this.events) this.events[e].clear();
  }
  attach(e, s) {
    this.passiveEffect = e, this.stopPassiveEffect = s;
  }
  set(e) {
    this.passiveEffect ? this.passiveEffect(e, this.updateAndNotify) : this.updateAndNotify(e);
  }
  setWithVelocity(e, s, n) {
    this.set(s), this.prev = void 0, this.prevFrameValue = e, this.prevUpdatedAt = this.updatedAt - n;
  }
  jump(e, s = true) {
    this.updateAndNotify(e), this.prev = e, this.prevUpdatedAt = this.prevFrameValue = void 0, s && this.stop(), this.stopPassiveEffect && this.stopPassiveEffect();
  }
  dirty() {
    var _a2;
    (_a2 = this.events.change) == null ? void 0 : _a2.notify(this.current);
  }
  addDependent(e) {
    this.dependents || (this.dependents = /* @__PURE__ */ new Set()), this.dependents.add(e);
  }
  removeDependent(e) {
    this.dependents && this.dependents.delete(e);
  }
  get() {
    return this.current;
  }
  getPrevious() {
    return this.prev;
  }
  getVelocity() {
    const e = k.now();
    if (!this.canTrackVelocity || this.prevFrameValue === void 0 || e - this.updatedAt > ns) return 0;
    const s = Math.min(this.updatedAt - this.prevUpdatedAt, ns);
    return Ys(parseFloat(this.current) - parseFloat(this.prevFrameValue), s);
  }
  start(e) {
    return this.stop(), new Promise((s) => {
      this.hasAnimated = true, this.animation = e(s), this.events.animationStart && this.events.animationStart.notify();
    }).then(() => {
      this.events.animationComplete && this.events.animationComplete.notify(), this.clearAnimation();
    });
  }
  stop() {
    this.animation && (this.animation.stop(), this.events.animationCancel && this.events.animationCancel.notify()), this.clearAnimation();
  }
  isAnimating() {
    return !!this.animation;
  }
  clearAnimation() {
    delete this.animation;
  }
  destroy() {
    var _a2, _b;
    (_a2 = this.dependents) == null ? void 0 : _a2.clear(), (_b = this.events.destroy) == null ? void 0 : _b.notify(), this.clearListeners(), this.stop(), this.stopPassiveEffect && this.stopPassiveEffect();
  }
}
function ht(t, e) {
  return new Zr(t, e);
}
const ce = (t) => Array.isArray(t);
function Jr(t, e, s) {
  t.hasValue(e) ? t.getValue(e).set(s) : t.addValue(e, ht(s));
}
function Qr(t) {
  return ce(t) ? t[t.length - 1] || 0 : t;
}
function to(t, e) {
  const s = ut(t, e);
  let { transitionEnd: n = {}, transition: i = {}, ...o } = s || {};
  o = { ...o, ...n };
  for (const r in o) {
    const a = Qr(o[r]);
    Jr(t, r, a);
  }
}
const F = (t) => !!(t && t.getVelocity);
function eo(t) {
  return !!(F(t) && t.add);
}
function so(t, e) {
  const s = t.getValue("willChange");
  if (eo(s)) return s.add(e);
  if (!s && X.WillChange) {
    const n = new X.WillChange("auto");
    t.addValue("willChange", n), n.add(e);
  }
}
function Le(t) {
  return t.replace(/([A-Z])/g, (e) => `-${e.toLowerCase()}`);
}
const no = "framerAppearId", io = "data-" + Le(no);
function Bn(t) {
  return t.props[io];
}
function ro({ protectedKeys: t, needsAnimating: e }, s) {
  const n = t.hasOwnProperty(s) && e[s] !== true;
  return e[s] = false, n;
}
function kn(t, e, { delay: s = 0, transitionOverride: n, type: i } = {}) {
  let { transition: o, transitionEnd: r, ...a } = e;
  const l = t.getDefaultTransition();
  o = o ? Mn(o, l) : l;
  const c = o == null ? void 0 : o.reduceMotion;
  n && (o = n);
  const u = [], h = i && t.animationState && t.animationState.getState()[i];
  for (const f in a) {
    const d = t.getValue(f, t.latestValues[f] ?? null), m = a[f];
    if (m === void 0 || h && ro(h, f)) continue;
    const x = { delay: s, ...ke(o || {}, f) }, T = d.get();
    if (T !== void 0 && !d.isAnimating && !Array.isArray(m) && m === T && !x.velocity) continue;
    let g = false;
    if (window.MotionHandoffAnimation) {
      const S = Bn(t);
      if (S) {
        const v = window.MotionHandoffAnimation(S, f, B);
        v !== null && (x.startTime = v, g = true);
      }
    }
    so(t, f);
    const b = c ?? t.shouldReduceMotion;
    d.start(Rn(f, d, m, b && En.has(f) ? { type: false } : x, t, g));
    const y = d.animation;
    y && u.push(y);
  }
  if (r) {
    const f = () => B.update(() => {
      r && to(t, r);
    });
    u.length ? Promise.all(u).then(f) : f();
  }
  return u;
}
function ue(t, e, s = {}) {
  var _a2;
  const n = ut(t, e, s.type === "exit" ? (_a2 = t.presenceContext) == null ? void 0 : _a2.custom : void 0);
  let { transition: i = t.getDefaultTransition() || {} } = n || {};
  s.transitionOverride && (i = s.transitionOverride);
  const o = n ? () => Promise.all(kn(t, n, s)) : () => Promise.resolve(), r = t.variantChildren && t.variantChildren.size ? (l = 0) => {
    const { delayChildren: c = 0, staggerChildren: u, staggerDirection: h } = i;
    return oo(t, e, l, c, u, h, s);
  } : () => Promise.resolve(), { when: a } = i;
  if (a) {
    const [l, c] = a === "beforeChildren" ? [o, r] : [r, o];
    return l().then(() => c());
  } else return Promise.all([o(), r(s.delay)]);
}
function oo(t, e, s = 0, n = 0, i = 0, o = 1, r) {
  const a = [];
  for (const l of t.variantChildren) l.notify("AnimationStart", e), a.push(ue(l, e, { ...r, delay: s + (typeof n == "function" ? 0 : n) + Pn(t.variantChildren, l, n, i, o) }).then(() => l.notify("AnimationComplete", e)));
  return Promise.all(a);
}
function ao(t, e, s = {}) {
  t.notify("AnimationStart", e);
  let n;
  if (Array.isArray(e)) {
    const i = e.map((o) => ue(t, o, s));
    n = Promise.all(i);
  } else if (typeof e == "string") n = ue(t, e, s);
  else {
    const i = typeof e == "function" ? ut(t, e, s.custom) : e;
    n = Promise.all(kn(t, i, s));
  }
  return n.then(() => {
    t.notify("AnimationComplete", e);
  });
}
const lo = { test: (t) => t === "auto", parse: (t) => t }, Ln = (t) => (e) => e.test(t), Fn = [ft, p, $, _, Li, ki, lo], is = (t) => Fn.find(Ln(t));
function co(t) {
  return typeof t == "number" ? t === 0 : t !== null ? t === "none" || t === "0" || Hs(t) : true;
}
const uo = /* @__PURE__ */ new Set(["brightness", "contrast", "saturate", "opacity"]);
function ho(t) {
  const [e, s] = t.slice(0, -1).split("(");
  if (e === "drop-shadow") return t;
  const [n] = s.match(we) || [];
  if (!n) return t;
  const i = s.replace(n, "");
  let o = uo.has(e) ? 1 : 0;
  return n !== s && (o *= 100), e + "(" + o + i + ")";
}
const fo = /\b([a-z-]*)\(.*?\)/gu, he = { ...Y, getAnimatableNone: (t) => {
  const e = t.match(fo);
  return e ? e.map(ho).join(" ") : t;
} }, rs = { ...ft, transform: Math.round }, po = { rotate: _, rotateX: _, rotateY: _, rotateZ: _, scale: wt, scaleX: wt, scaleY: wt, scaleZ: wt, skew: _, skewX: _, skewY: _, distance: p, translateX: p, translateY: p, translateZ: p, x: p, y: p, z: p, perspective: p, transformPerspective: p, opacity: xt, originX: Xe, originY: Xe, originZ: p }, Fe = { borderWidth: p, borderTopWidth: p, borderRightWidth: p, borderBottomWidth: p, borderLeftWidth: p, borderRadius: p, borderTopLeftRadius: p, borderTopRightRadius: p, borderBottomRightRadius: p, borderBottomLeftRadius: p, width: p, maxWidth: p, height: p, maxHeight: p, top: p, right: p, bottom: p, left: p, inset: p, insetBlock: p, insetBlockStart: p, insetBlockEnd: p, insetInline: p, insetInlineStart: p, insetInlineEnd: p, padding: p, paddingTop: p, paddingRight: p, paddingBottom: p, paddingLeft: p, paddingBlock: p, paddingBlockStart: p, paddingBlockEnd: p, paddingInline: p, paddingInlineStart: p, paddingInlineEnd: p, margin: p, marginTop: p, marginRight: p, marginBottom: p, marginLeft: p, marginBlock: p, marginBlockStart: p, marginBlockEnd: p, marginInline: p, marginInlineStart: p, marginInlineEnd: p, fontSize: p, backgroundPositionX: p, backgroundPositionY: p, ...po, zIndex: rs, fillOpacity: xt, strokeOpacity: xt, numOctaves: rs }, mo = { ...Fe, color: P, backgroundColor: P, outlineColor: P, fill: P, stroke: P, borderColor: P, borderTopColor: P, borderRightColor: P, borderBottomColor: P, borderLeftColor: P, filter: he, WebkitFilter: he }, In = (t) => mo[t];
function On(t, e) {
  let s = In(t);
  return s !== he && (s = Y), s.getAnimatableNone ? s.getAnimatableNone(e) : void 0;
}
const yo = /* @__PURE__ */ new Set(["auto", "none", "0"]);
function go(t, e, s) {
  let n = 0, i;
  for (; n < t.length && !i; ) {
    const o = t[n];
    typeof o == "string" && !yo.has(o) && bt(o).values.length && (i = t[n]), n++;
  }
  if (i && s) for (const o of e) t[o] = On(s, i);
}
class To extends Be {
  constructor(e, s, n, i, o) {
    super(e, s, n, i, o, true);
  }
  readKeyframes() {
    const { unresolvedKeyframes: e, element: s, name: n } = this;
    if (!s || !s.current) return;
    super.readKeyframes();
    for (let u = 0; u < e.length; u++) {
      let h = e[u];
      if (typeof h == "string" && (h = h.trim(), Ve(h))) {
        const f = Dn(h, s.current);
        f !== void 0 && (e[u] = f), u === e.length - 1 && (this.finalKeyframe = h);
      }
    }
    if (this.resolveNoneKeyframes(), !En.has(n) || e.length !== 2) return;
    const [i, o] = e, r = is(i), a = is(o), l = ze(i), c = ze(o);
    if (l !== c && H[n]) {
      this.needsMeasurement = true;
      return;
    }
    if (r !== a) if (Qe(r) && Qe(a)) for (let u = 0; u < e.length; u++) {
      const h = e[u];
      typeof h == "string" && (e[u] = parseFloat(h));
    }
    else H[n] && (this.needsMeasurement = true);
  }
  resolveNoneKeyframes() {
    const { unresolvedKeyframes: e, name: s } = this, n = [];
    for (let i = 0; i < e.length; i++) (e[i] === null || co(e[i])) && n.push(i);
    n.length && go(e, n, s);
  }
  measureInitialState() {
    const { element: e, unresolvedKeyframes: s, name: n } = this;
    if (!e || !e.current) return;
    n === "height" && (this.suspendedScrollY = window.pageYOffset), this.measuredOrigin = H[n](e.measureViewportBox(), window.getComputedStyle(e.current)), s[0] = this.measuredOrigin;
    const i = s[s.length - 1];
    i !== void 0 && e.getValue(n, i).jump(i, false);
  }
  measureEndState() {
    var _a2;
    const { element: e, name: s, unresolvedKeyframes: n } = this;
    if (!e || !e.current) return;
    const i = e.getValue(s);
    i && i.jump(this.measuredOrigin, false);
    const o = n.length - 1, r = n[o];
    n[o] = H[s](e.measureViewportBox(), window.getComputedStyle(e.current)), r !== null && this.finalKeyframe === void 0 && (this.finalKeyframe = r), ((_a2 = this.removedTransforms) == null ? void 0 : _a2.length) && this.removedTransforms.forEach(([a, l]) => {
      e.getValue(a).set(l);
    }), this.resolveNoneKeyframes();
  }
}
const vo = /* @__PURE__ */ new Set(["opacity", "clipPath", "filter", "transform"]);
function jn(t, e, s) {
  if (t == null) return [];
  if (t instanceof EventTarget) return [t];
  if (typeof t == "string") {
    let n = document;
    const i = (s == null ? void 0 : s[t]) ?? n.querySelectorAll(t);
    return i ? Array.from(i) : [];
  }
  return Array.from(t).filter((n) => n != null);
}
const Nn = (t, e) => e && typeof t == "number" ? e.transform(t) : t;
function xo(t) {
  return _s(t) && "offsetHeight" in t;
}
const { schedule: Un } = on(queueMicrotask, false), U = { x: false, y: false };
function Kn() {
  return U.x || U.y;
}
function Ja(t) {
  return t === "x" || t === "y" ? U[t] ? null : (U[t] = true, () => {
    U[t] = false;
  }) : U.x || U.y ? null : (U.x = U.y = true, () => {
    U.x = U.y = false;
  });
}
function Wn(t, e) {
  const s = jn(t), n = new AbortController(), i = { passive: true, ...e, signal: n.signal };
  return [s, i, () => n.abort()];
}
function bo(t) {
  return !(t.pointerType === "touch" || Kn());
}
function Qa(t, e, s = {}) {
  const [n, i, o] = Wn(t, s);
  return n.forEach((r) => {
    let a = false, l = false, c;
    const u = () => {
      r.removeEventListener("pointerleave", m);
    }, h = (T) => {
      c && (c(T), c = void 0), u();
    }, f = (T) => {
      a = false, window.removeEventListener("pointerup", f), window.removeEventListener("pointercancel", f), l && (l = false, h(T));
    }, d = () => {
      a = true, window.addEventListener("pointerup", f, i), window.addEventListener("pointercancel", f, i);
    }, m = (T) => {
      if (T.pointerType !== "touch") {
        if (a) {
          l = true;
          return;
        }
        h(T);
      }
    }, x = (T) => {
      if (!bo(T)) return;
      l = false;
      const g = e(r, T);
      typeof g == "function" && (c = g, r.addEventListener("pointerleave", m, i));
    };
    r.addEventListener("pointerenter", x, i), r.addEventListener("pointerdown", d, i);
  }), o;
}
const $n = (t, e) => e ? t === e ? true : $n(t, e.parentElement) : false, Ao = (t) => t.pointerType === "mouse" ? typeof t.button != "number" || t.button <= 0 : t.isPrimary !== false, So = /* @__PURE__ */ new Set(["BUTTON", "INPUT", "SELECT", "TEXTAREA", "A"]);
function Vo(t) {
  return So.has(t.tagName) || t.isContentEditable === true;
}
const wo = /* @__PURE__ */ new Set(["INPUT", "SELECT", "TEXTAREA"]);
function tl(t) {
  return wo.has(t.tagName) || t.isContentEditable === true;
}
const Dt = /* @__PURE__ */ new WeakSet();
function os(t) {
  return (e) => {
    e.key === "Enter" && t(e);
  };
}
function zt(t, e) {
  t.dispatchEvent(new PointerEvent("pointer" + e, { isPrimary: true, bubbles: true }));
}
const Po = (t, e) => {
  const s = t.currentTarget;
  if (!s) return;
  const n = os(() => {
    if (Dt.has(s)) return;
    zt(s, "down");
    const i = os(() => {
      zt(s, "up");
    }), o = () => zt(s, "cancel");
    s.addEventListener("keyup", i, e), s.addEventListener("blur", o, e);
  });
  s.addEventListener("keydown", n, e), s.addEventListener("blur", () => s.removeEventListener("keydown", n), e);
};
function as(t) {
  return Ao(t) && !Kn();
}
const ls = /* @__PURE__ */ new WeakSet();
function el(t, e, s = {}) {
  const [n, i, o] = Wn(t, s), r = (a) => {
    const l = a.currentTarget;
    if (!as(a) || ls.has(a)) return;
    Dt.add(l), s.stopPropagation && ls.add(a);
    const c = e(l, a), u = (d, m) => {
      window.removeEventListener("pointerup", h), window.removeEventListener("pointercancel", f), Dt.has(l) && Dt.delete(l), as(d) && typeof c == "function" && c(d, { success: m });
    }, h = (d) => {
      u(d, l === window || l === document || s.useGlobalTarget || $n(l, d.target));
    }, f = (d) => {
      u(d, false);
    };
    window.addEventListener("pointerup", h, i), window.addEventListener("pointercancel", f, i);
  };
  return n.forEach((a) => {
    (s.useGlobalTarget ? window : a).addEventListener("pointerdown", r, i), xo(a) && (a.addEventListener("focus", (c) => Po(c, i)), !Vo(a) && !a.hasAttribute("tabindex") && (a.tabIndex = 0));
  }), o;
}
function Ie(t) {
  return _s(t) && "ownerSVGElement" in t;
}
const Mt = /* @__PURE__ */ new WeakMap();
let Rt;
const zn = (t, e, s) => (n, i) => i && i[0] ? i[0][t + "Size"] : Ie(n) && "getBBox" in n ? n.getBBox()[e] : n[s], Do = zn("inline", "width", "offsetWidth"), Mo = zn("block", "height", "offsetHeight");
function Ro({ target: t, borderBoxSize: e }) {
  var _a2;
  (_a2 = Mt.get(t)) == null ? void 0 : _a2.forEach((s) => {
    s(t, { get width() {
      return Do(t, e);
    }, get height() {
      return Mo(t, e);
    } });
  });
}
function Co(t) {
  t.forEach(Ro);
}
function Eo() {
  typeof ResizeObserver > "u" || (Rt = new ResizeObserver(Co));
}
function Bo(t, e) {
  Rt || Eo();
  const s = jn(t);
  return s.forEach((n) => {
    let i = Mt.get(n);
    i || (i = /* @__PURE__ */ new Set(), Mt.set(n, i)), i.add(e), Rt == null ? void 0 : Rt.observe(n);
  }), () => {
    s.forEach((n) => {
      const i = Mt.get(n);
      i == null ? void 0 : i.delete(e), (i == null ? void 0 : i.size) || (Rt == null ? void 0 : Rt.unobserve(n));
    });
  };
}
const Ct = /* @__PURE__ */ new Set();
let ot;
function ko() {
  ot = () => {
    const t = { get width() {
      return window.innerWidth;
    }, get height() {
      return window.innerHeight;
    } };
    Ct.forEach((e) => e(t));
  }, window.addEventListener("resize", ot);
}
function Lo(t) {
  return Ct.add(t), ot || ko(), () => {
    Ct.delete(t), !Ct.size && typeof ot == "function" && (window.removeEventListener("resize", ot), ot = void 0);
  };
}
function sl(t, e) {
  return typeof t == "function" ? Lo(t) : Bo(t, e);
}
function Fo(t) {
  return Ie(t) && t.tagName === "svg";
}
const Io = [...Fn, P, Y], Oo = (t) => Io.find(Ln(t)), cs = () => ({ translate: 0, scale: 1, origin: 0, originPoint: 0 }), at = () => ({ x: cs(), y: cs() }), us = () => ({ min: 0, max: 0 }), R = () => ({ x: us(), y: us() }), jo = /* @__PURE__ */ new WeakMap();
function Xn(t) {
  return t !== null && typeof t == "object" && typeof t.start == "function";
}
function Oe(t) {
  return typeof t == "string" || Array.isArray(t);
}
const je = ["animate", "whileInView", "whileFocus", "whileHover", "whileTap", "whileDrag", "exit"], Ne = ["initial", ...je];
function _n(t) {
  return Xn(t.animate) || Ne.some((e) => Oe(t[e]));
}
function No(t) {
  return !!(_n(t) || t.variants);
}
function Uo(t, e, s) {
  for (const n in e) {
    const i = e[n], o = s[n];
    if (F(i)) t.addValue(n, i);
    else if (F(o)) t.addValue(n, ht(i, { owner: t }));
    else if (o !== i) if (t.hasValue(n)) {
      const r = t.getValue(n);
      r.liveStyle === true ? r.jump(i) : r.hasAnimated || r.set(i);
    } else {
      const r = t.getStaticValue(n);
      t.addValue(n, ht(r !== void 0 ? r : i, { owner: t }));
    }
  }
  for (const n in s) e[n] === void 0 && t.removeValue(n);
  return e;
}
const fe = { current: null }, Hn = { current: false }, Ko = typeof window < "u";
function Wo() {
  if (Hn.current = true, !!Ko) if (window.matchMedia) {
    const t = window.matchMedia("(prefers-reduced-motion)"), e = () => fe.current = t.matches;
    t.addEventListener("change", e), e();
  } else fe.current = false;
}
const hs = ["AnimationStart", "AnimationComplete", "Update", "BeforeLayoutMeasure", "LayoutMeasure", "LayoutAnimationStart", "LayoutAnimationComplete"];
let Ft = {};
function nl(t) {
  Ft = t;
}
function il() {
  return Ft;
}
class $o {
  scrapeMotionValuesFromProps(e, s, n) {
    return {};
  }
  constructor({ parent: e, props: s, presenceContext: n, reducedMotionConfig: i, skipAnimations: o, blockInitialAnimation: r, visualState: a }, l = {}) {
    this.current = null, this.children = /* @__PURE__ */ new Set(), this.isVariantNode = false, this.isControllingVariants = false, this.shouldReduceMotion = null, this.shouldSkipAnimations = false, this.values = /* @__PURE__ */ new Map(), this.KeyframeResolver = Be, this.features = {}, this.valueSubscriptions = /* @__PURE__ */ new Map(), this.prevMotionValues = {}, this.hasBeenMounted = false, this.events = {}, this.propEventSubscriptions = {}, this.notifyUpdate = () => this.notify("Update", this.latestValues), this.render = () => {
      this.current && (this.triggerBuild(), this.renderInstance(this.current, this.renderState, this.props.style, this.projection));
    }, this.renderScheduledAt = 0, this.scheduleRender = () => {
      const d = k.now();
      this.renderScheduledAt < d && (this.renderScheduledAt = d, B.render(this.render, false, true));
    };
    const { latestValues: c, renderState: u } = a;
    this.latestValues = c, this.baseTarget = { ...c }, this.initialValues = s.initial ? { ...c } : {}, this.renderState = u, this.parent = e, this.props = s, this.presenceContext = n, this.depth = e ? e.depth + 1 : 0, this.reducedMotionConfig = i, this.skipAnimationsConfig = o, this.options = l, this.blockInitialAnimation = !!r, this.isControllingVariants = _n(s), this.isVariantNode = No(s), this.isVariantNode && (this.variantChildren = /* @__PURE__ */ new Set()), this.manuallyAnimateOnMount = !!(e && e.current);
    const { willChange: h, ...f } = this.scrapeMotionValuesFromProps(s, {}, this);
    for (const d in f) {
      const m = f[d];
      c[d] !== void 0 && F(m) && m.set(c[d]);
    }
  }
  mount(e) {
    var _a2, _b;
    if (this.hasBeenMounted) for (const s in this.initialValues) (_a2 = this.values.get(s)) == null ? void 0 : _a2.jump(this.initialValues[s]), this.latestValues[s] = this.initialValues[s];
    this.current = e, jo.set(e, this), this.projection && !this.projection.instance && this.projection.mount(e), this.parent && this.isVariantNode && !this.isControllingVariants && (this.removeFromVariantTree = this.parent.addVariantChild(this)), this.values.forEach((s, n) => this.bindToMotionValue(n, s)), this.reducedMotionConfig === "never" ? this.shouldReduceMotion = false : this.reducedMotionConfig === "always" ? this.shouldReduceMotion = true : (Hn.current || Wo(), this.shouldReduceMotion = fe.current), this.shouldSkipAnimations = this.skipAnimationsConfig ?? false, (_b = this.parent) == null ? void 0 : _b.addChild(this), this.update(this.props, this.presenceContext), this.hasBeenMounted = true;
  }
  unmount() {
    var _a2;
    this.projection && this.projection.unmount(), st(this.notifyUpdate), st(this.render), this.valueSubscriptions.forEach((e) => e()), this.valueSubscriptions.clear(), this.removeFromVariantTree && this.removeFromVariantTree(), (_a2 = this.parent) == null ? void 0 : _a2.removeChild(this);
    for (const e in this.events) this.events[e].clear();
    for (const e in this.features) {
      const s = this.features[e];
      s && (s.unmount(), s.isMounted = false);
    }
    this.current = null;
  }
  addChild(e) {
    this.children.add(e), this.enteringChildren ?? (this.enteringChildren = /* @__PURE__ */ new Set()), this.enteringChildren.add(e);
  }
  removeChild(e) {
    this.children.delete(e), this.enteringChildren && this.enteringChildren.delete(e);
  }
  bindToMotionValue(e, s) {
    if (this.valueSubscriptions.has(e) && this.valueSubscriptions.get(e)(), s.accelerate && vo.has(e) && this.current instanceof HTMLElement) {
      const { factory: r, keyframes: a, times: l, ease: c, duration: u } = s.accelerate, h = new Vn({ element: this.current, name: e, keyframes: a, times: l, ease: c, duration: W(u) }), f = r(h);
      this.valueSubscriptions.set(e, () => {
        f(), h.cancel();
      });
      return;
    }
    const n = pt.has(e);
    n && this.onBindTransform && this.onBindTransform();
    const i = s.on("change", (r) => {
      this.latestValues[e] = r, this.props.onUpdate && B.preRender(this.notifyUpdate), n && this.projection && (this.projection.isTransformDirty = true), this.scheduleRender();
    });
    let o;
    typeof window < "u" && window.MotionCheckAppearSync && (o = window.MotionCheckAppearSync(this, e, s)), this.valueSubscriptions.set(e, () => {
      i(), o && o(), s.owner && s.stop();
    });
  }
  sortNodePosition(e) {
    return !this.current || !this.sortInstanceNodePosition || this.type !== e.type ? 0 : this.sortInstanceNodePosition(this.current, e.current);
  }
  updateFeatures() {
    let e = "animation";
    for (e in Ft) {
      const s = Ft[e];
      if (!s) continue;
      const { isEnabled: n, Feature: i } = s;
      if (!this.features[e] && i && n(this.props) && (this.features[e] = new i(this)), this.features[e]) {
        const o = this.features[e];
        o.isMounted ? o.update() : (o.mount(), o.isMounted = true);
      }
    }
  }
  triggerBuild() {
    this.build(this.renderState, this.latestValues, this.props);
  }
  measureViewportBox() {
    return this.current ? this.measureInstanceViewportBox(this.current, this.props) : R();
  }
  getStaticValue(e) {
    return this.latestValues[e];
  }
  setStaticValue(e, s) {
    this.latestValues[e] = s;
  }
  update(e, s) {
    (e.transformTemplate || this.props.transformTemplate) && this.scheduleRender(), this.prevProps = this.props, this.props = e, this.prevPresenceContext = this.presenceContext, this.presenceContext = s;
    for (let n = 0; n < hs.length; n++) {
      const i = hs[n];
      this.propEventSubscriptions[i] && (this.propEventSubscriptions[i](), delete this.propEventSubscriptions[i]);
      const o = "on" + i, r = e[o];
      r && (this.propEventSubscriptions[i] = this.on(i, r));
    }
    this.prevMotionValues = Uo(this, this.scrapeMotionValuesFromProps(e, this.prevProps || {}, this), this.prevMotionValues), this.handleChildMotionValue && this.handleChildMotionValue();
  }
  getProps() {
    return this.props;
  }
  getVariant(e) {
    return this.props.variants ? this.props.variants[e] : void 0;
  }
  getDefaultTransition() {
    return this.props.transition;
  }
  getTransformPagePoint() {
    return this.props.transformPagePoint;
  }
  getClosestVariantNode() {
    return this.isVariantNode ? this : this.parent ? this.parent.getClosestVariantNode() : void 0;
  }
  addVariantChild(e) {
    const s = this.getClosestVariantNode();
    if (s) return s.variantChildren && s.variantChildren.add(e), () => s.variantChildren.delete(e);
  }
  addValue(e, s) {
    const n = this.values.get(e);
    s !== n && (n && this.removeValue(e), this.bindToMotionValue(e, s), this.values.set(e, s), this.latestValues[e] = s.get());
  }
  removeValue(e) {
    this.values.delete(e);
    const s = this.valueSubscriptions.get(e);
    s && (s(), this.valueSubscriptions.delete(e)), delete this.latestValues[e], this.removeValueFromRenderState(e, this.renderState);
  }
  hasValue(e) {
    return this.values.has(e);
  }
  getValue(e, s) {
    if (this.props.values && this.props.values[e]) return this.props.values[e];
    let n = this.values.get(e);
    return n === void 0 && s !== void 0 && (n = ht(s === null ? void 0 : s, { owner: this }), this.addValue(e, n)), n;
  }
  readValue(e, s) {
    let n = this.latestValues[e] !== void 0 || !this.current ? this.latestValues[e] : this.getBaseTargetFromProps(this.props, e) ?? this.readValueFromInstance(this.current, e, this.options);
    return n != null && (typeof n == "string" && (Xs(n) || Hs(n)) ? n = parseFloat(n) : !Oo(n) && Y.test(s) && (n = On(e, s)), this.setBaseTarget(e, F(n) ? n.get() : n)), F(n) ? n.get() : n;
  }
  setBaseTarget(e, s) {
    this.baseTarget[e] = s;
  }
  getBaseTarget(e) {
    var _a2;
    const { initial: s } = this.props;
    let n;
    if (typeof s == "string" || typeof s == "object") {
      const o = Cn(this.props, s, (_a2 = this.presenceContext) == null ? void 0 : _a2.custom);
      o && (n = o[e]);
    }
    if (s && n !== void 0) return n;
    const i = this.getBaseTargetFromProps(this.props, e);
    return i !== void 0 && !F(i) ? i : this.initialValues[e] !== void 0 && n === void 0 ? void 0 : this.baseTarget[e];
  }
  on(e, s) {
    return this.events[e] || (this.events[e] = new be()), this.events[e].add(s);
  }
  notify(e, ...s) {
    this.events[e] && this.events[e].notify(...s);
  }
  scheduleRenderMicrotask() {
    Un.render(this.render);
  }
}
class Yn extends $o {
  constructor() {
    super(...arguments), this.KeyframeResolver = To;
  }
  sortInstanceNodePosition(e, s) {
    return e.compareDocumentPosition(s) & 2 ? 1 : -1;
  }
  getBaseTargetFromProps(e, s) {
    const n = e.style;
    return n ? n[s] : void 0;
  }
  removeValueFromRenderState(e, { vars: s, style: n }) {
    delete s[e], delete n[e];
  }
  handleChildMotionValue() {
    this.childSubscription && (this.childSubscription(), delete this.childSubscription);
    const { children: e } = this.props;
    F(e) && (this.childSubscription = e.on("change", (s) => {
      this.current && (this.current.textContent = `${s}`);
    }));
  }
}
class rl {
  constructor(e) {
    this.isMounted = false, this.node = e;
  }
  update() {
  }
}
function zo({ top: t, left: e, right: s, bottom: n }) {
  return { x: { min: e, max: s }, y: { min: t, max: n } };
}
function ol({ x: t, y: e }) {
  return { top: e.min, right: t.max, bottom: e.max, left: t.min };
}
function Xo(t, e) {
  if (!e) return t;
  const s = e({ x: t.left, y: t.top }), n = e({ x: t.right, y: t.bottom });
  return { top: s.y, left: s.x, bottom: n.y, right: n.x };
}
function Xt(t) {
  return t === void 0 || t === 1;
}
function de({ scale: t, scaleX: e, scaleY: s }) {
  return !Xt(t) || !Xt(e) || !Xt(s);
}
function J(t) {
  return de(t) || Gn(t) || t.z || t.rotate || t.rotateX || t.rotateY || t.skewX || t.skewY;
}
function Gn(t) {
  return fs(t.x) || fs(t.y);
}
function fs(t) {
  return t && t !== "0%";
}
function It(t, e, s) {
  const n = t - s, i = e * n;
  return s + i;
}
function ds(t, e, s, n, i) {
  return i !== void 0 && (t = It(t, i, n)), It(t, s, n) + e;
}
function pe(t, e = 0, s = 1, n, i) {
  t.min = ds(t.min, e, s, n, i), t.max = ds(t.max, e, s, n, i);
}
function qn(t, { x: e, y: s }) {
  pe(t.x, e.translate, e.scale, e.originPoint), pe(t.y, s.translate, s.scale, s.originPoint);
}
const ps = 0.999999999999, ms = 1.0000000000001;
function _o(t, e, s, n = false) {
  const i = s.length;
  if (!i) return;
  e.x = e.y = 1;
  let o, r;
  for (let a = 0; a < i; a++) {
    o = s[a], r = o.projectionDelta;
    const { visualElement: l } = o.options;
    l && l.props.style && l.props.style.display === "contents" || (n && o.options.layoutScroll && o.scroll && o !== o.root && ct(t, { x: -o.scroll.offset.x, y: -o.scroll.offset.y }), r && (e.x *= r.x.scale, e.y *= r.y.scale, qn(t, r)), n && J(o.latestValues) && ct(t, o.latestValues));
  }
  e.x < ms && e.x > ps && (e.x = 1), e.y < ms && e.y > ps && (e.y = 1);
}
function lt(t, e) {
  t.min = t.min + e, t.max = t.max + e;
}
function ys(t, e, s, n, i = 0.5) {
  const o = M(t.min, t.max, i);
  pe(t, e, s, o, n);
}
function ct(t, e) {
  ys(t.x, e.x, e.scaleX, e.scale, e.originX), ys(t.y, e.y, e.scaleY, e.scale, e.originY);
}
function Zn(t, e) {
  return zo(Xo(t.getBoundingClientRect(), e));
}
function al(t, e, s) {
  const n = Zn(t, s), { scroll: i } = e;
  return i && (lt(n.x, i.offset.x), lt(n.y, i.offset.y)), n;
}
const Ho = { x: "translateX", y: "translateY", z: "translateZ", transformPerspective: "perspective" }, Yo = dt.length;
function Go(t, e, s) {
  let n = "", i = true;
  for (let o = 0; o < Yo; o++) {
    const r = dt[o], a = t[r];
    if (a === void 0) continue;
    let l = true;
    if (typeof a == "number") l = a === (r.startsWith("scale") ? 1 : 0);
    else {
      const c = parseFloat(a);
      l = r.startsWith("scale") ? c === 1 : c === 0;
    }
    if (!l || s) {
      const c = Nn(a, Fe[r]);
      if (!l) {
        i = false;
        const u = Ho[r] || r;
        n += `${u}(${c}) `;
      }
      s && (e[r] = c);
    }
  }
  return n = n.trim(), s ? n = s(e, i ? "" : n) : i && (n = "none"), n;
}
function Jn(t, e, s) {
  const { style: n, vars: i, transformOrigin: o } = t;
  let r = false, a = false;
  for (const l in e) {
    const c = e[l];
    if (pt.has(l)) {
      r = true;
      continue;
    } else if (ln(l)) {
      i[l] = c;
      continue;
    } else {
      const u = Nn(c, Fe[l]);
      l.startsWith("origin") ? (a = true, o[l] = u) : n[l] = u;
    }
  }
  if (e.transform || (r || s ? n.transform = Go(e, t.transform, s) : n.transform && (n.transform = "none")), a) {
    const { originX: l = "50%", originY: c = "50%", originZ: u = 0 } = o;
    n.transformOrigin = `${l} ${c} ${u}`;
  }
}
function Qn(t, { style: e, vars: s }, n, i) {
  const o = t.style;
  let r;
  for (r in e) o[r] = e[r];
  i == null ? void 0 : i.applyProjectionStyles(o, n);
  for (r in s) o.setProperty(r, s[r]);
}
function gs(t, e) {
  return e.max === e.min ? 0 : t / (e.max - e.min) * 100;
}
const mt = { correct: (t, e) => {
  if (!e.target) return t;
  if (typeof t == "string") if (p.test(t)) t = parseFloat(t);
  else return t;
  const s = gs(t, e.target.x), n = gs(t, e.target.y);
  return `${s}% ${n}%`;
} }, qo = { correct: (t, { treeScale: e, projectionDelta: s }) => {
  const n = t, i = Y.parse(t);
  if (i.length > 5) return n;
  const o = Y.createTransformer(t), r = typeof i[0] != "number" ? 1 : 0, a = s.x.scale * e.x, l = s.y.scale * e.y;
  i[0 + r] /= a, i[1 + r] /= l;
  const c = M(a, l, 0.5);
  return typeof i[2 + r] == "number" && (i[2 + r] /= c), typeof i[3 + r] == "number" && (i[3 + r] /= c), o(i);
} }, me = { borderRadius: { ...mt, applyTo: ["borderTopLeftRadius", "borderTopRightRadius", "borderBottomLeftRadius", "borderBottomRightRadius"] }, borderTopLeftRadius: mt, borderTopRightRadius: mt, borderBottomLeftRadius: mt, borderBottomRightRadius: mt, boxShadow: qo };
function Zo(t, { layout: e, layoutId: s }) {
  return pt.has(t) || t.startsWith("origin") || (e || s !== void 0) && (!!me[t] || t === "opacity");
}
function ti(t, e, s) {
  var _a2;
  const n = t.style, i = e == null ? void 0 : e.style, o = {};
  if (!n) return o;
  for (const r in n) (F(n[r]) || i && F(i[r]) || Zo(r, t) || ((_a2 = s == null ? void 0 : s.getValue(r)) == null ? void 0 : _a2.liveStyle) !== void 0) && (o[r] = n[r]);
  return o;
}
function Jo(t) {
  return window.getComputedStyle(t);
}
class ll extends Yn {
  constructor() {
    super(...arguments), this.type = "html", this.renderInstance = Qn;
  }
  readValueFromInstance(e, s) {
    var _a2;
    if (pt.has(s)) return ((_a2 = this.projection) == null ? void 0 : _a2.isProjecting) ? ne(s) : gr(e, s);
    {
      const n = Jo(e), i = (ln(s) ? n.getPropertyValue(s) : n[s]) || 0;
      return typeof i == "string" ? i.trim() : i;
    }
  }
  measureInstanceViewportBox(e, { transformPagePoint: s }) {
    return Zn(e, s);
  }
  build(e, s, n) {
    Jn(e, s, n.transformTemplate);
  }
  scrapeMotionValuesFromProps(e, s, n) {
    return ti(e, s, n);
  }
}
const Qo = { offset: "stroke-dashoffset", array: "stroke-dasharray" }, ta = { offset: "strokeDashoffset", array: "strokeDasharray" };
function ea(t, e, s = 1, n = 0, i = true) {
  t.pathLength = 1;
  const o = i ? Qo : ta;
  t[o.offset] = `${-n}`, t[o.array] = `${e} ${s}`;
}
const sa = ["offsetDistance", "offsetPath", "offsetRotate", "offsetAnchor"];
function na(t, { attrX: e, attrY: s, attrScale: n, pathLength: i, pathSpacing: o = 1, pathOffset: r = 0, ...a }, l, c, u) {
  if (Jn(t, a, c), l) {
    t.style.viewBox && (t.attrs.viewBox = t.style.viewBox);
    return;
  }
  t.attrs = t.style, t.style = {};
  const { attrs: h, style: f } = t;
  h.transform && (f.transform = h.transform, delete h.transform), (f.transform || h.transformOrigin) && (f.transformOrigin = h.transformOrigin ?? "50% 50%", delete h.transformOrigin), f.transform && (f.transformBox = (u == null ? void 0 : u.transformBox) ?? "fill-box", delete h.transformBox);
  for (const d of sa) h[d] !== void 0 && (f[d] = h[d], delete h[d]);
  e !== void 0 && (h.x = e), s !== void 0 && (h.y = s), n !== void 0 && (h.scale = n), i !== void 0 && ea(h, i, o, r, false);
}
const ei = /* @__PURE__ */ new Set(["baseFrequency", "diffuseConstant", "kernelMatrix", "kernelUnitLength", "keySplines", "keyTimes", "limitingConeAngle", "markerHeight", "markerWidth", "numOctaves", "targetX", "targetY", "surfaceScale", "specularConstant", "specularExponent", "stdDeviation", "tableValues", "viewBox", "gradientTransform", "pathLength", "startOffset", "textLength", "lengthAdjust"]), ia = (t) => typeof t == "string" && t.toLowerCase() === "svg";
function ra(t, e, s, n) {
  Qn(t, e, void 0, n);
  for (const i in e.attrs) t.setAttribute(ei.has(i) ? i : Le(i), e.attrs[i]);
}
function oa(t, e, s) {
  const n = ti(t, e, s);
  for (const i in t) if (F(t[i]) || F(e[i])) {
    const o = dt.indexOf(i) !== -1 ? "attr" + i.charAt(0).toUpperCase() + i.substring(1) : i;
    n[o] = t[i];
  }
  return n;
}
class cl extends Yn {
  constructor() {
    super(...arguments), this.type = "svg", this.isSVGTag = false, this.measureInstanceViewportBox = R;
  }
  getBaseTargetFromProps(e, s) {
    return e[s];
  }
  readValueFromInstance(e, s) {
    if (pt.has(s)) {
      const n = In(s);
      return n && n.default || 0;
    }
    return s = ei.has(s) ? s : Le(s), e.getAttribute(s);
  }
  scrapeMotionValuesFromProps(e, s, n) {
    return oa(e, s, n);
  }
  build(e, s, n) {
    na(e, s, this.isSVGTag, n.transformTemplate, n.style);
  }
  renderInstance(e, s, n, i) {
    ra(e, s, n, i);
  }
  mount(e) {
    this.isSVGTag = ia(e.tagName), super.mount(e);
  }
}
const aa = Ne.length;
function si(t) {
  if (!t) return;
  if (!t.isControllingVariants) {
    const s = t.parent ? si(t.parent) || {} : {};
    return t.props.initial !== void 0 && (s.initial = t.props.initial), s;
  }
  const e = {};
  for (let s = 0; s < aa; s++) {
    const n = Ne[s], i = t.props[n];
    (Oe(i) || i === false) && (e[n] = i);
  }
  return e;
}
function ni(t, e) {
  if (!Array.isArray(e)) return false;
  const s = e.length;
  if (s !== t.length) return false;
  for (let n = 0; n < s; n++) if (e[n] !== t[n]) return false;
  return true;
}
const la = [...je].reverse(), ca = je.length;
function ua(t) {
  return (e) => Promise.all(e.map(({ animation: s, options: n }) => ao(t, s, n)));
}
function ul(t) {
  let e = ua(t), s = Ts(), n = true;
  const i = (l) => (c, u) => {
    var _a2;
    const h = ut(t, u, l === "exit" ? (_a2 = t.presenceContext) == null ? void 0 : _a2.custom : void 0);
    if (h) {
      const { transition: f, transitionEnd: d, ...m } = h;
      c = { ...c, ...m, ...d };
    }
    return c;
  };
  function o(l) {
    e = l(t);
  }
  function r(l) {
    const { props: c } = t, u = si(t.parent) || {}, h = [], f = /* @__PURE__ */ new Set();
    let d = {}, m = 1 / 0;
    for (let T = 0; T < ca; T++) {
      const g = la[T], b = s[g], y = c[g] !== void 0 ? c[g] : u[g], S = Oe(y), v = g === l ? b.isActive : null;
      v === false && (m = T);
      let V = y === u[g] && y !== c[g] && S;
      if (V && n && t.manuallyAnimateOnMount && (V = false), b.protectedKeys = { ...d }, !b.isActive && v === null || !y && !b.prevProp || Xn(y) || typeof y == "boolean") continue;
      if (g === "exit" && b.isActive && v !== true) {
        b.prevResolvedValues && (d = { ...d, ...b.prevResolvedValues });
        continue;
      }
      const D = ha(b.prevProp, y);
      let A = D || g === l && b.isActive && !V && S || T > m && S, L = false;
      const I = Array.isArray(y) ? y : [y];
      let nt = I.reduce(i(g), {});
      v === false && (nt = {});
      const { prevResolvedValues: Ue = {} } = b, di = { ...Ue, ...nt }, Ke = (C) => {
        A = true, f.has(C) && (L = true, f.delete(C)), b.needsAnimating[C] = true;
        const O = t.getValue(C);
        O && (O.liveStyle = false);
      };
      for (const C in di) {
        const O = nt[C], q = Ue[C];
        if (d.hasOwnProperty(C)) continue;
        let it = false;
        ce(O) && ce(q) ? it = !ni(O, q) : it = O !== q, it ? O != null ? Ke(C) : f.add(C) : O !== void 0 && f.has(C) ? Ke(C) : b.protectedKeys[C] = true;
      }
      b.prevProp = y, b.prevResolvedValues = nt, b.isActive && (d = { ...d, ...nt }), n && t.blockInitialAnimation && (A = false);
      const We = V && D;
      A && (!We || L) && h.push(...I.map((C) => {
        const O = { type: g };
        if (typeof C == "string" && n && !We && t.manuallyAnimateOnMount && t.parent) {
          const { parent: q } = t, it = ut(q, C);
          if (q.enteringChildren && it) {
            const { delayChildren: pi } = it.transition || {};
            O.delay = Pn(q.enteringChildren, t, pi);
          }
        }
        return { animation: C, options: O };
      }));
    }
    if (f.size) {
      const T = {};
      if (typeof c.initial != "boolean") {
        const g = ut(t, Array.isArray(c.initial) ? c.initial[0] : c.initial);
        g && g.transition && (T.transition = g.transition);
      }
      f.forEach((g) => {
        const b = t.getBaseTarget(g), y = t.getValue(g);
        y && (y.liveStyle = true), T[g] = b ?? null;
      }), h.push({ animation: T });
    }
    let x = !!h.length;
    return n && (c.initial === false || c.initial === c.animate) && !t.manuallyAnimateOnMount && (x = false), n = false, x ? e(h) : Promise.resolve();
  }
  function a(l, c) {
    var _a2;
    if (s[l].isActive === c) return Promise.resolve();
    (_a2 = t.variantChildren) == null ? void 0 : _a2.forEach((h) => {
      var _a3;
      return (_a3 = h.animationState) == null ? void 0 : _a3.setActive(l, c);
    }), s[l].isActive = c;
    const u = r(l);
    for (const h in s) s[h].protectedKeys = {};
    return u;
  }
  return { animateChanges: r, setActive: a, setAnimateFunction: o, getState: () => s, reset: () => {
    s = Ts();
  } };
}
function ha(t, e) {
  return typeof e == "string" ? e !== t : Array.isArray(e) ? !ni(e, t) : false;
}
function Z(t = false) {
  return { isActive: t, protectedKeys: {}, needsAnimating: {}, prevResolvedValues: {} };
}
function Ts() {
  return { animate: Z(true), whileInView: Z(), whileHover: Z(), whileTap: Z(), whileDrag: Z(), whileFocus: Z(), exit: Z() };
}
function vs(t, e) {
  t.min = e.min, t.max = e.max;
}
function N(t, e) {
  vs(t.x, e.x), vs(t.y, e.y);
}
function xs(t, e) {
  t.translate = e.translate, t.scale = e.scale, t.originPoint = e.originPoint, t.origin = e.origin;
}
const ii = 1e-4, fa = 1 - ii, da = 1 + ii, ri = 0.01, pa = 0 - ri, ma = 0 + ri;
function j(t) {
  return t.max - t.min;
}
function ya(t, e, s) {
  return Math.abs(t - e) <= s;
}
function bs(t, e, s, n = 0.5) {
  t.origin = n, t.originPoint = M(e.min, e.max, t.origin), t.scale = j(s) / j(e), t.translate = M(s.min, s.max, t.origin) - t.originPoint, (t.scale >= fa && t.scale <= da || isNaN(t.scale)) && (t.scale = 1), (t.translate >= pa && t.translate <= ma || isNaN(t.translate)) && (t.translate = 0);
}
function vt(t, e, s, n) {
  bs(t.x, e.x, s.x, n ? n.originX : void 0), bs(t.y, e.y, s.y, n ? n.originY : void 0);
}
function As(t, e, s) {
  t.min = s.min + e.min, t.max = t.min + j(e);
}
function ga(t, e, s) {
  As(t.x, e.x, s.x), As(t.y, e.y, s.y);
}
function Ss(t, e, s) {
  t.min = e.min - s.min, t.max = t.min + j(e);
}
function Ot(t, e, s) {
  Ss(t.x, e.x, s.x), Ss(t.y, e.y, s.y);
}
function Vs(t, e, s, n, i) {
  return t -= e, t = It(t, 1 / s, n), i !== void 0 && (t = It(t, 1 / i, n)), t;
}
function Ta(t, e = 0, s = 1, n = 0.5, i, o = t, r = t) {
  if ($.test(e) && (e = parseFloat(e), e = M(r.min, r.max, e / 100) - r.min), typeof e != "number") return;
  let a = M(o.min, o.max, n);
  t === o && (a -= e), t.min = Vs(t.min, e, s, a, i), t.max = Vs(t.max, e, s, a, i);
}
function ws(t, e, [s, n, i], o, r) {
  Ta(t, e[s], e[n], e[i], e.scale, o, r);
}
const va = ["x", "scaleX", "originX"], xa = ["y", "scaleY", "originY"];
function Ps(t, e, s, n) {
  ws(t.x, e, va, s ? s.x : void 0, n ? n.x : void 0), ws(t.y, e, xa, s ? s.y : void 0, n ? n.y : void 0);
}
function Ds(t) {
  return t.translate === 0 && t.scale === 1;
}
function oi(t) {
  return Ds(t.x) && Ds(t.y);
}
function Ms(t, e) {
  return t.min === e.min && t.max === e.max;
}
function ba(t, e) {
  return Ms(t.x, e.x) && Ms(t.y, e.y);
}
function Rs(t, e) {
  return Math.round(t.min) === Math.round(e.min) && Math.round(t.max) === Math.round(e.max);
}
function ai(t, e) {
  return Rs(t.x, e.x) && Rs(t.y, e.y);
}
function Cs(t) {
  return j(t.x) / j(t.y);
}
function Es(t, e) {
  return t.translate === e.translate && t.scale === e.scale && t.originPoint === e.originPoint;
}
function Bs(t) {
  return [t("x"), t("y")];
}
function Aa(t, e, s) {
  let n = "";
  const i = t.x.translate / e.x, o = t.y.translate / e.y, r = (s == null ? void 0 : s.z) || 0;
  if ((i || o || r) && (n = `translate3d(${i}px, ${o}px, ${r}px) `), (e.x !== 1 || e.y !== 1) && (n += `scale(${1 / e.x}, ${1 / e.y}) `), s) {
    const { transformPerspective: c, rotate: u, rotateX: h, rotateY: f, skewX: d, skewY: m } = s;
    c && (n = `perspective(${c}px) ${n}`), u && (n += `rotate(${u}deg) `), h && (n += `rotateX(${h}deg) `), f && (n += `rotateY(${f}deg) `), d && (n += `skewX(${d}deg) `), m && (n += `skewY(${m}deg) `);
  }
  const a = t.x.scale * e.x, l = t.y.scale * e.y;
  return (a !== 1 || l !== 1) && (n += `scale(${a}, ${l})`), n || "none";
}
const li = ["TopLeft", "TopRight", "BottomLeft", "BottomRight"], Sa = li.length, ks = (t) => typeof t == "string" ? parseFloat(t) : t, Ls = (t) => typeof t == "number" || p.test(t);
function Va(t, e, s, n, i, o) {
  i ? (t.opacity = M(0, s.opacity ?? 1, wa(n)), t.opacityExit = M(e.opacity ?? 1, 0, Pa(n))) : o && (t.opacity = M(e.opacity ?? 1, s.opacity ?? 1, n));
  for (let r = 0; r < Sa; r++) {
    const a = `border${li[r]}Radius`;
    let l = Fs(e, a), c = Fs(s, a);
    if (l === void 0 && c === void 0) continue;
    l || (l = 0), c || (c = 0), l === 0 || c === 0 || Ls(l) === Ls(c) ? (t[a] = Math.max(M(ks(l), ks(c), n), 0), ($.test(c) || $.test(l)) && (t[a] += "%")) : t[a] = c;
  }
  (e.rotate || s.rotate) && (t.rotate = M(e.rotate || 0, s.rotate || 0, n));
}
function Fs(t, e) {
  return t[e] !== void 0 ? t[e] : t.borderRadius;
}
const wa = ci(0, 0.5, en), Pa = ci(0.5, 0.95, G);
function ci(t, e, s) {
  return (n) => n < t ? 0 : n > e ? 1 : s(xe(t, e, n));
}
function Da(t, e, s) {
  const n = F(t) ? t : ht(t);
  return n.start(Rn("", n, e, s)), n.animation;
}
function Ma(t, e, s, n = { passive: true }) {
  return t.addEventListener(e, s, n), () => t.removeEventListener(e, s);
}
const Ra = (t, e) => t.depth - e.depth;
class Ca {
  constructor() {
    this.children = [], this.isDirty = false;
  }
  add(e) {
    ye(this.children, e), this.isDirty = true;
  }
  remove(e) {
    Et(this.children, e), this.isDirty = true;
  }
  forEach(e) {
    this.isDirty && this.children.sort(Ra), this.isDirty = false, this.children.forEach(e);
  }
}
function Ea(t, e) {
  const s = k.now(), n = ({ timestamp: i }) => {
    const o = i - s;
    o >= e && (st(n), t(o - e));
  };
  return B.setup(n, true), () => st(n);
}
function _t(t) {
  return F(t) ? t.get() : t;
}
class Ba {
  constructor() {
    this.members = [];
  }
  add(e) {
    ye(this.members, e);
    for (let s = this.members.length - 1; s >= 0; s--) {
      const n = this.members[s];
      if (n === e || n === this.lead || n === this.prevLead) continue;
      const i = n.instance;
      i && i.isConnected === false && n.isPresent !== false && !n.snapshot && Et(this.members, n);
    }
    e.scheduleRender();
  }
  remove(e) {
    if (Et(this.members, e), e === this.prevLead && (this.prevLead = void 0), e === this.lead) {
      const s = this.members[this.members.length - 1];
      s && this.promote(s);
    }
  }
  relegate(e) {
    const s = this.members.findIndex((i) => e === i);
    if (s === 0) return false;
    let n;
    for (let i = s; i >= 0; i--) {
      const o = this.members[i], r = o.instance;
      if (o.isPresent !== false && (!r || r.isConnected !== false)) {
        n = o;
        break;
      }
    }
    return n ? (this.promote(n), true) : false;
  }
  promote(e, s) {
    const n = this.lead;
    if (e !== n && (this.prevLead = n, this.lead = e, e.show(), n)) {
      n.instance && n.scheduleRender(), e.scheduleRender();
      const i = n.options.layoutDependency, o = e.options.layoutDependency;
      if (!(i !== void 0 && o !== void 0 && i === o)) {
        const l = n.instance;
        l && l.isConnected === false && !n.snapshot || (e.resumeFrom = n, s && (e.resumeFrom.preserveOpacity = true), n.snapshot && (e.snapshot = n.snapshot, e.snapshot.latestValues = n.animationValues || n.latestValues), e.root && e.root.isUpdating && (e.isLayoutDirty = true));
      }
      const { crossfade: a } = e.options;
      a === false && n.hide();
    }
  }
  exitAnimationComplete() {
    this.members.forEach((e) => {
      const { options: s, resumingFrom: n } = e;
      s.onExitComplete && s.onExitComplete(), n && n.options.onExitComplete && n.options.onExitComplete();
    });
  }
  scheduleRender() {
    this.members.forEach((e) => {
      e.instance && e.scheduleRender(false);
    });
  }
  removeLeadSnapshot() {
    this.lead && this.lead.snapshot && (this.lead.snapshot = void 0);
  }
}
const Ht = { hasAnimatedSinceResize: true, hasEverUpdated: false }, Yt = ["", "X", "Y", "Z"], ka = 1e3;
let La = 0;
function Gt(t, e, s, n) {
  const { latestValues: i } = e;
  i[t] && (s[t] = i[t], e.setStaticValue(t, 0), n && (n[t] = 0));
}
function ui(t) {
  if (t.hasCheckedOptimisedAppear = true, t.root === t) return;
  const { visualElement: e } = t.options;
  if (!e) return;
  const s = Bn(e);
  if (window.MotionHasOptimisedAnimation(s, "transform")) {
    const { layout: i, layoutId: o } = t.options;
    window.MotionCancelOptimisedAnimation(s, "transform", B, !(i || o));
  }
  const { parent: n } = t;
  n && !n.hasCheckedOptimisedAppear && ui(n);
}
function hi({ attachResizeListener: t, defaultParent: e, measureScroll: s, checkIsScrollRoot: n, resetTransform: i }) {
  return class {
    constructor(r = {}, a = e == null ? void 0 : e()) {
      this.id = La++, this.animationId = 0, this.animationCommitId = 0, this.children = /* @__PURE__ */ new Set(), this.options = {}, this.isTreeAnimating = false, this.isAnimationBlocked = false, this.isLayoutDirty = false, this.isProjectionDirty = false, this.isSharedProjectionDirty = false, this.isTransformDirty = false, this.updateManuallyBlocked = false, this.updateBlockedByResize = false, this.isUpdating = false, this.isSVG = false, this.needsReset = false, this.shouldResetTransform = false, this.hasCheckedOptimisedAppear = false, this.treeScale = { x: 1, y: 1 }, this.eventHandlers = /* @__PURE__ */ new Map(), this.hasTreeAnimated = false, this.layoutVersion = 0, this.updateScheduled = false, this.scheduleUpdate = () => this.update(), this.projectionUpdateScheduled = false, this.checkUpdateFailed = () => {
        this.isUpdating && (this.isUpdating = false, this.clearAllSnapshots());
      }, this.updateProjection = () => {
        this.projectionUpdateScheduled = false, this.nodes.forEach(Oa), this.nodes.forEach(Ka), this.nodes.forEach(Wa), this.nodes.forEach(ja);
      }, this.resolvedRelativeTargetAt = 0, this.linkedParentVersion = 0, this.hasProjected = false, this.isVisible = true, this.animationProgress = 0, this.sharedNodes = /* @__PURE__ */ new Map(), this.latestValues = r, this.root = a ? a.root || a : this, this.path = a ? [...a.path, a] : [], this.parent = a, this.depth = a ? a.depth + 1 : 0;
      for (let l = 0; l < this.path.length; l++) this.path[l].shouldResetTransform = true;
      this.root === this && (this.nodes = new Ca());
    }
    addEventListener(r, a) {
      return this.eventHandlers.has(r) || this.eventHandlers.set(r, new be()), this.eventHandlers.get(r).add(a);
    }
    notifyListeners(r, ...a) {
      const l = this.eventHandlers.get(r);
      l && l.notify(...a);
    }
    hasListeners(r) {
      return this.eventHandlers.has(r);
    }
    mount(r) {
      if (this.instance) return;
      this.isSVG = Ie(r) && !Fo(r), this.instance = r;
      const { layoutId: a, layout: l, visualElement: c } = this.options;
      if (c && !c.current && c.mount(r), this.root.nodes.add(this), this.parent && this.parent.children.add(this), this.root.hasTreeAnimated && (l || a) && (this.isLayoutDirty = true), t) {
        let u, h = 0;
        const f = () => this.root.updateBlockedByResize = false;
        B.read(() => {
          h = window.innerWidth;
        }), t(r, () => {
          const d = window.innerWidth;
          d !== h && (h = d, this.root.updateBlockedByResize = true, u && u(), u = Ea(f, 250), Ht.hasAnimatedSinceResize && (Ht.hasAnimatedSinceResize = false, this.nodes.forEach(js)));
        });
      }
      a && this.root.registerSharedNode(a, this), this.options.animate !== false && c && (a || l) && this.addEventListener("didUpdate", ({ delta: u, hasLayoutChanged: h, hasRelativeLayoutChanged: f, layout: d }) => {
        if (this.isTreeAnimationBlocked()) {
          this.target = void 0, this.relativeTarget = void 0;
          return;
        }
        const m = this.options.transition || c.getDefaultTransition() || Ha, { onLayoutAnimationStart: x, onLayoutAnimationComplete: T } = c.getProps(), g = !this.targetLayout || !ai(this.targetLayout, d), b = !h && f;
        if (this.options.layoutRoot || this.resumeFrom || b || h && (g || !this.currentAnimation)) {
          this.resumeFrom && (this.resumingFrom = this.resumeFrom, this.resumingFrom.resumingFrom = void 0);
          const y = { ...ke(m, "layout"), onPlay: x, onComplete: T };
          (c.shouldReduceMotion || this.options.layoutRoot) && (y.delay = 0, y.type = false), this.startAnimation(y), this.setAnimationOrigin(u, b);
        } else h || js(this), this.isLead() && this.options.onExitComplete && this.options.onExitComplete();
        this.targetLayout = d;
      });
    }
    unmount() {
      this.options.layoutId && this.willUpdate(), this.root.nodes.remove(this);
      const r = this.getStack();
      r && r.remove(this), this.parent && this.parent.children.delete(this), this.instance = void 0, this.eventHandlers.clear(), st(this.updateProjection);
    }
    blockUpdate() {
      this.updateManuallyBlocked = true;
    }
    unblockUpdate() {
      this.updateManuallyBlocked = false;
    }
    isUpdateBlocked() {
      return this.updateManuallyBlocked || this.updateBlockedByResize;
    }
    isTreeAnimationBlocked() {
      return this.isAnimationBlocked || this.parent && this.parent.isTreeAnimationBlocked() || false;
    }
    startUpdate() {
      this.isUpdateBlocked() || (this.isUpdating = true, this.nodes && this.nodes.forEach($a), this.animationId++);
    }
    getTransformTemplate() {
      const { visualElement: r } = this.options;
      return r && r.getProps().transformTemplate;
    }
    willUpdate(r = true) {
      if (this.root.hasTreeAnimated = true, this.root.isUpdateBlocked()) {
        this.options.onExitComplete && this.options.onExitComplete();
        return;
      }
      if (window.MotionCancelOptimisedAnimation && !this.hasCheckedOptimisedAppear && ui(this), !this.root.isUpdating && this.root.startUpdate(), this.isLayoutDirty) return;
      this.isLayoutDirty = true;
      for (let u = 0; u < this.path.length; u++) {
        const h = this.path[u];
        h.shouldResetTransform = true, h.updateScroll("snapshot"), h.options.layoutRoot && h.willUpdate(false);
      }
      const { layoutId: a, layout: l } = this.options;
      if (a === void 0 && !l) return;
      const c = this.getTransformTemplate();
      this.prevTransformTemplateValue = c ? c(this.latestValues, "") : void 0, this.updateSnapshot(), r && this.notifyListeners("willUpdate");
    }
    update() {
      if (this.updateScheduled = false, this.isUpdateBlocked()) {
        this.unblockUpdate(), this.clearAllSnapshots(), this.nodes.forEach(Is);
        return;
      }
      if (this.animationId <= this.animationCommitId) {
        this.nodes.forEach(Os);
        return;
      }
      this.animationCommitId = this.animationId, this.isUpdating ? (this.isUpdating = false, this.nodes.forEach(Ua), this.nodes.forEach(Fa), this.nodes.forEach(Ia)) : this.nodes.forEach(Os), this.clearAllSnapshots();
      const a = k.now();
      E.delta = z(0, 1e3 / 60, a - E.timestamp), E.timestamp = a, E.isProcessing = true, jt.update.process(E), jt.preRender.process(E), jt.render.process(E), E.isProcessing = false;
    }
    didUpdate() {
      this.updateScheduled || (this.updateScheduled = true, Un.read(this.scheduleUpdate));
    }
    clearAllSnapshots() {
      this.nodes.forEach(Na), this.sharedNodes.forEach(za);
    }
    scheduleUpdateProjection() {
      this.projectionUpdateScheduled || (this.projectionUpdateScheduled = true, B.preRender(this.updateProjection, false, true));
    }
    scheduleCheckAfterUnmount() {
      B.postRender(() => {
        this.isLayoutDirty ? this.root.didUpdate() : this.root.checkUpdateFailed();
      });
    }
    updateSnapshot() {
      this.snapshot || !this.instance || (this.snapshot = this.measure(), this.snapshot && !j(this.snapshot.measuredBox.x) && !j(this.snapshot.measuredBox.y) && (this.snapshot = void 0));
    }
    updateLayout() {
      if (!this.instance || (this.updateScroll(), !(this.options.alwaysMeasureLayout && this.isLead()) && !this.isLayoutDirty)) return;
      if (this.resumeFrom && !this.resumeFrom.instance) for (let l = 0; l < this.path.length; l++) this.path[l].updateScroll();
      const r = this.layout;
      this.layout = this.measure(false), this.layoutVersion++, this.layoutCorrected = R(), this.isLayoutDirty = false, this.projectionDelta = void 0, this.notifyListeners("measure", this.layout.layoutBox);
      const { visualElement: a } = this.options;
      a && a.notify("LayoutMeasure", this.layout.layoutBox, r ? r.layoutBox : void 0);
    }
    updateScroll(r = "measure") {
      let a = !!(this.options.layoutScroll && this.instance);
      if (this.scroll && this.scroll.animationId === this.root.animationId && this.scroll.phase === r && (a = false), a && this.instance) {
        const l = n(this.instance);
        this.scroll = { animationId: this.root.animationId, phase: r, isRoot: l, offset: s(this.instance), wasRoot: this.scroll ? this.scroll.isRoot : l };
      }
    }
    resetTransform() {
      if (!i) return;
      const r = this.isLayoutDirty || this.shouldResetTransform || this.options.alwaysMeasureLayout, a = this.projectionDelta && !oi(this.projectionDelta), l = this.getTransformTemplate(), c = l ? l(this.latestValues, "") : void 0, u = c !== this.prevTransformTemplateValue;
      r && this.instance && (a || J(this.latestValues) || u) && (i(this.instance, c), this.shouldResetTransform = false, this.scheduleRender());
    }
    measure(r = true) {
      const a = this.measurePageBox();
      let l = this.removeElementScroll(a);
      return r && (l = this.removeTransform(l)), Ya(l), { animationId: this.root.animationId, measuredBox: a, layoutBox: l, latestValues: {}, source: this.id };
    }
    measurePageBox() {
      var _a2;
      const { visualElement: r } = this.options;
      if (!r) return R();
      const a = r.measureViewportBox();
      if (!(((_a2 = this.scroll) == null ? void 0 : _a2.wasRoot) || this.path.some(Ga))) {
        const { scroll: c } = this.root;
        c && (lt(a.x, c.offset.x), lt(a.y, c.offset.y));
      }
      return a;
    }
    removeElementScroll(r) {
      var _a2;
      const a = R();
      if (N(a, r), (_a2 = this.scroll) == null ? void 0 : _a2.wasRoot) return a;
      for (let l = 0; l < this.path.length; l++) {
        const c = this.path[l], { scroll: u, options: h } = c;
        c !== this.root && u && h.layoutScroll && (u.wasRoot && N(a, r), lt(a.x, u.offset.x), lt(a.y, u.offset.y));
      }
      return a;
    }
    applyTransform(r, a = false) {
      const l = R();
      N(l, r);
      for (let c = 0; c < this.path.length; c++) {
        const u = this.path[c];
        !a && u.options.layoutScroll && u.scroll && u !== u.root && ct(l, { x: -u.scroll.offset.x, y: -u.scroll.offset.y }), J(u.latestValues) && ct(l, u.latestValues);
      }
      return J(this.latestValues) && ct(l, this.latestValues), l;
    }
    removeTransform(r) {
      const a = R();
      N(a, r);
      for (let l = 0; l < this.path.length; l++) {
        const c = this.path[l];
        if (!c.instance || !J(c.latestValues)) continue;
        de(c.latestValues) && c.updateSnapshot();
        const u = R(), h = c.measurePageBox();
        N(u, h), Ps(a, c.latestValues, c.snapshot ? c.snapshot.layoutBox : void 0, u);
      }
      return J(this.latestValues) && Ps(a, this.latestValues), a;
    }
    setTargetDelta(r) {
      this.targetDelta = r, this.root.scheduleUpdateProjection(), this.isProjectionDirty = true;
    }
    setOptions(r) {
      this.options = { ...this.options, ...r, crossfade: r.crossfade !== void 0 ? r.crossfade : true };
    }
    clearMeasurements() {
      this.scroll = void 0, this.layout = void 0, this.snapshot = void 0, this.prevTransformTemplateValue = void 0, this.targetDelta = void 0, this.target = void 0, this.isLayoutDirty = false;
    }
    forceRelativeParentToResolveTarget() {
      this.relativeParent && this.relativeParent.resolvedRelativeTargetAt !== E.timestamp && this.relativeParent.resolveTargetDelta(true);
    }
    resolveTargetDelta(r = false) {
      var _a2;
      const a = this.getLead();
      this.isProjectionDirty || (this.isProjectionDirty = a.isProjectionDirty), this.isTransformDirty || (this.isTransformDirty = a.isTransformDirty), this.isSharedProjectionDirty || (this.isSharedProjectionDirty = a.isSharedProjectionDirty);
      const l = !!this.resumingFrom || this !== a;
      if (!(r || l && this.isSharedProjectionDirty || this.isProjectionDirty || ((_a2 = this.parent) == null ? void 0 : _a2.isProjectionDirty) || this.attemptToResolveRelativeTarget || this.root.updateBlockedByResize)) return;
      const { layout: u, layoutId: h } = this.options;
      if (!this.layout || !(u || h)) return;
      this.resolvedRelativeTargetAt = E.timestamp;
      const f = this.getClosestProjectingParent();
      f && this.linkedParentVersion !== f.layoutVersion && !f.options.layoutRoot && this.removeRelativeTarget(), !this.targetDelta && !this.relativeTarget && (f && f.layout ? this.createRelativeTarget(f, this.layout.layoutBox, f.layout.layoutBox) : this.removeRelativeTarget()), !(!this.relativeTarget && !this.targetDelta) && (this.target || (this.target = R(), this.targetWithTransforms = R()), this.relativeTarget && this.relativeTargetOrigin && this.relativeParent && this.relativeParent.target ? (this.forceRelativeParentToResolveTarget(), ga(this.target, this.relativeTarget, this.relativeParent.target)) : this.targetDelta ? (this.resumingFrom ? this.target = this.applyTransform(this.layout.layoutBox) : N(this.target, this.layout.layoutBox), qn(this.target, this.targetDelta)) : N(this.target, this.layout.layoutBox), this.attemptToResolveRelativeTarget && (this.attemptToResolveRelativeTarget = false, f && !!f.resumingFrom == !!this.resumingFrom && !f.options.layoutScroll && f.target && this.animationProgress !== 1 ? this.createRelativeTarget(f, this.target, f.target) : this.relativeParent = this.relativeTarget = void 0));
    }
    getClosestProjectingParent() {
      if (!(!this.parent || de(this.parent.latestValues) || Gn(this.parent.latestValues))) return this.parent.isProjecting() ? this.parent : this.parent.getClosestProjectingParent();
    }
    isProjecting() {
      return !!((this.relativeTarget || this.targetDelta || this.options.layoutRoot) && this.layout);
    }
    createRelativeTarget(r, a, l) {
      this.relativeParent = r, this.linkedParentVersion = r.layoutVersion, this.forceRelativeParentToResolveTarget(), this.relativeTarget = R(), this.relativeTargetOrigin = R(), Ot(this.relativeTargetOrigin, a, l), N(this.relativeTarget, this.relativeTargetOrigin);
    }
    removeRelativeTarget() {
      this.relativeParent = this.relativeTarget = void 0;
    }
    calcProjection() {
      var _a2;
      const r = this.getLead(), a = !!this.resumingFrom || this !== r;
      let l = true;
      if ((this.isProjectionDirty || ((_a2 = this.parent) == null ? void 0 : _a2.isProjectionDirty)) && (l = false), a && (this.isSharedProjectionDirty || this.isTransformDirty) && (l = false), this.resolvedRelativeTargetAt === E.timestamp && (l = false), l) return;
      const { layout: c, layoutId: u } = this.options;
      if (this.isTreeAnimating = !!(this.parent && this.parent.isTreeAnimating || this.currentAnimation || this.pendingAnimation), this.isTreeAnimating || (this.targetDelta = this.relativeTarget = void 0), !this.layout || !(c || u)) return;
      N(this.layoutCorrected, this.layout.layoutBox);
      const h = this.treeScale.x, f = this.treeScale.y;
      _o(this.layoutCorrected, this.treeScale, this.path, a), r.layout && !r.target && (this.treeScale.x !== 1 || this.treeScale.y !== 1) && (r.target = r.layout.layoutBox, r.targetWithTransforms = R());
      const { target: d } = r;
      if (!d) {
        this.prevProjectionDelta && (this.createProjectionDeltas(), this.scheduleRender());
        return;
      }
      !this.projectionDelta || !this.prevProjectionDelta ? this.createProjectionDeltas() : (xs(this.prevProjectionDelta.x, this.projectionDelta.x), xs(this.prevProjectionDelta.y, this.projectionDelta.y)), vt(this.projectionDelta, this.layoutCorrected, d, this.latestValues), (this.treeScale.x !== h || this.treeScale.y !== f || !Es(this.projectionDelta.x, this.prevProjectionDelta.x) || !Es(this.projectionDelta.y, this.prevProjectionDelta.y)) && (this.hasProjected = true, this.scheduleRender(), this.notifyListeners("projectionUpdate", d));
    }
    hide() {
      this.isVisible = false;
    }
    show() {
      this.isVisible = true;
    }
    scheduleRender(r = true) {
      var _a2;
      if ((_a2 = this.options.visualElement) == null ? void 0 : _a2.scheduleRender(), r) {
        const a = this.getStack();
        a && a.scheduleRender();
      }
      this.resumingFrom && !this.resumingFrom.instance && (this.resumingFrom = void 0);
    }
    createProjectionDeltas() {
      this.prevProjectionDelta = at(), this.projectionDelta = at(), this.projectionDeltaWithTransform = at();
    }
    setAnimationOrigin(r, a = false) {
      const l = this.snapshot, c = l ? l.latestValues : {}, u = { ...this.latestValues }, h = at();
      (!this.relativeParent || !this.relativeParent.options.layoutRoot) && (this.relativeTarget = this.relativeTargetOrigin = void 0), this.attemptToResolveRelativeTarget = !a;
      const f = R(), d = l ? l.source : void 0, m = this.layout ? this.layout.source : void 0, x = d !== m, T = this.getStack(), g = !T || T.members.length <= 1, b = !!(x && !g && this.options.crossfade === true && !this.path.some(_a));
      this.animationProgress = 0;
      let y;
      this.mixTargetDelta = (S) => {
        const v = S / 1e3;
        Ns(h.x, r.x, v), Ns(h.y, r.y, v), this.setTargetDelta(h), this.relativeTarget && this.relativeTargetOrigin && this.layout && this.relativeParent && this.relativeParent.layout && (Ot(f, this.layout.layoutBox, this.relativeParent.layout.layoutBox), Xa(this.relativeTarget, this.relativeTargetOrigin, f, v), y && ba(this.relativeTarget, y) && (this.isProjectionDirty = false), y || (y = R()), N(y, this.relativeTarget)), x && (this.animationValues = u, Va(u, c, this.latestValues, v, b, g)), this.root.scheduleUpdateProjection(), this.scheduleRender(), this.animationProgress = v;
      }, this.mixTargetDelta(this.options.layoutRoot ? 1e3 : 0);
    }
    startAnimation(r) {
      var _a2, _b, _c;
      this.notifyListeners("animationStart"), (_a2 = this.currentAnimation) == null ? void 0 : _a2.stop(), (_c = (_b = this.resumingFrom) == null ? void 0 : _b.currentAnimation) == null ? void 0 : _c.stop(), this.pendingAnimation && (st(this.pendingAnimation), this.pendingAnimation = void 0), this.pendingAnimation = B.update(() => {
        Ht.hasAnimatedSinceResize = true, this.motionValue || (this.motionValue = ht(0)), this.currentAnimation = Da(this.motionValue, [0, 1e3], { ...r, velocity: 0, isSync: true, onUpdate: (a) => {
          this.mixTargetDelta(a), r.onUpdate && r.onUpdate(a);
        }, onStop: () => {
        }, onComplete: () => {
          r.onComplete && r.onComplete(), this.completeAnimation();
        } }), this.resumingFrom && (this.resumingFrom.currentAnimation = this.currentAnimation), this.pendingAnimation = void 0;
      });
    }
    completeAnimation() {
      this.resumingFrom && (this.resumingFrom.currentAnimation = void 0, this.resumingFrom.preserveOpacity = void 0);
      const r = this.getStack();
      r && r.exitAnimationComplete(), this.resumingFrom = this.currentAnimation = this.animationValues = void 0, this.notifyListeners("animationComplete");
    }
    finishAnimation() {
      this.currentAnimation && (this.mixTargetDelta && this.mixTargetDelta(ka), this.currentAnimation.stop()), this.completeAnimation();
    }
    applyTransformsToTarget() {
      const r = this.getLead();
      let { targetWithTransforms: a, target: l, layout: c, latestValues: u } = r;
      if (!(!a || !l || !c)) {
        if (this !== r && this.layout && c && fi(this.options.animationType, this.layout.layoutBox, c.layoutBox)) {
          l = this.target || R();
          const h = j(this.layout.layoutBox.x);
          l.x.min = r.target.x.min, l.x.max = l.x.min + h;
          const f = j(this.layout.layoutBox.y);
          l.y.min = r.target.y.min, l.y.max = l.y.min + f;
        }
        N(a, l), ct(a, u), vt(this.projectionDeltaWithTransform, this.layoutCorrected, a, u);
      }
    }
    registerSharedNode(r, a) {
      this.sharedNodes.has(r) || this.sharedNodes.set(r, new Ba()), this.sharedNodes.get(r).add(a);
      const c = a.options.initialPromotionConfig;
      a.promote({ transition: c ? c.transition : void 0, preserveFollowOpacity: c && c.shouldPreserveFollowOpacity ? c.shouldPreserveFollowOpacity(a) : void 0 });
    }
    isLead() {
      const r = this.getStack();
      return r ? r.lead === this : true;
    }
    getLead() {
      var _a2;
      const { layoutId: r } = this.options;
      return r ? ((_a2 = this.getStack()) == null ? void 0 : _a2.lead) || this : this;
    }
    getPrevLead() {
      var _a2;
      const { layoutId: r } = this.options;
      return r ? (_a2 = this.getStack()) == null ? void 0 : _a2.prevLead : void 0;
    }
    getStack() {
      const { layoutId: r } = this.options;
      if (r) return this.root.sharedNodes.get(r);
    }
    promote({ needsReset: r, transition: a, preserveFollowOpacity: l } = {}) {
      const c = this.getStack();
      c && c.promote(this, l), r && (this.projectionDelta = void 0, this.needsReset = true), a && this.setOptions({ transition: a });
    }
    relegate() {
      const r = this.getStack();
      return r ? r.relegate(this) : false;
    }
    resetSkewAndRotation() {
      const { visualElement: r } = this.options;
      if (!r) return;
      let a = false;
      const { latestValues: l } = r;
      if ((l.z || l.rotate || l.rotateX || l.rotateY || l.rotateZ || l.skewX || l.skewY) && (a = true), !a) return;
      const c = {};
      l.z && Gt("z", r, c, this.animationValues);
      for (let u = 0; u < Yt.length; u++) Gt(`rotate${Yt[u]}`, r, c, this.animationValues), Gt(`skew${Yt[u]}`, r, c, this.animationValues);
      r.render();
      for (const u in c) r.setStaticValue(u, c[u]), this.animationValues && (this.animationValues[u] = c[u]);
      r.scheduleRender();
    }
    applyProjectionStyles(r, a) {
      if (!this.instance || this.isSVG) return;
      if (!this.isVisible) {
        r.visibility = "hidden";
        return;
      }
      const l = this.getTransformTemplate();
      if (this.needsReset) {
        this.needsReset = false, r.visibility = "", r.opacity = "", r.pointerEvents = _t(a == null ? void 0 : a.pointerEvents) || "", r.transform = l ? l(this.latestValues, "") : "none";
        return;
      }
      const c = this.getLead();
      if (!this.projectionDelta || !this.layout || !c.target) {
        this.options.layoutId && (r.opacity = this.latestValues.opacity !== void 0 ? this.latestValues.opacity : 1, r.pointerEvents = _t(a == null ? void 0 : a.pointerEvents) || ""), this.hasProjected && !J(this.latestValues) && (r.transform = l ? l({}, "") : "none", this.hasProjected = false);
        return;
      }
      r.visibility = "";
      const u = c.animationValues || c.latestValues;
      this.applyTransformsToTarget();
      let h = Aa(this.projectionDeltaWithTransform, this.treeScale, u);
      l && (h = l(u, h)), r.transform = h;
      const { x: f, y: d } = this.projectionDelta;
      r.transformOrigin = `${f.origin * 100}% ${d.origin * 100}% 0`, c.animationValues ? r.opacity = c === this ? u.opacity ?? this.latestValues.opacity ?? 1 : this.preserveOpacity ? this.latestValues.opacity : u.opacityExit : r.opacity = c === this ? u.opacity !== void 0 ? u.opacity : "" : u.opacityExit !== void 0 ? u.opacityExit : 0;
      for (const m in me) {
        if (u[m] === void 0) continue;
        const { correct: x, applyTo: T, isCSSVariable: g } = me[m], b = h === "none" ? u[m] : x(u[m], c);
        if (T) {
          const y = T.length;
          for (let S = 0; S < y; S++) r[T[S]] = b;
        } else g ? this.options.visualElement.renderState.vars[m] = b : r[m] = b;
      }
      this.options.layoutId && (r.pointerEvents = c === this ? _t(a == null ? void 0 : a.pointerEvents) || "" : "none");
    }
    clearSnapshot() {
      this.resumeFrom = this.snapshot = void 0;
    }
    resetTree() {
      this.root.nodes.forEach((r) => {
        var _a2;
        return (_a2 = r.currentAnimation) == null ? void 0 : _a2.stop();
      }), this.root.nodes.forEach(Is), this.root.sharedNodes.clear();
    }
  };
}
function Fa(t) {
  t.updateLayout();
}
function Ia(t) {
  var _a2;
  const e = ((_a2 = t.resumeFrom) == null ? void 0 : _a2.snapshot) || t.snapshot;
  if (t.isLead() && t.layout && e && t.hasListeners("didUpdate")) {
    const { layoutBox: s, measuredBox: n } = t.layout, { animationType: i } = t.options, o = e.source !== t.layout.source;
    i === "size" ? Bs((u) => {
      const h = o ? e.measuredBox[u] : e.layoutBox[u], f = j(h);
      h.min = s[u].min, h.max = h.min + f;
    }) : fi(i, e.layoutBox, s) && Bs((u) => {
      const h = o ? e.measuredBox[u] : e.layoutBox[u], f = j(s[u]);
      h.max = h.min + f, t.relativeTarget && !t.currentAnimation && (t.isProjectionDirty = true, t.relativeTarget[u].max = t.relativeTarget[u].min + f);
    });
    const r = at();
    vt(r, s, e.layoutBox);
    const a = at();
    o ? vt(a, t.applyTransform(n, true), e.measuredBox) : vt(a, s, e.layoutBox);
    const l = !oi(r);
    let c = false;
    if (!t.resumeFrom) {
      const u = t.getClosestProjectingParent();
      if (u && !u.resumeFrom) {
        const { snapshot: h, layout: f } = u;
        if (h && f) {
          const d = R();
          Ot(d, e.layoutBox, h.layoutBox);
          const m = R();
          Ot(m, s, f.layoutBox), ai(d, m) || (c = true), u.options.layoutRoot && (t.relativeTarget = m, t.relativeTargetOrigin = d, t.relativeParent = u);
        }
      }
    }
    t.notifyListeners("didUpdate", { layout: s, snapshot: e, delta: a, layoutDelta: r, hasLayoutChanged: l, hasRelativeLayoutChanged: c });
  } else if (t.isLead()) {
    const { onExitComplete: s } = t.options;
    s && s();
  }
  t.options.transition = void 0;
}
function Oa(t) {
  t.parent && (t.isProjecting() || (t.isProjectionDirty = t.parent.isProjectionDirty), t.isSharedProjectionDirty || (t.isSharedProjectionDirty = !!(t.isProjectionDirty || t.parent.isProjectionDirty || t.parent.isSharedProjectionDirty)), t.isTransformDirty || (t.isTransformDirty = t.parent.isTransformDirty));
}
function ja(t) {
  t.isProjectionDirty = t.isSharedProjectionDirty = t.isTransformDirty = false;
}
function Na(t) {
  t.clearSnapshot();
}
function Is(t) {
  t.clearMeasurements();
}
function Os(t) {
  t.isLayoutDirty = false;
}
function Ua(t) {
  const { visualElement: e } = t.options;
  e && e.getProps().onBeforeLayoutMeasure && e.notify("BeforeLayoutMeasure"), t.resetTransform();
}
function js(t) {
  t.finishAnimation(), t.targetDelta = t.relativeTarget = t.target = void 0, t.isProjectionDirty = true;
}
function Ka(t) {
  t.resolveTargetDelta();
}
function Wa(t) {
  t.calcProjection();
}
function $a(t) {
  t.resetSkewAndRotation();
}
function za(t) {
  t.removeLeadSnapshot();
}
function Ns(t, e, s) {
  t.translate = M(e.translate, 0, s), t.scale = M(e.scale, 1, s), t.origin = e.origin, t.originPoint = e.originPoint;
}
function Us(t, e, s, n) {
  t.min = M(e.min, s.min, n), t.max = M(e.max, s.max, n);
}
function Xa(t, e, s, n) {
  Us(t.x, e.x, s.x, n), Us(t.y, e.y, s.y, n);
}
function _a(t) {
  return t.animationValues && t.animationValues.opacityExit !== void 0;
}
const Ha = { duration: 0.45, ease: [0.4, 0, 0.1, 1] }, Ks = (t) => typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().includes(t), Ws = Ks("applewebkit/") && !Ks("chrome/") ? Math.round : G;
function $s(t) {
  t.min = Ws(t.min), t.max = Ws(t.max);
}
function Ya(t) {
  $s(t.x), $s(t.y);
}
function fi(t, e, s) {
  return t === "position" || t === "preserve-aspect" && !ya(Cs(e), Cs(s), 0.2);
}
function Ga(t) {
  var _a2;
  return t !== t.root && ((_a2 = t.scroll) == null ? void 0 : _a2.wasRoot);
}
const qa = hi({ attachResizeListener: (t, e) => Ma(t, "resize", e), measureScroll: () => {
  var _a2, _b;
  return { x: document.documentElement.scrollLeft || ((_a2 = document.body) == null ? void 0 : _a2.scrollLeft) || 0, y: document.documentElement.scrollTop || ((_b = document.body) == null ? void 0 : _b.scrollTop) || 0 };
}, checkIsScrollRoot: () => true }), qt = { current: void 0 }, fl = hi({ measureScroll: (t) => ({ x: t.scrollLeft, y: t.scrollTop }), defaultParent: () => {
  if (!qt.current) {
    const t = new qa({});
    t.mount(window), t.setOptions({ layoutScroll: true }), qt.current = t;
  }
  return qt.current;
}, resetTransform: (t, e) => {
  t.style.transform = e !== void 0 ? e : "none";
}, checkIsScrollRoot: (t) => window.getComputedStyle(t).position === "fixed" }), zs = (t, e) => Math.abs(t - e);
function dl(t, e) {
  const s = zs(t.x, e.x), n = zs(t.y, e.y);
  return Math.sqrt(s ** 2 + n ** 2);
}
export {
  K as A,
  M as B,
  j as C,
  xe as D,
  z as E,
  rl as F,
  R as G,
  ll as H,
  Bs as I,
  al as J,
  ol as K,
  zo as L,
  so as M,
  Rn as N,
  Ja as O,
  sl as P,
  $ as Q,
  tl as R,
  cl as S,
  G as T,
  Un as U,
  Ht as V,
  fl as W,
  Qa as X,
  el as Y,
  _n as a,
  Oe as b,
  F as c,
  Zo as d,
  Jn as e,
  na as f,
  il as g,
  ia as h,
  xo as i,
  No as j,
  Xn as k,
  Cn as l,
  ti as m,
  oa as n,
  io as o,
  ul as p,
  Ao as q,
  _t as r,
  nl as s,
  Ma as t,
  dl as u,
  E as v,
  B as w,
  ve as x,
  st as y,
  W as z
};
