import * as React from "react"
import { ChevronRight, ShieldCheck, LogOut } from "lucide-react"
import { cn } from "../lib/cn"
import { Logo, BRAND } from "./logo"
import { Avatar, type AvatarStatus } from "./data-display"
import { usePointerVars, ParallaxLayer, CursorRing } from "./hover-fx"

/**
 * Use for a full-page premium sign-in: brand panel on the left of a desktop, centred form on a phone.
 * For a small centred card inside an existing page use LoginCard instead.
 */
export function LoginScreen({ title, subtitle, children, footer, tagline, features, brand = BRAND.name, className, cursorRing }: {
  title: string; subtitle?: string; children: React.ReactNode; footer?: React.ReactNode
  tagline?: string; features?: { icon?: React.ReactNode; label: string }[]; brand?: string; className?: string
  /** Desktop only: a gold ring trails the cursor over the whole screen. Off by default. */
  cursorRing?: boolean
}) {
  const aside = React.useRef<HTMLElement>(null)
  usePointerVars(aside)
  const Root = cursorRing ? CursorRing : "div"
  return (
    <Root className={cn("grid min-h-dvh bg-background md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]", className)}>
      <aside ref={aside} className="vks-parallax relative isolate hidden flex-col justify-between overflow-hidden bg-bar p-12 text-bar-foreground md:flex">
        <ParallaxLayer depth={10} aria-hidden className="absolute -inset-6 -z-10"><div className="vks-li-aurora absolute inset-0" style={{ backgroundImage: "radial-gradient(70% 60% at 85% 0%, color-mix(in oklab, var(--gold) 30%, transparent), transparent 65%), radial-gradient(60% 50% at 0% 100%, color-mix(in oklab, var(--gold) 12%, transparent), transparent 70%)" }} /></ParallaxLayer>
        <ParallaxLayer depth={-22} aria-hidden className="absolute inset-0 -z-10"><span className="vks-li-orb -right-24 top-1/4 size-80" /></ParallaxLayer>
        <ParallaxLayer depth={16} aria-hidden className="absolute inset-0 -z-10"><span className="vks-li-orb -left-20 bottom-10 size-64 opacity-60" /></ParallaxLayer>
        <div className="vks-hairline vks-li-line absolute inset-x-0 top-0" style={{ "--d": "150ms" } as React.CSSProperties} />
        <div className="relative flex items-center gap-3">
          <span className="relative"><span className="vks-li vks-li-pop block" style={{ "--d": "200ms" } as React.CSSProperties}><Logo className="size-12" /></span><span aria-hidden className="vks-li-ring" style={{ "--d": "650ms" } as React.CSSProperties} /><span aria-hidden className="vks-li-ring" style={{ "--d": "650ms" } as React.CSSProperties} /></span>
          <span className="vks-li vks-li-left text-xs font-bold tracking-[.25em] opacity-80" style={{ "--d": "420ms" } as React.CSSProperties}>{brand.toUpperCase()}</span>
        </div>
        <div className="relative max-w-md space-y-6">
          <h2 className="vks-li text-4xl font-bold leading-tight tracking-tight" style={{ "--d": "480ms" } as React.CSSProperties}>{tagline ?? title}</h2>
          <div className="vks-hairline vks-li-line w-24 opacity-70" style={{ "--d": "640ms", transformOrigin: "0 50%" } as React.CSSProperties} />
          {features && <ul className="space-y-3">{features.map((f, i) => (
            <li key={f.label} className="vks-li vks-li-left flex items-center gap-3 text-sm leading-relaxed opacity-90" style={{ "--d": 700 + i * 90 + "ms" } as React.CSSProperties}>
              <span className="vks-li vks-li-pop flex size-9 items-center justify-center rounded-xl bg-gold/20 text-gold ring-1 ring-gold/25 [&_svg]:size-4" style={{ "--d": 760 + i * 90 + "ms" } as React.CSSProperties}>{f.icon ?? <ShieldCheck />}</span>{f.label}
            </li>))}</ul>}
        </div>
        <div className="vks-li vks-li-fade relative text-xs opacity-60" style={{ "--d": "1000ms" } as React.CSSProperties}>© {new Date().getFullYear()} {brand}</div>
      </aside>
      <main className="relative isolate flex min-h-dvh flex-col justify-center overflow-hidden px-6 py-10 pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-[max(2.5rem,env(safe-area-inset-top))] md:px-16">
        <div aria-hidden className="vks-li-aurora absolute inset-x-0 top-0 -z-10 h-80 md:hidden" style={{ backgroundImage: "radial-gradient(80% 70% at 50% 0%, color-mix(in oklab, var(--gold) 22%, transparent), transparent 70%)", transformOrigin: "50% 0%" }} />
        <div className="vks-li-cta mx-auto w-full max-w-sm space-y-7">
          <div className="space-y-3 text-center md:text-left">
            <span className="relative mx-auto block size-16 md:hidden"><span className="vks-li vks-li-pop block" style={{ "--d": "80ms" } as React.CSSProperties}><Logo className="vks-logo-lift size-16" /></span><span aria-hidden className="vks-li-ring" style={{ "--d": "380ms" } as React.CSSProperties} /><span aria-hidden className="vks-li-ring" style={{ "--d": "380ms" } as React.CSSProperties} /></span>
            <div className="vks-li vks-li-fade text-[11px] font-bold tracking-[.25em] text-muted-foreground md:hidden" style={{ "--d": "260ms" } as React.CSSProperties}>{brand.toUpperCase()}</div>
            <h1 className="vks-li text-3xl font-bold leading-snug tracking-tight" style={{ "--d": "320ms" } as React.CSSProperties}>{title}</h1>
            {subtitle && <p className="vks-li text-sm leading-relaxed text-muted-foreground" style={{ "--d": "400ms" } as React.CSSProperties}>{subtitle}</p>}
          </div>
          <div className="vks-li-fields space-y-4" style={{ "--d": "480ms" } as React.CSSProperties}>{children}</div>
          {footer && <div className="vks-li vks-li-fade border-t border-border/60 pt-4 text-center text-xs text-muted-foreground md:text-left" style={{ "--d": "850ms" } as React.CSSProperties}>{footer}</div>}
        </div>
      </main>
    </Root>
  )
}

export type ProfileRow = { icon?: React.ReactNode; label: string; value?: React.ReactNode; trailing?: React.ReactNode; onPress?: () => void }
export type ProfileSection = { title?: string; rows: ProfileRow[] }
export type ProfileQuickAction = { icon: React.ReactNode; label: string; onPress?: () => void }

/**
 * Use for an employee or account profile page: two columns on a desktop (identity card + sections), one stacked column on a phone.
 * For a single avatar + name line use UserChip instead.
 */
export function ProfileView({ name, role, code, src, status, stats, sections, onSignOut, signOutLabel = "ອອກຈາກລະບົບ", actions, className, flush, variant = "banner", quickActions }: {
  name: string; role?: string; code?: string; src?: string; status?: AvatarStatus
  stats?: { label: string; value: React.ReactNode }[]; sections: ProfileSection[]
  onSignOut?: () => void; signOutLabel?: string; actions?: React.ReactNode; className?: string
  /** Phone only: the identity header runs edge to edge (no card border or corners) and the lists keep a single 16 px margin. Desktop is unchanged. */
  flush?: boolean
  /** Phone only: "actions" drops the banner for a soft header with a big avatar and round quick-action buttons (iOS contact card); implies flush. Desktop is unchanged. */
  variant?: "banner" | "actions"
  /** Round icon buttons under the name (call, message, edit…). Each button is 56 px with its label below. */
  quickActions?: ProfileQuickAction[]
}) {
  const qa = variant === "actions"
  flush = flush || qa
  return (
    // one minmax(0,1fr) column on a phone: a wide row (a segmented control, a long value) never pushes it past the screen
    <div className={cn("mx-auto grid w-full max-w-5xl grid-cols-[minmax(0,1fr)] gap-4 md:grid-cols-[19rem_minmax(0,1fr)] md:gap-6 [&>*]:min-w-0", className)}>
      <section className={cn("h-fit overflow-hidden bg-card md:sticky md:top-4 md:rounded-3xl md:border md:shadow-sm", qa ? "max-md:bg-gradient-to-b max-md:from-primary/10 max-md:to-transparent max-md:!bg-card/0" : flush ? "max-md:border-b" : "rounded-3xl border shadow-sm")}>
        <div className={cn("relative bg-bar md:h-28", qa ? "max-md:hidden" : flush ? "h-28" : "h-24")} style={{ backgroundImage: "radial-gradient(70% 60% at 85% 0%, color-mix(in oklab, var(--gold) 30%, transparent), transparent 65%), radial-gradient(60% 50% at 0% 100%, color-mix(in oklab, var(--gold) 12%, transparent), transparent 70%)" }}><div className="vks-hairline absolute inset-x-0 bottom-0" /></div>
        <div className={cn("-mt-12 space-y-3 pb-5 text-center", qa && "max-md:mt-0 max-md:pt-5", flush ? "px-4 md:px-5" : "px-5")}>
          <div className="flex justify-center"><span className="rounded-full bg-card p-1"><Avatar name={name} src={src} size={88} ring status={status} /></span></div>
          <div className="space-y-1"><h2 className="text-xl font-bold leading-snug">{name}</h2>
            {role && <p className="text-sm leading-relaxed text-muted-foreground">{role}</p>}
            {code && <p className="inline-block rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold tabular-nums text-muted-foreground">{code}</p>}</div>
          {quickActions && quickActions.length > 0 && <div className="flex justify-center gap-5 pt-1">
            {quickActions.map((a) => (
              <button key={a.label} type="button" onClick={a.onPress} className="vks-press group flex min-w-14 flex-col items-center gap-1.5">
                <span className="flex size-14 items-center justify-center rounded-full border bg-card text-primary shadow-sm transition-colors group-hover:bg-muted [&_svg]:size-5">{a.icon}</span>
                <span className="text-xs leading-snug text-muted-foreground">{a.label}</span>
              </button>))}</div>}
          {stats && stats.length > 0 && <div className={cn("grid auto-cols-fr grid-flow-col divide-x divide-border rounded-2xl py-3", qa ? "bg-muted/60 max-md:border max-md:bg-card" : "bg-muted/60")}>
            {stats.map((s) => <div key={s.label} className="px-2"><div className="text-lg font-bold tabular-nums">{s.value}</div><div className="text-[11px] leading-snug text-muted-foreground">{s.label}</div></div>)}</div>}
          {actions && <div className="flex flex-col gap-2 pt-1 [&>*]:max-md:min-h-11">{actions}</div>}
        </div>
      </section>
      <div className={cn("space-y-4 pb-6", flush && "max-md:px-4")}>
        {sections.map((s, i) => (
          <div key={i} className="space-y-1.5">
            {s.title && <h3 className="px-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">{s.title}</h3>}
            <div className="divide-y divide-border/70 overflow-hidden rounded-2xl border bg-card">
              {s.rows.map((r) => {
                const inner = (<>
                  {r.icon && <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary [&_svg]:size-4">{r.icon}</span>}
                  <span className="min-w-0 flex-1 truncate text-left font-medium">{r.label}</span>
                  {r.value && <span className="max-w-[45%] truncate text-sm text-muted-foreground">{r.value}</span>}
                  {r.trailing ?? (r.onPress && <ChevronRight className="size-4 text-muted-foreground" />)}
                </>)
                const cls = "flex min-h-14 w-full items-center gap-3 px-4 py-2"
                return r.onPress
                  ? <button key={r.label} type="button" onClick={r.onPress} className={cn(cls, "vks-press hover:bg-muted/50")}>{inner}</button>
                  : <div key={r.label} className={cls}>{inner}</div>
              })}
            </div>
          </div>
        ))}
        {onSignOut && <button type="button" onClick={onSignOut} className="vks-press flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl border bg-card font-semibold text-destructive hover:bg-destructive/5"><LogOut className="size-4" />{signOutLabel}</button>}
      </div>
    </div>
  )
}