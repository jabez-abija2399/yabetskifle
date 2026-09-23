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
      <p className="text-xs font-mono text-muted-foreground">
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
              className={`relative text-left p-4 rounded-xs border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2D5F6B] group ${
                active
                  ? "border-[#2D5F6B] bg-secondary"
                  : "border-border bg-background hover:border-[#2D5F6B]/50"
              }`}
            >
              <div
                className="absolute top-0 left-4 right-4 h-[2px] transition-opacity duration-200"
                style={{ background: tpl.color, opacity: active ? 1 : 0 }}
              />
              <div className="flex items-start justify-between mb-2">
                <div>
                  <span
                    className="text-xs font-mono font-medium"
                    style={{ color: tpl.color }}
                  >
                    {tpl.label}
                  </span>
                  <p className="text-sm font-semibold text-foreground mt-0.5">
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
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                {tpl.description}
              </p>
              <div
                className="text-xs text-foreground/80 font-mono pl-3 py-1 border-l-2 leading-relaxed transition-colors duration-200"
                style={{ borderColor: active ? tpl.color : "var(--border)" }}
              >
                {tpl.preview}
              </div>
              <p className="mt-3 text-xs font-mono text-muted-foreground">
                Best for: {tpl.bestFor}
              </p>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
