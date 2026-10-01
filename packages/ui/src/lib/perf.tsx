import * as React from "react"

/**
 * Performance tier. "full" = every effect (blur, sheen, aurora, glow, spring).
 * "lite" = cheap Android mode: no backdrop blur, no infinite / decorative animation,
 * flat shadows, shorter transitions. "auto" picks from the device on first load.
 * The resolved tier is written to <html data-perf="full|lite"> so CSS can react.
 */
export type PerfMode = "auto" | "full" | "lite"
export type PerfTier = "full" | "lite"
const KEY = "vks-perf"

/** Guess the tier from what the browser exposes. Conservative: only clearly weak devices get "lite". */
export function detectPerfTier(): PerfTier {
  if (typeof window === "undefined") return "full"
  try {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "lite"
    const n = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } }
    if (n.connection?.saveData) return "lite"
    if (typeof n.deviceMemory === "number" && n.deviceMemory <= 3) return "lite"
    if (typeof n.hardwareConcurrency === "number" && n.hardwareConcurrency <= 4 && (n.deviceMemory ?? 8) <= 4) return "lite"
  } catch { /* old browser: assume fine */ }
  return "full"
}

const read = (): PerfMode => { try { const v = localStorage.getItem(KEY); return v === "full" || v === "lite" ? v : "auto" } catch { return "auto" } }
const resolve = (m: PerfMode): PerfTier => (m === "auto" ? detectPerfTier() : m)
const apply = (t: PerfTier) => { if (typeof document !== "undefined") document.documentElement.dataset.perf = t }

/** Call once before React renders (main.tsx) so the first paint already has the right tier. */
export function initPerf() { apply(resolve(read())) }

const Ctx = React.createContext<{ mode: PerfMode; tier: PerfTier; setMode: (m: PerfMode) => void }>({ mode: "auto", tier: "full", setMode: () => {} })

export function PerfProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = React.useState<PerfMode>(read)
  const [tier, setTier] = React.useState<PerfTier>(() => resolve(read()))
  React.useEffect(() => {
    const t = resolve(mode); setTier(t); apply(t)
    if (mode !== "auto") return
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    const f = () => { const x = detectPerfTier(); setTier(x); apply(x) }
    mq.addEventListener("change", f); return () => mq.removeEventListener("change", f)
  }, [mode])
  const setMode = React.useCallback((m: PerfMode) => { try { m === "auto" ? localStorage.removeItem(KEY) : localStorage.setItem(KEY, m) } catch { /* private mode */ } setModeState(m) }, [])
  return <Ctx.Provider value={{ mode, tier, setMode }}>{children}</Ctx.Provider>
}
/** { mode, tier, setMode }. Use tier === "lite" to skip JS-driven effects (e.g. parallax, confetti). */
export const usePerf = () => React.useContext(Ctx)
