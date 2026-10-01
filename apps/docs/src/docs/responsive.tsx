import * as React from "react"
import { Monitor, Smartphone, Plus, Printer, Download, Share2, MoreHorizontal, Pencil, Phone, Trash2, Check, X, Filter } from "@vks/ui/icons"
import {
  DataTable, type Column, Badge, Avatar, Button, Card, CardContent, Input, Textarea, Label, PageHeader, Fab, SearchBox, FilterChips, Combobox,
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, Menu, MenuTrigger, MenuContent, MenuItem, MenuSeparator,
  ButtonGroup, BottomToolbar, useIsMobile, useLongPress, toast, cn,
} from "@vks/ui"
import { fmtKip } from "@vks/core"
import { PhoneFrame, DesktopFrame } from "./layout"
import { CodeBlock, H2, H3, P, Code, FeatureCard, FeatureGrid, useT } from "./kit"

/* ================================================================ demo data */
type Guard = { id: string; name: string; site: string; shift: string; checkin: string; status: "on" | "late" | "off"; pay: number }
const roster: Guard[] = [
  { id: "1", name: "ສົມຊາຍ ພົມມະວົງ", site: "ປະຕູໜ້າ", shift: "ກາງເວັນ", checkin: "05:52", status: "on", pay: 2400000 },
  { id: "2", name: "ນາງບົວ ແສງສະຫວ່າງ", site: "ບ່ອນຈອດລົດ", shift: "ກາງເວັນ", checkin: "06:11", status: "late", pay: 2250000 },
  { id: "3", name: "ທ້າວດາວ ສີສຸວັນ", site: "ຄັງສິນຄ້າ", shift: "ກາງຄືນ", checkin: "—", status: "off", pay: 2600000 },
  { id: "4", name: "ແກ້ວ ວົງສາ", site: "ຫ້ອງເຊີເວີ", shift: "ກາງຄືນ", checkin: "17:48", status: "on", pay: 2600000 },
  { id: "5", name: "ພອນ ໄຊຍະວົງ", site: "ປະຕູຫຼັງ", shift: "ກາງເວັນ", checkin: "05:58", status: "on", pay: 2400000 },
]
const statusView = { on: { l: "ເຂົ້າກະແລ້ວ", v: "success" }, late: { l: "ມາຊ້າ", v: "warning" }, off: { l: "ຍັງບໍ່ເຂົ້າ", v: "neutral" } } as const
const guardCols: Column<Guard>[] = [
  { key: "n", header: "ພະນັກງານ", primary: true, cell: (r) => <span className="inline-flex items-center gap-2"><Avatar name={r.name} size={28} />{r.name}</span> },
  { key: "s", header: "ຈຸດ", cell: (r) => r.site },
  { key: "sh", header: "ກະ", cell: (r) => r.shift },
  { key: "c", header: "ເຂົ້າກະ", cell: (r) => <span className="tabular-nums">{r.checkin}</span> },
  { key: "st", header: "ສະຖານະ", cell: (r) => <Badge variant={statusView[r.status].v}>{statusView[r.status].l}</Badge> },
  { key: "p", header: "ເງິນເດືອນ", cell: (r) => <span className="tabular-nums">{fmtKip(r.pay)}</span> },
]
const shiftOpts = [{ value: "ກາງເວັນ", label: "ກາງເວັນ" }, { value: "ກາງຄືນ", label: "ກາງຄືນ" }]
const siteOpts = ["ປະຕູໜ້າ", "ປະຕູຫຼັງ", "ບ່ອນຈອດລົດ", "ຄັງສິນຄ້າ", "ຫ້ອງເຊີເວີ"].map((s) => ({ value: s, label: s }))

/* ================================================================ frames (rendered alone in an iframe, so the viewport is real) */
function RosterFrame() {
  const mobile = useIsMobile()
  const [q, setQ] = React.useState(""), [f, setF] = React.useState<string[]>([])
  const rows = roster.filter((r) => (!q || r.name.includes(q) || r.site.includes(q)) && (!f.length || f.includes(r.shift)))
  return <div className="min-h-dvh bg-background p-4 pb-24 leading-normal md:p-8">
    <PageHeader title="ລາຍຊື່ພະນັກງານ" subtitle={rows.length + " ຄົນ · ມື້ນີ້"} actions={!mobile && <Button onClick={() => toast("ເພີ່ມພະນັກງານ")}><Plus />ເພີ່ມພະນັກງານ</Button>} />
    <div className="my-4 flex flex-col gap-3 md:flex-row md:items-center">
      <SearchBox value={q} onChange={setQ} className="md:w-72" />
      <FilterChips options={shiftOpts} value={f} onChange={setF} multiple />
    </div>
    <DataTable columns={guardCols} rows={rows} rowKey={(r) => r.id} onRowClick={(r) => toast(r.name)} />
    {mobile && <Fab label="ເພີ່ມພະນັກງານ" onClick={() => toast("ເພີ່ມພະນັກງານ")} />}
  </div>
}

function FormFrame() {
  const [site, setSite] = React.useState<string[]>([]), [shift, setShift] = React.useState<string[]>(["ກາງເວັນ"])
  return <div className="min-h-dvh bg-background leading-normal">
    <div className="mx-auto max-w-3xl p-4 pb-28 md:p-8">
      <PageHeader title="ເພີ່ມພະນັກງານ" subtitle="ຂໍ້ມູນພື້ນຖານ ແລະ ຈຸດປະຈຳການ" />
      <Card className="mt-4"><CardContent className="grid gap-4 p-4 md:grid-cols-2 md:gap-x-6 md:p-6">
        <div className="space-y-1.5"><Label>ຊື່</Label><Input placeholder="ສົມຊາຍ" /></div>
        <div className="space-y-1.5"><Label>ນາມສະກຸນ</Label><Input placeholder="ພົມມະວົງ" /></div>
        <div className="space-y-1.5"><Label>ເບີໂທ</Label><Input inputMode="tel" placeholder="020 5555 1234" /></div>
        <div className="space-y-1.5"><Label>ກະ</Label><Combobox options={shiftOpts} value={shift} onChange={setShift} searchable={false} /></div>
        <div className="space-y-1.5 md:col-span-2"><Label>ຈຸດປະຈຳການ</Label><Combobox options={siteOpts} value={site} onChange={setSite} multiple /></div>
        <div className="space-y-1.5 md:col-span-2"><Label>ໝາຍເຫດ</Label><Textarea rows={3} placeholder="ລາຍລະອຽດເພີ່ມເຕີມ" /></div>
      </CardContent></Card>
      <div className="mt-6 hidden justify-end gap-2 md:flex"><Button variant="outline">ຍົກເລີກ</Button><Button onClick={() => toast.success("ບັນທຶກແລ້ວ")}>ບັນທຶກ</Button></div>
    </div>
    <div className="vks-glass fixed inset-x-0 bottom-0 flex gap-2 border-t p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden">
      <Button variant="outline" size="lg" className="flex-1">ຍົກເລີກ</Button><Button size="lg" className="flex-[2]" onClick={() => toast.success("ບັນທຶກແລ້ວ")}>ບັນທຶກ</Button>
    </div>
  </div>
}

const kindOpts = [{ value: "door", label: "ປະຕູ" }, { value: "person", label: "ຄົນແປກໜ້າ" }, { value: "fire", label: "ໄຟ" }, { value: "other", label: "ອື່ນໆ" }]
const postOpts = ["ປະຕູໜ້າ", "ປະຕູຫຼັງ", "ບ່ອນຈອດລົດ", "ຄັງສິນຄ້າ", "ຫ້ອງເຊີເວີ", "ຫ້ອງຄວບຄຸມ", "ລິຟ ຊັ້ນ 1", "ລິຟ ຊັ້ນ 2", "ຫຼັງຄາ", "ຮົ້ວທິດເໜືອ", "ຮົ້ວທິດໃຕ້", "ປ້ອມຍາມ"].map((s, i) => ({ value: s, label: s, hint: "P-" + String(i + 1).padStart(2, "0") }))

function OverlayFrame() {
  const mobile = useIsMobile()
  const [open, setOpen] = React.useState(false), [kind, setKind] = React.useState<string[]>(["door"]), [post, setPost] = React.useState<string[]>([])
  return <div className="flex min-h-dvh flex-col items-center justify-center gap-3 bg-background p-6 text-center leading-normal">
    <p className="text-sm text-muted-foreground">{mobile ? "ໂທລະສັບ: ແຜ່ນລຸ່ມ (bottom sheet)" : "ຄອມ: ກ່ອງກາງຈໍ (dialog)"}</p>
    <Button onClick={() => setOpen(true)}>ລາຍງານເຫດການ</Button>
    <Dialog open={open} onOpenChange={setOpen}><DialogContent>
      <DialogHeader><DialogTitle>ລາຍງານເຫດການ</DialogTitle><DialogDescription>ປະຕູໜ້າ · 08:12 · ສົມຊາຍ</DialogDescription></DialogHeader>
      <div className="space-y-1.5"><Label>ປະເພດ</Label><FilterChips options={kindOpts} value={kind} onChange={setKind} /></div>
      <div className="space-y-1.5"><Label>ຈຸດປະຈຳການ</Label><Combobox options={postOpts} value={post} onChange={setPost} placeholder="ເລືອກຈຸດ" /></div>
      <Textarea rows={2} placeholder="ເກີດຫຍັງຂຶ້ນ?" />
      <DialogFooter className="mt-2 flex-col-reverse md:flex-row"><Button variant="outline" className="w-full md:w-auto" onClick={() => setOpen(false)}>ຍົກເລີກ</Button><Button className="w-full md:w-auto" onClick={() => { setOpen(false); toast.success("ສົ່ງແລ້ວ") }}>ສົ່ງລາຍງານ</Button></DialogFooter>
    </DialogContent></Dialog>
  </div>
}

function ToolbarFrame() {
  const mobile = useIsMobile()
  const act = (l: string) => () => toast(l)
  return <div className="min-h-dvh bg-background p-4 pb-24 leading-normal md:p-8">
    <div className="flex items-center gap-2">
      <div className="min-w-0 flex-1"><div className="text-xs text-muted-foreground">ລາຍງານ · ມັງກອນ</div><h1 className="truncate text-xl font-bold md:text-2xl">ການກວດຈຸດປະຈຳເດືອນ</h1></div>
      {mobile ? <Menu><MenuTrigger asChild><Button variant="outline" size="icon" aria-label="ເພີ່ມເຕີມ"><MoreHorizontal /></Button></MenuTrigger>
        <MenuContent align="end"><MenuItem icon={<Printer />} onSelect={act("ພິມ")}>ພິມ</MenuItem><MenuItem icon={<Download />} onSelect={act("ສົ່ງອອກ")}>ສົ່ງອອກ Excel</MenuItem><MenuItem icon={<Share2 />} onSelect={act("ແບ່ງປັນ")}>ແບ່ງປັນ</MenuItem></MenuContent></Menu>
        : <><ButtonGroup label="ເຄື່ອງມື"><Button variant="outline" onClick={act("ພິມ")}><Printer />ພິມ</Button><Button variant="outline" onClick={act("ສົ່ງອອກ")}><Download />ສົ່ງອອກ</Button><Button variant="outline" onClick={act("ແບ່ງປັນ")}><Share2 />ແບ່ງປັນ</Button></ButtonGroup>
          <Button variant="outline" onClick={act("ຕົວກອງ")}><Filter />ຕົວກອງ</Button><Button onClick={act("ອະນຸມັດ")}><Check />ອະນຸມັດ</Button></>}
    </div>
    <div className="mt-5 grid gap-3 md:grid-cols-3">{["ກວດແລ້ວ 412", "ຂາດ 9", "ມາຊ້າ 23"].map((x, i) => <Card key={x}><CardContent className="p-4"><div className="text-xs text-muted-foreground">{["ສຳເລັດ", "ບໍ່ໄດ້ກວດ", "ຊ້າກວ່າກຳນົດ"][i]}</div><div className="text-2xl font-bold tabular-nums">{x.split(" ")[1]}</div><div className="text-sm">{x.split(" ")[0]}</div></CardContent></Card>)}</div>
    {mobile && <BottomToolbar fixed items={[{ id: "f", icon: <Filter />, label: "ຕົວກອງ", onPress: act("ຕົວກອງ") }, { id: "a", icon: <Check />, label: "ອະນຸມັດ", onPress: act("ອະນຸມັດ") }, { id: "r", icon: <X />, label: "ປະຕິເສດ", destructive: true, onPress: act("ປະຕິເສດ") }]} />}
  </div>
}

export const respFrames: Record<string, React.FC> = { "resp-table": RosterFrame, "resp-form": FormFrame, "resp-overlay": OverlayFrame, "resp-toolbar": ToolbarFrame }
/* ================================================================ page helpers */
/** Same page at two real widths. Desktop: side by side. Phone: a switch, because two frames do not fit. */
function DualFrame({ frame, h = 560, caption }: { frame: string; h?: number; caption?: string }) {
  const t = useT()
  const [v, setV] = React.useState<"desktop" | "phone">("phone")
  const Tab = ({ id, icon, label }: { id: "desktop" | "phone"; icon: React.ReactNode; label: string }) =>
    <button type="button" role="tab" aria-selected={v === id} onClick={() => setV(id)} className={cn("vks-press flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg text-sm font-semibold transition-colors [&_svg]:size-4", v === id ? "bg-card text-foreground shadow-sm" : "text-muted-foreground")}>{icon}{label}</button>
  return <figure className="vks-fade-up overflow-hidden rounded-2xl border bg-card">
    <div role="tablist" className="m-3 flex gap-1 rounded-xl bg-muted p-1 lg:hidden"><Tab id="phone" icon={<Smartphone />} label={t("ໂທລະສັບ", "Phone")} /><Tab id="desktop" icon={<Monitor />} label={t("ຄອມ", "Desktop")} /></div>
    <div className="vks-stage grid items-start gap-6 p-3 sm:p-6 lg:grid-cols-[minmax(0,1fr)_300px]">
      <div className={cn("min-w-0 space-y-2", v === "phone" && "hidden lg:block")}><div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground"><Monitor className="size-3.5" />{t("ຄອມ · 1180 px", "Desktop · 1180 px")}</div><DesktopFrame frame={frame} h={h} />
        {caption && <figcaption className="hidden rounded-xl border bg-card/80 p-4 text-sm leading-6 text-muted-foreground lg:mt-4 lg:block">{caption}</figcaption>}</div>
      <div className={cn("min-w-0 space-y-2", v === "desktop" && "hidden lg:block")}><div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground lg:justify-center"><Smartphone className="size-3.5" />{t("ໂທລະສັບ · 360 px", "Phone · 360 px")}</div>
        {/* scale() doesn't shrink layout, so pull the empty 20% back up on lg */}
        <div className="lg:mb-[calc(var(--ph)*-0.2)] lg:origin-top lg:scale-[0.8]" style={{ "--ph": h + 30 + "px" } as React.CSSProperties}><PhoneFrame frame={frame} h={h} /></div></div>
    </div>
    {caption && <figcaption className="border-t px-4 py-3 text-sm leading-6 text-muted-foreground lg:hidden">{caption}</figcaption>}
  </figure>
}

type Rule = { what: string; desktop: string; phone: string; why: string; api: string }
const getRules = (t: (lo: string, en: string) => string): Rule[] => [
  { what: t("ຂໍ້ມູນທີ່ມີ 5+ ຄໍລຳ", "Data with 5+ columns"), desktop: t("ຕາຕະລາງ: ກວາດຕາຕາມແຖວ, ຈັດຮຽງຕາມຫົວຄໍລຳ", "Table: scan across rows, sort by header"), phone: t("ໜຶ່ງ card ຕໍ່ແຖວ: ຫົວຂໍ້ + 3-4 ແຖວ key/value", "One card per row: title + 3-4 key/value lines"), why: t("ໜ້າຈໍ 360 px ໃສ່ໄດ້ປະມານ 3 ຄໍລຳ ກ່ອນຂໍ້ຄວາມຈະຕັດແຖວຈົນອ່ານຍາກ.", "A 360 px screen fits ~3 columns before text wraps into mush."), api: "<DataTable mode=\"auto\">" },
  { what: t("ຂໍ້ມູນທີ່ມີ ≤ 4 ຄໍລຳ", "Data with ≤ 4 columns"), desktop: t("ຕາຕະລາງ", "Table"), phone: t("ຕາຕະລາງ (ຍັງໃສ່ໄດ້)", "Table (still fits)"), why: t("Card ຈະເສຍຄວາມສູງໂດຍບໍ່ໄດ້ປະໂຫຍດ.", "Cards would waste height for no gain."), api: "<Table> / DataTable" },
  { what: t("ເມນູຫຼັກ", "Main navigation"), desktop: t("Sidebar (ເຫັນຕະຫຼອດ)", "Sidebar (always visible)"), phone: t("Bottom nav ສູງສຸດ 5 · ທີ່ເຫຼືອໃສ່ໃນ drawer", "Bottom nav, max 5 · rest in a drawer"), why: t("ໂປ້ມືເອື້ອມເຖິງດ້ານລຸ່ມ, ບໍ່ແມ່ນມຸມຊ້າຍເທິງ.", "The thumb reaches the bottom, not the top-left."), api: "<AppShell>" },
  { what: t("ປຸ່ມຫຼັກ", "Primary action"), desktop: t("ປຸ່ມຢູ່ມຸມຂວາເທິງຂອງ page header", "Button top-right in the page header"), phone: t("ປຸ່ມລອຍ (Fab) ຫຼື sticky bottom bar", "Floating button (Fab) or sticky bottom bar"), why: t("ມຸມຂວາເທິງເອື້ອມຍາກທີ່ສຸດເມື່ອໃຊ້ມືດຽວ.", "Top-right is the hardest spot to reach one-handed."), api: "<Fab> / <PageHeader actions>" },
  { what: t("Dialog", "Dialogs"), desktop: t("Dialog ກາງຈໍ, ສູງສຸດ 28 rem", "Centred dialog, max 28 rem"), phone: t("Bottom sheet ເຕັມຄວາມກວ້າງ, ລາກເພື່ອປິດ", "Bottom sheet, full width, drag to close"), why: t("ແປ້ນພິມ ແລະ ໂປ້ມື ຢູ່ດ້ານລຸ່ມທັງຄູ່.", "Keyboard + thumb both live at the bottom."), api: "<Dialog> (automatic)" },
  { what: t("Picker ແລະ dropdown", "Pickers & dropdowns"), desktop: t("Popover ຢູ່ລຸ່ມຊ່ອງ", "Popover under the field"), phone: t("Sheet ທີ່ມີ search + ແຖວ 44 px", "Sheet with search + 44 px rows"), why: t("Popover ໃນໂທລະສັບຖືກແປ້ນພິມບັງ.", "A popover on a phone is covered by the keyboard."), api: "<Combobox> (automatic)" },
  { what: t("Picker ໃນ popup", "Picker inside a popup"), desktop: t("Popover ລອຍຢູ່ເໜືອ dialog", "Popover floats above the dialog"), phone: t("View ທີ່ push ເຂົ້າໃນ sheet ດຽວກັນ: ‹ ກັບຄືນ, search, ລາຍການ", "Pushed view inside the SAME sheet: ‹ back, search, list"), why: t("Sheet ຊ້ອນ sheet = scrim ສອງຊັ້ນ, ປຸ່ມປິດສອງປຸ່ມ, ເສຍບໍລິບົດ. ຢ່າຊ້ອນ modal ເດັດຂາດ.", "A sheet on a sheet = two scrims, two close buttons, lost context. Never stack modals."), api: "<Combobox> in <DialogContent> (automatic)" },
  { what: t("ຕົວເລືອກສັ້ນໆໃນ popup (≤ 5)", "Short choice in a popup (≤ 5)"), desktop: t("Chips ຫຼື radio row", "Chips or radio row"), phone: t("Chips ຫຼື radio row, ບໍ່ຕ້ອງໃຊ້ picker", "Chips or radio row, no picker at all"), why: t("ເຫັນທຸກຕົວເລືອກ, ແຕະຄັ້ງດຽວ, ບໍ່ຕ້ອງນຳທາງ.", "Every option visible, one tap, zero navigation."), api: "<FilterChips> / <RadioGroup>" },
  { what: t("ຟອມ", "Forms"), desktop: t("2 ຄໍລຳ, ປຸ່ມຢູ່ມຸມຂວາລຸ່ມ", "2 columns, buttons bottom-right"), phone: t("1 ຄໍລຳ, sticky save bar ດ້ານລຸ່ມ", "1 column, sticky save bar at the bottom"), why: t("Label ຢູ່ເທິງ input; label ລາວທີ່ຍາວຕ້ອງການຄວາມກວ້າງເຕັມ.", "Labels above inputs; long Lao labels need the full width."), api: "grid md:grid-cols-2" },
  { what: t("Toolbar (4+ ການກະທຳ)", "Toolbars (4+ actions)"), desktop: t("Button group ໃນ header", "Button group in the header"), phone: t("1-2 ການກະທຳຫຼັກໃນ BottomToolbar, ທີ່ເຫຼືອໃນເມນູ ⋯", "1-2 main actions in BottomToolbar, the rest in a ⋯ menu"), why: t("ບໍ່ມີບ່ອນພໍສຳລັບ 5 ປຸ່ມທີ່ມີຊື່; ມີແຕ່ໄອຄອນກໍບໍ່ຊັດເຈນ.", "No room for 5 labelled buttons; icons alone are unclear."), api: "<BottomToolbar> + <Menu>" },
  { what: t("ລາຍລະອຽດເມື່ອ hover", "Hover details"), desktop: t("Hover card / tooltip", "Hover card / tooltip"), phone: t("ແຕະເພື່ອເປີດ · ກົດຄ້າງເພື່ອເບິ່ງການກະທຳເພີ່ມ", "Tap opens it · long-press for extra actions"), why: t("ໜ້າຈໍສຳຜັດບໍ່ມີ hover.", "There is no hover on glass."), api: "<DetailPopover> / useLongPress" },
  { what: t("Split view", "Split views"), desktop: t("ລາຍການ + ລາຍລະອຽດຢູ່ຂ້າງກັນ", "List + detail side by side"), phone: t("ລາຍການ → push ໄປໜ້າລາຍລະອຽດ (ຫຼື Drawer)", "List → push to a detail page (or Drawer)"), why: t("ສອງແຜງ ແຜງລະ 180 px ໃຊ້ບໍ່ໄດ້ທັງຄູ່.", "Two panes at 180 px each are both useless."), api: "<SplitPane> / <Drawer>" },
  { what: t("Touch target", "Touch targets"), desktop: t("36 px ໄດ້ (ເມົ້າແມ່ນຍຳ)", "36 px OK (mouse is precise)"), phone: t("ຕ່ຳສຸດ 44 px, ຫ່າງກັນ 8 px", "44 px minimum, 8 px apart"), why: t("ໃສ່ຖົງມື, ມືເປື້ອນເຫື່ອ, ນັ່ງລົດຕຸ໊ກຕຸ໊ກຜ່ານຖະໜົນຂຸຂະ.", "Gloves, sweat, bumpy tuk-tuk ride."), api: "size=\"sm\" grows to 44 px < md" },
  { what: t("ຕົວກອງ", "Filters"), desktop: t("ແຖວ select / chip ໃນແຖວດຽວກັນ", "Inline row of selects / chips"), phone: t("ແຖວ chip ເລື່ອນໄດ້, ຫຼືປຸ່ມ Filter → sheet", "Scrolling chip row, or a Filter button → sheet"), why: t("ແຖວຕົວກອງທີ່ຕັດແຖວຈະຍູ້ຂໍ້ມູນອອກນອກໜ້າຈໍ.", "Wrapped filter rows push the data off-screen."), api: "<FilterChips>" },
]

/** THE example of the rule: a wide table on desktop, cards below md. Pure CSS, no JS. */
function RulesMatrix() {
  const t = useT()
  const rules = getRules(t)
  return <>
    <div className="hidden overflow-hidden rounded-xl border md:block">
      <table className="w-full text-sm">
        <thead className="bg-muted/60 text-left"><tr>{[t("ຮູບແບບ", "Pattern"), t("ຄອມ ≥ 768", "Desktop ≥ 768"), t("ໂທລະສັບ < 768", "Phone < 768"), t("ການນຳໃຊ້", "Use")].map((h) => <th key={h} className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{h}</th>)}</tr></thead>
        <tbody>{rules.map((r) => <tr key={r.what} className="border-t align-top transition-colors hover:bg-muted/30">
          <td className="px-4 py-3 font-semibold">{r.what}<div className="mt-1 text-xs font-normal leading-5 text-muted-foreground">{r.why}</div></td>
          <td className="px-4 py-3 leading-6">{r.desktop}</td>
          <td className="px-4 py-3 leading-6">{r.phone}</td>
          <td className="px-4 py-3"><code className="font-mono text-[12px] text-primary">{r.api}</code></td>
        </tr>)}</tbody>
      </table>
    </div>
    <ul className="vks-stagger space-y-3 md:hidden">{rules.map((r, i) => <li key={r.what} style={{ "--i": i } as React.CSSProperties} className="rounded-xl border bg-card p-4">
      <div className="font-semibold">{r.what}</div>
      <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 text-sm leading-6">
        <dt className="flex items-center gap-1.5 text-muted-foreground"><Monitor className="size-3.5" />{t("ຄອມ", "Desktop")}</dt><dd>{r.desktop}</dd>
        <dt className="flex items-center gap-1.5 text-muted-foreground"><Smartphone className="size-3.5" />{t("ໂທລະສັບ", "Phone")}</dt><dd className="font-medium">{r.phone}</dd>
      </dl>
      <p className="mt-3 border-t pt-2 text-xs leading-5 text-muted-foreground">{r.why}</p>
      <code className="mt-2 inline-block rounded bg-muted px-1.5 py-0.5 font-mono text-[12px] text-primary">{r.api}</code>
    </li>)}</ul>
  </>
}

/** Hover on desktop, tap + long-press on phone — try it with a mouse, then with DevTools touch mode. */
function HoverVsPress() {
  const t = useT()
  const [sheet, setSheet] = React.useState<Guard | null>(null)
  const Row = ({ g }: { g: Guard }) => {
    const lp = useLongPress(() => setSheet(g), { onPress: () => toast(g.name) })
    return <li {...lp} className="group vks-press flex min-h-14 cursor-pointer items-center gap-3 rounded-xl border bg-card px-3 transition-colors hover:border-gold/50">
      <Avatar name={g.name} size={36} /><div className="min-w-0 flex-1"><div className="truncate font-semibold">{g.name}</div><div className="text-xs text-muted-foreground">{g.site} · {g.shift}</div></div>
      {/* desktop: actions appear on hover. phone: hidden, long-press instead */}
      <div className="hidden gap-1 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 md:flex">
        <Button size="icon" variant="ghost" aria-label={t("ໂທ", "Call")} onClick={(e) => { e.stopPropagation(); toast(t("ໂທຫາ ", "Calling ") + g.name) }}><Phone /></Button>
        <Button size="icon" variant="ghost" aria-label={t("ແກ້ໄຂ", "Edit")} onClick={(e) => { e.stopPropagation(); toast(t("ແກ້ໄຂ", "Edit")) }}><Pencil /></Button>
      </div>
    </li>
  }
  return <div className="w-full max-w-md">
    <ul className="space-y-2">{roster.slice(0, 3).map((g) => <Row key={g.id} g={g} />)}</ul>
    <p className="mt-3 text-xs leading-5 text-muted-foreground"><b>{t("ຄອມ:", "Desktop:")}</b> {t("hover ທີ່ແຖວ → ປຸ່ມໂທ / ແກ້ໄຂ ປາກົດ.", "hover a row → call / edit appear.")} <b>{t("ໂທລະສັບ:", "Phone:")}</b> {t("ແຕະ = ເປີດ, ກົດຄ້າງ 0.5 s = action sheet.", "tap = open, hold 0.5 s = action sheet.")}</p>
    <Dialog open={!!sheet} onOpenChange={(o) => !o && setSheet(null)}><DialogContent>
      <DialogHeader><DialogTitle>{sheet?.name}</DialogTitle><DialogDescription>{sheet?.site} · {sheet?.shift}</DialogDescription></DialogHeader>
      <div className="mt-3 grid gap-2">
        <Button variant="outline" size="lg" className="justify-start" onClick={() => setSheet(null)}><Phone />{t("ໂທຫາ", "Call")}</Button>
        <Button variant="outline" size="lg" className="justify-start" onClick={() => setSheet(null)}><Pencil />{t("ແກ້ໄຂ", "Edit")}</Button>
        <Button variant="outline" size="lg" className="justify-start text-destructive" onClick={() => setSheet(null)}><Trash2 />{t("ລຶບ", "Delete")}</Button>
      </div>
    </DialogContent></Dialog>
  </div>
}

function TouchTargets() {
  const t = useT()
  return <div className="grid w-full max-w-lg gap-6 sm:grid-cols-2">
    <div><div className="mb-2 flex items-center gap-2 text-sm font-semibold"><X className="size-4 text-destructive" />{t("ນ້ອຍເກີນໄປ (28 px)", "Too small (28 px)")}</div>
      <div className="flex gap-1">{[Phone, Pencil, Trash2].map((I, i) => <span key={i} className="flex size-7 items-center justify-center rounded-md border [&_svg]:size-3.5"><I /></span>)}</div>
      <p className="mt-2 text-xs leading-5 text-muted-foreground">{t("ໃຊ້ກັບເມົ້າໄດ້. ແຕ່ໃນໂທລະສັບຈະແຕະຜິດປຸ່ມ.", "Fine for a mouse. On a phone you hit the wrong one.")}</p></div>
    <div><div className="mb-2 flex items-center gap-2 text-sm font-semibold"><Check className="size-4 text-success" />{t("44 px, ຫ່າງກັນ 8 px", "44 px, 8 px gap")}</div>
      <div className="flex gap-2">{[Phone, Pencil, Trash2].map((I, i) => <span key={i} className="relative flex size-11 items-center justify-center rounded-xl border [&_svg]:size-5"><I /><i aria-hidden className="absolute inset-0 rounded-xl ring-2 ring-dashed ring-gold/40" /></span>)}</div>
      <p className="mt-2 text-xs leading-5 text-muted-foreground">{t("ທຸກ Button, MenuItem ແລະ ແຖວ nav ໃນ @vks/ui ເຮັດແບບນີ້ຢູ່ແລ້ວເມື່ອຕ່ຳກວ່າ md.", "Every Button, MenuItem and nav row in @vks/ui already does this below md.")}</p></div>
  </div>
}

function Stage({ children }: { children: React.ReactNode }) { return <div className="vks-stage flex flex-wrap items-center justify-center rounded-2xl border p-4 sm:p-8">{children}</div> }
function Do({ ok, children }: { ok?: boolean; children: React.ReactNode }) {
  const t = useT()
  return <div className={cn("rounded-xl border p-4 text-sm leading-6", ok ? "border-success/40 bg-success/5" : "border-destructive/40 bg-destructive/5")}>
    <div className={cn("mb-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide", ok ? "text-success" : "text-destructive")}>{ok ? <Check className="size-3.5" /> : <X className="size-3.5" />}{ok ? t("ຄວນ", "Do") : t("ບໍ່ຄວນ", "Don't")}</div>{children}
  </div>
}

/* ================================================================ the page */
export function Responsive() {
  const t = useT()
  return <div className="space-y-4">
    <p className="text-lg leading-8 text-muted-foreground">{t("ມີ breakpoint ດຽວ:", "One breakpoint:")} <Code>768 px</Code> (<Code>md:</Code>). {t("ຕ່ຳກວ່ານີ້ແມ່ນໂທລະສັບ, ສູງກວ່ານີ້ແມ່ນຄອມພິວເຕີ. ທຸກໜ້າຈໍອອກແບບ", "Below it is a phone, above it is a desktop. Every screen is designed")} <b className="text-foreground">{t("ໂທລະສັບກ່ອນ", "phone first")}</b>{t(" ແລ້ວຈຶ່ງຂະຫຍາຍ. ທຸກ frame ໃນໜ້ານີ້ແມ່ນ iframe ຕົວຈິງຕາມຄວາມກວ້າງນັ້ນ, ສິ່ງທີ່ເຫັນຄືສິ່ງທີ່ຈະໃຊ້ງານຈິງ.", ", then widened. Every frame on this page is a real iframe at that width, so what you see is what ships.")}</p>

    <H2 id="breakpoint">{t("Breakpoint", "The breakpoint")}</H2>
    <FeatureGrid cols={3}>
      {[{ i: <Smartphone />, t: "< 768 px", d: t("ໂທລະສັບ. ຄໍລຳດຽວ, bottom nav, sheet, card, target 44 px.", "Phone. One column, bottom nav, sheets, cards, 44 px targets.") }, { i: <Monitor />, t: "768 – 1279 px", d: t("ແທັບເລັດ / ແລັບທັອບນ້ອຍ. ມີ sidebar, ມີຕາຕະລາງ, dialog ຢູ່ກາງຈໍ.", "Tablet / small laptop. Sidebar appears, tables appear, dialogs centre.") }, { i: <Monitor />, t: "≥ 1280 px", d: t("ຄອມຈໍກວ້າງ. ມີ rail ເພີ່ມ (ເຊັ່ນ ໃນໜ້ານີ້), ຄວາມກວ້າງເນື້ອຫາສູງສຸດ ~1440 px.", "Wide desktop. Extra rail (e.g. On this page), max content width ~1440 px.") }].map((x) =>
        <FeatureCard key={x.t} icon={x.i} title={x.t} compact>{x.d}</FeatureCard>)}
    </FeatureGrid>
    <CodeBlock code={`// CSS first: most rules are just Tailwind classes
<div className="grid gap-4 md:grid-cols-2">…</div>

// JS only when the STRUCTURE changes (different component)
import { useIsMobile } from "@vks/ui"
const mobile = useIsMobile()        // true at <= 768 px
return mobile ? <Fab … /> : <Button>…</Button>`} />

    <H2 id="rules">{t("ກົດ", "The rules")}</H2>
    <P>{t("ລາຍການນີ້ເປັນຕົວຢ່າງຢູ່ໃນຕົວມັນເອງ: ຕາຕະລາງໃນຄອມ, card ໃນໂທລະສັບ. ປັບຂະໜາດໜ້າຕ່າງເພື່ອເບິ່ງການສະຫຼັບ.", "This list is itself an example: a table on desktop, cards on your phone. Resize the window to see it switch.")}</P>
    <RulesMatrix />

    <H2 id="table-cards">{t("ຕາຕະລາງ → card", "Table → cards")}</H2>
    <P><Code>DataTable</Code> {t("ເຮັດໃຫ້ອັດຕະໂນມັດ. ເມື່ອໃຊ້", "does it for you. With")} <Code>mode="auto"</Code> {t("(ຄ່າເລີ່ມຕົ້ນ) ມັນຈະກາຍເປັນ card ໃນໂທລະສັບ ເມື່ອມີຫຼາຍກວ່າ 4 ຄໍລຳ. ຄໍລຳທີ່ໝາຍ", "(default) it becomes cards on a phone when it has more than 4 columns. Columns marked")} <Code>primary</Code> {t("ຈະເປັນຫົວຂໍ້ຂອງ card; ຄໍລຳທີ່ເຫຼືອຈະເປັນແຖວ label/value. ບັງຄັບຮູບແບບດ້ວຍ", "become the card title; the rest become label/value lines. Force one layout with")} <Code>mode="table"</Code> {t("ຫຼື", "or")} <Code>mode="cards"</Code>.</P>
    <DualFrame frame="resp-table" caption={t("Component ດຽວກັນ, ຂໍ້ມູນດຽວກັນ. ຄອມ: ປຸ່ມ action ໃນ header, search + filter ແຖວດຽວ, ຕາຕະລາງ 6 ຄໍລຳ. ໂທລະສັບ: search ຊ້ອນລົງ, chip filter, ໜຶ່ງ card ຕໍ່ guard, Fab ສຳລັບ action ຫຼັກ.", "Same component, same data. Desktop: header action button, inline search + filter, 6-column table. Phone: stacked search, chip filters, one card per guard, Fab for the main action.")} />
    <CodeBlock code={`const cols: Column<Guard>[] = [
  { key: "n", header: "ພະນັກງານ", primary: true, cell: (r) => r.name },
  { key: "s", header: "ຈຸດ", cell: (r) => r.site },
  { key: "st", header: "ສະຖານະ", cell: (r) => <Badge variant="success">…</Badge> },
  // …6 columns → cards on a phone
]
<DataTable columns={cols} rows={rows} rowKey={(r) => r.id} />              // auto
<DataTable mode="table" … />   // always a table (≤ 4 short columns)
<DataTable mode="cards" … />   // always cards (e.g. a narrow side panel)`} />
    <div className="grid gap-3 md:grid-cols-2">
      <Do ok>{t("ໝາຍ 1-2 ຄໍລຳທີ່ຄົນໃຊ້ຈຳແນກແຖວວ່າ", "Mark the 1-2 columns people recognise a row by as")} <Code>primary</Code>{t(". ໃສ່ status ໄວ້ທ້າຍສຸດເພື່ອໃຫ້ອ່ານຄືກັບ badge.", ". Put status last so it reads like a badge.")}</Do>
      <Do>{t("ໃຫ້ໂທລະສັບເລື່ອນຕາຕະລາງໄປຂ້າງ. ບໍ່ມີໃຜຫາຄໍລຳທີ 5 ເຈີ.", "Make a phone scroll a table sideways. Nobody finds the 5th column.")}</Do>
    </div>

    <H2 id="navigation">{t("ການນຳທາງ", "Navigation")}</H2>
    <P>{t("Sidebar ໃນຄອມ, bottom nav ໃນໂທລະສັບ.", "Sidebar on desktop, bottom nav on a phone.")} <Code>AppShell</Code> {t("ສະຫຼັບໃຫ້ອັດຕະໂນມັດ: 4 ລາຍການທຳອິດຢູ່ແຖບລຸ່ມ, ທີ່ເຫຼືອເຂົ້າໄປໃນ \"ເພີ່ມເຕີມ\".", "switches for you: first 4 items go to the bottom bar, the rest into \"ເພີ່ມເຕີມ\".")}</P>
    <DualFrame frame="app-shell" h={600} caption={t("ຄອມ: sidebar ມີທຸກສ່ວນ, ຫຍໍ້ເປັນ rail ໄດ້. ໂທລະສັບ: 4 tab + ເພີ່ມເຕີມ ຢູ່ດ້ານລຸ່ມ, ຫົວຂໍ້ໃຫຍ່, Fab ຢູ່ເໜືອແຖບ.", "Desktop: sidebar with every section, collapses to a rail. Phone: 4 tabs + ເພີ່ມເຕີມ at the bottom, large title, Fab above the bar.")} />

    <H2 id="forms">{t("ຟອມ", "Forms")}</H2>
    <P>{t("ສອງຄໍລຳຕັ້ງແຕ່", "Two columns from")} <Code>md</Code>{t(" ຂຶ້ນໄປ, ຕ່ຳກວ່ານັ້ນເປັນຄໍລຳດຽວ. ໃນໂທລະສັບ ປຸ່ມບັນທຶກຈະອອກຈາກໜ້າ ແລະ ຕິດຢູ່ດ້ານລຸ່ມ ເໜືອແປ້ນພິມ ບ່ອນທີ່ໂປ້ມືເອື້ອມເຖິງ. Picker ປ່ຽນເປັນ sheet ອັດຕະໂນມັດ.", ", one column below. On a phone the save button leaves the page and sticks to the bottom, above the keyboard, where the thumb is. Pickers turn into sheets automatically.")}</P>
    <DualFrame frame="resp-form" h={620} caption={t("ຄອມ: ສອງຄໍລຳ, ໝາຍເຫດ ແລະ ຈຸດປະຈຳການ ກວມທັງສອງຄໍລຳ, ປຸ່ມຢູ່ມຸມຂວາລຸ່ມ. ໂທລະສັບ: ຄໍລຳດຽວ, picker ເປີດເປັນ sheet, save bar ຕິດດ້ານລຸ່ມພ້ອມ safe-area padding.", "Desktop: two columns, notes and sites span both, buttons bottom-right. Phone: one column, pickers open as sheets, save bar sticks to the bottom with safe-area padding.")} />
    <CodeBlock code={`<CardContent className="grid gap-4 md:grid-cols-2">
  <Field /> <Field />
  <Field className="md:col-span-2" />     {/* long fields span both */}
</CardContent>
<div className="hidden justify-end gap-2 md:flex">…buttons…</div>   {/* desktop */}
<div className="fixed inset-x-0 bottom-0 flex gap-2 md:hidden">…</div> {/* phone */}`} />

    <H2 id="overlays">{t("Dialog ແລະ picker", "Dialogs & pickers")}</H2>
    <P><Code>Dialog</Code> {t("ເປັນກ່ອງກາງຈໍຕັ້ງແຕ່", "is a centred box from")} <Code>md</Code> {t("ຂຶ້ນໄປ ແລະ ເປັນ bottom sheet ເມື່ອຕ່ຳກວ່ານັ້ນ. Markup ດຽວກັນ; ປຸ່ມທ້າຍຈະເຕັມຄວາມກວ້າງ ແລະ ຊ້ອນກັນ ໂດຍປຸ່ມຫຼັກຢູ່ໃກ້ໂປ້ມືທີ່ສຸດ.", "and a bottom sheet below. Same markup; footer buttons go full width and stack with the main action nearest the thumb.")}</P>
    <DualFrame frame="resp-overlay" h={600} caption={t("ແຕະ ລາຍງານເຫດການ ເພື່ອເປີດ. Markup <Dialog> ດຽວກັນ. ຄອມ: card ກາງຈໍ, ປຸ່ມຢູ່ແຖວດຽວກັນ; post picker ເປັນ popover ເໜືອມັນ. ໂທລະສັບ: bottom sheet ມີ grab handle, ປຸ່ມເຕັມຄວາມກວ້າງ. ແຕະ ຈຸດປະຈຳການ: ລາຍການເລື່ອນເຂົ້າມາ ພາຍໃນ sheet ດຽວກັນ ພ້ອມລູກສອນ ‹ ກັບຄືນ; ເລືອກແລ້ວກໍກັບມາທີ່ຟອມ.", "Tap ລາຍງານເຫດການ to open it. Same <Dialog> markup. Desktop: centred card, buttons in a row; the post picker is a popover above it. Phone: bottom sheet with a grab handle, buttons full width. Tap ຈຸດປະຈຳການ: the list slides in INSIDE the same sheet with a ‹ back arrow; pick one and you are back on the form.")} />

    <H3 id="picker-in-popup">{t("Dropdown ໃນ popup", "A dropdown inside a popup")}</H3>
    <P>{t("ໃນໂທລະສັບ dialog ເປັນ sheet ຢູ່ແລ້ວ, ດັ່ງນັ້ນ dropdown ຈຶ່ງເປີດ sheet ອີກອັນຊ້ອນທັບບໍ່ໄດ້. Material, Apple HIG ແລະ NN/g ລ້ວນບອກຄືກັນວ່າ:", "On a phone the dialog is already a sheet, so a dropdown can't open another sheet on top of it. Material, Apple HIG and NN/g all say the same thing:")} <b className="text-foreground">{t("ຢ່າຊ້ອນ modal", "never stack modals")}</b>. {t("ແຕ່ picker ຈະ", "Instead the picker")} <b className="text-foreground">{t("push view ເຂົ້າໃນ sheet ດຽວກັນ", "pushes a view inside the same sheet")}</b>{t(", ຄືກັບ iOS Settings: ມີລູກສອນກັບຄືນ ແລະ ຫົວຂໍ້ຢູ່ເທິງ, search, ແລ້ວຕາມດ້ວຍລາຍການ. ລູກສອນກັບຄືນ, Esc, ຫຼືການເລືອກ (single select) ຈະພາກັບມາທີ່ຟອມພ້ອມຄ່າທີ່ໃສ່ແລ້ວ.", ", like iOS Settings: a back arrow and title at the top, search, then the list. Back arrow, Esc, or picking (single select) brings the form back with the value filled in.")} <Code>Combobox</Code>, <Code>DatePicker</Code> {t("ແລະ", "and")} <Code>DateRangePicker</Code> {t("ເຮັດໃຫ້ອັດຕະໂນມັດ; ໃຊ້", "do this for you; use")} <Code>InSheetView</Code> {t("ສຳລັບຂັ້ນຕອນທີສອງຂອງທ່ານເອງ.", "for your own second step.")}</P>
    <div className="grid gap-3 md:grid-cols-3">
      <Do ok><b>{t("≤ 5 ຕົວເລືອກ:", "≤ 5 options:")}</b> {t("ບໍ່ຕ້ອງໃຊ້ picker ເລີຍ. ສະແດງ", "don't use a picker at all. Show")} <Code>FilterChips</Code> {t("ຫຼື", "or a")} <Code>RadioGroup</Code> {t("ແບບ inline. ແຕະຄັ້ງດຽວ ແລະ ບໍ່ມີຫຍັງຖືກຊ່ອນ.", "inline. It's one tap and nothing is hidden.")}</Do>
      <Do ok><b>{t("ລາຍການຍາວ ຫຼື ຄົ້ນຫາໄດ້:", "Long or searchable list:")}</b> <Code>Combobox</Code>. {t("ໃນຄອມເປັນ popover ເໜືອ dialog; ໃນໂທລະສັບເປັນ view ທີ່ push ເຂົ້າໃນ sheet ດຽວກັນ.", "On desktop it's a popover over the dialog; on a phone it's a pushed view in the same sheet.")}</Do>
      <Do>{t("ເປີດ", "Open a")} <Code>Sheet</Code> {t("ຈາກພາຍໃນ", "from inside a")} <Code>Dialog</Code> {t("ໃນໂທລະສັບ. ຈະໄດ້ scrim ສອງຊັ້ນ ແລະ ປຸ່ມ ✕ ສອງປຸ່ມ, ແລ້ວ \"ປິດ\" ກໍກາຍເປັນຄຸມເຄືອ.", "on a phone. You get two scrims and two ✕ buttons, and \"close\" becomes ambiguous.")}</Do>
    </div>
    <CodeBlock code={`<DialogContent>
  <FilterChips options={kinds} value={kind} onChange={setKind} />   {/* ≤ 5: inline */}
  <Combobox options={posts} value={post} onChange={setPost} />      {/* long: pushes inside */}
</DialogContent>

// your own second step inside a dialog / sheet
const [pick, setPick] = React.useState(false)
<InSheetView open={pick} onBack={() => setPick(false)} title="ເລືອກພະນັກງານ">
  <GuardList onPick={(g) => { setGuard(g); setPick(false) }} />
</InSheetView>`} />

    <H2 id="toolbars">{t("Toolbar ແລະ action", "Toolbars & actions")}</H2>
    <P>{t("ຄອມສະແດງປຸ່ມທີ່ມີຊື່ໄດ້ 5 ປຸ່ມ. ໂທລະສັບສະແດງ 1-2 action ທີ່ຄົນໃຊ້ຫຼາຍທີ່ສຸດໃນ", "Desktop can show 5 labelled buttons. A phone shows the 1-2 actions people do most in a")} <Code>BottomToolbar</Code>{t(" ແລະ ຊ່ອນທີ່ເຫຼືອໄວ້ຫຼັງ", ", and hides the rest behind a")} <Code>⋯</Code> <Code>Menu</Code>.</P>
    <DualFrame frame="resp-toolbar" h={520} caption={t("ຄອມ: button group + filter + approve ໃນ header. ໂທລະສັບ: ພິມ / ສົ່ງອອກ / ແບ່ງປັນ ຢູ່ຫຼັງ ⋯, filter / approve / reject ໃນ BottomToolbar.", "Desktop: button group + filter + approve in the header. Phone: print / export / share behind ⋯, filter / approve / reject in a BottomToolbar.")} />

    <H2 id="hover">{t("Hover → tap ແລະ long-press", "Hover → tap & long-press")}</H2>
    <P>{t("ຢ່າຊ່ອນສິ່ງສຳຄັນໄວ້ຫຼັງ hover. Hover ສາມາດ", "Never hide something important behind hover. Hover can")} <i>{t("ສະແດງ shortcut", "reveal shortcuts")}</i>{t("; ແຕ່ action ດຽວກັນນັ້ນຕ້ອງເຂົ້າເຖິງໄດ້ດ້ວຍການແຕະ ຫຼື long-press.", "; the same actions must be reachable by tap or long-press.")}</P>
    <Stage><HoverVsPress /></Stage>
    <CodeBlock code={`const press = useLongPress(() => openActions(g), { onPress: () => open(g) })
<li {...press} className="group">
  …
  <div className="hidden opacity-0 group-hover:opacity-100 md:flex">…quick actions…</div>
</li>`} />

    <H3 id="touch">{t("Touch target", "Touch targets")}</H3>
    <Stage><TouchTargets /></Stage>

    <H2 id="checklist">{t("Checklist ກ່ອນສົ່ງມອບ", "Checklist before you ship")}</H2>
    <ul className="grid gap-2 md:grid-cols-2">{[
      t("ເປີດທີ່ 360 px: ບໍ່ມີການເລື່ອນຂ້າງຢູ່ບ່ອນໃດເລີຍ.", "Open it at 360 px: no sideways scroll anywhere."),
      t("ຕາຕະລາງທີ່ມີ 5+ ຄໍລຳ ເປັນ card ໃນໂທລະສັບ.", "Tables with 5+ columns are cards on the phone."),
      t("Action ຫຼັກເອື້ອມເຖິງໄດ້ດ້ວຍໂປ້ມືຂວາ.", "Main action reachable with the right thumb."),
      t("ທຸກສິ່ງທີ່ແຕະໄດ້ ≥ 44 px, ຫ່າງກັນ 8 px.", "Every tappable thing ≥ 44 px, 8 px apart."),
      t("Dialog ເປັນ sheet; picker ເປັນ sheet; picker ໃນ dialog ໃຫ້ push ເຂົ້າໃນມັນ (ຢ່າເປັນ sheet ຊ້ອນ sheet).", "Dialogs are sheets; pickers are sheets; a picker inside a dialog pushes inside it (never a sheet on a sheet)."),
      t("ບໍ່ມີສິ່ງສຳຄັນຢູ່ໃນ hover ຢ່າງດຽວ.", "Nothing important only on hover."),
      t("ຊື່ລາວທີ່ຍາວຖືກຕັດ ຫຼື ຕັດແຖວ, ບໍ່ລົ້ນອອກນອກ.", "Long Lao names truncate or wrap, never overflow."),
      t("ໃສ່ safe-area padding ໃຫ້ແຖບລຸ່ມທີ່ຕິດຕາຍ.", "Safe-area padding on fixed bottom bars."),
      t("ທົດລອງໃນໂໝດ Lite (Settings ⚙ → Low-end).", "Try it on Lite (Settings ⚙ → Low-end)."),
      t("ກວດທັງສອງ theme: A (ກາງເວັນ) ແລະ E (ກາງຄືນ).", "Check both themes: A (day) and E (night)."),
    ].map((x, i) => <li key={i} className="flex items-start gap-3 rounded-xl border bg-card p-3 text-sm leading-6"><span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-gold/15 text-xs font-bold tabular-nums ring-1 ring-gold/40">{i + 1}</span>{x}</li>)}</ul>
  </div>
}