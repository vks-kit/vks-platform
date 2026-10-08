# Weekday picker

> Seven 44 px day toggles (ຈ ອ ພ ພຫ ສ ສ ອາ), Monday first. Value is a 7-char mask like "1111100". workDaysText turns a mask into short Lao text.

- Group: Form · New
- Source: `packages/ui/src/components/weekday-picker.tsx`
- Live docs: #/docs/weekday-picker

```ts
import { WeekdayPicker, workDaysText, workDaysCount, WEEKDAYS_LO, WEEKDAY_NAMES_LO } from "@vks-kit/ui"
```

## When to use

- **WeekdayPicker**: Use for picking working days of a shift or schedule as a 7-char Monday-first mask ("1111100"), 44 px day toggles; for one date use DatePicker instead.

## Example

```tsx
const [days, setDays] = useState("1111100")   // Mon-first, "1" = works
<WeekdayPicker value={days} onChange={setDays} />
workDaysText("1111111") // "ທຸກມື້"
workDaysText("1111110") // "ຈ–ສ (6 ມື້)"
workDaysText("1010100") // "ຈ ພ ສ"
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| value / onChange | string / (mask: string) => void |  | 7 chars of 0/1, Monday first. Anything else shows all days off. |
| summary | boolean | true | Muted line under the days: "ຈ–ສ · 5 ມື້". |
| invalid / disabled | boolean |  |  |

## Notes

- ສຸກ and ເສົາ share the initial ສ, so workDaysText only shortens the Mon–Fri and Mon–Sat runs; other sets list the initials.
