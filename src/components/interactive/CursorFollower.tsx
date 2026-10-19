"use client"

import { useEffect, useState } from "react"
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion"

// A ring that trails the pointer and swells over links and buttons.
// Hidden on touch devices by CSS (.cursor-follower), and not rendered at all
// for reduced-motion users. The native cursor is kept for accessibility.
export const CursorFollower = () => {
  const reduce = useReducedMotion()
  const [active, setActive] = useState(false)
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const sx = useSpring(x, { stiffness: 500, damping: 35, mass: 0.3 })
  const sy = useSpring(y, { stiffness: 500, damping: 35, mass: 0.3 })

  useEffect(() => {
    if (reduce) return
    const move = (e: PointerEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
      const target = e.target as HTMLElement | null
      setActive(Boolean(target?.closest("a, button, [role='button'], input, textarea, label")))
    }
    window.addEventListener("pointermove", move, { passive: true })
    return () => window.removeEventListener("pointermove", move)
  }, [reduce, x, y])

  if (reduce) return null
  return (
    <motion.div
      aria-hidden
      style={{ x: sx, y: sy, translateX: "-50%", translateY: "-50%" }}
      animate={{ width: active ? 56 : 28, height: active ? 56 : 28, opacity: active ? 0.6 : 0.9 }}
      transition={{ type: "spring", stiffness: 300, damping: 26 }}
      className="cursor-follower pointer-events-none fixed left-0 top-0 z-[80] rounded-full border border-accent mix-blend-difference"
    />
  )
}
