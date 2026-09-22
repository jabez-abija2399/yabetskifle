// ─────────────────────────────────────────────────────────
// src/app/apply/lib/buildPrompt.ts
// ─────────────────────────────────────────────────────────

import type { GeneratePayload } from "../types";
import { PORTFOLIO_URL } from "./constants";

const STYLE_GUIDES: Record<string, string> = {
  punchy: `STYLE — PUNCHY:
- Open with a result, project, or outcome. Never "I am writing to apply for..."
- 3 short paragraphs maximum
- No filler openers. Dive straight in
- Every sentence must earn its place or be cut
- End with a confident, direct close — not "I hope to hear from you"`,

  story: `STYLE — STORY-DRIVEN:
- Open with a specific moment or project that directly connects to this role
- Let the story do the selling — do not list skills
- Show what was built and what it felt like to build it
- Transition naturally into why this role is the next chapter
- End with a single, clear sentence that invites a conversation`,

  technical: `STYLE — TECHNICAL DEPTH:
- Lead with exact stack and concrete specifics
- Name real technologies: React, Next.js, TypeScript, Supabase, Prisma
- Reference real architectural decisions made in real projects
- For engineers who want to know what you can actually do, not what you claim
- No soft language — be precise and direct`,

  warm: `STYLE — WARM & DIRECT:
- Sound like a real person, not a resume
- Mention curiosity, care, and how you work with people
- Reference what excites you about this specific role or company
- Professional but human — like an email from a person you'd want to hire
- End warmly but with a clear ask`,
};

function getCoverLetterGuide(company: string, role: string): string {
  return `DOCUMENT TYPE — COVER LETTER:
- Writing for: ${role ? `the "${role}" role` : "the position"} at ${company || "the company"}
- Structure: 3–4 short paragraphs
- Reference at least one real project from the portfolio by name, with a concrete detail or outcome
- End with a confident close — not "I hope to hear from you" or "I look forward to..."
- No "Dear Hiring Manager" opener — open with something real and specific`;
}

function getProposalGuide(): string {
  return `DOCUMENT TYPE — FREELANCE PROPOSAL:
- Structure strictly:
  1. Show you understand the client's specific problem (from their brief)
  2. Your specific solution — reference a real project from the portfolio as proof of concept
  3. Why you specifically — one short, direct paragraph
  4. A clear, simple next step CTA
- No pricing — that comes in the conversation
- No generic "I am excited to work with you" openers`;
}

function getColdDmGuide(company: string, role: string): string {
  return `DOCUMENT TYPE — COLD OUTREACH MESSAGE:
- Platform: LinkedIn DM or short cold email
- Hard limit: 80 words maximum
- Reference something specific and real about ${company || "the company"} or the ${role || "role"}
- One clear ask at the end — simple, direct
- End with a question they can answer with yes/no or one sentence
- No attachments or links mentioned
- No "I came across your profile and was impressed by..."`;
}

export function buildPrompt(payload: GeneratePayload): string {
  const { docType, style, jobDescription, companyName = "", roleName = "" } = payload;

  const styleGuide = STYLE_GUIDES[style] ?? STYLE_GUIDES.punchy;

  const docGuide =
    docType === "cover_letter"
      ? getCoverLetterGuide(companyName, roleName)
      : docType === "cold_dm"
      ? getColdDmGuide(companyName, roleName)
      : getProposalGuide();

  return `You are writing a job application document on behalf of the developer whose portfolio lives at:
${PORTFOLIO_URL}

STEP 1 — READ THE PORTFOLIO:
Use the URL context tool to read the full portfolio. Extract and use:
- Full name, location, availability, languages spoken
- Complete tech stack with exact tool names
- Every project: name, what it does, technologies used, real outcomes or details
- Work experience: company names, roles, dates, what was built
- Writing voice and tone from the About section (calm, confident, craft-focused)
- Testimonials: what clients actually said about working with this person
- FAQ answers: how they work, what they're open to

STEP 2 — WRITE THE DOCUMENT:

${styleGuide}

${docGuide}

CRITICAL RULES — NEVER BREAK THESE:
Never write "I am highly motivated" or "I am passionate about"
Never write "I believe I would be a great fit" or "I am a strong communicator"
Never invent projects, technologies, or details not found on the portfolio
Never use corporate filler: "leverage", "synergize", "dynamic team player"
Never start with "I am writing to apply..."
Always reference at least one real project by its actual name
Match the calm, direct, craft-focused voice of the About section exactly
Sound like a thoughtful human wrote this after reading the job description carefully
Output ONLY the document text — no preamble, no "here is your letter", no markdown headers

JOB DESCRIPTION / CLIENT BRIEF:
${jobDescription}`;
}
