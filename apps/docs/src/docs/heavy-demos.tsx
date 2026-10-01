import * as React from "react"
import { BarSeries, LineSeries, AreaSeries, Donut, Sparkline, ScatterSeries, RadarSeries, RadialBars, ComboSeries, Heatmap, DateGrid, LatencyTimeline, AttendanceBoard, type AttendanceRow } from "@vks/ui/charts"
import { MapView, type Pin } from "@vks/ui/map"
import { Kanban, type KanbanCard } from "@vks/ui/kanban"
import { QrScanner, PhotoCapture, CaptureStamp, stampPhoto, stampTime } from "@vks/ui/scan"
import { Button, SignaturePad, useIsMobile, type SignaturePadHandle } from "@vks/ui"
import { RefreshCw } from "@vks/ui/icons"
import { useT } from "./kit"

const week = ["ຈ", "ອ", "ພ", "ພຫ", "ສ", "ສ.", "ອາ"].map((d, i) => ({ d, ok: [82, 91, 88, 95, 90, 70, 65][i], late: [8, 4, 6, 2, 5, 12, 9][i] }))
const lbl = { ok: "ຕົງເວລາ", late: "ຊ້າ", miss: "ພາດ", rate: "% ຕົງເວລາ", a: "ທີມ A", b: "ທີມ B" }
const combo = week.map((w, i) => ({ ...w, miss: [2, 1, 3, 0, 1, 5, 4][i], rate: Math.round((w.ok / (w.ok + w.late)) * 100) }))
const rnd = (s: number) => () => (s = (s * 9301 + 49297) % 233280) / 233280
const r1 = rnd(7), r2 = rnd(42)
const scatter = [
  { name: "ກະເຊົ້າ", data: Array.from({ length: 14 }, () => ({ km: +(r1() * 9 + 0.5).toFixed(1), min: Math.round(r1() * 10 + 3), n: Math.round(r1() * 8 + 1) })) },
  { name: "ກະກາງຄືນ", data: Array.from({ length: 14 }, () => ({ km: +(r2() * 9 + 0.5).toFixed(1), min: Math.round(r2() * 16 + 6), n: Math.round(r2() * 8 + 1) })) },
]
const skills = ["ວິໄນ", "ຕົງເວລາ", "ລາຍງານ", "ອຸປະກອນ", "ບໍລິການ", "ຄວາມປອດໄພ"].map((s, i) => ({ s, a: [92, 88, 76, 84, 90, 81][i], b: [78, 95, 88, 70, 82, 90][i] }))
const hours = ["00", "03", "06", "09", "12", "15", "18", "21"]
const heat = ["ຈ", "ອ", "ພ", "ພຫ", "ສ", "ສ.", "ອາ"].map((_, d) => hours.map((_, h) => Math.round(Math.abs(Math.sin(d * 1.3 + h * 0.9)) * 9 + (h === 0 || h === 7 ? 4 : 0) + (d > 4 ? 3 : 0))))
const Card = ({ t, s, children, className }: { t: string; s?: string; children: React.ReactNode; className?: string }) => <div className={"min-w-0 rounded-2xl border bg-card p-4 leading-normal " + (className ?? "")}><div className="mb-3"><div className="text-sm font-bold">{t}</div>{s && <div className="text-xs text-muted-foreground">{s}</div>}</div>{children}</div>
const kpis = [{ t: "ລາດຕະເວນ", v: "1,284", d: "+8%", s: [3, 5, 4, 8, 6, 9, 11], c: "var(--chart-1)" }, { t: "ຕົງເວລາ", v: "94%", d: "+2%", s: [88, 90, 89, 92, 91, 93, 94], c: "var(--chart-2)" }, { t: "ເຫດການ", v: "17", d: "-12%", s: [9, 7, 8, 5, 6, 4, 3], c: "var(--chart-4)" }]
const dgDates = Array.from({ length: 14 }, (_, i) => "2/" + (4 + i))
const dgRows = ["R1", "R2", "R3", "R4", "R5", "R6", "R7"]
const dgStatus = dgRows.map((_, r) => dgDates.map((_, c) => { const v = (r * 7 + c * 13) % 23; return v === 0 ? "miss" as const : v < 3 ? "late" as const : r === 6 && c > 11 ? "na" as const : "ok" as const }))
const latEntries: { day: number; kinds: ("inspection" | "special" | "event" | "meeting" | "incident")[] }[] = [6, 7, 11, 13, 14, 16, 18, 20, 28, 30].map((day) => ({ day, kinds: day === 11 ? ["inspection", "event"] : day === 20 ? ["inspection", "incident"] : ["inspection"] }))
const attPat = ["P", "P", "P+O8", "P", "P", "W", "P", "P", "P", "P", "W", "P", "P", "H8", "P", "P", "P", "W", "P", "P", "?", "?", "", "", "", "", "", "", "", "", ""]
const attRows: AttendanceRow[] = [["VKS2207001", "ພູວົງ ແສງດາວ", 0], ["VKS2206001", "ບຸນເຮືອງ ວົງພະຈັນ", 3], ["VKS2206004", "ທິບພະວັນ ສີວິໄລ", 5], ["VKS2510002", "ຈັນສະໝອນ ສຸວັນນະ", 8]].map(([id, name, k]) => ({
  id: id as string, name: name as string,
  cells: attPat.map((c, i) => (i + (k as number)) % 9 === 4 && c === "P" ? "A" : (i + (k as number)) % 11 === 6 && c === "P" ? "L" : c),
}))
export const Charts = () => { const t = useT(); return <div className="grid w-full min-w-0 grid-cols-1 gap-4 md:grid-cols-2">
  <div className="grid gap-3 sm:grid-cols-3 md:col-span-2">{kpis.map((k) => <div key={k.t} className="flex items-end justify-between gap-2 rounded-2xl border bg-card p-4 leading-normal"><div><div className="text-xs text-muted-foreground">{k.t}</div><div className="text-2xl font-bold tabular-nums">{k.v}</div><div className="text-xs font-semibold text-muted-foreground">{k.d}</div></div><Sparkline values={k.s} color={k.c} width={96} height={36} /></div>)}</div>
  <Card t={t("ລາດຕະເວນ + % ຕົງເວລາ", "Patrols + % on time")} s={t("ComboSeries · ແທ່ງ stack + ເສັ້ນແກນຂວາ", "ComboSeries · stacked bars + right-axis line")} className="md:col-span-2"><ComboSeries data={combo} x="d" bars={["ok", "late", "miss"]} line="rate" lineUnit="%" labels={lbl} /></Card>
  <Card t={t("ຕົງເວລາ vs ຊ້າ", "On time vs late")} s={t("BarSeries · ແຕະປ້າຍເພື່ອເຊື່ອງ", "BarSeries · tap a legend pill to hide a series")}><BarSeries data={week} x="d" y={["ok", "late"]} labels={lbl} unit="ຄັ້ງ" /></Card>
  <Card t={t("ແນວໂນ້ມ", "Trend")} s="LineSeries"><LineSeries data={week} x="d" y={["ok", "late"]} labels={lbl} /></Card>
  <Card t={t("ລາດຕະເວນສະສົມ", "Cumulative patrols")} s={t("AreaSeries · stack", "AreaSeries · stacked")} className="md:col-span-2"><AreaSeries data={week} x="d" y={["ok", "late"]} labels={lbl} height={200} /></Card>
</div> }
export const ChartsShare = () => { const t = useT(); return <div className="grid w-full min-w-0 grid-cols-1 gap-4 md:grid-cols-2">
  <Card t={t("ໄລຍະທາງ vs ເວລາຕອບສະໜອງ", "Distance vs response time")} s={t("ScatterSeries · ຂະໜາດ = ຈຳນວນເຫດ", "ScatterSeries · size = number of incidents")}><ScatterSeries groups={scatter} x="km" y="min" z="n" xLabel="ກມ" unit="" /></Card>
  <Card t={t("ຄະແນນທີມ", "Team scores")} s="RadarSeries"><RadarSeries data={skills} axisKey="s" y={["a", "b"]} labels={lbl} max={100} /></Card>
  <Card t={t("ເປົ້າໝາຍເດືອນນີ້", "This month's targets")} s="RadialBars"><RadialBars data={[{ name: "ລາດຕະເວນ", value: 86 }, { name: "ຝຶກອົບຮົມ", value: 64 }, { name: "ກວດອຸປະກອນ", value: 92 }]} /></Card>
  <Card t={t("ສະຖານະລາດຕະເວນ", "Patrol status")} s={t("Donut · hover ເບິ່ງ %", "Donut · hover to see %")}><Donut data={[{ name: "ສຳເລັດ", value: 82 }, { name: "ຊ້າ", value: 12 }, { name: "ພາດ", value: 6 }]} unit="ຄັ້ງ" /></Card>
</div> }
export const ChartsSchedule = () => { const t = useT(); return <div className="grid w-full min-w-0 grid-cols-1 gap-4 md:grid-cols-2">
  <Card t={t("ຕາຕະລາງວັນທີ · 14 ວັນ", "Date grid · 14 days")} s={t("DateGrid · ຕາມໜ້າ ໂປຣໄຟລ໌ຈຸດ QC", "DateGrid · as on the QC site profile page")} className="md:col-span-2"><DateGrid rows={dgRows} dates={dgDates} status={dgStatus} today={6} /></Card>
  <Card t={t("ໂປຣໄຟລ໌ຈຸດ · ໄລຍະຫ່າງການຢ້ຽມຢາມ", "Site profile · visit intervals")} s={t("LatencyTimeline · ກັນຍາ 2026 · ໂທລະສັບ = ປະຕິທິນ", "LatencyTimeline · September 2026 · phone = calendar")} className="md:col-span-2"><LatencyTimeline days={30} offset={1} entries={latEntries} /></Card>
  <Card t={t("ຕິດຕາມການມາວຽກ · ກະ 06:00-14:00", "Attendance tracking · shift 06:00-14:00")} s={t("AttendanceBoard · ໂທລະສັບ = ບັດຕໍ່ພະນັກງານ", "AttendanceBoard · phone = one card per employee")} className="md:col-span-2"><AttendanceBoard rows={attRows} days={31} today={19} offset={1} /></Card>
  <Card t={t("ເຫດການຕາມມື້ × ຊົ່ວໂມງ", "Incidents by day × hour")} s={t("Heatmap · CSS ລ້ວນ", "Heatmap · pure CSS")} className="md:col-span-2"><Heatmap rows={["ຈ", "ອ", "ພ", "ພຫ", "ສ", "ສ.", "ອາ"]} cols={hours} values={heat} unit="ເຫດ" /></Card>
</div> }
/** Replay + lite switch + timing table around live charts. Remounting re-runs the entry motion; lite writes data-perf like the app's Settings do. */
function MotionLab({ rows, children }: { rows: [string, string, string][]; children: (k: number) => React.ReactNode }) {
  const [k, setK] = React.useState(0), [lite, setLite] = React.useState(false), t = useT()
  const html = document.documentElement
  React.useEffect(() => {
    const was = html.dataset.perf
    if (lite) html.dataset.perf = "lite"; else if (was === "lite") delete html.dataset.perf
    setK((n) => n + 1)
    return () => { if (was === undefined) delete html.dataset.perf; else html.dataset.perf = was }
  }, [lite])
  return <div className="w-full min-w-0 space-y-4">
    <div className="flex flex-wrap items-center gap-2">
      <Button size="sm" onClick={() => setK(k + 1)}><RefreshCw />{t("ຫຼິ້ນອີກ", "Replay")}</Button>
      <button type="button" aria-pressed={lite} onClick={() => setLite(!lite)} className={"vks-press inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-xs font-semibold leading-normal " + (lite ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:bg-muted")}>
        <span className={"size-2 rounded-full " + (lite ? "bg-primary-foreground" : "bg-success")} />{lite ? t("Lite / reduced motion: ເປີດ", "Lite / reduced motion: ON") : t("Motion: ເປີດ", "Motion: ON")}
      </button>
      <span className="text-xs text-muted-foreground">{t("ກົດເພື່ອເບິ່ງເວລາປິດອະນິເມຊັນ (ຕັ້ງຄ່າປະຢັດແບັດ ຫຼື reduced motion): ກາຟຈະຂຶ້ນທັນທີ.", "Tap to see what happens with animation off (battery saver or reduced motion): charts appear instantly.")}</span>
    </div>
    <div key={k} className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2">{children(k)}</div>
    <div className="min-w-0 overflow-hidden rounded-2xl border bg-card text-left">
      <div className="hidden grid-cols-[minmax(0,1fr)_minmax(0,2fr)_minmax(0,1.2fr)] gap-x-4 border-b bg-muted/50 px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground sm:grid"><span>{t("ກາຟ", "Chart")}</span><span>{t("ສິ່ງທີ່ເຄື່ອນໄຫວ", "What moves")}</span><span className="text-right">{t("ເວລາ", "Timing")}</span></div>
      {rows.map(([n, w, t]) => <div key={n} className="grid grid-cols-1 gap-x-4 gap-y-1 border-b px-4 py-3 text-xs leading-normal last:border-b-0 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)_minmax(0,1.2fr)] sm:items-center"><b className="font-mono">{n}</b><span className="text-muted-foreground">{w}</span><span className="font-mono tabular-nums sm:text-right">{t}</span></div>)}
      <div className="border-t bg-muted/30 px-4 py-2 text-xs leading-relaxed text-muted-foreground">{t("ໂທລະສັບ (ກວ້າງ < 768 px): ທຸກກາຟຖືກຈຳກັດທີ່ 400 ms ຕາມກົດໂທລະສັບ. ຕົວເລກຂ້າງເທິງແມ່ນເດັສທັອບ.", "Phone (< 768 px wide): every chart is capped at 400 ms, per the phone rule. The figures above are desktop.")}</div>
    </div>
  </div>
}
export const ChartsMotion = () => { const t = useT(); return <MotionLab rows={[
  ["BarSeries", t("ແທ່ງຂຶ້ນຈາກເສັ້ນຖານ; ແຕ່ລະຊຸດເລີ່ມຊ້າລົງເລັກນ້ອຍ", "bars grow up from the baseline; each series starts a bit later"), t("700 ms · +90 ms / ຊຸດ", "700 ms · +90 ms / series")],
  ["LineSeries", t("ເສັ້ນລາກຈາກຊ້າຍໄປຂວາ ຈຸດຕາມມາ; ແຕ່ລະຊຸດເລີ່ມຫຼ້ຳກັນ", "line draws left to right, dots follow; series are staggered"), t("700 ms · +120 ms / ຊຸດ", "700 ms · +120 ms / series")],
  ["AreaSeries", t("ພື້ນສີ ແລະ ເສັ້ນຂອບຂະຫຍາຍພ້ອມກັນ", "fill and edge line grow together"), "700 ms"],
  ["ComboSeries", t("ແທ່ງກ່ອນ ແລ້ວເສັ້ນ % ລາກທັບ", "bars first, then the % line draws over them"), t("700 ms · ເສັ້ນ +300 ms", "700 ms · line +300 ms")],
  ["Legend pill", t("ແຕະເພື່ອເຊື່ອງຊຸດ: ຈຸດຫຍໍ້ລົງ, ປ້າຍຈາງລົງ, ກາຟແຕ້ມໃໝ່", "tap to hide a series: dot shrinks, pill dims, chart re-draws"), "300 ms"],
  ["Tooltip", t("ບັດຕາມນິ້ວ / ເມົ້າ ບໍ່ມີຄວາມຊັກຊ້າ", "card follows the finger / pointer, no delay"), t("ທັນທີ", "instant")],
]}>{() => <>
  <Card t="BarSeries" s={t("ແທ່ງຂຶ້ນຈາກເສັ້ນຖານ", "Bars grow up from the baseline")}><BarSeries data={week} x="d" y={["ok", "late"]} labels={lbl} height={200} /></Card>
  <Card t="LineSeries" s={t("ເສັ້ນລາກຈາກຊ້າຍໄປຂວາ", "Line draws from left to right")}><LineSeries data={week} x="d" y={["ok", "late"]} labels={lbl} height={200} /></Card>
  <Card t="ComboSeries" s={t("ແທ່ງກ່ອນ ແລ້ວເສັ້ນ % ຕາມມາ", "Bars first, then the % line follows")} className="md:col-span-2"><ComboSeries data={combo} x="d" bars={["ok", "late", "miss"]} line="rate" lineUnit="%" labels={lbl} height={220} /></Card>
</>}</MotionLab> }
export const ChartsShareMotion = () => { const t = useT(); return <MotionLab rows={[
  ["Donut", t("ຊິ້ນກວາດຕາມເຂັມໂມງ; ຊິ້ນທີ່ hover ຢູ່ຄືເກົ່າ, ຊິ້ນອື່ນຈາງລົງເປັນ 45%", "slices sweep round clockwise; hovered slice stays, the rest dim to 45%"), t("700 ms · hover 200 ms", "700 ms · hover 200 ms")],
  ["RadialBars", t("ແຕ່ລະວົງແຫວນກວາດຈາກ 12 ໂມງໄປຫາຄ່າຂອງມັນ", "each ring sweeps from 12 o'clock to its value"), "700 ms"],
  ["ScatterSeries", t("ຟອງເດັ້ງຂຶ້ນ; ກຸ່ມທີສອງເລີ່ມຫຼັງ", "bubbles pop in; second group starts later"), t("700 ms · +120 ms / ກຸ່ມ", "700 ms · +120 ms / group")],
  ["RadarSeries", t("ຈໍກວ້າງ: ຮູບຂະຫຍາຍຈາກກາງ. ໂທລະສັບ: ແຖບເຕັມຈາກຊ້າຍ", "wide: shapes expand from the centre. Phone: bars fill from the left"), t("700 ms · +150 ms / ຊຸດ · ແຖບ 500 ms", "700 ms · +150 ms / series · bars 500 ms")],
]}>{() => <>
  <Card t="Donut" s={t("ກວາດຕາມເຂັມໂມງ", "Sweeps clockwise")}><Donut data={[{ name: "ສຳເລັດ", value: 82 }, { name: "ຊ້າ", value: 12 }, { name: "ພາດ", value: 6 }]} unit="ຄັ້ງ" /></Card>
  <Card t="RadialBars" s={t("ວົງແຫວນວິ່ງໄປຫາຄ່າ", "Rings run to their value")}><RadialBars data={[{ name: "ລາດຕະເວນ", value: 86 }, { name: "ຝຶກອົບຮົມ", value: 64 }, { name: "ກວດອຸປະກອນ", value: 92 }]} /></Card>
  <Card t="ScatterSeries" s={t("ຟອງເດັ້ງຂຶ້ນ", "Bubbles pop in")}><ScatterSeries groups={scatter} x="km" y="min" z="n" xLabel="ກມ" unit="" /></Card>
  <Card t="RadarSeries" s={t("ຮູບຂະຫຍາຍຈາກກາງ (ໂທລະສັບ = ແຖບ)", "Shape expands from the centre (phone = bars)")}><RadarSeries data={skills} axisKey="s" y={["a", "b"]} labels={lbl} max={100} /></Card>
</>}</MotionLab> }
export const ChartsScheduleMotion = () => { const t = useT(); return <MotionLab rows={[
  ["Heatmap", t("ຊ່ອງຂະຫຍາຍເປັນຄື້ນແນວທະແຍງ; hover ຂະຫຍາຍຊ່ອງດຽວ 1.18x", "cells scale in on a diagonal wave; hover grows one cell 1.18x"), t("450 ms · +18 ms ຕໍ່ (ແຖວ + ຖັນ)", "450 ms · +18 ms per (row + col)")],
  ["DateGrid", t("ຊ່ອງຂຶ້ນເປັນຄື້ນແນວທະແຍງ; ເລືອກຊ່ອງຈະມີວົງລ້ອມ", "squares wave in diagonally; picking a square rings it"), t("450 ms · +14 ms ຕໍ່ (ແຖວ + ຖັນ)", "450 ms · +14 ms per (row + col)")],
  ["LatencyTimeline", t("ວັນເດັ້ງຂຶ້ນຕາມລຳດັບ; chip ໄລຍະຫ່າງຕາມມາ", "days pop in one after another; gap chips follow"), t("450 ms · +10-12 ms / ວັນ", "450 ms · +10-12 ms / day")],
  ["AttendanceBoard", t("ຊ່ອງຂຶ້ນເປັນຄື້ນໃນແຕ່ລະບັດ; ລູກສອນຂອງບັດໝຸນ 180 ອົງສາເມື່ອເປີດ", "cells wave in per card; card chevron turns 180 degrees when it opens"), t("450 ms · +10 ms / ວັນ · ລູກສອນ 300 ms", "450 ms · +10 ms / day · chevron 300 ms")],
]}>{() => <>
  <Card t="Heatmap" s={t("ຄື້ນແນວທະແຍງ", "Diagonal wave")} className="md:col-span-2"><Heatmap rows={["ຈ", "ອ", "ພ", "ພຫ", "ສ", "ສ.", "ອາ"]} cols={hours} values={heat} unit="ເຫດ" /></Card>
  <Card t="DateGrid" s={t("ຊ່ອງຂຶ້ນເປັນຄື້ນ", "Cells wave in")} className="md:col-span-2"><DateGrid rows={dgRows.slice(0, 4)} dates={dgDates} status={dgStatus} today={6} /></Card>
  <Card t="LatencyTimeline" s={t("ວັນຂຶ້ນຕາມລຳດັບ", "Days appear in sequence")} className="md:col-span-2"><LatencyTimeline days={30} offset={1} entries={latEntries} /></Card>
</>}</MotionLab> }
const mapPins: Pin[] = [{ id: "1", lat: 17.9757, lng: 102.6331, label: "ປະຕູໜ້າ", sub: "ສົມພອນ · ເຂົ້າກະແລ້ວ", meta: "08:12", tone: "success" }, { id: "2", lat: 17.9801, lng: 102.6402, label: "ຄັງສິນຄ້າ", sub: "ຊ້າ 12 ນາທີ", meta: "08:40", tone: "warning" }, { id: "3", lat: 17.9702, lng: 102.6255, label: "ພາດ", sub: "ບໍ່ມີການສະແກນ QR", meta: "09:05", tone: "danger" }]
export const Map = () => { const m = useIsMobile(); return <div className="w-full"><MapView height={m ? "100dvh" : 320} flush pins={mapPins} renderCard={() => <div className="flex gap-2"><Button size="sm" variant="outline" className="flex-1">ເບິ່ງປະຫວັດ</Button><Button size="sm" className="flex-1">ໂທຫາ</Button></div>} /></div> }
export const MapLabels = () => <div className="w-full"><MapView pins={mapPins} tips="always" height={260} /></div>
export function Board() {
  const [cards, setCards] = React.useState<KanbanCard[]>([
    { id: "a", column: "todo", title: "ກວດປະຕູ 3", meta: "ດ່ວນ · ມື້ນີ້", tone: "destructive" }, { id: "b", column: "todo", title: "ສົ່ງລາຍງານ", meta: "ກະເຊົ້າ" },
    { id: "c", column: "doing", title: "ຝຶກອົບຮົມ", meta: "ນາງບົວ", tone: "warning" }, { id: "d", column: "done", title: "ປ່ຽນແບັດວິທະຍຸ", tone: "success" }])
  const n = React.useRef(0)
  return <div className="w-full"><Kanban columns={[{ id: "todo", title: "ຕ້ອງເຮັດ", tone: "muted" }, { id: "doing", title: "ກຳລັງເຮັດ", tone: "warning" }, { id: "done", title: "ສຳເລັດ", tone: "success" }]}
    cards={cards} onChange={setCards} onAdd={(col) => setCards((c) => [...c, { id: "n" + ++n.current, column: col, title: "ວຽກໃໝ່ " + n.current }])} /></div>
}
export function Stamp() {
  const [now, setNow] = React.useState(() => stampTime()), [site, setSite] = React.useState(true), [out, setOut] = React.useState<string | null>(null), [busy, setBusy] = React.useState(false), t = useT()
  React.useEffect(() => { const iv = setInterval(() => setNow(stampTime()), 1000); return () => clearInterval(iv) }, [])
  const data = { time: now, site: site ? "ຄັງສິນຄ້າ ໂຮງງານເບຍລາວ ສາຂາວຽງຈັນ" : undefined, gps: "17.97570, 102.63310 (±8 m)" }
  React.useEffect(() => () => { if (out) URL.revokeObjectURL(out) }, [out])
  return <div className="w-full max-w-xl space-y-3">
    <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary/70 to-muted sm:aspect-video"><CaptureStamp data={data} /></div>
    <div className="flex flex-wrap items-center gap-2">
      <Button variant="outline" onClick={() => setSite(!site)}>{site ? t("ເອົາຊື່ສະຖານທີ່ອອກ", "Remove site name") : t("ໃສ່ຊື່ສະຖານທີ່", "Add site name")}</Button>
      <PhotoCapture label={t("ຖ່າຍ + ຕີຕາ", "Capture + stamp")} onPhoto={async (p) => { setBusy(true); try { const b = await stampPhoto(p.blob, { ...data, time: stampTime() }); setOut(URL.createObjectURL(b)) } finally { setBusy(false) } }} />
      {busy && <span className="text-sm text-muted-foreground">…</span>}
    </div>
    {out && <img src={out} alt="" className="w-full rounded-2xl border" />}
  </div>
}
export function Scan() {
  const [on, setOn] = React.useState(false), [last, setLast] = React.useState(""), t = useT()
  return <div className="flex flex-col items-center gap-3"><div className="flex gap-2"><PhotoCapture onPhoto={(p) => setLast("photo " + Math.round(p.bytes / 1024) + " KB")} /><Button variant="outline" onClick={() => setOn(!on)}>{on ? t("ປິດກ້ອງ", "Close camera") : t("ສະແກນ QR", "Scan QR")}</Button></div>{on && <QrScanner className="w-72" onScan={setLast} />}{last && <p className="text-sm">{last}</p>}</div>
}
export function Sign() {
  const ref = React.useRef<SignaturePadHandle>(null), [empty, setEmpty] = React.useState(true), t = useT()
  return <div className="w-full max-w-md space-y-2"><SignaturePad ref={ref} onChange={setEmpty} /><p className="text-sm text-muted-foreground">{empty ? t("ຍັງບໍ່ໄດ້ເຊັນ", "Not signed yet") : t("ເຊັນແລ້ວ ✓", "Signed ✓")}</p></div>
}
