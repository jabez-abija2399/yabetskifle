"use client";
// ─────────────────────────────────────────────────────────
// src/app/admin/apply/components/AtsPanel.tsx
// Quick ATS health checks for generated resumes.
// ─────────────────────────────────────────────────────────

import { useMemo } from "react";
import { Check, X } from "lucide-react";

const REQUIRED_HEADINGS = ["SUMMARY", "SKILLS", "EXPERIENCE", "EDUCATION"];

interface Props {
  output: string;
  jobDescription: string;
}

function extractKeywords(jd: string): string[] {
  const stop = new Set(
    "the a an and or of to in for with on at by from is are be as that this you your we our will has have had must should required preferred years year experience working work role team ability strong excellent good plus etc who what when where how not no".split(
      " "
    )
  );
  const words = jd
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stop.has(w) && !/^\d+$/.test(w));
  return Array.from(new Set(words)).slice(0, 40);
}

export function AtsPanel({ output, jobDescription }: Props) {
  const checks = useMemo(() => {
    const upper = output.toUpperCase();
    const headings = REQUIRED_HEADINGS.filter((h) => upper.includes(h));
    const words = output.trim().split(/\s+/).filter(Boolean).length;
    const keywords = extractKeywords(jobDescription);
    const lower = output.toLowerCase();
    const matched = keywords.filter((k) => lower.includes(k.toLowerCase()));
    const coverage =
      keywords.length > 0
        ? Math.round((matched.length / keywords.length) * 100)
        : null;

    return {
      headings,
      words,
      matched,
      keywords,
      coverage,
      hasBullets: /[•\-–*]\s/.test(output),
      lengthOk: words >= 350 && words <= 800,
    };
  }, [output, jobDescription]);

  const items = [
    {
      ok: checks.headings.length === REQUIRED_HEADINGS.length,
      label: "Standard ATS headings",
      detail: `${checks.headings.length}/${REQUIRED_HEADINGS.length} found`,
    },
    {
      ok: checks.hasBullets,
      label: "Achievement bullets",
      detail: checks.hasBullets ? "Bullets present" : "No bullets detected",
    },
    {
      ok: checks.lengthOk,
      label: "Word count 350–800",
      detail: `${checks.words} words`,
    },
    {
      ok: (checks.coverage ?? 0) >= 30,
      label: "JD keyword coverage",
      detail:
        checks.coverage !== null
          ? `${checks.coverage}% (${checks.matched.length}/${checks.keywords.length})`
          : "No JD provided",
    },
  ];

  return (
    <div className="rounded-xs border border-border bg-secondary p-4 space-y-3">
      <p className="text-xs font-mono text-muted-foreground">ATS health check</p>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.label} className="flex items-start gap-2 text-xs">
            {item.ok ? (
              <Check className="w-3.5 h-3.5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
            ) : (
              <X className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            )}
            <span className="text-foreground">{item.label}</span>
            <span className="text-muted-foreground ml-auto font-mono">
              {item.detail}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
