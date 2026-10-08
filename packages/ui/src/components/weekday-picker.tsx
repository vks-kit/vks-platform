import * as React from "react"
import { cn } from "../lib/cn"
import { WEEKDAYS_LO, WEEKDAY_NAMES_LO, workDaysText } from "../lib/weekdays"

/** Use for picking working days of a shift or schedule as a 7-char Monday-first mask ("1111100"), 44 px day toggles; for one date use DatePicker instead. */
export function WeekdayPicker({ value, onChange, disabled, invalid, summary = true, className, "aria-label": ariaLabel = "ມື້ເຮັດວຽກ" }: {
  value: string; onChange: (mask: string) => void; disabled?: boolean; invalid?: boolean
  /** Show the muted "ຈ–ສ · 5 ມື້" line under the days. */
  summary?: boolean; className?: string; "aria-label"?: string
}) {
  const mask = /^[01]{7}$/.test(value) ? value : "0000000"
  const n = [...mask].filter((c) => c === "1").length
  const flip = (i: number) => onChange(mask.slice(0, i) + (mask[i] === "1" ? "0" : "1") + mask.slice(i + 1))
  return (
    <div className={cn("grid min-w-0 gap-1.5", className)}>
      <div role="group" aria-label={ariaLabel} aria-invalid={invalid || undefined} className="grid grid-cols-7 gap-1">
        {WEEKDAYS_LO.map((d, i) => {
          const on = mask[i] === "1"
          return (
            <button key={i} type="button" disabled={disabled} aria-pressed={on} aria-label={WEEKDAY_NAMES_LO[i]} onClick={() => flip(i)}
              className={cn("vks-press min-h-11 min-w-0 rounded-lg border text-sm font-semibold leading-normal transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
                on ? "border-primary bg-primary text-primary-foreground" : "border-input bg-card text-muted-foreground hover:bg-muted",
                invalid && !on && "border-destructive")}>
              {d}
            </button>
          )
        })}
      </div>
      {summary && <p className="text-xs leading-normal text-muted-foreground">{n ? workDaysText(mask) + " · " + n + " ມື້" : "ຍັງບໍ່ໄດ້ເລືອກມື້"}</p>}
    </div>
  )
}
