import { describe, it, expect } from "vitest"
import { isSafeMediaUrl } from "./safeMediaUrl"

describe("isSafeMediaUrl", () => {
  it.each([
    "https://media.tenor.com/abc.gif",
    "https://example.com/path?q=1#frag",
    "https://sub.domain.example/file.mp4",
  ])("accepts https URL %s", (url) => {
    expect(isSafeMediaUrl(url)).toBe(true)
  })

  it.each([
    "http://example.com/abc.gif",
    "javascript:alert(1)",
    "data:text/html,<script>1</script>",
    "data:image/svg+xml,<svg/>",
    "blob:https://example.com/uuid",
    "file:///etc/passwd",
    "chrome://settings",
    "vbscript:msgbox(1)",
    "ftp://example.com/file",
    "ws://example.com/socket",
  ])("rejects unsafe scheme %s", (url) => {
    expect(isSafeMediaUrl(url)).toBe(false)
  })

  it("rejects percent-encoded scheme spoofs", () => {
    // The URL constructor decodes %6A back to 'j' before scheme check,
    // but it also rejects this as malformed; either way must return false.
    expect(isSafeMediaUrl("%6Aavascript:alert(1)")).toBe(false)
  })

  it("rejects whitespace-padded scheme spoofs", () => {
    expect(isSafeMediaUrl(" javascript:alert(1)")).toBe(false)
    expect(isSafeMediaUrl("\tjavascript:alert(1)")).toBe(false)
  })

  it("rejects empty string and non-string", () => {
    expect(isSafeMediaUrl("")).toBe(false)
    expect(isSafeMediaUrl(null)).toBe(false)
    expect(isSafeMediaUrl(undefined)).toBe(false)
    expect(isSafeMediaUrl(123)).toBe(false)
    expect(isSafeMediaUrl({})).toBe(false)
  })

  it("rejects unparseable URLs", () => {
    expect(isSafeMediaUrl("not a url")).toBe(false)
    expect(isSafeMediaUrl("https://")).toBe(false)
  })
})
