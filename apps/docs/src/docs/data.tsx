import * as React from "react"
import { Avatar, AvatarGroup, UserChip, ProgressRing, Progress, Accordion, AccordionItem, AccordionTrigger, AccordionContent, StarRating, Timeline, KpiStrip, KpiHero, Pagination, Table, THead, TBody, TR, TH, TD, Badge, sortRows, type SortState, DataTable, type Column, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button } from "@vks-kit/ui"
import { ScanLine, Clock, AlertTriangle, Wallet } from "@vks-kit/ui/icons"
import { fmtKip, fmtKipShort } from "@vks-kit/core"
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
    props: [{ name: "items", type: '{ id; time; title; detail?; tone?: "success" | "warning" | "danger" | "neutral" }[]', desc: "" }],
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