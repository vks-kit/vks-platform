import * as React from "react"
import { AlertTriangle, Check, CheckCircle2, Clock, CloudUpload, RefreshCw, X } from "lucide-react"
import { cleanText } from "@vks-kit/types"
import { cn } from "../lib/cn"
import { rejectReasonError, sinceLabel, syncState, type SyncInput } from "../lib/workflow"
import { Button } from "./button"
import { Badge } from "./badge"
import { Label, Textarea } from "./input"
import { UserChip } from "./data-display"

export * from "../lib/workflow"

export type ApprovalStatus = "pending" | "approved" | "rejected"
export type ApprovalLabels = { approve: string; reject: string; confirmReject: string; cancel: string; reason: string; reasonHint: string; pending: string; approved: string; rejected: string; by: string }
const APPROVAL_LO: ApprovalLabels = {
  approve: "ອະນຸມັດ", reject: "ປະຕິເສດ", confirmReject: "ຢືນຢັນປະຕິເສດ", cancel: "ຍົກເລີກ",
  reason: "ເຫດຜົນທີ່ປະຕິເສດ", reasonHint: "ຜູ້ຂໍຈະເຫັນຂໍ້ຄວາມນີ້",
  pending: "ລໍຖ້າອະນຸມັດ", approved: "ອະນຸມັດແລ້ວ", rejected: "ປະຕິເສດແລ້ວ", by: "ໂດຍ",
}

/** Use for one request that needs a yes/no from a manager (leave, overtime, site change, payroll fix): summary, who asked and when, Approve / Reject with a required reason. For a list of many requests put one ApprovalCard per row, or use DataTable with a Drawer; for a plain yes/no without a reason use ConfirmDialog instead. */
export function ApprovalCard({
  title, summary, requester, requesterRole, requestedAt, status, decidedBy, decidedAt, reason,
  onApprove, onReject, labels, className, children,
}: {
  title: React.ReactNode
  summary?: React.ReactNode
  requester: string
  requesterRole?: string
  requestedAt: string
  status: ApprovalStatus
  decidedBy?: string
  decidedAt?: string
  /** Rejection reason, shown when status is "rejected". */
  reason?: string
  /** May return a promise: the button shows a spinner until it settles. */
  onApprove?: () => void | Promise<unknown>
  /** Gets the reason after cleanText(); only called when rejectReasonError() passes. */
  onReject?: (reason: string) => void | Promise<unknown>
  labels?: Partial<ApprovalLabels>
  className?: string
  /** Extra detail rows (dates, amounts) under the summary. */
  children?: React.ReactNode
}) {
  const L = { ...APPROVAL_LO, ...labels }
  const [rejecting, setRejecting] = React.useState(false)
  const [text, setText] = React.useState("")
  const [error, setError] = React.useState<string | null>(null)
  const [busy, setBusy] = React.useState<"approve" | "reject" | null>(null)
  const id = React.useId()
  const run = async (kind: "approve" | "reject", fn?: () => void | Promise<unknown>) => {
    if (!fn) return
    setBusy(kind)
    try { await fn() } finally { setBusy(null) }
  }
  const submitReject = () => {
    const err = rejectReasonError(text)
    setError(err)
    if (err) return
    void run("reject", () => onReject?.(cleanText(text))).then(() => { setRejecting(false); setText("") })
  }
  const badge = status === "approved" ? <Badge variant="success" dot>{L.approved}</Badge> : status === "rejected" ? <Badge variant="danger" dot>{L.rejected}</Badge> : <Badge variant="warning" dot>{L.pending}</Badge>
  return (
    <article className={cn("rounded-xl border bg-card p-4 text-card-foreground shadow-sm", status === "pending" && "border-l-4 border-l-warning", className)}>
      <header className="flex items-start justify-between gap-3">
        <h3 className="min-w-0 font-semibold leading-normal">{title}</h3>
        <span className="shrink-0">{badge}</span>
      </header>
      {summary && <div className="mt-1 text-sm leading-relaxed text-muted-foreground">{summary}</div>}
      {children && <div className="mt-3 text-sm leading-relaxed">{children}</div>}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <UserChip name={requester} sub={requesterRole} />
        <span className="flex items-center gap-1 text-xs tabular-nums text-muted-foreground"><Clock className="size-3.5" aria-hidden />{requestedAt}</span>
      </div>
      {status !== "pending" && (decidedBy || decidedAt || reason) && (
        <div className={cn("mt-3 rounded-lg px-3 py-2 text-sm leading-relaxed", status === "approved" ? "bg-success/10" : "bg-destructive/10")}>
          {(decidedBy || decidedAt) && <div className="text-muted-foreground">{decidedBy && <>{L.by} <span className="font-semibold text-foreground">{decidedBy}</span></>}{decidedBy && decidedAt && " · "}{decidedAt}</div>}
          {status === "rejected" && reason && <div className="mt-0.5">{reason}</div>}
        </div>
      )}
      {status === "pending" && (onApprove || onReject) && (rejecting ? (
        <div className="vks-fade-up mt-4 grid gap-2">
          <Label htmlFor={id}>{L.reason}</Label>
          <Textarea id={id} value={text} autoFocus aria-invalid={error ? true : undefined} aria-describedby={id + "-msg"}
            className={cn("leading-relaxed", error && "border-destructive")} onChange={(e) => { setText(e.target.value); if (error) setError(rejectReasonError(e.target.value)) }} />
          <p id={id + "-msg"} className={cn("text-xs leading-normal", error ? "text-destructive" : "text-muted-foreground")} aria-live="polite">{error ?? L.reasonHint}</p>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => { setRejecting(false); setError(null) }} disabled={busy !== null}>{L.cancel}</Button>
            <Button variant="destructive" onClick={submitReject} loading={busy === "reject"}>{L.confirmReject}</Button>
          </div>
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-2">
          {onReject && <Button variant="outline" onClick={() => setRejecting(true)} disabled={busy !== null}><X aria-hidden />{L.reject}</Button>}
          {onApprove && <Button variant="action" className={cn(!onReject && "col-span-2")} onClick={() => run("approve", onApprove)} loading={busy === "approve"} disabled={busy !== null}><Check aria-hidden />{L.approve}</Button>}
        </div>
      ))}
    </article>
  )
}

export type SyncLabels = { synced: string; pending: (n: number) => string; failing: string; syncing: string; last: string; never: string; retry: string; oldest: string }
const SYNC_LO: SyncLabels = {
  synced: "ສົ່ງຂໍ້ມູນຄົບແລ້ວ", pending: (n) => "ລໍຖ້າສົ່ງ " + n + " ລາຍການ", failing: "ສົ່ງບໍ່ສຳເລັດ",
  syncing: "ກຳລັງສົ່ງ…", last: "ສົ່ງລ່າສຸດ", never: "ຍັງບໍ່ເຄີຍສົ່ງ", retry: "ລອງໃໝ່", oldest: "ເກົ່າສຸດ",
}
const SYNC_TONE = {
  synced: { icon: CheckCircle2, box: "bg-success/15 text-success", badge: "success" },
  pending: { icon: CloudUpload, box: "bg-warning/15 text-warning", badge: "warning" },
  failing: { icon: AlertTriangle, box: "bg-destructive/15 text-destructive", badge: "danger" },
} as const

/** Use for "is my data on the server yet?": synced, pending N or failing, the last sync time and a retry button, fed by the OfflineQueue from @vks-kit/core. For the top-of-screen no-network bar use OfflineBanner instead; for a one-off result after an action use toast. */
export function SyncStatus({ items, queued, dropped, error, maxTries, lastSyncAt, syncing = false, onRetry, compact = false, labels, className }: SyncInput & {
  /** ms timestamp of the last successful flush; null = never. */
  lastSyncAt?: number | null
  syncing?: boolean
  onRetry?: () => void
  /** One-line pill for a header instead of the card row. */
  compact?: boolean
  labels?: Partial<SyncLabels>
  className?: string
}) {
  const L = { ...SYNC_LO, ...labels }
  const s = syncState({ items, queued, dropped, error, maxTries })
  const T = SYNC_TONE[s.state]
  const Icon = T.icon
  const title = syncing ? L.syncing : s.state === "synced" ? L.synced : s.state === "pending" ? L.pending(s.queued) : L.failing
  const sub = [lastSyncAt ? L.last + " " + sinceLabel(lastSyncAt) : L.never, s.oldestAt && s.state !== "synced" ? L.oldest + " " + sinceLabel(s.oldestAt) : null, typeof error === "string" && error ? error : null].filter(Boolean).join(" · ")
  const retry = onRetry && s.state !== "synced"
  if (compact) return (
    <span role="status" aria-live="polite" className={cn("inline-flex items-center gap-2", className)}>
      <Badge variant={T.badge} dot live={syncing}>{title}</Badge>
      {retry && <Button size="icon" variant="ghost" onClick={onRetry} disabled={syncing} aria-label={L.retry}><RefreshCw className={cn(syncing && "vks-spin")} aria-hidden /></Button>}
    </span>
  )
  return (
    <div role="status" aria-live="polite" className={cn("flex items-center gap-3 rounded-xl border bg-card p-3", className)}>
      <span className={cn("flex size-11 shrink-0 items-center justify-center rounded-full [&_svg]:size-5", T.box)}><Icon aria-hidden /></span>
      <div className="min-w-0 flex-1">
        <div className="font-semibold leading-normal">{title}</div>
        <div className="truncate text-xs leading-normal text-muted-foreground">{sub}</div>
      </div>
      {retry && <Button size="sm" variant={s.state === "failing" ? "default" : "outline"} onClick={onRetry} disabled={syncing}><RefreshCw className={cn(syncing && "vks-spin")} aria-hidden />{L.retry}</Button>}
    </div>
  )
}
