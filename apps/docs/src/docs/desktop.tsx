import * as React from "react"
import { Home, FileText, Users, Settings, Plus, Folder, Shield, User, Copy, Trash2, CheckCircle2, Clock, AlertTriangle, BarChart3, Search } from "@vks-kit/ui/icons"
import {
  CommandPalette, Breadcrumb, HoverCard, ContextMenu, TreeView, StatCard, TrendLine, ButtonGroup, Dropzone, fmtBytes, FileIcon, FileItem, TagInput, SplitPane, NotificationList, ScrollArea,
  Button, Badge, Avatar, Card, Label, toast, type Notice, type TreeNode,
  HoverFx, Parallax, ParallaxLayer, SlideHighlight, CursorRing, Logo,
} from "@vks-kit/ui"
import { ArrowRight, Bell } from "@vks-kit/ui/icons"
import { fmtKipShort } from "@vks-kit/core"
import type { Doc } from "./types"

function CommandDemo() {
  const [o, setO] = React.useState(false)
  // This docs site already owns Ctrl+K (its own search), so the demo opens from the button only.
  return <><Button variant="outline" onClick={() => setO(true)}><Search />ຄົ້ນຫາຄຳສັ່ງ</Button>
    <CommandPalette open={o} onOpenChange={setO} commands={[
      { id: "home", label: "ໜ້າຫຼັກ", group: "ໄປທີ່", icon: <Home />, shortcut: "G H", onRun: () => toast("ໜ້າຫຼັກ") },
      { id: "rep", label: "ລາຍງານ QC", group: "ໄປທີ່", icon: <FileText />, keywords: "report qc", onRun: () => toast("ລາຍງານ") },
      { id: "staff", label: "ພະນັກງານ", group: "ໄປທີ່", icon: <Users />, keywords: "staff guard", onRun: () => toast("ພະນັກງານ") },
      { id: "new", label: "ສ້າງລາຍງານໃໝ່", group: "ຄຳສັ່ງ", icon: <Plus />, shortcut: "N", onRun: () => toast("ສ້າງ") },
      { id: "set", label: "ຕັ້ງຄ່າ", group: "ຄຳສັ່ງ", icon: <Settings />, keywords: "settings", onRun: () => toast("ຕັ້ງຄ່າ") },
    ]} /></>
}
const BreadDemo = () => <div className="space-y-3"><Breadcrumb items={[{ label: "ໜ້າຫຼັກ", icon: <Home />, onClick: () => {} }, { label: "ວຽງຈັນ", onClick: () => {} }, { label: "ຈຸດ", onClick: () => {} }, { label: "ປະຕູໜ້າ", onClick: () => {} }, { label: "ສົມຊາຍ" }]} /><Breadcrumb items={[{ label: "ໜ້າຫຼັກ", onClick: () => {} }, { label: "ລາຍງານ" }]} /></div>
const HoverDemo = () => <p className="leading-normal">ວາງເມົ້າໃສ່ <HoverCard trigger={<button className="font-semibold text-primary underline decoration-dotted underline-offset-4 dark:text-foreground">ສົມຊາຍ</button>}>
  <div className="flex gap-3"><Avatar name="ສົມຊາຍ" size={44} /><div><b>ສົມຊາຍ</b><p className="text-sm text-muted-foreground">G001 · ປະຕູໜ້າ · ກະເຊົ້າ</p></div></div></HoverCard> ເພື່ອເບິ່ງຂໍ້ມູນ</p>
const CtxDemo = () => <ContextMenu label="ສົມຊາຍ" actions={[{ label: "ເປີດ", icon: <User />, shortcut: "↵", onSelect: () => toast("ເປີດ") }, { label: "ສຳເນົາລະຫັດ", icon: <Copy />, onSelect: () => toast("G001") }, { label: "ຍ້າຍໄປ", items: [{ label: "ປະຕູໜ້າ" }, { label: "ຄັງສິນຄ້າ" }] }, { label: "ລຶບ", icon: <Trash2 />, destructive: true, separator: true, onSelect: () => toast.error("ລຶບ") }]}>
  <div className="grid h-32 w-full max-w-sm place-items-center rounded-xl border border-dashed text-sm leading-normal text-muted-foreground">ຄລິກຂວາ ຫຼື ກົດຄ້າງບ່ອນນີ້</div></ContextMenu>
const tree: TreeNode[] = [
  { id: "vte", label: "ວຽງຈັນ", icon: <Folder />, children: [
    { id: "s1", label: "ປະຕູໜ້າ", icon: <Shield />, badge: <Badge variant="success">3</Badge>, children: [{ id: "g1", label: "ສົມຊາຍ", icon: <User /> }, { id: "g2", label: "ນາງບົວ", icon: <User /> }] },
    { id: "s2", label: "ຄັງສິນຄ້າ", icon: <Shield />, badge: <Badge variant="warning">1</Badge> }] },
  { id: "pks", label: "ປາກເຊ", icon: <Folder />, children: [{ id: "s3", label: "ສາຂາ 1", icon: <Shield /> }] },
]
function TreeDemo() { const [s, setS] = React.useState("s1"); return <div className="w-full max-w-xs rounded-xl border bg-card p-2"><TreeView nodes={tree} selected={s} onSelect={(n) => setS(n.id)} defaultExpanded={["vte"]} /></div> }
const StatDemo = () => <div className="grid w-full gap-4 max-md:gap-0 max-md:border-y max-md:bg-card sm:grid-cols-2 xl:grid-cols-4">
  <StatCard flush label="ກວດສຳເລັດ" value="96%" delta={4} icon={<CheckCircle2 />} tone="success" trend={[80, 84, 83, 88, 91, 90, 96]} hint="vs ອາທິດກ່ອນ" />
  <StatCard flush label="ມາຊ້າ" value="7" delta={-22} goodWhen="down" icon={<Clock />} tone="warning" trend={[12, 11, 9, 10, 8, 9, 7]} />
  <StatCard flush label="ເຫດການ" value="3" delta={50} goodWhen="down" icon={<AlertTriangle />} tone="destructive" trend={[1, 2, 1, 2, 2, 3, 3]} />
  <StatCard flush label="ລາຍຮັບ" value={fmtKipShort(84500000)} delta={0} icon={<BarChart3 />} trend={[60, 62, 70, 68, 75, 80, 84]} /></div>
function GroupDemo() { const [v, setV] = React.useState("d"); return <ButtonGroup label="view">{[["d", "ມື້"], ["w", "ອາທິດ"], ["m", "ເດືອນ"]].map(([k, l]) => <Button key={k} size="sm" variant={v === k ? "default" : "outline"} onClick={() => setV(k)}>{l}</Button>)}</ButtonGroup> }
const SAMPLE = [{ name: "ລາຍງານ QC ເດືອນ 8.pdf", type: "application/pdf", size: 1_240_000 }, { name: "ຕາຕະລາງເວນ.xlsx", size: 86_000 }]
function DropDemo() { const [f, setF] = React.useState<{ name: string; type?: string; size?: number }[]>(SAMPLE); return <div className="w-full max-w-md"><Dropzone accept="image/*,.pdf,.xlsx,.docx" maxSize={5 * 1024 * 1024} hint="ຮູບ, PDF, Excel, Word · ສູງສຸດ 5 MB" files={f} onRemove={(i) => setF((y) => y.filter((_, j) => j !== i))} onFiles={(x) => setF((y) => [...y, ...x])} onReject={(x, r) => toast.error(x.name + (r === "size" ? " ໃຫຍ່ເກີນ" : " ບໍ່ຮອງຮັບ"))} /></div> }
const KINDS = ["ລາຍງານ.pdf", "ເງິນເດືອນ.xlsx", "ສັນຍາ.docx", "ນຳສະເໜີ.pptx", "ຮູບເຫດການ.jpg", "ກ້ອງ.mp4", "ສຽງ.m4a", "ເອກະສານ.zip", "ບັນທຶກ.bin"]
const FileIconDemo = () => <div className="w-full max-w-lg space-y-5">
  <div className="flex flex-wrap justify-center gap-4">{KINDS.map((n) => <FileIcon key={n} name={n} size="lg" />)}</div>
  <div className="space-y-2"><FileItem name="ລາຍງານ QC ເດືອນ 8.pdf" size={1_240_000} onOpen={() => toast("ເປີດ")} onRemove={() => toast("ລຶບ")} /><FileItem name="ຮູບເຫດການ_0214.jpg" size={640_000} progress={62} meta="ກຳລັງອັບໂຫຼດ · 62%" /></div></div>
function TagDemo() { const [t, setT] = React.useState(["ກະເຊົ້າ", "VIP"]); return <div className="w-full max-w-md space-y-1.5"><Label>ປ້າຍກຳກັບ</Label><TagInput value={t} onChange={setT} max={6} suggestions={["ກະເຊົ້າ", "ກະແລງ", "ກະດຶກ", "VIP", "ທົດລອງງານ", "ຫົວໜ້າ"]} /></div> }
const SplitDemo = () => <SplitPane storageKey="docs-split" className="h-72 w-full" left={<ScrollArea className="h-full"><div className="space-y-1 p-3">{Array.from({ length: 24 }, (_, i) => <div key={i} className="rounded-lg px-3 py-2 text-sm hover:bg-muted">ລາຍງານ #{1024 + i}</div>)}</div></ScrollArea>} right={<div className="p-5 leading-normal text-muted-foreground">ລາກເສັ້ນກາງ ຫຼື ໃຊ້ ← → ເມື່ອໂຟກັສ. ຂະໜາດຈື່ໄວ້ດ້ວຍ storageKey.</div>} />
const notices0: Notice[] = [
  { id: "1", title: "ພາດການກວດ · ຄັງສິນຄ້າ", body: "ທ້າວດາວ ບໍ່ໄດ້ສະແກນ QR ເວລາ 02:00", time: "5 ນາທີ", tone: "danger", icon: <AlertTriangle />, group: "ມື້ນີ້" },
  { id: "2", title: "ລາຍງານ QC ສົ່ງແລ້ວ", body: "ສົມຊາຍ ສົ່ງລາຍງານປະຈຳວັນ", time: "1 ຊມ", tone: "success", icon: <CheckCircle2 />, group: "ມື້ນີ້" },
  { id: "3", title: "ຂໍລາພັກ", body: "ນາງບົວ ຂໍລາພັກວັນສຸກ", time: "ມື້ວານ", tone: "warning", icon: <Clock />, group: "ມື້ວານ", read: true },
]
function NoticeDemo() { const [n, setN] = React.useState(notices0); return <Card className="w-full overflow-hidden max-sm:rounded-none max-sm:border-x-0 sm:max-w-md"><NotificationList items={n} onMarkAll={() => setN((x) => x.map((y) => ({ ...y, read: true })))} onOpen={(a) => setN((x) => x.map((y) => (y.id === a.id ? { ...y, read: true } : y)))} onDismiss={(a) => setN((x) => x.filter((y) => y.id !== a.id))} /></Card> }

const fxTile = "rounded-2xl border bg-card p-5 shadow-xs"
const FxDemo = () => <div className="grid w-full gap-4 sm:grid-cols-3">
  <HoverFx effect="spotlight" className={fxTile}><p className="text-sm text-muted-foreground">ຈຸດກວດມື້ນີ້</p><p className="text-2xl font-bold">128 / 134</p><p className="mt-1 text-xs text-muted-foreground">spotlight</p></HoverFx>
  <HoverFx effect="trace" className="rounded-2xl bg-bar p-5 text-bar-foreground"><p className="text-sm opacity-70">Patrol live</p><p className="text-2xl font-bold">24 guards</p><p className="mt-1 text-xs opacity-60">trace</p></HoverFx>
  <HoverFx effect="tilt" className="rounded-2xl bg-bar p-5 text-bar-foreground shadow-lg"><p className="text-sm text-gold">ຄະແນນ QC</p><p className="text-2xl font-bold">4.8 ★</p><p className="mt-1 text-xs opacity-60">tilt</p></HoverFx>
</div>
const ParallaxDemo = () => <Parallax className="relative isolate grid h-56 w-full place-items-center overflow-hidden rounded-2xl bg-bar">
  <ParallaxLayer depth={-20} aria-hidden className="absolute -right-16 -top-16 -z-10 size-64 rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--gold)_40%,transparent),transparent_68%)]" />
  <ParallaxLayer depth={14} aria-hidden className="absolute -bottom-16 -left-12 -z-10 size-48 rounded-full opacity-60 bg-[radial-gradient(circle,color-mix(in_oklab,var(--gold)_40%,transparent),transparent_68%)]" />
  <ParallaxLayer depth={6}><Logo className="size-16 drop-shadow-xl" /></ParallaxLayer>
</Parallax>
const SlideDemo = () => <SlideHighlight className="w-60 rounded-xl border bg-card p-1.5">
  {["ໜ້າຫຼັກ", "ລາດຕະເວນ", "ລາຍງານ QC", "ພະນັກງານ"].map((l) => <button key={l} data-slide-item className="flex min-h-11 w-full items-center gap-3 rounded-[0.6rem] px-3 text-left text-sm leading-normal outline-none focus-visible:ring-2 focus-visible:ring-ring"><span className="size-2 rounded-sm bg-gold" />{l}</button>)}
</SlideHighlight>
const CursorDemo = () => <CursorRing className="flex h-48 w-full items-center justify-center gap-3 rounded-2xl bg-bar">
  {["Patrol", "QC", "HRM"].map((l) => <Button key={l} variant="outline" className="rounded-full border-white/20 bg-white/5 text-bar-foreground">{l}</Button>)}
</CursorRing>
const NudgeDemo = () => <div className="flex gap-3"><Button className="vks-nudge">ຕໍ່ໄປ <ArrowRight /></Button><Button variant="outline" size="icon" className="vks-nudge" aria-label="ແຈ້ງເຕືອນ"><Bell /></Button></div>
const imp = (x: string) => "import { " + x + " } from \"@vks-kit/ui\""
const F = "packages/ui/src/components/desktop-kit.tsx"
export const desktopDocs: Doc[] = [
  { slug: "command-palette", name: "Command palette (⌘K)", group: "Layout & navigation", badge: "New", desc: "Ctrl/⌘ K opens a fuzzy search over pages and actions. Arrow keys + Enter. Works in Lao.", file: F, importLine: imp("CommandPalette, useCommandK"), demo: CommandDemo,
    code: "const [open, setOpen] = React.useState(false)\nuseCommandK(setOpen)\n<CommandPalette open={open} onOpenChange={setOpen} commands={[{ id: \"rep\", label: \"ລາຍງານ\", group: \"ໄປທີ່\", keywords: \"report\", onRun: go }]} />",
    props: [{ name: "commands", type: "{ id; label; group?; icon?; shortcut?; keywords?; onRun }[]", desc: "keywords = extra English words to match." }],
    notes: ["Substring matches rank above scattered-letter matches (fuzzyScore, unit tested).", "Call useCommandK once per app. This docs site already uses Ctrl+K for its own search, so the demo opens from the button."] },
  { slug: "breadcrumb", name: "Breadcrumb", group: "Layout & navigation", badge: "New", desc: "Where am I, one click up. Long paths collapse the middle into …", file: F, importLine: imp("Breadcrumb"), demo: BreadDemo,
    code: "<Breadcrumb items={[{ label: \"ໜ້າຫຼັກ\", href: \"/\" }, { label: \"ຈຸດ\", href: \"/sites\" }, { label: \"ປະຕູໜ້າ\" }]} />", notes: ["Desktop only. On phone use the back button in PageHeader."] },
  { slug: "hover-card", name: "Hover card", group: "Overlays", badge: "New", desc: "Rich preview when you hover a name or ID. Opens after 350 ms so it never flickers.", file: F, importLine: imp("HoverCard"), demo: HoverDemo,
    code: "<HoverCard trigger={<a>ສົມຊາຍ</a>}><StaffPreview id=\"G001\" /></HoverCard>", notes: ["Preview only, never the only way to reach info (touch has no hover)."] },
  { slug: "context-menu", name: "Context menu", group: "Overlays", badge: "New", device: "desktop", desc: "Desktop-first: right-click menu (long-press works on phones but nobody discovers it, so give phones a visible ⋯ Menu or ActionSheet). Right-click (or long-press) menu with icons, shortcuts, sub-menus and a red destructive item.", file: F, importLine: imp("ContextMenu"), demo: CtxDemo,
    code: "<ContextMenu actions={[{ label: \"ເປີດ\", onSelect: open }, { label: \"ລຶບ\", destructive: true, separator: true, onSelect: del }]}>\n  <Row … />\n</ContextMenu>" },
  { slug: "tree-view", name: "Tree view", group: "Data display", badge: "New", desc: "Nested sites/folders. Arrow keys walk and open/close, rows slide in.", file: F, importLine: imp("TreeView, flattenTree"), demo: TreeDemo,
    code: "<TreeView nodes={tree} selected={id} onSelect={(n) => setId(n.id)} defaultExpanded={[\"vte\"]} />" },
  { slug: "stat-card", name: "Stat card", group: "Data display", badge: "New", bleed: true, desc: "Dashboard KPI tile: number, coloured delta and a drawn-in trend line.", file: F, importLine: imp("StatCard, TrendLine"), demo: StatDemo,
    examples: [{ id: "trend-line", title: "Trend line alone", note: "The drawn-in line from StatCard, for table cells or custom tiles. For axes and tooltips use @vks-kit/ui/charts.", demo: () => <div className="w-40"><TrendLine data={[12, 11, 9, 10, 8, 9, 7]} /></div>, code: "<TrendLine data={[12, 11, 9, 10, 8, 9, 7]} />" }],
    code: "<StatCard label=\"ມາຊ້າ\" value=\"7\" delta={-22} goodWhen=\"down\" tone=\"warning\" trend={[12, 11, 9, 7]} />",
    notes: ["On phones (≤768 px) it turns into a compact row: icon, label + number, delta chip and a small trend on the right. A 4-tile summary then fits one screen instead of four tall cards. layout=\"card\" or \"row\" overrides the automatic choice."],
    props: [{ name: "flush", type: "boolean", def: "false", desc: "Phone row only: no border or radius, so rows form one full-width grouped list. Wrap them in a bg-card border-y container." }, { name: "layout", type: "'auto'|'card'|'row'", def: '"auto"', desc: "auto = row on phones, card elsewhere." }, { name: "goodWhen", type: "'up'|'down'", def: '"up"', desc: "Which direction is green." }, { name: "tone", type: "'primary'|'success'|'warning'|'destructive'", def: '"primary"', desc: "" }] },
  { slug: "button-group", name: "Button group", group: "Actions", badge: "New", desc: "Joined buttons for a small set of related actions or views.", file: F, importLine: imp("ButtonGroup"), demo: GroupDemo,
    code: "<ButtonGroup label=\"view\"><Button variant=\"outline\">ມື້</Button><Button variant=\"outline\">ອາທິດ</Button></ButtonGroup>" },
  { slug: "dropzone", name: "Dropzone", group: "Form", badge: "New", desc: "Drag files in or click to pick. Checks type and size before upload.", file: F, importLine: imp("Dropzone, fmtBytes"), demo: DropDemo,
    code: "const [files, setFiles] = React.useState<File[]>([])\n<Dropzone accept=\"image/*,.pdf\" maxSize={5 * 1024 * 1024} files={files} onRemove={(i) => setFiles(files.filter((_, j) => j !== i))}\n  onFiles={(f) => setFiles([...files, ...f])} onReject={(f, why) => toast.error(f.name)} />",
    props: [{ name: "files", type: "{ name; type?; size? }[]", desc: "Picked files, listed under the zone with a coloured type icon and size." }, { name: "onRemove", type: "(index) => void", desc: "Shows a remove button on each listed file." }] },
  { slug: "file-icon", name: "File icon", group: "Data display", badge: "New", desc: "Coloured file-type tile (PDF, Excel, Word, image…) and a file row with size, progress and remove.", file: "packages/ui/src/components/file-icon.tsx", importLine: imp("FileIcon, FileItem, fileKind, fileBadge"), demo: FileIconDemo,
    code: "<FileIcon name=\"report.pdf\" />\n<FileItem name=\"report.pdf\" size={1240000} onOpen={open} onRemove={remove} />\n<FileItem name=\"photo.jpg\" progress={62} meta=\"ກຳລັງອັບໂຫຼດ · 62%\" />",
    props: [{ name: "name / type", type: "string", desc: "File name and/or mime type. Extension wins." }, { name: "size", type: "'sm'|'md'|'lg'", def: '"md"', desc: "sm hides the extension badge." }, { name: "kind", type: "FileKind", desc: "Force a family instead of guessing." }],
    notes: ["One colour per family, from --file-* tokens (light and dark). Never colour a file icon by hand.", "Use FileItem wherever a file appears: uploads, attachments, report downloads."] },
  { slug: "tag-input", name: "Tag input", group: "Form", badge: "New", desc: "Type and press Enter or comma. Paste a list, backspace to remove, suggestions below.", file: F, importLine: imp("TagInput, parseTags"), demo: TagDemo,
    code: "<TagInput value={tags} onChange={setTags} max={6} suggestions={[\"ກະເຊົ້າ\", \"VIP\"]} />" },
  { slug: "split-pane", name: "Split pane", group: "Layout & navigation", badge: "New", desc: "List | detail with a draggable divider. Remembers its size.", file: F, importLine: imp("SplitPane"), demo: SplitDemo,
    code: "<SplitPane storageKey=\"reports\" left={<List />} right={<Detail />} />", notes: ["Stacks on phones; use a Drawer for detail there."] },
  { slug: "scroll-area", name: "Scroll area", group: "Layout & navigation", badge: "New", desc: "Thin overlay scrollbar that matches the theme on Windows desktops.", file: F, importLine: imp("ScrollArea"), demo: () => <ScrollArea className="h-48 w-full max-w-sm rounded-xl border"><div className="space-y-2 p-3">{Array.from({ length: 20 }, (_, i) => <p key={i} className="text-sm">ແຖວ {i + 1}</p>)}</div></ScrollArea>,
    code: "<ScrollArea className=\"h-80\">…</ScrollArea>" },
  { slug: "hover-effects", name: "Hover effects", group: "Foundations", badge: "New", device: "desktop", desc: "Premium mouse effects for desktop: spotlight, edge trace and 3D tilt on cards, mouse parallax, a sliding row highlight, icon nudge and a cursor ring for landing pages. Phones, lite mode and reduced motion get none of it.", file: "packages/ui/src/components/hover-fx.tsx", importLine: imp("HoverFx, Parallax, ParallaxLayer, SlideHighlight, CursorRing, usePointerVars"), demo: FxDemo,
    examples: [
      { id: "parallax", title: "Mouse parallax", note: "Layers drift by their depth (px). Negative moves the other way. LoginScreen's brand panel uses this.", demo: ParallaxDemo, code: "<Parallax className=\"relative overflow-hidden\">\n  <ParallaxLayer depth={-20} aria-hidden>…orb…</ParallaxLayer>\n  <ParallaxLayer depth={6}><Logo /></ParallaxLayer>\n</Parallax>" },
      { id: "slide", title: "Sliding highlight", note: "One pill glides to the hovered row. Mark rows with data-slide-item.", demo: SlideDemo, code: "<SlideHighlight>\n  {rows.map((r) => <button key={r.id} data-slide-item>{r.label}</button>)}\n</SlideHighlight>" },
      { id: "nudge", title: "Icon nudge", note: "Add className=\"vks-nudge\" to a button: arrows slide right, other icons wiggle.", demo: NudgeDemo, code: "<Button className=\"vks-nudge\">ຕໍ່ໄປ <ArrowRight /></Button>" },
      { id: "cursor", title: "Cursor ring (landing / login only)", note: "A gold ring trails the cursor and grows over anything clickable. Never on work screens.", demo: CursorDemo, code: "<CursorRing className=\"min-h-dvh\">…landing…</CursorRing>\n<LoginScreen cursorRing title=\"…\">…</LoginScreen>" },
    ],
    code: "<HoverFx effect=\"spotlight\" className=\"rounded-2xl border bg-card p-5\">…</HoverFx>\n<Parallax><ParallaxLayer depth={-20}>orb</ParallaxLayer><ParallaxLayer depth={6}><Logo /></ParallaxLayer></Parallax>\n<SlideHighlight>{rows.map(r => <button data-slide-item>…</button>)}</SlideHighlight>\n<Button className=\"vks-nudge\">Next <ArrowRight /></Button>\n<LoginScreen cursorRing …/>",
    props: [{ name: "effect", type: "'spotlight'|'trace'|'tilt'", def: '"spotlight"', desc: "HoverFx: glow under the cursor, gold edge near the cursor (best on navy), or ≤5° tilt + sheen." }, { name: "depth", type: "number", def: "12", desc: "ParallaxLayer: max drift in px." }, { name: "itemSelector", type: "string", desc: "SlideHighlight: which children count as rows (default [data-slide-item] or direct children)." }],
    notes: ["Effects only run with a real mouse ((hover: hover) and (pointer: fine)). Lite mode and reduced motion turn them off.", "Tilt and the cursor ring are for hero/KPI cards and landing/login. Keep work screens calm: spotlight + sliding highlight + vks-lift.", "Only transform and opacity animate. The pointer is read once per frame (rAF)."] },
  { slug: "notification-list", bleed: true, name: "Notification centre", group: "Feedback", badge: "New", desc: "Grouped notifications with unread dots, mark-all and dismiss.", file: F, importLine: imp("NotificationList"), demo: NoticeDemo,
    code: "<NotificationList items={notices} onOpen={open} onMarkAll={readAll} onDismiss={remove} />", notes: ["Put it inside a Popover on desktop or a Sheet on phone."] },
]