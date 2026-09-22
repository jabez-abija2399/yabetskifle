// Seed script for portfolio content.
// Usage: node scripts/seed.mjs
// Reads NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY from .env.local

import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, resolve } from "node:path"

const __dirname = dirname(fileURLToPath(import.meta.url))
const envPath = resolve(__dirname, "..", ".env.local")
const env = Object.fromEntries(
  readFileSync(envPath, "utf8")
    .split("\n")
    .filter((l) => l && !l.startsWith("#") && l.includes("="))
    .map((l) => {
      const i = l.indexOf("=")
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()]
    })
)

const SUPA = env.NEXT_PUBLIC_SUPABASE_URL
const KEY = env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
if (!SUPA || !KEY) {
  console.error("Missing Supabase env vars")
  process.exit(1)
}

const headers = {
  apikey: KEY,
  Authorization: `Bearer ${KEY}`,
  "Content-Type": "application/json",
  Prefer: "return=minimal",
}

async function insert(table, rows) {
  const res = await fetch(`${SUPA}/rest/v1/${table}`, {
    method: "POST",
    headers,
    body: JSON.stringify(rows),
  })
  if (!res.ok) {
    console.error(`✗ ${table}: ${res.status} ${await res.text()}`)
    return false
  }
  console.log(`✓ ${table}: inserted ${rows.length}`)
  return true
}

const postRows = [
  {
    title: "Building a Real-Time Event Platform with Next.js and Supabase",
    slug: "real-time-event-platform-nextjs-supabase",
    content:
      "# Building a Real-Time Event Platform\n\nA breakdown of the architecture behind HarifMoments — live digital signboards, QR-coded invitations, and moderated guest interactions powered by Next.js App Router and Supabase realtime.\n\n## The Stack\n\n- **Next.js 16** for SSR and the App Router\n- **Supabase** for auth, postgres, realtime, and storage\n- **Tailwind CSS + Framer Motion** for the UI layer\n- **Fabric.js** for the signage canvas editor\n\n## Lessons Learned\n\nReal-time systems need careful debouncing, optimistic UI, and a robust moderation queue. Spend more time than you'd expect designing the moderator's experience — guests will always test the limits.",
    excerpt:
      "How I built HarifMoments — a real-time digital signage platform — with Next.js, Supabase realtime, and Fabric.js.",
    cover_image:
      "https://uypkccrufloxocjbzbaj.supabase.co/storage/v1/object/public/project-images/1777474193757-y0spy9-Screenshot-from-2026-04-28-18-04-45.png",
    published: true,
    tags: ["Next.js", "Supabase", "Realtime", "Architecture"],
  },
  {
    title: "Designing Admin Dashboards That People Actually Use",
    slug: "admin-dashboards-people-use",
    content:
      "# Designing Admin Dashboards That People Actually Use\n\nMost admin panels are designed by engineers for engineers, then handed to operators who hate them. Here's how I approach building dashboards that respect the operator's time.\n\n## Three Principles\n\n1. **One screen per intent.** No 14-tab monstrosities.\n2. **Optimistic, reversible actions.** Operators move fast; let them undo, not confirm.\n3. **Search first, browse second.** A good search bar replaces ten filters.\n\nApply these and you'll cut training time and increase actual usage. Both numbers your stakeholders care about.",
    excerpt:
      "Three design principles for admin dashboards your operators will actually want to use.",
    cover_image: null,
    published: true,
    tags: ["UX", "Dashboard", "Design", "Frontend"],
  },
]

await Promise.all([
  insert("posts", postRows),
])

console.log("\nDone.")
