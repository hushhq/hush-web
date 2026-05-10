/**
 * Behavioural cover for the emoji picker popover.
 *
 * The real `emoji-mart` Picker is a custom element that does not need
 * to run under jsdom. We mock its constructor with a button element
 * that simulates an emoji selection so the integration boundary
 * (popover open -> emoji-mart onEmojiSelect -> onSelect callback) can
 * be exercised.
 */
import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent, cleanup, waitFor } from "@testing-library/react"

import { EmojiPickerPopover } from "./emoji-picker-popover"

interface PickerProps {
  onEmojiSelect: (selection: { native: string }) => void
}

vi.mock("emoji-mart", () => {
  function MockPicker(props: PickerProps) {
    const host = document.createElement("div")
    const button = document.createElement("button")
    button.type = "button"
    button.dataset.testid = "mock-emoji-pick"
    button.textContent = "Pick 🚀"
    button.addEventListener("click", () => {
      props.onEmojiSelect({ native: "🚀" })
    })
    host.appendChild(button)
    return host
  }

  return {
    Picker: MockPicker,
    default: {
      Picker: MockPicker,
    },
  }
})

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
