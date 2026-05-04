/**
 * Verifies VoiceChannelView mounts the production voiceBody slot when
 * provided (the legacy <VoiceChannel /> bridge from authenticated-app)
 * and falls back to the prototype prejoin screen when omitted.
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

  it("falls back to the prototype prejoin screen when voiceBody is omitted", () => {
    render(<VoiceChannelView channelName="standup" />)

    // PrejoinScreen renders a join button labelled by the room name.
    expect(screen.getByRole("button", { name: /join/i })).toBeInTheDocument()
  })
})
