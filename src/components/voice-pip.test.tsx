/**
 * Verifies VoicePip renders the active channel + server name and
 * routes each control button to its handler.
 */
import { describe, it, expect, vi, afterEach } from "vitest"
import { render, screen, cleanup } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { VoicePip } from "./voice-pip"

const BASE = {
  channelName: "general",
  serverName: "Alpha",
  isMuted: false,
  isDeafened: false,
  isVideoOn: false,
  isScreenSharing: false,
}

describe("VoicePip", () => {
  afterEach(() => cleanup())

  it("renders the channel + server name", () => {
    render(
      <VoicePip
        {...BASE}
        onToggleMute={vi.fn()}
        onToggleDeafen={vi.fn()}
        onToggleVideo={vi.fn()}
        onToggleScreen={vi.fn()}
        onDisconnect={vi.fn()}
        onJump={vi.fn()}
      />
    )

    expect(screen.getByText(/general.*alpha/i)).toBeInTheDocument()
  })

  it("invokes onDisconnect when the leave button is clicked", async () => {
    const onDisconnect = vi.fn()
    render(
      <VoicePip
        {...BASE}
        onToggleMute={vi.fn()}
        onToggleDeafen={vi.fn()}
        onToggleVideo={vi.fn()}
        onToggleScreen={vi.fn()}
        onDisconnect={onDisconnect}
        onJump={vi.fn()}
      />
    )

    await userEvent.click(screen.getByRole("button", { name: /disconnect/i }))
    expect(onDisconnect).toHaveBeenCalledTimes(1)
  })

  it("invokes onToggleMute when the mic button is clicked", async () => {
    const onToggleMute = vi.fn()
    render(
      <VoicePip
        {...BASE}
        onToggleMute={onToggleMute}
        onToggleDeafen={vi.fn()}
        onToggleVideo={vi.fn()}
        onToggleScreen={vi.fn()}
        onDisconnect={vi.fn()}
        onJump={vi.fn()}
      />
    )

    await userEvent.click(screen.getByRole("button", { name: /mute|unmute/i }))
    expect(onToggleMute).toHaveBeenCalledTimes(1)
  })
})
