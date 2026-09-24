"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { PortfolioService } from "@/services/portfolio"
import { PageHeader } from "@/components/admin/PageHeader"
import { ListSkeleton } from "@/components/admin/ListSkeleton"
import { ArrowUpRight, Eye, Briefcase, MessageSquare, Package, Columns, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Stats {
  globalViews: number
  projectsCount: number
  messagesCount: number
  servicesCount: number
  activeSections: number
}

const EMPTY: Stats = {
  globalViews: 0,
  projectsCount: 0,
  messagesCount: 0,
  servicesCount: 0,
  activeSections: 0,
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const data = await PortfolioService.getDashboardStats()
        if (!cancelled) setStats({ ...EMPTY, ...(data as Partial<Stats>) })
      } catch (error) {
        console.error("Dashboard failed to sync:", error)
        if (!cancelled) setFailed(true)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const s = stats ?? EMPTY

  const kpis = [
    { label: "Page views", value: s.globalViews, href: "/admin/analytics", icon: <Eye className="size-4" /> },
    { label: "Projects", value: s.projectsCount, href: "/admin/projects", icon: <Briefcase className="size-4" /> },
    { label: "Messages", value: s.messagesCount, href: "/admin/messages", icon: <MessageSquare className="size-4" /> },
    { label: "Services", value: s.servicesCount, href: "/admin/services", icon: <Package className="size-4" /> },
  ]

  const quickLinks = [
    { label: "Edit site copy", href: "/admin/copy", icon: <Settings className="size-4" /> },
    { label: "Toggle sections", href: "/admin/sections", icon: <Columns className="size-4" /> },
    { label: "Open Apply Studio", href: "/admin/apply", icon: <ArrowUpRight className="size-4" /> },
  ]

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        index="01"
        title="Dashboard"
        description="Portfolio operations at a glance."
        actions={
          <span className="inline-flex items-center gap-1.5 rounded-xs border border-accent/40 px-2 py-1 label-mono text-accent">
            <span className="size-1 rounded-full bg-accent" aria-hidden />
            System online
          </span>
        }
      />

      {loading ? (
        <ListSkeleton rows={4} />
      ) : (
        <div className="space-y-8">
          {failed && (
            <p className="rounded-xs border border-signal/40 bg-signal/5 px-4 py-3 text-sm text-signal">
              Could not load stats — check your database connection.
            </p>
          )}

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {kpis.map((kpi) => (
              <Link
                key={kpi.label}
                href={kpi.href}
                className="group rounded-xs border border-border bg-card p-5 transition-colors hover:border-accent/60"
              >
                <div className="flex items-center justify-between">
                  <span className="label-mono text-muted-foreground">
                    {kpi.label}
                  </span>
                  <span className="text-muted-foreground transition-colors group-hover:text-accent" aria-hidden>
                    {kpi.icon}
                  </span>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-semibold tabular-nums tracking-tight text-foreground">
                    {kpi.value}
                  </span>
                  <ArrowUpRight
                    className="size-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
                    aria-hidden
                  />
                </div>
              </Link>
            ))}
          </div>

          <div className="grid gap-3 lg:grid-cols-3">
            <div className="rounded-xs border border-border bg-card p-5 lg:col-span-2">
              <p className="label-mono text-muted-foreground">
                System status
              </p>
              <p className="mt-3 text-sm leading-relaxed text-foreground">
                {s.activeSections} public sections active · {s.projectsCount} published
                projects · {s.messagesCount} message{s.messagesCount === 1 ? "" : "s"} in the
                inbox.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link href="/admin/sections">Manage sections</Link>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <Link href="/admin/projects">Edit projects</Link>
                </Button>
              </div>
            </div>

            <div className="rounded-xs border border-border bg-card p-5">
              <p className="label-mono text-muted-foreground">
                Quick actions
              </p>
              <ul className="mt-3 space-y-1">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="flex h-8 items-center gap-2.5 border-l-2 border-transparent px-2.5 text-[13px] text-muted-foreground transition-colors hover:border-accent hover:bg-muted/60 hover:text-foreground"
                    >
                      {link.icon}
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
