import * as React from "react"
import { SubmitButton, useOptimisticList, ExpandCard, FadeCrop, insetClip, Field, Input, Badge, Button, toast, applyPatches, docTitleText } from "@vks-kit/ui"
import { Check, ScanLine } from "@vks-kit/ui/icons"
import type { Doc } from "./types"

const SortDemo = React.lazy(() => import("./kit080-heavy").then((m) => ({ default: m.SortDemo })))

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))

function SaveSite() {
  const [error, save] = React.useActionState(async (_: string | null, form: FormData) => {
    await wait(900)
    const name = String(form.get("name") ?? "").trim()
    if (!name) return "ໃສ່ຊື່ສະຖານທີ່ກ່ອນ"
    toast.success("ບັນທຶກ " + name + " ແລ້ວ")
    return null
  }, null)
  return (
    <form action={save} className="grid w-full max-w-sm gap-3">
      <Field label="ຊື່ສະຖານທີ່" error={error ?? undefined}><Input name="name" placeholder="ທະນາຄານ BCEL" invalid={!!error} /></Field>
      <SubmitButton pendingLabel="ກຳລັງບັນທຶກ…">ບັນທຶກ</SubmitButton>
    </form>
  )
}

type Cp = { id: string; name: string; status: "todo" | "done" }
const CPS: Cp[] = [{ id: "1", name: "ປະຕູໜ້າ", status: "done" }, { id: "2", name: "ບ່ອນຈອດລົດ B1", status: "todo" }, { id: "3", name: "ຄັງສິນຄ້າ B", status: "todo" }, { id: "4", name: "ຫຼັງຄາ", status: "todo" }]
function Scans() {
  const [saved, setSaved] = React.useState(CPS)
  const [offline, setOffline] = React.useState(false)
  const off = React.useRef(offline); off.current = offline
  const { items, mark, pending } = useOptimisticList(saved, async (cp, patch) => {
    await wait(900)
    if (off.current) throw new Error("offline")
    setSaved((l) => l.map((x) => (x.id === cp.id ? { ...x, ...patch } : x)))
  }, { failText: "ສົ່ງບໍ່ສຳເລັດ — ກັບຄືນແລ້ວ, ລອງອີກຄັ້ງ" })
  return (
    <div className="grid w-full max-w-sm gap-2">
      <label className="flex min-h-11 items-center gap-2 text-sm"><input type="checkbox" className="size-4" checked={offline} onChange={(e) => setOffline(e.target.checked)} />ຈຳລອງເນັດຫຼຸດ</label>
      {items.map((cp) => (
        <div key={cp.id} className="flex min-h-14 items-center gap-3 rounded-xl border bg-card px-3">
          <span className="min-w-0 flex-1 truncate font-semibold">{cp.name}</span>
          {cp.status === "done"
            ? <Badge variant="success" dot className={pending.includes(cp.id) ? "opacity-60" : undefined}><Check className="size-3.5" />{pending.includes(cp.id) ? "ກຳລັງສົ່ງ…" : "ສຳເລັດ"}</Badge>
            : <Button size="sm" variant="action" onClick={() => mark(cp, { status: "done" })}><ScanLine />ສະແກນ</Button>}
        </div>
      ))}
    </div>
  )
}

const SHIFTS = [
  { t: "06:00–18:00", site: "ທະນາຄານ BCEL", place: "ປະຕູໜ້າ", done: 2, of: 4, tone: "bg-primary text-primary-foreground" },
  { t: "18:00–06:00", site: "ໂຮງງານເບຍລາວ", place: "ສາງ B", done: 0, of: 6, tone: "vks-hero text-primary-foreground" },
  { t: "06:00–14:00", site: "ສູນການຄ້າ ວຽງຈັນ", place: "ບ່ອນຈອດລົດ", done: 3, of: 3, tone: "bg-success text-success-foreground" },
]
const Cover = ({ s }: { s: (typeof SHIFTS)[number] }) => <><div className="text-xl font-bold leading-snug tabular-nums">{s.t}</div><div className="text-sm leading-normal opacity-85">{s.site} · {s.done} / {s.of} ຈຸດກວດ</div></>
const Detail = ({ s }: { s: (typeof SHIFTS)[number] }) => (
  <div className="grid gap-4">
    <dl className="grid grid-cols-3 gap-2 border-b pb-4 text-sm">{[["ຈຸດ", s.place], ["ຈຸດກວດ", s.of + ""], ["ສຳເລັດ", s.done + ""]].map(([k, v]) => <div key={k}><dt className="text-xs text-muted-foreground">{k}</dt><dd className="font-semibold tabular-nums">{v}</dd></div>)}</dl>
    <Button variant="action" size="lg" className="w-full"><ScanLine />ສະແກນຈຸດກວດຖັດໄປ</Button>
    <ul className="grid gap-2">{Array.from({ length: s.of }, (_, i) => <li key={i} className="flex min-h-11 items-center justify-between rounded-lg border px-3 text-sm"><span>ຈຸດກວດ {i + 1}</span>{i < s.done ? <Badge variant="success" dot>ສຳເລັດ</Badge> : <Badge>ລໍຖ້າ</Badge>}</li>)}</ul>
  </div>
)
function Expand() {
  return (
    <div className="grid w-full max-w-sm grid-cols-[minmax(0,1fr)] gap-3">
      {SHIFTS.map((s) => <ExpandCard key={s.t} title={s.t + " · " + s.site} cover={<Cover s={s} />} coverClassName={s.tone} coverHeight={210}><Detail s={s} /></ExpandCard>)}
    </div>
  )
}
function ExpandPlain() {
  const s = SHIFTS[0]
  return <div className="w-full max-w-sm"><ExpandCard title={s.t + " · " + s.site} summary={<><b className="tabular-nums">{s.t}</b><div className="text-sm text-muted-foreground">{s.site}</div></>}><Detail s={s} /></ExpandCard></div>
}
const ROWS = [["ສົມພອນ", "06:00–18:00", "ມາວຽກ"], ["ບົວໄລ", "18:00–06:00", "ມາວຽກ"], ["ດາວເຮືອງ", "06:00–18:00", "ລາ"], ["ຄຳພັນ", "18:00–06:00", "ມາວຽກ"], ["ນ້ອຍ", "06:00–18:00", "ຂາດ"], ["ສີສະຫວັດ", "06:00–14:00", "ມາວຽກ"], ["ວິໄລ", "14:00–22:00", "ມາວຽກ"]]
function Fade({ expandable }: { expandable?: boolean }) {
  return (
    <div className="w-full max-w-md">
      <FadeCrop height={230} expandable={expandable}>
        <div className="overflow-hidden rounded-xl border bg-card">
          <div className="border-b px-4 py-3 font-semibold">ການມາວຽກ · ມື້ນີ້</div>
          {ROWS.map(([n, t, st]) => <div key={n} className="flex min-h-12 items-center gap-3 border-b px-4 last:border-0"><span className="min-w-0 flex-1 truncate font-semibold">{n}</span><span className="text-sm tabular-nums text-muted-foreground">{t}</span><Badge variant={st === "ມາວຽກ" ? "success" : st === "ລາ" ? "warning" : "danger"}>{st}</Badge></div>)}
        </div>
      </FadeCrop>
    </div>
  )
}

void applyPatches; void docTitleText; void insetClip

export const kit080Docs: Doc[] = [
  {
    slug: "submit-button", name: "Submit button (form actions)", group: "Actions", badge: "New",
    desc: "The save button of a React 19 form action: it reads useFormStatus() itself, so it spins, keeps its width and blocks a second tap while <form action> runs. No pending state of your own.",
    file: "packages/ui/src/components/actions.tsx", importLine: 'import { SubmitButton } from "@vks-kit/ui"',
    demo: () => <SaveSite />,
    code: `const [error, save] = useActionState(async (_prev, form: FormData) => {
  const res = await api.saveSite({ name: cleanText(String(form.get("name"))) })
  return res.ok ? null : res.error          // shown under the field
}, null)

<form action={save}>
  <Field label="ຊື່ສະຖານທີ່" error={error}><Input name="name" /></Field>
  <SubmitButton pendingLabel="ກຳລັງບັນທຶກ…">ບັນທຶກ</SubmitButton>
</form>`,
    props: [
      { name: "pendingLabel", type: "ReactNode", desc: "Text while the form is sending. Default: the normal label." },
      { name: "variant", type: "Button variant", def: '"action"', desc: "Same variants as Button." },
      { name: "…Button props", type: "", desc: "Everything Button takes except type and loading (it sets both)." },
    ],
    notes: ["Must sit inside the <form> it submits: useFormStatus only sees its parent form.", "For a button outside a form keep Button loading={…}."],
  },
  {
    slug: "optimistic-list", name: "Optimistic list", group: "Feedback", badge: "New",
    desc: "React 19 useOptimistic for lists: a scan shows ✓ at once, the save runs behind it, and a failure puts the row back by itself with a toast. For guards on a slow network.",
    file: "packages/ui/src/components/actions.tsx", importLine: 'import { useOptimisticList, applyPatches, type ListPatch } from "@vks-kit/ui"',
    demo: () => <Scans />,
    code: `const { items, mark, pending } = useOptimisticList(checkpoints, (cp, patch) => api.scan(cp.id, patch))

{items.map((cp) => cp.status === "done"
  ? <Badge variant="success">{pending.includes(cp.id) ? "ກຳລັງສົ່ງ…" : "ສຳເລັດ"}</Badge>
  : <Button onClick={() => mark(cp, { status: "done" })}>ສະແກນ</Button>)}`,
    props: [
      { name: "items", type: "T[] (each with id)", desc: "The saved list (from useData or state). When save resolves, update it so the optimistic copy is replaced." },
      { name: "save", type: "(item, patch) => Promise", desc: "Throw / reject to roll back." },
      { name: "failText", type: "string | false", def: '"ບັນທຶກບໍ່ສຳເລັດ, ກັບຄືນແລ້ວ"', desc: "Toast on failure; false for none." },
      { name: "returns", type: "{ items, mark(item, patch), pending: id[] }", desc: "pending = ids still sending (show them softer)." },
    ],
    notes: ["Offline work that must survive closing the app still goes through OfflineQueue + SyncStatus; this hook is the instant feedback on top.", "applyPatches is pure and unit tested."],
  },
  {
    slug: "expand-card", name: "Expand card", group: "Overlays", badge: "New",
    desc: "A card that opens into its own screen as one object (the iOS App Store card) and folds back into the same spot. With cover, the card is the foot of a coloured header that grows to full size while the body is revealed. Phone: full screen; desktop: a centred panel over a dimmed page.",
    file: "packages/ui/src/components/actions.tsx", importLine: 'import { ExpandCard, insetClip } from "@vks-kit/ui"',
    demo: () => <Expand />,
    code: `<ExpandCard title={s.time + " · " + s.site} coverClassName="bg-primary text-primary-foreground"
  cover={<><div className="text-xl font-bold tabular-nums">{s.time}</div><div className="text-sm opacity-85">{s.site}</div></>}>
  <CheckpointList s={s} />
</ExpandCard>`,
    examples: [{ id: "plain", title: "Without a cover", note: "A plain card (summary) grows into a panel whose header line is the title.", demo: () => <ExpandPlain />, code: "<ExpandCard title=\"…\" summary={<ShiftSummary s={s} />}>…</ExpandCard>" }],
    props: [
      { name: "cover", type: "ReactNode", desc: "Header of the open screen. Its foot is the closed card (no summary needed)." },
      { name: "coverClassName", type: "string", desc: "Tokens only: \"bg-primary text-primary-foreground\", \"vks-hero\", \"bg-success text-success-foreground\"." },
      { name: "coverHeight / cardHeight", type: "number", def: "220 / 132", desc: "Open header height and closed card height, px." },
      { name: "summary", type: "ReactNode", desc: "A plain closed card instead of the cover's foot." },
      { name: "title", type: "ReactNode", desc: "Accessible name; header line when there is no cover." },
      { name: "open / onOpenChange", type: "boolean / (o) => void", desc: "Optional control from outside." },
    ],
    notes: ["One element from card to screen: a clip-path grows from the card's rectangle while the content slides up, so nothing swaps and nothing jumps.", "Esc, ✕ or the dimmed page close it; focus goes back to the card. Reduced motion: opens and closes at once.", "The page behind does not scroll while it is open. For a record with its own URL or a long form use Drawer."],
  },
  {
    slug: "fade-crop", name: "Fade crop", group: "Layout & navigation", badge: "New",
    desc: "Show the top of something long and let its foot fade out instead of cutting it at a random line. A mask, so it fades into any background in both themes. expandable adds one ເບິ່ງທັງໝົດ button.",
    file: "packages/ui/src/components/fade-crop.tsx", importLine: 'import { FadeCrop } from "@vks-kit/ui"',
    demo: () => <Fade />,
    code: `<FadeCrop height={230} expandable>
  <AttendanceList rows={today} />
</FadeCrop>`,
    examples: [{ id: "expandable", title: "With ເບິ່ງທັງໝົດ", note: "The button sits on the fade; open, the whole list shows and the button becomes ຫຍໍ້.", demo: () => <Fade expandable />, code: "<FadeCrop height={230} expandable>…</FadeCrop>" }],
    props: [
      { name: "height", type: "number | string", def: "280", desc: "Visible part." },
      { name: "fadeFrom / fadeTo", type: "number (%)", def: "58 / 96", desc: "Where the fade starts and ends." },
      { name: "expandable", type: "boolean", desc: "Adds ເບິ່ງທັງໝົດ / ຫຍໍ້." },
      { name: "moreLabel / lessLabel", type: "string", desc: "" },
      { name: "open / onOpenChange", type: "boolean / (o) => void", desc: "" },
    ],
    notes: ["Keep the real rows in the top half; let the fade fall on older rows or filler.", "Only the foot fades; top and sides stay sharp so it still reads as a placed block."],
  },
  {
    slug: "sortable-list", name: "Sortable list", group: "Heavy (lazy)", badge: "Lazy",
    desc: "Put a short list in order: drag a row by its grip and the others move aside; keyboard = Space + arrows; on a phone each row also has ↑ ↓ buttons. Ships in @vks-kit/ui/kanban (same drag library).",
    file: "packages/ui/src/heavy/kanban.tsx", importLine: 'import { SortableList, moveItem } from "@vks-kit/ui/kanban"',
    demo: () => <React.Suspense fallback={null}><SortDemo /></React.Suspense>,
    code: `const [points, setPoints] = useState(round.points)
<SortableList items={points} getId={(p) => p.id} onChange={setPoints}
  render={(p, i) => <><b>{i + 1}. {p.name}</b><div className="text-xs text-muted-foreground">{p.code}</div></>} />`,
    props: [
      { name: "items / getId", type: "T[] / (item) => string", desc: "" },
      { name: "onChange", type: "(items: T[]) => void", desc: "The whole list in its new order." },
      { name: "render", type: "(item, index) => ReactNode", desc: "Row content beside the grip." },
      { name: "moveLabel", type: "(index) => string", def: '"ລາກເພື່ອຍ້າຍ ລຳດັບທີ N"', desc: "Spoken label of the grip." },
      { name: "disabled", type: "boolean", desc: "Read-only order." },
    ],
    notes: ["moveItem(list, from, to) is pure and unit tested.", "Rows are 56 px with 44 px grips and arrow buttons."],
  },
]