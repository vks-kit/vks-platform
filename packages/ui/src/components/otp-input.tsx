import * as React from "react"
import { cn } from "../lib/cn"

/** N boxes, one hidden real input: keeps paste, autofill (one-time-code) and backspace working. */
export function OtpInput({ length = 6, value, onChange, onComplete, error, className, autoFocus }: { length?: number; value: string; onChange: (v: string) => void; onComplete?: (v: string) => void; error?: boolean; className?: string; autoFocus?: boolean }) {
  const ref = React.useRef<HTMLInputElement>(null), [focus, setFocus] = React.useState(false)
  const set = (raw: string) => { const v = raw.replace(/\D/g, "").slice(0, length); onChange(v); if (v.length === length) onComplete?.(v) }
  return (
    <div className={cn("relative inline-flex gap-2", error && "vks-shake", className)} onClick={() => ref.current?.focus()}>
      {Array.from({ length }, (_, i) => (
        <div key={i} className={cn("flex h-14 w-11 items-center justify-center rounded-lg border-2 bg-card text-2xl font-bold tabular-nums transition-colors",
          error ? "border-destructive" : focus && i === Math.min(value.length, length - 1) ? "border-gold" : "border-input")}>{value[i] ?? ""}</div>
      ))}
      <input ref={ref} value={value} onChange={(e) => set(e.target.value)} inputMode="numeric" autoComplete="one-time-code" autoFocus={autoFocus} aria-label="code"
        onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} className="absolute inset-0 h-full w-full opacity-0" maxLength={length} />
    </div>
  )
}
