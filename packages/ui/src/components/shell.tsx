import * as React from "react"
import { ChevronLeft, MoreHorizontal, Plus } from "lucide-react"
import { cn } from "../lib/cn"
import { haptics } from "@vks-kit/core"
import { useIndicator, Indicator } from "../lib/use-indicator"
import { Logo, BRAND } from "./logo"
import { PageBoundary } from "./feedback"
import { Sheet, SheetContent, SheetTitle, TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "./overlay"

export type NavItem = { id: string; label: string; icon: React.ReactNode; badge?: number }

const RAIL_KEY = "vks.rail"
/** Collapsed state that survives reloads. Controlled when `collapsed` is passed. */
function useRail(collapsed: boolean | undefined, defaultCollapsed: boolean, onChange?: (c: boolean) => void, persist?: boolean) {
  const [inner, setInner] = React.useState(() => {
    if (persist && typeof localStorage !== "undefined") { const v = localStorage.getItem(RAIL_KEY); if (v) return v === "1" }
    return defaultCollapsed
  })
  const value = collapsed ?? inner
  const set = React.useCallback((c: boolean) => {
    if (collapsed === undefined) setInner(c)
    if (persist) try { localStorage.setItem(RAIL_KEY, c ? "1" : "0") } catch {}
    onChange?.(c)
  }, [collapsed, onChange, persist])
  return [value, set] as const
}

/** Which way the page moved in the nav list: later item slides in from the right, earlier from the left. */
function useNavDirection(items: NavItem[], active: string) {
  const prev = React.useRef(active)
  const a = items.findIndex((i) => i.id === active), b = items.findIndex((i) => i.id === prev.current)
  const dir = a < b ? "back" : "fwd"
  React.useEffect(() => { prev.current = active }, [active])
  return dir
}

/**
 * One breakpoint, whole system pivots on it: 768 px (rule from vks-kit RESPONSIVE.md).
 * Desktop = sidebar rail (collapsible, remembered). Mobile = bottom nav, max 5 items, the rest under "More"; phoneHeader={false}
 * drops the top bar on a phone (when it would only repeat the nav); phoneProfile makes the profile page a bottom tab.
 * Pages slide in the direction you moved in the nav and a thin gold bar sweeps across the top.
 * Every page sits in a PageBoundary: a crash or a page file that will not load shows "reload", never a white screen.
 */
export function AppShell({ items, active, onNavigate, title = "VKS", header, children, fab, user, collapsible = true, phoneHeader = true, phoneProfile }: {
  items: NavItem[]; active: string; onNavigate: (id: string) => void; title?: string
  header?: React.ReactNode; children: React.ReactNode; fab?: React.ReactNode; user?: React.ReactNode
  /** Desktop rail can shrink to icons. Default true. */
  collapsible?: boolean
  /**
   * Phone: show the top header bar. Default true (0.5.x behaviour, apps that put a page title or back button there).
   * New apps: pass false when the bar would only repeat the nav and the date; the bottom nav is the frame on a phone.
   */
  phoneHeader?: boolean
  /**
   * Phone: the page that the desktop opens from the user chip under the sidebar (profile, theme, sign out) becomes the
   * last bottom-nav tab, e.g. { id: "profile", label: "ຂ້ອຍ", icon: <UserRound /> }. Without it a phone has no way to it.
   */
  phoneProfile?: NavItem
}) {
  const dir = useNavDirection(items, active)
  const phoneItems = phoneProfile ? [...items, phoneProfile] : items
  return (
    <div className="flex min-h-dvh overflow-x-clip bg-background">
      <Sidebar items={items} active={active} onNavigate={onNavigate} title={title} user={user} collapsible={collapsible} persist className="hidden md:flex" />
      <div className="relative flex min-w-0 flex-1 flex-col overflow-x-clip">
        {header && <header className={cn(!phoneHeader && "max-md:hidden", "vks-glass sticky top-0 z-30 flex items-center gap-3 border-b border-border/60 px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))] shadow-[0_10px_24px_-22px_rgb(20_23_61/.6)] md:px-6")}>
          <span aria-hidden className="vks-hairline pointer-events-none absolute inset-x-0 top-0 opacity-70" />{header}
          <span key={active} aria-hidden className="vks-route-bar pointer-events-none absolute inset-x-0 -bottom-px h-0.5 bg-gold" /></header>}
        <main key={active} className={cn("flex-1 p-4 pb-[calc(6.5rem+env(safe-area-inset-bottom))] md:p-6 md:pb-6", dir === "back" ? "vks-page-back" : "vks-page-fwd")}><PageBoundary resetKey={active}>{children}</PageBoundary></main>
      </div>
      {fab}
      <BottomNav items={phoneItems} active={active} onNavigate={onNavigate} className="md:hidden" />
    </div>
  )
}

type SidebarProps = {
  items: NavItem[]; active: string; onNavigate: (id: string) => void; title: string; user?: React.ReactNode; className?: string
  /** Show the collapse button (desktop). */
  collapsible?: boolean
  /** Controlled collapsed state. */
  collapsed?: boolean
  defaultCollapsed?: boolean
  onCollapsedChange?: (collapsed: boolean) => void
  /** Remember the collapsed state in localStorage ("vks.rail"). */
  persist?: boolean
}

/**
 * Dark rail. A soft pill with a gold edge springs between items, the active icon glows,
 * items stagger in, the logo spins in once. Collapsible to a 72 px icon rail: labels fade and
 * slide out, badges shrink to a gold dot and every item gets a tooltip.
 */
export function Sidebar({ items, active, onNavigate, title, user, className, collapsible, collapsed, defaultCollapsed = false, onCollapsedChange, persist }: SidebarProps) {
  const [mini, setMini] = useRail(collapsed, defaultCollapsed, onCollapsedChange, persist)
  const { ref, box, anim } = useIndicator<HTMLElement>("[aria-current=page]", [active, items.length, mini])
  const [pop, setPop] = React.useState<string | null>(null)
  return (
    <TooltipProvider delayDuration={120}>
      <aside data-collapsed={mini} className={cn("vks-rail sticky top-0 h-dvh shrink-0 flex-col gap-1 overflow-hidden bg-bar p-3 text-bar-foreground", mini ? "w-[4.5rem]" : "w-60", className)}>
        <div className="mb-3 flex h-12 items-center gap-2.5 px-1.5">
          <span className="vks-logo-in shrink-0"><Logo className="vks-logo-lift size-9" /></span>
          <b className="vks-rail-fade truncate whitespace-nowrap leading-tight tracking-tight">{title}</b>
        </div>
        <nav ref={ref} className="vks-rise-x relative flex flex-1 flex-col gap-1" aria-label="main">
          <Indicator box={box} anim={anim} className="rounded-xl bg-bar-foreground/[.12] shadow-[inset_0_1px_0_rgb(255_255_255/.08)] before:absolute before:left-0 before:top-1/2 before:h-6 before:w-[3px] before:-translate-y-1/2 before:rounded-r-full before:bg-gold before:content-['']" />
          {items.map((i, k) => {
            const on = active === i.id
            const btn = (
              <button key={i.id} style={{ ["--i" as string]: k } as React.CSSProperties} aria-label={mini ? i.label : undefined}
                onClick={() => { haptics.tap(); setPop(i.id + Date.now()); onNavigate(i.id) }} aria-current={on ? "page" : undefined}
                className={cn("vks-nav-item vks-press relative z-10 flex h-11 w-full items-center gap-3 whitespace-nowrap rounded-xl px-3.5 text-sm font-semibold transition-opacity duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold",
                  on ? "opacity-100" : "opacity-70 hover:opacity-100")}>
                <span className={cn("vks-nav-icon vks-nav-glow relative shrink-0 [&_svg]:size-5", on && "text-gold")}>
                  <span key={pop?.startsWith(i.id) ? pop : i.id} className={cn("block", pop?.startsWith(i.id) && "vks-icon-pop")}>{i.icon}</span>
                  {!!i.badge && <span aria-hidden className="vks-rail-dot absolute -right-1 -top-1 size-2.5 rounded-full bg-gold ring-2 ring-bar" />}
                </span>
                <span className="vks-rail-fade truncate">{i.label}</span>
                {!!i.badge && <span key={i.badge} className="vks-rail-fade ml-auto"><span className="vks-badge-pop block min-w-6 rounded-full bg-gold px-2 text-center text-xs font-bold text-gold-foreground">{i.badge > 99 ? "99+" : i.badge}</span></span>}
              </button>
            )
            return mini
              ? <Tooltip key={i.id}><TooltipTrigger asChild>{btn}</TooltipTrigger><TooltipContent side="right" sideOffset={10}>{i.label}{i.badge ? " · " + i.badge : ""}</TooltipContent></Tooltip>
              : btn
          })}
        </nav>
        {collapsible && (
          <button onClick={() => { haptics.tap(); setMini(!mini) }} aria-label={mini ? "expand sidebar" : "collapse sidebar"} aria-expanded={!mini}
            className="vks-press flex h-11 w-full items-center gap-3 whitespace-nowrap rounded-xl px-3.5 text-sm font-semibold opacity-60 transition-opacity hover:bg-bar-foreground/[.08] hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold">
            <ChevronLeft className="vks-rail-chev size-5 shrink-0" /><span className="vks-rail-fade">ຫຍໍ້ເມນູ</span>
          </button>
        )}
        {user && <div className="overflow-hidden whitespace-nowrap border-t border-bar-foreground/15 pt-3">{user}</div>}
      </aside>
    </TooltipProvider>
  )
}

/** Phone drawer version of the sidebar: slides in from the left over a scrim. Picking an item closes it. */
export function SidebarSheet({ open, onOpenChange, onNavigate, ...p }: Omit<SidebarProps, "collapsible" | "collapsed" | "defaultCollapsed" | "onCollapsedChange" | "persist" | "className"> & { open: boolean; onOpenChange: (o: boolean) => void }) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="!p-0 [&>button:last-child]:text-bar-foreground">
        <SheetTitle className="sr-only">{p.title}</SheetTitle>
        <Sidebar {...p} onNavigate={(id) => { onNavigate(id); onOpenChange(false) }} className="flex !h-full w-full" />
      </SheetContent>
    </Sheet>
  )
}

/** Frosted tab bar. Rises in on first paint; the active icon sits on a pill that springs across; the icon bounces when tapped. */
export function BottomNav({ items, active, onNavigate, className }: { items: NavItem[]; active: string; onNavigate: (id: string) => void; className?: string }) {
  const [more, setMore] = React.useState(false)
  const [bounce, setBounce] = React.useState<string | null>(null)
  const shown = items.length > 5 ? items.slice(0, 4) : items
  const rest = items.length > 5 ? items.slice(4) : []
  const restActive = rest.some((i) => i.id === active)
  const { ref, box, anim } = useIndicator<HTMLElement>("[aria-current=page] .vks-slot", [active, items.length])
  const btn = (i: NavItem, onClick: () => void, on: boolean) => (
    <button key={i.id} onClick={() => { haptics.tap(); setBounce(i.id); onClick() }} aria-current={on ? "page" : undefined}
      className={cn("relative z-10 flex h-[3.75rem] flex-1 flex-col items-center justify-center gap-1 text-[11px] font-semibold transition-colors duration-200 focus-visible:outline-none", on ? "text-foreground" : "text-muted-foreground")}>
      <span className="vks-slot relative flex h-8 w-14 items-center justify-center">
        <span key={bounce === i.id ? active + i.id : i.id} className={cn("relative transition-colors duration-200 [&_svg]:size-[22px]", on && "text-primary dark:text-gold [&_svg]:stroke-[2.25]", bounce === i.id && "vks-tab-bounce")}>{i.icon}
          {!!i.badge && <span key={i.badge} className="vks-badge-pop absolute -right-2.5 -top-1.5 min-w-[18px] rounded-full bg-destructive px-1 text-center text-[10px] leading-[18px] text-destructive-foreground ring-2 ring-card">{i.badge > 99 ? "99+" : i.badge}</span>}
        </span>
      </span>
      <span className="max-w-full truncate px-1 leading-none">{i.label}</span>
    </button>
  )
  return (
    <>
      <nav ref={ref} aria-label="main" className={cn("vks-glass vks-nav-up fixed inset-x-0 bottom-0 z-40 flex border-t border-border/60 px-1 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_24px_-16px_rgb(20_23_61/.25)]", className)}>
        <Indicator box={box} anim={anim} className="rounded-full bg-[linear-gradient(180deg,color-mix(in_oklab,var(--gold)_22%,transparent),color-mix(in_oklab,var(--gold)_10%,transparent))] shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--gold)_35%,transparent)]" />
        <span aria-hidden className="vks-hairline pointer-events-none absolute inset-x-0 top-0 opacity-60" />
        {shown.map((i) => btn(i, () => onNavigate(i.id), active === i.id))}
        {rest.length > 0 && btn({ id: "__more", label: "···", icon: <MoreHorizontal /> }, () => setMore(true), restActive)}
      </nav>
      <Sheet open={more} onOpenChange={setMore}>
        <SheetContent side="bottom"><SheetTitle>···</SheetTitle>
          <div className="vks-stagger mt-3 grid gap-1">{rest.map((i, k) => (
            <button key={i.id} style={{ ["--i" as string]: k } as React.CSSProperties} onClick={() => { setMore(false); onNavigate(i.id) }} className={cn("vks-press flex h-12 items-center gap-3 rounded-xl px-3 font-semibold hover:bg-muted [&_svg]:size-5", active === i.id && "bg-muted")}>{i.icon}{i.label}</button>))}</div>
        </SheetContent>
      </Sheet>
    </>
  )
}

/** Create button (navy + gold ring, brand-lit). Desktop: sits in the header (use inline). Mobile: floating. Icon must say what it creates. extended = pill with label. */
export function Fab({ icon = <Plus />, label, onClick, extended, className }: { icon?: React.ReactNode; label: string; onClick: () => void; extended?: boolean; className?: string }) {
  return (
    <button aria-label={label} onClick={() => { haptics.tap(); onClick() }}
      className={cn("vks-press vks-bounce-in fixed bottom-[calc(5rem+env(safe-area-inset-bottom))] right-4 z-40 flex h-14 items-center justify-center gap-2 rounded-full bg-primary bg-[image:linear-gradient(180deg,rgb(255_255_255/.14),transparent_55%)] text-primary-foreground ring-2 ring-gold/70 ring-offset-2 ring-offset-background shadow-[0_14px_30px_-10px_rgb(20_23_61/.65),inset_0_1px_0_rgb(255_255_255/.22)] dark:bg-gold dark:text-gold-foreground dark:ring-gold/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:hidden [&_svg]:size-6", extended ? "px-5 font-bold" : "w-14", className)}>{icon}{extended && <span>{label}</span>}</button>
  )
}

/** Page title block. Title/subtitle rise in; optional back button and breadcrumb line; actions hide on phone (use Fab). */
export function PageHeader({ title, subtitle, actions, onBack, eyebrow, className }: { title: string; subtitle?: string; actions?: React.ReactNode; onBack?: () => void; eyebrow?: React.ReactNode; className?: string }) {
  return (
    <div className={cn("vks-rise mb-5 flex flex-wrap items-end justify-between gap-3", className)}>
      <div className="flex min-w-0 items-start gap-2">
        {onBack && <button aria-label="back" onClick={onBack} className="vks-press -ml-2 flex size-11 shrink-0 items-center justify-center rounded-full text-foreground hover:bg-muted [&_svg]:size-6"><ChevronLeft /></button>}
        <div className="min-w-0">
          {eyebrow && <div className="mb-0.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{eyebrow}</div>}
          <h1 className="text-2xl font-bold leading-snug tracking-tight">{title}</h1>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="hidden items-center gap-2 md:flex">{actions}</div>}
    </div>
  )
}

/**
 * iOS navigation bar with a large title that collapses into the small centered one as you scroll.
 * Put it at the top of a scrolling page. Uses scroll position only (no layout thrash).
 */
export function LargeTitleBar({ title, onBack, backLabel, trailing, className }: { title: string; onBack?: () => void; backLabel?: string; trailing?: React.ReactNode; className?: string }) {
  const [y, setY] = React.useState(0)
  React.useEffect(() => { const f = () => setY(window.scrollY); f(); window.addEventListener("scroll", f, { passive: true }); return () => window.removeEventListener("scroll", f) }, [])
  const t = Math.min(1, y / 44)
  return (
    <>
      <div className={cn("sticky top-0 z-30 flex h-11 items-center justify-between px-2 pt-[env(safe-area-inset-top)] transition-[background-color,border-color] duration-200", t > 0.95 ? "vks-glass border-b border-border/60" : "border-b border-transparent", className)}>
        <div className="flex min-w-0 flex-1">{onBack && <button onClick={onBack} className="vks-press flex h-11 items-center gap-0.5 pr-2 font-semibold text-primary [&_svg]:size-6"><ChevronLeft />{backLabel}</button>}</div>
        <b className="truncate text-[15px] transition-opacity duration-200" style={{ opacity: t > 0.95 ? 1 : 0 }}>{title}</b>
        <div className="flex flex-1 justify-end">{trailing}</div>
      </div>
      <h1 className="origin-left px-4 pb-2 pt-1 text-[2rem] font-bold leading-tight tracking-tight will-change-transform" style={{ opacity: 1 - t, transform: `scale(${1 - t * 0.12}) translate3d(0,${-t * 6}px,0)` }}>{title}</h1>
    </>
  )
}

/**
 * Login screen: slow gold/navy aurora behind a frosted card with a lifted logo.
 * In lite mode the aurora stops moving and the glass becomes a solid card (see perf tiers).
 */
export function LoginCard({ title, subtitle, children, footer, brand = BRAND.name.toUpperCase(), side }: { title: string; subtitle?: string; children: React.ReactNode; footer?: React.ReactNode; brand?: string; side?: React.ReactNode }) {
  return (
    <div className="vks-aurora flex min-h-dvh items-center justify-center p-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))]">
      <div className={cn("grid w-full items-center gap-10", side ? "max-w-5xl md:grid-cols-[1fr_24rem]" : "max-w-sm")}>
        {side && <div className="vks-rise hidden md:block">{side}</div>}
        <div className="vks-bounce-in relative w-full">
          <div className="vks-glass relative overflow-hidden rounded-[1.75rem] border border-white/40 shadow-[0_40px_80px_-30px_rgb(20_23_61/.45),inset_0_1px_0_rgb(255_255_255/.5)] dark:border-white/10">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
            <div className="space-y-5 p-7">
              <div className="vks-rise flex flex-col items-center gap-3 text-center">
                <div className="relative"><div className="absolute inset-2 rounded-full bg-gold/40 blur-2xl" /><Logo className="vks-logo-lift vks-float-y relative size-20" /></div>
                <div className="text-[11px] font-bold tracking-[.25em] text-muted-foreground">{brand}</div>
                <h1 className="text-2xl font-bold leading-snug tracking-tight">{title}</h1>
                {subtitle && <p className="-mt-2 text-sm text-muted-foreground">{subtitle}</p>}
              </div>
              <div className="vks-rise space-y-4">{children}</div>
            </div>
            {footer && <div className="border-t border-border/60 px-7 py-3.5 text-center text-xs text-muted-foreground">{footer}</div>}
          </div>
        </div>
      </div>
    </div>
  )
}