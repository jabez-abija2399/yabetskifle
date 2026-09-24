"use client"

import { useCallback, useEffect, useState } from "react"
import { PageHeader } from "@/components/admin/PageHeader"
import { ListSkeleton } from "@/components/admin/ListSkeleton"
import { EmptyState } from "@/components/admin/EmptyState"
import { Button } from "@/components/ui/button"
import {
  Activity, RefreshCw, Eye, Users, MousePointerClick,
  Globe, MonitorSmartphone, MapPin, Link2, ArrowUpRight,
} from "lucide-react"
import type { ReactNode } from "react"

interface Ranked {
  key: string
  count: number
}

interface SeriesPoint {
  day: string
  label: string
  pageviews: number
  visitors: number
}

interface RecentVisit {
  ts: string
  path: string
  referrer: string | null
  country: string | null
  city: string | null
  device: string | null
  isNew: boolean
}

interface AnalyticsPayload {
  generatedAt: string
  kpis: {
    visitors7d: number
    visitors7dPrev: number
    pageviews7d: number
    pageviews7dPrev: number
    liveNow: number
    livePages: Ranked[]
    events7d: number
  }
  deltas: { visitors: number | null; pageviews: number | null }
  series: SeriesPoint[]
  topPages: Ranked[]
  topReferrers: Ranked[]
  topCountries: Ranked[]
  devices: Ranked[]
  topSections: Ranked[]
  topProjects: Ranked[]
  recent: RecentVisit[]
  recentEvents: Array<{ ts: string; name: string; path: string | null; props: Record<string, unknown> | null }>
}

function formatTime(iso: string): string {
  try {
    return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  } catch {
    return "—"
  }
}

function formatWhen(iso: string): string {
  try {
    const d = new Date(iso)
    const now = new Date()
    const sameDay = d.toDateString() === now.toDateString()
    if (sameDay) return formatTime(iso)
    return `${d.toLocaleDateString([], { month: "short", day: "numeric" })} ${formatTime(iso)}`
  } catch {
    return "—"
  }
}

function Delta({ value }: { value: number | null }) {
  if (value === null) return null
  const up = value >= 0
  return (
    <span
      className={`font-mono text-[10px] ${up ? "text-accent" : "text-signal"}`}
      title="vs previous 7 days"
    >
      {up ? "▲" : "▼"} {Math.abs(value)}%
    </span>
  )
}

function KpiCard({
  label,
  value,
  sub,
  icon,
  live,
}: {
  label: string
  value: string | number
  sub?: ReactNode
  icon: ReactNode
  live?: boolean
}) {
  return (
    <div className="rounded-xs border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <span className="label-mono text-muted-foreground">{label}</span>
        <span className="text-muted-foreground" aria-hidden>
          {icon}
        </span>
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-3xl font-semibold tabular-nums tracking-tight text-foreground">
          {value}
        </span>
        {live && (
          <span className="inline-flex items-center gap-1 label-mono text-accent">
            <span className="size-1.5 animate-pulse rounded-full bg-accent" aria-hidden />
            live
          </span>
        )}
        {sub}
      </div>
    </div>
  )
}

function RankList({ title, rows, empty }: { title: string; rows: Ranked[]; empty: string }) {
  const max = rows[0]?.count || 1
  return (
    <div className="rounded-xs border border-border bg-card p-5">
      <p className="label-mono text-muted-foreground">{title}</p>
      {rows.length === 0 ? (
        <p className="mt-3 text-xs text-muted-foreground">{empty}</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {rows.map((row) => (
            <li key={row.key} className="relative">
              <div
                className="absolute inset-y-0 left-0 bg-accent/10"
                style={{ width: `${(row.count / max) * 100}%` }}
                aria-hidden
              />
              <div className="relative flex items-center justify-between gap-3 py-0.5">
                <span className="truncate font-mono text-xs text-foreground">{row.key}</span>
                <span className="shrink-0 font-mono text-xs tabular-nums text-muted-foreground">
                  {row.count}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function BarChart({ series }: { series: SeriesPoint[] }) {
  const max = Math.max(1, ...series.map((s) => s.pageviews))
  return (
    <div className="rounded-xs border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <p className="label-mono text-muted-foreground">Pageviews · last 7 days</p>
        <p className="label-mono text-muted-foreground">
          peak {max}
        </p>
      </div>
      <div className="mt-4 flex h-36 items-end gap-1.5">
        {series.map((point) => {
          const h = Math.max(4, Math.round((point.pageviews / max) * 100))
          return (
            <div key={point.day} className="group flex flex-1 flex-col items-center gap-1.5">
              <span className="font-mono text-[10px] tabular-nums text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
                {point.pageviews}
              </span>
              <div
                className="w-full rounded-t-xs bg-accent/70 transition-colors group-hover:bg-accent"
                style={{ height: `${h}%` }}
                title={`${point.day}: ${point.pageviews} views · ${point.visitors} visitors`}
              />
              <span className="font-mono text-[10px] text-muted-foreground">{point.label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsPayload | null>(null)
  const [loading, setLoading] = useState(true)
  const [failed, setFailed] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const load = useCallback(async (manual = false) => {
    if (manual) setRefreshing(true)
    try {
      const res = await fetch("/api/analytics", { cache: "no-store" })
      const json = await res.json()
      if (!res.ok) {
        throw new Error(json.error || json.hint || `HTTP ${res.status}`)
      }
      setData(json as AnalyticsPayload)
      setFailed(null)
    } catch (err) {
      setFailed(err instanceof Error ? err.message : "Failed to load analytics")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    const run = () => {
      if (!cancelled) void load()
    }
    run()
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") run()
    }, 20000)
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [load])

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl">
        <PageHeader index="01" title="Analytics" description="Who is viewing the site and what they open." />
        <ListSkeleton rows={5} />
      </div>
    )
  }

  if (failed && !data) {
    return (
      <div className="mx-auto max-w-6xl">
        <PageHeader index="01" title="Analytics" description="Who is viewing the site and what they open." />
        <EmptyState
          icon={<Activity className="size-5" />}
          title="Analytics tables not ready"
          description={failed}
        />
      </div>
    )
  }

  const k = data?.kpis

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        index="01"
        title="Analytics"
        description="Visitors, sections, and project engagement — last 7 days."
        actions={
          <div className="flex items-center gap-2">
            {data && (
              <span className="label-mono text-muted-foreground">
                updated {formatTime(data.generatedAt)}
              </span>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => void load(true)}
              disabled={refreshing}
            >
              <RefreshCw className={`size-3.5 ${refreshing ? "animate-spin" : ""}`} aria-hidden />
              Refresh
            </Button>
          </div>
        }
      />

      {failed && (
        <p className="mb-4 rounded-xs border border-signal/40 bg-signal/5 px-4 py-3 text-sm text-signal">
          {failed}
        </p>
      )}

      {!data ? (
        <EmptyState
          icon={<Eye className="size-5" />}
          title="No data yet"
          description="Once the site receives visits (and scripts/analytics.sql is applied), stats appear here."
        />
      ) : (
        <div className="space-y-6">
          {/* KPI row */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <KpiCard
              label="Visitors 7d"
              value={k!.visitors7d}
              sub={<Delta value={data.deltas.visitors} />}
              icon={<Users className="size-4" />}
            />
            <KpiCard
              label="Pageviews 7d"
              value={k!.pageviews7d}
              sub={<Delta value={data.deltas.pageviews} />}
              icon={<Eye className="size-4" />}
            />
            <KpiCard
              label="Live now"
              value={k!.liveNow}
              live={k!.liveNow > 0}
              icon={<Activity className="size-4" />}
            />
            <KpiCard
              label="Events 7d"
              value={k!.events7d}
              sub={
                <span className="label-mono text-muted-foreground">sections · clicks</span>
              }
              icon={<MousePointerClick className="size-4" />}
            />
          </div>

          {/* Live pages strip */}
          {k!.liveNow > 0 && (
            <div className="rounded-xs border border-accent/40 bg-accent/5 px-4 py-3">
              <p className="label-mono text-accent">Active now</p>
              <div className="mt-1.5 flex flex-wrap gap-2">
                {k!.livePages.map((p) => (
                  <span
                    key={p.key}
                    className="rounded-xs border border-accent/40 bg-card px-2 py-0.5 font-mono text-xs text-foreground"
                  >
                    {p.key}
                    {p.count > 1 && (
                      <span className="ml-1 text-muted-foreground">×{p.count}</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Chart */}
          <BarChart series={data.series} />

          {/* Top lists */}
          <div className="grid gap-3 lg:grid-cols-2">
            <RankList title="Top pages" rows={data.topPages} empty="No pageviews in range." />
            <RankList
              title="Top referrers"
              rows={data.topReferrers}
              empty="No referrers yet."
            />
            <RankList
              title="Countries"
              rows={data.topCountries}
              empty="Geo unavailable (local/dev)."
            />
            <RankList title="Devices" rows={data.devices} empty="No device data." />
          </div>

          {/* Engagement */}
          <div className="grid gap-3 lg:grid-cols-2">
            <RankList
              title="Sections viewed"
              rows={data.topSections}
              empty="No section scrolls tracked yet."
            />
            <RankList
              title="Project engagement"
              rows={data.topProjects}
              empty="No project opens or demo clicks yet."
            />
          </div>

          {/* Recent visitors feed */}
          <div className="rounded-xs border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-5 py-3">
              <p className="label-mono text-muted-foreground">Recent visitors</p>
              <p className="label-mono text-muted-foreground">{data.recent.length} rows</p>
            </div>
            {data.recent.length === 0 ? (
              <div className="px-5 py-8">
                <EmptyState
                  icon={<Globe className="size-5" />}
                  title="Waiting for first visits"
                  description="Public pageviews will stream in here after scripts/analytics.sql is applied."
                />
              </div>
            ) : (
              <div className="custom-scrollbar max-h-[420px] overflow-y-auto">
                <table className="w-full text-left">
                  <thead className="sticky top-0 bg-card">
                    <tr className="border-b border-border font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                      <th className="px-5 py-2 font-normal">Time</th>
                      <th className="px-3 py-2 font-normal">Path</th>
                      <th className="hidden px-3 py-2 font-normal sm:table-cell">
                        <span className="inline-flex items-center gap-1">
                          <Link2 className="size-3" aria-hidden /> Ref
                        </span>
                      </th>
                      <th className="hidden px-3 py-2 font-normal md:table-cell">
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="size-3" aria-hidden /> Loc
                        </span>
                      </th>
                      <th className="hidden px-3 py-2 font-normal lg:table-cell">
                        <span className="inline-flex items-center gap-1">
                          <MonitorSmartphone className="size-3" aria-hidden /> Device
                        </span>
                      </th>
                      <th className="px-5 py-2 font-normal">Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recent.map((row, i) => (
                      <tr
                        key={`${row.ts}-${i}`}
                        className="border-b border-border/60 text-xs transition-colors hover:bg-accent/5"
                      >
                        <td className="px-5 py-2.5 font-mono tabular-nums text-muted-foreground">
                          {formatWhen(row.ts)}
                        </td>
                        <td className="px-3 py-2.5 font-mono text-foreground">{row.path}</td>
                        <td className="hidden max-w-32 truncate px-3 py-2.5 font-mono text-muted-foreground sm:table-cell">
                          {row.referrer || "direct"}
                        </td>
                        <td className="hidden px-3 py-2.5 font-mono text-muted-foreground md:table-cell">
                          {[row.city, row.country].filter(Boolean).join(", ") || "—"}
                        </td>
                        <td className="hidden px-3 py-2.5 font-mono text-muted-foreground lg:table-cell">
                          {row.device || "—"}
                        </td>
                        <td className="px-5 py-2.5">
                          <span
                            className={`label-mono ${row.isNew ? "text-accent" : "text-muted-foreground"}`}
                          >
                            {row.isNew ? "new" : "return"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Latest events */}
          {data.recentEvents.length > 0 && (
            <div className="rounded-xs border border-border bg-card">
              <div className="border-b border-border px-5 py-3">
                <p className="label-mono text-muted-foreground">Latest events</p>
              </div>
              <ul className="divide-y divide-border/60">
                {data.recentEvents.map((e, i) => (
                  <li
                    key={`${e.ts}-${i}`}
                    className="flex items-center justify-between gap-3 px-5 py-2.5 text-xs"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="shrink-0 font-mono text-muted-foreground">
                        {formatWhen(e.ts)}
                      </span>
                      <span className="label-mono text-accent">{e.name}</span>
                      <span className="truncate font-mono text-foreground">
                        {e.name === "section_view"
                          ? `#${e.props?.section}`
                          : String(e.props?.title || e.path || "")}
                      </span>
                    </div>
                    <ArrowUpRight className="size-3 shrink-0 text-muted-foreground" aria-hidden />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
