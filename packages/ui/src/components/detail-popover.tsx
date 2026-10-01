import * as React from "react"
import { HoverCard as HC, Popover as PO } from "radix-ui"
import { cn } from "../lib/cn"
import { haptics } from "@vks/core"
import { useIsMobile } from "../lib/use-media"
import { Sheet, SheetTrigger, SheetContent, SheetTitle, SheetDescription } from "./overlay"

export type DetailField = { label: React.ReactNode; value: React.ReactNode; icon?: React.ReactNode; /** span both columns */ wide?: boolean }
export type DetailTone = "neutral" | "success" | "warning" | "danger" | "gold"

const toneDot: Record<DetailTone, string> = {
  neutral: "bg-muted-foreground", success: "bg-success", warning: "bg-warning", danger: "bg-destructive", gold: "bg-gold",
}
const toneChip: Record<DetailTone, string> = {
  neutral: "bg-muted text-muted-foreground", success: "bg-success/15 text-success", warning: "bg-warning/15 text-warning",
  danger: "bg-destructive/15 text-destructive", gold: "bg-gold/20 text-foreground",
}

type Props = {
  /** The thing people point at: a name, a row, a map pin. Must be one focusable element (button / a). */
  children: React.ReactElement
  title: React.ReactNode
  subtitle?: React.ReactNode
  /** Avatar, icon or photo shown left of the title. */
  media?: React.ReactNode
  /** Small status chip with a live dot, e.g. { label: "ເຂົ້າກະແລ້ວ", tone: "success" }. */
  status?: { label: React.ReactNode; tone?: DetailTone; live?: boolean }
  fields?: DetailField[]
  /** Free content under the fields (a Progress, a Sparkline, a note). */
  body?: React.ReactNode
  /** Buttons row at the bottom. */
  actions?: React.ReactNode
  /** Desktop trigger: "hover" (HoverCard, opens after 250 ms) or "click" (Popover). Phones always use a bottom sheet. */
  openOn?: "hover" | "click"
  side?: "top" | "right" | "bottom" | "left"
  align?: "start" | "center" | "end"
  className?: string
  open?: boolean
  onOpenChange?: (o: boolean) => void
}

/** Body shared by the card and the sheet. Rows rise in one after another. */
function DetailBody({ title, subtitle, media, status, fields, body, actions, sheet }: Omit<Props, "children" | "openOn" | "side" | "align" | "className" | "open" | "onOpenChange"> & { sheet?: boolean }) {
  const T = sheet ? SheetTitle : "p"
  const D = sheet ? SheetDescription : "p"
  let k = 0
  const st = () => ({ ["--i" as string]: k++ }) as React.CSSProperties
  return (
    <div className="vks-stagger grid gap-3">
      <div style={st()} className="flex items-start gap-3 pr-8">
        {media && <div className="shrink-0 [&_svg]:size-5">{media}</div>}
        <div className="min-w-0 flex-1">
          <T className="truncate text-base font-bold leading-normal">{title}</T>
          {subtitle && <D className="truncate text-sm leading-normal text-muted-foreground">{subtitle}</D>}
        </div>
      </div>
      {status && <div style={st()}><span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold leading-normal", toneChip[status.tone ?? "neutral"])}>
        <span className={cn("size-1.5 rounded-full", toneDot[status.tone ?? "neutral"], status.live && "vks-pulse")} />{status.label}</span></div>}
      {!!fields?.length && <dl className={cn("grid gap-x-4 gap-y-2.5 border-t border-border/70 pt-3", "grid-cols-2")}>
        {fields.map((f, i) => (
          <div key={i} style={st()} className={cn("min-w-0", f.wide && "col-span-2")}>
            <dt className="flex items-center gap-1.5 text-xs leading-normal text-muted-foreground [&_svg]:size-3.5">{f.icon}{f.label}</dt>
            <dd className="truncate text-sm font-semibold leading-normal">{f.value}</dd>
          </div>
        ))}
      </dl>}
      {body && <div style={st()}>{body}</div>}
      {actions && <div style={st()} className="flex flex-wrap gap-2 border-t border-border/70 pt-3 [&>*]:flex-1">{actions}</div>}
    </div>
  )
}

const card = "vks-detail z-50 w-80 max-w-[calc(100vw-1.5rem)] rounded-2xl border border-border bg-popover p-4 text-popover-foreground shadow-[0_18px_48px_-16px_rgb(20_23_61/.4)] outline-none"

/**
 * "Popup detail information". Point at a name / row / pin and a rich card springs out of it on desktop
 * (from the side it opens on); on phones the same content comes up as a bottom sheet, because hover
 * does not exist there. Rows stagger in. Keep it read-only-ish: 3-8 fields, max 2 actions.
 */
export function DetailPopover({ children, openOn = "hover", side = "bottom", align = "center", className, open, onOpenChange, ...content }: Props) {
  const mobile = useIsMobile()
  const change = (o: boolean) => { if (o) haptics.tap(); onOpenChange?.(o) }
  if (mobile) return (
    <Sheet open={open} onOpenChange={change}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="bottom" className={className}><DetailBody {...content} sheet /></SheetContent>
    </Sheet>
  )
  if (openOn === "click") return (
    <PO.Root open={open} onOpenChange={change}>
      <PO.Trigger asChild>{children}</PO.Trigger>
      <PO.Portal><PO.Content side={side} align={align} sideOffset={10} collisionPadding={12} className={cn(card, className)}><DetailBody {...content} /></PO.Content></PO.Portal>
    </PO.Root>
  )
  return (
    <HC.Root openDelay={250} closeDelay={120} open={open} onOpenChange={change}>
      <HC.Trigger asChild>{children}</HC.Trigger>
      <HC.Portal><HC.Content side={side} align={align} sideOffset={10} collisionPadding={12} className={cn(card, className)}><DetailBody {...content} /></HC.Content></HC.Portal>
    </HC.Root>
  )
}
