import * as React from "react"
import { Popover } from "radix-ui"
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "../lib/cn"
import { LAO_MONTHS, LAO_WEEKDAYS, addMonths, formatLaoDate, inRange, monthCells, parseISO, todayISO, toISO, daysIn } from "../lib/date"
import { useIsMobile } from "../lib/use-media"
import { Sheet, SheetContent, SheetTitle, InSheetView, useInSheet } from "./overlay"
import { Button } from "./button"

/** Month grid. Value is 'YYYY-MM-DD'. */
export function Calendar({ value, onChange, min, max, marked }: { value?: string; onChange: (iso: string) => void; min?: string; max?: string; marked?: string[] }) {
  const sel = value ? parseISO(value) : null, now = parseISO(todayISO())!
  const [view, setViewRaw] = React.useState({ y: (sel ?? now).y, m: (sel ?? now).m })
  const [slide, setSlide] = React.useState<"next" | "prev" | null>(null)
  const setView = (v: { y: number; m: number }) => { setSlide(v.y * 12 + v.m > view.y * 12 + view.m ? "next" : "prev"); setViewRaw(v) }
  const today = todayISO()
  return (
    <div className="w-full max-w-[21rem] select-none">
      <div className="mb-2 flex items-center justify-between">
        <button aria-label="prev" className="vks-press flex size-11 items-center justify-center rounded-lg hover:bg-muted" onClick={() => setView(addMonths(view.y, view.m, -1))}><ChevronLeft className="size-5" /></button>
        <b key={view.y + "-" + view.m} className={slide === "next" ? "vks-month-next" : slide === "prev" ? "vks-month-prev" : undefined}>{LAO_MONTHS[view.m]} {view.y}</b>
        <button aria-label="next" className="vks-press flex size-11 items-center justify-center rounded-lg hover:bg-muted" onClick={() => setView(addMonths(view.y, view.m, 1))}><ChevronRight className="size-5" /></button>
      </div>
      <div className="grid grid-cols-7 text-center text-xs font-semibold text-muted-foreground">{LAO_WEEKDAYS.map((d) => <div key={d} className="py-1">{d}</div>)}</div>
      <div key={view.y + "-" + view.m} className={cn("grid grid-cols-7 gap-y-1", slide === "next" && "vks-month-next", slide === "prev" && "vks-month-prev")} role="grid">
        {monthCells(view.y, view.m).map((d, i) => {
          if (!d) return <div key={i} />
          const iso = toISO(view.y, view.m, d), ok = inRange(iso, min, max), on = iso === value
          return (
            <button key={i} disabled={!ok} onClick={() => onChange(iso)} aria-pressed={on} aria-label={iso}
              className={cn("relative mx-auto flex size-11 items-center justify-center rounded-full text-sm tabular-nums transition-colors disabled:opacity-30",
                on ? "vks-day-pick bg-primary font-bold text-primary-foreground shadow-[0_6px_14px_-6px_rgb(20_23_61/.6)]" : "hover:bg-muted", iso === today && !on && "ring-1 ring-gold")}>
              {d}{marked?.includes(iso) && <span className="absolute bottom-1 size-1 rounded-full bg-success" />}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function WheelCol({ items, index, onIndex }: { items: string[]; index: number; onIndex: (i: number) => void }) {
  const ref = React.useRef<HTMLDivElement>(null), H = 44
  React.useEffect(() => { ref.current?.scrollTo({ top: index * H }) }, [index])
  const t = React.useRef<number>(0)
  return (
    <div ref={ref} className="h-[220px] flex-1 snap-y snap-mandatory overflow-y-auto py-[88px] [scrollbar-width:none]"
      onScroll={(e) => { const el = e.currentTarget; clearTimeout(t.current); t.current = window.setTimeout(() => { const i = Math.round(el.scrollTop / H); if (i !== index) onIndex(Math.max(0, Math.min(items.length - 1, i))) }, 90) }}>
      {items.map((s, i) => <div key={s + i} className={cn("flex h-11 snap-center items-center justify-center text-lg tabular-nums", i === index ? "font-bold" : "text-muted-foreground")}>{s}</div>)}
    </div>
  )
}
/** Phone form of the picker: three wheels in a bottom sheet. */
export function DateWheel({ value, onChange, min, max }: { value?: string; onChange: (iso: string) => void; min?: string; max?: string }) {
  const p = parseISO(value ?? todayISO())!, thisY = new Date().getFullYear()
  const years = Array.from({ length: 21 }, (_, i) => thisY - 10 + i)
  const set = (y: number, m: number, d: number) => { const iso = toISO(y, m, Math.min(d, daysIn(y, m))); if (inRange(iso, min, max)) onChange(iso) }
  return (
    <div className="relative flex">
      <div className="pointer-events-none absolute inset-x-0 top-1/2 h-11 -translate-y-1/2 rounded-lg bg-muted/70" />
      <WheelCol items={Array.from({ length: daysIn(p.y, p.m) }, (_, i) => String(i + 1))} index={p.d - 1} onIndex={(i) => set(p.y, p.m, i + 1)} />
      <WheelCol items={LAO_MONTHS} index={p.m} onIndex={(i) => set(p.y, i, p.d)} />
      <WheelCol items={years.map(String)} index={Math.max(0, years.indexOf(p.y))} onIndex={(i) => set(years[i], p.m, p.d)} />
    </div>
  )
}

/** Same value drives both forms: popover calendar on desktop, wheel bottom-sheet on phone (inside a Dialog/Sheet on phone: a pushed view in the same sheet). For a from–to span use DateRangePicker instead. */
export function DatePicker({ value, onChange, min, max, placeholder = "ເລືອກວັນທີ", className, id }: { value?: string; onChange: (iso: string) => void; min?: string; max?: string; placeholder?: string; className?: string; id?: string }) {
  const mobile = useIsMobile(), nested = useInSheet(), [open, setOpen] = React.useState(false)
  const trigger = (
    <button id={id} type="button" className={cn("vks-field flex h-11 w-full items-center justify-between gap-2 rounded-lg border border-input bg-card px-3 text-left text-sm focus-visible:outline-none focus-visible:border-ring data-[state=open]:border-ring", !value && "text-muted-foreground", className)} onClick={mobile ? () => setOpen(true) : undefined}>
      <span>{value ? formatLaoDate(value) : placeholder}</span><CalendarDays className="size-4 text-muted-foreground" /></button>
  )
  if (mobile && nested) return (
    <>{trigger}
      <InSheetView open={open} onBack={() => setOpen(false)} title={placeholder}>
        <div className="my-auto py-3"><DateWheel value={value} onChange={onChange} min={min} max={max} /></div>
        <div className="flex shrink-0 gap-2"><Button variant="outline" className="flex-1" onClick={() => { onChange(todayISO()); setOpen(false) }}>ມື້ນີ້</Button><Button className="flex-1" onClick={() => setOpen(false)}>ຕົກລົງ</Button></div>
      </InSheetView></>
  )
  if (mobile) return (
    <>{trigger}
      <Sheet open={open} onOpenChange={setOpen}><SheetContent side="bottom">
        <SheetTitle>{placeholder}</SheetTitle>
        <div className="my-3"><DateWheel value={value} onChange={onChange} min={min} max={max} /></div>
        <div className="flex gap-2"><Button variant="outline" className="flex-1" onClick={() => { onChange(todayISO()); setOpen(false) }}>ມື້ນີ້</Button><Button className="flex-1" onClick={() => setOpen(false)}>ຕົກລົງ</Button></div>
      </SheetContent></Sheet></>
  )
  return (
    <Popover.Root open={open} onOpenChange={setOpen} modal={nested}>
      <Popover.Trigger asChild>{trigger}</Popover.Trigger>
      <Popover.Portal><Popover.Content sideOffset={6} align="start" collisionPadding={12} className="vks-panel z-50 max-h-[var(--radix-popover-content-available-height)] overflow-auto rounded-2xl border bg-popover p-3 shadow-[0_24px_60px_-20px_rgb(20_23_61/.45)]">
        <Calendar value={value} min={min} max={max} onChange={(v) => { onChange(v); setOpen(false) }} />
      </Popover.Content></Popover.Portal>
    </Popover.Root>
  )
}