import * as React from "react"
import { Slot } from "radix-ui"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"
import { cn } from "../lib/cn"

/*
 * Premium, still cheap: solid variants get a light top gradient, a 1px inner highlight,
 * a tinted lift shadow and a one-pass sheen on hover (desktop only). Press = spring scale.
 * All motion is transform/opacity (see .vks-btn in animations.css).
 */
export const buttonVariants = cva(
  "vks-btn touch-manipulation select-none inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold tracking-[.01em] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "vks-btn-solid bg-primary text-primary-foreground",
        action: "vks-btn-solid bg-success text-success-foreground [--vks-btn-glow:color-mix(in_oklab,var(--success)_55%,transparent)]", // scan / save / done
        gold: "vks-btn-solid bg-gold text-gold-foreground [--vks-btn-glow:color-mix(in_oklab,var(--gold)_60%,transparent)]",
        outline: "vks-btn-soft border border-input bg-card hover:border-[color-mix(in_oklab,var(--gold)_55%,var(--input))] hover:bg-muted/60",
        ghost: "hover:bg-muted",
        destructive: "vks-btn-solid bg-destructive text-destructive-foreground [--vks-btn-glow:color-mix(in_oklab,var(--destructive)_55%,transparent)]",
      },
      // h-11 = 44 px: minimum comfortable touch target for guards on phones
      size: { default: "h-11 px-5", sm: "h-11 px-4 md:h-9 md:px-3 md:rounded-lg", lg: "h-12 px-6 text-base", icon: "size-11" },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
)

export interface ButtonProps extends React.ComponentProps<"button">, VariantProps<typeof buttonVariants> {
  asChild?: boolean
  /** Shows a spinner, keeps the width, blocks clicks. */
  loading?: boolean
}
/** Use for any clickable action (44 px tall, loading spinner built in). variant="action" for scan/save/done, "destructive" for delete. For a button that stays pressed use Toggle instead; for an icon-only row action use size="icon"; for a floating main action on phones use Fab instead. */
export function Button({ className, variant, size, asChild, loading, disabled, children, ...props }: ButtonProps) {
  const Comp = asChild ? Slot.Root : "button"
  if (asChild) return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props}>{children}</Comp>
  return (
    <Comp className={cn(buttonVariants({ variant, size }), className)} disabled={disabled || loading} aria-busy={loading || undefined} {...props}>
      {loading && <Loader2 className="vks-spin" aria-hidden />}
      {children}
    </Comp>
  )
}
