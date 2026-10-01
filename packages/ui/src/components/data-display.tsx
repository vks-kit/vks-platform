import * as React from "react"
import { Avatar as AV, Progress as PG, Accordion as AC } from "radix-ui"
import { ArrowDownRight, ArrowUpRight, ChevronDown, ChevronLeft, ChevronRight, Star } from "lucide-react"
import { cn } from "../lib/cn"
import { useIndicator, Indicator } from "../lib/use-indicator"
import { useFlip } from "../lib/use-flip"

export const initials = (name: string) => {
  const s = name.trim(); if (!s) return "?"
  const p = s.split(/\s+/); return p.length > 1 ? (p[0][0] + p[1][0]).toUpperCase() : s.slice(0, 2).toUpperCase()
}
const hash = (s: string) => { let h = 0; for (const c of s) h = (h * 31 + c.codePointAt(0)!) >>> 0; return h }
const AV_TONES = ["vks-av-0", "vks-av-1", "vks-av-2", "vks-av-3", "vks-av-4", "vks-av-5"] as const
const STATUS = { online: "bg-success", away: "bg-warning", busy: "bg-destructive", offline: "bg-muted-foreground" } as const
export type AvatarStatus = keyof typeof STATUS

/**
 * Photo with a soft fade-in; falls back to initials on a colour picked from the name (same person = same colour).
 * ring = gold conic ring (supervisor / on duty). status = presence dot; "online" pulses unless the phone is in lite mode.
 */
export function Avatar({ name, src, size = 40, ring, status, className }: { name: string; src?: string; size?: number; ring?: boolean; status?: AvatarStatus; className?: string }) {
  const tone = AV_TONES[hash(name) % AV_TONES.length]
  const dot = Math.max(8, Math.round(size * 0.28))
  const inner = (
    <AV.Root className={cn("relative inline-flex size-full select-none items-center justify-center overflow-hidden rounded-full shadow-[inset_0_1px_0_rgb(255_255_255/.25),inset_0_-1px_2px_rgb(0_0_0/.15)]", tone)}>
      {src && <AV.Image src={src} alt={name} className="vks-av-img size-full object-cover" />}
      <AV.Fallback className="font-bold leading-none tracking-tight" delayMs={src ? 400 : 0}>{initials(name)}</AV.Fallback>
    </AV.Root>
  )
  return (
    <span className={cn("relative inline-flex shrink-0 rounded-full", className)} style={{ width: size, height: size, fontSize: size * 0.38 }} title={name}>
      {ring ? <span className="vks-av-ring flex size-full rounded-full p-[2px]"><span className="flex size-full rounded-full bg-background p-[2px]">{inner}</span></span> : inner}
      {status && <span aria-label={status} className={cn("absolute bottom-0 right-0 rounded-full ring-2 ring-background", STATUS[status], status === "online" && "vks-status-live")} style={{ width: dot, height: dot }} />}
    </span>
  )
}

/** Overlapping stack. Shows max, then a "+N" chip. Fans out on hover (desktop). */
export function AvatarGroup({ people, max = 4, size = 36, className }: { people: { name: string; src?: string }[]; max?: number; size?: number; className?: string }) {
  const shown = people.slice(0, max), extra = people.length - shown.length
  return (
    <div className={cn("vks-av-group flex items-center", className)} aria-label={people.map((p) => p.name).join(", ")}>
      {shown.map((p, i) => (
        <span key={p.name + i} className="rounded-full ring-2 ring-background" style={{ marginLeft: i ? -size * 0.3 : 0, zIndex: shown.length - i, ["--i" as string]: i } as React.CSSProperties}>
          <Avatar name={p.name} src={p.src} size={size} />
        </span>
      ))}
      {extra > 0 && <span className="relative flex items-center justify-center rounded-full bg-muted font-bold text-muted-foreground ring-2 ring-background" style={{ width: size, height: size, marginLeft: -size * 0.3, fontSize: size * 0.32, ["--i" as string]: shown.length } as React.CSSProperties}>+{extra}</span>}
    </div>
  )
}

/** Profile row: avatar + name + sub line. Common in lists, headers, sidebars. */
export function UserChip({ name, sub, src, status, ring, className }: { name: string; sub?: string; src?: string; status?: AvatarStatus; ring?: boolean; className?: string }) {
  return (
    <div className={cn("flex min-w-0 items-center gap-3", className)}>
      <Avatar name={name} src={src} status={status} ring={ring} />
      <div className="min-w-0 leading-snug"><div className="truncate font-semibold">{name}</div>{sub && <div className="truncate text-xs text-muted-foreground">{sub}</div>}</div>
    </div>
  )
}

/** Use for a linear percent bar (upload, form completion). For a circular gauge use ProgressRing instead; for numbered steps use StepProgress instead; for an indeterminate wait use Spinner instead. */
export function Progress({ value, max = 100, label, className }: { value: number; max?: number; label?: string; className?: string }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100))
  return (
    <div className={cn("space-y-1", className)}>
      {label && <div className="flex justify-between text-xs font-semibold"><span>{label}</span><span>{Math.round(pct)}%</span></div>}
      <PG.Root value={pct} className="h-2.5 overflow-hidden rounded-full bg-muted">
        <PG.Indicator className="h-full rounded-full bg-success transition-transform duration-700 ease-[var(--ease-ios)]" style={{ transform: "translateX(-" + (100 - pct) + "%)" }} />
      </PG.Root>
    </div>
  )
}

/** Circular progress (patrol completion, shift time). Arc eases with the iOS curve. */
export function ProgressRing({ value, max = 100, size = 64, stroke = 6, label, tone = "success", className }: { value: number; max?: number; size?: number; stroke?: number; label?: React.ReactNode; tone?: "success" | "warning" | "danger" | "gold"; className?: string }) {
  const pct = Math.max(0, Math.min(1, value / max)), r = (size - stroke) / 2, c = 2 * Math.PI * r
  const col = { success: "var(--success)", warning: "var(--warning)", danger: "var(--destructive)", gold: "var(--gold)" }[tone]
  return (
    <div role="progressbar" aria-valuenow={Math.round(pct * 100)} aria-valuemin={0} aria-valuemax={100} className={cn("relative inline-flex items-center justify-center", className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--muted)" strokeWidth={stroke} />
        <circle className="vks-ring-arc" cx={size / 2} cy={size / 2} r={r} fill="none" stroke={col} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - pct)} />
      </svg>
      <span className="absolute text-sm font-bold tabular-nums">{label ?? Math.round(pct * 100) + "%"}</span>
    </div>
  )
}

/** Use for collapsible sections such as FAQs or grouped settings (Radix Accordion root; pass type="single" or "multiple"). For switching between peer views use Tabs instead; for a nested hierarchy use TreeView instead. */
export const Accordion = AC.Root
/** Use for one collapsible section inside Accordion (needs a unique value). For a static divider between items use Separator instead. */
export function AccordionItem({ className, ...p }: React.ComponentProps<typeof AC.Item>) { return <AC.Item className={cn("border-b", className)} {...p} /> }
/** Use for the tappable header row of an AccordionItem (chevron rotates). For a plain heading that never collapses use CardTitle instead. */
export function AccordionTrigger({ className, children, ...p }: React.ComponentProps<typeof AC.Trigger>) {
  return (
    <AC.Header><AC.Trigger className={cn("group flex min-h-12 w-full items-center justify-between gap-2 py-3 text-left font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", className)} {...p}>
      {children}<ChevronDown className="vks-acc-chev size-4 shrink-0 text-muted-foreground" /></AC.Trigger></AC.Header>
  )
}
/** Use for the body that expands under an AccordionTrigger. For content in a popup use Popover or Sheet instead. */
export function AccordionContent({ className, children, ...p }: React.ComponentProps<typeof AC.Content>) {
  return <AC.Content className={cn("vks-acc overflow-hidden text-sm", className)} {...p}><div className="pb-3">{children}</div></AC.Content>
}

/** Read-only or tap-to-rate. 44 px targets when interactive. Tapping pops the stars in a ripple up to the chosen one; supports half stars when read-only. */
export function StarRating({ value, onChange, max = 5, size = "md", className }: { value: number; onChange?: (v: number) => void; max?: number; size?: "sm" | "md" | "lg"; className?: string }) {
  const [hover, setHover] = React.useState<number | null>(null)
  const [burst, setBurst] = React.useState(0)
  const shown = hover ?? value
  const sz = { sm: "size-4", md: "size-6", lg: "size-8" }[size]
  return (
    <div className={cn("inline-flex", className)} role={onChange ? "radiogroup" : "img"} aria-label={value + " / " + max} onPointerLeave={() => setHover(null)}>
      {Array.from({ length: max }, (_, i) => {
        const fill = Math.max(0, Math.min(1, shown - i))
        const star = (
          <span key={onChange ? burst + "-" + i : i} className={cn("relative inline-block", onChange && burst > 0 && i < value && "vks-star")} style={{ ["--i" as string]: i } as React.CSSProperties}>
            <Star className={cn(sz, "text-muted-foreground/40")} strokeWidth={1.5} />
            {fill > 0 && <span className="absolute inset-0 overflow-hidden" style={{ width: fill * 100 + "%" }}><Star className={cn(sz, "fill-gold text-gold drop-shadow-[0_1px_2px_rgb(176_141_74/.45)]")} strokeWidth={1.5} /></span>}
          </span>
        )
        return onChange
          ? <button key={i} type="button" role="radio" aria-checked={i + 1 === value} aria-label={String(i + 1)} onPointerEnter={(e) => e.pointerType === "mouse" && setHover(i + 1)} onClick={() => { onChange(i + 1); setBurst((b) => b + 1) }} className="vks-star-btn flex size-11 items-center justify-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{star}</button>
          : star
      })}
    </div>
  )
}

export type TimelineItem = { id: string; time: string; title: string; detail?: string; tone?: "success" | "warning" | "danger" | "neutral" }
/** Use for a vertical history of events (patrol log, audit trail, status changes). For a table of records use DataTable instead; for a live feed with read/unread use NotificationList instead. */
export function Timeline({ items, className }: { items: TimelineItem[]; className?: string }) {
  const dot = { success: "bg-success", warning: "bg-warning", danger: "bg-destructive", neutral: "bg-muted-foreground" }
  return (
    <ol className={cn("relative space-y-4 border-l-2 border-border pl-5", className)}>
      {items.map((it, i) => (
        <li key={it.id} className="vks-fade-up relative" style={{ animationDelay: Math.min(i, 7) * 40 + "ms" }}>
          <span className={cn("absolute -left-[27px] top-1.5 size-3 rounded-full ring-4 ring-background", dot[it.tone ?? "neutral"])} />
          <div className="text-xs text-muted-foreground">{it.time}</div>
          <div className="font-semibold leading-snug">{it.title}</div>
          {it.detail && <div className="text-sm text-muted-foreground">{it.detail}</div>}
        </li>
      ))}
    </ol>
  )
}

/**
 * Dashboard number tiles: 2 per row on phone, 4 on desktop. Each tile has a tone accent line, optional icon chip,
 * trend pill (auto up/down from a leading "+" / "-" in hint, or set trend) and a faint sparkline (spark).
 * All new fields are optional, so the old { label, value, hint, tone } shape still works.
 */
export type KpiItem = { label: string; value: React.ReactNode; hint?: string; tone?: "success" | "warning" | "danger"; icon?: React.ReactNode; trend?: "up" | "down" | "flat"; spark?: number[] }
/** Use for a row of 2-6 headline numbers at the top of a dashboard. For one big metric with a trend line use StatCard instead; for a chart use @vks/ui/charts instead. */
export function KpiStrip({ items, className }: { items: KpiItem[]; className?: string }) {
  const text = { success: "text-success", warning: "text-warning", danger: "text-destructive" }
  const chip = { success: "bg-success/12 text-success", warning: "bg-warning/14 text-warning", danger: "bg-destructive/12 text-destructive" }
  const bar = { success: "bg-success", warning: "bg-warning", danger: "bg-destructive" }
  return (
    <div className={cn("grid grid-cols-2 gap-3 md:grid-cols-4", className)}>
      {items.map((k, i) => {
        const trend = k.trend ?? (k.hint?.startsWith("+") ? "up" : /^[-\u2212]/.test(k.hint ?? "") ? "down" : undefined)
        const t = k.tone
        const sp = k.spark && k.spark.length > 1 ? k.spark : null
        let d = "", area = ""
        if (sp) {
          const mn = Math.min(...sp), mx = Math.max(...sp), r = mx - mn || 1
          const pts = sp.map((v, j) => [(j / (sp.length - 1)) * 100, 26 - ((v - mn) / r) * 22] as const)
          d = pts.map(([x, y], j) => (j ? "L" : "M") + x.toFixed(1) + " " + y.toFixed(1)).join(" ")
          area = d + " L100 32 L0 32 Z"
        }
        return (
          <div key={k.label} style={{ animationDelay: Math.min(i, 7) * 50 + "ms" }}
            className={cn("vks-fade-up group relative min-h-28 overflow-hidden rounded-2xl border bg-card p-4 shadow-sm transition-[translate,box-shadow] duration-300 ease-out hover:-translate-y-0.5 hover:shadow-md", t && text[t])}>
            <span aria-hidden className={cn("absolute inset-x-4 top-0 h-[3px] rounded-b-full", t ? bar[t] : "bg-gold")} />
            {sp && (
              <svg aria-hidden viewBox="0 0 100 32" preserveAspectRatio="none" className="pointer-events-none absolute inset-x-0 bottom-0 h-10 w-full opacity-25 transition-opacity duration-300 group-hover:opacity-50">
                <path d={area} fill="currentColor" opacity=".25" /><path d={d} fill="none" stroke="currentColor" strokeWidth="1.6" vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round" />
              </svg>
            )}
            <div className="relative flex items-start justify-between gap-2">
              <div className="text-xs font-semibold leading-normal text-muted-foreground">{k.label}</div>
              {k.icon && <span className={cn("grid size-8 shrink-0 place-items-center rounded-xl [&_svg]:size-4", t ? chip[t] : "bg-primary/8 text-primary")}>{k.icon}</span>}
            </div>
            <div className={cn("relative mt-1 text-3xl font-bold leading-tight tabular-nums", t ? "" : "text-foreground")}>{k.value}</div>
            {k.hint && (
              <div className={cn("relative mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold leading-normal", trend === "up" ? "bg-success/12 text-success" : trend === "down" ? "bg-destructive/12 text-destructive" : "bg-muted text-muted-foreground")}>
                {trend === "up" && <ArrowUpRight className="size-3" />}{trend === "down" && <ArrowDownRight className="size-3" />}{k.hint}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

/** One hero metric for a phone dashboard: a big number, trend pill, sparkline and up to 3 compact secondary figures in a single card. */
export type KpiHeroItem = { label: string; value: React.ReactNode }
/** Use at the top of a PHONE dashboard when one number matters most (e.g. today's on-time rate); a KpiStrip of 4 tiles eats the whole first screen on a phone. For 2-6 equal numbers on desktop use KpiStrip instead; for a chart use @vks/ui/charts instead. */
export function KpiHero({ label, value, unit, hint, tone, trend, spark, icon, secondary, className }: {
  label: string; value: React.ReactNode; unit?: string; hint?: string; tone?: "success" | "warning" | "danger"; trend?: "up" | "down" | "flat"
  spark?: number[]; icon?: React.ReactNode; secondary?: KpiHeroItem[]; className?: string
}) {
  const text = { success: "text-success", warning: "text-warning", danger: "text-destructive" }
  const tr = trend ?? (hint?.startsWith("+") ? "up" : /^[-\u2212]/.test(hint ?? "") ? "down" : undefined)
  const sp = spark && spark.length > 1 ? spark : null
  let d = "", area = ""
  if (sp) {
    const mn = Math.min(...sp), mx = Math.max(...sp), r = mx - mn || 1
    d = sp.map((v, j) => (j ? "L" : "M") + ((j / (sp.length - 1)) * 100).toFixed(1) + " " + (34 - ((v - mn) / r) * 28).toFixed(1)).join(" ")
    area = d + " L100 40 L0 40 Z"
  }
  return (
    <div className={cn("vks-fade-up relative overflow-hidden rounded-3xl border bg-card p-5 shadow-sm", tone && text[tone], className)}>
      <span aria-hidden className={cn("absolute inset-x-6 top-0 h-[3px] rounded-b-full", tone ? "bg-current" : "bg-gold")} />
      {sp && <svg aria-hidden viewBox="0 0 100 40" preserveAspectRatio="none" className="pointer-events-none absolute inset-x-0 bottom-0 h-20 w-full opacity-30">
        <path d={area} fill="currentColor" opacity=".25" /><path d={d} fill="none" stroke="currentColor" strokeWidth="1.8" vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round" /></svg>}
      <div className="relative flex items-center gap-2 text-sm font-semibold leading-normal text-muted-foreground">
        {icon && <span className="grid size-8 place-items-center rounded-xl bg-primary/8 text-primary [&_svg]:size-4">{icon}</span>}{label}
      </div>
      <div className="relative mt-2 flex items-baseline gap-2 text-foreground">
        <span className="text-5xl font-bold leading-tight tabular-nums">{value}</span>{unit && <span className="text-lg font-semibold text-muted-foreground">{unit}</span>}
      </div>
      {hint && <div className={cn("relative mt-1 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold leading-normal", tr === "up" ? "bg-success/12 text-success" : tr === "down" ? "bg-destructive/12 text-destructive" : "bg-muted text-muted-foreground")}>
        {tr === "up" && <ArrowUpRight className="size-3" />}{tr === "down" && <ArrowDownRight className="size-3" />}{hint}</div>}
      {secondary && secondary.length > 0 && <div className={cn("relative mt-4 grid gap-2 border-t pt-3", secondary.length === 1 ? "grid-cols-1" : secondary.length === 2 ? "grid-cols-2" : "grid-cols-3")}>
        {secondary.slice(0, 3).map((k) => <div key={k.label} className="min-w-0 leading-normal"><div className="truncate text-xs text-muted-foreground">{k.label}</div><div className="truncate text-lg font-bold tabular-nums text-foreground">{k.value}</div></div>)}
      </div>}
    </div>
  )
}

/**
 * Every page button stays mounted; the ones outside the window shrink and fade instead of vanishing,
 * and the ones entering grow and fade in, so the numbers flow rather than pop. The label colour waits for the pill.
 */
function PageBtn({ active, show, className, onClick, children }: { active: boolean; show: boolean; className: string; onClick: () => void; children: React.ReactNode }) {
  return <button aria-current={active ? "page" : undefined} aria-hidden={!show || undefined} tabIndex={show ? undefined : -1} onClick={onClick}
    className={cn(className.replace("vks-press ", ""), "transition-[max-width,min-width,margin,padding,opacity,transform,color,background-color] duration-[380ms] ease-[cubic-bezier(.22,1,.36,1)]",
      show ? "mx-0.5 max-w-16 scale-100 opacity-100 active:scale-95" : "pointer-events-none m-0 max-w-0 !min-w-0 scale-50 overflow-hidden !px-0 opacity-0",
      active ? "text-primary-foreground delay-100" : show && "hover:bg-muted")}>{children}</button>
}
function PageGap({ show }: { show: boolean }) {
  return <span aria-hidden className={cn("inline-block overflow-hidden text-center text-muted-foreground transition-[max-width,opacity,transform] duration-[380ms] ease-[cubic-bezier(.22,1,.36,1)]", show ? "max-w-8 scale-100 px-1 opacity-100" : "max-w-0 scale-50 px-0 opacity-0")}>…</span>
}

/** Page numbers with a pill that springs to the current page. Compact "3 / 12" mode for phones. */
export function Pagination({ page, pages, onPage, compact, className }: { page: number; pages: number; onPage: (p: number) => void; compact?: boolean; className?: string }) {
  const { ref, box, anim, measure } = useIndicator<HTMLDivElement>("[aria-current=page]", [page, pages])
  React.useLayoutEffect(() => { // the row reflows for ~380 ms: keep the pill glued to the active number
    let id = 0; const t0 = performance.now()
    const tick = () => { measure(); if (performance.now() - t0 < 460) id = requestAnimationFrame(tick) }
    tick(); return () => cancelAnimationFrame(id)
  }, [page, pages, measure])
  const prev = React.useRef(page), dir = page >= prev.current ? "up" : "down"
  React.useEffect(() => { prev.current = page }, [page])
  if (pages <= 1) return null
  const nums: (number | "…")[] = []
  for (let p = 1; p <= pages; p++) if (p === 1 || p === pages || Math.abs(p - page) <= 1) nums.push(p); else if (nums[nums.length - 1] !== "…") nums.push("…")
  const b = "vks-press relative z-10 inline-flex h-11 min-w-11 items-center justify-center rounded-xl px-3 text-sm font-semibold transition-colors duration-200 disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
  const arrow = (d: -1 | 1) => <button aria-label={d < 0 ? "previous" : "next"} className={cn(b, "hover:bg-muted [&_svg]:size-5")} disabled={d < 0 ? page <= 1 : page >= pages} onClick={() => onPage(page + d)}>{d < 0 ? <ChevronLeft /> : <ChevronRight />}</button>
  return (
    <nav aria-label="pagination" className={cn("flex items-center justify-center gap-1", className)}>
      {arrow(-1)}
      {compact
        ? <span className="min-w-16 overflow-hidden text-center text-sm font-semibold tabular-nums"><span key={page} className={cn("inline-block", dir === "up" ? "vks-tick-up" : "vks-tick-down")}>{page}</span><span className="text-muted-foreground"> / {pages}</span></span>
        : <div ref={ref} className="relative flex flex-wrap items-center">
          <Indicator box={box} anim={anim} className="rounded-xl bg-primary shadow-[0_6px_16px_-6px_rgb(20_23_61/.55)]" />
          {pages <= 40
            ? <>{Array.from({ length: pages }, (_, k) => k + 1).map((n) => {
                const show = n === 1 || n === pages || Math.abs(n - page) <= 1
                return <React.Fragment key={n}>
                  {n === 2 && pages > 4 && <PageGap show={page > 3} />}
                  <PageBtn active={n === page} show={show} className={b} onClick={() => onPage(n)}>{n}</PageBtn>
                  {n === pages - 1 && pages > 4 && <PageGap show={page < pages - 2} />}
                </React.Fragment>
              })}</>
            : nums.map((n, i) => n === "…" ? <span key={"e" + i} className="px-1 text-muted-foreground">…</span>
              : <PageBtn key={n} active={n === page} show className={b} onClick={() => onPage(n)}>{n}</PageBtn>)}
        </div>}
      {arrow(1)}
    </nav>
  )
}