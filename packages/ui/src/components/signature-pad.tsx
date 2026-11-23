import * as React from "react"
import { Eraser } from "lucide-react"
import { cn } from "../lib/cn"
import { Button } from "./button"

export type SignaturePadHandle = { clear: () => void; isEmpty: () => boolean; toDataURL: () => string }
/** Draw with finger or mouse. toDataURL() gives a PNG. Uses pointer events + touch-action:none so the page does not scroll while signing. */
export function SignaturePad({ height = 180, onChange, className, clearLabel = "ລ້າງ", ref }: {
  height?: number; onChange?: (empty: boolean) => void; className?: string; clearLabel?: string
  /** React 19: a plain prop (no forwardRef). Gives clear(), isEmpty() and toDataURL(). */
  ref?: React.Ref<SignaturePadHandle>
}) {
    const cv = React.useRef<HTMLCanvasElement>(null), drawing = React.useRef(false), empty = React.useRef(true)
    const ctx = () => cv.current!.getContext("2d")!
    const fit = React.useCallback(() => {
      const c = cv.current; if (!c) return
      const r = c.getBoundingClientRect(), dpr = window.devicePixelRatio || 1
      c.width = r.width * dpr; c.height = height * dpr
      const g = ctx(); g.scale(dpr, dpr); g.lineWidth = 2.5; g.lineCap = "round"; g.lineJoin = "round"; g.strokeStyle = "#14173d"
    }, [height])
    React.useEffect(() => { fit() }, [fit])
    const pos = (e: React.PointerEvent) => { const r = cv.current!.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top] as const }
    const clear = () => { const c = cv.current!; ctx().clearRect(0, 0, c.width, c.height); empty.current = true; onChange?.(true) }
    React.useImperativeHandle(ref, () => ({ clear, isEmpty: () => empty.current, toDataURL: () => cv.current!.toDataURL("image/png") }))
    return (
      <div className={cn("space-y-2", className)}>
        <div className="relative overflow-hidden rounded-lg border-2 border-dashed border-input bg-white">
          <canvas ref={cv} style={{ height, touchAction: "none" }} className="block w-full cursor-crosshair"
            onPointerDown={(e) => { drawing.current = true; cv.current!.setPointerCapture(e.pointerId); const [x, y] = pos(e); ctx().beginPath(); ctx().moveTo(x, y) }}
            onPointerMove={(e) => { if (!drawing.current) return; const [x, y] = pos(e); ctx().lineTo(x, y); ctx().stroke(); if (empty.current) { empty.current = false; onChange?.(false) } }}
            onPointerUp={() => { drawing.current = false }} onPointerCancel={() => { drawing.current = false }} />
          <div className="pointer-events-none absolute inset-x-6 bottom-8 border-b border-slate-300" />
        </div>
        <Button type="button" variant="ghost" size="sm" onClick={clear}><Eraser />{clearLabel}</Button>
      </div>
    )
}
