import * as React from "react"
import { SubmitButton, useOptimisticList, ExpandCard, Field, Input, Badge, Button, toast, applyPatches, docTitleText } from "@vks-kit/ui"
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
  { t: "06:00–18:00", site: "ທະນາຄານ BCEL", place: "ປະຕູໜ້າ", done: 2, of: 4 },
  { t: "18:00–06:00", site: "ໂຮງງານເບຍລາວ", place: "ສາງ B", done: 0, of: 6 },
]
function Expand() {
  return (
    <div className="grid w-full max-w-md grid-cols-[minmax(0,1fr)] gap-2 sm:grid-cols-2">
      {SHIFTS.map((s) => (
        <ExpandCard key={s.t} title={s.t + " · " + s.site} summary={<><b className="text-lg tabular-nums">{s.t}</b><div className="truncate text-sm text-muted-foreground">{s.site}</div><div className="mt-1 text-xs tabular-nums text-muted-foreground">{s.done} / {s.of} ຈຸດກວດ</div></>}>
          <p className="text-sm text-muted-foreground">{s.place} · {s.of} ຈຸດກວດ</p>
          <ul className="mt-3 grid gap-2">{Array.from({ length: s.of }, (_, i) => <li key={i} className="flex min-h-11 items-center justify-between rounded-lg border px-3 text-sm"><span>ຈຸດກວດ {i + 1}</span>{i < s.done ? <Badge variant="success" dot>ສຳເລັດ</Badge> : <Badge>ລໍຖ້າ</Badge>}</li>)}</ul>
        </ExpandCard>
      ))}
    </div>
  )
}

void applyPatches; void docTitleText

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
    desc: "A card that grows into its own panel and folds back into the same spot, so the eye keeps track of where it came from. Phone: a near full-screen panel; desktop: a panel over the card. Transform only, 300 ms.",
    file: "packages/ui/src/components/actions.tsx", importLine: 'import { ExpandCard } from "@vks-kit/ui"',
    demo: () => <Expand />,
    code: `<ExpandCard title={s.time + " · " + s.site} summary={<ShiftSummary s={s} />}>
  <CheckpointList s={s} />
</ExpandCard>`,
    props: [
      { name: "summary", type: "ReactNode", desc: "The closed card. The whole card is the button." },
      { name: "title", type: "ReactNode", desc: "Header of the open panel (also its accessible name)." },
      { name: "children", type: "ReactNode", desc: "Panel body; scrolls on its own." },
      { name: "open / onOpenChange", type: "boolean / (o) => void", desc: "Optional control from outside." },
    ],
    notes: ["Esc or ✕ closes and gives focus back to the card.", "Reduced motion: opens and closes without the grow.", "For a record with its own URL or a long form use Drawer."],
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
