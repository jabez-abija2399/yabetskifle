"use client"

import { useEffect, useState } from "react"
import { PortfolioService } from "@/services/portfolio"
import { Eye } from "lucide-react"

/**
 * Display-only public view counter (blog badges).
 * Increments live in POST /api/track — this component only reads the count.
 */
export function ViewTracker({
  path,
  showCount = false,
  className = "",
}: {
  path: string
  showCount?: boolean
  className?: string
}) {
  const [views, setViews] = useState<number | null>(null)

  useEffect(() => {
    if (!showCount) return
    let cancelled = false
    PortfolioService.getPageView(path)
      .then((count) => {
        if (!cancelled && count) setViews(count)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [path, showCount])

  if (!showCount || views === null) return null

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <Eye className="w-3.5 h-3.5" /> {views} views
    </span>
  )
}
