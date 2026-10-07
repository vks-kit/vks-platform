# Time picker

> 24 h only. Tap an hour, then :00 / :15 / :30 / :45. TimeRangePicker adds a shift's end, a 24 h bar and length presets (12 / 8 ຊມ / ອື່ນໆ); overnight shows +1 ມື້. Popover on desktop, sheet on phone.

- Group: Dates · New
- Source: `packages/ui/src/components/time-picker.tsx`
- Live docs: #/docs/time-picker

```ts
import { TimePicker, TimeRangePicker, timeToMin, minToTime, spanMin, isHHMM } from "@vks-kit/ui"
```

## When to use

- **TimePicker**: Use for one clock time picked by tapping (meeting, visit, report time): hour grid + :00/:15/:30/:45, popover on desktop, sheet on phone. For a shift (start → end) use TimeRangePicker; for typing a time use TimeInput.
- **TimeRangePicker**: Use for a shift's start and end time (24 h, may cross midnight, "+1 ມື້" on the end field): 24 h bar, length presets (12 / 8 ຊມ / ອື່ນໆ), hour grid, minute row. For one clock time use TimePicker; for a date span use DateRangePicker.

## Example

```tsx
const [v, setV] = useState({ s: "18:00", e: "06:00" })   // "HH:MM", 24 h
<TimeRangePicker starts={v.s} ends={v.e} onChange={(s, e) => setV({ s, e })} />
```

### One time (TimePicker)

A meeting or visit time. Picking a minute closes the panel.

```tsx
const [t, setT] = useState("09:30")
<Label htmlFor="mt">ເວລາ</Label>
<TimePicker id="mt" value={t} onChange={setT} />
```

### Other lengths

presets are hours. Picking a start keeps the current length, then moves on to ເລີກ.

```tsx
<TimeRangePicker starts={s} ends={e} onChange={set} presets={[12, 8, 6]} />
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| value (TimePicker) | string |  | "HH:MM" or "" (shows --:--). |
| onChange (TimePicker) | (v: string) => void |  |  |
| starts / ends | string |  | "HH:MM". ends < starts means the shift crosses midnight. |
| onChange (TimeRangePicker) | (starts: string, ends: string) => void |  | Both values every time (a length preset moves the end). |
| presets | number[] | [12, 8] | Shift lengths in hours, plus ອື່ນໆ. |
| labels | boolean | true | Show ເລີ່ມ / ເລີກ labels over the two fields. |
| id | string |  | TimePicker: the field id. TimeRangePicker: fields get id-start / id-end. |
| invalid | boolean |  | Red border (TimeRangePicker: the end field). |

## Notes

- Shifts are named by their time only (06:00–18:00); never add a day/night word. Group lengths 12 / 8 / ອື່ນໆ.
- Inside a Dialog on a phone the panel is a pushed view in the same sheet (no sheet on a sheet).
- Keyboard: arrows move across the hour grid, Enter picks. To type a time instead, use TimeInput (Input types).
- Helpers: timeToMin, minToTime (wraps past midnight), spanMin (overnight aware), spanSegments, hourInSpan, isHHMM.
