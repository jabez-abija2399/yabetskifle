// ─────────────────────────────────────────────────────────
// src/app/admin/apply/lib/buildPrompt.ts
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

function getResumeGuide(role: string): string {
  return `DOCUMENT TYPE — ATS RESUME (plain text, parse-safe):

Output the resume as PLAIN TEXT with EXACTLY this structure, in this order:

Line 1: full name alone
Line 2: location | email | phone | linkedin | portfolio  (pipe-separated contact line)

SUMMARY
(3 lines max. Weave in the exact target role title${role ? ` — "${role}"` : " from the job description"} plus 3–5 hard skills from the job description, naturally.)

SKILLS
Group: Category: skill, skill, skill
(Mirror the job description's exact keyword spellings. Include acronym + expansion where relevant, e.g. "CRM (Salesforce)". Concrete skills before soft skills.)

EXPERIENCE
Role — Company
Month YYYY – Month YYYY (or "Present")
• achievement bullet with a real metric or outcome
• another bullet — stack keywords in context
(Use ONLY facts from the FACTS block below. Never invent employers, titles, or dates. If a date is unknown, omit the date line rather than guessing.)

PROJECTS
Project name — one-line description woven with stack keywords
(Only real projects from the FACTS block.)

EDUCATION
Degree — Institution, Year

CERTIFICATIONS
(Only if the FACTS block lists any. One per line. Otherwise omit this section entirely.)

ATS RULES — NEVER BREAK:
- Single text flow: no tables, no columns, no headers/footers, no markdown, no HTML
- Section headings spelled exactly: SUMMARY, SKILLS, EXPERIENCE, PROJECTS, EDUCATION, CERTIFICATIONS
- Bullets start with "• " (space after the bullet)
- Dates spelled out: January 2024 – March 2025 (never 01/24)
- Standard section order, left-aligned text only
- 450–700 words total
- Include the target job title from the job description in the SUMMARY
- Quantify every experience bullet where a real number exists
- Output ONLY the resume text — no preamble, no explanations, no markdown code fences`;
}

/** Compact authoritative facts block injected server-side for resume generation. */
export interface PortfolioFacts {
  profile: Record<string, unknown> | null;
  experience: unknown[];
  skills: unknown[];
  education: unknown[];
  certifications: unknown[];
  projects: unknown[];
}

export function formatPortfolioFacts(f: PortfolioFacts): string {
  return JSON.stringify(
    {
      profile: f.profile
        ? {
            name: f.profile.full_name,
            title: f.profile.role_title,
            bio: f.profile.bio,
            about: f.profile.about_story,
            location: f.profile.location,
            years: f.profile.experience_years,
            availability: f.profile.availability_tags,
            links: f.profile.social_links,
            resume: f.profile.resume_url,
          }
        : null,
      experience: f.experience,
      skills: f.skills,
      education: f.education,
      certifications: f.certifications,
      projects: f.projects.slice(0, 8),
    },
    null,
    1
  );
}

export function buildPrompt(payload: GeneratePayload, facts?: string): string {
  const { docType, style, jobDescription, companyName = "", roleName = "" } = payload;

  const styleGuide = STYLE_GUIDES[style] ?? STYLE_GUIDES.punchy;

  const docGuide =
    docType === "cover_letter"
      ? getCoverLetterGuide(companyName, roleName)
      : docType === "cold_dm"
      ? getColdDmGuide(companyName, roleName)
      : docType === "ats_resume"
      ? getResumeGuide(roleName)
      : getProposalGuide();

  const grounding = facts
    ? `STEP 1 — AUTHORITATIVE FACTS:
Use ONLY these facts about the developer. Never invent employers, dates, projects, or skills not present here (the job description may add required keywords — mirror those keywords, but never claim experience that isn't in these facts):

${facts}`
    : `STEP 1 — READ THE PORTFOLIO:
Use the URL context tool to read the full portfolio at ${PORTFOLIO_URL}. Extract and use:
- Full name, location, availability, languages spoken
- Complete tech stack with exact tool names
- Every project: name, what it does, technologies used, real outcomes or details
- Work experience: company names, roles, dates, what was built
- Writing voice and tone from the About section (calm, confident, craft-focused)
- Testimonials: what clients actually said about working with this person
- FAQ answers: how they work, what they're open to`;

  return `You are writing a job application document on behalf of the developer whose portfolio lives at:
${PORTFOLIO_URL}

${grounding}

STEP 2 — WRITE THE DOCUMENT:

${styleGuide}

${docGuide}

CRITICAL RULES — NEVER BREAK THESE:
Never write "I am highly motivated" or "I am passionate about"
Never write "I believe I would be a great fit" or "I am a strong communicator"
Never invent projects, technologies, or details not found on the portfolio
Never use corporate filler: "leverage", "synergize", "dynamic team player"
Never start with "I am writing to apply..."
${docType === "ats_resume" ? "" : "Always reference at least one real project by its actual name"}
Match the calm, direct, craft-focused voice of the About section exactly
Sound like a thoughtful human wrote this after reading the job description carefully
Output ONLY the document text — no preamble, no "here is your letter", no markdown headers

JOB DESCRIPTION / CLIENT BRIEF:
${jobDescription}`;
}
