# Rules for anyone (or any AI) editing this repo

## House rules (always)
- Never write raw colours (hex, rgb) or one-off shadows in apps/. Use tokens from packages/ui/src/styles/theme.css.
- Never import Radix or shadcn directly in an app. Import from "@vks-kit/ui".
- New UI part = add to packages/ui + add to apps/gallery, in the same change.
- Lao UI text: keep line-height >= 1.5, use normalizeLao() before comparing names.
- Free text from users: run cleanText() from @vks-kit/types before saving.
- Keep animations to transform/opacity. Respect prefers-reduced-motion (already global).
- Icons: import from "@vks-kit/ui/icons" (never "lucide-react" in an app).

The first three and the icon rule are enforced by `packages/ui/test/guards.test.ts` — `npm test` fails if you break them.

## Before you build any UI: search the catalogue
1. Open `llms.txt` (repo root). It lists every part by group with a one-line "what it is" and its exports.
2. Open the matching `docs/ai/<slug>.md`: import line, "when to use" (from the source doc comment), code, examples, props, notes.
3. Decide, in this order:
   - **Reuse** — a part fits: use it as-is.
   - **Extend** — it almost fits: add a prop or variant to that part (additive only, never change existing behaviour).
   - **Add** — nothing fits: follow "Adding a new UI feature" below.
4. Quick search: `rg -i "<word>" llms.txt docs/ai` or `rg "export function" packages/ui/src/components`.

## The 15 parts you will use most
| Need | Use | Catalogue |
|---|---|---|
| Any button | `Button` (variants: default, action, gold, outline, ghost…) | docs/ai/button.md |
| Panel / tile | `Card`, `CardHeader`, `CardContent`… | docs/ai/card.md |
| Text field | `Input`, `Textarea`, `Label` | docs/ai/input.md |
| Short fixed list | `Select` | docs/ai/select.md |
| Long / searchable list | `Combobox` | docs/ai/combobox.md |
| Confirm / small form | `Dialog` (sheet on phone) | docs/ai/dialog.md |
| Slide-in panel | `Sheet` | docs/ai/sheet.md |
| Record detail | `Drawer` | docs/ai/drawer.md |
| Table with sort/search | `DataTable` | docs/ai/data-table.md |
| Feedback after an action | `toast` | docs/ai/toast.md |
| Page frame + nav | `AppShell` | docs/ai/app-shell.md |
| Page title + actions | `PageHeader` | docs/ai/page-header.md |
| Date | `DatePicker` / `DateRangePicker` | docs/ai/date-picker.md |
| Status pill | `Badge` | docs/ai/badge.md |
| Nothing here / loading | `Empty`, `Skeleton` | docs/ai/offline-empty.md, docs/ai/loading.md |

Heavy parts are lazy subpaths: `@vks-kit/ui/charts`, `@vks-kit/ui/map`, `@vks-kit/ui/kanban`, `@vks-kit/ui/scan`.

## Adding a new UI feature (future sessions — follow every step)
1. **Search first** (section above). Write down which part you checked and why it doesn't fit.
2. **Prefer extending**: a new `variant`/prop on an existing part beats a new component. Keep the public API additive.
3. **Where the code goes**:
   - Normal part → `packages/ui/src/components/<file>.tsx`, and make sure `packages/ui/src/index.ts` re-exports it.
   - Big dependency (charts, maps, camera…) → `packages/ui/src/heavy/<x>.tsx` + a subpath in `packages/ui/package.json` "exports". Never pull it into the main entry.
   - No new npm packages unless the user agrees.
4. **Doc comment on every exported component**, in the house form, directly above the export:
   `/** Use for X; for Y use Z instead. */`
5. **Styling**: tokens only (`bg-primary`, `text-muted-foreground`, `var(--success)`…). A new colour means a new token in `theme.css` (light + dark), not a hex.
6. **Icons** from `@vks-kit/ui/icons` in apps (inside packages/ui, `lucide-react` is fine).
7. **Motion & touch**: transform/opacity only; reduced motion snaps; ≤ 400 ms on phones; lite mode (`usePerf`) drops blur and loops; touch targets ≥ 44 px; Lao line-height ≥ 1.5; 16 px inputs (no iOS zoom).
8. **Gallery**: add a demo to `apps/gallery/src/App.tsx` or `More.tsx`.
9. **Docs**: add a `Doc` entry in `apps/docs/src/docs/<group>.tsx` (slug, name, group, desc, file, importLine, demo, code, props, notes). Every exported component name must appear in some entry's `importLine`; sub-parts can go in an existing entry's importLine plus an `examples` item.
10. **Regenerate the catalogue**: `npm run ai:index` (commits `llms.txt`, `docs/ai/*.md`, `apps/docs/public/*`). Never hand-edit those files.
11. **Tests**: `npm test` (guards + unit). Add a unit test for any pure logic (sorting, dates, parsing).
12. **Types & builds**: `npm run typecheck`, `npm run build`, `npm run build:docs` all pass.

**Definition of done**: the part is in packages/ui with a house-form doc comment, shown in the gallery, has a docs entry, `npm run ai:index` has been run, and test + typecheck + both builds are green. If any one is missing, it is not done.

## Commands
| Command | What |
|---|---|
| `npm test` | unit tests + guardrails (imports, raw colours, doc comments, docs coverage, catalogue freshness) |
| `npm run ai:index` | regenerate llms.txt + docs/ai from the docs registry |
| `npm run typecheck` | tsc over packages and apps |
| `npm run dev` / `npm run build` | gallery (:5199) |
| `npm run dev:docs` / `npm run build:docs` | docs site (preview :5200) |

## Scope
GAS and Alpine.js apps cannot import `@vks-kit/ui` (React). They may only share the colour tokens from theme.css.
