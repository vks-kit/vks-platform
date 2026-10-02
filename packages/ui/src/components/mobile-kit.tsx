import * as React from "react"
import { createPortal } from "react-dom"
import { Dialog as D } from "radix-ui"
import { Check, ChevronLeft, ChevronRight, Copy, Link2, Loader2, Search, X, XCircle } from "lucide-react"
import { haptics } from "@vks-kit/core"
import { cn } from "../lib/cn"
import { PANEL_SHELL, FLOAT_CARD, FLOAT_DOCK, FLOAT_CANCEL } from "../lib/panel"
import { Empty } from "./feedback"

const scrimBg = "bg-[color-mix(in_oklab,var(--foreground)_40%,transparent)]"

/* ------------------------------------------------------------------ SearchBar */
/**
 * iOS search field: grey pill, clear (x) while typing, "Cancel" slides in on focus and clears + blurs.
 * Use at the top of phone lists. For a plain desktop filter box use SearchBox.
 */
export function SearchBar({ value, onChange, placeholder = "ຄົ້ນຫາ", cancelLabel = "ຍົກເລີກ", onCancel, onSubmit, autoFocus, className }: {
  value: string; onChange: (v: string) => void; placeholder?: string; cancelLabel?: string; onCancel?: () => void; onSubmit?: (v: string) => void; autoFocus?: boolean; className?: string
}) {
  const [focus, setFocus] = React.useState(false), inp = React.useRef<HTMLInputElement>(null)
  const active = focus || value.length > 0
  return (
    <form role="search" onSubmit={(e) => { e.preventDefault(); inp.current?.blur(); onSubmit?.(value) }} className={cn("relative flex items-center", className)}>
      <div className={cn("relative flex-1 transition-[margin] duration-300 ease-[cubic-bezier(.32,.72,0,1)]", active ? "mr-[5.5rem]" : "mr-0")}>
        <Search aria-hidden className="pointer-events-none absolute left-3 top-1/2 size-[18px] -translate-y-1/2 text-muted-foreground" />
        <input ref={inp} type="search" enterKeyHint="search" autoFocus={autoFocus} value={value} placeholder={placeholder} aria-label={placeholder}
          onChange={(e) => onChange(e.target.value)} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
          className="h-11 w-full rounded-xl bg-foreground/[.07] pl-10 pr-10 text-[17px] leading-normal outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring/40 [&::-webkit-search-cancel-button]:hidden" />
        {value && (
          <button type="button" aria-label="ລ້າງ" onMouseDown={(e) => e.preventDefault()} onClick={() => { onChange(""); inp.current?.focus() }}
            className="vks-pop absolute right-0.5 top-1/2 grid size-10 -translate-y-1/2 place-items-center text-muted-foreground"><XCircle className="size-[18px] fill-muted-foreground/25" /></button>
        )}
      </div>
      <button type="button" tabIndex={active ? 0 : -1} aria-hidden={!active}
        onClick={() => { onChange(""); inp.current?.blur(); setFocus(false); onCancel?.() }}
        className={cn("absolute right-0 min-h-11 w-[5.25rem] truncate text-right text-[17px] leading-normal text-primary origin-right transition-[opacity,scale] duration-300 ease-[cubic-bezier(.32,.72,0,1)] dark:text-foreground",
          // scale in place (not slide in from off-screen) so the hidden button never widens the page on phones
          active ? "scale-100 opacity-100" : "pointer-events-none scale-90 opacity-0")}>{cancelLabel}</button>
    </form>
  )
}

/* ------------------------------------------------------------------ Carousel */
/**
 * Swipeable, snap-scrolling row of cards with page dots (phone) and arrow buttons (desktop).
 * Native scroll = 60 fps on cheap Android, no JS on the drag path. Arrow keys work when focused.
 * slideClassName sets how wide each slide is (default: 86% on phone, 3 per row on desktop).
 */
export function Carousel({ children, className, slideClassName = "w-[86%] md:w-[calc((100%-1.5rem)/3)]", label = "carousel", dots = true }: {
  children: React.ReactNode; className?: string; slideClassName?: string; label?: string; dots?: boolean
}) {
  const ref = React.useRef<HTMLDivElement>(null), [i, setI] = React.useState(0), [end, setEnd] = React.useState(false)
  const slides = React.Children.toArray(children), n = slides.length
  React.useEffect(() => {
    const el = ref.current; if (!el) return
    let raf = 0
    const f = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const kids = Array.from(el.children) as HTMLElement[]; if (!kids.length) return
        const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4
        let best = 0, bd = Infinity
        kids.forEach((k, j) => { const d = Math.abs(k.offsetLeft - kids[0].offsetLeft - el.scrollLeft); if (d < bd) { bd = d; best = j } })
        setEnd(atEnd); setI(atEnd && best < kids.length - 1 && el.scrollLeft > 0 ? kids.length - 1 : best)
      })
    }
    f(); el.addEventListener("scroll", f, { passive: true }); window.addEventListener("resize", f)
    return () => { cancelAnimationFrame(raf); el.removeEventListener("scroll", f); window.removeEventListener("resize", f) }
  }, [n])
  const go = (j: number) => {
    const el = ref.current; if (!el) return
    const kids = Array.from(el.children) as HTMLElement[], k = kids[Math.max(0, Math.min(n - 1, j))]; if (!k) return
    el.scrollTo({ left: k.offsetLeft - kids[0].offsetLeft, behavior: "smooth" })
  }
  /** Step from the real scroll position (not the dot index): at the track end the dot index is ahead of the scroll, which made "back" a no-op. */
  const step = (dir: 1 | -1) => {
    const el = ref.current; if (!el) return
    const kids = Array.from(el.children) as HTMLElement[], o = kids[0].offsetLeft, x = el.scrollLeft, max = el.scrollWidth - el.clientWidth
    const lefts = kids.map((k) => Math.min(k.offsetLeft - o, max))
    const t = dir > 0 ? lefts.find((l) => l > x + 4) : [...lefts].reverse().find((l) => l < x - 4)
    el.scrollTo({ left: t ?? (dir > 0 ? max : 0), behavior: "smooth" })
  }
  const arrow = "absolute top-1/2 z-10 hidden size-10 -translate-y-1/2 place-items-center rounded-full border bg-card/90 shadow-md backdrop-blur transition-[opacity,scale] duration-200 hover:scale-105 disabled:pointer-events-none disabled:opacity-0 md:grid"
  return (
    <div role="region" aria-roledescription="carousel" aria-label={label} className={cn("relative", className)}>
      <div ref={ref} tabIndex={0} onKeyDown={(e) => { if (e.key === "ArrowRight") { e.preventDefault(); step(1) } if (e.key === "ArrowLeft") { e.preventDefault(); step(-1) } }}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain rounded-2xl pb-1 outline-none [scrollbar-width:none] focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-scrollbar]:hidden">
        {slides.map((s, j) => <div key={j} role="group" aria-roledescription="slide" aria-label={j + 1 + " / " + n} className={cn("shrink-0 snap-start", slideClassName)}>{s}</div>)}
      </div>
      <button type="button" aria-label="ກ່ອນໜ້າ" disabled={i === 0} onClick={() => step(-1)} className={cn(arrow, "-left-3")}><ChevronLeft className="size-5" /></button>
      <button type="button" aria-label="ຕໍ່ໄປ" disabled={end} onClick={() => step(1)} className={cn(arrow, "-right-3")}><ChevronRight className="size-5" /></button>
      {dots && n > 1 && (
        <div className="mt-1 flex justify-center">
          {slides.map((_, j) => (
            <button key={j} type="button" aria-label={"ໄປທີ່ " + (j + 1)} aria-current={j === i || undefined} onClick={() => go(j)} className="grid h-7 w-5 place-items-center">
              <span className={cn("h-1.5 w-4 rounded-full bg-foreground transition-[scale,opacity] duration-300 ease-[cubic-bezier(.34,1.4,.64,1)]", j === i ? "scale-x-100 opacity-80" : "scale-x-[.375] opacity-25")} />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ ProgressHUD */
export type HudState = "loading" | "success" | "error"
/**
 * iOS-style HUD: dark frosted square in the centre with a spinner, then a tick or a cross.
 * Blocks taps while loading (Escape and outside clicks are ignored). Prefer useProgressHUD().run(promise).
 */
export function ProgressHUD({ open, state = "loading", label, onOpenChange }: { open: boolean; state?: HudState; label?: string; onOpenChange?: (o: boolean) => void }) {
  const text = label ?? (state === "loading" ? "ກຳລັງບັນທຶກ..." : state === "success" ? "ສຳເລັດ" : "ບໍ່ສຳເລັດ")
  return (
    <D.Root open={open} onOpenChange={(o) => { if (state !== "loading") onOpenChange?.(o) }}>
      <D.Portal>
        <D.Overlay className="fixed inset-0 z-50" />
        <D.Content aria-describedby={undefined} onEscapeKeyDown={(e) => { if (state === "loading") e.preventDefault() }}
          className="vks-alert fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 focus:outline-none">
          <div role="status" aria-live="polite" className="vks-glass-dark flex size-36 flex-col items-center justify-center gap-3 rounded-[1.4rem] p-4 text-center text-white shadow-[0_30px_60px_-20px_rgb(0_0_0/.5)]">
            {state === "loading" ? <Loader2 className="vks-spin size-9" /> : state === "success" ? <Check key="ok" className="vks-check-pop size-11" strokeWidth={2.5} /> : <X key="err" className="vks-shake size-11" strokeWidth={2.5} />}
            <D.Title className="text-sm font-medium leading-normal">{text}</D.Title>
          </div>
        </D.Content>
      </D.Portal>
    </D.Root>
  )
}
/** Wraps a promise in the HUD: spinner → tick (auto-hides 0.9 s) or cross (1.4 s), with haptics. Render {hud} once. */
export function useProgressHUD() {
  const [s, setS] = React.useState<{ open: boolean; state: HudState; label?: string }>({ open: false, state: "loading" })
  const timer = React.useRef<ReturnType<typeof setTimeout>>(undefined)
  React.useEffect(() => () => clearTimeout(timer.current), [])
  const run = React.useCallback(async <T,>(work: Promise<T> | (() => Promise<T>), l: { loading?: string; success?: string; error?: string } = {}): Promise<T> => {
    clearTimeout(timer.current); setS({ open: true, state: "loading", label: l.loading })
    try {
      const r = await (typeof work === "function" ? work() : work)
      haptics.success(); setS({ open: true, state: "success", label: l.success }); timer.current = setTimeout(() => setS((x) => ({ ...x, open: false })), 900); return r
    } catch (e) {
      haptics.error(); setS({ open: true, state: "error", label: l.error }); timer.current = setTimeout(() => setS((x) => ({ ...x, open: false })), 1400); throw e
    }
  }, [])
  return { hud: <ProgressHUD {...s} onOpenChange={(o) => setS((x) => ({ ...x, open: o }))} />, run }
}

/* ------------------------------------------------------------------ SnapSheet */
/**
 * Bottom sheet with snap points (Apple Maps style). Drag the handle; a flick picks the next stop,
 * dragging below the lowest stop closes it. Tap the handle to cycle stops. snaps are fractions of the screen height.
 * For a simple modal sheet use Sheet / Dialog; use this when the page behind should stay useful (maps, lists).
 */
export function SnapSheet({ open, onOpenChange, snaps = [0.45, 0.92], initial = 0, title, children, modal = true, className }: {
  open: boolean; onOpenChange: (o: boolean) => void; snaps?: number[]; initial?: number; title?: React.ReactNode; children: React.ReactNode; modal?: boolean; className?: string
}) {
  const [shown, setShown] = React.useState(open), [entered, setEntered] = React.useState(false)
  const [snap, setSnap] = React.useState(initial), [dy, setDy] = React.useState<number | null>(null), [vh, setVh] = React.useState(800)
  const drag = React.useRef<{ y: number; t: number } | null>(null), panel = React.useRef<HTMLDivElement>(null)
  React.useEffect(() => { const f = () => setVh(window.innerHeight); f(); window.addEventListener("resize", f); return () => window.removeEventListener("resize", f) }, [])
  React.useEffect(() => {
    if (open) {
      setShown(true); setSnap(initial); let b = 0
      const a = requestAnimationFrame(() => { b = requestAnimationFrame(() => { setEntered(true); panel.current?.focus({ preventScroll: true }) }) })
      return () => { cancelAnimationFrame(a); cancelAnimationFrame(b) }
    }
    setEntered(false); const t = setTimeout(() => setShown(false), 440); return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])
  React.useEffect(() => {
    if (!open) return
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") onOpenChange(false) }
    window.addEventListener("keydown", k); return () => window.removeEventListener("keydown", k)
  }, [open, onOpenChange])
  if (!shown || typeof document === "undefined") return null
  const top = Math.max(...snaps), H = top * vh, base = entered ? (top - snaps[snap]) * vh : H
  const raw = dy === null ? base : base + dy, y = raw < 0 ? raw * 0.25 : raw
  const fade = Math.max(0, Math.min(1, (H - y) / (snaps[0] * vh)))
  const cycle = () => { setSnap((s) => (s + 1) % snaps.length); haptics.tap() }
  const up = (e: React.PointerEvent) => {
    const d = drag.current; drag.current = null; if (!d) return
    const delta = e.clientY - d.y, v = delta / Math.max(1, performance.now() - d.t); setDy(null)
    if (Math.abs(delta) < 5) { cycle(); return }
    const h = H - (base + delta) - v * 180
    if (h < snaps[0] * vh * 0.55) { haptics.tap(); onOpenChange(false); return }
    let best = 0; snaps.forEach((s, j) => { if (Math.abs(s * vh - h) < Math.abs(snaps[best] * vh - h)) best = j })
    if (best !== snap) haptics.tap(); setSnap(best)
  }
  const ease = dy === null ? ".44s cubic-bezier(.32,.72,0,1)" : "0s"
  return createPortal(
    <>
      {modal && <div aria-hidden onClick={() => onOpenChange(false)} className={cn("fixed inset-0 z-50", scrimBg)} style={{ opacity: fade, transition: "opacity " + ease }} />}
      <div ref={panel} role="dialog" aria-modal={modal} aria-label={typeof title === "string" ? title : "sheet"} tabIndex={-1}
        className={cn("fixed inset-x-0 bottom-0 z-50 mx-auto flex max-w-xl flex-col outline-none will-change-transform", PANEL_SHELL, className)}
        style={{ height: H, transform: "translate3d(0," + y + "px,0)", transition: "transform " + ease }}>
        <div onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); drag.current = { y: e.clientY, t: performance.now() }; setDy(0) }}
          onPointerMove={(e) => { if (drag.current) setDy(e.clientY - drag.current.y) }} onPointerUp={up} onPointerCancel={up}
          className="shrink-0 cursor-grab touch-none select-none px-4 pb-2 pt-1.5 active:cursor-grabbing">
          <button type="button" aria-label="ປັບຂະໜາດ" onClick={(e) => { if (e.detail === 0) cycle() }} className="mx-auto flex h-5 w-16 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <span className="h-1.5 w-10 rounded-full bg-foreground/25" />
          </button>
          {title && <h2 className="text-center text-base font-bold leading-normal">{title}</h2>}
        </div>
        <div className="min-h-0 overflow-y-auto overscroll-contain px-4 pb-[max(1rem,env(safe-area-inset-bottom))] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" style={{ height: Math.max(0, snaps[snap] * vh - (title ? 64 : 32)) }}>{children}</div>
      </div>
    </>, document.body)
}

/* ------------------------------------------------------------------ IndexedList */
export type IndexedItem = { id: string; label: string; sub?: string; icon?: React.ReactNode; trailing?: React.ReactNode }
/** Index letter for a label. Lao lead vowels (ເ ແ ໂ ໃ ໄ) are skipped so ເພັດ files under ພ; digits go under #. */
export function indexKey(label: string): string {
  const s = label.trim().replace(/^[\u0EC0-\u0EC4]/, ""), c = s.charAt(0)
  if (!c || /[0-9]/.test(c)) return "#"
  return c.toUpperCase()
}
/** Sort (Lao-aware) and bucket items by indexKey. # goes last. Pure, unit tested. */
export function groupByIndex<T extends { label: string }>(items: T[]): { key: string; items: T[] }[] {
  const m = new Map<string, T[]>()
  for (const it of [...items].sort((a, b) => a.label.localeCompare(b.label, "lo"))) {
    const k = indexKey(it.label); const arr = m.get(k); if (arr) arr.push(it); else m.set(k, [it])
  }
  return [...m.entries()].map(([key, items]) => ({ key, items })).sort((a, b) => (a.key === "#" ? 1 : b.key === "#" ? -1 : a.key.localeCompare(b.key, "lo")))
}
/**
 * Contacts-style list: sticky letter headers + an index rail on the right. Slide a finger along the rail
 * to jump (big letter bubble + haptic tick). Give it a height via className (default h-96).
 */
export function IndexedList<T extends IndexedItem>({ items, onSelect, className, emptyLabel = "ບໍ່ມີລາຍການ" }: { items: T[]; onSelect?: (item: T) => void; className?: string; emptyLabel?: string }) {
  const groups = React.useMemo(() => groupByIndex(items), [items])
  const box = React.useRef<HTMLDivElement>(null), last = React.useRef(""), pressing = React.useRef(false)
  const [hint, setHint] = React.useState<string | null>(null), hide = React.useRef<ReturnType<typeof setTimeout>>(undefined)
  const go = (k: string) => {
    const el = box.current?.querySelector<HTMLElement>('[data-key="' + k.replace(/"/g, "") + '"]')
    if (el && box.current) box.current.scrollTop = el.offsetTop
    clearTimeout(hide.current); setHint(k); haptics.tap()
  }
  const pick = (e: React.PointerEvent) => {
    const k = (document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null)?.closest<HTMLElement>("[data-idx]")?.dataset.idx
    if (k && k !== last.current) { last.current = k; go(k) }
  }
  const release = () => { pressing.current = false; last.current = ""; hide.current = setTimeout(() => setHint(null), 450) }
  React.useEffect(() => () => clearTimeout(hide.current), [])
  return (
    <div className={cn("relative h-96 overflow-hidden rounded-2xl border bg-card", className)}>
      <div ref={box} className="relative h-full overflow-y-auto overscroll-contain pr-6">
        {groups.length === 0 && <div className="grid h-full place-items-center"><Empty size="sm" title={emptyLabel} /></div>}
        {groups.map((g) => (
          <section key={g.key} data-key={g.key} aria-label={g.key}>
            <h4 className="sticky top-0 z-10 bg-muted/90 px-4 py-1 text-xs font-bold leading-normal text-muted-foreground backdrop-blur">{g.key}</h4>
            {g.items.map((it) => (
              <button key={it.id} type="button" onClick={() => onSelect?.(it)}
                className="flex min-h-11 w-full items-center gap-3 border-b border-foreground/5 px-4 py-2 text-left transition-colors last:border-0 hover:bg-muted/50 active:bg-foreground/[.06]">
                {it.icon}
                <span className="min-w-0 flex-1"><span className="block truncate text-[15px] leading-normal">{it.label}</span>{it.sub && <span className="block truncate text-xs leading-normal text-muted-foreground">{it.sub}</span>}</span>
                {it.trailing}
              </button>
            ))}
          </section>
        ))}
      </div>
      <nav aria-label="index" className="absolute inset-y-1 right-0 flex w-6 touch-none select-none flex-col items-center justify-center"
        onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); pressing.current = true; pick(e) }}
        onPointerMove={(e) => { if (pressing.current) pick(e) }} onPointerUp={release} onPointerCancel={release}>
        {groups.map((g) => <button key={g.key} type="button" data-idx={g.key} onClick={(e) => { if (e.detail === 0) go(g.key) }} className="w-full py-px text-center text-[11px] font-semibold leading-tight text-primary dark:text-foreground">{g.key}</button>)}
      </nav>
      {hint && <div key={hint} aria-hidden className="vks-pop vks-glass-dark pointer-events-none absolute left-1/2 top-1/2 grid size-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-2xl text-2xl font-bold text-white">{hint}</div>}
    </div>
  )
}

/* ------------------------------------------------------------------ BottomToolbar */
export type ToolbarItem = { id: string; icon: React.ReactNode; label: string; onPress?: () => void; disabled?: boolean; destructive?: boolean }
/**
 * iOS bottom toolbar: frosted bar of actions for the current screen (share, edit, delete),
 * sits above the home indicator. Use it instead of BottomNav when the buttons are actions, not places.
 */
export function BottomToolbar({ items, fixed = false, showLabels = true, className }: { items: ToolbarItem[]; fixed?: boolean; showLabels?: boolean; className?: string }) {
  return (
    <div role="toolbar" className={cn("vks-glass flex items-stretch justify-around border-t border-foreground/10 px-2 pb-[max(0.25rem,env(safe-area-inset-bottom))] pt-1", fixed && "fixed inset-x-0 bottom-0 z-40", className)}>
      {items.map((it) => (
        <button key={it.id} type="button" disabled={it.disabled} aria-label={it.label} onClick={() => { haptics.tap(); it.onPress?.() }}
          className={cn("vks-press flex min-h-11 min-w-11 flex-col items-center justify-center gap-0.5 rounded-lg px-2 transition-opacity disabled:opacity-35 [&_svg]:size-[22px]",
            it.destructive ? "text-destructive" : "text-primary dark:text-foreground")}>
          {it.icon}{showLabels && <span className="text-[10px] font-medium leading-normal">{it.label}</span>}
        </button>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ Long press */
/** Hold-to-act for touch (default 500 ms). Cancels if the finger moves > 10 px, so it never fights scrolling. Spread the result on any element. */
export function useLongPress(onLongPress: () => void, { ms = 500, onPress }: { ms?: number; onPress?: () => void } = {}) {
  const t = React.useRef<ReturnType<typeof setTimeout> | null>(null), start = React.useRef<[number, number] | null>(null), fired = React.useRef(false)
  const clear = () => { if (t.current) clearTimeout(t.current); t.current = null }
  React.useEffect(() => clear, [])
  return {
    onPointerDown: (e: React.PointerEvent) => { fired.current = false; start.current = [e.clientX, e.clientY]; clear(); t.current = setTimeout(() => { fired.current = true; haptics.tap(); onLongPress() }, ms) },
    onPointerMove: (e: React.PointerEvent) => { const s = start.current; if (s && Math.hypot(e.clientX - s[0], e.clientY - s[1]) > 10) clear() },
    onPointerUp: () => { const was = !!t.current; clear(); if (was && !fired.current) onPress?.() },
    onPointerLeave: clear, onPointerCancel: clear,
    onContextMenu: (e: React.MouseEvent) => { if (fired.current) e.preventDefault() },
    style: { WebkitTouchCallout: "none", userSelect: "none" } as React.CSSProperties,
  }
}

/* ------------------------------------------------------------------ Share sheet */
export type ShareTarget = { id: string; label: string; icon: React.ReactNode; tone?: string; onPress: () => void }
export type ShareData2 = { title: string; text?: string; url?: string }
/** Build share links for common targets (WhatsApp, LINE, Telegram, Facebook, email). Pure. */
export function shareUrls(text: string, url?: string): { whatsapp: string; line: string; telegram: string; facebook: string; mail: string } {
  const full = encodeURIComponent(url ? text + " " + url : text), u = encodeURIComponent(url ?? "")
  return {
    whatsapp: "https://wa.me/?text=" + full,
    line: "https://line.me/R/share?text=" + full,
    telegram: "https://t.me/share/url?url=" + u + "&text=" + encodeURIComponent(text),
    facebook: "https://www.facebook.com/sharer/sharer.php?u=" + u,
    mail: "mailto:?subject=" + encodeURIComponent(text) + "&body=" + full,
  }
}
/**
 * share(data): on touch phones with the Web Share API it opens the native OS sheet;
 * otherwise (desktop) it opens <ShareSheet {...sheetProps} />. forceSheet skips the native path.
 */
export function useShareSheet() {
  const [data, setData] = React.useState<ShareData2 | null>(null)
  const share = React.useCallback(async (d: ShareData2, opts: { forceSheet?: boolean } = {}) => {
    const nav = typeof navigator !== "undefined" ? (navigator as Navigator & { share?: (d: ShareData) => Promise<void> }) : null
    if (!opts.forceSheet && nav?.share && typeof matchMedia !== "undefined" && matchMedia("(pointer: coarse)").matches) {
      try { await nav.share(d); return } catch (e) { if ((e as Error).name === "AbortError") return }
    }
    setData(d)
  }, [])
  return { share, sheetProps: { data, onClose: () => setData(null) } }
}
/** iOS-style share sheet: preview card, row of app targets, "copy link", cancel. Extra targets (e.g. save PDF) via targets. */
export function ShareSheet({ data, onClose, targets = [], copyLabel = "ສຳເນົາລິ້ງ", copiedLabel = "ສຳເນົາແລ້ວ", cancelLabel = "ຍົກເລີກ" }: {
  data: ShareData2 | null; onClose: () => void; targets?: ShareTarget[]; copyLabel?: string; copiedLabel?: string; cancelLabel?: string
}) {
  const [copied, setCopied] = React.useState(false)
  React.useEffect(() => { if (!data) setCopied(false) }, [data])
  const links = data ? shareUrls(data.text ?? data.title, data.url) : null
  const go = (href: string) => { window.open(href, "_blank", "noopener"); onClose() }
  const app = (label: string, tone: string, glyph: string, href: string): ShareTarget => ({ id: label, label, tone, icon: <span className="text-[17px] font-bold">{glyph}</span>, onPress: () => go(href) })
  const all: ShareTarget[] = links ? [
    app("WhatsApp", "bg-success text-success-foreground", "W", links.whatsapp),
    app("LINE", "bg-success text-success-foreground", "L", links.line),
    app("Telegram", "bg-primary text-primary-foreground", "T", links.telegram),
    app("Facebook", "bg-primary text-primary-foreground", "f", links.facebook),
    app("Email", "bg-card text-foreground", "@", links.mail),
    ...targets,
  ] : []
  return (
    <D.Root open={!!data} onOpenChange={(o) => { if (!o) onClose() }}>
      <D.Portal>
        <D.Overlay className={cn("vks-scrim fixed inset-0 z-50", scrimBg)} />
        <D.Content aria-describedby={undefined} className={FLOAT_DOCK}>
          <div className={cn("overflow-hidden", FLOAT_CARD)}>
            <div aria-hidden className="vks-grabber" style={{ margin: "10px auto 0" }} />
            <div className="flex items-center gap-3 border-b border-foreground/10 p-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground"><Link2 className="size-5" /></span>
              <div className="min-w-0 flex-1">
                <D.Title className="truncate text-[15px] font-semibold leading-normal">{data?.title}</D.Title>
                {data?.url && <p className="truncate text-[13px] leading-normal text-muted-foreground">{data.url.replace(/^https?:\/\//, "")}</p>}
              </div>
              <D.Close aria-label={cancelLabel} className="grid size-8 place-items-center rounded-full bg-foreground/10 text-muted-foreground"><X className="size-4" /></D.Close>
            </div>
            <div className="vks-stagger flex gap-3 overflow-x-auto px-4 py-4 [scrollbar-width:none]">
              {all.map((t, i) => (
                <button key={t.id} type="button" style={{ ["--i" as string]: i }} onClick={() => { haptics.tap(); t.onPress() }} className="vks-press flex w-16 shrink-0 flex-col items-center gap-1.5">
                  <span className={cn("grid size-14 place-items-center rounded-2xl shadow-sm [&_svg]:size-6", t.tone ?? "bg-card text-foreground")}>{t.icon}</span>
                  <span className="w-full truncate text-center text-[11px] leading-normal">{t.label}</span>
                </button>
              ))}
            </div>
            {data?.url && (
              <button type="button" onClick={async () => { try { await navigator.clipboard.writeText(data.url!); setCopied(true); haptics.success() } catch { haptics.error() } }}
                className="flex min-h-12 w-full items-center justify-between border-t border-foreground/10 px-4 text-[16px] leading-normal active:bg-foreground/10">
                <span>{copied ? copiedLabel : copyLabel}</span>
                {copied ? <Check key="c" className="vks-check-pop size-5 text-success" /> : <Copy className="size-5 text-muted-foreground" />}
              </button>
            )}
          </div>
          <D.Close className={FLOAT_CANCEL}>{cancelLabel}</D.Close>
        </D.Content>
      </D.Portal>
    </D.Root>
  )
}
