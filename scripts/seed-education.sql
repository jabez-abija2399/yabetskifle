-- Run this in the Supabase SQL Editor to seed education + certifications.
-- These tables have stricter RLS policies than testimonials/faqs/posts,
-- so this SQL is the simplest path to populate them as a one-time seed.
-- After this runs you can edit any row via the /admin pages.

-- ─── EDUCATION ────────────────────────────────────────────────
insert into education (institution, degree, field_of_study, duration, grade)
values
  (
    'ALX Africa',
    'Full-Stack Software Engineering Programme',
    'A 12-month intensive cohort training in modern web architecture, system design, and end-to-end product engineering. Built and shipped real projects from spec to deploy in a globally distributed team.',
    '12-month intensive · 2024 cohort',
    'Completed'
  ),
  (
    'Udacity',
    'Nanodegree Programs',
    'Three Nanodegree tracks: Programming Fundamentals — building strong foundations in problem solving and algorithms. AI Fundamentals — applied machine learning, data, and modern AI workflows. Android Development Fundamentals — native mobile app architecture, lifecycle, and UI patterns.',
    'Self-paced · Online',
    'Completed'
  ),
  (
    'DataOcean',
    'Precision Medicine Programme',
    'Applied data engineering and analytics for precision health — working with real-world datasets, modern tooling, and the human side of healthcare technology.',
    'Programme cohort',
    'Completed'
  ),
  (
    'Edit me in admin',
    'Bachelor of Science',
    'Software Engineering — placeholder, edit via /admin/education with your real university, dates, and grade.',
    'Edit dates in admin',
    'Edit in admin'
  );

-- ─── CERTIFICATIONS (optional) ─────────────────────────────────
-- Uncomment and edit if you have certifications to display.
-- insert into certifications (title, issuer, issued_at, credential_url)
-- values
--   ('Meta Front-End Developer Professional Certificate', 'Meta · Coursera', '2025-03-01', 'https://coursera.org/verify/your-id'),
--   ('Advanced React', 'Meta', '2024-12-01', 'https://coursera.org/verify/your-id');
