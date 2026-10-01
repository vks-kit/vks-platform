import * as React from "react"

/**
 * FLIP: when a re-render moves this element inside its parent (a sibling was
 * removed, added or changed width), glide it from the old spot to the new one
 * with a transform-only spring instead of jumping. Needs no wrapper: the
 * parent re-renders on the change, so every child measures itself.
 * Positions use offsetLeft/Top, so in-flight transforms never skew them.
 */
export function useFlip<T extends HTMLElement>(ref: React.RefObject<T | null>, opts: { duration?: number; disabled?: boolean } = {}) {
  const last = React.useRef<{ x: number; y: number } | null>(null)
  React.useLayoutEffect(() => {
    const el = ref.current
    if (!el || opts.disabled) return
    const p = el.parentElement
    const own = el.offsetParent === p
    const now = { x: el.offsetLeft - (own || !p ? 0 : p.offsetLeft), y: el.offsetTop - (own || !p ? 0 : p.offsetTop) }
    const prev = last.current
    last.current = now
    if (!prev) return
    const dx = prev.x - now.x, dy = prev.y - now.y
    if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) return
    if (typeof el.animate !== "function" || matchMedia("(prefers-reduced-motion: reduce)").matches) return
    el.animate(
      [{ transform: `translate3d(${dx}px,${dy}px,0)` }, { transform: "translate3d(0,0,0)" }],
      { duration: opts.duration ?? 420, easing: "cubic-bezier(.34,1.3,.64,1)", composite: "add" },
    )
  })
}
