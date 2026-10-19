"use client"

import { PointerEvent, useCallback } from "react"

/**
 * Tracks the pointer across a card and writes its position into CSS
 * variables (--mx, --my). A radial glow in globals.css (.spotlight)
 * follows the cursor. Mouse only: touch and reduced-motion users get
 * the static card.
 */
export const useSpotlight = () =>
  useCallback((e: PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse") return
    const rect = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`)
    e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`)
  }, [])
