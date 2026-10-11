import * as React from "react"
import { Popover } from "radix-ui"
import { Check, ChevronDown, Search, X } from "lucide-react"
import { cn } from "../lib/cn"
import { normalizeLao } from "@vks-kit/types"
import { useIsMobile } from "../lib/use-media"
import { Sheet, SheetContent, SheetTitle, InSheetView, useInSheet } from "./overlay"
import { Empty } from "./feedback"

export type Option = { value: string; label: string; hint?: string }
export const filterOptions = (opts: Option[], q: string) => {
  const n = normalizeLao(q).toLowerCase().trim()
  return n ? opts.filter((o) => normalizeLao(o.label + " " + (o.hint ?? "")).toLowerCase().includes(n)) : opts
}

function List({ options, selected, onPick, multi, searchable, fill }: { options: Option[]; selected: string[]; onPick: (v: string) => void; multi: boolean; searchable: boolean; fill?: boolean }) {
  const [q, setQ] = React.useState(""), shown = filterOptions(options, q)
  return (
    <div className={cn("flex flex-col", fill ? "min-h-0 flex-1" : "max-h-[60dvh] min-h-0")}>
      {searchable && <div className="relative mb-2"><Search className="absolute left-3 top-3.5 size-4 text-muted-foreground" />
        <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="ຄົ້ນຫາ..." className="h-11 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" /></div>}
      <ul role="listbox" aria-multiselectable={multi} className="vks-rows-in overflow-y-auto overscroll-contain">
        {shown.length === 0 && <li><Empty size="sm" icon={<Search />} title="ບໍ່ພົບຂໍ້ມູນ" hint={q ? "ລອງຄຳຄົ້ນອື່ນ" : undefined} /></li>}
        {shown.map((o, i) => {
          const on = selected.includes(o.value)
          return <li key={o.value} role="option" aria-selected={on} style={{ "--i": i } as React.CSSProperties}>
            <button type="button" onClick={() => onPick(o.value)} className="flex min-h-11 w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm hover:bg-muted focus-visible:bg-muted focus-visible:outline-none">
              <span className={cn("flex size-5 shrink-0 items-center justify-center rounded border", on ? "border-primary bg-primary text-primary-foreground" : "border-input", !multi && "rounded-full")}>{on && <Check className="size-3.5" />}</span>
              <span className="flex-1">{o.label}{o.hint && <span className="ml-2 text-xs text-muted-foreground">{o.hint}</span>}</span></button></li>
        })}
      </ul>
    </div>
  )
}

/** Use for picking from a long list (8+ options, searchable). Popover on desktop; bottom sheet on phone; inside a Dialog/Sheet on phone it pushes a view in the same sheet (never a sheet on a sheet). For up to ~7 options use RadioGroup or FilterChips instead. Replaces the old jt-select. */
export function Combobox({ options, value, onChange, multiple = false, placeholder = "ເລືອກ...", searchable = true, className }: {
  options: Option[]; value: string[]; onChange: (v: string[]) => void; multiple?: boolean; placeholder?: string; searchable?: boolean; className?: string
}) {
  const mobile = useIsMobile(), nested = useInSheet(), [open, setOpen] = React.useState(false)
  const pick = (v: string) => { if (multiple) onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v]); else { onChange([v]); setOpen(false) } }
  const labels = value.map((v) => options.find((o) => o.value === v)?.label ?? v)
  const trigger = (
    <button type="button" data-open={open || undefined} onClick={mobile ? () => setOpen(true) : undefined} className={cn("flex min-h-11 w-full items-center justify-between gap-2 rounded-lg border border-input bg-card px-3 py-2 text-left text-sm transition-[border-color,box-shadow] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring data-[open]:border-primary data-[open]:ring-2 data-[open]:ring-ring/30", className)}>
      <span className={cn("flex flex-wrap gap-1", !labels.length && "text-muted-foreground")}>
        {labels.length === 0 ? placeholder : multiple ? labels.map((l, i) => <span key={i} className="inline-flex items-center gap-1 rounded-md bg-accent px-2 py-0.5 text-xs font-semibold">{l}</span>) : labels[0]}</span>
      <ChevronDown className={cn("size-4 shrink-0 text-muted-foreground transition-transform duration-300 ease-[var(--ease-spring)]", open && "rotate-180")} /></button>
  )
  const list = <List options={options} selected={value} onPick={pick} multi={multiple} searchable={searchable} />
  if (mobile && nested) return <>{trigger}<InSheetView open={open} onBack={() => setOpen(false)} title={placeholder}>
    <List fill options={options} selected={value} onPick={pick} multi={multiple} searchable={searchable} />
    {multiple && <button type="button" onClick={() => setOpen(false)} className="vks-press mt-3 h-12 w-full shrink-0 rounded-xl bg-primary text-base font-semibold text-primary-foreground">ຕົກລົງ{value.length ? " (" + value.length + ")" : ""}</button>}
  </InSheetView></>
  if (mobile) return <>{trigger}<Sheet open={open} onOpenChange={setOpen}><SheetContent side="bottom"><SheetTitle>{placeholder}</SheetTitle><div className="mt-3">{list}</div></SheetContent></Sheet></>
  return (
    <Popover.Root open={open} onOpenChange={setOpen} modal={nested}>
      <Popover.Trigger asChild>{trigger}</Popover.Trigger>
      <Popover.Portal><Popover.Content sideOffset={6} align="start" collisionPadding={12} className="vks-float z-50 flex max-h-[var(--radix-popover-content-available-height)] flex-col w-[var(--radix-popover-trigger-width)] min-w-56 origin-[var(--radix-popover-content-transform-origin)] rounded-xl border bg-card p-2 shadow-[0_18px_40px_-16px_rgb(20_23_61/.35),0_2px_6px_-2px_rgb(20_23_61/.12)]">{list}</Popover.Content></Popover.Portal>
    </Popover.Root>
  )
}

/** Toggle chips. Single or multi. Use for up to ~8 filters; more than 3 filters on phone should go in a filter sheet. */
export function FilterChips({ options, value, onChange, multiple = false, className }: { options: Option[]; value: string[]; onChange: (v: string[]) => void; multiple?: boolean; className?: string }) {
  return (
    <div className={cn("flex gap-2 overflow-x-auto pb-1 md:flex-wrap md:overflow-visible [scrollbar-width:none]", className)} role="group">
      {options.map((o) => {
        const on = value.includes(o.value)
        return <button key={o.value} type="button" aria-pressed={on} onClick={() => onChange(multiple ? (on ? value.filter((x) => x !== o.value) : [...value, o.value]) : on ? [] : [o.value])}
          className={cn("vks-press h-11 shrink-0 rounded-full md:h-9 border px-4 text-sm font-semibold transition-colors", on ? "border-primary bg-primary text-primary-foreground" : "border-input bg-card hover:bg-muted")}>{o.label}</button>
      })}
    </div>
  )
}

/** Use for a plain inline search field that filters a list on the page. For picking one value from a long list use Combobox instead; for an iOS search bar with Cancel use SearchBar instead; for app-wide jump-to use CommandPalette instead. */
export function SearchBox({ value, onChange, placeholder = "ຄົ້ນຫາ...", className }: { value: string; onChange: (v: string) => void; placeholder?: string; className?: string }) {
  return (
    <div className={cn("relative", className)}>
      <Search className="absolute left-3 top-3.5 size-4 text-muted-foreground" />
      <input type="search" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="h-11 w-full rounded-lg border border-input bg-card pl-9 pr-10 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-search-cancel-button]:hidden" />
      {value && <button type="button" aria-label="clear" onClick={() => onChange("")} className="absolute right-0 top-0 flex size-11 items-center justify-center rounded-md text-muted-foreground hover:bg-muted"><X className="size-4" /></button>}
    </div>
  )
}
