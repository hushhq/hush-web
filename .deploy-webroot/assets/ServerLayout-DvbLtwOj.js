const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/index-BefR8mbE.js","assets/vendor-react-2AhYlJPv.js","assets/index-IC3OECdo.css"])))=>i.map(i=>d[i]);
import { I as Ca, J as ka, u as Gn, d as Lr, K as Na, j as n, L as Ea, M as ks, N as Ma, O as Ra, P as Da, o as ln, h as _e, Q as La, R as Ia, S as _a, T as Aa, U as Ir, V as _r, W as Ar, F as Ns, X as Ta, Y as ps, Z as Zn, _ as Oa, $ as Pa, a0 as Ba, a1 as $a, a2 as Ua, a3 as Gt, a4 as Ws, a5 as Tr, q as st, a6 as Lt, a7 as Fa, a8 as Ct, a9 as it, aa as Ga, ab as Wa, ac as za, ad as Ka, ae as Es, af as zs, ag as Or, H as Ha, ah as Va, ai as Ya, aj as qa, ak as Xa, al as Pr, am as Br, an as Ja, ao as Qa, ap as Za, aq as ei, ar as ti, as as ni, at as si, au as ri, av as ai, aw as ii, ax as oi, ay as ci, az as $r, aA as li, aB as es, aC as ts, s as di, aD as ui, aE as fi, aF as tn, aG as hi, b as mi, aH as ns, aI as pi, aJ as nn, aK as gi, aL as vi, aM as yi, __tla as __tla_0 } from "./index-BefR8mbE.js";
import { r as a, e as ke, a as Ve, u as Ms, f as bi } from "./vendor-react-2AhYlJPv.js";
import { c as xi, C as gs, S as wi, a as Ks, T as sn, u as Si, e as ji, g as Ci, m as ki, b as Ni, Q as Ei, D as Hs, V as Mi, l as ss, p as Ri, d as Vs, r as Di, j as Li, f as Ii, h as _i, __tla as __tla_1 } from "./Chat-DEDH4du2.js";
import { S as Ai, M as ot, i as Ys, D as Ti } from "./constants-AlQXj8D-.js";
import { A as Oi, m as Pi } from "./proxy-BXOaFASF.js";
import { u as Bi, B as $i } from "./useBodyScrollMode-D02fsC65.js";
import "./vendor-motion-ws7o_Bh2.js";
let vd;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })(),
  (() => {
    try {
      return __tla_1;
    } catch {
    }
  })()
]).then(async () => {
  function Ui() {
    for (var e = arguments.length, t = new Array(e), s = 0; s < e; s++) t[s] = arguments[s];
    return a.useMemo(() => (r) => {
      t.forEach((i) => i(r));
    }, t);
  }
  const Wn = typeof window < "u" && typeof window.document < "u" && typeof window.document.createElement < "u";
  function Vt(e) {
    const t = Object.prototype.toString.call(e);
    return t === "[object Window]" || t === "[object global]";
  }
  function Rs(e) {
    return "nodeType" in e;
  }
  function Ye(e) {
    var t, s;
    return e ? Vt(e) ? e : Rs(e) && (t = (s = e.ownerDocument) == null ? void 0 : s.defaultView) != null ? t : window : window;
  }
  function Ds(e) {
    const { Document: t } = Ye(e);
    return e instanceof t;
  }
  function mn(e) {
    return Vt(e) ? false : e instanceof Ye(e).HTMLElement;
  }
  function Ur(e) {
    return e instanceof Ye(e).SVGElement;
  }
  function Yt(e) {
    return e ? Vt(e) ? e.document : Rs(e) ? Ds(e) ? e : mn(e) || Ur(e) ? e.ownerDocument : document : document : document;
  }
  const ct = Wn ? a.useLayoutEffect : a.useEffect;
  function zn(e) {
    const t = a.useRef(e);
    return ct(() => {
      t.current = e;
    }), a.useCallback(function() {
      for (var s = arguments.length, r = new Array(s), i = 0; i < s; i++) r[i] = arguments[i];
      return t.current == null ? void 0 : t.current(...r);
    }, []);
  }
  function Fi() {
    const e = a.useRef(null), t = a.useCallback((r, i) => {
      e.current = setInterval(r, i);
    }, []), s = a.useCallback(() => {
      e.current !== null && (clearInterval(e.current), e.current = null);
    }, []);
    return [
      t,
      s
    ];
  }
  function dn(e, t) {
    t === void 0 && (t = [
      e
    ]);
    const s = a.useRef(e);
    return ct(() => {
      s.current !== e && (s.current = e);
    }, t), s;
  }
  function pn(e, t) {
    const s = a.useRef();
    return a.useMemo(() => {
      const r = e(s.current);
      return s.current = r, r;
    }, [
      ...t
    ]);
  }
  function Tn(e) {
    const t = zn(e), s = a.useRef(null), r = a.useCallback((i) => {
      i !== s.current && (t == null ? void 0 : t(i, s.current)), s.current = i;
    }, []);
    return [
      s,
      r
    ];
  }
  function On(e) {
    const t = a.useRef();
    return a.useEffect(() => {
      t.current = e;
    }, [
      e
    ]), t.current;
  }
  let rs = {};
  function gn(e, t) {
    return a.useMemo(() => {
      if (t) return t;
      const s = rs[e] == null ? 0 : rs[e] + 1;
      return rs[e] = s, e + "-" + s;
    }, [
      e,
      t
    ]);
  }
  function Fr(e) {
    return function(t) {
      for (var s = arguments.length, r = new Array(s > 1 ? s - 1 : 0), i = 1; i < s; i++) r[i - 1] = arguments[i];
      return r.reduce((o, c) => {
        const l = Object.entries(c);
        for (const [d, u] of l) {
          const f = o[d];
          f != null && (o[d] = f + e * u);
        }
        return o;
      }, {
        ...t
      });
    };
  }
  const Wt = Fr(1), un = Fr(-1);
  function Gi(e) {
    return "clientX" in e && "clientY" in e;
  }
  function Kn(e) {
    if (!e) return false;
    const { KeyboardEvent: t } = Ye(e.target);
    return t && e instanceof t;
  }
  function Wi(e) {
    if (!e) return false;
    const { TouchEvent: t } = Ye(e.target);
    return t && e instanceof t;
  }
  function Pn(e) {
    if (Wi(e)) {
      if (e.touches && e.touches.length) {
        const { clientX: t, clientY: s } = e.touches[0];
        return {
          x: t,
          y: s
        };
      } else if (e.changedTouches && e.changedTouches.length) {
        const { clientX: t, clientY: s } = e.changedTouches[0];
        return {
          x: t,
          y: s
        };
      }
    }
    return Gi(e) ? {
      x: e.clientX,
      y: e.clientY
    } : null;
  }
  const yt = Object.freeze({
    Translate: {
      toString(e) {
        if (!e) return;
        const { x: t, y: s } = e;
        return "translate3d(" + (t ? Math.round(t) : 0) + "px, " + (s ? Math.round(s) : 0) + "px, 0)";
      }
    },
    Scale: {
      toString(e) {
        if (!e) return;
        const { scaleX: t, scaleY: s } = e;
        return "scaleX(" + t + ") scaleY(" + s + ")";
      }
    },
    Transform: {
      toString(e) {
        if (e) return [
          yt.Translate.toString(e),
          yt.Scale.toString(e)
        ].join(" ");
      }
    },
    Transition: {
      toString(e) {
        let { property: t, duration: s, easing: r } = e;
        return t + " " + s + "ms " + r;
      }
    }
  }), qs = "a,frame,iframe,input:not([type=hidden]):not(:disabled),select:not(:disabled),textarea:not(:disabled),button:not(:disabled),*[tabindex]";
  function zi(e) {
    return e.matches(qs) ? e : e.querySelector(qs);
  }
  const Ki = {
    display: "none"
  };
  function Hi(e) {
    let { id: t, value: s } = e;
    return ke.createElement("div", {
      id: t,
      style: Ki
    }, s);
  }
  function Vi(e) {
    let { id: t, announcement: s, ariaLiveType: r = "assertive" } = e;
    const i = {
      position: "fixed",
      top: 0,
      left: 0,
      width: 1,
      height: 1,
      margin: -1,
      border: 0,
      padding: 0,
      overflow: "hidden",
      clip: "rect(0 0 0 0)",
      clipPath: "inset(100%)",
      whiteSpace: "nowrap"
    };
    return ke.createElement("div", {
      id: t,
      style: i,
      role: "status",
      "aria-live": r,
      "aria-atomic": true
    }, s);
  }
  function Yi() {
    const [e, t] = a.useState("");
    return {
      announce: a.useCallback((r) => {
        r != null && t(r);
      }, []),
      announcement: e
    };
  }
  const Gr = a.createContext(null);
  function qi(e) {
    const t = a.useContext(Gr);
    a.useEffect(() => {
      if (!t) throw new Error("useDndMonitor must be used within a children of <DndContext>");
      return t(e);
    }, [
      e,
      t
    ]);
  }
  function Xi() {
    const [e] = a.useState(() => /* @__PURE__ */ new Set()), t = a.useCallback((r) => (e.add(r), () => e.delete(r)), [
      e
    ]);
    return [
      a.useCallback((r) => {
        let { type: i, event: o } = r;
        e.forEach((c) => {
          var l;
          return (l = c[i]) == null ? void 0 : l.call(c, o);
        });
      }, [
        e
      ]),
      t
    ];
  }
  const Ji = {
    draggable: `
    To pick up a draggable item, press the space bar.
    While dragging, use the arrow keys to move the item.
    Press space again to drop the item in its new position, or press escape to cancel.
  `
  }, Qi = {
    onDragStart(e) {
      let { active: t } = e;
      return "Picked up draggable item " + t.id + ".";
    },
    onDragOver(e) {
      let { active: t, over: s } = e;
      return s ? "Draggable item " + t.id + " was moved over droppable area " + s.id + "." : "Draggable item " + t.id + " is no longer over a droppable area.";
    },
    onDragEnd(e) {
      let { active: t, over: s } = e;
      return s ? "Draggable item " + t.id + " was dropped over droppable area " + s.id : "Draggable item " + t.id + " was dropped.";
    },
    onDragCancel(e) {
      let { active: t } = e;
      return "Dragging was cancelled. Draggable item " + t.id + " was dropped.";
    }
  };
  function Zi(e) {
    let { announcements: t = Qi, container: s, hiddenTextDescribedById: r, screenReaderInstructions: i = Ji } = e;
    const { announce: o, announcement: c } = Yi(), l = gn("DndLiveRegion"), [d, u] = a.useState(false);
    if (a.useEffect(() => {
      u(true);
    }, []), qi(a.useMemo(() => ({
      onDragStart(h) {
        let { active: y } = h;
        o(t.onDragStart({
          active: y
        }));
      },
      onDragMove(h) {
        let { active: y, over: p } = h;
        t.onDragMove && o(t.onDragMove({
          active: y,
          over: p
        }));
      },
      onDragOver(h) {
        let { active: y, over: p } = h;
        o(t.onDragOver({
          active: y,
          over: p
        }));
      },
      onDragEnd(h) {
        let { active: y, over: p } = h;
        o(t.onDragEnd({
          active: y,
          over: p
        }));
      },
      onDragCancel(h) {
        let { active: y, over: p } = h;
        o(t.onDragCancel({
          active: y,
          over: p
        }));
      }
    }), [
      o,
      t
    ])), !d) return null;
    const f = ke.createElement(ke.Fragment, null, ke.createElement(Hi, {
      id: r,
      value: i.draggable
    }), ke.createElement(Vi, {
      id: l,
      announcement: c
    }));
    return s ? Ve.createPortal(f, s) : f;
  }
  var Oe;
  (function(e) {
    e.DragStart = "dragStart", e.DragMove = "dragMove", e.DragEnd = "dragEnd", e.DragCancel = "dragCancel", e.DragOver = "dragOver", e.RegisterDroppable = "registerDroppable", e.SetDroppableDisabled = "setDroppableDisabled", e.UnregisterDroppable = "unregisterDroppable";
  })(Oe || (Oe = {}));
  function Bn() {
  }
  function vs(e, t) {
    return a.useMemo(() => ({
      sensor: e,
      options: t ?? {}
    }), [
      e,
      t
    ]);
  }
  function Wr() {
    for (var e = arguments.length, t = new Array(e), s = 0; s < e; s++) t[s] = arguments[s];
    return a.useMemo(() => [
      ...t
    ].filter((r) => r != null), [
      ...t
    ]);
  }
  const lt = Object.freeze({
    x: 0,
    y: 0
  });
  function Ls(e, t) {
    return Math.sqrt(Math.pow(e.x - t.x, 2) + Math.pow(e.y - t.y, 2));
  }
  function eo(e, t) {
    const s = Pn(e);
    if (!s) return "0 0";
    const r = {
      x: (s.x - t.left) / t.width * 100,
      y: (s.y - t.top) / t.height * 100
    };
    return r.x + "% " + r.y + "%";
  }
  function Is(e, t) {
    let { data: { value: s } } = e, { data: { value: r } } = t;
    return s - r;
  }
  function to(e, t) {
    let { data: { value: s } } = e, { data: { value: r } } = t;
    return r - s;
  }
  function ys(e) {
    let { left: t, top: s, height: r, width: i } = e;
    return [
      {
        x: t,
        y: s
      },
      {
        x: t + i,
        y: s
      },
      {
        x: t,
        y: s + r
      },
      {
        x: t + i,
        y: s + r
      }
    ];
  }
  function zr(e, t) {
    if (!e || e.length === 0) return null;
    const [s] = e;
    return s[t];
  }
  function Xs(e, t, s) {
    return t === void 0 && (t = e.left), s === void 0 && (s = e.top), {
      x: t + e.width * 0.5,
      y: s + e.height * 0.5
    };
  }
  const bs = (e) => {
    let { collisionRect: t, droppableRects: s, droppableContainers: r } = e;
    const i = Xs(t, t.left, t.top), o = [];
    for (const c of r) {
      const { id: l } = c, d = s.get(l);
      if (d) {
        const u = Ls(Xs(d), i);
        o.push({
          id: l,
          data: {
            droppableContainer: c,
            value: u
          }
        });
      }
    }
    return o.sort(Is);
  }, no = (e) => {
    let { collisionRect: t, droppableRects: s, droppableContainers: r } = e;
    const i = ys(t), o = [];
    for (const c of r) {
      const { id: l } = c, d = s.get(l);
      if (d) {
        const u = ys(d), f = i.reduce((y, p, S) => y + Ls(u[S], p), 0), h = Number((f / 4).toFixed(4));
        o.push({
          id: l,
          data: {
            droppableContainer: c,
            value: h
          }
        });
      }
    }
    return o.sort(Is);
  };
  function so(e, t) {
    const s = Math.max(t.top, e.top), r = Math.max(t.left, e.left), i = Math.min(t.left + t.width, e.left + e.width), o = Math.min(t.top + t.height, e.top + e.height), c = i - r, l = o - s;
    if (r < i && s < o) {
      const d = t.width * t.height, u = e.width * e.height, f = c * l, h = f / (d + u - f);
      return Number(h.toFixed(4));
    }
    return 0;
  }
  const Kr = (e) => {
    let { collisionRect: t, droppableRects: s, droppableContainers: r } = e;
    const i = [];
    for (const o of r) {
      const { id: c } = o, l = s.get(c);
      if (l) {
        const d = so(l, t);
        d > 0 && i.push({
          id: c,
          data: {
            droppableContainer: o,
            value: d
          }
        });
      }
    }
    return i.sort(to);
  };
  function ro(e, t) {
    const { top: s, left: r, bottom: i, right: o } = t;
    return s <= e.y && e.y <= i && r <= e.x && e.x <= o;
  }
  const Js = (e) => {
    let { droppableContainers: t, droppableRects: s, pointerCoordinates: r } = e;
    if (!r) return [];
    const i = [];
    for (const o of t) {
      const { id: c } = o, l = s.get(c);
      if (l && ro(r, l)) {
        const u = ys(l).reduce((h, y) => h + Ls(r, y), 0), f = Number((u / 4).toFixed(4));
        i.push({
          id: c,
          data: {
            droppableContainer: o,
            value: f
          }
        });
      }
    }
    return i.sort(Is);
  };
  function ao(e, t, s) {
    return {
      ...e,
      scaleX: t && s ? t.width / s.width : 1,
      scaleY: t && s ? t.height / s.height : 1
    };
  }
  function Hr(e, t) {
    return e && t ? {
      x: e.left - t.left,
      y: e.top - t.top
    } : lt;
  }
  function io(e) {
    return function(s) {
      for (var r = arguments.length, i = new Array(r > 1 ? r - 1 : 0), o = 1; o < r; o++) i[o - 1] = arguments[o];
      return i.reduce((c, l) => ({
        ...c,
        top: c.top + e * l.y,
        bottom: c.bottom + e * l.y,
        left: c.left + e * l.x,
        right: c.right + e * l.x
      }), {
        ...s
      });
    };
  }
  const oo = io(1);
  function Vr(e) {
    if (e.startsWith("matrix3d(")) {
      const t = e.slice(9, -1).split(/, /);
      return {
        x: +t[12],
        y: +t[13],
        scaleX: +t[0],
        scaleY: +t[5]
      };
    } else if (e.startsWith("matrix(")) {
      const t = e.slice(7, -1).split(/, /);
      return {
        x: +t[4],
        y: +t[5],
        scaleX: +t[0],
        scaleY: +t[3]
      };
    }
    return null;
  }
  function co(e, t, s) {
    const r = Vr(t);
    if (!r) return e;
    const { scaleX: i, scaleY: o, x: c, y: l } = r, d = e.left - c - (1 - i) * parseFloat(s), u = e.top - l - (1 - o) * parseFloat(s.slice(s.indexOf(" ") + 1)), f = i ? e.width / i : e.width, h = o ? e.height / o : e.height;
    return {
      width: f,
      height: h,
      top: u,
      right: d + f,
      bottom: u + h,
      left: d
    };
  }
  const lo = {
    ignoreTransform: false
  };
  function qt(e, t) {
    t === void 0 && (t = lo);
    let s = e.getBoundingClientRect();
    if (t.ignoreTransform) {
      const { transform: u, transformOrigin: f } = Ye(e).getComputedStyle(e);
      u && (s = co(s, u, f));
    }
    const { top: r, left: i, width: o, height: c, bottom: l, right: d } = s;
    return {
      top: r,
      left: i,
      width: o,
      height: c,
      bottom: l,
      right: d
    };
  }
  function Qs(e) {
    return qt(e, {
      ignoreTransform: true
    });
  }
  function uo(e) {
    const t = e.innerWidth, s = e.innerHeight;
    return {
      top: 0,
      left: 0,
      right: t,
      bottom: s,
      width: t,
      height: s
    };
  }
  function fo(e, t) {
    return t === void 0 && (t = Ye(e).getComputedStyle(e)), t.position === "fixed";
  }
  function ho(e, t) {
    t === void 0 && (t = Ye(e).getComputedStyle(e));
    const s = /(auto|scroll|overlay)/;
    return [
      "overflow",
      "overflowX",
      "overflowY"
    ].some((i) => {
      const o = t[i];
      return typeof o == "string" ? s.test(o) : false;
    });
  }
  function Hn(e, t) {
    const s = [];
    function r(i) {
      if (t != null && s.length >= t || !i) return s;
      if (Ds(i) && i.scrollingElement != null && !s.includes(i.scrollingElement)) return s.push(i.scrollingElement), s;
      if (!mn(i) || Ur(i) || s.includes(i)) return s;
      const o = Ye(e).getComputedStyle(i);
      return i !== e && ho(i, o) && s.push(i), fo(i, o) ? s : r(i.parentNode);
    }
    return e ? r(e) : s;
  }
  function Yr(e) {
    const [t] = Hn(e, 1);
    return t ?? null;
  }
  function as(e) {
    return !Wn || !e ? null : Vt(e) ? e : Rs(e) ? Ds(e) || e === Yt(e).scrollingElement ? window : mn(e) ? e : null : null;
  }
  function qr(e) {
    return Vt(e) ? e.scrollX : e.scrollLeft;
  }
  function Xr(e) {
    return Vt(e) ? e.scrollY : e.scrollTop;
  }
  function xs(e) {
    return {
      x: qr(e),
      y: Xr(e)
    };
  }
  var Ue;
  (function(e) {
    e[e.Forward = 1] = "Forward", e[e.Backward = -1] = "Backward";
  })(Ue || (Ue = {}));
  function Jr(e) {
    return !Wn || !e ? false : e === document.scrollingElement;
  }
  function Qr(e) {
    const t = {
      x: 0,
      y: 0
    }, s = Jr(e) ? {
      height: window.innerHeight,
      width: window.innerWidth
    } : {
      height: e.clientHeight,
      width: e.clientWidth
    }, r = {
      x: e.scrollWidth - s.width,
      y: e.scrollHeight - s.height
    }, i = e.scrollTop <= t.y, o = e.scrollLeft <= t.x, c = e.scrollTop >= r.y, l = e.scrollLeft >= r.x;
    return {
      isTop: i,
      isLeft: o,
      isBottom: c,
      isRight: l,
      maxScroll: r,
      minScroll: t
    };
  }
  const mo = {
    x: 0.2,
    y: 0.2
  };
  function po(e, t, s, r, i) {
    let { top: o, left: c, right: l, bottom: d } = s;
    r === void 0 && (r = 10), i === void 0 && (i = mo);
    const { isTop: u, isBottom: f, isLeft: h, isRight: y } = Qr(e), p = {
      x: 0,
      y: 0
    }, S = {
      x: 0,
      y: 0
    }, j = {
      height: t.height * i.y,
      width: t.width * i.x
    };
    return !u && o <= t.top + j.height ? (p.y = Ue.Backward, S.y = r * Math.abs((t.top + j.height - o) / j.height)) : !f && d >= t.bottom - j.height && (p.y = Ue.Forward, S.y = r * Math.abs((t.bottom - j.height - d) / j.height)), !y && l >= t.right - j.width ? (p.x = Ue.Forward, S.x = r * Math.abs((t.right - j.width - l) / j.width)) : !h && c <= t.left + j.width && (p.x = Ue.Backward, S.x = r * Math.abs((t.left + j.width - c) / j.width)), {
      direction: p,
      speed: S
    };
  }
  function go(e) {
    if (e === document.scrollingElement) {
      const { innerWidth: o, innerHeight: c } = window;
      return {
        top: 0,
        left: 0,
        right: o,
        bottom: c,
        width: o,
        height: c
      };
    }
    const { top: t, left: s, right: r, bottom: i } = e.getBoundingClientRect();
    return {
      top: t,
      left: s,
      right: r,
      bottom: i,
      width: e.clientWidth,
      height: e.clientHeight
    };
  }
  function Zr(e) {
    return e.reduce((t, s) => Wt(t, xs(s)), lt);
  }
  function vo(e) {
    return e.reduce((t, s) => t + qr(s), 0);
  }
  function yo(e) {
    return e.reduce((t, s) => t + Xr(s), 0);
  }
  function ea(e, t) {
    if (t === void 0 && (t = qt), !e) return;
    const { top: s, left: r, bottom: i, right: o } = t(e);
    Yr(e) && (i <= 0 || o <= 0 || s >= window.innerHeight || r >= window.innerWidth) && e.scrollIntoView({
      block: "center",
      inline: "center"
    });
  }
  const bo = [
    [
      "x",
      [
        "left",
        "right"
      ],
      vo
    ],
    [
      "y",
      [
        "top",
        "bottom"
      ],
      yo
    ]
  ];
  class _s {
    constructor(t, s) {
      this.rect = void 0, this.width = void 0, this.height = void 0, this.top = void 0, this.bottom = void 0, this.right = void 0, this.left = void 0;
      const r = Hn(s), i = Zr(r);
      this.rect = {
        ...t
      }, this.width = t.width, this.height = t.height;
      for (const [o, c, l] of bo) for (const d of c) Object.defineProperty(this, d, {
        get: () => {
          const u = l(r), f = i[o] - u;
          return this.rect[d] + f;
        },
        enumerable: true
      });
      Object.defineProperty(this, "rect", {
        enumerable: false
      });
    }
  }
  class rn {
    constructor(t) {
      this.target = void 0, this.listeners = [], this.removeAll = () => {
        this.listeners.forEach((s) => {
          var r;
          return (r = this.target) == null ? void 0 : r.removeEventListener(...s);
        });
      }, this.target = t;
    }
    add(t, s, r) {
      var i;
      (i = this.target) == null || i.addEventListener(t, s, r), this.listeners.push([
        t,
        s,
        r
      ]);
    }
  }
  function xo(e) {
    const { EventTarget: t } = Ye(e);
    return e instanceof t ? e : Yt(e);
  }
  function is(e, t) {
    const s = Math.abs(e.x), r = Math.abs(e.y);
    return typeof t == "number" ? Math.sqrt(s ** 2 + r ** 2) > t : "x" in t && "y" in t ? s > t.x && r > t.y : "x" in t ? s > t.x : "y" in t ? r > t.y : false;
  }
  var rt;
  (function(e) {
    e.Click = "click", e.DragStart = "dragstart", e.Keydown = "keydown", e.ContextMenu = "contextmenu", e.Resize = "resize", e.SelectionChange = "selectionchange", e.VisibilityChange = "visibilitychange";
  })(rt || (rt = {}));
  function Zs(e) {
    e.preventDefault();
  }
  function wo(e) {
    e.stopPropagation();
  }
  var se;
  (function(e) {
    e.Space = "Space", e.Down = "ArrowDown", e.Right = "ArrowRight", e.Left = "ArrowLeft", e.Up = "ArrowUp", e.Esc = "Escape", e.Enter = "Enter", e.Tab = "Tab";
  })(se || (se = {}));
  const ta = {
    start: [
      se.Space,
      se.Enter
    ],
    cancel: [
      se.Esc
    ],
    end: [
      se.Space,
      se.Enter,
      se.Tab
    ]
  }, So = (e, t) => {
    let { currentCoordinates: s } = t;
    switch (e.code) {
      case se.Right:
        return {
          ...s,
          x: s.x + 25
        };
      case se.Left:
        return {
          ...s,
          x: s.x - 25
        };
      case se.Down:
        return {
          ...s,
          y: s.y + 25
        };
      case se.Up:
        return {
          ...s,
          y: s.y - 25
        };
    }
  };
  class As {
    constructor(t) {
      this.props = void 0, this.autoScrollEnabled = false, this.referenceCoordinates = void 0, this.listeners = void 0, this.windowListeners = void 0, this.props = t;
      const { event: { target: s } } = t;
      this.props = t, this.listeners = new rn(Yt(s)), this.windowListeners = new rn(Ye(s)), this.handleKeyDown = this.handleKeyDown.bind(this), this.handleCancel = this.handleCancel.bind(this), this.attach();
    }
    attach() {
      this.handleStart(), this.windowListeners.add(rt.Resize, this.handleCancel), this.windowListeners.add(rt.VisibilityChange, this.handleCancel), setTimeout(() => this.listeners.add(rt.Keydown, this.handleKeyDown));
    }
    handleStart() {
      const { activeNode: t, onStart: s } = this.props, r = t.node.current;
      r && ea(r), s(lt);
    }
    handleKeyDown(t) {
      if (Kn(t)) {
        const { active: s, context: r, options: i } = this.props, { keyboardCodes: o = ta, coordinateGetter: c = So, scrollBehavior: l = "smooth" } = i, { code: d } = t;
        if (o.end.includes(d)) {
          this.handleEnd(t);
          return;
        }
        if (o.cancel.includes(d)) {
          this.handleCancel(t);
          return;
        }
        const { collisionRect: u } = r.current, f = u ? {
          x: u.left,
          y: u.top
        } : lt;
        this.referenceCoordinates || (this.referenceCoordinates = f);
        const h = c(t, {
          active: s,
          context: r.current,
          currentCoordinates: f
        });
        if (h) {
          const y = un(h, f), p = {
            x: 0,
            y: 0
          }, { scrollableAncestors: S } = r.current;
          for (const j of S) {
            const k = t.code, { isTop: D, isRight: N, isLeft: M, isBottom: g, maxScroll: w, minScroll: m } = Qr(j), C = go(j), L = {
              x: Math.min(k === se.Right ? C.right - C.width / 2 : C.right, Math.max(k === se.Right ? C.left : C.left + C.width / 2, h.x)),
              y: Math.min(k === se.Down ? C.bottom - C.height / 2 : C.bottom, Math.max(k === se.Down ? C.top : C.top + C.height / 2, h.y))
            }, A = k === se.Right && !N || k === se.Left && !M, x = k === se.Down && !g || k === se.Up && !D;
            if (A && L.x !== h.x) {
              const I = j.scrollLeft + y.x, U = k === se.Right && I <= w.x || k === se.Left && I >= m.x;
              if (U && !y.y) {
                j.scrollTo({
                  left: I,
                  behavior: l
                });
                return;
              }
              U ? p.x = j.scrollLeft - I : p.x = k === se.Right ? j.scrollLeft - w.x : j.scrollLeft - m.x, p.x && j.scrollBy({
                left: -p.x,
                behavior: l
              });
              break;
            } else if (x && L.y !== h.y) {
              const I = j.scrollTop + y.y, U = k === se.Down && I <= w.y || k === se.Up && I >= m.y;
              if (U && !y.x) {
                j.scrollTo({
                  top: I,
                  behavior: l
                });
                return;
              }
              U ? p.y = j.scrollTop - I : p.y = k === se.Down ? j.scrollTop - w.y : j.scrollTop - m.y, p.y && j.scrollBy({
                top: -p.y,
                behavior: l
              });
              break;
            }
          }
          this.handleMove(t, Wt(un(h, this.referenceCoordinates), p));
        }
      }
    }
    handleMove(t, s) {
      const { onMove: r } = this.props;
      t.preventDefault(), r(s);
    }
    handleEnd(t) {
      const { onEnd: s } = this.props;
      t.preventDefault(), this.detach(), s();
    }
    handleCancel(t) {
      const { onCancel: s } = this.props;
      t.preventDefault(), this.detach(), s();
    }
    detach() {
      this.listeners.removeAll(), this.windowListeners.removeAll();
    }
  }
  As.activators = [
    {
      eventName: "onKeyDown",
      handler: (e, t, s) => {
        let { keyboardCodes: r = ta, onActivation: i } = t, { active: o } = s;
        const { code: c } = e.nativeEvent;
        if (r.start.includes(c)) {
          const l = o.activatorNode.current;
          return l && e.target !== l ? false : (e.preventDefault(), i == null ? void 0 : i({
            event: e.nativeEvent
          }), true);
        }
        return false;
      }
    }
  ];
  function er(e) {
    return !!(e && "distance" in e);
  }
  function tr(e) {
    return !!(e && "delay" in e);
  }
  class Ts {
    constructor(t, s, r) {
      var i;
      r === void 0 && (r = xo(t.event.target)), this.props = void 0, this.events = void 0, this.autoScrollEnabled = true, this.document = void 0, this.activated = false, this.initialCoordinates = void 0, this.timeoutId = null, this.listeners = void 0, this.documentListeners = void 0, this.windowListeners = void 0, this.props = t, this.events = s;
      const { event: o } = t, { target: c } = o;
      this.props = t, this.events = s, this.document = Yt(c), this.documentListeners = new rn(this.document), this.listeners = new rn(r), this.windowListeners = new rn(Ye(c)), this.initialCoordinates = (i = Pn(o)) != null ? i : lt, this.handleStart = this.handleStart.bind(this), this.handleMove = this.handleMove.bind(this), this.handleEnd = this.handleEnd.bind(this), this.handleCancel = this.handleCancel.bind(this), this.handleKeydown = this.handleKeydown.bind(this), this.removeTextSelection = this.removeTextSelection.bind(this), this.attach();
    }
    attach() {
      const { events: t, props: { options: { activationConstraint: s, bypassActivationConstraint: r } } } = this;
      if (this.listeners.add(t.move.name, this.handleMove, {
        passive: false
      }), this.listeners.add(t.end.name, this.handleEnd), t.cancel && this.listeners.add(t.cancel.name, this.handleCancel), this.windowListeners.add(rt.Resize, this.handleCancel), this.windowListeners.add(rt.DragStart, Zs), this.windowListeners.add(rt.VisibilityChange, this.handleCancel), this.windowListeners.add(rt.ContextMenu, Zs), this.documentListeners.add(rt.Keydown, this.handleKeydown), s) {
        if (r != null && r({
          event: this.props.event,
          activeNode: this.props.activeNode,
          options: this.props.options
        })) return this.handleStart();
        if (tr(s)) {
          this.timeoutId = setTimeout(this.handleStart, s.delay), this.handlePending(s);
          return;
        }
        if (er(s)) {
          this.handlePending(s);
          return;
        }
      }
      this.handleStart();
    }
    detach() {
      this.listeners.removeAll(), this.windowListeners.removeAll(), setTimeout(this.documentListeners.removeAll, 50), this.timeoutId !== null && (clearTimeout(this.timeoutId), this.timeoutId = null);
    }
    handlePending(t, s) {
      const { active: r, onPending: i } = this.props;
      i(r, t, this.initialCoordinates, s);
    }
    handleStart() {
      const { initialCoordinates: t } = this, { onStart: s } = this.props;
      t && (this.activated = true, this.documentListeners.add(rt.Click, wo, {
        capture: true
      }), this.removeTextSelection(), this.documentListeners.add(rt.SelectionChange, this.removeTextSelection), s(t));
    }
    handleMove(t) {
      var s;
      const { activated: r, initialCoordinates: i, props: o } = this, { onMove: c, options: { activationConstraint: l } } = o;
      if (!i) return;
      const d = (s = Pn(t)) != null ? s : lt, u = un(i, d);
      if (!r && l) {
        if (er(l)) {
          if (l.tolerance != null && is(u, l.tolerance)) return this.handleCancel();
          if (is(u, l.distance)) return this.handleStart();
        }
        if (tr(l) && is(u, l.tolerance)) return this.handleCancel();
        this.handlePending(l, u);
        return;
      }
      t.cancelable && t.preventDefault(), c(d);
    }
    handleEnd() {
      const { onAbort: t, onEnd: s } = this.props;
      this.detach(), this.activated || t(this.props.active), s();
    }
    handleCancel() {
      const { onAbort: t, onCancel: s } = this.props;
      this.detach(), this.activated || t(this.props.active), s();
    }
    handleKeydown(t) {
      t.code === se.Esc && this.handleCancel();
    }
    removeTextSelection() {
      var t;
      (t = this.document.getSelection()) == null || t.removeAllRanges();
    }
  }
  const jo = {
    cancel: {
      name: "pointercancel"
    },
    move: {
      name: "pointermove"
    },
    end: {
      name: "pointerup"
    }
  };
  class Vn extends Ts {
    constructor(t) {
      const { event: s } = t, r = Yt(s.target);
      super(t, jo, r);
    }
  }
  Vn.activators = [
    {
      eventName: "onPointerDown",
      handler: (e, t) => {
        let { nativeEvent: s } = e, { onActivation: r } = t;
        return !s.isPrimary || s.button !== 0 ? false : (r == null ? void 0 : r({
          event: s
        }), true);
      }
    }
  ];
  const Co = {
    move: {
      name: "mousemove"
    },
    end: {
      name: "mouseup"
    }
  };
  var ws;
  (function(e) {
    e[e.RightClick = 2] = "RightClick";
  })(ws || (ws = {}));
  class ko extends Ts {
    constructor(t) {
      super(t, Co, Yt(t.event.target));
    }
  }
  ko.activators = [
    {
      eventName: "onMouseDown",
      handler: (e, t) => {
        let { nativeEvent: s } = e, { onActivation: r } = t;
        return s.button === ws.RightClick ? false : (r == null ? void 0 : r({
          event: s
        }), true);
      }
    }
  ];
  const os = {
    cancel: {
      name: "touchcancel"
    },
    move: {
      name: "touchmove"
    },
    end: {
      name: "touchend"
    }
  };
  class No extends Ts {
    constructor(t) {
      super(t, os);
    }
    static setup() {
      return window.addEventListener(os.move.name, t, {
        capture: false,
        passive: false
      }), function() {
        window.removeEventListener(os.move.name, t);
      };
      function t() {
      }
    }
  }
  No.activators = [
    {
      eventName: "onTouchStart",
      handler: (e, t) => {
        let { nativeEvent: s } = e, { onActivation: r } = t;
        const { touches: i } = s;
        return i.length > 1 ? false : (r == null ? void 0 : r({
          event: s
        }), true);
      }
    }
  ];
  var an;
  (function(e) {
    e[e.Pointer = 0] = "Pointer", e[e.DraggableRect = 1] = "DraggableRect";
  })(an || (an = {}));
  var $n;
  (function(e) {
    e[e.TreeOrder = 0] = "TreeOrder", e[e.ReversedTreeOrder = 1] = "ReversedTreeOrder";
  })($n || ($n = {}));
  function Eo(e) {
    let { acceleration: t, activator: s = an.Pointer, canScroll: r, draggingRect: i, enabled: o, interval: c = 5, order: l = $n.TreeOrder, pointerCoordinates: d, scrollableAncestors: u, scrollableAncestorRects: f, delta: h, threshold: y } = e;
    const p = Ro({
      delta: h,
      disabled: !o
    }), [S, j] = Fi(), k = a.useRef({
      x: 0,
      y: 0
    }), D = a.useRef({
      x: 0,
      y: 0
    }), N = a.useMemo(() => {
      switch (s) {
        case an.Pointer:
          return d ? {
            top: d.y,
            bottom: d.y,
            left: d.x,
            right: d.x
          } : null;
        case an.DraggableRect:
          return i;
      }
    }, [
      s,
      i,
      d
    ]), M = a.useRef(null), g = a.useCallback(() => {
      const m = M.current;
      if (!m) return;
      const C = k.current.x * D.current.x, L = k.current.y * D.current.y;
      m.scrollBy(C, L);
    }, []), w = a.useMemo(() => l === $n.TreeOrder ? [
      ...u
    ].reverse() : u, [
      l,
      u
    ]);
    a.useEffect(() => {
      if (!o || !u.length || !N) {
        j();
        return;
      }
      for (const m of w) {
        if ((r == null ? void 0 : r(m)) === false) continue;
        const C = u.indexOf(m), L = f[C];
        if (!L) continue;
        const { direction: A, speed: x } = po(m, L, N, t, y);
        for (const I of [
          "x",
          "y"
        ]) p[I][A[I]] || (x[I] = 0, A[I] = 0);
        if (x.x > 0 || x.y > 0) {
          j(), M.current = m, S(g, c), k.current = x, D.current = A;
          return;
        }
      }
      k.current = {
        x: 0,
        y: 0
      }, D.current = {
        x: 0,
        y: 0
      }, j();
    }, [
      t,
      g,
      r,
      j,
      o,
      c,
      JSON.stringify(N),
      JSON.stringify(p),
      S,
      u,
      w,
      f,
      JSON.stringify(y)
    ]);
  }
  const Mo = {
    x: {
      [Ue.Backward]: false,
      [Ue.Forward]: false
    },
    y: {
      [Ue.Backward]: false,
      [Ue.Forward]: false
    }
  };
  function Ro(e) {
    let { delta: t, disabled: s } = e;
    const r = On(t);
    return pn((i) => {
      if (s || !r || !i) return Mo;
      const o = {
        x: Math.sign(t.x - r.x),
        y: Math.sign(t.y - r.y)
      };
      return {
        x: {
          [Ue.Backward]: i.x[Ue.Backward] || o.x === -1,
          [Ue.Forward]: i.x[Ue.Forward] || o.x === 1
        },
        y: {
          [Ue.Backward]: i.y[Ue.Backward] || o.y === -1,
          [Ue.Forward]: i.y[Ue.Forward] || o.y === 1
        }
      };
    }, [
      s,
      t,
      r
    ]);
  }
  function Do(e, t) {
    const s = t != null ? e.get(t) : void 0, r = s ? s.node.current : null;
    return pn((i) => {
      var o;
      return t == null ? null : (o = r ?? i) != null ? o : null;
    }, [
      r,
      t
    ]);
  }
  function Lo(e, t) {
    return a.useMemo(() => e.reduce((s, r) => {
      const { sensor: i } = r, o = i.activators.map((c) => ({
        eventName: c.eventName,
        handler: t(c.handler, r)
      }));
      return [
        ...s,
        ...o
      ];
    }, []), [
      e,
      t
    ]);
  }
  var fn;
  (function(e) {
    e[e.Always = 0] = "Always", e[e.BeforeDragging = 1] = "BeforeDragging", e[e.WhileDragging = 2] = "WhileDragging";
  })(fn || (fn = {}));
  var Ss;
  (function(e) {
    e.Optimized = "optimized";
  })(Ss || (Ss = {}));
  const nr = /* @__PURE__ */ new Map();
  function Io(e, t) {
    let { dragging: s, dependencies: r, config: i } = t;
    const [o, c] = a.useState(null), { frequency: l, measure: d, strategy: u } = i, f = a.useRef(e), h = k(), y = dn(h), p = a.useCallback(function(D) {
      D === void 0 && (D = []), !y.current && c((N) => N === null ? D : N.concat(D.filter((M) => !N.includes(M))));
    }, [
      y
    ]), S = a.useRef(null), j = pn((D) => {
      if (h && !s) return nr;
      if (!D || D === nr || f.current !== e || o != null) {
        const N = /* @__PURE__ */ new Map();
        for (let M of e) {
          if (!M) continue;
          if (o && o.length > 0 && !o.includes(M.id) && M.rect.current) {
            N.set(M.id, M.rect.current);
            continue;
          }
          const g = M.node.current, w = g ? new _s(d(g), g) : null;
          M.rect.current = w, w && N.set(M.id, w);
        }
        return N;
      }
      return D;
    }, [
      e,
      o,
      s,
      h,
      d
    ]);
    return a.useEffect(() => {
      f.current = e;
    }, [
      e
    ]), a.useEffect(() => {
      h || p();
    }, [
      s,
      h
    ]), a.useEffect(() => {
      o && o.length > 0 && c(null);
    }, [
      JSON.stringify(o)
    ]), a.useEffect(() => {
      h || typeof l != "number" || S.current !== null || (S.current = setTimeout(() => {
        p(), S.current = null;
      }, l));
    }, [
      l,
      h,
      p,
      ...r
    ]), {
      droppableRects: j,
      measureDroppableContainers: p,
      measuringScheduled: o != null
    };
    function k() {
      switch (u) {
        case fn.Always:
          return false;
        case fn.BeforeDragging:
          return s;
        default:
          return !s;
      }
    }
  }
  function Os(e, t) {
    return pn((s) => e ? s || (typeof t == "function" ? t(e) : e) : null, [
      t,
      e
    ]);
  }
  function _o(e, t) {
    return Os(e, t);
  }
  function Ao(e) {
    let { callback: t, disabled: s } = e;
    const r = zn(t), i = a.useMemo(() => {
      if (s || typeof window > "u" || typeof window.MutationObserver > "u") return;
      const { MutationObserver: o } = window;
      return new o(r);
    }, [
      r,
      s
    ]);
    return a.useEffect(() => () => i == null ? void 0 : i.disconnect(), [
      i
    ]), i;
  }
  function Yn(e) {
    let { callback: t, disabled: s } = e;
    const r = zn(t), i = a.useMemo(() => {
      if (s || typeof window > "u" || typeof window.ResizeObserver > "u") return;
      const { ResizeObserver: o } = window;
      return new o(r);
    }, [
      s
    ]);
    return a.useEffect(() => () => i == null ? void 0 : i.disconnect(), [
      i
    ]), i;
  }
  function To(e) {
    return new _s(qt(e), e);
  }
  function sr(e, t, s) {
    t === void 0 && (t = To);
    const [r, i] = a.useState(null);
    function o() {
      i((d) => {
        if (!e) return null;
        if (e.isConnected === false) {
          var u;
          return (u = d ?? s) != null ? u : null;
        }
        const f = t(e);
        return JSON.stringify(d) === JSON.stringify(f) ? d : f;
      });
    }
    const c = Ao({
      callback(d) {
        if (e) for (const u of d) {
          const { type: f, target: h } = u;
          if (f === "childList" && h instanceof HTMLElement && h.contains(e)) {
            o();
            break;
          }
        }
      }
    }), l = Yn({
      callback: o
    });
    return ct(() => {
      o(), e ? (l == null ? void 0 : l.observe(e), c == null ? void 0 : c.observe(document.body, {
        childList: true,
        subtree: true
      })) : (l == null ? void 0 : l.disconnect(), c == null ? void 0 : c.disconnect());
    }, [
      e
    ]), r;
  }
  function Oo(e) {
    const t = Os(e);
    return Hr(e, t);
  }
  const rr = [];
  function Po(e) {
    const t = a.useRef(e), s = pn((r) => e ? r && r !== rr && e && t.current && e.parentNode === t.current.parentNode ? r : Hn(e) : rr, [
      e
    ]);
    return a.useEffect(() => {
      t.current = e;
    }, [
      e
    ]), s;
  }
  function Bo(e) {
    const [t, s] = a.useState(null), r = a.useRef(e), i = a.useCallback((o) => {
      const c = as(o.target);
      c && s((l) => l ? (l.set(c, xs(c)), new Map(l)) : null);
    }, []);
    return a.useEffect(() => {
      const o = r.current;
      if (e !== o) {
        c(o);
        const l = e.map((d) => {
          const u = as(d);
          return u ? (u.addEventListener("scroll", i, {
            passive: true
          }), [
            u,
            xs(u)
          ]) : null;
        }).filter((d) => d != null);
        s(l.length ? new Map(l) : null), r.current = e;
      }
      return () => {
        c(e), c(o);
      };
      function c(l) {
        l.forEach((d) => {
          const u = as(d);
          u == null ? void 0 : u.removeEventListener("scroll", i);
        });
      }
    }, [
      i,
      e
    ]), a.useMemo(() => e.length ? t ? Array.from(t.values()).reduce((o, c) => Wt(o, c), lt) : Zr(e) : lt, [
      e,
      t
    ]);
  }
  function ar(e, t) {
    t === void 0 && (t = []);
    const s = a.useRef(null);
    return a.useEffect(() => {
      s.current = null;
    }, t), a.useEffect(() => {
      const r = e !== lt;
      r && !s.current && (s.current = e), !r && s.current && (s.current = null);
    }, [
      e
    ]), s.current ? un(e, s.current) : lt;
  }
  function $o(e) {
    a.useEffect(() => {
      if (!Wn) return;
      const t = e.map((s) => {
        let { sensor: r } = s;
        return r.setup == null ? void 0 : r.setup();
      });
      return () => {
        for (const s of t) s == null ? void 0 : s();
      };
    }, e.map((t) => {
      let { sensor: s } = t;
      return s;
    }));
  }
  function Uo(e, t) {
    return a.useMemo(() => e.reduce((s, r) => {
      let { eventName: i, handler: o } = r;
      return s[i] = (c) => {
        o(c, t);
      }, s;
    }, {}), [
      e,
      t
    ]);
  }
  function na(e) {
    return a.useMemo(() => e ? uo(e) : null, [
      e
    ]);
  }
  const ir = [];
  function Fo(e, t) {
    t === void 0 && (t = qt);
    const [s] = e, r = na(s ? Ye(s) : null), [i, o] = a.useState(ir);
    function c() {
      o(() => e.length ? e.map((d) => Jr(d) ? r : new _s(t(d), d)) : ir);
    }
    const l = Yn({
      callback: c
    });
    return ct(() => {
      l == null ? void 0 : l.disconnect(), c(), e.forEach((d) => l == null ? void 0 : l.observe(d));
    }, [
      e
    ]), i;
  }
  function sa(e) {
    if (!e) return null;
    if (e.children.length > 1) return e;
    const t = e.children[0];
    return mn(t) ? t : e;
  }
  function Go(e) {
    let { measure: t } = e;
    const [s, r] = a.useState(null), i = a.useCallback((u) => {
      for (const { target: f } of u) if (mn(f)) {
        r((h) => {
          const y = t(f);
          return h ? {
            ...h,
            width: y.width,
            height: y.height
          } : y;
        });
        break;
      }
    }, [
      t
    ]), o = Yn({
      callback: i
    }), c = a.useCallback((u) => {
      const f = sa(u);
      o == null ? void 0 : o.disconnect(), f && (o == null ? void 0 : o.observe(f)), r(f ? t(f) : null);
    }, [
      t,
      o
    ]), [l, d] = Tn(c);
    return a.useMemo(() => ({
      nodeRef: l,
      rect: s,
      setRef: d
    }), [
      s,
      l,
      d
    ]);
  }
  const Wo = [
    {
      sensor: Vn,
      options: {}
    },
    {
      sensor: As,
      options: {}
    }
  ], zo = {
    current: {}
  }, An = {
    draggable: {
      measure: Qs
    },
    droppable: {
      measure: Qs,
      strategy: fn.WhileDragging,
      frequency: Ss.Optimized
    },
    dragOverlay: {
      measure: qt
    }
  };
  class on extends Map {
    get(t) {
      var s;
      return t != null && (s = super.get(t)) != null ? s : void 0;
    }
    toArray() {
      return Array.from(this.values());
    }
    getEnabled() {
      return this.toArray().filter((t) => {
        let { disabled: s } = t;
        return !s;
      });
    }
    getNodeFor(t) {
      var s, r;
      return (s = (r = this.get(t)) == null ? void 0 : r.node.current) != null ? s : void 0;
    }
  }
  const Ko = {
    activatorEvent: null,
    active: null,
    activeNode: null,
    activeNodeRect: null,
    collisions: null,
    containerNodeRect: null,
    draggableNodes: /* @__PURE__ */ new Map(),
    droppableRects: /* @__PURE__ */ new Map(),
    droppableContainers: new on(),
    over: null,
    dragOverlay: {
      nodeRef: {
        current: null
      },
      rect: null,
      setRef: Bn
    },
    scrollableAncestors: [],
    scrollableAncestorRects: [],
    measuringConfiguration: An,
    measureDroppableContainers: Bn,
    windowRect: null,
    measuringScheduled: false
  }, ra = {
    activatorEvent: null,
    activators: [],
    active: null,
    activeNodeRect: null,
    ariaDescribedById: {
      draggable: ""
    },
    dispatch: Bn,
    draggableNodes: /* @__PURE__ */ new Map(),
    over: null,
    measureDroppableContainers: Bn
  }, vn = a.createContext(ra), aa = a.createContext(Ko);
  function Ho() {
    return {
      draggable: {
        active: null,
        initialCoordinates: {
          x: 0,
          y: 0
        },
        nodes: /* @__PURE__ */ new Map(),
        translate: {
          x: 0,
          y: 0
        }
      },
      droppable: {
        containers: new on()
      }
    };
  }
  function Vo(e, t) {
    switch (t.type) {
      case Oe.DragStart:
        return {
          ...e,
          draggable: {
            ...e.draggable,
            initialCoordinates: t.initialCoordinates,
            active: t.active
          }
        };
      case Oe.DragMove:
        return e.draggable.active == null ? e : {
          ...e,
          draggable: {
            ...e.draggable,
            translate: {
              x: t.coordinates.x - e.draggable.initialCoordinates.x,
              y: t.coordinates.y - e.draggable.initialCoordinates.y
            }
          }
        };
      case Oe.DragEnd:
      case Oe.DragCancel:
        return {
          ...e,
          draggable: {
            ...e.draggable,
            active: null,
            initialCoordinates: {
              x: 0,
              y: 0
            },
            translate: {
              x: 0,
              y: 0
            }
          }
        };
      case Oe.RegisterDroppable: {
        const { element: s } = t, { id: r } = s, i = new on(e.droppable.containers);
        return i.set(r, s), {
          ...e,
          droppable: {
            ...e.droppable,
            containers: i
          }
        };
      }
      case Oe.SetDroppableDisabled: {
        const { id: s, key: r, disabled: i } = t, o = e.droppable.containers.get(s);
        if (!o || r !== o.key) return e;
        const c = new on(e.droppable.containers);
        return c.set(s, {
          ...o,
          disabled: i
        }), {
          ...e,
          droppable: {
            ...e.droppable,
            containers: c
          }
        };
      }
      case Oe.UnregisterDroppable: {
        const { id: s, key: r } = t, i = e.droppable.containers.get(s);
        if (!i || r !== i.key) return e;
        const o = new on(e.droppable.containers);
        return o.delete(s), {
          ...e,
          droppable: {
            ...e.droppable,
            containers: o
          }
        };
      }
      default:
        return e;
    }
  }
  function Yo(e) {
    let { disabled: t } = e;
    const { active: s, activatorEvent: r, draggableNodes: i } = a.useContext(vn), o = On(r), c = On(s == null ? void 0 : s.id);
    return a.useEffect(() => {
      if (!t && !r && o && c != null) {
        if (!Kn(o) || document.activeElement === o.target) return;
        const l = i.get(c);
        if (!l) return;
        const { activatorNode: d, node: u } = l;
        if (!d.current && !u.current) return;
        requestAnimationFrame(() => {
          for (const f of [
            d.current,
            u.current
          ]) {
            if (!f) continue;
            const h = zi(f);
            if (h) {
              h.focus();
              break;
            }
          }
        });
      }
    }, [
      r,
      t,
      i,
      c,
      o
    ]), null;
  }
  function ia(e, t) {
    let { transform: s, ...r } = t;
    return e != null && e.length ? e.reduce((i, o) => o({
      transform: i,
      ...r
    }), s) : s;
  }
  function qo(e) {
    return a.useMemo(() => ({
      draggable: {
        ...An.draggable,
        ...e == null ? void 0 : e.draggable
      },
      droppable: {
        ...An.droppable,
        ...e == null ? void 0 : e.droppable
      },
      dragOverlay: {
        ...An.dragOverlay,
        ...e == null ? void 0 : e.dragOverlay
      }
    }), [
      e == null ? void 0 : e.draggable,
      e == null ? void 0 : e.droppable,
      e == null ? void 0 : e.dragOverlay
    ]);
  }
  function Xo(e) {
    let { activeNode: t, measure: s, initialRect: r, config: i = true } = e;
    const o = a.useRef(false), { x: c, y: l } = typeof i == "boolean" ? {
      x: i,
      y: i
    } : i;
    ct(() => {
      if (!c && !l || !t) {
        o.current = false;
        return;
      }
      if (o.current || !r) return;
      const u = t == null ? void 0 : t.node.current;
      if (!u || u.isConnected === false) return;
      const f = s(u), h = Hr(f, r);
      if (c || (h.x = 0), l || (h.y = 0), o.current = true, Math.abs(h.x) > 0 || Math.abs(h.y) > 0) {
        const y = Yr(u);
        y && y.scrollBy({
          top: h.y,
          left: h.x
        });
      }
    }, [
      t,
      c,
      l,
      r,
      s
    ]);
  }
  const qn = a.createContext({
    ...lt,
    scaleX: 1,
    scaleY: 1
  });
  var jt;
  (function(e) {
    e[e.Uninitialized = 0] = "Uninitialized", e[e.Initializing = 1] = "Initializing", e[e.Initialized = 2] = "Initialized";
  })(jt || (jt = {}));
  const oa = a.memo(function(t) {
    var s, r, i, o;
    let { id: c, accessibility: l, autoScroll: d = true, children: u, sensors: f = Wo, collisionDetection: h = Kr, measuring: y, modifiers: p, ...S } = t;
    const j = a.useReducer(Vo, void 0, Ho), [k, D] = j, [N, M] = Xi(), [g, w] = a.useState(jt.Uninitialized), m = g === jt.Initialized, { draggable: { active: C, nodes: L, translate: A }, droppable: { containers: x } } = k, I = C != null ? L.get(C) : null, U = a.useRef({
      initial: null,
      translated: null
    }), Z = a.useMemo(() => {
      var ye;
      return C != null ? {
        id: C,
        data: (ye = I == null ? void 0 : I.data) != null ? ye : zo,
        rect: U
      } : null;
    }, [
      C,
      I
    ]), K = a.useRef(null), [Q, ne] = a.useState(null), [X, ge] = a.useState(null), ee = dn(S, Object.values(S)), ve = gn("DndDescribedBy", c), Me = a.useMemo(() => x.getEnabled(), [
      x
    ]), ae = qo(y), { droppableRects: T, measureDroppableContainers: O, measuringScheduled: P } = Io(Me, {
      dragging: m,
      dependencies: [
        A.x,
        A.y
      ],
      config: ae.droppable
    }), V = Do(L, C), ue = a.useMemo(() => X ? Pn(X) : null, [
      X
    ]), we = Et(), J = _o(V, ae.draggable.measure);
    Xo({
      activeNode: C != null ? L.get(C) : null,
      config: we.layoutShiftCompensation,
      initialRect: J,
      measure: ae.draggable.measure
    });
    const Y = sr(V, ae.draggable.measure, J), Pe = sr(V ? V.parentElement : null), ie = a.useRef({
      activatorEvent: null,
      active: null,
      activeNode: V,
      collisionRect: null,
      collisions: null,
      droppableRects: T,
      draggableNodes: L,
      draggingNode: null,
      draggingNodeRect: null,
      droppableContainers: x,
      over: null,
      scrollableAncestors: [],
      scrollAdjustedTranslate: null
    }), H = x.getNodeFor((s = ie.current.over) == null ? void 0 : s.id), Se = Go({
      measure: ae.dragOverlay.measure
    }), B = (r = Se.nodeRef.current) != null ? r : V, q = m ? (i = Se.rect) != null ? i : Y : null, _ = !!(Se.nodeRef.current && Se.rect), $ = Oo(_ ? null : Y), F = na(B ? Ye(B) : null), te = Po(m ? H ?? V : null), oe = Fo(te), je = ia(p, {
      transform: {
        x: A.x - $.x,
        y: A.y - $.y,
        scaleX: 1,
        scaleY: 1
      },
      activatorEvent: X,
      active: Z,
      activeNodeRect: Y,
      containerNodeRect: Pe,
      draggingNodeRect: q,
      over: ie.current.over,
      overlayNodeRect: Se.rect,
      scrollableAncestors: te,
      scrollableAncestorRects: oe,
      windowRect: F
    }), Fe = ue ? Wt(ue, A) : null, Re = Bo(te), ce = ar(Re), fe = ar(Re, [
      Y
    ]), me = Wt(je, ce), le = q ? oo(q, je) : null, xe = Z && le ? h({
      active: Z,
      collisionRect: le,
      droppableRects: T,
      droppableContainers: Me,
      pointerCoordinates: Fe
    }) : null, Je = zr(xe, "id"), [De, pe] = a.useState(null), Be = _ ? je : Wt(je, fe), _t = ao(Be, (o = De == null ? void 0 : De.rect) != null ? o : null, Y), dt = a.useRef(null), ut = a.useCallback((ye, Ne) => {
      let { sensor: Le, options: We } = Ne;
      if (K.current == null) return;
      const Ie = L.get(K.current);
      if (!Ie) return;
      const Te = ye.nativeEvent, ze = new Le({
        active: K.current,
        activeNode: Ie,
        event: Te,
        options: We,
        context: ie,
        onAbort(Ee) {
          if (!L.get(Ee)) return;
          const { onDragAbort: Xe } = ee.current, Ke = {
            id: Ee
          };
          Xe == null ? void 0 : Xe(Ke), N({
            type: "onDragAbort",
            event: Ke
          });
        },
        onPending(Ee, qe, Xe, Ke) {
          if (!L.get(Ee)) return;
          const { onDragPending: be } = ee.current, Qe = {
            id: Ee,
            constraint: qe,
            initialCoordinates: Xe,
            offset: Ke
          };
          be == null ? void 0 : be(Qe), N({
            type: "onDragPending",
            event: Qe
          });
        },
        onStart(Ee) {
          const qe = K.current;
          if (qe == null) return;
          const Xe = L.get(qe);
          if (!Xe) return;
          const { onDragStart: Ke } = ee.current, de = {
            activatorEvent: Te,
            active: {
              id: qe,
              data: Xe.data,
              rect: U
            }
          };
          Ve.unstable_batchedUpdates(() => {
            Ke == null ? void 0 : Ke(de), w(jt.Initializing), D({
              type: Oe.DragStart,
              initialCoordinates: Ee,
              active: qe
            }), N({
              type: "onDragStart",
              event: de
            }), ne(dt.current), ge(Te);
          });
        },
        onMove(Ee) {
          D({
            type: Oe.DragMove,
            coordinates: Ee
          });
        },
        onEnd: at(Oe.DragEnd),
        onCancel: at(Oe.DragCancel)
      });
      dt.current = ze;
      function at(Ee) {
        return async function() {
          const { active: Xe, collisions: Ke, over: de, scrollAdjustedTranslate: be } = ie.current;
          let Qe = null;
          if (Xe && be) {
            const { cancelDrop: tt } = ee.current;
            Qe = {
              activatorEvent: Te,
              active: Xe,
              collisions: Ke,
              delta: be,
              over: de
            }, Ee === Oe.DragEnd && typeof tt == "function" && await Promise.resolve(tt(Qe)) && (Ee = Oe.DragCancel);
          }
          K.current = null, Ve.unstable_batchedUpdates(() => {
            D({
              type: Ee
            }), w(jt.Uninitialized), pe(null), ne(null), ge(null), dt.current = null;
            const tt = Ee === Oe.DragEnd ? "onDragEnd" : "onDragCancel";
            if (Qe) {
              const He = ee.current[tt];
              He == null ? void 0 : He(Qe), N({
                type: tt,
                event: Qe
              });
            }
          });
        };
      }
    }, [
      L
    ]), Ge = a.useCallback((ye, Ne) => (Le, We) => {
      const Ie = Le.nativeEvent, Te = L.get(We);
      if (K.current !== null || !Te || Ie.dndKit || Ie.defaultPrevented) return;
      const ze = {
        active: Te
      };
      ye(Le, Ne.options, ze) === true && (Ie.dndKit = {
        capturedBy: Ne.sensor
      }, K.current = We, ut(Le, Ne));
    }, [
      L,
      ut
    ]), Xt = Lo(f, Ge);
    $o(f), ct(() => {
      Y && g === jt.Initializing && w(jt.Initialized);
    }, [
      Y,
      g
    ]), a.useEffect(() => {
      const { onDragMove: ye } = ee.current, { active: Ne, activatorEvent: Le, collisions: We, over: Ie } = ie.current;
      if (!Ne || !Le) return;
      const Te = {
        active: Ne,
        activatorEvent: Le,
        collisions: We,
        delta: {
          x: me.x,
          y: me.y
        },
        over: Ie
      };
      Ve.unstable_batchedUpdates(() => {
        ye == null ? void 0 : ye(Te), N({
          type: "onDragMove",
          event: Te
        });
      });
    }, [
      me.x,
      me.y
    ]), a.useEffect(() => {
      const { active: ye, activatorEvent: Ne, collisions: Le, droppableContainers: We, scrollAdjustedTranslate: Ie } = ie.current;
      if (!ye || K.current == null || !Ne || !Ie) return;
      const { onDragOver: Te } = ee.current, ze = We.get(Je), at = ze && ze.rect.current ? {
        id: ze.id,
        rect: ze.rect.current,
        data: ze.data,
        disabled: ze.disabled
      } : null, Ee = {
        active: ye,
        activatorEvent: Ne,
        collisions: Le,
        delta: {
          x: Ie.x,
          y: Ie.y
        },
        over: at
      };
      Ve.unstable_batchedUpdates(() => {
        pe(at), Te == null ? void 0 : Te(Ee), N({
          type: "onDragOver",
          event: Ee
        });
      });
    }, [
      Je
    ]), ct(() => {
      ie.current = {
        activatorEvent: X,
        active: Z,
        activeNode: V,
        collisionRect: le,
        collisions: xe,
        droppableRects: T,
        draggableNodes: L,
        draggingNode: B,
        draggingNodeRect: q,
        droppableContainers: x,
        over: De,
        scrollableAncestors: te,
        scrollAdjustedTranslate: me
      }, U.current = {
        initial: q,
        translated: le
      };
    }, [
      Z,
      V,
      xe,
      le,
      L,
      B,
      q,
      T,
      x,
      De,
      te,
      me
    ]), Eo({
      ...we,
      delta: A,
      draggingRect: le,
      pointerCoordinates: Fe,
      scrollableAncestors: te,
      scrollableAncestorRects: oe
    });
    const ft = a.useMemo(() => ({
      active: Z,
      activeNode: V,
      activeNodeRect: Y,
      activatorEvent: X,
      collisions: xe,
      containerNodeRect: Pe,
      dragOverlay: Se,
      draggableNodes: L,
      droppableContainers: x,
      droppableRects: T,
      over: De,
      measureDroppableContainers: O,
      scrollableAncestors: te,
      scrollableAncestorRects: oe,
      measuringConfiguration: ae,
      measuringScheduled: P,
      windowRect: F
    }), [
      Z,
      V,
      Y,
      X,
      xe,
      Pe,
      Se,
      L,
      x,
      T,
      De,
      O,
      te,
      oe,
      ae,
      P,
      F
    ]), Nt = a.useMemo(() => ({
      activatorEvent: X,
      activators: Xt,
      active: Z,
      activeNodeRect: Y,
      ariaDescribedById: {
        draggable: ve
      },
      dispatch: D,
      draggableNodes: L,
      over: De,
      measureDroppableContainers: O
    }), [
      X,
      Xt,
      Z,
      Y,
      D,
      ve,
      L,
      De,
      O
    ]);
    return ke.createElement(Gr.Provider, {
      value: M
    }, ke.createElement(vn.Provider, {
      value: Nt
    }, ke.createElement(aa.Provider, {
      value: ft
    }, ke.createElement(qn.Provider, {
      value: _t
    }, u)), ke.createElement(Yo, {
      disabled: (l == null ? void 0 : l.restoreFocus) === false
    })), ke.createElement(Zi, {
      ...l,
      hiddenTextDescribedById: ve
    }));
    function Et() {
      const ye = (Q == null ? void 0 : Q.autoScrollEnabled) === false, Ne = typeof d == "object" ? d.enabled === false : d === false, Le = m && !ye && !Ne;
      return typeof d == "object" ? {
        ...d,
        enabled: Le
      } : {
        enabled: Le
      };
    }
  }), Jo = a.createContext(null), or = "button", Qo = "Draggable";
  function Zo(e) {
    let { id: t, data: s, disabled: r = false, attributes: i } = e;
    const o = gn(Qo), { activators: c, activatorEvent: l, active: d, activeNodeRect: u, ariaDescribedById: f, draggableNodes: h, over: y } = a.useContext(vn), { role: p = or, roleDescription: S = "draggable", tabIndex: j = 0 } = i ?? {}, k = (d == null ? void 0 : d.id) === t, D = a.useContext(k ? qn : Jo), [N, M] = Tn(), [g, w] = Tn(), m = Uo(c, t), C = dn(s);
    ct(() => (h.set(t, {
      id: t,
      key: o,
      node: N,
      activatorNode: g,
      data: C
    }), () => {
      const A = h.get(t);
      A && A.key === o && h.delete(t);
    }), [
      h,
      t
    ]);
    const L = a.useMemo(() => ({
      role: p,
      tabIndex: j,
      "aria-disabled": r,
      "aria-pressed": k && p === or ? true : void 0,
      "aria-roledescription": S,
      "aria-describedby": f.draggable
    }), [
      r,
      p,
      j,
      k,
      S,
      f.draggable
    ]);
    return {
      active: d,
      activatorEvent: l,
      activeNodeRect: u,
      attributes: L,
      isDragging: k,
      listeners: r ? void 0 : m,
      node: N,
      over: y,
      setNodeRef: M,
      setActivatorNodeRef: w,
      transform: D
    };
  }
  function ca() {
    return a.useContext(aa);
  }
  const ec = "Droppable", tc = {
    timeout: 25
  };
  function la(e) {
    let { data: t, disabled: s = false, id: r, resizeObserverConfig: i } = e;
    const o = gn(ec), { active: c, dispatch: l, over: d, measureDroppableContainers: u } = a.useContext(vn), f = a.useRef({
      disabled: s
    }), h = a.useRef(false), y = a.useRef(null), p = a.useRef(null), { disabled: S, updateMeasurementsFor: j, timeout: k } = {
      ...tc,
      ...i
    }, D = dn(j ?? r), N = a.useCallback(() => {
      if (!h.current) {
        h.current = true;
        return;
      }
      p.current != null && clearTimeout(p.current), p.current = setTimeout(() => {
        u(Array.isArray(D.current) ? D.current : [
          D.current
        ]), p.current = null;
      }, k);
    }, [
      k
    ]), M = Yn({
      callback: N,
      disabled: S || !c
    }), g = a.useCallback((L, A) => {
      M && (A && (M.unobserve(A), h.current = false), L && M.observe(L));
    }, [
      M
    ]), [w, m] = Tn(g), C = dn(t);
    return a.useEffect(() => {
      !M || !w.current || (M.disconnect(), h.current = false, M.observe(w.current));
    }, [
      w,
      M
    ]), a.useEffect(() => (l({
      type: Oe.RegisterDroppable,
      element: {
        id: r,
        key: o,
        disabled: s,
        node: w,
        rect: y,
        data: C
      }
    }), () => l({
      type: Oe.UnregisterDroppable,
      key: o,
      id: r
    })), [
      r
    ]), a.useEffect(() => {
      s !== f.current.disabled && (l({
        type: Oe.SetDroppableDisabled,
        id: r,
        key: o,
        disabled: s
      }), f.current.disabled = s);
    }, [
      r,
      o,
      s,
      l
    ]), {
      active: c,
      rect: y,
      isOver: (d == null ? void 0 : d.id) === r,
      node: w,
      over: d,
      setNodeRef: m
    };
  }
  function nc(e) {
    let { animation: t, children: s } = e;
    const [r, i] = a.useState(null), [o, c] = a.useState(null), l = On(s);
    return !s && !r && l && i(l), ct(() => {
      if (!o) return;
      const d = r == null ? void 0 : r.key, u = r == null ? void 0 : r.props.id;
      if (d == null || u == null) {
        i(null);
        return;
      }
      Promise.resolve(t(u, o)).then(() => {
        i(null);
      });
    }, [
      t,
      r,
      o
    ]), ke.createElement(ke.Fragment, null, s, r ? a.cloneElement(r, {
      ref: c
    }) : null);
  }
  const sc = {
    x: 0,
    y: 0,
    scaleX: 1,
    scaleY: 1
  };
  function rc(e) {
    let { children: t } = e;
    return ke.createElement(vn.Provider, {
      value: ra
    }, ke.createElement(qn.Provider, {
      value: sc
    }, t));
  }
  const ac = {
    position: "fixed",
    touchAction: "none"
  }, ic = (e) => Kn(e) ? "transform 250ms ease" : void 0, oc = a.forwardRef((e, t) => {
    let { as: s, activatorEvent: r, adjustScale: i, children: o, className: c, rect: l, style: d, transform: u, transition: f = ic } = e;
    if (!l) return null;
    const h = i ? u : {
      ...u,
      scaleX: 1,
      scaleY: 1
    }, y = {
      ...ac,
      width: l.width,
      height: l.height,
      top: l.top,
      left: l.left,
      transform: yt.Transform.toString(h),
      transformOrigin: i && r ? eo(r, l) : void 0,
      transition: typeof f == "function" ? f(r) : f,
      ...d
    };
    return ke.createElement(s, {
      className: c,
      style: y,
      ref: t
    }, o);
  }), cc = (e) => (t) => {
    let { active: s, dragOverlay: r } = t;
    const i = {}, { styles: o, className: c } = e;
    if (o != null && o.active) for (const [l, d] of Object.entries(o.active)) d !== void 0 && (i[l] = s.node.style.getPropertyValue(l), s.node.style.setProperty(l, d));
    if (o != null && o.dragOverlay) for (const [l, d] of Object.entries(o.dragOverlay)) d !== void 0 && r.node.style.setProperty(l, d);
    return c != null && c.active && s.node.classList.add(c.active), c != null && c.dragOverlay && r.node.classList.add(c.dragOverlay), function() {
      for (const [d, u] of Object.entries(i)) s.node.style.setProperty(d, u);
      c != null && c.active && s.node.classList.remove(c.active);
    };
  }, lc = (e) => {
    let { transform: { initial: t, final: s } } = e;
    return [
      {
        transform: yt.Transform.toString(t)
      },
      {
        transform: yt.Transform.toString(s)
      }
    ];
  }, dc = {
    duration: 250,
    easing: "ease",
    keyframes: lc,
    sideEffects: cc({
      styles: {
        active: {
          opacity: "0"
        }
      }
    })
  };
  function uc(e) {
    let { config: t, draggableNodes: s, droppableContainers: r, measuringConfiguration: i } = e;
    return zn((o, c) => {
      if (t === null) return;
      const l = s.get(o);
      if (!l) return;
      const d = l.node.current;
      if (!d) return;
      const u = sa(c);
      if (!u) return;
      const { transform: f } = Ye(c).getComputedStyle(c), h = Vr(f);
      if (!h) return;
      const y = typeof t == "function" ? t : fc(t);
      return ea(d, i.draggable.measure), y({
        active: {
          id: o,
          data: l.data,
          node: d,
          rect: i.draggable.measure(d)
        },
        draggableNodes: s,
        dragOverlay: {
          node: c,
          rect: i.dragOverlay.measure(u)
        },
        droppableContainers: r,
        measuringConfiguration: i,
        transform: h
      });
    });
  }
  function fc(e) {
    const { duration: t, easing: s, sideEffects: r, keyframes: i } = {
      ...dc,
      ...e
    };
    return (o) => {
      let { active: c, dragOverlay: l, transform: d, ...u } = o;
      if (!t) return;
      const f = {
        x: l.rect.left - c.rect.left,
        y: l.rect.top - c.rect.top
      }, h = {
        scaleX: d.scaleX !== 1 ? c.rect.width * d.scaleX / l.rect.width : 1,
        scaleY: d.scaleY !== 1 ? c.rect.height * d.scaleY / l.rect.height : 1
      }, y = {
        x: d.x - f.x,
        y: d.y - f.y,
        ...h
      }, p = i({
        ...u,
        active: c,
        dragOverlay: l,
        transform: {
          initial: d,
          final: y
        }
      }), [S] = p, j = p[p.length - 1];
      if (JSON.stringify(S) === JSON.stringify(j)) return;
      const k = r == null ? void 0 : r({
        active: c,
        dragOverlay: l,
        ...u
      }), D = l.node.animate(p, {
        duration: t,
        easing: s,
        fill: "forwards"
      });
      return new Promise((N) => {
        D.onfinish = () => {
          k == null ? void 0 : k(), N();
        };
      });
    };
  }
  let cr = 0;
  function hc(e) {
    return a.useMemo(() => {
      if (e != null) return cr++, cr;
    }, [
      e
    ]);
  }
  const mc = ke.memo((e) => {
    let { adjustScale: t = false, children: s, dropAnimation: r, style: i, transition: o, modifiers: c, wrapperElement: l = "div", className: d, zIndex: u = 999 } = e;
    const { activatorEvent: f, active: h, activeNodeRect: y, containerNodeRect: p, draggableNodes: S, droppableContainers: j, dragOverlay: k, over: D, measuringConfiguration: N, scrollableAncestors: M, scrollableAncestorRects: g, windowRect: w } = ca(), m = a.useContext(qn), C = hc(h == null ? void 0 : h.id), L = ia(c, {
      activatorEvent: f,
      active: h,
      activeNodeRect: y,
      containerNodeRect: p,
      draggingNodeRect: k.rect,
      over: D,
      overlayNodeRect: k.rect,
      scrollableAncestors: M,
      scrollableAncestorRects: g,
      transform: m,
      windowRect: w
    }), A = Os(y), x = uc({
      config: r,
      draggableNodes: S,
      droppableContainers: j,
      measuringConfiguration: N
    }), I = A ? k.setRef : void 0;
    return ke.createElement(rc, null, ke.createElement(nc, {
      animation: x
    }, h && C ? ke.createElement(oc, {
      key: C,
      id: h.id,
      ref: I,
      as: l,
      activatorEvent: f,
      adjustScale: t,
      className: d,
      transition: o,
      rect: A,
      style: {
        zIndex: u,
        ...i
      },
      transform: L
    }, s) : null));
  });
  function hn(e, t, s) {
    const r = e.slice();
    return r.splice(s < 0 ? r.length + s : s, 0, r.splice(t, 1)[0]), r;
  }
  function pc(e, t) {
    return e.reduce((s, r, i) => {
      const o = t.get(r);
      return o && (s[i] = o), s;
    }, Array(e.length));
  }
  function En(e) {
    return e !== null && e >= 0;
  }
  function gc(e, t) {
    if (e === t) return true;
    if (e.length !== t.length) return false;
    for (let s = 0; s < e.length; s++) if (e[s] !== t[s]) return false;
    return true;
  }
  function vc(e) {
    return typeof e == "boolean" ? {
      draggable: e,
      droppable: e
    } : e;
  }
  const da = (e) => {
    let { rects: t, activeIndex: s, overIndex: r, index: i } = e;
    const o = hn(t, r, s), c = t[i], l = o[i];
    return !l || !c ? null : {
      x: l.left - c.left,
      y: l.top - c.top,
      scaleX: l.width / c.width,
      scaleY: l.height / c.height
    };
  }, Mn = {
    scaleX: 1,
    scaleY: 1
  }, Ps = (e) => {
    var t;
    let { activeIndex: s, activeNodeRect: r, index: i, rects: o, overIndex: c } = e;
    const l = (t = o[s]) != null ? t : r;
    if (!l) return null;
    if (i === s) {
      const u = o[c];
      return u ? {
        x: 0,
        y: s < c ? u.top + u.height - (l.top + l.height) : u.top - l.top,
        ...Mn
      } : null;
    }
    const d = yc(o, i, s);
    return i > s && i <= c ? {
      x: 0,
      y: -l.height - d,
      ...Mn
    } : i < s && i >= c ? {
      x: 0,
      y: l.height + d,
      ...Mn
    } : {
      x: 0,
      y: 0,
      ...Mn
    };
  };
  function yc(e, t, s) {
    const r = e[t], i = e[t - 1], o = e[t + 1];
    return r ? s < t ? i ? r.top - (i.top + i.height) : o ? o.top - (r.top + r.height) : 0 : o ? o.top - (r.top + r.height) : i ? r.top - (i.top + i.height) : 0 : 0;
  }
  const ua = "Sortable", fa = ke.createContext({
    activeIndex: -1,
    containerId: ua,
    disableTransforms: false,
    items: [],
    overIndex: -1,
    useDragOverlay: false,
    sortedRects: [],
    strategy: da,
    disabled: {
      draggable: false,
      droppable: false
    }
  });
  function Bs(e) {
    let { children: t, id: s, items: r, strategy: i = da, disabled: o = false } = e;
    const { active: c, dragOverlay: l, droppableRects: d, over: u, measureDroppableContainers: f } = ca(), h = gn(ua, s), y = l.rect !== null, p = a.useMemo(() => r.map((m) => typeof m == "object" && "id" in m ? m.id : m), [
      r
    ]), S = c != null, j = c ? p.indexOf(c.id) : -1, k = u ? p.indexOf(u.id) : -1, D = a.useRef(p), N = !gc(p, D.current), M = k !== -1 && j === -1 || N, g = vc(o);
    ct(() => {
      N && S && f(p);
    }, [
      N,
      p,
      S,
      f
    ]), a.useEffect(() => {
      D.current = p;
    }, [
      p
    ]);
    const w = a.useMemo(() => ({
      activeIndex: j,
      containerId: h,
      disabled: g,
      disableTransforms: M,
      items: p,
      overIndex: k,
      useDragOverlay: y,
      sortedRects: pc(p, d),
      strategy: i
    }), [
      j,
      h,
      g.draggable,
      g.droppable,
      M,
      p,
      k,
      d,
      y,
      i
    ]);
    return ke.createElement(fa.Provider, {
      value: w
    }, t);
  }
  const bc = (e) => {
    let { id: t, items: s, activeIndex: r, overIndex: i } = e;
    return hn(s, r, i).indexOf(t);
  }, xc = (e) => {
    let { containerId: t, isSorting: s, wasDragging: r, index: i, items: o, newIndex: c, previousItems: l, previousContainerId: d, transition: u } = e;
    return !u || !r || l !== o && i === c ? false : s ? true : c !== i && t === d;
  }, wc = {
    duration: 200,
    easing: "ease"
  }, ha = "transform", Sc = yt.Transition.toString({
    property: ha,
    duration: 0,
    easing: "linear"
  }), jc = {
    roleDescription: "sortable"
  };
  function Cc(e) {
    let { disabled: t, index: s, node: r, rect: i } = e;
    const [o, c] = a.useState(null), l = a.useRef(s);
    return ct(() => {
      if (!t && s !== l.current && r.current) {
        const d = i.current;
        if (d) {
          const u = qt(r.current, {
            ignoreTransform: true
          }), f = {
            x: d.left - u.left,
            y: d.top - u.top,
            scaleX: d.width / u.width,
            scaleY: d.height / u.height
          };
          (f.x || f.y) && c(f);
        }
      }
      s !== l.current && (l.current = s);
    }, [
      t,
      s,
      r,
      i
    ]), a.useEffect(() => {
      o && c(null);
    }, [
      o
    ]), o;
  }
  function $s(e) {
    let { animateLayoutChanges: t = xc, attributes: s, disabled: r, data: i, getNewIndex: o = bc, id: c, strategy: l, resizeObserverConfig: d, transition: u = wc } = e;
    const { items: f, containerId: h, activeIndex: y, disabled: p, disableTransforms: S, sortedRects: j, overIndex: k, useDragOverlay: D, strategy: N } = a.useContext(fa), M = kc(r, p), g = f.indexOf(c), w = a.useMemo(() => ({
      sortable: {
        containerId: h,
        index: g,
        items: f
      },
      ...i
    }), [
      h,
      i,
      g,
      f
    ]), m = a.useMemo(() => f.slice(f.indexOf(c)), [
      f,
      c
    ]), { rect: C, node: L, isOver: A, setNodeRef: x } = la({
      id: c,
      data: w,
      disabled: M.droppable,
      resizeObserverConfig: {
        updateMeasurementsFor: m,
        ...d
      }
    }), { active: I, activatorEvent: U, activeNodeRect: Z, attributes: K, setNodeRef: Q, listeners: ne, isDragging: X, over: ge, setActivatorNodeRef: ee, transform: ve } = Zo({
      id: c,
      data: w,
      attributes: {
        ...jc,
        ...s
      },
      disabled: M.draggable
    }), Me = Ui(x, Q), ae = !!I, T = ae && !S && En(y) && En(k), O = !D && X, P = O && T ? ve : null, ue = T ? P ?? (l ?? N)({
      rects: j,
      activeNodeRect: Z,
      activeIndex: y,
      overIndex: k,
      index: g
    }) : null, we = En(y) && En(k) ? o({
      id: c,
      items: f,
      activeIndex: y,
      overIndex: k
    }) : g, J = I == null ? void 0 : I.id, Y = a.useRef({
      activeId: J,
      items: f,
      newIndex: we,
      containerId: h
    }), Pe = f !== Y.current.items, ie = t({
      active: I,
      containerId: h,
      isDragging: X,
      isSorting: ae,
      id: c,
      index: g,
      items: f,
      newIndex: Y.current.newIndex,
      previousItems: Y.current.items,
      previousContainerId: Y.current.containerId,
      transition: u,
      wasDragging: Y.current.activeId != null
    }), H = Cc({
      disabled: !ie,
      index: g,
      node: L,
      rect: C
    });
    return a.useEffect(() => {
      ae && Y.current.newIndex !== we && (Y.current.newIndex = we), h !== Y.current.containerId && (Y.current.containerId = h), f !== Y.current.items && (Y.current.items = f);
    }, [
      ae,
      we,
      h,
      f
    ]), a.useEffect(() => {
      if (J === Y.current.activeId) return;
      if (J != null && Y.current.activeId == null) {
        Y.current.activeId = J;
        return;
      }
      const B = setTimeout(() => {
        Y.current.activeId = J;
      }, 50);
      return () => clearTimeout(B);
    }, [
      J
    ]), {
      active: I,
      activeIndex: y,
      attributes: K,
      data: w,
      rect: C,
      index: g,
      newIndex: we,
      items: f,
      isOver: A,
      isSorting: ae,
      isDragging: X,
      listeners: ne,
      node: L,
      overIndex: k,
      over: ge,
      setNodeRef: Me,
      setActivatorNodeRef: ee,
      setDroppableNodeRef: x,
      setDraggableNodeRef: Q,
      transform: H ?? ue,
      transition: Se()
    };
    function Se() {
      if (H || Pe && Y.current.newIndex === g) return Sc;
      if (!(O && !Kn(U) || !u) && (ae || ie)) return yt.Transition.toString({
        ...u,
        property: ha
      });
    }
  }
  function kc(e, t) {
    var s, r;
    return typeof e == "boolean" ? {
      draggable: e,
      droppable: false
    } : {
      draggable: (s = e == null ? void 0 : e.draggable) != null ? s : t.draggable,
      droppable: (r = e == null ? void 0 : e.droppable) != null ? r : t.droppable
    };
  }
  function Un(e) {
    if (!e) return false;
    const t = e.data.current;
    return !!(t && "sortable" in t && typeof t.sortable == "object" && "containerId" in t.sortable && "items" in t.sortable && "index" in t.sortable);
  }
  const Nc = [
    se.Down,
    se.Right,
    se.Up,
    se.Left
  ], Ec = (e, t) => {
    let { context: { active: s, collisionRect: r, droppableRects: i, droppableContainers: o, over: c, scrollableAncestors: l } } = t;
    if (Nc.includes(e.code)) {
      if (e.preventDefault(), !s || !r) return;
      const d = [];
      o.getEnabled().forEach((h) => {
        if (!h || h != null && h.disabled) return;
        const y = i.get(h.id);
        if (y) switch (e.code) {
          case se.Down:
            r.top < y.top && d.push(h);
            break;
          case se.Up:
            r.top > y.top && d.push(h);
            break;
          case se.Left:
            r.left > y.left && d.push(h);
            break;
          case se.Right:
            r.left < y.left && d.push(h);
            break;
        }
      });
      const u = no({
        collisionRect: r,
        droppableRects: i,
        droppableContainers: d
      });
      let f = zr(u, "id");
      if (f === (c == null ? void 0 : c.id) && u.length > 1 && (f = u[1].id), f != null) {
        const h = o.get(s.id), y = o.get(f), p = y ? i.get(y.id) : null, S = y == null ? void 0 : y.node.current;
        if (S && p && h && y) {
          const k = Hn(S).some((m, C) => l[C] !== m), D = ma(h, y), N = Mc(h, y), M = k || !D ? {
            x: 0,
            y: 0
          } : {
            x: N ? r.width - p.width : 0,
            y: N ? r.height - p.height : 0
          }, g = {
            x: p.left,
            y: p.top
          };
          return M.x && M.y ? g : un(g, M);
        }
      }
    }
  };
  function ma(e, t) {
    return !Un(e) || !Un(t) ? false : e.data.current.sortable.containerId === t.data.current.sortable.containerId;
  }
  function Mc(e, t) {
    return !Un(e) || !Un(t) || !ma(e, t) ? false : e.data.current.sortable.index < t.data.current.sortable.index;
  }
  function Rc(e) {
    const t = (e || "").trim();
    if (!t) return null;
    try {
      const s = new URL(t), r = s.pathname.split("/").filter(Boolean);
      return r[0] === "join" && r.length >= 3 ? {
        instanceHost: r[1],
        code: r[2]
      } : r[0] === "invite" && r.length >= 2 ? {
        instanceHost: s.host,
        code: r[1]
      } : null;
    } catch {
      return /^[A-Za-z0-9]{6,12}$/.test(t) ? {
        instanceHost: null,
        code: t
      } : null;
    }
  }
  function Dc(e) {
    if (!e) return null;
    try {
      return new URL(e).host;
    } catch {
      return null;
    }
  }
  function js(e, t, s, r, i = null) {
    const o = new URL(e), c = Dc(t);
    c ? o.pathname = `/join/${c}/${encodeURIComponent(s)}` : o.pathname = `/invite/${encodeURIComponent(s)}`, o.search = "";
    const l = new URLSearchParams();
    return r && l.set("name", Ca(r)), i instanceof Uint8Array && l.set("mk", ka(i)), o.hash = l.toString(), o.toString();
  }
  const Lc = "Server was created, but local metadata setup failed on this device. Refresh the server list and relink this device if the name stays unavailable.";
  async function Ic(e, t) {
    const s = await ln(e, _e());
    try {
      return await La(s, t);
    } finally {
      s.close();
    }
  }
  async function _c(e, t, s) {
    const r = await ln(e, _e());
    try {
      await Ia(r, t, s);
    } finally {
      r.close();
    }
  }
  async function Ac(e, t) {
    const s = await ln(e, _e());
    try {
      await _a(s, t);
    } finally {
      s.close();
    }
  }
  function Tc(e) {
    switch (e) {
      case "subscribers":
        return {
          annotation: "Subscription required to create servers.",
          disabled: true,
          buttonLabel: "Create"
        };
      case "disabled":
        return {
          annotation: "Server creation is managed by the instance admin.",
          disabled: true,
          buttonLabel: "Create"
        };
      case "request":
        return {
          annotation: "Your request will be reviewed by the instance admin.",
          disabled: false,
          buttonLabel: "Request creation"
        };
      case "open":
      case "any_member":
      default:
        return {
          annotation: null,
          disabled: false,
          buttonLabel: "Create"
        };
    }
  }
  function pa({ getToken: e, onClose: t, onCreated: s, activeInstanceUrl: r }) {
    var _a2, _b;
    const i = Ms(), [o, c] = a.useState("create"), [l, d] = a.useState(""), [u, f] = a.useState(null), h = a.useCallback((O) => {
      c(O), f(null);
    }, []), y = a.useCallback(() => {
      f(null);
      const O = Rc(l);
      if (!O) {
        f("Invalid invite link. Paste a Hush invite URL or code.");
        return;
      }
      t(), O.instanceHost ? i(`/join/${O.instanceHost}/${O.code}`) : i(`/invite/${O.code}`);
    }, [
      l,
      i,
      t
    ]), [p, S] = a.useState(""), [j, k] = a.useState(""), [D, N] = a.useState(false), [M, g] = a.useState(false), [w, m] = a.useState([]), [C, L] = a.useState(null), [A, x] = a.useState(false), { user: I } = Gn(), { instanceStates: U, refreshGuilds: Z } = Lr(), K = a.useMemo(() => {
      const O = [];
      for (const [P, V] of U) V.connectionState === "connected" && O.push({
        url: P,
        state: V
      });
      return O.sort((P, V) => P.url.localeCompare(V.url)), O;
    }, [
      U
    ]), Q = r ?? ((_a2 = K[0]) == null ? void 0 : _a2.url) ?? null, [ne, X] = a.useState(Q);
    a.useEffect(() => {
      !ne && K.length > 0 && X(K[0].url);
    }, [
      K,
      ne
    ]);
    const ge = ((_b = U.get(ne ?? "")) == null ? void 0 : _b.handshakeData) ?? null, ee = (ge == null ? void 0 : ge.server_creation_policy) ?? (ge == null ? void 0 : ge.server_creation_policy_value) ?? null, { annotation: ve, disabled: Me, buttonLabel: ae } = Tc(ee);
    a.useEffect(() => {
      const O = requestAnimationFrame(() => g(true));
      return () => cancelAnimationFrame(O);
    }, []), a.useEffect(() => {
      const O = (P) => {
        P.key === "Escape" && t();
      };
      return document.addEventListener("keydown", O), () => document.removeEventListener("keydown", O);
    }, [
      t
    ]), a.useEffect(() => {
      var _a3;
      const O = ne ? ((_a3 = U.get(ne)) == null ? void 0 : _a3.jwt) ?? e() : e();
      O && (m([]), L(null), x(false), (async () => {
        try {
          const P = await Na(O, ne ?? void 0);
          if (Array.isArray(P) && P.length > 0) {
            m(P);
            const V = P.find((ue) => ue.isDefault);
            L(V ? V.id : P[0].id);
          }
        } catch {
        }
        x(true);
      })());
    }, [
      ne
    ]);
    const T = async (O) => {
      var _a3;
      O.preventDefault(), k("");
      const P = p.trim();
      if (!P) {
        k("Server name is required.");
        return;
      }
      const V = ne ? ((_a3 = U.get(ne)) == null ? void 0 : _a3.jwt) ?? e() : e(), ue = ne ?? void 0;
      if (!V) {
        k("Not authenticated.");
        return;
      }
      if (!(I == null ? void 0 : I.id)) {
        k("User context is not available.");
        return;
      }
      N(true);
      let we = null;
      try {
        const J = Ea();
        we = await Ic(I.id, J);
        const Y = await ks(J), Pe = Ma(await Ra(Y, {
          name: P,
          description: "",
          icon: null
        })), ie = await Da(V, Pe, C, ue);
        try {
          await _c(I.id, we, ie.id);
        } catch {
          throw ne && Z(ne).catch(() => {
          }), new Error(Lc);
        }
        ie.encryptedMetadata = Pe, ie._localName = P, ne && Z(ne).catch(() => {
        }), s(ie);
      } catch (J) {
        we && await Ac(I.id, we).catch(() => {
        }), k(J.message || "Failed to create server.");
      } finally {
        N(false);
      }
    };
    return Ve.createPortal(n.jsx("div", {
      className: `modal-backdrop ${M ? "modal-backdrop-open" : ""}`,
      onClick: t,
      children: n.jsxs("div", {
        className: `modal-content ${M ? "modal-content-open" : ""}`,
        onClick: (O) => O.stopPropagation(),
        children: [
          n.jsx("div", {
            className: "modal-title",
            children: o === "create" ? "Create a server" : "Join a server"
          }),
          n.jsxs("div", {
            className: "gcm-tab-bar",
            children: [
              n.jsx("button", {
                type: "button",
                className: `gcm-tab${o === "create" ? " gcm-tab--active" : ""}`,
                onClick: () => h("create"),
                children: "Create"
              }),
              n.jsx("button", {
                type: "button",
                className: `gcm-tab${o === "join" ? " gcm-tab--active" : ""}`,
                onClick: () => h("join"),
                children: "Join"
              })
            ]
          }),
          o === "create" && n.jsxs("form", {
            className: "modal-form",
            onSubmit: T,
            children: [
              n.jsxs("div", {
                children: [
                  n.jsx("label", {
                    htmlFor: "guild-name",
                    className: "modal-field-label",
                    children: "Server name"
                  }),
                  n.jsx("input", {
                    id: "guild-name",
                    name: "guild-name",
                    className: "input",
                    type: "text",
                    placeholder: "My server",
                    value: p,
                    onChange: (O) => {
                      S(O.target.value), k("");
                    },
                    maxLength: 100,
                    autoComplete: "off",
                    autoFocus: true
                  })
                ]
              }),
              n.jsxs("div", {
                children: [
                  n.jsx("label", {
                    htmlFor: "guild-instance",
                    className: "modal-field-label",
                    children: "Instance"
                  }),
                  K.length === 0 ? n.jsx("div", {
                    style: {
                      fontSize: "0.8rem",
                      color: "var(--hush-text-muted)",
                      padding: "8px 0"
                    },
                    children: "No instances connected."
                  }) : n.jsx("select", {
                    id: "guild-instance",
                    className: "input",
                    value: ne ?? "",
                    onChange: (O) => X(O.target.value || null),
                    style: {
                      cursor: "pointer"
                    },
                    children: K.map(({ url: O }) => {
                      const P = (() => {
                        try {
                          return new URL(O).host;
                        } catch {
                          return O;
                        }
                      })();
                      return n.jsx("option", {
                        value: O,
                        children: P
                      }, O);
                    })
                  })
                ]
              }),
              ve && n.jsx("div", {
                className: `gcm-policy-note${Me ? " gcm-policy-note--disabled" : " gcm-policy-note--request"}`,
                children: ve
              }),
              A && w.length > 1 && n.jsxs("div", {
                style: {
                  marginTop: "4px"
                },
                children: [
                  n.jsx("label", {
                    className: "modal-field-label",
                    children: "Template"
                  }),
                  n.jsx("div", {
                    className: "gcm-template-list",
                    children: w.map((O) => n.jsxs("label", {
                      className: `gcm-template-item${C === O.id ? " gcm-template-item--selected" : ""}`,
                      children: [
                        n.jsx("input", {
                          type: "radio",
                          name: "template",
                          value: O.id,
                          checked: C === O.id,
                          onChange: () => L(O.id),
                          style: {
                            accentColor: "var(--hush-live)"
                          }
                        }),
                        n.jsxs("div", {
                          style: {
                            flex: 1,
                            minWidth: 0
                          },
                          children: [
                            n.jsxs("div", {
                              className: "gcm-template-name",
                              children: [
                                O.name,
                                O.isDefault && n.jsx("span", {
                                  className: "gcm-template-default-tag",
                                  children: "(default)"
                                })
                              ]
                            }),
                            n.jsx("div", {
                              className: "gcm-template-channels",
                              children: O.channels.filter((P) => P.type !== "system").map((P) => P.type === "voice" ? `${P.name} (voice)` : `#${P.name}`).join(", ") || "system only"
                            })
                          ]
                        })
                      ]
                    }, O.id))
                  })
                ]
              }),
              j && n.jsx("div", {
                className: "modal-error",
                children: j
              }),
              n.jsxs("div", {
                className: "modal-actions",
                children: [
                  n.jsx("button", {
                    type: "button",
                    className: "btn btn-secondary",
                    onClick: t,
                    children: "Cancel"
                  }),
                  n.jsx("button", {
                    type: "submit",
                    className: "btn btn-primary",
                    disabled: D || !p.trim() || Me || K.length === 0,
                    children: D ? "Creating\u2026" : ae
                  })
                ]
              })
            ]
          }),
          o === "join" && n.jsxs("div", {
            className: "modal-form",
            children: [
              n.jsxs("div", {
                children: [
                  n.jsx("label", {
                    htmlFor: "invite-input",
                    className: "modal-field-label",
                    children: "Invite link"
                  }),
                  n.jsx("input", {
                    id: "invite-input",
                    name: "invite-input",
                    className: "input",
                    type: "text",
                    placeholder: "https://\u2026 or invite code",
                    value: l,
                    onChange: (O) => {
                      d(O.target.value), f(null);
                    },
                    autoComplete: "off",
                    autoFocus: true,
                    onKeyDown: (O) => {
                      O.key === "Enter" && (O.preventDefault(), y());
                    }
                  })
                ]
              }),
              u && n.jsx("div", {
                className: "modal-error",
                children: u
              }),
              n.jsxs("div", {
                className: "modal-actions",
                children: [
                  n.jsx("button", {
                    type: "button",
                    className: "btn btn-secondary",
                    onClick: t,
                    children: "Cancel"
                  }),
                  n.jsx("button", {
                    type: "button",
                    className: "btn btn-primary",
                    disabled: !l.trim(),
                    onClick: y,
                    children: "Join server"
                  })
                ]
              })
            ]
          })
        ]
      })
    }), document.body);
  }
  function Oc({ guild: e, instanceUrl: t, position: s, connectionState: r, userPermissionLevel: i = 0, onClose: o, onLeave: c, onMute: l, onCopyInvite: d, onMarkRead: u, onSettings: f, onInstanceInfo: h }) {
    const y = a.useRef(null);
    a.useEffect(() => {
      const D = (M) => {
        M.key === "Escape" && o();
      }, N = (M) => {
        y.current && !y.current.contains(M.target) && o();
      };
      return document.addEventListener("keydown", D), document.addEventListener("pointerdown", N, {
        capture: true
      }), () => {
        document.removeEventListener("keydown", D), document.removeEventListener("pointerdown", N, {
          capture: true
        });
      };
    }, [
      o
    ]);
    const p = a.useCallback((D) => (N) => {
      N.stopPropagation(), D(), o();
    }, [
      o
    ]), S = (() => {
      try {
        return new URL(t).hostname;
      } catch {
        return t;
      }
    })(), j = r !== "connected", k = n.jsxs("div", {
      ref: y,
      role: "menu",
      "aria-label": "Server actions",
      className: "gcm-context-menu dropdown-menu",
      style: {
        top: s.y,
        left: s.x
      },
      children: [
        n.jsxs("div", {
          className: "gcm-context-instance-label",
          children: [
            S,
            j && n.jsx("span", {
              className: "gcm-context-offline-tag",
              children: "offline"
            })
          ]
        }),
        n.jsx("div", {
          className: "gcm-context-divider"
        }),
        n.jsx(Ft, {
          onClick: p(() => u == null ? void 0 : u(e)),
          label: "Mark as read"
        }),
        n.jsx(Ft, {
          onClick: p(() => d == null ? void 0 : d(e)),
          label: "Copy invite link",
          disabled: j
        }),
        n.jsx(Bc, {
          guild: e,
          onMute: l,
          onClose: o
        }),
        i >= 2 && n.jsx(Ft, {
          onClick: p(() => f == null ? void 0 : f(e)),
          label: "Server settings"
        }),
        n.jsx(Ft, {
          onClick: p(() => h == null ? void 0 : h(e, t)),
          label: "Instance info"
        }),
        n.jsx("div", {
          className: "gcm-context-divider"
        }),
        n.jsx(Ft, {
          onClick: p(() => c == null ? void 0 : c(e)),
          label: "Leave server",
          danger: true
        })
      ]
    });
    return Ve.createPortal(k, document.body);
  }
  function Ft({ onClick: e, label: t, danger: s = false, disabled: r = false }) {
    return n.jsx("button", {
      type: "button",
      role: "menuitem",
      disabled: r,
      onClick: e,
      className: `gcm-context-item${s ? " gcm-context-item--danger" : ""}`,
      children: t
    });
  }
  const Pc = [
    {
      label: "1 hour",
      ms: 60 * 60 * 1e3
    },
    {
      label: "8 hours",
      ms: 8 * 60 * 60 * 1e3
    },
    {
      label: "24 hours",
      ms: 24 * 60 * 60 * 1e3
    },
    {
      label: "Forever",
      ms: null
    }
  ];
  function Bc({ guild: e, onMute: t, onClose: s }) {
    const [r, i] = a.useState(false);
    return n.jsxs("div", {
      style: {
        position: "relative"
      },
      children: [
        n.jsxs("button", {
          type: "button",
          role: "menuitem",
          "aria-haspopup": "true",
          "aria-expanded": r,
          onMouseEnter: () => i(true),
          onMouseLeave: () => i(false),
          className: `gcm-mute-trigger${r ? " gcm-mute-trigger--open" : ""}`,
          children: [
            "Mute notifications",
            n.jsx("span", {
              style: {
                color: "var(--hush-text-muted)",
                fontSize: "0.75rem"
              },
              children: "\u25B6"
            })
          ]
        }),
        r && n.jsx("div", {
          onMouseEnter: () => i(true),
          onMouseLeave: () => i(false),
          className: "gcm-mute-submenu dropdown-menu",
          children: Pc.map(({ label: o, ms: c }) => n.jsx(Ft, {
            label: o,
            onClick: () => {
              t == null ? void 0 : t(e, c), s();
            }
          }, o))
        })
      ]
    });
  }
  const $c = "hush_grouped_sidebar", cs = [
    "#4a6fa5",
    "#5a7f5c",
    "#7a5f9e",
    "#9e6050",
    "#5a7f8f",
    "#9e7a40",
    "#7a4a6f",
    "#4a7a6f",
    "#8f5a5a",
    "#5a5a9e"
  ];
  function Uc(e) {
    if (!e) return cs[0];
    let t = 0;
    const s = e.slice(0, 8);
    for (let r = 0; r < s.length; r++) t = t * 31 + s.charCodeAt(r) & 4294967295;
    return cs[Math.abs(t) % cs.length];
  }
  function Fc(e) {
    if (!e || typeof e != "string") return "?";
    const t = e.trim().split(/\s+/);
    return t.length >= 2 ? (t[0][0] + t[1][0]).toUpperCase().slice(0, 2) : e.slice(0, 2).toUpperCase();
  }
  function Us(e) {
    if (!e) return "";
    try {
      return new URL(e).hostname;
    } catch {
      return e;
    }
  }
  function Gc({ guild: e, isActive: t, isOffline: s, displayName: r, unreadCount: i = 0, onGuildSelect: o, onContextMenu: c, onLongPress: l }) {
    const { attributes: d, listeners: u, setNodeRef: f, transform: h, transition: y, isDragging: p } = $s({
      id: e.id
    }), S = Uc(e.id), j = Us(e.instanceUrl), k = j ? `${r}
${j}` : r, D = a.useRef(null), N = a.useRef(null), M = a.useCallback((x) => {
      const I = x.touches[0];
      N.current = {
        x: I.clientX,
        y: I.clientY
      }, D.current = setTimeout(() => {
        l == null ? void 0 : l(e, {
          x: I.clientX,
          y: I.clientY
        });
      }, 500);
    }, [
      e,
      l
    ]), g = a.useCallback(() => {
      D.current && (clearTimeout(D.current), D.current = null), N.current = null;
    }, []), w = a.useCallback((x) => {
      if (!N.current) return;
      const I = x.touches[0], U = Math.abs(I.clientX - N.current.x), Z = Math.abs(I.clientY - N.current.y);
      (U > 10 || Z > 10) && g();
    }, [
      g
    ]), m = !t && i > 0, C = [
      "sl-guild-btn",
      t && "sl-guild-btn--active",
      m && "sl-guild-btn--unread",
      s && "sl-guild-btn--offline",
      p && "sl-guild-btn--dragging"
    ].filter(Boolean).join(" "), L = {
      background: S,
      transform: yt.Transform.toString(h),
      transition: p ? "none" : y,
      cursor: p ? "grabbing" : "pointer"
    }, A = i > 99 ? "99+" : String(i);
    return n.jsxs("button", {
      ref: f,
      type: "button",
      className: C,
      style: L,
      title: k,
      "aria-label": m ? `${r} (${i} unread)` : r,
      "aria-pressed": t,
      onClick: () => !p && (o == null ? void 0 : o(e)),
      onContextMenu: (x) => {
        x.preventDefault(), c == null ? void 0 : c(e, {
          x: x.clientX,
          y: x.clientY
        });
      },
      onTouchStart: M,
      onTouchEnd: g,
      onTouchMove: w,
      ...d,
      ...u,
      children: [
        n.jsx("span", {
          className: "sl-guild-pill",
          "aria-hidden": "true"
        }),
        Fc(r),
        s && n.jsx("span", {
          className: "sl-offline-dot",
          "aria-label": "offline"
        }),
        m && n.jsx("span", {
          className: "sl-unread-badge",
          "aria-hidden": "true",
          children: A
        })
      ]
    });
  }
  function Wc({ dmGuilds: e, onDmOpen: t, isActive: s }) {
    const r = e.reduce((i, o) => {
      var _a2, _b;
      return i + (((_b = (_a2 = o.channels) == null ? void 0 : _a2[0]) == null ? void 0 : _b.unreadCount) ?? 0);
    }, 0);
    return n.jsx("div", {
      className: "sl-dm-section",
      "data-testid": "dm-section",
      children: n.jsxs("button", {
        type: "button",
        className: `sl-dm-btn${s ? " sl-dm-btn--expanded" : ""}`,
        title: "Direct Messages",
        "aria-label": `Direct Messages${r > 0 ? ` (${r} unread)` : ""}`,
        onClick: t,
        children: [
          n.jsx("svg", {
            width: "20",
            height: "20",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            children: n.jsx("path", {
              d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
            })
          }),
          r > 0 && n.jsx("span", {
            className: "sl-unread-badge",
            children: r > 9 ? "9+" : r
          })
        ]
      })
    });
  }
  function zc({ group: e, activeGuild: t, isGrouped: s, isGuildOffline: r, getGuildDisplayName: i, onGuildSelect: o, onContextMenu: c, onLongPress: l }) {
    return n.jsxs(n.Fragment, {
      children: [
        s && e.type === "group" && e.instanceUrl !== "__default__" && n.jsx("div", {
          className: "sl-instance-label",
          title: e.instanceUrl,
          children: Us(e.instanceUrl)
        }),
        e.guilds.map((d) => {
          const u = Array.isArray(d.channels) ? d.channels.reduce((f, h) => f + (h.unreadCount ?? 0), 0) : 0;
          return n.jsx(Gc, {
            guild: d,
            isActive: d.id === (t == null ? void 0 : t.id),
            isOffline: r(d),
            displayName: i(d),
            unreadCount: u,
            onGuildSelect: o,
            onContextMenu: c,
            onLongPress: l
          }, d.id);
        })
      ]
    });
  }
  function lr({ getToken: e, guilds: t = [], activeGuild: s = null, onGuildSelect: r, onGuildCreated: i, onDmOpen: o, isDmActive: c = false, getMetadataKey: l = null, getMetadataKeys: d = null, rememberMetadataKey: u = null, instanceData: f, userRole: h = "member", userPermissionLevel: y = 0, compact: p = false }) {
    var _a2;
    const S = a.useContext(Aa), j = (S == null ? void 0 : S.mergedGuilds) ?? null, k = (S == null ? void 0 : S.instanceStates) ?? /* @__PURE__ */ new Map(), D = (S == null ? void 0 : S.getTokenForInstance) ?? null, N = (S == null ? void 0 : S.guildOrder) ?? [], M = (S == null ? void 0 : S.setGuildOrder) ?? null, g = j ?? t, [w, m] = a.useState(false), [C, L] = a.useState(/* @__PURE__ */ new Map()), A = a.useRef(/* @__PURE__ */ new Set()), [x, I] = a.useState(null), [U] = a.useState(() => localStorage.getItem($c) === "true"), [Z, K] = a.useState([]);
    a.useEffect(() => {
      N.length > 0 && K(N);
    }, [
      N
    ]);
    const Q = Wr(vs(Vn, {
      activationConstraint: {
        distance: 5
      }
    }), vs(As, {
      coordinateGetter: Ec
    }));
    a.useEffect(() => {
      if (!(!l && !d || g.length === 0)) for (const _ of g) {
        const $ = _.id;
        _.encryptedMetadata && (C.has($) || A.current.has($) || (A.current.add($), (async () => {
          try {
            const F = Ir(_.encryptedMetadata);
            if (F.length > 0 && F[0] === 123) {
              const Re = JSON.parse(new TextDecoder().decode(F));
              L((ce) => {
                const fe = new Map(ce);
                return fe.set($, {
                  name: Re.n || Re.name || "",
                  icon: Re.icon || null
                }), fe;
              });
              return;
            }
            const te = d ? await d($) : [
              await l($)
            ].filter(Boolean);
            if (!(te == null ? void 0 : te.length)) return;
            let oe = null;
            for (const Re of te) try {
              const ce = await ks(Re);
              oe = await _r(ce, F), typeof u == "function" && await u($, Re);
              break;
            } catch {
            }
            if (!oe) return;
            const { name: je, icon: Fe } = oe;
            je && (_._localName = je), L((Re) => {
              const ce = new Map(Re);
              return ce.set($, {
                name: je,
                icon: Fe
              }), ce;
            });
          } catch {
          } finally {
            A.current.delete($);
          }
        })()));
      }
    }, [
      g,
      l,
      d,
      u
    ]);
    const ne = a.useCallback((_) => {
      const $ = C.get(_.id);
      return ($ == null ? void 0 : $.name) ? $.name : _._localName ? _._localName : _.name ? _.name : _.id.slice(0, 8);
    }, [
      C
    ]), X = a.useCallback(() => {
      if (Z.length === 0) return g;
      const _ = new Map(Z.map(($, F) => [
        $,
        F
      ]));
      return [
        ...g
      ].sort(($, F) => {
        const te = _.get($.id) ?? 1 / 0, oe = _.get(F.id) ?? 1 / 0;
        return te - oe;
      });
    }, [
      g,
      Z
    ]), ge = a.useCallback((_) => {
      const { active: $, over: F } = _;
      if (!F || $.id === F.id) return;
      const te = X().map((Re) => Re.id), oe = te.indexOf(String($.id)), je = te.indexOf(String(F.id));
      if (oe === -1 || je === -1) return;
      const Fe = hn(te, oe, je);
      K(Fe), M == null ? void 0 : M(Fe);
    }, [
      X,
      M
    ]), ee = a.useCallback((_, $) => {
      I({
        guild: _,
        position: $
      });
    }, []), ve = a.useCallback((_, $) => {
      I({
        guild: _,
        position: $
      });
    }, []), Me = a.useCallback(() => I(null), []), ae = a.useCallback((_, $) => {
      const F = `hush_muted_${_.id}`;
      $ === null ? localStorage.setItem(F, "forever") : localStorage.setItem(F, String(Date.now() + $));
    }, []), T = a.useCallback(async (_) => {
      var _a3;
      try {
        const $ = _.instanceUrl ?? "", F = _.instanceUrl && D ? D(_.instanceUrl) : e();
        if (!F) return;
        const te = await Ar(F, _.id, {}, $), oe = ((_a3 = C.get(_.id)) == null ? void 0 : _a3.name) ?? _.name ?? _.id, je = typeof l == "function" ? await l(_.id) : null, Fe = js(window.location.origin, _.instanceUrl, te.code, oe, je);
        await navigator.clipboard.writeText(Fe);
      } catch {
      }
    }, [
      l,
      e,
      D,
      C
    ]), O = a.useCallback((_) => {
    }, []), P = a.useCallback((_, $) => {
      const F = k.get($), te = Us($), oe = (F == null ? void 0 : F.connectionState) ?? "unknown";
      alert(`Instance: ${te}
Status: ${oe}`);
    }, [
      k
    ]), V = a.useCallback((_) => {
      m(false), i == null ? void 0 : i(_);
    }, [
      i
    ]), ue = y >= 2 || h === "admin" || h === "owner", J = ((f == null ? void 0 : f.guildDiscovery) ?? (f == null ? void 0 : f.serverCreationPolicy) ?? "open") === "admin_only" ? ue : true, Y = a.useCallback((_) => {
      const $ = _.instanceUrl;
      if (!$) return false;
      const F = k.get($);
      return F ? F.connectionState !== "connected" : false;
    }, [
      k
    ]), Pe = X(), ie = Pe.filter((_) => _.isDm === true), H = Pe.filter((_) => _.isDm !== true), Se = H.map((_) => _.id), B = (() => {
      if (!U) return [
        {
          type: "flat",
          instanceUrl: null,
          guilds: H
        }
      ];
      const _ = /* @__PURE__ */ new Map();
      for (const $ of H) {
        const F = $.instanceUrl ?? "__default__";
        _.has(F) || _.set(F, []), _.get(F).push($);
      }
      return Array.from(_.entries()).map(([$, F]) => ({
        type: "group",
        instanceUrl: $,
        guilds: F
      }));
    })(), q = x ? ((_a2 = k.get(x.guild.instanceUrl)) == null ? void 0 : _a2.connectionState) ?? "connected" : "connected";
    return n.jsxs("div", {
      className: "sl-strip",
      style: p ? {
        width: 56,
        minWidth: 56
      } : void 0,
      "data-testid": "server-list",
      children: [
        n.jsx(Wc, {
          dmGuilds: ie,
          onDmOpen: o,
          isActive: c
        }),
        ie.length > 0 && H.length > 0 && n.jsx("div", {
          className: "sl-separator"
        }),
        n.jsx(oa, {
          sensors: Q,
          collisionDetection: bs,
          onDragEnd: ge,
          children: n.jsx(Bs, {
            items: Se,
            strategy: Ps,
            children: B.map((_) => n.jsx(zc, {
              group: _,
              activeGuild: s,
              isGrouped: U,
              isGuildOffline: Y,
              getGuildDisplayName: ne,
              onGuildSelect: r,
              onContextMenu: ee,
              onLongPress: ve
            }, _.instanceUrl ?? "flat"))
          })
        }),
        H.length > 0 && J && n.jsx("div", {
          className: "sl-separator"
        }),
        J && n.jsx("button", {
          type: "button",
          className: "sl-add-btn",
          title: "Add a server",
          "aria-label": "Add a server",
          onClick: () => m(true),
          children: "+"
        }),
        w && n.jsx(pa, {
          getToken: e,
          onClose: () => m(false),
          onCreated: V,
          activeInstanceUrl: (s == null ? void 0 : s.instanceUrl) ?? null
        }),
        x && n.jsx(Oc, {
          guild: x.guild,
          instanceUrl: x.guild.instanceUrl ?? "",
          position: x.position,
          connectionState: q,
          userPermissionLevel: y,
          onClose: Me,
          onLeave: (_) => {
            console.info("[ServerList] Leave guild:", _.id), Me();
          },
          onMute: ae,
          onCopyInvite: T,
          onMarkRead: O,
          onSettings: (_) => r == null ? void 0 : r(_),
          onInstanceInfo: P
        })
      ]
    });
  }
  function Fs({ title: e, message: t, confirmLabel: s = "Confirm", onConfirm: r, onCancel: i }) {
    const [o, c] = a.useState(false);
    return a.useEffect(() => {
      const l = requestAnimationFrame(() => c(true));
      return () => cancelAnimationFrame(l);
    }, []), a.useEffect(() => {
      const l = (d) => {
        d.key === "Escape" && i(), d.key === "Enter" && r();
      };
      return document.addEventListener("keydown", l), () => document.removeEventListener("keydown", l);
    }, [
      r,
      i
    ]), Ve.createPortal(n.jsx("div", {
      className: `modal-backdrop ${o ? "modal-backdrop-open" : ""}`,
      onClick: i,
      children: n.jsxs("div", {
        className: `modal-content ${o ? "modal-content-open" : ""}`,
        onClick: (l) => l.stopPropagation(),
        children: [
          n.jsx("div", {
            className: "modal-title",
            children: e
          }),
          t && n.jsx("p", {
            className: "confirm-modal-message",
            children: t
          }),
          n.jsxs("div", {
            className: "modal-actions confirm-modal-actions",
            children: [
              n.jsx("button", {
                type: "button",
                className: "btn btn-secondary",
                onClick: i,
                children: "Cancel"
              }),
              n.jsx("button", {
                type: "button",
                className: "btn btn-danger",
                onClick: r,
                children: s
              })
            ]
          })
        ]
      })
    }), document.body);
  }
  const Rn = "overview", Dn = "members", ls = "audit_log", ds = "bans_mutes";
  function Kc(e) {
    const t = [
      "ban",
      "kick",
      "mute"
    ], s = [
      "unban",
      "unmute"
    ];
    return t.includes(e) ? "settings-audit-badge settings-audit-badge--danger" : s.includes(e) ? "settings-audit-badge settings-audit-badge--safe" : e === "message_delete" ? "settings-audit-badge settings-audit-badge--warn" : "settings-audit-badge";
  }
  const Hc = [
    "kick",
    "ban",
    "unban",
    "mute",
    "unmute",
    "message_delete",
    "role_change"
  ], dr = {
    kick: "Kick",
    ban: "Ban",
    unban: "Unban",
    mute: "Mute",
    unmute: "Unmute",
    message_delete: "Message Delete",
    role_change: "Role Change"
  }, Ln = 50;
  function Vc(e) {
    if (!e) return "\u2014";
    try {
      return new Date(e).toLocaleString(void 0, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch {
      return e;
    }
  }
  function ur(e) {
    if (!e) return null;
    try {
      return new Date(e).toLocaleDateString(void 0, {
        year: "numeric",
        month: "short",
        day: "numeric"
      });
    } catch {
      return e;
    }
  }
  function fr(e, t) {
    if (!e) return null;
    if (!(t == null ? void 0 : t.length)) return e.slice(0, 8) + "\u2026";
    const s = t.find((r) => (r.id ?? r.userId) === e);
    return s ? s.username ?? s.displayName ?? s.id ?? e : e.slice(0, 8) + "\u2026";
  }
  function Yc(e, t) {
    return e ? e.length <= t ? e : e.slice(0, t) + "\u2026" : "\u2014";
  }
  function qc({ serverName: e }) {
    return n.jsxs(n.Fragment, {
      children: [
        n.jsx("div", {
          className: "settings-section-title",
          children: "Overview"
        }),
        n.jsxs("div", {
          className: "settings-field-row",
          children: [
            n.jsx("label", {
              className: "settings-field-label",
              children: "Server name"
            }),
            n.jsx("div", {
              style: {
                fontSize: "0.95rem",
                color: "var(--hush-text)",
                padding: "8px 0"
              },
              children: e || "Unnamed server"
            }),
            n.jsx("div", {
              className: "settings-field-note",
              children: "Server names are end-to-end encrypted. Only members can see this name."
            })
          ]
        })
      ]
    });
  }
  function Xc({ getToken: e, serverId: t }) {
    const [s, r] = a.useState([]), [i, o] = a.useState(true), [c, l] = a.useState("");
    return a.useEffect(() => {
      if (!t) {
        o(false);
        return;
      }
      let d = false;
      return o(true), ps(e(), t).then((u) => {
        d || (r(u), o(false));
      }).catch((u) => {
        d || (l(u.message || "Failed to load members"), o(false));
      }), () => {
        d = true;
      };
    }, [
      e,
      t
    ]), n.jsxs(n.Fragment, {
      children: [
        n.jsxs("div", {
          className: "settings-section-title",
          children: [
            "Members",
            s.length > 0 ? ` \u2014 ${s.length}` : ""
          ]
        }),
        i && n.jsx("div", {
          style: {
            color: "var(--hush-text-muted)",
            fontSize: "0.85rem"
          },
          children: "Loading\\u2026"
        }),
        c && n.jsx("div", {
          className: "settings-error-msg",
          children: c
        }),
        !i && !c && n.jsx("div", {
          className: "settings-member-list",
          children: s.map((d) => {
            const u = d.id ?? d.userId ?? "", f = d.permissionLevel ?? {
              owner: 3,
              admin: 2,
              mod: 1,
              member: 0
            }[d.role] ?? 0, h = f >= 2, y = {
              3: "Owner",
              2: "Admin",
              1: "Mod",
              0: "Member"
            }[f] ?? d.role ?? "Member", p = (d.displayName || d.username || "?")[0].toUpperCase();
            return n.jsxs("div", {
              className: "settings-member-row",
              children: [
                n.jsx("div", {
                  className: "settings-member-avatar",
                  children: p
                }),
                n.jsx("span", {
                  className: "settings-member-name",
                  children: d.displayName || d.username
                }),
                n.jsx("span", {
                  className: `settings-member-role-badge${h ? " settings-member-role-badge--privileged" : ""}`,
                  children: y
                })
              ]
            }, u);
          })
        })
      ]
    });
  }
  function Jc({ getToken: e, serverId: t, showToast: s, members: r = [] }) {
    const [i, o] = a.useState([]), [c, l] = a.useState(false), [d, u] = a.useState(""), [f, h] = a.useState(""), [y, p] = a.useState(""), [S, j] = a.useState(0), [k, D] = a.useState(false), N = a.useRef(null), M = a.useCallback((m) => {
      if (!m.trim() || !(r == null ? void 0 : r.length)) return;
      const C = m.trim().toLowerCase(), L = r.find((A) => (A.username ?? A.displayName ?? "").toLowerCase().includes(C));
      return L ? L.id ?? L.userId : null;
    }, [
      r
    ]), g = a.useCallback(async (m, C) => {
      const L = M(y);
      if (y.trim() && L === null) {
        o([]), D(false), l(false), u("");
        return;
      }
      l(true), u("");
      try {
        const A = e(), x = {
          limit: Ln,
          offset: m
        };
        f && (x.action = f);
        let I;
        if (L) {
          const [U, Z] = await Promise.all([
            Zn(A, t, {
              ...x,
              actorId: L
            }),
            Zn(A, t, {
              ...x,
              targetId: L
            })
          ]), K = /* @__PURE__ */ new Set();
          I = [];
          for (const Q of [
            ...U ?? [],
            ...Z ?? []
          ]) K.has(Q.id) || (K.add(Q.id), I.push(Q));
          I.sort((Q, ne) => new Date(ne.createdAt) - new Date(Q.createdAt)), I = I.slice(0, Ln);
        } else I = await Zn(A, t, x), I = I ?? [];
        D(I.length >= Ln), o(C ? I : (U) => [
          ...U,
          ...I
        ]);
      } catch (A) {
        u(A.message || "Failed to load audit log."), s == null ? void 0 : s({
          message: A.message || "Failed to load audit log.",
          variant: "error"
        });
      } finally {
        l(false);
      }
    }, [
      f,
      y,
      t,
      e,
      s,
      M
    ]);
    a.useEffect(() => {
      j(0), g(0, true);
    }, [
      f,
      t
    ]), a.useEffect(() => (clearTimeout(N.current), N.current = setTimeout(() => {
      j(0), g(0, true);
    }, 400), () => clearTimeout(N.current)), [
      y
    ]);
    const w = a.useCallback(() => {
      const m = S + Ln;
      j(m), g(m, false);
    }, [
      S,
      g
    ]);
    return n.jsxs(n.Fragment, {
      children: [
        n.jsx("div", {
          className: "settings-section-title",
          children: "Audit Log"
        }),
        n.jsxs("div", {
          className: "settings-audit-filter-bar",
          children: [
            n.jsxs("select", {
              className: "settings-audit-select",
              value: f,
              onChange: (m) => h(m.target.value),
              children: [
                n.jsx("option", {
                  value: "",
                  children: "All actions"
                }),
                Hc.map((m) => n.jsx("option", {
                  value: m,
                  children: dr[m] ?? m
                }, m))
              ]
            }),
            n.jsx("input", {
              type: "text",
              className: "settings-audit-input",
              placeholder: "Search by username...",
              value: y,
              onChange: (m) => p(m.target.value)
            })
          ]
        }),
        n.jsxs("div", {
          className: "settings-audit-table-wrap",
          children: [
            c && i.length === 0 && n.jsx("div", {
              className: "settings-audit-empty",
              children: "Loading..."
            }),
            !c && d && n.jsx("div", {
              className: "settings-error-msg",
              children: d
            }),
            !c && !d && i.length === 0 && n.jsx("div", {
              className: "settings-audit-empty",
              children: "No audit log entries found."
            }),
            i.length > 0 && n.jsxs(n.Fragment, {
              children: [
                n.jsxs("table", {
                  className: "settings-audit-table",
                  children: [
                    n.jsx("thead", {
                      children: n.jsxs("tr", {
                        children: [
                          n.jsx("th", {
                            className: "settings-audit-th",
                            children: "Time"
                          }),
                          n.jsx("th", {
                            className: "settings-audit-th",
                            children: "Actor"
                          }),
                          n.jsx("th", {
                            className: "settings-audit-th",
                            children: "Target"
                          }),
                          n.jsx("th", {
                            className: "settings-audit-th",
                            children: "Action"
                          }),
                          n.jsx("th", {
                            className: "settings-audit-th",
                            children: "Reason"
                          })
                        ]
                      })
                    }),
                    n.jsx("tbody", {
                      children: i.map((m, C) => {
                        const A = `settings-audit-td${C % 2 === 0 ? " settings-audit-td--even" : ""}`;
                        return n.jsxs("tr", {
                          children: [
                            n.jsx("td", {
                              className: A,
                              style: {
                                whiteSpace: "nowrap",
                                color: "var(--hush-text-secondary)",
                                fontSize: "0.75rem"
                              },
                              children: Vc(m.createdAt)
                            }),
                            n.jsx("td", {
                              className: A,
                              style: {
                                fontWeight: 500
                              },
                              children: fr(m.actorId, r)
                            }),
                            n.jsx("td", {
                              className: A,
                              style: {
                                color: "var(--hush-text-secondary)"
                              },
                              children: m.targetId ? fr(m.targetId, r) : "\u2014"
                            }),
                            n.jsx("td", {
                              className: A,
                              children: n.jsx("span", {
                                className: Kc(m.action),
                                children: dr[m.action] ?? m.action
                              })
                            }),
                            n.jsx("td", {
                              className: A,
                              style: {
                                color: "var(--hush-text-secondary)"
                              },
                              children: n.jsx("span", {
                                title: m.reason || "",
                                children: Yc(m.reason, 50)
                              })
                            })
                          ]
                        }, m.id);
                      })
                    })
                  ]
                }),
                k && n.jsx("button", {
                  type: "button",
                  className: "settings-audit-load-more",
                  onClick: w,
                  disabled: c,
                  children: c ? "Loading..." : "Load More"
                })
              ]
            })
          ]
        })
      ]
    });
  }
  function Qc({ entry: e, actionLabel: t, onAction: s }) {
    const [r, i] = a.useState(false), [o, c] = a.useState(""), [l, d] = a.useState(false), [u, f] = a.useState(""), h = a.useCallback(async () => {
      if (!o.trim()) {
        f("Reason is required.");
        return;
      }
      d(true), f("");
      try {
        await s(e.userId, o.trim());
      } catch (y) {
        f(y.message || "Action failed."), d(false);
      }
    }, [
      o,
      e.userId,
      s
    ]);
    return n.jsxs("div", {
      className: "settings-bm-row",
      children: [
        n.jsxs("div", {
          className: "settings-bm-row-header",
          children: [
            n.jsxs("div", {
              children: [
                n.jsx("div", {
                  className: "settings-bm-user-id",
                  children: e.userId
                }),
                n.jsxs("div", {
                  className: "settings-bm-meta",
                  children: [
                    "Reason: ",
                    e.reason,
                    " \xB7 ",
                    "Banned: ",
                    ur(e.createdAt),
                    e.expiresAt ? ` \xB7 Expires: ${ur(e.expiresAt)}` : " \xB7 Permanent"
                  ]
                })
              ]
            }),
            !r && n.jsx("button", {
              type: "button",
              className: "settings-bm-action-btn",
              onClick: () => i(true),
              children: t
            })
          ]
        }),
        r && n.jsxs(n.Fragment, {
          children: [
            n.jsx("input", {
              type: "text",
              className: "settings-bm-reason-input",
              placeholder: "Reason (required)",
              value: o,
              onChange: (y) => c(y.target.value),
              disabled: l,
              autoFocus: true
            }),
            u && n.jsx("div", {
              className: "settings-error-msg",
              children: u
            }),
            n.jsxs("div", {
              className: "settings-bm-reason-actions",
              children: [
                n.jsx("button", {
                  type: "button",
                  className: "settings-bm-cancel-btn",
                  onClick: () => {
                    i(false), c(""), f("");
                  },
                  disabled: l,
                  children: "Cancel"
                }),
                n.jsx("button", {
                  type: "button",
                  className: "settings-bm-confirm-btn",
                  onClick: h,
                  disabled: l,
                  children: l ? "Submitting..." : `Confirm ${t}`
                })
              ]
            })
          ]
        })
      ]
    });
  }
  function Zc({ getToken: e, serverId: t, showToast: s }) {
    const [r, i] = a.useState("bans"), [o, c] = a.useState([]), [l, d] = a.useState([]), [u, f] = a.useState(false), [h, y] = a.useState("");
    a.useEffect(() => {
      let N = false;
      async function M() {
        f(true), y("");
        try {
          const g = e(), [w, m] = await Promise.all([
            Ba(g, t),
            $a(g, t)
          ]);
          N || (c(w ?? []), d(m ?? []));
        } catch (g) {
          N || y(g.message || "Failed to load data.");
        } finally {
          N || f(false);
        }
      }
      return M(), () => {
        N = true;
      };
    }, [
      t,
      e
    ]);
    const p = a.useCallback(async (N, M) => {
      const g = e();
      await Oa(g, t, N, M), c((w) => w.filter((m) => m.userId !== N)), s == null ? void 0 : s({
        message: "User unbanned.",
        variant: "success"
      });
    }, [
      e,
      t,
      s
    ]), S = a.useCallback(async (N, M) => {
      const g = e();
      await Pa(g, t, N, M), d((w) => w.filter((m) => m.userId !== N)), s == null ? void 0 : s({
        message: "User unmuted.",
        variant: "success"
      });
    }, [
      e,
      t,
      s
    ]), j = r === "bans" ? o : l, k = r === "bans" ? "Unban" : "Unmute", D = r === "bans" ? p : S;
    return n.jsxs(n.Fragment, {
      children: [
        n.jsx("div", {
          className: "settings-section-title",
          children: "Bans & Mutes"
        }),
        n.jsxs("div", {
          className: "settings-bm-tab-bar",
          children: [
            n.jsxs("button", {
              type: "button",
              className: `settings-bm-tab${r === "bans" ? " settings-bm-tab--active" : ""}`,
              onClick: () => i("bans"),
              children: [
                "Banned Users (",
                o.length,
                ")"
              ]
            }),
            n.jsxs("button", {
              type: "button",
              className: `settings-bm-tab${r === "mutes" ? " settings-bm-tab--active" : ""}`,
              onClick: () => i("mutes"),
              children: [
                "Muted Users (",
                l.length,
                ")"
              ]
            })
          ]
        }),
        u && n.jsx("div", {
          className: "settings-bm-empty",
          children: "Loading..."
        }),
        !u && h && n.jsx("div", {
          className: "settings-error-msg",
          children: h
        }),
        !u && !h && j.length === 0 && n.jsxs("div", {
          className: "settings-bm-empty",
          children: [
            "No active ",
            r === "bans" ? "bans" : "mutes",
            "."
          ]
        }),
        !u && !h && j.map((N) => n.jsx(Qc, {
          entry: N,
          actionLabel: k,
          onAction: D
        }, N.id))
      ]
    });
  }
  function el({ getToken: e, serverId: t, instanceName: s, instanceData: r, isAdmin: i, myRole: o, onClose: c, showToast: l, members: d }) {
    const [u, f] = a.useState(i ? Rn : Dn), [h, y] = a.useState(false), [p, S] = a.useState(false), k = Ns() === "mobile";
    a.useEffect(() => {
      const g = requestAnimationFrame(() => y(true));
      return () => cancelAnimationFrame(g);
    }, []), a.useEffect(() => {
      const g = (w) => {
        w.key === "Escape" && c();
      };
      return document.addEventListener("keydown", g), () => document.removeEventListener("keydown", g);
    }, [
      c
    ]);
    const D = a.useCallback((g) => {
      g.target === g.currentTarget && c();
    }, [
      c
    ]), N = a.useCallback(async () => {
      try {
        await Ta(e(), t), c();
      } catch (g) {
        l == null ? void 0 : l({
          message: g.message || "Failed to leave server",
          variant: "error"
        }), S(false);
      }
    }, [
      e,
      t,
      c,
      l
    ]), M = [
      ...i ? [
        {
          key: Rn,
          label: "Overview"
        }
      ] : [],
      {
        key: Dn,
        label: "Members"
      },
      ...i ? [
        {
          key: ls,
          label: "Audit Log"
        },
        {
          key: ds,
          label: "Bans & Mutes"
        }
      ] : []
    ];
    return Ve.createPortal(n.jsxs("div", {
      className: `settings-overlay${h ? " settings-overlay--open" : ""}${k ? " settings-overlay--mobile" : ""}`,
      onClick: D,
      children: [
        k ? n.jsx("div", {
          className: "settings-mobile-tab-bar",
          children: M.map((g) => n.jsx("button", {
            type: "button",
            className: `settings-mobile-tab-btn${u === g.key ? " settings-mobile-tab-btn--active" : ""}`,
            onClick: () => f(g.key),
            children: g.label
          }, g.key))
        }) : n.jsxs("div", {
          className: "settings-sidebar",
          children: [
            n.jsxs("div", {
              className: "settings-sidebar-group",
              children: [
                n.jsx("div", {
                  className: "settings-sidebar-group-label",
                  children: s ?? "server"
                }),
                M.filter((g) => g.key === Rn || g.key === Dn).map((g) => n.jsx("button", {
                  type: "button",
                  className: `settings-sidebar-item${u === g.key ? " settings-sidebar-item--active" : ""}`,
                  onClick: () => f(g.key),
                  children: g.label
                }, g.key))
              ]
            }),
            i && n.jsxs(n.Fragment, {
              children: [
                n.jsx("div", {
                  className: "settings-sidebar-divider"
                }),
                n.jsxs("div", {
                  className: "settings-sidebar-group",
                  children: [
                    n.jsx("div", {
                      className: "settings-sidebar-group-label",
                      children: "Moderation"
                    }),
                    M.filter((g) => g.key === ls || g.key === ds).map((g) => n.jsx("button", {
                      type: "button",
                      className: `settings-sidebar-item${u === g.key ? " settings-sidebar-item--active" : ""}`,
                      onClick: () => f(g.key),
                      children: g.label
                    }, g.key))
                  ]
                })
              ]
            })
          ]
        }),
        n.jsxs("div", {
          className: `settings-content${k ? " settings-content--mobile" : ""}`,
          children: [
            u === Rn && i && n.jsx(qc, {
              serverName: s
            }),
            u === Dn && n.jsx(Xc, {
              getToken: e,
              serverId: t
            }),
            u === ls && i && n.jsx(Jc, {
              getToken: e,
              serverId: t,
              showToast: l,
              members: d
            }),
            u === ds && i && n.jsx(Zc, {
              getToken: e,
              serverId: t,
              showToast: l
            }),
            o !== "owner" && n.jsxs("div", {
              className: "settings-danger-zone",
              children: [
                n.jsx("div", {
                  className: "settings-danger-title",
                  children: "Danger Zone"
                }),
                n.jsxs("div", {
                  className: "settings-danger-action",
                  children: [
                    n.jsx("span", {
                      className: "settings-danger-action-text",
                      children: "Leave this server. You will lose access to all channels."
                    }),
                    n.jsx("button", {
                      type: "button",
                      className: "btn btn-danger",
                      onClick: () => S(true),
                      children: "Leave Server"
                    })
                  ]
                })
              ]
            })
          ]
        }),
        p && n.jsx(Fs, {
          title: "Leave Server",
          message: `Are you sure you want to leave "${s}"? You will need a new invite to rejoin.`,
          confirmLabel: "Leave",
          onConfirm: N,
          onCancel: () => S(false)
        }),
        n.jsx("button", {
          type: "button",
          className: "settings-close-btn",
          onClick: c,
          title: "Close (Esc)",
          children: "\u2715"
        })
      ]
    }), document.body);
  }
  const us = "text", zt = "voice", Kt = "category", ga = "system";
  function hr(e) {
    try {
      const t = localStorage.getItem(`hush:categories-collapsed:${e}`);
      return t ? JSON.parse(t) : {};
    } catch {
      return {};
    }
  }
  function tl(e, t) {
    try {
      localStorage.setItem(`hush:categories-collapsed:${e}`, JSON.stringify(t));
    } catch {
    }
  }
  const Cs = "__uncategorized__";
  function nl(e) {
    const t = e.filter((d) => d.type !== ga), s = /* @__PURE__ */ new Map();
    s.set(null, []);
    const r = /* @__PURE__ */ new Map(), i = (d, u) => d.position - u.position || (d.name || "").localeCompare(u.name || "");
    t.forEach((d) => {
      if (r.set(d.id, d), d.type === Kt) return;
      const u = d.parentId ?? null;
      s.has(u) || s.set(u, []), s.get(u).push(d);
    }), t.filter((d) => d.type === Kt).forEach((d) => {
      s.has(d.id) || s.set(d.id, []);
    });
    const o = (s.get(null) || []).sort(i);
    s.forEach((d, u) => {
      u !== null && d.sort(i);
    });
    const c = [
      {
        key: null,
        label: null,
        channels: o
      }
    ];
    return t.filter((d) => d.type === Kt).sort(i).forEach((d) => {
      c.push({
        key: d.id,
        label: d.name ?? "Category",
        channels: s.get(d.id) || []
      });
    }), c;
  }
  function sl({ getToken: e, serverId: t, currentUserId: s, onClose: r, onCreated: i }) {
    const [o, c] = a.useState(""), [l, d] = a.useState(us), [u, f] = a.useState("quality"), [h, y] = a.useState(""), [p, S] = a.useState(false), [j, k] = a.useState(false);
    a.useEffect(() => {
      const N = requestAnimationFrame(() => k(true));
      return () => cancelAnimationFrame(N);
    }, []), a.useEffect(() => {
      const N = (M) => {
        M.key === "Escape" && r();
      };
      return document.addEventListener("keydown", N), () => document.removeEventListener("keydown", N);
    }, [
      r
    ]);
    const D = async (N) => {
      N.preventDefault(), y("");
      const M = o.trim();
      if (!M) {
        y("Name is required");
        return;
      }
      const g = e();
      if (!g) {
        y("Not authenticated");
        return;
      }
      S(true);
      try {
        const w = {
          name: M,
          type: l
        };
        l === zt && (w.voiceMode = u);
        const m = await Tr(g, t, w);
        if (l === us && s) try {
          const C = await st(s, _e());
          if (C) {
            const L = await Lt(C);
            await xi({
              db: C,
              token: g,
              credential: L,
              mlsStore: it,
              hushCrypto: Ct,
              api: Fa
            }, m.id);
          }
        } catch (C) {
          console.warn("[ChannelList] MLS group creation failed for channel", m.id, C);
        }
        i(m), r();
      } catch (w) {
        y(w.message || "Failed to create channel");
      } finally {
        S(false);
      }
    };
    return Ve.createPortal(n.jsx("div", {
      className: `modal-backdrop ${j ? "modal-backdrop-open" : ""}`,
      onClick: r,
      children: n.jsxs("div", {
        className: `modal-content ${j ? "modal-content-open" : ""}`,
        onClick: (N) => N.stopPropagation(),
        children: [
          n.jsx("div", {
            className: "modal-title",
            children: "Create channel"
          }),
          n.jsxs("form", {
            className: "modal-form",
            onSubmit: D,
            children: [
              n.jsxs("div", {
                children: [
                  n.jsx("label", {
                    htmlFor: "channel-name",
                    className: "modal-field-label",
                    children: "Name"
                  }),
                  n.jsx("input", {
                    id: "channel-name",
                    name: "channel-name",
                    className: "input",
                    type: "text",
                    placeholder: "general",
                    value: o,
                    onChange: (N) => c(N.target.value),
                    maxLength: 100,
                    autoComplete: "off"
                  })
                ]
              }),
              n.jsxs("div", {
                children: [
                  n.jsx("label", {
                    className: "modal-field-label",
                    htmlFor: "create-channel-type",
                    children: "Type"
                  }),
                  n.jsxs("select", {
                    id: "create-channel-type",
                    className: "input",
                    value: l,
                    onChange: (N) => d(N.target.value),
                    children: [
                      n.jsx("option", {
                        value: us,
                        children: "Text"
                      }),
                      n.jsx("option", {
                        value: zt,
                        children: "Voice"
                      })
                    ]
                  })
                ]
              }),
              l === zt && n.jsxs("div", {
                children: [
                  n.jsx("label", {
                    className: "modal-field-label",
                    htmlFor: "create-channel-voice-mode",
                    children: "Voice mode"
                  }),
                  n.jsxs("select", {
                    id: "create-channel-voice-mode",
                    className: "input",
                    value: u,
                    onChange: (N) => f(N.target.value),
                    children: [
                      n.jsx("option", {
                        value: "quality",
                        children: "Quality"
                      }),
                      n.jsx("option", {
                        value: "low-latency",
                        children: "Low Latency"
                      })
                    ]
                  })
                ]
              }),
              h && n.jsx("div", {
                className: "modal-error",
                children: h
              }),
              n.jsxs("div", {
                className: "modal-actions",
                children: [
                  n.jsx("button", {
                    type: "button",
                    className: "btn btn-secondary",
                    onClick: r,
                    children: "Cancel"
                  }),
                  n.jsx("button", {
                    type: "submit",
                    className: "btn btn-primary",
                    disabled: p,
                    children: p ? "Creating\u2026" : "Create"
                  })
                ]
              })
            ]
          })
        ]
      })
    }), document.body);
  }
  function rl({ getToken: e, serverId: t, onClose: s, onCreated: r }) {
    const [i, o] = a.useState(""), [c, l] = a.useState(""), [d, u] = a.useState(false), [f, h] = a.useState(false);
    a.useEffect(() => {
      const p = requestAnimationFrame(() => h(true));
      return () => cancelAnimationFrame(p);
    }, []), a.useEffect(() => {
      const p = (S) => {
        S.key === "Escape" && s();
      };
      return document.addEventListener("keydown", p), () => document.removeEventListener("keydown", p);
    }, [
      s
    ]);
    const y = async (p) => {
      p.preventDefault(), l("");
      const S = i.trim();
      if (!S) {
        l("Name is required");
        return;
      }
      const j = e();
      if (!j) {
        l("Not authenticated");
        return;
      }
      u(true);
      try {
        const k = await Tr(j, t, {
          name: S,
          type: Kt
        });
        r(k), s();
      } catch (k) {
        l(k.message || "Failed to create category");
      } finally {
        u(false);
      }
    };
    return Ve.createPortal(n.jsx("div", {
      className: `modal-backdrop ${f ? "modal-backdrop-open" : ""}`,
      onClick: s,
      children: n.jsxs("div", {
        className: `modal-content ${f ? "modal-content-open" : ""}`,
        onClick: (p) => p.stopPropagation(),
        children: [
          n.jsx("div", {
            className: "modal-title",
            children: "Create category"
          }),
          n.jsxs("form", {
            className: "modal-form",
            onSubmit: y,
            children: [
              n.jsxs("div", {
                children: [
                  n.jsx("label", {
                    htmlFor: "category-name",
                    className: "modal-field-label",
                    children: "Name"
                  }),
                  n.jsx("input", {
                    id: "category-name",
                    name: "category-name",
                    className: "input",
                    type: "text",
                    placeholder: "Gaming",
                    value: i,
                    onChange: (p) => o(p.target.value),
                    maxLength: 100,
                    autoComplete: "off"
                  })
                ]
              }),
              c && n.jsx("div", {
                className: "modal-error",
                children: c
              }),
              n.jsxs("div", {
                className: "modal-actions",
                children: [
                  n.jsx("button", {
                    type: "button",
                    className: "btn btn-secondary",
                    onClick: s,
                    children: "Cancel"
                  }),
                  n.jsx("button", {
                    type: "submit",
                    className: "btn btn-primary",
                    disabled: d,
                    children: d ? "Creating\u2026" : "Create"
                  })
                ]
              })
            ]
          })
        ]
      })
    }), document.body);
  }
  function al({ getToken: e, serverId: t, guildName: s, instanceUrl: r, getGuildMetadataKey: i, onClose: o }) {
    const [c, l] = a.useState(false), [d, u] = a.useState(""), [f, h] = a.useState(""), [y, p] = a.useState(true), [S, j] = a.useState(false);
    a.useEffect(() => {
      const M = requestAnimationFrame(() => l(true));
      return () => cancelAnimationFrame(M);
    }, []), a.useEffect(() => {
      const M = (g) => {
        g.key === "Escape" && o();
      };
      return document.addEventListener("keydown", M), () => document.removeEventListener("keydown", M);
    }, [
      o
    ]), a.useEffect(() => {
      let M = false;
      return (async () => {
        const g = e();
        if (!g) {
          h("Not authenticated"), p(false);
          return;
        }
        try {
          const w = await Ar(g, t, {}, r ?? "");
          M || (u(w.code), p(false));
        } catch (w) {
          M || (h(w.message || "Failed to create invite"), p(false));
        }
      })(), () => {
        M = true;
      };
    }, [
      e,
      r,
      t
    ]);
    const [k, D] = a.useState("");
    a.useEffect(() => {
      let M = false;
      async function g() {
        if (!d) {
          D("");
          return;
        }
        try {
          const w = typeof i == "function" ? await i() : null;
          M || D(js(window.location.origin, r, d, s, w));
        } catch {
          M || D(js(window.location.origin, r, d, s));
        }
      }
      return g(), () => {
        M = true;
      };
    }, [
      i,
      s,
      r,
      d
    ]);
    const N = async () => {
      try {
        await navigator.clipboard.writeText(k), j(true), setTimeout(() => j(false), 2e3);
      } catch {
      }
    };
    return Ve.createPortal(n.jsx("div", {
      className: `modal-backdrop ${c ? "modal-backdrop-open" : ""}`,
      onClick: o,
      children: n.jsxs("div", {
        className: `modal-content ${c ? "modal-content-open" : ""}`,
        onClick: (M) => M.stopPropagation(),
        children: [
          n.jsx("div", {
            className: "modal-title",
            children: "Invite people"
          }),
          y ? n.jsx("div", {
            style: {
              color: "var(--hush-text-secondary)",
              fontSize: "0.85rem",
              padding: "16px 0"
            },
            children: "Generating invite link..."
          }) : f ? n.jsx("div", {
            className: "modal-error",
            children: f
          }) : n.jsxs("div", {
            style: {
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              marginTop: "8px"
            },
            children: [
              n.jsxs("div", {
                style: {
                  display: "flex",
                  gap: "8px"
                },
                children: [
                  n.jsx("input", {
                    className: "input",
                    readOnly: true,
                    value: k,
                    style: {
                      flex: 1,
                      fontSize: "0.85rem"
                    },
                    onClick: (M) => M.target.select()
                  }),
                  n.jsx("button", {
                    className: "btn btn-primary",
                    onClick: N,
                    style: {
                      whiteSpace: "nowrap"
                    },
                    children: S ? "Copied!" : "Copy link"
                  })
                ]
              }),
              n.jsx("div", {
                style: {
                  fontSize: "0.75rem",
                  color: "var(--hush-text-muted)"
                },
                children: "This invite expires in 7 days and can be used 50 times."
              })
            ]
          }),
          n.jsx("div", {
            className: "modal-actions",
            style: {
              marginTop: "16px"
            },
            children: n.jsx("button", {
              type: "button",
              className: "btn btn-secondary",
              onClick: o,
              children: "Close"
            })
          })
        ]
      })
    }), document.body);
  }
  function il({ group: e, collapsed: t = false, onToggleCollapsed: s, activeChannelId: r, onChannelSelect: i, voiceParticipants: o, isAdmin: c, onDeleteCategory: l, onDeleteChannel: d }) {
    const [u, f] = a.useState(false), h = a.useMemo(() => e.channels.map((m) => m.id), [
      e.channels
    ]), y = e.key !== null, { attributes: p, listeners: S, setNodeRef: j, transform: k, transition: D, isDragging: N, isOver: M } = $s({
      id: e.key ?? Cs,
      disabled: !y || !c
    }), g = n.jsx(Bs, {
      items: h,
      strategy: Ps,
      children: e.channels.map((m) => {
        const C = r === m.id, A = m.type === zt ? (o == null ? void 0 : o.get(m.id)) ?? [] : [];
        return n.jsx(ol, {
          channel: m,
          isActive: C,
          onSelect: () => i(m),
          participantCount: A.length > 0 ? A.length : null,
          voiceParticipants: A,
          isAdmin: c,
          onDelete: () => d == null ? void 0 : d(m)
        }, m.id);
      })
    }), w = {
      willChange: "transform",
      ...M ? {
        background: "var(--hush-hover)"
      } : void 0,
      ...y ? {
        transform: k ? `translate3d(${k.x}px, ${k.y}px, 0)` : void 0,
        transition: D,
        opacity: N ? 0 : 1
      } : void 0
    };
    return y ? n.jsxs("div", {
      ref: j,
      style: w,
      children: [
        n.jsxs("div", {
          className: `cl-category-label${u ? " cl-category-label--hovered" : ""}`,
          style: {
            justifyContent: "space-between"
          },
          onMouseEnter: () => f(true),
          onMouseLeave: () => f(false),
          children: [
            c && n.jsx("span", {
              ...p,
              ...S,
              title: "Drag to reorder",
              className: "cl-category-drag-handle",
              onMouseEnter: (m) => {
                m.currentTarget.style.opacity = "1";
              },
              onMouseLeave: (m) => {
                m.currentTarget.style.opacity = "0.4";
              },
              "aria-hidden": true,
              children: n.jsxs("svg", {
                width: "10",
                height: "10",
                viewBox: "0 0 10 14",
                fill: "currentColor",
                children: [
                  n.jsx("circle", {
                    cx: "2",
                    cy: "2",
                    r: "1.5"
                  }),
                  n.jsx("circle", {
                    cx: "8",
                    cy: "2",
                    r: "1.5"
                  }),
                  n.jsx("circle", {
                    cx: "2",
                    cy: "7",
                    r: "1.5"
                  }),
                  n.jsx("circle", {
                    cx: "8",
                    cy: "7",
                    r: "1.5"
                  }),
                  n.jsx("circle", {
                    cx: "2",
                    cy: "12",
                    r: "1.5"
                  }),
                  n.jsx("circle", {
                    cx: "8",
                    cy: "12",
                    r: "1.5"
                  })
                ]
              })
            }),
            n.jsxs("button", {
              type: "button",
              className: "cl-category-toggle-btn",
              onClick: () => s == null ? void 0 : s(),
              children: [
                n.jsx("svg", {
                  width: "12",
                  height: "12",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: "2",
                  className: `cl-category-chevron${t ? " cl-category-chevron--collapsed" : ""}`,
                  children: n.jsx("polyline", {
                    points: "6 9 12 15 18 9"
                  })
                }),
                e.label
              ]
            }),
            c && n.jsx("button", {
              type: "button",
              title: "Delete category",
              className: "cl-category-delete-btn",
              onMouseEnter: (m) => {
                m.currentTarget.style.opacity = "1";
              },
              onMouseLeave: (m) => {
                m.currentTarget.style.opacity = "0";
              },
              onClick: () => l == null ? void 0 : l(e.key, e.label),
              children: n.jsxs("svg", {
                width: "12",
                height: "12",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "2",
                children: [
                  n.jsx("polyline", {
                    points: "3 6 5 6 21 6"
                  }),
                  n.jsx("path", {
                    d: "M19 6l-1 14H6L5 6"
                  }),
                  n.jsx("path", {
                    d: "M10 11v6M14 11v6"
                  }),
                  n.jsx("path", {
                    d: "M9 6V4h6v2"
                  })
                ]
              })
            })
          ]
        }),
        !t && g
      ]
    }) : n.jsx("div", {
      ref: j,
      children: g
    });
  }
  function va({ channel: e, isActive: t, onSelect: s, participantCount: r, voiceParticipants: i = [], dragStyle: o, dragRef: c, dragListeners: l, isDragging: d, isAdmin: u, onDelete: f }) {
    const h = e.type === zt, y = !t && (e.unreadCount ?? 0) > 0, p = [
      "cl-channel-item",
      t && "cl-channel-item--active",
      y && "unread"
    ].filter(Boolean).join(" ");
    return n.jsxs("div", {
      children: [
        n.jsxs("div", {
          ref: c,
          role: "button",
          tabIndex: 0,
          className: p,
          style: {
            ...o,
            opacity: d ? 0.4 : 1
          },
          onClick: s,
          onKeyDown: (S) => {
            (S.key === "Enter" || S.key === " ") && (S.preventDefault(), s());
          },
          ...l,
          children: [
            y && n.jsx("span", {
              className: "cl-channel-unread-dot",
              "aria-hidden": true
            }),
            n.jsx("span", {
              className: "cl-channel-hash",
              "aria-hidden": true,
              children: h ? n.jsxs("svg", {
                width: "16",
                height: "16",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "2",
                children: [
                  n.jsx("path", {
                    d: "M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"
                  }),
                  n.jsx("path", {
                    d: "M19 10v2a7 7 0 0 1-14 0v-2"
                  }),
                  n.jsx("line", {
                    x1: "12",
                    y1: "19",
                    x2: "12",
                    y2: "23"
                  }),
                  n.jsx("line", {
                    x1: "8",
                    y1: "23",
                    x2: "16",
                    y2: "23"
                  })
                ]
              }) : n.jsx("span", {
                style: {
                  opacity: 0.8
                },
                children: "#"
              })
            }),
            n.jsx("span", {
              className: "cl-channel-name",
              children: e._displayName ?? (e.name || (e.type === "voice" ? "General" : "general"))
            }),
            h && e.voiceMode === "low-latency" && n.jsx("span", {
              className: "cl-voice-mode-badge",
              title: "Low latency",
              children: n.jsx("svg", {
                width: "10",
                height: "10",
                viewBox: "0 0 24 24",
                fill: "currentColor",
                "aria-hidden": "true",
                children: n.jsx("path", {
                  d: "M13 2L3 14h9l-1 8 10-12h-9l1-8z"
                })
              })
            }),
            h && r != null && n.jsx("span", {
              className: "cl-voice-count",
              children: r
            }),
            u && n.jsx("button", {
              type: "button",
              title: "Delete channel",
              className: "cl-channel-delete-btn",
              onMouseEnter: (S) => {
                S.currentTarget.style.opacity = "1";
              },
              onMouseLeave: (S) => {
                S.currentTarget.style.opacity = "0";
              },
              onClick: (S) => {
                S.stopPropagation(), f == null ? void 0 : f();
              },
              children: n.jsxs("svg", {
                width: "12",
                height: "12",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "2",
                children: [
                  n.jsx("polyline", {
                    points: "3 6 5 6 21 6"
                  }),
                  n.jsx("path", {
                    d: "M19 6l-1 14H6L5 6"
                  }),
                  n.jsx("path", {
                    d: "M10 11v6M14 11v6"
                  }),
                  n.jsx("path", {
                    d: "M9 6V4h6v2"
                  })
                ]
              })
            })
          ]
        }),
        i.length > 0 && n.jsx("div", {
          className: "cl-voice-participants",
          children: i.map((S) => {
            const j = S.displayName || S.userId || "Anonymous", k = j.charAt(0).toUpperCase();
            return n.jsxs("div", {
              className: "cl-voice-user",
              title: j,
              children: [
                n.jsx("div", {
                  className: "cl-voice-user-avatar",
                  children: k
                }),
                n.jsx("span", {
                  className: "cl-voice-user-name",
                  children: j
                })
              ]
            }, S.userId);
          })
        })
      ]
    });
  }
  function ol({ channel: e, isActive: t, onSelect: s, participantCount: r, voiceParticipants: i, isAdmin: o, onDelete: c }) {
    const { attributes: l, listeners: d, setNodeRef: u, transform: f, transition: h, isDragging: y } = $s({
      id: e.id,
      disabled: !o
    }), p = {
      transform: yt.Transform.toString(f),
      transition: h
    };
    return n.jsx(va, {
      channel: e,
      isActive: t,
      onSelect: s,
      participantCount: r,
      voiceParticipants: i,
      dragStyle: p,
      dragRef: u,
      dragListeners: o ? {
        ...l,
        ...d
      } : {},
      isDragging: y,
      isAdmin: o,
      onDelete: c
    });
  }
  function cl({ channel: e, isActive: t, onSelect: s, participantCount: r, voiceParticipants: i }) {
    return n.jsx(va, {
      channel: e,
      isActive: t,
      onSelect: s,
      participantCount: r,
      voiceParticipants: i,
      dragStyle: {},
      isDragging: false
    });
  }
  function ll({ position: e, visible: t }) {
    const s = e === "top" ? "uncategorize-top" : "uncategorize-bottom", { setNodeRef: r, isOver: i } = la({
      id: s,
      disabled: !t
    });
    return n.jsxs("div", {
      ref: r,
      style: {
        height: "30px",
        margin: "2px 8px",
        boxSizing: "border-box",
        borderRadius: "4px",
        padding: "0 12px",
        display: "flex",
        alignItems: "center",
        gap: "6px",
        fontSize: "0.72rem",
        userSelect: "none",
        cursor: "default",
        overflow: "hidden",
        opacity: t ? i ? 1 : 0.35 : 0,
        pointerEvents: t ? "auto" : "none",
        color: t && i ? "var(--hush-amber)" : "var(--hush-text-muted)",
        background: t && i ? "color-mix(in srgb, var(--hush-amber) 15%, transparent)" : "transparent",
        border: `1px ${t ? "dashed" : "solid"} ${t && i ? "var(--hush-amber)" : t ? "color-mix(in srgb, var(--hush-text-muted) 50%, transparent)" : "transparent"}`,
        transition: "opacity var(--duration-fast) var(--ease-out), background var(--duration-fast) var(--ease-out), border-color var(--duration-fast) var(--ease-out)"
      },
      children: [
        n.jsxs("svg", {
          width: "14",
          height: "14",
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          strokeWidth: "2",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          style: {
            flexShrink: 0
          },
          children: [
            n.jsx("path", {
              d: "M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"
            }),
            n.jsx("line", {
              x1: "9",
              y1: "12",
              x2: "15",
              y2: "12"
            })
          ]
        }),
        "No category"
      ]
    });
  }
  function dl(e) {
    return e._displayName ? e._displayName : e.name ? e.name : "System";
  }
  function ul({ channel: e, isActive: t, onSelect: s }) {
    const [r, i] = a.useState(false);
    return n.jsxs("div", {
      role: "button",
      tabIndex: 0,
      className: `cl-channel-item cl-channel-item--system${t ? " cl-channel-item--active" : ""}`,
      onClick: s,
      onKeyDown: (o) => {
        (o.key === "Enter" || o.key === " ") && (o.preventDefault(), s());
      },
      children: [
        n.jsx("span", {
          className: "cl-channel-hash",
          "aria-hidden": true,
          children: n.jsx("svg", {
            width: "16",
            height: "16",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            children: n.jsx("path", {
              d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
            })
          })
        }),
        n.jsx("span", {
          className: "cl-channel-name cl-channel-name--muted",
          children: dl(e)
        })
      ]
    });
  }
  function fl({ getToken: e, serverId: t, guildName: s, instanceUrl: r = null, getGuildMetadataKey: i = null, instanceData: o, channels: c, myRole: l, myPermissionLevel: d = 0, activeChannelId: u, onChannelSelect: f, onChannelsUpdated: h, voiceParticipants: y, showToast: p, members: S, currentUserId: j }) {
    var _a2;
    const [k, D] = a.useState(false), [N, M] = a.useState(false), [g, w] = a.useState(false), [m, C] = a.useState(false), [L, A] = a.useState(false), [x, I] = a.useState(null), [U, Z] = a.useState(null), [K, Q] = a.useState(c ?? []), ne = d >= 2 || l === "admin" || l === "owner", X = a.useRef(null), ge = t ? `collapsed_${t}` : "collapsed_default", [ee, ve] = a.useState(() => hr(ge));
    a.useEffect(() => {
      ve(hr(ge));
    }, [
      ge
    ]);
    const Me = a.useCallback((B) => {
      ve((q) => {
        const _ = {
          ...q,
          [B]: !q[B]
        };
        return tl(ge, _), _;
      });
    }, [
      ge
    ]);
    a.useEffect(() => {
      Q(c ?? []);
    }, [
      c
    ]), a.useEffect(() => {
      if (!m) return;
      const B = (q) => {
        X.current && !X.current.contains(q.target) && C(false);
      };
      return document.addEventListener("mousedown", B), () => document.removeEventListener("mousedown", B);
    }, [
      m
    ]);
    const ae = Wr(vs(Vn, {
      activationConstraint: {
        distance: 5
      }
    })), T = a.useCallback(async () => {
      if (!x) return;
      const B = e();
      if (B && t) try {
        await Ua(B, t, x.id);
        const q = await Gt(B, t);
        h == null ? void 0 : h(q);
      } catch {
      }
      I(null);
    }, [
      x,
      e,
      t,
      h
    ]), O = a.useCallback(async () => {
      const B = e();
      if (!(!B || !t)) try {
        const q = await Gt(B, t);
        h == null ? void 0 : h(q);
      } catch {
      }
    }, [
      e,
      t,
      h
    ]), P = nl(K), V = a.useMemo(() => K.filter((B) => B.type === ga), [
      K
    ]), ue = a.useMemo(() => {
      const B = /* @__PURE__ */ new Map();
      return K.forEach((q) => B.set(q.id, q)), B;
    }, [
      K
    ]), we = a.useCallback((B) => {
      Z(B.active.id);
    }, []), J = a.useMemo(() => {
      const B = /* @__PURE__ */ new Set();
      return K.forEach((q) => {
        q.type === Kt && B.add(q.id);
      }), B.add(Cs), B;
    }, [
      K
    ]), Y = a.useMemo(() => P.filter((B) => B.key !== null).map((B) => B.key), [
      P
    ]), Pe = a.useCallback((B) => {
      if (J.has(B.active.id)) {
        const F = (oe) => J.has(oe.id) && oe.id !== Cs, te = Js(B).filter(F);
        return te.length > 0 ? te : bs(B).filter(F);
      }
      const _ = Js(B);
      if (_.length === 0) {
        const F = Kr(B);
        return F.length > 0 ? F : bs(B);
      }
      const $ = _.filter((F) => !J.has(F.id) && F.id !== "uncategorize-bottom");
      return $.length > 0 ? $ : _;
    }, [
      J
    ]), ie = a.useCallback(async (B) => {
      var _a3, _b;
      Z(null);
      const { active: q, over: _ } = B;
      if (!_ || q.id === _.id) return;
      const $ = e();
      if (!$) return;
      if (J.has(q.id) && J.has(_.id)) {
        const ce = (pe, Be) => pe.position - Be.position || (pe.name ?? "").localeCompare(Be.name ?? ""), fe = K.filter((pe) => pe.type === Kt).sort(ce), me = fe.findIndex((pe) => pe.id === q.id), le = fe.findIndex((pe) => pe.id === _.id);
        if (me === -1 || le === -1) return;
        const xe = hn(fe, me, le), Je = new Map(xe.map((pe, Be) => [
          pe.id,
          Be
        ])), De = K;
        Q((pe) => pe.map((Be) => Je.has(Be.id) ? {
          ...Be,
          position: Je.get(Be.id)
        } : Be));
        try {
          await Ws($, t, q.id, {
            parentId: null,
            position: le
          });
          const pe = await Gt($, t);
          h == null ? void 0 : h(pe);
        } catch {
          Q(De);
        }
        return;
      }
      let F = null, te = 0;
      if (_.id === "uncategorize-bottom") F = null, te = ((_a3 = P.find((ce) => ce.key === null)) == null ? void 0 : _a3.channels.length) ?? 0;
      else if (J.has(_.id)) F = _.id, te = 0;
      else for (const ce of P) {
        const fe = ce.channels.findIndex((me) => me.id === _.id);
        if (fe !== -1) {
          F = ce.key, te = fe;
          break;
        }
      }
      const oe = /* @__PURE__ */ new Map(), je = P.find((ce) => ce.channels.some((fe) => fe.id === q.id)), Fe = (je == null ? void 0 : je.key) ?? null;
      if (Fe === F) {
        const ce = je.channels.findIndex((fe) => fe.id === q.id);
        hn(je.channels, ce, te).forEach((fe, me) => {
          oe.set(fe.id, {
            parentId: Fe,
            position: me
          });
        });
      } else {
        ((je == null ? void 0 : je.channels) ?? []).filter((le) => le.id !== q.id).forEach((le, xe) => oe.set(le.id, {
          parentId: Fe,
          position: xe
        }));
        const me = [
          ...((_b = P.find((le) => le.key === F)) == null ? void 0 : _b.channels) ?? []
        ];
        me.splice(te, 0, ue.get(q.id)), me.forEach((le, xe) => oe.set(le.id, {
          parentId: F,
          position: xe
        }));
      }
      const Re = K;
      Q((ce) => ce.map((fe) => {
        const me = oe.get(fe.id);
        return me ? {
          ...fe,
          ...me
        } : fe;
      }));
      try {
        await Ws($, t, q.id, {
          parentId: F,
          position: te
        });
        const ce = await Gt($, t);
        h == null ? void 0 : h(ce);
      } catch {
        Q(Re);
      }
    }, [
      e,
      t,
      P,
      K,
      J,
      h
    ]), H = U && !J.has(U) ? ue.get(U) : null, Se = U && J.has(U) ? P.find((B) => B.key === U) : null;
    return n.jsxs("div", {
      className: "cl-sidebar",
      style: U ? {
        userSelect: "none"
      } : void 0,
      children: [
        n.jsxs("div", {
          className: "cl-header",
          ref: X,
          children: [
            n.jsxs("button", {
              type: "button",
              className: "cl-server-name-btn",
              onClick: () => C((B) => !B),
              title: "Server menu",
              children: [
                n.jsx("span", {
                  className: "cl-guild-name",
                  children: s ?? "Server"
                }),
                n.jsx("svg", {
                  width: "12",
                  height: "12",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: "2.5",
                  className: `cl-server-chevron${m ? " cl-server-chevron--open" : ""}`,
                  children: n.jsx("polyline", {
                    points: "6 9 12 15 18 9"
                  })
                })
              ]
            }),
            n.jsx("div", {
              className: "cl-header-actions",
              children: ne && n.jsxs(n.Fragment, {
                children: [
                  n.jsx("button", {
                    type: "button",
                    className: "cl-add-btn",
                    title: "Create category",
                    onClick: () => M(true),
                    children: n.jsx("svg", {
                      width: "16",
                      height: "16",
                      viewBox: "0 0 24 24",
                      fill: "none",
                      stroke: "currentColor",
                      strokeWidth: "2",
                      strokeLinecap: "round",
                      strokeLinejoin: "round",
                      children: n.jsx("path", {
                        d: "M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"
                      })
                    })
                  }),
                  n.jsx("button", {
                    type: "button",
                    className: "cl-add-btn",
                    title: "Create channel",
                    onClick: () => D(true),
                    children: n.jsxs("svg", {
                      width: "16",
                      height: "16",
                      viewBox: "0 0 24 24",
                      fill: "none",
                      stroke: "currentColor",
                      strokeWidth: "2",
                      strokeLinecap: "round",
                      strokeLinejoin: "round",
                      children: [
                        n.jsx("line", {
                          x1: "12",
                          y1: "5",
                          x2: "12",
                          y2: "19"
                        }),
                        n.jsx("line", {
                          x1: "5",
                          y1: "12",
                          x2: "19",
                          y2: "12"
                        })
                      ]
                    })
                  })
                ]
              })
            }),
            m && n.jsxs("div", {
              className: "cl-server-menu",
              children: [
                n.jsxs("button", {
                  type: "button",
                  className: "cl-server-menu-item",
                  onClick: () => {
                    C(false), w(true);
                  },
                  children: [
                    n.jsxs("svg", {
                      width: "16",
                      height: "16",
                      viewBox: "0 0 24 24",
                      fill: "none",
                      stroke: "currentColor",
                      strokeWidth: "2",
                      strokeLinecap: "round",
                      strokeLinejoin: "round",
                      children: [
                        n.jsx("path", {
                          d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
                        }),
                        n.jsx("circle", {
                          cx: "9",
                          cy: "7",
                          r: "4"
                        }),
                        n.jsx("line", {
                          x1: "19",
                          y1: "8",
                          x2: "19",
                          y2: "14"
                        }),
                        n.jsx("line", {
                          x1: "22",
                          y1: "11",
                          x2: "16",
                          y2: "11"
                        })
                      ]
                    }),
                    "Invite People"
                  ]
                }),
                n.jsxs("button", {
                  type: "button",
                  className: "cl-server-menu-item",
                  onClick: () => {
                    C(false), A(true);
                  },
                  children: [
                    n.jsxs("svg", {
                      width: "16",
                      height: "16",
                      viewBox: "0 0 24 24",
                      fill: "none",
                      stroke: "currentColor",
                      strokeWidth: "2",
                      strokeLinecap: "round",
                      strokeLinejoin: "round",
                      children: [
                        n.jsx("circle", {
                          cx: "12",
                          cy: "12",
                          r: "3"
                        }),
                        n.jsx("path", {
                          d: "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"
                        })
                      ]
                    }),
                    "Server Settings"
                  ]
                })
              ]
            })
          ]
        }),
        n.jsxs(oa, {
          sensors: ae,
          collisionDetection: Pe,
          onDragStart: we,
          onDragEnd: ie,
          children: [
            n.jsxs("div", {
              className: "cl-channel-list",
              children: [
                V.map((B) => n.jsx(ul, {
                  channel: B,
                  isActive: u === B.id,
                  onSelect: () => f(B)
                }, B.id)),
                n.jsx(Bs, {
                  items: Y,
                  strategy: Ps,
                  children: P.map((B) => n.jsx(il, {
                    group: B,
                    collapsed: B.key !== null ? ee[B.key] ?? false : void 0,
                    onToggleCollapsed: B.key !== null ? () => Me(B.key) : void 0,
                    activeChannelId: u,
                    onChannelSelect: f,
                    voiceParticipants: y,
                    isAdmin: ne,
                    onDeleteCategory: (q, _) => I({
                      id: q,
                      name: _,
                      isCategory: true
                    }),
                    onDeleteChannel: (q) => I({
                      id: q.id,
                      name: q.name,
                      isCategory: false
                    })
                  }, B.key ?? "uncategorized"))
                }),
                n.jsx(ll, {
                  position: "bottom",
                  visible: U !== null && !J.has(U) && ((_a2 = ue.get(U)) == null ? void 0 : _a2.parentId) != null
                })
              ]
            }),
            n.jsx(mc, {
              children: H ? n.jsx(cl, {
                channel: H,
                isActive: false,
                onSelect: () => {
                },
                participantCount: H.type === zt && ((y == null ? void 0 : y.get(H.id)) ?? []).length || null
              }) : Se ? n.jsx("div", {
                className: "cl-category-label cl-category-drag-overlay",
                children: Se.label
              }) : null
            })
          ]
        }),
        k && n.jsx(sl, {
          getToken: e,
          serverId: t,
          currentUserId: j,
          onClose: () => D(false),
          onCreated: O
        }),
        N && n.jsx(rl, {
          getToken: e,
          serverId: t,
          onClose: () => M(false),
          onCreated: O
        }),
        g && n.jsx(al, {
          getToken: e,
          serverId: t,
          guildName: s,
          instanceUrl: r,
          getGuildMetadataKey: i,
          onClose: () => w(false)
        }),
        x && n.jsx(Fs, {
          title: x.isCategory ? "Delete category" : "Delete channel",
          message: `Are you sure you want to delete "${x.name}"? This cannot be undone.`,
          confirmLabel: "Delete",
          onConfirm: T,
          onCancel: () => I(null)
        }),
        L && n.jsx(el, {
          getToken: e,
          serverId: t,
          instanceName: s,
          instanceData: o,
          isAdmin: ne,
          myRole: l,
          myPermissionLevel: d,
          onClose: () => A(false),
          showToast: p,
          members: S
        })
      ]
    });
  }
  const mr = {
    owner: {
      background: "var(--hush-amber-ghost)",
      color: "var(--hush-amber)"
    },
    admin: {
      background: "var(--hush-amber-ghost)",
      color: "var(--hush-amber)"
    },
    mod: {
      background: "var(--hush-surface)",
      color: "var(--hush-text-secondary)",
      border: "1px solid var(--hush-border)"
    },
    member: {
      background: "var(--hush-surface)",
      color: "var(--hush-text-muted)",
      border: "1px solid var(--hush-border)"
    }
  }, ya = 220, hl = 120;
  function ml(e, t) {
    const s = window.innerWidth, r = window.innerHeight;
    return {
      left: Math.min(e, s - ya - 8),
      top: Math.min(t, r - hl - 8)
    };
  }
  function pl(e) {
    if (!e) return "";
    const t = new Date(e);
    return isNaN(t.getTime()) ? "" : `Joined ${t.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    })}`;
  }
  function gl({ member: e, position: t, onClose: s, onSendMessage: r, currentUserId: i }) {
    const o = a.useRef(null), c = ml(t.x, t.y);
    a.useEffect(() => {
      const h = (y) => {
        o.current && !o.current.contains(y.target) && s();
      };
      return document.addEventListener("mousedown", h, true), () => document.removeEventListener("mousedown", h, true);
    }, [
      s
    ]), a.useEffect(() => {
      const h = (y) => {
        y.key === "Escape" && s();
      };
      return document.addEventListener("keydown", h), () => document.removeEventListener("keydown", h);
    }, [
      s
    ]);
    const l = e.role ?? "member", d = pl(e.createdAt ?? e.joinedAt), u = e.id ?? e.userId, f = r && u && u !== i;
    return Ve.createPortal(n.jsxs("div", {
      ref: o,
      className: "mpc-card",
      role: "dialog",
      "aria-label": "Member profile",
      style: {
        position: "fixed",
        left: c.left,
        top: c.top,
        width: ya
      },
      children: [
        n.jsx("div", {
          className: "mpc-display-name",
          children: e.displayName || e.username || "Unknown"
        }),
        e.username && n.jsxs("div", {
          className: "mpc-username",
          children: [
            "@",
            e.username
          ]
        }),
        n.jsx("span", {
          className: "mpc-badge",
          style: mr[l] ?? mr.member,
          children: l
        }),
        d && n.jsx("div", {
          className: "mpc-join-date",
          children: d
        }),
        f && n.jsx("button", {
          type: "button",
          className: "mpc-send-btn",
          "data-testid": "send-message-btn",
          onClick: () => {
            r(e), s();
          },
          children: "Send Message"
        })
      ]
    }), document.body);
  }
  const ba = 160, vl = 32, yl = {
    owner: 3,
    admin: 2,
    mod: 1,
    member: 0
  };
  function fs(e) {
    return yl[e] ?? 0;
  }
  function bl(e, t, s) {
    const r = s * vl + 8, i = window.innerWidth, o = window.innerHeight;
    return {
      left: Math.min(e, i - ba - 8),
      top: Math.min(t, o - r - 8)
    };
  }
  function xl(e, t, s) {
    return fs(e) <= fs(t) ? [] : [
      {
        id: "kick",
        label: "Kick",
        minRank: 1
      },
      {
        id: "mute",
        label: "Mute",
        minRank: 1
      },
      {
        id: "ban",
        label: "Ban",
        minRank: 2
      },
      {
        id: "changeRole",
        label: "Change Role",
        minRank: 2
      }
    ].filter((i) => fs(e) >= i.minRank);
  }
  function wl({ x: e, y: t, member: s, myRole: r, onAction: i, onClose: o }) {
    const c = a.useRef(null), l = s.role ?? "member", d = xl(r, l), u = bl(e, t, Math.max(d.length, 1));
    return a.useEffect(() => {
      const f = (h) => {
        c.current && !c.current.contains(h.target) && o();
      };
      return document.addEventListener("mousedown", f, true), () => document.removeEventListener("mousedown", f, true);
    }, [
      o
    ]), a.useEffect(() => {
      const f = (h) => {
        h.key === "Escape" && o();
      };
      return document.addEventListener("keydown", f), () => document.removeEventListener("keydown", f);
    }, [
      o
    ]), d.length === 0 ? null : Ve.createPortal(n.jsx("div", {
      ref: c,
      className: "mcc-menu dropdown-menu",
      role: "menu",
      "aria-label": "Member actions",
      style: {
        position: "fixed",
        left: u.left,
        top: u.top,
        width: ba
      },
      children: d.map((f) => n.jsx("button", {
        type: "button",
        className: `mcc-item${f.id === "kick" || f.id === "ban" ? " mcc-item--danger" : ""}`,
        role: "menuitem",
        onClick: () => {
          i(f.id), o();
        },
        children: f.label
      }, f.id))
    }), document.body);
  }
  const Sl = [
    {
      label: "1 hour",
      value: 3600
    },
    {
      label: "24 hours",
      value: 86400
    },
    {
      label: "7 days",
      value: 604800
    },
    {
      label: "30 days",
      value: 2592e3
    },
    {
      label: "Permanent",
      value: null
    }
  ], jl = [
    {
      label: "Member",
      value: "member"
    },
    {
      label: "Mod",
      value: "mod"
    },
    {
      label: "Admin",
      value: "admin"
    }
  ], Cl = {
    kick: "Kick",
    ban: "Ban",
    mute: "Mute",
    changeRole: "Change Role"
  };
  function kl({ action: e, member: t, onConfirm: s, onClose: r }) {
    const [i, o] = a.useState(false), [c, l] = a.useState(""), [d, u] = a.useState(null), [f, h] = a.useState("member"), [y, p] = a.useState(false), [S, j] = a.useState(""), k = e === "ban" || e === "mute", D = e === "changeRole", N = Cl[e] ?? e, M = (t == null ? void 0 : t.displayName) || (t == null ? void 0 : t.username) || "this user", g = c.trim().length > 0;
    a.useEffect(() => {
      const m = requestAnimationFrame(() => o(true));
      return () => cancelAnimationFrame(m);
    }, []), a.useEffect(() => {
      const m = (C) => {
        C.key === "Escape" && r();
      };
      return document.addEventListener("keydown", m), () => document.removeEventListener("keydown", m);
    }, [
      r
    ]);
    const w = async () => {
      if (!(!g || y)) {
        p(true), j("");
        try {
          const m = {
            reason: c.trim()
          };
          k && (m.expiresIn = d), D && (m.newRole = f), await s(m);
        } catch (m) {
          j((m == null ? void 0 : m.message) || "Action failed. Please try again."), p(false);
        }
      }
    };
    return Ve.createPortal(n.jsx("div", {
      className: `modal-backdrop ${i ? "modal-backdrop-open" : ""}`,
      onClick: r,
      children: n.jsxs("div", {
        className: `modal-content ${i ? "modal-content-open" : ""}`,
        onClick: (m) => m.stopPropagation(),
        children: [
          n.jsxs("div", {
            className: "modal-title",
            children: [
              N,
              " ",
              M
            ]
          }),
          n.jsxs("div", {
            className: "modal-form",
            children: [
              n.jsxs("div", {
                children: [
                  n.jsx("label", {
                    htmlFor: "mod-reason",
                    className: "modal-field-label",
                    children: "Reason (required)"
                  }),
                  n.jsx("textarea", {
                    id: "mod-reason",
                    className: "mod-textarea",
                    value: c,
                    onChange: (m) => l(m.target.value),
                    placeholder: "Describe the reason for this action",
                    disabled: y
                  })
                ]
              }),
              k && n.jsxs("div", {
                children: [
                  n.jsx("label", {
                    htmlFor: "mod-duration",
                    className: "modal-field-label",
                    children: "Duration"
                  }),
                  n.jsx("select", {
                    id: "mod-duration",
                    className: "mod-select",
                    value: d === null ? "permanent" : String(d),
                    onChange: (m) => {
                      const C = m.target.value;
                      u(C === "permanent" ? null : Number(C));
                    },
                    disabled: y,
                    children: Sl.map((m) => n.jsx("option", {
                      value: m.value === null ? "permanent" : String(m.value),
                      children: m.label
                    }, m.label))
                  })
                ]
              }),
              D && n.jsxs("div", {
                children: [
                  n.jsx("label", {
                    htmlFor: "mod-role",
                    className: "modal-field-label",
                    children: "New Role"
                  }),
                  n.jsx("select", {
                    id: "mod-role",
                    className: "mod-select",
                    value: f,
                    onChange: (m) => h(m.target.value),
                    disabled: y,
                    children: jl.map((m) => n.jsx("option", {
                      value: m.value,
                      children: m.label
                    }, m.value))
                  })
                ]
              }),
              S && n.jsx("p", {
                className: "modal-error",
                children: S
              })
            ]
          }),
          n.jsxs("div", {
            className: "modal-actions confirm-modal-actions",
            children: [
              n.jsx("button", {
                type: "button",
                className: "btn btn-secondary",
                onClick: r,
                disabled: y,
                children: "Cancel"
              }),
              n.jsx("button", {
                type: "button",
                className: e === "kick" || e === "ban" ? "btn btn-danger" : "btn btn-primary",
                onClick: w,
                disabled: !g || y,
                children: y ? "Sending\u2026" : N
              })
            ]
          })
        ]
      })
    }), document.body);
  }
  const kt = 0, It = 1, Ht = 2, yn = 3, Nl = {
    [yn]: "OWNERS",
    [Ht]: "ADMIN",
    [It]: "MODS",
    [kt]: "MEMBERS"
  }, El = {
    [yn]: "Owner",
    [Ht]: "Admin",
    [It]: "Mod"
  }, xa = {
    owner: yn,
    admin: Ht,
    mod: It,
    member: kt
  };
  function wa(e) {
    return e.permissionLevel != null ? e.permissionLevel : xa[e.role] ?? kt;
  }
  const Sa = [
    yn,
    Ht,
    It,
    kt
  ];
  function Ml() {
    return typeof window < "u" ? sessionStorage.getItem(Es) ?? sessionStorage.getItem("hush_token") : null;
  }
  function Fn(e) {
    return e.id ?? e.userId ?? "";
  }
  function Rl(e) {
    try {
      return new URL(e).hostname;
    } catch {
      return e;
    }
  }
  function Dl(e) {
    const t = new Map(Sa.map((s) => [
      s,
      []
    ]));
    for (const s of e) {
      const r = wa(s), i = t.has(r) ? r : kt;
      t.get(i).push(s);
    }
    return t;
  }
  function Ll(e, t) {
    return [
      ...e
    ].sort((s, r) => {
      const i = t.has(Fn(s)), o = t.has(Fn(r));
      return i !== o ? i ? -1 : 1 : (s.displayName || "").localeCompare(r.displayName || "");
    });
  }
  const Il = {
    kick: (e) => `${e} was kicked.`,
    ban: (e) => `${e} was banned.`,
    mute: (e) => `${e} was muted.`,
    changeRole: (e) => `${e}'s role was updated.`
  };
  function cn({ members: e = [], onlineUserIds: t = /* @__PURE__ */ new Set(), currentUserId: s = "", myRole: r = "member", myPermissionLevel: i = 0, showToast: o, onMemberUpdate: c, serverId: l, onSendMessage: d, onCloseDrawer: u }) {
    const [f, h] = a.useState(null), [y, p] = a.useState({
      x: 0,
      y: 0
    }), [S, j] = a.useState(null), [k, D] = a.useState(null), N = i > 0 ? i : {
      owner: yn,
      admin: Ht,
      mod: It,
      member: kt
    }[r] ?? kt, M = Dl(e), g = async (w, m, C) => {
      var _a2;
      const L = Ml();
      if (!L) throw new Error("Not authenticated");
      const A = Fn(m), x = m.displayName || m.username || "User";
      switch (w) {
        case "kick":
          await Ka(L, l, A, C.reason);
          break;
        case "ban":
          await za(L, l, A, C.reason, C.expiresIn);
          break;
        case "mute":
          await Wa(L, l, A, C.reason, C.expiresIn);
          break;
        case "changeRole":
          await Ga(L, l, A, xa[C.newRole] ?? kt);
          break;
        default:
          throw new Error(`Unknown action: ${w}`);
      }
      const I = ((_a2 = Il[w]) == null ? void 0 : _a2.call(Il, x)) ?? "Action completed.";
      o == null ? void 0 : o(I, "success"), c == null ? void 0 : c();
    };
    return n.jsxs("div", {
      className: "ml-container ml-panel",
      children: [
        n.jsx("div", {
          className: "ml-list",
          children: Sa.map((w) => {
            const m = M.get(w);
            if (!m || m.length === 0) return null;
            const C = Ll(m, t), L = Nl[w];
            return n.jsxs("div", {
              children: [
                n.jsxs("div", {
                  className: "ml-role-header",
                  children: [
                    L,
                    " - ",
                    C.length
                  ]
                }),
                C.map((A) => {
                  const x = Fn(A), I = t.has(x), U = x === s, Z = wa(A), K = El[Z];
                  return n.jsxs("div", {
                    className: "ml-member-item member-list-row",
                    onClick: (Q) => {
                      h(A), p({
                        x: Q.clientX,
                        y: Q.clientY
                      });
                    },
                    onContextMenu: (Q) => {
                      Q.preventDefault(), !U && N > Z && N >= It && j({
                        member: A,
                        x: Q.clientX,
                        y: Q.clientY
                      });
                    },
                    children: [
                      n.jsx("div", {
                        className: `ml-status-dot${I ? " ml-status-dot--online" : ""}`,
                        "aria-hidden": true
                      }),
                      n.jsxs("span", {
                        className: "ml-member-name",
                        children: [
                          A.displayName || "Unknown",
                          U && " (You)"
                        ]
                      }),
                      A.homeInstance && n.jsx("span", {
                        className: "ml-badge ml-badge--instance",
                        children: Rl(A.homeInstance)
                      }),
                      K && Z >= Ht && n.jsx("span", {
                        className: "ml-badge ml-badge--admin",
                        children: K
                      }),
                      K && Z === It && n.jsx("span", {
                        className: "ml-badge ml-badge--mod",
                        children: K
                      })
                    ]
                  }, x);
                })
              ]
            }, w);
          })
        }),
        f && n.jsx(gl, {
          member: f,
          position: y,
          onClose: () => h(null),
          onSendMessage: d ? (w) => {
            u == null ? void 0 : u(), d(w);
          } : void 0,
          currentUserId: s
        }),
        S && n.jsx(wl, {
          x: S.x,
          y: S.y,
          member: S.member,
          myRole: r,
          onAction: (w) => {
            D({
              action: w,
              member: S.member
            }), j(null);
          },
          onClose: () => j(null)
        }),
        k && n.jsx(kl, {
          action: k.action,
          member: k.member,
          onConfirm: async (w) => {
            await g(k.action, k.member, w), D(null);
          },
          onClose: () => D(null)
        })
      ]
    });
  }
  const _l = {
    member_joined: {
      color: "#4ade80",
      label: "joined"
    },
    member_left: {
      color: "#8888a0",
      label: "left"
    },
    member_kicked: {
      color: "#ef4444",
      label: "kicked"
    },
    member_banned: {
      color: "#ef4444",
      label: "banned"
    },
    member_unbanned: {
      color: "#4ade80",
      label: "unbanned"
    },
    member_muted: {
      color: "#f59e0b",
      label: "muted"
    },
    member_unmuted: {
      color: "#4ade80",
      label: "unmuted"
    },
    role_changed: {
      color: "#3b82f6",
      label: "role changed"
    },
    server_created: {
      color: "#d54f12",
      label: "server created"
    },
    template_partial_failure: {
      color: "#f59e0b",
      label: "setup warning"
    }
  }, Al = {
    color: "var(--hush-text-muted)"
  };
  function pr(e, t) {
    if (!e) return "Unknown User";
    const s = t.find((r) => (r.id ?? r.userId) === e);
    return (s == null ? void 0 : s.displayName) || (s == null ? void 0 : s.username) || "Unknown User";
  }
  function Tl(e) {
    try {
      const t = new Date(e);
      return t.toLocaleTimeString(void 0, {
        hour: "2-digit",
        minute: "2-digit"
      }) + " " + t.toLocaleDateString(void 0, {
        month: "short",
        day: "numeric"
      });
    } catch {
      return "";
    }
  }
  function Ol(e, t) {
    var _a2, _b;
    const s = pr(e.actorId, t), r = pr(e.targetId, t), i = e.reason ? ` -- Reason: ${e.reason}` : "";
    switch (e.eventType) {
      case "member_joined":
        return `${s} joined the server`;
      case "member_left":
        return `${s} left the server`;
      case "member_kicked":
        return `${s} kicked ${r}${i}`;
      case "member_banned":
        return `${s} banned ${r}${i}`;
      case "member_unbanned":
        return `${s} unbanned ${r}`;
      case "member_muted":
        return `${s} muted ${r}${i}`;
      case "member_unmuted":
        return `${s} unmuted ${r}`;
      case "role_changed": {
        const o = ((_a2 = e.metadata) == null ? void 0 : _a2.old_role) ?? "unknown", c = ((_b = e.metadata) == null ? void 0 : _b.new_role) ?? "unknown";
        return `${s} changed ${r}'s role from ${o} to ${c}`;
      }
      case "server_created":
        return `${s} created the server`;
      case "template_partial_failure":
        return "Server setup: some default channels could not be created";
      default:
        return `${s} performed ${e.eventType}`;
    }
  }
  function Pl({ message: e, members: t = [] }) {
    const s = _l[e.eventType] ?? Al, r = Ol(e, t);
    return n.jsxs("div", {
      className: "sys-msg-row",
      style: {
        borderLeft: `4px solid ${s.color}`
      },
      children: [
        n.jsx("span", {
          className: "sys-msg-timestamp",
          children: Tl(e.createdAt)
        }),
        n.jsx("span", {
          className: "sys-msg-text",
          children: r
        })
      ]
    });
  }
  const In = 50;
  function gr({ channel: e, serverId: t, getToken: s, wsClient: r, members: i = [], onToggleDrawer: o, onMobileBack: c }) {
    const [l, d] = a.useState([]), [u, f] = a.useState(true), [h, y] = a.useState(false), [p, S] = a.useState(false), j = a.useRef(null), k = a.useRef(0);
    a.useEffect(() => {
      let N = false;
      d([]), f(true), y(false);
      const M = s();
      if (!M || !t) {
        f(false);
        return;
      }
      return zs(M, t, {
        limit: In
      }).then((g) => {
        if (N) return;
        const w = Array.isArray(g) ? g : [];
        d(w), y(w.length === In);
      }).catch(() => {
        N || d([]);
      }).finally(() => {
        N || f(false);
      }), () => {
        N = true;
      };
    }, [
      t,
      e == null ? void 0 : e.id,
      s
    ]), a.useEffect(() => {
      !u && j.current && (j.current.scrollTop = j.current.scrollHeight);
    }, [
      u
    ]), a.useEffect(() => {
      if (!r) return;
      const N = (M) => {
        M.server_id === t && M.system_message && (d((g) => [
          ...g,
          M.system_message
        ]), requestAnimationFrame(() => {
          if (j.current) {
            const g = j.current;
            g.scrollHeight - g.scrollTop - g.clientHeight < 80 && (g.scrollTop = g.scrollHeight);
          }
        }));
      };
      return r.on("system_message", N), () => r.off("system_message", N);
    }, [
      r,
      t
    ]);
    const D = a.useCallback(() => {
      if (!h || p) return;
      const N = j.current;
      if (!N || N.scrollTop > 40) return;
      S(true), k.current = N.scrollHeight;
      const M = s();
      if (!M) {
        S(false);
        return;
      }
      const g = l[0];
      if (!g) {
        S(false);
        return;
      }
      zs(M, t, {
        before: g.createdAt,
        limit: In
      }).then((w) => {
        const m = Array.isArray(w) ? w : [];
        if (m.length === 0) {
          y(false);
          return;
        }
        d((C) => [
          ...m,
          ...C
        ]), y(m.length === In), requestAnimationFrame(() => {
          j.current && (j.current.scrollTop = j.current.scrollHeight - k.current);
        });
      }).catch(() => {
      }).finally(() => S(false));
    }, [
      h,
      p,
      l,
      s,
      t
    ]);
    return n.jsxs("div", {
      className: "sc-root",
      children: [
        n.jsx("header", {
          className: "sc-header",
          children: n.jsxs("div", {
            className: "sc-header-left",
            children: [
              c ? n.jsx("button", {
                type: "button",
                className: "sc-back-btn",
                onClick: c,
                "aria-label": "Back to channels",
                children: n.jsx("svg", {
                  width: "20",
                  height: "20",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: "2",
                  "aria-hidden": "true",
                  children: n.jsx("polyline", {
                    points: "15 18 9 12 15 6"
                  })
                })
              }) : o ? n.jsx("button", {
                type: "button",
                className: "sc-drawer-toggle",
                onClick: o,
                "aria-label": "Toggle channels",
                children: n.jsxs("svg", {
                  width: "20",
                  height: "20",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: "2",
                  children: [
                    n.jsx("line", {
                      x1: "3",
                      y1: "6",
                      x2: "21",
                      y2: "6"
                    }),
                    n.jsx("line", {
                      x1: "3",
                      y1: "12",
                      x2: "21",
                      y2: "12"
                    }),
                    n.jsx("line", {
                      x1: "3",
                      y1: "18",
                      x2: "21",
                      y2: "18"
                    })
                  ]
                })
              }) : null,
              n.jsxs("span", {
                className: "sc-channel-name",
                children: [
                  n.jsx("svg", {
                    width: "16",
                    height: "16",
                    viewBox: "0 0 24 24",
                    fill: "none",
                    stroke: "currentColor",
                    strokeWidth: "2",
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    children: n.jsx("path", {
                      d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
                    })
                  }),
                  "#",
                  e._displayName ?? e.name ?? ""
                ]
              })
            ]
          })
        }),
        u ? n.jsx("div", {
          className: "sc-empty",
          children: "Loading..."
        }) : l.length === 0 ? n.jsx("div", {
          className: "sc-empty",
          children: "No system messages yet"
        }) : n.jsxs("div", {
          ref: j,
          className: "sc-message-list",
          onScroll: D,
          children: [
            p && n.jsx("div", {
              className: "sc-loading-more",
              children: "Loading older messages..."
            }),
            l.map((N) => n.jsx(Pl, {
              message: N,
              members: i
            }, N.id))
          ]
        })
      ]
    });
  }
  function vr({ channel: e, serverId: t, getToken: s, wsClient: r, members: i = [], showMembers: o = false, onToggleMembers: c, onToggleDrawer: l, onMobileBack: d, sidebarSlot: u = null, baseUrl: f = "" }) {
    const { user: h } = Gn(), y = (h == null ? void 0 : h.id) ?? "", p = a.useCallback(() => st((h == null ? void 0 : h.id) ?? "", _e()), [
      h == null ? void 0 : h.id
    ]), S = a.useCallback(() => Or((h == null ? void 0 : h.id) ?? "", _e()), [
      h == null ? void 0 : h.id
    ]);
    return n.jsxs("div", {
      className: "tc-root",
      children: [
        n.jsxs("header", {
          className: "tc-header",
          children: [
            n.jsxs("div", {
              className: "tc-header-left",
              children: [
                d ? n.jsx("button", {
                  type: "button",
                  className: "tc-back-btn",
                  onClick: d,
                  "aria-label": "Back to channels",
                  children: n.jsx("svg", {
                    width: "20",
                    height: "20",
                    viewBox: "0 0 24 24",
                    fill: "none",
                    stroke: "currentColor",
                    strokeWidth: "2",
                    "aria-hidden": "true",
                    children: n.jsx("polyline", {
                      points: "15 18 9 12 15 6"
                    })
                  })
                }) : l ? n.jsx("button", {
                  type: "button",
                  className: "tc-drawer-toggle",
                  onClick: l,
                  "aria-label": "Toggle channels",
                  children: n.jsxs("svg", {
                    width: "20",
                    height: "20",
                    viewBox: "0 0 24 24",
                    fill: "none",
                    stroke: "currentColor",
                    strokeWidth: "2",
                    children: [
                      n.jsx("line", {
                        x1: "3",
                        y1: "6",
                        x2: "21",
                        y2: "6"
                      }),
                      n.jsx("line", {
                        x1: "3",
                        y1: "12",
                        x2: "21",
                        y2: "12"
                      }),
                      n.jsx("line", {
                        x1: "3",
                        y1: "18",
                        x2: "21",
                        y2: "18"
                      })
                    ]
                  })
                }) : null,
                n.jsxs("span", {
                  className: "tc-channel-name",
                  children: [
                    "#",
                    e._displayName ?? e.name ?? ""
                  ]
                })
              ]
            }),
            c && n.jsx("button", {
              type: "button",
              className: "tc-members-toggle",
              onClick: c,
              "aria-pressed": o,
              children: "Members"
            })
          ]
        }),
        n.jsxs("div", {
          className: "tc-main",
          children: [
            n.jsx("div", {
              className: "tc-chat-area",
              children: n.jsx(gs, {
                channelId: e.id,
                serverId: t,
                currentUserId: y,
                getToken: s,
                getStore: p,
                getHistoryStore: S,
                wsClient: r,
                members: i,
                baseUrl: f
              })
            }),
            u
          ]
        })
      ]
    });
  }
  function ja(e) {
    return e <= 1 ? 1 : e <= 5 ? 2 : 3;
  }
  function Bl(e, t) {
    if (e === 0) return {};
    if (t === "mobile") return e === 1 ? {
      gridTemplateColumns: "1fr"
    } : e === 2 ? {
      gridTemplateColumns: "1fr",
      gridTemplateRows: "1fr 1fr"
    } : {
      gridTemplateColumns: "1fr 1fr"
    };
    const s = ja(e), r = Math.ceil(e / s);
    return s === 1 ? {
      gridTemplateColumns: "1fr",
      gridTemplateRows: "1fr"
    } : {
      gridTemplateColumns: `repeat(${s}, 1fr)`,
      gridTemplateRows: `repeat(${r}, minmax(0, 1fr))`
    };
  }
  function $l(e) {
    if (e.length === 0) return null;
    const t = e.filter((r) => Ys(r.source));
    if (t.length === 1) return t[0].id;
    const s = e.find((r) => r.type === "local" && !Ys(r.source));
    return s ? s.id : e[0].id;
  }
  function Ul(e, t) {
    if (!t) return e;
    const s = e.find((r) => r.id === t);
    return s ? [
      ...e.filter((r) => r.id !== t),
      s
    ] : e;
  }
  function Fl({ track: e }) {
    const t = a.useRef(null);
    return a.useEffect(() => {
      if (!t.current || !e) return;
      const s = t.current;
      return s.srcObject = new MediaStream([
        e
      ]), (async () => {
        try {
          await s.play();
        } catch {
          const i = () => {
            s.play().catch(() => {
            }), document.removeEventListener("touchstart", i), document.removeEventListener("click", i);
          };
          document.addEventListener("touchstart", i, {
            once: true
          }), document.addEventListener("click", i, {
            once: true
          });
        }
      })(), () => {
        s.srcObject = null;
      };
    }, [
      e
    ]), n.jsx("audio", {
      ref: t,
      autoPlay: true,
      playsInline: true,
      style: {
        display: "none"
      }
    });
  }
  function Gl(e, t, s, r, i) {
    const o = [], c = /* @__PURE__ */ new Set();
    for (const [u, f] of e.entries()) if (f.track.kind === "video") {
      if (f.source === ot.SCREEN && !i) continue;
      let h = null;
      if (f.source === ot.SCREEN) {
        for (const [, y] of e.entries()) if (y.source === ot.SCREEN_AUDIO) {
          h = y.track.mediaStreamTrack;
          break;
        }
      }
      o.push({
        id: u,
        type: "local",
        track: f.track.mediaStreamTrack,
        audioTrack: h,
        label: f.source === ot.SCREEN ? "Your Screen" : "Your Webcam",
        source: f.source
      });
    }
    for (const [u, f] of t.entries()) if (f.kind === "video") {
      const h = f.participant.identity, y = f.source, p = y === sn.Source.ScreenShare ? sn.Source.ScreenShareAudio : sn.Source.Microphone;
      let S = null;
      for (const [j, k] of t.entries()) if (k.kind === "audio" && k.source === p && k.participant.identity === h) {
        S = k.track.mediaStreamTrack, c.add(j);
        break;
      }
      o.push({
        id: u,
        type: "remote",
        track: f.track.mediaStreamTrack,
        audioTrack: S,
        label: f.participant.name || f.participant.identity,
        participantId: f.participant.identity,
        source: y === sn.Source.ScreenShare ? ot.SCREEN : ot.WEBCAM
      });
    }
    const l = [];
    for (const [u, f] of t.entries()) f.kind === "audio" && !c.has(u) && l.push({
      id: u,
      track: f.track.mediaStreamTrack
    });
    const d = [];
    for (const [u, f] of s.entries()) f.source === sn.Source.ScreenShare && !r.has(u) && d.push({
      producerId: u,
      peerId: f.participantId,
      peerName: f.participantName
    });
    return {
      allStreams: o,
      orphanAudioConsumers: l,
      unwatchedScreens: d
    };
  }
  function Wl(e) {
    const t = e.trim().split(/\s+/);
    return t.length >= 2 ? (t[0][0] + t[1][0]).toUpperCase() : t[0][0].toUpperCase();
  }
  function zl() {
    return n.jsxs("svg", {
      width: "16",
      height: "16",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      "aria-hidden": "true",
      children: [
        n.jsx("line", {
          x1: "1",
          y1: "1",
          x2: "23",
          y2: "23"
        }),
        n.jsx("path", {
          d: "M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"
        }),
        n.jsx("path", {
          d: "M17 16.95A7 7 0 0 1 5 12v-2m14 0v2c0 .76-.13 1.49-.35 2.17"
        }),
        n.jsx("line", {
          x1: "12",
          y1: "19",
          x2: "12",
          y2: "23"
        }),
        n.jsx("line", {
          x1: "8",
          y1: "23",
          x2: "16",
          y2: "23"
        })
      ]
    });
  }
  function Kl() {
    return n.jsxs("svg", {
      width: "16",
      height: "16",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      "aria-hidden": "true",
      children: [
        n.jsx("path", {
          d: "M3 18v-6a9 9 0 0 1 18 0v6"
        }),
        n.jsx("path", {
          d: "M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"
        }),
        n.jsx("line", {
          x1: "1",
          y1: "1",
          x2: "23",
          y2: "23"
        })
      ]
    });
  }
  function Hl({ localTracks: e, remoteTracks: t, availableScreens: s, watchedScreens: r, loadingScreens: i, isScreenSharing: o, localScreenWatched: c, isMobile: l, breakpoint: d, onWatchScreen: u, onUnwatchScreen: f, onWatchLocalScreen: h, onUnwatchLocalScreen: y, participants: p = [], currentUserId: S, currentDisplayName: j, activeSpeakerIds: k = [], isMicOn: D = true, isDeafened: N = false, voiceMuteStates: M }) {
    const { allStreams: g, orphanAudioConsumers: w, unwatchedScreens: m } = Gl(e, t, s, r, c), C = new Set(k), L = /* @__PURE__ */ new Set();
    for (const T of g) T.type === "local" ? L.add(S) : L.add(T.participantId);
    const A = p.filter((T) => !L.has(T.userId)), x = o && !c, I = g.length + A.length + m.length + (x ? 1 : 0), U = Bl(I, d), Z = $l(g), K = l ? 2 : ja(I), Q = I > 1 && I % K === 1, ne = Ul(g, Z), X = {
      overflow: l && I !== 2 ? "auto" : "hidden",
      alignItems: l && I !== 2 ? "start" : "stretch",
      alignContent: l && I !== 2 ? "start" : void 0,
      ...U
    }, ge = l && I !== 2 ? {
      aspectRatio: "1",
      width: "100%",
      minWidth: 0
    } : {
      display: "contents"
    }, ee = () => l ? {
      gridColumn: "1 / -1",
      aspectRatio: "1",
      width: "100%",
      minWidth: 0
    } : {
      gridColumn: "1 / -1",
      justifySelf: "center",
      width: K === 2 ? "calc(50% - 3px)" : "calc(33.33% - 4px)",
      display: "block",
      minHeight: 0
    }, ve = (T) => Q && m.length === 0 && T === Z ? ee() : ge, Me = (T) => Q && T === m.length - 1 ? ee() : ge, ae = () => Q && m.length === 0 ? ee() : ge;
    return n.jsxs(n.Fragment, {
      children: [
        n.jsx("div", {
          className: "vg-streams-area",
          style: X,
          children: I === 0 ? n.jsx("div", {
            className: "vg-empty"
          }) : n.jsxs(n.Fragment, {
            children: [
              ne.map((T) => {
                const O = T.type === "local" ? S : T.participantId, P = T.type === "local" && !D ? false : C.has(O);
                return n.jsx("div", {
                  style: ve(T.id),
                  className: P ? "vg-tile-speaking" : void 0,
                  children: n.jsx(wi, {
                    track: T.track,
                    audioTrack: T.audioTrack,
                    label: T.label,
                    source: T.source,
                    isLocal: T.type === "local",
                    objectFit: l ? "cover" : "contain",
                    isSpeaking: P,
                    onUnwatch: T.type === "remote" && T.source === ot.SCREEN ? () => f(T.id) : T.type === "local" && T.source === ot.SCREEN ? y : void 0,
                    standByAfterMs: T.source === ot.SCREEN ? Ai : void 0
                  })
                }, T.id);
              }),
              A.map((T) => {
                const O = T.userId === S, P = O ? "You" : T.displayName || "Anonymous", V = !O && (M == null ? void 0 : M.get(T.userId)), ue = O ? !D : (V == null ? void 0 : V.isMuted) ?? false, we = O ? N : (V == null ? void 0 : V.isDeafened) ?? false, Y = `vg-placeholder-tile${(ue ? false : C.has(T.userId)) ? " vg-speaking" : ""}`;
                return n.jsx("div", {
                  style: ge,
                  children: n.jsxs("div", {
                    className: Y,
                    children: [
                      n.jsx("div", {
                        className: "vg-placeholder-avatar",
                        children: Wl(P)
                      }),
                      n.jsx("span", {
                        className: "vg-placeholder-name",
                        children: P
                      }),
                      (ue || we) && n.jsxs("div", {
                        className: "vg-status-overlays",
                        children: [
                          ue && n.jsx("div", {
                            className: "vg-mute-overlay",
                            children: n.jsx(zl, {})
                          }),
                          we && n.jsx("div", {
                            className: "vg-mute-overlay",
                            children: n.jsx(Kl, {})
                          })
                        ]
                      })
                    ]
                  })
                }, `placeholder-${T.userId}`);
              }),
              x && n.jsx("div", {
                style: ae(),
                children: n.jsx(Ks, {
                  isSelf: true,
                  onWatch: h
                })
              }, "local-screen-card"),
              m.map((T, O) => n.jsx("div", {
                style: Me(O),
                children: n.jsx(Ks, {
                  peerName: T.peerName,
                  isLoading: i.has(T.producerId),
                  onWatch: () => u(T.producerId)
                })
              }, T.producerId))
            ]
          })
        }),
        w.map((T) => n.jsx(Fl, {
          track: T.track
        }, T.id))
      ]
    });
  }
  function Vl({ isReconnecting: e, hasFailed: t, onRejoin: s }) {
    return !e && !t ? null : n.jsxs("div", {
      role: "status",
      "aria-live": "polite",
      style: {
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0, 0, 0, 0.72)",
        backdropFilter: "blur(4px)",
        zIndex: 10,
        gap: "16px"
      },
      children: [
        e && !t && n.jsxs(n.Fragment, {
          children: [
            n.jsx("span", {
              className: "vc-reconnect-pulse",
              style: {
                display: "inline-block",
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                background: "var(--hush-accent, #7c6af7)",
                animation: "pulse 1.2s ease-in-out infinite"
              },
              "aria-hidden": "true"
            }),
            n.jsx("p", {
              style: {
                color: "var(--hush-text)",
                fontSize: "0.95rem",
                margin: 0
              },
              children: "Reconnecting to voice..."
            })
          ]
        }),
        t && n.jsxs(n.Fragment, {
          children: [
            n.jsx("p", {
              style: {
                color: "var(--hush-text)",
                fontSize: "0.95rem",
                margin: 0
              },
              children: "Voice connection lost."
            }),
            n.jsx("button", {
              type: "button",
              className: "btn btn-primary",
              onClick: s,
              style: {
                padding: "8px 20px"
              },
              children: "Rejoin"
            })
          ]
        })
      ]
    });
  }
  function _n(e) {
    return {
      width: "6px",
      height: "6px",
      borderRadius: "50%",
      background: e ? "var(--hush-live)" : "var(--hush-text-muted)",
      boxShadow: e ? "0 0 6px var(--hush-live-glow)" : "none"
    };
  }
  function Yl(e) {
    if (!e || typeof e != "string") return "Something went wrong. Please try again.";
    const t = e.trim();
    return t.length <= 80 && !t.includes("http") && !/^[A-Za-z]+Error:/i.test(t) ? t : /room not found|not found/i.test(t) ? "Room not found." : /disconnected|disconnect/i.test(t) ? t : "Something went wrong. Please try again.";
  }
  function yr({ channel: e, serverId: t, getToken: s, wsClient: r, recipientUserIds: i = [], members: o = [], onlineUserIds: c, myRole: l = "member", showToast: d, onMemberUpdate: u, showMembers: f = false, showChatPanel: h = false, showParticipantsPanel: y = false, onTogglePanel: p, onLeave: S, onOrbPhaseChange: j, serverParticipants: k = [], voiceMuteStates: D, onMobileBack: N, voiceControlsRef: M, onVoiceStateChange: g, baseUrl: w = "" }) {
    const m = Ms(), C = Ns(), L = C === "mobile", { user: A } = Gn(), x = (A == null ? void 0 : A.id) ?? "", I = (A == null ? void 0 : A.displayName) ?? "Anonymous", U = a.useMemo(() => k.filter((z) => z.userId !== x), [
      k,
      x
    ]), Z = k.length, [K, Q] = a.useState(Ti), [ne, X] = a.useState(null), [ge, ee] = a.useState(null), [ve, Me] = a.useState(null), ae = a.useRef({
      bytesSent: null,
      timestamp: null
    }), [T, O] = a.useState(false), [P, V] = a.useState(false), [ue, we] = a.useState(false), [J, Y] = a.useState(false), [Pe, ie] = a.useState(false), [H, Se] = a.useState(null), [B, q] = a.useState(false), [_, $] = a.useState(false), [F, te] = a.useState(false), [oe, je] = a.useState(0), [Fe, Re] = a.useState(false), ce = a.useRef(false), fe = a.useRef(false), me = a.useRef(null), le = `channel-${e.id}`, xe = e.voiceMode === "low-latency", Je = a.useCallback(() => st((A == null ? void 0 : A.id) ?? "", _e()), [
      A == null ? void 0 : A.id
    ]), { isReady: De, error: pe, localTracks: Be, remoteTracks: _t, connectRoom: dt, disconnectRoom: ut, publishScreen: Ge, unpublishScreen: Xt, switchScreenSource: ft, changeQuality: Nt, publishWebcam: Et, unpublishWebcam: ye, publishMic: Ne, unpublishMic: Le, muteMic: We, unmuteMic: Ie, updateMicFilterSettings: Te, availableScreens: ze, watchedScreens: at, loadingScreens: Ee, watchScreen: qe, unwatchScreen: Xe, isE2EEEnabled: Ke, voiceEpoch: de, isVoiceReconnecting: be, voiceReconnectFailed: Qe, activeSpeakerIds: tt } = Si({
      wsClient: r,
      getToken: s,
      currentUserId: x,
      getStore: Je,
      voiceKeyRotationHours: void 0,
      isLowLatency: xe
    }), He = De ? U.length > 0 ? "activating" : "waiting" : "idle";
    a.useEffect(() => {
      j == null ? void 0 : j(He);
    }, [
      He,
      j
    ]);
    const Ze = a.useRef(dt);
    Ze.current = dt;
    const Mt = a.useRef(ut);
    Mt.current = ut;
    const { audioDevices: Jt, videoDevices: mt, selectedMicId: bt, selectedWebcamId: ht, selectMic: Xn, selectWebcam: bn, hasSavedMic: $e, hasSavedWebcam: Rt, requestPermission: xt } = Ha();
    a.useEffect(() => {
      pe && pe.toLowerCase().includes("muted") && (d == null ? void 0 : d({
        message: pe,
        variant: "error"
      }), S == null ? void 0 : S());
    }, [
      pe,
      d,
      S
    ]);
    const At = a.useRef(false);
    a.useEffect(() => {
      !De || At.current || (At.current = true, (async () => {
        try {
          $e ? (await Ne(bt), gt.current = true, V(true)) : (await xt("audio"), $(true));
        } catch (z) {
          console.warn("[VoiceChannel] Auto-mic failed:", z);
        }
      })());
    }, [
      De,
      $e,
      bt,
      Ne,
      xt
    ]), a.useEffect(() => !r || !(e == null ? void 0 : e.id) ? void 0 : (Ze.current(le, I, e.id).catch(() => {
    }), typeof window < "u" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") ? (X("source"), ee(100), Q("source")) : ji().then((Ce) => {
      const vt = Ci(Ce);
      X(vt.key), ee(vt.uploadMbps), Q(vt.key);
    }), () => {
      Mt.current();
    }), [
      r,
      e == null ? void 0 : e.id,
      le,
      I
    ]), a.useEffect(() => {
      const Ce = Array.from(Be.entries()).filter(([, St]) => St.source === ot.SCREEN || St.source === ot.WEBCAM).map(([, St]) => St.track);
      if (Ce.length === 0) {
        Me(null), ae.current = {
          bytesSent: null,
          timestamp: null
        };
        return;
      }
      const vt = setInterval(async () => {
        const { bytesSent: St, timestamp: Nn } = ae.current, v = await ki(Ce, St, Nn);
        ae.current = {
          bytesSent: v.bytesSent,
          timestamp: v.timestamp
        }, Me(v.mbps > 0 ? Math.round(v.mbps * 10) / 10 : null);
      }, 2e3);
      return () => clearInterval(vt);
    }, [
      Be
    ]), a.useEffect(() => {
      ce.current = h, h && je(0);
    }, [
      h
    ]);
    const xn = a.useCallback(() => {
      ce.current || je((z) => z + 1);
    }, []);
    a.useEffect(() => {
      fe.current = y, y && Re(false);
    }, [
      y
    ]), a.useEffect(() => {
      if (!De) return;
      if (me.current === null) {
        me.current = new Set(U.map((Ce) => Ce.userId));
        return;
      }
      U.some((Ce) => !me.current.has(Ce.userId)) && !fe.current && Re(true), U.forEach((Ce) => me.current.add(Ce.userId));
    }, [
      U,
      De
    ]), a.useEffect(() => {
      T || q(false);
    }, [
      T
    ]), a.useEffect(() => {
      if (!H) return;
      const z = setTimeout(() => Se(null), 4e3);
      return () => clearTimeout(z);
    }, [
      H
    ]);
    const pt = async () => {
      xe || (T ? (await Xt(), O(false)) : ie(true));
    }, wn = async (z) => {
      var _a2;
      ie(false), Q(z);
      try {
        const Ce = await Ge(z);
        if (!Ce) return;
        O(true), (_a2 = Ce.getVideoTracks()[0]) == null ? void 0 : _a2.addEventListener("ended", () => O(false));
      } catch (Ce) {
        console.error("[VoiceChannel] Screen share failed:", Ce);
      }
    }, Sn = async () => {
      var _a2;
      if (!(!T || xe)) try {
        const z = await ft(K);
        z && ((_a2 = z.getVideoTracks()[0]) == null ? void 0 : _a2.addEventListener("ended", () => O(false)));
      } catch (z) {
        console.error("[VoiceChannel] Switch screen source failed:", z);
      }
    }, Tt = async (z) => {
      if (T) try {
        await Nt(z), Q(z), ie(false);
      } catch (Ce) {
        Se((Ce == null ? void 0 : Ce.message) || "Quality change failed");
      }
      else await wn(z);
    }, gt = a.useRef(false), Qt = async () => {
      P ? (await We(), V(false)) : !gt.current && !$e ? (await xt("audio"), $(true)) : gt.current ? (await Ie(), V(true)) : (await Ne(bt), gt.current = true, V(true));
    }, Jn = async (z) => {
      $(false), Xn(z), gt.current && await Le(), await Ne(z), gt.current = true, V(true);
    }, Dt = async () => {
      xe || (J ? (await ye(), Y(false)) : Rt ? (await Et(ht), Y(true)) : (await xt("video"), te(true)));
    }, et = async (z) => {
      te(false), bn(z), J && await ye(), await Et(z), Y(true);
    }, Ae = async () => {
      await xt("audio"), $(true);
    }, jn = a.useRef(false), Ot = a.useCallback(() => {
      we((z) => {
        const Ce = !z;
        return document.querySelectorAll("audio[autoplay]").forEach((vt) => {
          vt.muted = Ce;
        }), Ce ? (jn.current = P, P && We().then(() => V(false))) : jn.current && gt.current && Ie().then(() => V(true)), Ce;
      });
    }, [
      P,
      We,
      Ie
    ]), Cn = a.useRef(Qt);
    Cn.current = Qt;
    const Pt = a.useRef(pt);
    Pt.current = pt;
    const kn = a.useRef(Sn);
    kn.current = Sn;
    const Zt = a.useRef(Dt);
    Zt.current = Dt;
    const nt = a.useRef(Te);
    nt.current = Te, a.useEffect(() => {
      M && (M.current = {
        toggleMic: () => Cn.current(),
        toggleDeafen: Ot,
        toggleScreenShare: () => Pt.current(),
        switchScreenSource: () => kn.current(),
        toggleWebcam: () => Zt.current(),
        updateMicFilterSettings: (z) => nt.current(z),
        isScreenSharing: T,
        isWebcamOn: J,
        isLowLatency: xe
      }), g == null ? void 0 : g({
        isMicOn: P,
        isDeafened: ue,
        isScreenSharing: T,
        isWebcamOn: J
      }), typeof (r == null ? void 0 : r.send) == "function" && t && r.send("voice.mute_state", {
        server_id: t,
        channel_id: e.id,
        user_id: x,
        is_muted: !P,
        is_deafened: ue
      });
    }, [
      M,
      P,
      ue,
      T,
      J,
      xe,
      Ot,
      g,
      r,
      t,
      e == null ? void 0 : e.id,
      x,
      Te
    ]);
    const wt = async () => {
      await xt("video"), te(true);
    }, en = async () => {
      try {
        await ut();
      } catch (z) {
        console.error("[VoiceChannel] Leave error:", z);
      }
      if (S) S();
      else {
        const z = t ? `/servers/${t}/channels` : "/";
        m(z);
      }
    }, Qn = a.useCallback(async () => {
      try {
        await ut();
      } catch (z) {
        console.warn("[VoiceChannel] Rejoin disconnect error:", z);
      }
      try {
        await dt(le, I, e.id);
      } catch (z) {
        console.error("[VoiceChannel] Rejoin connect error:", z);
      }
    }, [
      ut,
      dt,
      le,
      I,
      e.id
    ]);
    if (pe) {
      const z = Yl(pe);
      return n.jsx("div", {
        className: "vc-page",
        children: n.jsxs("div", {
          className: "vc-error-center",
          children: [
            n.jsx("p", {
              className: "vc-error-text",
              children: z
            }),
            n.jsx("button", {
              type: "button",
              className: "btn btn-primary",
              onClick: en,
              style: {
                padding: "10px 20px"
              },
              children: "Leave"
            })
          ]
        })
      });
    }
    return n.jsxs("div", {
      className: "vc-page",
      children: [
        n.jsxs("div", {
          className: "vc-header",
          children: [
            n.jsxs("div", {
              className: "vc-header-left",
              children: [
                N && n.jsx("button", {
                  type: "button",
                  className: "vc-back-btn",
                  onClick: N,
                  "aria-label": "Back to channels",
                  children: n.jsx("svg", {
                    width: "20",
                    height: "20",
                    viewBox: "0 0 24 24",
                    fill: "none",
                    stroke: "currentColor",
                    strokeWidth: "2",
                    "aria-hidden": "true",
                    children: n.jsx("polyline", {
                      points: "15 18 9 12 15 6"
                    })
                  })
                }),
                n.jsxs("span", {
                  className: "vc-room-title",
                  children: [
                    "#",
                    e._displayName ?? e.name ?? ""
                  ]
                }),
                be ? n.jsx("div", {
                  role: "status",
                  className: "vc-reconnecting",
                  children: "Reconnecting..."
                }) : n.jsxs("span", {
                  className: "vc-secure-live-badge",
                  title: Ke ? `Encrypted${de != null ? ` \xB7 Epoch ${de}` : ""} \xB7 Live` : "Live",
                  children: [
                    Ke ? n.jsxs("svg", {
                      width: "12",
                      height: "12",
                      viewBox: "0 0 24 24",
                      fill: "none",
                      stroke: "currentColor",
                      strokeWidth: "2",
                      "aria-hidden": "true",
                      children: [
                        n.jsx("rect", {
                          x: "3",
                          y: "11",
                          width: "18",
                          height: "11",
                          rx: "2",
                          ry: "2"
                        }),
                        n.jsx("path", {
                          d: "M7 11V7a5 5 0 0 1 10 0v4"
                        })
                      ]
                    }) : n.jsx("span", {
                      className: "live-dot"
                    }),
                    "Live"
                  ]
                }),
                xe && n.jsxs("span", {
                  className: "vc-mode-badge",
                  title: "Audio processing bypassed for lowest latency",
                  children: [
                    n.jsx("svg", {
                      width: "10",
                      height: "10",
                      viewBox: "0 0 24 24",
                      fill: "currentColor",
                      "aria-hidden": "true",
                      children: n.jsx("path", {
                        d: "M13 2L3 14h9l-1 8 10-12h-9l1-8z"
                      })
                    }),
                    "Performance"
                  ]
                })
              ]
            }),
            n.jsxs("div", {
              className: "vc-header-right",
              children: [
                n.jsxs("button", {
                  className: "vc-participant-count",
                  title: "Chat",
                  onClick: () => p("chat"),
                  children: [
                    n.jsx("svg", {
                      width: "14",
                      height: "14",
                      viewBox: "0 0 24 24",
                      fill: "none",
                      stroke: "currentColor",
                      strokeWidth: "2",
                      children: n.jsx("path", {
                        d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                      })
                    }),
                    oe > 0 && n.jsx("span", {
                      className: "vc-unread-dot"
                    })
                  ]
                }),
                n.jsxs("button", {
                  className: "vc-participant-count",
                  title: "Participants",
                  onClick: () => p("participants"),
                  children: [
                    n.jsxs("svg", {
                      width: "14",
                      height: "14",
                      viewBox: "0 0 24 24",
                      fill: "none",
                      stroke: "currentColor",
                      strokeWidth: "2",
                      children: [
                        n.jsx("path", {
                          d: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
                        }),
                        n.jsx("circle", {
                          cx: "9",
                          cy: "7",
                          r: "4"
                        }),
                        n.jsx("path", {
                          d: "M23 21v-2a4 4 0 0 0-3-3.87"
                        }),
                        n.jsx("path", {
                          d: "M16 3.13a4 4 0 0 1 0 7.75"
                        })
                      ]
                    }),
                    Z || 1,
                    Fe && n.jsx("span", {
                      className: "vc-unread-dot"
                    })
                  ]
                }),
                n.jsx("button", {
                  className: "vc-members-toggle",
                  title: "Members",
                  onClick: () => p("members"),
                  "aria-pressed": f,
                  children: n.jsxs("svg", {
                    width: "16",
                    height: "16",
                    viewBox: "0 0 24 24",
                    fill: "none",
                    stroke: "currentColor",
                    strokeWidth: "2",
                    "aria-hidden": "true",
                    children: [
                      n.jsx("path", {
                        d: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
                      }),
                      n.jsx("circle", {
                        cx: "9",
                        cy: "7",
                        r: "4"
                      }),
                      n.jsx("path", {
                        d: "M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
                      })
                    ]
                  })
                })
              ]
            })
          ]
        }),
        n.jsxs("div", {
          className: "vc-main",
          children: [
            n.jsxs("div", {
              className: "vc-content",
              style: {
                position: "relative"
              },
              children: [
                n.jsx(Vl, {
                  isReconnecting: be,
                  hasFailed: Qe,
                  onRejoin: Qn
                }),
                n.jsx(Hl, {
                  localTracks: Be,
                  remoteTracks: _t,
                  availableScreens: ze,
                  watchedScreens: at,
                  loadingScreens: Ee,
                  isScreenSharing: T,
                  localScreenWatched: B,
                  isMobile: L,
                  breakpoint: C,
                  onWatchScreen: qe,
                  onUnwatchScreen: Xe,
                  onWatchLocalScreen: () => q(true),
                  onUnwatchLocalScreen: () => q(false),
                  participants: k,
                  currentUserId: x,
                  currentDisplayName: I,
                  activeSpeakerIds: tt,
                  isMicOn: P,
                  isDeafened: ue,
                  voiceMuteStates: D
                }),
                L && n.jsx(Ni, {
                  isReady: De,
                  isScreenSharing: T,
                  isMicOn: P,
                  isDeafened: ue,
                  isWebcamOn: J,
                  quality: K,
                  isMobile: L,
                  showScreenShare: !xe,
                  showWebcam: !xe,
                  showQualityPicker: !xe,
                  onScreenShare: pt,
                  onOpenQualityOrWindow: () => ie(true),
                  onMic: Qt,
                  onDeafen: Ot,
                  onWebcam: Dt,
                  onMicDeviceSwitch: Ae,
                  onWebcamDeviceSwitch: wt,
                  onLeave: en
                })
              ]
            }),
            L ? n.jsxs(n.Fragment, {
              children: [
                n.jsx("div", {
                  className: `sidebar-overlay ${y ? "sidebar-overlay-open" : ""}`,
                  onClick: () => p("participants"),
                  "aria-hidden": !y
                }),
                n.jsx("div", {
                  className: `sidebar-panel-right ${y ? "sidebar-panel-open" : ""}`,
                  children: n.jsxs("div", {
                    className: "vc-sidebar-section",
                    children: [
                      n.jsxs("div", {
                        className: "vc-sidebar-label",
                        children: [
                          "Participants (",
                          Z || 1,
                          ")"
                        ]
                      }),
                      n.jsxs("div", {
                        className: "vc-peer-item",
                        children: [
                          n.jsx("div", {
                            style: _n(T)
                          }),
                          n.jsx("span", {
                            children: "You"
                          })
                        ]
                      }),
                      U.map((z) => n.jsxs("div", {
                        className: "vc-peer-item",
                        children: [
                          n.jsx("div", {
                            style: _n(true)
                          }),
                          n.jsx("span", {
                            children: z.displayName
                          })
                        ]
                      }, z.userId))
                    ]
                  })
                }),
                n.jsx("div", {
                  className: `sidebar-overlay ${h ? "sidebar-overlay-open" : ""}`,
                  onClick: () => p("chat"),
                  "aria-hidden": !h
                }),
                n.jsx("div", {
                  className: `sidebar-panel-right ${h ? "sidebar-panel-open" : ""}`,
                  children: n.jsxs("div", {
                    className: "vc-sidebar-section",
                    children: [
                      n.jsx("div", {
                        className: "vc-sidebar-label",
                        children: "Chat"
                      }),
                      n.jsx(gs, {
                        channelId: e.id,
                        serverId: t,
                        currentUserId: x,
                        getToken: s,
                        getStore: Je,
                        wsClient: r,
                        recipientUserIds: i,
                        members: o,
                        onNewMessage: xn,
                        baseUrl: w
                      })
                    ]
                  })
                }),
                n.jsx("div", {
                  className: `sidebar-overlay ${f ? "sidebar-overlay-open" : ""}`,
                  onClick: () => p("members"),
                  "aria-hidden": !f
                }),
                n.jsx("div", {
                  className: `sidebar-panel-right ${f ? "sidebar-panel-open" : ""}`,
                  children: n.jsx(cn, {
                    members: o,
                    onlineUserIds: c ?? /* @__PURE__ */ new Set(),
                    currentUserId: x,
                    myRole: l,
                    showToast: d,
                    onMemberUpdate: u
                  })
                })
              ]
            }) : n.jsxs(n.Fragment, {
              children: [
                n.jsx("div", {
                  className: `sidebar-desktop ${y ? "sidebar-desktop-open" : ""}`,
                  children: n.jsx("div", {
                    className: "sidebar-desktop-inner vc-sidebar-inner",
                    children: n.jsxs("div", {
                      className: "vc-sidebar-section--participants",
                      children: [
                        n.jsxs("div", {
                          className: "vc-sidebar-label",
                          style: {
                            padding: "0 0 8px"
                          },
                          children: [
                            "Participants (",
                            Z || 1,
                            ")"
                          ]
                        }),
                        n.jsxs("div", {
                          className: "vc-peer-item",
                          children: [
                            n.jsx("div", {
                              style: _n(T)
                            }),
                            n.jsx("span", {
                              children: "You"
                            })
                          ]
                        }),
                        U.map((z) => n.jsxs("div", {
                          className: "vc-peer-item",
                          children: [
                            n.jsx("div", {
                              style: _n(true)
                            }),
                            n.jsx("span", {
                              children: z.displayName
                            })
                          ]
                        }, z.userId))
                      ]
                    })
                  })
                }),
                n.jsx("div", {
                  className: `sidebar-desktop ${h ? "sidebar-desktop-open" : ""}`,
                  children: n.jsxs("div", {
                    className: "sidebar-desktop-inner vc-sidebar-inner",
                    children: [
                      n.jsxs("div", {
                        className: "vc-sidebar-header",
                        children: [
                          n.jsx("span", {
                            className: "vc-sidebar-header-title",
                            children: "Chat"
                          }),
                          n.jsx("button", {
                            type: "button",
                            className: "vc-sidebar-close-btn",
                            onClick: () => p("chat"),
                            title: "Close chat",
                            children: n.jsxs("svg", {
                              width: "14",
                              height: "14",
                              viewBox: "0 0 24 24",
                              fill: "none",
                              stroke: "currentColor",
                              strokeWidth: "2",
                              children: [
                                n.jsx("line", {
                                  x1: "18",
                                  y1: "6",
                                  x2: "6",
                                  y2: "18"
                                }),
                                n.jsx("line", {
                                  x1: "6",
                                  y1: "6",
                                  x2: "18",
                                  y2: "18"
                                })
                              ]
                            })
                          })
                        ]
                      }),
                      n.jsx("div", {
                        className: "vc-sidebar-section",
                        children: n.jsx(gs, {
                          channelId: e.id,
                          serverId: t,
                          currentUserId: x,
                          getToken: s,
                          getStore: Je,
                          wsClient: r,
                          recipientUserIds: i,
                          members: o,
                          onNewMessage: xn,
                          baseUrl: w
                        })
                      })
                    ]
                  })
                }),
                n.jsx("div", {
                  className: `sidebar-desktop ${f ? "sidebar-desktop-open" : ""}`,
                  children: n.jsx("div", {
                    className: "sidebar-desktop-inner",
                    children: n.jsx(cn, {
                      members: o,
                      onlineUserIds: c ?? /* @__PURE__ */ new Set(),
                      currentUserId: x,
                      myRole: l,
                      showToast: d,
                      onMemberUpdate: u
                    })
                  })
                })
              ]
            })
          ]
        }),
        Pe && n.jsx(Ei, {
          recommendedQualityKey: ne,
          recommendedUploadMbps: ge,
          onSelect: Tt,
          onCancel: () => ie(false)
        }),
        _ && n.jsx(Hs, {
          title: "choose microphone",
          devices: Jt,
          selectedDeviceId: bt,
          onSelect: Jn,
          onCancel: () => $(false)
        }),
        F && n.jsx(Hs, {
          title: "choose webcam",
          devices: mt,
          selectedDeviceId: ht,
          onSelect: et,
          onCancel: () => te(false)
        }),
        H && n.jsx("div", {
          className: "toast",
          role: "alert",
          children: H
        })
      ]
    });
  }
  function ql(e, t) {
    function s(r) {
      return r ?? t();
    }
    return {
      getMLSGroupInfo: (r, i) => oi(s(r), i, e),
      putMLSGroupInfo: (r, i, o, c) => ii(s(r), i, o, c, e),
      postMLSCommit: (r, i, o, c, l) => ai(s(r), i, o, c, l, e),
      getMLSCommitsSinceEpoch: (r, i, o, c = 100) => ri(s(r), i, o, c, e),
      getMLSPendingWelcomes: (r) => si(s(r), e),
      deleteMLSPendingWelcome: (r, i) => ni(s(r), i, e),
      getGuildMetadataGroupInfo: (r, i) => ti(s(r), i, e),
      putGuildMetadataGroupInfo: (r, i, o, c) => ei(s(r), i, o, c, e),
      getMLSVoiceGroupInfo: (r, i) => Za(s(r), i, e),
      putMLSVoiceGroupInfo: (r, i, o, c) => Qa(s(r), i, o, c, e),
      postMLSVoiceCommit: (r, i, o, c, l) => Ja(s(r), i, o, c, l, e),
      uploadMLSKeyPackages: (r, i) => Br(s(r), i, e),
      getKeyPackageCount: (r, i) => Pr(s(r), i, e),
      getChannelMessages: (r, i, o, c = {}) => Xa(s(r), i, o, c, e),
      verifyTransparency: (r, i) => qa(s(r), i, e),
      getPreKeyBundle: (r, i) => Ya(s(r), i, e),
      getPreKeyBundleByDevice: (r, i, o) => Va(s(r), i, o, e)
    };
  }
  const Xl = 6 * 60 * 60 * 1e3, Jl = 50, br = 10;
  function xr(e) {
    return Array.from(e).map((t) => t.toString(16).padStart(2, "0")).join("");
  }
  async function hs(e, t, s, r, i) {
    const { mlsStore: o, crypto: c, uploadMLSKeyPackages: l, getKeyPackageCount: d } = i;
    try {
      if (await d(e, s) >= r) return;
      const f = await o.openStore(t, s), h = await o.getCredential(f);
      if (!h) return;
      const y = [];
      for (let k = 0; k < Jl; k++) {
        const D = await c.generateKeyPackage(h.signingPrivateKey, h.signingPublicKey, h.credentialBytes), N = xr(D.hashRefBytes);
        await o.setKeyPackage(f, N, {
          keyPackageBytes: D.keyPackageBytes,
          privateKeyBytes: D.privateKeyBytes,
          createdAt: Date.now()
        }), y.push(D.keyPackageBytes);
      }
      const p = await c.generateKeyPackage(h.signingPrivateKey, h.signingPublicKey, h.credentialBytes), S = xr(p.hashRefBytes);
      await o.setLastResort(f, {
        keyPackageBytes: p.keyPackageBytes,
        privateKeyBytes: p.privateKeyBytes,
        hashRefHex: S
      }), await l(e, {
        deviceId: s,
        keyPackages: [
          Array.from(p.keyPackageBytes)
        ],
        lastResort: true
      });
      const j = new Date(Date.now() + 30 * 24 * 3600 * 1e3).toISOString();
      await l(e, {
        deviceId: s,
        keyPackages: y.map((k) => Array.from(k)),
        expiresAt: j
      });
    } catch (u) {
      console.warn("[useKeyPackageMaintenance] replenishment failed:", u);
    }
  }
  function Ql({ token: e, userId: t, deviceId: s, threshold: r, wsClient: i, baseUrl: o }) {
    const c = a.useMemo(() => ({
      mlsStore: it,
      crypto: Ct,
      uploadMLSKeyPackages: (d, u) => Br(d, u, o),
      getKeyPackageCount: (d, u) => Pr(d, u, o)
    }), [
      o
    ]), l = a.useRef(c);
    l.current = c, a.useEffect(() => {
      if (!e || !t || !s || o == null) return;
      const d = r ?? br;
      hs(e, t, s, d, l.current);
      const u = setInterval(() => {
        hs(e, t, s, d, l.current);
      }, Xl);
      return () => clearInterval(u);
    }, [
      e,
      t,
      s,
      r,
      o
    ]), a.useEffect(() => {
      if (!i || !e || !t || !s || o == null) return;
      const d = r ?? br, u = () => {
        hs(e, t, s, d, l.current);
      };
      return i.on("key_packages.low", u), () => {
        i.off("key_packages.low", u);
      };
    }, [
      i,
      e,
      t,
      s,
      r,
      o
    ]);
  }
  const wr = "hush:sidebar-width", Sr = 260, jr = 180, Cr = 400;
  function Zl() {
    const [e, t] = a.useState(() => {
      try {
        const c = localStorage.getItem(wr), l = c ? parseInt(c, 10) : NaN;
        return Number.isNaN(l) ? Sr : Math.min(Math.max(l, jr), Cr);
      } catch {
        return Sr;
      }
    }), s = a.useRef(null), r = a.useCallback((c) => {
      if (!s.current) return;
      const l = c.clientX - s.current.startX, d = Math.min(Math.max(s.current.startWidth + l, jr), Cr);
      t(d);
    }, []), i = a.useCallback(() => {
      s.current && (s.current = null, document.removeEventListener("mousemove", r), document.removeEventListener("mouseup", i), t((c) => (localStorage.setItem(wr, String(c)), c)), document.body.style.cursor = "", document.body.style.userSelect = "");
    }, [
      r
    ]), o = a.useCallback((c) => {
      c.preventDefault(), s.current = {
        startX: c.clientX,
        startWidth: e
      }, document.body.style.cursor = "col-resize", document.body.style.userSelect = "none", document.addEventListener("mousemove", r), document.addEventListener("mouseup", i);
    }, [
      e,
      r,
      i
    ]);
    return a.useEffect(() => () => {
      document.removeEventListener("mousemove", r), document.removeEventListener("mouseup", i), document.body.style.cursor = "", document.body.style.userSelect = "";
    }, [
      r,
      i
    ]), {
      width: e,
      handleMouseDown: o
    };
  }
  function ed({ dmGuilds: e, onSelectDm: t, getToken: s }) {
    const [r, i] = a.useState(false), [o, c] = a.useState(""), [l, d] = a.useState([]), [u, f] = a.useState(false), h = a.useRef(null);
    a.useEffect(() => () => clearTimeout(h.current), []);
    const y = (S) => {
      const j = S.target.value;
      if (c(j), clearTimeout(h.current), !j.trim()) {
        d([]), f(false);
        return;
      }
      f(true), h.current = setTimeout(async () => {
        try {
          const k = s == null ? void 0 : s();
          if (!k) return;
          const D = await ci(k, j.trim());
          d(Array.isArray(D) ? D : []);
        } catch {
          d([]);
        } finally {
          f(false);
        }
      }, 300);
    }, p = async (S) => {
      try {
        const j = s == null ? void 0 : s();
        if (!j) return;
        const k = await $r(j, S.id);
        i(false), c(""), d([]), t == null ? void 0 : t(k);
      } catch (j) {
        console.error("[DmListView] createOrFindDM failed:", j);
      }
    };
    return n.jsxs("div", {
      className: "dm-list-view",
      children: [
        n.jsxs("div", {
          className: "dm-list-header",
          children: [
            n.jsx("span", {
              className: "dm-list-title",
              children: "Direct Messages"
            }),
            n.jsx("button", {
              type: "button",
              className: "dm-list-new-btn",
              onClick: () => i((S) => !S),
              title: "New message",
              children: n.jsxs("svg", {
                width: "16",
                height: "16",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "2",
                children: [
                  n.jsx("line", {
                    x1: "12",
                    y1: "5",
                    x2: "12",
                    y2: "19"
                  }),
                  n.jsx("line", {
                    x1: "5",
                    y1: "12",
                    x2: "19",
                    y2: "12"
                  })
                ]
              })
            })
          ]
        }),
        r && n.jsxs("div", {
          className: "dm-list-search",
          children: [
            n.jsx("input", {
              autoFocus: true,
              type: "text",
              placeholder: "Find a user...",
              value: o,
              onChange: y,
              onKeyDown: (S) => {
                S.key === "Escape" && (i(false), c(""), d([]));
              },
              className: "dm-list-search-input"
            }),
            (l.length > 0 || u) && n.jsxs("div", {
              className: "dm-list-search-results",
              children: [
                u && n.jsx("div", {
                  className: "dm-list-search-status",
                  children: "Searching..."
                }),
                l.map((S) => n.jsxs("button", {
                  type: "button",
                  className: "dm-list-search-item",
                  onClick: () => p(S),
                  children: [
                    n.jsx("div", {
                      className: "dm-list-avatar",
                      children: (S.displayName || S.username || "?").charAt(0).toUpperCase()
                    }),
                    S.displayName || S.username
                  ]
                }, S.id))
              ]
            })
          ]
        }),
        n.jsx("div", {
          className: "dm-list-conversations",
          children: e.length === 0 ? n.jsx("div", {
            className: "dm-list-empty",
            children: "No conversations yet"
          }) : e.map((S) => {
            var _a2, _b, _c2, _d;
            const j = ((_a2 = S.otherUser) == null ? void 0 : _a2.displayName) || ((_b = S.otherUser) == null ? void 0 : _b.username) || "Direct Message", k = j.charAt(0).toUpperCase(), D = ((_d = (_c2 = S.channels) == null ? void 0 : _c2[0]) == null ? void 0 : _d.unreadCount) ?? 0;
            return n.jsxs("button", {
              type: "button",
              className: `dm-list-item${D > 0 ? " dm-list-item--unread" : ""}`,
              onClick: () => t == null ? void 0 : t(S),
              children: [
                n.jsx("div", {
                  className: "dm-list-avatar",
                  children: k
                }),
                n.jsx("span", {
                  className: "dm-list-item-name",
                  children: j
                }),
                D > 0 && n.jsx("span", {
                  className: "dm-list-item-badge",
                  children: D > 9 ? "9+" : D
                })
              ]
            }, S.id);
          })
        })
      ]
    });
  }
  function td({ instanceStates: e, onCreateServer: t, onBrowseServers: s }) {
    const r = sd(e);
    return n.jsxs("div", {
      className: "empty-container",
      "data-testid": "empty-state",
      children: [
        n.jsx("div", {
          className: "empty-icon",
          "aria-hidden": "true",
          children: n.jsxs("svg", {
            width: "48",
            height: "48",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "1.5",
            children: [
              n.jsx("rect", {
                x: "2",
                y: "2",
                width: "20",
                height: "8",
                rx: "0"
              }),
              n.jsx("rect", {
                x: "2",
                y: "14",
                width: "20",
                height: "8",
                rx: "0"
              }),
              n.jsx("line", {
                x1: "6",
                y1: "6",
                x2: "6.01",
                y2: "6"
              }),
              n.jsx("line", {
                x1: "6",
                y1: "18",
                x2: "6.01",
                y2: "18"
              })
            ]
          })
        }),
        n.jsx("h2", {
          className: "empty-heading",
          children: "Welcome to hush"
        }),
        n.jsx("p", {
          className: "empty-description",
          children: "Your private space for encrypted screen sharing and chat. No servers here yet - find one below or get your own."
        }),
        n.jsx("button", {
          type: "button",
          className: "empty-btn-primary",
          onClick: s,
          children: "Browse public servers"
        }),
        n.jsx("p", {
          className: "empty-invite-hint",
          children: "Have an invite link? Just click it - you'll be connected automatically."
        }),
        r && n.jsx("button", {
          type: "button",
          className: "empty-btn-secondary",
          onClick: t,
          children: "Create a server"
        }),
        n.jsxs("div", {
          className: "empty-footer",
          children: [
            n.jsx("a", {
              href: "https://gethush.live",
              target: "_blank",
              rel: "noopener noreferrer",
              className: "empty-footer-link",
              children: "Get a server"
            }),
            n.jsx("span", {
              className: "empty-footer-dot",
              "aria-hidden": "true",
              children: "\xB7"
            }),
            n.jsx("a", {
              href: "https://gethush.live/docs",
              target: "_blank",
              rel: "noopener noreferrer",
              className: "empty-footer-link",
              children: "Self-host"
            })
          ]
        })
      ]
    });
  }
  const nd = /* @__PURE__ */ new Set([
    "open"
  ]);
  function sd(e) {
    var _a2;
    for (const t of e.values()) {
      if ((t == null ? void 0 : t.connectionState) !== "connected") continue;
      const s = (_a2 = t == null ? void 0 : t.handshakeData) == null ? void 0 : _a2.server_creation_policy;
      if (nd.has(s)) return true;
    }
    return false;
  }
  function rd() {
    const [e, t] = a.useState([]), s = a.useCallback((r, i = "info") => {
      const o = Date.now(), c = typeof r == "object" && r !== null ? r.message : r, l = typeof r == "object" && r !== null && (r.variant || r.type) || i;
      t((d) => [
        ...d,
        {
          id: o,
          message: c,
          type: l
        }
      ]), setTimeout(() => {
        t((d) => d.filter((u) => u.id !== o));
      }, 3e3);
    }, []);
    return {
      toasts: e,
      show: s
    };
  }
  const kr = {
    success: "var(--hush-live)",
    error: "var(--hush-danger)",
    info: "var(--hush-amber)"
  };
  function Nr({ toasts: e }) {
    return n.jsx("div", {
      className: "toast-container",
      "aria-live": "polite",
      "aria-atomic": "false",
      children: n.jsx(Oi, {
        initial: false,
        children: e.map((t) => n.jsx(Pi.div, {
          className: "toast-item",
          style: {
            borderLeft: `3px solid ${kr[t.type] ?? kr.info}`
          },
          initial: {
            opacity: 0,
            x: 16
          },
          animate: {
            opacity: 1,
            x: 0
          },
          exit: {
            opacity: 0,
            x: 16
          },
          transition: {
            duration: 0.2,
            ease: [
              0.16,
              1,
              0.3,
              1
            ]
          },
          children: t.message
        }, t.id))
      })
    });
  }
  function ad({ user: e, isMuted: t, isDeafened: s, isInVoice: r, onMute: i, onDeafen: o, onMicFilterSettingsChange: c }) {
    const [l, d] = a.useState(false);
    if (!e) return null;
    const u = e.displayName || e.username || "User", f = u.charAt(0).toUpperCase();
    return n.jsxs(n.Fragment, {
      children: [
        n.jsxs("div", {
          className: "user-panel",
          children: [
            n.jsxs("div", {
              className: "user-panel-identity",
              children: [
                n.jsx("div", {
                  className: "user-panel-avatar",
                  children: f
                }),
                n.jsxs("div", {
                  className: "user-panel-info",
                  children: [
                    n.jsx("span", {
                      className: "user-panel-name",
                      children: u
                    }),
                    n.jsx("span", {
                      className: "user-panel-status",
                      children: "Online"
                    })
                  ]
                })
              ]
            }),
            n.jsxs("div", {
              className: "user-panel-actions",
              children: [
                n.jsx("button", {
                  type: "button",
                  className: `user-panel-btn${t ? " user-panel-btn--danger" : ""}`,
                  onClick: i,
                  title: t ? "Unmute microphone" : "Mute microphone",
                  disabled: !r,
                  children: t ? n.jsxs("svg", {
                    width: "16",
                    height: "16",
                    viewBox: "0 0 24 24",
                    fill: "none",
                    stroke: "currentColor",
                    strokeWidth: "2",
                    children: [
                      n.jsx("line", {
                        x1: "1",
                        y1: "1",
                        x2: "23",
                        y2: "23"
                      }),
                      n.jsx("path", {
                        d: "M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"
                      }),
                      n.jsx("path", {
                        d: "M17 16.95A7 7 0 0 1 5 12v-2m14 0v2c0 .51-.06 1-.16 1.47"
                      }),
                      n.jsx("line", {
                        x1: "12",
                        y1: "19",
                        x2: "12",
                        y2: "23"
                      }),
                      n.jsx("line", {
                        x1: "8",
                        y1: "23",
                        x2: "16",
                        y2: "23"
                      })
                    ]
                  }) : n.jsxs("svg", {
                    width: "16",
                    height: "16",
                    viewBox: "0 0 24 24",
                    fill: "none",
                    stroke: "currentColor",
                    strokeWidth: "2",
                    children: [
                      n.jsx("path", {
                        d: "M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"
                      }),
                      n.jsx("path", {
                        d: "M19 10v2a7 7 0 0 1-14 0v-2"
                      }),
                      n.jsx("line", {
                        x1: "12",
                        y1: "19",
                        x2: "12",
                        y2: "23"
                      }),
                      n.jsx("line", {
                        x1: "8",
                        y1: "23",
                        x2: "16",
                        y2: "23"
                      })
                    ]
                  })
                }),
                n.jsx("button", {
                  type: "button",
                  className: `user-panel-btn${s ? " user-panel-btn--danger" : ""}`,
                  onClick: o,
                  title: s ? "Undeafen" : "Deafen",
                  disabled: !r,
                  children: s ? n.jsxs("svg", {
                    width: "16",
                    height: "16",
                    viewBox: "0 0 24 24",
                    fill: "none",
                    stroke: "currentColor",
                    strokeWidth: "2",
                    children: [
                      n.jsx("path", {
                        d: "M3 18v-6a9 9 0 0 1 18 0v6"
                      }),
                      n.jsx("path", {
                        d: "M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"
                      }),
                      n.jsx("line", {
                        x1: "1",
                        y1: "1",
                        x2: "23",
                        y2: "23"
                      })
                    ]
                  }) : n.jsxs("svg", {
                    width: "16",
                    height: "16",
                    viewBox: "0 0 24 24",
                    fill: "none",
                    stroke: "currentColor",
                    strokeWidth: "2",
                    children: [
                      n.jsx("path", {
                        d: "M3 18v-6a9 9 0 0 1 18 0v6"
                      }),
                      n.jsx("path", {
                        d: "M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"
                      })
                    ]
                  })
                }),
                n.jsx("button", {
                  type: "button",
                  className: "user-panel-btn",
                  onClick: () => d(true),
                  title: "User settings",
                  children: n.jsxs("svg", {
                    width: "16",
                    height: "16",
                    viewBox: "0 0 24 24",
                    fill: "none",
                    stroke: "currentColor",
                    strokeWidth: "2",
                    children: [
                      n.jsx("circle", {
                        cx: "12",
                        cy: "12",
                        r: "3"
                      }),
                      n.jsx("path", {
                        d: "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"
                      })
                    ]
                  })
                })
              ]
            })
          ]
        }),
        l && n.jsx(li, {
          onClose: () => d(false),
          voiceRuntime: {
            isInVoice: r,
            isMuted: t,
            isDeafened: s,
            onMute: i,
            onDeafen: o,
            onMicFilterSettingsChange: c
          }
        })
      ]
    });
  }
  const Er = {
    good: 100,
    degraded: 250
  };
  function id(e) {
    return e == null ? {
      level: "unknown",
      bars: 0,
      color: "var(--hush-text-muted)"
    } : e <= Er.good ? {
      level: "good",
      bars: 4,
      color: "var(--hush-live)"
    } : e <= Er.degraded ? {
      level: "degraded",
      bars: 2,
      color: "var(--hush-amber)"
    } : {
      level: "poor",
      bars: 1,
      color: "var(--hush-danger)"
    };
  }
  function od(e) {
    const [t, s] = a.useState(null), [r, i] = a.useState(false);
    a.useEffect(() => {
      if (!e) return;
      const c = (f) => s(f.rtt), l = () => {
        i(true), s(null);
      }, d = () => i(false), u = () => i(false);
      return e.on("rtt", c), e.on("reconnecting", l), e.on("reconnected", d), e.on("open", u), () => {
        e.off("rtt", c), e.off("reconnecting", l), e.off("reconnected", d), e.off("open", u);
      };
    }, [
      e
    ]);
    const o = id(t);
    return {
      rtt: t,
      ...o,
      isReconnecting: r
    };
  }
  function cd(e) {
    const t = atob(e), s = new Uint8Array(t.length);
    for (let r = 0; r < t.length; r++) s[r] = t.charCodeAt(r);
    return s;
  }
  function Mr() {
    return typeof window < "u" ? sessionStorage.getItem(Es) ?? sessionStorage.getItem("hush_token") : null;
  }
  function Ut(e, t = null) {
    if (!(e == null ? void 0 : e.instanceUrl) || !(e == null ? void 0 : e.id)) return null;
    try {
      const s = new URL(e.instanceUrl).host, r = yi(e._localName ?? e.name ?? e.id, e.id);
      return t ? `/${s}/${r}/${t}` : `/${s}/${r}`;
    } catch {
      return null;
    }
  }
  async function Rr(e, t) {
    if (!e) return null;
    try {
      const s = await Lt(e);
      if (!s) return null;
      const r = {
        db: e,
        credential: s,
        mlsStore: it,
        hushCrypto: Ct
      }, { metadataKeyBytes: i } = await _i(r, t);
      return i;
    } catch {
      return null;
    }
  }
  async function ms(e, t) {
    const s = Ir(t);
    for (const r of e) try {
      const i = await ks(r);
      return {
        decrypted: await _r(i, s),
        keyBytes: r
      };
    } catch {
    }
    return null;
  }
  function ld() {
    return typeof window > "u" ? null : localStorage.getItem(vi) || window.location.origin;
  }
  const Dr = {
    overflow: "hidden"
  };
  vd = function() {
    var _a2, _b;
    Bi($i.LOCKED);
    const e = bi(), t = Ms(), s = a.useRef(t);
    s.current = t;
    const { instanceStates: r, mergedGuilds: i, getWsClient: o, getTokenForInstance: c, refreshGuilds: l } = Lr(), { token: d, user: u, identityKeyRef: f, transparencyError: h, setTransparencyError: y } = Gn(), p = (u == null ? void 0 : u.id) ?? "", { instance: S, guildSlug: j, channelSlug: k, serverId: D } = e, N = e["*"] ?? "", M = N.startsWith("channels/") ? N.slice(9) : void 0, g = a.useMemo(() => {
      if (D) return i.find((v) => v.id === D) ?? null;
      if (S && j) {
        const { guildId: v, slug: b } = es(j);
        return i.find((E) => {
          if (!E.instanceUrl) return false;
          try {
            if (new URL(E.instanceUrl).host !== S) return false;
          } catch {
            return false;
          }
          return v ? E.id === v : ts(E._localName ?? E.name ?? E.id ?? "") === b;
        }) ?? null;
      }
      return null;
    }, [
      i,
      D,
      S,
      j
    ]), w = (g == null ? void 0 : g.id) ?? D ?? null, m = (g == null ? void 0 : g.instanceUrl) ?? null, C = m ? c(m) ?? Mr() : Mr(), L = k ?? M, A = ld();
    a.useEffect(() => {
      if (!g || !S || !j || es(j).guildId) return;
      const v = Ut(g, L ?? null);
      v && s.current(v, {
        replace: true
      });
    }, [
      g,
      L,
      j,
      S
    ]);
    const x = m ? o(m) : null, I = a.useMemo(() => m ? ql(m, () => c(m)) : null, [
      m,
      c
    ]), U = od(x), Z = m ? ((_a2 = r.get(m)) == null ? void 0 : _a2.connectionState) === "offline" : false, K = Ns(), [Q, ne] = a.useState(null), [X, ge] = a.useState(null), [ee, ve] = a.useState([]), [Me, ae] = a.useState(false), [T, O] = a.useState(() => /* @__PURE__ */ new Set()), [P, V] = a.useState([]), [ue, we] = a.useState(null), J = a.useCallback((v) => we((b) => b === v ? null : v), []), Y = ue === "members", Pe = ue === "chat", ie = ue === "participants", [H, Se] = a.useState(null), [B, q] = a.useState(null), _ = a.useRef([]), $ = a.useRef(null), [F, te] = a.useState(false), [oe, je] = a.useState(false), [Fe, Re] = a.useState(false), [ce, fe] = a.useState(false), me = a.useCallback(({ isMicOn: v, isDeafened: b, isScreenSharing: E, isWebcamOn: R }) => {
      te(v), je(b), E !== void 0 && Re(E), R !== void 0 && fe(R);
    }, []), le = a.useRef(false), [xe, Je] = a.useState("idle"), [De, pe] = a.useState(() => /* @__PURE__ */ new Map()), [Be, _t] = a.useState(() => /* @__PURE__ */ new Map()), { width: dt, handleMouseDown: ut } = Zl(), Ge = K === "mobile", [Xt, ft] = a.useState(false);
    a.useCallback(() => ft(false), []);
    const Nt = a.useCallback(() => ft((v) => !v), []), [Et, ye] = a.useState(1), [Ne, Le] = a.useState(false), [We, Ie] = a.useState(false), [Te, ze] = a.useState(false), at = a.useCallback(() => Le(false), []), Ee = a.useCallback(() => Le((v) => !v), []), qe = a.useCallback(() => {
      ye(1), Le(false), (g == null ? void 0 : g.isDm) && Ie(true);
    }, [
      g
    ]), Xe = a.useCallback(() => {
      Ie(true);
    }, []), { toasts: Ke, show: de } = rd(), be = H != null && L === H.id, Qe = a.useCallback((v) => {
      Je((b) => !be || le.current ? "idle" : v === "idle" && (b === "waiting" || b === "activating") ? b : (v === "idle" && (le.current = false), v));
    }, [
      be
    ]);
    a.useEffect(() => {
      be || Je("idle");
    }, [
      be
    ]), a.useEffect(() => {
      Ge && (ft(false), L && ye(2));
    }, [
      L,
      Ge
    ]), a.useEffect(() => {
      le.current = false;
    }, [
      L
    ]);
    const tt = P.map((v) => v.id ?? v.userId), He = a.useCallback(async (v, b) => {
      if (!p || !v || !(b instanceof Uint8Array)) return;
      const E = await ln(p, _e());
      try {
        await di(E, v, b);
      } finally {
        E.close();
      }
    }, [
      p
    ]), Ze = a.useCallback(async (v) => {
      if (!p || !v) return null;
      const b = await ln(p, _e());
      try {
        const he = await ui(b, v);
        if (he) return [
          he
        ];
      } finally {
        b.close();
      }
      const E = [], R = await st(p, _e());
      let G = null;
      try {
        G = await Rr(R, v);
      } finally {
        R.close();
      }
      G && E.push(G);
      const W = await Or(p, _e());
      let re = null;
      try {
        re = await fi(W, (he) => Rr(he, v));
      } finally {
        W.close();
      }
      if (re) {
        const he = tn(re);
        E.some((Bt) => tn(Bt) === he) || E.push(re);
      }
      return E;
    }, [
      p
    ]), Mt = a.useCallback(async (v) => {
      var _a3;
      return ((_a3 = await Ze(v)) == null ? void 0 : _a3[0]) ?? null;
    }, [
      Ze
    ]), [Jt, mt] = a.useState(null), [bt, ht] = a.useState(null), Xn = a.useCallback(async () => bt instanceof Uint8Array ? bt : (g == null ? void 0 : g.id) ? Mt(g.id) : null, [
      g == null ? void 0 : g.id,
      bt,
      Mt
    ]);
    a.useEffect(() => {
      const { guildId: v, slug: b } = es(j ?? "");
      if (g || !S || !j || v) return;
      let E = false;
      return (async () => {
        var _a3;
        const G = i.filter((W) => {
          try {
            return W.instanceUrl && new URL(W.instanceUrl).host === S;
          } catch {
            return false;
          }
        });
        for (const W of G) {
          if (ts(W._localName ?? W.name ?? W.id ?? "") === b) {
            const Gs = Ut(W, L ?? null);
            !E && Gs && s.current(Gs, {
              replace: true
            });
            return;
          }
          if (!W.encryptedMetadata) continue;
          const he = await Ze(W.id), Bt = (he == null ? void 0 : he.length) ? await ms(he, W.encryptedMetadata) : null;
          if (ts(((_a3 = Bt == null ? void 0 : Bt.decrypted) == null ? void 0 : _a3.name) ?? "") !== b) continue;
          await He(W.id, Bt.keyBytes), W._localName = Bt.decrypted.name;
          const $t = Ut(W, L ?? null);
          !E && $t && s.current($t, {
            replace: true
          });
          return;
        }
      })().catch(() => {
      }), () => {
        E = true;
      };
    }, [
      g,
      L,
      Ze,
      j,
      S,
      i,
      He
    ]), a.useEffect(() => {
      if (!g) {
        mt(null), ht(null);
        return;
      }
      if (!g.encryptedMetadata) {
        mt(g._localName ?? g.name ?? null), ht(null);
        return;
      }
      const v = g._localName ?? g.name ?? null;
      try {
        const b = new TextDecoder().decode(Uint8Array.from(atob(g.encryptedMetadata), (R) => R.charCodeAt(0))), E = JSON.parse(b);
        if (E.n || E.name) {
          mt(E.n || E.name), ht(null);
          return;
        }
      } catch {
      }
      Ze(g.id).then(async (b) => {
        var _a3;
        if (!(b == null ? void 0 : b.length)) {
          mt(v), ht(null);
          return;
        }
        const E = await ms(b, g.encryptedMetadata);
        if ((_a3 = E == null ? void 0 : E.decrypted) == null ? void 0 : _a3.name) {
          await He(g.id, E.keyBytes), g._localName = E.decrypted.name, mt(E.decrypted.name), ht(E.keyBytes);
          return;
        }
        mt(v), ht(null);
      }).catch(() => {
        mt(v), ht(null);
      });
    }, [
      g,
      Ze,
      He
    ]), a.useEffect(() => {
      if (!(g == null ? void 0 : g.id) || ee.length === 0) return;
      let v = false;
      return (async () => {
        const E = await Ze(g.id);
        if (!(E == null ? void 0 : E.length) || v) return;
        const R = await Promise.all(ee.map(async (W) => {
          var _a3;
          if (W.name || !W.encryptedMetadata) return W;
          try {
            const re = await ms(E, W.encryptedMetadata), he = (_a3 = re == null ? void 0 : re.decrypted) == null ? void 0 : _a3.name;
            return he ? (await He(g.id, re.keyBytes), {
              ...W,
              name: he
            }) : W;
          } catch {
            return W;
          }
        }));
        if (v) return;
        R.some((W, re) => W !== ee[re]) && ve(R);
      })().catch(() => {
      }), () => {
        v = true;
      };
    }, [
      g == null ? void 0 : g.id,
      ee,
      Ze,
      He
    ]), Ql({
      token: C,
      userId: p,
      deviceId: _e(),
      threshold: (X == null ? void 0 : X.key_package_low_threshold) ?? null,
      wsClient: x,
      baseUrl: m ?? ""
    });
    const bn = a.useRef(null);
    a.useEffect(() => {
      if (!x || !w) return;
      const v = () => {
        const b = bn.current;
        b && b !== w && x.send("unsubscribe.server", {
          server_id: b
        }), x.send("subscribe.server", {
          server_id: w
        }), bn.current = w;
      };
      return v(), x.on("open", v), () => x.off("open", v);
    }, [
      x,
      w
    ]), a.useEffect(() => {
      if (!x) return;
      const v = (b) => O(new Set(b.user_ids ?? []));
      return x.on("presence.update", v), () => x.off("presence.update", v);
    }, [
      x
    ]), a.useEffect(() => {
      if (!x) return;
      const v = (b) => {
        const { channel_id: E, participants: R } = b;
        E && pe((G) => {
          const W = new Map(G);
          return !R || R.length === 0 ? W.delete(E) : W.set(E, R), W;
        });
      };
      return x.on("voice_state_update", v), () => x.off("voice_state_update", v);
    }, [
      x
    ]), a.useEffect(() => {
      if (!x) return;
      const v = (b) => {
        b.user_id && _t((E) => {
          const R = new Map(E);
          return R.set(b.user_id, {
            isMuted: !!b.is_muted,
            isDeafened: !!b.is_deafened
          }), R;
        });
      };
      return x.on("voice.mute_state", v), () => x.off("voice.mute_state", v);
    }, [
      x
    ]), a.useEffect(() => {
      if (!x) return;
      const v = (b) => {
        if (!b.channel || b.server_id && b.server_id !== w) return;
        const E = {
          ...b.channel
        };
        if (!E.name && E.encryptedMetadata) try {
          const R = new TextDecoder().decode(Uint8Array.from(atob(E.encryptedMetadata), (W) => W.charCodeAt(0))), G = JSON.parse(R);
          E.name = G.n || G.name || "";
        } catch {
        }
        ve((R) => R.some((G) => G.id === E.id) ? R : [
          ...R,
          E
        ]);
      };
      return x.on("channel_created", v), () => x.off("channel_created", v);
    }, [
      x,
      w
    ]), a.useEffect(() => {
      if (!x) return;
      const v = (b) => {
        b.channel_id && (b.server_id && b.server_id !== w || (ve((E) => E.filter((R) => R.id !== b.channel_id)), Se((E) => (E == null ? void 0 : E.id) === b.channel_id ? (_.current = [], null) : E), L === b.channel_id && $e(w)));
      };
      return x.on("channel_deleted", v), () => x.off("channel_deleted", v);
    }, [
      x,
      L,
      w
    ]), a.useEffect(() => {
      if (!x) return;
      const v = (b) => {
        b.server_id && b.server_id !== w || C && w && m && Gt(C, w, m).then((E) => ve(Pt(E))).catch(() => {
        });
      };
      return x.on("channel_moved", v), () => x.off("channel_moved", v);
    }, [
      x,
      w,
      C,
      m
    ]), a.useEffect(() => {
      if (!x) return;
      const v = (b) => {
        ne((E) => {
          if (!E) return E;
          const R = {
            ...E
          };
          return b.name !== void 0 && (R.name = b.name), b.icon_url !== void 0 && (R.iconUrl = b.icon_url), b.registration_mode !== void 0 && (R.registrationMode = b.registration_mode), R;
        });
      };
      return x.on("instance_updated", v), () => x.off("instance_updated", v);
    }, [
      x
    ]);
    const $e = a.useCallback((v, b) => {
      if (!v) {
        s.current("/home", {
          replace: true
        });
        return;
      }
      const E = i.find((W) => W.id === v), R = Ut(E, b ?? null);
      if (R) {
        s.current(R, {
          replace: true
        });
        return;
      }
      const G = b ? `/servers/${v}/channels/${b}` : `/servers/${v}/channels`;
      s.current(G, {
        replace: true
      });
    }, [
      i
    ]), Rt = a.useCallback(() => {
      le.current = true, Je("idle"), Se(null), _.current = [], Re(false), fe(false), _t(/* @__PURE__ */ new Map()), ye(1), Le(false), $e(w);
    }, [
      w,
      $e
    ]);
    a.useEffect(() => {
      if (!x) return;
      const v = async (b) => {
        if (b.user_id && !(b.server_id && b.server_id !== w)) {
          if (b.user_id === p) {
            try {
              const R = ee.filter((re) => re.type === "text").map((re) => re.id), W = {
                db: await st(p, _e()),
                mlsStore: it
              };
              R.length && await ss(W, R);
            } catch (R) {
              console.warn("[mls] Failed to clean up MLS groups on kick:", R);
            }
            const E = Jt ?? (g == null ? void 0 : g.name) ?? "the server";
            de({
              message: `You were removed from ${E}`,
              variant: "error"
            }), setTimeout(() => {
              const R = i.find((G) => G.id !== w);
              R ? $e(R.id) : s.current("/home");
            }, 2500);
            return;
          }
          V((E) => E.filter((R) => (R.id ?? R.userId) !== b.user_id));
        }
      };
      return x.on("member_kicked", v), () => x.off("member_kicked", v);
    }, [
      x,
      p,
      w,
      i,
      g,
      ee,
      de
    ]), a.useEffect(() => {
      if (!x) return;
      const v = async (b) => {
        if (b.user_id && !(b.server_id && b.server_id !== w)) {
          if (b.user_id === p) {
            try {
              const R = ee.filter((re) => re.type === "text").map((re) => re.id), W = {
                db: await st(p, _e()),
                mlsStore: it
              };
              R.length && await ss(W, R);
            } catch (R) {
              console.warn("[mls] Failed to clean up MLS groups on ban:", R);
            }
            const E = Jt ?? (g == null ? void 0 : g.name) ?? "the server";
            de({
              message: `You were banned from ${E}`,
              variant: "error"
            }), setTimeout(() => {
              const R = i.find((G) => G.id !== w);
              R ? $e(R.id) : s.current("/home");
            }, 2500);
            return;
          }
          V((E) => E.filter((R) => (R.id ?? R.userId) !== b.user_id));
        }
      };
      return x.on("member_banned", v), () => x.off("member_banned", v);
    }, [
      x,
      p,
      w,
      i,
      g,
      ee,
      de
    ]), a.useEffect(() => {
      if (!x) return;
      const v = (b) => {
        const E = b.reason || "You have been banned";
        de({
          message: `Account suspended: ${E}`,
          variant: "error"
        }), setTimeout(() => {
          sessionStorage.removeItem(Es), window.location.href = "/";
        }, 2e3);
      };
      return x.on("instance_banned", v), () => x.off("instance_banned", v);
    }, [
      x,
      de
    ]), a.useEffect(() => {
      if (!x) return;
      const v = (b) => {
        de({
          message: b.message || "A previously revoked device attempted to reconnect to your account.",
          variant: "warning",
          duration: 1e4
        });
      };
      return x.on("device_revoked_reconnect_attempt", v), () => x.off("device_revoked_reconnect_attempt", v);
    }, [
      x,
      de
    ]), a.useEffect(() => {
      if (!x) return;
      const v = (b) => {
        b.server_id === w && b.user_id === p && (H && Rt(), de({
          message: "You are muted in this server and cannot join voice channels.",
          variant: "error"
        }));
      };
      return x.on("member_muted", v), () => x.off("member_muted", v);
    }, [
      x,
      w,
      p,
      H,
      Rt,
      de
    ]), a.useEffect(() => {
      if (!x) return;
      const v = (b) => {
        if (!b.member || b.server_id && b.server_id !== w) return;
        const E = b.member.id ?? b.member.userId;
        V((R) => R.some((G) => (G.id ?? G.userId) === E) ? R : [
          ...R,
          b.member
        ]);
      };
      return x.on("member_joined", v), () => x.off("member_joined", v);
    }, [
      x,
      w
    ]), a.useEffect(() => {
      if (!x) return;
      const v = async (b) => {
        if (b.user_id && !(b.server_id && b.server_id !== w)) {
          if (b.user_id === p) {
            try {
              const R = ee.filter((G) => G.type === "text").map((G) => G.id);
              if (p) {
                const W = {
                  db: await st(p, _e()),
                  mlsStore: it
                };
                R.length && await ss(W, R);
              }
            } catch (R) {
              console.warn("[mls] Failed to clean up MLS groups on leave:", R);
            }
            const E = i.find((R) => R.id !== w);
            E ? $e(E.id) : s.current("/home", {
              replace: true
            });
            return;
          }
          V((E) => E.filter((R) => (R.id ?? R.userId) !== b.user_id));
        }
      };
      return x.on("member_left", v), () => x.off("member_left", v);
    }, [
      x,
      w,
      p,
      i,
      ee
    ]), a.useEffect(() => {
      if (!x || !p) return;
      const v = async (b) => {
        if (!(b.sender_id === p && b.sender_device_id === _e()) && !(!b.channel_id || !b.commit_bytes) && C && I) try {
          const E = await st(p, _e()), R = await nn(E, b.channel_id);
          console.info("[mls] commit event", {
            channelId: b.channel_id,
            senderId: b.sender_id,
            senderDeviceId: b.sender_device_id ?? null,
            incomingEpoch: b.epoch ?? null,
            localEpochBefore: R ?? null
          });
          const G = await Lt(E), W = {
            db: E,
            token: C,
            credential: G,
            mlsStore: it,
            hushCrypto: Ct,
            api: I
          }, re = cd(b.commit_bytes);
          await Ri(W, b.channel_id, re);
          const he = await nn(E, b.channel_id);
          console.info("[mls] commit applied", {
            channelId: b.channel_id,
            incomingEpoch: b.epoch ?? null,
            localEpochAfter: he ?? null
          });
        } catch (E) {
          console.warn("[mls] Failed to process commit for channel", b.channel_id, E);
          try {
            const R = await st(p, _e()), G = await nn(R, b.channel_id);
            console.info("[mls] starting catchup", {
              channelId: b.channel_id,
              localEpochBeforeCatchup: G ?? null
            });
            const W = await Lt(R);
            await Vs({
              db: R,
              token: C,
              credential: W,
              mlsStore: it,
              hushCrypto: Ct,
              api: I
            }, b.channel_id);
            const he = await nn(R, b.channel_id);
            console.info("[mls] catchup finished", {
              channelId: b.channel_id,
              localEpochAfterCatchup: he ?? null
            });
          } catch (R) {
            console.warn("[mls] Catchup also failed for channel", b.channel_id, R);
          }
        }
      };
      return x.on("mls.commit", v), () => x.off("mls.commit", v);
    }, [
      x,
      p,
      C
    ]), a.useEffect(() => {
      if (!x || !p) return;
      const v = async (b) => {
        if (b.action === "remove" && b.requester_id !== p && !(!b.channel_id || !b.requester_id) && C && I) try {
          const E = await st(p, _e()), R = await Lt(E);
          await Di({
            db: E,
            token: C,
            credential: R,
            mlsStore: it,
            hushCrypto: Ct,
            api: I
          }, b.channel_id, b.requester_id);
        } catch (E) {
          console.warn("[mls] Failed to commit remove for", b.requester_id, "in channel", b.channel_id, E);
        }
      };
      return x.on("mls.add_request", v), () => x.off("mls.add_request", v);
    }, [
      x,
      p,
      C
    ]);
    const xt = a.useRef(/* @__PURE__ */ new Map()), At = a.useRef(false), xn = a.useRef(null);
    a.useEffect(() => {
      if (!ee.length || !p || !d || !w || !C || (xn.current = w, At.current)) return;
      const v = 3, b = ee.filter((R) => R.type === "text" || R.type === "voice").map((R) => R.id);
      if (!I) return;
      (async () => {
        At.current = true;
        try {
          const R = await st(p, _e()), G = await Lt(R), W = {
            db: R,
            token: C,
            credential: G,
            mlsStore: it,
            hushCrypto: Ct,
            api: I
          }, re = xt.current;
          for (const he of b) {
            if ((re.get(he) ?? 0) >= v) continue;
            if (await nn(R, he) == null) try {
              await Li(W, he);
            } catch ($t) {
              re.set(he, (re.get(he) ?? 0) + 1), console.warn("[mls] Failed to join/create group for channel", he, `(attempt ${re.get(he)}/${v})`, $t);
            }
            else try {
              await Vs(W, he);
            } catch ($t) {
              console.warn("[mls] Commit catchup failed for channel", he, $t);
            }
          }
        } catch (R) {
          console.warn("[mls] joinMissingGroups failed:", R);
        } finally {
          At.current = false;
        }
      })();
    }, [
      ee,
      p,
      d,
      w,
      C
    ]), a.useEffect(() => {
      if (!p || !d || !C || !I) return;
      const b = setInterval(async () => {
        try {
          const E = await st(p, _e()), R = await Lt(E);
          if (!R) return;
          const G = {
            db: E,
            token: C,
            credential: R,
            mlsStore: it,
            hushCrypto: Ct,
            api: I
          }, W = await gi(E);
          for (const { key: re } of W) try {
            await Ii(G, re);
          } catch (he) {
            console.warn("[mls] Self-update failed for channel", re, he);
          }
        } catch (E) {
          console.warn("[mls] Self-update timer failed:", E);
        }
      }, 24 * 60 * 60 * 1e3);
      return () => clearInterval(b);
    }, [
      p,
      d,
      C
    ]), a.useEffect(() => {
      if (!x) return;
      const v = (b) => {
        !b.user_id || !b.new_role || b.server_id && b.server_id !== w || V((E) => E.map((R) => (R.id ?? R.userId) === b.user_id ? {
          ...R,
          role: b.new_role
        } : R));
      };
      return x.on("role_changed", v), x.on("member_role_changed", v), () => {
        x.off("role_changed", v), x.off("member_role_changed", v);
      };
    }, [
      x,
      w
    ]), a.useEffect(() => {
      !C || !m || Promise.all([
        hi(C, m),
        mi(m)
      ]).then(([v, b]) => {
        ne(v), ge(b);
      }).catch(() => {
        ne(null), ge(null);
      });
    }, [
      C,
      m
    ]), a.useEffect(() => {
      var _a3;
      if (!(X == null ? void 0 : X.transparency_url) || !(X == null ? void 0 : X.log_public_key) || !C || !((_a3 = f == null ? void 0 : f.current) == null ? void 0 : _a3.publicKey) || !m || !A || m !== A) return;
      const v = tn(f.current.publicKey);
      new ns(m, X.log_public_key).verifyOwnKey(v, C).then((E) => {
        E.ok ? E.warning && console.warn("[transparency]", E.warning) : y(E.error);
      }).catch((E) => {
        console.warn("[transparency] login verification failed:", E);
      });
    }, [
      X
    ]), a.useEffect(() => {
      var _a3;
      if (!(X == null ? void 0 : X.transparency_url) || !(X == null ? void 0 : X.log_public_key) || !C || !((_a3 = f == null ? void 0 : f.current) == null ? void 0 : _a3.publicKey) || !m || !A || m !== A) return;
      const b = setInterval(async () => {
        try {
          const E = tn(f.current.publicKey), G = await new ns(m, X.log_public_key).verifyOwnKey(E, C);
          G.ok ? G.warning && console.warn("[transparency]", G.warning) : y(G.error);
        } catch (E) {
          console.warn("[transparency] periodic check failed:", E);
        }
      }, 24 * 60 * 60 * 1e3);
      return () => clearInterval(b);
    }, [
      X == null ? void 0 : X.transparency_url,
      C
    ]), a.useEffect(() => {
      if (!x) return;
      const v = (b) => {
        var _a3;
        if (console.warn("[transparency] key change detected:", b.operation, "leafIndex:", b.leafIndex), !(X == null ? void 0 : X.transparency_url) || !(X == null ? void 0 : X.log_public_key) || !C || !((_a3 = f == null ? void 0 : f.current) == null ? void 0 : _a3.publicKey) || !m || !A || m !== A) return;
        const E = tn(f.current.publicKey);
        new ns(m, X.log_public_key).verifyOwnKey(E, C).then((G) => {
          G.ok || y(G.error);
        }).catch((G) => console.warn("[transparency] key change verification failed:", G));
      };
      return x.on("transparency.key_change", v), () => x.off("transparency.key_change", v);
    }, [
      x,
      X,
      C
    ]), a.useEffect(() => {
      !d || !w || C && (ve([]), V([]), ae(true), Promise.all([
        Gt(C, w, m ?? void 0),
        ps(C, w, m ?? void 0)
      ]).then(([v, b]) => {
        const E = (Array.isArray(v) ? v : []).map((R) => {
          if (R.name || !R.encryptedMetadata) return R;
          try {
            const G = new TextDecoder().decode(Uint8Array.from(atob(R.encryptedMetadata), (re) => re.charCodeAt(0))), W = JSON.parse(G);
            return {
              ...R,
              name: W.n || W.name || ""
            };
          } catch {
            return R;
          }
        });
        ve(E), V(Array.isArray(b) ? b : []);
      }).catch((v) => {
        if ((v == null ? void 0 : v.status) === 403) {
          de({
            message: "You no longer have access to this server",
            variant: "error"
          }), s.current("/home", {
            replace: true
          });
          return;
        }
        ve([]), V([]);
      }).finally(() => ae(false)));
    }, [
      d,
      w,
      C,
      m,
      de
    ]);
    const pt = a.useCallback(() => {
      C && w && ps(C, w, m ?? void 0).then(V).catch(() => {
      });
    }, [
      w,
      C,
      m
    ]), wn = a.useCallback((v) => {
      ft(false), Ie(false), $e(v.id);
    }, [
      $e
    ]), Sn = a.useCallback((v) => {
      Ie(false), ft(false), ye(2), $e(v.id);
    }, [
      $e
    ]), Tt = a.useCallback(async (v) => {
      m && await l(m).catch(() => {
      }), (v == null ? void 0 : v.id) && $e(v.id);
    }, [
      m,
      l,
      $e
    ]), gt = a.useCallback(() => {
      ze(true);
    }, []), Qt = a.useCallback(() => {
      ze(false);
    }, []), Jn = a.useCallback(async (v) => {
      ze(false), await Tt(v);
    }, [
      Tt
    ]), Dt = a.useCallback(async (v) => {
      const b = v.id ?? v.userId;
      if (!(!b || !C)) try {
        const E = await $r(C, b, m ?? "");
        (E == null ? void 0 : E.id) && (m && await l(m).catch(() => {
        }), $e(E.id));
      } catch (E) {
        console.error("[ServerLayout] handleSendMessage failed:", E), de({
          message: "Could not open direct message",
          variant: "error"
        });
      }
    }, [
      C,
      m,
      l,
      $e,
      de
    ]), et = a.useCallback(() => C, [
      C
    ]), Ae = ee.find((v) => v.id === L), jn = be || !be && !Ae;
    (Ae == null ? void 0 : Ae.type) === "voice" && Ae.id !== (H == null ? void 0 : H.id) && !le.current && (_.current = tt, Se(Ae));
    const Ot = (v) => {
      if (!(v == null ? void 0 : v.id)) return;
      if (v.type === "voice" && H && v.id !== H.id) {
        q(v);
        return;
      }
      Ge && (ft(false), ye(2), Le(false));
      const b = Ut(g, v.id);
      s.current(b ?? `/servers/${w}/channels/${v.id}`), v.type === "voice" && (_.current = tt, Se(v));
    }, Cn = a.useCallback(() => {
      const v = B;
      if (q(null), !v) return;
      const b = Ut(g, v.id);
      s.current(b ?? `/servers/${w}/channels/${v.id}`), _.current = tt, Se(v);
    }, [
      B,
      tt,
      w,
      g
    ]), Pt = a.useCallback((v) => (Array.isArray(v) ? v : []).map((b) => {
      if (b.name || !b.encryptedMetadata) return b;
      try {
        const E = new TextDecoder().decode(Uint8Array.from(atob(b.encryptedMetadata), (G) => G.charCodeAt(0))), R = JSON.parse(E);
        return {
          ...b,
          name: R.n || R.name || ""
        };
      } catch {
        return b;
      }
    }), []), kn = a.useCallback((v) => {
      ve(Pt(v));
    }, [
      Pt
    ]), Zt = P.find((v) => (v.id ?? v.userId) === p), nt = (g == null ? void 0 : g.myRole) ?? (Zt == null ? void 0 : Zt.role) ?? "member", wt = (Zt == null ? void 0 : Zt.permissionLevel) ?? (g == null ? void 0 : g.permissionLevel) ?? {
      owner: 3,
      admin: 2,
      mod: 1,
      member: 0
    }[nt] ?? 0, en = X !== null && !(X == null ? void 0 : X.transparency_url);
    if (h) return n.jsx("div", {
      style: {
        position: "fixed",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--hush-black)",
        color: "var(--hush-text-primary)",
        padding: "32px",
        textAlign: "center",
        zIndex: 9999
      },
      children: n.jsxs("div", {
        style: {
          maxWidth: "480px",
          padding: "32px",
          background: "var(--hush-surface)",
          borderRadius: "var(--radius-lg)",
          border: "1px solid var(--hush-danger)"
        },
        children: [
          n.jsx("div", {
            style: {
              fontSize: "2.5rem",
              marginBottom: "16px"
            },
            children: "\u26A0"
          }),
          n.jsx("h2", {
            style: {
              color: "var(--hush-danger)",
              marginBottom: "12px",
              fontSize: "1.2rem"
            },
            children: "Key Verification Failed"
          }),
          n.jsx("p", {
            style: {
              color: "var(--hush-text-secondary)",
              marginBottom: "8px",
              lineHeight: 1.6
            },
            children: h
          }),
          n.jsx("p", {
            style: {
              color: "var(--hush-text-muted)",
              fontSize: "0.85rem",
              marginBottom: "24px",
              lineHeight: 1.5
            },
            children: "Your account may be compromised. Do not continue using this session. Contact your instance administrator."
          }),
          n.jsx("button", {
            type: "button",
            onClick: () => {
              pi(async () => {
                const { useAuth: v } = await import("./index-BefR8mbE.js").then(async (m2) => {
                  await m2.__tla;
                  return m2;
                }).then((b) => b.aT);
                return {
                  useAuth: v
                };
              }, __vite__mapDeps([0,1,2])).then(({ useAuth: v }) => {
                sessionStorage.clear(), window.location.href = "/";
              });
            },
            style: {
              padding: "10px 24px",
              background: "var(--hush-danger)",
              color: "#fff",
              border: "none",
              borderRadius: "var(--radius-sm)",
              cursor: "pointer",
              fontFamily: "var(--font-sans)",
              fontSize: "0.9rem"
            },
            children: "Sign Out"
          })
        ]
      })
    });
    if (!w) return n.jsxs("div", {
      className: "lay-container",
      style: Dr,
      children: [
        n.jsx(lr, {
          getToken: et,
          guilds: i,
          activeGuild: null,
          onGuildSelect: wn,
          onGuildCreated: Tt,
          getMetadataKey: Mt,
          getMetadataKeys: Ze,
          rememberMetadataKey: He,
          instanceData: Q,
          userRole: nt,
          userPermissionLevel: wt
        }),
        n.jsx("div", {
          style: {
            flex: 1,
            background: "var(--hush-black)"
          },
          children: n.jsx(td, {
            instanceStates: r,
            onCreateServer: gt,
            onBrowseServers: () => t("/explore")
          })
        }),
        Te && n.jsx(pa, {
          getToken: et,
          onClose: Qt,
          onCreated: Jn,
          activeInstanceUrl: null
        }),
        en && d && n.jsx("div", {
          title: "Transparency log not configured - key operations cannot be independently verified",
          "aria-label": "Transparency log not configured",
          style: {
            position: "fixed",
            bottom: "12px",
            left: "12px",
            zIndex: 10,
            width: "20px",
            height: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--hush-amber, #f59e0b)",
            cursor: "default",
            opacity: 0.85
          },
          children: n.jsx("svg", {
            width: "16",
            height: "16",
            viewBox: "0 0 24 24",
            fill: "currentColor",
            "aria-hidden": "true",
            children: n.jsx("path", {
              d: "M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-1 14h2v2h-2v-2zm0-8h2v6h-2V7z"
            })
          })
        }),
        n.jsx(Nr, {
          toasts: Ke
        })
      ]
    });
    const Qn = (i ?? []).filter((v) => v.isDm === true), z = n.jsx(lr, {
      getToken: et,
      guilds: i,
      activeGuild: We ? null : g,
      onGuildSelect: wn,
      onGuildCreated: Tt,
      onDmOpen: Xe,
      isDmActive: We || (g == null ? void 0 : g.isDm),
      getMetadataKey: Mt,
      getMetadataKeys: Ze,
      rememberMetadataKey: He,
      instanceData: Q,
      userRole: nt,
      userPermissionLevel: wt,
      compact: Ge
    }), Ce = n.jsx(ed, {
      dmGuilds: Qn,
      onSelectDm: Sn,
      getToken: et
    }), vt = We || (g == null ? void 0 : g.isDm), St = n.jsx(fl, {
      getToken: et,
      serverId: w,
      guildName: Jt ?? (g == null ? void 0 : g.name),
      instanceUrl: (g == null ? void 0 : g.instanceUrl) ?? null,
      getGuildMetadataKey: Xn,
      instanceData: Q,
      channels: ee,
      myRole: nt,
      myPermissionLevel: wt,
      activeChannelId: L,
      onChannelSelect: Ot,
      onChannelsUpdated: kn,
      voiceParticipants: De,
      showToast: de,
      members: P,
      currentUserId: p
    }), Nn = n.jsxs("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        flex: 1,
        overflow: "hidden"
      },
      children: [
        n.jsx("div", {
          style: {
            flex: 1,
            overflow: "hidden"
          },
          children: vt ? Ce : St
        }),
        H && n.jsx(Mi, {
          channelName: H._displayName ?? H.name,
          isLowLatency: ((_b = $.current) == null ? void 0 : _b.isLowLatency) ?? false,
          isScreenSharing: Fe,
          isWebcamOn: ce,
          signalBars: U.bars,
          signalColor: U.color,
          signalReconnecting: U.isReconnecting,
          rtt: U.rtt,
          onScreenShare: () => {
            var _a3;
            return (_a3 = $.current) == null ? void 0 : _a3.toggleScreenShare();
          },
          onSwitchScreen: () => {
            var _a3;
            return (_a3 = $.current) == null ? void 0 : _a3.switchScreenSource();
          },
          onWebcam: () => {
            var _a3;
            return (_a3 = $.current) == null ? void 0 : _a3.toggleWebcam();
          },
          onDisconnect: Rt
        }),
        n.jsx(ad, {
          user: u,
          isMuted: !!H && !F,
          isDeafened: !!H && oe,
          isInVoice: !!H,
          onMute: () => {
            var _a3;
            return (_a3 = $.current) == null ? void 0 : _a3.toggleMic();
          },
          onDeafen: () => {
            var _a3;
            return (_a3 = $.current) == null ? void 0 : _a3.toggleDeafen();
          },
          onMicFilterSettingsChange: (v) => {
            var _a3, _b2;
            return (_b2 = (_a3 = $.current) == null ? void 0 : _a3.updateMicFilterSettings) == null ? void 0 : _b2.call(_a3, v);
          }
        })
      ]
    });
    return n.jsxs("div", {
      className: "lay-container",
      style: Dr,
      children: [
        Z && n.jsxs("div", {
          className: "lay-offline-banner",
          style: {
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 20
          },
          children: [
            m ? new URL(m).host : "Instance",
            " is offline - read-only mode"
          ]
        }),
        !Ge && n.jsxs(n.Fragment, {
          children: [
            z,
            n.jsx("div", {
              style: {
                width: dt,
                flexShrink: 0,
                display: "flex",
                overflow: "hidden"
              },
              children: Nn
            }),
            n.jsx("div", {
              className: "lay-resize-handle",
              onMouseDown: ut,
              role: "separator",
              "aria-orientation": "vertical",
              "aria-label": "Resize channel list"
            })
          ]
        }),
        Ge && n.jsxs(n.Fragment, {
          children: [
            n.jsxs("div", {
              className: `mobile-stack-1${Et >= 2 ? " pushed" : ""}`,
              children: [
                z,
                n.jsx("div", {
                  style: {
                    flex: 1,
                    display: "flex",
                    overflow: "hidden"
                  },
                  children: Nn
                })
              ]
            }),
            n.jsxs("div", {
              className: `mobile-stack-2${Et >= 2 ? " active" : ""}`,
              children: [
                H && !be && n.jsxs("button", {
                  type: "button",
                  className: "voice-active-bar",
                  onClick: () => Ot(H),
                  children: [
                    n.jsx("svg", {
                      width: "12",
                      height: "12",
                      viewBox: "0 0 24 24",
                      fill: "currentColor",
                      "aria-hidden": "true",
                      children: n.jsx("path", {
                        d: "M12 3a4 4 0 0 1 4 4v5a4 4 0 0 1-8 0V7a4 4 0 0 1 4-4zm7 9a1 1 0 0 1 2 0 9 9 0 0 1-18 0 1 1 0 0 1 2 0 7 7 0 0 0 14 0z"
                      })
                    }),
                    "In Voice: ",
                    H._displayName ?? H.name,
                    " - Tap to return"
                  ]
                }),
                n.jsxs("div", {
                  className: "mobile-content-area",
                  children: [
                    H && n.jsx("div", {
                      style: {
                        display: be ? "flex" : "none",
                        flex: 1,
                        flexDirection: "column",
                        minHeight: 0,
                        overflow: "hidden",
                        position: "relative",
                        zIndex: 1
                      },
                      children: n.jsx(yr, {
                        channel: H,
                        serverId: w,
                        getToken: et,
                        wsClient: x,
                        recipientUserIds: _.current,
                        members: P,
                        onlineUserIds: T,
                        myRole: nt,
                        showToast: de,
                        onMemberUpdate: pt,
                        showMembers: false,
                        showChatPanel: Pe,
                        showParticipantsPanel: ie,
                        onTogglePanel: (v) => v === "members" ? Ee() : J(v),
                        onLeave: Rt,
                        onOrbPhaseChange: Qe,
                        serverParticipants: De.get(H.id) ?? [],
                        voiceMuteStates: Be,
                        onMobileBack: qe,
                        voiceControlsRef: $,
                        onVoiceStateChange: me,
                        baseUrl: m ?? ""
                      }, H.id)
                    }),
                    !be && (Me ? n.jsx("div", {
                      className: "lay-placeholder",
                      style: {
                        position: "relative",
                        zIndex: 1
                      },
                      children: "Loading\u2026"
                    }) : (Ae == null ? void 0 : Ae.type) === "system" ? n.jsx(gr, {
                      channel: Ae,
                      serverId: w,
                      getToken: et,
                      wsClient: x,
                      members: P,
                      onToggleDrawer: void 0,
                      onMobileBack: qe
                    }) : (Ae == null ? void 0 : Ae.type) === "text" ? n.jsx(vr, {
                      channel: Ae,
                      serverId: w,
                      getToken: et,
                      wsClient: x,
                      members: P,
                      showMembers: false,
                      onToggleMembers: Ee,
                      onToggleDrawer: void 0,
                      onMobileBack: qe,
                      sidebarSlot: null,
                      baseUrl: m ?? ""
                    }) : Ae && Ae.type !== "voice" ? n.jsx("div", {
                      className: "lay-placeholder",
                      style: {
                        position: "relative",
                        zIndex: 1
                      },
                      children: "Unknown channel type"
                    }) : n.jsx("div", {
                      className: "lay-placeholder",
                      style: {
                        position: "relative",
                        zIndex: 1,
                        textAlign: "center"
                      },
                      children: n.jsx("span", {
                        style: {
                          color: "var(--hush-text-muted)",
                          fontSize: 13
                        },
                        children: "Select a channel"
                      })
                    }))
                  ]
                }),
                n.jsx("div", {
                  className: `mobile-member-overlay${Ne ? " visible" : ""}`,
                  onClick: at,
                  "aria-hidden": !Ne
                }),
                n.jsx("div", {
                  className: `mobile-member-drawer${Ne ? " open" : ""}`,
                  children: n.jsx(cn, {
                    members: P,
                    onlineUserIds: T,
                    currentUserId: p,
                    myRole: nt,
                    myPermissionLevel: wt,
                    showToast: de,
                    onMemberUpdate: pt,
                    serverId: w,
                    onSendMessage: Dt,
                    onCloseDrawer: at
                  })
                })
              ]
            })
          ]
        }),
        !Ge && n.jsx("div", {
          className: "lay-main",
          children: n.jsx("div", {
            className: "lay-content-row",
            children: n.jsxs("div", {
              className: "lay-channel-area",
              children: [
                H && n.jsx("div", {
                  style: {
                    display: be ? "flex" : "none",
                    flex: 1,
                    flexDirection: "column",
                    minHeight: 0,
                    overflow: "hidden",
                    position: "relative",
                    zIndex: 1
                  },
                  children: n.jsx(yr, {
                    channel: H,
                    serverId: w,
                    getToken: et,
                    wsClient: x,
                    recipientUserIds: _.current,
                    members: P,
                    onlineUserIds: T,
                    myRole: nt,
                    showToast: de,
                    onMemberUpdate: pt,
                    showMembers: Y,
                    showChatPanel: Pe,
                    showParticipantsPanel: ie,
                    onTogglePanel: J,
                    onLeave: Rt,
                    onOrbPhaseChange: Qe,
                    serverParticipants: De.get(H.id) ?? [],
                    voiceMuteStates: Be,
                    voiceControlsRef: $,
                    onVoiceStateChange: me,
                    baseUrl: m ?? ""
                  }, H.id)
                }),
                !be && (Me ? n.jsx("div", {
                  className: "lay-placeholder",
                  style: {
                    position: "relative",
                    zIndex: 1
                  },
                  children: "Loading\u2026"
                }) : (Ae == null ? void 0 : Ae.type) === "system" ? n.jsx(gr, {
                  channel: Ae,
                  serverId: w,
                  getToken: et,
                  wsClient: x,
                  members: P,
                  onToggleDrawer: Ge ? Nt : void 0
                }) : (Ae == null ? void 0 : Ae.type) === "text" ? n.jsx(vr, {
                  channel: Ae,
                  serverId: w,
                  getToken: et,
                  wsClient: x,
                  members: P,
                  showMembers: Y,
                  onToggleMembers: () => J("members"),
                  onToggleDrawer: Ge ? Nt : void 0,
                  baseUrl: m ?? "",
                  sidebarSlot: Ge ? null : n.jsx("div", {
                    className: `sidebar-desktop ${Y ? "sidebar-desktop-open" : ""}`,
                    children: n.jsx("div", {
                      className: "sidebar-desktop-inner",
                      children: n.jsx(cn, {
                        members: P,
                        onlineUserIds: T,
                        currentUserId: p,
                        myRole: nt,
                        myPermissionLevel: wt,
                        showToast: de,
                        onMemberUpdate: pt,
                        serverId: w,
                        onSendMessage: Dt
                      })
                    })
                  })
                }) : Ae && Ae.type !== "voice" ? n.jsx("div", {
                  className: "lay-placeholder",
                  style: {
                    position: "relative",
                    zIndex: 1
                  },
                  children: "Unknown channel type"
                }) : n.jsxs(n.Fragment, {
                  children: [
                    !Ae && n.jsxs("header", {
                      className: "lay-channel-area-header",
                      children: [
                        Ge ? n.jsx("button", {
                          type: "button",
                          onClick: Nt,
                          className: "lay-hamburger-btn",
                          "aria-label": "Toggle channels",
                          children: n.jsxs("svg", {
                            width: "20",
                            height: "20",
                            viewBox: "0 0 24 24",
                            fill: "none",
                            stroke: "currentColor",
                            strokeWidth: "2",
                            children: [
                              n.jsx("line", {
                                x1: "3",
                                y1: "6",
                                x2: "21",
                                y2: "6"
                              }),
                              n.jsx("line", {
                                x1: "3",
                                y1: "12",
                                x2: "21",
                                y2: "12"
                              }),
                              n.jsx("line", {
                                x1: "3",
                                y1: "18",
                                x2: "21",
                                y2: "18"
                              })
                            ]
                          })
                        }) : n.jsx("div", {}),
                        n.jsx("button", {
                          type: "button",
                          className: "lay-members-toggle",
                          onClick: () => J("members"),
                          "aria-pressed": Y,
                          children: "Members"
                        })
                      ]
                    }),
                    n.jsxs("div", {
                      style: {
                        flex: 1,
                        display: "flex",
                        overflow: "hidden"
                      },
                      children: [
                        n.jsx("div", {
                          style: {
                            flex: 1
                          }
                        }),
                        !Ge && n.jsx("div", {
                          className: `sidebar-desktop ${Y ? "sidebar-desktop-open" : ""}`,
                          children: n.jsx("div", {
                            className: "sidebar-desktop-inner",
                            children: n.jsx(cn, {
                              members: P,
                              onlineUserIds: T,
                              currentUserId: p,
                              myRole: nt,
                              myPermissionLevel: wt,
                              showToast: de,
                              onMemberUpdate: pt,
                              serverId: w,
                              onSendMessage: Dt
                            })
                          })
                        })
                      ]
                    })
                  ]
                })),
                !Me && (!Ae && !be || be && xe === "idle") && n.jsx("div", {
                  style: {
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    paddingTop: jn ? 48 : 0,
                    paddingBottom: 69,
                    paddingRight: !Ge && Y ? 260 : 0,
                    transition: "padding-right var(--duration-fast) var(--ease-out)",
                    pointerEvents: "none"
                  },
                  children: n.jsxs("div", {
                    style: {
                      pointerEvents: "auto",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 12
                    },
                    children: [
                      n.jsx("span", {
                        style: {
                          color: "var(--hush-text-muted)",
                          fontSize: 11,
                          letterSpacing: "0.18em",
                          paddingLeft: "0.18em",
                          textTransform: "uppercase",
                          fontFamily: "var(--font-mono, monospace)"
                        },
                        children: be ? "connecting..." : "select channel"
                      }),
                      n.jsx("div", {
                        className: be ? "" : "empty-state-dot",
                        style: {
                          width: 5,
                          height: 5,
                          borderRadius: "50%",
                          background: be ? "var(--hush-text-muted)" : void 0
                        }
                      })
                    ]
                  })
                })
              ]
            })
          })
        }),
        B && n.jsx(Fs, {
          title: "Switch voice channel",
          message: `You are currently connected to "${H == null ? void 0 : H.name}". Switch to "${B.name}"?`,
          confirmLabel: "Switch",
          onConfirm: Cn,
          onCancel: () => q(null)
        }),
        en && d && n.jsx("div", {
          title: "Transparency log not configured - key operations cannot be independently verified",
          "aria-label": "Transparency log not configured",
          style: {
            position: "fixed",
            bottom: "12px",
            left: "12px",
            zIndex: 10,
            width: "20px",
            height: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--hush-amber, #f59e0b)",
            cursor: "default",
            opacity: 0.85
          },
          children: n.jsx("svg", {
            width: "16",
            height: "16",
            viewBox: "0 0 24 24",
            fill: "currentColor",
            "aria-hidden": "true",
            children: n.jsx("path", {
              d: "M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-1 14h2v2h-2v-2zm0-8h2v6h-2V7z"
            })
          })
        }),
        n.jsx(Nr, {
          toasts: Ke
        })
      ]
    });
  };
});
export {
  __tla,
  vd as default
};
