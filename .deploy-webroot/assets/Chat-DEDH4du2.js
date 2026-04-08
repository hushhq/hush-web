const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/measureRemoteLevel-CKEY2VvA.js","assets/measureCaptureLevel-D8ZmpDSy.js"])))=>i.map(i=>d[i]);
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import { aI as Ma, aN as Wc, a6 as Xt, a7 as Mt, a8 as Ot, a9 as Dt, ap as Kc, h as Oa, aO as Hc, aP as Jc, aQ as zc, j as f, ak as fr, __tla as __tla_0 } from "./index-BefR8mbE.js";
import { r as _ } from "./vendor-react-2AhYlJPv.js";
import { M as Ct, D as ds, Q as ti, a as Nt, W as $c, I as gr } from "./constants-AlQXj8D-.js";
let Um, Lm, Nm, Mm, C, Dm, Om, Am, Rc, _c, _m, Lp, Im, Fp, xn, Np, xm, Pc, Mp, Pm;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  var vr = {};
  function Qc(n, e) {
    return e.forEach(function(t) {
      t && typeof t != "string" && !Array.isArray(t) && Object.keys(t).forEach(function(i) {
        if (i !== "default" && !(i in n)) {
          var s = Object.getOwnPropertyDescriptor(t, i);
          Object.defineProperty(n, i, s.get ? s : {
            enumerable: true,
            get: function() {
              return t[i];
            }
          });
        }
      });
    }), Object.freeze(n);
  }
  var Yc = Object.defineProperty, Xc = (n, e, t) => e in n ? Yc(n, e, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: t
  }) : n[e] = t, yr = (n, e, t) => Xc(n, typeof e != "symbol" ? e + "" : e, t);
  class je {
    constructor() {
      yr(this, "_locking"), yr(this, "_locks"), this._locking = Promise.resolve(), this._locks = 0;
    }
    isLocked() {
      return this._locks > 0;
    }
    lock() {
      this._locks += 1;
      let e;
      const t = new Promise((s) => e = () => {
        this._locks -= 1, s();
      }), i = this._locking.then(() => e);
      return this._locking = this._locking.then(() => t), i;
    }
  }
  function he(n, e) {
    if (!n) throw new Error(e);
  }
  const Zc = 34028234663852886e22, ed = -34028234663852886e22, td = 4294967295, id = 2147483647, nd = -2147483648;
  function an(n) {
    if (typeof n != "number") throw new Error("invalid int 32: " + typeof n);
    if (!Number.isInteger(n) || n > id || n < nd) throw new Error("invalid int 32: " + n);
  }
  function ls(n) {
    if (typeof n != "number") throw new Error("invalid uint 32: " + typeof n);
    if (!Number.isInteger(n) || n > td || n < 0) throw new Error("invalid uint 32: " + n);
  }
  function Da(n) {
    if (typeof n != "number") throw new Error("invalid float 32: " + typeof n);
    if (Number.isFinite(n) && (n > Zc || n < ed)) throw new Error("invalid float 32: " + n);
  }
  const Aa = Symbol("@bufbuild/protobuf/enum-type");
  function sd(n) {
    const e = n[Aa];
    return he(e, "missing enum type on enum object"), e;
  }
  function Na(n, e, t, i) {
    n[Aa] = La(e, t.map((s) => ({
      no: s.no,
      name: s.name,
      localName: n[s.no]
    })));
  }
  function La(n, e, t) {
    const i = /* @__PURE__ */ Object.create(null), s = /* @__PURE__ */ Object.create(null), r = [];
    for (const o of e) {
      const a = Ua(o);
      r.push(a), i[o.name] = a, s[o.no] = a;
    }
    return {
      typeName: n,
      values: r,
      findName(o) {
        return i[o];
      },
      findNumber(o) {
        return s[o];
      }
    };
  }
  function rd(n, e, t) {
    const i = {};
    for (const s of e) {
      const r = Ua(s);
      i[r.localName] = r.no, i[r.no] = r.localName;
    }
    return Na(i, n, e), i;
  }
  function Ua(n) {
    return "localName" in n ? n : Object.assign(Object.assign({}, n), {
      localName: n.name
    });
  }
  class Ls {
    equals(e) {
      return this.getType().runtime.util.equals(this.getType(), this, e);
    }
    clone() {
      return this.getType().runtime.util.clone(this);
    }
    fromBinary(e, t) {
      const i = this.getType(), s = i.runtime.bin, r = s.makeReadOptions(t);
      return s.readMessage(this, r.readerFactory(e), e.byteLength, r), this;
    }
    fromJson(e, t) {
      const i = this.getType(), s = i.runtime.json, r = s.makeReadOptions(t);
      return s.readMessage(i, e, r, this), this;
    }
    fromJsonString(e, t) {
      let i;
      try {
        i = JSON.parse(e);
      } catch (s) {
        throw new Error("cannot decode ".concat(this.getType().typeName, " from JSON: ").concat(s instanceof Error ? s.message : String(s)));
      }
      return this.fromJson(i, t);
    }
    toBinary(e) {
      const t = this.getType(), i = t.runtime.bin, s = i.makeWriteOptions(e), r = s.writerFactory();
      return i.writeMessage(this, r, s), r.finish();
    }
    toJson(e) {
      const t = this.getType(), i = t.runtime.json, s = i.makeWriteOptions(e);
      return i.writeMessage(this, s);
    }
    toJsonString(e) {
      var t;
      const i = this.toJson(e);
      return JSON.stringify(i, null, (t = e == null ? void 0 : e.prettySpaces) !== null && t !== void 0 ? t : 0);
    }
    toJSON() {
      return this.toJson({
        emitDefaultValues: true
      });
    }
    getType() {
      return Object.getPrototypeOf(this).constructor;
    }
  }
  function ad(n, e, t, i) {
    var s;
    const r = (s = i == null ? void 0 : i.localName) !== null && s !== void 0 ? s : e.substring(e.lastIndexOf(".") + 1), o = {
      [r]: function(a) {
        n.util.initFields(this), n.util.initPartial(a, this);
      }
    }[r];
    return Object.setPrototypeOf(o.prototype, new Ls()), Object.assign(o, {
      runtime: n,
      typeName: e,
      fields: n.util.newFieldList(t),
      fromBinary(a, c) {
        return new o().fromBinary(a, c);
      },
      fromJson(a, c) {
        return new o().fromJson(a, c);
      },
      fromJsonString(a, c) {
        return new o().fromJsonString(a, c);
      },
      equals(a, c) {
        return n.util.equals(o, a, c);
      }
    }), o;
  }
  function od() {
    let n = 0, e = 0;
    for (let i = 0; i < 28; i += 7) {
      let s = this.buf[this.pos++];
      if (n |= (s & 127) << i, !(s & 128)) return this.assertBounds(), [
        n,
        e
      ];
    }
    let t = this.buf[this.pos++];
    if (n |= (t & 15) << 28, e = (t & 112) >> 4, !(t & 128)) return this.assertBounds(), [
      n,
      e
    ];
    for (let i = 3; i <= 31; i += 7) {
      let s = this.buf[this.pos++];
      if (e |= (s & 127) << i, !(s & 128)) return this.assertBounds(), [
        n,
        e
      ];
    }
    throw new Error("invalid varint");
  }
  function Wn(n, e, t) {
    for (let r = 0; r < 28; r = r + 7) {
      const o = n >>> r, a = !(!(o >>> 7) && e == 0), c = (a ? o | 128 : o) & 255;
      if (t.push(c), !a) return;
    }
    const i = n >>> 28 & 15 | (e & 7) << 4, s = !!(e >> 3);
    if (t.push((s ? i | 128 : i) & 255), !!s) {
      for (let r = 3; r < 31; r = r + 7) {
        const o = e >>> r, a = !!(o >>> 7), c = (a ? o | 128 : o) & 255;
        if (t.push(c), !a) return;
      }
      t.push(e >>> 31 & 1);
    }
  }
  const on = 4294967296;
  function br(n) {
    const e = n[0] === "-";
    e && (n = n.slice(1));
    const t = 1e6;
    let i = 0, s = 0;
    function r(o, a) {
      const c = Number(n.slice(o, a));
      s *= t, i = i * t + c, i >= on && (s = s + (i / on | 0), i = i % on);
    }
    return r(-24, -18), r(-18, -12), r(-12, -6), r(-6), e ? Fa(i, s) : Us(i, s);
  }
  function cd(n, e) {
    let t = Us(n, e);
    const i = t.hi & 2147483648;
    i && (t = Fa(t.lo, t.hi));
    const s = ja(t.lo, t.hi);
    return i ? "-" + s : s;
  }
  function ja(n, e) {
    if ({ lo: n, hi: e } = dd(n, e), e <= 2097151) return String(on * e + n);
    const t = n & 16777215, i = (n >>> 24 | e << 8) & 16777215, s = e >> 16 & 65535;
    let r = t + i * 6777216 + s * 6710656, o = i + s * 8147497, a = s * 2;
    const c = 1e7;
    return r >= c && (o += Math.floor(r / c), r %= c), o >= c && (a += Math.floor(o / c), o %= c), a.toString() + kr(o) + kr(r);
  }
  function dd(n, e) {
    return {
      lo: n >>> 0,
      hi: e >>> 0
    };
  }
  function Us(n, e) {
    return {
      lo: n | 0,
      hi: e | 0
    };
  }
  function Fa(n, e) {
    return e = ~e, n ? n = ~n + 1 : e += 1, Us(n, e);
  }
  const kr = (n) => {
    const e = String(n);
    return "0000000".slice(e.length) + e;
  };
  function Sr(n, e) {
    if (n >= 0) {
      for (; n > 127; ) e.push(n & 127 | 128), n = n >>> 7;
      e.push(n);
    } else {
      for (let t = 0; t < 9; t++) e.push(n & 127 | 128), n = n >> 7;
      e.push(1);
    }
  }
  function ld() {
    let n = this.buf[this.pos++], e = n & 127;
    if (!(n & 128)) return this.assertBounds(), e;
    if (n = this.buf[this.pos++], e |= (n & 127) << 7, !(n & 128)) return this.assertBounds(), e;
    if (n = this.buf[this.pos++], e |= (n & 127) << 14, !(n & 128)) return this.assertBounds(), e;
    if (n = this.buf[this.pos++], e |= (n & 127) << 21, !(n & 128)) return this.assertBounds(), e;
    n = this.buf[this.pos++], e |= (n & 15) << 28;
    for (let t = 5; n & 128 && t < 10; t++) n = this.buf[this.pos++];
    if (n & 128) throw new Error("invalid varint");
    return this.assertBounds(), e >>> 0;
  }
  function ud() {
    const n = new DataView(new ArrayBuffer(8));
    if (typeof BigInt == "function" && typeof n.getBigInt64 == "function" && typeof n.getBigUint64 == "function" && typeof n.setBigInt64 == "function" && typeof n.setBigUint64 == "function" && (typeof process != "object" || typeof vr != "object" || vr.BUF_BIGINT_DISABLE !== "1")) {
      const s = BigInt("-9223372036854775808"), r = BigInt("9223372036854775807"), o = BigInt("0"), a = BigInt("18446744073709551615");
      return {
        zero: BigInt(0),
        supported: true,
        parse(c) {
          const d = typeof c == "bigint" ? c : BigInt(c);
          if (d > r || d < s) throw new Error("int64 invalid: ".concat(c));
          return d;
        },
        uParse(c) {
          const d = typeof c == "bigint" ? c : BigInt(c);
          if (d > a || d < o) throw new Error("uint64 invalid: ".concat(c));
          return d;
        },
        enc(c) {
          return n.setBigInt64(0, this.parse(c), true), {
            lo: n.getInt32(0, true),
            hi: n.getInt32(4, true)
          };
        },
        uEnc(c) {
          return n.setBigInt64(0, this.uParse(c), true), {
            lo: n.getInt32(0, true),
            hi: n.getInt32(4, true)
          };
        },
        dec(c, d) {
          return n.setInt32(0, c, true), n.setInt32(4, d, true), n.getBigInt64(0, true);
        },
        uDec(c, d) {
          return n.setInt32(0, c, true), n.setInt32(4, d, true), n.getBigUint64(0, true);
        }
      };
    }
    const t = (s) => he(/^-?[0-9]+$/.test(s), "int64 invalid: ".concat(s)), i = (s) => he(/^[0-9]+$/.test(s), "uint64 invalid: ".concat(s));
    return {
      zero: "0",
      supported: false,
      parse(s) {
        return typeof s != "string" && (s = s.toString()), t(s), s;
      },
      uParse(s) {
        return typeof s != "string" && (s = s.toString()), i(s), s;
      },
      enc(s) {
        return typeof s != "string" && (s = s.toString()), t(s), br(s);
      },
      uEnc(s) {
        return typeof s != "string" && (s = s.toString()), i(s), br(s);
      },
      dec(s, r) {
        return cd(s, r);
      },
      uDec(s, r) {
        return ja(s, r);
      }
    };
  }
  const le = ud();
  var E;
  (function(n) {
    n[n.DOUBLE = 1] = "DOUBLE", n[n.FLOAT = 2] = "FLOAT", n[n.INT64 = 3] = "INT64", n[n.UINT64 = 4] = "UINT64", n[n.INT32 = 5] = "INT32", n[n.FIXED64 = 6] = "FIXED64", n[n.FIXED32 = 7] = "FIXED32", n[n.BOOL = 8] = "BOOL", n[n.STRING = 9] = "STRING", n[n.BYTES = 12] = "BYTES", n[n.UINT32 = 13] = "UINT32", n[n.SFIXED32 = 15] = "SFIXED32", n[n.SFIXED64 = 16] = "SFIXED64", n[n.SINT32 = 17] = "SINT32", n[n.SINT64 = 18] = "SINT64";
  })(E || (E = {}));
  var Vt;
  (function(n) {
    n[n.BIGINT = 0] = "BIGINT", n[n.STRING = 1] = "STRING";
  })(Vt || (Vt = {}));
  function It(n, e, t) {
    if (e === t) return true;
    if (n == E.BYTES) {
      if (!(e instanceof Uint8Array) || !(t instanceof Uint8Array) || e.length !== t.length) return false;
      for (let i = 0; i < e.length; i++) if (e[i] !== t[i]) return false;
      return true;
    }
    switch (n) {
      case E.UINT64:
      case E.FIXED64:
      case E.INT64:
      case E.SFIXED64:
      case E.SINT64:
        return e == t;
    }
    return false;
  }
  function Ei(n, e) {
    switch (n) {
      case E.BOOL:
        return false;
      case E.UINT64:
      case E.FIXED64:
      case E.INT64:
      case E.SFIXED64:
      case E.SINT64:
        return e == 0 ? le.zero : "0";
      case E.DOUBLE:
      case E.FLOAT:
        return 0;
      case E.BYTES:
        return new Uint8Array(0);
      case E.STRING:
        return "";
      default:
        return 0;
    }
  }
  function Ba(n, e) {
    switch (n) {
      case E.BOOL:
        return e === false;
      case E.STRING:
        return e === "";
      case E.BYTES:
        return e instanceof Uint8Array && !e.byteLength;
      default:
        return e == 0;
    }
  }
  var fe;
  (function(n) {
    n[n.Varint = 0] = "Varint", n[n.Bit64 = 1] = "Bit64", n[n.LengthDelimited = 2] = "LengthDelimited", n[n.StartGroup = 3] = "StartGroup", n[n.EndGroup = 4] = "EndGroup", n[n.Bit32 = 5] = "Bit32";
  })(fe || (fe = {}));
  class hd {
    constructor(e) {
      this.stack = [], this.textEncoder = e ?? new TextEncoder(), this.chunks = [], this.buf = [];
    }
    finish() {
      this.chunks.push(new Uint8Array(this.buf));
      let e = 0;
      for (let s = 0; s < this.chunks.length; s++) e += this.chunks[s].length;
      let t = new Uint8Array(e), i = 0;
      for (let s = 0; s < this.chunks.length; s++) t.set(this.chunks[s], i), i += this.chunks[s].length;
      return this.chunks = [], t;
    }
    fork() {
      return this.stack.push({
        chunks: this.chunks,
        buf: this.buf
      }), this.chunks = [], this.buf = [], this;
    }
    join() {
      let e = this.finish(), t = this.stack.pop();
      if (!t) throw new Error("invalid state, fork stack empty");
      return this.chunks = t.chunks, this.buf = t.buf, this.uint32(e.byteLength), this.raw(e);
    }
    tag(e, t) {
      return this.uint32((e << 3 | t) >>> 0);
    }
    raw(e) {
      return this.buf.length && (this.chunks.push(new Uint8Array(this.buf)), this.buf = []), this.chunks.push(e), this;
    }
    uint32(e) {
      for (ls(e); e > 127; ) this.buf.push(e & 127 | 128), e = e >>> 7;
      return this.buf.push(e), this;
    }
    int32(e) {
      return an(e), Sr(e, this.buf), this;
    }
    bool(e) {
      return this.buf.push(e ? 1 : 0), this;
    }
    bytes(e) {
      return this.uint32(e.byteLength), this.raw(e);
    }
    string(e) {
      let t = this.textEncoder.encode(e);
      return this.uint32(t.byteLength), this.raw(t);
    }
    float(e) {
      Da(e);
      let t = new Uint8Array(4);
      return new DataView(t.buffer).setFloat32(0, e, true), this.raw(t);
    }
    double(e) {
      let t = new Uint8Array(8);
      return new DataView(t.buffer).setFloat64(0, e, true), this.raw(t);
    }
    fixed32(e) {
      ls(e);
      let t = new Uint8Array(4);
      return new DataView(t.buffer).setUint32(0, e, true), this.raw(t);
    }
    sfixed32(e) {
      an(e);
      let t = new Uint8Array(4);
      return new DataView(t.buffer).setInt32(0, e, true), this.raw(t);
    }
    sint32(e) {
      return an(e), e = (e << 1 ^ e >> 31) >>> 0, Sr(e, this.buf), this;
    }
    sfixed64(e) {
      let t = new Uint8Array(8), i = new DataView(t.buffer), s = le.enc(e);
      return i.setInt32(0, s.lo, true), i.setInt32(4, s.hi, true), this.raw(t);
    }
    fixed64(e) {
      let t = new Uint8Array(8), i = new DataView(t.buffer), s = le.uEnc(e);
      return i.setInt32(0, s.lo, true), i.setInt32(4, s.hi, true), this.raw(t);
    }
    int64(e) {
      let t = le.enc(e);
      return Wn(t.lo, t.hi, this.buf), this;
    }
    sint64(e) {
      let t = le.enc(e), i = t.hi >> 31, s = t.lo << 1 ^ i, r = (t.hi << 1 | t.lo >>> 31) ^ i;
      return Wn(s, r, this.buf), this;
    }
    uint64(e) {
      let t = le.uEnc(e);
      return Wn(t.lo, t.hi, this.buf), this;
    }
  }
  class pd {
    constructor(e, t) {
      this.varint64 = od, this.uint32 = ld, this.buf = e, this.len = e.length, this.pos = 0, this.view = new DataView(e.buffer, e.byteOffset, e.byteLength), this.textDecoder = t ?? new TextDecoder();
    }
    tag() {
      let e = this.uint32(), t = e >>> 3, i = e & 7;
      if (t <= 0 || i < 0 || i > 5) throw new Error("illegal tag: field no " + t + " wire type " + i);
      return [
        t,
        i
      ];
    }
    skip(e, t) {
      let i = this.pos;
      switch (e) {
        case fe.Varint:
          for (; this.buf[this.pos++] & 128; ) ;
          break;
        case fe.Bit64:
          this.pos += 4;
        case fe.Bit32:
          this.pos += 4;
          break;
        case fe.LengthDelimited:
          let s = this.uint32();
          this.pos += s;
          break;
        case fe.StartGroup:
          for (; ; ) {
            const [r, o] = this.tag();
            if (o === fe.EndGroup) {
              if (t !== void 0 && r !== t) throw new Error("invalid end group tag");
              break;
            }
            this.skip(o, r);
          }
          break;
        default:
          throw new Error("cant skip wire type " + e);
      }
      return this.assertBounds(), this.buf.subarray(i, this.pos);
    }
    assertBounds() {
      if (this.pos > this.len) throw new RangeError("premature EOF");
    }
    int32() {
      return this.uint32() | 0;
    }
    sint32() {
      let e = this.uint32();
      return e >>> 1 ^ -(e & 1);
    }
    int64() {
      return le.dec(...this.varint64());
    }
    uint64() {
      return le.uDec(...this.varint64());
    }
    sint64() {
      let [e, t] = this.varint64(), i = -(e & 1);
      return e = (e >>> 1 | (t & 1) << 31) ^ i, t = t >>> 1 ^ i, le.dec(e, t);
    }
    bool() {
      let [e, t] = this.varint64();
      return e !== 0 || t !== 0;
    }
    fixed32() {
      return this.view.getUint32((this.pos += 4) - 4, true);
    }
    sfixed32() {
      return this.view.getInt32((this.pos += 4) - 4, true);
    }
    fixed64() {
      return le.uDec(this.sfixed32(), this.sfixed32());
    }
    sfixed64() {
      return le.dec(this.sfixed32(), this.sfixed32());
    }
    float() {
      return this.view.getFloat32((this.pos += 4) - 4, true);
    }
    double() {
      return this.view.getFloat64((this.pos += 8) - 8, true);
    }
    bytes() {
      let e = this.uint32(), t = this.pos;
      return this.pos += e, this.assertBounds(), this.buf.subarray(t, t + e);
    }
    string() {
      return this.textDecoder.decode(this.bytes());
    }
  }
  function md(n, e, t, i) {
    let s;
    return {
      typeName: e,
      extendee: t,
      get field() {
        if (!s) {
          const r = typeof i == "function" ? i() : i;
          r.name = e.split(".").pop(), r.jsonName = "[".concat(e, "]"), s = n.util.newFieldList([
            r
          ]).list()[0];
        }
        return s;
      },
      runtime: n
    };
  }
  function Va(n) {
    const e = n.field.localName, t = /* @__PURE__ */ Object.create(null);
    return t[e] = fd(n), [
      t,
      () => t[e]
    ];
  }
  function fd(n) {
    const e = n.field;
    if (e.repeated) return [];
    if (e.default !== void 0) return e.default;
    switch (e.kind) {
      case "enum":
        return e.T.values[0].no;
      case "scalar":
        return Ei(e.T, e.L);
      case "message":
        const t = e.T, i = new t();
        return t.fieldWrapper ? t.fieldWrapper.unwrapField(i) : i;
      case "map":
        throw "map fields are not allowed to be extensions";
    }
  }
  function gd(n, e) {
    if (!e.repeated && (e.kind == "enum" || e.kind == "scalar")) {
      for (let t = n.length - 1; t >= 0; --t) if (n[t].no == e.no) return [
        n[t]
      ];
      return [];
    }
    return n.filter((t) => t.no === e.no);
  }
  let bt = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split(""), Mn = [];
  for (let n = 0; n < bt.length; n++) Mn[bt[n].charCodeAt(0)] = n;
  Mn[45] = bt.indexOf("+");
  Mn[95] = bt.indexOf("/");
  const qa = {
    dec(n) {
      let e = n.length * 3 / 4;
      n[n.length - 2] == "=" ? e -= 2 : n[n.length - 1] == "=" && (e -= 1);
      let t = new Uint8Array(e), i = 0, s = 0, r, o = 0;
      for (let a = 0; a < n.length; a++) {
        if (r = Mn[n.charCodeAt(a)], r === void 0) switch (n[a]) {
          case "=":
            s = 0;
          case `
`:
          case "\r":
          case "	":
          case " ":
            continue;
          default:
            throw Error("invalid base64 string.");
        }
        switch (s) {
          case 0:
            o = r, s = 1;
            break;
          case 1:
            t[i++] = o << 2 | (r & 48) >> 4, o = r, s = 2;
            break;
          case 2:
            t[i++] = (o & 15) << 4 | (r & 60) >> 2, o = r, s = 3;
            break;
          case 3:
            t[i++] = (o & 3) << 6 | r, s = 0;
            break;
        }
      }
      if (s == 1) throw Error("invalid base64 string.");
      return t.subarray(0, i);
    },
    enc(n) {
      let e = "", t = 0, i, s = 0;
      for (let r = 0; r < n.length; r++) switch (i = n[r], t) {
        case 0:
          e += bt[i >> 2], s = (i & 3) << 4, t = 1;
          break;
        case 1:
          e += bt[s | i >> 4], s = (i & 15) << 2, t = 2;
          break;
        case 2:
          e += bt[s | i >> 6], e += bt[i & 63], t = 0;
          break;
      }
      return t && (e += bt[s], e += "=", t == 1 && (e += "=")), e;
    }
  };
  function vd(n, e, t) {
    Wa(e, n);
    const i = e.runtime.bin.makeReadOptions(t), s = gd(n.getType().runtime.bin.listUnknownFields(n), e.field), [r, o] = Va(e);
    for (const a of s) e.runtime.bin.readField(r, i.readerFactory(a.data), e.field, a.wireType, i);
    return o();
  }
  function yd(n, e, t, i) {
    Wa(e, n);
    const s = e.runtime.bin.makeReadOptions(i), r = e.runtime.bin.makeWriteOptions(i);
    if (Ga(n, e)) {
      const d = n.getType().runtime.bin.listUnknownFields(n).filter((l) => l.no != e.field.no);
      n.getType().runtime.bin.discardUnknownFields(n);
      for (const l of d) n.getType().runtime.bin.onUnknownField(n, l.no, l.wireType, l.data);
    }
    const o = r.writerFactory();
    let a = e.field;
    !a.opt && !a.repeated && (a.kind == "enum" || a.kind == "scalar") && (a = Object.assign(Object.assign({}, e.field), {
      opt: true
    })), e.runtime.bin.writeField(a, t, o, r);
    const c = s.readerFactory(o.finish());
    for (; c.pos < c.len; ) {
      const [d, l] = c.tag(), u = c.skip(l, d);
      n.getType().runtime.bin.onUnknownField(n, d, l, u);
    }
  }
  function Ga(n, e) {
    const t = n.getType();
    return e.extendee.typeName === t.typeName && !!t.runtime.bin.listUnknownFields(n).find((i) => i.no == e.field.no);
  }
  function Wa(n, e) {
    he(n.extendee.typeName == e.getType().typeName, "extension ".concat(n.typeName, " can only be applied to message ").concat(n.extendee.typeName));
  }
  function Ka(n, e) {
    const t = n.localName;
    if (n.repeated) return e[t].length > 0;
    if (n.oneof) return e[n.oneof.localName].case === t;
    switch (n.kind) {
      case "enum":
      case "scalar":
        return n.opt || n.req ? e[t] !== void 0 : n.kind == "enum" ? e[t] !== n.T.values[0].no : !Ba(n.T, e[t]);
      case "message":
        return e[t] !== void 0;
      case "map":
        return Object.keys(e[t]).length > 0;
    }
  }
  function Tr(n, e) {
    const t = n.localName, i = !n.opt && !n.req;
    if (n.repeated) e[t] = [];
    else if (n.oneof) e[n.oneof.localName] = {
      case: void 0
    };
    else switch (n.kind) {
      case "map":
        e[t] = {};
        break;
      case "enum":
        e[t] = i ? n.T.values[0].no : void 0;
        break;
      case "scalar":
        e[t] = i ? Ei(n.T, n.L) : void 0;
        break;
      case "message":
        e[t] = void 0;
        break;
    }
  }
  function kt(n, e) {
    if (n === null || typeof n != "object" || !Object.getOwnPropertyNames(Ls.prototype).every((i) => i in n && typeof n[i] == "function")) return false;
    const t = n.getType();
    return t === null || typeof t != "function" || !("typeName" in t) || typeof t.typeName != "string" ? false : e === void 0 ? true : t.typeName == e.typeName;
  }
  function Ha(n, e) {
    return kt(e) || !n.fieldWrapper ? e : n.fieldWrapper.wrapField(e);
  }
  E.DOUBLE, E.FLOAT, E.INT64, E.UINT64, E.INT32, E.UINT32, E.BOOL, E.STRING, E.BYTES;
  const Cr = {
    ignoreUnknownFields: false
  }, wr = {
    emitDefaultValues: false,
    enumAsInteger: false,
    useProtoFieldName: false,
    prettySpaces: 0
  };
  function bd(n) {
    return n ? Object.assign(Object.assign({}, Cr), n) : Cr;
  }
  function kd(n) {
    return n ? Object.assign(Object.assign({}, wr), n) : wr;
  }
  const kn = Symbol(), cn = Symbol();
  function Sd() {
    return {
      makeReadOptions: bd,
      makeWriteOptions: kd,
      readMessage(n, e, t, i) {
        if (e == null || Array.isArray(e) || typeof e != "object") throw new Error("cannot decode message ".concat(n.typeName, " from JSON: ").concat(dt(e)));
        i = i ?? new n();
        const s = /* @__PURE__ */ new Map(), r = t.typeRegistry;
        for (const [o, a] of Object.entries(e)) {
          const c = n.fields.findJsonName(o);
          if (c) {
            if (c.oneof) {
              if (a === null && c.kind == "scalar") continue;
              const d = s.get(c.oneof);
              if (d !== void 0) throw new Error("cannot decode message ".concat(n.typeName, ' from JSON: multiple keys for oneof "').concat(c.oneof.name, '" present: "').concat(d, '", "').concat(o, '"'));
              s.set(c.oneof, o);
            }
            Er(i, a, c, t, n);
          } else {
            let d = false;
            if ((r == null ? void 0 : r.findExtension) && o.startsWith("[") && o.endsWith("]")) {
              const l = r.findExtension(o.substring(1, o.length - 1));
              if (l && l.extendee.typeName == n.typeName) {
                d = true;
                const [u, h] = Va(l);
                Er(u, a, l.field, t, l), yd(i, l, h(), t);
              }
            }
            if (!d && !t.ignoreUnknownFields) throw new Error("cannot decode message ".concat(n.typeName, ' from JSON: key "').concat(o, '" is unknown'));
          }
        }
        return i;
      },
      writeMessage(n, e) {
        const t = n.getType(), i = {};
        let s;
        try {
          for (s of t.fields.byNumber()) {
            if (!Ka(s, n)) {
              if (s.req) throw "required field not set";
              if (!e.emitDefaultValues || !Cd(s)) continue;
            }
            const o = s.oneof ? n[s.oneof.localName].value : n[s.localName], a = Rr(s, o, e);
            a !== void 0 && (i[e.useProtoFieldName ? s.name : s.jsonName] = a);
          }
          const r = e.typeRegistry;
          if (r == null ? void 0 : r.findExtensionFor) for (const o of t.runtime.bin.listUnknownFields(n)) {
            const a = r.findExtensionFor(t.typeName, o.no);
            if (a && Ga(n, a)) {
              const c = vd(n, a, e), d = Rr(a.field, c, e);
              d !== void 0 && (i[a.field.jsonName] = d);
            }
          }
        } catch (r) {
          const o = s ? "cannot encode field ".concat(t.typeName, ".").concat(s.name, " to JSON") : "cannot encode message ".concat(t.typeName, " to JSON"), a = r instanceof Error ? r.message : String(r);
          throw new Error(o + (a.length > 0 ? ": ".concat(a) : ""));
        }
        return i;
      },
      readScalar(n, e, t) {
        return Gi(n, e, t ?? Vt.BIGINT, true);
      },
      writeScalar(n, e, t) {
        if (e !== void 0 && (t || Ba(n, e))) return dn(n, e);
      },
      debug: dt
    };
  }
  function dt(n) {
    if (n === null) return "null";
    switch (typeof n) {
      case "object":
        return Array.isArray(n) ? "array" : "object";
      case "string":
        return n.length > 100 ? "string" : '"'.concat(n.split('"').join('\\"'), '"');
      default:
        return String(n);
    }
  }
  function Er(n, e, t, i, s) {
    let r = t.localName;
    if (t.repeated) {
      if (he(t.kind != "map"), e === null) return;
      if (!Array.isArray(e)) throw new Error("cannot decode field ".concat(s.typeName, ".").concat(t.name, " from JSON: ").concat(dt(e)));
      const o = n[r];
      for (const a of e) {
        if (a === null) throw new Error("cannot decode field ".concat(s.typeName, ".").concat(t.name, " from JSON: ").concat(dt(a)));
        switch (t.kind) {
          case "message":
            o.push(t.T.fromJson(a, i));
            break;
          case "enum":
            const c = Kn(t.T, a, i.ignoreUnknownFields, true);
            c !== cn && o.push(c);
            break;
          case "scalar":
            try {
              o.push(Gi(t.T, a, t.L, true));
            } catch (d) {
              let l = "cannot decode field ".concat(s.typeName, ".").concat(t.name, " from JSON: ").concat(dt(a));
              throw d instanceof Error && d.message.length > 0 && (l += ": ".concat(d.message)), new Error(l);
            }
            break;
        }
      }
    } else if (t.kind == "map") {
      if (e === null) return;
      if (typeof e != "object" || Array.isArray(e)) throw new Error("cannot decode field ".concat(s.typeName, ".").concat(t.name, " from JSON: ").concat(dt(e)));
      const o = n[r];
      for (const [a, c] of Object.entries(e)) {
        if (c === null) throw new Error("cannot decode field ".concat(s.typeName, ".").concat(t.name, " from JSON: map value null"));
        let d;
        try {
          d = Td(t.K, a);
        } catch (l) {
          let u = "cannot decode map key for field ".concat(s.typeName, ".").concat(t.name, " from JSON: ").concat(dt(e));
          throw l instanceof Error && l.message.length > 0 && (u += ": ".concat(l.message)), new Error(u);
        }
        switch (t.V.kind) {
          case "message":
            o[d] = t.V.T.fromJson(c, i);
            break;
          case "enum":
            const l = Kn(t.V.T, c, i.ignoreUnknownFields, true);
            l !== cn && (o[d] = l);
            break;
          case "scalar":
            try {
              o[d] = Gi(t.V.T, c, Vt.BIGINT, true);
            } catch (u) {
              let h = "cannot decode map value for field ".concat(s.typeName, ".").concat(t.name, " from JSON: ").concat(dt(e));
              throw u instanceof Error && u.message.length > 0 && (h += ": ".concat(u.message)), new Error(h);
            }
            break;
        }
      }
    } else switch (t.oneof && (n = n[t.oneof.localName] = {
      case: r
    }, r = "value"), t.kind) {
      case "message":
        const o = t.T;
        if (e === null && o.typeName != "google.protobuf.Value") return;
        let a = n[r];
        kt(a) ? a.fromJson(e, i) : (n[r] = a = o.fromJson(e, i), o.fieldWrapper && !t.oneof && (n[r] = o.fieldWrapper.unwrapField(a)));
        break;
      case "enum":
        const c = Kn(t.T, e, i.ignoreUnknownFields, false);
        switch (c) {
          case kn:
            Tr(t, n);
            break;
          case cn:
            break;
          default:
            n[r] = c;
            break;
        }
        break;
      case "scalar":
        try {
          const d = Gi(t.T, e, t.L, false);
          switch (d) {
            case kn:
              Tr(t, n);
              break;
            default:
              n[r] = d;
              break;
          }
        } catch (d) {
          let l = "cannot decode field ".concat(s.typeName, ".").concat(t.name, " from JSON: ").concat(dt(e));
          throw d instanceof Error && d.message.length > 0 && (l += ": ".concat(d.message)), new Error(l);
        }
        break;
    }
  }
  function Td(n, e) {
    if (n === E.BOOL) switch (e) {
      case "true":
        e = true;
        break;
      case "false":
        e = false;
        break;
    }
    return Gi(n, e, Vt.BIGINT, true).toString();
  }
  function Gi(n, e, t, i) {
    if (e === null) return i ? Ei(n, t) : kn;
    switch (n) {
      case E.DOUBLE:
      case E.FLOAT:
        if (e === "NaN") return Number.NaN;
        if (e === "Infinity") return Number.POSITIVE_INFINITY;
        if (e === "-Infinity") return Number.NEGATIVE_INFINITY;
        if (e === "" || typeof e == "string" && e.trim().length !== e.length || typeof e != "string" && typeof e != "number") break;
        const s = Number(e);
        if (Number.isNaN(s) || !Number.isFinite(s)) break;
        return n == E.FLOAT && Da(s), s;
      case E.INT32:
      case E.FIXED32:
      case E.SFIXED32:
      case E.SINT32:
      case E.UINT32:
        let r;
        if (typeof e == "number" ? r = e : typeof e == "string" && e.length > 0 && e.trim().length === e.length && (r = Number(e)), r === void 0) break;
        return n == E.UINT32 || n == E.FIXED32 ? ls(r) : an(r), r;
      case E.INT64:
      case E.SFIXED64:
      case E.SINT64:
        if (typeof e != "number" && typeof e != "string") break;
        const o = le.parse(e);
        return t ? o.toString() : o;
      case E.FIXED64:
      case E.UINT64:
        if (typeof e != "number" && typeof e != "string") break;
        const a = le.uParse(e);
        return t ? a.toString() : a;
      case E.BOOL:
        if (typeof e != "boolean") break;
        return e;
      case E.STRING:
        if (typeof e != "string") break;
        try {
          encodeURIComponent(e);
        } catch {
          throw new Error("invalid UTF8");
        }
        return e;
      case E.BYTES:
        if (e === "") return new Uint8Array(0);
        if (typeof e != "string") break;
        return qa.dec(e);
    }
    throw new Error();
  }
  function Kn(n, e, t, i) {
    if (e === null) return n.typeName == "google.protobuf.NullValue" ? 0 : i ? n.values[0].no : kn;
    switch (typeof e) {
      case "number":
        if (Number.isInteger(e)) return e;
        break;
      case "string":
        const s = n.findName(e);
        if (s !== void 0) return s.no;
        if (t) return cn;
        break;
    }
    throw new Error("cannot decode enum ".concat(n.typeName, " from JSON: ").concat(dt(e)));
  }
  function Cd(n) {
    return n.repeated || n.kind == "map" ? true : !(n.oneof || n.kind == "message" || n.opt || n.req);
  }
  function Rr(n, e, t) {
    if (n.kind == "map") {
      he(typeof e == "object" && e != null);
      const i = {}, s = Object.entries(e);
      switch (n.V.kind) {
        case "scalar":
          for (const [o, a] of s) i[o.toString()] = dn(n.V.T, a);
          break;
        case "message":
          for (const [o, a] of s) i[o.toString()] = a.toJson(t);
          break;
        case "enum":
          const r = n.V.T;
          for (const [o, a] of s) i[o.toString()] = Hn(r, a, t.enumAsInteger);
          break;
      }
      return t.emitDefaultValues || s.length > 0 ? i : void 0;
    }
    if (n.repeated) {
      he(Array.isArray(e));
      const i = [];
      switch (n.kind) {
        case "scalar":
          for (let s = 0; s < e.length; s++) i.push(dn(n.T, e[s]));
          break;
        case "enum":
          for (let s = 0; s < e.length; s++) i.push(Hn(n.T, e[s], t.enumAsInteger));
          break;
        case "message":
          for (let s = 0; s < e.length; s++) i.push(e[s].toJson(t));
          break;
      }
      return t.emitDefaultValues || i.length > 0 ? i : void 0;
    }
    switch (n.kind) {
      case "scalar":
        return dn(n.T, e);
      case "enum":
        return Hn(n.T, e, t.enumAsInteger);
      case "message":
        return Ha(n.T, e).toJson(t);
    }
  }
  function Hn(n, e, t) {
    var i;
    if (he(typeof e == "number"), n.typeName == "google.protobuf.NullValue") return null;
    if (t) return e;
    const s = n.findNumber(e);
    return (i = s == null ? void 0 : s.name) !== null && i !== void 0 ? i : e;
  }
  function dn(n, e) {
    switch (n) {
      case E.INT32:
      case E.SFIXED32:
      case E.SINT32:
      case E.FIXED32:
      case E.UINT32:
        return he(typeof e == "number"), e;
      case E.FLOAT:
      case E.DOUBLE:
        return he(typeof e == "number"), Number.isNaN(e) ? "NaN" : e === Number.POSITIVE_INFINITY ? "Infinity" : e === Number.NEGATIVE_INFINITY ? "-Infinity" : e;
      case E.STRING:
        return he(typeof e == "string"), e;
      case E.BOOL:
        return he(typeof e == "boolean"), e;
      case E.UINT64:
      case E.FIXED64:
      case E.INT64:
      case E.SFIXED64:
      case E.SINT64:
        return he(typeof e == "bigint" || typeof e == "string" || typeof e == "number"), e.toString();
      case E.BYTES:
        return he(e instanceof Uint8Array), qa.enc(e);
    }
  }
  const di = Symbol("@bufbuild/protobuf/unknown-fields"), Pr = {
    readUnknownFields: true,
    readerFactory: (n) => new pd(n)
  }, _r = {
    writeUnknownFields: true,
    writerFactory: () => new hd()
  };
  function wd(n) {
    return n ? Object.assign(Object.assign({}, Pr), n) : Pr;
  }
  function Ed(n) {
    return n ? Object.assign(Object.assign({}, _r), n) : _r;
  }
  function Rd() {
    return {
      makeReadOptions: wd,
      makeWriteOptions: Ed,
      listUnknownFields(n) {
        var e;
        return (e = n[di]) !== null && e !== void 0 ? e : [];
      },
      discardUnknownFields(n) {
        delete n[di];
      },
      writeUnknownFields(n, e) {
        const i = n[di];
        if (i) for (const s of i) e.tag(s.no, s.wireType).raw(s.data);
      },
      onUnknownField(n, e, t, i) {
        const s = n;
        Array.isArray(s[di]) || (s[di] = []), s[di].push({
          no: e,
          wireType: t,
          data: i
        });
      },
      readMessage(n, e, t, i, s) {
        const r = n.getType(), o = s ? e.len : e.pos + t;
        let a, c;
        for (; e.pos < o && ([a, c] = e.tag(), !(s === true && c == fe.EndGroup)); ) {
          const d = r.fields.find(a);
          if (!d) {
            const l = e.skip(c, a);
            i.readUnknownFields && this.onUnknownField(n, a, c, l);
            continue;
          }
          Ir(n, e, d, c, i);
        }
        if (s && (c != fe.EndGroup || a !== t)) throw new Error("invalid end group tag");
      },
      readField: Ir,
      writeMessage(n, e, t) {
        const i = n.getType();
        for (const s of i.fields.byNumber()) {
          if (!Ka(s, n)) {
            if (s.req) throw new Error("cannot encode field ".concat(i.typeName, ".").concat(s.name, " to binary: required field not set"));
            continue;
          }
          const r = s.oneof ? n[s.oneof.localName].value : n[s.localName];
          xr(s, r, e, t);
        }
        return t.writeUnknownFields && this.writeUnknownFields(n, e), e;
      },
      writeField(n, e, t, i) {
        e !== void 0 && xr(n, e, t, i);
      }
    };
  }
  function Ir(n, e, t, i, s) {
    let { repeated: r, localName: o } = t;
    switch (t.oneof && (n = n[t.oneof.localName], n.case != o && delete n.value, n.case = o, o = "value"), t.kind) {
      case "scalar":
      case "enum":
        const a = t.kind == "enum" ? E.INT32 : t.T;
        let c = Sn;
        if (t.kind == "scalar" && t.L > 0 && (c = _d), r) {
          let h = n[o];
          if (i == fe.LengthDelimited && a != E.STRING && a != E.BYTES) {
            let v = e.uint32() + e.pos;
            for (; e.pos < v; ) h.push(c(e, a));
          } else h.push(c(e, a));
        } else n[o] = c(e, a);
        break;
      case "message":
        const d = t.T;
        r ? n[o].push(ln(e, new d(), s, t)) : kt(n[o]) ? ln(e, n[o], s, t) : (n[o] = ln(e, new d(), s, t), d.fieldWrapper && !t.oneof && !t.repeated && (n[o] = d.fieldWrapper.unwrapField(n[o])));
        break;
      case "map":
        let [l, u] = Pd(t, e, s);
        n[o][l] = u;
        break;
    }
  }
  function ln(n, e, t, i) {
    const s = e.getType().runtime.bin, r = i == null ? void 0 : i.delimited;
    return s.readMessage(e, n, r ? i.no : n.uint32(), t, r), e;
  }
  function Pd(n, e, t) {
    const i = e.uint32(), s = e.pos + i;
    let r, o;
    for (; e.pos < s; ) {
      const [a] = e.tag();
      switch (a) {
        case 1:
          r = Sn(e, n.K);
          break;
        case 2:
          switch (n.V.kind) {
            case "scalar":
              o = Sn(e, n.V.T);
              break;
            case "enum":
              o = e.int32();
              break;
            case "message":
              o = ln(e, new n.V.T(), t, void 0);
              break;
          }
          break;
      }
    }
    if (r === void 0 && (r = Ei(n.K, Vt.BIGINT)), typeof r != "string" && typeof r != "number" && (r = r.toString()), o === void 0) switch (n.V.kind) {
      case "scalar":
        o = Ei(n.V.T, Vt.BIGINT);
        break;
      case "enum":
        o = n.V.T.values[0].no;
        break;
      case "message":
        o = new n.V.T();
        break;
    }
    return [
      r,
      o
    ];
  }
  function _d(n, e) {
    const t = Sn(n, e);
    return typeof t == "bigint" ? t.toString() : t;
  }
  function Sn(n, e) {
    switch (e) {
      case E.STRING:
        return n.string();
      case E.BOOL:
        return n.bool();
      case E.DOUBLE:
        return n.double();
      case E.FLOAT:
        return n.float();
      case E.INT32:
        return n.int32();
      case E.INT64:
        return n.int64();
      case E.UINT64:
        return n.uint64();
      case E.FIXED64:
        return n.fixed64();
      case E.BYTES:
        return n.bytes();
      case E.FIXED32:
        return n.fixed32();
      case E.SFIXED32:
        return n.sfixed32();
      case E.SFIXED64:
        return n.sfixed64();
      case E.SINT64:
        return n.sint64();
      case E.UINT32:
        return n.uint32();
      case E.SINT32:
        return n.sint32();
    }
  }
  function xr(n, e, t, i) {
    he(e !== void 0);
    const s = n.repeated;
    switch (n.kind) {
      case "scalar":
      case "enum":
        let r = n.kind == "enum" ? E.INT32 : n.T;
        if (s) if (he(Array.isArray(e)), n.packed) xd(t, r, n.no, e);
        else for (const o of e) Wi(t, r, n.no, o);
        else Wi(t, r, n.no, e);
        break;
      case "message":
        if (s) {
          he(Array.isArray(e));
          for (const o of e) Mr(t, i, n, o);
        } else Mr(t, i, n, e);
        break;
      case "map":
        he(typeof e == "object" && e != null);
        for (const [o, a] of Object.entries(e)) Id(t, i, n, o, a);
        break;
    }
  }
  function Id(n, e, t, i, s) {
    n.tag(t.no, fe.LengthDelimited), n.fork();
    let r = i;
    switch (t.K) {
      case E.INT32:
      case E.FIXED32:
      case E.UINT32:
      case E.SFIXED32:
      case E.SINT32:
        r = Number.parseInt(i);
        break;
      case E.BOOL:
        he(i == "true" || i == "false"), r = i == "true";
        break;
    }
    switch (Wi(n, t.K, 1, r), t.V.kind) {
      case "scalar":
        Wi(n, t.V.T, 2, s);
        break;
      case "enum":
        Wi(n, E.INT32, 2, s);
        break;
      case "message":
        he(s !== void 0), n.tag(2, fe.LengthDelimited).bytes(s.toBinary(e));
        break;
    }
    n.join();
  }
  function Mr(n, e, t, i) {
    const s = Ha(t.T, i);
    t.delimited ? n.tag(t.no, fe.StartGroup).raw(s.toBinary(e)).tag(t.no, fe.EndGroup) : n.tag(t.no, fe.LengthDelimited).bytes(s.toBinary(e));
  }
  function Wi(n, e, t, i) {
    he(i !== void 0);
    let [s, r] = Ja(e);
    n.tag(t, s)[r](i);
  }
  function xd(n, e, t, i) {
    if (!i.length) return;
    n.tag(t, fe.LengthDelimited).fork();
    let [, s] = Ja(e);
    for (let r = 0; r < i.length; r++) n[s](i[r]);
    n.join();
  }
  function Ja(n) {
    let e = fe.Varint;
    switch (n) {
      case E.BYTES:
      case E.STRING:
        e = fe.LengthDelimited;
        break;
      case E.DOUBLE:
      case E.FIXED64:
      case E.SFIXED64:
        e = fe.Bit64;
        break;
      case E.FIXED32:
      case E.SFIXED32:
      case E.FLOAT:
        e = fe.Bit32;
        break;
    }
    const t = E[n].toLowerCase();
    return [
      e,
      t
    ];
  }
  function Md() {
    return {
      setEnumType: Na,
      initPartial(n, e) {
        if (n === void 0) return;
        const t = e.getType();
        for (const i of t.fields.byMember()) {
          const s = i.localName, r = e, o = n;
          if (o[s] != null) switch (i.kind) {
            case "oneof":
              const a = o[s].case;
              if (a === void 0) continue;
              const c = i.findField(a);
              let d = o[s].value;
              c && c.kind == "message" && !kt(d, c.T) ? d = new c.T(d) : c && c.kind === "scalar" && c.T === E.BYTES && (d = Ai(d)), r[s] = {
                case: a,
                value: d
              };
              break;
            case "scalar":
            case "enum":
              let l = o[s];
              i.T === E.BYTES && (l = i.repeated ? l.map(Ai) : Ai(l)), r[s] = l;
              break;
            case "map":
              switch (i.V.kind) {
                case "scalar":
                case "enum":
                  if (i.V.T === E.BYTES) for (const [m, v] of Object.entries(o[s])) r[s][m] = Ai(v);
                  else Object.assign(r[s], o[s]);
                  break;
                case "message":
                  const h = i.V.T;
                  for (const m of Object.keys(o[s])) {
                    let v = o[s][m];
                    h.fieldWrapper || (v = new h(v)), r[s][m] = v;
                  }
                  break;
              }
              break;
            case "message":
              const u = i.T;
              if (i.repeated) r[s] = o[s].map((h) => kt(h, u) ? h : new u(h));
              else {
                const h = o[s];
                u.fieldWrapper ? u.typeName === "google.protobuf.BytesValue" ? r[s] = Ai(h) : r[s] = h : r[s] = kt(h, u) ? h : new u(h);
              }
              break;
          }
        }
      },
      equals(n, e, t) {
        return e === t ? true : !e || !t ? false : n.fields.byMember().every((i) => {
          const s = e[i.localName], r = t[i.localName];
          if (i.repeated) {
            if (s.length !== r.length) return false;
            switch (i.kind) {
              case "message":
                return s.every((o, a) => i.T.equals(o, r[a]));
              case "scalar":
                return s.every((o, a) => It(i.T, o, r[a]));
              case "enum":
                return s.every((o, a) => It(E.INT32, o, r[a]));
            }
            throw new Error("repeated cannot contain ".concat(i.kind));
          }
          switch (i.kind) {
            case "message":
              let o = s, a = r;
              return i.T.fieldWrapper && (o !== void 0 && !kt(o) && (o = i.T.fieldWrapper.wrapField(o)), a !== void 0 && !kt(a) && (a = i.T.fieldWrapper.wrapField(a))), i.T.equals(o, a);
            case "enum":
              return It(E.INT32, s, r);
            case "scalar":
              return It(i.T, s, r);
            case "oneof":
              if (s.case !== r.case) return false;
              const c = i.findField(s.case);
              if (c === void 0) return true;
              switch (c.kind) {
                case "message":
                  return c.T.equals(s.value, r.value);
                case "enum":
                  return It(E.INT32, s.value, r.value);
                case "scalar":
                  return It(c.T, s.value, r.value);
              }
              throw new Error("oneof cannot contain ".concat(c.kind));
            case "map":
              const d = Object.keys(s).concat(Object.keys(r));
              switch (i.V.kind) {
                case "message":
                  const l = i.V.T;
                  return d.every((h) => l.equals(s[h], r[h]));
                case "enum":
                  return d.every((h) => It(E.INT32, s[h], r[h]));
                case "scalar":
                  const u = i.V.T;
                  return d.every((h) => It(u, s[h], r[h]));
              }
              break;
          }
        });
      },
      clone(n) {
        const e = n.getType(), t = new e(), i = t;
        for (const s of e.fields.byMember()) {
          const r = n[s.localName];
          let o;
          if (s.repeated) o = r.map(sn);
          else if (s.kind == "map") {
            o = i[s.localName];
            for (const [a, c] of Object.entries(r)) o[a] = sn(c);
          } else s.kind == "oneof" ? o = s.findField(r.case) ? {
            case: r.case,
            value: sn(r.value)
          } : {
            case: void 0
          } : o = sn(r);
          i[s.localName] = o;
        }
        for (const s of e.runtime.bin.listUnknownFields(n)) e.runtime.bin.onUnknownField(i, s.no, s.wireType, s.data);
        return t;
      }
    };
  }
  function sn(n) {
    if (n === void 0) return n;
    if (kt(n)) return n.clone();
    if (n instanceof Uint8Array) {
      const e = new Uint8Array(n.byteLength);
      return e.set(n), e;
    }
    return n;
  }
  function Ai(n) {
    return n instanceof Uint8Array ? n : new Uint8Array(n);
  }
  function Od(n, e, t) {
    return {
      syntax: n,
      json: Sd(),
      bin: Rd(),
      util: Object.assign(Object.assign({}, Md()), {
        newFieldList: e,
        initFields: t
      }),
      makeMessageType(i, s, r) {
        return ad(this, i, s, r);
      },
      makeEnum: rd,
      makeEnumType: La,
      getEnumType: sd,
      makeExtension(i, s, r) {
        return md(this, i, s, r);
      }
    };
  }
  class Dd {
    constructor(e, t) {
      this._fields = e, this._normalizer = t;
    }
    findJsonName(e) {
      if (!this.jsonNames) {
        const t = {};
        for (const i of this.list()) t[i.jsonName] = t[i.name] = i;
        this.jsonNames = t;
      }
      return this.jsonNames[e];
    }
    find(e) {
      if (!this.numbers) {
        const t = {};
        for (const i of this.list()) t[i.no] = i;
        this.numbers = t;
      }
      return this.numbers[e];
    }
    list() {
      return this.all || (this.all = this._normalizer(this._fields)), this.all;
    }
    byNumber() {
      return this.numbersAsc || (this.numbersAsc = this.list().concat().sort((e, t) => e.no - t.no)), this.numbersAsc;
    }
    byMember() {
      if (!this.members) {
        this.members = [];
        const e = this.members;
        let t;
        for (const i of this.list()) i.oneof ? i.oneof !== t && (t = i.oneof, e.push(t)) : e.push(i);
      }
      return this.members;
    }
  }
  function za(n, e) {
    const t = $a(n);
    return e ? t : Fd(jd(t));
  }
  function Ad(n) {
    return za(n, false);
  }
  const Nd = $a;
  function $a(n) {
    let e = false;
    const t = [];
    for (let i = 0; i < n.length; i++) {
      let s = n.charAt(i);
      switch (s) {
        case "_":
          e = true;
          break;
        case "0":
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
          t.push(s), e = false;
          break;
        default:
          e && (e = false, s = s.toUpperCase()), t.push(s);
          break;
      }
    }
    return t.join("");
  }
  const Ld = /* @__PURE__ */ new Set([
    "constructor",
    "toString",
    "toJSON",
    "valueOf"
  ]), Ud = /* @__PURE__ */ new Set([
    "getType",
    "clone",
    "equals",
    "fromBinary",
    "fromJson",
    "fromJsonString",
    "toBinary",
    "toJson",
    "toJsonString",
    "toObject"
  ]), Qa = (n) => "".concat(n, "$"), jd = (n) => Ud.has(n) ? Qa(n) : n, Fd = (n) => Ld.has(n) ? Qa(n) : n;
  class Bd {
    constructor(e) {
      this.kind = "oneof", this.repeated = false, this.packed = false, this.opt = false, this.req = false, this.default = void 0, this.fields = [], this.name = e, this.localName = Ad(e);
    }
    addField(e) {
      he(e.oneof === this, "field ".concat(e.name, " not one of ").concat(this.name)), this.fields.push(e);
    }
    findField(e) {
      if (!this._lookup) {
        this._lookup = /* @__PURE__ */ Object.create(null);
        for (let t = 0; t < this.fields.length; t++) this._lookup[this.fields[t].localName] = this.fields[t];
      }
      return this._lookup[e];
    }
  }
  function Vd(n, e) {
    var t, i, s, r, o, a;
    const c = [];
    let d;
    for (const l of typeof n == "function" ? n() : n) {
      const u = l;
      if (u.localName = za(l.name, l.oneof !== void 0), u.jsonName = (t = l.jsonName) !== null && t !== void 0 ? t : Nd(l.name), u.repeated = (i = l.repeated) !== null && i !== void 0 ? i : false, l.kind == "scalar" && (u.L = (s = l.L) !== null && s !== void 0 ? s : Vt.BIGINT), u.delimited = (r = l.delimited) !== null && r !== void 0 ? r : false, u.req = (o = l.req) !== null && o !== void 0 ? o : false, u.opt = (a = l.opt) !== null && a !== void 0 ? a : false, l.packed === void 0 && (u.packed = l.kind == "enum" || l.kind == "scalar" && l.T != E.BYTES && l.T != E.STRING), l.oneof !== void 0) {
        const h = typeof l.oneof == "string" ? l.oneof : l.oneof.name;
        (!d || d.name != h) && (d = new Bd(h)), u.oneof = d, d.addField(u);
      }
      c.push(u);
    }
    return c;
  }
  const y = Od("proto3", (n) => new Dd(n, (e) => Vd(e)), (n) => {
    for (const e of n.getType().fields.byMember()) {
      if (e.opt) continue;
      const t = e.localName, i = n;
      if (e.repeated) {
        i[t] = [];
        continue;
      }
      switch (e.kind) {
        case "oneof":
          i[t] = {
            case: void 0
          };
          break;
        case "enum":
          i[t] = 0;
          break;
        case "map":
          i[t] = {};
          break;
        case "scalar":
          i[t] = Ei(e.T, e.L);
          break;
      }
    }
  });
  class qe extends Ls {
    constructor(e) {
      super(), this.seconds = le.zero, this.nanos = 0, y.util.initPartial(e, this);
    }
    fromJson(e, t) {
      if (typeof e != "string") throw new Error("cannot decode google.protobuf.Timestamp from JSON: ".concat(y.json.debug(e)));
      const i = e.match(/^([0-9]{4})-([0-9]{2})-([0-9]{2})T([0-9]{2}):([0-9]{2}):([0-9]{2})(?:Z|\.([0-9]{3,9})Z|([+-][0-9][0-9]:[0-9][0-9]))$/);
      if (!i) throw new Error("cannot decode google.protobuf.Timestamp from JSON: invalid RFC 3339 string");
      const s = Date.parse(i[1] + "-" + i[2] + "-" + i[3] + "T" + i[4] + ":" + i[5] + ":" + i[6] + (i[8] ? i[8] : "Z"));
      if (Number.isNaN(s)) throw new Error("cannot decode google.protobuf.Timestamp from JSON: invalid RFC 3339 string");
      if (s < Date.parse("0001-01-01T00:00:00Z") || s > Date.parse("9999-12-31T23:59:59Z")) throw new Error("cannot decode message google.protobuf.Timestamp from JSON: must be from 0001-01-01T00:00:00Z to 9999-12-31T23:59:59Z inclusive");
      return this.seconds = le.parse(s / 1e3), this.nanos = 0, i[7] && (this.nanos = parseInt("1" + i[7] + "0".repeat(9 - i[7].length)) - 1e9), this;
    }
    toJson(e) {
      const t = Number(this.seconds) * 1e3;
      if (t < Date.parse("0001-01-01T00:00:00Z") || t > Date.parse("9999-12-31T23:59:59Z")) throw new Error("cannot encode google.protobuf.Timestamp to JSON: must be from 0001-01-01T00:00:00Z to 9999-12-31T23:59:59Z inclusive");
      if (this.nanos < 0) throw new Error("cannot encode google.protobuf.Timestamp to JSON: nanos must not be negative");
      let i = "Z";
      if (this.nanos > 0) {
        const s = (this.nanos + 1e9).toString().substring(1);
        s.substring(3) === "000000" ? i = "." + s.substring(0, 3) + "Z" : s.substring(6) === "000" ? i = "." + s.substring(0, 6) + "Z" : i = "." + s + "Z";
      }
      return new Date(t).toISOString().replace(".000Z", i);
    }
    toDate() {
      return new Date(Number(this.seconds) * 1e3 + Math.ceil(this.nanos / 1e6));
    }
    static now() {
      return qe.fromDate(/* @__PURE__ */ new Date());
    }
    static fromDate(e) {
      const t = e.getTime();
      return new qe({
        seconds: le.parse(Math.floor(t / 1e3)),
        nanos: t % 1e3 * 1e6
      });
    }
    static fromBinary(e, t) {
      return new qe().fromBinary(e, t);
    }
    static fromJson(e, t) {
      return new qe().fromJson(e, t);
    }
    static fromJsonString(e, t) {
      return new qe().fromJsonString(e, t);
    }
    static equals(e, t) {
      return y.util.equals(qe, e, t);
    }
  }
  qe.runtime = y;
  qe.typeName = "google.protobuf.Timestamp";
  qe.fields = y.util.newFieldList(() => [
    {
      no: 1,
      name: "seconds",
      kind: "scalar",
      T: 3
    },
    {
      no: 2,
      name: "nanos",
      kind: "scalar",
      T: 5
    }
  ]);
  const qd = y.makeMessageType("livekit.MetricsBatch", () => [
    {
      no: 1,
      name: "timestamp_ms",
      kind: "scalar",
      T: 3
    },
    {
      no: 2,
      name: "normalized_timestamp",
      kind: "message",
      T: qe
    },
    {
      no: 3,
      name: "str_data",
      kind: "scalar",
      T: 9,
      repeated: true
    },
    {
      no: 4,
      name: "time_series",
      kind: "message",
      T: Gd,
      repeated: true
    },
    {
      no: 5,
      name: "events",
      kind: "message",
      T: Kd,
      repeated: true
    }
  ]), Gd = y.makeMessageType("livekit.TimeSeriesMetric", () => [
    {
      no: 1,
      name: "label",
      kind: "scalar",
      T: 13
    },
    {
      no: 2,
      name: "participant_identity",
      kind: "scalar",
      T: 13
    },
    {
      no: 3,
      name: "track_sid",
      kind: "scalar",
      T: 13
    },
    {
      no: 4,
      name: "samples",
      kind: "message",
      T: Wd,
      repeated: true
    },
    {
      no: 5,
      name: "rid",
      kind: "scalar",
      T: 13
    }
  ]), Wd = y.makeMessageType("livekit.MetricSample", () => [
    {
      no: 1,
      name: "timestamp_ms",
      kind: "scalar",
      T: 3
    },
    {
      no: 2,
      name: "normalized_timestamp",
      kind: "message",
      T: qe
    },
    {
      no: 3,
      name: "value",
      kind: "scalar",
      T: 2
    }
  ]), Kd = y.makeMessageType("livekit.EventMetric", () => [
    {
      no: 1,
      name: "label",
      kind: "scalar",
      T: 13
    },
    {
      no: 2,
      name: "participant_identity",
      kind: "scalar",
      T: 13
    },
    {
      no: 3,
      name: "track_sid",
      kind: "scalar",
      T: 13
    },
    {
      no: 4,
      name: "start_timestamp_ms",
      kind: "scalar",
      T: 3
    },
    {
      no: 5,
      name: "end_timestamp_ms",
      kind: "scalar",
      T: 3,
      opt: true
    },
    {
      no: 6,
      name: "normalized_start_timestamp",
      kind: "message",
      T: qe
    },
    {
      no: 7,
      name: "normalized_end_timestamp",
      kind: "message",
      T: qe,
      opt: true
    },
    {
      no: 8,
      name: "metadata",
      kind: "scalar",
      T: 9
    },
    {
      no: 9,
      name: "rid",
      kind: "scalar",
      T: 13
    }
  ]), Ya = y.makeEnum("livekit.BackupCodecPolicy", [
    {
      no: 0,
      name: "PREFER_REGRESSION"
    },
    {
      no: 1,
      name: "SIMULCAST"
    },
    {
      no: 2,
      name: "REGRESSION"
    }
  ]), it = y.makeEnum("livekit.TrackType", [
    {
      no: 0,
      name: "AUDIO"
    },
    {
      no: 1,
      name: "VIDEO"
    },
    {
      no: 2,
      name: "DATA"
    }
  ]), be = y.makeEnum("livekit.TrackSource", [
    {
      no: 0,
      name: "UNKNOWN"
    },
    {
      no: 1,
      name: "CAMERA"
    },
    {
      no: 2,
      name: "MICROPHONE"
    },
    {
      no: 3,
      name: "SCREEN_SHARE"
    },
    {
      no: 4,
      name: "SCREEN_SHARE_AUDIO"
    }
  ]), js = y.makeEnum("livekit.VideoQuality", [
    {
      no: 0,
      name: "LOW"
    },
    {
      no: 1,
      name: "MEDIUM"
    },
    {
      no: 2,
      name: "HIGH"
    },
    {
      no: 3,
      name: "OFF"
    }
  ]), Bi = y.makeEnum("livekit.ConnectionQuality", [
    {
      no: 0,
      name: "POOR"
    },
    {
      no: 1,
      name: "GOOD"
    },
    {
      no: 2,
      name: "EXCELLENT"
    },
    {
      no: 3,
      name: "LOST"
    }
  ]), Ji = y.makeEnum("livekit.ClientConfigSetting", [
    {
      no: 0,
      name: "UNSET"
    },
    {
      no: 1,
      name: "DISABLED"
    },
    {
      no: 2,
      name: "ENABLED"
    }
  ]), rt = y.makeEnum("livekit.DisconnectReason", [
    {
      no: 0,
      name: "UNKNOWN_REASON"
    },
    {
      no: 1,
      name: "CLIENT_INITIATED"
    },
    {
      no: 2,
      name: "DUPLICATE_IDENTITY"
    },
    {
      no: 3,
      name: "SERVER_SHUTDOWN"
    },
    {
      no: 4,
      name: "PARTICIPANT_REMOVED"
    },
    {
      no: 5,
      name: "ROOM_DELETED"
    },
    {
      no: 6,
      name: "STATE_MISMATCH"
    },
    {
      no: 7,
      name: "JOIN_FAILURE"
    },
    {
      no: 8,
      name: "MIGRATION"
    },
    {
      no: 9,
      name: "SIGNAL_CLOSE"
    },
    {
      no: 10,
      name: "ROOM_CLOSED"
    },
    {
      no: 11,
      name: "USER_UNAVAILABLE"
    },
    {
      no: 12,
      name: "USER_REJECTED"
    },
    {
      no: 13,
      name: "SIP_TRUNK_FAILURE"
    },
    {
      no: 14,
      name: "CONNECTION_TIMEOUT"
    },
    {
      no: 15,
      name: "MEDIA_FAILURE"
    }
  ]), Zt = y.makeEnum("livekit.ReconnectReason", [
    {
      no: 0,
      name: "RR_UNKNOWN"
    },
    {
      no: 1,
      name: "RR_SIGNAL_DISCONNECTED"
    },
    {
      no: 2,
      name: "RR_PUBLISHER_FAILED"
    },
    {
      no: 3,
      name: "RR_SUBSCRIBER_FAILED"
    },
    {
      no: 4,
      name: "RR_SWITCH_CANDIDATE"
    }
  ]), Hd = y.makeEnum("livekit.SubscriptionError", [
    {
      no: 0,
      name: "SE_UNKNOWN"
    },
    {
      no: 1,
      name: "SE_CODEC_UNSUPPORTED"
    },
    {
      no: 2,
      name: "SE_TRACK_NOTFOUND"
    }
  ]), we = y.makeEnum("livekit.AudioTrackFeature", [
    {
      no: 0,
      name: "TF_STEREO"
    },
    {
      no: 1,
      name: "TF_NO_DTX"
    },
    {
      no: 2,
      name: "TF_AUTO_GAIN_CONTROL"
    },
    {
      no: 3,
      name: "TF_ECHO_CANCELLATION"
    },
    {
      no: 4,
      name: "TF_NOISE_SUPPRESSION"
    },
    {
      no: 5,
      name: "TF_ENHANCED_NOISE_CANCELLATION"
    },
    {
      no: 6,
      name: "TF_PRECONNECT_BUFFER"
    }
  ]), On = y.makeMessageType("livekit.Room", () => [
    {
      no: 1,
      name: "sid",
      kind: "scalar",
      T: 9
    },
    {
      no: 2,
      name: "name",
      kind: "scalar",
      T: 9
    },
    {
      no: 3,
      name: "empty_timeout",
      kind: "scalar",
      T: 13
    },
    {
      no: 14,
      name: "departure_timeout",
      kind: "scalar",
      T: 13
    },
    {
      no: 4,
      name: "max_participants",
      kind: "scalar",
      T: 13
    },
    {
      no: 5,
      name: "creation_time",
      kind: "scalar",
      T: 3
    },
    {
      no: 15,
      name: "creation_time_ms",
      kind: "scalar",
      T: 3
    },
    {
      no: 6,
      name: "turn_password",
      kind: "scalar",
      T: 9
    },
    {
      no: 7,
      name: "enabled_codecs",
      kind: "message",
      T: Tn,
      repeated: true
    },
    {
      no: 8,
      name: "metadata",
      kind: "scalar",
      T: 9
    },
    {
      no: 9,
      name: "num_participants",
      kind: "scalar",
      T: 13
    },
    {
      no: 11,
      name: "num_publishers",
      kind: "scalar",
      T: 13
    },
    {
      no: 10,
      name: "active_recording",
      kind: "scalar",
      T: 8
    },
    {
      no: 13,
      name: "version",
      kind: "message",
      T: uo
    }
  ]), Tn = y.makeMessageType("livekit.Codec", () => [
    {
      no: 1,
      name: "mime",
      kind: "scalar",
      T: 9
    },
    {
      no: 2,
      name: "fmtp_line",
      kind: "scalar",
      T: 9
    }
  ]), Jd = y.makeMessageType("livekit.ParticipantPermission", () => [
    {
      no: 1,
      name: "can_subscribe",
      kind: "scalar",
      T: 8
    },
    {
      no: 2,
      name: "can_publish",
      kind: "scalar",
      T: 8
    },
    {
      no: 3,
      name: "can_publish_data",
      kind: "scalar",
      T: 8
    },
    {
      no: 9,
      name: "can_publish_sources",
      kind: "enum",
      T: y.getEnumType(be),
      repeated: true
    },
    {
      no: 7,
      name: "hidden",
      kind: "scalar",
      T: 8
    },
    {
      no: 8,
      name: "recorder",
      kind: "scalar",
      T: 8
    },
    {
      no: 10,
      name: "can_update_metadata",
      kind: "scalar",
      T: 8
    },
    {
      no: 11,
      name: "agent",
      kind: "scalar",
      T: 8
    },
    {
      no: 12,
      name: "can_subscribe_metrics",
      kind: "scalar",
      T: 8
    }
  ]), ii = y.makeMessageType("livekit.ParticipantInfo", () => [
    {
      no: 1,
      name: "sid",
      kind: "scalar",
      T: 9
    },
    {
      no: 2,
      name: "identity",
      kind: "scalar",
      T: 9
    },
    {
      no: 3,
      name: "state",
      kind: "enum",
      T: y.getEnumType(vi)
    },
    {
      no: 4,
      name: "tracks",
      kind: "message",
      T: hi,
      repeated: true
    },
    {
      no: 5,
      name: "metadata",
      kind: "scalar",
      T: 9
    },
    {
      no: 6,
      name: "joined_at",
      kind: "scalar",
      T: 3
    },
    {
      no: 17,
      name: "joined_at_ms",
      kind: "scalar",
      T: 3
    },
    {
      no: 9,
      name: "name",
      kind: "scalar",
      T: 9
    },
    {
      no: 10,
      name: "version",
      kind: "scalar",
      T: 13
    },
    {
      no: 11,
      name: "permission",
      kind: "message",
      T: Jd
    },
    {
      no: 12,
      name: "region",
      kind: "scalar",
      T: 9
    },
    {
      no: 13,
      name: "is_publisher",
      kind: "scalar",
      T: 8
    },
    {
      no: 14,
      name: "kind",
      kind: "enum",
      T: y.getEnumType(zi)
    },
    {
      no: 15,
      name: "attributes",
      kind: "map",
      K: 9,
      V: {
        kind: "scalar",
        T: 9
      }
    },
    {
      no: 16,
      name: "disconnect_reason",
      kind: "enum",
      T: y.getEnumType(rt)
    },
    {
      no: 18,
      name: "kind_details",
      kind: "enum",
      T: y.getEnumType(zd),
      repeated: true
    },
    {
      no: 19,
      name: "data_tracks",
      kind: "message",
      T: Fs,
      repeated: true
    }
  ]), vi = y.makeEnum("livekit.ParticipantInfo.State", [
    {
      no: 0,
      name: "JOINING"
    },
    {
      no: 1,
      name: "JOINED"
    },
    {
      no: 2,
      name: "ACTIVE"
    },
    {
      no: 3,
      name: "DISCONNECTED"
    }
  ]), zi = y.makeEnum("livekit.ParticipantInfo.Kind", [
    {
      no: 0,
      name: "STANDARD"
    },
    {
      no: 1,
      name: "INGRESS"
    },
    {
      no: 2,
      name: "EGRESS"
    },
    {
      no: 3,
      name: "SIP"
    },
    {
      no: 4,
      name: "AGENT"
    },
    {
      no: 7,
      name: "CONNECTOR"
    },
    {
      no: 8,
      name: "BRIDGE"
    }
  ]), zd = y.makeEnum("livekit.ParticipantInfo.KindDetail", [
    {
      no: 0,
      name: "CLOUD_AGENT"
    },
    {
      no: 1,
      name: "FORWARDED"
    },
    {
      no: 2,
      name: "CONNECTOR_WHATSAPP"
    },
    {
      no: 3,
      name: "CONNECTOR_TWILIO"
    },
    {
      no: 4,
      name: "BRIDGE_RTSP"
    }
  ]), ge = y.makeEnum("livekit.Encryption.Type", [
    {
      no: 0,
      name: "NONE"
    },
    {
      no: 1,
      name: "GCM"
    },
    {
      no: 2,
      name: "CUSTOM"
    }
  ]), $d = y.makeMessageType("livekit.SimulcastCodecInfo", () => [
    {
      no: 1,
      name: "mime_type",
      kind: "scalar",
      T: 9
    },
    {
      no: 2,
      name: "mid",
      kind: "scalar",
      T: 9
    },
    {
      no: 3,
      name: "cid",
      kind: "scalar",
      T: 9
    },
    {
      no: 4,
      name: "layers",
      kind: "message",
      T: jt,
      repeated: true
    },
    {
      no: 5,
      name: "video_layer_mode",
      kind: "enum",
      T: y.getEnumType(Xa)
    },
    {
      no: 6,
      name: "sdp_cid",
      kind: "scalar",
      T: 9
    }
  ]), hi = y.makeMessageType("livekit.TrackInfo", () => [
    {
      no: 1,
      name: "sid",
      kind: "scalar",
      T: 9
    },
    {
      no: 2,
      name: "type",
      kind: "enum",
      T: y.getEnumType(it)
    },
    {
      no: 3,
      name: "name",
      kind: "scalar",
      T: 9
    },
    {
      no: 4,
      name: "muted",
      kind: "scalar",
      T: 8
    },
    {
      no: 5,
      name: "width",
      kind: "scalar",
      T: 13
    },
    {
      no: 6,
      name: "height",
      kind: "scalar",
      T: 13
    },
    {
      no: 7,
      name: "simulcast",
      kind: "scalar",
      T: 8
    },
    {
      no: 8,
      name: "disable_dtx",
      kind: "scalar",
      T: 8
    },
    {
      no: 9,
      name: "source",
      kind: "enum",
      T: y.getEnumType(be)
    },
    {
      no: 10,
      name: "layers",
      kind: "message",
      T: jt,
      repeated: true
    },
    {
      no: 11,
      name: "mime_type",
      kind: "scalar",
      T: 9
    },
    {
      no: 12,
      name: "mid",
      kind: "scalar",
      T: 9
    },
    {
      no: 13,
      name: "codecs",
      kind: "message",
      T: $d,
      repeated: true
    },
    {
      no: 14,
      name: "stereo",
      kind: "scalar",
      T: 8
    },
    {
      no: 15,
      name: "disable_red",
      kind: "scalar",
      T: 8
    },
    {
      no: 16,
      name: "encryption",
      kind: "enum",
      T: y.getEnumType(ge)
    },
    {
      no: 17,
      name: "stream",
      kind: "scalar",
      T: 9
    },
    {
      no: 18,
      name: "version",
      kind: "message",
      T: uo
    },
    {
      no: 19,
      name: "audio_features",
      kind: "enum",
      T: y.getEnumType(we),
      repeated: true
    },
    {
      no: 20,
      name: "backup_codec_policy",
      kind: "enum",
      T: y.getEnumType(Ya)
    }
  ]), Fs = y.makeMessageType("livekit.DataTrackInfo", () => [
    {
      no: 1,
      name: "pub_handle",
      kind: "scalar",
      T: 13
    },
    {
      no: 2,
      name: "sid",
      kind: "scalar",
      T: 9
    },
    {
      no: 3,
      name: "name",
      kind: "scalar",
      T: 9
    },
    {
      no: 4,
      name: "encryption",
      kind: "enum",
      T: y.getEnumType(ge)
    }
  ]), Qd = y.makeMessageType("livekit.DataTrackSubscriptionOptions", () => [
    {
      no: 1,
      name: "target_fps",
      kind: "scalar",
      T: 13,
      opt: true
    }
  ]), jt = y.makeMessageType("livekit.VideoLayer", () => [
    {
      no: 1,
      name: "quality",
      kind: "enum",
      T: y.getEnumType(js)
    },
    {
      no: 2,
      name: "width",
      kind: "scalar",
      T: 13
    },
    {
      no: 3,
      name: "height",
      kind: "scalar",
      T: 13
    },
    {
      no: 4,
      name: "bitrate",
      kind: "scalar",
      T: 13
    },
    {
      no: 5,
      name: "ssrc",
      kind: "scalar",
      T: 13
    },
    {
      no: 6,
      name: "spatial_layer",
      kind: "scalar",
      T: 5
    },
    {
      no: 7,
      name: "rid",
      kind: "scalar",
      T: 9
    },
    {
      no: 8,
      name: "repair_ssrc",
      kind: "scalar",
      T: 13
    }
  ]), Xa = y.makeEnum("livekit.VideoLayer.Mode", [
    {
      no: 0,
      name: "MODE_UNUSED"
    },
    {
      no: 1,
      name: "ONE_SPATIAL_LAYER_PER_STREAM"
    },
    {
      no: 2,
      name: "MULTIPLE_SPATIAL_LAYERS_PER_STREAM"
    },
    {
      no: 3,
      name: "ONE_SPATIAL_LAYER_PER_STREAM_INCOMPLETE_RTCP_SR"
    }
  ]), Ue = y.makeMessageType("livekit.DataPacket", () => [
    {
      no: 1,
      name: "kind",
      kind: "enum",
      T: y.getEnumType(Q)
    },
    {
      no: 4,
      name: "participant_identity",
      kind: "scalar",
      T: 9
    },
    {
      no: 5,
      name: "destination_identities",
      kind: "scalar",
      T: 9,
      repeated: true
    },
    {
      no: 2,
      name: "user",
      kind: "message",
      T: Bs,
      oneof: "value"
    },
    {
      no: 3,
      name: "speaker",
      kind: "message",
      T: Yd,
      oneof: "value"
    },
    {
      no: 6,
      name: "sip_dtmf",
      kind: "message",
      T: io,
      oneof: "value"
    },
    {
      no: 7,
      name: "transcription",
      kind: "message",
      T: Xd,
      oneof: "value"
    },
    {
      no: 8,
      name: "metrics",
      kind: "message",
      T: qd,
      oneof: "value"
    },
    {
      no: 9,
      name: "chat_message",
      kind: "message",
      T: Cn,
      oneof: "value"
    },
    {
      no: 10,
      name: "rpc_request",
      kind: "message",
      T: Vs,
      oneof: "value"
    },
    {
      no: 11,
      name: "rpc_ack",
      kind: "message",
      T: qs,
      oneof: "value"
    },
    {
      no: 12,
      name: "rpc_response",
      kind: "message",
      T: Gs,
      oneof: "value"
    },
    {
      no: 13,
      name: "stream_header",
      kind: "message",
      T: wn,
      oneof: "value"
    },
    {
      no: 14,
      name: "stream_chunk",
      kind: "message",
      T: En,
      oneof: "value"
    },
    {
      no: 15,
      name: "stream_trailer",
      kind: "message",
      T: Rn,
      oneof: "value"
    },
    {
      no: 18,
      name: "encrypted_packet",
      kind: "message",
      T: Za,
      oneof: "value"
    },
    {
      no: 16,
      name: "sequence",
      kind: "scalar",
      T: 13
    },
    {
      no: 17,
      name: "participant_sid",
      kind: "scalar",
      T: 9
    }
  ]), Q = y.makeEnum("livekit.DataPacket.Kind", [
    {
      no: 0,
      name: "RELIABLE"
    },
    {
      no: 1,
      name: "LOSSY"
    }
  ]), Za = y.makeMessageType("livekit.EncryptedPacket", () => [
    {
      no: 1,
      name: "encryption_type",
      kind: "enum",
      T: y.getEnumType(ge)
    },
    {
      no: 2,
      name: "iv",
      kind: "scalar",
      T: 12
    },
    {
      no: 3,
      name: "key_index",
      kind: "scalar",
      T: 13
    },
    {
      no: 4,
      name: "encrypted_value",
      kind: "scalar",
      T: 12
    }
  ]), eo = y.makeMessageType("livekit.EncryptedPacketPayload", () => [
    {
      no: 1,
      name: "user",
      kind: "message",
      T: Bs,
      oneof: "value"
    },
    {
      no: 3,
      name: "chat_message",
      kind: "message",
      T: Cn,
      oneof: "value"
    },
    {
      no: 4,
      name: "rpc_request",
      kind: "message",
      T: Vs,
      oneof: "value"
    },
    {
      no: 5,
      name: "rpc_ack",
      kind: "message",
      T: qs,
      oneof: "value"
    },
    {
      no: 6,
      name: "rpc_response",
      kind: "message",
      T: Gs,
      oneof: "value"
    },
    {
      no: 7,
      name: "stream_header",
      kind: "message",
      T: wn,
      oneof: "value"
    },
    {
      no: 8,
      name: "stream_chunk",
      kind: "message",
      T: En,
      oneof: "value"
    },
    {
      no: 9,
      name: "stream_trailer",
      kind: "message",
      T: Rn,
      oneof: "value"
    }
  ]), Yd = y.makeMessageType("livekit.ActiveSpeakerUpdate", () => [
    {
      no: 1,
      name: "speakers",
      kind: "message",
      T: to,
      repeated: true
    }
  ]), to = y.makeMessageType("livekit.SpeakerInfo", () => [
    {
      no: 1,
      name: "sid",
      kind: "scalar",
      T: 9
    },
    {
      no: 2,
      name: "level",
      kind: "scalar",
      T: 2
    },
    {
      no: 3,
      name: "active",
      kind: "scalar",
      T: 8
    }
  ]), Bs = y.makeMessageType("livekit.UserPacket", () => [
    {
      no: 1,
      name: "participant_sid",
      kind: "scalar",
      T: 9
    },
    {
      no: 5,
      name: "participant_identity",
      kind: "scalar",
      T: 9
    },
    {
      no: 2,
      name: "payload",
      kind: "scalar",
      T: 12
    },
    {
      no: 3,
      name: "destination_sids",
      kind: "scalar",
      T: 9,
      repeated: true
    },
    {
      no: 6,
      name: "destination_identities",
      kind: "scalar",
      T: 9,
      repeated: true
    },
    {
      no: 4,
      name: "topic",
      kind: "scalar",
      T: 9,
      opt: true
    },
    {
      no: 8,
      name: "id",
      kind: "scalar",
      T: 9,
      opt: true
    },
    {
      no: 9,
      name: "start_time",
      kind: "scalar",
      T: 4,
      opt: true
    },
    {
      no: 10,
      name: "end_time",
      kind: "scalar",
      T: 4,
      opt: true
    },
    {
      no: 11,
      name: "nonce",
      kind: "scalar",
      T: 12
    }
  ]), io = y.makeMessageType("livekit.SipDTMF", () => [
    {
      no: 3,
      name: "code",
      kind: "scalar",
      T: 13
    },
    {
      no: 4,
      name: "digit",
      kind: "scalar",
      T: 9
    }
  ]), Xd = y.makeMessageType("livekit.Transcription", () => [
    {
      no: 2,
      name: "transcribed_participant_identity",
      kind: "scalar",
      T: 9
    },
    {
      no: 3,
      name: "track_id",
      kind: "scalar",
      T: 9
    },
    {
      no: 4,
      name: "segments",
      kind: "message",
      T: Zd,
      repeated: true
    }
  ]), Zd = y.makeMessageType("livekit.TranscriptionSegment", () => [
    {
      no: 1,
      name: "id",
      kind: "scalar",
      T: 9
    },
    {
      no: 2,
      name: "text",
      kind: "scalar",
      T: 9
    },
    {
      no: 3,
      name: "start_time",
      kind: "scalar",
      T: 4
    },
    {
      no: 4,
      name: "end_time",
      kind: "scalar",
      T: 4
    },
    {
      no: 5,
      name: "final",
      kind: "scalar",
      T: 8
    },
    {
      no: 6,
      name: "language",
      kind: "scalar",
      T: 9
    }
  ]), Cn = y.makeMessageType("livekit.ChatMessage", () => [
    {
      no: 1,
      name: "id",
      kind: "scalar",
      T: 9
    },
    {
      no: 2,
      name: "timestamp",
      kind: "scalar",
      T: 3
    },
    {
      no: 3,
      name: "edit_timestamp",
      kind: "scalar",
      T: 3,
      opt: true
    },
    {
      no: 4,
      name: "message",
      kind: "scalar",
      T: 9
    },
    {
      no: 5,
      name: "deleted",
      kind: "scalar",
      T: 8
    },
    {
      no: 6,
      name: "generated",
      kind: "scalar",
      T: 8
    }
  ]), Vs = y.makeMessageType("livekit.RpcRequest", () => [
    {
      no: 1,
      name: "id",
      kind: "scalar",
      T: 9
    },
    {
      no: 2,
      name: "method",
      kind: "scalar",
      T: 9
    },
    {
      no: 3,
      name: "payload",
      kind: "scalar",
      T: 9
    },
    {
      no: 4,
      name: "response_timeout_ms",
      kind: "scalar",
      T: 13
    },
    {
      no: 5,
      name: "version",
      kind: "scalar",
      T: 13
    }
  ]), qs = y.makeMessageType("livekit.RpcAck", () => [
    {
      no: 1,
      name: "request_id",
      kind: "scalar",
      T: 9
    }
  ]), Gs = y.makeMessageType("livekit.RpcResponse", () => [
    {
      no: 1,
      name: "request_id",
      kind: "scalar",
      T: 9
    },
    {
      no: 2,
      name: "payload",
      kind: "scalar",
      T: 9,
      oneof: "value"
    },
    {
      no: 3,
      name: "error",
      kind: "message",
      T: no,
      oneof: "value"
    }
  ]), no = y.makeMessageType("livekit.RpcError", () => [
    {
      no: 1,
      name: "code",
      kind: "scalar",
      T: 13
    },
    {
      no: 2,
      name: "message",
      kind: "scalar",
      T: 9
    },
    {
      no: 3,
      name: "data",
      kind: "scalar",
      T: 9
    }
  ]), so = y.makeMessageType("livekit.ParticipantTracks", () => [
    {
      no: 1,
      name: "participant_sid",
      kind: "scalar",
      T: 9
    },
    {
      no: 2,
      name: "track_sids",
      kind: "scalar",
      T: 9,
      repeated: true
    }
  ]), ro = y.makeMessageType("livekit.ServerInfo", () => [
    {
      no: 1,
      name: "edition",
      kind: "enum",
      T: y.getEnumType(ao)
    },
    {
      no: 2,
      name: "version",
      kind: "scalar",
      T: 9
    },
    {
      no: 3,
      name: "protocol",
      kind: "scalar",
      T: 5
    },
    {
      no: 4,
      name: "region",
      kind: "scalar",
      T: 9
    },
    {
      no: 5,
      name: "node_id",
      kind: "scalar",
      T: 9
    },
    {
      no: 6,
      name: "debug_info",
      kind: "scalar",
      T: 9
    },
    {
      no: 7,
      name: "agent_protocol",
      kind: "scalar",
      T: 5
    }
  ]), ao = y.makeEnum("livekit.ServerInfo.Edition", [
    {
      no: 0,
      name: "Standard"
    },
    {
      no: 1,
      name: "Cloud"
    }
  ]), oo = y.makeMessageType("livekit.ClientInfo", () => [
    {
      no: 1,
      name: "sdk",
      kind: "enum",
      T: y.getEnumType(co)
    },
    {
      no: 2,
      name: "version",
      kind: "scalar",
      T: 9
    },
    {
      no: 3,
      name: "protocol",
      kind: "scalar",
      T: 5
    },
    {
      no: 4,
      name: "os",
      kind: "scalar",
      T: 9
    },
    {
      no: 5,
      name: "os_version",
      kind: "scalar",
      T: 9
    },
    {
      no: 6,
      name: "device_model",
      kind: "scalar",
      T: 9
    },
    {
      no: 7,
      name: "browser",
      kind: "scalar",
      T: 9
    },
    {
      no: 8,
      name: "browser_version",
      kind: "scalar",
      T: 9
    },
    {
      no: 9,
      name: "address",
      kind: "scalar",
      T: 9
    },
    {
      no: 10,
      name: "network",
      kind: "scalar",
      T: 9
    },
    {
      no: 11,
      name: "other_sdks",
      kind: "scalar",
      T: 9
    }
  ]), co = y.makeEnum("livekit.ClientInfo.SDK", [
    {
      no: 0,
      name: "UNKNOWN"
    },
    {
      no: 1,
      name: "JS"
    },
    {
      no: 2,
      name: "SWIFT"
    },
    {
      no: 3,
      name: "ANDROID"
    },
    {
      no: 4,
      name: "FLUTTER"
    },
    {
      no: 5,
      name: "GO"
    },
    {
      no: 6,
      name: "UNITY"
    },
    {
      no: 7,
      name: "REACT_NATIVE"
    },
    {
      no: 8,
      name: "RUST"
    },
    {
      no: 9,
      name: "PYTHON"
    },
    {
      no: 10,
      name: "CPP"
    },
    {
      no: 11,
      name: "UNITY_WEB"
    },
    {
      no: 12,
      name: "NODE"
    },
    {
      no: 13,
      name: "UNREAL"
    },
    {
      no: 14,
      name: "ESP32"
    }
  ]), lo = y.makeMessageType("livekit.ClientConfiguration", () => [
    {
      no: 1,
      name: "video",
      kind: "message",
      T: Or
    },
    {
      no: 2,
      name: "screen",
      kind: "message",
      T: Or
    },
    {
      no: 3,
      name: "resume_connection",
      kind: "enum",
      T: y.getEnumType(Ji)
    },
    {
      no: 4,
      name: "disabled_codecs",
      kind: "message",
      T: el
    },
    {
      no: 5,
      name: "force_relay",
      kind: "enum",
      T: y.getEnumType(Ji)
    }
  ]), Or = y.makeMessageType("livekit.VideoConfiguration", () => [
    {
      no: 1,
      name: "hardware_encoder",
      kind: "enum",
      T: y.getEnumType(Ji)
    }
  ]), el = y.makeMessageType("livekit.DisabledCodecs", () => [
    {
      no: 1,
      name: "codecs",
      kind: "message",
      T: Tn,
      repeated: true
    },
    {
      no: 2,
      name: "publish",
      kind: "message",
      T: Tn,
      repeated: true
    }
  ]), uo = y.makeMessageType("livekit.TimedVersion", () => [
    {
      no: 1,
      name: "unix_micro",
      kind: "scalar",
      T: 3
    },
    {
      no: 2,
      name: "ticks",
      kind: "scalar",
      T: 5
    }
  ]), us = y.makeEnum("livekit.DataStream.OperationType", [
    {
      no: 0,
      name: "CREATE"
    },
    {
      no: 1,
      name: "UPDATE"
    },
    {
      no: 2,
      name: "DELETE"
    },
    {
      no: 3,
      name: "REACTION"
    }
  ]), ho = y.makeMessageType("livekit.DataStream.TextHeader", () => [
    {
      no: 1,
      name: "operation_type",
      kind: "enum",
      T: y.getEnumType(us)
    },
    {
      no: 2,
      name: "version",
      kind: "scalar",
      T: 5
    },
    {
      no: 3,
      name: "reply_to_stream_id",
      kind: "scalar",
      T: 9
    },
    {
      no: 4,
      name: "attached_stream_ids",
      kind: "scalar",
      T: 9,
      repeated: true
    },
    {
      no: 5,
      name: "generated",
      kind: "scalar",
      T: 8
    }
  ], {
    localName: "DataStream_TextHeader"
  }), po = y.makeMessageType("livekit.DataStream.ByteHeader", () => [
    {
      no: 1,
      name: "name",
      kind: "scalar",
      T: 9
    }
  ], {
    localName: "DataStream_ByteHeader"
  }), wn = y.makeMessageType("livekit.DataStream.Header", () => [
    {
      no: 1,
      name: "stream_id",
      kind: "scalar",
      T: 9
    },
    {
      no: 2,
      name: "timestamp",
      kind: "scalar",
      T: 3
    },
    {
      no: 3,
      name: "topic",
      kind: "scalar",
      T: 9
    },
    {
      no: 4,
      name: "mime_type",
      kind: "scalar",
      T: 9
    },
    {
      no: 5,
      name: "total_length",
      kind: "scalar",
      T: 4,
      opt: true
    },
    {
      no: 7,
      name: "encryption_type",
      kind: "enum",
      T: y.getEnumType(ge)
    },
    {
      no: 8,
      name: "attributes",
      kind: "map",
      K: 9,
      V: {
        kind: "scalar",
        T: 9
      }
    },
    {
      no: 9,
      name: "text_header",
      kind: "message",
      T: ho,
      oneof: "content_header"
    },
    {
      no: 10,
      name: "byte_header",
      kind: "message",
      T: po,
      oneof: "content_header"
    }
  ], {
    localName: "DataStream_Header"
  }), En = y.makeMessageType("livekit.DataStream.Chunk", () => [
    {
      no: 1,
      name: "stream_id",
      kind: "scalar",
      T: 9
    },
    {
      no: 2,
      name: "chunk_index",
      kind: "scalar",
      T: 4
    },
    {
      no: 3,
      name: "content",
      kind: "scalar",
      T: 12
    },
    {
      no: 4,
      name: "version",
      kind: "scalar",
      T: 5
    },
    {
      no: 5,
      name: "iv",
      kind: "scalar",
      T: 12,
      opt: true
    }
  ], {
    localName: "DataStream_Chunk"
  }), Rn = y.makeMessageType("livekit.DataStream.Trailer", () => [
    {
      no: 1,
      name: "stream_id",
      kind: "scalar",
      T: 9
    },
    {
      no: 2,
      name: "reason",
      kind: "scalar",
      T: 9
    },
    {
      no: 3,
      name: "attributes",
      kind: "map",
      K: 9,
      V: {
        kind: "scalar",
        T: 9
      }
    }
  ], {
    localName: "DataStream_Trailer"
  }), tl = y.makeMessageType("livekit.SubscribedAudioCodec", () => [
    {
      no: 1,
      name: "codec",
      kind: "scalar",
      T: 9
    },
    {
      no: 2,
      name: "enabled",
      kind: "scalar",
      T: 8
    }
  ]), nt = y.makeEnum("livekit.SignalTarget", [
    {
      no: 0,
      name: "PUBLISHER"
    },
    {
      no: 1,
      name: "SUBSCRIBER"
    }
  ]), hs = y.makeEnum("livekit.StreamState", [
    {
      no: 0,
      name: "ACTIVE"
    },
    {
      no: 1,
      name: "PAUSED"
    }
  ]), il = y.makeEnum("livekit.CandidateProtocol", [
    {
      no: 0,
      name: "UDP"
    },
    {
      no: 1,
      name: "TCP"
    },
    {
      no: 2,
      name: "TLS"
    }
  ]), nl = y.makeMessageType("livekit.SignalRequest", () => [
    {
      no: 1,
      name: "offer",
      kind: "message",
      T: qt,
      oneof: "message"
    },
    {
      no: 2,
      name: "answer",
      kind: "message",
      T: qt,
      oneof: "message"
    },
    {
      no: 3,
      name: "trickle",
      kind: "message",
      T: Dn,
      oneof: "message"
    },
    {
      no: 4,
      name: "add_track",
      kind: "message",
      T: $i,
      oneof: "message"
    },
    {
      no: 5,
      name: "mute",
      kind: "message",
      T: An,
      oneof: "message"
    },
    {
      no: 6,
      name: "subscription",
      kind: "message",
      T: Nn,
      oneof: "message"
    },
    {
      no: 7,
      name: "track_setting",
      kind: "message",
      T: vo,
      oneof: "message"
    },
    {
      no: 8,
      name: "leave",
      kind: "message",
      T: Ln,
      oneof: "message"
    },
    {
      no: 10,
      name: "update_layers",
      kind: "message",
      T: bo,
      oneof: "message"
    },
    {
      no: 11,
      name: "subscription_permission",
      kind: "message",
      T: To,
      oneof: "message"
    },
    {
      no: 12,
      name: "sync_state",
      kind: "message",
      T: zs,
      oneof: "message"
    },
    {
      no: 13,
      name: "simulate",
      kind: "message",
      T: ct,
      oneof: "message"
    },
    {
      no: 14,
      name: "ping",
      kind: "scalar",
      T: 3,
      oneof: "message"
    },
    {
      no: 15,
      name: "update_metadata",
      kind: "message",
      T: Hs,
      oneof: "message"
    },
    {
      no: 16,
      name: "ping_req",
      kind: "message",
      T: Eo,
      oneof: "message"
    },
    {
      no: 17,
      name: "update_audio_track",
      kind: "message",
      T: Ks,
      oneof: "message"
    },
    {
      no: 18,
      name: "update_video_track",
      kind: "message",
      T: yo,
      oneof: "message"
    },
    {
      no: 19,
      name: "publish_data_track_request",
      kind: "message",
      T: mo,
      oneof: "message"
    },
    {
      no: 20,
      name: "unpublish_data_track_request",
      kind: "message",
      T: go,
      oneof: "message"
    },
    {
      no: 21,
      name: "update_data_subscription",
      kind: "message",
      T: ul,
      oneof: "message"
    }
  ]), Dr = y.makeMessageType("livekit.SignalResponse", () => [
    {
      no: 1,
      name: "join",
      kind: "message",
      T: ol,
      oneof: "message"
    },
    {
      no: 2,
      name: "answer",
      kind: "message",
      T: qt,
      oneof: "message"
    },
    {
      no: 3,
      name: "offer",
      kind: "message",
      T: qt,
      oneof: "message"
    },
    {
      no: 4,
      name: "trickle",
      kind: "message",
      T: Dn,
      oneof: "message"
    },
    {
      no: 5,
      name: "update",
      kind: "message",
      T: ll,
      oneof: "message"
    },
    {
      no: 6,
      name: "track_published",
      kind: "message",
      T: Ws,
      oneof: "message"
    },
    {
      no: 8,
      name: "leave",
      kind: "message",
      T: Ln,
      oneof: "message"
    },
    {
      no: 9,
      name: "mute",
      kind: "message",
      T: An,
      oneof: "message"
    },
    {
      no: 10,
      name: "speakers_changed",
      kind: "message",
      T: pl,
      oneof: "message"
    },
    {
      no: 11,
      name: "room_update",
      kind: "message",
      T: ml,
      oneof: "message"
    },
    {
      no: 12,
      name: "connection_quality",
      kind: "message",
      T: gl,
      oneof: "message"
    },
    {
      no: 13,
      name: "stream_state_update",
      kind: "message",
      T: yl,
      oneof: "message"
    },
    {
      no: 14,
      name: "subscribed_quality_update",
      kind: "message",
      T: kl,
      oneof: "message"
    },
    {
      no: 15,
      name: "subscription_permission_update",
      kind: "message",
      T: Tl,
      oneof: "message"
    },
    {
      no: 16,
      name: "refresh_token",
      kind: "scalar",
      T: 9,
      oneof: "message"
    },
    {
      no: 17,
      name: "track_unpublished",
      kind: "message",
      T: dl,
      oneof: "message"
    },
    {
      no: 18,
      name: "pong",
      kind: "scalar",
      T: 3,
      oneof: "message"
    },
    {
      no: 19,
      name: "reconnect",
      kind: "message",
      T: cl,
      oneof: "message"
    },
    {
      no: 20,
      name: "pong_resp",
      kind: "message",
      T: wl,
      oneof: "message"
    },
    {
      no: 21,
      name: "subscription_response",
      kind: "message",
      T: Pl,
      oneof: "message"
    },
    {
      no: 22,
      name: "request_response",
      kind: "message",
      T: _l,
      oneof: "message"
    },
    {
      no: 23,
      name: "track_subscribed",
      kind: "message",
      T: Il,
      oneof: "message"
    },
    {
      no: 24,
      name: "room_moved",
      kind: "message",
      T: Cl,
      oneof: "message"
    },
    {
      no: 25,
      name: "media_sections_requirement",
      kind: "message",
      T: Dl,
      oneof: "message"
    },
    {
      no: 26,
      name: "subscribed_audio_codec_update",
      kind: "message",
      T: Sl,
      oneof: "message"
    },
    {
      no: 27,
      name: "publish_data_track_response",
      kind: "message",
      T: fo,
      oneof: "message"
    },
    {
      no: 28,
      name: "unpublish_data_track_response",
      kind: "message",
      T: sl,
      oneof: "message"
    },
    {
      no: 29,
      name: "data_track_subscriber_handles",
      kind: "message",
      T: rl,
      oneof: "message"
    }
  ]), ps = y.makeMessageType("livekit.SimulcastCodec", () => [
    {
      no: 1,
      name: "codec",
      kind: "scalar",
      T: 9
    },
    {
      no: 2,
      name: "cid",
      kind: "scalar",
      T: 9
    },
    {
      no: 4,
      name: "layers",
      kind: "message",
      T: jt,
      repeated: true
    },
    {
      no: 5,
      name: "video_layer_mode",
      kind: "enum",
      T: y.getEnumType(Xa)
    }
  ]), $i = y.makeMessageType("livekit.AddTrackRequest", () => [
    {
      no: 1,
      name: "cid",
      kind: "scalar",
      T: 9
    },
    {
      no: 2,
      name: "name",
      kind: "scalar",
      T: 9
    },
    {
      no: 3,
      name: "type",
      kind: "enum",
      T: y.getEnumType(it)
    },
    {
      no: 4,
      name: "width",
      kind: "scalar",
      T: 13
    },
    {
      no: 5,
      name: "height",
      kind: "scalar",
      T: 13
    },
    {
      no: 6,
      name: "muted",
      kind: "scalar",
      T: 8
    },
    {
      no: 7,
      name: "disable_dtx",
      kind: "scalar",
      T: 8
    },
    {
      no: 8,
      name: "source",
      kind: "enum",
      T: y.getEnumType(be)
    },
    {
      no: 9,
      name: "layers",
      kind: "message",
      T: jt,
      repeated: true
    },
    {
      no: 10,
      name: "simulcast_codecs",
      kind: "message",
      T: ps,
      repeated: true
    },
    {
      no: 11,
      name: "sid",
      kind: "scalar",
      T: 9
    },
    {
      no: 12,
      name: "stereo",
      kind: "scalar",
      T: 8
    },
    {
      no: 13,
      name: "disable_red",
      kind: "scalar",
      T: 8
    },
    {
      no: 14,
      name: "encryption",
      kind: "enum",
      T: y.getEnumType(ge)
    },
    {
      no: 15,
      name: "stream",
      kind: "scalar",
      T: 9
    },
    {
      no: 16,
      name: "backup_codec_policy",
      kind: "enum",
      T: y.getEnumType(Ya)
    },
    {
      no: 17,
      name: "audio_features",
      kind: "enum",
      T: y.getEnumType(we),
      repeated: true
    }
  ]), mo = y.makeMessageType("livekit.PublishDataTrackRequest", () => [
    {
      no: 1,
      name: "pub_handle",
      kind: "scalar",
      T: 13
    },
    {
      no: 2,
      name: "name",
      kind: "scalar",
      T: 9
    },
    {
      no: 3,
      name: "encryption",
      kind: "enum",
      T: y.getEnumType(ge)
    }
  ]), fo = y.makeMessageType("livekit.PublishDataTrackResponse", () => [
    {
      no: 1,
      name: "info",
      kind: "message",
      T: Fs
    }
  ]), go = y.makeMessageType("livekit.UnpublishDataTrackRequest", () => [
    {
      no: 1,
      name: "pub_handle",
      kind: "scalar",
      T: 13
    }
  ]), sl = y.makeMessageType("livekit.UnpublishDataTrackResponse", () => [
    {
      no: 1,
      name: "info",
      kind: "message",
      T: Fs
    }
  ]), rl = y.makeMessageType("livekit.DataTrackSubscriberHandles", () => [
    {
      no: 1,
      name: "sub_handles",
      kind: "map",
      K: 13,
      V: {
        kind: "message",
        T: al
      }
    }
  ]), al = y.makeMessageType("livekit.DataTrackSubscriberHandles.PublishedDataTrack", () => [
    {
      no: 1,
      name: "publisher_identity",
      kind: "scalar",
      T: 9
    },
    {
      no: 2,
      name: "publisher_sid",
      kind: "scalar",
      T: 9
    },
    {
      no: 3,
      name: "track_sid",
      kind: "scalar",
      T: 9
    }
  ], {
    localName: "DataTrackSubscriberHandles_PublishedDataTrack"
  }), Dn = y.makeMessageType("livekit.TrickleRequest", () => [
    {
      no: 1,
      name: "candidateInit",
      kind: "scalar",
      T: 9
    },
    {
      no: 2,
      name: "target",
      kind: "enum",
      T: y.getEnumType(nt)
    },
    {
      no: 3,
      name: "final",
      kind: "scalar",
      T: 8
    }
  ]), An = y.makeMessageType("livekit.MuteTrackRequest", () => [
    {
      no: 1,
      name: "sid",
      kind: "scalar",
      T: 9
    },
    {
      no: 2,
      name: "muted",
      kind: "scalar",
      T: 8
    }
  ]), ol = y.makeMessageType("livekit.JoinResponse", () => [
    {
      no: 1,
      name: "room",
      kind: "message",
      T: On
    },
    {
      no: 2,
      name: "participant",
      kind: "message",
      T: ii
    },
    {
      no: 3,
      name: "other_participants",
      kind: "message",
      T: ii,
      repeated: true
    },
    {
      no: 4,
      name: "server_version",
      kind: "scalar",
      T: 9
    },
    {
      no: 5,
      name: "ice_servers",
      kind: "message",
      T: ko,
      repeated: true
    },
    {
      no: 6,
      name: "subscriber_primary",
      kind: "scalar",
      T: 8
    },
    {
      no: 7,
      name: "alternative_url",
      kind: "scalar",
      T: 9
    },
    {
      no: 8,
      name: "client_configuration",
      kind: "message",
      T: lo
    },
    {
      no: 9,
      name: "server_region",
      kind: "scalar",
      T: 9
    },
    {
      no: 10,
      name: "ping_timeout",
      kind: "scalar",
      T: 5
    },
    {
      no: 11,
      name: "ping_interval",
      kind: "scalar",
      T: 5
    },
    {
      no: 12,
      name: "server_info",
      kind: "message",
      T: ro
    },
    {
      no: 13,
      name: "sif_trailer",
      kind: "scalar",
      T: 12
    },
    {
      no: 14,
      name: "enabled_publish_codecs",
      kind: "message",
      T: Tn,
      repeated: true
    },
    {
      no: 15,
      name: "fast_publish",
      kind: "scalar",
      T: 8
    }
  ]), cl = y.makeMessageType("livekit.ReconnectResponse", () => [
    {
      no: 1,
      name: "ice_servers",
      kind: "message",
      T: ko,
      repeated: true
    },
    {
      no: 2,
      name: "client_configuration",
      kind: "message",
      T: lo
    },
    {
      no: 3,
      name: "server_info",
      kind: "message",
      T: ro
    },
    {
      no: 4,
      name: "last_message_seq",
      kind: "scalar",
      T: 13
    }
  ]), Ws = y.makeMessageType("livekit.TrackPublishedResponse", () => [
    {
      no: 1,
      name: "cid",
      kind: "scalar",
      T: 9
    },
    {
      no: 2,
      name: "track",
      kind: "message",
      T: hi
    }
  ]), dl = y.makeMessageType("livekit.TrackUnpublishedResponse", () => [
    {
      no: 1,
      name: "track_sid",
      kind: "scalar",
      T: 9
    }
  ]), qt = y.makeMessageType("livekit.SessionDescription", () => [
    {
      no: 1,
      name: "type",
      kind: "scalar",
      T: 9
    },
    {
      no: 2,
      name: "sdp",
      kind: "scalar",
      T: 9
    },
    {
      no: 3,
      name: "id",
      kind: "scalar",
      T: 13
    },
    {
      no: 4,
      name: "mid_to_track_id",
      kind: "map",
      K: 9,
      V: {
        kind: "scalar",
        T: 9
      }
    }
  ]), ll = y.makeMessageType("livekit.ParticipantUpdate", () => [
    {
      no: 1,
      name: "participants",
      kind: "message",
      T: ii,
      repeated: true
    }
  ]), Nn = y.makeMessageType("livekit.UpdateSubscription", () => [
    {
      no: 1,
      name: "track_sids",
      kind: "scalar",
      T: 9,
      repeated: true
    },
    {
      no: 2,
      name: "subscribe",
      kind: "scalar",
      T: 8
    },
    {
      no: 3,
      name: "participant_tracks",
      kind: "message",
      T: so,
      repeated: true
    }
  ]), ul = y.makeMessageType("livekit.UpdateDataSubscription", () => [
    {
      no: 1,
      name: "updates",
      kind: "message",
      T: hl,
      repeated: true
    }
  ]), hl = y.makeMessageType("livekit.UpdateDataSubscription.Update", () => [
    {
      no: 1,
      name: "track_sid",
      kind: "scalar",
      T: 9
    },
    {
      no: 2,
      name: "subscribe",
      kind: "scalar",
      T: 8
    },
    {
      no: 3,
      name: "options",
      kind: "message",
      T: Qd
    }
  ], {
    localName: "UpdateDataSubscription_Update"
  }), vo = y.makeMessageType("livekit.UpdateTrackSettings", () => [
    {
      no: 1,
      name: "track_sids",
      kind: "scalar",
      T: 9,
      repeated: true
    },
    {
      no: 3,
      name: "disabled",
      kind: "scalar",
      T: 8
    },
    {
      no: 4,
      name: "quality",
      kind: "enum",
      T: y.getEnumType(js)
    },
    {
      no: 5,
      name: "width",
      kind: "scalar",
      T: 13
    },
    {
      no: 6,
      name: "height",
      kind: "scalar",
      T: 13
    },
    {
      no: 7,
      name: "fps",
      kind: "scalar",
      T: 13
    },
    {
      no: 8,
      name: "priority",
      kind: "scalar",
      T: 13
    }
  ]), Ks = y.makeMessageType("livekit.UpdateLocalAudioTrack", () => [
    {
      no: 1,
      name: "track_sid",
      kind: "scalar",
      T: 9
    },
    {
      no: 2,
      name: "features",
      kind: "enum",
      T: y.getEnumType(we),
      repeated: true
    }
  ]), yo = y.makeMessageType("livekit.UpdateLocalVideoTrack", () => [
    {
      no: 1,
      name: "track_sid",
      kind: "scalar",
      T: 9
    },
    {
      no: 2,
      name: "width",
      kind: "scalar",
      T: 13
    },
    {
      no: 3,
      name: "height",
      kind: "scalar",
      T: 13
    }
  ]), Ln = y.makeMessageType("livekit.LeaveRequest", () => [
    {
      no: 1,
      name: "can_reconnect",
      kind: "scalar",
      T: 8
    },
    {
      no: 2,
      name: "reason",
      kind: "enum",
      T: y.getEnumType(rt)
    },
    {
      no: 3,
      name: "action",
      kind: "enum",
      T: y.getEnumType(yi)
    },
    {
      no: 4,
      name: "regions",
      kind: "message",
      T: El
    }
  ]), yi = y.makeEnum("livekit.LeaveRequest.Action", [
    {
      no: 0,
      name: "DISCONNECT"
    },
    {
      no: 1,
      name: "RESUME"
    },
    {
      no: 2,
      name: "RECONNECT"
    }
  ]), bo = y.makeMessageType("livekit.UpdateVideoLayers", () => [
    {
      no: 1,
      name: "track_sid",
      kind: "scalar",
      T: 9
    },
    {
      no: 2,
      name: "layers",
      kind: "message",
      T: jt,
      repeated: true
    }
  ]), Hs = y.makeMessageType("livekit.UpdateParticipantMetadata", () => [
    {
      no: 1,
      name: "metadata",
      kind: "scalar",
      T: 9
    },
    {
      no: 2,
      name: "name",
      kind: "scalar",
      T: 9
    },
    {
      no: 3,
      name: "attributes",
      kind: "map",
      K: 9,
      V: {
        kind: "scalar",
        T: 9
      }
    },
    {
      no: 4,
      name: "request_id",
      kind: "scalar",
      T: 13
    }
  ]), ko = y.makeMessageType("livekit.ICEServer", () => [
    {
      no: 1,
      name: "urls",
      kind: "scalar",
      T: 9,
      repeated: true
    },
    {
      no: 2,
      name: "username",
      kind: "scalar",
      T: 9
    },
    {
      no: 3,
      name: "credential",
      kind: "scalar",
      T: 9
    }
  ]), pl = y.makeMessageType("livekit.SpeakersChanged", () => [
    {
      no: 1,
      name: "speakers",
      kind: "message",
      T: to,
      repeated: true
    }
  ]), ml = y.makeMessageType("livekit.RoomUpdate", () => [
    {
      no: 1,
      name: "room",
      kind: "message",
      T: On
    }
  ]), fl = y.makeMessageType("livekit.ConnectionQualityInfo", () => [
    {
      no: 1,
      name: "participant_sid",
      kind: "scalar",
      T: 9
    },
    {
      no: 2,
      name: "quality",
      kind: "enum",
      T: y.getEnumType(Bi)
    },
    {
      no: 3,
      name: "score",
      kind: "scalar",
      T: 2
    }
  ]), gl = y.makeMessageType("livekit.ConnectionQualityUpdate", () => [
    {
      no: 1,
      name: "updates",
      kind: "message",
      T: fl,
      repeated: true
    }
  ]), vl = y.makeMessageType("livekit.StreamStateInfo", () => [
    {
      no: 1,
      name: "participant_sid",
      kind: "scalar",
      T: 9
    },
    {
      no: 2,
      name: "track_sid",
      kind: "scalar",
      T: 9
    },
    {
      no: 3,
      name: "state",
      kind: "enum",
      T: y.getEnumType(hs)
    }
  ]), yl = y.makeMessageType("livekit.StreamStateUpdate", () => [
    {
      no: 1,
      name: "stream_states",
      kind: "message",
      T: vl,
      repeated: true
    }
  ]), Js = y.makeMessageType("livekit.SubscribedQuality", () => [
    {
      no: 1,
      name: "quality",
      kind: "enum",
      T: y.getEnumType(js)
    },
    {
      no: 2,
      name: "enabled",
      kind: "scalar",
      T: 8
    }
  ]), bl = y.makeMessageType("livekit.SubscribedCodec", () => [
    {
      no: 1,
      name: "codec",
      kind: "scalar",
      T: 9
    },
    {
      no: 2,
      name: "qualities",
      kind: "message",
      T: Js,
      repeated: true
    }
  ]), kl = y.makeMessageType("livekit.SubscribedQualityUpdate", () => [
    {
      no: 1,
      name: "track_sid",
      kind: "scalar",
      T: 9
    },
    {
      no: 2,
      name: "subscribed_qualities",
      kind: "message",
      T: Js,
      repeated: true
    },
    {
      no: 3,
      name: "subscribed_codecs",
      kind: "message",
      T: bl,
      repeated: true
    }
  ]), Sl = y.makeMessageType("livekit.SubscribedAudioCodecUpdate", () => [
    {
      no: 1,
      name: "track_sid",
      kind: "scalar",
      T: 9
    },
    {
      no: 2,
      name: "subscribed_audio_codecs",
      kind: "message",
      T: tl,
      repeated: true
    }
  ]), So = y.makeMessageType("livekit.TrackPermission", () => [
    {
      no: 1,
      name: "participant_sid",
      kind: "scalar",
      T: 9
    },
    {
      no: 2,
      name: "all_tracks",
      kind: "scalar",
      T: 8
    },
    {
      no: 3,
      name: "track_sids",
      kind: "scalar",
      T: 9,
      repeated: true
    },
    {
      no: 4,
      name: "participant_identity",
      kind: "scalar",
      T: 9
    }
  ]), To = y.makeMessageType("livekit.SubscriptionPermission", () => [
    {
      no: 1,
      name: "all_participants",
      kind: "scalar",
      T: 8
    },
    {
      no: 2,
      name: "track_permissions",
      kind: "message",
      T: So,
      repeated: true
    }
  ]), Tl = y.makeMessageType("livekit.SubscriptionPermissionUpdate", () => [
    {
      no: 1,
      name: "participant_sid",
      kind: "scalar",
      T: 9
    },
    {
      no: 2,
      name: "track_sid",
      kind: "scalar",
      T: 9
    },
    {
      no: 3,
      name: "allowed",
      kind: "scalar",
      T: 8
    }
  ]), Cl = y.makeMessageType("livekit.RoomMovedResponse", () => [
    {
      no: 1,
      name: "room",
      kind: "message",
      T: On
    },
    {
      no: 2,
      name: "token",
      kind: "scalar",
      T: 9
    },
    {
      no: 3,
      name: "participant",
      kind: "message",
      T: ii
    },
    {
      no: 4,
      name: "other_participants",
      kind: "message",
      T: ii,
      repeated: true
    }
  ]), zs = y.makeMessageType("livekit.SyncState", () => [
    {
      no: 1,
      name: "answer",
      kind: "message",
      T: qt
    },
    {
      no: 2,
      name: "subscription",
      kind: "message",
      T: Nn
    },
    {
      no: 3,
      name: "publish_tracks",
      kind: "message",
      T: Ws,
      repeated: true
    },
    {
      no: 4,
      name: "data_channels",
      kind: "message",
      T: wo,
      repeated: true
    },
    {
      no: 5,
      name: "offer",
      kind: "message",
      T: qt
    },
    {
      no: 6,
      name: "track_sids_disabled",
      kind: "scalar",
      T: 9,
      repeated: true
    },
    {
      no: 7,
      name: "datachannel_receive_states",
      kind: "message",
      T: Co,
      repeated: true
    },
    {
      no: 8,
      name: "publish_data_tracks",
      kind: "message",
      T: fo,
      repeated: true
    }
  ]), Co = y.makeMessageType("livekit.DataChannelReceiveState", () => [
    {
      no: 1,
      name: "publisher_sid",
      kind: "scalar",
      T: 9
    },
    {
      no: 2,
      name: "last_seq",
      kind: "scalar",
      T: 13
    }
  ]), wo = y.makeMessageType("livekit.DataChannelInfo", () => [
    {
      no: 1,
      name: "label",
      kind: "scalar",
      T: 9
    },
    {
      no: 2,
      name: "id",
      kind: "scalar",
      T: 13
    },
    {
      no: 3,
      name: "target",
      kind: "enum",
      T: y.getEnumType(nt)
    }
  ]), ct = y.makeMessageType("livekit.SimulateScenario", () => [
    {
      no: 1,
      name: "speaker_update",
      kind: "scalar",
      T: 5,
      oneof: "scenario"
    },
    {
      no: 2,
      name: "node_failure",
      kind: "scalar",
      T: 8,
      oneof: "scenario"
    },
    {
      no: 3,
      name: "migration",
      kind: "scalar",
      T: 8,
      oneof: "scenario"
    },
    {
      no: 4,
      name: "server_leave",
      kind: "scalar",
      T: 8,
      oneof: "scenario"
    },
    {
      no: 5,
      name: "switch_candidate_protocol",
      kind: "enum",
      T: y.getEnumType(il),
      oneof: "scenario"
    },
    {
      no: 6,
      name: "subscriber_bandwidth",
      kind: "scalar",
      T: 3,
      oneof: "scenario"
    },
    {
      no: 7,
      name: "disconnect_signal_on_resume",
      kind: "scalar",
      T: 8,
      oneof: "scenario"
    },
    {
      no: 8,
      name: "disconnect_signal_on_resume_no_messages",
      kind: "scalar",
      T: 8,
      oneof: "scenario"
    },
    {
      no: 9,
      name: "leave_request_full_reconnect",
      kind: "scalar",
      T: 8,
      oneof: "scenario"
    }
  ]), Eo = y.makeMessageType("livekit.Ping", () => [
    {
      no: 1,
      name: "timestamp",
      kind: "scalar",
      T: 3
    },
    {
      no: 2,
      name: "rtt",
      kind: "scalar",
      T: 3
    }
  ]), wl = y.makeMessageType("livekit.Pong", () => [
    {
      no: 1,
      name: "last_ping_timestamp",
      kind: "scalar",
      T: 3
    },
    {
      no: 2,
      name: "timestamp",
      kind: "scalar",
      T: 3
    }
  ]), El = y.makeMessageType("livekit.RegionSettings", () => [
    {
      no: 1,
      name: "regions",
      kind: "message",
      T: Rl,
      repeated: true
    }
  ]), Rl = y.makeMessageType("livekit.RegionInfo", () => [
    {
      no: 1,
      name: "region",
      kind: "scalar",
      T: 9
    },
    {
      no: 2,
      name: "url",
      kind: "scalar",
      T: 9
    },
    {
      no: 3,
      name: "distance",
      kind: "scalar",
      T: 3
    }
  ]), Pl = y.makeMessageType("livekit.SubscriptionResponse", () => [
    {
      no: 1,
      name: "track_sid",
      kind: "scalar",
      T: 9
    },
    {
      no: 2,
      name: "err",
      kind: "enum",
      T: y.getEnumType(Hd)
    }
  ]), _l = y.makeMessageType("livekit.RequestResponse", () => [
    {
      no: 1,
      name: "request_id",
      kind: "scalar",
      T: 13
    },
    {
      no: 2,
      name: "reason",
      kind: "enum",
      T: y.getEnumType($s)
    },
    {
      no: 3,
      name: "message",
      kind: "scalar",
      T: 9
    },
    {
      no: 4,
      name: "trickle",
      kind: "message",
      T: Dn,
      oneof: "request"
    },
    {
      no: 5,
      name: "add_track",
      kind: "message",
      T: $i,
      oneof: "request"
    },
    {
      no: 6,
      name: "mute",
      kind: "message",
      T: An,
      oneof: "request"
    },
    {
      no: 7,
      name: "update_metadata",
      kind: "message",
      T: Hs,
      oneof: "request"
    },
    {
      no: 8,
      name: "update_audio_track",
      kind: "message",
      T: Ks,
      oneof: "request"
    },
    {
      no: 9,
      name: "update_video_track",
      kind: "message",
      T: yo,
      oneof: "request"
    },
    {
      no: 10,
      name: "publish_data_track",
      kind: "message",
      T: mo,
      oneof: "request"
    },
    {
      no: 11,
      name: "unpublish_data_track",
      kind: "message",
      T: go,
      oneof: "request"
    }
  ]), $s = y.makeEnum("livekit.RequestResponse.Reason", [
    {
      no: 0,
      name: "OK"
    },
    {
      no: 1,
      name: "NOT_FOUND"
    },
    {
      no: 2,
      name: "NOT_ALLOWED"
    },
    {
      no: 3,
      name: "LIMIT_EXCEEDED"
    },
    {
      no: 4,
      name: "QUEUED"
    },
    {
      no: 5,
      name: "UNSUPPORTED_TYPE"
    },
    {
      no: 6,
      name: "UNCLASSIFIED_ERROR"
    },
    {
      no: 7,
      name: "INVALID_HANDLE"
    },
    {
      no: 8,
      name: "INVALID_NAME"
    },
    {
      no: 9,
      name: "DUPLICATE_HANDLE"
    },
    {
      no: 10,
      name: "DUPLICATE_NAME"
    }
  ]), Il = y.makeMessageType("livekit.TrackSubscribed", () => [
    {
      no: 1,
      name: "track_sid",
      kind: "scalar",
      T: 9
    }
  ]), Ro = y.makeMessageType("livekit.ConnectionSettings", () => [
    {
      no: 1,
      name: "auto_subscribe",
      kind: "scalar",
      T: 8
    },
    {
      no: 2,
      name: "adaptive_stream",
      kind: "scalar",
      T: 8
    },
    {
      no: 3,
      name: "subscriber_allow_pause",
      kind: "scalar",
      T: 8,
      opt: true
    },
    {
      no: 4,
      name: "disable_ice_lite",
      kind: "scalar",
      T: 8
    },
    {
      no: 5,
      name: "auto_subscribe_data_track",
      kind: "scalar",
      T: 8,
      opt: true
    }
  ]), xl = y.makeMessageType("livekit.JoinRequest", () => [
    {
      no: 1,
      name: "client_info",
      kind: "message",
      T: oo
    },
    {
      no: 2,
      name: "connection_settings",
      kind: "message",
      T: Ro
    },
    {
      no: 3,
      name: "metadata",
      kind: "scalar",
      T: 9
    },
    {
      no: 4,
      name: "participant_attributes",
      kind: "map",
      K: 9,
      V: {
        kind: "scalar",
        T: 9
      }
    },
    {
      no: 5,
      name: "add_track_requests",
      kind: "message",
      T: $i,
      repeated: true
    },
    {
      no: 6,
      name: "publisher_offer",
      kind: "message",
      T: qt
    },
    {
      no: 7,
      name: "reconnect",
      kind: "scalar",
      T: 8
    },
    {
      no: 8,
      name: "reconnect_reason",
      kind: "enum",
      T: y.getEnumType(Zt)
    },
    {
      no: 9,
      name: "participant_sid",
      kind: "scalar",
      T: 9
    },
    {
      no: 10,
      name: "sync_state",
      kind: "message",
      T: zs
    }
  ]), Ml = y.makeMessageType("livekit.WrappedJoinRequest", () => [
    {
      no: 1,
      name: "compression",
      kind: "enum",
      T: y.getEnumType(Ol)
    },
    {
      no: 2,
      name: "join_request",
      kind: "scalar",
      T: 12
    }
  ]), Ol = y.makeEnum("livekit.WrappedJoinRequest.Compression", [
    {
      no: 0,
      name: "NONE"
    },
    {
      no: 1,
      name: "GZIP"
    }
  ]), Dl = y.makeMessageType("livekit.MediaSectionsRequirement", () => [
    {
      no: 1,
      name: "num_audios",
      kind: "scalar",
      T: 13
    },
    {
      no: 2,
      name: "num_videos",
      kind: "scalar",
      T: 13
    }
  ]);
  function Al(n) {
    return n && n.__esModule && Object.prototype.hasOwnProperty.call(n, "default") ? n.default : n;
  }
  var un = {
    exports: {}
  }, Nl = un.exports, Ar;
  function Ll() {
    return Ar || (Ar = 1, function(n) {
      (function(e, t) {
        n.exports ? n.exports = t() : e.log = t();
      })(Nl, function() {
        var e = function() {
        }, t = "undefined", i = typeof window !== t && typeof window.navigator !== t && /Trident\/|MSIE /.test(window.navigator.userAgent), s = [
          "trace",
          "debug",
          "info",
          "warn",
          "error"
        ], r = {}, o = null;
        function a(g, T) {
          var S = g[T];
          if (typeof S.bind == "function") return S.bind(g);
          try {
            return Function.prototype.bind.call(S, g);
          } catch {
            return function() {
              return Function.prototype.apply.apply(S, [
                g,
                arguments
              ]);
            };
          }
        }
        function c() {
          console.log && (console.log.apply ? console.log.apply(console, arguments) : Function.prototype.apply.apply(console.log, [
            console,
            arguments
          ])), console.trace && console.trace();
        }
        function d(g) {
          return g === "debug" && (g = "log"), typeof console === t ? false : g === "trace" && i ? c : console[g] !== void 0 ? a(console, g) : console.log !== void 0 ? a(console, "log") : e;
        }
        function l() {
          for (var g = this.getLevel(), T = 0; T < s.length; T++) {
            var S = s[T];
            this[S] = T < g ? e : this.methodFactory(S, g, this.name);
          }
          if (this.log = this.debug, typeof console === t && g < this.levels.SILENT) return "No console available for logging";
        }
        function u(g) {
          return function() {
            typeof console !== t && (l.call(this), this[g].apply(this, arguments));
          };
        }
        function h(g, T, S) {
          return d(g) || u.apply(this, arguments);
        }
        function m(g, T) {
          var S = this, I, P, b, k = "loglevel";
          typeof g == "string" ? k += ":" + g : typeof g == "symbol" && (k = void 0);
          function w(L) {
            var q = (s[L] || "silent").toUpperCase();
            if (!(typeof window === t || !k)) {
              try {
                window.localStorage[k] = q;
                return;
              } catch {
              }
              try {
                window.document.cookie = encodeURIComponent(k) + "=" + q + ";";
              } catch {
              }
            }
          }
          function A() {
            var L;
            if (!(typeof window === t || !k)) {
              try {
                L = window.localStorage[k];
              } catch {
              }
              if (typeof L === t) try {
                var q = window.document.cookie, ne = encodeURIComponent(k), ye = q.indexOf(ne + "=");
                ye !== -1 && (L = /^([^;]+)/.exec(q.slice(ye + ne.length + 1))[1]);
              } catch {
              }
              return S.levels[L] === void 0 && (L = void 0), L;
            }
          }
          function U() {
            if (!(typeof window === t || !k)) {
              try {
                window.localStorage.removeItem(k);
              } catch {
              }
              try {
                window.document.cookie = encodeURIComponent(k) + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
              } catch {
              }
            }
          }
          function D(L) {
            var q = L;
            if (typeof q == "string" && S.levels[q.toUpperCase()] !== void 0 && (q = S.levels[q.toUpperCase()]), typeof q == "number" && q >= 0 && q <= S.levels.SILENT) return q;
            throw new TypeError("log.setLevel() called with invalid level: " + L);
          }
          S.name = g, S.levels = {
            TRACE: 0,
            DEBUG: 1,
            INFO: 2,
            WARN: 3,
            ERROR: 4,
            SILENT: 5
          }, S.methodFactory = T || h, S.getLevel = function() {
            return b ?? P ?? I;
          }, S.setLevel = function(L, q) {
            return b = D(L), q !== false && w(b), l.call(S);
          }, S.setDefaultLevel = function(L) {
            P = D(L), A() || S.setLevel(L, false);
          }, S.resetLevel = function() {
            b = null, U(), l.call(S);
          }, S.enableAll = function(L) {
            S.setLevel(S.levels.TRACE, L);
          }, S.disableAll = function(L) {
            S.setLevel(S.levels.SILENT, L);
          }, S.rebuild = function() {
            if (o !== S && (I = D(o.getLevel())), l.call(S), o === S) for (var L in r) r[L].rebuild();
          }, I = D(o ? o.getLevel() : "WARN");
          var N = A();
          N != null && (b = D(N)), l.call(S);
        }
        o = new m(), o.getLogger = function(T) {
          if (typeof T != "symbol" && typeof T != "string" || T === "") throw new TypeError("You must supply a name when creating a logger.");
          var S = r[T];
          return S || (S = r[T] = new m(T, o.methodFactory)), S;
        };
        var v = typeof window !== t ? window.log : void 0;
        return o.noConflict = function() {
          return typeof window !== t && window.log === o && (window.log = v), o;
        }, o.getLoggers = function() {
          return r;
        }, o.default = o, o;
      });
    }(un)), un.exports;
  }
  var Un = Ll(), ms;
  (function(n) {
    n[n.trace = 0] = "trace", n[n.debug = 1] = "debug", n[n.info = 2] = "info", n[n.warn = 3] = "warn", n[n.error = 4] = "error", n[n.silent = 5] = "silent";
  })(ms || (ms = {}));
  var at;
  (function(n) {
    n.Default = "livekit", n.Room = "livekit-room", n.TokenSource = "livekit-token-source", n.Participant = "livekit-participant", n.Track = "livekit-track", n.Publication = "livekit-track-publication", n.Engine = "livekit-engine", n.Signal = "livekit-signal", n.PCManager = "livekit-pc-manager", n.PCTransport = "livekit-pc-transport", n.E2EE = "lk-e2ee";
  })(at || (at = {}));
  let H = Un.getLogger("livekit");
  Object.values(at).map((n) => Un.getLogger(n));
  H.setDefaultLevel(ms.info);
  function wt(n) {
    const e = Un.getLogger(n);
    return e.setDefaultLevel(H.getLevel()), e;
  }
  const Ul = Un.getLogger("lk-e2ee"), Ni = 7e3, jl = [
    0,
    300,
    2 * 2 * 300,
    3 * 3 * 300,
    4 * 4 * 300,
    Ni,
    Ni,
    Ni,
    Ni,
    Ni
  ];
  class Fl {
    constructor(e) {
      this._retryDelays = e !== void 0 ? [
        ...e
      ] : jl;
    }
    nextRetryDelayInMs(e) {
      if (e.retryCount >= this._retryDelays.length) return null;
      const t = this._retryDelays[e.retryCount];
      return e.retryCount <= 1 ? t : t + Math.random() * 1e3;
    }
  }
  function Bl(n, e) {
    var t = {};
    for (var i in n) Object.prototype.hasOwnProperty.call(n, i) && e.indexOf(i) < 0 && (t[i] = n[i]);
    if (n != null && typeof Object.getOwnPropertySymbols == "function") for (var s = 0, i = Object.getOwnPropertySymbols(n); s < i.length; s++) e.indexOf(i[s]) < 0 && Object.prototype.propertyIsEnumerable.call(n, i[s]) && (t[i[s]] = n[i[s]]);
    return t;
  }
  function p(n, e, t, i) {
    function s(r) {
      return r instanceof t ? r : new t(function(o) {
        o(r);
      });
    }
    return new (t || (t = Promise))(function(r, o) {
      function a(l) {
        try {
          d(i.next(l));
        } catch (u) {
          o(u);
        }
      }
      function c(l) {
        try {
          d(i.throw(l));
        } catch (u) {
          o(u);
        }
      }
      function d(l) {
        l.done ? r(l.value) : s(l.value).then(a, c);
      }
      d((i = i.apply(n, e || [])).next());
    });
  }
  function Nr(n) {
    var e = typeof Symbol == "function" && Symbol.iterator, t = e && n[e], i = 0;
    if (t) return t.call(n);
    if (n && typeof n.length == "number") return {
      next: function() {
        return n && i >= n.length && (n = void 0), {
          value: n && n[i++],
          done: !n
        };
      }
    };
    throw new TypeError(e ? "Object is not iterable." : "Symbol.iterator is not defined.");
  }
  function St(n) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var e = n[Symbol.asyncIterator], t;
    return e ? e.call(n) : (n = typeof Nr == "function" ? Nr(n) : n[Symbol.iterator](), t = {}, i("next"), i("throw"), i("return"), t[Symbol.asyncIterator] = function() {
      return this;
    }, t);
    function i(r) {
      t[r] = n[r] && function(o) {
        return new Promise(function(a, c) {
          o = n[r](o), s(a, c, o.done, o.value);
        });
      };
    }
    function s(r, o, a, c) {
      Promise.resolve(c).then(function(d) {
        r({
          value: d,
          done: a
        });
      }, o);
    }
  }
  var rn = {
    exports: {}
  }, Lr;
  function Vl() {
    if (Lr) return rn.exports;
    Lr = 1;
    var n = typeof Reflect == "object" ? Reflect : null, e = n && typeof n.apply == "function" ? n.apply : function(k, w, A) {
      return Function.prototype.apply.call(k, w, A);
    }, t;
    n && typeof n.ownKeys == "function" ? t = n.ownKeys : Object.getOwnPropertySymbols ? t = function(k) {
      return Object.getOwnPropertyNames(k).concat(Object.getOwnPropertySymbols(k));
    } : t = function(k) {
      return Object.getOwnPropertyNames(k);
    };
    function i(b) {
      console && console.warn && console.warn(b);
    }
    var s = Number.isNaN || function(k) {
      return k !== k;
    };
    function r() {
      r.init.call(this);
    }
    rn.exports = r, rn.exports.once = S, r.EventEmitter = r, r.prototype._events = void 0, r.prototype._eventsCount = 0, r.prototype._maxListeners = void 0;
    var o = 10;
    function a(b) {
      if (typeof b != "function") throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof b);
    }
    Object.defineProperty(r, "defaultMaxListeners", {
      enumerable: true,
      get: function() {
        return o;
      },
      set: function(b) {
        if (typeof b != "number" || b < 0 || s(b)) throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + b + ".");
        o = b;
      }
    }), r.init = function() {
      (this._events === void 0 || this._events === Object.getPrototypeOf(this)._events) && (this._events = /* @__PURE__ */ Object.create(null), this._eventsCount = 0), this._maxListeners = this._maxListeners || void 0;
    }, r.prototype.setMaxListeners = function(k) {
      if (typeof k != "number" || k < 0 || s(k)) throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + k + ".");
      return this._maxListeners = k, this;
    };
    function c(b) {
      return b._maxListeners === void 0 ? r.defaultMaxListeners : b._maxListeners;
    }
    r.prototype.getMaxListeners = function() {
      return c(this);
    }, r.prototype.emit = function(k) {
      for (var w = [], A = 1; A < arguments.length; A++) w.push(arguments[A]);
      var U = k === "error", D = this._events;
      if (D !== void 0) U = U && D.error === void 0;
      else if (!U) return false;
      if (U) {
        var N;
        if (w.length > 0 && (N = w[0]), N instanceof Error) throw N;
        var L = new Error("Unhandled error." + (N ? " (" + N.message + ")" : ""));
        throw L.context = N, L;
      }
      var q = D[k];
      if (q === void 0) return false;
      if (typeof q == "function") e(q, this, w);
      else for (var ne = q.length, ye = v(q, ne), A = 0; A < ne; ++A) e(ye[A], this, w);
      return true;
    };
    function d(b, k, w, A) {
      var U, D, N;
      if (a(w), D = b._events, D === void 0 ? (D = b._events = /* @__PURE__ */ Object.create(null), b._eventsCount = 0) : (D.newListener !== void 0 && (b.emit("newListener", k, w.listener ? w.listener : w), D = b._events), N = D[k]), N === void 0) N = D[k] = w, ++b._eventsCount;
      else if (typeof N == "function" ? N = D[k] = A ? [
        w,
        N
      ] : [
        N,
        w
      ] : A ? N.unshift(w) : N.push(w), U = c(b), U > 0 && N.length > U && !N.warned) {
        N.warned = true;
        var L = new Error("Possible EventEmitter memory leak detected. " + N.length + " " + String(k) + " listeners added. Use emitter.setMaxListeners() to increase limit");
        L.name = "MaxListenersExceededWarning", L.emitter = b, L.type = k, L.count = N.length, i(L);
      }
      return b;
    }
    r.prototype.addListener = function(k, w) {
      return d(this, k, w, false);
    }, r.prototype.on = r.prototype.addListener, r.prototype.prependListener = function(k, w) {
      return d(this, k, w, true);
    };
    function l() {
      if (!this.fired) return this.target.removeListener(this.type, this.wrapFn), this.fired = true, arguments.length === 0 ? this.listener.call(this.target) : this.listener.apply(this.target, arguments);
    }
    function u(b, k, w) {
      var A = {
        fired: false,
        wrapFn: void 0,
        target: b,
        type: k,
        listener: w
      }, U = l.bind(A);
      return U.listener = w, A.wrapFn = U, U;
    }
    r.prototype.once = function(k, w) {
      return a(w), this.on(k, u(this, k, w)), this;
    }, r.prototype.prependOnceListener = function(k, w) {
      return a(w), this.prependListener(k, u(this, k, w)), this;
    }, r.prototype.removeListener = function(k, w) {
      var A, U, D, N, L;
      if (a(w), U = this._events, U === void 0) return this;
      if (A = U[k], A === void 0) return this;
      if (A === w || A.listener === w) --this._eventsCount === 0 ? this._events = /* @__PURE__ */ Object.create(null) : (delete U[k], U.removeListener && this.emit("removeListener", k, A.listener || w));
      else if (typeof A != "function") {
        for (D = -1, N = A.length - 1; N >= 0; N--) if (A[N] === w || A[N].listener === w) {
          L = A[N].listener, D = N;
          break;
        }
        if (D < 0) return this;
        D === 0 ? A.shift() : g(A, D), A.length === 1 && (U[k] = A[0]), U.removeListener !== void 0 && this.emit("removeListener", k, L || w);
      }
      return this;
    }, r.prototype.off = r.prototype.removeListener, r.prototype.removeAllListeners = function(k) {
      var w, A, U;
      if (A = this._events, A === void 0) return this;
      if (A.removeListener === void 0) return arguments.length === 0 ? (this._events = /* @__PURE__ */ Object.create(null), this._eventsCount = 0) : A[k] !== void 0 && (--this._eventsCount === 0 ? this._events = /* @__PURE__ */ Object.create(null) : delete A[k]), this;
      if (arguments.length === 0) {
        var D = Object.keys(A), N;
        for (U = 0; U < D.length; ++U) N = D[U], N !== "removeListener" && this.removeAllListeners(N);
        return this.removeAllListeners("removeListener"), this._events = /* @__PURE__ */ Object.create(null), this._eventsCount = 0, this;
      }
      if (w = A[k], typeof w == "function") this.removeListener(k, w);
      else if (w !== void 0) for (U = w.length - 1; U >= 0; U--) this.removeListener(k, w[U]);
      return this;
    };
    function h(b, k, w) {
      var A = b._events;
      if (A === void 0) return [];
      var U = A[k];
      return U === void 0 ? [] : typeof U == "function" ? w ? [
        U.listener || U
      ] : [
        U
      ] : w ? T(U) : v(U, U.length);
    }
    r.prototype.listeners = function(k) {
      return h(this, k, true);
    }, r.prototype.rawListeners = function(k) {
      return h(this, k, false);
    }, r.listenerCount = function(b, k) {
      return typeof b.listenerCount == "function" ? b.listenerCount(k) : m.call(b, k);
    }, r.prototype.listenerCount = m;
    function m(b) {
      var k = this._events;
      if (k !== void 0) {
        var w = k[b];
        if (typeof w == "function") return 1;
        if (w !== void 0) return w.length;
      }
      return 0;
    }
    r.prototype.eventNames = function() {
      return this._eventsCount > 0 ? t(this._events) : [];
    };
    function v(b, k) {
      for (var w = new Array(k), A = 0; A < k; ++A) w[A] = b[A];
      return w;
    }
    function g(b, k) {
      for (; k + 1 < b.length; k++) b[k] = b[k + 1];
      b.pop();
    }
    function T(b) {
      for (var k = new Array(b.length), w = 0; w < k.length; ++w) k[w] = b[w].listener || b[w];
      return k;
    }
    function S(b, k) {
      return new Promise(function(w, A) {
        function U(N) {
          b.removeListener(k, D), A(N);
        }
        function D() {
          typeof b.removeListener == "function" && b.removeListener("error", U), w([].slice.call(arguments));
        }
        P(b, k, D, {
          once: true
        }), k !== "error" && I(b, U, {
          once: true
        });
      });
    }
    function I(b, k, w) {
      typeof b.on == "function" && P(b, "error", k, w);
    }
    function P(b, k, w, A) {
      if (typeof b.on == "function") A.once ? b.once(k, w) : b.on(k, w);
      else if (typeof b.addEventListener == "function") b.addEventListener(k, function U(D) {
        A.once && b.removeEventListener(k, U), w(D);
      });
      else throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof b);
    }
    return rn.exports;
  }
  var pt = Vl();
  let Po = true, _o = true;
  function Vi(n, e, t) {
    const i = n.match(e);
    return i && i.length >= t && parseFloat(i[t], 10);
  }
  function ri(n, e, t) {
    if (!n.RTCPeerConnection) return;
    const i = n.RTCPeerConnection.prototype, s = i.addEventListener;
    i.addEventListener = function(o, a) {
      if (o !== e) return s.apply(this, arguments);
      const c = (d) => {
        const l = t(d);
        l && (a.handleEvent ? a.handleEvent(l) : a(l));
      };
      return this._eventMap = this._eventMap || {}, this._eventMap[e] || (this._eventMap[e] = /* @__PURE__ */ new Map()), this._eventMap[e].set(a, c), s.apply(this, [
        o,
        c
      ]);
    };
    const r = i.removeEventListener;
    i.removeEventListener = function(o, a) {
      if (o !== e || !this._eventMap || !this._eventMap[e]) return r.apply(this, arguments);
      if (!this._eventMap[e].has(a)) return r.apply(this, arguments);
      const c = this._eventMap[e].get(a);
      return this._eventMap[e].delete(a), this._eventMap[e].size === 0 && delete this._eventMap[e], Object.keys(this._eventMap).length === 0 && delete this._eventMap, r.apply(this, [
        o,
        c
      ]);
    }, Object.defineProperty(i, "on" + e, {
      get() {
        return this["_on" + e];
      },
      set(o) {
        this["_on" + e] && (this.removeEventListener(e, this["_on" + e]), delete this["_on" + e]), o && this.addEventListener(e, this["_on" + e] = o);
      },
      enumerable: true,
      configurable: true
    });
  }
  function ql(n) {
    return typeof n != "boolean" ? new Error("Argument type: " + typeof n + ". Please use a boolean.") : (Po = n, n ? "adapter.js logging disabled" : "adapter.js logging enabled");
  }
  function Gl(n) {
    return typeof n != "boolean" ? new Error("Argument type: " + typeof n + ". Please use a boolean.") : (_o = !n, "adapter.js deprecation warnings " + (n ? "disabled" : "enabled"));
  }
  function Io() {
    if (typeof window == "object") {
      if (Po) return;
      typeof console < "u" && typeof console.log == "function" && console.log.apply(console, arguments);
    }
  }
  function Qs(n, e) {
    _o && console.warn(n + " is deprecated, please use " + e + " instead.");
  }
  function Wl(n) {
    const e = {
      browser: null,
      version: null
    };
    if (typeof n > "u" || !n.navigator || !n.navigator.userAgent) return e.browser = "Not a browser.", e;
    const { navigator: t } = n;
    if (t.userAgentData && t.userAgentData.brands) {
      const i = t.userAgentData.brands.find((s) => s.brand === "Chromium");
      if (i) return {
        browser: "chrome",
        version: parseInt(i.version, 10)
      };
    }
    if (t.mozGetUserMedia) e.browser = "firefox", e.version = parseInt(Vi(t.userAgent, /Firefox\/(\d+)\./, 1));
    else if (t.webkitGetUserMedia || n.isSecureContext === false && n.webkitRTCPeerConnection) e.browser = "chrome", e.version = parseInt(Vi(t.userAgent, /Chrom(e|ium)\/(\d+)\./, 2));
    else if (n.RTCPeerConnection && t.userAgent.match(/AppleWebKit\/(\d+)\./)) e.browser = "safari", e.version = parseInt(Vi(t.userAgent, /AppleWebKit\/(\d+)\./, 1)), e.supportsUnifiedPlan = n.RTCRtpTransceiver && "currentDirection" in n.RTCRtpTransceiver.prototype, e._safariVersion = Vi(t.userAgent, /Version\/(\d+(\.?\d+))/, 1);
    else return e.browser = "Not a supported browser.", e;
    return e;
  }
  function Ur(n) {
    return Object.prototype.toString.call(n) === "[object Object]";
  }
  function xo(n) {
    return Ur(n) ? Object.keys(n).reduce(function(e, t) {
      const i = Ur(n[t]), s = i ? xo(n[t]) : n[t], r = i && !Object.keys(s).length;
      return s === void 0 || r ? e : Object.assign(e, {
        [t]: s
      });
    }, {}) : n;
  }
  function fs(n, e, t) {
    !e || t.has(e.id) || (t.set(e.id, e), Object.keys(e).forEach((i) => {
      i.endsWith("Id") ? fs(n, n.get(e[i]), t) : i.endsWith("Ids") && e[i].forEach((s) => {
        fs(n, n.get(s), t);
      });
    }));
  }
  function jr(n, e, t) {
    const i = t ? "outbound-rtp" : "inbound-rtp", s = /* @__PURE__ */ new Map();
    if (e === null) return s;
    const r = [];
    return n.forEach((o) => {
      o.type === "track" && o.trackIdentifier === e.id && r.push(o);
    }), r.forEach((o) => {
      n.forEach((a) => {
        a.type === i && a.trackId === o.id && fs(n, a, s);
      });
    }), s;
  }
  const Fr = Io;
  function Mo(n, e) {
    const t = n && n.navigator;
    if (!t.mediaDevices) return;
    const i = function(a) {
      if (typeof a != "object" || a.mandatory || a.optional) return a;
      const c = {};
      return Object.keys(a).forEach((d) => {
        if (d === "require" || d === "advanced" || d === "mediaSource") return;
        const l = typeof a[d] == "object" ? a[d] : {
          ideal: a[d]
        };
        l.exact !== void 0 && typeof l.exact == "number" && (l.min = l.max = l.exact);
        const u = function(h, m) {
          return h ? h + m.charAt(0).toUpperCase() + m.slice(1) : m === "deviceId" ? "sourceId" : m;
        };
        if (l.ideal !== void 0) {
          c.optional = c.optional || [];
          let h = {};
          typeof l.ideal == "number" ? (h[u("min", d)] = l.ideal, c.optional.push(h), h = {}, h[u("max", d)] = l.ideal, c.optional.push(h)) : (h[u("", d)] = l.ideal, c.optional.push(h));
        }
        l.exact !== void 0 && typeof l.exact != "number" ? (c.mandatory = c.mandatory || {}, c.mandatory[u("", d)] = l.exact) : [
          "min",
          "max"
        ].forEach((h) => {
          l[h] !== void 0 && (c.mandatory = c.mandatory || {}, c.mandatory[u(h, d)] = l[h]);
        });
      }), a.advanced && (c.optional = (c.optional || []).concat(a.advanced)), c;
    }, s = function(a, c) {
      if (e.version >= 61) return c(a);
      if (a = JSON.parse(JSON.stringify(a)), a && typeof a.audio == "object") {
        const d = function(l, u, h) {
          u in l && !(h in l) && (l[h] = l[u], delete l[u]);
        };
        a = JSON.parse(JSON.stringify(a)), d(a.audio, "autoGainControl", "googAutoGainControl"), d(a.audio, "noiseSuppression", "googNoiseSuppression"), a.audio = i(a.audio);
      }
      if (a && typeof a.video == "object") {
        let d = a.video.facingMode;
        d = d && (typeof d == "object" ? d : {
          ideal: d
        });
        const l = e.version < 66;
        if (d && (d.exact === "user" || d.exact === "environment" || d.ideal === "user" || d.ideal === "environment") && !(t.mediaDevices.getSupportedConstraints && t.mediaDevices.getSupportedConstraints().facingMode && !l)) {
          delete a.video.facingMode;
          let u;
          if (d.exact === "environment" || d.ideal === "environment" ? u = [
            "back",
            "rear"
          ] : (d.exact === "user" || d.ideal === "user") && (u = [
            "front"
          ]), u) return t.mediaDevices.enumerateDevices().then((h) => {
            h = h.filter((v) => v.kind === "videoinput");
            let m = h.find((v) => u.some((g) => v.label.toLowerCase().includes(g)));
            return !m && h.length && u.includes("back") && (m = h[h.length - 1]), m && (a.video.deviceId = d.exact ? {
              exact: m.deviceId
            } : {
              ideal: m.deviceId
            }), a.video = i(a.video), Fr("chrome: " + JSON.stringify(a)), c(a);
          });
        }
        a.video = i(a.video);
      }
      return Fr("chrome: " + JSON.stringify(a)), c(a);
    }, r = function(a) {
      return e.version >= 64 ? a : {
        name: {
          PermissionDeniedError: "NotAllowedError",
          PermissionDismissedError: "NotAllowedError",
          InvalidStateError: "NotAllowedError",
          DevicesNotFoundError: "NotFoundError",
          ConstraintNotSatisfiedError: "OverconstrainedError",
          TrackStartError: "NotReadableError",
          MediaDeviceFailedDueToShutdown: "NotAllowedError",
          MediaDeviceKillSwitchOn: "NotAllowedError",
          TabCaptureError: "AbortError",
          ScreenCaptureError: "AbortError",
          DeviceCaptureError: "AbortError"
        }[a.name] || a.name,
        message: a.message,
        constraint: a.constraint || a.constraintName,
        toString() {
          return this.name + (this.message && ": ") + this.message;
        }
      };
    }, o = function(a, c, d) {
      s(a, (l) => {
        t.webkitGetUserMedia(l, c, (u) => {
          d && d(r(u));
        });
      });
    };
    if (t.getUserMedia = o.bind(t), t.mediaDevices.getUserMedia) {
      const a = t.mediaDevices.getUserMedia.bind(t.mediaDevices);
      t.mediaDevices.getUserMedia = function(c) {
        return s(c, (d) => a(d).then((l) => {
          if (d.audio && !l.getAudioTracks().length || d.video && !l.getVideoTracks().length) throw l.getTracks().forEach((u) => {
            u.stop();
          }), new DOMException("", "NotFoundError");
          return l;
        }, (l) => Promise.reject(r(l))));
      };
    }
  }
  function Oo(n) {
    n.MediaStream = n.MediaStream || n.webkitMediaStream;
  }
  function Do(n) {
    if (typeof n == "object" && n.RTCPeerConnection && !("ontrack" in n.RTCPeerConnection.prototype)) {
      Object.defineProperty(n.RTCPeerConnection.prototype, "ontrack", {
        get() {
          return this._ontrack;
        },
        set(t) {
          this._ontrack && this.removeEventListener("track", this._ontrack), this.addEventListener("track", this._ontrack = t);
        },
        enumerable: true,
        configurable: true
      });
      const e = n.RTCPeerConnection.prototype.setRemoteDescription;
      n.RTCPeerConnection.prototype.setRemoteDescription = function() {
        return this._ontrackpoly || (this._ontrackpoly = (i) => {
          i.stream.addEventListener("addtrack", (s) => {
            let r;
            n.RTCPeerConnection.prototype.getReceivers ? r = this.getReceivers().find((a) => a.track && a.track.id === s.track.id) : r = {
              track: s.track
            };
            const o = new Event("track");
            o.track = s.track, o.receiver = r, o.transceiver = {
              receiver: r
            }, o.streams = [
              i.stream
            ], this.dispatchEvent(o);
          }), i.stream.getTracks().forEach((s) => {
            let r;
            n.RTCPeerConnection.prototype.getReceivers ? r = this.getReceivers().find((a) => a.track && a.track.id === s.id) : r = {
              track: s
            };
            const o = new Event("track");
            o.track = s, o.receiver = r, o.transceiver = {
              receiver: r
            }, o.streams = [
              i.stream
            ], this.dispatchEvent(o);
          });
        }, this.addEventListener("addstream", this._ontrackpoly)), e.apply(this, arguments);
      };
    } else ri(n, "track", (e) => (e.transceiver || Object.defineProperty(e, "transceiver", {
      value: {
        receiver: e.receiver
      }
    }), e));
  }
  function Ao(n) {
    if (typeof n == "object" && n.RTCPeerConnection && !("getSenders" in n.RTCPeerConnection.prototype) && "createDTMFSender" in n.RTCPeerConnection.prototype) {
      const e = function(s, r) {
        return {
          track: r,
          get dtmf() {
            return this._dtmf === void 0 && (r.kind === "audio" ? this._dtmf = s.createDTMFSender(r) : this._dtmf = null), this._dtmf;
          },
          _pc: s
        };
      };
      if (!n.RTCPeerConnection.prototype.getSenders) {
        n.RTCPeerConnection.prototype.getSenders = function() {
          return this._senders = this._senders || [], this._senders.slice();
        };
        const s = n.RTCPeerConnection.prototype.addTrack;
        n.RTCPeerConnection.prototype.addTrack = function(a, c) {
          let d = s.apply(this, arguments);
          return d || (d = e(this, a), this._senders.push(d)), d;
        };
        const r = n.RTCPeerConnection.prototype.removeTrack;
        n.RTCPeerConnection.prototype.removeTrack = function(a) {
          r.apply(this, arguments);
          const c = this._senders.indexOf(a);
          c !== -1 && this._senders.splice(c, 1);
        };
      }
      const t = n.RTCPeerConnection.prototype.addStream;
      n.RTCPeerConnection.prototype.addStream = function(r) {
        this._senders = this._senders || [], t.apply(this, [
          r
        ]), r.getTracks().forEach((o) => {
          this._senders.push(e(this, o));
        });
      };
      const i = n.RTCPeerConnection.prototype.removeStream;
      n.RTCPeerConnection.prototype.removeStream = function(r) {
        this._senders = this._senders || [], i.apply(this, [
          r
        ]), r.getTracks().forEach((o) => {
          const a = this._senders.find((c) => c.track === o);
          a && this._senders.splice(this._senders.indexOf(a), 1);
        });
      };
    } else if (typeof n == "object" && n.RTCPeerConnection && "getSenders" in n.RTCPeerConnection.prototype && "createDTMFSender" in n.RTCPeerConnection.prototype && n.RTCRtpSender && !("dtmf" in n.RTCRtpSender.prototype)) {
      const e = n.RTCPeerConnection.prototype.getSenders;
      n.RTCPeerConnection.prototype.getSenders = function() {
        const i = e.apply(this, []);
        return i.forEach((s) => s._pc = this), i;
      }, Object.defineProperty(n.RTCRtpSender.prototype, "dtmf", {
        get() {
          return this._dtmf === void 0 && (this.track.kind === "audio" ? this._dtmf = this._pc.createDTMFSender(this.track) : this._dtmf = null), this._dtmf;
        }
      });
    }
  }
  function No(n) {
    if (!(typeof n == "object" && n.RTCPeerConnection && n.RTCRtpSender && n.RTCRtpReceiver)) return;
    if (!("getStats" in n.RTCRtpSender.prototype)) {
      const t = n.RTCPeerConnection.prototype.getSenders;
      t && (n.RTCPeerConnection.prototype.getSenders = function() {
        const r = t.apply(this, []);
        return r.forEach((o) => o._pc = this), r;
      });
      const i = n.RTCPeerConnection.prototype.addTrack;
      i && (n.RTCPeerConnection.prototype.addTrack = function() {
        const r = i.apply(this, arguments);
        return r._pc = this, r;
      }), n.RTCRtpSender.prototype.getStats = function() {
        const r = this;
        return this._pc.getStats().then((o) => jr(o, r.track, true));
      };
    }
    if (!("getStats" in n.RTCRtpReceiver.prototype)) {
      const t = n.RTCPeerConnection.prototype.getReceivers;
      t && (n.RTCPeerConnection.prototype.getReceivers = function() {
        const s = t.apply(this, []);
        return s.forEach((r) => r._pc = this), s;
      }), ri(n, "track", (i) => (i.receiver._pc = i.srcElement, i)), n.RTCRtpReceiver.prototype.getStats = function() {
        const s = this;
        return this._pc.getStats().then((r) => jr(r, s.track, false));
      };
    }
    if (!("getStats" in n.RTCRtpSender.prototype && "getStats" in n.RTCRtpReceiver.prototype)) return;
    const e = n.RTCPeerConnection.prototype.getStats;
    n.RTCPeerConnection.prototype.getStats = function() {
      if (arguments.length > 0 && arguments[0] instanceof n.MediaStreamTrack) {
        const i = arguments[0];
        let s, r, o;
        return this.getSenders().forEach((a) => {
          a.track === i && (s ? o = true : s = a);
        }), this.getReceivers().forEach((a) => (a.track === i && (r ? o = true : r = a), a.track === i)), o || s && r ? Promise.reject(new DOMException("There are more than one sender or receiver for the track.", "InvalidAccessError")) : s ? s.getStats() : r ? r.getStats() : Promise.reject(new DOMException("There is no sender or receiver for the track.", "InvalidAccessError"));
      }
      return e.apply(this, arguments);
    };
  }
  function Lo(n) {
    n.RTCPeerConnection.prototype.getLocalStreams = function() {
      return this._shimmedLocalStreams = this._shimmedLocalStreams || {}, Object.keys(this._shimmedLocalStreams).map((o) => this._shimmedLocalStreams[o][0]);
    };
    const e = n.RTCPeerConnection.prototype.addTrack;
    n.RTCPeerConnection.prototype.addTrack = function(o, a) {
      if (!a) return e.apply(this, arguments);
      this._shimmedLocalStreams = this._shimmedLocalStreams || {};
      const c = e.apply(this, arguments);
      return this._shimmedLocalStreams[a.id] ? this._shimmedLocalStreams[a.id].indexOf(c) === -1 && this._shimmedLocalStreams[a.id].push(c) : this._shimmedLocalStreams[a.id] = [
        a,
        c
      ], c;
    };
    const t = n.RTCPeerConnection.prototype.addStream;
    n.RTCPeerConnection.prototype.addStream = function(o) {
      this._shimmedLocalStreams = this._shimmedLocalStreams || {}, o.getTracks().forEach((d) => {
        if (this.getSenders().find((u) => u.track === d)) throw new DOMException("Track already exists.", "InvalidAccessError");
      });
      const a = this.getSenders();
      t.apply(this, arguments);
      const c = this.getSenders().filter((d) => a.indexOf(d) === -1);
      this._shimmedLocalStreams[o.id] = [
        o
      ].concat(c);
    };
    const i = n.RTCPeerConnection.prototype.removeStream;
    n.RTCPeerConnection.prototype.removeStream = function(o) {
      return this._shimmedLocalStreams = this._shimmedLocalStreams || {}, delete this._shimmedLocalStreams[o.id], i.apply(this, arguments);
    };
    const s = n.RTCPeerConnection.prototype.removeTrack;
    n.RTCPeerConnection.prototype.removeTrack = function(o) {
      return this._shimmedLocalStreams = this._shimmedLocalStreams || {}, o && Object.keys(this._shimmedLocalStreams).forEach((a) => {
        const c = this._shimmedLocalStreams[a].indexOf(o);
        c !== -1 && this._shimmedLocalStreams[a].splice(c, 1), this._shimmedLocalStreams[a].length === 1 && delete this._shimmedLocalStreams[a];
      }), s.apply(this, arguments);
    };
  }
  function Uo(n, e) {
    if (!n.RTCPeerConnection) return;
    if (n.RTCPeerConnection.prototype.addTrack && e.version >= 65) return Lo(n);
    const t = n.RTCPeerConnection.prototype.getLocalStreams;
    n.RTCPeerConnection.prototype.getLocalStreams = function() {
      const l = t.apply(this);
      return this._reverseStreams = this._reverseStreams || {}, l.map((u) => this._reverseStreams[u.id]);
    };
    const i = n.RTCPeerConnection.prototype.addStream;
    n.RTCPeerConnection.prototype.addStream = function(l) {
      if (this._streams = this._streams || {}, this._reverseStreams = this._reverseStreams || {}, l.getTracks().forEach((u) => {
        if (this.getSenders().find((m) => m.track === u)) throw new DOMException("Track already exists.", "InvalidAccessError");
      }), !this._reverseStreams[l.id]) {
        const u = new n.MediaStream(l.getTracks());
        this._streams[l.id] = u, this._reverseStreams[u.id] = l, l = u;
      }
      i.apply(this, [
        l
      ]);
    };
    const s = n.RTCPeerConnection.prototype.removeStream;
    n.RTCPeerConnection.prototype.removeStream = function(l) {
      this._streams = this._streams || {}, this._reverseStreams = this._reverseStreams || {}, s.apply(this, [
        this._streams[l.id] || l
      ]), delete this._reverseStreams[this._streams[l.id] ? this._streams[l.id].id : l.id], delete this._streams[l.id];
    }, n.RTCPeerConnection.prototype.addTrack = function(l, u) {
      if (this.signalingState === "closed") throw new DOMException("The RTCPeerConnection's signalingState is 'closed'.", "InvalidStateError");
      const h = [].slice.call(arguments, 1);
      if (h.length !== 1 || !h[0].getTracks().find((g) => g === l)) throw new DOMException("The adapter.js addTrack polyfill only supports a single  stream which is associated with the specified track.", "NotSupportedError");
      if (this.getSenders().find((g) => g.track === l)) throw new DOMException("Track already exists.", "InvalidAccessError");
      this._streams = this._streams || {}, this._reverseStreams = this._reverseStreams || {};
      const v = this._streams[u.id];
      if (v) v.addTrack(l), Promise.resolve().then(() => {
        this.dispatchEvent(new Event("negotiationneeded"));
      });
      else {
        const g = new n.MediaStream([
          l
        ]);
        this._streams[u.id] = g, this._reverseStreams[g.id] = u, this.addStream(g);
      }
      return this.getSenders().find((g) => g.track === l);
    };
    function r(d, l) {
      let u = l.sdp;
      return Object.keys(d._reverseStreams || []).forEach((h) => {
        const m = d._reverseStreams[h], v = d._streams[m.id];
        u = u.replace(new RegExp(v.id, "g"), m.id);
      }), new RTCSessionDescription({
        type: l.type,
        sdp: u
      });
    }
    function o(d, l) {
      let u = l.sdp;
      return Object.keys(d._reverseStreams || []).forEach((h) => {
        const m = d._reverseStreams[h], v = d._streams[m.id];
        u = u.replace(new RegExp(m.id, "g"), v.id);
      }), new RTCSessionDescription({
        type: l.type,
        sdp: u
      });
    }
    [
      "createOffer",
      "createAnswer"
    ].forEach(function(d) {
      const l = n.RTCPeerConnection.prototype[d], u = {
        [d]() {
          const h = arguments;
          return arguments.length && typeof arguments[0] == "function" ? l.apply(this, [
            (v) => {
              const g = r(this, v);
              h[0].apply(null, [
                g
              ]);
            },
            (v) => {
              h[1] && h[1].apply(null, v);
            },
            arguments[2]
          ]) : l.apply(this, arguments).then((v) => r(this, v));
        }
      };
      n.RTCPeerConnection.prototype[d] = u[d];
    });
    const a = n.RTCPeerConnection.prototype.setLocalDescription;
    n.RTCPeerConnection.prototype.setLocalDescription = function() {
      return !arguments.length || !arguments[0].type ? a.apply(this, arguments) : (arguments[0] = o(this, arguments[0]), a.apply(this, arguments));
    };
    const c = Object.getOwnPropertyDescriptor(n.RTCPeerConnection.prototype, "localDescription");
    Object.defineProperty(n.RTCPeerConnection.prototype, "localDescription", {
      get() {
        const d = c.get.apply(this);
        return d.type === "" ? d : r(this, d);
      }
    }), n.RTCPeerConnection.prototype.removeTrack = function(l) {
      if (this.signalingState === "closed") throw new DOMException("The RTCPeerConnection's signalingState is 'closed'.", "InvalidStateError");
      if (!l._pc) throw new DOMException("Argument 1 of RTCPeerConnection.removeTrack does not implement interface RTCRtpSender.", "TypeError");
      if (!(l._pc === this)) throw new DOMException("Sender was not created by this connection.", "InvalidAccessError");
      this._streams = this._streams || {};
      let h;
      Object.keys(this._streams).forEach((m) => {
        this._streams[m].getTracks().find((g) => l.track === g) && (h = this._streams[m]);
      }), h && (h.getTracks().length === 1 ? this.removeStream(this._reverseStreams[h.id]) : h.removeTrack(l.track), this.dispatchEvent(new Event("negotiationneeded")));
    };
  }
  function gs(n, e) {
    !n.RTCPeerConnection && n.webkitRTCPeerConnection && (n.RTCPeerConnection = n.webkitRTCPeerConnection), n.RTCPeerConnection && e.version < 53 && [
      "setLocalDescription",
      "setRemoteDescription",
      "addIceCandidate"
    ].forEach(function(t) {
      const i = n.RTCPeerConnection.prototype[t], s = {
        [t]() {
          return arguments[0] = new (t === "addIceCandidate" ? n.RTCIceCandidate : n.RTCSessionDescription)(arguments[0]), i.apply(this, arguments);
        }
      };
      n.RTCPeerConnection.prototype[t] = s[t];
    });
  }
  function jo(n, e) {
    ri(n, "negotiationneeded", (t) => {
      const i = t.target;
      if (!((e.version < 72 || i.getConfiguration && i.getConfiguration().sdpSemantics === "plan-b") && i.signalingState !== "stable")) return t;
    });
  }
  var Br = Object.freeze({
    __proto__: null,
    fixNegotiationNeeded: jo,
    shimAddTrackRemoveTrack: Uo,
    shimAddTrackRemoveTrackWithNative: Lo,
    shimGetSendersWithDtmf: Ao,
    shimGetUserMedia: Mo,
    shimMediaStream: Oo,
    shimOnTrack: Do,
    shimPeerConnection: gs,
    shimSenderReceiverGetStats: No
  });
  function Fo(n, e) {
    const t = n && n.navigator, i = n && n.MediaStreamTrack;
    if (t.getUserMedia = function(s, r, o) {
      Qs("navigator.getUserMedia", "navigator.mediaDevices.getUserMedia"), t.mediaDevices.getUserMedia(s).then(r, o);
    }, !(e.version > 55 && "autoGainControl" in t.mediaDevices.getSupportedConstraints())) {
      const s = function(o, a, c) {
        a in o && !(c in o) && (o[c] = o[a], delete o[a]);
      }, r = t.mediaDevices.getUserMedia.bind(t.mediaDevices);
      if (t.mediaDevices.getUserMedia = function(o) {
        return typeof o == "object" && typeof o.audio == "object" && (o = JSON.parse(JSON.stringify(o)), s(o.audio, "autoGainControl", "mozAutoGainControl"), s(o.audio, "noiseSuppression", "mozNoiseSuppression")), r(o);
      }, i && i.prototype.getSettings) {
        const o = i.prototype.getSettings;
        i.prototype.getSettings = function() {
          const a = o.apply(this, arguments);
          return s(a, "mozAutoGainControl", "autoGainControl"), s(a, "mozNoiseSuppression", "noiseSuppression"), a;
        };
      }
      if (i && i.prototype.applyConstraints) {
        const o = i.prototype.applyConstraints;
        i.prototype.applyConstraints = function(a) {
          return this.kind === "audio" && typeof a == "object" && (a = JSON.parse(JSON.stringify(a)), s(a, "autoGainControl", "mozAutoGainControl"), s(a, "noiseSuppression", "mozNoiseSuppression")), o.apply(this, [
            a
          ]);
        };
      }
    }
  }
  function Kl(n, e) {
    n.navigator.mediaDevices && "getDisplayMedia" in n.navigator.mediaDevices || n.navigator.mediaDevices && (n.navigator.mediaDevices.getDisplayMedia = function(i) {
      if (!(i && i.video)) {
        const s = new DOMException("getDisplayMedia without video constraints is undefined");
        return s.name = "NotFoundError", s.code = 8, Promise.reject(s);
      }
      return i.video === true ? i.video = {
        mediaSource: e
      } : i.video.mediaSource = e, n.navigator.mediaDevices.getUserMedia(i);
    });
  }
  function Bo(n) {
    typeof n == "object" && n.RTCTrackEvent && "receiver" in n.RTCTrackEvent.prototype && !("transceiver" in n.RTCTrackEvent.prototype) && Object.defineProperty(n.RTCTrackEvent.prototype, "transceiver", {
      get() {
        return {
          receiver: this.receiver
        };
      }
    });
  }
  function vs(n, e) {
    if (typeof n != "object" || !(n.RTCPeerConnection || n.mozRTCPeerConnection)) return;
    !n.RTCPeerConnection && n.mozRTCPeerConnection && (n.RTCPeerConnection = n.mozRTCPeerConnection), e.version < 53 && [
      "setLocalDescription",
      "setRemoteDescription",
      "addIceCandidate"
    ].forEach(function(s) {
      const r = n.RTCPeerConnection.prototype[s], o = {
        [s]() {
          return arguments[0] = new (s === "addIceCandidate" ? n.RTCIceCandidate : n.RTCSessionDescription)(arguments[0]), r.apply(this, arguments);
        }
      };
      n.RTCPeerConnection.prototype[s] = o[s];
    });
    const t = {
      inboundrtp: "inbound-rtp",
      outboundrtp: "outbound-rtp",
      candidatepair: "candidate-pair",
      localcandidate: "local-candidate",
      remotecandidate: "remote-candidate"
    }, i = n.RTCPeerConnection.prototype.getStats;
    n.RTCPeerConnection.prototype.getStats = function() {
      const [r, o, a] = arguments;
      return i.apply(this, [
        r || null
      ]).then((c) => {
        if (e.version < 53 && !o) try {
          c.forEach((d) => {
            d.type = t[d.type] || d.type;
          });
        } catch (d) {
          if (d.name !== "TypeError") throw d;
          c.forEach((l, u) => {
            c.set(u, Object.assign({}, l, {
              type: t[l.type] || l.type
            }));
          });
        }
        return c;
      }).then(o, a);
    };
  }
  function Vo(n) {
    if (!(typeof n == "object" && n.RTCPeerConnection && n.RTCRtpSender) || n.RTCRtpSender && "getStats" in n.RTCRtpSender.prototype) return;
    const e = n.RTCPeerConnection.prototype.getSenders;
    e && (n.RTCPeerConnection.prototype.getSenders = function() {
      const s = e.apply(this, []);
      return s.forEach((r) => r._pc = this), s;
    });
    const t = n.RTCPeerConnection.prototype.addTrack;
    t && (n.RTCPeerConnection.prototype.addTrack = function() {
      const s = t.apply(this, arguments);
      return s._pc = this, s;
    }), n.RTCRtpSender.prototype.getStats = function() {
      return this.track ? this._pc.getStats(this.track) : Promise.resolve(/* @__PURE__ */ new Map());
    };
  }
  function qo(n) {
    if (!(typeof n == "object" && n.RTCPeerConnection && n.RTCRtpSender) || n.RTCRtpSender && "getStats" in n.RTCRtpReceiver.prototype) return;
    const e = n.RTCPeerConnection.prototype.getReceivers;
    e && (n.RTCPeerConnection.prototype.getReceivers = function() {
      const i = e.apply(this, []);
      return i.forEach((s) => s._pc = this), i;
    }), ri(n, "track", (t) => (t.receiver._pc = t.srcElement, t)), n.RTCRtpReceiver.prototype.getStats = function() {
      return this._pc.getStats(this.track);
    };
  }
  function Go(n) {
    !n.RTCPeerConnection || "removeStream" in n.RTCPeerConnection.prototype || (n.RTCPeerConnection.prototype.removeStream = function(t) {
      Qs("removeStream", "removeTrack"), this.getSenders().forEach((i) => {
        i.track && t.getTracks().includes(i.track) && this.removeTrack(i);
      });
    });
  }
  function Wo(n) {
    n.DataChannel && !n.RTCDataChannel && (n.RTCDataChannel = n.DataChannel);
  }
  function Ko(n) {
    if (!(typeof n == "object" && n.RTCPeerConnection)) return;
    const e = n.RTCPeerConnection.prototype.addTransceiver;
    e && (n.RTCPeerConnection.prototype.addTransceiver = function() {
      this.setParametersPromises = [];
      let i = arguments[1] && arguments[1].sendEncodings;
      i === void 0 && (i = []), i = [
        ...i
      ];
      const s = i.length > 0;
      s && i.forEach((o) => {
        if ("rid" in o && !/^[a-z0-9]{0,16}$/i.test(o.rid)) throw new TypeError("Invalid RID value provided.");
        if ("scaleResolutionDownBy" in o && !(parseFloat(o.scaleResolutionDownBy) >= 1)) throw new RangeError("scale_resolution_down_by must be >= 1.0");
        if ("maxFramerate" in o && !(parseFloat(o.maxFramerate) >= 0)) throw new RangeError("max_framerate must be >= 0.0");
      });
      const r = e.apply(this, arguments);
      if (s) {
        const { sender: o } = r, a = o.getParameters();
        (!("encodings" in a) || a.encodings.length === 1 && Object.keys(a.encodings[0]).length === 0) && (a.encodings = i, o.sendEncodings = i, this.setParametersPromises.push(o.setParameters(a).then(() => {
          delete o.sendEncodings;
        }).catch(() => {
          delete o.sendEncodings;
        })));
      }
      return r;
    });
  }
  function Ho(n) {
    if (!(typeof n == "object" && n.RTCRtpSender)) return;
    const e = n.RTCRtpSender.prototype.getParameters;
    e && (n.RTCRtpSender.prototype.getParameters = function() {
      const i = e.apply(this, arguments);
      return "encodings" in i || (i.encodings = [].concat(this.sendEncodings || [
        {}
      ])), i;
    });
  }
  function Jo(n) {
    if (!(typeof n == "object" && n.RTCPeerConnection)) return;
    const e = n.RTCPeerConnection.prototype.createOffer;
    n.RTCPeerConnection.prototype.createOffer = function() {
      return this.setParametersPromises && this.setParametersPromises.length ? Promise.all(this.setParametersPromises).then(() => e.apply(this, arguments)).finally(() => {
        this.setParametersPromises = [];
      }) : e.apply(this, arguments);
    };
  }
  function zo(n) {
    if (!(typeof n == "object" && n.RTCPeerConnection)) return;
    const e = n.RTCPeerConnection.prototype.createAnswer;
    n.RTCPeerConnection.prototype.createAnswer = function() {
      return this.setParametersPromises && this.setParametersPromises.length ? Promise.all(this.setParametersPromises).then(() => e.apply(this, arguments)).finally(() => {
        this.setParametersPromises = [];
      }) : e.apply(this, arguments);
    };
  }
  var Vr = Object.freeze({
    __proto__: null,
    shimAddTransceiver: Ko,
    shimCreateAnswer: zo,
    shimCreateOffer: Jo,
    shimGetDisplayMedia: Kl,
    shimGetParameters: Ho,
    shimGetUserMedia: Fo,
    shimOnTrack: Bo,
    shimPeerConnection: vs,
    shimRTCDataChannel: Wo,
    shimReceiverGetStats: qo,
    shimRemoveStream: Go,
    shimSenderGetStats: Vo
  });
  function $o(n) {
    if (!(typeof n != "object" || !n.RTCPeerConnection)) {
      if ("getLocalStreams" in n.RTCPeerConnection.prototype || (n.RTCPeerConnection.prototype.getLocalStreams = function() {
        return this._localStreams || (this._localStreams = []), this._localStreams;
      }), !("addStream" in n.RTCPeerConnection.prototype)) {
        const e = n.RTCPeerConnection.prototype.addTrack;
        n.RTCPeerConnection.prototype.addStream = function(i) {
          this._localStreams || (this._localStreams = []), this._localStreams.includes(i) || this._localStreams.push(i), i.getAudioTracks().forEach((s) => e.call(this, s, i)), i.getVideoTracks().forEach((s) => e.call(this, s, i));
        }, n.RTCPeerConnection.prototype.addTrack = function(i) {
          for (var s = arguments.length, r = new Array(s > 1 ? s - 1 : 0), o = 1; o < s; o++) r[o - 1] = arguments[o];
          return r && r.forEach((a) => {
            this._localStreams ? this._localStreams.includes(a) || this._localStreams.push(a) : this._localStreams = [
              a
            ];
          }), e.apply(this, arguments);
        };
      }
      "removeStream" in n.RTCPeerConnection.prototype || (n.RTCPeerConnection.prototype.removeStream = function(t) {
        this._localStreams || (this._localStreams = []);
        const i = this._localStreams.indexOf(t);
        if (i === -1) return;
        this._localStreams.splice(i, 1);
        const s = t.getTracks();
        this.getSenders().forEach((r) => {
          s.includes(r.track) && this.removeTrack(r);
        });
      });
    }
  }
  function Qo(n) {
    if (!(typeof n != "object" || !n.RTCPeerConnection) && ("getRemoteStreams" in n.RTCPeerConnection.prototype || (n.RTCPeerConnection.prototype.getRemoteStreams = function() {
      return this._remoteStreams ? this._remoteStreams : [];
    }), !("onaddstream" in n.RTCPeerConnection.prototype))) {
      Object.defineProperty(n.RTCPeerConnection.prototype, "onaddstream", {
        get() {
          return this._onaddstream;
        },
        set(t) {
          this._onaddstream && (this.removeEventListener("addstream", this._onaddstream), this.removeEventListener("track", this._onaddstreampoly)), this.addEventListener("addstream", this._onaddstream = t), this.addEventListener("track", this._onaddstreampoly = (i) => {
            i.streams.forEach((s) => {
              if (this._remoteStreams || (this._remoteStreams = []), this._remoteStreams.includes(s)) return;
              this._remoteStreams.push(s);
              const r = new Event("addstream");
              r.stream = s, this.dispatchEvent(r);
            });
          });
        }
      });
      const e = n.RTCPeerConnection.prototype.setRemoteDescription;
      n.RTCPeerConnection.prototype.setRemoteDescription = function() {
        const i = this;
        return this._onaddstreampoly || this.addEventListener("track", this._onaddstreampoly = function(s) {
          s.streams.forEach((r) => {
            if (i._remoteStreams || (i._remoteStreams = []), i._remoteStreams.indexOf(r) >= 0) return;
            i._remoteStreams.push(r);
            const o = new Event("addstream");
            o.stream = r, i.dispatchEvent(o);
          });
        }), e.apply(i, arguments);
      };
    }
  }
  function Yo(n) {
    if (typeof n != "object" || !n.RTCPeerConnection) return;
    const e = n.RTCPeerConnection.prototype, t = e.createOffer, i = e.createAnswer, s = e.setLocalDescription, r = e.setRemoteDescription, o = e.addIceCandidate;
    e.createOffer = function(d, l) {
      const u = arguments.length >= 2 ? arguments[2] : arguments[0], h = t.apply(this, [
        u
      ]);
      return l ? (h.then(d, l), Promise.resolve()) : h;
    }, e.createAnswer = function(d, l) {
      const u = arguments.length >= 2 ? arguments[2] : arguments[0], h = i.apply(this, [
        u
      ]);
      return l ? (h.then(d, l), Promise.resolve()) : h;
    };
    let a = function(c, d, l) {
      const u = s.apply(this, [
        c
      ]);
      return l ? (u.then(d, l), Promise.resolve()) : u;
    };
    e.setLocalDescription = a, a = function(c, d, l) {
      const u = r.apply(this, [
        c
      ]);
      return l ? (u.then(d, l), Promise.resolve()) : u;
    }, e.setRemoteDescription = a, a = function(c, d, l) {
      const u = o.apply(this, [
        c
      ]);
      return l ? (u.then(d, l), Promise.resolve()) : u;
    }, e.addIceCandidate = a;
  }
  function Xo(n) {
    const e = n && n.navigator;
    if (e.mediaDevices && e.mediaDevices.getUserMedia) {
      const t = e.mediaDevices, i = t.getUserMedia.bind(t);
      e.mediaDevices.getUserMedia = (s) => i(Zo(s));
    }
    !e.getUserMedia && e.mediaDevices && e.mediaDevices.getUserMedia && (e.getUserMedia = (function(i, s, r) {
      e.mediaDevices.getUserMedia(i).then(s, r);
    }).bind(e));
  }
  function Zo(n) {
    return n && n.video !== void 0 ? Object.assign({}, n, {
      video: xo(n.video)
    }) : n;
  }
  function ec(n) {
    if (!n.RTCPeerConnection) return;
    const e = n.RTCPeerConnection;
    n.RTCPeerConnection = function(i, s) {
      if (i && i.iceServers) {
        const r = [];
        for (let o = 0; o < i.iceServers.length; o++) {
          let a = i.iceServers[o];
          a.urls === void 0 && a.url ? (Qs("RTCIceServer.url", "RTCIceServer.urls"), a = JSON.parse(JSON.stringify(a)), a.urls = a.url, delete a.url, r.push(a)) : r.push(i.iceServers[o]);
        }
        i.iceServers = r;
      }
      return new e(i, s);
    }, n.RTCPeerConnection.prototype = e.prototype, "generateCertificate" in e && Object.defineProperty(n.RTCPeerConnection, "generateCertificate", {
      get() {
        return e.generateCertificate;
      }
    });
  }
  function tc(n) {
    typeof n == "object" && n.RTCTrackEvent && "receiver" in n.RTCTrackEvent.prototype && !("transceiver" in n.RTCTrackEvent.prototype) && Object.defineProperty(n.RTCTrackEvent.prototype, "transceiver", {
      get() {
        return {
          receiver: this.receiver
        };
      }
    });
  }
  function ic(n) {
    const e = n.RTCPeerConnection.prototype.createOffer;
    n.RTCPeerConnection.prototype.createOffer = function(i) {
      if (i) {
        typeof i.offerToReceiveAudio < "u" && (i.offerToReceiveAudio = !!i.offerToReceiveAudio);
        const s = this.getTransceivers().find((o) => o.receiver.track.kind === "audio");
        i.offerToReceiveAudio === false && s ? s.direction === "sendrecv" ? s.setDirection ? s.setDirection("sendonly") : s.direction = "sendonly" : s.direction === "recvonly" && (s.setDirection ? s.setDirection("inactive") : s.direction = "inactive") : i.offerToReceiveAudio === true && !s && this.addTransceiver("audio", {
          direction: "recvonly"
        }), typeof i.offerToReceiveVideo < "u" && (i.offerToReceiveVideo = !!i.offerToReceiveVideo);
        const r = this.getTransceivers().find((o) => o.receiver.track.kind === "video");
        i.offerToReceiveVideo === false && r ? r.direction === "sendrecv" ? r.setDirection ? r.setDirection("sendonly") : r.direction = "sendonly" : r.direction === "recvonly" && (r.setDirection ? r.setDirection("inactive") : r.direction = "inactive") : i.offerToReceiveVideo === true && !r && this.addTransceiver("video", {
          direction: "recvonly"
        });
      }
      return e.apply(this, arguments);
    };
  }
  function nc(n) {
    typeof n != "object" || n.AudioContext || (n.AudioContext = n.webkitAudioContext);
  }
  var qr = Object.freeze({
    __proto__: null,
    shimAudioContext: nc,
    shimCallbacksAPI: Yo,
    shimConstraints: Zo,
    shimCreateOfferLegacy: ic,
    shimGetUserMedia: Xo,
    shimLocalStreamsAPI: $o,
    shimRTCIceServerUrls: ec,
    shimRemoteStreamsAPI: Qo,
    shimTrackEventTransceiver: tc
  }), Jn = {
    exports: {}
  }, Gr;
  function Hl() {
    return Gr || (Gr = 1, function(n) {
      const e = {};
      e.generateIdentifier = function() {
        return Math.random().toString(36).substring(2, 12);
      }, e.localCName = e.generateIdentifier(), e.splitLines = function(t) {
        return t.trim().split(`
`).map((i) => i.trim());
      }, e.splitSections = function(t) {
        return t.split(`
m=`).map((s, r) => (r > 0 ? "m=" + s : s).trim() + `\r
`);
      }, e.getDescription = function(t) {
        const i = e.splitSections(t);
        return i && i[0];
      }, e.getMediaSections = function(t) {
        const i = e.splitSections(t);
        return i.shift(), i;
      }, e.matchPrefix = function(t, i) {
        return e.splitLines(t).filter((s) => s.indexOf(i) === 0);
      }, e.parseCandidate = function(t) {
        let i;
        t.indexOf("a=candidate:") === 0 ? i = t.substring(12).split(" ") : i = t.substring(10).split(" ");
        const s = {
          foundation: i[0],
          component: {
            1: "rtp",
            2: "rtcp"
          }[i[1]] || i[1],
          protocol: i[2].toLowerCase(),
          priority: parseInt(i[3], 10),
          ip: i[4],
          address: i[4],
          port: parseInt(i[5], 10),
          type: i[7]
        };
        for (let r = 8; r < i.length; r += 2) switch (i[r]) {
          case "raddr":
            s.relatedAddress = i[r + 1];
            break;
          case "rport":
            s.relatedPort = parseInt(i[r + 1], 10);
            break;
          case "tcptype":
            s.tcpType = i[r + 1];
            break;
          case "ufrag":
            s.ufrag = i[r + 1], s.usernameFragment = i[r + 1];
            break;
          default:
            s[i[r]] === void 0 && (s[i[r]] = i[r + 1]);
            break;
        }
        return s;
      }, e.writeCandidate = function(t) {
        const i = [];
        i.push(t.foundation);
        const s = t.component;
        s === "rtp" ? i.push(1) : s === "rtcp" ? i.push(2) : i.push(s), i.push(t.protocol.toUpperCase()), i.push(t.priority), i.push(t.address || t.ip), i.push(t.port);
        const r = t.type;
        return i.push("typ"), i.push(r), r !== "host" && t.relatedAddress && t.relatedPort && (i.push("raddr"), i.push(t.relatedAddress), i.push("rport"), i.push(t.relatedPort)), t.tcpType && t.protocol.toLowerCase() === "tcp" && (i.push("tcptype"), i.push(t.tcpType)), (t.usernameFragment || t.ufrag) && (i.push("ufrag"), i.push(t.usernameFragment || t.ufrag)), "candidate:" + i.join(" ");
      }, e.parseIceOptions = function(t) {
        return t.substring(14).split(" ");
      }, e.parseRtpMap = function(t) {
        let i = t.substring(9).split(" ");
        const s = {
          payloadType: parseInt(i.shift(), 10)
        };
        return i = i[0].split("/"), s.name = i[0], s.clockRate = parseInt(i[1], 10), s.channels = i.length === 3 ? parseInt(i[2], 10) : 1, s.numChannels = s.channels, s;
      }, e.writeRtpMap = function(t) {
        let i = t.payloadType;
        t.preferredPayloadType !== void 0 && (i = t.preferredPayloadType);
        const s = t.channels || t.numChannels || 1;
        return "a=rtpmap:" + i + " " + t.name + "/" + t.clockRate + (s !== 1 ? "/" + s : "") + `\r
`;
      }, e.parseExtmap = function(t) {
        const i = t.substring(9).split(" ");
        return {
          id: parseInt(i[0], 10),
          direction: i[0].indexOf("/") > 0 ? i[0].split("/")[1] : "sendrecv",
          uri: i[1],
          attributes: i.slice(2).join(" ")
        };
      }, e.writeExtmap = function(t) {
        return "a=extmap:" + (t.id || t.preferredId) + (t.direction && t.direction !== "sendrecv" ? "/" + t.direction : "") + " " + t.uri + (t.attributes ? " " + t.attributes : "") + `\r
`;
      }, e.parseFmtp = function(t) {
        const i = {};
        let s;
        const r = t.substring(t.indexOf(" ") + 1).split(";");
        for (let o = 0; o < r.length; o++) s = r[o].trim().split("="), i[s[0].trim()] = s[1];
        return i;
      }, e.writeFmtp = function(t) {
        let i = "", s = t.payloadType;
        if (t.preferredPayloadType !== void 0 && (s = t.preferredPayloadType), t.parameters && Object.keys(t.parameters).length) {
          const r = [];
          Object.keys(t.parameters).forEach((o) => {
            t.parameters[o] !== void 0 ? r.push(o + "=" + t.parameters[o]) : r.push(o);
          }), i += "a=fmtp:" + s + " " + r.join(";") + `\r
`;
        }
        return i;
      }, e.parseRtcpFb = function(t) {
        const i = t.substring(t.indexOf(" ") + 1).split(" ");
        return {
          type: i.shift(),
          parameter: i.join(" ")
        };
      }, e.writeRtcpFb = function(t) {
        let i = "", s = t.payloadType;
        return t.preferredPayloadType !== void 0 && (s = t.preferredPayloadType), t.rtcpFeedback && t.rtcpFeedback.length && t.rtcpFeedback.forEach((r) => {
          i += "a=rtcp-fb:" + s + " " + r.type + (r.parameter && r.parameter.length ? " " + r.parameter : "") + `\r
`;
        }), i;
      }, e.parseSsrcMedia = function(t) {
        const i = t.indexOf(" "), s = {
          ssrc: parseInt(t.substring(7, i), 10)
        }, r = t.indexOf(":", i);
        return r > -1 ? (s.attribute = t.substring(i + 1, r), s.value = t.substring(r + 1)) : s.attribute = t.substring(i + 1), s;
      }, e.parseSsrcGroup = function(t) {
        const i = t.substring(13).split(" ");
        return {
          semantics: i.shift(),
          ssrcs: i.map((s) => parseInt(s, 10))
        };
      }, e.getMid = function(t) {
        const i = e.matchPrefix(t, "a=mid:")[0];
        if (i) return i.substring(6);
      }, e.parseFingerprint = function(t) {
        const i = t.substring(14).split(" ");
        return {
          algorithm: i[0].toLowerCase(),
          value: i[1].toUpperCase()
        };
      }, e.getDtlsParameters = function(t, i) {
        return {
          role: "auto",
          fingerprints: e.matchPrefix(t + i, "a=fingerprint:").map(e.parseFingerprint)
        };
      }, e.writeDtlsParameters = function(t, i) {
        let s = "a=setup:" + i + `\r
`;
        return t.fingerprints.forEach((r) => {
          s += "a=fingerprint:" + r.algorithm + " " + r.value + `\r
`;
        }), s;
      }, e.parseCryptoLine = function(t) {
        const i = t.substring(9).split(" ");
        return {
          tag: parseInt(i[0], 10),
          cryptoSuite: i[1],
          keyParams: i[2],
          sessionParams: i.slice(3)
        };
      }, e.writeCryptoLine = function(t) {
        return "a=crypto:" + t.tag + " " + t.cryptoSuite + " " + (typeof t.keyParams == "object" ? e.writeCryptoKeyParams(t.keyParams) : t.keyParams) + (t.sessionParams ? " " + t.sessionParams.join(" ") : "") + `\r
`;
      }, e.parseCryptoKeyParams = function(t) {
        if (t.indexOf("inline:") !== 0) return null;
        const i = t.substring(7).split("|");
        return {
          keyMethod: "inline",
          keySalt: i[0],
          lifeTime: i[1],
          mkiValue: i[2] ? i[2].split(":")[0] : void 0,
          mkiLength: i[2] ? i[2].split(":")[1] : void 0
        };
      }, e.writeCryptoKeyParams = function(t) {
        return t.keyMethod + ":" + t.keySalt + (t.lifeTime ? "|" + t.lifeTime : "") + (t.mkiValue && t.mkiLength ? "|" + t.mkiValue + ":" + t.mkiLength : "");
      }, e.getCryptoParameters = function(t, i) {
        return e.matchPrefix(t + i, "a=crypto:").map(e.parseCryptoLine);
      }, e.getIceParameters = function(t, i) {
        const s = e.matchPrefix(t + i, "a=ice-ufrag:")[0], r = e.matchPrefix(t + i, "a=ice-pwd:")[0];
        return s && r ? {
          usernameFragment: s.substring(12),
          password: r.substring(10)
        } : null;
      }, e.writeIceParameters = function(t) {
        let i = "a=ice-ufrag:" + t.usernameFragment + `\r
a=ice-pwd:` + t.password + `\r
`;
        return t.iceLite && (i += `a=ice-lite\r
`), i;
      }, e.parseRtpParameters = function(t) {
        const i = {
          codecs: [],
          headerExtensions: [],
          fecMechanisms: [],
          rtcp: []
        }, r = e.splitLines(t)[0].split(" ");
        i.profile = r[2];
        for (let a = 3; a < r.length; a++) {
          const c = r[a], d = e.matchPrefix(t, "a=rtpmap:" + c + " ")[0];
          if (d) {
            const l = e.parseRtpMap(d), u = e.matchPrefix(t, "a=fmtp:" + c + " ");
            switch (l.parameters = u.length ? e.parseFmtp(u[0]) : {}, l.rtcpFeedback = e.matchPrefix(t, "a=rtcp-fb:" + c + " ").map(e.parseRtcpFb), i.codecs.push(l), l.name.toUpperCase()) {
              case "RED":
              case "ULPFEC":
                i.fecMechanisms.push(l.name.toUpperCase());
                break;
            }
          }
        }
        e.matchPrefix(t, "a=extmap:").forEach((a) => {
          i.headerExtensions.push(e.parseExtmap(a));
        });
        const o = e.matchPrefix(t, "a=rtcp-fb:* ").map(e.parseRtcpFb);
        return i.codecs.forEach((a) => {
          o.forEach((c) => {
            a.rtcpFeedback.find((l) => l.type === c.type && l.parameter === c.parameter) || a.rtcpFeedback.push(c);
          });
        }), i;
      }, e.writeRtpDescription = function(t, i) {
        let s = "";
        s += "m=" + t + " ", s += i.codecs.length > 0 ? "9" : "0", s += " " + (i.profile || "UDP/TLS/RTP/SAVPF") + " ", s += i.codecs.map((o) => o.preferredPayloadType !== void 0 ? o.preferredPayloadType : o.payloadType).join(" ") + `\r
`, s += `c=IN IP4 0.0.0.0\r
`, s += `a=rtcp:9 IN IP4 0.0.0.0\r
`, i.codecs.forEach((o) => {
          s += e.writeRtpMap(o), s += e.writeFmtp(o), s += e.writeRtcpFb(o);
        });
        let r = 0;
        return i.codecs.forEach((o) => {
          o.maxptime > r && (r = o.maxptime);
        }), r > 0 && (s += "a=maxptime:" + r + `\r
`), i.headerExtensions && i.headerExtensions.forEach((o) => {
          s += e.writeExtmap(o);
        }), s;
      }, e.parseRtpEncodingParameters = function(t) {
        const i = [], s = e.parseRtpParameters(t), r = s.fecMechanisms.indexOf("RED") !== -1, o = s.fecMechanisms.indexOf("ULPFEC") !== -1, a = e.matchPrefix(t, "a=ssrc:").map((h) => e.parseSsrcMedia(h)).filter((h) => h.attribute === "cname"), c = a.length > 0 && a[0].ssrc;
        let d;
        const l = e.matchPrefix(t, "a=ssrc-group:FID").map((h) => h.substring(17).split(" ").map((v) => parseInt(v, 10)));
        l.length > 0 && l[0].length > 1 && l[0][0] === c && (d = l[0][1]), s.codecs.forEach((h) => {
          if (h.name.toUpperCase() === "RTX" && h.parameters.apt) {
            let m = {
              ssrc: c,
              codecPayloadType: parseInt(h.parameters.apt, 10)
            };
            c && d && (m.rtx = {
              ssrc: d
            }), i.push(m), r && (m = JSON.parse(JSON.stringify(m)), m.fec = {
              ssrc: c,
              mechanism: o ? "red+ulpfec" : "red"
            }, i.push(m));
          }
        }), i.length === 0 && c && i.push({
          ssrc: c
        });
        let u = e.matchPrefix(t, "b=");
        return u.length && (u[0].indexOf("b=TIAS:") === 0 ? u = parseInt(u[0].substring(7), 10) : u[0].indexOf("b=AS:") === 0 ? u = parseInt(u[0].substring(5), 10) * 1e3 * 0.95 - 50 * 40 * 8 : u = void 0, i.forEach((h) => {
          h.maxBitrate = u;
        })), i;
      }, e.parseRtcpParameters = function(t) {
        const i = {}, s = e.matchPrefix(t, "a=ssrc:").map((a) => e.parseSsrcMedia(a)).filter((a) => a.attribute === "cname")[0];
        s && (i.cname = s.value, i.ssrc = s.ssrc);
        const r = e.matchPrefix(t, "a=rtcp-rsize");
        i.reducedSize = r.length > 0, i.compound = r.length === 0;
        const o = e.matchPrefix(t, "a=rtcp-mux");
        return i.mux = o.length > 0, i;
      }, e.writeRtcpParameters = function(t) {
        let i = "";
        return t.reducedSize && (i += `a=rtcp-rsize\r
`), t.mux && (i += `a=rtcp-mux\r
`), t.ssrc !== void 0 && t.cname && (i += "a=ssrc:" + t.ssrc + " cname:" + t.cname + `\r
`), i;
      }, e.parseMsid = function(t) {
        let i;
        const s = e.matchPrefix(t, "a=msid:");
        if (s.length === 1) return i = s[0].substring(7).split(" "), {
          stream: i[0],
          track: i[1]
        };
        const r = e.matchPrefix(t, "a=ssrc:").map((o) => e.parseSsrcMedia(o)).filter((o) => o.attribute === "msid");
        if (r.length > 0) return i = r[0].value.split(" "), {
          stream: i[0],
          track: i[1]
        };
      }, e.parseSctpDescription = function(t) {
        const i = e.parseMLine(t), s = e.matchPrefix(t, "a=max-message-size:");
        let r;
        s.length > 0 && (r = parseInt(s[0].substring(19), 10)), isNaN(r) && (r = 65536);
        const o = e.matchPrefix(t, "a=sctp-port:");
        if (o.length > 0) return {
          port: parseInt(o[0].substring(12), 10),
          protocol: i.fmt,
          maxMessageSize: r
        };
        const a = e.matchPrefix(t, "a=sctpmap:");
        if (a.length > 0) {
          const c = a[0].substring(10).split(" ");
          return {
            port: parseInt(c[0], 10),
            protocol: c[1],
            maxMessageSize: r
          };
        }
      }, e.writeSctpDescription = function(t, i) {
        let s = [];
        return t.protocol !== "DTLS/SCTP" ? s = [
          "m=" + t.kind + " 9 " + t.protocol + " " + i.protocol + `\r
`,
          `c=IN IP4 0.0.0.0\r
`,
          "a=sctp-port:" + i.port + `\r
`
        ] : s = [
          "m=" + t.kind + " 9 " + t.protocol + " " + i.port + `\r
`,
          `c=IN IP4 0.0.0.0\r
`,
          "a=sctpmap:" + i.port + " " + i.protocol + ` 65535\r
`
        ], i.maxMessageSize !== void 0 && s.push("a=max-message-size:" + i.maxMessageSize + `\r
`), s.join("");
      }, e.generateSessionId = function() {
        return Math.random().toString().substr(2, 22);
      }, e.writeSessionBoilerplate = function(t, i, s) {
        let r;
        const o = i !== void 0 ? i : 2;
        return t ? r = t : r = e.generateSessionId(), `v=0\r
o=` + (s || "thisisadapterortc") + " " + r + " " + o + ` IN IP4 127.0.0.1\r
s=-\r
t=0 0\r
`;
      }, e.getDirection = function(t, i) {
        const s = e.splitLines(t);
        for (let r = 0; r < s.length; r++) switch (s[r]) {
          case "a=sendrecv":
          case "a=sendonly":
          case "a=recvonly":
          case "a=inactive":
            return s[r].substring(2);
        }
        return i ? e.getDirection(i) : "sendrecv";
      }, e.getKind = function(t) {
        return e.splitLines(t)[0].split(" ")[0].substring(2);
      }, e.isRejected = function(t) {
        return t.split(" ", 2)[1] === "0";
      }, e.parseMLine = function(t) {
        const s = e.splitLines(t)[0].substring(2).split(" ");
        return {
          kind: s[0],
          port: parseInt(s[1], 10),
          protocol: s[2],
          fmt: s.slice(3).join(" ")
        };
      }, e.parseOLine = function(t) {
        const s = e.matchPrefix(t, "o=")[0].substring(2).split(" ");
        return {
          username: s[0],
          sessionId: s[1],
          sessionVersion: parseInt(s[2], 10),
          netType: s[3],
          addressType: s[4],
          address: s[5]
        };
      }, e.isValidSDP = function(t) {
        if (typeof t != "string" || t.length === 0) return false;
        const i = e.splitLines(t);
        for (let s = 0; s < i.length; s++) if (i[s].length < 2 || i[s].charAt(1) !== "=") return false;
        return true;
      }, n.exports = e;
    }(Jn)), Jn.exports;
  }
  var sc = Hl(), bi = Al(sc), Jl = Qc({
    __proto__: null,
    default: bi
  }, [
    sc
  ]);
  function hn(n) {
    if (!n.RTCIceCandidate || n.RTCIceCandidate && "foundation" in n.RTCIceCandidate.prototype) return;
    const e = n.RTCIceCandidate;
    n.RTCIceCandidate = function(i) {
      if (typeof i == "object" && i.candidate && i.candidate.indexOf("a=") === 0 && (i = JSON.parse(JSON.stringify(i)), i.candidate = i.candidate.substring(2)), i.candidate && i.candidate.length) {
        const s = new e(i), r = bi.parseCandidate(i.candidate);
        for (const o in r) o in s || Object.defineProperty(s, o, {
          value: r[o]
        });
        return s.toJSON = function() {
          return {
            candidate: s.candidate,
            sdpMid: s.sdpMid,
            sdpMLineIndex: s.sdpMLineIndex,
            usernameFragment: s.usernameFragment
          };
        }, s;
      }
      return new e(i);
    }, n.RTCIceCandidate.prototype = e.prototype, ri(n, "icecandidate", (t) => (t.candidate && Object.defineProperty(t, "candidate", {
      value: new n.RTCIceCandidate(t.candidate),
      writable: "false"
    }), t));
  }
  function ys(n) {
    !n.RTCIceCandidate || n.RTCIceCandidate && "relayProtocol" in n.RTCIceCandidate.prototype || ri(n, "icecandidate", (e) => {
      if (e.candidate) {
        const t = bi.parseCandidate(e.candidate.candidate);
        t.type === "relay" && (e.candidate.relayProtocol = {
          0: "tls",
          1: "tcp",
          2: "udp"
        }[t.priority >> 24]);
      }
      return e;
    });
  }
  function pn(n, e) {
    if (!n.RTCPeerConnection) return;
    "sctp" in n.RTCPeerConnection.prototype || Object.defineProperty(n.RTCPeerConnection.prototype, "sctp", {
      get() {
        return typeof this._sctp > "u" ? null : this._sctp;
      }
    });
    const t = function(a) {
      if (!a || !a.sdp) return false;
      const c = bi.splitSections(a.sdp);
      return c.shift(), c.some((d) => {
        const l = bi.parseMLine(d);
        return l && l.kind === "application" && l.protocol.indexOf("SCTP") !== -1;
      });
    }, i = function(a) {
      const c = a.sdp.match(/mozilla...THIS_IS_SDPARTA-(\d+)/);
      if (c === null || c.length < 2) return -1;
      const d = parseInt(c[1], 10);
      return d !== d ? -1 : d;
    }, s = function(a) {
      let c = 65536;
      return e.browser === "firefox" && (e.version < 57 ? a === -1 ? c = 16384 : c = 2147483637 : e.version < 60 ? c = e.version === 57 ? 65535 : 65536 : c = 2147483637), c;
    }, r = function(a, c) {
      let d = 65536;
      e.browser === "firefox" && e.version === 57 && (d = 65535);
      const l = bi.matchPrefix(a.sdp, "a=max-message-size:");
      return l.length > 0 ? d = parseInt(l[0].substring(19), 10) : e.browser === "firefox" && c !== -1 && (d = 2147483637), d;
    }, o = n.RTCPeerConnection.prototype.setRemoteDescription;
    n.RTCPeerConnection.prototype.setRemoteDescription = function() {
      if (this._sctp = null, e.browser === "chrome" && e.version >= 76) {
        const { sdpSemantics: c } = this.getConfiguration();
        c === "plan-b" && Object.defineProperty(this, "sctp", {
          get() {
            return typeof this._sctp > "u" ? null : this._sctp;
          },
          enumerable: true,
          configurable: true
        });
      }
      if (t(arguments[0])) {
        const c = i(arguments[0]), d = s(c), l = r(arguments[0], c);
        let u;
        d === 0 && l === 0 ? u = Number.POSITIVE_INFINITY : d === 0 || l === 0 ? u = Math.max(d, l) : u = Math.min(d, l);
        const h = {};
        Object.defineProperty(h, "maxMessageSize", {
          get() {
            return u;
          }
        }), this._sctp = h;
      }
      return o.apply(this, arguments);
    };
  }
  function mn(n) {
    if (!(n.RTCPeerConnection && "createDataChannel" in n.RTCPeerConnection.prototype)) return;
    function e(i, s) {
      const r = i.send;
      i.send = function() {
        const a = arguments[0], c = a.length || a.size || a.byteLength;
        if (i.readyState === "open" && s.sctp && c > s.sctp.maxMessageSize) throw new TypeError("Message too large (can send a maximum of " + s.sctp.maxMessageSize + " bytes)");
        return r.apply(i, arguments);
      };
    }
    const t = n.RTCPeerConnection.prototype.createDataChannel;
    n.RTCPeerConnection.prototype.createDataChannel = function() {
      const s = t.apply(this, arguments);
      return e(s, this), s;
    }, ri(n, "datachannel", (i) => (e(i.channel, i.target), i));
  }
  function bs(n) {
    if (!n.RTCPeerConnection || "connectionState" in n.RTCPeerConnection.prototype) return;
    const e = n.RTCPeerConnection.prototype;
    Object.defineProperty(e, "connectionState", {
      get() {
        return {
          completed: "connected",
          checking: "connecting"
        }[this.iceConnectionState] || this.iceConnectionState;
      },
      enumerable: true,
      configurable: true
    }), Object.defineProperty(e, "onconnectionstatechange", {
      get() {
        return this._onconnectionstatechange || null;
      },
      set(t) {
        this._onconnectionstatechange && (this.removeEventListener("connectionstatechange", this._onconnectionstatechange), delete this._onconnectionstatechange), t && this.addEventListener("connectionstatechange", this._onconnectionstatechange = t);
      },
      enumerable: true,
      configurable: true
    }), [
      "setLocalDescription",
      "setRemoteDescription"
    ].forEach((t) => {
      const i = e[t];
      e[t] = function() {
        return this._connectionstatechangepoly || (this._connectionstatechangepoly = (s) => {
          const r = s.target;
          if (r._lastConnectionState !== r.connectionState) {
            r._lastConnectionState = r.connectionState;
            const o = new Event("connectionstatechange", s);
            r.dispatchEvent(o);
          }
          return s;
        }, this.addEventListener("iceconnectionstatechange", this._connectionstatechangepoly)), i.apply(this, arguments);
      };
    });
  }
  function ks(n, e) {
    if (!n.RTCPeerConnection || e.browser === "chrome" && e.version >= 71 || e.browser === "safari" && e._safariVersion >= 13.1) return;
    const t = n.RTCPeerConnection.prototype.setRemoteDescription;
    n.RTCPeerConnection.prototype.setRemoteDescription = function(s) {
      if (s && s.sdp && s.sdp.indexOf(`
a=extmap-allow-mixed`) !== -1) {
        const r = s.sdp.split(`
`).filter((o) => o.trim() !== "a=extmap-allow-mixed").join(`
`);
        n.RTCSessionDescription && s instanceof n.RTCSessionDescription ? arguments[0] = new n.RTCSessionDescription({
          type: s.type,
          sdp: r
        }) : s.sdp = r;
      }
      return t.apply(this, arguments);
    };
  }
  function fn(n, e) {
    if (!(n.RTCPeerConnection && n.RTCPeerConnection.prototype)) return;
    const t = n.RTCPeerConnection.prototype.addIceCandidate;
    !t || t.length === 0 || (n.RTCPeerConnection.prototype.addIceCandidate = function() {
      return arguments[0] ? (e.browser === "chrome" && e.version < 78 || e.browser === "firefox" && e.version < 68 || e.browser === "safari") && arguments[0] && arguments[0].candidate === "" ? Promise.resolve() : t.apply(this, arguments) : (arguments[1] && arguments[1].apply(null), Promise.resolve());
    });
  }
  function gn(n, e) {
    if (!(n.RTCPeerConnection && n.RTCPeerConnection.prototype)) return;
    const t = n.RTCPeerConnection.prototype.setLocalDescription;
    !t || t.length === 0 || (n.RTCPeerConnection.prototype.setLocalDescription = function() {
      let s = arguments[0] || {};
      if (typeof s != "object" || s.type && s.sdp) return t.apply(this, arguments);
      if (s = {
        type: s.type,
        sdp: s.sdp
      }, !s.type) switch (this.signalingState) {
        case "stable":
        case "have-local-offer":
        case "have-remote-pranswer":
          s.type = "offer";
          break;
        default:
          s.type = "answer";
          break;
      }
      return s.sdp || s.type !== "offer" && s.type !== "answer" ? t.apply(this, [
        s
      ]) : (s.type === "offer" ? this.createOffer : this.createAnswer).apply(this).then((o) => t.apply(this, [
        o
      ]));
    });
  }
  var zl = Object.freeze({
    __proto__: null,
    removeExtmapAllowMixed: ks,
    shimAddIceCandidateNullOrEmpty: fn,
    shimConnectionState: bs,
    shimMaxMessageSize: pn,
    shimParameterlessSetLocalDescription: gn,
    shimRTCIceCandidate: hn,
    shimRTCIceCandidateRelayProtocol: ys,
    shimSendThrowTypeError: mn
  });
  function $l() {
    let { window: n } = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {
      shimChrome: true,
      shimFirefox: true,
      shimSafari: true
    };
    const t = Io, i = Wl(n), s = {
      browserDetails: i,
      commonShim: zl,
      extractVersion: Vi,
      disableLog: ql,
      disableWarnings: Gl,
      sdp: Jl
    };
    switch (i.browser) {
      case "chrome":
        if (!Br || !gs || !e.shimChrome) return t("Chrome shim is not included in this adapter release."), s;
        if (i.version === null) return t("Chrome shim can not determine version, not shimming."), s;
        t("adapter.js shimming chrome."), s.browserShim = Br, fn(n, i), gn(n), Mo(n, i), Oo(n), gs(n, i), Do(n), Uo(n, i), Ao(n), No(n), jo(n, i), hn(n), ys(n), bs(n), pn(n, i), mn(n), ks(n, i);
        break;
      case "firefox":
        if (!Vr || !vs || !e.shimFirefox) return t("Firefox shim is not included in this adapter release."), s;
        t("adapter.js shimming firefox."), s.browserShim = Vr, fn(n, i), gn(n), Fo(n, i), vs(n, i), Bo(n), Go(n), Vo(n), qo(n), Wo(n), Ko(n), Ho(n), Jo(n), zo(n), hn(n), bs(n), pn(n, i), mn(n);
        break;
      case "safari":
        if (!qr || !e.shimSafari) return t("Safari shim is not included in this adapter release."), s;
        t("adapter.js shimming safari."), s.browserShim = qr, fn(n, i), gn(n), ec(n), ic(n), Yo(n), $o(n), Qo(n), tc(n), Xo(n), nc(n), hn(n), ys(n), pn(n, i), mn(n), ks(n, i);
        break;
      default:
        t("Unsupported browser!");
        break;
    }
    return s;
  }
  $l({
    window: typeof window > "u" ? void 0 : window
  });
  var Ss, rc;
  class Ae extends (rc = Promise) {
    constructor(e) {
      super(e);
    }
    catch(e) {
      return super.catch(e);
    }
    static reject(e) {
      return super.reject(e);
    }
    static all(e) {
      return super.all(e);
    }
    static race(e) {
      return super.race(e);
    }
  }
  Ss = Ae;
  Ae.resolve = (n) => Reflect.get(rc, "resolve", Ss).call(Ss, n);
  const Ql = /version\/(\d+(\.?_?\d+)+)/i;
  let zn;
  function We(n) {
    let e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true;
    if (typeof navigator > "u") return;
    const t = navigator.userAgent.toLowerCase();
    if (zn === void 0 || e) {
      const i = Yl.find((s) => {
        let { test: r } = s;
        return r.test(t);
      });
      zn = i == null ? void 0 : i.describe(t);
    }
    return zn;
  }
  const Yl = [
    {
      test: /firefox|iceweasel|fxios/i,
      describe(n) {
        return {
          name: "Firefox",
          version: vn(/(?:firefox|iceweasel|fxios)[\s/](\d+(\.?_?\d+)+)/i, n),
          os: n.toLowerCase().includes("fxios") ? "iOS" : void 0,
          osVersion: $n(n)
        };
      }
    },
    {
      test: /chrom|crios|crmo/i,
      describe(n) {
        return {
          name: "Chrome",
          version: vn(/(?:chrome|chromium|crios|crmo)\/(\d+(\.?_?\d+)+)/i, n),
          os: n.toLowerCase().includes("crios") ? "iOS" : void 0,
          osVersion: $n(n)
        };
      }
    },
    {
      test: /safari|applewebkit/i,
      describe(n) {
        return {
          name: "Safari",
          version: vn(Ql, n),
          os: n.includes("mobile/") ? "iOS" : "macOS",
          osVersion: $n(n)
        };
      }
    }
  ];
  function vn(n, e) {
    let t = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 1;
    const i = e.match(n);
    return i && i.length >= t && i[t] || "";
  }
  function $n(n) {
    return n.includes("mac os") ? vn(/\(.+?(\d+_\d+(:?_\d+)?)/, n, 1).replace(/_/g, ".") : void 0;
  }
  var Xl = "2.17.1";
  const Zl = Xl, eu = 16;
  class Gt extends Error {
    constructor(e, t, i) {
      super(t || "an error has occurred"), this.name = "LiveKitError", this.code = e, typeof (i == null ? void 0 : i.cause) < "u" && (this.cause = i == null ? void 0 : i.cause);
    }
  }
  class Ys extends Gt {
  }
  var ce;
  (function(n) {
    n[n.NotAllowed = 0] = "NotAllowed", n[n.ServerUnreachable = 1] = "ServerUnreachable", n[n.InternalError = 2] = "InternalError", n[n.Cancelled = 3] = "Cancelled", n[n.LeaveRequest = 4] = "LeaveRequest", n[n.Timeout = 5] = "Timeout", n[n.WebSocket = 6] = "WebSocket", n[n.ServiceNotFound = 7] = "ServiceNotFound";
  })(ce || (ce = {}));
  class F extends Ys {
    constructor(e, t, i, s) {
      super(1, e), this.name = "ConnectionError", this.status = i, this.reason = t, this.context = s, this.reasonName = ce[t];
    }
    static notAllowed(e, t, i) {
      return new F(e, ce.NotAllowed, t, i);
    }
    static timeout(e) {
      return new F(e, ce.Timeout);
    }
    static leaveRequest(e, t) {
      return new F(e, ce.LeaveRequest, void 0, t);
    }
    static internal(e, t) {
      return new F(e, ce.InternalError, void 0, t);
    }
    static cancelled(e) {
      return new F(e, ce.Cancelled);
    }
    static serverUnreachable(e, t) {
      return new F(e, ce.ServerUnreachable, t);
    }
    static websocket(e, t, i) {
      return new F(e, ce.WebSocket, t, i);
    }
    static serviceNotFound(e, t) {
      return new F(e, ce.ServiceNotFound, void 0, t);
    }
  }
  class Xs extends Gt {
    constructor(e) {
      super(21, e ?? "device is unsupported"), this.name = "DeviceUnsupportedError";
    }
  }
  class Tt extends Gt {
    constructor(e) {
      super(20, e ?? "track is invalid"), this.name = "TrackInvalidError";
    }
  }
  class tu extends Gt {
    constructor(e) {
      super(10, e ?? "unsupported server"), this.name = "UnsupportedServer";
    }
  }
  class me extends Gt {
    constructor(e) {
      super(12, e ?? "unexpected connection state"), this.name = "UnexpectedConnectionState";
    }
  }
  class ki extends Gt {
    constructor(e) {
      super(13, e ?? "unable to negotiate"), this.name = "NegotiationError";
    }
  }
  class Wr extends Gt {
    constructor(e, t) {
      super(15, e), this.name = "PublishTrackError", this.status = t;
    }
  }
  class Kr extends Ys {
    constructor(e, t) {
      super(15, e), this.name = "SignalRequestError", this.reason = t, this.reasonName = typeof t == "string" ? t : $s[t];
    }
  }
  var Le;
  (function(n) {
    n[n.AlreadyOpened = 0] = "AlreadyOpened", n[n.AbnormalEnd = 1] = "AbnormalEnd", n[n.DecodeFailed = 2] = "DecodeFailed", n[n.LengthExceeded = 3] = "LengthExceeded", n[n.Incomplete = 4] = "Incomplete", n[n.HandlerAlreadyRegistered = 7] = "HandlerAlreadyRegistered", n[n.EncryptionTypeMismatch = 8] = "EncryptionTypeMismatch";
  })(Le || (Le = {}));
  class ze extends Ys {
    constructor(e, t) {
      super(16, e), this.name = "DataStreamError", this.reason = t, this.reasonName = Le[t];
    }
  }
  class li extends Gt {
    constructor(e) {
      super(18, e), this.name = "SignalReconnectError";
    }
  }
  var Pn;
  (function(n) {
    n.PermissionDenied = "PermissionDenied", n.NotFound = "NotFound", n.DeviceInUse = "DeviceInUse", n.Other = "Other";
  })(Pn || (Pn = {}));
  (function(n) {
    function e(t) {
      if (t && "name" in t) return t.name === "NotFoundError" || t.name === "DevicesNotFoundError" ? n.NotFound : t.name === "NotAllowedError" || t.name === "PermissionDeniedError" ? n.PermissionDenied : t.name === "NotReadableError" || t.name === "TrackStartError" ? n.DeviceInUse : n.Other;
    }
    n.getFailure = e;
  })(Pn || (Pn = {}));
  class Ie {
  }
  Ie.setTimeout = function() {
    return setTimeout(...arguments);
  };
  Ie.setInterval = function() {
    return setInterval(...arguments);
  };
  Ie.clearTimeout = function() {
    return clearTimeout(...arguments);
  };
  Ie.clearInterval = function() {
    return clearInterval(...arguments);
  };
  var R;
  (function(n) {
    n.Connected = "connected", n.Reconnecting = "reconnecting", n.SignalReconnecting = "signalReconnecting", n.Reconnected = "reconnected", n.Disconnected = "disconnected", n.ConnectionStateChanged = "connectionStateChanged", n.Moved = "moved", n.MediaDevicesChanged = "mediaDevicesChanged", n.ParticipantConnected = "participantConnected", n.ParticipantDisconnected = "participantDisconnected", n.TrackPublished = "trackPublished", n.TrackSubscribed = "trackSubscribed", n.TrackSubscriptionFailed = "trackSubscriptionFailed", n.TrackUnpublished = "trackUnpublished", n.TrackUnsubscribed = "trackUnsubscribed", n.TrackMuted = "trackMuted", n.TrackUnmuted = "trackUnmuted", n.LocalTrackPublished = "localTrackPublished", n.LocalTrackUnpublished = "localTrackUnpublished", n.LocalAudioSilenceDetected = "localAudioSilenceDetected", n.ActiveSpeakersChanged = "activeSpeakersChanged", n.ParticipantMetadataChanged = "participantMetadataChanged", n.ParticipantNameChanged = "participantNameChanged", n.ParticipantAttributesChanged = "participantAttributesChanged", n.ParticipantActive = "participantActive", n.RoomMetadataChanged = "roomMetadataChanged", n.DataReceived = "dataReceived", n.SipDTMFReceived = "sipDTMFReceived", n.TranscriptionReceived = "transcriptionReceived", n.ConnectionQualityChanged = "connectionQualityChanged", n.TrackStreamStateChanged = "trackStreamStateChanged", n.TrackSubscriptionPermissionChanged = "trackSubscriptionPermissionChanged", n.TrackSubscriptionStatusChanged = "trackSubscriptionStatusChanged", n.AudioPlaybackStatusChanged = "audioPlaybackChanged", n.VideoPlaybackStatusChanged = "videoPlaybackChanged", n.MediaDevicesError = "mediaDevicesError", n.ParticipantPermissionsChanged = "participantPermissionsChanged", n.SignalConnected = "signalConnected", n.RecordingStatusChanged = "recordingStatusChanged", n.ParticipantEncryptionStatusChanged = "participantEncryptionStatusChanged", n.EncryptionError = "encryptionError", n.DCBufferStatusChanged = "dcBufferStatusChanged", n.ActiveDeviceChanged = "activeDeviceChanged", n.ChatMessage = "chatMessage", n.LocalTrackSubscribed = "localTrackSubscribed", n.MetricsReceived = "metricsReceived";
  })(R || (R = {}));
  var O;
  (function(n) {
    n.TrackPublished = "trackPublished", n.TrackSubscribed = "trackSubscribed", n.TrackSubscriptionFailed = "trackSubscriptionFailed", n.TrackUnpublished = "trackUnpublished", n.TrackUnsubscribed = "trackUnsubscribed", n.TrackMuted = "trackMuted", n.TrackUnmuted = "trackUnmuted", n.LocalTrackPublished = "localTrackPublished", n.LocalTrackUnpublished = "localTrackUnpublished", n.LocalTrackCpuConstrained = "localTrackCpuConstrained", n.LocalSenderCreated = "localSenderCreated", n.ParticipantMetadataChanged = "participantMetadataChanged", n.ParticipantNameChanged = "participantNameChanged", n.DataReceived = "dataReceived", n.SipDTMFReceived = "sipDTMFReceived", n.TranscriptionReceived = "transcriptionReceived", n.IsSpeakingChanged = "isSpeakingChanged", n.ConnectionQualityChanged = "connectionQualityChanged", n.TrackStreamStateChanged = "trackStreamStateChanged", n.TrackSubscriptionPermissionChanged = "trackSubscriptionPermissionChanged", n.TrackSubscriptionStatusChanged = "trackSubscriptionStatusChanged", n.TrackCpuConstrained = "trackCpuConstrained", n.MediaDevicesError = "mediaDevicesError", n.AudioStreamAcquired = "audioStreamAcquired", n.ParticipantPermissionsChanged = "participantPermissionsChanged", n.PCTrackAdded = "pcTrackAdded", n.AttributesChanged = "attributesChanged", n.LocalTrackSubscribed = "localTrackSubscribed", n.ChatMessage = "chatMessage", n.Active = "active";
  })(O || (O = {}));
  var M;
  (function(n) {
    n.TransportsCreated = "transportsCreated", n.Connected = "connected", n.Disconnected = "disconnected", n.Resuming = "resuming", n.Resumed = "resumed", n.Restarting = "restarting", n.Restarted = "restarted", n.SignalResumed = "signalResumed", n.SignalRestarted = "signalRestarted", n.Closing = "closing", n.MediaTrackAdded = "mediaTrackAdded", n.ActiveSpeakersUpdate = "activeSpeakersUpdate", n.DataPacketReceived = "dataPacketReceived", n.RTPVideoMapUpdate = "rtpVideoMapUpdate", n.DCBufferStatusChanged = "dcBufferStatusChanged", n.ParticipantUpdate = "participantUpdate", n.RoomUpdate = "roomUpdate", n.SpeakersChanged = "speakersChanged", n.StreamStateChanged = "streamStateChanged", n.ConnectionQualityUpdate = "connectionQualityUpdate", n.SubscriptionError = "subscriptionError", n.SubscriptionPermissionUpdate = "subscriptionPermissionUpdate", n.RemoteMute = "remoteMute", n.SubscribedQualityUpdate = "subscribedQualityUpdate", n.LocalTrackUnpublished = "localTrackUnpublished", n.LocalTrackSubscribed = "localTrackSubscribed", n.Offline = "offline", n.SignalRequestResponse = "signalRequestResponse", n.SignalConnected = "signalConnected", n.RoomMoved = "roomMoved";
  })(M || (M = {}));
  var x;
  (function(n) {
    n.Message = "message", n.Muted = "muted", n.Unmuted = "unmuted", n.Restarted = "restarted", n.Ended = "ended", n.Subscribed = "subscribed", n.Unsubscribed = "unsubscribed", n.CpuConstrained = "cpuConstrained", n.UpdateSettings = "updateSettings", n.UpdateSubscription = "updateSubscription", n.AudioPlaybackStarted = "audioPlaybackStarted", n.AudioPlaybackFailed = "audioPlaybackFailed", n.AudioSilenceDetected = "audioSilenceDetected", n.VisibilityChanged = "visibilityChanged", n.VideoDimensionsChanged = "videoDimensionsChanged", n.VideoPlaybackStarted = "videoPlaybackStarted", n.VideoPlaybackFailed = "videoPlaybackFailed", n.ElementAttached = "elementAttached", n.ElementDetached = "elementDetached", n.UpstreamPaused = "upstreamPaused", n.UpstreamResumed = "upstreamResumed", n.SubscriptionPermissionChanged = "subscriptionPermissionChanged", n.SubscriptionStatusChanged = "subscriptionStatusChanged", n.SubscriptionFailed = "subscriptionFailed", n.TrackProcessorUpdate = "trackProcessorUpdate", n.AudioTrackFeatureUpdate = "audioTrackFeatureUpdate", n.TranscriptionReceived = "transcriptionReceived", n.TimeSyncUpdate = "timeSyncUpdate", n.PreConnectBufferFlushed = "preConnectBufferFlushed";
  })(x || (x = {}));
  function iu(n) {
    return typeof n > "u" ? n : typeof structuredClone == "function" ? typeof n == "object" && n !== null ? structuredClone(Object.assign({}, n)) : structuredClone(n) : JSON.parse(JSON.stringify(n));
  }
  class ae {
    constructor(e, t, i, s, r) {
      if (typeof e == "object") this.width = e.width, this.height = e.height, this.aspectRatio = e.aspectRatio, this.encoding = {
        maxBitrate: e.maxBitrate,
        maxFramerate: e.maxFramerate,
        priority: e.priority
      };
      else if (t !== void 0 && i !== void 0) this.width = e, this.height = t, this.aspectRatio = e / t, this.encoding = {
        maxBitrate: i,
        maxFramerate: s,
        priority: r
      };
      else throw new TypeError("Unsupported options: provide at least width, height and maxBitrate");
    }
    get resolution() {
      return {
        width: this.width,
        height: this.height,
        frameRate: this.encoding.maxFramerate,
        aspectRatio: this.aspectRatio
      };
    }
  }
  const nu = [
    "vp8",
    "h264"
  ], su = [
    "vp8",
    "h264",
    "vp9",
    "av1",
    "h265"
  ];
  function ru(n) {
    return !!nu.find((e) => e === n);
  }
  const au = ru;
  var Hr;
  (function(n) {
    n[n.PREFER_REGRESSION = 0] = "PREFER_REGRESSION", n[n.SIMULCAST = 1] = "SIMULCAST", n[n.REGRESSION = 2] = "REGRESSION";
  })(Hr || (Hr = {}));
  var Ts;
  (function(n) {
    n.telephone = {
      maxBitrate: 12e3
    }, n.speech = {
      maxBitrate: 24e3
    }, n.music = {
      maxBitrate: 48e3
    }, n.musicStereo = {
      maxBitrate: 64e3
    }, n.musicHighQuality = {
      maxBitrate: 96e3
    }, n.musicHighQualityStereo = {
      maxBitrate: 128e3
    };
  })(Ts || (Ts = {}));
  const Qi = {
    h90: new ae(160, 90, 9e4, 20),
    h180: new ae(320, 180, 16e4, 20),
    h216: new ae(384, 216, 18e4, 20),
    h360: new ae(640, 360, 45e4, 20),
    h540: new ae(960, 540, 8e5, 25),
    h720: new ae(1280, 720, 17e5, 30),
    h1080: new ae(1920, 1080, 3e6, 30),
    h1440: new ae(2560, 1440, 5e6, 30),
    h2160: new ae(3840, 2160, 8e6, 30)
  }, Cs = {
    h120: new ae(160, 120, 7e4, 20),
    h180: new ae(240, 180, 125e3, 20),
    h240: new ae(320, 240, 14e4, 20),
    h360: new ae(480, 360, 33e4, 20),
    h480: new ae(640, 480, 5e5, 20),
    h540: new ae(720, 540, 6e5, 25),
    h720: new ae(960, 720, 13e5, 30),
    h1080: new ae(1440, 1080, 23e5, 30),
    h1440: new ae(1920, 1440, 38e5, 30)
  }, Zs = {
    h360fps3: new ae(640, 360, 2e5, 3, "medium"),
    h360fps15: new ae(640, 360, 4e5, 15, "medium"),
    h720fps5: new ae(1280, 720, 8e5, 5, "medium"),
    h720fps15: new ae(1280, 720, 15e5, 15, "medium"),
    h720fps30: new ae(1280, 720, 2e6, 30, "medium"),
    h1080fps15: new ae(1920, 1080, 25e5, 15, "medium"),
    h1080fps30: new ae(1920, 1080, 5e6, 30, "medium"),
    original: new ae(0, 0, 7e6, 30, "medium")
  };
  function ac(n, e, t) {
    var i, s, r, o;
    const { optionsWithoutProcessor: a, audioProcessor: c, videoProcessor: d } = dc(n ?? {}), l = e == null ? void 0 : e.processor, u = t == null ? void 0 : t.processor, h = a ?? {};
    return h.audio === true && (h.audio = {}), h.video === true && (h.video = {}), h.audio && (ws(h.audio, e), (i = (r = h.audio).deviceId) !== null && i !== void 0 || (r.deviceId = {
      ideal: "default"
    }), (c || l) && (h.audio.processor = c ?? l)), h.video && (ws(h.video, t), (s = (o = h.video).deviceId) !== null && s !== void 0 || (o.deviceId = {
      ideal: "default"
    }), (d || u) && (h.video.processor = d ?? u)), h;
  }
  function ws(n, e) {
    return Object.keys(e).forEach((t) => {
      n[t] === void 0 && (n[t] = e[t]);
    }), n;
  }
  function er(n) {
    var e, t, i, s;
    const r = {};
    if (n.video) if (typeof n.video == "object") {
      const o = {}, a = o, c = n.video;
      Object.keys(c).forEach((d) => {
        switch (d) {
          case "resolution":
            ws(a, c.resolution);
            break;
          default:
            a[d] = c[d];
        }
      }), r.video = o, (e = (i = r.video).deviceId) !== null && e !== void 0 || (i.deviceId = {
        ideal: "default"
      });
    } else r.video = n.video ? {
      deviceId: {
        ideal: "default"
      }
    } : false;
    else r.video = false;
    return n.audio ? typeof n.audio == "object" ? (r.audio = n.audio, (t = (s = r.audio).deviceId) !== null && t !== void 0 || (s.deviceId = {
      ideal: "default"
    })) : r.audio = {
      deviceId: {
        ideal: "default"
      }
    } : r.audio = false, r;
  }
  function oc(n) {
    return p(this, arguments, void 0, function(e) {
      let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 200;
      return function* () {
        const i = cc();
        if (i) {
          const s = i.createAnalyser();
          s.fftSize = 2048;
          const r = s.frequencyBinCount, o = new Uint8Array(r);
          i.createMediaStreamSource(new MediaStream([
            e.mediaStreamTrack
          ])).connect(s), yield xe(t), s.getByteTimeDomainData(o);
          const c = o.some((d) => d !== 128 && d !== 0);
          return i.close(), !c;
        }
        return false;
      }();
    });
  }
  function cc() {
    var n;
    const e = typeof window < "u" && (window.AudioContext || window.webkitAudioContext);
    if (e) {
      const t = new e({
        latencyHint: "interactive"
      });
      if (t.state === "suspended" && typeof window < "u" && (!((n = window.document) === null || n === void 0) && n.body)) {
        const i = () => p(this, void 0, void 0, function* () {
          var s;
          try {
            t.state === "suspended" && (yield t.resume());
          } catch (r) {
            console.warn("Error trying to auto-resume audio context", r);
          } finally {
            (s = window.document.body) === null || s === void 0 || s.removeEventListener("click", i);
          }
        });
        t.addEventListener("statechange", () => {
          var s;
          t.state === "closed" && ((s = window.document.body) === null || s === void 0 || s.removeEventListener("click", i));
        }), window.document.body.addEventListener("click", i);
      }
      return t;
    }
  }
  function ou(n) {
    return n === "audioinput" ? C.Source.Microphone : n === "videoinput" ? C.Source.Camera : C.Source.Unknown;
  }
  function Es(n) {
    return n === C.Source.Microphone ? "audioinput" : n === C.Source.Camera ? "videoinput" : void 0;
  }
  function cu(n) {
    var e, t;
    let i = (e = n.video) !== null && e !== void 0 ? e : true;
    return n.resolution && n.resolution.width > 0 && n.resolution.height > 0 && (i = typeof i == "boolean" ? {} : i, si() ? i = Object.assign(Object.assign({}, i), {
      width: {
        max: n.resolution.width
      },
      height: {
        max: n.resolution.height
      },
      frameRate: n.resolution.frameRate
    }) : i = Object.assign(Object.assign({}, i), {
      width: {
        ideal: n.resolution.width
      },
      height: {
        ideal: n.resolution.height
      },
      frameRate: n.resolution.frameRate
    })), {
      audio: (t = n.audio) !== null && t !== void 0 ? t : false,
      video: i,
      controller: n.controller,
      selfBrowserSurface: n.selfBrowserSurface,
      surfaceSwitching: n.surfaceSwitching,
      systemAudio: n.systemAudio,
      preferCurrentTab: n.preferCurrentTab
    };
  }
  function Ki(n) {
    return n.split("/")[1].toLowerCase();
  }
  function du(n) {
    const e = [];
    return n.forEach((t) => {
      t.track !== void 0 && e.push(new Ws({
        cid: t.track.mediaStreamID,
        track: t.trackInfo
      }));
    }), e;
  }
  function Y(n) {
    return "mediaStreamTrack" in n ? {
      trackID: n.sid,
      source: n.source,
      muted: n.isMuted,
      enabled: n.mediaStreamTrack.enabled,
      kind: n.kind,
      streamID: n.mediaStreamID,
      streamTrackID: n.mediaStreamTrack.id
    } : {
      trackID: n.trackSid,
      enabled: n.isEnabled,
      muted: n.isMuted,
      trackInfo: Object.assign({
        mimeType: n.mimeType,
        name: n.trackName,
        encrypted: n.isEncrypted,
        kind: n.kind,
        source: n.source
      }, n.track ? Y(n.track) : {})
    };
  }
  function lu() {
    return typeof RTCRtpReceiver < "u" && "getSynchronizationSources" in RTCRtpReceiver;
  }
  function uu(n, e) {
    var t;
    n === void 0 && (n = {}), e === void 0 && (e = {});
    const i = [
      ...Object.keys(e),
      ...Object.keys(n)
    ], s = {};
    for (const r of i) n[r] !== e[r] && (s[r] = (t = e[r]) !== null && t !== void 0 ? t : "");
    return s;
  }
  function dc(n) {
    const e = Object.assign({}, n);
    let t, i;
    return typeof e.audio == "object" && e.audio.processor && (t = e.audio.processor, e.audio = Object.assign(Object.assign({}, e.audio), {
      processor: void 0
    })), typeof e.video == "object" && e.video.processor && (i = e.video.processor, e.video = Object.assign(Object.assign({}, e.video), {
      processor: void 0
    })), {
      audioProcessor: t,
      videoProcessor: i,
      optionsWithoutProcessor: iu(e)
    };
  }
  function hu(n) {
    switch (n) {
      case be.CAMERA:
        return C.Source.Camera;
      case be.MICROPHONE:
        return C.Source.Microphone;
      case be.SCREEN_SHARE:
        return C.Source.ScreenShare;
      case be.SCREEN_SHARE_AUDIO:
        return C.Source.ScreenShareAudio;
      default:
        return C.Source.Unknown;
    }
  }
  function Jr(n, e) {
    return n.width * n.height < e.width * e.height;
  }
  function pu(n, e) {
    var t;
    return (t = n.layers) === null || t === void 0 ? void 0 : t.find((i) => i.quality === e);
  }
  const mu = 5e3, Li = [];
  var Ke;
  (function(n) {
    n[n.LOW = 0] = "LOW", n[n.MEDIUM = 1] = "MEDIUM", n[n.HIGH = 2] = "HIGH";
  })(Ke || (Ke = {}));
  C = class extends pt.EventEmitter {
    get streamState() {
      return this._streamState;
    }
    setStreamState(e) {
      this._streamState = e;
    }
    constructor(e, t) {
      let i = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
      var s;
      super(), this.attachedElements = [], this.isMuted = false, this._streamState = C.StreamState.Active, this.isInBackground = false, this._currentBitrate = 0, this.log = H, this.appVisibilityChangedListener = () => {
        this.backgroundTimeout && clearTimeout(this.backgroundTimeout), document.visibilityState === "hidden" ? this.backgroundTimeout = setTimeout(() => this.handleAppVisibilityChanged(), mu) : this.handleAppVisibilityChanged();
      }, this.log = wt((s = i.loggerName) !== null && s !== void 0 ? s : at.Track), this.loggerContextCb = i.loggerContextCb, this.setMaxListeners(100), this.kind = t, this._mediaStreamTrack = e, this._mediaStreamID = e.id, this.source = C.Source.Unknown;
    }
    get logContext() {
      var e;
      return Object.assign(Object.assign({}, (e = this.loggerContextCb) === null || e === void 0 ? void 0 : e.call(this)), Y(this));
    }
    get currentBitrate() {
      return this._currentBitrate;
    }
    get mediaStreamTrack() {
      return this._mediaStreamTrack;
    }
    get mediaStreamID() {
      return this._mediaStreamID;
    }
    attach(e) {
      let t = "audio";
      this.kind === C.Kind.Video && (t = "video"), this.attachedElements.length === 0 && this.kind === C.Kind.Video && this.addAppVisibilityListener(), e || (t === "audio" && (Li.forEach((r) => {
        r.parentElement === null && !e && (e = r);
      }), e && Li.splice(Li.indexOf(e), 1)), e || (e = document.createElement(t))), this.attachedElements.includes(e) || this.attachedElements.push(e), pi(this.mediaStreamTrack, e);
      const i = e.srcObject.getTracks(), s = i.some((r) => r.kind === "audio");
      return e.play().then(() => {
        this.emit(s ? x.AudioPlaybackStarted : x.VideoPlaybackStarted);
      }).catch((r) => {
        r.name === "NotAllowedError" ? this.emit(s ? x.AudioPlaybackFailed : x.VideoPlaybackFailed, r) : r.name === "AbortError" ? H.debug("".concat(s ? "audio" : "video", " playback aborted, likely due to new play request")) : H.warn("could not playback ".concat(s ? "audio" : "video"), r), s && e && i.some((o) => o.kind === "video") && r.name === "NotAllowedError" && (e.muted = true, e.play().catch(() => {
        }));
      }), this.emit(x.ElementAttached, e), e;
    }
    detach(e) {
      try {
        if (e) {
          Si(this.mediaStreamTrack, e);
          const i = this.attachedElements.indexOf(e);
          return i >= 0 && (this.attachedElements.splice(i, 1), this.recycleElement(e), this.emit(x.ElementDetached, e)), e;
        }
        const t = [];
        return this.attachedElements.forEach((i) => {
          Si(this.mediaStreamTrack, i), t.push(i), this.recycleElement(i), this.emit(x.ElementDetached, i);
        }), this.attachedElements = [], t;
      } finally {
        this.attachedElements.length === 0 && this.removeAppVisibilityListener();
      }
    }
    stop() {
      this.stopMonitor(), this._mediaStreamTrack.stop();
    }
    enable() {
      this._mediaStreamTrack.enabled = true;
    }
    disable() {
      this._mediaStreamTrack.enabled = false;
    }
    stopMonitor() {
      this.monitorInterval && clearInterval(this.monitorInterval), this.timeSyncHandle && cancelAnimationFrame(this.timeSyncHandle);
    }
    updateLoggerOptions(e) {
      e.loggerName && (this.log = wt(e.loggerName)), e.loggerContextCb && (this.loggerContextCb = e.loggerContextCb);
    }
    recycleElement(e) {
      if (e instanceof HTMLAudioElement) {
        let t = true;
        e.pause(), Li.forEach((i) => {
          i.parentElement || (t = false);
        }), t && Li.push(e);
      }
    }
    handleAppVisibilityChanged() {
      return p(this, void 0, void 0, function* () {
        this.isInBackground = document.visibilityState === "hidden", !this.isInBackground && this.kind === C.Kind.Video && setTimeout(() => this.attachedElements.forEach((e) => e.play().catch(() => {
        })), 0);
      });
    }
    addAppVisibilityListener() {
      Ge() ? (this.isInBackground = document.visibilityState === "hidden", document.addEventListener("visibilitychange", this.appVisibilityChangedListener)) : this.isInBackground = false;
    }
    removeAppVisibilityListener() {
      Ge() && document.removeEventListener("visibilitychange", this.appVisibilityChangedListener);
    }
  };
  function pi(n, e) {
    let t;
    e.srcObject instanceof MediaStream ? t = e.srcObject : t = new MediaStream();
    let i;
    n.kind === "audio" ? i = t.getAudioTracks() : i = t.getVideoTracks(), i.includes(n) || (i.forEach((s) => {
      t.removeTrack(s);
    }), t.addTrack(n)), (!si() || !(e instanceof HTMLVideoElement)) && (e.autoplay = true), e.muted = t.getAudioTracks().length === 0, e instanceof HTMLVideoElement && (e.playsInline = true), e.srcObject !== t && (e.srcObject = t, (si() || ni()) && e instanceof HTMLVideoElement && setTimeout(() => {
      e.srcObject = t, e.play().catch(() => {
      });
    }, 0));
  }
  function Si(n, e) {
    if (e.srcObject instanceof MediaStream) {
      const t = e.srcObject;
      t.removeTrack(n), t.getTracks().length > 0 ? e.srcObject = t : e.srcObject = null;
    }
  }
  (function(n) {
    let e;
    (function(d) {
      d.Audio = "audio", d.Video = "video", d.Unknown = "unknown";
    })(e = n.Kind || (n.Kind = {}));
    let t;
    (function(d) {
      d.Camera = "camera", d.Microphone = "microphone", d.ScreenShare = "screen_share", d.ScreenShareAudio = "screen_share_audio", d.Unknown = "unknown";
    })(t = n.Source || (n.Source = {}));
    let i;
    (function(d) {
      d.Active = "active", d.Paused = "paused", d.Unknown = "unknown";
    })(i = n.StreamState || (n.StreamState = {}));
    function s(d) {
      switch (d) {
        case e.Audio:
          return it.AUDIO;
        case e.Video:
          return it.VIDEO;
        default:
          return it.DATA;
      }
    }
    n.kindToProto = s;
    function r(d) {
      switch (d) {
        case it.AUDIO:
          return e.Audio;
        case it.VIDEO:
          return e.Video;
        default:
          return e.Unknown;
      }
    }
    n.kindFromProto = r;
    function o(d) {
      switch (d) {
        case t.Camera:
          return be.CAMERA;
        case t.Microphone:
          return be.MICROPHONE;
        case t.ScreenShare:
          return be.SCREEN_SHARE;
        case t.ScreenShareAudio:
          return be.SCREEN_SHARE_AUDIO;
        default:
          return be.UNKNOWN;
      }
    }
    n.sourceToProto = o;
    function a(d) {
      switch (d) {
        case be.CAMERA:
          return t.Camera;
        case be.MICROPHONE:
          return t.Microphone;
        case be.SCREEN_SHARE:
          return t.ScreenShare;
        case be.SCREEN_SHARE_AUDIO:
          return t.ScreenShareAudio;
        default:
          return t.Unknown;
      }
    }
    n.sourceFromProto = a;
    function c(d) {
      switch (d) {
        case hs.ACTIVE:
          return i.Active;
        case hs.PAUSED:
          return i.Paused;
        default:
          return i.Unknown;
      }
    }
    n.streamStateFromProto = c;
  })(C || (C = {}));
  const fu = "|", zr = "https://aomediacodec.github.io/av1-rtp-spec/#dependency-descriptor-rtp-header-extension";
  function gu(n) {
    const e = n.split(fu);
    return e.length > 1 ? [
      e[0],
      n.substr(e[0].length + 1)
    ] : [
      n,
      ""
    ];
  }
  function xe(n) {
    return new Ae((e) => Ie.setTimeout(e, n));
  }
  function Rs() {
    return "addTransceiver" in RTCPeerConnection.prototype;
  }
  function Ps() {
    return "addTrack" in RTCPeerConnection.prototype;
  }
  function vu() {
    if (!("getCapabilities" in RTCRtpSender) || si() || ni()) return false;
    const n = RTCRtpSender.getCapabilities("video");
    let e = false;
    if (n) {
      for (const t of n.codecs) if (t.mimeType.toLowerCase() === "video/av1") {
        e = true;
        break;
      }
    }
    return e;
  }
  function yu() {
    if (!("getCapabilities" in RTCRtpSender) || ni()) return false;
    if (si()) {
      const t = We();
      if ((t == null ? void 0 : t.version) && ht(t.version, "16") < 0 || (t == null ? void 0 : t.os) === "iOS" && (t == null ? void 0 : t.osVersion) && ht(t.osVersion, "16") < 0) return false;
    }
    const n = RTCRtpSender.getCapabilities("video");
    let e = false;
    if (n) {
      for (const t of n.codecs) if (t.mimeType.toLowerCase() === "video/vp9") {
        e = true;
        break;
      }
    }
    return e;
  }
  function st(n) {
    return n === "av1" || n === "vp9";
  }
  function _s(n) {
    return !document || Yi() ? false : (n || (n = document.createElement("audio")), "setSinkId" in n);
  }
  function bu() {
    return typeof RTCPeerConnection > "u" ? false : Rs() || Ps();
  }
  function ni() {
    var n;
    return ((n = We()) === null || n === void 0 ? void 0 : n.name) === "Firefox";
  }
  function $r() {
    const n = We();
    return !!n && n.name === "Chrome" && n.os !== "iOS";
  }
  function si() {
    var n;
    return ((n = We()) === null || n === void 0 ? void 0 : n.name) === "Safari";
  }
  function Yi() {
    const n = We();
    return (n == null ? void 0 : n.name) === "Safari" || (n == null ? void 0 : n.os) === "iOS";
  }
  function ku() {
    const n = We();
    return (n == null ? void 0 : n.name) === "Safari" && n.version.startsWith("17.") || (n == null ? void 0 : n.os) === "iOS" && !!(n == null ? void 0 : n.osVersion) && ht(n.osVersion, "17") >= 0;
  }
  function Su(n) {
    return n || (n = We()), (n == null ? void 0 : n.name) === "Safari" && ht(n.version, "18.3") > 0 || (n == null ? void 0 : n.os) === "iOS" && !!(n == null ? void 0 : n.osVersion) && ht(n.osVersion, "18.3") > 0;
  }
  function lc() {
    var n, e;
    return Ge() ? (e = (n = navigator.userAgentData) === null || n === void 0 ? void 0 : n.mobile) !== null && e !== void 0 ? e : /Tablet|iPad|Mobile|Android|BlackBerry/.test(navigator.userAgent) : false;
  }
  function Tu() {
    const n = We(), e = "17.2";
    if (n) return n.name !== "Safari" && n.os !== "iOS" || n.os === "iOS" && n.osVersion && ht(n.osVersion, e) >= 0 ? true : n.name === "Safari" && ht(n.version, e) >= 0;
  }
  function Ge() {
    return typeof document < "u";
  }
  function ut() {
    return navigator.product == "ReactNative";
  }
  function Ri(n) {
    return n.hostname.endsWith(".livekit.cloud") || n.hostname.endsWith(".livekit.run");
  }
  function Qn(n) {
    return Ri(n) ? n.hostname.split(".")[0] : null;
  }
  function uc() {
    if (global && global.LiveKitReactNativeGlobal) return global.LiveKitReactNativeGlobal;
  }
  function hc() {
    if (!ut()) return;
    let n = uc();
    if (n) return n.platform;
  }
  function Qr() {
    if (Ge()) return window.devicePixelRatio;
    if (ut()) {
      let n = uc();
      if (n) return n.devicePixelRatio;
    }
    return 1;
  }
  function ht(n, e) {
    const t = n.split("."), i = e.split("."), s = Math.min(t.length, i.length);
    for (let r = 0; r < s; ++r) {
      const o = parseInt(t[r], 10), a = parseInt(i[r], 10);
      if (o > a) return 1;
      if (o < a) return -1;
      if (r === s - 1 && o === a) return 0;
    }
    return n === "" && e !== "" ? -1 : e === "" ? 1 : t.length == i.length ? 0 : t.length < i.length ? -1 : 1;
  }
  function Cu(n) {
    for (const e of n) e.target.handleResize(e);
  }
  function wu(n) {
    for (const e of n) e.target.handleVisibilityChanged(e);
  }
  let Yn = null;
  const Yr = () => (Yn || (Yn = new ResizeObserver(Cu)), Yn);
  let Xn = null;
  const Xr = () => (Xn || (Xn = new IntersectionObserver(wu, {
    root: null,
    rootMargin: "0px"
  })), Xn);
  function Eu() {
    var n;
    const e = new oo({
      sdk: co.JS,
      protocol: eu,
      version: Zl
    });
    return ut() && (e.os = (n = hc()) !== null && n !== void 0 ? n : ""), e;
  }
  function Zr() {
    let n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 16, e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 16, t = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false, i = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : false;
    const s = document.createElement("canvas");
    s.width = n, s.height = e;
    const r = s.getContext("2d");
    r == null ? void 0 : r.fillRect(0, 0, s.width, s.height), i && r && (r.beginPath(), r.arc(n / 2, e / 2, 50, 0, Math.PI * 2, true), r.closePath(), r.fillStyle = "grey", r.fill());
    const o = s.captureStream(), [a] = o.getTracks();
    if (!a) throw Error("Could not get empty media stream video track");
    return a.enabled = t, a;
  }
  let Ui;
  function Zn() {
    if (!Ui) {
      const n = new AudioContext(), e = n.createOscillator(), t = n.createGain();
      t.gain.setValueAtTime(0, 0);
      const i = n.createMediaStreamDestination();
      if (e.connect(t), t.connect(i), e.start(), [Ui] = i.stream.getAudioTracks(), !Ui) throw Error("Could not get empty media stream audio track");
      Ui.enabled = false;
    }
    return Ui.clone();
  }
  class $e {
    get isResolved() {
      return this._isResolved;
    }
    constructor(e, t) {
      this._isResolved = false, this.onFinally = t, this.promise = new Promise((i, s) => p(this, void 0, void 0, function* () {
        this.resolve = i, this.reject = s, e && (yield e(i, s));
      })).finally(() => {
        var i;
        this._isResolved = true, (i = this.onFinally) === null || i === void 0 || i.call(this);
      });
    }
  }
  function Ru(n) {
    return su.includes(n);
  }
  function Ft(n) {
    if (typeof n == "string" || typeof n == "number") return n;
    if (Array.isArray(n)) return n[0];
    if (n.exact !== void 0) return Array.isArray(n.exact) ? n.exact[0] : n.exact;
    if (n.ideal !== void 0) return Array.isArray(n.ideal) ? n.ideal[0] : n.ideal;
    throw Error("could not unwrap constraint");
  }
  function Pu(n) {
    return n.startsWith("http") ? n.replace(/^(http)/, "ws") : n;
  }
  function Xi(n) {
    return n.startsWith("ws") ? n.replace(/^(ws)/, "http") : n;
  }
  function _u(n, e) {
    return n.segments.map((t) => {
      let { id: i, text: s, language: r, startTime: o, endTime: a, final: c } = t;
      var d;
      const l = (d = e.get(i)) !== null && d !== void 0 ? d : Date.now(), u = Date.now();
      return c ? e.delete(i) : e.set(i, l), {
        id: i,
        text: s,
        startTime: Number.parseInt(o.toString()),
        endTime: Number.parseInt(a.toString()),
        final: c,
        language: r,
        firstReceivedTime: l,
        lastReceivedTime: u
      };
    });
  }
  function Iu(n) {
    const { id: e, timestamp: t, message: i, editTimestamp: s } = n;
    return {
      id: e,
      timestamp: Number.parseInt(t.toString()),
      editTimestamp: s ? Number.parseInt(s.toString()) : void 0,
      message: i
    };
  }
  function ea(n) {
    switch (n.reason) {
      case ce.LeaveRequest:
        return n.context;
      case ce.Cancelled:
        return rt.CLIENT_INITIATED;
      case ce.NotAllowed:
        return rt.USER_REJECTED;
      case ce.ServerUnreachable:
        return rt.JOIN_FAILURE;
      default:
        return rt.UNKNOWN_REASON;
    }
  }
  function yn(n) {
    return n !== void 0 ? Number(n) : void 0;
  }
  function ei(n) {
    return n !== void 0 ? BigInt(n) : void 0;
  }
  function Ti(n) {
    return !!n && !(n instanceof MediaStreamTrack) && n.isLocal;
  }
  function lt(n) {
    return !!n && n.kind == C.Kind.Audio;
  }
  function Wt(n) {
    return !!n && n.kind == C.Kind.Video;
  }
  function xt(n) {
    return Ti(n) && Wt(n);
  }
  function vt(n) {
    return Ti(n) && lt(n);
  }
  function Is(n) {
    return !!n && !n.isLocal;
  }
  function xu(n) {
    return !!n && !n.isLocal;
  }
  function es(n) {
    return Is(n) && Wt(n);
  }
  function Mu(n) {
    return n.isLocal;
  }
  function Ou(n, e) {
    const t = [];
    let i = new TextEncoder().encode(n);
    for (; i.length > e; ) {
      let s = e;
      for (; s > 0; ) {
        const r = i[s];
        if (r !== void 0 && (r & 192) !== 128) break;
        s--;
      }
      t.push(i.slice(0, s)), i = i.slice(s);
    }
    return i.length > 0 && t.push(i), t;
  }
  function Du(n) {
    var e;
    const t = n.get("Cache-Control");
    if (t) {
      const i = (e = t.match(/(?:^|[,\s])max-age=(\d+)/)) === null || e === void 0 ? void 0 : e[1];
      if (i) return parseInt(i, 10);
    }
  }
  function Au(n, e) {
    let t = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false;
    const i = Nu(n, e);
    return t ? i : tr(i, "v1");
  }
  function Nu(n, e) {
    const t = new URL(Pu(n));
    return e.forEach((i, s) => {
      t.searchParams.set(s, i);
    }), tr(t, "rtc");
  }
  function Lu(n) {
    const e = new URL(Xi(n));
    return tr(e, "validate");
  }
  function pc(n) {
    return n.endsWith("/") ? n : "".concat(n, "/");
  }
  function tr(n, e) {
    return n.pathname = "".concat(pc(n.pathname)).concat(e), n;
  }
  function ta(n) {
    if (typeof n == "string") return Dr.fromJson(JSON.parse(n), {
      ignoreUnknownFields: true
    });
    if (n instanceof ArrayBuffer) return Dr.fromBinary(new Uint8Array(n));
    throw new Error("could not decode websocket message: ".concat(typeof n));
  }
  function Uu(n) {
    let e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "Unknown reason";
    if (!(n instanceof AbortSignal)) return e;
    const t = n.reason;
    switch (typeof t) {
      case "string":
        return t;
      case "object":
        return t instanceof Error ? t.message : e;
      default:
        return "toString" in t ? t.toString() : e;
    }
  }
  const ju = 10, ji = "lk_e2ee", Fu = "LKFrameEncryptionKey", Bu = {
    sharedKey: false,
    ratchetSalt: Fu,
    ratchetWindowSize: 8,
    failureTolerance: ju,
    keyringSize: 16
  };
  var Bt;
  (function(n) {
    n.SetKey = "setKey", n.RatchetRequest = "ratchetRequest", n.KeyRatcheted = "keyRatcheted";
  })(Bt || (Bt = {}));
  var ia;
  (function(n) {
    n.KeyRatcheted = "keyRatcheted";
  })(ia || (ia = {}));
  var Ut;
  (function(n) {
    n.ParticipantEncryptionStatusChanged = "participantEncryptionStatusChanged", n.EncryptionError = "encryptionError";
  })(Ut || (Ut = {}));
  var na;
  (function(n) {
    n.Error = "cryptorError";
  })(na || (na = {}));
  function Vu() {
    return qu() || xs();
  }
  function xs() {
    return typeof window.RTCRtpScriptTransform < "u";
  }
  function qu() {
    return typeof window.RTCRtpSender < "u" && typeof window.RTCRtpSender.prototype.createEncodedStreams < "u";
  }
  function Gu(n) {
    return p(this, void 0, void 0, function* () {
      let e = new TextEncoder();
      return yield crypto.subtle.importKey("raw", e.encode(n), {
        name: "PBKDF2"
      }, false, [
        "deriveBits",
        "deriveKey"
      ]);
    });
  }
  function Wu(n) {
    return p(this, void 0, void 0, function* () {
      return yield crypto.subtle.importKey("raw", n, "HKDF", false, [
        "deriveBits",
        "deriveKey"
      ]);
    });
  }
  function Ku(n) {
    var e, t, i, s, r;
    if (((e = n.value) === null || e === void 0 ? void 0 : e.case) !== "sipDtmf" && ((t = n.value) === null || t === void 0 ? void 0 : t.case) !== "metrics" && ((i = n.value) === null || i === void 0 ? void 0 : i.case) !== "speaker" && ((s = n.value) === null || s === void 0 ? void 0 : s.case) !== "transcription" && ((r = n.value) === null || r === void 0 ? void 0 : r.case) !== "encryptedPacket") return new eo({
      value: n.value
    });
  }
  class Hu extends pt.EventEmitter {
    constructor() {
      let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
      super(), this.onKeyRatcheted = (t, i, s) => {
        H.debug("key ratcheted event received", {
          ratchetResult: t,
          participantId: i,
          keyIndex: s
        });
      }, this.keyInfoMap = /* @__PURE__ */ new Map(), this.options = Object.assign(Object.assign({}, Bu), e), this.on(Bt.KeyRatcheted, this.onKeyRatcheted);
    }
    onSetEncryptionKey(e, t, i) {
      const s = {
        key: e,
        participantIdentity: t,
        keyIndex: i
      };
      if (!this.options.sharedKey && !t) throw new Error("participant identity needs to be passed for encryption key if sharedKey option is false");
      this.keyInfoMap.set("".concat(t ?? "shared", "-").concat(i ?? 0), s), this.emit(Bt.SetKey, s);
    }
    getKeys() {
      return Array.from(this.keyInfoMap.values());
    }
    getOptions() {
      return this.options;
    }
    ratchetKey(e, t) {
      this.emit(Bt.RatchetRequest, e, t);
    }
  }
  class Ju extends Hu {
    constructor() {
      let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
      const t = Object.assign(Object.assign({}, e), {
        sharedKey: true,
        ratchetWindowSize: 0,
        failureTolerance: -1
      });
      super(t);
    }
    setKey(e) {
      return p(this, void 0, void 0, function* () {
        const t = typeof e == "string" ? yield Gu(e) : yield Wu(e);
        this.onSetEncryptionKey(t);
      });
    }
  }
  var sa;
  (function(n) {
    n[n.InvalidKey = 0] = "InvalidKey", n[n.MissingKey = 1] = "MissingKey", n[n.InternalError = 2] = "InternalError";
  })(sa || (sa = {}));
  class zu extends pt.EventEmitter {
    constructor(e, t) {
      super(), this.decryptDataRequests = /* @__PURE__ */ new Map(), this.encryptDataRequests = /* @__PURE__ */ new Map(), this.onWorkerMessage = (i) => {
        var s, r;
        const { kind: o, data: a } = i.data;
        switch (o) {
          case "error":
            if (H.error(a.error.message), a.uuid) {
              const l = this.decryptDataRequests.get(a.uuid);
              if (l == null ? void 0 : l.reject) {
                l.reject(a.error);
                break;
              }
              const u = this.encryptDataRequests.get(a.uuid);
              if (u == null ? void 0 : u.reject) {
                u.reject(a.error);
                break;
              }
            }
            this.emit(Ut.EncryptionError, a.error, a.participantIdentity);
            break;
          case "initAck":
            a.enabled && this.keyProvider.getKeys().forEach((l) => {
              this.postKey(l);
            });
            break;
          case "enable":
            if (a.enabled && this.keyProvider.getKeys().forEach((l) => {
              this.postKey(l);
            }), this.encryptionEnabled !== a.enabled && a.participantIdentity === ((s = this.room) === null || s === void 0 ? void 0 : s.localParticipant.identity)) this.emit(Ut.ParticipantEncryptionStatusChanged, a.enabled, this.room.localParticipant), this.encryptionEnabled = a.enabled;
            else if (a.participantIdentity) {
              const l = (r = this.room) === null || r === void 0 ? void 0 : r.getParticipantByIdentity(a.participantIdentity);
              if (!l) throw TypeError("couldn't set encryption status, participant not found".concat(a.participantIdentity));
              this.emit(Ut.ParticipantEncryptionStatusChanged, a.enabled, l);
            }
            break;
          case "ratchetKey":
            this.keyProvider.emit(Bt.KeyRatcheted, a.ratchetResult, a.participantIdentity, a.keyIndex);
            break;
          case "decryptDataResponse":
            const c = this.decryptDataRequests.get(a.uuid);
            (c == null ? void 0 : c.resolve) && c.resolve(a);
            break;
          case "encryptDataResponse":
            const d = this.encryptDataRequests.get(a.uuid);
            (d == null ? void 0 : d.resolve) && d.resolve(a);
            break;
        }
      }, this.onWorkerError = (i) => {
        H.error("e2ee worker encountered an error:", {
          error: i.error
        }), this.emit(Ut.EncryptionError, i.error, void 0);
      }, this.keyProvider = e.keyProvider, this.worker = e.worker, this.encryptionEnabled = false, this.dataChannelEncryptionEnabled = t;
    }
    get isEnabled() {
      return this.encryptionEnabled;
    }
    get isDataChannelEncryptionEnabled() {
      return this.isEnabled && this.dataChannelEncryptionEnabled;
    }
    setup(e) {
      if (!Vu()) throw new Xs("tried to setup end-to-end encryption on an unsupported browser");
      if (H.info("setting up e2ee"), e !== this.room) {
        this.room = e, this.setupEventListeners(e, this.keyProvider);
        const t = {
          kind: "init",
          data: {
            keyProviderOptions: this.keyProvider.getOptions(),
            loglevel: Ul.getLevel()
          }
        };
        this.worker && (H.info("initializing worker", {
          worker: this.worker
        }), this.worker.onmessage = this.onWorkerMessage, this.worker.onerror = this.onWorkerError, this.worker.postMessage(t));
      }
    }
    setParticipantCryptorEnabled(e, t) {
      H.debug("set e2ee to ".concat(e, " for participant ").concat(t)), this.postEnable(e, t);
    }
    setSifTrailer(e) {
      !e || e.length === 0 ? H.warn("ignoring server sent trailer as it's empty") : this.postSifTrailer(e);
    }
    setupEngine(e) {
      e.on(M.RTPVideoMapUpdate, (t) => {
        this.postRTPMap(t);
      });
    }
    setupEventListeners(e, t) {
      e.on(R.TrackPublished, (i, s) => this.setParticipantCryptorEnabled(i.trackInfo.encryption !== ge.NONE, s.identity)), e.on(R.ConnectionStateChanged, (i) => {
        i === ie.Connected && e.remoteParticipants.forEach((s) => {
          s.trackPublications.forEach((r) => {
            this.setParticipantCryptorEnabled(r.trackInfo.encryption !== ge.NONE, s.identity);
          });
        });
      }).on(R.TrackUnsubscribed, (i, s, r) => {
        var o;
        const a = {
          kind: "removeTransform",
          data: {
            participantIdentity: r.identity,
            trackId: i.mediaStreamID
          }
        };
        (o = this.worker) === null || o === void 0 || o.postMessage(a);
      }).on(R.TrackSubscribed, (i, s, r) => {
        this.setupE2EEReceiver(i, r.identity, s.trackInfo);
      }).on(R.SignalConnected, () => {
        if (!this.room) throw new TypeError("expected room to be present on signal connect");
        t.getKeys().forEach((i) => {
          this.postKey(i);
        }), this.setParticipantCryptorEnabled(this.room.localParticipant.isE2EEEnabled, this.room.localParticipant.identity);
      }), e.localParticipant.on(O.LocalSenderCreated, (i, s) => p(this, void 0, void 0, function* () {
        this.setupE2EESender(s, i);
      })), e.localParticipant.on(O.LocalTrackPublished, (i) => {
        if (!Wt(i.track) || !Yi()) return;
        const s = {
          kind: "updateCodec",
          data: {
            trackId: i.track.mediaStreamID,
            codec: Ki(i.trackInfo.codecs[0].mimeType),
            participantIdentity: this.room.localParticipant.identity
          }
        };
        this.worker.postMessage(s);
      }), t.on(Bt.SetKey, (i) => this.postKey(i)).on(Bt.RatchetRequest, (i, s) => this.postRatchetRequest(i, s));
    }
    encryptData(e) {
      return p(this, void 0, void 0, function* () {
        if (!this.worker) throw Error("could not encrypt data, worker is missing");
        const t = crypto.randomUUID(), i = {
          kind: "encryptDataRequest",
          data: {
            uuid: t,
            payload: e,
            participantIdentity: this.room.localParticipant.identity
          }
        }, s = new $e();
        return s.onFinally = () => {
          this.encryptDataRequests.delete(t);
        }, this.encryptDataRequests.set(t, s), this.worker.postMessage(i), s.promise;
      });
    }
    handleEncryptedData(e, t, i, s) {
      if (!this.worker) throw Error("could not handle encrypted data, worker is missing");
      const r = crypto.randomUUID(), o = {
        kind: "decryptDataRequest",
        data: {
          uuid: r,
          payload: e,
          iv: t,
          participantIdentity: i,
          keyIndex: s
        }
      }, a = new $e();
      return a.onFinally = () => {
        this.decryptDataRequests.delete(r);
      }, this.decryptDataRequests.set(r, a), this.worker.postMessage(o), a.promise;
    }
    postRatchetRequest(e, t) {
      if (!this.worker) throw Error("could not ratchet key, worker is missing");
      const i = {
        kind: "ratchetRequest",
        data: {
          participantIdentity: e,
          keyIndex: t
        }
      };
      this.worker.postMessage(i);
    }
    postKey(e) {
      let { key: t, participantIdentity: i, keyIndex: s } = e;
      var r;
      if (!this.worker) throw Error("could not set key, worker is missing");
      const o = {
        kind: "setKey",
        data: {
          participantIdentity: i,
          isPublisher: i === ((r = this.room) === null || r === void 0 ? void 0 : r.localParticipant.identity),
          key: t,
          keyIndex: s
        }
      };
      this.worker.postMessage(o);
    }
    postEnable(e, t) {
      if (this.worker) {
        const i = {
          kind: "enable",
          data: {
            enabled: e,
            participantIdentity: t
          }
        };
        this.worker.postMessage(i);
      } else throw new ReferenceError("failed to enable e2ee, worker is not ready");
    }
    postRTPMap(e) {
      var t;
      if (!this.worker) throw TypeError("could not post rtp map, worker is missing");
      if (!(!((t = this.room) === null || t === void 0) && t.localParticipant.identity)) throw TypeError("could not post rtp map, local participant identity is missing");
      const i = {
        kind: "setRTPMap",
        data: {
          map: e,
          participantIdentity: this.room.localParticipant.identity
        }
      };
      this.worker.postMessage(i);
    }
    postSifTrailer(e) {
      if (!this.worker) throw Error("could not post SIF trailer, worker is missing");
      const t = {
        kind: "setSifTrailer",
        data: {
          trailer: e
        }
      };
      this.worker.postMessage(t);
    }
    setupE2EEReceiver(e, t, i) {
      if (e.receiver) {
        if (!(i == null ? void 0 : i.mimeType) || i.mimeType === "") throw new TypeError("MimeType missing from trackInfo, cannot set up E2EE cryptor");
        this.handleReceiver(e.receiver, e.mediaStreamID, t, e.kind === "video" ? Ki(i.mimeType) : void 0);
      }
    }
    setupE2EESender(e, t) {
      if (!Ti(e) || !t) {
        t || H.warn("early return because sender is not ready");
        return;
      }
      this.handleSender(t, e.mediaStreamID, void 0);
    }
    handleReceiver(e, t, i, s) {
      return p(this, void 0, void 0, function* () {
        if (this.worker) {
          if (xs() && !$r()) {
            const r = {
              kind: "decode",
              participantIdentity: i,
              trackId: t,
              codec: s
            };
            e.transform = new RTCRtpScriptTransform(this.worker, r);
          } else {
            if (ji in e && s) {
              const c = {
                kind: "updateCodec",
                data: {
                  trackId: t,
                  codec: s,
                  participantIdentity: i
                }
              };
              this.worker.postMessage(c);
              return;
            }
            let r = e.writableStream, o = e.readableStream;
            if (!r || !o) {
              const c = e.createEncodedStreams();
              e.writableStream = c.writable, r = c.writable, e.readableStream = c.readable, o = c.readable;
            }
            const a = {
              kind: "decode",
              data: {
                readableStream: o,
                writableStream: r,
                trackId: t,
                codec: s,
                participantIdentity: i,
                isReuse: ji in e
              }
            };
            this.worker.postMessage(a, [
              o,
              r
            ]);
          }
          e[ji] = true;
        }
      });
    }
    handleSender(e, t, i) {
      var s;
      if (!(ji in e || !this.worker)) {
        if (!(!((s = this.room) === null || s === void 0) && s.localParticipant.identity) || this.room.localParticipant.identity === "") throw TypeError("local identity needs to be known in order to set up encrypted sender");
        if (xs() && !$r()) {
          H.info("initialize script transform");
          const r = {
            kind: "encode",
            participantIdentity: this.room.localParticipant.identity,
            trackId: t,
            codec: i
          };
          e.transform = new RTCRtpScriptTransform(this.worker, r);
        } else {
          H.info("initialize encoded streams");
          const r = e.createEncodedStreams(), o = {
            kind: "encode",
            data: {
              readableStream: r.readable,
              writableStream: r.writable,
              codec: i,
              trackId: t,
              participantIdentity: this.room.localParticipant.identity,
              isReuse: false
            }
          };
          this.worker.postMessage(o, [
            r.readable,
            r.writable
          ]);
        }
        e[ji] = true;
      }
    }
  }
  const $u = 500, Qu = 15e3;
  class Ci {
    constructor() {
      this.failedConnectionAttempts = /* @__PURE__ */ new Map(), this.backOffPromises = /* @__PURE__ */ new Map();
    }
    static getInstance() {
      return this._instance || (this._instance = new Ci()), this._instance;
    }
    addFailedConnectionAttempt(e) {
      var t;
      const i = new URL(e), s = Qn(i);
      if (!s) return;
      let r = (t = this.failedConnectionAttempts.get(s)) !== null && t !== void 0 ? t : 0;
      this.failedConnectionAttempts.set(s, r + 1), this.backOffPromises.set(s, xe(Math.min($u * Math.pow(2, r), Qu)));
    }
    getBackOffPromise(e) {
      const t = new URL(e), i = t && Qn(t);
      return i && this.backOffPromises.get(i) || Promise.resolve();
    }
    resetFailedConnectionAttempts(e) {
      const t = new URL(e), i = t && Qn(t);
      i && (this.failedConnectionAttempts.set(i, 0), this.backOffPromises.set(i, Promise.resolve()));
    }
    resetAll() {
      this.backOffPromises.clear(), this.failedConnectionAttempts.clear();
    }
  }
  Ci._instance = null;
  const ts = "default";
  class Ee {
    constructor() {
      this._previousDevices = [];
    }
    static getInstance() {
      return this.instance === void 0 && (this.instance = new Ee()), this.instance;
    }
    get previousDevices() {
      return this._previousDevices;
    }
    getDevices(e) {
      return p(this, arguments, void 0, function(t) {
        var i = this;
        let s = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true;
        return function* () {
          var r;
          if (((r = Ee.userMediaPromiseMap) === null || r === void 0 ? void 0 : r.size) > 0) {
            H.debug("awaiting getUserMedia promise");
            try {
              t ? yield Ee.userMediaPromiseMap.get(t) : yield Promise.all(Ee.userMediaPromiseMap.values());
            } catch {
              H.warn("error waiting for media permissons");
            }
          }
          let o = yield navigator.mediaDevices.enumerateDevices();
          if (s && !(si() && i.hasDeviceInUse(t)) && (o.filter((c) => c.kind === t).length === 0 || o.some((c) => {
            const d = c.label === "", l = t ? c.kind === t : true;
            return d && l;
          }))) {
            const c = {
              video: t !== "audioinput" && t !== "audiooutput",
              audio: t !== "videoinput" && {
                deviceId: {
                  ideal: "default"
                }
              }
            }, d = yield navigator.mediaDevices.getUserMedia(c);
            o = yield navigator.mediaDevices.enumerateDevices(), d.getTracks().forEach((l) => {
              l.stop();
            });
          }
          return i._previousDevices = o, t && (o = o.filter((a) => a.kind === t)), o;
        }();
      });
    }
    normalizeDeviceId(e, t, i) {
      return p(this, void 0, void 0, function* () {
        if (t !== ts) return t;
        const s = yield this.getDevices(e), r = s.find((a) => a.deviceId === ts);
        if (!r) {
          H.warn("could not reliably determine default device");
          return;
        }
        const o = s.find((a) => a.deviceId !== ts && a.groupId === (i ?? r.groupId));
        if (!o) {
          H.warn("could not reliably determine default device");
          return;
        }
        return o == null ? void 0 : o.deviceId;
      });
    }
    hasDeviceInUse(e) {
      return e ? Ee.userMediaPromiseMap.has(e) : Ee.userMediaPromiseMap.size > 0;
    }
  }
  Ee.mediaDeviceKinds = [
    "audioinput",
    "audiooutput",
    "videoinput"
  ];
  Ee.userMediaPromiseMap = /* @__PURE__ */ new Map();
  var Hi;
  (function(n) {
    n[n.WAITING = 0] = "WAITING", n[n.RUNNING = 1] = "RUNNING", n[n.COMPLETED = 2] = "COMPLETED";
  })(Hi || (Hi = {}));
  class Yu {
    constructor() {
      this.pendingTasks = /* @__PURE__ */ new Map(), this.taskMutex = new je(), this.nextTaskIndex = 0;
    }
    run(e) {
      return p(this, void 0, void 0, function* () {
        const t = {
          id: this.nextTaskIndex++,
          enqueuedAt: Date.now(),
          status: Hi.WAITING
        };
        this.pendingTasks.set(t.id, t);
        const i = yield this.taskMutex.lock();
        try {
          return t.executedAt = Date.now(), t.status = Hi.RUNNING, yield e();
        } finally {
          t.status = Hi.COMPLETED, this.pendingTasks.delete(t.id), i();
        }
      });
    }
    flush() {
      return p(this, void 0, void 0, function* () {
        return this.run(() => p(this, void 0, void 0, function* () {
        }));
      });
    }
    snapshot() {
      return Array.from(this.pendingTasks.values());
    }
  }
  class Xu {
    get readyState() {
      return this.ws.readyState;
    }
    constructor(e) {
      let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      var i, s;
      if (!((i = t.signal) === null || i === void 0) && i.aborted) throw new DOMException("This operation was aborted", "AbortError");
      this.url = e;
      const r = new WebSocket(e, (s = t.protocols) !== null && s !== void 0 ? s : []);
      r.binaryType = "arraybuffer", this.ws = r;
      const o = function() {
        let { closeCode: a, reason: c } = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
        return r.close(a, c);
      };
      this.opened = new Ae((a, c) => {
        const d = () => {
          c(F.websocket("Encountered websocket error during connection establishment"));
        };
        r.onopen = () => {
          a({
            readable: new ReadableStream({
              start(l) {
                r.onmessage = (u) => {
                  let { data: h } = u;
                  return l.enqueue(h);
                }, r.onerror = (u) => l.error(u);
              },
              cancel: o
            }),
            writable: new WritableStream({
              write(l) {
                r.send(l);
              },
              abort() {
                r.close();
              },
              close: o
            }),
            protocol: r.protocol,
            extensions: r.extensions
          }), r.removeEventListener("error", d);
        }, r.addEventListener("error", d);
      }), this.closed = new Ae((a, c) => {
        const d = () => p(this, void 0, void 0, function* () {
          const l = new Ae((h) => {
            r.readyState !== WebSocket.CLOSED && r.addEventListener("close", (m) => {
              h(m);
            }, {
              once: true
            });
          }), u = yield Ae.race([
            xe(250),
            l
          ]);
          u ? a(u) : c(F.websocket("Encountered unspecified websocket error without a timely close event"));
        });
        r.onclose = (l) => {
          let { code: u, reason: h } = l;
          a({
            closeCode: u,
            reason: h
          }), r.removeEventListener("error", d);
        }, r.addEventListener("error", d);
      }), t.signal && (t.signal.onabort = () => r.close()), this.close = o;
    }
  }
  const Zu = [
    "syncState",
    "trickle",
    "offer",
    "answer",
    "simulate",
    "leave"
  ];
  function eh(n) {
    const e = Zu.indexOf(n.case) >= 0;
    return H.trace("request allowed to bypass queue:", {
      canPass: e,
      req: n
    }), e;
  }
  var oe;
  (function(n) {
    n[n.CONNECTING = 0] = "CONNECTING", n[n.CONNECTED = 1] = "CONNECTED", n[n.RECONNECTING = 2] = "RECONNECTING", n[n.DISCONNECTING = 3] = "DISCONNECTING", n[n.DISCONNECTED = 4] = "DISCONNECTED";
  })(oe || (oe = {}));
  const th = 250;
  class ir {
    get currentState() {
      return this.state;
    }
    get isDisconnected() {
      return this.state === oe.DISCONNECTING || this.state === oe.DISCONNECTED;
    }
    get isEstablishingConnection() {
      return this.state === oe.CONNECTING || this.state === oe.RECONNECTING;
    }
    getNextRequestId() {
      return this._requestId += 1, this._requestId;
    }
    constructor() {
      let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : false, t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      var i;
      this.rtt = 0, this.state = oe.DISCONNECTED, this.log = H, this._requestId = 0, this.useV0SignalPath = false, this.resetCallbacks = () => {
        this.onAnswer = void 0, this.onLeave = void 0, this.onLocalTrackPublished = void 0, this.onLocalTrackUnpublished = void 0, this.onNegotiateRequested = void 0, this.onOffer = void 0, this.onRemoteMuteChanged = void 0, this.onSubscribedQualityUpdate = void 0, this.onTokenRefresh = void 0, this.onTrickle = void 0, this.onClose = void 0, this.onMediaSectionsRequirement = void 0;
      }, this.log = wt((i = t.loggerName) !== null && i !== void 0 ? i : at.Signal), this.loggerContextCb = t.loggerContextCb, this.useJSON = e, this.requestQueue = new Yu(), this.queuedRequests = [], this.closingLock = new je(), this.connectionLock = new je(), this.state = oe.DISCONNECTED;
    }
    get logContext() {
      var e, t;
      return (t = (e = this.loggerContextCb) === null || e === void 0 ? void 0 : e.call(this)) !== null && t !== void 0 ? t : {};
    }
    join(e, t, i, s) {
      return p(this, arguments, void 0, function(r, o, a, c) {
        var d = this;
        let l = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : false;
        return function* () {
          return d.state = oe.CONNECTING, d.options = a, yield d.connect(r, o, a, c, l);
        }();
      });
    }
    reconnect(e, t, i, s) {
      return p(this, void 0, void 0, function* () {
        if (!this.options) {
          this.log.warn("attempted to reconnect without signal options being set, ignoring", this.logContext);
          return;
        }
        return this.state = oe.RECONNECTING, this.clearPingInterval(), yield this.connect(e, t, Object.assign(Object.assign({}, this.options), {
          reconnect: true,
          sid: i,
          reconnectReason: s
        }), void 0, this.useV0SignalPath);
      });
    }
    connect(e, t, i, s) {
      return p(this, arguments, void 0, function(r, o, a, c) {
        var d = this;
        let l = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : false;
        return function* () {
          const u = yield d.connectionLock.lock();
          d.connectOptions = a, d.useV0SignalPath = l;
          const h = Eu(), m = l ? ih(o, h, a) : nh(o, h, a), v = Au(r, m, l).toString(), g = Lu(v).toString();
          return new Promise((T, S) => p(d, void 0, void 0, function* () {
            var I, P;
            try {
              let b = false;
              const k = (N) => p(this, void 0, void 0, function* () {
                if (b) return;
                b = true;
                const L = N instanceof Event ? N.currentTarget : N, q = Uu(L, "Abort handler called");
                this.streamWriter && !this.isDisconnected ? this.sendLeave().then(() => this.close(q)).catch((ne) => {
                  this.log.error(ne), this.close();
                }) : this.close(), w(), S(F.cancelled(q));
              });
              c == null ? void 0 : c.addEventListener("abort", k);
              const w = () => {
                clearTimeout(A), c == null ? void 0 : c.removeEventListener("abort", k);
              }, A = setTimeout(() => {
                k(F.timeout("room connection has timed out (signal)"));
              }, a.websocketTimeout), U = (N, L) => {
                this.handleSignalConnected(N, A, L);
              }, D = new URL(v);
              D.searchParams.has("access_token") && D.searchParams.set("access_token", "<redacted>"), this.log.debug("connecting to ".concat(D), Object.assign({
                reconnect: a.reconnect,
                reconnectReason: a.reconnectReason
              }, this.logContext)), this.ws && (yield this.close(false)), this.ws = new Xu(v);
              try {
                this.ws.closed.then((B) => {
                  var de;
                  this.isEstablishingConnection && S(F.internal("Websocket got closed during a (re)connection attempt: ".concat(B.reason))), B.closeCode !== 1e3 && (this.log.warn("websocket closed", Object.assign(Object.assign({}, this.logContext), {
                    reason: B.reason,
                    code: B.closeCode,
                    wasClean: B.closeCode === 1e3,
                    state: this.state
                  })), this.state === oe.CONNECTED && this.handleOnClose((de = B.reason) !== null && de !== void 0 ? de : "Unexpected WS error"));
                }).catch((B) => {
                  this.isEstablishingConnection && S(F.internal("Websocket error during a (re)connection attempt: ".concat(B)));
                });
                const N = yield this.ws.opened.catch((B) => p(this, void 0, void 0, function* () {
                  if (this.state !== oe.CONNECTED) {
                    this.state = oe.DISCONNECTED, clearTimeout(A);
                    const de = yield this.handleConnectionError(B, g);
                    S(de);
                    return;
                  }
                  this.handleWSError(B), S(B);
                }));
                if (clearTimeout(A), !N) return;
                const L = N.readable.getReader();
                this.streamWriter = N.writable.getWriter();
                const q = yield L.read();
                if (L.releaseLock(), !q.value) throw F.internal("no message received as first message");
                const ne = ta(q.value), ye = this.validateFirstMessage(ne, (I = a.reconnect) !== null && I !== void 0 ? I : false);
                if (!ye.isValid) {
                  S(ye.error);
                  return;
                }
                ((P = ne.message) === null || P === void 0 ? void 0 : P.case) === "join" && (this.pingTimeoutDuration = ne.message.value.pingTimeout, this.pingIntervalDuration = ne.message.value.pingInterval, this.pingTimeoutDuration && this.pingTimeoutDuration > 0 && this.log.debug("ping config", Object.assign(Object.assign({}, this.logContext), {
                  timeout: this.pingTimeoutDuration,
                  interval: this.pingIntervalDuration
                })));
                const Qe = ye.shouldProcessFirstMessage ? ne : void 0;
                U(N, Qe), T(ye.response);
              } catch (N) {
                S(N);
              } finally {
                w();
              }
            } finally {
              u();
            }
          }));
        }();
      });
    }
    startReadingLoop(e, t) {
      return p(this, void 0, void 0, function* () {
        for (t && this.handleSignalResponse(t); ; ) {
          this.signalLatency && (yield xe(this.signalLatency));
          const { done: i, value: s } = yield e.read();
          if (i) break;
          const r = ta(s);
          this.handleSignalResponse(r);
        }
      });
    }
    close() {
      return p(this, arguments, void 0, function() {
        var e = this;
        let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : true, i = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "Close method called on signal client";
        return function* () {
          if ([
            oe.DISCONNECTING || oe.DISCONNECTED
          ].includes(e.state)) {
            e.log.debug("ignoring signal close as it's already in disconnecting state");
            return;
          }
          const s = yield e.closingLock.lock();
          try {
            if (e.clearPingInterval(), t && (e.state = oe.DISCONNECTING), e.ws) {
              e.ws.close({
                closeCode: 1e3,
                reason: i
              });
              const r = e.ws.closed;
              e.ws = void 0, e.streamWriter = void 0, yield Promise.race([
                r,
                xe(th)
              ]);
            }
          } catch (r) {
            e.log.debug("websocket error while closing", Object.assign(Object.assign({}, e.logContext), {
              error: r
            }));
          } finally {
            t && (e.state = oe.DISCONNECTED), s();
          }
        }();
      });
    }
    sendOffer(e, t) {
      this.log.debug("sending offer", Object.assign(Object.assign({}, this.logContext), {
        offerSdp: e.sdp
      })), this.sendRequest({
        case: "offer",
        value: mi(e, t)
      });
    }
    sendAnswer(e, t) {
      return this.log.debug("sending answer", Object.assign(Object.assign({}, this.logContext), {
        answerSdp: e.sdp
      })), this.sendRequest({
        case: "answer",
        value: mi(e, t)
      });
    }
    sendIceCandidate(e, t) {
      return this.log.debug("sending ice candidate", Object.assign(Object.assign({}, this.logContext), {
        candidate: e
      })), this.sendRequest({
        case: "trickle",
        value: new Dn({
          candidateInit: JSON.stringify(e),
          target: t
        })
      });
    }
    sendMuteTrack(e, t) {
      return this.sendRequest({
        case: "mute",
        value: new An({
          sid: e,
          muted: t
        })
      });
    }
    sendAddTrack(e) {
      return this.sendRequest({
        case: "addTrack",
        value: e
      });
    }
    sendUpdateLocalMetadata(e, t) {
      return p(this, arguments, void 0, function(i, s) {
        var r = this;
        let o = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
        return function* () {
          const a = r.getNextRequestId();
          return yield r.sendRequest({
            case: "updateMetadata",
            value: new Hs({
              requestId: a,
              metadata: i,
              name: s,
              attributes: o
            })
          }), a;
        }();
      });
    }
    sendUpdateTrackSettings(e) {
      this.sendRequest({
        case: "trackSetting",
        value: e
      });
    }
    sendUpdateSubscription(e) {
      return this.sendRequest({
        case: "subscription",
        value: e
      });
    }
    sendSyncState(e) {
      return this.sendRequest({
        case: "syncState",
        value: e
      });
    }
    sendUpdateVideoLayers(e, t) {
      return this.sendRequest({
        case: "updateLayers",
        value: new bo({
          trackSid: e,
          layers: t
        })
      });
    }
    sendUpdateSubscriptionPermissions(e, t) {
      return this.sendRequest({
        case: "subscriptionPermission",
        value: new To({
          allParticipants: e,
          trackPermissions: t
        })
      });
    }
    sendSimulateScenario(e) {
      return this.sendRequest({
        case: "simulate",
        value: e
      });
    }
    sendPing() {
      return Promise.all([
        this.sendRequest({
          case: "ping",
          value: le.parse(Date.now())
        }),
        this.sendRequest({
          case: "pingReq",
          value: new Eo({
            timestamp: le.parse(Date.now()),
            rtt: le.parse(this.rtt)
          })
        })
      ]);
    }
    sendUpdateLocalAudioTrack(e, t) {
      return this.sendRequest({
        case: "updateAudioTrack",
        value: new Ks({
          trackSid: e,
          features: t
        })
      });
    }
    sendLeave() {
      return this.sendRequest({
        case: "leave",
        value: new Ln({
          reason: rt.CLIENT_INITIATED,
          action: yi.DISCONNECT
        })
      });
    }
    sendRequest(e) {
      return p(this, arguments, void 0, function(t) {
        var i = this;
        let s = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
        return function* () {
          if (!s && !eh(t) && i.state === oe.RECONNECTING) {
            i.queuedRequests.push(() => p(i, void 0, void 0, function* () {
              yield this.sendRequest(t, true);
            }));
            return;
          }
          if (s || (yield i.requestQueue.flush()), i.signalLatency && (yield xe(i.signalLatency)), i.isDisconnected) {
            i.log.debug("skipping signal request (type: ".concat(t.case, ") - SignalClient disconnected"));
            return;
          }
          if (!i.streamWriter) {
            i.log.error("cannot send signal request before connected, type: ".concat(t == null ? void 0 : t.case), i.logContext);
            return;
          }
          const o = new nl({
            message: t
          });
          try {
            i.useJSON ? yield i.streamWriter.write(o.toJsonString()) : yield i.streamWriter.write(o.toBinary());
          } catch (a) {
            i.log.error("error sending signal message", Object.assign(Object.assign({}, i.logContext), {
              error: a
            }));
          }
        }();
      });
    }
    handleSignalResponse(e) {
      var t, i;
      const s = e.message;
      if (s == null) {
        this.log.debug("received unsupported message", this.logContext);
        return;
      }
      let r = false;
      if (s.case === "answer") {
        const o = ra(s.value);
        this.onAnswer && this.onAnswer(o, s.value.id, s.value.midToTrackId);
      } else if (s.case === "offer") {
        const o = ra(s.value);
        this.onOffer && this.onOffer(o, s.value.id, s.value.midToTrackId);
      } else if (s.case === "trickle") {
        const o = JSON.parse(s.value.candidateInit);
        this.onTrickle && this.onTrickle(o, s.value.target);
      } else s.case === "update" ? this.onParticipantUpdate && this.onParticipantUpdate((t = s.value.participants) !== null && t !== void 0 ? t : []) : s.case === "trackPublished" ? this.onLocalTrackPublished && this.onLocalTrackPublished(s.value) : s.case === "speakersChanged" ? this.onSpeakersChanged && this.onSpeakersChanged((i = s.value.speakers) !== null && i !== void 0 ? i : []) : s.case === "leave" ? this.onLeave && this.onLeave(s.value) : s.case === "mute" ? this.onRemoteMuteChanged && this.onRemoteMuteChanged(s.value.sid, s.value.muted) : s.case === "roomUpdate" ? this.onRoomUpdate && s.value.room && this.onRoomUpdate(s.value.room) : s.case === "connectionQuality" ? this.onConnectionQuality && this.onConnectionQuality(s.value) : s.case === "streamStateUpdate" ? this.onStreamStateUpdate && this.onStreamStateUpdate(s.value) : s.case === "subscribedQualityUpdate" ? this.onSubscribedQualityUpdate && this.onSubscribedQualityUpdate(s.value) : s.case === "subscriptionPermissionUpdate" ? this.onSubscriptionPermissionUpdate && this.onSubscriptionPermissionUpdate(s.value) : s.case === "refreshToken" ? this.onTokenRefresh && this.onTokenRefresh(s.value) : s.case === "trackUnpublished" ? this.onLocalTrackUnpublished && this.onLocalTrackUnpublished(s.value) : s.case === "subscriptionResponse" ? this.onSubscriptionError && this.onSubscriptionError(s.value) : s.case === "pong" || (s.case === "pongResp" ? (this.rtt = Date.now() - Number.parseInt(s.value.lastPingTimestamp.toString()), this.resetPingTimeout(), r = true) : s.case === "requestResponse" ? this.onRequestResponse && this.onRequestResponse(s.value) : s.case === "trackSubscribed" ? this.onLocalTrackSubscribed && this.onLocalTrackSubscribed(s.value.trackSid) : s.case === "roomMoved" ? (this.onTokenRefresh && this.onTokenRefresh(s.value.token), this.onRoomMoved && this.onRoomMoved(s.value)) : s.case === "mediaSectionsRequirement" ? this.onMediaSectionsRequirement && this.onMediaSectionsRequirement(s.value) : this.log.debug("unsupported message", Object.assign(Object.assign({}, this.logContext), {
        msgCase: s.case
      })));
      r || this.resetPingTimeout();
    }
    setReconnected() {
      for (; this.queuedRequests.length > 0; ) {
        const e = this.queuedRequests.shift();
        e && this.requestQueue.run(e);
      }
    }
    handleOnClose(e) {
      return p(this, void 0, void 0, function* () {
        if (this.state === oe.DISCONNECTED) return;
        const t = this.onClose;
        yield this.close(void 0, e), this.log.debug("websocket connection closed: ".concat(e), Object.assign(Object.assign({}, this.logContext), {
          reason: e
        })), t && t(e);
      });
    }
    handleWSError(e) {
      this.log.error("websocket error", Object.assign(Object.assign({}, this.logContext), {
        error: e
      }));
    }
    resetPingTimeout() {
      if (this.clearPingTimeout(), !this.pingTimeoutDuration) {
        this.log.warn("ping timeout duration not set", this.logContext);
        return;
      }
      this.pingTimeout = Ie.setTimeout(() => {
        this.log.warn("ping timeout triggered. last pong received at: ".concat(new Date(Date.now() - this.pingTimeoutDuration * 1e3).toUTCString()), this.logContext), this.handleOnClose("ping timeout");
      }, this.pingTimeoutDuration * 1e3);
    }
    clearPingTimeout() {
      this.pingTimeout && Ie.clearTimeout(this.pingTimeout);
    }
    startPingInterval() {
      if (this.clearPingInterval(), this.resetPingTimeout(), !this.pingIntervalDuration) {
        this.log.warn("ping interval duration not set", this.logContext);
        return;
      }
      this.log.debug("start ping interval", this.logContext), this.pingInterval = Ie.setInterval(() => {
        this.sendPing();
      }, this.pingIntervalDuration * 1e3);
    }
    clearPingInterval() {
      this.log.debug("clearing ping interval", this.logContext), this.clearPingTimeout(), this.pingInterval && Ie.clearInterval(this.pingInterval);
    }
    handleSignalConnected(e, t, i) {
      this.state = oe.CONNECTED, clearTimeout(t), this.startPingInterval(), this.startReadingLoop(e.readable.getReader(), i);
    }
    validateFirstMessage(e, t) {
      var i, s, r, o, a;
      return ((i = e.message) === null || i === void 0 ? void 0 : i.case) === "join" ? {
        isValid: true,
        response: e.message.value
      } : this.state === oe.RECONNECTING && ((s = e.message) === null || s === void 0 ? void 0 : s.case) !== "leave" ? ((r = e.message) === null || r === void 0 ? void 0 : r.case) === "reconnect" ? {
        isValid: true,
        response: e.message.value
      } : (this.log.debug("declaring signal reconnected without reconnect response received", this.logContext), {
        isValid: true,
        response: void 0,
        shouldProcessFirstMessage: true
      }) : this.isEstablishingConnection && ((o = e.message) === null || o === void 0 ? void 0 : o.case) === "leave" ? {
        isValid: false,
        error: F.leaveRequest("Received leave request while trying to (re)connect", e.message.value.reason)
      } : t ? {
        isValid: false,
        error: F.internal("Unexpected first message")
      } : {
        isValid: false,
        error: F.internal("did not receive join response, got ".concat((a = e.message) === null || a === void 0 ? void 0 : a.case, " instead"))
      };
    }
    handleConnectionError(e, t) {
      return p(this, void 0, void 0, function* () {
        try {
          const i = yield fetch(t);
          switch (i.status) {
            case 404:
              return F.serviceNotFound("v1 RTC path not found. Consider upgrading your LiveKit server version", "v0-rtc");
            case 401:
            case 403:
              const s = yield i.text();
              return F.notAllowed(s, i.status);
            default:
              break;
          }
          return e instanceof F ? e : F.internal("Encountered unknown websocket error during connection: ".concat(e), {
            status: i.status,
            statusText: i.statusText
          });
        } catch (i) {
          return i instanceof F ? i : F.serverUnreachable(i instanceof Error ? i.message : "server was not reachable");
        }
      });
    }
  }
  function ra(n) {
    const e = {
      type: "offer",
      sdp: n.sdp
    };
    switch (n.type) {
      case "answer":
      case "offer":
      case "pranswer":
      case "rollback":
        e.type = n.type;
        break;
    }
    return e;
  }
  function mi(n, e) {
    return new qt({
      sdp: n.sdp,
      type: n.type,
      id: e
    });
  }
  function ih(n, e, t) {
    var i;
    const s = new URLSearchParams();
    return s.set("access_token", n), t.reconnect && (s.set("reconnect", "1"), t.sid && s.set("sid", t.sid)), s.set("auto_subscribe", t.autoSubscribe ? "1" : "0"), s.set("sdk", ut() ? "reactnative" : "js"), s.set("version", e.version), s.set("protocol", e.protocol.toString()), e.deviceModel && s.set("device_model", e.deviceModel), e.os && s.set("os", e.os), e.osVersion && s.set("os_version", e.osVersion), e.browser && s.set("browser", e.browser), e.browserVersion && s.set("browser_version", e.browserVersion), t.adaptiveStream && s.set("adaptive_stream", "1"), t.reconnectReason && s.set("reconnect_reason", t.reconnectReason.toString()), !((i = navigator.connection) === null || i === void 0) && i.type && s.set("network", navigator.connection.type), s;
  }
  function nh(n, e, t) {
    const i = new URLSearchParams();
    i.set("access_token", n);
    const s = new xl({
      clientInfo: e,
      connectionSettings: new Ro({
        autoSubscribe: !!t.autoSubscribe,
        adaptiveStream: !!t.adaptiveStream
      }),
      reconnect: !!t.reconnect,
      participantSid: t.sid ? t.sid : void 0
    });
    t.reconnectReason && (s.reconnectReason = t.reconnectReason);
    const r = new Ml({
      joinRequest: s.toBinary()
    });
    return i.set("join_request", btoa(new TextDecoder("utf-8").decode(r.toBinary()))), i;
  }
  class aa {
    constructor() {
      this.buffer = [], this._totalSize = 0;
    }
    push(e) {
      this.buffer.push(e), this._totalSize += e.data.byteLength;
    }
    pop() {
      const e = this.buffer.shift();
      return e && (this._totalSize -= e.data.byteLength), e;
    }
    getAll() {
      return this.buffer.slice();
    }
    popToSequence(e) {
      for (; this.buffer.length > 0 && this.buffer[0].sequence <= e; ) this.pop();
    }
    alignBufferedAmount(e) {
      for (; this.buffer.length > 0; ) {
        const t = this.buffer[0];
        if (this._totalSize - t.data.byteLength <= e) break;
        this.pop();
      }
    }
    get length() {
      return this.buffer.length;
    }
  }
  class sh {
    constructor(e) {
      this._map = /* @__PURE__ */ new Map(), this._lastCleanup = 0, this.ttl = e;
    }
    set(e, t) {
      const i = Date.now();
      i - this._lastCleanup > this.ttl / 2 && this.cleanup();
      const s = i + this.ttl;
      return this._map.set(e, {
        value: t,
        expiresAt: s
      }), this;
    }
    get(e) {
      const t = this._map.get(e);
      if (t) {
        if (t.expiresAt < Date.now()) {
          this._map.delete(e);
          return;
        }
        return t.value;
      }
    }
    has(e) {
      const t = this._map.get(e);
      return t ? t.expiresAt < Date.now() ? (this._map.delete(e), false) : true : false;
    }
    delete(e) {
      return this._map.delete(e);
    }
    clear() {
      this._map.clear();
    }
    cleanup() {
      const e = Date.now();
      for (const [t, i] of this._map.entries()) i.expiresAt < e && this._map.delete(t);
      this._lastCleanup = e;
    }
    get size() {
      return this.cleanup(), this._map.size;
    }
    forEach(e) {
      this.cleanup();
      for (const [t, i] of this._map.entries()) i.expiresAt >= Date.now() && e(i.value, t, this.asValueMap());
    }
    map(e) {
      this.cleanup();
      const t = [], i = this.asValueMap();
      for (const [s, r] of i.entries()) t.push(e(r, s, i));
      return t;
    }
    asValueMap() {
      const e = /* @__PURE__ */ new Map();
      for (const [t, i] of this._map.entries()) i.expiresAt >= Date.now() && e.set(t, i.value);
      return e;
    }
  }
  var et = {}, is = {}, ns = {
    exports: {}
  }, oa;
  function nr() {
    if (oa) return ns.exports;
    oa = 1;
    var n = ns.exports = {
      v: [
        {
          name: "version",
          reg: /^(\d*)$/
        }
      ],
      o: [
        {
          name: "origin",
          reg: /^(\S*) (\d*) (\d*) (\S*) IP(\d) (\S*)/,
          names: [
            "username",
            "sessionId",
            "sessionVersion",
            "netType",
            "ipVer",
            "address"
          ],
          format: "%s %s %d %s IP%d %s"
        }
      ],
      s: [
        {
          name: "name"
        }
      ],
      i: [
        {
          name: "description"
        }
      ],
      u: [
        {
          name: "uri"
        }
      ],
      e: [
        {
          name: "email"
        }
      ],
      p: [
        {
          name: "phone"
        }
      ],
      z: [
        {
          name: "timezones"
        }
      ],
      r: [
        {
          name: "repeats"
        }
      ],
      t: [
        {
          name: "timing",
          reg: /^(\d*) (\d*)/,
          names: [
            "start",
            "stop"
          ],
          format: "%d %d"
        }
      ],
      c: [
        {
          name: "connection",
          reg: /^IN IP(\d) (\S*)/,
          names: [
            "version",
            "ip"
          ],
          format: "IN IP%d %s"
        }
      ],
      b: [
        {
          push: "bandwidth",
          reg: /^(TIAS|AS|CT|RR|RS):(\d*)/,
          names: [
            "type",
            "limit"
          ],
          format: "%s:%s"
        }
      ],
      m: [
        {
          reg: /^(\w*) (\d*) ([\w/]*)(?: (.*))?/,
          names: [
            "type",
            "port",
            "protocol",
            "payloads"
          ],
          format: "%s %d %s %s"
        }
      ],
      a: [
        {
          push: "rtp",
          reg: /^rtpmap:(\d*) ([\w\-.]*)(?:\s*\/(\d*)(?:\s*\/(\S*))?)?/,
          names: [
            "payload",
            "codec",
            "rate",
            "encoding"
          ],
          format: function(e) {
            return e.encoding ? "rtpmap:%d %s/%s/%s" : e.rate ? "rtpmap:%d %s/%s" : "rtpmap:%d %s";
          }
        },
        {
          push: "fmtp",
          reg: /^fmtp:(\d*) ([\S| ]*)/,
          names: [
            "payload",
            "config"
          ],
          format: "fmtp:%d %s"
        },
        {
          name: "control",
          reg: /^control:(.*)/,
          format: "control:%s"
        },
        {
          name: "rtcp",
          reg: /^rtcp:(\d*)(?: (\S*) IP(\d) (\S*))?/,
          names: [
            "port",
            "netType",
            "ipVer",
            "address"
          ],
          format: function(e) {
            return e.address != null ? "rtcp:%d %s IP%d %s" : "rtcp:%d";
          }
        },
        {
          push: "rtcpFbTrrInt",
          reg: /^rtcp-fb:(\*|\d*) trr-int (\d*)/,
          names: [
            "payload",
            "value"
          ],
          format: "rtcp-fb:%s trr-int %d"
        },
        {
          push: "rtcpFb",
          reg: /^rtcp-fb:(\*|\d*) ([\w-_]*)(?: ([\w-_]*))?/,
          names: [
            "payload",
            "type",
            "subtype"
          ],
          format: function(e) {
            return e.subtype != null ? "rtcp-fb:%s %s %s" : "rtcp-fb:%s %s";
          }
        },
        {
          push: "ext",
          reg: /^extmap:(\d+)(?:\/(\w+))?(?: (urn:ietf:params:rtp-hdrext:encrypt))? (\S*)(?: (\S*))?/,
          names: [
            "value",
            "direction",
            "encrypt-uri",
            "uri",
            "config"
          ],
          format: function(e) {
            return "extmap:%d" + (e.direction ? "/%s" : "%v") + (e["encrypt-uri"] ? " %s" : "%v") + " %s" + (e.config ? " %s" : "");
          }
        },
        {
          name: "extmapAllowMixed",
          reg: /^(extmap-allow-mixed)/
        },
        {
          push: "crypto",
          reg: /^crypto:(\d*) ([\w_]*) (\S*)(?: (\S*))?/,
          names: [
            "id",
            "suite",
            "config",
            "sessionConfig"
          ],
          format: function(e) {
            return e.sessionConfig != null ? "crypto:%d %s %s %s" : "crypto:%d %s %s";
          }
        },
        {
          name: "setup",
          reg: /^setup:(\w*)/,
          format: "setup:%s"
        },
        {
          name: "connectionType",
          reg: /^connection:(new|existing)/,
          format: "connection:%s"
        },
        {
          name: "mid",
          reg: /^mid:([^\s]*)/,
          format: "mid:%s"
        },
        {
          name: "msid",
          reg: /^msid:(.*)/,
          format: "msid:%s"
        },
        {
          name: "ptime",
          reg: /^ptime:(\d*(?:\.\d*)*)/,
          format: "ptime:%d"
        },
        {
          name: "maxptime",
          reg: /^maxptime:(\d*(?:\.\d*)*)/,
          format: "maxptime:%d"
        },
        {
          name: "direction",
          reg: /^(sendrecv|recvonly|sendonly|inactive)/
        },
        {
          name: "icelite",
          reg: /^(ice-lite)/
        },
        {
          name: "iceUfrag",
          reg: /^ice-ufrag:(\S*)/,
          format: "ice-ufrag:%s"
        },
        {
          name: "icePwd",
          reg: /^ice-pwd:(\S*)/,
          format: "ice-pwd:%s"
        },
        {
          name: "fingerprint",
          reg: /^fingerprint:(\S*) (\S*)/,
          names: [
            "type",
            "hash"
          ],
          format: "fingerprint:%s %s"
        },
        {
          push: "candidates",
          reg: /^candidate:(\S*) (\d*) (\S*) (\d*) (\S*) (\d*) typ (\S*)(?: raddr (\S*) rport (\d*))?(?: tcptype (\S*))?(?: generation (\d*))?(?: network-id (\d*))?(?: network-cost (\d*))?/,
          names: [
            "foundation",
            "component",
            "transport",
            "priority",
            "ip",
            "port",
            "type",
            "raddr",
            "rport",
            "tcptype",
            "generation",
            "network-id",
            "network-cost"
          ],
          format: function(e) {
            var t = "candidate:%s %d %s %d %s %d typ %s";
            return t += e.raddr != null ? " raddr %s rport %d" : "%v%v", t += e.tcptype != null ? " tcptype %s" : "%v", e.generation != null && (t += " generation %d"), t += e["network-id"] != null ? " network-id %d" : "%v", t += e["network-cost"] != null ? " network-cost %d" : "%v", t;
          }
        },
        {
          name: "endOfCandidates",
          reg: /^(end-of-candidates)/
        },
        {
          name: "remoteCandidates",
          reg: /^remote-candidates:(.*)/,
          format: "remote-candidates:%s"
        },
        {
          name: "iceOptions",
          reg: /^ice-options:(\S*)/,
          format: "ice-options:%s"
        },
        {
          push: "ssrcs",
          reg: /^ssrc:(\d*) ([\w_-]*)(?::(.*))?/,
          names: [
            "id",
            "attribute",
            "value"
          ],
          format: function(e) {
            var t = "ssrc:%d";
            return e.attribute != null && (t += " %s", e.value != null && (t += ":%s")), t;
          }
        },
        {
          push: "ssrcGroups",
          reg: /^ssrc-group:([\x21\x23\x24\x25\x26\x27\x2A\x2B\x2D\x2E\w]*) (.*)/,
          names: [
            "semantics",
            "ssrcs"
          ],
          format: "ssrc-group:%s %s"
        },
        {
          name: "msidSemantic",
          reg: /^msid-semantic:\s?(\w*) (\S*)/,
          names: [
            "semantic",
            "token"
          ],
          format: "msid-semantic: %s %s"
        },
        {
          push: "groups",
          reg: /^group:(\w*) (.*)/,
          names: [
            "type",
            "mids"
          ],
          format: "group:%s %s"
        },
        {
          name: "rtcpMux",
          reg: /^(rtcp-mux)/
        },
        {
          name: "rtcpRsize",
          reg: /^(rtcp-rsize)/
        },
        {
          name: "sctpmap",
          reg: /^sctpmap:([\w_/]*) (\S*)(?: (\S*))?/,
          names: [
            "sctpmapNumber",
            "app",
            "maxMessageSize"
          ],
          format: function(e) {
            return e.maxMessageSize != null ? "sctpmap:%s %s %s" : "sctpmap:%s %s";
          }
        },
        {
          name: "xGoogleFlag",
          reg: /^x-google-flag:([^\s]*)/,
          format: "x-google-flag:%s"
        },
        {
          push: "rids",
          reg: /^rid:([\d\w]+) (\w+)(?: ([\S| ]*))?/,
          names: [
            "id",
            "direction",
            "params"
          ],
          format: function(e) {
            return e.params ? "rid:%s %s %s" : "rid:%s %s";
          }
        },
        {
          push: "imageattrs",
          reg: new RegExp("^imageattr:(\\d+|\\*)[\\s\\t]+(send|recv)[\\s\\t]+(\\*|\\[\\S+\\](?:[\\s\\t]+\\[\\S+\\])*)(?:[\\s\\t]+(recv|send)[\\s\\t]+(\\*|\\[\\S+\\](?:[\\s\\t]+\\[\\S+\\])*))?"),
          names: [
            "pt",
            "dir1",
            "attrs1",
            "dir2",
            "attrs2"
          ],
          format: function(e) {
            return "imageattr:%s %s %s" + (e.dir2 ? " %s %s" : "");
          }
        },
        {
          name: "simulcast",
          reg: new RegExp("^simulcast:(send|recv) ([a-zA-Z0-9\\-_~;,]+)(?:\\s?(send|recv) ([a-zA-Z0-9\\-_~;,]+))?$"),
          names: [
            "dir1",
            "list1",
            "dir2",
            "list2"
          ],
          format: function(e) {
            return "simulcast:%s %s" + (e.dir2 ? " %s %s" : "");
          }
        },
        {
          name: "simulcast_03",
          reg: /^simulcast:[\s\t]+([\S+\s\t]+)$/,
          names: [
            "value"
          ],
          format: "simulcast: %s"
        },
        {
          name: "framerate",
          reg: /^framerate:(\d+(?:$|\.\d+))/,
          format: "framerate:%s"
        },
        {
          name: "sourceFilter",
          reg: /^source-filter: *(excl|incl) (\S*) (IP4|IP6|\*) (\S*) (.*)/,
          names: [
            "filterMode",
            "netType",
            "addressTypes",
            "destAddress",
            "srcList"
          ],
          format: "source-filter: %s %s %s %s %s"
        },
        {
          name: "bundleOnly",
          reg: /^(bundle-only)/
        },
        {
          name: "label",
          reg: /^label:(.+)/,
          format: "label:%s"
        },
        {
          name: "sctpPort",
          reg: /^sctp-port:(\d+)$/,
          format: "sctp-port:%s"
        },
        {
          name: "maxMessageSize",
          reg: /^max-message-size:(\d+)$/,
          format: "max-message-size:%s"
        },
        {
          push: "tsRefClocks",
          reg: /^ts-refclk:([^\s=]*)(?:=(\S*))?/,
          names: [
            "clksrc",
            "clksrcExt"
          ],
          format: function(e) {
            return "ts-refclk:%s" + (e.clksrcExt != null ? "=%s" : "");
          }
        },
        {
          name: "mediaClk",
          reg: /^mediaclk:(?:id=(\S*))? *([^\s=]*)(?:=(\S*))?(?: *rate=(\d+)\/(\d+))?/,
          names: [
            "id",
            "mediaClockName",
            "mediaClockValue",
            "rateNumerator",
            "rateDenominator"
          ],
          format: function(e) {
            var t = "mediaclk:";
            return t += e.id != null ? "id=%s %s" : "%v%s", t += e.mediaClockValue != null ? "=%s" : "", t += e.rateNumerator != null ? " rate=%s" : "", t += e.rateDenominator != null ? "/%s" : "", t;
          }
        },
        {
          name: "keywords",
          reg: /^keywds:(.+)$/,
          format: "keywds:%s"
        },
        {
          name: "content",
          reg: /^content:(.+)/,
          format: "content:%s"
        },
        {
          name: "bfcpFloorCtrl",
          reg: /^floorctrl:(c-only|s-only|c-s)/,
          format: "floorctrl:%s"
        },
        {
          name: "bfcpConfId",
          reg: /^confid:(\d+)/,
          format: "confid:%s"
        },
        {
          name: "bfcpUserId",
          reg: /^userid:(\d+)/,
          format: "userid:%s"
        },
        {
          name: "bfcpFloorId",
          reg: /^floorid:(.+) (?:m-stream|mstrm):(.+)/,
          names: [
            "id",
            "mStream"
          ],
          format: "floorid:%s mstrm:%s"
        },
        {
          push: "invalid",
          names: [
            "value"
          ]
        }
      ]
    };
    return Object.keys(n).forEach(function(e) {
      var t = n[e];
      t.forEach(function(i) {
        i.reg || (i.reg = /(.*)/), i.format || (i.format = "%s");
      });
    }), ns.exports;
  }
  var ca;
  function rh() {
    return ca || (ca = 1, function(n) {
      var e = function(a) {
        return String(Number(a)) === a ? Number(a) : a;
      }, t = function(a, c, d, l) {
        if (l && !d) c[l] = e(a[1]);
        else for (var u = 0; u < d.length; u += 1) a[u + 1] != null && (c[d[u]] = e(a[u + 1]));
      }, i = function(a, c, d) {
        var l = a.name && a.names;
        a.push && !c[a.push] ? c[a.push] = [] : l && !c[a.name] && (c[a.name] = {});
        var u = a.push ? {} : l ? c[a.name] : c;
        t(d.match(a.reg), u, a.names, a.name), a.push && c[a.push].push(u);
      }, s = nr(), r = RegExp.prototype.test.bind(/^([a-z])=(.*)/);
      n.parse = function(a) {
        var c = {}, d = [], l = c;
        return a.split(/(\r\n|\r|\n)/).filter(r).forEach(function(u) {
          var h = u[0], m = u.slice(2);
          h === "m" && (d.push({
            rtp: [],
            fmtp: []
          }), l = d[d.length - 1]);
          for (var v = 0; v < (s[h] || []).length; v += 1) {
            var g = s[h][v];
            if (g.reg.test(m)) return i(g, l, m);
          }
        }), c.media = d, c;
      };
      var o = function(a, c) {
        var d = c.split(/=(.+)/, 2);
        return d.length === 2 ? a[d[0]] = e(d[1]) : d.length === 1 && c.length > 1 && (a[d[0]] = void 0), a;
      };
      n.parseParams = function(a) {
        return a.split(/;\s?/).reduce(o, {});
      }, n.parseFmtpConfig = n.parseParams, n.parsePayloads = function(a) {
        return a.toString().split(" ").map(Number);
      }, n.parseRemoteCandidates = function(a) {
        for (var c = [], d = a.split(" ").map(e), l = 0; l < d.length; l += 3) c.push({
          component: d[l],
          ip: d[l + 1],
          port: d[l + 2]
        });
        return c;
      }, n.parseImageAttributes = function(a) {
        return a.split(" ").map(function(c) {
          return c.substring(1, c.length - 1).split(",").reduce(o, {});
        });
      }, n.parseSimulcastStreamList = function(a) {
        return a.split(";").map(function(c) {
          return c.split(",").map(function(d) {
            var l, u = false;
            return d[0] !== "~" ? l = e(d) : (l = e(d.substring(1, d.length)), u = true), {
              scid: l,
              paused: u
            };
          });
        });
      };
    }(is)), is;
  }
  var ss, da;
  function ah() {
    if (da) return ss;
    da = 1;
    var n = nr(), e = /%[sdv%]/g, t = function(o) {
      var a = 1, c = arguments, d = c.length;
      return o.replace(e, function(l) {
        if (a >= d) return l;
        var u = c[a];
        switch (a += 1, l) {
          case "%%":
            return "%";
          case "%s":
            return String(u);
          case "%d":
            return Number(u);
          case "%v":
            return "";
        }
      });
    }, i = function(o, a, c) {
      var d = a.format instanceof Function ? a.format(a.push ? c : c[a.name]) : a.format, l = [
        o + "=" + d
      ];
      if (a.names) for (var u = 0; u < a.names.length; u += 1) {
        var h = a.names[u];
        a.name ? l.push(c[a.name][h]) : l.push(c[a.names[u]]);
      }
      else l.push(c[a.name]);
      return t.apply(null, l);
    }, s = [
      "v",
      "o",
      "s",
      "i",
      "u",
      "e",
      "p",
      "c",
      "b",
      "t",
      "r",
      "z",
      "a"
    ], r = [
      "i",
      "c",
      "b",
      "a"
    ];
    return ss = function(o, a) {
      a = a || {}, o.version == null && (o.version = 0), o.name == null && (o.name = " "), o.media.forEach(function(u) {
        u.payloads == null && (u.payloads = "");
      });
      var c = a.outerOrder || s, d = a.innerOrder || r, l = [];
      return c.forEach(function(u) {
        n[u].forEach(function(h) {
          h.name in o && o[h.name] != null ? l.push(i(u, h, o)) : h.push in o && o[h.push] != null && o[h.push].forEach(function(m) {
            l.push(i(u, h, m));
          });
        });
      }), o.media.forEach(function(u) {
        l.push(i("m", n.m[0], u)), d.forEach(function(h) {
          n[h].forEach(function(m) {
            m.name in u && u[m.name] != null ? l.push(i(h, m, u)) : m.push in u && u[m.push] != null && u[m.push].forEach(function(v) {
              l.push(i(h, m, v));
            });
          });
        });
      }), l.join(`\r
`) + `\r
`;
    }, ss;
  }
  var la;
  function oh() {
    if (la) return et;
    la = 1;
    var n = rh(), e = ah(), t = nr();
    return et.grammar = t, et.write = e, et.parse = n.parse, et.parseParams = n.parseParams, et.parseFmtpConfig = n.parseFmtpConfig, et.parsePayloads = n.parsePayloads, et.parseRemoteCandidates = n.parseRemoteCandidates, et.parseImageAttributes = n.parseImageAttributes, et.parseSimulcastStreamList = n.parseSimulcastStreamList, et;
  }
  var At = oh();
  function sr(n, e, t) {
    var i, s, r;
    e === void 0 && (e = 50), t === void 0 && (t = {});
    var o = (i = t.isImmediate) != null && i, a = (s = t.callback) != null && s, c = t.maxWait, d = Date.now(), l = [];
    function u() {
      if (c !== void 0) {
        var m = Date.now() - d;
        if (m + e >= c) return c - m;
      }
      return e;
    }
    var h = function() {
      var m = [].slice.call(arguments), v = this;
      return new Promise(function(g, T) {
        var S = o && r === void 0;
        if (r !== void 0 && clearTimeout(r), r = setTimeout(function() {
          if (r = void 0, d = Date.now(), !o) {
            var P = n.apply(v, m);
            a && a(P), l.forEach(function(b) {
              return (0, b.resolve)(P);
            }), l = [];
          }
        }, u()), S) {
          var I = n.apply(v, m);
          return a && a(I), g(I);
        }
        l.push({
          resolve: g,
          reject: T
        });
      });
    };
    return h.cancel = function(m) {
      r !== void 0 && clearTimeout(r), l.forEach(function(v) {
        return (0, v.reject)(m);
      }), l = [];
    }, h;
  }
  const ch = 0.7, dh = 20, wi = {
    NegotiationStarted: "negotiationStarted",
    NegotiationComplete: "negotiationComplete",
    RTPVideoPayloadTypes: "rtpVideoPayloadTypes"
  };
  class ua extends pt.EventEmitter {
    get pc() {
      return this._pc || (this._pc = this.createPC()), this._pc;
    }
    constructor(e) {
      let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      var i;
      super(), this.log = H, this.ddExtID = 0, this.latestOfferId = 0, this.pendingCandidates = [], this.restartingIce = false, this.renegotiate = false, this.trackBitrates = [], this.remoteStereoMids = [], this.remoteNackMids = [], this.negotiate = sr((s) => p(this, void 0, void 0, function* () {
        this.emit(wi.NegotiationStarted);
        try {
          yield this.createAndSendOffer();
        } catch (r) {
          if (s) s(r);
          else throw r;
        }
      }), dh), this.close = () => {
        this._pc && (this._pc.close(), this._pc.onconnectionstatechange = null, this._pc.oniceconnectionstatechange = null, this._pc.onicegatheringstatechange = null, this._pc.ondatachannel = null, this._pc.onnegotiationneeded = null, this._pc.onsignalingstatechange = null, this._pc.onicecandidate = null, this._pc.ondatachannel = null, this._pc.ontrack = null, this._pc.onconnectionstatechange = null, this._pc.oniceconnectionstatechange = null, this._pc = null);
      }, this.log = wt((i = t.loggerName) !== null && i !== void 0 ? i : at.PCTransport), this.loggerOptions = t, this.config = e, this._pc = this.createPC(), this.offerLock = new je();
    }
    createPC() {
      const e = new RTCPeerConnection(this.config);
      return e.onicecandidate = (t) => {
        var i;
        t.candidate && ((i = this.onIceCandidate) === null || i === void 0 || i.call(this, t.candidate));
      }, e.onicecandidateerror = (t) => {
        var i;
        (i = this.onIceCandidateError) === null || i === void 0 || i.call(this, t);
      }, e.oniceconnectionstatechange = () => {
        var t;
        (t = this.onIceConnectionStateChange) === null || t === void 0 || t.call(this, e.iceConnectionState);
      }, e.onsignalingstatechange = () => {
        var t;
        (t = this.onSignalingStatechange) === null || t === void 0 || t.call(this, e.signalingState);
      }, e.onconnectionstatechange = () => {
        var t;
        (t = this.onConnectionStateChange) === null || t === void 0 || t.call(this, e.connectionState);
      }, e.ondatachannel = (t) => {
        var i;
        (i = this.onDataChannel) === null || i === void 0 || i.call(this, t);
      }, e.ontrack = (t) => {
        var i;
        (i = this.onTrack) === null || i === void 0 || i.call(this, t);
      }, e;
    }
    get logContext() {
      var e, t;
      return Object.assign({}, (t = (e = this.loggerOptions).loggerContextCb) === null || t === void 0 ? void 0 : t.call(e));
    }
    get isICEConnected() {
      return this._pc !== null && (this.pc.iceConnectionState === "connected" || this.pc.iceConnectionState === "completed");
    }
    addIceCandidate(e) {
      return p(this, void 0, void 0, function* () {
        if (this.pc.remoteDescription && !this.restartingIce) return this.pc.addIceCandidate(e);
        this.pendingCandidates.push(e);
      });
    }
    setRemoteDescription(e, t) {
      return p(this, void 0, void 0, function* () {
        var i;
        if (e.type === "answer" && this.latestOfferId > 0 && t > 0 && t !== this.latestOfferId) return this.log.warn("ignoring answer for old offer", Object.assign(Object.assign({}, this.logContext), {
          offerId: t,
          latestOfferId: this.latestOfferId
        })), false;
        let s;
        if (e.type === "offer") {
          let { stereoMids: r, nackMids: o } = lh(e);
          this.remoteStereoMids = r, this.remoteNackMids = o;
        } else if (e.type === "answer") {
          const r = At.parse((i = e.sdp) !== null && i !== void 0 ? i : "");
          r.media.forEach((o) => {
            const a = rr(o.mid);
            o.type === "audio" && this.trackBitrates.some((c) => {
              if (!c.transceiver || a != c.transceiver.mid) return false;
              let d = 0;
              if (o.rtp.some((u) => u.codec.toUpperCase() === c.codec.toUpperCase() ? (d = u.payload, true) : false), d === 0) return true;
              let l = false;
              for (const u of o.fmtp) if (u.payload === d) {
                u.config = u.config.split(";").filter((h) => !h.includes("maxaveragebitrate")).join(";"), c.maxbr > 0 && (u.config += ";maxaveragebitrate=".concat(c.maxbr * 1e3)), l = true;
                break;
              }
              return l || c.maxbr > 0 && o.fmtp.push({
                payload: d,
                config: "maxaveragebitrate=".concat(c.maxbr * 1e3)
              }), true;
            });
          }), s = At.write(r);
        }
        return yield this.setMungedSDP(e, s, true), this.pendingCandidates.forEach((r) => {
          this.pc.addIceCandidate(r);
        }), this.pendingCandidates = [], this.restartingIce = false, this.renegotiate ? (this.renegotiate = false, yield this.createAndSendOffer()) : e.type === "answer" && (this.emit(wi.NegotiationComplete), e.sdp && At.parse(e.sdp).media.forEach((o) => {
          o.type === "video" && this.emit(wi.RTPVideoPayloadTypes, o.rtp);
        })), true;
      });
    }
    createAndSendOffer(e) {
      return p(this, void 0, void 0, function* () {
        var t;
        const i = yield this.offerLock.lock();
        try {
          if (this.onOffer === void 0) return;
          if ((e == null ? void 0 : e.iceRestart) && (this.log.debug("restarting ICE", this.logContext), this.restartingIce = true), this._pc && this._pc.signalingState === "have-local-offer") {
            const a = this._pc.remoteDescription;
            if ((e == null ? void 0 : e.iceRestart) && a) yield this._pc.setRemoteDescription(a);
            else {
              this.renegotiate = true;
              return;
            }
          } else if (!this._pc || this._pc.signalingState === "closed") {
            this.log.warn("could not createOffer with closed peer connection", this.logContext);
            return;
          }
          this.log.debug("starting to negotiate", this.logContext);
          const s = this.latestOfferId + 1;
          this.latestOfferId = s;
          const r = yield this.pc.createOffer(e);
          this.log.debug("original offer", Object.assign({
            sdp: r.sdp
          }, this.logContext));
          const o = At.parse((t = r.sdp) !== null && t !== void 0 ? t : "");
          if (o.media.forEach((a) => {
            pa(a), a.type === "audio" ? ha(a, [
              "all"
            ], []) : a.type === "video" && this.trackBitrates.some((c) => {
              if (!a.msid || !c.cid || !a.msid.includes(c.cid)) return false;
              let d = 0;
              if (a.rtp.some((u) => u.codec.toUpperCase() === c.codec.toUpperCase() ? (d = u.payload, true) : false), d === 0 || (st(c.codec) && !si() && this.ensureVideoDDExtensionForSVC(a, o), !st(c.codec))) return true;
              const l = Math.round(c.maxbr * ch);
              for (const u of a.fmtp) if (u.payload === d) {
                u.config.includes("x-google-start-bitrate") || (u.config += ";x-google-start-bitrate=".concat(l));
                break;
              }
              return true;
            });
          }), this.latestOfferId > s) {
            this.log.warn("latestOfferId mismatch", Object.assign(Object.assign({}, this.logContext), {
              latestOfferId: this.latestOfferId,
              offerId: s
            }));
            return;
          }
          yield this.setMungedSDP(r, At.write(o)), this.onOffer(r, this.latestOfferId);
        } finally {
          i();
        }
      });
    }
    createAndSetAnswer() {
      return p(this, void 0, void 0, function* () {
        var e;
        const t = yield this.pc.createAnswer(), i = At.parse((e = t.sdp) !== null && e !== void 0 ? e : "");
        return i.media.forEach((s) => {
          pa(s), s.type === "audio" && ha(s, this.remoteStereoMids, this.remoteNackMids);
        }), yield this.setMungedSDP(t, At.write(i)), t;
      });
    }
    createDataChannel(e, t) {
      return this.pc.createDataChannel(e, t);
    }
    addTransceiver(e, t) {
      return this.pc.addTransceiver(e, t);
    }
    addTransceiverOfKind(e, t) {
      return this.pc.addTransceiver(e, t);
    }
    addTrack(e) {
      if (!this._pc) throw new me("PC closed, cannot add track");
      return this._pc.addTrack(e);
    }
    setTrackCodecBitrate(e) {
      this.trackBitrates.push(e);
    }
    setConfiguration(e) {
      var t;
      if (!this._pc) throw new me("PC closed, cannot configure");
      return (t = this._pc) === null || t === void 0 ? void 0 : t.setConfiguration(e);
    }
    canRemoveTrack() {
      var e;
      return !!(!((e = this._pc) === null || e === void 0) && e.removeTrack);
    }
    removeTrack(e) {
      var t;
      return (t = this._pc) === null || t === void 0 ? void 0 : t.removeTrack(e);
    }
    getConnectionState() {
      var e, t;
      return (t = (e = this._pc) === null || e === void 0 ? void 0 : e.connectionState) !== null && t !== void 0 ? t : "closed";
    }
    getICEConnectionState() {
      var e, t;
      return (t = (e = this._pc) === null || e === void 0 ? void 0 : e.iceConnectionState) !== null && t !== void 0 ? t : "closed";
    }
    getSignallingState() {
      var e, t;
      return (t = (e = this._pc) === null || e === void 0 ? void 0 : e.signalingState) !== null && t !== void 0 ? t : "closed";
    }
    getTransceivers() {
      var e, t;
      return (t = (e = this._pc) === null || e === void 0 ? void 0 : e.getTransceivers()) !== null && t !== void 0 ? t : [];
    }
    getSenders() {
      var e, t;
      return (t = (e = this._pc) === null || e === void 0 ? void 0 : e.getSenders()) !== null && t !== void 0 ? t : [];
    }
    getLocalDescription() {
      var e;
      return (e = this._pc) === null || e === void 0 ? void 0 : e.localDescription;
    }
    getRemoteDescription() {
      var e;
      return (e = this.pc) === null || e === void 0 ? void 0 : e.remoteDescription;
    }
    getStats() {
      return this.pc.getStats();
    }
    getConnectedAddress() {
      return p(this, void 0, void 0, function* () {
        var e;
        if (!this._pc) return;
        let t = "";
        const i = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Map();
        if ((yield this._pc.getStats()).forEach((a) => {
          switch (a.type) {
            case "transport":
              t = a.selectedCandidatePairId;
              break;
            case "candidate-pair":
              t === "" && a.selected && (t = a.id), i.set(a.id, a);
              break;
            case "remote-candidate":
              s.set(a.id, "".concat(a.address, ":").concat(a.port));
              break;
          }
        }), t === "") return;
        const o = (e = i.get(t)) === null || e === void 0 ? void 0 : e.remoteCandidateId;
        if (o !== void 0) return s.get(o);
      });
    }
    setMungedSDP(e, t, i) {
      return p(this, void 0, void 0, function* () {
        if (t) {
          const s = e.sdp;
          e.sdp = t;
          try {
            this.log.debug("setting munged ".concat(i ? "remote" : "local", " description"), this.logContext), i ? yield this.pc.setRemoteDescription(e) : yield this.pc.setLocalDescription(e);
            return;
          } catch (r) {
            this.log.warn("not able to set ".concat(e.type, ", falling back to unmodified sdp"), Object.assign(Object.assign({}, this.logContext), {
              error: r,
              sdp: t
            })), e.sdp = s;
          }
        }
        try {
          i ? yield this.pc.setRemoteDescription(e) : yield this.pc.setLocalDescription(e);
        } catch (s) {
          let r = "unknown error";
          s instanceof Error ? r = s.message : typeof s == "string" && (r = s);
          const o = {
            error: r,
            sdp: e.sdp
          };
          throw !i && this.pc.remoteDescription && (o.remoteSdp = this.pc.remoteDescription), this.log.error("unable to set ".concat(e.type), Object.assign(Object.assign({}, this.logContext), {
            fields: o
          })), new ki(r);
        }
      });
    }
    ensureVideoDDExtensionForSVC(e, t) {
      var i, s;
      if (!((i = e.ext) === null || i === void 0 ? void 0 : i.some((o) => o.uri === zr))) {
        if (this.ddExtID === 0) {
          let o = 0;
          t.media.forEach((a) => {
            var c;
            a.type === "video" && ((c = a.ext) === null || c === void 0 || c.forEach((d) => {
              d.value > o && (o = d.value);
            }));
          }), this.ddExtID = o + 1;
        }
        (s = e.ext) === null || s === void 0 || s.push({
          value: this.ddExtID,
          uri: zr
        });
      }
    }
  }
  function ha(n, e, t) {
    const i = rr(n.mid);
    let s = 0;
    n.rtp.some((r) => r.codec === "opus" ? (s = r.payload, true) : false), s > 0 && (n.rtcpFb || (n.rtcpFb = []), t.includes(i) && !n.rtcpFb.some((r) => r.payload === s && r.type === "nack") && n.rtcpFb.push({
      payload: s,
      type: "nack"
    }), (e.includes(i) || e.length === 1 && e[0] === "all") && n.fmtp.some((r) => r.payload === s ? (r.config.includes("stereo=1") || (r.config += ";stereo=1"), true) : false));
  }
  function lh(n) {
    var e;
    const t = [], i = [], s = At.parse((e = n.sdp) !== null && e !== void 0 ? e : "");
    let r = 0;
    return s.media.forEach((o) => {
      var a;
      const c = rr(o.mid);
      o.type === "audio" && (o.rtp.some((d) => d.codec === "opus" ? (r = d.payload, true) : false), !((a = o.rtcpFb) === null || a === void 0) && a.some((d) => d.payload === r && d.type === "nack") && i.push(c), o.fmtp.some((d) => d.payload === r ? (d.config.includes("sprop-stereo=1") && t.push(c), true) : false));
    }), {
      stereoMids: t,
      nackMids: i
    };
  }
  function pa(n) {
    if (n.connection) {
      const e = n.connection.ip.indexOf(":") >= 0;
      (n.connection.version === 4 && e || n.connection.version === 6 && !e) && (n.connection.ip = "0.0.0.0", n.connection.version = 4);
    }
  }
  function rr(n) {
    return typeof n == "number" ? n.toFixed(0) : n;
  }
  const Ms = "vp8", uh = {
    audioPreset: Ts.music,
    dtx: true,
    red: true,
    forceStereo: false,
    simulcast: true,
    screenShareEncoding: Zs.h1080fps15.encoding,
    stopMicTrackOnMute: false,
    videoCodec: Ms,
    backupCodec: true,
    preConnectBuffer: false
  }, mc = {
    deviceId: {
      ideal: "default"
    },
    autoGainControl: true,
    echoCancellation: true,
    noiseSuppression: true,
    voiceIsolation: true
  }, fc = {
    deviceId: {
      ideal: "default"
    },
    resolution: Qi.h720.resolution
  }, hh = {
    adaptiveStream: false,
    dynacast: false,
    stopLocalTrackOnUnpublish: true,
    reconnectPolicy: new Fl(),
    disconnectOnPageLeave: true,
    webAudioMix: false,
    singlePeerConnection: true
  }, ar = {
    autoSubscribe: true,
    maxRetries: 1,
    peerConnectionTimeout: 15e3,
    websocketTimeout: 15e3
  };
  var ue;
  (function(n) {
    n[n.NEW = 0] = "NEW", n[n.CONNECTING = 1] = "CONNECTING", n[n.CONNECTED = 2] = "CONNECTED", n[n.FAILED = 3] = "FAILED", n[n.CLOSING = 4] = "CLOSING", n[n.CLOSED = 5] = "CLOSED";
  })(ue || (ue = {}));
  class ph {
    get needsPublisher() {
      return this.isPublisherConnectionRequired;
    }
    get needsSubscriber() {
      return this.isSubscriberConnectionRequired;
    }
    get currentState() {
      return this.state;
    }
    get mode() {
      return this._mode;
    }
    constructor(e, t, i) {
      var s;
      this.peerConnectionTimeout = ar.peerConnectionTimeout, this.log = H, this.updateState = () => {
        var r, o;
        const a = this.state, c = this.requiredTransports.map((d) => d.getConnectionState());
        c.every((d) => d === "connected") ? this.state = ue.CONNECTED : c.some((d) => d === "failed") ? this.state = ue.FAILED : c.some((d) => d === "connecting") ? this.state = ue.CONNECTING : c.every((d) => d === "closed") ? this.state = ue.CLOSED : c.some((d) => d === "closed") ? this.state = ue.CLOSING : c.every((d) => d === "new") && (this.state = ue.NEW), a !== this.state && (this.log.debug("pc state change: from ".concat(ue[a], " to ").concat(ue[this.state]), this.logContext), (r = this.onStateChange) === null || r === void 0 || r.call(this, this.state, this.publisher.getConnectionState(), (o = this.subscriber) === null || o === void 0 ? void 0 : o.getConnectionState()));
      }, this.log = wt((s = i.loggerName) !== null && s !== void 0 ? s : at.PCManager), this.loggerOptions = i, this.isPublisherConnectionRequired = t !== "subscriber-primary", this.isSubscriberConnectionRequired = t === "subscriber-primary", this.publisher = new ua(e, i), this._mode = t, t !== "publisher-only" && (this.subscriber = new ua(e, i), this.subscriber.onConnectionStateChange = this.updateState, this.subscriber.onIceConnectionStateChange = this.updateState, this.subscriber.onSignalingStatechange = this.updateState, this.subscriber.onIceCandidate = (r) => {
        var o;
        (o = this.onIceCandidate) === null || o === void 0 || o.call(this, r, nt.SUBSCRIBER);
      }, this.subscriber.onDataChannel = (r) => {
        var o;
        (o = this.onDataChannel) === null || o === void 0 || o.call(this, r);
      }, this.subscriber.onTrack = (r) => {
        var o;
        (o = this.onTrack) === null || o === void 0 || o.call(this, r);
      }), this.publisher.onConnectionStateChange = this.updateState, this.publisher.onIceConnectionStateChange = this.updateState, this.publisher.onSignalingStatechange = this.updateState, this.publisher.onIceCandidate = (r) => {
        var o;
        (o = this.onIceCandidate) === null || o === void 0 || o.call(this, r, nt.PUBLISHER);
      }, this.publisher.onTrack = (r) => {
        var o;
        (o = this.onTrack) === null || o === void 0 || o.call(this, r);
      }, this.publisher.onOffer = (r, o) => {
        var a;
        (a = this.onPublisherOffer) === null || a === void 0 || a.call(this, r, o);
      }, this.state = ue.NEW, this.connectionLock = new je(), this.remoteOfferLock = new je();
    }
    get logContext() {
      var e, t;
      return Object.assign({}, (t = (e = this.loggerOptions).loggerContextCb) === null || t === void 0 ? void 0 : t.call(e));
    }
    requirePublisher() {
      let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : true;
      this.isPublisherConnectionRequired = e, this.updateState();
    }
    createAndSendPublisherOffer(e) {
      return this.publisher.createAndSendOffer(e);
    }
    setPublisherAnswer(e, t) {
      return this.publisher.setRemoteDescription(e, t);
    }
    removeTrack(e) {
      return this.publisher.removeTrack(e);
    }
    close() {
      return p(this, void 0, void 0, function* () {
        var e;
        if (this.publisher && this.publisher.getSignallingState() !== "closed") {
          const t = this.publisher;
          for (const i of t.getSenders()) try {
            t.canRemoveTrack() && t.removeTrack(i);
          } catch (s) {
            this.log.warn("could not removeTrack", Object.assign(Object.assign({}, this.logContext), {
              error: s
            }));
          }
        }
        yield Promise.all([
          this.publisher.close(),
          (e = this.subscriber) === null || e === void 0 ? void 0 : e.close()
        ]), this.updateState();
      });
    }
    triggerIceRestart() {
      return p(this, void 0, void 0, function* () {
        this.subscriber && (this.subscriber.restartingIce = true), this.needsPublisher && (yield this.createAndSendPublisherOffer({
          iceRestart: true
        }));
      });
    }
    addIceCandidate(e, t) {
      return p(this, void 0, void 0, function* () {
        var i;
        t === nt.PUBLISHER ? yield this.publisher.addIceCandidate(e) : yield (i = this.subscriber) === null || i === void 0 ? void 0 : i.addIceCandidate(e);
      });
    }
    createSubscriberAnswerFromOffer(e, t) {
      return p(this, void 0, void 0, function* () {
        var i, s, r;
        this.log.debug("received server offer", Object.assign(Object.assign({}, this.logContext), {
          RTCSdpType: e.type,
          sdp: e.sdp,
          signalingState: (i = this.subscriber) === null || i === void 0 ? void 0 : i.getSignallingState().toString()
        }));
        const o = yield this.remoteOfferLock.lock();
        try {
          return (yield (s = this.subscriber) === null || s === void 0 ? void 0 : s.setRemoteDescription(e, t)) ? yield (r = this.subscriber) === null || r === void 0 ? void 0 : r.createAndSetAnswer() : void 0;
        } finally {
          o();
        }
      });
    }
    updateConfiguration(e, t) {
      var i;
      this.publisher.setConfiguration(e), (i = this.subscriber) === null || i === void 0 || i.setConfiguration(e), t && this.triggerIceRestart();
    }
    ensurePCTransportConnection(e, t) {
      return p(this, void 0, void 0, function* () {
        var i;
        const s = yield this.connectionLock.lock();
        try {
          this.isPublisherConnectionRequired && this.publisher.getConnectionState() !== "connected" && this.publisher.getConnectionState() !== "connecting" && (this.log.debug("negotiation required, start negotiating", this.logContext), this.publisher.negotiate()), yield Promise.all((i = this.requiredTransports) === null || i === void 0 ? void 0 : i.map((r) => this.ensureTransportConnected(r, e, t)));
        } finally {
          s();
        }
      });
    }
    negotiate(e) {
      return p(this, void 0, void 0, function* () {
        return new Ae((t, i) => p(this, void 0, void 0, function* () {
          const s = setTimeout(() => {
            i(new ki("negotiation timed out"));
          }, this.peerConnectionTimeout), r = () => {
            clearTimeout(s), i(new ki("negotiation aborted"));
          };
          e.signal.addEventListener("abort", r), this.publisher.once(wi.NegotiationStarted, () => {
            e.signal.aborted || this.publisher.once(wi.NegotiationComplete, () => {
              clearTimeout(s), t();
            });
          }), yield this.publisher.negotiate((o) => {
            clearTimeout(s), o instanceof Error ? i(o) : i(new Error(String(o)));
          });
        }));
      });
    }
    addPublisherTransceiver(e, t) {
      return this.publisher.addTransceiver(e, t);
    }
    addPublisherTransceiverOfKind(e, t) {
      return this.publisher.addTransceiverOfKind(e, t);
    }
    getMidForReceiver(e) {
      const i = (this.subscriber ? this.subscriber.getTransceivers() : this.publisher.getTransceivers()).find((s) => s.receiver === e);
      return i == null ? void 0 : i.mid;
    }
    addPublisherTrack(e) {
      return this.publisher.addTrack(e);
    }
    createPublisherDataChannel(e, t) {
      return this.publisher.createDataChannel(e, t);
    }
    getConnectedAddress(e) {
      return e === nt.PUBLISHER ? this.publisher.getConnectedAddress() : e === nt.SUBSCRIBER ? this.publisher.getConnectedAddress() : this.requiredTransports[0].getConnectedAddress();
    }
    get requiredTransports() {
      const e = [];
      return this.isPublisherConnectionRequired && e.push(this.publisher), this.isSubscriberConnectionRequired && this.subscriber && e.push(this.subscriber), e;
    }
    ensureTransportConnected(e, t) {
      return p(this, arguments, void 0, function(i, s) {
        var r = this;
        let o = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : this.peerConnectionTimeout;
        return function* () {
          if (i.getConnectionState() !== "connected") return new Promise((c, d) => p(r, void 0, void 0, function* () {
            const l = () => {
              this.log.warn("abort transport connection", this.logContext), Ie.clearTimeout(u), d(F.cancelled("room connection has been cancelled"));
            };
            (s == null ? void 0 : s.signal.aborted) && l(), s == null ? void 0 : s.signal.addEventListener("abort", l);
            const u = Ie.setTimeout(() => {
              s == null ? void 0 : s.signal.removeEventListener("abort", l), d(F.internal("could not establish pc connection"));
            }, o);
            for (; this.state !== ue.CONNECTED; ) if (yield xe(50), s == null ? void 0 : s.signal.aborted) {
              d(F.cancelled("room connection has been cancelled"));
              return;
            }
            Ie.clearTimeout(u), s == null ? void 0 : s.signal.removeEventListener("abort", l), c();
          }));
        }();
      });
    }
  }
  const gc = 5e3, mh = 3e4;
  class ee {
    static fetchRegionSettings(e, t, i) {
      return p(this, void 0, void 0, function* () {
        const s = yield ee.fetchLock.lock();
        try {
          const r = yield fetch("".concat(fh(e), "/regions"), {
            headers: {
              authorization: "Bearer ".concat(t)
            },
            signal: i
          });
          if (r.ok) {
            const o = Du(r.headers), a = o ? o * 1e3 : gc;
            return {
              regionSettings: yield r.json(),
              updatedAtInMs: Date.now(),
              maxAgeInMs: a
            };
          } else throw r.status === 401 ? F.notAllowed("Could not fetch region settings: ".concat(r.statusText), r.status) : F.internal("Could not fetch region settings: ".concat(r.statusText));
        } catch (r) {
          throw r instanceof F ? r : (i == null ? void 0 : i.aborted) ? F.cancelled("Region fetching was aborted") : F.serverUnreachable("Could not fetch region settings, ".concat(r instanceof Error ? "".concat(r.name, ": ").concat(r.message) : r));
        } finally {
          s();
        }
      });
    }
    static scheduleRefetch(e, t, i) {
      return p(this, void 0, void 0, function* () {
        const s = ee.settingsTimeouts.get(e.hostname);
        clearTimeout(s), ee.settingsTimeouts.set(e.hostname, setTimeout(() => p(this, void 0, void 0, function* () {
          try {
            const r = yield ee.fetchRegionSettings(e, t);
            ee.updateCachedRegionSettings(e, t, r);
          } catch (r) {
            if (r instanceof F && r.reason === ce.NotAllowed) {
              H.debug("token is not valid, cancelling auto region refresh");
              return;
            }
            H.debug("auto refetching of region settings failed", {
              error: r
            }), ee.scheduleRefetch(e, t, i);
          }
        }), i));
      });
    }
    static updateCachedRegionSettings(e, t, i) {
      ee.cache.set(e.hostname, i), ee.scheduleRefetch(e, t, i.maxAgeInMs);
    }
    static stopRefetch(e) {
      const t = ee.settingsTimeouts.get(e);
      t && (clearTimeout(t), ee.settingsTimeouts.delete(e));
    }
    static scheduleCleanup(e) {
      let t = ee.connectionTrackers.get(e);
      t && (t.cleanupTimeout && clearTimeout(t.cleanupTimeout), t.cleanupTimeout = setTimeout(() => {
        const i = ee.connectionTrackers.get(e);
        i && i.connectionCount === 0 && (H.debug("stopping region refetch after disconnect delay", {
          hostname: e
        }), ee.stopRefetch(e)), i && (i.cleanupTimeout = void 0);
      }, mh));
    }
    static cancelCleanup(e) {
      const t = ee.connectionTrackers.get(e);
      (t == null ? void 0 : t.cleanupTimeout) && (clearTimeout(t.cleanupTimeout), t.cleanupTimeout = void 0);
    }
    notifyConnected() {
      const e = this.serverUrl.hostname;
      let t = ee.connectionTrackers.get(e);
      t || (t = {
        connectionCount: 0
      }, ee.connectionTrackers.set(e, t)), t.connectionCount++, ee.cancelCleanup(e);
    }
    notifyDisconnected() {
      const e = this.serverUrl.hostname, t = ee.connectionTrackers.get(e);
      t && (t.connectionCount = Math.max(0, t.connectionCount - 1), t.connectionCount === 0 && ee.scheduleCleanup(e));
    }
    constructor(e, t) {
      this.attemptedRegions = [], this.serverUrl = new URL(e), this.token = t;
    }
    updateToken(e) {
      this.token = e;
    }
    isCloud() {
      return Ri(this.serverUrl);
    }
    getServerUrl() {
      return this.serverUrl;
    }
    fetchRegionSettings(e) {
      return p(this, void 0, void 0, function* () {
        return ee.fetchRegionSettings(this.serverUrl, this.token, e);
      });
    }
    getNextBestRegionUrl(e) {
      return p(this, void 0, void 0, function* () {
        if (!this.isCloud()) throw Error("region availability is only supported for LiveKit Cloud domains");
        let t = ee.cache.get(this.serverUrl.hostname);
        (!t || Date.now() - t.updatedAtInMs > t.maxAgeInMs) && (t = yield this.fetchRegionSettings(e), ee.updateCachedRegionSettings(this.serverUrl, this.token, t));
        const i = t.regionSettings.regions.filter((s) => !this.attemptedRegions.find((r) => r.url === s.url));
        if (i.length > 0) {
          const s = i[0];
          return this.attemptedRegions.push(s), H.debug("next region: ".concat(s.region)), s.url;
        } else return null;
      });
    }
    resetAttempts() {
      this.attemptedRegions = [];
    }
    setServerReportedRegions(e) {
      ee.updateCachedRegionSettings(this.serverUrl, this.token, e);
    }
  }
  ee.cache = /* @__PURE__ */ new Map();
  ee.settingsTimeouts = /* @__PURE__ */ new Map();
  ee.connectionTrackers = /* @__PURE__ */ new Map();
  ee.fetchLock = new je();
  function fh(n) {
    return "".concat(n.protocol.replace("ws", "http"), "//").concat(n.host, "/settings");
  }
  class pe extends Error {
    constructor(e, t, i) {
      super(t), this.code = e, this.message = ma(t, pe.MAX_MESSAGE_BYTES), this.data = i ? ma(i, pe.MAX_DATA_BYTES) : void 0;
    }
    static fromProto(e) {
      return new pe(e.code, e.message, e.data);
    }
    toProto() {
      return new no({
        code: this.code,
        message: this.message,
        data: this.data
      });
    }
    static builtIn(e, t) {
      return new pe(pe.ErrorCode[e], pe.ErrorMessage[e], t);
    }
  }
  pe.MAX_MESSAGE_BYTES = 256;
  pe.MAX_DATA_BYTES = 15360;
  pe.ErrorCode = {
    APPLICATION_ERROR: 1500,
    CONNECTION_TIMEOUT: 1501,
    RESPONSE_TIMEOUT: 1502,
    RECIPIENT_DISCONNECTED: 1503,
    RESPONSE_PAYLOAD_TOO_LARGE: 1504,
    SEND_FAILED: 1505,
    UNSUPPORTED_METHOD: 1400,
    RECIPIENT_NOT_FOUND: 1401,
    REQUEST_PAYLOAD_TOO_LARGE: 1402,
    UNSUPPORTED_SERVER: 1403,
    UNSUPPORTED_VERSION: 1404
  };
  pe.ErrorMessage = {
    APPLICATION_ERROR: "Application error in method handler",
    CONNECTION_TIMEOUT: "Connection timeout",
    RESPONSE_TIMEOUT: "Response timeout",
    RECIPIENT_DISCONNECTED: "Recipient disconnected",
    RESPONSE_PAYLOAD_TOO_LARGE: "Response payload too large",
    SEND_FAILED: "Failed to send",
    UNSUPPORTED_METHOD: "Method not supported at destination",
    RECIPIENT_NOT_FOUND: "Recipient not found",
    REQUEST_PAYLOAD_TOO_LARGE: "Request payload too large",
    UNSUPPORTED_SERVER: "RPC not supported by server",
    UNSUPPORTED_VERSION: "Unsupported RPC version"
  };
  const vc = 15360;
  function or(n) {
    return new TextEncoder().encode(n).length;
  }
  function ma(n, e) {
    if (or(n) <= e) return n;
    let t = 0, i = n.length;
    const s = new TextEncoder();
    for (; t < i; ) {
      const r = Math.floor((t + i + 1) / 2);
      s.encode(n.slice(0, r)).length <= e ? t = r : i = r - 1;
    }
    return n.slice(0, t);
  }
  const cr = 2e3;
  function jn(n, e) {
    if (!e) return 0;
    let t, i;
    return "bytesReceived" in n ? (t = n.bytesReceived, i = e.bytesReceived) : "bytesSent" in n && (t = n.bytesSent, i = e.bytesSent), t === void 0 || i === void 0 || n.timestamp === void 0 || e.timestamp === void 0 ? 0 : (t - i) * 8 * 1e3 / (n.timestamp - e.timestamp);
  }
  const dr = typeof MediaRecorder < "u";
  class gh {
    constructor() {
      throw new Error("MediaRecorder is not available in this environment");
    }
  }
  const vh = dr ? MediaRecorder : gh;
  class yh extends vh {
    constructor(e, t) {
      if (!dr) throw new Error("MediaRecorder is not available in this environment");
      super(new MediaStream([
        e.mediaStreamTrack
      ]), t);
      let i, s;
      const r = () => s === void 0, o = () => {
        this.removeEventListener("dataavailable", i), this.removeEventListener("stop", o), this.removeEventListener("error", a), s == null ? void 0 : s.close(), s = void 0;
      }, a = (c) => {
        s == null ? void 0 : s.error(c), this.removeEventListener("dataavailable", i), this.removeEventListener("stop", o), this.removeEventListener("error", a), s = void 0;
      };
      this.byteStream = new ReadableStream({
        start: (c) => {
          s = c, i = (d) => p(this, void 0, void 0, function* () {
            let l;
            if (d.data.arrayBuffer) {
              const u = yield d.data.arrayBuffer();
              l = new Uint8Array(u);
            } else if (d.data.byteArray) l = d.data.byteArray;
            else throw new Error("no data available!");
            r() || c.enqueue(l);
          }), this.addEventListener("dataavailable", i);
        },
        cancel: () => {
          o();
        }
      }), this.addEventListener("stop", o), this.addEventListener("error", a);
    }
  }
  function bh() {
    return dr;
  }
  const kh = 1e3, Sh = 1e4;
  class yc extends C {
    get sender() {
      return this._sender;
    }
    set sender(e) {
      this._sender = e;
    }
    get constraints() {
      return this._constraints;
    }
    get hasPreConnectBuffer() {
      return !!this.localTrackRecorder;
    }
    constructor(e, t, i) {
      let s = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : false, r = arguments.length > 4 ? arguments[4] : void 0;
      super(e, t, r), this.manuallyStopped = false, this._isUpstreamPaused = false, this.handleTrackMuteEvent = () => this.debouncedTrackMuteHandler().catch(() => this.log.debug("track mute bounce got cancelled by an unmute event", this.logContext)), this.debouncedTrackMuteHandler = sr(() => p(this, void 0, void 0, function* () {
        yield this.pauseUpstream();
      }), 5e3), this.handleTrackUnmuteEvent = () => p(this, void 0, void 0, function* () {
        this.debouncedTrackMuteHandler.cancel("unmute"), yield this.resumeUpstream();
      }), this.handleEnded = () => {
        this.isInBackground && (this.reacquireTrack = true), this._mediaStreamTrack.removeEventListener("mute", this.handleTrackMuteEvent), this._mediaStreamTrack.removeEventListener("unmute", this.handleTrackUnmuteEvent), this.emit(x.Ended, this);
      }, this.reacquireTrack = false, this.providedByUser = s, this.muteLock = new je(), this.pauseUpstreamLock = new je(), this.trackChangeLock = new je(), this.trackChangeLock.lock().then((o) => p(this, void 0, void 0, function* () {
        try {
          yield this.setMediaStreamTrack(e, true);
        } finally {
          o();
        }
      })), this._constraints = e.getConstraints(), i && (this._constraints = i);
    }
    get id() {
      return this._mediaStreamTrack.id;
    }
    get dimensions() {
      if (this.kind !== C.Kind.Video) return;
      const { width: e, height: t } = this._mediaStreamTrack.getSettings();
      if (e && t) return {
        width: e,
        height: t
      };
    }
    get isUpstreamPaused() {
      return this._isUpstreamPaused;
    }
    get isUserProvided() {
      return this.providedByUser;
    }
    get mediaStreamTrack() {
      var e, t;
      return (t = (e = this.processor) === null || e === void 0 ? void 0 : e.processedTrack) !== null && t !== void 0 ? t : this._mediaStreamTrack;
    }
    get isLocal() {
      return true;
    }
    getSourceTrackSettings() {
      return this._mediaStreamTrack.getSettings();
    }
    setMediaStreamTrack(e, t) {
      return p(this, void 0, void 0, function* () {
        var i;
        if (e === this._mediaStreamTrack && !t) return;
        this._mediaStreamTrack && (this.attachedElements.forEach((r) => {
          Si(this._mediaStreamTrack, r);
        }), this.debouncedTrackMuteHandler.cancel("new-track"), this._mediaStreamTrack.removeEventListener("ended", this.handleEnded), this._mediaStreamTrack.removeEventListener("mute", this.handleTrackMuteEvent), this._mediaStreamTrack.removeEventListener("unmute", this.handleTrackUnmuteEvent)), this.mediaStream = new MediaStream([
          e
        ]), e && (e.addEventListener("ended", this.handleEnded), e.addEventListener("mute", this.handleTrackMuteEvent), e.addEventListener("unmute", this.handleTrackUnmuteEvent), this._constraints = e.getConstraints());
        let s;
        if (this.processor && e) {
          if (this.log.debug("restarting processor", this.logContext), this.kind === "unknown") throw TypeError("cannot set processor on track of unknown kind");
          this.processorElement && (pi(e, this.processorElement), this.processorElement.muted = true), yield this.processor.restart({
            track: e,
            kind: this.kind,
            element: this.processorElement
          }), s = this.processor.processedTrack;
        }
        this.sender && ((i = this.sender.transport) === null || i === void 0 ? void 0 : i.state) !== "closed" && (yield this.sender.replaceTrack(s ?? e)), !this.providedByUser && this._mediaStreamTrack !== e && this._mediaStreamTrack.stop(), this._mediaStreamTrack = e, e && (this._mediaStreamTrack.enabled = !this.isMuted, yield this.resumeUpstream(), this.attachedElements.forEach((r) => {
          pi(s ?? e, r);
        }));
      });
    }
    waitForDimensions() {
      return p(this, arguments, void 0, function() {
        var e = this;
        let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : kh;
        return function* () {
          var i;
          if (e.kind === C.Kind.Audio) throw new Error("cannot get dimensions for audio tracks");
          ((i = We()) === null || i === void 0 ? void 0 : i.os) === "iOS" && (yield xe(10));
          const s = Date.now();
          for (; Date.now() - s < t; ) {
            const r = e.dimensions;
            if (r) return r;
            yield xe(50);
          }
          throw new Tt("unable to get track dimensions after timeout");
        }();
      });
    }
    setDeviceId(e) {
      return p(this, void 0, void 0, function* () {
        return this._constraints.deviceId === e && this._mediaStreamTrack.getSettings().deviceId === Ft(e) || (this._constraints.deviceId = e, this.isMuted) ? true : (yield this.restartTrack(), Ft(e) === this._mediaStreamTrack.getSettings().deviceId);
      });
    }
    getDeviceId() {
      return p(this, arguments, void 0, function() {
        var e = this;
        let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : true;
        return function* () {
          if (e.source === C.Source.ScreenShare) return;
          const { deviceId: i, groupId: s } = e._mediaStreamTrack.getSettings(), r = e.kind === C.Kind.Audio ? "audioinput" : "videoinput";
          return t ? Ee.getInstance().normalizeDeviceId(r, i, s) : i;
        }();
      });
    }
    mute() {
      return p(this, void 0, void 0, function* () {
        return this.setTrackMuted(true), this;
      });
    }
    unmute() {
      return p(this, void 0, void 0, function* () {
        return this.setTrackMuted(false), this;
      });
    }
    replaceTrack(e, t) {
      return p(this, void 0, void 0, function* () {
        const i = yield this.trackChangeLock.lock();
        try {
          if (!this.sender) throw new Tt("unable to replace an unpublished track");
          let s, r;
          return typeof t == "boolean" ? s = t : t !== void 0 && (s = t.userProvidedTrack, r = t.stopProcessor), this.providedByUser = s ?? true, this.log.debug("replace MediaStreamTrack", this.logContext), yield this.setMediaStreamTrack(e), r && this.processor && (yield this.internalStopProcessor()), this;
        } finally {
          i();
        }
      });
    }
    restart(e) {
      return p(this, void 0, void 0, function* () {
        this.manuallyStopped = false;
        const t = yield this.trackChangeLock.lock();
        try {
          e || (e = this._constraints);
          const { deviceId: i, facingMode: s } = e, r = Bl(e, [
            "deviceId",
            "facingMode"
          ]);
          this.log.debug("restarting track with constraints", Object.assign(Object.assign({}, this.logContext), {
            constraints: e
          }));
          const o = {
            audio: false,
            video: false
          };
          this.kind === C.Kind.Video ? o.video = i || s ? {
            deviceId: i,
            facingMode: s
          } : true : o.audio = i ? Object.assign({
            deviceId: i
          }, r) : true, this.attachedElements.forEach((d) => {
            Si(this.mediaStreamTrack, d);
          }), this._mediaStreamTrack.removeEventListener("ended", this.handleEnded), this._mediaStreamTrack.stop();
          const c = (yield navigator.mediaDevices.getUserMedia(o)).getTracks()[0];
          return this.kind === C.Kind.Video && (yield c.applyConstraints(r)), c.addEventListener("ended", this.handleEnded), this.log.debug("re-acquired MediaStreamTrack", this.logContext), yield this.setMediaStreamTrack(c), this._constraints = e, this.emit(x.Restarted, this), this.manuallyStopped && (this.log.warn("track was stopped during a restart, stopping restarted track", this.logContext), this.stop()), this;
        } finally {
          t();
        }
      });
    }
    setTrackMuted(e) {
      this.log.debug("setting ".concat(this.kind, " track ").concat(e ? "muted" : "unmuted"), this.logContext), !(this.isMuted === e && this._mediaStreamTrack.enabled !== e) && (this.isMuted = e, this._mediaStreamTrack.enabled = !e, this.emit(e ? x.Muted : x.Unmuted, this));
    }
    get needsReAcquisition() {
      return this._mediaStreamTrack.readyState !== "live" || this._mediaStreamTrack.muted || !this._mediaStreamTrack.enabled || this.reacquireTrack;
    }
    handleAppVisibilityChanged() {
      const e = Object.create(null, {
        handleAppVisibilityChanged: {
          get: () => super.handleAppVisibilityChanged
        }
      });
      return p(this, void 0, void 0, function* () {
        yield e.handleAppVisibilityChanged.call(this), lc() && (this.log.debug("visibility changed, is in Background: ".concat(this.isInBackground), this.logContext), !this.isInBackground && this.needsReAcquisition && !this.isUserProvided && !this.isMuted && (this.log.debug("track needs to be reacquired, restarting ".concat(this.source), this.logContext), yield this.restart(), this.reacquireTrack = false));
      });
    }
    stop() {
      var e;
      this.manuallyStopped = true, super.stop(), this._mediaStreamTrack.removeEventListener("ended", this.handleEnded), this._mediaStreamTrack.removeEventListener("mute", this.handleTrackMuteEvent), this._mediaStreamTrack.removeEventListener("unmute", this.handleTrackUnmuteEvent), (e = this.processor) === null || e === void 0 || e.destroy(), this.processor = void 0;
    }
    pauseUpstream() {
      return p(this, void 0, void 0, function* () {
        var e;
        const t = yield this.pauseUpstreamLock.lock();
        try {
          if (this._isUpstreamPaused === true) return;
          if (!this.sender) {
            this.log.warn("unable to pause upstream for an unpublished track", this.logContext);
            return;
          }
          this._isUpstreamPaused = true, this.emit(x.UpstreamPaused, this);
          const i = We();
          if ((i == null ? void 0 : i.name) === "Safari" && ht(i.version, "12.0") < 0) throw new Xs("pauseUpstream is not supported on Safari < 12.");
          ((e = this.sender.transport) === null || e === void 0 ? void 0 : e.state) !== "closed" && (yield this.sender.replaceTrack(null));
        } finally {
          t();
        }
      });
    }
    resumeUpstream() {
      return p(this, void 0, void 0, function* () {
        var e;
        const t = yield this.pauseUpstreamLock.lock();
        try {
          if (this._isUpstreamPaused === false) return;
          if (!this.sender) {
            this.log.warn("unable to resume upstream for an unpublished track", this.logContext);
            return;
          }
          this._isUpstreamPaused = false, this.emit(x.UpstreamResumed, this), ((e = this.sender.transport) === null || e === void 0 ? void 0 : e.state) !== "closed" && (yield this.sender.replaceTrack(this.mediaStreamTrack));
        } finally {
          t();
        }
      });
    }
    getRTCStatsReport() {
      return p(this, void 0, void 0, function* () {
        var e;
        return !((e = this.sender) === null || e === void 0) && e.getStats ? yield this.sender.getStats() : void 0;
      });
    }
    setProcessor(e) {
      return p(this, arguments, void 0, function(t) {
        var i = this;
        let s = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true;
        return function* () {
          var r;
          const o = yield i.trackChangeLock.lock();
          try {
            i.log.debug("setting up processor", i.logContext);
            const a = document.createElement(i.kind), c = {
              kind: i.kind,
              track: i._mediaStreamTrack,
              element: a,
              audioContext: i.audioContext
            };
            if (yield t.init(c), i.log.debug("processor initialized", i.logContext), i.processor && (yield i.internalStopProcessor()), i.kind === "unknown") throw TypeError("cannot set processor on track of unknown kind");
            if (pi(i._mediaStreamTrack, a), a.muted = true, a.play().catch((d) => {
              d instanceof DOMException && d.name === "AbortError" ? (i.log.warn("failed to play processor element, retrying", Object.assign(Object.assign({}, i.logContext), {
                error: d
              })), setTimeout(() => {
                a.play().catch((l) => {
                  i.log.error("failed to play processor element", Object.assign(Object.assign({}, i.logContext), {
                    err: l
                  }));
                });
              }, 100)) : i.log.error("failed to play processor element", Object.assign(Object.assign({}, i.logContext), {
                error: d
              }));
            }), i.processor = t, i.processorElement = a, i.processor.processedTrack) {
              for (const d of i.attachedElements) d !== i.processorElement && s && (Si(i._mediaStreamTrack, d), pi(i.processor.processedTrack, d));
              yield (r = i.sender) === null || r === void 0 ? void 0 : r.replaceTrack(i.processor.processedTrack);
            }
            i.emit(x.TrackProcessorUpdate, i.processor);
          } finally {
            o();
          }
        }();
      });
    }
    getProcessor() {
      return this.processor;
    }
    stopProcessor() {
      return p(this, arguments, void 0, function() {
        var e = this;
        let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : true;
        return function* () {
          const i = yield e.trackChangeLock.lock();
          try {
            yield e.internalStopProcessor(t);
          } finally {
            i();
          }
        }();
      });
    }
    internalStopProcessor() {
      return p(this, arguments, void 0, function() {
        var e = this;
        let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : true;
        return function* () {
          var i, s;
          e.processor && (e.log.debug("stopping processor", e.logContext), (i = e.processor.processedTrack) === null || i === void 0 || i.stop(), yield e.processor.destroy(), e.processor = void 0, t || ((s = e.processorElement) === null || s === void 0 || s.remove(), e.processorElement = void 0), yield e._mediaStreamTrack.applyConstraints(e._constraints), yield e.setMediaStreamTrack(e._mediaStreamTrack, true), e.emit(x.TrackProcessorUpdate));
        }();
      });
    }
    startPreConnectBuffer() {
      let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 100;
      if (!bh()) {
        this.log.warn("MediaRecorder is not available, cannot start preconnect buffer", this.logContext);
        return;
      }
      if (this.localTrackRecorder) {
        this.log.warn("preconnect buffer already started");
        return;
      } else {
        let t = "audio/webm;codecs=opus";
        MediaRecorder.isTypeSupported(t) || (t = "video/mp4"), this.localTrackRecorder = new yh(this, {
          mimeType: t
        });
      }
      this.localTrackRecorder.start(e), this.autoStopPreConnectBuffer = setTimeout(() => {
        this.log.warn("preconnect buffer timed out, stopping recording automatically", this.logContext), this.stopPreConnectBuffer();
      }, Sh);
    }
    stopPreConnectBuffer() {
      clearTimeout(this.autoStopPreConnectBuffer), this.localTrackRecorder && (this.localTrackRecorder.stop(), this.localTrackRecorder = void 0);
    }
    getPreConnectBuffer() {
      var e;
      return (e = this.localTrackRecorder) === null || e === void 0 ? void 0 : e.byteStream;
    }
    getPreConnectBufferMimeType() {
      var e;
      return (e = this.localTrackRecorder) === null || e === void 0 ? void 0 : e.mimeType;
    }
  }
  class Pi extends yc {
    get enhancedNoiseCancellation() {
      return this.isKrispNoiseFilterEnabled;
    }
    constructor(e, t) {
      let i = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : true, s = arguments.length > 3 ? arguments[3] : void 0, r = arguments.length > 4 ? arguments[4] : void 0;
      super(e, C.Kind.Audio, t, i, r), this.stopOnMute = false, this.isKrispNoiseFilterEnabled = false, this.monitorSender = () => p(this, void 0, void 0, function* () {
        if (!this.sender) {
          this._currentBitrate = 0;
          return;
        }
        let o;
        try {
          o = yield this.getSenderStats();
        } catch (a) {
          this.log.error("could not get audio sender stats", Object.assign(Object.assign({}, this.logContext), {
            error: a
          }));
          return;
        }
        o && this.prevStats && (this._currentBitrate = jn(o, this.prevStats)), this.prevStats = o;
      }), this.handleKrispNoiseFilterEnable = () => {
        this.isKrispNoiseFilterEnabled = true, this.log.debug("Krisp noise filter enabled", this.logContext), this.emit(x.AudioTrackFeatureUpdate, this, we.TF_ENHANCED_NOISE_CANCELLATION, true);
      }, this.handleKrispNoiseFilterDisable = () => {
        this.isKrispNoiseFilterEnabled = false, this.log.debug("Krisp noise filter disabled", this.logContext), this.emit(x.AudioTrackFeatureUpdate, this, we.TF_ENHANCED_NOISE_CANCELLATION, false);
      }, this.audioContext = s, this.checkForSilence();
    }
    mute() {
      const e = Object.create(null, {
        mute: {
          get: () => super.mute
        }
      });
      return p(this, void 0, void 0, function* () {
        const t = yield this.muteLock.lock();
        try {
          return this.isMuted ? (this.log.debug("Track already muted", this.logContext), this) : (this.source === C.Source.Microphone && this.stopOnMute && !this.isUserProvided && (this.log.debug("stopping mic track", this.logContext), this._mediaStreamTrack.stop()), yield e.mute.call(this), this);
        } finally {
          t();
        }
      });
    }
    unmute() {
      const e = Object.create(null, {
        unmute: {
          get: () => super.unmute
        }
      });
      return p(this, void 0, void 0, function* () {
        const t = yield this.muteLock.lock();
        try {
          if (!this.isMuted) return this.log.debug("Track already unmuted", this.logContext), this;
          const i = this._constraints.deviceId && this._mediaStreamTrack.getSettings().deviceId !== Ft(this._constraints.deviceId);
          return this.source === C.Source.Microphone && (this.stopOnMute || this._mediaStreamTrack.readyState === "ended" || i) && !this.isUserProvided && (this.log.debug("reacquiring mic track", this.logContext), yield this.restartTrack()), yield e.unmute.call(this), this;
        } finally {
          t();
        }
      });
    }
    restartTrack(e) {
      return p(this, void 0, void 0, function* () {
        let t;
        if (e) {
          const i = er({
            audio: e
          });
          typeof i.audio != "boolean" && (t = i.audio);
        }
        yield this.restart(t);
      });
    }
    restart(e) {
      const t = Object.create(null, {
        restart: {
          get: () => super.restart
        }
      });
      return p(this, void 0, void 0, function* () {
        const i = yield t.restart.call(this, e);
        return this.checkForSilence(), i;
      });
    }
    startMonitor() {
      Ge() && (this.monitorInterval || (this.monitorInterval = setInterval(() => {
        this.monitorSender();
      }, cr)));
    }
    setProcessor(e) {
      return p(this, void 0, void 0, function* () {
        var t;
        const i = yield this.trackChangeLock.lock();
        try {
          if (!ut() && !this.audioContext) throw Error("Audio context needs to be set on LocalAudioTrack in order to enable processors");
          this.processor && (yield this.internalStopProcessor());
          const s = {
            kind: this.kind,
            track: this._mediaStreamTrack,
            audioContext: this.audioContext
          };
          this.log.debug("setting up audio processor ".concat(e.name), this.logContext), yield e.init(s), this.processor = e, this.processor.processedTrack && (yield (t = this.sender) === null || t === void 0 ? void 0 : t.replaceTrack(this.processor.processedTrack), this.processor.processedTrack.addEventListener("enable-lk-krisp-noise-filter", this.handleKrispNoiseFilterEnable), this.processor.processedTrack.addEventListener("disable-lk-krisp-noise-filter", this.handleKrispNoiseFilterDisable)), this.emit(x.TrackProcessorUpdate, this.processor);
        } finally {
          i();
        }
      });
    }
    setAudioContext(e) {
      this.audioContext = e;
    }
    getSenderStats() {
      return p(this, void 0, void 0, function* () {
        var e;
        if (!(!((e = this.sender) === null || e === void 0) && e.getStats)) return;
        const t = yield this.sender.getStats();
        let i;
        return t.forEach((s) => {
          s.type === "outbound-rtp" && (i = {
            type: "audio",
            streamId: s.id,
            packetsSent: s.packetsSent,
            packetsLost: s.packetsLost,
            bytesSent: s.bytesSent,
            timestamp: s.timestamp,
            roundTripTime: s.roundTripTime,
            jitter: s.jitter
          });
        }), i;
      });
    }
    checkForSilence() {
      return p(this, void 0, void 0, function* () {
        const e = yield oc(this);
        return e && (this.isMuted || this.log.debug("silence detected on local audio track", this.logContext), this.emit(x.AudioSilenceDetected)), e;
      });
    }
  }
  function Th(n, e, t) {
    switch (n.kind) {
      case "audio":
        return new Pi(n, e, false, void 0, t);
      case "video":
        return new _i(n, e, false, t);
      default:
        throw new Tt("unsupported track type: ".concat(n.kind));
    }
  }
  const Ch = Object.values(Qi), wh = Object.values(Cs), Eh = Object.values(Zs), Rh = [
    Qi.h180,
    Qi.h360
  ], Ph = [
    Cs.h180,
    Cs.h360
  ], _h = (n) => [
    {
      scaleResolutionDownBy: 2,
      fps: n.encoding.maxFramerate
    }
  ].map((t) => {
    var i, s;
    return new ae(Math.floor(n.width / t.scaleResolutionDownBy), Math.floor(n.height / t.scaleResolutionDownBy), Math.max(15e4, Math.floor(n.encoding.maxBitrate / (Math.pow(t.scaleResolutionDownBy, 2) * (((i = n.encoding.maxFramerate) !== null && i !== void 0 ? i : 30) / ((s = t.fps) !== null && s !== void 0 ? s : 30))))), t.fps, n.encoding.priority);
  }), Os = [
    "q",
    "h",
    "f"
  ];
  function Ds(n, e, t, i) {
    var s, r;
    let o = i == null ? void 0 : i.videoEncoding;
    n && (o = i == null ? void 0 : i.screenShareEncoding);
    const a = i == null ? void 0 : i.simulcast, c = i == null ? void 0 : i.scalabilityMode, d = i == null ? void 0 : i.videoCodec;
    if (!o && !a && !c || !e || !t) return [
      {}
    ];
    o || (o = xh(n, e, t, d), H.debug("using video encoding", o));
    const l = o.maxFramerate, u = new ae(e, t, o.maxBitrate, o.maxFramerate, o.priority);
    if (c && st(d)) {
      const v = new bc(c), g = [];
      if (v.spatial > 3) throw new Error("unsupported scalabilityMode: ".concat(c));
      const T = We();
      if (Yi() || ut() || (T == null ? void 0 : T.name) === "Chrome" && ht(T == null ? void 0 : T.version, "113") < 0) {
        const S = v.suffix == "h" ? 2 : 3, I = Su(T);
        for (let P = 0; P < v.spatial; P += 1) g.push({
          rid: Os[2 - P],
          maxBitrate: o.maxBitrate / Math.pow(S, P),
          maxFramerate: u.encoding.maxFramerate,
          scaleResolutionDownBy: I ? Math.pow(2, P) : void 0
        });
        g[0].scalabilityMode = c;
      } else g.push({
        maxBitrate: o.maxBitrate,
        maxFramerate: u.encoding.maxFramerate,
        scalabilityMode: c
      });
      return u.encoding.priority && (g[0].priority = u.encoding.priority, g[0].networkPriority = u.encoding.priority), H.debug("using svc encoding", {
        encodings: g
      }), g;
    }
    if (!a) return [
      o
    ];
    let h = [];
    n ? h = (s = ga(i == null ? void 0 : i.screenShareSimulcastLayers)) !== null && s !== void 0 ? s : fa(n, u) : h = (r = ga(i == null ? void 0 : i.videoSimulcastLayers)) !== null && r !== void 0 ? r : fa(n, u);
    let m;
    if (h.length > 0) {
      const v = h[0];
      h.length > 1 && ([, m] = h);
      const g = Math.max(e, t);
      if (g >= 960 && m) return rs(e, t, [
        v,
        m,
        u
      ], l);
      if (g >= 480) return rs(e, t, [
        v,
        u
      ], l);
    }
    return rs(e, t, [
      u
    ]);
  }
  function Ih(n, e, t) {
    var i, s, r, o;
    if (!t.backupCodec || t.backupCodec === true || t.backupCodec.codec === t.videoCodec) return;
    e !== t.backupCodec.codec && H.warn("requested a different codec than specified as backup", {
      serverRequested: e,
      backup: t.backupCodec.codec
    }), t.videoCodec = e, t.videoEncoding = t.backupCodec.encoding;
    const a = n.mediaStreamTrack.getSettings(), c = (i = a.width) !== null && i !== void 0 ? i : (s = n.dimensions) === null || s === void 0 ? void 0 : s.width, d = (r = a.height) !== null && r !== void 0 ? r : (o = n.dimensions) === null || o === void 0 ? void 0 : o.height;
    return n.source === C.Source.ScreenShare && t.simulcast && (t.simulcast = false), Ds(n.source === C.Source.ScreenShare, c, d, t);
  }
  function xh(n, e, t, i) {
    const s = Mh(n, e, t);
    let { encoding: r } = s[0];
    const o = Math.max(e, t);
    for (let a = 0; a < s.length; a += 1) {
      const c = s[a];
      if (r = c.encoding, c.width >= o) break;
    }
    if (i) switch (i) {
      case "av1":
      case "h265":
        r = Object.assign({}, r), r.maxBitrate = r.maxBitrate * 0.7;
        break;
      case "vp9":
        r = Object.assign({}, r), r.maxBitrate = r.maxBitrate * 0.85;
        break;
    }
    return r;
  }
  function Mh(n, e, t) {
    if (n) return Eh;
    const i = e > t ? e / t : t / e;
    return Math.abs(i - 16 / 9) < Math.abs(i - 4 / 3) ? Ch : wh;
  }
  function fa(n, e) {
    if (n) return _h(e);
    const { width: t, height: i } = e, s = t > i ? t / i : i / t;
    return Math.abs(s - 16 / 9) < Math.abs(s - 4 / 3) ? Rh : Ph;
  }
  function rs(n, e, t, i) {
    const s = [];
    if (t.forEach((r, o) => {
      if (o >= Os.length) return;
      const a = Math.min(n, e), d = {
        rid: Os[o],
        scaleResolutionDownBy: Math.max(1, a / Math.min(r.width, r.height)),
        maxBitrate: r.encoding.maxBitrate
      }, l = i && r.encoding.maxFramerate ? Math.min(i, r.encoding.maxFramerate) : r.encoding.maxFramerate;
      l && (d.maxFramerate = l);
      const u = ni() || o === 0;
      r.encoding.priority && u && (d.priority = r.encoding.priority, d.networkPriority = r.encoding.priority), s.push(d);
    }), ut() && hc() === "ios") {
      let r;
      s.forEach((a) => {
        r ? a.maxFramerate && a.maxFramerate > r && (r = a.maxFramerate) : r = a.maxFramerate;
      });
      let o = true;
      s.forEach((a) => {
        var c;
        a.maxFramerate != r && (o && (o = false, H.info("Simulcast on iOS React-Native requires all encodings to share the same framerate.")), H.info('Setting framerate of encoding "'.concat((c = a.rid) !== null && c !== void 0 ? c : "", '" to ').concat(r)), a.maxFramerate = r);
      });
    }
    return s;
  }
  function ga(n) {
    if (n) return n.sort((e, t) => {
      const { encoding: i } = e, { encoding: s } = t;
      return i.maxBitrate > s.maxBitrate ? 1 : i.maxBitrate < s.maxBitrate ? -1 : i.maxBitrate === s.maxBitrate && i.maxFramerate && s.maxFramerate ? i.maxFramerate > s.maxFramerate ? 1 : -1 : 0;
    });
  }
  class bc {
    constructor(e) {
      const t = e.match(/^L(\d)T(\d)(h|_KEY|_KEY_SHIFT){0,1}$/);
      if (!t) throw new Error("invalid scalability mode");
      if (this.spatial = parseInt(t[1]), this.temporal = parseInt(t[2]), t.length > 3) switch (t[3]) {
        case "h":
        case "_KEY":
        case "_KEY_SHIFT":
          this.suffix = t[3];
      }
    }
    toString() {
      var e;
      return "L".concat(this.spatial, "T").concat(this.temporal).concat((e = this.suffix) !== null && e !== void 0 ? e : "");
    }
  }
  function Oh(n) {
    return n.source === C.Source.ScreenShare || n.constraints.height && Ft(n.constraints.height) >= 1080 ? "maintain-resolution" : "balanced";
  }
  const Dh = 5e3;
  class _i extends yc {
    get sender() {
      return this._sender;
    }
    set sender(e) {
      this._sender = e, this.degradationPreference && this.setDegradationPreference(this.degradationPreference);
    }
    constructor(e, t) {
      let i = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : true, s = arguments.length > 3 ? arguments[3] : void 0;
      super(e, C.Kind.Video, t, i, s), this.simulcastCodecs = /* @__PURE__ */ new Map(), this.degradationPreference = "balanced", this.isCpuConstrained = false, this.optimizeForPerformance = false, this.monitorSender = () => p(this, void 0, void 0, function* () {
        if (!this.sender) {
          this._currentBitrate = 0;
          return;
        }
        let r;
        try {
          r = yield this.getSenderStats();
        } catch (c) {
          this.log.error("could not get video sender stats", Object.assign(Object.assign({}, this.logContext), {
            error: c
          }));
          return;
        }
        const o = new Map(r.map((c) => [
          c.rid,
          c
        ])), a = r.some((c) => c.qualityLimitationReason === "cpu");
        if (a !== this.isCpuConstrained && (this.isCpuConstrained = a, this.isCpuConstrained && this.emit(x.CpuConstrained)), this.prevStats) {
          let c = 0;
          o.forEach((d, l) => {
            var u;
            const h = (u = this.prevStats) === null || u === void 0 ? void 0 : u.get(l);
            c += jn(d, h);
          }), this._currentBitrate = c;
        }
        this.prevStats = o;
      }), this.senderLock = new je();
    }
    get isSimulcast() {
      return !!(this.sender && this.sender.getParameters().encodings.length > 1);
    }
    startMonitor(e) {
      var t;
      if (this.signalClient = e, !Ge()) return;
      const i = (t = this.sender) === null || t === void 0 ? void 0 : t.getParameters();
      i && (this.encodings = i.encodings), !this.monitorInterval && (this.monitorInterval = setInterval(() => {
        this.monitorSender();
      }, cr));
    }
    stop() {
      this._mediaStreamTrack.getConstraints(), this.simulcastCodecs.forEach((e) => {
        e.mediaStreamTrack.stop();
      }), super.stop();
    }
    pauseUpstream() {
      const e = Object.create(null, {
        pauseUpstream: {
          get: () => super.pauseUpstream
        }
      });
      return p(this, void 0, void 0, function* () {
        var t, i, s, r, o;
        yield e.pauseUpstream.call(this);
        try {
          for (var a = true, c = St(this.simulcastCodecs.values()), d; d = yield c.next(), t = d.done, !t; a = true) r = d.value, a = false, yield (o = r.sender) === null || o === void 0 ? void 0 : o.replaceTrack(null);
        } catch (l) {
          i = {
            error: l
          };
        } finally {
          try {
            !a && !t && (s = c.return) && (yield s.call(c));
          } finally {
            if (i) throw i.error;
          }
        }
      });
    }
    resumeUpstream() {
      const e = Object.create(null, {
        resumeUpstream: {
          get: () => super.resumeUpstream
        }
      });
      return p(this, void 0, void 0, function* () {
        var t, i, s, r, o;
        yield e.resumeUpstream.call(this);
        try {
          for (var a = true, c = St(this.simulcastCodecs.values()), d; d = yield c.next(), t = d.done, !t; a = true) {
            r = d.value, a = false;
            const l = r;
            yield (o = l.sender) === null || o === void 0 ? void 0 : o.replaceTrack(l.mediaStreamTrack);
          }
        } catch (l) {
          i = {
            error: l
          };
        } finally {
          try {
            !a && !t && (s = c.return) && (yield s.call(c));
          } finally {
            if (i) throw i.error;
          }
        }
      });
    }
    mute() {
      const e = Object.create(null, {
        mute: {
          get: () => super.mute
        }
      });
      return p(this, void 0, void 0, function* () {
        const t = yield this.muteLock.lock();
        try {
          return this.isMuted ? (this.log.debug("Track already muted", this.logContext), this) : (this.source === C.Source.Camera && !this.isUserProvided && (this.log.debug("stopping camera track", this.logContext), this._mediaStreamTrack.stop()), yield e.mute.call(this), this);
        } finally {
          t();
        }
      });
    }
    unmute() {
      const e = Object.create(null, {
        unmute: {
          get: () => super.unmute
        }
      });
      return p(this, void 0, void 0, function* () {
        const t = yield this.muteLock.lock();
        try {
          return this.isMuted ? (this.source === C.Source.Camera && !this.isUserProvided && (this.log.debug("reacquiring camera track", this.logContext), yield this.restartTrack()), yield e.unmute.call(this), this) : (this.log.debug("Track already unmuted", this.logContext), this);
        } finally {
          t();
        }
      });
    }
    setTrackMuted(e) {
      super.setTrackMuted(e);
      for (const t of this.simulcastCodecs.values()) t.mediaStreamTrack.enabled = !e;
    }
    getSenderStats() {
      return p(this, void 0, void 0, function* () {
        var e;
        if (!(!((e = this.sender) === null || e === void 0) && e.getStats)) return [];
        const t = [], i = yield this.sender.getStats();
        return i.forEach((s) => {
          var r;
          if (s.type === "outbound-rtp") {
            const o = {
              type: "video",
              streamId: s.id,
              frameHeight: s.frameHeight,
              frameWidth: s.frameWidth,
              framesPerSecond: s.framesPerSecond,
              framesSent: s.framesSent,
              firCount: s.firCount,
              pliCount: s.pliCount,
              nackCount: s.nackCount,
              packetsSent: s.packetsSent,
              bytesSent: s.bytesSent,
              qualityLimitationReason: s.qualityLimitationReason,
              qualityLimitationDurations: s.qualityLimitationDurations,
              qualityLimitationResolutionChanges: s.qualityLimitationResolutionChanges,
              rid: (r = s.rid) !== null && r !== void 0 ? r : s.id,
              retransmittedPacketsSent: s.retransmittedPacketsSent,
              targetBitrate: s.targetBitrate,
              timestamp: s.timestamp
            }, a = i.get(s.remoteId);
            a && (o.jitter = a.jitter, o.packetsLost = a.packetsLost, o.roundTripTime = a.roundTripTime), t.push(o);
          }
        }), t.sort((s, r) => {
          var o, a;
          return ((o = r.frameWidth) !== null && o !== void 0 ? o : 0) - ((a = s.frameWidth) !== null && a !== void 0 ? a : 0);
        }), t;
      });
    }
    setPublishingQuality(e) {
      const t = [];
      for (let i = Ke.LOW; i <= Ke.HIGH; i += 1) t.push(new Js({
        quality: i,
        enabled: i <= e
      }));
      this.log.debug("setting publishing quality. max quality ".concat(e), this.logContext), this.setPublishingLayers(st(this.codec), t);
    }
    restartTrack(e) {
      return p(this, void 0, void 0, function* () {
        var t, i, s, r, o;
        let a;
        if (e) {
          const u = er({
            video: e
          });
          typeof u.video != "boolean" && (a = u.video);
        }
        yield this.restart(a), this.isCpuConstrained = false;
        try {
          for (var c = true, d = St(this.simulcastCodecs.values()), l; l = yield d.next(), t = l.done, !t; c = true) {
            r = l.value, c = false;
            const u = r;
            u.sender && ((o = u.sender.transport) === null || o === void 0 ? void 0 : o.state) !== "closed" && (u.mediaStreamTrack = this.mediaStreamTrack.clone(), yield u.sender.replaceTrack(u.mediaStreamTrack));
          }
        } catch (u) {
          i = {
            error: u
          };
        } finally {
          try {
            !c && !t && (s = d.return) && (yield s.call(d));
          } finally {
            if (i) throw i.error;
          }
        }
      });
    }
    setProcessor(e) {
      const t = Object.create(null, {
        setProcessor: {
          get: () => super.setProcessor
        }
      });
      return p(this, arguments, void 0, function(i) {
        var s = this;
        let r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true;
        return function* () {
          var o, a, c, d, l, u;
          if (yield t.setProcessor.call(s, i, r), !((l = s.processor) === null || l === void 0) && l.processedTrack) try {
            for (var h = true, m = St(s.simulcastCodecs.values()), v; v = yield m.next(), o = v.done, !o; h = true) d = v.value, h = false, yield (u = d.sender) === null || u === void 0 ? void 0 : u.replaceTrack(s.processor.processedTrack);
          } catch (g) {
            a = {
              error: g
            };
          } finally {
            try {
              !h && !o && (c = m.return) && (yield c.call(m));
            } finally {
              if (a) throw a.error;
            }
          }
        }();
      });
    }
    setDegradationPreference(e) {
      return p(this, void 0, void 0, function* () {
        if (this.degradationPreference = e, this.sender) try {
          this.log.debug("setting degradationPreference to ".concat(e), this.logContext);
          const t = this.sender.getParameters();
          t.degradationPreference = e, this.sender.setParameters(t);
        } catch (t) {
          this.log.warn("failed to set degradationPreference", Object.assign({
            error: t
          }, this.logContext));
        }
      });
    }
    addSimulcastTrack(e, t) {
      if (this.simulcastCodecs.has(e)) {
        this.log.error("".concat(e, " already added, skipping adding simulcast codec"), this.logContext);
        return;
      }
      const i = {
        codec: e,
        mediaStreamTrack: this.mediaStreamTrack.clone(),
        sender: void 0,
        encodings: t
      };
      return this.simulcastCodecs.set(e, i), i;
    }
    setSimulcastTrackSender(e, t) {
      const i = this.simulcastCodecs.get(e);
      i && (i.sender = t, setTimeout(() => {
        this.subscribedCodecs && this.setPublishingCodecs(this.subscribedCodecs);
      }, Dh));
    }
    setPublishingCodecs(e) {
      return p(this, void 0, void 0, function* () {
        var t, i, s, r, o, a, c;
        if (this.log.debug("setting publishing codecs", Object.assign(Object.assign({}, this.logContext), {
          codecs: e,
          currentCodec: this.codec
        })), !this.codec && e.length > 0) return yield this.setPublishingLayers(st(e[0].codec), e[0].qualities), [];
        this.subscribedCodecs = e;
        const d = [];
        try {
          for (t = true, i = St(e); s = yield i.next(), r = s.done, !r; t = true) {
            c = s.value, t = false;
            const l = c;
            if (!this.codec || this.codec === l.codec) yield this.setPublishingLayers(st(l.codec), l.qualities);
            else {
              const u = this.simulcastCodecs.get(l.codec);
              if (this.log.debug("try setPublishingCodec for ".concat(l.codec), Object.assign(Object.assign({}, this.logContext), {
                simulcastCodecInfo: u
              })), !u || !u.sender) {
                for (const h of l.qualities) if (h.enabled) {
                  d.push(l.codec);
                  break;
                }
              } else u.encodings && (this.log.debug("try setPublishingLayersForSender ".concat(l.codec), this.logContext), yield va(u.sender, u.encodings, l.qualities, this.senderLock, st(l.codec), this.log, this.logContext));
            }
          }
        } catch (l) {
          o = {
            error: l
          };
        } finally {
          try {
            !t && !r && (a = i.return) && (yield a.call(i));
          } finally {
            if (o) throw o.error;
          }
        }
        return d;
      });
    }
    setPublishingLayers(e, t) {
      return p(this, void 0, void 0, function* () {
        if (this.optimizeForPerformance) {
          this.log.info("skipping setPublishingLayers due to optimized publishing performance", Object.assign(Object.assign({}, this.logContext), {
            qualities: t
          }));
          return;
        }
        this.log.debug("setting publishing layers", Object.assign(Object.assign({}, this.logContext), {
          qualities: t
        })), !(!this.sender || !this.encodings) && (yield va(this.sender, this.encodings, t, this.senderLock, e, this.log, this.logContext));
      });
    }
    prioritizePerformance() {
      return p(this, void 0, void 0, function* () {
        if (!this.sender) throw new Error("sender not found");
        const e = yield this.senderLock.lock();
        try {
          this.optimizeForPerformance = true;
          const t = this.sender.getParameters();
          t.encodings = t.encodings.map((i, s) => {
            var r;
            return Object.assign(Object.assign({}, i), {
              active: s === 0,
              scaleResolutionDownBy: Math.max(1, Math.ceil(((r = this.mediaStreamTrack.getSettings().height) !== null && r !== void 0 ? r : 360) / 360)),
              scalabilityMode: s === 0 && st(this.codec) ? "L1T3" : void 0,
              maxFramerate: s === 0 ? 15 : 0,
              maxBitrate: s === 0 ? i.maxBitrate : 0
            });
          }), this.log.debug("setting performance optimised encodings", Object.assign(Object.assign({}, this.logContext), {
            encodings: t.encodings
          })), this.encodings = t.encodings, yield this.sender.setParameters(t);
        } catch (t) {
          this.log.error("failed to set performance optimised encodings", Object.assign(Object.assign({}, this.logContext), {
            error: t
          })), this.optimizeForPerformance = false;
        } finally {
          e();
        }
      });
    }
    handleAppVisibilityChanged() {
      const e = Object.create(null, {
        handleAppVisibilityChanged: {
          get: () => super.handleAppVisibilityChanged
        }
      });
      return p(this, void 0, void 0, function* () {
        yield e.handleAppVisibilityChanged.call(this), lc() && this.isInBackground && this.source === C.Source.Camera && (this._mediaStreamTrack.enabled = false);
      });
    }
  }
  function va(n, e, t, i, s, r, o) {
    return p(this, void 0, void 0, function* () {
      const a = yield i.lock();
      r.debug("setPublishingLayersForSender", Object.assign(Object.assign({}, o), {
        sender: n,
        qualities: t,
        senderEncodings: e
      }));
      try {
        const c = n.getParameters(), { encodings: d } = c;
        if (!d) return;
        if (d.length !== e.length) {
          r.warn("cannot set publishing layers, encodings mismatch", Object.assign(Object.assign({}, o), {
            encodings: d,
            senderEncodings: e
          }));
          return;
        }
        let l = false;
        s && t.some((m) => m.enabled) && t.forEach((m) => m.enabled = true), d.forEach((h, m) => {
          var v;
          let g = (v = h.rid) !== null && v !== void 0 ? v : "";
          g === "" && (g = "q");
          const T = kc(g), S = t.find((I) => I.quality === T);
          S && h.active !== S.enabled && (l = true, h.active = S.enabled, r.debug("setting layer ".concat(S.quality, " to ").concat(h.active ? "enabled" : "disabled"), o), ni() && (S.enabled ? (h.scaleResolutionDownBy = e[m].scaleResolutionDownBy, h.maxBitrate = e[m].maxBitrate, h.maxFrameRate = e[m].maxFrameRate) : (h.scaleResolutionDownBy = 4, h.maxBitrate = 10, h.maxFrameRate = 2)));
        }), l && (c.encodings = d, r.debug("setting encodings", Object.assign(Object.assign({}, o), {
          encodings: c.encodings
        })), yield n.setParameters(c));
      } finally {
        a();
      }
    });
  }
  function kc(n) {
    switch (n) {
      case "f":
        return Ke.HIGH;
      case "h":
        return Ke.MEDIUM;
      case "q":
        return Ke.LOW;
      default:
        return Ke.HIGH;
    }
  }
  function ya(n, e, t, i) {
    if (!t) return [
      new jt({
        quality: Ke.HIGH,
        width: n,
        height: e,
        bitrate: 0,
        ssrc: 0
      })
    ];
    if (i) {
      const s = t[0].scalabilityMode, r = new bc(s), o = [], a = r.suffix == "h" ? 1.5 : 2, c = r.suffix == "h" ? 2 : 3;
      for (let d = 0; d < r.spatial; d += 1) o.push(new jt({
        quality: Math.min(Ke.HIGH, r.spatial - 1) - d,
        width: Math.ceil(n / Math.pow(a, d)),
        height: Math.ceil(e / Math.pow(a, d)),
        bitrate: t[0].maxBitrate ? Math.ceil(t[0].maxBitrate / Math.pow(c, d)) : 0,
        ssrc: 0
      }));
      return o;
    }
    return t.map((s) => {
      var r, o, a;
      const c = (r = s.scaleResolutionDownBy) !== null && r !== void 0 ? r : 1;
      let d = kc((o = s.rid) !== null && o !== void 0 ? o : "");
      return new jt({
        quality: d,
        width: Math.ceil(n / c),
        height: Math.ceil(e / c),
        bitrate: (a = s.maxBitrate) !== null && a !== void 0 ? a : 0,
        ssrc: 0
      });
    });
  }
  const ba = "_lossy", ka = "_reliable", Ah = 2 * 1e3, as = "leave-reconnect", Nh = 3e4, Lh = 8 * 1024, Uh = 256 * 1024;
  var Je;
  (function(n) {
    n[n.New = 0] = "New", n[n.Connected = 1] = "Connected", n[n.Disconnected = 2] = "Disconnected", n[n.Reconnecting = 3] = "Reconnecting", n[n.Closed = 4] = "Closed";
  })(Je || (Je = {}));
  class jh extends pt.EventEmitter {
    get isClosed() {
      return this._isClosed;
    }
    get pendingReconnect() {
      return !!this.reconnectTimeout;
    }
    constructor(e) {
      var t;
      super(), this.options = e, this.rtcConfig = {}, this.peerConnectionTimeout = ar.peerConnectionTimeout, this.fullReconnectOnNext = false, this.latestRemoteOfferId = 0, this.subscriberPrimary = false, this.pcState = Je.New, this._isClosed = true, this.pendingTrackResolvers = {}, this.reconnectAttempts = 0, this.reconnectStart = 0, this.attemptingReconnect = false, this.joinAttempts = 0, this.maxJoinAttempts = 1, this.shouldFailNext = false, this.log = H, this.reliableDataSequence = 1, this.reliableMessageBuffer = new aa(), this.reliableReceivedState = new sh(Nh), this.lossyDataStatCurrentBytes = 0, this.lossyDataStatByterate = 0, this.lossyDataDropCount = 0, this.midToTrackId = {}, this.isWaitingForNetworkReconnect = false, this.handleDataChannel = (i) => p(this, [
        i
      ], void 0, function(s) {
        var r = this;
        let { channel: o } = s;
        return function* () {
          if (o) {
            if (o.label === ka) r.reliableDCSub = o;
            else if (o.label === ba) r.lossyDCSub = o;
            else return;
            r.log.debug("on data channel ".concat(o.id, ", ").concat(o.label), r.logContext), o.onmessage = r.handleDataMessage;
          }
        }();
      }), this.handleDataMessage = (i) => p(this, void 0, void 0, function* () {
        var s, r, o, a, c;
        const d = yield this.dataProcessLock.lock();
        try {
          let l;
          if (i.data instanceof ArrayBuffer) l = i.data;
          else if (i.data instanceof Blob) l = yield i.data.arrayBuffer();
          else {
            this.log.error("unsupported data type", Object.assign(Object.assign({}, this.logContext), {
              data: i.data
            }));
            return;
          }
          const u = Ue.fromBinary(new Uint8Array(l));
          if (u.sequence > 0 && u.participantSid !== "") {
            const h = this.reliableReceivedState.get(u.participantSid);
            if (h && u.sequence <= h) return;
            this.reliableReceivedState.set(u.participantSid, u.sequence);
          }
          if (((s = u.value) === null || s === void 0 ? void 0 : s.case) === "speaker") this.emit(M.ActiveSpeakersUpdate, u.value.value.speakers);
          else if (((r = u.value) === null || r === void 0 ? void 0 : r.case) === "encryptedPacket") {
            if (!this.e2eeManager) {
              this.log.error("Received encrypted packet but E2EE not set up", this.logContext);
              return;
            }
            const h = yield (o = this.e2eeManager) === null || o === void 0 ? void 0 : o.handleEncryptedData(u.value.value.encryptedValue, u.value.value.iv, u.participantIdentity, u.value.value.keyIndex), m = eo.fromBinary(h.payload), v = new Ue({
              value: m.value,
              participantIdentity: u.participantIdentity,
              participantSid: u.participantSid
            });
            ((a = v.value) === null || a === void 0 ? void 0 : a.case) === "user" && Sa(v, v.value.value), this.emit(M.DataPacketReceived, v, u.value.value.encryptionType);
          } else ((c = u.value) === null || c === void 0 ? void 0 : c.case) === "user" && Sa(u, u.value.value), this.emit(M.DataPacketReceived, u, ge.NONE);
        } finally {
          d();
        }
      }), this.handleDataError = (i) => {
        const r = i.currentTarget.maxRetransmits === 0 ? "lossy" : "reliable";
        if (i instanceof ErrorEvent && i.error) {
          const { error: o } = i.error;
          this.log.error("DataChannel error on ".concat(r, ": ").concat(i.message), Object.assign(Object.assign({}, this.logContext), {
            error: o
          }));
        } else this.log.error("Unknown DataChannel error on ".concat(r), Object.assign(Object.assign({}, this.logContext), {
          event: i
        }));
      }, this.handleBufferedAmountLow = (i) => {
        const r = i.currentTarget.maxRetransmits === 0 ? Q.LOSSY : Q.RELIABLE;
        this.updateAndEmitDCBufferStatus(r);
      }, this.handleDisconnect = (i, s) => {
        if (this._isClosed) return;
        this.log.warn("".concat(i, " disconnected"), this.logContext), this.reconnectAttempts === 0 && (this.reconnectStart = Date.now());
        const r = (c) => {
          this.log.warn("could not recover connection after ".concat(this.reconnectAttempts, " attempts, ").concat(c, "ms. giving up"), this.logContext), this.emit(M.Disconnected), this.close();
        }, o = Date.now() - this.reconnectStart;
        let a = this.getNextRetryDelay({
          elapsedMs: o,
          retryCount: this.reconnectAttempts
        });
        if (a === null) {
          r(o);
          return;
        }
        i === as && (a = 0), this.log.debug("reconnecting in ".concat(a, "ms"), this.logContext), this.clearReconnectTimeout(), this.token && this.regionUrlProvider && this.regionUrlProvider.updateToken(this.token), this.reconnectTimeout = Ie.setTimeout(() => this.attemptReconnect(s).finally(() => this.reconnectTimeout = void 0), a);
      }, this.waitForRestarted = () => new Promise((i, s) => {
        this.pcState === Je.Connected && i();
        const r = () => {
          this.off(M.Disconnected, o), i();
        }, o = () => {
          this.off(M.Restarted, r), s();
        };
        this.once(M.Restarted, r), this.once(M.Disconnected, o);
      }), this.updateAndEmitDCBufferStatus = (i) => {
        if (i === Q.RELIABLE) {
          const r = this.dataChannelForKind(i);
          r && this.reliableMessageBuffer.alignBufferedAmount(r.bufferedAmount);
        }
        const s = this.isBufferStatusLow(i);
        typeof s < "u" && s !== this.dcBufferStatus.get(i) && (this.dcBufferStatus.set(i, s), this.emit(M.DCBufferStatusChanged, s, i));
      }, this.isBufferStatusLow = (i) => {
        const s = this.dataChannelForKind(i);
        if (s) return s.bufferedAmount <= s.bufferedAmountLowThreshold;
      }, this.handleBrowserOnLine = () => p(this, void 0, void 0, function* () {
        !this.url || !(yield fetch(Xi(this.url), {
          method: "HEAD"
        }).then((s) => s.ok).catch(() => false)) || (this.log.info("detected network reconnected"), (this.client.currentState === oe.RECONNECTING || this.isWaitingForNetworkReconnect && this.client.currentState === oe.CONNECTED) && (this.clearReconnectTimeout(), this.attemptReconnect(Zt.RR_SIGNAL_DISCONNECTED), this.isWaitingForNetworkReconnect = false));
      }), this.handleBrowserOffline = () => p(this, void 0, void 0, function* () {
        if (this.url) try {
          yield Promise.race([
            fetch(Xi(this.url), {
              method: "HEAD"
            }),
            xe(4e3).then(() => Promise.reject())
          ]);
        } catch {
          window.navigator.onLine === false && (this.log.info("detected network interruption"), this.isWaitingForNetworkReconnect = true);
        }
      }), this.log = wt((t = e.loggerName) !== null && t !== void 0 ? t : at.Engine), this.loggerOptions = {
        loggerName: e.loggerName,
        loggerContextCb: () => this.logContext
      }, this.client = new ir(void 0, this.loggerOptions), this.client.signalLatency = this.options.expSignalLatency, this.reconnectPolicy = this.options.reconnectPolicy, this.closingLock = new je(), this.dataProcessLock = new je(), this.dcBufferStatus = /* @__PURE__ */ new Map([
        [
          Q.LOSSY,
          true
        ],
        [
          Q.RELIABLE,
          true
        ]
      ]), this.client.onParticipantUpdate = (i) => this.emit(M.ParticipantUpdate, i), this.client.onConnectionQuality = (i) => this.emit(M.ConnectionQualityUpdate, i), this.client.onRoomUpdate = (i) => this.emit(M.RoomUpdate, i), this.client.onSubscriptionError = (i) => this.emit(M.SubscriptionError, i), this.client.onSubscriptionPermissionUpdate = (i) => this.emit(M.SubscriptionPermissionUpdate, i), this.client.onSpeakersChanged = (i) => this.emit(M.SpeakersChanged, i), this.client.onStreamStateUpdate = (i) => this.emit(M.StreamStateChanged, i), this.client.onRequestResponse = (i) => this.emit(M.SignalRequestResponse, i);
    }
    get logContext() {
      var e, t, i, s, r, o;
      return {
        room: (t = (e = this.latestJoinResponse) === null || e === void 0 ? void 0 : e.room) === null || t === void 0 ? void 0 : t.name,
        roomID: (s = (i = this.latestJoinResponse) === null || i === void 0 ? void 0 : i.room) === null || s === void 0 ? void 0 : s.sid,
        participant: (o = (r = this.latestJoinResponse) === null || r === void 0 ? void 0 : r.participant) === null || o === void 0 ? void 0 : o.identity,
        pID: this.participantSid
      };
    }
    join(e, t, i, s) {
      return p(this, arguments, void 0, function(r, o, a, c) {
        var d = this;
        let l = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : false;
        return function* () {
          d.url = r, d.token = o, d.signalOpts = a, d.maxJoinAttempts = a.maxRetries;
          try {
            d.joinAttempts += 1, d.setupSignalClientCallbacks();
            const u = yield d.client.join(r, o, a, c, l);
            return d._isClosed = false, d.latestJoinResponse = u, d.subscriberPrimary = u.subscriberPrimary, d.pcManager || (yield d.configure(u, !l)), (!d.subscriberPrimary || u.fastPublish) && d.negotiate().catch((h) => {
              H.error(h, d.logContext);
            }), d.registerOnLineListener(), d.clientConfiguration = u.clientConfiguration, d.emit(M.SignalConnected, u), u;
          } catch (u) {
            if (u instanceof F) {
              if (u.reason === ce.ServerUnreachable) {
                if (d.log.warn("Couldn't connect to server, attempt ".concat(d.joinAttempts, " of ").concat(d.maxJoinAttempts), d.logContext), d.joinAttempts < d.maxJoinAttempts) return d.join(r, o, a, c, l);
              } else if (u.reason === ce.ServiceNotFound) return d.log.warn("Initial connection failed: ".concat(u.message, " \u2013 Retrying")), d.join(r, o, a, c, true);
            }
            throw u;
          }
        }();
      });
    }
    close() {
      return p(this, void 0, void 0, function* () {
        const e = yield this.closingLock.lock();
        if (this.isClosed) {
          e();
          return;
        }
        try {
          this._isClosed = true, this.joinAttempts = 0, this.emit(M.Closing), this.removeAllListeners(), this.deregisterOnLineListener(), this.clearPendingReconnect(), this.cleanupLossyDataStats(), yield this.cleanupPeerConnections(), yield this.cleanupClient();
        } finally {
          e();
        }
      });
    }
    cleanupPeerConnections() {
      return p(this, void 0, void 0, function* () {
        var e;
        yield (e = this.pcManager) === null || e === void 0 ? void 0 : e.close(), this.pcManager = void 0;
        const t = (i) => {
          i && (i.close(), i.onbufferedamountlow = null, i.onclose = null, i.onclosing = null, i.onerror = null, i.onmessage = null, i.onopen = null);
        };
        t(this.lossyDC), t(this.lossyDCSub), t(this.reliableDC), t(this.reliableDCSub), this.lossyDC = void 0, this.lossyDCSub = void 0, this.reliableDC = void 0, this.reliableDCSub = void 0, this.reliableMessageBuffer = new aa(), this.reliableDataSequence = 1, this.reliableReceivedState.clear();
      });
    }
    cleanupLossyDataStats() {
      this.lossyDataStatByterate = 0, this.lossyDataStatCurrentBytes = 0, this.lossyDataStatInterval && (clearInterval(this.lossyDataStatInterval), this.lossyDataStatInterval = void 0), this.lossyDataDropCount = 0;
    }
    cleanupClient() {
      return p(this, void 0, void 0, function* () {
        yield this.client.close(), this.client.resetCallbacks();
      });
    }
    addTrack(e) {
      if (this.pendingTrackResolvers[e.cid]) throw new Tt("a track with the same ID has already been published");
      return new Promise((t, i) => {
        const s = setTimeout(() => {
          delete this.pendingTrackResolvers[e.cid], i(F.timeout("publication of local track timed out, no response from server"));
        }, 1e4);
        this.pendingTrackResolvers[e.cid] = {
          resolve: (r) => {
            clearTimeout(s), t(r);
          },
          reject: () => {
            clearTimeout(s), i(new Error("Cancelled publication by calling unpublish"));
          }
        }, this.client.sendAddTrack(e);
      });
    }
    removeTrack(e) {
      if (e.track && this.pendingTrackResolvers[e.track.id]) {
        const { reject: t } = this.pendingTrackResolvers[e.track.id];
        t && t(), delete this.pendingTrackResolvers[e.track.id];
      }
      try {
        return this.pcManager.removeTrack(e), true;
      } catch (t) {
        this.log.warn("failed to remove track", Object.assign(Object.assign({}, this.logContext), {
          error: t
        }));
      }
      return false;
    }
    updateMuteStatus(e, t) {
      this.client.sendMuteTrack(e, t);
    }
    get dataSubscriberReadyState() {
      var e;
      return (e = this.reliableDCSub) === null || e === void 0 ? void 0 : e.readyState;
    }
    getConnectedServerAddress() {
      return p(this, void 0, void 0, function* () {
        var e;
        return (e = this.pcManager) === null || e === void 0 ? void 0 : e.getConnectedAddress();
      });
    }
    setRegionUrlProvider(e) {
      this.regionUrlProvider = e;
    }
    configure(e, t) {
      return p(this, void 0, void 0, function* () {
        var i, s;
        if (this.pcManager && this.pcManager.currentState !== ue.NEW) return;
        this.participantSid = (i = e.participant) === null || i === void 0 ? void 0 : i.sid;
        const r = this.makeRTCConfiguration(e);
        this.pcManager = new ph(r, t ? "publisher-only" : e.subscriberPrimary ? "subscriber-primary" : "publisher-primary", this.loggerOptions), this.emit(M.TransportsCreated, this.pcManager.publisher, this.pcManager.subscriber), this.pcManager.onIceCandidate = (o, a) => {
          this.client.sendIceCandidate(o, a);
        }, this.pcManager.onPublisherOffer = (o, a) => {
          this.client.sendOffer(o, a);
        }, this.pcManager.onDataChannel = this.handleDataChannel, this.pcManager.onStateChange = (o, a, c) => p(this, void 0, void 0, function* () {
          if (this.log.debug("primary PC state changed ".concat(o), this.logContext), [
            "closed",
            "disconnected",
            "failed"
          ].includes(a) && (this.publisherConnectionPromise = void 0), o === ue.CONNECTED) {
            const u = this.pcState === Je.New;
            this.pcState = Je.Connected, u && this.emit(M.Connected, e);
          } else o === ue.FAILED && (this.pcState === Je.Connected || this.pcState === Je.Reconnecting) && (this.pcState = Je.Disconnected, this.handleDisconnect("peerconnection failed", c === "failed" ? Zt.RR_SUBSCRIBER_FAILED : Zt.RR_PUBLISHER_FAILED));
          const d = this.client.isDisconnected || this.client.currentState === oe.RECONNECTING, l = [
            ue.FAILED,
            ue.CLOSING,
            ue.CLOSED
          ].includes(o);
          d && l && !this._isClosed && this.emit(M.Offline);
        }), this.pcManager.onTrack = (o) => {
          o.streams.length !== 0 && this.emit(M.MediaTrackAdded, o.track, o.streams[0], o.receiver);
        }, Fh((s = e.serverInfo) === null || s === void 0 ? void 0 : s.protocol) || this.createDataChannels();
      });
    }
    setupSignalClientCallbacks() {
      this.client.onAnswer = (e, t, i) => p(this, void 0, void 0, function* () {
        this.pcManager && (this.log.debug("received server answer", Object.assign(Object.assign({}, this.logContext), {
          RTCSdpType: e.type,
          sdp: e.sdp,
          midToTrackId: i
        })), this.midToTrackId = i, yield this.pcManager.setPublisherAnswer(e, t));
      }), this.client.onTrickle = (e, t) => {
        this.pcManager && (this.log.debug("got ICE candidate from peer", Object.assign(Object.assign({}, this.logContext), {
          candidate: e,
          target: t
        })), this.pcManager.addIceCandidate(e, t));
      }, this.client.onOffer = (e, t, i) => p(this, void 0, void 0, function* () {
        if (this.latestRemoteOfferId = t, !this.pcManager) return;
        this.midToTrackId = i;
        const s = yield this.pcManager.createSubscriberAnswerFromOffer(e, t);
        s && this.client.sendAnswer(s, t);
      }), this.client.onLocalTrackPublished = (e) => {
        var t;
        if (this.log.debug("received trackPublishedResponse", Object.assign(Object.assign({}, this.logContext), {
          cid: e.cid,
          track: (t = e.track) === null || t === void 0 ? void 0 : t.sid
        })), !this.pendingTrackResolvers[e.cid]) {
          this.log.error("missing track resolver for ".concat(e.cid), Object.assign(Object.assign({}, this.logContext), {
            cid: e.cid
          }));
          return;
        }
        const { resolve: i } = this.pendingTrackResolvers[e.cid];
        delete this.pendingTrackResolvers[e.cid], i(e.track);
      }, this.client.onLocalTrackUnpublished = (e) => {
        this.emit(M.LocalTrackUnpublished, e);
      }, this.client.onLocalTrackSubscribed = (e) => {
        this.emit(M.LocalTrackSubscribed, e);
      }, this.client.onTokenRefresh = (e) => {
        var t;
        this.token = e, (t = this.regionUrlProvider) === null || t === void 0 || t.updateToken(e);
      }, this.client.onRemoteMuteChanged = (e, t) => {
        this.emit(M.RemoteMute, e, t);
      }, this.client.onSubscribedQualityUpdate = (e) => {
        this.emit(M.SubscribedQualityUpdate, e);
      }, this.client.onRoomMoved = (e) => {
        var t;
        this.participantSid = (t = e.participant) === null || t === void 0 ? void 0 : t.sid, this.latestJoinResponse && (this.latestJoinResponse.room = e.room), this.emit(M.RoomMoved, e);
      }, this.client.onMediaSectionsRequirement = (e) => {
        var t, i;
        const s = {
          direction: "recvonly"
        };
        for (let r = 0; r < e.numAudios; r++) (t = this.pcManager) === null || t === void 0 || t.addPublisherTransceiverOfKind("audio", s);
        for (let r = 0; r < e.numVideos; r++) (i = this.pcManager) === null || i === void 0 || i.addPublisherTransceiverOfKind("video", s);
        this.negotiate();
      }, this.client.onClose = () => {
        this.handleDisconnect("signal", Zt.RR_SIGNAL_DISCONNECTED);
      }, this.client.onLeave = (e) => {
        switch (this.log.debug("client leave request", Object.assign(Object.assign({}, this.logContext), {
          reason: e == null ? void 0 : e.reason
        })), e.regions && this.regionUrlProvider && (this.log.debug("updating regions", this.logContext), this.regionUrlProvider.setServerReportedRegions({
          updatedAtInMs: Date.now(),
          maxAgeInMs: gc,
          regionSettings: e.regions
        })), e.action) {
          case yi.DISCONNECT:
            this.emit(M.Disconnected, e == null ? void 0 : e.reason), this.close();
            break;
          case yi.RECONNECT:
            this.fullReconnectOnNext = true, this.handleDisconnect(as);
            break;
          case yi.RESUME:
            this.handleDisconnect(as);
        }
      };
    }
    makeRTCConfiguration(e) {
      var t;
      const i = Object.assign({}, this.rtcConfig);
      if (!((t = this.signalOpts) === null || t === void 0) && t.e2eeEnabled && (this.log.debug("E2EE - setting up transports with insertable streams", this.logContext), i.encodedInsertableStreams = true), e.iceServers && !i.iceServers) {
        const s = [];
        e.iceServers.forEach((r) => {
          const o = {
            urls: r.urls
          };
          r.username && (o.username = r.username), r.credential && (o.credential = r.credential), s.push(o);
        }), i.iceServers = s;
      }
      return e.clientConfiguration && e.clientConfiguration.forceRelay === Ji.ENABLED && (i.iceTransportPolicy = "relay"), i.sdpSemantics = "unified-plan", i.continualGatheringPolicy = "gather_continually", i;
    }
    createDataChannels() {
      this.pcManager && (this.lossyDC && (this.lossyDC.onmessage = null, this.lossyDC.onerror = null), this.reliableDC && (this.reliableDC.onmessage = null, this.reliableDC.onerror = null), this.lossyDC = this.pcManager.createPublisherDataChannel(ba, {
        ordered: false,
        maxRetransmits: 0
      }), this.reliableDC = this.pcManager.createPublisherDataChannel(ka, {
        ordered: true
      }), this.lossyDC.onmessage = this.handleDataMessage, this.reliableDC.onmessage = this.handleDataMessage, this.lossyDC.onerror = this.handleDataError, this.reliableDC.onerror = this.handleDataError, this.lossyDC.bufferedAmountLowThreshold = 65535, this.reliableDC.bufferedAmountLowThreshold = 65535, this.lossyDC.onbufferedamountlow = this.handleBufferedAmountLow, this.reliableDC.onbufferedamountlow = this.handleBufferedAmountLow, this.cleanupLossyDataStats(), this.lossyDataStatInterval = setInterval(() => {
        this.lossyDataStatByterate = this.lossyDataStatCurrentBytes, this.lossyDataStatCurrentBytes = 0;
        const e = this.dataChannelForKind(Q.LOSSY);
        if (e) {
          const t = this.lossyDataStatByterate / 10;
          e.bufferedAmountLowThreshold = Math.min(Math.max(t, Lh), Uh);
        }
      }, 1e3));
    }
    createSender(e, t, i) {
      return p(this, void 0, void 0, function* () {
        if (Rs()) return yield this.createTransceiverRTCRtpSender(e, t, i);
        if (Ps()) return this.log.warn("using add-track fallback", this.logContext), yield this.createRTCRtpSender(e.mediaStreamTrack);
        throw new me("Required webRTC APIs not supported on this device");
      });
    }
    createSimulcastSender(e, t, i, s) {
      return p(this, void 0, void 0, function* () {
        if (Rs()) return this.createSimulcastTransceiverSender(e, t, i, s);
        if (Ps()) return this.log.debug("using add-track fallback", this.logContext), this.createRTCRtpSender(e.mediaStreamTrack);
        throw new me("Cannot stream on this device");
      });
    }
    createTransceiverRTCRtpSender(e, t, i) {
      return p(this, void 0, void 0, function* () {
        if (!this.pcManager) throw new me("publisher is closed");
        const s = [];
        e.mediaStream && s.push(e.mediaStream), Wt(e) && (e.codec = t.videoCodec);
        const r = {
          direction: "sendonly",
          streams: s
        };
        return i && (r.sendEncodings = i), (yield this.pcManager.addPublisherTransceiver(e.mediaStreamTrack, r)).sender;
      });
    }
    createSimulcastTransceiverSender(e, t, i, s) {
      return p(this, void 0, void 0, function* () {
        if (!this.pcManager) throw new me("publisher is closed");
        const r = {
          direction: "sendonly"
        };
        s && (r.sendEncodings = s);
        const o = yield this.pcManager.addPublisherTransceiver(t.mediaStreamTrack, r);
        if (i.videoCodec) return e.setSimulcastTrackSender(i.videoCodec, o.sender), o.sender;
      });
    }
    createRTCRtpSender(e) {
      return p(this, void 0, void 0, function* () {
        if (!this.pcManager) throw new me("publisher is closed");
        return this.pcManager.addPublisherTrack(e);
      });
    }
    attemptReconnect(e) {
      return p(this, void 0, void 0, function* () {
        var t, i, s;
        if (!this._isClosed) {
          if (this.attemptingReconnect) {
            H.warn("already attempting reconnect, returning early", this.logContext);
            return;
          }
          (((t = this.clientConfiguration) === null || t === void 0 ? void 0 : t.resumeConnection) === Ji.DISABLED || ((s = (i = this.pcManager) === null || i === void 0 ? void 0 : i.currentState) !== null && s !== void 0 ? s : ue.NEW) === ue.NEW) && (this.fullReconnectOnNext = true);
          try {
            this.attemptingReconnect = true, this.fullReconnectOnNext ? yield this.restartConnection() : yield this.resumeConnection(e), this.clearPendingReconnect(), this.fullReconnectOnNext = false;
          } catch (r) {
            this.reconnectAttempts += 1;
            let o = true;
            r instanceof me ? (this.log.debug("received unrecoverable error", Object.assign(Object.assign({}, this.logContext), {
              error: r
            })), o = false) : r instanceof li || (this.fullReconnectOnNext = true), o ? this.handleDisconnect("reconnect", Zt.RR_UNKNOWN) : (this.log.info("could not recover connection after ".concat(this.reconnectAttempts, " attempts, ").concat(Date.now() - this.reconnectStart, "ms. giving up"), this.logContext), this.emit(M.Disconnected), yield this.close());
          } finally {
            this.attemptingReconnect = false;
          }
        }
      });
    }
    getNextRetryDelay(e) {
      try {
        return this.reconnectPolicy.nextRetryDelayInMs(e);
      } catch (t) {
        this.log.warn("encountered error in reconnect policy", Object.assign(Object.assign({}, this.logContext), {
          error: t
        }));
      }
      return null;
    }
    restartConnection(e) {
      return p(this, void 0, void 0, function* () {
        var t, i, s;
        try {
          if (!this.url || !this.token) throw new me("could not reconnect, url or token not saved");
          this.log.info("reconnecting, attempt: ".concat(this.reconnectAttempts), this.logContext), this.emit(M.Restarting), this.client.isDisconnected || (yield this.client.sendLeave()), yield this.cleanupPeerConnections(), yield this.cleanupClient();
          let r;
          try {
            if (!this.signalOpts) throw this.log.warn("attempted connection restart, without signal options present", this.logContext), new li();
            r = yield this.join(e ?? this.url, this.token, this.signalOpts, void 0, !this.options.singlePeerConnection);
          } catch (o) {
            throw o instanceof F && o.reason === ce.NotAllowed ? new me("could not reconnect, token might be expired") : new li();
          }
          if (this.shouldFailNext) throw this.shouldFailNext = false, new Error("simulated failure");
          if (this.client.setReconnected(), this.emit(M.SignalRestarted, r), yield this.waitForPCReconnected(), this.client.currentState !== oe.CONNECTED) throw new li("Signal connection got severed during reconnect");
          (t = this.regionUrlProvider) === null || t === void 0 || t.resetAttempts(), this.emit(M.Restarted);
        } catch (r) {
          const o = yield (i = this.regionUrlProvider) === null || i === void 0 ? void 0 : i.getNextBestRegionUrl();
          if (o) {
            yield this.restartConnection(o);
            return;
          } else throw (s = this.regionUrlProvider) === null || s === void 0 || s.resetAttempts(), r;
        }
      });
    }
    resumeConnection(e) {
      return p(this, void 0, void 0, function* () {
        var t;
        if (!this.url || !this.token) throw new me("could not reconnect, url or token not saved");
        if (!this.pcManager) throw new me("publisher and subscriber connections unset");
        this.log.info("resuming signal connection, attempt ".concat(this.reconnectAttempts), this.logContext), this.emit(M.Resuming);
        let i;
        try {
          this.setupSignalClientCallbacks(), i = yield this.client.reconnect(this.url, this.token, this.participantSid, e);
        } catch (s) {
          let r = "";
          throw s instanceof Error && (r = s.message, this.log.error(s.message, Object.assign(Object.assign({}, this.logContext), {
            error: s
          }))), s instanceof F && s.reason === ce.NotAllowed ? new me("could not reconnect, token might be expired") : s instanceof F && s.reason === ce.LeaveRequest ? s : new li(r);
        }
        if (this.emit(M.SignalResumed), i) {
          const s = this.makeRTCConfiguration(i);
          this.pcManager.updateConfiguration(s), this.latestJoinResponse && (this.latestJoinResponse.serverInfo = i.serverInfo);
        } else this.log.warn("Did not receive reconnect response", this.logContext);
        if (this.shouldFailNext) throw this.shouldFailNext = false, new Error("simulated failure");
        if (yield this.pcManager.triggerIceRestart(), yield this.waitForPCReconnected(), this.client.currentState !== oe.CONNECTED) throw new li("Signal connection got severed during reconnect");
        this.client.setReconnected(), ((t = this.reliableDC) === null || t === void 0 ? void 0 : t.readyState) === "open" && this.reliableDC.id === null && this.createDataChannels(), (i == null ? void 0 : i.lastMessageSeq) && this.resendReliableMessagesForResume(i.lastMessageSeq), this.emit(M.Resumed);
      });
    }
    waitForPCInitialConnection(e, t) {
      return p(this, void 0, void 0, function* () {
        if (!this.pcManager) throw new me("PC manager is closed");
        yield this.pcManager.ensurePCTransportConnection(t, e);
      });
    }
    waitForPCReconnected() {
      return p(this, void 0, void 0, function* () {
        this.pcState = Je.Reconnecting, this.log.debug("waiting for peer connection to reconnect", this.logContext);
        try {
          if (yield xe(Ah), !this.pcManager) throw new me("PC manager is closed");
          yield this.pcManager.ensurePCTransportConnection(void 0, this.peerConnectionTimeout), this.pcState = Je.Connected;
        } catch (e) {
          throw this.pcState = Je.Disconnected, F.internal("could not establish PC connection, ".concat(e.message));
        }
      });
    }
    publishRpcResponse(e, t, i, s) {
      return p(this, void 0, void 0, function* () {
        const r = new Ue({
          destinationIdentities: [
            e
          ],
          kind: Q.RELIABLE,
          value: {
            case: "rpcResponse",
            value: new Gs({
              requestId: t,
              value: s ? {
                case: "error",
                value: s.toProto()
              } : {
                case: "payload",
                value: i ?? ""
              }
            })
          }
        });
        yield this.sendDataPacket(r, Q.RELIABLE);
      });
    }
    publishRpcAck(e, t) {
      return p(this, void 0, void 0, function* () {
        const i = new Ue({
          destinationIdentities: [
            e
          ],
          kind: Q.RELIABLE,
          value: {
            case: "rpcAck",
            value: new qs({
              requestId: t
            })
          }
        });
        yield this.sendDataPacket(i, Q.RELIABLE);
      });
    }
    sendDataPacket(e, t) {
      return p(this, void 0, void 0, function* () {
        if (yield this.ensurePublisherConnected(t), this.e2eeManager && this.e2eeManager.isDataChannelEncryptionEnabled) {
          const r = Ku(e);
          if (r) {
            const o = yield this.e2eeManager.encryptData(r.toBinary());
            e.value = {
              case: "encryptedPacket",
              value: new Za({
                encryptedValue: o.payload,
                iv: o.iv,
                keyIndex: o.keyIndex
              })
            };
          }
        }
        t === Q.RELIABLE && (e.sequence = this.reliableDataSequence, this.reliableDataSequence += 1);
        const i = e.toBinary(), s = this.dataChannelForKind(t);
        if (s) {
          if (t === Q.RELIABLE) yield this.waitForBufferStatusLow(t), this.reliableMessageBuffer.push({
            data: i,
            sequence: e.sequence
          });
          else {
            if (!this.isBufferStatusLow(t)) {
              this.lossyDataDropCount += 1, this.lossyDataDropCount % 100 === 0 && this.log.warn("dropping lossy data channel messages, total dropped: ".concat(this.lossyDataDropCount), this.logContext);
              return;
            }
            this.lossyDataStatCurrentBytes += i.byteLength;
          }
          if (this.attemptingReconnect) return;
          s.send(i);
        }
        this.updateAndEmitDCBufferStatus(t);
      });
    }
    resendReliableMessagesForResume(e) {
      return p(this, void 0, void 0, function* () {
        yield this.ensurePublisherConnected(Q.RELIABLE);
        const t = this.dataChannelForKind(Q.RELIABLE);
        t && (this.reliableMessageBuffer.popToSequence(e), this.reliableMessageBuffer.getAll().forEach((i) => {
          t.send(i.data);
        })), this.updateAndEmitDCBufferStatus(Q.RELIABLE);
      });
    }
    waitForBufferStatusLow(e) {
      return new Ae((t, i) => p(this, void 0, void 0, function* () {
        if (this.isBufferStatusLow(e)) t();
        else {
          const s = () => i(new me("engine closed"));
          for (this.once(M.Closing, s); !this.dcBufferStatus.get(e); ) yield xe(10);
          this.off(M.Closing, s), t();
        }
      }));
    }
    ensureDataTransportConnected(e) {
      return p(this, arguments, void 0, function(t) {
        var i = this;
        let s = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : this.subscriberPrimary;
        return function* () {
          var r;
          if (!i.pcManager) throw new me("PC manager is closed");
          const o = s ? i.pcManager.subscriber : i.pcManager.publisher, a = s ? "Subscriber" : "Publisher";
          if (!o) throw F.internal("".concat(a, " connection not set"));
          let c = false;
          !s && !i.dataChannelForKind(t, s) && (i.createDataChannels(), c = true), !c && !s && !i.pcManager.publisher.isICEConnected && i.pcManager.publisher.getICEConnectionState() !== "checking" && (c = true), c && i.negotiate().catch((u) => {
            H.error(u, i.logContext);
          });
          const d = i.dataChannelForKind(t, s);
          if ((d == null ? void 0 : d.readyState) === "open") return;
          const l = (/* @__PURE__ */ new Date()).getTime() + i.peerConnectionTimeout;
          for (; (/* @__PURE__ */ new Date()).getTime() < l; ) {
            if (o.isICEConnected && ((r = i.dataChannelForKind(t, s)) === null || r === void 0 ? void 0 : r.readyState) === "open") return;
            yield xe(50);
          }
          throw F.internal("could not establish ".concat(a, " connection, state: ").concat(o.getICEConnectionState()));
        }();
      });
    }
    ensurePublisherConnected(e) {
      return p(this, void 0, void 0, function* () {
        this.publisherConnectionPromise || (this.publisherConnectionPromise = this.ensureDataTransportConnected(e, false)), yield this.publisherConnectionPromise;
      });
    }
    verifyTransport() {
      return !(!this.pcManager || this.pcManager.currentState !== ue.CONNECTED || !this.client.ws || this.client.ws.readyState === WebSocket.CLOSED);
    }
    negotiate() {
      return p(this, void 0, void 0, function* () {
        return new Ae((e, t) => p(this, void 0, void 0, function* () {
          if (!this.pcManager) {
            t(new ki("PC manager is closed"));
            return;
          }
          this.pcManager.requirePublisher(), this.pcManager.publisher.getTransceivers().length == 0 && !this.lossyDC && !this.reliableDC && this.createDataChannels();
          const i = new AbortController(), s = () => {
            i.abort(), this.log.debug("engine disconnected while negotiation was ongoing", this.logContext), e();
          };
          this.isClosed && t(new ki("cannot negotiate on closed engine")), this.on(M.Closing, s), this.pcManager.publisher.once(wi.RTPVideoPayloadTypes, (r) => {
            const o = /* @__PURE__ */ new Map();
            r.forEach((a) => {
              const c = a.codec.toLowerCase();
              Ru(c) && o.set(a.payload, c);
            }), this.emit(M.RTPVideoMapUpdate, o);
          });
          try {
            yield this.pcManager.negotiate(i), e();
          } catch (r) {
            r instanceof ki && (this.fullReconnectOnNext = true), this.handleDisconnect("negotiation", Zt.RR_UNKNOWN), r instanceof Error ? t(r) : t(new Error(String(r)));
          } finally {
            this.off(M.Closing, s);
          }
        }));
      });
    }
    dataChannelForKind(e, t) {
      if (t) {
        if (e === Q.LOSSY) return this.lossyDCSub;
        if (e === Q.RELIABLE) return this.reliableDCSub;
      } else {
        if (e === Q.LOSSY) return this.lossyDC;
        if (e === Q.RELIABLE) return this.reliableDC;
      }
    }
    sendSyncState(e, t) {
      var i, s, r, o;
      if (!this.pcManager) {
        this.log.warn("sync state cannot be sent without peer connection setup", this.logContext);
        return;
      }
      const a = this.pcManager.publisher.getLocalDescription(), c = this.pcManager.publisher.getRemoteDescription(), d = (i = this.pcManager.subscriber) === null || i === void 0 ? void 0 : i.getRemoteDescription(), l = (s = this.pcManager.subscriber) === null || s === void 0 ? void 0 : s.getLocalDescription(), u = (o = (r = this.signalOpts) === null || r === void 0 ? void 0 : r.autoSubscribe) !== null && o !== void 0 ? o : true, h = new Array(), m = new Array();
      e.forEach((v) => {
        v.isDesired !== u && h.push(v.trackSid), v.isEnabled || m.push(v.trackSid);
      }), this.client.sendSyncState(new zs({
        answer: this.pcManager.mode === "publisher-only" ? c ? mi({
          sdp: c.sdp,
          type: c.type
        }) : void 0 : l ? mi({
          sdp: l.sdp,
          type: l.type
        }) : void 0,
        offer: this.pcManager.mode === "publisher-only" ? a ? mi({
          sdp: a.sdp,
          type: a.type
        }) : void 0 : d ? mi({
          sdp: d.sdp,
          type: d.type
        }) : void 0,
        subscription: new Nn({
          trackSids: h,
          subscribe: !u,
          participantTracks: []
        }),
        publishTracks: du(t),
        dataChannels: this.dataChannelsInfo(),
        trackSidsDisabled: m,
        datachannelReceiveStates: this.reliableReceivedState.map((v, g) => new Co({
          publisherSid: g,
          lastSeq: v
        }))
      }));
    }
    failNext() {
      this.shouldFailNext = true;
    }
    dataChannelsInfo() {
      const e = [], t = (i, s) => {
        (i == null ? void 0 : i.id) !== void 0 && i.id !== null && e.push(new wo({
          label: i.label,
          id: i.id,
          target: s
        }));
      };
      return t(this.dataChannelForKind(Q.LOSSY), nt.PUBLISHER), t(this.dataChannelForKind(Q.RELIABLE), nt.PUBLISHER), t(this.dataChannelForKind(Q.LOSSY, true), nt.SUBSCRIBER), t(this.dataChannelForKind(Q.RELIABLE, true), nt.SUBSCRIBER), e;
    }
    clearReconnectTimeout() {
      this.reconnectTimeout && Ie.clearTimeout(this.reconnectTimeout);
    }
    clearPendingReconnect() {
      this.clearReconnectTimeout(), this.reconnectAttempts = 0;
    }
    registerOnLineListener() {
      Ge() && (window.addEventListener("online", this.handleBrowserOnLine), window.addEventListener("offline", this.handleBrowserOffline));
    }
    deregisterOnLineListener() {
      Ge() && (window.removeEventListener("online", this.handleBrowserOnLine), window.removeEventListener("offline", this.handleBrowserOffline));
    }
    getTrackIdForReceiver(e) {
      var t;
      const i = (t = this.pcManager) === null || t === void 0 ? void 0 : t.getMidForReceiver(e);
      if (i) {
        const s = Object.entries(this.midToTrackId).find((r) => {
          let [o] = r;
          return o === i;
        });
        if (s) return s[1];
      }
    }
  }
  function Fh(n) {
    return n !== void 0 && n > 13;
  }
  function Sa(n, e) {
    const t = n.participantIdentity ? n.participantIdentity : e.participantIdentity;
    n.participantIdentity = t, e.participantIdentity = t;
    const i = n.destinationIdentities.length !== 0 ? n.destinationIdentities : e.destinationIdentities;
    n.destinationIdentities = i, e.destinationIdentities = i;
  }
  class Sc {
    get info() {
      return this._info;
    }
    validateBytesReceived() {
      let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : false;
      if (!(typeof this.totalByteSize != "number" || this.totalByteSize === 0)) {
        if (e && this.bytesReceived < this.totalByteSize) throw new ze("Not enough chunk(s) received - expected ".concat(this.totalByteSize, " bytes of data total, only received ").concat(this.bytesReceived, " bytes"), Le.Incomplete);
        if (this.bytesReceived > this.totalByteSize) throw new ze("Extra chunk(s) received - expected ".concat(this.totalByteSize, " bytes of data total, received ").concat(this.bytesReceived, " bytes"), Le.LengthExceeded);
      }
    }
    constructor(e, t, i, s) {
      this.reader = t, this.totalByteSize = i, this._info = e, this.bytesReceived = 0, this.outOfBandFailureRejectingFuture = s;
    }
  }
  class Bh extends Sc {
    handleChunkReceived(e) {
      var t;
      this.bytesReceived += e.content.byteLength, this.validateBytesReceived();
      const i = this.totalByteSize ? this.bytesReceived / this.totalByteSize : void 0;
      (t = this.onProgress) === null || t === void 0 || t.call(this, i);
    }
    [Symbol.asyncIterator]() {
      const e = this.reader.getReader();
      let t = new $e(), i = null, s = null;
      if (this.signal) {
        const o = this.signal;
        s = () => {
          var a;
          (a = t.reject) === null || a === void 0 || a.call(t, o.reason);
        }, o.addEventListener("abort", s), i = o;
      }
      const r = () => {
        e.releaseLock(), i && s && i.removeEventListener("abort", s), this.signal = void 0;
      };
      return {
        next: () => p(this, void 0, void 0, function* () {
          var o, a;
          try {
            const { done: c, value: d } = yield Promise.race([
              e.read(),
              t.promise,
              (a = (o = this.outOfBandFailureRejectingFuture) === null || o === void 0 ? void 0 : o.promise) !== null && a !== void 0 ? a : new Promise(() => {
              })
            ]);
            return c ? (this.validateBytesReceived(true), {
              done: true,
              value: void 0
            }) : (this.handleChunkReceived(d), {
              done: false,
              value: d.content
            });
          } catch (c) {
            throw r(), c;
          }
        }),
        return() {
          return p(this, void 0, void 0, function* () {
            return r(), {
              done: true,
              value: void 0
            };
          });
        }
      };
    }
    withAbortSignal(e) {
      return this.signal = e, this;
    }
    readAll() {
      return p(this, arguments, void 0, function() {
        var e = this;
        let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
        return function* () {
          var i, s, r, o;
          let a = /* @__PURE__ */ new Set();
          const c = t.signal ? e.withAbortSignal(t.signal) : e;
          try {
            for (var d = true, l = St(c), u; u = yield l.next(), i = u.done, !i; d = true) {
              o = u.value, d = false;
              const h = o;
              a.add(h);
            }
          } catch (h) {
            s = {
              error: h
            };
          } finally {
            try {
              !d && !i && (r = l.return) && (yield r.call(l));
            } finally {
              if (s) throw s.error;
            }
          }
          return Array.from(a);
        }();
      });
    }
  }
  class Vh extends Sc {
    constructor(e, t, i, s) {
      super(e, t, i, s), this.receivedChunks = /* @__PURE__ */ new Map();
    }
    handleChunkReceived(e) {
      var t;
      const i = yn(e.chunkIndex), s = this.receivedChunks.get(i);
      if (s && s.version > e.version) return;
      this.receivedChunks.set(i, e), this.bytesReceived += e.content.byteLength, this.validateBytesReceived();
      const r = this.totalByteSize ? this.bytesReceived / this.totalByteSize : void 0;
      (t = this.onProgress) === null || t === void 0 || t.call(this, r);
    }
    [Symbol.asyncIterator]() {
      const e = this.reader.getReader(), t = new TextDecoder("utf-8", {
        fatal: true
      });
      let i = new $e(), s = null, r = null;
      if (this.signal) {
        const a = this.signal;
        r = () => {
          var c;
          (c = i.reject) === null || c === void 0 || c.call(i, a.reason);
        }, a.addEventListener("abort", r), s = a;
      }
      const o = () => {
        e.releaseLock(), s && r && s.removeEventListener("abort", r), this.signal = void 0;
      };
      return {
        next: () => p(this, void 0, void 0, function* () {
          var a, c;
          try {
            const { done: d, value: l } = yield Promise.race([
              e.read(),
              i.promise,
              (c = (a = this.outOfBandFailureRejectingFuture) === null || a === void 0 ? void 0 : a.promise) !== null && c !== void 0 ? c : new Promise(() => {
              })
            ]);
            if (d) return this.validateBytesReceived(true), {
              done: true,
              value: void 0
            };
            {
              this.handleChunkReceived(l);
              let u;
              try {
                u = t.decode(l.content);
              } catch (h) {
                throw new ze("Cannot decode datastream chunk ".concat(l.chunkIndex, " as text: ").concat(h), Le.DecodeFailed);
              }
              return {
                done: false,
                value: u
              };
            }
          } catch (d) {
            throw o(), d;
          }
        }),
        return() {
          return p(this, void 0, void 0, function* () {
            return o(), {
              done: true,
              value: void 0
            };
          });
        }
      };
    }
    withAbortSignal(e) {
      return this.signal = e, this;
    }
    readAll() {
      return p(this, arguments, void 0, function() {
        var e = this;
        let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
        return function* () {
          var i, s, r, o;
          let a = "";
          const c = t.signal ? e.withAbortSignal(t.signal) : e;
          try {
            for (var d = true, l = St(c), u; u = yield l.next(), i = u.done, !i; d = true) o = u.value, d = false, a += o;
          } catch (h) {
            s = {
              error: h
            };
          } finally {
            try {
              !d && !i && (r = l.return) && (yield r.call(l));
            } finally {
              if (s) throw s.error;
            }
          }
          return a;
        }();
      });
    }
  }
  class qh {
    constructor() {
      this.log = H, this.byteStreamControllers = /* @__PURE__ */ new Map(), this.textStreamControllers = /* @__PURE__ */ new Map(), this.byteStreamHandlers = /* @__PURE__ */ new Map(), this.textStreamHandlers = /* @__PURE__ */ new Map();
    }
    registerTextStreamHandler(e, t) {
      if (this.textStreamHandlers.has(e)) throw new ze('A text stream handler for topic "'.concat(e, '" has already been set.'), Le.HandlerAlreadyRegistered);
      this.textStreamHandlers.set(e, t);
    }
    unregisterTextStreamHandler(e) {
      this.textStreamHandlers.delete(e);
    }
    registerByteStreamHandler(e, t) {
      if (this.byteStreamHandlers.has(e)) throw new ze('A byte stream handler for topic "'.concat(e, '" has already been set.'), Le.HandlerAlreadyRegistered);
      this.byteStreamHandlers.set(e, t);
    }
    unregisterByteStreamHandler(e) {
      this.byteStreamHandlers.delete(e);
    }
    clearControllers() {
      this.byteStreamControllers.clear(), this.textStreamControllers.clear();
    }
    validateParticipantHasNoActiveDataStreams(e) {
      var t, i, s, r;
      const o = Array.from(this.textStreamControllers.entries()).filter((c) => c[1].sendingParticipantIdentity === e), a = Array.from(this.byteStreamControllers.entries()).filter((c) => c[1].sendingParticipantIdentity === e);
      if (o.length > 0 || a.length > 0) {
        const c = new ze("Participant ".concat(e, " unexpectedly disconnected in the middle of sending data"), Le.AbnormalEnd);
        for (const [d, l] of a) (i = (t = l.outOfBandFailureRejectingFuture).reject) === null || i === void 0 || i.call(t, c), this.byteStreamControllers.delete(d);
        for (const [d, l] of o) (r = (s = l.outOfBandFailureRejectingFuture).reject) === null || r === void 0 || r.call(s, c), this.textStreamControllers.delete(d);
      }
    }
    handleDataStreamPacket(e, t) {
      return p(this, void 0, void 0, function* () {
        switch (e.value.case) {
          case "streamHeader":
            return this.handleStreamHeader(e.value.value, e.participantIdentity, t);
          case "streamChunk":
            return this.handleStreamChunk(e.value.value, t);
          case "streamTrailer":
            return this.handleStreamTrailer(e.value.value, t);
          default:
            throw new Error('DataPacket of value "'.concat(e.value.case, '" is not data stream related!'));
        }
      });
    }
    handleStreamHeader(e, t, i) {
      return p(this, void 0, void 0, function* () {
        var s;
        if (e.contentHeader.case === "byteHeader") {
          const r = this.byteStreamHandlers.get(e.topic);
          if (!r) {
            this.log.debug("ignoring incoming byte stream due to no handler for topic", e.topic);
            return;
          }
          let o;
          const a = new $e();
          a.promise.catch((l) => {
            this.log.error(l);
          });
          const c = {
            id: e.streamId,
            name: (s = e.contentHeader.value.name) !== null && s !== void 0 ? s : "unknown",
            mimeType: e.mimeType,
            size: e.totalLength ? Number(e.totalLength) : void 0,
            topic: e.topic,
            timestamp: yn(e.timestamp),
            attributes: e.attributes,
            encryptionType: i
          }, d = new ReadableStream({
            start: (l) => {
              if (o = l, this.textStreamControllers.has(e.streamId)) throw new ze("A data stream read is already in progress for a stream with id ".concat(e.streamId, "."), Le.AlreadyOpened);
              this.byteStreamControllers.set(e.streamId, {
                info: c,
                controller: o,
                startTime: Date.now(),
                sendingParticipantIdentity: t,
                outOfBandFailureRejectingFuture: a
              });
            }
          });
          r(new Bh(c, d, yn(e.totalLength), a), {
            identity: t
          });
        } else if (e.contentHeader.case === "textHeader") {
          const r = this.textStreamHandlers.get(e.topic);
          if (!r) {
            this.log.debug("ignoring incoming text stream due to no handler for topic", e.topic);
            return;
          }
          let o;
          const a = new $e();
          a.promise.catch((l) => {
            this.log.error(l);
          });
          const c = {
            id: e.streamId,
            mimeType: e.mimeType,
            size: e.totalLength ? Number(e.totalLength) : void 0,
            topic: e.topic,
            timestamp: Number(e.timestamp),
            attributes: e.attributes,
            encryptionType: i,
            attachedStreamIds: e.contentHeader.value.attachedStreamIds
          }, d = new ReadableStream({
            start: (l) => {
              if (o = l, this.textStreamControllers.has(e.streamId)) throw new ze("A data stream read is already in progress for a stream with id ".concat(e.streamId, "."), Le.AlreadyOpened);
              this.textStreamControllers.set(e.streamId, {
                info: c,
                controller: o,
                startTime: Date.now(),
                sendingParticipantIdentity: t,
                outOfBandFailureRejectingFuture: a
              });
            }
          });
          r(new Vh(c, d, yn(e.totalLength), a), {
            identity: t
          });
        }
      });
    }
    handleStreamChunk(e, t) {
      const i = this.byteStreamControllers.get(e.streamId);
      i && (i.info.encryptionType !== t ? (i.controller.error(new ze("Encryption type mismatch for stream ".concat(e.streamId, ". Expected ").concat(t, ", got ").concat(i.info.encryptionType), Le.EncryptionTypeMismatch)), this.byteStreamControllers.delete(e.streamId)) : e.content.length > 0 && i.controller.enqueue(e));
      const s = this.textStreamControllers.get(e.streamId);
      s && (s.info.encryptionType !== t ? (s.controller.error(new ze("Encryption type mismatch for stream ".concat(e.streamId, ". Expected ").concat(t, ", got ").concat(s.info.encryptionType), Le.EncryptionTypeMismatch)), this.textStreamControllers.delete(e.streamId)) : e.content.length > 0 && s.controller.enqueue(e));
    }
    handleStreamTrailer(e, t) {
      const i = this.textStreamControllers.get(e.streamId);
      i && (i.info.encryptionType !== t ? i.controller.error(new ze("Encryption type mismatch for stream ".concat(e.streamId, ". Expected ").concat(t, ", got ").concat(i.info.encryptionType), Le.EncryptionTypeMismatch)) : (i.info.attributes = Object.assign(Object.assign({}, i.info.attributes), e.attributes), i.controller.close(), this.textStreamControllers.delete(e.streamId)));
      const s = this.byteStreamControllers.get(e.streamId);
      s && (s.info.encryptionType !== t ? s.controller.error(new ze("Encryption type mismatch for stream ".concat(e.streamId, ". Expected ").concat(t, ", got ").concat(s.info.encryptionType), Le.EncryptionTypeMismatch)) : (s.info.attributes = Object.assign(Object.assign({}, s.info.attributes), e.attributes), s.controller.close()), this.byteStreamControllers.delete(e.streamId));
    }
  }
  class Tc {
    constructor(e, t, i) {
      this.writableStream = e, this.defaultWriter = e.getWriter(), this.onClose = i, this.info = t;
    }
    write(e) {
      return this.defaultWriter.write(e);
    }
    close() {
      return p(this, void 0, void 0, function* () {
        var e;
        yield this.defaultWriter.close(), this.defaultWriter.releaseLock(), (e = this.onClose) === null || e === void 0 || e.call(this);
      });
    }
  }
  class Gh extends Tc {
  }
  class Wh extends Tc {
  }
  const Ta = 15e3;
  class Kh {
    constructor(e, t) {
      this.engine = e, this.log = t;
    }
    setupEngine(e) {
      this.engine = e;
    }
    sendText(e, t) {
      return p(this, void 0, void 0, function* () {
        var i;
        const s = crypto.randomUUID(), o = new TextEncoder().encode(e).byteLength, a = (i = t == null ? void 0 : t.attachments) === null || i === void 0 ? void 0 : i.map(() => crypto.randomUUID()), c = new Array(a ? a.length + 1 : 1).fill(0), d = (u, h) => {
          var m;
          c[h] = u;
          const v = c.reduce((g, T) => g + T, 0);
          (m = t == null ? void 0 : t.onProgress) === null || m === void 0 || m.call(t, v);
        }, l = yield this.streamText({
          streamId: s,
          totalSize: o,
          destinationIdentities: t == null ? void 0 : t.destinationIdentities,
          topic: t == null ? void 0 : t.topic,
          attachedStreamIds: a,
          attributes: t == null ? void 0 : t.attributes
        });
        return yield l.write(e), d(1, 0), yield l.close(), (t == null ? void 0 : t.attachments) && a && (yield Promise.all(t.attachments.map((u, h) => p(this, void 0, void 0, function* () {
          return this._sendFile(a[h], u, {
            topic: t.topic,
            mimeType: u.type,
            onProgress: (m) => {
              d(m, h + 1);
            }
          });
        })))), l.info;
      });
    }
    streamText(e) {
      return p(this, void 0, void 0, function* () {
        var t, i, s;
        const r = (t = e == null ? void 0 : e.streamId) !== null && t !== void 0 ? t : crypto.randomUUID(), o = {
          id: r,
          mimeType: "text/plain",
          timestamp: Date.now(),
          topic: (i = e == null ? void 0 : e.topic) !== null && i !== void 0 ? i : "",
          size: e == null ? void 0 : e.totalSize,
          attributes: e == null ? void 0 : e.attributes,
          encryptionType: !((s = this.engine.e2eeManager) === null || s === void 0) && s.isDataChannelEncryptionEnabled ? ge.GCM : ge.NONE,
          attachedStreamIds: e == null ? void 0 : e.attachedStreamIds
        }, a = new wn({
          streamId: r,
          mimeType: o.mimeType,
          topic: o.topic,
          timestamp: ei(o.timestamp),
          totalLength: ei(e == null ? void 0 : e.totalSize),
          attributes: o.attributes,
          contentHeader: {
            case: "textHeader",
            value: new ho({
              version: e == null ? void 0 : e.version,
              attachedStreamIds: o.attachedStreamIds,
              replyToStreamId: e == null ? void 0 : e.replyToStreamId,
              operationType: (e == null ? void 0 : e.type) === "update" ? us.UPDATE : us.CREATE
            })
          }
        }), c = e == null ? void 0 : e.destinationIdentities, d = new Ue({
          destinationIdentities: c,
          value: {
            case: "streamHeader",
            value: a
          }
        });
        yield this.engine.sendDataPacket(d, Q.RELIABLE);
        let l = 0;
        const u = this.engine, h = new WritableStream({
          write(g) {
            return p(this, void 0, void 0, function* () {
              for (const T of Ou(g, Ta)) {
                const S = new En({
                  content: T,
                  streamId: r,
                  chunkIndex: ei(l)
                }), I = new Ue({
                  destinationIdentities: c,
                  value: {
                    case: "streamChunk",
                    value: S
                  }
                });
                yield u.sendDataPacket(I, Q.RELIABLE), l += 1;
              }
            });
          },
          close() {
            return p(this, void 0, void 0, function* () {
              const g = new Rn({
                streamId: r
              }), T = new Ue({
                destinationIdentities: c,
                value: {
                  case: "streamTrailer",
                  value: g
                }
              });
              yield u.sendDataPacket(T, Q.RELIABLE);
            });
          },
          abort(g) {
            console.log("Sink error:", g);
          }
        });
        let m = () => p(this, void 0, void 0, function* () {
          yield v.close();
        });
        u.once(M.Closing, m);
        const v = new Gh(h, o, () => this.engine.off(M.Closing, m));
        return v;
      });
    }
    sendFile(e, t) {
      return p(this, void 0, void 0, function* () {
        const i = crypto.randomUUID();
        return yield this._sendFile(i, e, t), {
          id: i
        };
      });
    }
    _sendFile(e, t, i) {
      return p(this, void 0, void 0, function* () {
        var s;
        const r = yield this.streamBytes({
          streamId: e,
          totalSize: t.size,
          name: t.name,
          mimeType: (s = i == null ? void 0 : i.mimeType) !== null && s !== void 0 ? s : t.type,
          topic: i == null ? void 0 : i.topic,
          destinationIdentities: i == null ? void 0 : i.destinationIdentities
        }), o = t.stream().getReader();
        for (; ; ) {
          const { done: a, value: c } = yield o.read();
          if (a) break;
          yield r.write(c);
        }
        return yield r.close(), r.info;
      });
    }
    streamBytes(e) {
      return p(this, void 0, void 0, function* () {
        var t, i, s, r, o, a;
        const c = (t = e == null ? void 0 : e.streamId) !== null && t !== void 0 ? t : crypto.randomUUID(), d = e == null ? void 0 : e.destinationIdentities, l = {
          id: c,
          mimeType: (i = e == null ? void 0 : e.mimeType) !== null && i !== void 0 ? i : "application/octet-stream",
          topic: (s = e == null ? void 0 : e.topic) !== null && s !== void 0 ? s : "",
          timestamp: Date.now(),
          attributes: e == null ? void 0 : e.attributes,
          size: e == null ? void 0 : e.totalSize,
          name: (r = e == null ? void 0 : e.name) !== null && r !== void 0 ? r : "unknown",
          encryptionType: !((o = this.engine.e2eeManager) === null || o === void 0) && o.isDataChannelEncryptionEnabled ? ge.GCM : ge.NONE
        }, u = new wn({
          totalLength: ei((a = l.size) !== null && a !== void 0 ? a : 0),
          mimeType: l.mimeType,
          streamId: c,
          topic: l.topic,
          timestamp: ei(Date.now()),
          attributes: l.attributes,
          contentHeader: {
            case: "byteHeader",
            value: new po({
              name: l.name
            })
          }
        }), h = new Ue({
          destinationIdentities: d,
          value: {
            case: "streamHeader",
            value: u
          }
        });
        yield this.engine.sendDataPacket(h, Q.RELIABLE);
        let m = 0;
        const v = new je(), g = this.engine, T = this.log, S = new WritableStream({
          write(P) {
            return p(this, void 0, void 0, function* () {
              const b = yield v.lock();
              let k = 0;
              try {
                for (; k < P.byteLength; ) {
                  const w = P.slice(k, k + Ta), A = new Ue({
                    destinationIdentities: d,
                    value: {
                      case: "streamChunk",
                      value: new En({
                        content: w,
                        streamId: c,
                        chunkIndex: ei(m)
                      })
                    }
                  });
                  yield g.sendDataPacket(A, Q.RELIABLE), m += 1, k += w.byteLength;
                }
              } finally {
                b();
              }
            });
          },
          close() {
            return p(this, void 0, void 0, function* () {
              const P = new Rn({
                streamId: c
              }), b = new Ue({
                destinationIdentities: d,
                value: {
                  case: "streamTrailer",
                  value: P
                }
              });
              yield g.sendDataPacket(b, Q.RELIABLE);
            });
          },
          abort(P) {
            T.error("Sink error:", P);
          }
        });
        return new Wh(S, l);
      });
    }
  }
  class Cc extends C {
    constructor(e, t, i, s, r) {
      super(e, i, r), this.sid = t, this.receiver = s;
    }
    get isLocal() {
      return false;
    }
    setMuted(e) {
      this.isMuted !== e && (this.isMuted = e, this._mediaStreamTrack.enabled = !e, this.emit(e ? x.Muted : x.Unmuted, this));
    }
    setMediaStream(e) {
      this.mediaStream = e;
      const t = (i) => {
        i.track === this._mediaStreamTrack && (e.removeEventListener("removetrack", t), this.receiver && "playoutDelayHint" in this.receiver && (this.receiver.playoutDelayHint = void 0), this.receiver = void 0, this._currentBitrate = 0, this.emit(x.Ended, this));
      };
      e.addEventListener("removetrack", t);
    }
    start() {
      this.startMonitor(), super.enable();
    }
    stop() {
      this.stopMonitor(), super.disable();
    }
    getRTCStatsReport() {
      return p(this, void 0, void 0, function* () {
        var e;
        return !((e = this.receiver) === null || e === void 0) && e.getStats ? yield this.receiver.getStats() : void 0;
      });
    }
    setPlayoutDelay(e) {
      this.receiver ? "playoutDelayHint" in this.receiver ? this.receiver.playoutDelayHint = e : this.log.warn("Playout delay not supported in this browser") : this.log.warn("Cannot set playout delay, track already ended");
    }
    getPlayoutDelay() {
      if (this.receiver) {
        if ("playoutDelayHint" in this.receiver) return this.receiver.playoutDelayHint;
        this.log.warn("Playout delay not supported in this browser");
      } else this.log.warn("Cannot get playout delay, track already ended");
      return 0;
    }
    startMonitor() {
      this.monitorInterval || (this.monitorInterval = setInterval(() => this.monitorReceiver(), cr)), lu() && this.registerTimeSyncUpdate();
    }
    registerTimeSyncUpdate() {
      const e = () => {
        var t;
        this.timeSyncHandle = requestAnimationFrame(() => e());
        const i = (t = this.receiver) === null || t === void 0 ? void 0 : t.getSynchronizationSources()[0];
        if (i) {
          const { timestamp: s, rtpTimestamp: r } = i;
          r && this.rtpTimestamp !== r && (this.emit(x.TimeSyncUpdate, {
            timestamp: s,
            rtpTimestamp: r
          }), this.rtpTimestamp = r);
        }
      };
      e();
    }
  }
  class Hh extends Cc {
    constructor(e, t, i, s, r, o) {
      super(e, t, C.Kind.Audio, i, o), this.monitorReceiver = () => p(this, void 0, void 0, function* () {
        if (!this.receiver) {
          this._currentBitrate = 0;
          return;
        }
        const a = yield this.getReceiverStats();
        a && this.prevStats && this.receiver && (this._currentBitrate = jn(a, this.prevStats)), this.prevStats = a;
      }), this.audioContext = s, this.webAudioPluginNodes = [], r && (this.sinkId = r.deviceId);
    }
    setVolume(e) {
      var t;
      for (const i of this.attachedElements) this.audioContext ? (t = this.gainNode) === null || t === void 0 || t.gain.setTargetAtTime(e, 0, 0.1) : i.volume = e;
      ut() && this._mediaStreamTrack._setVolume(e), this.elementVolume = e;
    }
    getVolume() {
      if (this.elementVolume) return this.elementVolume;
      if (ut()) return 1;
      let e = 0;
      return this.attachedElements.forEach((t) => {
        t.volume > e && (e = t.volume);
      }), e;
    }
    setSinkId(e) {
      return p(this, void 0, void 0, function* () {
        this.sinkId = e, yield Promise.all(this.attachedElements.map((t) => {
          if (_s(t)) return t.setSinkId(e);
        }));
      });
    }
    attach(e) {
      const t = this.attachedElements.length === 0;
      return e ? super.attach(e) : e = super.attach(), this.sinkId && _s(e) && e.setSinkId(this.sinkId).catch((i) => {
        this.log.error("Failed to set sink id on remote audio track", i, this.logContext);
      }), this.audioContext && t && (this.log.debug("using audio context mapping", this.logContext), this.connectWebAudio(this.audioContext, e), e.volume = 0, e.muted = true), this.elementVolume && this.setVolume(this.elementVolume), e;
    }
    detach(e) {
      let t;
      return e ? (t = super.detach(e), this.audioContext && (this.attachedElements.length > 0 ? this.connectWebAudio(this.audioContext, this.attachedElements[0]) : this.disconnectWebAudio())) : (t = super.detach(), this.disconnectWebAudio()), t;
    }
    setAudioContext(e) {
      this.audioContext = e, e && this.attachedElements.length > 0 ? this.connectWebAudio(e, this.attachedElements[0]) : e || this.disconnectWebAudio();
    }
    setWebAudioPlugins(e) {
      this.webAudioPluginNodes = e, this.attachedElements.length > 0 && this.audioContext && this.connectWebAudio(this.audioContext, this.attachedElements[0]);
    }
    connectWebAudio(e, t) {
      this.disconnectWebAudio(), this.sourceNode = e.createMediaStreamSource(t.srcObject);
      let i = this.sourceNode;
      this.webAudioPluginNodes.forEach((s) => {
        i.connect(s), i = s;
      }), this.gainNode = e.createGain(), i.connect(this.gainNode), this.gainNode.connect(e.destination), this.elementVolume && this.gainNode.gain.setTargetAtTime(this.elementVolume, 0, 0.1), e.state !== "running" && e.resume().then(() => {
        e.state !== "running" && this.emit(x.AudioPlaybackFailed, new Error("Audio Context couldn't be started automatically"));
      }).catch((s) => {
        this.emit(x.AudioPlaybackFailed, s);
      });
    }
    disconnectWebAudio() {
      var e, t;
      (e = this.gainNode) === null || e === void 0 || e.disconnect(), (t = this.sourceNode) === null || t === void 0 || t.disconnect(), this.gainNode = void 0, this.sourceNode = void 0;
    }
    getReceiverStats() {
      return p(this, void 0, void 0, function* () {
        if (!this.receiver || !this.receiver.getStats) return;
        const e = yield this.receiver.getStats();
        let t;
        return e.forEach((i) => {
          i.type === "inbound-rtp" && (t = {
            type: "audio",
            streamId: i.id,
            timestamp: i.timestamp,
            jitter: i.jitter,
            bytesReceived: i.bytesReceived,
            concealedSamples: i.concealedSamples,
            concealmentEvents: i.concealmentEvents,
            silentConcealedSamples: i.silentConcealedSamples,
            silentConcealmentEvents: i.silentConcealmentEvents,
            totalAudioEnergy: i.totalAudioEnergy,
            totalSamplesDuration: i.totalSamplesDuration
          });
        }), t;
      });
    }
  }
  const os = 100;
  class Jh extends Cc {
    constructor(e, t, i, s, r) {
      super(e, t, C.Kind.Video, i, r), this.elementInfos = [], this.monitorReceiver = () => p(this, void 0, void 0, function* () {
        if (!this.receiver) {
          this._currentBitrate = 0;
          return;
        }
        const o = yield this.getReceiverStats();
        o && this.prevStats && this.receiver && (this._currentBitrate = jn(o, this.prevStats)), this.prevStats = o;
      }), this.debouncedHandleResize = sr(() => {
        this.updateDimensions();
      }, os), this.adaptiveStreamSettings = s;
    }
    get isAdaptiveStream() {
      return this.adaptiveStreamSettings !== void 0;
    }
    setStreamState(e) {
      super.setStreamState(e), this.log.debug("setStreamState", e), this.isAdaptiveStream && e === C.StreamState.Active && this.updateVisibility();
    }
    get mediaStreamTrack() {
      return this._mediaStreamTrack;
    }
    setMuted(e) {
      super.setMuted(e), this.attachedElements.forEach((t) => {
        e ? Si(this._mediaStreamTrack, t) : pi(this._mediaStreamTrack, t);
      });
    }
    attach(e) {
      if (e ? super.attach(e) : e = super.attach(), this.adaptiveStreamSettings && this.elementInfos.find((t) => t.element === e) === void 0) {
        const t = new zh(e);
        this.observeElementInfo(t);
      }
      return e;
    }
    observeElementInfo(e) {
      this.adaptiveStreamSettings && this.elementInfos.find((t) => t === e) === void 0 ? (e.handleResize = () => {
        this.debouncedHandleResize();
      }, e.handleVisibilityChanged = () => {
        this.updateVisibility();
      }, this.elementInfos.push(e), e.observe(), this.debouncedHandleResize(), this.updateVisibility()) : this.log.warn("visibility resize observer not triggered", this.logContext);
    }
    stopObservingElementInfo(e) {
      if (!this.isAdaptiveStream) {
        this.log.warn("stopObservingElementInfo ignored", this.logContext);
        return;
      }
      const t = this.elementInfos.filter((i) => i === e);
      for (const i of t) i.stopObserving();
      this.elementInfos = this.elementInfos.filter((i) => i !== e), this.updateVisibility(), this.debouncedHandleResize();
    }
    detach(e) {
      let t = [];
      if (e) return this.stopObservingElement(e), super.detach(e);
      t = super.detach();
      for (const i of t) this.stopObservingElement(i);
      return t;
    }
    getDecoderImplementation() {
      var e;
      return (e = this.prevStats) === null || e === void 0 ? void 0 : e.decoderImplementation;
    }
    getReceiverStats() {
      return p(this, void 0, void 0, function* () {
        if (!this.receiver || !this.receiver.getStats) return;
        const e = yield this.receiver.getStats();
        let t, i = "", s = /* @__PURE__ */ new Map();
        return e.forEach((r) => {
          r.type === "inbound-rtp" ? (i = r.codecId, t = {
            type: "video",
            streamId: r.id,
            framesDecoded: r.framesDecoded,
            framesDropped: r.framesDropped,
            framesReceived: r.framesReceived,
            packetsReceived: r.packetsReceived,
            packetsLost: r.packetsLost,
            frameWidth: r.frameWidth,
            frameHeight: r.frameHeight,
            pliCount: r.pliCount,
            firCount: r.firCount,
            nackCount: r.nackCount,
            jitter: r.jitter,
            timestamp: r.timestamp,
            bytesReceived: r.bytesReceived,
            decoderImplementation: r.decoderImplementation
          }) : r.type === "codec" && s.set(r.id, r);
        }), t && i !== "" && s.get(i) && (t.mimeType = s.get(i).mimeType), t;
      });
    }
    stopObservingElement(e) {
      const t = this.elementInfos.filter((i) => i.element === e);
      for (const i of t) this.stopObservingElementInfo(i);
    }
    handleAppVisibilityChanged() {
      const e = Object.create(null, {
        handleAppVisibilityChanged: {
          get: () => super.handleAppVisibilityChanged
        }
      });
      return p(this, void 0, void 0, function* () {
        yield e.handleAppVisibilityChanged.call(this), this.isAdaptiveStream && this.updateVisibility();
      });
    }
    updateVisibility(e) {
      var t, i;
      const s = this.elementInfos.reduce((c, d) => Math.max(c, d.visibilityChangedAt || 0), 0), r = !((i = (t = this.adaptiveStreamSettings) === null || t === void 0 ? void 0 : t.pauseVideoInBackground) !== null && i !== void 0) || i ? this.isInBackground : false, o = this.elementInfos.some((c) => c.pictureInPicture), a = this.elementInfos.some((c) => c.visible) && !r || o;
      if (!(this.lastVisible === a && !e)) {
        if (!a && Date.now() - s < os) {
          Ie.setTimeout(() => {
            this.updateVisibility();
          }, os);
          return;
        }
        this.lastVisible = a, this.emit(x.VisibilityChanged, a, this);
      }
    }
    updateDimensions() {
      var e, t;
      let i = 0, s = 0;
      const r = this.getPixelDensity();
      for (const o of this.elementInfos) {
        const a = o.width() * r, c = o.height() * r;
        a + c > i + s && (i = a, s = c);
      }
      ((e = this.lastDimensions) === null || e === void 0 ? void 0 : e.width) === i && ((t = this.lastDimensions) === null || t === void 0 ? void 0 : t.height) === s || (this.lastDimensions = {
        width: i,
        height: s
      }, this.emit(x.VideoDimensionsChanged, this.lastDimensions, this));
    }
    getPixelDensity() {
      var e;
      const t = (e = this.adaptiveStreamSettings) === null || e === void 0 ? void 0 : e.pixelDensity;
      return t === "screen" ? Qr() : t || (Qr() > 2 ? 2 : 1);
    }
  }
  class zh {
    get visible() {
      return this.isPiP || this.isIntersecting;
    }
    get pictureInPicture() {
      return this.isPiP;
    }
    constructor(e, t) {
      this.onVisibilityChanged = (i) => {
        var s;
        const { target: r, isIntersecting: o } = i;
        r === this.element && (this.isIntersecting = o, this.isPiP = Fi(this.element), this.visibilityChangedAt = Date.now(), (s = this.handleVisibilityChanged) === null || s === void 0 || s.call(this));
      }, this.onEnterPiP = () => {
        var i, s, r;
        (s = (i = window.documentPictureInPicture) === null || i === void 0 ? void 0 : i.window) === null || s === void 0 || s.addEventListener("pagehide", this.onLeavePiP), this.isPiP = Fi(this.element), (r = this.handleVisibilityChanged) === null || r === void 0 || r.call(this);
      }, this.onLeavePiP = () => {
        var i;
        this.isPiP = Fi(this.element), (i = this.handleVisibilityChanged) === null || i === void 0 || i.call(this);
      }, this.element = e, this.isIntersecting = t ?? As(e), this.isPiP = Ge() && Fi(e), this.visibilityChangedAt = 0;
    }
    width() {
      return this.element.clientWidth;
    }
    height() {
      return this.element.clientHeight;
    }
    observe() {
      var e, t, i;
      this.isIntersecting = As(this.element), this.isPiP = Fi(this.element), this.element.handleResize = () => {
        var s;
        (s = this.handleResize) === null || s === void 0 || s.call(this);
      }, this.element.handleVisibilityChanged = this.onVisibilityChanged, Xr().observe(this.element), Yr().observe(this.element), this.element.addEventListener("enterpictureinpicture", this.onEnterPiP), this.element.addEventListener("leavepictureinpicture", this.onLeavePiP), (e = window.documentPictureInPicture) === null || e === void 0 || e.addEventListener("enter", this.onEnterPiP), (i = (t = window.documentPictureInPicture) === null || t === void 0 ? void 0 : t.window) === null || i === void 0 || i.addEventListener("pagehide", this.onLeavePiP);
    }
    stopObserving() {
      var e, t, i, s, r;
      (e = Xr()) === null || e === void 0 || e.unobserve(this.element), (t = Yr()) === null || t === void 0 || t.unobserve(this.element), this.element.removeEventListener("enterpictureinpicture", this.onEnterPiP), this.element.removeEventListener("leavepictureinpicture", this.onLeavePiP), (i = window.documentPictureInPicture) === null || i === void 0 || i.removeEventListener("enter", this.onEnterPiP), (r = (s = window.documentPictureInPicture) === null || s === void 0 ? void 0 : s.window) === null || r === void 0 || r.removeEventListener("pagehide", this.onLeavePiP);
    }
  }
  function Fi(n) {
    var e, t;
    return document.pictureInPictureElement === n ? true : !((e = window.documentPictureInPicture) === null || e === void 0) && e.window ? As(n, (t = window.documentPictureInPicture) === null || t === void 0 ? void 0 : t.window) : false;
  }
  function As(n, e) {
    const t = e || window;
    let i = n.offsetTop, s = n.offsetLeft;
    const r = n.offsetWidth, o = n.offsetHeight, { hidden: a } = n, { display: c } = getComputedStyle(n);
    for (; n.offsetParent; ) n = n.offsetParent, i += n.offsetTop, s += n.offsetLeft;
    return i < t.pageYOffset + t.innerHeight && s < t.pageXOffset + t.innerWidth && i + o > t.pageYOffset && s + r > t.pageXOffset && !a && c !== "none";
  }
  class yt extends pt.EventEmitter {
    constructor(e, t, i, s) {
      var r;
      super(), this.metadataMuted = false, this.encryption = ge.NONE, this.log = H, this.handleMuted = () => {
        this.emit(x.Muted);
      }, this.handleUnmuted = () => {
        this.emit(x.Unmuted);
      }, this.log = wt((r = s == null ? void 0 : s.loggerName) !== null && r !== void 0 ? r : at.Publication), this.loggerContextCb = this.loggerContextCb, this.setMaxListeners(100), this.kind = e, this.trackSid = t, this.trackName = i, this.source = C.Source.Unknown;
    }
    setTrack(e) {
      this.track && (this.track.off(x.Muted, this.handleMuted), this.track.off(x.Unmuted, this.handleUnmuted)), this.track = e, e && (e.on(x.Muted, this.handleMuted), e.on(x.Unmuted, this.handleUnmuted));
    }
    get logContext() {
      var e;
      return Object.assign(Object.assign({}, (e = this.loggerContextCb) === null || e === void 0 ? void 0 : e.call(this)), Y(this));
    }
    get isMuted() {
      return this.metadataMuted;
    }
    get isEnabled() {
      return true;
    }
    get isSubscribed() {
      return this.track !== void 0;
    }
    get isEncrypted() {
      return this.encryption !== ge.NONE;
    }
    get audioTrack() {
      if (lt(this.track)) return this.track;
    }
    get videoTrack() {
      if (Wt(this.track)) return this.track;
    }
    updateInfo(e) {
      this.trackSid = e.sid, this.trackName = e.name, this.source = C.sourceFromProto(e.source), this.mimeType = e.mimeType, this.kind === C.Kind.Video && e.width > 0 && (this.dimensions = {
        width: e.width,
        height: e.height
      }, this.simulcasted = e.simulcast), this.encryption = e.encryption, this.trackInfo = e, this.log.debug("update publication info", Object.assign(Object.assign({}, this.logContext), {
        info: e
      }));
    }
  }
  (function(n) {
    (function(e) {
      e.Desired = "desired", e.Subscribed = "subscribed", e.Unsubscribed = "unsubscribed";
    })(n.SubscriptionStatus || (n.SubscriptionStatus = {})), function(e) {
      e.Allowed = "allowed", e.NotAllowed = "not_allowed";
    }(n.PermissionStatus || (n.PermissionStatus = {}));
  })(yt || (yt = {}));
  class Ns extends yt {
    get isUpstreamPaused() {
      var e;
      return (e = this.track) === null || e === void 0 ? void 0 : e.isUpstreamPaused;
    }
    constructor(e, t, i, s) {
      super(e, t.sid, t.name, s), this.track = void 0, this.handleTrackEnded = () => {
        this.emit(x.Ended);
      }, this.handleCpuConstrained = () => {
        this.track && Wt(this.track) && this.emit(x.CpuConstrained, this.track);
      }, this.updateInfo(t), this.setTrack(i);
    }
    setTrack(e) {
      this.track && (this.track.off(x.Ended, this.handleTrackEnded), this.track.off(x.CpuConstrained, this.handleCpuConstrained)), super.setTrack(e), e && (e.on(x.Ended, this.handleTrackEnded), e.on(x.CpuConstrained, this.handleCpuConstrained));
    }
    get isMuted() {
      return this.track ? this.track.isMuted : super.isMuted;
    }
    get audioTrack() {
      return super.audioTrack;
    }
    get videoTrack() {
      return super.videoTrack;
    }
    get isLocal() {
      return true;
    }
    mute() {
      return p(this, void 0, void 0, function* () {
        var e;
        return (e = this.track) === null || e === void 0 ? void 0 : e.mute();
      });
    }
    unmute() {
      return p(this, void 0, void 0, function* () {
        var e;
        return (e = this.track) === null || e === void 0 ? void 0 : e.unmute();
      });
    }
    pauseUpstream() {
      return p(this, void 0, void 0, function* () {
        var e;
        yield (e = this.track) === null || e === void 0 ? void 0 : e.pauseUpstream();
      });
    }
    resumeUpstream() {
      return p(this, void 0, void 0, function* () {
        var e;
        yield (e = this.track) === null || e === void 0 ? void 0 : e.resumeUpstream();
      });
    }
    getTrackFeatures() {
      var e;
      if (lt(this.track)) {
        const t = this.track.getSourceTrackSettings(), i = /* @__PURE__ */ new Set();
        return t.autoGainControl && i.add(we.TF_AUTO_GAIN_CONTROL), t.echoCancellation && i.add(we.TF_ECHO_CANCELLATION), t.noiseSuppression && i.add(we.TF_NOISE_SUPPRESSION), t.channelCount && t.channelCount > 1 && i.add(we.TF_STEREO), !((e = this.options) === null || e === void 0) && e.dtx || i.add(we.TF_NO_DTX), this.track.enhancedNoiseCancellation && i.add(we.TF_ENHANCED_NOISE_CANCELLATION), Array.from(i.values());
      } else return [];
    }
  }
  function Fn(n, e) {
    return p(this, void 0, void 0, function* () {
      n ?? (n = {});
      let t = false;
      const { audioProcessor: i, videoProcessor: s, optionsWithoutProcessor: r } = dc(n);
      let o = r.audio, a = r.video;
      if (i && typeof r.audio == "object" && (r.audio.processor = i), s && typeof r.video == "object" && (r.video.processor = s), n.audio && typeof r.audio == "object" && typeof r.audio.deviceId == "string") {
        const u = r.audio.deviceId;
        r.audio.deviceId = {
          exact: u
        }, t = true, o = Object.assign(Object.assign({}, r.audio), {
          deviceId: {
            ideal: u
          }
        });
      }
      if (r.video && typeof r.video == "object" && typeof r.video.deviceId == "string") {
        const u = r.video.deviceId;
        r.video.deviceId = {
          exact: u
        }, t = true, a = Object.assign(Object.assign({}, r.video), {
          deviceId: {
            ideal: u
          }
        });
      }
      r.audio === true ? r.audio = {
        deviceId: "default"
      } : typeof r.audio == "object" && r.audio !== null && (r.audio = Object.assign(Object.assign({}, r.audio), {
        deviceId: r.audio.deviceId || "default"
      })), r.video === true ? r.video = {
        deviceId: "default"
      } : typeof r.video == "object" && !r.video.deviceId && (r.video.deviceId = "default");
      const c = ac(r, mc, fc), d = er(c), l = navigator.mediaDevices.getUserMedia(d);
      r.audio && (Ee.userMediaPromiseMap.set("audioinput", l), l.catch(() => Ee.userMediaPromiseMap.delete("audioinput"))), r.video && (Ee.userMediaPromiseMap.set("videoinput", l), l.catch(() => Ee.userMediaPromiseMap.delete("videoinput")));
      try {
        const u = yield l;
        return yield Promise.all(u.getTracks().map((h) => p(this, void 0, void 0, function* () {
          const m = h.kind === "audio";
          let v = m ? c.audio : c.video;
          (typeof v == "boolean" || !v) && (v = {});
          let g;
          const T = m ? d.audio : d.video;
          typeof T != "boolean" && (g = T);
          const S = h.getSettings().deviceId;
          (g == null ? void 0 : g.deviceId) && Ft(g.deviceId) !== S ? g.deviceId = S : g || (g = {
            deviceId: S
          });
          const I = Th(h, g, e);
          return I.kind === C.Kind.Video ? I.source = C.Source.Camera : I.kind === C.Kind.Audio && (I.source = C.Source.Microphone), I.mediaStream = u, lt(I) && i ? yield I.setProcessor(i) : Wt(I) && s && (yield I.setProcessor(s)), I;
        })));
      } catch (u) {
        if (!t) throw u;
        return Fn(Object.assign(Object.assign({}, n), {
          audio: o,
          video: a
        }), e);
      }
    });
  }
  function $h(n) {
    return p(this, void 0, void 0, function* () {
      return (yield Fn({
        audio: false,
        video: true
      }))[0];
    });
  }
  function Qh(n) {
    return p(this, void 0, void 0, function* () {
      return (yield Fn({
        audio: true,
        video: false
      }))[0];
    });
  }
  var Lt;
  (function(n) {
    n.Excellent = "excellent", n.Good = "good", n.Poor = "poor", n.Lost = "lost", n.Unknown = "unknown";
  })(Lt || (Lt = {}));
  function Yh(n) {
    switch (n) {
      case Bi.EXCELLENT:
        return Lt.Excellent;
      case Bi.GOOD:
        return Lt.Good;
      case Bi.POOR:
        return Lt.Poor;
      case Bi.LOST:
        return Lt.Lost;
      default:
        return Lt.Unknown;
    }
  }
  class wc extends pt.EventEmitter {
    get logContext() {
      var e, t;
      return Object.assign({}, (t = (e = this.loggerOptions) === null || e === void 0 ? void 0 : e.loggerContextCb) === null || t === void 0 ? void 0 : t.call(e));
    }
    get isEncrypted() {
      return this.trackPublications.size > 0 && Array.from(this.trackPublications.values()).every((e) => e.isEncrypted);
    }
    get isAgent() {
      var e;
      return ((e = this.permissions) === null || e === void 0 ? void 0 : e.agent) || this.kind === zi.AGENT;
    }
    get isActive() {
      var e;
      return ((e = this.participantInfo) === null || e === void 0 ? void 0 : e.state) === vi.ACTIVE;
    }
    get kind() {
      return this._kind;
    }
    get attributes() {
      return Object.freeze(Object.assign({}, this._attributes));
    }
    constructor(e, t, i, s, r, o) {
      let a = arguments.length > 6 && arguments[6] !== void 0 ? arguments[6] : zi.STANDARD;
      var c;
      super(), this.audioLevel = 0, this.isSpeaking = false, this._connectionQuality = Lt.Unknown, this.log = H, this.log = wt((c = o == null ? void 0 : o.loggerName) !== null && c !== void 0 ? c : at.Participant), this.loggerOptions = o, this.setMaxListeners(100), this.sid = e, this.identity = t, this.name = i, this.metadata = s, this.audioTrackPublications = /* @__PURE__ */ new Map(), this.videoTrackPublications = /* @__PURE__ */ new Map(), this.trackPublications = /* @__PURE__ */ new Map(), this._kind = a, this._attributes = r ?? {};
    }
    getTrackPublications() {
      return Array.from(this.trackPublications.values());
    }
    getTrackPublication(e) {
      for (const [, t] of this.trackPublications) if (t.source === e) return t;
    }
    getTrackPublicationByName(e) {
      for (const [, t] of this.trackPublications) if (t.trackName === e) return t;
    }
    waitUntilActive() {
      return this.isActive ? Promise.resolve() : this.activeFuture ? this.activeFuture.promise : (this.activeFuture = new $e(), this.once(O.Active, () => {
        var e, t;
        (t = (e = this.activeFuture) === null || e === void 0 ? void 0 : e.resolve) === null || t === void 0 || t.call(e), this.activeFuture = void 0;
      }), this.activeFuture.promise);
    }
    get connectionQuality() {
      return this._connectionQuality;
    }
    get isCameraEnabled() {
      var e;
      const t = this.getTrackPublication(C.Source.Camera);
      return !(!((e = t == null ? void 0 : t.isMuted) !== null && e !== void 0) || e);
    }
    get isMicrophoneEnabled() {
      var e;
      const t = this.getTrackPublication(C.Source.Microphone);
      return !(!((e = t == null ? void 0 : t.isMuted) !== null && e !== void 0) || e);
    }
    get isScreenShareEnabled() {
      return !!this.getTrackPublication(C.Source.ScreenShare);
    }
    get isLocal() {
      return false;
    }
    get joinedAt() {
      return this.participantInfo ? new Date(Number.parseInt(this.participantInfo.joinedAt.toString()) * 1e3) : /* @__PURE__ */ new Date();
    }
    updateInfo(e) {
      var t;
      return this.participantInfo && this.participantInfo.sid === e.sid && this.participantInfo.version > e.version ? false : (this.identity = e.identity, this.sid = e.sid, this._setName(e.name), this._setMetadata(e.metadata), this._setAttributes(e.attributes), e.state === vi.ACTIVE && ((t = this.participantInfo) === null || t === void 0 ? void 0 : t.state) !== vi.ACTIVE && this.emit(O.Active), e.permission && this.setPermissions(e.permission), this.participantInfo = e, true);
    }
    _setMetadata(e) {
      const t = this.metadata !== e, i = this.metadata;
      this.metadata = e, t && this.emit(O.ParticipantMetadataChanged, i);
    }
    _setName(e) {
      const t = this.name !== e;
      this.name = e, t && this.emit(O.ParticipantNameChanged, e);
    }
    _setAttributes(e) {
      const t = uu(this.attributes, e);
      this._attributes = e, Object.keys(t).length > 0 && this.emit(O.AttributesChanged, t);
    }
    setPermissions(e) {
      var t, i, s, r, o, a;
      const c = this.permissions, d = e.canPublish !== ((t = this.permissions) === null || t === void 0 ? void 0 : t.canPublish) || e.canSubscribe !== ((i = this.permissions) === null || i === void 0 ? void 0 : i.canSubscribe) || e.canPublishData !== ((s = this.permissions) === null || s === void 0 ? void 0 : s.canPublishData) || e.hidden !== ((r = this.permissions) === null || r === void 0 ? void 0 : r.hidden) || e.recorder !== ((o = this.permissions) === null || o === void 0 ? void 0 : o.recorder) || e.canPublishSources.length !== this.permissions.canPublishSources.length || e.canPublishSources.some((l, u) => {
        var h;
        return l !== ((h = this.permissions) === null || h === void 0 ? void 0 : h.canPublishSources[u]);
      }) || e.canSubscribeMetrics !== ((a = this.permissions) === null || a === void 0 ? void 0 : a.canSubscribeMetrics);
      return this.permissions = e, d && this.emit(O.ParticipantPermissionsChanged, c), d;
    }
    setIsSpeaking(e) {
      e !== this.isSpeaking && (this.isSpeaking = e, e && (this.lastSpokeAt = /* @__PURE__ */ new Date()), this.emit(O.IsSpeakingChanged, e));
    }
    setConnectionQuality(e) {
      const t = this._connectionQuality;
      this._connectionQuality = Yh(e), t !== this._connectionQuality && this.emit(O.ConnectionQualityChanged, this._connectionQuality);
    }
    setDisconnected() {
      var e, t;
      this.activeFuture && ((t = (e = this.activeFuture).reject) === null || t === void 0 || t.call(e, new Error("Participant disconnected")), this.activeFuture = void 0);
    }
    setAudioContext(e) {
      this.audioContext = e, this.audioTrackPublications.forEach((t) => lt(t.track) && t.track.setAudioContext(e));
    }
    addTrackPublication(e) {
      e.on(x.Muted, () => {
        this.emit(O.TrackMuted, e);
      }), e.on(x.Unmuted, () => {
        this.emit(O.TrackUnmuted, e);
      });
      const t = e;
      switch (t.track && (t.track.sid = e.trackSid), this.trackPublications.set(e.trackSid, e), e.kind) {
        case C.Kind.Audio:
          this.audioTrackPublications.set(e.trackSid, e);
          break;
        case C.Kind.Video:
          this.videoTrackPublications.set(e.trackSid, e);
          break;
      }
    }
  }
  function Xh(n) {
    var e, t, i;
    if (!n.participantSid && !n.participantIdentity) throw new Error("Invalid track permission, must provide at least one of participantIdentity and participantSid");
    return new So({
      participantIdentity: (e = n.participantIdentity) !== null && e !== void 0 ? e : "",
      participantSid: (t = n.participantSid) !== null && t !== void 0 ? t : "",
      allTracks: (i = n.allowAll) !== null && i !== void 0 ? i : false,
      trackSids: n.allowedTrackSids || []
    });
  }
  class Zh extends wc {
    constructor(e, t, i, s, r, o) {
      super(e, t, void 0, void 0, void 0, {
        loggerName: s.loggerName,
        loggerContextCb: () => this.engine.logContext
      }), this.pendingPublishing = /* @__PURE__ */ new Set(), this.pendingPublishPromises = /* @__PURE__ */ new Map(), this.participantTrackPermissions = [], this.allParticipantsAllowedToSubscribe = true, this.encryptionType = ge.NONE, this.enabledPublishVideoCodecs = [], this.pendingAcks = /* @__PURE__ */ new Map(), this.pendingResponses = /* @__PURE__ */ new Map(), this.handleReconnecting = () => {
        this.reconnectFuture || (this.reconnectFuture = new $e());
      }, this.handleReconnected = () => {
        var a, c;
        (c = (a = this.reconnectFuture) === null || a === void 0 ? void 0 : a.resolve) === null || c === void 0 || c.call(a), this.reconnectFuture = void 0, this.updateTrackSubscriptionPermissions();
      }, this.handleClosing = () => {
        var a, c, d, l, u, h;
        this.reconnectFuture && (this.reconnectFuture.promise.catch((m) => this.log.warn(m.message, this.logContext)), (c = (a = this.reconnectFuture) === null || a === void 0 ? void 0 : a.reject) === null || c === void 0 || c.call(a, new Error("Got disconnected during reconnection attempt")), this.reconnectFuture = void 0), this.signalConnectedFuture && ((l = (d = this.signalConnectedFuture).reject) === null || l === void 0 || l.call(d, new Error("Got disconnected without signal connected")), this.signalConnectedFuture = void 0), (h = (u = this.activeAgentFuture) === null || u === void 0 ? void 0 : u.reject) === null || h === void 0 || h.call(u, new Error("Got disconnected without active agent present")), this.activeAgentFuture = void 0, this.firstActiveAgent = void 0;
      }, this.handleSignalConnected = (a) => {
        var c, d;
        a.participant && this.updateInfo(a.participant), this.signalConnectedFuture || (this.signalConnectedFuture = new $e()), (d = (c = this.signalConnectedFuture).resolve) === null || d === void 0 || d.call(c);
      }, this.handleSignalRequestResponse = (a) => {
        const { requestId: c, reason: d, message: l } = a, u = this.pendingSignalRequests.get(c);
        u && (d !== $s.OK && u.reject(new Kr(l, d)), this.pendingSignalRequests.delete(c));
      }, this.handleDataPacket = (a) => {
        switch (a.value.case) {
          case "rpcResponse":
            let c = a.value.value, d = null, l = null;
            c.value.case === "payload" ? d = c.value.value : c.value.case === "error" && (l = pe.fromProto(c.value.value)), this.handleIncomingRpcResponse(c.requestId, d, l);
            break;
          case "rpcAck":
            let u = a.value.value;
            this.handleIncomingRpcAck(u.requestId);
            break;
        }
      }, this.updateTrackSubscriptionPermissions = () => {
        this.log.debug("updating track subscription permissions", Object.assign(Object.assign({}, this.logContext), {
          allParticipantsAllowed: this.allParticipantsAllowedToSubscribe,
          participantTrackPermissions: this.participantTrackPermissions
        })), this.engine.client.sendUpdateSubscriptionPermissions(this.allParticipantsAllowedToSubscribe, this.participantTrackPermissions.map((a) => Xh(a)));
      }, this.onTrackUnmuted = (a) => {
        this.onTrackMuted(a, a.isUpstreamPaused);
      }, this.onTrackMuted = (a, c) => {
        if (c === void 0 && (c = true), !a.sid) {
          this.log.error("could not update mute status for unpublished track", Object.assign(Object.assign({}, this.logContext), Y(a)));
          return;
        }
        this.engine.updateMuteStatus(a.sid, c);
      }, this.onTrackUpstreamPaused = (a) => {
        this.log.debug("upstream paused", Object.assign(Object.assign({}, this.logContext), Y(a))), this.onTrackMuted(a, true);
      }, this.onTrackUpstreamResumed = (a) => {
        this.log.debug("upstream resumed", Object.assign(Object.assign({}, this.logContext), Y(a))), this.onTrackMuted(a, a.isMuted);
      }, this.onTrackFeatureUpdate = (a) => {
        const c = this.audioTrackPublications.get(a.sid);
        if (!c) {
          this.log.warn("Could not update local audio track settings, missing publication for track ".concat(a.sid), this.logContext);
          return;
        }
        this.engine.client.sendUpdateLocalAudioTrack(c.trackSid, c.getTrackFeatures());
      }, this.onTrackCpuConstrained = (a, c) => {
        this.log.debug("track cpu constrained", Object.assign(Object.assign({}, this.logContext), Y(c))), this.emit(O.LocalTrackCpuConstrained, a, c);
      }, this.handleSubscribedQualityUpdate = (a) => p(this, void 0, void 0, function* () {
        var c, d, l, u, h;
        if (!(!((h = this.roomOptions) === null || h === void 0) && h.dynacast)) return;
        const m = this.videoTrackPublications.get(a.trackSid);
        if (!m) {
          this.log.warn("received subscribed quality update for unknown track", Object.assign(Object.assign({}, this.logContext), {
            trackSid: a.trackSid
          }));
          return;
        }
        if (!m.videoTrack) return;
        const v = yield m.videoTrack.setPublishingCodecs(a.subscribedCodecs);
        try {
          for (var g = true, T = St(v), S; S = yield T.next(), c = S.done, !c; g = true) {
            u = S.value, g = false;
            const I = u;
            au(I) && (this.log.debug("publish ".concat(I, " for ").concat(m.videoTrack.sid), Object.assign(Object.assign({}, this.logContext), Y(m))), yield this.publishAdditionalCodecForTrack(m.videoTrack, I, m.options));
          }
        } catch (I) {
          d = {
            error: I
          };
        } finally {
          try {
            !g && !c && (l = T.return) && (yield l.call(T));
          } finally {
            if (d) throw d.error;
          }
        }
      }), this.handleLocalTrackUnpublished = (a) => {
        const c = this.trackPublications.get(a.trackSid);
        if (!c) {
          this.log.warn("received unpublished event for unknown track", Object.assign(Object.assign({}, this.logContext), {
            trackSid: a.trackSid
          }));
          return;
        }
        this.unpublishTrack(c.track);
      }, this.handleTrackEnded = (a) => p(this, void 0, void 0, function* () {
        if (a.source === C.Source.ScreenShare || a.source === C.Source.ScreenShareAudio) this.log.debug("unpublishing local track due to TrackEnded", Object.assign(Object.assign({}, this.logContext), Y(a))), this.unpublishTrack(a);
        else if (a.isUserProvided) yield a.mute();
        else if (vt(a) || xt(a)) try {
          if (Ge()) try {
            const c = yield navigator == null ? void 0 : navigator.permissions.query({
              name: a.source === C.Source.Camera ? "camera" : "microphone"
            });
            if (c && c.state === "denied") throw this.log.warn("user has revoked access to ".concat(a.source), Object.assign(Object.assign({}, this.logContext), Y(a))), c.onchange = () => {
              c.state !== "denied" && (a.isMuted || a.restartTrack(), c.onchange = null);
            }, new Error("GetUserMedia Permission denied");
          } catch {
          }
          a.isMuted || (this.log.debug("track ended, attempting to use a different device", Object.assign(Object.assign({}, this.logContext), Y(a))), vt(a) ? yield a.restartTrack({
            deviceId: "default"
          }) : yield a.restartTrack());
        } catch {
          this.log.warn("could not restart track, muting instead", Object.assign(Object.assign({}, this.logContext), Y(a))), yield a.mute();
        }
      }), this.audioTrackPublications = /* @__PURE__ */ new Map(), this.videoTrackPublications = /* @__PURE__ */ new Map(), this.trackPublications = /* @__PURE__ */ new Map(), this.engine = i, this.roomOptions = s, this.setupEngine(i), this.activeDeviceMap = /* @__PURE__ */ new Map([
        [
          "audioinput",
          "default"
        ],
        [
          "videoinput",
          "default"
        ],
        [
          "audiooutput",
          "default"
        ]
      ]), this.pendingSignalRequests = /* @__PURE__ */ new Map(), this.rpcHandlers = r, this.roomOutgoingDataStreamManager = o;
    }
    get lastCameraError() {
      return this.cameraError;
    }
    get lastMicrophoneError() {
      return this.microphoneError;
    }
    get isE2EEEnabled() {
      return this.encryptionType !== ge.NONE;
    }
    getTrackPublication(e) {
      const t = super.getTrackPublication(e);
      if (t) return t;
    }
    getTrackPublicationByName(e) {
      const t = super.getTrackPublicationByName(e);
      if (t) return t;
    }
    setupEngine(e) {
      var t;
      this.engine = e, this.engine.on(M.RemoteMute, (i, s) => {
        const r = this.trackPublications.get(i);
        !r || !r.track || (s ? r.mute() : r.unmute());
      }), !((t = this.signalConnectedFuture) === null || t === void 0) && t.isResolved && (this.signalConnectedFuture = void 0), this.engine.on(M.Connected, this.handleReconnected).on(M.SignalConnected, this.handleSignalConnected).on(M.SignalRestarted, this.handleReconnected).on(M.SignalResumed, this.handleReconnected).on(M.Restarting, this.handleReconnecting).on(M.Resuming, this.handleReconnecting).on(M.LocalTrackUnpublished, this.handleLocalTrackUnpublished).on(M.SubscribedQualityUpdate, this.handleSubscribedQualityUpdate).on(M.Closing, this.handleClosing).on(M.SignalRequestResponse, this.handleSignalRequestResponse).on(M.DataPacketReceived, this.handleDataPacket);
    }
    setMetadata(e) {
      return p(this, void 0, void 0, function* () {
        yield this.requestMetadataUpdate({
          metadata: e
        });
      });
    }
    setName(e) {
      return p(this, void 0, void 0, function* () {
        yield this.requestMetadataUpdate({
          name: e
        });
      });
    }
    setAttributes(e) {
      return p(this, void 0, void 0, function* () {
        yield this.requestMetadataUpdate({
          attributes: e
        });
      });
    }
    requestMetadataUpdate(e) {
      return p(this, arguments, void 0, function(t) {
        var i = this;
        let { metadata: s, name: r, attributes: o } = t;
        return function* () {
          return new Ae((a, c) => p(i, void 0, void 0, function* () {
            var d, l;
            try {
              let u = false;
              const h = yield this.engine.client.sendUpdateLocalMetadata((d = s ?? this.metadata) !== null && d !== void 0 ? d : "", (l = r ?? this.name) !== null && l !== void 0 ? l : "", o), m = performance.now();
              for (this.pendingSignalRequests.set(h, {
                resolve: a,
                reject: (v) => {
                  c(v), u = true;
                },
                values: {
                  name: r,
                  metadata: s,
                  attributes: o
                }
              }); performance.now() - m < 5e3 && !u; ) {
                if ((!r || this.name === r) && (!s || this.metadata === s) && (!o || Object.entries(o).every((v) => {
                  let [g, T] = v;
                  return this.attributes[g] === T || T === "" && !this.attributes[g];
                }))) {
                  this.pendingSignalRequests.delete(h), a();
                  return;
                }
                yield xe(50);
              }
              c(new Kr("Request to update local metadata timed out", "TimeoutError"));
            } catch (u) {
              u instanceof Error ? c(u) : c(new Error(String(u)));
            }
          }));
        }();
      });
    }
    setCameraEnabled(e, t, i) {
      return this.setTrackEnabled(C.Source.Camera, e, t, i);
    }
    setMicrophoneEnabled(e, t, i) {
      return this.setTrackEnabled(C.Source.Microphone, e, t, i);
    }
    setScreenShareEnabled(e, t, i) {
      return this.setTrackEnabled(C.Source.ScreenShare, e, t, i);
    }
    setE2EEEnabled(e) {
      return p(this, void 0, void 0, function* () {
        this.encryptionType = e ? ge.GCM : ge.NONE, yield this.republishAllTracks(void 0, false);
      });
    }
    setTrackEnabled(e, t, i, s) {
      return p(this, void 0, void 0, function* () {
        var r, o;
        this.log.debug("setTrackEnabled", Object.assign(Object.assign({}, this.logContext), {
          source: e,
          enabled: t
        })), this.republishPromise && (yield this.republishPromise);
        let a = this.getTrackPublication(e);
        if (t) if (a) yield a.unmute();
        else {
          let c;
          if (this.pendingPublishing.has(e)) {
            const d = yield this.waitForPendingPublicationOfSource(e);
            return d || this.log.info("waiting for pending publication promise timed out", Object.assign(Object.assign({}, this.logContext), {
              source: e
            })), yield d == null ? void 0 : d.unmute(), d;
          }
          this.pendingPublishing.add(e);
          try {
            switch (e) {
              case C.Source.Camera:
                c = yield this.createTracks({
                  video: (r = i) !== null && r !== void 0 ? r : true
                });
                break;
              case C.Source.Microphone:
                c = yield this.createTracks({
                  audio: (o = i) !== null && o !== void 0 ? o : true
                });
                break;
              case C.Source.ScreenShare:
                c = yield this.createScreenTracks(Object.assign({}, i));
                break;
              default:
                throw new Tt(e);
            }
          } catch (d) {
            throw c == null ? void 0 : c.forEach((l) => {
              l.stop();
            }), d instanceof Error && this.emit(O.MediaDevicesError, d, Es(e)), this.pendingPublishing.delete(e), d;
          }
          for (const d of c) {
            const l = Object.assign(Object.assign({}, this.roomOptions.publishDefaults), i);
            e === C.Source.Microphone && lt(d) && l.preConnectBuffer && (this.log.info("starting preconnect buffer for microphone", Object.assign({}, this.logContext)), d.startPreConnectBuffer());
          }
          try {
            const d = [];
            for (const u of c) this.log.info("publishing track", Object.assign(Object.assign({}, this.logContext), Y(u))), d.push(this.publishTrack(u, s));
            [a] = yield Promise.all(d);
          } catch (d) {
            throw c == null ? void 0 : c.forEach((l) => {
              l.stop();
            }), d;
          } finally {
            this.pendingPublishing.delete(e);
          }
        }
        else if (!(a == null ? void 0 : a.track) && this.pendingPublishing.has(e) && (a = yield this.waitForPendingPublicationOfSource(e), a || this.log.info("waiting for pending publication promise timed out", Object.assign(Object.assign({}, this.logContext), {
          source: e
        }))), a && a.track) if (e === C.Source.ScreenShare) {
          a = yield this.unpublishTrack(a.track);
          const c = this.getTrackPublication(C.Source.ScreenShareAudio);
          c && c.track && this.unpublishTrack(c.track);
        } else yield a.mute();
        return a;
      });
    }
    enableCameraAndMicrophone() {
      return p(this, void 0, void 0, function* () {
        if (!(this.pendingPublishing.has(C.Source.Camera) || this.pendingPublishing.has(C.Source.Microphone))) {
          this.pendingPublishing.add(C.Source.Camera), this.pendingPublishing.add(C.Source.Microphone);
          try {
            const e = yield this.createTracks({
              audio: true,
              video: true
            });
            yield Promise.all(e.map((t) => this.publishTrack(t)));
          } finally {
            this.pendingPublishing.delete(C.Source.Camera), this.pendingPublishing.delete(C.Source.Microphone);
          }
        }
      });
    }
    createTracks(e) {
      return p(this, void 0, void 0, function* () {
        var t, i;
        e ?? (e = {});
        const s = ac(e, (t = this.roomOptions) === null || t === void 0 ? void 0 : t.audioCaptureDefaults, (i = this.roomOptions) === null || i === void 0 ? void 0 : i.videoCaptureDefaults);
        try {
          return (yield Fn(s, {
            loggerName: this.roomOptions.loggerName,
            loggerContextCb: () => this.logContext
          })).map((a) => (lt(a) && (this.microphoneError = void 0, a.setAudioContext(this.audioContext), a.source = C.Source.Microphone, this.emit(O.AudioStreamAcquired)), Wt(a) && (this.cameraError = void 0, a.source = C.Source.Camera), a));
        } catch (r) {
          throw r instanceof Error && (e.audio && (this.microphoneError = r), e.video && (this.cameraError = r)), r;
        }
      });
    }
    createScreenTracks(e) {
      return p(this, void 0, void 0, function* () {
        if (e === void 0 && (e = {}), navigator.mediaDevices.getDisplayMedia === void 0) throw new Xs("getDisplayMedia not supported");
        e.resolution === void 0 && !ku() && (e.resolution = Zs.h1080fps30.resolution);
        const t = cu(e), i = yield navigator.mediaDevices.getDisplayMedia(t), s = i.getVideoTracks();
        if (s.length === 0) throw new Tt("no video track found");
        const r = new _i(s[0], void 0, false, {
          loggerName: this.roomOptions.loggerName,
          loggerContextCb: () => this.logContext
        });
        r.source = C.Source.ScreenShare, e.contentHint && (r.mediaStreamTrack.contentHint = e.contentHint);
        const o = [
          r
        ];
        if (i.getAudioTracks().length > 0) {
          this.emit(O.AudioStreamAcquired);
          const a = new Pi(i.getAudioTracks()[0], void 0, false, this.audioContext, {
            loggerName: this.roomOptions.loggerName,
            loggerContextCb: () => this.logContext
          });
          a.source = C.Source.ScreenShareAudio, o.push(a);
        }
        return o;
      });
    }
    publishTrack(e, t) {
      return p(this, void 0, void 0, function* () {
        return this.publishOrRepublishTrack(e, t);
      });
    }
    publishOrRepublishTrack(e, t) {
      return p(this, arguments, void 0, function(i, s) {
        var r = this;
        let o = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false;
        return function* () {
          var a, c, d, l;
          vt(i) && i.setAudioContext(r.audioContext), yield (a = r.reconnectFuture) === null || a === void 0 ? void 0 : a.promise, r.republishPromise && !o && (yield r.republishPromise), Ti(i) && r.pendingPublishPromises.has(i) && (yield r.pendingPublishPromises.get(i));
          let u;
          if (i instanceof MediaStreamTrack) u = i.getConstraints();
          else {
            u = i.constraints;
            let S;
            switch (i.source) {
              case C.Source.Microphone:
                S = "audioinput";
                break;
              case C.Source.Camera:
                S = "videoinput";
            }
            S && r.activeDeviceMap.has(S) && (u = Object.assign(Object.assign({}, u), {
              deviceId: r.activeDeviceMap.get(S)
            }));
          }
          if (i instanceof MediaStreamTrack) switch (i.kind) {
            case "audio":
              i = new Pi(i, u, true, r.audioContext, {
                loggerName: r.roomOptions.loggerName,
                loggerContextCb: () => r.logContext
              });
              break;
            case "video":
              i = new _i(i, u, true, {
                loggerName: r.roomOptions.loggerName,
                loggerContextCb: () => r.logContext
              });
              break;
            default:
              throw new Tt("unsupported MediaStreamTrack kind ".concat(i.kind));
          }
          else i.updateLoggerOptions({
            loggerName: r.roomOptions.loggerName,
            loggerContextCb: () => r.logContext
          });
          let h;
          if (r.trackPublications.forEach((S) => {
            S.track && S.track === i && (h = S);
          }), h) return r.log.warn("track has already been published, skipping", Object.assign(Object.assign({}, r.logContext), Y(h))), h;
          const m = Object.assign(Object.assign({}, r.roomOptions.publishDefaults), s), v = "channelCount" in i.mediaStreamTrack.getSettings() && i.mediaStreamTrack.getSettings().channelCount === 2 || i.mediaStreamTrack.getConstraints().channelCount === 2, g = (c = m.forceStereo) !== null && c !== void 0 ? c : v;
          g && (m.dtx === void 0 && r.log.info("Opus DTX will be disabled for stereo tracks by default. Enable them explicitly to make it work.", Object.assign(Object.assign({}, r.logContext), Y(i))), m.red === void 0 && r.log.info("Opus RED will be disabled for stereo tracks by default. Enable them explicitly to make it work."), (d = m.dtx) !== null && d !== void 0 || (m.dtx = false), (l = m.red) !== null && l !== void 0 || (m.red = false)), !Tu() && r.roomOptions.e2ee && (r.log.info("End-to-end encryption is set up, simulcast publishing will be disabled on Safari versions and iOS browsers running iOS < v17.2", Object.assign({}, r.logContext)), m.simulcast = false), m.source && (i.source = m.source);
          const T = new Promise((S, I) => p(r, void 0, void 0, function* () {
            try {
              if (this.engine.client.currentState !== oe.CONNECTED) {
                this.log.debug("deferring track publication until signal is connected", Object.assign(Object.assign({}, this.logContext), {
                  track: Y(i)
                }));
                let P = false;
                const b = setTimeout(() => {
                  P = true, i.stop(), I(new Wr("publishing rejected as engine not connected within timeout", 408));
                }, 15e3);
                if (yield this.waitUntilEngineConnected(), clearTimeout(b), P) return;
                const k = yield this.publish(i, m, g);
                S(k);
              } else try {
                const P = yield this.publish(i, m, g);
                S(P);
              } catch (P) {
                I(P);
              }
            } catch (P) {
              I(P);
            }
          }));
          r.pendingPublishPromises.set(i, T);
          try {
            return yield T;
          } catch (S) {
            throw S;
          } finally {
            r.pendingPublishPromises.delete(i);
          }
        }();
      });
    }
    waitUntilEngineConnected() {
      return this.signalConnectedFuture || (this.signalConnectedFuture = new $e()), this.signalConnectedFuture.promise;
    }
    hasPermissionsToPublish(e) {
      if (!this.permissions) return this.log.warn("no permissions present for publishing track", Object.assign(Object.assign({}, this.logContext), Y(e))), false;
      const { canPublish: t, canPublishSources: i } = this.permissions;
      return t && (i.length === 0 || i.map((s) => hu(s)).includes(e.source)) ? true : (this.log.warn("insufficient permissions to publish", Object.assign(Object.assign({}, this.logContext), Y(e))), false);
    }
    publish(e, t, i) {
      return p(this, void 0, void 0, function* () {
        var s, r, o, a, c, d, l, u, h, m;
        if (!this.hasPermissionsToPublish(e)) throw new Wr("failed to publish track, insufficient permissions", 403);
        Array.from(this.trackPublications.values()).find((D) => Ti(e) && D.source === e.source) && e.source !== C.Source.Unknown && this.log.info("publishing a second track with the same source: ".concat(e.source), Object.assign(Object.assign({}, this.logContext), Y(e))), t.stopMicTrackOnMute && lt(e) && (e.stopOnMute = true), e.source === C.Source.ScreenShare && ni() && (t.simulcast = false), t.videoCodec === "av1" && !vu() && (t.videoCodec = void 0), t.videoCodec === "vp9" && !yu() && (t.videoCodec = void 0), t.videoCodec === void 0 && (t.videoCodec = Ms), this.enabledPublishVideoCodecs.length > 0 && (this.enabledPublishVideoCodecs.some((D) => t.videoCodec === Ki(D.mime)) || (t.videoCodec = Ki(this.enabledPublishVideoCodecs[0].mime)));
        const g = t.videoCodec;
        e.on(x.Muted, this.onTrackMuted), e.on(x.Unmuted, this.onTrackUnmuted), e.on(x.Ended, this.handleTrackEnded), e.on(x.UpstreamPaused, this.onTrackUpstreamPaused), e.on(x.UpstreamResumed, this.onTrackUpstreamResumed), e.on(x.AudioTrackFeatureUpdate, this.onTrackFeatureUpdate);
        const T = [], S = !(!((s = t.dtx) !== null && s !== void 0) || s), I = e.getSourceTrackSettings();
        I.autoGainControl && T.push(we.TF_AUTO_GAIN_CONTROL), I.echoCancellation && T.push(we.TF_ECHO_CANCELLATION), I.noiseSuppression && T.push(we.TF_NOISE_SUPPRESSION), I.channelCount && I.channelCount > 1 && T.push(we.TF_STEREO), S && T.push(we.TF_NO_DTX), vt(e) && e.hasPreConnectBuffer && T.push(we.TF_PRECONNECT_BUFFER);
        const P = new $i({
          cid: e.mediaStreamTrack.id,
          name: t.name,
          type: C.kindToProto(e.kind),
          muted: e.isMuted,
          source: C.sourceToProto(e.source),
          disableDtx: S,
          encryption: this.encryptionType,
          stereo: i,
          disableRed: this.isE2EEEnabled || !(!((r = t.red) !== null && r !== void 0) || r),
          stream: t == null ? void 0 : t.stream,
          backupCodecPolicy: t == null ? void 0 : t.backupCodecPolicy,
          audioFeatures: T
        });
        let b;
        if (e.kind === C.Kind.Video) {
          let D = {
            width: 0,
            height: 0
          };
          try {
            D = yield e.waitForDimensions();
          } catch {
            const L = (a = (o = this.roomOptions.videoCaptureDefaults) === null || o === void 0 ? void 0 : o.resolution) !== null && a !== void 0 ? a : Qi.h720.resolution;
            D = {
              width: L.width,
              height: L.height
            }, this.log.error("could not determine track dimensions, using defaults", Object.assign(Object.assign(Object.assign({}, this.logContext), Y(e)), {
              dims: D
            }));
          }
          P.width = D.width, P.height = D.height, xt(e) && (st(g) && (e.source === C.Source.ScreenShare && (t.scalabilityMode = "L1T3", "contentHint" in e.mediaStreamTrack && (e.mediaStreamTrack.contentHint = "motion", this.log.info("forcing contentHint to motion for screenshare with SVC codecs", Object.assign(Object.assign({}, this.logContext), Y(e))))), t.scalabilityMode = (c = t.scalabilityMode) !== null && c !== void 0 ? c : "L3T3_KEY"), P.simulcastCodecs = [
            new ps({
              codec: g,
              cid: e.mediaStreamTrack.id
            })
          ], t.backupCodec === true && (t.backupCodec = {
            codec: Ms
          }), t.backupCodec && g !== t.backupCodec.codec && P.encryption === ge.NONE && (this.roomOptions.dynacast || (this.roomOptions.dynacast = true), P.simulcastCodecs.push(new ps({
            codec: t.backupCodec.codec,
            cid: ""
          })))), b = Ds(e.source === C.Source.ScreenShare, P.width, P.height, t), P.layers = ya(P.width, P.height, b, st(t.videoCodec));
        } else e.kind === C.Kind.Audio && (b = [
          {
            maxBitrate: (d = t.audioPreset) === null || d === void 0 ? void 0 : d.maxBitrate,
            priority: (u = (l = t.audioPreset) === null || l === void 0 ? void 0 : l.priority) !== null && u !== void 0 ? u : "high",
            networkPriority: (m = (h = t.audioPreset) === null || h === void 0 ? void 0 : h.priority) !== null && m !== void 0 ? m : "high"
          }
        ]);
        if (!this.engine || this.engine.isClosed) throw new me("cannot publish track when not connected");
        const k = () => p(this, void 0, void 0, function* () {
          var D, N, L;
          if (!this.engine.pcManager) throw new me("pcManager is not ready");
          if (e.sender = yield this.engine.createSender(e, t, b), this.emit(O.LocalSenderCreated, e.sender, e), xt(e) && ((D = t.degradationPreference) !== null && D !== void 0 || (t.degradationPreference = Oh(e)), e.setDegradationPreference(t.degradationPreference)), b) if (ni() && e.kind === C.Kind.Audio) {
            let q;
            for (const ne of this.engine.pcManager.publisher.getTransceivers()) if (ne.sender === e.sender) {
              q = ne;
              break;
            }
            q && this.engine.pcManager.publisher.setTrackCodecBitrate({
              transceiver: q,
              codec: "opus",
              maxbr: !((N = b[0]) === null || N === void 0) && N.maxBitrate ? b[0].maxBitrate / 1e3 : 0
            });
          } else e.codec && st(e.codec) && (!((L = b[0]) === null || L === void 0) && L.maxBitrate) && this.engine.pcManager.publisher.setTrackCodecBitrate({
            cid: P.cid,
            codec: e.codec,
            maxbr: b[0].maxBitrate / 1e3
          });
          yield this.engine.negotiate();
        });
        let w;
        const A = new Promise((D, N) => p(this, void 0, void 0, function* () {
          var L;
          try {
            w = yield this.engine.addTrack(P), D(w);
          } catch (q) {
            e.sender && (!((L = this.engine.pcManager) === null || L === void 0) && L.publisher) && (this.engine.pcManager.publisher.removeTrack(e.sender), yield this.engine.negotiate().catch((ne) => {
              this.log.error("failed to negotiate after removing track due to failed add track request", Object.assign(Object.assign(Object.assign({}, this.logContext), Y(e)), {
                error: ne
              }));
            })), N(q);
          }
        }));
        if (this.enabledPublishVideoCodecs.length > 0) w = (yield Promise.all([
          A,
          k()
        ]))[0];
        else {
          w = yield A;
          let D;
          if (w.codecs.forEach((N) => {
            D === void 0 && (D = N.mimeType);
          }), D && e.kind === C.Kind.Video) {
            const N = Ki(D);
            N !== g && (this.log.debug("falling back to server selected codec", Object.assign(Object.assign(Object.assign({}, this.logContext), Y(e)), {
              codec: N
            })), t.videoCodec = N, b = Ds(e.source === C.Source.ScreenShare, P.width, P.height, t));
          }
          yield k();
        }
        const U = new Ns(e.kind, w, e, {
          loggerName: this.roomOptions.loggerName,
          loggerContextCb: () => this.logContext
        });
        if (U.on(x.CpuConstrained, (D) => this.onTrackCpuConstrained(D, U)), U.options = t, e.sid = w.sid, this.log.debug("publishing ".concat(e.kind, " with encodings"), Object.assign(Object.assign({}, this.logContext), {
          encodings: b,
          trackInfo: w
        })), xt(e) ? e.startMonitor(this.engine.client) : vt(e) && e.startMonitor(), this.addTrackPublication(U), this.emit(O.LocalTrackPublished, U), vt(e) && w.audioFeatures.includes(we.TF_PRECONNECT_BUFFER)) {
          const D = e.getPreConnectBuffer(), N = e.getPreConnectBufferMimeType();
          this.on(O.LocalTrackSubscribed, (L) => {
            if (L.trackSid === w.sid) {
              if (!e.hasPreConnectBuffer) {
                this.log.warn("subscribe event came to late, buffer already closed", this.logContext);
                return;
              }
              this.log.debug("finished recording preconnect buffer", Object.assign(Object.assign({}, this.logContext), Y(e))), e.stopPreConnectBuffer();
            }
          }), D && new Promise((q, ne) => p(this, void 0, void 0, function* () {
            var ye, Qe, B, de, Ne, Oe;
            try {
              this.log.debug("waiting for agent", Object.assign(Object.assign({}, this.logContext), Y(e)));
              const Ce = setTimeout(() => {
                ne(new Error("agent not active within 10 seconds"));
              }, 1e4), se = yield this.waitUntilActiveAgentPresent();
              clearTimeout(Ce), this.log.debug("sending preconnect buffer", Object.assign(Object.assign({}, this.logContext), Y(e)));
              const Pe = yield this.streamBytes({
                name: "preconnect-buffer",
                mimeType: N,
                topic: "lk.agent.pre-connect-audio-buffer",
                destinationIdentities: [
                  se.identity
                ],
                attributes: {
                  trackId: U.trackSid,
                  sampleRate: String((Ne = I.sampleRate) !== null && Ne !== void 0 ? Ne : "48000"),
                  channels: String((Oe = I.channelCount) !== null && Oe !== void 0 ? Oe : "1")
                }
              });
              try {
                for (var Re = true, ot = St(D), De; De = yield ot.next(), ye = De.done, !ye; Re = true) {
                  de = De.value, Re = false;
                  const mt = de;
                  yield Pe.write(mt);
                }
              } catch (mt) {
                Qe = {
                  error: mt
                };
              } finally {
                try {
                  !Re && !ye && (B = ot.return) && (yield B.call(ot));
                } finally {
                  if (Qe) throw Qe.error;
                }
              }
              yield Pe.close(), q();
            } catch (Ce) {
              ne(Ce);
            }
          })).then(() => {
            this.log.debug("preconnect buffer sent successfully", Object.assign(Object.assign({}, this.logContext), Y(e)));
          }).catch((q) => {
            this.log.error("error sending preconnect buffer", Object.assign(Object.assign(Object.assign({}, this.logContext), Y(e)), {
              error: q
            }));
          });
        }
        return U;
      });
    }
    get isLocal() {
      return true;
    }
    publishAdditionalCodecForTrack(e, t, i) {
      return p(this, void 0, void 0, function* () {
        var s;
        if (this.encryptionType !== ge.NONE) return;
        let r;
        if (this.trackPublications.forEach((m) => {
          m.track && m.track === e && (r = m);
        }), !r) throw new Tt("track is not published");
        if (!xt(e)) throw new Tt("track is not a video track");
        const o = Object.assign(Object.assign({}, (s = this.roomOptions) === null || s === void 0 ? void 0 : s.publishDefaults), i), a = Ih(e, t, o);
        if (!a) {
          this.log.info("backup codec has been disabled, ignoring request to add additional codec for track", Object.assign(Object.assign({}, this.logContext), Y(e)));
          return;
        }
        const c = e.addSimulcastTrack(t, a);
        if (!c) return;
        const d = new $i({
          cid: c.mediaStreamTrack.id,
          type: C.kindToProto(e.kind),
          muted: e.isMuted,
          source: C.sourceToProto(e.source),
          sid: e.sid,
          simulcastCodecs: [
            {
              codec: o.videoCodec,
              cid: c.mediaStreamTrack.id
            }
          ]
        });
        if (d.layers = ya(d.width, d.height, a), !this.engine || this.engine.isClosed) throw new me("cannot publish track when not connected");
        const l = () => p(this, void 0, void 0, function* () {
          yield this.engine.createSimulcastSender(e, c, o, a), yield this.engine.negotiate();
        }), h = (yield Promise.all([
          this.engine.addTrack(d),
          l()
        ]))[0];
        this.log.debug("published ".concat(t, " for track ").concat(e.sid), Object.assign(Object.assign({}, this.logContext), {
          encodings: a,
          trackInfo: h
        }));
      });
    }
    unpublishTrack(e, t) {
      return p(this, void 0, void 0, function* () {
        var i, s;
        if (Ti(e)) {
          const d = this.pendingPublishPromises.get(e);
          d && (this.log.info("awaiting publish promise before attempting to unpublish", Object.assign(Object.assign({}, this.logContext), Y(e))), yield d);
        }
        const r = this.getPublicationForTrack(e), o = r ? Y(r) : void 0;
        if (this.log.debug("unpublishing track", Object.assign(Object.assign({}, this.logContext), o)), !r || !r.track) {
          this.log.warn("track was not unpublished because no publication was found", Object.assign(Object.assign({}, this.logContext), o));
          return;
        }
        e = r.track, e.off(x.Muted, this.onTrackMuted), e.off(x.Unmuted, this.onTrackUnmuted), e.off(x.Ended, this.handleTrackEnded), e.off(x.UpstreamPaused, this.onTrackUpstreamPaused), e.off(x.UpstreamResumed, this.onTrackUpstreamResumed), e.off(x.AudioTrackFeatureUpdate, this.onTrackFeatureUpdate), t === void 0 && (t = (s = (i = this.roomOptions) === null || i === void 0 ? void 0 : i.stopLocalTrackOnUnpublish) !== null && s !== void 0 ? s : true), t ? e.stop() : e.stopMonitor();
        let a = false;
        const c = e.sender;
        if (e.sender = void 0, this.engine.pcManager && this.engine.pcManager.currentState < ue.FAILED && c) try {
          for (const d of this.engine.pcManager.publisher.getTransceivers()) d.sender === c && (d.direction = "inactive", a = true);
          if (this.engine.removeTrack(c) && (a = true), xt(e)) {
            for (const [, d] of e.simulcastCodecs) d.sender && (this.engine.removeTrack(d.sender) && (a = true), d.sender = void 0);
            e.simulcastCodecs.clear();
          }
        } catch (d) {
          this.log.warn("failed to unpublish track", Object.assign(Object.assign(Object.assign({}, this.logContext), o), {
            error: d
          }));
        }
        switch (this.trackPublications.delete(r.trackSid), r.kind) {
          case C.Kind.Audio:
            this.audioTrackPublications.delete(r.trackSid);
            break;
          case C.Kind.Video:
            this.videoTrackPublications.delete(r.trackSid);
            break;
        }
        return this.emit(O.LocalTrackUnpublished, r), r.setTrack(void 0), a && (yield this.engine.negotiate()), r;
      });
    }
    unpublishTracks(e) {
      return p(this, void 0, void 0, function* () {
        return (yield Promise.all(e.map((i) => this.unpublishTrack(i)))).filter((i) => !!i);
      });
    }
    republishAllTracks(e) {
      return p(this, arguments, void 0, function(t) {
        var i = this;
        let s = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true;
        return function* () {
          i.republishPromise && (yield i.republishPromise), i.republishPromise = new Ae((r, o) => p(i, void 0, void 0, function* () {
            try {
              const a = [];
              this.trackPublications.forEach((c) => {
                c.track && (t && (c.options = Object.assign(Object.assign({}, c.options), t)), a.push(c));
              }), yield Promise.all(a.map((c) => p(this, void 0, void 0, function* () {
                const d = c.track;
                yield this.unpublishTrack(d, false), s && !d.isMuted && d.source !== C.Source.ScreenShare && d.source !== C.Source.ScreenShareAudio && (vt(d) || xt(d)) && !d.isUserProvided && (this.log.debug("restarting existing track", Object.assign(Object.assign({}, this.logContext), {
                  track: c.trackSid
                })), yield d.restartTrack()), yield this.publishOrRepublishTrack(d, c.options, true);
              }))), r();
            } catch (a) {
              a instanceof Error ? o(a) : o(new Error(String(a)));
            } finally {
              this.republishPromise = void 0;
            }
          })), yield i.republishPromise;
        }();
      });
    }
    publishData(e) {
      return p(this, arguments, void 0, function(t) {
        var i = this;
        let s = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        return function* () {
          const r = s.reliable ? Q.RELIABLE : Q.LOSSY, o = s.destinationIdentities, a = s.topic;
          let c = new Bs({
            participantIdentity: i.identity,
            payload: t,
            destinationIdentities: o,
            topic: a
          });
          const d = new Ue({
            kind: r,
            value: {
              case: "user",
              value: c
            }
          });
          yield i.engine.sendDataPacket(d, r);
        }();
      });
    }
    publishDtmf(e, t) {
      return p(this, void 0, void 0, function* () {
        const i = new Ue({
          kind: Q.RELIABLE,
          value: {
            case: "sipDtmf",
            value: new io({
              code: e,
              digit: t
            })
          }
        });
        yield this.engine.sendDataPacket(i, Q.RELIABLE);
      });
    }
    sendChatMessage(e, t) {
      return p(this, void 0, void 0, function* () {
        const i = {
          id: crypto.randomUUID(),
          message: e,
          timestamp: Date.now(),
          attachedFiles: t == null ? void 0 : t.attachments
        }, s = new Ue({
          value: {
            case: "chatMessage",
            value: new Cn(Object.assign(Object.assign({}, i), {
              timestamp: le.parse(i.timestamp)
            }))
          }
        });
        return yield this.engine.sendDataPacket(s, Q.RELIABLE), this.emit(O.ChatMessage, i), i;
      });
    }
    editChatMessage(e, t) {
      return p(this, void 0, void 0, function* () {
        const i = Object.assign(Object.assign({}, t), {
          message: e,
          editTimestamp: Date.now()
        }), s = new Ue({
          value: {
            case: "chatMessage",
            value: new Cn(Object.assign(Object.assign({}, i), {
              timestamp: le.parse(i.timestamp),
              editTimestamp: le.parse(i.editTimestamp)
            }))
          }
        });
        return yield this.engine.sendDataPacket(s, Q.RELIABLE), this.emit(O.ChatMessage, i), i;
      });
    }
    sendText(e, t) {
      return p(this, void 0, void 0, function* () {
        return this.roomOutgoingDataStreamManager.sendText(e, t);
      });
    }
    streamText(e) {
      return p(this, void 0, void 0, function* () {
        return this.roomOutgoingDataStreamManager.streamText(e);
      });
    }
    sendFile(e, t) {
      return p(this, void 0, void 0, function* () {
        return this.roomOutgoingDataStreamManager.sendFile(e, t);
      });
    }
    streamBytes(e) {
      return p(this, void 0, void 0, function* () {
        return this.roomOutgoingDataStreamManager.streamBytes(e);
      });
    }
    performRpc(e) {
      let { destinationIdentity: t, method: i, payload: s, responseTimeout: r = 15e3 } = e;
      const o = 7e3, a = o + 1e3;
      return new Ae((c, d) => p(this, void 0, void 0, function* () {
        var l, u, h, m;
        if (or(s) > vc) {
          d(pe.builtIn("REQUEST_PAYLOAD_TOO_LARGE"));
          return;
        }
        if (!((u = (l = this.engine.latestJoinResponse) === null || l === void 0 ? void 0 : l.serverInfo) === null || u === void 0) && u.version && ht((m = (h = this.engine.latestJoinResponse) === null || h === void 0 ? void 0 : h.serverInfo) === null || m === void 0 ? void 0 : m.version, "1.8.0") < 0) {
          d(pe.builtIn("UNSUPPORTED_SERVER"));
          return;
        }
        const v = Math.max(r, a), g = crypto.randomUUID();
        yield this.publishRpcRequest(t, g, i, s, v);
        const T = setTimeout(() => {
          this.pendingAcks.delete(g), d(pe.builtIn("CONNECTION_TIMEOUT")), this.pendingResponses.delete(g), clearTimeout(S);
        }, o);
        this.pendingAcks.set(g, {
          resolve: () => {
            clearTimeout(T);
          },
          participantIdentity: t
        });
        const S = setTimeout(() => {
          this.pendingResponses.delete(g), d(pe.builtIn("RESPONSE_TIMEOUT"));
        }, r);
        this.pendingResponses.set(g, {
          resolve: (I, P) => {
            clearTimeout(S), this.pendingAcks.has(g) && (this.log.warn("RPC response received before ack", g), this.pendingAcks.delete(g), clearTimeout(T)), P ? d(P) : c(I ?? "");
          },
          participantIdentity: t
        });
      }));
    }
    registerRpcMethod(e, t) {
      this.rpcHandlers.has(e) && this.log.warn("you're overriding the RPC handler for method ".concat(e, ", in the future this will throw an error")), this.rpcHandlers.set(e, t);
    }
    unregisterRpcMethod(e) {
      this.rpcHandlers.delete(e);
    }
    setTrackSubscriptionPermissions(e) {
      let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : [];
      this.participantTrackPermissions = t, this.allParticipantsAllowedToSubscribe = e, this.engine.client.isDisconnected || this.updateTrackSubscriptionPermissions();
    }
    handleIncomingRpcAck(e) {
      const t = this.pendingAcks.get(e);
      t ? (t.resolve(), this.pendingAcks.delete(e)) : console.error("Ack received for unexpected RPC request", e);
    }
    handleIncomingRpcResponse(e, t, i) {
      const s = this.pendingResponses.get(e);
      s ? (s.resolve(t, i), this.pendingResponses.delete(e)) : console.error("Response received for unexpected RPC request", e);
    }
    publishRpcRequest(e, t, i, s, r) {
      return p(this, void 0, void 0, function* () {
        const o = new Ue({
          destinationIdentities: [
            e
          ],
          kind: Q.RELIABLE,
          value: {
            case: "rpcRequest",
            value: new Vs({
              id: t,
              method: i,
              payload: s,
              responseTimeoutMs: r,
              version: 1
            })
          }
        });
        yield this.engine.sendDataPacket(o, Q.RELIABLE);
      });
    }
    handleParticipantDisconnected(e) {
      for (const [t, { participantIdentity: i }] of this.pendingAcks) i === e && this.pendingAcks.delete(t);
      for (const [t, { participantIdentity: i, resolve: s }] of this.pendingResponses) i === e && (s(null, pe.builtIn("RECIPIENT_DISCONNECTED")), this.pendingResponses.delete(t));
    }
    setEnabledPublishCodecs(e) {
      this.enabledPublishVideoCodecs = e.filter((t) => t.mime.split("/")[0].toLowerCase() === "video");
    }
    updateInfo(e) {
      return super.updateInfo(e) ? (e.tracks.forEach((t) => {
        var i, s;
        const r = this.trackPublications.get(t.sid);
        if (r) {
          const o = r.isMuted || ((s = (i = r.track) === null || i === void 0 ? void 0 : i.isUpstreamPaused) !== null && s !== void 0 ? s : false);
          o !== t.muted && (this.log.debug("updating server mute state after reconcile", Object.assign(Object.assign(Object.assign({}, this.logContext), Y(r)), {
            mutedOnServer: o
          })), this.engine.client.sendMuteTrack(t.sid, o));
        }
      }), true) : false;
    }
    setActiveAgent(e) {
      var t, i, s, r;
      this.firstActiveAgent = e, e && !this.firstActiveAgent && (this.firstActiveAgent = e), e ? (i = (t = this.activeAgentFuture) === null || t === void 0 ? void 0 : t.resolve) === null || i === void 0 || i.call(t, e) : (r = (s = this.activeAgentFuture) === null || s === void 0 ? void 0 : s.reject) === null || r === void 0 || r.call(s, new Error("Agent disconnected")), this.activeAgentFuture = void 0;
    }
    waitUntilActiveAgentPresent() {
      return this.firstActiveAgent ? Promise.resolve(this.firstActiveAgent) : (this.activeAgentFuture || (this.activeAgentFuture = new $e()), this.activeAgentFuture.promise);
    }
    getPublicationForTrack(e) {
      let t;
      return this.trackPublications.forEach((i) => {
        const s = i.track;
        s && (e instanceof MediaStreamTrack ? (vt(s) || xt(s)) && s.mediaStreamTrack === e && (t = i) : e === s && (t = i));
      }), t;
    }
    waitForPendingPublicationOfSource(e) {
      return p(this, void 0, void 0, function* () {
        const i = Date.now();
        for (; Date.now() < i + 1e4; ) {
          const s = Array.from(this.pendingPublishPromises.entries()).find((r) => {
            let [o] = r;
            return o.source === e;
          });
          if (s) return s[1];
          yield xe(20);
        }
      });
    }
  }
  class ep extends yt {
    constructor(e, t, i, s) {
      super(e, t.sid, t.name, s), this.track = void 0, this.allowed = true, this.requestedDisabled = void 0, this.visible = true, this.handleEnded = (r) => {
        this.setTrack(void 0), this.emit(x.Ended, r);
      }, this.handleVisibilityChange = (r) => {
        this.log.debug("adaptivestream video visibility ".concat(this.trackSid, ", visible=").concat(r), this.logContext), this.visible = r, this.emitTrackUpdate();
      }, this.handleVideoDimensionsChange = (r) => {
        this.log.debug("adaptivestream video dimensions ".concat(r.width, "x").concat(r.height), this.logContext), this.videoDimensionsAdaptiveStream = r, this.emitTrackUpdate();
      }, this.subscribed = i, this.updateInfo(t);
    }
    setSubscribed(e) {
      const t = this.subscriptionStatus, i = this.permissionStatus;
      this.subscribed = e, e && (this.allowed = true);
      const s = new Nn({
        trackSids: [
          this.trackSid
        ],
        subscribe: this.subscribed,
        participantTracks: [
          new so({
            participantSid: "",
            trackSids: [
              this.trackSid
            ]
          })
        ]
      });
      this.emit(x.UpdateSubscription, s), this.emitSubscriptionUpdateIfChanged(t), this.emitPermissionUpdateIfChanged(i);
    }
    get subscriptionStatus() {
      return this.subscribed === false ? yt.SubscriptionStatus.Unsubscribed : super.isSubscribed ? yt.SubscriptionStatus.Subscribed : yt.SubscriptionStatus.Desired;
    }
    get permissionStatus() {
      return this.allowed ? yt.PermissionStatus.Allowed : yt.PermissionStatus.NotAllowed;
    }
    get isSubscribed() {
      return this.subscribed === false ? false : super.isSubscribed;
    }
    get isDesired() {
      return this.subscribed !== false;
    }
    get isEnabled() {
      return this.requestedDisabled !== void 0 ? !this.requestedDisabled : this.isAdaptiveStream ? this.visible : true;
    }
    get isLocal() {
      return false;
    }
    setEnabled(e) {
      !this.isManualOperationAllowed() || this.requestedDisabled === !e || (this.requestedDisabled = !e, this.emitTrackUpdate());
    }
    setVideoQuality(e) {
      !this.isManualOperationAllowed() || this.requestedMaxQuality === e || (this.requestedMaxQuality = e, this.requestedVideoDimensions = void 0, this.emitTrackUpdate());
    }
    setVideoDimensions(e) {
      var t, i;
      this.isManualOperationAllowed() && (((t = this.requestedVideoDimensions) === null || t === void 0 ? void 0 : t.width) === e.width && ((i = this.requestedVideoDimensions) === null || i === void 0 ? void 0 : i.height) === e.height || (es(this.track) && (this.requestedVideoDimensions = e), this.requestedMaxQuality = void 0, this.emitTrackUpdate()));
    }
    setVideoFPS(e) {
      this.isManualOperationAllowed() && es(this.track) && this.fps !== e && (this.fps = e, this.emitTrackUpdate());
    }
    get videoQuality() {
      var e;
      return (e = this.requestedMaxQuality) !== null && e !== void 0 ? e : Ke.HIGH;
    }
    setTrack(e) {
      const t = this.subscriptionStatus, i = this.permissionStatus, s = this.track;
      s !== e && (s && (s.off(x.VideoDimensionsChanged, this.handleVideoDimensionsChange), s.off(x.VisibilityChanged, this.handleVisibilityChange), s.off(x.Ended, this.handleEnded), s.detach(), s.stopMonitor(), this.emit(x.Unsubscribed, s)), super.setTrack(e), e && (e.sid = this.trackSid, e.on(x.VideoDimensionsChanged, this.handleVideoDimensionsChange), e.on(x.VisibilityChanged, this.handleVisibilityChange), e.on(x.Ended, this.handleEnded), this.emit(x.Subscribed, e)), this.emitPermissionUpdateIfChanged(i), this.emitSubscriptionUpdateIfChanged(t));
    }
    setAllowed(e) {
      const t = this.subscriptionStatus, i = this.permissionStatus;
      this.allowed = e, this.emitPermissionUpdateIfChanged(i), this.emitSubscriptionUpdateIfChanged(t);
    }
    setSubscriptionError(e) {
      this.emit(x.SubscriptionFailed, e);
    }
    updateInfo(e) {
      super.updateInfo(e);
      const t = this.metadataMuted;
      this.metadataMuted = e.muted, this.track ? this.track.setMuted(e.muted) : t !== e.muted && this.emit(e.muted ? x.Muted : x.Unmuted);
    }
    emitSubscriptionUpdateIfChanged(e) {
      const t = this.subscriptionStatus;
      e !== t && this.emit(x.SubscriptionStatusChanged, t, e);
    }
    emitPermissionUpdateIfChanged(e) {
      this.permissionStatus !== e && this.emit(x.SubscriptionPermissionChanged, this.permissionStatus, e);
    }
    isManualOperationAllowed() {
      return this.isDesired ? true : (this.log.warn("cannot update track settings when not subscribed", this.logContext), false);
    }
    get isAdaptiveStream() {
      return es(this.track) && this.track.isAdaptiveStream;
    }
    emitTrackUpdate() {
      const e = new vo({
        trackSids: [
          this.trackSid
        ],
        disabled: !this.isEnabled,
        fps: this.fps
      });
      if (this.kind === C.Kind.Video) {
        let t = this.requestedVideoDimensions;
        if (this.videoDimensionsAdaptiveStream !== void 0) if (t) Jr(this.videoDimensionsAdaptiveStream, t) && (this.log.debug("using adaptive stream dimensions instead of requested", Object.assign(Object.assign({}, this.logContext), this.videoDimensionsAdaptiveStream)), t = this.videoDimensionsAdaptiveStream);
        else if (this.requestedMaxQuality !== void 0 && this.trackInfo) {
          const i = pu(this.trackInfo, this.requestedMaxQuality);
          i && Jr(this.videoDimensionsAdaptiveStream, i) && (this.log.debug("using adaptive stream dimensions instead of max quality layer", Object.assign(Object.assign({}, this.logContext), this.videoDimensionsAdaptiveStream)), t = this.videoDimensionsAdaptiveStream);
        } else this.log.debug("using adaptive stream dimensions", Object.assign(Object.assign({}, this.logContext), this.videoDimensionsAdaptiveStream)), t = this.videoDimensionsAdaptiveStream;
        t ? (e.width = Math.ceil(t.width), e.height = Math.ceil(t.height)) : this.requestedMaxQuality !== void 0 ? (this.log.debug("using requested max quality", Object.assign(Object.assign({}, this.logContext), {
          quality: this.requestedMaxQuality
        })), e.quality = this.requestedMaxQuality) : (this.log.debug("using default quality", Object.assign(Object.assign({}, this.logContext), {
          quality: Ke.HIGH
        })), e.quality = Ke.HIGH);
      }
      this.emit(x.UpdateSettings, e);
    }
  }
  class _n extends wc {
    static fromParticipantInfo(e, t, i) {
      return new _n(e, t.sid, t.identity, t.name, t.metadata, t.attributes, i, t.kind);
    }
    get logContext() {
      return Object.assign(Object.assign({}, super.logContext), {
        rpID: this.sid,
        remoteParticipant: this.identity
      });
    }
    constructor(e, t, i, s, r, o, a) {
      let c = arguments.length > 7 && arguments[7] !== void 0 ? arguments[7] : zi.STANDARD;
      super(t, i || "", s, r, o, a, c), this.signalClient = e, this.trackPublications = /* @__PURE__ */ new Map(), this.audioTrackPublications = /* @__PURE__ */ new Map(), this.videoTrackPublications = /* @__PURE__ */ new Map(), this.volumeMap = /* @__PURE__ */ new Map();
    }
    addTrackPublication(e) {
      super.addTrackPublication(e), e.on(x.UpdateSettings, (t) => {
        this.log.debug("send update settings", Object.assign(Object.assign(Object.assign({}, this.logContext), Y(e)), {
          settings: t
        })), this.signalClient.sendUpdateTrackSettings(t);
      }), e.on(x.UpdateSubscription, (t) => {
        t.participantTracks.forEach((i) => {
          i.participantSid = this.sid;
        }), this.signalClient.sendUpdateSubscription(t);
      }), e.on(x.SubscriptionPermissionChanged, (t) => {
        this.emit(O.TrackSubscriptionPermissionChanged, e, t);
      }), e.on(x.SubscriptionStatusChanged, (t) => {
        this.emit(O.TrackSubscriptionStatusChanged, e, t);
      }), e.on(x.Subscribed, (t) => {
        this.emit(O.TrackSubscribed, t, e);
      }), e.on(x.Unsubscribed, (t) => {
        this.emit(O.TrackUnsubscribed, t, e);
      }), e.on(x.SubscriptionFailed, (t) => {
        this.emit(O.TrackSubscriptionFailed, e.trackSid, t);
      });
    }
    getTrackPublication(e) {
      const t = super.getTrackPublication(e);
      if (t) return t;
    }
    getTrackPublicationByName(e) {
      const t = super.getTrackPublicationByName(e);
      if (t) return t;
    }
    setVolume(e) {
      let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : C.Source.Microphone;
      this.volumeMap.set(t, e);
      const i = this.getTrackPublication(t);
      i && i.track && i.track.setVolume(e);
    }
    getVolume() {
      let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : C.Source.Microphone;
      const t = this.getTrackPublication(e);
      return t && t.track ? t.track.getVolume() : this.volumeMap.get(e);
    }
    addSubscribedMediaTrack(e, t, i, s, r, o) {
      let a = this.getTrackPublicationBySid(t);
      if (a || t.startsWith("TR") || this.trackPublications.forEach((l) => {
        !a && e.kind === l.kind.toString() && (a = l);
      }), !a) {
        if (o === 0) {
          this.log.error("could not find published track", Object.assign(Object.assign({}, this.logContext), {
            trackSid: t
          })), this.emit(O.TrackSubscriptionFailed, t);
          return;
        }
        o === void 0 && (o = 20), setTimeout(() => {
          this.addSubscribedMediaTrack(e, t, i, s, r, o - 1);
        }, 150);
        return;
      }
      if (e.readyState === "ended") {
        this.log.error("unable to subscribe because MediaStreamTrack is ended. Do not call MediaStreamTrack.stop()", Object.assign(Object.assign({}, this.logContext), Y(a))), this.emit(O.TrackSubscriptionFailed, t);
        return;
      }
      const c = e.kind === "video";
      let d;
      return c ? d = new Jh(e, t, s, r) : d = new Hh(e, t, s, this.audioContext, this.audioOutput), d.source = a.source, d.isMuted = a.isMuted, d.setMediaStream(i), d.start(), a.setTrack(d), this.volumeMap.has(a.source) && Is(d) && lt(d) && d.setVolume(this.volumeMap.get(a.source)), a;
    }
    get hasMetadata() {
      return !!this.participantInfo;
    }
    getTrackPublicationBySid(e) {
      return this.trackPublications.get(e);
    }
    updateInfo(e) {
      if (!super.updateInfo(e)) return false;
      const t = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
      return e.tracks.forEach((s) => {
        var r, o;
        let a = this.getTrackPublicationBySid(s.sid);
        if (a) a.updateInfo(s);
        else {
          const c = C.kindFromProto(s.type);
          if (!c) return;
          a = new ep(c, s, (r = this.signalClient.connectOptions) === null || r === void 0 ? void 0 : r.autoSubscribe, {
            loggerContextCb: () => this.logContext,
            loggerName: (o = this.loggerOptions) === null || o === void 0 ? void 0 : o.loggerName
          }), a.updateInfo(s), i.set(s.sid, a);
          const d = Array.from(this.trackPublications.values()).find((l) => l.source === (a == null ? void 0 : a.source));
          d && a.source !== C.Source.Unknown && this.log.debug("received a second track publication for ".concat(this.identity, " with the same source: ").concat(a.source), Object.assign(Object.assign({}, this.logContext), {
            oldTrack: Y(d),
            newTrack: Y(a)
          })), this.addTrackPublication(a);
        }
        t.set(s.sid, a);
      }), this.trackPublications.forEach((s) => {
        t.has(s.trackSid) || (this.log.trace("detected removed track on remote participant, unpublishing", Object.assign(Object.assign({}, this.logContext), Y(s))), this.unpublishTrack(s.trackSid, true));
      }), i.forEach((s) => {
        this.emit(O.TrackPublished, s);
      }), true;
    }
    unpublishTrack(e, t) {
      const i = this.trackPublications.get(e);
      if (!i) return;
      const { track: s } = i;
      switch (s && (s.stop(), i.setTrack(void 0)), this.trackPublications.delete(e), i.kind) {
        case C.Kind.Audio:
          this.audioTrackPublications.delete(e);
          break;
        case C.Kind.Video:
          this.videoTrackPublications.delete(e);
          break;
      }
      t && this.emit(O.TrackUnpublished, i);
    }
    setAudioOutput(e) {
      return p(this, void 0, void 0, function* () {
        this.audioOutput = e;
        const t = [];
        this.audioTrackPublications.forEach((i) => {
          var s;
          lt(i.track) && Is(i.track) && t.push(i.track.setSinkId((s = e.deviceId) !== null && s !== void 0 ? s : "default"));
        }), yield Promise.all(t);
      });
    }
    emit(e) {
      for (var t = arguments.length, i = new Array(t > 1 ? t - 1 : 0), s = 1; s < t; s++) i[s - 1] = arguments[s];
      return this.log.trace("participant event", Object.assign(Object.assign({}, this.logContext), {
        event: e,
        args: i
      })), super.emit(e, ...i);
    }
  }
  var ie;
  (function(n) {
    n.Disconnected = "disconnected", n.Connecting = "connecting", n.Connected = "connected", n.Reconnecting = "reconnecting", n.SignalReconnecting = "signalReconnecting";
  })(ie || (ie = {}));
  const tp = 4 * 1e3;
  class Ii extends pt.EventEmitter {
    get hasE2EESetup() {
      return this.e2eeManager !== void 0;
    }
    constructor(e) {
      var t, i, s, r, o;
      if (super(), t = this, this.state = ie.Disconnected, this.activeSpeakers = [], this.isE2EEEnabled = false, this.audioEnabled = true, this.isVideoPlaybackBlocked = false, this.log = H, this.bufferedEvents = [], this.isResuming = false, this.rpcHandlers = /* @__PURE__ */ new Map(), this.connect = (a, c, d) => p(this, void 0, void 0, function* () {
        var l;
        if (!bu()) throw ut() ? Error("WebRTC isn't detected, have you called registerGlobals?") : Error("LiveKit doesn't seem to be supported on this browser. Try to update your browser and make sure no browser extensions are disabling webRTC.");
        const u = yield this.disconnectLock.lock();
        if (this.state === ie.Connected) return this.log.info("already connected to room ".concat(this.name), this.logContext), u(), Promise.resolve();
        if (this.connectFuture) return u(), this.connectFuture.promise;
        this.setAndEmitConnectionState(ie.Connecting), ((l = this.regionUrlProvider) === null || l === void 0 ? void 0 : l.getServerUrl().toString()) !== pc(a) && (this.regionUrl = void 0, this.regionUrlProvider = void 0), Ri(new URL(a)) && (this.regionUrlProvider === void 0 ? this.regionUrlProvider = new ee(a, c) : this.regionUrlProvider.updateToken(c), this.regionUrlProvider.fetchRegionSettings().then((v) => {
          var g;
          (g = this.regionUrlProvider) === null || g === void 0 || g.setServerReportedRegions(v);
        }).catch((v) => {
          this.log.warn("could not fetch region settings", Object.assign(Object.assign({}, this.logContext), {
            error: v
          }));
        }));
        const h = (v, g, T) => p(this, void 0, void 0, function* () {
          var S, I;
          this.abortController && this.abortController.abort();
          const P = new AbortController();
          this.abortController = P, u == null ? void 0 : u();
          try {
            if (yield Ci.getInstance().getBackOffPromise(a), P.signal.aborted) throw F.cancelled("Connection attempt aborted");
            yield this.attemptConnection(T ?? a, c, d, P), this.abortController = void 0, v();
          } catch (b) {
            if (this.regionUrlProvider && b instanceof F && b.reason !== ce.Cancelled && b.reason !== ce.NotAllowed) {
              let k = null;
              try {
                this.log.debug("Fetching next region"), k = yield this.regionUrlProvider.getNextBestRegionUrl((S = this.abortController) === null || S === void 0 ? void 0 : S.signal);
              } catch (w) {
                if (w instanceof F && (w.status === 401 || w.reason === ce.Cancelled)) {
                  this.handleDisconnect(this.options.stopLocalTrackOnUnpublish), g(w);
                  return;
                }
              }
              [
                ce.InternalError,
                ce.ServerUnreachable,
                ce.Timeout
              ].includes(b.reason) && (this.log.debug("Adding failed connection attempt to back off"), Ci.getInstance().addFailedConnectionAttempt(a)), k && !(!((I = this.abortController) === null || I === void 0) && I.signal.aborted) ? (this.log.info("Initial connection failed with ConnectionError: ".concat(b.message, ". Retrying with another region: ").concat(k), this.logContext), this.recreateEngine(), yield h(v, g, k)) : (this.handleDisconnect(this.options.stopLocalTrackOnUnpublish, ea(b)), g(b));
            } else {
              let k = rt.UNKNOWN_REASON;
              b instanceof F && (k = ea(b)), this.handleDisconnect(this.options.stopLocalTrackOnUnpublish, k), g(b);
            }
          }
        }), m = this.regionUrl;
        return this.regionUrl = void 0, this.connectFuture = new $e((v, g) => {
          h(v, g, m);
        }, () => {
          this.clearConnectionFutures();
        }), this.connectFuture.promise;
      }), this.connectSignal = (a, c, d, l, u, h) => p(this, void 0, void 0, function* () {
        var m, v, g;
        const T = yield d.join(a, c, {
          autoSubscribe: l.autoSubscribe,
          adaptiveStream: typeof u.adaptiveStream == "object" ? true : u.adaptiveStream,
          maxRetries: l.maxRetries,
          e2eeEnabled: !!this.e2eeManager,
          websocketTimeout: l.websocketTimeout
        }, h.signal, !u.singlePeerConnection);
        let S = T.serverInfo;
        if (S || (S = {
          version: T.serverVersion,
          region: T.serverRegion
        }), this.serverInfo = S, this.log.debug("connected to Livekit Server ".concat(Object.entries(S).map((I) => {
          let [P, b] = I;
          return "".concat(P, ": ").concat(b);
        }).join(", ")), {
          room: (m = T.room) === null || m === void 0 ? void 0 : m.name,
          roomSid: (v = T.room) === null || v === void 0 ? void 0 : v.sid,
          identity: (g = T.participant) === null || g === void 0 ? void 0 : g.identity
        }), !S.version) throw new tu("unknown server version");
        return S.version === "0.15.1" && this.options.dynacast && (this.log.debug("disabling dynacast due to server version", this.logContext), u.dynacast = false), T;
      }), this.applyJoinResponse = (a) => {
        const c = a.participant;
        if (this.localParticipant.sid = c.sid, this.localParticipant.identity = c.identity, this.localParticipant.setEnabledPublishCodecs(a.enabledPublishCodecs), this.e2eeManager) try {
          this.e2eeManager.setSifTrailer(a.sifTrailer);
        } catch (d) {
          this.log.error(d instanceof Error ? d.message : "Could not set SifTrailer", Object.assign(Object.assign({}, this.logContext), {
            error: d
          }));
        }
        this.handleParticipantUpdates([
          c,
          ...a.otherParticipants
        ]), a.room && this.handleRoomUpdate(a.room);
      }, this.attemptConnection = (a, c, d, l) => p(this, void 0, void 0, function* () {
        var u, h;
        this.state === ie.Reconnecting || this.isResuming || !((u = this.engine) === null || u === void 0) && u.pendingReconnect ? (this.log.info("Reconnection attempt replaced by new connection attempt", this.logContext), this.recreateEngine()) : this.maybeCreateEngine(), !((h = this.regionUrlProvider) === null || h === void 0) && h.isCloud() && this.engine.setRegionUrlProvider(this.regionUrlProvider), this.acquireAudioContext(), this.connOptions = Object.assign(Object.assign({}, ar), d), this.connOptions.rtcConfig && (this.engine.rtcConfig = this.connOptions.rtcConfig), this.connOptions.peerConnectionTimeout && (this.engine.peerConnectionTimeout = this.connOptions.peerConnectionTimeout);
        try {
          const m = yield this.connectSignal(a, c, this.engine, this.connOptions, this.options, l);
          this.applyJoinResponse(m), this.setupLocalParticipantEvents(), this.emit(R.SignalConnected);
        } catch (m) {
          yield this.engine.close(), this.recreateEngine();
          const v = l.signal.aborted ? F.cancelled("Signal connection aborted") : F.serverUnreachable("could not establish signal connection");
          throw m instanceof Error && (v.message = "".concat(v.message, ": ").concat(m.message)), m instanceof F && (v.reason = m.reason, v.status = m.status), this.log.debug("error trying to establish signal connection", Object.assign(Object.assign({}, this.logContext), {
            error: m
          })), v;
        }
        if (l.signal.aborted) throw yield this.engine.close(), this.recreateEngine(), F.cancelled("Connection attempt aborted");
        try {
          yield this.engine.waitForPCInitialConnection(this.connOptions.peerConnectionTimeout, l);
        } catch (m) {
          throw yield this.engine.close(), this.recreateEngine(), m;
        }
        Ge() && this.options.disconnectOnPageLeave && (window.addEventListener("pagehide", this.onPageLeave), window.addEventListener("beforeunload", this.onPageLeave)), Ge() && window.addEventListener("freeze", this.onPageLeave), this.setAndEmitConnectionState(ie.Connected), this.emit(R.Connected), Ci.getInstance().resetFailedConnectionAttempts(a), this.registerConnectionReconcile(), this.regionUrlProvider && this.regionUrlProvider.notifyConnected();
      }), this.disconnect = function() {
        for (var a = arguments.length, c = new Array(a), d = 0; d < a; d++) c[d] = arguments[d];
        return p(t, [
          ...c
        ], void 0, function() {
          var l = this;
          let u = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : true;
          return function* () {
            var h, m, v;
            const g = yield l.disconnectLock.lock();
            try {
              if (l.state === ie.Disconnected) {
                l.log.debug("already disconnected", l.logContext);
                return;
              }
              if (l.log.info("disconnect from room", Object.assign({}, l.logContext)), l.state === ie.Connecting || l.state === ie.Reconnecting || l.isResuming) {
                const T = "Abort connection attempt due to user initiated disconnect";
                l.log.warn(T, l.logContext), (h = l.abortController) === null || h === void 0 || h.abort(T), (v = (m = l.connectFuture) === null || m === void 0 ? void 0 : m.reject) === null || v === void 0 || v.call(m, F.cancelled("Client initiated disconnect")), l.connectFuture = void 0;
              }
              l.engine && (l.engine.client.isDisconnected || (yield l.engine.client.sendLeave()), yield l.engine.close()), l.handleDisconnect(u, rt.CLIENT_INITIATED), l.engine = void 0;
            } finally {
              g();
            }
          }();
        });
      }, this.onPageLeave = () => p(this, void 0, void 0, function* () {
        this.log.info("Page leave detected, disconnecting", this.logContext), yield this.disconnect();
      }), this.startAudio = () => p(this, void 0, void 0, function* () {
        const a = [], c = We();
        if (c && c.os === "iOS") {
          const d = "livekit-dummy-audio-el";
          let l = document.getElementById(d);
          if (!l) {
            l = document.createElement("audio"), l.id = d, l.autoplay = true, l.hidden = true;
            const u = Zn();
            u.enabled = true;
            const h = new MediaStream([
              u
            ]);
            l.srcObject = h, document.addEventListener("visibilitychange", () => {
              l && (l.srcObject = document.hidden ? null : h, document.hidden || (this.log.debug("page visible again, triggering startAudio to resume playback and update playback status", this.logContext), this.startAudio()));
            }), document.body.append(l), this.once(R.Disconnected, () => {
              l == null ? void 0 : l.remove(), l = null;
            });
          }
          a.push(l);
        }
        this.remoteParticipants.forEach((d) => {
          d.audioTrackPublications.forEach((l) => {
            l.track && l.track.attachedElements.forEach((u) => {
              a.push(u);
            });
          });
        });
        try {
          yield Promise.all([
            this.acquireAudioContext(),
            ...a.map((d) => (d.muted = false, d.play()))
          ]), this.handleAudioPlaybackStarted();
        } catch (d) {
          throw this.handleAudioPlaybackFailed(d), d;
        }
      }), this.startVideo = () => p(this, void 0, void 0, function* () {
        const a = [];
        for (const c of this.remoteParticipants.values()) c.videoTrackPublications.forEach((d) => {
          var l;
          (l = d.track) === null || l === void 0 || l.attachedElements.forEach((u) => {
            a.includes(u) || a.push(u);
          });
        });
        yield Promise.all(a.map((c) => c.play())).then(() => {
          this.handleVideoPlaybackStarted();
        }).catch((c) => {
          c.name === "NotAllowedError" ? this.handleVideoPlaybackFailed() : this.log.warn("Resuming video playback failed, make sure you call `startVideo` directly in a user gesture handler", this.logContext);
        });
      }), this.handleRestarting = () => {
        this.clearConnectionReconcile(), this.isResuming = false;
        for (const a of this.remoteParticipants.values()) this.handleParticipantDisconnected(a.identity, a);
        this.setAndEmitConnectionState(ie.Reconnecting) && this.emit(R.Reconnecting);
      }, this.handleSignalRestarted = (a) => p(this, void 0, void 0, function* () {
        this.log.debug("signal reconnected to server, region ".concat(a.serverRegion), Object.assign(Object.assign({}, this.logContext), {
          region: a.serverRegion
        })), this.bufferedEvents = [], this.applyJoinResponse(a);
        try {
          yield this.localParticipant.republishAllTracks(void 0, true);
        } catch (c) {
          this.log.error("error trying to re-publish tracks after reconnection", Object.assign(Object.assign({}, this.logContext), {
            error: c
          }));
        }
        try {
          yield this.engine.waitForRestarted(), this.log.debug("fully reconnected to server", Object.assign(Object.assign({}, this.logContext), {
            region: a.serverRegion
          }));
        } catch {
          return;
        }
        this.setAndEmitConnectionState(ie.Connected), this.emit(R.Reconnected), this.registerConnectionReconcile(), this.emitBufferedEvents();
      }), this.handleParticipantUpdates = (a) => {
        a.forEach((c) => {
          var d;
          if (c.identity === this.localParticipant.identity) {
            this.localParticipant.updateInfo(c);
            return;
          }
          c.identity === "" && (c.identity = (d = this.sidToIdentity.get(c.sid)) !== null && d !== void 0 ? d : "");
          let l = this.remoteParticipants.get(c.identity);
          c.state === vi.DISCONNECTED ? this.handleParticipantDisconnected(c.identity, l) : l = this.getOrCreateParticipant(c.identity, c);
        });
      }, this.handleActiveSpeakersUpdate = (a) => {
        const c = [], d = {};
        a.forEach((l) => {
          if (d[l.sid] = true, l.sid === this.localParticipant.sid) this.localParticipant.audioLevel = l.level, this.localParticipant.setIsSpeaking(true), c.push(this.localParticipant);
          else {
            const u = this.getRemoteParticipantBySid(l.sid);
            u && (u.audioLevel = l.level, u.setIsSpeaking(true), c.push(u));
          }
        }), d[this.localParticipant.sid] || (this.localParticipant.audioLevel = 0, this.localParticipant.setIsSpeaking(false)), this.remoteParticipants.forEach((l) => {
          d[l.sid] || (l.audioLevel = 0, l.setIsSpeaking(false));
        }), this.activeSpeakers = c, this.emitWhenConnected(R.ActiveSpeakersChanged, c);
      }, this.handleSpeakersChanged = (a) => {
        const c = /* @__PURE__ */ new Map();
        this.activeSpeakers.forEach((l) => {
          const u = this.remoteParticipants.get(l.identity);
          u && u.sid !== l.sid || c.set(l.sid, l);
        }), a.forEach((l) => {
          let u = this.getRemoteParticipantBySid(l.sid);
          l.sid === this.localParticipant.sid && (u = this.localParticipant), u && (u.audioLevel = l.level, u.setIsSpeaking(l.active), l.active ? c.set(l.sid, u) : c.delete(l.sid));
        });
        const d = Array.from(c.values());
        d.sort((l, u) => u.audioLevel - l.audioLevel), this.activeSpeakers = d, this.emitWhenConnected(R.ActiveSpeakersChanged, d);
      }, this.handleStreamStateUpdate = (a) => {
        a.streamStates.forEach((c) => {
          const d = this.getRemoteParticipantBySid(c.participantSid);
          if (!d) return;
          const l = d.getTrackPublicationBySid(c.trackSid);
          if (!l || !l.track) return;
          const u = C.streamStateFromProto(c.state);
          l.track.setStreamState(u), u !== l.track.streamState && (d.emit(O.TrackStreamStateChanged, l, l.track.streamState), this.emitWhenConnected(R.TrackStreamStateChanged, l, l.track.streamState, d));
        });
      }, this.handleSubscriptionPermissionUpdate = (a) => {
        const c = this.getRemoteParticipantBySid(a.participantSid);
        if (!c) return;
        const d = c.getTrackPublicationBySid(a.trackSid);
        d && d.setAllowed(a.allowed);
      }, this.handleSubscriptionError = (a) => {
        const c = Array.from(this.remoteParticipants.values()).find((l) => l.trackPublications.has(a.trackSid));
        if (!c) return;
        const d = c.getTrackPublicationBySid(a.trackSid);
        d && d.setSubscriptionError(a.err);
      }, this.handleDataPacket = (a, c) => {
        const d = this.remoteParticipants.get(a.participantIdentity);
        if (a.value.case === "user") this.handleUserPacket(d, a.value.value, a.kind, c);
        else if (a.value.case === "transcription") this.handleTranscription(d, a.value.value);
        else if (a.value.case === "sipDtmf") this.handleSipDtmf(d, a.value.value);
        else if (a.value.case === "chatMessage") this.handleChatMessage(d, a.value.value);
        else if (a.value.case === "metrics") this.handleMetrics(a.value.value, d);
        else if (a.value.case === "streamHeader" || a.value.case === "streamChunk" || a.value.case === "streamTrailer") this.handleDataStream(a, c);
        else if (a.value.case === "rpcRequest") {
          const l = a.value.value;
          this.handleIncomingRpcRequest(a.participantIdentity, l.id, l.method, l.payload, l.responseTimeoutMs, l.version);
        }
      }, this.handleUserPacket = (a, c, d, l) => {
        this.emit(R.DataReceived, c.payload, a, d, c.topic, l), a == null ? void 0 : a.emit(O.DataReceived, c.payload, d, l);
      }, this.handleSipDtmf = (a, c) => {
        this.emit(R.SipDTMFReceived, c, a), a == null ? void 0 : a.emit(O.SipDTMFReceived, c);
      }, this.handleTranscription = (a, c) => {
        const d = c.transcribedParticipantIdentity === this.localParticipant.identity ? this.localParticipant : this.getParticipantByIdentity(c.transcribedParticipantIdentity), l = d == null ? void 0 : d.trackPublications.get(c.trackId), u = _u(c, this.transcriptionReceivedTimes);
        l == null ? void 0 : l.emit(x.TranscriptionReceived, u), d == null ? void 0 : d.emit(O.TranscriptionReceived, u, l), this.emit(R.TranscriptionReceived, u, d, l);
      }, this.handleChatMessage = (a, c) => {
        const d = Iu(c);
        this.emit(R.ChatMessage, d, a);
      }, this.handleMetrics = (a, c) => {
        this.emit(R.MetricsReceived, a, c);
      }, this.handleDataStream = (a, c) => {
        this.incomingDataStreamManager.handleDataStreamPacket(a, c);
      }, this.bufferedSegments = /* @__PURE__ */ new Map(), this.handleAudioPlaybackStarted = () => {
        this.canPlaybackAudio || (this.audioEnabled = true, this.emit(R.AudioPlaybackStatusChanged, true));
      }, this.handleAudioPlaybackFailed = (a) => {
        this.log.warn("could not playback audio", Object.assign(Object.assign({}, this.logContext), {
          error: a
        })), this.canPlaybackAudio && (this.audioEnabled = false, this.emit(R.AudioPlaybackStatusChanged, false));
      }, this.handleVideoPlaybackStarted = () => {
        this.isVideoPlaybackBlocked && (this.isVideoPlaybackBlocked = false, this.emit(R.VideoPlaybackStatusChanged, true));
      }, this.handleVideoPlaybackFailed = () => {
        this.isVideoPlaybackBlocked || (this.isVideoPlaybackBlocked = true, this.emit(R.VideoPlaybackStatusChanged, false));
      }, this.handleDeviceChange = () => p(this, void 0, void 0, function* () {
        var a;
        ((a = We()) === null || a === void 0 ? void 0 : a.os) !== "iOS" && (yield this.selectDefaultDevices()), this.emit(R.MediaDevicesChanged);
      }), this.handleRoomUpdate = (a) => {
        const c = this.roomInfo;
        this.roomInfo = a, c && c.metadata !== a.metadata && this.emitWhenConnected(R.RoomMetadataChanged, a.metadata), (c == null ? void 0 : c.activeRecording) !== a.activeRecording && this.emitWhenConnected(R.RecordingStatusChanged, a.activeRecording);
      }, this.handleConnectionQualityUpdate = (a) => {
        a.updates.forEach((c) => {
          if (c.participantSid === this.localParticipant.sid) {
            this.localParticipant.setConnectionQuality(c.quality);
            return;
          }
          const d = this.getRemoteParticipantBySid(c.participantSid);
          d && d.setConnectionQuality(c.quality);
        });
      }, this.onLocalParticipantMetadataChanged = (a) => {
        this.emit(R.ParticipantMetadataChanged, a, this.localParticipant);
      }, this.onLocalParticipantNameChanged = (a) => {
        this.emit(R.ParticipantNameChanged, a, this.localParticipant);
      }, this.onLocalAttributesChanged = (a) => {
        this.emit(R.ParticipantAttributesChanged, a, this.localParticipant);
      }, this.onLocalTrackMuted = (a) => {
        this.emit(R.TrackMuted, a, this.localParticipant);
      }, this.onLocalTrackUnmuted = (a) => {
        this.emit(R.TrackUnmuted, a, this.localParticipant);
      }, this.onTrackProcessorUpdate = (a) => {
        var c;
        (c = a == null ? void 0 : a.onPublish) === null || c === void 0 || c.call(a, this);
      }, this.onLocalTrackPublished = (a) => p(this, void 0, void 0, function* () {
        var c, d, l, u, h, m;
        (c = a.track) === null || c === void 0 || c.on(x.TrackProcessorUpdate, this.onTrackProcessorUpdate), (d = a.track) === null || d === void 0 || d.on(x.Restarted, this.onLocalTrackRestarted), (h = (u = (l = a.track) === null || l === void 0 ? void 0 : l.getProcessor()) === null || u === void 0 ? void 0 : u.onPublish) === null || h === void 0 || h.call(u, this), this.emit(R.LocalTrackPublished, a, this.localParticipant), vt(a.track) && (yield a.track.checkForSilence()) && this.emit(R.LocalAudioSilenceDetected, a);
        const v = yield (m = a.track) === null || m === void 0 ? void 0 : m.getDeviceId(false), g = Es(a.source);
        g && v && v !== this.localParticipant.activeDeviceMap.get(g) && (this.localParticipant.activeDeviceMap.set(g, v), this.emit(R.ActiveDeviceChanged, g, v));
      }), this.onLocalTrackUnpublished = (a) => {
        var c, d;
        (c = a.track) === null || c === void 0 || c.off(x.TrackProcessorUpdate, this.onTrackProcessorUpdate), (d = a.track) === null || d === void 0 || d.off(x.Restarted, this.onLocalTrackRestarted), this.emit(R.LocalTrackUnpublished, a, this.localParticipant);
      }, this.onLocalTrackRestarted = (a) => p(this, void 0, void 0, function* () {
        const c = yield a.getDeviceId(false), d = Es(a.source);
        d && c && c !== this.localParticipant.activeDeviceMap.get(d) && (this.log.debug("local track restarted, setting ".concat(d, " ").concat(c, " active"), this.logContext), this.localParticipant.activeDeviceMap.set(d, c), this.emit(R.ActiveDeviceChanged, d, c));
      }), this.onLocalConnectionQualityChanged = (a) => {
        this.emit(R.ConnectionQualityChanged, a, this.localParticipant);
      }, this.onMediaDevicesError = (a, c) => {
        this.emit(R.MediaDevicesError, a, c);
      }, this.onLocalParticipantPermissionsChanged = (a) => {
        this.emit(R.ParticipantPermissionsChanged, a, this.localParticipant);
      }, this.onLocalChatMessageSent = (a) => {
        this.emit(R.ChatMessage, a, this.localParticipant);
      }, this.setMaxListeners(100), this.remoteParticipants = /* @__PURE__ */ new Map(), this.sidToIdentity = /* @__PURE__ */ new Map(), this.options = Object.assign(Object.assign({}, hh), e), this.log = wt((i = this.options.loggerName) !== null && i !== void 0 ? i : at.Room), this.transcriptionReceivedTimes = /* @__PURE__ */ new Map(), this.options.audioCaptureDefaults = Object.assign(Object.assign({}, mc), e == null ? void 0 : e.audioCaptureDefaults), this.options.videoCaptureDefaults = Object.assign(Object.assign({}, fc), e == null ? void 0 : e.videoCaptureDefaults), this.options.publishDefaults = Object.assign(Object.assign({}, uh), e == null ? void 0 : e.publishDefaults), this.maybeCreateEngine(), this.incomingDataStreamManager = new qh(), this.outgoingDataStreamManager = new Kh(this.engine, this.log), this.disconnectLock = new je(), this.localParticipant = new Zh("", "", this.engine, this.options, this.rpcHandlers, this.outgoingDataStreamManager), (this.options.e2ee || this.options.encryption) && this.setupE2EE(), this.engine.e2eeManager = this.e2eeManager, this.options.videoCaptureDefaults.deviceId && this.localParticipant.activeDeviceMap.set("videoinput", Ft(this.options.videoCaptureDefaults.deviceId)), this.options.audioCaptureDefaults.deviceId && this.localParticipant.activeDeviceMap.set("audioinput", Ft(this.options.audioCaptureDefaults.deviceId)), !((s = this.options.audioOutput) === null || s === void 0) && s.deviceId && this.switchActiveDevice("audiooutput", Ft(this.options.audioOutput.deviceId)).catch((a) => this.log.warn("Could not set audio output: ".concat(a.message), this.logContext)), Ge()) {
        const a = new AbortController();
        (o = (r = navigator.mediaDevices) === null || r === void 0 ? void 0 : r.addEventListener) === null || o === void 0 || o.call(r, "devicechange", this.handleDeviceChange, {
          signal: a.signal
        }), Ii.cleanupRegistry && Ii.cleanupRegistry.register(this, () => {
          a.abort();
        });
      }
    }
    registerTextStreamHandler(e, t) {
      return this.incomingDataStreamManager.registerTextStreamHandler(e, t);
    }
    unregisterTextStreamHandler(e) {
      return this.incomingDataStreamManager.unregisterTextStreamHandler(e);
    }
    registerByteStreamHandler(e, t) {
      return this.incomingDataStreamManager.registerByteStreamHandler(e, t);
    }
    unregisterByteStreamHandler(e) {
      return this.incomingDataStreamManager.unregisterByteStreamHandler(e);
    }
    registerRpcMethod(e, t) {
      if (this.rpcHandlers.has(e)) throw Error("RPC handler already registered for method ".concat(e, ", unregisterRpcMethod before trying to register again"));
      this.rpcHandlers.set(e, t);
    }
    unregisterRpcMethod(e) {
      this.rpcHandlers.delete(e);
    }
    setE2EEEnabled(e) {
      return p(this, void 0, void 0, function* () {
        if (this.e2eeManager) yield Promise.all([
          this.localParticipant.setE2EEEnabled(e)
        ]), this.localParticipant.identity !== "" && this.e2eeManager.setParticipantCryptorEnabled(e, this.localParticipant.identity);
        else throw Error("e2ee not configured, please set e2ee settings within the room options");
      });
    }
    setupE2EE() {
      var e;
      const t = !!this.options.encryption, i = this.options.encryption || this.options.e2ee;
      i && ("e2eeManager" in i ? (this.e2eeManager = i.e2eeManager, this.e2eeManager.isDataChannelEncryptionEnabled = t) : this.e2eeManager = new zu(i, t), this.e2eeManager.on(Ut.ParticipantEncryptionStatusChanged, (s, r) => {
        Mu(r) && (this.isE2EEEnabled = s), this.emit(R.ParticipantEncryptionStatusChanged, s, r);
      }), this.e2eeManager.on(Ut.EncryptionError, (s, r) => {
        const o = r ? this.getParticipantByIdentity(r) : void 0;
        this.emit(R.EncryptionError, s, o);
      }), (e = this.e2eeManager) === null || e === void 0 || e.setup(this));
    }
    get logContext() {
      var e;
      return {
        room: this.name,
        roomID: (e = this.roomInfo) === null || e === void 0 ? void 0 : e.sid,
        participant: this.localParticipant.identity,
        pID: this.localParticipant.sid
      };
    }
    get isRecording() {
      var e, t;
      return (t = (e = this.roomInfo) === null || e === void 0 ? void 0 : e.activeRecording) !== null && t !== void 0 ? t : false;
    }
    getSid() {
      return this.state === ie.Disconnected ? Ae.resolve("") : this.roomInfo && this.roomInfo.sid !== "" ? Ae.resolve(this.roomInfo.sid) : new Ae((e, t) => {
        const i = (s) => {
          s.sid !== "" && (this.engine.off(M.RoomUpdate, i), e(s.sid));
        };
        this.engine.on(M.RoomUpdate, i), this.once(R.Disconnected, () => {
          this.engine.off(M.RoomUpdate, i), t(new me("Room disconnected before room server id was available"));
        });
      });
    }
    get name() {
      var e, t;
      return (t = (e = this.roomInfo) === null || e === void 0 ? void 0 : e.name) !== null && t !== void 0 ? t : "";
    }
    get metadata() {
      var e;
      return (e = this.roomInfo) === null || e === void 0 ? void 0 : e.metadata;
    }
    get numParticipants() {
      var e, t;
      return (t = (e = this.roomInfo) === null || e === void 0 ? void 0 : e.numParticipants) !== null && t !== void 0 ? t : 0;
    }
    get numPublishers() {
      var e, t;
      return (t = (e = this.roomInfo) === null || e === void 0 ? void 0 : e.numPublishers) !== null && t !== void 0 ? t : 0;
    }
    maybeCreateEngine() {
      this.engine && !this.engine.isClosed || (this.engine = new jh(this.options), this.engine.e2eeManager = this.e2eeManager, this.engine.on(M.ParticipantUpdate, this.handleParticipantUpdates).on(M.RoomUpdate, this.handleRoomUpdate).on(M.SpeakersChanged, this.handleSpeakersChanged).on(M.StreamStateChanged, this.handleStreamStateUpdate).on(M.ConnectionQualityUpdate, this.handleConnectionQualityUpdate).on(M.SubscriptionError, this.handleSubscriptionError).on(M.SubscriptionPermissionUpdate, this.handleSubscriptionPermissionUpdate).on(M.MediaTrackAdded, (e, t, i) => {
        this.onTrackAdded(e, t, i);
      }).on(M.Disconnected, (e) => {
        this.handleDisconnect(this.options.stopLocalTrackOnUnpublish, e);
      }).on(M.ActiveSpeakersUpdate, this.handleActiveSpeakersUpdate).on(M.DataPacketReceived, this.handleDataPacket).on(M.Resuming, () => {
        this.clearConnectionReconcile(), this.isResuming = true, this.log.info("Resuming signal connection", this.logContext), this.setAndEmitConnectionState(ie.SignalReconnecting) && this.emit(R.SignalReconnecting);
      }).on(M.Resumed, () => {
        this.registerConnectionReconcile(), this.isResuming = false, this.log.info("Resumed signal connection", this.logContext), this.updateSubscriptions(), this.emitBufferedEvents(), this.setAndEmitConnectionState(ie.Connected) && this.emit(R.Reconnected);
      }).on(M.SignalResumed, () => {
        this.bufferedEvents = [], (this.state === ie.Reconnecting || this.isResuming) && this.sendSyncState();
      }).on(M.Restarting, this.handleRestarting).on(M.SignalRestarted, this.handleSignalRestarted).on(M.Offline, () => {
        this.setAndEmitConnectionState(ie.Reconnecting) && this.emit(R.Reconnecting);
      }).on(M.DCBufferStatusChanged, (e, t) => {
        this.emit(R.DCBufferStatusChanged, e, t);
      }).on(M.LocalTrackSubscribed, (e) => {
        const t = this.localParticipant.getTrackPublications().find((i) => {
          let { trackSid: s } = i;
          return s === e;
        });
        if (!t) {
          this.log.warn("could not find local track subscription for subscribed event", this.logContext);
          return;
        }
        this.localParticipant.emit(O.LocalTrackSubscribed, t), this.emitWhenConnected(R.LocalTrackSubscribed, t, this.localParticipant);
      }).on(M.RoomMoved, (e) => {
        this.log.debug("room moved", e), e.room && this.handleRoomUpdate(e.room), this.remoteParticipants.forEach((t, i) => {
          this.handleParticipantDisconnected(i, t);
        }), this.emit(R.Moved, e.room.name), e.participant ? this.handleParticipantUpdates([
          e.participant,
          ...e.otherParticipants
        ]) : this.handleParticipantUpdates(e.otherParticipants);
      }), this.localParticipant && this.localParticipant.setupEngine(this.engine), this.e2eeManager && this.e2eeManager.setupEngine(this.engine), this.outgoingDataStreamManager && this.outgoingDataStreamManager.setupEngine(this.engine));
    }
    static getLocalDevices(e) {
      let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true;
      return Ee.getInstance().getDevices(e, t);
    }
    prepareConnection(e, t) {
      return p(this, void 0, void 0, function* () {
        if (this.state === ie.Disconnected) {
          this.log.debug("prepareConnection to ".concat(e), this.logContext);
          try {
            if (Ri(new URL(e)) && t) {
              this.regionUrlProvider = new ee(e, t);
              const i = yield this.regionUrlProvider.getNextBestRegionUrl();
              i && this.state === ie.Disconnected && (this.regionUrl = i, yield fetch(Xi(i), {
                method: "HEAD"
              }), this.log.debug("prepared connection to ".concat(i), this.logContext));
            } else yield fetch(Xi(e), {
              method: "HEAD"
            });
          } catch (i) {
            this.log.warn("could not prepare connection", Object.assign(Object.assign({}, this.logContext), {
              error: i
            }));
          }
        }
      });
    }
    getParticipantByIdentity(e) {
      return this.localParticipant.identity === e ? this.localParticipant : this.remoteParticipants.get(e);
    }
    clearConnectionFutures() {
      this.connectFuture = void 0;
    }
    simulateScenario(e, t) {
      return p(this, void 0, void 0, function* () {
        let i = () => p(this, void 0, void 0, function* () {
        }), s;
        switch (e) {
          case "signal-reconnect":
            yield this.engine.client.handleOnClose("simulate disconnect");
            break;
          case "speaker":
            s = new ct({
              scenario: {
                case: "speakerUpdate",
                value: 3
              }
            });
            break;
          case "node-failure":
            s = new ct({
              scenario: {
                case: "nodeFailure",
                value: true
              }
            });
            break;
          case "server-leave":
            s = new ct({
              scenario: {
                case: "serverLeave",
                value: true
              }
            });
            break;
          case "migration":
            s = new ct({
              scenario: {
                case: "migration",
                value: true
              }
            });
            break;
          case "resume-reconnect":
            this.engine.failNext(), yield this.engine.client.handleOnClose("simulate resume-disconnect");
            break;
          case "disconnect-signal-on-resume":
            i = () => p(this, void 0, void 0, function* () {
              yield this.engine.client.handleOnClose("simulate resume-disconnect");
            }), s = new ct({
              scenario: {
                case: "disconnectSignalOnResume",
                value: true
              }
            });
            break;
          case "disconnect-signal-on-resume-no-messages":
            i = () => p(this, void 0, void 0, function* () {
              yield this.engine.client.handleOnClose("simulate resume-disconnect");
            }), s = new ct({
              scenario: {
                case: "disconnectSignalOnResumeNoMessages",
                value: true
              }
            });
            break;
          case "full-reconnect":
            this.engine.fullReconnectOnNext = true, yield this.engine.client.handleOnClose("simulate full-reconnect");
            break;
          case "force-tcp":
          case "force-tls":
            s = new ct({
              scenario: {
                case: "switchCandidateProtocol",
                value: e === "force-tls" ? 2 : 1
              }
            }), i = () => p(this, void 0, void 0, function* () {
              const r = this.engine.client.onLeave;
              r && r(new Ln({
                reason: rt.CLIENT_INITIATED,
                action: yi.RECONNECT
              }));
            });
            break;
          case "subscriber-bandwidth":
            if (t === void 0 || typeof t != "number") throw new Error("subscriber-bandwidth requires a number as argument");
            s = new ct({
              scenario: {
                case: "subscriberBandwidth",
                value: ei(t)
              }
            });
            break;
          case "leave-full-reconnect":
            s = new ct({
              scenario: {
                case: "leaveRequestFullReconnect",
                value: true
              }
            });
        }
        s && (yield this.engine.client.sendSimulateScenario(s), yield i());
      });
    }
    get canPlaybackAudio() {
      return this.audioEnabled;
    }
    get canPlaybackVideo() {
      return !this.isVideoPlaybackBlocked;
    }
    getActiveDevice(e) {
      return this.localParticipant.activeDeviceMap.get(e);
    }
    switchActiveDevice(e, t) {
      return p(this, arguments, void 0, function(i, s) {
        var r = this;
        let o = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : true;
        return function* () {
          var a, c, d, l, u, h, m;
          let v = true, g = false;
          const T = o ? {
            exact: s
          } : s;
          if (i === "audioinput") {
            g = r.localParticipant.audioTrackPublications.size === 0;
            const S = (a = r.getActiveDevice(i)) !== null && a !== void 0 ? a : r.options.audioCaptureDefaults.deviceId;
            r.options.audioCaptureDefaults.deviceId = T;
            const I = Array.from(r.localParticipant.audioTrackPublications.values()).filter((b) => b.source === C.Source.Microphone);
            try {
              v = (yield Promise.all(I.map((b) => {
                var k;
                return (k = b.audioTrack) === null || k === void 0 ? void 0 : k.setDeviceId(T);
              }))).every((b) => b === true);
            } catch (b) {
              throw r.options.audioCaptureDefaults.deviceId = S, b;
            }
            const P = I.some((b) => {
              var k, w;
              return (w = (k = b.track) === null || k === void 0 ? void 0 : k.isMuted) !== null && w !== void 0 ? w : false;
            });
            v && P && (g = true);
          } else if (i === "videoinput") {
            g = r.localParticipant.videoTrackPublications.size === 0;
            const S = (c = r.getActiveDevice(i)) !== null && c !== void 0 ? c : r.options.videoCaptureDefaults.deviceId;
            r.options.videoCaptureDefaults.deviceId = T;
            const I = Array.from(r.localParticipant.videoTrackPublications.values()).filter((b) => b.source === C.Source.Camera);
            try {
              v = (yield Promise.all(I.map((b) => {
                var k;
                return (k = b.videoTrack) === null || k === void 0 ? void 0 : k.setDeviceId(T);
              }))).every((b) => b === true);
            } catch (b) {
              throw r.options.videoCaptureDefaults.deviceId = S, b;
            }
            const P = I.some((b) => {
              var k, w;
              return (w = (k = b.track) === null || k === void 0 ? void 0 : k.isMuted) !== null && w !== void 0 ? w : false;
            });
            v && P && (g = true);
          } else if (i === "audiooutput") {
            if (g = true, !_s() && !r.options.webAudioMix || r.options.webAudioMix && r.audioContext && !("setSinkId" in r.audioContext)) throw new Error("cannot switch audio output, the current browser does not support it");
            r.options.webAudioMix && (s = (d = yield Ee.getInstance().normalizeDeviceId("audiooutput", s)) !== null && d !== void 0 ? d : ""), (l = (m = r.options).audioOutput) !== null && l !== void 0 || (m.audioOutput = {});
            const S = (u = r.getActiveDevice(i)) !== null && u !== void 0 ? u : r.options.audioOutput.deviceId;
            r.options.audioOutput.deviceId = s;
            try {
              r.options.webAudioMix && ((h = r.audioContext) === null || h === void 0 || h.setSinkId(s)), yield Promise.all(Array.from(r.remoteParticipants.values()).map((I) => I.setAudioOutput({
                deviceId: s
              })));
            } catch (I) {
              throw r.options.audioOutput.deviceId = S, I;
            }
          }
          return g && (r.localParticipant.activeDeviceMap.set(i, s), r.emit(R.ActiveDeviceChanged, i, s)), v;
        }();
      });
    }
    setupLocalParticipantEvents() {
      this.localParticipant.on(O.ParticipantMetadataChanged, this.onLocalParticipantMetadataChanged).on(O.ParticipantNameChanged, this.onLocalParticipantNameChanged).on(O.AttributesChanged, this.onLocalAttributesChanged).on(O.TrackMuted, this.onLocalTrackMuted).on(O.TrackUnmuted, this.onLocalTrackUnmuted).on(O.LocalTrackPublished, this.onLocalTrackPublished).on(O.LocalTrackUnpublished, this.onLocalTrackUnpublished).on(O.ConnectionQualityChanged, this.onLocalConnectionQualityChanged).on(O.MediaDevicesError, this.onMediaDevicesError).on(O.AudioStreamAcquired, this.startAudio).on(O.ChatMessage, this.onLocalChatMessageSent).on(O.ParticipantPermissionsChanged, this.onLocalParticipantPermissionsChanged);
    }
    recreateEngine() {
      var e;
      (e = this.engine) === null || e === void 0 || e.close(), this.engine = void 0, this.isResuming = false, this.remoteParticipants.clear(), this.sidToIdentity.clear(), this.bufferedEvents = [], this.maybeCreateEngine();
    }
    onTrackAdded(e, t, i) {
      if (this.state === ie.Connecting || this.state === ie.Reconnecting) {
        const u = () => {
          this.log.debug("deferring on track for later", {
            mediaTrackId: e.id,
            mediaStreamId: t.id,
            tracksInStream: t.getTracks().map((m) => m.id)
          }), this.onTrackAdded(e, t, i), h();
        }, h = () => {
          this.off(R.Reconnected, u), this.off(R.Connected, u), this.off(R.Disconnected, h);
        };
        this.once(R.Reconnected, u), this.once(R.Connected, u), this.once(R.Disconnected, h);
        return;
      }
      if (this.state === ie.Disconnected) {
        this.log.warn("skipping incoming track after Room disconnected", this.logContext);
        return;
      }
      if (e.readyState === "ended") {
        this.log.info("skipping incoming track as it already ended", this.logContext);
        return;
      }
      const s = gu(t.id), r = s[0];
      let o = s[1], a = e.id;
      if (o && o.startsWith("TR") && (a = o), r === this.localParticipant.sid) {
        this.log.warn("tried to create RemoteParticipant for local participant", this.logContext);
        return;
      }
      const c = Array.from(this.remoteParticipants.values()).find((u) => u.sid === r);
      if (!c) {
        this.log.error("Tried to add a track for a participant, that's not present. Sid: ".concat(r), this.logContext);
        return;
      }
      if (!a.startsWith("TR")) {
        const u = this.engine.getTrackIdForReceiver(i);
        if (!u) {
          this.log.error("Tried to add a track whose 'sid' could not be found for a participant, that's not present. Sid: ".concat(r), this.logContext);
          return;
        }
        a = u;
      }
      a.startsWith("TR") || this.log.warn("Tried to add a track whose 'sid' could not be determined for a participant, that's not present. Sid: ".concat(r, ", streamId: ").concat(o, ", trackId: ").concat(a), Object.assign(Object.assign({}, this.logContext), {
        rpID: r,
        streamId: o,
        trackId: a
      }));
      let d;
      this.options.adaptiveStream && (typeof this.options.adaptiveStream == "object" ? d = this.options.adaptiveStream : d = {});
      const l = c.addSubscribedMediaTrack(e, a, t, i, d);
      (l == null ? void 0 : l.isEncrypted) && !this.e2eeManager && this.emit(R.EncryptionError, new Error("Encrypted ".concat(l.source, " track received from participant ").concat(c.sid, ", but room does not have encryption enabled!")));
    }
    handleDisconnect() {
      let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : true, t = arguments.length > 1 ? arguments[1] : void 0;
      var i, s;
      if (this.clearConnectionReconcile(), this.isResuming = false, this.bufferedEvents = [], this.transcriptionReceivedTimes.clear(), this.incomingDataStreamManager.clearControllers(), this.state !== ie.Disconnected) {
        this.regionUrl = void 0, this.regionUrlProvider && this.regionUrlProvider.notifyDisconnected();
        try {
          this.remoteParticipants.forEach((r) => {
            r.trackPublications.forEach((o) => {
              r.unpublishTrack(o.trackSid);
            });
          }), this.localParticipant.trackPublications.forEach((r) => {
            var o, a, c;
            r.track && this.localParticipant.unpublishTrack(r.track, e), e ? ((o = r.track) === null || o === void 0 || o.detach(), (a = r.track) === null || a === void 0 || a.stop()) : (c = r.track) === null || c === void 0 || c.stopMonitor();
          }), this.localParticipant.off(O.ParticipantMetadataChanged, this.onLocalParticipantMetadataChanged).off(O.ParticipantNameChanged, this.onLocalParticipantNameChanged).off(O.AttributesChanged, this.onLocalAttributesChanged).off(O.TrackMuted, this.onLocalTrackMuted).off(O.TrackUnmuted, this.onLocalTrackUnmuted).off(O.LocalTrackPublished, this.onLocalTrackPublished).off(O.LocalTrackUnpublished, this.onLocalTrackUnpublished).off(O.ConnectionQualityChanged, this.onLocalConnectionQualityChanged).off(O.MediaDevicesError, this.onMediaDevicesError).off(O.AudioStreamAcquired, this.startAudio).off(O.ChatMessage, this.onLocalChatMessageSent).off(O.ParticipantPermissionsChanged, this.onLocalParticipantPermissionsChanged), this.localParticipant.trackPublications.clear(), this.localParticipant.videoTrackPublications.clear(), this.localParticipant.audioTrackPublications.clear(), this.remoteParticipants.clear(), this.sidToIdentity.clear(), this.activeSpeakers = [], this.audioContext && typeof this.options.webAudioMix == "boolean" && (this.audioContext.close(), this.audioContext = void 0), Ge() && (window.removeEventListener("beforeunload", this.onPageLeave), window.removeEventListener("pagehide", this.onPageLeave), window.removeEventListener("freeze", this.onPageLeave), (s = (i = navigator.mediaDevices) === null || i === void 0 ? void 0 : i.removeEventListener) === null || s === void 0 || s.call(i, "devicechange", this.handleDeviceChange));
        } finally {
          this.setAndEmitConnectionState(ie.Disconnected), this.emit(R.Disconnected, t);
        }
      }
    }
    handleParticipantDisconnected(e, t) {
      var i;
      this.remoteParticipants.delete(e), t && (this.incomingDataStreamManager.validateParticipantHasNoActiveDataStreams(e), t.trackPublications.forEach((s) => {
        t.unpublishTrack(s.trackSid, true);
      }), this.emit(R.ParticipantDisconnected, t), t.setDisconnected(), (i = this.localParticipant) === null || i === void 0 || i.handleParticipantDisconnected(t.identity));
    }
    handleIncomingRpcRequest(e, t, i, s, r, o) {
      return p(this, void 0, void 0, function* () {
        if (yield this.engine.publishRpcAck(e, t), o !== 1) {
          yield this.engine.publishRpcResponse(e, t, null, pe.builtIn("UNSUPPORTED_VERSION"));
          return;
        }
        const a = this.rpcHandlers.get(i);
        if (!a) {
          yield this.engine.publishRpcResponse(e, t, null, pe.builtIn("UNSUPPORTED_METHOD"));
          return;
        }
        let c = null, d = null;
        try {
          const l = yield a({
            requestId: t,
            callerIdentity: e,
            payload: s,
            responseTimeout: r
          });
          or(l) > vc ? (c = pe.builtIn("RESPONSE_PAYLOAD_TOO_LARGE"), this.log.warn("RPC Response payload too large for ".concat(i))) : d = l;
        } catch (l) {
          l instanceof pe ? c = l : (this.log.warn("Uncaught error returned by RPC handler for ".concat(i, ". Returning APPLICATION_ERROR instead."), l), c = pe.builtIn("APPLICATION_ERROR"));
        }
        yield this.engine.publishRpcResponse(e, t, d, c);
      });
    }
    selectDefaultDevices() {
      return p(this, void 0, void 0, function* () {
        var e, t, i;
        const s = Ee.getInstance().previousDevices, r = yield Ee.getInstance().getDevices(void 0, false), o = We();
        if ((o == null ? void 0 : o.name) === "Chrome" && o.os !== "iOS") for (let c of r) {
          const d = s.find((l) => l.deviceId === c.deviceId);
          d && d.label !== "" && d.kind === c.kind && d.label !== c.label && this.getActiveDevice(c.kind) === "default" && this.emit(R.ActiveDeviceChanged, c.kind, c.deviceId);
        }
        const a = [
          "audiooutput",
          "audioinput",
          "videoinput"
        ];
        for (let c of a) {
          const d = ou(c), l = this.localParticipant.getTrackPublication(d);
          if (l && (!((e = l.track) === null || e === void 0) && e.isUserProvided)) continue;
          const u = r.filter((m) => m.kind === c), h = this.getActiveDevice(c);
          if (h === ((t = s.filter((m) => m.kind === c)[0]) === null || t === void 0 ? void 0 : t.deviceId) && u.length > 0 && ((i = u[0]) === null || i === void 0 ? void 0 : i.deviceId) !== h) {
            yield this.switchActiveDevice(c, u[0].deviceId);
            continue;
          }
          c === "audioinput" && !Yi() || c === "videoinput" || u.length > 0 && !u.find((m) => m.deviceId === this.getActiveDevice(c)) && (c !== "audiooutput" || !Yi()) && (yield this.switchActiveDevice(c, u[0].deviceId));
        }
      });
    }
    acquireAudioContext() {
      return p(this, void 0, void 0, function* () {
        var e, t;
        if (typeof this.options.webAudioMix != "boolean" && this.options.webAudioMix.audioContext ? this.audioContext = this.options.webAudioMix.audioContext : (!this.audioContext || this.audioContext.state === "closed") && (this.audioContext = (e = cc()) !== null && e !== void 0 ? e : void 0), this.options.webAudioMix && this.remoteParticipants.forEach((s) => s.setAudioContext(this.audioContext)), this.localParticipant.setAudioContext(this.audioContext), this.audioContext && this.audioContext.state === "suspended") try {
          yield Promise.race([
            this.audioContext.resume(),
            xe(200)
          ]);
        } catch (s) {
          this.log.warn("Could not resume audio context", Object.assign(Object.assign({}, this.logContext), {
            error: s
          }));
        }
        const i = ((t = this.audioContext) === null || t === void 0 ? void 0 : t.state) === "running";
        i !== this.canPlaybackAudio && (this.audioEnabled = i, this.emit(R.AudioPlaybackStatusChanged, i));
      });
    }
    createParticipant(e, t) {
      var i;
      let s;
      return t ? s = _n.fromParticipantInfo(this.engine.client, t, {
        loggerContextCb: () => this.logContext,
        loggerName: this.options.loggerName
      }) : s = new _n(this.engine.client, "", e, void 0, void 0, void 0, {
        loggerContextCb: () => this.logContext,
        loggerName: this.options.loggerName
      }), this.options.webAudioMix && s.setAudioContext(this.audioContext), !((i = this.options.audioOutput) === null || i === void 0) && i.deviceId && s.setAudioOutput(this.options.audioOutput).catch((r) => this.log.warn("Could not set audio output: ".concat(r.message), this.logContext)), s;
    }
    getOrCreateParticipant(e, t) {
      if (this.remoteParticipants.has(e)) {
        const s = this.remoteParticipants.get(e);
        return t && s.updateInfo(t) && this.sidToIdentity.set(t.sid, t.identity), s;
      }
      const i = this.createParticipant(e, t);
      return this.remoteParticipants.set(e, i), this.sidToIdentity.set(t.sid, t.identity), this.emitWhenConnected(R.ParticipantConnected, i), i.on(O.TrackPublished, (s) => {
        this.emitWhenConnected(R.TrackPublished, s, i);
      }).on(O.TrackSubscribed, (s, r) => {
        s.kind === C.Kind.Audio ? (s.on(x.AudioPlaybackStarted, this.handleAudioPlaybackStarted), s.on(x.AudioPlaybackFailed, this.handleAudioPlaybackFailed)) : s.kind === C.Kind.Video && (s.on(x.VideoPlaybackFailed, this.handleVideoPlaybackFailed), s.on(x.VideoPlaybackStarted, this.handleVideoPlaybackStarted)), this.emit(R.TrackSubscribed, s, r, i);
      }).on(O.TrackUnpublished, (s) => {
        this.emit(R.TrackUnpublished, s, i);
      }).on(O.TrackUnsubscribed, (s, r) => {
        this.emit(R.TrackUnsubscribed, s, r, i);
      }).on(O.TrackMuted, (s) => {
        this.emitWhenConnected(R.TrackMuted, s, i);
      }).on(O.TrackUnmuted, (s) => {
        this.emitWhenConnected(R.TrackUnmuted, s, i);
      }).on(O.ParticipantMetadataChanged, (s) => {
        this.emitWhenConnected(R.ParticipantMetadataChanged, s, i);
      }).on(O.ParticipantNameChanged, (s) => {
        this.emitWhenConnected(R.ParticipantNameChanged, s, i);
      }).on(O.AttributesChanged, (s) => {
        this.emitWhenConnected(R.ParticipantAttributesChanged, s, i);
      }).on(O.ConnectionQualityChanged, (s) => {
        this.emitWhenConnected(R.ConnectionQualityChanged, s, i);
      }).on(O.ParticipantPermissionsChanged, (s) => {
        this.emitWhenConnected(R.ParticipantPermissionsChanged, s, i);
      }).on(O.TrackSubscriptionStatusChanged, (s, r) => {
        this.emitWhenConnected(R.TrackSubscriptionStatusChanged, s, r, i);
      }).on(O.TrackSubscriptionFailed, (s, r) => {
        this.emit(R.TrackSubscriptionFailed, s, i, r);
      }).on(O.TrackSubscriptionPermissionChanged, (s, r) => {
        this.emitWhenConnected(R.TrackSubscriptionPermissionChanged, s, r, i);
      }).on(O.Active, () => {
        this.emitWhenConnected(R.ParticipantActive, i), i.kind === zi.AGENT && this.localParticipant.setActiveAgent(i);
      }), t && i.updateInfo(t), i;
    }
    sendSyncState() {
      const e = Array.from(this.remoteParticipants.values()).reduce((i, s) => (i.push(...s.getTrackPublications()), i), []), t = this.localParticipant.getTrackPublications();
      this.engine.sendSyncState(e, t);
    }
    updateSubscriptions() {
      for (const e of this.remoteParticipants.values()) for (const t of e.videoTrackPublications.values()) t.isSubscribed && xu(t) && t.emitTrackUpdate();
    }
    getRemoteParticipantBySid(e) {
      const t = this.sidToIdentity.get(e);
      if (t) return this.remoteParticipants.get(t);
    }
    registerConnectionReconcile() {
      this.clearConnectionReconcile();
      let e = 0;
      this.connectionReconcileInterval = Ie.setInterval(() => {
        !this.engine || this.engine.isClosed || !this.engine.verifyTransport() ? (e++, this.log.warn("detected connection state mismatch", Object.assign(Object.assign({}, this.logContext), {
          numFailures: e,
          engine: this.engine ? {
            closed: this.engine.isClosed,
            transportsConnected: this.engine.verifyTransport()
          } : void 0
        })), e >= 3 && (this.recreateEngine(), this.handleDisconnect(this.options.stopLocalTrackOnUnpublish, rt.STATE_MISMATCH))) : e = 0;
      }, tp);
    }
    clearConnectionReconcile() {
      this.connectionReconcileInterval && Ie.clearInterval(this.connectionReconcileInterval);
    }
    setAndEmitConnectionState(e) {
      return e === this.state ? false : (this.state = e, this.emit(R.ConnectionStateChanged, this.state), true);
    }
    emitBufferedEvents() {
      this.bufferedEvents.forEach((e) => {
        let [t, i] = e;
        this.emit(t, ...i);
      }), this.bufferedEvents = [];
    }
    emitWhenConnected(e) {
      for (var t = arguments.length, i = new Array(t > 1 ? t - 1 : 0), s = 1; s < t; s++) i[s - 1] = arguments[s];
      if (this.state === ie.Reconnecting || this.isResuming || !this.engine || this.engine.pendingReconnect) this.bufferedEvents.push([
        e,
        i
      ]);
      else if (this.state === ie.Connected) return this.emit(e, ...i);
      return false;
    }
    simulateParticipants(e) {
      return p(this, void 0, void 0, function* () {
        var t, i, s, r;
        const o = Object.assign({
          audio: true,
          video: true,
          useRealTracks: false
        }, e.publish), a = Object.assign({
          count: 9,
          audio: false,
          video: true,
          aspectRatios: [
            1.66,
            1.7,
            1.3
          ]
        }, e.participants);
        if (this.handleDisconnect(), this.roomInfo = new On({
          sid: "RM_SIMULATED",
          name: "simulated-room",
          emptyTimeout: 0,
          maxParticipants: 0,
          creationTime: le.parse((/* @__PURE__ */ new Date()).getTime()),
          metadata: "",
          numParticipants: 1,
          numPublishers: 1,
          turnPassword: "",
          enabledCodecs: [],
          activeRecording: false
        }), this.localParticipant.updateInfo(new ii({
          identity: "simulated-local",
          name: "local-name"
        })), this.setupLocalParticipantEvents(), this.emit(R.SignalConnected), this.emit(R.Connected), this.setAndEmitConnectionState(ie.Connected), o.video) {
          const c = new Ns(C.Kind.Video, new hi({
            source: be.CAMERA,
            sid: Math.floor(Math.random() * 1e4).toString(),
            type: it.AUDIO,
            name: "video-dummy"
          }), new _i(o.useRealTracks && (!((t = window.navigator.mediaDevices) === null || t === void 0) && t.getUserMedia) ? (yield window.navigator.mediaDevices.getUserMedia({
            video: true
          })).getVideoTracks()[0] : Zr(160 * ((i = a.aspectRatios[0]) !== null && i !== void 0 ? i : 1), 160, true, true), void 0, false, {
            loggerName: this.options.loggerName,
            loggerContextCb: () => this.logContext
          }), {
            loggerName: this.options.loggerName,
            loggerContextCb: () => this.logContext
          });
          this.localParticipant.addTrackPublication(c), this.localParticipant.emit(O.LocalTrackPublished, c);
        }
        if (o.audio) {
          const c = new Ns(C.Kind.Audio, new hi({
            source: be.MICROPHONE,
            sid: Math.floor(Math.random() * 1e4).toString(),
            type: it.AUDIO
          }), new Pi(o.useRealTracks && (!((s = navigator.mediaDevices) === null || s === void 0) && s.getUserMedia) ? (yield navigator.mediaDevices.getUserMedia({
            audio: true
          })).getAudioTracks()[0] : Zn(), void 0, false, this.audioContext, {
            loggerName: this.options.loggerName,
            loggerContextCb: () => this.logContext
          }), {
            loggerName: this.options.loggerName,
            loggerContextCb: () => this.logContext
          });
          this.localParticipant.addTrackPublication(c), this.localParticipant.emit(O.LocalTrackPublished, c);
        }
        for (let c = 0; c < a.count - 1; c += 1) {
          let d = new ii({
            sid: Math.floor(Math.random() * 1e4).toString(),
            identity: "simulated-".concat(c),
            state: vi.ACTIVE,
            tracks: [],
            joinedAt: le.parse(Date.now())
          });
          const l = this.getOrCreateParticipant(d.identity, d);
          if (a.video) {
            const u = Zr(160 * ((r = a.aspectRatios[c % a.aspectRatios.length]) !== null && r !== void 0 ? r : 1), 160, false, true), h = new hi({
              source: be.CAMERA,
              sid: Math.floor(Math.random() * 1e4).toString(),
              type: it.AUDIO
            });
            l.addSubscribedMediaTrack(u, h.sid, new MediaStream([
              u
            ]), new RTCRtpReceiver()), d.tracks = [
              ...d.tracks,
              h
            ];
          }
          if (a.audio) {
            const u = Zn(), h = new hi({
              source: be.MICROPHONE,
              sid: Math.floor(Math.random() * 1e4).toString(),
              type: it.AUDIO
            });
            l.addSubscribedMediaTrack(u, h.sid, new MediaStream([
              u
            ]), new RTCRtpReceiver()), d.tracks = [
              ...d.tracks,
              h
            ];
          }
          l.updateInfo(d);
        }
      });
    }
    emit(e) {
      for (var t = arguments.length, i = new Array(t > 1 ? t - 1 : 0), s = 1; s < t; s++) i[s - 1] = arguments[s];
      if (e !== R.ActiveSpeakersChanged && e !== R.TranscriptionReceived) {
        const r = Ec(i).filter((o) => o !== void 0);
        (e === R.TrackSubscribed || e === R.TrackUnsubscribed) && this.log.trace("subscribe trace: ".concat(e), Object.assign(Object.assign({}, this.logContext), {
          event: e,
          args: r
        })), this.log.debug("room event ".concat(e), Object.assign(Object.assign({}, this.logContext), {
          event: e,
          args: r
        }));
      }
      return super.emit(e, ...i);
    }
  }
  Ii.cleanupRegistry = typeof FinalizationRegistry < "u" && new FinalizationRegistry((n) => {
    n();
  });
  function Ec(n) {
    return n.map((e) => {
      if (e) return Array.isArray(e) ? Ec(e) : typeof e == "object" ? "logContext" in e ? e.logContext : void 0 : e;
    });
  }
  var tt;
  (function(n) {
    n[n.IDLE = 0] = "IDLE", n[n.RUNNING = 1] = "RUNNING", n[n.SKIPPED = 2] = "SKIPPED", n[n.SUCCESS = 3] = "SUCCESS", n[n.FAILED = 4] = "FAILED";
  })(tt || (tt = {}));
  class Kt extends pt.EventEmitter {
    constructor(e, t) {
      let i = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
      super(), this.status = tt.IDLE, this.logs = [], this.options = {}, this.url = e, this.token = t, this.name = this.constructor.name, this.room = new Ii(i.roomOptions), this.connectOptions = i.connectOptions, this.options = i;
    }
    run(e) {
      return p(this, void 0, void 0, function* () {
        if (this.status !== tt.IDLE) throw Error("check is running already");
        this.setStatus(tt.RUNNING);
        try {
          yield this.perform();
        } catch (t) {
          t instanceof Error && (this.options.errorsAsWarnings ? this.appendWarning(t.message) : this.appendError(t.message));
        }
        return yield this.disconnect(), yield new Promise((t) => setTimeout(t, 500)), this.status !== tt.SKIPPED && this.setStatus(this.isSuccess() ? tt.SUCCESS : tt.FAILED), e && e(), this.getInfo();
      });
    }
    isSuccess() {
      return !this.logs.some((e) => e.level === "error");
    }
    connect(e) {
      return p(this, void 0, void 0, function* () {
        return this.room.state === ie.Connected ? this.room : (e || (e = this.url), yield this.room.connect(e, this.token, this.connectOptions), this.room);
      });
    }
    disconnect() {
      return p(this, void 0, void 0, function* () {
        this.room && this.room.state !== ie.Disconnected && (yield this.room.disconnect(), yield new Promise((e) => setTimeout(e, 500)));
      });
    }
    skip() {
      this.setStatus(tt.SKIPPED);
    }
    switchProtocol(e) {
      return p(this, void 0, void 0, function* () {
        let t = false, i = false;
        if (this.room.on(R.Reconnecting, () => {
          t = true;
        }), this.room.once(R.Reconnected, () => {
          i = true;
        }), this.room.simulateScenario("force-".concat(e)), yield new Promise((r) => setTimeout(r, 1e3)), !t) return;
        const s = Date.now() + 1e4;
        for (; Date.now() < s; ) {
          if (i) return;
          yield xe(100);
        }
        throw new Error("Could not reconnect using ".concat(e, " protocol after 10 seconds"));
      });
    }
    appendMessage(e) {
      this.logs.push({
        level: "info",
        message: e
      }), this.emit("update", this.getInfo());
    }
    appendWarning(e) {
      this.logs.push({
        level: "warning",
        message: e
      }), this.emit("update", this.getInfo());
    }
    appendError(e) {
      this.logs.push({
        level: "error",
        message: e
      }), this.emit("update", this.getInfo());
    }
    setStatus(e) {
      this.status = e, this.emit("update", this.getInfo());
    }
    get engine() {
      var e;
      return (e = this.room) === null || e === void 0 ? void 0 : e.engine;
    }
    getInfo() {
      return {
        logs: this.logs,
        name: this.name,
        status: this.status,
        description: this.description
      };
    }
  }
  class ip extends Kt {
    get description() {
      return "Cloud regions";
    }
    perform() {
      return p(this, void 0, void 0, function* () {
        const e = new ee(this.url, this.token);
        if (!e.isCloud()) {
          this.skip();
          return;
        }
        const t = [], i = /* @__PURE__ */ new Set();
        for (let r = 0; r < 3; r++) {
          const o = yield e.getNextBestRegionUrl();
          if (!o) break;
          if (i.has(o)) continue;
          i.add(o);
          const a = yield this.checkCloudRegion(o);
          this.appendMessage("".concat(a.region, " RTT: ").concat(a.rtt, "ms, duration: ").concat(a.duration, "ms")), t.push(a);
        }
        t.sort((r, o) => (r.duration - o.duration) * 0.5 + (r.rtt - o.rtt) * 0.5);
        const s = t[0];
        this.bestStats = s, this.appendMessage("best Cloud region: ".concat(s.region));
      });
    }
    getInfo() {
      const e = super.getInfo();
      return e.data = this.bestStats, e;
    }
    checkCloudRegion(e) {
      return p(this, void 0, void 0, function* () {
        var t, i;
        yield this.connect(e), this.options.protocol === "tcp" && (yield this.switchProtocol("tcp"));
        const s = (t = this.room.serverInfo) === null || t === void 0 ? void 0 : t.region;
        if (!s) throw new Error("Region not found");
        const r = yield this.room.localParticipant.streamText({
          topic: "test"
        }), o = 1e3, c = 1e6 / o, d = "A".repeat(o), l = Date.now();
        for (let v = 0; v < c; v++) yield r.write(d);
        yield r.close();
        const u = Date.now(), h = yield (i = this.room.engine.pcManager) === null || i === void 0 ? void 0 : i.publisher.getStats(), m = {
          region: s,
          rtt: 1e4,
          duration: u - l
        };
        return h == null ? void 0 : h.forEach((v) => {
          v.type === "candidate-pair" && v.nominated && (m.rtt = v.currentRoundTripTime * 1e3);
        }), yield this.disconnect(), m;
      });
    }
  }
  const cs = 1e4;
  class np extends Kt {
    get description() {
      return "Connection via UDP vs TCP";
    }
    perform() {
      return p(this, void 0, void 0, function* () {
        const e = yield this.checkConnectionProtocol("udp"), t = yield this.checkConnectionProtocol("tcp");
        this.bestStats = e, e.qualityLimitationDurations.bandwidth - t.qualityLimitationDurations.bandwidth > 0.5 || (e.packetsLost - t.packetsLost) / e.packetsSent > 0.01 ? (this.appendMessage("best connection quality via tcp"), this.bestStats = t) : this.appendMessage("best connection quality via udp");
        const i = this.bestStats;
        this.appendMessage("upstream bitrate: ".concat((i.bitrateTotal / i.count / 1e3 / 1e3).toFixed(2), " mbps")), this.appendMessage("RTT: ".concat((i.rttTotal / i.count * 1e3).toFixed(2), " ms")), this.appendMessage("jitter: ".concat((i.jitterTotal / i.count * 1e3).toFixed(2), " ms")), i.packetsLost > 0 && this.appendWarning("packets lost: ".concat((i.packetsLost / i.packetsSent * 100).toFixed(2), "%")), i.qualityLimitationDurations.bandwidth > 1 && this.appendWarning("bandwidth limited ".concat((i.qualityLimitationDurations.bandwidth / (cs / 1e3) * 100).toFixed(2), "%")), i.qualityLimitationDurations.cpu > 0 && this.appendWarning("cpu limited ".concat((i.qualityLimitationDurations.cpu / (cs / 1e3) * 100).toFixed(2), "%"));
      });
    }
    getInfo() {
      const e = super.getInfo();
      return e.data = this.bestStats, e;
    }
    checkConnectionProtocol(e) {
      return p(this, void 0, void 0, function* () {
        yield this.connect(), e === "tcp" ? yield this.switchProtocol("tcp") : yield this.switchProtocol("udp");
        const t = document.createElement("canvas");
        t.width = 1280, t.height = 720;
        const i = t.getContext("2d");
        if (!i) throw new Error("Could not get canvas context");
        let s = 0;
        const r = () => {
          s = (s + 1) % 360, i.fillStyle = "hsl(".concat(s, ", 100%, 50%)"), i.fillRect(0, 0, t.width, t.height), requestAnimationFrame(r);
        };
        r();
        const a = t.captureStream(30).getVideoTracks()[0], d = (yield this.room.localParticipant.publishTrack(a, {
          simulcast: false,
          degradationPreference: "maintain-resolution",
          videoEncoding: {
            maxBitrate: 2e6
          }
        })).track, l = {
          protocol: e,
          packetsLost: 0,
          packetsSent: 0,
          qualityLimitationDurations: {},
          rttTotal: 0,
          jitterTotal: 0,
          bitrateTotal: 0,
          count: 0
        }, u = setInterval(() => p(this, void 0, void 0, function* () {
          const h = yield d.getRTCStatsReport();
          h == null ? void 0 : h.forEach((m) => {
            m.type === "outbound-rtp" ? (l.packetsSent = m.packetsSent, l.qualityLimitationDurations = m.qualityLimitationDurations, l.bitrateTotal += m.targetBitrate, l.count++) : m.type === "remote-inbound-rtp" && (l.packetsLost = m.packetsLost, l.rttTotal += m.roundTripTime, l.jitterTotal += m.jitter);
          });
        }), 1e3);
        return yield new Promise((h) => setTimeout(h, cs)), clearInterval(u), a.stop(), t.remove(), yield this.disconnect(), l;
      });
    }
  }
  class sp extends Kt {
    get description() {
      return "Can publish audio";
    }
    perform() {
      return p(this, void 0, void 0, function* () {
        var e;
        const t = yield this.connect(), i = yield Qh();
        if (yield oc(i, 1e3)) throw new Error("unable to detect audio from microphone");
        this.appendMessage("detected audio from microphone"), t.localParticipant.publishTrack(i), yield new Promise((a) => setTimeout(a, 3e3));
        const r = yield (e = i.sender) === null || e === void 0 ? void 0 : e.getStats();
        if (!r) throw new Error("Could not get RTCStats");
        let o = 0;
        if (r.forEach((a) => {
          a.type === "outbound-rtp" && (a.kind === "audio" || !a.kind && a.mediaType === "audio") && (o = a.packetsSent);
        }), o === 0) throw new Error("Could not determine packets are sent");
        this.appendMessage("published ".concat(o, " audio packets"));
      });
    }
  }
  class rp extends Kt {
    get description() {
      return "Can publish video";
    }
    perform() {
      return p(this, void 0, void 0, function* () {
        var e;
        const t = yield this.connect(), i = yield $h();
        yield this.checkForVideo(i.mediaStreamTrack), t.localParticipant.publishTrack(i), yield new Promise((o) => setTimeout(o, 5e3));
        const s = yield (e = i.sender) === null || e === void 0 ? void 0 : e.getStats();
        if (!s) throw new Error("Could not get RTCStats");
        let r = 0;
        if (s.forEach((o) => {
          o.type === "outbound-rtp" && (o.kind === "video" || !o.kind && o.mediaType === "video") && (r += o.packetsSent);
        }), r === 0) throw new Error("Could not determine packets are sent");
        this.appendMessage("published ".concat(r, " video packets"));
      });
    }
    checkForVideo(e) {
      return p(this, void 0, void 0, function* () {
        const t = new MediaStream();
        t.addTrack(e.clone());
        const i = document.createElement("video");
        i.srcObject = t, i.muted = true, i.autoplay = true, i.playsInline = true, i.setAttribute("playsinline", "true"), document.body.appendChild(i), yield new Promise((s) => {
          i.onplay = () => {
            setTimeout(() => {
              var r, o, a, c;
              const d = document.createElement("canvas"), l = e.getSettings(), u = (o = (r = l.width) !== null && r !== void 0 ? r : i.videoWidth) !== null && o !== void 0 ? o : 1280, h = (c = (a = l.height) !== null && a !== void 0 ? a : i.videoHeight) !== null && c !== void 0 ? c : 720;
              d.width = u, d.height = h;
              const m = d.getContext("2d");
              m.drawImage(i, 0, 0);
              const g = m.getImageData(0, 0, d.width, d.height).data;
              let T = true;
              for (let S = 0; S < g.length; S += 4) if (g[S] !== 0 || g[S + 1] !== 0 || g[S + 2] !== 0) {
                T = false;
                break;
              }
              T ? this.appendError("camera appears to be producing only black frames") : this.appendMessage("received video frames"), s();
            }, 1e3);
          }, i.play();
        }), t.getTracks().forEach((s) => s.stop()), i.remove();
      });
    }
  }
  class ap extends Kt {
    get description() {
      return "Resuming connection after interruption";
    }
    perform() {
      return p(this, void 0, void 0, function* () {
        var e;
        const t = yield this.connect();
        let i = false, s = false, r;
        const o = new Promise((d) => {
          setTimeout(d, 5e3), r = d;
        }), a = () => {
          i = true;
        };
        t.on(R.SignalReconnecting, a).on(R.Reconnecting, a).on(R.Reconnected, () => {
          s = true, r(true);
        }), (e = t.engine.client.ws) === null || e === void 0 || e.close();
        const c = t.engine.client.onClose;
        if (c && c(""), yield o, i) {
          if (!s || t.state !== ie.Connected) throw this.appendWarning("reconnection is only possible in Redis-based configurations"), new Error("Not able to reconnect");
        } else throw new Error("Did not attempt to reconnect");
      });
    }
  }
  class op extends Kt {
    get description() {
      return "Can connect via TURN";
    }
    perform() {
      return p(this, void 0, void 0, function* () {
        var e, t, i;
        Ri(new URL(this.url)) && (this.appendMessage("Using region specific url"), this.url = (e = yield new ee(this.url, this.token).getNextBestRegionUrl()) !== null && e !== void 0 ? e : this.url);
        const s = new ir(), r = yield s.join(this.url, this.token, {
          autoSubscribe: true,
          maxRetries: 0,
          e2eeEnabled: false,
          websocketTimeout: 15e3
        }, void 0, true);
        let o = false, a = false, c = false;
        for (let d of r.iceServers) for (let l of d.urls) l.startsWith("turn:") ? (a = true, c = true) : l.startsWith("turns:") && (a = true, c = true, o = true), l.startsWith("stun:") && (c = true);
        c ? a && !o && this.appendWarning("TURN is configured server side, but TURN/TLS is unavailable.") : this.appendWarning("No STUN servers configured on server side."), yield s.close(), !((i = (t = this.connectOptions) === null || t === void 0 ? void 0 : t.rtcConfig) === null || i === void 0) && i.iceServers || a ? yield this.room.connect(this.url, this.token, {
          rtcConfig: {
            iceTransportPolicy: "relay"
          }
        }) : (this.appendWarning("No TURN servers configured."), this.skip(), yield new Promise((d) => setTimeout(d, 0)));
      });
    }
  }
  class cp extends Kt {
    get description() {
      return "Establishing WebRTC connection";
    }
    perform() {
      return p(this, void 0, void 0, function* () {
        let e = false, t = false;
        this.room.on(R.SignalConnected, () => {
          var i;
          const s = this.room.engine.client.onTrickle;
          this.room.engine.client.onTrickle = (r, o) => {
            if (r.candidate) {
              const a = new RTCIceCandidate(r);
              let c = "".concat(a.protocol, " ").concat(a.address, ":").concat(a.port, " ").concat(a.type);
              a.address && (dp(a.address) ? c += " (private)" : a.protocol === "tcp" && a.tcpType === "passive" ? (e = true, c += " (passive)") : a.protocol === "udp" && (t = true)), this.appendMessage(c);
            }
            s && s(r, o);
          }, !((i = this.room.engine.pcManager) === null || i === void 0) && i.subscriber && (this.room.engine.pcManager.subscriber.onIceCandidateError = (r) => {
            r instanceof RTCPeerConnectionIceErrorEvent && this.appendWarning("error with ICE candidate: ".concat(r.errorCode, " ").concat(r.errorText, " ").concat(r.url));
          });
        });
        try {
          yield this.connect(), H.info("now the room is connected");
        } catch (i) {
          throw this.appendWarning("ports need to be open on firewall in order to connect."), i;
        }
        e || this.appendWarning("Server is not configured for ICE/TCP"), t || this.appendWarning("No public IPv4 UDP candidates were found. Your server is likely not configured correctly");
      });
    }
  }
  function dp(n) {
    const e = n.split(".");
    if (e.length === 4) {
      if (e[0] === "10") return true;
      if (e[0] === "192" && e[1] === "168") return true;
      if (e[0] === "172") {
        const t = parseInt(e[1], 10);
        if (t >= 16 && t <= 31) return true;
      }
    }
    return false;
  }
  class lp extends Kt {
    get description() {
      return "Connecting to signal connection via WebSocket";
    }
    perform() {
      return p(this, void 0, void 0, function* () {
        var e, t, i;
        (this.url.startsWith("ws:") || this.url.startsWith("http:")) && this.appendWarning("Server is insecure, clients may block connections to it");
        let s = new ir(), r;
        try {
          r = yield s.join(this.url, this.token, {
            autoSubscribe: true,
            maxRetries: 0,
            e2eeEnabled: false,
            websocketTimeout: 15e3
          }, void 0, true);
        } catch (o) {
          if (Ri(new URL(this.url))) {
            this.appendMessage("Initial connection failed with error ".concat(o.message, ". Retrying with region fallback"));
            const c = yield new ee(this.url, this.token).getNextBestRegionUrl();
            c && (r = yield s.join(c, this.token, {
              autoSubscribe: true,
              maxRetries: 0,
              e2eeEnabled: false,
              websocketTimeout: 15e3
            }, void 0, true), this.appendMessage("Fallback to region worked. To avoid initial connections failing, ensure you're calling room.prepareConnection() ahead of time"));
          }
        }
        r ? (this.appendMessage("Connected to server, version ".concat(r.serverVersion, ".")), ((e = r.serverInfo) === null || e === void 0 ? void 0 : e.edition) === ao.Cloud && (!((t = r.serverInfo) === null || t === void 0) && t.region) && this.appendMessage("LiveKit Cloud: ".concat((i = r.serverInfo) === null || i === void 0 ? void 0 : i.region))) : this.appendError("Websocket connection could not be established"), yield s.close();
      });
    }
  }
  class Rm extends pt.EventEmitter {
    constructor(e, t) {
      let i = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
      super(), this.options = {}, this.checkResults = /* @__PURE__ */ new Map(), this.url = e, this.token = t, this.options = i;
    }
    getNextCheckId() {
      const e = this.checkResults.size;
      return this.checkResults.set(e, {
        logs: [],
        status: tt.IDLE,
        name: "",
        description: ""
      }), e;
    }
    updateCheck(e, t) {
      this.checkResults.set(e, t), this.emit("checkUpdate", e, t);
    }
    isSuccess() {
      return Array.from(this.checkResults.values()).every((e) => e.status !== tt.FAILED);
    }
    getResults() {
      return Array.from(this.checkResults.values());
    }
    createAndRunCheck(e) {
      return p(this, void 0, void 0, function* () {
        const t = this.getNextCheckId(), i = new e(this.url, this.token, this.options), s = (o) => {
          this.updateCheck(t, o);
        };
        i.on("update", s);
        const r = yield i.run();
        return i.off("update", s), r;
      });
    }
    checkWebsocket() {
      return p(this, void 0, void 0, function* () {
        return this.createAndRunCheck(lp);
      });
    }
    checkWebRTC() {
      return p(this, void 0, void 0, function* () {
        return this.createAndRunCheck(cp);
      });
    }
    checkTURN() {
      return p(this, void 0, void 0, function* () {
        return this.createAndRunCheck(op);
      });
    }
    checkReconnect() {
      return p(this, void 0, void 0, function* () {
        return this.createAndRunCheck(ap);
      });
    }
    checkPublishAudio() {
      return p(this, void 0, void 0, function* () {
        return this.createAndRunCheck(sp);
      });
    }
    checkPublishVideo() {
      return p(this, void 0, void 0, function* () {
        return this.createAndRunCheck(rp);
      });
    }
    checkConnectionProtocol() {
      return p(this, void 0, void 0, function* () {
        const e = yield this.createAndRunCheck(np);
        if (e.data && "protocol" in e.data) {
          const t = e.data;
          this.options.protocol = t.protocol;
        }
        return e;
      });
    }
    checkCloudRegion() {
      return p(this, void 0, void 0, function* () {
        return this.createAndRunCheck(ip);
      });
    }
  }
  function X(n, e, t) {
    return (e = hp(e)) in n ? Object.defineProperty(n, e, {
      value: t,
      enumerable: true,
      configurable: true,
      writable: true
    }) : n[e] = t, n;
  }
  function up(n, e) {
    if (typeof n != "object" || !n) return n;
    var t = n[Symbol.toPrimitive];
    if (t !== void 0) {
      var i = t.call(n, e);
      if (typeof i != "object") return i;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (e === "string" ? String : Number)(n);
  }
  function hp(n) {
    var e = up(n, "string");
    return typeof e == "symbol" ? e : e + "";
  }
  new TextEncoder();
  new TextDecoder();
  class Fe extends Error {
    constructor(e, t) {
      var i;
      super(e, t), X(this, "code", "ERR_JOSE_GENERIC"), this.name = this.constructor.name, (i = Error.captureStackTrace) === null || i === void 0 || i.call(Error, this, this.constructor);
    }
  }
  X(Fe, "code", "ERR_JOSE_GENERIC");
  class pp extends Fe {
    constructor(e, t) {
      let i = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : "unspecified", s = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : "unspecified";
      super(e, {
        cause: {
          claim: i,
          reason: s,
          payload: t
        }
      }), X(this, "code", "ERR_JWT_CLAIM_VALIDATION_FAILED"), X(this, "claim", void 0), X(this, "reason", void 0), X(this, "payload", void 0), this.claim = i, this.reason = s, this.payload = t;
    }
  }
  X(pp, "code", "ERR_JWT_CLAIM_VALIDATION_FAILED");
  class mp extends Fe {
    constructor(e, t) {
      let i = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : "unspecified", s = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : "unspecified";
      super(e, {
        cause: {
          claim: i,
          reason: s,
          payload: t
        }
      }), X(this, "code", "ERR_JWT_EXPIRED"), X(this, "claim", void 0), X(this, "reason", void 0), X(this, "payload", void 0), this.claim = i, this.reason = s, this.payload = t;
    }
  }
  X(mp, "code", "ERR_JWT_EXPIRED");
  class fp extends Fe {
    constructor() {
      super(...arguments), X(this, "code", "ERR_JOSE_ALG_NOT_ALLOWED");
    }
  }
  X(fp, "code", "ERR_JOSE_ALG_NOT_ALLOWED");
  class gp extends Fe {
    constructor() {
      super(...arguments), X(this, "code", "ERR_JOSE_NOT_SUPPORTED");
    }
  }
  X(gp, "code", "ERR_JOSE_NOT_SUPPORTED");
  class vp extends Fe {
    constructor() {
      let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "decryption operation failed", t = arguments.length > 1 ? arguments[1] : void 0;
      super(e, t), X(this, "code", "ERR_JWE_DECRYPTION_FAILED");
    }
  }
  X(vp, "code", "ERR_JWE_DECRYPTION_FAILED");
  class yp extends Fe {
    constructor() {
      super(...arguments), X(this, "code", "ERR_JWE_INVALID");
    }
  }
  X(yp, "code", "ERR_JWE_INVALID");
  class bp extends Fe {
    constructor() {
      super(...arguments), X(this, "code", "ERR_JWS_INVALID");
    }
  }
  X(bp, "code", "ERR_JWS_INVALID");
  class kp extends Fe {
    constructor() {
      super(...arguments), X(this, "code", "ERR_JWT_INVALID");
    }
  }
  X(kp, "code", "ERR_JWT_INVALID");
  class Sp extends Fe {
    constructor() {
      super(...arguments), X(this, "code", "ERR_JWK_INVALID");
    }
  }
  X(Sp, "code", "ERR_JWK_INVALID");
  class Tp extends Fe {
    constructor() {
      super(...arguments), X(this, "code", "ERR_JWKS_INVALID");
    }
  }
  X(Tp, "code", "ERR_JWKS_INVALID");
  class Cp extends Fe {
    constructor() {
      let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "no applicable key found in the JSON Web Key Set", t = arguments.length > 1 ? arguments[1] : void 0;
      super(e, t), X(this, "code", "ERR_JWKS_NO_MATCHING_KEY");
    }
  }
  X(Cp, "code", "ERR_JWKS_NO_MATCHING_KEY");
  class wp extends Fe {
    constructor() {
      let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "multiple matching keys found in the JSON Web Key Set", t = arguments.length > 1 ? arguments[1] : void 0;
      super(e, t), X(this, Symbol.asyncIterator, void 0), X(this, "code", "ERR_JWKS_MULTIPLE_MATCHING_KEYS");
    }
  }
  X(wp, "code", "ERR_JWKS_MULTIPLE_MATCHING_KEYS");
  class Ep extends Fe {
    constructor() {
      let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "request timed out", t = arguments.length > 1 ? arguments[1] : void 0;
      super(e, t), X(this, "code", "ERR_JWKS_TIMEOUT");
    }
  }
  X(Ep, "code", "ERR_JWKS_TIMEOUT");
  class Rp extends Fe {
    constructor() {
      let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "signature verification failed", t = arguments.length > 1 ? arguments[1] : void 0;
      super(e, t), X(this, "code", "ERR_JWS_SIGNATURE_VERIFICATION_FAILED");
    }
  }
  X(Rp, "code", "ERR_JWS_SIGNATURE_VERIFICATION_FAILED");
  var Ca;
  (function(n) {
    n[n.Reserved = 0] = "Reserved", n[n.TooLarge = 1] = "TooLarge";
  })(Ca || (Ca = {}));
  var wa;
  (function(n) {
    n[n.TooShort = 0] = "TooShort", n[n.HeaderOverrun = 1] = "HeaderOverrun", n[n.MissingExtWords = 2] = "MissingExtWords", n[n.UnsupportedVersion = 3] = "UnsupportedVersion", n[n.InvalidHandle = 4] = "InvalidHandle", n[n.MalformedExt = 5] = "MalformedExt";
  })(wa || (wa = {}));
  var Ea;
  (function(n) {
    n[n.TooSmallForHeader = 0] = "TooSmallForHeader", n[n.TooSmallForPayload = 1] = "TooSmallForPayload";
  })(Ea || (Ea = {}));
  var In;
  (function(n) {
    n[n.UserTimestamp = 2] = "UserTimestamp", n[n.E2ee = 1] = "E2ee";
  })(In || (In = {}));
  In.UserTimestamp;
  In.E2ee;
  var Ra;
  (function(n) {
    n[n.Start = 0] = "Start", n[n.Inter = 1] = "Inter", n[n.Final = 2] = "Final", n[n.Single = 3] = "Single";
  })(Ra || (Ra = {}));
  function Pp(n) {
    return new Worker("/assets/livekit-client.e2ee.worker-CgwyksIt.js", {
      type: "module",
      name: n == null ? void 0 : n.name
    });
  }
  function Et(n) {
    return new TextEncoder().encode(n);
  }
  function xi(n) {
    return new TextEncoder().encode(`voice:${n}`);
  }
  function ve(n) {
    let e = "";
    for (let t = 0; t < n.length; t++) e += String.fromCharCode(n[t]);
    return btoa(e);
  }
  function Bn(n) {
    const e = atob(n), t = new Uint8Array(e.length);
    for (let i = 0; i < e.length; i++) t[i] = e.charCodeAt(i);
    return t;
  }
  function Me(n) {
    const e = n.credential;
    if (!e) throw new Error("[mlsGroup] No credential available - run uploadKeyPackagesAfterAuth first");
    return {
      sigPriv: e.signingPrivateKey,
      sigPub: e.signingPublicKey,
      credBytes: e.credentialBytes
    };
  }
  async function lr(n, e, t, i, s) {
    const { db: r, mlsStore: o, hushCrypto: a } = n;
    await o.preloadGroupState(r);
    const c = await a.mergePendingCommit(e, t, i, s);
    return await o.flushStorageCache(r), c;
  }
  function _p(n) {
    const e = String((n == null ? void 0 : n.message) ?? n);
    return e.includes("UseAfterEviction") || e.includes("Group not found");
  }
  async function Pa(n, e, t, i, s, r) {
    const { db: o, mlsStore: a, hushCrypto: c } = n;
    await a.preloadGroupState(o);
    const d = await c.createMessage(e, t, i, s, new TextEncoder().encode(r));
    return await a.flushStorageCache(o), d;
  }
  Rc = async function(n, e) {
    const { db: t, token: i, mlsStore: s, hushCrypto: r, api: o } = n, { sigPriv: a, sigPub: c, credBytes: d } = Me(n), l = Et(e);
    await s.preloadGroupState(t);
    const u = await r.createGroup(l, a, c, d);
    if (await s.flushStorageCache(t), !u.groupInfoBytes || u.groupInfoBytes.length === 0) throw new Error(`[mlsGroup] createGroup returned empty groupInfoBytes for channel ${e} (type=${typeof u.groupInfoBytes}, epoch=${u.epoch})`);
    return await o.putMLSGroupInfo(i, e, ve(u.groupInfoBytes), u.epoch), await s.setGroupEpoch(t, e, u.epoch), {
      groupInfoBytes: u.groupInfoBytes,
      epoch: u.epoch
    };
  };
  async function Zi(n, e) {
    const { db: t, token: i, mlsStore: s, hushCrypto: r, api: o } = n, { sigPriv: a, sigPub: c, credBytes: d } = Me(n), l = Et(e), u = await o.getMLSGroupInfo(i, e);
    if (!(u == null ? void 0 : u.groupInfo)) return;
    const h = Number(u.epoch ?? 0) + 1, m = Bn(u.groupInfo);
    await s.preloadGroupState(t);
    const v = await r.joinGroupExternal(m, a, c, d);
    await s.flushStorageCache(t);
    const g = await r.exportGroupInfoBytes(l, a, c, d);
    await s.flushStorageCache(t), await o.postMLSCommit(i, e, ve(v.commitBytes), ve(g.groupInfoBytes), h);
    const T = await lr(n, l, a, c, d);
    await o.putMLSGroupInfo(i, e, ve(T.groupInfoBytes), T.epoch), await s.setGroupEpoch(t, e, T.epoch);
  }
  xn = async function(n, e) {
    var _a2;
    const { db: t, token: i, mlsStore: s, api: r } = n;
    if (await s.getGroupEpoch(t, e) != null) return;
    if ((_a2 = await r.getMLSGroupInfo(i, e)) == null ? void 0 : _a2.groupInfo) await Zi(n, e);
    else try {
      await Rc(n, e);
    } catch (c) {
      const d = String((c == null ? void 0 : c.message) ?? c);
      if (d.includes("GroupAlreadyExists") || d.includes("already exists")) return;
      throw c;
    }
  };
  async function Ip(n, e) {
    for (const t of e) try {
      await Zi(n, t);
    } catch (i) {
      console.warn("[mlsGroup] Failed to join channel group:", t, i);
    }
  }
  async function xp(n, e, t) {
    const { db: i, token: s, mlsStore: r, hushCrypto: o, api: a } = n, { sigPriv: c, sigPub: d, credBytes: l } = Me(n), u = Et(e), h = JSON.stringify([
      ve(t)
    ]);
    await r.preloadGroupState(i);
    const m = await o.addMembers(u, c, d, l, h);
    return await r.flushStorageCache(i), await a.postMLSCommit(s, e, ve(m.commitBytes), ve(m.groupInfoBytes), m.epoch), await r.setGroupEpoch(i, e, m.epoch), {
      welcomeBytes: m.welcomeBytes
    };
  }
  Mp = async function(n, e, t) {
    const { db: i, token: s, mlsStore: r, hushCrypto: o, api: a } = n, { sigPriv: c, sigPub: d, credBytes: l } = Me(n), u = Et(e), h = JSON.stringify([
      t
    ]);
    await r.preloadGroupState(i);
    const m = await o.removeMembers(u, c, d, l, h);
    await r.flushStorageCache(i), await a.postMLSCommit(s, e, ve(m.commitBytes), ve(m.groupInfoBytes), m.epoch), await r.setGroupEpoch(i, e, m.epoch);
  };
  async function Op(n, e, t) {
    const { db: i, mlsStore: s, hushCrypto: r } = n, { sigPriv: o, sigPub: a, credBytes: c } = Me(n), d = Et(e), l = crypto.randomUUID();
    await s.setLocalPlaintext(i, l, {
      plaintext: t,
      timestamp: Date.now()
    }), await s.getGroupEpoch(i, e) == null ? await xn(n, e) : await _c(n, e);
    try {
      return {
        messageBytes: (await Pa(n, d, o, a, c, t)).messageBytes,
        localId: l
      };
    } catch (h) {
      if (!_p(h)) throw h;
      return console.warn("[mlsGroup] createMessage failed, re-joining channel group", {
        channelId: e,
        reason: String((h == null ? void 0 : h.message) ?? h)
      }), await s.deleteGroupEpoch(i, e), await xn(n, e), {
        messageBytes: (await Pa(n, d, o, a, c, t)).messageBytes,
        localId: l
      };
    }
  }
  async function Dp(n, e, t) {
    const { db: i, mlsStore: s, hushCrypto: r } = n, { sigPriv: o, sigPub: a, credBytes: c } = Me(n), d = Et(e);
    await s.getGroupEpoch(i, e) == null && await xn(n, e), await s.preloadGroupState(i);
    const u = await r.processMessage(d, o, a, c, t);
    return await s.flushStorageCache(i), u.type === "application" && u.plaintext != null ? {
      plaintext: new TextDecoder().decode(u.plaintext),
      senderIdentity: u.senderIdentity,
      type: u.type,
      epoch: u.epoch
    } : (u.type === "commit" && await s.setGroupEpoch(i, e, u.epoch), {
      plaintext: null,
      type: u.type,
      epoch: u.epoch
    });
  }
  Pc = async function(n, e, t) {
    const { db: i, mlsStore: s, hushCrypto: r } = n, { sigPriv: o, sigPub: a, credBytes: c } = Me(n), d = Et(e);
    await s.preloadGroupState(i);
    const l = await r.processMessage(d, o, a, c, t);
    await s.flushStorageCache(i), l.epoch != null && await s.setGroupEpoch(i, e, l.epoch);
  };
  _c = async function(n, e) {
    const { db: t, token: i, mlsStore: s, api: r } = n, o = await s.getGroupEpoch(t, e) ?? 0, { commits: a } = await r.getMLSCommitsSinceEpoch(i, e, o);
    if (a == null ? void 0 : a.length) {
      if (a.length >= 1e3) {
        console.warn("[mlsGroup] Epoch gap too large, re-joining group for channel", e), await Zi(n, e);
        return;
      }
      for (const c of a) try {
        await Pc(n, e, Bn(c.commitBytes));
      } catch (d) {
        console.warn("[mlsGroup] Failed to process catchup commit at epoch", c.epoch, d), await Zi(n, e);
        return;
      }
    }
  };
  async function Ap(n, e) {
    const { db: t, mlsStore: i, hushCrypto: s, wsClient: r } = n, { sigPriv: o, sigPub: a, credBytes: c } = Me(n), d = Et(e);
    try {
      await i.preloadGroupState(t);
      const l = await s.leaveGroup(d, o, a, c);
      await i.flushStorageCache(t), r && r.send("mls.leave_proposal", {
        channel_id: e,
        proposal_bytes: ve(l.proposalBytes)
      });
    } catch (l) {
      console.warn("[mlsGroup] leaveGroup WASM failed (continuing with local cleanup):", l);
    }
    await i.deleteGroupEpoch(t, e);
  }
  Np = async function(n, e) {
    const { db: t, mlsStore: i } = n;
    for (const s of e) try {
      await i.deleteGroupEpoch(t, s);
    } catch (r) {
      console.warn("[mlsGroup] Failed to delete group epoch for channel", s, r);
    }
  };
  Lp = async function(n, e) {
    const { db: t, token: i, mlsStore: s, hushCrypto: r, api: o } = n, { sigPriv: a, sigPub: c, credBytes: d } = Me(n), l = Et(e);
    await s.preloadGroupState(t);
    const u = await r.selfUpdate(l, a, c, d);
    await s.flushStorageCache(t), await o.postMLSCommit(i, e, ve(u.commitBytes), ve(u.groupInfoBytes), u.epoch), await s.preloadGroupState(t);
    const h = await r.mergePendingCommit(l, a, c, d);
    await s.flushStorageCache(t), await s.setGroupEpoch(t, e, h.epoch);
  };
  function Vn(n) {
    return new TextEncoder().encode(n);
  }
  async function Up(n, e) {
    const { db: t, token: i, mlsStore: s, hushCrypto: r, api: o } = n, { sigPriv: a, sigPub: c, credBytes: d } = Me(n), l = Vn(e);
    await s.preloadGroupState(t);
    const u = await r.createGroup(l, a, c, d);
    if (await s.flushStorageCache(t), !u.groupInfoBytes || u.groupInfoBytes.length === 0) throw new Error(`[mlsGroup] createGroup returned empty groupInfoBytes for guild ${e} (type=${typeof u.groupInfoBytes}, epoch=${u.epoch})`);
    return await o.putGuildMetadataGroupInfo(i, e, ve(u.groupInfoBytes), u.epoch), await s.setGroupEpoch(t, `guild-meta:${e}`, u.epoch), {
      groupInfoBytes: u.groupInfoBytes,
      epoch: u.epoch
    };
  }
  async function jp(n, e) {
    const { db: t, token: i, mlsStore: s, hushCrypto: r, api: o } = n, { sigPriv: a, sigPub: c, credBytes: d } = Me(n), l = Vn(e), u = await o.getGuildMetadataGroupInfo(i, e);
    if (!(u == null ? void 0 : u.groupInfo)) return;
    const h = Number(u.epoch ?? 0) + 1, m = Bn(u.groupInfo);
    await s.preloadGroupState(t), await r.joinGroupExternal(m, a, c, d), await s.flushStorageCache(t);
    const v = await r.exportGroupInfoBytes(l, a, c, d);
    await s.flushStorageCache(t), await o.putGuildMetadataGroupInfo(i, e, ve(v.groupInfoBytes), h);
    const g = await lr(n, l, a, c, d);
    await o.putGuildMetadataGroupInfo(i, e, ve(g.groupInfoBytes), g.epoch), await s.setGroupEpoch(t, `guild-meta:${e}`, g.epoch);
  }
  Fp = async function(n, e) {
    const { db: t, mlsStore: i, hushCrypto: s } = n, { sigPriv: r, sigPub: o, credBytes: a } = Me(n), c = Vn(e);
    await i.preloadGroupState(t);
    const d = await s.exportMetadataKey(c, r, o, a);
    return {
      metadataKeyBytes: d.metadataKeyBytes,
      epoch: d.epoch
    };
  };
  async function Bp(n, e) {
    const { db: t, mlsStore: i } = n;
    await i.deleteGroupEpoch(t, `guild-meta:${e}`);
  }
  async function ur(n, e) {
    const { db: t, token: i, mlsStore: s, hushCrypto: r, api: o } = n, { sigPriv: a, sigPub: c, credBytes: d } = Me(n), l = xi(e);
    await s.preloadGroupState(t);
    const u = await r.createGroup(l, a, c, d);
    if (await s.flushStorageCache(t), !u.groupInfoBytes || u.groupInfoBytes.length === 0) throw new Error(`[mlsGroup] createGroup returned empty groupInfoBytes for voice:${e} (type=${typeof u.groupInfoBytes}, epoch=${u.epoch})`);
    return await o.putMLSVoiceGroupInfo(i, e, ve(u.groupInfoBytes), u.epoch), await s.setGroupEpoch(t, `voice:${e}`, u.epoch), {
      epoch: u.epoch
    };
  }
  async function Ic(n, e) {
    const { db: t, token: i, mlsStore: s, hushCrypto: r, api: o } = n, { sigPriv: a, sigPub: c, credBytes: d } = Me(n), l = xi(e), u = await o.getMLSVoiceGroupInfo(i, e);
    if (!(u == null ? void 0 : u.groupInfo)) return ur(n, e);
    const h = Number(u.epoch ?? 0) + 1, m = Bn(u.groupInfo);
    await s.preloadGroupState(t);
    const v = await r.joinGroupExternal(m, a, c, d);
    await s.flushStorageCache(t), await o.postMLSVoiceCommit(i, e, ve(v.commitBytes), h);
    const g = await lr(n, l, a, c, d);
    return await o.putMLSVoiceGroupInfo(i, e, ve(g.groupInfoBytes), g.epoch), await s.setGroupEpoch(t, `voice:${e}`, g.epoch), {
      epoch: g.epoch
    };
  }
  async function qi(n, e) {
    const { db: t, mlsStore: i, hushCrypto: s } = n, { sigPriv: r, sigPub: o, credBytes: a } = Me(n), c = xi(e);
    await i.preloadGroupState(t);
    const d = await s.exportVoiceFrameKey(c, r, o, a);
    return {
      frameKeyBytes: d.frameKeyBytes,
      epoch: d.epoch
    };
  }
  async function xc(n, e, t) {
    const { db: i, mlsStore: s, hushCrypto: r } = n, { sigPriv: o, sigPub: a, credBytes: c } = Me(n), d = xi(e);
    await s.preloadGroupState(i);
    const l = await r.processMessage(d, o, a, c, t);
    return await s.flushStorageCache(i), await s.setGroupEpoch(i, `voice:${e}`, l.epoch), {
      type: l.type,
      epoch: l.epoch
    };
  }
  async function Mc(n, e) {
    const { db: t, token: i, mlsStore: s, hushCrypto: r, api: o } = n, { sigPriv: a, sigPub: c, credBytes: d } = Me(n), l = xi(e);
    await s.preloadGroupState(t);
    const u = await r.selfUpdate(l, a, c, d);
    await s.flushStorageCache(t), await o.postMLSVoiceCommit(i, e, ve(u.commitBytes), u.epoch, ve(u.groupInfoBytes)), await s.preloadGroupState(t);
    const h = await r.mergePendingCommit(l, a, c, d);
    return await s.flushStorageCache(t), await o.putMLSVoiceGroupInfo(i, e, ve(h.groupInfoBytes), h.epoch), await s.setGroupEpoch(t, `voice:${e}`, h.epoch), {
      epoch: h.epoch
    };
  }
  async function bn(n, e) {
    const { db: t, mlsStore: i } = n;
    await i.deleteGroupEpoch(t, `voice:${e}`);
  }
  const Vp = Object.freeze(Object.defineProperty({
    __proto__: null,
    addMemberToChannel: xp,
    catchupCommits: _c,
    createChannelGroup: Rc,
    createGuildMetadataGroup: Up,
    createVoiceGroup: ur,
    decryptMessage: Dp,
    destroyVoiceGroup: bn,
    encryptMessage: Op,
    exportGuildMetadataKey: Fp,
    exportVoiceFrameKey: qi,
    guildMetadataIdToBytes: Vn,
    joinAllChannelGroups: Ip,
    joinChannelGroup: Zi,
    joinGuildMetadataGroup: jp,
    joinOrCreateChannelGroup: xn,
    joinVoiceGroup: Ic,
    leaveAllChannelGroups: Np,
    leaveChannelGroup: Ap,
    leaveGuildMetadataGroup: Bp,
    performSelfUpdate: Lp,
    performVoiceSelfUpdate: Mc,
    processCommit: Pc,
    processVoiceCommit: xc,
    removeMemberFromChannel: Mp,
    voiceChannelIdToBytes: xi
  }, Symbol.toStringTag, {
    value: "Module"
  }));
  class _a {
    constructor(e) {
      __publicField(this, "profile");
      __publicField(this, "rawStream");
      __publicField(this, "processedTrack");
      __publicField(this, "audioContext");
      __publicField(this, "noiseGateNode");
      __publicField(this, "_sourceNode");
      __publicField(this, "_destinationNode");
      __publicField(this, "_tornDown", false);
      this.profile = e.profile, this.rawStream = e.rawStream, this.processedTrack = e.processedTrack, this.audioContext = e.audioContext, this.noiseGateNode = e.noiseGateNode, this._sourceNode = e.sourceNode, this._destinationNode = e.destinationNode;
    }
    get isTornDown() {
      return this._tornDown;
    }
    get usesProcessingPipeline() {
      return this.audioContext !== null;
    }
    async teardown() {
      if (!this._tornDown) {
        if (this._tornDown = true, this.noiseGateNode) try {
          this.noiseGateNode.disconnect();
        } catch {
        }
        if (this._sourceNode) try {
          this._sourceNode.disconnect();
        } catch {
        }
        if (this._destinationNode) try {
          this._destinationNode.disconnect();
        } catch {
        }
        for (const e of this.rawStream.getTracks()) e.stop();
        if (this.processedTrack !== this.rawStream.getAudioTracks()[0] && this.processedTrack.stop(), this.audioContext && this.audioContext.state !== "closed") try {
          await this.audioContext.close();
        } catch {
        }
      }
    }
  }
  function qp(n, e) {
    const t = {
      echoCancellation: n.browserDsp,
      noiseSuppression: n.browserDsp,
      autoGainControl: n.browserDsp,
      channelCount: 1
    };
    return e && (t.deviceId = {
      exact: e
    }), t;
  }
  const Gp = {
    noiseGateEnabled: true,
    noiseGateThresholdDb: -50,
    echoCancellation: false
  };
  function Wp() {
    return {
      create: (n) => new AudioContext(n)
    };
  }
  class Kp {
    constructor(e = {}) {
      __publicField(this, "_state", "idle");
      __publicField(this, "_session", null);
      __publicField(this, "_publishedHandle", null);
      __publicField(this, "_engine");
      __publicField(this, "_mediaDevices");
      __publicField(this, "_audioContextFactory");
      __publicField(this, "_noiseGateWorkletUrl");
      __publicField(this, "_filterSettings");
      this._engine = e.engine, this._mediaDevices = e.mediaDevices ?? navigator.mediaDevices, this._audioContextFactory = e.audioContextFactory ?? Wp(), this._noiseGateWorkletUrl = e.noiseGateWorkletUrl, this._filterSettings = e.initialFilterSettings ?? {
        ...Gp
      };
    }
    get state() {
      return this._state;
    }
    get session() {
      return this._session;
    }
    get isLive() {
      return this._state === "live";
    }
    async acquire(e, t) {
      var _a2, _b;
      if (this._session) throw new Error("CaptureOrchestrator: session already active. Call teardown() first.");
      this._state = "acquiring", (_a2 = this._engine) == null ? void 0 : _a2.setMicPending();
      let i = null;
      try {
        const s = qp(e, t);
        i = await this._mediaDevices.getUserMedia({
          audio: s
        });
        let r;
        return e.useRawTrack ? r = this._buildRawSession(e, i) : r = await this._buildPipelineSession(e, i), this._session = r, r;
      } catch (s) {
        if (i) for (const r of i.getTracks()) r.stop();
        throw this._state = "idle", (_b = this._engine) == null ? void 0 : _b.setMicFailed(s instanceof Error ? s.message : "Capture acquisition failed", false), s;
      }
    }
    async publishTo(e) {
      var _a2, _b;
      if (!this._session) throw new Error("CaptureOrchestrator: no session to publish. Call acquire() first.");
      if (this._state === "live") throw new Error("CaptureOrchestrator: already published.");
      this._state = "publishing";
      try {
        const t = await e.publishTrack(this._session.processedTrack, {
          source: "microphone"
        });
        this._publishedHandle = t, this._state = "live", (_a2 = this._engine) == null ? void 0 : _a2.setMicApplied(true);
      } catch (t) {
        throw this._state = "acquiring", (_b = this._engine) == null ? void 0 : _b.setMicFailed(t instanceof Error ? t.message : "Publish failed", false), t;
      }
    }
    async mute() {
      if (!this._publishedHandle) throw new Error("CaptureOrchestrator: no published track to mute.");
      await this._publishedHandle.mute();
    }
    async unmute() {
      if (!this._publishedHandle) throw new Error("CaptureOrchestrator: no published track to unmute.");
      await this._publishedHandle.unmute();
    }
    async unpublish(e) {
      var _a2;
      this._state = "tearing-down";
      try {
        this._publishedHandle && (this._publishedHandle.stop(), await e.unpublishTrack(this._publishedHandle));
      } catch {
      }
      await this._teardownSession(), (_a2 = this._engine) == null ? void 0 : _a2.setMicApplied(false);
    }
    async teardown() {
      this._state = "tearing-down", await this._teardownSession();
    }
    updateFilterSettings(e) {
      var _a2;
      this._filterSettings = {
        ...this._filterSettings,
        ...e
      };
      const t = (_a2 = this._session) == null ? void 0 : _a2.noiseGateNode;
      t && t.port.postMessage({
        type: "updateParams",
        enabled: this._filterSettings.noiseGateEnabled,
        threshold: this._filterSettings.noiseGateThresholdDb
      });
    }
    _buildRawSession(e, t) {
      const i = t.getAudioTracks()[0];
      return new _a({
        profile: e,
        rawStream: t,
        processedTrack: i,
        audioContext: null,
        noiseGateNode: null,
        sourceNode: null,
        destinationNode: null
      });
    }
    async _buildPipelineSession(e, t) {
      const i = this._audioContextFactory.create({
        sampleRate: 48e3
      }), s = i.createMediaStreamSource(t), r = i.createMediaStreamDestination();
      r.channelCount = 1;
      let o = null, a = s;
      if (this._noiseGateWorkletUrl && typeof i.audioWorklet < "u") try {
        await i.audioWorklet.addModule(this._noiseGateWorkletUrl), o = new AudioWorkletNode(i, "noise-gate-processor"), s.connect(o), a = o, o.port.postMessage({
          type: "updateParams",
          enabled: this._filterSettings.noiseGateEnabled,
          threshold: this._filterSettings.noiseGateThresholdDb
        });
      } catch {
        a = s;
      }
      a.connect(r), i.state === "suspended" && await i.resume();
      const c = r.stream.getAudioTracks()[0];
      return new _a({
        profile: e,
        rawStream: t,
        processedTrack: c,
        audioContext: i,
        noiseGateNode: o,
        sourceNode: s,
        destinationNode: r
      });
    }
    diagnose(e) {
      if (!this._session) return null;
      const t = this._session.processedTrack, i = this._session.profile;
      return Ma(async () => {
        const { measureCaptureLevel: s } = await import("./measureCaptureLevel-D8ZmpDSy.js");
        return {
          measureCaptureLevel: s
        };
      }, []).then(({ measureCaptureLevel: s }) => {
        const r = `[capture-diag] mode=${i.mode}`, o = s(t, {
          durationMs: (e == null ? void 0 : e.durationMs) ?? 5e3,
          intervalMs: (e == null ? void 0 : e.intervalMs) ?? 200,
          onSample: (a) => {
            (e == null ? void 0 : e.onSample) ? e.onSample(a) : console.log(`${r} t=${a.timestampMs}ms rms=${a.rmsDbfs.toFixed(1)}dBFS peak=${a.peakDbfs.toFixed(1)}dBFS`);
          }
        });
        this._diagStop = o;
      }), () => {
        const s = this._diagStop;
        s == null ? void 0 : s();
      };
    }
    async _teardownSession() {
      this._session && (await this._session.teardown(), this._session = null), this._publishedHandle = null, this._state = "idle";
    }
  }
  class Hp {
    constructor(e) {
      __publicField(this, "_localTrack");
      this._localTrack = e;
    }
    async mute() {
      await this._localTrack.mute();
    }
    async unmute() {
      await this._localTrack.unmute();
    }
    stop() {
      this._localTrack.stop();
    }
  }
  class Jp {
    constructor(e, t, i) {
      __publicField(this, "_participant");
      __publicField(this, "_tracksRef");
      __publicField(this, "_scheduleUpdate");
      this._participant = e, this._tracksRef = t, this._scheduleUpdate = i;
    }
    async publishTrack(e, t) {
      const i = new Pi(e);
      await this._participant.publishTrack(i, {
        source: C.Source.Microphone
      });
      const s = i.sid;
      return this._tracksRef.current.set(s, {
        track: i,
        source: Ct.MIC
      }), this._scheduleUpdate(), new Hp(i);
    }
    async unpublishTrack(e) {
      const i = e._localTrack;
      await this._participant.unpublishTrack(i), i.sid && this._tracksRef.current.delete(i.sid), this._scheduleUpdate();
    }
  }
  const zp = {
    "desktop-standard": {
      mode: "desktop-standard",
      browserDsp: false,
      hushProcessing: true,
      useRawTrack: false,
      localMonitoring: true,
      echoCanConfigurable: true
    },
    "mobile-web-standard": {
      mode: "mobile-web-standard",
      browserDsp: true,
      hushProcessing: false,
      useRawTrack: true,
      localMonitoring: false,
      echoCanConfigurable: false
    },
    "low-latency": {
      mode: "low-latency",
      browserDsp: false,
      hushProcessing: false,
      useRawTrack: true,
      localMonitoring: false,
      echoCanConfigurable: false
    },
    "local-monitor": {
      mode: "local-monitor",
      browserDsp: false,
      hushProcessing: true,
      useRawTrack: false,
      localMonitoring: true,
      echoCanConfigurable: true
    }
  };
  function $p(n) {
    return n.isLocalMonitor ? "local-monitor" : n.isLowLatency ? "low-latency" : n.isMobileWebAudio ? "mobile-web-standard" : "desktop-standard";
  }
  const Qp = /* @__PURE__ */ new Set([
    "iPhone",
    "iPad",
    "Android"
  ]);
  function Yp(n) {
    return typeof navigator < "u" ? navigator.userAgent : "";
  }
  function Xp(n) {
    const e = Yp();
    return e ? Qp.has(Wc(e)) : false;
  }
  function Zp(n, e, t, i) {
    n.on(R.TrackSubscribed, (s, r, o) => {
      e.remoteTracksRef.current.set(s.sid, {
        track: s,
        participant: o,
        kind: s.kind,
        source: r.source
      }), t();
    }), n.on(R.TrackUnsubscribed, (s, r, o) => {
      e.remoteTracksRef.current.delete(s.sid), t();
    }), n.on(R.TrackPublished, (s, r) => {
      if (s.source === C.Source.ScreenShare && s.kind === C.Kind.Video) {
        e.availableScreensRef.current.set(s.trackSid, {
          trackSid: s.trackSid,
          participantId: r.identity,
          participantName: r.name || r.identity,
          kind: s.kind,
          source: s.source,
          publication: s
        }), i();
        return;
      }
      s.source !== C.Source.ScreenShareAudio && s.setSubscribed(true);
    }), n.on(R.TrackUnpublished, (s, r) => {
      s.source === C.Source.ScreenShare && (e.availableScreensRef.current.delete(s.trackSid), e.watchedScreensRef.current.delete(s.trackSid), i()), e.remoteTracksRef.current.delete(s.trackSid), t();
    });
  }
  async function Oc(n, e, t = {}) {
    const i = t.qualityKey ?? ds, s = ti[i], r = await navigator.mediaDevices.getDisplayMedia({
      video: {
        cursor: "always",
        frameRate: {
          ideal: s.frameRate
        }
      },
      audio: {
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false
      }
    }), o = r.getVideoTracks()[0], a = r.getAudioTracks()[0];
    if (!o || o.readyState !== "live") return r.getTracks().forEach((l) => l.stop()), null;
    s.frameRate >= Nt && typeof o.contentHint < "u" && (o.contentHint = "motion");
    const c = s.frameRate >= Nt ? {
      ideal: s.frameRate,
      min: Nt
    } : {
      ideal: s.frameRate
    };
    if (s.width && s.height) try {
      await o.applyConstraints({
        width: {
          ideal: s.width,
          min: s.width
        },
        height: {
          ideal: s.height,
          min: s.height
        },
        frameRate: c
      });
    } catch (l) {
      console.warn("[livekit] Could not apply track constraints:", l);
    }
    else if (s.frameRate >= Nt) try {
      await o.applyConstraints({
        frameRate: c
      });
    } catch (l) {
      console.warn("[livekit] Could not apply frameRate constraints:", l);
    }
    const d = new _i(o);
    if (await n.localParticipant.publishTrack(d, {
      source: C.Source.ScreenShare,
      screenShareEncoding: {
        maxBitrate: s.bitrate,
        maxFramerate: s.frameRate,
        ...s.frameRate >= Nt && {
          priority: "high"
        }
      },
      simulcast: false,
      degradationPreference: "maintain-resolution"
    }), e.localTracksRef.current.set(d.sid, {
      track: d,
      source: Ct.SCREEN
    }), t.onTrackEnded && o.addEventListener("ended", t.onTrackEnded), a && a.readyState === "live") try {
      const l = new Pi(a);
      await n.localParticipant.publishTrack(l, {
        source: C.Source.ScreenShareAudio
      }), e.localTracksRef.current.set(l.sid, {
        track: l,
        source: Ct.SCREEN_AUDIO
      });
    } catch (l) {
      console.warn("[livekit] Screen audio publish failed (non-fatal):", l == null ? void 0 : l.message);
    }
    return r;
  }
  async function Dc(n, e) {
    for (const [t, i] of e.localTracksRef.current.entries()) (i.source === Ct.SCREEN || i.source === Ct.SCREEN_AUDIO) && (i.track.stop(), await n.localParticipant.unpublishTrack(i.track), e.localTracksRef.current.delete(t));
  }
  async function em(n, e, t, i) {
    const s = ti[t], r = s.frameRate >= Nt ? {
      ideal: s.frameRate,
      min: Nt
    } : {
      ideal: s.frameRate
    }, o = Array.from(e.localTracksRef.current.entries()).find(([, l]) => l.source === Ct.SCREEN);
    if (!o) throw new Error("No active screen share");
    const [, a] = o, c = await navigator.mediaDevices.getDisplayMedia({
      video: {
        cursor: "always",
        frameRate: {
          ideal: s.frameRate
        }
      },
      audio: {
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false
      }
    }), d = c.getVideoTracks()[0];
    if (s.frameRate >= Nt && typeof d.contentHint < "u" && (d.contentHint = "motion"), s.width && s.height) try {
      await d.applyConstraints({
        width: {
          ideal: s.width,
          min: s.width
        },
        height: {
          ideal: s.height,
          min: s.height
        },
        frameRate: r
      });
    } catch (l) {
      console.warn("[livekit] Could not apply track constraints:", l);
    }
    else try {
      await d.applyConstraints({
        frameRate: r
      });
    } catch (l) {
      console.warn("[livekit] Could not apply frameRate constraints:", l);
    }
    return await a.track.replaceTrack(d), i && d.addEventListener("ended", i), c;
  }
  async function tm(n, e, t, i = {}) {
    !ti[t] || !Array.from(e.localTracksRef.current.entries()).find(([, o]) => o.source === Ct.SCREEN) || (await Dc(n, e), await Oc(n, e, {
      qualityKey: t,
      onTrackEnded: i.onTrackEnded
    }));
  }
  async function im(n, e, t = null) {
    const i = $c, s = {
      width: {
        ideal: i.width
      },
      height: {
        ideal: i.height
      },
      frameRate: {
        ideal: i.frameRate
      }
    };
    t && (s.deviceId = {
      exact: t
    });
    const o = (await navigator.mediaDevices.getUserMedia({
      video: s
    })).getVideoTracks()[0], a = new _i(o);
    await n.localParticipant.publishTrack(a, {
      source: C.Source.Camera,
      videoEncoding: {
        maxBitrate: i.bitrate,
        maxFramerate: i.frameRate
      },
      simulcast: false
    }), e.localTracksRef.current.set(a.sid, {
      track: a,
      source: Ct.WEBCAM
    });
  }
  async function nm(n, e) {
    for (const [t, i] of e.localTracksRef.current.entries()) i.source === Ct.WEBCAM && (i.track.stop(), await n.localParticipant.unpublishTrack(i.track), e.localTracksRef.current.delete(t));
  }
  async function sm(n, e, t, i) {
    const s = e.availableScreensRef.current.get(t);
    if (s) {
      e.loadingScreensRef.current.add(t), i == null ? void 0 : i();
      try {
        await s.publication.setSubscribed(true);
        const r = Array.from(n.remoteParticipants.values()).find((o) => o.identity === s.participantId);
        if (r) {
          for (const [, o] of r.audioTrackPublications) if (o.source === C.Source.ScreenShareAudio) {
            await o.setSubscribed(true);
            break;
          }
        }
        e.watchedScreensRef.current.add(t);
      } finally {
        e.loadingScreensRef.current.delete(t), i == null ? void 0 : i();
      }
    }
  }
  async function rm(n, e, t, i) {
    const s = e.availableScreensRef.current.get(t);
    if (!s) return;
    await s.publication.setSubscribed(false);
    const r = Array.from(n.remoteParticipants.values()).find((o) => o.identity === s.participantId);
    if (r) {
      for (const [, o] of r.audioTrackPublications) if (o.source === C.Source.ScreenShareAudio) {
        await o.setSubscribed(false);
        break;
      }
    }
    e.watchedScreensRef.current.delete(t), i == null ? void 0 : i();
  }
  function am(n) {
    const e = atob(n), t = new Uint8Array(e.length);
    for (let i = 0; i < e.length; i++) t[i] = e.charCodeAt(i);
    return t;
  }
  Pm = function({ wsClient: n, getToken: e, currentUserId: t, getStore: i, voiceKeyRotationHours: s, isLowLatency: r }) {
    const [o, a] = _.useState(false), [c, d] = _.useState(null), [l, u] = _.useState(/* @__PURE__ */ new Map()), [h, m] = _.useState(/* @__PURE__ */ new Map()), [v, g] = _.useState([]), [T, S] = _.useState(false), [I, P] = _.useState(null), [b, k] = _.useState(false), [w, A] = _.useState(false), [U, D] = _.useState([]), [N, L] = _.useState(/* @__PURE__ */ new Map()), [q, ne] = _.useState(/* @__PURE__ */ new Set()), [ye, Qe] = _.useState(/* @__PURE__ */ new Set()), B = _.useRef(null), de = _.useRef(/* @__PURE__ */ new Map()), Ne = _.useRef(/* @__PURE__ */ new Map()), Oe = _.useRef(/* @__PURE__ */ new Map()), Re = _.useRef(/* @__PURE__ */ new Set()), ot = _.useRef(/* @__PURE__ */ new Set()), De = _.useRef(null), Ce = _.useRef(null), se = _.useRef(null), Pe = _.useRef(null), mt = _.useRef(null), Ye = _.useRef(null), Ht = _.useRef(0), ft = _.useRef(0), Xe = _.useRef(null), Jt = _.useRef(null), zt = _.useRef(false), Rt = _.useRef(false), $t = _.useRef(false), j = _.useCallback(() => {
      window.__orch = Xe.current ?? null, window.__measureRemote = (G) => Ma(async () => {
        const { measureRemoteLevel: z } = await import("./measureRemoteLevel-CKEY2VvA.js");
        return {
          measureRemoteLevel: z
        };
      }, __vite__mapDeps([0,1])).then(({ measureRemoteLevel: z }) => z(Ne.current, G));
    }, []);
    _.useEffect(() => (j(), () => {
      delete window.__orch, delete window.__measureRemote;
    }), [
      j
    ]);
    const W = _.useCallback(() => {
      zt.current || (zt.current = true, requestAnimationFrame(() => {
        u(new Map(de.current)), zt.current = false;
      }));
    }, []), Z = _.useCallback(() => {
      Rt.current || (Rt.current = true, requestAnimationFrame(() => {
        m(new Map(Ne.current)), Rt.current = false;
      }));
    }, []), J = _.useCallback(() => {
      $t.current || ($t.current = true, requestAnimationFrame(() => {
        L(new Map(Oe.current)), ne(new Set(Re.current)), Qe(new Set(ot.current)), $t.current = false;
      }));
    }, []), $ = _.useCallback(async () => {
      const G = Xe.current, z = Jt.current;
      G && (z && G.isLive ? await G.unpublish(z) : await G.teardown(), Xe.current = null, Jt.current = null, j());
    }, [
      j
    ]), te = _.useCallback(() => {
      const G = B.current;
      if (!G) return;
      const z = Array.from(G.remoteParticipants.values()).map((re) => ({
        id: re.identity,
        displayName: re.name || re.identity
      }));
      g((re) => re.length === z.length && re.every((Be, Se) => {
        var _a2, _b;
        return Be.id === ((_a2 = z[Se]) == null ? void 0 : _a2.id) && Be.displayName === ((_b = z[Se]) == null ? void 0 : _b.displayName);
      }) ? re : z);
    }, []), _e = _.useCallback(async (G, z, re) => {
      const Be = ++Ht.current, Se = () => Be !== Ht.current;
      if (!n) {
        d("WebSocket not connected. Please try again.");
        return;
      }
      d(null);
      try {
        B.current && (B.current.disconnect(), B.current = null), Pe.current && (Pe.current(), Pe.current = null), se.current && (clearInterval(se.current), se.current = null), de.current.clear(), Ne.current.clear(), Oe.current.clear(), Re.current.clear(), u(/* @__PURE__ */ new Map()), m(/* @__PURE__ */ new Map()), L(/* @__PURE__ */ new Map()), ne(/* @__PURE__ */ new Set()), g([]), D([]), a(false), S(false), P(null), A(false), Ce.current = null, ft.current = 0, mt.current = G, Ye.current = re || null;
        const Yt = e == null ? void 0 : e();
        if (!Yt) throw new Error("Session required. Please sign in again.");
        const Oi = await fetch("/api/livekit/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Yt}`
          },
          body: JSON.stringify({
            roomName: G,
            participantName: z
          })
        });
        if (!Oi.ok) {
          const V = await Oi.json().catch(() => ({})), K = V.error || "Failed to get LiveKit token";
          throw Oi.status === 401 ? new Error("Session invalid. Please sign in again.") : Oi.status === 403 && V.code === "muted" ? new Error(K) : new Error(K);
        }
        const { token: Bc } = await Oi.json();
        if (Se()) return;
        k(true);
        let oi = null, nn = null;
        try {
          oi = new Ju(), De.current = oi, nn = new Pp();
          const V = await i(), K = await Xt(V), Te = {
            db: V,
            token: Yt,
            credential: K,
            mlsStore: Dt,
            hushCrypto: Ot,
            api: Mt
          };
          if (await Kc(Yt, re).catch(() => null)) await Ic(Te, re);
          else try {
            await ur(Te, re);
          } catch (Di) {
            const ci = String((Di == null ? void 0 : Di.message) ?? Di);
            if (ci.includes("GroupAlreadyExists") || ci.includes("already exists")) console.warn("[livekit] Voice group already exists locally (StrictMode re-fire), continuing");
            else throw Di;
          }
          const { frameKeyBytes: _t, epoch: Ve } = await qi(Te, re);
          await oi.setKey(new Uint8Array(_t), Ve % 256), P(Ve), Ce.current = Ve, S(true), k(false);
        } catch (V) {
          console.error("[livekit] MLS voice group setup failed:", V), k(false), oi = null, nn = null;
        }
        if (!oi || !nn) throw new Error("Could not establish encrypted voice - E2EE is required.");
        if (Se()) return;
        const Vc = {
          dynacast: true,
          adaptiveStream: true,
          e2ee: {
            keyProvider: oi,
            worker: nn
          }
        }, He = new Ii(Vc);
        He.on(R.ParticipantConnected, (V) => {
          Se() || (console.log(`[livekit] Participant connected: ${V.identity}`), g((K) => K.some((Te) => Te.id === V.identity) ? K : [
            ...K,
            {
              id: V.identity,
              displayName: V.name || V.identity
            }
          ]), queueMicrotask(te));
        }), He.on(R.ParticipantDisconnected, (V) => {
          if (!Se()) {
            console.log(`[livekit] Participant disconnected: ${V.identity}`), g((K) => K.filter((Te) => Te.id !== V.identity)), queueMicrotask(te);
            for (const [K, Te] of Oe.current.entries()) Te.participantId === V.identity && (Oe.current.delete(K), Re.current.delete(K));
            J();
            for (const [K, Te] of Ne.current.entries()) Te.participant.identity === V.identity && Ne.current.delete(K);
            Z();
          }
        }), Zp(He, {
          remoteTracksRef: Ne,
          availableScreensRef: Oe,
          watchedScreensRef: Re
        }, Z, J), He.on(R.Connected, () => {
          Se();
        }), He.on(R.Reconnecting, () => {
          Se() || (ft.current += 1, k(true), console.log(`[livekit] Reconnecting... (attempt ${ft.current})`));
        }), He.on(R.Reconnected, async () => {
          if (!Se()) {
            ft.current = 0;
            try {
              const V = await i(), K = await Xt(V), Te = e(), gt = {
                db: V,
                token: Te,
                credential: K,
                mlsStore: Dt,
                hushCrypto: Ot,
                api: Mt
              }, { frameKeyBytes: _t, epoch: Ve } = await qi(gt, Ye.current);
              De.current && await De.current.setKey(new Uint8Array(_t), Ve % 256), P(Ve), Ce.current = Ve, console.log(`[livekit] Reconnected - frame key re-derived (epoch ${Ve})`);
            } catch (V) {
              console.error("[livekit] Frame key re-derivation after reconnect failed:", V);
            }
            k(false);
          }
        }), He.on(R.Disconnected, () => {
          Se() || (console.log("[livekit] Disconnected from room"), a(false), ft.current >= 3 ? (A(true), k(false)) : d("Disconnected from room"));
        }), He.on(R.ActiveSpeakersChanged, (V) => {
          Se() || D(V.map((K) => K.identity));
        });
        const qc = `${window.location.protocol === "https:" ? "wss" : "ws"}://${window.location.host}/livekit/`;
        if (await He.connect(qc, Bc, {
          autoSubscribe: false
        }), Se()) {
          He.disconnect();
          return;
        }
        B.current = He;
        const hr = async (V) => {
          if (!(V.group_type !== "voice" || V.channel_id !== Ye.current) && !(V.sender_id === t && V.sender_device_id === Oa())) try {
            const K = await i(), Te = await Xt(K), gt = e(), _t = {
              db: K,
              token: gt,
              credential: Te,
              mlsStore: Dt,
              hushCrypto: Ot,
              api: Mt
            }, Ve = am(V.commit_bytes);
            await xc(_t, V.channel_id, Ve);
            const { frameKeyBytes: Di, epoch: ci } = await qi(_t, V.channel_id);
            De.current && await De.current.setKey(new Uint8Array(Di), ci % 256), P(ci), Ce.current = ci;
          } catch (K) {
            console.error("[livekit] Failed to process voice MLS commit:", K);
          }
        }, pr = async (V) => {
          if (V.channel_id === Ye.current) try {
            const K = await i(), Te = await Xt(K), gt = {
              db: K,
              token: e(),
              credential: Te,
              mlsStore: Dt,
              hushCrypto: Ot,
              api: Mt
            };
            await bn(gt, V.channel_id);
          } catch (K) {
            console.warn("[livekit] voice_group_destroyed cleanup failed:", K);
          }
        };
        n.on("mls.commit", hr), n.on("voice_group_destroyed", pr), Pe.current = () => {
          n.off("mls.commit", hr), n.off("voice_group_destroyed", pr);
        };
        const Gc = (s ?? 2) * 36e5;
        se.current = setInterval(async () => {
          try {
            const V = await i(), K = await Xt(V), Te = e(), gt = {
              db: V,
              token: Te,
              credential: K,
              mlsStore: Dt,
              hushCrypto: Ot,
              api: Mt
            };
            await Mc(gt, Ye.current);
            const { frameKeyBytes: _t, epoch: Ve } = await qi(gt, Ye.current);
            De.current && await De.current.setKey(new Uint8Array(_t), Ve % 256), P(Ve), Ce.current = Ve;
          } catch (V) {
            console.warn("[livekit] Periodic voice key rotation failed:", V);
          }
        }, Gc);
        const mr = [];
        for (const V of He.remoteParticipants.values()) {
          mr.push({
            id: V.identity,
            displayName: V.name || V.identity
          });
          for (const [, K] of V.trackPublications) K.trackSid && (K.source === C.Source.ScreenShare && K.kind === C.Kind.Video ? Oe.current.set(K.trackSid, {
            trackSid: K.trackSid,
            participantId: V.identity,
            participantName: V.name || V.identity,
            kind: K.kind,
            source: K.source,
            publication: K
          }) : K.source !== C.Source.ScreenShareAudio && K.setSubscribed(true));
        }
        J(), g(mr), a(true), Hc(), console.log("[livekit] Connected to room:", G);
      } catch (Yt) {
        if (Se()) return;
        console.error("[livekit] Connection error:", Yt), d(Yt.message);
      }
    }, [
      Z,
      J,
      te,
      n,
      t,
      e,
      i,
      s
    ]), ai = _.useCallback(async () => {
      if (Ht.current++, d(null), se.current && (clearInterval(se.current), se.current = null), Pe.current && (Pe.current(), Pe.current = null), !B.current) {
        const G = Ye.current;
        if (G) try {
          const z = await i(), re = await Xt(z), Be = {
            db: z,
            token: e(),
            credential: re,
            mlsStore: Dt,
            hushCrypto: Ot,
            api: Mt
          };
          await bn(Be, G);
        } catch {
        }
        Ce.current = null, ft.current = 0, P(null), k(false), A(false);
        return;
      }
      try {
        const G = de.current;
        G && typeof G.forEach == "function" && G.forEach((re) => {
          (re == null ? void 0 : re.track) && typeof re.track.stop == "function" && re.track.stop();
        }), await $();
        const z = Ye.current;
        if (z) try {
          const re = await i(), Be = await Xt(re), Se = {
            db: re,
            token: e(),
            credential: Be,
            mlsStore: Dt,
            hushCrypto: Ot,
            api: Mt
          };
          await bn(Se, z);
        } catch {
        }
        await B.current.disconnect(), B.current = null, De.current = null, Ce.current = null, mt.current = null, Ye.current = null, de.current.clear(), Ne.current.clear(), Oe.current.clear(), Re.current.clear(), u(/* @__PURE__ */ new Map()), m(/* @__PURE__ */ new Map()), L(/* @__PURE__ */ new Map()), ne(/* @__PURE__ */ new Set()), g([]), a(false), S(false), P(null), k(false), A(false), ft.current = 0, console.log("[livekit] Disconnected from room");
      } catch (G) {
        console.error("[livekit] Disconnect error:", G);
      }
    }, [
      $,
      i,
      e
    ]), ke = _.useCallback(async () => {
      if (B.current) try {
        await Dc(B.current, {
          localTracksRef: de
        }), W();
      } catch (G) {
        console.error("[livekit] Unpublish screen error:", G);
      }
    }, [
      W
    ]), Pt = _.useCallback(async (G = ds) => {
      if (!B.current) throw new Error("Room not connected");
      try {
        const z = await Oc(B.current, {
          localTracksRef: de
        }, {
          qualityKey: G,
          onTrackEnded: ke
        });
        return W(), z ?? null;
      } catch (z) {
        if (z.name === "NotAllowedError") return null;
        throw z;
      }
    }, [
      ke,
      W
    ]), en = _.useCallback(async (G = ds) => {
      if (!B.current) throw new Error("Room not connected");
      const z = await em(B.current, {
        localTracksRef: de
      }, G, ke);
      return W(), z;
    }, [
      ke,
      W
    ]), qn = _.useCallback(async (G) => {
      B.current && (await tm(B.current, {
        localTracksRef: de
      }, G, {
        onTrackEnded: ke
      }), W());
    }, [
      ke,
      W
    ]), Ze = _.useCallback(async (G = null) => {
      if (!B.current) throw new Error("Room not connected");
      await im(B.current, {
        localTracksRef: de
      }, G), W();
    }, [
      W
    ]), Mi = _.useCallback(async () => {
      B.current && (await nm(B.current, {
        localTracksRef: de
      }), W());
    }, [
      W
    ]), tn = _.useCallback(async (G = null) => {
      if (!B.current) throw new Error("Room not connected");
      const z = $p({
        isLowLatency: r,
        isMobileWebAudio: Xp()
      }), re = zp[z];
      try {
        await $();
        const Be = new Kp({
          noiseGateWorkletUrl: zc,
          initialFilterSettings: Jc()
        });
        Xe.current = Be, j(), await Be.acquire(re, G);
        const Se = new Jp(B.current.localParticipant, de, W);
        Jt.current = Se, await Be.publishTo(Se);
      } catch (Be) {
        throw await $(), Be;
      }
    }, [
      W,
      $,
      r
    ]), Qt = _.useCallback(async () => {
      await $(), W();
    }, [
      W,
      $
    ]), Gn = _.useCallback(async () => {
      var _a2;
      B.current && await ((_a2 = Xe.current) == null ? void 0 : _a2.mute());
    }, []), Lc = _.useCallback(async () => {
      var _a2;
      B.current && await ((_a2 = Xe.current) == null ? void 0 : _a2.unmute());
    }, []), Uc = _.useCallback((G) => {
      var _a2;
      (_a2 = Xe.current) == null ? void 0 : _a2.updateFilterSettings(G);
    }, []), jc = _.useCallback(async (G) => {
      if (B.current) try {
        await sm(B.current, {
          availableScreensRef: Oe,
          watchedScreensRef: Re,
          loadingScreensRef: ot
        }, G, J);
      } catch (z) {
        console.error("[livekit] Watch screen error:", z);
      }
    }, [
      J
    ]), Fc = _.useCallback(async (G) => {
      if (B.current) {
        Ne.current.delete(G), Re.current.delete(G), Z(), J();
        try {
          await rm(B.current, {
            availableScreensRef: Oe,
            watchedScreensRef: Re
          }, G, J);
        } catch (z) {
          console.error("[livekit] Unwatch screen error:", z);
        }
      }
    }, [
      Z,
      J
    ]);
    return _.useEffect(() => {
      const G = setInterval(() => {
        te();
      }, 1500), z = () => {
        document.visibilityState === "visible" && te();
      };
      return document.addEventListener("visibilitychange", z), () => {
        clearInterval(G), document.removeEventListener("visibilitychange", z);
      };
    }, [
      te
    ]), _.useEffect(() => () => {
      var _a2;
      Pe.current && (Pe.current(), Pe.current = null), se.current && (clearInterval(se.current), se.current = null);
      const G = B.current, z = de.current;
      G && (Ht.current++, z && typeof z.forEach == "function" && z.forEach((re) => {
        (re == null ? void 0 : re.track) && typeof re.track.stop == "function" && re.track.stop();
      }), G.disconnect(), B.current = null), (_a2 = Xe.current) == null ? void 0 : _a2.teardown().catch(() => {
      }), Xe.current = null, Jt.current = null, j();
    }, [
      j
    ]), {
      isReady: o,
      error: c,
      localTracks: l,
      remoteTracks: h,
      participants: v,
      isE2EEEnabled: T,
      voiceEpoch: I,
      isVoiceReconnecting: b,
      voiceReconnectFailed: w,
      activeSpeakerIds: U,
      connectRoom: _e,
      disconnectRoom: ai,
      publishScreen: Pt,
      unpublishScreen: ke,
      switchScreenSource: en,
      changeQuality: qn,
      publishWebcam: Ze,
      unpublishWebcam: Mi,
      publishMic: tn,
      unpublishMic: Qt,
      muteMic: Gn,
      unmuteMic: Lc,
      updateMicFilterSettings: Uc,
      availableScreens: N,
      watchedScreens: q,
      loadingScreens: ye,
      watchScreen: jc,
      unwatchScreen: Fc
    };
  };
  _m = async function() {
    try {
      const e = new Uint8Array(512e3), t = 65536;
      for (let c = 0; c < 512e3; c += t) {
        const d = Math.min(c + t, 512e3);
        crypto.getRandomValues(e.subarray(c, d));
      }
      const i = new Blob([
        e
      ]), s = performance.now();
      await fetch("/api/health", {
        method: "POST",
        body: i,
        headers: {
          "Cache-Control": "no-cache"
        }
      });
      const o = (performance.now() - s) / 1e3, a = 512e3 * 8 / (o * 1e6);
      return console.log(`[bandwidth] Upload estimate: ${a.toFixed(1)} Mbps`), a;
    } catch (n) {
      return console.error("[bandwidth] Estimation failed:", n), 5;
    }
  };
  Im = function(n) {
    const e = Object.entries(ti).sort(([, t], [, i]) => i.bitrate - t.bitrate);
    for (const [t, i] of e) {
      const s = i.bitrate / 1e6 * 1.2;
      if (n >= s) return {
        key: t,
        preset: i,
        uploadMbps: n
      };
    }
    return {
      key: "lite",
      preset: ti.lite,
      uploadMbps: n
    };
  };
  function om(n) {
    let e = 0;
    for (const t of n) t && t.forEach((i) => {
      i.type === "outbound-rtp" && i.kind === "video" && typeof i.bytesSent == "number" && (e += i.bytesSent);
    });
    return e;
  }
  xm = async function(n, e, t) {
    if (!n || n.length === 0) return {
      mbps: 0,
      bytesSent: 0,
      timestamp: t
    };
    const i = await Promise.all(n.map((c) => c.getRTCStatsReport ? c.getRTCStatsReport() : Promise.resolve(null))), s = om(i), r = performance.now();
    if (t == null || e == null) return {
      mbps: 0,
      bytesSent: s,
      timestamp: r
    };
    const o = (r - t) / 1e3;
    return {
      mbps: o > 0 ? Math.max(0, s - e) * 8 / (o * 1e6) : 0,
      bytesSent: s,
      timestamp: r
    };
  };
  Mm = function({ track: n, audioTrack: e, label: t, source: i, isLocal: s, onUnwatch: r, objectFit: o, standByAfterMs: a }) {
    const c = _.useRef(null), d = _.useRef(null), l = _.useRef(null), u = _.useRef(null), [h, m] = _.useState(false), [v, g] = _.useState(false);
    _.useEffect(() => {
      if (!c.current || !n) return;
      const I = c.current, P = new MediaStream([
        n
      ]);
      return I.srcObject = P, (async () => {
        try {
          await I.play();
        } catch {
          I.muted = true;
          try {
            await I.play();
          } catch (k) {
            console.error("[StreamView] Playback failed:", k);
          }
        }
      })(), () => {
        I.srcObject = null;
      };
    }, [
      n
    ]), _.useEffect(() => {
      if (console.log("[StreamView] Audio effect:", {
        hasAudioRef: !!d.current,
        hasAudioTrack: !!e,
        audioTrackState: e == null ? void 0 : e.readyState,
        audioTrackMuted: e == null ? void 0 : e.muted,
        isLocal: s,
        label: t
      }), !d.current || !e || s) return;
      const I = d.current;
      return I.srcObject = new MediaStream([
        e
      ]), console.log("[StreamView] Audio srcObject set for:", t), (async () => {
        try {
          await I.play(), console.log("[StreamView] Audio playing for:", t);
        } catch (b) {
          console.warn("[StreamView] Audio autoplay blocked:", b.name, "- waiting for user interaction");
          const k = () => {
            I.play().then(() => console.log("[StreamView] Audio resumed after interaction")).catch((w) => console.error("[StreamView] Audio resume failed:", w)), document.removeEventListener("touchstart", k), document.removeEventListener("click", k);
          };
          document.addEventListener("touchstart", k, {
            once: true
          }), document.addEventListener("click", k, {
            once: true
          });
        }
      })(), () => {
        I.srcObject = null;
      };
    }, [
      e,
      s,
      t
    ]), _.useEffect(() => {
      if (!v) return;
      const I = (P) => {
        P.key === "Escape" && g(false);
      };
      return document.addEventListener("keydown", I), () => document.removeEventListener("keydown", I);
    }, [
      v
    ]), _.useEffect(() => {
      if (!r || !a || a <= 0 || !l.current) return;
      const I = l.current, P = {
        current: false
      }, b = () => {
        u.current && (clearTimeout(u.current), u.current = null);
      }, k = () => {
        b(), u.current = setTimeout(() => {
          u.current = null, r();
        }, a);
      }, w = (D, N) => {
        P.current = D, D && N ? b() : k();
      }, A = new IntersectionObserver(([D]) => w(D.isIntersecting, document.visibilityState === "visible"), {
        threshold: 0
      });
      A.observe(I);
      const U = () => w(P.current, document.visibilityState === "visible");
      return document.addEventListener("visibilitychange", U), () => {
        A.disconnect(), document.removeEventListener("visibilitychange", U), b();
      };
    }, [
      r,
      a
    ]);
    const T = () => g((I) => !I), S = {
      position: v ? "fixed" : "relative",
      ...v ? {
        inset: 0,
        zIndex: 9999
      } : {
        width: "100%",
        height: "100%",
        minHeight: 0
      },
      background: "var(--hush-elevated)",
      borderRadius: v ? 0 : "var(--radius-md)",
      overflow: "hidden"
    };
    return f.jsxs("div", {
      ref: l,
      style: S,
      onMouseEnter: () => m(true),
      onMouseLeave: () => m(false),
      children: [
        f.jsx("div", {
          className: "sv-video-wrapper",
          style: {
            transform: s && i === "webcam" ? "scaleX(-1)" : void 0
          },
          children: f.jsx("video", {
            ref: c,
            autoPlay: true,
            playsInline: true,
            muted: s,
            className: "sv-video",
            style: {
              objectFit: v ? "contain" : o ?? "contain"
            }
          })
        }),
        !s && f.jsx("audio", {
          ref: d,
          autoPlay: true,
          playsInline: true,
          style: {
            display: "none"
          }
        }),
        f.jsx("button", {
          className: "sv-overlay-btn sv-fullscreen-btn",
          style: {
            opacity: h || v ? 1 : 0.4
          },
          onClick: T,
          title: v ? "Exit fullscreen" : "Fullscreen",
          children: v ? f.jsxs("svg", {
            width: "16",
            height: "16",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            children: [
              f.jsx("polyline", {
                points: "4 14 10 14 10 20"
              }),
              f.jsx("polyline", {
                points: "20 10 14 10 14 4"
              }),
              f.jsx("line", {
                x1: "14",
                y1: "10",
                x2: "21",
                y2: "3"
              }),
              f.jsx("line", {
                x1: "3",
                y1: "21",
                x2: "10",
                y2: "14"
              })
            ]
          }) : f.jsxs("svg", {
            width: "16",
            height: "16",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            children: [
              f.jsx("polyline", {
                points: "15 3 21 3 21 9"
              }),
              f.jsx("polyline", {
                points: "9 21 3 21 3 15"
              }),
              f.jsx("line", {
                x1: "21",
                y1: "3",
                x2: "14",
                y2: "10"
              }),
              f.jsx("line", {
                x1: "3",
                y1: "21",
                x2: "10",
                y2: "14"
              })
            ]
          })
        }),
        f.jsxs("div", {
          className: "sv-label",
          children: [
            i === "screen" ? f.jsxs("svg", {
              className: "sv-source-icon",
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              strokeWidth: "2",
              children: [
                f.jsx("rect", {
                  x: "2",
                  y: "3",
                  width: "20",
                  height: "14",
                  rx: "2"
                }),
                f.jsx("line", {
                  x1: "8",
                  y1: "21",
                  x2: "16",
                  y2: "21"
                }),
                f.jsx("line", {
                  x1: "12",
                  y1: "17",
                  x2: "12",
                  y2: "21"
                })
              ]
            }) : f.jsxs("svg", {
              className: "sv-source-icon",
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              strokeWidth: "2",
              children: [
                f.jsx("path", {
                  d: "M23 7l-7 5 7 5V7z"
                }),
                f.jsx("rect", {
                  x: "1",
                  y: "5",
                  width: "15",
                  height: "14",
                  rx: "2"
                })
              ]
            }),
            t
          ]
        }),
        s && f.jsx("div", {
          className: "sv-local-badge",
          children: "You"
        }),
        r && f.jsx("button", {
          className: "sv-overlay-btn sv-unwatch-btn",
          style: {
            opacity: h ? 1 : 0.4
          },
          onClick: (I) => {
            I.stopPropagation(), r();
          },
          title: "Stop watching",
          children: f.jsxs("svg", {
            width: "16",
            height: "16",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            children: [
              f.jsx("line", {
                x1: "18",
                y1: "6",
                x2: "6",
                y2: "18"
              }),
              f.jsx("line", {
                x1: "6",
                y1: "6",
                x2: "18",
                y2: "18"
              })
            ]
          })
        })
      ]
    });
  };
  Om = function({ peerName: n, isSelf: e = false, isLoading: t = false, onWatch: i }) {
    const s = e ? "You're sharing" : n, r = t ? "loading stream..." : e ? "Tap to watch" : "click to watch";
    return f.jsx("div", {
      className: `ssc-card${t ? " ssc-card--loading" : ""}`,
      onClick: i,
      children: t ? f.jsxs(f.Fragment, {
        children: [
          f.jsx("div", {
            className: "ssc-spinner"
          }),
          f.jsx("div", {
            className: "ssc-peer-name",
            children: s
          }),
          f.jsx("div", {
            className: "ssc-hint",
            children: r
          })
        ]
      }) : f.jsxs(f.Fragment, {
        children: [
          f.jsx("div", {
            className: "ssc-icon",
            children: f.jsxs("svg", {
              width: "48",
              height: "48",
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "var(--hush-text-ghost)",
              strokeWidth: "1.5",
              children: [
                f.jsx("rect", {
                  x: "2",
                  y: "3",
                  width: "20",
                  height: "14",
                  rx: "2"
                }),
                f.jsx("line", {
                  x1: "8",
                  y1: "21",
                  x2: "16",
                  y2: "21"
                }),
                f.jsx("line", {
                  x1: "12",
                  y1: "17",
                  x2: "12",
                  y2: "21"
                })
              ]
            })
          }),
          f.jsx("div", {
            className: "ssc-peer-name",
            children: s
          }),
          f.jsx("div", {
            className: "ssc-hint",
            children: r
          })
        ]
      })
    });
  };
  function cm({ bars: n = 0, color: e = "var(--hush-text-muted)", isReconnecting: t = false, rtt: i }) {
    const s = [
      {
        x: 1,
        y: 16,
        h: 6
      },
      {
        x: 7,
        y: 11,
        h: 11
      },
      {
        x: 13,
        y: 6,
        h: 16
      },
      {
        x: 19,
        y: 1,
        h: 21
      }
    ];
    return f.jsx("svg", {
      className: `voice-panel-signal${t ? " voice-panel-signal--pulse" : ""}`,
      width: "12",
      height: "12",
      viewBox: "0 0 24 24",
      "aria-hidden": "true",
      title: i != null ? `${i}ms` : "Measuring...",
      children: s.map((r, o) => f.jsx("rect", {
        x: r.x,
        y: r.y,
        width: "4",
        height: r.h,
        rx: "1",
        fill: o < n ? e : "var(--hush-text-ghost)"
      }, o))
    });
  }
  Dm = function({ channelName: n, isLowLatency: e, isScreenSharing: t, isWebcamOn: i, signalBars: s, signalColor: r, signalReconnecting: o, rtt: a, onScreenShare: c, onSwitchScreen: d, onWebcam: l, onDisconnect: u }) {
    const h = !e;
    return f.jsxs("div", {
      className: "voice-panel",
      children: [
        f.jsxs("div", {
          className: "voice-panel-header",
          children: [
            f.jsxs("div", {
              className: "voice-panel-info",
              children: [
                f.jsxs("span", {
                  className: "voice-panel-status",
                  children: [
                    f.jsx(cm, {
                      bars: s,
                      color: r,
                      isReconnecting: o,
                      rtt: a
                    }),
                    "Voice Connected",
                    a != null ? ` \xB7 ${a}ms` : ""
                  ]
                }),
                f.jsx("span", {
                  className: "voice-panel-channel",
                  children: n
                })
              ]
            }),
            f.jsx("button", {
              type: "button",
              className: "voice-panel-btn disconnect",
              onClick: u,
              title: "Disconnect from voice",
              children: f.jsxs("svg", {
                width: "16",
                height: "16",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "2",
                children: [
                  f.jsx("path", {
                    d: "M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07C9.44 17.29 7.76 15.19 6.7 12.77A19.79 19.79 0 0 1 3.63 4.14 2 2 0 0 1 5.6 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L9.58 9.91"
                  }),
                  f.jsx("line", {
                    x1: "23",
                    y1: "1",
                    x2: "1",
                    y2: "23"
                  })
                ]
              })
            })
          ]
        }),
        h && f.jsxs("div", {
          className: "voice-panel-controls",
          children: [
            f.jsx("button", {
              type: "button",
              className: `voice-panel-btn${i ? " active" : ""}`,
              onClick: l,
              title: i ? "Turn off camera" : "Turn on camera",
              children: i ? f.jsxs("svg", {
                width: "16",
                height: "16",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "2",
                children: [
                  f.jsx("path", {
                    d: "M23 7l-7 5 7 5V7z"
                  }),
                  f.jsx("rect", {
                    x: "1",
                    y: "5",
                    width: "15",
                    height: "14",
                    rx: "2"
                  })
                ]
              }) : f.jsxs("svg", {
                width: "16",
                height: "16",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "2",
                children: [
                  f.jsx("path", {
                    d: "M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34l1 1L23 7v10"
                  }),
                  f.jsx("line", {
                    x1: "1",
                    y1: "1",
                    x2: "23",
                    y2: "23"
                  })
                ]
              })
            }),
            f.jsx("button", {
              type: "button",
              className: `voice-panel-btn${t ? " active" : ""}`,
              onClick: c,
              title: t ? "Stop sharing" : "Share screen",
              children: f.jsxs("svg", {
                width: "16",
                height: "16",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "2",
                children: [
                  f.jsx("rect", {
                    x: "2",
                    y: "3",
                    width: "20",
                    height: "14",
                    rx: "2"
                  }),
                  f.jsx("line", {
                    x1: "8",
                    y1: "21",
                    x2: "16",
                    y2: "21"
                  }),
                  f.jsx("line", {
                    x1: "12",
                    y1: "17",
                    x2: "12",
                    y2: "21"
                  })
                ]
              })
            }),
            t && d && f.jsx("button", {
              type: "button",
              className: "voice-panel-btn",
              onClick: d,
              title: "Switch window",
              children: f.jsxs("svg", {
                width: "16",
                height: "16",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "2",
                children: [
                  f.jsx("polyline", {
                    points: "16 3 21 3 21 8"
                  }),
                  f.jsx("line", {
                    x1: "4",
                    y1: "20",
                    x2: "21",
                    y2: "3"
                  }),
                  f.jsx("polyline", {
                    points: "21 16 21 21 16 21"
                  }),
                  f.jsx("line", {
                    x1: "15",
                    y1: "15",
                    x2: "21",
                    y2: "21"
                  })
                ]
              })
            })
          ]
        })
      ]
    });
  };
  Am = function({ isReady: n, isScreenSharing: e, isMicOn: t, isDeafened: i = false, isWebcamOn: s, quality: r, isMobile: o = false, mediaE2EEUnavailable: a = false, showScreenShare: c = true, showWebcam: d = true, showQualityPicker: l = true, onScreenShare: u, onOpenQualityOrWindow: h, onMic: m, onDeafen: v, onWebcam: g, onMicDeviceSwitch: T, onWebcamDeviceSwitch: S, onLeave: I }) {
    var _a2;
    const P = o ? "52px" : "44px", b = a, k = a ? "Media encryption unavailable" : void 0;
    return f.jsxs("div", {
      className: "ctrl-bar",
      children: [
        c && (!o || gr) && f.jsxs("button", {
          className: `ctrl-btn${e ? " ctrl-btn--active" : ""}`,
          style: {
            height: P,
            ...b ? {
              opacity: 0.6,
              cursor: "not-allowed"
            } : {}
          },
          onClick: u,
          disabled: !n || !gr || b,
          title: k || (e ? "Stop sharing" : "Share screen"),
          children: [
            f.jsxs("svg", {
              width: "18",
              height: "18",
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              strokeWidth: "2",
              children: [
                f.jsx("rect", {
                  x: "2",
                  y: "3",
                  width: "20",
                  height: "14",
                  rx: "2"
                }),
                f.jsx("line", {
                  x1: "8",
                  y1: "21",
                  x2: "16",
                  y2: "21"
                }),
                f.jsx("line", {
                  x1: "12",
                  y1: "17",
                  x2: "12",
                  y2: "21"
                })
              ]
            }),
            e ? "Stop" : "Share",
            e && f.jsx("span", {
              className: "ctrl-quality-tag",
              children: ((_a2 = ti[r]) == null ? void 0 : _a2.label) || r
            })
          ]
        }),
        l && e && f.jsx("button", {
          className: `ctrl-icon-btn${e ? " ctrl-icon-btn--active" : ""}`,
          style: {
            width: P,
            height: P
          },
          onClick: h,
          title: "Change quality or window",
          children: f.jsxs("svg", {
            width: "16",
            height: "16",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            children: [
              f.jsx("polyline", {
                points: "16 3 21 3 21 8"
              }),
              f.jsx("line", {
                x1: "4",
                y1: "20",
                x2: "21",
                y2: "3"
              }),
              f.jsx("polyline", {
                points: "21 16 21 21 16 21"
              }),
              f.jsx("line", {
                x1: "15",
                y1: "15",
                x2: "21",
                y2: "21"
              })
            ]
          })
        }),
        c && f.jsx("div", {
          className: "ctrl-divider"
        }),
        T ? f.jsxs("div", {
          className: "ctrl-device-group",
          style: {
            height: P,
            background: t ? "var(--hush-amber)" : "var(--hush-danger-ghost)",
            color: t ? "var(--hush-black)" : "var(--hush-danger)",
            ...b ? {
              opacity: 0.6,
              pointerEvents: "none"
            } : {}
          },
          children: [
            f.jsx("button", {
              type: "button",
              className: "ctrl-device-group-main",
              style: {
                width: P,
                height: P
              },
              onClick: m,
              disabled: !n || b,
              title: k || (t ? "Mute mic" : "Unmute mic"),
              children: t ? f.jsxs("svg", {
                width: "18",
                height: "18",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "2",
                children: [
                  f.jsx("path", {
                    d: "M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"
                  }),
                  f.jsx("path", {
                    d: "M19 10v2a7 7 0 0 1-14 0v-2"
                  }),
                  f.jsx("line", {
                    x1: "12",
                    y1: "19",
                    x2: "12",
                    y2: "23"
                  }),
                  f.jsx("line", {
                    x1: "8",
                    y1: "23",
                    x2: "16",
                    y2: "23"
                  })
                ]
              }) : f.jsxs("svg", {
                width: "18",
                height: "18",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "2",
                children: [
                  f.jsx("line", {
                    x1: "1",
                    y1: "1",
                    x2: "23",
                    y2: "23"
                  }),
                  f.jsx("path", {
                    d: "M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"
                  }),
                  f.jsx("path", {
                    d: "M17 16.95A7 7 0 0 1 5 12v-2m14 0v2c0 .51-.06 1-.16 1.47"
                  }),
                  f.jsx("line", {
                    x1: "12",
                    y1: "19",
                    x2: "12",
                    y2: "23"
                  }),
                  f.jsx("line", {
                    x1: "8",
                    y1: "23",
                    x2: "16",
                    y2: "23"
                  })
                ]
              })
            }),
            f.jsx("button", {
              type: "button",
              className: "ctrl-device-group-chevron",
              style: {
                height: P
              },
              onClick: (w) => {
                w.stopPropagation(), T();
              },
              disabled: b,
              title: "Change microphone",
              children: f.jsx("svg", {
                width: "10",
                height: "10",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "2.5",
                children: f.jsx("polyline", {
                  points: "6 9 12 15 18 9"
                })
              })
            })
          ]
        }) : f.jsx("button", {
          className: `ctrl-icon-btn${t ? " ctrl-icon-btn--active" : " ctrl-icon-btn--danger"}`,
          style: {
            width: P,
            height: P,
            ...b ? {
              opacity: 0.6,
              cursor: "not-allowed"
            } : {}
          },
          onClick: m,
          disabled: !n || b,
          title: k || (t ? "Mute mic" : "Unmute mic"),
          children: t ? f.jsxs("svg", {
            width: "18",
            height: "18",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            children: [
              f.jsx("path", {
                d: "M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"
              }),
              f.jsx("path", {
                d: "M19 10v2a7 7 0 0 1-14 0v-2"
              }),
              f.jsx("line", {
                x1: "12",
                y1: "19",
                x2: "12",
                y2: "23"
              }),
              f.jsx("line", {
                x1: "8",
                y1: "23",
                x2: "16",
                y2: "23"
              })
            ]
          }) : f.jsxs("svg", {
            width: "18",
            height: "18",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            children: [
              f.jsx("line", {
                x1: "1",
                y1: "1",
                x2: "23",
                y2: "23"
              }),
              f.jsx("path", {
                d: "M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"
              }),
              f.jsx("path", {
                d: "M17 16.95A7 7 0 0 1 5 12v-2m14 0v2c0 .51-.06 1-.16 1.47"
              }),
              f.jsx("line", {
                x1: "12",
                y1: "19",
                x2: "12",
                y2: "23"
              }),
              f.jsx("line", {
                x1: "8",
                y1: "23",
                x2: "16",
                y2: "23"
              })
            ]
          })
        }),
        v && f.jsx("button", {
          className: `ctrl-icon-btn${i ? " ctrl-icon-btn--danger" : ""}`,
          style: {
            width: P,
            height: P
          },
          onClick: v,
          title: i ? "Undeafen" : "Deafen",
          children: i ? f.jsxs("svg", {
            width: "18",
            height: "18",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            children: [
              f.jsx("path", {
                d: "M3 18v-6a9 9 0 0 1 18 0v6"
              }),
              f.jsx("path", {
                d: "M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"
              }),
              f.jsx("line", {
                x1: "1",
                y1: "1",
                x2: "23",
                y2: "23"
              })
            ]
          }) : f.jsxs("svg", {
            width: "18",
            height: "18",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            children: [
              f.jsx("path", {
                d: "M3 18v-6a9 9 0 0 1 18 0v6"
              }),
              f.jsx("path", {
                d: "M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"
              })
            ]
          })
        }),
        d && f.jsx("div", {
          className: "ctrl-divider"
        }),
        d && S ? f.jsxs("div", {
          className: "ctrl-device-group",
          style: {
            height: P,
            background: s ? "var(--hush-amber)" : "var(--hush-surface)",
            color: s ? "var(--hush-black)" : "var(--hush-text-secondary)",
            ...b ? {
              opacity: 0.6,
              pointerEvents: "none"
            } : {}
          },
          children: [
            f.jsx("button", {
              type: "button",
              className: "ctrl-device-group-main",
              style: {
                width: P,
                height: P
              },
              onClick: g,
              disabled: !n || b,
              title: k || (s ? "Turn off camera" : "Turn on camera"),
              children: s ? f.jsxs("svg", {
                width: "18",
                height: "18",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "2",
                children: [
                  f.jsx("path", {
                    d: "M23 7l-7 5 7 5V7z"
                  }),
                  f.jsx("rect", {
                    x: "1",
                    y: "5",
                    width: "15",
                    height: "14",
                    rx: "2"
                  })
                ]
              }) : f.jsxs("svg", {
                width: "18",
                height: "18",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "2",
                children: [
                  f.jsx("path", {
                    d: "M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34l1 1L23 7v10"
                  }),
                  f.jsx("line", {
                    x1: "1",
                    y1: "1",
                    x2: "23",
                    y2: "23"
                  })
                ]
              })
            }),
            f.jsx("button", {
              type: "button",
              className: "ctrl-device-group-chevron",
              style: {
                height: P
              },
              onClick: (w) => {
                w.stopPropagation(), S();
              },
              disabled: b,
              title: "Change webcam",
              children: f.jsx("svg", {
                width: "10",
                height: "10",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "2.5",
                children: f.jsx("polyline", {
                  points: "6 9 12 15 18 9"
                })
              })
            })
          ]
        }) : d ? f.jsx("button", {
          className: `ctrl-icon-btn${s ? " ctrl-icon-btn--active" : ""}`,
          style: {
            width: P,
            height: P,
            ...b ? {
              opacity: 0.6,
              cursor: "not-allowed"
            } : {}
          },
          onClick: g,
          disabled: !n || b,
          title: k || (s ? "Turn off camera" : "Turn on camera"),
          children: s ? f.jsxs("svg", {
            width: "18",
            height: "18",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            children: [
              f.jsx("path", {
                d: "M23 7l-7 5 7 5V7z"
              }),
              f.jsx("rect", {
                x: "1",
                y: "5",
                width: "15",
                height: "14",
                rx: "2"
              })
            ]
          }) : f.jsxs("svg", {
            width: "18",
            height: "18",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            children: [
              f.jsx("path", {
                d: "M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34l1 1L23 7v10"
              }),
              f.jsx("line", {
                x1: "1",
                y1: "1",
                x2: "23",
                y2: "23"
              })
            ]
          })
        }) : null,
        f.jsx("div", {
          className: "ctrl-divider"
        }),
        f.jsx("button", {
          className: "ctrl-btn ctrl-btn--danger",
          style: {
            height: P
          },
          onClick: I,
          children: "Leave"
        })
      ]
    });
  };
  const dm = 200;
  function lm({ label: n, detail: e, recommendedLabel: t, onClick: i }) {
    return f.jsxs("div", {
      className: "qpm-option",
      onClick: i,
      children: [
        f.jsxs("div", {
          className: "qpm-option-left",
          children: [
            f.jsxs("div", {
              className: "qpm-option-label",
              children: [
                n,
                t != null && f.jsxs("span", {
                  className: "qpm-option-label-hint",
                  children: [
                    "(",
                    t,
                    ")"
                  ]
                })
              ]
            }),
            f.jsx("div", {
              className: "qpm-option-detail",
              children: e
            })
          ]
        }),
        f.jsx("svg", {
          width: "16",
          height: "16",
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "var(--hush-text-muted)",
          strokeWidth: "2",
          children: f.jsx("polyline", {
            points: "9 18 15 12 9 6"
          })
        })
      ]
    });
  }
  function um(n, e) {
    return n == null || e == null ? null : e >= 99 ? "Recommended: localhost" : `Recommended: ${e.toFixed(0)} Mbps`;
  }
  Nm = function({ recommendedQualityKey: n, recommendedUploadMbps: e, onSelect: t, onCancel: i }) {
    const [s, r] = _.useState(false), o = _.useRef(null), a = _.useCallback(() => {
      r(false), o.current && clearTimeout(o.current), o.current = setTimeout(i, dm);
    }, [
      i
    ]);
    _.useEffect(() => {
      const d = requestAnimationFrame(() => r(true));
      return () => cancelAnimationFrame(d);
    }, []), _.useEffect(() => {
      const d = (l) => {
        l.key === "Escape" && a();
      };
      return document.addEventListener("keydown", d), () => {
        document.removeEventListener("keydown", d), o.current && clearTimeout(o.current);
      };
    }, [
      a
    ]);
    const c = um(n, e);
    return f.jsx("div", {
      className: `modal-backdrop ${s ? "modal-backdrop-open" : ""}`,
      onClick: a,
      children: f.jsxs("div", {
        className: `modal-content ${s ? "modal-content-open" : ""}`,
        onClick: (d) => d.stopPropagation(),
        children: [
          f.jsx("div", {
            className: "qpm-title",
            children: "choose stream quality"
          }),
          Object.entries(ti).map(([d, l]) => f.jsx(lm, {
            label: l.label,
            detail: l.description,
            recommendedLabel: n === d ? c : null,
            onClick: () => t(d)
          }, d)),
          f.jsx("button", {
            className: "qpm-cancel-btn",
            onClick: a,
            children: "cancel"
          })
        ]
      })
    });
  };
  const hm = 200;
  function pm({ label: n, isSelected: e, onSelect: t }) {
    return f.jsxs("div", {
      className: `dpm-option${e ? " dpm-option--selected" : ""}`,
      onClick: t,
      children: [
        f.jsx("div", {
          className: "dpm-option-label",
          children: n || "Unknown device"
        }),
        e && f.jsx("div", {
          className: "dpm-selected-dot"
        })
      ]
    });
  }
  Lm = function({ title: n, devices: e, selectedDeviceId: t, onSelect: i, onCancel: s }) {
    const [r, o] = _.useState(false), a = _.useRef(null), c = _.useCallback(() => {
      o(false), a.current && clearTimeout(a.current), a.current = setTimeout(s, hm);
    }, [
      s
    ]);
    return _.useEffect(() => {
      const d = requestAnimationFrame(() => o(true));
      return () => cancelAnimationFrame(d);
    }, []), _.useEffect(() => {
      const d = (l) => {
        l.key === "Escape" && c();
      };
      return document.addEventListener("keydown", d), () => {
        document.removeEventListener("keydown", d), a.current && clearTimeout(a.current);
      };
    }, [
      c
    ]), f.jsx("div", {
      className: `modal-backdrop ${r ? "modal-backdrop-open" : ""}`,
      onClick: c,
      children: f.jsxs("div", {
        className: `modal-content ${r ? "modal-content-open" : ""}`,
        onClick: (d) => d.stopPropagation(),
        children: [
          f.jsx("div", {
            className: "dpm-title",
            children: n
          }),
          f.jsx("div", {
            className: "dpm-list",
            children: e.length === 0 ? f.jsx("div", {
              className: "dpm-empty-text",
              children: "no devices found"
            }) : e.map((d) => f.jsx(pm, {
              label: d.label,
              isSelected: d.deviceId === t,
              onSelect: () => i(d.deviceId)
            }, d.deviceId))
          }),
          f.jsx("button", {
            className: "dpm-cancel-btn",
            onClick: c,
            children: "cancel"
          })
        ]
      })
    });
  };
  function mm({ getStore: n, getHistoryStore: e, getToken: t, channelId: i, _deps: s }) {
    const r = (s == null ? void 0 : s.mlsGroup) ?? Vp, o = (s == null ? void 0 : s.mlsStore) ?? Dt, a = (s == null ? void 0 : s.hushCrypto) ?? Ot, c = (s == null ? void 0 : s.api) ?? Mt;
    async function d() {
      const v = await n(), g = t();
      if (!v) throw new Error("[useMLS] No IDB store available");
      if (!g) throw new Error("[useMLS] No auth token available");
      const T = await o.getCredential(v);
      return {
        db: v,
        token: g,
        credential: T,
        mlsStore: o,
        hushCrypto: a,
        api: c
      };
    }
    async function l(v) {
      if (!i) throw new Error("[useMLS] channelId is required for encryptForChannel");
      const g = await d(), { messageBytes: T, localId: S } = await r.encryptMessage(g, i, v);
      return {
        ciphertext: T,
        localId: S
      };
    }
    async function u(v) {
      if (!i) throw new Error("[useMLS] channelId is required for decryptFromChannel");
      const g = await d();
      try {
        const T = await r.decryptMessage(g, i, v);
        if (T.plaintext == null) throw new Error(`[useMLS] decryptFromChannel: non-application message (type=${T.type})`);
        return T.plaintext;
      } catch (T) {
        try {
          await r.catchupCommits(g, i);
          const S = await r.decryptMessage(g, i, v);
          if (S.plaintext != null) return S.plaintext;
        } catch {
        }
        throw T;
      }
    }
    async function h(v) {
      try {
        const g = await n();
        if (g) {
          const T = await o.getLocalPlaintext(g, v);
          if (T) return {
            content: T.plaintext,
            timestamp: T.timestamp
          };
        }
        if (typeof e == "function") {
          const T = await e();
          if (!T) return null;
          const S = await o.getLocalPlaintext(T, v);
          if (S) return {
            content: S.plaintext,
            timestamp: S.timestamp
          };
        }
        return null;
      } catch {
        return null;
      }
    }
    async function m(v, g) {
      try {
        const T = await n();
        if (!T) return;
        await o.setLocalPlaintext(T, v, {
          plaintext: g.content ?? g.plaintext ?? "",
          timestamp: g.timestamp ?? Date.now()
        });
      } catch {
      }
    }
    return {
      encryptForChannel: l,
      decryptFromChannel: u,
      getCachedMessage: h,
      setCachedMessage: m
    };
  }
  const ui = 4e3, fm = 0.8;
  function Ac(n) {
    const e = atob(n), t = new Uint8Array(e.length);
    for (let i = 0; i < e.length; i++) t[i] = e.charCodeAt(i);
    return t;
  }
  function gm(n) {
    let e = "";
    for (let t = 0; t < n.length; t++) e += String.fromCharCode(n[t]);
    return btoa(e);
  }
  const fi = /* @__PURE__ */ new Map(), vm = 6e4;
  function ym(n, e, t) {
    const i = fi.get(n) || [];
    i.push({
      content: e,
      senderId: t,
      timestamp: Date.now()
    }), fi.set(n, i);
  }
  function Nc(n, e, t) {
    const i = fi.get(n);
    if (!(i == null ? void 0 : i.length)) return null;
    const s = Date.now(), r = i.filter((c) => s - c.timestamp < vm);
    if (!r.length) return fi.delete(n), null;
    fi.set(n, r);
    const o = r.findIndex((c) => c.senderId === e && Math.abs(c.timestamp - t) < 1e4);
    if (o < 0) return null;
    const [a] = r.splice(o, 1);
    return r.length || fi.delete(n), a.content;
  }
  async function Ia(n, e, { decryptFromChannel: t, getCachedMessage: i, setCachedMessage: s }) {
    const r = new Date(n.timestamp).getTime();
    if (typeof i == "function") {
      const c = await i(n.id);
      if (c) return {
        id: n.id,
        sender: c.senderId ?? n.senderId,
        content: c.content,
        timestamp: c.timestamp,
        decryptionFailed: false
      };
    }
    if (n.senderId === e) {
      const c = Nc(n.channelId, n.senderId, r);
      if (c !== null) return typeof s == "function" && await s(n.id, {
        content: c,
        senderId: n.senderId,
        timestamp: r
      }), {
        id: n.id,
        sender: n.senderId,
        content: c,
        timestamp: r,
        decryptionFailed: false
      };
    }
    let o = null, a = false;
    try {
      const c = Ac(n.ciphertext);
      o = await t(c), typeof s == "function" && await s(n.id, {
        content: o,
        senderId: n.senderId,
        timestamp: r
      });
    } catch (c) {
      console.warn("[chat] Decrypt failed for msg", n.id, "from", n.senderId, c), a = true;
    }
    return {
      id: n.id,
      sender: n.senderId,
      content: o,
      timestamp: r,
      decryptionFailed: a
    };
  }
  async function xa(n, e, t, i) {
    const { ciphertext: s } = await i(t);
    n.send("message.send", {
      channel_id: e,
      ciphertext: gm(s)
    });
  }
  Um = function({ channelId: n, serverId: e, currentUserId: t, getToken: i, getStore: s, getHistoryStore: r, wsClient: o, members: a = [], onNewMessage: c, baseUrl: d = "" }) {
    const [l, u] = _.useState([]), [h, m] = _.useState(""), [v, g] = _.useState(0), [T, S] = _.useState(false), [I, P] = _.useState(false), [b, k] = _.useState(true), [w, A] = _.useState(true), U = _.useRef(null), D = _.useRef(null), N = _.useRef(null), L = _.useRef(null), q = _.useRef(/* @__PURE__ */ new Set()), ne = _.useRef(o);
    ne.current = o;
    const ye = _.useRef(null), Qe = _.useMemo(() => {
      const j = /* @__PURE__ */ new Map();
      for (const W of a) {
        const Z = W.userId ?? W.id;
        Z && W.displayName && j.set(Z, W.displayName);
      }
      return j;
    }, [
      a
    ]), { encryptForChannel: B, decryptFromChannel: de, getCachedMessage: Ne, setCachedMessage: Oe } = mm({
      getStore: s ?? (() => Promise.resolve(null)),
      getHistoryStore: r ?? (() => Promise.resolve(null)),
      getToken: i ?? (() => null),
      channelId: n
    }), Re = _.useRef(de);
    Re.current = de;
    const ot = _.useRef(B);
    ot.current = B;
    const De = _.useRef(Ne);
    De.current = Ne;
    const Ce = _.useRef(Oe);
    Ce.current = Oe;
    const se = o, Pe = _.useRef(n);
    _.useEffect(() => {
      if (!n || !e || !i) return;
      const j = i();
      if (!j) return;
      q.current = /* @__PURE__ */ new Set(), L.current = null, ye.current = null, (async () => {
        try {
          const Z = await fr(j, e, n, {
            limit: 50
          }, d), J = [];
          for (let $ = Z.length - 1; $ >= 0; $--) {
            const te = Z[$];
            J.push(await Ia(te, t, {
              decryptFromChannel: Re.current,
              getCachedMessage: De.current,
              setCachedMessage: Ce.current
            })), q.current.add(te.id);
          }
          Pe.current = n, u(J), k(Z.length >= 50), m("");
        } catch (Z) {
          console.error("[chat] Load history failed:", Z.message), Pe.current = n, u([]);
        } finally {
          A(false);
        }
      })();
    }, [
      n,
      e,
      i,
      t
    ]);
    const mt = _.useCallback(async () => {
      var _a2;
      if (!n || !e || !i || I || !b || l.length === 0) return;
      const j = i();
      if (!j) return;
      const W = (_a2 = l[0]) == null ? void 0 : _a2.timestamp;
      if (W) {
        P(true);
        try {
          const Z = new Date(W).toISOString(), J = await fr(j, e, n, {
            before: Z,
            limit: 50
          }, d);
          if (J.length === 0) {
            k(false);
            return;
          }
          J.length < 50 && k(false);
          const $ = [];
          for (let ke = J.length - 1; ke >= 0; ke--) {
            const Pt = J[ke];
            q.current.has(Pt.id) || (q.current.add(Pt.id), $.push(await Ia(Pt, t, {
              decryptFromChannel: Re.current,
              getCachedMessage: De.current,
              setCachedMessage: Ce.current
            })));
          }
          const te = D.current, _e = (te == null ? void 0 : te.scrollHeight) ?? 0, ai = (te == null ? void 0 : te.scrollTop) ?? 0;
          ye.current = {
            oldScrollHeight: _e,
            oldScrollTop: ai
          }, u((ke) => [
            ...$,
            ...ke
          ]);
        } catch (Z) {
          console.error("[chat] Load more failed:", Z.message);
        } finally {
          P(false);
        }
      }
    }, [
      n,
      e,
      i,
      l,
      I,
      b,
      t
    ]), Ye = _.useCallback(() => {
      const j = D.current;
      !j || I || !b || j.scrollTop < 80 && mt();
    }, [
      mt,
      I,
      b
    ]);
    _.useEffect(() => {
      if (!se || !n) return;
      function j() {
        se.isConnected() && se.send("subscribe", {
          channel_id: n
        });
      }
      j(), se.on("open", j);
      const W = async (J) => {
        var _a2;
        if (J.channel_id !== n) return;
        const $ = J.id || `msg-${Date.now()}`;
        if (q.current.has($)) return;
        q.current.add($);
        const te = J.sender_id, _e = J.timestamp ? new Date(J.timestamp).getTime() : Date.now();
        if (te === t && J.sender_device_id === Oa()) {
          const Ze = Nc(J.channel_id, t, _e);
          u((Mi) => {
            const tn = Mi.findIndex((Qt) => Qt.pending && Qt.sender === t);
            return tn < 0 ? Mi : Mi.map((Qt, Gn) => Gn === tn ? {
              ...Qt,
              id: $,
              pending: false,
              failed: false,
              timestamp: _e
            } : Qt);
          }), Ze !== null && ((_a2 = Ce.current) == null ? void 0 : _a2.call(Ce, $, {
            content: Ze,
            senderId: t,
            timestamp: _e
          }));
          return;
        }
        let ke = null, Pt = false;
        const en = J.ciphertext;
        if (en) try {
          const Ze = Ac(en);
          ke = await Re.current(Ze), Ce.current && Ce.current($, {
            content: ke,
            senderId: te,
            timestamp: _e
          });
        } catch (Ze) {
          console.warn("[chat] realtime decrypt failed", {
            channelId: J.channel_id,
            messageId: $,
            senderId: te,
            err: (Ze == null ? void 0 : Ze.message) ?? String(Ze)
          }), Pt = true;
        }
        const qn = {
          id: $,
          sender: te,
          content: ke,
          timestamp: _e,
          decryptionFailed: Pt
        };
        c == null ? void 0 : c(), u((Ze) => [
          ...Ze,
          qn
        ]);
      }, Z = (J) => {
        (J.code === "forbidden" || J.code === "internal") && u(($) => $.map((te) => te.pending ? {
          ...te,
          failed: true
        } : te));
      };
      return se.on("message.new", W), se.on("error", Z), () => {
        se.off("open", j), se.off("message.new", W), se.off("error", Z), se.isConnected() && se.send("unsubscribe", {
          channel_id: n
        });
      };
    }, [
      se,
      n,
      t,
      c
    ]), _.useEffect(() => {
      var _a2;
      const j = ye.current;
      if (j) {
        ye.current = null;
        const W = D.current;
        if (W && j.oldScrollHeight > 0) {
          const Z = W.scrollHeight;
          W.scrollTop = Z - j.oldScrollHeight + j.oldScrollTop;
        }
        return;
      }
      (_a2 = U.current) == null ? void 0 : _a2.scrollIntoView({
        behavior: "smooth"
      });
    }, [
      l
    ]);
    const Ht = async () => {
      var _a2;
      const j = h.trim();
      if (!j || T || !n || !se || new TextEncoder().encode(j).byteLength > ui || !(i == null ? void 0 : i())) return;
      const Z = `temp-${Date.now()}`, J = {
        id: Z,
        sender: t,
        content: j,
        timestamp: Date.now(),
        decryptionFailed: false,
        pending: true,
        failed: false
      };
      u(($) => [
        ...$,
        J
      ]), m(""), (_a2 = N.current) == null ? void 0 : _a2.focus(), L.current = Z, S(true), ym(n, j, t);
      try {
        await xa(se, n, j, ot.current);
      } catch ($) {
        console.error("[chat] Send failed:", ($ == null ? void 0 : $.message) ?? $), u((te) => te.map((_e) => _e.id === Z ? {
          ..._e,
          failed: true
        } : _e));
      } finally {
        L.current = null, S(false);
      }
    }, ft = async (j) => {
      if (!n || !se || j.failed !== true) return;
      const W = (j.content || "").trim();
      if (!W) return;
      const Z = j.id;
      u((J) => J.map(($) => $.id === Z ? {
        ...$,
        failed: false,
        pending: true
      } : $));
      try {
        await xa(se, n, W, ot.current);
      } catch (J) {
        console.error("[chat] Retry send failed:", J.message), u(($) => $.map((te) => te.id === Z ? {
          ...te,
          failed: true
        } : te));
      }
    }, Xe = (j) => {
      j.key === "Enter" && !j.shiftKey && (j.preventDefault(), Ht());
    }, Jt = (j) => new Date(j).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    }), zt = Pe.current !== n, Rt = zt ? [] : l, $t = Rt.length > 0;
    return f.jsxs("div", {
      className: "chat-container",
      children: [
        f.jsx("div", {
          className: "chat-messages-section",
          children: f.jsxs("div", {
            ref: D,
            onScroll: Ye,
            className: `chat-messages-scroll${$t ? " chat-messages-scroll--has-messages" : ""}`,
            children: [
              !zt && b && (I || Rt.length > 0) && f.jsx("div", {
                className: "chat-load-more-hint",
                children: I ? "Loading\u2026" : "Scroll up for older messages"
              }),
              zt || w ? f.jsx("div", {
                className: "chat-empty",
                children: f.jsx("div", {
                  className: "chat-empty-text",
                  children: "Loading\u2026"
                })
              }) : $t ? Rt.map((j, W) => {
                const Z = j.sender === t, J = j.failed === true, $ = j.pending === true, te = W > 0 ? Rt[W - 1] : null, _e = km(te, j), ai = Z ? "You" : Qe.get(j.sender) ?? bm(j.sender), ke = te ? gi(j.timestamp) !== gi(te.timestamp) : true;
                return f.jsxs("div", {
                  children: [
                    ke && f.jsx("div", {
                      className: "date-separator",
                      children: f.jsx("span", {
                        className: "date-separator-label",
                        children: Sm(j.timestamp)
                      })
                    }),
                    f.jsxs("div", {
                      className: [
                        "chat-message-row",
                        _e ? "message-consecutive" : "",
                        Z ? "chat-message-row--own" : "",
                        J ? "chat-message-row--failed" : "",
                        $ ? "chat-message-row--pending" : ""
                      ].filter(Boolean).join(" "),
                      children: [
                        !_e && f.jsxs("div", {
                          className: "chat-message-header",
                          children: [
                            f.jsx("span", {
                              className: `chat-username${Z ? " chat-username--own" : ""}`,
                              children: ai
                            }),
                            f.jsx("span", {
                              className: "chat-timestamp message-timestamp",
                              children: Jt(j.timestamp)
                            })
                          ]
                        }),
                        _e && f.jsx("span", {
                          className: "chat-timestamp message-timestamp",
                          children: Jt(j.timestamp)
                        }),
                        f.jsx("div", {
                          className: "chat-body",
                          children: j.decryptionFailed ? f.jsx("span", {
                            className: "chat-decryption-failed",
                            children: "Message encrypted - decryption key no longer available"
                          }) : j.content
                        }),
                        $ && f.jsx("div", {
                          className: "chat-pending-indicator",
                          children: "sending\u2026"
                        }),
                        J && f.jsx("div", {
                          className: "chat-retry-wrapper",
                          children: f.jsx("button", {
                            type: "button",
                            className: "chat-retry-btn",
                            onClick: () => ft(j),
                            children: "Retry"
                          })
                        })
                      ]
                    })
                  ]
                }, j.id);
              }) : f.jsxs("div", {
                className: "chat-empty",
                children: [
                  f.jsx("div", {
                    className: "chat-empty-icon",
                    children: f.jsx("svg", {
                      width: "20",
                      height: "20",
                      viewBox: "0 0 24 24",
                      fill: "none",
                      stroke: "currentColor",
                      strokeWidth: "1.5",
                      children: f.jsx("path", {
                        d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                      })
                    })
                  }),
                  f.jsx("div", {
                    className: "chat-empty-text",
                    children: "no messages yet, start the conversation"
                  })
                ]
              }),
              $t && f.jsx("div", {
                ref: U
              })
            ]
          })
        }),
        f.jsx("div", {
          className: "chat-input-bar",
          children: f.jsxs("div", {
            className: "chat-input-wrapper",
            children: [
              f.jsx("textarea", {
                id: "chat-message",
                name: "message",
                ref: N,
                className: "chat-input",
                value: h,
                onChange: (j) => {
                  const W = j.target.value;
                  m(W), g(new TextEncoder().encode(W).byteLength);
                },
                onKeyDown: Xe,
                placeholder: "Message...",
                rows: 1,
                disabled: T,
                autoComplete: "off"
              }),
              v >= ui * fm && f.jsx("span", {
                className: `chat-byte-counter${v > ui ? " chat-byte-counter--over" : ""}`,
                "aria-live": "polite",
                children: ui - v
              }),
              f.jsx("button", {
                className: `chat-send-btn${!h.trim() || T || v > ui ? " chat-send-btn--disabled" : ""}`,
                onClick: Ht,
                disabled: !h.trim() || T || v > ui,
                children: "Send"
              })
            ]
          })
        })
      ]
    });
  };
  function bm(n) {
    return n ? n.slice(0, 8) + "\u2026" : "User";
  }
  function km(n, e) {
    return !n || !e || n.sender !== e.sender || n.pending || e.pending ? false : Math.abs(e.timestamp - n.timestamp) < 5 * 60 * 1e3;
  }
  function gi(n) {
    const e = new Date(n);
    return `${e.getFullYear()}-${String(e.getMonth() + 1).padStart(2, "0")}-${String(e.getDate()).padStart(2, "0")}`;
  }
  function Sm(n) {
    const e = new Date(n), t = /* @__PURE__ */ new Date(), i = new Date(t);
    return i.setDate(t.getDate() - 1), gi(e.getTime()) === gi(t.getTime()) ? "Today" : gi(e.getTime()) === gi(i.getTime()) ? "Yesterday" : e.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  }
});
export {
  Um as C,
  Lm as D,
  Nm as Q,
  Mm as S,
  C as T,
  Dm as V,
  __tla,
  Om as a,
  Am as b,
  Rc as c,
  _c as d,
  _m as e,
  Lp as f,
  Im as g,
  Fp as h,
  xn as j,
  Np as l,
  xm as m,
  Pc as p,
  Mp as r,
  Pm as u
};
