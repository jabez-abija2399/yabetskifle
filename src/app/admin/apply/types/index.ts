// ─────────────────────────────────────────────────────────
// src/app/admin/apply/types/index.ts
// ─────────────────────────────────────────────────────────

export type DocType = "cover_letter" | "proposal" | "cold_dm" | "ats_resume";
export type StyleKey = "punchy" | "story" | "technical" | "warm";
export type GenerationStatus = "idle" | "loading" | "success" | "error";

export interface StyleTemplate {
  id: StyleKey;
  label: string;
  tagline: string;
  description: string;
  preview: string;
  bestFor: string;
  color: string;
}

export interface DocTypeOption {
  id: DocType;
  label: string;
  description: string;
  placeholder: string;
  showCompany: boolean;
  showRole: boolean;
}

export interface GeneratePayload {
  docType: DocType;
  style: StyleKey;
  jobDescription: string;
  companyName?: string;
  roleName?: string;
}

export interface GenerateResponse {
  output?: string;
  error?: string;
}

export interface ShareRecord {
  id: string;
  slug: string;
  doc_type: DocType;
  style?: string | null;
  company_name?: string | null;
  role_name?: string | null;
  content: string;
  created_at: string;
}
