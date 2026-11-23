import * as React from "react"
import type { Doc } from "./types"

const L = (k: "Charts" | "ChartsShare" | "ChartsSchedule" | "ChartsMotion" | "ChartsShareMotion" | "ChartsScheduleMotion" | "Map" | "MapLabels" | "Board" | "Scan" | "Stamp" | "Sign"): React.FC => React.lazy(() => import("./heavy-demos").then((m) => ({ default: m[k] })))

export const heavyDocs: Doc[] = [
  {
    slug: "charts", name: "Charts · Trends", group: "Heavy (lazy)", badge: "Lazy",
    desc: "Recharts wrapped in theme colours (chart-1…5 flip with the theme): gradient fills, VKS card tooltip, tap-to-hide legend pills, entry animation (off for reduced motion / lite). Bar, Line, Area, Combo and Sparkline: values over time. ~105 KB gzip, so load it only on report pages. Phone: they simply fill the card width, axes stay 12 px; keep to 7 or fewer x labels. Siblings: Charts · Share & compare, Charts · Schedules & grids.",
    file: "packages/ui/src/heavy/charts.tsx", importLine: 'import { BarSeries, LineSeries, AreaSeries, ComboSeries, Sparkline, ChartTip, ChartLegend } from "@vks-kit/ui/charts"',
    demo: L("Charts"),
    code: `const Charts = lazy(() => import("./ReportCharts"))   // keep it off the guard's first load

<BarSeries data={week} x="d" y={["ok", "late"]} labels={{ ok: "ຕົງເວລາ", late: "ຊ້າ" }} unit="ຄັ້ງ" />
<BarSeries data={week} x="d" y={["ok", "late"]} stacked horizontal />
<LineSeries data={week} x="d" y={["ok", "late"]} />
<AreaSeries data={week} x="d" y={["ok", "late"]} />      // several keys = stacked
<ComboSeries data={week} x="d" bars={["ok", "late"]} line="rate" lineUnit="%" />
<BarSeries data={week} x="d" y={["ok", "late"]} onPick={(row, key) => openDetail(row.d, key)} />   // click a bar to drill in
<Sparkline values={[3, 5, 4, 8, 6, 9, 7]} color="var(--chart-2)" />`,
    examples: [{ id: "motion", title: "Motion", note: "Replay to watch each chart draw in. The switch turns on the same lite mode the Settings screen uses (and prefers-reduced-motion behaves the same): charts then render finished, with no motion. Entry motion is 700 ms on desktop and finishes inside 400 ms in total on a phone (stagger delays are capped, so delay plus draw never goes past 400 ms); only transform and opacity-style effects, no layout work.", demo: L("ChartsMotion"), code: `// Charts animate once on mount. Remount (key) to replay.
// Off automatically for prefers-reduced-motion and <html data-perf="lite">.
<BarSeries data={week} x="d" y={["ok", "late"]} />      // nothing to enable` }],
    props: [
      { name: "data / x / y", type: "Row[] / string / string[]", desc: "Bar, Line and Area take several y keys (Area stacks them)." },
      { name: "labels / unit / legend", type: "Record<key,label> / string / boolean", desc: "Lao names for keys, unit in the tooltip, legend pills (tap to hide a series)." },
      { name: "stacked / horizontal", type: "boolean", desc: "BarSeries only. horizontal is the better choice for long Lao labels on a phone." },
      { name: "ComboSeries", type: "bars: string[]; line: string; lineUnit?", desc: "Stacked bars on the left axis, a line on the right axis." },
      { name: "onPick", type: "(row, key | null, index) => void", desc: "Bar, Line and Combo: click a bar / point to drill in (open a detail sheet or a filtered list). key = the series of the bar that was hit, null when the click landed on the column but not on a bar. Hovered bars brighten so they read as clickable. Keep a non-chart path to the same detail for keyboard users (e.g. a list below the chart)." },
      { name: "ChartTip / ChartLegend", type: "components; ChartLegend onPick?", desc: "Use them in your own Recharts charts to match. ChartLegend onPick turns the pills into drill buttons instead of show / hide toggles." },
      { name: "height", type: "number", desc: "240 (Donut 220). Values / width / height for Sparkline." },
    ],
  },
  {
    slug: "charts-share", name: "Charts · Share & compare", group: "Heavy (lazy)", badge: "Lazy",
    desc: "Parts of a whole and comparisons: Donut, RadialBars, Scatter / bubble and Radar. Phone: Donut and RadialBars scale as they are; RadarSeries switches by its own width to a bar-per-axis comparison list, because radar labels collide on a 320 px card (industry practice: radar is desktop, bars are the phone equivalent). Pass compact to force either form.",
    file: "packages/ui/src/heavy/charts.tsx", importLine: 'import { Donut, RadialBars, ScatterSeries, RadarSeries } from "@vks-kit/ui/charts"',
    demo: L("ChartsShare"),
    code: `<Donut data={[{ name: "ສຳເລັດ", value: 82 }, { name: "ຊ້າ", value: 12 }]} centerLabel="ລວມ" onPick={(s) => openDetail(s.name)} />
<RadialBars data={[{ name: "ລາດຕະເວນ", value: 86 }, { name: "ຝຶກອົບຮົມ", value: 64 }]} />
<ScatterSeries groups={[{ name: "ກະເຊົ້າ", data: rows }]} x="km" y="min" z="n" xLabel="ກມ" />
<RadarSeries data={skills} axisKey="s" y={["a", "b"]} max={100} />          // phone: bars per axis
<RadarSeries data={skills} axisKey="s" y={["a", "b"]} compact />            // force the bar form`,
    examples: [{ id: "motion", title: "Motion", note: "Replay to see sweeps, pops and the radar-to-bars switch. Lite / reduced motion shows the finished chart at once.", demo: L("ChartsShareMotion"), code: `// Charts animate once on mount. Remount (key) to replay.
// Off automatically for prefers-reduced-motion and <html data-perf="lite">.
<BarSeries data={week} x="d" y={["ok", "late"]} />      // nothing to enable` }],
    props: [
      { name: "Donut", type: "{ name; value }[]; centerLabel?; centerValue?; unit?", desc: "Total (or hovered %) in the hole, legend with percentages. onPick(slice, index): tap a slice or its legend pill to drill in (the pills are buttons, so it also works by keyboard)." },
      { name: "RadialBars", type: "{ name; value }[]; max = 100; unit = %", desc: "Centre shows the average." },
      { name: "ScatterSeries", type: "groups: { name; data }[]; x; y; z?; xLabel?; yLabel?; unit?", desc: "z sizes bubbles; yLabel and unit label the axis and tooltip." },
      { name: "RadarSeries", type: "data; axisKey; y[]; max?; compact?", desc: "Desktop: radar. Narrow box (< 440 px) or compact: one row per axis with a thin bar per series. Legend pills hide series in both forms." },
    ],
  },
  {
    slug: "charts-schedule", name: "Charts · Schedules & grids", group: "Heavy (lazy)", badge: "Lazy",
    desc: "Calendar-shaped charts from the VKS apps: Heatmap, DateGrid (QC site profile), LatencyTimeline (patrol latency site profile) and AttendanceBoard (HRM ຕິດຕາມການມາວຽກ). Each has a real phone form chosen by its own width, not the screen: DateGrid becomes one tappable row per round (mini status strip) that opens a bottom sheet with the days, Heatmap scales, LatencyTimeline becomes a month calendar with gap chips and tapping a visited day opens a bottom sheet, AttendanceBoard becomes one tappable row per guard that opens a bottom sheet with the month. Phone tap targets are 44 px.",
    file: "packages/ui/src/heavy/charts.tsx", importLine: 'import { Heatmap, DateGrid, LatencyTimeline, AttendanceBoard } from "@vks-kit/ui/charts"',
    demo: L("ChartsSchedule"),
    code: `<Heatmap rows={days} cols={hours} values={grid} unit="ເຫດ" />
<DateGrid rows={["R1", "R2", "R3"]} dates={["2/4", "2/5", "2/6"]} status={[["ok", "late", "miss"], ["ok", "ok", "na"], ["ok", "ok", "ok"]]} today={1} onPick={(r, d, s) => open(r, d)} />
<LatencyTimeline days={30} offset={1} entries={[{ day: 6, kinds: ["inspection"] }, { day: 11, kinds: ["inspection", "event"] }, { day: 20, kinds: ["inspection"] }]} onPick={(d) => open(d)} />
<AttendanceBoard days={31} today={19} offset={1} rows={[{ id: "VKS2207001", name: "ພູວົງ ແສງດາວ", cells: ["P", "P", "P+O8", "W", "A", "?"] }]} onPick={(id, d, code) => edit(id, d)} />`,
    examples: [{ id: "motion", title: "Motion", note: "Calendar-shaped charts use a CSS wave (a few ms per cell step, capped so the whole wave ends within 400 ms on a phone), so they cost nothing when Recharts is not loaded. Lite / reduced motion removes the wave.", demo: L("ChartsScheduleMotion"), code: `// Charts animate once on mount. Remount (key) to replay.
// Off automatically for prefers-reduced-motion and <html data-perf="lite">.
<BarSeries data={week} x="d" y={["ok", "late"]} />      // nothing to enable` }],
    props: [
      { name: "DateGrid", type: "rows; dates; status: (ok|late|miss|na)[][]; today?; onPick?; labels?; cell = 26", desc: "QC site-profile date grid: a row per round, a column per day, status squares. Scrolls sideways on a phone with row labels pinned." },
      { name: "LatencyTimeline", type: "days = 30; entries: { day; kinds }[]; offset?; today?; onPick?; labels?; unit = d; openLabel?", desc: "Site profile (patrol latency): visit days, gap brackets, avg / longest / shortest gap. Wide = one strip; narrow = month calendar + gap chips; tap a visited day for a sheet (kinds, gap before/after, openLabel button that fires onPick). kinds: inspection, special, event, meeting, incident (several = split underline)." },
      { name: "AttendanceBoard", type: "rows: { id; name; cells: string[] }[]; days = 31; today?; offset?; onPick?; labels?", desc: "HRM attendance tracking. Codes: P present, W rest day, A absent, L leave, O8 overtime hours, H8 holiday worked, ? missing, P+O8 split, '' empty. Wide = table with pinned names; narrow = one collapsible month card per guard." },
      { name: "Heatmap", type: "rows; cols; values: number[][]; tone?; unit?; cell = 28", desc: "Pure CSS, no Recharts." },
    ],
  },
  {
    slug: "map", bleed: true, name: "Map", group: "Heavy (lazy)", badge: "Lazy",
    desc: "Leaflet + OpenStreetMap with VKS controls: glass 44 px zoom + 'fit all pins' buttons, pulsing token pins (danger pulses faster), Noto Sans Lao card tooltips (tone dot, title, sub line, time), an optional pin card that springs up when a pin is tapped (phones have no hover, so this is how they read details), always-on labels, and a tiny © OSM credit (required by the OSM licence). Defaults to Vientiane. ~43 KB gzip.",
    file: "packages/ui/src/heavy/map.tsx", importLine: 'import { MapView, type Pin } from "@vks-kit/ui/map"',
    demo: L("Map"),
    code: `<MapView
  pins={[{ id: "1", lat: 17.9757, lng: 102.6331, label: "ປະຕູໜ້າ", sub: "ສົມພອນ · ເຂົ້າກະແລ້ວ", meta: "08:12", tone: "success" }]}
  renderCard={(pin) => <Button size="sm" onClick={() => call(pin.id)}>ໂທຫາ</Button>}
/>`,
    examples: [
      { id: "labels", title: "Always-on labels", note: "tips=\"always\" keeps small pill labels on every pin: good for wall screens in the control room.", demo: L("MapLabels"), code: `<MapView pins={pins} tips="always" />` },
    ],
    props: [{ name: "flush", type: "boolean", def: "false", desc: "Phone only: edge to edge, no rounded corners or border, like a full-width screen. Desktop is unchanged." }, { name: "list", type: "boolean", def: "phone + 2 or more pins", desc: "Uber-style bottom sheet on phones: peeks at the bottom, drag up to list every pin, drag down to tuck it away. Tap a row to fly there and open its card. Pins are small for a thumb, so the list is the reliable way to pick one." }, 
      { name: "pins", type: '{ id; lat; lng; label?; sub?; meta?; tone?: "success" | "warning" | "danger" | "primary" }[]', desc: "sub = second line, meta = small right text (time)." },
      { name: "tips", type: '"hover" | "always" | "none"', def: '"hover"', desc: "Hover tip, permanent labels, or none." },
      { name: "renderCard", type: "(pin) => ReactNode", desc: "Tapping a pin opens a glass card at the bottom with title, tone, close and this body." },
      { name: "card", type: "boolean", def: "!!renderCard", desc: "Show the pin card without a custom body." },
      { name: "height", type: "number", def: "320", desc: "" }, { name: "onPin", type: "(pin) => void", desc: "" },
      { name: "center / zoom", type: "[lat, lng] / number", def: "[17.9757, 102.6331] / 12", desc: "" },
    ],
  },
  {
    slug: "kanban", name: "Kanban", group: "Heavy (lazy)", badge: "Lazy",
    desc: "Task board. Desktop: drag cards between columns (keyboard: Space + arrows). Phone: no dragging — one column per screen with count tabs, swipe between columns, tap a card to move it from a bottom sheet. ~17 KB gzip.",
    file: "packages/ui/src/heavy/kanban.tsx", importLine: 'import { Kanban, moveCard, type KanbanCard } from "@vks-kit/ui/kanban"',
    demo: L("Board"),
    code: `<Kanban columns={[{ id: "todo", title: "ຕ້ອງເຮັດ" }, { id: "done", title: "ສຳເລັດ" }]}
  cards={cards} onChange={(next, { id, to }) => { setCards(next); save(id, to) }} />`,
    props: [{ name: "cardLines", type: "1", desc: "0.6: title and meta stay on one line each (… + full text on hover), so cards in a column have the same height. Use it for boards people scan by row." },
      { name: "phoneTap", type: '"move" | "open"', def: '"move"', desc: "Phone: what a tap on a card does. \"open\" calls onOpen (recommended when the card has its own actions: tap opens, moving is inside); \"move\" shows the move-to sheet." },
      { name: "columns", type: "{ id; title; tone? }[]", desc: "tone colours the dot: muted | primary | warning | success | destructive. Desktop columns stay on one row (min 8.5rem) and scroll sideways when they do not fit." }, { name: "cards", type: "{ id; column; title; meta?; tone? }[]", desc: "tone colours the left edge." },
      { name: "onChange", type: "(cards, { id, to }) => void", desc: "Fires once on drop, only when something changed." }, { name: "onAdd", type: "(column) => void", desc: "Shows a + button under each column." },
      { name: "onOpen", type: "(card) => void", desc: "Click / tap a card." }, { name: "emptyLabel / addLabel", type: "string", def: '"ລາກບັດມາວາງບ່ອນນີ້" / "ເພີ່ມບັດ"', desc: "" }],
    notes: ["Phone: tab strip with counts + swipe between columns; tap a card → sheet with a \"move to\" list (and an Open button when onOpen is set). Desktop (md+): columns share the width, drag and drop.", "Optional phone labels: moveLabel, openLabel.", "dropCard(cards, id, overId, columnIds) and moveCard are pure and unit tested — use them server-side too."],
  },
  {
    slug: "scan", name: "QR scan & photo", group: "Heavy (lazy)", badge: "Lazy",
    desc: "Camera QR scanner (jsQR) and a photo button that shrinks to 1280 px / 70 % JPEG before upload. ~48 KB gzip.",
    file: "packages/ui/src/heavy/scan.tsx", importLine: 'import { QrScanner, PhotoCapture } from "@vks-kit/ui/scan"',
    demo: L("Scan"),
    code: `<QrScanner onScan={(text) => submit(text)} onError={showHelp} />
<PhotoCapture onPhoto={({ blob, bytes }) => upload(blob)} />

// Full-screen scanner page: camera edge to edge, your own top bar + bottom card on top
<div className="fixed inset-0">
  <QrScanner variant="fullscreen" frameTop="34%" hint="ຫັນກ້ອງໃສ່ QR ທີ່ປະຕູເຂົ້າ" onScan={submit} />
  <TopBar className="absolute inset-x-0 top-0" />
  <div className="absolute inset-x-0 bottom-0 rounded-t-3xl bg-card p-4">…</div>
</div>`,
    props: [
      { name: "onScan / onError", type: "(text) => void / (e) => void", desc: "QrScanner. Needs https + camera permission." },
      { name: "variant", type: '"card" | "fullscreen"', def: '"card"', desc: "fullscreen fills its parent: dimmed mask, gold corner viewfinder, moving scan line, torch (when the phone has one) + switch camera on the right." },
      { name: "hint / frameTop", type: "ReactNode / CSS length", def: '— / "40%"', desc: "fullscreen only: one line under the viewfinder; where the viewfinder centre sits so your bottom card never covers it." },
      { name: "onPhoto", type: "({ blob, url, bytes }) => void", desc: "PhotoCapture." }, { name: "maxEdge / quality", type: "number", def: "1280 / 0.7", desc: "" },
    ],
  },
  {
    slug: "capture-stamp", name: "Capture stamp (photo & video)", group: "Heavy (lazy)", badge: "Lazy",
    desc: "The time / site / GPS card the Patrol app burns into photos and video frames: top-left capture time, bottom-right site + GPS, top-right brand pill. One drawing function, so the live preview and the saved file look identical. Lao text wraps without splitting tone marks.",
    file: "packages/ui/src/heavy/scan.tsx", importLine: 'import { drawCaptureStamp, stampPhoto, stampTime, CaptureStamp, type CaptureStampData } from "@vks-kit/ui/scan"',
    demo: L("Stamp"),
    code: `const data = { time: stampTime(), site: "ຄັງສິນຄ້າ ໂຮງງານເບຍລາວ", gps: "17.97570, 102.63310 (±8 m)" }

// live camera view: same drawing as the saved file
<div className="relative"><video … /><CaptureStamp data={data} /></div>

// photo: shrink + stamp, get a JPEG Blob
const blob = await stampPhoto(file, data)

// video: call once per frame on your own canvas
drawCaptureStamp(ctx, canvas.width, canvas.height, data)`,
    props: [
      { name: "data", type: "{ time; site?; gps; brand? }", desc: "time and gps are plain strings you format; site is left out when none is chosen; brand defaults to VKS." },
      { name: "drawCaptureStamp(ctx, w, h, data)", type: "function", desc: "Draws on any 2D canvas (no React). Sizes scale with min(w, h), so it fits 720p video and 12 MP photos alike." },
      { name: "stampPhoto(blob, data, maxEdge?, quality?)", type: "Promise<Blob>", def: "1280 / 0.7", desc: "Shrinks, stamps, returns a JPEG." },
      { name: "stampTime(date?)", type: "string", desc: "YYYY-MM-DD HH:mm:ss in local time." },
    ],
    notes: ["Canvas cannot read CSS tokens, so the stamp's colours are fixed inside the function (dark glass card, green labels) to match the existing Patrol PWA look.", "Stamp a video by calling drawCaptureStamp on each frame of your compositor canvas before encoding; the draw is cheap, but at 60 Hz screens limit it to the encode rate."],
  },
  {
    slug: "signature-pad", name: "Signature pad", group: "Heavy (lazy)", badge: "Lazy",
    desc: "Finger signature for hand-overs. Read it back as a PNG.",
    file: "packages/ui/src/components/signature-pad.tsx", importLine: 'import { SignaturePad, type SignaturePadHandle } from "@vks-kit/ui"',
    demo: L("Sign"),
    code: `const ref = useRef<SignaturePadHandle>(null)
<SignaturePad ref={ref} onChange={(empty) => setSigned(!empty)} />
// later
const png = ref.current!.toDataURL()`,
    props: [{ name: "height", type: "number", desc: "" }, { name: "onChange", type: "(empty: boolean) => void", desc: "" }, { name: "ref", type: "{ clear(); isEmpty(); toDataURL() }", desc: "A plain prop since 0.8 (React 19, no forwardRef); useRef works the same." }],
  },
]