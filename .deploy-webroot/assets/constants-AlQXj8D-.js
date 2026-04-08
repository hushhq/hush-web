var _a;
const a = "0.7.0-alpha", i = { version: a }, s = i.version, n = { source: { label: "High", description: "1080p, 60fps", width: 1920, height: 1080, frameRate: 60, bitrate: 2e7 }, lite: { label: "Lite", description: "720p, 30fps", width: 1280, height: 720, frameRate: 30, bitrate: 25e5 } }, E = 60, o = "source", S = { width: 1280, height: 720, frameRate: 30, bitrate: 15e5 }, t = { SCREEN: "screen", WEBCAM: "webcam", MIC: "mic", SCREEN_AUDIO: "screen-audio" };
function c(e) {
  return e === t.SCREEN || e === t.SCREEN_AUDIO;
}
const r = typeof navigator < "u" && !!((_a = navigator.mediaDevices) == null ? void 0 : _a.getDisplayMedia), R = 5e3;
export {
  s as A,
  o as D,
  r as I,
  t as M,
  n as Q,
  R as S,
  S as W,
  E as a,
  c as i
};
