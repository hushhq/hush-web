/**
 * Behavioural cover for the emoji picker popover.
 *
 * The real `@emoji-mart/react` Picker is a heavy custom-elements
 * component that does not render under jsdom. We mock it with a stub
 * that simulates an emoji selection so the integration boundary
 * (popover open → emoji-mart onEmojiSelect → onSelect callback) can be
 * exercised.
 */
import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent, cleanup, waitFor } from "@testing-library/react"

import { EmojiPickerPopover } from "./emoji-picker-popover"

interface PickerProps {
  onEmojiSelect: (selection: { native: string }) => void
}

vi.mock("@emoji-mart/react", () => ({
  default: function MockPicker(props: PickerProps) {
    return (
      <button
        type="button"
        data-testid="mock-emoji-pick"
        onClick={() => props.onEmojiSelect({ native: "🚀" })}
      >
        Pick 🚀
      </button>
    )
  },
}))

vi.mock("@emoji-mart/data", () => ({
  default: { categories: [], emojis: {} },
}))

beforeEach(() => {
  cleanup()
})

describe("EmojiPickerPopover", () => {
  it("opens the popover, lazy-loads the picker, and forwards the picked native emoji", async () => {
    const onSelect = vi.fn()
    render(
      <EmojiPickerPopover
        trigger={<button type="button">Open</button>}
        onSelect={onSelect}
      />
    )

    fireEvent.click(screen.getByText("Open"))
    const pickButton = await waitFor(() =>
      screen.getByTestId("mock-emoji-pick")
    )
    fireEvent.click(pickButton)

    expect(onSelect).toHaveBeenCalledWith("🚀")
  })
})
