"use client"

import { useEffect, useState } from "react"
import { PortfolioService } from "@/services/portfolio"
import { Eye } from "lucide-react"

export function ViewTracker({ path, showCount = false, className = "" }: { path: string, showCount?: boolean, className?: string }) {
  const [views, setViews] = useState<number | null>(null)

  useEffect(() => {
    // 1. Fire the atomic RPC to increment the generic path instantly
    PortfolioService.incrementPageView(path)
      .then(() => {
        // 2. Fetch the updated count to display it natively
        if (showCount) return PortfolioService.getPageView(path)
      })
      .then(count => { if (count) setViews(count) })
      .catch(console.error)
  }, [path, showCount])

  if (!showCount || views === null) return null

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <Eye className="w-4 h-4" /> {views} VIEWS
    </span>
  )
}
