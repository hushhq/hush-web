import * as React from "react"

const MOBILE_BREAKPOINT = 768

/**
 * Returns true when the *viewport* is mobile-sized. Tracks window
 * resize so a desktop user dragging the window down to a narrow width
 * still gets the mobile-shaped layout.
 *
 * Use this for layout decisions (sidebar collapse, dock collapse,
 * mobile chrome). Do NOT use it for device-capability decisions like
 * "is this a touch keyboard": a desktop with a narrow window is still
 * a desktop. For touch-only behavior use `useIsTouchDevice`.
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}

/**
 * Returns true on real touch-only devices (phones, most tablets) and
 * false on every desktop including a desktop whose window has been
 * resized to phone width. Backed by the standard CSS media query for
 * touch-only pointers, which is the one signal that does not flip
 * when the user resizes the window.
 *
 * Use this for behavior that should match the input modality, not the
 * viewport: in particular the composer's Enter key, where a hardware
 * keyboard user expects "Enter sends" and a soft-keyboard user expects
 * "Enter newlines, send button sends".
 */
export function useIsTouchDevice() {
  const [isTouch, setIsTouch] = React.useState<boolean>(false)

  React.useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return
    const mql = window.matchMedia("(hover: none) and (pointer: coarse)")
    const onChange = () => setIsTouch(mql.matches)
    onChange()
    mql.addEventListener("change", onChange)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return isTouch
}
