# VKS platform

One monorepo for all VKS products. Every app imports the same design system, so they look and behave like one company.

```
packages/
  ui/      shadcn-style components on Radix, theme A (light) + E (dark), animations, Noto Sans Lao, logo
  types/   Zod schemas shared by browser and API (Staff, ScanInput, text cleaning, Lao normalising)
  core/    haptics, offline queue for flaky networks, photo shrinking
apps/
  gallery/ live catalogue of every component in both themes  (npm run dev  ->  http://localhost:5199)
```

Coming apps (one folder each under apps/): stationary-guard (pilot), call-center, russian, feedback, client-report, hub, marketing, duty-control, inspector-head, qc, hrm, patrol.

## Commands
- `npm install`      install everything
- `npm run dev`      open the gallery
- `npm test`         run unit tests (offline queue, schemas, photo sizing)
- `npm run build`    build the gallery
- `npm run ai:index` regenerate the AI catalogue (`llms.txt` + `docs/ai/*.md`) from the docs
- `npm run typecheck` / `npm run build:docs`

## The rule that keeps everything consistent
1. Apps use **only** components from `@vks/ui` and colour tokens (`bg-primary`, `text-muted-foreground`...). No raw hex in apps.
2. Need a new component or colour? Add it to `packages/ui`, show it in the gallery, then use it.
3. Changing a token in `packages/ui/src/styles/theme.css` changes every app.
4. Light theme (A) is the default. Dark (E) is opt-in.
5. Guard/patrol phones: nothing over 400 ms, 44 px touch targets, line-height never below 1.5 (Lao tone marks).
6. Before building UI (people or AI): search `llms.txt` / `docs/ai/`. Full workflow and the "adding a new UI feature" checklist: **AGENTS.md**. `npm test` enforces the import, colour, doc-comment and docs-coverage rules.

## Status
Built and tested locally only. Not deployed. Logo is a vector approximation of vks-logo.jpg; swap in the official file when available.

## Component map (what to import)

| Need | Import |
|---|---|
| Page layout: sidebar (desktop) / bottom nav (phone), FAB, header, login | `AppShell, Sidebar, BottomNav, Fab, PageHeader, LoginCard` from `@vks/ui` |
| Date (popover / phone wheel), dropdown (search, multi), chips, search | `DatePicker, Calendar, Combobox, FilterChips, SearchBox` |
| Sign-in code, signature, photo viewer | `OtpInput, SignaturePad, Lightbox` |
| Lists | `DataTable` (cards on phone if > 4 columns; loading/empty/error built in), `Pagination`, `Drawer` |
| Steps, FAQ, history, stats | `Wizard, Accordion, Timeline, KpiStrip, Progress, StarRating, Avatar` |
| **Heavy, own entry point (load only where used)** | `@vks/ui/charts` (~105 KB gz), `@vks/ui/map` (~43 KB), `@vks/ui/scan` (~48 KB), `@vks/ui/kanban` (~17 KB) |
| Non-visual helpers | `@vks/core`: `t()` Lao/English, `fmtKip`, `swr` page cache, `registerSW`, `promptInstall`, `subscribePush`, `distanceM`, `OfflineQueue` |
| Print | automatic (`print.css`); add class `no-print` to hide extra things |

One breakpoint everywhere: 768 px. Gallery: `npm run dev`, then `#/` (basics) and `#/more` (everything else).
