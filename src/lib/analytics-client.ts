"use client"

/** Client-side analytics: POSTs to /api/track (geo, hashing, bot filter happen server-side). */

type TrackBody = {
  type: "pageview" | "event"
  path: string
  referrer?: string
  sessionId?: string
  isNew?: boolean
  name?: string
  props?: Record<string, unknown>
}

function sessionId(): string {
  try {
    let id = sessionStorage.getItem("yt_sid")
    if (!id) {
      id = crypto.randomUUID()
      sessionStorage.setItem("yt_sid", id)
    }
    return id
  } catch {
    return "unknown"
  }
}

/** True only on the first tracked action of this browser session. */
function consumeNewFlag(): boolean {
  try {
    if (!sessionStorage.getItem("yt_seen")) {
      sessionStorage.setItem("yt_seen", "1")
      return true
    }
  } catch {
    /* private mode — treat as new */
  }
  return false
}

function send(body: TrackBody) {
  if (typeof window === "undefined") return
  if (window.location.pathname.startsWith("/admin")) return

  const payload = JSON.stringify(body)
  try {
    if (navigator.sendBeacon) {
      const ok = navigator.sendBeacon("/api/track", new Blob([payload], { type: "application/json" }))
      if (ok) return
    }
  } catch {
    /* fall through to fetch */
  }
  fetch("/api/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: payload,
    keepalive: true,
  }).catch(() => {})
}

export function trackPageview(path: string) {
  send({
    type: "pageview",
    path,
    referrer: document.referrer || undefined,
    sessionId: sessionId(),
    isNew: consumeNewFlag(),
  })
}

export function trackEvent(name: string, props: Record<string, unknown> = {}) {
  send({
    type: "event",
    path: window.location.pathname,
    referrer: document.referrer || undefined,
    sessionId: sessionId(),
    isNew: false,
    name,
    props,
  })
}
