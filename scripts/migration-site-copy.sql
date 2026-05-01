-- ─────────────────────────────────────────────────────────────────────
-- MIGRATION: site_copy table — every label, title, and button editable
-- ─────────────────────────────────────────────────────────────────────
-- Run this once in Supabase SQL Editor. After this every piece of
-- structural copy across the site is editable from /admin/copy.
--
-- Title syntax: wrap a phrase in *asterisks* to render it italic
-- e.g. "Tools of the *trade*" renders as: Tools of the *trade*

create table if not exists site_copy (
  key         text primary key,
  value       text,
  description text,
  group_name  text,
  sort_order  integer default 0,
  updated_at  timestamptz default now()
);

-- Allow public read; writes through Supabase auth-protected admin only
alter table site_copy enable row level security;

drop policy if exists "site_copy public read" on site_copy;
create policy "site_copy public read" on site_copy for select using (true);

drop policy if exists "site_copy auth write" on site_copy;
create policy "site_copy auth write" on site_copy for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Seed all keys (idempotent — `on conflict` keeps existing edits)
insert into site_copy (key, value, description, group_name, sort_order) values

-- ─── HERO ───────────────────────────────────────────
('hero.status_text',         'Open to work — Full-time · Contract · Freelance',  'Status pill in top-left of the hero',                'Hero', 10),
('hero.label_right',         'Portfolio · 2026',                                  'Small label on the top-right of the hero',           'Hero', 20),
('hero.role_eyebrow',        'Currently',                                         'Tiny label above your role title',                   'Hero', 30),
('hero.cta_primary',         'View Work',                                         'Main button — links to projects',                    'Hero', 40),
('hero.cta_secondary',       'Get in Touch',                                      'Outline button — links to contact',                  'Hero', 50),
('hero.cta_resume',          'Resume',                                            'Tertiary action — opens resume PDF',                 'Hero', 60),

-- ─── ABOUT ──────────────────────────────────────────
('about.eyebrow',            '— 01 / About',                                      'Section number and label',                           'About', 10),
('about.title',              'A bit more *about me*',                             'Section title — wrap italic part in *asterisks*',    'About', 20),
('about.subtitle',           'How I got here, what I care about, and how I like to work.',  'Right-side subtitle',                  'About', 30),
('about.story_eyebrow',      '— The longer story',                                'Mini-eyebrow inside the big story tile',             'About', 40),
('about.story_footer',       'Open to learn · Open to teach · Open to ship',      'Tagline at bottom of story card',                    'About', 50),
('about.experience_label',   'Experience',                                        'Years tile label',                                   'About', 60),
('about.experience_unit',    'years shipping production code',                    'Years tile suffix',                                  'About', 70),
('about.learning_label',     'Currently learning',                                'Currently learning tile label',                      'About', 80),
('about.philosophy_label',   'Philosophy',                                        'Philosophy quote tile label',                        'About', 90),
('about.location_label',     'Based in',                                          'Location tile label',                                'About', 100),
('about.languages_label',    'Speaks',                                            'Languages tile label',                               'About', 110),

-- ─── SKILLS / TECH STACK ────────────────────────────
('skills.eyebrow',           '— 02 / Tools & Stack',                              'Section number and label',                           'Skills', 10),
('skills.title',             'Tools of the *trade*',                              'Section title (italic in asterisks)',                'Skills', 20),
('skills.subtitle',          'The technologies I reach for to build modern, reliable, beautiful web products.',  'Right subtitle', 'Skills', 30),
('skills.tools_count',       'tools',                                             'Suffix on each category card "{n} tools"',           'Skills', 40),

-- ─── SERVICES ───────────────────────────────────────
('services.eyebrow',         '— 03 / Services',                                   'Section number and label',                           'Services', 10),
('services.title',           'How I can *help*',                                  'Section title (italic in asterisks)',                'Services', 20),
('services.subtitle',        'Selected service offerings for teams looking to ship beautiful, performant web products.',  'Right subtitle', 'Services', 30),

-- ─── PROJECTS (home + archive) ──────────────────────
('projects.eyebrow',         '— 04 / Selected Work',                              'Section number and label',                           'Projects', 10),
('projects.title',           'Recent *case studies*',                             'Section title (italic in asterisks)',                'Projects', 20),
('projects.archive_link',    'View archive',                                      'Link in section header',                             'Projects', 30),
('projects.see_all_format',  'See all {count} projects',                          'Bottom button — {count} replaced with number',       'Projects', 40),
('projects.empty',           'No projects yet — add some via the admin dashboard.',  'Empty state',                                     'Projects', 50),
('projects.archive_eyebrow', 'Archive',                                           '/projects page — top eyebrow',                       'Projects', 60),
('projects.archive_title',   'Selected *work*',                                   '/projects page — main title',                        'Projects', 70),
('projects.archive_subtitle','A complete index of recent projects — case studies, prototypes, and shipped products across web and product engineering.',  '/projects page — subtitle',  'Projects', 80),

-- ─── BLOG / JOURNAL ─────────────────────────────────
('blog.home.eyebrow',        '— 05 / Journal',                                    'Section number on home page',                        'Blog', 10),
('blog.home.title',          'Latest *writing*',                                  'Section title on home page',                         'Blog', 20),
('blog.home.archive_link',   'All articles',                                      'Link to /blog from home',                            'Blog', 30),
('blog.archive.eyebrow',     'Journal',                                           '/blog page — eyebrow',                               'Blog', 40),
('blog.archive.title',       'Notes & *writing*',                                 '/blog page — main title',                            'Blog', 50),
('blog.archive.subtitle',    'Thoughts on building products, design systems, and the craft of frontend engineering.',  '/blog subtitle', 'Blog', 60),
('blog.archive.empty',       'New articles coming soon.',                         '/blog empty state',                                  'Blog', 70),

-- ─── EXPERIENCE ─────────────────────────────────────
('experience.eyebrow',       '— 06 / Experience',                                 'Section number and label',                           'Experience', 10),
('experience.title',         'Where I''ve *worked*',                              'Section title (italic in asterisks)',                'Experience', 20),
('experience.subtitle',      'Roles, projects, and teams I''ve contributed to over the years.',  'Right subtitle',                'Experience', 30),
('experience.current',       'Current',                                           'Pill shown next to "current" experience entries',    'Experience', 40),

-- ─── EDUCATION ──────────────────────────────────────
('education.eyebrow',        '— 07 / Education',                                  'Section number and label',                           'Education', 10),
('education.title',          'Where I''ve *learned*',                             'Section title (italic in asterisks)',                'Education', 20),
('education.subtitle',       'A self-driven learner. Programs, nanodegrees, and intensive courses I''ve completed.',  'Right subtitle', 'Education', 30),
('education.cert_label',     '— Credentials & Certifications',                    'Mini-eyebrow above the certs row',                   'Education', 40),
('education.verify_link',    'Verify',                                            'Link text on certification cards',                   'Education', 50),

-- ─── TESTIMONIALS ───────────────────────────────────
('testimonials.eyebrow',     '— 08 / Testimonials',                               'Section number and label',                           'Testimonials', 10),
('testimonials.title',       'Kind *words*',                                      'Section title (italic in asterisks)',                'Testimonials', 20),
('testimonials.subtitle',    'What clients and collaborators have said after working with me.',  'Right subtitle',                  'Testimonials', 30),

-- ─── FAQ ────────────────────────────────────────────
('faq.eyebrow',              '— 09 / FAQ',                                        'Section number and label',                           'FAQ', 10),
('faq.title',                'Common *questions*',                                'Section title (italic in asterisks)',                'FAQ', 20),

-- ─── CONTACT ────────────────────────────────────────
('contact.eyebrow',          '— 10 / Contact',                                    'Section number and label',                           'Contact', 10),
('contact.title',            'Let''s build *something*',                          'Section title (italic in asterisks)',                'Contact', 20),
('contact.subtitle',         'Have a project in mind, or just want to say hello? I read every message.',  'Right subtitle',         'Contact', 30),
('contact.email_label',      'Email me directly',                                 'Eyebrow on the email tile',                          'Contact', 40),
('contact.email_cta',        'Send a note',                                       'Link text under email',                              'Contact', 50),
('contact.socials_label',    'Find me on',                                        'Eyebrow on the socials tile',                        'Contact', 60),
('contact.based_label',      'Based',                                             'Mini label in socials tile',                         'Contact', 70),
('contact.working_label',    'Working',                                           'Mini label in socials tile',                         'Contact', 80),
('contact.based_value',      'Addis Ababa',                                       'Value shown for "Based"',                            'Contact', 90),
('contact.working_value',    'Globally · Remote',                                 'Value shown for "Working"',                          'Contact', 100),
('contact.form.name_label',  'Your name',                                         'Form field label',                                   'Contact', 110),
('contact.form.email_label', 'Email',                                             'Form field label',                                   'Contact', 120),
('contact.form.subject_label','Subject',                                          'Form field label',                                   'Contact', 130),
('contact.form.message_label','Message',                                          'Form field label',                                   'Contact', 140),
('contact.form.name_ph',     'Jane Doe',                                          'Name placeholder',                                   'Contact', 150),
('contact.form.email_ph',    'jane@studio.com',                                   'Email placeholder',                                  'Contact', 160),
('contact.form.subject_ph',  'A new product, a hire, an idea…',                   'Subject placeholder',                                'Contact', 170),
('contact.form.message_ph',  'Tell me about the project, timeline, and what success looks like.',  'Message placeholder',          'Contact', 180),
('contact.form.submit',      'Send message',                                      'Submit button',                                      'Contact', 190),
('contact.form.submitting',  'Sending…',                                          'Submit button while sending',                        'Contact', 200),
('contact.form.success',     'Thanks — your message landed safely.',              'Success toast',                                      'Contact', 210),

-- ─── FOOTER ─────────────────────────────────────────
('footer.cta_eyebrow',       'Have a project in mind?',                           'Eyebrow above the big CTA',                          'Footer', 10),
('footer.cta_title',         'Let''s make\nsomething *good.*',                    'Big footer headline (use \\n for line break, *italic*)',  'Footer', 20),
('footer.cta_button',        'Start a project',                                   'Footer CTA button',                                  'Footer', 30),
('footer.sitemap_label',     'Sitemap',                                           'Sitemap column header',                              'Footer', 40),
('footer.elsewhere_label',   'Elsewhere',                                         'Socials column header',                              'Footer', 50),

-- ─── NAVBAR ─────────────────────────────────────────
('nav.work',                 'Work',                                              'Top nav link to /projects',                          'Navbar', 10),
('nav.journal',              'Journal',                                           'Top nav link to /blog',                              'Navbar', 20),
('nav.about',                'About',                                             'Top nav link to /#about',                            'Navbar', 30),
('nav.contact',              'Contact',                                           'Top nav link to /#contact',                          'Navbar', 40),
('nav.cta',                  'Hire me',                                           'Right-side nav CTA',                                 'Navbar', 50),

-- ─── PROJECT DETAIL ─────────────────────────────────
('project.back_link',        'All projects',                                      'Top-left back link',                                 'Project Detail', 10),
('project.kicker',           'Case study',                                        'Top-right kicker label',                             'Project Detail', 20),
('project.brief_eyebrow',    '— The brief',                                       'Above purpose section',                              'Project Detail', 30),
('project.brief_title',      'Why this *existed*.',                               'Purpose section title',                              'Project Detail', 40),
('project.features_eyebrow', '— What it does',                                    'Above features section',                             'Project Detail', 50),
('project.features_title',   'Key *features*.',                                   'Features section title',                             'Project Detail', 60),
('project.learned_eyebrow',  '— Reflection',                                      'Above lessons section',                              'Project Detail', 70),
('project.learned_title',    'What I *took away*.',                               'Lessons section title',                              'Project Detail', 80),
('project.up_next_eyebrow',  '— Up next',                                         'Bottom CTA eyebrow',                                 'Project Detail', 90),
('project.up_next_title',    'Browse more *work*',                                'Bottom CTA title',                                   'Project Detail', 100),
('project.role_label',       'My role',                                           'Sidebar field label',                                'Project Detail', 110),
('project.type_label',       'Project type',                                      'Sidebar field label',                                'Project Detail', 120),
('project.stack_label',      'Tech stack',                                        'Sidebar field label',                                'Project Detail', 130),
('project.live_cta',         'Visit live site',                                   'Sidebar primary action',                             'Project Detail', 140),
('project.source_cta',       'Source',                                            'Sidebar GitHub action',                              'Project Detail', 150),

-- ─── BLOG POST ──────────────────────────────────────
('blogpost.back_link',       'All articles',                                      'Top-left back link',                                 'Blog Post', 10),
('blogpost.kicker',          'Journal entry',                                     'Top-right kicker label',                             'Blog Post', 20),
('blogpost.cta_eyebrow',     '— Thanks for reading',                              'Footer CTA eyebrow',                                 'Blog Post', 30),
('blogpost.cta_title',       'More *in the journal*.',                            'Footer CTA title',                                   'Blog Post', 40),
('blogpost.read_time',       'min read',                                          'Suffix on read time',                                'Blog Post', 50),

-- ─── 404 ────────────────────────────────────────────
('not_found.eyebrow',        'Error · 404',                                       '404 page eyebrow',                                   '404', 10),
('not_found.title',          'Lost in *space*.',                                  '404 page huge title',                                '404', 20),
('not_found.body',           'The page you''re looking for doesn''t exist — it may have been moved, renamed, or never existed at all. Let''s get you back home.',  'Body',  '404', 30),
('not_found.cta_home',       'Back to home',                                      'Primary button',                                     '404', 40),
('not_found.cta_work',       'Browse work',                                       'Secondary button',                                   '404', 50)

on conflict (key) do nothing;
