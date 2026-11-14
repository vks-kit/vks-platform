import * as React from "react"
import { Dialog as D, Tooltip as T } from "radix-ui"
import { cva, type VariantProps } from "class-variance-authority"
import { createPortal } from "react-dom"
import { ChevronLeft, X } from "lucide-react"
import { cn } from "../lib/cn"
import { PANEL_SURFACE, PANEL_CLOSE, PANEL_DESKTOP } from "../lib/panel"

/* ---- nesting: a picker opened inside an open Dialog/Sheet must not stack a 2nd sheet on top.
   DialogContent / SheetContent provide a host layer; InSheetView portals a pushed view into it. */
type Nest = { host: HTMLDivElement | null; setBack: (fn: (() => void) | null) => void }
const NestCtx = React.createContext<Nest | null>(null)
/** true when rendered inside an open DialogContent or SheetContent (pickers use it to push a view instead of opening another sheet). */
export const useInSheet = () => React.useContext(NestCtx) !== null
function useNest(onEscapeKeyDown?: (e: KeyboardEvent) => void) {
  const [host, setHost] = React.useState<HTMLDivElement | null>(null), [pushed, setPushed] = React.useState(false)
  const back = React.useRef<(() => void) | null>(null)
  const nest = React.useMemo<Nest>(() => ({ host, setBack: (fn) => { back.current = fn; setPushed(!!fn) } }), [host])
  // Esc while a view is pushed = go back one step, not close the whole dialog
  const onEsc = (e: KeyboardEvent) => { if (back.current) { e.preventDefault(); back.current() } else onEscapeKeyDown?.(e) }
  return { nest, onEsc, pushed, hostEl: <div ref={setHost} className="contents" /> }
}

/** Use for a modal that needs the user's full attention (form, detail); bottom sheet on phones, centred on desktop. Pair with DialogTrigger + DialogContent. For a yes/no confirmation use ConfirmDialog instead; for a side panel use Sheet or Drawer instead; for an iOS-style alert use IOSAlert instead. */
export const Dialog = D.Root
/** Use for the element that opens a Dialog (use asChild with a Button). For opening a Sheet use SheetTrigger instead. */
export const DialogTrigger = D.Trigger
/** Use to wrap a custom button that closes its Dialog (use asChild). The X in the corner is already built in; for confirm + cancel use ConfirmDialog instead. */
export const DialogClose = D.Close
/* A tap on a toast (Undo, close) is not "outside" the open panel. */
const keepOpenForToast = (fn?: (e: Event) => void) => (e: Event) => { if ((e.target as Element | null)?.closest?.("[data-sonner-toaster]")) e.preventDefault(); fn?.(e) }
const Overlay = ({ className, ...p }: React.ComponentProps<typeof D.Overlay>) => (
  <D.Overlay className={cn("vks-scrim fixed inset-0 z-50 bg-[color-mix(in_oklab,var(--foreground)_45%,transparent)]", className)} {...p} />
)
/** Use for the panel of a Dialog (scrim, grabber on phones, close X built in). For a panel from the side use SheetContent instead. */
export function DialogContent({ className, children, onEscapeKeyDown, onInteractOutside, ...p }: React.ComponentProps<typeof D.Content>) {
  const { nest, onEsc, pushed, hostEl } = useNest(onEscapeKeyDown)
  return (
    <D.Portal>
      <Overlay />
      <D.Content
        data-pushed={pushed || undefined} onEscapeKeyDown={onEsc} onInteractOutside={keepOpenForToast(onInteractOutside as (e: Event) => void)}
        className={cn("vks-modal fixed inset-x-0 bottom-0 z-50 grid max-h-[90dvh] w-full gap-4 overflow-auto", PANEL_SURFACE, PANEL_DESKTOP, "md:left-[calc(50%-min(14rem,50%-1rem))] md:top-[18vh] md:max-w-md data-[pushed]:overflow-hidden data-[pushed]:min-h-[min(34rem,85dvh)]", className)}
        {...p}
      >
        <NestCtx.Provider value={nest}>
          <div aria-hidden className="vks-grabber md:hidden" />
          {children}
          <D.Close aria-label="ປິດ" className={cn(PANEL_CLOSE, "vks-close hover:text-foreground")}><X className="size-4" /></D.Close>
          {hostEl}
        </NestCtx.Provider>
      </D.Content>
    </D.Portal>
  )
}
/** Use for the title block at the top of DialogContent (DialogTitle + DialogDescription). For a card heading use CardHeader instead. */
export const DialogHeader = ({ className, ...p }: React.ComponentProps<"div">) => <div className={cn("flex flex-col gap-1", className)} {...p} />
/** Use for the action buttons at the bottom of DialogContent. For card actions use CardFooter instead. */
export const DialogFooter = ({ className, ...p }: React.ComponentProps<"div">) => <div className={cn("flex justify-end gap-2", className)} {...p} />
/** Use for the required accessible heading of a Dialog or Sheet. For page headings use PageHeader instead. */
export const DialogTitle = ({ className, ...p }: React.ComponentProps<typeof D.Title>) => <D.Title className={cn("text-lg font-bold leading-snug", className)} {...p} />
/** Use for one muted explanatory line under DialogTitle. For longer body text use a <p> inside DialogContent instead. */
export const DialogDescription = ({ className, ...p }: React.ComponentProps<typeof D.Description>) => <D.Description className={cn("text-sm text-muted-foreground", className)} {...p} />

/* Sheet = Dialog that slides in. Use side="bottom" on phones (guards, inspectors). */
const sheetVariants = cva("fixed z-50 gap-4 bg-popover p-5 text-popover-foreground shadow-[0_-12px_40px_-12px_rgb(20_23_61/.35)] will-change-transform", {
  variants: { side: {
    bottom: "inset-x-0 bottom-0 max-h-[85dvh] overflow-auto vks-sheet-up " + PANEL_SURFACE,
    right: "inset-y-0 right-0 h-full w-full max-w-sm vks-sheet-side border-l",
    left: "inset-y-0 left-0 h-full w-[18rem] max-w-[85vw] overflow-hidden vks-sheet-left border-r",
    fullscreen: "inset-0 max-h-none overflow-hidden rounded-none border-0 !p-0 vks-sheet-side",
  } },
  defaultVariants: { side: "bottom" },
})
/** Use for a panel that slides in from an edge (side="bottom" on phones, "right" for desktop detail). Pair with SheetTrigger + SheetContent. For a centred modal use Dialog instead; for a draggable sheet with snap points use SnapSheet instead; for a simple side drawer with header use Drawer instead. */
export const Sheet = D.Root
/** Use for the element that opens a Sheet (use asChild). For opening a Dialog use DialogTrigger instead. */
export const SheetTrigger = D.Trigger
/** Use for the required accessible heading inside SheetContent (same as DialogTitle). */
export const SheetTitle = DialogTitle
/** Use for one muted line under SheetTitle (same as DialogDescription). */
export const SheetDescription = DialogDescription
/**
 * Use for the sliding panel of a Sheet; side = bottom / right / left / fullscreen. Pass footer for the sheet's buttons:
 * the body then scrolls on its own and the footer never leaves the screen. For a centred modal panel use DialogContent instead.
 */
export function SheetContent({ className, side, children, footer, onEscapeKeyDown, onInteractOutside, ...p }: React.ComponentProps<typeof D.Content> & VariantProps<typeof sheetVariants> & {
  /** Buttons pinned to the bottom of the sheet (Apply / Cancel, "Show 12"). Only the body above them scrolls. */
  footer?: React.ReactNode
}) {
  const { nest, onEsc, pushed, hostEl } = useNest(onEscapeKeyDown)
  return (
    <D.Portal>
      <Overlay />
      <D.Content data-pushed={pushed || undefined} onEscapeKeyDown={onEsc} onInteractOutside={keepOpenForToast(onInteractOutside as (e: Event) => void)} className={cn(sheetVariants({ side }), "data-[pushed]:overflow-hidden", side !== "fullscreen" && side !== "right" && side !== "left" && "data-[pushed]:min-h-[min(34rem,85dvh)]", footer && "flex flex-col gap-0 overflow-hidden pb-0", className)} {...p}>
        <NestCtx.Provider value={nest}>
          {side === "bottom" && <div aria-hidden className="vks-grabber" />}
          {footer ? <>
            <div className="-mx-5 min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-3">{children}</div>
            <div className="-mx-5 shrink-0 border-t bg-popover px-5 pt-3 pb-[max(0.25rem,env(safe-area-inset-bottom))]">{footer}</div>
          </> : children}
          <D.Close aria-label="ປິດ" className={cn(PANEL_CLOSE, "vks-close hover:text-foreground")}><X className="size-4" /></D.Close>
          {hostEl}
        </NestCtx.Provider>
      </D.Content>
    </D.Portal>
  )
}

/**
 * Use to show a second step (a picker, a detail) INSIDE an open Dialog or Sheet: it slides in over the same panel
 * with a back arrow, so a phone never gets a sheet on top of a sheet. Esc / back arrow return to the form.
 * Outside a Dialog/Sheet it renders nothing; there use Sheet instead. Combobox, DatePicker and DateRangePicker use it automatically.
 */
export function InSheetView({ open, onBack, title, children, className }: { open: boolean; onBack: () => void; title: React.ReactNode; children: React.ReactNode; className?: string }) {
  const nest = React.useContext(NestCtx)
  const [shown, setShown] = React.useState(open), backRef = React.useRef(onBack), from = React.useRef<HTMLElement | null>(null)
  backRef.current = onBack
  React.useEffect(() => { if (open) setShown(true) }, [open])
  React.useEffect(() => {
    if (!nest || !open) return
    from.current = document.activeElement as HTMLElement | null
    const panel = nest.host?.parentElement
    if (panel) panel.scrollTop = 0                      // the view covers the panel from its top edge
    nest.setBack(() => backRef.current())
    return () => { nest.setBack(null); from.current?.focus?.({ preventScroll: true }) }   // focus returns to the field
  }, [open, nest])
  if (!nest?.host || !shown) return null
  return createPortal(
    <div role="dialog" aria-modal="false" aria-label={typeof title === "string" ? title : undefined} data-leaving={!open || undefined}
      onAnimationEnd={(e) => { if (e.target === e.currentTarget && !open) setShown(false) }}
      className={cn("vks-push absolute inset-0 z-10 flex flex-col rounded-[inherit] bg-popover px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))] text-popover-foreground", className)}>
      <div className="mb-2 flex min-h-11 items-center gap-1">
        <button type="button" aria-label="ກັບຄືນ" onClick={() => backRef.current()} className="vks-press -ml-2 flex size-11 shrink-0 items-center justify-center rounded-full text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><ChevronLeft className="size-5" /></button>
        <div className="min-w-0 flex-1 truncate text-base font-bold leading-normal">{title}</div>
      </div>
      <div className="flex min-h-0 flex-1 flex-col">{children}</div>
    </div>, nest.host)
}

/** Use once near the app root so Tooltips share open/close delays (AppShell apps: wrap the whole tree). Not needed for Popover or HoverCard. */
export const TooltipProvider = T.Provider
/** Use for a short text hint on hover/focus (icon-only buttons, desktop). Pair with TooltipTrigger + TooltipContent. Not reliable on touch: for phones put the text in the label; for rich hover content use HoverCard instead; for tap-to-open content use Popover instead. */
export const Tooltip = T.Root
/** Use for the element that shows a Tooltip (use asChild with a Button). For opening a Popover use PopoverTrigger instead. */
export const TooltipTrigger = T.Trigger
const tipVariants = cva("z-50 max-w-64 leading-normal vks-float", {
  variants: {
    variant: {
      dark: "rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground shadow-[0_10px_24px_-12px_rgb(20_23_61/.6)]",
      light: "rounded-xl border bg-popover px-3 py-2 text-xs text-popover-foreground shadow-[0_12px_28px_-14px_rgb(20_23_61/.5)]",
      glass: "vks-glass rounded-xl border px-3 py-2 text-xs text-foreground shadow-[0_12px_28px_-14px_rgb(20_23_61/.5)]",
    },
  },
  defaultVariants: { variant: "dark" },
})
const arrowFill = { dark: "fill-primary", light: "fill-popover", glass: "fill-card" }

/**
 * Use for the short text bubble of a Tooltip. For interactive content use PopoverContent instead.
 * Additive options: variant dark (navy chip, default) | light (card, longer help) | glass (over maps, photos, charts),
 * arrow, shortcut (key hint on the right), title (bold first line, children become the muted second line).
 */
export function TooltipContent({ className, sideOffset = 6, variant, arrow = false, shortcut, title, children, ...p }: Omit<React.ComponentProps<typeof T.Content>, "title"> & VariantProps<typeof tipVariants> & {
  arrow?: boolean; shortcut?: string; title?: React.ReactNode
}) {
  const v = variant ?? "dark"
  const kbd = shortcut && <kbd className={cn("ml-auto inline-flex h-5 min-w-5 shrink-0 items-center justify-center rounded border px-1 font-mono text-[10px] font-semibold", v === "dark" ? "border-primary-foreground/25 bg-primary-foreground/10 text-primary-foreground/85" : "bg-muted text-muted-foreground")}>{shortcut}</kbd>
  return (
    <T.Portal>
      <T.Content sideOffset={arrow ? Math.max(0, sideOffset - 2) : sideOffset} className={cn(tipVariants({ variant: v }), className)} {...p}>
        {title ? (
          <div className="grid gap-0.5">
            <div className="flex items-center gap-3 font-semibold">{title}{kbd}</div>
            {children && <div className={v === "dark" ? "font-normal text-primary-foreground/75" : "text-muted-foreground"}>{children}</div>}
          </div>
        ) : kbd ? <div className="flex items-center gap-3">{children}{kbd}</div> : children}
        {arrow && <T.Arrow width={12} height={6} className={arrowFill[v]} />}
      </T.Content>
    </T.Portal>
  )
}

/** Use for a one-line tooltip without the three-part markup: <Tip content="ບັນທຶກ" shortcut="Ctrl S"><Button /></Tip>. Needs TooltipProvider at the root. */
export function Tip({ content, children, side = "top", align = "center", variant, arrow = true, shortcut, title, delay }: {
  content: React.ReactNode; children: React.ReactElement; side?: "top" | "right" | "bottom" | "left"; align?: "start" | "center" | "end"
  variant?: "dark" | "light" | "glass"; arrow?: boolean; shortcut?: string; title?: React.ReactNode; delay?: number
}) {
  return (
    <T.Root delayDuration={delay}>
      <T.Trigger asChild>{children}</T.Trigger>
      <TooltipContent side={side} align={align} variant={variant} arrow={arrow} shortcut={shortcut} title={title}>{content}</TooltipContent>
    </T.Root>
  )
}