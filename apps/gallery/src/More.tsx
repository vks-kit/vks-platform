import * as React from "react"
import { Home, ClipboardList, Users, BarChart3, Settings, Bell, Plus, Moon, Sun, MapPin, FileText, ScanLine, Wallet, Check, X, Ban, ReceiptText, Download } from "@vks-kit/ui/icons"
import {
  AppShell, PageHeader, Fab, LoginCard, Button, Card, CardContent, CardHeader, CardTitle, Input, Label, Badge, useTheme,
  IOSAlert, ActionSheet, Banner, ListGroup, ListRow, SkeletonList, SkeletonCard, NumberTicker, FloatingInput, PasswordInput, Chip, CopyButton, Menu, MenuTrigger, MenuContent, MenuItem, PerfToggle,
  DatePicker, Calendar, TimePicker, TimeRangePicker, Combobox, FilterChips, SearchBox, OtpInput, SignaturePad, Lightbox, DataTable, Drawer, Wizard,
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose, InSheetView,
  Avatar, Progress, Accordion, DateRangePicker, Alert, ConfirmDialog, SwipeRow, PullToRefresh, toast, Toaster, type Range, AccordionItem, AccordionTrigger, AccordionContent, StarRating, Timeline, KpiStrip, KpiHero, Pagination, LoginScreen, ProfileView, type Column,
} from "@vks-kit/ui"
import {
  SearchBar, Carousel, useProgressHUD, SnapSheet, IndexedList, BottomToolbar, useLongPress, useShareSheet, ShareSheet,
  Sidebar, SidebarSheet, Slider, DetailPopover, type NavItem,
  CommandPalette, useCommandK, Breadcrumb, HoverCard, ContextMenu, TreeView, StatCard, ButtonGroup, Dropzone, fmtBytes, FileIcon, TagInput, SplitPane, NotificationList, ScrollArea, type Notice,
  HoverFx, Parallax, ParallaxLayer, SlideHighlight, CursorRing, Logo, Roadmap, DependencyMap,
  ApprovalCard, SyncStatus, diffFields, type ApprovalStatus, TextInput, PhoneInput, MoneyInput, TimeInput, NumberInput, isPhoneLa, phoneLaE164,
  IconButton, ContactActions, SlotPicker, halfHours, RangeInline, DateInput, FormDialogContent, Field, FormSection, FormActions, FoldSection, SheetContent, Sheet, SheetTitle, SelectHeader, Select, SelectTrigger, SelectValue, SelectContent, SelectItem, Facts, FactGrid, WeekdayPicker, workDaysText,
  SettingsPage, defineSettings,
  SubmitButton, useOptimisticList, ExpandCard,
  PatrolCheckpointRail, ShiftRosterGrid, IncidentEscalationCard, GuardIdBadge, ContractQuoteSummary, type Checkpoint, type Roster, type ShiftCode, type QuoteLine,
} from "@vks-kit/ui"
import { Share2, Pencil, Phone, Trash2, Heart, Shield, AlertTriangle, CheckCircle2, Clock, Folder, User, Copy as CopyIcon, Search as SearchIcon, ArrowRight } from "@vks-kit/ui/icons"
import { BarSeries, LineSeries, Donut, Sparkline, ScatterSeries, RadarSeries, RadialBars, ComboSeries, Heatmap, DateGrid, LatencyTimeline, AttendanceBoard } from "@vks-kit/ui/charts"
import { MapView } from "@vks-kit/ui/map"
import { Kanban, SortableList, type KanbanCard } from "@vks-kit/ui/kanban"
import { QrScanner, PhotoCapture, CaptureStamp, stampPhoto, stampTime } from "@vks-kit/ui/scan"
import { fmtKip, fmtKipShort, t, setLang, getLang } from "@vks-kit/core"
import { DataDemo } from "../../docs/src/docs/more"

function FieldsGallery() {
  const [txt, setTxt] = React.useState(""); const [phone, setPhone] = React.useState(""); const [money, setMoney] = React.useState<number | null>(1500000)
  const [time, setTime] = React.useState(""); const [num, setNum] = React.useState<number | null>(3)
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="space-y-1"><Label>ຂໍ້ຄວາມ</Label><TextInput value={txt} onChange={setTxt} maxLength={30} /></div>
      <div className="space-y-1"><Label>ເບີໂທ 020 XXXX XXXX</Label><PhoneInput value={phone} onChange={setPhone} invalid={!!phone && !isPhoneLa(phone)} /><code className="text-xs text-muted-foreground">{phone || "—"} {phoneLaE164(phone)}</code></div>
      <div className="space-y-1"><Label>ຈຳນວນເງິນ</Label><MoneyInput value={money} onChange={setMoney} /><code className="text-xs text-muted-foreground">{String(money)}</code></div>
      <div className="space-y-1"><Label>ເວລາ</Label><TimeInput value={time} onChange={setTime} /><code className="text-xs text-muted-foreground">{time || "—"}</code></div>
      <div className="space-y-1"><Label>ຈຳນວນ</Label><NumberInput value={num} onChange={setNum} min={1} max={20} unit="ຄົນ" /></div>
    </div>
  )
}

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

function FormKitGallery() {
  const [days, setDays] = React.useState("1111110"), [name, setName] = React.useState(""), [tried, setTried] = React.useState(false)
  const rows: [string, React.ReactNode, boolean?][] = [["ລູກຄ້າ", "ບໍລິສັດ ລາວ ເທຣດດິ້ງ"], ["ໂທ", "020 5512 3456"], ["ມື້ເຮັດວຽກ", workDaysText(days)], ["ໝາຍເຫດ", ""], ["ທີ່ຢູ່", "ບ້ານ ໂພນສະອາດ, ເມືອງ ສີສັດຕະນາກ, ນະຄອນຫຼວງວຽງຈັນ", true]]
  return <Sec id="form-kit" title="Form dialog, field, weekday picker, grouped select, facts">
    <div className="grid gap-4 lg:grid-cols-2">
      <Card><CardContent className="grid gap-4 pt-5">
        <Dialog><DialogTrigger asChild><Button className="w-fit">ເພີ່ມສະຖານທີ່ (FormDialogContent)</Button></DialogTrigger>
          <FormDialogContent title="ເພີ່ມສະຖານທີ່" description="ຂໍ້ມູນຈະບັນທຶກເຂົ້າລະບົບ" footer={<><DialogClose asChild><Button variant="outline">ຍົກເລີກ</Button></DialogClose><Button onClick={() => setTried(true)}>ບັນທຶກ</Button></>}>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormSection className="sm:col-span-2">ຂໍ້ມູນທົ່ວໄປ</FormSection>
              <Field label="ຊື່ສະຖານທີ່" htmlFor="g-fd-name" error={tried && !name ? "ກະລຸນາໃສ່ຊື່" : undefined}><Input id="g-fd-name" value={name} invalid={tried && !name} onChange={(e) => setName(e.target.value)} /></Field>
              <Field label="ລະຫັດ" htmlFor="g-fd-id" hint="ເຊັ່ນ VKS26-001"><Input id="g-fd-id" placeholder="VKS26-001" /></Field>
              <FormSection className="sm:col-span-2">ກະ</FormSection>
              <Field label="ມື້ເຮັດວຽກ" className="sm:col-span-2"><WeekdayPicker value={days} onChange={setDays} /></Field>
            </div>
          </FormDialogContent>
        </Dialog>
        <Field label="ມື້ເຮັດວຽກ (WeekdayPicker)"><WeekdayPicker value={days} onChange={setDays} /></Field>
        <Field label="ເວລາກະ (SelectHeader)"><Select><SelectTrigger><SelectValue placeholder="ເລືອກເວລາກະ" /></SelectTrigger><SelectContent>
          <div role="group" aria-label="12 ຊົ່ວໂມງ"><SelectHeader>12 ຊົ່ວໂມງ · 2</SelectHeader><SelectItem value="a">06:00–18:00</SelectItem><SelectItem value="b">18:00–06:00</SelectItem></div>
          <div role="group" aria-label="8 ຊົ່ວໂມງ"><SelectHeader>8 ຊົ່ວໂມງ · 3</SelectHeader><SelectItem value="c">06:00–14:00</SelectItem><SelectItem value="d">14:00–22:00</SelectItem><SelectItem value="e">22:00–06:00</SelectItem></div>
        </SelectContent></Select></Field>
      </CardContent></Card>
      <Card><CardContent className="grid gap-4 pt-5"><Facts rows={rows.slice(0, 4).map(([k, v]) => [k, v] as [string, React.ReactNode])} /><FactGrid rows={rows} /></CardContent></Card>
    </div>
  </Sec>
}

const settingsDemo = defineSettings({
  appLabel: "ການຕັ້ງຄ່າຂອງແອັບ",
  events: [{ id: "late", label: "ມາວຽກຊ້າ", default: "1100" }],
  permissions: [{ id: "approveLeave", label: "ອະນຸມັດວັນພັກ", default: "1100" }],
  app: [
    { header: "ກຸ່ມ A — ຄ່າ ແລະ ຕົວເລກ", sub: "ຕົວຢ່າງ: ຄຳນຳໜ້າ, ເກນ, ໄລຍະເວລາ", tone: "success", rows: [
      { key: "prefix", type: "text", label: "ຄຳນຳໜ້າລະຫັດ", help: "ໃຊ້ກັບລະຫັດເອກະສານໃໝ່.", default: "VKS-", mono: true },
      { key: "keepDays", type: "number", label: "ເກັບຂໍ້ມູນ", unit: "ມື້", min: 1, max: 999, default: 90 },
      { key: "hours", type: "time-range", label: "ຊ່ວງເວລາ", default: "08:00-17:00" },
      { key: "days", type: "days", label: "ມື້ທີ່ໃຊ້", default: "1111100" },
    ] },
    { header: "ກຸ່ມ B — ຕົວເລືອກ", sub: "ຕົວຢ່າງ: ເປີດ/ປິດ, ຮູບແບບ, ລາຍການ", tone: "primary", rows: [
      { key: "enabled", type: "switch", label: "ເປີດໃຊ້", default: true },
      { key: "option", type: "select", label: "ຕົວເລືອກ", default: "1", options: [{ value: "1", label: "ຕົວເລືອກ 1" }, { value: "2", label: "ຕົວເລືອກ 2" }, { value: "3", label: "ຕົວເລືອກ 3" }] },
      { key: "mode", type: "segmented", label: "ຮູບແບບ", default: "auto", options: [{ value: "auto", label: "ອັດຕະໂນມັດ" }, { value: "manual", label: "ດ້ວຍມື" }] },
      { key: "require", type: "checkbox-list", label: "ຕ້ອງມີ", default: ["photo"], options: [{ value: "photo", label: "ຮູບຖ່າຍ" }, { value: "note", label: "ໝາຍເຫດ" }, { value: "sign", label: "ລາຍເຊັນ" }] },
      { key: "seed", type: "action", label: "ຂໍ້ມູນຕົວຢ່າງ", help: "ບໍ່ນັບເຂົ້າການບັນທຶກ.", actionLabel: "ສ້າງຂໍ້ມູນໃໝ່" },
    ] },
  ],
  members: [
    { id: "1", name: "ສົມສັກ ພົມມະ", dept: "ບໍລິຫານ", role: "ເຈົ້າຂອງ", status: "active", lastSeen: "ມື້ນີ້ 09:12" },
    { id: "2", name: "ນາລີ ແກ້ວມະນີ", dept: "ບັນຊີ", role: "ຜູ້ຈັດການ", status: "active", lastSeen: "ມື້ວານ" },
    { id: "3", name: "ບຸນມີ ສີສະຫວັດ", dept: "ປະຕິບັດການ", role: "ພະນັກງານ", status: "active", lastSeen: "3 ມື້ກ່ອນ" },
    { id: "4", name: "ວັນນາ ໄຊຍະວົງ", dept: "ປະຕິບັດການ", role: "ພະນັກງານ", status: "pending" },
    { id: "5", name: "ຄຳພອນ ອິນທະວົງ", dept: "ລູກຄ້າ", role: "ຜູ້ເບິ່ງ", status: "pending" },
  ],
  devices: [
    { id: "a", name: "Chrome · Windows", where: "ວຽງຈັນ", lastSeen: "ດຽວນີ້", current: true },
    { id: "b", name: "Safari · iPhone", where: "ວຽງຈັນ", lastSeen: "2 ຊົ່ວໂມງກ່ອນ", kind: "phone" },
    { id: "c", name: "Chrome · Android", where: "ປາກເຊ", lastSeen: "5 ມື້ກ່ອນ", kind: "phone" },
  ],
  integrations: [
    { id: "sheets", name: "Google Sheets", detail: "ຊິ້ງລ່າສຸດ 5 ນາທີກ່ອນ", status: "connected", actionLabel: "ຊິ້ງດຽວນີ້" },
    { id: "telegram", name: "Telegram", detail: "@vks_alert_bot", status: "connected", actionLabel: "ທົດສອບ" },
    { id: "drive", name: "Google Drive", detail: "ໝົດອາຍຸ 2 ມື້ກ່ອນ", status: "expired" },
    { id: "push", name: "Web Push", status: "off" },
  ],
  audit: [
    { who: "ນາລີ ແກ້ວມະນີ", field: "ເຂດເວລາ", from: "Asia/Bangkok", to: "Asia/Vientiane", at: "12/09 14:20" },
    { who: "ສົມສັກ ພົມມະ", field: "ສິດ: ສົ່ງອອກຂໍ້ມູນ", from: "1000", to: "1100", at: "10/09 09:05" },
  ],
  storage: { usedGb: 11.2, totalGb: 15 },
  info: { passwordAge: "42 ມື້ກ່ອນ", lastBackup: "ມື້ນີ້ 02:00 · ສຳເລັດ" },
  load: () => ({ "profile.name": "ສົມສັກ ພົມມະ", "profile.code": "G001", "profile.phone": "55123456", "profile.email": "somsak@vks.la", "general.orgName": "VKS Security" }),
  save: async () => { await new Promise((r) => setTimeout(r, 600)) },
  onAction: (id) => toast(id),
})

const settingsBarDemo = { ...settingsDemo, saveMode: "bar" as const }
function SettingsGallery() {
  return <Sec id="settings-page" title="Settings page (view first: details open on ແກ້ໄຂ, preferences auto-save with Undo)">
    <SettingsPage config={settingsDemo} showKinds commandK={false} />
    <p className="mt-6 mb-2 text-sm leading-normal text-muted-foreground">saveMode "bar" — preferences wait in the sticky save bar</p>
    <SettingsPage config={settingsBarDemo} commandK={false} />
  </Sec>
}

export function More() {
  const { theme, setTheme } = useTheme()
  const [nv, setNv] = React.useState("home"), [date, setDate] = React.useState("2026-09-30"), [sel, setSel] = React.useState<string[]>([]), [multi, setMulti] = React.useState<string[]>(["a"])
  const [chip, setChip] = React.useState<string[]>(["all"]), [q, setQ] = React.useState(""), [otp, setOtp] = React.useState(""), [step, setStep] = React.useState(1)
  const [drawer, setDrawer] = React.useState<Row | null>(null), [lb, setLb] = React.useState<number | null>(null), [page, setPage] = React.useState(3), [stars, setStars] = React.useState(4)
  const [range, setRange] = React.useState<Range>({ from: "2026-09-10", to: "2026-09-16" }), [confirm, setConfirm] = React.useState<null | "warning" | "danger" | "hold">(null), [rows2, setRows2] = React.useState(["ສົມຊາຍ", "ນາງບົວ", "ທ້າວດາວ"]), [al, setAl] = React.useState(true)
  const [dSite, setDSite] = React.useState<string[]>([]), [dDate, setDDate] = React.useState(""), [dRange, setDRange] = React.useState<Range>({}), [dKind, setDKind] = React.useState<string[]>(["door"]), [dPush, setDPush] = React.useState(false)
  const [tm, setTm] = React.useState("09:30"), [shift, setShift] = React.useState({ s: "18:00", e: "06:00" }), [dShift, setDShift] = React.useState({ s: "06:00", e: "18:00" })
  const [lang, setL] = React.useState(getLang()), [scan, setScan] = React.useState(false), [full, setFull] = React.useState(false), [last, setLast] = React.useState("")
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
        <Sec id="fields" title="Input types: text, phone, money, time, number"><FieldsGallery /></Sec>
        <FormKitGallery />
        <SettingsGallery />
        <Sec id="pickers" title="Date picker, dropdown, chips, search">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1"><Label>ວັນທີ (popover on desktop, wheel on phone)</Label><DatePicker value={date} onChange={setDate} /></div>
            <div className="space-y-1"><Label>ຈຸດ (single, searchable)</Label><Combobox options={sites} value={sel} onChange={setSel} /></div>
            <div className="space-y-1"><Label>ຈຸດ (multiple)</Label><Combobox multiple options={sites} value={multi} onChange={setMulti} /></div>
            <div className="space-y-1"><Label>ຄົ້ນຫາ</Label><SearchBox value={q} onChange={setQ} /></div>
            <div className="space-y-1"><Label htmlFor="g-time">ເວລາ (TimePicker)</Label><TimePicker id="g-time" value={tm} onChange={setTm} /></div>
            <TimeRangePicker id="g-shift" starts={shift.s} ends={shift.e} onChange={(s, e) => setShift({ s, e })} />
          </div>
          <FilterChips options={[{ value: "all", label: "ທັງໝົດ" }, { value: "ok", label: "ສຳເລັດ" }, { value: "wait", label: "ລໍຖ້າ" }, { value: "late", label: "ຊ້າ" }]} value={chip} onChange={setChip} />
          <Dialog><DialogTrigger asChild><Button variant="outline" data-testid="picker-in-dialog">Pickers inside a Dialog</Button></DialogTrigger><DialogContent>
            <DialogHeader><DialogTitle>ລາຍງານເຫດການ</DialogTitle><DialogDescription>Phone: every picker pushes a view inside this sheet (no sheet on a sheet).</DialogDescription></DialogHeader>
            <FilterChips options={[{ value: "door", label: "ປະຕູ" }, { value: "person", label: "ຄົນແປກໜ້າ" }, { value: "fire", label: "ໄຟ" }]} value={dKind} onChange={setDKind} />
            <div className="space-y-1"><Label>ຈຸດ</Label><Combobox options={sites} value={dSite} onChange={setDSite} /></div>
            <div className="space-y-1"><Label>ວັນທີ</Label><DatePicker value={dDate} onChange={setDDate} /></div>
            <div className="space-y-1"><Label>ໄລຍະເວລາ</Label><DateRangePicker value={dRange} onChange={setDRange} /></div>
            <TimeRangePicker starts={dShift.s} ends={dShift.e} onChange={(s, e) => setDShift({ s, e })} />
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
        <BusinessKit />
        <Kit080 />
        <DomainKit />
        <Sec id="roadmap" title="Roadmap & dependency map">
          <Card><CardContent className="space-y-6 pt-5">
            <Roadmap start="2026-10-01" end="2027-04-01" today="2026-10-20" rows={[{ id: "p0", label: "P0 · Kit", start: "2026-10-01", end: "2026-11-10", progress: 60, tone: "success" }, { id: "p1", label: "P1 · Foundation", start: "2026-11-01", end: "2027-01-10" }, { id: "p2", label: "P2 · Live duty", start: "2027-01-01", end: "2027-03-20", tone: "gold" }]} milestones={[{ id: "m1", at: "2026-11-10", label: "Kit 0.3" }]} onSelect={(r) => toast(r.label)} onMilestone={(m) => toast(m.label)} />
            <DependencyMap columns={["P0", "P1", "P2"]} nodes={[{ id: "a", label: "Kit", sub: "done", column: 0, tone: "success" }, { id: "b", label: "Auth", sub: "planned", column: 1, deps: ["a"] }, { id: "c", label: "Schema", sub: "decided", column: 1, deps: ["a"], tone: "gold" }, { id: "d", label: "QR scan", column: 2, deps: ["b", "c"] }]} onSelect={(n) => toast(n.label)} />
          </CardContent></Card>
        </Sec>
        <Sec id="charts" title="Charts (own entry point, only loaded where used)">
          <div className="grid gap-4 md:grid-cols-3"><Card className="md:col-span-2"><CardHeader><CardTitle>ສະແກນຕໍ່ວັນ</CardTitle></CardHeader><CardContent><BarSeries data={chart} x="d" y={["ok", "late"]} onPick={(r, k) => toast(String(r.d) + (k ? " · " + k : ""))} /></CardContent></Card>
            <Card><CardHeader><CardTitle>ສະຖານະ</CardTitle></CardHeader><CardContent><Donut data={[{ name: "ສຳເລັດ", value: 82 }, { name: "ຊ້າ", value: 12 }, { name: "ພາດ", value: 6 }]} onPick={(s) => toast(s.name + " " + s.value)} /></CardContent></Card></div>
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
          <Kanban cardLines={1} columns={[{ id: "todo", title: "ຕ້ອງເຮັດ" }, { id: "doing", title: "ກຳລັງເຮັດ" }, { id: "done", title: "ສຳເລັດ" }]} cards={cards} onChange={(c) => setCards(c)} />
        </Sec>
        <Sec id="kit-0-6-1" title="0.6.1: ContactActions, SlotPicker, RangeInline, DateInput (ShareImageDialog: see docs)">
          <KitSixOneDemo />
        </Sec>
        <Sec id="kit-0-6" title="0.6: centred popup with width, FormActions lead + phone row, IconButton, one-line Kanban cards">
          <KitSixDemo />
        </Sec>
        <Sec id="map" title="Map (Leaflet + OpenStreetMap)">
          <MapView flush pins={[{ id: "1", lat: 17.9757, lng: 102.6331, label: "ປະຕູໜ້າ", sub: "ສົມພອນ · ເຂົ້າກະແລ້ວ", meta: "08:12", tone: "success" }, { id: "2", lat: 17.9801, lng: 102.6402, label: "ຄັງສິນຄ້າ", sub: "ຊ້າ 12 ນາທີ", meta: "08:40", tone: "warning" }, { id: "3", lat: 17.9702, lng: 102.6255, label: "ພາດ", sub: "ບໍ່ມີການສະແກນ QR", meta: "09:05", tone: "danger" }]} renderCard={() => <div className="flex gap-2"><Button size="sm" variant="outline" className="flex-1">ເບິ່ງປະຫວັດ</Button><Button size="sm" className="flex-1">ໂທຫາ</Button></div>} />
        </Sec>
        <Sec id="capture" title="Signature, photo, QR scan, lightbox">
          <div className="grid gap-4 md:grid-cols-2">
            <div><Label>ລາຍເຊັນ</Label><SignaturePad /></div>
            <div className="space-y-3"><PhotoCapture onPhoto={(p) => setLast(p.bytes + " bytes")} /><Button variant="outline" onClick={() => setScan(!scan)}><MapPin />{scan ? "ປິດກ້ອງ" : "ສະແກນ QR"}</Button>{scan && <QrScanner className="max-w-xs" onScan={setLast} />}
                <Button variant="outline" onClick={() => setFull(true)}>ສະແກນເຕັມຈໍ</Button>
                {full && <div className="fixed inset-0 z-50"><QrScanner variant="fullscreen" frameTop="38%" hint="ຫັນກ້ອງໃສ່ QR ຂອງຈຸດກວດ" onScan={(t) => { setLast(t); setFull(false) }} />
                  <Button variant="outline" className="absolute left-3 top-3 min-h-11" onClick={() => setFull(false)}>ປິດ</Button></div>}{last && <p className="text-sm">{last}</p>}
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
        <Sec id="instant-data" title="Instant data · cached page data, prefetch, sticky filters"><DataDemo /></Sec>
        <MotionKit />
        <MobileKit />
      <PhoneRulesKit />
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
/** Business patterns: approval, sync status, audit trail (Timeline + diffFields). Demo data only. */
function BusinessKit() {
  const [st, setSt] = React.useState<ApprovalStatus>("pending"), [why, setWhy] = React.useState("")
  const [q, setQ] = React.useState(3), [fail, setFail] = React.useState(false), [busy, setBusy] = React.useState(false), [last, setLast] = React.useState(() => Date.now() - 12 * 60_000)
  const wait = () => new Promise((r) => setTimeout(r, 700))
  const retry = async () => { setBusy(true); await wait(); setBusy(false); setFail(false); setQ(0); setLast(Date.now()) }
  return <Sec id="business" title="Business · approval, sync status, audit trail">
    <div className="grid gap-6 md:grid-cols-3">
      <div className="space-y-3">
        <ApprovalCard title="ຂໍລາພັກ 2 ມື້" summary="03–04/10 · ເຫດຜົນ: ທຸລະກິດຄອບຄົວ" requester="ພະນັກງານ ຕົວຢ່າງ" requesterRole="ຍາມ · ຈຸດ A" requestedAt="02/10 08:15"
          status={st} decidedBy="ຫົວໜ້າ ຕົວຢ່າງ" decidedAt="02/10 09:00" reason={why}
          onApprove={async () => { await wait(); setSt("approved"); toast.success("ອະນຸມັດແລ້ວ") }} onReject={async (r) => { await wait(); setWhy(r); setSt("rejected") }} />
        {st !== "pending" && <Button size="sm" variant="ghost" onClick={() => setSt("pending")}>Reset</Button>}
      </div>
      <div className="space-y-3">
        <SyncStatus queued={0} lastSyncAt={Date.now() - 30_000} />
        <SyncStatus queued={q} error={fail ? "HTTP 500" : undefined} lastSyncAt={last} syncing={busy} onRetry={retry} />
        <SyncStatus queued={2} error="ເຊີບເວີບໍ່ຕອບ" lastSyncAt={Date.now() - 3 * 3600_000} onRetry={() => toast("retry")} />
        <div className="flex flex-wrap gap-2"><Button size="sm" variant="outline" onClick={() => setQ((n) => n + 1)}>+1 ຄິວ</Button><Button size="sm" variant="outline" onClick={() => setFail((v) => !v)}>Toggle fail</Button><SyncStatus compact queued={q} error={fail} syncing={busy} onRetry={retry} /></div>
      </div>
      <Timeline items={[
        { id: "a3", time: "02/10 09:02", actor: "ຫົວໜ້າ ຕົວຢ່າງ", title: "ແກ້ໄຂກະເຂົ້າວຽກ", tone: "warning", changes: diffFields({ shift: "ກາງເວັນ", site: "ຈຸດ A", start: "06:00" }, { shift: "ກາງຄືນ", site: "ຈຸດ B", start: "18:00" }, { labels: { shift: "ກະ", site: "ສະຖານທີ່", start: "ເລີ່ມ" } }) },
        { id: "a2", time: "02/10 08:15", actor: "ພະນັກງານ ຕົວຢ່າງ", title: "ສົ່ງຄຳຂໍລາພັກ", tone: "neutral" },
        { id: "a1", time: "01/10 17:40", actor: "HR ຕົວຢ່າງ", title: "ອະນຸມັດເງິນເພີ່ມ", tone: "success", changes: diffFields({ ot: 0 }, { ot: 120000 }, { labels: { ot: "OT (ກີບ)" } }) },
      ]} />
    </div>
  </Sec>
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
/** Phone rules kit (0.5.8): compact rows, popup actions with ⋯, folding sections, pinned sheet footer, save that says why. */
const phoneRows = [{ id: "1", tel: "020 5938 8274", st: "ໃໝ່", src: "Facebook" }, { id: "2", tel: "020 9944 5662", st: "ໂທຄືນ", src: "WhatsApp · ໂທ 12/11" }, { id: "3", tel: "020 9155 0224", st: "ບໍ່ຮັບສາຍ", src: "TikTok · ສາຍເຂົ້າ" }]
function PhoneRulesKit() {
  const [form, setForm] = React.useState(false), [filter, setFilter] = React.useState(false), [res, setRes] = React.useState<string | null>(null), [fold, setFold] = React.useState(false)
  const cols: Column<(typeof phoneRows)[number]>[] = [
    { key: "tel", header: "ເບີໂທ", row: "title", cell: (r) => <span className="font-mono">{r.tel}</span> },
    { key: "st", header: "ສະຖານະ", row: "title", cell: (r) => <Badge>{r.st}</Badge> },
    { key: "src", header: "ແຫຼ່ງທີ່ມາ", row: "sub", cell: (r) => r.src },
    { key: "call", header: "", row: "action", cell: () => <Button size="icon" className="rounded-full" aria-label="ໂທ" onClick={() => setForm(true)}><Phone /></Button> },
  ]
  return <Sec id="phone-rules" title="Phone rules · compact rows, ⋯ actions, folding sections, pinned sheet footer, save that says why">
    <div className="grid gap-4 md:grid-cols-2 [&>*]:min-w-0">
      <div className="space-y-2"><DataTable mode="rows" columns={cols} rows={phoneRows} rowKey={(r) => r.id} onRowClick={() => setForm(true)} /><p className="text-xs leading-normal text-muted-foreground">mode="rows" is a phone layout: open this page at 360 px. Desktop shows the table.</p></div>
      <div className="flex flex-wrap content-start gap-2"><Button variant="outline" onClick={() => setForm(true)}>Form with FormActions</Button><Button variant="outline" onClick={() => setFilter(true)}>Sheet with footer</Button></div>
    </div>
    <Dialog open={form} onOpenChange={setForm}>
      <FormDialogContent title="ໂທຫາ 020 5938 8274" footer={<FormActions info="ເພີ່ມໂດຍ ໂສດາ · 02/11"
        primary={<Button variant="action" disabledReason={res ? null : "ເລືອກ ຮັບສາຍ ຫຼື ບໍ່ຮັບສາຍ"} onBlockedPress={(w) => toast.warning(w)} onClick={() => { toast.success("ບັນທຶກແລ້ວ"); setForm(false) }}>ບັນທຶກການໂທ</Button>}
        secondary={[<Button key="c" variant="outline" onClick={() => setForm(false)}>ຍົກເລີກ</Button>]}
        more={[{ label: "ແກ້ໄຂ", icon: <Pencil />, onPress: () => toast("ແກ້ໄຂ") }, { label: "ລຶບ", icon: <Trash2 />, destructive: true, onPress: () => toast("ລຶບ") }]} />}>
        <div className="grid gap-3">
          <Field label="ການຕອບຮັບ"><div className="flex gap-2">{["ຮັບສາຍ", "ບໍ່ຮັບສາຍ"].map((o) => <Button key={o} variant={res === o ? "default" : "outline"} className="flex-1" onClick={() => setRes(o)}>{o}</Button>)}</div></Field>
          <FoldSection title="ຂໍ້ມູນສ່ວນຕົວ" hint="ຍັງຂາດ ເພດ, ວັນເກີດ" open={fold} onOpenChange={setFold}><Field label="ຊື່"><Input /></Field><Field label="ນາມສະກຸນ"><Input /></Field></FoldSection>
        </div>
      </FormDialogContent>
    </Dialog>
    <Sheet open={filter} onOpenChange={setFilter}>
      <SheetContent side="bottom" footer={<Button className="w-full" onClick={() => setFilter(false)}>ສະແດງ 12 ຄົນ</Button>}>
        <SheetTitle>ກັ່ນຕອງ</SheetTitle>
        <div className="mt-3 grid gap-2">{Array.from({ length: 14 }, (_, i) => <div key={i} className="rounded-xl border p-3 text-sm">ຕົວເລືອກ {i + 1}</div>)}</div>
      </SheetContent>
    </Sheet>
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
  const [now, setNow] = React.useState(() => stampTime())
  const [img, setImg] = React.useState<string | null>(null)
  React.useEffect(() => { const i = setInterval(() => setNow(stampTime()), 1000); return () => clearInterval(i) }, [])
  const data = { time: now, site: "ຄັງສິນຄ້າ ໂຮງງານເບຍລາວ ສາຂາວຽງຈັນ", gps: "17.97570, 102.63310 (±8 m)" }
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary/70 to-muted md:aspect-video"><CaptureStamp data={data} /></div>
      <div className="space-y-3">
        <PhotoCapture label="ຖ່າຍ + ຕີຕາ" onPhoto={async (ph) => setImg(URL.createObjectURL(await stampPhoto(ph.blob, { ...data, time: stampTime() })))} />
        {img && <img src={img} alt="" className="w-full rounded-2xl border" />}
      </div>
    </div>
  )
}

/** 0.6 demo: the appointment popup pattern from the Call Center (centred, 46rem, lead + daily answer right, phone row). */
function KitSixDemo() {
  const [open, setOpen] = React.useState(false)
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild><Button>ເປີດ ນັດ (width 46rem)</Button></DialogTrigger>
        <FormDialogContent width="46rem" title="ທ້າວ ບຸນມີ ແກ້ວດາລາ" description="APT-000002 · ນັດຄັ້ງທີ 1"
          footer={<FormActions phone="row"
            lead={<Button variant="ghost"><User />ຂໍ້ມູນຜູ້ສະໝັກ</Button>}
            more={[{ label: "ໃບນັດ", icon: <ReceiptText />, onPress: () => toast("ໃບນັດ") }, { label: "ເລື່ອນ", icon: <ArrowRight />, onPress: () => toast("ເລື່ອນ") }, { label: "ຍົກເລີກນັດ", icon: <Ban />, destructive: true, onPress: () => toast("ຍົກເລີກ") }]}
            secondary={[<Button key="n" variant="outline" onClick={() => toast("ບໍ່ມາ")}><X />ບໍ່ມາ</Button>]}
            primary={<Button variant="action" onClick={() => { toast.success("ມາແລ້ວ"); setOpen(false) }}><Check />ມາ</Button>} />}>
          <p className="text-sm leading-normal text-muted-foreground">ສຸກ 20/11/2026 · 09:00 · ມື້ອື່ນ</p>
        </FormDialogContent>
      </Dialog>
      <IconButton label="ສຳເນົາຮູບ" icon={<CopyIcon />} onClick={() => toast("copied")} />
      <IconButton label="ແບ່ງປັນ" icon={<Share2 />} onClick={() => toast("share")} />
      <Button><Download />ດາວໂຫຼດ</Button>
    </div>
  )
}

function KitSixOneDemo() {
  const [slot, setSlot] = React.useState({ d: "", t: "" }), [r, setR] = React.useState<Range>({}), [dob, setDob] = React.useState<string | null>(null)
  const today = new Date().toISOString().slice(0, 10)
  return (
    <div className="grid gap-4">
      <div className="flex items-center gap-3"><span className="font-mono text-sm">020 5512 3456</span><ContactActions phone="2055123456" call /></div>
      <SlotPicker date={slot.d} time={slot.t} onChange={(d, t) => setSlot({ d, t })} times={[...halfHours("08:00", "11:30"), ...halfHours("13:00", "16:30")]} />
      <div className="grid gap-4 md:grid-cols-2"><RangeInline value={r} onChange={setR} presets={[["ມື້ນີ້", { from: today, to: today }]]} allLabel="ທຸກວັນທີ" /><DateInput value={dob} onChange={setDob} today={today} /></div>
    </div>
  )
}

/** VKS domain parts: patrol round, shift roster, incident SLA, guard ID, quote (+ Kip / phone fields). */
function DomainKit() {
  const [cps, setCps] = React.useState<Checkpoint[]>([
    { id: "1", name: "ປະຕູໜ້າ", status: "done", time: "21:02", method: "nfc", distanceM: 4 },
    { id: "2", name: "ບ່ອນຈອດລົດ B1", status: "done", time: "21:18", method: "qr", distanceM: 7 },
    { id: "3", name: "ຄັງສິນຄ້າ B", status: "next", distanceM: 240 },
    { id: "4", name: "ຫຼັງຄາ / ຖັງນ້ຳ", status: "pending" },
  ])
  const scan = async (cp: Checkpoint) => { await new Promise((r) => setTimeout(r, 600)); setCps((l) => { const i = l.findIndex((c) => c.id === cp.id); return l.map((c, j) => (j === i ? { ...c, status: "done", time: "21:4" + i, method: "nfc", distanceM: 3 } : j === i + 1 ? { ...c, status: "next" } : c)) }) }
  const [roster, setRoster] = React.useState<Roster>({ a: { mon: "D", tue: "D", wed: "N", thu: "OFF" }, b: { mon: "N", tue: "N", wed: "OFF", thu: "D" }, c: { mon: "D", tue: "OFF", wed: "D", thu: "N" } })
  const setCell = (s: string, d: string, v: ShiftCode) => setRoster((x) => ({ ...x, [s]: { ...x[s], [d]: v } }))
  const [lines, setLines] = React.useState<QuoteLine[]>([{ id: "g", label: "ພະນັກງານຍາມ 12 ຊົ່ວໂມງ", qty: 10, unitPrice: 8_000_000, unit: "ນາຍ", min: 1 }, { id: "s", label: "ຫົວໜ້າກະ", qty: 1, unitPrice: 10_500_000, unit: "ນາຍ" }])
  const [fee, setFee] = React.useState<number | null>(144_000_000), [tel, setTel] = React.useState("")
  const [opened] = React.useState(() => Date.now() - 10 * 60_000 - 42_000)
  return <Sec id="domain" title="VKS domain · patrol rail, shift roster, incident SLA, guard ID, quote, Kip & phone">
    <div className="grid gap-6 lg:grid-cols-2">
      <PatrolCheckpointRail checkpoints={cps} onScan={scan} />
      <div className="grid content-start gap-3">
        <IncidentEscalationCard code="INC-204" priority="P1" title="ສັນຍານເຕືອນປະຕູສາງ B" location="ທ່າບົກ ທ່ານາແລ້ງ" reporter="ຫົວໜ້າກະ ສົມພອນ" reporterPhone="020 5512 8890" openedAt={opened} status="ລໍຖ້າສັ່ງການໜ່ວຍລາດຕະເວນ" dispatchLabel="ສັ່ງການໜ່ວຍ Patrol-02" onDispatch={() => new Promise((r) => setTimeout(r, 700)).then(() => toast.success("ສັ່ງການແລ້ວ"))} />
        <GuardIdBadge name="ທ້າວ ຄຳພັນ ພົມມະວົງ" staffId="VKS-ID-0412" role="ຫົວໜ້າຊຸດປະຈຳການ" site="ທະນາຄານ BCEL (ສຳນັກງານໃຫຍ່)" validUntil="31/12/2027" />
      </div>
      <div className="lg:col-span-2"><ShiftRosterGrid staff={[{ id: "a", name: "ທ້າວ ຄຳພັນ", sub: "ຫົວໜ້າກະ" }, { id: "b", name: "ທ້າວ ສົມພອນ" }, { id: "c", name: "ນາງ ບົວໄລ" }]} days={[{ key: "mon", label: "ຈັນ" }, { key: "tue", label: "ອັງຄານ" }, { key: "wed", label: "ພຸດ" }, { key: "thu", label: "ພະຫັດ" }]} value={roster} onChange={setCell} need={{ D: 1, N: 1 }} /></div>
      <ContractQuoteSummary title="ໃບສະເໜີລາຄາ" lines={lines} onChange={setLines} />
      <div className="grid content-start gap-3">
        <Field label="ຄ່າບໍລິການລາຍເດືອນ (ກີບ)"><MoneyInput value={fee} onChange={setFee} /></Field>
        <Field label="ເບີໂທຜູ້ປະສານງານ"><PhoneInput value={tel} onChange={setTel} /></Field>
      </div>
    </div>
  </Sec>
}

/** 0.8: React 19 form actions, optimistic scans, sortable list, expand card. */
function Kit080() {
  const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))
  const [err, save] = React.useActionState(async (_: string | null, f: FormData) => { await wait(800); const n = String(f.get("n") ?? "").trim(); if (!n) return "ໃສ່ຊື່ກ່ອນ"; toast.success("ບັນທຶກ " + n); return null }, null)
  const [cps, setCps] = React.useState([{ id: "1", name: "ປະຕູໜ້າ", status: "todo" }, { id: "2", name: "ບ່ອນຈອດລົດ", status: "todo" }, { id: "3", name: "ສາງ B", status: "todo" }])
  const [off, setOff] = React.useState(false), offRef = React.useRef(off); offRef.current = off
  const opt = useOptimisticList(cps, async (cp, p) => { await wait(800); if (offRef.current) throw new Error("offline"); setCps((l) => l.map((x) => (x.id === cp.id ? { ...x, ...p } : x))) })
  const [order, setOrder] = React.useState(["ປະຕູໜ້າ", "ບ່ອນຈອດລົດ B1", "ຄັງສິນຄ້າ B", "ຫຼັງຄາ"])
  return <Sec id="kit-0-8" title="0.8: SubmitButton, optimistic scans, SortableList, ExpandCard, PageHeader docTitle">
    <PageHeader title="ກະ" subtitle="ຊື່ແຖບ browser ປ່ຽນເປັນ (3) ກະ · VKS Gallery" docTitle appName="VKS Gallery" badge={3} />
    <div className="grid gap-6 md:grid-cols-2">
      <form action={save} className="grid content-start gap-3"><Field label="ຊື່ສະຖານທີ່" error={err ?? undefined}><Input name="n" invalid={!!err} /></Field><SubmitButton pendingLabel="ກຳລັງບັນທຶກ…">ບັນທຶກ</SubmitButton></form>
      <div className="grid content-start gap-2">
        <label className="flex min-h-11 items-center gap-2 text-sm"><input type="checkbox" checked={off} onChange={(e) => setOff(e.target.checked)} />ຈຳລອງເນັດຫຼຸດ</label>
        {opt.items.map((cp) => <div key={cp.id} className="flex min-h-14 items-center gap-3 rounded-xl border bg-card px-3"><span className="flex-1 font-semibold">{cp.name}</span>{cp.status === "done" ? <Badge variant="success" dot>{opt.pending.includes(cp.id) ? "ກຳລັງສົ່ງ…" : "ສຳເລັດ"}</Badge> : <Button size="sm" variant="action" onClick={() => opt.mark(cp, { status: "done" })}><ScanLine />ສະແກນ</Button>}</div>)}
      </div>
      <SortableList items={order} getId={(x) => x} onChange={setOrder} render={(x, i) => <b>{i + 1}. {x}</b>} />
      <div className="grid content-start gap-2 sm:grid-cols-2">
        {["06:00–18:00", "18:00–06:00"].map((t) => <ExpandCard key={t} title={t + " · ທະນາຄານ BCEL"} summary={<><b className="text-lg tabular-nums">{t}</b><div className="text-sm text-muted-foreground">ທະນາຄານ BCEL</div></>}><p className="text-sm text-muted-foreground">4 ຈຸດກວດ · ປະຕູໜ້າ</p></ExpandCard>)}
      </div>
    </div>
  </Sec>
}
