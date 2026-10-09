import * as React from "react"
import { Search, Moon, Sun, Menu as MenuIcon, ChevronLeft, ChevronRight, CornerDownLeft, Settings2, ChevronDown, ListTree, ArrowUp, Monitor, Smartphone } from "@vks-kit/ui/icons"
import { Logo, Button, Badge, Sheet, SheetContent, SheetTitle, Dialog, DialogContent, DialogTitle, useTheme, cn, PerfToggle, Popover, PopoverTrigger, PopoverContent, BRAND } from "@vks-kit/ui"
import { nav, flat, find, entries, type Entry } from "./docs/registry"
import { frames as layoutFrames } from "./docs/layout"
import { respFrames } from "./docs/responsive"
const frames: Record<string, React.FC> = { ...layoutFrames, ...respFrames }
import type { Device } from "./docs/kit"
import { PreviewBlock, InstallBlock, PropsTable, CodeBlock, H2, H3, P, LangSwitch, readLang, useT, useLang, useTr } from "./docs/kit"
import type { Doc } from "./docs/types"

// Read from the package so the header badge can never drift from the published kit.
import uiPkg from "@vks-kit/ui/package.json"
const VERSION = uiPkg.version

/* ---------- hash router: #/docs/<slug>#<anchor> ---------- */
function useRoute() {
  const read = () => { const m = location.hash.match(/^#\/docs\/([\w-]+)/); return m ? m[1] : "introduction" }
  const [slug, setSlug] = React.useState(read)
  React.useEffect(() => {
    const on = () => { const s = read(); setSlug((prev) => { if (prev !== s) window.scrollTo(0, 0); return s }) }
    window.addEventListener("hashchange", on); return () => window.removeEventListener("hashchange", on)
  }, [])
  return slug
}
const go = (slug: string) => { location.hash = "#/docs/" + slug }

const badgeTone = (b?: Entry["badge"]) => (b === "New" ? "gold" : b === "Mobile" ? "success" : b === "Lazy" ? "warning" : "neutral") as "gold" | "success" | "warning" | "neutral"
const barBtn = "text-bar-foreground hover:bg-white/10"

/* ---------- settings: theme + performance in one popover, so the header never wraps ---------- */
function Settings() {
  const { theme, setTheme } = useTheme(), t = useT()
  const dark = theme === "dark"
  return <Popover>
    <PopoverTrigger asChild><Button variant="ghost" size="icon" aria-label={t("ຕັ້ງຄ່າ", "Settings")} title={t("ຮູບແບບສີ ແລະ ປະສິດທິພາບ", "Theme & performance")} className={barBtn}><Settings2 /></Button></PopoverTrigger>
    <PopoverContent align="end" className="w-[min(20rem,calc(100vw-1.5rem))] space-y-4">
      <div>
        <div className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("ຮູບແບບສີ", "Theme")}</div>
        <div className="grid grid-cols-2 gap-2">
          {([["light", "A · Guard Navy", Sun], ["dark", "E · Night Watch", Moon]] as const).map(([v, l, I]) =>
            <button key={v} type="button" onClick={() => setTheme(v)} aria-pressed={theme === v}
              className={cn("vks-press flex min-h-11 items-center gap-2 rounded-xl border px-3 text-left text-sm font-semibold transition-colors", theme === v ? "border-gold/70 bg-gold/10 ring-1 ring-gold/40" : "hover:bg-muted")}>
              <I className="size-4 shrink-0" /><span className="leading-tight">{l}</span></button>)}
        </div>
      </div>
      <div>
        <div className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("ປະສິດທິພາບ", "Performance")}</div>
        <PerfToggle className="w-full justify-between" />
        <div className="mb-2 mt-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("ພາສາ", "Language")}</div>
        <LangSwitch />
        <p className="mt-2 text-xs leading-5 text-muted-foreground">Low-end = cheap Android mode: no blur, no looping motion. {dark ? "Night theme on." : ""}</p>
      </div>
    </PopoverContent>
  </Popover>
}
function LangQuick() {
  const [l, setL] = useLang()
  return <button type="button" lang={l === "lo" ? "en" : "lo"} aria-label={l === "lo" ? "Switch to English" : "ປ່ຽນເປັນພາສາລາວ"} onClick={() => setL(l === "lo" ? "en" : "lo")} className={cn(barBtn, "vks-press hidden h-9 min-w-11 items-center justify-center rounded-lg px-2 text-xs font-bold leading-normal sm:inline-flex")}>{l === "lo" ? "EN" : "ລາວ"}</button>
}
function ThemeQuick() {
  const { theme, setTheme } = useTheme(); const dark = theme === "dark"
  return <Button variant="ghost" size="icon" aria-label={dark ? "Light theme" : "Dark theme"} onClick={() => setTheme(dark ? "light" : "dark")} className={cn(barBtn, "hidden sm:inline-flex")}>
    {dark ? <Sun key="s" className="vks-pop" /> : <Moon key="m" className="vks-pop" />}
  </Button>
}

/* ---------- ⌘K search ---------- */
function SearchDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const t = useT(), tr = useTr()
  const [q, setQ] = React.useState(""), [i, setI] = React.useState(0)
  const hits = React.useMemo(() => { const s = q.trim().toLowerCase(); return (s ? entries.filter((e) => (e.name + " " + e.desc + " " + e.group).toLowerCase().includes(s)) : entries).slice(0, 12) }, [q])
  React.useEffect(() => { setI(0) }, [q])
  React.useEffect(() => { if (!open) setQ("") }, [open])
  const pick = (e: Entry) => { go(e.slug); onOpenChange(false) }
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="gap-0 p-0 md:max-w-lg">
    <DialogTitle className="sr-only">{t("ຄົ້ນຫາເອກະສານ", "Search docs")}</DialogTitle>
    <div className="flex items-center gap-2 border-b px-4 pr-12"><Search className="size-4 text-muted-foreground" />
      <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("ຄົ້ນຫາອົງປະກອບ…", "Search components…")} className="h-14 flex-1 bg-transparent text-base outline-none"
        onKeyDown={(e) => { if (e.key === "ArrowDown") { e.preventDefault(); setI((x) => Math.min(x + 1, hits.length - 1)) } if (e.key === "ArrowUp") { e.preventDefault(); setI((x) => Math.max(x - 1, 0)) } if (e.key === "Enter" && hits[i]) pick(hits[i]) }} />
    </div>
    <ul className="max-h-[60dvh] overflow-auto p-2 md:max-h-[50vh]">{hits.length === 0 && <li className="p-6 text-center text-sm text-muted-foreground">{t("ບໍ່ພົບ", "No results")}</li>}
      {hits.map((e, n) => <li key={e.slug}><button type="button" onMouseEnter={() => setI(n)} onClick={() => pick(e)} className={cn("flex min-h-12 w-full items-center gap-3 rounded-lg px-3 py-2 text-left", n === i && "bg-accent")}>
        <div className="min-w-0 flex-1"><div className="flex items-center gap-2 font-semibold">{tr(e.name)}{e.badge && e.badge !== "Stable" && <Badge variant={badgeTone(e.badge)} className="px-1.5 py-0 text-[10px]">{tr(e.badge)}</Badge>}</div><div className="truncate text-xs text-muted-foreground">{tr(e.group)} · {tr(e.desc)}</div></div>
        {n === i && <CornerDownLeft className="hidden size-4 text-muted-foreground md:block" />}
      </button></li>)}
    </ul>
    <div className="hidden items-center gap-4 border-t px-4 py-2 text-[11px] text-muted-foreground md:flex"><span><kbd className="rounded border px-1 font-mono">↑↓</kbd> {t("ເລື່ອນ","move")}</span><span><kbd className="rounded border px-1 font-mono">↵</kbd> {t("ເປີດ","open")}</span><span><kbd className="rounded border px-1 font-mono">esc</kbd> {t("ປິດ","close")}</span></div>
  </DialogContent></Dialog>
}

/* ---------- sidebar (Base UI style: quiet groups, active row with gold bar) ---------- */
function SideNav({ active, onPick }: { active: string; onPick?: () => void }) {
  const tr = useTr()
  const ref = React.useRef<HTMLElement>(null)
  React.useEffect(() => { ref.current?.querySelector<HTMLElement>("[aria-current=page]")?.scrollIntoView({ block: "nearest" }) }, [active])
  return <nav ref={ref} aria-label="Docs" className="space-y-6 pb-10">{nav.map((g) => <div key={g.group}>
    <div className="mb-1 px-3 text-[11px] font-bold uppercase tracking-[0.08em] text-muted-foreground/80">{tr(g.group)}</div>
    <ul className="space-y-px">{g.items.map((e) => <li key={e.slug}><a href={"#/docs/" + e.slug} onClick={onPick} aria-current={active === e.slug ? "page" : undefined}
      className={cn("relative flex min-h-11 items-center justify-between gap-2 rounded-lg px-3 text-[14.5px] leading-snug transition-colors md:min-h-9", active === e.slug ? "bg-accent font-semibold text-foreground before:absolute before:inset-y-2 before:left-0 before:w-[3px] before:rounded-full before:bg-gold" : "text-muted-foreground hover:bg-accent/60 hover:text-foreground")}>
      <span className="truncate">{tr(e.name)}</span>{e.badge && e.badge !== "Stable" && <Badge variant={badgeTone(e.badge)} className="px-1.5 py-0 text-[10px]">{tr(e.badge)}</Badge>}
    </a></li>)}</ul>
  </div>)}</nav>
}

/* ---------- on-this-page: one observer, two renderings (rail on xl, fold-out card below xl) ---------- */
type TocItem = { id: string; text: string; level: number }
function useToc(slug: string) {
  const [items, setItems] = React.useState<TocItem[]>([])
  const [on, setOn] = React.useState("")
  const [lang] = useLang()
  React.useEffect(() => {
    let io: IntersectionObserver | undefined
    const scan = () => {
      io?.disconnect()
      const els = [...document.querySelectorAll<HTMLElement>("main [data-toc]")]
      setItems(els.map((e) => ({ id: e.id, text: (e.textContent ?? "").replace(/#$/, ""), level: e.dataset.level === "3" ? 3 : 2 })))
      io = new IntersectionObserver((xs) => { const v = xs.filter((x) => x.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]; if (v) setOn(v.target.id) }, { rootMargin: "-80px 0px -65% 0px" })
      els.forEach((e) => io!.observe(e))
    }
    setItems([])
    const ts = [80, 400, 1000].map((ms) => setTimeout(scan, ms))
    return () => { ts.forEach(clearTimeout); io?.disconnect() }
  }, [slug, lang])
  const jump = (id: string) => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); setOn(id) }
  return { items, on, jump }
}
function TocList({ items, on, jump, onPick }: ReturnType<typeof useToc> & { onPick?: () => void }) {
  return <ul className="space-y-0.5 border-l text-sm">{items.map((x) => <li key={x.id}><a href={"#" + x.id} onClick={(e) => { e.preventDefault(); jump(x.id); onPick?.() }}
    className={cn("-ml-px block border-l-2 py-1.5 leading-snug transition-colors md:py-1", x.level === 3 ? "pl-6" : "pl-3", on === x.id ? "border-gold font-medium text-foreground" : "border-transparent text-muted-foreground hover:text-foreground")}>{x.text}</a></li>)}</ul>
}
function TocRail(t: ReturnType<typeof useToc>) {
  const tt = useT()
  if (!t.items.length) return <div className="hidden w-52 shrink-0 xl:block" />
  return <div className="sticky top-20 hidden max-h-[calc(100dvh-6rem)] w-52 shrink-0 overflow-auto pb-8 pt-10 xl:block">
    <div className="mb-2 flex items-center gap-2 text-sm font-semibold"><ListTree className="size-4 text-muted-foreground" />{tt("ໃນໜ້ານີ້", "On this page")}</div>
    <TocList {...t} />
    <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="mt-4 inline-flex min-h-9 items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground"><ArrowUp className="size-3.5" />{tt("ກັບຂຶ້ນເທິງ", "Back to top")}</button>
  </div>
}
/** Below xl the rail has no room, so the same list folds into a card under the title. */
function TocInline(t: ReturnType<typeof useToc>) {
  const tt = useT()
  const [open, setOpen] = React.useState(false)
  if (t.items.length < 2) return null
  const cur = t.items.find((x) => x.id === t.on)
  return <div className="mb-8 overflow-hidden rounded-xl border bg-card xl:hidden">
    <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} className="flex min-h-12 w-full items-center gap-2 px-4 text-left text-sm font-semibold">
      <ListTree className="size-4 shrink-0 text-muted-foreground" /><span>{tt("ໃນໜ້ານີ້", "On this page")}</span><span className="truncate font-normal text-muted-foreground">{cur ? "· " + cur.text : "· " + t.items.length + " " + tt("ຫົວຂໍ້", "sections")}</span>
      <ChevronDown className={cn("ml-auto size-4 shrink-0 transition-transform duration-200", open && "rotate-180")} />
    </button>
    {open && <div className="vks-fade-up border-t px-4 py-3"><TocList {...t} onPick={() => setOpen(false)} /></div>}
  </div>
}

/* ---------- component page template ---------- */
/** Pages whose demo already draws its own phone/desktop frame. */
const OWN_FRAME = ["app-shell", "bottom-nav", "login-card", "touch"]
/**
 * Device audit: which parts make sense where, decided from what the component needs (hover / right-click / keyboard / wide canvas = desktop;
 * thumb gestures / bottom-docked / safe-area = phone). Anything not listed works on both. A doc's own `device` field wins over this map.
 */
const DEVICE: Record<string, Device> = {
  sidebar: "desktop", "kpi-strip": "desktop", table: "desktop", breadcrumb: "desktop", "hover-card": "desktop", "command-palette": "desktop",
  "split-pane": "desktop", tooltip: "desktop", "kbd-copy": "desktop", "tree-view": "desktop", "scroll-area": "desktop", "context-menu": "desktop",
  "snap-sheet": "mobile", "indexed-list": "mobile", "bottom-toolbar": "mobile", "long-press": "mobile", "share-sheet": "mobile", "action-sheet": "mobile",
  "ios-alert": "mobile", banner: "mobile", carousel: "mobile", "search-bar": "mobile", "progress-hud": "mobile", "step-progress": "mobile", scan: "mobile",
  "signature-pad": "mobile", "kpi-hero": "mobile",
}
function ComponentPage({ d }: { d: Doc }) {
  const tr = useTr()
  const dev = d.device ?? DEVICE[d.slug]
  return <>
    <PreviewBlock demo={d.demo} code={d.code} title={d.slug + ".tsx"} frame={OWN_FRAME.includes(d.slug) ? undefined : d.slug} device={dev} />
    <H2 id="installation">{tr("Installation")}</H2>
    <InstallBlock file={d.file} importLine={d.importLine} />
    {d.usage && <><H2 id="usage">{tr("Usage")}</H2><CodeBlock code={d.usage} /></>}
    {d.examples?.length ? <><H2 id="examples">{tr("Examples")}</H2>{d.examples.map((x) => <section key={x.id} className="space-y-3"><H3 id={x.id}>{tr(x.title)}</H3>{x.note && <P>{tr(x.note)}</P>}<PreviewBlock demo={x.demo} code={x.code} title={x.id + ".tsx"} frame={OWN_FRAME.includes(d.slug) ? undefined : d.slug + "/" + x.id} device={x.device ?? dev} /></section>)}</> : null}
    {d.notes?.length ? <><H2 id="notes">{tr("Notes")}</H2><ul className="list-disc space-y-1.5 pl-5 leading-7 text-muted-foreground">{d.notes.map((n) => <li key={n}>{tr(n)}</li>)}</ul></> : null}
    {d.props?.length ? <><H2 id="api">{tr("API reference")}</H2><PropsTable props={d.props} /></> : null}
  </>
}

function Pager({ slug }: { slug: string }) {
  const t = useT(), tr = useTr()
  const i = flat.findIndex((e) => e.slug === slug), prev = flat[i - 1], next = flat[i + 1]
  const card = "vks-press vks-lift group flex min-h-16 min-w-0 flex-1 flex-col justify-center gap-0.5 rounded-xl border bg-card px-4 py-3 transition-colors hover:border-gold/50"
  return <div className="mt-16 grid gap-3 border-t pt-8 sm:grid-cols-2">
    {prev ? <a href={"#/docs/" + prev.slug} className={card}><span className="flex items-center gap-1 text-xs text-muted-foreground"><ChevronLeft className="size-3.5" />{t("ກ່ອນໜ້າ", "Previous")}</span><b className="truncate">{tr(prev.name)}</b></a> : <span className="hidden sm:block" />}
    {next ? <a href={"#/docs/" + next.slug} className={cn(card, "items-end text-right")}><span className="flex items-center gap-1 text-xs text-muted-foreground">{t("ຕໍ່ໄປ", "Next")}<ChevronRight className="size-3.5 text-gold" /></span><b className="truncate">{tr(next.name)}</b></a> : <span />}
  </div>
}

class Boundary extends React.Component<{ children: React.ReactNode; k: string }, { err?: Error }> {
  state: { err?: Error } = {}
  static getDerivedStateFromError(err: Error) { return { err } }
  componentDidUpdate(p: { k: string }) { if (p.k !== this.props.k && this.state.err) this.setState({ err: undefined }) }
  render() { return this.state.err ? <div className="rounded-xl border border-destructive p-4 text-sm text-destructive">{readLang() === "lo" ? "Demo ຂັດຂ້ອງ:" : "Demo crashed:"} {this.state.err.message}</div> : this.props.children }
}

export default function App() {
  const f = location.hash.match(/^#\/frame\/([\w-]+)/)
  if (f) { const Frame = frames[f[1]]; return Frame ? <Frame /> : null }
  const d = location.hash.match(/^#\/demo\/([\w-]+)(?:\/([\w-]+))?/)
  if (d) return <DemoFrame slug={d[1]} ex={d[2]} />
  return <Docs />
}

/** One demo alone at the iframe's own width (phone = real 360 px), used by the Phone / Both preview. */
function DemoFrame({ slug, ex }: { slug: string; ex?: string }) {
  const doc = find(slug).doc, Demo = (ex ? doc?.examples?.find((x) => x.id === ex)?.demo : doc?.demo)
  return <div className={"vks-stage flex min-h-dvh flex-wrap items-center justify-center gap-3 " + (doc?.bleed ? "p-4 max-md:p-0" : "p-4")}>
    <React.Suspense fallback={<div className="vks-shimmer h-40 w-full rounded-xl" />}>{Demo ? <Demo /> : null}</React.Suspense>
  </div>
}

/** Tiny viewport readout so people testing the docs see which layout rule is active. */
function Viewport() {
  const [w, setW] = React.useState(() => window.innerWidth)
  React.useEffect(() => { const on = () => setW(window.innerWidth); window.addEventListener("resize", on); return () => window.removeEventListener("resize", on) }, [])
  const phone = w < 768
  return <span title="Current layout (768 px breakpoint)" className="hidden items-center gap-1 rounded-full border border-white/15 px-2 py-0.5 font-mono text-[11px] opacity-70 lg:inline-flex">{phone ? <Smartphone className="size-3" /> : <Monitor className="size-3" />}{w}px</span>
}

function Docs() {
  const t = useT(), tr = useTr()
  const slug = useRoute()
  const { guide, doc } = find(slug)
  const entry = guide ?? doc
  const [menu, setMenu] = React.useState(false), [search, setSearch] = React.useState(false)
  const toc = useToc(slug)
  React.useEffect(() => {
    const on = (e: KeyboardEvent) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setSearch((s) => !s) } if (e.key === "/" && !(e.target as HTMLElement).closest("input,textarea")) { e.preventDefault(); setSearch(true) } }
    window.addEventListener("keydown", on); return () => window.removeEventListener("keydown", on)
  }, [])
  React.useEffect(() => { document.title = (entry?.name ?? "Not found") + " · VKS UI" }, [entry])
  React.useEffect(() => { setMenu(false) }, [slug])
  const Page = guide?.page
  const crumbGroup = entry?.group

  return <div className="min-h-dvh">
    <header className="vks-bar sticky top-0 z-40 text-bar-foreground shadow-md" style={{ paddingTop: "env(safe-area-inset-top)" }}>
      <div className="mx-auto flex h-14 max-w-[1440px] items-center gap-1 px-2 sm:gap-2 md:px-5">
        <Button variant="ghost" size="icon" className={cn(barBtn, "md:hidden")} aria-label={tr("Menu")} onClick={() => setMenu(true)}><MenuIcon /></Button>
        <a href="#/docs/introduction" className="flex min-w-0 shrink-0 items-center gap-2 whitespace-nowrap font-bold" title={BRAND.legal}><Logo className="size-8 shrink-0" /><span>VKS UI</span><span className="hidden rounded-full border border-gold/60 bg-gold/10 px-2 text-xs font-semibold sm:inline">v{VERSION}</span></a>
        <nav className="ml-4 hidden gap-1 text-sm lg:flex">
          <a href="#/docs/introduction" className={cn("rounded-md px-3 py-1.5 hover:bg-white/10", guide && "bg-white/10")}>{t("ເອກະສານ", "Docs")}</a>
          <a href="#/docs/button" className={cn("rounded-md px-3 py-1.5 hover:bg-white/10", doc && "bg-white/10")}>{t("ອົງປະກອບ", "Components")}</a>
          <a href="#/docs/responsive" className={cn("rounded-md px-3 py-1.5 hover:bg-white/10", slug === "responsive" && "bg-white/10")}>{tr("Desktop ↔ Mobile")}</a>
          <a href="#/docs/settings-page" className={cn("rounded-md px-3 py-1.5 hover:bg-white/10", slug === "settings-page" && "bg-white/10")}>{t("ຕັ້ງຄ່າ", "Settings")}</a>
        </nav>
        <div className="flex-1" />
        <button type="button" onClick={() => setSearch(true)} className="hidden h-9 w-44 items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-3 text-sm opacity-80 transition-opacity hover:opacity-100 md:flex lg:w-56">
          <Search className="size-4 shrink-0" /><span className="truncate">{t("ຄົ້ນຫາ…", "Search…")}</span><kbd className="ml-auto shrink-0 rounded border border-white/20 px-1.5 font-mono text-[11px]">Ctrl K</kbd>
        </button>
        <Button variant="ghost" size="icon" className={cn(barBtn, "md:hidden")} aria-label={tr("Search")} onClick={() => setSearch(true)}><Search /></Button>
        <Viewport />
        <LangQuick /><ThemeQuick />
        <Settings />
      </div>
      <div className="vks-hairline" />
    </header>

    <div className="mx-auto flex max-w-[1440px] gap-6 px-4 md:px-5 lg:gap-10">
      <aside className="sticky top-[3.625rem] hidden h-[calc(100dvh-3.625rem)] w-56 shrink-0 overflow-auto overscroll-contain pr-1 pt-6 [scrollbar-width:thin] md:block lg:w-60"><SideNav active={slug} /></aside>
      <main key={slug} className="min-w-0 flex-1 pb-20 pt-5 md:pt-10">
        {entry ? <article className="vks-rise mx-auto max-w-[820px]">
          <div className="mb-2 flex items-center gap-1.5 text-sm text-muted-foreground"><a href="#/docs/introduction" className="hover:text-foreground">{tr("Docs")}</a><ChevronRight className="size-3.5" /><span>{crumbGroup && tr(crumbGroup)}</span></div>
          <div className="flex flex-wrap items-center gap-3"><h1 className="text-[1.9rem] font-bold leading-tight tracking-tight md:text-[2.4rem]">{tr(entry.name)}</h1>{entry.badge && <Badge variant={badgeTone(entry.badge)}>{tr(entry.badge)}</Badge>}</div>
          <p className="mb-6 mt-2 max-w-2xl text-[1.05rem] leading-8 text-muted-foreground md:mb-8 md:text-lg">{tr(entry.desc)}</p>
          <TocInline {...toc} />
          <div className="space-y-4"><Boundary k={slug}><React.Suspense fallback={<div className="vks-shimmer h-64 rounded-xl" />}>{Page ? <Page /> : doc && <ComponentPage d={doc} />}</React.Suspense></Boundary></div>
          <Pager slug={slug} />
        </article> : <div className="py-24 text-center"><h1 className="text-2xl font-bold">{t("ບໍ່ພົບໜ້ານີ້", "Page not found")}</h1><Button className="mt-4" onClick={() => go("introduction")}>{t("ກັບໄປເອກະສານ", "Back to docs")}</Button></div>}
      </main>
      <TocRail {...toc} />
    </div>

    <footer className="border-t"><div className="mx-auto flex max-w-[1440px] flex-col gap-1 px-4 py-6 text-xs leading-6 text-muted-foreground md:flex-row md:items-center md:justify-between md:px-5">
      <span>© {BRAND.legal}</span><span>{BRAND.lo}</span>
    </div></footer>

    <Sheet open={menu} onOpenChange={setMenu}><SheetContent side="left" className="flex w-[19rem] flex-col">
      <div className="flex h-14 shrink-0 items-center gap-2 border-b px-4 pr-14"><Logo className="size-8" /><SheetTitle>VKS UI</SheetTitle><span className="rounded-full border border-gold/60 bg-gold/10 px-2 text-xs font-semibold">v{VERSION}</span></div>
      <button type="button" onClick={() => { setMenu(false); setSearch(true) }} className="mx-3 mt-3 flex h-11 shrink-0 items-center gap-2 rounded-xl border bg-muted/50 px-3 text-sm text-muted-foreground"><Search className="size-4" />{t("ຄົ້ນຫາ", "Search")}</button>
      <div className="min-h-0 flex-1 overflow-auto overscroll-contain px-2 pt-4"><SideNav active={slug} onPick={() => setMenu(false)} /></div>
    </SheetContent></Sheet>
    <SearchDialog open={search} onOpenChange={setSearch} />
  </div>
}