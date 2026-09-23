"use client";
// ─────────────────────────────────────────────────────────
// src/app/share/[slug]/ShareActions.tsx
// ─────────────────────────────────────────────────────────

import { useState } from "react";
import { Download, FileText, Link2, Check } from "lucide-react";
import type { DocType } from "@/app/admin/apply/types";

interface Props {
  text: string;
  docType: string;
  roleName?: string;
  companyName?: string;
}

export function ShareActions({ text, docType, roleName, companyName }: Props) {
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState<"pdf" | "doc" | null>(null);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePdf = async () => {
    setBusy("pdf");
    try {
      const { exportPdf } = await import(
        "@/app/admin/apply/lib/exportPdf"
      );
      await exportPdf(text, docType as DocType, roleName, companyName);
    } finally {
      setBusy(null);
    }
  };

  const handleDoc = async () => {
    setBusy("doc");
    try {
      const { exportDoc } = await import(
        "@/app/admin/apply/lib/exportDoc"
      );
      await exportDoc(text, docType as DocType, roleName, companyName);
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        onClick={handlePdf}
        disabled={busy !== null}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xs font-mono text-xs border border-border text-foreground hover:border-foreground transition-colors disabled:opacity-50"
      >
        <Download className="w-3.5 h-3.5" />
        {busy === "pdf" ? "Preparing…" : "Download PDF"}
      </button>
      <button
        onClick={handleDoc}
        disabled={busy !== null}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xs font-mono text-xs border border-border text-foreground hover:border-foreground transition-colors disabled:opacity-50"
      >
        <FileText className="w-3.5 h-3.5" />
        {busy === "doc" ? "Preparing…" : "Download DOC"}
      </button>
      <button
        onClick={handleCopy}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xs font-mono text-xs border border-border text-muted-foreground hover:border-foreground transition-colors"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-accent" /> Copied
          </>
        ) : (
          <>
            <Link2 className="w-3.5 h-3.5" /> Copy link
          </>
        )}
      </button>
    </div>
  );
}
