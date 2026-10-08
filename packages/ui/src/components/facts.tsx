import * as React from "react"
import { cn } from "../lib/cn"

const empty = (v: React.ReactNode) => v === null || v === undefined || v === ""

/** Use for the read-only "view" half of view-first: a label/value list, "—" for empty values; for a record popup with a 2-column layout use FactGrid instead. */
export function Facts({ rows, cols = "8rem", className }: { rows: [string, React.ReactNode][]; cols?: "6rem" | "8rem"; className?: string }) {
  return (
    <dl className={cn("grid gap-x-3 gap-y-2 text-sm leading-relaxed", cols === "6rem" ? "grid-cols-[6rem_minmax(0,1fr)]" : "grid-cols-[8rem_minmax(0,1fr)]", className)}>
      {rows.map(([k, v]) => <div key={k} className="contents"><dt className="text-muted-foreground">{k}</dt><dd className="min-w-0 break-words">{empty(v) ? "—" : v}</dd></div>)}
    </dl>
  )
}

/** Use for read-only facts in a record popup or card: label-over-value cells in 2 columns (third tuple item = full width), "—" for empty; for a narrow side list use Facts instead. */
export function FactGrid({ rows, className }: { rows: [string, React.ReactNode, boolean?][]; className?: string }) {
  return (
    <dl className={cn("grid grid-cols-1 gap-x-6 gap-y-3 rounded-xl border border-border p-3 text-sm leading-relaxed sm:grid-cols-2 md:p-4", className)}>
      {rows.map(([k, v, wide]) => (
        <div key={k} className={cn("min-w-0", wide && "sm:col-span-2")}>
          <dt className="text-xs text-muted-foreground">{k}</dt>
          <dd className="break-words font-medium">{empty(v) ? <span className="font-normal text-muted-foreground">—</span> : v}</dd>
        </div>
      ))}
    </dl>
  )
}
