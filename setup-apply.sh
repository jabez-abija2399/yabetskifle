#!/bin/bash
# ═══════════════════════════════════════════════════════════════
#  Job Application AI — Setup Script
#  Run this from the ROOT of your yabetskifle Next.js project:
#
#    bash setup-apply.sh
#
# ═══════════════════════════════════════════════════════════════

set -e  # stop on any error

GREEN='\033[0;32m'
BLUE='\033[0;34m'
GRAY='\033[0;90m'
NC='\033[0m' # No Color

log()  { echo -e "${BLUE}▸${NC} $1"; }
ok() { echo -e "${GREEN}✓${NC} $1"; }
info() { echo -e "${GRAY}  $1${NC}"; }

echo ""
echo -e "${BLUE}══════════════════════════════════════════${NC}"
echo -e "${BLUE}  Job Application AI — File Setup         ${NC}"
echo -e "${BLUE}══════════════════════════════════════════${NC}"
echo ""

# ── 1. Create all directories ─────────────────────────────────
log "Creating directories..."

mkdir -p src/app/apply/types
mkdir -p src/app/apply/lib
mkdir -p src/app/apply/hooks
mkdir -p src/app/apply/components
mkdir -p src/app/api/apply

ok "Directories created"
echo ""

# ── 2. types/index.ts ─────────────────────────────────────────
log "Writing src/app/apply/types/index.ts"
cat > src/app/apply/types/index.ts << 'ENDOFFILE'
// ─────────────────────────────────────────────────────────
// src/app/apply/types/index.ts
// ─────────────────────────────────────────────────────────

export type DocType = "cover_letter" | "proposal" | "cold_dm";
export type StyleKey = "punchy" | "story" | "technical" | "warm";
export type GenerationStatus = "idle" | "loading" | "success" | "error";

export interface StyleTemplate {
  id: StyleKey;
  label: string;
  tagline: string;
  description: string;
  preview: string;
  bestFor: string;
  color: string;
}

export interface DocTypeOption {
  id: DocType;
  label: string;
  description: string;
  placeholder: string;
  showCompany: boolean;
  showRole: boolean;
}

export interface GeneratePayload {
  docType: DocType;
  style: StyleKey;
  jobDescription: string;
  companyName?: string;
  roleName?: string;
}

export interface GenerateResponse {
  output?: string;
  error?: string;
}
ENDOFFILE
ok "types/index.ts"

# ── 3. lib/constants.ts ───────────────────────────────────────
log "Writing src/app/apply/lib/constants.ts"
cat > src/app/apply/lib/constants.ts << 'ENDOFFILE'
// ─────────────────────────────────────────────────────────
// src/app/apply/lib/constants.ts
// ─────────────────────────────────────────────────────────

import type { StyleTemplate, DocTypeOption } from "../types";

export const PORTFOLIO_URL = "https://yabetskifle.vercel.app/";

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
];
ENDOFFILE
ok "lib/constants.ts"

# ── 4. lib/buildPrompt.ts ─────────────────────────────────────
log "Writing src/app/apply/lib/buildPrompt.ts"
cat > src/app/apply/lib/buildPrompt.ts << 'ENDOFFILE'
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
ENDOFFILE
ok "lib/buildPrompt.ts"

# ── 5. hooks/useApply.ts ──────────────────────────────────────
log "Writing src/app/apply/hooks/useApply.ts"
cat > src/app/apply/hooks/useApply.ts << 'ENDOFFILE'
"use client";
// ─────────────────────────────────────────────────────────
// src/app/apply/hooks/useApply.ts
// ─────────────────────────────────────────────────────────

import { useState, useCallback } from "react";
import type {
  DocType,
  StyleKey,
  GenerationStatus,
  GeneratePayload,
} from "../types";

export function useApplyForm() {
  const [docType, setDocType] = useState<DocType>("cover_letter");
  const [style, setStyle] = useState<StyleKey>("punchy");
  const [jobDescription, setJobDescription] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [roleName, setRoleName] = useState("");

  const isValid = jobDescription.trim().length > 20;

  const resetForm = useCallback(() => {
    setJobDescription("");
    setCompanyName("");
    setRoleName("");
  }, []);

  const toPayload = useCallback(
    (): GeneratePayload => ({
      docType,
      style,
      jobDescription,
      companyName,
      roleName,
    }),
    [docType, style, jobDescription, companyName, roleName]
  );

  return {
    docType, setDocType,
    style, setStyle,
    jobDescription, setJobDescription,
    companyName, setCompanyName,
    roleName, setRoleName,
    isValid,
    resetForm,
    toPayload,
  };
}

export function useGenerate() {
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState<GenerationStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const generate = useCallback(async (payload: GeneratePayload) => {
    setStatus("loading");
    setOutput("");
    setErrorMsg("");

    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error ?? "Generation failed. Please try again.");
      }

      setOutput(data.output);
      setStatus("success");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }, []);

  const reset = useCallback(() => {
    setOutput("");
    setStatus("idle");
    setErrorMsg("");
  }, []);

  return { output, setOutput, status, errorMsg, generate, reset };
}
ENDOFFILE
ok "hooks/useApply.ts"

# ── 6. components/SectionLabel.tsx ────────────────────────────
log "Writing src/app/apply/components/SectionLabel.tsx"
cat > src/app/apply/components/SectionLabel.tsx << 'ENDOFFILE'
// ─────────────────────────────────────────────────────────
// src/app/apply/components/SectionLabel.tsx
// ─────────────────────────────────────────────────────────

interface Props {
  step: string;
  label: string;
  description?: string;
}

export function SectionLabel({ step, label, description }: Props) {
  return (
    <div className="flex items-start gap-3 mb-4">
      <span className="text-xs font-mono text-neutral-400 dark:text-neutral-600 pt-0.5 shrink-0">
        {step}
      </span>
      <div>
        <h2 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
          {label}
        </h2>
        {description && (
          <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5 leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
ENDOFFILE
ok "components/SectionLabel.tsx"

# ── 7. components/DocTypeTabs.tsx ─────────────────────────────
log "Writing src/app/apply/components/DocTypeTabs.tsx"
cat > src/app/apply/components/DocTypeTabs.tsx << 'ENDOFFILE'
"use client";
// ─────────────────────────────────────────────────────────
// src/app/apply/components/DocTypeTabs.tsx
// ─────────────────────────────────────────────────────────

import { motion } from "framer-motion";
import { DOC_TYPES } from "../lib/constants";
import type { DocType } from "../types";

interface Props {
  value: DocType;
  onChange: (v: DocType) => void;
}

export function DocTypeTabs({ value, onChange }: Props) {
  return (
    <div className="flex gap-1 p-1 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
      {DOC_TYPES.map((opt) => {
        const active = value === opt.id;
        return (
          <button
            key={opt.id}
            onClick={() => onChange(opt.id)}
            className="relative flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
          >
            {active && (
              <motion.div
                layoutId="doc-tab-indicator"
                className="absolute inset-0 rounded-lg bg-white dark:bg-neutral-800 shadow-sm border border-neutral-200 dark:border-neutral-700"
                transition={{ type: "spring", stiffness: 500, damping: 40 }}
              />
            )}
            <span
              className={`relative z-10 flex flex-col gap-0.5 text-left ${
                active
                  ? "text-neutral-900 dark:text-neutral-100"
                  : "text-neutral-500 dark:text-neutral-400"
              }`}
            >
              <span className="font-semibold text-xs tracking-wide uppercase">
                {opt.label}
              </span>
              <span className="text-xs font-normal hidden sm:block opacity-80">
                {opt.description}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
ENDOFFILE
ok "components/DocTypeTabs.tsx"

# ── 8. components/StyleGallery.tsx ────────────────────────────
log "Writing src/app/apply/components/StyleGallery.tsx"
cat > src/app/apply/components/StyleGallery.tsx << 'ENDOFFILE'
"use client";
// ─────────────────────────────────────────────────────────
// src/app/apply/components/StyleGallery.tsx
// ─────────────────────────────────────────────────────────

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { STYLE_TEMPLATES } from "../lib/constants";
import type { StyleKey } from "../types";

interface Props {
  value: StyleKey;
  onChange: (v: StyleKey) => void;
}

export function StyleGallery({ value, onChange }: Props) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold tracking-widest uppercase text-neutral-400 dark:text-neutral-500">
        Choose a style
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {STYLE_TEMPLATES.map((tpl, i) => {
          const active = value === tpl.id;
          return (
            <motion.button
              key={tpl.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.3 }}
              onClick={() => onChange(tpl.id)}
              className={`relative text-left p-4 rounded-xl border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 group ${
                active
                  ? "border-neutral-900 dark:border-neutral-100 bg-neutral-50 dark:bg-neutral-900"
                  : "border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 hover:border-neutral-400 dark:hover:border-neutral-600"
              }`}
            >
              <div
                className="absolute top-0 left-4 right-4 h-[2px] rounded-b-full transition-opacity duration-200"
                style={{ background: tpl.color, opacity: active ? 1 : 0 }}
              />
              <div className="flex items-start justify-between mb-2">
                <div>
                  <span
                    className="text-xs font-bold tracking-widest uppercase"
                    style={{ color: tpl.color }}
                  >
                    {tpl.label}
                  </span>
                  <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 mt-0.5">
                    {tpl.tagline}
                  </p>
                </div>
                {active && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 600, damping: 30 }}
                  >
                    <CheckCircle2
                      className="w-4 h-4 shrink-0 mt-0.5"
                      style={{ color: tpl.color }}
                    />
                  </motion.div>
                )}
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed mb-3">
                {tpl.description}
              </p>
              <div
                className="text-xs italic text-neutral-600 dark:text-neutral-400 pl-3 py-1 border-l-2 leading-relaxed transition-colors duration-200"
                style={{ borderColor: active ? tpl.color : "transparent" }}
              >
                {tpl.preview}
              </div>
              <p className="mt-3 text-xs text-neutral-400 dark:text-neutral-500">
                Best for: {tpl.bestFor}
              </p>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
ENDOFFILE
ok "components/StyleGallery.tsx"

# ── 9. components/JobForm.tsx ─────────────────────────────────
log "Writing src/app/apply/components/JobForm.tsx"
cat > src/app/apply/components/JobForm.tsx << 'ENDOFFILE'
"use client";
// ─────────────────────────────────────────────────────────
// src/app/apply/components/JobForm.tsx
// ─────────────────────────────────────────────────────────

import { Loader2, Sparkles } from "lucide-react";
import { DOC_TYPES } from "../lib/constants";
import type { DocType } from "../types";

interface Props {
  docType: DocType;
  jobDescription: string;
  companyName: string;
  roleName: string;
  isValid: boolean;
  isLoading: boolean;
  onJobDescriptionChange: (v: string) => void;
  onCompanyNameChange: (v: string) => void;
  onRoleNameChange: (v: string) => void;
  onSubmit: () => void;
}

export function JobForm({
  docType,
  jobDescription,
  companyName,
  roleName,
  isValid,
  isLoading,
  onJobDescriptionChange,
  onCompanyNameChange,
  onRoleNameChange,
  onSubmit,
}: Props) {
  const docConfig = DOC_TYPES.find((d) => d.id === docType)!;
  const charCount = jobDescription.length;

  return (
    <div className="space-y-4">
      {(docConfig.showCompany || docConfig.showRole) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {docConfig.showCompany && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold tracking-widest uppercase text-neutral-400 dark:text-neutral-500">
                Company
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => onCompanyNameChange(e.target.value)}
                placeholder="e.g. Stripe, HOPn, Notion"
                className="w-full px-3 py-2.5 text-sm rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600 transition-all duration-200"
              />
            </div>
          )}
          {docConfig.showRole && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold tracking-widest uppercase text-neutral-400 dark:text-neutral-500">
                Role
              </label>
              <input
                type="text"
                value={roleName}
                onChange={(e) => onRoleNameChange(e.target.value)}
                placeholder="e.g. Frontend Engineer, Full-Stack Dev"
                className="w-full px-3 py-2.5 text-sm rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600 transition-all duration-200"
              />
            </div>
          )}
        </div>
      )}

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold tracking-widest uppercase text-neutral-400 dark:text-neutral-500">
            {docType === "proposal" ? "Project Brief" : "Job Description"}
          </label>
          <span
            className={`text-xs tabular-nums transition-colors ${
              charCount < 50
                ? "text-neutral-300 dark:text-neutral-700"
                : "text-neutral-400 dark:text-neutral-500"
            }`}
          >
            {charCount} chars
          </span>
        </div>
        <textarea
          value={jobDescription}
          onChange={(e) => onJobDescriptionChange(e.target.value)}
          placeholder={docConfig.placeholder}
          rows={8}
          className="w-full px-4 py-3 text-sm rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600 resize-none leading-relaxed transition-all duration-200"
        />
        <p className="text-xs text-neutral-400 dark:text-neutral-600">
          More detail → more tailored output. Paste the full JD.
        </p>
      </div>

      <button
        onClick={onSubmit}
        disabled={!isValid || isLoading}
        className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 disabled:opacity-40 disabled:cursor-not-allowed bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 hover:bg-neutral-700 dark:hover:bg-neutral-300 active:scale-[0.99]"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Reading your portfolio &amp; generating...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            Generate
          </>
        )}
      </button>
    </div>
  );
}
ENDOFFILE
ok "components/JobForm.tsx"

# ── 10. components/OutputEditor.tsx ──────────────────────────
log "Writing src/app/apply/components/OutputEditor.tsx"
cat > src/app/apply/components/OutputEditor.tsx << 'ENDOFFILE'
"use client";
// ─────────────────────────────────────────────────────────
// src/app/apply/components/OutputEditor.tsx
// ─────────────────────────────────────────────────────────

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, RefreshCw, AlertTriangle, Eye, EyeOff } from "lucide-react";

const AI_PHRASES = [
  "highly motivated",
  "passionate about",
  "strong communicator",
  "team player",
  "I believe I would be a great fit",
  "I am excited to",
  "I look forward to hearing",
  "leverag",
  "synerg",
  "I am writing to apply",
  "dynamic team",
  "fast-paced environment",
  "go-getter",
  "results-driven",
  "I am confident that",
  "I would love the opportunity",
  "please find attached",
  "do not hesitate to contact",
];

function highlightAIPhrases(text: string): string {
  let result = text;
  for (const phrase of AI_PHRASES) {
    const re = new RegExp(`(${phrase})`, "gi");
    result = result.replace(re, `<mark class="apply-ai-phrase">$1</mark>`);
  }
  return result;
}

function countAIPhrases(text: string): number {
  let count = 0;
  for (const phrase of AI_PHRASES) {
    const re = new RegExp(phrase, "gi");
    const matches = text.match(re);
    if (matches) count += matches.length;
  }
  return count;
}

interface Props {
  output: string;
  onChange: (v: string) => void;
  onReset: () => void;
}

export function OutputEditor({ output, onChange, onReset }: Props) {
  const [copied, setCopied] = useState(false);
  const [showHighlights, setShowHighlights] = useState(true);
  const aiCount = countAIPhrases(output);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [output]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-3"
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold tracking-widest uppercase text-neutral-400 dark:text-neutral-500">
          Your document
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowHighlights((v) => !v)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 ${
              aiCount > 0 && showHighlights
                ? "border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-300"
                : "border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 hover:border-neutral-400"
            }`}
          >
            {showHighlights ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
            {aiCount > 0 ? `${aiCount} AI phrase${aiCount > 1 ? "s" : ""}` : "Clean"}
          </button>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:border-neutral-400 dark:hover:border-neutral-600 transition-all duration-200"
          >
            <AnimatePresence mode="wait" initial={false}>
              {copied ? (
                <motion.span key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="flex items-center gap-1 text-green-600 dark:text-green-400">
                  <Check className="w-3 h-3" /> Copied
                </motion.span>
              ) : (
                <motion.span key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="flex items-center gap-1">
                  <Copy className="w-3 h-3" /> Copy
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 hover:border-neutral-400 dark:hover:border-neutral-600 transition-all duration-200"
          >
            <RefreshCw className="w-3 h-3" /> New
          </button>
        </div>
      </div>

      <AnimatePresence>
        {aiCount > 0 && showHighlights && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-start gap-2 px-3 py-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
              <span className="font-semibold">{aiCount} phrase{aiCount > 1 ? "s" : ""} flagged</span> — highlighted in yellow. Rewrite these in the editor below before sending.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {showHighlights && aiCount > 0 && (
        <div
          className="text-sm leading-relaxed px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap pointer-events-none select-none apply-highlight-preview"
          dangerouslySetInnerHTML={{ __html: highlightAIPhrases(output) }}
        />
      )}

      <div className="space-y-1">
        <p className="text-xs text-neutral-400 dark:text-neutral-600">
          Edit directly below — this is your copy.
        </p>
        <textarea
          value={output}
          onChange={(e) => onChange(e.target.value)}
          rows={16}
          className="w-full px-4 py-3 text-sm rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600 resize-none leading-relaxed font-mono transition-all duration-200"
        />
      </div>
    </motion.div>
  );
}
ENDOFFILE
ok "components/OutputEditor.tsx"

# ── 11. components/ApplyClient.tsx ────────────────────────────
log "Writing src/app/apply/components/ApplyClient.tsx"
cat > src/app/apply/components/ApplyClient.tsx << 'ENDOFFILE'
"use client";
// ─────────────────────────────────────────────────────────
// src/app/apply/components/ApplyClient.tsx
// ─────────────────────────────────────────────────────────

import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { DocTypeTabs } from "./DocTypeTabs";
import { StyleGallery } from "./StyleGallery";
import { JobForm } from "./JobForm";
import { OutputEditor } from "./OutputEditor";
import { SectionLabel } from "./SectionLabel";
import { useApplyForm, useGenerate } from "../hooks/useApply";

export function ApplyClient() {
  const form = useApplyForm();
  const gen = useGenerate();

  const handleGenerate = async () => {
    await gen.generate(form.toPayload());
  };

  const handleReset = () => {
    gen.reset();
    form.resetForm();
  };

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 px-4 py-16 sm:py-24">
      <div className="max-w-2xl mx-auto space-y-12">

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-3"
        >
          <p className="text-xs font-semibold tracking-widest uppercase text-neutral-400 dark:text-neutral-500">
            Private — Yabets only
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            Job Application AI
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-lg">
            Reads your live portfolio at{" "}
            <span className="font-mono text-xs text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-900 px-1.5 py-0.5 rounded">
              yabetskifle.vercel.app
            </span>{" "}
            and generates documents in your actual voice. Nothing hardcoded — updates automatically when your site updates.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <SectionLabel
            step="01"
            label="What are you writing?"
            description="Choose the type of document you need."
          />
          <DocTypeTabs value={form.docType} onChange={form.setDocType} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
        >
          <SectionLabel
            step="02"
            label="Pick a style"
            description="This shapes the entire tone and structure of the output."
          />
          <StyleGallery value={form.style} onChange={form.setStyle} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <SectionLabel
            step="03"
            label="Paste the job description"
            description="The AI reads your portfolio live and writes around what it finds."
          />
          <JobForm
            docType={form.docType}
            jobDescription={form.jobDescription}
            companyName={form.companyName}
            roleName={form.roleName}
            isValid={form.isValid}
            isLoading={gen.status === "loading"}
            onJobDescriptionChange={form.setJobDescription}
            onCompanyNameChange={form.setCompanyName}
            onRoleNameChange={form.setRoleName}
            onSubmit={handleGenerate}
          />
        </motion.div>

        <AnimatePresence>
          {gen.status === "error" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800"
            >
              <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-700 dark:text-red-300">Generation failed</p>
                <p className="text-xs text-red-600 dark:text-red-400 mt-0.5">{gen.errorMsg}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {gen.status === "success" && gen.output && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <SectionLabel
                step="04"
                label="Your document"
                description="Edit directly. Flagged phrases are AI-sounding — rewrite those before sending."
              />
              <OutputEditor
                output={gen.output}
                onChange={gen.setOutput}
                onReset={handleReset}
              />
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
ENDOFFILE
ok "components/ApplyClient.tsx"

# ── 12. apply/page.tsx ────────────────────────────────────────
log "Writing src/app/apply/page.tsx"
cat > src/app/apply/page.tsx << 'ENDOFFILE'
// ─────────────────────────────────────────────────────────
// src/app/apply/page.tsx
// ─────────────────────────────────────────────────────────

import type { Metadata } from "next";
import { ApplyClient } from "./components/ApplyClient";

export const metadata: Metadata = {
  title: "Apply — Yabets Kifle",
  robots: { index: false, follow: false },
};

export default function ApplyPage() {
  return <ApplyClient />;
}
ENDOFFILE
ok "apply/page.tsx"

# ── 13. api/apply/route.ts ────────────────────────────────────
log "Writing src/app/api/apply/route.ts"
cat > src/app/api/apply/route.ts << 'ENDOFFILE'
// ─────────────────────────────────────────────────────────
// src/app/api/apply/route.ts
// ─────────────────────────────────────────────────────────

import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";
import { buildPrompt } from "@/app/apply/lib/buildPrompt";
import type { GeneratePayload } from "@/app/apply/types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function POST(req: NextRequest) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not set in environment variables." },
        { status: 500 }
      );
    }

    const body = (await req.json()) as Partial<GeneratePayload>;

    if (!body.docType || !body.style || !body.jobDescription?.trim()) {
      return NextResponse.json(
        { error: "Missing required fields: docType, style, jobDescription." },
        { status: 400 }
      );
    }

    if (body.jobDescription.trim().length < 20) {
      return NextResponse.json(
        { error: "Job description too short. Please paste the full description." },
        { status: 400 }
      );
    }

    const payload = body as GeneratePayload;
    const prompt = buildPrompt(payload);

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ urlContext: {} }],
        temperature: 0.85,
        maxOutputTokens: 1200,
      },
    });

    const output = response.text;

    if (!output?.trim()) {
      return NextResponse.json(
        { error: "Empty response from AI. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ output: output.trim() });

  } catch (err) {
    console.error("[/api/apply] Error:", err);
    const message = err instanceof Error ? err.message : "Unexpected error occurred.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
ENDOFFILE
ok "api/apply/route.ts"

# ── 14. Append CSS to globals.css ─────────────────────────────
log "Appending AI highlight styles to src/app/globals.css"
cat >> src/app/globals.css << 'ENDOFFILE'

/* ── Job Application AI — phrase highlights ─────────────────── */
.apply-highlight-preview mark.apply-ai-phrase {
  background-color: #fef08a;
  color: #713f12;
  border-radius: 2px;
  padding: 0 2px;
  font-style: normal;
}

@media (prefers-color-scheme: dark) {
  .apply-highlight-preview mark.apply-ai-phrase {
    background-color: #422006;
    color: #fde68a;
  }
}
ENDOFFILE
ok "globals.css updated"

# ── 15. Add GEMINI_API_KEY to .env.local if missing ───────────
echo ""
log "Checking .env.local..."
if [ -f ".env.local" ]; then
  if grep -q "GEMINI_API_KEY" .env.local; then
    info "GEMINI_API_KEY already exists in .env.local — skipping"
  else
    echo "" >> .env.local
    echo "# Gemini API — get your free key at https://aistudio.google.com" >> .env.local
    echo "GEMINI_API_KEY=your_key_here" >> .env.local
    ok ".env.local updated — replace 'your_key_here' with your actual key"
  fi
else
  cat > .env.local << 'ENDOFFILE'
# Gemini API — get your free key at https://aistudio.google.com
GEMINI_API_KEY=your_key_here
ENDOFFILE
  ok ".env.local created — replace 'your_key_here' with your actual key"
fi

# ── Done ──────────────────────────────────────────────────────
echo ""
echo -e "${GREEN}══════════════════════════════════════════${NC}"
echo -e "${GREEN}  All done! 14 files created.             ${NC}"
echo -e "${GREEN}══════════════════════════════════════════${NC}"
echo ""
echo -e "  ${BLUE}Next steps:${NC}"
echo -e "  1. Open ${BLUE}.env.local${NC} and replace ${BLUE}your_key_here${NC} with your Gemini key"
echo -e "     Get it free → ${BLUE}https://aistudio.google.com${NC}"
echo ""
echo -e "  2. Run your dev server:"
echo -e "     ${BLUE}npm run dev${NC}"
echo ""
echo -e "  3. Visit:"
echo -e "     ${BLUE}http://localhost:3000/apply${NC}"
echo ""
