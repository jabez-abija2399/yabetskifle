// ─────────────────────────────────────────────────────────
// GET /api/analytics — admin-only aggregate stats
// Cookie-bound Supabase client → RLS `to authenticated`
// ─────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server"
import { createAuthSupabase, isAdminRequest } from "@/lib/adminAuth"

interface PageviewRow {
  ts: string
  path: string
  referrer_host: string | null
  country: string | null
  city: string | null
  device: string | null
  visitor_hash: string
  session_id: string | null
  is_new: boolean
}

interface EventRow {
  ts: string
  name: string
  path: string | null
  props: Record<string, unknown> | null
  visitor_hash: string
  session_id: string | null
}

interface Ranked {
  key: string
  count: number
}

function dayKey(d: Date): string {
  return d.toISOString().slice(0, 10)
}

function lastNDays(n: number): string[] {
  const out: string[] = []
  const now = new Date()
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now)
    d.setUTCDate(d.getUTCDate() - i)
    out.push(dayKey(d))
  }
  return out
}

function rank(rows: string[], limit = 8): Ranked[] {
  const map = new Map<string, number>()
  for (const r of rows) {
    if (!r) continue
    map.set(r, (map.get(r) || 0) + 1)
  }
  return [...map.entries()]
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
}

function pctDelta(now: number, prev: number): number | null {
  if (prev === 0) return now > 0 ? 100 : 0
  return Math.round(((now - prev) / prev) * 100)
}

export async function GET(req: NextRequest) {
  if (!(await isAdminRequest(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const supabase = createAuthSupabase(req)
  const since = new Date()
  since.setUTCDate(since.getUTCDate() - 13)
  since.setUTCHours(0, 0, 0, 0)

  const [pvRes, evRes] = await Promise.all([
    supabase
      .from("pageviews")
      .select("ts,path,referrer_host,country,city,device,visitor_hash,session_id,is_new")
      .gte("ts", since.toISOString())
      .order("ts", { ascending: false })
      .limit(8000),
    supabase
      .from("events")
      .select("ts,name,path,props,visitor_hash,session_id")
      .gte("ts", since.toISOString())
      .order("ts", { ascending: false })
      .limit(5000),
  ])

  if (pvRes.error) {
    return NextResponse.json(
      { error: pvRes.error.message, hint: "Did you run scripts/analytics.sql?" },
      { status: 500 }
    )
  }

  const pageviews = (pvRes.data || []) as PageviewRow[]
  const events = (evRes.data || []) as EventRow[]

  const days = lastNDays(14)
  const days7 = days.slice(-7)
  const daysPrev7 = days.slice(0, 7)
  const cutoff7 = `${days7[0]}T00:00:00.000Z`
  const cutoffPrev = `${daysPrev7[0]}T00:00:00.000Z`
  const nowIso = new Date().toISOString()

  const inRange = (ts: string, from: string, to: string) => ts >= from && ts < to
  const pv7 = pageviews.filter((r) => r.ts >= cutoff7)
  const pvPrev = pageviews.filter((r) => inRange(r.ts, cutoffPrev, cutoff7))
  const ev7 = events.filter((r) => r.ts >= cutoff7)

  const visitors = (rows: PageviewRow[]) => new Set(rows.map((r) => r.visitor_hash)).size

  const series = days7.map((day) => {
    const rows = pageviews.filter((r) => r.ts.startsWith(day))
    return {
      day,
      label: day.slice(5),
      pageviews: rows.length,
      visitors: new Set(rows.map((r) => r.visitor_hash)).size,
    }
  })

  const liveCutoff = new Date(Date.now() - 5 * 60 * 1000).toISOString()
  const liveRows = pageviews.filter((r) => r.ts >= liveCutoff)
  const liveSessions = new Set(liveRows.map((r) => r.session_id || r.visitor_hash))
  const livePages = rank(
    liveRows.map((r) => r.path),
    5
  )

  const sectionEvents = ev7.filter((e) => e.name === "section_view")
  const projectEvents = ev7.filter(
    (e) => e.name === "project_open" || e.name === "demo_click" || e.name === "github_click"
  )

  const topSections = rank(
    sectionEvents.map((e) => String(e.props?.section || "")),
    12
  )
  const topProjects = rank(
    projectEvents.map((e) => {
      const title = e.props?.title
      const id = e.props?.id
      return String(title || id || e.name)
    }),
    8
  )

  const recent = pageviews.slice(0, 40).map((r) => ({
    ts: r.ts,
    path: r.path,
    referrer: r.referrer_host,
    country: r.country,
    city: r.city,
    device: r.device,
    isNew: r.is_new,
  }))

  const recentEvents = events.slice(0, 20).map((e) => ({
    ts: e.ts,
    name: e.name,
    path: e.path,
    props: e.props,
  }))

  return NextResponse.json({
    generatedAt: nowIso,
    kpis: {
      visitors7d: visitors(pv7),
      visitors7dPrev: visitors(pvPrev),
      pageviews7d: pv7.length,
      pageviews7dPrev: pvPrev.length,
      liveNow: liveSessions.size,
      livePages,
      events7d: ev7.length,
    },
    deltas: {
      visitors: pctDelta(visitors(pv7), visitors(pvPrev)),
      pageviews: pctDelta(pv7.length, pvPrev.length),
    },
    series,
    topPages: rank(pv7.map((r) => r.path), 10),
    topReferrers: rank(
      pv7.map((r) => r.referrer_host || "direct"),
      8
    ),
    topCountries: rank(
      pv7.map((r) => r.country || "—"),
      8
    ),
    devices: rank(
      pv7.map((r) => r.device || "desktop"),
      4
    ),
    topSections,
    topProjects,
    recent,
    recentEvents,
  })
}
