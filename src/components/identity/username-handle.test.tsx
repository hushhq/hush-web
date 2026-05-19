import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { UsernameHandle } from "./username-handle"

describe("UsernameHandle", () => {
  it("renders a visual handle without requiring @ in the username", () => {
    render(<UsernameHandle username="yarin" />)

    expect(screen.getByLabelText("@yarin")).toBeInTheDocument()
    expect(screen.getByText("yarin")).toBeInTheDocument()
  })

  it("normalizes legacy decorated usernames at the presentation boundary", () => {
    render(<UsernameHandle username="@mike" />)

    expect(screen.getByLabelText("@mike")).toBeInTheDocument()
    expect(screen.getByText("mike")).toBeInTheDocument()
  })
})
