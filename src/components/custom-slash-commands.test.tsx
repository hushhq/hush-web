import { describe, expect, it, vi } from "vitest"

vi.mock("novel", () => ({
  createSuggestionItems: (items: unknown[]) => items,
}))

import { createHushSlashItems } from "./custom-slash-commands"

describe("createHushSlashItems", () => {
  it("marks GIF as shipping soon and non-interactive", () => {
    const gif = createHushSlashItems({}).find((item) => item.title === "GIF")

    expect(gif).toMatchObject({
      badge: "Shipping soon",
      disabled: true,
    })
  })
})
