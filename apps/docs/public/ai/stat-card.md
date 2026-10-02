# Stat card

> Dashboard KPI tile: number, coloured delta and a drawn-in trend line.

- Group: Data display · New
- Source: `packages/ui/src/components/desktop-kit.tsx`
- Live docs: #/docs/stat-card

```ts
import { StatCard, TrendLine } from "@vks-kit/ui"
```

## When to use

- **StatCard**: Dashboard KPI tile: label, big number, delta vs last period, optional sparkline. goodWhen="down" for metrics where lower is better (late check-ins, incidents). On phones it becomes a compact row (icon, label + number, delta + trend) so four tiles fit one screen; layout="card" forces the tall tile, layout="row" forces the row. flush drops the card chrome so rows form one full-width grouped list.
- **TrendLine**: Tiny inline SVG trend line (no chart library).

## Example

```tsx
<StatCard label="ມາຊ້າ" value="7" delta={-22} goodWhen="down" tone="warning" trend={[12, 11, 9, 7]} />
```

### Trend line alone

The drawn-in line from StatCard, for table cells or custom tiles. For axes and tooltips use @vks-kit/ui/charts.

```tsx
<TrendLine data={[12, 11, 9, 10, 8, 9, 7]} />
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| flush | boolean | false | Phone row only: no border or radius, so rows form one full-width grouped list. Wrap them in a bg-card border-y container. |
| layout | 'auto'\|'card'\|'row' | "auto" | auto = row on phones, card elsewhere. |
| goodWhen | 'up'\|'down' | "up" | Which direction is green. |
| tone | 'primary'\|'success'\|'warning'\|'destructive' | "primary" |  |

## Notes

- On phones (≤768 px) it turns into a compact row: icon, label + number, delta chip and a small trend on the right. A 4-tile summary then fits one screen instead of four tall cards. layout="card" or "row" overrides the automatic choice.
