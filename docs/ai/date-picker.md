# Date picker

> Lao month names, Monday first. Bottom sheet with a wheel on a phone, calendar popover on desktop.

- Group: Dates · Stable
- Source: `packages/ui/src/components/date-picker.tsx`
- Live docs: #/docs/date-picker

```ts
import { DatePicker, Calendar, DateWheel } from "@vks-kit/ui"
```

## When to use

- **DatePicker**: Same value drives both forms: popover calendar on desktop, wheel bottom-sheet on phone (inside a Dialog/Sheet on phone: a pushed view in the same sheet). For a from–to span use DateRangePicker instead.
- **Calendar**: Month grid. Value is 'YYYY-MM-DD'.
- **DateWheel**: Phone form of the picker: three wheels in a bottom sheet.

## Example

```tsx
const [d, setD] = useState("2026-09-30")   // ISO yyyy-mm-dd, always
<DatePicker value={d} onChange={setD} min="2026-01-01" />
```

### Calendar only

marked puts a gold dot under a day (events, rest days).

```tsx
<Calendar value={d} onChange={setD} marked={["2026-09-12", "2026-09-20"]} />
```

### Wheel only

Thumb-friendly. The phone variant of the picker uses this.

```tsx
<DateWheel value={d} onChange={setD} />
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| value | string |  | ISO date yyyy-mm-dd. |
| onChange | (iso: string) => void |  |  |
| min / max | string |  | ISO bounds; days outside are disabled. |
| placeholder | string | "ເລືອກວັນທີ" |  |
| id | string |  | Pair with a Label. |
