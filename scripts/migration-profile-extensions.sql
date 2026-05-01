-- ─────────────────────────────────────────────────────────────────────
-- MIGRATION: extend profiles with admin-editable content fields
-- ─────────────────────────────────────────────────────────────────────
-- Run this once in Supabase SQL Editor. After this, every piece of
-- content the public site shows will be editable from /admin/profile.

-- 1) Add new columns (idempotent — safe to re-run)
alter table profiles add column if not exists about_story text;
alter table profiles add column if not exists currently_learning text;
alter table profiles add column if not exists philosophy_quote text;
alter table profiles add column if not exists philosophy_author text;
alter table profiles add column if not exists location text;
alter table profiles add column if not exists timezone text;
alter table profiles add column if not exists availability_tags text[];

-- 2) Seed default values for the existing profile row
update profiles
set
  about_story = coalesce(about_story,
    'I started writing code because I wanted to build the kinds of products I admired — fast, clear, and quietly delightful to use. That curiosity grew into two years of shipping real software with small teams, mostly on the frontend, often end-to-end.

Today I''m most at home in React, Next.js, and TypeScript. I love the moment a Figma frame becomes a real, interactive thing on screen — and I care a lot about making interfaces feel calm rather than busy. My backend practice is still growing: I''m comfortable with Supabase and full-stack Next.js, and I treat "I don''t know that yet" as an invitation, not a problem.

If a project needs me to pick up a new tool, framework, or domain — I''ll go find it. Flexible, curious, and ready to ship.'
  ),
  currently_learning = coalesce(currently_learning, 'Going deeper on backend & cloud — always picking up the next tool.'),
  philosophy_quote = coalesce(philosophy_quote, 'Details aren''t details. They make the design.'),
  philosophy_author = coalesce(philosophy_author, 'Charles Eames'),
  location = coalesce(location, 'Addis Ababa, Ethiopia'),
  timezone = coalesce(timezone, 'GMT+3 — Working globally'),
  availability_tags = coalesce(availability_tags, array['Full-time', 'Contract', 'Freelance', 'Remote', 'Hybrid', 'On-site'])
where id is not null;
