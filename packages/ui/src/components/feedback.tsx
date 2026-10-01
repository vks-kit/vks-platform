import * as React from "react"
import { Check, Inbox, Loader2, WifiOff } from "lucide-react"
import { cn } from "../lib/cn"
import { ToneBadge } from "../lib/tone-badge"

/** Use for a generic shimmering placeholder block; size it with className. For text lines use SkeletonText; for list rows use SkeletonList; for a table use SkeletonTable; for a short action wait use Spinner or Button loading instead. */
export function Skeleton({ className, ...p }: React.ComponentProps<"div">) {
  return <div aria-hidden className={cn("vks-shimmer h-4 rounded-md", className)} {...p} />
}
/** Use for a small inline "working" indicator. For a button that is saving use Button loading instead; for page content that is loading use Skeleton instead; for a blocking full-screen wait use ProgressHUD instead. */
export function Spinner({ className }: { className?: string }) {
  return <Loader2 aria-label="loading" className={cn("vks-spin size-4", className)} />
}
/** Circle pops, tick draws. Pair with haptics.success() from @vks/core. */
export function SuccessCheck({ className }: { className?: string }) {
  return (
    <svg role="img" aria-label="success" viewBox="0 0 56 56" className={cn("vks-check-pop size-14", className)}>
      <circle cx="28" cy="28" r="26" fill="var(--success)" />
      <path className="vks-check-draw" d="M16 29l8 8 16-17" fill="none" stroke="var(--success-foreground)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
/** Drops in when the phone is offline; shows how many scans wait to sync. variant="island" = navy Dynamic-Island pill (tone badge + gold queue chip). For a one-off message use toast instead. */
export function OfflineBanner({ queued = 0, syncing = false, variant = "bar", className }: { queued?: number; syncing?: boolean; variant?: "bar" | "island"; className?: string }) {
  if (variant === "island") return (
    <div role="status" aria-live="polite" data-syncing={syncing || undefined}
      className={cn("vks-island mx-auto flex w-fit max-w-[calc(100%-1rem)] items-center gap-2.5 rounded-full bg-[#14173d] py-1.5 pl-1.5 pr-2 text-[13px] font-semibold leading-normal text-white shadow-[0_14px_30px_-12px_rgb(20_23_61/.6),inset_0_1px_0_rgb(255_255_255/.08)] ring-1 ring-white/10", className)}>
      {syncing
        ? <span aria-hidden className="relative grid size-8 shrink-0 place-items-center"><span className="vks-island-dot size-2.5 rounded-full bg-gold" /></span>
        : <ToneBadge tone="warning" icon={<WifiOff />} size="xs" className="ring-warning/25" />}
      <span className="min-w-0 truncate">{syncing ? "ກຳລັງສົ່ງຂໍ້ມູນ…" : "ບໍ່ມີເນັດ · ຈະສົ່ງເມື່ອມີເນັດ"}</span>
      {queued > 0 && <span key={queued} className="vks-badge-pop shrink-0 rounded-full bg-gold px-2 py-0.5 text-[11px] font-bold tabular-nums text-[#14173d]">ຄິວ {queued}</span>}
    </div>
  )
  return (
    <div role="status" className={cn("vks-slide-down flex items-center gap-2 bg-warning px-3 py-2 text-sm font-semibold text-warning-foreground", className)}>
      {syncing ? <Loader2 className="vks-spin size-4" /> : <WifiOff className="size-4" />}
      <span>{syncing ? "ກຳລັງສົ່ງຂໍ້ມູນ…" : "ບໍ່ມີເນັດ"}</span>
      {queued > 0 && <span className="ml-auto rounded-full bg-warning-foreground/20 px-2 text-xs">ຄິວ {queued}</span>}
    </div>
  )
}
/** Use for an empty list or "no results" state (icon orb + title + hint + optional action). size="sm" drops the dashed frame for use inside menus and lists. For an error or warning message use Alert instead; DataTable already shows its own empty state. */
export function Empty({ title, hint, icon, action, size = "md", className }: { title: string; hint?: React.ReactNode; icon?: React.ReactNode; action?: React.ReactNode; size?: "md" | "sm"; className?: string }) {
  const sm = size === "sm"
  return (
    <div className={cn("vks-empty flex flex-col items-center text-center leading-normal", sm ? "gap-1.5 px-4 py-6" : "gap-2 rounded-xl border border-dashed p-8", className)}>
      <span aria-hidden className={cn("vks-empty-orb relative grid shrink-0 place-items-center rounded-full text-muted-foreground", sm ? "mb-1 size-11 [&_svg]:size-5" : "mb-2 size-16 [&_svg]:size-7")}>
        {icon ?? <Inbox />}
      </span>
      <p className={cn("font-semibold", sm && "text-sm")}>{title}</p>
      {hint && <p className={cn("max-w-xs text-muted-foreground", sm ? "text-xs" : "text-sm")}>{hint}</p>}
      {action && <div className={sm ? "mt-1" : "mt-2"}>{action}</div>}
    </div>
  )
}
/** Use for a pulsing green "live / online now" dot. For a coloured status word use Badge instead. */
export function LiveDot({ className }: { className?: string }) {
  return <span className={cn("vks-ripple relative inline-block size-3 rounded-full bg-success", className)} />
}
export { Check }
