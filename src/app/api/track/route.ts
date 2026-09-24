// ─────────────────────────────────────────────────────────
// POST /api/track — public ingestion (pageviews + events)
// · bot / admin filtering · Vercel geo headers
// · daily-salted visitor hash (raw IP never stored)
// · inserts via anon client (RLS: insert-only)
// ─────────────────────────────────────────────────────────

import { createHash } from "crypto"
import { NextRequest } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
)

/** 204 must have an empty body — NextResponse.json cannot set status 204. */
const noContent = () => new Response(null, { status: 204 })
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  })

const BOT_RE =
  /\b(bot|crawl|spider|slurp|headless|lighthouse|pagespeed|pingdom|scanner|python-requests|go-http-client|okhttp|axios|wget)\b/i

const MAX_PATH = 200

function deviceFromUA(ua: string): string {
  if (/ipad|tablet|playbook|silk|kindle/i.test(ua)) return "tablet"
  if (/mobi|iphone|android.+mobile|windows phone/i.test(ua)) return "mobile"
  if (/android/i.test(ua)) return "tablet"
  return "desktop"
}

function referrerHost(ref: string | undefined | null): string | null {
  if (!ref) return null
  try {
    const host = new URL(ref).hostname
    return host.replace(/^www\./, "") || null
  } catch {
    return null
  }
}

function visitorHash(req: NextRequest, ua: string): string {
  const day = new Date().toISOString().slice(0, 10)
  const salt =
    process.env.TRACKING_SALT || process.env.NEXT_PUBLIC_SUPABASE_URL || "portfolio-salt"
  const ip =
    req.headers.get("x-real-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "0.0.0.0"
  return createHash("sha256").update(`${salt}|${day}|${ip}|${ua}`).digest("hex").slice(0, 32)
}

function cleanPath(raw: unknown): string | null {
  if (typeof raw !== "string") return null
  const path = raw.split("?")[0].split("#")[0]
  if (!path.startsWith("/") || path.length > MAX_PATH) return null
  if (path.startsWith("/_next") || path.startsWith("/api/")) return null
  return path
}

export async function POST(req: NextRequest) {
  try {
    const ua = req.headers.get("user-agent") || ""
    if (!ua || BOT_RE.test(ua)) return noContent()

    let body: Record<string, unknown>
    try {
      body = await req.json()
    } catch {
      return json({ error: "Invalid JSON" }, 400)
    }

    const type = body.type === "event" ? "event" : "pageview"
    const path = cleanPath(body.path)
    if (!path) return noContent()

    const visitor = visitorHash(req, ua)
    const device = deviceFromUA(ua)
    const country =
      req.headers.get("x-vercel-ip-country") || req.headers.get("x-ip-country") || null
    const city = req.headers.get("x-vercel-ip-city") || null
    const sessionId = typeof body.sessionId === "string" ? body.sessionId.slice(0, 64) : null
    const isNew = body.isNew === true
    const refHost = referrerHost(
      (typeof body.referrer === "string" && body.referrer) ||
        req.headers.get("referer") ||
        undefined
    )

    if (type === "pageview") {
      const { error } = await supabase.from("pageviews").insert({
        path,
        referrer_host: refHost,
        country: country ? decodeURIComponent(country) : null,
        city: city ? decodeURIComponent(city) : null,
        device,
        visitor_hash: visitor,
        session_id: sessionId,
        is_new: isNew,
      })
      if (error) console.error("track pageviews insert:", error.message)

      // Keep the legacy public counter in sync (blog "N views" badge)
      await supabase.rpc("increment_page_view", { page_path: path })

      return noContent()
    }

    const name = typeof body.name === "string" ? body.name.slice(0, 64) : null
    if (!name) return json({ error: "Missing event name" }, 400)

    const props =
      body.props && typeof body.props === "object"
        ? JSON.parse(JSON.stringify(body.props))
        : {}

    const { error } = await supabase.from("events").insert({
      name,
      path,
      props,
      visitor_hash: visitor,
      session_id: sessionId,
    })
    if (error) console.error("track events insert:", error.message)

    return noContent()
  } catch (err) {
    console.error("track route:", err)
    return noContent()
  }
}
