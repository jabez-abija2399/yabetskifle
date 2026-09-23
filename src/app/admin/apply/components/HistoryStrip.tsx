"use client";
// ─────────────────────────────────────────────────────────
// src/app/admin/apply/components/HistoryStrip.tsx
// Recent shared documents — click to reload into the editor.
// ─────────────────────────────────────────────────────────

import { ExternalLink, FileText, Trash2 } from "lucide-react";
import type { ShareRecord } from "../types";

const TYPE_LABELS: Record<string, string> = {
  cover_letter: "Letter",
  proposal: "Proposal",
  cold_dm: "Outreach",
  ats_resume: "Resume",
};

interface Props {
  rows: ShareRecord[];
  loading: boolean;
  onSelect: (row: ShareRecord) => void;
  onDelete: (id: string) => void;
}

export function HistoryStrip({ rows, loading, onSelect, onDelete }: Props) {
  if (loading) {
    return (
      <p className="text-xs font-mono text-muted-foreground">
        Loading history…
      </p>
    );
  }
  if (rows.length === 0) {
    return (
      <p className="text-xs font-mono text-muted-foreground">
        No shared documents yet — generate one, then hit Share.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-xs font-mono text-muted-foreground">
        Recent shared documents
      </p>
      <ul className="space-y-1.5">
        {rows.map((row) => (
          <li
            key={row.id}
            className="flex items-center gap-3 px-3 py-2 rounded-xs border border-border bg-card text-xs hover:border-foreground/40 transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            <button
              onClick={() => onSelect(row)}
              className="flex-1 text-left truncate text-foreground"
              title="Reload into editor"
            >
              <span className="font-mono text-muted-foreground">
                {TYPE_LABELS[row.doc_type] ?? row.doc_type}
              </span>
              {(row.role_name || row.company_name) && (
                <span className="ml-2">
                  {[row.role_name, row.company_name].filter(Boolean).join(" @ ")}
                </span>
              )}
            </button>
            <a
              href={`/share/${row.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              title="Open share link"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              onClick={() => onDelete(row.id)}
              className="text-muted-foreground hover:text-destructive transition-colors"
              title="Delete share link"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
