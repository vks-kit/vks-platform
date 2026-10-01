import * as React from "react"
import { cn } from "./cn"

export type IndicatorBox = { x: number; y: number; w: number; h: number }

/**
 * Measures the active child of a container so a single absolutely-positioned pill can
 * spring between items (iOS segmented control / tab bar). Re-measures when the active
 * attribute changes and when the container resizes. First placement does not animate.
 * selector: CSS for the active item, e.g. "[data-state=active]" or "[aria-current=page]".
 */
export function useIndicator<T extends HTMLElement>(selector: string, deps: React.DependencyList = []) {
  const ref = React.useRef<T>(null)
  const [box, setBox] = React.useState<IndicatorBox | null>(null)
  const [anim, setAnim] = React.useState(false)
  const measure = React.useCallback(() => {
    const root = ref.current; if (!root) return
    const el = root.querySelector<HTMLElement>(selector)
    if (!el) { setBox(null); return }
    let x = 0, y = 0, n: HTMLElement | null = el
    // walk up to the container so nested wrappers (e.g. <li>) still work
    while (n && n !== root) { x += n.offsetLeft; y += n.offsetTop; n = n.offsetParent as HTMLElement | null; if (n && !root.contains(n)) break }
    setBox((b) => (b && b.x === x && b.y === y && b.w === el.offsetWidth && b.h === el.offsetHeight ? b : { x, y, w: el.offsetWidth, h: el.offsetHeight }))
  }, [selector])
  React.useLayoutEffect(() => {
    measure()
    const root = ref.current; if (!root) return
    const mo = new MutationObserver(measure); mo.observe(root, { subtree: true, attributes: true, attributeFilter: ["data-state", "aria-current", "aria-selected"] })
    const ro = new ResizeObserver(measure); ro.observe(root)
    const id = requestAnimationFrame(() => setAnim(true))
    return () => { mo.disconnect(); ro.disconnect(); cancelAnimationFrame(id) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [measure, ...deps])
  return { ref, box, anim, measure }
}

/** The pill itself. Put it as the first child of the measured container (which must be position:relative). */
export function Indicator({ box, anim, className, vertical }: { box: IndicatorBox | null; anim: boolean; className?: string; vertical?: boolean }) {
  if (!box) return null
  return <span aria-hidden data-anim={anim} className={cn("vks-ind", className)}
    style={vertical ? { width: box.w, height: box.h, transform: `translate3d(${box.x}px,${box.y}px,0)` } : { width: box.w, height: box.h, transform: `translate3d(${box.x}px,${box.y}px,0)` }} />
}
