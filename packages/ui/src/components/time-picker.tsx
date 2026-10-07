import { useEffect, useRef, useState, type KeyboardEvent } from "react"
import { Clock } from "lucide-react"
import { cn } from "../lib/cn"
import { useIsMobile } from "../lib/use-media"
import { DAY_MIN as DAY, hourInSpan, isHHMM, minToTime as toTime, spanMin as span, spanSegments, timeToMin as toMin } from "../lib/time"
import { Badge } from "./badge"
import { Button } from "./button"
import { Label } from "./input"
import { Popover, PopoverContent, PopoverTrigger } from "./extras"
import { InSheetView, Sheet, SheetContent, SheetTitle, useInSheet } from "./overlay"
import { ToggleGroup, ToggleGroupItem } from "./toggle"

/* Shift time range, 24 h only (house rule: a shift is named by its time).
 * Two fields ເລີ່ມ → ເລີກ open one panel: 24 h bar, length (8 / 12 / ອື່ນໆ), hour grid, minute row.
 * Desktop: popover. Phone: bottom sheet (inside a Dialog: a pushed view in the same sheet).
 * Values stay "HH:MM" strings. Picking a start keeps the current length and moves on to ເລີກ. */

type Which = "start" | "end"
const OK = { test: isHHMM }
const hoursText = (min: number) => { const h = min / 60; return (Number.isInteger(h) ? String(h) : h.toFixed(1)) + " ຊົ່ວໂມງ" }
const HOURS = Array.from({ length: 24 }, (_, i) => i)
const MINUTES = [0, 15, 30, 45]
const CELL = "vks-press flex h-11 items-center justify-center rounded-lg text-base tabular-nums transition-[background-color,color,scale] duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
const PICKED = "bg-primary font-bold text-primary-foreground shadow-md"
const cellOf = (root: HTMLElement | null, h: number) => root?.querySelector<HTMLButtonElement>('[data-h="' + h + '"]') ?? null

/** Use for one clock time picked by tapping (meeting, visit, report time): hour grid + :00/:15/:30/:45, popover on desktop, sheet on phone. For a shift (start → end) use TimeRangePicker; for typing a time use TimeInput. */
export function TimePicker({ value, onChange, id, invalid, className }: { value: string; onChange: (v: string) => void; id?: string; invalid?: boolean; className?: string }) {
  const mobile = useIsMobile(), nested = useInSheet()
  const [open, setOpen] = useState(false)
  const grid = useRef<HTMLDivElement>(null)
  const cur = toMin(value)
  useEffect(() => { if (open) setTimeout(() => cellOf(grid.current, cur === null ? 9 : Math.floor(cur / 60))?.focus({ preventScroll: true }), 0) }, [open])
  const pick = (h: number, m: number) => onChange(toTime(h * 60 + m))
  const onGridKey = (ev: KeyboardEvent<HTMLDivElement>) => {
    const d = ({ ArrowLeft: -1, ArrowRight: 1, ArrowUp: -6, ArrowDown: 6 } as Record<string, number>)[ev.key]
    if (!d) return
    ev.preventDefault()
    cellOf(grid.current, (Number((document.activeElement as HTMLElement | null)?.dataset.h ?? 0) + d + 24) % 24)?.focus()
  }
  const panel = (
    <div className="flex select-none flex-col gap-3 leading-normal">
      <div ref={grid} role="grid" aria-label="ຊົ່ວໂມງ" onKeyDown={onGridKey} className="grid grid-cols-6 gap-1">
        {HOURS.map((h) => {
          const on = cur !== null && Math.floor(cur / 60) === h
          return <button key={h} type="button" data-h={h} tabIndex={on || (cur === null && h === 9) ? 0 : -1} aria-pressed={on} onClick={() => pick(h, cur === null ? 0 : cur % 60)}
            className={cn(CELL, on ? PICKED : "hover:bg-muted")}>{String(h).padStart(2, "0")}</button>
        })}
      </div>
      <div className="grid grid-cols-4 gap-1">
        {MINUTES.map((m) => {
          const on = cur !== null && cur % 60 === m
          return <button key={m} type="button" aria-pressed={on} onClick={() => { pick(cur === null ? 9 : Math.floor(cur / 60), m); setOpen(false) }} className={cn(CELL, on ? PICKED : "bg-muted/60 hover:bg-muted")}>:{String(m).padStart(2, "0")}</button>
        })}
      </div>
    </div>
  )
  const t = (
    <button id={id} type="button" aria-invalid={invalid || undefined} onClick={mobile ? () => setOpen(true) : undefined}
      className={cn("vks-field flex h-11 w-full min-w-0 items-center gap-2 rounded-lg border border-input bg-card px-3 text-left text-base focus-visible:border-ring focus-visible:outline-none data-[state=open]:border-ring", invalid && "border-destructive", open && "border-ring", className)}>
      <Clock className="size-4 shrink-0 text-muted-foreground" />
      <span className={cn("flex-1 tabular-nums", !OK.test(value) && "text-muted-foreground")}>{OK.test(value) ? value : "--:--"}</span>
    </button>
  )
  const done = <Button className="mt-3 h-11 w-full" onClick={() => setOpen(false)}>ຕົກລົງ</Button>
  if (!mobile) return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{t}</PopoverTrigger>
      <PopoverContent align="start" sideOffset={6} collisionPadding={12} onOpenAutoFocus={(ev) => ev.preventDefault()} className="w-[22rem] p-3">{panel}</PopoverContent>
    </Popover>
  )
  return (
    <>
      {t}
      {nested ? <InSheetView open={open} onBack={() => setOpen(false)} title="ເວລາ"><div className="py-2">{panel}{done}</div></InSheetView>
        : <Sheet open={open} onOpenChange={setOpen}><SheetContent side="bottom"><SheetTitle>ເວລາ</SheetTitle><div className="mt-3">{panel}{done}</div></SheetContent></Sheet>}
    </>
  )
}

/** Use for a shift's start and end time (24 h, may cross midnight, "+1 ມື້" on the end field): 24 h bar, length presets (12 / 8 ຊມ / ອື່ນໆ), hour grid, minute row. For one clock time use TimePicker; for a date span use DateRangePicker. */
export function TimeRangePicker({ starts, ends, onChange, presets = [12, 8], invalid, labels = true, id, className }: {
  starts: string; ends: string; onChange: (starts: string, ends: string) => void; presets?: number[]; invalid?: boolean; labels?: boolean; id?: string; className?: string
}) {
  const mobile = useIsMobile(), nested = useInSheet()
  const [open, setOpen] = useState<Which | null>(null)
  const [active, setActive] = useState<Which>("start")
  const s = toMin(starts), e = toMin(ends)
  const same = s !== null && s === e
  const overnight = s !== null && e !== null && e < s
  const show = (w: Which) => { setActive(w); setOpen(w) }

  const trigger = (w: Which) => {
    const v = w === "start" ? starts : ends
    const bad = w === "end" && (same || !!invalid)
    return (
      <button id={id ? id + "-" + w : undefined} type="button" aria-label={w === "start" ? "ເລີ່ມ" : "ເລີກ"} aria-invalid={bad || undefined}
        onClick={mobile ? () => show(w) : undefined}
        className={cn("vks-field flex h-11 w-full min-w-0 items-center gap-2 rounded-lg border border-input bg-card px-3 text-left text-base focus-visible:border-ring focus-visible:outline-none data-[state=open]:border-ring",
          bad && "border-destructive", open === w && "border-ring")}>
        <Clock className="size-4 shrink-0 text-muted-foreground" />
        <span className={cn("flex-1 tabular-nums", !OK.test(v) && "text-muted-foreground")}>{OK.test(v) ? v : "--:--"}</span>
        {w === "end" && overnight && <span className="shrink-0 rounded-full bg-warning/15 px-2 text-xs font-semibold leading-relaxed text-warning">+1 ມື້</span>}
      </button>
    )
  }
  const panel = <TimePanel starts={starts} ends={ends} onChange={onChange} presets={presets} active={active} setActive={setActive} />
  const field = (w: Which) => {
    const t = trigger(w)
    const wrapped = mobile ? t : (
      <Popover open={open === w} onOpenChange={(o) => (o ? show(w) : setOpen(null))}>
        <PopoverTrigger asChild>{t}</PopoverTrigger>
        <PopoverContent align="start" sideOffset={6} collisionPadding={12} onOpenAutoFocus={(ev) => ev.preventDefault()}
          className="w-[22rem] max-h-[var(--radix-popover-content-available-height)] overflow-auto p-3">{panel}</PopoverContent>
      </Popover>
    )
    return labels
      ? <div className="flex min-w-0 flex-col gap-1.5"><Label htmlFor={id ? id + "-" + w : undefined}>{w === "start" ? "ເລີ່ມ" : "ເລີກ"}</Label>{wrapped}</div>
      : <div className="min-w-0">{wrapped}</div>
  }
  const done = <Button className="mt-3 h-11 w-full" onClick={() => setOpen(null)}>ຕົກລົງ</Button>
  return (
    <>
      <div className={cn("grid grid-cols-2 gap-2", className)}>{field("start")}{field("end")}</div>
      {mobile && nested && <InSheetView open={!!open} onBack={() => setOpen(null)} title="ເວລາກະ"><div className="py-2">{panel}{done}</div></InSheetView>}
      {mobile && !nested && (
        <Sheet open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
          <SheetContent side="bottom"><SheetTitle>ເວລາກະ</SheetTitle><div className="mt-3">{panel}{done}</div></SheetContent>
        </Sheet>
      )}
    </>
  )
}

function TimePanel({ starts, ends, onChange, presets, active, setActive }: {
  starts: string; ends: string; onChange: (s: string, e: string) => void; presets: number[]; active: Which; setActive: (w: Which) => void
}) {
  const s = toMin(starts), e = toMin(ends), len = span(s, e)
  const cur = active === "start" ? s : e
  const grid = useRef<HTMLDivElement>(null)
  const [mode, setMode] = useState<string>(() => (len === null ? (presets.length ? String(presets[0]) : "other") : presets.includes(len / 60) ? String(len / 60) : "other"))
  useEffect(() => { if (len !== null) setMode(presets.includes(len / 60) ? String(len / 60) : "other") }, [len]) // eslint-disable-line react-hooks/exhaustive-deps
  // focus the chosen hour so arrows + Enter work at once
  useEffect(() => { cellOf(grid.current, cur === null ? 0 : Math.floor(cur / 60))?.focus({ preventScroll: true }) }, [active]) // eslint-disable-line react-hooks/exhaustive-deps

  function setStart(m: number) {
    const keep = len ?? (mode !== "other" ? +mode * 60 : null)
    onChange(toTime(m), keep !== null ? toTime(m + keep) : ends)
  }
  function pickHour(h: number) {
    const min = cur === null ? 0 : cur % 60
    if (active === "start") { setStart(h * 60 + min); setActive("end") }
    else onChange(starts, toTime(h * 60 + min))
  }
  function pickMinute(m: number) {
    const h = cur === null ? 0 : Math.floor(cur / 60)
    if (active === "start") setStart(h * 60 + m)
    else onChange(starts, toTime(h * 60 + m))
  }
  function pickMode(v: string) {
    if (!v) return
    setMode(v)
    if (v === "other") { setActive("end"); return }
    const base = s ?? 6 * 60
    onChange(toTime(base), toTime(base + +v * 60))
  }
  function onGridKey(ev: KeyboardEvent<HTMLDivElement>) {
    const d = ({ ArrowLeft: -1, ArrowRight: 1, ArrowUp: -6, ArrowDown: 6 } as Record<string, number>)[ev.key]
    if (!d) return
    ev.preventDefault()
    const h = Number((document.activeElement as HTMLElement | null)?.dataset.h ?? 0)
    cellOf(grid.current, (h + d + 24) % 24)?.focus()
  }
  const inSpan = (h: number) => hourInSpan(h, s, len)
  const other = active === "start" ? e : s
  // 24 h bar: one segment, or two when the shift crosses midnight
  const segs = spanSegments(s, e)

  return (
    <div className="flex select-none flex-col gap-3 leading-normal">
      <div className="grid grid-cols-2 gap-1 rounded-xl bg-muted p-[3px]" role="tablist">
        {(["start", "end"] as Which[]).map((w) => (
          <button key={w} type="button" role="tab" aria-selected={active === w} onClick={() => setActive(w)}
            className={cn("vks-press flex h-11 items-center justify-center gap-2 rounded-[0.7rem] text-sm font-semibold text-muted-foreground transition-[background-color,color,scale] duration-200",
              active === w && "bg-card text-foreground shadow-sm")}>
            {w === "start" ? "ເລີ່ມ" : "ເລີກ"}<span className="text-base tabular-nums">{(w === "start" ? starts : ends) || "--:--"}</span>
          </button>
        ))}
      </div>

      <div aria-hidden>
        <div className="relative h-2.5 overflow-hidden rounded-full bg-muted">
          {segs.map(([a, b], i) => <div key={i} className="absolute inset-y-0 rounded-full bg-primary" style={{ left: (a / DAY) * 100 + "%", width: ((b - a) / DAY) * 100 + "%" }} />)}
        </div>
        <div className="mt-1 flex justify-between text-[11px] tabular-nums text-muted-foreground">{["00", "06", "12", "18", "24"].map((t) => <span key={t}>{t}</span>)}</div>
      </div>

      <div className="flex min-h-7 flex-wrap items-center justify-between gap-2">
        <span className="text-sm font-semibold">{len !== null ? <><span className="tabular-nums">{starts}–{ends}</span> · {hoursText(len)}</> : "—"}</span>
        {s !== null && e !== null && (s === e ? <Badge variant="danger">ເລີ່ມ ແລະ ເລີກ ຕ້ອງຕ່າງກັນ</Badge> : e < s ? <Badge variant="warning">ຂ້າມທ່ຽງຄືນ</Badge> : <Badge variant="success">ພາຍໃນມື້</Badge>)}
      </div>

      <ToggleGroup type="single" variant="segmented" value={mode} onValueChange={pickMode} className="w-full">
        {presets.map((p) => <ToggleGroupItem key={p} value={String(p)}>{p} ຊມ</ToggleGroupItem>)}
        <ToggleGroupItem value="other">ອື່ນໆ</ToggleGroupItem>
      </ToggleGroup>

      <div ref={grid} role="grid" aria-label={active === "start" ? "ຊົ່ວໂມງເລີ່ມ" : "ຊົ່ວໂມງເລີກ"} onKeyDown={onGridKey} className="grid grid-cols-6 gap-1">
        {HOURS.map((h) => {
          const on = cur !== null && Math.floor(cur / 60) === h
          const mark = other !== null && Math.floor(other / 60) === h
          return (
            <button key={h} type="button" data-h={h} tabIndex={on || (cur === null && h === 0) ? 0 : -1} aria-pressed={on} onClick={() => pickHour(h)}
              className={cn(CELL, on ? PICKED : inSpan(h) ? "bg-primary/10 hover:bg-primary/20" : "hover:bg-muted", mark && !on && "ring-1 ring-inset ring-gold")}>
              {String(h).padStart(2, "0")}
            </button>
          )
        })}
      </div>

      <div className="grid grid-cols-4 gap-1">
        {MINUTES.map((m) => {
          const on = cur !== null && cur % 60 === m
          return <button key={m} type="button" aria-pressed={on} onClick={() => pickMinute(m)} className={cn(CELL, on ? PICKED : "bg-muted/60 hover:bg-muted")}>:{String(m).padStart(2, "0")}</button>
        })}
      </div>
    </div>
  )
}
