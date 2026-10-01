import * as React from "react"
import { Button } from "../components/button"
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "../components/overlay"
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, ComposedChart, Line, LineChart, Pie, PieChart, PolarAngleAxis, PolarGrid, PolarRadiusAxis,
  Radar, RadarChart, RadialBar, RadialBarChart, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis, ZAxis,
} from "recharts"

/** Colours come from theme tokens so charts follow light/dark. Import from "@vks/ui/charts" only in screens that show charts. */
export const chartColors = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"]
const axis = { stroke: "var(--muted-foreground)", fontSize: 12, tickLine: false, axisLine: false } as const
const grid = <CartesianGrid stroke="var(--border)" strokeDasharray="3 4" vertical={false} />
type Row = Record<string, string | number>
const fmt = (v: unknown) => typeof v === "number" ? v.toLocaleString("en-US") : String(v ?? "")

/** Animations on unless the user asked for less motion or the device runs in lite mode. */
const motionOn = () => typeof window === "undefined" || (!window.matchMedia("(prefers-reduced-motion: reduce)").matches && document.documentElement.dataset.perf !== "lite")
function useMotion() {
  const [on, setOn] = React.useState(motionOn)
  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    const read = () => setOn(motionOn())
    read(); mq.addEventListener("change", read); return () => mq.removeEventListener("change", read)
  }, [])
  return on
}
/** SVG ids must be unique per chart and safe inside url(#...). */
const useGid = () => "g" + React.useId().replace(/[^a-zA-Z0-9]/g, "")
const anim = (on: boolean, delay = 0) => ({ isAnimationActive: on, animationDuration: typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches ? 400 : 700, animationBegin: delay, animationEasing: "ease-out" as const })

/* ---------- tooltip + legend ---------- */
type TipItem = { name?: unknown; value?: unknown; color?: string; stroke?: string; fill?: string; payload?: Record<string, unknown>; dataKey?: unknown }
/** Card tooltip: title, colour dot per series, tabular numbers, optional unit. */
export function ChartTip({ active, payload, label, unit, labelKey }: { active?: boolean; payload?: readonly TipItem[]; label?: unknown; unit?: string; labelKey?: string }) {
  if (!active || !payload?.length) return null
  const title = labelKey ? payload[0]?.payload?.[labelKey] : label
  return (
    <div className="min-w-36 rounded-xl border bg-card/95 px-3 py-2 text-xs leading-normal text-foreground shadow-[0_12px_30px_-12px_rgb(20_23_61/.45)] backdrop-blur">
      {title !== undefined && title !== "" && <div className="mb-1.5 font-bold">{fmt(title)}</div>}
      <div className="space-y-1">
        {payload.map((p, i) => {
          const c = (p.payload?.fill as string) || p.color || p.stroke || p.fill || chartColors[i % 5]
          return <div key={i} className="flex items-center gap-2">
            <span className="size-2.5 shrink-0 rounded-full" style={{ background: c }} />
            <span className="flex-1 text-muted-foreground">{fmt(p.name)}</span>
            <span className="font-semibold tabular-nums">{fmt(p.value)}{unit ? " " + unit : ""}</span>
          </div>
        })}
      </div>
    </div>
  )
}
const tipEl = (unit?: string, labelKey?: string) => (p: object) => <ChartTip {...(p as { active?: boolean; payload?: TipItem[]; label?: unknown })} unit={unit} labelKey={labelKey} />

/** Pill legend. Pass onToggle to let people hide a series by tapping it. */
export function ChartLegend({ items, hidden, onToggle }: { items: { key: string; label?: string; color: string }[]; hidden?: Set<string>; onToggle?: (k: string) => void }) {
  return (
    <div className="mt-3 flex flex-wrap justify-center gap-1.5">
      {items.map((it) => {
        const off = hidden?.has(it.key)
        const inner = <><span className="size-2.5 rounded-full transition-transform duration-300" style={{ background: it.color, transform: off ? "scale(.5)" : undefined }} />{it.label ?? it.key}</>
        const cls = "inline-flex min-h-8 items-center gap-1.5 rounded-full border px-3 text-xs font-semibold leading-normal transition-opacity " + (off ? "opacity-45" : "")
        return onToggle
          ? <button key={it.key} type="button" aria-pressed={!off} onClick={() => onToggle(it.key)} className={cls + " vks-press bg-card hover:bg-muted"}>{inner}</button>
          : <span key={it.key} className={cls + " bg-card"}>{inner}</span>
      })}
    </div>
  )
}
function useHidden() {
  const [hidden, set] = React.useState<Set<string>>(new Set())
  const toggle = (k: string) => set((s) => { const n = new Set(s); if (n.has(k)) n.delete(k); else n.add(k); return n })
  return { hidden, toggle }
}
const labelOf = (labels: Record<string, string> | undefined, k: string) => labels?.[k] ?? k
type Common = { data: Row[]; x: string; height?: number; labels?: Record<string, string>; unit?: string; legend?: boolean }

/** Bars with a top-lit gradient and rounded caps. stacked = one column per x. Tap a legend pill to hide a series. */
export function BarSeries({ data, x, y, height = 240, labels, unit, legend = y.length > 1, stacked, horizontal }: Common & { y: string[]; stacked?: boolean; horizontal?: boolean }) {
  const id = useGid(), on = useMotion(), { hidden, toggle } = useHidden()
  const shown = y.filter((k) => !hidden.has(k))
  return <div>
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} layout={horizontal ? "vertical" : "horizontal"} barCategoryGap="22%" barGap={3}>
        <defs>{y.map((k, i) => <linearGradient key={k} id={id + i} x1="0" y1="0" x2={horizontal ? "1" : "0"} y2={horizontal ? "0" : "1"}>
          <stop offset="0%" stopColor={chartColors[i % 5]} stopOpacity={horizontal ? 0.75 : 1} /><stop offset="100%" stopColor={chartColors[i % 5]} stopOpacity={horizontal ? 1 : 0.7} /></linearGradient>)}</defs>
        {horizontal ? <CartesianGrid stroke="var(--border)" strokeDasharray="3 4" horizontal={false} /> : grid}
        {horizontal ? <><XAxis type="number" {...axis} /><YAxis type="category" dataKey={x} {...axis} width={72} /></> : <><XAxis dataKey={x} {...axis} /><YAxis {...axis} width={36} /></>}
        <Tooltip content={tipEl(unit)} cursor={{ fill: "var(--muted)", opacity: 0.6, radius: 8 } as object} />
        {y.map((k, i) => !hidden.has(k) && <Bar key={k} dataKey={k} name={labelOf(labels, k)} stackId={stacked ? "s" : undefined} fill={"url(#" + id + i + ")"} maxBarSize={36}
          radius={stacked ? (k === shown[shown.length - 1] ? (horizontal ? [0, 6, 6, 0] : [6, 6, 0, 0]) : 0) : (horizontal ? [0, 6, 6, 0] : [6, 6, 0, 0])} {...anim(on, i * 90)} />)}
      </BarChart>
    </ResponsiveContainer>
    {legend && <ChartLegend items={y.map((k, i) => ({ key: k, label: labelOf(labels, k), color: chartColors[i % 5] }))} hidden={hidden} onToggle={toggle} />}
  </div>
}

/** Smooth lines with a soft glow under the first series and an active-dot ring. */
export function LineSeries({ data, x, y, height = 240, labels, unit, legend = y.length > 1 }: Common & { y: string[] }) {
  const id = useGid(), on = useMotion(), { hidden, toggle } = useHidden()
  return <div>
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart data={data}>
        <defs><linearGradient id={id + "f"} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.18} /><stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} /></linearGradient></defs>
        {grid}<XAxis dataKey={x} {...axis} /><YAxis {...axis} width={36} />
        <Tooltip content={tipEl(unit)} cursor={{ stroke: "var(--muted-foreground)", strokeDasharray: "4 4", strokeOpacity: 0.5 }} />
        {!hidden.has(y[0]) && <Area dataKey={y[0]} tooltipType="none" legendType="none" type="monotone" stroke="none" fill={"url(#" + id + "f)"} {...anim(on)} />}
        {y.map((k, i) => !hidden.has(k) && <Line key={k} dataKey={k} name={labelOf(labels, k)} type="monotone" stroke={chartColors[i % 5]} strokeWidth={2.5} strokeDasharray={i > 0 && i % 2 ? "6 4" : undefined} dot={false}
          activeDot={{ r: 5, strokeWidth: 3, stroke: "var(--card)" }} {...anim(on, i * 120)} />)}
      </ComposedChart>
    </ResponsiveContainer>
    {legend && <ChartLegend items={y.map((k, i) => ({ key: k, label: labelOf(labels, k), color: chartColors[i % 5] }))} hidden={hidden} onToggle={toggle} />}
  </div>
}

/** Area with a vertical gradient fade. y can be one key or several (stacked). */
export function AreaSeries({ data, x, y, height = 240, labels, unit, legend }: Common & { y: string | string[] }) {
  const id = useGid(), on = useMotion(), keys = Array.isArray(y) ? y : [y]
  return <div>
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data}>
        <defs>{keys.map((k, i) => <linearGradient key={k} id={id + i} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={chartColors[i % 5]} stopOpacity={0.38} /><stop offset="95%" stopColor={chartColors[i % 5]} stopOpacity={0.02} /></linearGradient>)}</defs>
        {grid}<XAxis dataKey={x} {...axis} /><YAxis {...axis} width={36} />
        <Tooltip content={tipEl(unit)} cursor={{ stroke: "var(--muted-foreground)", strokeDasharray: "4 4", strokeOpacity: 0.5 }} />
        {keys.map((k, i) => <Area key={k} dataKey={k} name={labelOf(labels, k)} type="monotone" stackId={keys.length > 1 ? "s" : undefined} stroke={chartColors[i % 5]} strokeWidth={2.5} fill={"url(#" + id + i + ")"}
          activeDot={{ r: 5, strokeWidth: 3, stroke: "var(--card)" }} {...anim(on, i * 120)} />)}
      </AreaChart>
    </ResponsiveContainer>
    {(legend ?? keys.length > 1) && <ChartLegend items={keys.map((k, i) => ({ key: k, label: labelOf(labels, k), color: chartColors[i % 5] }))} />}
  </div>
}

/** Donut with the total (or your own label) in the hole and a legend with percentages. Hover lifts a slice. */
export function Donut({ data, height = 220, centerLabel, centerValue, unit, legend = true }: { data: { name: string; value: number }[]; height?: number; centerLabel?: string; centerValue?: React.ReactNode; unit?: string; legend?: boolean }) {
  const on = useMotion(), [hot, setHot] = React.useState<number | null>(null)
  const total = data.reduce((s, d) => s + d.value, 0) || 1
  return <div>
    <div className="relative" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%"><PieChart>
        <Tooltip content={tipEl(unit, "name")} />
        <Pie data={data} dataKey="value" nameKey="name" innerRadius="62%" outerRadius="86%" paddingAngle={3} cornerRadius={6} stroke="var(--card)" strokeWidth={2}
          onMouseEnter={(_, i) => setHot(i)} onMouseLeave={() => setHot(null)} {...anim(on)}>
          {data.map((_, i) => <Cell key={i} fill={chartColors[i % 5]} style={{ opacity: hot === null || hot === i ? 1 : 0.45, transition: "opacity .2s" }} />)}
        </Pie>
      </PieChart></ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center leading-normal">
        <span className="text-2xl font-bold tabular-nums">{centerValue ?? (hot !== null ? Math.round((data[hot].value / total) * 100) + "%" : fmt(total))}</span>
        <span className="text-xs text-muted-foreground">{hot !== null ? data[hot].name : centerLabel ?? "ລວມ"}</span>
      </div>
    </div>
    {legend && <ChartLegend items={data.map((d, i) => ({ key: d.name, label: d.name + " · " + Math.round((d.value / total) * 100) + "%", color: chartColors[i % 5] }))} />}
  </div>
}
/** Scatter / bubble. Each group is one colour; z (optional) sizes the bubbles. Great for "response time vs distance" style questions. */
export function ScatterSeries({ groups, x, y, z, height = 260, xLabel, yLabel, unit }: {
  groups: { name: string; data: Row[] }[]; x: string; y: string; z?: string; height?: number; xLabel?: string; yLabel?: string; unit?: string
}) {
  const on = useMotion(), { hidden, toggle } = useHidden()
  return <div>
    <ResponsiveContainer width="100%" height={height}>
      <ScatterChart margin={{ top: 8, right: 8, bottom: xLabel ? 16 : 0, left: 0 }}>
        <CartesianGrid stroke="var(--border)" strokeDasharray="3 4" />
        <XAxis type="number" dataKey={x} name={xLabel ?? x} {...axis} label={xLabel ? { value: xLabel, position: "insideBottom", offset: -8, fill: "var(--muted-foreground)", fontSize: 11 } : undefined} />
        <YAxis type="number" dataKey={y} name={yLabel ?? y} {...axis} width={40} />
        {z && <ZAxis type="number" dataKey={z} range={[40, 420]} name={z} />}
        <Tooltip content={tipEl(unit)} cursor={{ strokeDasharray: "4 4", stroke: "var(--muted-foreground)", strokeOpacity: 0.5 }} />
        {groups.map((g, i) => !hidden.has(g.name) && <Scatter key={g.name} name={g.name} data={g.data} fill={chartColors[i % 5]} fillOpacity={0.72} stroke="var(--card)" strokeWidth={1.5} {...anim(on, i * 120)} />)}
      </ScatterChart>
    </ResponsiveContainer>
    <ChartLegend items={groups.map((g, i) => ({ key: g.name, color: chartColors[i % 5] }))} hidden={hidden} onToggle={toggle} />
  </div>
}

/** Measures an element's width so a chart can swap to its phone form by its own box, not the screen. */
function useBox<T extends HTMLElement>() {
  const ref = React.useRef<T>(null), [w, setW] = React.useState(0)
  React.useEffect(() => {
    const el = ref.current; if (!el) return
    setW(el.clientWidth)
    const ro = new ResizeObserver(([e]) => setW(e.contentRect.width)); ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return [ref, w] as const
}
/** Phone form of the radar: one row per axis with a thin bar per series. Readable at 320 px where radar labels collide. */
function RadarBars({ data, axisKey, y, labels, max = 100, hidden, toggle }: { data: Row[]; axisKey: string; y: string[]; labels?: Record<string, string>; max?: number; hidden: Set<string>; toggle: (k: string) => void }) {
  const shown = y.filter((k) => !hidden.has(k))
  return <div>
    <ul className="space-y-3">
      {data.map((row, ri) => <li key={ri} className="leading-normal">
        <div className="mb-1 text-xs font-semibold">{fmt(row[axisKey])}</div>
        <div className="space-y-1">
          {shown.map((k) => {
            const i = y.indexOf(k), v = Number(row[k]) || 0
            return <div key={k} className="flex items-center gap-2">
              <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-muted"><div className="h-full origin-left rounded-full transition-transform duration-[400ms]" style={{ width: Math.min(100, (v / max) * 100) + "%", background: chartColors[i % 5] }} /></div>
              <span className="w-8 text-right text-xs font-semibold tabular-nums">{v}</span>
            </div>
          })}
        </div>
      </li>)}
    </ul>
    <ChartLegend items={y.map((k, i) => ({ key: k, label: labelOf(labels, k), color: chartColors[i % 5] }))} hidden={hidden} onToggle={toggle} />
  </div>
}

/** Use for comparing a few series across 4-8 skills or KPIs; on a narrow box (phone) it turns into comparison bars, because radar labels collide there. Pass compact to force a form. */
export function RadarSeries({ data, axisKey, y, height = 280, labels, max, compact }: { data: Row[]; axisKey: string; y: string[]; height?: number; labels?: Record<string, string>; max?: number; compact?: boolean }) {
  const on = useMotion(), { hidden, toggle } = useHidden(), [ref, w] = useBox<HTMLDivElement>()
  const narrow = compact ?? (w > 0 && w < 440)
  return <div ref={ref}>
    {narrow ? <RadarBars data={data} axisKey={axisKey} y={y} labels={labels} max={max} hidden={hidden} toggle={toggle} /> : <>
    <ResponsiveContainer width="100%" height={height}>
      <RadarChart data={data} outerRadius="72%">
        <PolarGrid stroke="var(--border)" />
        <PolarAngleAxis dataKey={axisKey} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} />
        <PolarRadiusAxis domain={[0, max ?? "auto"]} tick={false} axisLine={false} />
        <Tooltip content={tipEl(undefined, axisKey)} />
        {y.map((k, i) => !hidden.has(k) && <Radar key={k} dataKey={k} name={labelOf(labels, k)} stroke={chartColors[i % 5]} strokeWidth={2} fill={chartColors[i % 5]} fillOpacity={0.18}
          dot={{ r: 3, fill: chartColors[i % 5], strokeWidth: 0 }} {...anim(on, i * 150)} />)}
      </RadarChart>
    </ResponsiveContainer>
    <ChartLegend items={y.map((k, i) => ({ key: k, label: labelOf(labels, k), color: chartColors[i % 5] }))} hidden={hidden} onToggle={toggle} />
    </>}
  </div>
}

/** Concentric progress rings (Apple-Watch style). value is 0..max (default 100). */
export function RadialBars({ data, height = 240, max = 100, unit = "%", centerLabel }: { data: { name: string; value: number }[]; height?: number; max?: number; unit?: string; centerLabel?: string }) {
  const on = useMotion()
  const rows = data.map((d, i) => ({ ...d, fill: chartColors[i % 5] })).reverse()
  const avg = Math.round(data.reduce((s, d) => s + d.value, 0) / (data.length || 1))
  return <div>
    <div className="relative" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart data={rows} innerRadius="34%" outerRadius="100%" startAngle={90} endAngle={-270} barSize={12}>
          <PolarAngleAxis type="number" domain={[0, max]} tick={false} />
          <RadialBar dataKey="value" background={{ fill: "var(--muted)" }} cornerRadius={10} {...anim(on)} />
          <Tooltip content={tipEl(unit, "name")} cursor={false} />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center leading-normal">
        <span className="text-xl font-bold tabular-nums">{avg}{unit}</span>
        <span className="text-[11px] text-muted-foreground">{centerLabel ?? "ສະເລ່ຍ"}</span>
      </div>
    </div>
    <ChartLegend items={data.map((d, i) => ({ key: d.name, label: d.name + " · " + d.value + unit, color: chartColors[i % 5] }))} />
  </div>
}

/** Bars + a line on a second axis (e.g. patrol count + on-time %). */
export function ComboSeries({ data, x, bars, line, height = 260, labels, lineUnit }: { data: Row[]; x: string; bars: string[]; line: string; height?: number; labels?: Record<string, string>; lineUnit?: string }) {
  const id = useGid(), on = useMotion(), { hidden, toggle } = useHidden(), lc = chartColors[(bars.length) % 5]
  return <div>
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart data={data} barCategoryGap="26%">
        <defs>{bars.map((k, i) => <linearGradient key={k} id={id + i} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={chartColors[i % 5]} /><stop offset="100%" stopColor={chartColors[i % 5]} stopOpacity={0.65} /></linearGradient>)}</defs>
        {grid}<XAxis dataKey={x} {...axis} /><YAxis yAxisId="l" {...axis} width={36} /><YAxis yAxisId="r" orientation="right" {...axis} width={40} unit={lineUnit} />
        <Tooltip content={tipEl()} cursor={{ fill: "var(--muted)", opacity: 0.6 }} />
        {bars.map((k, i) => !hidden.has(k) && <Bar key={k} yAxisId="l" dataKey={k} name={labelOf(labels, k)} stackId="s" fill={"url(#" + id + i + ")"} maxBarSize={32} radius={i === bars.length - 1 ? [6, 6, 0, 0] : 0} {...anim(on, i * 90)} />)}
        {!hidden.has(line) && <Line yAxisId="r" dataKey={line} name={labelOf(labels, line)} type="monotone" stroke={lc} strokeWidth={2.5} dot={{ r: 3.5, fill: "var(--card)", stroke: lc, strokeWidth: 2 }} activeDot={{ r: 5, strokeWidth: 3, stroke: "var(--card)", fill: lc }} {...anim(on, 300)} />}
      </ComposedChart>
    </ResponsiveContainer>
    <ChartLegend items={[...bars, line].map((k, i) => ({ key: k, label: labelOf(labels, k), color: chartColors[i % 5] }))} hidden={hidden} onToggle={toggle} />
  </div>
}

/**
 * Heatmap grid (pure CSS, no Recharts): rows x cols of values, colour = token mixed by intensity.
 * Typical use: incidents per weekday x hour, or site x week. Cells fade in with a wave.
 */
export function Heatmap({ rows, cols, values, max, tone = "var(--chart-1)", unit, cell = 28 }: { rows: string[]; cols: string[]; values: number[][]; max?: number; tone?: string; unit?: string; cell?: number }) {
  const top = max ?? Math.max(1, ...values.flat()), [hot, setHot] = React.useState<[number, number] | null>(null)
  return <div className="w-full overflow-x-auto">
    <div className="inline-grid gap-1 text-[11px] leading-normal" style={{ gridTemplateColumns: "auto repeat(" + cols.length + ", " + cell + "px)" }}>
      <span />{cols.map((c) => <span key={c} className="text-center text-muted-foreground">{c}</span>)}
      {rows.map((r, ri) => <React.Fragment key={r}>
        <span className="pr-2 text-right text-muted-foreground" style={{ lineHeight: cell + "px" }}>{r}</span>
        {cols.map((c, ci) => {
          const v = values[ri]?.[ci] ?? 0, pct = Math.round((v / top) * 88) + 6, on = hot && hot[0] === ri && hot[1] === ci
          return <span key={c} role="img" aria-label={r + " " + c + ": " + v + (unit ? " " + unit : "")} title={r + " · " + c + ": " + v + (unit ? " " + unit : "")}
            onMouseEnter={() => setHot([ri, ci])} onMouseLeave={() => setHot(null)}
            className="vks-heat-cell rounded-md transition-transform duration-200"
            style={{ height: cell, background: "color-mix(in oklab, " + tone + " " + pct + "%, var(--muted))", transform: on ? "scale(1.18)" : undefined, animationDelay: (ri + ci) * 18 + "ms", boxShadow: on ? "0 0 0 2px var(--card), 0 0 0 3.5px " + tone : undefined }} />
        })}
      </React.Fragment>)}
    </div>
    <div className="mt-3 flex items-center justify-end gap-2 text-[11px] text-muted-foreground">
      <span>ໜ້ອຍ</span>{[6, 28, 50, 72, 94].map((p) => <span key={p} className="size-3 rounded-sm" style={{ background: "color-mix(in oklab, " + tone + " " + p + "%, var(--muted))" }} />)}<span>ຫຼາຍ</span>
    </div>
  </div>
}

export type DateGridStatus = "ok" | "late" | "miss" | "na"
/**
 * Date grid (pure CSS, QC site-profile style): one row per round/guard/zone, one column per day (default 14), each cell a status square:
 * ok = complete, late, miss = outlined red, na = empty. Wide container = the grid, tap a cell to get onPick. Narrow (phone) = one tappable row per round that opens a bottom sheet with the days as a calendar (tap a day to get onPick).
 * Use for "did it happen on each day" history; for intensity numbers use Heatmap instead.
 */
export function DateGrid({ rows, dates, status, today, onPick, labels, cell = 26 }: {
  rows: string[]; dates: string[]; status: DateGridStatus[][]; today?: number; onPick?: (row: string, date: string, s: DateGridStatus) => void
  labels?: Partial<Record<DateGridStatus, string>>; cell?: number
}) {
  const L = { ok: "ສຳເລັດ", late: "ຊ້າ", miss: "ພາດ", na: "ບໍ່ມີ", ...labels }
  const bg: Record<DateGridStatus, string> = { ok: "var(--success)", late: "var(--warning)", miss: "var(--card)", na: "var(--muted)" }
  const [hot, setHot] = React.useState<string | null>(null), [sel, setSel] = React.useState<number | null>(null)
  const selRow = sel != null ? rows[sel] : undefined, cnt = (ri: number, k: DateGridStatus) => dates.filter((_, ci) => (status[ri]?.[ci] ?? "na") === k).length
  return <div className="@container w-full min-w-0">
    <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-semibold leading-normal text-muted-foreground">
      {(["ok", "late", "miss", "na"] as const).map((k) => <span key={k} className="flex items-center gap-1.5"><span className="size-3 rounded-sm" style={{ background: bg[k], boxShadow: k === "miss" ? "inset 0 0 0 1.5px var(--destructive)" : undefined }} />{L[k]}</span>)}
    </div>
    <div className="hidden overflow-x-auto pb-1 [scrollbar-width:none] @xl:block">
      <div className="inline-grid gap-1 text-[11px] leading-normal" style={{ gridTemplateColumns: "28px repeat(" + dates.length + ", " + cell + "px)" }}>
        <span />{dates.map((d, i) => <span key={d} className={"text-center font-bold " + (i === today ? "text-primary dark:text-gold" : "text-muted-foreground")}>{d}</span>)}
        {rows.map((r, ri) => <React.Fragment key={r}>
          <span className="sticky left-0 z-10 flex items-center bg-card font-bold text-muted-foreground" style={{ height: cell }}>{r}</span>
          {dates.map((d, ci) => {
            const s = status[ri]?.[ci] ?? "na", id = ri + "-" + ci, on = hot === id
            return <button key={d} type="button" aria-label={r + " " + d + ": " + L[s]} title={r + " · " + d + ": " + L[s]}
              onClick={() => { setHot(id); onPick?.(r, d, s) }} onBlur={() => setHot(null)}
              className="vks-heat-cell rounded-[4px] transition-transform duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              style={{ height: cell, background: bg[s], boxShadow: s === "miss" ? "inset 0 0 0 2px var(--destructive)" : on ? "0 0 0 2px var(--card), 0 0 0 3.5px var(--primary)" : undefined, transform: on ? "scale(1.15)" : undefined, animationDelay: (ri + ci) * 14 + "ms" }} />
          })}
        </React.Fragment>)}
      </div>
    </div>
    <div className="space-y-2 leading-normal @xl:hidden">
      {rows.map((r, ri) => { const real = dates.length - cnt(ri, "na"), ok = cnt(ri, "ok"), miss = cnt(ri, "miss")
        return <button key={r} type="button" onClick={() => setSel(ri)} aria-haspopup="dialog" className="vks-press flex min-h-14 w-full items-center gap-3 rounded-2xl border bg-card p-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-bold">{r}</div>
            <div className="mt-1.5 flex gap-[2px]" aria-hidden>{dates.map((d, ci) => { const k = status[ri]?.[ci] ?? "na"; return <span key={d} className="h-2.5 min-w-0 flex-1 rounded-[2px]" style={{ background: bg[k], boxShadow: k === "miss" ? "inset 0 0 0 1.5px var(--destructive)" : undefined }} /> })}</div>
          </div>
          <span className="text-xs font-bold tabular-nums text-muted-foreground">{ok}/{real}{miss > 0 && <b className="text-destructive"> · {miss}</b>}</span>
          <svg aria-hidden viewBox="0 0 24 24" className="size-4 shrink-0 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 6 6 6-6 6" /></svg>
        </button> })}
      <Sheet open={sel != null} onOpenChange={(o) => !o && setSel(null)}>
        <SheetContent side="bottom">
          {selRow != null && sel != null && <div className="space-y-3 leading-normal">
            <div className="pr-10"><SheetTitle>{selRow}</SheetTitle><SheetDescription>{dates.length} ມື້</SheetDescription></div>
            <div className="flex flex-wrap gap-1.5 text-xs font-bold">
              {(["ok", "late", "miss"] as const).map((k) => { const c = cnt(sel, k); return c > 0 ? <span key={k} className="rounded-full border bg-card px-2.5 py-1">{L[k]} <b className="font-mono tabular-nums">{c}</b></span> : null })}
            </div>
            <div className="grid grid-cols-[repeat(7,minmax(0,1fr))] gap-1">
              {dates.map((d, ci) => { const k = status[sel]?.[ci] ?? "na", solid = k === "ok" || k === "late"
                return <button key={d} type="button" aria-label={selRow + " " + d + ": " + L[k]} onClick={() => { setSel(null); onPick?.(selRow, d, k) }}
                  className={"vks-press grid h-11 place-items-center rounded-xl text-sm font-bold tabular-nums focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" + (ci === today ? " ring-2 ring-primary dark:ring-gold" : "")}
                  style={{ background: bg[k], color: solid ? "var(--card)" : k === "miss" ? "var(--destructive)" : "var(--muted-foreground)", boxShadow: k === "miss" ? "inset 0 0 0 2px var(--destructive)" : undefined }}>{d}</button> })}
            </div>
          </div>}
        </SheetContent>
      </Sheet>
    </div>
  </div>
}

export type LatencyKind = "inspection" | "special" | "event" | "meeting" | "incident"
const LAT: Record<LatencyKind, { c: string; l: string }> = {
  inspection: { c: "var(--success)", l: "ກວດກາ" },
  special: { c: "var(--file-image)", l: "ໜ້າທີ່ພິເສດ" },
  event: { c: "var(--file-doc)", l: "ກິດຈະກຳ" },
  meeting: { c: "var(--file-pdf)", l: "ປະຊຸມ" },
  incident: { c: "var(--destructive)", l: "ເຫດ/ຮ້ອງຮຽນ" },
}
const WEEK = ["ຈ", "ອ", "ພ", "ພຫ", "ສ", "ສ.", "ອາ"]
/**
 * Site profile timeline (pure CSS): which days of a month a site was visited, and the gap in days between visits.
 * Wide (container 576 px+) = one strip of day squares with a gap bracket ("2d") above; narrow = a month calendar with the gaps as chips below, and tapping a visited day opens a bottom sheet (kinds, gap before and after; onPick fires from its button).
 * Header shows average / longest / shortest gap and total logs. A day may carry several kinds (underlined segments).
 * Use for "how often is this site visited"; for plain done / late / missed per round use DateGrid instead.
 */
export function LatencyTimeline({ days = 30, entries, offset = 0, today, onPick, labels, unit = "d", openLabel = "ເບິ່ງລາຍລະອຽດ" }: {
  days?: number; entries: { day: number; kinds: LatencyKind[] }[]
  /** Blank cells before day 1 in the phone calendar (Monday start: Tue = 1). */
  offset?: number; today?: number; onPick?: (day: number, kinds: LatencyKind[]) => void; labels?: Partial<Record<LatencyKind, string>>; unit?: string
  /** Phone sheet button text (shown only when onPick is set). */
  openLabel?: string
}) {
  const [dayOpen, setDayOpen] = React.useState<number | null>(null)
  const name = (k: LatencyKind) => labels?.[k] ?? LAT[k].l
  const act = React.useMemo(() => {
    const m = new Map<number, LatencyKind[]>()
    for (const e of entries) if (e.day >= 1 && e.day <= days) m.set(e.day, [...(m.get(e.day) ?? []), ...e.kinds])
    return m
  }, [entries, days])
  const list = [...act.keys()].sort((a, b) => a - b)
  const gaps = list.slice(1).map((d, i) => ({ from: list[i], to: d, n: d - list[i] }))
  const avg = gaps.length ? gaps.reduce((a, g) => a + g.n, 0) / gaps.length : 0
  const high = gaps.length ? Math.max(...gaps.map((g) => g.n)) : 0, low = gaps.length ? Math.min(...gaps.map((g) => g.n)) : 0
  const total = [...act.values()].reduce((a, k) => a + k.length, 0)
  const used = (Object.keys(LAT) as LatencyKind[]).filter((k) => [...act.values()].some((v) => v.includes(k)))
  const step = 100 / days, lastX: number[] = []
  const pills = gaps.map((g) => {
    const x = ((g.from + g.to) / 2 - 0.5) * step
    let row = 0
    while (lastX[row] !== undefined && x - lastX[row] < step * 1.35) row++
    lastX[row] = x
    return { ...g, x, row }
  })
  const rows = lastX.length || 1
  const stats: [string, string, string][] = [
    ["ໄລຍະສະເລ່ຍ", avg ? (Math.round(avg * 10) / 10) + unit : "–", "text-success"], ["ຫ່າງສຸດ", high ? high + unit : "–", "text-destructive"],
    ["ຖີ່ສຸດ", low ? low + unit : "–", "text-success"], ["ບັນທຶກທັງໝົດ", String(total), "text-foreground"],
  ]
  const fill = (ks: LatencyKind[]) => LAT[ks[0]].c
  const multi = (ks: LatencyKind[]) => ks.length > 1 && <span aria-hidden className="absolute inset-x-1 bottom-0.5 flex h-[4px] overflow-hidden rounded-full bg-card p-px">{ks.map((k, i) => <span key={i} className="flex-1" style={{ background: LAT[k].c }} />)}</span>
  const label = (d: number, ks?: LatencyKind[]) => d + (ks ? ": " + ks.map(name).join(", ") : "")
  const nums = Array.from({ length: days }, (_, i) => i + 1)
  return <div className="@container w-full min-w-0"><div className="space-y-4 leading-normal">
    <dl className="grid grid-cols-[repeat(4,minmax(0,1fr))] gap-2 @xl:gap-6">
      {stats.map(([k, v, c]) => <div key={k} className="min-w-0"><dt className="truncate text-[10px] font-bold text-muted-foreground @xl:text-[11px]">{k}</dt><dd className={"font-mono text-xl font-bold tabular-nums @xl:text-2xl " + c}>{v}</dd></div>)}
    </dl>
    <div className="hidden @xl:block">
      <div className="relative" style={{ height: rows * 22 + 12 }}>
        {pills.map((p) => <span key={p.from} className="absolute rounded-full bg-primary/10 px-1.5 font-mono text-[10px] font-bold leading-[18px] tabular-nums text-primary dark:text-foreground" style={{ left: p.x + "%", top: p.row * 22, transform: "translateX(-50%)" }}>{p.n}{unit}</span>)}
        {list.length > 1 && <span aria-hidden className="absolute h-px bg-primary/35" style={{ left: (list[0] - 0.5) * step + "%", width: (list[list.length - 1] - list[0]) * step + "%", bottom: 3 }} />}
        {list.map((d) => <span key={d} aria-hidden className="absolute bottom-0 h-[7px] w-px bg-primary/35" style={{ left: (d - 0.5) * step + "%" }} />)}
      </div>
      <div className="grid gap-1" style={{ gridTemplateColumns: "repeat(" + days + ", minmax(0, 1fr))" }}>
        {nums.map((d) => { const ks = act.get(d)
          return ks
            ? <button key={d} type="button" aria-label={label(d, ks)} title={label(d, ks)} onClick={() => onPick?.(d, ks)} className="vks-heat-cell vks-press relative grid aspect-square place-items-center rounded-md text-[10px] font-bold tabular-nums text-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" style={{ background: fill(ks), animationDelay: d * 12 + "ms" }}>{d}{multi(ks)}</button>
            : <span key={d} className={"vks-heat-cell grid aspect-square place-items-center rounded-md bg-muted/60 text-[11px] font-semibold tabular-nums text-muted-foreground/60 " + (d === today ? "ring-2 ring-primary/50" : "")} style={{ animationDelay: d * 12 + "ms" }}>{d}</span> })}
      </div>
    </div>
    <div className="@xl:hidden">
      <div className="mb-1 grid grid-cols-[repeat(7,minmax(0,1fr))] gap-1 text-center text-[11px] font-bold text-muted-foreground">{WEEK.map((w) => <span key={w}>{w}</span>)}</div>
      <div className="grid grid-cols-[repeat(7,minmax(0,1fr))] gap-1">
        {Array.from({ length: offset }, (_, i) => <span key={"b" + i} aria-hidden />)}
        {nums.map((d) => { const ks = act.get(d)
          return ks
            ? <button key={d} type="button" aria-label={label(d, ks)} aria-haspopup="dialog" onClick={() => setDayOpen(d)} className="vks-heat-cell vks-press relative grid h-11 place-items-center rounded-xl text-sm font-bold tabular-nums text-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" style={{ background: fill(ks), animationDelay: d * 12 + "ms" }}>{d}{multi(ks)}</button>
            : <span key={d} className={"vks-heat-cell grid h-11 place-items-center rounded-xl bg-muted/60 text-sm font-semibold tabular-nums text-muted-foreground/60 " + (d === today ? "ring-2 ring-primary/50" : "")} style={{ animationDelay: d * 12 + "ms" }}>{d}</span> })}
      </div>
      {gaps.length > 0 && <>
        <div className="mb-1.5 mt-4 text-[11px] font-bold text-muted-foreground">ໄລຍະຫວ່າງລະຫວ່າງການຢ້ຽມຢາມ</div>
        <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1 [scrollbar-width:none]">
          {gaps.map((g) => <span key={g.from} className="shrink-0 rounded-full border bg-card px-3 py-1.5 font-mono text-xs font-semibold tabular-nums">{g.from} → {g.to} · <b className={g.n === high ? "text-destructive" : ""}>{g.n}{unit}</b></span>)}
        </div></>}
      <Sheet open={dayOpen != null} onOpenChange={(o) => !o && setDayOpen(null)}>
        <SheetContent side="bottom">
          {dayOpen != null && act.get(dayOpen) && (() => { const ks = act.get(dayOpen)!, i = list.indexOf(dayOpen), prev = i > 0 ? dayOpen - list[i - 1] : 0, next = i < list.length - 1 ? list[i + 1] - dayOpen : 0
            return <div className="space-y-3 leading-normal">
              <div className="pr-10"><SheetTitle>ມື້ທີ {dayOpen}</SheetTitle><SheetDescription>{ks.length} ບັນທຶກ</SheetDescription></div>
              <ul className="space-y-1.5">{ks.map((k, j) => <li key={j} className="flex min-h-11 items-center gap-3 rounded-xl border bg-card px-3 text-sm font-semibold"><span aria-hidden className="size-3 shrink-0 rounded-sm" style={{ background: LAT[k].c }} />{name(k)}</li>)}</ul>
              {(prev > 0 || next > 0) && <div className="grid grid-cols-2 gap-2 text-center">
                <div className="rounded-xl bg-muted/60 p-2"><div className="text-[11px] font-bold text-muted-foreground">ຫ່າງຈາກຄັ້ງກ່ອນ</div><div className="font-mono text-lg font-bold tabular-nums">{prev ? prev + unit : "–"}</div></div>
                <div className="rounded-xl bg-muted/60 p-2"><div className="text-[11px] font-bold text-muted-foreground">ຄັ້ງຕໍ່ໄປອີກ</div><div className="font-mono text-lg font-bold tabular-nums">{next ? next + unit : "–"}</div></div>
              </div>}
              {onPick && <Button type="button" variant="outline" size="lg" className="w-full" onClick={() => { const d = dayOpen; setDayOpen(null); onPick(d, ks) }}>{openLabel}</Button>}
            </div> })()}
        </SheetContent>
      </Sheet>
    </div>
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-semibold text-muted-foreground">
      {used.map((k) => <span key={k} className="flex items-center gap-1.5"><span className="size-2.5 rounded-sm" style={{ background: LAT[k].c }} />{name(k)}</span>)}
    </div>
  </div></div>
}

type AttKind = "P" | "W" | "A" | "L" | "?" | "OT" | "H"
type AttPart = { k: AttKind; n?: number }
const ATT: Record<AttKind, { c: string; t: string; l: string; solid?: boolean }> = {
  P: { c: "var(--file-doc)", t: "P", l: "ມາວຽກ" }, W: { c: "var(--success)", t: "ພ", l: "ພັກ" },
  A: { c: "var(--destructive)", t: "A", l: "ຂາດ", solid: true }, L: { c: "var(--warning)", t: "ລ", l: "ລາ", solid: true },
  "?": { c: "var(--destructive)", t: "?", l: "ບໍ່ມີບັນທຶກ" }, OT: { c: "var(--file-video)", t: "O", l: "ໂອທີ" }, H: { c: "var(--file-image)", t: "H", l: "ເຮັດວັນພັກ" },
}
/** "P+O8" -> [P, OT 8]. Tokens: P W A L ? O<h> (overtime hours) H<h> (worked a holiday); "" = no entry yet. Pure. */
function parseAtt(tok: string): AttPart[] {
  return tok.split("+").map((s) => s.trim()).filter(Boolean).flatMap((s): AttPart[] => {
    const m = /^(OT|O|H)(\d+(?:\.\d+)?)?$/i.exec(s)
    if (m) return [{ k: m[1].toUpperCase() === "H" ? "H" : "OT", n: m[2] ? +m[2] : undefined }]
    const u = s.toUpperCase()
    return u === "P" || u === "W" || u === "A" || u === "L" || u === "?" ? [{ k: u }] : []
  })
}
export type AttendanceRow = { id: string; name: string; cells: string[] }
function AttCell({ parts, label, day, now, mobile, onClick }: { parts: AttPart[]; label: string; day: number; now?: boolean; mobile?: boolean; onClick?: () => void }) {
  const size = mobile ? "h-11" : "h-10"
  const ring = now ? " ring-2 ring-primary dark:ring-gold" : ""
  const num = mobile && <span aria-hidden className="pointer-events-none absolute left-1 top-0.5 text-[9px] font-semibold leading-none opacity-70">{day}</span>
  if (!parts.length) return <span className={"vks-heat-cell relative rounded-lg bg-muted/50 text-muted-foreground " + size + ring} style={{ animationDelay: day * 10 + "ms" }}>{num}</span>
  const miss = parts.length === 1 && parts[0].k === "?"
  return <button type="button" aria-label={label} title={label} onClick={onClick}
    className={"vks-heat-cell vks-press relative flex overflow-hidden rounded-lg font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring " + size + ring + (miss ? " border-2 border-dashed border-destructive text-destructive" : "")}
    style={{ animationDelay: day * 10 + "ms" }}>
    {num}
    {parts.map((p, i) => { const a = ATT[p.k], t = a.t + (p.n != null ? p.n : "")
      return <span key={i} className={"relative grid flex-1 place-items-center " + (parts.length > 1 ? "text-[10px] " : "text-[13px] ") + (mobile ? "pt-2.5" : "")}
        style={miss ? undefined : a.solid ? { background: a.c, color: "var(--card)" } : { background: "color-mix(in oklab, " + a.c + " 16%, var(--card))", color: a.c }}>
        {t}{p.k === "W" && <span aria-hidden className="absolute inset-x-1.5 bottom-1 h-[2px] rounded-full" style={{ background: a.c }} />}
      </span> })}
  </button>
}
/**
 * Monthly attendance board (pure CSS, HRM "track attendance" style): one row per guard, one cell per day, with codes
 * P present, ພ rest day, A absent, ລ leave, O8 overtime hours, H8 worked a holiday, ? missing record (dashed red); "P+O8" splits one cell. Header summarises
 * missing / overtime / absent / leave counts and a completeness bar per day. Wide container = table with the name column pinned; narrow (phone) = one tappable row per guard that opens a bottom sheet with the month calendar.
 * Use for "did each guard come to work each day"; for round status per site use DateGrid instead.
 */
export function AttendanceBoard({ rows, days = 31, today, offset = 0, onPick, labels }: {
  rows: AttendanceRow[]; days?: number; today?: number
  /** Blank cells before day 1 in the phone calendar (Monday start: Tue = 1). */
  offset?: number; onPick?: (rowId: string, day: number, token: string) => void; labels?: Partial<Record<AttKind, string>>
}) {
  const name = (k: AttKind) => labels?.[k] ?? ATT[k].l
  const [picked, setPicked] = React.useState<string | null>(null)
  const nums = Array.from({ length: days }, (_, i) => i + 1)
  const parsed = rows.map((r) => nums.map((d) => parseAtt(r.cells[d - 1] ?? "")))
  const count = (f: (p: AttPart) => boolean) => parsed.flat(2).filter(f).length
  const sums: { k: AttKind; n: number }[] = [{ k: "?", n: count((p) => p.k === "?") }, { k: "OT", n: count((p) => p.k === "OT") }, { k: "A", n: count((p) => p.k === "A") }, { k: "L", n: count((p) => p.k === "L") }]
  const state = nums.map((_, d) => { const col = parsed.map((r) => r[d]); return col.every((c) => !c.length) ? "future" : col.some((c) => !c.length || c.some((p) => p.k === "?")) ? "gap" : "ok" })
  const gapDays = state.filter((s) => s === "gap").length
  const pickedIdx = Math.max(0, rows.findIndex((r) => r.id === picked)), pickedRow = picked ? rows[pickedIdx] : undefined, pickedParts = pickedRow ? parsed[pickedIdx].flat() : []
  const cellLabel = (r: AttendanceRow, d: number, ps: AttPart[]) => r.name + " · " + d + ": " + (ps.map((p) => name(p.k) + (p.n != null ? " " + p.n : "")).join(" + ") || "–")
  const chip = (k: AttKind, v: number | string) => <span key={k} className="inline-flex items-center gap-2 rounded-full border bg-card py-1 pl-1 pr-3 text-sm"><span className="grid size-7 place-items-center rounded-full text-[11px] font-bold" style={{ background: "color-mix(in oklab, " + ATT[k].c + " 16%, var(--card))", color: ATT[k].c }}>{k === "OT" ? "OT" : ATT[k].t}</span>{name(k)}<b className="font-mono tabular-nums">{v}</b></span>
  return <div className="@container w-full min-w-0"><div className="space-y-4 leading-normal">
    <div className="flex items-center gap-3">
      <span className="shrink-0 text-xs font-bold text-muted-foreground">ຄວາມຄົບ</span>
      <div className="flex min-w-0 flex-1 gap-[2px]" role="img" aria-label={gapDays ? "ຫວ່າງ " + gapDays + " ມື້" : "ຄົບທຸກມື້"}>
        {state.map((s, i) => <span key={i} className="h-3 min-w-0 flex-1 rounded-[2px]" style={{ background: s === "ok" ? "var(--success)" : s === "gap" ? "var(--destructive)" : "var(--muted)" }} />)}
      </div>
      {gapDays > 0 && <span className="shrink-0 text-xs font-bold text-destructive">ຫວ່າງ {gapDays} ມື້</span>}
    </div>
    <div className="flex flex-wrap gap-2">{sums.map((s) => chip(s.k, s.n))}</div>
    <div className="hidden overflow-x-auto pb-1 [scrollbar-width:none] @xl:block">
      <div className="inline-grid gap-1" style={{ gridTemplateColumns: "148px repeat(" + days + ", 40px)" }}>
        <span className="sticky left-0 z-10 self-end bg-card pr-2 text-right text-[11px] font-bold text-muted-foreground">ວັນທີ →</span>
        {nums.map((d) => <span key={d} className={"text-center text-[11px] font-bold tabular-nums " + (d === today ? "text-primary dark:text-gold" : "text-muted-foreground")}>{d}</span>)}
        {rows.map((r, ri) => <React.Fragment key={r.id}>
          <div className="sticky left-0 z-10 flex h-10 min-w-0 flex-col justify-center bg-card pr-2"><span className="truncate text-xs font-bold">{r.name}</span><span className="font-mono text-[10px] text-muted-foreground">{r.id}</span></div>
          {nums.map((d) => <AttCell key={d} parts={parsed[ri][d - 1]} label={cellLabel(r, d, parsed[ri][d - 1])} day={d} now={d === today} onClick={() => onPick?.(r.id, d, r.cells[d - 1] ?? "")} />)}
        </React.Fragment>)}
      </div>
    </div>
    <div className="space-y-2 @xl:hidden">
      {rows.map((r, ri) => { const mine = parsed[ri].flat(), n = (k: AttKind) => mine.filter((p) => p.k === k).length
        return <button key={r.id} type="button" onClick={() => setPicked(r.id)} aria-haspopup="dialog" className="vks-press flex min-h-14 w-full items-center gap-3 rounded-2xl border bg-card p-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <div className="min-w-0 flex-1"><div className="truncate text-sm font-bold">{r.name}</div><div className="font-mono text-[11px] text-muted-foreground">{r.id}</div></div>
          <span className="text-xs font-bold tabular-nums text-muted-foreground">{n("P")} ມາ{n("?") > 0 && <b className="text-destructive"> · {n("?")}?</b>}</span>
          <svg aria-hidden viewBox="0 0 24 24" className="size-4 shrink-0 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 6 6 6-6 6" /></svg>
        </button> })}
      <Sheet open={!!pickedRow} onOpenChange={(o) => !o && setPicked(null)}>
        <SheetContent side="bottom" className="@xl:hidden">
          {pickedRow && <div className="space-y-3 leading-normal">
            <div className="pr-10"><SheetTitle>{pickedRow.name}</SheetTitle><SheetDescription className="font-mono">{pickedRow.id}</SheetDescription></div>
            <div className="flex flex-wrap gap-1.5 text-xs font-bold">
              {(["P", "A", "L", "OT", "?"] as const).map((k) => { const c = pickedParts.filter((p) => p.k === k).length; return c > 0 ? <span key={k} className="rounded-full border bg-card px-2.5 py-1">{name(k)} <b className="font-mono tabular-nums">{c}</b></span> : null })}
            </div>
            <div>
              <div className="mb-1 grid grid-cols-[repeat(7,minmax(0,1fr))] gap-1 text-center text-[11px] font-bold text-muted-foreground">{WEEK.map((w) => <span key={w}>{w}</span>)}</div>
              <div className="grid grid-cols-[repeat(7,minmax(0,1fr))] gap-1">
                {Array.from({ length: offset }, (_, i) => <span key={"b" + i} aria-hidden />)}
                {nums.map((d) => <AttCell key={d} mobile parts={parsed[pickedIdx][d - 1]} label={cellLabel(pickedRow, d, parsed[pickedIdx][d - 1])} day={d} now={d === today} onClick={onPick ? () => { setPicked(null); onPick(pickedRow.id, d, pickedRow.cells[d - 1] ?? "") } : undefined} />)}
              </div>
            </div>
          </div>}
        </SheetContent>
      </Sheet>
    </div>
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-semibold text-muted-foreground">
      {(["P", "W", "A", "L", "OT", "H", "?"] as const).map((k) => <span key={k} className="flex items-center gap-1.5"><span className="grid size-4 place-items-center rounded-[4px] text-[9px] font-bold" style={ATT[k].solid ? { background: ATT[k].c, color: "var(--card)" } : { background: "color-mix(in oklab, " + ATT[k].c + " 16%, var(--card))", color: ATT[k].c }}>{k === "OT" ? "O" : ATT[k].t}</span>{name(k)}</span>)}
    </div>
  </div></div>
}

/** Tiny inline trend for KPI tiles. Pure SVG, no library, ~0 KB. Gradient fill + end dot. */
export function Sparkline({ values, width = 90, height = 28, color = "var(--chart-1)", fill = true }: { values: number[]; width?: number; height?: number; color?: string; fill?: boolean }) {
  const id = useGid()
  if (values.length < 2) return null
  const mn = Math.min(...values), mx = Math.max(...values), r = mx - mn || 1
  const xy = values.map((v, i) => [(i / (values.length - 1)) * (width - 4) + 2, height - 3 - ((v - mn) / r) * (height - 6)])
  const pts = xy.map((p) => p.map((n) => n.toFixed(1)).join(",")).join(" ")
  const last = xy[xy.length - 1]
  return <svg width={width} height={height} aria-hidden className="overflow-visible">
    {fill && <><defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity={0.28} /><stop offset="100%" stopColor={color} stopOpacity={0} /></linearGradient></defs>
      <polygon points={"2," + height + " " + pts + " " + (width - 2) + "," + height} fill={"url(#" + id + ")"} /></>}
    <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    <circle cx={last[0]} cy={last[1]} r="2.75" fill={color} stroke="var(--card)" strokeWidth="1.5" />
  </svg>
}