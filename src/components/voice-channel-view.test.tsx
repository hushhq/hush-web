/**
 * Verifies VoiceChannelView mounts the production voiceBody slot when
 * provided (the legacy <VoiceChannel /> bridge from authenticated-app),
 * and falls back to a transient connecting state — never a prejoin —
 * when omitted, so opening a voice channel always auto-joins LiveKit.
 */
import { describe, it, expect, afterEach, beforeAll } from "vitest"
import { render, screen, cleanup } from "@testing-library/react"

beforeAll(() => {
  if (!window.matchMedia) {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: () => ({
        matches: false,
        addEventListener: () => {},
        removeEventListener: () => {},
      }),
    })
  }
})

import { VoiceChannelView } from "./voice-channel-view"

describe("VoiceChannelView", () => {
  afterEach(() => cleanup())

  it("renders the voiceBody slot in production mode", () => {
    render(
      <VoiceChannelView
        channelName="standup"
        voiceBody={<div data-testid="real-voice">real-voice-mount</div>}
      />
    )

    expect(screen.getByTestId("real-voice")).toBeInTheDocument()
  })

  it("renders a connecting placeholder (no prejoin) when voiceBody is omitted", () => {
    render(<VoiceChannelView channelName="standup" />)

    // The prejoin screen has been removed: opening a voice channel must
    // always auto-join LiveKit. Until the legacy mount lands the user sees
    // a transient connecting state.
    expect(screen.getByText(/connecting to standup/i)).toBeInTheDocument()
    expect(screen.queryByRole("button", { name: /join/i })).not.toBeInTheDocument()
  })
})
