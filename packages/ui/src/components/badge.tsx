import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../lib/cn"
const badgeVariants = cva("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold", {
  variants: { variant: {
    neutral: "bg-muted text-muted-foreground",
    info: "bg-primary/12 text-primary",
    success: "bg-success/15 text-success",
    warning: "bg-warning/15 text-warning",
    danger: "bg-destructive/15 text-destructive",
    gold: "bg-gold-tint text-foreground ring-1 ring-inset ring-gold/35",
  } },
  defaultVariants: { variant: "neutral" },
})
/** Status pill: neutral / info / success / warning / danger / gold; dot adds a leading status dot, live makes it pulse. Use for a short read-only state next to text; for a selectable filter use Chip instead; for a count on an icon use a Badge inside the icon wrapper. */
export function Badge({ className, variant, dot = false, live = false, children, ...p }: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants> & { dot?: boolean; live?: boolean }) {
  const showDot = dot || live
  return (
    <span className={cn(badgeVariants({ variant }), showDot && "gap-1.5 pl-2", className)} {...p}>
      {showDot && <span aria-hidden className={cn("vks-bdot relative inline-block size-1.5 shrink-0 rounded-full bg-current", variant === "gold" && "bg-gold", live && "vks-bdot-live")} />}
      {children}
    </span>
  )
}
