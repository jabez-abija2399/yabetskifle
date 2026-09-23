// ─────────────────────────────────────────────────────────
// src/app/admin/apply/lib/exportText.ts
// Document segmentation for ATS-faithful PDF/DOCX rendering
// ─────────────────────────────────────────────────────────

import type { DocType } from "../types";

export type SegmentType = "name" | "contact" | "heading" | "bullet" | "paragraph";

export interface DocSegment {
  type: SegmentType;
  text: string;
}

const HEADING_RE = /^[A-Z0-9][A-Z0-9 &/–-]{1,39}$/;
const BULLET_RE = /^\s*[•\-–*]\s+/;

function isHeading(line: string): boolean {
  const t = line.trim();
  return HEADING_RE.test(t) && !/[.,;:]$/.test(t);
}

function isContactLine(line: string): boolean {
  const t = line.trim();
  return t.includes("@") || (t.includes("|") && t.length < 200);
}

/**
 * Splits a plain-text document into renderable segments.
 * Line 1 → name, line 2 → contact (heuristic), ALL-CAPS lines → headings,
 * leading-bullet lines → bullets, blank-line groups → paragraphs.
 */
export function segmentDocument(text: string): DocSegment[] {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const segments: DocSegment[] = [];
  let buf: string[] = [];
  let seenNonEmpty = false;
  let afterName = false;

  const flush = () => {
    if (buf.length) {
      segments.push({ type: "paragraph", text: buf.join(" ").trim() });
      buf = [];
    }
  };

  for (const raw of lines) {
    const line = raw.trim();

    if (!line) {
      flush();
      continue;
    }

    if (!seenNonEmpty) {
      seenNonEmpty = true;
      afterName = true;
      segments.push({ type: "name", text: line });
      continue;
    }

    if (afterName && isContactLine(line)) {
      afterName = false;
      segments.push({ type: "contact", text: line });
      continue;
    }
    afterName = false;

    if (isHeading(line)) {
      flush();
      segments.push({ type: "heading", text: line });
      continue;
    }

    if (BULLET_RE.test(line)) {
      flush();
      segments.push({ type: "bullet", text: line.replace(BULLET_RE, "") });
      continue;
    }

    buf.push(line);
  }

  flush();
  return segments;
}

function slugPart(s: string): string {
  return s
    .trim()
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

export function docFilename(
  docType: DocType,
  ext: string,
  roleName?: string,
  companyName?: string
): string {
  const labels: Record<DocType, string> = {
    cover_letter: "Cover-Letter",
    proposal: "Proposal",
    cold_dm: "Cold-Outreach",
    ats_resume: "ATS-Resume",
  };
  const parts = ["Yabets-Kifle", labels[docType] ?? "Document"];
  if (roleName) parts.push(slugPart(roleName));
  if (companyName) parts.push(slugPart(companyName));
  return `${parts.filter(Boolean).join("_")}.${ext}`;
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
