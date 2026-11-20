import * as React from "react"
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "../lib/cn"
import { LAO_MONTHS, LAO_WEEKDAYS, daysIn, monthCells, toISO } from "../lib/date"
import type { Range } from "../lib/date-range"
import { Button } from "./button"
import { Input } from "./input"
import { Popover, PopoverContent, PopoverTrigger } from "./extras"
import { RangeCalendar, formatRange } from "./date-range-picker"

/**
 * Use for a date range chosen inside a sheet or panel that is already open (phone filter sheet): quick ranges, then a
 * one-month calendar, all in place, so no second sheet opens on top. Every tap applies at once. For a range in a page
 * control row use DateRangePicker.
 */
export function RangeInline({ value, onChange, presets, allLabel }: { value: Range; onChange: (r: Range) => void; presets: [string, Range][]; allLabel?: string }) {
  // a start day without an end yet stays here; the page only ever gets a finished range
  const [start, setStart] = React.useState<string | null>(null)
  const shown: Range = start ? { from: start } : value
  const pick = (r: Range) => { if (r.from && !r.to) setStart(r.from); else { setStart(null); onChange(r) } }
  const same = (r: Range) => !start && r.from === value.from && (r.to ?? r.from) === (value.to ?? value.from)
  const pill = (on: boolean) => cn("vks-press h-11 shrink-0 rounded-full border px-4 text-sm font-semibold leading-normal", on ? "border-primary bg-primary text-primary-foreground" : "border-input bg-card hover:bg-muted")
  return (
    <div className="grid min-w-0 gap-2">
      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none]">
        {allLabel && <button type="button" className={pill(!value.from && !start)} onClick={() => { setStart(null); onChange({}) }}>{allLabel}</button>}
        {presets.map(([l, r]) => <button key={l} type="button" className={pill(same(r))} onClick={() => { setStart(null); onChange(r) }}>{l}</button>)}
      </div>
      <div className="rounded-xl border p-2"><RangeCalendar value={shown} onChange={pick} months={1} /></div>
      {start
        ? <div className="flex min-h-11 items-center gap-2 text-sm leading-normal"><span className="min-w-0 flex-1 text-muted-foreground">ເລີ່ມ {formatRange({ from: start })} · ກົດວັນສຸດທ້າຍ</span>
            <Button variant="outline" className="shrink-0" onClick={() => { const s = start; setStart(null); onChange({ from: s, to: s }) }}>ໃຊ້ມື້ດຽວ</Button></div>
        : <p className="text-xs leading-normal text-muted-foreground">{value.from ? formatRange({ from: value.from, to: value.to ?? value.from }) : "ກົດວັນເລີ່ມ ແລ້ວ ກົດວັນສຸດທ້າຍ"}</p>}
    </div>
  )
}

const pad = (n: number) => String(n).padStart(2, "0")
/** "12/04/1999" (also 12.4.1999, 12-04-1999) → "1999-04-12"; null when it is not a real date. */
export function parseDmy(s: string): string | null {
  const m = /^\s*(\d{1,2})[/.\- ](\d{1,2})[/.\- ](\d{4})\s*$/.exec(s)
  if (!m) return null
  const d = +m[1], mo = +m[2], y = +m[3]
  return mo >= 1 && mo <= 12 && d >= 1 && d <= daysIn(y, mo - 1) ? toISO(y, mo - 1, d) : null
}
/** "1999-04-12" → "12/04/1999" ("" for null). */
export const fmtDmy = (iso: string | null | undefined) => (iso ? iso.slice(8, 10) + "/" + iso.slice(5, 7) + "/" + iso.slice(0, 4) : "")
/** Completed years between a birth date and today (both YYYY-MM-DD). */
export function ageOn(dob: string, today: string): number {
  const a = +today.slice(0, 4) - +dob.slice(0, 4)
  return today.slice(5) < dob.slice(5) ? a - 1 : a
}
/** Why a typed birth date is refused (Lao message), or null when it is fine or empty. */
export function dobError(iso: string | null, text: string, today: string, minAge = 16, earliest = "1950-01-01"): string | null {
  if (!text.trim()) return null
  if (!iso) return "ໃສ່ເປັນ ວວ/ດດ/ປປປປ ເຊັ່ນ 12/04/1999"
  if (iso > today || iso < earliest) return "ວັນເດືອນປີເກີດ ບໍ່ຖືກ"
  return ageOn(iso, today) < minAge ? "ຕ້ອງມີອາຍຸ " + minAge + " ປີ ຂຶ້ນໄປ" : null
}

/**
 * Use for a birth date (or any date far in the past): type it as dd/mm/yyyy, or pick it with a picker that starts on
 * the YEAR (12 at a time), then the month, then the day, instead of a calendar 300 clicks from 1999. The latest year
 * offered makes the person minAge. Pair the typed text with dobError for the message. For near dates use DatePicker.
 */
export function DateInput({ id, value, onChange, today, minAge = 16, invalid, onText }: {
  id?: string; value: string | null; onChange: (iso: string | null) => void
  /** Today (YYYY-MM-DD, local). */
  today: string
  /** Youngest age the picker allows. Default 16. */
  minAge?: number; invalid?: boolean
  /** The raw typed text (for dobError). */
  onText?: (text: string) => void
}) {
  const [text, setText] = React.useState(fmtDmy(value)), [open, setOpen] = React.useState(false)
  const maxY = +today.slice(0, 4) - minAge, maxIso = maxY + today.slice(4)
  const [step, setStep] = React.useState<"y" | "m" | "d">("y"), [y, setY] = React.useState(1999), [m, setM] = React.useState(0), [page, setPage] = React.useState(maxY - 11)
  React.useEffect(() => { if (value && parseDmy(text) !== value) setText(fmtDmy(value)) }, [value]) // eslint-disable-line react-hooks/exhaustive-deps
  const type = (s: string) => { setText(s); onText?.(s); onChange(parseDmy(s)) }
  const begin = (o: boolean) => {
    setOpen(o)
    if (!o) return
    const cur = value ? +value.slice(0, 4) : 0
    setStep("y"); setPage(cur && cur <= maxY ? Math.min(maxY - 11, cur - (cur % 12 === 0 ? 0 : 5)) : maxY - 11)
  }
  const cell = "vks-press flex h-11 items-center justify-center rounded-lg text-sm tabular-nums transition-colors hover:bg-muted disabled:opacity-30 disabled:hover:bg-transparent md:h-9"
  const on = "bg-primary font-bold text-primary-foreground hover:bg-primary"
  const head = (title: React.ReactNode, prev?: () => void, next?: () => void, canNext = true) => (
    <div className="mb-2 flex items-center justify-between">
      <Button variant="ghost" size="icon" aria-label="ກ່ອນໜ້າ" disabled={!prev} onClick={prev}><ChevronLeft /></Button>
      <div className="text-sm font-bold leading-normal">{title}</div>
      <Button variant="ghost" size="icon" aria-label="ຕໍ່ໄປ" disabled={!next || !canNext} onClick={next}><ChevronRight /></Button>
    </div>
  )
  return (
    <div className="flex gap-2">
      <Input id={id} inputMode="numeric" placeholder="ວວ/ດດ/ປປປປ" value={text} invalid={invalid} onChange={(e) => type(e.target.value)} className="min-w-0 flex-1 tabular-nums" />
      <Popover open={open} onOpenChange={begin}>
        <PopoverTrigger asChild><Button type="button" variant="outline" size="icon" aria-label="ເລືອກວັນທີ"><CalendarDays /></Button></PopoverTrigger>
        <PopoverContent align="end" className="w-80">
          {step === "y" && <>
            {head(page + " – " + (page + 11), page > 1950 ? () => setPage(Math.max(1950, page - 12)) : undefined, () => setPage(Math.min(maxY - 11, page + 12)), page + 11 < maxY)}
            <div className="grid grid-cols-4 gap-1">
              {Array.from({ length: 12 }, (_, i) => page + i).map((yy) => <button key={yy} type="button" disabled={yy > maxY || yy < 1950} onClick={() => { setY(yy); setStep("m") }} className={cn(cell, value?.startsWith(yy + "-") && on)}>{yy}</button>)}
            </div>
            <p className="mt-2 text-xs leading-normal text-muted-foreground">ປີລ່າສຸດ {maxY} (ອາຍຸ {minAge} ປີ ຂຶ້ນໄປ)</p>
          </>}
          {step === "m" && <>
            {head(<button type="button" className="underline-offset-4 hover:underline" onClick={() => setStep("y")}>{y}</button>)}
            <div className="grid grid-cols-3 gap-1">
              {LAO_MONTHS.map((name, i) => <button key={name} type="button" disabled={toISO(y, i, 1) > maxIso} onClick={() => { setM(i); setStep("d") }} className={cn(cell, value?.startsWith(y + "-" + pad(i + 1)) && on)}>{name}</button>)}
            </div>
          </>}
          {step === "d" && <>
            {head(<><button type="button" className="underline-offset-4 hover:underline" onClick={() => setStep("m")}>{LAO_MONTHS[m]}</button>{" "}<button type="button" className="underline-offset-4 hover:underline" onClick={() => setStep("y")}>{y}</button></>)}
            <div className="grid grid-cols-7 text-center text-xs font-semibold text-muted-foreground">{LAO_WEEKDAYS.map((d) => <div key={d} className="py-1">{d}</div>)}</div>
            <div className="grid grid-cols-7 gap-y-1">
              {monthCells(y, m).map((d, i) => {
                if (!d) return <div key={i} />
                const iso = toISO(y, m, d)
                return <button key={i} type="button" disabled={iso > maxIso} aria-label={iso} onClick={() => { onChange(iso); setText(fmtDmy(iso)); onText?.(fmtDmy(iso)); setOpen(false) }} className={cn(cell, "mx-auto size-11 rounded-full md:size-9", iso === value && on)}>{d}</button>
              })}
            </div>
          </>}
        </PopoverContent>
      </Popover>
    </div>
  )
}
