import * as React from "react"
import { ContextMenu as CM, Dialog as D, HoverCard as HC, ScrollArea as SA } from "radix-ui"
import { ArrowDownRight, ArrowUpRight, Bell, ChevronRight, CornerDownLeft, FileUp, MoreHorizontal, Search, X } from "lucide-react"
import { haptics } from "@vks-kit/core"
import { cn } from "../lib/cn"
import { useFlip } from "../lib/use-flip"
import { useIsMobile } from "../lib/use-media"
import { useSheetMode, SHEET_CLS, SheetScrim, SheetGrabber, SheetCancel } from "../lib/sheet-mode"
import { FileItem } from "./file-icon"
import { Empty } from "./feedback"

const panel = "vks-panel vks-glass z-50 overflow-hidden rounded-[0.9rem] p-1 shadow-[0_24px_60px_-20px_rgb(20_23_61/.5)]"
const itemCls = "flex min-h-10 cursor-pointer select-none items-center gap-3 rounded-[0.6rem] px-3 text-[14px] leading-normal outline-none transition-colors data-[highlighted]:bg-foreground/10 data-[disabled]:pointer-events-none data-[disabled]:opacity-40 [&_svg]:size-[17px] [&_svg]:shrink-0"

/* ------------------------------------------------------------------ Command palette */
export type Command = { id: string; label: string; group?: string; icon?: React.ReactNode; shortcut?: string; keywords?: string; onRun: () => void }
/** Case/Lao-insensitive subsequence score; 0 = no match. Word starts and runs score higher. Pure, unit tested. */
export function fuzzyScore(query: string, text: string): number {
  const q = query.normalize("NFC").toLowerCase().replace(/\s+/g, ""), t = text.normalize("NFC").toLowerCase()
  if (!q) return 1
  const at = t.indexOf(q); if (at >= 0) return 100 - Math.min(at, 50) + (at === 0 || t[at - 1] === " " ? 20 : 0)
  let s = 0, j = 0, run = 0
  for (let i = 0; i < t.length && j < q.length; i++) {
    if (t[i] === q[j]) { j++; run++; s += 1 + run + (i === 0 || t[i - 1] === " " ? 3 : 0) } else run = 0
  }
  return j === q.length ? s : 0
}
/** Ctrl/Cmd + K. Opens the palette with the shortcut from anywhere. */
export function useCommandK(setOpen: (fn: (o: boolean) => boolean) => void) {
  React.useEffect(() => {
    const f = (e: KeyboardEvent) => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setOpen((o) => !o) } }
    window.addEventListener("keydown", f); return () => window.removeEventListener("keydown", f)
  }, [setOpen])
}
/**
 * Spotlight-style command palette (desktop power users; also opens full-width on phones).
 * Fuzzy search, grouped results, ↑ ↓ Enter, Esc. Pair with useCommandK(setOpen) for Ctrl K.
 */
export function CommandPalette({ open, onOpenChange, commands, placeholder = "ພິມຄຳສັ່ງ ຫຼື ຄົ້ນຫາ...", emptyLabel = "ບໍ່ພົບຜົນ" }: {
  open: boolean; onOpenChange: (o: boolean) => void; commands: Command[]; placeholder?: string; emptyLabel?: string
}) {
  const [q, setQ] = React.useState(""), [sel, setSel] = React.useState(0), list = React.useRef<HTMLDivElement>(null)
  React.useEffect(() => { if (open) { setQ(""); setSel(0) } }, [open])
  const results = React.useMemo(() => commands.map((c) => ({ c, s: Math.max(fuzzyScore(q, c.label), fuzzyScore(q, c.keywords ?? "") * 0.8) })).filter((r) => r.s > 0)
    .sort((a, b) => (q ? b.s - a.s : 0)).map((r) => r.c), [q, commands])
  const groups = React.useMemo(() => { const m = new Map<string, Command[]>(); results.forEach((c) => { const g = c.group ?? ""; m.set(g, [...(m.get(g) ?? []), c]) }); return [...m.entries()] }, [results])
  const flat = groups.flatMap(([, cs]) => cs)
  React.useEffect(() => { list.current?.querySelector<HTMLElement>('[data-sel="true"]')?.scrollIntoView({ block: "nearest" }) }, [sel])
  const run = (c?: Command) => { if (!c) return; haptics.tap(); onOpenChange(false); setTimeout(c.onRun, 0) }
  let k = -1
  return (
    <D.Root open={open} onOpenChange={onOpenChange}>
      <D.Portal>
        <D.Overlay className="vks-scrim fixed inset-0 z-50 bg-[color-mix(in_oklab,var(--foreground)_30%,transparent)]" />
        <D.Content aria-describedby={undefined} className="vks-modal fixed inset-x-2 top-[max(0.5rem,env(safe-area-inset-top))] z-50 mx-auto max-w-xl focus:outline-none md:top-[14vh]"
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") { e.preventDefault(); setSel((s) => Math.min(flat.length - 1, s + 1)) }
            else if (e.key === "ArrowUp") { e.preventDefault(); setSel((s) => Math.max(0, s - 1)) }
            else if (e.key === "Enter" && !e.nativeEvent.isComposing) { e.preventDefault(); run(flat[sel]) }
          }}>
          <div className="vks-glass overflow-hidden rounded-2xl border border-foreground/10 shadow-[0_40px_80px_-24px_rgb(20_23_61/.55)]">
            <D.Title className="sr-only">{placeholder}</D.Title>
            <div className="flex items-center gap-3 border-b border-foreground/10 px-4">
              <Search aria-hidden className="size-5 text-muted-foreground" />
              <input autoFocus value={q} onChange={(e) => { setQ(e.target.value); setSel(0) }} placeholder={placeholder} role="combobox" aria-expanded aria-controls="vks-cmd-list"
                aria-activedescendant={flat[sel] ? "vks-cmd-" + flat[sel].id : undefined} className="h-14 flex-1 bg-transparent text-[16px] leading-normal outline-none placeholder:text-muted-foreground" />
              <kbd className="hidden rounded-md border bg-muted px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground md:inline">Esc</kbd>
            </div>
            <div ref={list} id="vks-cmd-list" role="listbox" className="max-h-[min(60vh,24rem)] overflow-y-auto overscroll-contain p-1.5">
              {flat.length === 0 && <Empty size="sm" icon={<Search />} title={emptyLabel} className="py-8" />}
              {groups.map(([g, cs]) => (
                <div key={g} role="group" aria-label={g || undefined}>
                  {g && <div className="px-3 pb-1 pt-2.5 text-[11px] font-semibold uppercase leading-normal tracking-wide text-muted-foreground">{g}</div>}
                  {cs.map((c) => { k++; const i = k, on = i === sel
                    return (
                      <div key={c.id} id={"vks-cmd-" + c.id} role="option" aria-selected={on} data-sel={on} onMouseMove={() => sel !== i && setSel(i)} onClick={() => run(c)}
                        className={cn("relative flex min-h-11 cursor-pointer items-center gap-3 rounded-xl px-3 text-[15px] leading-normal [&_svg]:size-[18px]", on ? "bg-primary text-primary-foreground" : "text-foreground")}>
                        <span className={cn("grid size-7 place-items-center rounded-lg", on ? "bg-white/15" : "bg-muted text-muted-foreground")}>{c.icon ?? <ChevronRight />}</span>
                        <span className="min-w-0 flex-1 truncate">{c.label}</span>
                        {c.shortcut && <kbd className={cn("rounded-md px-1.5 py-0.5 font-mono text-[11px]", on ? "bg-white/15" : "border bg-muted text-muted-foreground")}>{c.shortcut}</kbd>}
                        {on && <CornerDownLeft aria-hidden className="size-4 opacity-70" />}
                      </div>
                    ) })}
                </div>
              ))}
            </div>
            <div className="hidden items-center gap-4 border-t border-foreground/10 px-4 py-2 text-[11px] text-muted-foreground md:flex">
              <span>↑ ↓ ເລືອກ</span><span>Enter ເປີດ</span><span className="ml-auto">{flat.length} ຜົນ</span>
            </div>
          </div>
        </D.Content>
      </D.Portal>
    </D.Root>
  )
}

/* ------------------------------------------------------------------ Breadcrumb */
export type Crumb = { label: string; href?: string; onClick?: () => void; icon?: React.ReactNode }
/** Where-am-I trail for desktop pages. Long trails collapse the middle into "…" (maxItems). Last item = current page. */
export function Breadcrumb({ items, maxItems = 4, className }: { items: Crumb[]; maxItems?: number; className?: string }) {
  const [expanded, setExpanded] = React.useState(false)
  const collapse = !expanded && items.length > maxItems
  const shown: (Crumb | "more")[] = collapse ? [items[0], "more", ...items.slice(items.length - (maxItems - 2))] : items
  return (
    <nav aria-label="breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-1 text-sm leading-normal text-muted-foreground">
        {shown.map((c, i) => {
          const last = i === shown.length - 1
          return (
            <li key={i} className="flex items-center gap-1">
              {c === "more" ? <button type="button" aria-label="ສະແດງທັງໝົດ" onClick={() => setExpanded(true)} className="grid size-8 place-items-center rounded-md hover:bg-muted hover:text-foreground"><MoreHorizontal className="size-4" /></button>
                : last ? <span aria-current="page" className="flex items-center gap-1.5 font-medium text-foreground [&_svg]:size-4">{c.icon}{c.label}</span>
                : c.href ? <a href={c.href} onClick={c.onClick} className="flex items-center gap-1.5 rounded-md px-1 py-0.5 transition-colors hover:text-foreground [&_svg]:size-4">{c.icon}{c.label}</a>
                : <button type="button" onClick={c.onClick} className="flex items-center gap-1.5 rounded-md px-1 py-0.5 transition-colors hover:text-foreground [&_svg]:size-4">{c.icon}{c.label}</button>}
              {!last && <ChevronRight aria-hidden className="size-3.5 opacity-50" />}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

/* ------------------------------------------------------------------ Hover card */
/** Rich preview on hover (desktop) — guard profile, site info. Touch devices ignore it, so never hide essential info in here. */
export function HoverCard({ trigger, children, side = "bottom", align = "center", openDelay = 350, className }: {
  trigger: React.ReactNode; children: React.ReactNode; side?: "top" | "right" | "bottom" | "left"; align?: "start" | "center" | "end"; openDelay?: number; className?: string
}) {
  return (
    <HC.Root openDelay={openDelay} closeDelay={120}>
      <HC.Trigger asChild>{trigger}</HC.Trigger>
      <HC.Portal>
        <HC.Content side={side} align={align} sideOffset={8} collisionPadding={12}
          className={cn("vks-panel z-50 w-72 rounded-2xl border bg-popover p-4 text-popover-foreground shadow-[0_24px_60px_-20px_rgb(20_23_61/.45)] focus:outline-none", className)}>
          {children}<HC.Arrow className="fill-popover" width={14} height={7} />
        </HC.Content>
      </HC.Portal>
    </HC.Root>
  )
}

/* ------------------------------------------------------------------ Context menu */
export type ContextAction = { label: string; icon?: React.ReactNode; shortcut?: string; onSelect?: () => void; destructive?: boolean; disabled?: boolean; separator?: boolean; items?: ContextAction[] }
function renderCtx(a: ContextAction[]): React.ReactNode {
  return a.map((x, i) => (
    <React.Fragment key={i}>
      {x.separator && <CM.Separator className="my-1 h-px bg-foreground/10" />}
      {x.items ? (
        <CM.Sub>
          <CM.SubTrigger className={cn(itemCls, "data-[state=open]:bg-foreground/10")}>{x.icon}<span className="flex-1">{x.label}</span><ChevronRight className="opacity-60" /></CM.SubTrigger>
          <CM.Portal><CM.SubContent sideOffset={4} className={cn(panel, "min-w-48")}>{renderCtx(x.items)}</CM.SubContent></CM.Portal>
        </CM.Sub>
      ) : (
        <CM.Item disabled={x.disabled} onSelect={() => { if (x.destructive) haptics.error(); else haptics.tap(); x.onSelect?.() }} className={cn(itemCls, x.destructive && "text-destructive data-[highlighted]:bg-destructive/10")}>
          {x.icon}<span className="flex-1">{x.label}</span>{x.shortcut && <span className="font-mono text-[11px] text-muted-foreground">{x.shortcut}</span>}
        </CM.Item>
      )}
    </React.Fragment>
  ))
}
/**
 * Right-click menu on desktop, long-press menu on phones (Radix handles both; ~700 ms hold); on phones it docks to the bottom as a sheet with 48 px rows. Long-press is hard to discover, so on a phone also give the row a visible ⋯ button (Menu) or use ActionSheet.
 * The wrapped element lifts slightly while the menu is open, like iOS. Supports nested sub-menus.
 */
export function ContextMenu({ children, actions, label, className }: { children: React.ReactNode; actions: ContextAction[]; label?: string; className?: string }) {
  const [open, setOpen] = React.useState(false), sheet = useSheetMode()
  return (
    <>{sheet && open && <SheetScrim />}<CM.Root onOpenChange={(o) => { setOpen(o); if (o) haptics.tap() }}>
      <CM.Trigger asChild>
        <div data-open={open} className={cn("select-none [-webkit-touch-callout:none] transition-transform duration-300 ease-[cubic-bezier(.34,1.4,.64,1)] data-[open=true]:scale-[1.02]", className)}>{children}</div>
      </CM.Trigger>
      <CM.Portal>
        <CM.Content collisionPadding={10} className={sheet ? cn(SHEET_CLS, "max-h-[80dvh] overflow-auto") : cn(panel, "min-w-56")}>
          {sheet && <SheetGrabber />}
          {label && <CM.Label className="px-3 py-1.5 text-xs font-semibold leading-normal text-muted-foreground">{label}</CM.Label>}
          {renderCtx(actions)}
          {sheet && <SheetCancel />}
        </CM.Content>
      </CM.Portal>
    </CM.Root></>
  )
}

/* ------------------------------------------------------------------ Tree view */
export type TreeNode = { id: string; label: string; icon?: React.ReactNode; badge?: React.ReactNode; children?: TreeNode[] }
/** Visible rows in order, given which nodes are expanded. Pure; drives keyboard nav. */
export function flattenTree(nodes: TreeNode[], expanded: Set<string>, depth = 0, parent: string | null = null): { node: TreeNode; depth: number; parent: string | null }[] {
  return nodes.flatMap((n) => [{ node: n, depth, parent }, ...(n.children && expanded.has(n.id) ? flattenTree(n.children, expanded, depth + 1, n.id) : [])])
}
/**
 * File-explorer tree (sites → posts → guards). Click to open, arrows ← → ↑ ↓ + Enter on keyboard.
 * Controlled selection via selected/onSelect; expansion is internal (defaultExpanded).
 */
export function TreeView({ nodes, selected, onSelect, defaultExpanded = [], className }: { nodes: TreeNode[]; selected?: string; onSelect?: (n: TreeNode) => void; defaultExpanded?: string[]; className?: string }) {
  const [exp, setExp] = React.useState(() => new Set(defaultExpanded)), [focus, setFocus] = React.useState<string | null>(null)
  const rows = flattenTree(nodes, exp), ref = React.useRef<HTMLUListElement>(null)
  const toggle = (id: string, to?: boolean) => setExp((s) => { const n = new Set(s); if (to ?? !n.has(id)) n.add(id); else n.delete(id); return n })
  const cur = focus ?? selected ?? rows[0]?.node.id
  React.useEffect(() => { if (focus) ref.current?.querySelector<HTMLElement>('[data-id="' + focus + '"]')?.focus() }, [focus])
  const onKey = (e: React.KeyboardEvent) => {
    const i = rows.findIndex((r) => r.node.id === cur); const r = rows[i]; if (!r) return
    const map: Record<string, () => void> = {
      ArrowDown: () => { if (rows[i + 1]) setFocus(rows[i + 1].node.id) },
      ArrowUp: () => { if (rows[i - 1]) setFocus(rows[i - 1].node.id) },
      ArrowRight: () => { if (!r.node.children) return; if (exp.has(r.node.id)) setFocus(r.node.children[0]?.id ?? r.node.id); else toggle(r.node.id, true) },
      ArrowLeft: () => { if (r.node.children && exp.has(r.node.id)) toggle(r.node.id, false); else if (r.parent) setFocus(r.parent) },
      Enter: () => onSelect?.(r.node), " ": () => onSelect?.(r.node),
    }
    if (map[e.key]) { e.preventDefault(); map[e.key]() }
  }
  // Rows that just left (collapsed) stay mounted for one exit animation, then are dropped.
  type Row = (typeof rows)[number]
  const prevRows = React.useRef<Row[]>(rows), mounted = React.useRef(false)
  const [leaving, setLeaving] = React.useState<Row[]>([])
  React.useLayoutEffect(() => {
    const now = new Set(rows.map((r) => r.node.id)), gone = prevRows.current.filter((r) => !now.has(r.node.id))
    prevRows.current = rows
    if (!gone.length || !mounted.current) return
    setLeaving((l) => [...l.filter((x) => now.has(x.node.id) === false), ...gone])
    const t = setTimeout(() => setLeaving((l) => l.filter((x) => !gone.includes(x))), 300)
    return () => clearTimeout(t)
  }, [rows.map((r) => r.node.id).join("|")])
  React.useEffect(() => { mounted.current = true }, [])
  // only rows that were not there on the previous commit get the enter animation (and keep it until they unmount)
  const seen = React.useRef<Set<string>>(new Set(rows.map((r) => r.node.id))), fresh = React.useRef<Set<string>>(new Set())
  for (const r of rows) if (mounted.current && !seen.current.has(r.node.id)) fresh.current.add(r.node.id)
  React.useLayoutEffect(() => {
    const ids = new Set(rows.map((r) => r.node.id)); seen.current = ids
    for (const id of [...fresh.current]) if (!ids.has(id)) fresh.current.delete(id)
  })
  const shownIds = new Set(rows.map((r) => r.node.id))
  const list: { r: Row; out: boolean }[] = rows.map((r) => ({ r, out: false }))
  for (const l of leaving) {
    if (shownIds.has(l.node.id)) continue
    const at = list.findIndex((x) => x.r.node.id === l.parent)
    let i = at < 0 ? list.length : at + 1
    while (i < list.length && list[i].out) i++
    list.splice(i, 0, { r: l, out: true })
  }
  return (
    <ul ref={ref} role="tree" onKeyDown={onKey} className={cn("text-sm", className)}>
      {list.map(({ r: { node: n, depth }, out: leavingRow }) => {
        const open = exp.has(n.id), sel = n.id === selected
        return (
          <li key={n.id} role="treeitem" aria-hidden={leavingRow || undefined} aria-expanded={n.children ? open : undefined} aria-selected={sel} aria-level={depth + 1} data-id={n.id} tabIndex={leavingRow ? -1 : n.id === cur ? 0 : -1}
            onFocus={() => setFocus(n.id)} onClick={() => { if (leavingRow) return; onSelect?.(n); if (n.children) toggle(n.id) }}
            className={cn("group relative grid cursor-pointer rounded-lg pr-2 leading-normal outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring [&_svg]:shrink-0",
              leavingRow ? "vks-tree-out pointer-events-none" : fresh.current.has(n.id) && "vks-tree-row",
              sel && "bg-primary/10 font-semibold text-primary hover:bg-primary/15 dark:text-foreground")}
            style={{ paddingLeft: 6 + depth * 18 }}>
            {depth > 0 && <span aria-hidden className="absolute inset-y-0 w-px bg-border" style={{ left: 15 + (depth - 1) * 18 }} />}
            <div className="min-h-0 overflow-hidden"><div className="flex min-h-10 items-center gap-2">
              {n.children ? <ChevronRight aria-hidden className={cn("size-4 text-muted-foreground transition-transform duration-300 ease-[cubic-bezier(.34,1.4,.64,1)]", open && "rotate-90")} /> : <span className="w-4" />}
              {n.icon && <span className="text-muted-foreground group-aria-selected:text-current [&_svg]:size-4">{n.icon}</span>}
              <span className="min-w-0 flex-1 truncate">{n.label}</span>{n.badge}
            </div></div>
          </li>
        )
      })}
    </ul>
  )
}

/* ------------------------------------------------------------------ Stat card */
const statTone = { primary: "bg-primary/10 text-primary dark:text-foreground", success: "bg-success/12 text-success", warning: "bg-warning/15 text-warning-foreground dark:text-warning", destructive: "bg-destructive/10 text-destructive", muted: "bg-muted text-muted-foreground" }
/** Tiny inline SVG trend line (no chart library). */
export function TrendLine({ data, className }: { data: number[]; className?: string }) {
  if (data.length < 2) return null
  const mn = Math.min(...data), mx = Math.max(...data), W = 100, H = 30, r = mx - mn || 1
  const pts = data.map((v, i) => [(i / (data.length - 1)) * W, H - 2 - ((v - mn) / r) * (H - 4)])
  const d = pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ")
  return (
    <svg viewBox={"0 0 " + W + " " + H} preserveAspectRatio="none" aria-hidden className={cn("h-8 w-full overflow-visible", className)}>
      <path d={d + " L" + W + " " + H + " L0 " + H + " Z"} className="fill-current opacity-10" />
      <path d={d} className="vks-spark fill-none stroke-current" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" pathLength={1} />
    </svg>
  )
}
/**
 * Dashboard KPI tile: label, big number, delta vs last period, optional sparkline.
 * goodWhen="down" for metrics where lower is better (late check-ins, incidents).
 * On phones it becomes a compact row (icon, label + number, delta + trend) so four tiles fit one screen;
 * layout="card" forces the tall tile, layout="row" forces the row. flush drops the card chrome so rows form one full-width grouped list.
 */
export function StatCard({ label, value, delta, goodWhen = "up", icon, tone = "primary", trend, hint, layout = "auto", flush, className }: {
  label: string; value: React.ReactNode; delta?: number; goodWhen?: "up" | "down"; icon?: React.ReactNode; tone?: keyof typeof statTone; trend?: number[]; hint?: string; layout?: "auto" | "card" | "row"; /** Phone row only: drop the border, radius and shadow so tiles sit in one edge-to-edge grouped list (hairline between rows). */ flush?: boolean; className?: string
}) {
  const mobile = useIsMobile()
  const row = layout === "row" || (layout === "auto" && mobile)
  const good = delta === undefined || delta === 0 ? null : (delta > 0) === (goodWhen === "up")
  const chip = delta !== undefined && (
    <span className={cn("inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-xs font-semibold leading-normal tabular-nums", good === null ? "bg-muted text-muted-foreground" : good ? "bg-success/12 text-success" : "bg-destructive/10 text-destructive")}>
      {delta > 0 ? <ArrowUpRight className="size-3.5" /> : delta < 0 ? <ArrowDownRight className="size-3.5" /> : null}{Math.abs(delta)}%
    </span>
  )
  const lineCls = good === false ? "text-destructive" : tone === "muted" ? "text-muted-foreground" : "text-primary dark:text-foreground"
  if (row) return (
    <div className={cn("relative flex min-h-[72px] items-center gap-3 overflow-hidden bg-card p-3 text-card-foreground", flush ? "border-b px-4 last:border-b-0" : "rounded-2xl border shadow-sm", className)}>
      {icon && <span className={cn("grid size-11 shrink-0 place-items-center rounded-xl [&_svg]:size-5", statTone[tone])}>{icon}</span>}
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-medium leading-normal text-muted-foreground">{label}</p>
        <div className="text-2xl font-bold leading-tight tracking-tight tabular-nums">{value}</div>
        {hint && <p className="truncate text-xs leading-normal text-muted-foreground">{hint}</p>}
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1.5">
        {chip}
        {trend && <TrendLine data={trend} className={cn("!h-6 w-16", lineCls)} />}
      </div>
    </div>
  )
  return (
    <div className={cn("relative overflow-hidden rounded-2xl border bg-card p-4 text-card-foreground shadow-sm transition-[translate,box-shadow] duration-300 [@media(hover:hover)]:hover:-translate-y-0.5 [@media(hover:hover)]:hover:shadow-md", className)}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-[13px] font-medium leading-normal text-muted-foreground">{label}</p>
        {icon && <span className={cn("grid size-9 place-items-center rounded-xl [&_svg]:size-[18px]", statTone[tone])}>{icon}</span>}
      </div>
      <div className="mt-1 text-[1.75rem] font-bold leading-tight tracking-tight tabular-nums">{value}</div>
      <div className="mt-1 flex items-center gap-2 text-xs leading-normal">
        {chip}
        {hint && <span className="text-muted-foreground">{hint}</span>}
      </div>
      {trend && <TrendLine data={trend} className={cn("mt-3", lineCls)} />}
    </div>
  )
}

/* ------------------------------------------------------------------ Button group */
/** Joins Buttons into one segmented bar (shared borders, rounded ends). For single-choice toggles use ToggleGroup instead. */
export function ButtonGroup({ children, className, vertical, label }: { children: React.ReactNode; className?: string; vertical?: boolean; label?: string }) {
  return (
    <div role="group" aria-label={label} className={cn("inline-flex isolate [&>*]:rounded-none [&>*:focus-visible]:z-10",
      vertical ? "flex-col [&>*:first-child]:rounded-t-xl [&>*:last-child]:rounded-b-xl [&>*+*]:-mt-px" : "[&>*:first-child]:rounded-l-xl [&>*:last-child]:rounded-r-xl [&>*+*]:-ml-px", className)}>{children}</div>
  )
}

/* ------------------------------------------------------------------ Dropzone */
/** Human file size: 1536 → "1.5 KB". */
export function fmtBytes(n: number): string {
  if (n < 1024) return n + " B"
  const u = ["KB", "MB", "GB"]; let i = -1
  do { n /= 1024; i++ } while (n >= 1024 && i < 2)
  return (n < 10 ? n.toFixed(1) : Math.round(n)) + " " + u[i]
}
/** True when a file matches an accept string like "image/*,.pdf". Pure. */
export function acceptsFile(f: { name: string; type: string }, accept?: string): boolean {
  if (!accept) return true
  return accept.split(",").some((raw) => {
    const a = raw.trim().toLowerCase()
    return a.startsWith(".") ? f.name.toLowerCase().endsWith(a) : a.endsWith("/*") ? f.type.startsWith(a.slice(0, -1)) : f.type === a
  })
}
/**
 * Drag files in (desktop) or tap to pick (phone). Checks type (accept) and size (maxSize bytes),
 * reports rejects through onReject. The area glows while a file hovers over it.
 */
export function Dropzone({ onFiles, onReject, accept, maxSize = 10 * 1024 * 1024, multiple = true, title = "ລາກໄຟລ໌ມາວາງ ຫຼື ກົດເພື່ອເລືອກ", hint, disabled, className, files, onRemove }: {
  onFiles: (f: File[]) => void; onReject?: (f: File, reason: "type" | "size") => void; accept?: string; maxSize?: number; multiple?: boolean; title?: string; hint?: string; disabled?: boolean; className?: string
  /** Picked files to list under the zone (icon, name, size). Pass onRemove to show a remove button per file. */
  files?: { name: string; type?: string; size?: number }[]; onRemove?: (index: number) => void
}) {
  const zone = <DropArea {...{ onFiles, onReject, accept, maxSize, multiple, title, hint, disabled, className }} />
  if (!files) return zone
  const seen = new Map<string, number>()
  return <div className="space-y-2">{zone}{files.length > 0 && <div className="space-y-2">{files.map((x, i) => {
    const base = x.name + ":" + (x.size ?? ""), n = seen.get(base) ?? 0
    seen.set(base, n + 1)
    return <DropFile key={base + ":" + n} file={x} onRemove={onRemove && (() => onRemove(i))} />
  })}</div>}</div>
}
/** One listed file: slides away on remove (then tells the parent), the rows below glide up. */
function DropFile({ file, onRemove }: { file: { name: string; type?: string; size?: number }; onRemove?: () => void }) {
  const el = React.useRef<HTMLDivElement>(null), [leaving, setLeaving] = React.useState(false)
  useFlip(el, { disabled: leaving })
  const remove = () => {
    if (leaving) return
    haptics.tap()
    if (typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches) return onRemove?.()
    setLeaving(true)
    setTimeout(() => onRemove?.(), 240)
  }
  return <div ref={el} data-leaving={leaving || undefined} className="vks-file"><FileItem name={file.name} type={file.type} size={file.size} onRemove={onRemove && remove} /></div>
}
function DropArea({ onFiles, onReject, accept, maxSize, multiple, title, hint, disabled, className }: {
  onFiles: (f: File[]) => void; onReject?: (f: File, reason: "type" | "size") => void; accept?: string; maxSize: number; multiple: boolean; title: string; hint?: string; disabled?: boolean; className?: string
}) {
  const [over, setOver] = React.useState(false), inp = React.useRef<HTMLInputElement>(null), depth = React.useRef(0)
  const take = (list: FileList | null) => {
    if (!list) return
    const good: File[] = []
    for (const f of Array.from(list).slice(0, multiple ? undefined : 1)) {
      if (!acceptsFile(f, accept)) onReject?.(f, "type"); else if (f.size > maxSize) onReject?.(f, "size"); else good.push(f)
    }
    if (good.length) { haptics.success(); onFiles(good) } else haptics.error()
  }
  return (
    <div role="button" tabIndex={disabled ? -1 : 0} aria-disabled={disabled} data-over={over}
      onClick={() => { if (!disabled) inp.current?.click() }} onKeyDown={(e) => { if ((e.key === "Enter" || e.key === " ") && !disabled) { e.preventDefault(); inp.current?.click() } }}
      onDragEnter={(e) => { e.preventDefault(); if (!disabled) { depth.current++; setOver(true) } }} onDragOver={(e) => e.preventDefault()}
      onDragLeave={() => { depth.current = Math.max(0, depth.current - 1); if (!depth.current) setOver(false) }}
      onDrop={(e) => { e.preventDefault(); depth.current = 0; setOver(false); if (!disabled) take(e.dataTransfer.files) }}
      className={cn("group relative flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-input bg-muted/30 px-6 py-10 text-center outline-none transition-colors hover:border-primary/40 hover:bg-muted/60 focus-visible:ring-2 focus-visible:ring-ring",
        "data-[over=true]:border-primary data-[over=true]:bg-primary/5", disabled && "pointer-events-none opacity-50", className)}>
      <span className="grid size-12 place-items-center rounded-2xl bg-card text-primary shadow-sm transition-transform duration-300 ease-[cubic-bezier(.34,1.4,.64,1)] group-data-[over=true]:-translate-y-1 group-data-[over=true]:scale-110 dark:text-foreground"><FileUp className="size-6" /></span>
      <p className="text-sm font-semibold leading-normal">{title}</p>
      <p className="text-xs leading-normal text-muted-foreground">{hint ?? ((accept ? accept.replace(/,/g, ", ") + " · " : "") + "ສູງສຸດ " + fmtBytes(maxSize))}</p>
      <input ref={inp} type="file" hidden accept={accept} multiple={multiple} onChange={(e) => { take(e.target.files); e.target.value = "" }} />
    </div>
  )
}

/* ------------------------------------------------------------------ Tag input */
/** Split pasted/typed text into clean, de-duplicated tags (comma, semicolon, newline). Pure. */
export function parseTags(raw: string, existing: string[] = [], max = Infinity): string[] {
  const out = [...existing]
  for (const t of raw.split(/[,;\n]+/).map((s) => s.normalize("NFC").trim().replace(/\s+/g, " ")).filter(Boolean)) {
    if (out.length >= max) break
    if (!out.some((o) => o.toLowerCase() === t.toLowerCase())) out.push(t)
  }
  return out
}
/** One tag: pops in from the caret side, glides when neighbours change, shrinks away (x spins) on remove. */
function Tag({ label, leaving, onRemove }: { label: string; leaving: boolean; onRemove: () => void }) {
  const el = React.useRef<HTMLSpanElement>(null)
  useFlip(el, { disabled: leaving })
  return (
    <span ref={el} data-leaving={leaving || undefined} className="vks-tag inline-flex h-8 items-center gap-1 rounded-lg bg-primary/10 pl-2.5 pr-1 text-[13px] font-medium leading-normal text-primary dark:text-foreground">
      {label}<button type="button" aria-label={"ລຶບ " + label} disabled={leaving} onClick={(e) => { e.stopPropagation(); onRemove() }} className="vks-chip-x grid size-6 place-items-center rounded-md hover:bg-primary/15"><X className="size-3.5" /></button>
    </span>
  )
}
/** Chips you type: Enter or comma adds, Backspace on empty removes the last, paste splits a list. Optional suggestions. */
export function TagInput({ value, onChange, placeholder = "ພິມແລ້ວກົດ Enter", suggestions = [], max, className }: {
  value: string[]; onChange: (v: string[]) => void; placeholder?: string; suggestions?: string[]; max?: number; className?: string
}) {
  const [q, setQ] = React.useState(""), inp = React.useRef<HTMLInputElement>(null), [hot, setHot] = React.useState(-1)
  // removing = play the exit first, then tell the parent. The ref keeps rapid removals from undoing each other.
  const [leaving, setLeaving] = React.useState<string[]>([]), latest = React.useRef(value)
  latest.current = value
  const remove = (t: string) => {
    if (leaving.includes(t)) return
    haptics.tap(); setLeaving((l) => [...l, t])
    window.setTimeout(() => { onChange(latest.current.filter((x) => x !== t)); setLeaving((l) => l.filter((x) => x !== t)) }, 240)
  }
  const add = (raw: string) => { const n = parseTags(raw, value, max); if (n.length !== value.length) { haptics.tap(); onChange(n) } setQ(""); setHot(-1) }
  const sug = q ? suggestions.filter((s) => s.toLowerCase().includes(q.toLowerCase()) && !value.includes(s)).slice(0, 6) : []
  const full = max !== undefined && value.length >= max
  return (
    <div className={cn("relative", className)}>
      <div onClick={() => inp.current?.focus()} className="flex min-h-11 w-full cursor-text flex-wrap items-center gap-1.5 rounded-xl border border-input bg-card px-2 py-1.5 transition-shadow focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/30">
        {value.map((t) => (
          <Tag key={t} label={t} leaving={leaving.includes(t)} onRemove={() => remove(t)} />
        ))}
        <input ref={inp} value={q} disabled={full} placeholder={value.length ? "" : placeholder} aria-label={placeholder}
          onChange={(e) => { const v = e.target.value; if (/[,;\n]/.test(v)) add(v); else { setQ(v); setHot(-1) } }}
          onPaste={(e) => { const t = e.clipboardData.getData("text"); if (/[,;\n]/.test(t)) { e.preventDefault(); add(t) } }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.nativeEvent.isComposing) { e.preventDefault(); add(hot >= 0 && sug[hot] ? sug[hot] : q) }
            else if (e.key === "Backspace" && !q) { const last = [...value].reverse().find((x) => !leaving.includes(x)); if (last) remove(last) }
            else if (e.key === "ArrowDown" && sug.length) { e.preventDefault(); setHot((h) => (h + 1) % sug.length) }
            else if (e.key === "ArrowUp" && sug.length) { e.preventDefault(); setHot((h) => (h <= 0 ? sug.length - 1 : h - 1)) }
            else if (e.key === "Escape") setQ("")
          }}
          onBlur={() => { if (q.trim()) add(q) }} className="h-8 min-w-24 flex-1 bg-transparent px-1 text-[15px] leading-normal outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed" />
      </div>
      {sug.length > 0 && (
        <ul role="listbox" className={cn(panel, "absolute inset-x-0 top-full mt-1.5")}>
          {sug.map((s, i) => <li key={s} role="option" aria-selected={i === hot} onMouseDown={(e) => { e.preventDefault(); add(s) }} className={cn(itemCls, i === hot && "bg-foreground/10")}>{s}</li>)}
        </ul>
      )}
      {max !== undefined && <p className="mt-1 text-right text-[11px] tabular-nums text-muted-foreground">{value.length}/{max}</p>}
    </div>
  )
}

/* ------------------------------------------------------------------ Split pane */
/**
 * Resizable two-pane layout (list | detail) for desktop. Drag or use ← → on the divider; double-click resets.
 * Size is a % of the width and is remembered in localStorage when storageKey is set. Stacks on phones.
 */
export function SplitPane({ left, right, defaultSize = 38, min = 20, max = 70, storageKey, className }: {
  left: React.ReactNode; right: React.ReactNode; defaultSize?: number; min?: number; max?: number; storageKey?: string; className?: string
}) {
  const [size, setSize] = React.useState(() => {
    const s = storageKey && typeof localStorage !== "undefined" ? Number(localStorage.getItem(storageKey)) : NaN
    return Number.isFinite(s) && s > 0 ? s : defaultSize
  })
  const box = React.useRef<HTMLDivElement>(null), [drag, setDrag] = React.useState(false)
  const set = (v: number) => {
    const c = Math.max(min, Math.min(max, v)); setSize(c)
    if (storageKey) { try { localStorage.setItem(storageKey, String(Math.round(c * 10) / 10)) } catch { /* private mode */ } }
  }
  return (
    <div ref={box} className={cn("flex flex-col overflow-hidden rounded-2xl border bg-card md:flex-row", drag && "select-none", className)} style={{ ["--split" as string]: size + "%" }}>
      <div className="min-h-0 min-w-0 overflow-auto md:w-[var(--split)] md:shrink-0">{left}</div>
      <div role="separator" aria-orientation="vertical" aria-valuenow={Math.round(size)} aria-valuemin={min} aria-valuemax={max} aria-label="ປັບຂະໜາດ" tabIndex={0}
        onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); setDrag(true) }}
        onPointerMove={(e) => { if (!drag || !box.current) return; const r = box.current.getBoundingClientRect(); set(((e.clientX - r.left) / r.width) * 100) }}
        onPointerUp={() => setDrag(false)} onPointerCancel={() => setDrag(false)} onDoubleClick={() => set(defaultSize)}
        onKeyDown={(e) => { if (e.key === "ArrowLeft") set(size - 2); if (e.key === "ArrowRight") set(size + 2); if (e.key === "Home") set(min); if (e.key === "End") set(max) }}
        className="group relative hidden w-px shrink-0 cursor-col-resize touch-none bg-border outline-none md:block">
        <span className="absolute inset-y-0 -left-2 -right-2" />
        <span className={cn("absolute left-1/2 top-1/2 h-10 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-border transition-[scale,background-color] duration-200 group-hover:scale-y-125 group-hover:bg-primary/50 group-focus-visible:bg-primary", drag && "scale-y-150 bg-primary")} />
      </div>
      <div className="min-h-0 min-w-0 flex-1 overflow-auto border-t md:border-t-0">{right}</div>
    </div>
  )
}

/* ------------------------------------------------------------------ Notification list */
export type Notice = { id: string; title: string; body?: string; time: string; read?: boolean; tone?: "info" | "success" | "warning" | "danger"; icon?: React.ReactNode; group?: string }
const noticeDot = { info: "bg-primary", success: "bg-success", warning: "bg-warning", danger: "bg-destructive" }
/**
 * Notification centre list (bell popover on desktop, full page on phones). Grouped by group ("ມື້ນີ້", "ມື້ວານ"),
 * unread rows get a dot + tint; "mark all read" in the header. Put it inside PopoverContent for the bell.
 */
export function NotificationList({ items, onOpen, onMarkAll, onDismiss, title = "ແຈ້ງເຕືອນ", markAllLabel = "ອ່ານທັງໝົດ", emptyLabel = "ບໍ່ມີແຈ້ງເຕືອນໃໝ່", className }: {
  items: Notice[]; onOpen?: (n: Notice) => void; onMarkAll?: () => void; onDismiss?: (n: Notice) => void; title?: string; markAllLabel?: string; emptyLabel?: string; className?: string
}) {
  const unread = items.filter((n) => !n.read).length
  const groups: [string, Notice[]][] = []
  for (const n of items) { const g = n.group ?? ""; const hit = groups.find((a) => a[0] === g); if (hit) hit[1].push(n); else groups.push([g, [n]]) }
  return (
    <div className={cn("flex flex-col", className)}>
      <div className="flex items-center gap-2 px-4 pb-2 pt-3">
        <h3 className="text-[17px] font-semibold leading-normal">{title}</h3>
        {unread > 0 && <span key={unread} className="vks-badge-pop rounded-full bg-destructive px-1.5 text-[11px] font-bold leading-5 text-destructive-foreground tabular-nums">{unread}</span>}
        {onMarkAll && unread > 0 && <button type="button" onClick={onMarkAll} className="vks-press ml-auto min-h-11 rounded-lg px-2.5 text-[13px] font-medium text-primary hover:bg-muted dark:text-foreground">{markAllLabel}</button>}
      </div>
      {items.length === 0 ? <Empty size="sm" icon={<Bell />} title={emptyLabel} className="py-8" /> : (
        <div className="vks-stagger">
          {groups.map(([g, ns]) => (
            <section key={g} aria-label={g || title}>
              {g && <h4 className="px-4 pb-1 pt-2 text-[11px] font-semibold uppercase leading-normal tracking-wide text-muted-foreground">{g}</h4>}
              {ns.map((n, i) => (
                <div key={n.id} style={{ ["--i" as string]: i }} className={cn("group relative flex gap-3 px-4 py-3 transition-colors hover:bg-muted/60", !n.read && "bg-primary/[.04]")}>
                  <button type="button" onClick={() => onOpen?.(n)} className="absolute inset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring" aria-label={n.title} />
                  <span className="relative mt-0.5 grid size-9 shrink-0 place-items-center rounded-full bg-muted text-muted-foreground [&_svg]:size-[18px]">
                    {n.icon}{!n.read && <span className={cn("absolute -right-0.5 -top-0.5 size-2.5 rounded-full ring-2 ring-card", noticeDot[n.tone ?? "info"])} />}
                  </span>
                  <div className="pointer-events-none min-w-0 flex-1">
                    <div className="flex items-baseline gap-2"><p className={cn("min-w-0 flex-1 truncate text-sm leading-normal", !n.read ? "font-semibold" : "font-medium text-foreground/80")}>{n.title}</p><span className="shrink-0 text-[11px] text-muted-foreground">{n.time}</span></div>
                    {n.body && <p className="line-clamp-2 text-[13px] leading-normal text-muted-foreground">{n.body}</p>}
                  </div>
                  {onDismiss && <button type="button" aria-label="ປິດ" onClick={() => onDismiss(n)} className="relative -mr-2 grid size-8 shrink-0 place-items-center rounded-full text-muted-foreground opacity-0 transition-opacity hover:bg-foreground/10 focus-visible:opacity-100 group-hover:opacity-100 [@media(hover:none)]:opacity-100"><X className="size-4" /></button>}
                </div>
              ))}
            </section>
          ))}
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ Scroll area */
/** Thin overlay scrollbar that matches the theme (desktop). Content still scrolls natively on touch. */
export function ScrollArea({ children, className, viewportClassName, horizontal }: { children: React.ReactNode; className?: string; viewportClassName?: string; horizontal?: boolean }) {
  const bar = "flex touch-none select-none p-0.5 transition-opacity duration-200 data-[state=hidden]:opacity-0"
  return (
    <SA.Root type="hover" className={cn("relative overflow-hidden", className)}>
      <SA.Viewport className={cn("size-full rounded-[inherit]", viewportClassName)}>{children}</SA.Viewport>
      <SA.Scrollbar orientation="vertical" className={cn(bar, "w-2.5")}><SA.Thumb className="relative flex-1 rounded-full bg-foreground/25 hover:bg-foreground/40" /></SA.Scrollbar>
      {horizontal && <SA.Scrollbar orientation="horizontal" className={cn(bar, "h-2.5 flex-col")}><SA.Thumb className="relative flex-1 rounded-full bg-foreground/25 hover:bg-foreground/40" /></SA.Scrollbar>}
      <SA.Corner />
    </SA.Root>
  )
}