# Slot picker

> Book a day and a time in one place, shown in the form (never a popup on a popup): calendar with a dot on booked days, time slots with a count. Wide forms show the times in 2 rows of 8.

- Group: Dates · New
- Source: `packages/ui/src/components/slot-picker.tsx`
- Live docs: #/docs/slot-picker

```ts
import { SlotPicker, halfHours } from "@vks-kit/ui"
```

## When to use

- **SlotPicker**: Use for booking a day + a time in one place (interviews, visits), shown in place so it never opens a popup on a popup: a month calendar (a gold dot = the day already has bookings) beside the time slots (a small number = bookings at that time). Wide forms put the times in 2 rows of 8. For a free date use DatePicker; for a free time TimePicker.

## Example

```tsx
const TIMES = [...halfHours("08:00", "11:30"), ...halfHours("13:00", "16:30")]
<SlotPicker date={date} time={time} onChange={(d, t) => { setDate(d); setTime(t) }}
  times={TIMES} isOpenDay={isInterviewDay} dayCounts={slots.days} timeCounts={slots.times} />
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| times | string[] |  | Bookable starts (HH:MM). |
| isOpenDay | (iso) => boolean |  | false = closed day (greyed). Default every day open. |
| dayCounts / timeCounts | Record |  | Bookings per day (dot) and per day + time (number). |
| min / hint | string / ReactNode |  | First bookable day (default today); one muted line under the times. |
