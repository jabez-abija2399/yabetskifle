// ─────────────────────────────────────────────────────────
// src/app/apply/lib/constants.ts
// ─────────────────────────────────────────────────────────

import type { StyleTemplate, DocTypeOption } from "../types";

export const PORTFOLIO_URL = `${process.env.NEXT_PUBLIC_SITE_URL || "https://yabetskifle.vercel.app"}/`;

export const STYLE_TEMPLATES: StyleTemplate[] = [
  {
    id: "punchy",
    label: "Punchy",
    tagline: "Lead with results.",
    description:
      "Opens with a real outcome or project — not an introduction. 3 short paragraphs max. Every sentence earns its place.",
    preview: '"Built a real-time event platform used at 200+ weddings. Here\'s what I\'d do for you."',
    bestFor: "Startups, fast-moving product teams",
    color: "#E8593C",
  },
  {
    id: "story",
    label: "Story",
    tagline: "Let the work speak.",
    description:
      "Opens with a specific moment connected to the role. The story does the selling — no skill lists, no claims.",
    preview: '"When HarifMoments went live for the first time, I understood what frontend craft actually means."',
    bestFor: "Product-focused roles, creative teams",
    color: "#7C6FE0",
  },
  {
    id: "technical",
    label: "Technical",
    tagline: "Stack-first, no fluff.",
    description:
      "Leads with exact technologies and real specifics. For engineers who want to know what you can do — not what you claim.",
    preview: '"React, Next.js, TypeScript — 2+ years in production. Real-time with Supabase. Full-stack on Next.js."',
    bestFor: "Engineering teams, technical hiring managers",
    color: "#1D9E75",
  },
  {
    id: "warm",
    label: "Warm",
    tagline: "Human, not robotic.",
    description:
      "Sounds like a real person wrote it. Mentions curiosity, care, and how you work with people. Professional but alive.",
    preview: '"I care about the small details that make a product feel alive — the timing of a transition, the weight of a button."',
    bestFor: "Startups, small teams, culture-first companies",
    color: "#C9922A",
  },
];

export const DOC_TYPES: DocTypeOption[] = [
  {
    id: "cover_letter",
    label: "Cover Letter",
    description: "Full-time, contract, or internship roles",
    placeholder:
      "Paste the full job description here. The more detail, the more tailored and specific the output will be.",
    showCompany: true,
    showRole: true,
  },
  {
    id: "proposal",
    label: "Freelance Proposal",
    description: "Upwork, direct clients, project-based",
    placeholder:
      "Describe the client's project: what they need, the problem they want solved, any tech or scope details they mentioned.",
    showCompany: false,
    showRole: false,
  },
  {
    id: "cold_dm",
    label: "Cold Outreach",
    description: "LinkedIn DM or cold email — under 80 words",
    placeholder:
      "Paste the job posting or describe the company and role you're reaching out about. Include anything specific about them.",
    showCompany: true,
    showRole: true,
  },
  {
    id: "ats_resume",
    label: "ATS Resume",
    description: "Parse-safe resume tailored to the job description",
    placeholder:
      "Paste the full job description. Keywords from it are mirrored into your skills and summary for ATS ranking.",
    showCompany: false,
    showRole: true,
  },
];
