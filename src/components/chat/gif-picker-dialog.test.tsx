/**
 * Behavioural cover for the GIF picker. Verifies the search → results
 * → onPick(GifRef) flow without hitting the real Tenor proxy.
 */
import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react"

import { GifPickerDialog } from "./gif-picker-dialog"

const mockSearchGifs = vi.fn()

vi.mock("@/lib/api", () => ({
  searchGifs: (...args: unknown[]) => mockSearchGifs(...args),
}))

beforeEach(() => {
  cleanup()
  vi.clearAllMocks()
  mockSearchGifs.mockResolvedValue({
    results: [
      {
        id: "g-1",
        url: "https://example.test/g1.gif",
        previewUrl: "https://example.test/g1-small.gif",
        width: 320,
        height: 240,
      },
    ],
  })
})

describe("GifPickerDialog", () => {
  it("fetches results when opened with the default query and renders a clickable grid", async () => {
    const onPick = vi.fn()
    const onOpenChange = vi.fn()
    render(
      <GifPickerDialog
        open
        onOpenChange={onOpenChange}
        getToken={() => "t"}
        onPick={onPick}
      />
    )

    await waitFor(() => {
      expect(mockSearchGifs).toHaveBeenCalled()
    })
    const tile = await screen.findByRole("button", { name: "" })
    fireEvent.click(tile)
    expect(onPick).toHaveBeenCalledWith({
      id: "g-1",
      url: "https://example.test/g1.gif",
      previewUrl: "https://example.test/g1-small.gif",
      width: 320,
      height: 240,
    })
  })

  it("surfaces a search failure as an alert", async () => {
    mockSearchGifs.mockRejectedValueOnce(new Error("upstream gif search failed"))
    render(
      <GifPickerDialog
        open
        onOpenChange={() => {}}
        getToken={() => "t"}
        onPick={() => {}}
      />
    )
    const alert = await screen.findByRole("alert")
    expect(alert).toHaveTextContent(/upstream gif search failed/)
  })
})
