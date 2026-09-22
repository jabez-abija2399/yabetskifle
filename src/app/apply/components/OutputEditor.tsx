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
        <p className="text-xs font-mono text-muted-foreground">
          Your document
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowHighlights((v) => !v)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xs font-mono text-xs border transition-colors ${
              aiCount > 0 && showHighlights
                ? "border-amber-400/60 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                : "border-border text-muted-foreground hover:border-foreground"
            }`}
          >
            {showHighlights ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
            {aiCount > 0 ? `${aiCount} AI phrase${aiCount > 1 ? "s" : ""}` : "Clean"}
          </button>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xs font-mono text-xs border border-border text-muted-foreground hover:border-foreground transition-colors"
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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xs font-mono text-xs border border-border text-muted-foreground hover:border-foreground transition-colors"
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
            className="flex items-start gap-2 px-3 py-2.5 rounded-xs bg-amber-500/10 border border-amber-500/40"
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
          className="text-sm leading-relaxed px-4 py-3 rounded-xs border border-border bg-secondary text-foreground/90 whitespace-pre-wrap pointer-events-none select-none apply-highlight-preview"
          dangerouslySetInnerHTML={{ __html: highlightAIPhrases(output) }}
        />
      )}

      <div className="space-y-1">
        <p className="text-xs text-muted-foreground">
          Edit directly below — this is your copy.
        </p>
        <textarea
          value={output}
          onChange={(e) => onChange(e.target.value)}
          rows={16}
          className="w-full px-4 py-3 text-sm rounded-xs border border-border bg-background text-foreground focus:outline-none focus:border-[#2D5F6B] resize-none leading-relaxed font-mono transition-colors"
        />
      </div>
    </motion.div>
  );
}
