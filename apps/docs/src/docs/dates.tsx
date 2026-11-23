import * as React from "react"
import { Calendar, DateWheel, DatePicker, DateRangePicker, RangeCalendar, TimePicker, TimeRangePicker, Card, CardContent, type Range, formatRange } from "@vks-kit/ui"
import type { Doc } from "./types"

function DP() { const [d, setD] = React.useState("2026-09-30"); return <div className="w-full max-w-xs"><DatePicker value={d} onChange={setD} /></div> }
function Cal() { const [d, setD] = React.useState("2026-09-30"); return <Card className="w-fit"><CardContent className="pt-5"><Calendar value={d} onChange={setD} marked={["2026-09-12", "2026-09-20"]} /></CardContent></Card> }
function Wheel() { const [d, setD] = React.useState("2026-09-30"); return <div className="w-full max-w-xs space-y-2"><DateWheel value={d} onChange={setD} /><p className="text-center text-sm text-muted-foreground">{d}</p></div> }
function DRP({ lang }: { lang?: "lo" | "en" }) { const [r, setR] = React.useState<Range>({ from: "2026-09-10", to: "2026-09-16" }); return <div className="w-full max-w-sm"><DateRangePicker value={r} onChange={setR} lang={lang} /></div> }
function RC() { const [r, setR] = React.useState<Range>({ from: "2026-09-10", to: "2026-09-16" }); return <div className="space-y-2"><Card className="w-fit"><CardContent className="pt-5"><RangeCalendar value={r} onChange={setR} months={2} /></CardContent></Card><p className="text-center text-sm text-muted-foreground">{formatRange(r) || "—"}</p></div> }
function TP() { const [t, setT] = React.useState("09:30"); return <div className="w-full max-w-xs"><TimePicker value={t} onChange={setT} /></div> }
function TRP({ s0 = "06:00", e0 = "18:00", presets }: { s0?: string; e0?: string; presets?: number[] }) { const [v, setV] = React.useState({ s: s0, e: e0 }); return <div className="w-full max-w-sm"><TimeRangePicker starts={v.s} ends={v.e} presets={presets} onChange={(s, e) => setV({ s, e })} /></div> }

export const dateDocs: Doc[] = [
  {
    slug: "date-picker", name: "Date picker", group: "Dates", badge: "Stable",
    desc: "Lao month names, Monday first. Bottom sheet with a wheel on a phone, calendar popover on desktop.",
    file: "packages/ui/src/components/date-picker.tsx", importLine: 'import { DatePicker, Calendar, DateWheel } from "@vks-kit/ui"',
    demo: () => <DP />,
    code: `const [d, setD] = useState("2026-09-30")   // ISO yyyy-mm-dd, always
<DatePicker value={d} onChange={setD} min="2026-01-01" />`,
    examples: [
      { id: "calendar", title: "Calendar only", note: "marked puts a gold dot under a day (events, rest days).", demo: () => <Cal />, code: `<Calendar value={d} onChange={setD} marked={["2026-09-12", "2026-09-20"]} />` },
      { id: "wheel", title: "Wheel only", note: "Thumb-friendly. The phone variant of the picker uses this.", demo: () => <Wheel />, code: `<DateWheel value={d} onChange={setD} />` },
    ],
    props: [
      { name: "value", type: "string", desc: "ISO date yyyy-mm-dd." }, { name: "onChange", type: "(iso: string) => void", desc: "" },
      { name: "min / max", type: "string", desc: "ISO bounds; days outside are disabled." },
      { name: "placeholder", type: "string", def: '"ເລືອກວັນທີ"', desc: "" }, { name: "id", type: "string", desc: "Pair with a Label." },
    ],
  },
  {
    slug: "date-range-picker", name: "Date range picker", group: "Dates", badge: "New",
    desc: "Report ranges with presets (today, last 7 days, this month…). One month on a phone sheet, two side by side on desktop.",
    file: "packages/ui/src/components/date-range-picker.tsx", importLine: 'import { DateRangePicker, RangeCalendar, formatRange, type Range } from "@vks-kit/ui"',
    demo: () => <DRP />,
    code: `const [r, setR] = useState<Range>({ from: "2026-09-10", to: "2026-09-16" })
<DateRangePicker value={r} onChange={setR} />`,
    examples: [
      { id: "english", title: "English presets", demo: () => <DRP lang="en" />, code: `<DateRangePicker value={r} onChange={setR} lang="en" />` },
      { id: "range-calendar", title: "Range calendar (inline)", demo: () => <RC />, code: `<RangeCalendar value={r} onChange={setR} months={2} />
<p>{formatRange(r)}</p>` },
    ],
    props: [
      { name: "value", type: "{ from?: string; to?: string }", desc: "Both ISO. to may be missing while the user is still picking." },
      { name: "onChange", type: "(r: Range) => void", desc: "" }, { name: "min / max", type: "string", desc: "" },
      { name: "placeholder", type: "string", def: '"ເລືອກໄລຍະເວລາ"', desc: "" }, { name: "lang", type: '"lo" | "en"', def: '"lo"', desc: "Preset labels." },
    ],
    notes: ["Helpers in the same package: PRESETS, pickRange, clampRange, daysBetween (inclusive), addDays, inSpan."],
  },
  {
    slug: "time-picker", name: "Time picker", group: "Dates", badge: "New",
    desc: "24 h, Google Calendar style: type a time (6, 1830, 18:30) or pick from a list every 30 minutes that opens on the current value. TimeRangePicker's end list starts after the start and shows each length (12 ຊມ · +1 ມື້); length chips 12 / 8 ຊມ under the fields. Dropdown on desktop, bottom-sheet list on phone.",
    file: "packages/ui/src/components/time-picker.tsx", importLine: 'import { TimePicker, TimeRangePicker, timeToMin, minToTime, spanMin, isHHMM, parseTimeText, timeSteps } from "@vks-kit/ui"',
    demo: () => <TRP s0="18:00" e0="06:00" />,
    code: `const [v, setV] = useState({ s: "18:00", e: "06:00" })   // "HH:MM", 24 h
<TimeRangePicker starts={v.s} ends={v.e} onChange={(s, e) => setV({ s, e })} />`,
    examples: [
      { id: "single", title: "One time (TimePicker)", note: "A meeting or visit time. Type 930 + Enter, or pick from the list.", demo: () => <TP />, code: `const [t, setT] = useState("09:30")
<Label htmlFor="mt">ເວລາ</Label>
<TimePicker id="mt" value={t} onChange={setT} />` },
      { id: "presets", title: "Other lengths", note: "presets are hours. Picking a start keeps the current length, then opens ເລີກ.", demo: () => <TRP presets={[12, 8, 6]} />, code: `<TimeRangePicker starts={s} ends={e} onChange={set} presets={[12, 8, 6]} />` },
    ],
    props: [
      { name: "value (TimePicker)", type: "string", desc: '"HH:MM" or "" (shows --:--).' }, { name: "onChange (TimePicker)", type: "(v: string) => void", desc: "" },
      { name: "starts / ends", type: "string", desc: '"HH:MM". ends < starts means the shift crosses midnight.' },
      { name: "onChange (TimeRangePicker)", type: "(starts: string, ends: string) => void", desc: "Both values every time (a length preset moves the end)." },
      { name: "presets", type: "number[]", def: "[12, 8]", desc: "Length chips in hours; [] hides them." },
      { name: "step", type: "number", def: "30", desc: "Minutes between list items (15 for finer). Typing accepts any minute." },
      { name: "labels", type: "boolean", def: "true", desc: "Show ເລີ່ມ / ເລີກ labels over the two fields." },
      { name: "id", type: "string", desc: "TimePicker: the field id. TimeRangePicker: fields get id-start / id-end." },
      { name: "invalid", type: "boolean", desc: "Red border (TimeRangePicker: the end field)." },
    ],
    notes: [
      "Shifts are named by their time only (06:00–18:00); never add a day/night word. Group lengths 12 / 8 / ອື່ນໆ.",
      "Inside a Dialog on a phone the panel is a pushed view in the same sheet (no sheet on a sheet).",
      "Keyboard: ↑ ↓ move through the list, Enter picks, Esc puts the old value back. Typed text is read by parseTimeText on Enter or when the field loses focus; a wrong time turns the field red and keeps the old value.",
      "On a phone the field does not raise the keyboard: a tap opens the list in a bottom sheet (44 px rows).",
      "Helpers: parseTimeText, timeSteps, timeToMin, minToTime (wraps past midnight), spanMin (overnight aware), isHHMM.",
    ],
  },
]
