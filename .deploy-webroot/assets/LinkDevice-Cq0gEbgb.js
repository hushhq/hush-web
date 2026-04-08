import { m as Ye, n as Ge, p as We, j as d, u as ve, r as Xe, q as Ze, h as Z, t as $e, o as et, v as tt, w as nt, x as rt, y as ot } from "./index-BefR8mbE.js";
import { u as Ne, b as it, d as st, r as A, L as Se } from "./vendor-react-2AhYlJPv.js";
import { u as at, A as ct } from "./useAuthInstanceSelection-Ca_fYGiR.js";
import { u as lt, B as ut } from "./useBodyScrollMode-D02fsC65.js";
var Q = {}, dt = function() {
  return typeof Promise == "function" && Promise.prototype && Promise.prototype.then;
}, Ie = {}, R = {};
let ge;
const ft = [0, 26, 44, 70, 100, 134, 172, 196, 242, 292, 346, 404, 466, 532, 581, 655, 733, 815, 901, 991, 1085, 1156, 1258, 1364, 1474, 1588, 1706, 1828, 1921, 2051, 2185, 2323, 2465, 2611, 2761, 2876, 3034, 3196, 3362, 3532, 3706];
R.getSymbolSize = function(t) {
  if (!t) throw new Error('"version" cannot be null or undefined');
  if (t < 1 || t > 40) throw new Error('"version" should be in range from 1 to 40');
  return t * 4 + 17;
};
R.getSymbolTotalCodewords = function(t) {
  return ft[t];
};
R.getBCHDigit = function(e) {
  let t = 0;
  for (; e !== 0; ) t++, e >>>= 1;
  return t;
};
R.setToSJISFunction = function(t) {
  if (typeof t != "function") throw new Error('"toSJISFunc" is not a valid function.');
  ge = t;
};
R.isKanjiModeEnabled = function() {
  return typeof ge < "u";
};
R.toSJIS = function(t) {
  return ge(t);
};
var te = {};
(function(e) {
  e.L = { bit: 1 }, e.M = { bit: 0 }, e.Q = { bit: 3 }, e.H = { bit: 2 };
  function t(r) {
    if (typeof r != "string") throw new Error("Param is not a string");
    switch (r.toLowerCase()) {
      case "l":
      case "low":
        return e.L;
      case "m":
      case "medium":
        return e.M;
      case "q":
      case "quartile":
        return e.Q;
      case "h":
      case "high":
        return e.H;
      default:
        throw new Error("Unknown EC Level: " + r);
    }
  }
  e.isValid = function(o) {
    return o && typeof o.bit < "u" && o.bit >= 0 && o.bit < 4;
  }, e.from = function(o, n) {
    if (e.isValid(o)) return o;
    try {
      return t(o);
    } catch {
      return n;
    }
  };
})(te);
function Ae() {
  this.buffer = [], this.length = 0;
}
Ae.prototype = { get: function(e) {
  const t = Math.floor(e / 8);
  return (this.buffer[t] >>> 7 - e % 8 & 1) === 1;
}, put: function(e, t) {
  for (let r = 0; r < t; r++) this.putBit((e >>> t - r - 1 & 1) === 1);
}, getLengthInBits: function() {
  return this.length;
}, putBit: function(e) {
  const t = Math.floor(this.length / 8);
  this.buffer.length <= t && this.buffer.push(0), e && (this.buffer[t] |= 128 >>> this.length % 8), this.length++;
} };
var ht = Ae;
function Y(e) {
  if (!e || e < 1) throw new Error("BitMatrix size must be defined and greater than 0");
  this.size = e, this.data = new Uint8Array(e * e), this.reservedBit = new Uint8Array(e * e);
}
Y.prototype.set = function(e, t, r, o) {
  const n = e * this.size + t;
  this.data[n] = r, o && (this.reservedBit[n] = true);
};
Y.prototype.get = function(e, t) {
  return this.data[e * this.size + t];
};
Y.prototype.xor = function(e, t, r) {
  this.data[e * this.size + t] ^= r;
};
Y.prototype.isReserved = function(e, t) {
  return this.reservedBit[e * this.size + t];
};
var gt = Y, Be = {};
(function(e) {
  const t = R.getSymbolSize;
  e.getRowColCoords = function(o) {
    if (o === 1) return [];
    const n = Math.floor(o / 7) + 2, i = t(o), s = i === 145 ? 26 : Math.ceil((i - 13) / (2 * n - 2)) * 2, c = [i - 7];
    for (let a = 1; a < n - 1; a++) c[a] = c[a - 1] - s;
    return c.push(6), c.reverse();
  }, e.getPositions = function(o) {
    const n = [], i = e.getRowColCoords(o), s = i.length;
    for (let c = 0; c < s; c++) for (let a = 0; a < s; a++) c === 0 && a === 0 || c === 0 && a === s - 1 || c === s - 1 && a === 0 || n.push([i[c], i[a]]);
    return n;
  };
})(Be);
var Pe = {};
const mt = R.getSymbolSize, Ce = 7;
Pe.getPositions = function(t) {
  const r = mt(t);
  return [[0, 0], [r - Ce, 0], [0, r - Ce]];
};
var Re = {};
(function(e) {
  e.Patterns = { PATTERN000: 0, PATTERN001: 1, PATTERN010: 2, PATTERN011: 3, PATTERN100: 4, PATTERN101: 5, PATTERN110: 6, PATTERN111: 7 };
  const t = { N1: 3, N2: 3, N3: 40, N4: 10 };
  e.isValid = function(n) {
    return n != null && n !== "" && !isNaN(n) && n >= 0 && n <= 7;
  }, e.from = function(n) {
    return e.isValid(n) ? parseInt(n, 10) : void 0;
  }, e.getPenaltyN1 = function(n) {
    const i = n.size;
    let s = 0, c = 0, a = 0, u = null, l = null;
    for (let E = 0; E < i; E++) {
      c = a = 0, u = l = null;
      for (let y = 0; y < i; y++) {
        let f = n.get(E, y);
        f === u ? c++ : (c >= 5 && (s += t.N1 + (c - 5)), u = f, c = 1), f = n.get(y, E), f === l ? a++ : (a >= 5 && (s += t.N1 + (a - 5)), l = f, a = 1);
      }
      c >= 5 && (s += t.N1 + (c - 5)), a >= 5 && (s += t.N1 + (a - 5));
    }
    return s;
  }, e.getPenaltyN2 = function(n) {
    const i = n.size;
    let s = 0;
    for (let c = 0; c < i - 1; c++) for (let a = 0; a < i - 1; a++) {
      const u = n.get(c, a) + n.get(c, a + 1) + n.get(c + 1, a) + n.get(c + 1, a + 1);
      (u === 4 || u === 0) && s++;
    }
    return s * t.N2;
  }, e.getPenaltyN3 = function(n) {
    const i = n.size;
    let s = 0, c = 0, a = 0;
    for (let u = 0; u < i; u++) {
      c = a = 0;
      for (let l = 0; l < i; l++) c = c << 1 & 2047 | n.get(u, l), l >= 10 && (c === 1488 || c === 93) && s++, a = a << 1 & 2047 | n.get(l, u), l >= 10 && (a === 1488 || a === 93) && s++;
    }
    return s * t.N3;
  }, e.getPenaltyN4 = function(n) {
    let i = 0;
    const s = n.data.length;
    for (let a = 0; a < s; a++) i += n.data[a];
    return Math.abs(Math.ceil(i * 100 / s / 5) - 10) * t.N4;
  };
  function r(o, n, i) {
    switch (o) {
      case e.Patterns.PATTERN000:
        return (n + i) % 2 === 0;
      case e.Patterns.PATTERN001:
        return n % 2 === 0;
      case e.Patterns.PATTERN010:
        return i % 3 === 0;
      case e.Patterns.PATTERN011:
        return (n + i) % 3 === 0;
      case e.Patterns.PATTERN100:
        return (Math.floor(n / 2) + Math.floor(i / 3)) % 2 === 0;
      case e.Patterns.PATTERN101:
        return n * i % 2 + n * i % 3 === 0;
      case e.Patterns.PATTERN110:
        return (n * i % 2 + n * i % 3) % 2 === 0;
      case e.Patterns.PATTERN111:
        return (n * i % 3 + (n + i) % 2) % 2 === 0;
      default:
        throw new Error("bad maskPattern:" + o);
    }
  }
  e.applyMask = function(n, i) {
    const s = i.size;
    for (let c = 0; c < s; c++) for (let a = 0; a < s; a++) i.isReserved(a, c) || i.xor(a, c, r(n, a, c));
  }, e.getBestMask = function(n, i) {
    const s = Object.keys(e.Patterns).length;
    let c = 0, a = 1 / 0;
    for (let u = 0; u < s; u++) {
      i(u), e.applyMask(u, n);
      const l = e.getPenaltyN1(n) + e.getPenaltyN2(n) + e.getPenaltyN3(n) + e.getPenaltyN4(n);
      e.applyMask(u, n), l < a && (a = l, c = u);
    }
    return c;
  };
})(Re);
var ne = {};
const D = te, W = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 2, 2, 4, 1, 2, 4, 4, 2, 4, 4, 4, 2, 4, 6, 5, 2, 4, 6, 6, 2, 5, 8, 8, 4, 5, 8, 8, 4, 5, 8, 11, 4, 8, 10, 11, 4, 9, 12, 16, 4, 9, 16, 16, 6, 10, 12, 18, 6, 10, 17, 16, 6, 11, 16, 19, 6, 13, 18, 21, 7, 14, 21, 25, 8, 16, 20, 25, 8, 17, 23, 25, 9, 17, 23, 34, 9, 18, 25, 30, 10, 20, 27, 32, 12, 21, 29, 35, 12, 23, 34, 37, 12, 25, 34, 40, 13, 26, 35, 42, 14, 28, 38, 45, 15, 29, 40, 48, 16, 31, 43, 51, 17, 33, 45, 54, 18, 35, 48, 57, 19, 37, 51, 60, 19, 38, 53, 63, 20, 40, 56, 66, 21, 43, 59, 70, 22, 45, 62, 74, 24, 47, 65, 77, 25, 49, 68, 81], X = [7, 10, 13, 17, 10, 16, 22, 28, 15, 26, 36, 44, 20, 36, 52, 64, 26, 48, 72, 88, 36, 64, 96, 112, 40, 72, 108, 130, 48, 88, 132, 156, 60, 110, 160, 192, 72, 130, 192, 224, 80, 150, 224, 264, 96, 176, 260, 308, 104, 198, 288, 352, 120, 216, 320, 384, 132, 240, 360, 432, 144, 280, 408, 480, 168, 308, 448, 532, 180, 338, 504, 588, 196, 364, 546, 650, 224, 416, 600, 700, 224, 442, 644, 750, 252, 476, 690, 816, 270, 504, 750, 900, 300, 560, 810, 960, 312, 588, 870, 1050, 336, 644, 952, 1110, 360, 700, 1020, 1200, 390, 728, 1050, 1260, 420, 784, 1140, 1350, 450, 812, 1200, 1440, 480, 868, 1290, 1530, 510, 924, 1350, 1620, 540, 980, 1440, 1710, 570, 1036, 1530, 1800, 570, 1064, 1590, 1890, 600, 1120, 1680, 1980, 630, 1204, 1770, 2100, 660, 1260, 1860, 2220, 720, 1316, 1950, 2310, 750, 1372, 2040, 2430];
ne.getBlocksCount = function(t, r) {
  switch (r) {
    case D.L:
      return W[(t - 1) * 4 + 0];
    case D.M:
      return W[(t - 1) * 4 + 1];
    case D.Q:
      return W[(t - 1) * 4 + 2];
    case D.H:
      return W[(t - 1) * 4 + 3];
    default:
      return;
  }
};
ne.getTotalCodewordsCount = function(t, r) {
  switch (r) {
    case D.L:
      return X[(t - 1) * 4 + 0];
    case D.M:
      return X[(t - 1) * 4 + 1];
    case D.Q:
      return X[(t - 1) * 4 + 2];
    case D.H:
      return X[(t - 1) * 4 + 3];
    default:
      return;
  }
};
var Te = {}, re = {};
const V = new Uint8Array(512), $ = new Uint8Array(256);
(function() {
  let t = 1;
  for (let r = 0; r < 255; r++) V[r] = t, $[t] = r, t <<= 1, t & 256 && (t ^= 285);
  for (let r = 255; r < 512; r++) V[r] = V[r - 255];
})();
re.log = function(t) {
  if (t < 1) throw new Error("log(" + t + ")");
  return $[t];
};
re.exp = function(t) {
  return V[t];
};
re.mul = function(t, r) {
  return t === 0 || r === 0 ? 0 : V[$[t] + $[r]];
};
(function(e) {
  const t = re;
  e.mul = function(o, n) {
    const i = new Uint8Array(o.length + n.length - 1);
    for (let s = 0; s < o.length; s++) for (let c = 0; c < n.length; c++) i[s + c] ^= t.mul(o[s], n[c]);
    return i;
  }, e.mod = function(o, n) {
    let i = new Uint8Array(o);
    for (; i.length - n.length >= 0; ) {
      const s = i[0];
      for (let a = 0; a < n.length; a++) i[a] ^= t.mul(n[a], s);
      let c = 0;
      for (; c < i.length && i[c] === 0; ) c++;
      i = i.slice(c);
    }
    return i;
  }, e.generateECPolynomial = function(o) {
    let n = new Uint8Array([1]);
    for (let i = 0; i < o; i++) n = e.mul(n, new Uint8Array([1, t.exp(i)]));
    return n;
  };
})(Te);
const Me = Te;
function me(e) {
  this.genPoly = void 0, this.degree = e, this.degree && this.initialize(this.degree);
}
me.prototype.initialize = function(t) {
  this.degree = t, this.genPoly = Me.generateECPolynomial(this.degree);
};
me.prototype.encode = function(t) {
  if (!this.genPoly) throw new Error("Encoder not initialized");
  const r = new Uint8Array(t.length + this.degree);
  r.set(t);
  const o = Me.mod(r, this.genPoly), n = this.degree - o.length;
  if (n > 0) {
    const i = new Uint8Array(this.degree);
    return i.set(o, n), i;
  }
  return o;
};
var yt = me, Le = {}, K = {}, ye = {};
ye.isValid = function(t) {
  return !isNaN(t) && t >= 1 && t <= 40;
};
var k = {};
const ke = "[0-9]+", pt = "[A-Z $%*+\\-./:]+";
let J = "(?:[u3000-u303F]|[u3040-u309F]|[u30A0-u30FF]|[uFF00-uFFEF]|[u4E00-u9FAF]|[u2605-u2606]|[u2190-u2195]|u203B|[u2010u2015u2018u2019u2025u2026u201Cu201Du2225u2260]|[u0391-u0451]|[u00A7u00A8u00B1u00B4u00D7u00F7])+";
J = J.replace(/u/g, "\\u");
const wt = "(?:(?![A-Z0-9 $%*+\\-./:]|" + J + `)(?:.|[\r
]))+`;
k.KANJI = new RegExp(J, "g");
k.BYTE_KANJI = new RegExp("[^A-Z0-9 $%*+\\-./:]+", "g");
k.BYTE = new RegExp(wt, "g");
k.NUMERIC = new RegExp(ke, "g");
k.ALPHANUMERIC = new RegExp(pt, "g");
const Ct = new RegExp("^" + J + "$"), bt = new RegExp("^" + ke + "$"), Et = new RegExp("^[A-Z0-9 $%*+\\-./:]+$");
k.testKanji = function(t) {
  return Ct.test(t);
};
k.testNumeric = function(t) {
  return bt.test(t);
};
k.testAlphanumeric = function(t) {
  return Et.test(t);
};
(function(e) {
  const t = ye, r = k;
  e.NUMERIC = { id: "Numeric", bit: 1, ccBits: [10, 12, 14] }, e.ALPHANUMERIC = { id: "Alphanumeric", bit: 2, ccBits: [9, 11, 13] }, e.BYTE = { id: "Byte", bit: 4, ccBits: [8, 16, 16] }, e.KANJI = { id: "Kanji", bit: 8, ccBits: [8, 10, 12] }, e.MIXED = { bit: -1 }, e.getCharCountIndicator = function(i, s) {
    if (!i.ccBits) throw new Error("Invalid mode: " + i);
    if (!t.isValid(s)) throw new Error("Invalid version: " + s);
    return s >= 1 && s < 10 ? i.ccBits[0] : s < 27 ? i.ccBits[1] : i.ccBits[2];
  }, e.getBestModeForData = function(i) {
    return r.testNumeric(i) ? e.NUMERIC : r.testAlphanumeric(i) ? e.ALPHANUMERIC : r.testKanji(i) ? e.KANJI : e.BYTE;
  }, e.toString = function(i) {
    if (i && i.id) return i.id;
    throw new Error("Invalid mode");
  }, e.isValid = function(i) {
    return i && i.bit && i.ccBits;
  };
  function o(n) {
    if (typeof n != "string") throw new Error("Param is not a string");
    switch (n.toLowerCase()) {
      case "numeric":
        return e.NUMERIC;
      case "alphanumeric":
        return e.ALPHANUMERIC;
      case "kanji":
        return e.KANJI;
      case "byte":
        return e.BYTE;
      default:
        throw new Error("Unknown mode: " + n);
    }
  }
  e.from = function(i, s) {
    if (e.isValid(i)) return i;
    try {
      return o(i);
    } catch {
      return s;
    }
  };
})(K);
(function(e) {
  const t = R, r = ne, o = te, n = K, i = ye, s = 7973, c = t.getBCHDigit(s);
  function a(y, f, p) {
    for (let C = 1; C <= 40; C++) if (f <= e.getCapacity(C, p, y)) return C;
  }
  function u(y, f) {
    return n.getCharCountIndicator(y, f) + 4;
  }
  function l(y, f) {
    let p = 0;
    return y.forEach(function(C) {
      const N = u(C.mode, f);
      p += N + C.getBitsLength();
    }), p;
  }
  function E(y, f) {
    for (let p = 1; p <= 40; p++) if (l(y, p) <= e.getCapacity(p, f, n.MIXED)) return p;
  }
  e.from = function(f, p) {
    return i.isValid(f) ? parseInt(f, 10) : p;
  }, e.getCapacity = function(f, p, C) {
    if (!i.isValid(f)) throw new Error("Invalid QR Code version");
    typeof C > "u" && (C = n.BYTE);
    const N = t.getSymbolTotalCodewords(f), m = r.getTotalCodewordsCount(f, p), w = (N - m) * 8;
    if (C === n.MIXED) return w;
    const h = w - u(C, f);
    switch (C) {
      case n.NUMERIC:
        return Math.floor(h / 10 * 3);
      case n.ALPHANUMERIC:
        return Math.floor(h / 11 * 2);
      case n.KANJI:
        return Math.floor(h / 13);
      case n.BYTE:
      default:
        return Math.floor(h / 8);
    }
  }, e.getBestVersionForData = function(f, p) {
    let C;
    const N = o.from(p, o.M);
    if (Array.isArray(f)) {
      if (f.length > 1) return E(f, N);
      if (f.length === 0) return 1;
      C = f[0];
    } else C = f;
    return a(C.mode, C.getLength(), N);
  }, e.getEncodedBits = function(f) {
    if (!i.isValid(f) || f < 7) throw new Error("Invalid QR Code version");
    let p = f << 12;
    for (; t.getBCHDigit(p) - c >= 0; ) p ^= s << t.getBCHDigit(p) - c;
    return f << 12 | p;
  };
})(Le);
var De = {};
const ue = R, Ke = 1335, vt = 21522, be = ue.getBCHDigit(Ke);
De.getEncodedBits = function(t, r) {
  const o = t.bit << 3 | r;
  let n = o << 10;
  for (; ue.getBCHDigit(n) - be >= 0; ) n ^= Ke << ue.getBCHDigit(n) - be;
  return (o << 10 | n) ^ vt;
};
var Ue = {};
const Nt = K;
function _(e) {
  this.mode = Nt.NUMERIC, this.data = e.toString();
}
_.getBitsLength = function(t) {
  return 10 * Math.floor(t / 3) + (t % 3 ? t % 3 * 3 + 1 : 0);
};
_.prototype.getLength = function() {
  return this.data.length;
};
_.prototype.getBitsLength = function() {
  return _.getBitsLength(this.data.length);
};
_.prototype.write = function(t) {
  let r, o, n;
  for (r = 0; r + 3 <= this.data.length; r += 3) o = this.data.substr(r, 3), n = parseInt(o, 10), t.put(n, 10);
  const i = this.data.length - r;
  i > 0 && (o = this.data.substr(r), n = parseInt(o, 10), t.put(n, i * 3 + 1));
};
var St = _;
const It = K, ie = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", " ", "$", "%", "*", "+", "-", ".", "/", ":"];
function F(e) {
  this.mode = It.ALPHANUMERIC, this.data = e;
}
F.getBitsLength = function(t) {
  return 11 * Math.floor(t / 2) + 6 * (t % 2);
};
F.prototype.getLength = function() {
  return this.data.length;
};
F.prototype.getBitsLength = function() {
  return F.getBitsLength(this.data.length);
};
F.prototype.write = function(t) {
  let r;
  for (r = 0; r + 2 <= this.data.length; r += 2) {
    let o = ie.indexOf(this.data[r]) * 45;
    o += ie.indexOf(this.data[r + 1]), t.put(o, 11);
  }
  this.data.length % 2 && t.put(ie.indexOf(this.data[r]), 6);
};
var At = F;
const Bt = K;
function q(e) {
  this.mode = Bt.BYTE, typeof e == "string" ? this.data = new TextEncoder().encode(e) : this.data = new Uint8Array(e);
}
q.getBitsLength = function(t) {
  return t * 8;
};
q.prototype.getLength = function() {
  return this.data.length;
};
q.prototype.getBitsLength = function() {
  return q.getBitsLength(this.data.length);
};
q.prototype.write = function(e) {
  for (let t = 0, r = this.data.length; t < r; t++) e.put(this.data[t], 8);
};
var Pt = q;
const Rt = K, Tt = R;
function z(e) {
  this.mode = Rt.KANJI, this.data = e;
}
z.getBitsLength = function(t) {
  return t * 13;
};
z.prototype.getLength = function() {
  return this.data.length;
};
z.prototype.getBitsLength = function() {
  return z.getBitsLength(this.data.length);
};
z.prototype.write = function(e) {
  let t;
  for (t = 0; t < this.data.length; t++) {
    let r = Tt.toSJIS(this.data[t]);
    if (r >= 33088 && r <= 40956) r -= 33088;
    else if (r >= 57408 && r <= 60351) r -= 49472;
    else throw new Error("Invalid SJIS character: " + this.data[t] + `
Make sure your charset is UTF-8`);
    r = (r >>> 8 & 255) * 192 + (r & 255), e.put(r, 13);
  }
};
var Mt = z, je = { exports: {} };
(function(e) {
  var t = { single_source_shortest_paths: function(r, o, n) {
    var i = {}, s = {};
    s[o] = 0;
    var c = t.PriorityQueue.make();
    c.push(o, 0);
    for (var a, u, l, E, y, f, p, C, N; !c.empty(); ) {
      a = c.pop(), u = a.value, E = a.cost, y = r[u] || {};
      for (l in y) y.hasOwnProperty(l) && (f = y[l], p = E + f, C = s[l], N = typeof s[l] > "u", (N || C > p) && (s[l] = p, c.push(l, p), i[l] = u));
    }
    if (typeof n < "u" && typeof s[n] > "u") {
      var m = ["Could not find a path from ", o, " to ", n, "."].join("");
      throw new Error(m);
    }
    return i;
  }, extract_shortest_path_from_predecessor_list: function(r, o) {
    for (var n = [], i = o; i; ) n.push(i), r[i], i = r[i];
    return n.reverse(), n;
  }, find_path: function(r, o, n) {
    var i = t.single_source_shortest_paths(r, o, n);
    return t.extract_shortest_path_from_predecessor_list(i, n);
  }, PriorityQueue: { make: function(r) {
    var o = t.PriorityQueue, n = {}, i;
    r = r || {};
    for (i in o) o.hasOwnProperty(i) && (n[i] = o[i]);
    return n.queue = [], n.sorter = r.sorter || o.default_sorter, n;
  }, default_sorter: function(r, o) {
    return r.cost - o.cost;
  }, push: function(r, o) {
    var n = { value: r, cost: o };
    this.queue.push(n), this.queue.sort(this.sorter);
  }, pop: function() {
    return this.queue.shift();
  }, empty: function() {
    return this.queue.length === 0;
  } } };
  e.exports = t;
})(je);
var Lt = je.exports;
(function(e) {
  const t = K, r = St, o = At, n = Pt, i = Mt, s = k, c = R, a = Lt;
  function u(m) {
    return unescape(encodeURIComponent(m)).length;
  }
  function l(m, w, h) {
    const g = [];
    let b;
    for (; (b = m.exec(h)) !== null; ) g.push({ data: b[0], index: b.index, mode: w, length: b[0].length });
    return g;
  }
  function E(m) {
    const w = l(s.NUMERIC, t.NUMERIC, m), h = l(s.ALPHANUMERIC, t.ALPHANUMERIC, m);
    let g, b;
    return c.isKanjiModeEnabled() ? (g = l(s.BYTE, t.BYTE, m), b = l(s.KANJI, t.KANJI, m)) : (g = l(s.BYTE_KANJI, t.BYTE, m), b = []), w.concat(h, g, b).sort(function(S, B) {
      return S.index - B.index;
    }).map(function(S) {
      return { data: S.data, mode: S.mode, length: S.length };
    });
  }
  function y(m, w) {
    switch (w) {
      case t.NUMERIC:
        return r.getBitsLength(m);
      case t.ALPHANUMERIC:
        return o.getBitsLength(m);
      case t.KANJI:
        return i.getBitsLength(m);
      case t.BYTE:
        return n.getBitsLength(m);
    }
  }
  function f(m) {
    return m.reduce(function(w, h) {
      const g = w.length - 1 >= 0 ? w[w.length - 1] : null;
      return g && g.mode === h.mode ? (w[w.length - 1].data += h.data, w) : (w.push(h), w);
    }, []);
  }
  function p(m) {
    const w = [];
    for (let h = 0; h < m.length; h++) {
      const g = m[h];
      switch (g.mode) {
        case t.NUMERIC:
          w.push([g, { data: g.data, mode: t.ALPHANUMERIC, length: g.length }, { data: g.data, mode: t.BYTE, length: g.length }]);
          break;
        case t.ALPHANUMERIC:
          w.push([g, { data: g.data, mode: t.BYTE, length: g.length }]);
          break;
        case t.KANJI:
          w.push([g, { data: g.data, mode: t.BYTE, length: u(g.data) }]);
          break;
        case t.BYTE:
          w.push([{ data: g.data, mode: t.BYTE, length: u(g.data) }]);
      }
    }
    return w;
  }
  function C(m, w) {
    const h = {}, g = { start: {} };
    let b = ["start"];
    for (let v = 0; v < m.length; v++) {
      const S = m[v], B = [];
      for (let I = 0; I < S.length; I++) {
        const P = S[I], T = "" + v + I;
        B.push(T), h[T] = { node: P, lastCount: 0 }, g[T] = {};
        for (let H = 0; H < b.length; H++) {
          const M = b[H];
          h[M] && h[M].node.mode === P.mode ? (g[M][T] = y(h[M].lastCount + P.length, P.mode) - y(h[M].lastCount, P.mode), h[M].lastCount += P.length) : (h[M] && (h[M].lastCount = P.length), g[M][T] = y(P.length, P.mode) + 4 + t.getCharCountIndicator(P.mode, w));
        }
      }
      b = B;
    }
    for (let v = 0; v < b.length; v++) g[b[v]].end = 0;
    return { map: g, table: h };
  }
  function N(m, w) {
    let h;
    const g = t.getBestModeForData(m);
    if (h = t.from(w, g), h !== t.BYTE && h.bit < g.bit) throw new Error('"' + m + '" cannot be encoded with mode ' + t.toString(h) + `.
 Suggested mode is: ` + t.toString(g));
    switch (h === t.KANJI && !c.isKanjiModeEnabled() && (h = t.BYTE), h) {
      case t.NUMERIC:
        return new r(m);
      case t.ALPHANUMERIC:
        return new o(m);
      case t.KANJI:
        return new i(m);
      case t.BYTE:
        return new n(m);
    }
  }
  e.fromArray = function(w) {
    return w.reduce(function(h, g) {
      return typeof g == "string" ? h.push(N(g, null)) : g.data && h.push(N(g.data, g.mode)), h;
    }, []);
  }, e.fromString = function(w, h) {
    const g = E(w, c.isKanjiModeEnabled()), b = p(g), v = C(b, h), S = a.find_path(v.map, "start", "end"), B = [];
    for (let I = 1; I < S.length - 1; I++) B.push(v.table[S[I]].node);
    return e.fromArray(f(B));
  }, e.rawSplit = function(w) {
    return e.fromArray(E(w, c.isKanjiModeEnabled()));
  };
})(Ue);
const oe = R, se = te, kt = ht, Dt = gt, Kt = Be, Ut = Pe, de = Re, fe = ne, jt = yt, ee = Le, xt = De, _t = K, ae = Ue;
function Ft(e, t) {
  const r = e.size, o = Ut.getPositions(t);
  for (let n = 0; n < o.length; n++) {
    const i = o[n][0], s = o[n][1];
    for (let c = -1; c <= 7; c++) if (!(i + c <= -1 || r <= i + c)) for (let a = -1; a <= 7; a++) s + a <= -1 || r <= s + a || (c >= 0 && c <= 6 && (a === 0 || a === 6) || a >= 0 && a <= 6 && (c === 0 || c === 6) || c >= 2 && c <= 4 && a >= 2 && a <= 4 ? e.set(i + c, s + a, true, true) : e.set(i + c, s + a, false, true));
  }
}
function qt(e) {
  const t = e.size;
  for (let r = 8; r < t - 8; r++) {
    const o = r % 2 === 0;
    e.set(r, 6, o, true), e.set(6, r, o, true);
  }
}
function zt(e, t) {
  const r = Kt.getPositions(t);
  for (let o = 0; o < r.length; o++) {
    const n = r[o][0], i = r[o][1];
    for (let s = -2; s <= 2; s++) for (let c = -2; c <= 2; c++) s === -2 || s === 2 || c === -2 || c === 2 || s === 0 && c === 0 ? e.set(n + s, i + c, true, true) : e.set(n + s, i + c, false, true);
  }
}
function Ot(e, t) {
  const r = e.size, o = ee.getEncodedBits(t);
  let n, i, s;
  for (let c = 0; c < 18; c++) n = Math.floor(c / 3), i = c % 3 + r - 8 - 3, s = (o >> c & 1) === 1, e.set(n, i, s, true), e.set(i, n, s, true);
}
function ce(e, t, r) {
  const o = e.size, n = xt.getEncodedBits(t, r);
  let i, s;
  for (i = 0; i < 15; i++) s = (n >> i & 1) === 1, i < 6 ? e.set(i, 8, s, true) : i < 8 ? e.set(i + 1, 8, s, true) : e.set(o - 15 + i, 8, s, true), i < 8 ? e.set(8, o - i - 1, s, true) : i < 9 ? e.set(8, 15 - i - 1 + 1, s, true) : e.set(8, 15 - i - 1, s, true);
  e.set(o - 8, 8, 1, true);
}
function Ht(e, t) {
  const r = e.size;
  let o = -1, n = r - 1, i = 7, s = 0;
  for (let c = r - 1; c > 0; c -= 2) for (c === 6 && c--; ; ) {
    for (let a = 0; a < 2; a++) if (!e.isReserved(n, c - a)) {
      let u = false;
      s < t.length && (u = (t[s] >>> i & 1) === 1), e.set(n, c - a, u), i--, i === -1 && (s++, i = 7);
    }
    if (n += o, n < 0 || r <= n) {
      n -= o, o = -o;
      break;
    }
  }
}
function Vt(e, t, r) {
  const o = new kt();
  r.forEach(function(a) {
    o.put(a.mode.bit, 4), o.put(a.getLength(), _t.getCharCountIndicator(a.mode, e)), a.write(o);
  });
  const n = oe.getSymbolTotalCodewords(e), i = fe.getTotalCodewordsCount(e, t), s = (n - i) * 8;
  for (o.getLengthInBits() + 4 <= s && o.put(0, 4); o.getLengthInBits() % 8 !== 0; ) o.putBit(0);
  const c = (s - o.getLengthInBits()) / 8;
  for (let a = 0; a < c; a++) o.put(a % 2 ? 17 : 236, 8);
  return Jt(o, e, t);
}
function Jt(e, t, r) {
  const o = oe.getSymbolTotalCodewords(t), n = fe.getTotalCodewordsCount(t, r), i = o - n, s = fe.getBlocksCount(t, r), c = o % s, a = s - c, u = Math.floor(o / s), l = Math.floor(i / s), E = l + 1, y = u - l, f = new jt(y);
  let p = 0;
  const C = new Array(s), N = new Array(s);
  let m = 0;
  const w = new Uint8Array(e.buffer);
  for (let S = 0; S < s; S++) {
    const B = S < a ? l : E;
    C[S] = w.slice(p, p + B), N[S] = f.encode(C[S]), p += B, m = Math.max(m, B);
  }
  const h = new Uint8Array(o);
  let g = 0, b, v;
  for (b = 0; b < m; b++) for (v = 0; v < s; v++) b < C[v].length && (h[g++] = C[v][b]);
  for (b = 0; b < y; b++) for (v = 0; v < s; v++) h[g++] = N[v][b];
  return h;
}
function Qt(e, t, r, o) {
  let n;
  if (Array.isArray(e)) n = ae.fromArray(e);
  else if (typeof e == "string") {
    let u = t;
    if (!u) {
      const l = ae.rawSplit(e);
      u = ee.getBestVersionForData(l, r);
    }
    n = ae.fromString(e, u || 40);
  } else throw new Error("Invalid data");
  const i = ee.getBestVersionForData(n, r);
  if (!i) throw new Error("The amount of data is too big to be stored in a QR Code");
  if (!t) t = i;
  else if (t < i) throw new Error(`
The chosen QR Code version cannot contain this amount of data.
Minimum version required to store current data is: ` + i + `.
`);
  const s = Vt(t, r, n), c = oe.getSymbolSize(t), a = new Dt(c);
  return Ft(a, t), qt(a), zt(a, t), ce(a, r, 0), t >= 7 && Ot(a, t), Ht(a, s), isNaN(o) && (o = de.getBestMask(a, ce.bind(null, a, r))), de.applyMask(o, a), ce(a, r, o), { modules: a, version: t, errorCorrectionLevel: r, maskPattern: o, segments: n };
}
Ie.create = function(t, r) {
  if (typeof t > "u" || t === "") throw new Error("No input text");
  let o = se.M, n, i;
  return typeof r < "u" && (o = se.from(r.errorCorrectionLevel, se.M), n = ee.from(r.version), i = de.from(r.maskPattern), r.toSJISFunc && oe.setToSJISFunction(r.toSJISFunc)), Qt(t, n, o, i);
};
var xe = {}, pe = {};
(function(e) {
  function t(r) {
    if (typeof r == "number" && (r = r.toString()), typeof r != "string") throw new Error("Color should be defined as hex string");
    let o = r.slice().replace("#", "").split("");
    if (o.length < 3 || o.length === 5 || o.length > 8) throw new Error("Invalid hex color: " + r);
    (o.length === 3 || o.length === 4) && (o = Array.prototype.concat.apply([], o.map(function(i) {
      return [i, i];
    }))), o.length === 6 && o.push("F", "F");
    const n = parseInt(o.join(""), 16);
    return { r: n >> 24 & 255, g: n >> 16 & 255, b: n >> 8 & 255, a: n & 255, hex: "#" + o.slice(0, 6).join("") };
  }
  e.getOptions = function(o) {
    o || (o = {}), o.color || (o.color = {});
    const n = typeof o.margin > "u" || o.margin === null || o.margin < 0 ? 4 : o.margin, i = o.width && o.width >= 21 ? o.width : void 0, s = o.scale || 4;
    return { width: i, scale: i ? 4 : s, margin: n, color: { dark: t(o.color.dark || "#000000ff"), light: t(o.color.light || "#ffffffff") }, type: o.type, rendererOpts: o.rendererOpts || {} };
  }, e.getScale = function(o, n) {
    return n.width && n.width >= o + n.margin * 2 ? n.width / (o + n.margin * 2) : n.scale;
  }, e.getImageWidth = function(o, n) {
    const i = e.getScale(o, n);
    return Math.floor((o + n.margin * 2) * i);
  }, e.qrToImageData = function(o, n, i) {
    const s = n.modules.size, c = n.modules.data, a = e.getScale(s, i), u = Math.floor((s + i.margin * 2) * a), l = i.margin * a, E = [i.color.light, i.color.dark];
    for (let y = 0; y < u; y++) for (let f = 0; f < u; f++) {
      let p = (y * u + f) * 4, C = i.color.light;
      if (y >= l && f >= l && y < u - l && f < u - l) {
        const N = Math.floor((y - l) / a), m = Math.floor((f - l) / a);
        C = E[c[N * s + m] ? 1 : 0];
      }
      o[p++] = C.r, o[p++] = C.g, o[p++] = C.b, o[p] = C.a;
    }
  };
})(pe);
(function(e) {
  const t = pe;
  function r(n, i, s) {
    n.clearRect(0, 0, i.width, i.height), i.style || (i.style = {}), i.height = s, i.width = s, i.style.height = s + "px", i.style.width = s + "px";
  }
  function o() {
    try {
      return document.createElement("canvas");
    } catch {
      throw new Error("You need to specify a canvas element");
    }
  }
  e.render = function(i, s, c) {
    let a = c, u = s;
    typeof a > "u" && (!s || !s.getContext) && (a = s, s = void 0), s || (u = o()), a = t.getOptions(a);
    const l = t.getImageWidth(i.modules.size, a), E = u.getContext("2d"), y = E.createImageData(l, l);
    return t.qrToImageData(y.data, i, a), r(E, u, l), E.putImageData(y, 0, 0), u;
  }, e.renderToDataURL = function(i, s, c) {
    let a = c;
    typeof a > "u" && (!s || !s.getContext) && (a = s, s = void 0), a || (a = {});
    const u = e.render(i, s, a), l = a.type || "image/png", E = a.rendererOpts || {};
    return u.toDataURL(l, E.quality);
  };
})(xe);
var _e = {};
const Yt = pe;
function Ee(e, t) {
  const r = e.a / 255, o = t + '="' + e.hex + '"';
  return r < 1 ? o + " " + t + '-opacity="' + r.toFixed(2).slice(1) + '"' : o;
}
function le(e, t, r) {
  let o = e + t;
  return typeof r < "u" && (o += " " + r), o;
}
function Gt(e, t, r) {
  let o = "", n = 0, i = false, s = 0;
  for (let c = 0; c < e.length; c++) {
    const a = Math.floor(c % t), u = Math.floor(c / t);
    !a && !i && (i = true), e[c] ? (s++, c > 0 && a > 0 && e[c - 1] || (o += i ? le("M", a + r, 0.5 + u + r) : le("m", n, 0), n = 0, i = false), a + 1 < t && e[c + 1] || (o += le("h", s), s = 0)) : n++;
  }
  return o;
}
_e.render = function(t, r, o) {
  const n = Yt.getOptions(r), i = t.modules.size, s = t.modules.data, c = i + n.margin * 2, a = n.color.light.a ? "<path " + Ee(n.color.light, "fill") + ' d="M0 0h' + c + "v" + c + 'H0z"/>' : "", u = "<path " + Ee(n.color.dark, "stroke") + ' d="' + Gt(s, i, n.margin) + '"/>', l = 'viewBox="0 0 ' + c + " " + c + '"', y = '<svg xmlns="http://www.w3.org/2000/svg" ' + (n.width ? 'width="' + n.width + '" height="' + n.width + '" ' : "") + l + ' shape-rendering="crispEdges">' + a + u + `</svg>
`;
  return typeof o == "function" && o(null, y), y;
};
const Wt = dt, he = Ie, Fe = xe, Xt = _e;
function we(e, t, r, o, n) {
  const i = [].slice.call(arguments, 1), s = i.length, c = typeof i[s - 1] == "function";
  if (!c && !Wt()) throw new Error("Callback required as last argument");
  if (c) {
    if (s < 2) throw new Error("Too few arguments provided");
    s === 2 ? (n = r, r = t, t = o = void 0) : s === 3 && (t.getContext && typeof n > "u" ? (n = o, o = void 0) : (n = o, o = r, r = t, t = void 0));
  } else {
    if (s < 1) throw new Error("Too few arguments provided");
    return s === 1 ? (r = t, t = o = void 0) : s === 2 && !t.getContext && (o = r, r = t, t = void 0), new Promise(function(a, u) {
      try {
        const l = he.create(r, o);
        a(e(l, t, o));
      } catch (l) {
        u(l);
      }
    });
  }
  try {
    const a = he.create(r, o);
    n(null, e(a, t, o));
  } catch (a) {
    n(a);
  }
}
Q.create = he.create;
Q.toCanvas = we.bind(null, Fe.render);
Q.toDataURL = we.bind(null, Fe.renderToDataURL);
Q.toString = we.bind(null, function(e, t, r) {
  return Xt.render(e, r);
});
const Zt = "/link-device", $t = 1;
function j(e) {
  let t = "";
  for (let r = 0; r < e.length; r++) t += String.fromCharCode(e[r]);
  return btoa(t);
}
function O(e) {
  const t = atob(e), r = new Uint8Array(t.length);
  for (let o = 0; o < t.length; o++) r[o] = t.charCodeAt(o);
  return r;
}
async function en() {
  const e = Ge.randomSecretKey(), t = await We(e);
  return { privateKey: e, publicKey: t, publicKeyBase64: j(t) };
}
async function qe() {
  const e = await crypto.subtle.generateKey({ name: "ECDH", namedCurve: "P-256" }, true, ["deriveBits"]), t = new Uint8Array(await crypto.subtle.exportKey("raw", e.publicKey));
  return { privateKey: e.privateKey, publicKey: e.publicKey, publicKeyBytes: t, publicKeyBase64: j(t) };
}
async function ze(e) {
  return crypto.subtle.importKey("raw", O(e), { name: "ECDH", namedCurve: "P-256" }, false, []);
}
async function Oe(e, t) {
  const r = await crypto.subtle.deriveBits({ name: "ECDH", public: t }, e, 256);
  return crypto.subtle.importKey("raw", r, { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);
}
async function tn(e, t) {
  const r = await qe(), o = await ze(t), n = await Oe(r.privateKey, o), i = crypto.getRandomValues(new Uint8Array(12)), s = await crypto.subtle.encrypt({ name: "AES-GCM", iv: i }, n, e);
  return { relayPublicKey: r.publicKeyBase64, relayIv: j(i), relayCiphertext: j(new Uint8Array(s)) };
}
async function nn(e, t) {
  const r = await ze(e.relayPublicKey), o = await Oe(t, r), n = await crypto.subtle.decrypt({ name: "AES-GCM", iv: O(e.relayIv) }, o, O(e.relayCiphertext));
  return new Uint8Array(n);
}
async function rn(e, t) {
  return Ye(e, t);
}
function on({ requestId: e, secret: t, expiresAt: r }) {
  return btoa(JSON.stringify({ r: e, s: t, e: r }));
}
function sn(e) {
  if (!e) throw new Error("Invalid QR payload: input is empty.");
  let t;
  try {
    t = atob(e);
  } catch {
    throw new Error("Invalid QR payload: not valid base64.");
  }
  let r;
  try {
    r = JSON.parse(t);
  } catch {
    throw new Error("Invalid QR payload: could not parse JSON after base64 decode.");
  }
  const { r: o, s: n, e: i } = r;
  if (!o || !n || !i) throw new Error("Invalid QR payload: missing required fields (r, s, e).");
  return { requestId: o, secret: n, expiresAt: i };
}
function an(e, t) {
  const r = new URL(Zt, e);
  return r.searchParams.set("payload", on(t)), r.toString();
}
function cn(e) {
  const t = { v: $t, userId: e.userId, username: e.username ?? "", displayName: e.displayName ?? "", instanceUrl: e.instanceUrl ?? "", exportedAt: e.exportedAt ?? (/* @__PURE__ */ new Date()).toISOString(), rootPrivateKey: j(e.rootPrivateKey), rootPublicKey: j(e.rootPublicKey), historySnapshot: e.historySnapshot ?? null, guildMetadataKeySnapshot: e.guildMetadataKeySnapshot ?? null };
  return new TextEncoder().encode(JSON.stringify(t));
}
function ln(e) {
  const t = new TextDecoder().decode(e), r = JSON.parse(t);
  return { version: r.v ?? 1, userId: r.userId, username: r.username ?? "", displayName: r.displayName ?? "", instanceUrl: r.instanceUrl ?? "", exportedAt: r.exportedAt ?? "", rootPrivateKey: O(r.rootPrivateKey), rootPublicKey: O(r.rootPublicKey), historySnapshot: r.historySnapshot ?? null, guildMetadataKeySnapshot: r.guildMetadataKeySnapshot ?? null };
}
const un = 2e3, dn = 1.5, fn = 15e3;
function He(e, t = Date.now()) {
  const r = Math.max(0, Math.floor((new Date(e).getTime() - t) / 1e3)), o = Math.floor(r / 60), n = r % 60;
  return `${o}:${String(n).padStart(2, "0")}`;
}
function hn(e) {
  const t = `${e.pathname}${e.search}`;
  return `/?returnTo=${encodeURIComponent(t)}`;
}
function gn({ onLinked: e, selectedInstanceUrl: t, knownInstances: r, onSelectInstance: o }) {
  const { completeDeviceLink: n, loading: i } = ve(), [s, c] = A.useState(null), [a, u] = A.useState(""), [l, E] = A.useState(""), [y, f] = A.useState(0), [p, C] = A.useState(() => Date.now()), [N, m] = A.useState(false);
  A.useEffect(() => {
    const h = setInterval(() => C(Date.now()), 1e3);
    return () => clearInterval(h);
  }, []), A.useEffect(() => {
    let h = false;
    async function g() {
      u(""), E(""), c(null);
      try {
        const b = t, v = await en(), S = await qe(), B = await rt({ devicePublicKey: v.publicKeyBase64, sessionPublicKey: S.publicKeyBase64, deviceId: Z(), instanceUrl: b }, b);
        let I = "";
        try {
          I = await Q.toDataURL(an(window.location.origin, { requestId: B.requestId, secret: B.secret, expiresAt: B.expiresAt }), { width: 240, margin: 2, errorCorrectionLevel: "M" });
        } catch {
        }
        if (h) return;
        c({ ...B, instanceUrl: b, qrDataUrl: I, sessionPrivateKey: S.privateKey });
      } catch (b) {
        h || u(b.message || "Failed to create a device link request.");
      }
    }
    return g(), () => {
      h = true;
    };
  }, [y, t]), A.useEffect(() => {
    if (!(s == null ? void 0 : s.requestId) || !(s == null ? void 0 : s.secret) || !(s == null ? void 0 : s.sessionPrivateKey)) return;
    let h = false;
    const g = new Date(s.expiresAt).getTime();
    let b = un, v = null;
    const S = () => {
      h || (v = setTimeout(B, b));
    }, B = async () => {
      if (!(h || Date.now() >= g)) try {
        const I = await ot({ requestId: s.requestId, secret: s.secret }, s.instanceUrl);
        if (h) return;
        if (m(false), b = Math.min(b * dn, fn), (I == null ? void 0 : I.status) === "pending") {
          S();
          return;
        }
        E("Finalizing linked device\u2026");
        const P = await nn(I, s.sessionPrivateKey), T = ln(P);
        await n(T), e();
      } catch (I) {
        if (h) return;
        if (I instanceof TypeError || I.name && I.name === "AbortError") {
          m(true), S();
          return;
        }
        u(I.message || "Failed to finalize the device link.");
      }
    };
    return B(), () => {
      h = true, v !== null && clearTimeout(v);
    };
  }, [n, e, s]);
  const w = s ? new Date(s.expiresAt).getTime() <= p : false;
  return d.jsxs("div", { className: "glass home-form-card ld-card", children: [d.jsx("div", { className: "home-section-title", children: "Link this device" }), d.jsx("p", { className: "ld-subtitle", children: "Scan this QR code from a device that is already signed in to the same account." }), d.jsx(ct, { value: t, instances: r, onSelect: o, disabled: i, compact: true }), N && d.jsx("div", { className: "ld-connection-lost", children: "Connection lost. Retrying..." }), s && !w ? d.jsxs(d.Fragment, { children: [s.qrDataUrl ? d.jsx("img", { className: "ld-qr-image", src: s.qrDataUrl, alt: "Device link QR code" }) : d.jsx("div", { className: "ld-empty-box", children: "QR unavailable. Use the fallback code below." }), d.jsx("div", { className: "ld-code-label", children: "Desktop fallback code" }), d.jsx("div", { className: "ld-code-value", children: s.code }), d.jsxs("div", { className: "ld-timer", children: ["Expires in ", He(s.expiresAt, p)] }), d.jsx("div", { className: "ld-waiting", children: d.jsxs("span", { className: "ld-pulse", children: ["Waiting for approval", d.jsx("span", { className: "ld-dots" })] }) })] }) : d.jsx("div", { className: "ld-empty-box", children: a ? "Could not create link request." : i ? "Finalizing device link\u2026" : w ? "Link request expired." : "Generating link request\u2026" }), l && d.jsx("div", { className: "ld-status", children: l }), a && d.jsx("div", { className: "ld-error", children: a }), d.jsxs("div", { className: "ld-actions", children: [d.jsx("button", { type: "button", className: "btn btn-secondary", onClick: () => f((h) => h + 1), children: "Regenerate" }), d.jsx(Se, { className: "btn btn-secondary", to: "/", children: "Back" })] })] });
}
function mn({ initialPayload: e, unlockResumePath: t }) {
  var _a, _b;
  const r = Ne(), { user: o, token: n, loading: i, hasSession: s, hasVault: c, isVaultUnlocked: a, needsUnlock: u, identityKeyRef: l } = ve(), [E, y] = A.useState(""), [f, p] = A.useState(null), [C, N] = A.useState(""), [m, w] = A.useState(""), [h, g] = A.useState(false), [b, v] = A.useState(false), [S, B] = A.useState(() => Date.now()), I = s && a && !!((_a = l.current) == null ? void 0 : _a.privateKey) && !!((_b = l.current) == null ? void 0 : _b.publicKey) && !!n, P = u;
  A.useEffect(() => {
    const L = setInterval(() => B(Date.now()), 1e3);
    return () => clearInterval(L);
  }, []);
  const T = A.useCallback(async (L) => {
    if (n) {
      N(""), w(""), g(true);
      try {
        const U = await Xe(n, L);
        p(U);
      } catch (U) {
        const x = U.message || "";
        x.includes("expired or already claimed") ? N("Code expired or already used. Please generate a new link on the other device.") : N(x || "Failed to resolve the link request.");
      } finally {
        g(false);
      }
    }
  }, [n]);
  A.useEffect(() => {
    !(e == null ? void 0 : e.requestId) || !(e == null ? void 0 : e.secret) || !I || T({ requestId: e.requestId, secret: e.secret });
  }, [I, e, T]);
  const H = A.useCallback(async (L) => {
    if (L.preventDefault(), !E.trim()) {
      N("Enter the code shown on the new device.");
      return;
    }
    await T({ code: E.trim().toUpperCase() });
  }, [E, T]), M = A.useCallback(async () => {
    var _a2, _b2;
    if (!f || !n || !(o == null ? void 0 : o.id) || !((_a2 = l.current) == null ? void 0 : _a2.privateKey) || !((_b2 = l.current) == null ? void 0 : _b2.publicKey)) return;
    N(""), w(""), v(true);
    let L = null, U = null;
    try {
      L = await Ze(o.id, Z());
      const x = await $e(L);
      U = await et(o.id, Z());
      const G = await tt(U), Ve = cn({ userId: o.id, username: o.username, displayName: o.displayName, instanceUrl: f.instanceUrl || window.location.origin, rootPrivateKey: l.current.privateKey, rootPublicKey: l.current.publicKey, historySnapshot: x, guildMetadataKeySnapshot: G }), Je = await rn(O(f.devicePublicKey), l.current.privateKey), Qe = await tn(Ve, f.sessionPublicKey);
      await nt(n, { claimToken: f.claimToken, certificate: j(Je), signingDeviceId: Z(), ...Qe }), w("Device linked. Return to the new device to finish setup.");
    } catch (x) {
      const G = x.message || "";
      G.includes("Linking failed") ? N("Linking failed. Please try again.") : N(G || "Failed to approve the device link.");
    } finally {
      try {
        L == null ? void 0 : L.close();
      } catch {
      }
      try {
        U == null ? void 0 : U.close();
      } catch {
      }
      v(false);
    }
  }, [f, l, n, o == null ? void 0 : o.displayName, o == null ? void 0 : o.id, o == null ? void 0 : o.username]);
  return i ? d.jsx("div", { className: "glass home-form-card ld-card", children: d.jsx("div", { className: "ld-empty-box", children: "Loading\u2026" }) }) : P ? d.jsxs("div", { className: "glass home-form-card ld-card", children: [d.jsx("div", { className: "home-section-title", children: "Approve device link" }), d.jsx("p", { className: "ld-subtitle", children: "This browser is recognized for your Hush account, but the vault is locked in this tab. Unlock Hush, then return to approve the new device." }), e && d.jsx("div", { className: "ld-status", children: "QR request detected. Unlock this browser to resume approval automatically." }), d.jsxs("div", { className: "ld-actions", children: [d.jsx("button", { type: "button", className: "btn btn-primary", onClick: () => r(t), children: "Unlock to approve" }), d.jsx("button", { type: "button", className: "btn btn-secondary", onClick: () => r("/"), children: "Back" })] })] }) : I ? d.jsxs("div", { className: "glass home-form-card ld-card", children: [d.jsx("div", { className: "home-section-title", children: "Approve device link" }), d.jsx("p", { className: "ld-subtitle", children: "Scan the QR from your phone camera or enter the fallback code shown on the new device." }), !f && d.jsxs("form", { className: "ld-code-form", onSubmit: H, children: [d.jsx("label", { htmlFor: "device-link-code", className: "ld-code-label", children: "Link code" }), d.jsx("input", { id: "device-link-code", className: "ld-code-input", value: E, onChange: (L) => y(L.target.value.toUpperCase()), placeholder: "ABCD1234", autoCapitalize: "characters", autoCorrect: "off", spellCheck: "false" }), d.jsx("button", { type: "submit", className: "btn btn-secondary", disabled: h, children: h ? "Checking\u2026" : "Resolve code" })] }), f && d.jsxs("div", { className: "ld-claim-summary", children: [d.jsxs("div", { className: "ld-summary-row", children: [d.jsx("span", { children: "Device ID" }), d.jsx("strong", { children: f.deviceId })] }), d.jsxs("div", { className: "ld-summary-row", children: [d.jsx("span", { children: "Expires" }), d.jsx("strong", { children: He(f.expiresAt, S) })] }), d.jsxs("div", { className: "ld-summary-row", children: [d.jsx("span", { children: "Instance" }), d.jsx("strong", { children: f.instanceUrl || window.location.origin })] })] }), m && d.jsx("div", { className: "ld-status", children: m }), C && d.jsx("div", { className: "ld-error", children: C }), d.jsxs("div", { className: "ld-actions", children: [f && d.jsx("button", { type: "button", className: "btn btn-primary", onClick: M, disabled: b, children: b ? "Approving\u2026" : "Approve link" }), d.jsx("button", { type: "button", className: "btn btn-secondary", onClick: () => r("/"), children: "Close" })] })] }) : d.jsxs("div", { className: "glass home-form-card ld-card", children: [d.jsx("div", { className: "home-section-title", children: "Approve device link" }), d.jsx("p", { className: "ld-subtitle", children: "Open this page in a browser profile that is already signed in to the account you want to link." }), e && !c && d.jsx("div", { className: "ld-status", children: "QR request detected. This browser does not have a local Hush vault for that account." }), d.jsx("div", { className: "ld-actions", children: d.jsx("button", { type: "button", className: "btn btn-secondary", onClick: () => r("/"), children: "Back" }) })] });
}
function bn() {
  lt(ut.SCROLL);
  const e = Ne(), t = it(), [r] = st(), { selectedInstanceUrl: o, knownInstances: n, chooseInstance: i } = at(), s = r.get("mode") === "new", c = A.useMemo(() => {
    const u = r.get("payload");
    if (!u) return null;
    try {
      return sn(u);
    } catch {
      return null;
    }
  }, [r]), a = A.useMemo(() => hn(t), [t]);
  return d.jsx("div", { className: "home-page ld-page", children: d.jsxs("div", { className: "home-container ld-container", children: [s ? d.jsx(gn, { onLinked: () => e("/", { replace: true }), selectedInstanceUrl: o, knownInstances: n, onSelectInstance: i }) : d.jsx(mn, { initialPayload: c, unlockResumePath: a }), d.jsx("div", { className: "ld-footer-link", children: d.jsx(Se, { to: "/", children: "Return to Hush" }) })] }) });
}
export {
  bn as default
};
