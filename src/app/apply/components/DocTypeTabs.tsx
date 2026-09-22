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
