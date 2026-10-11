import * as React from "react"
import { Popover } from "radix-ui"
import { CalendarRange, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "../lib/cn"
import { LAO_MONTHS, LAO_WEEKDAYS, addMonths, formatLaoDate, inRange, monthCells, parseISO, todayISO, toISO } from "../lib/date"
import { PRESETS, daysBetween, inSpan, pickRange, type Range } from "../lib/date-range"
import { useIsMobile } from "../lib/use-media"
import { Sheet, SheetContent, SheetTitle, InSheetView, useInSheet } from "./overlay"
import { Button } from "./button"

/** Month grid with a highlighted span. Tap start, tap end. Hover preview on desktop. */
export function RangeCalendar({ value, onChange, min, max, months = 1 }: { value: Range; onChange: (r: Range) => void; min?: string; max?: string; months?: 1 | 2 }) {
  const base = parseISO(value.from ?? todayISO())!
  const [view, setViewRaw] = React.useState({ y: base.y, m: base.m }), [hover, setHover] = React.useState<string | null>(null)
  const [slide, setSlide] = React.useState<"next" | "prev" | null>(null)
  const setView = (v: { y: number; m: number }) => { setSlide(v.y * 12 + v.m > view.y * 12 + view.m ? "next" : "prev"); setViewRaw(v) }
  const today = todayISO()
  const preview: Range = value.from && !value.to && hover ? (hover < value.from ? { from: hover, to: value.from } : { from: value.from, to: hover }) : value
  const grid = (v: { y: number; m: number }) => (
    <div className={cn("w-full min-w-[17rem]", slide === "next" && "vks-month-next", slide === "prev" && "vks-month-prev")} key={v.y + "-" + v.m}>
      <div className="mb-1 text-center font-bold">{LAO_MONTHS[v.m]} {v.y}</div>
      <div className="grid grid-cols-7 text-center text-xs font-semibold text-muted-foreground">{LAO_WEEKDAYS.map((d) => <div key={d} className="py-1">{d}</div>)}</div>
      <div className="grid grid-cols-7" role="grid">
        {monthCells(v.y, v.m).map((d, i) => {
          if (!d) return <div key={i} />
          const iso = toISO(v.y, v.m, d), ok = inRange(iso, min, max)
          const edge = iso === preview.from || iso === preview.to, mid = inSpan(iso, preview) && !edge
          const startCap = iso === preview.from && !!preview.to && preview.to !== preview.from, endCap = iso === preview.to && preview.from !== preview.to
          return (
            <div key={i} className={cn("relative flex justify-center", mid && "bg-accent", startCap && "rounded-l-full bg-accent", endCap && "rounded-r-full bg-accent")}>
              <button disabled={!ok} aria-label={iso} aria-pressed={edge} onClick={() => onChange(pickRange(value, iso))} onMouseEnter={() => setHover(iso)} onMouseLeave={() => setHover(null)}
                className={cn("flex size-11 items-center justify-center rounded-full text-sm tabular-nums transition-colors disabled:opacity-30", edge ? "vks-day-pick bg-primary font-bold text-primary-foreground shadow-[0_6px_14px_-6px_rgb(20_23_61/.6)]" : "hover:bg-muted", iso === today && !edge && "ring-1 ring-gold")}>{d}</button>
            </div>
          )
        })}
      </div>
    </div>
  )
  const second = addMonths(view.y, view.m, 1)
  return (
    <div className="select-none">
      <div className="mb-2 flex items-center justify-between">
        <button aria-label="prev" className="vks-press flex size-11 items-center justify-center rounded-lg hover:bg-muted" onClick={() => setView(addMonths(view.y, view.m, -1))}><ChevronLeft className="size-5" /></button>
        <span className="text-xs text-muted-foreground">{value.from && value.to ? daysBetween(value.from, value.to) + " ມື້" : value.from ? "ເລືອກວັນສຸດທ້າຍ" : "ເລືອກວັນເລີ່ມ"}</span>
        <button aria-label="next" className="vks-press flex size-11 items-center justify-center rounded-lg hover:bg-muted" onClick={() => setView(addMonths(view.y, view.m, 1))}><ChevronRight className="size-5" /></button>
      </div>
      <div className={cn("grid gap-4", months === 2 && "md:grid-cols-2")}>{grid(view)}{months === 2 && <div className="hidden md:block">{grid(second)}</div>}</div>
    </div>
  )
}

export const formatRange = (r: Range) => (!r.from ? "" : !r.to || r.from === r.to ? formatLaoDate(r.from) : formatLaoDate(r.from) + " – " + formatLaoDate(r.to))

/** Range field. Desktop: popover with presets + 2 months. Phone: bottom sheet with preset chips + 1 month. Value only changes on Apply. */
export function DateRangePicker({ value, onChange, min, max, placeholder = "ເລືອກໄລຍະເວລາ", className, lang = "lo" }: { value: Range; onChange: (r: Range) => void; min?: string; max?: string; placeholder?: string; className?: string; lang?: "lo" | "en" }) {
  const mobile = useIsMobile(), nested = useInSheet(), [open, setOpen] = React.useState(false), [draft, setDraft] = React.useState<Range>(value)
  React.useEffect(() => { if (open) setDraft(value) }, [open])
  const apply = () => { if (draft.from) onChange({ from: draft.from, to: draft.to ?? draft.from }); setOpen(false) }
  const body = (
    <div className="space-y-3">
      <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] md:flex-wrap">
        {PRESETS.map((p) => <button key={p.id} type="button" onClick={() => setDraft(p.range(todayISO()))} className="vks-press h-11 shrink-0 rounded-full border border-input bg-card px-4 text-sm font-semibold hover:bg-muted md:h-9">{lang === "lo" ? p.lo : p.en}</button>)}
      </div>
      <RangeCalendar value={draft} onChange={setDraft} min={min} max={max} months={mobile ? 1 : 2} />
      <div className="flex items-center justify-between gap-2 border-t pt-3">
        <span className="text-sm font-semibold">{formatRange(draft) || "—"}</span>
        <div className="flex gap-2"><Button variant="ghost" onClick={() => setOpen(false)}>{lang === "lo" ? "ຍົກເລີກ" : "Cancel"}</Button><Button disabled={!draft.from} onClick={apply}>{lang === "lo" ? "ຕົກລົງ" : "Apply"}</Button></div>
      </div>
    </div>
  )
  const trigger = (
    <button type="button" onClick={mobile ? () => setOpen(true) : undefined} className={cn("vks-field flex h-11 w-full items-center justify-between gap-2 rounded-lg border border-input bg-card px-3 text-left text-sm focus-visible:outline-none focus-visible:border-ring data-[state=open]:border-ring", !value.from && "text-muted-foreground", className)}>
      <span className="truncate">{formatRange(value) || placeholder}</span><CalendarRange className="size-4 shrink-0 text-muted-foreground" /></button>
  )
  if (mobile && nested) return <>{trigger}<InSheetView open={open} onBack={() => setOpen(false)} title={placeholder}><div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">{body}</div></InSheetView></>
  if (mobile) return <>{trigger}<Sheet open={open} onOpenChange={setOpen}><SheetContent side="bottom"><SheetTitle>{placeholder}</SheetTitle><div className="mt-3">{body}</div></SheetContent></Sheet></>
  return (
    <Popover.Root open={open} onOpenChange={setOpen} modal={nested}>
      <Popover.Trigger asChild>{trigger}</Popover.Trigger>
      <Popover.Portal><Popover.Content sideOffset={6} align="start" collisionPadding={12} avoidCollisions className="vks-panel z-50 max-h-[var(--radix-popover-content-available-height)] w-[min(44rem,calc(100vw-2rem))] overflow-auto rounded-2xl border bg-popover p-4 shadow-[0_24px_60px_-20px_rgb(20_23_61/.45)]">{body}</Popover.Content></Popover.Portal>
    </Popover.Root>
  )
}