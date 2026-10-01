import * as React from "react"
import { Input, Textarea, Label, Select, SelectTrigger, SelectValue, SelectContent, SelectItem, Checkbox, Switch, Tabs, TabsList, TabsTrigger, TabsContent, Combobox, FilterChips, SearchBox, OtpInput, Slider, RadioGroup, RadioGroupItem, Stepper } from "@vks/ui"
import { fmtKip } from "@vks/core"
import type { Doc } from "./types"

const sites = [{ value: "a", label: "ປະຕູໜ້າ", hint: "A-01" }, { value: "b", label: "ບ່ອນຈອດລົດ", hint: "A-02" }, { value: "c", label: "ຄັງສິນຄ້າ", hint: "B-01" }, { value: "d", label: "ຫ້ອງຄວບຄຸມ", hint: "B-02" }]

function RadioDemo() { const [v, setV] = React.useState("day"); return <RadioGroup value={v} onValueChange={setV}><RadioGroupItem value="day">ກະກາງເວັນ</RadioGroupItem><RadioGroupItem value="night">ກະກາງຄືນ</RadioGroupItem><RadioGroupItem value="off" disabled>ພັກ (ປິດ)</RadioGroupItem></RadioGroup> }
function StepperDemo() { const [n, setN] = React.useState(4); return <div className="flex items-center gap-3"><Stepper value={n} onChange={setN} min={1} max={12} label="guards" /><span className="text-sm text-muted-foreground">ຄົນ / ກະ</span></div> }
function ComboDemo({ multiple }: { multiple?: boolean }) {
  const [v, setV] = React.useState<string[]>(multiple ? ["a", "c"] : [])
  return <div className="w-full max-w-xs"><Combobox options={sites} value={v} onChange={setV} multiple={multiple} /></div>
}
function ChipsDemo() {
  const [v, setV] = React.useState(["all"])
  return <FilterChips options={[{ value: "all", label: "ທັງໝົດ" }, { value: "ok", label: "ສຳເລັດ" }, { value: "late", label: "ຊ້າ" }, { value: "miss", label: "ພາດ" }]} value={v} onChange={setV} />
}
function SearchDemo() { const [q, setQ] = React.useState(""); return <div className="w-full max-w-xs"><SearchBox value={q} onChange={setQ} /></div> }
function OtpDemo() {
  const [v, setV] = React.useState(""), [err, setErr] = React.useState(false)
  return <div className="space-y-2 text-center"><OtpInput value={v} onChange={(x) => { setV(x); setErr(false) }} onComplete={(x) => setErr(x !== "123456")} error={err} /><p className="text-xs text-muted-foreground">Try 123456 (anything else shakes)</p></div>
}

function SliderDemo() {
  const [v, setV] = React.useState([40])
  return <div className="w-full max-w-sm space-y-2 pt-8"><Slider value={v} onValueChange={setV} aria-label="ລະດັບສຽງ" format={(x) => x + "%"} /><p className="text-center text-xs text-muted-foreground">Drag: the bubble springs up, the halo grows, the track thickens</p></div>
}
function SliderKip() {
  const [v, setV] = React.useState([1500000])
  return <div className="w-full max-w-sm space-y-3"><div className="flex justify-between text-sm"><span className="text-muted-foreground">ເງິນເດືອນ</span><b key={v[0]} className="vks-pop tabular-nums">{fmtKip(v[0])}</b></div>
    <Slider value={v} onValueChange={setV} min={0} max={5000000} step={250000} ticks={5} tone="gold" format={(x) => fmtKip(x)} aria-label="ເງິນເດືອນ" /></div>
}
function SliderRange() {
  const [v, setV] = React.useState([8, 17])
  return <div className="w-full max-w-sm pt-10"><Slider value={v} onValueChange={setV} min={0} max={24} step={1} ticks={true} showValue="always" tone="primary" format={(x) => String(x).padStart(2, "0") + ":00"} aria-label="ກະ" minStepsBetweenThumbs={1} /></div>
}

export const formDocs: Doc[] = [
  {
    slug: "slider", name: "Slider", group: "Form", badge: "New",
    desc: "iOS-size 28 px thumb. While dragging the track thickens, a halo grows round the thumb, a value bubble springs up and Android phones tick on every step. Tick marks light up as the fill passes.",
    file: "packages/ui/src/components/form.tsx", importLine: 'import { Slider } from "@vks/ui"',
    demo: () => <SliderDemo />,
    code: `const [v, setV] = useState([40])
<Slider value={v} onValueChange={setV} format={(x) => x + "%"} aria-label="ລະດັບສຽງ" />`,
    examples: [
      { id: "kip", title: "Money with steps and ticks", note: "Gold tone, 250,000 ກີບ steps, 5 marks. The label above pops on every change.", demo: () => <SliderKip />, code: `<Slider value={v} onValueChange={setV} min={0} max={5000000} step={250000}
  ticks={5} tone="gold" format={fmtKip} aria-label="ເງິນເດືອນ" />` },
      { id: "range", title: "Range, bubbles always shown", note: "Two thumbs = a range (shift hours). Tick at every step.", demo: () => <SliderRange />, code: `<Slider value={[8, 17]} min={0} max={24} ticks showValue="always"
  format={(h) => h + ":00"} minStepsBetweenThumbs={1} />` },
    ],
    props: [
      { name: "value / defaultValue / onValueChange", type: "number[]", desc: "One number = one thumb, two = a range." },
      { name: "min / max / step", type: "number", def: "0 / 100 / 1", desc: "" },
      { name: "format", type: "(v) => ReactNode", def: "String", desc: "Text in the bubble; also used as aria-valuetext." },
      { name: "showValue", type: '"drag" | "always" | false', def: '"drag"', desc: "Bubble only while held / focused, pinned, or never." },
      { name: "ticks", type: "boolean | number", desc: "true = every step (max 21), number = that many marks." },
      { name: "tone", type: '"success" | "gold" | "primary"', def: '"success"', desc: "Fill, bubble and halo colour." },
      { name: "haptic", type: "boolean", def: "true", desc: "4 ms buzz per step (throttled to 35 ms)." },
    ],
    notes: ["Keyboard: arrows move one step, PageUp/PageDown ten, Home/End jump. The bubble shows on keyboard focus too.", "Always give aria-label: the thumb has no visible label of its own."],
  },
  {
    slug: "input", name: "Input & Textarea", group: "Form", badge: "Stable",
    desc: "44 px tall, 16 px text (iOS never zooms), red border + shake when invalid.",
    file: "packages/ui/src/components/input.tsx", importLine: 'import { Input, Textarea, Label } from "@vks/ui"',
    demo: () => <div className="grid w-full max-w-sm gap-3"><div className="grid gap-1.5"><Label htmlFor="d-id">ລະຫັດພະນັກງານ</Label><Input id="d-id" placeholder="G001" /></div><div className="grid gap-1.5"><Label htmlFor="d-bad">ເບີໂທ</Label><Input id="d-bad" invalid defaultValue="020 55" /><span className="text-xs text-destructive">ເບີບໍ່ຄົບ</span></div><Textarea placeholder="ໝາຍເຫດ…" /></div>,
    code: `<Label htmlFor="id">ລະຫັດພະນັກງານ</Label>
<Input id="id" placeholder="G001" />

<Input invalid defaultValue="020 55" />   {/* red + shake */}
<Textarea placeholder="ໝາຍເຫດ…" />`,
    props: [
      { name: "invalid", type: "boolean", def: "false", desc: "Sets aria-invalid: red border and one shake." },
      { name: "...props", type: 'React.ComponentProps<"input">', desc: "Everything a normal input takes." },
    ],
    notes: ["Run cleanText() from @vks/types on free text before you save it."],
  },
  {
    slug: "select", name: "Select", group: "Form", badge: "Stable",
    desc: "Radix Select with a 44 px trigger. For long lists or search, use Combobox.",
    file: "packages/ui/src/components/form.tsx", importLine: 'import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@vks/ui"',
    demo: () => <div className="w-full max-w-xs"><Select><SelectTrigger><SelectValue placeholder="ເລືອກຈຸດ…" /></SelectTrigger><SelectContent>{sites.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}</SelectContent></Select></div>,
    code: `<Select onValueChange={setSite}>
  <SelectTrigger><SelectValue placeholder="ເລືອກຈຸດ…" /></SelectTrigger>
  <SelectContent>
    <SelectItem value="a">ປະຕູໜ້າ</SelectItem>
    <SelectItem value="b">ບ່ອນຈອດລົດ</SelectItem>
  </SelectContent>
</Select>`,
    props: [
      { name: "value / onValueChange", type: "string / (v: string) => void", desc: "Controlled mode (Radix Select.Root)." },
      { name: "defaultValue", type: "string", desc: "Uncontrolled start value." },
    ],
  },
  {
    slug: "checkbox-switch", name: "Checkbox & Switch", group: "Form", badge: "New",
    desc: "Press in and hold: the box sinks with a soft halo, the switch knob stretches into a pill. Let go: green grows out from the centre, the tick draws, the knob springs across and one ring pulses. Unticking is quicker and quiet. Both have a 44 px hit area and a tiny haptic on Android.",
    file: "packages/ui/src/components/form.tsx", importLine: 'import { Checkbox, Switch, Label } from "@vks/ui"',
    demo: () => <div className="grid gap-3"><label className="flex items-center gap-3"><Checkbox defaultChecked />ມີຮູບປະກອບ</label><label className="flex items-center gap-3"><Switch defaultChecked />ແຈ້ງເຕືອນ</label></div>,
    code: `<label className="flex items-center gap-3"><Checkbox defaultChecked />ມີຮູບປະກອບ</label>
<label className="flex items-center gap-3"><Switch defaultChecked />ແຈ້ງເຕືອນ</label>`,
    props: [
      { name: "checked / onCheckedChange", type: "boolean / (v) => void", desc: "Radix props. Checkbox also takes checked=\"indeterminate\"." },
      { name: "haptic", type: "boolean", def: "true", desc: "8 ms vibration on toggle (Android only)." },
    ],
    notes: ["Wrap them in a <label>: pressing the label text runs the same press-in animation and dims the text.", "Transform + opacity only, ≤ 460 ms. Lite mode drops the halo, ring and glow; reduced motion snaps."],
  },
  {
    slug: "tabs", name: "Tabs", group: "Form", badge: "Stable",
    desc: "Segmented tabs. Keep to 2-4 on a phone.",
    file: "packages/ui/src/components/form.tsx", importLine: 'import { Tabs, TabsList, TabsTrigger, TabsContent } from "@vks/ui"',
    demo: () => <Tabs defaultValue="a" className="w-full max-w-sm"><TabsList><TabsTrigger value="a">ວັນນີ້</TabsTrigger><TabsTrigger value="b">ອາທິດນີ້</TabsTrigger><TabsTrigger value="c">ເດືອນນີ້</TabsTrigger></TabsList><TabsContent value="a" className="p-3">ສະແກນ 42 ຈຸດ</TabsContent><TabsContent value="b" className="p-3">ສະແກນ 290 ຈຸດ</TabsContent><TabsContent value="c" className="p-3">ສະແກນ 1,204 ຈຸດ</TabsContent></Tabs>,
    code: `<Tabs defaultValue="a">
  <TabsList>
    <TabsTrigger value="a">ວັນນີ້</TabsTrigger>
    <TabsTrigger value="b">ອາທິດນີ້</TabsTrigger>
  </TabsList>
  <TabsContent value="a">…</TabsContent>
  <TabsContent value="b">…</TabsContent>
</Tabs>`,
  },
  {
    slug: "combobox", name: "Combobox", group: "Form", badge: "New",
    desc: "Searchable picker. Bottom sheet on a phone, popover on desktop; inside a Dialog on a phone it pushes a view in the same sheet. Single or multi.",
    file: "packages/ui/src/components/combobox.tsx", importLine: 'import { Combobox, type Option } from "@vks/ui"',
    demo: () => <ComboDemo />,
    code: `const [v, setV] = useState<string[]>([])
<Combobox options={sites} value={v} onChange={setV} />`,
    examples: [{ id: "multi", title: "Multiple", demo: () => <ComboDemo multiple />, code: `<Combobox multiple options={sites} value={v} onChange={setV} />` }],
    props: [
      { name: "options", type: "{ value: string; label: string; hint?: string }[]", desc: "hint shows on the right (a code, a count)." },
      { name: "value", type: "string[]", desc: "Always an array, even in single mode." },
      { name: "onChange", type: "(v: string[]) => void", desc: "" },
      { name: "multiple", type: "boolean", def: "false", desc: "" },
      { name: "placeholder", type: "string", def: '"ເລືອກ..."', desc: "" },
      { name: "searchable", type: "boolean", def: "true", desc: "Search matches Lao after normalizeLao()." },
    ],
  },
  {
    slug: "filter-chips", name: "Filter chips", group: "Form", badge: "New",
    desc: "Scrollable one-row chips for filtering lists. Better than a dropdown on a phone.",
    file: "packages/ui/src/components/combobox.tsx", importLine: 'import { FilterChips } from "@vks/ui"',
    demo: () => <ChipsDemo />,
    code: `<FilterChips options={[{ value: "all", label: "ທັງໝົດ" }, { value: "late", label: "ຊ້າ" }]} value={v} onChange={setV} />`,
    props: [
      { name: "options", type: "Option[]", desc: "" }, { name: "value", type: "string[]", desc: "" },
      { name: "onChange", type: "(v: string[]) => void", desc: "" }, { name: "multiple", type: "boolean", def: "false", desc: "" },
    ],
  },
  {
    slug: "search-box", name: "Search box", group: "Form", badge: "New",
    desc: "Input with a search icon and a clear button.",
    file: "packages/ui/src/components/combobox.tsx", importLine: 'import { SearchBox } from "@vks/ui"',
    demo: () => <SearchDemo />, code: `<SearchBox value={q} onChange={setQ} />`,
    props: [{ name: "value", type: "string", desc: "" }, { name: "onChange", type: "(v: string) => void", desc: "" }, { name: "placeholder", type: "string", def: '"ຄົ້ນຫາ..."', desc: "" }],
  },
  {
    slug: "radio-group", name: "Radio group", group: "Form", badge: "New",
    desc: "Pick exactly one of a few options, all visible at once. 44 px rows, the dot springs in.",
    file: "packages/ui/src/components/form.tsx", importLine: 'import { RadioGroup, RadioGroupItem } from "@vks/ui"',
    demo: () => <RadioDemo />,
    code: `<RadioGroup value={v} onValueChange={setV}>
  <RadioGroupItem value="day">ກະກາງເວັນ</RadioGroupItem>
  <RadioGroupItem value="night">ກະກາງຄືນ</RadioGroupItem>
</RadioGroup>`,
    props: [{ name: "value / onValueChange", type: "string / (v: string) => void", desc: "Radix RadioGroup props." }, { name: "disabled", type: "boolean", desc: "On an item: greys that row." }],
    notes: ["More than ~5 options: use Select or Combobox. 2-3 short options in a row: ToggleGroup variant=\"segmented\"."],
  },
  {
    slug: "stepper", name: "Stepper", group: "Form", badge: "New",
    desc: "− / + number control for small counts (qty, guards per shift). The digit rolls up or down.",
    file: "packages/ui/src/components/form.tsx", importLine: 'import { Stepper } from "@vks/ui"',
    demo: () => <StepperDemo />,
    code: `<Stepper value={n} onChange={setN} min={1} max={12} label="guards" />`,
    props: [{ name: "value / onChange", type: "number / (v: number) => void", desc: "" }, { name: "min / max / step", type: "number", def: "0 / 999 / 1", desc: "Buttons disable at the bounds." }, { name: "label", type: "string", desc: "aria-label for the group." }],
    notes: ["For a wide range or a precise value use Slider or an Input type=number instead."],
  },
  {
    slug: "otp-input", name: "OTP input", group: "Form", badge: "New",
    desc: "One box per digit, numeric keyboard, pastes a whole code, shakes on error.",
    file: "packages/ui/src/components/otp-input.tsx", importLine: 'import { OtpInput } from "@vks/ui"',
    demo: () => <OtpDemo />,
    code: `<OtpInput value={code} onChange={setCode} onComplete={verify} error={wrong} />`,
    props: [
      { name: "length", type: "number", def: "6", desc: "" }, { name: "value", type: "string", desc: "" },
      { name: "onChange", type: "(v: string) => void", desc: "" }, { name: "onComplete", type: "(v: string) => void", desc: "Fires when every box is filled." },
      { name: "error", type: "boolean", desc: "Red + shake." }, { name: "autoFocus", type: "boolean", desc: "" },
    ],
  },
]
