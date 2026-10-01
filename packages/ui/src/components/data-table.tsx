import * as React from "react"
import { cn } from "../lib/cn"
import { useIsMobile } from "../lib/use-media"
import { Skeleton, Empty } from "./feedback"
import { ArrowUp } from "lucide-react"
import { TH, sortRows, nextSort, type SortState } from "./table"

export type Column<T> = { key: string; header: string; cell: (row: T) => React.ReactNode; /** important columns stay in the top of a mobile card, others drop to the footer */ primary?: boolean; className?: string
  /** value used for sorting; give it to make the header clickable */ sortValue?: (row: T) => string | number | Date | null | undefined }

/**
 * Rule from the old kit: a table with more than 4 columns becomes a card list on phones.
 * Primary columns show at the top of the card, the rest as label / value rows.
 * States: loading = skeleton rows, empty = Empty, error = inline retry. Always ship all three.
 */
export function DataTable<T>({ columns, rows, rowKey, onRowClick, loading, error, onRetry, emptyTitle = "ຍັງບໍ່ມີຂໍ້ມູນ", forceCards, mode = "auto", sort: sortProp, onSortChange, defaultSort = null }: {
  columns: Column<T>[]; rows: T[]; rowKey: (r: T) => string; onRowClick?: (r: T) => void; loading?: boolean
  error?: string | null; onRetry?: () => void; emptyTitle?: string; /** @deprecated use mode="cards" */ forceCards?: boolean
  /** auto = cards on a phone when there are more than 4 columns (default) · table = always a table · cards = always cards */ mode?: "auto" | "table" | "cards"
  /** controlled sort (e.g. server-side); omit to let the table sort rows itself */ sort?: SortState; onSortChange?: (s: SortState) => void; defaultSort?: SortState
}) {
  const mobile = useIsMobile()
  const [own, setOwn] = React.useState<SortState>(defaultSort)
  const sort = sortProp !== undefined ? sortProp : own
  const setSort = (s: SortState) => { if (sortProp === undefined) setOwn(s); onSortChange?.(s) }
  const sorted = React.useMemo(() => (onSortChange && sortProp !== undefined ? rows : sortRows(rows, sort, (r, k) => columns.find((c) => c.key === k)?.sortValue?.(r))), [rows, sort, columns, sortProp, onSortChange])
  const sortable = columns.filter((c) => c.sortValue)
  // mode="cards" (or legacy forceCards) always cards; "table" never; "auto" = phone + more than 4 columns
  const cards = mode === "cards" || !!forceCards || (mode === "auto" && mobile && columns.length > 4)
  if (error) return <div role="alert" className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm"><b className="text-destructive">{error}</b>{onRetry && <button onClick={onRetry} className="-my-3 ml-3 inline-flex min-h-11 items-center px-1 font-semibold underline">ລອງໃໝ່</button>}</div>
  if (loading) return <div className="space-y-2">{[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
  if (rows.length === 0) return <Empty title={emptyTitle} />
  if (cards) {
    const prim = columns.filter((c) => c.primary), rest = columns.filter((c) => !c.primary), top = prim.length ? prim : columns.slice(0, 2), bottom = prim.length ? rest : columns.slice(2)
    return (
      <div className="space-y-2">
      {sortable.length > 0 && <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
        {sortable.map((c) => { const on = sort?.key === c.key; return (
          <button key={c.key} type="button" onClick={() => setSort(nextSort(sort, c.key))} className={cn("vks-press inline-flex h-11 shrink-0 items-center gap-1.5 rounded-full border px-4 text-sm font-semibold transition-colors", on ? "border-primary bg-primary text-primary-foreground" : "bg-card text-muted-foreground")}>
            {c.header}{on ? <ArrowUp data-dir={sort!.dir} className="vks-sort size-3.5" /> : null}</button>) })}
      </div>}
      <ul key={sort ? sort.key + sort.dir : "none"} className="space-y-2">
        {sorted.map((r, i) => (
          <li key={rowKey(r)} className="vks-fade-up" style={{ animationDelay: Math.min(i, 7) * 40 + "ms" }}>
            <div role={onRowClick ? "button" : undefined} tabIndex={onRowClick ? 0 : undefined} onClick={() => onRowClick?.(r)} onKeyDown={(e) => e.key === "Enter" && onRowClick?.(r)}
              className={cn("rounded-xl border bg-card p-3", onRowClick && "vks-press cursor-pointer")}>
              <div className="space-y-0.5 font-semibold">{top.map((c) => <div key={c.key}>{c.cell(r)}</div>)}</div>
              {bottom.length > 0 && <dl className="mt-2 grid gap-1 border-t pt-2 text-sm">{bottom.map((c) => <div key={c.key} className="flex justify-between gap-3"><dt className="text-muted-foreground">{c.header}</dt><dd className="text-right">{c.cell(r)}</dd></div>)}</dl>}
            </div>
          </li>
        ))}
      </ul>
      </div>
    )
  }
  return (
    <div className="overflow-x-auto rounded-xl border bg-card">
      <table className="w-full text-sm">
        <thead className="bg-bar text-bar-foreground"><tr>{columns.map((c) => <TH key={c.key} className={c.className} sortKey={c.sortValue ? c.key : undefined} sort={sort} onSort={setSort}>{c.header}</TH>)}</tr></thead>
        <tbody key={sort ? sort.key + sort.dir : "none"} className="vks-rows">{sorted.map((r) => (
          <tr key={rowKey(r)} onClick={() => onRowClick?.(r)} className={cn("border-t odd:bg-muted/30", onRowClick && "cursor-pointer hover:bg-accent")}>{columns.map((c) => <td key={c.key} className={cn("px-3 py-2.5", c.className)}>{c.cell(r)}</td>)}</tr>))}
        </tbody>
      </table>
    </div>
  )
}