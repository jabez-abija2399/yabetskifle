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
    <div className="flex gap-1 p-1 rounded-xs bg-secondary border border-border">
      {DOC_TYPES.map((opt) => {
        const active = value === opt.id;
        return (
          <button
            key={opt.id}
            onClick={() => onChange(opt.id)}
            className="relative flex-1 px-4 py-2.5 rounded-xs text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {active && (
              <motion.div
                layoutId="doc-tab-indicator"
                className="absolute inset-0 rounded-xs bg-card border border-border"
                transition={{ type: "spring", stiffness: 500, damping: 40 }}
              />
            )}
            <span
              className={`relative z-10 flex flex-col gap-0.5 text-left ${
                active ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              <span className="font-mono font-medium text-xs">
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
