import * as React from "react"
import { Slot } from "radix-ui"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"
import { cn } from "../lib/cn"
import { Tooltip, TooltipContent, TooltipTrigger } from "./overlay"

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
        gold: "vks-btn-solid vks-btn-gold text-gold-foreground", // metallic plate: tokens --gold-metal-* / --gold-edge
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
  /**
   * Why the button cannot be used yet ("ເລືອກ ຮັບສາຍ ຫຼື ບໍ່ຮັບສາຍ"). The button then looks disabled but stays tappable:
   * a tap calls onBlockedPress (scroll to / open the missing part) instead of onClick, so it never "does nothing".
   */
  disabledReason?: string | null
  onBlockedPress?: (reason: string) => void
}
/** Use for any clickable action (44 px tall, loading spinner built in). variant="action" for scan/save/done, "destructive" for delete. For a button that stays pressed use Toggle instead; for an icon-only row action use size="icon"; for a floating main action on phones use Fab instead. */
export function Button({ className, variant, size, asChild, loading, disabled, disabledReason, onBlockedPress, children, onClick, ...props }: ButtonProps) {
  const Comp = asChild ? Slot.Root : "button"
  if (asChild) return <Comp className={cn(buttonVariants({ variant, size }), className)} onClick={onClick} {...props}>{children}</Comp>
  const blocked = !!disabledReason && !disabled && !loading
  return (
    <Comp className={cn(buttonVariants({ variant, size }), blocked && "opacity-55", className)} disabled={disabled || loading} aria-busy={loading || undefined}
      aria-disabled={blocked || undefined} title={blocked ? disabledReason! : props.title}
      onClick={(e: React.MouseEvent<HTMLButtonElement>) => { if (blocked) { e.preventDefault(); onBlockedPress?.(disabledReason!); return } onClick?.(e) }} {...props}>
      {loading && <Loader2 className="vks-spin" aria-hidden />}
      {children}
    </Comp>
  )
}

/**
 * Use for a button that shows only an icon (copy, share, WhatsApp, close-like actions); the label becomes the tooltip on
 * desktop and the accessible name everywhere, so it can never be forgotten. 44 px square. For a button with text use Button.
 */
export function IconButton({ label, icon, tooltip = true, variant = "outline", className, ...props }: Omit<ButtonProps, "size" | "children"> & {
  /** What the button does, in words ("ສຳເນົາຮູບ"). Shown as the tooltip and read by screen readers. */
  label: string; icon: React.ReactNode
  /** Show the label as a tooltip on hover / focus. Default true. */
  tooltip?: boolean
}) {
  const btn = <Button size="icon" variant={variant} aria-label={label} className={cn("shrink-0", className)} {...props}>{icon}</Button>
  if (!tooltip) return btn
  return <Tooltip><TooltipTrigger asChild>{btn}</TooltipTrigger><TooltipContent>{label}</TooltipContent></Tooltip>
}
