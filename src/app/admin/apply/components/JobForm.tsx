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
              <label className="text-xs font-mono text-muted-foreground">
                Company
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => onCompanyNameChange(e.target.value)}
                placeholder="e.g. Stripe, HOPn, Notion"
                className="w-full px-3 py-2.5 text-sm rounded-xs border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#2D5F6B] transition-colors"
              />
            </div>
          )}
          {docConfig.showRole && (
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-muted-foreground">
                Role
              </label>
              <input
                type="text"
                value={roleName}
                onChange={(e) => onRoleNameChange(e.target.value)}
                placeholder="e.g. Frontend Engineer, Full-Stack Dev"
                className="w-full px-3 py-2.5 text-sm rounded-xs border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#2D5F6B] transition-colors"
              />
            </div>
          )}
        </div>
      )}

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-mono text-muted-foreground">
            {docType === "proposal" ? "Project Brief" : "Job Description"}
          </label>
          <span
            className={`text-xs font-mono tabular-nums transition-colors ${
              charCount < 50 ? "text-muted-foreground/50" : "text-muted-foreground"
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
          className="w-full px-4 py-3 text-sm rounded-xs border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#2D5F6B] resize-none leading-relaxed transition-colors"
        />
        <p className="text-xs text-muted-foreground">
          More detail → more tailored output. Paste the full JD.
        </p>
      </div>

      <button
        onClick={onSubmit}
        disabled={!isValid || isLoading}
        className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xs font-mono text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2D5F6B] disabled:opacity-40 disabled:cursor-not-allowed bg-[#2D5F6B] text-white dark:bg-[#3E7987] dark:text-background hover:bg-[#234b54] cursor-pointer"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Reading your portfolio &amp; generating...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            [ Generate document ]
          </>
        )}
      </button>
    </div>
  );
}
