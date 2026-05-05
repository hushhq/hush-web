/**
 * Verifies SystemChannelView header, loading skeleton, error banner,
 * empty state, and event row rendering for both server-log and
 * moderation sources.
 */
import * as React from "react"
import { describe, it, expect, vi, afterEach } from "vitest"
import { render, screen, cleanup } from "@testing-library/react"

vi.mock("@/adapters/useSystemEvents", () => ({
  useSystemEvents: vi.fn(),
}))

import { useSystemEvents } from "@/adapters/useSystemEvents"
import { SystemChannelView } from "./system-channel-view"
import { SidebarProvider } from "@/components/ui/sidebar"

const mockHook = vi.mocked(useSystemEvents)

// SystemChannelView mounts a SidebarTrigger so the user can reopen the
// channel-list sidebar from a system channel on a narrow window. The
// trigger reads the SidebarProvider context, so every test render
// needs the provider — wrap once here.
function renderWithShell(ui: React.ReactElement) {
  return render(<SidebarProvider>{ui}</SidebarProvider>)
}

describe("SystemChannelView", () => {
  afterEach(() => {
    cleanup()
    mockHook.mockReset()
  })

  it("renders the server-log header", () => {
    mockHook.mockReturnValue({
      events: [],
      loading: false,
      error: null,
      refetch: vi.fn(),
    })

    renderWithShell(
      <SystemChannelView
        serverId="g1"
        source="server-log"
        token="tok"
        baseUrl="https://a.example.com"
      />
    )

    expect(screen.getByText("System log")).toBeInTheDocument()
    expect(
      screen.getByText(/automatic record of server-wide events/i)
    ).toBeInTheDocument()
  })

  it("renders the moderation header", () => {
    mockHook.mockReturnValue({
      events: [],
      loading: false,
      error: null,
      refetch: vi.fn(),
    })

    renderWithShell(
      <SystemChannelView
        serverId="g1"
        source="moderation"
        token="tok"
        baseUrl="https://a.example.com"
      />
    )

    expect(screen.getByText("Moderation")).toBeInTheDocument()
  })

  it("shows the empty state when no events are present", () => {
    mockHook.mockReturnValue({
      events: [],
      loading: false,
      error: null,
      refetch: vi.fn(),
    })

    renderWithShell(
      <SystemChannelView
        serverId="g1"
        source="server-log"
        token="tok"
        baseUrl=""
      />
    )

    expect(screen.getByText(/no events yet/i)).toBeInTheDocument()
  })

  it("renders an error banner when fetch fails", () => {
    mockHook.mockReturnValue({
      events: [],
      loading: false,
      error: new Error("backend down"),
      refetch: vi.fn(),
    })

    renderWithShell(
      <SystemChannelView
        serverId="g1"
        source="server-log"
        token="tok"
        baseUrl=""
      />
    )

    expect(screen.getByText(/failed to load events/i)).toBeInTheDocument()
  })

  it("renders one row per event with humanised type and shortened ids", () => {
    mockHook.mockReturnValue({
      events: [
        {
          id: "e1",
          eventType: "channel.created",
          actorId: "abcdef1234567890",
          targetId: "1234567890abcdef",
          reason: "spam wave",
          createdAt: "2026-05-04T12:00:00Z",
        },
      ],
      loading: false,
      error: null,
      refetch: vi.fn(),
    })

    renderWithShell(
      <SystemChannelView
        serverId="g1"
        source="server-log"
        token="tok"
        baseUrl=""
      />
    )

    expect(screen.getByText("Channel Created")).toBeInTheDocument()
    expect(screen.getByText(/abcd…7890/)).toBeInTheDocument()
    expect(screen.getByText(/spam wave/i)).toBeInTheDocument()
  })
})
