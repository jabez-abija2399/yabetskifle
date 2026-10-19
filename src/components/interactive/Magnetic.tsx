"use client"

import { ReactNode, PointerEvent, useRef } from "react"
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion"

interface Props {
  children: ReactNode
  strength?: number
  className?: string
}

// Pulls its child gently toward the pointer when the cursor is near.
// Mouse only, and off for reduced-motion users.
export const Magnetic = ({ children, strength = 0.3, className }: Props) => {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 18, mass: 0.4 })
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 18, mass: 0.4 })

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType !== "mouse" || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    x.set((e.clientX - (rect.left + rect.width / 2)) * strength)
    y.set((e.clientY - (rect.top + rect.height / 2)) * strength)
  }
  const onLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div ref={ref} style={{ x, y }} onPointerMove={onMove} onPointerLeave={onLeave} className={className ?? "inline-block"}>
      {children}
    </motion.div>
  )
}
