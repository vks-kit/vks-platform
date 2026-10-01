import * as React from "react"
import { Bell, Camera, Copy, Moon, Pencil, Share2, Trash2, Shield, MapPin, Wifi, LogOut, Lock, FileText, Phone, Clock, ScanLine, CalendarDays } from "@vks/ui/icons"
import {
  IOSAlert, ActionSheet, Banner, ListGroup, ListRow, Switch, Button, SkeletonText, SkeletonList, SkeletonCard, SkeletonTable, SkeletonAvatar,
  NumberTicker, PasswordInput, FloatingInput, Chip, Kbd, CopyButton, Separator, Popover, PopoverTrigger, PopoverContent,
  Menu, MenuTrigger, MenuContent, MenuItem, MenuSeparator, MenuLabel, PerfToggle, usePerf, StepProgress, toast,
  DetailPopover, Avatar, Progress, type DetailField,
} from "@vks/ui"
import type { Doc } from "./types"

function AlertDemo() {
  const [o, setO] = React.useState<null | "two" | "three" | "ok" | "warn">(null)
  return <>
    <Button variant="outline" onClick={() => setO("two")}>2 buttons (danger)</Button>
    <Button variant="outline" onClick={() => setO("three")}>3 buttons</Button>
    <Button variant="outline" onClick={() => setO("ok")}>tone="success"</Button>
    <Button variant="outline" onClick={() => setO("warn")}>tone="warning"</Button>
    <IOSAlert open={o === "ok"} onOpenChange={(v) => !v && setO(null)} tone="success" title="ສົ່ງລາຍງານແລ້ວ" message="ຫົວໜ້າກະຈະໄດ້ຮັບແຈ້ງເຕືອນທັນທີ." actions={[{ label: "ຕົກລົງ" }]} />
    <IOSAlert open={o === "warn"} onOpenChange={(v) => !v && setO(null)} tone="warning" title="ສັນຍານ GPS ອ່ອນ" message="ຕຳແໜ່ງອາດຄາດເຄື່ອນ 50 ແມັດ. ສົ່ງຕໍ່ບໍ?"
      actions={[{ label: "ລອງໃໝ່", style: "cancel" }, { label: "ສົ່ງຕໍ່" }]} />
    <IOSAlert open={o === "two"} onOpenChange={(v) => !v && setO(null)} title="ລຶບຮູບນີ້?" message="ຮູບຈະຖືກລຶບອອກຈາກລາຍງານ. ຍົກເລີກບໍ່ໄດ້."
      actions={[{ label: "ຍົກເລີກ", style: "cancel" }, { label: "ລຶບ", style: "destructive", onPress: () => { toast.success("ລຶບແລ້ວ") } }]} />
    <IOSAlert open={o === "three"} onOpenChange={(v) => !v && setO(null)} icon={<MapPin />} title="ອະນຸຍາດໃຫ້ໃຊ້ GPS?" message="ໃຊ້ເພື່ອຢືນຢັນວ່າທ່ານຢູ່ຈຸດກວດ."
      actions={[{ label: "ອະນຸຍາດຕະຫຼອດ" }, { label: "ສະເພາະຕອນໃຊ້ແອັບ" }, { label: "ບໍ່ອະນຸຍາດ", style: "cancel" }]} />
  </>
}
function SheetDemo() {
  const [o, setO] = React.useState(false)
  return <><Button variant="outline" onClick={() => setO(true)}>Photo actions</Button>
    <ActionSheet open={o} onOpenChange={setO} title="ຮູບ IMG_0142" message="ຖ່າຍເມື່ອ 08:14 · ປະຕູໜ້າ" actions={[
      { label: "ແບ່ງປັນ", icon: <Share2 />, onPress: () => toast("Share") }, { label: "ແກ້ໄຂ", icon: <Pencil />, onPress: () => toast("Edit") },
      { label: "ລຶບຮູບ", icon: <Trash2 />, destructive: true, onPress: () => toast.error("ລຶບແລ້ວ") }]} /></>
}
function BannerDemo() {
  const [o, setO] = React.useState(false), [tone, setTone] = React.useState<"info" | "success" | "warning" | "danger">("info")
  const show = (t: typeof tone) => { setTone(t); setO(false); requestAnimationFrame(() => setO(true)) }
  return <>
    <Button variant="outline" onClick={() => show("info")}>Info</Button><Button variant="outline" onClick={() => show("warning")}>Warning</Button><Button variant="destructive" onClick={() => show("danger")}>Danger</Button>
    <Banner open={o} onOpenChange={setO} tone={tone} app="VKS PATROL" title={tone === "danger" ? "ພາດຈຸດກວດ · ຄັງສິນຄ້າ" : tone === "warning" ? "ຊ້າ 6 ນາທີ" : "ມີວຽກໃໝ່"} message="ແຕະເພື່ອເປີດ · ປັດຂຶ້ນເພື່ອປິດ" onPress={() => toast("Opened")} />
  </>
}
function ListDemo() {
  const [gps, setGps] = React.useState(true), [dark, setDark] = React.useState(false)
  return <div className="w-full space-y-6 bg-muted/50 p-4 sm:max-w-sm sm:rounded-2xl sm:p-3 max-sm:min-h-dvh">
    <ListGroup header="ບັນຊີ">
      <ListRow icon={<Shield />} label="ສົມຊາຍ ວົງໄຊ" sub="G001 · ຍາມກະເຊົ້າ" onPress={() => toast("Profile")} />
      <ListRow icon={<Lock />} iconClass="bg-warning text-warning-foreground" label="ປ່ຽນລະຫັດ" onPress={() => {}} />
    </ListGroup>
    <ListGroup header="ອຸປະກອນ" footer="GPS ຕ້ອງເປີດເພື່ອສະແກນຈຸດກວດ.">
      <ListRow icon={<MapPin />} iconClass="bg-success text-success-foreground" label="GPS" trailing={<Switch checked={gps} onCheckedChange={setGps} />} />
      <ListRow icon={<Moon />} iconClass="bg-bar text-bar-foreground" label="ໂໝດມືດ" trailing={<Switch checked={dark} onCheckedChange={setDark} />} />
      <ListRow icon={<Wifi />} label="ຂໍ້ມູນລໍຖ້າສົ່ງ" detail="3" onPress={() => {}} />
    </ListGroup>
    <ListGroup><ListRow icon={<LogOut />} iconClass="bg-destructive text-destructive-foreground" label="ອອກຈາກລະບົບ" destructive onPress={() => toast("Bye")} /></ListGroup>
  </div>
}
function SkelDemo() {
  const [on, setOn] = React.useState(true)
  return <div className="grid w-full gap-4 md:grid-cols-2">
    <div className="md:col-span-2"><Button size="sm" variant="outline" onClick={() => setOn(!on)}>{on ? "Show data" : "Show skeleton"}</Button></div>
    {on ? <><SkeletonList rows={3} /><SkeletonCard /><div className="flex items-center gap-3"><SkeletonAvatar size={56} /><SkeletonText className="flex-1" /></div><SkeletonTable rows={3} cols={3} /></>
      : <p className="vks-fade-up text-muted-foreground md:col-span-2">ຂໍ້ມູນມາແລ້ວ — ຮູບຮ່າງຄືກັນກັບ skeleton, ໜ້າຈໍບໍ່ກະໂດດ.</p>}
  </div>
}
function TickerDemo() {
  const [v, setV] = React.useState(12500000), [n, setN] = React.useState(87)
  return <div className="flex flex-wrap items-end gap-8">
    <div><div className="text-sm text-muted-foreground">ລາຍຮັບເດືອນນີ້</div><NumberTicker value={v} format={(x) => Math.round(x).toLocaleString() + " ກີບ"} className="text-3xl font-bold" /></div>
    <div><div className="text-sm text-muted-foreground">ກວດຄົບ</div><NumberTicker value={n} format={(x) => Math.round(x) + "%"} className="text-3xl font-bold text-success" /></div>
    <Button variant="outline" onClick={() => { setV(Math.round(5e6 + Math.random() * 3e7)); setN(Math.round(40 + Math.random() * 60)) }}>Randomise</Button>
  </div>
}
function FieldsDemo() {
  return <div className="grid w-full max-w-sm gap-3"><FloatingInput label="ລະຫັດພະນັກງານ" /><FloatingInput label="ເບີໂທ" type="tel" defaultValue="020 5555 1234" /><PasswordInput placeholder="ລະຫັດຜ່ານ" /></div>
}
function ChipDemo() {
  const all = ["ກະເຊົ້າ", "ກະບ່າຍ", "ກະດຶກ", "ວັນພັກ"]
  const [sel, setSel] = React.useState(["ກະເຊົ້າ"]), [tags, setTags] = React.useState(["ປະຕູໜ້າ", "ຄັງສິນຄ້າ", "ບ່ອນຈອດລົດ"])
  return <div className="space-y-3">
    <div className="flex flex-wrap gap-2">{all.map((c) => <Chip key={c} selected={sel.includes(c)} onClick={() => setSel(sel.includes(c) ? sel.filter((x) => x !== c) : [...sel, c])}>{c}</Chip>)}</div>
    <div className="flex flex-wrap gap-2">{tags.map((c) => <Chip key={c} icon={<MapPin />} onRemove={() => setTags(tags.filter((x) => x !== c))}>{c}</Chip>)}</div>
  </div>
}
function MiscDemo() {
  return <div className="flex flex-wrap items-center gap-4">
    <span className="text-sm">Search <Kbd>Ctrl</Kbd> <Kbd>K</Kbd></span><Separator orientation="vertical" className="h-6" />
    <span className="flex items-center gap-1 rounded-lg border pl-3 font-mono text-sm">G-2026-0142<CopyButton value="G-2026-0142" /></span>
  </div>
}
function MenuDemo() {
  return <>
    <Menu><MenuTrigger asChild><Button variant="outline">Menu</Button></MenuTrigger>
      <MenuContent><MenuLabel>ລາຍງານ #142</MenuLabel><MenuItem icon={<FileText />} onSelect={() => toast("Open")}>ເປີດ</MenuItem><MenuItem icon={<Copy />} onSelect={() => toast("Copied")}>ສຳເນົາ</MenuItem><MenuItem icon={<Share2 />}>ແບ່ງປັນ</MenuItem><MenuSeparator /><MenuItem icon={<Trash2 />} destructive onSelect={() => toast.error("ລຶບ")}>ລຶບ</MenuItem></MenuContent></Menu>
    <Popover><PopoverTrigger asChild><Button variant="outline"><Bell />Popover</Button></PopoverTrigger>
      <PopoverContent><div className="font-bold">ແຈ້ງເຕືອນ</div><p className="mt-1 text-sm text-muted-foreground">ບໍ່ມີແຈ້ງເຕືອນໃໝ່.</p></PopoverContent></Popover>
  </>
}
function PerfDemo() {
  const { mode, tier } = usePerf()
  return <div className="space-y-3"><PerfToggle /><p className="text-sm text-muted-foreground">mode = <b>{mode}</b> · tier = <b>{tier}</b> · &lt;html data-perf="{tier}"&gt;</p>
    <div className="vks-glass vks-glow-ring rounded-2xl border p-4 text-sm">Glass + glow card: blurred on high-end, solid & flat on low-end.</div></div>
}
function StepProgDemo() { const [s, setS] = React.useState(1); return <div className="w-full max-w-sm space-y-3"><StepProgress step={s} total={4} label="ລາຍງານເຫດການ" /><div className="flex gap-2"><Button size="sm" variant="outline" onClick={() => setS(Math.max(0, s - 1))}>−</Button><Button size="sm" onClick={() => setS(Math.min(3, s + 1))}>+</Button></div></div> }

const GUARDS = [
  { name: "ສົມຊາຍ ວົງສະຫວັນ", id: "G014", site: "ປະຕູໜ້າ A-01", shift: "06:00-18:00", done: 9, of: 12, tone: "success" as const, st: "ເຂົ້າກະແລ້ວ", tel: "020 5555 1414" },
  { name: "ນາງບົວ ພົມມະຈັນ", id: "G027", site: "ຄັງສິນຄ້າ B-01", shift: "18:00-06:00", done: 3, of: 12, tone: "warning" as const, st: "ຊ້າ 12 ນາທີ", tel: "020 5555 2727" },
  { name: "ທ້າວດາວ ສີສຸວັນ", id: "G031", site: "ບ່ອນຈອດລົດ A-02", shift: "ພັກ", done: 0, of: 0, tone: "neutral" as const, st: "ມື້ພັກ", tel: "020 5555 3131" },
]
function guardDetail(g: (typeof GUARDS)[number]) {
  const fields: DetailField[] = [
    { label: "ລະຫັດ", value: g.id }, { label: "ກະ", value: g.shift, icon: <Clock /> },
    { label: "ຈຸດປະຈຳ", value: g.site, icon: <MapPin />, wide: true }, { label: "ໂທ", value: g.tel, icon: <Phone />, wide: true },
  ]
  return {
    title: g.name, subtitle: "ພະນັກງານຮັກສາຄວາມປອດໄພ", media: <Avatar name={g.name} size={44} status={g.tone === "success" ? "online" : g.tone === "warning" ? "busy" : "offline"} />,
    status: { label: g.st, tone: g.tone, live: g.tone === "success" }, fields,
    body: g.of ? <Progress value={g.done} max={g.of} label={`ສະແກນ ${g.done}/${g.of} ຈຸດ`} /> : undefined,
    actions: <><Button size="sm" variant="outline" onClick={() => toast("ໂທ " + g.tel)}><Phone />ໂທ</Button><Button size="sm" onClick={() => toast("ເປີດ " + g.id)}>ເບິ່ງລາຍລະອຽດ</Button></>,
  }
}
function DetailDemo() {
  return <div className="w-full max-w-md divide-y overflow-hidden rounded-xl border bg-card">
    {GUARDS.map((g) => <div key={g.id} className="flex items-center gap-3 px-4 py-2.5">
      <DetailPopover {...guardDetail(g)} side="right" align="start">
        <button className="vks-press flex min-h-11 min-w-0 flex-1 items-center gap-3 rounded-lg text-left outline-none focus-visible:ring-2 focus-visible:ring-ring"><Avatar name={g.name} size={36} /><span className="min-w-0"><b className="block truncate underline decoration-border decoration-dotted underline-offset-4">{g.name}</b><span className="text-xs text-muted-foreground">{g.site}</span></span></button>
      </DetailPopover>
      <span className="shrink-0 text-xs text-muted-foreground">{g.id}</span>
    </div>)}
  </div>
}
function DetailClickDemo() {
  const pins = [{ t: "ປະຕູໜ້າ", c: "success" as const, x: "18%", y: "30%", last: "08:12", by: "ສົມຊາຍ" }, { t: "ຄັງສິນຄ້າ", c: "danger" as const, x: "62%", y: "58%", last: "ພາດ 2 ຮອບ", by: "ນາງບົວ" }, { t: "ບ່ອນຈອດລົດ", c: "warning" as const, x: "78%", y: "22%", last: "07:40", by: "ທ້າວດາວ" }]
  const dot = { success: "bg-success", danger: "bg-destructive", warning: "bg-warning" }
  return <div className="relative h-56 w-full max-w-md overflow-hidden rounded-xl border bg-muted">
    <div aria-hidden className="absolute inset-0 opacity-40 [background-image:linear-gradient(var(--border)_1px,transparent_1px),linear-gradient(90deg,var(--border)_1px,transparent_1px)] [background-size:28px_28px]" />
    {pins.map((p) => <DetailPopover key={p.t} openOn="click" side="top" title={p.t} subtitle="ຈຸດກວດ QR" media={<span className="flex size-10 items-center justify-center rounded-xl bg-accent text-foreground"><ScanLine /></span>}
      status={{ label: p.c === "danger" ? "ພາດ" : p.c === "warning" ? "ໃກ້ກຳນົດ" : "ປົກກະຕິ", tone: p.c, live: p.c === "danger" }}
      fields={[{ label: "ສະແກນລ່າສຸດ", value: p.last, icon: <Clock /> }, { label: "ໂດຍ", value: p.by }, { label: "ມື້ນີ້", value: "14 / 16", icon: <CalendarDays /> }, { label: "ຮອບ", value: "ທຸກ 2 ຊົ່ວໂມງ" }]}
      actions={<Button size="sm" variant="outline" onClick={() => toast("ນຳທາງໄປ " + p.t)}><MapPin />ນຳທາງ</Button>}>
      <button aria-label={p.t} style={{ left: p.x, top: p.y }} className="vks-press absolute flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <span className={"relative size-4 rounded-full ring-4 ring-background " + dot[p.c]}>{p.c === "danger" && <span className={"vks-ripple absolute inset-0 rounded-full " + dot[p.c]} />}</span>
      </button>
    </DetailPopover>)}
  </div>
}

const imp = (x: string) => `import { ${x} } from "@vks/ui"`
export const moreDocs: Doc[] = [
  {
    slug: "detail-popover", name: "Detail popover", group: "Overlays", badge: "New",
    desc: "Popup detail information. Hover (or tap) a name, row or map pin and a rich card grows out of it from the side it opens on; rows stagger in. On a phone the same content rises as a bottom sheet.",
    file: "packages/ui/src/components/detail-popover.tsx", importLine: imp("DetailPopover, type DetailField"),
    demo: () => <DetailDemo />,
    code: `<DetailPopover side="right" align="start"
  title="ສົມຊາຍ ວົງສະຫວັນ" subtitle="ພະນັກງານຮັກສາຄວາມປອດໄພ"
  media={<Avatar name="ສົມຊາຍ" size={44} status="online" />}
  status={{ label: "ເຂົ້າກະແລ້ວ", tone: "success", live: true }}
  fields={[
    { label: "ລະຫັດ", value: "G014" },
    { label: "ກະ", value: "06:00-18:00", icon: <Clock /> },
    { label: "ຈຸດປະຈຳ", value: "ປະຕູໜ້າ A-01", icon: <MapPin />, wide: true },
  ]}
  body={<Progress value={9} max={12} label="ສະແກນ 9/12 ຈຸດ" />}
  actions={<Button size="sm">ເບິ່ງລາຍລະອຽດ</Button>}>
  <button>ສົມຊາຍ ວົງສະຫວັນ</button>
</DetailPopover>`,
    examples: [
      { id: "click", title: "Click to open (map pins)", note: 'openOn="click" for things people tap on purpose. The red pin ripples; its chip dot breathes.', demo: () => <DetailClickDemo />, code: `<DetailPopover openOn="click" side="top" title="ຄັງສິນຄ້າ"
  status={{ label: "ພາດ", tone: "danger", live: true }} fields={…} actions={…}>
  <button aria-label="ຄັງສິນຄ້າ" className="size-11">…pin…</button>
</DetailPopover>` },
    ],
    props: [
      { name: "children", type: "ReactElement", desc: "One focusable trigger (button / a). Keyboard focus opens the hover card too." },
      { name: "title / subtitle / media", type: "ReactNode", desc: "Header row. media = Avatar or icon tile." },
      { name: "status", type: "{ label; tone?: 'neutral'|'success'|'warning'|'danger'|'gold'; live? }", desc: "Chip with a dot; live = breathing dot." },
      { name: "fields", type: "{ label; value; icon?; wide? }[]", desc: "Two-column grid. wide spans both columns. Keep 3-8." },
      { name: "body / actions", type: "ReactNode", desc: "Anything under the fields; up to 2 buttons at the bottom." },
      { name: "openOn", type: '"hover" | "click"', def: '"hover"', desc: "Desktop only. Hover opens after 250 ms, closes 120 ms after leaving." },
      { name: "side / align", type: "Radix side / align", def: '"bottom" / "center"', desc: "The card grows from this side and flips when there is no room." },
      { name: "open / onOpenChange", type: "boolean / (o) => void", desc: "Optional control." },
    ],
    notes: ["Motion: 240 ms scale 0.94 → 1 from the trigger's side on --ease-spring, exit 150 ms. Phone: normal sheet slide. Lite mode: fade only, no blur shadow.", "Never put the only copy of information in here: it is a shortcut to a detail page, not the page itself."],
  },
  { slug: "ios-alert", name: "iOS alert", group: "Overlays", badge: "New", desc: "iOS alert behaviour in VKS style: spring zoom, round tone badge (info / success / warning / danger), gold glow + hairline, pill buttons. 2 buttons side by side, 3+ stacked.", file: "packages/ui/src/components/ios.tsx", importLine: imp("IOSAlert"), demo: AlertDemo,
    code: `<IOSAlert open={o} onOpenChange={setO} title="ລຶບຮູບນີ້?" message="ຍົກເລີກບໍ່ໄດ້."
  actions={[{ label: "ຍົກເລີກ", style: "cancel" }, { label: "ລຶບ", style: "destructive", onPress: del }]} />`,
    props: [{ name: "actions", type: "{ label; onPress?; style?: 'default'|'cancel'|'destructive' }[]", desc: "cancel = bold, destructive = red + error haptic." }, { name: "icon", type: "ReactNode", desc: "Replaces the tone icon inside the badge." }, { name: "tone", type: '"info" | "success" | "warning" | "danger"', def: "danger if any action is destructive, else info", desc: "Badge colour." }],
    notes: ["Use for short yes/no questions. Long forms → Dialog. A list of choices → Action sheet.", "Hold-to-confirm for dangerous actions → ConfirmDialog."] },
  { slug: "action-sheet", name: "Action sheet", group: "Overlays", badge: "Mobile", desc: "iOS grouped buttons from the bottom with a separate Cancel.", file: "packages/ui/src/components/ios.tsx", importLine: imp("ActionSheet"), demo: SheetDemo,
    code: `<ActionSheet open={o} onOpenChange={setO} title="ຮູບ IMG_0142"
  actions={[{ label: "ແບ່ງປັນ", icon: <Share2 />, onPress: share }, { label: "ລຶບ", destructive: true, onPress: del }]} />` },
  { slug: "banner", name: "Notification banner", group: "Feedback", badge: "New", desc: "iOS push-style banner that springs down from the top. Swipe up or wait to dismiss, tap to open.", file: "packages/ui/src/components/ios.tsx", importLine: imp("Banner"), demo: BannerDemo,
    code: `<Banner open={o} onOpenChange={setO} tone="danger" app="VKS PATROL"
  title="ພາດຈຸດກວດ" message="ແຕະເພື່ອເປີດ" onPress={openIt} duration={5000} />`,
    props: [{ name: "tone", type: "'info'|'success'|'warning'|'danger'", def: '"info"', desc: "" }, { name: "duration", type: "ms", def: "5000", desc: "0 = stays until dismissed." }, { name: "onPress", type: "() => void", desc: "Tap the banner." }] },
  { slug: "list-group", bleed: true, name: "Settings list", group: "Data display", badge: "Mobile", desc: "iOS Settings-style grouped rows with coloured icon tiles, switches and chevrons.", file: "packages/ui/src/components/ios.tsx", importLine: imp("ListGroup, ListRow"), demo: ListDemo,
    code: `<ListGroup header="ອຸປະກອນ" footer="GPS ຕ້ອງເປີດ.">
  <ListRow icon={<MapPin />} label="GPS" trailing={<Switch … />} />
  <ListRow icon={<Wifi />} label="ຂໍ້ມູນລໍຖ້າສົ່ງ" detail="3" onPress={open} />
</ListGroup>` },
  { slug: "skeletons", name: "Skeletons", group: "Feedback", badge: "New", desc: "Shaped placeholders (text, avatar, list, card, table) so nothing jumps when data lands.", file: "packages/ui/src/components/extras.tsx", importLine: imp("SkeletonText, SkeletonList, SkeletonCard, SkeletonTable, SkeletonAvatar"), demo: SkelDemo,
    code: `{loading ? <SkeletonList rows={5} /> : <StaffList … />}` },
  { slug: "number-ticker", name: "Number ticker", group: "Data display", badge: "New", desc: "Counts smoothly to a new value. Jumps straight there on low-end phones.", file: "packages/ui/src/components/extras.tsx", importLine: imp("NumberTicker"), demo: TickerDemo,
    code: `<NumberTicker value={income} format={(n) => Math.round(n).toLocaleString() + " ກີບ"} />` },
  { slug: "floating-input", name: "Floating & password input", group: "Form", badge: "New", desc: "Label floats up on focus; password has an animated show/hide eye.", file: "packages/ui/src/components/extras.tsx", importLine: imp("FloatingInput, PasswordInput"), demo: FieldsDemo,
    code: `<FloatingInput label="ລະຫັດພະນັກງານ" />
<PasswordInput placeholder="ລະຫັດຜ່ານ" />` },
  { slug: "chip", name: "Chip", group: "Form", badge: "New", desc: "Selectable filter pills and removable tags. Tap x: the x spins, the chip shrinks away, then the chips after it glide into the gap (including wrapping up to the line above).", file: "packages/ui/src/components/extras.tsx", importLine: imp("Chip"), demo: ChipDemo,
    code: `<Chip selected={on} onClick={toggle}>ກະເຊົ້າ</Chip>
<Chip icon={<MapPin />} onRemove={remove}>ປະຕູໜ້າ</Chip>` },
  { slug: "menu", name: "Menu & popover", group: "Overlays", badge: "New", desc: "Frosted iOS menu and a content popover. On desktop they spring out of their trigger; on a phone (under 640 px) both dock to the bottom as a sheet with a grabber, dimmed backdrop and 48 px rows.", file: "packages/ui/src/components/extras.tsx", importLine: imp("Menu, MenuTrigger, MenuContent, MenuItem, MenuLabel, MenuSeparator, Popover, PopoverTrigger, PopoverContent"), demo: MenuDemo,
    code: `<Menu>
  <MenuTrigger asChild><Button>…</Button></MenuTrigger>
  <MenuContent><MenuItem icon={<Copy />} onSelect={copy}>ສຳເນົາ</MenuItem></MenuContent>
</Menu>` },
  { slug: "kbd-copy", name: "Kbd, copy & separator", group: "Actions", desc: "Small helpers: keyboard hint, copy-to-clipboard with a tick, divider.", file: "packages/ui/src/components/extras.tsx", importLine: imp("Kbd, CopyButton, Separator"), demo: MiscDemo,
    code: `<Kbd>Ctrl</Kbd> <Kbd>K</Kbd>
<CopyButton value={code} />` },
  { slug: "step-progress", name: "Step progress", group: "Layout & navigation", badge: "New", desc: "Compact 'Step 2 of 4' bar for long phone forms where the full wizard header won't fit.", file: "packages/ui/src/components/wizard.tsx", importLine: imp("StepProgress"), demo: StepProgDemo,
    code: `<StepProgress step={1} total={4} label="ລາຍງານເຫດການ" />` },
  { slug: "performance", name: "Performance tiers", group: "Foundations", badge: "New", desc: "High-end vs low-end phone mode. Lite drops blur, looping motion and heavy shadows.", file: "packages/ui/src/lib/perf.tsx", importLine: imp("PerfProvider, initPerf, PerfToggle, usePerf"), demo: PerfDemo,
    code: `// main.tsx
initPerf()   // sets <html data-perf> before first paint
root.render(<ThemeProvider><PerfProvider><App /></PerfProvider></ThemeProvider>)

// settings screen
<PerfToggle />
const { tier } = usePerf()   // skip JS effects when tier === "lite"`,
    notes: ["Auto = lite when: reduced motion, Save-Data, ≤3 GB RAM, or ≤4 cores with ≤4 GB.", "Choice is stored in localStorage (vks-perf).", "Lite keeps every feature — only the decoration goes."] },
]