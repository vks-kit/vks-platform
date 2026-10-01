import * as React from "react"
import { AlertTriangle, CheckCircle2, Info, OctagonAlert } from "lucide-react"
import { cn } from "./cn"

export type Tone = "info" | "success" | "warning" | "danger"
export const toneIcon = { info: Info, success: CheckCircle2, warning: AlertTriangle, danger: OctagonAlert }
/* round badge: soft tinted halo + solid token core with a light top gloss */
export const toneBadge: Record<Tone, string> = {
  info: "bg-primary text-primary-foreground ring-primary/15",
  success: "bg-success text-success-foreground ring-success/15",
  warning: "bg-warning text-warning-foreground ring-warning/15",
  danger: "bg-destructive text-destructive-foreground ring-destructive/15",
}
const sizes = { lg: "size-14 [&_svg]:size-7", sm: "size-10 ring-4 [&_svg]:size-5", xs: "size-8 ring-[3px] [&_svg]:size-4" }
/** Shared round tone badge (IOSAlert, Banner, Alert card, OfflineBanner island). Internal: not part of the public kit. */
export function ToneBadge({ tone, icon, size = "lg", className }: { tone: Tone; icon?: React.ReactNode; size?: keyof typeof sizes; className?: string }) {
  const I = toneIcon[tone]
  return <span aria-hidden className={cn("vks-pop relative flex shrink-0 items-center justify-center rounded-full ring-[6px] bg-[image:linear-gradient(180deg,rgb(255_255_255/.22),transparent_60%)] shadow-[inset_0_1px_0_rgb(255_255_255/.25),0_8px_18px_-8px_rgb(20_23_61/.5)]",
    sizes[size], toneBadge[tone], className)}>{icon ?? <I />}</span>
}
