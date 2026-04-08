const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/Home-BbUDkX1k.js","assets/vendor-react-2AhYlJPv.js","assets/constants-AlQXj8D-.js","assets/useAuthInstanceSelection-Ca_fYGiR.js","assets/useBodyScrollMode-D02fsC65.js","assets/proxy-BXOaFASF.js","assets/vendor-motion-ws7o_Bh2.js","assets/Invite-DgTP-uU3.js","assets/LinkDevice-Cq0gEbgb.js","assets/Room-DVvZi2N4.js","assets/Chat-DEDH4du2.js","assets/Roadmap-DPgOfnk9.js","assets/ServerLayout-DvbLtwOj.js","assets/ExplorePage-Cu0Qs6u6.js","assets/eruda-Cxe-79mO.js"])))=>i.map(i=>d[i]);
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import { r as f, a as hr, u as Cn, b as Pa, R as Vr, c as ee, N as Pn, d as Oa, e as Ka, B as Ha } from "./vendor-react-2AhYlJPv.js";
let Ru, _t, uh, dh, Ne, fh, Zd, bs, Vd, qf, nh, Wu, th, eh, xl, Xf, pu, ih, ch, oh, Or, Il, Jf, Cu, bu, Au, Gu, Nu, Yf, Mu, Uu, ku, xu, Su, Iu, sl, ud, Xl, wl, yh, mh, Lf, sh, tl, pt, lu, of, je, gl, pl, qt, Df, Ql, gh, Kr, Aa, id, ld, hh, ya, Bu, Tu, _u, at, $u, Ho, iu, au, ca, cu, ou, ia, ed, Qu, qu, od, sd, rd, nd, td, Ju, Xu, Yu, cd, ad, ga, du, xa, Qf, rh, Zf, Ge, zf, c, Eu, ju, kr, nc, El, Ir, qc, gu, ah, nl, It, lh, yu, hu, mu, hs;
let __tla = (async () => {
  (function() {
    const t = document.createElement("link").relList;
    if (t && t.supports && t.supports("modulepreload")) return;
    for (const s of document.querySelectorAll('link[rel="modulepreload"]')) r(s);
    new MutationObserver((s) => {
      for (const o of s) if (o.type === "childList") for (const a of o.addedNodes) a.tagName === "LINK" && a.rel === "modulepreload" && r(a);
    }).observe(document, {
      childList: true,
      subtree: true
    });
    function n(s) {
      const o = {};
      return s.integrity && (o.integrity = s.integrity), s.referrerPolicy && (o.referrerPolicy = s.referrerPolicy), s.crossOrigin === "use-credentials" ? o.credentials = "include" : s.crossOrigin === "anonymous" ? o.credentials = "omit" : o.credentials = "same-origin", o;
    }
    function r(s) {
      if (s.ep) return;
      s.ep = true;
      const o = n(s);
      fetch(s.href, o);
    }
  })();
  let Va, Wa, Wr;
  Va = "modulepreload";
  Wa = function(e) {
    return "/" + e;
  };
  Wr = {};
  je = function(t, n, r) {
    let s = Promise.resolve();
    if (n && n.length > 0) {
      document.getElementsByTagName("link");
      const a = document.querySelector("meta[property=csp-nonce]"), i = (a == null ? void 0 : a.nonce) || (a == null ? void 0 : a.getAttribute("nonce"));
      s = Promise.allSettled(n.map((l) => {
        if (l = Wa(l), l in Wr) return;
        Wr[l] = true;
        const u = l.endsWith(".css"), h = u ? '[rel="stylesheet"]' : "";
        if (document.querySelector(`link[href="${l}"]${h}`)) return;
        const d = document.createElement("link");
        if (d.rel = u ? "stylesheet" : Va, u || (d.as = "script"), d.crossOrigin = "", d.href = l, i && d.setAttribute("nonce", i), document.head.appendChild(d), u) return new Promise((y, g) => {
          d.addEventListener("load", y), d.addEventListener("error", () => g(new Error(`Unable to preload CSS for ${l}`)));
        });
      }));
    }
    function o(a) {
      const i = new Event("vite:preloadError", {
        cancelable: true
      });
      if (i.payload = a, window.dispatchEvent(i), !i.defaultPrevented) throw a;
    }
    return s.then((a) => {
      for (const i of a || []) i.status === "rejected" && o(i.reason);
      return t().catch(o);
    });
  };
  var Ds = {
    exports: {}
  }, En = {};
  var Fa = f, Za = Symbol.for("react.element"), za = Symbol.for("react.fragment"), Ya = Object.prototype.hasOwnProperty, Xa = Fa.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, Ja = {
    key: true,
    ref: true,
    __self: true,
    __source: true
  };
  function Gs(e, t, n) {
    var r, s = {}, o = null, a = null;
    n !== void 0 && (o = "" + n), t.key !== void 0 && (o = "" + t.key), t.ref !== void 0 && (a = t.ref);
    for (r in t) Ya.call(t, r) && !Ja.hasOwnProperty(r) && (s[r] = t[r]);
    if (e && e.defaultProps) for (r in t = e.defaultProps, t) s[r] === void 0 && (s[r] = t[r]);
    return {
      $$typeof: Za,
      type: e,
      key: o,
      ref: a,
      props: s,
      _owner: Xa.current
    };
  }
  En.Fragment = za;
  En.jsx = Gs;
  En.jsxs = Gs;
  Ds.exports = En;
  let Jn, Fr;
  c = Ds.exports;
  Jn = {};
  Fr = hr;
  Jn.createRoot = Fr.createRoot, Jn.hydrateRoot = Fr.hydrateRoot;
  function qa(e) {
    return e instanceof Uint8Array || ArrayBuffer.isView(e) && e.constructor.name === "Uint8Array";
  }
  function gt(e, t = "") {
    if (!Number.isSafeInteger(e) || e < 0) {
      const n = t && `"${t}" `;
      throw new Error(`${n}expected integer >= 0, got ${e}`);
    }
  }
  function mt(e, t, n = "") {
    const r = qa(e), s = e == null ? void 0 : e.length, o = t !== void 0;
    if (!r || o && s !== t) {
      const a = n && `"${n}" `, i = o ? ` of length ${t}` : "", l = r ? `length=${s}` : `type=${typeof e}`;
      throw new Error(a + "expected Uint8Array" + i + ", got " + l);
    }
    return e;
  }
  function $s(e) {
    if (typeof e != "function" || typeof e.create != "function") throw new Error("Hash must wrapped by utils.createHasher");
    gt(e.outputLen), gt(e.blockLen);
  }
  function rn(e, t = true) {
    if (e.destroyed) throw new Error("Hash instance has been destroyed");
    if (t && e.finished) throw new Error("Hash#digest() has already been called");
  }
  function Qa(e, t) {
    mt(e, void 0, "digestInto() output");
    const n = t.outputLen;
    if (e.length < n) throw new Error('"digestInto() output" expected to be of length >=' + n);
  }
  function st(...e) {
    for (let t = 0; t < e.length; t++) e[t].fill(0);
  }
  function Zt(e) {
    return new DataView(e.buffer, e.byteOffset, e.byteLength);
  }
  function Te(e, t) {
    return e << 32 - t | e >>> t;
  }
  function ei(e) {
    if (typeof e != "string") throw new Error("string expected");
    return new Uint8Array(new TextEncoder().encode(e));
  }
  function Zr(e, t = "") {
    return typeof e == "string" ? ei(e) : mt(e, void 0, t);
  }
  function ti(e, t) {
    if (t !== void 0 && {}.toString.call(t) !== "[object Object]") throw new Error("options must be object or undefined");
    return Object.assign(e, t);
  }
  function Ps(e, t = {}) {
    const n = (s, o) => e(o).update(s).digest(), r = e(void 0);
    return n.outputLen = r.outputLen, n.blockLen = r.blockLen, n.create = (s) => e(s), Object.assign(n, t), Object.freeze(n);
  }
  function ni(e = 32) {
    const t = typeof globalThis == "object" ? globalThis.crypto : null;
    if (typeof (t == null ? void 0 : t.getRandomValues) != "function") throw new Error("crypto.getRandomValues must be defined");
    return t.getRandomValues(new Uint8Array(e));
  }
  const Os = (e) => ({
    oid: Uint8Array.from([
      6,
      9,
      96,
      134,
      72,
      1,
      101,
      3,
      4,
      2,
      e
    ])
  });
  class Ks {
    constructor(t, n) {
      __publicField(this, "oHash");
      __publicField(this, "iHash");
      __publicField(this, "blockLen");
      __publicField(this, "outputLen");
      __publicField(this, "finished", false);
      __publicField(this, "destroyed", false);
      if ($s(t), mt(n, void 0, "key"), this.iHash = t.create(), typeof this.iHash.update != "function") throw new Error("Expected instance of class which extends utils.Hash");
      this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
      const r = this.blockLen, s = new Uint8Array(r);
      s.set(n.length > r ? t.create().update(n).digest() : n);
      for (let o = 0; o < s.length; o++) s[o] ^= 54;
      this.iHash.update(s), this.oHash = t.create();
      for (let o = 0; o < s.length; o++) s[o] ^= 106;
      this.oHash.update(s), st(s);
    }
    update(t) {
      return rn(this), this.iHash.update(t), this;
    }
    digestInto(t) {
      rn(this), mt(t, this.outputLen, "output"), this.finished = true, this.iHash.digestInto(t), this.oHash.update(t), this.oHash.digestInto(t), this.destroy();
    }
    digest() {
      const t = new Uint8Array(this.oHash.outputLen);
      return this.digestInto(t), t;
    }
    _cloneInto(t) {
      t || (t = Object.create(Object.getPrototypeOf(this), {}));
      const { oHash: n, iHash: r, finished: s, destroyed: o, blockLen: a, outputLen: i } = this;
      return t = t, t.finished = s, t.destroyed = o, t.blockLen = a, t.outputLen = i, t.oHash = n._cloneInto(t.oHash), t.iHash = r._cloneInto(t.iHash), t;
    }
    clone() {
      return this._cloneInto();
    }
    destroy() {
      this.destroyed = true, this.oHash.destroy(), this.iHash.destroy();
    }
  }
  const Hs = (e, t, n) => new Ks(e, t).update(n).digest();
  Hs.create = (e, t) => new Ks(e, t);
  function ri(e, t, n, r) {
    $s(e);
    const s = ti({
      dkLen: 32,
      asyncTick: 10
    }, r), { c: o, dkLen: a, asyncTick: i } = s;
    if (gt(o, "c"), gt(a, "dkLen"), gt(i, "asyncTick"), o < 1) throw new Error("iterations (c) must be >= 1");
    const l = Zr(t, "password"), u = Zr(n, "salt"), h = new Uint8Array(a), d = Hs.create(e, l), y = d._cloneInto().update(u);
    return {
      c: o,
      dkLen: a,
      asyncTick: i,
      DK: h,
      PRF: d,
      PRFSalt: y
    };
  }
  function si(e, t, n, r, s) {
    return e.destroy(), t.destroy(), r && r.destroy(), st(s), n;
  }
  function oi(e, t, n, r) {
    const { c: s, dkLen: o, DK: a, PRF: i, PRFSalt: l } = ri(e, t, n, r);
    let u;
    const h = new Uint8Array(4), d = Zt(h), y = new Uint8Array(i.outputLen);
    for (let g = 1, v = 0; v < o; g++, v += i.outputLen) {
      const p = a.subarray(v, v + i.outputLen);
      d.setInt32(0, g, false), (u = l._cloneInto(u)).update(h).digestInto(y), p.set(y.subarray(0, p.length));
      for (let E = 1; E < s; E++) {
        i._cloneInto(u).update(y).digestInto(y);
        for (let R = 0; R < p.length; R++) p[R] ^= y[R];
      }
    }
    return si(i, l, a, u, y);
  }
  function ai(e, t, n) {
    return e & t ^ ~e & n;
  }
  function ii(e, t, n) {
    return e & t ^ e & n ^ t & n;
  }
  class Vs {
    constructor(t, n, r, s) {
      __publicField(this, "blockLen");
      __publicField(this, "outputLen");
      __publicField(this, "padOffset");
      __publicField(this, "isLE");
      __publicField(this, "buffer");
      __publicField(this, "view");
      __publicField(this, "finished", false);
      __publicField(this, "length", 0);
      __publicField(this, "pos", 0);
      __publicField(this, "destroyed", false);
      this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = s, this.buffer = new Uint8Array(t), this.view = Zt(this.buffer);
    }
    update(t) {
      rn(this), mt(t);
      const { view: n, buffer: r, blockLen: s } = this, o = t.length;
      for (let a = 0; a < o; ) {
        const i = Math.min(s - this.pos, o - a);
        if (i === s) {
          const l = Zt(t);
          for (; s <= o - a; a += s) this.process(l, a);
          continue;
        }
        r.set(t.subarray(a, a + i), this.pos), this.pos += i, a += i, this.pos === s && (this.process(n, 0), this.pos = 0);
      }
      return this.length += t.length, this.roundClean(), this;
    }
    digestInto(t) {
      rn(this), Qa(t, this), this.finished = true;
      const { buffer: n, view: r, blockLen: s, isLE: o } = this;
      let { pos: a } = this;
      n[a++] = 128, st(this.buffer.subarray(a)), this.padOffset > s - a && (this.process(r, 0), a = 0);
      for (let d = a; d < s; d++) n[d] = 0;
      r.setBigUint64(s - 8, BigInt(this.length * 8), o), this.process(r, 0);
      const i = Zt(t), l = this.outputLen;
      if (l % 4) throw new Error("_sha2: outputLen must be aligned to 32bit");
      const u = l / 4, h = this.get();
      if (u > h.length) throw new Error("_sha2: outputLen bigger than state");
      for (let d = 0; d < u; d++) i.setUint32(4 * d, h[d], o);
    }
    digest() {
      const { buffer: t, outputLen: n } = this;
      this.digestInto(t);
      const r = t.slice(0, n);
      return this.destroy(), r;
    }
    _cloneInto(t) {
      t || (t = new this.constructor()), t.set(...this.get());
      const { blockLen: n, buffer: r, length: s, finished: o, destroyed: a, pos: i } = this;
      return t.destroyed = a, t.finished = o, t.length = s, t.pos = i, s % n && t.buffer.set(r), t;
    }
    clone() {
      return this._cloneInto();
    }
  }
  const Oe = Uint32Array.from([
    1779033703,
    3144134277,
    1013904242,
    2773480762,
    1359893119,
    2600822924,
    528734635,
    1541459225
  ]), ie = Uint32Array.from([
    1779033703,
    4089235720,
    3144134277,
    2227873595,
    1013904242,
    4271175723,
    2773480762,
    1595750129,
    1359893119,
    2917565137,
    2600822924,
    725511199,
    528734635,
    4215389547,
    1541459225,
    327033209
  ]), $t = BigInt(2 ** 32 - 1), zr = BigInt(32);
  function ci(e, t = false) {
    return t ? {
      h: Number(e & $t),
      l: Number(e >> zr & $t)
    } : {
      h: Number(e >> zr & $t) | 0,
      l: Number(e & $t) | 0
    };
  }
  function li(e, t = false) {
    const n = e.length;
    let r = new Uint32Array(n), s = new Uint32Array(n);
    for (let o = 0; o < n; o++) {
      const { h: a, l: i } = ci(e[o], t);
      [r[o], s[o]] = [
        a,
        i
      ];
    }
    return [
      r,
      s
    ];
  }
  const Yr = (e, t, n) => e >>> n, Xr = (e, t, n) => e << 32 - n | t >>> n, ut = (e, t, n) => e >>> n | t << 32 - n, dt = (e, t, n) => e << 32 - n | t >>> n, Pt = (e, t, n) => e << 64 - n | t >>> n - 32, Ot = (e, t, n) => e >>> n - 32 | t << 64 - n;
  function Ue(e, t, n, r) {
    const s = (t >>> 0) + (r >>> 0);
    return {
      h: e + n + (s / 2 ** 32 | 0) | 0,
      l: s | 0
    };
  }
  const ui = (e, t, n) => (e >>> 0) + (t >>> 0) + (n >>> 0), di = (e, t, n, r) => t + n + r + (e / 2 ** 32 | 0) | 0, fi = (e, t, n, r) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0), hi = (e, t, n, r, s) => t + n + r + s + (e / 2 ** 32 | 0) | 0, gi = (e, t, n, r, s) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), yi = (e, t, n, r, s, o) => t + n + r + s + o + (e / 2 ** 32 | 0) | 0, mi = Uint32Array.from([
    1116352408,
    1899447441,
    3049323471,
    3921009573,
    961987163,
    1508970993,
    2453635748,
    2870763221,
    3624381080,
    310598401,
    607225278,
    1426881987,
    1925078388,
    2162078206,
    2614888103,
    3248222580,
    3835390401,
    4022224774,
    264347078,
    604807628,
    770255983,
    1249150122,
    1555081692,
    1996064986,
    2554220882,
    2821834349,
    2952996808,
    3210313671,
    3336571891,
    3584528711,
    113926993,
    338241895,
    666307205,
    773529912,
    1294757372,
    1396182291,
    1695183700,
    1986661051,
    2177026350,
    2456956037,
    2730485921,
    2820302411,
    3259730800,
    3345764771,
    3516065817,
    3600352804,
    4094571909,
    275423344,
    430227734,
    506948616,
    659060556,
    883997877,
    958139571,
    1322822218,
    1537002063,
    1747873779,
    1955562222,
    2024104815,
    2227730452,
    2361852424,
    2428436474,
    2756734187,
    3204031479,
    3329325298
  ]), Ke = new Uint32Array(64);
  class pi extends Vs {
    constructor(t) {
      super(64, t, 8, false);
    }
    get() {
      const { A: t, B: n, C: r, D: s, E: o, F: a, G: i, H: l } = this;
      return [
        t,
        n,
        r,
        s,
        o,
        a,
        i,
        l
      ];
    }
    set(t, n, r, s, o, a, i, l) {
      this.A = t | 0, this.B = n | 0, this.C = r | 0, this.D = s | 0, this.E = o | 0, this.F = a | 0, this.G = i | 0, this.H = l | 0;
    }
    process(t, n) {
      for (let d = 0; d < 16; d++, n += 4) Ke[d] = t.getUint32(n, false);
      for (let d = 16; d < 64; d++) {
        const y = Ke[d - 15], g = Ke[d - 2], v = Te(y, 7) ^ Te(y, 18) ^ y >>> 3, p = Te(g, 17) ^ Te(g, 19) ^ g >>> 10;
        Ke[d] = p + Ke[d - 7] + v + Ke[d - 16] | 0;
      }
      let { A: r, B: s, C: o, D: a, E: i, F: l, G: u, H: h } = this;
      for (let d = 0; d < 64; d++) {
        const y = Te(i, 6) ^ Te(i, 11) ^ Te(i, 25), g = h + y + ai(i, l, u) + mi[d] + Ke[d] | 0, p = (Te(r, 2) ^ Te(r, 13) ^ Te(r, 22)) + ii(r, s, o) | 0;
        h = u, u = l, l = i, i = a + g | 0, a = o, o = s, s = r, r = g + p | 0;
      }
      r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, a = a + this.D | 0, i = i + this.E | 0, l = l + this.F | 0, u = u + this.G | 0, h = h + this.H | 0, this.set(r, s, o, a, i, l, u, h);
    }
    roundClean() {
      st(Ke);
    }
    destroy() {
      this.set(0, 0, 0, 0, 0, 0, 0, 0), st(this.buffer);
    }
  }
  class wi extends pi {
    constructor() {
      super(32);
      __publicField(this, "A", Oe[0] | 0);
      __publicField(this, "B", Oe[1] | 0);
      __publicField(this, "C", Oe[2] | 0);
      __publicField(this, "D", Oe[3] | 0);
      __publicField(this, "E", Oe[4] | 0);
      __publicField(this, "F", Oe[5] | 0);
      __publicField(this, "G", Oe[6] | 0);
      __publicField(this, "H", Oe[7] | 0);
    }
  }
  const Ws = li([
    "0x428a2f98d728ae22",
    "0x7137449123ef65cd",
    "0xb5c0fbcfec4d3b2f",
    "0xe9b5dba58189dbbc",
    "0x3956c25bf348b538",
    "0x59f111f1b605d019",
    "0x923f82a4af194f9b",
    "0xab1c5ed5da6d8118",
    "0xd807aa98a3030242",
    "0x12835b0145706fbe",
    "0x243185be4ee4b28c",
    "0x550c7dc3d5ffb4e2",
    "0x72be5d74f27b896f",
    "0x80deb1fe3b1696b1",
    "0x9bdc06a725c71235",
    "0xc19bf174cf692694",
    "0xe49b69c19ef14ad2",
    "0xefbe4786384f25e3",
    "0x0fc19dc68b8cd5b5",
    "0x240ca1cc77ac9c65",
    "0x2de92c6f592b0275",
    "0x4a7484aa6ea6e483",
    "0x5cb0a9dcbd41fbd4",
    "0x76f988da831153b5",
    "0x983e5152ee66dfab",
    "0xa831c66d2db43210",
    "0xb00327c898fb213f",
    "0xbf597fc7beef0ee4",
    "0xc6e00bf33da88fc2",
    "0xd5a79147930aa725",
    "0x06ca6351e003826f",
    "0x142929670a0e6e70",
    "0x27b70a8546d22ffc",
    "0x2e1b21385c26c926",
    "0x4d2c6dfc5ac42aed",
    "0x53380d139d95b3df",
    "0x650a73548baf63de",
    "0x766a0abb3c77b2a8",
    "0x81c2c92e47edaee6",
    "0x92722c851482353b",
    "0xa2bfe8a14cf10364",
    "0xa81a664bbc423001",
    "0xc24b8b70d0f89791",
    "0xc76c51a30654be30",
    "0xd192e819d6ef5218",
    "0xd69906245565a910",
    "0xf40e35855771202a",
    "0x106aa07032bbd1b8",
    "0x19a4c116b8d2d0c8",
    "0x1e376c085141ab53",
    "0x2748774cdf8eeb99",
    "0x34b0bcb5e19b48a8",
    "0x391c0cb3c5c95a63",
    "0x4ed8aa4ae3418acb",
    "0x5b9cca4f7763e373",
    "0x682e6ff3d6b2b8a3",
    "0x748f82ee5defb2fc",
    "0x78a5636f43172f60",
    "0x84c87814a1f0ab72",
    "0x8cc702081a6439ec",
    "0x90befffa23631e28",
    "0xa4506cebde82bde9",
    "0xbef9a3f7b2c67915",
    "0xc67178f2e372532b",
    "0xca273eceea26619c",
    "0xd186b8c721c0c207",
    "0xeada7dd6cde0eb1e",
    "0xf57d4f7fee6ed178",
    "0x06f067aa72176fba",
    "0x0a637dc5a2c898a6",
    "0x113f9804bef90dae",
    "0x1b710b35131c471b",
    "0x28db77f523047d84",
    "0x32caab7b40c72493",
    "0x3c9ebe0a15c9bebc",
    "0x431d67c49c100d4c",
    "0x4cc5d4becb3e42b6",
    "0x597f299cfc657e2a",
    "0x5fcb6fab3ad6faec",
    "0x6c44198c4a475817"
  ].map((e) => BigInt(e))), bi = Ws[0], vi = Ws[1], He = new Uint32Array(80), Ve = new Uint32Array(80);
  class xi extends Vs {
    constructor(t) {
      super(128, t, 16, false);
    }
    get() {
      const { Ah: t, Al: n, Bh: r, Bl: s, Ch: o, Cl: a, Dh: i, Dl: l, Eh: u, El: h, Fh: d, Fl: y, Gh: g, Gl: v, Hh: p, Hl: E } = this;
      return [
        t,
        n,
        r,
        s,
        o,
        a,
        i,
        l,
        u,
        h,
        d,
        y,
        g,
        v,
        p,
        E
      ];
    }
    set(t, n, r, s, o, a, i, l, u, h, d, y, g, v, p, E) {
      this.Ah = t | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = o | 0, this.Cl = a | 0, this.Dh = i | 0, this.Dl = l | 0, this.Eh = u | 0, this.El = h | 0, this.Fh = d | 0, this.Fl = y | 0, this.Gh = g | 0, this.Gl = v | 0, this.Hh = p | 0, this.Hl = E | 0;
    }
    process(t, n) {
      for (let C = 0; C < 16; C++, n += 4) He[C] = t.getUint32(n), Ve[C] = t.getUint32(n += 4);
      for (let C = 16; C < 80; C++) {
        const M = He[C - 15] | 0, G = Ve[C - 15] | 0, K = ut(M, G, 1) ^ ut(M, G, 8) ^ Yr(M, G, 7), W = dt(M, G, 1) ^ dt(M, G, 8) ^ Xr(M, G, 7), O = He[C - 2] | 0, X = Ve[C - 2] | 0, F = ut(O, X, 19) ^ Pt(O, X, 61) ^ Yr(O, X, 6), Q = dt(O, X, 19) ^ Ot(O, X, 61) ^ Xr(O, X, 6), se = fi(W, Q, Ve[C - 7], Ve[C - 16]), w = hi(se, K, F, He[C - 7], He[C - 16]);
        He[C] = w | 0, Ve[C] = se | 0;
      }
      let { Ah: r, Al: s, Bh: o, Bl: a, Ch: i, Cl: l, Dh: u, Dl: h, Eh: d, El: y, Fh: g, Fl: v, Gh: p, Gl: E, Hh: R, Hl: D } = this;
      for (let C = 0; C < 80; C++) {
        const M = ut(d, y, 14) ^ ut(d, y, 18) ^ Pt(d, y, 41), G = dt(d, y, 14) ^ dt(d, y, 18) ^ Ot(d, y, 41), K = d & g ^ ~d & p, W = y & v ^ ~y & E, O = gi(D, G, W, vi[C], Ve[C]), X = yi(O, R, M, K, bi[C], He[C]), F = O | 0, Q = ut(r, s, 28) ^ Pt(r, s, 34) ^ Pt(r, s, 39), se = dt(r, s, 28) ^ Ot(r, s, 34) ^ Ot(r, s, 39), w = r & o ^ r & i ^ o & i, m = s & a ^ s & l ^ a & l;
        R = p | 0, D = E | 0, p = g | 0, E = v | 0, g = d | 0, v = y | 0, { h: d, l: y } = Ue(u | 0, h | 0, X | 0, F | 0), u = i | 0, h = l | 0, i = o | 0, l = a | 0, o = r | 0, a = s | 0;
        const S = ui(F, se, m);
        r = di(S, X, Q, w), s = S | 0;
      }
      ({ h: r, l: s } = Ue(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: o, l: a } = Ue(this.Bh | 0, this.Bl | 0, o | 0, a | 0), { h: i, l } = Ue(this.Ch | 0, this.Cl | 0, i | 0, l | 0), { h: u, l: h } = Ue(this.Dh | 0, this.Dl | 0, u | 0, h | 0), { h: d, l: y } = Ue(this.Eh | 0, this.El | 0, d | 0, y | 0), { h: g, l: v } = Ue(this.Fh | 0, this.Fl | 0, g | 0, v | 0), { h: p, l: E } = Ue(this.Gh | 0, this.Gl | 0, p | 0, E | 0), { h: R, l: D } = Ue(this.Hh | 0, this.Hl | 0, R | 0, D | 0), this.set(r, s, o, a, i, l, u, h, d, y, g, v, p, E, R, D);
    }
    roundClean() {
      st(He, Ve);
    }
    destroy() {
      st(this.buffer), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    }
  }
  class Ii extends xi {
    constructor() {
      super(64);
      __publicField(this, "Ah", ie[0] | 0);
      __publicField(this, "Al", ie[1] | 0);
      __publicField(this, "Bh", ie[2] | 0);
      __publicField(this, "Bl", ie[3] | 0);
      __publicField(this, "Ch", ie[4] | 0);
      __publicField(this, "Cl", ie[5] | 0);
      __publicField(this, "Dh", ie[6] | 0);
      __publicField(this, "Dl", ie[7] | 0);
      __publicField(this, "Eh", ie[8] | 0);
      __publicField(this, "El", ie[9] | 0);
      __publicField(this, "Fh", ie[10] | 0);
      __publicField(this, "Fl", ie[11] | 0);
      __publicField(this, "Gh", ie[12] | 0);
      __publicField(this, "Gl", ie[13] | 0);
      __publicField(this, "Hh", ie[14] | 0);
      __publicField(this, "Hl", ie[15] | 0);
    }
  }
  const ki = Ps(() => new wi(), Os(1)), Si = Ps(() => new Ii(), Os(3));
  function sn(e) {
    return e instanceof Uint8Array || ArrayBuffer.isView(e) && e.constructor.name === "Uint8Array";
  }
  function Fs(e, t) {
    return Array.isArray(t) ? t.length === 0 ? true : e ? t.every((n) => typeof n == "string") : t.every((n) => Number.isSafeInteger(n)) : false;
  }
  function Ai(e) {
    if (typeof e != "function") throw new Error("function expected");
    return true;
  }
  function on(e, t) {
    if (typeof t != "string") throw new Error(`${e}: string expected`);
    return true;
  }
  function vt(e) {
    if (!Number.isSafeInteger(e)) throw new Error(`invalid integer: ${e}`);
  }
  function an(e) {
    if (!Array.isArray(e)) throw new Error("array expected");
  }
  function cn(e, t) {
    if (!Fs(true, t)) throw new Error(`${e}: array of strings expected`);
  }
  function Zs(e, t) {
    if (!Fs(false, t)) throw new Error(`${e}: array of numbers expected`);
  }
  function Ci(...e) {
    const t = (o) => o, n = (o, a) => (i) => o(a(i)), r = e.map((o) => o.encode).reduceRight(n, t), s = e.map((o) => o.decode).reduce(n, t);
    return {
      encode: r,
      decode: s
    };
  }
  function Ei(e) {
    const t = typeof e == "string" ? e.split("") : e, n = t.length;
    cn("alphabet", t);
    const r = new Map(t.map((s, o) => [
      s,
      o
    ]));
    return {
      encode: (s) => (an(s), s.map((o) => {
        if (!Number.isSafeInteger(o) || o < 0 || o >= n) throw new Error(`alphabet.encode: digit index outside alphabet "${o}". Allowed: ${e}`);
        return t[o];
      })),
      decode: (s) => (an(s), s.map((o) => {
        on("alphabet.decode", o);
        const a = r.get(o);
        if (a === void 0) throw new Error(`Unknown letter: "${o}". Allowed: ${e}`);
        return a;
      }))
    };
  }
  function ji(e = "") {
    return on("join", e), {
      encode: (t) => (cn("join.decode", t), t.join(e)),
      decode: (t) => (on("join.decode", t), t.split(e))
    };
  }
  function _i(e, t = "=") {
    return vt(e), on("padding", t), {
      encode(n) {
        for (cn("padding.encode", n); n.length * e % 8; ) n.push(t);
        return n;
      },
      decode(n) {
        cn("padding.decode", n);
        let r = n.length;
        if (r * e % 8) throw new Error("padding: invalid, string should have whole number of bytes");
        for (; r > 0 && n[r - 1] === t; r--) if ((r - 1) * e % 8 === 0) throw new Error("padding: invalid, string has too much padding");
        return n.slice(0, r);
      }
    };
  }
  function qn(e, t, n) {
    if (t < 2) throw new Error(`convertRadix: invalid from=${t}, base cannot be less than 2`);
    if (n < 2) throw new Error(`convertRadix: invalid to=${n}, base cannot be less than 2`);
    if (an(e), !e.length) return [];
    let r = 0;
    const s = [], o = Array.from(e, (i) => {
      if (vt(i), i < 0 || i >= t) throw new Error(`invalid integer: ${i}`);
      return i;
    }), a = o.length;
    for (; ; ) {
      let i = 0, l = true;
      for (let u = r; u < a; u++) {
        const h = o[u], d = t * i, y = d + h;
        if (!Number.isSafeInteger(y) || d / t !== i || y - h !== d) throw new Error("convertRadix: carry overflow");
        const g = y / n;
        i = y % n;
        const v = Math.floor(g);
        if (o[u] = v, !Number.isSafeInteger(v) || v * n + i !== y) throw new Error("convertRadix: carry overflow");
        if (l) v ? l = false : r = u;
        else continue;
      }
      if (s.push(i), l) break;
    }
    for (let i = 0; i < e.length - 1 && e[i] === 0; i++) s.push(0);
    return s.reverse();
  }
  const zs = (e, t) => t === 0 ? e : zs(t, e % t), ln = (e, t) => e + (t - zs(e, t)), On = (() => {
    let e = [];
    for (let t = 0; t < 40; t++) e.push(2 ** t);
    return e;
  })();
  function Qn(e, t, n, r) {
    if (an(e), t <= 0 || t > 32) throw new Error(`convertRadix2: wrong from=${t}`);
    if (n <= 0 || n > 32) throw new Error(`convertRadix2: wrong to=${n}`);
    if (ln(t, n) > 32) throw new Error(`convertRadix2: carry overflow from=${t} to=${n} carryBits=${ln(t, n)}`);
    let s = 0, o = 0;
    const a = On[t], i = On[n] - 1, l = [];
    for (const u of e) {
      if (vt(u), u >= a) throw new Error(`convertRadix2: invalid data word=${u} from=${t}`);
      if (s = s << t | u, o + t > 32) throw new Error(`convertRadix2: carry overflow pos=${o} from=${t}`);
      for (o += t; o >= n; o -= n) l.push((s >> o - n & i) >>> 0);
      const h = On[o];
      if (h === void 0) throw new Error("invalid carry");
      s &= h - 1;
    }
    if (s = s << n - o & i, !r && o >= t) throw new Error("Excess padding");
    if (!r && s > 0) throw new Error(`Non-zero padding: ${s}`);
    return r && o > 0 && l.push(s >>> 0), l;
  }
  function Ti(e) {
    vt(e);
    const t = 2 ** 8;
    return {
      encode: (n) => {
        if (!sn(n)) throw new Error("radix.encode input should be Uint8Array");
        return qn(Array.from(n), t, e);
      },
      decode: (n) => (Zs("radix.decode", n), Uint8Array.from(qn(n, e, t)))
    };
  }
  function Bi(e, t = false) {
    if (vt(e), e <= 0 || e > 32) throw new Error("radix2: bits should be in (0..32]");
    if (ln(8, e) > 32 || ln(e, 8) > 32) throw new Error("radix2: carry overflow");
    return {
      encode: (n) => {
        if (!sn(n)) throw new Error("radix2.encode input should be Uint8Array");
        return Qn(Array.from(n), 8, e, !t);
      },
      decode: (n) => (Zs("radix2.decode", n), Uint8Array.from(Qn(n, e, 8, t)))
    };
  }
  function Ni(e, t) {
    return vt(e), Ai(t), {
      encode(n) {
        if (!sn(n)) throw new Error("checksum.encode: input should be Uint8Array");
        const r = t(n).slice(0, e), s = new Uint8Array(n.length + e);
        return s.set(n), s.set(r, n.length), s;
      },
      decode(n) {
        if (!sn(n)) throw new Error("checksum.decode: input should be Uint8Array");
        const r = n.slice(0, -e), s = n.slice(-e), o = t(r).slice(0, e);
        for (let a = 0; a < e; a++) if (o[a] !== s[a]) throw new Error("Invalid checksum");
        return r;
      }
    };
  }
  const Kt = {
    alphabet: Ei,
    chain: Ci,
    checksum: Ni,
    convertRadix: qn,
    convertRadix2: Qn,
    radix: Ti,
    radix2: Bi,
    join: ji,
    padding: _i
  };
  const Ri = (e) => e[0] === "\u3042\u3044\u3053\u304F\u3057\u3093";
  function Ys(e) {
    if (typeof e != "string") throw new TypeError("invalid mnemonic type: " + typeof e);
    return e.normalize("NFKD");
  }
  function Xs(e) {
    const t = Ys(e), n = t.split(" ");
    if (![
      12,
      15,
      18,
      21,
      24
    ].includes(n.length)) throw new Error("Invalid mnemonic");
    return {
      nfkd: t,
      words: n
    };
  }
  function Js(e) {
    if (mt(e), ![
      16,
      20,
      24,
      28,
      32
    ].includes(e.length)) throw new Error("invalid entropy length");
  }
  function Mi(e, t = 128) {
    if (gt(t), t % 32 !== 0 || t > 256) throw new TypeError("Invalid entropy");
    return Di(ni(t / 8), e);
  }
  const Ui = (e) => {
    const t = 8 - e.length / 4;
    return new Uint8Array([
      ki(e)[0] >> t << t
    ]);
  };
  function qs(e) {
    if (!Array.isArray(e) || e.length !== 2048 || typeof e[0] != "string") throw new Error("Wordlist: expected array of 2048 strings");
    return e.forEach((t) => {
      if (typeof t != "string") throw new Error("wordlist: non-string element: " + t);
    }), Kt.chain(Kt.checksum(1, Ui), Kt.radix2(11, true), Kt.alphabet(e));
  }
  function Li(e, t) {
    const { words: n } = Xs(e), r = qs(t).decode(n);
    return Js(r), r;
  }
  function Di(e, t) {
    return Js(e), qs(t).encode(e).join(Ri(t) ? "\u3000" : " ");
  }
  function Gi(e, t) {
    try {
      Li(e, t);
    } catch {
      return false;
    }
    return true;
  }
  const $i = (e) => Ys("mnemonic" + e);
  function Pi(e, t = "") {
    return oi(Si, Xs(e).nfkd, $i(t), {
      c: 2048,
      dkLen: 64
    });
  }
  const gr = `abandon
ability
able
about
above
absent
absorb
abstract
absurd
abuse
access
accident
account
accuse
achieve
acid
acoustic
acquire
across
act
action
actor
actress
actual
adapt
add
addict
address
adjust
admit
adult
advance
advice
aerobic
affair
afford
afraid
again
age
agent
agree
ahead
aim
air
airport
aisle
alarm
album
alcohol
alert
alien
all
alley
allow
almost
alone
alpha
already
also
alter
always
amateur
amazing
among
amount
amused
analyst
anchor
ancient
anger
angle
angry
animal
ankle
announce
annual
another
answer
antenna
antique
anxiety
any
apart
apology
appear
apple
approve
april
arch
arctic
area
arena
argue
arm
armed
armor
army
around
arrange
arrest
arrive
arrow
art
artefact
artist
artwork
ask
aspect
assault
asset
assist
assume
asthma
athlete
atom
attack
attend
attitude
attract
auction
audit
august
aunt
author
auto
autumn
average
avocado
avoid
awake
aware
away
awesome
awful
awkward
axis
baby
bachelor
bacon
badge
bag
balance
balcony
ball
bamboo
banana
banner
bar
barely
bargain
barrel
base
basic
basket
battle
beach
bean
beauty
because
become
beef
before
begin
behave
behind
believe
below
belt
bench
benefit
best
betray
better
between
beyond
bicycle
bid
bike
bind
biology
bird
birth
bitter
black
blade
blame
blanket
blast
bleak
bless
blind
blood
blossom
blouse
blue
blur
blush
board
boat
body
boil
bomb
bone
bonus
book
boost
border
boring
borrow
boss
bottom
bounce
box
boy
bracket
brain
brand
brass
brave
bread
breeze
brick
bridge
brief
bright
bring
brisk
broccoli
broken
bronze
broom
brother
brown
brush
bubble
buddy
budget
buffalo
build
bulb
bulk
bullet
bundle
bunker
burden
burger
burst
bus
business
busy
butter
buyer
buzz
cabbage
cabin
cable
cactus
cage
cake
call
calm
camera
camp
can
canal
cancel
candy
cannon
canoe
canvas
canyon
capable
capital
captain
car
carbon
card
cargo
carpet
carry
cart
case
cash
casino
castle
casual
cat
catalog
catch
category
cattle
caught
cause
caution
cave
ceiling
celery
cement
census
century
cereal
certain
chair
chalk
champion
change
chaos
chapter
charge
chase
chat
cheap
check
cheese
chef
cherry
chest
chicken
chief
child
chimney
choice
choose
chronic
chuckle
chunk
churn
cigar
cinnamon
circle
citizen
city
civil
claim
clap
clarify
claw
clay
clean
clerk
clever
click
client
cliff
climb
clinic
clip
clock
clog
close
cloth
cloud
clown
club
clump
cluster
clutch
coach
coast
coconut
code
coffee
coil
coin
collect
color
column
combine
come
comfort
comic
common
company
concert
conduct
confirm
congress
connect
consider
control
convince
cook
cool
copper
copy
coral
core
corn
correct
cost
cotton
couch
country
couple
course
cousin
cover
coyote
crack
cradle
craft
cram
crane
crash
crater
crawl
crazy
cream
credit
creek
crew
cricket
crime
crisp
critic
crop
cross
crouch
crowd
crucial
cruel
cruise
crumble
crunch
crush
cry
crystal
cube
culture
cup
cupboard
curious
current
curtain
curve
cushion
custom
cute
cycle
dad
damage
damp
dance
danger
daring
dash
daughter
dawn
day
deal
debate
debris
decade
december
decide
decline
decorate
decrease
deer
defense
define
defy
degree
delay
deliver
demand
demise
denial
dentist
deny
depart
depend
deposit
depth
deputy
derive
describe
desert
design
desk
despair
destroy
detail
detect
develop
device
devote
diagram
dial
diamond
diary
dice
diesel
diet
differ
digital
dignity
dilemma
dinner
dinosaur
direct
dirt
disagree
discover
disease
dish
dismiss
disorder
display
distance
divert
divide
divorce
dizzy
doctor
document
dog
doll
dolphin
domain
donate
donkey
donor
door
dose
double
dove
draft
dragon
drama
drastic
draw
dream
dress
drift
drill
drink
drip
drive
drop
drum
dry
duck
dumb
dune
during
dust
dutch
duty
dwarf
dynamic
eager
eagle
early
earn
earth
easily
east
easy
echo
ecology
economy
edge
edit
educate
effort
egg
eight
either
elbow
elder
electric
elegant
element
elephant
elevator
elite
else
embark
embody
embrace
emerge
emotion
employ
empower
empty
enable
enact
end
endless
endorse
enemy
energy
enforce
engage
engine
enhance
enjoy
enlist
enough
enrich
enroll
ensure
enter
entire
entry
envelope
episode
equal
equip
era
erase
erode
erosion
error
erupt
escape
essay
essence
estate
eternal
ethics
evidence
evil
evoke
evolve
exact
example
excess
exchange
excite
exclude
excuse
execute
exercise
exhaust
exhibit
exile
exist
exit
exotic
expand
expect
expire
explain
expose
express
extend
extra
eye
eyebrow
fabric
face
faculty
fade
faint
faith
fall
false
fame
family
famous
fan
fancy
fantasy
farm
fashion
fat
fatal
father
fatigue
fault
favorite
feature
february
federal
fee
feed
feel
female
fence
festival
fetch
fever
few
fiber
fiction
field
figure
file
film
filter
final
find
fine
finger
finish
fire
firm
first
fiscal
fish
fit
fitness
fix
flag
flame
flash
flat
flavor
flee
flight
flip
float
flock
floor
flower
fluid
flush
fly
foam
focus
fog
foil
fold
follow
food
foot
force
forest
forget
fork
fortune
forum
forward
fossil
foster
found
fox
fragile
frame
frequent
fresh
friend
fringe
frog
front
frost
frown
frozen
fruit
fuel
fun
funny
furnace
fury
future
gadget
gain
galaxy
gallery
game
gap
garage
garbage
garden
garlic
garment
gas
gasp
gate
gather
gauge
gaze
general
genius
genre
gentle
genuine
gesture
ghost
giant
gift
giggle
ginger
giraffe
girl
give
glad
glance
glare
glass
glide
glimpse
globe
gloom
glory
glove
glow
glue
goat
goddess
gold
good
goose
gorilla
gospel
gossip
govern
gown
grab
grace
grain
grant
grape
grass
gravity
great
green
grid
grief
grit
grocery
group
grow
grunt
guard
guess
guide
guilt
guitar
gun
gym
habit
hair
half
hammer
hamster
hand
happy
harbor
hard
harsh
harvest
hat
have
hawk
hazard
head
health
heart
heavy
hedgehog
height
hello
helmet
help
hen
hero
hidden
high
hill
hint
hip
hire
history
hobby
hockey
hold
hole
holiday
hollow
home
honey
hood
hope
horn
horror
horse
hospital
host
hotel
hour
hover
hub
huge
human
humble
humor
hundred
hungry
hunt
hurdle
hurry
hurt
husband
hybrid
ice
icon
idea
identify
idle
ignore
ill
illegal
illness
image
imitate
immense
immune
impact
impose
improve
impulse
inch
include
income
increase
index
indicate
indoor
industry
infant
inflict
inform
inhale
inherit
initial
inject
injury
inmate
inner
innocent
input
inquiry
insane
insect
inside
inspire
install
intact
interest
into
invest
invite
involve
iron
island
isolate
issue
item
ivory
jacket
jaguar
jar
jazz
jealous
jeans
jelly
jewel
job
join
joke
journey
joy
judge
juice
jump
jungle
junior
junk
just
kangaroo
keen
keep
ketchup
key
kick
kid
kidney
kind
kingdom
kiss
kit
kitchen
kite
kitten
kiwi
knee
knife
knock
know
lab
label
labor
ladder
lady
lake
lamp
language
laptop
large
later
latin
laugh
laundry
lava
law
lawn
lawsuit
layer
lazy
leader
leaf
learn
leave
lecture
left
leg
legal
legend
leisure
lemon
lend
length
lens
leopard
lesson
letter
level
liar
liberty
library
license
life
lift
light
like
limb
limit
link
lion
liquid
list
little
live
lizard
load
loan
lobster
local
lock
logic
lonely
long
loop
lottery
loud
lounge
love
loyal
lucky
luggage
lumber
lunar
lunch
luxury
lyrics
machine
mad
magic
magnet
maid
mail
main
major
make
mammal
man
manage
mandate
mango
mansion
manual
maple
marble
march
margin
marine
market
marriage
mask
mass
master
match
material
math
matrix
matter
maximum
maze
meadow
mean
measure
meat
mechanic
medal
media
melody
melt
member
memory
mention
menu
mercy
merge
merit
merry
mesh
message
metal
method
middle
midnight
milk
million
mimic
mind
minimum
minor
minute
miracle
mirror
misery
miss
mistake
mix
mixed
mixture
mobile
model
modify
mom
moment
monitor
monkey
monster
month
moon
moral
more
morning
mosquito
mother
motion
motor
mountain
mouse
move
movie
much
muffin
mule
multiply
muscle
museum
mushroom
music
must
mutual
myself
mystery
myth
naive
name
napkin
narrow
nasty
nation
nature
near
neck
need
negative
neglect
neither
nephew
nerve
nest
net
network
neutral
never
news
next
nice
night
noble
noise
nominee
noodle
normal
north
nose
notable
note
nothing
notice
novel
now
nuclear
number
nurse
nut
oak
obey
object
oblige
obscure
observe
obtain
obvious
occur
ocean
october
odor
off
offer
office
often
oil
okay
old
olive
olympic
omit
once
one
onion
online
only
open
opera
opinion
oppose
option
orange
orbit
orchard
order
ordinary
organ
orient
original
orphan
ostrich
other
outdoor
outer
output
outside
oval
oven
over
own
owner
oxygen
oyster
ozone
pact
paddle
page
pair
palace
palm
panda
panel
panic
panther
paper
parade
parent
park
parrot
party
pass
patch
path
patient
patrol
pattern
pause
pave
payment
peace
peanut
pear
peasant
pelican
pen
penalty
pencil
people
pepper
perfect
permit
person
pet
phone
photo
phrase
physical
piano
picnic
picture
piece
pig
pigeon
pill
pilot
pink
pioneer
pipe
pistol
pitch
pizza
place
planet
plastic
plate
play
please
pledge
pluck
plug
plunge
poem
poet
point
polar
pole
police
pond
pony
pool
popular
portion
position
possible
post
potato
pottery
poverty
powder
power
practice
praise
predict
prefer
prepare
present
pretty
prevent
price
pride
primary
print
priority
prison
private
prize
problem
process
produce
profit
program
project
promote
proof
property
prosper
protect
proud
provide
public
pudding
pull
pulp
pulse
pumpkin
punch
pupil
puppy
purchase
purity
purpose
purse
push
put
puzzle
pyramid
quality
quantum
quarter
question
quick
quit
quiz
quote
rabbit
raccoon
race
rack
radar
radio
rail
rain
raise
rally
ramp
ranch
random
range
rapid
rare
rate
rather
raven
raw
razor
ready
real
reason
rebel
rebuild
recall
receive
recipe
record
recycle
reduce
reflect
reform
refuse
region
regret
regular
reject
relax
release
relief
rely
remain
remember
remind
remove
render
renew
rent
reopen
repair
repeat
replace
report
require
rescue
resemble
resist
resource
response
result
retire
retreat
return
reunion
reveal
review
reward
rhythm
rib
ribbon
rice
rich
ride
ridge
rifle
right
rigid
ring
riot
ripple
risk
ritual
rival
river
road
roast
robot
robust
rocket
romance
roof
rookie
room
rose
rotate
rough
round
route
royal
rubber
rude
rug
rule
run
runway
rural
sad
saddle
sadness
safe
sail
salad
salmon
salon
salt
salute
same
sample
sand
satisfy
satoshi
sauce
sausage
save
say
scale
scan
scare
scatter
scene
scheme
school
science
scissors
scorpion
scout
scrap
screen
script
scrub
sea
search
season
seat
second
secret
section
security
seed
seek
segment
select
sell
seminar
senior
sense
sentence
series
service
session
settle
setup
seven
shadow
shaft
shallow
share
shed
shell
sheriff
shield
shift
shine
ship
shiver
shock
shoe
shoot
shop
short
shoulder
shove
shrimp
shrug
shuffle
shy
sibling
sick
side
siege
sight
sign
silent
silk
silly
silver
similar
simple
since
sing
siren
sister
situate
six
size
skate
sketch
ski
skill
skin
skirt
skull
slab
slam
sleep
slender
slice
slide
slight
slim
slogan
slot
slow
slush
small
smart
smile
smoke
smooth
snack
snake
snap
sniff
snow
soap
soccer
social
sock
soda
soft
solar
soldier
solid
solution
solve
someone
song
soon
sorry
sort
soul
sound
soup
source
south
space
spare
spatial
spawn
speak
special
speed
spell
spend
sphere
spice
spider
spike
spin
spirit
split
spoil
sponsor
spoon
sport
spot
spray
spread
spring
spy
square
squeeze
squirrel
stable
stadium
staff
stage
stairs
stamp
stand
start
state
stay
steak
steel
stem
step
stereo
stick
still
sting
stock
stomach
stone
stool
story
stove
strategy
street
strike
strong
struggle
student
stuff
stumble
style
subject
submit
subway
success
such
sudden
suffer
sugar
suggest
suit
summer
sun
sunny
sunset
super
supply
supreme
sure
surface
surge
surprise
surround
survey
suspect
sustain
swallow
swamp
swap
swarm
swear
sweet
swift
swim
swing
switch
sword
symbol
symptom
syrup
system
table
tackle
tag
tail
talent
talk
tank
tape
target
task
taste
tattoo
taxi
teach
team
tell
ten
tenant
tennis
tent
term
test
text
thank
that
theme
then
theory
there
they
thing
this
thought
three
thrive
throw
thumb
thunder
ticket
tide
tiger
tilt
timber
time
tiny
tip
tired
tissue
title
toast
tobacco
today
toddler
toe
together
toilet
token
tomato
tomorrow
tone
tongue
tonight
tool
tooth
top
topic
topple
torch
tornado
tortoise
toss
total
tourist
toward
tower
town
toy
track
trade
traffic
tragic
train
transfer
trap
trash
travel
tray
treat
tree
trend
trial
tribe
trick
trigger
trim
trip
trophy
trouble
truck
true
truly
trumpet
trust
truth
try
tube
tuition
tumble
tuna
tunnel
turkey
turn
turtle
twelve
twenty
twice
twin
twist
two
type
typical
ugly
umbrella
unable
unaware
uncle
uncover
under
undo
unfair
unfold
unhappy
uniform
unique
unit
universe
unknown
unlock
until
unusual
unveil
update
upgrade
uphold
upon
upper
upset
urban
urge
usage
use
used
useful
useless
usual
utility
vacant
vacuum
vague
valid
valley
valve
van
vanish
vapor
various
vast
vault
vehicle
velvet
vendor
venture
venue
verb
verify
version
very
vessel
veteran
viable
vibrant
vicious
victory
video
view
village
vintage
violin
virtual
virus
visa
visit
visual
vital
vivid
vocal
voice
void
volcano
volume
vote
voyage
wage
wagon
wait
walk
wall
walnut
want
warfare
warm
warrior
wash
wasp
waste
water
wave
way
wealth
weapon
wear
weasel
weather
web
wedding
weekend
weird
welcome
west
wet
whale
what
wheat
wheel
when
where
whip
whisper
wide
width
wife
wild
will
win
window
wine
wing
wink
winner
winter
wire
wisdom
wise
wish
witness
wolf
woman
wonder
wood
wool
word
work
world
worry
worth
wrap
wreck
wrestle
wrist
write
wrong
yard
year
yellow
you
young
youth
zebra
zero
zone
zoo`.split(`
`);
  const Qs = {
    p: 0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffedn,
    n: 0x1000000000000000000000000000000014def9dea2f79cd65812631a5cf5d3edn,
    h: 8n,
    a: 0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffecn,
    d: 0x52036cee2b6ffe738cc740797779e89800700a4d4141d8ab75eb4dca135978a3n,
    Gx: 0x216936d3cd6e53fec0a4e231fdd6dc5c692cc7609525a7b2c9562d608f25d51an,
    Gy: 0x6666666666666666666666666666666666666666666666666666666666666658n
  }, { p: un, n: zt, Gx: Jr, Gy: qr, a: Kn, d: Hn, h: Oi } = Qs, $e = 32, Ki = (...e) => {
    "captureStackTrace" in Error && typeof Error.captureStackTrace == "function" && Error.captureStackTrace(...e);
  }, ne = (e = "") => {
    const t = new Error(e);
    throw Ki(t, ne), t;
  }, Hi = (e) => typeof e == "bigint", Vi = (e) => typeof e == "string", Wi = (e) => e instanceof Uint8Array || ArrayBuffer.isView(e) && e.constructor.name === "Uint8Array", Ie = (e, t, n = "") => {
    const r = Wi(e), s = e == null ? void 0 : e.length, o = t !== void 0;
    if (!r || o && s !== t) {
      const a = n && `"${n}" `, i = o ? ` of length ${t}` : "", l = r ? `length=${s}` : `type=${typeof e}`;
      ne(a + "expected Uint8Array" + i + ", got " + l);
    }
    return e;
  }, jn = (e) => new Uint8Array(e), eo = (e) => Uint8Array.from(e), to = (e, t) => e.toString(16).padStart(t, "0"), yr = (e) => Array.from(Ie(e)).map((t) => to(t, 2)).join(""), Le = {
    _0: 48,
    _9: 57,
    A: 65,
    F: 70,
    a: 97,
    f: 102
  }, Qr = (e) => {
    if (e >= Le._0 && e <= Le._9) return e - Le._0;
    if (e >= Le.A && e <= Le.F) return e - (Le.A - 10);
    if (e >= Le.a && e <= Le.f) return e - (Le.a - 10);
  }, mr = (e) => {
    const t = "hex invalid";
    if (!Vi(e)) return ne(t);
    const n = e.length, r = n / 2;
    if (n % 2) return ne(t);
    const s = jn(r);
    for (let o = 0, a = 0; o < r; o++, a += 2) {
      const i = Qr(e.charCodeAt(a)), l = Qr(e.charCodeAt(a + 1));
      if (i === void 0 || l === void 0) return ne(t);
      s[o] = i * 16 + l;
    }
    return s;
  }, no = () => globalThis == null ? void 0 : globalThis.crypto, Fi = () => {
    var _a2;
    return ((_a2 = no()) == null ? void 0 : _a2.subtle) ?? ne("crypto.subtle must be defined, consider polyfill");
  }, ot = (...e) => {
    const t = jn(e.reduce((r, s) => r + Ie(s).length, 0));
    let n = 0;
    return e.forEach((r) => {
      t.set(r, n), n += r.length;
    }), t;
  }, ro = (e = $e) => no().getRandomValues(jn(e)), dn = BigInt, tt = (e, t, n, r = "bad number: out of range") => Hi(e) && t <= e && e < n ? e : ne(r), Z = (e, t = un) => {
    const n = e % t;
    return n >= 0n ? n : t + n;
  }, es = (1n << 255n) - 1n, A = (e) => {
    e < 0n && ne("negative coordinate");
    let t = (e >> 255n) * 19n + (e & es);
    return t = (t >> 255n) * 19n + (t & es), t % un;
  }, so = (e) => Z(e, zt), oo = (e, t) => {
    (e === 0n || t <= 0n) && ne("no inverse n=" + e + " mod=" + t);
    let n = Z(e, t), r = t, s = 0n, o = 1n;
    for (; n !== 0n; ) {
      const a = r / n, i = r % n, l = s - o * a;
      r = n, n = i, s = o, o = l;
    }
    return r === 1n ? Z(s, t) : ne("no inverse");
  }, ao = (e) => {
    const t = Ar[e];
    return typeof t != "function" && ne("hashes." + e + " not set"), t;
  }, Zi = (e) => ao("sha512")(e), Vn = (e) => e instanceof ue ? e : ne("Point expected"), er = 2n ** 256n;
  const _ue = class _ue {
    constructor(t, n, r, s) {
      __publicField(this, "X");
      __publicField(this, "Y");
      __publicField(this, "Z");
      __publicField(this, "T");
      const o = er;
      this.X = tt(t, 0n, o), this.Y = tt(n, 0n, o), this.Z = tt(r, 1n, o), this.T = tt(s, 0n, o), Object.freeze(this);
    }
    static CURVE() {
      return Qs;
    }
    static fromAffine(t) {
      return new _ue(t.x, t.y, 1n, A(t.x * t.y));
    }
    static fromBytes(t, n = false) {
      const r = Hn, s = eo(Ie(t, $e)), o = t[31];
      s[31] = o & -129;
      const a = pr(s);
      tt(a, 0n, n ? er : un);
      const l = A(a * a), u = Z(l - 1n), h = A(r * l + 1n);
      let { isValid: d, value: y } = Yi(u, h);
      d || ne("bad point: y not sqrt");
      const g = (y & 1n) === 1n, v = (o & 128) !== 0;
      return !n && y === 0n && v && ne("bad point: x==0, isLastByteOdd"), v !== g && (y = Z(-y)), new _ue(y, a, 1n, A(y * a));
    }
    static fromHex(t, n) {
      return _ue.fromBytes(mr(t), n);
    }
    get x() {
      return this.toAffine().x;
    }
    get y() {
      return this.toAffine().y;
    }
    assertValidity() {
      const t = Kn, n = Hn, r = this;
      if (r.is0()) return ne("bad point: ZERO");
      const { X: s, Y: o, Z: a, T: i } = r, l = A(s * s), u = A(o * o), h = A(a * a), d = A(h * h), y = A(l * t), g = A(h * (y + u)), v = Z(d + A(n * A(l * u)));
      if (g !== v) return ne("bad point: equation left != right (1)");
      const p = A(s * o), E = A(a * i);
      return p !== E ? ne("bad point: equation left != right (2)") : this;
    }
    equals(t) {
      const { X: n, Y: r, Z: s } = this, { X: o, Y: a, Z: i } = Vn(t), l = A(n * i), u = A(o * s), h = A(r * i), d = A(a * s);
      return l === u && h === d;
    }
    is0() {
      return this.equals(ht);
    }
    negate() {
      return new _ue(Z(-this.X), this.Y, this.Z, Z(-this.T));
    }
    double() {
      const { X: t, Y: n, Z: r } = this, s = Kn, o = A(t * t), a = A(n * n), i = A(2n * r * r), l = A(s * o), u = Z(t + n), h = Z(A(u * u) - o - a), d = Z(l + a), y = Z(d - i), g = Z(l - a), v = A(h * y), p = A(d * g), E = A(h * g), R = A(y * d);
      return new _ue(v, p, R, E);
    }
    add(t) {
      const { X: n, Y: r, Z: s, T: o } = this, { X: a, Y: i, Z: l, T: u } = Vn(t), h = Kn, d = Hn, y = A(n * a), g = A(r * i), v = A(A(o * d) * u), p = A(s * l), E = Z(A(Z(n + r) * Z(a + i)) - y - g), R = Z(p - v), D = Z(p + v), C = Z(g - A(h * y)), M = A(E * R), G = A(D * C), K = A(E * C), W = A(R * D);
      return new _ue(M, G, W, K);
    }
    subtract(t) {
      return this.add(Vn(t).negate());
    }
    multiply(t, n = true) {
      if (!n && (t === 0n || this.is0())) return ht;
      if (tt(t, 1n, zt), t === 1n) return this;
      if (this.equals(ze)) return oc(t).p;
      let r = ht, s = ze;
      for (let o = this; t > 0n; o = o.double(), t >>= 1n) t & 1n ? r = r.add(o) : n && (s = s.add(o));
      return r;
    }
    multiplyUnsafe(t) {
      return this.multiply(t, false);
    }
    toAffine() {
      const { X: t, Y: n, Z: r } = this;
      if (this.equals(ht)) return {
        x: 0n,
        y: 1n
      };
      const s = oo(r, un);
      A(r * s) !== 1n && ne("invalid inverse");
      const o = A(t * s), a = A(n * s);
      return {
        x: o,
        y: a
      };
    }
    toBytes() {
      const { x: t, y: n } = this.toAffine(), r = io(n);
      return r[31] |= t & 1n ? 128 : 0, r;
    }
    toHex() {
      return yr(this.toBytes());
    }
    clearCofactor() {
      return this.multiply(dn(Oi), false);
    }
    isSmallOrder() {
      return this.clearCofactor().is0();
    }
    isTorsionFree() {
      let t = this.multiply(zt / 2n, false).double();
      return zt % 2n && (t = t.add(this)), t.is0();
    }
  };
  __publicField(_ue, "BASE");
  __publicField(_ue, "ZERO");
  let ue = _ue;
  const ze = new ue(Jr, qr, 1n, Z(Jr * qr)), ht = new ue(0n, 1n, 1n, 0n);
  ue.BASE = ze;
  ue.ZERO = ht;
  let io, pr, Be, zi, ts, Yi, fn, wr, br, co, vr, xr, lo, uo, fo, ho, Xi, Sr, go, Ji, qi, Qi, Ar, Cr, ec, tc, hn, rc, yo, tr, sc;
  io = (e) => mr(to(tt(e, 0n, er), 64)).reverse();
  pr = (e) => dn("0x" + yr(eo(Ie(e)).reverse()));
  Be = (e, t) => {
    let n = e;
    for (; t-- > 0n; ) n = A(n * n);
    return n;
  };
  zi = (e) => {
    const t = A(e * e), n = A(t * e), r = A(Be(n, 2n) * n), s = A(Be(r, 1n) * e), o = A(Be(s, 5n) * s), a = A(Be(o, 10n) * o), i = A(Be(a, 20n) * a), l = A(Be(i, 40n) * i), u = A(Be(l, 80n) * l), h = A(Be(u, 80n) * l), d = A(Be(h, 10n) * o);
    return {
      pow_p_5_8: A(Be(d, 2n) * e),
      b2: n
    };
  };
  ts = 0x2b8324804fc1df0b2b4d00993dfbd7a72f431806ad2fe478c4ee1b274a0ea0b0n;
  Yi = (e, t) => {
    const n = A(t * A(t * t)), r = A(A(n * n) * t), s = zi(A(e * r)).pow_p_5_8;
    let o = A(e * A(n * s));
    const a = A(t * A(o * o)), i = o, l = A(o * ts), u = a === e, h = a === Z(-e), d = a === Z(-e * ts);
    return u && (o = i), (h || d) && (o = l), (Z(o) & 1n) === 1n && (o = Z(-o)), {
      isValid: u || h,
      value: o
    };
  };
  fn = (e) => so(pr(e));
  wr = (...e) => Ar.sha512Async(ot(...e));
  br = (...e) => ao("sha512")(ot(...e));
  co = (e) => {
    const t = e.slice(0, 32);
    t[0] &= 248, t[31] &= 127, t[31] |= 64;
    const n = e.slice(32, 64), r = fn(t), s = ze.multiply(r), o = s.toBytes();
    return {
      head: t,
      prefix: n,
      scalar: r,
      point: s,
      pointBytes: o
    };
  };
  vr = (e) => wr(Ie(e, $e)).then(co);
  xr = (e) => co(br(Ie(e, $e)));
  Ir = (e) => vr(e).then((t) => t.pointBytes);
  lo = (e) => xr(e).pointBytes;
  uo = (e) => wr(e.hashable).then(e.finish);
  fo = (e) => e.finish(br(e.hashable));
  ho = (e, t, n) => {
    const { pointBytes: r, scalar: s } = e, o = fn(t), a = ze.multiply(o).toBytes();
    return {
      hashable: ot(a, r, n),
      finish: (u) => {
        const h = so(o + fn(u) * s);
        return Ie(ot(a, io(h)), 64);
      }
    };
  };
  kr = async (e, t) => {
    const n = Ie(e), r = await vr(t), s = await wr(r.prefix, n);
    return uo(ho(r, s, n));
  };
  Xi = (e, t) => {
    const n = Ie(e), r = xr(t), s = br(r.prefix, n);
    return fo(ho(r, s, n));
  };
  Sr = {
    zip215: true
  };
  go = (e, t, n, r = Sr) => {
    e = Ie(e, 64), t = Ie(t), n = Ie(n, $e);
    const { zip215: s } = r, o = e.subarray(0, $e), a = pr(e.subarray($e, $e * 2));
    let i, l, u, h = Uint8Array.of(), d = false;
    try {
      i = ue.fromBytes(n, s), l = ue.fromBytes(o, s), u = ze.multiply(a, false), h = ot(l.toBytes(), i.toBytes(), t), d = true;
    } catch {
    }
    return {
      hashable: h,
      finish: (g) => {
        if (!d || !s && i.isSmallOrder()) return false;
        const v = fn(g);
        return l.add(i.multiply(v, false)).subtract(u).clearCofactor().is0();
      }
    };
  };
  Ji = async (e, t, n, r = Sr) => uo(go(e, t, n, r));
  qi = (e, t, n, r = Sr) => fo(go(e, t, n, r));
  Qi = {
    bytesToHex: yr,
    hexToBytes: mr,
    concatBytes: ot,
    mod: Z,
    invert: oo,
    randomBytes: ro
  };
  Ar = {
    sha512Async: async (e) => {
      const t = Fi(), n = ot(e);
      return jn(await t.digest("SHA-512", n.buffer));
    },
    sha512: void 0
  };
  Cr = (e = ro($e)) => e;
  ec = (e) => {
    const t = Cr(e), n = lo(t);
    return {
      secretKey: t,
      publicKey: n
    };
  };
  tc = async (e) => {
    const t = Cr(e), n = await Ir(t);
    return {
      secretKey: t,
      publicKey: n
    };
  };
  nc = {
    getExtendedPublicKeyAsync: vr,
    getExtendedPublicKey: xr,
    randomSecretKey: Cr
  };
  hn = 8;
  rc = 256;
  yo = Math.ceil(rc / hn) + 1;
  tr = 2 ** (hn - 1);
  sc = () => {
    const e = [];
    let t = ze, n = t;
    for (let r = 0; r < yo; r++) {
      n = t, e.push(n);
      for (let s = 1; s < tr; s++) n = n.add(t), e.push(n);
      t = n.double();
    }
    return e;
  };
  let ns;
  const rs = (e, t) => {
    const n = t.negate();
    return e ? n : t;
  }, oc = (e) => {
    const t = ns || (ns = sc());
    let n = ht, r = ze;
    const s = 2 ** hn, o = s, a = dn(s - 1), i = dn(hn);
    for (let l = 0; l < yo; l++) {
      let u = Number(e & a);
      e >>= i, u > tr && (u -= o, e += 1n);
      const h = l * tr, d = h, y = h + Math.abs(u) - 1, g = l % 2 !== 0, v = u < 0;
      u === 0 ? r = r.add(rs(g, t[d])) : n = n.add(rs(v, t[y]));
    }
    return e !== 0n && ne("invalid wnaf"), {
      p: n,
      f: r
    };
  }, ac = Object.freeze(Object.defineProperty({
    __proto__: null,
    Point: ue,
    etc: Qi,
    getPublicKey: lo,
    getPublicKeyAsync: Ir,
    hash: Zi,
    hashes: Ar,
    keygen: ec,
    keygenAsync: tc,
    sign: Xi,
    signAsync: kr,
    utils: nc,
    verify: qi,
    verifyAsync: Ji
  }, Symbol.toStringTag, {
    value: "Module"
  })), ic = [
    "Object",
    "RegExp",
    "Date",
    "Error",
    "Map",
    "Set",
    "WeakMap",
    "WeakSet",
    "ArrayBuffer",
    "SharedArrayBuffer",
    "DataView",
    "Promise",
    "URL",
    "HTMLElement",
    "Int8Array",
    "Uint8ClampedArray",
    "Int16Array",
    "Uint16Array",
    "Int32Array",
    "Uint32Array",
    "Float32Array",
    "Float64Array",
    "BigInt64Array",
    "BigUint64Array"
  ];
  function mo(e) {
    if (e === null) return "null";
    if (e === void 0) return "undefined";
    if (e === true || e === false) return "boolean";
    const t = typeof e;
    if (t === "string" || t === "number" || t === "bigint" || t === "symbol") return t;
    if (t === "function") return "Function";
    if (Array.isArray(e)) return "Array";
    if (e instanceof Uint8Array) return "Uint8Array";
    if (e.constructor === Object) return "Object";
    const n = cc(e);
    return n || "Object";
  }
  function cc(e) {
    const t = Object.prototype.toString.call(e).slice(8, -1);
    if (ic.includes(t)) return t;
  }
  class b {
    constructor(t, n, r) {
      this.major = t, this.majorEncoded = t << 5, this.name = n, this.terminal = r;
    }
    toString() {
      return `Type[${this.major}].${this.name}`;
    }
    compare(t) {
      return this.major < t.major ? -1 : this.major > t.major ? 1 : 0;
    }
    static equals(t, n) {
      return t === n || t.major === n.major && t.name === n.name;
    }
  }
  b.uint = new b(0, "uint", true);
  b.negint = new b(1, "negint", true);
  b.bytes = new b(2, "bytes", true);
  b.string = new b(3, "string", true);
  b.array = new b(4, "array", false);
  b.map = new b(5, "map", false);
  b.tag = new b(6, "tag", false);
  b.float = new b(7, "float", true);
  b.false = new b(7, "false", true);
  b.true = new b(7, "true", true);
  b.null = new b(7, "null", true);
  b.undefined = new b(7, "undefined", true);
  b.break = new b(7, "break", true);
  class Y {
    constructor(t, n, r) {
      this.type = t, this.value = n, this.encodedLength = r, this.encodedBytes = void 0, this.byteValue = void 0;
    }
    toString() {
      return `Token[${this.type}].${this.value}`;
    }
  }
  const Mt = globalThis.process && !globalThis.process.browser && globalThis.Buffer && typeof globalThis.Buffer.isBuffer == "function", lc = new TextEncoder();
  function gn(e) {
    return Mt && globalThis.Buffer.isBuffer(e);
  }
  function po(e) {
    return e instanceof Uint8Array ? gn(e) ? new Uint8Array(e.buffer, e.byteOffset, e.byteLength) : e : Uint8Array.from(e);
  }
  const uc = 24, dc = 200, wo = Mt ? (e) => e.length >= uc ? globalThis.Buffer.from(e) : ss(e) : (e) => e.length >= dc ? lc.encode(e) : ss(e), De = (e) => Uint8Array.from(e), fc = Mt ? (e, t, n) => gn(e) ? new Uint8Array(e.subarray(t, n)) : e.slice(t, n) : (e, t, n) => e.slice(t, n), hc = Mt ? (e, t) => (e = e.map((n) => n instanceof Uint8Array ? n : globalThis.Buffer.from(n)), po(globalThis.Buffer.concat(e, t))) : (e, t) => {
    const n = new Uint8Array(t);
    let r = 0;
    for (let s of e) r + s.length > n.length && (s = s.subarray(0, n.length - r)), n.set(s, r), r += s.length;
    return n;
  }, gc = Mt ? (e) => globalThis.Buffer.allocUnsafe(e) : (e) => new Uint8Array(e);
  function yc(e, t) {
    if (gn(e) && gn(t)) return e.compare(t);
    for (let n = 0; n < e.length; n++) if (e[n] !== t[n]) return e[n] < t[n] ? -1 : 1;
    return 0;
  }
  function ss(e) {
    const t = [];
    let n = 0;
    for (let r = 0; r < e.length; r++) {
      let s = e.charCodeAt(r);
      s < 128 ? t[n++] = s : s < 2048 ? (t[n++] = s >> 6 | 192, t[n++] = s & 63 | 128) : (s & 64512) === 55296 && r + 1 < e.length && (e.charCodeAt(r + 1) & 64512) === 56320 ? (s = 65536 + ((s & 1023) << 10) + (e.charCodeAt(++r) & 1023), t[n++] = s >> 18 | 240, t[n++] = s >> 12 & 63 | 128, t[n++] = s >> 6 & 63 | 128, t[n++] = s & 63 | 128) : (s >= 55296 && s <= 57343 && (s = 65533), t[n++] = s >> 12 | 224, t[n++] = s >> 6 & 63 | 128, t[n++] = s & 63 | 128);
    }
    return t;
  }
  const mc = 256;
  class bo {
    constructor(t = mc) {
      this.chunkSize = t, this.cursor = 0, this.maxCursor = -1, this.chunks = [], this._initReuseChunk = null;
    }
    reset() {
      this.cursor = 0, this.maxCursor = -1, this.chunks.length && (this.chunks = []), this._initReuseChunk !== null && (this.chunks.push(this._initReuseChunk), this.maxCursor = this._initReuseChunk.length - 1);
    }
    push(t) {
      let n = this.chunks[this.chunks.length - 1];
      if (this.cursor + t.length <= this.maxCursor + 1) {
        const s = n.length - (this.maxCursor - this.cursor) - 1;
        n.set(t, s);
      } else {
        if (n) {
          const s = n.length - (this.maxCursor - this.cursor) - 1;
          s < n.length && (this.chunks[this.chunks.length - 1] = n.subarray(0, s), this.maxCursor = this.cursor - 1);
        }
        t.length < 64 && t.length < this.chunkSize ? (n = gc(this.chunkSize), this.chunks.push(n), this.maxCursor += n.length, this._initReuseChunk === null && (this._initReuseChunk = n), n.set(t, 0)) : (this.chunks.push(t), this.maxCursor += t.length);
      }
      this.cursor += t.length;
    }
    toBytes(t = false) {
      let n;
      if (this.chunks.length === 1) {
        const r = this.chunks[0];
        t && this.cursor > r.length / 2 ? (n = this.cursor === r.length ? r : r.subarray(0, this.cursor), this._initReuseChunk = null, this.chunks = []) : n = fc(r, 0, this.cursor);
      } else n = hc(this.chunks, this.cursor);
      return t && this.reset(), n;
    }
  }
  class pc {
    constructor(t) {
      this.dest = t, this.cursor = 0, this.chunks = [
        t
      ];
    }
    reset() {
      this.cursor = 0;
    }
    push(t) {
      if (this.cursor + t.length > this.dest.length) throw new Error("write out of bounds, destination buffer is too small");
      this.dest.set(t, this.cursor), this.cursor += t.length;
    }
    toBytes(t = false) {
      const n = this.dest.subarray(0, this.cursor);
      return t && this.reset(), n;
    }
  }
  const _n = "CBOR decode error:", Er = "CBOR encode error:", me = [
    24,
    256,
    65536,
    4294967296,
    BigInt("18446744073709551616")
  ];
  function it(e, t) {
    return te(e, 0, t.value);
  }
  function te(e, t, n) {
    if (n < me[0]) {
      const r = Number(n);
      e.push([
        t | r
      ]);
    } else if (n < me[1]) {
      const r = Number(n);
      e.push([
        t | 24,
        r
      ]);
    } else if (n < me[2]) {
      const r = Number(n);
      e.push([
        t | 25,
        r >>> 8,
        r & 255
      ]);
    } else if (n < me[3]) {
      const r = Number(n);
      e.push([
        t | 26,
        r >>> 24 & 255,
        r >>> 16 & 255,
        r >>> 8 & 255,
        r & 255
      ]);
    } else {
      const r = BigInt(n);
      if (r < me[4]) {
        const s = [
          t | 27,
          0,
          0,
          0,
          0,
          0,
          0,
          0
        ];
        let o = Number(r & BigInt(4294967295)), a = Number(r >> BigInt(32) & BigInt(4294967295));
        s[8] = o & 255, o = o >> 8, s[7] = o & 255, o = o >> 8, s[6] = o & 255, o = o >> 8, s[5] = o & 255, s[4] = a & 255, a = a >> 8, s[3] = a & 255, a = a >> 8, s[2] = a & 255, a = a >> 8, s[1] = a & 255, e.push(s);
      } else throw new Error(`${_n} encountered BigInt larger than allowable range`);
    }
  }
  it.encodedSize = function(t) {
    return te.encodedSize(t.value);
  };
  te.encodedSize = function(t) {
    return t < me[0] ? 1 : t < me[1] ? 2 : t < me[2] ? 3 : t < me[3] ? 5 : 9;
  };
  it.compareTokens = function(t, n) {
    return t.value < n.value ? -1 : t.value > n.value ? 1 : 0;
  };
  const vo = BigInt(-1), xo = BigInt(1);
  function jr(e, t) {
    const n = t.value, r = typeof n == "bigint" ? n * vo - xo : n * -1 - 1;
    te(e, t.type.majorEncoded, r);
  }
  jr.encodedSize = function(t) {
    const n = t.value, r = typeof n == "bigint" ? n * vo - xo : n * -1 - 1;
    return r < me[0] ? 1 : r < me[1] ? 2 : r < me[2] ? 3 : r < me[3] ? 5 : 9;
  };
  jr.compareTokens = function(t, n) {
    return t.value < n.value ? 1 : t.value > n.value ? -1 : 0;
  };
  function yn(e) {
    return e.encodedBytes === void 0 && (e.encodedBytes = b.equals(e.type, b.string) ? wo(e.value) : e.value), e.encodedBytes;
  }
  function Tn(e, t) {
    const n = yn(t);
    te(e, t.type.majorEncoded, n.length), e.push(n);
  }
  Tn.encodedSize = function(t) {
    const n = yn(t);
    return te.encodedSize(n.length) + n.length;
  };
  Tn.compareTokens = function(t, n) {
    return wc(yn(t), yn(n));
  };
  function wc(e, t) {
    return e.length < t.length ? -1 : e.length > t.length ? 1 : yc(e, t);
  }
  new TextDecoder();
  const bc = Tn;
  function _r(e, t) {
    te(e, b.array.majorEncoded, t.value);
  }
  _r.compareTokens = it.compareTokens;
  _r.encodedSize = function(t) {
    return te.encodedSize(t.value);
  };
  function Tr(e, t) {
    te(e, b.map.majorEncoded, t.value);
  }
  Tr.compareTokens = it.compareTokens;
  Tr.encodedSize = function(t) {
    return te.encodedSize(t.value);
  };
  function Br(e, t) {
    te(e, b.tag.majorEncoded, t.value);
  }
  Br.compareTokens = it.compareTokens;
  Br.encodedSize = function(t) {
    return te.encodedSize(t.value);
  };
  const Io = 20, ko = 21, So = 22, Ao = 23;
  function Bn(e, t, n) {
    const r = t.value;
    if (r === false) e.push([
      b.float.majorEncoded | Io
    ]);
    else if (r === true) e.push([
      b.float.majorEncoded | ko
    ]);
    else if (r === null) e.push([
      b.float.majorEncoded | So
    ]);
    else if (r === void 0) e.push([
      b.float.majorEncoded | Ao
    ]);
    else {
      let s, o = false;
      (!n || n.float64 !== true) && (Eo(r), s = jo(Ee, 1), r === s || Number.isNaN(r) ? (Ee[0] = 249, e.push(Ee.slice(0, 3)), o = true) : (_o(r), s = To(Ee, 1), r === s && (Ee[0] = 250, e.push(Ee.slice(0, 5)), o = true))), o || (vc(r), s = xc(Ee, 1), Ee[0] = 251, e.push(Ee.slice(0, 9)));
    }
  }
  Bn.encodedSize = function(t, n) {
    const r = t.value;
    if (r === false || r === true || r === null || r === void 0) return 1;
    if (!n || n.float64 !== true) {
      Eo(r);
      let s = jo(Ee, 1);
      if (r === s || Number.isNaN(r)) return 3;
      if (_o(r), s = To(Ee, 1), r === s) return 5;
    }
    return 9;
  };
  const Co = new ArrayBuffer(9), xe = new DataView(Co, 1), Ee = new Uint8Array(Co, 0);
  function Eo(e) {
    if (e === 1 / 0) xe.setUint16(0, 31744, false);
    else if (e === -1 / 0) xe.setUint16(0, 64512, false);
    else if (Number.isNaN(e)) xe.setUint16(0, 32256, false);
    else {
      xe.setFloat32(0, e);
      const t = xe.getUint32(0), n = (t & 2139095040) >> 23, r = t & 8388607;
      if (n === 255) xe.setUint16(0, 31744, false);
      else if (n === 0) xe.setUint16(0, (e & 2147483648) >> 16 | r >> 13, false);
      else {
        const s = n - 127;
        s < -24 ? xe.setUint16(0, 0) : s < -14 ? xe.setUint16(0, (t & 2147483648) >> 16 | 1 << 24 + s, false) : xe.setUint16(0, (t & 2147483648) >> 16 | s + 15 << 10 | r >> 13, false);
      }
    }
  }
  function jo(e, t) {
    if (e.length - t < 2) throw new Error(`${_n} not enough data for float16`);
    const n = (e[t] << 8) + e[t + 1];
    if (n === 31744) return 1 / 0;
    if (n === 64512) return -1 / 0;
    if (n === 32256) return NaN;
    const r = n >> 10 & 31, s = n & 1023;
    let o;
    return r === 0 ? o = s * 2 ** -24 : r !== 31 ? o = (s + 1024) * 2 ** (r - 25) : o = s === 0 ? 1 / 0 : NaN, n & 32768 ? -o : o;
  }
  function _o(e) {
    xe.setFloat32(0, e, false);
  }
  function To(e, t) {
    if (e.length - t < 4) throw new Error(`${_n} not enough data for float32`);
    const n = (e.byteOffset || 0) + t;
    return new DataView(e.buffer, n, 4).getFloat32(0, false);
  }
  function vc(e) {
    xe.setFloat64(0, e, false);
  }
  function xc(e, t) {
    if (e.length - t < 8) throw new Error(`${_n} not enough data for float64`);
    const n = (e.byteOffset || 0) + t;
    return new DataView(e.buffer, n, 8).getFloat64(0, false);
  }
  Bn.compareTokens = it.compareTokens;
  function Ic(e) {
    switch (e.type) {
      case b.false:
        return De([
          244
        ]);
      case b.true:
        return De([
          245
        ]);
      case b.null:
        return De([
          246
        ]);
      case b.bytes:
        return e.value.length ? void 0 : De([
          64
        ]);
      case b.string:
        return e.value === "" ? De([
          96
        ]) : void 0;
      case b.array:
        return e.value === 0 ? De([
          128
        ]) : void 0;
      case b.map:
        return e.value === 0 ? De([
          160
        ]) : void 0;
      case b.uint:
        return e.value < 24 ? De([
          Number(e.value)
        ]) : void 0;
      case b.negint:
        if (e.value >= -24) return De([
          31 - Number(e.value)
        ]);
    }
  }
  const kc = {
    float64: false,
    mapSorter: Cc,
    quickEncodeToken: Ic
  };
  function Sc() {
    const e = [];
    return e[b.uint.major] = it, e[b.negint.major] = jr, e[b.bytes.major] = Tn, e[b.string.major] = bc, e[b.array.major] = _r, e[b.map.major] = Tr, e[b.tag.major] = Br, e[b.float.major] = Bn, e;
  }
  const Ct = Sc(), Yt = new bo();
  class Tt {
    constructor(t, n) {
      this.obj = t, this.parent = n;
    }
    includes(t) {
      let n = this;
      do
        if (n.obj === t) return true;
      while (n = n.parent);
      return false;
    }
    static createCheck(t, n) {
      if (t && t.includes(n)) throw new Error(`${Er} object contains circular references`);
      return new Tt(n, t);
    }
  }
  const We = {
    null: new Y(b.null, null),
    undefined: new Y(b.undefined, void 0),
    true: new Y(b.true, true),
    false: new Y(b.false, false),
    emptyArray: new Y(b.array, 0),
    emptyMap: new Y(b.map, 0)
  }, Re = {
    number(e, t, n, r) {
      return !Number.isInteger(e) || !Number.isSafeInteger(e) ? new Y(b.float, e) : e >= 0 ? new Y(b.uint, e) : new Y(b.negint, e);
    },
    bigint(e, t, n, r) {
      return e >= BigInt(0) ? new Y(b.uint, e) : new Y(b.negint, e);
    },
    Uint8Array(e, t, n, r) {
      return new Y(b.bytes, e);
    },
    string(e, t, n, r) {
      return new Y(b.string, e);
    },
    boolean(e, t, n, r) {
      return e ? We.true : We.false;
    },
    null(e, t, n, r) {
      return We.null;
    },
    undefined(e, t, n, r) {
      return We.undefined;
    },
    ArrayBuffer(e, t, n, r) {
      return new Y(b.bytes, new Uint8Array(e));
    },
    DataView(e, t, n, r) {
      return new Y(b.bytes, new Uint8Array(e.buffer, e.byteOffset, e.byteLength));
    },
    Array(e, t, n, r) {
      if (!e.length) return n.addBreakTokens === true ? [
        We.emptyArray,
        new Y(b.break)
      ] : We.emptyArray;
      r = Tt.createCheck(r, e);
      const s = [];
      let o = 0;
      for (const a of e) s[o++] = Xt(a, n, r);
      return n.addBreakTokens ? [
        new Y(b.array, e.length),
        s,
        new Y(b.break)
      ] : [
        new Y(b.array, e.length),
        s
      ];
    },
    Object(e, t, n, r) {
      const s = t !== "Object", o = s ? e.keys() : Object.keys(e), a = s ? e.size : o.length;
      let i;
      if (a) {
        i = new Array(a), r = Tt.createCheck(r, e);
        const l = !s && n.ignoreUndefinedProperties;
        let u = 0;
        for (const h of o) {
          const d = s ? e.get(h) : e[h];
          l && d === void 0 || (i[u++] = [
            Xt(h, n, r),
            Xt(d, n, r)
          ]);
        }
        u < a && (i.length = u);
      }
      return (i == null ? void 0 : i.length) ? (Ac(i, n), n.addBreakTokens ? [
        new Y(b.map, i.length),
        i,
        new Y(b.break)
      ] : [
        new Y(b.map, i.length),
        i
      ]) : n.addBreakTokens === true ? [
        We.emptyMap,
        new Y(b.break)
      ] : We.emptyMap;
    }
  };
  Re.Map = Re.Object;
  Re.Buffer = Re.Uint8Array;
  for (const e of "Uint8Clamped Uint16 Uint32 Int8 Int16 Int32 BigUint64 BigInt64 Float32 Float64".split(" ")) Re[`${e}Array`] = Re.DataView;
  function Xt(e, t = {}, n) {
    const r = mo(e), s = t && t.typeEncoders && t.typeEncoders[r] || Re[r];
    if (typeof s == "function") {
      const a = s(e, r, t, n);
      if (a != null) return a;
    }
    const o = Re[r];
    if (!o) throw new Error(`${Er} unsupported type: ${r}`);
    return o(e, r, t, n);
  }
  function Ac(e, t) {
    t.mapSorter && e.sort(t.mapSorter);
  }
  function Cc(e, t) {
    const n = Array.isArray(e[0]) ? e[0][0] : e[0], r = Array.isArray(t[0]) ? t[0][0] : t[0];
    if (n.type !== r.type) return n.type.compare(r.type);
    const s = n.type.major, o = Ct[s].compareTokens(n, r);
    return o === 0 && console.warn("WARNING: complex key types used, CBOR key sorting guarantees are gone"), o;
  }
  function Et(e, t, n, r) {
    if (Array.isArray(t)) for (const s of t) Et(e, s, n, r);
    else n[t.type.major](e, t, r);
  }
  const os = b.uint.majorEncoded, as = b.negint.majorEncoded, Ec = b.bytes.majorEncoded, jc = b.string.majorEncoded, is = b.array.majorEncoded, _c = b.float.majorEncoded | Io, Tc = b.float.majorEncoded | ko, Bc = b.float.majorEncoded | So, Nc = b.float.majorEncoded | Ao, Rc = BigInt(-1), Mc = BigInt(1);
  function Uc(e) {
    return e.addBreakTokens !== true;
  }
  function Bo(e, t, n, r) {
    const s = mo(t), o = n.typeEncoders && n.typeEncoders[s];
    if (o) {
      const a = o(t, s, n, r);
      if (a != null) {
        Et(e, a, Ct, n);
        return;
      }
    }
    switch (s) {
      case "null":
        e.push([
          Bc
        ]);
        return;
      case "undefined":
        e.push([
          Nc
        ]);
        return;
      case "boolean":
        e.push([
          t ? Tc : _c
        ]);
        return;
      case "number":
        !Number.isInteger(t) || !Number.isSafeInteger(t) ? Bn(e, new Y(b.float, t), n) : t >= 0 ? te(e, os, t) : te(e, as, t * -1 - 1);
        return;
      case "bigint":
        t >= BigInt(0) ? te(e, os, t) : te(e, as, t * Rc - Mc);
        return;
      case "string": {
        const a = wo(t);
        te(e, jc, a.length), e.push(a);
        return;
      }
      case "Uint8Array":
        te(e, Ec, t.length), e.push(t);
        return;
      case "Array":
        if (!t.length) {
          e.push([
            is
          ]);
          return;
        }
        r = Tt.createCheck(r, t), te(e, is, t.length);
        for (const a of t) Bo(e, a, n, r);
        return;
      case "Object":
      case "Map":
        {
          const a = Re.Object(t, s, n, r);
          Et(e, a, Ct, n);
        }
        return;
      default: {
        const a = Re[s];
        if (!a) throw new Error(`${Er} unsupported type: ${s}`);
        const i = a(t, s, n, r);
        Et(e, i, Ct, n);
      }
    }
  }
  function Lc(e, t, n, r) {
    const s = r instanceof Uint8Array;
    let o = s ? new pc(r) : Yt;
    const a = Xt(e, n);
    if (!Array.isArray(a) && n.quickEncodeToken) {
      const i = n.quickEncodeToken(a);
      if (i) return s ? (o.push(i), o.toBytes()) : i;
      const l = t[a.type.major];
      if (l.encodedSize) {
        const u = l.encodedSize(a, n);
        if (s || (o = new bo(u)), l(o, a, n), o.chunks.length !== 1) throw new Error(`Unexpected error: pre-calculated length for ${a} was wrong`);
        return s ? o.toBytes() : po(o.chunks[0]);
      }
    }
    return o.reset(), Et(o, a, t, n), o.toBytes(true);
  }
  function Dc(e, t) {
    return t = Object.assign({}, kc, t), Uc(t) ? (Yt.reset(), Bo(Yt, e, t, void 0), Yt.toBytes(true)) : Lc(e, Ct, t);
  }
  const Gc = 128;
  Zf = function() {
    return Mi(gr, Gc);
  };
  async function cs(e) {
    const n = Pi(e).slice(0, 32), r = await Ir(n);
    return {
      privateKey: n,
      publicKey: r
    };
  }
  zf = function(e) {
    return Gi(e, gr);
  };
  async function nr(e, t) {
    return kr(e, t);
  }
  Yf = function() {
    return gr;
  };
  async function $c(e, t, n, r, s) {
    const a = Dc(/* @__PURE__ */ new Map([
      [
        1,
        t
      ],
      [
        2,
        n
      ],
      [
        3,
        null
      ],
      [
        4,
        s
      ]
    ])), i = await kr(a, e);
    return {
      cborBytes: a,
      signature: i
    };
  }
  const No = 2e5, mn = "hush_vault_salt", rt = 12, fe = "vault", Ro = "ik_priv_encrypted", Mo = "pbkdf2_salt", Uo = "vault_marker";
  function Lo() {
    const e = localStorage.getItem(mn);
    if (e) return Nr(e);
    const t = crypto.getRandomValues(new Uint8Array(16));
    return localStorage.setItem(mn, pt(t)), t;
  }
  function Nr(e) {
    const t = new Uint8Array(e.length / 2);
    for (let n = 0; n < e.length; n += 2) t[n / 2] = parseInt(e.slice(n, n + 2), 16);
    return t;
  }
  pt = function(e) {
    return Array.from(e).map((t) => t.toString(16).padStart(2, "0")).join("");
  };
  async function Pc(e) {
    const t = Lo(), n = new TextEncoder().encode(e), r = await crypto.subtle.importKey("raw", n, "PBKDF2", false, [
      "deriveKey"
    ]);
    return crypto.subtle.deriveKey({
      name: "PBKDF2",
      salt: t,
      iterations: No,
      hash: "SHA-256"
    }, r, {
      name: "AES-GCM",
      length: 256
    }, false, [
      "encrypt",
      "decrypt"
    ]);
  }
  async function Oc(e, t) {
    const n = await Pc(t), r = crypto.getRandomValues(new Uint8Array(rt)), s = await crypto.subtle.encrypt({
      name: "AES-GCM",
      iv: r
    }, n, e), o = new Uint8Array(rt + s.byteLength);
    return o.set(r, 0), o.set(new Uint8Array(s), rt), o;
  }
  async function Kc(e, t) {
    const n = Lo(), r = new TextEncoder().encode(t), s = await crypto.subtle.importKey("raw", r, "PBKDF2", false, [
      "deriveKey"
    ]), o = await crypto.subtle.deriveKey({
      name: "PBKDF2",
      salt: n,
      iterations: No,
      hash: "SHA-256"
    }, s, {
      name: "AES-GCM",
      length: 256
    }, true, [
      "encrypt",
      "decrypt"
    ]), a = e.slice(0, rt), i = e.slice(rt), l = await crypto.subtle.decrypt({
      name: "AES-GCM",
      iv: a
    }, o, i), u = await crypto.subtle.exportKey("raw", o), h = pt(new Uint8Array(u));
    return {
      privateKey: new Uint8Array(l),
      rawKeyHex: h
    };
  }
  async function Hc(e, t) {
    const n = Nr(t), r = await crypto.subtle.importKey("raw", n, {
      name: "AES-GCM",
      length: 256
    }, false, [
      "decrypt"
    ]), s = e.slice(0, rt), o = e.slice(rt), a = await crypto.subtle.decrypt({
      name: "AES-GCM",
      iv: s
    }, r, o);
    return new Uint8Array(a);
  }
  function St(e) {
    return new Promise((t, n) => {
      const r = indexedDB.open(`hush-vault-${e}`, 1);
      r.onupgradeneeded = (s) => {
        const o = s.target.result;
        o.objectStoreNames.contains(fe) || o.createObjectStore(fe);
      }, r.onsuccess = (s) => t(s.target.result), r.onerror = (s) => n(s.target.error);
    });
  }
  function Vc(e, t) {
    return new Promise((n, r) => {
      const a = e.transaction(fe, "readwrite").objectStore(fe).put(t, Ro);
      a.onsuccess = () => n(), a.onerror = (i) => r(i.target.error);
    });
  }
  function Wc(e, t) {
    return new Promise((n, r) => {
      const a = e.transaction(fe, "readwrite").objectStore(fe).put(t, Mo);
      a.onsuccess = () => n(), a.onerror = (i) => r(i.target.error);
    });
  }
  function Fc(e) {
    return new Promise((t, n) => {
      const o = e.transaction(fe, "readonly").objectStore(fe).get(Mo);
      o.onsuccess = (a) => {
        const i = a.target.result ?? null;
        i === null ? t(null) : i instanceof Uint8Array ? t(i) : t(new Uint8Array(i));
      }, o.onerror = (a) => n(a.target.error);
    });
  }
  function Zc(e, t) {
    return new Promise((n, r) => {
      const a = e.transaction(fe, "readwrite").objectStore(fe).put(t, Uo);
      a.onsuccess = () => n(), a.onerror = (i) => r(i.target.error);
    });
  }
  function Do(e) {
    return new Promise((t, n) => {
      const o = e.transaction(fe, "readonly").objectStore(fe).get(Uo);
      o.onsuccess = (a) => t(a.target.result ?? null), o.onerror = (a) => n(a.target.error);
    });
  }
  async function ls(e) {
    try {
      const t = await St(e);
      if (!await Jt(t)) return t.close(), {
        exists: false,
        publicKeyHex: null
      };
      const r = await Do(t);
      if (!localStorage.getItem(mn)) {
        const s = await Fc(t);
        s && localStorage.setItem(mn, pt(s));
      }
      return t.close(), {
        exists: true,
        publicKeyHex: typeof r == "string" ? r : null
      };
    } catch {
      return {
        exists: false,
        publicKeyHex: null
      };
    }
  }
  function Jt(e) {
    return new Promise((t, n) => {
      const o = e.transaction(fe, "readonly").objectStore(fe).get(Ro);
      o.onsuccess = (a) => {
        const i = a.target.result ?? null;
        i === null ? t(null) : i instanceof Uint8Array ? t(i) : t(new Uint8Array(i));
      }, o.onerror = (a) => n(a.target.error);
    });
  }
  function us(e) {
    return new Promise((t, n) => {
      const r = indexedDB.deleteDatabase(`hush-vault-${e}`);
      r.onsuccess = () => t(), r.onerror = (s) => n(s.target.error), r.onblocked = () => t();
    });
  }
  function Go(e) {
    const t = localStorage.getItem(`hush_vault_config_${e}`);
    if (!t) return null;
    try {
      return JSON.parse(t);
    } catch {
      return null;
    }
  }
  function ds(e, t) {
    localStorage.setItem(`hush_vault_config_${e}`, JSON.stringify(t));
  }
  const zc = "hush-mls-", Yc = "hush-mls-history-", Bt = "credential", wt = "keyPackages", pn = "lastResort", Xc = 4, $o = "credential", Po = "lastResort", Nn = [
    "mls_confirmation_tag",
    "mls_encryption_key_pairs",
    "mls_encryption_keys",
    "mls_epoch_key_pairs",
    "mls_epoch_secrets",
    "mls_group_context",
    "mls_group_state",
    "mls_groups",
    "mls_interim_transcript_hash",
    "mls_join_config",
    "mls_key_packages",
    "mls_message_secrets",
    "mls_own_leaf_index",
    "mls_own_leaf_nodes",
    "mls_proposal_queue_refs",
    "mls_proposals",
    "mls_psk",
    "mls_queued_proposals",
    "mls_resumption_psk",
    "mls_signature_key_pairs",
    "mls_tree_sync"
  ], Oo = [
    Bt,
    ...Nn,
    "localPlaintext",
    "groupEpoch"
  ], ye = /* @__PURE__ */ new Map();
  function Fe(e) {
    return Array.from(e).map((t) => t.toString(16).padStart(2, "0")).join("");
  }
  function Jc(e) {
    window.mlsStorageBridge = {
      writeBytes(t, n, r) {
        const s = Fe(n), o = `${t}:${s}`;
        ye.set(o, new Uint8Array(r));
        try {
          e.transaction(t, "readwrite").objectStore(t).put({
            key: s,
            value: Array.from(r)
          });
        } catch (a) {
          console.warn("[mlsStore] writeBytes IDB write failed for", t, s, a);
        }
      },
      readBytes(t, n) {
        const r = Fe(n), s = `${t}:${r}`;
        return ye.get(s) ?? null;
      },
      deleteBytes(t, n) {
        const r = Fe(n), s = `${t}:${r}`;
        ye.delete(s);
        try {
          e.transaction(t, "readwrite").objectStore(t).delete(r);
        } catch (o) {
          console.warn("[mlsStore] deleteBytes IDB delete failed for", t, r, o);
        }
      },
      readList(t, n) {
        const r = Fe(n), s = `${t}:list:${r}`, o = ye.get(s);
        if (!o) return [];
        try {
          return JSON.parse(new TextDecoder().decode(o)).map((i) => new Uint8Array(i));
        } catch {
          return [];
        }
      },
      appendToList(t, n, r) {
        const s = Fe(n), o = `${t}:list:${s}`, a = window.mlsStorageBridge.readList(t, n);
        a.push(new Uint8Array(r));
        const i = new TextEncoder().encode(JSON.stringify(a.map((l) => Array.from(l))));
        ye.set(o, i);
        try {
          e.transaction(t, "readwrite").objectStore(t).put({
            key: `list:${s}`,
            value: Array.from(i)
          });
        } catch (l) {
          console.warn("[mlsStore] appendToList IDB write failed for", t, s, l);
        }
      },
      removeFromList(t, n, r) {
        const s = Fe(n), o = `${t}:list:${s}`, a = window.mlsStorageBridge.readList(t, n), i = Fe(r), l = a.filter((h) => Fe(h) !== i), u = new TextEncoder().encode(JSON.stringify(l.map((h) => Array.from(h))));
        ye.set(o, u);
        try {
          e.transaction(t, "readwrite").objectStore(t).put({
            key: `list:${s}`,
            value: Array.from(u)
          });
        } catch (h) {
          console.warn("[mlsStore] removeFromList IDB write failed for", t, s, h);
        }
      }
    };
  }
  function Ko(e, t, n, r = {}) {
    const { initBridge: s = true } = r, o = `${e}${t}-${n}`;
    return new Promise((a, i) => {
      const l = indexedDB.open(o, Xc);
      l.onerror = () => i(l.error), l.onsuccess = () => {
        var _a2, _b;
        const u = l.result;
        s && Jc(u), (_b = (_a2 = navigator.storage) == null ? void 0 : _a2.persist) == null ? void 0 : _b.call(_a2).catch(() => {
        }), a(u);
      }, l.onupgradeneeded = (u) => {
        const h = u.target.result;
        h.objectStoreNames.contains(Bt) || h.createObjectStore(Bt, {
          keyPath: "key"
        }), h.objectStoreNames.contains(wt) || h.createObjectStore(wt, {
          keyPath: "key"
        }), h.objectStoreNames.contains(pn) || h.createObjectStore(pn, {
          keyPath: "key"
        });
        for (const d of Nn) h.objectStoreNames.contains(d) || h.createObjectStore(d, {
          keyPath: "key"
        });
        h.objectStoreNames.contains("localPlaintext") || h.createObjectStore("localPlaintext", {
          keyPath: "key"
        }), h.objectStoreNames.contains("groupEpoch") || h.createObjectStore("groupEpoch", {
          keyPath: "key"
        });
      };
    });
  }
  qc = function(e, t) {
    return Ko(zc, e, t);
  };
  Ho = function(e, t) {
    return Ko(Yc, e, t, {
      initBridge: false
    });
  };
  function Rn(e, t) {
    if (!e) return t;
    try {
      return `${new URL(e).host}:${t}`;
    } catch {
      return t;
    }
  }
  function Ut(e, t, n, r) {
    return new Promise((s, o) => {
      const l = e.transaction(t, "readwrite").objectStore(t).put({
        ...r,
        key: n
      });
      l.onsuccess = () => s(), l.onerror = () => o(l.error);
    });
  }
  function Lt(e, t, n) {
    return new Promise((r, s) => {
      const i = e.transaction(t, "readonly").objectStore(t).get(n);
      i.onsuccess = () => r(i.result ?? null), i.onerror = () => s(i.error);
    });
  }
  function Vo(e, t, n) {
    return new Promise((r, s) => {
      const i = e.transaction(t, "readwrite").objectStore(t).delete(n);
      i.onsuccess = () => r(), i.onerror = () => s(i.error);
    });
  }
  function Mn(e, t) {
    return new Promise((n, r) => {
      const a = e.transaction(t, "readonly").objectStore(t).getAll();
      a.onsuccess = () => n(a.result ?? []), a.onerror = () => r(a.error);
    });
  }
  function Qc(e, t) {
    return new Promise((n, r) => {
      const a = e.transaction(t, "readwrite").objectStore(t).clear();
      a.onsuccess = () => n(), a.onerror = () => r(a.error);
    });
  }
  function el(e, t, n) {
    return new Promise((r, s) => {
      const i = e.transaction(t, "readwrite").objectStore(t).put(n);
      i.onsuccess = () => r(), i.onerror = () => s(i.error);
    });
  }
  async function Wo(e) {
    for (const t of Nn) {
      const n = await Mn(e, t);
      for (const r of n) {
        const s = `${t}:${r.key}`;
        ye.has(s) || ye.set(s, new Uint8Array(r.value));
      }
    }
  }
  tl = async function(e, t) {
    const n = new Map(ye);
    ye.clear();
    try {
      return await Wo(e), await t(e);
    } finally {
      ye.clear();
      for (const [r, s] of n) ye.set(r, s);
    }
  };
  nl = async function(e) {
    const t = {};
    for (const n of Oo) t[n] = await Mn(e, n);
    return {
      version: 1,
      stores: t
    };
  };
  async function Fo(e, t) {
    if (t == null ? void 0 : t.stores) for (const n of Oo) {
      await Qc(e, n);
      const r = Array.isArray(t.stores[n]) ? t.stores[n] : [];
      for (const s of r) await el(e, n, s);
    }
  }
  async function rl(e) {
    for (const [t, n] of ye) {
      const r = t.indexOf(":");
      if (r < 0) continue;
      const s = t.slice(0, r), o = t.slice(r + 1);
      if (Nn.includes(s)) try {
        const a = e.transaction(s, "readwrite");
        a.objectStore(s).put({
          key: o,
          value: Array.from(n)
        }), await new Promise((i, l) => {
          a.oncomplete = i, a.onerror = () => l(a.error);
        });
      } catch {
      }
    }
  }
  sl = async function(e) {
    const t = await Lt(e, Bt, $o);
    return (t == null ? void 0 : t.signingPublicKey) ? {
      signingPublicKey: new Uint8Array(t.signingPublicKey),
      signingPrivateKey: new Uint8Array(t.signingPrivateKey),
      credentialBytes: new Uint8Array(t.credentialBytes)
    } : null;
  };
  async function ol(e, t) {
    await Ut(e, Bt, $o, {
      signingPublicKey: Array.from(t.signingPublicKey),
      signingPrivateKey: Array.from(t.signingPrivateKey),
      credentialBytes: Array.from(t.credentialBytes)
    });
  }
  async function al(e, t) {
    const n = await Lt(e, wt, t);
    return (n == null ? void 0 : n.keyPackageBytes) ? {
      keyPackageBytes: new Uint8Array(n.keyPackageBytes),
      privateKeyBytes: new Uint8Array(n.privateKeyBytes),
      createdAt: n.createdAt ?? 0
    } : null;
  }
  async function il(e, t, n) {
    await Ut(e, wt, t, {
      keyPackageBytes: Array.from(n.keyPackageBytes),
      privateKeyBytes: Array.from(n.privateKeyBytes),
      createdAt: n.createdAt ?? Date.now()
    });
  }
  async function cl(e, t) {
    await Vo(e, wt, t);
  }
  function ll(e) {
    return Mn(e, wt);
  }
  async function ul(e) {
    const t = await Lt(e, pn, Po);
    return (t == null ? void 0 : t.keyPackageBytes) ? {
      keyPackageBytes: new Uint8Array(t.keyPackageBytes),
      privateKeyBytes: new Uint8Array(t.privateKeyBytes),
      hashRefHex: t.hashRefHex
    } : null;
  }
  async function dl(e, t) {
    await Ut(e, pn, Po, {
      keyPackageBytes: Array.from(t.keyPackageBytes),
      privateKeyBytes: Array.from(t.privateKeyBytes),
      hashRefHex: t.hashRefHex
    });
  }
  async function fl(e, t) {
    const n = await Lt(e, "localPlaintext", t);
    return (n == null ? void 0 : n.plaintext) ? {
      plaintext: n.plaintext,
      timestamp: n.timestamp ?? 0
    } : null;
  }
  async function hl(e, t, n) {
    await Ut(e, "localPlaintext", t, {
      plaintext: n.plaintext,
      timestamp: n.timestamp ?? Date.now()
    });
  }
  gl = async function(e, t, n) {
    const r = Rn(n, t), s = await Lt(e, "groupEpoch", r);
    return s == null || s.epoch == null ? null : s.epoch;
  };
  async function yl(e, t, n, r) {
    const s = Rn(r, t);
    await Ut(e, "groupEpoch", s, {
      epoch: n
    });
  }
  async function ml(e, t, n) {
    const r = Rn(n, t);
    await Vo(e, "groupEpoch", r);
  }
  pl = async function(e) {
    return Mn(e, "groupEpoch");
  };
  let Zo, jt, zo;
  wl = Object.freeze(Object.defineProperty({
    __proto__: null,
    deleteGroupEpoch: ml,
    deleteKeyPackage: cl,
    exportHistorySnapshot: nl,
    flushStorageCache: rl,
    getCredential: sl,
    getGroupEpoch: gl,
    getKeyPackage: al,
    getLastResort: ul,
    getLocalPlaintext: fl,
    importHistorySnapshot: Fo,
    listAllGroupEpochs: pl,
    listAllKeyPackages: ll,
    namespacedKey: Rn,
    openHistoryStore: Ho,
    openStore: qc,
    preloadGroupState: Wo,
    setCredential: ol,
    setGroupEpoch: yl,
    setKeyPackage: il,
    setLastResort: dl,
    setLocalPlaintext: hl,
    withReadOnlyHistoryScope: tl
  }, Symbol.toStringTag, {
    value: "Module"
  }));
  Zo = 1;
  jt = 12;
  zo = 32;
  async function bl(e, t) {
    const n = globalThis.crypto.getRandomValues(new Uint8Array(jt)), r = new Uint8Array(await globalThis.crypto.subtle.encrypt({
      name: "AES-GCM",
      iv: n
    }, e, t)), s = new Uint8Array(1 + jt + r.length);
    return s[0] = Zo, s.set(n, 1), s.set(r, 1 + jt), s;
  }
  async function vl(e, t) {
    if (t[0] !== Zo) throw new Error(`[guildMetadata] Unknown blob version: 0x${t[0].toString(16)}`);
    const n = t.slice(1, 1 + jt), r = t.slice(1 + jt), s = await globalThis.crypto.subtle.decrypt({
      name: "AES-GCM",
      iv: n
    }, e, r);
    return new Uint8Array(s);
  }
  Xf = async function(e, t) {
    const n = JSON.stringify({
      n: t.name,
      d: t.description,
      i: null
    }), r = new TextEncoder().encode(n);
    return bl(e, r);
  };
  Jf = async function(e, t) {
    const n = await vl(e, t), r = JSON.parse(new TextDecoder().decode(n));
    return {
      name: r.n ?? "",
      description: r.d ?? "",
      icon: r.i ?? null
    };
  };
  xl = function(e) {
    let t = "";
    for (let n = 0; n < e.length; n++) t += String.fromCharCode(e[n]);
    return btoa(t);
  };
  Il = function(e) {
    const t = atob(e), n = new Uint8Array(t.length);
    for (let r = 0; r < t.length; r++) n[r] = t.charCodeAt(r);
    return n;
  };
  qf = function(e) {
    return e;
  };
  Qf = function(e) {
    try {
      return decodeURIComponent(e);
    } catch {
      return null;
    }
  };
  eh = async function(e) {
    if (!xt(e)) throw new Error("invalid guild metadata key");
    return globalThis.crypto.subtle.importKey("raw", e, {
      name: "AES-GCM"
    }, false, [
      "encrypt",
      "decrypt"
    ]);
  };
  th = function() {
    return globalThis.crypto.getRandomValues(new Uint8Array(zo));
  };
  function xt(e) {
    return e instanceof Uint8Array && e.length === zo;
  }
  nh = function(e) {
    if (!xt(e)) throw new Error("invalid guild metadata key");
    return xl(e);
  };
  rh = function(e) {
    try {
      const t = Il(decodeURIComponent(e));
      return xt(t) ? t : null;
    } catch {
      return null;
    }
  };
  const kl = 1, re = "guild_keys", Yo = "pending:";
  function Sl(e, t) {
    return `hush-guild-metadata-${e}-${t}`;
  }
  function Al(e, t) {
    return new Promise((n, r) => {
      const s = indexedDB.open(Sl(e, t), kl);
      s.onupgradeneeded = () => {
        const o = s.result;
        o.objectStoreNames.contains(re) || o.createObjectStore(re, {
          keyPath: "guildId"
        });
      }, s.onsuccess = () => n(s.result), s.onerror = () => r(s.error ?? new Error("failed to open guild metadata key store"));
    });
  }
  function Ye(e) {
    return new Promise((t, n) => {
      e.oncomplete = () => t(), e.onerror = () => n(e.error ?? new Error("guild metadata key transaction failed")), e.onabort = () => n(e.error ?? new Error("guild metadata key transaction aborted"));
    });
  }
  function Rr(e) {
    return new Promise((t, n) => {
      e.onsuccess = () => t(e.result), e.onerror = () => n(e.error ?? new Error("guild metadata key request failed"));
    });
  }
  function Cl() {
    return `${Yo}${globalThis.crypto.randomUUID()}`;
  }
  function Mr(e) {
    return typeof e == "string" && e.startsWith(Yo);
  }
  function Nt(e) {
    if (!e || typeof e != "string") throw new Error("guildId is required");
  }
  function Xo(e) {
    if (!xt(e)) throw new Error("invalid guild metadata key");
  }
  function Dt(e) {
    return Array.from(e);
  }
  function Ur(e) {
    const t = Array.isArray(e == null ? void 0 : e.keyBytes) ? new Uint8Array(e.keyBytes) : null;
    return xt(t) ? t : null;
  }
  El = async function(e, t) {
    if (!e) throw new Error("userId is required");
    if (!t) throw new Error("deviceId is required");
    return Al(e, t);
  };
  sh = async function(e, t) {
    Nt(t);
    const n = e.transaction(re, "readonly"), r = n.objectStore(re), s = await Rr(r.get(t));
    await Ye(n);
    const o = Ur(s);
    if (o || !s) return o;
    const a = e.transaction(re, "readwrite");
    return a.objectStore(re).delete(t), await Ye(a), null;
  };
  oh = async function(e, t) {
    Nt(t);
    const n = e.transaction(re, "readwrite");
    n.objectStore(re).delete(t), await Ye(n);
  };
  ah = async function(e, t, n) {
    Nt(t), Xo(n);
    const r = e.transaction(re, "readwrite");
    r.objectStore(re).put({
      guildId: t,
      keyBytes: Dt(n),
      updatedAt: Date.now()
    }), await Ye(r);
  };
  ih = async function(e, t) {
    Xo(t);
    const n = Cl(), r = e.transaction(re, "readwrite");
    return r.objectStore(re).put({
      guildId: n,
      keyBytes: Dt(t),
      updatedAt: Date.now()
    }), await Ye(r), n;
  };
  ch = async function(e, t, n) {
    if (Nt(t), Nt(n), !Mr(t)) throw new Error("pendingGuildId is invalid");
    const r = e.transaction(re, "readwrite"), s = r.objectStore(re), o = await Rr(s.get(t)), a = Ur(o);
    if (!a) throw r.abort(), new Error("pending guild metadata key is missing");
    s.put({
      guildId: n,
      keyBytes: Dt(a),
      updatedAt: Date.now()
    }), s.delete(t), await Ye(r);
  };
  lh = async function(e) {
    const t = e.transaction(re, "readonly"), n = await Rr(t.objectStore(re).getAll());
    return await Ye(t), {
      version: 1,
      keys: (n ?? []).filter((r) => (r == null ? void 0 : r.guildId) && !Mr(r.guildId)).map((r) => {
        const s = Ur(r);
        return s ? {
          guildId: r.guildId,
          keyBytes: Dt(s)
        } : null;
      }).filter(Boolean)
    };
  };
  async function jl(e, t) {
    const n = Array.isArray(t == null ? void 0 : t.keys) ? t.keys : [], r = e.transaction(re, "readwrite"), s = r.objectStore(re);
    s.clear();
    for (const o of n) {
      const a = Array.isArray(o == null ? void 0 : o.keyBytes) ? new Uint8Array(o.keyBytes) : null;
      !(o == null ? void 0 : o.guildId) || Mr(o.guildId) || !xt(a) || s.put({
        guildId: o.guildId,
        keyBytes: Dt(a),
        updatedAt: Date.now()
      });
    }
    await Ye(r);
  }
  const _l = "hush-auth-instances", Tl = 1, bt = "instances", Jo = "hush_auth_instances_fallback", wn = "hush_auth_instance_selected", bn = "hush_auth_instance_active", fs = "hush_auth_instance_default_origin_migrated_v1", nt = "https://app.gethush.live";
  function Bl() {
    var _a2;
    if (typeof window > "u") return nt;
    const e = Pe((_a2 = window.location) == null ? void 0 : _a2.origin);
    if (!e) return nt;
    try {
      if (new URL(e).host === "gethush.live") return nt;
    } catch {
      return nt;
    }
    return e;
  }
  Ne = Bl();
  function qo() {
    if (!(typeof window > "u") && Ne !== nt) try {
      if (localStorage.getItem(fs) === "1") return;
      const e = Pe(localStorage.getItem(wn)), t = Pe(sessionStorage.getItem(bn));
      (!e || e === nt) && localStorage.setItem(wn, Ne), (!t || t === nt) && sessionStorage.setItem(bn, Ne), localStorage.setItem(fs, "1");
    } catch {
    }
  }
  function rr() {
    return {
      url: Ne,
      lastUsedAt: 0
    };
  }
  function Nl(e) {
    const t = Pe(e == null ? void 0 : e.url);
    return t ? {
      url: t,
      lastUsedAt: Number(e == null ? void 0 : e.lastUsedAt) || 0
    } : null;
  }
  function Lr(e) {
    const t = /* @__PURE__ */ new Map();
    return t.set(Ne, rr()), e.forEach((n) => {
      const r = Nl(n);
      if (!r) return;
      const s = t.get(r.url);
      t.set(r.url, {
        url: r.url,
        lastUsedAt: Math.max((s == null ? void 0 : s.lastUsedAt) || 0, r.lastUsedAt)
      });
    }), Array.from(t.values());
  }
  function Dr(e) {
    return [
      ...e
    ].sort((t, n) => t.url === Ne ? -1 : n.url === Ne ? 1 : n.lastUsedAt !== t.lastUsedAt ? n.lastUsedAt - t.lastUsedAt : hs(t.url).localeCompare(hs(n.url)));
  }
  function Qo() {
    try {
      const e = localStorage.getItem(Jo);
      if (!e) return [
        rr()
      ];
      const t = JSON.parse(e);
      return Dr(Lr(Array.isArray(t) ? t : []));
    } catch {
      return [
        rr()
      ];
    }
  }
  function Rl(e) {
    try {
      localStorage.setItem(Jo, JSON.stringify(e));
    } catch {
    }
  }
  function ea() {
    return new Promise((e, t) => {
      if (typeof indexedDB > "u") {
        t(new Error("indexeddb unavailable"));
        return;
      }
      const n = indexedDB.open(_l, Tl);
      n.onerror = () => t(n.error), n.onsuccess = () => e(n.result), n.onupgradeneeded = (r) => {
        const s = r.target.result;
        s.objectStoreNames.contains(bt) || s.createObjectStore(bt, {
          keyPath: "url"
        });
      };
    });
  }
  async function ta() {
    const e = await ea();
    try {
      const t = await new Promise((n, r) => {
        const a = e.transaction(bt, "readonly").objectStore(bt).getAll();
        a.onsuccess = () => n(a.result ?? []), a.onerror = () => r(a.error);
      });
      return Dr(Lr(t));
    } finally {
      e.close();
    }
  }
  async function Ml(e) {
    const t = await ea();
    try {
      await new Promise((n, r) => {
        const a = t.transaction(bt, "readwrite").objectStore(bt).put(e);
        a.onsuccess = () => n(), a.onerror = () => r(a.error);
      });
    } finally {
      t.close();
    }
  }
  async function na(e, t = false) {
    const n = Pe(e);
    if (!n) throw new Error("Enter a valid instance URL.");
    const r = t ? Date.now() : 0;
    try {
      const o = (await ta()).find((a) => a.url === n);
      await Ml({
        url: n,
        lastUsedAt: Math.max((o == null ? void 0 : o.lastUsedAt) || 0, r)
      });
    } catch {
      const s = Qo(), o = s.find((i) => i.url === n), a = Dr(Lr([
        ...s.filter((i) => i.url !== n),
        {
          url: n,
          lastUsedAt: Math.max((o == null ? void 0 : o.lastUsedAt) || 0, r)
        }
      ]));
      Rl(a);
    }
    return n;
  }
  function Pe(e) {
    const t = String(e || "").trim();
    if (!t) return null;
    const n = /^[a-zA-Z][a-zA-Z\d+.-]*:\/\//.test(t) ? t : `https://${t}`;
    try {
      const r = new URL(n);
      return r.pathname = "", r.search = "", r.hash = "", r.origin;
    } catch {
      return null;
    }
  }
  hs = function(e) {
    const t = Pe(e);
    if (!t) return String(e || "").trim() || "instance";
    try {
      return new URL(t).host;
    } catch {
      return t;
    }
  };
  function Gr() {
    return qo(), typeof localStorage > "u" ? Ne : Pe(localStorage.getItem(wn)) || Ne;
  }
  _t = function() {
    if (qo(), typeof sessionStorage < "u") {
      const e = Pe(sessionStorage.getItem(bn));
      if (e) return e;
    }
    return Gr();
  };
  function ra(e) {
    const t = Pe(e) || Ne;
    try {
      localStorage.setItem(wn, t);
    } catch {
    }
    return t;
  }
  function Ul(e) {
    const t = ra(e);
    try {
      sessionStorage.setItem(bn, t);
    } catch {
    }
    return t;
  }
  uh = async function() {
    try {
      return await ta();
    } catch {
      return Qo();
    }
  };
  dh = async function(e) {
    const t = ra(e);
    return await na(t, false), t;
  };
  fh = async function(e) {
    const t = Ul(e);
    return await na(t, true), t;
  };
  let ce = null, Wn = null;
  async function de() {
    if (!ce) return Wn || (Wn = (async () => {
      const e = await je(() => import("./hush_crypto-BuuMsqo9.js"), []);
      await e.default(), e.init(), ce = e;
    })()), Wn;
  }
  async function Ll(e) {
    await de();
    const t = ce.generateCredential(e);
    return {
      signingPublicKey: new Uint8Array(t.signingPublicKey),
      signingPrivateKey: new Uint8Array(t.signingPrivateKey),
      credentialBytes: new Uint8Array(t.credentialBytes)
    };
  }
  async function Dl(e, t, n) {
    await de();
    const r = ce.generateKeyPackage(e, t, n);
    return {
      keyPackageBytes: new Uint8Array(r.keyPackageBytes),
      privateKeyBytes: new Uint8Array(r.privateKeyBytes),
      hashRefBytes: new Uint8Array(r.hashRefBytes)
    };
  }
  async function Gl(e, t, n, r) {
    await de();
    const s = await ce.createGroup(e, t, n, r);
    return {
      groupInfoBytes: new Uint8Array(s.groupInfoBytes),
      epoch: s.epoch
    };
  }
  async function $l(e, t, n, r) {
    await de();
    const s = await ce.joinGroupExternal(e, t, n, r);
    return {
      commitBytes: new Uint8Array(s.commitBytes),
      epoch: s.epoch
    };
  }
  async function Pl(e, t, n, r, s) {
    await de();
    const o = await ce.addMembers(e, t, n, r, s);
    return {
      commitBytes: new Uint8Array(o.commitBytes),
      welcomeBytes: new Uint8Array(o.welcomeBytes),
      groupInfoBytes: new Uint8Array(o.groupInfoBytes),
      epoch: o.epoch
    };
  }
  async function Ol(e, t, n, r, s) {
    await de();
    const o = await ce.createMessage(e, t, n, r, s);
    return {
      messageBytes: new Uint8Array(o.messageBytes)
    };
  }
  async function Kl(e, t, n, r, s) {
    await de();
    const o = await ce.processMessage(e, t, n, r, s);
    return {
      type: o.type,
      plaintext: o.plaintext != null ? new Uint8Array(o.plaintext) : void 0,
      epoch: o.epoch,
      senderIdentity: o.senderIdentity
    };
  }
  async function Hl(e, t, n, r, s) {
    await de();
    const o = await ce.removeMembers(e, t, n, r, s);
    return {
      commitBytes: new Uint8Array(o.commitBytes),
      groupInfoBytes: new Uint8Array(o.groupInfoBytes),
      epoch: o.epoch
    };
  }
  async function Vl(e, t, n, r) {
    await de();
    const s = await ce.selfUpdate(e, t, n, r);
    return {
      commitBytes: new Uint8Array(s.commitBytes),
      groupInfoBytes: new Uint8Array(s.groupInfoBytes),
      epoch: s.epoch
    };
  }
  async function Wl(e, t, n, r) {
    await de();
    const s = await ce.leaveGroup(e, t, n, r);
    return {
      proposalBytes: new Uint8Array(s.proposalBytes)
    };
  }
  async function Fl(e, t, n, r) {
    await de();
    const s = await ce.mergePendingCommit(e, t, n, r);
    return {
      groupInfoBytes: new Uint8Array(s.groupInfoBytes),
      epoch: s.epoch
    };
  }
  async function Zl(e, t, n, r) {
    await de();
    const s = await ce.exportGroupInfo(e, t, n, r);
    return {
      groupInfoBytes: new Uint8Array(s.groupInfoBytes)
    };
  }
  async function zl(e, t, n, r) {
    await de();
    const s = await ce.exportVoiceFrameKey(e, t, n, r);
    return {
      frameKeyBytes: new Uint8Array(s.frameKeyBytes),
      epoch: s.epoch
    };
  }
  async function Yl(e, t, n, r) {
    await de();
    const s = await ce.exportMetadataKey(e, t, n, r);
    return {
      metadataKeyBytes: new Uint8Array(s.metadataKeyBytes),
      epoch: s.epoch
    };
  }
  Xl = Object.freeze(Object.defineProperty({
    __proto__: null,
    addMembers: Pl,
    createGroup: Gl,
    createMessage: Ol,
    exportGroupInfoBytes: Zl,
    exportMetadataKey: Yl,
    exportVoiceFrameKey: zl,
    generateCredential: Ll,
    generateKeyPackage: Dl,
    init: de,
    joinGroupExternal: $l,
    leaveGroup: Wl,
    mergePendingCommit: Fl,
    processMessage: Kl,
    removeMembers: Hl,
    selfUpdate: Vl
  }, Symbol.toStringTag, {
    value: "Module"
  }));
  function $r(e = null) {
    const t = Jl(e), n = ql(t), r = Ql(t);
    return `${n} on ${r}`;
  }
  function Jl(e) {
    return typeof e == "string" && e.trim() !== "" ? e : typeof navigator < "u" && typeof navigator.userAgent == "string" ? navigator.userAgent : "";
  }
  function ql(e) {
    return /(EdgiOS|EdgA|Edg)\//.test(e) ? "Edge" : /OPR\//.test(e) || /Opera\//.test(e) ? "Opera" : /SamsungBrowser\//.test(e) ? "Samsung Internet" : /FxiOS\//.test(e) || /Firefox\//.test(e) ? "Firefox" : /CriOS\//.test(e) || /Chrome\//.test(e) || /Chromium\//.test(e) ? "Chrome" : /Safari\//.test(e) && /Version\//.test(e) ? "Safari" : "Browser";
  }
  Ql = function(e) {
    return /iPhone/.test(e) ? "iPhone" : /iPad/.test(e) || /Macintosh/.test(e) && /Mobile/.test(e) ? "iPad" : /Android/.test(e) ? "Android" : /CrOS/.test(e) ? "ChromeOS" : /Macintosh|Mac OS X/.test(e) ? "macOS" : /Windows NT/.test(e) ? "Windows" : /Linux/.test(e) ? "Linux" : "device";
  };
  const eu = 50;
  function gs(e) {
    return Array.from(e).map((t) => t.toString(16).padStart(2, "0")).join("");
  }
  async function tu(e, t, n, r) {
    const { mlsStore: s, crypto: o, uploadCredential: a, uploadKeyPackages: i } = r, l = await s.openStore(t, n);
    let u = await s.getCredential(l);
    u || (await o.init(), u = await o.generateCredential(`${t}:${n}`), await s.setCredential(l, u), await a(e, {
      deviceId: n,
      credentialBytes: Array.from(u.credentialBytes),
      signingPublicKey: Array.from(u.signingPublicKey)
    }));
    const h = [];
    for (let v = 0; v < eu; v++) {
      const p = await o.generateKeyPackage(u.signingPrivateKey, u.signingPublicKey, u.credentialBytes), E = gs(p.hashRefBytes);
      await s.setKeyPackage(l, E, {
        keyPackageBytes: p.keyPackageBytes,
        privateKeyBytes: p.privateKeyBytes,
        createdAt: Date.now()
      }), h.push(p.keyPackageBytes);
    }
    const d = await o.generateKeyPackage(u.signingPrivateKey, u.signingPublicKey, u.credentialBytes), y = gs(d.hashRefBytes);
    await s.setLastResort(l, {
      keyPackageBytes: d.keyPackageBytes,
      privateKeyBytes: d.privateKeyBytes,
      hashRefHex: y
    }), await i(e, {
      deviceId: n,
      keyPackages: [
        Array.from(d.keyPackageBytes)
      ],
      lastResort: true
    });
    const g = new Date(Date.now() + 30 * 24 * 3600 * 1e3).toISOString();
    await i(e, {
      deviceId: n,
      keyPackages: h.map((v) => Array.from(v)),
      expiresAt: g
    });
  }
  const nu = 8e3, ru = 1e4;
  function Xe(e = "") {
    return e || Gr();
  }
  function sa(e, t = "") {
    return t || e.startsWith("http") ? t : e.startsWith("/api/auth") ? _t() : "";
  }
  function su(e, t = "") {
    return e.startsWith("http") ? e : `${t}${e}`;
  }
  function Un(e, t = "") {
    return su(e, sa(e, t));
  }
  function pe(e, t, n) {
    const r = n instanceof Error ? n.message : String(n), o = /load failed|failed to fetch|networkerror/i.test(r) ? `${e} failed. Could not reach ${t}.` : `${e} failed for ${t}: ${r}`, a = new Error(o);
    return n instanceof Error && (a.cause = n), console.error(`[api] ${e} failed`, {
      url: t,
      err: n
    }), a;
  }
  function oa(e, t) {
    if (typeof AbortController > "u") return {
      signal: t,
      cleanup() {
      }
    };
    const n = new AbortController(), r = setTimeout(() => {
      n.abort();
    }, e);
    let s = null;
    if (t) if (t.aborted) n.abort();
    else {
      const o = () => n.abort();
      t.addEventListener("abort", o, {
        once: true
      }), s = () => {
        t.removeEventListener("abort", o);
      };
    }
    return {
      signal: n.signal,
      cleanup() {
        clearTimeout(r), s == null ? void 0 : s();
      }
    };
  }
  async function k(e, t, n = {}, r = "") {
    const s = sa(t, r), o = t.startsWith("http") ? t : `${s}${t}`, a = new Headers(n.headers);
    return e && !a.has("Authorization") && a.set("Authorization", `Bearer ${e}`), fetch(o, {
      ...n,
      headers: a
    });
  }
  async function aa(e, t, n = "") {
    let r;
    try {
      r = await k(e, "/api/mls/credentials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(t)
      }, n);
    } catch (s) {
      throw pe("upload MLS credential", Un("/api/mls/credentials", n), s);
    }
    if (!r.ok) {
      const s = await r.json().catch(() => ({}));
      throw new Error(s.error || `upload MLS credential ${r.status}`);
    }
  }
  ia = async function(e, t, n = "") {
    let r;
    try {
      r = await k(e, "/api/mls/key-packages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(t)
      }, n);
    } catch (s) {
      throw pe("upload MLS key packages", Un("/api/mls/key-packages", n), s);
    }
    if (!r.ok) {
      const s = await r.json().catch(() => ({}));
      throw new Error(s.error || `upload MLS key packages ${r.status}`);
    }
  };
  ou = async function(e, t, n = "") {
    const r = await k(e, `/api/mls/key-packages/count?deviceId=${encodeURIComponent(t)}`, {}, n);
    if (!r.ok) {
      const o = await r.json().catch(() => ({}));
      throw new Error(o.error || `getKeyPackageCount ${r.status}`);
    }
    return (await r.json()).count;
  };
  au = async function(e, t, n = "") {
    const r = await k(e, `/api/keys/${t}`, {}, n);
    if (!r.ok) {
      if (r.status === 404) return [];
      const s = await r.json().catch(() => ({}));
      throw new Error(s.error || `get prekey bundle ${r.status}`);
    }
    return r.json();
  };
  iu = async function(e, t, n, r = "") {
    const s = await k(e, `/api/keys/${t}/${encodeURIComponent(n)}`, {}, r);
    if (!s.ok) {
      const o = await s.json().catch(() => ({}));
      throw new Error(o.error || `get prekey bundle ${s.status}`);
    }
    return s.json();
  };
  cu = async function(e, t, n, r = {}, s = "") {
    const o = new URLSearchParams();
    r.before && o.set("before", r.before), r.limit != null && o.set("limit", String(r.limit));
    const a = o.toString(), i = `/api/servers/${encodeURIComponent(t)}/channels/${encodeURIComponent(n)}/messages${a ? `?${a}` : ""}`, l = await k(e, i, {}, s);
    if (!l.ok) {
      const u = await l.json().catch(() => ({}));
      throw new Error(u.error || `get messages ${l.status}`);
    }
    return l.json();
  };
  lu = async function(e, t = "") {
    const n = await k(e, "/api/instance", {}, t);
    if (!n.ok) {
      const r = await n.json().catch(() => ({}));
      throw new Error(r.error || `get instance ${n.status}`);
    }
    return n.json();
  };
  async function uu(e, t, n = "") {
    const r = await k(e, "/api/instance", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(t)
    }, n);
    if (!r.ok) {
      const s = await r.json().catch(() => ({}));
      throw new Error(s.error || `update instance ${r.status}`);
    }
  }
  ca = async function(e, t, n = "") {
    const r = `${n}/api/transparency/verify?pubkey=${encodeURIComponent(t)}`, s = await k(e, r, {}, "");
    if (!s.ok) throw new Error(`Transparency verify failed: ${s.status}`);
    return s.json();
  };
  async function vn(e, t = "") {
    const r = `${Xe(t)}/api/auth/challenge`;
    let s;
    try {
      s = await fetch(r, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          publicKey: e
        })
      });
    } catch (a) {
      throw pe("request challenge", r, a);
    }
    const o = await s.json().catch(() => ({}));
    if (!s.ok) {
      const a = new Error(o.error || `requestChallenge ${s.status}`);
      throw a.status = s.status, a;
    }
    return o;
  }
  async function Pr(e, t, n, r, s = "") {
    const a = `${Xe(s)}/api/auth/verify`;
    let i;
    try {
      i = await fetch(a, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          publicKey: e,
          nonce: t,
          signature: n,
          deviceId: r
        })
      });
    } catch (u) {
      throw pe("verify challenge", a, u);
    }
    const l = await i.json().catch(() => ({}));
    if (!i.ok) {
      const u = new Error(l.error || `verifyChallenge ${i.status}`);
      throw u.status = i.status, u;
    }
    return l;
  }
  async function la(e, t, n, r, s, o, a = "") {
    const l = `${Xe(a)}/api/auth/federated-verify`;
    let u;
    try {
      u = await fetch(l, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          publicKey: e,
          nonce: t,
          signature: n,
          homeInstance: r,
          username: s,
          displayName: o
        })
      });
    } catch (d) {
      throw pe("federated-verify", l, d);
    }
    const h = await u.json().catch(() => ({}));
    if (!u.ok) {
      const d = new Error(h.error || `federatedVerify ${u.status}`);
      throw d.status = u.status, d;
    }
    return h;
  }
  async function ua(e = "") {
    const n = `${Xe(e)}/api/auth/guest`;
    let r;
    try {
      r = await fetch(n, {
        method: "POST"
      });
    } catch (o) {
      throw pe("request guest session", n, o);
    }
    const s = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(s.error || `requestGuestSession ${r.status}`);
    return s;
  }
  du = async function(e, t = "", n) {
    const s = `${t || Gr()}/api/auth/check-username/${encodeURIComponent(e)}`, { signal: o, cleanup: a } = oa(nu, n);
    let i;
    try {
      i = await fetch(s, {
        signal: o
      });
    } catch (u) {
      throw pe("check username availability", s, u);
    } finally {
      a();
    }
    return i.ok ? (await i.json()).available === true : false;
  };
  async function da(e, t, n, r, s, o = "", a = null, i = null) {
    const u = `${Xe(o)}/api/auth/register`, h = {
      username: e,
      displayName: t,
      publicKey: n,
      deviceId: r,
      label: $r()
    };
    s && (h.inviteCode = s), a != null && (h.transparency_sig = a, h.transparency_ts = i);
    let d;
    try {
      d = await fetch(u, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(h)
      });
    } catch (g) {
      throw pe("register", u, g);
    }
    const y = await d.json().catch(() => ({}));
    if (!d.ok) {
      const g = new Error(y.error || `registerWithPublicKey ${d.status}`);
      throw g.status = d.status, g;
    }
    return y;
  }
  async function fa(e, t = "") {
    const n = await k(e, "/api/auth/devices", {}, t), r = await n.json().catch(() => ({}));
    if (!n.ok) throw new Error(r.error || `listDeviceKeys ${n.status}`);
    return r;
  }
  async function ha(e, t, n = "", r = null, s = null) {
    const o = {};
    r != null && (o.transparency_sig = r, o.transparency_ts = s);
    const a = {
      method: "DELETE"
    };
    Object.keys(o).length > 0 && (a.headers = {
      "Content-Type": "application/json"
    }, a.body = JSON.stringify(o));
    const i = await k(e, `/api/auth/devices/${encodeURIComponent(t)}`, a, n);
    if (!i.ok) {
      const l = await i.json().catch(() => ({}));
      throw new Error(l.error || `revokeDeviceKey ${i.status}`);
    }
  }
  async function fu(e, t, n, r, s, o, a = "", i = null, l = null) {
    const u = {
      devicePublicKey: t,
      certificate: n,
      deviceId: r,
      signingDeviceId: s,
      label: o
    };
    i != null && (u.transparency_sig = i, u.transparency_ts = l);
    const h = await k(e, "/api/auth/devices", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(u)
    }, a);
    if (!h.ok) {
      const d = await h.json().catch(() => ({}));
      throw new Error(d.error || `certifyNewDevice ${h.status}`);
    }
  }
  hu = async function(e, t = "") {
    const n = Xe(t), r = {
      ...e,
      label: (e == null ? void 0 : e.label) || $r()
    }, s = `${n}/api/auth/link-request`;
    let o;
    try {
      o = await fetch(s, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(r)
      });
    } catch (i) {
      throw pe("create device link request", s, i);
    }
    const a = await o.json().catch(() => ({}));
    if (!o.ok) throw new Error(a.error || `createDeviceLinkRequest ${o.status}`);
    return a;
  };
  gu = async function(e, t, n = "") {
    const r = Un("/api/auth/link-resolve", n);
    let s;
    try {
      s = await k(e, "/api/auth/link-resolve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(t)
      }, n);
    } catch (a) {
      throw pe("resolve device link request", r, a);
    }
    const o = await s.json().catch(() => ({}));
    if (!s.ok) throw new Error(o.error || `resolveDeviceLinkRequest ${s.status}`);
    return o;
  };
  yu = async function(e, t, n = "") {
    const r = Un("/api/auth/link-verify", n);
    let s;
    try {
      s = await k(e, "/api/auth/link-verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(t)
      }, n);
    } catch (a) {
      throw pe("verify device link request", r, a);
    }
    const o = await s.json().catch(() => ({}));
    if (!s.ok) throw new Error(o.error || `verifyDeviceLinkRequest ${s.status}`);
  };
  mu = async function(e, t = "") {
    const r = `${Xe(t)}/api/auth/link-result`;
    let s;
    try {
      s = await fetch(r, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(e)
      });
    } catch (a) {
      throw pe("consume device link result", r, a);
    }
    const o = await s.json().catch(() => ({}));
    if (s.status === 202) return {
      status: "pending"
    };
    if (!s.ok) throw new Error(o.error || `consumeDeviceLinkResult ${s.status}`);
    return o;
  };
  ga = async function(e = "", t) {
    const n = `${e}/api/handshake`, { signal: r, cleanup: s } = oa(ru, t);
    let o;
    try {
      o = await fetch(n, {
        signal: r
      });
    } catch (i) {
      throw pe("handshake", n, i);
    } finally {
      s();
    }
    if (!o.ok) throw new Error(`handshake failed: ${o.status}`);
    const a = await o.json();
    return (a == null ? void 0 : a.registrationMode) !== void 0 && a.registration_mode === void 0 && (a.registration_mode = a.registrationMode), a;
  };
  async function At(e, t = "") {
    const n = await k(e, "/api/servers", {}, t);
    if (!n.ok) {
      const r = await n.json().catch(() => ({}));
      throw new Error(r.error || `get guilds ${n.status}`);
    }
    return n.json();
  }
  pu = async function(e, t, n, r = "", s = "") {
    const o = {};
    t != null && (o.encryptedMetadata = t), n && (o.templateId = n), s && (o.name = s);
    const a = await k(e, "/api/servers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(o)
    }, r);
    if (!a.ok) {
      const i = await a.json().catch(() => ({}));
      throw new Error(i.error || `create guild ${a.status}`);
    }
    return a.json();
  };
  async function wu(e, t, n, r = "") {
    const s = await k(e, `/api/servers/${encodeURIComponent(t)}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        encryptedMetadata: n
      })
    }, r);
    if (!s.ok) {
      const o = await s.json().catch(() => ({}));
      throw new Error(o.error || `update guild metadata ${s.status}`);
    }
  }
  bu = async function(e, t, n = "") {
    const r = await k(e, `/api/servers/${encodeURIComponent(t)}/leave`, {
      method: "POST"
    }, n);
    if (!r.ok) {
      const s = await r.json().catch(() => ({}));
      throw new Error(s.error || `leave guild failed: ${r.status}`);
    }
  };
  async function vu(e, t, n = "") {
    const r = await k(e, `/api/servers/${encodeURIComponent(t)}`, {
      method: "DELETE"
    }, n);
    if (!r.ok) {
      const s = await r.json().catch(() => ({}));
      throw new Error(s.error || `delete guild ${r.status}`);
    }
  }
  xu = async function(e, t, n = "") {
    const r = await k(e, `/api/servers/${encodeURIComponent(t)}/channels`, {}, n);
    if (!r.ok) {
      const s = await r.json().catch(() => ({})), o = new Error(s.error || `get channels ${r.status}`);
      throw o.status = r.status, o;
    }
    return r.json();
  };
  Iu = async function(e, t, n, r = "") {
    const s = await k(e, `/api/servers/${encodeURIComponent(t)}/channels`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(n)
    }, r);
    if (!s.ok) {
      const o = await s.json().catch(() => ({}));
      throw new Error(o.error || `create channel ${s.status}`);
    }
    return s.json();
  };
  ku = async function(e, t, n, r = "") {
    const s = await k(e, `/api/servers/${encodeURIComponent(t)}/channels/${encodeURIComponent(n)}`, {
      method: "DELETE"
    }, r);
    if (!s.ok) {
      const o = await s.json().catch(() => ({}));
      throw new Error(o.error || `delete channel ${s.status}`);
    }
  };
  Su = async function(e, t, n, r, s = "") {
    const o = await k(e, `/api/servers/${encodeURIComponent(t)}/channels/${encodeURIComponent(n)}/move`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(r)
    }, s);
    if (!o.ok) {
      const a = await o.json().catch(() => ({}));
      throw new Error(a.error || `move channel ${o.status}`);
    }
  };
  Au = async function(e, t, n = "") {
    const r = await k(e, `/api/servers/${encodeURIComponent(t)}/members`, {}, n);
    if (!r.ok) {
      const s = await r.json().catch(() => ({})), o = new Error(s.error || `get members ${r.status}`);
      throw o.status = r.status, o;
    }
    return r.json();
  };
  Cu = async function(e, t, n = {}, r = "") {
    const s = await k(e, `/api/servers/${encodeURIComponent(t)}/invites`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(n)
    }, r);
    if (!s.ok) {
      const o = await s.json().catch(() => ({}));
      throw new Error(o.error || `create invite ${s.status}`);
    }
    return s.json();
  };
  Eu = async function(e, t = "") {
    const n = await fetch(`${t}/api/invites/${encodeURIComponent(e)}`);
    if (!n.ok) {
      const r = await n.json().catch(() => ({}));
      throw new Error(r.error || `invite lookup ${n.status}`);
    }
    return n.json();
  };
  ju = async function(e, t, n = "") {
    const r = await k(e, "/api/invites/claim", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        code: t
      })
    }, n);
    if (!r.ok) {
      const s = await r.json().catch(() => ({}));
      throw new Error(s.error || `claim invite ${r.status}`);
    }
    return r.json();
  };
  _u = async function(e, t, n, r, s = "") {
    const o = await k(e, `/api/servers/${encodeURIComponent(t)}/moderation/kick`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userId: n,
        reason: r
      })
    }, s);
    if (!o.ok) {
      const a = await o.json().catch(() => ({}));
      throw new Error(a.error || `kick ${o.status}`);
    }
  };
  Tu = async function(e, t, n, r, s, o = "") {
    const a = await k(e, `/api/servers/${encodeURIComponent(t)}/moderation/ban`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userId: n,
        reason: r,
        expiresIn: s ?? null
      })
    }, o);
    if (!a.ok) {
      const i = await a.json().catch(() => ({}));
      throw new Error(i.error || `ban ${a.status}`);
    }
  };
  Bu = async function(e, t, n, r, s, o = "") {
    const a = await k(e, `/api/servers/${encodeURIComponent(t)}/moderation/mute`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userId: n,
        reason: r,
        expiresIn: s ?? null
      })
    }, o);
    if (!a.ok) {
      const i = await a.json().catch(() => ({}));
      throw new Error(i.error || `mute ${a.status}`);
    }
  };
  Nu = async function(e, t, n, r, s = "") {
    const o = await k(e, `/api/servers/${encodeURIComponent(t)}/moderation/unban`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userId: n,
        reason: r
      })
    }, s);
    if (!o.ok) {
      const a = await o.json().catch(() => ({}));
      throw new Error(a.error || `unban failed ${o.status}`);
    }
  };
  Ru = async function(e, t, n, r, s = "") {
    const o = await k(e, `/api/servers/${encodeURIComponent(t)}/moderation/unmute`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userId: n,
        reason: r
      })
    }, s);
    if (!o.ok) {
      const a = await o.json().catch(() => ({}));
      throw new Error(a.error || `unmute failed ${o.status}`);
    }
  };
  Mu = async function(e, t, n = "") {
    const r = await k(e, `/api/servers/${encodeURIComponent(t)}/moderation/bans`, {}, n);
    if (!r.ok) {
      const s = await r.json().catch(() => ({}));
      throw new Error(s.error || `list bans failed ${r.status}`);
    }
    return r.json();
  };
  Uu = async function(e, t, n = "") {
    const r = await k(e, `/api/servers/${encodeURIComponent(t)}/moderation/mutes`, {}, n);
    if (!r.ok) {
      const s = await r.json().catch(() => ({}));
      throw new Error(s.error || `list mutes failed ${r.status}`);
    }
    return r.json();
  };
  ya = async function(e, t, n, r, s = "") {
    const o = await k(e, `/api/servers/${encodeURIComponent(t)}/members/${encodeURIComponent(n)}/level`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        permissionLevel: r
      })
    }, s);
    if (!o.ok) {
      const a = await o.json().catch(() => ({}));
      throw new Error(a.error || `change permission level ${o.status}`);
    }
  };
  async function Lu(e, t, n, r, s = "") {
    const a = {
      member: 0,
      mod: 1,
      admin: 2,
      owner: 3
    }[r] ?? 0;
    return ya(e, t, n, a, s);
  }
  async function Du(e, t, n, r = "") {
    const s = await k(e, `/api/servers/${encodeURIComponent(t)}/moderation/messages/${encodeURIComponent(n)}`, {
      method: "DELETE"
    }, r);
    if (!s.ok) {
      const o = await s.json().catch(() => ({}));
      throw new Error(o.error || `delete message ${s.status}`);
    }
  }
  Gu = async function(e, t, n = {}, r = "") {
    const s = new URLSearchParams();
    n.limit != null && s.set("limit", String(n.limit)), n.offset != null && s.set("offset", String(n.offset)), n.action && s.set("action", n.action), n.actorId && s.set("actor_id", n.actorId), n.targetId && s.set("target_id", n.targetId);
    const o = s.toString(), a = await k(e, `/api/servers/${encodeURIComponent(t)}/moderation/audit-log${o ? "?" + o : ""}`, {}, r);
    if (!a.ok) {
      const i = await a.json().catch(() => ({}));
      throw new Error(i.error || "Failed to load audit log");
    }
    return a.json();
  };
  $u = async function(e, t, n = {}, r = "") {
    const s = new URLSearchParams();
    n.before && s.set("before", n.before), n.limit != null && s.set("limit", String(n.limit));
    const o = s.toString(), a = `/api/servers/${encodeURIComponent(t)}/system-messages${o ? "?" + o : ""}`, i = await k(e, a, {}, r);
    if (!i.ok) throw new Error(`getSystemMessages: ${i.status}`);
    return i.json();
  };
  async function Pu(e, t, n = "") {
    const r = await k(e, `/api/instance/users?q=${encodeURIComponent(t)}`, {}, n);
    if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error || "Search failed");
    return r.json();
  }
  async function Ou(e, t, n, r, s = "") {
    const o = await k(e, "/api/instance/bans", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userId: t,
        reason: n,
        expiresIn: r ?? null
      })
    }, s);
    if (!o.ok) throw new Error((await o.json().catch(() => ({}))).error || "Ban failed");
  }
  async function Ku(e, t, n, r = "") {
    const s = await k(e, "/api/instance/unban", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userId: t,
        reason: n
      })
    }, r);
    if (!s.ok) throw new Error((await s.json().catch(() => ({}))).error || "Unban failed");
  }
  async function Hu(e, t = {}, n = "") {
    const r = new URLSearchParams();
    t.limit != null && r.set("limit", String(t.limit)), t.offset != null && r.set("offset", String(t.offset)), t.action && r.set("action", t.action), t.targetId && r.set("target_id", t.targetId);
    const s = r.toString(), o = await k(e, `/api/instance/audit-log${s ? "?" + s : ""}`, {}, n);
    if (!o.ok) throw new Error((await o.json().catch(() => ({}))).error || "Failed to load audit log");
    return o.json();
  }
  async function Vu(e, t, n = "") {
    const r = await k(e, "/api/instance", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(t)
    }, n);
    if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error || "Config update failed");
  }
  Wu = async function(e, t = "") {
    const n = await k(e, "/api/instance/server-templates", {}, t);
    if (!n.ok) throw new Error((await n.json().catch(() => ({}))).error || "Failed to load templates");
    return n.json();
  };
  async function Fu(e, t, n = "") {
    const r = await k(e, "/api/instance/server-templates", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(t)
    }, n);
    if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error || "Failed to create template");
    return r.json();
  }
  async function Zu(e, t, n, r = "") {
    const s = await k(e, `/api/instance/server-templates/${encodeURIComponent(t)}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(n)
    }, r);
    if (!s.ok) throw new Error((await s.json().catch(() => ({}))).error || "Failed to update template");
  }
  async function zu(e, t, n = "") {
    const r = await k(e, `/api/instance/server-templates/${encodeURIComponent(t)}`, {
      method: "DELETE"
    }, n);
    if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error || "Failed to delete template");
  }
  async function ma(e, t, n, r = {}, s = "") {
    const o = Xe(s);
    await tu(e, t, n, {
      mlsStore: r.mlsStore ?? wl,
      crypto: r.crypto ?? Xl,
      uploadCredential: r.uploadCredential ?? ((a, i) => aa(a, i, o)),
      uploadKeyPackages: r.uploadKeyPackages ?? ((a, i) => ia(a, i, o))
    });
  }
  Yu = async function(e, t, n = "") {
    const r = await k(e, `/api/mls/groups/${encodeURIComponent(t)}/info`, {}, n);
    if (r.status === 404) return null;
    if (!r.ok) {
      const s = await r.json().catch(() => ({}));
      throw new Error(s.error || `getMLSGroupInfo ${r.status}`);
    }
    return r.json();
  };
  Xu = async function(e, t, n, r, s = "") {
    const o = await k(e, `/api/mls/groups/${encodeURIComponent(t)}/info`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        groupInfo: n,
        epoch: r
      })
    }, s);
    if (!o.ok) {
      const a = await o.json().catch(() => ({}));
      throw new Error(a.error || `putMLSGroupInfo ${o.status}`);
    }
  };
  Ju = async function(e, t, n, r, s, o = "") {
    const a = await k(e, `/api/mls/groups/${encodeURIComponent(t)}/commit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        commitBytes: n,
        groupInfo: r,
        epoch: s
      })
    }, o);
    if (!a.ok) {
      const i = await a.json().catch(() => ({}));
      throw new Error(i.error || `postMLSCommit ${a.status}`);
    }
  };
  qu = async function(e, t, n = "") {
    const r = await k(e, `/api/mls/groups/${encodeURIComponent(t)}/info?type=voice`, {}, n);
    if (r.status === 404) return null;
    if (!r.ok) {
      const s = await r.json().catch(() => ({}));
      throw new Error(s.error || `getMLSVoiceGroupInfo ${r.status}`);
    }
    return r.json();
  };
  Qu = async function(e, t, n, r, s = "") {
    const o = await k(e, `/api/mls/groups/${encodeURIComponent(t)}/info?type=voice`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        groupInfo: n,
        epoch: r
      })
    }, s);
    if (!o.ok) {
      const a = await o.json().catch(() => ({}));
      throw new Error(a.error || `putMLSVoiceGroupInfo ${o.status}`);
    }
  };
  ed = async function(e, t, n, r, s, o = "") {
    const a = await k(e, `/api/mls/groups/${encodeURIComponent(t)}/commit?type=voice`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        commitBytes: n,
        groupInfo: s ?? "",
        epoch: r
      })
    }, o);
    if (!a.ok) {
      const i = await a.json().catch(() => ({}));
      throw new Error(i.error || `postMLSVoiceCommit ${a.status}`);
    }
  };
  td = async function(e, t, n, r = 100, s = "") {
    const o = new URLSearchParams({
      since_epoch: String(n),
      limit: String(r)
    }), a = await k(e, `/api/mls/groups/${encodeURIComponent(t)}/commits?${o.toString()}`, {}, s);
    if (!a.ok) {
      const i = await a.json().catch(() => ({}));
      throw new Error(i.error || `getMLSCommitsSinceEpoch ${a.status}`);
    }
    return a.json();
  };
  nd = async function(e, t = "") {
    const n = await k(e, "/api/mls/pending-welcomes", {}, t);
    if (!n.ok) {
      const r = await n.json().catch(() => ({}));
      throw new Error(r.error || `getMLSPendingWelcomes ${n.status}`);
    }
    return n.json();
  };
  rd = async function(e, t, n = "") {
    const r = await k(e, `/api/mls/pending-welcomes/${encodeURIComponent(t)}`, {
      method: "DELETE"
    }, n);
    if (!r.ok && r.status !== 404) {
      const s = await r.json().catch(() => ({}));
      throw new Error(s.error || `deleteMLSPendingWelcome ${r.status}`);
    }
  };
  sd = async function(e, t, n = "") {
    const r = await k(e, `/api/mls/guilds/${encodeURIComponent(t)}/group-info`, {}, n);
    if (r.status === 404) return null;
    if (!r.ok) {
      const s = await r.json().catch(() => ({}));
      throw new Error(s.error || `getGuildMetadataGroupInfo ${r.status}`);
    }
    return r.json();
  };
  od = async function(e, t, n, r, s = "") {
    const o = await k(e, `/api/mls/guilds/${encodeURIComponent(t)}/group-info`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        groupInfo: n,
        epoch: r
      })
    }, s);
    if (!o.ok) {
      const a = await o.json().catch(() => ({}));
      throw new Error(a.error || `putGuildMetadataGroupInfo ${o.status}`);
    }
  };
  ad = async function(e, t, n = "") {
    const r = await k(e, "/api/guilds/dm", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        otherUserId: t
      })
    }, n);
    if (!r.ok) {
      const s = await r.json().catch(() => ({}));
      throw new Error(s.error || `createOrFindDM ${r.status}`);
    }
    return r.json();
  };
  id = async function(e, t = {}, n = "") {
    const r = new URLSearchParams();
    t.category && r.set("category", t.category), t.search && r.set("search", t.search), t.sort && r.set("sort", t.sort), t.page != null && r.set("page", String(t.page)), t.pageSize != null && r.set("pageSize", String(t.pageSize));
    const s = r.toString(), o = await k(e, `/api/guilds/discover${s ? `?${s}` : ""}`, {}, n);
    if (!o.ok) {
      const a = await o.json().catch(() => ({}));
      throw new Error(a.error || `discoverGuilds ${o.status}`);
    }
    return o.json();
  };
  cd = async function(e, t, n = "") {
    const r = await k(e, `/api/guilds/users/search?q=${encodeURIComponent(t)}`, {}, n);
    if (!r.ok) {
      const s = await r.json().catch(() => ({}));
      throw new Error(s.error || `searchUsersForDM ${r.status}`);
    }
    return r.json();
  };
  ld = async function(e, t, n = "") {
    const r = await k(e, `/api/servers/${encodeURIComponent(t)}/join`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    }, n), s = await r.json().catch(() => ({}));
    if (!r.ok && r.status !== 409 && r.status !== 202) throw new Error(s.error || `joinGuildFromExplore ${r.status}`);
    return {
      status: r.status,
      data: s
    };
  };
  ud = Object.freeze(Object.defineProperty({
    __proto__: null,
    banUser: Tu,
    certifyNewDevice: fu,
    changePermissionLevel: ya,
    changeUserRole: Lu,
    checkUsernameAvailable: du,
    claimInvite: ju,
    consumeDeviceLinkResult: mu,
    createDeviceLinkRequest: hu,
    createGuild: pu,
    createGuildChannel: Iu,
    createGuildInvite: Cu,
    createOrFindDM: ad,
    createServerTemplate: Fu,
    deleteGuild: vu,
    deleteGuildChannel: ku,
    deleteMLSPendingWelcome: rd,
    deleteMessage: Du,
    deleteServerTemplate: zu,
    discoverGuilds: id,
    federatedVerify: la,
    fetchWithAuth: k,
    getAuditLog: Gu,
    getChannelMessages: cu,
    getGuildChannels: xu,
    getGuildMembers: Au,
    getGuildMetadataGroupInfo: sd,
    getHandshake: ga,
    getInstance: lu,
    getInstanceAuditLog: Hu,
    getInviteInfo: Eu,
    getKeyPackageCount: ou,
    getMLSCommitsSinceEpoch: td,
    getMLSGroupInfo: Yu,
    getMLSPendingWelcomes: nd,
    getMLSVoiceGroupInfo: qu,
    getMyGuilds: At,
    getPreKeyBundle: au,
    getPreKeyBundleByDevice: iu,
    getSystemMessages: $u,
    instanceBanUser: Ou,
    instanceUnbanUser: Ku,
    joinGuildFromExplore: ld,
    kickUser: _u,
    leaveGuild: bu,
    listBans: Mu,
    listDeviceKeys: fa,
    listMutes: Uu,
    listServerTemplates: Wu,
    moveChannel: Su,
    muteUser: Bu,
    postMLSCommit: Ju,
    postMLSVoiceCommit: ed,
    putGuildMetadataGroupInfo: od,
    putMLSGroupInfo: Xu,
    putMLSVoiceGroupInfo: Qu,
    registerWithPublicKey: da,
    requestChallenge: vn,
    requestGuestSession: ua,
    resolveDeviceLinkRequest: gu,
    revokeDeviceKey: ha,
    searchInstanceUsers: Pu,
    searchUsersForDM: cd,
    unbanUser: Nu,
    unmuteUser: Ru,
    updateGuildMetadata: wu,
    updateInstance: uu,
    updateInstanceConfig: Vu,
    updateServerTemplate: Zu,
    uploadKeyPackagesAfterAuth: ma,
    uploadMLSCredential: aa,
    uploadMLSKeyPackages: ia,
    verifyChallenge: Pr,
    verifyDeviceLinkRequest: yu,
    verifyTransparency: ca
  }, Symbol.toStringTag, {
    value: "Module"
  }));
  function dd(e) {
    try {
      const t = e.split(".");
      if (t.length !== 3) return null;
      const n = t[1].replace(/-/g, "+").replace(/_/g, "/"), r = atob(n.padEnd(n.length + (4 - n.length % 4) % 4, "="));
      return JSON.parse(r);
    } catch {
      return null;
    }
  }
  let fd;
  fd = 5 * 60 * 1e3;
  at = "hush_jwt";
  qt = "hush_home_instance";
  function xn(e) {
    try {
      return `${at}_${new URL(e).host}`;
    } catch {
      return at;
    }
  }
  function hd(e, t) {
    sessionStorage.setItem(xn(e), t);
  }
  function kt() {
    const e = _t();
    if (e) {
      const n = sessionStorage.getItem(xn(e));
      if (n) return n;
    }
    const t = sessionStorage.getItem(at);
    return t && e && (hd(e, t), sessionStorage.removeItem(at)), t;
  }
  const ys = "hush_device_id", oe = "hush_vault_user_", ft = "hush_vault_session_alive", Ze = "hush_vault_derived_key", Ht = "hush_vault_idle_deadline", Fn = "hush_vault_timeout", Qt = "hush_pin_setup_pending", Ln = "hush_pin_attempts_", ms = [
    "mousemove",
    "keydown",
    "touchstart",
    "click"
  ], gd = [
    {
      threshold: 9,
      delayMs: 6e4
    },
    {
      threshold: 7,
      delayMs: 3e4
    },
    {
      threshold: 5,
      delayMs: 5e3
    },
    {
      threshold: 3,
      delayMs: 1e3
    }
  ], ps = 10;
  Ge = function() {
    var _a2;
    let e = localStorage.getItem(ys);
    return e || (e = ((_a2 = crypto.randomUUID) == null ? void 0 : _a2.call(crypto)) ?? `dev_${Date.now()}_${Math.random().toString(36).slice(2)}`, localStorage.setItem(ys, e)), e;
  };
  function et() {
    for (let e = sessionStorage.length - 1; e >= 0; e--) {
      const t = sessionStorage.key(e);
      t && t.startsWith(at) && sessionStorage.removeItem(t);
    }
    sessionStorage.removeItem(ft), sessionStorage.removeItem(Ze), sessionStorage.removeItem(Qt);
  }
  function Vt(e) {
    return btoa(String.fromCharCode(...e));
  }
  function yd(e) {
    for (const { threshold: t, delayMs: n } of gd) if (e >= t) return n;
    return 0;
  }
  function md(e) {
    switch (e) {
      case "browser_close":
      case "refresh":
      case "never":
        return e;
      case "1m":
        return 1;
      case "15m":
        return 15;
      case "30m":
        return 30;
      case "1h":
        return 60;
      case "4h":
        return 240;
      default:
        return null;
    }
  }
  function pd(e) {
    const t = localStorage.getItem(`${Ln}${e}`);
    if (!t) return {
      count: 0,
      lastAttemptAt: null
    };
    try {
      return JSON.parse(t);
    } catch {
      return {
        count: 0,
        lastAttemptAt: null
      };
    }
  }
  function wd(e, t) {
    localStorage.setItem(`${Ln}${e}`, JSON.stringify(t));
  }
  function bd(e) {
    localStorage.removeItem(`${Ln}${e}`);
  }
  function ws() {
    const e = Object.keys(localStorage).find((t) => t.startsWith(oe) && !t.endsWith("_last_user") && localStorage.getItem(t));
    return e ? e.slice(oe.length) : null;
  }
  function vd() {
    var _a2;
    const [e, t] = f.useState(null), [n, r] = f.useState(null), [s, o] = f.useState("none"), [a, i] = f.useState(false), [l, u] = f.useState(true), [h, d] = f.useState(null), [y, g] = f.useState(() => sessionStorage.getItem(Qt) === "1"), [v, p] = f.useState(null), [E, R] = f.useState(false), [D, C] = f.useState(null), M = f.useRef(null), G = f.useRef(null), K = f.useRef(null), W = f.useRef(null), O = f.useRef(null), X = !!(n && e), F = X, Q = s === "unlocked" && !!((_a2 = M.current) == null ? void 0 : _a2.privateKey), se = a || s === "locked" || s === "unlocked" && !E, w = se && !Q, m = se, S = f.useCallback(() => d(null), []), P = f.useCallback((I) => {
      if (g(I), I) {
        sessionStorage.setItem(Qt, "1");
        return;
      }
      sessionStorage.removeItem(Qt);
    }, []), T = f.useCallback(() => P(true), [
      P
    ]), x = f.useCallback(() => P(false), [
      P
    ]), $ = f.useCallback(() => {
      K.current != null && (clearTimeout(K.current), K.current = null), W.current != null && (clearTimeout(W.current), W.current = null);
    }, []), J = f.useCallback((I) => {
      $();
      const j = Date.now(), _ = I - j;
      if (_ <= 0) return;
      const N = _ - fd;
      N > 0 ? K.current = setTimeout(() => {
        window.dispatchEvent(new CustomEvent("hush_guest_expiry_warning", {
          detail: {
            expiresAt: new Date(I).toISOString()
          }
        }));
      }, N) : window.dispatchEvent(new CustomEvent("hush_guest_expiry_warning", {
        detail: {
          expiresAt: new Date(I).toISOString()
        }
      })), W.current = setTimeout(() => {
        if (O.current) try {
          O.current();
        } catch {
        }
        window.dispatchEvent(new CustomEvent("hush_guest_session_expired")), et(), r(null), t(null), o("none"), i(false), R(false), C(null), $(), typeof window < "u" && (window.location.href = "/register");
      }, _);
    }, [
      $
    ]), V = f.useCallback(() => {
      G.current != null && (clearTimeout(G.current), G.current = null);
    }, []), z = f.useCallback(() => {
      Qe.current = null, sessionStorage.removeItem(Ht);
    }, []), ae = f.useCallback((I) => {
      Qe.current = I, sessionStorage.setItem(Ht, String(I));
    }, []), ke = f.useCallback(() => {
      if (typeof Qe.current == "number") return Qe.current;
      const I = sessionStorage.getItem(Ht);
      if (!I) return null;
      const j = Number(I);
      return Number.isFinite(j) ? (Qe.current = j, j) : (sessionStorage.removeItem(Ht), null);
    }, []), Se = f.useCallback(() => {
      M.current = null, sessionStorage.removeItem(Ze), z(), o("locked");
    }, [
      z
    ]), Me = f.useCallback((I) => {
      V();
      const j = Math.max(I - Date.now(), 0);
      if (j === 0) {
        Se();
        return;
      }
      G.current = setTimeout(() => {
        Se();
      }, j);
    }, [
      V,
      Se
    ]), Je = f.useRef(null), qe = f.useRef(null), Ae = f.useRef(null), Qe = f.useRef(null), we = f.useCallback(() => {
      V(), z(), Je.current && (window.removeEventListener("beforeunload", Je.current), Je.current = null), qe.current && (ms.forEach((I) => {
        window.removeEventListener(I, qe.current);
      }), qe.current = null), Ae.current && (document.removeEventListener("visibilitychange", Ae.current), window.removeEventListener("focus", Ae.current), window.removeEventListener("pageshow", Ae.current), Ae.current = null);
    }, [
      z,
      V
    ]), he = f.useCallback((I) => {
      const j = Go(I);
      if ((j == null ? void 0 : j.timeout) !== void 0) return j;
      const _ = md(localStorage.getItem(Fn));
      if (_ == null) return j;
      const N = {
        timeout: _,
        pinType: (j == null ? void 0 : j.pinType) ?? "pin"
      };
      return ds(I, N), localStorage.removeItem(Fn), N;
    }, []), be = f.useCallback((I) => {
      var _a3;
      we();
      const _ = ((_a3 = he(I)) == null ? void 0 : _a3.timeout) ?? "browser_close";
      if (_ === "browser_close") {
        sessionStorage.setItem(ft, "1");
        return;
      }
      if (_ === "refresh") {
        sessionStorage.setItem(ft, "1");
        const N = () => {
          sessionStorage.removeItem(Ze);
        };
        window.addEventListener("beforeunload", N), Je.current = N;
        return;
      }
      if (_ === "never") {
        sessionStorage.setItem(ft, "1");
        return;
      }
      if (typeof _ == "number" && _ > 0) {
        sessionStorage.setItem(ft, "1");
        const N = _ * 60 * 1e3, B = () => {
          if (document.visibilityState === "hidden") return;
          const L = Date.now() + N;
          ae(L), Me(L);
        }, U = () => {
          if (document.visibilityState === "hidden") return;
          const L = ke();
          if (L == null) {
            B();
            return;
          }
          if (Date.now() >= L) {
            Se();
            return;
          }
          Me(L);
        };
        return B(), ms.forEach((L) => window.addEventListener(L, B, {
          passive: true
        })), document.addEventListener("visibilitychange", U), window.addEventListener("focus", U), window.addEventListener("pageshow", U), qe.current = B, Ae.current = U, B;
      }
    }, [
      we,
      he,
      ke,
      Se,
      ae,
      Me
    ]), _e = f.useCallback(async (I, j = "") => {
      const { token: _, user: N } = I;
      if (!_) throw new Error("invalid auth response");
      const B = dd(_);
      if (B == null ? void 0 : B.is_guest) {
        sessionStorage.setItem(j ? xn(j) : at, _), r(_);
        const L = {
          id: B.sub,
          username: B.sub,
          displayName: "Guest",
          role: "guest"
        };
        t(L), R(true), x();
        const H = I.expiresAt ?? (B.exp ? new Date(B.exp * 1e3).toISOString() : null);
        return C(H), H && J(new Date(H).getTime()), {
          token: _,
          user: L
        };
      }
      if (!(N == null ? void 0 : N.id)) throw new Error("invalid auth response");
      const U = Ge();
      return await ma(_, N.id, U, {}, j), sessionStorage.setItem(j ? xn(j) : at, _), r(_), t(N), {
        token: _,
        user: N
      };
    }, [
      J,
      x
    ]), Ce = f.useCallback(async (I, j, _ = "") => {
      const N = Ge(), B = Vt(j), { nonce: U } = await vn(B, _), L = Zn(U), H = await nr(L, I), q = Vt(H), le = await Pr(B, U, q, N, _);
      M.current = {
        privateKey: I,
        publicKey: j
      };
      const { user: ve } = await _e(le, _);
      return localStorage.setItem(`${oe}${ve.id}`, pt(j)), i(true), o("unlocked"), be(ve.id), {
        user: ve
      };
    }, [
      _e,
      be
    ]), ct = f.useCallback(async (I, j, _, N, B = "") => {
      u(true), d(null);
      try {
        const { privateKey: U, publicKey: L } = await cs(_), H = Ge(), q = Vt(L), le = Math.floor(Date.now() / 1e3);
        let ve = null;
        try {
          const { signature: $n } = await $c(U, "register", L, null, le);
          ve = Vt($n);
        } catch ($n) {
          console.warn("[transparency] Failed to sign registration entry:", $n);
        }
        const ge = await da(I, j, q, H, N, B, ve, ve ? le : null);
        M.current = {
          privateKey: U,
          publicKey: L
        };
        const { user: lt } = await _e(ge, B);
        return localStorage.setItem(`${oe}${lt.id}`, pt(L)), i(true), T(), o("unlocked"), localStorage.setItem(qt, B || window.location.origin), be(lt.id), {
          user: lt
        };
      } catch (U) {
        throw d(U), et(), r(null), t(null), o("none"), i(false), U;
      } finally {
        u(false);
      }
    }, [
      _e,
      be,
      T
    ]), Dn = f.useCallback(async (I, j = false, _ = "") => {
      u(true), d(null);
      try {
        const { privateKey: N, publicKey: B } = await cs(I), U = await Ce(N, B, _);
        if (j) {
          const L = kt(), H = Ge(), { listDeviceKeys: q, revokeDeviceKey: le } = await je(async () => {
            const { listDeviceKeys: ge, revokeDeviceKey: lt } = await Promise.resolve().then(() => ud);
            return {
              listDeviceKeys: ge,
              revokeDeviceKey: lt
            };
          }, void 0), ve = await q(L);
          await Promise.allSettled(ve.filter((ge) => ge.deviceId !== H).map((ge) => le(L, ge.deviceId)));
        }
        return T(), localStorage.setItem(qt, _ || window.location.origin), localStorage.setItem("hush_post_recovery_wizard", "1"), U;
      } catch (N) {
        throw d(N), et(), r(null), t(null), o("none"), i(false), N;
      } finally {
        u(false);
      }
    }, [
      Ce,
      T
    ]), Gn = f.useCallback(async (I, j = "") => {
      var _a3;
      u(true), d(null);
      let _ = null;
      try {
        if (!(I == null ? void 0 : I.rootPrivateKey) || !(I == null ? void 0 : I.rootPublicKey)) throw new Error("invalid device link bundle");
        const N = await Ce(I.rootPrivateKey, I.rootPublicKey, j);
        if (((_a3 = N == null ? void 0 : N.user) == null ? void 0 : _a3.id) && (I.historySnapshot && (_ = await Ho(N.user.id, Ge()), await Fo(_, I.historySnapshot)), I.guildMetadataKeySnapshot)) {
          const B = await El(N.user.id, Ge());
          try {
            await jl(B, I.guildMetadataKeySnapshot);
          } finally {
            B.close();
          }
        }
        return i(true), T(), N;
      } catch (N) {
        throw d(N), et(), r(null), t(null), o("none"), i(false), M.current = null, N;
      } finally {
        try {
          _ == null ? void 0 : _.close();
        } catch {
        }
        u(false);
      }
    }, [
      Ce,
      T
    ]), Gt = f.useCallback(async () => {
      u(true), d(null);
      try {
        const I = await ua(), j = await _e(I);
        return o("unlocked"), {
          user: j.user
        };
      } catch (I) {
        throw d(I), r(null), t(null), o("none"), I;
      } finally {
        u(false);
      }
    }, [
      _e
    ]), Ma = f.useCallback(async (I) => {
      const j = (e == null ? void 0 : e.id) ?? localStorage.getItem(`${oe}_last_user`);
      if (!j) throw new Error("no active vault user");
      const _ = pd(j), N = yd(_.count);
      N > 0 && await new Promise((B) => setTimeout(B, N));
      try {
        const B = await St(j), U = await Jt(B);
        if (!U) throw B.close(), new Error("vault is empty");
        const { privateKey: L, rawKeyHex: H } = await Kc(U, I);
        sessionStorage.setItem(Ze, H);
        let q = localStorage.getItem(`${oe}${j}`);
        if (!q) {
          const ge = await Do(B);
          typeof ge == "string" && ge && (q = ge, localStorage.setItem(`${oe}${j}`, q));
        }
        B.close();
        const le = q ? Zn(q) : null;
        if (M.current = {
          privateKey: L,
          publicKey: le
        }, i(true), bd(j), !kt() && le && L) {
          const ge = localStorage.getItem(qt) || "";
          return await Ce(L, le, ge);
        }
        x(), o("unlocked"), be(j);
      } catch {
        const U = _.count + 1;
        if (wd(j, {
          count: U,
          lastAttemptAt: (/* @__PURE__ */ new Date()).toISOString()
        }), U >= ps) {
          await us(j), et(), localStorage.removeItem(`${oe}${j}`), localStorage.removeItem(`${Ln}${j}`), r(null), t(null), o("none"), i(false), M.current = null;
          const H = new Error("vault wiped after too many failed PIN attempts");
          throw H.code = "VAULT_WIPED", H;
        }
        const L = new Error(`incorrect PIN (${ps - U} attempts remaining)`);
        throw L.code = "WRONG_PIN", L;
      }
    }, [
      e,
      be,
      x
    ]), Ua = f.useCallback(() => {
      M.current = null, sessionStorage.removeItem(Ze), we(), o("locked");
    }, [
      we
    ]), La = f.useCallback(async (I) => {
      var _a3;
      if (!((_a3 = M.current) == null ? void 0 : _a3.privateKey)) throw new Error("no identity key in memory - must be unlocked first");
      if (!(e == null ? void 0 : e.id)) throw new Error("no authenticated user");
      const j = await Oc(M.current.privateKey, I), _ = await St(e.id);
      await Vc(_, j);
      const N = localStorage.getItem("hush_vault_salt");
      N && await Wc(_, Nr(N));
      const B = localStorage.getItem(`${oe}${e.id}`);
      B && await Zc(_, B), _.close(), i(true), x();
    }, [
      e,
      x
    ]), Da = f.useCallback(() => {
      x();
    }, [
      x
    ]), Ga = f.useCallback((I) => {
      if (!(e == null ? void 0 : e.id)) return;
      const j = he(e.id);
      ds(e.id, {
        timeout: I,
        pinType: (j == null ? void 0 : j.pinType) ?? "pin"
      }), localStorage.removeItem(Fn), s === "unlocked" && be(e.id);
    }, [
      be,
      he,
      e == null ? void 0 : e.id,
      s
    ]), $a = f.useCallback(async () => {
      u(true);
      const I = kt(), j = e == null ? void 0 : e.id;
      if (I) try {
        await k(I, "/api/auth/logout", {
          method: "POST"
        });
      } catch {
      }
      try {
        const B = new BroadcastChannel("hush_auth");
        B.postMessage({
          type: "hush_logout"
        }), B.close();
      } catch {
      }
      const _ = Ge(), N = [];
      if (j && N.push(us(j).catch(() => {
      }), new Promise((B) => {
        const U = indexedDB.deleteDatabase(`hush-mls-${j}-${_}`);
        U.onsuccess = U.onerror = U.onblocked = () => B();
      })), await Promise.allSettled(N), localStorage.clear(), sessionStorage.clear(), "serviceWorker" in navigator) try {
        const B = await navigator.serviceWorker.getRegistrations();
        await Promise.allSettled(B.map((U) => U.unregister()));
      } catch {
      }
      if ("caches" in window) try {
        const B = await caches.keys();
        await Promise.allSettled(B.map((U) => caches.delete(U)));
      } catch {
      }
      M.current = null, we(), $(), r(null), t(null), o("none"), i(false), g(false), R(false), C(null), d(null), u(false);
    }, [
      e,
      $,
      we
    ]);
    return f.useEffect(() => {
      const I = kt(), j = sessionStorage.getItem(ft) === "1";
      if (!I) {
        x();
        const N = ws();
        if (N) {
          localStorage.setItem(`${oe}_last_user`, N);
          let L = false;
          return (async () => {
            try {
              const H = await ls(N);
              if (L) return;
              H.exists ? (i(true), o("locked")) : (localStorage.removeItem(`${oe}${N}`), i(false), o("none"));
            } catch {
              L || (i(true), o("locked"));
            }
            L || u(false);
          })(), () => {
            L = true;
          };
        }
        const B = localStorage.getItem(`${oe}_last_user`);
        let U = false;
        return (async () => {
          var _a3;
          try {
            const L = B ? [
              B
            ] : [];
            if (!L.length && typeof indexedDB.databases == "function") {
              const H = await indexedDB.databases();
              for (const q of H) {
                const le = (_a3 = q.name) == null ? void 0 : _a3.match(/^hush-vault-(.+)$/);
                le && L.push(le[1]);
              }
            }
            if (U) return;
            for (const H of L) {
              const q = await ls(H);
              if (U) return;
              if (q.exists) {
                q.publicKeyHex && localStorage.setItem(`${oe}${H}`, q.publicKeyHex), localStorage.setItem(`${oe}_last_user`, H), i(true), o("locked"), u(false);
                return;
              }
            }
          } catch {
          }
          U || (u(false), i(false), o("none"));
        })(), () => {
          U = true;
        };
      }
      let _ = false;
      return (async () => {
        try {
          const N = await k(I, "/api/auth/me");
          if (_) return;
          if (N.status === 401) {
            et(), r(null), t(null), i(false), o("none"), g(false);
            return;
          }
          if (!N.ok) r(I);
          else {
            const B = await N.json();
            if (_) return;
            r(I), t(B);
            const U = localStorage.getItem(`${oe}${B.id}`);
            if (U) {
              i(true);
              const L = sessionStorage.getItem(Ze);
              if (j && L) try {
                const H = await St(B.id), q = await Jt(H);
                if (H.close(), q && !_) {
                  const le = await Hc(q, L);
                  if (_) return;
                  const ve = U ? Zn(U) : null;
                  M.current = {
                    privateKey: le,
                    publicKey: ve
                  }, x(), o("unlocked"), be(B.id);
                } else _ || (sessionStorage.removeItem(Ze), localStorage.removeItem(`${oe}${B.id}`), i(false), o("unlocked"));
              } catch {
                _ || (sessionStorage.removeItem(Ze), x(), o("locked"));
              }
              else try {
                const H = await St(B.id), q = await Jt(H);
                if (H.close(), _) return;
                q ? (x(), o("locked")) : (localStorage.removeItem(`${oe}${B.id}`), i(false), o("unlocked"));
              } catch {
                _ || (i(true), x(), o("locked"));
              }
            } else i(false), o("unlocked");
          }
        } catch {
          r(I), i(!!ws()), o("locked");
        } finally {
          _ || u(false);
        }
      })(), () => {
        _ = true;
      };
    }, [
      x
    ]), f.useEffect(() => {
      var _a3;
      ((_a3 = navigator.storage) == null ? void 0 : _a3.persist) && navigator.storage.persist().catch(() => {
      });
    }, []), f.useEffect(() => {
      const I = async () => {
        if (document.visibilityState !== "visible") return;
        const j = kt();
        if (j) try {
          (await k(j, "/api/auth/me")).status === 401 && (et(), window.location.href = "/");
        } catch {
        }
      };
      return document.addEventListener("visibilitychange", I), () => document.removeEventListener("visibilitychange", I);
    }, []), f.useEffect(() => {
      s !== "unlocked" && we();
    }, [
      s,
      we
    ]), f.useEffect(() => () => {
      $();
    }, [
      $
    ]), f.useEffect(() => {
      let I;
      try {
        I = new BroadcastChannel("hush_auth"), I.onmessage = (j) => {
          var _a3;
          ((_a3 = j.data) == null ? void 0 : _a3.type) === "hush_logout" && (M.current = null, we(), r(null), t(null), o("none"), i(false), x());
        };
      } catch {
      }
      return () => {
        try {
          I == null ? void 0 : I.close();
        } catch {
        }
      };
    }, [
      x,
      we
    ]), {
      user: e,
      token: n,
      vaultState: s,
      hasVault: se,
      hasSession: X,
      isVaultUnlocked: Q,
      needsUnlock: w,
      isKnownBrowserProfile: m,
      isAuthenticated: F,
      loading: l,
      error: h,
      needsPinSetup: y,
      performChallengeResponse: Ce,
      performRegister: ct,
      performRecovery: Dn,
      completeDeviceLink: Gn,
      performGuestAuth: Gt,
      unlockVault: Ma,
      lockVault: Ua,
      setPIN: La,
      updateVaultTimeout: Ga,
      skipPinSetup: Da,
      performLogout: $a,
      clearError: S,
      identityKeyRef: M,
      transparencyError: v,
      setTransparencyError: p,
      isGuest: E,
      guestExpiresAt: D,
      voiceDisconnectRef: O,
      isLoading: l
    };
  }
  function Zn(e) {
    const t = new Uint8Array(e.length / 2);
    for (let n = 0; n < e.length; n += 2) t[n / 2] = parseInt(e.slice(n, n + 2), 16);
    return t;
  }
  const pa = f.createContext(null);
  function wa({ children: e }) {
    const t = vd();
    return c.jsx(pa.Provider, {
      value: t,
      children: e
    });
  }
  It = function() {
    const e = f.useContext(pa);
    if (!e) throw new Error("useAuth must be used within AuthProvider");
    return e;
  };
  let xd, Id, kd, Sd, Ad, Cd;
  hh = Object.freeze(Object.defineProperty({
    __proto__: null,
    AuthProvider: wa,
    useAuth: It
  }, Symbol.toStringTag, {
    value: "Module"
  }));
  xd = "/ws";
  Id = 1e3;
  kd = 3e4;
  Sd = 2;
  Ad = 2;
  Cd = 15e3;
  bs = function(e) {
    const t = e.getToken, n = e.onReconnected ?? null;
    let r = e.url;
    if (!r && typeof location < "u" && (r = `${location.origin.replace(/^http/, "ws")}${xd}`), !r) throw new Error("ws url required (or use in browser for default)");
    let s = null, o = null, a = 0;
    const i = /* @__PURE__ */ new Map();
    let l = false, u = false, h = false, d = 0, y = Date.now(), g = false;
    function v(x, $) {
      const J = i.get(x);
      J && J.forEach((z) => {
        try {
          z($);
        } catch (ae) {
          console.error("[ws] listener error", x, ae);
        }
      });
      const V = i.get("*");
      V && V.forEach((z) => {
        try {
          z({
            type: x,
            ...$
          });
        } catch (ae) {
          console.error("[ws] listener error *", ae);
        }
      });
    }
    function p() {
      if (o) return;
      u = true, v("reconnecting", {});
      const x = Math.min(Id * Math.pow(Sd, a), kd);
      a += 1, o = setTimeout(() => {
        o = null, E();
      }, x);
    }
    function E() {
      if (h = false, s && (s.readyState === 1 || s.readyState === 0)) return;
      y = Date.now();
      const x = t(), $ = x ? `${r}?token=${encodeURIComponent(x)}` : r, J = new WebSocket($);
      s = J, l = !!x;
      const V = a > 0 || u;
      J.onopen = async () => {
        if (a = 0, !l && t() && (l = true, J.send(JSON.stringify({
          type: "auth",
          token: t()
        }))), O(), v("open", {
          isReconnect: V
        }), V) {
          if (n) try {
            await n();
          } catch (z) {
            console.error("[ws] onReconnected hook error", z);
          }
          u = false, v("reconnected", {});
        }
      }, J.onmessage = (z) => {
        try {
          const ae = JSON.parse(z.data), ke = ae.type;
          if (ke === "pong") {
            d = 0, y = Date.now(), K > 0 && (M = Math.round(performance.now() - K), K = 0, v("rtt", {
              rtt: M
            }));
            return;
          }
          ke && v(ke, ae);
        } catch {
        }
      }, J.onclose = () => {
        s = null, l = false, w(), v("close", {}), p();
      }, J.onerror = () => {
        v("error", {});
      }, Q();
    }
    function R() {
      if (h = true, se(), w(), o && (clearTimeout(o), o = null), a = 0, u = false, s) {
        const x = s;
        s = null, x.onmessage = null, x.onclose = null, x.onerror = null, x.readyState === 0 ? x.onopen = () => x.close() : (x.onopen = null, x.close());
      }
      l = false;
    }
    function D() {
      return s !== null && s.readyState === 1;
    }
    function C() {
      return u;
    }
    let M = null, G = null, K = 0;
    const W = 1e4;
    function O() {
      w(), d = 0, G = setInterval(() => {
        if (D()) {
          if (d += 1, d >= Ad) {
            console.warn("[ws] missed", d, "pongs - forcing reconnect"), s.close();
            return;
          }
          K = performance.now(), s.send(JSON.stringify({
            type: "ping"
          }));
        }
      }, W);
    }
    function X() {
      if (!h) {
        if (console.log("[ws] network online - forcing reconnect"), s && (s.readyState === 1 || s.readyState === 0)) {
          s.close();
          return;
        }
        !s && !u && p();
      }
    }
    function F() {
      typeof document > "u" || document.visibilityState !== "visible" || h || Date.now() - y > Cd && (console.log("[ws] tab visible with stale connection - forcing reconnect"), s && (s.readyState === 1 || s.readyState === 0) ? s.close() : !s && !u && p());
    }
    function Q() {
      g || (typeof window < "u" && window.addEventListener("online", X), typeof document < "u" && document.addEventListener("visibilitychange", F), g = true);
    }
    function se() {
      g && (typeof window < "u" && window.removeEventListener("online", X), typeof document < "u" && document.removeEventListener("visibilitychange", F), g = false);
    }
    function w() {
      G && (clearInterval(G), G = null), M = null;
    }
    function m() {
      return M;
    }
    function S(x, $ = {}) {
      D() && s.send(JSON.stringify({
        type: x,
        ...$
      }));
    }
    function P(x, $) {
      i.has(x) || i.set(x, /* @__PURE__ */ new Set()), i.get(x).add($);
    }
    function T(x, $) {
      const J = i.get(x);
      J && J.delete($);
    }
    return {
      connect: E,
      disconnect: R,
      send: S,
      isConnected: D,
      isReconnecting: C,
      getRtt: m,
      on: P,
      off: T
    };
  };
  const Ed = "hush-instances", jd = 1, Rt = "instances", In = "guild-order", ba = "order";
  function va(e, t, n, r) {
    return new Promise((s, o) => {
      const i = e.transaction(t, "readwrite").objectStore(t), l = r !== void 0 ? i.put(n, r) : i.put(n);
      l.onsuccess = () => s(), l.onerror = () => o(l.error);
    });
  }
  function _d(e, t, n) {
    return new Promise((r, s) => {
      const i = e.transaction(t, "readonly").objectStore(t).get(n);
      i.onsuccess = () => r(i.result ?? null), i.onerror = () => s(i.error);
    });
  }
  function Td(e, t) {
    return new Promise((n, r) => {
      const a = e.transaction(t, "readonly").objectStore(t).getAll();
      a.onsuccess = () => n(a.result ?? []), a.onerror = () => r(a.error);
    });
  }
  function Bd(e, t, n) {
    return new Promise((r, s) => {
      const i = e.transaction(t, "readwrite").objectStore(t).delete(n);
      i.onsuccess = () => r(), i.onerror = () => s(i.error);
    });
  }
  function vs(e = Ed) {
    return new Promise((t, n) => {
      const r = indexedDB.open(e, jd);
      r.onerror = () => n(r.error), r.onsuccess = () => t(r.result), r.onupgradeneeded = (s) => {
        const o = s.target.result;
        o.objectStoreNames.contains(Rt) || o.createObjectStore(Rt, {
          keyPath: "instanceUrl"
        }), o.objectStoreNames.contains(In) || o.createObjectStore(In);
      };
    });
  }
  function xs(e, t) {
    return va(e, Rt, t);
  }
  function Nd(e) {
    return Td(e, Rt);
  }
  function Rd(e, t) {
    return Bd(e, Rt, t);
  }
  function Md(e, t) {
    return va(e, In, {
      guildIds: t
    }, ba);
  }
  async function Ud(e) {
    var _a2;
    return ((_a2 = await _d(e, In, ba)) == null ? void 0 : _a2.guildIds) ?? [];
  }
  const Ld = 1e3, Dd = 6e4, Gd = 2;
  function zn(e) {
    return btoa(String.fromCharCode(...e));
  }
  function Is(e) {
    const t = new Uint8Array(e.length / 2);
    for (let n = 0; n < e.length; n += 2) t[n / 2] = parseInt(e.slice(n, n + 2), 16);
    return t;
  }
  function ks(e) {
    return e.replace(/^http/, "ws") + "/ws";
  }
  function $d() {
    const { identityKeyRef: e, user: t, vaultState: n, loading: r } = It(), s = f.useRef(/* @__PURE__ */ new Map()), [o, a] = f.useState(/* @__PURE__ */ new Map()), [i, l] = f.useState(false), [u, h] = f.useState([]), d = f.useRef(null), y = f.useRef(0), g = (w, m) => w.map((S) => {
      const P = {
        ...S,
        instanceUrl: m
      };
      if (!P.name && P.encryptedMetadata) try {
        const T = new TextDecoder().decode(Uint8Array.from(atob(P.encryptedMetadata), ($) => $.charCodeAt(0))), x = JSON.parse(T);
        P.name = x.n || x.name || "";
      } catch {
      }
      return P;
    }), v = (w, m, S) => {
      const P = new Map((w ?? []).map((T) => [
        T.id,
        T
      ]));
      return g(m, S).map((T) => {
        const x = P.get(T.id);
        return (x == null ? void 0 : x._localName) ? {
          ...T,
          _localName: x._localName
        } : T;
      });
    }, p = f.useCallback(() => {
      const w = /* @__PURE__ */ new Map();
      for (const [m, S] of s.current) w.set(m, {
        connectionState: S.connectionState,
        jwt: S.jwt,
        userId: S.userId,
        guilds: S.guilds,
        handshakeData: S.handshakeData
      });
      a(w);
    }, []), E = f.useCallback(async (w) => {
      h(w), d.current && await Md(d.current, w).catch((m) => {
        console.error("[useInstances] saveGuildOrder failed:", m);
      });
    }, []), R = f.useMemo(() => {
      const w = [];
      for (const m of s.current.values()) m.guilds && w.push(...m.guilds.filter((S) => S.isDm));
      return w;
    }, [
      o
    ]), D = f.useMemo(() => {
      const w = [];
      for (const T of s.current.values()) T.guilds && w.push(...T.guilds.filter((x) => !x.isDm));
      if (u.length === 0) return w;
      const m = new Map(u.map((T, x) => [
        T,
        x
      ])), S = [], P = [];
      for (const T of w) m.has(T.id) ? S.push(T) : P.push(T);
      return S.sort((T, x) => (m.get(T.id) ?? 0) - (m.get(x.id) ?? 0)), [
        ...S,
        ...P
      ];
    }, [
      o,
      u
    ]), C = f.useCallback((w) => {
      const m = s.current.get(w);
      if (!m) return;
      m.reconnectTimer && clearTimeout(m.reconnectTimer);
      const S = m.reconnectAttempt ?? 0, P = Math.min(Ld * Math.pow(Gd, S), Dd);
      m.connectionState = "reconnecting", m.reconnectAttempt = S + 1, m.reconnectTimer = setTimeout(() => {
        m.reconnectTimer = null, G(w).catch(() => {
        });
      }, P), p();
    }, [
      p
    ]), M = f.useCallback((w, m) => {
      m.on("close", () => {
        s.current.get(w) && C(w);
      });
      const S = async () => {
        const T = s.current.get(w);
        if (T == null ? void 0 : T.jwt) try {
          const x = await At(T.jwt, w);
          T.guilds = v(T.guilds, x, w), p();
        } catch (x) {
          console.error(`[useInstances] guild refresh failed for ${w}:`, x);
        }
      };
      m.on("server_updated", S), m.on("server_deleted", S), m.on("member_joined", S);
      const P = async () => {
        await S();
        const T = s.current.get(w);
        T && (!T.guilds || T.guilds.length === 0) && K(w).catch((x) => {
          console.warn(`[useInstances] auto-disconnect failed for ${w}:`, x);
        });
      };
      m.on("member_left", P);
    }, [
      C,
      p
    ]), G = f.useCallback(async (w, m = y.current) => {
      var _a2;
      const S = () => m === y.current;
      if (!S()) return;
      const P = e == null ? void 0 : e.current;
      if (!P) throw new Error("bootInstance: no identity key available - vault must be unlocked");
      const T = s.current.get(w) ?? {};
      s.current.set(w, {
        ...T,
        connectionState: "connecting",
        reconnectAttempt: T.reconnectAttempt ?? 0,
        reconnectTimer: T.reconnectTimer ?? null,
        guilds: T.guilds ?? []
      }), p();
      try {
        const x = await ga(w);
        if (!S()) return;
        const { privateKey: $, publicKey: J } = P, V = zn(J), z = Ge(), ae = (t == null ? void 0 : t.username) ?? "user", ke = (t == null ? void 0 : t.displayName) ?? ae;
        let Se, Me;
        try {
          const { nonce: he } = await vn(V, w), be = Is(he), _e = await nr(be, $), Ce = zn(_e), ct = await Pr(V, he, Ce, z, w);
          if (!S()) return;
          Se = ct.token, Me = ct.user;
        } catch (he) {
          if (!((he == null ? void 0 : he.status) === 404 || ((_a2 = he == null ? void 0 : he.response) == null ? void 0 : _a2.status) === 404 || typeof (he == null ? void 0 : he.message) == "string" && he.message.includes("unknown public key"))) throw he;
          const _e = _t(), { nonce: Ce } = await vn(V, w), ct = Is(Ce), Dn = await nr(ct, $), Gn = zn(Dn), Gt = await la(V, Ce, Gn, _e, ae, ke, w);
          if (!S()) return;
          Se = Gt.token, Me = Gt.federatedIdentity;
        }
        const Je = d.current;
        if (Je && await xs(Je, {
          instanceUrl: w,
          jwt: Se,
          userId: Me == null ? void 0 : Me.id,
          username: Me == null ? void 0 : Me.username,
          connectionState: "connected",
          lastSeen: Date.now()
        }), !S()) return;
        const qe = s.current.get(w);
        if (qe == null ? void 0 : qe.wsClient) try {
          qe.wsClient.disconnect();
        } catch {
        }
        const Ae = bs({
          url: ks(w),
          getToken: () => {
            var _a3;
            return ((_a3 = s.current.get(w)) == null ? void 0 : _a3.jwt) ?? null;
          }
        });
        M(w, Ae), Ae.connect();
        const Qe = await At(Se, w);
        if (!S()) {
          try {
            Ae.disconnect();
          } catch {
          }
          return;
        }
        const we = g(Qe, w);
        s.current.set(w, {
          wsClient: Ae,
          jwt: Se,
          userId: Me == null ? void 0 : Me.id,
          handshakeData: x,
          guilds: we,
          connectionState: "connected",
          reconnectAttempt: 0,
          reconnectTimer: null
        }), p();
      } catch (x) {
        if (!S()) return;
        const $ = s.current.get(w);
        throw $ && ($.connectionState = "offline", p()), console.error(`[useInstances] bootInstance failed for ${w}:`, x), x;
      }
    }, [
      e,
      t,
      p,
      M
    ]), K = f.useCallback(async (w) => {
      var _a2;
      const m = s.current.get(w);
      if (!m) return;
      m.reconnectTimer && clearTimeout(m.reconnectTimer);
      try {
        (_a2 = m.wsClient) == null ? void 0 : _a2.disconnect();
      } catch {
      }
      const S = d.current;
      S && await Rd(S, w).catch((P) => {
        console.error("[useInstances] removeInstance failed:", P);
      }), s.current.delete(w), p();
    }, [
      p
    ]), W = f.useCallback(async (w) => {
      const m = s.current.get(w);
      if (m == null ? void 0 : m.jwt) try {
        const S = await At(m.jwt, w);
        m.guilds = v(m.guilds, S, w), p();
      } catch (S) {
        throw console.error(`[useInstances] refreshGuilds failed for ${w}:`, S), S;
      }
    }, [
      p
    ]), O = f.useCallback(async (w, m, S = y.current) => {
      const P = () => S === y.current;
      if (!P()) return;
      const T = _t();
      try {
        const V = d.current ?? await vs();
        d.current || (d.current = V), await xs(V, {
          instanceUrl: T,
          jwt: w,
          userId: m == null ? void 0 : m.id,
          username: m == null ? void 0 : m.username,
          connectionState: "connected",
          lastSeen: Date.now()
        });
      } catch (V) {
        console.warn("[useInstances] registerLocalInstance IDB save failed:", V);
      }
      if (!P()) return;
      const x = s.current.get(T);
      if (x == null ? void 0 : x.wsClient) try {
        x.wsClient.disconnect();
      } catch {
      }
      const $ = bs({
        url: ks(T),
        getToken: () => {
          var _a2;
          return ((_a2 = s.current.get(T)) == null ? void 0 : _a2.jwt) ?? null;
        }
      });
      M(T, $), $.connect();
      let J = [];
      try {
        const V = await At(w, T);
        if (!P()) {
          try {
            $.disconnect();
          } catch {
          }
          return;
        }
        J = g(V, T);
      } catch {
      }
      if (!P()) {
        try {
          $.disconnect();
        } catch {
        }
        return;
      }
      s.current.set(T, {
        wsClient: $,
        jwt: w,
        userId: m == null ? void 0 : m.id,
        handshakeData: null,
        guilds: J,
        connectionState: "connected",
        reconnectAttempt: 0,
        reconnectTimer: null
      }), p();
    }, [
      p,
      M
    ]), X = f.useCallback((w) => {
      var _a2;
      return ((_a2 = s.current.get(w)) == null ? void 0 : _a2.wsClient) ?? null;
    }, []), F = f.useCallback((w) => {
      var _a2;
      return ((_a2 = s.current.get(w)) == null ? void 0 : _a2.jwt) ?? null;
    }, []), Q = f.useCallback(() => {
      var _a2;
      for (const w of s.current.values()) {
        w.reconnectTimer && clearTimeout(w.reconnectTimer);
        try {
          (_a2 = w.wsClient) == null ? void 0 : _a2.disconnect();
        } catch {
        }
      }
    }, []), se = f.useCallback(() => {
      Q(), s.current = /* @__PURE__ */ new Map(), p(), l(false);
    }, [
      Q,
      p
    ]);
    return f.useEffect(() => {
      let w = false;
      y.current += 1;
      const m = y.current;
      return r ? (se(), () => {
      }) : n !== "unlocked" || !(t == null ? void 0 : t.id) ? (se(), () => {
      }) : (se(), (async () => {
        try {
          const S = d.current ?? await vs();
          if (w) return;
          d.current = S;
          const [P, T] = await Promise.all([
            Nd(S),
            Ud(S)
          ]);
          if (w) return;
          h(T);
          const x = _t(), $ = sessionStorage.getItem(`hush_jwt_${new URL(x).host}`) || sessionStorage.getItem("hush_jwt"), J = new Set(P.map(({ instanceUrl: z }) => z)), V = P.map(({ instanceUrl: z }) => ({
            type: "stored",
            instanceUrl: z
          }));
          if ($ && !J.has(x) && V.push({
            type: "local",
            instanceUrl: x
          }), V.length === 0) {
            p();
            return;
          }
          if (await Promise.allSettled(V.map((z) => z.type === "local" ? O($, {
            id: t.id,
            username: t.username
          }, m) : G(z.instanceUrl, m))), $ && !w) {
            const z = s.current.get(x);
            if (!z || z.connectionState === "offline") try {
              const ae = await k($, "/api/auth/me");
              if (ae.ok) {
                const ke = await ae.json();
                w || await O($, {
                  id: ke.id,
                  username: ke.username
                }, m);
              }
            } catch {
            }
          }
        } catch (S) {
          console.error("[useInstances] boot failed:", S);
        } finally {
          w || l(true);
        }
      })(), () => {
        w = true, y.current += 1, Q();
      });
    }, [
      n,
      r,
      t == null ? void 0 : t.id,
      t == null ? void 0 : t.username,
      G,
      O,
      se,
      Q
    ]), {
      instanceStates: o,
      mergedGuilds: D,
      guildsLoaded: i,
      dmGuilds: R,
      bootInstance: G,
      registerLocalInstance: O,
      disconnectInstance: K,
      getWsClient: X,
      getTokenForInstance: F,
      guildOrder: u,
      setGuildOrder: E,
      refreshGuilds: W
    };
  }
  Or = f.createContext(null);
  function Pd({ children: e }) {
    const t = $d();
    return c.jsx(Or.Provider, {
      value: t,
      children: e
    });
  }
  xa = function() {
    const e = f.useContext(Or);
    if (!e) throw new Error("useInstanceContext must be used within InstanceProvider");
    return e;
  };
  const Ia = f.createContext(null);
  function Od({ children: e }) {
    const { loading: t, needsUnlock: n, hasSession: r, needsPinSetup: s, user: o } = It(), { guildsLoaded: a, mergedGuilds: i } = xa(), l = f.useMemo(() => t ? "loading" : n ? "needs_pin" : r ? s ? "pin_setup" : a ? "booted" : "ready" : "needs_login", [
      t,
      n,
      r,
      s,
      a
    ]), u = f.useMemo(() => ({
      bootState: l,
      user: o,
      mergedGuilds: i,
      guildsLoaded: a
    }), [
      l,
      o,
      i,
      a
    ]);
    return c.jsx(Ia.Provider, {
      value: u,
      children: e
    });
  }
  function Kd() {
    const e = f.useContext(Ia);
    if (!e) throw new Error("useBootController must be used within BootProvider");
    return e;
  }
  function Hd() {
    return c.jsx("div", {
      "aria-hidden": true,
      style: {
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 9,
        opacity: 0.018,
        mixBlendMode: "overlay"
      },
      children: c.jsxs("svg", {
        width: "100%",
        height: "100%",
        xmlns: "http://www.w3.org/2000/svg",
        children: [
          c.jsx("filter", {
            id: "hush-app-grain",
            children: c.jsx("feTurbulence", {
              type: "fractalNoise",
              baseFrequency: "0.72",
              numOctaves: "4",
              stitchTiles: "stitch"
            })
          }),
          c.jsx("rect", {
            width: "100%",
            height: "100%",
            filter: "url(#hush-app-grain)"
          })
        ]
      })
    });
  }
  const Ss = "hush_selectedMic", As = "hush_selectedWebcam";
  Vd = function() {
    const [e, t] = f.useState([]), [n, r] = f.useState([]), [s, o] = f.useState(() => localStorage.getItem(Ss) || null), [a, i] = f.useState(() => localStorage.getItem(As) || null), l = f.useCallback(async () => {
      try {
        const y = await navigator.mediaDevices.enumerateDevices();
        t(y.filter((g) => g.kind === "audioinput")), r(y.filter((g) => g.kind === "videoinput"));
      } catch (y) {
        console.error("[devices] Enumeration failed:", y);
      }
    }, []);
    f.useEffect(() => (l(), navigator.mediaDevices.addEventListener("devicechange", l), () => {
      navigator.mediaDevices.removeEventListener("devicechange", l);
    }), [
      l
    ]);
    const u = f.useCallback((y) => {
      o(y), localStorage.setItem(Ss, y);
    }, []), h = f.useCallback((y) => {
      i(y), localStorage.setItem(As, y);
    }, []), d = f.useCallback(async (y) => {
      try {
        const g = y === "audio" ? {
          audio: true
        } : {
          video: true
        };
        (await navigator.mediaDevices.getUserMedia(g)).getTracks().forEach((p) => p.stop()), await l();
      } catch (g) {
        console.error(`[devices] Permission request failed (${y}):`, g);
      }
    }, [
      l
    ]);
    return {
      audioDevices: e,
      videoDevices: n,
      selectedMicId: s,
      selectedWebcamId: a,
      selectMic: u,
      selectWebcam: h,
      hasSavedMic: s !== null,
      hasSavedWebcam: a !== null,
      requestPermission: d,
      refreshDevices: l
    };
  };
  const Wd = 640, Fd = 1024;
  function Cs() {
    const e = window.innerWidth;
    return e < Wd ? "mobile" : e < Fd ? "tablet" : "desktop";
  }
  Zd = function() {
    const [e, t] = f.useState(Cs);
    return f.useEffect(() => {
      const n = () => t(Cs());
      return window.addEventListener("resize", n), () => window.removeEventListener("resize", n);
    }, []), e;
  };
  let ka, Sa, Ca, Ea, zd, kn;
  ka = "hush_mic_noise_gate_enabled";
  Sa = "hush_mic_noise_gate_threshold_db";
  Aa = new URL("data:text/javascript;base64,LyoqCiAqIE5vaXNlIEdhdGUgQXVkaW9Xb3JrbGV0IFByb2Nlc3NvcgogKgogKiBJbXBsZW1lbnRzIGEgbm9pc2UgZ2F0ZSBpbiB0aGUgYXVkaW8gcmVuZGVyaW5nIHRocmVhZCwgc2VwYXJhdGUgZnJvbQogKiB0aGUgbWFpbiB0aHJlYWQuIFRoaXMgcHJldmVudHMgdGhlIGdhdGUgbW9uaXRvcmluZyBsb29wIGZyb20gaW50ZXJmZXJpbmcKICogd2l0aCB2aWRlbyByZW5kZXJpbmcgYW5kIFVJIHJlc3BvbnNpdmVuZXNzLgogKgogKiBGZWF0dXJlczoKICogLSBSTVMtYmFzZWQgbGV2ZWwgZGV0ZWN0aW9uCiAqIC0gU21vb3RoIGF0dGFjay9yZWxlYXNlICgxMG1zIGF0dGFjaywgNTBtcyByZWxlYXNlKQogKiAtIEhvbGQgdGltZSB0byBwcmV2ZW50IGZsdXR0ZXIgKDE1MG1zKQogKiAtIExldmVsIHJlcG9ydGluZyBmb3IgVUkgbWV0ZXIgKHRocm90dGxlZCB0byB+NjBtcykKICovCgpjbGFzcyBOb2lzZUdhdGVQcm9jZXNzb3IgZXh0ZW5kcyBBdWRpb1dvcmtsZXRQcm9jZXNzb3IgewogIGNvbnN0cnVjdG9yKCkgewogICAgc3VwZXIoKTsKCiAgICAvLyBHYXRlIHN0YXRlCiAgICB0aGlzLmdhdGVPcGVuID0gZmFsc2U7CiAgICB0aGlzLmhvbGRUaW1lUmVtYWluaW5nID0gMDsKICAgIHRoaXMuZW5hYmxlZCA9IHRydWU7CiAgICB0aGlzLnRocmVzaG9sZERiID0gLTcwOwoKICAgIC8vIFNtb290aGluZyBjb2VmZmljaWVudHMgKGNhbGN1bGF0ZWQgcGVyLXNhbXBsZSkKICAgIHRoaXMuYXR0YWNrQ29lZiA9IDA7CiAgICB0aGlzLnJlbGVhc2VDb2VmID0gMDsKICAgIHRoaXMuY3VycmVudEdhaW4gPSAwOwoKICAgIC8vIExldmVsIHJlcG9ydGluZyAodGhyb3R0bGVkKQogICAgdGhpcy5mcmFtZUNvdW50ID0gMDsKICAgIHRoaXMucmVwb3J0SW50ZXJ2YWwgPSAxMjg7IC8vIFJlcG9ydCBldmVyeSAxMjggZnJhbWVzICh+Mi42N21zIGF0IDQ4a0h6KQoKICAgIC8vIENhbGN1bGF0ZSBzbW9vdGhpbmcgY29lZmZpY2llbnRzIGZvciA0OGtIeiBzYW1wbGUgcmF0ZQogICAgLy8gYXR0YWNrID0gMTBtcywgcmVsZWFzZSA9IDUwbXMKICAgIHRoaXMudXBkYXRlQ29lZmZpY2llbnRzKDQ4MDAwKTsKCiAgICAvLyBIb2xkIHRpbWUgaW4gc2FtcGxlcyAoMTUwbXMgYXQgNDhrSHopCiAgICB0aGlzLmhvbGRUaW1lU2FtcGxlcyA9IE1hdGguZmxvb3IoMC4xNSAqIDQ4MDAwKTsKCiAgICAvLyBMaXN0ZW4gZm9yIHBhcmFtZXRlciB1cGRhdGVzIGZyb20gbWFpbiB0aHJlYWQKICAgIHRoaXMucG9ydC5vbm1lc3NhZ2UgPSAoZXZlbnQpID0+IHsKICAgICAgY29uc3QgeyB0eXBlLCBlbmFibGVkLCB0aHJlc2hvbGQgfSA9IGV2ZW50LmRhdGE7CgogICAgICBpZiAodHlwZSA9PT0gJ3VwZGF0ZVBhcmFtcycpIHsKICAgICAgICBpZiAoZW5hYmxlZCAhPT0gdW5kZWZpbmVkKSB7CiAgICAgICAgICB0aGlzLmVuYWJsZWQgPSBlbmFibGVkOwogICAgICAgICAgaWYgKCFlbmFibGVkKSB7CiAgICAgICAgICAgIC8vIEdhdGUgZGlzYWJsZWQgLSBvcGVuIGltbWVkaWF0ZWx5CiAgICAgICAgICAgIHRoaXMuZ2F0ZU9wZW4gPSB0cnVlOwogICAgICAgICAgICB0aGlzLmN1cnJlbnRHYWluID0gMS4wOwogICAgICAgICAgICB0aGlzLmhvbGRUaW1lUmVtYWluaW5nID0gMDsKICAgICAgICAgIH0KICAgICAgICB9CgogICAgICAgIGlmICh0aHJlc2hvbGQgIT09IHVuZGVmaW5lZCkgewogICAgICAgICAgdGhpcy50aHJlc2hvbGREYiA9IHRocmVzaG9sZDsKICAgICAgICB9CiAgICAgIH0KICAgIH07CiAgfQoKICB1cGRhdGVDb2VmZmljaWVudHMoc2FtcGxlUmF0ZSkgewogICAgLy8gVGltZSBjb25zdGFudHMgaW4gc2Vjb25kcwogICAgY29uc3QgYXR0YWNrVGltZSA9IDAuMDE7IC8vIDEwbXMKICAgIGNvbnN0IHJlbGVhc2VUaW1lID0gMC4wNTsgLy8gNTBtcwoKICAgIC8vIENhbGN1bGF0ZSBjb2VmZmljaWVudHM6IGNvZWYgPSAxIC0gZXhwKC0xIC8gKHRpbWUgKiBzYW1wbGVSYXRlKSkKICAgIHRoaXMuYXR0YWNrQ29lZiA9IDEgLSBNYXRoLmV4cCgtMSAvIChhdHRhY2tUaW1lICogc2FtcGxlUmF0ZSkpOwogICAgdGhpcy5yZWxlYXNlQ29lZiA9IDEgLSBNYXRoLmV4cCgtMSAvIChyZWxlYXNlVGltZSAqIHNhbXBsZVJhdGUpKTsKICB9CgogIHByb2Nlc3MoaW5wdXRzLCBvdXRwdXRzLCBwYXJhbWV0ZXJzKSB7CiAgICBjb25zdCBpbnB1dCA9IGlucHV0c1swXTsKICAgIGNvbnN0IG91dHB1dCA9IG91dHB1dHNbMF07CgogICAgaWYgKCFpbnB1dCB8fCAhaW5wdXRbMF0pIHsKICAgICAgcmV0dXJuIHRydWU7CiAgICB9CgogICAgY29uc3QgaW5wdXRDaGFubmVsID0gaW5wdXRbMF07CiAgICBjb25zdCBvdXRwdXRDaGFubmVsID0gb3V0cHV0WzBdOwogICAgY29uc3QgYmxvY2tTaXplID0gaW5wdXRDaGFubmVsLmxlbmd0aDsKCiAgICAvLyBDYWxjdWxhdGUgUk1TIGZvciB0aGlzIGJsb2NrCiAgICBsZXQgc3VtU3F1YXJlcyA9IDA7CiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJsb2NrU2l6ZTsgaSsrKSB7CiAgICAgIHN1bVNxdWFyZXMgKz0gaW5wdXRDaGFubmVsW2ldICogaW5wdXRDaGFubmVsW2ldOwogICAgfQogICAgY29uc3Qgcm1zID0gTWF0aC5zcXJ0KHN1bVNxdWFyZXMgLyBibG9ja1NpemUpOwogICAgY29uc3Qgcm1zRGIgPSBybXMgPiAwID8gMjAgKiBNYXRoLmxvZzEwKHJtcykgOiAtSW5maW5pdHk7CgogICAgLy8gR2F0ZSBsb2dpYwogICAgaWYgKHRoaXMuZW5hYmxlZCkgewogICAgICBpZiAocm1zRGIgPiB0aGlzLnRocmVzaG9sZERiKSB7CiAgICAgICAgLy8gU2lnbmFsIGFib3ZlIHRocmVzaG9sZCAtIG9wZW4gZ2F0ZQogICAgICAgIHRoaXMuZ2F0ZU9wZW4gPSB0cnVlOwogICAgICAgIHRoaXMuaG9sZFRpbWVSZW1haW5pbmcgPSB0aGlzLmhvbGRUaW1lU2FtcGxlczsKICAgICAgfSBlbHNlIGlmICh0aGlzLmdhdGVPcGVuKSB7CiAgICAgICAgLy8gU2lnbmFsIGJlbG93IHRocmVzaG9sZCAtIGNoZWNrIGhvbGQgdGltZQogICAgICAgIHRoaXMuaG9sZFRpbWVSZW1haW5pbmcgLT0gYmxvY2tTaXplOwogICAgICAgIGlmICh0aGlzLmhvbGRUaW1lUmVtYWluaW5nIDw9IDApIHsKICAgICAgICAgIHRoaXMuZ2F0ZU9wZW4gPSBmYWxzZTsKICAgICAgICB9CiAgICAgIH0KICAgIH0gZWxzZSB7CiAgICAgIC8vIEdhdGUgZGlzYWJsZWQgLSBhbHdheXMgb3BlbgogICAgICB0aGlzLmdhdGVPcGVuID0gdHJ1ZTsKICAgIH0KCiAgICAvLyBBcHBseSBnYWluIHdpdGggc21vb3RoaW5nCiAgICBjb25zdCB0YXJnZXRHYWluID0gdGhpcy5nYXRlT3BlbiA/IDEuMCA6IDAuMDsKICAgIGNvbnN0IGNvZWYgPSB0YXJnZXRHYWluID4gdGhpcy5jdXJyZW50R2FpbiA/IHRoaXMuYXR0YWNrQ29lZiA6IHRoaXMucmVsZWFzZUNvZWY7CgogICAgZm9yIChsZXQgaSA9IDA7IGkgPCBibG9ja1NpemU7IGkrKykgewogICAgICAvLyBTbW9vdGggZ2FpbiB0cmFuc2l0aW9uCiAgICAgIHRoaXMuY3VycmVudEdhaW4gKz0gKHRhcmdldEdhaW4gLSB0aGlzLmN1cnJlbnRHYWluKSAqIGNvZWY7CiAgICAgIG91dHB1dENoYW5uZWxbaV0gPSBpbnB1dENoYW5uZWxbaV0gKiB0aGlzLmN1cnJlbnRHYWluOwogICAgfQoKICAgIC8vIFJlcG9ydCBsZXZlbCB0byBtYWluIHRocmVhZCAodGhyb3R0bGVkKQogICAgdGhpcy5mcmFtZUNvdW50Kys7CiAgICBpZiAodGhpcy5mcmFtZUNvdW50ID49IHRoaXMucmVwb3J0SW50ZXJ2YWwpIHsKICAgICAgdGhpcy5mcmFtZUNvdW50ID0gMDsKICAgICAgLy8gTm9ybWFsaXplIC02MGRCIHRvIDBkQiDihpIgMCB0byAxMDAKICAgICAgY29uc3Qgbm9ybWFsaXplZCA9IE1hdGgubWF4KDAsIE1hdGgubWluKDEwMCwgKChybXNEYiArIDYwKSAvIDYwKSAqIDEwMCkpOwogICAgICB0aGlzLnBvcnQucG9zdE1lc3NhZ2UoewogICAgICAgIHR5cGU6ICdsZXZlbCcsCiAgICAgICAgbGV2ZWw6IE1hdGgucm91bmQobm9ybWFsaXplZCksCiAgICAgICAgZ2F0ZU9wZW46IHRoaXMuZ2F0ZU9wZW4sCiAgICAgIH0pOwogICAgfQoKICAgIHJldHVybiB0cnVlOwogIH0KfQoKcmVnaXN0ZXJQcm9jZXNzb3IoJ25vaXNlLWdhdGUtcHJvY2Vzc29yJywgTm9pc2VHYXRlUHJvY2Vzc29yKTsK", import.meta.url);
  Ca = -70;
  Ea = -20;
  zd = 1;
  kn = Object.freeze({
    noiseGateEnabled: true,
    noiseGateThresholdDb: -50
  });
  function Yd(e) {
    return Math.min(Ea, Math.max(Ca, e));
  }
  function ja(e) {
    return e || (typeof localStorage > "u" ? null : localStorage);
  }
  function yt(e = {}) {
    const t = e.noiseGateThresholdDb, n = t === null || t === "" ? Number.NaN : Number(t);
    return {
      noiseGateEnabled: typeof e.noiseGateEnabled == "boolean" ? e.noiseGateEnabled : kn.noiseGateEnabled,
      noiseGateThresholdDb: Number.isFinite(n) ? Yd(Math.round(n)) : kn.noiseGateThresholdDb
    };
  }
  Kr = function(e) {
    const t = ja(e);
    if (!t) return {
      ...kn
    };
    try {
      return yt({
        noiseGateEnabled: t.getItem(ka) !== "0",
        noiseGateThresholdDb: t.getItem(Sa)
      });
    } catch {
      return {
        ...kn
      };
    }
  };
  function Xd(e, t) {
    const n = ja(t), r = yt({
      ...Kr(n),
      ...e
    });
    if (!n) return r;
    try {
      n.setItem(ka, r.noiseGateEnabled ? "1" : "0"), n.setItem(Sa, String(r.noiseGateThresholdDb));
    } catch {
    }
    return r;
  }
  function Es(e, t) {
    const n = yt(t);
    return (e == null ? void 0 : e.port) && e.port.postMessage({
      type: "updateParams",
      enabled: n.noiseGateEnabled,
      threshold: n.noiseGateThresholdDb
    }), n;
  }
  gh = async function() {
    try {
      if (typeof AudioContext > "u" || !("audioWorklet" in AudioContext.prototype)) return;
      const e = new AudioContext();
      await e.audioWorklet.addModule(Aa), await e.close();
    } catch {
    }
  };
  async function Jd(e, t = {}) {
    const n = yt(t.settings ?? Kr());
    if (typeof AudioContext > "u") return {
      audioContext: null,
      noiseGateNode: null,
      rawStream: e,
      processedStream: e,
      updateSettings: (h) => yt({
        ...n,
        ...h
      }),
      cleanup: async () => {
        e.getTracks().forEach((h) => h.stop());
      }
    };
    const r = new AudioContext({
      sampleRate: 48e3
    }), s = r.createMediaStreamSource(e), o = r.createMediaStreamDestination();
    o.channelCount = 1;
    let a = null, i = s, l = null, u = n;
    if (typeof r.audioWorklet < "u") try {
      await r.audioWorklet.addModule(Aa), a = new AudioWorkletNode(r, "noise-gate-processor"), s.connect(a), i = a, Es(a, u);
    } catch (h) {
      console.warn("[audio] AudioWorklet failed, continuing without noise gate:", h);
    }
    return i.connect(o), t.monitorOutput && (l = r.createGain(), l.gain.value = 1, i.connect(l), l.connect(r.destination)), r.state === "suspended" && await r.resume(), {
      audioContext: r,
      noiseGateNode: a,
      rawStream: e,
      processedStream: o.stream,
      updateSettings: (h) => (u = yt({
        ...u,
        ...h
      }), Es(a, u), u),
      cleanup: async () => {
        try {
          l == null ? void 0 : l.disconnect();
        } catch {
        }
        try {
          a == null ? void 0 : a.disconnect();
        } catch {
        }
        try {
          s.disconnect();
        } catch {
        }
        if (e.getTracks().forEach((h) => h.stop()), r.state !== "closed") try {
          await r.close();
        } catch {
        }
      }
    };
  }
  const qd = "Microphone input stopped unexpectedly.";
  function Qd(e = null) {
    const t = {
      echoCancellation: false,
      noiseSuppression: false,
      autoGainControl: false,
      channelCount: 1
    };
    return e && (t.deviceId = {
      exact: e
    }), t;
  }
  function ef() {
    const e = f.useRef(true), t = f.useRef(null), [n, r] = f.useState(false), [s, o] = f.useState(0), [a, i] = f.useState(false), [l, u] = f.useState(null), h = f.useCallback(async () => {
      var _a2;
      const g = t.current;
      t.current = null, typeof (g == null ? void 0 : g.detachDiagnostics) == "function" && g.detachDiagnostics(), ((_a2 = g == null ? void 0 : g.noiseGateNode) == null ? void 0 : _a2.port) && (g.noiseGateNode.port.onmessage = null), e.current && (r(false), o(0), i(false)), (g == null ? void 0 : g.cleanup) && await g.cleanup();
    }, []), d = f.useCallback(async ({ deviceId: g, settings: v }) => {
      var _a2, _b, _c2;
      await h(), u(null);
      const p = Qd(g), E = await navigator.mediaDevices.getUserMedia({
        audio: p
      }), R = await Jd(E, {
        monitorOutput: true,
        settings: v
      }), D = E.getAudioTracks()[0] ?? null;
      let C = true;
      const M = (F, Q = null) => {
        !C || !e.current || (Q ? console.warn("[audio] Mic monitor stopped unexpectedly:", F, Q) : console.warn("[audio] Mic monitor stopped unexpectedly:", F), u(new Error(F)), h());
      }, G = () => {
        M(qd);
      }, K = () => {
        console.info("[audio] Mic monitor track muted by browser");
      }, W = () => {
        console.info("[audio] Mic monitor track unmuted by browser");
      }, O = () => {
        var _a3;
        const F = ((_a3 = R.audioContext) == null ? void 0 : _a3.state) ?? "unknown";
        if (F === "closed") {
          M("Microphone test audio engine stopped unexpectedly.");
          return;
        }
        F === "suspended" && console.info("[audio] Mic monitor audio context suspended");
      };
      D == null ? void 0 : D.addEventListener("ended", G), D == null ? void 0 : D.addEventListener("mute", K), D == null ? void 0 : D.addEventListener("unmute", W), (_b = (_a2 = R.audioContext) == null ? void 0 : _a2.addEventListener) == null ? void 0 : _b.call(_a2, "statechange", O);
      const X = () => {
        var _a3, _b2;
        C && (C = false, D == null ? void 0 : D.removeEventListener("ended", G), D == null ? void 0 : D.removeEventListener("mute", K), D == null ? void 0 : D.removeEventListener("unmute", W), (_b2 = (_a3 = R.audioContext) == null ? void 0 : _a3.removeEventListener) == null ? void 0 : _b2.call(_a3, "statechange", O));
      };
      if (((_c2 = R.noiseGateNode) == null ? void 0 : _c2.port) && (R.noiseGateNode.port.onmessage = (F) => {
        var _a3;
        ((_a3 = F.data) == null ? void 0 : _a3.type) === "level" && e.current && (o(F.data.level ?? 0), i(!!F.data.gateOpen));
      }), t.current = {
        ...R,
        detachDiagnostics: X
      }, !e.current) {
        X(), await R.cleanup();
        return;
      }
      r(true);
    }, []), y = f.useCallback((g) => {
      t.current && t.current.updateSettings(g);
    }, []);
    return f.useEffect(() => () => {
      var _a2;
      e.current = false;
      const g = t.current;
      t.current = null, ((_a2 = g == null ? void 0 : g.noiseGateNode) == null ? void 0 : _a2.port) && (g.noiseGateNode.port.onmessage = null), (g == null ? void 0 : g.cleanup) && g.cleanup();
    }, [
      h
    ]), {
      isTesting: n,
      level: s,
      gateOpen: a,
      error: l,
      setError: u,
      start: d,
      stop: h,
      updateSettings: y
    };
  }
  function Sn(e) {
    if (!e || e.length % 2 !== 0) return new Uint8Array(0);
    const t = new Uint8Array(e.length / 2);
    for (let n = 0; n < e.length; n += 2) t[n / 2] = parseInt(e.slice(n, n + 2), 16);
    return t;
  }
  function tf(e) {
    return Array.from(e).map((t) => t.toString(16).padStart(2, "0")).join("");
  }
  function Yn(e) {
    const t = atob(e), n = new Uint8Array(t.length);
    for (let r = 0; r < t.length; r++) n[r] = t.charCodeAt(r);
    return n;
  }
  async function nf(e) {
    const t = new Uint8Array(1 + e.length);
    t[0] = 0, t.set(e, 1);
    const n = await crypto.subtle.digest("SHA-256", t);
    return new Uint8Array(n);
  }
  async function js(e, t) {
    const n = new Uint8Array(1 + e.length + t.length);
    n[0] = 1, n.set(e, 1), n.set(t, 1 + e.length);
    const r = await crypto.subtle.digest("SHA-256", n);
    return new Uint8Array(r);
  }
  async function rf(e, t, n, r, s) {
    try {
      let o = await nf(e), a = t, i = n, l = 0;
      for (; i > 1; ) {
        if (a % 2 === 0) {
          if (a + 1 < i) {
            if (l >= r.length) return false;
            const h = Sn(r[l]);
            o = await js(o, h), l++;
          }
        } else {
          if (l >= r.length) return false;
          const h = Sn(r[l]);
          o = await js(h, o), l++;
        }
        a = Math.floor(a / 2), i = Math.ceil(i / 2);
      }
      return l !== r.length ? false : tf(o) === s.toLowerCase();
    } catch {
      return false;
    }
  }
  async function sf(e, t, n) {
    try {
      const r = await crypto.subtle.importKey("raw", e, {
        name: "Ed25519"
      }, true, [
        "verify"
      ]);
      return await crypto.subtle.verify("Ed25519", r, n, t);
    } catch {
      try {
        const { verifyAsync: s } = await je(async () => {
          const { verifyAsync: o } = await Promise.resolve().then(() => ac);
          return {
            verifyAsync: o
          };
        }, void 0);
        return await s(n, t, e);
      } catch {
        return false;
      }
    }
  }
  of = class {
    constructor(t, n) {
      this._instanceUrl = t, this._logPubKey = n ? Sn(n) : null;
    }
    async verify(t, n) {
      const r = await ca(n, t, this._instanceUrl), { entries: s = [], proofs: o = [], treeHead: a = {} } = r;
      if (s.length === 0) return {
        verified: false,
        entries: [],
        treeHead: a
      };
      for (let i = 0; i < s.length; i++) {
        const l = s[i], u = o[i];
        if (!u) continue;
        const h = Yn(l.entryCbor);
        if (!await rf(h, u.leafIndex, u.treeSize, u.auditPath, u.rootHash)) return {
          verified: false,
          entries: s,
          treeHead: a
        };
      }
      if (s.length > 0 && o.filter(Boolean).length === 0) return {
        verified: false,
        entries: s,
        treeHead: a
      };
      for (const i of s) if (!i.userPubKey || i.userPubKey.toLowerCase() !== t.toLowerCase()) return {
        verified: false,
        entries: s,
        treeHead: a
      };
      if (this._logPubKey) for (let i = 0; i < s.length; i++) {
        const l = s[i], u = o[i];
        if (!(u == null ? void 0 : u.logSignature)) continue;
        const h = Yn(u.logSignature), d = Yn(l.entryCbor), y = Sn(u.rootHash), g = new ArrayBuffer(8);
        new DataView(g).setBigUint64(0, BigInt(u.leafIndex), false);
        const v = new Uint8Array(g), p = new Uint8Array(d.length + 8 + y.length);
        if (p.set(d, 0), p.set(v, d.length), p.set(y, d.length + 8), !await sf(this._logPubKey, p, h)) return {
          verified: false,
          entries: s,
          treeHead: a
        };
      }
      return {
        verified: true,
        entries: s,
        treeHead: a
      };
    }
    async verifyOwnKey(t, n) {
      try {
        const { verified: r, entries: s } = await this.verify(t, n);
        return s.length === 0 ? {
          ok: true,
          warning: "No transparency log entries found for your key."
        } : r ? {
          ok: true
        } : {
          ok: false,
          error: "Key mismatch detected. Your account may be compromised."
        };
      } catch (r) {
        throw r;
      }
    }
    async verifyOtherUserKey(t, n) {
      try {
        const { verified: r, entries: s } = await this.verify(t, n);
        return s.length === 0 || !r ? {
          ok: false,
          warning: "Key verification failed for this user. Proceed with caution."
        } : {
          ok: true
        };
      } catch (r) {
        return {
          ok: false,
          warning: `Key verification could not be completed: ${r.message}`
        };
      }
    }
  };
  function af(e) {
    if (!e) return "Never";
    const t = Date.now() - new Date(e).getTime(), n = Math.floor(t / 6e4);
    if (n < 1) return "Just now";
    if (n < 60) return `${n}m ago`;
    const r = Math.floor(n / 60);
    if (r < 24) return `${r}h ago`;
    const s = Math.floor(r / 24);
    return s < 30 ? `${s}d ago` : new Date(e).toLocaleDateString();
  }
  function cf(e) {
    if (!e) return null;
    const t = Math.floor((Date.now() - new Date(e).getTime()) / 864e5);
    return t >= 90 ? "critical" : t >= 30 ? "warning" : null;
  }
  function lf({ deviceLabel: e, onConfirm: t, onCancel: n, loading: r }) {
    return c.jsx("div", {
      className: "dm-confirm-overlay",
      children: c.jsxs("div", {
        className: "dm-confirm-modal",
        children: [
          c.jsx("div", {
            className: "dm-confirm-title",
            children: "Revoke device?"
          }),
          c.jsxs("div", {
            className: "dm-confirm-text",
            children: [
              "Remove ",
              c.jsx("strong", {
                children: e
              }),
              " from your account. It will no longer be able to access your account."
            ]
          }),
          c.jsxs("div", {
            className: "dm-confirm-actions",
            children: [
              c.jsx("button", {
                type: "button",
                className: "btn btn-secondary",
                onClick: n,
                disabled: r,
                children: "Cancel"
              }),
              c.jsx("button", {
                type: "button",
                className: "btn btn-danger",
                onClick: t,
                disabled: r,
                children: r ? "Revoking..." : "Revoke device"
              })
            ]
          })
        ]
      })
    });
  }
  function uf(e, t) {
    return (e == null ? void 0 : e.label) ? e.label : (e == null ? void 0 : e.deviceId) === t ? $r() : (e == null ? void 0 : e.deviceId) || "Unknown device";
  }
  function df() {
    return typeof window > "u" ? null : localStorage.getItem(qt) || window.location.origin;
  }
  function ff({ token: e, currentDeviceId: t, identityKeyRef: n, handshakeData: r, setTransparencyError: s }) {
    const o = Cn(), [a, i] = f.useState([]), [l, u] = f.useState(true), [h, d] = f.useState(null), [y, g] = f.useState(null), [v, p] = f.useState(false), E = f.useCallback(async () => {
      if (e) try {
        d(null);
        const C = await fa(e);
        i(Array.isArray(C) ? C : []);
      } catch (C) {
        d(C.message || "Failed to load devices");
      } finally {
        u(false);
      }
    }, [
      e
    ]);
    f.useEffect(() => {
      E();
    }, [
      E
    ]);
    const R = f.useCallback(async (C) => {
      var _a2;
      if (!(r == null ? void 0 : r.log_public_key) || !((_a2 = n == null ? void 0 : n.current) == null ? void 0 : _a2.publicKey)) return;
      const M = df();
      if (M) try {
        const G = pt(n.current.publicKey), W = await new of(M, r.log_public_key).verifyOwnKey(G, e);
        W.ok || (console.error(`[transparency] ${C} was NOT logged correctly`), s == null ? void 0 : s(W.error));
      } catch (G) {
        console.warn(`[transparency] post-${C} verification failed:`, G);
      }
    }, [
      r,
      n,
      e,
      s
    ]), D = f.useCallback(async () => {
      if (!(!y || !e)) {
        p(true);
        try {
          await ha(e, y.deviceId), await R("device_revoke"), g(null), await E();
        } catch (C) {
          d(C.message || "Failed to revoke device");
        } finally {
          p(false);
        }
      }
    }, [
      y,
      e,
      E,
      R
    ]);
    return c.jsxs(c.Fragment, {
      children: [
        c.jsx("div", {
          className: "ist-header",
          children: "Devices"
        }),
        c.jsxs("div", {
          style: {
            margin: "0 0 16px",
            color: "var(--hush-text-muted)",
            fontSize: "0.82rem",
            lineHeight: 1.5
          },
          children: [
            "On the new device, open ",
            c.jsx("strong", {
              children: "Link to existing device"
            }),
            " from the sign-in screen to show its QR code or fallback code. Use this page on your current signed-in device to scan that QR code or enter that fallback code and approve the link."
          ]
        }),
        h && c.jsx("div", {
          className: "dm-error",
          children: h
        }),
        l ? c.jsx("div", {
          className: "dm-empty",
          children: "Loading devices..."
        }) : a.length === 0 ? c.jsx("div", {
          className: "dm-empty",
          children: "No devices registered."
        }) : c.jsxs("table", {
          className: "dm-table",
          children: [
            c.jsx("thead", {
              children: c.jsxs("tr", {
                children: [
                  c.jsx("th", {
                    className: "dm-th",
                    children: "Device"
                  }),
                  c.jsx("th", {
                    className: "dm-th",
                    children: "Last active"
                  }),
                  c.jsx("th", {
                    className: "dm-th",
                    children: "Linked"
                  }),
                  c.jsx("th", {
                    className: "dm-th dm-th--right"
                  })
                ]
              })
            }),
            c.jsx("tbody", {
              children: a.map((C) => {
                const M = C.deviceId === t, G = uf(C, t), K = cf(C.lastSeen), W = K === "critical";
                return c.jsxs("tr", {
                  children: [
                    c.jsx("td", {
                      className: "dm-td",
                      children: c.jsxs("div", {
                        className: "dm-device-name",
                        children: [
                          c.jsx("span", {
                            children: G
                          }),
                          M && c.jsx("span", {
                            className: "dm-this-badge",
                            children: "This device"
                          })
                        ]
                      })
                    }),
                    c.jsxs("td", {
                      className: "dm-td",
                      children: [
                        c.jsx("div", {
                          children: af(C.lastSeen)
                        }),
                        K === "critical" && c.jsx("div", {
                          className: "dm-stale-warning dm-stale-warning--critical",
                          children: "Inactive 90+ days \u2014 consider revoking"
                        }),
                        K === "warning" && c.jsx("div", {
                          className: "dm-stale-warning dm-stale-warning--warning",
                          children: "Inactive 30+ days"
                        })
                      ]
                    }),
                    c.jsx("td", {
                      className: "dm-td",
                      children: C.certifiedAt ? new Date(C.certifiedAt).toLocaleDateString() : "\u2014"
                    }),
                    c.jsx("td", {
                      className: "dm-td dm-td--right",
                      children: !M && c.jsx("button", {
                        type: "button",
                        className: `dm-revoke-btn${W ? " dm-revoke-btn--stale" : ""}`,
                        onClick: () => g({
                          deviceId: C.deviceId,
                          label: G
                        }),
                        title: `Revoke ${G}`,
                        children: "Revoke"
                      })
                    })
                  ]
                }, C.deviceId);
              })
            })
          ]
        }),
        c.jsx("div", {
          className: "dm-actions",
          children: c.jsx("button", {
            type: "button",
            className: "btn btn-secondary",
            onClick: () => o("/link-device"),
            children: "Approve a new device"
          })
        }),
        y && c.jsx(lf, {
          deviceLabel: y.label,
          onConfirm: D,
          onCancel: () => g(null),
          loading: v
        })
      ]
    });
  }
  function hf(e) {
    switch (e) {
      case "connected":
        return {
          color: "var(--hush-live)",
          label: "connected"
        };
      case "reconnecting":
      case "connecting":
        return {
          color: "#f59e0b",
          label: e
        };
      default:
        return {
          color: "var(--hush-danger)",
          label: "offline"
        };
    }
  }
  function gf({ domain: e, serverCount: t, onConfirm: n, onCancel: r, loading: s }) {
    const o = t === 1 ? "1 server" : `${t} servers`;
    return c.jsxs("div", {
      className: "ist-confirm",
      children: [
        c.jsxs("div", {
          className: "ist-confirm-text",
          children: [
            "Disconnect from ",
            c.jsx("strong", {
              style: {
                color: "var(--hush-text)"
              },
              children: e
            }),
            "? This will leave all ",
            o,
            " on this instance."
          ]
        }),
        c.jsxs("div", {
          className: "ist-confirm-actions",
          children: [
            c.jsx("button", {
              type: "button",
              className: "btn btn-secondary",
              onClick: r,
              disabled: s,
              style: {
                fontSize: "0.8rem",
                padding: "7px 14px"
              },
              children: "Cancel"
            }),
            c.jsx("button", {
              type: "button",
              className: "btn btn-danger",
              onClick: n,
              disabled: s,
              style: {
                fontSize: "0.8rem",
                padding: "7px 14px"
              },
              children: s ? "Disconnecting\u2026" : "Disconnect"
            })
          ]
        })
      ]
    });
  }
  function yf({ instanceUrl: e, state: t, onDisconnect: n }) {
    var _a2;
    const [r, s] = f.useState(false), [o, a] = f.useState(false);
    let i = e;
    try {
      i = new URL(e).hostname;
    } catch {
    }
    const l = ((_a2 = t == null ? void 0 : t.guilds) == null ? void 0 : _a2.length) ?? 0, u = hf((t == null ? void 0 : t.connectionState) ?? "offline"), h = () => s(true), d = () => s(false), y = async () => {
      a(true);
      try {
        await n(e);
      } finally {
        a(false), s(false);
      }
    };
    return c.jsxs("div", {
      className: "ist-row",
      children: [
        c.jsxs("div", {
          className: "ist-row-inner",
          children: [
            c.jsx("div", {
              className: "ist-status-dot",
              style: {
                background: u.color
              },
              title: u.label
            }),
            c.jsxs("div", {
              className: "ist-row-info",
              children: [
                c.jsx("div", {
                  className: "ist-domain",
                  children: i
                }),
                c.jsxs("div", {
                  className: "ist-sub",
                  children: [
                    l === 0 ? "No servers" : l === 1 ? "1 server" : `${l} servers`,
                    " \xB7 ",
                    c.jsx("span", {
                      style: {
                        color: u.color
                      },
                      children: u.label
                    })
                  ]
                })
              ]
            }),
            !r && c.jsx("button", {
              type: "button",
              className: "ist-disconnect-btn",
              onClick: h,
              children: "Disconnect"
            })
          ]
        }),
        r && c.jsx(gf, {
          domain: i,
          serverCount: l,
          onConfirm: y,
          onCancel: d,
          loading: o
        })
      ]
    });
  }
  function mf() {
    const e = f.useContext(Or), t = (e == null ? void 0 : e.instanceStates) ?? /* @__PURE__ */ new Map(), n = (e == null ? void 0 : e.disconnectInstance) ?? null, r = Array.from(t.entries());
    return c.jsxs(c.Fragment, {
      children: [
        c.jsx("div", {
          className: "ist-header",
          children: "My Instances"
        }),
        r.length === 0 ? c.jsxs("div", {
          className: "ist-empty",
          children: [
            c.jsx("div", {
              className: "ist-empty-title",
              children: "No instances connected"
            }),
            c.jsx("div", {
              className: "ist-empty-hint",
              children: "Join a server via invite link or create one to connect to an instance."
            })
          ]
        }) : c.jsx("div", {
          children: r.map(([s, o]) => c.jsx(yf, {
            instanceUrl: s,
            state: o,
            onDisconnect: n ?? (() => Promise.resolve())
          }, s))
        }),
        c.jsx("div", {
          className: "ist-footer-note",
          children: "Disconnecting from an instance leaves all servers on that instance and stops the connection. You can reconnect by joining a server via invite link."
        })
      ]
    });
  }
  const en = "account", sr = "appearance", or = "audio-video", ar = "devices", ir = "instances", _a = "hush_vault_timeout", pf = [
    {
      value: "browser_close",
      label: "On browser close"
    },
    {
      value: "refresh",
      label: "On refresh"
    },
    {
      value: "1m",
      label: "1 minute"
    },
    {
      value: "15m",
      label: "15 minutes"
    },
    {
      value: "30m",
      label: "30 minutes"
    },
    {
      value: "1h",
      label: "1 hour"
    },
    {
      value: "4h",
      label: "4 hours"
    },
    {
      value: "never",
      label: "Never"
    }
  ], Ta = "hush_theme_mode", Ba = "hush_dark_theme", Na = "hush_light_theme", cr = [
    {
      key: "og-dark",
      label: "OG Dark",
      css: "dark"
    }
  ], lr = [
    {
      key: "og-light",
      label: "OG Light",
      css: "light"
    }
  ];
  function wf(e) {
    if (typeof e == "number") switch (e) {
      case 60:
        return "1h";
      case 240:
        return "4h";
      default:
        return `${e}m`;
    }
    return e || "browser_close";
  }
  function bf(e) {
    switch (e) {
      case "browser_close":
      case "refresh":
      case "never":
        return e;
      case "1m":
        return 1;
      case "15m":
        return 15;
      case "30m":
        return 30;
      case "1h":
        return 60;
      case "4h":
        return 240;
      default:
        return "browser_close";
    }
  }
  function _s(e) {
    var _a2;
    const t = e ? (_a2 = Go(e)) == null ? void 0 : _a2.timeout : null;
    return t != null ? wf(t) : localStorage.getItem(_a) || "browser_close";
  }
  function Hr() {
    return localStorage.getItem(Ta) || "system";
  }
  function ur() {
    return localStorage.getItem(Ba) || "og-dark";
  }
  function dr() {
    return localStorage.getItem(Na) || "og-light";
  }
  function Wt(e, t, n) {
    const r = t.find((s) => s.key === e);
    return r ? r.css : n;
  }
  function Ra(e) {
    return e === "light" ? Wt(dr(), lr, "light") : e === "dark" || window.matchMedia("(prefers-color-scheme: dark)").matches ? Wt(ur(), cr, "dark") : Wt(dr(), lr, "light");
  }
  function tn(e) {
    localStorage.setItem(Ta, e), document.documentElement.dataset.theme = Ra(e);
  }
  function Ts(e) {
    return e ? (e == null ? void 0 : e.name) === "NotAllowedError" ? "Microphone access is required to test your mic." : (e == null ? void 0 : e.name) === "NotFoundError" ? "No microphone input is available on this device." : (e == null ? void 0 : e.message) || "Unable to start mic test." : null;
  }
  typeof window < "u" && window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    Hr() === "system" && (document.documentElement.dataset.theme = Ra("system"));
  });
  function vf({ onConfirm: e, onCancel: t, loading: n }) {
    return hr.createPortal(c.jsx("div", {
      className: "logout-confirm-overlay",
      children: c.jsxs("div", {
        className: "logout-confirm-card",
        children: [
          c.jsx("div", {
            className: "logout-confirm-title",
            children: "Sign out and wipe data?"
          }),
          c.jsx("div", {
            className: "logout-confirm-body",
            children: "This will permanently delete all local data on this device, including your message history, encryption keys, and session. Messages will become unreadable after signing out."
          }),
          c.jsx("div", {
            className: "logout-confirm-warning",
            children: "You will need your 12-word recovery phrase to sign back in. This action cannot be undone."
          }),
          c.jsxs("div", {
            className: "logout-confirm-actions",
            children: [
              c.jsx("button", {
                type: "button",
                className: "btn btn-secondary",
                onClick: t,
                disabled: n,
                children: "Stay signed in"
              }),
              c.jsx("button", {
                type: "button",
                className: "btn btn-danger",
                onClick: e,
                disabled: n,
                children: n ? "Signing out\u2026" : "Sign out and wipe data"
              })
            ]
          })
        ]
      })
    }), document.body);
  }
  function xf() {
    const { user: e, performLogout: t, logout: n, updateVaultTimeout: r } = It(), s = Cn(), [o, a] = f.useState(false), [i, l] = f.useState(false), [u, h] = f.useState(() => _s(e == null ? void 0 : e.id));
    f.useEffect(() => {
      h(_s(e == null ? void 0 : e.id));
    }, [
      e == null ? void 0 : e.id
    ]);
    const d = () => {
      a(true);
    }, y = async () => {
      l(true);
      try {
        await (t || n)();
      } finally {
        s("/");
      }
    }, g = (E) => {
      if (h(E), typeof r == "function") {
        r(bf(E));
        return;
      }
      localStorage.setItem(_a, E);
    }, v = (e == null ? void 0 : e.displayName) || "Anonymous", p = v.charAt(0).toUpperCase();
    return c.jsxs(c.Fragment, {
      children: [
        c.jsx("div", {
          className: "settings-section-title",
          children: "Account"
        }),
        c.jsxs("div", {
          className: "settings-profile-card",
          children: [
            c.jsx("div", {
              className: "settings-profile-banner"
            }),
            c.jsxs("div", {
              className: "settings-profile-body",
              children: [
                c.jsx("div", {
                  className: "settings-profile-avatar",
                  children: p
                }),
                c.jsxs("div", {
                  className: "settings-profile-meta",
                  children: [
                    c.jsx("span", {
                      className: "settings-profile-display-name",
                      children: v
                    }),
                    c.jsxs("span", {
                      className: "settings-profile-username",
                      children: [
                        "@",
                        (e == null ? void 0 : e.username) || "\u2014"
                      ]
                    })
                  ]
                })
              ]
            })
          ]
        }),
        c.jsxs("div", {
          className: "settings-card",
          children: [
            c.jsx("div", {
              className: "settings-card-row",
              children: c.jsxs("div", {
                children: [
                  c.jsx("div", {
                    className: "settings-field-label",
                    children: "Display name"
                  }),
                  c.jsx("div", {
                    className: "settings-card-value",
                    children: v
                  })
                ]
              })
            }),
            c.jsx("div", {
              className: "settings-card-separator"
            }),
            c.jsx("div", {
              className: "settings-card-row",
              children: c.jsxs("div", {
                children: [
                  c.jsx("div", {
                    className: "settings-field-label",
                    children: "Username"
                  }),
                  c.jsx("div", {
                    className: "settings-card-value",
                    children: (e == null ? void 0 : e.username) || "\u2014"
                  })
                ]
              })
            }),
            c.jsx("div", {
              className: "settings-card-separator"
            }),
            c.jsx("div", {
              className: "settings-card-row",
              children: c.jsxs("div", {
                style: {
                  flex: 1
                },
                children: [
                  c.jsx("div", {
                    className: "settings-field-label",
                    children: "Vault timeout"
                  }),
                  c.jsx("select", {
                    value: u,
                    onChange: (E) => g(E.target.value),
                    className: "settings-device-select",
                    children: pf.map((E) => c.jsx("option", {
                      value: E.value,
                      children: E.label
                    }, E.value))
                  }),
                  u === "never" && c.jsx("div", {
                    className: "settings-field-note",
                    style: {
                      color: "var(--hush-danger)"
                    },
                    children: "Your key will remain decrypted in memory."
                  }),
                  c.jsx("div", {
                    className: "settings-field-note",
                    children: "How long before your vault locks and requires PIN re-entry."
                  })
                ]
              })
            })
          ]
        }),
        c.jsxs("div", {
          className: "settings-danger-zone",
          children: [
            c.jsx("div", {
              className: "settings-danger-title",
              children: "Session"
            }),
            c.jsxs("div", {
              className: "settings-danger-action",
              children: [
                c.jsx("span", {
                  className: "settings-danger-action-text",
                  children: "Sign out and permanently wipe all local data."
                }),
                c.jsx("button", {
                  type: "button",
                  className: "btn btn-danger",
                  onClick: d,
                  disabled: i,
                  children: i ? "Signing out\u2026" : "Sign out"
                })
              ]
            })
          ]
        }),
        o && c.jsx(vf, {
          onConfirm: y,
          onCancel: () => a(false),
          loading: i
        })
      ]
    });
  }
  function If() {
    const [e, t] = f.useState(Hr), [n, r] = f.useState(ur), [s, o] = f.useState(dr), a = (d) => {
      t(d), tn(d);
    }, i = (d) => {
      r(d), localStorage.setItem(Ba, d), tn(e);
    }, l = (d) => {
      o(d), localStorage.setItem(Na, d), tn(e);
    }, u = e === "dark" || e === "system", h = e === "light" || e === "system";
    return c.jsxs(c.Fragment, {
      children: [
        c.jsx("div", {
          className: "settings-section-title",
          children: "Appearance"
        }),
        c.jsxs("div", {
          className: "settings-field-row",
          children: [
            c.jsx("label", {
              className: "settings-field-label",
              children: "Theme mode"
            }),
            c.jsx("div", {
              className: "settings-mode-group",
              children: [
                {
                  key: "system",
                  label: "System"
                },
                {
                  key: "dark",
                  label: "Dark"
                },
                {
                  key: "light",
                  label: "Light"
                }
              ].map((d) => c.jsx("button", {
                type: "button",
                className: `settings-mode-btn${e === d.key ? " settings-mode-btn--active" : ""}`,
                onClick: () => a(d.key),
                children: d.label
              }, d.key))
            }),
            c.jsx("div", {
              className: "settings-field-note",
              children: e === "system" ? "Follows your operating system preference." : e === "dark" ? "Always use the selected dark theme." : "Always use the selected light theme."
            })
          ]
        }),
        u && c.jsxs("div", {
          className: "settings-field-row",
          children: [
            c.jsx("label", {
              className: "settings-field-label",
              children: "Dark theme"
            }),
            c.jsx("div", {
              className: "settings-mode-group",
              children: cr.map((d) => c.jsx("button", {
                type: "button",
                className: `settings-mode-btn${n === d.key ? " settings-mode-btn--active" : ""}`,
                onClick: () => i(d.key),
                children: d.label
              }, d.key))
            })
          ]
        }),
        h && c.jsxs("div", {
          className: "settings-field-row",
          children: [
            c.jsx("label", {
              className: "settings-field-label",
              children: "Light theme"
            }),
            c.jsx("div", {
              className: "settings-mode-group",
              children: lr.map((d) => c.jsx("button", {
                type: "button",
                className: `settings-mode-btn${s === d.key ? " settings-mode-btn--active" : ""}`,
                onClick: () => l(d.key),
                children: d.label
              }, d.key))
            })
          ]
        })
      ]
    });
  }
  function kf({ voiceRuntime: e = null }) {
    const { audioDevices: t, videoDevices: n, selectedMicId: r, selectedWebcamId: s, selectMic: o, selectWebcam: a, requestPermission: i, refreshDevices: l } = Vd(), { isTesting: u, level: h, gateOpen: d, error: y, setError: g, start: v, stop: p, updateSettings: E } = ef(), R = f.useRef(null), [D, C] = f.useState(() => Kr()), M = t.some((m) => m.label), G = n.some((m) => m.label), K = f.useCallback((m) => {
      var _a2;
      const S = Xd(m);
      return C(S), (_a2 = e == null ? void 0 : e.onMicFilterSettingsChange) == null ? void 0 : _a2.call(e, S), E(S), S;
    }, [
      e,
      E
    ]), W = f.useCallback(async () => {
      var _a2, _b;
      if (!(e == null ? void 0 : e.isInVoice)) return;
      const m = {
        isInVoice: true,
        isMuted: !!e.isMuted,
        isDeafened: !!e.isDeafened,
        appliedDeafen: false,
        appliedMute: false
      };
      if (R.current = m, !m.isDeafened) {
        m.appliedDeafen = true, await Promise.resolve((_a2 = e == null ? void 0 : e.onDeafen) == null ? void 0 : _a2.call(e));
        return;
      }
      m.isMuted || (m.appliedMute = true, await Promise.resolve((_b = e == null ? void 0 : e.onMute) == null ? void 0 : _b.call(e)));
    }, [
      e == null ? void 0 : e.isInVoice,
      e == null ? void 0 : e.isMuted,
      e == null ? void 0 : e.isDeafened,
      e == null ? void 0 : e.onMute,
      e == null ? void 0 : e.onDeafen
    ]), O = f.useCallback(async () => {
      var _a2, _b;
      const m = R.current;
      if (R.current = null, !!(m == null ? void 0 : m.isInVoice)) {
        if (m.appliedDeafen) {
          await Promise.resolve((_a2 = e == null ? void 0 : e.onDeafen) == null ? void 0 : _a2.call(e));
          return;
        }
        m.appliedMute && await Promise.resolve((_b = e == null ? void 0 : e.onMute) == null ? void 0 : _b.call(e));
      }
    }, [
      e == null ? void 0 : e.onMute,
      e == null ? void 0 : e.onDeafen
    ]), X = f.useCallback(async (m = r) => {
      g(null);
      try {
        await W(), await v({
          deviceId: m || null,
          settings: D
        }), await l().catch(() => {
        });
      } catch (S) {
        await O(), g(Ts(S));
      }
    }, [
      r,
      D,
      g,
      W,
      v,
      l,
      O
    ]), F = f.useCallback(async () => {
      await p(), await O(), g(null);
    }, [
      O,
      g,
      p
    ]), Q = f.useCallback(async () => {
      await p(), await O();
    }, [
      O,
      p
    ]), se = f.useCallback(async (m) => {
      const S = m.target.value;
      if (o(S), !!u) {
        g(null);
        try {
          await p(), await v({
            deviceId: S || null,
            settings: D
          });
        } catch (P) {
          await O(), g(Ts(P));
        }
      }
    }, [
      o,
      u,
      g,
      p,
      v,
      D,
      O
    ]), w = f.useCallback(async () => {
      if (u) {
        await F();
        return;
      }
      await X();
    }, [
      u,
      X,
      F
    ]);
    return f.useEffect(() => () => {
      Q();
    }, [
      Q
    ]), c.jsxs(c.Fragment, {
      children: [
        c.jsx("div", {
          className: "settings-section-title",
          children: "Audio & Video"
        }),
        c.jsxs("div", {
          className: "settings-card",
          children: [
            c.jsx("div", {
              className: "settings-card-row",
              children: c.jsxs("div", {
                style: {
                  flex: 1
                },
                children: [
                  c.jsx("div", {
                    className: "settings-field-label",
                    children: "Microphone"
                  }),
                  t.length === 0 || !M ? c.jsx("button", {
                    type: "button",
                    className: "btn btn-secondary",
                    onClick: () => i("audio"),
                    children: "Grant microphone access"
                  }) : c.jsxs("select", {
                    className: "settings-device-select",
                    value: r || "",
                    onChange: se,
                    children: [
                      c.jsx("option", {
                        value: "",
                        children: "Default"
                      }),
                      t.map((m) => c.jsx("option", {
                        value: m.deviceId,
                        children: m.label || m.deviceId
                      }, m.deviceId))
                    ]
                  })
                ]
              })
            }),
            c.jsx("div", {
              className: "settings-card-separator"
            }),
            c.jsx("div", {
              className: "settings-card-row",
              children: c.jsxs("div", {
                style: {
                  flex: 1
                },
                children: [
                  c.jsx("div", {
                    className: "settings-field-label",
                    children: "Webcam"
                  }),
                  n.length === 0 || !G ? c.jsx("button", {
                    type: "button",
                    className: "btn btn-secondary",
                    onClick: () => i("video"),
                    children: "Grant webcam access"
                  }) : c.jsxs("select", {
                    className: "settings-device-select",
                    value: s || "",
                    onChange: (m) => a(m.target.value),
                    children: [
                      c.jsx("option", {
                        value: "",
                        children: "Default"
                      }),
                      n.map((m) => c.jsx("option", {
                        value: m.deviceId,
                        children: m.label || m.deviceId
                      }, m.deviceId))
                    ]
                  })
                ]
              })
            })
          ]
        }),
        c.jsxs("div", {
          className: "settings-card",
          children: [
            c.jsxs("div", {
              className: "settings-card-row settings-card-row--stacked",
              children: [
                c.jsxs("div", {
                  className: "settings-mic-section-header",
                  children: [
                    c.jsxs("div", {
                      children: [
                        c.jsx("div", {
                          className: "settings-field-label",
                          children: "Audio Filters"
                        }),
                        c.jsx("div", {
                          className: "settings-card-value",
                          children: "Noise gate"
                        })
                      ]
                    }),
                    c.jsx("button", {
                      type: "button",
                      className: `settings-pill-toggle${D.noiseGateEnabled ? " settings-pill-toggle--active" : ""}`,
                      onClick: () => K({
                        noiseGateEnabled: !D.noiseGateEnabled
                      }),
                      children: D.noiseGateEnabled ? "Enabled" : "Disabled"
                    })
                  ]
                }),
                c.jsx("div", {
                  className: "settings-field-note",
                  children: "Filters the published mic stream before it goes to the room."
                }),
                c.jsxs("div", {
                  className: "settings-slider-row",
                  children: [
                    c.jsx("label", {
                      className: "settings-slider-label",
                      htmlFor: "noise-gate-threshold",
                      children: "Gate threshold"
                    }),
                    c.jsxs("span", {
                      className: "settings-slider-value",
                      children: [
                        D.noiseGateThresholdDb,
                        " dB"
                      ]
                    })
                  ]
                }),
                c.jsx("input", {
                  id: "noise-gate-threshold",
                  type: "range",
                  className: "settings-range",
                  min: Ca,
                  max: Ea,
                  step: zd,
                  value: D.noiseGateThresholdDb,
                  disabled: !D.noiseGateEnabled,
                  onChange: (m) => K({
                    noiseGateThresholdDb: Number(m.target.value)
                  })
                }),
                c.jsxs("div", {
                  className: "settings-range-scale",
                  children: [
                    c.jsx("span", {
                      children: "More open"
                    }),
                    c.jsx("span", {
                      children: "More aggressive"
                    })
                  ]
                })
              ]
            }),
            c.jsx("div", {
              className: "settings-card-separator"
            }),
            c.jsxs("div", {
              className: "settings-card-row settings-card-row--stacked",
              children: [
                c.jsxs("div", {
                  className: "settings-mic-section-header",
                  children: [
                    c.jsxs("div", {
                      children: [
                        c.jsx("div", {
                          className: "settings-field-label",
                          children: "Mic Test"
                        }),
                        c.jsx("div", {
                          className: "settings-card-value",
                          children: "Monitor your mic locally while tuning the gate"
                        })
                      ]
                    }),
                    c.jsx("button", {
                      type: "button",
                      className: `settings-pill-toggle${u ? " settings-pill-toggle--active" : ""}`,
                      onClick: w,
                      children: u ? "Stop test" : "Start test"
                    })
                  ]
                }),
                c.jsx("div", {
                  className: "settings-field-note",
                  children: (e == null ? void 0 : e.isInVoice) ? "While active, Hush temporarily deafens you from the room and mutes your room mic so you can tune filters safely." : "Hear your mic locally through Hush monitoring while you tune the filter."
                }),
                c.jsx("div", {
                  className: "settings-mic-meter",
                  "aria-label": "Microphone input level",
                  role: "progressbar",
                  "aria-valuemin": 0,
                  "aria-valuemax": 100,
                  "aria-valuenow": h,
                  children: c.jsx("div", {
                    className: `settings-mic-meter-fill${u && d ? " settings-mic-meter-fill--open" : ""}`,
                    style: {
                      width: `${h}%`
                    }
                  })
                }),
                c.jsx("div", {
                  className: "settings-mic-test-status",
                  children: u ? `Monitoring locally${D.noiseGateEnabled ? ` \xB7 gate ${d ? "open" : "closed"}` : " \xB7 gate disabled"}` : "Start the test to hear your mic locally while you adjust the filter."
                }),
                y && c.jsx("div", {
                  className: "settings-mic-test-error",
                  children: y
                })
              ]
            })
          ]
        })
      ]
    });
  }
  function Sf() {
    const { token: e, identityKeyRef: t, handshakeData: n, setTransparencyError: r } = It(), s = Ge();
    return c.jsx(ff, {
      token: e,
      currentDeviceId: s,
      identityKeyRef: t,
      handshakeData: n,
      setTransparencyError: r
    });
  }
  function Af() {
    return c.jsxs("svg", {
      width: "16",
      height: "16",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      children: [
        c.jsx("path", {
          d: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
        }),
        c.jsx("circle", {
          cx: "12",
          cy: "7",
          r: "4"
        })
      ]
    });
  }
  function Cf() {
    return c.jsxs("svg", {
      width: "16",
      height: "16",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      children: [
        c.jsx("circle", {
          cx: "12",
          cy: "12",
          r: "10"
        }),
        c.jsx("path", {
          d: "M12 2a7 7 0 0 0 0 20z",
          fill: "currentColor"
        })
      ]
    });
  }
  function Ef() {
    return c.jsxs("svg", {
      width: "16",
      height: "16",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      children: [
        c.jsx("path", {
          d: "M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"
        }),
        c.jsx("path", {
          d: "M19 10v2a7 7 0 0 1-14 0v-2"
        }),
        c.jsx("line", {
          x1: "12",
          y1: "19",
          x2: "12",
          y2: "23"
        }),
        c.jsx("line", {
          x1: "8",
          y1: "23",
          x2: "16",
          y2: "23"
        })
      ]
    });
  }
  function jf() {
    return c.jsxs("svg", {
      width: "16",
      height: "16",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      children: [
        c.jsx("rect", {
          x: "2",
          y: "3",
          width: "20",
          height: "14",
          rx: "2"
        }),
        c.jsx("line", {
          x1: "8",
          y1: "21",
          x2: "16",
          y2: "21"
        }),
        c.jsx("line", {
          x1: "12",
          y1: "17",
          x2: "12",
          y2: "21"
        })
      ]
    });
  }
  function _f() {
    return c.jsxs("svg", {
      width: "16",
      height: "16",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      children: [
        c.jsx("rect", {
          x: "2",
          y: "2",
          width: "20",
          height: "8",
          rx: "2"
        }),
        c.jsx("rect", {
          x: "2",
          y: "14",
          width: "20",
          height: "8",
          rx: "2"
        }),
        c.jsx("line", {
          x1: "6",
          y1: "6",
          x2: "6.01",
          y2: "6"
        }),
        c.jsx("line", {
          x1: "6",
          y1: "18",
          x2: "6.01",
          y2: "18"
        })
      ]
    });
  }
  function Tf() {
    return c.jsxs("svg", {
      width: "16",
      height: "16",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      children: [
        c.jsx("path", {
          d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
        }),
        c.jsx("polyline", {
          points: "14 2 14 8 20 8"
        }),
        c.jsx("line", {
          x1: "16",
          y1: "13",
          x2: "8",
          y2: "13"
        }),
        c.jsx("line", {
          x1: "16",
          y1: "17",
          x2: "8",
          y2: "17"
        })
      ]
    });
  }
  const Bf = {
    [en]: Af,
    [sr]: Cf,
    [or]: Ef,
    [ar]: jf,
    [ir]: _f
  };
  yh = function({ onClose: e, voiceRuntime: t = null }) {
    const [n, r] = f.useState(en), [s, o] = f.useState(false), { user: a } = It(), l = Zd() === "mobile";
    f.useEffect(() => {
      const g = requestAnimationFrame(() => o(true));
      return () => cancelAnimationFrame(g);
    }, []), f.useEffect(() => {
      const g = (v) => {
        v.key === "Escape" && e();
      };
      return document.addEventListener("keydown", g), () => document.removeEventListener("keydown", g);
    }, [
      e
    ]);
    const u = f.useCallback((g) => {
      g.target === g.currentTarget && e();
    }, [
      e
    ]), h = [
      {
        key: en,
        label: "Account"
      },
      {
        key: sr,
        label: "Appearance"
      },
      {
        key: or,
        label: "Audio & Video"
      },
      {
        key: ar,
        label: "Devices"
      },
      {
        key: ir,
        label: "My Instances"
      }
    ], d = (a == null ? void 0 : a.displayName) || (a == null ? void 0 : a.username) || "User", y = d.charAt(0).toUpperCase();
    return hr.createPortal(c.jsxs("div", {
      className: `settings-overlay${s ? " settings-overlay--open" : ""}${l ? " settings-overlay--mobile" : ""}`,
      onClick: u,
      children: [
        l ? c.jsx("div", {
          className: "settings-mobile-tab-bar",
          children: h.map((g) => c.jsx("button", {
            type: "button",
            className: `settings-mobile-tab-btn${n === g.key ? " settings-mobile-tab-btn--active" : ""}`,
            onClick: () => r(g.key),
            children: g.label
          }, g.key))
        }) : c.jsxs("div", {
          className: "settings-sidebar",
          children: [
            c.jsxs("div", {
              className: "settings-sidebar-profile",
              children: [
                c.jsx("div", {
                  className: "settings-sidebar-avatar",
                  children: y
                }),
                c.jsxs("div", {
                  className: "settings-sidebar-profile-info",
                  children: [
                    c.jsx("span", {
                      className: "settings-sidebar-profile-name",
                      children: d
                    }),
                    c.jsx("span", {
                      className: "settings-sidebar-profile-sub",
                      children: (a == null ? void 0 : a.username) || ""
                    })
                  ]
                })
              ]
            }),
            c.jsxs("div", {
              className: "settings-sidebar-group",
              children: [
                c.jsx("div", {
                  className: "settings-sidebar-group-label",
                  children: "User Settings"
                }),
                h.map((g) => {
                  const v = Bf[g.key];
                  return c.jsxs("button", {
                    type: "button",
                    className: `settings-sidebar-item${n === g.key ? " settings-sidebar-item--active" : ""}`,
                    onClick: () => r(g.key),
                    children: [
                      v && c.jsx(v, {}),
                      g.label
                    ]
                  }, g.key);
                })
              ]
            }),
            c.jsx("div", {
              className: "settings-sidebar-divider"
            }),
            c.jsx("div", {
              className: "settings-sidebar-group",
              children: c.jsxs("button", {
                type: "button",
                className: "settings-sidebar-item",
                onClick: () => window.open("https://github.com/nicholasgriffintn/hush/blob/main/CHANGELOG.md", "_blank"),
                children: [
                  c.jsx(Tf, {}),
                  "Changelog",
                  c.jsxs("svg", {
                    className: "settings-external-icon",
                    width: "10",
                    height: "10",
                    viewBox: "0 0 24 24",
                    fill: "none",
                    stroke: "currentColor",
                    strokeWidth: "2",
                    children: [
                      c.jsx("path", {
                        d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
                      }),
                      c.jsx("polyline", {
                        points: "15 3 21 3 21 9"
                      }),
                      c.jsx("line", {
                        x1: "10",
                        y1: "14",
                        x2: "21",
                        y2: "3"
                      })
                    ]
                  })
                ]
              })
            })
          ]
        }),
        c.jsxs("div", {
          className: `settings-content${l ? " settings-content--mobile" : ""}`,
          children: [
            c.jsx("button", {
              type: "button",
              className: "settings-close-btn",
              onClick: e,
              title: "Close (Esc)",
              children: c.jsxs("svg", {
                width: "18",
                height: "18",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "2",
                children: [
                  c.jsx("line", {
                    x1: "18",
                    y1: "6",
                    x2: "6",
                    y2: "18"
                  }),
                  c.jsx("line", {
                    x1: "6",
                    y1: "6",
                    x2: "18",
                    y2: "18"
                  })
                ]
              })
            }),
            n === en && c.jsx(xf, {}),
            n === sr && c.jsx(If, {}),
            n === or && c.jsx(kf, {
              voiceRuntime: t
            }),
            n === ar && c.jsx(Sf, {}),
            n === ir && c.jsx(mf, {})
          ]
        })
      ]
    }), document.body);
  };
  const Nf = "hush_session", Rf = 500, Bs = "hush_tab_id";
  function Mf() {
    var _a2;
    let e = sessionStorage.getItem(Bs);
    return e || (e = ((_a2 = crypto.randomUUID) == null ? void 0 : _a2.call(crypto)) ?? `tab_${Date.now()}_${Math.random().toString(36).slice(2)}`, sessionStorage.setItem(Bs, e)), e;
  }
  function Uf() {
    const [e, t] = f.useState(false), n = f.useRef(null), r = f.useRef(false), s = f.useRef(Mf());
    f.useEffect(() => {
      let a;
      try {
        a = new BroadcastChannel(Nf);
      } catch {
        return;
      }
      n.current = a;
      const i = s.current, l = setTimeout(() => {
        r.current = true;
      }, Rf);
      return a.onmessage = (u) => {
        const { type: h, tabId: d } = u.data ?? {};
        if (h === "session_ping" && r.current) {
          a.postMessage({
            type: "session_active",
            tabId: i
          });
          return;
        }
        if (h === "session_active") {
          if (d === i) return;
          clearTimeout(l), t(true);
          return;
        }
        h === "session_takeover" && (r.current = false, t(true));
      }, a.postMessage({
        type: "session_ping",
        tabId: i
      }), () => {
        clearTimeout(l), a.onmessage = null, a.close(), n.current = null;
      };
    }, []);
    const o = f.useCallback(() => {
      const a = n.current;
      a && a.postMessage({
        type: "session_takeover"
      }), r.current = true, t(false);
    }, []);
    return {
      isBlockedTab: e,
      takeOver: o
    };
  }
  const Ns = 64, An = "unnamed", fr = "--";
  Lf = function(e) {
    if (typeof e != "string") return An;
    let t = e.trim().toLowerCase();
    return t = t.replace(/\s+/g, "-"), t = t.replace(/[^\p{L}\p{N}-]/gu, ""), t = t.replace(/-{2,}/g, "-"), t = t.replace(/^-+|-+$/g, ""), t.length > Ns && (t = t.slice(0, Ns).replace(/-+$/, "")), t || An;
  };
  Df = function(e, t) {
    const n = Lf(e ?? t);
    return t ? `${n}${fr}${t}` : n;
  };
  mh = function(e) {
    if (typeof e != "string" || e.length === 0) return {
      guildId: null,
      slug: An
    };
    const t = e.lastIndexOf(fr);
    return t <= 0 ? {
      guildId: null,
      slug: e
    } : {
      guildId: e.slice(t + fr.length) || null,
      slug: e.slice(0, t) || An
    };
  };
  const Rs = "hush_post_recovery_wizard";
  function Gf() {
    const e = Cn(), [t, n] = f.useState(false);
    f.useEffect(() => {
      localStorage.getItem(Rs) === "1" && (localStorage.removeItem(Rs), n(true));
    }, []);
    const r = () => {
      n(false), e("/link-device");
    }, s = () => {
      n(false);
    };
    return t ? c.jsx("div", {
      className: "post-recovery-overlay",
      role: "dialog",
      "aria-modal": "true",
      "aria-labelledby": "post-recovery-heading",
      children: c.jsxs("div", {
        className: "post-recovery-card",
        children: [
          c.jsx("h2", {
            id: "post-recovery-heading",
            className: "post-recovery-heading",
            children: "Account Secured"
          }),
          c.jsx("p", {
            className: "post-recovery-body",
            children: "Your account has been recovered. If you want to add another device now, open the approval flow on this trusted device."
          }),
          c.jsxs("div", {
            className: "post-recovery-actions",
            children: [
              c.jsx("button", {
                type: "button",
                className: "btn btn-primary",
                onClick: r,
                style: {
                  flex: 1,
                  padding: "10px"
                },
                children: "Link a Device"
              }),
              c.jsx("button", {
                type: "button",
                className: "btn btn-secondary",
                onClick: s,
                style: {
                  flex: 1,
                  padding: "10px"
                },
                children: "Skip"
              })
            ]
          })
        ]
      })
    }) : null;
  }
  tn(Hr());
  const $f = f.lazy(() => je(() => import("./Home-BbUDkX1k.js"), __vite__mapDeps([0,1,2,3,4,5,6]))), Ft = f.lazy(() => je(() => import("./Invite-DgTP-uU3.js"), __vite__mapDeps([7,1]))), Ms = f.lazy(() => je(() => import("./LinkDevice-Cq0gEbgb.js"), __vite__mapDeps([8,1,3,4]))), Us = f.lazy(() => je(() => import("./Room-DVvZi2N4.js"), __vite__mapDeps([9,1,10,2]))), Ls = f.lazy(() => je(() => import("./Roadmap-DPgOfnk9.js"), __vite__mapDeps([11,1]))), Xn = f.lazy(() => je(() => import("./ServerLayout-DvbLtwOj.js").then(async (m) => {
    await m.__tla;
    return m;
  }), __vite__mapDeps([12,1,10,2,5,6,4]))), Pf = f.lazy(() => je(() => import("./ExplorePage-Cu0Qs6u6.js"), __vite__mapDeps([13,1]))), nn = c.jsx("div", {
    style: {
      height: "100%",
      background: "var(--hush-black)"
    }
  });
  function Of() {
    const e = Cn(), [t] = Oa(), { mergedGuilds: n, guildsLoaded: r } = xa(), s = t.get("join"), o = t.get("returnTo");
    return f.useEffect(() => {
      if (o && o.startsWith("/") && !o.startsWith("//") && !o.startsWith("/?") && o !== "/") {
        e(o, {
          replace: true
        });
        return;
      }
      if (s) {
        e(`/invite/${encodeURIComponent(s)}`, {
          replace: true
        });
        return;
      }
      if (r) {
        if (n.length > 0) {
          const a = n[0], i = a.instanceUrl ? new URL(a.instanceUrl).host : null, l = Df(a._localName ?? a.name ?? a.id ?? "guild", a.id);
          if (i) {
            e(`/${i}/${l}`, {
              replace: true
            });
            return;
          }
        }
        e("/home", {
          replace: true
        });
      }
    }, [
      r,
      n,
      e,
      s,
      o
    ]), nn;
  }
  function Kf() {
    const { bootState: e } = Kd();
    return e === "loading" ? nn : e === "needs_login" || e === "needs_pin" || e === "pin_setup" ? c.jsx(f.Suspense, {
      fallback: nn,
      children: c.jsxs(Vr, {
        children: [
          c.jsx(ee, {
            path: "/join/:instance/:code",
            element: c.jsx(Ft, {})
          }),
          c.jsx(ee, {
            path: "/invite/:code",
            element: c.jsx(Ft, {})
          }),
          c.jsx(ee, {
            path: "/link-device",
            element: c.jsx(Ms, {})
          }),
          c.jsx(ee, {
            path: "/room/:roomName",
            element: c.jsx(Us, {})
          }),
          c.jsx(ee, {
            path: "/roadmap",
            element: c.jsx(Ls, {})
          }),
          c.jsx(ee, {
            path: "*",
            element: c.jsx($f, {})
          })
        ]
      })
    }) : c.jsxs(c.Fragment, {
      children: [
        c.jsx(Gf, {}),
        c.jsx(f.Suspense, {
          fallback: nn,
          children: c.jsxs(Vr, {
            children: [
              c.jsx(ee, {
                path: "/",
                element: c.jsx(Of, {})
              }),
              c.jsx(ee, {
                path: "/home",
                element: c.jsx(Xn, {})
              }),
              c.jsx(ee, {
                path: "/explore",
                element: c.jsx(Pf, {})
              }),
              c.jsx(ee, {
                path: "/join/:instance/:code",
                element: c.jsx(Ft, {})
              }),
              c.jsx(ee, {
                path: "/invite/:code",
                element: c.jsx(Ft, {})
              }),
              c.jsx(ee, {
                path: "/link-device",
                element: c.jsx(Ms, {})
              }),
              c.jsx(ee, {
                path: "/:instance/:guildSlug/:channelSlug?",
                element: c.jsx(Xn, {})
              }),
              c.jsx(ee, {
                path: "/servers/:serverId/*",
                element: c.jsx(Xn, {})
              }),
              c.jsx(ee, {
                path: "/guilds",
                element: c.jsx(Pn, {
                  to: "/home",
                  replace: true
                })
              }),
              c.jsx(ee, {
                path: "/channels",
                element: c.jsx(Pn, {
                  to: "/home",
                  replace: true
                })
              }),
              c.jsx(ee, {
                path: "/channels/:channelId",
                element: c.jsx(Pn, {
                  to: "/home",
                  replace: true
                })
              }),
              c.jsx(ee, {
                path: "/room/:roomName",
                element: c.jsx(Us, {})
              }),
              c.jsx(ee, {
                path: "/roadmap",
                element: c.jsx(Ls, {})
              })
            ]
          })
        })
      ]
    });
  }
  function Hf() {
    return f.useEffect(() => {
      const e = () => {
        const s = document.documentElement.getAttribute("data-theme");
        return s || (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
      }, t = () => {
        const s = e(), o = document.getElementById("favicon"), a = document.getElementById("apple-touch-icon");
        o && (o.href = s === "light" ? "/favicon-light.png" : "/favicon.png"), a && (a.href = s === "light" ? "/apple-touch-icon-light.png" : "/apple-touch-icon.png");
      };
      t();
      const n = new MutationObserver(t);
      n.observe(document.documentElement, {
        attributes: true,
        attributeFilter: [
          "data-theme"
        ]
      });
      const r = window.matchMedia("(prefers-color-scheme: light)");
      return r.addEventListener("change", t), () => {
        n.disconnect(), r.removeEventListener("change", t);
      };
    }, []), null;
  }
  function Vf({ blockedFlow: e, takeOver: t }) {
    return c.jsxs("div", {
      style: {
        position: "fixed",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--hush-black)",
        color: "var(--hush-text)",
        textAlign: "center",
        padding: "24px",
        zIndex: 9999
      },
      children: [
        c.jsx("p", {
          style: {
            fontSize: "1.1rem",
            marginBottom: "8px"
          },
          children: "Hush is already open in another tab."
        }),
        c.jsx("p", {
          style: {
            fontSize: "0.9rem",
            color: "var(--hush-text-muted)",
            marginBottom: "24px"
          },
          children: e === "device-link" ? "To approve this device here, take over this tab, then unlock Hush if required." : e === "invite" ? "To continue this invite here, take over this tab, then unlock Hush if required." : "Close the other tab or click below to use this one instead."
        }),
        c.jsx("button", {
          type: "button",
          className: "btn btn-primary",
          onClick: t,
          style: {
            padding: "10px 24px"
          },
          children: "Use this one instead"
        })
      ]
    });
  }
  function Wf() {
    const e = Pa(), { isBlockedTab: t, takeOver: n } = Uf(), r = e.pathname === "/link-device" ? "device-link" : e.pathname.startsWith("/invite/") || e.pathname.startsWith("/join/") ? "invite" : "generic";
    return t ? c.jsx(Vf, {
      blockedFlow: r,
      takeOver: n
    }) : c.jsx(wa, {
      children: c.jsx(Pd, {
        children: c.jsxs(Od, {
          children: [
            c.jsx(Hf, {}),
            c.jsx(Hd, {}),
            c.jsx(Kf, {})
          ]
        })
      })
    });
  }
  {
    let e = function(s, o = 0) {
      if (o > 4) return "[...]";
      if (s === null) return "null";
      if (s === void 0) return "undefined";
      if (typeof s == "string") return s;
      if (typeof s == "number" || typeof s == "boolean") return String(s);
      if (s instanceof Error) {
        const a = [
          s.name || "Error",
          s.message
        ];
        s.stack && a.push(`
` + s.stack);
        for (const i of Object.getOwnPropertyNames(s)) if (![
          "name",
          "message",
          "stack"
        ].includes(i)) try {
          a.push(`  ${i}: ${e(s[i], o + 1)}`);
        } catch {
        }
        return a.join(" | ");
      }
      if (Array.isArray(s)) return "[" + s.map((a) => e(a, o + 1)).join(", ") + "]";
      if (typeof s == "object") try {
        const a = Object.keys(s);
        return a.length === 0 ? "{}" : "{ " + a.map((i) => {
          try {
            return `${i}: ${e(s[i], o + 1)}`;
          } catch {
            return `${i}: [err]`;
          }
        }).join(", ") + " }";
      } catch {
        return String(s);
      }
      return String(s);
    };
    const t = [], r = () => (/* @__PURE__ */ new Date()).toISOString().slice(11, 23);
    for (const s of [
      "log",
      "warn",
      "error",
      "info",
      "debug"
    ]) {
      const o = console[s].bind(console);
      console[s] = (...a) => {
        const i = `[${r()}] [${s.toUpperCase()}] ${a.map((l) => e(l)).join(" ")}`;
        t.push(i), t.length > 1e3 && t.shift(), o(...a);
      };
    }
    window.addEventListener("error", (s) => {
      t.push(`[${r()}] [UNCAUGHT] ${s.message} at ${s.filename}:${s.lineno}:${s.colno}`);
    }), window.addEventListener("unhandledrejection", (s) => {
      t.push(`[${r()}] [UNHANDLED_REJECTION] ${e(s.reason)}`);
    }), window.__copyConsole = async () => {
      const s = t.join(`
`);
      try {
        await navigator.clipboard.writeText(s), alert(`Copied ${t.length} log entries`);
      } catch {
        prompt("Copy all:", s);
      }
    }, window.__clearBrowser = async () => {
      try {
        (await indexedDB.databases()).forEach((o) => indexedDB.deleteDatabase(o.name));
      } catch {
      }
      sessionStorage.clear(), localStorage.clear(), alert("Cleared. Reloading..."), location.reload();
    }, document.addEventListener("DOMContentLoaded", () => {
      const s = "hush:debug-toolbar-pos", o = (() => {
        try {
          return JSON.parse(localStorage.getItem(s));
        } catch {
          return null;
        }
      })(), a = document.createElement("div");
      Object.assign(a.style, {
        position: "fixed",
        left: (o == null ? void 0 : o.x) != null ? `${o.x}px` : "4px",
        top: (o == null ? void 0 : o.y) != null ? `${o.y}px` : "auto",
        bottom: (o == null ? void 0 : o.y) != null ? "auto" : "70px",
        zIndex: "99999",
        display: "flex",
        gap: "4px",
        opacity: "0.55",
        padding: "4px 6px",
        background: "#1a1a2e",
        border: "1px solid #444",
        borderRadius: "6px",
        cursor: "grab",
        userSelect: "none",
        touchAction: "none"
      }), a.addEventListener("mouseenter", () => {
        a.style.opacity = "1";
      }), a.addEventListener("mouseleave", () => {
        i || (a.style.opacity = "0.55");
      });
      let i = false, l = {
        x: 0,
        y: 0
      }, u = false;
      const h = (p) => {
        if (p.target.tagName === "BUTTON") return;
        i = true, u = false;
        const E = a.getBoundingClientRect();
        l = {
          x: p.clientX - E.left,
          y: p.clientY - E.top
        }, a.style.cursor = "grabbing", a.style.opacity = "1", a.setPointerCapture(p.pointerId);
      }, d = (p) => {
        if (!i) return;
        u = true;
        const E = Math.max(0, Math.min(p.clientX - l.x, window.innerWidth - a.offsetWidth)), R = Math.max(0, Math.min(p.clientY - l.y, window.innerHeight - a.offsetHeight));
        a.style.left = `${E}px`, a.style.top = `${R}px`, a.style.bottom = "auto";
      }, y = () => {
        if (i) {
          i = false, a.style.cursor = "grab", a.style.opacity = "0.55";
          try {
            localStorage.setItem(s, JSON.stringify({
              x: parseInt(a.style.left),
              y: parseInt(a.style.top)
            }));
          } catch {
          }
        }
      };
      a.addEventListener("pointerdown", h), a.addEventListener("pointermove", d), a.addEventListener("pointerup", y);
      const g = (p, E) => {
        const R = document.createElement("button");
        return R.textContent = p, R.onclick = (D) => {
          u || E();
        }, Object.assign(R.style, {
          padding: "3px 6px",
          fontSize: "10px",
          fontFamily: "monospace",
          background: "transparent",
          color: "#aaa",
          border: "none",
          cursor: "pointer",
          whiteSpace: "nowrap"
        }), R.addEventListener("mouseenter", () => {
          R.style.color = "#fff";
        }), R.addEventListener("mouseleave", () => {
          R.style.color = "#aaa";
        }), R;
      }, v = document.createElement("span");
      v.textContent = "\u2630", Object.assign(v.style, {
        fontSize: "11px",
        color: "#666",
        marginRight: "2px"
      }), a.appendChild(v), a.appendChild(g("Copy Log", () => window.__copyConsole())), a.appendChild(g("Wipe & Reload", () => window.__clearBrowser())), document.body.appendChild(a);
    }), je(async () => {
      const { default: s } = await import("./eruda-Cxe-79mO.js").then((o) => o.e);
      return {
        default: s
      };
    }, __vite__mapDeps([14,1])).then(({ default: s }) => s.init());
  }
  Jn.createRoot(document.getElementById("root")).render(c.jsx(Ka.StrictMode, {
    children: c.jsx(Ha, {
      future: {
        v7_startTransition: true,
        v7_relativeSplatPath: true
      },
      children: c.jsx(Wf, {})
    })
  }));
})();
export {
  Ru as $,
  _t as A,
  uh as B,
  dh as C,
  Ne as D,
  fh as E,
  Zd as F,
  bs as G,
  Vd as H,
  qf as I,
  nh as J,
  Wu as K,
  th as L,
  eh as M,
  xl as N,
  Xf as O,
  pu as P,
  ih as Q,
  ch as R,
  oh as S,
  Or as T,
  Il as U,
  Jf as V,
  Cu as W,
  bu as X,
  Au as Y,
  Gu as Z,
  Nu as _,
  __tla,
  Yf as a,
  Mu as a0,
  Uu as a1,
  ku as a2,
  xu as a3,
  Su as a4,
  Iu as a5,
  sl as a6,
  ud as a7,
  Xl as a8,
  wl as a9,
  yh as aA,
  mh as aB,
  Lf as aC,
  sh as aD,
  tl as aE,
  pt as aF,
  lu as aG,
  of as aH,
  je as aI,
  gl as aJ,
  pl as aK,
  qt as aL,
  Df as aM,
  Ql as aN,
  gh as aO,
  Kr as aP,
  Aa as aQ,
  id as aR,
  ld as aS,
  hh as aT,
  ya as aa,
  Bu as ab,
  Tu as ac,
  _u as ad,
  at as ae,
  $u as af,
  Ho as ag,
  iu as ah,
  au as ai,
  ca as aj,
  cu as ak,
  ou as al,
  ia as am,
  ed as an,
  Qu as ao,
  qu as ap,
  od as aq,
  sd as ar,
  rd as as,
  nd as at,
  td as au,
  Ju as av,
  Xu as aw,
  Yu as ax,
  cd as ay,
  ad as az,
  ga as b,
  du as c,
  xa as d,
  Qf as e,
  rh as f,
  Zf as g,
  Ge as h,
  zf as i,
  c as j,
  Eu as k,
  ju as l,
  kr as m,
  nc as n,
  El as o,
  Ir as p,
  qc as q,
  gu as r,
  ah as s,
  nl as t,
  It as u,
  lh as v,
  yu as w,
  hu as x,
  mu as y,
  hs as z
};
