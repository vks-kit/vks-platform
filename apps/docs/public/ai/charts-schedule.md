# Charts · Schedules & grids

> Calendar-shaped charts from the VKS apps: Heatmap, DateGrid (QC site profile), LatencyTimeline (patrol latency site profile) and AttendanceBoard (HRM ຕິດຕາມການມາວຽກ). Each has a real phone form chosen by its own width, not the screen: DateGrid becomes one tappable row per round (mini status strip) that opens a bottom sheet with the days, Heatmap scales, LatencyTimeline becomes a month calendar with gap chips and tapping a visited day opens a bottom sheet, AttendanceBoard becomes one tappable row per guard that opens a bottom sheet with the month. Phone tap targets are 44 px.

- Group: Heavy (lazy) · Lazy
- Source: `packages/ui/src/heavy/charts.tsx`
- Live docs: #/docs/charts-schedule

```ts
import { Heatmap, DateGrid, LatencyTimeline, AttendanceBoard } from "@vks-kit/ui/charts"
```

## When to use

- **Heatmap**: Heatmap grid (pure CSS, no Recharts): rows x cols of values, colour = token mixed by intensity. Typical use: incidents per weekday x hour, or site x week. Cells fade in with a wave.
- **DateGrid**: Date grid (pure CSS, QC site-profile style): one row per round/guard/zone, one column per day (default 14), each cell a status square: ok = complete, late, miss = outlined red, na = empty. Wide container = the grid, tap a cell to get onPick. Narrow (phone) = one tappable row per round that opens a bottom sheet with the days as a calendar (tap a day to get onPick). Use for "did it happen on each day" history; for intensity numbers use Heatmap instead.
- **LatencyTimeline**: Site profile timeline (pure CSS): which days of a month a site was visited, and the gap in days between visits. Wide (container 576 px+) = one strip of day squares with a gap bracket ("2d") above; narrow = a month calendar with the gaps as chips below, and tapping a visited day opens a bottom sheet (kinds, gap before and after; onPick fires from its button). Header shows average / longest / shortest gap and total logs. A day may carry several kinds (underlined segments). Use for "how often is this site visited"; for plain done / late / missed per round use DateGrid instead.
- **AttendanceBoard**: Monthly attendance board (pure CSS, HRM "track attendance" style): one row per guard, one cell per day, with codes P present, ພ rest day, A absent, ລ leave, O8 overtime hours, H8 worked a holiday, ? missing record (dashed red); "P+O8" splits one cell. Header summarises missing / overtime / absent / leave counts and a completeness bar per day. Wide container = table with the name column pinned; narrow (phone) = one tappable row per guard that opens a bottom sheet with the month calendar. Use for "did each guard come to work each day"; for round status per site use DateGrid instead.

## Example

```tsx
<Heatmap rows={days} cols={hours} values={grid} unit="ເຫດ" />
<DateGrid rows={["R1", "R2", "R3"]} dates={["2/4", "2/5", "2/6"]} status={[["ok", "late", "miss"], ["ok", "ok", "na"], ["ok", "ok", "ok"]]} today={1} onPick={(r, d, s) => open(r, d)} />
<LatencyTimeline days={30} offset={1} entries={[{ day: 6, kinds: ["inspection"] }, { day: 11, kinds: ["inspection", "event"] }, { day: 20, kinds: ["inspection"] }]} onPick={(d) => open(d)} />
<AttendanceBoard days={31} today={19} offset={1} rows={[{ id: "VKS2207001", name: "ພູວົງ ແສງດາວ", cells: ["P", "P", "P+O8", "W", "A", "?"] }]} onPick={(id, d, code) => edit(id, d)} />
```

### Motion

Calendar-shaped charts use a CSS wave (45 ms-ish per cell step), so they cost nothing when Recharts is not loaded. Lite / reduced motion removes the wave.

```tsx
// Charts animate once on mount. Remount (key) to replay.
// Off automatically for prefers-reduced-motion and <html data-perf="lite">.
<BarSeries data={week} x="d" y={["ok", "late"]} />      // nothing to enable
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| DateGrid | rows; dates; status: (ok\|late\|miss\|na)[][]; today?; onPick?; labels?; cell = 26 |  | QC site-profile date grid: a row per round, a column per day, status squares. Scrolls sideways on a phone with row labels pinned. |
| LatencyTimeline | days = 30; entries: { day; kinds }[]; offset?; today?; onPick?; labels?; unit = d; openLabel? |  | Site profile (patrol latency): visit days, gap brackets, avg / longest / shortest gap. Wide = one strip; narrow = month calendar + gap chips; tap a visited day for a sheet (kinds, gap before/after, openLabel button that fires onPick). kinds: inspection, special, event, meeting, incident (several = split underline). |
| AttendanceBoard | rows: { id; name; cells: string[] }[]; days = 31; today?; offset?; onPick?; labels? |  | HRM attendance tracking. Codes: P present, W rest day, A absent, L leave, O8 overtime hours, H8 holiday worked, ? missing, P+O8 split, '' empty. Wide = table with pinned names; narrow = one collapsible month card per guard. |
| Heatmap | rows; cols; values: number[][]; tone?; unit?; cell = 28 |  | Pure CSS, no Recharts. |
