import * as React from "react"
import { Share2, Pencil, Trash2, Heart, FileDown } from "@vks/ui/icons"
import { SearchBar, Carousel, useProgressHUD, SnapSheet, IndexedList, BottomToolbar, useLongPress, useShareSheet, ShareSheet, Button, Card, CardContent, Badge, toast } from "@vks/ui"
import type { Doc } from "./types"
import { useT } from "./kit"

const people = ["ສົມຊາຍ", "ນາງບົວ", "ທ້າວດາວ", "ເພັດ", "ແກ້ວ", "ບຸນມີ", "ຄຳພອນ", "ວັນນາ", "ອານົງ", "ສີໄພ", "ຈັນທະລາ", "ໄຊຍະ", "ດວງດີ", "ພອນສະຫວັນ", "Anna", "7-Eleven"].map((l, i) => ({ id: String(i), label: l, sub: "G" + String(i + 1).padStart(3, "0") }))
function SearchDemo() {
  const [q, setQ] = React.useState(""), t = useT()
  const hits = people.filter((p) => p.label.toLowerCase().includes(q.toLowerCase()))
  return <div className="w-full space-y-2 max-sm:px-4 sm:max-w-sm"><SearchBar value={q} onChange={setQ} /><p className="px-1 text-sm leading-normal text-muted-foreground">{hits.length} {t("ຄົນ", "people")}{q && " · " + hits.slice(0, 3).map((h) => h.label).join(", ")}</p></div>
}
function CarouselDemo() {
  return <div className="w-full max-sm:pl-4"><Carousel>{["ປະຕູໜ້າ", "ບ່ອນຈອດລົດ", "ຄັງສິນຄ້າ", "ຫ້ອງການ", "ສາງ B"].map((s, i) => (
    <Card key={s} className="h-36"><CardContent className="flex h-full flex-col justify-between p-4"><Badge className="self-start" variant={i === 2 ? "warning" : "success"}>{i === 2 ? "ລໍຖ້າ" : "ປົກກະຕິ"}</Badge><div><p className="text-sm text-muted-foreground">ຈຸດ {i + 1}</p><b className="text-lg">{s}</b></div></CardContent></Card>))}</Carousel></div>
}
function HudDemo() {
  const { hud, run } = useProgressHUD(), t = useT()
  return <>
    <Button variant="outline" onClick={() => run(new Promise((r) => setTimeout(r, 1200)), { loading: "ກຳລັງສົ່ງ…", success: "ສົ່ງແລ້ວ" })}>{t("ສົ່ງ (ສຳເລັດ)", "Send (ok)")}</Button>
    <Button variant="outline" onClick={() => run(new Promise((_, j) => setTimeout(() => j(new Error("x")), 1000)), { loading: "ກຳລັງສົ່ງ…", error: "ບໍ່ສຳເລັດ" }).catch(() => {})}>{t("ສົ່ງ (ບໍ່ສຳເລັດ)", "Send (fail)")}</Button>
    {hud}</>
}
function SnapDemo() {
  const [o, setO] = React.useState(false), t = useT()
  return <><Button variant="outline" onClick={() => setO(true)}>{t("ເປີດ snap sheet", "Open snap sheet")}</Button>
    <SnapSheet open={o} onOpenChange={setO} title="ລາຍລະອຽດຈຸດ">
      <div className="space-y-2 pb-2">{["ປະຕູໜ້າ · 08:12", "ບ່ອນຈອດລົດ · 08:41", "ຄັງສິນຄ້າ · ລໍຖ້າ", "ຫ້ອງການ · 09:05", "ສາງ B · 09:30", "ປະຕູຫຼັງ · 10:02"].map((s) => <div key={s} className="flex min-h-14 items-center rounded-2xl border bg-card p-3 text-sm font-bold leading-normal">{s}</div>)}</div>
    </SnapSheet></>
}
function IndexDemo() {
  return <div className="w-full overflow-hidden bg-card max-sm:h-dvh sm:max-w-sm sm:rounded-2xl sm:border"><IndexedList items={people} className="h-80 max-sm:h-full" onSelect={(p) => toast(p.label)} /></div>
}
function ToolbarDemo() {
  const t = useT()
  return <div className="w-full overflow-hidden sm:max-w-sm sm:rounded-2xl sm:border"><div className="h-28 bg-muted/40" />
    <BottomToolbar items={[{ id: "s", icon: <Share2 />, label: "ແບ່ງປັນ", onPress: () => toast(t("ແບ່ງປັນ", "Share")) }, { id: "e", icon: <Pencil />, label: "ແກ້ໄຂ" }, { id: "f", icon: <Heart />, label: "ມັກ" }, { id: "d", icon: <Trash2 />, label: "ລຶບ", destructive: true, onPress: () => toast.error("ລຶບ") }]} /></div>
}
function LongPressDemo() {
  const [n, setN] = React.useState(0), t = useT()
  const p = useLongPress(() => setN((x) => x + 1), { onPress: () => toast(t("ກົດຄ້າງໄວ້ 0.5 ວິ", "Hold for 0.5 s")) })
  return <Button variant="outline" {...p}>{t("ກົດຄ້າງ", "Hold")} · {n}</Button>
}
function ShareDemo() {
  const { share, sheetProps } = useShareSheet(), t = useT()
  return <><Button onClick={() => share({ title: "ລາຍງານ QC ມື້ນີ້", url: "https://vks.la/r/qc-2026" })}><Share2 />ແບ່ງປັນ</Button>
    <Button variant="outline" onClick={() => share({ title: "ລາຍງານ QC ມື້ນີ້", url: "https://vks.la/r/qc-2026" }, { forceSheet: true })}>{t("ບັງຄັບເປີດ sheet", "Force sheet")}</Button>
    <ShareSheet {...sheetProps} targets={[{ id: "pdf", label: "PDF", icon: <FileDown />, onPress: () => toast("PDF") }]} /></>
}

const imp = (x: string) => "import { " + x + " } from \"@vks/ui\""
const F = "packages/ui/src/components/mobile-kit.tsx"
export const mobile2Docs: Doc[] = [
  { slug: "search-bar", bleed: true, name: "Search bar", group: "Mobile & touch", badge: "Mobile", desc: "iOS search pill: clear button while typing, Cancel slides in on focus.", file: F, importLine: imp("SearchBar"), demo: SearchDemo,
    code: "<SearchBar value={q} onChange={setQ} onSubmit={go} />",
    props: [{ name: "value / onChange", type: "string", desc: "Controlled." }, { name: "onCancel", type: "() => void", desc: "Called after Cancel clears + blurs." }, { name: "cancelLabel", type: "string", def: '"ຍົກເລີກ"', desc: "" }],
    notes: ["Phone lists. On desktop filter bars use SearchBox."] },
  { slug: "carousel", bleed: true, name: "Carousel", group: "Mobile & touch", badge: "New", desc: "CSS scroll-snap cards with the next one peeking. Dots on phone, arrows on desktop. No JS animation.", file: F, importLine: imp("Carousel"), demo: CarouselDemo,
    code: "<Carousel>{sites.map((s) => <SiteCard key={s.id} {...s} />)}</Carousel>",
    props: [{ name: "slideClassName", type: "string", def: '"w-[86%] md:w-[calc((100%-1.5rem)/3)]"', desc: "Slide width; 86% on phone shows a peek of the next card." }, { name: "dots", type: "boolean", def: "true", desc: "" }],
    notes: ["Swipe is native scrolling, so it is cheap on Android.", "Arrow keys work when focused."] },
  { slug: "progress-hud", name: "Progress HUD", group: "Feedback", badge: "Mobile", desc: "Centred dark square: spinner → tick or cross. Blocks taps while a save runs.", file: F, importLine: imp("useProgressHUD, ProgressHUD"), demo: HudDemo,
    code: "const { hud, run } = useProgressHUD()\nawait run(api.submit(report), { loading: \"ກຳລັງສົ່ງ…\", success: \"ສົ່ງແລ້ວ\", error: \"ບໍ່ສຳເລັດ\" })\nreturn <>{…}{hud}</>",
    notes: ["Use for short blocking work (< 5 s) like submit. For background work use a toast.", "run() rethrows on error so your code can still handle it."] },
  { slug: "snap-sheet", name: "Snap sheet", group: "Overlays", badge: "Mobile", desc: "Maps-style bottom sheet with detents (half / full). Drag the grabber; flick down to close.", file: F, importLine: imp("SnapSheet"), demo: SnapDemo,
    code: "<SnapSheet open={o} onOpenChange={setO} snaps={[0.45, 0.92]} title=\"ລາຍລະອຽດ\">…</SnapSheet>",
    props: [{ name: "snaps", type: "number[]", def: "[0.45, 0.92]", desc: "Heights as a fraction of the screen." }, { name: "modal", type: "boolean", def: "true", desc: "false = no scrim, page stays usable (over a map)." }] },
  { slug: "indexed-list", bleed: true, name: "Indexed list", group: "Mobile & touch", badge: "Mobile", desc: "Contacts-style list with sticky letters and a scrub rail. Lao lead vowels sort correctly (ເພັດ under ພ).", file: F, importLine: imp("IndexedList, groupByIndex, indexKey"), demo: IndexDemo,
    code: "<IndexedList items={staff.map((s) => ({ id: s.id, label: s.name, sub: s.code }))} onSelect={open} className=\"h-[70dvh]\" />",
    notes: ["Slide a finger along the rail: big letter bubble + haptic tick.", "groupByIndex() is pure and unit tested."] },
  { slug: "bottom-toolbar", bleed: true, name: "Bottom toolbar", group: "Layout & navigation", badge: "Mobile", desc: "Frosted row of actions for the current screen. Actions, not places (that is BottomNav).", file: F, importLine: imp("BottomToolbar"), demo: ToolbarDemo,
    code: "<BottomToolbar fixed items={[{ id: \"share\", icon: <Share2 />, label: \"ແບ່ງປັນ\", onPress: share }, { id: \"del\", icon: <Trash2 />, label: \"ລຶບ\", destructive: true }]} />" },
  { slug: "long-press", name: "Long press", group: "Mobile & touch", badge: "Mobile", desc: "Hold-to-act hook. Cancels if the finger moves, so it never fights scrolling.", file: F, importLine: imp("useLongPress"), demo: LongPressDemo,
    code: "const press = useLongPress(openMenu, { ms: 500, onPress: open })\n<div {...press}>…</div>" },
  { slug: "share-sheet", name: "Share sheet", group: "Overlays", badge: "New", desc: "Native OS share on phones; an iOS-style sheet (WhatsApp, LINE, Telegram, Facebook, copy link) on desktop.", file: F, importLine: imp("useShareSheet, ShareSheet"), demo: ShareDemo,
    code: "const { share, sheetProps } = useShareSheet()\n<Button onClick={() => share({ title, url })}>ແບ່ງປັນ</Button>\n<ShareSheet {...sheetProps} targets={[pdfTarget]} />" },
]