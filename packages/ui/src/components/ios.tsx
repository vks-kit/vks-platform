import * as React from "react"
import { AlertDialog as AD, Dialog as D } from "radix-ui"
import { ChevronRight } from "lucide-react"
import { haptics } from "@vks-kit/core"
import { cn } from "../lib/cn"
import { FLOAT_CARD, FLOAT_DOCK, FLOAT_CANCEL } from "../lib/panel"
import { ToneBadge, type Tone } from "../lib/tone-badge"
import { CloseButton } from "./close-button"

const scrim = "vks-scrim fixed inset-0 z-50 bg-[color-mix(in_oklab,var(--foreground)_40%,transparent)]"

export type IOSAlertAction = { label: string; onPress?: () => void | Promise<void>; style?: "default" | "cancel" | "destructive" }

/**
 * VKS alert (iOS UIAlertController behaviour, VKS look): centred card, zooms in with a spring,
 * round tone badge, gold hairline, pill buttons. Two actions sit side by side, three or more stack.
 * "default" = navy primary, "destructive" = red, "cancel" = quiet muted pill.
 * Use for short blocking questions. For long content use Dialog; for choices use ActionSheet.
 */
export function IOSAlert({ open, onOpenChange, title, message, actions, icon, tone }: { open: boolean; onOpenChange: (o: boolean) => void; title: string; message?: React.ReactNode; actions: IOSAlertAction[]; icon?: React.ReactNode; tone?: Tone }) {
  const row = actions.length === 2
  const t: Tone = tone ?? (actions.some((a) => a.style === "destructive") ? "danger" : "info")
  return (
    <AD.Root open={open} onOpenChange={onOpenChange}>
      <AD.Portal>
        <AD.Overlay className={scrim} />
        <AD.Content className="vks-alert fixed left-1/2 top-1/2 z-50 w-[min(19rem,calc(100vw-2.5rem))] -translate-x-1/2 -translate-y-1/2 focus:outline-none">
          <div className="relative overflow-hidden rounded-[1.5rem] border bg-card text-center shadow-[0_30px_70px_-24px_rgb(20_23_61/.55),0_2px_6px_-2px_rgb(20_23_61/.12)]">
            <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-[radial-gradient(70%_100%_at_50%_0%,color-mix(in_oklab,var(--gold)_18%,transparent),transparent_70%)]" />
            <div aria-hidden className="vks-hairline absolute inset-x-8 top-0" />
            <div className="relative px-5 pb-4 pt-6">
              <div className="mb-3 flex justify-center"><ToneBadge tone={t} icon={icon} /></div>
              <AD.Title className="text-[17px] font-bold leading-normal">{title}</AD.Title>
              {message && <AD.Description className="mt-1.5 text-[14px] leading-relaxed text-muted-foreground">{message}</AD.Description>}
            </div>
            <div className={cn("relative grid gap-2 px-4 pb-4", row && "grid-cols-2")}>
              {actions.map((a, i) => {
                const Btn = a.style === "cancel" ? AD.Cancel : AD.Action
                return (
                  <Btn key={i} onClick={() => { if (a.style === "destructive") haptics.error(); else haptics.tap(); void a.onPress?.() }}
                    className={cn("vks-btn min-h-11 rounded-full px-4 text-[15px] font-semibold leading-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card",
                      a.style === "destructive" ? "vks-btn-solid bg-destructive text-destructive-foreground [--vks-btn-glow:rgb(185_28_28/.45)]"
                        : a.style === "cancel" ? "vks-btn-soft bg-muted text-foreground hover:bg-accent"
                          : "vks-btn-solid bg-primary text-primary-foreground")}>{a.label}</Btn>
                )
              })}
            </div>
          </div>
        </AD.Content>
      </AD.Portal>
    </AD.Root>
  )
}

export type SheetAction = { label: string; icon?: React.ReactNode; onPress: () => void; destructive?: boolean; disabled?: boolean }

/** VKS action sheet (iOS behaviour): slides up, grabber, list of icon-tile rows + a separate Cancel pill. Great for "what to do with this item" on phones. */
export function ActionSheet({ open, onOpenChange, title, message, actions, cancelLabel = "ຍົກເລີກ" }: { open: boolean; onOpenChange: (o: boolean) => void; title?: string; message?: string; actions: SheetAction[]; cancelLabel?: string }) {
  return (
    <D.Root open={open} onOpenChange={onOpenChange}>
      <D.Portal>
        <D.Overlay className={scrim} />
        <D.Content aria-describedby={undefined} className={FLOAT_DOCK}>
          <div className={cn("relative overflow-hidden", FLOAT_CARD)}>
            <div aria-hidden className="vks-hairline absolute inset-x-10 top-0" />
            <div className="vks-grabber mt-2.5" style={{ margin: "10px auto 2px" }} />
            {(title || message) ? <div className="px-5 pb-2 pt-1 text-center leading-normal">
              <D.Title className={cn("text-[15px] font-bold", !title && "sr-only")}>{title ?? "actions"}</D.Title>
              {message && <p className="text-[13px] leading-relaxed text-muted-foreground">{message}</p>}
            </div> : <D.Title className="sr-only">actions</D.Title>}
            <div className="vks-rise p-2 pt-1">
              {actions.map((a, i) => (
                <button key={i} disabled={a.disabled} onClick={() => { haptics.tap(); onOpenChange(false); a.onPress() }}
                  className={cn("vks-press flex min-h-13 w-full items-center gap-3 rounded-2xl px-3 py-2 text-left text-[15px] font-semibold leading-normal transition-colors hover:bg-muted active:bg-muted disabled:opacity-40 focus-visible:bg-muted focus-visible:outline-none",
                    a.destructive ? "text-destructive" : "text-foreground")}>
                  <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl [&_svg]:size-5", a.destructive ? "bg-destructive/10 text-destructive" : "bg-primary/8 text-primary dark:bg-gold/15 dark:text-gold")}>{a.icon ?? <ChevronRight />}</span>
                  <span className="flex-1">{a.label}</span>
                </button>
              ))}
            </div>
          </div>
          <D.Close className={FLOAT_CANCEL}>{cancelLabel}</D.Close>
        </D.Content>
      </D.Portal>
    </D.Root>
  )
}

const bannerAccent = { info: "bg-primary dark:bg-gold", success: "bg-success", warning: "bg-warning", danger: "bg-destructive" }

/**
 * VKS notification banner (iOS behaviour): drops from the top with a spring, swipe up (or X) to dismiss,
 * auto-hides after `duration` ms (0 = stay) with a draining progress line. Tap runs onPress. Keep it mounted and toggle `open`.
 */
export function Banner({ open, onOpenChange, title, message, app = "VKS", time = "ດຽວນີ້", tone = "info", icon, onPress, duration = 5000 }: {
  open: boolean; onOpenChange: (o: boolean) => void; title: string; message?: React.ReactNode; app?: string; time?: string
  tone?: Tone; icon?: React.ReactNode; onPress?: () => void; duration?: number
}) {
  const [mounted, setMounted] = React.useState(open)
  const [dy, setDy] = React.useState(0)
  const start = React.useRef<number | null>(null)
  React.useEffect(() => { if (open) { setMounted(true); setDy(0) } }, [open])
  React.useEffect(() => { if (!open || !duration) return; const t = setTimeout(() => onOpenChange(false), duration); return () => clearTimeout(t) }, [open, duration, onOpenChange])
  if (!mounted) return null
  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[60] flex justify-center px-2 pt-[max(0.5rem,env(safe-area-inset-top))]">
      <div role="status" data-open={open} onAnimationEnd={(e) => { if (!open && e.target === e.currentTarget) setMounted(false) }}
        onPointerDown={(e) => { start.current = e.clientY; (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId) }}
        onPointerMove={(e) => { if (start.current !== null) setDy(Math.min(0, e.clientY - start.current)) }}
        onPointerUp={() => { const d = dy; start.current = null; if (d < -40) onOpenChange(false); else { setDy(0); if (d > -4 && onPress) { onPress(); onOpenChange(false) } } }}
        style={{ transform: dy ? `translate3d(0,${dy}px,0)` : undefined }}
        className={cn("vks-banner pointer-events-auto relative flex w-full max-w-md touch-none select-none items-start gap-3 overflow-hidden rounded-[1.4rem] border bg-card p-3 pl-4 pr-2 shadow-[0_22px_44px_-18px_rgb(20_23_61/.5),0_2px_6px_-2px_rgb(20_23_61/.12)]", onPress && "cursor-pointer", dy && "transition-none")}>
        <span aria-hidden className={cn("absolute inset-y-3 left-0 w-1 rounded-r-full", bannerAccent[tone])} />
        <ToneBadge tone={tone} icon={icon} size="sm" />
        <div className="min-w-0 flex-1 leading-normal">
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide text-muted-foreground"><span className="truncate">{app}</span><span className="size-1 rounded-full bg-gold" /><span className="shrink-0 normal-case tracking-normal font-medium">{time}</span></div>
          <div className="truncate text-[15px] font-bold">{title}</div>
          {message && <div className="line-clamp-2 text-[13px] leading-relaxed text-muted-foreground">{message}</div>}
        </div>
        <CloseButton onPointerDown={(e) => e.stopPropagation()} onPointerUp={(e) => e.stopPropagation()} onClick={() => onOpenChange(false)} className="-my-1" />
        {open && duration > 0 && !dy && <span aria-hidden className="vks-drain absolute inset-x-0 bottom-0 h-0.5 origin-left bg-gold/70" style={{ animationDuration: duration + "ms" }} />}
      </div>
    </div>
  )
}

/** iOS grouped list (Settings style). Put ListRow children inside. */
export function ListGroup({ header, footer, children, className }: { header?: React.ReactNode; footer?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <section className={cn("space-y-1.5", className)}>
      {header && <h3 className="px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{header}</h3>}
      <div className="overflow-hidden rounded-2xl border bg-card [&>*+*]:before:absolute [&>*+*]:before:left-14 [&>*+*]:before:right-0 [&>*+*]:before:top-0 [&>*+*]:before:h-px [&>*+*]:before:bg-border [&>*+*]:before:content-['']">{children}</div>
      {footer && <p className="px-4 text-xs leading-relaxed text-muted-foreground">{footer}</p>}
    </section>
  )
}
/** One row: coloured icon tile, label, optional detail text / trailing control, chevron when tappable. */
export function ListRow({ icon, iconClass = "bg-primary text-primary-foreground", label, sub, detail, trailing, onPress, destructive }: {
  icon?: React.ReactNode; iconClass?: string; label: React.ReactNode; sub?: React.ReactNode; detail?: React.ReactNode; trailing?: React.ReactNode; onPress?: () => void; destructive?: boolean
}) {
  const body = (
    <>
      {icon && <span className={cn("flex size-8 shrink-0 items-center justify-center rounded-lg [&_svg]:size-[18px]", iconClass)}>{icon}</span>}
      <span className="min-w-0 flex-1 text-left leading-snug"><span className={cn("block truncate", destructive && "text-destructive")}>{label}</span>{sub && <span className="block truncate text-xs text-muted-foreground">{sub}</span>}</span>
      {detail && <span className="shrink-0 text-sm text-muted-foreground">{detail}</span>}
      {trailing}
      {onPress && !trailing && <ChevronRight className="size-4 shrink-0 text-muted-foreground/60" />}
    </>
  )
  const cls = "relative flex min-h-12 w-full items-center gap-3 px-4 py-2 text-[15px]"
  return onPress
    ? <button type="button" onClick={onPress} className={cn(cls, "transition-colors active:bg-muted focus-visible:bg-muted focus-visible:outline-none")}>{body}</button>
    : <div className={cls}>{body}</div>
}