import * as React from "react"
import { Check, Copy, ChevronDown, Code2, RotateCcw, Terminal, FileCode2, Monitor, Smartphone, Columns2 } from "@vks-kit/ui/icons"
import { cn, toast } from "@vks-kit/ui"

import { PhoneFrame } from "./layout"
import { toLo } from "./i18n"

/* ---- device view: one choice for the whole docs site, remembered ---- */
export type DeviceView = "desktop" | "phone" | "both"
const VIEW_KEY = "vks.docs.view", viewBus = new EventTarget()
const readView = (): DeviceView => { try { const v = localStorage.getItem(VIEW_KEY); return v === "desktop" || v === "phone" ? v : "both" } catch { return "both" } }
function useDeviceView(): [DeviceView, (v: DeviceView) => void] {
  const v = React.useSyncExternalStore((cb) => { viewBus.addEventListener("v", cb); return () => viewBus.removeEventListener("v", cb) }, readView, () => "both" as DeviceView)
  return [v, (n) => { try { localStorage.setItem(VIEW_KEY, n) } catch { /* private mode */ } viewBus.dispatchEvent(new Event("v")) }]
}
/* ---- language: one choice for the docs chrome (Lao or English, never both at once), remembered ---- */
export type Lang = "lo" | "en"
const LANG_KEY = "vks.docs.lang", langBus = new EventTarget()
export const readLang = (): Lang => { try { return localStorage.getItem(LANG_KEY) === "en" ? "en" : "lo" } catch { return "lo" } }
export function useLang(): [Lang, (l: Lang) => void] {
  const l = React.useSyncExternalStore((cb) => { const st = (e: StorageEvent) => { if (e.key === LANG_KEY) cb() }; langBus.addEventListener("l", cb); window.addEventListener("storage", st); return () => { langBus.removeEventListener("l", cb); window.removeEventListener("storage", st) } }, readLang, () => "lo" as Lang)
  React.useEffect(() => { document.documentElement.lang = l }, [l])
  return [l, (n) => { try { localStorage.setItem(LANG_KEY, n) } catch { /* private mode */ } langBus.dispatchEvent(new Event("l")) }]
}
/** tr(english): the Lao translation of a content string when Lao is chosen, otherwise the English as written. */
export function useTr() { const [l] = useLang(); return (s: string): string => (l === "lo" ? toLo(s) : s) }
/** t(lo, en): returns the string for the chosen docs language. */
export function useT() { const [l] = useLang(); return (lo: string, en: string) => (l === "lo" ? lo : en) }
export function LangSwitch({ className }: { className?: string }) {
  const [l, setL] = useLang()
  return <div role="group" aria-label="Language" className={cn("flex rounded-lg bg-muted p-0.5", className)}>
    {(["lo", "en"] as const).map((id) => <button key={id} type="button" lang={id} aria-pressed={l === id} onClick={() => setL(id)}
      className={cn("vks-press inline-flex h-9 min-w-11 flex-1 items-center justify-center rounded-md px-3 text-xs font-semibold leading-normal transition-[color,background-color,box-shadow] duration-200", l === id ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}>{id === "lo" ? "ລາວ" : "EN"}</button>)}
  </div>
}
function useWide() {
  const q = "(min-width: 1024px)", [m, setM] = React.useState(() => matchMedia(q).matches)
  React.useEffect(() => { const mq = matchMedia(q), on = () => setM(mq.matches); mq.addEventListener("change", on); return () => mq.removeEventListener("change", on) }, [])
  return m
}
const VIEWS: { id: DeviceView; label: string; Icon: typeof Monitor }[] = [{ id: "desktop", label: "Desktop", Icon: Monitor }, { id: "phone", label: "Phone", Icon: Smartphone }, { id: "both", label: "Both", Icon: Columns2 }]
function ViewSwitch({ view, onView }: { view: DeviceView; onView: (v: DeviceView) => void }) {
  const tr = useTr()
  return <div role="group" aria-label={tr("Phone")} className="relative ml-auto mr-1 flex rounded-lg bg-muted p-0.5">
    {VIEWS.map(({ id, label, Icon }) => <button key={id} type="button" aria-pressed={view === id} onClick={() => onView(id)} title={tr(label)}
      className={cn("vks-press relative inline-flex h-8 min-w-9 items-center justify-center gap-1.5 rounded-md px-2 text-xs font-semibold text-muted-foreground transition-[color,background-color,box-shadow] duration-200 hover:text-foreground", view === id && "bg-card text-foreground shadow-sm")}>
      <Icon className="size-3.5" /><span className="hidden sm:inline">{tr(label)}</span></button>)}
  </div>
}

export type Prop = { name: string; type: string; def?: string; desc: string }
export type Device = "desktop" | "mobile" | "both"
export type Example = { id: string; title: string; note?: string; demo: React.FC; code: string; device?: Device }

/** Tiny highlighter: strings, JSX tags, keywords, comments. Token colours only. */
const RE = /(\/\/.*$|\/\*[\s\S]*?\*\/)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`[^`]*`)|(<\/?[A-Za-z][\w.]*)|\b(import|from|export|const|let|function|return|type|await|async|new|default|if|else|true|false|null|undefined)\b/gm
export function highlight(src: string) {
  const out: React.ReactNode[] = []; let last = 0, k = 0
  for (const m of src.matchAll(RE)) {
    if (m.index! > last) out.push(src.slice(last, m.index))
    const cls = m[1] ? "text-muted-foreground italic" : m[2] ? "text-success" : m[3] ? "text-warning font-semibold" : "text-primary font-semibold"
    out.push(<span key={k++} className={cls}>{m[0]}</span>)
    last = m.index! + m[0].length
  }
  out.push(src.slice(last))
  return out
}

export function CopyButton({ text, className, label }: { text: string; className?: string; label?: string }) {
  const [done, setDone] = React.useState(false), t = useT()
  return (
    <button type="button" aria-label={t("ສຳເນົາ", "Copy")} onClick={async () => { try { await navigator.clipboard.writeText(text); setDone(true); toast.success(t("ສຳເນົາແລ້ວ", "Copied")); setTimeout(() => setDone(false), 1500) } catch { toast.error("Copy failed") } }}
      className={cn("vks-press inline-flex h-9 min-w-9 items-center justify-center gap-1.5 rounded-lg px-2 text-xs font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", className)}>
      {done ? <Check key="y" className="vks-pop size-4 text-success" /> : <Copy key="n" className="size-4" />}{label && <span className="hidden sm:inline">{done ? "Copied" : label}</span>}
    </button>
  )
}

/** Base UI style code panel: quiet header (file / lang + copy), horizontal scroll, never breaks the page width. */
export function CodeBlock({ code, lang = "tsx", className, title, bare }: { code: string; lang?: string; className?: string; title?: string; bare?: boolean }) {
  const src = code.trim()
  const Icon = lang === "bash" ? Terminal : FileCode2
  return (
    <div className={cn("group/code relative min-w-0 overflow-hidden bg-muted/50", !bare && "rounded-xl border", className)}>
      <div className="flex h-10 items-center gap-2 border-b border-border/70 pl-4 pr-1 text-xs text-muted-foreground">
        <Icon className="size-3.5 shrink-0" /><span className="truncate font-mono">{title ?? lang}</span>
        <CopyButton text={src} className="ml-auto" />
      </div>
      <pre className="max-h-[480px] overflow-auto p-4 font-mono text-[12.5px] leading-6 [scrollbar-width:thin] md:text-[13px]"><code>{highlight(src)}</code></pre>
    </div>
  )
}

export function Tabs2({ tabs, value, onChange }: { tabs: string[]; value: string; onChange: (t: string) => void }) {
  const tr = useTr()
  return (
    <div role="tablist" className="flex gap-1 overflow-x-auto border-b [scrollbar-width:none]">
      {tabs.map((t) => (
        <button key={t} type="button" role="tab" aria-selected={value === t} onClick={() => onChange(t)}
          className={cn("relative -mb-px h-11 shrink-0 px-3 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground",
            value === t && "text-foreground after:absolute after:inset-x-2 after:bottom-0 after:h-0.5 after:rounded-full after:bg-gold")}>{tr(t)}</button>
      ))}
    </div>
  )
}

/**
 * Demo + code in ONE card, like Base UI: the live stage on top, the source underneath,
 * folded to a few lines until you expand it. Replay remounts the demo (re-runs entry motion).
 */
export function PreviewBlock({ demo: Demo, code, className, title, frame, device = "both" }: { demo: React.FC; code: string; className?: string; title?: string; frame?: string; device?: Device }) {
  const [open, setOpen] = React.useState(false), t = useT()
  const preRef = React.useRef<HTMLPreElement>(null), [maxH, setMaxH] = React.useState(152)
  const [pref, setView] = useDeviceView(), wide = useWide()
  const view: DeviceView = !frame ? "desktop" : device === "desktop" ? "desktop" : device === "mobile" ? "phone" : pref // own-frame demos and single-device parts keep one view
  const showDesktop = view !== "phone", showPhone = view !== "desktop"
  const side = view === "both" && wide
  const [run, setRun] = React.useState(0)
  const src = code.trim()
  const long = src.split("\n").length > 7
  const toggle = () => { const n = !open; if (n && preRef.current) setMaxH(Math.min(preRef.current.scrollHeight, 560)); setOpen(n) }
  return (
    <div className="vks-fade-up min-w-0 overflow-hidden rounded-2xl border bg-card shadow-sm">
      <div className={cn(side && "grid grid-cols-[minmax(0,1fr)_auto] divide-x")}>
        {showDesktop && <div className={cn("vks-stage relative flex min-h-[220px] min-w-0 flex-wrap items-center justify-center gap-3 p-4 sm:p-8 md:min-h-[280px]", side ? "md:p-8" : "md:p-12", className)}>
          <React.Suspense fallback={<span className="text-sm text-muted-foreground">{t("ກຳລັງໂຫຼດ…", "Loading…")}</span>}><Demo key={run} /></React.Suspense>
        </div>}
        {showPhone && frame && <div key={"p" + run} className={cn("vks-stage flex min-w-0 items-start justify-center p-4 sm:p-6", view === "both" && !side && "border-t", side && "px-5 py-6")}>
          <PhoneFrame frame={frame} src={"#/demo/" + frame} h={side ? 520 : 560} scale={side ? 0.8 : 1} />
        </div>}
      </div>
      <div className="flex h-11 items-center gap-1 border-t bg-muted/40 pl-3 pr-1 text-xs text-muted-foreground">
        <Code2 className="size-3.5 shrink-0" /><span className="truncate font-mono">{title ?? "demo.tsx"}</span>
        {frame && device === "both" && <ViewSwitch view={view} onView={setView} />}
        {frame && device !== "both" && <span className="ml-auto mr-2 inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-[11px] font-semibold leading-normal text-muted-foreground">{device === "desktop" ? <Monitor className="size-3" /> : <Smartphone className="size-3" />}{device === "desktop" ? "Desktop only" : "Phone only"}</span>}
        <div className="flex items-center">
          <button type="button" onClick={() => setRun((n) => n + 1)} aria-label={t("ຫຼິ້ນຄືນ", "Replay")} title={t("ຫຼິ້ນຄືນ", "Replay")} className="vks-press inline-flex size-9 items-center justify-center rounded-lg hover:bg-muted hover:text-foreground"><RotateCcw className="size-4" /></button>
          <CopyButton text={src} />
        </div>
      </div>
      <div className="relative border-t bg-muted/50">
        <pre ref={preRef} style={long ? { maxHeight: open ? maxH : 152 } : undefined} className={cn("p-4 font-mono text-[12.5px] leading-6 [scrollbar-width:thin] md:text-[13px]", long && "transition-[max-height] duration-300 ease-out motion-reduce:transition-none", open ? "overflow-auto" : "overflow-hidden")}><code>{highlight(src)}</code></pre>
        {long && <>
          <div aria-hidden className={cn("pointer-events-none absolute inset-x-0 bottom-[2.75rem] h-14 bg-gradient-to-t from-muted/90 to-transparent transition-opacity duration-300 motion-reduce:transition-none", open ? "opacity-0" : "opacity-100")} />
          <div className="flex justify-center border-t py-1.5">
            <button type="button" onClick={toggle} aria-expanded={open} className="vks-press inline-flex min-h-9 items-center gap-1.5 rounded-full border bg-card px-4 text-xs font-semibold leading-normal text-foreground shadow-sm hover:bg-accent">
              {open ? t("ຫຍໍ້ລົງ", "Collapse") : t("ເບິ່ງໂຄດທັງໝົດ", "Show code")}<ChevronDown className={cn("size-3.5 transition-transform duration-300", open && "rotate-180")} />
            </button>
          </div>
        </>}
      </div>
    </div>
  )
}

export function InstallBlock({ file, importLine }: { file: string; importLine: string }) {
  const [tab, setTab] = React.useState("Command")
  return (
    <div className="space-y-3">
      <Tabs2 tabs={["Command", "Manual"]} value={tab} onChange={setTab} />
      {tab === "Command"
        ? <CodeBlock lang="bash" title="terminal" code={"npm install @vks-kit/ui -w apps/<your-app>"} />
        : <div className="space-y-3 text-sm">
            <p className="leading-7 text-muted-foreground">Already in the monorepo. Source lives at <code className="break-all rounded bg-muted px-1.5 py-0.5 font-mono text-[13px]">{file}</code>. Edit it there, never copy it into an app.</p>
            <CodeBlock code={importLine} />
          </div>}
    </div>
  )
}

/**
 * API table. Desktop = real table (lots of columns, you scan across).
 * Phone = one card per prop (the Layout rule: tables with more than 3-4 columns become cards).
 */
export function PropsTable({ props }: { props: Prop[] }) {
  const tr = useTr()
  return (
    <>
      <div className="hidden overflow-hidden rounded-xl border md:block">
        <table className="w-full text-sm">
          <thead className="bg-muted/60 text-left"><tr>{["Prop", "Type", "Default", "Description"].map((h) => <th key={h} className="px-4 py-2.5 text-xs font-semibold tracking-wide text-muted-foreground">{tr(h)}</th>)}</tr></thead>
          <tbody>{props.map((p) => (
            <tr key={p.name} className="border-t align-top transition-colors hover:bg-muted/30">
              <td className="whitespace-nowrap px-4 py-3"><code className="rounded-md bg-gold/10 px-1.5 py-0.5 font-mono text-[13px] font-semibold text-foreground ring-1 ring-gold/25">{p.name}</code></td>
              <td className="px-4 py-3"><code className="break-words font-mono text-[12px] text-primary">{p.type}</code></td>
              <td className="px-4 py-3"><code className="font-mono text-[12px] text-muted-foreground">{p.def ?? "—"}</code></td>
              <td className="px-4 py-3 leading-6 text-muted-foreground">{p.desc ? tr(p.desc) : "—"}</td>
            </tr>))}</tbody>
        </table>
      </div>
      <ul className="space-y-2 md:hidden">{props.map((p) => (
        <li key={p.name} className="rounded-xl border bg-card p-3.5">
          <div className="flex items-start justify-between gap-3"><code className="rounded-md bg-gold/10 px-1.5 py-0.5 font-mono text-[13px] font-semibold ring-1 ring-gold/25">{p.name}</code>{p.def && <code className="shrink-0 font-mono text-[11px] text-muted-foreground">= {p.def}</code>}</div>
          <code className="mt-2 block break-words font-mono text-[12px] leading-5 text-primary">{p.type}</code>
          {p.desc && <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{tr(p.desc)}</p>}
        </li>))}</ul>
    </>
  )
}

const Anchor = ({ id }: { id: string }) => <a href={"#" + id} aria-label="#" onClick={(e) => { e.preventDefault(); document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); history.replaceState(null, "", location.hash.split("#").slice(0, 2).join("#") + "#" + id) }}
  className="ml-2 inline-block text-muted-foreground/0 transition-colors group-hover/h:text-muted-foreground hover:!text-gold">#</a>
export const H2 = ({ id, children }: { id: string; children: React.ReactNode }) => (
  <h2 id={id} data-toc className="group/h scroll-mt-24 pb-1 pt-8 text-[1.35rem] font-bold leading-snug tracking-tight">{children}<Anchor id={id} /></h2>
)
export const H3 = ({ id, children }: { id: string; children: React.ReactNode }) => (
  <h3 id={id} data-toc data-level="3" className="group/h scroll-mt-24 pt-3 text-base font-bold leading-snug">{children}<Anchor id={id} /></h3>
)
export const P = ({ children, className }: { children: React.ReactNode; className?: string }) => <p className={cn("leading-7 text-muted-foreground", className)}>{children}</p>
/* ---- one card format for every guide page (value · title · body, icon tile, index) ---- */
const tile = "flex shrink-0 items-center justify-center rounded-xl bg-primary/[.07] text-primary ring-1 ring-primary/10 dark:bg-gold/10 dark:text-gold dark:ring-gold/20"
/** Docs-only: the single card used by every guide page. value = the big line, title = the small label, children = the explanation. */
export function FeatureCard({ icon, value, title, children, index, compact, style }: { icon: React.ReactNode; value?: React.ReactNode; title: React.ReactNode; children?: React.ReactNode; index?: number; compact?: boolean; style?: React.CSSProperties }) {
  return <li style={style} className={cn("group relative flex flex-col overflow-hidden rounded-2xl border bg-card shadow-xs transition-[transform,box-shadow] duration-200 [@media(hover:hover)]:hover:-translate-y-0.5 [@media(hover:hover)]:hover:shadow-lg [@media(hover:hover)]:hover:shadow-primary/10", compact ? "gap-2 p-4" : "gap-3 p-5")}>
    <div className={cn("flex items-center", compact ? "gap-3" : "gap-3.5")}>
      <span className={cn(tile, compact ? "size-10 [&_svg]:size-5" : "size-12 [&_svg]:size-[22px]")}>{icon}</span>
      <div className="min-w-0 flex-1">
        {value != null && <p className="text-xl font-bold leading-snug tracking-tight text-foreground">{value}</p>}
        <p className={value != null ? "text-sm font-semibold leading-normal text-muted-foreground" : "font-semibold leading-snug text-foreground"}>{title}</p>
      </div>
      {index != null && <span className="self-start font-mono text-xs font-semibold tabular-nums text-muted-foreground/60">{String(index + 1).padStart(2, "0")}</span>}
    </div>
    {children != null && <p className={cn("leading-relaxed text-muted-foreground", compact ? "text-sm" : "text-[15px]")}>{children}</p>}
  </li>
}
/** Docs-only: grid of FeatureCards with the stagger entrance. cols=3 for short cards. */
export function FeatureGrid({ children, cols = 2 }: { children: React.ReactNode; cols?: 2 | 3 }) {
  return <ol className={cn("vks-stagger grid gap-4", cols === 3 ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2")}>
    {React.Children.map(children, (c, i) => React.isValidElement<{ style?: React.CSSProperties }>(c) ? React.cloneElement(c, { style: { ...c.props.style, "--i": Math.min(i, 8) } as React.CSSProperties }) : c)}
  </ol>
}

export const Code = ({ children }: { children: React.ReactNode }) => <code className="break-words rounded bg-muted px-1.5 py-0.5 font-mono text-[13px] text-foreground">{children}</code>