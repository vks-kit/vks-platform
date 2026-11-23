# Time picker

> 24 h, Google Calendar style: type a time (6, 1830, 18:30) or pick from a list every 30 minutes that opens on the current value. TimeRangePicker's end list starts after the start and shows each length (12 ຊມ · +1 ມື້); length chips 12 / 8 ຊມ under the fields. Dropdown on desktop, bottom-sheet list on phone.

- Group: Dates · New
- Source: `packages/ui/src/components/time-picker.tsx`
- Live docs: #/docs/time-picker

```ts
import { TimePicker, TimeRangePicker, timeToMin, minToTime, spanMin, isHHMM, parseTimeText, timeSteps } from "@vks-kit/ui"
```

## When to use

- **TimePicker**: Use for one clock time (meeting, visit, report time): a field you can type into ("930", "18:30") with a dropdown of times every 30 minutes that opens on the current value; a bottom sheet list on phone. For a shift (start → end) use TimeRangePicker; for a time inside a dense form row use TimeInput.
- **TimeRangePicker**: Use for a shift's start and end time (24 h, may cross midnight): two fields you can type into or pick from a list; the end list starts after the start and shows each length ("12 ຊມ · +1 ມື້"); the end field shows "+1 ມື້" for an overnight shift and length chips (12 / 8 ຊມ) sit under the fields. For one clock time use TimePicker; for a date span use DateRangePicker.

## Example

```tsx
const [v, setV] = useState({ s: "18:00", e: "06:00" })   // "HH:MM", 24 h
<TimeRangePicker starts={v.s} ends={v.e} onChange={(s, e) => setV({ s, e })} />
```

### One time (TimePicker)

A meeting or visit time. Type 930 + Enter, or pick from the list.

```tsx
const [t, setT] = useState("09:30")
<Label htmlFor="mt">ເວລາ</Label>
<TimePicker id="mt" value={t} onChange={setT} />
```

### Other lengths

presets are hours. Picking a start keeps the current length, then opens ເລີກ.

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
| presets | number[] | [12, 8] | Length chips in hours; [] hides them. |
| step | number | 30 | Minutes between list items (15 for finer). Typing accepts any minute. |
| labels | boolean | true | Show ເລີ່ມ / ເລີກ labels over the two fields. |
| id | string |  | TimePicker: the field id. TimeRangePicker: fields get id-start / id-end. |
| invalid | boolean |  | Red border (TimeRangePicker: the end field). |

## Notes

- Shifts are named by their time only (06:00–18:00); never add a day/night word. Group lengths 12 / 8 / ອື່ນໆ.
- Inside a Dialog on a phone the panel is a pushed view in the same sheet (no sheet on a sheet).
- Keyboard: ↑ ↓ move through the list, Enter picks, Esc puts the old value back. Typed text is read by parseTimeText on Enter or when the field loses focus; a wrong time turns the field red and keeps the old value.
- On a phone the field does not raise the keyboard: a tap opens the list in a bottom sheet (44 px rows).
- Helpers: parseTimeText, timeSteps, timeToMin, minToTime (wraps past midnight), spanMin (overnight aware), isHHMM.
