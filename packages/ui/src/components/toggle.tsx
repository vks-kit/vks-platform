import * as React from "react"
import { Toggle as TG, ToggleGroup as TGG } from "radix-ui"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../lib/cn"

/**
 * Toggle = a button that stays pressed (Bold, "only mine", flashlight on).
 * For on/off settings use Switch; for one choice out of a few use ToggleGroup variant="segmented".
 */
export const toggleVariants = cva(
  "vks-btn touch-manipulation select-none inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0 data-[state=on]:text-foreground",
  {
    variants: {
      variant: {
        default: "hover:bg-muted data-[state=on]:bg-accent data-[state=on]:shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--gold)_55%,transparent)]",
        outline: "vks-btn-soft border border-input bg-card data-[state=on]:border-gold data-[state=on]:bg-accent",
      },
      size: { default: "h-11 min-w-11 px-3", sm: "h-11 min-w-11 px-2.5 md:h-9 md:min-w-9", lg: "h-12 min-w-12 px-4" },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
)

/** Use for a single button that stays pressed (Bold, "only mine", flashlight). For an on/off setting use Switch instead; for one choice of several use ToggleGroup instead. */
export function Toggle({ className, variant, size, ...p }: React.ComponentProps<typeof TG.Root> & VariantProps<typeof toggleVariants>) {
  return <TG.Root className={cn(toggleVariants({ variant, size }), className)} {...p} />
}

type GroupVariant = "default" | "outline" | "segmented"
const Ctx = React.createContext<{ variant: GroupVariant; size: VariantProps<typeof toggleVariants>["size"] }>({ variant: "default", size: "default" })

/**
 * ToggleGroup. type="single" for one choice, type="multiple" for filters.
 * variant="segmented" = iOS segmented control: a white pill springs under the chosen item.
 */
export function ToggleGroup({ className, variant = "default", size = "default", children, ...p }: React.ComponentProps<typeof TGG.Root> & { variant?: GroupVariant; size?: VariantProps<typeof toggleVariants>["size"] }) {
  const ref = React.useRef<HTMLDivElement>(null)
  const [pill, setPill] = React.useState<{ x: number; w: number } | null>(null)
  const seg = variant === "segmented"
  const measure = React.useCallback(() => {
    const root = ref.current; if (!seg || !root) return
    const on = root.querySelector<HTMLElement>("[data-state=on]")
    setPill(on ? { x: on.offsetLeft, w: on.offsetWidth } : null)
  }, [seg])
  React.useLayoutEffect(() => {
    measure()
    const root = ref.current; if (!seg || !root) return
    const mo = new MutationObserver(measure); mo.observe(root, { subtree: true, attributes: true, attributeFilter: ["data-state"] })
    const ro = new ResizeObserver(measure); ro.observe(root)
    return () => { mo.disconnect(); ro.disconnect() }
  }, [measure, seg])
  return (
    <Ctx.Provider value={{ variant, size }}>
      <TGG.Root ref={ref} className={cn("relative inline-flex items-center", seg ? "gap-0 rounded-[0.9rem] bg-muted p-1 shadow-[inset_0_1px_2px_rgb(20_23_61/.08)]" : "gap-1", className)} {...(p as React.ComponentProps<typeof TGG.Root>)}>
        {seg && pill && <span aria-hidden className="vks-thumb absolute left-0 top-1 bottom-1 rounded-[0.7rem] bg-card shadow-[0_3px_8px_rgb(20_23_61/.12),0_1px_1px_rgb(20_23_61/.08)]" style={{ width: pill.w, transform: `translate3d(${pill.x}px,0,0)` }} />}
        {children}
      </TGG.Root>
    </Ctx.Provider>
  )
}

/** Use for one option inside a ToggleGroup (value required). For a standalone pressed button use Toggle instead. */
export function ToggleGroupItem({ className, ...p }: React.ComponentProps<typeof TGG.Item>) {
  const { variant, size } = React.useContext(Ctx)
  if (variant === "segmented")
    return <TGG.Item className={cn("vks-press relative z-10 inline-flex h-10 min-w-11 flex-1 items-center justify-center gap-1.5 rounded-[0.7rem] px-3 text-sm font-semibold text-muted-foreground transition-colors duration-200 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 data-[state=on]:text-foreground [&_svg]:size-4", className)} {...p} />
  return <TGG.Item className={cn(toggleVariants({ variant, size }), className)} {...p} />
}
