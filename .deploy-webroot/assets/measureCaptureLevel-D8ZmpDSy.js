function p(a) {
  return a <= 0 ? -1 / 0 : 20 * Math.log10(a);
}
function b(a, M) {
  const { onSample: d, durationMs: h = 5e3, intervalMs: S = 100, fftSize: D = 2048 } = M, o = new AudioContext({ sampleRate: 48e3 }), g = new MediaStream([a]), i = o.createMediaStreamSource(g), t = o.createAnalyser();
  t.fftSize = D, t.smoothingTimeConstant = 0, i.connect(t);
  const e = new Float32Array(t.fftSize), v = performance.now();
  let s = false;
  const w = setInterval(() => {
    if (s) return;
    const l = performance.now() - v;
    if (l >= h) {
      c();
      return;
    }
    t.getFloatTimeDomainData(e);
    let f = 0, r = 0;
    for (let n = 0; n < e.length; n++) {
      const u = Math.abs(e[n]);
      f += e[n] * e[n], u > r && (r = u);
    }
    const m = Math.sqrt(f / e.length);
    d({ timestampMs: Math.round(l), rmsDbfs: p(m), peakDbfs: p(r), rmsLinear: m, peakLinear: r });
  }, S);
  function c() {
    s || (s = true, clearInterval(w), i.disconnect(), o.close().catch(() => {
    }));
  }
  return c;
}
export {
  b as measureCaptureLevel
};
