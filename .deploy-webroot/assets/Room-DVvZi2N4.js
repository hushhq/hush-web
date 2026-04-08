import { F as Nt, G as Ct, u as Et, H as Rt, j as e, q as te, h as se } from "./index-BefR8mbE.js";
import { u as Mt, b as Tt, f as _t, r as a } from "./vendor-react-2AhYlJPv.js";
import { u as Pt, e as Wt, g as Lt, m as Ut, T as E, S as At, a as We, C as Le, Q as Dt, D as Ue, b as Qt } from "./Chat-DEDH4du2.js";
import { D as $t, M as f, S as Ot, i as Ae } from "./constants-AlQXj8D-.js";
function A(s) {
  return { width: "6px", height: "6px", borderRadius: "50%", background: s ? "var(--hush-live)" : "var(--hush-text-muted)", boxShadow: s ? "0 0 6px var(--hush-live-glow)" : "none" };
}
function Bt(s, r) {
  return { flex: 1, display: "grid", gap: "6px", padding: "6px", overflow: s && r !== 2 ? "auto" : "hidden", alignItems: s && r !== 2 ? "start" : "stretch", alignContent: s && r !== 2 ? "start" : void 0, justifyItems: "stretch", minHeight: 0 };
}
function Ft(s) {
  const r = Math.floor(s / 1e3), o = Math.floor(r / 3600), l = Math.floor(r % 3600 / 60), d = r % 60;
  return o > 0 ? `${o}:${String(l).padStart(2, "0")}:${String(d).padStart(2, "0")}` : `${l}:${String(d).padStart(2, "0")}`;
}
function De(s) {
  return s <= 1 ? 1 : s <= 5 ? 2 : 3;
}
function Ht(s, r) {
  if (s === 0) return {};
  if (r === "mobile") return s === 1 ? { gridTemplateColumns: "1fr" } : s === 2 ? { gridTemplateColumns: "1fr", gridTemplateRows: "1fr 1fr" } : { gridTemplateColumns: "1fr 1fr" };
  const o = De(s), l = Math.ceil(s / o);
  return o === 1 ? { gridTemplateColumns: "1fr", gridTemplateRows: "1fr" } : { gridTemplateColumns: `repeat(${o}, 1fr)`, gridTemplateRows: `repeat(${l}, minmax(0, 1fr))` };
}
function Yt(s) {
  if (s.length === 0) return null;
  const r = s.filter((l) => Ae(l.source));
  if (r.length === 1) return r[0].id;
  const o = s.find((l) => l.type === "local" && !Ae(l.source));
  return o ? o.id : s[0].id;
}
function Vt(s, r) {
  if (!r) return s;
  const o = s.find((l) => l.id === r);
  return o ? [...s.filter((l) => l.id !== r), o] : s;
}
function qt(s) {
  if (!s || typeof s != "string") return "Something went wrong. Please try again.";
  const r = s.trim();
  return r.length <= 80 && !r.includes("http") && !/^[A-Za-z]+Error:/i.test(r) ? r : /room not found|not found/i.test(r) ? "Room not found." : /disconnected|disconnect/i.test(r) ? r : "Something went wrong. Please try again.";
}
function zt(s) {
  const r = `${s.pathname}${s.search}${s.hash}`;
  return `/?returnTo=${encodeURIComponent(r)}`;
}
function as() {
  const s = Mt(), r = Tt(), { roomName: o } = _t(), l = Nt(), d = l === "mobile", [Kt, Qe] = a.useState(false), ne = a.useRef(!!sessionStorage.getItem("hush_channelId")), ae = sessionStorage.getItem("hush_serverId"), [$e, Zt] = a.useState(() => decodeURIComponent(o)), [re, w] = a.useState($t), [Oe, oe] = a.useState(null), [Be, ie] = a.useState(null), [Jt, ce] = a.useState(null), D = a.useRef({ bytesSent: null, timestamp: null }), [p, Q] = a.useState(false), [$, O] = a.useState(false), [B, F] = a.useState(false), [u, y] = a.useState(false), [Fe, j] = a.useState(false), [R, H] = a.useState(null), [le, Y] = a.useState(false), [He, M] = a.useState(false), [Ye, T] = a.useState(false), [h, b] = a.useState(false), [Ve, de] = a.useState(false), [V, Xt] = a.useState(null), [q, qe] = a.useState(null), [ze, ue] = a.useState(0), [Ge, he] = a.useState(false), me = a.useRef(false), fe = a.useRef(false), [z, pe] = a.useState(null), Se = a.useRef(null), _ = a.useRef(null), ge = a.useCallback(() => sessionStorage.getItem("hush_jwt") ?? sessionStorage.getItem("hush_token") ?? null, []);
  a.useEffect(() => {
    if (!sessionStorage.getItem("hush_channelId")) return;
    const n = typeof location < "u" ? location.origin.replace(/^http/, "ws") : "", i = n ? `${n}/ws` : void 0;
    if (!i) return;
    const c = Ct({ url: i, getToken: ge });
    return Se.current = c, c.connect(), pe(c), () => {
      c.disconnect(), Se.current = null, pe(null);
    };
  }, []);
  const { user: P, hasSession: k, needsUnlock: I, rehydrationAttempted: N } = Et(), { isReady: G, error: ve, localTracks: W, remoteTracks: K, participants: S, connectRoom: ye, disconnectRoom: Z, publishScreen: Ke, unpublishScreen: Ze, changeQuality: Je, publishWebcam: xe, unpublishWebcam: we, publishMic: je, unpublishMic: be, availableScreens: Xe, watchedScreens: et, loadingScreens: tt, watchScreen: st, unwatchScreen: nt } = Pt({ wsClient: z, getToken: ge, currentUserId: (P == null ? void 0 : P.id) ?? "", getStore: () => te((P == null ? void 0 : P.id) ?? "", se()) }), ke = zt(r), { audioDevices: at, videoDevices: rt, selectedMicId: Ie, selectedWebcamId: Ne, selectMic: ot, selectWebcam: it, hasSavedMic: ct, hasSavedWebcam: lt, requestPermission: L } = Rt();
  a.useEffect(() => {
    if (!N) return;
    if (I) {
      s(ke, { replace: true });
      return;
    }
    const t = ne.current ? "/" : "/?join=" + encodeURIComponent(o);
    if (!k) {
      s(t, { replace: true });
      return;
    }
    const n = sessionStorage.getItem("hush_channelId"), i = sessionStorage.getItem("hush_roomName");
    if (!n || !i) {
      s(t, { replace: true });
      return;
    }
    ne.current = true;
  }, [k, s, I, N, o, ke]), a.useEffect(() => {
    if (!N || !k || I) return;
    const t = sessionStorage.getItem("hush_channelId"), n = sessionStorage.getItem("hush_roomName");
    if (!t || !n) return;
    const i = sessionStorage.getItem("hush_displayName") || "Anonymous";
    return ye(o, i, t).then(() => {
      Qe(true), console.log("[room] Connected to LiveKit room");
    }).catch((g) => {
      console.error("[room] Connection failed:", g), g.message === "Room not found" && s("/", { replace: true });
    }), typeof window < "u" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") ? (oe("source"), ie(100), w("source")) : Wt().then((g) => {
      const m = Lt(g);
      oe(m.key), ie(m.uploadMbps), w(m.key);
    }), () => {
      Z();
    };
  }, [ye, Z, k, s, I, N, o]), a.useEffect(() => {
    const n = Array.from(W.entries()).filter(([, c]) => c.source === f.SCREEN || c.source === f.WEBCAM).map(([, c]) => c.track);
    if (n.length === 0) {
      ce(null), D.current = { bytesSent: null, timestamp: null };
      return;
    }
    const i = setInterval(async () => {
      const { bytesSent: c, timestamp: g } = D.current, m = await Ut(n, c, g);
      D.current = { bytesSent: m.bytesSent, timestamp: m.timestamp }, ce(m.mbps > 0 ? Math.round(m.mbps * 10) / 10 : null);
    }, 2e3);
    return () => clearInterval(i);
  }, [W]), a.useEffect(() => {
    h && u && y(false);
  }, [h, u]), a.useEffect(() => {
    u && h && b(false);
  }, [u, h]), a.useEffect(() => {
    me.current = h, h && ue(0);
  }, [h]);
  const Ce = a.useCallback(() => {
    me.current || ue((t) => t + 1);
  }, []);
  a.useEffect(() => {
    fe.current = u, u && he(false);
  }, [u]), a.useEffect(() => {
    p || Y(false);
  }, [p]), a.useEffect(() => {
    if (!R) return;
    const t = setTimeout(() => H(null), 4e3);
    return () => clearTimeout(t);
  }, [R]), a.useEffect(() => {
    if (!G) return;
    if (_.current === null) {
      _.current = new Set(S.map((n) => n.id));
      return;
    }
    S.some((n) => !_.current.has(n.id)) && !fe.current && he(true), S.forEach((n) => _.current.add(n.id));
  }, [S, G]), a.useEffect(() => {
    if (V == null) return;
    const t = () => {
      const i = Math.max(0, V - Date.now());
      qe(i), i <= 0 && (sessionStorage.removeItem("hush_token"), sessionStorage.removeItem("hush_peerId"), sessionStorage.removeItem("hush_roomName"), sessionStorage.removeItem("hush_channelId"), sessionStorage.removeItem("hush_actualRoomName"), s("/", { replace: true, state: { message: "This room has ended." } }));
    };
    t();
    const n = setInterval(t, 1e3);
    return () => clearInterval(n);
  }, [V, s]);
  const dt = async () => {
    p ? (await Ze(), Q(false)) : j(true);
  }, ut = async (t) => {
    var _a;
    j(false), w(t);
    try {
      const n = await Ke(t);
      if (!n) return;
      Q(true), (_a = n.getVideoTracks()[0]) == null ? void 0 : _a.addEventListener("ended", () => {
        Q(false);
      });
    } catch (n) {
      console.error("[room] Screen share failed:", n);
    }
  }, ht = async (t) => {
    if (p) try {
      await yt(t), j(false);
    } catch {
    }
    else await ut(t);
  }, mt = async () => {
    $ ? (await be(), O(false)) : ct ? (await je(Ie), O(true)) : (await L("audio"), M(true));
  }, ft = async (t) => {
    M(false), ot(t), $ && await be(), await je(t), O(true);
  }, pt = async () => {
    B ? (await we(), F(false)) : lt ? (await xe(Ne), F(true)) : (await L("video"), T(true));
  }, St = async (t) => {
    T(false), it(t), B && await we(), await xe(t), F(true);
  }, gt = async () => {
    await L("audio"), M(true);
  }, vt = async () => {
    await L("video"), T(true);
  }, yt = async (t) => {
    const n = re;
    H(null);
    try {
      p && await Je(t), w(t), y(false);
    } catch (i) {
      throw w(n), H((i == null ? void 0 : i.message) || "Quality change failed"), i;
    }
  }, Ee = async () => {
    const n = async () => {
      sessionStorage.removeItem("hush_token"), sessionStorage.removeItem("hush_peerId"), sessionStorage.removeItem("hush_roomName"), sessionStorage.removeItem("hush_channelId"), sessionStorage.removeItem("hush_actualRoomName"), s("/");
    };
    try {
      await Promise.race([Z(), new Promise((i, c) => setTimeout(() => c(new Error("Leave timeout")), 5e3))]);
    } catch (i) {
      console.error("[Room] Leave/disconnect error:", i);
    } finally {
      await n();
    }
  }, C = [], Re = /* @__PURE__ */ new Set();
  for (const [t, n] of W.entries()) if (n.track.kind === "video") {
    if (n.source === f.SCREEN && !le) continue;
    let i = null;
    if (n.source === f.SCREEN) {
      for (const [, c] of W.entries()) if (c.source === f.SCREEN_AUDIO) {
        i = c.track.mediaStreamTrack;
        break;
      }
    }
    C.push({ id: t, type: "local", track: n.track.mediaStreamTrack, audioTrack: i, label: n.source === f.SCREEN ? "Your Screen" : "Your Webcam", source: n.source });
  }
  for (const [t, n] of K.entries()) if (n.kind === "video") {
    const i = n.participant.identity, c = n.source, g = c === E.Source.ScreenShare ? E.Source.ScreenShareAudio : E.Source.Microphone;
    let m = null;
    for (const [It, U] of K.entries()) if (U.kind === "audio" && U.source === g && U.participant.identity === i) {
      m = U.track.mediaStreamTrack, Re.add(It);
      break;
    }
    C.push({ id: t, type: "remote", track: n.track.mediaStreamTrack, audioTrack: m, label: n.participant.name || n.participant.identity, source: c === E.Source.ScreenShare ? f.SCREEN : f.WEBCAM });
  }
  const Me = [];
  for (const [t, n] of K.entries()) n.kind === "audio" && !Re.has(t) && Me.push({ id: t, track: n.track.mediaStreamTrack });
  const x = [];
  for (const [t, n] of Xe.entries()) n.source === E.Source.ScreenShare && !et.has(t) && x.push({ producerId: t, peerId: n.participantId, peerName: n.participantName });
  const Te = p && !le, v = C.length + x.length + (Te ? 1 : 0), xt = Ht(v, l), _e = Yt(C), Pe = d ? 2 : De(v), J = v > 1 && v % Pe === 1, wt = Vt(C, _e), X = d && v !== 2 ? { aspectRatio: "1", width: "100%", minWidth: 0 } : { display: "contents" }, ee = () => d ? { gridColumn: "1 / -1", aspectRatio: "1", width: "100%", minWidth: 0 } : { gridColumn: "1 / -1", justifySelf: "center", width: Pe === 2 ? "calc(50% - 3px)" : "calc(33.33% - 4px)", display: "block", minHeight: 0 }, jt = (t) => J && x.length === 0 && t === _e ? ee() : X, bt = (t) => J && t === x.length - 1 ? ee() : X, kt = () => J && x.length === 0 ? ee() : X;
  if (!N) return e.jsx("div", { className: "room-page", style: { alignItems: "center", justifyContent: "center" }, children: e.jsx("span", { style: { color: "var(--hush-text-muted)" }, children: "Loading\u2026" }) });
  if (I || !k) return null;
  if (ve) {
    const t = qt(ve);
    return e.jsx("div", { className: "room-page", children: e.jsxs("div", { className: "room-error-center", children: [e.jsx("p", { className: "room-error-text", children: t }), e.jsx("button", { type: "button", onClick: Ee, className: "btn btn-primary", style: { padding: "10px 20px" }, children: "Leave" })] }) });
  }
  return e.jsxs("div", { className: "room-page", children: [e.jsxs("div", { className: "room-header", children: [e.jsxs("div", { className: "room-header-left", children: [e.jsx("span", { className: "room-title", children: $e }), e.jsxs("span", { className: "room-header-badge", children: [e.jsx("span", { className: "live-dot" }), "Live"] })] }), e.jsxs("div", { className: "room-header-right", children: [e.jsxs("button", { className: "room-participant-count", title: "Copy room link", onClick: async () => {
    try {
      await navigator.clipboard.writeText(window.location.href), de(true), setTimeout(() => de(false), 2e3);
    } catch {
      console.warn("[room] Clipboard write failed");
    }
  }, children: [e.jsxs("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [e.jsx("path", { d: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" }), e.jsx("path", { d: "M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" })] }), Ve ? "copied!" : "Link"] }), e.jsxs("button", { className: "room-participant-count", title: "Chat", onClick: () => {
    y(false), b((t) => !t);
  }, children: [e.jsx("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: e.jsx("path", { d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" }) }), "Chat", ze > 0 && e.jsx("span", { className: "room-unread-dot" })] }), e.jsxs("button", { className: "room-participant-count", title: "Room panel", onClick: () => {
    b(false), y((t) => !t);
  }, children: [e.jsxs("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [e.jsx("path", { d: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" }), e.jsx("circle", { cx: "9", cy: "7", r: "4" }), e.jsx("path", { d: "M23 21v-2a4 4 0 0 0-3-3.87" }), e.jsx("path", { d: "M16 3.13a4 4 0 0 1 0 7.75" })] }), S.length + 1, Ge && e.jsx("span", { className: "room-unread-dot" })] })] })] }), e.jsxs("div", { className: "room-main", children: [q != null && q > 0 && e.jsx("div", { className: "room-countdown", "aria-live": "polite", children: Ft(q) }), e.jsx("div", { style: { ...Bt(d, v), ...xt }, children: v === 0 ? e.jsxs("div", { className: "room-empty", children: [e.jsx("div", { className: "room-empty-icon", children: e.jsxs("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "var(--hush-text-ghost)", strokeWidth: "1.5", children: [e.jsx("rect", { x: "2", y: "3", width: "20", height: "14", rx: "2", ry: "2" }), e.jsx("line", { x1: "8", y1: "21", x2: "16", y2: "21" }), e.jsx("line", { x1: "12", y1: "17", x2: "12", y2: "21" })] }) }), e.jsx("div", { className: "room-empty-title", children: "no active streams" }), e.jsx("div", { className: "room-empty-description", children: "click share to start streaming" })] }) : e.jsxs(e.Fragment, { children: [wt.map((t) => e.jsx("div", { style: jt(t.id), children: e.jsx(At, { track: t.track, audioTrack: t.audioTrack, label: t.label, source: t.source, isLocal: t.type === "local", objectFit: d ? "cover" : "contain", onUnwatch: t.type === "remote" && t.source === f.SCREEN ? () => nt(t.id) : t.type === "local" && t.source === f.SCREEN ? () => Y(false) : void 0, standByAfterMs: t.source === f.SCREEN ? Ot : void 0 }) }, t.id)), Te && e.jsx("div", { style: kt(), children: e.jsx(We, { isSelf: true, onWatch: () => Y(true) }) }, "local-screen-card"), x.map((t, n) => e.jsx("div", { style: bt(n), children: e.jsx(We, { peerName: t.peerName, isLoading: tt.has(t.producerId), onWatch: () => st(t.producerId) }) }, t.producerId))] }) }), d ? e.jsxs(e.Fragment, { children: [e.jsx("div", { className: `sidebar-overlay ${u ? "sidebar-overlay-open" : ""}`, onClick: () => y(false), "aria-hidden": !u }), e.jsx("div", { className: `sidebar-panel-right ${u ? "sidebar-panel-open" : ""}`, children: e.jsxs("div", { className: "room-sidebar-section", children: [e.jsxs("div", { className: "room-sidebar-label", children: ["Participants (", S.length + 1, ")"] }), e.jsxs("div", { className: "room-peer-item", children: [e.jsx("div", { style: A(p) }), e.jsx("span", { children: "You" })] }), S.map((t) => e.jsxs("div", { className: "room-peer-item", children: [e.jsx("div", { style: A(true) }), e.jsx("span", { children: t.displayName })] }, t.id))] }) }), e.jsx("div", { className: `sidebar-overlay ${h ? "sidebar-overlay-open" : ""}`, onClick: () => b(false), "aria-hidden": !h }), e.jsx("div", { className: `sidebar-panel-right ${h ? "sidebar-panel-open" : ""}`, children: e.jsxs("div", { className: "room-sidebar-section", children: [e.jsx("div", { className: "room-sidebar-label", children: "Chat" }), e.jsx(Le, { channelId: sessionStorage.getItem("hush_channelId"), serverId: ae, currentUserId: (P == null ? void 0 : P.id) ?? "", getToken: () => sessionStorage.getItem("hush_jwt") ?? sessionStorage.getItem("hush_token") ?? null, getStore: () => {
    const t = sessionStorage.getItem("hush_userId");
    return t ? te(t, se()) : Promise.resolve(null);
  }, wsClient: z, recipientUserIds: sessionStorage.getItem("hush_peerId") ? [sessionStorage.getItem("hush_peerId")] : [], onNewMessage: Ce })] }) })] }) : e.jsxs(e.Fragment, { children: [e.jsx("div", { className: `sidebar-overlay ${u || h ? "sidebar-overlay-open" : ""}`, onClick: () => {
    y(false), b(false);
  }, "aria-hidden": !u && !h }), e.jsx("div", { className: `sidebar-desktop ${u ? "sidebar-desktop-open" : ""}`, children: e.jsx("div", { className: "sidebar-desktop-inner room-sidebar-inner", children: e.jsxs("div", { className: "room-sidebar-section", children: [e.jsxs("div", { className: "room-sidebar-label", children: ["Participants (", S.length + 1, ")"] }), e.jsxs("div", { className: "room-peer-item", children: [e.jsx("div", { style: A(p) }), e.jsx("span", { children: "You" })] }), S.map((t) => e.jsxs("div", { className: "room-peer-item", children: [e.jsx("div", { style: A(true) }), e.jsx("span", { children: t.displayName })] }, t.id))] }) }) }), e.jsx("div", { className: `sidebar-desktop ${h ? "sidebar-desktop-open" : ""}`, children: e.jsx("div", { className: "sidebar-desktop-inner room-sidebar-inner", children: e.jsxs("div", { className: "room-sidebar-section", children: [e.jsx("div", { className: "room-sidebar-label", children: "Chat" }), e.jsx(Le, { channelId: sessionStorage.getItem("hush_channelId"), serverId: ae, currentUserId: (P == null ? void 0 : P.id) ?? "", getToken: () => sessionStorage.getItem("hush_jwt") ?? sessionStorage.getItem("hush_token") ?? null, getStore: () => {
    const t = sessionStorage.getItem("hush_userId");
    return t ? te(t, se()) : Promise.resolve(null);
  }, wsClient: z, recipientUserIds: sessionStorage.getItem("hush_peerId") ? [sessionStorage.getItem("hush_peerId")] : [], onNewMessage: Ce })] }) }) })] })] }), Me.map((t) => e.jsx(Gt, { track: t.track }, t.id)), Fe && e.jsx(Dt, { recommendedQualityKey: Oe, recommendedUploadMbps: Be, onSelect: ht, onCancel: () => j(false) }), He && e.jsx(Ue, { title: "choose microphone", devices: at, selectedDeviceId: Ie, onSelect: ft, onCancel: () => M(false) }), Ye && e.jsx(Ue, { title: "choose webcam", devices: rt, selectedDeviceId: Ne, onSelect: St, onCancel: () => T(false) }), e.jsx(Qt, { isReady: G, isScreenSharing: p, isMicOn: $, isWebcamOn: B, quality: re, isMobile: d, onScreenShare: dt, onOpenQualityOrWindow: () => j(true), onMic: mt, onWebcam: pt, onMicDeviceSwitch: gt, onWebcamDeviceSwitch: vt, onLeave: Ee }), R && e.jsx("div", { className: "toast", role: "alert", children: R })] });
}
function Gt({ track: s }) {
  const r = a.useRef(null);
  return a.useEffect(() => {
    if (!r.current || !s) return;
    const o = r.current;
    return o.srcObject = new MediaStream([s]), (async () => {
      try {
        await o.play();
      } catch {
        const d = () => {
          o.play().catch(() => {
          }), document.removeEventListener("touchstart", d), document.removeEventListener("click", d);
        };
        document.addEventListener("touchstart", d, { once: true }), document.addEventListener("click", d, { once: true });
      }
    })(), () => {
      o.srcObject = null;
    };
  }, [s]), e.jsx("audio", { ref: r, autoPlay: true, playsInline: true, style: { display: "none" } });
}
export {
  as as default
};
