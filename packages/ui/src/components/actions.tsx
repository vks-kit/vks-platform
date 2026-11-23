import * as React from "react"
import { useFormStatus } from "react-dom"
import { X } from "lucide-react"
import { cn } from "../lib/cn"
import { applyPatches, type ListPatch } from "../lib/actions"
import { Button, type ButtonProps } from "./button"
import { toast } from "./toaster"

export * from "../lib/actions"

/**
 * Use for the save button of a form that posts with React 19 actions (<form action={…}>, useActionState): it reads
 * useFormStatus() itself, so while the action runs it shows the spinner, keeps its width and blocks a second tap, with no
 * pending state of your own. pendingLabel swaps the text while saving. For a button outside a <form> use Button with
 * loading instead; for the row of form buttons use FormActions.
 */
export function SubmitButton({ children, pendingLabel, variant = "action", disabled, ...p }: Omit<ButtonProps, "type" | "loading"> & {
  /** Text while the form is sending, e.g. "ກຳລັງບັນທຶກ…". Default: the normal label. */
  pendingLabel?: React.ReactNode
}) {
  const { pending } = useFormStatus()
  return <Button type="submit" variant={variant} loading={pending} disabled={disabled} aria-live="polite" {...p}>{pending && pendingLabel ? pendingLabel : children}</Button>
}

/**
 * Optimistic list (React 19 useOptimistic): mark(item, patch) shows the change at once (a scan ticks ✓ before the server
 * answers), runs save in a transition, and on failure drops the patch so the row goes back by itself and a toast says so.
 * Returns the list to render, mark(), and the ids still sending. Pair with SyncStatus / OfflineQueue for offline work.
 */
export function useOptimisticList<T extends { id: string }>(items: T[], save: (item: T, patch: Partial<T>) => Promise<unknown>, opts: {
  /** Toast text when a save fails. Default "ບັນທຶກບໍ່ສຳເລັດ, ກັບຄືນແລ້ວ". false = no toast. */
  failText?: string | false
  /** Called with the error after the change was rolled back. */
  onError?: (err: unknown, item: T) => void
} = {}) {
  const [shown, addPatch] = React.useOptimistic<T[], ListPatch<T>>(items, (cur, p) => applyPatches(cur, [p]))
  const [busy, setBusy] = React.useState<string[]>([])
  const [, start] = React.useTransition()
  const mark = React.useCallback((item: T, patch: Partial<T>) => {
    setBusy((b) => (b.includes(item.id) ? b : [...b, item.id]))
    start(async () => {
      addPatch({ id: item.id, patch })
      try { await save(item, patch) }
      catch (err) {
        if (opts.failText !== false) toast.error(opts.failText ?? "ບັນທຶກບໍ່ສຳເລັດ, ກັບຄືນແລ້ວ")
        opts.onError?.(err, item)
      } finally { setBusy((b) => b.filter((x) => x !== item.id)) }
    })
  }, [save, opts.failText, opts.onError]) // eslint-disable-line react-hooks/exhaustive-deps
  return { items: shown, mark, pending: busy }
}

/**
 * Use for a card that opens into its own full panel and folds back (a shift card into its checkpoints, a site card into
 * its details): the panel grows out of the card's own box, so the eye keeps track of where it came from. Transform only,
 * 300 ms, snaps with reduced motion. The card is the trigger; Esc or the ✕ closes. For a record that needs its own route or
 * a long form use Drawer instead; for a short yes/no use Dialog.
 */
export function ExpandCard({ summary, children, title, open: openProp, onOpenChange, className, panelClassName }: {
  /** The closed card (what the list shows). */
  summary: React.ReactNode
  /** What the open panel shows under its header. */
  children: React.ReactNode
  /** Header line of the open panel. */
  title?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  className?: string
  panelClassName?: string
}) {
  const [own, setOwn] = React.useState(false)
  const open = openProp ?? own
  const set = (o: boolean) => { if (openProp === undefined) setOwn(o); onOpenChange?.(o) }
  const card = React.useRef<HTMLButtonElement>(null)
  const panel = React.useRef<HTMLDivElement>(null)
  const [closing, setClosing] = React.useState(false)
  const id = React.useId()
  const reduce = () => typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  // FLIP: start the panel at the card's box, then let it grow to its own
  const fromCard = () => {
    const c = card.current?.getBoundingClientRect(), p = panel.current?.getBoundingClientRect()
    if (!c || !p || !p.width || !p.height) return "none"
    return "translate(" + (c.left - p.left) + "px," + (c.top - p.top) + "px) scale(" + c.width / p.width + "," + c.height / p.height + ")"
  }
  React.useLayoutEffect(() => {
    const el = panel.current
    if (!open || !el || reduce()) return
    el.style.transition = "none"; el.style.transformOrigin = "0 0"; el.style.transform = fromCard(); el.style.opacity = "0.6"
    el.getBoundingClientRect()
    el.style.transition = "transform 300ms var(--ease-out-quint, cubic-bezier(.22,1,.36,1)), opacity 180ms ease-out"
    el.style.transform = "none"; el.style.opacity = "1"
    el.focus({ preventScroll: true })
  }, [open])
  const close = () => {
    const el = panel.current
    if (!el || reduce()) { set(false); card.current?.focus(); return }
    setClosing(true)
    el.style.transition = "transform 240ms var(--ease-out-quint, cubic-bezier(.22,1,.36,1)), opacity 200ms ease-in"
    el.style.transform = fromCard(); el.style.opacity = "0"
    window.setTimeout(() => { setClosing(false); set(false); card.current?.focus() }, 240)
  }
  return (
    <div className={cn("relative min-w-0", className)}>
      <button ref={card} type="button" aria-expanded={open} aria-controls={id} onClick={() => set(true)}
        className={cn("vks-press block w-full min-w-0 rounded-xl border bg-card p-3 text-left text-card-foreground transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", open && !closing && "opacity-0")}>
        {summary}
      </button>
      {open && (
        <div ref={panel} id={id} role="region" aria-label={typeof title === "string" ? title : undefined} tabIndex={-1}
          onKeyDown={(e) => { if (e.key === "Escape") { e.stopPropagation(); close() } }}
          className={cn("fixed inset-x-0 bottom-0 top-[max(env(safe-area-inset-top),0.75rem)] z-50 flex flex-col overflow-hidden rounded-t-2xl border bg-card text-card-foreground shadow-[0_24px_60px_-20px_rgb(20_23_61/.45)] focus:outline-none md:absolute md:inset-auto md:left-0 md:top-0 md:max-h-[80dvh] md:w-[min(32rem,calc(100vw-2rem))] md:rounded-2xl", panelClassName)}>
          <div className="flex min-h-14 shrink-0 items-center gap-2 border-b px-4">
            <div className="min-w-0 flex-1 truncate font-semibold leading-normal">{title}</div>
            <button type="button" aria-label="ປິດ" onClick={close} className="vks-press -mr-2 flex size-11 items-center justify-center rounded-full text-muted-foreground hover:bg-muted [&_svg]:size-5"><X /></button>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4">{children}</div>
        </div>
      )}
    </div>
  )
}
