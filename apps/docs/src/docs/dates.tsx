import * as React from "react"
import { Calendar, DateWheel, DatePicker, DateRangePicker, RangeCalendar, Card, CardContent, type Range, formatRange } from "@vks-kit/ui"
import type { Doc } from "./types"

function DP() { const [d, setD] = React.useState("2026-09-30"); return <div className="w-full max-w-xs"><DatePicker value={d} onChange={setD} /></div> }
function Cal() { const [d, setD] = React.useState("2026-09-30"); return <Card className="w-fit"><CardContent className="pt-5"><Calendar value={d} onChange={setD} marked={["2026-09-12", "2026-09-20"]} /></CardContent></Card> }
function Wheel() { const [d, setD] = React.useState("2026-09-30"); return <div className="w-full max-w-xs space-y-2"><DateWheel value={d} onChange={setD} /><p className="text-center text-sm text-muted-foreground">{d}</p></div> }
function DRP({ lang }: { lang?: "lo" | "en" }) { const [r, setR] = React.useState<Range>({ from: "2026-09-10", to: "2026-09-16" }); return <div className="w-full max-w-sm"><DateRangePicker value={r} onChange={setR} lang={lang} /></div> }
function RC() { const [r, setR] = React.useState<Range>({ from: "2026-09-10", to: "2026-09-16" }); return <div className="space-y-2"><Card className="w-fit"><CardContent className="pt-5"><RangeCalendar value={r} onChange={setR} months={2} /></CardContent></Card><p className="text-center text-sm text-muted-foreground">{formatRange(r) || "—"}</p></div> }

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
]
