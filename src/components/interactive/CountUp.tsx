"use client"

import { useEffect, useRef, useState } from "react"
import { animate, useInView, useReducedMotion } from "framer-motion"

interface Props {
  value: string
  duration?: number
}

// Counts up to the leading number in a stat ("3+" → 0 → 3, keeps the "+").
// Anything that isn't a plain number is shown as-is.
export const CountUp = ({ value, duration = 1.4 }: Props) => {
  const match = value.match(/^(\d+)(.*)$/)
  const target = match ? Number(match[1]) : null
  const suffix = match ? match[2] : ""
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "-40px" })
  const reduce = useReducedMotion()
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (target === null || reduce || !inView) return
    const controls = animate(0, target, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    })
    return () => controls.stop()
  }, [inView, target, duration, reduce])

  if (target === null || reduce) return <span>{value}</span>
  return (
    <span ref={ref} className="tabular-nums">
      {inView ? display : 0}
      {suffix}
    </span>
  )
}
