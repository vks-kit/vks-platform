# Charts · Trends

> Recharts wrapped in theme colours (chart-1…5 flip with the theme): gradient fills, VKS card tooltip, tap-to-hide legend pills, entry animation (off for reduced motion / lite). Bar, Line, Area, Combo and Sparkline: values over time. ~105 KB gzip, so load it only on report pages. Phone: they simply fill the card width, axes stay 12 px; keep to 7 or fewer x labels. Siblings: Charts · Share & compare, Charts · Schedules & grids.

- Group: Heavy (lazy) · Lazy
- Source: `packages/ui/src/heavy/charts.tsx`
- Live docs: #/docs/charts

```ts
import { BarSeries, LineSeries, AreaSeries, ComboSeries, Sparkline, ChartTip, ChartLegend } from "@vks/ui/charts"
```

## When to use

- **BarSeries**: Bars with a top-lit gradient and rounded caps. stacked = one column per x. Tap a legend pill to hide a series.
- **LineSeries**: Smooth lines with a soft glow under the first series and an active-dot ring.
- **AreaSeries**: Area with a vertical gradient fade. y can be one key or several (stacked).
- **ComboSeries**: Bars + a line on a second axis (e.g. patrol count + on-time %).
- **Sparkline**: Tiny inline trend for KPI tiles. Pure SVG, no library, ~0 KB. Gradient fill + end dot.
- **ChartTip**: Card tooltip: title, colour dot per series, tabular numbers, optional unit.
- **ChartLegend**: Pill legend. Pass onToggle to let people hide a series by tapping it.

## Example

```tsx
const Charts = lazy(() => import("./ReportCharts"))   // keep it off the guard's first load

<BarSeries data={week} x="d" y={["ok", "late"]} labels={{ ok: "ຕົງເວລາ", late: "ຊ້າ" }} unit="ຄັ້ງ" />
<BarSeries data={week} x="d" y={["ok", "late"]} stacked horizontal />
<LineSeries data={week} x="d" y={["ok", "late"]} />
<AreaSeries data={week} x="d" y={["ok", "late"]} />      // several keys = stacked
<ComboSeries data={week} x="d" bars={["ok", "late"]} line="rate" lineUnit="%" />
<Sparkline values={[3, 5, 4, 8, 6, 9, 7]} color="var(--chart-2)" />
```

### Motion

Replay to watch each chart draw in. The switch turns on the same lite mode the Settings screen uses (and prefers-reduced-motion behaves the same): charts then render finished, with no motion. Entry motion stays under 700 ms; only transform and opacity-style effects, no layout work.

```tsx
// Charts animate once on mount. Remount (key) to replay.
// Off automatically for prefers-reduced-motion and <html data-perf="lite">.
<BarSeries data={week} x="d" y={["ok", "late"]} />      // nothing to enable
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| data / x / y | Row[] / string / string[] |  | Bar, Line and Area take several y keys (Area stacks them). |
| labels / unit / legend | Record<key,label> / string / boolean |  | Lao names for keys, unit in the tooltip, legend pills (tap to hide a series). |
| stacked / horizontal | boolean |  | BarSeries only. horizontal is the better choice for long Lao labels on a phone. |
| ComboSeries | bars: string[]; line: string; lineUnit? |  | Stacked bars on the left axis, a line on the right axis. |
| ChartTip / ChartLegend | components |  | Use them in your own Recharts charts to match. |
| height | number |  | 240 (Donut 220). Values / width / height for Sparkline. |
