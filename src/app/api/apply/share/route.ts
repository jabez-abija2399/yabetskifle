// ─────────────────────────────────────────────────────────
// src/app/api/apply/share/route.ts
// GET    — list recent shared docs (auth only)
// POST   — create public share link (auth only)
// DELETE — remove a share row      (auth only)
// Public reads happen on /share/[slug] via anon RLS select.
// ─────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import { createAuthSupabase } from "@/lib/adminAuth";
import type { DocType } from "@/app/admin/apply/types";

const VALID_TYPES: DocType[] = [
  "cover_letter",
  "proposal",
  "cold_dm",
  "ats_resume",
];

function randomSlug(): string {
  const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789";
  const bytes = new Uint8Array(10);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
}

export async function GET(req: NextRequest) {
  const supabase = createAuthSupabase(req);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("apply_documents")
    .select(
      "id, slug, doc_type, style, company_name, role_name, content, created_at"
    )
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    return NextResponse.json(
      { error: error.message, rows: [] },
      { status: 500 }
    );
  }
  return NextResponse.json({ rows: data ?? [] });
}

export async function POST(req: NextRequest) {
  const supabase = createAuthSupabase(req);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body || typeof body.content !== "string" || !body.content.trim()) {
    return NextResponse.json({ error: "content is required" }, { status: 400 });
  }
  if (body.content.length > 50_000) {
    return NextResponse.json({ error: "content too large" }, { status: 400 });
  }
  const docType: DocType = VALID_TYPES.includes(body.docType)
    ? body.docType
    : "cover_letter";

  let slug = "";
  let row: Record<string, unknown> | null = null;
  let lastErr: string | null = null;

  for (let attempt = 0; attempt < 3; attempt++) {
    slug = randomSlug();
    const { data, error } = await supabase
      .from("apply_documents")
      .insert({
        slug,
        doc_type: docType,
        style: typeof body.style === "string" ? body.style : null,
        company_name:
          typeof body.companyName === "string" ? body.companyName : null,
        role_name: typeof body.roleName === "string" ? body.roleName : null,
        content: body.content,
        job_description:
          typeof body.jobDescription === "string" ? body.jobDescription : null,
      })
      .select("id, slug, created_at")
      .single();

    if (!error) {
      row = data;
      lastErr = null;
      break;
    }
    lastErr = error.message;
  }

  if (!row) {
    return NextResponse.json(
      {
        error:
          lastErr?.includes("relation") || lastErr?.includes("schema")
            ? "Database table missing — run supabase/apply_documents.sql in the Supabase SQL editor first."
            : lastErr ?? "Failed to create share link",
      },
      { status: 500 }
    );
  }

  const url = `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/share/${row.slug}`;
  return NextResponse.json({ slug: row.slug, url, id: row.id });
}

export async function DELETE(req: NextRequest) {
  const supabase = createAuthSupabase(req);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "id required" }, { status: 400 });
  }

  const { error } = await supabase
    .from("apply_documents")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
