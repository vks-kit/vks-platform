import * as React from "react"
import { cn } from "../lib/cn"
import { usePerf } from "../lib/perf"

/* Desktop hover effects. JS only writes CSS variables (rAF-throttled); all motion is transform/opacity in animations.css.
   Off on touch devices (no fine pointer), in perf "lite" and under reduced motion. */

const finePointer = () => typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches

/** Tracks the pointer inside an element and writes --mx/--my (px) and --px/--py (0..1) for custom hover effects (add the vks-parallax class to drive ParallaxLayer children). Returns false when effects are off. */
export function usePointerVars<T extends HTMLElement>(ref: React.RefObject<T | null>, onLeave?: (el: T) => void) {
  const { tier } = usePerf()
  const on = tier !== "lite"
  React.useEffect(() => {
    const el = ref.current
    if (!el || !on || !finePointer()) return
    let raf = 0, e: PointerEvent | null = null
    const paint = () => {
      raf = 0
      if (!e) return
      const r = el.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top
      el.style.setProperty("--mx", x + "px"); el.style.setProperty("--my", y + "px")
      el.style.setProperty("--px", (x / r.width).toFixed(3)); el.style.setProperty("--py", (y / r.height).toFixed(3))
    }
    const move = (ev: PointerEvent) => { e = ev; if (!raf) raf = requestAnimationFrame(paint) }
    const leave = () => { e = null; el.style.setProperty("--px", ".5"); el.style.setProperty("--py", ".5"); onLeave?.(el) }
    el.addEventListener("pointermove", move); el.addEventListener("pointerleave", leave)
    return () => { cancelAnimationFrame(raf); el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", leave) }
  }, [ref, on, onLeave])
  return on
}

export type HoverFxEffect = "spotlight" | "trace" | "tilt"

/** Use for a premium desktop hover on a card or tile: spotlight (gold glow follows the cursor), trace (gold edge near the cursor, best on navy) or tilt (≤5° 3D tilt + sheen, for hero/KPI cards). Wrap the card; for a plain lift use the vks-lift class instead. Phones and lite mode see no effect. */
export function HoverFx({ effect = "spotlight", className, children, ...p }: React.HTMLAttributes<HTMLDivElement> & { effect?: HoverFxEffect }) {
  const ref = React.useRef<HTMLDivElement>(null)
  usePointerVars(ref)
  return <div ref={ref} data-fx={effect} className={cn("vks-fx relative isolate", className)} {...p}>{children}</div>
}

/** Use for a hero or login panel whose background layers drift with the mouse; put ParallaxLayer children inside with a depth. For scroll-driven motion use plain CSS instead. */
export function Parallax({ className, children, ...p }: React.HTMLAttributes<HTMLDivElement>) {
  const ref = React.useRef<HTMLDivElement>(null)
  usePointerVars(ref)
  return <div ref={ref} className={cn("vks-parallax", className)} {...p}>{children}</div>
}

/** Use inside Parallax: one layer that moves up to depth px with the mouse (negative = opposite way). Decorative layers should be aria-hidden. */
export function ParallaxLayer({ depth = 12, className, style, children, ...p }: React.HTMLAttributes<HTMLDivElement> & { depth?: number }) {
  return <div className={cn("vks-parallax-layer", className)} style={{ "--depth": depth, ...style } as React.CSSProperties} {...p}>{children}</div>
}

/** Use for a sidebar, menu or list where one soft pill glides to the hovered row instead of each row flashing; marks rows with [data-slide-item] or uses direct children. For keyboard selection keep the row's own focus style. */
export function SlideHighlight({ className, children, itemSelector = "[data-slide-item], :scope > :not(.vks-slide-pill)", ...p }: React.HTMLAttributes<HTMLDivElement> & { itemSelector?: string }) {
  const ref = React.useRef<HTMLDivElement>(null), pill = React.useRef<HTMLSpanElement>(null)
  const { tier } = usePerf()
  React.useEffect(() => {
    const box = ref.current, pl = pill.current
    if (!box || !pl || tier === "lite" || !finePointer()) return
    const over = (e: PointerEvent) => {
      const items = Array.from(box.querySelectorAll<HTMLElement>(itemSelector)).filter((n) => n !== pl)
      const it = items.find((n) => n.contains(e.target as Node))
      if (!it) return
      const b = box.getBoundingClientRect(), r = it.getBoundingClientRect()
      pl.style.width = r.width + "px"; pl.style.height = r.height + "px"
      pl.style.transform = `translate3d(${r.left - b.left}px,${r.top - b.top}px,0)`
      box.dataset.slideOn = ""
    }
    const out = () => { delete box.dataset.slideOn }
    box.addEventListener("pointerover", over); box.addEventListener("pointerleave", out)
    return () => { box.removeEventListener("pointerover", over); box.removeEventListener("pointerleave", out) }
  }, [tier, itemSelector])
  return <div ref={ref} className={cn("vks-slide relative isolate", className)} {...p}><span ref={pill} aria-hidden className="vks-slide-pill" />{children}</div>
}

/** Use for a landing or login area only: a gold ring trails the cursor and grows over buttons and links. Never on work screens, where staff need the normal precise cursor. */
export function CursorRing({ className, children, ...p }: React.HTMLAttributes<HTMLDivElement>) {
  const ref = React.useRef<HTMLDivElement>(null), ring = React.useRef<HTMLSpanElement>(null), dot = React.useRef<HTMLSpanElement>(null)
  const { tier } = usePerf()
  const [on, setOn] = React.useState(false)
  React.useEffect(() => {
    const box = ref.current, rg = ring.current, dt = dot.current
    if (!box || !rg || !dt || tier === "lite" || !finePointer()) { setOn(false); return }
    setOn(true)
    let tx = 0, ty = 0, x = 0, y = 0, raf = 0, live = false
    const loop = () => {
      x += (tx - x) * 0.2; y += (ty - y) * 0.2
      rg.style.transform = `translate3d(${x}px,${y}px,0)`
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.3 ? requestAnimationFrame(loop) : 0
    }
    const move = (e: PointerEvent) => {
      const b = box.getBoundingClientRect(); tx = e.clientX - b.left; ty = e.clientY - b.top
      if (!live) { x = tx; y = ty; live = true; box.dataset.cursorOn = "" }
      dt.style.transform = `translate3d(${tx}px,${ty}px,0)`
      rg.dataset.big = (e.target as Element).closest("a,button,[role=button],input,select,textarea,label") ? "1" : ""
      if (!raf) raf = requestAnimationFrame(loop)
    }
    const leave = () => { live = false; delete box.dataset.cursorOn }
    box.addEventListener("pointermove", move); box.addEventListener("pointerleave", leave)
    return () => { cancelAnimationFrame(raf); box.removeEventListener("pointermove", move); box.removeEventListener("pointerleave", leave) }
  }, [tier])
  return <div ref={ref} className={cn("relative", on && "vks-cursor-area", className)} {...p}>
    {children}
    <span ref={ring} aria-hidden className="vks-cursor-ring"><i /></span><span ref={dot} aria-hidden className="vks-cursor-dot" />
  </div>
}
