# KPI hero card

> The phone version of KpiStrip: ONE big number with a trend pill and sparkline, plus up to 3 small figures underneath. Takes about a quarter of the screen instead of the whole first page.

- Group: Data display · New
- Source: `packages/ui/src/components/data-display.tsx`
- Live docs: #/docs/kpi-hero

```ts
import { KpiHero } from "@vks/ui"
```

## When to use

- **KpiHero**: Use at the top of a PHONE dashboard when one number matters most (e.g. today's on-time rate); a KpiStrip of 4 tiles eats the whole first screen on a phone. For 2-6 equal numbers on desktop use KpiStrip instead; for a chart use @vks/ui/charts instead.

## Example

```tsx
<KpiHero label="ຕົງເວລາມື້ນີ້" value="94" unit="%" hint="+2% ຈາກມື້ວານ" tone="success" icon={<ScanLine />}
  spark={[88, 90, 89, 92, 91, 93, 94]}
  secondary={[{ label: "ສະແກນ", value: "2,431" }, { label: "ຊ້າ", value: "18" }, { label: "ພາດ", value: "3" }]} />
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| label / value / unit | string / ReactNode / string |  | The one number that matters. unit = %, ກີບ… |
| hint / trend / tone | string / up \| down \| flat / success \| warning \| danger |  | hint starting with + or - gets an arrow pill automatically. |
| spark | number[] |  | Faint trend line behind the card. |
| secondary | { label; value }[] (max 3) |  | Compact row under a divider. |

## Notes

- Pick ONE hero per screen. Put the rest below as StatCard rows (flush, one full-width grouped list) or in the DateGrid.
