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

async function tryEducationTable() {
  for (const t of ["education", "educations"]) {
    const probe = await fetch(`${SUPA}/rest/v1/${t}?select=id&limit=1`, { headers })
    if (probe.ok) return t
  }
  return null
}

async function tryCertTable() {
  for (const t of ["certifications", "certification"]) {
    const probe = await fetch(`${SUPA}/rest/v1/${t}?select=id&limit=1`, { headers })
    if (probe.ok) return t
  }
  return null
}

const educationRows = [
  {
    institution: "Addis Ababa Science and Technology University",
    degree: "B.Sc. in Software Engineering",
    field_of_study: "Software Engineering",
    duration: "2020 — 2025",
    grade: "Distinction",
  },
]

const certificationRows = [
  {
    title: "Meta Front-End Developer Professional Certificate",
    issuer: "Meta / Coursera",
    issued_at: "2025-03-01",
    credential_url: "https://coursera.org/verify/your-credential-id",
  },
  {
    title: "Advanced React",
    issuer: "Meta",
    issued_at: "2024-12-01",
    credential_url: "https://coursera.org/verify/your-credential-id",
  },
]

const testimonialRows = [
  {
    client_name: "Daniel Mekonnen",
    client_role: "Founder, HarifMoments",
    content:
      "Yabets translated a vague vision into a polished, production-grade product faster than I thought possible. His attention to UI detail and animation quality is rare — clients keep asking who built our platform.",
    rating: 5,
    is_published: true,
  },
  {
    client_name: "Sara Tesfaye",
    client_role: "Product Manager",
    content:
      "Reliable, communicative, and pixel-perfect. Yabets shipped a complex admin dashboard with role-based access and clean UX in record time. Easy 10/10 hire.",
    rating: 5,
    is_published: true,
  },
  {
    client_name: "Michael Brown",
    client_role: "CTO, Munich Tech Expo",
    content:
      "Took ownership of our marketing site from day one. Strong React fundamentals, great taste, and shipped responsive, accessible code that just worked across browsers.",
    rating: 5,
    is_published: true,
  },
]

const faqRows = [
  {
    question: "What kind of projects do you take on?",
    answer:
      "Production web apps and marketing sites built on React, Next.js, and TypeScript. I focus on dashboards, SaaS products, and content-driven platforms where UI quality matters.",
    category: "General",
    order_index: 0,
    is_published: true,
  },
  {
    question: "Are you available for full-time roles?",
    answer:
      "Yes — open to full-time, remote, hybrid, and freelance engagements. Reach out via the contact form below.",
    category: "Availability",
    order_index: 1,
    is_published: true,
  },
  {
    question: "What is your typical timeline?",
    answer:
      "A polished landing page lands in 1–2 weeks; a full SaaS dashboard with auth, RBAC, and admin tooling lands in 4–8 weeks depending on scope.",
    category: "Process",
    order_index: 2,
    is_published: true,
  },
  {
    question: "Do you handle backend work?",
    answer:
      "I build full-stack on Next.js with Supabase, Prisma, and PostgreSQL — auth, RBAC, file storage, and protected admin dashboards included.",
    category: "Capabilities",
    order_index: 3,
    is_published: true,
  },
  {
    question: "Can you work with an existing design system?",
    answer:
      "Yes — Figma hand-offs, design tokens, shadcn/ui, custom systems. I adapt to whatever exists, or build a system from scratch with Tailwind.",
    category: "Process",
    order_index: 4,
    is_published: true,
  },
  {
    question: "How do we start?",
    answer:
      "Send a message via the contact form with a short description of your project, timeline, and budget range. I usually reply within 24 hours.",
    category: "General",
    order_index: 5,
    is_published: true,
  },
]

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

const eduTable = await tryEducationTable()
const certTable = await tryCertTable()

await Promise.all([
  insert("posts", postRows),
])

console.log("\nDone.")
