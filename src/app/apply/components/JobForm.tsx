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
