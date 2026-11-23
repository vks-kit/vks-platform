import * as React from "react"
import { PatrolCheckpointRail, ShiftRosterGrid, IncidentEscalationCard, GuardIdBadge, ContractQuoteSummary, PhoneInput, MoneyInput, Field, toast, checkpointProgress, fmtDistance, nextShift, rosterCover, slaLeft, quoteTotals, type Checkpoint, type Roster, type QuoteLine, type ShiftCode } from "@vks-kit/ui"
import type { Doc } from "./types"

const CPS: Checkpoint[] = [
  { id: "1", name: "ປະຕູໜ້າ", status: "done", time: "21:02", method: "nfc", distanceM: 4 },
  { id: "2", name: "ບ່ອນຈອດລົດ B1", status: "done", time: "21:18", method: "qr", distanceM: 7 },
  { id: "3", name: "ຄັງສິນຄ້າ B", status: "next", distanceM: 240 },
  { id: "4", name: "ຫຼັງຄາ / ຖັງນ້ຳ", status: "pending" },
]
function Rail() {
  const [cps, setCps] = React.useState(CPS)
  const scan = async (cp: Checkpoint) => {
    await new Promise((r) => setTimeout(r, 600))
    setCps((l) => { const i = l.findIndex((c) => c.id === cp.id); return l.map((c, j) => (j === i ? { ...c, status: "done", time: "21:3" + i, method: "nfc", distanceM: 3 } : j === i + 1 ? { ...c, status: "next" } : c)) })
    toast.success(cp.name + " ✓")
  }
  return <div className="w-full max-w-sm"><PatrolCheckpointRail checkpoints={cps} onScan={scan} /></div>
}

const STAFF = [{ id: "a", name: "ທ້າວ ຄຳພັນ", sub: "ຫົວໜ້າກະ" }, { id: "b", name: "ທ້າວ ສົມພອນ" }, { id: "c", name: "ນາງ ບົວໄລ" }, { id: "d", name: "ທ້າວ ດາວເຮືອງ" }]
const DAYS = [{ key: "mon", label: "ຈັນ", sub: "24" }, { key: "tue", label: "ອັງຄານ", sub: "25" }, { key: "wed", label: "ພຸດ", sub: "26" }, { key: "thu", label: "ພະຫັດ", sub: "27" }]
const ROSTER: Roster = { a: { mon: "D", tue: "D", wed: "N", thu: "OFF" }, b: { mon: "N", tue: "N", wed: "OFF", thu: "D" }, c: { mon: "D", tue: "OFF", wed: "D", thu: "N" }, d: { mon: "OFF", tue: "D", wed: "D" } }
function Roster1() {
  const [r, setR] = React.useState(ROSTER)
  const set = (s: string, d: string, v: ShiftCode) => setR((x) => ({ ...x, [s]: { ...x[s], [d]: v } }))
  return <div className="w-full"><ShiftRosterGrid staff={STAFF} days={DAYS} value={r} onChange={set} need={{ D: 1, N: 1 }} /></div>
}

const LINES: QuoteLine[] = [
  { id: "g", label: "ພະນັກງານຍາມ 12 ຊົ່ວໂມງ", qty: 10, unitPrice: 8_000_000, unit: "ນາຍ", min: 1 },
  { id: "s", label: "ຫົວໜ້າກະ", qty: 1, unitPrice: 10_500_000, unit: "ນາຍ" },
  { id: "p", label: "ລາດຕະເວນເຄື່ອນທີ່ (ກາງຄືນ)", qty: 0, unitPrice: 3_000_000, unit: "ຈຸດ" },
]
function Quote() { const [l, setL] = React.useState(LINES); return <div className="w-full max-w-lg"><ContractQuoteSummary title="ໃບສະເໜີລາຄາ · ທະນາຄານ BCEL" lines={l} onChange={setL} note="ລາຄານີ້ໃຊ້ໄດ້ 30 ວັນ." /></div> }

const qr = <svg viewBox="0 0 7 7" aria-label="QR" shapeRendering="crispEdges"><path fill="currentColor" d="M0 0h3v3H0zM4 0h3v3H4zM0 4h3v3H0zM1 1h1v1H1zM5 1h1v1H5zM1 5h1v1H1zM4 4h1v1H4zM6 4h1v3H6zM4 6h2v1H4z" /></svg>

void checkpointProgress; void fmtDistance; void nextShift; void rosterCover; void slaLeft; void quoteTotals

export const domainDocs: Doc[] = [
  {
    slug: "patrol-checkpoint-rail", name: "Patrol checkpoint rail", group: "Data display", badge: "New", device: "mobile",
    desc: "One patrol round: checkpoints in order (done, next, missed), real NFC / QR scan time, GPS distance and one big scan-next button. For patrol, inspector-head and QC.",
    file: "packages/ui/src/components/business.tsx", importLine: 'import { PatrolCheckpointRail, checkpointProgress, fmtDistance, type Checkpoint, type CheckpointStatus } from "@vks-kit/ui"',
    demo: () => <Rail />,
    code: `const cps: Checkpoint[] = round.points.map((p) => ({
  id: p.id, name: p.name, status: p.status, time: p.scannedAt,
  method: p.via,                                   // "nfc" | "qr" | "gps"
  distanceM: here ? distanceM(here, p) : null,     // distanceM from @vks-kit/core
}))
<PatrolCheckpointRail checkpoints={cps} onScan={(cp) => openScanner(cp)} />`,
    examples: [{ id: "done", title: "Round finished (no button)", demo: () => <div className="w-full max-w-sm"><PatrolCheckpointRail checkpoints={CPS.map((c, i) => ({ ...c, status: i === 2 ? "missed" : "done", note: i === 2 ? "ບໍ່ໄດ້ສະແກນ" : undefined, time: c.time ?? "22:0" + i }))} /></div>, code: "<PatrolCheckpointRail checkpoints={finished} />" }],
    props: [
      { name: "checkpoints", type: "Checkpoint[]", desc: "{ id, name, status: done | next | pending | missed, time?, distanceM?, method?: nfc | qr | gps, note? }. If none is \"next\", the first pending one is." },
      { name: "onScan", type: "(cp) => void | Promise", desc: "Gets the next checkpoint. The button shows a spinner while the promise runs and hides when nothing is left." },
      { name: "scanning", type: "boolean", desc: "Keep the spinner while the camera / NFC sheet is open." },
      { name: "labels", type: "Partial<CheckpointLabels>", desc: "Lao by default." },
    ],
    notes: ["checkpointProgress() and fmtDistance() are pure and unit tested.", "Use Timeline for what happened during the whole shift; this rail is the live round."],
  },
  {
    slug: "shift-roster-grid", name: "Shift roster grid", group: "Data display", badge: "New",
    desc: "Guard x day shift plan: tap a cell to cycle D (day) → N (night) → OFF, the bottom row counts heads per day and turns red when a shift is short. For duty-control, HRM and stationary-guard.",
    file: "packages/ui/src/components/business.tsx", importLine: 'import { ShiftRosterGrid, nextShift, rosterCover, type Roster, type RosterNeed, type ShiftCode, type RosterStaff, type RosterDay } from "@vks-kit/ui"',
    demo: () => <Roster1 />,
    code: `const [roster, setRoster] = useState<Roster>(fromSheet)
<ShiftRosterGrid staff={guards} days={week} value={roster} need={{ D: 2, N: 2 }}
  onChange={(staffId, day, shift) => setRoster((r) => ({ ...r, [staffId]: { ...r[staffId], [day]: shift } }))} />`,
    props: [
      { name: "staff / days", type: "{ id, name, sub? }[] / { key, label, sub? }[]", desc: "Rows and columns. The staff column stays put while the days scroll sideways on a phone." },
      { name: "value", type: "Roster", desc: "staffId → dayKey → \"D\" | \"N\" | \"OFF\" | \"\"." },
      { name: "onChange", type: "(staffId, day, shift) => void", desc: "Gets the next shift (nextShift). Omit for a read-only grid." },
      { name: "need", type: "{ D?, N? } | (day) => …", desc: "Minimum guards per shift; a short day is red and listed under the grid." },
    ],
    notes: ["Each cell is a 44 px button with a full spoken label (name · day: shift).", "For attendance that already happened use AttendanceBoard (charts)."],
  },
  {
    slug: "incident-card", name: "Incident escalation card", group: "Feedback", badge: "New",
    desc: "One open incident in the call center or duty room: P1 / P2 / P3, place, reporter with call + WhatsApp, a live SLA countdown that turns amber then red, and one dispatch button.",
    file: "packages/ui/src/components/business.tsx", importLine: 'import { IncidentEscalationCard, slaLeft, type IncidentPriority } from "@vks-kit/ui"',
    demo: () => <div className="grid w-full max-w-sm gap-3"><IncidentEscalationCard code="INC-204" priority="P1" title="ສັນຍານເຕືອນປະຕູສາງ B" location="ທ່າບົກ ທ່ານາແລ້ງ" reporter="ຫົວໜ້າກະ ສົມພອນ" reporterPhone="020 5512 8890" openedAt={Date.now() - 10 * 60_000 - 42_000} status="ລໍຖ້າສັ່ງການໜ່ວຍລາດຕະເວນ" dispatchLabel="ສັ່ງການໜ່ວຍ Patrol-02" onDispatch={() => new Promise((r) => setTimeout(r, 700)).then(() => toast.success("ສັ່ງການແລ້ວ"))} /></div>,
    code: `<IncidentEscalationCard code={inc.code} priority={inc.p} title={inc.title} location={inc.site}
  reporter={inc.by} reporterPhone={inc.tel} openedAt={inc.openedAt} slaMinutes={15}
  status={inc.statusText} dispatchLabel="ສັ່ງການໜ່ວຍ Patrol-02" onDispatch={() => dispatch(inc.id)} />`,
    examples: [
      { id: "states", title: "Overdue and resolved", demo: () => <div className="grid w-full max-w-sm gap-3"><IncidentEscalationCard code="INC-198" priority="P2" title="ໄຟຟ້າດັບ ອາຄານ C" openedAt={Date.now() - 20 * 60_000} slaMinutes={15} onDispatch={() => {}} /><IncidentEscalationCard code="INC-190" priority="P3" title="ລູກຄ້າຂໍເພີ່ມຍາມ" openedAt={Date.now() - 3600_000} resolved /></div>, code: "<IncidentEscalationCard priority=\"P2\" openedAt={t} slaMinutes={15} />\n<IncidentEscalationCard resolved … />" },
    ],
    props: [
      { name: "priority", type: '"P1" | "P2" | "P3"', def: '"P2"', desc: "P1 = red bar, pulsing badge, red dispatch button." },
      { name: "openedAt / slaMinutes", type: "number / number", def: "— / 15", desc: "Countdown in mm:ss; amber below a third left, red and negative once overdue." },
      { name: "reporterPhone", type: "string | number", desc: "Shows ContactActions (WhatsApp for 020 / 030, plus call)." },
      { name: "resolved", type: "boolean", desc: "Stops the timer and hides the button." },
      { name: "now", type: "number", desc: "Fixed clock for tests and screenshots." },
    ],
    notes: ["The timer ticks once a second and stops when resolved or unmounted.", "slaLeft() is pure and unit tested."],
  },
  {
    slug: "guard-id-badge", name: "Guard ID badge", group: "Data display", badge: "New",
    desc: "A guard's ID card on screen and in print (85.6 mm wide): VKS logo, photo, name, staff ID, role, posted site, status and a QR slot.",
    file: "packages/ui/src/components/business.tsx", importLine: 'import { GuardIdBadge, type GuardIdStatus } from "@vks-kit/ui"',
    demo: () => <div className="grid w-full gap-4 sm:grid-cols-2"><GuardIdBadge name="ທ້າວ ຄຳພັນ ພົມມະວົງ" staffId="VKS-ID-0412" role="ຫົວໜ້າຊຸດປະຈຳການ" site="ທະນາຄານ BCEL (ສຳນັກງານໃຫຍ່)" validUntil="31/12/2027" qr={qr} /><GuardIdBadge name="ນາງ ບົວໄລ ສີສະຫວັດ" staffId="VKS-ID-0388" role="ຍາມ" status="suspended" /></div>,
    code: `<GuardIdBadge name={g.name} staffId={g.code} role={g.role} site={g.site} photo={g.photo}
  status={g.active ? "active" : "suspended"} validUntil="31/12/2027" qr={<img src={qrUrl(g.code)} alt="" />} />`,
    props: [
      { name: "status", type: '"active" | "suspended" | "expired"', def: '"active"', desc: "Green, red or amber badge." },
      { name: "qr", type: "ReactNode", desc: "Drawn by the app (img or svg). The kit has no QR encoder." },
      { name: "photo", type: "string", desc: "Photo URL; initials when missing." },
    ],
    notes: ["The header uses the fixed logo navy in both themes, like the logo itself.", "When printed the card is 85.6 mm wide with colours kept (print-color-adjust: exact)."],
  },
  {
    slug: "contract-quote", name: "Contract quote summary", group: "Form", badge: "New",
    desc: "Guard-service price quote: one row per line with a − / + count, then subtotal, discount, VAT 10 % and total in Kip, tabular digits. Read-only without onChange (print, client report).",
    file: "packages/ui/src/components/business.tsx", importLine: 'import { ContractQuoteSummary, quoteTotals, type QuoteLine } from "@vks-kit/ui"',
    demo: () => <Quote />,
    code: `const [lines, setLines] = useState<QuoteLine[]>([
  { id: "g", label: "ພະນັກງານຍາມ 12 ຊົ່ວໂມງ", qty: 10, unitPrice: 8_000_000, unit: "ນາຍ", min: 1 },
])
<ContractQuoteSummary title="ໃບສະເໜີລາຄາ" lines={lines} onChange={setLines} vatRate={0.1} />
quoteTotals(lines)   // { subtotal: 80000000, discount: 0, base: 80000000, vat: 8000000, total: 88000000 }`,
    examples: [
      { id: "money-phone", title: "Kip amount and Lao phone fields (already in the kit)", note: "The audit's CurrencyKipInput and LaoPhoneInput are MoneyInput and PhoneInput: thousands commas + ກີບ, and 020 XXXX XXXX.", demo: () => <MoneyPhone />, code: "<MoneyInput value={fee} onChange={setFee} />            // LAK, commas, ກີບ\n<PhoneInput value={tel} onChange={setTel} />            // 020 XXXX XXXX" },
      { id: "print", title: "Read-only with a discount", demo: () => <div className="w-full max-w-lg"><ContractQuoteSummary lines={LINES} discount={2_000_000} period="" /></div>, code: "<ContractQuoteSummary lines={lines} discount={2_000_000} period=\"\" />" },
    ],
    props: [
      { name: "lines", type: "QuoteLine[]", desc: "{ id, label, qty, unitPrice (Kip), unit?, min?, max? }." },
      { name: "onChange", type: "(lines) => void", desc: "Shows a Stepper per line. Omit for read-only." },
      { name: "vatRate / discount", type: "number / number", def: "0.1 / 0", desc: "Discount is taken off before VAT and never exceeds the subtotal." },
      { name: "period", type: "string", def: '"ເດືອນ"', desc: "After the total; \"\" hides it." },
    ],
    notes: ["quoteTotals() rounds to whole Kip and is unit tested.", "Amounts use fmtKip (\"80,000,000 ກີບ\"), never the ₭ glyph."],
  },
]

function MoneyPhone() {
  const [fee, setFee] = React.useState<number | null>(8_000_000), [tel, setTel] = React.useState("020 5512 8890")
  return <div className="grid w-full max-w-sm gap-3"><Field label="ຄ່າບໍລິການລາຍເດືອນ"><MoneyInput value={fee} onChange={setFee} /></Field><Field label="ເບີໂທຜູ້ປະສານງານ"><PhoneInput value={tel} onChange={setTel} /></Field></div>
}
