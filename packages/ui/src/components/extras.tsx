import * as React from "react"
import { DropdownMenu as DM, Popover as PO, Separator as SP } from "radix-ui"
import { Check, Copy, Eye, EyeOff, X } from "lucide-react"
import { haptics } from "@vks/core"
import { cn } from "../lib/cn"
import { usePerf, type PerfMode } from "../lib/perf"
import { useIndicator, Indicator } from "../lib/use-indicator"
import { useFlip } from "../lib/use-flip"
import { useSheetMode, SHEET_CLS, SheetScrim, SheetGrabber, SheetCancel } from "../lib/sheet-mode"

/* ---------------- Skeletons: shaped placeholders so the page does not jump when data lands ---------------- */
const sk = "vks-shimmer rounded-md"
/** n lines of text; last line is shorter like a real paragraph. */
export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return <div aria-hidden className={cn("space-y-2", className)}>{Array.from({ length: lines }, (_, i) => <div key={i} className={cn(sk, "h-3.5")} style={{ width: i === lines - 1 ? "60%" : 100 - (i % 3) * 6 + "%" }} />)}</div>
}
/** Use for a round placeholder while a profile photo loads. For a whole list row use SkeletonList instead; for an arbitrary block use Skeleton instead. */
export function SkeletonAvatar({ size = 40, className }: { size?: number; className?: string }) {
  return <div aria-hidden className={cn("vks-shimmer shrink-0 rounded-full", className)} style={{ width: size, height: size }} />
}
/** Avatar + two lines, repeated. Matches UserChip / list rows. */
export function SkeletonList({ rows = 4, className }: { rows?: number; className?: string }) {
  return <div aria-hidden className={cn("divide-y rounded-xl border bg-card", className)}>{Array.from({ length: rows }, (_, i) => (
    <div key={i} className="flex items-center gap-3 p-3"><SkeletonAvatar /><div className="flex-1 space-y-2"><div className={cn(sk, "h-3.5 w-1/2")} /><div className={cn(sk, "h-3 w-1/3")} /></div><div className={cn(sk, "h-6 w-14 rounded-full")} /></div>))}</div>
}
/** Image block + title + text. Matches Card with a photo. */
export function SkeletonCard({ media = true, className }: { media?: boolean; className?: string }) {
  return <div aria-hidden className={cn("overflow-hidden rounded-xl border bg-card", className)}>{media && <div className="vks-shimmer aspect-[16/9]" />}<div className="space-y-3 p-4"><div className={cn(sk, "h-4 w-2/3")} /><SkeletonText lines={2} /></div></div>
}
/** Header row + n body rows. Matches Table / DataTable. */
export function SkeletonTable({ rows = 5, cols = 4, className }: { rows?: number; cols?: number; className?: string }) {
  return <div aria-hidden className={cn("overflow-hidden rounded-xl border bg-card", className)}><div className="flex gap-4 bg-muted p-3">{Array.from({ length: cols }, (_, i) => <div key={i} className={cn(sk, "h-3.5 flex-1")} />)}</div>
    {Array.from({ length: rows }, (_, r) => <div key={r} className="flex gap-4 border-t p-3">{Array.from({ length: cols }, (_, i) => <div key={i} className={cn(sk, "h-3.5 flex-1")} style={{ opacity: 1 - r * 0.12 }} />)}</div>)}</div>
}

/* ---------------- Numbers ---------------- */
/**
 * Counts from the previous value to the new one (KPIs, money). Uses rAF with an ease-out; lite phones / reduced motion jump straight there.
 * format: e.g. (n) => n.toLocaleString("lo") + " ກີບ"
 */
export function NumberTicker({ value, duration = 900, format = (n: number) => Math.round(n).toLocaleString(), className }: { value: number; duration?: number; format?: (n: number) => string; className?: string }) {
  const [n, setN] = React.useState(value), from = React.useRef(value), raf = React.useRef(0)
  React.useEffect(() => {
    const lite = document.documentElement.dataset.perf === "lite" || matchMedia("(prefers-reduced-motion: reduce)").matches
    const a = from.current, b = value
    if (lite || a === b) { setN(b); from.current = b; return }
    const t0 = performance.now()
    const step = (t: number) => { const p = Math.min(1, (t - t0) / duration), e = 1 - Math.pow(1 - p, 4); setN(a + (b - a) * e); if (p < 1) raf.current = requestAnimationFrame(step); else from.current = b }
    raf.current = requestAnimationFrame(step)
    return () => { cancelAnimationFrame(raf.current); from.current = b }
  }, [value, duration])
  return <span className={cn("tabular-nums", className)}>{format(n)}</span>
}

/* ---------------- Inputs ---------------- */
/** Password with show/hide eye. The eye swaps with a quick scale so it doesn't just blink. */
export function PasswordInput({ className, ...p }: Omit<React.ComponentProps<"input">, "type">) {
  const [show, setShow] = React.useState(false)
  return (
    <div className="relative">
      <input type={show ? "text" : "password"} className={cn("vks-field flex h-12 w-full rounded-xl border border-input bg-card pl-3.5 pr-12 text-base placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-ring", className)} {...p} />
      <button type="button" aria-label={show ? "hide" : "show"} onClick={() => setShow((s) => !s)} className="absolute right-0 top-0 flex size-11 items-center justify-center text-muted-foreground hover:text-foreground">
        <span key={String(show)} className="vks-pop">{show ? <EyeOff className="size-5" /> : <Eye className="size-5" />}</span>
      </button>
    </div>
  )
}

/** Input whose label sits inside and floats up on focus / when filled (iOS / Material style). 56 px tall. */
export function FloatingInput({ label, className, id, ...p }: React.ComponentProps<"input"> & { label: string }) {
  const auto = React.useId(), fid = id ?? auto
  return (
    <div className={cn("relative", className)}>
      <input id={fid} placeholder=" " className="vks-field peer h-14 w-full rounded-xl border border-input bg-card px-3.5 pb-1.5 pt-5 text-base focus-visible:outline-none focus-visible:border-ring" {...p} />
      <label htmlFor={fid} className="pointer-events-none absolute left-3.5 top-1/2 origin-left -translate-y-1/2 text-base text-muted-foreground transition-transform duration-200 ease-[var(--ease-ios)] peer-focus:-translate-y-[1.15rem] peer-focus:scale-[.78] peer-[:not(:placeholder-shown)]:-translate-y-[1.15rem] peer-[:not(:placeholder-shown)]:scale-[.78]">{label}</label>
    </div>
  )
}

/* ---------------- Small bits ---------------- */
/** Removable / selectable pill. selected = filled. onRemove shows an x. */
export function Chip({ children, selected, onClick, onRemove, icon, className }: { children: React.ReactNode; selected?: boolean; onClick?: () => void; onRemove?: () => void; icon?: React.ReactNode; className?: string }) {
  // x = play the exit (x spins, pill shrinks + fades) first, then tell the parent. Timeout = fallback when animations are off.
  const [leaving, setLeaving] = React.useState(false), done = React.useRef(false), el = React.useRef<HTMLSpanElement>(null)
  // when a neighbour leaves (or grows a tick), glide to the new spot instead of jumping
  useFlip(el, { disabled: leaving })
  const finish = React.useCallback(() => { if (done.current) return; done.current = true; onRemove?.() }, [onRemove])
  const remove = () => {
    if (leaving) return
    setLeaving(true); window.setTimeout(finish, 320)
  }
  return (
    <span ref={el} data-leaving={leaving || undefined} onAnimationEnd={(e) => { if (leaving && e.animationName === "vks-chip-out") finish() }}
      className={cn("vks-chip vks-pop inline-flex h-9 items-center gap-1.5 rounded-full border text-sm font-semibold transition-colors duration-[400ms] ease-in-out [&_svg]:size-4", selected ? "border-primary bg-primary text-primary-foreground" : "bg-card text-foreground", onRemove ? "pl-3 pr-1" : "px-3", className)}>
      {onClick ? <button type="button" onClick={onClick} className="vks-press -my-2 inline-flex items-center gap-1.5 py-2"><span aria-hidden data-on={selected || undefined} className="vks-chip-check"><span><Check /></span></span>{icon}{children}</button> : <>{icon}{children}</>}
      {onRemove && <button type="button" aria-label="remove" disabled={leaving} onClick={() => { haptics.tap(); remove() }} className="vks-chip-x flex size-7 items-center justify-center rounded-full hover:bg-foreground/10"><X /></button>}
    </span>
  )
}
/** Use for showing a keyboard shortcut (Ctrl, K). For a status label use Badge instead. */
export function Kbd({ children, className }: { children: React.ReactNode; className?: string }) {
  return <kbd className={cn("inline-flex h-6 min-w-6 items-center justify-center rounded-md border border-b-2 bg-muted px-1.5 font-mono text-[11px] font-semibold text-muted-foreground", className)}>{children}</kbd>
}
/** Use for a thin horizontal or vertical divider line. For a divider inside a dropdown menu use MenuSeparator instead. */
export function Separator({ className, orientation = "horizontal", ...p }: React.ComponentProps<typeof SP.Root>) {
  return <SP.Root orientation={orientation} className={cn("shrink-0 bg-border", orientation === "horizontal" ? "h-px w-full" : "h-full w-px", className)} {...p} />
}
/** Copy to clipboard; the icon morphs into a tick for 1.5 s. */
export function CopyButton({ value, label = "Copy", className }: { value: string; label?: string; className?: string }) {
  const [ok, setOk] = React.useState(false)
  return (
    <button type="button" aria-label={label} onClick={async () => { try { await navigator.clipboard.writeText(value); setOk(true); setTimeout(() => setOk(false), 1500) } catch { /* no clipboard */ } }}
      className={cn("vks-press inline-flex size-11 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground [&_svg]:size-4", ok && "text-success", className)}>
      <span key={String(ok)} className="vks-pop">{ok ? <Check /> : <Copy />}</span>
    </button>
  )
}

/* ---------------- Menus / popovers ---------------- */
export const Popover = PO.Root
/** Use for the element that opens a Popover (use asChild with a Button). For a hover preview use HoverCard instead. */
export const PopoverTrigger = PO.Trigger
/** Use for small interactive content anchored to a trigger (a filter form, a quick edit). For a list of actions use Menu/MenuContent instead; for read-only details use DetailPopover instead; for a hint on hover use Tooltip instead. */
export function PopoverContent({ className, sideOffset = 8, children, ...p }: React.ComponentProps<typeof PO.Content>) {
  const sheet = useSheetMode()
  if (sheet) return <PO.Portal><PO.Content sideOffset={0} className={cn(SHEET_CLS, "max-h-[80dvh] overflow-auto p-4", className?.replace(/\bw-\S+/g, ""))} {...p}><SheetScrim /><SheetGrabber />{children}<SheetCancel /></PO.Content></PO.Portal>
  return <PO.Portal><PO.Content sideOffset={sideOffset} className={cn("vks-panel z-50 w-72 rounded-2xl border bg-popover p-4 text-popover-foreground shadow-[0_24px_60px_-20px_rgb(20_23_61/.45)] focus:outline-none", className)} {...p}>{children}</PO.Content></PO.Portal>
}
/** Use for a dropdown list of actions opened from a button (Edit / Share / Delete). Pair with MenuTrigger + MenuContent + MenuItem. For a right-click menu use ContextMenu instead; for a mobile bottom action list use ActionSheet instead; for choosing a form value use Select or Combobox instead. */
export const Menu = DM.Root
/** Use for the button that opens a Menu (use asChild). For opening a Popover use PopoverTrigger instead. */
export const MenuTrigger = DM.Trigger
/** iOS context-menu look: frosted, rounded, springs out of the trigger. On phones (under 640 px) it docks to the bottom as a sheet with a grabber and 44 px rows. */
export function MenuContent({ className, sideOffset = 6, children, ...p }: React.ComponentProps<typeof DM.Content>) {
  const sheet = useSheetMode()
  if (sheet) return <DM.Portal><DM.Content sideOffset={0} className={cn(SHEET_CLS, "max-h-[80dvh] overflow-auto", className)} {...p}><SheetScrim /><SheetGrabber />{children}<SheetCancel /></DM.Content></DM.Portal>
  return <DM.Portal><DM.Content sideOffset={sideOffset} className={cn("vks-panel vks-glass z-50 min-w-52 overflow-hidden rounded-[0.9rem] p-1 shadow-[0_24px_60px_-20px_rgb(20_23_61/.5)]", className)} {...p}>{children}</DM.Content></DM.Portal>
}
/** Use for one action row in MenuContent (destructive for red, icon for a trailing icon). For a form option use SelectItem instead. */
export function MenuItem({ className, destructive, icon, children, ...p }: React.ComponentProps<typeof DM.Item> & { destructive?: boolean; icon?: React.ReactNode }) {
  return <DM.Item className={cn("flex min-h-11 cursor-pointer select-none items-center justify-between gap-3 rounded-[0.6rem] px-3 text-[15px] outline-none transition-colors data-[highlighted]:bg-foreground/10 data-[disabled]:opacity-40 [&_svg]:size-[18px]", destructive && "text-destructive", className)} {...p}><span className="truncate">{children}</span>{icon}</DM.Item>
}
/** Use for a divider between groups of MenuItems. For dividers outside menus use Separator instead. */
export const MenuSeparator = ({ className }: { className?: string }) => <DM.Separator className={cn("my-1 h-px bg-foreground/10", className)} />
/** Use for a small muted heading above a group of MenuItems. For a heading in a settings list use ListGroup's title instead. */
export const MenuLabel = ({ className, ...p }: React.ComponentProps<typeof DM.Label>) => <DM.Label className={cn("px-3 py-1.5 text-xs font-semibold text-muted-foreground", className)} {...p} />
/* ---------------- Performance tier switch ---------------- */
/**
 * Auto / Full / Lite. Lite = cheap-Android mode: no blur, no looping or decorative motion, flat shadows.
 * Needs <PerfProvider> above it. tone="bar" for use on the navy header.
 */
export function PerfToggle({ tone = "default", className }: { tone?: "default" | "bar"; className?: string }) {
  const { mode, tier, setMode } = usePerf()
  const { ref, box, anim } = useIndicator<HTMLDivElement>("[aria-checked=true]", [mode])
  const opts: { v: PerfMode; l: string; t: string }[] = [
    { v: "auto", l: "Auto", t: "Pick from the device (now: " + tier + ")" }, { v: "full", l: "High-end", t: "Every effect: blur, glow, springs" }, { v: "lite", l: "Low-end", t: "Cheap Android: no blur, no looping motion" }]
  return (
    <div ref={ref} role="radiogroup" aria-label="performance" className={cn("relative inline-flex h-9 items-center rounded-full p-0.5 text-xs font-semibold", tone === "bar" ? "bg-white/10 text-bar-foreground" : "bg-muted text-foreground", className)}>
      <Indicator box={box} anim={anim} className={cn("rounded-full shadow-sm", tone === "bar" ? "bg-bar-foreground/20" : "bg-card")} />
      {opts.map((o) => (
        <button key={o.v} role="radio" aria-checked={mode === o.v} title={o.t} onClick={() => setMode(o.v)}
          className={cn("relative z-10 h-8 rounded-full px-2.5 transition-opacity duration-200", mode === o.v ? "opacity-100" : "opacity-60 hover:opacity-100")}>
          {o.l}{o.v === "auto" && mode === "auto" && <span className="ml-1 opacity-70">· {tier === "lite" ? "low" : "high"}</span>}
        </button>
      ))}
    </div>
  )
}