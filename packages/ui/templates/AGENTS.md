# Rules for this app (VKS UI kit consumer)

Copy this file to the root of your app as AGENTS.md.

## House rules
- No raw colours (hex, rgb) or one-off shadows. Use tokens: `bg-primary`, `text-muted-foreground`, `var(--success)`.
- Never import Radix, cva, lucide or sonner directly. Import from `@vks-kit/ui` (icons: `@vks-kit/ui/icons`).
- Heavy parts are lazy subpaths: `@vks-kit/ui/charts`, `/map`, `/kanban`, `/scan`.
- Lao text: line-height >= 1.5, `normalizeLao()` before comparing names. Free text: `cleanText()` before saving.
- Motion: transform/opacity only, <= 400 ms on phones. Touch targets >= 44 px. Inputs 16 px.
- Currency: write "ກີບ", never the symbol.

## Design thinking (every page — keep it uncluttered)
Full guide: `node_modules/@vks-kit/ui/docs/ai/design-thinking.md` (docs site: #/docs/design-thinking).
- **One job per page**: write the question the page answers; the first screen answers it.
- **Content first**: PageHeader → one control row (~44 px) → the main content. View switches go in PageHeader actions.
- **Hide what is used sometimes**: 1-3 everyday controls visible; the rest behind one "Filter" Popover (sheet on phone) with a count badge. Active filters = removable chips; Reset only when something is set.
- **≤ 5 headline numbers** in one slim row, each leading somewhere. **Say it once**: never show the same fact twice.
- **Merge, don't stack**: ≤ 3 blocks above the main content; related small cards become one strip.
- **Help is one muted line**, not a card. **Counts on the controls** (Backend 19), not in a summary block.
- Check at 360 px and 1440×900 before calling a screen done.

## Phone rules (every screen)
Full text: `node_modules/@vks-kit/ui/docs/ai/design-thinking.md` (rules "Phone lists" … "Check it like a phone").
- **Lists**: 2 lines per row, ~8 rows per 360×780 screen: `DataTable mode="rows"` (columns with `row: "title" | "sub" | "action"`). Second action: `SwipeRow`.
- **Popups**: one big main action, the rest behind ⋯: `FormActions`. The ✕ closes; no extra Close button.
- **Long forms**: fold what is not needed every time and say what is missing: `FoldSection`. A save that cannot run yet says why: `Button disabledReason`.
- **Sheets**: never a sheet on a sheet; buttons never scroll away: `SheetContent footer={…}`.
- **Frame**: `AppShell phoneHeader={false}` when the bar only repeats the nav; `phoneProfile` puts the profile page in the bottom nav.
- **Tap opens** the card or row; moving/marking is inside it (`Kanban phoneTap="open"`).
- Lists and grids: `grid-cols-[minmax(0,1fr)]` / `min-w-0`, so a row is never wider than the screen.

## Find a part before building one
1. Read `node_modules/@vks-kit/ui/docs/llms.txt` (every part, one line each).
2. Open `node_modules/@vks-kit/ui/docs/ai/<slug>.md` (import line, when to use, code, props).
3. Reuse, then extend (ask for a prop in the kit), then add. Do not copy kit components into the app.

## Checks
- `npx vks-guard src` (or `npm run guard`) must pass before every commit.
- `npx vks-check <dev url> --login <email:pass> --open "<filter button>"` must pass before a screen is called done: it opens the app at 360×640, 390×844 and 1440×900 and fails on anything wider than the screen, sheet buttons below the screen, phone taps under 44 px and console errors (needs `npm i -D playwright`).
- `npm run build` and `npm run typecheck` must pass.

## index.html
Use `<html lang="lo">` and `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />` so Lao line-breaking works properly and bottom nav / sheets pad above the iPhone home bar.

## tsconfig
Use `"lib": ["ES2022", "DOM", "DOM.Iterable"]`, `"moduleResolution": "bundler"`, `"jsx": "react-jsx"`.

## vite.config.ts (dev server)
Charts pull in a CommonJS helper that Vite's dev pre-bundler misses, so the chart page goes blank in `vite` (production builds are fine). Add:
`optimizeDeps: { include: ["@vks-kit/ui > recharts", "@vks-kit/ui > leaflet", "use-sync-external-store/shim/with-selector"] }`

## Updating the kit
Bump the three versions together (`@vks-kit/ui`, `@vks-kit/core`, `@vks-kit/types`, same number), with `VKS_NPM_TOKEN` set (read:packages) run `npm install @vks-kit/ui@x.y.z @vks-kit/core@x.y.z @vks-kit/types@x.y.z`, then `npm run guard && npm run typecheck && npm run build`.
