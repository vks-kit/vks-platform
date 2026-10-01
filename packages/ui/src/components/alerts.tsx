import * as React from "react"
import { AlertDialog as AD } from "radix-ui"
import { AlertTriangle, CheckCircle2, Info, OctagonAlert } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"
import { haptics } from "@vks/core"
import { cn } from "../lib/cn"
import { PANEL_SURFACE, PANEL_DESKTOP } from "../lib/panel"
import { Button } from "./button"
import { CloseButton } from "./close-button"
import { ToneBadge } from "../lib/tone-badge"

const alertVariants = cva("flex gap-3 rounded-xl border-l-4 p-3 text-sm", {
  variants: { tone: {
    info: "border-primary bg-accent text-foreground",
    success: "border-success bg-success/10 text-foreground",
    warning: "border-warning bg-warning/10 text-foreground",
    danger: "border-destructive bg-destructive/10 text-foreground",
  } }, defaultVariants: { tone: "info" },
})
const icons = { info: Info, success: CheckCircle2, warning: AlertTriangle, danger: OctagonAlert }
const iconTone = { info: "text-primary", success: "text-success", warning: "text-warning", danger: "text-destructive" }

/* variant="card": glass/white card, gold top hairline, round tone badge (same family as IOSAlert / toast) */
const cardCls = "vks-alert-card vks-glass relative flex items-start gap-3 overflow-hidden rounded-2xl border border-foreground/10 p-3.5 text-sm text-foreground shadow-[0_14px_34px_-18px_rgb(20_23_61/.45)]"

/** Inline notice inside a page or form; variant="card" gives the glass card with a round tone badge. Use a toast for things that pass, an Alert for things that stay. */
export function Alert({ tone = "info", variant = "bar", title, children, onClose, action, icon, className }: { title?: string; children?: React.ReactNode; onClose?: () => void; action?: React.ReactNode; variant?: "bar" | "card"; icon?: React.ReactNode; className?: string } & VariantProps<typeof alertVariants>) {
  const t = tone ?? "info"
  const I = icons[t]
  const [leaving, setLeaving] = React.useState(false)
  const close = () => { if (leaving) return; setLeaving(true); window.setTimeout(() => onClose?.(), 260) }
  const card = variant === "card"
  return (
    <div className="vks-collapse" data-open={!leaving}><div style={{ opacity: leaving ? 0 : 1, transform: leaving ? "scale(.97) translate3d(0,-6px,0)" : undefined, transition: "opacity .22s ease, transform .26s ease" }}>
    <div role={t === "danger" || t === "warning" ? "alert" : "status"} data-tone={card ? t : undefined} className={cn(card ? cardCls : alertVariants({ tone }), "vks-pop", className)}>
      {card ? <ToneBadge tone={t} icon={icon} size="xs" className="mt-0.5" /> : (icon ? <span aria-hidden className={cn("mt-0.5 shrink-0 [&_svg]:size-5", iconTone[t])}>{icon}</span> : <I className={cn("mt-0.5 size-5 shrink-0", iconTone[t])} />)}
      <div className={cn("min-w-0 flex-1", card && "py-0.5")}>{title && <div className={cn("font-bold leading-snug", card && "text-[15px]")}>{title}</div>}{children && <div className="leading-relaxed text-muted-foreground">{children}</div>}{action && <div className="mt-2">{action}</div>}</div>
      {onClose && <CloseButton onClick={close} className={card ? "-m-2" : "-m-2 hover:bg-foreground/5"} />}
    </div>
    </div></div>
  )
}

/**
 * Confirm before something that cannot be undone (delete, clock out, submit report).
 * tone="danger" makes the confirm button red. holdToConfirm adds a 1.2 s press-and-hold guard for the worst cases.
 */
export function ConfirmDialog({ open, onOpenChange, title, description, confirmLabel = "ຢືນຢັນ", cancelLabel = "ຍົກເລີກ", tone = "warning", holdToConfirm = false, onConfirm, busy }: {
  open: boolean; onOpenChange: (o: boolean) => void; title: string; description?: React.ReactNode; confirmLabel?: string; cancelLabel?: string
  tone?: "warning" | "danger"; holdToConfirm?: boolean; onConfirm: () => void | Promise<void>; busy?: boolean
}) {
  const [hold, setHold] = React.useState(0), timer = React.useRef<number>(0), start = React.useRef(0)
  const stop = () => { cancelAnimationFrame(timer.current); setHold(0) }
  const go = () => { stop(); haptics.success(); void onConfirm() }
  const begin = () => {
    start.current = performance.now()
    const tick = () => { const p = Math.min(1, (performance.now() - start.current) / 1200); setHold(p); if (p >= 1) go(); else timer.current = requestAnimationFrame(tick) }
    timer.current = requestAnimationFrame(tick)
  }
  React.useEffect(() => { if (!open) stop() }, [open])
  const I = tone === "danger" ? OctagonAlert : AlertTriangle
  return (
    <AD.Root open={open} onOpenChange={onOpenChange}>
      <AD.Portal>
        <AD.Overlay className="vks-scrim fixed inset-0 z-50 bg-[color-mix(in_oklab,var(--foreground)_45%,transparent)]" />
        <AD.Content className={cn("vks-modal fixed inset-x-0 bottom-0 z-50 grid gap-4", PANEL_SURFACE, PANEL_DESKTOP, "md:left-[calc(50%-min(12rem,50%-1rem))] md:top-[22vh] md:max-w-sm")}>
          <div aria-hidden className="vks-grabber md:hidden" />
          <div className="flex items-start gap-3">
            <span className={cn("flex size-11 shrink-0 items-center justify-center rounded-full", tone === "danger" ? "bg-destructive/15 text-destructive" : "bg-warning/15 text-warning")}><I className="vks-wiggle size-6" /></span>
            <div><AD.Title className="text-lg font-bold leading-snug">{title}</AD.Title>{description && <AD.Description className="mt-1 text-sm text-muted-foreground">{description}</AD.Description>}</div>
          </div>
          <div className="flex flex-col-reverse gap-2 md:flex-row md:justify-end">
            <AD.Cancel asChild><Button variant="outline" disabled={busy}>{cancelLabel}</Button></AD.Cancel>
            {holdToConfirm ? (
              <Button variant={tone === "danger" ? "destructive" : "default"} disabled={busy} className="relative overflow-hidden" onPointerDown={begin} onPointerUp={stop} onPointerLeave={stop} onPointerCancel={stop} onKeyDown={(e) => e.key === "Enter" && go()}>
                <span className="absolute inset-0 origin-left bg-white/30" style={{ transform: `scaleX(${hold})` }} /><span className="relative">{confirmLabel}</span></Button>
            ) : <Button variant={tone === "danger" ? "destructive" : "default"} disabled={busy} onClick={go}>{confirmLabel}</Button>}
          </div>
          {holdToConfirm && <p className="-mt-2 text-center text-xs text-muted-foreground">ກົດຄ້າງໄວ້ 1 ວິນາທີ</p>}
        </AD.Content>
      </AD.Portal>
    </AD.Root>
  )
}