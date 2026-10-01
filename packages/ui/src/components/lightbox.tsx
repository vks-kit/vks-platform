import * as React from "react"
import { Dialog as D } from "radix-ui"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { cn } from "../lib/cn"

export type LightboxImage = { src: string; caption?: string; thumb?: string }

/**
 * iOS Photos-style viewer.
 * - opens with a spring zoom over a fading black backdrop, chrome fades in after
 * - tap anywhere outside the photo (or Esc / X) to close; drag the photo down to dismiss
 * - swipe left / right or arrow keys to move; the new photo slides in from that side
 * - with 2+ photos a thumbnail strip sits bottom-right (full width on phones), current one lifts
 * - double-tap / double-click zooms 2x
 */
export function Lightbox({ images, index, onIndex, onClose }: { images: LightboxImage[]; index: number | null; onIndex: (i: number) => void; onClose: () => void }) {
  const open = index !== null, n = images.length
  const [shown, setShown] = React.useState(index ?? 0)          // keep last photo on screen during the close animation
  const [dir, setDir] = React.useState<"next" | "prev" | null>(null)
  const [drag, setDrag] = React.useState<{ x: number; y: number } | null>(null)
  const [zoom, setZoom] = React.useState(false)
  const start = React.useRef<{ x: number; y: number; t: number } | null>(null)
  const strip = React.useRef<HTMLDivElement>(null)
  React.useEffect(() => { if (index !== null) { setDir(index > shown || (shown === n - 1 && index === 0) ? "next" : "prev"); setShown(index); setZoom(false) } }, [index]) // eslint-disable-line react-hooks/exhaustive-deps
  React.useEffect(() => { if (open) setDir(null) }, [open])
  const go = React.useCallback((d: 1 | -1) => { if (index === null || n < 2) return; onIndex((index + d + n) % n) }, [index, n, onIndex])
  React.useEffect(() => {
    if (!open) return
    const f = (e: KeyboardEvent) => { if (e.key === "ArrowRight") go(1); if (e.key === "ArrowLeft") go(-1) }
    window.addEventListener("keydown", f); return () => window.removeEventListener("keydown", f)
  }, [open, go])
  React.useEffect(() => { strip.current?.querySelector<HTMLElement>("[aria-current=true]")?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" }) }, [shown, open])

  const cur = images[shown]
  const down = (e: React.PointerEvent) => { if (zoom) return; start.current = { x: e.clientX, y: e.clientY, t: performance.now() }; (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId) }
  const move = (e: React.PointerEvent) => { if (!start.current) return; const dx = e.clientX - start.current.x, dy = e.clientY - start.current.y; setDrag(Math.abs(dx) > Math.abs(dy) ? { x: dx, y: 0 } : { x: 0, y: Math.max(0, dy) }) }
  const up = () => {
    const s = start.current, d = drag; start.current = null; setDrag(null); if (!s || !d) return
    const fast = performance.now() - s.t < 250
    if (d.y > 120 || (fast && d.y > 50)) onClose()
    else if (d.x < -70 || (fast && d.x < -30)) go(1)
    else if (d.x > 70 || (fast && d.x > 30)) go(-1)
  }
  const pull = drag ? Math.min(1, drag.y / 300) : 0
  const chromeBtn = "vks-press flex size-11 items-center justify-center rounded-full vks-glass-dark text-white hover:bg-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 [&_svg]:size-5"

  return (
    <D.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <D.Portal>
        <D.Overlay className="vks-lb fixed inset-0 z-50 bg-black" style={{ opacity: 1 - pull * 0.8 }} />
        <D.Content aria-describedby={undefined} className="vks-lb fixed inset-0 z-50 select-none overflow-hidden text-white focus:outline-none"
          onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
          <D.Title className="sr-only">{cur?.caption ?? "photo"}</D.Title>

          {/* photo stage: clicks on the empty area around the photo close it */}
          <div className="vks-lb-stage absolute inset-0 flex items-center justify-center px-2 pb-[calc(6rem+env(safe-area-inset-bottom))] pt-[calc(4rem+env(safe-area-inset-top))] md:px-20 md:pb-24"
            onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
            {cur && <img key={shown} src={cur.src} alt={cur.caption ?? ""} draggable={false}
              onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}
              onDoubleClick={() => setZoom((z) => !z)}
              data-dragging={!!drag}
              className={cn("vks-lb-img max-h-full max-w-full touch-none rounded-lg object-contain shadow-[0_30px_80px_-20px_rgb(0_0_0/.8)]", dir === "next" && "vks-lb-next", dir === "prev" && "vks-lb-prev", zoom ? "cursor-zoom-out" : "cursor-zoom-in")}
              style={{ transform: drag ? `translate3d(${drag.x}px,${drag.y}px,0) scale(${1 - pull * 0.25})` : zoom ? "scale(2)" : undefined }} />}
          </div>

          {/* chrome */}
          <div className="vks-lb-chrome pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between p-3 pt-[max(0.75rem,env(safe-area-inset-top))]" style={{ opacity: 1 - pull * 2 }}>
            {n > 1 ? <span className="pointer-events-auto rounded-full vks-glass-dark px-3.5 py-1.5 text-sm font-semibold tabular-nums">{shown + 1} / {n}</span> : <span />}
            <button aria-label="ປິດ" onClick={onClose} className={cn(chromeBtn, "pointer-events-auto")}><X /></button>
          </div>
          {n > 1 && <>
            <button aria-label="previous" onClick={() => go(-1)} className={cn(chromeBtn, "vks-lb-chrome absolute left-4 top-1/2 hidden -translate-y-1/2 md:flex")}><ChevronLeft /></button>
            <button aria-label="next" onClick={() => go(1)} className={cn(chromeBtn, "vks-lb-chrome absolute right-4 top-1/2 hidden -translate-y-1/2 md:flex")}><ChevronRight /></button>
          </>}

          <div className="vks-lb-chrome pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-center gap-3 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:flex-row md:items-end md:justify-between md:p-5" style={{ opacity: 1 - pull * 2 }}>
            {cur?.caption ? <p key={shown} className="vks-fade-up pointer-events-auto max-w-[min(36rem,100%)] rounded-2xl vks-glass-dark px-4 py-2 text-center text-sm leading-relaxed md:text-left">{cur.caption}</p> : <span />}
            {n > 1 && (
              <div ref={strip} className="pointer-events-auto flex max-w-full gap-1.5 overflow-x-auto rounded-2xl vks-glass-dark p-1.5 [scrollbar-width:none] md:max-w-[26rem]">
                {images.map((im, i) => (
                  <button key={i} aria-label={"photo " + (i + 1)} aria-current={i === shown} onClick={() => onIndex(i)}
                    className={cn("vks-lb-thumb relative size-12 shrink-0 overflow-hidden rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white", i === shown ? "-translate-y-0.5 scale-105 opacity-100 ring-2 ring-white" : "opacity-55 hover:opacity-90")}>
                    <img src={im.thumb ?? im.src} alt="" loading="lazy" draggable={false} className="size-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </D.Content>
      </D.Portal>
    </D.Root>
  )
}

/** Thumbnail grid that opens a Lightbox. Handy default for evidence photos on a report. */
export function PhotoGrid({ images, className, cols = 3 }: { images: LightboxImage[]; className?: string; cols?: 2 | 3 | 4 }) {
  const [i, setI] = React.useState<number | null>(null)
  const grid = { 2: "grid-cols-2", 3: "grid-cols-3", 4: "grid-cols-4" }[cols]
  return (
    <>
      <div className={cn("grid gap-1.5", grid, className)}>
        {images.map((im, k) => (
          <button key={k} onClick={() => setI(k)} className="vks-press group relative aspect-square overflow-hidden rounded-xl bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <img src={im.thumb ?? im.src} alt={im.caption ?? ""} loading="lazy" className="size-full object-cover transition-transform duration-500 ease-[var(--ease-ios)] group-hover:scale-105" />
          </button>
        ))}
      </div>
      <Lightbox images={images} index={i} onIndex={setI} onClose={() => setI(null)} />
    </>
  )
}
