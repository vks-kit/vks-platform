# Charts · Share & compare

> Parts of a whole and comparisons: Donut, RadialBars, Scatter / bubble and Radar. Phone: Donut and RadialBars scale as they are; RadarSeries switches by its own width to a bar-per-axis comparison list, because radar labels collide on a 320 px card (industry practice: radar is desktop, bars are the phone equivalent). Pass compact to force either form.

- Group: Heavy (lazy) · Lazy
- Source: `packages/ui/src/heavy/charts.tsx`
- Live docs: #/docs/charts-share

```ts
import { Donut, RadialBars, ScatterSeries, RadarSeries } from "@vks-kit/ui/charts"
```

## When to use

- **Donut**: Donut with the total (or your own label) in the hole and a legend with percentages. Hover lifts a slice.
- **RadialBars**: Concentric progress rings (Apple-Watch style). value is 0..max (default 100).
- **ScatterSeries**: Scatter / bubble. Each group is one colour; z (optional) sizes the bubbles. Great for "response time vs distance" style questions.
- **RadarSeries**: Use for comparing a few series across 4-8 skills or KPIs; on a narrow box (phone) it turns into comparison bars, because radar labels collide there. Pass compact to force a form.

## Example

```tsx
<Donut data={[{ name: "ສຳເລັດ", value: 82 }, { name: "ຊ້າ", value: 12 }]} centerLabel="ລວມ" />
<RadialBars data={[{ name: "ລາດຕະເວນ", value: 86 }, { name: "ຝຶກອົບຮົມ", value: 64 }]} />
<ScatterSeries groups={[{ name: "ກະເຊົ້າ", data: rows }]} x="km" y="min" z="n" xLabel="ກມ" />
<RadarSeries data={skills} axisKey="s" y={["a", "b"]} max={100} />          // phone: bars per axis
<RadarSeries data={skills} axisKey="s" y={["a", "b"]} compact />            // force the bar form
```

### Motion

Replay to see sweeps, pops and the radar-to-bars switch. Lite / reduced motion shows the finished chart at once.

```tsx
// Charts animate once on mount. Remount (key) to replay.
// Off automatically for prefers-reduced-motion and <html data-perf="lite">.
<BarSeries data={week} x="d" y={["ok", "late"]} />      // nothing to enable
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| Donut | { name; value }[]; centerLabel?; centerValue?; unit? |  | Total (or hovered %) in the hole, legend with percentages. |
| RadialBars | { name; value }[]; max = 100; unit = % |  | Centre shows the average. |
| ScatterSeries | groups: { name; data }[]; x; y; z?; xLabel? |  | z sizes bubbles. |
| RadarSeries | data; axisKey; y[]; max?; compact? |  | Desktop: radar. Narrow box (< 440 px) or compact: one row per axis with a thin bar per series. Legend pills hide series in both forms. |
