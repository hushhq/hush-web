import { describe, it, expect } from "vitest"
import { buildLiveKitWsUrl } from "./livekitUrl"

describe("buildLiveKitWsUrl", () => {
  it("derives wss:// from an https instance origin", () => {
    expect(
      buildLiveKitWsUrl({ instanceOrigin: "https://chat.example.com" }),
    ).toBe("wss://chat.example.com/livekit/")
  })

  it("derives ws:// from an http instance origin (localhost / LAN dev)", () => {
    expect(
      buildLiveKitWsUrl({ instanceOrigin: "http://localhost:5173" }),
    ).toBe("ws://localhost:5173/livekit/")
  })

  it("falls back to page origin when no instance origin is provided", () => {
    expect(
      buildLiveKitWsUrl({ pageOrigin: "https://app.example.com" }),
    ).toBe("wss://app.example.com/livekit/")
  })

  it("trusts VITE_LIVEKIT_URL only when it parses as wss://", () => {
    expect(
      buildLiveKitWsUrl({
        envOverride: "wss://livekit.example.com:7880",
      }),
    ).toBe("wss://livekit.example.com:7880/")
  })

  it("trusts VITE_LIVEKIT_URL when it parses as ws://", () => {
    expect(
      buildLiveKitWsUrl({
        envOverride: "ws://livekit.local:7880",
      }),
    ).toBe("ws://livekit.local:7880/")
  })

  it.each([
    "https://livekit.example.com",
    "http://livekit.example.com",
    "javascript:alert(1)",
    "data:text/html,<script>1</script>",
    "not a url",
    "",
  ])("rejects VITE_LIVEKIT_URL %s", (badEnv) => {
    if (badEnv === "") {
      // Empty env is treated as "no override" and falls through.
      expect(
        buildLiveKitWsUrl({
          envOverride: badEnv,
          instanceOrigin: "https://chat.example.com",
        }),
      ).toBe("wss://chat.example.com/livekit/")
      return
    }
    expect(() =>
      buildLiveKitWsUrl({ envOverride: badEnv }),
    ).toThrow(/VITE_LIVEKIT_URL/)
  })

  it.each([
    "javascript:alert(1)",
    "data:text/html,1",
    "file:///",
    "ws://malicious.example",
    "wss://malicious.example",
  ])("rejects instance origin %s", (badOrigin) => {
    expect(() =>
      buildLiveKitWsUrl({ instanceOrigin: badOrigin }),
    ).toThrow(/instance origin/)
  })

  it("throws when neither instance nor page origin is available", () => {
    expect(() => buildLiveKitWsUrl({})).toThrow(/no instance origin/)
  })

  it("env override wins over instance origin", () => {
    expect(
      buildLiveKitWsUrl({
        envOverride: "wss://livekit.example.com",
        instanceOrigin: "https://chat.example.com",
      }),
    ).toBe("wss://livekit.example.com/")
  })
})
