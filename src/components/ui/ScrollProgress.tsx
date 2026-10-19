"use client"

// A hairline at the top of the viewport that fills as the page scrolls.
// Driven by a native CSS scroll timeline where supported; the bar is hidden
// elsewhere, so there is no scroll listener and no JavaScript cost.
export const ScrollProgress = () => (
  <div aria-hidden className="scroll-progress pointer-events-none fixed inset-x-0 top-0 z-[70] h-px origin-left bg-accent" />
)
