import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "../lib/cn"
import { LAO_MONTHS, LAO_WEEKDAYS, addMonths, monthCells, todayISO, toISO } from "../lib/date"
import { Button } from "./button"

/** Half-hour starts between two times, e.g. halfHours("08:00", "11:30") → 08:00 … 11:30 (8 slots). */
export function halfHours(from: string, to: string): string[] {
  const m = (s: string) => +s.slice(0, 2) * 60 + +s.slice(3, 5), out: string[] = []
  for (let t = m(from); t <= m(to); t += 30) out.push(String(Math.floor(t / 60)).padStart(2, "0") + ":" + String(t % 60).padStart(2, "0"))
  return out
}

/**
 * Use for booking a day + a time in one place (interviews, visits), shown in place so it never opens a popup on a
 * popup: a month calendar (a gold dot = the day already has bookings) beside the time slots (a small number = bookings
 * at that time). Wide forms put the times in 2 rows of 8. For a free date use DatePicker; for a free time TimePicker.
 */
export function SlotPicker({ date, time, onChange, times, isOpenDay, dayCounts, timeCounts, min, hint }: {
  date: string; time: string; onChange: (date: string, time: string) => void
  /** The bookable starts, e.g. [...halfHours("08:00","11:30"), ...halfHours("13:00","16:30")]. */
  times: readonly string[]
  /** false = day closed (greyed out). Default: every day is open. */
  isOpenDay?: (iso: string) => boolean
  /** Bookings per day (YYYY-MM-DD → n): a dot under the day. */
  dayCounts?: Record<string, number>
  /** Bookings per day and time: the small number on a time. */
  timeCounts?: Record<string, Record<string, number>>
  /** First bookable day. Default today. */
  min?: string
  /** One muted line under the times. */
  hint?: React.ReactNode
}) {
  const first = min ?? todayISO()
  const base = date || first
  const [view, setView] = React.useState({ y: +base.slice(0, 4), m: +base.slice(5, 7) - 1 })
  const cell = "vks-press relative mx-auto flex size-11 items-center justify-center rounded-full text-sm tabular-nums transition-colors hover:bg-muted disabled:opacity-30 disabled:hover:bg-transparent md:size-9"
  const monthStart = toISO(view.y, view.m, 1)
  return (
    <div className="@container"><div className="grid gap-3 @xl:grid-cols-[auto_minmax(0,1fr)]">
      <div className="rounded-xl border p-2">
        <div className="flex items-center justify-between">
          <Button type="button" variant="ghost" size="icon" className="md:size-9" aria-label="ເດືອນກ່ອນ" disabled={monthStart <= first} onClick={() => setView(addMonths(view.y, view.m, -1))}><ChevronLeft /></Button>
          <b className="text-sm leading-normal">{LAO_MONTHS[view.m]} {view.y}</b>
          <Button type="button" variant="ghost" size="icon" className="md:size-9" aria-label="ເດືອນຕໍ່ໄປ" onClick={() => setView(addMonths(view.y, view.m, 1))}><ChevronRight /></Button>
        </div>
        <div className="grid grid-cols-7 text-center text-xs font-semibold text-muted-foreground">{LAO_WEEKDAYS.map((d) => <div key={d} className="py-0.5">{d}</div>)}</div>
        <div className="grid grid-cols-7">
          {monthCells(view.y, view.m).map((d, i) => {
            if (!d) return <div key={i} />
            const iso = toISO(view.y, view.m, d), ok = iso >= first && (isOpenDay ? isOpenDay(iso) : true), on = iso === date
            return <button key={i} type="button" disabled={!ok} aria-label={iso} aria-pressed={on} onClick={() => onChange(iso, time)}
              className={cn(cell, on ? "bg-primary font-bold text-primary-foreground hover:bg-primary" : iso === todayISO() && "ring-1 ring-gold")}>
              {d}{!!dayCounts?.[iso] && <span aria-hidden className={cn("absolute bottom-1 size-1 rounded-full", on ? "bg-primary-foreground" : "bg-gold")} />}
            </button>
          })}
        </div>
      </div>
      <div>
        <div role="group" aria-label="ເວລາ" className="grid grid-cols-4 gap-1.5 @4xl:grid-cols-8">
          {times.map((t) => {
            const n = date ? timeCounts?.[date]?.[t] ?? 0 : 0, on = t === time
            return <button key={t} type="button" disabled={!date} aria-pressed={on} onClick={() => onChange(date, t)}
              className={cn("vks-press relative flex h-11 items-center justify-center rounded-lg border text-sm font-semibold tabular-nums transition-colors disabled:opacity-40 md:h-9", on ? "border-primary bg-primary text-primary-foreground" : "border-input bg-card hover:bg-muted")}>
              {t}{n > 0 && <span className={cn("absolute -right-1 -top-1 min-w-5 rounded-full px-1 text-center text-[11px] leading-5", on ? "bg-gold text-gold-foreground" : "bg-muted text-muted-foreground")}>{n}</span>}
            </button>
          })}
        </div>
        {hint && <p className="mt-2 text-xs leading-normal text-muted-foreground">{hint}</p>}
      </div>
    </div></div>
  )
}
