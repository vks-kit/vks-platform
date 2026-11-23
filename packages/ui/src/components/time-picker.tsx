import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode, type RefObject } from "react"
import { Popover as PO } from "radix-ui"
import { Check, Clock } from "lucide-react"
import { cn } from "../lib/cn"
import { useIsMobile } from "../lib/use-media"
import { DAY_MIN, minToTime as toTime, parseTimeText, spanMin as span, timeSteps, timeToMin as toMin } from "../lib/time"
import { InSheetView, Sheet, SheetContent, SheetTitle, useInSheet } from "./overlay"

/* Time fields in the Google Calendar / Outlook style, 24 h only (house rule: a shift is named by its time).
 * The field is a real text box: type "6", "1830" or "18:30" and it becomes HH:MM on Enter / leaving the field.
 * Focus or click opens a short list of times (every step minutes) that opens on the current value, so nobody scrolls.
 * TimeRangePicker: the end list starts after the start time and says how long each choice is ("12 ຊມ · +1 ມື້").
 * Desktop: dropdown under the field. Phone: the same list in a bottom sheet (inside a Dialog: a pushed view). */

/** 720 → "12 ຊົ່ວໂມງ" / "12 ຊມ", 90 → "1 ຊມ 30 ນາທີ", 30 → "30 ນາທີ". */
const hoursText = (min: number, short = false) => {
  const h = Math.floor(min / 60), m = min % 60
  if (!h) return m + " ນາທີ"
  return h + (short || m ? " ຊມ" : " ຊົ່ວໂມງ") + (m ? " " + m + (short ? "" : " ນາທີ") : "")
}
const FIELD = "vks-field flex h-11 w-full min-w-0 items-center gap-2 rounded-lg border border-input bg-card px-3 text-base text-foreground transition-[border-color,box-shadow] duration-200 focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/25 aria-[invalid=true]:border-destructive"
const PANEL = "vks-float z-50 w-[var(--radix-popover-trigger-width)] min-w-48 origin-[var(--radix-popover-content-transform-origin)] rounded-xl border bg-popover p-1 text-popover-foreground shadow-[0_18px_40px_-16px_rgb(20_23_61/.35),0_2px_6px_-2px_rgb(20_23_61/.12)]"

type Opt = { min: number; hint?: string; next?: boolean }
/** Index of the list item at or just after m, following the list's own order (an end list starts after the start and wraps past midnight). */
const nearest = (opts: Opt[], m: number) => {
  if (!opts.length) return 0
  const first = opts[0].min
  const d = (x: number) => (x - first + DAY_MIN) % DAY_MIN
  const i = opts.findIndex((o) => d(o.min) >= d(m))
  return i < 0 ? opts.length - 1 : i
}

/** The list of times: opens scrolled to the chosen one, ↑ ↓ moves the highlight, Enter / tap picks. */
function TimeList({ id, opts, value, active, setActive, onPick, fill }: {
  id: string; opts: Opt[]; value: number | null; active: number; setActive: (i: number) => void; onPick: (m: number) => void; fill?: boolean
}) {
  const ref = useRef<HTMLUListElement>(null)
  useEffect(() => { ref.current?.querySelector<HTMLElement>('[data-i="' + active + '"]')?.scrollIntoView({ block: "nearest" }) }, [active])
  useEffect(() => { // first paint: put the chosen time in the middle (after the popover / sheet has its size)
    const centre = () => {
      const box = ref.current, el = box?.querySelector<HTMLElement>('[data-i="' + active + '"]')
      if (el && box) box.scrollTop = el.offsetTop - box.offsetTop - box.clientHeight / 2 + el.clientHeight / 2
    }
    centre()
    const a = requestAnimationFrame(() => requestAnimationFrame(centre)), b = setTimeout(centre, 120)
    return () => { cancelAnimationFrame(a); clearTimeout(b) }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <ul ref={ref} id={id} role="listbox" aria-label="ເວລາ" className={cn("overflow-y-auto overscroll-contain [scrollbar-width:thin]", fill ? "min-h-0 flex-1" : "max-h-64")}>
      {opts.map((o, i) => {
        const on = value === o.min
        return (
          <li key={o.min} id={id + "-" + i} data-i={i} role="option" aria-selected={on}
            onPointerMove={() => active !== i && setActive(i)} onPointerDown={(e) => e.preventDefault()} onClick={() => onPick(o.min)}
            className={cn("flex min-h-11 cursor-pointer select-none items-center gap-3 rounded-lg px-3 text-base tabular-nums md:min-h-10",
              i === active && "bg-muted", on && "bg-gold-tint font-semibold")}>
            <span className="w-12 shrink-0">{toTime(o.min)}</span>
            {o.hint && <span className="min-w-0 flex-1 truncate text-sm font-normal text-muted-foreground">{o.hint}{o.next && <span className="ml-1.5 rounded-full bg-warning/15 px-1.5 text-xs font-semibold text-warning">+1 ມື້</span>}</span>}
            {on && <Check className="ml-auto size-4 shrink-0 text-gold" aria-hidden />}
          </li>
        )
      })}
    </ul>
  )
}

/** One time field: type or pick. Shared by TimePicker and both ends of TimeRangePicker. */
function TimeField({ value, onCommit, opts, label, id, invalid, placeholder = "--:--", suffix, sheetTitle, openSignal, onOpenChange, inputRef }: {
  value: string; onCommit: (m: number) => void; opts: Opt[]; label: string; id?: string; invalid?: boolean; placeholder?: string
  suffix?: ReactNode; sheetTitle: string
  /** Bump to focus the field and open its list (TimeRangePicker moves on to ເລີກ after a start is picked). */
  openSignal?: number; onOpenChange?: (o: boolean) => void; inputRef?: RefObject<HTMLInputElement | null>
}) {
  const mobile = useIsMobile(), nested = useInSheet()
  const listId = useId()
  const own = useRef<HTMLInputElement>(null), input = inputRef ?? own
  const [open, setOpenRaw] = useState(false)
  const [text, setText] = useState(value)
  const [bad, setBad] = useState(false)
  const cur = toMin(value)
  const at = () => cur === null ? nearest(opts, 9 * 60) : nearest(opts, cur)
  const [active, setActive] = useState(at)
  const setOpen = (o: boolean) => { if (o) setActive(at()); setOpenRaw(o); onOpenChange?.(o) }
  useEffect(() => { setText(value); setBad(false) }, [value])
  useEffect(() => { if (openSignal) { input.current?.focus(); setOpen(true) } }, [openSignal]) // eslint-disable-line react-hooks/exhaustive-deps

  const pick = (m: number) => { onCommit(m); setText(toTime(m)); setBad(false); setOpen(false) }
  const commitText = () => {
    if (text.trim() === "" || text === value) { setText(value); setBad(false); return true }
    const m = parseTimeText(text)
    if (m === null) { setBad(true); return false }
    pick(m); return true
  }
  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault()
      if (!open) { setOpen(true); return }
      setActive(Math.max(0, Math.min(opts.length - 1, active + (e.key === "ArrowDown" ? 1 : -1))))
    } else if (e.key === "Enter") {
      e.preventDefault()
      if (open && text === value && opts[active]) pick(opts[active].min)
      else commitText()
    } else if (e.key === "Escape") { if (open) { e.preventDefault(); setOpen(false) } setText(value); setBad(false) }
    else if (e.key === "Tab") { commitText(); setOpen(false) }
  }
  // typing filters the highlight to the nearest time in the list
  const onType = (t: string) => {
    setText(t); setBad(false)
    if (!open && !mobile) setOpen(true)
    const m = parseTimeText(t)
    if (m !== null) setActive(nearest(opts, m))
  }

  const field = (
    <div className={FIELD} aria-invalid={invalid || bad || undefined} onClick={() => { input.current?.focus(); if (!open) setOpen(true) }}>
      <Clock className="size-4 shrink-0 text-muted-foreground" aria-hidden />
      <input ref={input} id={id} value={text} placeholder={placeholder} inputMode={mobile ? "none" : "numeric"} autoComplete="off" spellCheck={false}
        role="combobox" aria-label={label} aria-expanded={open} aria-controls={listId} aria-autocomplete="list" aria-activedescendant={open ? listId + "-" + active : undefined}
        aria-invalid={invalid || bad || undefined}
        readOnly={mobile} onFocus={(e) => { e.currentTarget.select(); if (!mobile) setOpen(true) }} onKeyDown={onKey}
        onChange={(e) => onType(e.target.value)} onBlur={() => { if (!mobile) { commitText(); setOpen(false) } }}
        className="h-full min-w-0 flex-1 bg-transparent tabular-nums placeholder:text-muted-foreground focus:outline-none" />
      {suffix}
    </div>
  )
  const list = (fill?: boolean) => <TimeList id={listId} opts={opts} value={cur} active={active} setActive={setActive} onPick={pick} fill={fill} />

  if (mobile) return (
    <>
      {field}
      {nested ? <InSheetView open={open} onBack={() => setOpen(false)} title={sheetTitle}><div className="flex min-h-0 flex-1 flex-col py-2">{list(true)}</div></InSheetView>
        : <Sheet open={open} onOpenChange={setOpen}><SheetContent side="bottom"><SheetTitle>{sheetTitle}</SheetTitle><div className="mt-2 flex max-h-[60dvh] flex-col">{list(true)}</div></SheetContent></Sheet>}
    </>
  )
  return (
    <PO.Root open={open} onOpenChange={(o) => !o && setOpen(false)} modal={nested}>
      <PO.Anchor asChild>{field}</PO.Anchor>
      <PO.Portal>
        <PO.Content align="start" sideOffset={6} collisionPadding={12} className={PANEL}
          onOpenAutoFocus={(e) => e.preventDefault()} onCloseAutoFocus={(e) => e.preventDefault()}
          onInteractOutside={(e) => { if (e.target instanceof Node && input.current?.parentElement?.contains(e.target)) e.preventDefault() }}>
          {list()}
        </PO.Content>
      </PO.Portal>
    </PO.Root>
  )
}

/** Use for one clock time (meeting, visit, report time): a field you can type into ("930", "18:30") with a dropdown of times every 30 minutes that opens on the current value; a bottom sheet list on phone. For a shift (start → end) use TimeRangePicker; for a time inside a dense form row use TimeInput. */
export function TimePicker({ value, onChange, step = 30, id, invalid, placeholder, className }: {
  value: string; onChange: (v: string) => void
  /** Minutes between list items. Typing accepts any minute. Default 30. */
  step?: number
  id?: string; invalid?: boolean; placeholder?: string; className?: string
}) {
  const opts = timeSteps(step).map((min) => ({ min }))
  return <div className={cn("min-w-0", className)}><TimeField value={value} onCommit={(m) => onChange(toTime(m))} opts={opts} label="ເວລາ" sheetTitle="ເວລາ" id={id} invalid={invalid} placeholder={placeholder} /></div>
}

/** Use for a shift's start and end time (24 h, may cross midnight): two fields you can type into or pick from a list; the end list starts after the start and shows each length ("12 ຊມ · +1 ມື້"); the end field shows "+1 ມື້" for an overnight shift and length chips (12 / 8 ຊມ) sit under the fields. For one clock time use TimePicker; for a date span use DateRangePicker. */
export function TimeRangePicker({ starts, ends, onChange, presets = [12, 8], step = 30, invalid, labels = true, id, className }: {
  starts: string; ends: string; onChange: (starts: string, ends: string) => void
  /** Length chips in hours. [] hides them. */
  presets?: number[]
  /** Minutes between list items. Default 30. */
  step?: number
  invalid?: boolean; labels?: boolean; id?: string; className?: string
}) {
  const s = toMin(starts), e = toMin(ends), len = span(s, e)
  const same = s !== null && s === e
  const overnight = s !== null && e !== null && e < s
  const endRef = useRef<HTMLInputElement>(null)
  const [openEnd, setOpenEnd] = useState(0)

  const startOpts: Opt[] = timeSteps(step).map((min) => ({ min }))
  const endOpts: Opt[] = s === null ? timeSteps(step).map((min) => ({ min }))
    : timeSteps(step, s + step).filter((m) => m !== s).map((min) => { const l = (min - s + DAY_MIN) % DAY_MIN; return { min, hint: hoursText(l, true), next: min < s } })

  const setStart = (m: number) => {
    const keep = len ?? (presets.length ? presets[0] * 60 : null)
    onChange(toTime(m), keep !== null ? toTime(m + keep) : ends)
    setOpenEnd((n) => n + 1) // like Google Calendar: picking a start moves on to the end
  }
  const setEnd = (m: number) => onChange(starts, toTime(m))
  const field = (w: "start" | "end") => {
    const f = w === "start"
      ? <TimeField value={starts} onCommit={setStart} opts={startOpts} label="ເລີ່ມ" sheetTitle="ເວລາເລີ່ມ" id={id ? id + "-start" : undefined} />
      : <TimeField value={ends} onCommit={setEnd} opts={endOpts} label="ເລີກ" sheetTitle="ເວລາເລີກ" id={id ? id + "-end" : undefined} invalid={same || invalid} inputRef={endRef} openSignal={openEnd}
          suffix={overnight ? <span className="shrink-0 rounded-full bg-warning/15 px-2 text-xs font-semibold leading-relaxed text-warning">+1 ມື້</span> : undefined} />
    return labels
      ? <div className="flex min-w-0 flex-col gap-1.5"><label htmlFor={id ? id + "-" + w : undefined} className="text-sm font-semibold leading-snug">{w === "start" ? "ເລີ່ມ" : "ເລີກ"}</label>{f}</div>
      : <div className="min-w-0">{f}</div>
  }
  return (
    <div className={cn("grid min-w-0 gap-2", className)}>
      <div className="grid grid-cols-2 gap-2">{field("start")}{field("end")}</div>
      {(len !== null || same || presets.length > 0) && (
        <div className="flex min-h-8 flex-wrap items-center justify-between gap-2 text-sm leading-normal">
          <span className={cn("tabular-nums", same ? "text-destructive" : "text-muted-foreground")} aria-live="polite">
            {same ? "ເລີ່ມ ແລະ ເລີກ ຕ້ອງຕ່າງກັນ" : len !== null ? hoursText(len) : ""}
          </span>
          {presets.length > 0 && (
            <div className="flex gap-1.5" role="group" aria-label="ຄວາມຍາວກະ">
              {presets.map((p) => {
                const on = len === p * 60
                return <button key={p} type="button" aria-pressed={on} onClick={() => { const b = s ?? 6 * 60; onChange(toTime(b), toTime(b + p * 60)) }}
                  className={cn("vks-press h-9 rounded-full border px-3 text-sm font-semibold tabular-nums transition-colors max-md:h-11 max-md:px-4", on ? "border-primary bg-primary text-primary-foreground" : "border-input bg-card hover:bg-muted")}>{p} ຊມ</button>
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

