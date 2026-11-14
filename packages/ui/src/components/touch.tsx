import * as React from "react"
import { Loader2, ArrowDown, Trash2 } from "lucide-react"
import { cn } from "../lib/cn"

/** Pull down at the top of the page to refresh. Touch only, ignores mouse. Threshold 70 px. */
export function PullToRefresh({ onRefresh, children, className }: { onRefresh: () => Promise<unknown> | void; children: React.ReactNode; className?: string }) {
  const [dy, setDy] = React.useState(0), [busy, setBusy] = React.useState(false), y0 = React.useRef<number | null>(null)
  const T = 70
  return (
    <div className={cn("relative", className)}
      onTouchStart={(e) => { if (window.scrollY <= 0 && !busy) y0.current = e.touches[0].clientY }}
      onTouchMove={(e) => { if (y0.current === null) return; const d = e.touches[0].clientY - y0.current; if (d > 0) setDy(Math.min(110, d * 0.5)); else { y0.current = null; setDy(0) } }}
      onTouchEnd={async () => { if (y0.current === null) return; y0.current = null; if (dy >= T * 0.5) { setBusy(true); setDy(T * 0.5); try { await onRefresh() } finally { setBusy(false); setDy(0) } } else setDy(0) }}>
      <div aria-hidden className="pointer-events-none absolute inset-x-0 -top-10 flex h-10 items-center justify-center text-muted-foreground" style={{ transform: "translateY(" + dy + "px)", opacity: Math.min(1, dy / 30) }}>
        {busy ? <Loader2 className="vks-spin size-5" /> : <ArrowDown className="size-5 transition-transform" style={{ transform: "rotate(" + (dy >= T * 0.5 ? 180 : 0) + "deg)" }} />}
      </div>
      <div style={{ transform: "translateY(" + dy + "px)", transition: y0.current === null ? "transform .2s" : undefined }}>{children}</div>
    </div>
  )
}

/** Row you can swipe left to reveal an action (delete, call). Snaps open past 40%. Tap the action to run it. */
export function SwipeRow({ children, actionLabel = "ລຶບ", onAction, icon = <Trash2 className="size-5" />, className }: { children: React.ReactNode; actionLabel?: string; onAction: () => void; icon?: React.ReactNode; className?: string }) {
  const W = 88, [x, setX] = React.useState(0), [drag, setDrag] = React.useState(false), s = React.useRef<{ x: number; base: number } | null>(null)
  return (
    // min-w-0 + w-full: never wider than its list (in a grid or flex list it otherwise grew to its content, past the screen)
    <div className={cn("relative w-full min-w-0 max-w-full overflow-hidden rounded-xl", className)}>
      <button type="button" onClick={() => { setX(0); onAction() }} tabIndex={x === 0 ? -1 : 0} aria-label={actionLabel} className="absolute inset-y-0 right-0 flex flex-col items-center justify-center gap-1 bg-destructive text-xs font-semibold text-destructive-foreground" style={{ width: W }}>{icon}{actionLabel}</button>
      <div className="relative min-w-0 bg-card" style={{ transform: "translateX(" + x + "px)", transition: drag ? "none" : "transform .2s ease-out", touchAction: "pan-y" }}
        onTouchStart={(e) => { s.current = { x: e.touches[0].clientX, base: x }; setDrag(true) }}
        onTouchMove={(e) => { if (!s.current) return; setX(Math.max(-W, Math.min(0, s.current.base + e.touches[0].clientX - s.current.x))) }}
        onTouchEnd={() => { setDrag(false); setX(x < -W * 0.4 ? -W : 0); s.current = null }}>{children}</div>
    </div>
  )
}
