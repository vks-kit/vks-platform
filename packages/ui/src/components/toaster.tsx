import * as React from "react"
import { Toaster as Sonner, toast as sonner } from "sonner"
import { Check, X, TriangleAlert, Info, LoaderCircle } from "lucide-react"
import { haptics } from "@vks/core"
import { useTheme } from "../lib/theme"

type PromiseArg = Parameters<typeof sonner.promise>[0]

/** Same as sonner's toast, plus a buzz on success / error (and when a toast.promise settles) so a guard feels it without looking. */
export const toast = Object.assign(((...a: Parameters<typeof sonner>) => sonner(...a)) as typeof sonner, sonner, {
  success: ((m: Parameters<typeof sonner.success>[0], o?: Parameters<typeof sonner.success>[1]) => { haptics.success(); return sonner.success(m, o) }) as typeof sonner.success,
  error: ((m: Parameters<typeof sonner.error>[0], o?: Parameters<typeof sonner.error>[1]) => { haptics.error(); return sonner.error(m, o) }) as typeof sonner.error,
  warning: ((m: Parameters<typeof sonner.warning>[0], o?: Parameters<typeof sonner.warning>[1]) => { haptics.error(); return sonner.warning(m, o) }) as typeof sonner.warning,
  promise: (<T,>(p: PromiseArg, data?: Parameters<typeof sonner.promise>[1]) => {
    const run = (typeof p === "function" ? (p as () => Promise<T>)() : p) as Promise<T>
    run.then(() => haptics.success(), () => haptics.error())
    return sonner.promise(run, data)
  }) as typeof sonner.promise,
})

/** Toast lifetime in ms; the drain bar under each toast runs for exactly this long. */
const DURATION = 4000
const badge = (icon: React.ReactNode, bar = true) => <><span className="vks-tb">{icon}</span>{bar && <span className="vks-tbar" aria-hidden />}</>
const icons = {
  success: badge(<Check strokeWidth={3} />), error: badge(<X strokeWidth={3} />), warning: badge(<TriangleAlert strokeWidth={2.5} />),
  info: badge(<Info strokeWidth={2.5} />), loading: badge(<LoaderCircle strokeWidth={2.5} className="animate-spin" />, false),
}

/** Use once at the app root so toast() messages can appear (follows the theme). Then call toast.success / toast.error / toast.promise anywhere. For an inline persistent message use Alert instead; for an iOS push-style banner use Banner instead. */
export function Toaster() {
  const { theme } = useTheme()
  return (
    <Sonner theme={theme} position="top-center" offset="max(1rem, env(safe-area-inset-top))" mobileOffset="max(0.75rem, env(safe-area-inset-top))" closeButton
      duration={DURATION} icons={icons} toastOptions={{ className: "vks-toast" }}
      style={{ fontFamily: "var(--font-sans)", "--vks-toast-dur": DURATION + "ms", "--normal-bg": "var(--popover)", "--normal-text": "var(--popover-foreground)", "--normal-border": "var(--border)", "--success-bg": "var(--popover)", "--success-text": "var(--popover-foreground)", "--success-border": "var(--border)", "--error-bg": "var(--popover)", "--error-text": "var(--popover-foreground)", "--error-border": "var(--border)", "--warning-bg": "var(--popover)", "--warning-text": "var(--popover-foreground)", "--warning-border": "var(--border)", "--info-bg": "var(--popover)", "--info-text": "var(--popover-foreground)", "--info-border": "var(--border)" } as React.CSSProperties} />
  )
}
