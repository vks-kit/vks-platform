import * as React from "react"
import { ArrowUp } from "lucide-react"
import { cn } from "../lib/cn"

export type SortDir = "asc" | "desc"
export type SortState = { key: string; dir: SortDir } | null
/** Click cycle for a header: none -> asc -> desc -> none. */
export const nextSort = (s: SortState, key: string): SortState => (!s || s.key !== key ? { key, dir: "asc" } : s.dir === "asc" ? { key, dir: "desc" } : null)
/** Stable sort helper. Strings compare with Lao/English locale rules, numbers numerically, empty last. */
export function sortRows<T>(rows: T[], s: SortState, get: (r: T, key: string) => unknown): T[] {
  if (!s) return rows
  const col = new Intl.Collator(["lo", "en"], { numeric: true, sensitivity: "base" }), m = s.dir === "asc" ? 1 : -1
  return rows.map((r, i) => [r, i] as const).sort(([a, ia], [b, ib]) => {
    const x = get(a, s.key), y = get(b, s.key)
    if (x == null || x === "") return 1; if (y == null || y === "") return -1
    const c = typeof x === "number" && typeof y === "number" ? x - y : x instanceof Date && y instanceof Date ? +x - +y : col.compare(String(x), String(y))
    return c * m || ia - ib
  }).map(([r]) => r)
}

/** Use for a hand-built static table (you write THead/TBody/TR/TH/TD yourself). For lists of records with sort, search, loading/empty/error states and phone cards use DataTable instead. */
export const Table = ({ className, ...p }: React.ComponentProps<"table">) => (
  <div className="w-full overflow-auto rounded-xl border bg-card"><table className={cn("w-full text-sm", className)} {...p} /></div>
)
/** Use for the navy header row group of a Table. For DataTable, columns are configured instead. */
export const THead = (p: React.ComponentProps<"thead">) => <thead className="bg-bar text-bar-foreground" {...p} />
/** animate=true slides rows in (use when the order changes, e.g. after a sort). */
export const TBody = ({ className, animate, ...p }: React.ComponentProps<"tbody"> & { animate?: boolean }) => <tbody className={cn(animate && "vks-rows", className)} {...p} />
/** Use for one row in a Table (hover highlight built in). For swipe actions on phones use SwipeRow instead. */
export const TR = ({ className, ...p }: React.ComponentProps<"tr">) => <tr className={cn("border-b transition-colors last:border-0 hover:bg-muted/50", className)} {...p} />

/** Header cell. Pass sortKey + sort + onSort to make it a sort button; arrow flips with a spring. */
export function TH({ className, children, sortKey, sort, onSort, align, ...p }: React.ComponentProps<"th"> & { sortKey?: string; sort?: SortState; onSort?: (s: SortState) => void; align?: "left" | "right" | "center" }) {
  const al = align === "right" ? "text-right" : align === "center" ? "text-center" : "text-left"
  if (!sortKey || !onSort) return <th className={cn("px-3 py-2.5 font-semibold", al, className)} {...p}>{children}</th>
  const dir = sort?.key === sortKey ? sort.dir : "none"
  return (
    <th aria-sort={dir === "asc" ? "ascending" : dir === "desc" ? "descending" : "none"} className={cn("p-0 font-semibold", al, className)} {...p}>
      <button type="button" onClick={() => onSort(nextSort(sort ?? null, sortKey))}
        className={cn("vks-sort-btn inline-flex min-h-11 w-full items-center gap-1.5 px-3 py-2.5 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gold", align === "right" && "flex-row-reverse", align === "center" && "justify-center")}>
        <span>{children}</span>
        <ArrowUp data-dir={dir} className={cn("vks-sort size-3.5 shrink-0", dir !== "none" && "text-gold")} />
      </button>
    </th>
  )
}
/** Use for a body cell in a Table (align="right" for numbers). For header cells use TH instead. */
export const TD = ({ className, ...p }: React.ComponentProps<"td">) => <td className={cn("px-3 py-2.5", className)} {...p} />
