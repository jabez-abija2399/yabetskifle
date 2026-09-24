"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import { trackEvent, trackPageview } from "@/lib/analytics-client"

/**
 * Global tracker mounted once in the root layout.
 * · pageview on every public route change (admin skipped)
 * · section milestones via IntersectionObserver (section[id])
 * · delegated clicks for [data-track-event]
 */
export function Track() {
  const pathname = usePathname()
  const lastPath = useRef<string | null>(null)
  const seenSections = useRef<Set<string>>(new Set())

  // Pageviews
  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin") || pathname.startsWith("/api")) return
    if (lastPath.current === pathname) return
    lastPath.current = pathname
    seenSections.current = new Set()
    trackPageview(pathname)
  }, [pathname])

  // Section scroll milestones
  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return
    const sections = document.querySelectorAll("section[id]")
    if (sections.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting || entry.intersectionRatio < 0.35) continue
          const id = entry.target.getAttribute("id")
          if (!id || seenSections.current.has(id)) continue
          seenSections.current.add(id)
          trackEvent("section_view", { section: id })
        }
      },
      { threshold: [0.35] }
    )

    sections.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [pathname])

  // Delegated event clicks (demo/github/etc.)
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement | null)?.closest?.("[data-track-event]")
      if (!target) return
      const name = target.getAttribute("data-track-event")
      if (!name) return
      let props: Record<string, unknown> = {}
      try {
        const raw = target.getAttribute("data-track-props")
        if (raw) props = JSON.parse(raw)
      } catch {
        /* ignore bad JSON */
      }
      trackEvent(name, props)
    }
    document.addEventListener("click", onClick, true)
    return () => document.removeEventListener("click", onClick, true)
  }, [])

  return null
}
