"use client"

import { motion } from "framer-motion"
import { ReactNode } from "react"

interface Props {
  children: ReactNode
  delay?: number
  className?: string
}

// Fades and lifts a block into view once, on first scroll into view.
// MotionConfig reducedMotion="user" in the root layout disables the movement.
export const Reveal = ({ children, delay = 0, className }: Props) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    className={className}
  >
    {children}
  </motion.div>
)
