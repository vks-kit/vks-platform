import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "../lib/cn"
import { Button } from "./button"

/**
 * Step dots + current step content + Back/Next. Controlled: you own "step".
 * The connector fills as you advance, the current dot pops with a halo, done dots turn into a drawn tick,
 * and the content slides in from the side you are moving towards.
 */
export function Wizard({ steps, step, onStep, onFinish, canNext = true, finishLabel = "Done", nextLabel = "Next", backLabel = "Back", busy, children, className }: {
  steps: string[]; step: number; onStep: (n: number) => void; onFinish: () => void; canNext?: boolean
  finishLabel?: string; nextLabel?: string; backLabel?: string; busy?: boolean; children: React.ReactNode; className?: string
}) {
  const last = step === steps.length - 1
  const prev = React.useRef(step), dir = step >= prev.current ? "next" : "prev"
  React.useEffect(() => { prev.current = step }, [step])
  const pct = steps.length > 1 ? step / (steps.length - 1) : 1
  return (
    <div className={cn("space-y-5", className)}>
      <div className="relative">
        {/* track sits behind the dots, inset by half a column on each side so it runs dot-centre to dot-centre */}
        <div className="absolute top-4 h-1 -translate-y-1/2 overflow-hidden rounded-full bg-muted" style={{ left: 50 / steps.length + "%", right: 50 / steps.length + "%" }}>
          <div className="vks-fill-x h-full rounded-full bg-success" style={{ transform: `scaleX(${pct})` }} />
        </div>
        <ol className="relative flex items-start" aria-label="steps">
          {steps.map((s, i) => {
            const done = i < step, cur = i === step
            return (
              <li key={s} className="flex flex-1 flex-col items-center gap-1.5" aria-current={cur ? "step" : undefined}>
                <span className={cn("relative flex size-8 items-center justify-center rounded-full text-sm font-bold ring-4 ring-background transition-[background-color,color] duration-300",
                  done ? "bg-success text-success-foreground" : cur ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>
                  {cur && <span key={step} className="vks-pulse absolute inset-0 rounded-full bg-primary/30" />}
                  {done
                    ? <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round"><path className="vks-check-draw" d="M5.5 12.5l4.2 4.2 8.8-9.4" /></svg>
                    : <span key={cur ? "c" + step : "n"} className={cn("relative", cur && "vks-pop")}>{i + 1}</span>}
                </span>
                <span className={cn("px-1 text-center text-[11px] font-semibold leading-snug transition-colors duration-300", cur ? "text-foreground" : "text-muted-foreground")}>{s}</span>
              </li>
            )
          })}
        </ol>
      </div>
      <div className="overflow-hidden"><div key={step} className={dir === "next" ? "vks-step-next" : "vks-step-prev"}>{children}</div></div>
      <div className="flex justify-between gap-2">
        <Button variant="outline" disabled={step === 0 || busy} onClick={() => onStep(step - 1)}>{backLabel}</Button>
        <Button variant={last ? "action" : "default"} disabled={!canNext} loading={busy} onClick={() => (last ? onFinish() : onStep(step + 1))}>{last ? finishLabel : nextLabel}</Button>
      </div>
    </div>
  )
}

/** Thin progress for long single-page forms or uploads: "Step 2 of 5" + filling bar. */
export function StepProgress({ step, total, label, className }: { step: number; total: number; label?: string; className?: string }) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex justify-between text-xs font-semibold text-muted-foreground"><span>{label}</span><span className="tabular-nums">{step} / {total}</span></div>
      <div className="h-1.5 overflow-hidden rounded-full bg-muted"><div className="vks-fill-x h-full rounded-full bg-success" style={{ transform: `scaleX(${Math.min(1, step / total)})` }} /></div>
    </div>
  )
}
