import * as React from "react"
import { Home, ClipboardList, Users, BarChart3, Settings, Bell, Plus, Moon, Sun, MapPin, FileText, ScanLine, Wallet } from "@vks/ui/icons"
import {
  AppShell, PageHeader, Fab, LoginCard, Button, Card, CardContent, CardHeader, CardTitle, Input, Label, Badge, useTheme,
  IOSAlert, ActionSheet, Banner, ListGroup, ListRow, SkeletonList, SkeletonCard, NumberTicker, FloatingInput, PasswordInput, Chip, CopyButton, Menu, MenuTrigger, MenuContent, MenuItem, PerfToggle,
  DatePicker, Calendar, Combobox, FilterChips, SearchBox, OtpInput, SignaturePad, Lightbox, DataTable, Drawer, Wizard,
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose, InSheetView,
  Avatar, Progress, Accordion, DateRangePicker, Alert, ConfirmDialog, SwipeRow, PullToRefresh, toast, Toaster, type Range, AccordionItem, AccordionTrigger, AccordionContent, StarRating, Timeline, KpiStrip, KpiHero, Pagination, LoginScreen, ProfileView, type Column,
} from "@vks/ui"
import {
  SearchBar, Carousel, useProgressHUD, SnapSheet, IndexedList, BottomToolbar, useLongPress, useShareSheet, ShareSheet,
  Sidebar, SidebarSheet, Slider, DetailPopover, type NavItem,
  CommandPalette, useCommandK, Breadcrumb, HoverCard, ContextMenu, TreeView, StatCard, ButtonGroup, Dropzone, fmtBytes, FileIcon, TagInput, SplitPane, NotificationList, ScrollArea, type Notice,
  HoverFx, Parallax, ParallaxLayer, SlideHighlight, CursorRing, Logo,
} from "@vks/ui"
import { Share2, Pencil, Phone, Trash2, Heart, Shield, AlertTriangle, CheckCircle2, Clock, Folder, User, Copy as CopyIcon, Search as SearchIcon, ArrowRight } from "@vks/ui/icons"
import { BarSeries, LineSeries, Donut, Sparkline, ScatterSeries, RadarSeries, RadialBars, ComboSeries, Heatmap, DateGrid, LatencyTimeline, AttendanceBoard } from "@vks/ui/charts"
import { MapView } from "@vks/ui/map"
import { Kanban, type KanbanCard } from "@vks/ui/kanban"
import { QrScanner, PhotoCapture, CaptureStamp, stampPhoto, stampTime } from "@vks/ui/scan"
import { fmtKip, fmtKipShort, t, setLang, getLang } from "@vks/core"

const Sec = ({ id, title, children }: { id: string; title: string; children: React.ReactNode }) => (
  <section id={id} className="scroll-mt-20 space-y-3"><h2 className="text-lg font-bold">{title}</h2>{children}</section>
)
type Row = { id: string; site: string; guard: string; time: string; status: string; shift: string; kip: number }
const rows: Row[] = [
  { id: "1", site: "ປະຕູໜ້າ", guard: "ສົມຊາຍ", time: "08:12", status: "ສຳເລັດ", shift: "ກາງເວັນ", kip: 1250000 },
  { id: "2", site: "ບ່ອນຈອດລົດ", guard: "ນາງບົວ", time: "08:41", status: "ສຳເລັດ", shift: "ກາງເວັນ", kip: 980000 },
  { id: "3", site: "ຄັງສິນຄ້າ", guard: "ທ້າວດາວ", time: "—", status: "ລໍຖ້າ", shift: "ກາງຄືນ", kip: 0 },
]
const cols: Column<Row>[] = [
  { key: "s", header: "ຈຸດ", cell: (r) => r.site, primary: true },
  { key: "g", header: "ພະນັກງານ", cell: (r) => <span className="inline-flex items-center gap-2"><Avatar name={r.guard} size={24} />{r.guard}</span>, primary: true },
  { key: "t", header: "ເວລາ", cell: (r) => r.time }, { key: "sh", header: "ກະ", cell: (r) => r.shift },
  { key: "st", header: "ສະຖານະ", cell: (r) => <Badge variant={r.status === "ສຳເລັດ" ? "success" : "warning"}>{r.status}</Badge> },
  { key: "k", header: "ເງິນ", cell: (r) => fmtKip(r.kip) },
]
const nav = [
  { id: "home", label: "ໜ້າຫຼັກ", icon: <Home /> }, { id: "tasks", label: "ວຽກ", icon: <ClipboardList />, badge: 3 }, { id: "staff", label: "ພະນັກງານ", icon: <Users /> },
  { id: "reports", label: "ລາຍງານ", icon: <BarChart3 /> }, { id: "alerts", label: "ແຈ້ງເຕືອນ", icon: <Bell /> }, { id: "settings", label: "ຕັ້ງຄ່າ", icon: <Settings /> },
]

export function More() {
  const { theme, setTheme } = useTheme()
  const [nv, setNv] = React.useState("home"), [date, setDate] = React.useState("2026-09-30"), [sel, setSel] = React.useState<string[]>([]), [multi, setMulti] = React.useState<string[]>(["a"])
  const [chip, setChip] = React.useState<string[]>(["all"]), [q, setQ] = React.useState(""), [otp, setOtp] = React.useState(""), [step, setStep] = React.useState(1)
  const [drawer, setDrawer] = React.useState<Row | null>(null), [lb, setLb] = React.useState<number | null>(null), [page, setPage] = React.useState(3), [stars, setStars] = React.useState(4)
  const [range, setRange] = React.useState<Range>({ from: "2026-09-10", to: "2026-09-16" }), [confirm, setConfirm] = React.useState<null | "warning" | "danger" | "hold">(null), [rows2, setRows2] = React.useState(["ສົມຊາຍ", "ນາງບົວ", "ທ້າວດາວ"]), [al, setAl] = React.useState(true)
  const [dSite, setDSite] = React.useState<string[]>([]), [dDate, setDDate] = React.useState(""), [dRange, setDRange] = React.useState<Range>({}), [dKind, setDKind] = React.useState<string[]>(["door"]), [dPush, setDPush] = React.useState(false)
  const [lang, setL] = React.useState(getLang()), [scan, setScan] = React.useState(false), [last, setLast] = React.useState("")
  const [cards, setCards] = React.useState<KanbanCard[]>([{ id: "a", column: "todo", title: "ກວດປະຕູ 3", meta: "ດ່ວນ" }, { id: "b", column: "todo", title: "ສົ່ງລາຍງານ" }, { id: "c", column: "doing", title: "ຝຶກອົບຮົມ" }])
  const sites = [{ value: "a", label: "ປະຕູໜ້າ", hint: "A-01" }, { value: "b", label: "ບ່ອນຈອດລົດ", hint: "A-02" }, { value: "c", label: "ຄັງສິນຄ້າ", hint: "B-01" }, { value: "d", label: "ຫ້ອງຄວບຄຸມ", hint: "B-02" }]
  const chart = ["ຈ", "ອ", "ພ", "ພຫ", "ສ", "ສ.", "ອາ"].map((d, i) => ({ d, ok: [82, 91, 88, 95, 90, 70, 65][i], late: [8, 4, 6, 2, 5, 12, 9][i] }))
  const tok = (v: string) => getComputedStyle(document.documentElement).getPropertyValue(v).trim()   // live theme token, no raw colours
  const img = (c: string) => "data:image/svg+xml," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="640" height="420"><rect width="640" height="420" fill="' + c + '"/><text x="320" y="220" font-size="42" fill="' + tok("--primary-foreground") + '" text-anchor="middle">VKS</text></svg>')
  const imgs = ["--primary", "--success", "--gold"].map((v, i) => ({ src: img(tok(v)), caption: "photo " + (i + 1) }))
  return (
    <AppShell items={nav} active={nv} onNavigate={setNv} title="VKS Demo" fab={<Fab label="add" icon={<Plus />} onClick={() => setDrawer(rows[0])} />}
      header={<><b className="text-lg">ພາກ 2 · ສ່ວນປະກອບ</b>
        <a href="#/" className="inline-flex min-h-11 items-center px-2 text-sm underline">Part 1</a>
        <Button variant="ghost" size="sm" className="ml-auto" onClick={() => { const n = lang === "lo" ? "en" : "lo"; setLang(n); setL(n) }}>{lang.toUpperCase()}</Button>
        <Button data-testid="theme-toggle" variant="gold" size="sm" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>{theme === "light" ? <Moon /> : <Sun />}</Button></>}
      user={<div className="flex items-center gap-2"><Avatar name="Admin User" size={32} /><span className="text-sm">Admin</span></div>}>
      <div className="mx-auto max-w-5xl space-y-10">
        <Sec id="kpi" title="KPI strip, progress, rating, sparkline">
          <KpiStrip items={[{ label: t("Scans today", "ສະແກນມື້ນີ້"), value: "2,431", hint: "+12%", tone: "success", icon: <ScanLine />, spark: [12, 18, 15, 22, 20, 28, 34] }, { label: t("Late", "ຊ້າ"), value: "18", hint: "-4", tone: "warning", icon: <Clock />, spark: [9, 14, 11, 16, 13, 12, 10] }, { label: t("Missed", "ພາດ"), value: "3", tone: "danger", icon: <AlertTriangle />, spark: [2, 4, 3, 5, 2, 3, 3] }, { label: t("Payroll", "ເງິນເດືອນ"), value: fmtKipShort(482000000), hint: "+3.2%", icon: <Wallet />, spark: [40, 41, 41, 44, 46, 47, 48] }]} />
          <div className="md:hidden"><KpiHero label={t("On time today", "ຕົງເວລາມື້ນີ້")} value="94" unit="%" hint="+2%" tone="success" icon={<ScanLine />} spark={[88, 90, 89, 92, 91, 93, 94]} secondary={[{ label: t("Scans", "ສະແກນ"), value: "2,431" }, { label: t("Late", "ຊ້າ"), value: "18" }, { label: t("Missed", "ພາດ"), value: "3" }]} /></div>
          <Card><CardHeader><CardTitle>{t("Last 14 days", "14 ວັນຜ່ານມາ")}</CardTitle></CardHeader><CardContent><DateGrid rows={["R1", "R2", "R3", "R4"]} dates={Array.from({ length: 14 }, (_, i) => "2/" + (4 + i))} status={[0, 1, 2, 3].map((r) => Array.from({ length: 14 }, (_, c) => ((r * 5 + c * 7) % 17 === 0 ? "miss" as const : (r + c) % 9 === 0 ? "late" as const : "ok" as const)))} today={6} /></CardContent></Card>
          <Card><CardHeader><CardTitle>{t("Site visit gaps", "ໄລຍະຫ່າງການຢ້ຽມຢາມຈຸດ")}</CardTitle></CardHeader><CardContent><LatencyTimeline days={30} offset={1} entries={[6, 7, 11, 13, 14, 16, 18, 20, 28, 30].map((day) => ({ day, kinds: day === 11 ? ["inspection" as const, "event" as const] : ["inspection" as const] }))} /></CardContent></Card>
          <Card><CardHeader><CardTitle>{t("Attendance tracking", "ຕິດຕາມການມາວຽກ")}</CardTitle></CardHeader><CardContent><AttendanceBoard days={31} today={19} offset={1} rows={[{ id: "VKS2207001", name: "ພູວົງ ແສງດາວ", cells: ["P", "P", "P+O8", "P", "W", "P", "P", "A", "P", "L", "P", "P", "H8", "P", "?", "?"] }, { id: "VKS2206001", name: "ບຸນເຮືອງ ວົງພະຈັນ", cells: ["P", "W", "P", "P", "P", "O8", "P", "P", "W", "P", "P"] }]} /></CardContent></Card>
          <div className="grid gap-4 md:grid-cols-3"><Card><CardContent className="pt-5"><Progress value={72} label={t("Round progress", "ຄວາມຄືບໜ້າ")} /></CardContent></Card>
            <Card><CardContent className="flex items-center gap-3 pt-5"><StarRating value={stars} onChange={setStars} /><span className="text-sm">{stars}/5</span></CardContent></Card>
            <Card><CardContent className="flex items-center justify-between pt-5"><span className="text-sm">{fmtKip(1234500)}</span><Sparkline values={[3, 5, 4, 7, 6, 9, 8]} /></CardContent></Card></div>
        </Sec>
        <Sec id="pickers" title="Date picker, dropdown, chips, search">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1"><Label>ວັນທີ (popover on desktop, wheel on phone)</Label><DatePicker value={date} onChange={setDate} /></div>
            <div className="space-y-1"><Label>ຈຸດ (single, searchable)</Label><Combobox options={sites} value={sel} onChange={setSel} /></div>
            <div className="space-y-1"><Label>ຈຸດ (multiple)</Label><Combobox multiple options={sites} value={multi} onChange={setMulti} /></div>
            <div className="space-y-1"><Label>ຄົ້ນຫາ</Label><SearchBox value={q} onChange={setQ} /></div>
          </div>
          <FilterChips options={[{ value: "all", label: "ທັງໝົດ" }, { value: "ok", label: "ສຳເລັດ" }, { value: "wait", label: "ລໍຖ້າ" }, { value: "late", label: "ຊ້າ" }]} value={chip} onChange={setChip} />
          <Dialog><DialogTrigger asChild><Button variant="outline" data-testid="picker-in-dialog">Pickers inside a Dialog</Button></DialogTrigger><DialogContent>
            <DialogHeader><DialogTitle>ລາຍງານເຫດການ</DialogTitle><DialogDescription>Phone: every picker pushes a view inside this sheet (no sheet on a sheet).</DialogDescription></DialogHeader>
            <FilterChips options={[{ value: "door", label: "ປະຕູ" }, { value: "person", label: "ຄົນແປກໜ້າ" }, { value: "fire", label: "ໄຟ" }]} value={dKind} onChange={setDKind} />
            <div className="space-y-1"><Label>ຈຸດ</Label><Combobox options={sites} value={dSite} onChange={setDSite} /></div>
            <div className="space-y-1"><Label>ວັນທີ</Label><DatePicker value={dDate} onChange={setDDate} /></div>
            <div className="space-y-1"><Label>ໄລຍະເວລາ</Label><DateRangePicker value={dRange} onChange={setDRange} /></div>
            <Button variant="ghost" onClick={() => setDPush(true)}>InSheetView (custom step) ›</Button>
            <InSheetView open={dPush} onBack={() => setDPush(false)} title="ຂັ້ນຕອນທີ 2"><p className="text-sm leading-6 text-muted-foreground">Any content. ‹ or Esc goes back to the form.</p></InSheetView>
            <DialogFooter><DialogClose asChild><Button>ສົ່ງ</Button></DialogClose></DialogFooter>
          </DialogContent></Dialog>
          <Card className="w-fit"><CardContent className="pt-5"><Calendar value={date} onChange={setDate} marked={["2026-09-12", "2026-09-20"]} /></CardContent></Card>
        </Sec>
        <Sec id="range" title="Date range (presets, 2 months on desktop, 1 on phone)">
          <div className="max-w-md space-y-1"><Label>ໄລຍະເວລາ</Label><DateRangePicker value={range} onChange={setRange} /></div>
        </Sec>
        <Sec id="alerts" title="Alerts, confirm popups, toasts">
          <div className="grid gap-3 md:grid-cols-2">
            <Alert tone="info" title="ຂໍ້ມູນ">ລະບົບຈະຊິງຄ໌ເມື່ອມີສັນຍານ.</Alert>
            <Alert tone="success" title="ບັນທຶກແລ້ວ">ສົ່ງລາຍງານສຳເລັດ.</Alert>
            {al && <Alert tone="warning" title="ອອບລາຍ" onClose={() => setAl(false)}>3 ລາຍການລໍຖ້າສົ່ງ.</Alert>}
            <Alert tone="danger" title="ສົ່ງບໍ່ສຳເລັດ" action={<Button size="sm" variant="outline">ລອງໃໝ່</Button>}>ກວດສັນຍານແລ້ວລອງອີກຄັ້ງ.</Alert>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <Alert variant="card" tone="info" title="ຂໍ້ມູນ">ລະບົບຈະຊິງຄ໌ເມື່ອມີສັນຍານ.</Alert>
            <Alert variant="card" tone="success" title="ບັນທຶກແລ້ວ">ສົ່ງລາຍງານສຳເລັດ.</Alert>
            <Alert variant="card" tone="warning" title="ອອບລາຍ" onClose={() => {}}>3 ລາຍການລໍຖ້າສົ່ງ.</Alert>
            <Alert variant="card" tone="danger" title="ສົ່ງບໍ່ສຳເລັດ" action={<Button size="sm" variant="outline">ລອງໃໝ່</Button>}>ກວດສັນຍານແລ້ວລອງອີກຄັ້ງ.</Alert>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => setConfirm("warning")}>Confirm</Button>
            <Button variant="destructive" onClick={() => setConfirm("danger")}>Delete (danger)</Button>
            <Button variant="destructive" onClick={() => setConfirm("hold")}>Hold to confirm</Button>
            <Button variant="action" onClick={() => toast.success("ບັນທຶກແລ້ວ")}>Toast ok</Button>
            <Button variant="outline" onClick={() => toast.error("ສົ່ງບໍ່ສຳເລັດ")}>Toast error</Button>
            <Button variant="outline" onClick={() => toast.warning("ອອບລາຍ")}>Toast warning</Button>
          <Button variant="outline" onClick={() => toast.promise(new Promise((r) => setTimeout(r, 1500)), { loading: "ກຳລັງອັບໂຫຼດ…", success: "ອັບໂຫຼດແລ້ວ", error: "ບໍ່ສຳເລັດ" })}>Toast promise</Button>
          </div>
        </Sec>
        <Sec id="touch" title="Swipe row (drag left on phone) and pull to refresh">
          <PullToRefresh onRefresh={() => new Promise((r) => setTimeout(r, 900))}><div className="space-y-2">{rows2.map((n) => <SwipeRow key={n} onAction={() => setRows2(rows2.filter((x) => x !== n))}><div className="flex items-center gap-3 p-3"><Avatar name={n} size={36} /><b>{n}</b></div></SwipeRow>)}{rows2.length === 0 && <Button onClick={() => setRows2(["ສົມຊາຍ", "ນາງບົວ", "ທ້າວດາວ"])}>reset</Button>}</div></PullToRefresh>
        </Sec>
        <Sec id="otp" title="Sign-in: OTP code and login card">
          <div className="flex flex-wrap items-center gap-6"><OtpInput value={otp} onChange={setOtp} /><OtpInput value="123456" onChange={() => {}} error /></div>
        </Sec>
        <Sec id="table" title="Data table (cards on phone when more than 4 columns), pagination, drawer">
          <DataTable columns={cols} rows={rows} rowKey={(r) => r.id} onRowClick={setDrawer} />
          <Pagination page={page} pages={9} onPage={setPage} />
          <div className="grid gap-4 md:grid-cols-2">
            <div className="min-w-0 space-y-2"><div className="text-xs font-semibold text-muted-foreground">mode="cards" · every width</div><DataTable mode="cards" columns={cols} rows={rows.slice(0, 2)} rowKey={(r) => r.id} /></div>
            <div className="min-w-0 space-y-2"><div className="text-xs font-semibold text-muted-foreground">mode="table" · every width (≤ 4 short columns only)</div><div className="overflow-x-auto"><DataTable mode="table" columns={cols.slice(0, 3)} rows={rows.slice(0, 2)} rowKey={(r) => r.id} /></div></div>
          </div>
          <div className="grid gap-4 md:grid-cols-3"><DataTable columns={cols} rows={[]} rowKey={(r) => r.id} /><DataTable columns={cols} rows={[]} rowKey={(r) => r.id} loading /><DataTable columns={cols} rows={[]} rowKey={(r) => r.id} error="ໂຫຼດຂໍ້ມູນບໍ່ສຳເລັດ" onRetry={() => {}} /></div>
        </Sec>
        <Sec id="wizard" title="Wizard, accordion, timeline">
          <div className="grid gap-6 md:grid-cols-2">
            <Card><CardContent className="pt-5"><Wizard steps={["ຂໍ້ມູນ", "ຮູບ", "ຢືນຢັນ"]} step={step} onStep={setStep} onFinish={() => setStep(0)} finishLabel="ສົ່ງ" nextLabel="ຕໍ່ໄປ" backLabel="ກັບຄືນ"><div className="rounded-lg bg-muted p-6 text-center">ຂັ້ນຕອນ {step + 1}</div></Wizard></CardContent></Card>
            <div className="space-y-4">
              <Accordion type="single" collapsible defaultValue="a"><AccordionItem value="a"><AccordionTrigger>ຄຳຖາມ 1</AccordionTrigger><AccordionContent>ຄຳຕອບຂອງຄຳຖາມທຳອິດ.</AccordionContent></AccordionItem><AccordionItem value="b"><AccordionTrigger>ຄຳຖາມ 2</AccordionTrigger><AccordionContent>ຄຳຕອບທີສອງ.</AccordionContent></AccordionItem></Accordion>
              <Timeline items={[{ id: "1", time: "08:12", title: "ສະແກນປະຕູໜ້າ", tone: "success" }, { id: "2", time: "08:41", title: "ຊ້າ 6 ນາທີ", detail: "ບ່ອນຈອດລົດ", tone: "warning" }, { id: "3", time: "09:05", title: "ພາດຈຸດ", tone: "danger" }]} />
            </div>
          </div>
        </Sec>
        <Sec id="charts" title="Charts (own entry point, only loaded where used)">
          <div className="grid gap-4 md:grid-cols-3"><Card className="md:col-span-2"><CardHeader><CardTitle>ສະແກນຕໍ່ວັນ</CardTitle></CardHeader><CardContent><BarSeries data={chart} x="d" y={["ok", "late"]} /></CardContent></Card>
            <Card><CardHeader><CardTitle>ສະຖານະ</CardTitle></CardHeader><CardContent><Donut data={[{ name: "ສຳເລັດ", value: 82 }, { name: "ຊ້າ", value: 12 }, { name: "ພາດ", value: 6 }]} /></CardContent></Card></div>
          <Card><CardContent className="pt-5"><LineSeries data={chart} x="d" y={["ok"]} height={180} /></CardContent></Card>
          <Card><CardHeader><CardTitle>ລາດຕະເວນ + % ຕົງເວລາ</CardTitle></CardHeader><CardContent><ComboSeries data={chart.map((c) => ({ ...c, rate: Math.round((c.ok / (c.ok + c.late)) * 100) }))} x="d" bars={["ok", "late"]} line="rate" lineUnit="%" labels={{ ok: "ຕົງເວລາ", late: "ຊ້າ", rate: "% ຕົງເວລາ" }} /></CardContent></Card>
          <div className="grid gap-4 md:grid-cols-3">
            <Card><CardHeader><CardTitle>ໄລຍະ vs ເວລາ</CardTitle></CardHeader><CardContent><ScatterSeries groups={[{ name: "ກະເຊົ້າ", data: [[1, 4, 2], [2.5, 6, 5], [4, 7, 3], [6, 9, 6], [8, 12, 4]].map(([km, min, n]) => ({ km, min, n })) }, { name: "ກະກາງຄືນ", data: [[1.5, 8, 3], [3, 11, 7], [5, 13, 2], [7, 17, 5], [9, 20, 8]].map(([km, min, n]) => ({ km, min, n })) }]} x="km" y="min" z="n" xLabel="ກມ" /></CardContent></Card>
            <Card><CardHeader><CardTitle>ຄະແນນທີມ</CardTitle></CardHeader><CardContent><RadarSeries data={["ວິໄນ", "ຕົງເວລາ", "ລາຍງານ", "ອຸປະກອນ", "ບໍລິການ"].map((s, i) => ({ s, a: [92, 88, 76, 84, 90][i], b: [78, 95, 88, 70, 82][i] }))} axisKey="s" y={["a", "b"]} labels={{ a: "ທີມ A", b: "ທີມ B" }} max={100} /></CardContent></Card>
            <Card><CardHeader><CardTitle>ເປົ້າໝາຍ</CardTitle></CardHeader><CardContent><RadialBars data={[{ name: "ລາດຕະເວນ", value: 86 }, { name: "ຝຶກອົບຮົມ", value: 64 }, { name: "ກວດອຸປະກອນ", value: 92 }]} /></CardContent></Card>
          </div>
          <Card><CardHeader><CardTitle>ເຫດການ: ມື້ × ຊົ່ວໂມງ</CardTitle></CardHeader><CardContent><Heatmap rows={["ຈ", "ອ", "ພ", "ພຫ", "ສ", "ສ.", "ອາ"]} cols={["00", "03", "06", "09", "12", "15", "18", "21"]} values={Array.from({ length: 7 }, (_, d) => Array.from({ length: 8 }, (_, h) => Math.round(Math.abs(Math.sin(d * 1.3 + h * 0.9)) * 9)))} unit="ເຫດ" /></CardContent></Card>
        </Sec>
        <Sec id="kanban" title="Kanban (drag, long-press on phone)">
          <Kanban columns={[{ id: "todo", title: "ຕ້ອງເຮັດ" }, { id: "doing", title: "ກຳລັງເຮັດ" }, { id: "done", title: "ສຳເລັດ" }]} cards={cards} onChange={(c) => setCards(c)} />
        </Sec>
        <Sec id="map" title="Map (Leaflet + OpenStreetMap)">
          <MapView flush pins={[{ id: "1", lat: 17.9757, lng: 102.6331, label: "ປະຕູໜ້າ", sub: "ສົມພອນ · ເຂົ້າກະແລ້ວ", meta: "08:12", tone: "success" }, { id: "2", lat: 17.9801, lng: 102.6402, label: "ຄັງສິນຄ້າ", sub: "ຊ້າ 12 ນາທີ", meta: "08:40", tone: "warning" }, { id: "3", lat: 17.9702, lng: 102.6255, label: "ພາດ", sub: "ບໍ່ມີການສະແກນ QR", meta: "09:05", tone: "danger" }]} renderCard={() => <div className="flex gap-2"><Button size="sm" variant="outline" className="flex-1">ເບິ່ງປະຫວັດ</Button><Button size="sm" className="flex-1">ໂທຫາ</Button></div>} />
        </Sec>
        <Sec id="capture" title="Signature, photo, QR scan, lightbox">
          <div className="grid gap-4 md:grid-cols-2">
            <div><Label>ລາຍເຊັນ</Label><SignaturePad /></div>
            <div className="space-y-3"><PhotoCapture onPhoto={(p) => setLast(p.bytes + " bytes")} /><Button variant="outline" onClick={() => setScan(!scan)}><MapPin />{scan ? "ປິດກ້ອງ" : "ສະແກນ QR"}</Button>{scan && <QrScanner className="max-w-xs" onScan={setLast} />}{last && <p className="text-sm">{last}</p>}
              <div className="flex gap-2">{imgs.map((im, i) => <button key={i} onClick={() => setLb(i)}><img src={im.src} alt="" className="h-16 w-24 rounded-md object-cover" /></button>)}</div></div>
          </div>
        </Sec>
        <Sec id="stamp" title="Capture stamp (time, site, GPS on photo / video)"><StampDemo /></Sec>
        <Sec id="login" title="Login card"><div className="overflow-hidden rounded-2xl border"><div className="scale-90"><LoginCard title="ເຂົ້າສູ່ລະບົບ" subtitle="ໃສ່ລະຫັດພະນັກງານ"><Input placeholder="G001" /><Button className="w-full">ເຂົ້າ</Button></LoginCard></div></div></Sec>
        <Sec id="login-screen" title="Login screen &amp; profile"><div className="grid gap-4 lg:grid-cols-2">
          <div className="max-h-[520px] overflow-auto rounded-2xl border"><LoginScreen title="ຍິນດີຕ້ອນຮັບກັບມາ" subtitle="ໃສ່ລະຫັດພະນັກງານ" tagline="ຄວາມປອດໄພ ທີ່ທ່ານໄວ້ວາງໃຈ" className="min-h-[480px]"><FloatingInput label="ລະຫັດພະນັກງານ" /><PasswordInput placeholder="ລະຫັດຜ່ານ" /><Button className="w-full" size="lg">ເຂົ້າສູ່ລະບົບ</Button></LoginScreen></div>
          <div className="max-h-[520px] overflow-auto rounded-2xl border p-3"><ProfileView name="ສົມຊາຍ ວົງສະຫວັນ" role="ເຈົ້າໜ້າທີ່ຮັກສາຄວາມປອດໄພ" code="VKS2207001" status="online" stats={[{ label: "ມື້ມາວຽກ", value: 24 }, { label: "ລາດຕະເວນ", value: 61 }]} sections={[{ title: "ຂໍ້ມູນ", rows: [{ label: "ເບີໂທ", value: "020 5555 1234" }, { label: "ປ່ຽນລະຫັດຜ່ານ", onPress: () => toast("Password") }] }]} onSignOut={() => toast("Signed out")} /></div>

          <div className="max-h-[520px] overflow-auto rounded-2xl border p-3"><ProfileView variant="actions" quickActions={[{ icon: <Phone />, label: "ໂທ", onPress: () => toast("Call") }, { icon: <Pencil />, label: "ແກ້ໄຂ", onPress: () => toast("Edit") }]} name="ສົມຊາຍ ວົງສະຫວັນ" role="ເຈົ້າໜ້າທີ່ຮັກສາຄວາມປອດໄພ" code="VKS2207001" status="online" stats={[{ label: "ມື້ມາວຽກ", value: 24 }, { label: "ລາດຕະເວນ", value: 61 }]} sections={[{ title: "ຂໍ້ມູນ", rows: [{ label: "ເບີໂທ", value: "020 5555 1234" }, { label: "ປ່ຽນລະຫັດຜ່ານ", onPress: () => toast("Password") }] }]} onSignOut={() => toast("Signed out")} /></div>
        </div></Sec>
        <IOSKit />
        <MotionKit />
        <MobileKit />
        <DesktopKit />
      </div>
      <Toaster />
      <ConfirmDialog open={confirm !== null} onOpenChange={(o) => !o && setConfirm(null)} tone={confirm === "warning" ? "warning" : "danger"} holdToConfirm={confirm === "hold"}
        title={confirm === "warning" ? "ສົ່ງລາຍງານບໍ?" : "ລຶບຂໍ້ມູນນີ້ບໍ?"} description={confirm === "warning" ? "ສົ່ງແລ້ວແກ້ໄຂບໍ່ໄດ້." : "ການລຶບບໍ່ສາມາດຍົກເລີກໄດ້."} confirmLabel={confirm === "warning" ? "ສົ່ງ" : "ລຶບ"}
        onConfirm={() => { setConfirm(null); toast.success("ສຳເລັດ") }} />
      <Lightbox images={imgs} index={lb} onIndex={setLb} onClose={() => setLb(null)} />
      <Drawer open={!!drawer} onClose={() => setDrawer(null)} title={drawer?.site ?? ""} footer={<Button className="w-full" onClick={() => setDrawer(null)}>ບັນທຶກ</Button>}>
        {drawer && <div className="space-y-3"><div className="flex items-center gap-3"><Avatar name={drawer.guard} size={48} /><div><b>{drawer.guard}</b><div className="text-sm text-muted-foreground">{drawer.shift}</div></div></div><Timeline items={[{ id: "1", time: drawer.time, title: drawer.status, tone: "success" }]} /></div>}
      </Drawer>
    </AppShell>
  )
}
/** v0.4 motion: collapsible sidebar rail, phone drawer, animated slider, detail popover. */
function MotionKit() {
  const items: NavItem[] = [{ id: "home", label: "ໜ້າຫຼັກ", icon: <Home /> }, { id: "tasks", label: "ວຽກ", icon: <ClipboardList />, badge: 3 }, { id: "staff", label: "ພະນັກງານ", icon: <Users /> }, { id: "reports", label: "ລາຍງານ", icon: <BarChart3 /> }, { id: "alerts", label: "ແຈ້ງເຕືອນ", icon: <Bell /> }]
  const [a, setA] = React.useState("home"), [mini, setMini] = React.useState(false), [drawer, setDrawer] = React.useState(false)
  const [vol, setVol] = React.useState([60]), [pay, setPay] = React.useState([2000000]), [hrs, setHrs] = React.useState([6, 18])
  const user = <div className="flex items-center gap-2.5 px-1 text-sm"><Avatar name="Admin" size={32} className="shrink-0" /><span className="vks-rail-fade">Admin</span></div>
  return <Sec id="motion2" title="Motion v0.4 · sidebar rail, slider, detail popover">
    <div className="grid gap-4 lg:grid-cols-[auto_1fr]">
      <div className="space-y-2">
        <div className="h-[420px] overflow-hidden rounded-xl border [transform:translateZ(0)]"><Sidebar items={items} active={a} onNavigate={setA} title="VKS QC" collapsible collapsed={mini} onCollapsedChange={setMini} className="flex !h-full" user={user} /></div>
        <Button size="sm" variant="outline" onClick={() => setDrawer(true)}>Phone drawer</Button>
        <SidebarSheet open={drawer} onOpenChange={setDrawer} items={items} active={a} onNavigate={setA} title="VKS QC" user={user} />
      </div>
      <div className="space-y-6">
        <div className="space-y-8 rounded-xl border bg-card p-5 pt-10">
          <Slider value={vol} onValueChange={setVol} format={(x) => x + "%"} aria-label="ສຽງ" />
          <Slider value={pay} onValueChange={setPay} min={0} max={5000000} step={250000} ticks={5} tone="gold" format={(x) => fmtKipShort(x)} aria-label="ເງິນ" />
          <Slider value={hrs} onValueChange={setHrs} min={0} max={24} ticks showValue="always" tone="primary" format={(x) => x + ":00"} aria-label="ກະ" minStepsBetweenThumbs={1} />
        </div>
        <div className="flex flex-wrap gap-3">
          <DetailPopover title="ສົມຊາຍ ວົງສະຫວັນ" subtitle="G014 · ປະຕູໜ້າ" media={<Avatar name="ສົມຊາຍ" size={44} status="online" />} status={{ label: "ເຂົ້າກະແລ້ວ", tone: "success", live: true }}
            fields={[{ label: "ກະ", value: "06:00-18:00", icon: <Clock /> }, { label: "ສະແກນ", value: "9 / 12" }, { label: "ຈຸດ", value: "ປະຕູໜ້າ A-01", icon: <MapPin />, wide: true }]}
            body={<Progress value={9} max={12} />} actions={<Button size="sm">ເບິ່ງ</Button>}>
            <Button variant="outline">Hover: ສົມຊາຍ</Button>
          </DetailPopover>
          <DetailPopover openOn="click" side="top" title="ຄັງສິນຄ້າ B-01" subtitle="ຈຸດກວດ QR" status={{ label: "ພາດ 2 ຮອບ", tone: "danger", live: true }}
            fields={[{ label: "ລ່າສຸດ", value: "04:10" }, { label: "ໂດຍ", value: "ນາງບົວ" }]}>
            <Button variant="outline"><AlertTriangle />Click: ຄັງສິນຄ້າ</Button>
          </DetailPopover>
        </div>
      </div>
    </div>
  </Sec>
}
/** iOS-style overlays, lists, skeletons, inputs, chips and the perf switch (v0.5). */
function IOSKit() {
  const [al, setAl] = React.useState(false), [as, setAs] = React.useState(false), [bn, setBn] = React.useState(false), [n, setN] = React.useState(4200000), [chip, setChip] = React.useState(true)
  return <Sec id="ios" title="iOS kit · alerts, sheets, banner, list, skeleton, ticker, perf">
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" onClick={() => setAl(true)}>iOS alert</Button><Button variant="outline" onClick={() => setAs(true)}>Action sheet</Button><Button variant="outline" onClick={() => { setBn(false); requestAnimationFrame(() => setBn(true)) }}>Banner</Button>
      <Menu><MenuTrigger asChild><Button variant="outline">Menu</Button></MenuTrigger><MenuContent><MenuItem onSelect={() => toast("ok")}>ເປີດ</MenuItem><MenuItem destructive>ລຶບ</MenuItem></MenuContent></Menu>
      <PerfToggle />
    </div>
    <div className="grid gap-4 md:grid-cols-3">
      <ListGroup header="ຕັ້ງຄ່າ"><ListRow icon={<MapPin />} label="GPS" detail="ເປີດ" onPress={() => {}} /><ListRow icon={<Bell />} label="ແຈ້ງເຕືອນ" onPress={() => {}} /></ListGroup>
      <SkeletonList rows={2} /><SkeletonCard media={false} />
    </div>
    <div className="flex flex-wrap items-center gap-4">
      <NumberTicker value={n} format={(x) => fmtKip(Math.round(x))} className="text-2xl font-bold" /><Button size="sm" variant="ghost" onClick={() => setN(Math.round(Math.random() * 9e6))}>↻</Button>
      <Chip selected={chip} onClick={() => setChip(!chip)}>ກະເຊົ້າ</Chip><CopyButton value="G001" />
    </div>
    <div className="grid max-w-md gap-3"><FloatingInput label="ລະຫັດພະນັກງານ" /><PasswordInput placeholder="ລະຫັດຜ່ານ" /></div>
    <IOSAlert open={al} onOpenChange={setAl} title="ລຶບຮູບນີ້?" message="ຍົກເລີກບໍ່ໄດ້." actions={[{ label: "ຍົກເລີກ", style: "cancel" }, { label: "ລຶບ", style: "destructive" }]} />
    <ActionSheet open={as} onOpenChange={setAs} actions={[{ label: "ແບ່ງປັນ", onPress: () => {} }, { label: "ລຶບ", destructive: true, onPress: () => {} }]} />
    <Banner open={bn} onOpenChange={setBn} title="ມີວຽກໃໝ່" message="ປັດຂຶ້ນເພື່ອປິດ" />
  </Sec>
}

const people = ["ສົມຊາຍ", "ນາງບົວ", "ທ້າວດາວ", "ເພັດ", "ແກ້ວ", "ບຸນມີ", "ຄຳພອນ", "ວັນນາ", "ອານົງ", "ສີໄພ", "ຈັນທະລາ", "ໄຊຍະ", "Anna", "Ben", "7-Eleven"].map((l, i) => ({ id: String(i), label: l, sub: "G" + String(i + 1).padStart(3, "0") }))
/** Mobile kit (v0.6): search bar, carousel, HUD, snap sheet, indexed list, toolbar, long-press, share. */
function MobileKit() {
  const [q, setQ] = React.useState(""), [snap, setSnap] = React.useState(false), [lp, setLp] = React.useState(0)
  const { hud, run } = useProgressHUD(), { share, sheetProps } = useShareSheet()
  const press = useLongPress(() => setLp((n) => n + 1), { onPress: () => toast("ກົດຄ້າງໄວ້") })
  const list = people.filter((p) => p.label.toLowerCase().includes(q.toLowerCase()))
  return <Sec id="mobile-kit" title="Mobile kit · search bar, carousel, HUD, snap sheet, index list, toolbar, share">
    <div className="grid gap-4 md:grid-cols-2 [&>*]:min-w-0">
      <div className="space-y-3">
        <SearchBar value={q} onChange={setQ} />
        <div className="overflow-hidden rounded-2xl border bg-card"><IndexedList items={list} className="h-80" onSelect={(p) => toast(p.label)} /></div>
      </div>
      <div className="space-y-3">
        <Carousel>{["ປະຕູໜ້າ", "ບ່ອນຈອດລົດ", "ຄັງສິນຄ້າ", "ຫ້ອງການ"].map((s, i) => (
          <Card key={s} className="h-36"><CardContent className="flex h-full flex-col justify-between p-4"><Badge className="self-start" variant={i === 2 ? "warning" : "success"}>{i === 2 ? "ລໍຖ້າ" : "ປົກກະຕິ"}</Badge><div><p className="text-sm text-muted-foreground">ຈຸດ {i + 1}</p><b className="text-lg">{s}</b></div></CardContent></Card>
        ))}</Carousel>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => run(new Promise((r) => setTimeout(r, 1200)), { loading: "ກຳລັງສົ່ງ…", success: "ສົ່ງແລ້ວ" })}>HUD ✓</Button>
          <Button variant="outline" onClick={() => run(new Promise((_, j) => setTimeout(() => j(new Error("x")), 1000)), { loading: "ກຳລັງສົ່ງ…", error: "ບໍ່ສຳເລັດ" }).catch(() => {})}>HUD ✕</Button>
          <Button variant="outline" onClick={() => setSnap(true)}>Snap sheet</Button>
          <Button variant="outline" onClick={() => share({ title: "ລາຍງານ QC ມື້ນີ້", url: "https://vks.la/r/qc-2026" }, { forceSheet: true })}><Share2 />ແບ່ງປັນ</Button>
          <Button variant="outline" {...press}>ກົດຄ້າງ ({lp})</Button>
        </div>
        <div className="overflow-hidden rounded-2xl border">
          <BottomToolbar items={[{ id: "s", icon: <Share2 />, label: "ແບ່ງປັນ", onPress: () => share({ title: "ລາຍງານ", url: "https://vks.la" }, { forceSheet: true }) }, { id: "e", icon: <Pencil />, label: "ແກ້ໄຂ" }, { id: "f", icon: <Heart />, label: "ມັກ" }, { id: "d", icon: <Trash2 />, label: "ລຶບ", destructive: true }]} />
        </div>
      </div>
    </div>
    {hud}
    <ShareSheet {...sheetProps} />
    <SnapSheet open={snap} onOpenChange={setSnap} title="ລາຍລະອຽດຈຸດ">
      <div className="space-y-3 p-4"><p className="leading-normal text-muted-foreground">ລາກຂຶ້ນເພື່ອຂະຫຍາຍ, ລາກລົງເພື່ອປິດ.</p>{rows.map((r) => <div key={r.id} className="flex items-center gap-3 rounded-xl bg-muted/50 p-3"><Avatar name={r.guard} size={36} /><div className="flex-1"><b>{r.site}</b><div className="text-sm text-muted-foreground">{r.guard} · {r.time}</div></div></div>)}</div>
    </SnapSheet>
  </Sec>
}
const notices0: Notice[] = [
  { id: "1", title: "ພາດການກວດ · ຄັງສິນຄ້າ", body: "ທ້າວດາວ ບໍ່ໄດ້ສະແກນ QR ເວລາ 02:00", time: "5 ນາທີ", tone: "danger", icon: <AlertTriangle />, group: "ມື້ນີ້" },
  { id: "2", title: "ລາຍງານ QC ສົ່ງແລ້ວ", body: "ສົມຊາຍ ສົ່ງລາຍງານປະຈຳວັນ", time: "1 ຊມ", tone: "success", icon: <CheckCircle2 />, group: "ມື້ນີ້" },
  { id: "3", title: "ຂໍລາພັກ", body: "ນາງບົວ ຂໍລາພັກວັນສຸກ", time: "ມື້ວານ", tone: "warning", icon: <Clock />, group: "ມື້ວານ", read: true },
]
const tree = [
  { id: "vte", label: "ວຽງຈັນ", icon: <Folder />, children: [
    { id: "s1", label: "ປະຕູໜ້າ", icon: <Shield />, badge: <Badge variant="success">3</Badge>, children: [{ id: "g1", label: "ສົມຊາຍ", icon: <User /> }, { id: "g2", label: "ນາງບົວ", icon: <User /> }] },
    { id: "s2", label: "ຄັງສິນຄ້າ", icon: <Shield />, badge: <Badge variant="warning">1</Badge> },
  ] },
  { id: "pks", label: "ປາກເຊ", icon: <Folder />, children: [{ id: "s3", label: "ສາຂາ 1", icon: <Shield /> }] },
]
/** Desktop kit (v0.6): ⌘K palette, breadcrumb, hover card, context menu, tree, stat cards, dropzone, tags, split pane, notifications. */
function DesktopKit() {
  const [cmd, setCmd] = React.useState(false), [sel, setSel] = React.useState("s1"), [tags, setTags] = React.useState(["ກະເຊົ້າ", "VIP"]), [ns, setNs] = React.useState(notices0), [files, setFiles] = React.useState<File[]>([])
  useCommandK(setCmd)
  return <Sec id="desktop-kit" title="Desktop kit · ⌘K, breadcrumb, hover card, context menu, tree, stats, dropzone, tags, split, notifications">
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="outline" onClick={() => setCmd(true)}><SearchIcon />ຄົ້ນຫາຄຳສັ່ງ <kbd className="ml-2 rounded border px-1.5 font-mono text-[11px] text-muted-foreground">Ctrl K</kbd></Button>
      <Breadcrumb items={[{ label: "ໜ້າຫຼັກ", onClick: () => {} }, { label: "ວຽງຈັນ", onClick: () => {} }, { label: "ຈຸດ", onClick: () => {} }, { label: "ປະຕູໜ້າ", onClick: () => {} }, { label: "ສົມຊາຍ" }]} />
      <ButtonGroup label="view"><Button variant="outline" size="sm">ມື້</Button><Button variant="outline" size="sm">ອາທິດ</Button><Button variant="outline" size="sm">ເດືອນ</Button></ButtonGroup>
    </div>
    <div className="-mx-4 grid gap-4 max-md:gap-0 max-md:border-y max-md:bg-card sm:mx-0 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard flush label="ກວດສຳເລັດ" value="96%" delta={4} icon={<CheckCircle2 />} tone="success" trend={[80, 84, 83, 88, 91, 90, 96]} hint="vs ອາທິດກ່ອນ" />
      <StatCard flush label="ມາຊ້າ" value="7" delta={-22} goodWhen="down" icon={<Clock />} tone="warning" trend={[12, 11, 9, 10, 8, 9, 7]} />
      <StatCard flush label="ເຫດການ" value="3" delta={50} goodWhen="down" icon={<AlertTriangle />} tone="destructive" trend={[1, 2, 1, 2, 2, 3, 3]} />
      <StatCard flush label="ລາຍຮັບ" value={fmtKipShort(84500000)} delta={0} icon={<BarChart3 />} trend={[60, 62, 70, 68, 75, 80, 84]} />
    </div>
    <SplitPane storageKey="gallery-split" className="h-80"
      left={<ScrollArea className="h-full"><div className="p-2"><TreeView nodes={tree} selected={sel} onSelect={(n) => setSel(n.id)} defaultExpanded={["vte", "s1"]} /></div></ScrollArea>}
      right={<div className="space-y-3 p-5"><p className="text-sm text-muted-foreground">ເລືອກ: <b className="text-foreground">{sel}</b></p>
        <ContextMenu label="ສົມຊາຍ" actions={[{ label: "ເປີດ", icon: <User />, shortcut: "↵", onSelect: () => toast("ເປີດ") }, { label: "ສຳເນົາລະຫັດ", icon: <CopyIcon />, onSelect: () => toast("G001") }, { label: "ຍ້າຍໄປ", items: [{ label: "ປະຕູໜ້າ" }, { label: "ຄັງສິນຄ້າ" }] }, { label: "ລຶບ", icon: <Trash2 />, destructive: true, separator: true }]}>
          <div className="rounded-xl border border-dashed p-4 text-sm leading-normal text-muted-foreground">ຄລິກຂວາ (ຫຼື ກົດຄ້າງໃນມືຖື) ບ່ອນນີ້</div>
        </ContextMenu>
        <p className="text-sm leading-normal">ວາງເມົ້າໃສ່ <HoverCard trigger={<button className="font-semibold text-primary underline decoration-dotted underline-offset-4 dark:text-foreground">ສົມຊາຍ</button>}>
          <div className="flex gap-3"><Avatar name="ສົມຊາຍ" size={44} /><div><b>ສົມຊາຍ</b><p className="text-sm text-muted-foreground">G001 · ປະຕູໜ້າ · ກະເຊົ້າ</p><p className="mt-1 text-xs text-success">● ອອນລາຍ</p></div></div>
        </HoverCard> ເພື່ອເບິ່ງຂໍ້ມູນ</p></div>} />
    <div className="grid gap-4 md:grid-cols-3">
      <div className="space-y-2"><Dropzone accept="image/*,.pdf" maxSize={5 * 1024 * 1024} files={files} onRemove={(i) => setFiles((x) => x.filter((_, j) => j !== i))} onFiles={(f) => setFiles((x) => [...x, ...f])} onReject={(f, r) => toast.error(f.name + (r === "size" ? " ໃຫຍ່ເກີນ" : " ບໍ່ຮອງຮັບ"))} />
        <div className="flex flex-wrap gap-3 pt-1" title={"max " + fmtBytes(5 * 1024 * 1024)}>{["a.pdf", "b.xlsx", "c.docx", "d.pptx", "e.jpg", "f.mp4", "g.zip"].map((n) => <FileIcon key={n} name={n} />)}</div></div>
      <div><Label>ປ້າຍກຳກັບ</Label><TagInput value={tags} onChange={setTags} max={6} suggestions={["ກະເຊົ້າ", "ກະແລງ", "ກະດຶກ", "VIP", "ທົດລອງງານ", "ຫົວໜ້າ"]} /></div>
      <Card className="overflow-hidden"><NotificationList items={ns} onMarkAll={() => setNs((x) => x.map((n) => ({ ...n, read: true })))} onOpen={(n) => setNs((x) => x.map((y) => (y.id === n.id ? { ...y, read: true } : y)))} onDismiss={(n) => setNs((x) => x.filter((y) => y.id !== n.id))} /></Card>
    </div>
    <CommandPalette open={cmd} onOpenChange={setCmd} commands={[
      { id: "home", label: "ໜ້າຫຼັກ", group: "ໄປທີ່", icon: <Home />, shortcut: "G H", onRun: () => toast("ໜ້າຫຼັກ") },
      { id: "rep", label: "ລາຍງານ QC", group: "ໄປທີ່", icon: <FileText />, keywords: "report qc", onRun: () => toast("ລາຍງານ") },
      { id: "staff", label: "ພະນັກງານ", group: "ໄປທີ່", icon: <Users />, keywords: "staff guard", onRun: () => toast("ພະນັກງານ") },
      { id: "new", label: "ສ້າງລາຍງານໃໝ່", group: "ຄຳສັ່ງ", icon: <Plus />, shortcut: "N", onRun: () => toast("ສ້າງ") },
      { id: "set", label: "ຕັ້ງຄ່າ", group: "ຄຳສັ່ງ", icon: <Settings />, keywords: "settings", onRun: () => toast("ຕັ້ງຄ່າ") },
    ]} />
    <p className="pt-2 text-sm font-semibold text-muted-foreground">Hover effects (mouse only)</p>
    <div className="grid gap-4 sm:grid-cols-3">
      <HoverFx effect="spotlight" className="rounded-2xl border bg-card p-5"><p className="text-sm text-muted-foreground">spotlight</p><p className="text-2xl font-bold">128 / 134</p></HoverFx>
      <HoverFx effect="trace" className="rounded-2xl bg-bar p-5 text-bar-foreground"><p className="text-sm opacity-70">trace</p><p className="text-2xl font-bold">24 guards</p></HoverFx>
      <HoverFx effect="tilt" className="rounded-2xl bg-bar p-5 text-bar-foreground shadow-lg"><p className="text-sm text-gold">tilt</p><p className="text-2xl font-bold">4.8 ★</p></HoverFx>
    </div>
    <div className="grid gap-4 sm:grid-cols-3">
      <Parallax className="relative isolate grid h-44 place-items-center overflow-hidden rounded-2xl bg-bar">
        <ParallaxLayer depth={-20} aria-hidden className="absolute -right-16 -top-16 -z-10 size-56 rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--gold)_40%,transparent),transparent_68%)]" />
        <ParallaxLayer depth={6}><Logo className="size-14" /></ParallaxLayer>
      </Parallax>
      <SlideHighlight className="rounded-xl border bg-card p-1.5">
        {["ໜ້າຫຼັກ", "ລາດຕະເວນ", "ລາຍງານ QC"].map((l) => <button key={l} data-slide-item className="flex min-h-11 w-full items-center gap-3 rounded-[0.6rem] px-3 text-left text-sm leading-normal"><span className="size-2 rounded-sm bg-gold" />{l}</button>)}
      </SlideHighlight>
      <CursorRing className="flex h-44 items-center justify-center gap-3 rounded-2xl bg-bar">
        <Button className="vks-nudge" variant="gold">ຕໍ່ໄປ <ArrowRight /></Button>
      </CursorRing>
    </div>
  </Sec>
}

function StampDemo() {
  const [now, setNow] = React.useState(() => stampTime()), [out, setOut] = React.useState<string | null>(null)
  React.useEffect(() => { const t = setInterval(() => setNow(stampTime()), 1000); return () => clearInterval(t) }, [])
  const data = { time: now, site: "ຄັງສິນຄ້າ ໂຮງງານເບຍລາວ ສາຂາວຽງຈັນ", gps: "17.97570, 102.63310 (±8 m)" }
  return <div className="grid gap-4 md:grid-cols-2">
    <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary/70 to-muted md:aspect-video"><CaptureStamp data={data} /></div>
    <div className="space-y-3"><PhotoCapture label="ຖ່າຍ + ຕີຕາ" onPhoto={async (p) => setOut(URL.createObjectURL(await stampPhoto(p.blob, { ...data, time: stampTime() })))} />{out && <img src={out} alt="" className="w-full rounded-2xl border" />}</div>
  </div>
}