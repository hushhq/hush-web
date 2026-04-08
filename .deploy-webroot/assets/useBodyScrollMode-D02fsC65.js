import { r as d } from "./vendor-react-2AhYlJPv.js";
const s = Object.freeze({ LOCKED: "locked", SCROLL: "scroll" });
function f(v) {
  d.useEffect(() => {
    if (typeof document > "u") return;
    const o = document.documentElement, e = document.body;
    if (!o || !e) return;
    const l = { htmlHeight: o.style.height, htmlOverflow: o.style.overflow, htmlOverflowX: o.style.overflowX, htmlOverflowY: o.style.overflowY, htmlOverscrollBehavior: o.style.overscrollBehavior, bodyHeight: e.style.height, bodyOverflow: e.style.overflow, bodyOverflowX: e.style.overflowX, bodyOverflowY: e.style.overflowY, bodyOverscrollBehavior: e.style.overscrollBehavior, dataMode: e.dataset.hushScrollMode ?? null }, r = v === s.LOCKED, t = r ? "hidden" : "auto", h = r ? "none" : "auto";
    return o.style.height = "100%", e.style.height = "100%", o.style.overflow = t, e.style.overflow = t, o.style.overflowX = "hidden", e.style.overflowX = "hidden", o.style.overflowY = t, e.style.overflowY = t, o.style.overscrollBehavior = h, e.style.overscrollBehavior = h, e.dataset.hushScrollMode = r ? s.LOCKED : s.SCROLL, () => {
      o.style.height = l.htmlHeight, o.style.overflow = l.htmlOverflow, o.style.overflowX = l.htmlOverflowX, o.style.overflowY = l.htmlOverflowY, o.style.overscrollBehavior = l.htmlOverscrollBehavior, e.style.height = l.bodyHeight, e.style.overflow = l.bodyOverflow, e.style.overflowX = l.bodyOverflowX, e.style.overflowY = l.bodyOverflowY, e.style.overscrollBehavior = l.bodyOverscrollBehavior, l.dataMode === null ? delete e.dataset.hushScrollMode : e.dataset.hushScrollMode = l.dataMode;
    };
  }, [v]);
}
export {
  s as B,
  f as u
};
