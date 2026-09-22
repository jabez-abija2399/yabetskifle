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
