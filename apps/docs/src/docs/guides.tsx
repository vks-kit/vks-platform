import * as React from "react"
import { Pointer, MonitorSmartphone, PanelBottom, PanelBottomOpen, Type, Vibrate, MousePointerClick, ImageDown, Cpu, Signal, ArrowRight, Smartphone, Palette, Zap, Languages, WifiOff, ShieldCheck, RefreshCw, Monitor, Home, ClipboardList, Users, BarChart3, Bell, Plus, Ruler, Move, Timer, Package, Coins, Blocks, Eraser, Tag, Columns2, LayoutGrid, Layers, Maximize2, Hand, MousePointer2, Sparkles, Gauge, Accessibility, Navigation, Check } from "@vks-kit/ui/icons"
import { Button, Card, CardContent, Badge, SuccessCheck, Logo, Tabs, TabsList, TabsTrigger, Slider, toast, useTheme } from "@vks-kit/ui"
import { CodeBlock, H2, H3, P, Code, FeatureCard, FeatureGrid, useT, useTr } from "./kit"
import { BEFORE_AFTER, CHECKLIST, PAGE_QUESTION, RULES } from "./design-thinking"

const Lead = ({ children }: { children: React.ReactNode }) => <p className="text-lg leading-8 text-muted-foreground">{children}</p>
const Next = ({ to, label }: { to: string; label: string }) => <a href={"#/docs/" + to} className="vks-press vks-lift inline-flex min-h-11 items-center gap-2 rounded-xl border bg-card px-4 font-semibold">{label}<ArrowRight className="size-4 text-gold" /></a>

export function Introduction() {
  const t = useT()
  const items = [
    { icon: <Smartphone />, t: t("ມືຖືມາກ່ອນ", "Phone first"), d: t("ສ້າງເພື່ອໂທລະສັບ Android ລາຄາຖືກ. ປຸ່ມ 44 px, bottom sheet, bottom nav.", "Built for cheap Android phones. 44 px targets, bottom sheets, bottom nav.") },
    { icon: <Palette />, t: t("ສອງ theme", "Two themes"), d: t("A (Guard Navy + Gold) ສຳລັບກາງເວັນ. E (Night Watch) ສຳລັບກະກາງຄືນ.", "A (Guard Navy + Gold) for day. E (Night Watch) for night shifts.") },
    { icon: <Languages />, t: t("ພາສາລາວກ່ອນ", "Lao first"), d: t("Noto Sans Lao, line-height 1.7, ຊື່ເດືອນເປັນພາສາລາວ, ເງິນເປັນ ກີບ.", "Noto Sans Lao, line-height 1.7, Lao month names, ກີບ money.") },
    { icon: <WifiOff />, t: t("ໃຊ້ໄດ້ເມື່ອບໍ່ມີເນັດ", "Works offline"), d: t("Offline queue, banner ແລະ page cache ໃນ @vks-kit/core.", "Offline queue, banner and page cache in @vks-kit/core.") },
    { icon: <Zap />, t: t("ຂະໜາດນ້ອຍ", "Small"), d: t("core ~29 KB gzip. Charts, map, kanban ແລະ scan ຈະໂຫຼດເມື່ອໃຊ້ເທົ່ານັ້ນ.", "~29 KB gzip core. Charts, map, kanban and scan load only when used.") },
    { icon: <ShieldCheck />, t: t("ເຂົ້າເຖິງໄດ້ງ່າຍ", "Accessible"), d: t("ໃຊ້ Radix ພາຍໃນ: keyboard, focus ແລະ screen reader ຈັດການໃຫ້ແລ້ວ.", "Radix under the hood: keyboard, focus and screen readers handled.") },
  ]
  return <div className="space-y-6">
    <section className="vks-hero rounded-3xl px-6 py-8 md:px-10 md:py-12">
      <div className="flex flex-col-reverse items-start gap-6 md:flex-row md:items-center">
        <div className="flex-1 space-y-4">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold"><span className="size-1.5 rounded-full bg-gold" />v0.6 · Radix + Tailwind v4</span>
          <h2 className="text-3xl font-bold leading-tight md:text-[2.6rem]">{t("ລະບົບອອກແບບ VKS", "One kit for every guard screen.")}</h2>
          <div className="flex flex-wrap gap-3 pt-1">
            <Button variant="gold" size="lg" asChild><a href="#/docs/installation">{t("ເລີ່ມຕົ້ນ", "Get started")} <ArrowRight /></a></Button>
            <Button size="lg" variant="outline" className="border-white/20 bg-white/5 text-bar-foreground hover:bg-white/10" asChild><a href="#/docs/button">{t("ອົງປະກອບ", "Components")}</a></Button>
          </div>
        </div>
        <Logo className="vks-float-y size-28 vks-logo-lift md:size-44" />
      </div>
    </section>
    <Lead>{t("@vks-kit/ui ແມ່ນຊຸດ component ດຽວສຳລັບທຸກເວັບໄຊ ແລະ ແອັບຂອງ VKS. Radix + Tailwind v4, ໃຊ້ສີຂອງບໍລິສັດ, ປັບໃຫ້ເໝາະກັບເຈົ້າໜ້າທີ່ຮັກສາຄວາມປອດໄພທີ່ເຄື່ອນທີ່ຕະຫຼອດ.", "@vks-kit/ui is the one component set for every VKS website and app. Radix + Tailwind v4, in the company colours, tuned for guards on the move.")}</Lead>
    <H2 id="principles">{t("ຫຼັກການ", "Principles")}</H2>
    <FeatureGrid>{items.map((x) => <FeatureCard key={x.t} icon={x.icon} title={x.t} compact>{x.d}</FeatureCard>)}</FeatureGrid>
    <H2 id="packages">{t("ແພັກເກດ", "Packages")}</H2>
    <div className="overflow-x-auto rounded-xl border"><table className="w-full min-w-[480px] text-sm"><tbody>{[["@vks-kit/ui", t("Component, theme, animation", "Components, theme, animations")], ["@vks-kit/ui/charts · /map · /kanban · /scan", t("ສ່ວນໜັກ, ແຍກ entry point ຕ່າງຫາກ", "Heavy parts, separate entry points")], ["@vks-kit/core", t("Offline queue, haptics, i18n t(en, lo), fmtKip, ຍ່ອຮູບ, PWA, geo", "Offline queue, haptics, i18n t(en, lo), fmtKip, photo shrink, PWA, geo")], ["@vks-kit/types", t("Zod schema ທີ່ໃຊ້ຮ່ວມກັນລະຫວ່າງ browser ແລະ Worker; cleanText, normalizeLao", "Zod schemas shared by browser and Worker; cleanText, normalizeLao")]].map(([a, b]) => <tr key={a} className="border-t first:border-0"><td className="px-4 py-2.5 font-mono text-[13px] font-semibold">{a}</td><td className="px-4 py-2.5 text-muted-foreground">{b}</td></tr>)}</tbody></table></div>
    <H2 id="quick-start">{t("ເລີ່ມໄວ", "Quick start")}</H2>
    <CodeBlock code={`import { Button, toast } from "@vks-kit/ui"

export function ScanDone() {
  return <Button variant="action" onClick={() => toast.success("ສະແກນແລ້ວ")}>ສະແກນ</Button>
}`} />
    <div className="flex flex-wrap gap-3 pt-2"><Next to="installation" label={t("ການຕິດຕັ້ງ", "Installation")} /><Next to="button" label={t("ເບິ່ງ component ທັງໝົດ", "Browse components")} /></div>
  </div>
}

export function Installation() {
  const t = useT()
  return <div className="space-y-6">
    <Lead>{t("ແອັບໃໝ່ຢູ່ແຍກຈາກ monorepo ນີ້ ແລະ ຕິດຕັ້ງຊຸດ @vks-kit ຈາກ GitHub Packages (private). ບໍ່ຕ້ອງ copy-paste component. (ຖ້າພັດທະນາພາຍໃນ monorepo ນີ້, ເບິ່ງພາກ Monorepo ດ້ານລຸ່ມ.)", "A standalone app lives outside this monorepo and installs @vks-kit packages from GitHub Packages (private). No copy-paste of components. (Contributing inside this monorepo? See the Monorepo section below.)")}</Lead>
    <H2 id="registry">{t("1 · ເຊື່ອມຕໍ່ registry", "1 · Connect to the registry")}</H2>
    <P>{t("ສ້າງ token (classic) ທີ່ມີສິດ read:packages ແລ້ວຕັ້ງເປັນຕົວແປ VKS_NPM_TOKEN ໃນ shell ກ່ອນແລ່ນ npm install. ຢ່າໃສ່ token ລົງໃນໄຟລ໌.", "Create a classic token with read:packages and export VKS_NPM_TOKEN in your shell before running npm install. Never hardcode a token into any file.")}</P>
    <CodeBlock lang="bash" code={`# .npmrc (commit this to your app root — it holds no secret)
@vks-kit:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=\${VKS_NPM_TOKEN}

# macOS / Linux (bash/zsh)
export VKS_NPM_TOKEN=ghp_your_read_packages_token

# Windows PowerShell
$env:VKS_NPM_TOKEN="ghp_your_read_packages_token"`} />
    <H2 id="new-app">{t("2 · ສ້າງແອັບໃໝ່ ແລະ ຕິດຕັ້ງ", "2 · Create app & install")}</H2>
    <CodeBlock lang="bash" code={`npm create vite@latest my-app -- --template react-ts
cd my-app
npm install @vks-kit/ui @vks-kit/core @vks-kit/types
npx vks-guard src        # house-rule check, run before every commit`} />
    <H2 id="vite">{t("3 · Vite + Tailwind (optimizeDeps)", "3 · Vite + Tailwind (optimizeDeps)")}</H2>
    <P>{t("ໃນ vite dev ໜ້າ chart ແລະ map ອາດຂາວ ເພາະ Vite pre-bundler ຂ້າມ CommonJS helper; ເພີ່ມ optimizeDeps ໃນ vite.config.ts ດັ່ງລຸ່ມນີ້.", "In vite dev, chart and map pages can render blank because Vite's pre-bundler misses a CommonJS helper; include optimizeDeps in vite.config.ts as shown below.")}</P>
    <CodeBlock code={`// vite.config.ts
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  plugins: [react(), tailwindcss()],
  optimizeDeps: {
    include: [
      "@vks-kit/ui > recharts",
      "@vks-kit/ui > leaflet",
      "use-sync-external-store/shim/with-selector",
    ],
  },
})`} />
    <H2 id="css">{t("4 · CSS ໜຶ່ງແຖວ", "4 · One CSS line")}</H2>
    <CodeBlock lang="css" code={`/* src/index.css */
@import "@vks-kit/ui/theme.css";   /* VKS logo tokens, Noto Sans Lao, animations, print */`} />
    <H2 id="root">{t("5 · ຄອບ root", "5 · Wrap the root")}</H2>
    <CodeBlock code={`import { ThemeProvider, TooltipProvider, Toaster } from "@vks-kit/ui"

createRoot(root).render(
  <ThemeProvider>
    <TooltipProvider>
      <App />
      <Toaster />
    </TooltipProvider>
  </ThemeProvider>,
)`} />
    <H2 id="html">{t("6 · index.html (ພາສາລາວ ແລະ safe-area)", "6 · Complete index.html (Lao + safe-area)")}</H2>
    <CodeBlock lang="html" code={`<!doctype html>
<html lang="lo">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <meta name="theme-color" content="#16173a" />
    <title>VKS App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`} />
    <P>{t("viewport-fit=cover ເຮັດໃຫ້ bottom nav ແລະ sheet ຢູ່ເໜືອແຖບ home ຂອງ iPhone ດ້ວຍ safe-area padding, ແລະ lang=\"lo\" ຊ່ວຍໃຫ້ browser ຕັດຄຳພາສາລາວໄດ້ຖືກຕ້ອງ.", "viewport-fit=cover lets the bottom nav and sheets sit above the iPhone home bar with safe-area padding, and lang=\"lo\" enables proper Lao line-breaking.")}</P>
    <H2 id="monorepo">{t("ການພັດທະນາໃນ Monorepo (vks-platform)", "Monorepo development (vks-platform)")}</H2>
    <P>{t("ຖ້າທ່ານເຮັດວຽກຢູ່ໃນ repo vks-platform ໂດຍກົງ (ບໍ່ແມ່ນແອັບພາຍນອກ), npm workspaces ຈະເຊື່ອມ packages/ui, packages/core ແລະ packages/types ໃຫ້ອັດຕະໂນມັດໂດຍບໍ່ຕ້ອງໃຊ້ VKS_NPM_TOKEN.", "When developing directly inside the vks-platform monorepo (rather than a standalone app), npm workspaces link packages/ui, packages/core and packages/types locally without VKS_NPM_TOKEN.")}</P>
    <CodeBlock lang="bash" code={`npm install              # links workspaces locally
npm run dev              # gallery at http://localhost:5199
npm run dev:docs         # docs at http://localhost:5200
npm run ai:index         # regenerate llms.txt + docs/ai/*.md after docs/UI changes
npm test                 # runs unit tests + monorepo guardrails`} />
    <H2 id="rules">{t("ກົດ (AGENTS.md)", "Rules (AGENTS.md)")}</H2>
    <FeatureGrid>
      <FeatureCard icon={<Palette />} title={t("ໃຊ້ token ເທົ່ານັ້ນ", "Tokens only")} index={0} compact>{t("ຫ້າມໃຊ້ສີດິບໃນແອັບ. ໃຊ້", "No raw colours in apps. Use")} <Code>bg-primary</Code>, <Code>text-muted-foreground</Code>, <Code>var(--success)</Code>.</FeatureCard>
      <FeatureCard icon={<Package />} title={t("ທາງເຂົ້າດຽວ", "One entry point")} index={1} compact>{t("import Radix, icon ແລະ toast ຜ່ານ", "Import Radix, icons and toasts only through")} <Code>@vks-kit/ui</Code> {t("ແລະ", "and")} <Code>@vks-kit/ui/icons</Code> {t("ເທົ່ານັ້ນ.", "only.")}</FeatureCard>
      <FeatureCard icon={<Blocks />} title={t("ສ່ວນໃໝ່, ການປ່ຽນດຽວກັນ", "New part, same change")} index={2} compact>{t("ໃນ monorepo: ເພີ່ມໃສ່ packages/ui, gallery ແລະ docs ນີ້ພ້ອມກັນ, ແລ້ວແລ່ນ", "In the monorepo: add it to packages/ui, the gallery and these docs together, then")} <Code>npm run ai:index</Code>.</FeatureCard>
      <FeatureCard icon={<Eraser />} title={t("ທຳຄວາມສະອາດຂໍ້ຄວາມ", "Clean the text")} index={3} compact>{t("ແລ່ນ", "Run")} <Code>cleanText()</Code> {t("ກັບຂໍ້ຄວາມອິດສະຫຼະ;", "on free text;")} <Code>normalizeLao()</Code> {t("ກ່ອນປຽບທຽບຊື່.", "before comparing names.")}</FeatureCard>
    </FeatureGrid>
    <div className="pt-2"><Next to="theming" label={t("Theming", "Theming")} /></div>
  </div>
}

/** Documentation only: shown as text in a code block, not used as styles. */
const LIGHT = [["background", "#f5f6f9"], ["foreground / primary", "#16173a"], ["card", "#ffffff"], ["muted", "#eceef4"], ["muted-foreground", "#4b4f6b"], ["gold", "#b6924b"], ["gold-tint", "#f8f3e8"], ["success", "#047857"], ["warning", "#9a4307"], ["destructive", "#b91c1c"]]
const TOKENS = ["background", "card", "primary", "muted", "accent", "gold", "gold-tint", "success", "warning", "destructive", "border", "bar", "chart-1", "chart-2", "chart-3", "chart-4", "chart-5"]
export function Theming() {
  const { theme, setTheme } = useTheme()
  const t = useT()
  return <div className="space-y-6">
    <Lead>{t("ສີທັງໝົດຖອດແບບຈາກໂລໂກ້ VKS ແລະ ຢູ່ໃນໄຟລ໌ດຽວ: ", "All colour is derived from the official VKS logo and lives in one file: ")}<Code>packages/ui/src/styles/theme.css</Code>{t(". ມີສອງ theme ທີ່ໃຊ້ຊື່ token ດຽວກັນ, ທຸກ component ຈຶ່ງປ່ຽນຕາມໂດຍອັດຕະໂນມັດ.", ". Two themes, same token names, so every component flips for free.")}</Lead>
    <div className="grid gap-3 sm:grid-cols-2">
      {([["light", "A · Guard Navy + Gold", t("ກະກາງເວັນ, ຫ້ອງການ, ລາຍງານ.", "Day shift, office, reports.")], ["dark", "E · Night Watch", t("ກະກາງຄືນ, ປະຫຍັດແບັດເຕີຣີ, ຫ້ອງມືດ.", "Night shift, battery saver, dark rooms.")]] as const).map(([k, name, d]) => (
        <button key={k} onClick={() => setTheme(k)} className={"vks-press rounded-xl border-2 p-4 text-left " + (theme === k ? "border-gold" : "border-border")}>
          <div className="flex items-center justify-between"><b>{name}</b>{theme === k && <Badge variant="gold">{t("ກຳລັງໃຊ້", "active")}</Badge>}</div>
          <p className="text-sm text-muted-foreground">{d}</p>
        </button>))}
    </div>
    <H2 id="tokens">{t("Token ສົດ", "Live tokens")}</H2>
    <P>{t("ຕົວຢ່າງສີເຫຼົ່ານີ້ອ່ານ CSS variable ໂດຍກົງ. ສະຫຼັບ theme ແລ້ວເບິ່ງການປ່ຽນແປງ.", "These swatches read the CSS variables directly. Switch the theme and watch them change.")}</P>
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">{TOKENS.map((t) => <div key={t} className="overflow-hidden rounded-lg border"><div className="h-12" style={{ background: "var(--" + t + ")" }} /><div className="px-2 py-1 font-mono text-[12px]">--{t}</div></div>)}</div>
    <H2 id="usage">{t("ໃຊ້ token, ບໍ່ແມ່ນສີ", "Use tokens, not colours")}</H2>
    <CodeBlock code={`// ✓ good
<div className="bg-card text-muted-foreground border-border" />
<header className="bg-bar text-bar-foreground" />

// ✗ never in apps/
<div className="bg-[#16173a]" style={{ color: "#b6924b" }} />`} />
    <H2 id="css-vars">{t("CSS variable", "CSS variables")}</H2>
    <CodeBlock lang="css" code={":root {\n" + LIGHT.map(([k, v]) => "  --" + k.split(" ")[0] + ": " + v + ";").join("\n") + `
  --radius: 0.75rem;
}

.dark {
  --background: #0c0d24;
  --card: #16173a;          /* exact VKS logo navy */
  --primary: #d8bf8c;       /* exact VKS laurel gold */
  --foreground: #f1f1f4;    /* exact VKS logo field */
  --muted-foreground: #a8acc7;
  --success: #34d399;
  --warning: #fbbf24;
  --destructive: #f87171;
}`} />
    <H2 id="gold">{t("ກົດຂອງສີທອງ", "The gold rule")}</H2>
    <P>{t("ສີທອງໃຊ້ສຳລັບເສັ້ນ, ວົງແຫວນ, icon ແລະ ຮູບຮ່າງໃຫຍ່. ຫ້າມໃຊ້ຕົວໜັງສືສີທອງຂະໜາດນ້ອຍເທິງພື້ນຂາວ: contrast ບໍ່ພໍ. ໃຫ້ໃຊ້", "Gold is for lines, rings, icons and big shapes. Never small gold text on white: it fails contrast. Use")} <Code>text-foreground</Code> {t("ເທິງພື້ນສີທອງອ່ອນແທນ (", "on a gold tint instead (")}{t("ເຊິ່ງເປັນສິ່ງທີ່", "that is what")} <Code>Badge variant="gold"</Code> {t("ເຮັດ).", "does).")}</P>
    <H2 id="toggle">{t("ປຸ່ມສະຫຼັບ theme", "Theme toggle")}</H2>
    <CodeBlock code={`const { theme, setTheme } = useTheme()
<Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} />
// stored in localStorage "vks-theme", sets .dark on <html>`} />
  </div>
}

export function Typography() {
  const t = useT()
  return <div className="space-y-6">
    <Lead>{t("ຟອນດຽວສຳລັບລາວ ແລະ ອັງກິດ: Noto Sans Lao Variable, host ເອງ (ບໍ່ເອີ້ນ Google Fonts, ໃຊ້ໄດ້ເມື່ອບໍ່ມີເນັດ).", "One font for Lao and English: Noto Sans Lao Variable, self-hosted (no Google Fonts call, works offline).")}</Lead>
    <H2 id="scale">{t("ຂະໜາດ", "Scale")}</H2>
    <div className="divide-y overflow-hidden rounded-2xl border bg-card">
      {([["text-3xl font-bold leading-snug", "ລາຍງານປະຈຳວັນ", "Display", "30 / 1.35 · 700", t("ຫົວຂໍ້ໃຫຍ່", "Display")], ["text-xl font-bold leading-snug", "ຈຸດກວດທີ່ພາດ", "Heading", "20 / 1.35 · 700", t("ຫົວຂໍ້", "Heading")], ["text-base leading-relaxed", "ພະນັກງານສະແກນຄົບທຸກຈຸດໃນກະກາງເວັນ.", "Body", "16 / 1.625 · 400", t("ເນື້ອຄວາມ", "Body")], ["text-sm leading-normal text-muted-foreground", "ອັບເດດລ່າສຸດ 08:12", "Muted", "14 / 1.5 · 400", t("ຂໍ້ຄວາມຈາງ", "Muted")], ["text-xs font-semibold leading-normal", "ຄິວ 3", "Label", "12 / 1.5 · 600", t("ປ້າຍ", "Label")]] as const).map(([c, s, n, m, label]) =>
        <div key={n} className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-center sm:gap-6"><div className="w-32 shrink-0"><p className="text-sm font-semibold leading-normal">{label}</p><p className="font-mono text-xs text-muted-foreground">{m}</p></div><p className={"min-w-0 flex-1 " + c}>{s}</p></div>)}
    </div>
    <H2 id="weights">{t("ນ້ຳໜັກຕົວອັກສອນ", "Weights")}</H2>
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{([[400, t("ປົກກະຕິ", "Regular"), "font-normal"], [500, t("ປານກາງ", "Medium"), "font-medium"], [600, t("ເຄິ່ງໜາ", "Semibold"), "font-semibold"], [700, t("ໜາ", "Bold"), "font-bold"]] as const).map(([w, n, c]) =>
      <div key={w} className="rounded-2xl border bg-card p-4"><p className={"text-3xl leading-snug " + c}>ກຂ Aa</p><p className="mt-2 text-sm font-semibold leading-normal">{n}</p><p className="font-mono text-xs text-muted-foreground">{w}</p></div>)}</div>
    <H2 id="line-height">{t("ເປັນຫຍັງພາສາລາວຕ້ອງການພື້ນທີ່", "Why Lao needs the room")}</H2>
    <P>{t("ປະໂຫຍກດຽວກັນ, ສອງ line-height. ທີ່ 1.2 ວັນນະຍຸດຂອງແຖວໜຶ່ງຈະຊົນກັບສະຫຼະຂອງແຖວຂ້າງເທິງ.", "Same sentence, two line-heights. At 1.2 the tone marks of one line crowd the vowels of the line above.")}</P>
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="rounded-2xl border border-destructive/40 bg-destructive/5 p-4"><p className="mb-2 text-xs font-bold uppercase tracking-wide text-destructive">{t("1.2 · ແໜ້ນເກີນໄປ", "1.2 · too tight")}</p><p className="text-base" style={{ lineHeight: 1.2 }}>ພະນັກງານຕ້ອງສະແກນ QR ທຸກຈຸດກ່ອນໝົດກະ ແລະ ລາຍງານເຫດການທີ່ພົບເຫັນໃຫ້ຫົວໜ້າຮູ້ທັນທີ.</p></div>
      <div className="rounded-2xl border border-success/40 bg-success/5 p-4"><p className="mb-2 text-xs font-bold uppercase tracking-wide text-success">{t("1.7 · ຄ່າເລີ່ມຕົ້ນຂອງເຮົາ", "1.7 · house default")}</p><p className="text-base" style={{ lineHeight: 1.7 }}>ພະນັກງານຕ້ອງສະແກນ QR ທຸກຈຸດກ່ອນໝົດກະ ແລະ ລາຍງານເຫດການທີ່ພົບເຫັນໃຫ້ຫົວໜ້າຮູ້ທັນທີ.</p></div>
    </div>
    <H2 id="lao">{t("ກົດຂອງພາສາລາວ", "Lao rules")}</H2>
    <FeatureGrid>
      <FeatureCard icon={<Ruler />} value="≥ 1.5" title="Line-height" index={0}>{t("ເນື້ອຄວາມໃຊ້ 1.7, ຫ້າມຕ່ຳກວ່າ 1.5. ວັນນະຍຸດຢູ່ເທິງ ແລະ ສະຫຼະຢູ່ລຸ່ມຕ້ອງການພື້ນທີ່.", "Body is 1.7, never below 1.5. Tone marks above and vowels below need the room.")}</FeatureCard>
      <FeatureCard icon={<Type />} value="16 px" title={t("ຕົວອັກສອນໃນ input", "Input text")} index={1}>{t("Input ຕ້ອງມີຢ່າງໜ້ອຍ 16 px, ບໍ່ດັ່ງນັ້ນ iOS ຈະຊູມໜ້າເມື່ອ focus.", "Inputs are 16 px minimum, or iOS zooms the page on focus.")}</FeatureCard>
      <FeatureCard icon={<Languages />} value="ຄຳ ≠ ຄໍາ" title={t("Normalise ກ່ອນປຽບທຽບ", "Normalise before comparing")} index={2}>{t("ເກັບ ແລະ ປຽບທຽບພາສາລາວດ້ວຍ", "Store and compare Lao with")} <Code>normalizeLao()</Code>{t(". ທັງສອງເບິ່ງຄືກັນ ແຕ່ເປັນ code point ຕ່າງກັນ.", ". The two look the same but are different code points.")}</FeatureCard>
      <FeatureCard icon={<Coins />} value="ກີບ" title={t("ເງິນ", "Money")} index={3}><Code>fmtKip(1250000)</Code>{t(" → 1,250,000 ກີບ. ຫ້າມໃຊ້ ₭.", " → 1,250,000 ກີບ. Never ₭.")}</FeatureCard>
      <FeatureCard icon={<Tag />} value="t(en, lo)" title={t("ຂໍ້ຄວາມສອງພາສາ", "Bilingual strings")} index={4}><Code>t("Save", "ບັນທຶກ")</Code>{t(" ຈາກ @vks-kit/core ຈະເລືອກພາສາຂອງຜູ້ໃຊ້.", " from @vks-kit/core picks the user's language.")}</FeatureCard>
    </FeatureGrid>
  </div>
}

const MOTION: [string, string, string][] = [
  ["vks-press", "Buttons shrink to 96 % on tap", "Every Button"], ["vks-fade-up", "Enter from 6 px below", "Page content"], ["vks-stagger", "Children fade in 40 ms apart (--i)", "Lists"],
  ["vks-pop", "Scale in with a tiny overshoot", "Chips, icons"], ["vks-bounce-in", "Rise and settle", "Success cards"], ["vks-shake", "Left-right shake", "Wrong input"],
  ["vks-wiggle", "Bell swing", "New alerts"], ["vks-pulse", "Breathing dot", "Live / on duty"], ["vks-swipe-hint", "Nudge right 3×", "Swipe rows"],
  ["vks-shine", "One light sweep", "Logo on login"], ["vks-ripple", "Gold ring spreading", "Scan target"], ["vks-shimmer", "Loading shimmer", "Skeleton"],
]
function MotionTile({ cls, label, use }: { cls: string; label: string; use: string }) {
  const [k, setK] = React.useState(0)
  const t = useT(), tr = useTr()
  const shape = cls === "vks-shimmer" ? <div key={k} className="vks-shimmer h-10 w-28 rounded-lg" /> : cls === "vks-stagger" ? <div key={k} className="vks-stagger flex gap-1">{[0, 1, 2, 3].map((i) => <span key={i} className="size-6 rounded bg-primary" style={{ "--i": i } as React.CSSProperties} />)}</div> : cls === "vks-press" ? <Button size="sm">{tr("Press me")}</Button> : <div key={k} className={cls + " relative size-12 rounded-xl bg-primary"} />
  return <Card><CardContent className="flex flex-col items-center gap-3 pt-5 text-center"><div className="flex h-16 items-center">{shape}</div><code className="font-mono text-[13px] font-semibold">.{cls}</code><p className="text-xs text-muted-foreground">{tr(label)} · {tr(use)}</p><Button size="sm" variant="ghost" onClick={() => setK(k + 1)}><RefreshCw />{t("ຫຼິ້ນຄືນ", "Replay")}</Button></CardContent></Card>
}
export function Motion() {
  const [k, setK] = React.useState(0)
  const t = useT()
  return <div className="space-y-6">
    <Lead>{t("ນ້ອຍ, ໄວ ແລະ ເບົາ. ມີແຕ່ transform ແລະ opacity ທີ່ເຄື່ອນ, ບໍ່ມີຫຍັງດົນເກີນ 400 ms, ແລະ ທຸກຢ່າງຢຸດສຳລັບຜູ້ທີ່ເປີດ \"reduce motion\".", "Small, quick and cheap. Only transform and opacity move, nothing runs longer than 400 ms, and everything stops for people who turned on \"reduce motion\".")}</Lead>
    <H2 id="classes">{t("Class", "Classes")}</H2>
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3">{MOTION.map(([c, l, u]) => <MotionTile key={c} cls={c} label={l} use={u} />)}</div>
    <H2 id="success">{t("ຈັງຫວະສະແກນສຳເລັດ", "The scan success moment")}</H2>
    <P>{t("ເຄື່ອງໝາຍເດັ່ງຂຶ້ນ, ຂີດຖືກຖືກວາດ, ໂທລະສັບສັ່ນ 50-20-50 ms. ນີ້ແມ່ນຊ່ວງດຽວທີ່ຍາມຄວນຮູ້ສຶກໄດ້.", "Check pops, tick draws, phone buzzes 50-20-50 ms. This is the one moment guards should feel.")}</P>
    <div className="flex flex-wrap items-center gap-4 rounded-xl border bg-card p-6"><SuccessCheck key={k} /><Button variant="action" onClick={() => { setK(k + 1); toast.success("ສະແກນແລ້ວ") }}>{t("ສະແກນ", "Scan")}</Button></div>
    <CodeBlock code={`<SuccessCheck />
toast.success("ສະແກນແລ້ວ")   // buzz included`} />
    <H2 id="rules">{t("ກົດ", "Rules")}</H2>
    <FeatureGrid>
      <FeatureCard icon={<Move />} value={t("2 prop", "2 props")} title="Transform + opacity" index={0}>{t("GPU ເຄື່ອນສອງຢ່າງນີ້ໃຫ້ຟຣີ ຈຶ່ງລື່ນໄຫຼເທິງມືຖືລາຄາຖືກ.", "The GPU moves these for free, so they stay smooth on cheap phones.")}</FeatureCard>
      <FeatureCard icon={<Timer />} value="≤ 400 ms" title={t("ສັ້ນ, ease-out", "Short, ease-out")} index={1}>{t("ຕອບສະໜອງການແຕະ 100-150 ms, ສະແດງ/ເຊື່ອງ 200-300 ms, ໜ້າ ແລະ sheet ສູງສຸດ 400 ms.", "Tap feedback 100-150 ms, show/hide 200-300 ms, pages and sheets up to 400 ms.")}</FeatureCard>
      <FeatureCard icon={<MousePointerClick />} value="Hover" title={t("hover ຈິງເທົ່ານັ້ນ", "Only real hover")} index={2}>{t("ຍົກຂຶ້ນຕອນ hover ສະເພາະໃນ ", "Lift on hover only inside ")}<Code>@media (hover: hover)</Code>{t(". ມືຖືບໍ່ເຄີຍເຫັນ.", ". Phones never see it.")}</FeatureCard>
      <FeatureCard icon={<ClipboardList />} value={t("8 ແຖວ", "8 rows")} title={t("ຈຳກັດ stagger", "Stagger cap")} index={3}>{t("ສະເພາະ 8 ລາຍການທຳອິດທີ່ stagger. ລາຍການຍາວປາກົດພ້ອມກັນ.", "Only the first 8 items stagger. Long lists appear at once.")}</FeatureCard>
    </FeatureGrid>
  </div>
}

type Rule = { v: string; t: string; d: React.ReactNode; I: React.ComponentType<{ className?: string }> }
const getMobileRules = (t: (lo: string, en: string) => string): Rule[] => [
  { v: "44 px", t: "Touch target", I: Pointer, d: <>{t("ທຸກປຸ່ມ, input, ແຖວລາຍການ ແລະ ປຸ່ມໄອຄອນຢ່າງໜ້ອຍ 44 × 44 px ເຖິງແມ່ນໄອຄອນເບິ່ງນ້ອຍກວ່າ.", "Every button, input, list row and icon button is at least 44 × 44 px, even when the icon looks smaller.")}</> },
  { v: "768 px", t: "One breakpoint", I: MonitorSmartphone, d: <>{t("ຕ່ຳກວ່ານີ້: bottom nav, sheet ແລະ ກາດ. ສູງກວ່ານີ້: sidebar, dialog ແລະ ຕາຕະລາງ. ບໍ່ມີ breakpoint ອື່ນ.", "Below it: bottom nav, sheets and cards. Above it: sidebar, dialogs and tables. No other breakpoints.")}</> },
  { v: "≤ 5 tabs", t: "Bottom nav", I: PanelBottom, d: <>{t("ໃສ່ໄດ້ເຖິງ 5 ແຖບ. ຖ້າຫຼາຍກວ່ານັ້ນ ສະແດງ 4 ແຖບ ແລະ ແຖບ ", "Up to 5 tabs fit. With more, show 4 tabs and a ")}<b className="font-semibold text-foreground">More</b>{t("." , " tab.")}</> },
  { v: "Bottom", t: "Sheets first", I: PanelBottomOpen, d: <>{t("Dialog, picker ແລະ ເມນູເປີດເປັນ bottom sheet ເທິງມືຖື ບ່ອນທີ່ໂປ້ມືຢູ່ແລ້ວ.", "Dialogs, pickers and menus open as bottom sheets on a phone, where the thumb already is.")}</> },
  { v: "Safe areas", t: "Notch & home bar", I: Smartphone, d: <>{t("Header, bottom nav, FAB ແລະ sheet ເວັ້ນໄລຍະຈາກ notch ແລະ home bar. ບໍ່ມີຫຍັງຖືກບັງ.", "Header, bottom nav, FAB and sheets pad for the notch and the home bar. Nothing hides under them.")}</> },
  { v: "16 px", t: "Input text", I: Type, d: <>{t("Input ໃຊ້ຕົວອັກສອນ 16 px ຂຶ້ນໄປ. ນ້ອຍກວ່ານັ້ນ iPhone ຈະຊູມເຂົ້າຕອນ focus.", "Inputs use 16 px text or larger. Smaller text makes iPhone zoom in on focus.")}</> },
  { v: "Offline", t: "Never lose a scan", I: WifiOff, d: <>{t("ຈັດຄິວການບັນທຶກດ້ວຍ ", "Queue writes with ")}<Code>OfflineQueue</Code>{t(" ແລະ ສະແດງ ", " and show ")}<Code>OfflineBanner</Code>{t(". ສົ່ງເມື່ອມີສັນຍານຄືນ.", ". Send when the signal is back.")}</> },
  { v: "Haptics", t: "Feel the result", I: Vibrate, d: <><Code>toast.success</Code>{t(" ແລະ ", " and ")}<Code>toast.error</Code>{t(" ສັ່ນເທິງ Android. iPhone ຂ້າມໄປຢ່າງງຽບໆ.", " buzz on Android. iPhone ignores it silently.")}</> },
  { v: "No hover", t: "Tap, don't hover", I: MousePointerClick, d: <>{t("ມືຖືບໍ່ມີ hover. ຂອງສຳຄັນຢ່າຢູ່ໃນ tooltip ຢ່າງດຽວ; ໃຊ້ label ຫຼື ກາດທີ່ແຕະໄດ້.", "Phones have no hover. Nothing important may live only in a tooltip; use the label or a tap card.")}</> },
  { v: "1280 px", t: "Small photos", I: ImageDown, d: <>{t("ຫຍໍ້ເປັນ 1280 px, JPEG 70 % ກ່ອນອັບໂຫຼດ. ", "Shrink to 1280 px, 70 % JPEG before upload. ")}<Code>PhotoCapture</Code>{t(" ເຮັດໃຫ້ອັດຕະໂນມັດ.", " does it for you.")}</> },
]

export function MobileRules() {
  const t = useT(), tr = useTr()
  return <div className="space-y-8">
    <Lead>{t("ຜູ້ໃຊ້ VKS ສ່ວນໃຫຍ່ແມ່ນຍາມທີ່ໃຊ້ Android ລາຄາຖືກ ແລະ ເນັດມືຖືບໍ່ສະເໝີ. ກົດເຫຼົ່ານີ້ມາກ່ອນ; ຄອມພິວເຕີແມ່ນສ່ວນເສີມ.", "Most VKS users are guards on low-cost Android phones and patchy mobile data. These rules come first; desktop is the extra.")}</Lead>
    <FeatureGrid>{getMobileRules(t).map(({ v, t: title, d, I }, i) => <FeatureCard key={v} icon={<I />} value={v} title={tr(title)} index={i}>{d}</FeatureCard>)}</FeatureGrid>
    <H2 id="check">{t("ກວດໜ້າເທິງໂທລະສັບ", "Check a page on a phone")}</H2>
    <P>{t("Chrome DevTools → device toolbar, ແລ້ວຕັ້ງສາມຢ່າງນີ້. ຖ້າຮູ້ສຶກດີຢູ່ນີ້ ກໍດີເທິງໂທລະສັບຂອງຍາມ.", "Chrome DevTools → device toolbar, then set these three. If it feels good here, it feels good on a guard's phone.")}</P>
    <FeatureGrid cols={3}>{([[Smartphone, "360 × 740", "Common cheap Android"], [Signal, "Slow 4G", "Network throttling"], [Cpu, "4× slowdown", "CPU throttling"]] as const).map(([I, a, b]) => <FeatureCard key={a} icon={<I />} title={tr(a)} compact>{tr(b)}</FeatureCard>)}</FeatureGrid>
  </div>
}


/* ------------------------------------------------------------------ Layout rules */
const RAIL = [<Home key="a" />, <ClipboardList key="b" />, <Users key="c" />, <BarChart3 key="d" />, <Bell key="e" />]
/** Schematic of the same page at two widths. Everything is a token-coloured block; switching morphs the pieces. */
function Anatomy({ mode, rail }: { mode: "desktop" | "mobile"; rail: boolean }) {
  const d = mode === "desktop"
  return <div key={mode} className="vks-morph-in mx-auto overflow-hidden rounded-2xl border-[6px] border-bar bg-background shadow-xl" style={{ width: d ? "100%" : 260, maxWidth: "100%", height: d ? 320 : 460 }}>
    <div className="flex h-full">
      {d && <aside data-collapsed={rail} className={"vks-rail vks-rise-x flex shrink-0 flex-col gap-1.5 overflow-hidden bg-bar p-2 text-bar-foreground " + (rail ? "w-12" : "w-40")}>
        <div className="mb-1 flex h-8 items-center gap-2 px-1"><Logo className="size-6 shrink-0" /><b className="vks-rail-fade whitespace-nowrap text-xs">VKS QC</b></div>
        {RAIL.map((ic, i) => <div key={i} style={{ ["--i" as string]: i } as React.CSSProperties} className={"flex h-7 items-center gap-2 rounded-lg px-2 [&_svg]:size-3.5 [&_svg]:shrink-0 " + (i === 0 ? "bg-bar-foreground/[.12] text-gold" : "opacity-60")}>{ic}<span className="vks-rail-fade h-1.5 w-16 rounded-full bg-bar-foreground/40" /></div>)}
      </aside>}
      <div className="relative flex min-w-0 flex-1 flex-col">
        <div className="vks-glass flex h-10 shrink-0 items-center gap-2 border-b border-border/60 px-3"><span className="h-2 w-20 rounded-full bg-foreground/70" /><span className="ml-auto h-6 w-14 rounded-md bg-primary" /></div>
        <div className="vks-stagger grid flex-1 content-start gap-2 p-3" style={{ gridTemplateColumns: d ? "repeat(3, minmax(0,1fr))" : "1fr" }}>
          {Array.from({ length: d ? 6 : 4 }, (_, i) => <div key={i} style={{ ["--i" as string]: i } as React.CSSProperties} className="h-16 rounded-xl border bg-card p-2"><span className="block h-1.5 w-1/2 rounded-full bg-muted-foreground/40" /><span className="mt-2 block h-3 w-1/3 rounded bg-foreground/70" /></div>)}
        </div>
        {!d && <>
          <span className="vks-pop absolute bottom-16 right-3 flex size-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg [&_svg]:size-5"><Plus /></span>
          <div className="vks-glass vks-nav-up flex h-12 shrink-0 items-center justify-around border-t border-border/60">{RAIL.map((ic, i) => <span key={i} className={"flex h-7 w-10 items-center justify-center rounded-full [&_svg]:size-4 " + (i === 0 ? "bg-primary/10 text-foreground" : "text-muted-foreground")}>{ic}</span>)}</div>
        </>}
      </div>
    </div>
  </div>
}

/** Plays one easing curve on a dot so people can feel the difference. */
function EaseLane({ name, ms, use }: { name: string; ms: number; use: string }) {
  const [on, setOn] = React.useState(false)
  const tr = useTr()
  return <button onClick={() => setOn(!on)} className="vks-press flex w-full flex-col gap-2 rounded-xl border bg-card p-3 text-left">
    <div className="flex items-baseline justify-between gap-2"><code className="font-mono text-[13px] font-semibold">--{name}</code><span className="text-xs text-muted-foreground">{ms} ms · {tr(use)}</span></div>
    <div className="relative h-8 rounded-lg bg-muted px-1"><div className="relative h-full w-[calc(100%-1.5rem)]" style={{ transform: on ? "translateX(100%)" : "none", transition: `transform ${ms}ms var(--${name})` }}><span className="absolute left-0 top-1 size-6 rounded-md bg-primary" /></div></div>
  </button>
}

export function LayoutRules() {
  const t = useT(), tr = useTr()
  const [mode, setMode] = React.useState<"desktop" | "mobile">("desktop")
  const [rail, setRail] = React.useState(false)
  const [w, setW] = React.useState([1024])
  const phone = w[0] < 768
  const rules: [string, string, React.ReactNode][] = [
    ["768 px", "The one breakpoint. Tailwind md:. JS: useIsMobile(). Never add a second one for layout.", <Columns2 />],
    ["Desktop", "Navy Sidebar (240 px, collapses to 72 px), sticky glass header, content max 1200 px, tables and dialogs.", <Monitor />],
    ["Mobile", "Bottom nav (≤ 5 tabs, else 4 + More), FAB bottom-right above the nav, cards not tables, bottom sheets.", <Smartphone />],
    ["Same page", "One component tree. Pieces swap at 768 px (Sidebar ↔ BottomNav, Dialog ↔ Sheet, HoverCard ↔ Sheet). No separate phone pages.", <Layers />],
    ["Spacing", "16 px page padding on a phone, 24 px on desktop. Gap 8/12/16. Cards radius 12-16 px.", <LayoutGrid />],
    ["44 px", "Every tap target on every width. Rail items and bottom tabs are 44-60 px tall.", <Pointer />],
    ["Safe areas", "Header pads for the notch, bottom nav and sheets pad for the home bar, content pads for the nav (6.5 rem).", <Maximize2 />],
    ["Details", "Hover is a bonus. Any hover card (DetailPopover) must also open on tap, and becomes a sheet on phones.", <Hand />],
  ]
  const motion: [string, string, React.ReactNode][] = [
    ["Transform + opacity", "The only properties we animate. One allowed exception: the desktop rail width (one element, no phones).", <Move />],
    ["≤ 400 ms", "Tap feedback 100-150, show/hide 200-300, page and sheet 320-400. Exits faster than entries.", <Timer />],
    ["Direction means something", "Pages slide the way you moved in the nav. Popovers grow from the side they open on. Sheets come from the edge they live on.", <Navigation />],
    ["One hero moment", "Success check on scan. Everything else is quiet support.", <Sparkles />],
    ["Lite mode", "Low-end phones (auto-detected or chosen) drop blur, glows and loops, snap the rail, and shorten page swaps to 150 ms.", <Gauge />],
    ["Reduce motion", "The OS setting stops every animation. Nothing may depend on an animation finishing.", <Accessibility />],
  ]
  return <div className="space-y-6">
    <Lead>{t("ແອັບ VKS ໜຶ່ງອັນຢູ່ເທິງຈໍຫ້ອງການ 1440 px ແລະ ໂທລະສັບຍາມ 360 px ແນວໃດ, ແລະ ເຄື່ອນຍ້າຍລະຫວ່າງສອງຢ່າງນີ້ແນວໃດ. Component ດຽວກັນ, ໜ້າດຽວກັນ, breakpoint ດຽວ.", "How one VKS app sits on a 1440 px office screen and on a 360 px guard phone, and how it moves between the two. Same components, same page, one breakpoint.")}</Lead>
    <H2 id="anatomy">{t("ໂຄງສ້າງ", "Anatomy")}</H2>
    <div className="flex flex-wrap items-center gap-3">
      <Tabs value={mode} onValueChange={(v) => setMode(v as "desktop" | "mobile")}><TabsList><TabsTrigger value="desktop"><Monitor />{tr("Desktop")}</TabsTrigger><TabsTrigger value="mobile"><Smartphone />{tr("Mobile")}</TabsTrigger></TabsList></Tabs>
      {mode === "desktop" && <Button variant="outline" size="sm" onClick={() => setRail(!rail)}>{rail ? tr("Expand rail") : tr("Collapse rail")}</Button>}
    </div>
    <Anatomy mode={mode} rail={rail} />
    <FeatureGrid>{rules.map(([a, b, ic]) => <FeatureCard key={a} icon={ic} title={tr(a)} compact>{tr(b)}</FeatureCard>)}</FeatureGrid>

    <H2 id="breakpoint">{t("ລາກຂ້າມ breakpoint", "Drag across the breakpoint")}</H2>
    <P>{t("ເລື່ອນຄວາມກວ້າງ viewport. ທີ່ 768 px ການນຳທາງ, overlay ແລະ ຕາຂ່າຍປ່ຽນພ້ອມກັນ.", "Slide the viewport width. At 768 px the navigation, the overlays and the grid all switch together.")}</P>
    <div className="rounded-xl border bg-card p-5">
      <Slider value={w} onValueChange={setW} min={320} max={1440} step={8} ticks={8} tone={phone ? "gold" : "primary"} format={(v) => v + " px"} aria-label="viewport width" />
      <div className="mt-4 grid gap-2 text-sm sm:grid-cols-4">{([[tr("Nav"), phone ? "BottomNav" : "Sidebar"], [tr("Overlay"), phone ? tr("Bottom sheet") : tr("Dialog / popover")], [tr("Grid"), phone ? tr("1 column") : w[0] < 1100 ? tr("2 columns") : tr("3 columns")], [tr("Padding"), phone ? "16 px" : "24 px"]] as const).map(([k, v]) =>
        <div key={k} className="rounded-lg bg-muted px-3 py-2"><div className="text-xs text-muted-foreground">{k}</div><b key={v} className="vks-pop block">{v}</b></div>)}</div>
      <div className="mt-3 flex items-center gap-2 text-sm font-semibold">{phone ? <Smartphone className="size-4" /> : <Monitor className="size-4" />}{phone ? tr("Phone layout") : tr("Desktop layout")}</div>
    </div>
    <CodeBlock code={`// CSS: the md: prefix
<Sidebar className="hidden md:flex" />
<BottomNav className="md:hidden" />
// JS: when the component itself must change (Dialog → Sheet)
const mobile = useIsMobile()   // (max-width: 768px)`} />

    <H2 id="motion">{t("ກົດການເຄື່ອນໄຫວ", "Motion rules")}</H2>
    <FeatureGrid>{motion.map(([a, b, ic]) => <FeatureCard key={a} icon={ic} title={tr(a)} compact>{tr(b)}</FeatureCard>)}</FeatureGrid>
    <H3 id="easing">{t("Easing token (ແຕະຫນຶ່ງເສັ້ນ)", "Easing tokens (tap a lane)")}</H3>
    <div className="grid gap-2">
      <EaseLane name="ease-ios" ms={320} use="sheets, rail, pages" />
      <EaseLane name="ease-spring" ms={400} use="pills, thumbs, badges" />
      <EaseLane name="ease-out-quint" ms={300} use="fades, popovers" />
    </div>
    <H3 id="motion-map">{t("ອັນໃດເຄື່ອນຢູ່ໃສ", "Where things move")}</H3>
    {(() => { const map = [["Navigation", "Pill springs, icon pops + glows, rail collapses", "Pill springs, icon bounces, bar rises once"], ["Page change", "Slide 18 px in nav direction + gold bar", "Same, 150 ms in lite"], ["Details", "DetailPopover grows from its side", "Bottom sheet, rows stagger"], ["Slider", "Bubble springs up, halo on thumb", "Same + haptic tick per step"], ["Overlays", "Dialog pops centre", "Sheet slides from bottom"]]; return <>
      <div className="hidden overflow-hidden rounded-xl border md:block"><table className="w-full text-sm"><thead className="bg-muted text-left"><tr><th className="px-4 py-2">{tr("Part")}</th><th className="px-4 py-2">{tr("Desktop")}</th><th className="px-4 py-2">{tr("Phone")}</th></tr></thead><tbody>
        {map.map((r) => <tr key={r[0]} className="border-t"><td className="px-4 py-2.5 font-semibold">{tr(r[0])}</td><td className="px-4 py-2.5 text-muted-foreground">{tr(r[1])}</td><td className="px-4 py-2.5 text-muted-foreground">{tr(r[2])}</td></tr>)}
      </tbody></table></div>
      {/* the rule, applied: same data as cards below md */}
      <ul className="space-y-2 md:hidden">{map.map((r) => <li key={r[0]} className="rounded-xl border bg-card p-3 text-sm leading-6"><div className="font-semibold">{tr(r[0])}</div><div className="mt-1 grid grid-cols-[4.5rem_1fr] gap-x-2 text-muted-foreground"><span>{tr("Desktop")}</span><span>{tr(r[1])}</span><span>{tr("Phone")}</span><span className="text-foreground">{tr(r[2])}</span></div></li>)}</ul>
    </> })()}
    <div className="flex flex-wrap gap-3 pt-2"><Next to="app-shell" label="App shell" /><Next to="sidebar" label="Sidebar" /><Next to="motion" label={t("Class ການເຄື່ອນໄຫວ", "Motion classes")} /></div>
  </div>
}

export function DesignThinking() {
  const t = useT(), tr = useTr()
  const [done, setDone] = React.useState<number[]>([])
  return <div className="space-y-6">
    <Lead>{t("ໜ້າຈໍທີ່ສະຫງົບ ແລະ ເນັ້ນໃສ່ສິ່ງດຽວ. ກົດລຸ່ມນີ້ໃຊ້ກັບທຸກໜ້າຂອງແອັບ VKS, ທັງຄອມ ແລະ ມືຖື.", "Calm screens that focus on one thing. These rules apply to every VKS app page, desktop and phone.")}</Lead>
    <div className="rounded-xl border-l-4 border-gold bg-card p-4 text-[15px] leading-7">{tr(PAGE_QUESTION)}</div>
    <H2 id="rules">{t("ກົດ", "Rules")}</H2>
    <div className="grid gap-2 md:grid-cols-2">{RULES.map((r, i) => <div key={r.id} className="rounded-xl border bg-card p-4">
      <div className="flex items-baseline gap-2"><span className="font-mono text-xs text-gold">{String(i + 1).padStart(2, "0")}</span><b>{tr(r.title)}</b></div>
      <p className="mt-1 text-sm leading-6">{tr(r.rule)}</p>
      <p className="mt-1 text-xs leading-5 text-muted-foreground">{tr(r.how)}</p>
    </div>)}</div>
    <H2 id="before-after">{t("ກ່ອນ → ຫຼັງ", "Before → after")}</H2>
    <P>{t("ຈາກການຫຍໍ້ໜ້າ VKS Centre (v0.3).", "From the VKS Centre compaction (v0.3).")}</P>
    <div className="overflow-hidden rounded-xl border text-sm">{BEFORE_AFTER.map(([a, b]) => <div key={a} className="grid border-t first:border-0 md:grid-cols-2">
      <div className="px-4 py-2.5 text-muted-foreground line-through decoration-destructive/60">{tr(a)}</div>
      <div className="flex items-center gap-2 px-4 py-2.5"><ArrowRight className="size-4 shrink-0 text-success" />{tr(b)}</div>
    </div>)}</div>
    <H2 id="checklist">{t("ກວດກ່ອນສົ່ງ", "Checklist before you ship")}</H2>
    <ul className="space-y-1">{CHECKLIST.map((c, i) => { const on = done.includes(i); return <li key={c}>
      <button type="button" aria-pressed={on} onClick={() => setDone(on ? done.filter((x) => x !== i) : [...done, i])} className="vks-press flex min-h-11 w-full items-center gap-3 rounded-lg px-2 text-left text-sm hover:bg-muted">
        <span className={"flex size-5 shrink-0 items-center justify-center rounded border " + (on ? "border-success bg-success text-success-foreground" : "")}>{on && <Check className="size-3.5" />}</span>{tr(c)}
      </button></li> })}</ul>
    <p className="text-sm text-muted-foreground">{done.length}/{CHECKLIST.length}</p>
    <div className="flex flex-wrap gap-3 pt-2"><Next to="filter-chips" label="Filter chips" /><Next to="page-header" label="Page header" /><Next to="layout-rules" label={t("ກົດ layout", "Layout rules")} /></div>
  </div>
}

export function Changelog() {
  const tr = useTr()
  const log: [string, string, string[]][] = [
    ["0.8.2", "Metallic gold button", ["Button variant=\"gold\" is now a polished gold plate: light top, a reflection line across the middle, a darker gold rim and a warm lift shadow, with a light emboss on the navy text. The old flat #b6924b fill read as mustard on most screens. Navy text stays 7.1–11.8 : 1 in light and dark. New tokens --gold-metal-hi / --gold-metal / --gold-metal-lo / --gold-metal-end / --gold-edge in theme.css. No API change: every variant=\"gold\" in the apps gets the new look when the app moves to 0.8.2. Gold badges are unchanged."]],
    ["0.8.1", "Card expansion and fade crop", ["ExpandCard now opens like an iOS App Store card: one element from the card to the screen (a clip-path grows from the card's rectangle while the content slides up; no swap, no jump). New cover / coverClassName / coverHeight / cardHeight: the closed card is the foot of a coloured header that grows to full size. Phone: full screen; desktop: a centred panel over a dimmed page. Esc, ✕ or the dimmed page close it, focus returns to the card, reduced motion snaps. Existing summary-only use keeps working.", "New FadeCrop: show the top of a long list or screenshot and let the foot fade out (a mask, so it works on any background and both themes); expandable adds ເບິ່ງທັງໝົດ / ຫຍໍ້. Helper insetClip is unit tested."]],
    ["0.8.0", "React 19 actions, optimistic scans, sortable list, expand card", ["New SubmitButton: the save button of a <form action> reads useFormStatus() itself (spinner, keeps its width, blocks a second tap). New useOptimisticList: a scan shows ✓ at once, the save runs behind it and a failure rolls the row back with a toast (React 19 useOptimistic).", "PageHeader gains docTitle / appName / badge: the browser tab reads \"(3) ກະ · VKS HR\" through React 19's <title>. DataTable fills rows in top to bottom after loading (reveal, skeletonRows); whole list under 400 ms.", "New SortableList (in @vks-kit/ui/kanban): drag by the grip, Space + arrows, ↑ ↓ buttons on a phone. New ExpandCard: a card grows into its own panel and folds back. SignaturePad takes ref as a plain prop (no forwardRef left in the kit). React 19.3.1. Helpers applyPatches, docTitleText, revealDelay, moveItem are unit tested. Additive: no app changes needed."]],
    ["0.7.1", "Time picker: type or pick (Google Calendar style)", ["TimePicker and TimeRangePicker are now text fields you can type into (6, 630, 1830, 18:30, 18.30) with a dropdown list every 30 minutes that opens on the current value. The ເລີກ list starts after the start time and shows each length (\"12 ຊມ · +1 ມື້\"); picking a start keeps the length and opens ເລີກ. The hour grid, 24 h bar and ຂ້າມທ່ຽງຄືນ badge are gone; the length (12 ຊົ່ວໂມງ) and 12 / 8 ຊມ chips sit under the fields. Phone: the same list in a bottom sheet. Same props as before, plus optional step. New helpers parseTimeText and timeSteps (unit tested)."]],
    ["0.7.0", "VKS domain parts + logo-exact colours", ["New PatrolCheckpointRail (patrol round: done / next / missed, scan time, GPS distance, scan-next button), ShiftRosterGrid (guard x day D / N / OFF plan with short-shift warnings), IncidentEscalationCard (P1-P3, reporter call / WhatsApp, live SLA countdown, dispatch), GuardIdBadge (screen + 85.6 mm print card) and ContractQuoteSummary (lines, discount, VAT, total in Kip). Pure helpers checkpointProgress, fmtDistance, nextShift, rosterCover, slaLeft, quoteTotals are unit tested. Kip and Lao phone fields stay MoneyInput / PhoneInput.", "Theme: colours now come from the VKS logo. Light --muted-foreground #4b4f6b (7.99:1 on card), dark cards are logo navy #16173a with laurel gold #d8bf8c primary and --muted-foreground #a8acc7 (7.71:1). New --gold-tint token; Badge variant=\"gold\" now reads navy on gold tint (15.58:1). Warning is deeper (#9a4307, 6.60:1). Dark --gold-foreground stays navy so gold buttons keep their contrast.", "Docs: Installation has numbered steps, the optimizeDeps snippet, a full index.html and a Monorepo section; vite configs include the optimizeDeps fix. vks-guard deep-import check now also catches @vks-kit/core and @vks-kit/types internals."]],
    ["0.5.6", "Click a chart to drill in", ["BarSeries, LineSeries and ComboSeries take onPick(row, key, index): click a bar or point to open the people / sites behind it. key is the series of the bar that was hit (null = the column). Hovered bars brighten so they read as clickable.", "Donut takes onPick(slice, index): tap a slice, or its legend pill (a real button, so keyboard and phone work too).", "ChartLegend takes onPick: the pills become drill buttons instead of show / hide toggles."]],
    ["0.3.1", "Design thinking guide", ["New Getting Started guide: one job per page, content first, one control row, rare filters behind a popover, at most 5 headline numbers, say it once. Its full text is in the AI catalogue (docs/ai/design-thinking.md) and the AGENTS.md template. No API change.", "Business patterns: new ApprovalCard (approve, or reject with a required reason) and SyncStatus (synced / pending N / failing, last sync, retry; reads the OfflineQueue). Timeline gains optional actor and changes for an audit trail. Pure helpers diffFields, rejectReasonError, syncState, sinceLabel. New Form pattern and Reports (PDF & PPTX) guides. Additive, no breaking change."]],
    ["0.3.0", "Roadmap and dependency map", ["New Roadmap (Gantt bars with progress, milestones and a today line) and DependencyMap (columns of boxes with arrows; hover lights the chain). Both click-to-open. Pure helpers planPct, planMonths and layoutDeps. Additive, no breaking change."]],
    ["0.2.3", "Phone chart motion", ["On phones every chart now finishes inside 400 ms in total: stagger delays are capped and the calendar-cell wave (Heatmap, DateGrid, LatencyTimeline, AttendanceBoard) is shortened. Desktop motion is unchanged. No API change."]],
    ["0.2.2", "Docs and publish script", ["Installation page rewritten for the private registry; the shipped AGENTS.md template now has the Vite dev-server note and the registry update steps; chart prop tables list every prop. New npm run kit:publish script replaces kit:pack. No API change."]],
    ["0.2.1", "Registry release", ["Version numbers: the rows below this one (0.3.0 to 0.7.7) are the design-system history from before the move to the registry. Package versions now start from 0.2.x and are shared by ui, core and types.", "The kit is now published as @vks-kit/ui, @vks-kit/core and @vks-kit/types on GitHub Packages (private). @types/leaflet moved to dependencies so apps using the map typecheck. No API change."]],
    ["0.7.7", "Profile view: phone header", ["ProfileView on a phone is now edge to edge with a single 16 px margin. New optional flush, variant=\"actions\" (soft header, big avatar, no banner) and quickActions (round call / message / edit buttons) props. Defaults and desktop are unchanged."]],
    ["0.7.3", "Login screen + Profile view", ["New LoginScreen: desktop = navy brand panel + form, phone = centred form with logo. New ProfileView: desktop = sticky identity card + grouped rows, phone = one stacked column. Both use the Desktop | Phone | Both switcher."]],
    ["0.7.3", "Map and Stat card on phones", ["MapView on a phone shows an Uber-style bottom sheet (peek, drag up to list every pin; tap a row to fly there and open its card); optional list prop. New flush prop draws the map edge to edge on phones. StatCard turns into a compact row on phones (icon, label + number, delta chip, small trend); optional layout prop, plus flush to drop the card chrome so rows form one full-width grouped list. Docs: Phone preview now shows full-bleed demos (map, stat card, KPI hero, settings list, notifications, search, carousel, indexed list, toolbar) with no page padding, like a real app screen. Hover lift on StatCard only applies on devices that hover."]],
    ["0.7.6", "Static parts get the premium pass", ["Alert variant=\"card\": glass card, gold top hairline, round tone badge (default bar look unchanged).", "Empty: floating icon orb with a gold halo, optional icon / action, size=\"sm\"; Combobox, CommandPalette, NotificationList and IndexedList now use it (DataTable already did).", "OfflineBanner variant=\"island\": navy Dynamic-Island pill, tone badge, gold queue chip, pulsing gold dot while syncing.", "Badge: new info tone, dot and live (pinging dot) props.", "New CloseButton (round, 44 px, quiet hover, label ປິດ); Alert, Banner, Drawer, Dialog and Sheet share it. NotificationList 'mark all read' is now 44 px tall."]],
    ["0.7.5", "Toast restyle", ["Toasts now match IOSAlert: glass card with a gold hairline, round tone badge (text stays readable), spring entrance with a badge pop, and a bar that drains while the toast stays. No API change; every existing toast() call picks it up.", "Action buttons are 44 px pills; the close button has a bigger hit area.", "toast.promise now buzzes when it settles and shows a spinner badge while loading.", "Lite mode drops the blur and pop; reduced motion gets a plain fade."]],
    ["0.7.4", "Desktop hover effects", ["New HoverFx (spotlight, border trace, 3D tilt + sheen), Parallax + ParallaxLayer, SlideHighlight (one pill glides between rows), CursorRing (landing/login only) and the vks-nudge class for icons. Mouse only; off on phones, in lite mode and with reduced motion.", "LoginScreen: the brand panel's glow and orbs now drift with the mouse; new cursorRing prop (off by default).", "vks-lift is still the plain lift + shadow for any card."]],
    ["0.7.3", "Charts split into three pages", ["Charts docs are now Trends, Share & compare, and Schedules & grids. RadarSeries switches by its own width to a bar-per-axis comparison on a phone (new optional compact prop), because radar labels collide on narrow cards. Chart cards no longer overflow at 360 px."]],
    ["0.7.2", "Site profile + attendance charts", ["New LatencyTimeline (patrol latency site profile): visit days, gap brackets, avg / longest / shortest gap, multi-type days. Wide = one strip, narrow = month calendar with gap chips.", "New AttendanceBoard (HRM ຕິດຕາມການມາວຽກ): guard x day grid with P / ພ / A / ລ / O8 / H8 / ? codes, completeness bar and summary chips. Wide = table, phone = one collapsible month card per guard.", "Both switch layout by their own container width, so Desktop | Phone | Both previews and real phones behave the same."]],
    ["0.7.1", "Logo, file icons, one card format", ["Favicons: docs and gallery tabs now show the VKS mark instead of a blank page.", "New FileIcon + FileItem: coloured file-type tiles (PDF, Excel, Word, slides, image, video, audio, zip) from new --file-* tokens in both themes; fileKind() and fileBadge() are unit tested.", "Dropzone gains files + onRemove: picked files list under the zone with type icon, size and a 44 px remove button.", "Docs: one card format everywhere (FeatureCard: icon tile, value, title, body). Introduction, Installation, Typography, Motion, Mobile, Layout rules and Responsive now match; Typography gains weights and a Lao line-height demo; this changelog became a timeline.", "LoginScreen entrance: logo pops in with two gold rings, the hairline draws out, tagline, features and form fields cascade, then one light sweep crosses the sign-in button. Desktop also gets a settling aurora and slow-drifting gold orbs. Shorter (≤ 400 ms per piece) on phones; perf lite and reduced motion turn it down."]],
    ["0.7.0", "Phone vs desktop audit", ["Menu, Popover and ContextMenu dock to the bottom as a sheet on phones (grabber, backdrop, 48 px rows); desktop unchanged.", "New KpiHero: one big number + trend + sparkline for phone dashboards. KpiStrip is now marked desktop.", "New DateGrid chart (14-day status grid like the QC site profile).", "Docs: every page is tagged Desktop / Phone / Both; the preview switcher only offers what makes sense (Sidebar, Table, KpiStrip = desktop; Action sheet, Snap sheet, Carousel… = phone).", "Fixes: tree expand animation, carousel back button."]],
    ["0.7.0", "Standard input types", ["New TextInput, PhoneInput, MoneyInput, TimeInput, NumberInput in @vks-kit/ui, plus isPhoneLa() / phoneLaE164().", "PhoneInput: 020 is locked in front, 8 digits max, shown as 020 XXXX XXXX; pasted +856 / 020 numbers are cleaned.", "MoneyInput groups thousands while typing (LAK / THB / USD); TimeInput is 24 h with ± step and Now; NumberInput clamps min / max.", "Docs page Input types and a gallery section, both interactive."]],
    ["0.6.0", "Docs redesign + Desktop ↔ Mobile rules", ["Docs site rebuilt in the Base UI style: quiet sidebar with gold active bar, one-card preview (stage → toolbar → folded code with Replay / Copy), file-named code blocks, anchored headings, cards-on-phone props tables.", "Fully responsive docs: sidebar from 768 px, left drawer on phones, theme + performance moved into a Settings popover so the header never wraps, 'On this page' folds into a card below 1280 px.", "New guide 'Desktop ↔ Mobile': the 12 layout rules (table → cards, sidebar → bottom nav, dialog → sheet, 2-col → 1-col form, toolbar → BottomToolbar + ⋯ menu, hover → tap / long-press, 44 px targets) with side-by-side live frames at real widths.", "DataTable: new mode=\"auto\" | \"table\" | \"cards\" (default auto). forceCards still works but is deprecated.", "Layout rules: the motion map is now cards on a phone.", "Pickers inside a popup: on a phone, Combobox / DatePicker / DateRangePicker inside a Dialog or Sheet no longer open a sheet on top of a sheet. They push a view inside the same sheet (‹ back, Esc or a pick returns). New InSheetView + useInSheet() for your own second step. New rules: 'Picker inside a popup' and '≤ 5 options in a popup → chips / radio'."]],
    ["0.5.1", "Tooltips and map tips", ["Map text now uses Noto Sans Lao (leaflet.css was forcing Helvetica 12px). Map tips show a tone dot, title, sub line and time; tips=\"always\" pins small labels; renderCard opens a glass pin card when a pin is tapped (phones have no hover).", "Tooltip gains variant dark | light | glass, arrow, shortcut key hint and a bold title line (all additive). New Tip for one-line tooltips.", "Charts: no more black focus border when clicking a chart."]],
    ["0.5.0", "Charts, map, alerts, shell", ["Charts: gradient fills, VKS card tooltip, tap-to-hide legend pills and entry animation (off in lite / reduced motion). New ComboSeries (bars + line on a 2nd axis), ScatterSeries (bubbles), RadarSeries, RadialBars, pure-CSS Heatmap; BarSeries gains stacked / horizontal, AreaSeries takes several keys, Donut shows the total and % on hover.", "Map: VKS glass zoom + 'fit all pins' buttons (44 px), pulsing token pins, card tooltips; Leaflet banner removed, tiny © OSM credit kept (licence).", "IOSAlert / ActionSheet / Banner: same iOS behaviour, VKS look: tone badge (info / success / warning / danger), gold glow, pill buttons, draining timer line on Banner.", "Chip: X now shrinks the chip away before it leaves. Combobox list fades + scales in.", "AppShell: gold hairline header, gold nav pill, navy + gold FAB (was green). Phone preview frame now has a status bar, island and home bar."]],
    ["0.4.0", "Motion & layout", ["TagInput: new tags pop in from the caret, removed tags (x or Backspace) shrink away, the rest glide into place.", "Chip: when one is removed (or a chip grows its tick) the others glide into place instead of jumping. New useFlip() hook for any list.", "Checkbox & Switch: press-in / release motion. Box sinks with a halo, fill grows from the centre, tick draws, ripple; switch knob stretches into a pill, springs across, green floods from the middle, ring pulse. Fixes the switch knob that snapped instead of sliding. haptic prop.", "Sidebar: collapsible 72 px icon rail (remembered), tooltips when collapsed, active icon glow, icon pop, logo spin-in, SidebarSheet phone drawer.", "AppShell: pages slide in the direction you moved, gold route bar under the header, bottom nav rises in.", "Slider: value bubble, thumb halo, thicker track while dragging, tick marks, tones, haptic ticks.", "DetailPopover: rich hover / click card on desktop, bottom sheet on phones, rows stagger in.", "Layout rules guide with live anatomy, breakpoint slider and easing lanes.", "Lite-mode overrides for every new effect."]],
    ["0.3.0", "Docs", ["This documentation site (apps/docs).", "PhoneFrame previews for shell, login and touch parts."]],
  ]
  return (
    <ol className="relative space-y-5 border-l border-border pl-6 md:pl-8">
      {log.map(([v, title, items], i) => (
        <li key={v} className="relative">
          <span className={"absolute -left-[31px] top-4 size-3.5 rounded-full border-2 border-background md:-left-[39px] " + (i === 0 ? "bg-gold ring-4 ring-gold/20" : "bg-muted-foreground/40")} />
          <div className="rounded-2xl border bg-card p-5">
            <div className="mb-3 flex flex-wrap items-center gap-2.5">
              <span className="rounded-lg bg-primary px-2 py-0.5 font-mono text-sm font-bold text-primary-foreground">v{v}</span>
              {i === 0 && <Badge variant="gold">{tr("latest")}</Badge>}
              <H3 id={"v" + v.replace(/\./g, "-")}>{title}</H3>
            </div>
            <ul className="space-y-2.5">
              {items.map((it) => (
                <li key={it} className="flex gap-3 text-[15px] leading-relaxed text-muted-foreground"><span className="mt-[0.7em] size-1.5 shrink-0 rounded-full bg-gold" />{it}</li>
              ))}
            </ul>
          </div>
        </li>
      ))}
    </ol>
  )
}
