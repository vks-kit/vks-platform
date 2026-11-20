import * as React from "react"
import { Input, Textarea, Label, Select, SelectTrigger, SelectValue, SelectContent, SelectItem, Checkbox, Switch, Tabs, TabsList, TabsTrigger, TabsContent, Combobox, FilterChips, SearchBox, OtpInput, Slider, RadioGroup, RadioGroupItem, Stepper, TextInput, PhoneInput, MoneyInput, TimeInput, NumberInput, isPhoneLa, phoneLaE164,
  Button, Dialog, DialogTrigger, DialogClose, FormDialogContent, Field, FormSection, SelectHeader, Facts, FactGrid, WeekdayPicker, workDaysText,
  SettingsPage, SettingsSection, SettingsRow, SettingsValue, SettingsEditBar, SettingsSaveBar, SettingsHoldButton, SettingsTimeRange, defineSettings, toast } from "@vks-kit/ui"
import { Pencil, Lock } from "@vks-kit/ui/icons"
import { fmtKip } from "@vks-kit/core"
import type { Doc } from "./types"

const Row = ({ label, out, children }: { label: string; out: string; children: React.ReactNode }) => (
  <div className="grid min-w-0 gap-1.5"><Label>{label}</Label>{children}<code className="truncate text-xs text-muted-foreground">value = {out}</code></div>
)
function FieldsDemo() {
  const [txt, setTxt] = React.useState("")
  const [phone, setPhone] = React.useState("")
  const [money, setMoney] = React.useState<number | null>(1500000)
  const [thb, setThb] = React.useState<number | null>(null)
  const [time, setTime] = React.useState("")
  const [num, setNum] = React.useState<number | null>(3)
  const [tried, setTried] = React.useState(false)
  const bad = tried && !isPhoneLa(phone)
  return (
    <div className="grid w-full min-w-0 max-w-md grid-cols-[minmax(0,1fr)] gap-4">
      <Row label="ຊື່ / ໝາຍເຫດ (TextInput)" out={JSON.stringify(txt)}><TextInput value={txt} onChange={setTxt} maxLength={30} placeholder="ພິມຢູ່ນີ້…" /></Row>
      <Row label="ເບີໂທ (PhoneInput)" out={JSON.stringify(phone) + (phone ? " · " + (isPhoneLa(phone) ? "ຄົບ " + phoneLaE164(phone) : "ຍັງບໍ່ຄົບ") : "")}>
        <PhoneInput value={phone} onChange={(v) => { setPhone(v); setTried(false) }} onBlur={() => setTried(!!phone)} invalid={bad} />
        {bad && <span className="text-xs text-destructive">ເບີບໍ່ຄົບ: 020 XXXX XXXX</span>}
      </Row>
      <Row label="ເງິນເດືອນ (MoneyInput LAK)" out={String(money)}><MoneyInput value={money} onChange={setMoney} /></Row>
      <Row label="ລາຄາ (MoneyInput THB, 2 decimals)" out={String(thb)}><MoneyInput value={thb} onChange={setThb} currency="THB" /></Row>
      <Row label="ເວລາເຂົ້າກະ (TimeInput)" out={JSON.stringify(time)}><TimeInput value={time} onChange={setTime} /></Row>
      <Row label="ຈຳນວນ ຍາມ (NumberInput 1-20)" out={String(num)}><NumberInput value={num} onChange={setNum} min={1} max={20} unit="ຄົນ" /></Row>
    </div>
  )
}

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

function FormDialogDemo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const [name, setName] = React.useState(""), [tried, setTried] = React.useState(false)
  return (
    <Dialog>
      <DialogTrigger asChild><Button>ເພີ່ມສະຖານທີ່</Button></DialogTrigger>
      <FormDialogContent size={size} title="ເພີ່ມສະຖານທີ່" description="ຂໍ້ມູນຈະບັນທຶກເຂົ້າລະບົບ"
        footer={<><DialogClose asChild><Button variant="outline">ຍົກເລີກ</Button></DialogClose><Button onClick={() => setTried(true)}>ບັນທຶກ</Button></>}>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormSection className="sm:col-span-2">ຂໍ້ມູນທົ່ວໄປ</FormSection>
          <Field label="ຊື່ສະຖານທີ່" htmlFor="fd-name" error={tried && !name ? "ກະລຸນາໃສ່ຊື່" : undefined}><Input id="fd-name" value={name} invalid={tried && !name} onChange={(e) => setName(e.target.value)} /></Field>
          <Field label="ລະຫັດ" htmlFor="fd-id" hint="ເຊັ່ນ VKS26-001"><Input id="fd-id" placeholder="VKS26-001" /></Field>
        </div>
      </FormDialogContent>
    </Dialog>
  )
}
function GroupedSelectDemo() {
  return <div className="w-full max-w-xs"><Select><SelectTrigger><SelectValue placeholder="ເລືອກເວລາກະ" /></SelectTrigger><SelectContent>
    <div role="group" aria-label="12 ຊົ່ວໂມງ"><SelectHeader>12 ຊົ່ວໂມງ · 2</SelectHeader><SelectItem value="a">06:00–18:00</SelectItem><SelectItem value="b">18:00–06:00</SelectItem></div>
    <div role="group" aria-label="8 ຊົ່ວໂມງ"><SelectHeader>8 ຊົ່ວໂມງ · 3</SelectHeader><SelectItem value="c">06:00–14:00</SelectItem><SelectItem value="d">14:00–22:00</SelectItem><SelectItem value="e">22:00–06:00</SelectItem></div>
  </SelectContent></Select></div>
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
function BlocksDemo() {
  const [on, setOn] = React.useState(true), [range, setRange] = React.useState("22:00-06:00")
  const changed = !on || range !== "22:00-06:00"
  return <div className="w-full max-w-2xl space-y-3">
    <SettingsSection header="ແຈ້ງເຕືອນ" sub="ຂໍ້ຄວາມສັ້ນ">
      <SettingsRow label="ເປີດໃຊ້" help="ໜຶ່ງແຖວ" dirty={!on}><Switch checked={on} onCheckedChange={setOn} /></SettingsRow>
      <SettingsRow label="ເວລາ" dirty={range !== "22:00-06:00"}><SettingsTimeRange value={range} onChange={setRange} /></SettingsRow>
      <SettingsRow label="ລ້າງ" help="ກົດຄ້າງ 1.5 ວິ"><SettingsHoldButton onConfirm={() => toast("ລ້າງແລ້ວ")}>ກົດຄ້າງ ເພື່ອລຶບ</SettingsHoldButton></SettingsRow>
    </SettingsSection>
    {changed && <SettingsSaveBar count={(on ? 0 : 1) + (range !== "22:00-06:00" ? 1 : 0)} onCancel={() => { setOn(true); setRange("22:00-06:00") }} onSave={() => toast.success("ບັນທຶກແລ້ວ")} />}
  </div>
}

function ViewFirstDemo() {
  const [saved, setSaved] = React.useState("ສົມໃຈ ພົມມະຈັນ"), [name, setName] = React.useState(saved), [editing, setEditing] = React.useState(false)
  return <div className="w-full max-w-2xl">
    <SettingsSection header="ຂໍ້ມູນສ່ວນຕົວ" action={!editing && <Button variant="outline" size="sm" onClick={() => setEditing(true)}><Pencil />ແກ້ໄຂ</Button>}>
      <SettingsRow label="ຊື່">{editing ? <TextInput aria-label="ຊື່" value={name} onChange={setName} autoFocus className="w-[300px] max-w-full" /> : <SettingsValue>{saved}</SettingsValue>}</SettingsRow>
      <SettingsRow label="ລະຫັດພະນັກງານ" help={<span className="inline-flex items-center gap-1"><Lock className="size-3.5" />ປ່ຽນໄດ້ໂດຍ HR ເທົ່ານັ້ນ</span>}><SettingsValue mono>VKS-0142</SettingsValue></SettingsRow>
      {editing && <SettingsEditBar onCancel={() => { setName(saved); setEditing(false) }} onSave={() => { setSaved(name); setEditing(false); toast.success("ບັນທຶກແລ້ວ") }} disabled={!name.trim()} />}
    </SettingsSection>
  </div>
}
function WeekdayDemo() { const [m, setM] = React.useState("1111100"); return <div className="w-full max-w-sm space-y-2"><WeekdayPicker value={m} onChange={setM} /><code className="text-xs text-muted-foreground">value = "{m}" · workDaysText → {workDaysText(m)}</code></div> }
const factRows: [string, React.ReactNode][] = [["ລູກຄ້າ", "ບໍລິສັດ ລາວ ເທຣດດິ້ງ"], ["ໂທ", "020 5512 3456"], ["ໝາຍເຫດ", ""]]

export const formDocs: Doc[] = [
  {
    slug: "form-dialog", name: "Form dialog", group: "Form", badge: "New",
    desc: "The frame for every form in a popup: sticky title and footer, only the body scrolls and never sideways. sm / md / lg widths on desktop, a sheet on a phone. Field = label + control + error or hint; FormSection = a muted group title.",
    file: "packages/ui/src/components/form-dialog.tsx", importLine: 'import { FormDialogContent, Field, FormSection, FormActions, FoldSection, type FormDialogSize } from "@vks-kit/ui"',
    demo: () => <FormDialogDemo />,
    code: `<Dialog open={open} onOpenChange={setOpen}>
  <FormDialogContent size="md" title="ເພີ່ມສະຖານທີ່"
    footer={<><Button variant="outline" onClick={close}>ຍົກເລີກ</Button><Button onClick={save}>ບັນທຶກ</Button></>}>
    <div className="grid gap-4 sm:grid-cols-2">
      <FormSection className="sm:col-span-2">ຂໍ້ມູນທົ່ວໄປ</FormSection>
      <Field label="ຊື່ສະຖານທີ່" htmlFor="name" error={err.name}><Input id="name" … /></Field>
      <Field label="ລະຫັດ" htmlFor="id" hint="ເຊັ່ນ VKS26-001"><Input id="id" … /></Field>
    </div>
  </FormDialogContent>
</Dialog>`,
    examples: [{ id: "large", title: "Large (long forms)", note: "lg is 64rem wide on desktop; use a 2-column grid in the body.", demo: () => <FormDialogDemo size="lg" />, code: `<FormDialogContent size="lg" title="…" footer={…}>…</FormDialogContent>` }],
    props: [
      { name: "title / description", type: "ReactNode", desc: "Sticky header. Keep the description to one line." },
      { name: "footer", type: "ReactNode", desc: "Sticky footer, buttons right-aligned; respects the phone safe area." },
      { name: "size", type: '"sm" | "md" | "lg"', def: '"md"', desc: "Desktop width: 36 / 48 / 64 rem. A phone always gets the full-width sheet." },
      { name: "width", type: "string", desc: "0.6: any desktop width as a CSS length (\"46rem\", \"min(38rem, 60dvh)\"); the position follows, so no left formula in the app. Wins over size." },
      { name: "bodyClassName", type: "string", desc: "Extra classes on the scrolling body." },
      { name: "icon", type: "ReactNode", desc: "Optional icon tile left of the title; desktop only (hidden on phone)." },
      { name: "Field: label / htmlFor / error / hint", type: "ReactNode / string", desc: "error (red) replaces hint (muted) when set." },
    ],
    notes: ["Put it inside a Dialog, in place of DialogContent.", "Records open read-only first (Facts / FactGrid) with a ແກ້ໄຂ button; the form is the edit step.", "Run cleanText() on free text before saving.",
      "0.6: every form popup is centred top to bottom on desktop (it used to sit at a fixed top).",
      "Footer: use FormActions (primary, secondary, more). Desktop keeps one row; a phone shows the primary full width and a ⋯ ActionSheet with the rest, so five buttons never wrap into two rows.",
      "FormActions order (0.6): lead (the read action, far left) · more (rare) · secondary · primary (the daily answer, far right). phone=\"row\" shows primary + first secondary as two big buttons and lead + more as one small labelled row, for popups with 3–5 daily actions (appointment: came / no-show / reschedule / cancel / receipt).",
      "Long forms: wrap the parts not needed every time in FoldSection. On a phone they fold and their header says what is still missing; desktop shows them open.",
      "Save that cannot run yet: Button disabledReason + onBlockedPress. The button looks off but a tap says why and can scroll to the missing field, instead of doing nothing."],
  },
  {
    slug: "weekday-picker", name: "Weekday picker", group: "Form", badge: "New",
    desc: "Seven 44 px day toggles (ຈ ອ ພ ພຫ ສ ສ ອາ), Monday first. Value is a 7-char mask like \"1111100\". workDaysText turns a mask into short Lao text.",
    file: "packages/ui/src/components/weekday-picker.tsx", importLine: 'import { WeekdayPicker, workDaysText, workDaysCount, WEEKDAYS_LO, WEEKDAY_NAMES_LO } from "@vks-kit/ui"',
    demo: () => <WeekdayDemo />,
    code: `const [days, setDays] = useState("1111100")   // Mon-first, "1" = works
<WeekdayPicker value={days} onChange={setDays} />
workDaysText("1111111") // "ທຸກມື້"
workDaysText("1111110") // "ຈ–ສ (6 ມື້)"
workDaysText("1010100") // "ຈ ພ ສ"`,
    props: [
      { name: "value / onChange", type: "string / (mask: string) => void", desc: "7 chars of 0/1, Monday first. Anything else shows all days off." },
      { name: "summary", type: "boolean", def: "true", desc: "Muted line under the days: \"ຈ–ສ · 5 ມື້\"." },
      { name: "invalid / disabled", type: "boolean", desc: "" },
    ],
    notes: ["ສຸກ and ເສົາ share the initial ສ, so workDaysText only shortens the Mon–Fri and Mon–Sat runs; other sets list the initials."],
  },
  {
    slug: "settings-page", name: "Settings page", group: "Form", badge: "New",
    desc: "The one settings screen every app shares: 10 standard pages (ໂປຣໄຟລ໌, ຄວາມປອດໄພ, ແຈ້ງເຕືອນ, ການສະແດງຜົນ, ທົ່ວໄປ, ສະມາຊິກ & ສິດ, ການເຊື່ອມຕໍ່, ປະຫວັດ, ຂໍ້ມູນ, ເຂດອັນຕະລາຍ) plus one app page built only from 9 standard row types. View first: Profile and General show plain values with an ແກ້ໄຂ button per section (Edit → ບັນທຶກ / ຍົກເລີກ); preferences (toggles, matrices, display, app rows) save on their own with an Undo toast. Left nav + Ctrl K search; on a phone a grouped list that opens each page full screen. save() gets only the diff, which also feeds the audit log.",
    file: "packages/ui/src/components/settings.tsx",
    importLine: 'import { SettingsPage, SettingsSection, SettingsRow, SettingsValue, SettingsEditBar, SettingsControl, SettingsSaveBar, SettingsHoldButton, SettingsTimeRange, defineSettings, settingsDiff } from "@vks-kit/ui"',
    demo: () => <div className="w-full"><SettingsPage config={settingsDemo} showKinds commandK={false} /></div>,
    code: `const settings = defineSettings({
  core: ["profile", "security", "notifications", "display", "general", "members", "integrations", "audit", "data", "danger"],
  events: [{ id: "late", label: "ມາວຽກຊ້າ" }],            // extra rows in the notification matrix
  permissions: [{ id: "approveLeave", label: "ອະນຸມັດວັນພັກ" }], // extra rows in the role matrix
  app: [{ header: "ການກວດ", rows: [
    { key: "keepDays", type: "number", label: "ເກັບຂໍ້ມູນ", unit: "ມື້", min: 1, max: 999, default: 90 },
    { key: "hours", type: "time-range", label: "ຊ່ວງເວລາ", default: "08:00-17:00" },
  ] }],
  load: () => api.get("settings"),
  save: (diff) => api.post("settings", diff),   // [{ key: "app.keepDays", from: 90, to: 30 }]
})
<SettingsPage config={settings} />`,
    props: [
      { name: "config.core", type: "CoreSettingsPage[]", def: "all 10", desc: "Which shared pages to show. Order inside the nav groups is fixed." },
      { name: "config.app", type: "{ header, sub?, icon?, tone?, rows }[]", desc: "Row types: text, number, switch, select, segmented, time-range, days, checkbox-list, action. Keys are stored as app.<key>." },
      { name: "config.events / permissions", type: "{ id, label, default? }[]", desc: "Rows appended to the notification and role matrices (4-char masks)." },
      { name: "config.load / save", type: "() => values / (diff) => void", desc: "save receives only changed keys; throw to keep the page dirty (auto-save puts the old value back and shows an error)." },
      { name: "config.saveMode", type: '"auto" | "bar"', def: '"auto"', desc: "auto: each preference saves ~0.7 s after the last change, with Undo in the toast; rows with an error wait. bar: preferences wait in the sticky N-changes bar. Profile and General always save per section." },
      { name: "config.members / devices / integrations / audit / storage / info", type: "lists", desc: "Read-only data the shared pages show." },
      { name: "config.onAction", type: "(id, target?) => void", desc: "Buttons outside the save: security.password, members.invite, danger.reset, app.<key>…" },
      { name: "commandK", type: "boolean", def: "true", desc: "Ctrl K opens the settings search. Set false when the app shell already uses Ctrl K." },
      { name: "showKinds", type: "boolean", def: "false", desc: "Template view: row-type tags, the 'slot' badge and the add-group placeholder." },
    ],
    examples: [
      { id: "settings-view-first", title: "View first, edit on press", note: "Details show as text until ແກ້ໄຂ; only that section opens. Never show a disabled input for something people cannot change — show the text with a lock line instead.", demo: () => <ViewFirstDemo />, code: `<SettingsSection header="ຂໍ້ມູນສ່ວນຕົວ" action={!editing && <Button variant="outline" size="sm" onClick={() => setEditing(true)}><Pencil />ແກ້ໄຂ</Button>}>
  <SettingsRow label="ຊື່">{editing ? <TextInput value={name} onChange={setName} /> : <SettingsValue>{name}</SettingsValue>}</SettingsRow>
  <SettingsRow label="ລະຫັດພະນັກງານ" help={<><Lock /> ປ່ຽນໄດ້ໂດຍ HR ເທົ່ານັ້ນ</>}><SettingsValue mono>VKS-0142</SettingsValue></SettingsRow>
  {editing && <SettingsEditBar onCancel={cancel} onSave={save} />}
</SettingsSection>` },
      { id: "settings-blocks", title: "Building blocks on their own", note: "Use the parts directly when a screen only needs a few settings.", demo: () => <BlocksDemo />, code: `<SettingsSection icon={<Bell />} header="ແຈ້ງເຕືອນ" sub="ຂໍ້ຄວາມສັ້ນ">
  <SettingsRow label="ເປີດໃຊ້" help="ໜຶ່ງແຖວ" dirty={changed}><Switch checked={on} onCheckedChange={setOn} /></SettingsRow>
  <SettingsRow label="ເວລາ"><SettingsTimeRange value={range} onChange={setRange} /></SettingsRow>
</SettingsSection>
{count > 0 && <SettingsSaveBar count={count} onCancel={reset} onSave={save} />}
<SettingsHoldButton onConfirm={wipe}>ກົດຄ້າງ ເພື່ອລຶບ</SettingsHoldButton>` },
    ],
    notes: [
      "Apps only fill the app page; every other page looks and behaves the same everywhere.",
      "Layout follows the width the page gets: under 720 px (or on a phone) it switches to the grouped list.",
      "View first: details (name, phone, email, organisation, work hours) are plain text until ແກ້ໄຂ; one section edits at a time and saves only its own keys.",
      "Preferences save on their own — no Save button to forget. The toast says what changed (ເກົ່າ → ໃໝ່) and has ຍົກເລີກ to put it back; every save lands in ປະຫວັດ.",
      "Things people cannot change (employee code) are text with a 🔒 line, never a greyed-out input.",
      "The theme switch applies at once and is not part of the save.",
      "Time ranges show their length (\"9 ຊມ\", \"8 ຊມ · ຂ້າມຄືນ\"); Save is disabled while any row has an error.",
      "vks-app's @vks-app/settings (SettingsLayout, SettingRow) is the older per-app version; new screens use this one.",
    ],
  },
  {
    slug: "facts", name: "Facts", group: "Form", badge: "New",
    desc: "The read-only half of view-first. Facts = label/value rows for a narrow side panel; FactGrid = label-over-value cells in 2 columns for a record popup. Empty values show —.",
    file: "packages/ui/src/components/facts.tsx", importLine: 'import { Facts, FactGrid } from "@vks-kit/ui"',
    demo: () => <div className="grid w-full max-w-md gap-4"><Facts rows={factRows} /><FactGrid rows={[...factRows, ["ທີ່ຢູ່", "ບ້ານ ໂພນສະອາດ, ເມືອງ ສີສັດຕະນາກ, ນະຄອນຫຼວງວຽງຈັນ", true]]} /></div>,
    code: `<Facts rows={[["ລູກຄ້າ", c.name], ["ໂທ", c.phone], ["ໝາຍເຫດ", c.note]]} />
<FactGrid rows={[["ລູກຄ້າ", c.name], ["ໂທ", c.phone], ["ທີ່ຢູ່", c.address, true]]} />  // true = full width`,
    props: [
      { name: "rows (Facts)", type: "[label, value][]", desc: "" }, { name: "cols", type: '"6rem" | "8rem"', def: '"8rem"', desc: "Label column width." },
      { name: "rows (FactGrid)", type: "[label, value, wide?][]", desc: "wide spans both columns." },
    ],
  },
  {
    slug: "slider", name: "Slider", group: "Form", badge: "New",
    desc: "iOS-size 28 px thumb. While dragging the track thickens, a halo grows round the thumb, a value bubble springs up and Android phones tick on every step. Tick marks light up as the fill passes.",
    file: "packages/ui/src/components/form.tsx", importLine: 'import { Slider } from "@vks-kit/ui"',
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
    file: "packages/ui/src/components/input.tsx", importLine: 'import { Input, Textarea, Label } from "@vks-kit/ui"',
    demo: () => <div className="grid w-full max-w-sm gap-3"><div className="grid gap-1.5"><Label htmlFor="d-id">ລະຫັດພະນັກງານ</Label><Input id="d-id" placeholder="G001" /></div><div className="grid gap-1.5"><Label htmlFor="d-bad">ເບີໂທ</Label><Input id="d-bad" invalid defaultValue="020 55" /><span className="text-xs text-destructive">ເບີບໍ່ຄົບ</span></div><Textarea placeholder="ໝາຍເຫດ…" /></div>,
    code: `<Label htmlFor="id">ລະຫັດພະນັກງານ</Label>
<Input id="id" placeholder="G001" />

<Input invalid defaultValue="020 55" />   {/* red + shake */}
<Textarea placeholder="ໝາຍເຫດ…" />`,
    props: [
      { name: "invalid", type: "boolean", def: "false", desc: "Sets aria-invalid: red border and one shake." },
      { name: "...props", type: 'React.ComponentProps<"input">', desc: "Everything a normal input takes." },
    ],
    notes: ["Run cleanText() from @vks-kit/types on free text before you save it."],
  },
  {
    slug: "input-types", name: "Input types", group: "Form", badge: "New",
    desc: "The standard fields: text, phone (020 XXXX XXXX), money, time, number. Same 44 px / 16 px shell as Input, right keyboard on phones.",
    file: "packages/ui/src/components/fields.tsx", importLine: 'import { TextInput, PhoneInput, MoneyInput, TimeInput, NumberInput, isPhoneLa, phoneLaE164 } from "@vks-kit/ui"',
    demo: () => <FieldsDemo />,
    code: `const [phone, setPhone] = useState("")
<PhoneInput value={phone} onChange={setPhone} invalid={!!phone && !isPhoneLa(phone)} />   // "020 5512 3456"
phoneLaE164(phone)                                                                     // "+8562055123456"

<MoneyInput value={salary} onChange={setSalary} />                  // number | null, 1,500,000 ກີບ
<MoneyInput value={p} onChange={setP} currency="THB" max={99999} /> // 2 decimals
<TimeInput value={t} onChange={setT} step={5} />                    // "08:30", ↑↓ ± step, ຕອນນີ້
<NumberInput value={n} onChange={setN} min={1} max={20} unit="ຄົນ" />
<TextInput value={s} onChange={setS} maxLength={30} />              // clear button + counter`,
    props: [
      { name: "PhoneInput value / onChange", type: "(v: string, info: { digits; complete }) => void", desc: "Value is \"020 XXXX XXXX\" or \"\". 020 is locked; max 8 more digits. Pastes like +856 20…, 020…, 20… are cleaned." },
      { name: "MoneyInput value / onChange", type: "number | null", desc: "Commas while typing. currency: LAK (no decimals) | THB | USD (2). max clamps." },
      { name: "TimeInput value / step", type: "\"HH:mm\" | \"\"", desc: "24 h. Type 0905 → 09:05. Value is \"\" until valid. step defaults to 5 min." },
      { name: "NumberInput min / max / step / decimals / unit", type: "number | null", desc: "Clamps on blur, ↑ ↓ and − + buttons step." },
      { name: "invalid", type: "boolean", desc: "Red border + shake, like Input." },
    ],
    notes: ["Phones open the right keyboard: tel / numeric / decimal. Fonts are 16 px so iOS never zooms.", "Validate with isPhoneLa(); send phoneLaE164() to SMS / WhatsApp APIs.", "For free text, run cleanText() from @vks-kit/types before saving."],
  },
  {
    slug: "select", name: "Select", group: "Form", badge: "Stable",
    desc: "Radix Select with a 44 px trigger. For long lists or search, use Combobox.",
    file: "packages/ui/src/components/form.tsx", importLine: 'import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, SelectHeader } from "@vks-kit/ui"',
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
    examples: [{ id: "grouped", title: "Grouped with headers (SelectHeader)", note: "A sticky, non-selectable header per group. Wrap each group in role=\"group\" with an aria-label.", demo: () => <GroupedSelectDemo />, code: `<SelectContent>
  <div role="group" aria-label="12 ຊົ່ວໂມງ">
    <SelectHeader>12 ຊົ່ວໂມງ · 2</SelectHeader>
    <SelectItem value="a">06:00–18:00</SelectItem>
  </div>
</SelectContent>` }],
  },
  {
    slug: "checkbox-switch", name: "Checkbox & Switch", group: "Form", badge: "New",
    desc: "Press in and hold: the box sinks with a soft halo, the switch knob stretches into a pill. Let go: green grows out from the centre, the tick draws, the knob springs across and one ring pulses. Unticking is quicker and quiet. Both have a 44 px hit area and a tiny haptic on Android.",
    file: "packages/ui/src/components/form.tsx", importLine: 'import { Checkbox, Switch, Label } from "@vks-kit/ui"',
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
    file: "packages/ui/src/components/form.tsx", importLine: 'import { Tabs, TabsList, TabsTrigger, TabsContent } from "@vks-kit/ui"',
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
    file: "packages/ui/src/components/combobox.tsx", importLine: 'import { Combobox, type Option } from "@vks-kit/ui"',
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
    file: "packages/ui/src/components/combobox.tsx", importLine: 'import { FilterChips } from "@vks-kit/ui"',
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
    file: "packages/ui/src/components/combobox.tsx", importLine: 'import { SearchBox } from "@vks-kit/ui"',
    demo: () => <SearchDemo />, code: `<SearchBox value={q} onChange={setQ} />`,
    props: [{ name: "value", type: "string", desc: "" }, { name: "onChange", type: "(v: string) => void", desc: "" }, { name: "placeholder", type: "string", def: '"ຄົ້ນຫາ..."', desc: "" }],
  },
  {
    slug: "radio-group", name: "Radio group", group: "Form", badge: "New",
    desc: "Pick exactly one of a few options, all visible at once. 44 px rows, the dot springs in.",
    file: "packages/ui/src/components/form.tsx", importLine: 'import { RadioGroup, RadioGroupItem } from "@vks-kit/ui"',
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
    file: "packages/ui/src/components/form.tsx", importLine: 'import { Stepper } from "@vks-kit/ui"',
    demo: () => <StepperDemo />,
    code: `<Stepper value={n} onChange={setN} min={1} max={12} label="guards" />`,
    props: [{ name: "value / onChange", type: "number / (v: number) => void", desc: "" }, { name: "min / max / step", type: "number", def: "0 / 999 / 1", desc: "Buttons disable at the bounds." }, { name: "label", type: "string", desc: "aria-label for the group." }],
    notes: ["For a wide range or a precise value use Slider or an Input type=number instead."],
  },
  {
    slug: "otp-input", name: "OTP input", group: "Form", badge: "New",
    desc: "One box per digit, numeric keyboard, pastes a whole code, shakes on error.",
    file: "packages/ui/src/components/otp-input.tsx", importLine: 'import { OtpInput } from "@vks-kit/ui"',
    demo: () => <OtpDemo />,
    code: `<OtpInput value={code} onChange={setCode} onComplete={verify} error={wrong} />`,
    props: [
      { name: "length", type: "number", def: "6", desc: "" }, { name: "value", type: "string", desc: "" },
      { name: "onChange", type: "(v: string) => void", desc: "" }, { name: "onComplete", type: "(v: string) => void", desc: "Fires when every box is filled." },
      { name: "error", type: "boolean", desc: "Red + shake." }, { name: "autoFocus", type: "boolean", desc: "" },
    ],
  },
]