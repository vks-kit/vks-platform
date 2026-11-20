import * as React from "react"
import { cn } from "../lib/cn"
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./overlay"
import { Label } from "./input"
import { ChevronDown, MoreHorizontal } from "lucide-react"
import { Button } from "./button"
import { ActionSheet, type SheetAction } from "./ios"
import { useIsMobile } from "../lib/use-media"

/* Width AND left are set together at md+: the kit DialogContent is positioned by left, so a wider form must move its
   left edge too (never centre .vks-modal with translate: the open/close animation owns transform). 0.6: every size is
   centred top to bottom (inset-y-0 + my-auto + h-fit) instead of sitting at a fixed top. A custom width uses --fd-w. */
const FORM_SIZE = {
  sm: "md:max-w-xl md:left-[calc(50%-min(18rem,50%-1rem))] md:max-h-[76dvh]",
  md: "md:max-w-3xl md:left-[calc(50%-min(24rem,50%-1rem))] md:max-h-[84dvh]",
  lg: "md:max-w-5xl md:left-[calc(50%-min(32rem,50%-1rem))] md:max-h-[90dvh]",
  custom: "md:max-w-[var(--fd-w)] md:left-[calc(50%-min(var(--fd-w)/2,50%-1rem))] md:max-h-[90dvh]",
} as const
const CENTRE_Y = "md:inset-y-0 md:my-auto md:h-fit"
export type FormDialogSize = Exclude<keyof typeof FORM_SIZE, "custom">

/** Use for any form inside a Dialog: sticky header + footer, only the body scrolls (never sideways), sm/md/lg widths on desktop, sheet on phone; for a yes/no question use ConfirmDialog instead. */
export function FormDialogContent({ title, description, footer, children, size = "md", width, className, bodyClassName, icon }: {
  title: React.ReactNode; description?: React.ReactNode; footer?: React.ReactNode; children: React.ReactNode
  /** Optional icon tile left of the title (desktop only; hidden on phone to save height). */
  icon?: React.ReactNode
  /** sm 1–3 fields, md default, lg long forms (use a 2-column grid in the body). */
  size?: FormDialogSize; className?: string; bodyClassName?: string
  /**
   * 0.6: any desktop width as a CSS length ("46rem", "min(38rem, 60vh)"); position follows, so no left formula in the app.
   * Wins over size. A phone always gets the full-width sheet.
   */
  width?: string
}) {
  return (
    <DialogContent style={width ? ({ ["--fd-w" as string]: width } as React.CSSProperties) : undefined}
      className={cn("flex flex-col gap-0 overflow-hidden p-0 md:p-0 [&>.vks-grabber]:mt-2 [&>.vks-grabber]:shrink-0", FORM_SIZE[width ? "custom" : size], CENTRE_Y, className)}>
      <DialogHeader className={cn("shrink-0 border-b px-5 pt-4 pb-3 pr-14 md:px-6 md:pt-5 md:pb-4", icon && "flex-row items-center gap-3")}>
        {icon && <span className="hidden size-10 shrink-0 place-items-center rounded-xl bg-muted text-foreground md:grid [&>svg]:size-5">{icon}</span>}
        {icon ? (
          <div className="min-w-0">
            <DialogTitle className="leading-normal">{title}</DialogTitle>
            {description && <DialogDescription className="leading-relaxed">{description}</DialogDescription>}
          </div>
        ) : (
          <>
            <DialogTitle className="leading-normal">{title}</DialogTitle>
            {description && <DialogDescription className="leading-relaxed">{description}</DialogDescription>}
          </>
        )}
      </DialogHeader>
      <div className={cn("min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain px-5 py-4 leading-normal md:px-6 md:py-5", bodyClassName)}>{children}</div>
      {footer && <div className="flex shrink-0 flex-wrap items-center justify-end gap-2 border-t bg-popover px-5 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:px-6 md:py-4">{footer}</div>}
    </DialogContent>
  )
}

/** Use for one labelled control in a form (label, the control, then an error or a muted hint); for a read-only value use Facts instead. */
export function Field({ label, htmlFor, error, hint, className, children }: {
  label: React.ReactNode; htmlFor?: string; error?: React.ReactNode; hint?: React.ReactNode; className?: string; children: React.ReactNode
}) {
  return (
    <div className={cn("grid min-w-0 content-start gap-1.5", className)}>
      <Label htmlFor={htmlFor} className="leading-normal">{label}</Label>
      {children}
      {error ? <p className="text-sm leading-normal text-destructive">{error}</p> : hint ? <p className="text-xs leading-normal text-muted-foreground">{hint}</p> : null}
    </div>
  )
}

/**
 * Use for the buttons of a FormDialogContent footer: one main action, up to two secondary ones, and any rarer ones
 * (edit, delete, block). Desktop: everything in one row. Phone: the main action full width + a "⋯" button that opens
 * an ActionSheet with the rest, so a footer never wraps into two rows of five buttons. For a yes/no use ConfirmDialog.
 */
export function FormActions({ primary, secondary = [], more = [], info, moreLabel = "ເພີ່ມເຕີມ", lead, phone = "sheet", phoneSecondary }: {
  /** The one thing this popup is for (Save, Call, Came). */
  primary: React.ReactNode
  /** Shown beside the primary on desktop (Cancel, No-show); on a phone they also move into the ⋯ sheet when there are more than one. */
  secondary?: React.ReactNode[]
  /** Rare actions: desktop shows them as ghost buttons on the left, a phone lists them in the ⋯ sheet. */
  more?: (SheetAction & { button?: React.ReactNode })[]
  /** One muted line at the left on desktop ("Added by … · date"); the ⋯ sheet shows it on a phone. */
  info?: React.ReactNode; moreLabel?: string
  /**
   * 0.6: the "read" action at the far left on desktop (ຂໍ້ມູນຜູ້ສະໝັກ, Open record), before the rare ones. Order is
   * always: lead · rare (more) · secondary · primary, the daily answer right-most. Never wraps to a second row on desktop.
   */
  lead?: React.ReactNode
  /**
   * 0.6, phone layout. "sheet" (default): main action + ⋯ sheet. "row": the primary and the first secondary as two big
   * buttons, then lead + more as one quiet row of small labelled buttons (no hidden menu), for popups with 3–5 daily actions.
   */
  phone?: "sheet" | "row"
  /** 0.6, phone="row": a shorter label set for the small row (defaults to the more actions' icon + label). */
  phoneSecondary?: React.ReactNode[]
}) {
  const mobile = useIsMobile(), [open, setOpen] = React.useState(false)
  if (!mobile) return (
    <div className="flex w-full flex-nowrap items-center justify-end gap-2 [&>button]:shrink-0">
      {lead && <div className="mr-auto flex shrink-0 [&>button]:shrink-0">{lead}</div>}
      {info && <span className={cn("min-w-0 truncate text-xs leading-normal text-muted-foreground", !lead && "mr-auto")}>{info}</span>}
      {more.map((a, i) => a.button ?? <Button key={i} variant="ghost" disabled={a.disabled} onClick={a.onPress} className={a.destructive ? "text-destructive" : undefined}>{a.icon}{a.label}</Button>)}
      {secondary}{primary}
    </div>
  )
  if (phone === "row") {
    const small = phoneSecondary ?? more.map((a, i) => <Button key={i} variant="ghost" disabled={a.disabled} onClick={a.onPress} className={a.destructive ? "text-destructive" : undefined}>{a.icon}{a.label}</Button>)
    const smallAll = lead ? [lead, ...small] : small
    return (
      <div className="grid w-full gap-2">
        <div className="flex gap-2 [&>*]:flex-1 [&_button]:h-12 [&_button]:w-full">{secondary[0] && <div>{secondary[0]}</div>}<div className="[&>button]:text-base">{primary}</div></div>
        {smallAll.length > 0 && <div className="grid gap-1 [&_button]:min-h-11 [&_button]:w-full [&_button]:px-1 [&_button]:text-xs" style={{ gridTemplateColumns: "repeat(" + smallAll.length + ", minmax(0,1fr))" }}>{smallAll.map((n, i) => <div key={i} className="min-w-0">{n}</div>)}</div>}
      </div>
    )
  }
  const sheetOnly = more.length > 0
  return (
    <div className="flex w-full gap-2 [&>*]:h-12">
      {sheetOnly && <Button variant="outline" size="icon" className="size-12 shrink-0" aria-label={moreLabel} onClick={() => setOpen(true)}><MoreHorizontal /></Button>}
      {secondary.length === 1 && <div className="flex-1 [&>button]:h-12 [&>button]:w-full">{secondary[0]}</div>}
      <div className="flex-[2] [&>button]:h-12 [&>button]:w-full [&>button]:text-base">{primary}</div>
      {sheetOnly && <ActionSheet open={open} onOpenChange={setOpen} message={typeof info === "string" ? info : undefined} actions={more} />}
    </div>
  )
}

/**
 * Use for a part of a long form that can fold on a phone (details that are not needed every time). The header shows
 * what is still missing, so nobody has to open it to know; desktop shows the section open with a plain title.
 * For a fixed section title use FormSection instead.
 */
export function FoldSection({ title, hint, done, open, onOpenChange, children, className }: {
  title: React.ReactNode; /** e.g. "ຍັງຂາດ ເພດ, ວັນເກີດ" */ hint?: React.ReactNode; /** hint turns green when everything is filled */ done?: boolean
  open?: boolean; onOpenChange?: (o: boolean) => void; children: React.ReactNode; className?: string
}) {
  const mobile = useIsMobile(), [own, setOwn] = React.useState(false), isOpen = open ?? own
  const set = (o: boolean) => { if (open === undefined) setOwn(o); onOpenChange?.(o) }
  if (!mobile) return <><FormSection className={cn("col-span-full", className)}>{title}</FormSection>{children}</>
  return (
    <>
      <button type="button" aria-expanded={isOpen} onClick={() => set(!isOpen)}
        className={cn("vks-press col-span-full flex min-h-12 items-center gap-2 rounded-xl border bg-muted/40 px-3 text-left leading-normal", className)}>
        <span className="min-w-0 flex-1"><span className="block text-sm font-semibold">{title}</span>{hint && <span className={cn("block truncate text-xs", done ? "text-success" : "text-muted-foreground")}>{hint}</span>}</span>
        <ChevronDown aria-hidden className={cn("size-4 shrink-0 transition-transform", isOpen && "rotate-180")} />
      </button>
      {isOpen && children}
    </>
  )
}

/** Use for a muted section title between groups of fields in a form body; for a page title use PageHeader instead. */
export function FormSection({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("text-xs font-semibold uppercase leading-normal tracking-wide text-muted-foreground", className)}>{children}</div>
}

/** Use for a non-selectable group header inside SelectContent (e.g. 12 ຊົ່ວໂມງ · 4); for a searchable grouped list use Combobox instead. */
export function SelectHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div role="presentation" className={cn("sticky top-0 z-10 -mx-1 border-b bg-popover px-3 pb-1.5 pt-2.5 text-xs font-semibold leading-normal text-muted-foreground first:pt-1.5", className)}>{children}</div>
}
