import * as React from "react"
import { Checkbox as CB, Switch as SW, Select as SE, Tabs as TB, RadioGroup as RG, Slider as SL } from "radix-ui"
import { Check, ChevronDown, Minus, Plus } from "lucide-react"
import { cn } from "../lib/cn"
import { haptics } from "@vks-kit/core"
import { useIndicator, Indicator } from "../lib/use-indicator"

/**
 * Press in: box sinks to 86 %, a soft halo appears, border turns green.
 * Release: green fill grows from the centre with a spring, the tick draws in,
 * the box bounces past 100 % and the halo ripples out once. Unchecking is quicker
 * and quiet. Supports checked="indeterminate". Tiny haptic on toggle (Android).
 */
export function Checkbox({ className, haptic = true, onCheckedChange, ...p }: React.ComponentProps<typeof CB.Root> & { haptic?: boolean }) {
  return (
    <CB.Root
      className={cn("vks-cb isolate relative size-6 shrink-0 rounded-[0.45rem] border-[1.5px] border-input bg-card text-success-foreground after:absolute after:-inset-2.5 after:content-[''] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50 data-[state=checked]:border-success data-[state=indeterminate]:border-success", className)}
      onCheckedChange={(v) => { if (haptic) haptics.tap(); onCheckedChange?.(v) }}
      {...p}
    >
      <span aria-hidden className="vks-cb-halo" />
      <span aria-hidden className="vks-cb-fill" />
      {/* always mounted so the stroke can un-draw on uncheck */}
      <svg viewBox="0 0 24 24" aria-hidden className="pointer-events-none absolute inset-0 m-auto size-[18px]" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
        <path className="vks-cb-tick" d="M5.5 12.5l4.2 4.2 8.8-9.4" pathLength={24} />
        <path className="vks-cb-dash" d="M6.5 12h11" pathLength={24} />
      </svg>
    </CB.Root>
  )
}

/**
 * iOS switch, 51x31. Press in: the knob stretches into a pill toward where it
 * will go and the off-track darkens. Release: the knob springs across and
 * shrinks back to a circle, green floods out from the middle of the track and
 * one ring pulses. The pill is 3 transform-only pieces, so no width animation.
 */
export function Switch({ className, haptic = true, onCheckedChange, ...p }: React.ComponentProps<typeof SW.Root> & { haptic?: boolean }) {
  return (
    <SW.Root
      className={cn("vks-switch peer relative inline-flex h-[31px] w-[51px] shrink-0 cursor-pointer items-center rounded-full bg-input after:absolute after:-inset-x-1 after:-inset-y-2 after:content-[''] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50", className)}
      onCheckedChange={(v) => { if (haptic) haptics.tap(); onCheckedChange?.(v) }}
      {...p}
    >
      <span aria-hidden className="vks-sw-ring" />
      <SW.Thumb className="vks-sw-thumb">
        <span className="vks-sw-l" /><span className="vks-sw-m" /><span className="vks-sw-r" />
      </SW.Thumb>
    </SW.Root>
  )
}

/** Radio list. Dot springs in. Rows are 44 px tall so a thumb can hit them. */
export function RadioGroup({ className, ...p }: React.ComponentProps<typeof RG.Root>) {
  return <RG.Root className={cn("grid gap-1", className)} {...p} />
}
/** Use for one option inside a RadioGroup (label text as children, 44 px row). For independent yes/no options use Checkbox instead. */
export function RadioGroupItem({ className, children, ...p }: React.ComponentProps<typeof RG.Item>) {
  return (
    <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg px-1 text-sm has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50">
      <RG.Item className={cn("vks-cb flex size-6 shrink-0 items-center justify-center rounded-full border-[1.5px] border-input bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring data-[state=checked]:border-success", className)} {...p}>
        <span className="vks-radio-dot size-3 rounded-full bg-success" />
      </RG.Item>
      {children}
    </label>
  )
}

const sliderTone = {
  success: { range: "bg-success", bubble: "bg-success text-success-foreground", tick: "bg-success-foreground/70", v: "var(--success)" },
  gold: { range: "bg-gold", bubble: "bg-gold text-gold-foreground", tick: "bg-gold-foreground/60", v: "var(--gold)" },
  primary: { range: "bg-primary", bubble: "bg-primary text-primary-foreground", tick: "bg-primary-foreground/70", v: "var(--primary)" },
} as const

/**
 * Range slider. Big 28 px thumb (iOS) that grows with a soft halo while dragged; the track thickens,
 * a value bubble springs up over the thumb and a light haptic tick fires on every step.
 * Optional tick marks light up as the fill passes them.
 */
export function Slider({ className, format = (x: number) => String(x), showValue = "drag", ticks, tone = "success", haptic = true, onValueChange, ...p }: React.ComponentProps<typeof SL.Root> & {
  /** Text inside the bubble, e.g. v => fmtKip(v). */
  format?: (v: number) => React.ReactNode
  /** "drag" = bubble only while held or focused, "always" = pinned, false = never. */
  showValue?: "drag" | "always" | false
  /** true = a mark at every step, or a number = that many evenly spaced marks. Keep to <= 11. */
  ticks?: boolean | number
  tone?: keyof typeof sliderTone
  /** Vibrate on each step change (Android). */
  haptic?: boolean
}) {
  const min = p.min ?? 0, max = p.max ?? 100, step = p.step ?? 1
  const [inner, setInner] = React.useState<number[]>(p.defaultValue ?? [min])
  const value = p.value ?? inner
  const [drag, setDrag] = React.useState(false)
  const last = React.useRef(0)
  React.useEffect(() => {
    if (!drag) return
    const up = () => setDrag(false)
    window.addEventListener("pointerup", up); window.addEventListener("pointercancel", up)
    return () => { window.removeEventListener("pointerup", up); window.removeEventListener("pointercancel", up) }
  }, [drag])
  const t = sliderTone[tone]
  const marks = ticks === true ? Math.min(Math.round((max - min) / step) + 1, 21) : typeof ticks === "number" ? ticks : 0
  const lo = value.length > 1 ? Math.min(...value) : min, hi = Math.max(...value)
  return (
    <SL.Root data-drag={drag} style={{ ["--slider-tone" as string]: t.v } as React.CSSProperties}
      className={cn("vks-slider relative flex h-11 w-full touch-none select-none items-center data-[disabled]:opacity-50", showValue === "always" && "mt-9", className)}
      onPointerDown={() => setDrag(true)}
      onValueChange={(v) => {
        if (p.value === undefined) setInner(v)
        const now = performance.now()
        if (haptic && now - last.current > 35) { last.current = now; haptics.tap() }
        onValueChange?.(v)
      }} {...p}>
      <SL.Track className="vks-slider-track relative h-1.5 grow overflow-hidden rounded-full bg-muted"><SL.Range className={cn("absolute h-full rounded-full", t.range)} /></SL.Track>
      {marks > 1 && <div aria-hidden className="pointer-events-none absolute inset-x-3.5 top-1/2">{Array.from({ length: marks }, (_, i) => {
        const at = (i / (marks - 1)) * 100, x = min + (at / 100) * (max - min), hit = x >= lo && x <= hi
        return <span key={i} data-hit={value.some((y) => Math.abs(y - x) < step / 2)} style={{ left: at + "%" }} className={cn("vks-slider-tick absolute size-1 -translate-x-1/2 -translate-y-1/2 rounded-full", hit ? t.tick : "bg-foreground/25")} />
      })}</div>}
      {value.map((x, i) => <SL.Thumb key={i} aria-label={p["aria-label"] ?? "value"} aria-valuetext={typeof format(x) === "string" ? (format(x) as string) : undefined}
        className="vks-slider-thumb z-10 block size-7 cursor-grab rounded-full border border-black/5 bg-white shadow-[0_3px_8px_rgb(0_0_0/.18),0_1px_1px_rgb(0_0_0/.12)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/30 active:cursor-grabbing">
        {showValue && <span data-always={showValue === "always"} className={cn("vks-slider-bubble whitespace-nowrap rounded-lg px-2 py-1 text-xs font-bold tabular-nums shadow-md", t.bubble)}>{format(x)}</span>}
      </SL.Thumb>)}
    </SL.Root>
  )
}

/** Number stepper (qty, guards per shift). The digit rolls up or down. */
export function Stepper({ value, onChange, min = 0, max = 999, step = 1, className, label }: { value: number; onChange: (v: number) => void; min?: number; max?: number; step?: number; className?: string; label?: string }) {
  const prev = React.useRef(value), dir = value >= prev.current ? "up" : "down"
  React.useEffect(() => { prev.current = value }, [value])
  const b = "vks-press flex size-11 items-center justify-center rounded-[0.7rem] text-foreground hover:bg-card disabled:opacity-30 [&_svg]:size-4"
  return (
    <div role="group" aria-label={label} className={cn("inline-flex items-center gap-0.5 rounded-[0.9rem] bg-muted p-0.5", className)}>
      <button type="button" aria-label="-" className={b} disabled={value - step < min} onClick={() => onChange(Math.max(min, value - step))}><Minus /></button>
      <span aria-live="polite" className="min-w-10 overflow-hidden text-center font-bold tabular-nums"><span key={value} className={cn("inline-block", dir === "up" ? "vks-tick-up" : "vks-tick-down")}>{value}</span></span>
      <button type="button" aria-label="+" className={b} disabled={value + step > max} onClick={() => onChange(Math.min(max, value + step))}><Plus /></button>
    </div>
  )
}

/** Use for picking one value from a short fixed list (under ~10 options). Pair with SelectTrigger + SelectValue + SelectContent + SelectItem. For long or searchable lists use Combobox instead; for 2-4 options shown at once use ToggleGroup variant="segmented" or RadioGroup instead. */
export const Select = SE.Root
/** Use inside SelectTrigger to show the chosen value or a placeholder. For free text entry use Input instead. */
export const SelectValue = SE.Value
/** Use for the closed field of a Select (44 px, chevron). For a searchable field use Combobox instead. */
export function SelectTrigger({ className, children, ...p }: React.ComponentProps<typeof SE.Trigger>) {
  return (
    <SE.Trigger className={cn("vks-field flex h-11 w-full items-center justify-between gap-2 rounded-lg border border-input bg-card px-3 text-base focus-visible:outline-none focus-visible:border-ring data-[placeholder]:text-muted-foreground [&[data-state=open]>span:last-child]:rotate-180", className)} {...p}>
      {children}
      <SE.Icon className="transition-transform duration-300"><ChevronDown className="size-4 text-muted-foreground" /></SE.Icon>
    </SE.Trigger>
  )
}
/** Use for the dropdown panel that holds SelectItems. For a menu of actions use MenuContent instead. */
export function SelectContent({ className, children, ...p }: React.ComponentProps<typeof SE.Content>) {
  return (
    <SE.Portal>
      <SE.Content position="popper" sideOffset={6} className={cn("z-50 max-h-72 min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-xl border bg-popover text-popover-foreground shadow-[0_16px_40px_-16px_rgb(20_23_61/.4)] vks-panel", className)} {...p}>
        <SE.Viewport className="p-1">{children}</SE.Viewport>
      </SE.Content>
    </SE.Portal>
  )
}
/** Use for one option inside SelectContent (tick shows when chosen). For an action row use MenuItem instead. */
export function SelectItem({ className, children, ...p }: React.ComponentProps<typeof SE.Item>) {
  return (
    <SE.Item className={cn("relative flex min-h-11 cursor-pointer select-none items-center rounded-lg py-2 pl-8 pr-3 text-base outline-none transition-colors data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground", className)} {...p}>
      <span className="absolute left-2 flex size-4 items-center justify-center"><SE.ItemIndicator className="vks-pop"><Check className="size-4" /></SE.ItemIndicator></span>
      <SE.ItemText>{children}</SE.ItemText>
    </SE.Item>
  )
}

/* ---- Tabs: a white pill springs under the active tab; the panel fades up ---- */
const TabsVariant = React.createContext<"pill" | "underline">("pill")
/** Use for switching between peer views on the same page (Radix Tabs root). Pair with TabsList + TabsTrigger + TabsContent. For a choice that sets a form value use ToggleGroup variant="segmented" instead; for app-level navigation use Sidebar/BottomNav instead; for sequential steps use Wizard instead. */
export const Tabs = TB.Root
/** Use for the row of tab buttons; variant="pill" (default, sliding white pill) or "underline" (gold bar). For a breadcrumb trail use Breadcrumb instead. */
export function TabsList({ className, variant = "pill", children, ...p }: React.ComponentProps<typeof TB.List> & { variant?: "pill" | "underline" }) {
  const { ref, box, anim } = useIndicator<HTMLDivElement>("[data-state=active]")
  const pill = variant === "pill"
  return (
    <TabsVariant.Provider value={variant}>
      <TB.List ref={ref} className={cn("relative", pill ? "inline-flex h-[3.25rem] items-center rounded-[0.9rem] bg-muted p-1 shadow-[inset_0_1px_2px_rgb(20_23_61/.08)]" : "flex items-center gap-1 overflow-x-auto border-b [scrollbar-width:none]", className)} {...p}>
        {pill
          ? <Indicator box={box} anim={anim} className="rounded-[0.7rem] bg-card shadow-[0_3px_8px_rgb(20_23_61/.12),0_1px_1px_rgb(20_23_61/.08)]" />
          : box && <span aria-hidden data-anim={anim} className="vks-ind top-auto! bottom-0 h-[3px] rounded-full bg-gold" style={{ width: box.w - 16, top: "auto", transform: `translate3d(${box.x + 8}px,0,0)` }} />}
        {children}
      </TB.List>
    </TabsVariant.Provider>
  )
}
/** Use for one tab button inside TabsList (value must match a TabsContent). For a standalone toggle use Toggle instead. */
export function TabsTrigger({ className, ...p }: React.ComponentProps<typeof TB.Trigger>) {
  const v = React.useContext(TabsVariant)
  return <TB.Trigger className={cn("vks-press relative z-10 inline-flex h-11 items-center justify-center gap-1.5 whitespace-nowrap px-4 text-sm font-semibold text-muted-foreground transition-colors duration-200 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring data-[state=active]:text-foreground [&_svg]:size-4", v === "pill" ? "flex-1 rounded-[0.7rem]" : "rounded-md", className)} {...p} />
}
/** Use for the panel shown when its TabsTrigger is active (fades up). For collapsible content use AccordionContent instead. */
export function TabsContent({ className, ...p }: React.ComponentProps<typeof TB.Content>) {
  return <TB.Content className={cn("vks-tab-panel mt-3 focus-visible:outline-none", className)} {...p} />
}
