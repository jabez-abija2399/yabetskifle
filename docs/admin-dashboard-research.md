# Admin Dashboard UI Research Report (2025–2026)

*For a Next.js 16 + Tailwind portfolio admin that must harmonize with a "systems-not-screens" editorial/terminal public site.*

---

## 1. Trends & Principles — What the Best Admin UIs Share in 2025/2026

### 1.1 Quiet chrome, high density
Borders, shadows, and decoration keep shrinking while information density rises. Hierarchy comes from **type weight, spacing, and 1px hairlines** — not cards floating on cards. Linear, Vercel, Stripe, and Supabase all converge here: near-monochrome surfaces, color reserved strictly for *state and meaning* (status dots, destructive, active nav), never decoration. ([adminlte.io](https://adminlte.io/blog/saas-dashboard-design-examples/))

### 1.2 Tables have reclaimed the throne
The chart-heavy dashboard era faded. Best-in-class admin UIs **lead with structured tables** and use charts only where a trend's *shape* carries the insight (Stripe: "the chart is a summary, the table is the truth"). One hero metric visualized beats five decorative charts. ([adminlte.io](https://adminlte.io/blog/saas-dashboard-design-examples/))

### 1.3 Dark-first for power tools, light for content-heavy
Tools used for hours (Linear, Vercel, Supabase, Railway) design dark mode first; occasional-use or text-heavy panels stay light-first. Either way **both themes are designed together on tokens**, never inverted afterthoughts. Dark mode is table stakes, not a feature. ([fanruan.com](https://www.fanruan.com/en/blog/top-admin-dashboard-design-ideas-inspiration))

### 1.4 Interaction completeness is the real "premium" signal
Linear/Vercel/Stripe are visually sparse but **interaction-dense**: every interactive element has default, hover, focus (keyboard), active, disabled, loading. Focus rings are designed, not browser defaults. Skeletons match the layout they replace. Empty states are designed, not stubbed. "The density is in the behavior, not the pixels." ([mantlr.com](https://mantlr.com/blog/stripe-linear-vercel-premium-ui))

### 1.5 Keyboard-first, mouse-optional
⌘K command palette is expected by default. Arrow-key navigation, shortcut hints on hover, roving tabindex in grids/lists, `g`-then-letter go-to sequences. Everything reachable by click must be reachable by key. ([designsystems.one](https://www.designsystems.one/design-systems/patterns/search-and-command))

### 1.6 Sharp data surfaces, rounded overlays (Linear's two-tier system)
Data grids, tables, metric panels: `border-radius: 0`, separated by **1px border tiers** (strong/default/subtle), no gaps, no shadows. Rounded corners + shadows are reserved **exclusively for floating overlays** (modals, dropdowns, command palette, popovers). This reads as Bloomberg-terminal/IDE precision rather than card-based SaaS. ([github.com/marcus/marcus-skills](https://github.com/marcus/marcus-skills/blob/main/skills/linear-design-patterns/references/linear-design-system.md))

### 1.7 AI-native (not AI-added) — secondary for a portfolio admin
Attio/Hex style: summaries and suggested actions as designed components, not a chat bubble floating over old UI. Mostly N/A for a personal portfolio, but the principle transfers: **don't bolt on patterns; design them into the surface.**

### 1.8 Design-system consistency across product + marketing + docs
The Tailwind/shadcn era means users notice when marketing site and app chrome diverge. Your admin should feel like the *same publication* as the public site — same mono labels, same hairlines, same section numbering — just denser and more operational. ([adminlte.io](https://adminlte.io/blog/saas-dashboard-design-examples/))

### 1.9 One page template, many tools (Supabase's structural consistency)
A user who learns one admin section has learned them all: consistent page scaffold = **PageHeader → toolbar/filters → table → pagination → empty/loading states**. Resist inventing per-page layouts. ([adminlte.io](https://adminlte.io/blog/saas-dashboard-design-examples/))

### 1.10 KPI hierarchy: one primary number
Stripe's rule: **4 KPI cards max above the fold**, each with one primary number (28–32px), one comparison, one sparkline/trend — not all three competing. Top-left = most important. If everything is highlighted, nothing is. ([artofstyleframe.com](https://artofstyleframe.com/blog/dashboard-design-patterns-web-apps/))

### 1.11 Undo > Confirm (mostly)
Linear's doctrine: prefer undo for reversible actions; confirmation dialogs only for truly irreversible ones. But for portfolio-scale destructive actions (delete post/project), the modern consensus is a **specific AlertDialog** (name the object, name the verb) rather than blanket undo. ([github.com/marcus](https://github.com/marcus/marcus-skills/blob/main/skills/linear-design-patterns/references/linear-design-system.md))

### 1.12 Empty states as onboarding
Best dashboards (Mercury, Supabase, Linear) treat empty as the first-run moment: name what's missing, why, one clear CTA in active language ("Create your first project", not "No projects found"). Distinguish **cold-start vs filtered-empty vs error-empty**. ([supabase.com](https://supabase.com/design-system/docs/ui-patterns/empty-states))

---

## 2. Concrete Patterns (with URLs to steal structure from)

### 2.1 Exemplary dashboards worth studying

| Reference | Steal this | URL |
|---|---|---|
| **shadcn dashboard-01** | The canonical modern block: `SidebarProvider` + inset sidebar + `SiteHeader` + section-cards + interactive chart + full `data-table` (TanStack). File anatomy is the de-facto structure. | https://ui.shadcn.com/blocks#dashboard-01 |
| **shadcn sidebar-07** | Sidebar collapsing to icons + `SidebarTrigger` + Breadcrumb in header (`h-16` → `h-12` when collapsed). | https://ui.shadcn.com/blocks#sidebar-07 |
| **shadcn example dashboard** | Production-shaped data table with drag-reorder, status badges, row actions menu. | https://ui.shadcn.com/examples/dashboard |
| **Linear** | Quiet chrome, inverted-L nav (sidebar + header), flush tiled grids, keyboard-first, sharp data surfaces, border hierarchy. | https://linear.app + [design system teardown](https://github.com/marcus/marcus-skills/blob/main/skills/linear-design-patterns/references/linear-design-system.md) |
| **Linear header reverse-engineering** | Header anatomy: Title(breadcrumbs) / Tabs / Side actions / Subheader(filters); priority-based responsive slot hiding; tab overflow with `visibility:hidden` + count popover. | https://pustelto.com/blog/reverse-engineer-linear-1-header/ |
| **Stripe dashboard** | Tables as primary interface; tabular numerals right-aligned; muted gridlines; 4-KPI discipline; drill-downs that never lose place. | https://stripe.com/dashboard |
| **Vercel dashboard** | Monochrome system where status colors (green/amber/red) carry all semantic weight; calm logs/observability views; Geist Sans + Geist Mono pairing. | https://vercel.com/dashboard |
| **Resend** | True black canvas, hairline borders (no shadows), mono (Commit Mono/Geist Mono) for technical strings, editorial serif headlines only on marketing — product UI uses Inter + mono labels. | https://www.shadcn.io/design/resend |
| **Supabase dashboard** | One page template (header/tabs/table) across heterogeneous tools; strong iconography; disciplined sidebar; designed empty states; green-on-dark identity. | https://supabase.com/dashboard |
| **Railway / Convex / Better Stack / Cal.com admin** | Terminal-adjacent developer consoles: mono metadata, status pills, log-like density. | respective dashboards |
| **Brut UI** | Brutalist-editorial system: `border-2`, hard offset shadows (no blur), `rounded-none`, JetBrains Mono uppercase labels tracking 0.2–0.3em, §NN section markers, path-style breadcrumbs (`~/section/file.ext`), blinking cursor motifs. | https://brutui.dev/ |
| **dotty (pixel-brutalist)** | Cool-toned monochrome (hue 220), stacked-block 2-layer cards, mono only for numerics (`IBM Plex Mono`), zero global radius + selective rounded controls. | https://github.com/nocoo/dotty |
| **BrutAdmin** | Neobrutalist admin with thick borders + hard shadows built on shadcn/Base UI — proof the two can coexist. | https://neobrutalism.com/templates/brutadmin |
| **Mercury** | Editorial polish on financial data — art direction applied to tables/cards without sacrificing scannability. | https://mercury.com |
| **Plausible** | Radical restraint: one chart + ranked lists; ship the small version first. | https://plausible.io/plausible.io |
| **Mobbin Admin Dashboard collection** | Hundreds of real admin screen flows (headers, tables, filters, breadcrumbs, empty states). | https://mobbin.com/explore/web/screens/admin-dashboard |

### 2.2 App shell / layout

**Standard shell (shadcn dashboard-01 pattern):**
```
SidebarProvider (--sidebar-width: 72*spacing ≈ 18rem, --header-height: 12*spacing = 3rem)
├── AppSidebar variant="inset"     // grouped nav: nav-main, nav-secondary, nav-documents, nav-user
└── SidebarInset
    ├── SiteHeader                 // SidebarTrigger | Separator | Breadcrumb | right: search/notifications/user
    └── page content               // @container/main, gap-4/6, px-4 lg:px-6
```

- **Sidebar:** 256px expanded → 64px icon rail collapsed; section headers 12px uppercase; nav items ~36px tall; active = bg at ~8% accent + optional 3px left accent bar; 200ms width transition.
- **Top bar / SiteHeader:** height 48–64px (shrinks to 48px when sidebar collapsed in shadcn), contains trigger + breadcrumb (or page title), global search with ⌘K hint, notification bell, avatar menu.
- **Mobile:** sidebar becomes `Sheet`/drawer overlay triggered from header; **not** a hamburger that permanently reflows. Content full-width.
- Source: [shadcn blocks](https://ui.shadcn.com/blocks), [UI Syntax app-shell collection](https://ui-syntax.com/collections/app-shell-layouts)

### 2.3 Page header (title + description + actions)

Converged anatomy across Helios (HashiCorp), Primer (GitHub), Atlassian, Supabase, and shadcn-space:

```
[Breadcrumb (optional, mono path style for you)]
H1 Title  [status badge]          [Primary action] [Secondary ▾ overflow]
Description (1–2 sentences max, secondary color)
───────────────────────────────────────────────── (hairline)
```

Rules:
- **One `h1` per page, outside cards.** Card titles are `h2`.
- Description ≤ 2 sentences; longer content → link to docs or omit.
- **Max 2 actions** (1 primary + 1 secondary/overflow). Never two primaries. Destructive actions live in overflow menu or danger zone, not in the header.
- Actions are **page-level context actions** (Create, Refresh, Export) — **not** form save buttons. Save belongs in the form footer.
- Actions collapse into overflow on small viewports (Linear uses priority-based `ResponsiveSlot` hiding).
- Sources: [Helios Page Header](https://helios.hashicorp.design/components/page-header), [Primer PageHeader](https://primer.style/product/components/page-header/guidelines), [WebBlocks admin standards](https://ui.docs.webblocksui.com/p/pattern-admin-standards), [Supabase Page Header fragment](https://supabase.com/design-system/docs/fragments/page-header)

### 2.4 Data tables (sort / filter / pagination)

**Standard toolbar above table:**
```
[Search input (flex-1 max-w-sm)] [Filter chips ▾] [Sort summary] [Columns ▾] [View ▾] .... [Primary: New X]
──────────────────────────────────────────────────────────────
[sticky header row: ☐ | Col ↕ | Col ↕ | Status | … | ⋯ ]
[rows…]
──────────────────────────────────────────────────────────────
[“3 of 128 selected”]                    [Rows/page] [Page 2 of 13] [⇤ ‹ › ⇥]
```

Hard rules:
- **TanStack Table** (v8 today; v9's `tableFeatures()` is the future — opt-in, tree-shakeable features). shadcn's current docs document v9-style `tableFeatures({ rowSortingFeature, … })`.
- Sync sort/page/filter state to the **URL** (`useSearchParams` + `router.replace`) so refresh/share works.
- `getRowId: (r) => r.id` (never index) — selection breaks otherwise.
- `aria-sort` on sortable headers + visible ↑/↓ glyph (never color alone).
- Sticky header (`sticky top-0 bg-background z-10`).
- **Loading vs refetch:** skeleton rows only on *initial* load; keep loaded rows visible during background refetch (spinner goes in the action bar). Don't thread `query.isFetching` into column defs — it remounts the whole table.
- Empty row inside the table shell for zero results (dull header, no hover); full empty-state card for cold-start.
- Row height ~36px (Linear) for density; compact variant for admin.
- Sources: [shadcn Data Table / TanStack v9](https://ui.shadcn.com/docs/components/base/data-table), [TanStack column visibility](https://tanstack.dev/table/v8/docs/guide/column-visibility), [QUI loading/empty states](https://react-table.qui.qualcomm.com/best-practices/loading-and-empty-states), [shadcn-data-table skill](https://agentworkspace.attrition.sh/packs/shadcn-data-table)

### 2.5 Empty states

Differentiate **four causes** — one generic "No results" is an anti-pattern:

| Cause | Pattern | CTA |
|---|---|---|
| Cold start (zero data ever) | Presentational: icon + title + description + primary button, **active language** | "Create your first project" |
| Filtered to zero | Single row inside table, dulled header, query echoed | "Clear filters" |
| Permission | Centered admonition | "Request access" |
| Error / missing route | Centered admonition + retry/back | "Try again" |

- Match the data area's dimensions (don't stuff empty state into a 40px strip).
- Wait until fetch *resolves* with zero rows before showing empty (no empty flash during load).
- Sources: [Supabase empty states](https://supabase.com/design-system/docs/ui-patterns/empty-states), [Agents Playbook empty pattern](https://playbook.agentskit.io/docs/pillars/ui-ux/empty-states-pattern), [NN/g empty states](https://www.nngroup.com/articles/empty-state-interface-design/)

### 2.6 Loading skeletons

| Situation | Use |
|---|---|
| < 300ms | **Nothing** (flash is worse) |
| Page/section load 0.3–10s, layout predictable | **Skeleton** mirroring real layout |
| Single-module/action (button submit, one card) | **Spinner inside the control** |
| > 10s / determinate work | **Progress bar** |

- Skeleton must **match final dimensions** (no CLS), varied line widths, neutral gray (not brand color), `aria-hidden="true"` + sr-only "Loading…", `prefers-reduced-motion` kills shimmer.
- Progressive loading: each dashboard widget skeletons and resolves independently — never block the whole page on the slowest API.
- **Timeout → explicit error state** (never an infinite skeleton).
- Sources: [NN/g Skeleton Screens 101](https://www.nngroup.com/articles/skeleton-screens/), [LogRocket skeleton design](https://blog.logrocket.com/ux-design/skeleton-loading-screen-design/), [Foundey skeleton guide](https://foundey.com/blog/skeleton-screen-ui-design)

### 2.7 Form sections / settings layout

**Structure:** PageHeader → 2–6 labeled **Panels/Cards** (one topic each: "Identity", "Publishing", "SEO") → sticky or footer **Save bar** → final **Danger zone** panel (destructive variant, last).

- Labels **above inputs** (settings labels are long).
- Toggle = binary; checkbox = multi-select; select = 3+ exclusive options.
- **Pick one save model per screen:** instant (toggles → inline "Saved" next to control, not a corner toast) **or** explicit (typed values → save bar with Save/Discard + unsaved-changes guard). Never mix.
- Section status in text (Complete / Error / Needs review), not color alone.
- Error summary at top linking to owning section/field; focus moves to first invalid field.
- Danger zone: specific verb+object ("Delete project X"), typed confirmation for severe cases.
- Settings IA: organize by **user task**, not schema; each section gets its **own URL** (not a state flag); >40 settings → add search.
- Sources: [Marigold Panel](https://www.marigold-ui.io/components/layout/panel), [WebBlocks admin standards](https://ui.docs.webblocksui.com/p/pattern-admin-standards), [21st settings pages](https://21st.dev/blog/react-settings-page-components), [Threshline settings UX](https://threshline.com/blog/settings-page-ux-design/), [UX Patterns complex form](https://uxpatternsguide.com/patterns/complete-complex-form/)

### 2.8 Destructive confirmations

Use **`AlertDialog`** (`role="alertdialog"`) — not plain Dialog:

- **Title names the object + verb:** "Delete project ‘Orbit’?" — never "Are you sure?"
- **Description states the concrete consequence:** what else is lost ("This also removes 12 related posts and unpublishes…"), reversibility ("This cannot be undone").
- **Confirm button repeats the verb:** "Delete project" — never "OK"/"Yes".
- **Initial focus on Cancel** (reflexive Enter must not destroy). APG/Polaris/Carbon/Material3/GOV.UK all agree for destructive.
- Escape = cancel; **backdrop-click disabled** for destructive alertdialogs.
- Escalate to **typed confirmation** (type the resource name) only for severe/bulk/irreversible actions.
- Choose **confirmation XOR undo**, not both (confirm-then-undo trains users to click through dialogs).
- After success: one Sonner toast naming what happened ("Project ‘Orbit’ deleted").
- Sources: [uianatomy confirmation flow](https://uianatomy.dev/patterns/confirmation-flow), [Marigold destructive actions](https://www.marigold-ui.io/patterns/feedback/destructive-actions), [shadcn AlertDialog](https://www.shadcn.io/ui/alert-dialog), [NN/g confirmation dialogs](https://www.nngroup.com/articles/confirmation-dialog/)

### 2.9 Toast / notifications (Sonner)

- **Toast for success; inline for failure.** Errors belong next to the field/row that caused them.
- Placement: one fixed corner app-wide (bottom-right is conventional; Sonner default top-right is fine — pick one).
- Timing: 3–4s plain confirmation; 6–10s if it has an action (pause on hover/focus); **no auto-dismiss for errors**.
- Max stack ~3; name the object in copy ("Saved ‘Homepage’", not "Updated").
- One action max ("Undo" — not "Restore/Revert").
- Live region: container mounted at page load (empty), `aria-live="polite"` for success, `assertive` for urgent errors. Actionable toast → real focus management.
- Sources: [21st.dev toast rules](https://21st.dev/blog/react-toast-notification-components), [UX Patterns notification](https://uxpatterns.dev/patterns/user-feedback/notification), [LogRocket toasts](https://blog.logrocket.com/ux-design/toast-notifications/)

### 2.10 Command palette (⌘K)

Canonical stack: **Radix Dialog + cmdk** (what shadcn ships as `Command`/`CommandDialog`).

Behavior checklist:
- ⌘K/Ctrl+K toggles globally (listener at layout level); **visible trigger button** for touch/discoverability.
- Focus lands in input on open; returns to opener on close; focus trapped while open.
- Recent/frequent items when empty; fuzzy match with highlighted substrings.
- **Groups** (Navigation / Actions / Settings) with mono uppercase group labels — fits your aesthetic perfectly.
- Arrow keys move active row; Enter activates; Esc closes.
- Shortcut hints right-aligned per row (teaches keys organically — Linear's trick).
- Async results stream with loading affordance, never a blocking spinner.
- **Destructive commands must open a confirmation**, never execute from fuzzy search.
- Empty state with suggestions, not a blank void.
- Never the *only* path to primary navigation.
- Sources: [DesignSystems.one command palette](https://www.designsystems.one/design-systems/patterns/search-and-command), [UX Patterns command palette](https://uxpatternsguide.com/patterns/command-palette), [shadcn Command](https://www.shadcn.io/ui/command)

### 2.11 Breadcrumbs vs sidebar-only

- **Sidebar is primary navigation** (persistent, 5–7 top-level sections max).
- **Breadcrumbs are secondary orientation** — show *hierarchy*, never session history; current page is not a link; supplement (don't replace) sidebar.
- **Skip breadcrumbs on flat/1–2-level IAs** — for a small portfolio admin (Projects / Posts / Media / Settings), a **mono path breadcrumb** on *detail/edit* pages only is the sweet spot: `projects > orbit > edit`. Top-level index pages get just the title.
- On mobile: shorten to last level or hide entirely; never wrap; tap targets ≥44px.
- Sources: [NN/g breadcrumbs](https://www.nngroup.com/articles/breadcrumbs/), [USWDS breadcrumb](https://designsystem.digital.gov/components/breadcrumb/), [UX Patterns nav comparison](https://uxpatternsguide.com/compare/in-page-anchor-navigation-vs-breadcrumbs-vs-side-navigation/)

### 2.12 Dark mode

- Build both themes **together on CSS variables** (shadcn's `--background/--foreground/--card/--muted/--border/--accent` + `.dark` class).
- 2–3 dark surface steps (`#121212` / `#1E1E1E` / `#2C2C2C`) — never pure black everywhere (OLED smearing) unless you're committing fully to Resend-style true black + hairlines.
- Off-white text (`#E0E0E0`) not `#fff` on dark; ≥4.5:1 body contrast.
- Respect `prefers-color-scheme` default + manual toggle.
- Status colors stay saturated on dark; muted pastels vanish.
- ([fanruan.com](https://www.fanruan.com/en/blog/top-admin-dashboard-design-ideas-inspiration))

### 2.13 Accessibility checklist for admin UIs

- **Heading hierarchy:** one `h1` (page title) → `h2` (panel/card titles) → `h3` nested. Never skip levels.
- **Landmarks:** `nav[aria-label]` for sidebar & breadcrumb; `main`; unique labels per region; skip-to-content link visible on focus.
- **Focus visible:** designed ring ≥3:1 contrast against adjacent bg; never `outline: none` without replacement. Multi-cue (outline + bg shift), not color alone.
- **Keyboard:** Tab order = DOM/visual order; no positive `tabindex`. Composite widgets (menus, tabs, grids) use **roving tabindex** — one tab stop, arrows inside. Esc closes overlays and returns focus to trigger. Dialogs trap focus.
- **Data tables:** `aria-sort` on headers; status updates via `aria-live`; after deleting a row, move focus to a stable successor (never `body`).
- **Touch targets:** ≥44px (WCAG 2.2 target size); mobile sidebar = Sheet with large hit areas.
- **Mobile sidebar:** Sheet/drawer overlay, focus trap, Esc to close, safe-area insets.
- **Reduced motion:** disable shimmer/slide via `prefers-reduced-motion`.
- **Color:** never the sole carrier of status — pair with icon/text.
- Sources: [WAI-ARIA APG menubar](https://www.w3.org/WAI/ARIA/apg/patterns/menubar/), [Accessible Data Interfaces](https://www.accessible-data-interfaces.com/core-aria-keyboard-navigation-for-data-uis/), [WebAIM keyboard](https://webaim.org/techniques/keyboard/), [Level Access menus](https://www.levelaccess.com/blog/accessible-navigation-menus-pitfalls-and-best-practices/)

### 2.14 Next.js App Router admin layout best practices

```
app/
├── (public)/                    # marketing/public site — own layout, no admin chrome
│   └── ...
└── (admin)/                     # route group: NO url segment
    ├── layout.tsx               # admin shell: SidebarProvider + AppSidebar + SiteHeader
    │                            #   (client boundary only where needed: sidebar state, cmdk)
    ├── loading.tsx              # shell-level skeleton
    ├── error.tsx
    ├── dashboard/page.tsx       # Server Component: fetch data, render
    ├── projects/
    │   ├── page.tsx             # list — Server Component
    │   ├── loading.tsx          # table skeleton
    │   ├── _components/         # private folder (underscore = not a route)
    │   │   ├── projects-table.tsx   # "use client" — TanStack interactivity
    │   │   ├── delete-project-dialog.tsx
    │   │   └── columns.tsx
    │   ├── _lib/
    │   │   ├── actions.ts       # thin Server Actions: validate → service → revalidate
    │   │   ├── service.ts       # business logic
    │   │   ├── schema.ts        # Zod
    │   │   └── loaders.ts
    │   └── [id]/
    │       ├── page.tsx         # edit/detail
    │       └── _components/
    └── settings/
        ├── layout.tsx           # nested layout: settings sub-nav + content
        ├── page.tsx
        ├── profile/page.tsx     # each section = own URL
        └── danger/page.tsx
```

Key rules:
- **Route group `(admin)`** partitions admin chrome from public site without affecting URLs. Optionally give it a *separate root layout* (drop top-level `layout.tsx`) so admin gets different fonts/theme — but note cross-root navigations cause full page loads.
- **Nested layouts** preserve state across navigations (partial rendering) — sidebar doesn't re-render when moving between admin pages.
- **Server Components by default:** pages + loaders fetch data server-side. Mark `"use client"` only on interactive leaves (table, dialogs, cmdk, sidebar toggle).
- **Server Actions thin:** validate with Zod → call `service.ts` → `revalidatePath`. Keep business logic out of actions; guard with `server-only`.
- Colocate route-specific code in **`_components` / `_lib`** (underscore-prefixed folders are excluded from routing).
- `loading.tsx` per segment gives automatic Suspense fallbacks (skeletons).
- URL state for tables: `searchParams` prop on Server Components for server-driven pagination/filtering; `useSearchParams` only for client-side refinement of already-loaded data.
- Sources: [Next.js Route Groups](https://nextjs.org/docs/app/building-your-application/routing/route-groups), [Makerkit App Router structure](https://makerkit.dev/blog/tutorials/nextjs-app-router-project-structure), [next-shadcn-admin-dashboard](https://github.com/BunsDev/next-shadcn-admin-dashboard), [Next.js layouts tutorial](https://nextjs.org/learn/dashboard-app/creating-layouts-and-pages)

> ⚠️ Per your AGENTS.md: **read `node_modules/next/dist/docs/` before writing code** — this Next.js version may differ from the docs linked above (which skew v14/15).

---

## 3. Recommendations — Prioritized Design Decisions for Your Portfolio Admin

### Tier 0 — Foundation (do first; everything else hangs off these)

1. **Adopt the shadcn `dashboard-01` shell as your skeleton** — `SidebarProvider` (inset variant) + `AppSidebar` + `SidebarInset` + `SiteHeader`. Set `--sidebar-width: 18rem`, `--header-height: 3–4rem`. This gives you collapsible sidebar, mobile Sheet, and breadcrumb header for free.
2. **Overwrite the tokens, keep the structure.** Map shadcn CSS vars to your public-site palette:
   - `--radius: 0.125rem` (rounded-xs) — **sharp data surfaces**, reserve `rounded-md/lg` only for floating overlays (dialog, dropdown, cmdk, popover) — Linear's two-tier rule.
   - Borders: 1px hairlines at 3 opacities (strong/default/subtle) instead of shadows. **No shadows on cards/tables.**
   - Mono font as `--font-mono` driving all labels; body font for prose/inputs.
3. **Define the PageHeader component once** and use it on every admin page: mono path breadcrumb → `h1` + optional status badge → 1-line description → max 2 actions → hairline. Never hand-roll `h1` again.
4. **Route structure:** `app/(admin)/…` with nested `layout.tsx` shell, per-route `_components`/`_lib`, `loading.tsx` skeletons. Separate `(public)` group for the editorial site.

### Tier 1 — The list-page template (your workhorse)

5. **One canonical list-page scaffold** (Supabase lesson): PageHeader → toolbar (search + filter chips + columns menu) → hairline table (sticky header, 36px rows, `aria-sort`, tabular numerals right-aligned) → pagination footer → empty/loading/error slots. Every CRUD section is an instance of this.
6. **TanStack Table + URL-synced state.** Sort/page/filter in the query string. Skeleton on first load; keep rows during refetch. Distinct cold-start vs filtered-empty states.
7. **Section numbering + mono micro-labels as your signature:** sidebar group headers as `01 / CONTENT`, `02 / MEDIA`, `03 / SYSTEM`; toolbar groups as `FILTER`, `SORT`, `COLUMNS`; panel headers as `02 · PROJECTS` — this is how the admin echoes the public site's `01/02/03` editorial system without gimmicks.

### Tier 2 — Interaction polish (where "premium" actually comes from)

8. **⌘K command palette** (cmdk + Radix Dialog) with grouped results: `NAVIGATION` / `ACTIONS` (New post, New project) / `SETTINGS`. Mono group labels, right-aligned kbd hints, visible header trigger with `⌘K` chip. Destructive commands open AlertDialog.
9. **AlertDialog for destructive, Sonner for success.** Title = verb+object; focus Cancel; confirm button repeats verb. Toast: "Project ‘X’ deleted." Inline errors on fields — never toast-only failures.
10. **Six microstates on every interactive element** (default/hover/focus/active/disabled/loading) with a *designed* focus ring (2px, high contrast, `rounded-xs` to match). This single checklist separates "template" from "considered."
11. **Designed empty + skeleton states** for every collection surface (cold-start with CTA, filtered with clear-filters, error with retry). Skeletons mirror layout, `aria-hidden`, timeout→error.
12. **Danger zone** as the final panel on edit pages: destructive border treatment, specific copy, typed confirmation only if truly severe.

### Tier 3 — Editorial/terminal voice (make it *yours*)

13. **Type roles (strict lanes, Resend-style):**
    - **Mono (JetBrains/Geist Mono):** all labels, badges, IDs, slugs, timestamps, breadcrumbs, group headers, keyboard hints — uppercase, `tracking-[0.08–0.12em]`, 10–12px.
    - **Body sans:** inputs, descriptions, table cell prose.
    - **Display/serif (if public site has one):** *only* page `h1` on major sections — never inside tables/dialogs.
14. **Status = mono pill + dot,** not colorful chips: `● LIVE` / `● DRAFT` / `● ARCHIVED` in muted green/amber/gray. Color carries meaning only.
15. **Path-style breadcrumbs** on detail pages: `~/projects/orbit` or `projects / orbit / edit` with `/` separators — terminal DNA without ASCII-art cheese. (Avoid full green-on-black hacker mode; it reads as costume, not craft — your public site's restrained terminal register is the right calibration.)
16. **Section markers:** panel headers and sidebar groups reuse `01 — OVERVIEW` numbering; optional `§` or `//` prefix for glossary-style helper text.
17. **Skip decorative motion.** Instant/short (120–180ms) state changes; respect `prefers-reduced-motion`. Linear's rule: motion communicates state, never performs.
18. **Dark mode as first-class** (if your public site is dark-leaning) built on the same tokens; toggle in the user menu; `prefers-color-scheme` default.

### Tier 4 — Accessibility non-negotiables

19. Landmarks + unique `aria-label`s (sidebar nav, breadcrumb nav, main, filter region). Skip link.
20. Roving tabindex in sidebar menus/table grids; Esc closes all overlays and restores focus.
21. Mobile: sidebar → Sheet (focus trap, Esc, 44px targets); breadcrumbs shortened or hidden; table → priority columns + row expansion (don't horizontal-scroll a 10-col table on a phone).
22. After delete, move focus to the next row or the page heading — never drop to `body`.

### Tier 5 — Nice-to-have (only after 1–4 feel excellent)

23. Toast **history** only if you accumulate real events; a personal portfolio admin rarely needs a notification center.
24. Row-level inline edit (Linear-style) for boolean/status fields; full row edit for text.
25. Optimistic UI + quiet rollback toast for star/publish toggles.
26. Density toggle (comfortable/compact) persisted per user — cheap, very "pro tool."

---

## 4. Component Libraries & Primitives Worth Adopting

| Library | Why | Notes |
|---|---|---|
| **shadcn/ui** (Base UI / Radix primitives) | The 2025–26 default for Tailwind admins; you own the code; blocks (`dashboard-01`, `sidebar-07`) give you the shell | Core set: `sidebar`, `sheet`, `dropdown-menu`, `dialog`, `alert-dialog`, `tabs`, `badge`, `avatar`, `skeleton`, `table`, `command`, `sonner`, `breadcrumb`, `separator`, `tooltip`, `popover`, `select`, `switch`, `form` (react-hook-form + zod), `pagination` |
| **TanStack Table** (v8 now / v9 `tableFeatures`) | Headless sorting/filter/pagination/selection/visibility; shadcn's data-table docs now target v9 | Start client-side; go `manualPagination` only when data outgrows it |
| **cmdk** | Command palette primitive (powers Linear/Raycast-style ⌘K) | Wrapped by shadcn `Command`/`CommandDialog` |
| **Sonner** | Default toast in shadcn ecosystem; stacking, swipe, promise toasts, pause-on-hover | Theme it to hairline/mono aesthetic |
| **Radix Toast / Dialog / Dropdown** | When you need lower-level control than shadcn wrappers | Radix is what Linear uses (case study) |
| **Lucide icons** | Matches shadcn default; thin stroke suits hairline aesthetic | Keep stroke consistent (1.5) |
| **Recharts** (+ shadcn `ChartContainer`) | What `dashboard-01`'s chart uses | One hero chart max |
| **react-hook-form + Zod** | shadcn Form pattern; server-action validation shared client/server | |
| **Brut UI / Neobrutalism / dotty** | Only if you want to push harder into neo-brutalist territory | Useful as *reference systems* for tokens, not wholesale adoption (too heavy for daily admin use) |
| **Tremor / shadcn-space blocks** | Extra dashboard shells if you outgrow `dashboard-01` | Evaluate tone — many are more "corporate SaaS" than editorial |

**Skip:** Bootstrap admin templates (AdminLTE, Volt, Metronic) — wrong era/aesthetic. Horizon UI PRO — too gradient-happy. Retool-style plainness is a *principle* to steal, not a kit to install.

---

## 5. Quick-Reference Steal List

| Need | Steal from |
|---|---|
| Shell/layout | [shadcn dashboard-01](https://ui.shadcn.com/blocks#dashboard-01) |
| Sidebar collapse + header | [shadcn sidebar-07](https://ui.shadcn.com/blocks#sidebar-07) |
| Header anatomy / responsive slots | [Linear header teardown](https://pustelto.com/blog/reverse-engineer-linear-1-header/) |
| Sharp surfaces + border tiers | [Linear design system reference](https://github.com/marcus/marcus-skills/blob/main/skills/linear-design-patterns/references/linear-design-system.md) |
| PageHeader slots | [Helios](https://helios.hashicorp.design/components/page-header), [Primer](https://primer.style/product/components/page-header/guidelines) |
| Table states | [shadcn Data Table](https://ui.shadcn.com/docs/components/base/data-table), [Supabase UI patterns](https://supabase.com/design-system/docs/ui-patterns/empty-states) |
| Empty states | [Supabase](https://supabase.com/design-system/docs/ui-patterns/empty-states) |
| Destructive confirm | [uianatomy](https://uianatomy.dev/patterns/confirmation-flow), [shadcn AlertDialog](https://www.shadcn.io/ui/alert-dialog) |
| Toasts | [Sonner via shadcn](https://ui.shadcn.com/docs/components/sonner), [21st.dev rules](https://21st.dev/blog/react-toast-notification-components) |
| ⌘K | [DesignSystems.one](https://www.designsystems.one/design-systems/patterns/search-and-command) |
| Settings/forms | [Marigold Panel](https://www.marigold-ui.io/components/layout/panel), [WebBlocks admin standards](https://ui.docs.webblocksui.com/p/pattern-admin-standards) |
| Mono/terminal voice | [Resend design system](https://www.shadcn.io/design/resend), [Brut UI](https://brutui.dev/), [Vercel aesthetic](https://welovedaily.net/article/vercel-aesthetic-dev-tool-lingua-franca) |
| A11y keyboard/ARIA | [WAI-ARIA APG](https://www.w3.org/WAI/ARIA/apg/patterns/menubar/), [Accessible Data Interfaces](https://www.accessible-data-interfaces.com/core-aria-keyboard-navigation-for-data-uis/) |
| App Router structure | [Makerkit](https://makerkit.dev/blog/tutorials/nextjs-app-router-project-structure), [Next.js route groups](https://nextjs.org/docs/app/building-your-application/routing/route-groups) |
| Inspiration galleries | [Mobbin admin dashboard](https://mobbin.com/explore/web/screens/admin-dashboard), [Mobbin dashboard](https://mobbin.com/explore/web/screens/dashboard), [Godly](https://godly.website) |

---

**Bottom line:** Build the *structural* shell from shadcn `dashboard-01` (it's what every serious Tailwind admin converged on), apply Linear's *surface rules* (sharp data, rounded overlays, hairline tiers, color = state only), layer your public site's *editorial voice* on top (mono uppercase micro-labels, section numbering, path breadcrumbs, tabular numerics, designed focus rings), and treat empty/loading/error/destructive states as first-class design work. That combination is what makes a 2025/26 admin read as best-in-class rather than template-y — and it will feel like the same publication as your portfolio, just operating in denser mode.
