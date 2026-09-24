-- ══════════════════════════════════════════════════════════════
-- Analytics: pageviews + events (run in Supabase SQL editor)
-- Privacy: visitor_hash is daily-salted server-side; raw IP is never stored.
-- ══════════════════════════════════════════════════════════════

create table if not exists public.pageviews (
  id            uuid primary key default gen_random_uuid(),
  ts            timestamptz not null default now(),
  path          text not null,
  referrer_host text,
  country       text,
  city          text,
  device        text,
  visitor_hash  text not null,
  session_id    text,
  is_new        boolean not null default false
);

create table if not exists public.events (
  id           uuid primary key default gen_random_uuid(),
  ts           timestamptz not null default now(),
  name         text not null,
  path         text,
  props        jsonb not null default '{}'::jsonb,
  visitor_hash text not null,
  session_id   text
);

create index if not exists pageviews_ts_idx     on public.pageviews (ts desc);
create index if not exists pageviews_path_idx   on public.pageviews (path);
create index if not exists pageviewsVisitor_idx on public.pageviews (visitor_hash);
create index if not exists pageviews_live_idx   on public.pageviews (ts desc, session_id);
create index if not exists events_ts_idx        on public.events (ts desc);
create index if not exists events_name_idx      on public.events (name);

alter table public.pageviews enable row level security;
alter table public.events    enable row level security;

-- Public (anon) may insert tracking rows only — via /api/track
drop policy if exists "track_insert_pageviews" on public.pageviews;
create policy "track_insert_pageviews"
  on public.pageviews for insert
  to anon, authenticated
  with check (true);

drop policy if exists "track_insert_events" on public.events;
create policy "track_insert_events"
  on public.events for insert
  to anon, authenticated
  with check (true);

-- Reads: signed-in admin only (API uses cookie-bound client)
drop policy if exists "admin_read_pageviews" on public.pageviews;
create policy "admin_read_pageviews"
  on public.pageviews for select
  to authenticated
  using (true);

drop policy if exists "admin_read_events" on public.events;
create policy "admin_read_events"
  on public.events for select
  to authenticated
  using (true);

-- Optional: Realtime for the live feed (enable in DB → Database → Replication)
-- alter publication supabase_realtime add table public.pageviews;
