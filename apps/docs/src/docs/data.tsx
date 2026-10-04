import * as React from "react"
import { Avatar, AvatarGroup, UserChip, ProgressRing, Progress, Accordion, AccordionItem, AccordionTrigger, AccordionContent, StarRating, Timeline, KpiStrip, KpiHero, Pagination, Table, THead, TBody, TR, TH, TD, Badge, sortRows, type SortState, DataTable, type Column, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button } from "@vks-kit/ui"
import { ScanLine, Clock, AlertTriangle, Wallet } from "@vks-kit/ui/icons"
import { fmtKip, fmtKipShort } from "@vks-kit/core"
import { Roadmap, DependencyMap } from "@vks-kit/ui"
import { ApprovalCard, diffFields } from "@vks-kit/ui"
import type { Doc } from "./types"

type Row = { id: string; site: string; guard: string; time: string; status: string; shift: string; kip: number }
const rows: Row[] = [
  { id: "1", site: "ປະຕູໜ້າ", guard: "ສົມຊາຍ", time: "08:12", status: "ສຳເລັດ", shift: "ກາງເວັນ", kip: 1250000 },
  { id: "2", site: "ບ່ອນຈອດລົດ", guard: "ນາງບົວ", time: "08:41", status: "ສຳເລັດ", shift: "ກາງເວັນ", kip: 980000 },
  { id: "3", site: "ຄັງສິນຄ້າ", guard: "ທ້າວດາວ", time: "—", status: "ລໍຖ້າ", shift: "ກາງຄືນ", kip: 0 },
]
function SortTableDemo() {
  const [sort, setSort] = React.useState<SortState>(null)
  const get = (r: Row, k: string) => (k === "site" ? r.site : k === "time" ? r.time : k === "kip" ? r.kip : r.status)
  const data = sortRows(rows, sort, get)
  return <div className="w-full"><Table><THead><TR>
    <TH sortKey="site" sort={sort} onSort={setSort}>ຈຸດກວດ</TH><TH sortKey="time" sort={sort} onSort={setSort}>ເວລາ</TH><TH sortKey="status" sort={sort} onSort={setSort}>ສະຖານະ</TH><TH sortKey="kip" sort={sort} onSort={setSort} align="right">ເງິນ</TH>
  </TR></THead><TBody key={sort ? sort.key + sort.dir : "none"} animate>{data.map((r) => <TR key={r.id}><TD>{r.site}</TD><TD>{r.time}</TD><TD><Badge variant={r.status === "ສຳເລັດ" ? "success" : "warning"}>{r.status}</Badge></TD><TD className="text-right tabular-nums">{fmtKip(r.kip)}</TD></TR>)}</TBody></Table>
  <p className="mt-2 text-xs text-muted-foreground">Tap a header: ↑ asc → ↓ desc → off.</p></div>
}
const cols: Column<Row>[] = [
  { key: "s", header: "ຈຸດ", cell: (r) => r.site, primary: true },
  { key: "g", header: "ພະນັກງານ", cell: (r) => <span className="inline-flex items-center gap-2"><Avatar name={r.guard} size={24} />{r.guard}</span>, primary: true },
  { key: "t", header: "ເວລາ", cell: (r) => r.time }, { key: "sh", header: "ກະ", cell: (r) => r.shift },
  { key: "st", header: "ສະຖານະ", cell: (r) => <Badge variant={r.status === "ສຳເລັດ" ? "success" : "warning"}>{r.status}</Badge> },
  { key: "k", header: "ເງິນ", cell: (r) => fmtKip(r.kip) },
]
function DT({ mode }: { mode?: "cards" | "table" | "loading" | "error" | "empty" }) {
  return <div className="w-full"><DataTable columns={cols} rows={mode === "empty" ? [] : rows} rowKey={(r) => r.id} mode={mode === "cards" ? "cards" : mode === "table" ? "table" : "auto"} loading={mode === "loading"} error={mode === "error" ? "ໂຫຼດບໍ່ສຳເລັດ" : undefined} onRetry={() => {}} /></div>
}
function Stars() { const [v, setV] = React.useState(4); return <StarRating value={v} onChange={setV} /> }
function Pages() { const [p, setP] = React.useState(3); return <Pagination page={p} pages={9} onPage={setP} /> }

export const dataDocs: Doc[] = [
  {
    slug: "card", name: "Card", group: "Data display", badge: "Stable",
    desc: "The basic box. White on light, navy-ink on dark.",
    file: "packages/ui/src/components/card.tsx", importLine: 'import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@vks-kit/ui"',
    demo: () => <Card className="vks-lift w-full max-w-sm"><CardHeader><CardTitle>ປະຕູໜ້າ</CardTitle><CardDescription>A-01 · ກາງເວັນ</CardDescription></CardHeader><CardContent className="text-sm">ສະແກນລ່າສຸດ 08:12 ໂດຍ ສົມຊາຍ.</CardContent><CardFooter><Button size="sm" variant="outline">ລາຍລະອຽດ</Button></CardFooter></Card>,
    code: `<Card>
  <CardHeader>
    <CardTitle>ປະຕູໜ້າ</CardTitle>
    <CardDescription>A-01 · ກາງເວັນ</CardDescription>
  </CardHeader>
  <CardContent>…</CardContent>
  <CardFooter><Button size="sm" variant="outline">ລາຍລະອຽດ</Button></CardFooter>
</Card>`,
  },
  {
    slug: "data-table", name: "Data table", group: "Data display", badge: "Mobile",
    desc: "A table on desktop that turns into cards on a phone when there are more than 4 columns. Loading, error and empty states built in.",
    file: "packages/ui/src/components/data-table.tsx", importLine: 'import { DataTable, type Column } from "@vks-kit/ui"',
    demo: () => <DT />,
    code: `const cols: Column<Row>[] = [
  { key: "s", header: "ຈຸດ", cell: (r) => r.site, primary: true },
  { key: "st", header: "ສະຖານະ", cell: (r) => <Badge variant="success">{r.status}</Badge> },
  { key: "k", header: "ເງິນ", cell: (r) => fmtKip(r.kip) },
]
<DataTable columns={cols} rows={rows} rowKey={(r) => r.id} onRowClick={open} />`,
    examples: [
      { id: "cards", title: "Card layout (what phones see)", note: "mode=\"cards\" forces cards at every width, e.g. inside a narrow side panel on desktop.", demo: () => <DT mode="cards" />, code: `<DataTable mode="cards" columns={cols} rows={rows} rowKey={(r) => r.id} />` },
      { id: "table-only", title: "Always a table", note: "mode=\"table\" keeps the table on a phone. Only for ≤ 4 short columns; wide tables scroll sideways and nobody finds the last column. See the Desktop ↔ Mobile guide.", demo: () => <DT mode="table" />, code: `<DataTable mode="table" columns={cols} rows={rows} rowKey={(r) => r.id} />` },
      { id: "loading", title: "Loading", demo: () => <DT mode="loading" />, code: `<DataTable loading … />` },
      { id: "error", title: "Error with retry", demo: () => <DT mode="error" />, code: `<DataTable error="ໂຫຼດບໍ່ສຳເລັດ" onRetry={refetch} … />` },
      { id: "empty", title: "Empty", demo: () => <DT mode="empty" />, code: `<DataTable rows={[]} emptyTitle="ຍັງບໍ່ມີຂໍ້ມູນ" … />` },
    ],
    props: [
      { name: "columns", type: "{ key; header; cell(row); primary?; className? }[]", desc: "primary columns become the card title on a phone." },
      { name: "rows", type: "T[]", desc: "" }, { name: "rowKey", type: "(row: T) => string", desc: "" },
      { name: "onRowClick", type: "(row: T) => void", desc: "Pair with Drawer." }, { name: "loading", type: "boolean", desc: "Shimmer rows." },
      { name: "error / onRetry", type: "string / () => void", desc: "" }, { name: "emptyTitle", type: "string", def: '"ຍັງບໍ່ມີຂໍ້ມູນ"', desc: "" },
      { name: "mode", type: '"auto" | "table" | "cards"', def: '"auto"', desc: "auto = table on desktop, cards on a phone when there are more than 4 columns. table / cards force one layout." },
      { name: "sortValue (column)", type: "(row: T) => string | number | Date", desc: "Give it to a column to make its header sortable." },
      { name: "forceCards", type: "boolean", desc: "Deprecated: use mode=\"cards\". Still works." },
    ],
  },
  {
    slug: "table", name: "Table", group: "Data display", badge: "Stable",
    desc: "Plain table parts with a navy header. Every column can sort: pass sortKey + sort + onSort to TH.",
    file: "packages/ui/src/components/table.tsx", importLine: 'import { Table, THead, TBody, TR, TH, TD } from "@vks-kit/ui"',
    demo: SortTableDemo,
    device: "desktop", notes: ["Desktop only: a wide table does not fit a phone. On a phone use DataTable (it turns rows into cards) or ListGroup."],
    code: `const [sort, setSort] = useState<SortState>(null)
const data = sortRows(rows, sort, (r, k) => r[k])
<Table>
  <THead><TR><TH sortKey="site" sort={sort} onSort={setSort}>ຈຸດກວດ</TH><TH sortKey="time" sort={sort} onSort={setSort}>ເວລາ</TH></TR></THead>
  <TBody><TR><TD>ປະຕູໜ້າ</TD><TD>08:12</TD></TR></TBody>
</Table>`,
  },
  {
    slug: "kpi-hero", bleed: true, name: "KPI hero card", group: "Data display", badge: "New", device: "mobile",
    desc: "The phone version of KpiStrip: ONE big number with a trend pill and sparkline, plus up to 3 small figures underneath. Takes about a quarter of the screen instead of the whole first page.",
    file: "packages/ui/src/components/data-display.tsx", importLine: 'import { KpiHero } from "@vks-kit/ui"',
    demo: () => <div className="w-full sm:max-w-sm"><KpiHero className="max-sm:rounded-none max-sm:border-x-0" label="ຕົງເວລາມື້ນີ້" value="94" unit="%" hint="+2% ຈາກມື້ວານ" tone="success" icon={<ScanLine />} spark={[88, 90, 89, 92, 91, 93, 94]}
      secondary={[{ label: "ສະແກນ", value: "2,431" }, { label: "ຊ້າ", value: "18" }, { label: "ພາດ", value: "3" }]} /></div>,
    code: `<KpiHero label="ຕົງເວລາມື້ນີ້" value="94" unit="%" hint="+2% ຈາກມື້ວານ" tone="success" icon={<ScanLine />}
  spark={[88, 90, 89, 92, 91, 93, 94]}
  secondary={[{ label: "ສະແກນ", value: "2,431" }, { label: "ຊ້າ", value: "18" }, { label: "ພາດ", value: "3" }]} />`,
    props: [
      { name: "label / value / unit", type: "string / ReactNode / string", desc: "The one number that matters. unit = %, ກີບ…" },
      { name: "hint / trend / tone", type: "string / up | down | flat / success | warning | danger", desc: "hint starting with + or - gets an arrow pill automatically." },
      { name: "spark", type: "number[]", desc: "Faint trend line behind the card." },
      { name: "secondary", type: "{ label; value }[] (max 3)", desc: "Compact row under a divider." },
    ],
    notes: ["Pick ONE hero per screen. Put the rest below as StatCard rows (flush, one full-width grouped list) or in the DateGrid."],
  },
  {
    slug: "kpi-strip", name: "KPI strip", group: "Data display", badge: "New",
    desc: "Top-of-dashboard numbers for DESKTOP: 4 tiles in a row. On a phone use KpiHero (one hero card), because 4 tiles eat the first screen. Money uses ກີບ, never ₭.",
    device: "desktop",
    file: "packages/ui/src/components/data-display.tsx", importLine: 'import { KpiStrip } from "@vks-kit/ui"',
    demo: () => <div className="w-full"><KpiStrip items={[
      { label: "ສະແກນມື້ນີ້", value: "2,431", hint: "+12%", tone: "success", icon: <ScanLine />, spark: [12, 18, 15, 22, 20, 28, 34] },
      { label: "ຊ້າ", value: "18", hint: "-4 ຈາກມື້ວານ", tone: "warning", icon: <Clock />, spark: [9, 14, 11, 16, 13, 12, 10] },
      { label: "ພາດ", value: "3", hint: "ຕ້ອງຕິດຕາມ", tone: "danger", icon: <AlertTriangle />, spark: [2, 4, 3, 5, 2, 3, 3] },
      { label: "ເງິນເດືອນ", value: fmtKipShort(482000000), hint: "+3.2%", icon: <Wallet />, spark: [40, 41, 41, 44, 46, 47, 48] },
    ]} /></div>,
    code: `<KpiStrip items={[
  { label: "ສະແກນມື້ນີ້", value: "2,431", hint: "+12%", tone: "success", icon: <ScanLine />, spark: [12, 18, 15, 22, 34] },
  { label: "ຊ້າ", value: "18", hint: "-4 ຈາກມື້ວານ", tone: "warning", icon: <Clock /> },
  { label: "ເງິນເດືອນ", value: fmtKipShort(482000000), hint: "+3.2%", icon: <Wallet /> },
]} />`,
    props: [{ name: "items", type: '{ label; value: ReactNode; hint?; tone?; icon?: ReactNode; trend?: "up" | "down" | "flat"; spark?: number[] }[]', desc: "hint starting with + or - gets an automatic up/down arrow pill. spark draws a faint trend line behind the tile." }],
  },
  {
    slug: "timeline", name: "Timeline", group: "Data display", badge: "New",
    desc: "What happened on a shift, newest first.",
    file: "packages/ui/src/components/data-display.tsx", importLine: 'import { Timeline } from "@vks-kit/ui"',
    demo: () => <div className="w-full max-w-sm"><Timeline items={[{ id: "1", time: "08:12", title: "ສະແກນປະຕູໜ້າ", tone: "success" }, { id: "2", time: "08:41", title: "ຊ້າ 6 ນາທີ", detail: "ບ່ອນຈອດລົດ", tone: "warning" }, { id: "3", time: "09:05", title: "ພາດຈຸດ", tone: "danger" }]} /></div>,
    code: `<Timeline items={[
  { id: "1", time: "08:12", title: "ສະແກນປະຕູໜ້າ", tone: "success" },
  { id: "2", time: "08:41", title: "ຊ້າ 6 ນາທີ", detail: "ບ່ອນຈອດລົດ", tone: "warning" },
]} />`,
    props: [
      { name: "items", type: '{ id; time; title; detail?; tone?: "success" | "warning" | "danger" | "neutral"; actor?; changes? }[]', desc: "" },
      { name: "items[].actor", type: "string", desc: "Audit trail: who did it. Shown after the time." },
      { name: "items[].changes", type: "{ field; label; from; to }[]", desc: "Audit trail: changed fields, old value struck through, then the new one. Build it with diffFields(before, after, { labels, ignore })." },
    ],
    examples: [
      { id: "audit", title: "Audit trail (who, what, when, diff)", note: "Same Timeline with actor and changes. diffFields skips fields that did not change; pass ignore for noise such as updatedAt.", demo: () => <div className="w-full max-w-sm"><Timeline items={[
        { id: "2", time: "02/10 09:02", actor: "ຫົວໜ້າ ຕົວຢ່າງ", title: "ແກ້ໄຂກະເຂົ້າວຽກ", tone: "warning", changes: diffFields({ shift: "ກາງເວັນ", site: "ຈຸດ A", start: "06:00" }, { shift: "ກາງຄືນ", site: "ຈຸດ B", start: "06:00" }, { labels: { shift: "ກະ", site: "ສະຖານທີ່", start: "ເລີ່ມ" } }) },
        { id: "1", time: "02/10 08:15", actor: "ພະນັກງານ ຕົວຢ່າງ", title: "ສ້າງລາຍການ", tone: "neutral" },
      ]} /></div>, code: `import { Timeline, diffFields } from "@vks-kit/ui"

<Timeline items={log.map((e) => ({
  id: e.id, time: e.at, actor: e.by, title: e.action,
  changes: diffFields(e.before, e.after, { labels: { shift: "ກະ", site: "ສະຖານທີ່" }, ignore: ["updatedAt"] }),
}))} />` },
    ],
    notes: ["Audit rows are read-only. Never let the user edit history in place."],
  },
  {
    slug: "approval-card", name: "Approval card", group: "Data display", badge: "New",
    desc: "One request that needs a yes or no from a manager: what, who asked, when. Approve, or Reject with a required reason.",
    file: "packages/ui/src/components/business.tsx", importLine: 'import { ApprovalCard, rejectReasonError, type ApprovalStatus } from "@vks-kit/ui"',
    demo: () => <div className="grid w-full max-w-sm gap-4"><ApprovalCard title="ຂໍລາພັກ 2 ມື້" summary="03–04/10 · ທຸລະກິດຄອບຄົວ" requester="ພະນັກງານ ຕົວຢ່າງ" requesterRole="ຍາມ · ຈຸດ A" requestedAt="02/10 08:15" status="pending" onApprove={() => new Promise((r) => setTimeout(r, 600))} onReject={() => new Promise((r) => setTimeout(r, 600))} /></div>,
    code: `<ApprovalCard
  title="ຂໍລາພັກ 2 ມື້" summary="03–04/10 · ທຸລະກິດຄອບຄົວ"
  requester={req.name} requesterRole={req.role} requestedAt={req.at}
  status={req.status}
  onApprove={() => api.approve(req.id)}
  onReject={(reason) => api.reject(req.id, reason)}   // reason is already cleanText()-ed
/>`,
    examples: [
      { id: "states", title: "Approved and rejected", note: "After a decision the buttons go away and the card shows who decided, when, and the reason.", demo: () => <div className="grid w-full max-w-sm gap-4"><ApprovalCard title="ຂໍເຮັດ OT 4 ຊົ່ວໂມງ" requester="ພະນັກງານ ຕົວຢ່າງ" requestedAt="01/10 16:00" status="approved" decidedBy="ຫົວໜ້າ ຕົວຢ່າງ" decidedAt="01/10 16:20" /><ApprovalCard title="ຂໍປ່ຽນຈຸດປະຈຳການ" requester="ພະນັກງານ ຕົວຢ່າງ" requestedAt="30/09 10:00" status="rejected" decidedBy="ຫົວໜ້າ ຕົວຢ່າງ" decidedAt="30/09 11:05" reason="ຈຸດ B ຄົນເຕັມແລ້ວ" /></div>, code: `<ApprovalCard status="approved" decidedBy="…" decidedAt="…" {...req} />
<ApprovalCard status="rejected" decidedBy="…" decidedAt="…" reason={req.reason} {...req} />` },
    ],
    props: [
      { name: "title / summary", type: "ReactNode", desc: "What is asked. Keep the title to one line." },
      { name: "requester / requesterRole / requestedAt", type: "string", desc: "Who asked and when (pre-formatted)." },
      { name: "status", type: '"pending" | "approved" | "rejected"', desc: "Buttons show only when pending." },
      { name: "decidedBy / decidedAt / reason", type: "string", desc: "Shown after a decision; reason only when rejected." },
      { name: "onApprove", type: "() => void | Promise", desc: "Button spins until the promise settles." },
      { name: "onReject", type: "(reason: string) => void | Promise", desc: "Called only when rejectReasonError() passes (not empty, at least 5 characters after cleanText)." },
      { name: "labels", type: "Partial<ApprovalLabels>", desc: "Override any Lao button or status text." },
      { name: "children", type: "ReactNode", desc: "Extra detail rows under the summary." },
    ],
    notes: ["Reject always needs a reason. The requester sees it.", "Keep the decision on the server too: the card only shows the status you pass."],
  },
  {
    slug: "roadmap", name: "Roadmap & dependency map", group: "Data display", badge: "New",
    desc: "Plan views. Roadmap: phases as bars across months (Gantt) with a progress fill, gold milestone diamonds and a red today line. DependencyMap: boxes in columns with arrows from what each one needs; hover or focus a box to light its whole chain. Both are click-to-open (pair with Drawer). Phone: both scroll sideways inside their card.",
    file: "packages/ui/src/components/roadmap.tsx", importLine: 'import { Roadmap, DependencyMap, planPct, planMonths, layoutDeps, type RoadmapRow, type RoadmapMilestone, type DepNode } from "@vks-kit/ui"',
    demo: () => <div className="w-full space-y-6">
      <Roadmap start="2026-10-01" end="2027-04-01" today="2026-10-20"
        rows={[{ id: "p0", label: "P0 · Kit", start: "2026-10-01", end: "2026-11-10", progress: 60, tone: "success" }, { id: "p1", label: "P1 · Foundation", sub: "3 items", start: "2026-11-01", end: "2027-01-10" }, { id: "p2", label: "P2 · Live duty", start: "2027-01-01", end: "2027-03-20", tone: "gold" }]}
        milestones={[{ id: "m1", at: "2026-11-10", label: "Kit 0.3" }, { id: "m2", at: "2027-03-20", label: "Pilot" }]} />
      <DependencyMap columns={["P0", "P1", "P2"]} nodes={[{ id: "a", label: "Kit", sub: "done", column: 0, tone: "success" }, { id: "b", label: "Auth + roles", sub: "planned", column: 1, deps: ["a"] }, { id: "c", label: "Schema", sub: "decided", column: 1, deps: ["a"], tone: "gold" }, { id: "d", label: "QR scan", sub: "planned", column: 2, deps: ["b", "c"] }]} />
    </div>,
    code: `<Roadmap start="2026-10-01" end="2027-10-01" today={todayIso}
  rows={[{ id: "p1", label: "P1 · Foundation", start: "2026-11-01", end: "2027-01-15", progress: 20, tone: "primary" }]}
  milestones={[{ id: "m1", at: "2027-01-15", label: "Schema migrated" }]}
  onSelect={(row) => openDrawer(row.id)} onMilestone={(m) => openDrawer(m.id)} />

<DependencyMap columns={["P0", "P1", "P2"]}
  nodes={[{ id: "auth", label: "Auth", column: 1, deps: ["repo"], tone: "warning" }, …]}
  onSelect={(n) => openDrawer(n.id)} />`,
    props: [
      { name: "start / end / today", type: "ISO date", desc: "Roadmap range; today draws the red line when inside the range." },
      { name: "rows", type: "{ id; label; sub?; start; end; progress?; tone? }[]", desc: "tone: primary | gold | success | warning | destructive | muted." },
      { name: "milestones", type: "{ id; at; label }[]", desc: "Gold diamonds on their own row." },
      { name: "onSelect / onMilestone", type: "(row) => void", desc: "Click a bar or label / a diamond." },
      { name: "milestoneLabel / todayLabel / locale", type: "string", def: '"Milestones" / "today" / "en"', desc: "Pass Lao strings and \"lo\" for Lao screens." },
      { name: "nodes", type: "{ id; label; sub?; column; deps?; tone? }[]", desc: "DependencyMap. column = left-to-right group; deps = ids this node needs." },
      { name: "columns", type: "string[]", desc: "DependencyMap column headings." },
    ],
    notes: ["planPct, planMonths and layoutDeps are pure and unit tested.", "No chart library: plain divs and SVG, so it ships in the main entry and costs a few KB."],
  },
  {
    slug: "avatar-progress", name: "Avatar & progress", group: "Data display", badge: "Stable",
    desc: "Initials avatar (works with Lao names) and a labelled progress bar.",
    file: "packages/ui/src/components/data-display.tsx", importLine: 'import { Avatar, AvatarGroup, UserChip, Progress, ProgressRing } from "@vks-kit/ui"',
    demo: () => <div className="grid w-full max-w-sm gap-4"><div className="flex items-center gap-2"><Avatar name="ສົມຊາຍ ແກ້ວ" /><Avatar name="Bounmy K" size={32} /><Avatar name="ນາງບົວ" size={48} /></div><Progress value={12} max={20} label="ຈຸດກວດ 12 / 20" /></div>,
    code: `<Avatar name="ສົມຊາຍ ແກ້ວ" />
<Avatar name="Bounmy K" size={32} src={photoUrl} />
<Progress value={12} max={20} label="ຈຸດກວດ 12 / 20" />`,
    examples: [
      { id: "avatar-group", title: "Avatar group & user chip", note: "Group stacks faces and shows +N after max. UserChip is avatar + name + sub line for lists and sidebars.",
        demo: () => <div className="grid gap-4"><AvatarGroup people={[{ name: "ສົມຊາຍ" }, { name: "ນາງບົວ" }, { name: "ທ້າວດາວ" }, { name: "Bounmy" }, { name: "ແສງ" }, { name: "ພອນ" }]} max={4} /><UserChip name="ສົມຊາຍ ແກ້ວ" sub="ຫົວໜ້າກະ · ປະຕູໜ້າ" status="online" /></div>,
        code: `<AvatarGroup people={staff} max={4} />
<UserChip name="ສົມຊາຍ ແກ້ວ" sub="ຫົວໜ້າກະ · ປະຕູໜ້າ" status="online" />` },
      { id: "progress-ring", title: "Progress ring", note: "Circular gauge for a single score. tone: success | warning | danger | gold.",
        demo: () => <div className="flex items-center gap-4"><ProgressRing value={86} label="86%" /><ProgressRing value={42} tone="warning" size={80} label="42%" /></div>,
        code: `<ProgressRing value={86} label="86%" />
<ProgressRing value={42} tone="warning" size={80} label="42%" />` },
    ],
    props: [{ name: "name", type: "string", desc: "Avatar: initials come from it." }, { name: "size", type: "number", def: "40", desc: "px" }, { name: "value / max / label", type: "number / number / string", def: "— / 100 / —", desc: "Progress." }],
  },
  {
    slug: "accordion", name: "Accordion", group: "Data display", badge: "Stable",
    desc: "FAQ and long forms broken into parts.",
    file: "packages/ui/src/components/data-display.tsx", importLine: 'import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@vks-kit/ui"',
    demo: () => <Accordion type="single" collapsible defaultValue="a" className="w-full max-w-md"><AccordionItem value="a"><AccordionTrigger>ລືມລະຫັດຜ່ານເຮັດແນວໃດ?</AccordionTrigger><AccordionContent>ຕິດຕໍ່ຫົວໜ້າກະ ຫຼື HR.</AccordionContent></AccordionItem><AccordionItem value="b"><AccordionTrigger>ເນັດບໍ່ມີ ສະແກນໄດ້ບໍ?</AccordionTrigger><AccordionContent>ໄດ້. ຂໍ້ມູນຈະສົ່ງເອງເມື່ອມີເນັດ.</AccordionContent></AccordionItem></Accordion>,
    code: `<Accordion type="single" collapsible>
  <AccordionItem value="a">
    <AccordionTrigger>ລືມລະຫັດຜ່ານເຮັດແນວໃດ?</AccordionTrigger>
    <AccordionContent>ຕິດຕໍ່ຫົວໜ້າກະ ຫຼື HR.</AccordionContent>
  </AccordionItem>
</Accordion>`,
  },
  {
    slug: "rating-pagination", name: "Star rating & pagination", group: "Data display", badge: "Stable",
    desc: "Inspection scores and paged lists. Both 44 px targets.",
    file: "packages/ui/src/components/data-display.tsx", importLine: 'import { StarRating, Pagination } from "@vks-kit/ui"',
    demo: () => <div className="flex flex-col items-center gap-4"><Stars /><Pages /></div>,
    code: `<StarRating value={score} onChange={setScore} />
<Pagination page={page} pages={9} onPage={setPage} />`,
    props: [{ name: "value / onChange / max", type: "number / (v) => void / number", def: "— / — / 5", desc: "StarRating; no onChange = read only." }, { name: "page / pages / onPage", type: "number / number / (p) => void", desc: "Pagination." }],
  },
]