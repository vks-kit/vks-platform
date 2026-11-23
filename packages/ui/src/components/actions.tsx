import * as React from "react"
import { createPortal } from "react-dom"
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

/** Where the open panel sits: the whole screen on a phone, a centred panel on a desktop. */
function panelBox(vw: number, vh: number) {
  if (vw < 768) return { x: 0, y: 0, w: vw, h: vh, r: 0 }
  const w = Math.min(512, vw - 32), h = Math.min(Math.round(vh * 0.86), 760)
  return { x: Math.round((vw - w) / 2), y: Math.round((vh - h) / 2), w, h, r: 20 }
}
/** clip-path that shows only the rectangle x,y,w,h of a full-viewport layer, with rounded corners. */
export function insetClip(vw: number, vh: number, x: number, y: number, w: number, h: number, r: number): string {
  const px = (n: number) => Math.max(0, Math.round(n * 10) / 10) + "px"
  return "inset(" + px(y) + " " + px(vw - x - w) + " " + px(vh - y - h) + " " + px(x) + " round " + px(r) + ")"
}

type Phase = "closed" | "opening" | "open" | "closing"

/**
 * Use for a card that opens into its own screen as one object, the way iOS opens an App Store card, and folds back into
 * the same spot (a shift card into its checkpoints, a site card into its details). With cover (a coloured header with a
 * title) the card IS the bottom of that header: opening, the header grows up to full size while the body is revealed
 * under it, and closing it shrinks back into the list. Phone: full screen; desktop: a centred panel over a dimmed page.
 * clip-path + transform only (no layout jump), about 520 ms, instant with reduced motion; Esc / ✕ / the dimmed page close
 * it and focus returns to the card. For a record with its own URL or a long form use Drawer; for a yes/no use Dialog.
 */
export function ExpandCard({ summary, cover, coverClassName, coverHeight = 220, cardHeight, children, title, open: openProp, onOpenChange, className, panelClassName, closeLabel = "ປິດ" }: {
  /** The closed card. With cover you can leave it out: the card then shows the foot of the cover. */
  summary?: React.ReactNode
  /** Header of the open screen (title, a line under it). Its foot is what the closed card shows. */
  cover?: React.ReactNode
  /** Background of the cover, tokens only, e.g. "bg-primary text-primary-foreground" or "vks-hero". */
  coverClassName?: string
  /** Height of the cover when open, px. Default 220. */
  coverHeight?: number
  /** Height of the closed card when it shows the cover, px. Default 132 with a cover. */
  cardHeight?: number
  /** What the open screen shows under the cover (or under its header line without a cover). */
  children: React.ReactNode
  /** Accessible name of the open screen; without a cover it is also its header line. */
  title?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  className?: string
  panelClassName?: string
  closeLabel?: string
}) {
  const [own, setOwn] = React.useState(false)
  const want = openProp ?? own
  const card = React.useRef<HTMLButtonElement>(null)
  const layer = React.useRef<HTMLDivElement>(null)
  const inner = React.useRef<HTMLDivElement>(null)
  const [phase, setPhase] = React.useState<Phase>("closed")
  const geo = React.useRef({ vw: 0, vh: 0, card: { x: 0, y: 0, w: 0, h: 0 }, box: { x: 0, y: 0, w: 0, h: 0, r: 0 } })
  const id = React.useId()
  const hasCover = cover != null
  const ch = cardHeight ?? (hasCover ? 132 : undefined)
  const reduce = () => typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  const MS = 520, CURVE = "cubic-bezier(.3,.75,.1,1)"
  const set = (o: boolean) => { if (openProp === undefined) setOwn(o); onOpenChange?.(o) }

  const measure = () => {
    const c = card.current?.getBoundingClientRect()
    const vw = window.innerWidth, vh = window.innerHeight
    geo.current = { vw, vh, card: c ? { x: c.left, y: c.top, w: c.width, h: c.height } : geo.current.card, box: panelBox(vw, vh) }
  }
  // The open screen laid over the card: the clip shows only the card's rectangle, the content slides so the cover's foot
  // (or the summary) sits exactly where the card is. Open = the clip and the slide let go together.
  const shut = () => {
    const { vw, vh, card: c, box: b } = geo.current
    const r = parseFloat(getComputedStyle(card.current ?? document.body).borderTopLeftRadius) || 12
    const dy = hasCover ? c.y + c.h - b.y - coverHeight : c.y - b.y
    return { clip: insetClip(vw, vh, c.x, c.y, c.w, c.h, r), move: "translate(" + (c.x - b.x) + "px," + dy + "px)" }
  }
  const wide = () => { const { vw, vh, box: b } = geo.current; return { clip: insetClip(vw, vh, b.x, b.y, b.w, b.h, b.r), move: "translate(0px,0px)" } }
  const paint = (s: { clip: string; move: string }, ms: number) => {
    const l = layer.current, i = inner.current
    if (!l || !i) return
    const t = ms ? "clip-path " + ms + "ms " + CURVE : "none", ti = ms ? "transform " + ms + "ms " + CURVE : "none"
    l.style.transition = t; i.style.transition = ti
    l.style.clipPath = s.clip; i.style.transform = s.move
  }

  React.useEffect(() => { if (want && (phase === "closed" || phase === "closing")) { measure(); setPhase("opening") } else if (!want && (phase === "open" || phase === "opening")) setPhase("closing") }, [want]) // eslint-disable-line react-hooks/exhaustive-deps
  React.useLayoutEffect(() => {
    const ms = reduce() ? 0 : MS
    if (phase === "opening") {
      paint(shut(), 0)
      layer.current?.focus({ preventScroll: true })
      // two frames: the first paints the card-sized start, the second starts the grow (a same-frame change skips it)
      let a = 0, t = 0
      a = requestAnimationFrame(() => { a = requestAnimationFrame(() => { paint(wide(), ms); t = window.setTimeout(() => setPhase("open"), ms) }) })
      return () => { cancelAnimationFrame(a); window.clearTimeout(t) }
    }
    if (phase === "closing") {
      measure()
      paint(shut(), ms)
      const t = window.setTimeout(() => setPhase("closed"), ms)
      return () => window.clearTimeout(t)
    }
  }, [phase]) // eslint-disable-line react-hooks/exhaustive-deps
  const wasOpen = React.useRef(false)
  React.useEffect(() => {
    if (phase !== "closed") { wasOpen.current = true; return }
    if (wasOpen.current) { wasOpen.current = false; card.current?.focus({ preventScroll: true }) }
  }, [phase])
  React.useEffect(() => {
    if (phase === "closed") return
    const html = document.documentElement, prev = html.style.overflow
    html.style.overflow = "hidden"
    const onResize = () => { measure(); if (phase === "open" || phase === "opening") paint(wide(), 0) }
    window.addEventListener("resize", onResize)
    return () => { html.style.overflow = prev; window.removeEventListener("resize", onResize) }
  }, [phase === "closed"]) // eslint-disable-line react-hooks/exhaustive-deps

  const active = phase !== "closed"
  const shown = phase === "opening" || phase === "open"
  const b = geo.current.box
  const close = () => set(false)
  const capped = <div className={cn("relative flex h-full flex-col justify-end overflow-hidden p-4", coverClassName)}>{cover}</div>

  return (
    <div className={cn("relative min-w-0", className)}>
      <button ref={card} type="button" aria-expanded={shown} aria-controls={active ? id : undefined} onClick={() => set(true)}
        style={ch ? { height: ch } : undefined}
        className={cn("vks-press block w-full min-w-0 overflow-hidden rounded-xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          hasCover && !summary ? "p-0" : "border bg-card p-3 text-card-foreground", active && "invisible")}>
        {summary ?? capped}
      </button>
      {active && typeof document !== "undefined" && createPortal(
        <>
          <div aria-hidden onClick={close}
            className={cn("fixed inset-0 z-50 bg-[color-mix(in_oklab,var(--foreground)_40%,transparent)] transition-opacity duration-300", shown ? "opacity-100" : "opacity-0")} />
          <div ref={layer} id={id} role="dialog" aria-modal="true" aria-label={typeof title === "string" ? title : undefined} tabIndex={-1}
            onKeyDown={(e) => { if (e.key === "Escape") { e.stopPropagation(); close() } }}
            onClick={(e) => { if (e.target === e.currentTarget) close() }}
            className="fixed inset-0 z-50 focus:outline-none [will-change:clip-path]">
            <div ref={inner} style={{ left: b.x, top: b.y, width: b.w, height: b.h }}
              className={cn("absolute flex flex-col overflow-hidden bg-card text-card-foreground [will-change:transform]", !hasCover && "border", panelClassName)}>
              {hasCover ? (
                <div className={cn("relative shrink-0 overflow-hidden", coverClassName)} style={{ height: coverHeight }}>
                  <div className="absolute inset-x-0 bottom-0 p-4">{cover}</div>
                </div>
              ) : (
                <div className="relative shrink-0">
                  <div className={cn("p-3 transition-opacity duration-150", shown ? "opacity-0" : "opacity-100")}>{summary}</div>
                  <div className={cn("absolute inset-0 flex items-center px-4 font-semibold leading-normal transition-opacity duration-200", shown ? "opacity-100 delay-150" : "opacity-0")}>
                    <span className="min-w-0 truncate pr-12">{title}</span>
                  </div>
                </div>
              )}
              <button type="button" aria-label={closeLabel} onClick={close}
                className={cn("vks-press absolute right-3 top-[max(env(safe-area-inset-top),0.75rem)] z-10 flex size-11 items-center justify-center rounded-full transition-opacity duration-300 md:top-3 [&_svg]:size-5",
                  hasCover ? "bg-[color-mix(in_oklab,var(--foreground)_28%,transparent)] text-[var(--logo-letter)]" : "text-muted-foreground hover:bg-muted",
                  shown ? "opacity-100 delay-200" : "pointer-events-none opacity-0")}><X /></button>
              <div className={cn("min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 pb-[max(env(safe-area-inset-bottom),1rem)] transition-opacity",
                shown ? "opacity-100 duration-300" : "opacity-0 duration-100")}>{children}</div>
            </div>
          </div>
        </>, document.body)}
    </div>
  )
}
