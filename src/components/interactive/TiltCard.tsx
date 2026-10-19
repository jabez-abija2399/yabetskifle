"use client"

import { ReactNode, PointerEvent } from "react"
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion"

interface Props {
  children: ReactNode
  className?: string
  max?: number
}

// 3D tilt that follows the pointer across the card. Mouse only.
export const TiltCard = ({ children, className, max = 8 }: Props) => {
  const reduce = useReducedMotion()
  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const rx = useSpring(useTransform(py, [0, 1], [max, -max]), { stiffness: 180, damping: 20 })
  const ry = useSpring(useTransform(px, [0, 1], [-max, max]), { stiffness: 180, damping: 20 })

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType !== "mouse") return
    const rect = e.currentTarget.getBoundingClientRect()
    px.set((e.clientX - rect.left) / rect.width)
    py.set((e.clientY - rect.top) / rect.height)
  }
  const onLeave = () => {
    px.set(0.5)
    py.set(0.5)
  }

  return (
    <motion.div
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
