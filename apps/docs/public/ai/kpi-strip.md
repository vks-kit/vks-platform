# KPI strip

> Top-of-dashboard numbers for DESKTOP: 4 tiles in a row. On a phone use KpiHero (one hero card), because 4 tiles eat the first screen. Money uses ກີບ, never ₭.

- Group: Data display · New
- Source: `packages/ui/src/components/data-display.tsx`
- Live docs: #/docs/kpi-strip

```ts
import { KpiStrip } from "@vks-kit/ui"
```

## When to use

- **KpiStrip**: Use for a row of 2-6 headline numbers at the top of a dashboard. For one big metric with a trend line use StatCard instead; for a chart use @vks-kit/ui/charts instead.

## Example

```tsx
<KpiStrip items={[
  { label: "ສະແກນມື້ນີ້", value: "2,431", hint: "+12%", tone: "success", icon: <ScanLine />, spark: [12, 18, 15, 22, 34] },
  { label: "ຊ້າ", value: "18", hint: "-4 ຈາກມື້ວານ", tone: "warning", icon: <Clock /> },
  { label: "ເງິນເດືອນ", value: fmtKipShort(482000000), hint: "+3.2%", icon: <Wallet /> },
]} />
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| items | { label; value: ReactNode; hint?; tone?; icon?: ReactNode; trend?: "up" \| "down" \| "flat"; spark?: number[] }[] |  | hint starting with + or - gets an automatic up/down arrow pill. spark draws a faint trend line behind the tile. |
