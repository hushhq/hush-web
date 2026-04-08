import { measureCaptureLevel as f } from "./measureCaptureLevel-D8ZmpDSy.js";
function u(s, c = {}) {
  const { durationMs: a = 5e3, intervalMs: d = 200, onSample: r } = c, t = [];
  for (const [i, e] of s) {
    if (e.kind !== "audio") continue;
    const n = e.track.mediaStreamTrack;
    if (!n || n.readyState !== "live") continue;
    const m = e.participant.name || e.participant.identity, p = f(n, { durationMs: a, intervalMs: d, onSample: (o) => {
      r ? r(e.participant.identity, o) : console.log(`[remote-diag] participant=${m} sid=${i} t=${o.timestampMs}ms rms=${o.rmsDbfs.toFixed(1)}dBFS peak=${o.peakDbfs.toFixed(1)}dBFS`);
    } });
    t.push(p);
  }
  return t.length === 0 ? console.warn("[remote-diag] No live remote audio tracks found.") : console.log(`[remote-diag] Measuring ${t.length} remote audio track(s) for ${a}ms`), () => {
    for (const i of t) i();
  };
}
export {
  u as measureRemoteLevel
};
