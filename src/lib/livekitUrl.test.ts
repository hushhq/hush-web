import { describe, it, expect } from "vitest"
import { buildLiveKitWsUrl } from "./livekitUrl"

describe("buildLiveKitWsUrl", () => {
  it("env override wins over server-provided URL", () => {
    expect(
      buildLiveKitWsUrl({
        serverUrl: "wss://rtc.example.com/",
        envOverride: "wss://hosted-rtc.example.net/",
        instanceOrigin: "https://chat.example.com",
      }),
    ).toBe("wss://hosted-rtc.example.net/")
  })

  it("accepts server URL only when host matches selected instance", () => {
    expect(
      buildLiveKitWsUrl({
        serverUrl: "wss://chat.example.com/livekit/",
        instanceOrigin: "https://chat.example.com",
      }),
    ).toBe("wss://chat.example.com/livekit/")
  })

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

  it("rejects malformed server-provided URLs", () => {
    expect(() =>
      buildLiveKitWsUrl({
        serverUrl: "https://rtc.example.com",
        instanceOrigin: "https://chat.example.com",
      }),
    ).toThrow(/server livekitUrl/)
  })

  it("rejects relative server-provided URLs", () => {
    expect(() =>
      buildLiveKitWsUrl({
        serverUrl: "/livekit/",
        instanceOrigin: "https://chat.example.com",
      }),
    ).toThrow(/server livekitUrl/)
  })

  it("rejects insecure ws:// server URL when selected instance is https", () => {
    expect(() =>
      buildLiveKitWsUrl({
        serverUrl: "ws://rtc.example.com/",
        instanceOrigin: "https://chat.example.com",
      }),
    ).toThrow(/server livekitUrl/)
  })

  it.each([
    "javascript:alert(1)",
    "data:text/plain,x",
    "not a url",
  ])("rejects unsafe server-provided URL %s", (serverUrl) => {
    expect(() =>
      buildLiveKitWsUrl({
        serverUrl,
        instanceOrigin: "https://chat.example.com",
      }),
    ).toThrow(/server livekitUrl/)
  })

  it("rejects server URL on different host than selected instance", () => {
    expect(() =>
      buildLiveKitWsUrl({
        serverUrl: "wss://hosted-rtc.example.net/",
        instanceOrigin: "https://chat.example.com",
      }),
    ).toThrow(/server livekitUrl/)
  })

  it("uses env override as fallback when server URL is absent", () => {
    expect(
      buildLiveKitWsUrl({
        envOverride: "wss://hosted-rtc.example.net/",
        instanceOrigin: "https://chat.example.com",
      }),
    ).toBe("wss://hosted-rtc.example.net/")
  })
})
