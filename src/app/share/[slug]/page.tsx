// ─────────────────────────────────────────────────────────
// src/app/share/[slug]/page.tsx — public view-only share page
// ─────────────────────────────────────────────────────────

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { ShareActions } from "./ShareActions";

export const dynamic = "force-dynamic";

interface DocRow {
  slug: string;
  doc_type: string;
  company_name: string | null;
  role_name: string | null;
  content: string;
  created_at: string;
}

const TYPE_LABELS: Record<string, string> = {
  cover_letter: "Cover Letter",
  proposal: "Freelance Proposal",
  cold_dm: "Cold Outreach",
  ats_resume: "ATS Resume",
};

async function getDoc(slug: string): Promise<DocRow | null> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
  const { data } = await supabase
    .from("apply_documents")
    .select("slug, doc_type, company_name, role_name, content, created_at")
    .eq("slug", slug)
    .maybeSingle();
  return (data as DocRow | null) ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const doc = await getDoc(slug);
  if (!doc) return { title: "Not found" };
  const label = TYPE_LABELS[doc.doc_type] ?? "Document";
  const title = [label, doc.role_name, doc.company_name]
    .filter(Boolean)
    .join(" — ");
  return {
    title: `${title} · Yabets Kifle`,
    robots: { index: false, follow: false },
  };
}

export default async function SharePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const doc = await getDoc(slug);
  if (!doc) notFound();

  const label = TYPE_LABELS[doc.doc_type] ?? "Document";
  const heading = [label, doc.role_name, doc.company_name]
    .filter(Boolean)
    .join(" — ");

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-8">
        <header className="space-y-2">
          <p className="font-mono text-xs text-muted-foreground">
            Shared document · view only
          </p>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
            {heading}
          </h1>
          <p className="text-sm text-muted-foreground">
            Prepared by Yabets Kifle ·{" "}
            {new Date(doc.created_at).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </header>

        <ShareActions
          text={doc.content}
          docType={doc.doc_type}
          roleName={doc.role_name ?? undefined}
          companyName={doc.company_name ?? undefined}
        />

        <article className="rounded-xs border border-border bg-card p-6 sm:p-10 text-sm leading-relaxed text-foreground whitespace-pre-wrap font-mono">
          {doc.content}
        </article>

        <footer className="pt-4 border-t border-border">
          <Link
            href="/"
            className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to portfolio
          </Link>
        </footer>
      </div>
    </main>
  );
}
