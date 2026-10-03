import * as React from "react"
import { cn } from "../lib/cn"

/* Roadmap (Gantt) + DependencyMap. Plain divs/SVG, no extra deps, tokens only. */

export type PlanTone = "primary" | "gold" | "success" | "warning" | "destructive" | "muted"
const BG: Record<PlanTone, string> = { primary: "bg-primary", gold: "bg-gold", success: "bg-success", warning: "bg-warning", destructive: "bg-destructive", muted: "bg-muted-foreground/60" }
const VAR: Record<PlanTone, string> = { primary: "var(--primary)", gold: "var(--gold)", success: "var(--success)", warning: "var(--warning)", destructive: "var(--destructive)", muted: "var(--muted-foreground)" }

const DAY = 86400000
const toMs = (d: string) => Date.parse(d.length === 10 ? d + "T00:00:00Z" : d)
/** Position of a date inside [start, end] as 0..100 (clamped). Pure, unit tested. */
export function planPct(date: string, start: string, end: string): number {
  const a = toMs(start), b = toMs(end), x = toMs(date)
  if (!(b > a) || Number.isNaN(x)) return 0
  return Math.min(100, Math.max(0, ((x - a) / (b - a)) * 100))
}
/** Month ticks between two ISO dates: [{ label, at }] where at is the first of each month. Pure, unit tested. */
export function planMonths(start: string, end: string, locale = "en"): { label: string; at: string }[] {
  const s = new Date(toMs(start)), e = toMs(end), out: { label: string; at: string }[] = []
  let y = s.getUTCFullYear(), m = s.getUTCMonth()
  for (let i = 0; i < 120; i++) {
    const d = Date.UTC(y, m, 1); if (d >= e) break
    const iso = new Date(d).toISOString().slice(0, 10)
    out.push({ label: new Date(d).toLocaleString(locale, { month: "short", timeZone: "UTC" }) + (m === 0 ? " " + String(y).slice(2) : ""), at: iso < start ? start : iso })
    m++; if (m > 11) { m = 0; y++ }
  }
  return out
}

export type RoadmapRow = { id: string; label: string; sub?: string; start: string; end: string; progress?: number; tone?: PlanTone }
export type RoadmapMilestone = { id: string; at: string; label: string }

/** Use for phases or projects laid out over months (Gantt): bars with progress fill, gold diamond milestones and a today line. For a list of past events use Timeline; for work-item status use Kanban. */
export function Roadmap({ rows, milestones = [], start, end, today, onSelect, onMilestone, milestoneLabel = "Milestones", todayLabel = "today", locale = "en", className }: {
  rows: RoadmapRow[]; milestones?: RoadmapMilestone[]; start: string; end: string; today?: string
  onSelect?: (row: RoadmapRow) => void; onMilestone?: (m: RoadmapMilestone) => void
  milestoneLabel?: string; todayLabel?: string; locale?: string; className?: string
}) {
  const months = React.useMemo(() => planMonths(start, end, locale), [start, end, locale])
  const t = today ? planPct(today, start, end) : -1
  const col = "grid grid-cols-[minmax(120px,170px)_1fr]"
  return (
    <div className={cn("overflow-x-auto", className)} role="table" aria-label="Roadmap">
      <div className="relative min-w-[680px]">
        <div className={cn(col, "border-b pb-1.5 font-mono text-[11px] text-muted-foreground")} role="row">
          <div role="columnheader">Phase</div>
          <div className="relative h-4">{months.map((m) => <span key={m.at} className="absolute" style={{ left: planPct(m.at, start, end) + "%" }}>{m.label}</span>)}</div>
        </div>
        {rows.map((r) => {
          const l = planPct(r.start, start, end), w = Math.max(1.2, planPct(r.end, start, end) - l), tone = r.tone ?? "primary"
          return (
            <div key={r.id} className={cn(col, "h-11 items-center border-b border-dashed")} role="row">
              <button type="button" onClick={() => onSelect?.(r)} className="truncate text-left text-sm font-medium leading-tight hover:text-gold">
                {r.label}{r.sub && <span className="block text-[11px] font-normal text-muted-foreground">{r.sub}</span>}
              </button>
              <div className="relative h-full">
                {months.map((m) => <span key={m.at} aria-hidden className="absolute inset-y-0 w-px bg-border/70" style={{ left: planPct(m.at, start, end) + "%" }} />)}
                <button type="button" onClick={() => onSelect?.(r)} title={r.label + " · " + r.start + " → " + r.end}
                  className={cn("absolute top-1/2 h-6 -translate-y-1/2 overflow-hidden rounded-md text-left transition-transform hover:-translate-y-[55%] focus-visible:ring-2 focus-visible:ring-ring", BG[tone])}
                  style={{ left: l + "%", width: w + "%" }}>
                  {!!r.progress && <span className="absolute inset-y-0 left-0 bg-background/35" style={{ width: Math.min(100, r.progress) + "%" }} />}
                  {!!r.progress && <span className="relative px-2 font-mono text-[10px] font-semibold text-primary-foreground">{Math.round(r.progress)}%</span>}
                </button>
              </div>
            </div>
          )
        })}
        {milestones.length > 0 && (
          <div className={cn(col, "h-11 items-center")} role="row">
            <div className="text-sm font-medium">{milestoneLabel}</div>
            <div className="relative h-full">
              {milestones.map((m) => (
                <button key={m.id} type="button" onClick={() => onMilestone?.(m)} title={m.label + " · " + m.at} aria-label={m.label}
                  className="absolute top-1/2 grid size-8 -translate-x-1/2 -translate-y-1/2 place-items-center"
                  style={{ left: planPct(m.at, start, end) + "%" }}>
                  <span className="size-3.5 rotate-45 border-2 border-card bg-gold shadow-[0_0_0_1px_var(--gold)] transition-transform hover:scale-125" />
                </button>
              ))}
            </div>
          </div>
        )}
        {t >= 0 && t <= 100 && (
          <div aria-hidden className="pointer-events-none absolute bottom-0 top-6 grid grid-cols-[minmax(120px,170px)_1fr]" style={{ left: 0, right: 0 }}>
            <div />
            <div className="relative"><div className="absolute inset-y-0 w-0.5 bg-destructive" style={{ left: t + "%" }}><span className="absolute -top-4 -translate-x-1/2 font-mono text-[10px] font-semibold text-destructive">{todayLabel}</span></div></div>
          </div>
        )}
      </div>
    </div>
  )
}

export type DepNode = { id: string; label: string; sub?: string; column: number; deps?: string[]; tone?: PlanTone }
export type DepLayout = { x: number; y: number; w: number; h: number }
/** Place nodes in columns (left to right) and stack them top-down. Pure, unit tested. */
export function layoutDeps(nodes: DepNode[], { colW = 190, nodeW = 156, nodeH = 42, gapY = 16, top = 24 } = {}): { pos: Record<string, DepLayout>; width: number; height: number } {
  const pos: Record<string, DepLayout> = {}, rows: Record<number, number> = {}
  let maxC = 0, maxR = 0
  for (const n of nodes) {
    const r = rows[n.column] ?? 0; rows[n.column] = r + 1
    pos[n.id] = { x: n.column * colW, y: top + r * (nodeH + gapY), w: nodeW, h: nodeH }
    maxC = Math.max(maxC, n.column); maxR = Math.max(maxR, r)
  }
  return { pos, width: maxC * colW + nodeW + 4, height: top + (maxR + 1) * (nodeH + gapY) }
}

/** Use for "what must be built before what": boxes in columns (phases) with arrows from each dependency. Hover or focus a box to light up its chain. For a status board use Kanban; for dates use Roadmap. */
export function DependencyMap({ nodes, columns = [], onSelect, className }: { nodes: DepNode[]; columns?: string[]; onSelect?: (node: DepNode) => void; className?: string }) {
  const { pos, width, height } = React.useMemo(() => layoutDeps(nodes), [nodes])
  const [hot, setHot] = React.useState<string | null>(null)
  const lit = React.useMemo(() => {
    if (!hot) return null
    const s = new Set<string>([hot]), up = (id: string) => nodes.find((n) => n.id === id)?.deps?.forEach((d) => { if (!s.has(d)) { s.add(d); up(d) } })
    const down = (id: string) => nodes.forEach((n) => { if (n.deps?.includes(id) && !s.has(n.id)) { s.add(n.id); down(n.id) } })
    up(hot); down(hot); return s
  }, [hot, nodes])
  const fit = (s: string, n: number) => (s.length > n ? s.slice(0, n - 1) + "…" : s)
  return (
    <div className={cn("overflow-x-auto", className)}>
      <svg width={width} height={height} viewBox={"0 0 " + width + " " + height} className="block font-sans" role="img" aria-label="Dependency map">
        <defs><marker id="vks-dep-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" fill="var(--muted-foreground)" /></marker></defs>
        {columns.map((c, i) => <text key={i} x={i * 190} y={12} fontSize={10} fontWeight={700} fill="var(--muted-foreground)">{c}</text>)}
        {nodes.flatMap((n) => (n.deps ?? []).map((d) => {
          const a = pos[d], b = pos[n.id]; if (!a || !b) return null
          const on = lit ? lit.has(d) && lit.has(n.id) : true
          const x1 = a.x + a.w, y1 = a.y + a.h / 2, x2 = b.x - 2, y2 = b.y + b.h / 2, mx = (x1 + x2) / 2
          return <path key={d + ">" + n.id} d={"M" + x1 + " " + y1 + " C" + mx + " " + y1 + " " + mx + " " + y2 + " " + x2 + " " + y2} fill="none" stroke={on && lit ? "var(--gold)" : "var(--input)"} strokeWidth={on && lit ? 2 : 1.3} opacity={on ? 1 : 0.25} markerEnd="url(#vks-dep-arrow)" />
        }))}
        {nodes.map((n) => {
          const p = pos[n.id], c = VAR[n.tone ?? "primary"], dim = lit && !lit.has(n.id)
          return (
            <g key={n.id} transform={"translate(" + p.x + "," + p.y + ")"} opacity={dim ? 0.3 : 1} tabIndex={0} role="button" aria-label={n.label}
              className="cursor-pointer outline-none transition-opacity" onClick={() => onSelect?.(n)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onSelect?.(n) } }}
              onMouseEnter={() => setHot(n.id)} onMouseLeave={() => setHot(null)} onFocus={() => setHot(n.id)} onBlur={() => setHot(null)}>
              <title>{n.label}</title>
              <rect width={p.w} height={p.h} rx={9} fill="var(--card)" stroke={hot === n.id ? "var(--gold)" : c} strokeWidth={hot === n.id ? 2 : 1.4} />
              <rect width={5} height={p.h} rx={2} fill={c} />
              <text x={12} y={n.sub ? 17 : 26} fontSize={11} fontWeight={700} fill="var(--foreground)">{fit(n.label, 24)}</text>
              {n.sub && <text x={12} y={32} fontSize={9.5} fill={c}>{fit(n.sub, 28)}</text>}
            </g>
          )
        })}
      </svg>
    </div>
  )
}
