import * as React from "react"
import { AlertTriangle, Check, CheckCircle2, Clock, CloudUpload, MapPin, Navigation, Nfc, QrCode, RefreshCw, ScanLine, Siren, Timer, X } from "lucide-react"
import { fmtKip, haptics } from "@vks-kit/core"
import { cleanText } from "@vks-kit/types"
import { cn } from "../lib/cn"
import { rejectReasonError, sinceLabel, syncState, type SyncInput } from "../lib/workflow"
import { Button } from "./button"
import { Badge } from "./badge"
import { Label, Textarea } from "./input"
import { Avatar, Progress, UserChip } from "./data-display"
import { Stepper } from "./form"
import { ContactActions } from "./contact"
import { BRAND, Logo } from "./logo"
import { checkpointProgress, fmtDistance, nextShift, quoteTotals, rosterCover, slaLeft, type Checkpoint, type CheckpointStatus, type QuoteLine, type Roster, type RosterNeed, type ShiftCode } from "../lib/domain"

export * from "../lib/workflow"
export * from "../lib/domain"

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

/* ------------------------------------------------------------------ */
/* VKS domain parts: patrol, roster, incidents, ID badge, quote        */
/* ------------------------------------------------------------------ */

export type CheckpointLabels = { progress: (done: number, total: number) => string; scan: string; missed: string; next: string }
const CP_LO: CheckpointLabels = { progress: (d, t) => d + " / " + t + " ຈຸດກວດສຳເລັດ", scan: "ສະແກນຈຸດກວດຖັດໄປ", missed: "ພາດ", next: "ຖັດໄປ" }
const CP_DOT: Record<CheckpointStatus, string> = {
  done: "border-success bg-success text-success-foreground",
  next: "border-gold bg-card text-foreground ring-4 ring-gold/25",
  pending: "border-input bg-card text-muted-foreground",
  missed: "border-destructive bg-destructive text-destructive-foreground",
}
const CP_ICON = { nfc: Nfc, qr: QrCode, gps: MapPin } as const

/** Use for one patrol round on a phone: the checkpoints in order with done / next / missed, the real scan time, the GPS distance and one big "scan next" button. For the history of a finished shift use Timeline; for numbered form steps use Wizard instead. */
export function PatrolCheckpointRail({ checkpoints, onScan, scanning = false, labels, className }: {
  checkpoints: Checkpoint[]
  /** Called with the next checkpoint; the button is hidden when nothing is left or no handler is given. May return a promise (spinner). */
  onScan?: (cp: Checkpoint) => void | Promise<unknown>
  scanning?: boolean
  labels?: Partial<CheckpointLabels>
  className?: string
}) {
  const L = { ...CP_LO, ...labels }
  const p = checkpointProgress(checkpoints)
  const [busy, setBusy] = React.useState(false)
  const next = p.next >= 0 ? checkpoints[p.next] : null
  const scan = async () => { if (!next || !onScan) return; haptics.tap(); setBusy(true); try { await onScan(next) } finally { setBusy(false) } }
  return (
    <section className={cn("min-w-0 rounded-xl border bg-card p-4 text-card-foreground", className)}>
      <header className="mb-3 grid gap-2">
        <div className="flex items-center justify-between gap-2">
          <span className="font-semibold tabular-nums leading-normal">{L.progress(p.done, p.total)}</span>
          {p.missed > 0 && <Badge variant="danger" dot>{L.missed} {p.missed}</Badge>}
        </div>
        <Progress value={p.done} max={Math.max(1, p.total)} />
      </header>
      <ol className="grid grid-cols-[minmax(0,1fr)]">
        {checkpoints.map((c, i) => {
          const Icon = c.method ? CP_ICON[c.method] : null
          const last = i === checkpoints.length - 1
          return (
            <li key={c.id} aria-current={c.status === "next" ? "step" : undefined} className="relative flex min-w-0 gap-3 pb-4 last:pb-0">
              {!last && <span aria-hidden className={cn("absolute bottom-0 left-[15px] top-8 w-0.5", c.status === "done" ? "bg-success" : "bg-border")} />}
              <span className={cn("relative z-[1] flex size-8 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold tabular-nums [&_svg]:size-4", CP_DOT[c.status])}>
                {c.status === "done" ? <Check aria-hidden /> : c.status === "missed" ? <X aria-hidden /> : i + 1}
              </span>
              <div className="min-w-0 flex-1 pt-0.5">
                <div className="flex min-w-0 items-center gap-2">
                  <span className={cn("truncate font-semibold leading-normal", c.status === "pending" && "text-muted-foreground")}>{c.name}</span>
                  {c.status === "next" && <Badge variant="gold">{L.next}</Badge>}
                </div>
                <div className="flex flex-wrap items-center gap-x-3 text-xs leading-normal text-muted-foreground tabular-nums">
                  {c.time && <span className="inline-flex items-center gap-1"><Clock className="size-3.5" aria-hidden />{c.time}</span>}
                  {c.distanceM != null && <span className="inline-flex items-center gap-1"><Navigation className="size-3.5" aria-hidden />{fmtDistance(c.distanceM)}</span>}
                  {Icon && <Icon className="size-3.5" aria-label={c.method} />}
                  {c.note && <span className={cn(c.status === "missed" && "text-destructive")}>{c.note}</span>}
                </div>
              </div>
            </li>
          )
        })}
      </ol>
      {next && onScan && <Button variant="action" size="lg" className="mt-4 w-full" onClick={scan} loading={busy || scanning}><ScanLine aria-hidden />{L.scan}</Button>}
    </section>
  )
}

export type RosterStaff = { id: string; name: string; sub?: string }
export type RosterDay = { key: string; label: string; sub?: string }
export type RosterLabels = { staff: string; legend: string; cover: string; short: (shift: string, day: string) => string; shift: Record<Exclude<ShiftCode, "">, string> }
const RO_LO: RosterLabels = {
  staff: "ພະນັກງານ", legend: "D = ກາງເວັນ · N = ກາງຄືນ · OFF = ພັກ · ແຕະຊ່ອງເພື່ອປ່ຽນກະ", cover: "ກຳລັງພົນ",
  short: (s, d) => "ກະ " + s + " " + d + " ຍາມບໍ່ຄົບ", shift: { D: "ກາງເວັນ", N: "ກາງຄືນ", OFF: "ພັກ" },
}
const SHIFT_CELL: Record<ShiftCode, string> = {
  D: "bg-gold-tint text-foreground ring-1 ring-inset ring-gold/40",
  N: "bg-primary text-primary-foreground",
  OFF: "bg-muted text-muted-foreground",
  "": "border border-dashed border-input text-muted-foreground",
}

/** Use for a guard x day shift plan (duty control, HRM, a site's week): tap a cell to cycle D -> N -> OFF, and the bottom row warns when a shift is below the head count it needs. For attendance that already happened use AttendanceBoard from @vks-kit/ui/charts; for picking one time slot use SlotPicker instead. */
export function ShiftRosterGrid({ staff, days, value, onChange, need, labels, className }: {
  staff: RosterStaff[]
  days: RosterDay[]
  value: Roster
  /** Gets the cell and the shift it moves to (nextShift). Without it the grid is read-only. */
  onChange?: (staffId: string, day: string, shift: ShiftCode) => void
  /** Minimum guards per shift, the same every day or per day. */
  need?: RosterNeed | ((day: string) => RosterNeed | undefined)
  labels?: Partial<RosterLabels>
  className?: string
}) {
  const L = { ...RO_LO, ...labels, shift: { ...RO_LO.shift, ...labels?.shift } }
  const cover = rosterCover(value, staff.map((s) => s.id), days.map((d) => d.key), need)
  const warn = cover.flatMap((c) => c.short.map((s) => L.short(s, days.find((d) => d.key === c.day)?.label ?? c.day)))
  return (
    <div className={cn("grid min-w-0 gap-2", className)}>
      <div className="min-w-0 overflow-x-auto rounded-xl border bg-card">
        <table className="w-full border-separate border-spacing-0 text-sm">
          <thead><tr>
            <th scope="col" className="sticky left-0 z-[1] bg-card px-3 py-2 text-left font-semibold">{L.staff}</th>
            {days.map((d) => <th key={d.key} scope="col" className="px-1 py-2 text-center font-semibold leading-snug">{d.label}{d.sub && <div className="text-xs font-normal tabular-nums text-muted-foreground">{d.sub}</div>}</th>)}
          </tr></thead>
          <tbody>
            {staff.map((s) => (
              <tr key={s.id}>
                <th scope="row" className="sticky left-0 z-[1] max-w-40 border-t bg-card px-3 py-1.5 text-left font-normal">
                  <div className="truncate font-semibold leading-normal">{s.name}</div>{s.sub && <div className="truncate text-xs text-muted-foreground">{s.sub}</div>}
                </th>
                {days.map((d) => {
                  const c: ShiftCode = value[s.id]?.[d.key] ?? ""
                  const label = s.name + " · " + d.label + ": " + (c ? L.shift[c] : "—")
                  const cls = cn("flex h-11 w-full min-w-11 items-center justify-center rounded-lg text-xs font-bold tabular-nums", SHIFT_CELL[c])
                  return (
                    <td key={d.key} className="border-t p-1 text-center">
                      {onChange
                        ? <button type="button" aria-label={label} className={cn("vks-press", cls)} onClick={() => { haptics.tap(); onChange(s.id, d.key, nextShift(c)) }}>{c || "—"}</button>
                        : <span role="img" aria-label={label} className={cls}>{c || "—"}</span>}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
          <tfoot><tr>
            <th scope="row" className="sticky left-0 z-[1] border-t bg-muted px-3 py-1.5 text-left text-xs font-semibold text-muted-foreground">{L.cover}</th>
            {cover.map((c) => (
              <td key={c.day} className={cn("border-t px-1 py-1.5 text-center text-xs tabular-nums", c.short.length ? "bg-destructive/10 font-bold text-destructive" : "bg-muted text-muted-foreground")}>D{c.D} · N{c.N}</td>
            ))}
          </tr></tfoot>
        </table>
      </div>
      {warn.length > 0
        ? <p role="status" className="flex items-start gap-1.5 text-xs leading-normal text-destructive"><AlertTriangle className="mt-0.5 size-3.5 shrink-0" aria-hidden />{warn.join(" · ")}</p>
        : <p className="text-xs leading-normal text-muted-foreground">{L.legend}</p>}
    </div>
  )
}

export type IncidentPriority = "P1" | "P2" | "P3"
export type IncidentLabels = { reporter: string; sla: string; overdue: string; status: string; dispatch: string; resolved: string; priority: Record<IncidentPriority, string> }
const INC_LO: IncidentLabels = {
  reporter: "ຜູ້ແຈ້ງ", sla: "ເວລາຕອບສະໜອງ", overdue: "ກາຍເວລາ", status: "ສະຖານະ", dispatch: "ສັ່ງການໜ່ວຍ", resolved: "ແກ້ໄຂແລ້ວ",
  priority: { P1: "ດ່ວນທີ່ສຸດ", P2: "ດ່ວນ", P3: "ທົ່ວໄປ" },
}
const PRIO = {
  P1: { bar: "border-l-destructive", badge: "danger" },
  P2: { bar: "border-l-warning", badge: "warning" },
  P3: { bar: "border-l-input", badge: "neutral" },
} as const

/** Use for one open incident or alarm in the call center / duty room: priority, where, who reported it (call or WhatsApp in one tap), a live SLA countdown that turns red when overdue, and one dispatch button. For a yes/no request use ApprovalCard; for a passing message use toast or Alert instead. */
export function IncidentEscalationCard({ code, title, location, reporter, reporterPhone, priority = "P2", openedAt, slaMinutes = 15, status, resolved = false, onDispatch, dispatchLabel, now, labels, className }: {
  /** Case number, shown as #INC-204. */
  code?: string
  title: React.ReactNode
  location?: string
  reporter?: string
  reporterPhone?: string | number
  priority?: IncidentPriority
  /** ms timestamp the incident was opened. */
  openedAt: number
  /** Response target in minutes. Default 15. */
  slaMinutes?: number
  status?: React.ReactNode
  /** Stops the timer and hides the dispatch button. */
  resolved?: boolean
  onDispatch?: () => void | Promise<unknown>
  /** Button text, e.g. "ສັ່ງການໜ່ວຍ Patrol-02". */
  dispatchLabel?: string
  /** Fixed clock (tests, screenshots). Default: ticks every second. */
  now?: number
  labels?: Partial<IncidentLabels>
  className?: string
}) {
  const L = { ...INC_LO, ...labels, priority: { ...INC_LO.priority, ...labels?.priority } }
  const [tick, setTick] = React.useState(() => Date.now())
  React.useEffect(() => { if (now != null || resolved) return; const id = setInterval(() => setTick(Date.now()), 1000); return () => clearInterval(id) }, [now, resolved])
  const [busy, setBusy] = React.useState(false)
  const s = slaLeft(openedAt, slaMinutes, now ?? tick)
  const P = PRIO[priority]
  const dispatch = async () => { if (!onDispatch) return; haptics.tap(); setBusy(true); try { await onDispatch() } finally { setBusy(false) } }
  return (
    <article className={cn("min-w-0 rounded-xl border border-l-4 bg-card p-4 text-card-foreground shadow-sm", P.bar, className)}>
      <header className="flex flex-wrap items-center gap-2">
        <Badge variant={P.badge} dot live={priority === "P1" && !resolved}>{priority} · {L.priority[priority]}</Badge>
        {code && <span className="text-xs font-semibold tabular-nums text-muted-foreground">#{code}</span>}
        {resolved && <Badge variant="success" dot className="ml-auto">{L.resolved}</Badge>}
      </header>
      <h3 className="mt-2 font-semibold leading-normal">{title}</h3>
      {location && <p className="flex min-w-0 items-center gap-1 text-sm leading-normal text-muted-foreground"><MapPin className="size-3.5 shrink-0" aria-hidden /><span className="truncate">{location}</span></p>}
      {reporter && (
        <div className="mt-3 flex min-w-0 items-center justify-between gap-2">
          <div className="min-w-0 text-sm leading-normal"><span className="text-muted-foreground">{L.reporter}: </span><span className="font-semibold">{reporter}</span>{reporterPhone != null && <div className="text-xs tabular-nums text-muted-foreground">{String(reporterPhone)}</div>}</div>
          {reporterPhone != null && <ContactActions phone={reporterPhone} call />}
        </div>
      )}
      {!resolved && (
        <div className={cn("mt-3 flex items-center justify-between gap-3 rounded-lg px-3 py-2", s.overdue ? "bg-destructive/12 text-destructive" : s.pct < 0.34 ? "bg-warning/12 text-warning" : "bg-muted")}>
          <span className="flex items-center gap-1.5 text-xs font-semibold"><Timer className="size-4" aria-hidden />{s.overdue ? L.overdue : L.sla}</span>
          <span role="timer" aria-live="off" className="font-mono text-xl font-bold tabular-nums">{s.text}</span>
        </div>
      )}
      {status && <p className="mt-2 text-sm leading-normal"><span className="text-muted-foreground">{L.status}: </span>{status}</p>}
      {!resolved && onDispatch && <Button variant={priority === "P1" ? "destructive" : "default"} className="mt-3 w-full" onClick={dispatch} loading={busy}><Siren aria-hidden />{dispatchLabel ?? L.dispatch}</Button>}
    </article>
  )
}

export type GuardIdStatus = "active" | "suspended" | "expired"
export type GuardIdLabels = { site: string; valid: string; status: Record<GuardIdStatus, string> }
const ID_LO: GuardIdLabels = { site: "ຈຸດປະຈຳການ", valid: "ໃຊ້ໄດ້ຮອດ", status: { active: "ໃຊ້ງານ", suspended: "ລະງັບ", expired: "ໝົດອາຍຸ" } }

/** Use for a guard's ID card on screen and on paper (85.6 x 54 mm card width when printed): VKS logo, photo, name, staff ID, role, posted site, status and a QR slot for the inspector to scan. For a person in a list use UserChip; for a full profile page use ProfileView instead. */
export function GuardIdBadge({ name, staffId, role, site, photo, status = "active", validUntil, qr, labels, className }: {
  name: string
  staffId: string
  role?: string
  site?: string
  /** Photo URL; falls back to initials. */
  photo?: string
  status?: GuardIdStatus
  validUntil?: string
  /** QR (or barcode) drawn by the app, e.g. an img of the staff code. The kit ships no QR encoder. */
  qr?: React.ReactNode
  labels?: Partial<GuardIdLabels>
  className?: string
}) {
  const L = { ...ID_LO, ...labels, status: { ...ID_LO.status, ...labels?.status } }
  const tone = status === "active" ? "success" : status === "suspended" ? "danger" : "warning"
  return (
    <article aria-label={name + " · " + staffId} className={cn("mx-auto w-full max-w-[340px] overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-md [print-color-adjust:exact] print:w-[85.6mm] print:max-w-none print:rounded-[3mm] print:shadow-none", className)}>
      <header className="flex items-center gap-2 bg-[var(--logo-navy)] px-4 py-2.5 text-[var(--logo-letter)]">
        <Logo className="size-9" />
        <div className="min-w-0 leading-tight"><div className="truncate text-sm font-bold">{BRAND.lo}</div><div className="truncate text-[11px] opacity-80">{BRAND.name}</div></div>
      </header>
      <div className="h-1 bg-gold" aria-hidden />
      <div className="flex gap-3 p-4">
        <div className="shrink-0"><Avatar name={name} src={photo} size={72} ring /></div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="min-w-0 font-bold leading-normal">{name}</h3>
            <Badge variant={tone} dot className="shrink-0">{L.status[status]}</Badge>
          </div>
          {role && <p className="truncate text-sm leading-normal text-muted-foreground">{role}</p>}
          <p className="mt-0.5 font-mono text-sm font-semibold tabular-nums tracking-wide">{staffId}</p>
        </div>
      </div>
      {(site || validUntil || qr) && (
        <div className="flex items-end gap-3 border-t px-4 py-3">
          <div className="min-w-0 flex-1 text-xs leading-normal">
            {site && <><div className="text-muted-foreground">{L.site}</div><div className="text-sm font-semibold">{site}</div></>}
            {validUntil && <div className="mt-1 tabular-nums text-muted-foreground">{L.valid} {validUntil}</div>}
          </div>
          {qr && <div className="size-16 shrink-0 overflow-hidden rounded-md border bg-[var(--logo-letter)] p-1 [&>*]:size-full">{qr}</div>}
        </div>
      )}
    </article>
  )
}

export type QuoteLabels = { qty: string; subtotal: string; discount: string; vat: (pct: number) => string; total: string; per: string }
const QUOTE_LO: QuoteLabels = { qty: "ຈຳນວນ", subtotal: "ຄ່າບໍລິການພື້ນຖານ", discount: "ສ່ວນຫຼຸດ", vat: (p) => "ອາກອນມູນຄ່າເພີ່ມ (" + p + "%)", total: "ຍອດລວມທັງໝົດ", per: "ເດືອນ" }

/** Use for a guard-service price quote (marketing, client report, printed offer): one row per line with a − / + count, then subtotal, discount, VAT and the total in Kip, all tabular so digits line up. For one money field use MoneyInput; for a list of many records use DataTable instead. */
export function ContractQuoteSummary({ lines, onChange, vatRate = 0.1, discount = 0, title, note, period, labels, className }: {
  lines: QuoteLine[]
  /** Gets the new lines when a count changes. Without it the quote is read-only (print). */
  onChange?: (lines: QuoteLine[]) => void
  /** 0.1 = 10 %. */
  vatRate?: number
  /** Kip off the subtotal, before VAT. */
  discount?: number
  title?: React.ReactNode
  note?: React.ReactNode
  /** After the total, e.g. "ເດືອນ" for a monthly price (the default); pass "" to hide. */
  period?: string
  labels?: Partial<QuoteLabels>
  className?: string
}) {
  const L = { ...QUOTE_LO, ...labels }
  const q = quoteTotals(lines, vatRate, discount)
  const per = period ?? L.per
  const set = (id: string, qty: number) => onChange?.(lines.map((l) => (l.id === id ? { ...l, qty } : l)))
  const row = "flex items-center justify-between gap-3 text-sm leading-normal"
  return (
    <section className={cn("min-w-0 rounded-xl border bg-card p-4 text-card-foreground", className)}>
      {title && <h3 className="mb-3 font-semibold leading-normal">{title}</h3>}
      <ul className="grid grid-cols-[minmax(0,1fr)] divide-y">
        {lines.map((l) => (
          <li key={l.id} className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-0.5 py-2 first:pt-0">
            <div className="min-w-0 flex-1">
              <div className="font-semibold leading-normal">{l.label}</div>
              <div className="text-xs tabular-nums text-muted-foreground">{fmtKip(l.unitPrice)}{l.unit ? " / " + l.unit : ""}</div>
            </div>
            {onChange
              ? <Stepper value={l.qty} min={l.min ?? 0} max={l.max ?? 999} onChange={(v) => set(l.id, v)} label={l.label + " · " + L.qty} />
              : <span className="text-sm tabular-nums text-muted-foreground">× {l.qty}</span>}
            <span className="col-span-2 text-right font-semibold tabular-nums">{fmtKip(l.qty * l.unitPrice)}</span>
          </li>
        ))}
      </ul>
      <dl className="mt-3 grid gap-1 border-t pt-3">
        <div className={row}><dt className="text-muted-foreground">{L.subtotal}</dt><dd className="tabular-nums">{fmtKip(q.subtotal)}</dd></div>
        {q.discount > 0 && <div className={row}><dt className="text-muted-foreground">{L.discount}</dt><dd className="tabular-nums text-success">−{fmtKip(q.discount)}</dd></div>}
        {vatRate > 0 && <div className={row}><dt className="text-muted-foreground">{L.vat(Math.round(vatRate * 1000) / 10)}</dt><dd className="tabular-nums">{fmtKip(q.vat)}</dd></div>}
        <div className="mt-1 flex items-baseline justify-between gap-3 rounded-lg bg-gold-tint px-3 py-2 ring-1 ring-inset ring-gold/35">
          <dt className="font-semibold">{L.total}{per && <span className="font-normal text-muted-foreground"> / {per}</span>}</dt>
          <dd className="text-lg font-bold tabular-nums">{fmtKip(q.total)}</dd>
        </div>
      </dl>
      {note && <p className="mt-2 text-xs leading-normal text-muted-foreground">{note}</p>}
    </section>
  )
}
