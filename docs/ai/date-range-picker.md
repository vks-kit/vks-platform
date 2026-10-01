# Date range picker

> Report ranges with presets (today, last 7 days, this month…). One month on a phone sheet, two side by side on desktop.

- Group: Dates · New
- Source: `packages/ui/src/components/date-range-picker.tsx`
- Live docs: #/docs/date-range-picker

```ts
import { DateRangePicker, RangeCalendar, formatRange, type Range } from "@vks/ui"
```

## When to use

- **DateRangePicker**: Range field. Desktop: popover with presets + 2 months. Phone: bottom sheet with preset chips + 1 month. Value only changes on Apply.
- **RangeCalendar**: Month grid with a highlighted span. Tap start, tap end. Hover preview on desktop.

## Example

```tsx
const [r, setR] = useState<Range>({ from: "2026-09-10", to: "2026-09-16" })
<DateRangePicker value={r} onChange={setR} />
```

### English presets

```tsx
<DateRangePicker value={r} onChange={setR} lang="en" />
```

### Range calendar (inline)

```tsx
<RangeCalendar value={r} onChange={setR} months={2} />
<p>{formatRange(r)}</p>
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| value | { from?: string; to?: string } |  | Both ISO. to may be missing while the user is still picking. |
| onChange | (r: Range) => void |  |  |
| min / max | string |  |  |
| placeholder | string | "ເລືອກໄລຍະເວລາ" |  |
| lang | "lo" \| "en" | "lo" | Preset labels. |

## Notes

- Helpers in the same package: PRESETS, pickRange, clampRange, daysBetween (inclusive), addDays, inSpan.
