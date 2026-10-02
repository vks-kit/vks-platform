import * as React from "react"
import { RefreshCw, Search, Inbox } from "@vks-kit/ui/icons"
import { CloseButton, Alert, Button, ConfirmDialog, Skeleton, Spinner, SuccessCheck, OfflineBanner, Empty, LiveDot, toast, Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose, InSheetView, useInSheet, Combobox, FilterChips, Label, Sheet, SheetTrigger, SheetContent, SheetTitle, SheetDescription, Tooltip, TooltipTrigger, TooltipContent, Tip, Drawer, Lightbox, PhotoGrid } from "@vks-kit/ui"
import type { Doc } from "./types"

function AlertDemo() {
  const [open, setOpen] = React.useState(true)
  return <div className="grid w-full max-w-lg gap-3">
    <Alert title="ຂໍ້ມູນ">ລະບົບຈະປິດປັບປຸງ 22:00.</Alert>
    <Alert tone="success" title="ສົ່ງແລ້ວ">ລາຍງານຖືກສົ່ງຫາສູນຄວບຄຸມ.</Alert>
    <Alert tone="warning" title="ຊ້າ 6 ນາທີ" action={<Button size="sm" variant="outline">ເບິ່ງ</Button>}>ຈຸດບ່ອນຈອດລົດ.</Alert>
    {open ? <Alert tone="danger" title="ພາດຈຸດກວດ" onClose={() => setOpen(false)}>ຄັງສິນຄ້າ ບໍ່ມີການສະແກນ.</Alert> : <Button variant="ghost" onClick={() => setOpen(true)}><RefreshCw />Show again</Button>}
  </div>
}
const postOpts = ["ປະຕູໜ້າ", "ປະຕູຫຼັງ", "ບ່ອນຈອດລົດ", "ຄັງສິນຄ້າ", "ຫ້ອງເຊີເວີ", "ຫ້ອງຄວບຄຸມ", "ລິຟ ຊັ້ນ 1", "ຫຼັງຄາ", "ປ້ອມຍາມ"].map((s, i) => ({ value: s, label: s, hint: "P-" + (i + 1) }))
const kindOpts = [{ value: "door", label: "ປະຕູ" }, { value: "person", label: "ຄົນແປກໜ້າ" }, { value: "fire", label: "ໄຟ" }]
function PickerInDialogDemo() {
  const [post, setPost] = React.useState<string[]>([]), [kind, setKind] = React.useState<string[]>(["door"])
  const [pick, setPick] = React.useState(false), [who, setWho] = React.useState("")
  function NestedHint() { return <p className="text-xs leading-5 text-muted-foreground">useInSheet() = {String(useInSheet())} · on a phone the pickers push inside this sheet</p> }
  return <Dialog><DialogTrigger asChild><Button variant="outline">ລາຍງານເຫດການ</Button></DialogTrigger><DialogContent>
    <DialogHeader><DialogTitle>ລາຍງານເຫດການ</DialogTitle><DialogDescription>Short list = chips, long list = Combobox.</DialogDescription></DialogHeader>
    <div className="space-y-1.5"><Label>ປະເພດ</Label><FilterChips options={kindOpts} value={kind} onChange={setKind} /></div>
    <div className="space-y-1.5"><Label>ຈຸດປະຈຳການ</Label><Combobox options={postOpts} value={post} onChange={setPost} placeholder="ເລືອກຈຸດ" /></div>
    <div className="space-y-1.5"><Label>ຜູ້ລາຍງານ</Label><Button variant="outline" className="w-full justify-between" onClick={() => setPick(true)}>{who || "ເລືອກພະນັກງານ"}<span aria-hidden>›</span></Button></div>
    <InSheetView open={pick} onBack={() => setPick(false)} title="ເລືອກພະນັກງານ">
      <div className="grid gap-2 overflow-y-auto">{["ສົມຊາຍ ພົມມະວົງ", "ນາງບົວ ແສງສະຫວ່າງ", "ແກ້ວ ວົງສາ"].map((n) => <Button key={n} variant="outline" size="lg" className="justify-start" onClick={() => { setWho(n); setPick(false) }}>{n}</Button>)}</div>
    </InSheetView>
    <NestedHint />
    <DialogFooter><DialogClose asChild><Button variant="ghost">ຍົກເລີກ</Button></DialogClose><DialogClose asChild><Button onClick={() => toast.success("ສົ່ງແລ້ວ")}>ສົ່ງ</Button></DialogClose></DialogFooter>
  </DialogContent></Dialog>
}
function ConfirmDemo() {
  const [o, setO] = React.useState<null | "warning" | "danger" | "hold">(null)
  return <>
    <Button variant="outline" onClick={() => setO("warning")}>Warning</Button>
    <Button variant="destructive" onClick={() => setO("danger")}>Danger</Button>
    <Button variant="destructive" onClick={() => setO("hold")}>Hold to confirm</Button>
    <ConfirmDialog open={!!o} onOpenChange={(v) => !v && setO(null)} tone={o === "warning" ? "warning" : "danger"} holdToConfirm={o === "hold"}
      title={o === "warning" ? "ອອກໂດຍບໍ່ບັນທຶກ?" : "ລຶບພະນັກງານນີ້?"} description="ຄຳສັ່ງນີ້ຍົກເລີກບໍ່ໄດ້."
      onConfirm={() => { toast.success("ສຳເລັດ"); setO(null) }} />
  </>
}
function Replay({ children }: { children: (k: number) => React.ReactNode }) {
  const [k, setK] = React.useState(0)
  return <div className="flex flex-col items-center gap-3">{children(k)}<Button size="sm" variant="ghost" onClick={() => setK(k + 1)}><RefreshCw />Replay</Button></div>
}
function DrawerDemo() {
  const [o, setO] = React.useState(false)
  return <><Button variant="outline" onClick={() => setO(true)}>Open drawer</Button>
    <Drawer open={o} onClose={() => setO(false)} title="ສົມຊາຍ · G001" footer={<Button className="w-full" onClick={() => setO(false)}>ປິດ</Button>}>
      <p className="text-sm text-muted-foreground">Full screen with a back arrow on a phone. A 448 px side panel on desktop.</p>
    </Drawer></>
}
/** Placeholder photos filled with the live theme tokens (no raw colours in apps/). */
const tokenColour = (v: string) => getComputedStyle(document.documentElement).getPropertyValue(v).trim()
const svg = (c: string) => "data:image/svg+xml," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="640" height="420"><rect width="640" height="420" fill="' + c + '"/></svg>')
function LightboxDemo() {
  const [i, setI] = React.useState<number | null>(null)
  const imgs = ["--chart-1", "--chart-2", "--chart-3"].map((v, n) => ({ src: svg(tokenColour(v)), caption: "ຮູບ " + (n + 1) }))
  return <><div className="flex gap-2">{imgs.map((im, n) => <button key={n} onClick={() => setI(n)} className="vks-press overflow-hidden rounded-lg border"><img src={im.src} alt={im.caption} className="h-16 w-24 object-cover" /></button>)}</div>
    <Lightbox images={imgs} index={i} onIndex={setI} onClose={() => setI(null)} /></>
}

export const feedbackDocs: Doc[] = [
  {
    slug: "alert", name: "Alert", group: "Feedback", badge: "New",
    desc: "Inline warning strip with a coloured left edge. Info, success, warning, danger.",
    file: "packages/ui/src/components/alerts.tsx", importLine: 'import { Alert } from "@vks-kit/ui"',
    demo: () => <AlertDemo />,
    code: `<Alert title="ຂໍ້ມູນ">ລະບົບຈະປິດປັບປຸງ 22:00.</Alert>
<Alert tone="success" title="ສົ່ງແລ້ວ">…</Alert>
<Alert tone="warning" title="ຊ້າ 6 ນາທີ" action={<Button size="sm" variant="outline">ເບິ່ງ</Button>}>…</Alert>
<Alert tone="danger" title="ພາດຈຸດກວດ" onClose={dismiss}>…</Alert>`,
    props: [
      { name: "tone", type: '"info" | "success" | "warning" | "danger"', def: '"info"', desc: "" },
      { name: "title", type: "string", desc: "" }, { name: "action", type: "ReactNode", desc: "A button on the right." },
      { name: "onClose", type: "() => void", desc: "Shows the shared CloseButton (44 px, label ປິດ)." },
      { name: "variant", type: '"bar" | "card"', def: '"bar"', desc: "card = glass card, gold top hairline, round tone badge (matches toast / IOSAlert)." },
      { name: "icon", type: "ReactNode", desc: "Replace the tone icon." },
    ],
    examples: [{
      id: "card", title: "Card variant", note: "Same tones, premium look: the colour lives in the round badge, the text stays neutral.",
      demo: () => <div className="grid w-full max-w-lg gap-3">
        <Alert variant="card" title="ລະບົບຈະປິດປັບປຸງ">ຄືນນີ້ 22:00 - 22:30.</Alert>
        <Alert variant="card" tone="success" title="ສົ່ງແລ້ວ">ລາຍງານຖືກສົ່ງຫາສູນຄວບຄຸມ.</Alert>
        <Alert variant="card" tone="warning" title="ຊ້າ 6 ນາທີ" action={<Button size="sm" variant="outline">ເບິ່ງ</Button>}>ຈຸດບ່ອນຈອດລົດ.</Alert>
        <Alert variant="card" tone="danger" title="ພາດຈຸດກວດ" onClose={() => {}}>ຄັງສິນຄ້າ ບໍ່ມີການສະແກນ.</Alert>
      </div>,
      code: `<Alert variant="card" tone="success" title="ສົ່ງແລ້ວ">…</Alert>
<Alert variant="card" tone="danger" title="ພາດຈຸດກວດ" onClose={dismiss}>…</Alert>`,
    }],
  },
  {
    slug: "close-button", name: "Close button", group: "Feedback", badge: "New",
    desc: "The one round X. 44 px hit area, quiet muted hover, a small press, Lao label ປິດ. Alert, Banner, Dialog, Sheet and Drawer all use it.",
    file: "packages/ui/src/components/close-button.tsx", importLine: 'import { CloseButton, CLOSE_BUTTON } from "@vks-kit/ui"',
    demo: () => <div className="flex items-center gap-4"><CloseButton /><div className="relative h-20 w-56 rounded-2xl border bg-card p-3 text-sm">ກາດ<CloseButton className="absolute right-1 top-1" /></div></div>,
    code: `<CloseButton onClick={dismiss} />
<CloseButton aria-label="ປິດແຈ້ງເຕືອນ" className="absolute right-1 top-1" />
// on a non-button element (e.g. Radix Close): className={CLOSE_BUTTON}`,
    props: [
      { name: "aria-label", type: "string", def: '"ປິດ"', desc: "Override when there are several closes on one screen." },
      { name: "children", type: "ReactNode", def: "<X />", desc: "Swap the icon." },
      { name: "...button props", type: "ComponentProps<'button'>", desc: "onClick, onPointerDown, disabled…" },
    ],
    notes: ["Never put a 32 px X on a phone; the visual stays 16 px but the hit area is always 44 px.", "For 'back' on a pushed page use the PageHeader back arrow instead."],
  },
  {
    slug: "confirm-dialog", name: "Confirm popup", group: "Feedback", badge: "New",
    desc: "Warning popup before anything you cannot undo. Hold-to-confirm for the really dangerous ones, so a pocket tap can't delete.",
    file: "packages/ui/src/components/alerts.tsx", importLine: 'import { ConfirmDialog } from "@vks-kit/ui"',
    demo: () => <ConfirmDemo />,
    code: `<ConfirmDialog open={open} onOpenChange={setOpen}
  tone="danger" holdToConfirm
  title="ລຶບພະນັກງານນີ້?" description="ຄຳສັ່ງນີ້ຍົກເລີກບໍ່ໄດ້."
  onConfirm={async () => { await remove(id) }} />`,
    props: [
      { name: "open / onOpenChange", type: "boolean / (o) => void", desc: "" }, { name: "title", type: "string", desc: "" },
      { name: "description", type: "ReactNode", desc: "" }, { name: "tone", type: '"warning" | "danger"', def: '"warning"', desc: "" },
      { name: "holdToConfirm", type: "boolean", def: "false", desc: "User must press and hold ~1 s; a ring fills up." },
      { name: "onConfirm", type: "() => void | Promise<void>", desc: "Button shows a spinner while the promise runs." },
      { name: "confirmLabel / cancelLabel", type: "string", def: '"ຢືນຢັນ" / "ຍົກເລີກ"', desc: "" }, { name: "busy", type: "boolean", desc: "" },
    ],
  },
  {
    slug: "toast", name: "Toast", group: "Feedback", badge: "Stable",
    desc: "Sonner restyled to match IOSAlert: glass card with a gold hairline, round tone badge, spring entrance and a bar that drains while it stays. Top-center, away from the thumb. Success, error and finished promises buzz the phone.",
    file: "packages/ui/src/components/toaster.tsx", importLine: 'import { toast, Toaster } from "@vks-kit/ui"',
    demo: () => <><Button variant="action" onClick={() => toast.success("ບັນທຶກແລ້ວ", { description: "ລາຍງານ QC #142 ສົ່ງໄປແລ້ວ" })}>Success</Button><Button variant="outline" onClick={() => toast.warning("ເນັດຊ້າ", { description: "ກຳລັງລອງໃໝ່…" })}>Warning</Button><Button variant="destructive" onClick={() => toast.error("ສົ່ງບໍ່ສຳເລັດ", { description: "ບໍ່ມີເນັດ, ຈະລອງໃໝ່ອັດຕະໂນມັດ", action: { label: "ລອງໃໝ່", onClick: () => toast.success("ສົ່ງແລ້ວ") } })}>Error + action</Button><Button variant="outline" onClick={() => toast.promise(new Promise((r) => setTimeout(r, 1600)), { loading: "ກຳລັງອັບໂຫຼດຮູບ…", success: "ອັບໂຫຼດແລ້ວ", error: "ອັບໂຫຼດບໍ່ສຳເລັດ" })}>Promise</Button><Button variant="ghost" onClick={() => toast("ມີວຽກໃໝ່ 2 ລາຍການ", { description: "ຈາກ ຫົວໜ້າກະ" })}>Plain</Button></>,
    code: `// once, at the app root
<Toaster />

toast.success("ບັນທຶກແລ້ວ")   // + 50-20-50 ms buzz
toast.error("ສົ່ງບໍ່ສຳເລັດ", { action: { label: "ລອງໃໝ່", onClick: retry } })
toast.promise(save(), { loading: "ກຳລັງບັນທຶກ…", success: "ບັນທຶກແລ້ວ", error: "ບໍ່ສຳເລັດ" })  // buzzes when it settles
toast("ມີວຽກໃໝ່ 2 ລາຍການ", { description: "ຈາກ ຫົວໜ້າກະ" })`,
    notes: ["Only the badge carries colour; the text stays readable in every tone.", "The drain bar pauses while the pointer is over the stack (sonner pauses the timer too).", "Lite mode drops the glass blur and badge pop; reduced motion gets a plain fade.", "Use toast.promise when the user can keep working; use useProgressHUD when they must wait."],
  },
  {
    slug: "loading", name: "Loading & success", group: "Feedback", badge: "Stable",
    desc: "Skeleton shimmer while loading, a spinner for short waits, and the animated check after a scan.",
    file: "packages/ui/src/components/feedback.tsx", importLine: 'import { Skeleton, Spinner, SuccessCheck, LiveDot } from "@vks-kit/ui"',
    demo: () => <div className="flex w-full flex-wrap items-center justify-center gap-8"><div className="w-48 space-y-2"><Skeleton className="h-10 w-10 rounded-full" /><Skeleton /><Skeleton className="w-2/3" /></div><Spinner className="size-6" /><Replay>{(k) => <SuccessCheck key={k} />}</Replay><span className="inline-flex items-center gap-2 text-sm"><LiveDot />Live</span></div>,
    code: `<Skeleton className="h-10 w-10 rounded-full" />
<Skeleton className="w-2/3" />
<Spinner />
<SuccessCheck />   {/* pair with haptics.success() */}
<LiveDot />`,
  },
  {
    slug: "offline-empty", name: "Offline & empty", group: "Feedback", badge: "Mobile",
    desc: "Offline banner shows the number of scans waiting (classic bar, or the navy Dynamic-Island pill). Empty state with a floating icon orb for lists with nothing in them; Combobox, CommandPalette, NotificationList, IndexedList and DataTable use it too.",
    file: "packages/ui/src/components/feedback.tsx", importLine: 'import { OfflineBanner, Empty } from "@vks-kit/ui"',
    demo: () => <div className="grid w-full max-w-md gap-4"><div className="overflow-hidden rounded-lg"><OfflineBanner queued={3} /></div><div className="overflow-hidden rounded-lg"><OfflineBanner queued={3} syncing /></div><Empty title="ຍັງບໍ່ມີຂໍ້ມູນ" hint="ສະແກນຈຸດທຳອິດເພື່ອເລີ່ມ" /></div>,
    code: `<OfflineBanner queued={queue.size} syncing={flushing} />
<Empty title="ຍັງບໍ່ມີຂໍ້ມູນ" hint="ສະແກນຈຸດທຳອິດເພື່ອເລີ່ມ" />`,
    props: [{ name: "queued", type: "number", def: "0", desc: "OfflineBanner: waiting items." }, { name: "syncing", type: "boolean", def: "false", desc: "OfflineBanner: spinner + 'sending' (island: pulsing gold dot)." }, { name: "variant", type: '"bar" | "island"', def: '"bar"', desc: "OfflineBanner: island = navy pill, tone badge, gold queue chip." }, { name: "title / hint", type: "string / ReactNode", desc: "Empty." }, { name: "icon", type: "ReactNode", def: "<Inbox />", desc: "Empty: icon inside the orb." }, { name: "action", type: "ReactNode", desc: "Empty: e.g. a Button under the text." }, { name: "size", type: '"md" | "sm"', def: '"md"', desc: "Empty: sm drops the dashed frame, for menus and lists." }],
    examples: [
      { id: "island", title: "Offline island", note: "Fixed navy in both themes so it reads as system chrome.", demo: () => <div className="grid w-full max-w-md gap-3 rounded-2xl bg-muted p-4"><OfflineBanner variant="island" queued={3} /><OfflineBanner variant="island" queued={3} syncing /></div>, code: `<div className="fixed inset-x-0 top-[max(.5rem,env(safe-area-inset-top))] z-50">
  <OfflineBanner variant="island" queued={queue.size} syncing={flushing} />
</div>` },
      { id: "empty-action", title: "Empty with icon + action", demo: () => <div className="grid w-full max-w-md gap-4"><Empty icon={<Search />} title="ບໍ່ພົບຜົນ" hint="ລອງຄຳຄົ້ນອື່ນ ຫຼື ລ້າງຕົວກອງ" action={<Button size="sm" variant="outline">ລ້າງຕົວກອງ</Button>} /><div className="rounded-xl border bg-card"><Empty size="sm" icon={<Inbox />} title="ບໍ່ມີແຈ້ງເຕືອນໃໝ່" /></div></div>, code: `<Empty icon={<Search />} title="ບໍ່ພົບຜົນ" hint="ລອງຄຳຄົ້ນອື່ນ" action={<Button size="sm" variant="outline">ລ້າງຕົວກອງ</Button>} />
<Empty size="sm" title="ບໍ່ມີແຈ້ງເຕືອນໃໝ່" />` },
    ],
  },
  {
    slug: "dialog", name: "Dialog", group: "Overlays", badge: "Stable",
    desc: "Bottom sheet on a phone (thumb reach), centred box on desktop. Gold top edge.",
    file: "packages/ui/src/components/overlay.tsx", importLine: 'import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose, InSheetView, useInSheet } from "@vks-kit/ui"',
    demo: () => <Dialog><DialogTrigger asChild><Button variant="outline">Open dialog</Button></DialogTrigger><DialogContent><DialogHeader><DialogTitle>ຢືນຢັນການບັນທຶກ?</DialogTitle><DialogDescription>ຂໍ້ມູນຈະຖືກສົ່ງໄປຫາສູນຄວບຄຸມ.</DialogDescription></DialogHeader><DialogFooter><DialogClose asChild><Button variant="ghost">ຍົກເລີກ</Button></DialogClose><DialogClose asChild><Button variant="action" onClick={() => toast.success("ບັນທຶກແລ້ວ")}>ບັນທຶກ</Button></DialogClose></DialogFooter></DialogContent></Dialog>,
    code: `<Dialog>
  <DialogTrigger asChild><Button variant="outline">Open dialog</Button></DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>ຢືນຢັນການບັນທຶກ?</DialogTitle>
      <DialogDescription>ຂໍ້ມູນຈະຖືກສົ່ງໄປຫາສູນຄວບຄຸມ.</DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <DialogClose asChild><Button variant="ghost">ຍົກເລີກ</Button></DialogClose>
      <Button variant="action">ບັນທຶກ</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>`,
    examples: [{ id: "picker-inside", title: "Picker inside a dialog (no sheet on a sheet)", demo: () => <PickerInDialogDemo />, code: `<DialogContent>
  {/* ≤ 5 options: inline chips, no picker */}
  <FilterChips options={kinds} value={kind} onChange={setKind} />
  {/* long list: popover on desktop, pushed view INSIDE this sheet on a phone */}
  <Combobox options={posts} value={post} onChange={setPost} />
  {/* your own second step */}
  <InSheetView open={pick} onBack={() => setPick(false)} title="ເລືອກພະນັກງານ">…</InSheetView>
</DialogContent>` }],
    notes: ["On a phone a dropdown inside a Dialog never opens a second sheet: Combobox, DatePicker and DateRangePicker push a view inside the same sheet (‹ back, Esc, or a pick returns). Use InSheetView for your own second step; useInSheet() tells a component it is inside one.", "≤ 5 options inside a dialog: use FilterChips or RadioGroup, not a picker."],
  },
  {
    slug: "sheet", name: "Sheet", group: "Overlays", badge: "Mobile",
    desc: "Slides in from the bottom, the right, or covers the whole screen.",
    file: "packages/ui/src/components/overlay.tsx", importLine: 'import { Sheet, SheetTrigger, SheetContent, SheetTitle, SheetDescription } from "@vks-kit/ui"',
    demo: () => <>{(["bottom", "right", "fullscreen"] as const).map((s) => <Sheet key={s}><SheetTrigger asChild><Button variant="outline">{s}</Button></SheetTrigger><SheetContent side={s}><div className={s === "fullscreen" ? "p-5" : ""}><SheetTitle>ເລືອກຈຸດກວດ</SheetTitle><SheetDescription>side = {s}</SheetDescription></div></SheetContent></Sheet>)}</>,
    code: `<Sheet>
  <SheetTrigger asChild><Button>Open</Button></SheetTrigger>
  <SheetContent side="bottom">
    <SheetTitle>ເລືອກຈຸດກວດ</SheetTitle>
    <SheetDescription>ຈຸດ 12 / 20</SheetDescription>
  </SheetContent>
</Sheet>`,
    props: [{ name: "side", type: '"bottom" | "right" | "fullscreen"', def: '"bottom"', desc: "Bottom respects the phone's home-bar safe area." }],
  },
  {
    slug: "drawer", name: "Drawer", group: "Overlays", badge: "Mobile",
    desc: "Record detail panel. Full screen with a back arrow on a phone, side panel on desktop.",
    file: "packages/ui/src/components/drawer.tsx", importLine: 'import { Drawer } from "@vks-kit/ui"',
    demo: () => <DrawerDemo />,
    code: `<Drawer open={!!row} onClose={() => setRow(null)} title={row?.name}
  footer={<Button className="w-full">ແກ້ໄຂ</Button>}>
  …
</Drawer>`,
    props: [{ name: "open", type: "boolean", desc: "" }, { name: "onClose", type: "() => void", desc: "Also fires on the phone back arrow." }, { name: "title", type: "ReactNode", desc: "" }, { name: "footer", type: "ReactNode", desc: "Sticky at the bottom." }],
  },
  {
    slug: "tooltip", name: "Tooltip", group: "Overlays", badge: "Stable",
    desc: "Desktop hint only. Never put anything a phone user needs inside a tooltip. Three looks: dark (navy chip, default), light (card for longer help), glass (over maps, photos, charts). Optional arrow, key-shortcut hint and a bold title line. Tip is the one-line shortcut.",
    file: "packages/ui/src/components/overlay.tsx", importLine: 'import { TooltipProvider, Tip, Tooltip, TooltipTrigger, TooltipContent } from "@vks-kit/ui"',
    demo: () => <div className="flex flex-wrap items-center justify-center gap-3">
      <Tip content="ບັນທຶກ" shortcut="Ctrl S"><Button variant="outline">Dark + key</Button></Tip>
      <Tip variant="light" side="bottom" title="ກະເຊົ້າ" content="06:00 – 14:00 · 12 ຄົນ"><Button variant="outline">Light + title</Button></Tip>
      <Tip variant="glass" side="right" content="ຈຸດກວດ 12 / 20"><Button variant="outline">Glass</Button></Tip>
      <Tooltip><TooltipTrigger asChild><Button variant="ghost">No arrow</Button></TooltipTrigger><TooltipContent>ຄຳອະທິບາຍ</TooltipContent></Tooltip>
    </div>,
    code: `// TooltipProvider once at the root
<Tip content="ບັນທຶກ" shortcut="Ctrl S"><Button>…</Button></Tip>
<Tip variant="light" title="ກະເຊົ້າ" content="06:00 – 14:00 · 12 ຄົນ"><Button>…</Button></Tip>

// full control
<Tooltip>
  <TooltipTrigger asChild><Button variant="ghost">Hover me</Button></TooltipTrigger>
  <TooltipContent variant="glass" arrow side="right">ຄຳອະທິບາຍ</TooltipContent>
</Tooltip>`,
    props: [
      { name: "variant", type: '"dark" | "light" | "glass"', def: '"dark"', desc: "On TooltipContent and Tip." },
      { name: "arrow", type: "boolean", def: "false (Tip: true)", desc: "" },
      { name: "shortcut", type: "string", desc: "Key hint on the right, e.g. \"Ctrl S\"." },
      { name: "title", type: "ReactNode", desc: "Bold first line; content becomes the muted second line." },
      { name: "side / align / delay", type: "top|right|bottom|left / start|center|end / ms", def: "top / center", desc: "Tip only; on TooltipContent use side/align directly." },
    ],
  },
  {
    slug: "lightbox", name: "Lightbox", group: "Overlays", badge: "Mobile",
    desc: "Full screen photo viewer with swipe, arrows and a caption. For patrol photos.",
    file: "packages/ui/src/components/lightbox.tsx", importLine: 'import { Lightbox, PhotoGrid } from "@vks-kit/ui"',
    demo: () => <LightboxDemo />,
    code: `<Lightbox images={photos} index={i} onIndex={setI} onClose={() => setI(null)} />`,
    examples: [{ id: "photo-grid", title: "Photo grid", note: "Square thumbnails that open the same Lightbox on tap. cols = 2 | 3 | 4.",
      demo: () => <div className="w-full max-w-xs"><PhotoGrid cols={3} images={["--chart-1", "--chart-2", "--chart-3", "--chart-4", "--chart-5"].map((v, n) => ({ src: svg(tokenColour(v)), caption: "ຮູບ " + (n + 1) }))} /></div>,
      code: `<PhotoGrid images={photos} cols={3} />` }],
    props: [{ name: "images", type: "{ src: string; caption?: string }[]", desc: "" }, { name: "index", type: "number | null", desc: "null = closed." }, { name: "onIndex", type: "(i: number) => void", desc: "" }, { name: "onClose", type: "() => void", desc: "" }],
  },
]
