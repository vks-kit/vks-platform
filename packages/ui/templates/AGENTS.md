# Rules for this app (VKS UI kit consumer)

Copy this file to the root of your app as AGENTS.md.

## House rules
- No raw colours (hex, rgb) or one-off shadows. Use tokens: `bg-primary`, `text-muted-foreground`, `var(--success)`.
- Never import Radix, cva, lucide or sonner directly. Import from `@vks-kit/ui` (icons: `@vks-kit/ui/icons`).
- Heavy parts are lazy subpaths: `@vks-kit/ui/charts`, `/map`, `/kanban`, `/scan`.
- Lao text: line-height >= 1.5, `normalizeLao()` before comparing names. Free text: `cleanText()` before saving.
- Motion: transform/opacity only, <= 400 ms on phones. Touch targets >= 44 px. Inputs 16 px.
- Currency: write "ກີບ", never the symbol.

## Find a part before building one
1. Read `node_modules/@vks-kit/ui/docs/llms.txt` (every part, one line each).
2. Open `node_modules/@vks-kit/ui/docs/ai/<slug>.md` (import line, when to use, code, props).
3. Reuse, then extend (ask for a prop in the kit), then add. Do not copy kit components into the app.

## Checks
- `npm run guard` (runs `vks-guard src`) must pass before every commit.
- `npm run build` and `npm run typecheck` must pass.

## tsconfig
Use `"lib": ["ES2022", "DOM", "DOM.Iterable"]`, `"moduleResolution": "bundler"`, `"jsx": "react-jsx"`.

## vite.config.ts (dev server)
Charts pull in a CommonJS helper that Vite's dev pre-bundler misses, so the chart page goes blank in `vite` (production builds are fine). Add:
`optimizeDeps: { include: ["@vks-kit/ui > recharts", "@vks-kit/ui > leaflet", "use-sync-external-store/shim/with-selector"] }`

## Updating the kit
Bump the three versions together (`@vks-kit/ui`, `@vks-kit/core`, `@vks-kit/types`, same number), with `VKS_NPM_TOKEN` set (read:packages) run `npm install @vks-kit/ui@x.y.z @vks-kit/core@x.y.z @vks-kit/types@x.y.z`, then `npm run guard && npm run typecheck && npm run build`.
