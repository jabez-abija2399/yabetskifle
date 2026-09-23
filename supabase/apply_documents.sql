-- supabase/apply_documents.sql
-- Run in the Supabase SQL editor (Dashboard → SQL → New query → paste → Run).
-- Stores Apply Studio documents that get public share links (/share/[slug]).
-- RLS: public can SELECT (share pages), only signed-in admins can
-- INSERT / DELETE (via authenticated Supabase client in the share API).

create table if not exists public.apply_documents (
  id             uuid primary key default gen_random_uuid(),
  slug           text not null unique,
  doc_type       text not null check (doc_type in ('cover_letter', 'proposal', 'cold_dm', 'ats_resume')),
  style          text,
  company_name   text,
  role_name      text,
  content        text not null,
  job_description text,
  created_at     timestamptz not null default now()
);

create index if not exists apply_documents_created_at_idx
  on public.apply_documents (created_at desc);

alter table public.apply_documents enable row level security;

-- Anyone (anon included) can read a document via its share slug.
drop policy if exists "Public can view shared apply docs" on public.apply_documents;
create policy "Public can view shared apply docs"
  on public.apply_documents
  for select
  using (true);

-- Only signed-in admins can create share links.
drop policy if exists "Authenticated can insert apply docs" on public.apply_documents;
create policy "Authenticated can insert apply docs"
  on public.apply_documents
  for insert
  to authenticated
  with check (true);

-- Only signed-in admins can delete share links.
drop policy if exists "Authenticated can delete apply docs" on public.apply_documents;
create policy "Authenticated can delete apply docs"
  on public.apply_documents
  for delete
  to authenticated
  using (true);
